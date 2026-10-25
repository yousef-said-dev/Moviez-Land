import { dbConnect } from "@/lib/mongodb";
import { NextResponse } from "next/server"
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { passwordHashing } from "@/utils/bcrypt";
import { profileSchema } from "@/utils/schemas";

export async function PUT(request, { params }) {
    try {
        const { id } = await params
        const data = await request.formData()
        const profile = Object.fromEntries(data);



        const validation = profileSchema.safeParse(profile);
        if (!validation.success) {
            const firstError = validation.error?.errors?.[0]?.message || "Invalid input";
            return NextResponse.json({ error: firstError }, { status: 400 });
        }

        await dbConnect();
        let updateData = {};

        if (profile.name) {
            const nameExists = await User.findOne({ name: profile.name, _id: { $ne: id } });
            if (nameExists) {
                return NextResponse.json({ error: 'Name already exists' }, { status: 400 });
            }
            updateData.name = profile.name;
        }

        if (profile.email) {
            const emailExists = await User.findOne({ email: profile.email, _id: { $ne: id } });
            if (emailExists) {
                return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
            }
            updateData.email = profile.email;
        }

        if (profile.password && profile.password === profile.confirmPassword) {
            updateData.password = await passwordHashing(profile.password);
        } else if (profile.password && profile.password !== profile.confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        const imageFile = data.get('profileImg');

        if (imageFile && imageFile.size > 0 && typeof imageFile !== 'string') {
            const currentUser = await User.findById(id);
            if (currentUser?.profileImg && currentUser.profileImg.includes('res.cloudinary.com')) {
                try {
                    const splitUrl = currentUser.profileImg.split('/');
                    const fileName = splitUrl[splitUrl.length - 1].split('.')[0];
                    const publicId = `moviezland_profiles/${fileName}`;
                    await cloudinary.uploader.destroy(publicId);
                } catch (delError) {
                    console.error("Failed to delete old image from Cloudinary:", delError);
                }
            }

            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    resource_type: 'auto',
                    folder: 'moviezland_profiles'
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(buffer);
            });

            updateData.profileImg = uploadResponse.secure_url;
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json({
            message: updateData.password ? 'Password updated, please login again' : 'Profile updated',
            passwordUpdated: updateData.password ? true : false,
            id: user._id,
            email: user.email,
            name: user.name,
            favorites: user.favorites,
            profileImg: user.profileImg
        }, { status: 201 });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
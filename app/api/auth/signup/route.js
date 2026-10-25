import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { passwordHashing } from "@/utils/bcrypt";
import { signupSchema } from "@/utils/schemas";

export async function POST(req) {
    const data = await req.json();
    const { name, email, password } = data;

    const validation = signupSchema.safeParse({ name, email, password });
    if (!validation.success) {
        const firstError = validation.error?.errors?.[0]?.message || "Invalid input";
        return NextResponse.json({ error: firstError }, { status: 400 });
    }

    try {
        await dbConnect();

        const existingUser = await User.findOne({
            $or: [{ name }, { email }]
        });

        if (existingUser) {
            if (existingUser.name === name) {
                return NextResponse.json({ error: 'Name already exists ' }, { status: 400 });
            }
            return NextResponse.json({ error: 'Email already exists ' }, { status: 400 });
        }

        const hashedPassword = await passwordHashing(password);
        const defaultImg = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        const user = new User({ name, email, password: hashedPassword, profileImg: defaultImg });

        await user.save();
        return NextResponse.json({ message: 'User created', id: user._id, email: user.email, name: user.name, favorites: user.favorites, profileImg: user.profileImg }, { status: 201 });
    } catch (err) {
        console.error('auth signup error', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
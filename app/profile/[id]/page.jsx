"use client"
import Image from "next/image"
import { useProvider } from "@/store/Provider"
import { APIRequests } from "@/store/api"
import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { profileSchema } from "@/utils/schemas";
import BackButton from "@/componnets/BackButton";

function Profile() {
    const { user, setUser } = useProvider();
    const { update } = useSession();
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [profileImg, setProfileImg] = useState(user?.profileImg);

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const result = profileSchema.safeParse(data);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);

            const firstError = Object.values(fieldErrors)[0];
            if (firstError) toast.error(firstError[0]);
            return;
        }

        toast.loading("Updating profile...");

        try {
            const response = await APIRequests.UpdateProfile(user?.id, formData);
            toast.dismiss();

            if (response.status === 408 || response.status === 504) {
                toast.error("Request timed out. Please check your internet connection.");
                return;
            }

            if (response.status === 0) {
                toast.error("Network Error. Please check your connection.");
                return;
            }

            if (response.status >= 200 && response.status < 300) {
                if (response.passwordUpdated) {
                    toast.success("Password updated! Please login again.");
                    await signOut({ redirect: true });
                    router.push('/login');
                } else {
                    toast.success("Profile Updated Successfully");
                    const updatedUser = {
                        ...user,
                        name: response.name,
                        email: response.email,
                        favorites: response.favorites,
                        profileImg: response.profileImg,
                    };
                    setUser(updatedUser);
                    await update(updatedUser);
                }
            } else {
                toast.error(response.error || "An unexpected error occurred.");
            }
        } catch (error) {
            toast.dismiss();
            console.error("Profile update error:", error);
            toast.error("An unexpected error occurred.");
        }
    }

    return (
        <div className="relative w-full">
            <div className="pt-8 px-6 md:px-12 relative z-50">
                <BackButton />
            </div>
            <form onSubmit={handleSubmit} className="flex items-center flex-col gap-2 mt-20 w-full min-h-screen">
                <div className="flex items-center flex-col gap-2 w-full h-full pt-10">
                    <label htmlFor="profileImg" className="relative group cursor-pointer w-[200px] aspect-square rounded-full overflow-hidden shadow-2xl ring-4 ring-blue-500/20">
                        <Image
                            src={profileImg || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt="Profile"
                            className="object-cover w-full h-full"
                            width={200}
                            height={200}
                            priority
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white font-semibold">Edit Photo</span>
                        </div>
                    </label>
                    <input type="file" name="profileImg" id="profileImg" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                                setProfileImg(reader.result);
                            }
                        }
                    }} className="hidden" />

                    <div className="w-full flex flex-col items-center mt-8">
                        <input name="name" defaultValue={user?.name} id="name" type="text" placeholder="Name" className={`w-[90%] md:w-[50%] text-center text-white bg-transparent border-b-2 ${errors.name ? 'border-red-500' : 'border-blue-800'} outline-none py-2 transition-colors focus:border-blue-500`} />
                        {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name[0]}</span>}
                    </div>

                    <div className="w-full flex flex-col items-center mt-4">
                        <input name="email" defaultValue={user?.email} id="email" type="text" placeholder="Email" className={`w-[90%] md:w-[50%] text-center text-white bg-transparent border-b-2 ${errors.email ? 'border-red-500' : 'border-blue-800'} outline-none py-2 transition-colors focus:border-blue-500`} />
                        {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email[0]}</span>}
                    </div>

                    <div className="w-full flex flex-col items-center mt-4">
                        <input name="password" id="password" type="password" placeholder="New Password" className={`w-[90%] md:w-[50%] text-center text-white bg-transparent border-b-2 ${errors.password ? 'border-red-500' : 'border-blue-800'} outline-none py-2 transition-colors focus:border-blue-500`} />
                        {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password[0]}</span>}
                    </div>

                    <div className="w-full flex flex-col items-center mt-4">
                        <input name="confirmPassword" id="confirmPassword" type="password" placeholder="Confirm Password" className={`w-[90%] md:w-[50%] text-center text-white bg-transparent border-b-2 ${errors.confirmPassword ? 'border-red-500' : 'border-blue-800'} outline-none py-2 transition-colors focus:border-blue-500`} />
                        {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword[0]}</span>}
                    </div>

                    <input name="submit" id="submit" type="submit" value="Update Profile" className="mt-10 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl cursor-pointer hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300" />
                </div>
            </form>
        </div>
    )
}

export default Profile;
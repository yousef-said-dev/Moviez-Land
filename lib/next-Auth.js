import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { passwordCompare } from "@/utils/bcrypt"
import User from "@/models/User"
import { dbConnect } from "@/lib/mongodb"

class CustomAuthError extends CredentialsSignin {
    constructor(message) {
        super(message);
        this.code = message;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        }),
        GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    throw new CustomAuthError("Email and password are required.")
                }

                await dbConnect();
                const user = await User.findOne({ email: credentials.email })

                if (!user) {
                    throw new CustomAuthError("Email not found")
                }

                const isPasswordMatch = await passwordCompare(credentials.password, user.password)

                if (!isPasswordMatch) {
                    throw new CustomAuthError("Incorrect password")
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    favorites: user.favorites ? JSON.parse(JSON.stringify(user.favorites)) : [],
                    profileImg: user.profileImg
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "github" || account?.provider === "google") {
                await dbConnect();
                const existingUser = await User.findOne({ email: user.email });

                if (existingUser) {

                    if (!existingUser.profileImg || existingUser.profileImg.includes('cdn-icons-png')) {
                        existingUser.profileImg = user.image;
                        await existingUser.save();
                    }
                    user.id = existingUser._id.toString();
                    user.favorites = existingUser.favorites;
                    user.profileImg = existingUser.profileImg;
                } else {
                    const newUser = await User.create({
                        name: user.name,
                        email: user.email,
                        profileImg: user.image,
                        favorites: [],
                    });
                    user.id = newUser._id.toString();
                    user.favorites = [];
                    user.profileImg = newUser.profileImg;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session, account }) {
            if (user) {
                token.id = user.id;
                token.favorites = user.favorites;
                token.profileImg = user.profileImg || user.image;
            }
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                if (session.email) token.email = session.email;
                if (session.profileImg) token.profileImg = session.profileImg;
                if (session.favorites) token.favorites = session.favorites;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.favorites = token.favorites;
                session.user.profileImg = token.profileImg;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.AUTH_SECRET,
})

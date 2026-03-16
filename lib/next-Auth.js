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
            authorization: {
                params: {
                    scope: 'read:user user:email',
                },
            },
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

                if (!user.password) {
                    throw new CustomAuthError("This account uses Google or GitHub login. Please sign in with those instead.")
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
                try {
                    await dbConnect();
                    const userEmail = user.email || profile?.email;

                    if (!userEmail) {
                        console.error("Sign-in failed: No email provided by OAuth provider.");
                        return false;
                    }

                    const existingUser = await User.findOne({ email: userEmail });

                    if (existingUser) {
                        if (!existingUser.profileImg || existingUser.profileImg.includes('cdn-icons-png')) {
                            existingUser.profileImg = user.image;
                            await existingUser.save();
                        }
                    } else {
                        await User.create({
                            name: user.name || profile?.login || "User",
                            email: userEmail,
                            profileImg: user.image,
                            favorites: [],
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Database error during sign-in:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session, account }) {
            // Credentials login: account is null in NextAuth v5
            if (user && account === null) {
                token.id = user.id ?? token.id;
                token.name = user.name ?? token.name;
                token.email = user.email ?? token.email;
                token.favorites = user.favorites ?? [];
                token.profileImg = user.profileImg ?? null;
            }

            if (user && (account?.provider === "github" || account?.provider === "google")) {
                try {
                    await dbConnect();
                    const dbUser = await User.findOne({ email: user.email }).lean();
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.favorites = dbUser.favorites ? JSON.parse(JSON.stringify(dbUser.favorites)) : [];
                        token.profileImg = dbUser.profileImg || user.image;
                    }
                } catch (error) {
                    console.error("JWT callback DB error:", error);
                    token.favorites = [];
                    token.profileImg = user.image;
                }
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
                session.user.id = token.id ?? null;
                session.user.name = token.name ?? session.user.name;
                session.user.email = token.email ?? session.user.email;
                session.user.favorites = token.favorites ?? [];
                session.user.profileImg = token.profileImg ?? null;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.AUTH_SECRET,
})

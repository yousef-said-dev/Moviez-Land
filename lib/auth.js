import { betterAuth } from "better-auth/*";
import mongodbAdapter from "better-auth/mongodb-adapter";
import User from "@/models/User";

export const auth = betterAuth({
    database : mongodbAdapter(User),
    emailAndPassword:   {
        enabled : true,
    }

});
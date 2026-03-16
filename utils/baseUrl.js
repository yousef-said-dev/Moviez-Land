export const getBaseUrl = () => {
    if (typeof window !== "undefined") return "";

    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

    return process.env.BASE_API_URL || "http://localhost:3000";
};

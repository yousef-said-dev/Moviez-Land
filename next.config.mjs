/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'placehold.co',
            },
            {
                hostname: 'image.tmdb.org',
            },

        ]
    }
};

export default nextConfig;

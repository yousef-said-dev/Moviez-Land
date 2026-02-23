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
            {
                hostname: 'cdn-icons-png.flaticon.com',
            },
            {
                hostname: 'res.cloudinary.com',
            }
        ]
    },
    experimental: {
        optimizePackageImports: ['lucide-react', 'react-icons'],
    },
};

export default nextConfig;


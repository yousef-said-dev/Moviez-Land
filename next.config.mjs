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
            },
            {
                hostname: 'avatars.githubusercontent.com',
            }
        ]
    },
    experimental: {
        optimizePackageImports: ['lucide-react', 'react-icons'],
    },
};

export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'images.unsplash.com',
            'via.placeholder.com',
            // Add e-commerce image domains here when integrating real APIs
            // 'images-na.ssl-images-amazon.com',
            // 'rukminim2.flixcart.com',
        ],
    },
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Webpack configuration to handle cheerio's dependencies
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                'undici': false,
            };
        }
        return config;
    },
}

module.exports = nextConfig

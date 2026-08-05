/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pancham-khaitan.s3.ap-south-1.amazonaws.com",
                pathname: "/portfolio/images/**",
            },
            {
                protocol: "https",
                hostname: "assets.sunchay.com",
                pathname: "/private/uploads/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/photo-*",
            },
            {
                protocol: "https",
                hostname: "qph.cf2.quoracdn.net",
                pathname: "/main-qimg-b9cd01591303fe0505f967efb5406d4a-lq",
            },
        ],
    },
};

module.exports = nextConfig;

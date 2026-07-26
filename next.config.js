/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
            {
                protocol: "https",
                hostname: "pbs.twimg.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "substackcdn.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "*.substackcdn.com",
                pathname: "/**",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                ],
            },
        ];
    },
};

module.exports = nextConfig;

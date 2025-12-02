import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get("title") || "Pancham Khaitan";

    // Load Geist fonts from jsDelivr CDN
    const [geistSans, geistMono] = await Promise.all([
        fetch(
            "https://cdn.jsdelivr.net/npm/geist@1.4.2/dist/fonts/geist-sans/Geist-Regular.ttf",
        ).then((res) => res.arrayBuffer()),
        fetch(
            "https://cdn.jsdelivr.net/npm/geist@1.4.2/dist/fonts/geist-mono/GeistMono-Bold.ttf",
        ).then((res) => res.arrayBuffer()),
    ]);

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "#0A192F",
                    padding: "100px 60px",
                }}
            >
                <p
                    style={{
                        color: "white",
                        fontSize: "36px",
                        fontWeight: 700,
                        fontFamily: "Geist Mono",
                        margin: 0,
                    }}
                >
                    Pancham Khaitan
                </p>

                <h1
                    style={{
                        color: "white",
                        fontSize: "72px",
                        fontFamily: "Geist",
                        fontWeight: 400,
                        maxWidth: "85%",
                        margin: 0,
                        lineHeight: 1.15,
                    }}
                >
                    {title}
                </h1>
            </div>
        ),
        {
            width: 1280,
            height: 720,
            fonts: [
                {
                    name: "Geist",
                    data: geistSans,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "Geist Mono",
                    data: geistMono,
                    weight: 700,
                    style: "normal",
                },
            ],
        },
    );
}

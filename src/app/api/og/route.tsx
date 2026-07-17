import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get("title") || "Pancham Khaitan";
    const label = searchParams.get("label") || "panchamkhaitan.com";

    const geistMono = await fetch(
        "https://cdn.jsdelivr.net/npm/geist@1.4.2/dist/fonts/geist-mono/GeistMono-Regular.ttf",
    ).then((res) => res.arrayBuffer());

    const geistMonoBold = await fetch(
        "https://cdn.jsdelivr.net/npm/geist@1.4.2/dist/fonts/geist-mono/GeistMono-Bold.ttf",
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "#f7f4ee",
                    color: "#2a241c",
                    padding: "72px 80px",
                    fontFamily: "Geist Mono",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 56,
                            height: 56,
                            backgroundColor: "#2a241c",
                            color: "#f7f4ee",
                            fontSize: 22,
                            fontFamily: "Geist Mono Bold",
                            letterSpacing: "0.04em",
                        }}
                    >
                        pk
                    </div>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 22,
                            color: "#8a7f72",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                        }}
                    >
                        {label}
                    </p>
                </div>

                <h1
                    style={{
                        margin: 0,
                        fontSize: title.length > 48 ? 52 : 64,
                        fontFamily: "Geist Mono Bold",
                        fontWeight: 700,
                        lineHeight: 1.15,
                        letterSpacing: "-0.03em",
                        maxWidth: "92%",
                    }}
                >
                    {title}
                </h1>

                <p
                    style={{
                        margin: 0,
                        fontSize: 22,
                        color: "#8a7f72",
                    }}
                >
                    Pancham Khaitan · Software engineer
                </p>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "Geist Mono",
                    data: geistMono,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "Geist Mono Bold",
                    data: geistMonoBold,
                    weight: 700,
                    style: "normal",
                },
            ],
        },
    );
}

import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/** Adobe Source Serif 4 TTFs — classic editorial voice for social cards */
const SOURCE_SERIF_REGULAR =
    "https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4-Regular.ttf";
const SOURCE_SERIF_BOLD =
    "https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4-Bold.ttf";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get("title") || "Pancham Khaitan";
    const label = searchParams.get("label") || "panchamkhaitan.com";

    const [serifRegular, serifBold] = await Promise.all([
        fetch(SOURCE_SERIF_REGULAR).then((res) => res.arrayBuffer()),
        fetch(SOURCE_SERIF_BOLD).then((res) => res.arrayBuffer()),
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
                    backgroundColor: "#f7f4ee",
                    color: "#2a241c",
                    padding: "72px 80px",
                    fontFamily: "Source Serif 4",
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
                            fontFamily: "Source Serif 4 Bold",
                            letterSpacing: "0.02em",
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
                        fontFamily: "Source Serif 4 Bold",
                        fontWeight: 700,
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
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
                    name: "Source Serif 4",
                    data: serifRegular,
                    weight: 400,
                    style: "normal",
                },
                {
                    name: "Source Serif 4 Bold",
                    data: serifBold,
                    weight: 700,
                    style: "normal",
                },
            ],
        },
    );
}

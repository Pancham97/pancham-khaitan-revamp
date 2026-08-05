import { ImageResponse } from "next/og";

export const alt = "Pancham Khaitan — Software engineer";
export const dynamic = "force-static";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
                    fontFamily: "Georgia, serif",
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
                        panchamkhaitan.com
                    </p>
                </div>

                <h1
                    style={{
                        margin: 0,
                        fontSize: 68,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                    }}
                >
                    Pancham Khaitan
                </h1>

                <p
                    style={{
                        margin: 0,
                        fontSize: 22,
                        color: "#8a7f72",
                    }}
                >
                    Software engineer · India
                </p>
            </div>
        ),
        size,
    );
}

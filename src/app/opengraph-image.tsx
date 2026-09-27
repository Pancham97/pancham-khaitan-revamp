import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

export const alt = `${SITE.name} — ${SITE.title} at ${SITE.org}`;
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
                    backgroundColor: "#111216",
                    color: "#f2f1ee",
                    padding: "72px 80px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 26,
                        color: "#9a9ca6",
                    }}
                >
                    <div style={{ display: "flex", color: "#f2f1ee" }}>pk</div>
                    <div style={{ display: "flex" }}>panchamkhaitan.com</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            fontSize: 88,
                            fontWeight: 600,
                            lineHeight: 1,
                            letterSpacing: "-0.04em",
                        }}
                    >
                        {SITE.name}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: 26,
                        color: "#9a9ca6",
                    }}
                >
                    {SITE.title} at {SITE.org}
                </div>
            </div>
        ),
        size,
    );
}

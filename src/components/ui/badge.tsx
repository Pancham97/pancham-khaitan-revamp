import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    `
                      inline-flex items-center rounded-full px-2.5 py-0.5
                      text-xs font-semibold transition-colors
                    `,
                    {
                        "bg-black text-white hover:bg-gray-800":
                            variant === "default",
                        "bg-gray-100 text-gray-900 hover:bg-gray-200":
                            variant === "secondary",
                        "border border-gray-200 text-gray-700 hover:bg-gray-100":
                            variant === "outline",
                    },
                    className,
                )}
                {...props}
            />
        );
    },
);
Badge.displayName = "Badge";

export { Badge };

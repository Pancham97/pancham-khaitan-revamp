import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "success" | "warning" | "destructive";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="alert"
                className={cn(
                    "relative w-full rounded-lg border p-4",
                    {
                        "bg-white text-slate-950 border-slate-200":
                            variant === "default",
                        "bg-neutral-100 text-neutral-900 border-neutral-200":
                            variant === "success",
                        "bg-yellow-50 text-yellow-900 border-yellow-200":
                            variant === "warning",
                        "bg-red-50 text-red-900 border-red-200":
                            variant === "destructive",
                    },
                    className,
                )}
                {...props}
            />
        );
    },
);
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            `
              text-sm
              [&_p]:leading-relaxed
            `,
            className,
        )}
        {...props}
    />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };

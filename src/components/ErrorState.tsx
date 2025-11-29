import React from "react";

interface ErrorStateProps {
    error: Error | null;
}

export default function ErrorState({ error }: ErrorStateProps) {
    return (
        <div className="error-state">
            <h2>Oops! Something went wrong</h2>
            <p>
                {error?.message ||
                    "An unexpected error occurred. Please try again later."}
            </p>
        </div>
    );
}

"use client";

import { useState } from "react";

export default function ErrorTestButton() {
    console.log("ErrorTestButton: Component loaded and rendered");

    const [error, setError] = useState<boolean>(false);

    if (error) {
        throw new Error("Test error for ErrorBoundary testing!");
    }

    function handleClick() {
        setError(true);
    }

    return (
        <button
            onClick={handleClick}
            className="fixed top-4 right-4 z-50 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            style={{ position: "fixed" }}
        >
            🧪 Test Error
        </button>
    );
}

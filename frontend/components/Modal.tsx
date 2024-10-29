import React from "react";
import Card from "./Card";

export default function Modal({
    children,
    hidden = false,
}: {
    children: React.ReactNode;

    hidden?: boolean;
}) {
    return (
        <div
            id="popup-modal"
            tabIndex={-1}
            className={`fixed ${hidden ? "hidden" : ""} inset-0 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-2 bg-opacity-75`}
        >
            <Card shadow={false}>{children}</Card>
        </div>
    );
}

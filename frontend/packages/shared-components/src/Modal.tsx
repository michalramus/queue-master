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
            className={`fixed ${hidden ? "hidden" : ""} bg-gray-1/85 inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto`}
        >
            <Card shadow={false}>{children}</Card>
        </div>
    );
}

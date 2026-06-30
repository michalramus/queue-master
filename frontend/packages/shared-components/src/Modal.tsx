import React from "react";
import Card from "./Card";

export default function Modal({
    children,
    hidden = false,
    color = "secondary",
    transparent = false,
}: {
    children: React.ReactNode;
    hidden?: boolean;
    color?: "secondary" | "background";
    transparent?: boolean;
}) {
    return (
        <div
            id="popup-modal"
            tabIndex={-1}
            className={`fixed ${hidden ? "hidden" : ""} bg-gray-1/85 inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto`}
        >
            {transparent ? (
                children
            ) : (
                <Card color={color} shadow={false} className="p-0!">
                    {children}
                </Card>
            )}
        </div>
    );
}

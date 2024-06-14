import { ReactNode } from "react";

interface NumberGetterButtonProps {
    children: ReactNode;
    onClick: (category: string) => void;
    category: string;
}

export default function NumberGetterButton({
    children,
    onClick,
    category,
}: NumberGetterButtonProps) {
    return (
        <button
            onClick={() => {
                onClick(category);
            }}
            className="m-3 w-full rounded-full border-2 bg-white bg-opacity-5 p-6 text-center text-2xl hover:bg-opacity-15"
        >
            {children}
        </button>
    );
}

"use client";

import { ReactNode } from "react";
import * as clientsApi from "@/api/clients";

interface NumberGetterButtonProps {
    children: ReactNode;
    category: string;
}

async function handleNumberGetterButtonClick(category: string) {
    let res = await clientsApi.addClient(category);
    console.log(res);

    if (res != null) {
        alert(res.number);
    }
}

export default function NumberGetterButton({
    children,
    category,
}: NumberGetterButtonProps) {
    return (
        <button
            onClick={() => {
                handleNumberGetterButtonClick(category);
            }}
            className="m-3 w-full rounded-full border-2 bg-white bg-opacity-5 p-6 text-center text-2xl hover:bg-opacity-15"
        >
            {children}
        </button>
    );
}

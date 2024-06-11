"use client";

import Header from "@/components/header";
import GetNumButton from "./getNumButton";
import * as clientsApi from "@/api/clients";

function reqForNum(category: string) {
    let res = clientsApi.addClient(category);
    console.log(res);
    alert(res.number);
}

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <Header>Queue System</Header>

            <div className="mt-20 flex w-full flex-col items-center">
                <GetNumButton category="Cat 1" onClick={reqForNum}>
                    Cat 1
                </GetNumButton>
                <GetNumButton category="Category 15" onClick={reqForNum}>
                    Category 15
                </GetNumButton>
                <GetNumButton category="XXX  ąć" onClick={reqForNum}>
                    XXX ąć
                </GetNumButton>
                <GetNumButton category="abaca" onClick={reqForNum}>
                    abaca
                </GetNumButton>
            </div>
        </main>
    );
}

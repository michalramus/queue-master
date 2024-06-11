"use client";

import Header from "@/components/header";
import GetNumButton from "./getNumButton";

function reqForNum(category: string) {
  fetch( process.env.API + "/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ category: category }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      window.alert(data.number);
    })
    .catch((error) => console.log(error));
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

import Header from "@/components/Header";
import NumberGetterButton from "./NumberGetterButton";

export default function KioskPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <Header>Queue System</Header>

            <div className="mt-20 flex w-full flex-col items-center">
                <NumberGetterButton category="Cat 1">Cat 1</NumberGetterButton>
                <NumberGetterButton category="Category 15">
                    Category 15
                </NumberGetterButton>
                <NumberGetterButton category="XXX  ąć">
                    XXX ąć
                </NumberGetterButton>
                <NumberGetterButton category="abaca">abaca</NumberGetterButton>
            </div>
        </main>
    );
}

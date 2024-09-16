import Image from "next/image";

export default function Header() {
    return (
        <div>
            <div className="flex w-full items-center justify-center font-semibold">
                <p className="text-6xl">Queue</p>
                <Image src="/logo.svg" alt="logo" height={96} width={96} className="mx-2"></Image>
                <p className="text-6xl">System</p>
            </div>
            <p className="text-right text-xl">By Michał Ramus</p>
        </div>
    );
}

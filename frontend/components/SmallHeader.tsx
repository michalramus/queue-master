import Image from "next/image";

export default function SmallHeader() {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center font-semibold">
                <p className="text-xl">Queue</p>
                <Image src="/logo.svg" alt="logo" height={48} width={48} className="mx-1"></Image>
                <p className="text-xl">System</p>
            </div>
            <p className="mt-2 text-base">Michał Ramus</p>
        </div>
    );
}

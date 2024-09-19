import Image from "next/image";

export default function Header({
    className,
}: {
    className?: React.ComponentProps<"div">["className"];
}) {
    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div>
                <div className="flex items-center justify-center font-semibold">
                    <p className="text-6xl">Queue</p>
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        height={96}
                        width={96}
                        className="mx-2"
                    ></Image>
                    <p className="text-6xl">System</p>
                </div>
                <p className="text-right text-xl">By Michał Ramus</p>
            </div>
        </div>
    );
}

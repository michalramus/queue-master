import Logo from "./svg/logo";

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
                    <Logo width={96} height={96} className="mx-2" />
                    <p className="text-6xl">Master</p>
                </div>
                <p className="text-right text-xl">By Michał Ramus</p>
            </div>
        </div>
    );
}

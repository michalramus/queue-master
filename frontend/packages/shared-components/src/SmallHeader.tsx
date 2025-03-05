import Logo from "./svg/Logo";

export default function SmallHeader() {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center font-semibold">
                <p className="text-xl">Queue</p>
                <Logo width={48} height={48} className="mx-1" />
                <p className="text-xl">Master</p>
            </div>
            <p className="mt-2 text-base">Michał Ramus</p>
        </div>
    );
}

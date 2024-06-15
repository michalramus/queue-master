interface CurrentNumberWidgetProps {
    number: number | string;
    seat: number | string;
}

export default function CurrentNumberWidget({
    number,
    seat,
}: CurrentNumberWidgetProps) {
    return (
        <div className="w-full rounded-md border-2 bg-white bg-opacity-5 p-6 text-center lg:w-6/12">
            <h1 className="pb-5 text-5xl">
                Current number: <span className="font-bold">{number}</span>
            </h1>
            <p className="text-3xl">Seat: {seat}</p>
        </div>
    );
}

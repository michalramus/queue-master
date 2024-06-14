interface CurrentNumberProps {
    number: number | string;
    position: number | string;
}

export default function CurrentNumber({
    number,
    position,
}: CurrentNumberProps) {
    return (
        <div className="w-full rounded-md border-2 bg-white bg-opacity-5 p-6 text-center lg:w-6/12">
            <h1 className="text-5xl pb-5">Current number: <span className="font-bold">{number}</span></h1>
            <p className="text-3xl">Position: {position}</p>
        </div>
    );
};

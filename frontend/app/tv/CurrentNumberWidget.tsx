import Table from "@/components/Table";

interface CurrentNumberWidgetProps {
    number: number | string;
    seat: number | string;
    className?: React.ComponentProps<'div'>['className'];
}

export default function CurrentNumberWidget({ number, seat, className }: CurrentNumberWidgetProps) {
    console.log(number == "");

    return (
        <div className={`${className}`}>
            <Table
                columns={[<span className="font-light">Number</span>]}
                rows={[[number != "" ? number : <br />]]}
                theadClassName="text-text-1 text-5xl"
                tbodyClassName="text-primary-1 !border-0 text-7xl font-medium"
                className="mb-20"
            />
            <Table
                columns={[<span className="font-light">Seat</span>]}
                rows={[[seat != "" ? seat : <br />]]}
                theadClassName="text-text-1 text-5xl"
                tbodyClassName="text-primary-1 !border-0 text-7xl font-medium"
            />
        </div>
    );
}

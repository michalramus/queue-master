import Table from "@/components/Table";

interface CurrentNumberWidgetProps {
    category_short_name: string;
    number: number | string;
    seat: number | string;
    className?: React.ComponentProps<"div">["className"];
}

export default function CurrentNumberWidget({
    category_short_name,
    number,
    seat,
    className,
}: CurrentNumberWidgetProps) {
    return (
        <div className={`${className}`}>
            <Table
                columns={[
                    <span key={"Number"} className="font-light">
                        Number
                    </span>,
                ]}
                //Generate string in the format of "category_short_name + number" or a line break if number is empty
                rows={[
                    [
                        number != "" ? (
                            (category_short_name ? category_short_name : "") + number
                        ) : (
                            <br />
                        ),
                    ],
                ]}
                theadClassName="text-text-1 text-5xl"
                tbodyClassName="text-primary-1 !border-0 text-7xl font-medium"
                className="mb-20"
            />
            <Table
                columns={[
                    <span key={"Seat"} className="font-light">
                        Seat
                    </span>,
                ]}
                rows={[[seat != "" ? seat : <br />]]}
                theadClassName="text-text-1 text-5xl"
                tbodyClassName="text-primary-1 !border-0 text-7xl font-medium"
            />
        </div>
    );
}

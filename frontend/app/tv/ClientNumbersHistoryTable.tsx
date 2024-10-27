import Table from "@/components/Table";
import { ClientInterface } from "../../utils/api/CSR/clients";
import { ReactNode } from "react";

export default function ClientNumbersHistory({
    clientNumbers,
}: {
    clientNumbers: ClientInterface[];
}) {
    const rows: (string | number | ReactNode | null)[][] = [];
    clientNumbers.map((clientNumber) =>
        rows.push([
            (clientNumber.category?.short_name ? clientNumber.category.short_name : "") +
                clientNumber.number,
            clientNumber.seat,
        ]),
    );

    return (
        <Table
            columns={[
                <span key={"Number"} className="font-light">
                    Number
                </span>,
                <span key={"Seat"} className="font-light">
                    Seat
                </span>,
            ]}
            rows={rows}
            theadClassName="text-4xl"
            tbodyClassName=" text-5xl font-medium"
            tdBodyClassName="py-3"
            className="w-6/12"
        />
    );
}

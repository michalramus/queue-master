import Table from "@/components/Table";
import { ClientNumber } from "../../utils/api/CSR/clients";
import { ReactNode } from "react";

export default function ClientNumbersHistory({ clientNumbers }: { clientNumbers: ClientNumber[] }) {
    const rows: (string | number | ReactNode | null)[][] = [];
    clientNumbers.map((clientNumber) => rows.push([clientNumber.number, clientNumber.seat]));

    return (
        <Table
            columns={[
                <span className="font-light">Number</span>,
                <span className="font-light">Seat</span>,
            ]}
            rows={rows}
            theadClassName="text-4xl"
            tbodyClassName=" text-5xl font-medium"
            tdBodyClassName="py-3"
            className="w-6/12"
        />
    );
}

import { ClientInterface } from "../../utils/api/CSR/clients";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Table } from "shared-components";

export default function ClientNumbersHistory({
    clientNumbers,
}: {
    clientNumbers: ClientInterface[];
}) {
    const t = useTranslations();

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
                    {t("number")}
                </span>,
                <span key={"Seat"} className="font-light">
                    {t("seat")}
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

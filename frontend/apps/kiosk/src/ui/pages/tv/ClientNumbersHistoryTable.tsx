import { ReactNode, useMemo, useRef, useEffect, useState } from "react";
import { Table } from "shared-components";
import { ClientInterface } from "shared-utils";
import { useTranslation } from "react-i18next";

export default function ClientNumbersHistory({
    clientNumbers,
}: {
    clientNumbers: ClientInterface[];
}) {
    const { t } = useTranslation();
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [rowHeight, setRowHeight] = useState<number>(80); // Default fallback

    // Dynamically measure container and row heights
    useEffect(() => {
        const measureHeights = () => {
            if (tableContainerRef.current) {
                const containerRect = tableContainerRef.current.getBoundingClientRect();
                setContainerHeight(containerRect.height);

                // Measure actual row height if rows exist
                const firstRow = tableContainerRef.current.querySelector("tbody tr");
                if (firstRow) {
                    const rowRect = firstRow.getBoundingClientRect();
                    setRowHeight(rowRect.height);
                }
            }
        };

        // Initial measurement
        measureHeights();

        // Re-measure on window resize
        window.addEventListener("resize", measureHeights);

        // Use ResizeObserver for more accurate container size tracking
        const resizeObserver = new ResizeObserver(measureHeights);
        if (tableContainerRef.current) {
            resizeObserver.observe(tableContainerRef.current);
        }

        return () => {
            window.removeEventListener("resize", measureHeights);
            resizeObserver.disconnect();
        };
    }, [clientNumbers.length]); // Re-run when client numbers change

    // Calculate max visible rows based on actual measurements
    const maxVisibleRows = useMemo(() => {
        if (containerHeight === 0 || rowHeight === 0) {
            return 10; // Default fallback
        }

        // Account for header height (measured from table)
        const tableHeader = tableContainerRef.current?.querySelector("thead");
        const headerHeight = tableHeader ? tableHeader.getBoundingClientRect().height : 60;

        const availableHeight = containerHeight - headerHeight;
        const calculatedRows = Math.floor(availableHeight / rowHeight);

        // Ensure we show at least 1 row and don't exceed a reasonable maximum
        return Math.max(1, Math.min(calculatedRows - 1, 20));
    }, [containerHeight, rowHeight]);

    // Trim client numbers to fit screen
    const visibleClientNumbers = useMemo(() => {
        return clientNumbers.slice(0, maxVisibleRows);
    }, [clientNumbers, maxVisibleRows]);

    const rows: (string | number | ReactNode | null)[][] = [];
    visibleClientNumbers.map((clientNumber) =>
        rows.push([
            (clientNumber.category?.short_name ? clientNumber.category.short_name : "") +
                clientNumber.number,
            clientNumber.seat,
        ]),
    );

    return (
        <div ref={tableContainerRef} className="h-full w-6/12">
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
                className="w-full"
            />
        </div>
    );
}

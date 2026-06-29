import { useMemo, useRef, useEffect, useState } from "react";
import { ClientInterface } from "shared-utils";
import { useTranslation } from "react-i18next";

const ANIMATION_DURATION_MS = 400;

export default function ClientNumbersHistory({
    clientNumbers,
}: {
    clientNumbers: ClientInterface[];
}) {
    const { t } = useTranslation();
    const outerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLTableElement>(null);
    const [rowHeight, setRowHeight] = useState<number>(80);
    const [bodyHeight, setBodyHeight] = useState<number>(0);
    const rowHeightRef = useRef<number>(80);

    const [tableOffset, setTableOffset] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayClients, setDisplayClients] = useState<ClientInterface[]>([]);
    const [exitingClientId, setExitingClientId] = useState<number | null>(null);

    const prevVisibleClientsRef = useRef<ClientInterface[]>([]);
    const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        rowHeightRef.current = rowHeight;
    }, [rowHeight]);

    useEffect(() => {
        const measureHeights = () => {
            if (outerRef.current && headerRef.current) {
                const outerHeight = outerRef.current.getBoundingClientRect().height;
                const headerHeight = headerRef.current.getBoundingClientRect().height;
                setBodyHeight(outerHeight - headerHeight);

                const firstRow = outerRef.current.querySelector("tbody tr");
                if (firstRow) {
                    setRowHeight(firstRow.getBoundingClientRect().height);
                }
            }
        };

        measureHeights();
        window.addEventListener("resize", measureHeights);
        const ro = new ResizeObserver(measureHeights);
        if (outerRef.current) ro.observe(outerRef.current);

        return () => {
            window.removeEventListener("resize", measureHeights);
            ro.disconnect();
        };
    }, [clientNumbers.length]);

    const maxVisibleRows = useMemo(() => {
        if (bodyHeight === 0 || rowHeight === 0) return 10;
        const calculatedRows = Math.floor(bodyHeight / rowHeight);
        return Math.max(1, Math.min(calculatedRows - 1, 20));
    }, [bodyHeight, rowHeight]);

    const visibleClientNumbers = useMemo(() => {
        return clientNumbers.slice(0, maxVisibleRows);
    }, [clientNumbers, maxVisibleRows]);

    useEffect(() => {
        const prevVisible = prevVisibleClientsRef.current;

        if (prevVisible.length === 0) {
            setDisplayClients(visibleClientNumbers);
            prevVisibleClientsRef.current = visibleClientNumbers;
            return;
        }

        const newFirstId = visibleClientNumbers[0]?.id ?? null;
        const prevFirstId = prevVisible[0]?.id ?? null;

        if (newFirstId === null || newFirstId === prevFirstId) {
            setDisplayClients(visibleClientNumbers);
            prevVisibleClientsRef.current = visibleClientNumbers;
            return;
        }

        const newVisibleIds = new Set(visibleClientNumbers.map((c) => c.id));
        const exiting = prevVisible.find((c) => !newVisibleIds.has(c.id));

        if (animationTimerRef.current) clearTimeout(animationTimerRef.current);

        setDisplayClients(exiting ? [...visibleClientNumbers, exiting] : [...visibleClientNumbers]);
        setExitingClientId(exiting?.id ?? null);
        setIsAnimating(false);
        setTableOffset(-rowHeightRef.current);

        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                setIsAnimating(true);
                setTableOffset(0);
            }),
        );

        animationTimerRef.current = setTimeout(() => {
            setIsAnimating(false);
            setExitingClientId(null);
            setDisplayClients(visibleClientNumbers);
        }, ANIMATION_DURATION_MS + 50);

        prevVisibleClientsRef.current = visibleClientNumbers;
    }, [visibleClientNumbers]);

    useEffect(() => {
        return () => {
            if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
        };
    }, []);

    return (
        <div ref={outerRef} className="flex h-full w-6/12 flex-col overflow-hidden">
            {/* Header sits outside the clipped body area so rows never overlap it */}
            <table ref={headerRef} className="mx-2 w-full flex-none table-fixed text-center">
                <colgroup>
                    <col className="w-1/2" />
                    <col className="w-1/2" />
                </colgroup>
                <thead className="text-text-2 border-gray-1 text-md border-b-2 text-4xl">
                    <tr>
                        <th scope="col" className="px-6 py-1 font-light">
                            {t("number")}
                        </th>
                        <th scope="col" className="px-6 py-1 font-light">
                            {t("desk")}
                        </th>
                    </tr>
                </thead>
            </table>
            {/* overflow-hidden here is what clips rows above row-0 and below the last visible row */}
            <div className="flex-1 overflow-hidden">
                <table className="mx-2 w-full table-fixed text-center">
                    <colgroup>
                        <col className="w-1/2" />
                        <col className="w-1/2" />
                    </colgroup>
                    <tbody
                        style={{
                            transform: `translateY(${tableOffset}px)`,
                            transition: isAnimating
                                ? `transform ${ANIMATION_DURATION_MS}ms ease-out`
                                : "none",
                        }}
                        className="text-xl font-medium"
                    >
                        {displayClients.map((client) => {
                            const isExiting = client.id === exitingClientId;
                            return (
                                <tr
                                    key={client.id}
                                    style={{
                                        opacity: isExiting && isAnimating ? 0 : 1,
                                        transition: isAnimating
                                            ? `opacity ${ANIMATION_DURATION_MS}ms ease-out`
                                            : "none",
                                    }}
                                    className="border-gray-1 border-opacity-50 border-b-2 text-5xl font-medium"
                                >
                                    <td className="px-6 py-3 text-center align-middle">
                                        {(client.category?.short_name ?? "") + client.number}
                                    </td>
                                    <td className="px-6 py-3 text-center align-middle">
                                        {client.desk?.desk_number ?? ""}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

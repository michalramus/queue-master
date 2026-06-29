import { useState, useEffect, useRef } from "react";
import { Table } from "shared-components";
import { useTranslation } from "react-i18next";

interface CurrentNumberWidgetProps {
    category_short_name: string;
    number: number | string;
    desk: number | string;
    className?: React.ComponentProps<"div">["className"];
}

const TRANSITION_MS = 200;

export default function CurrentNumberWidget({
    category_short_name,
    number,
    desk,
    className,
}: CurrentNumberWidgetProps) {
    const { t } = useTranslation();
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayedNumber, setDisplayedNumber] = useState(number);
    const [displayedDesk, setDisplayedDesk] = useState(desk);
    const [displayedCategory, setDisplayedCategory] = useState(category_short_name);

    // Refs mirror displayed state so the effect doesn't depend on it,
    // preventing cascading re-runs when displayed values update.
    const displayedNumberRef = useRef(number);
    const displayedDeskRef = useRef(desk);
    const displayedCategoryRef = useRef(category_short_name);

    useEffect(() => {
        const hasChanged =
            number !== displayedNumberRef.current ||
            desk !== displayedDeskRef.current ||
            category_short_name !== displayedCategoryRef.current;

        if (!hasChanged) return;

        const fadeOutTimer = setTimeout(() => setIsAnimating(true), 0);
        const updateTimer = setTimeout(() => {
            displayedNumberRef.current = number;
            displayedDeskRef.current = desk;
            displayedCategoryRef.current = category_short_name;
            setDisplayedNumber(number);
            setDisplayedDesk(desk);
            setDisplayedCategory(category_short_name);
            setIsAnimating(false);
        }, TRANSITION_MS);

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(updateTimer);
        };
    }, [number, desk, category_short_name]);

    const numberText =
        displayedNumber !== ""
            ? (displayedCategory ? displayedCategory : "") + displayedNumber
            : "";

    return (
        <div
            className={`transition-opacity duration-300 ease-in-out ${isAnimating ? "opacity-0" : "opacity-100"} ${className}`}
        >
            <Table
                columns={[
                    <span key={"Number"} className="font-light">
                        {t("number")}
                    </span>,
                ]}
                rows={[[numberText !== "" ? numberText : <br />]]}
                theadClassName="text-text-1 text-5xl"
                tbodyClassName="text-text-1 border-0! text-7xl font-semibold"
                className="mb-20"
            />
            <Table
                columns={[
                    <span key={"Desk"} className="font-light">
                        {t("desk")}
                    </span>,
                ]}
                rows={[[displayedDesk !== "" ? displayedDesk : <br />]]}
                theadClassName="text-text-1 text-5xl"
                tbodyClassName="text-text-1 border-0! text-7xl font-semibold"
            />
        </div>
    );
}

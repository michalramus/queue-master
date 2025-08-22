import { useTranslation } from "react-i18next";
import { OpeningHoursDto } from "shared-utils";

interface OpeningHoursWidgetProps {
    openingHours: OpeningHoursDto[];
    className?: string;
    large?: boolean;
}

//TODO: Correct sizes
export default function OpeningHoursWidget({
    openingHours,
    className = "",
    large = false,
}: OpeningHoursWidgetProps) {
    const { t } = useTranslation();
    return (
        <div
            className={`border-primary-1 mx-auto w-full ${
                large ? "max-w-2xl p-8" : "max-w-md p-6"
            } rounded-xl border bg-white shadow-md ${className}`}
        >
            <h2
                className={`text-primary-1 mb-8 text-center font-bold ${
                    large ? "text-4xl" : "text-2xl"
                }`}
            >
                {t("opening_hours")}
            </h2>
            <table className={`w-full ${large ? "text-2xl" : "text-lg"}`}>
                <tbody>
                    {openingHours.map((entry) => (
                        <tr key={entry.day_of_week} className={`border-b last:border-b-0`}>
                            <td
                                className={`text-text-1 w-1/2 text-left font-semibold ${
                                    large ? "py-4 pr-8" : "py-2 pr-4"
                                }`}
                            >
                                {t(`days.${entry.day_of_week.toLowerCase()}`)}
                            </td>
                            <td className={`w-1/2 text-right ${large ? "py-4" : "py-2"}`}>
                                {entry.is_closed ? (
                                    <span className="font-medium text-red-500">{t("closed")}</span>
                                ) : (
                                    <span className="text-text-2">
                                        {entry.open_time} - {entry.close_time}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

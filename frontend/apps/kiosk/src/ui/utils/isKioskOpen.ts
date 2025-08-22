import { OpeningHoursDto } from "shared-utils";

export function isKioskOpen(openingHours: OpeningHoursDto[]): boolean {
    if (!openingHours) return true;
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const today = openingHours.find((entry) => entry.day_of_week === dayOfWeek);
    if (!today || today.is_closed) return false;
    if (!today.open_time || !today.close_time) return false;

    // Compare current time to open/close
    const [openHour, openMinute] = today.open_time.split(":").map(Number);
    const [closeHour, closeMinute] = today.close_time.split(":").map(Number);
    const open = new Date(now);
    open.setHours(openHour, openMinute, 0, 0);
    const close = new Date(now);
    close.setHours(closeHour, closeMinute, 0, 0);
    return now >= open && now <= close;
}

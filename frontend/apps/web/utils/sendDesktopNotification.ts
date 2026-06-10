export function sendDesktopNotification(header: string, body: string): void {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    new Notification(header, { body: body });
}

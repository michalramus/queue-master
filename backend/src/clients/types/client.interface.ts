export interface Client {
    id: number;
    number: number;
    category_id: number;
    category: { id: number; short_name: string; name: string; counter?: number };
    status: "Waiting" | "InService";
    seat: number | null;
    creation_date: Date;
}

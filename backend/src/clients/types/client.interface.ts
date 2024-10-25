interface Client {
    number: string;
    category_id: string;
    category?: { name: string; id?: string };
    status: "Waiting" | "InService";
    seat: number;
    creation_date: Date;
}

import { Category } from "src/categories/types/category.interface";

export interface Client {
    id: number;
    number: number;
    category_id: number;
    category: Category; //name - multilingual text
    status: "Waiting" | "InService";
    seat: number | null;
    creation_date: Date;
    queue_length?: number;
}

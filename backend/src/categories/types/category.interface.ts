export interface Category {
    id: number;
    short_name: string;
    name: { [lang: string]: string }; // MultilingualText
}

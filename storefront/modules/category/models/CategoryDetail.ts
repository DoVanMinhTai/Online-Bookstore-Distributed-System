import { ProductThumbnail } from "@/modules/homepage/models/ProductThumbnail";

export type CategoryDetail = {
    id: number;
    name: string;
    description: string;
    books: ProductThumbnail[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isLast: boolean;
};

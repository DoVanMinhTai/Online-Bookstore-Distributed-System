import apiClientService from "@/common/components/services/ApiClientService";
import { ApiRoute } from "@/constants/ApiRoute";
import { Category } from "../models/Category";
import { CategoryDetail } from "../models/CategoryDetail";

export async function getCategories(): Promise<Category[]> {
    const response = await apiClientService.get(ApiRoute.CATEGORY.GET_CATEGORIES);
    if (!response.ok) {
        throw new Error("Fetch categories error");
    }
    return response.json();
}

export async function getCategoryById(id: number | string): Promise<Category> {
    const response = await apiClientService.get(ApiRoute.CATEGORY.GET_CATEGORY_BY_ID(id));
    if (!response.ok) {
        throw new Error("Fetch category error");
    }
    return response.json();
}

export async function getBooksByCategory(
    id: number | string,
    pageNo = 0,
    pageSize = 12
): Promise<CategoryDetail> {
    const response = await apiClientService.get(
        ApiRoute.CATEGORY.GET_BOOKS_BY_CATEGORY(id, pageNo, pageSize)
    );
    if (!response.ok) {
        throw new Error("Fetch books by category error");
    }
    return response.json();
}

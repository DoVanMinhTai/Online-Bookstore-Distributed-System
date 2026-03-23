import apiClientService from "@/common/components/services/ApiClientService";
import { ProductThumbnail } from "@/modules/homepage/models/ProductThumbnail";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/storefront`;

export async function getProductById(ids: number[]): Promise<ProductThumbnail[]> {
    const reponse = await apiClientService.get(`${baseUrl}/product/listProduct?productIds=${ids}`);
    if (!reponse.ok) {
        throw new Error("Fetch api error")
    }
    return reponse.json();
}
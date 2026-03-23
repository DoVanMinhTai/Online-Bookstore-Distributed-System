import { ProductBestSeller } from "../models/ProductBestSeller";
import apiClientService from "@/common/components/services/ApiClientService";
import { ProductFeature } from "../models/ProductFeature";
import { useApiRequest, UseApiRequestResult } from "@/common/components/services/hook/useApiRequest";
import { ApiRoutes } from "@/constants/ApiRoute";

export async function getProductBestSelling(): Promise<ProductBestSeller> {
    const response = await apiClientService.get(ApiRoutes.PRODUCT.GET_PRODUCT_BEST_SELLING);
    return response.json();
}

export async function getProductFeature(): Promise<ProductFeature> {
    const response = await apiClientService.get(ApiRoutes.PRODUCT.GET_PRODUCT_FEATURE);
    return response.json();
}

export function useGetProductBestSelling(): UseApiRequestResult<ProductBestSeller> {
    return useApiRequest(getProductBestSelling);
}

export function useGetProductFeature(): UseApiRequestResult<ProductFeature> {
    return useApiRequest(getProductFeature);
}
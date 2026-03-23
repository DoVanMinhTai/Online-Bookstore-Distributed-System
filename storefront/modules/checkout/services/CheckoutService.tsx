import apiClientService from "@/common/components/services/ApiClientService";
import { Checkout } from "../models/Checkout";

const baseUrl =  `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/storefront`;

export async function createCheckout(checkout: Checkout): Promise<Checkout | null> {
    const reponse = await apiClientService.post(`${baseUrl}/checkouts`, JSON.stringify(checkout));

    if (reponse.status < 300 && reponse.status >= 200) {
        return await reponse.json();
    } else if (reponse.status === 401) {
        throw new Error(reponse.statusText);
    }
    return null;
}

export async function getCheckoutById(id: string): Promise<Checkout> {
    const reponse = await apiClientService.get(`${baseUrl}/checkouts/${id}`);

    if (reponse.status === 401) {
    }

    if (reponse.status < 300 && reponse.status >= 200) {
        return reponse.json();
    } else {
        throw new Error(reponse.statusText);
    }
}
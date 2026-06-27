import apiClientService from "@/common/components/services/ApiClientService";
import { Address } from "@/modules/address/model/Address";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/storefront`;

export async function getMyProfile() {
    const response = await apiClientService.get(`${baseUrl}/customer/profile`)
    if (!response.ok) {

    } else {
        return response.json();
    }
}

export async function getUserAddressList(): Promise<Address[]> {
    const reponse = await apiClientService.get(`${baseUrl}/getUserAddressList`)
    if (!reponse.ok) {
        return [];
    } else {
        return reponse.json()
    }
}

export async function getAddressDefault(): Promise<Address | null> {
    const reponse = await apiClientService.get(`${baseUrl}/getAddressIsActive`);
    if (!reponse.ok) {
        return null;
    }

    const text = await reponse.text();
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text) as Address;
    } catch (err) {
        console.warn('getAddressDefault: invalid JSON response', err);
        return null;
    }
}

export async function getAddressBillingList(): Promise<Address[]> {
    const reponse = await apiClientService.get(`${baseUrl}/getAddressBillingIsActive`);
    if (!reponse.ok) {
        return [];
    } else {
        return reponse.json();
    }
}


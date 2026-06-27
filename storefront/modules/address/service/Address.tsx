import apiClientService from "@/common/components/services/ApiClientService";
import { AddressGetVm } from "../model/AddressGetVm";
import { AddressPostVm } from "../model/AddressPostVm";
import { useApiRequest, UseApiRequestResult } from "@/common/components/services/hook/useApiRequest";
import { ApiRoute } from "@/constants/ApiRoute";

/**
 * Normalizes form data before sending to the backend.
 * react-hook-form returns string values from <select>/<input>, and empty
 * numeric fields come through as "" which the backend (Long) cannot
 * deserialize, causing a 400/500. This coerces id fields to numbers and
 * drops empty/optional values.
 */
function toAddressPayload(data: Partial<AddressGetVm>) {
    const toNumberOrNull = (value: unknown) => {
        if (value === null || value === undefined || value === '') return null;
        const num = Number(value);
        return Number.isNaN(num) ? null : num;
    };
    const toUndefinedIfEmpty = (value: unknown) =>
        value === null || value === undefined || value === '' ? undefined : value;

    return {
        contactName: data.contactName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: toUndefinedIfEmpty(data.addressLine2),
        city: toUndefinedIfEmpty(data.city),
        zipCode: toUndefinedIfEmpty(data.zipCode),
        districtId: toNumberOrNull(data.districtId),
        stateOrProvinceId: toNumberOrNull(data.stateOrProvinceId),
        countryId: toNumberOrNull(data.countryId),
        addressType: data.addressType,
        isDefault: data.isActive ?? false,
    };
}

export async function createUserAddress(filterdata: AddressGetVm) {
    const response = await apiClientService.post(ApiRoute.ADDRESS.CREATE, JSON.stringify(toAddressPayload(filterdata)));
    if (!response.ok) {
        let message = `Create address failed (${response.status})`;
        try {
            const errorJson = await response.json();
            message = errorJson.message || errorJson.detail || errorJson.title || message;
        } catch {
            // response had no JSON body; keep the default message
        }
        throw new Error(message);
    }
    return response.json();
}

export async function updateUserAddress(id: number, addressPostVm: AddressPostVm) {
    const response = await apiClientService.put(ApiRoute.ADDRESS.UPDATE(id), JSON.stringify(toAddressPayload(addressPostVm as unknown as AddressGetVm)));
    return response.json();
}


export async function getAddressById(id: number): Promise<AddressGetVm> {
    const reponse = await apiClientService.get(ApiRoute.ADDRESS.ADDRESS_BY_ID(id));
    return reponse.json();
}

export function useCreateUserAddress(filterdata: AddressGetVm): UseApiRequestResult<AddressGetVm> {
    return useApiRequest(() => createUserAddress(filterdata), { immediate: false });
}

export function useUpdateUserAddress(id: number, addressPostVm: AddressPostVm): UseApiRequestResult<AddressGetVm> {
    return useApiRequest(() => updateUserAddress(id, addressPostVm), { immediate: false });
}

export function useGetAddressById(id: number): UseApiRequestResult<AddressGetVm> {
    return useApiRequest(() => getAddressById(id));
}


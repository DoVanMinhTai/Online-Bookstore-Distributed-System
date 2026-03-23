import apiClientService from "@/common/components/services/ApiClientService";
import { AddressGetVm } from "../model/AddressGetVm";
import { AddressPostVm } from "../model/AddressPostVm";
import { ApiRoutes } from "@/constants/ApiRoute";
import { useApiRequest, UseApiRequestResult } from "@/common/components/services/hook/useApiRequest";

export async function createUserAddress(filterdata: AddressGetVm) {
    const response = await apiClientService.post(ApiRoutes.ADDRESS.CREATE, JSON.stringify(filterdata));
    return response.json();
}

export async function updateUserAddress(id: number, addressPostVm: AddressPostVm) {
    const response = await apiClientService.put(ApiRoutes.ADDRESS.UPDATE(id), JSON.stringify(addressPostVm));
    return response.json();
}

export async function getAddressById(id: number): Promise<AddressGetVm> {
    const reponse = await apiClientService.get(ApiRoutes.ADDRESS.ADDRESS_BY_ID(id));
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


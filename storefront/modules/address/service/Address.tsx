import apiClientService from "@/common/components/services/ApiClientService";
import { Address } from "../model/Address";
import { AddressPostVm } from "../model/AddressPostVm";
import { ApiRoutes } from "@/constants/ApiRoutes";

export async function createUserAddress(filterdata: Address) {
    const response = await apiClientService.post(ApiRoutes.ADDRESS.CREATE, JSON.stringify(
        filterdata
    ));
    if (!response.ok) {
        throw new Error("Không thể tạo địa chỉ")
    } else {
        return response.json()
    }
}

export async function updateAddress(id: number, addressPostVm: AddressPostVm) {
    const response = await apiClientService.put(ApiRoutes.ADDRESS.UPDATE(id), JSON.stringify(addressPostVm));
    if (!response.ok) {
        // throw new Error("Không thể cật nhật địa chỉ")
    }
    return response
}

export async function getAddressById(id: number): Promise<Address> {
    const reponse = await apiClientService.get(ApiRoutes.ADDRESS.ADDRESS_BY_ID(id));
    if (!reponse.ok) {
        throw new Error("Không thể tải thông tin địa chỉ.");
    } else {
        return reponse.json();
    }
}


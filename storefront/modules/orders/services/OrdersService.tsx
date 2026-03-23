import apiClientService from "@/common/components/services/ApiClientService";
import { OrdersPostVm } from "../model/OrdersPostVm";
import { OrderVm } from "../model/Order";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/storefront`;

export async function createOrder(ordersPostVm: OrdersPostVm): Promise<{ status: number, data: OrderVm }> {
    const reponse = await apiClientService.post(`${baseUrl}/orders`, JSON.stringify(ordersPostVm));
    const data: OrderVm = await reponse.json();
    if (!reponse.ok) {
        throw new Error("Không thể tạo đơn hàng");
    } else {
        return {
            status: reponse.status,
            data: data
        };
    }
}

export async function getOrderById(id: number): Promise<OrderVm> {
    const reponse = await apiClientService.get(`${baseUrl}/orders/${id}`);
    if (!reponse.ok) {
        throw new Error("Có lỗi với đơn hàng")
    } else {
        return reponse.json();
    }

}

export async function getListOrderByCreatedBy(): Promise<OrderVm[]> {
    const response = await apiClientService.get(`${baseUrl}/orders/listOrders`)
    if (!response.ok) {
        throw new Error("Có lỗi với đơn hàng");
    } else {
        return response.json();

    }
}

export async function getOrdersByOrderState(orderStatus: string) {
    const stateUp = orderStatus.toUpperCase();
    const response = await apiClientService.get(`${baseUrl}/orders/byOrderState/${stateUp}`)
    if (!response.ok) {
        throw new Error("Có lỗi với đơn hàng")
    }
    return response.json();
}


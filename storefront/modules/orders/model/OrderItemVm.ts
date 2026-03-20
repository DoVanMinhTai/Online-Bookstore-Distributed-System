export type OrderItemVm = {
        id?: number;
        productId: number;
        orderId?: number;
        productName?: string;
        quantity: number;
        productPrice?: number;
        note: string;
        description?: string;
        discountAmount?: number;
        taxAmount?: number;
        taxPercent?: number
}
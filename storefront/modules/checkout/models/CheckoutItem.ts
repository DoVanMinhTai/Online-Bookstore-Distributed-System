export type CheckoutItem = {
    productId: number;
    productName?: string;
    quantity: number;
    description?: string;
    productPrice?: number;
    discountAmount?: number;
}
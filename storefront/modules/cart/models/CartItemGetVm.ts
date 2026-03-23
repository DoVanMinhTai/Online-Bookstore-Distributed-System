export type CartItemGetVm = {
    customerId: string;
    productId: number;
    quantity: number;
}

export type CartItemGetDetailVms = {
    customerId?: string;
    productId: number;
    quantity: number;
    productName: string;
    slug?: string;
    thumbnailUrl: string;
    price: number;

}
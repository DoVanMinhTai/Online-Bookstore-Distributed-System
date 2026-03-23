import { CheckoutItem } from "./CheckoutItem";

export type Checkout = {
    id?: number;
    email: string;
    note?: string;
    promotionCode?: string;
    shipmentMethodId?: string;
    paymentMethodId?: string;
    shippingAddressId?: number;
    checkoutItemVms: CheckoutItem[];

}
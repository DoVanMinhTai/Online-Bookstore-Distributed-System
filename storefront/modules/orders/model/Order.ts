import { AddressDetailVm } from "@/modules/address/model/Address";
import { DeliveryMethod } from "./enum/DeliveryMethod";
import { PaymentStatus } from "./enum/PaymentStatus";
import { DeliveryStatus } from "./enum/DeliveryStatus";
import { OrderStatus } from "./enum/OrderStatus";
import { OrderItem } from "./OrderItem";

export type Order = {
    id: number;
    email: string;
    shippingAddressVm: AddressDetailVm;
    billingAddressVm: AddressDetailVm;
    note: string;
    tax: number;
    discount: number;
    numberItem: number;
    totalPrice: number;
    deliveryFee: number;
    couponCode: string;
    orderStatus: OrderStatus;
    deliveryMethod: DeliveryMethod;
    deliveryStatus: DeliveryStatus;
    paymentStatus: PaymentStatus;
    orderItemVms: Set<OrderItem>;
    checkoutId: string;
}
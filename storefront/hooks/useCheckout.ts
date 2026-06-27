import { deleteCartItemByProductId } from "@/modules/cart/services/CartService";
import { CheckoutType } from "@/modules/checkout/models/enum/CheckoutType";
import { OrderItem } from "@/modules/orders/model/OrderItem";
import { OrdersPostVm } from "@/modules/orders/model/OrdersPostVm";
import { createOrder } from "@/modules/orders/services/OrdersService";
import { useEffect, useState } from "react";

export function useCheckout(fecthNumberCartItems: () => Promise<void>) {
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState<CheckoutType | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedType = sessionStorage.getItem("checkoutType") as CheckoutType;
            setType(savedType);
        }
    }, []);

    const executePostOrderStrategy = async (orderItem: OrderItem[]) => {
        if (type === CheckoutType.CART) {
            await Promise.all(orderItem.map((i) => deleteCartItemByProductId(i.productId)));
        }

        await fecthNumberCartItems();
    }

    const processOrder = async (orderData: OrdersPostVm) => {
        setIsLoading(true);
        try {
            const response = await createOrder(orderData);
            if (response.status === 200) {
                await executePostOrderStrategy(Array.from(response.data.orderItemVms || []));
                return response.data;
            }
        } catch (error) {
            console.error("Error processing order:", error);
        } finally {
            setIsLoading(false);
        }
    }
    return { isLoading, processOrder };
}
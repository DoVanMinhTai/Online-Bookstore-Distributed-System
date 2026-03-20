import { getNumberCartItem } from '@/modules/cart/services/CartServices';
import React, { useCallback, useEffect, useMemo } from 'react'
import { createContext, useContext, useState } from 'react'

export const CartContext = createContext({
    numberCartItems: 0,
    fetchNumberCartItems: async () => { }
});

export function CartProvider({ children }: React.PropsWithChildren) {
    const [numberCartItems, setNumberCartItem] = useState(0);

    const fetchNumberCartItems = useCallback(async () => {
        try {
            const res = await getNumberCartItem();
            setNumberCartItem(res);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchNumberCartItems();
    }, [fetchNumberCartItems]);

    const state = useMemo(() => ({
        numberCartItems,
        fetchNumberCartItems
    }), [numberCartItems, fetchNumberCartItems]);

    return <CartContext.Provider value={state} >{children}</CartContext.Provider>
}

export const useCartContext = () => {
    const { numberCartItems, fetchNumberCartItems } = useContext(CartContext);
    return { numberCartItems, fetchNumberCartItems };
};

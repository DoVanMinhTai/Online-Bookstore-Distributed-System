import { useCartContext } from "@/context/CartContext";
import { addToCartItem } from "../services/CartServices";
import { useState } from "react";

export function useCart() {
    const { fetchNumberCartItems } = useCartContext();
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addProductToCart = async (productId: number, quantity: number) => {
        setIsAdding(true);
        setError(null);
        try {
            await addToCartItem({ productId, quantity });
            await fetchNumberCartItems();
        } catch (error) {
            setError("Failed to add product to cart");
        } finally {
            setIsAdding(false);
        }

    }

    return { addProductToCart, isAdding, error };
}
import apiClientService from "@/common/components/services/ApiClientService";
import { CartPost } from "../model/CartPost";
import { CartItemGetDetailVms, CartItemGetVm } from "../model/CartItemGetVm";
import { ProductThumbnail } from "@/modules/homepage/models/ProductThumbnail";
import { getProductById } from "@/modules/catalog/services/ProductServices";
import { CartItemPutVm } from "../model/CartItemPutVm";

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/storefront`;

export async function addToCartItem(payload: CartPost): Promise<CartItemGetVm> {
    const response = await apiClientService.post(`${baseUrl}/cart/add`, JSON.stringify(payload));
    if (!response.ok) {
        const message = await handleError(response);
        throw new Error(message);
    }
    return response.json();
}

export async function getNumberCartItem(): Promise<number> {
    const response = await apiClientService.get(`${baseUrl}/cart/number`);
    if (!response.ok) {
        await handleError(response);
        return 0;
    }
    const cartItems = await response.json();
    const numberCartItems = cartItems.reduce((
        totalQuantity: number, items: CartItemGetVm) => totalQuantity + items.quantity, 0)
    return numberCartItems;
}

export async function getCartItems(): Promise<CartItemGetVm[]> {
    try {
        const reponse = await apiClientService.get(`${baseUrl}/cart/list`);
        if (!reponse.ok) {
            await handleError(reponse)
            return []
        }
        return reponse.json();
    } catch (error) {
        return [];
    }
}

export async function getCartItemDetailVms(): Promise<CartItemGetDetailVms[]> {
    try {
        const cartItems = await getCartItems()
        if (cartItems.length === 0) return []
        const cartItemsProductId = cartItems.map((items) => items.productId);
        const products = await getProductById(cartItemsProductId);
        return mapCartItemsToProduct(cartItems, products);
    } catch (error) {
        return [];
    }

}

export async function deleteCartItemByProductId(productId: number) {
    try {
        const reponse = await apiClientService.delete(`${baseUrl}/cart/${productId}`);
        if (!reponse.ok) await handleError(reponse)
    } catch (error) {
        return 0;
    }
}

function mapCartItemsToProduct(
    cartItems: CartItemGetVm[],
    products: ProductThumbnail[]
): CartItemGetDetailVms[] {
    const detailCartItem: CartItemGetDetailVms[] = [];
    const productGetId = new Map(products.map((product) => [product.id, product]));

    for (const cartI of cartItems) {
        const product = productGetId.get(cartI.productId);
        if (!product) continue;
        detailCartItem.push(
            {
                ...cartI,
                productName: product.name,
                slug: product.slug,
                thumbnailUrl: product.thumbnailUrl,
                price: product.price
            }
        )
    }
    return detailCartItem;
}

export async function updateCartItem(productId: number, payload: CartItemPutVm): Promise<CartItemGetVm | null> {
    try {
        const response = await apiClientService.put(`${baseUrl}/cart/update/${productId}`, JSON.stringify(payload));
        if (!response.ok) {
            const msg = await handleError(response);
            throw new Error(msg);
        }
        return response.json();
    } catch (error) {
        return null
    }
}

/* export async function decreaseCartItemButton(payload : CartItemDeleteVms[]) : Promise<CartItemDeleteVms[]> {
     const reponse = await apiClientService.put(`${baseUrl}/cart/items`,payload);
    if(!reponse.ok) {
        throw new Error("Error from server")
    }
    return reponse.json();
 } */

async function handleError(response: Response) {
    let errorMessage = "Something went errors";

    try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorJson.data || errorJson.status
    } catch (error) {
        errorMessage = response.statusText;
    }
    return errorMessage
}
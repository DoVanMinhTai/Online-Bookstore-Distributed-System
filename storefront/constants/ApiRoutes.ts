const BASEURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

export const ApiRoutes = {
    product: {
        getProductById: (id: number) => `${BASEURL}/product/storefront/products/${id}`,
        getProductBySlug: (slug: string) => `${BASEURL}/product/storefront/products/slug/${slug}`,
        getProducts: `${BASEURL}/product/storefront/products`,
        getProductCategories: `${BASEURL}/product/storefront/productcategories`,
    },
    ADDRESS: {
        CREATE: `${BASEURL}/customer/storefront/createUserAddress`,
        UPDATE: (id: number) => `${BASEURL}/location/storefront/addresses/${id}`,
        ADDRESS_BY_ID: (id: number) => `${BASEURL}/location/storefront/addresses/${id}`,
    },
    CART: {
        ADD: `${BASEURL}/cart/storefront/cart/add`,
        GET_NUMBER_CART_ITEMS: `${BASEURL}/cart/storefront/cart/number`,
        GET_CART_ITEMS: `${BASEURL}/cart/storefront/cart/list`,
        GET_CART_ITEM_DETAIL_VMS: `${BASEURL}/cart/storefront/cart/detailvms`,
        DELETE_CART_ITEMS_BY_PRODUCT_ID: (productId: number) => `${BASEURL}/cart/storefront/cart/${productId}`,
        UPDATE_CART_ITEM: (productId: number) => `${BASEURL}/cart/storefront/cart/update/${productId}`,
    },
    CHECKOUT: {
        createCheckout: `${BASEURL}/checkout/storefront/checkouts`,
        getCheckoutById: (id: number) => `${BASEURL}/checkout/storefront/checkouts/${id}`,
    },
    ORDER: {
        getOrders: `${BASEURL}/order/storefront/orders`,
        getOrderById: (id: number) => `${BASEURL}/order/storefront/orders/${id}`,

    },
    USER: {
        login: `${BASEURL}/auth/storefront/login`,
        register: `${BASEURL}/auth/storefront/register`,
        getUserInfo: `${BASEURL}/auth/storefront/userinfo`,
    }
};
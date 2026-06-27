const BASEURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

export const ApiRoute = {
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
        CREATE: `${BASEURL}/order/storefront/checkouts`,
        GET_CHECKOUT_BY_ID: (id: number) => `${BASEURL}/order/storefront/checkouts/${id}`,
    },
    COUNTRY: {
        GET_ALL_COUNTRIES: `${BASEURL}/location/storefront/countries`,
        GET_STATE_OR_PROVINCES: (countryId: number) => `${BASEURL}/location/storefront/state-or-province/${countryId}`,
        GET_DISTRICTS: (stateOrProvinceId: number) => `${BASEURL}/location/storefront/district/list/${stateOrProvinceId}`,
    },
    DISTRICT: {
        GET_WARDS: (districtId: number) => `${BASEURL}/location/storefront/ward/list/${districtId}`,
    },
    ORDER: {
        CREATE: `${BASEURL}/order/storefront/orders`,
        GET_ORDER_BY_ID: (id: number) => `${BASEURL}/order/storefront/orders/${id}`,
        GET_LIST_ORDER_BY_CREATED_BY: `${BASEURL}/order/storefront/orders/listOrders`,
        GET_ORDERS_BY_ORDER_STATE: (orderStatus: string) => `${BASEURL}/order/storefront/orders/byOrderState/${orderStatus.toUpperCase()}`,
    },
    PRODUCT: {
        GET_PRODUCT_BY_ID: (id: number) => `${BASEURL}/product/storefront/product/${id}`,
        GET_PRODUCT_BY_SLUG: (slug: string) => `${BASEURL}/product/storefront/product/slug/${slug}`,
        GET_PRODUCT_SIMILAR: (slug: string) => `${BASEURL}/product/storefront/product/productSimilar/${slug}`,
        GET_PRODUCT_CATEGORIES: `${BASEURL}/product/storefront/productcategories`,
        GET_PRODUCT_BEST_SELLING: `${BASEURL}/product/storefront/products/productsBestSelling`,
        GET_PRODUCT_FEATURE: `${BASEURL}/product/storefront/products/productFeatured`,
    },
    CATEGORY: {
        GET_CATEGORIES: `${BASEURL}/product/storefront/categories`,
        GET_CATEGORY_BY_ID: (id: number | string) => `${BASEURL}/product/storefront/categories/${id}`,
        GET_BOOKS_BY_CATEGORY: (id: number | string, pageNo = 0, pageSize = 12) =>
            `${BASEURL}/product/storefront/categories/${id}/books?pageNo=${pageNo}&pageSize=${pageSize}`,
    },
    USER: {
        PROFILE: `${BASEURL}/customer/storefront/profile`,
        GET_USER_ADDRESS_LIST: `${BASEURL}/customer/storefront/addresses`,
        GET_ADDRESS_DEFAULT: `${BASEURL}/customer/storefront/addresses/default`,
        GET_ADDRESS_BILLING_LIST: `${BASEURL}/customer/storefront/addresses/billing`,
        GET_AUTHENTICATION_INFO: `${BASEURL}/authentication`,
    }
};
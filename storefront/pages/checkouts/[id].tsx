import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { getProductById } from '@/modules/catalog/services/ProductServices';
import { ProductThumbnail } from '@/modules/homepage/models/ProductThumbnail';
import { AddressDetailVm } from '@/modules/address/model/AddressDetail';
import { OrdersPostVm } from '@/modules/orders/model/OrdersPostVm';
import { Checkout } from '@/modules/checkout/model/Checkout'
import { getCheckoutById } from '@/modules/checkout/service/CheckoutService';
import CheckoutShippingInfo from '@/modules/checkout/components/CheckoutShippingInfo';
import CheckoutPaymentMethod from '@/modules/checkout/components/CheckoutPaymentMethod';
import CheckoutComponents from '@/modules/checkout/components/CheckoutProductList';
import { PaymentMethod } from '@/modules/orders/model/enum/PaymentMethod';
import { DeliveryMethod } from '@/modules/orders/model/enum/DeliveryMethod';
import { PaymentStatus } from '@/modules/orders/model/enum/PaymentStatus';
import { useCartContext } from '@/context/CartContext';
import { useCheckout } from '@/hooks/useCheckout';

interface CheckoutFormData {
    paymentMethod?: PaymentMethod;
    deliveryMethod?: DeliveryMethod;
}

const CheckoutPage = () => {
    const router = useRouter();
    const { id } = router.query
    const [checkout, setCheckout] = useState<Checkout>();
    const [product, setProduct] = useState<ProductThumbnail[]>([])
    const [shippping, setShippingAddress] = useState<AddressDetailVm>();
    const [billing, setBillingAddress] = useState<AddressDetailVm>();
    const [modalPaymentMethod, setModalPaymentMethod] = useState<boolean>(false);
    const { register, setValue } = useForm<CheckoutFormData>();
    const [checkoutFormData, setCheckoutFormData] = useState<CheckoutFormData>();
    const { fetchNumberCartItems } = useCartContext();
    const { processOrder } = useCheckout(fetchNumberCartItems);

    useEffect(() => {
        if (id) {
            const fetchCheckout = async () => {
                getCheckoutById(id as string)
                    .then((res) => {
                        setCheckout(res)
                    }
                    )
                    .catch((err) => {
                        if (err == 404) {
                            router.push({ pathname: `/404` });
                        } else {
                            router.push({ pathname: `/login` });
                        }
                    })
            }
            fetchCheckout();
        };
    }, [id, router]);


    useEffect(() => {
        const productDetail = async () => {
            if (checkout) {
                const checkoutitemProduct = checkout.checkoutItemVms ? Array.from(checkout.checkoutItemVms) : [];
                const productIds = checkoutitemProduct.map((item) => item.productId);

                await getProductById(productIds)
                    .then((res) => {
                        setProduct(res);
                    }).catch((error) => {
                        if (error.status == 404) {
                            return;
                        }
                        console.error(error)
                    })
            }
        }
        if (checkout) {
            productDetail();
        }
    }, [id, checkout]);

    const handleUpdateCheckoutForm = (data: CheckoutFormData) => {
        setCheckoutFormData((prev) => ({
            ...prev,
            ...data
        }));
    };

    const handleAddress = (billing: AddressDetailVm, shipping: AddressDetailVm) => {
        setShippingAddress(shipping);
        setBillingAddress(billing)
    }
    const showModalPaymentMethod = () => {
        setModalPaymentMethod(!modalPaymentMethod);
    }

    const handleSubmitPostOrder = async () => {
        const ordersPostVm: OrdersPostVm = {
            checkoutId: checkout?.id,
            email: checkout?.email,
            shippingAddressPostVm: shippping,
            billingAddressPostVm: billing,
            note: checkout?.note,
            tax: 0,
            discount: 0,
            numberItem: product.length,
            totalPrice: product.reduce((total, item) => total + item.price, 0),
            deliveryFee: 0,
            couponCode: checkout?.promotionCode,
            deliveryMethod: checkoutFormData?.deliveryMethod,
            paymentMethod: checkoutFormData?.paymentMethod,
            paymentStatus: PaymentStatus.PENDING,
            orderItemPostVmList: checkout?.checkoutItemVms?.map(item => {
                return {
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    productPrice: item.productPrice,
                    note: "string",
                    discountAmount: item.discountAmount,
                    taxAmount: 0,
                    taxPercent: 0
                }
            }
            )
        }

        try {
            const order = await processOrder(ordersPostVm);
            if (order) {
                const orderId = order.id;
                router.push(`/order-success/${orderId}`)
            } else {
                console.error("Failed to create order");
            }
        }
        catch (error) {
            console.error("Error creating order:", error);
        }
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-10 container mx-auto">
                <CheckoutShippingInfo checkout={checkout ?? { email: '', checkoutItemVms: [] }} handleAddress={handleAddress} />
                <CheckoutComponents products={product} checkoutItems={checkout?.checkoutItemVms ?? []} />

                <div className=" col-span-2 flex justify-end p-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg"
                        onClick={showModalPaymentMethod}> Thanh toán</button>
                </div>

                <CheckoutPaymentMethod
                    display={modalPaymentMethod}
                    onClose={showModalPaymentMethod}
                    onConfirm={handleSubmitPostOrder}
                    model={checkoutFormData}
                    register={register}
                    setValue={setValue}
                    onUpdate={handleUpdateCheckoutForm}
                />
                <div>{checkoutFormData?.deliveryMethod}</div>
                <div>{checkoutFormData?.paymentMethod}</div>
            </div>
        </>
    )
}

export default CheckoutPage;
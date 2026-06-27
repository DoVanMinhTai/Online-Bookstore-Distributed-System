import React, { useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import ImageWithFallBack from '@/common/components/ImageWithFallBack';
import ProductInfo from './details/ProductInfo';
import ProductActions from './actions/ProductActions';
import ProductTabs from './tabs/ProductTabs';
import ProductSimilar from './similar/ProductSimilar';
import { ProductDetail } from '../model/ProductDetail';
import { ProductImageGarelly } from '@/common/components/ProductImageGarelly';
import { useCartContext } from '@/context/CartContext';
import { useUserInfoContext } from '@/context/UserInforProvider';
import { addToCartItem } from '@/modules/cart/services/CartService';
import { CheckoutType } from '@/modules/checkout/models/enum/CheckoutType';
import { Checkout } from '@/modules/checkout/models/Checkout';
import { createCheckout } from '@/modules/checkout/services/CheckoutService';

type ProductDetailProps = {
    product: ProductDetail;
}

export default function ProductDetails({ product }: ProductDetailProps) {
    const { fetchNumberCartItems } = useCartContext();
    const { email } = useUserInfoContext();
    const [quantity, setQuantity] = useState<number>(1);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const router = useRouter();

    const handleQuantityChange = (q: number) => setQuantity(q);

    const onClickHandleAddToCart = async () => {
        if (quantity < 1) return;
        try {
            await addToCartItem({ productId: product.id, quantity });
            fetchNumberCartItems();
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        } catch (error) {
            console.error("Add to cart failed", error);
        }
    }

    const onClickHandleSubmit = async () => {
        if (quantity < 1) return;

        if (typeof window !== 'undefined') {
            sessionStorage.setItem("checkoutType", CheckoutType.DIRECT);
        }

        const checkoutPayload: Checkout = {
            email: email,
            note: '',
            promotionCode: "",
            shipmentMethodId: "1",
            paymentMethodId: "1",
            shippingAddressId: 1,
            checkoutItemVms: [{
                productId: product.id,
                description: "",
                quantity: quantity,
            }]
        }
        try {
            const res = await createCheckout(checkoutPayload);
            if (res) {
                router.push(`/checkouts/${res?.id}`);
            }
        } catch (error) {
            alert("Vui lòng đăng nhập để tiếp tục");
        }
    }

    return (
        <div className="bg-white min-h-screen">

            {showNotification && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm">
                    <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between mx-4 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-emerald-500 rounded-full p-1">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </span>
                            <span className="text-sm font-medium">Đã thêm vào giỏ hàng!</span>
                        </div>
                        <Link href="/cart" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 underline ml-4">Xem giỏ hàng</Link>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-6">
                <nav className="flex text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900 font-medium truncate">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 border border-slate-100">
                            {product.thumbnailMediaUrl && (
                                <ImageWithFallBack
                                    src={product.thumbnailMediaUrl}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    alt={product.name}
                                />
                            )}
                        </div>
                        <ProductImageGarelly listImage={product.productImageMediaUrl} />
                    </div>

                    <div className="lg:sticky lg:top-8 h-fit space-y-8">
                        <div className="bg-white p-2">
                            <ProductInfo product={product} handleQuantityChange={handleQuantityChange} />

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <ProductActions
                                    product={product}
                                    handleAddToCart={onClickHandleAddToCart}
                                    handleSubmitBuyNow={onClickHandleSubmit}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <span className="text-2xl">🚚</span>
                                <span className="text-xs font-medium text-slate-600">Giao hàng miễn phí toàn quốc</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <span className="text-2xl">🛡️</span>
                                <span className="text-xs font-medium text-slate-600">Bảo hành 12 tháng chính hãng</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <ProductTabs />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Sản phẩm tương tự</h3>
                            <ProductSimilar product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
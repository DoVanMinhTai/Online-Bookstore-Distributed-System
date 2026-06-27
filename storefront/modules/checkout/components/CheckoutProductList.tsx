import React from 'react';
import { ProductThumbnail } from '@/modules/homepage/models/ProductThumbnail';
import ImageWithFallBack from '@/common/components/ImageWithFallBack';
import { CheckoutItem } from '../models/CheckoutItem';
import { formatPrice } from '@/utils/formatPrice';

interface Props {
    products: ProductThumbnail[];
    checkoutItems: CheckoutItem[];
    deliveryFee?: number;
    discount?: number;
}

export default function CheckoutProductList({
    products,
    checkoutItems,
    deliveryFee = 0,
    discount = 0,
}: Props) {
    const subtotal = checkoutItems.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product?.price ?? item.productPrice ?? 0) * item.quantity;
    }, 0);

    const total = subtotal + deliveryFee - discount;

    return (
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">
                    Đơn hàng của bạn
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{checkoutItems.length} sản phẩm</p>
            </div>

            {/* Product list */}
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-80 px-6">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                        <span className="text-3xl">📦</span>
                        <p className="text-sm">Đang tải sản phẩm...</p>
                    </div>
                ) : (
                    products.map((product) => {
                        const item = checkoutItems.find(c => c.productId === product.id);
                        const qty = item?.quantity ?? 1;
                        const lineTotal = product.price * qty;
                        return (
                            <div key={product.id} className="flex items-center gap-4 py-4">
                                {/* Image */}
                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                    <ImageWithFallBack
                                        src={product.thumbnailUrl}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                    {/* Qty badge */}
                                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
                                        {qty}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="flex flex-1 items-start justify-between gap-2 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 line-clamp-2 flex-1">
                                        {product.name}
                                    </p>
                                    <p className="flex-shrink-0 text-sm font-bold text-emerald-600 whitespace-nowrap">
                                        {formatPrice(lineTotal)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Summary */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-5 space-y-2.5">
                <div className="flex justify-between text-sm text-slate-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : ''}`}>
                        {deliveryFee === 0 ? 'Miễn phí' : formatPrice(deliveryFee)}
                    </span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-rose-600">Giảm giá</span>
                        <span className="font-semibold text-rose-600">−{formatPrice(discount)}</span>
                    </div>
                )}

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="text-base font-bold text-slate-800">Tổng cộng</span>
                    <span className="text-xl font-extrabold text-emerald-600">{formatPrice(total)}</span>
                </div>
            </div>
        </div>
    );
}

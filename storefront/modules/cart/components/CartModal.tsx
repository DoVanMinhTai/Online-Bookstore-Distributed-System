import Link from "next/link";
import React, { useEffect, useState } from "react";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CartItemGetDetailVms, CartItemGetVm } from "../models/CartItemGetVm";
import { getCartItemDetailVms } from "../services/CartService";
import { formatPrice } from "@/utils/formatPrice";
import ImageWithFallBack from "@/common/components/ImageWithFallBack";

const CartModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItem] = useState<CartItemGetDetailVms[]>([]);
    useEffect(() => {
        getCartItemDetailVms()
            .then((res) => {
                setCartItem(res);
            })
            .catch((error) =>
                setCartItem([]))
    }, []);

    return (
        <div>
            <button
                onClick={() => {

                    getCartItemDetailVms().then((res) => setCartItem(res))
                        .catch((error) => console.log(error))
                    setIsOpen(true);
                }}
                className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg
                 focus:bg-slate-700 focus:shadow-none active:bg-slate-700
                 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                type="button"
            >
                <FontAwesomeIcon icon={faShoppingCart} className="px-1" />
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative m-4 w-full max-w-xl rounded-xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <h2 className="text-base font-semibold text-slate-900">Giỏ hàng</h2>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            >
                                ✖
                            </button>
                        </div>

                        <div className="max-h-80 overflow-y-auto px-5 py-3">
                            {cartItems.length > 0 ? (
                                <>
                                    <div className="mb-2 grid grid-cols-[3fr,2fr,2fr] items-center gap-3 text-xs font-medium text-slate-500">
                                        <span>Sản phẩm</span>
                                        <span className="text-center">Số lượng</span>
                                        <span className="text-right">Thành tiền</span>
                                    </div>

                                    <div className="space-y-3">
                                        {cartItems.map((cartItem) => (
                                            <div
                                                key={cartItem.productId}
                                                className="grid grid-cols-[3fr,2fr,2fr] items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 overflow-hidden rounded-md bg-slate-100">
                                                        <ImageWithFallBack
                                                            className="h-full w-full object-cover"
                                                            src={cartItem.thumbnailUrl}
                                                            alt={cartItem.productName}
                                                        />
                                                    </div>
                                                    <div className="text-sm text-slate-800 line-clamp-2">
                                                        {cartItem.productName}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="rounded bg-slate-800 p-1.5 text-xs text-white hover:bg-slate-700"
                                                    // TODO: thêm handler giảm số lượng
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        id="amountInput"
                                                        type="number"
                                                        className="w-14 rounded-md border border-slate-200 bg-white px-2 py-1 text-center text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none"
                                                        value={cartItem.quantity}
                                                        readOnly
                                                    />
                                                    <button
                                                        type="button"
                                                        className="rounded bg-slate-800 p-1.5 text-xs text-white hover:bg-slate-700"
                                                    // TODO: thêm handler tăng số lượng
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="text-right text-sm font-semibold text-emerald-600">
                                                    {formatPrice(cartItem.quantity * cartItem.price)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                                    Giỏ hàng đang trống.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                type="button"
                            >
                                Tiếp tục mua hàng
                            </button>
                            <Link
                                onClick={() => setIsOpen(false)}
                                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                                href="/carts"
                            >
                                Xem chi tiết giỏ hàng
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartModal;

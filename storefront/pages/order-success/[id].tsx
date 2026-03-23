import ImageWithFallBack from '@/common/components/ImageWithFallBack';
import { getProductById } from '@/modules/catalog/services/ProductService';
import { OrderVm } from '@/modules/orders/model/Order';
import { getOrderById } from '@/modules/orders/services/OrdersService';
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useEffect, useState, useMemo } from 'react';
import { ProductThumbnail } from '@/modules/homepage/models/ProductThumbnail';
import { useCartContext } from '@/context/CartContext';

const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

const OrderSuccessPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [order, setOrder] = useState<OrderVm | undefined>();
    const [products, setProducts] = useState<ProductThumbnail[]>([]);
    const [loading, setLoading] = useState(true);
    const { fetchNumberCartItems } = useCartContext();

    useEffect(() => {
        if (id) {
            setLoading(true);
            getOrderById(Number(id))
                .then((res) => {
                    setOrder(res);
                    if (res?.orderItemVms) {
                        const productIds = Array.from(res.orderItemVms).map((item: { productId: number }) => item.productId);
                        return getProductById(productIds);
                    }
                    return Promise.resolve([] as ProductThumbnail[]);
                })
                .then((resProducts) => setProducts(resProducts || []))
                .catch((error) => console.error(error))
                .finally(async () => {
                    await fetchNumberCartItems();
                    setLoading(false);
                });
        }
    }, [id, fetchNumberCartItems]);

    const orderItems = useMemo(() => {
        return Array.from(order?.orderItemVms || []).map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
                ...item,
                productName: product?.name || "Sản phẩm không tên",
                thumbnailUrl: product?.thumbnailUrl || "",
            };
        }) || [];
    }, [order, products]);

    if (loading) return <div className="text-center py-20">Đang tải thông tin đơn hàng...</div>;
    if (!order) return <div className="text-center py-20">Không tìm thấy đơn hàng.</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 p-4 rounded-full">
                            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Cảm ơn bạn đã đặt hàng!</h1>
                    <p className="text-gray-600 mt-2">Mã đơn hàng: <span className="font-semibold text-blue-600">#{order.id}</span></p>
                    <p className="text-sm text-gray-500">Chúng tôi đã gửi email xác nhận đến email của bạn.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b">
                                <h2 className="font-bold text-lg text-gray-800">Sản phẩm đã mua</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {orderItems.map((item) => (
                                    <div key={item.productId} className="p-6 flex items-center space-x-4">
                                        <ImageWithFallBack
                                            src={item.thumbnailUrl}
                                            alt={item.productName}
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.productName}</h3>
                                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">{formatCurrency(item.productPrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-bold text-lg text-gray-800 mb-4">Thông tin giao hàng</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <p className="font-medium text-gray-400 uppercase text-xs">Người nhận</p>
                                    <p className="mt-1 text-gray-900 font-medium">{order.shippingAddressVm.contactName}</p>
                                    <p>{order.shippingAddressVm.phone}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-400 uppercase text-xs">Địa chỉ nhận hàng</p>
                                    <p className="mt-1 text-gray-900">{order.shippingAddressVm.addressLine1}</p>
                                    <p>{order.shippingAddressVm.addressLine2}</p>
                                    <p>{order.shippingAddressVm.city}, {order.shippingAddressVm.zipCode}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 italic text-sm border-l-4 border-blue-500 text-blue-700">
                            Dự kiến nhận hàng: 5 - 7 ngày tới.
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-bold text-lg text-gray-800 mb-4">Tổng cộng</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tạm tính</span>
                                    <span>{formatCurrency(Array.from(order.orderItemVms).reduce((total, item) => total + (item.productPrice && item.quantity ? item.productPrice * item.quantity : 0), 0))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phí vận chuyển</span>
                                    <span>{formatCurrency(0)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-lg font-bold text-red-600">
                                    <span>Tổng cộng</span>
                                    <span>{formatCurrency(Array.from(order.orderItemVms).reduce((total, item) => total + (item.productPrice && item.quantity ? item.productPrice * item.quantity : 0), 0))}</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <Link href="/" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition">
                                    Tiếp tục mua hàng
                                </Link>
                                <Link href="/myorders" className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition">
                                    Lịch sử đơn hàng
                                </Link>
                                <button onClick={() => window.print()} className="block w-full text-center text-sm text-blue-500 hover:underline">
                                    In hóa đơn (PDF)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
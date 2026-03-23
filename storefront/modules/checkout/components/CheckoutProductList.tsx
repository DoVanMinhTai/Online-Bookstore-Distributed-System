import React from 'react'
import { ProductThumbnail } from '@/modules/homepage/models/ProductThumbnail'
import ImageWithFallBack from '@/common/components/ImageWithFallBack'
import { CheckoutItem } from '../models/CheckoutItem';

interface Props {
    products: ProductThumbnail[];
    checkoutItems: CheckoutItem[];
}

export default function CheckoutComponents({products,checkoutItems} : Props) {
    return (
        <>
            <div className="p-4  border rounded-lg shadow-md bg-white">
                    <div className="font-bold text-center text-lg text-gray-700">
                        Thông tin sản phẩm
                    </div>
                    <div className="mt-5 flex ">
                        <div className="w-full overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 border-b">
                                        <th className="px-4 py-2 text-left">Hình ảnh</th>
                                        <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                                        <th className="px-4 py-2 text-center">Số lượng</th>
                                        <th className="px-4 py-2 text-right">Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="px-4 py-2">
                                                <ImageWithFallBack src={item.thumbnailUrl} alt={item.name} className="h-12 w-12 object-cover" />

                                            </td>
                                            <td className="px-4 py-2">{item.name}</td>
                                            <td className="px-4 py-2 text-center">
                                                {checkoutItems.find((p) => p.productId === item.id)?.quantity}
                                            </td>
                                            <td className="px-4 py-2 text-right text-green-600 font-semibold">{item.price} ₫</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>              
        </>
    )
}

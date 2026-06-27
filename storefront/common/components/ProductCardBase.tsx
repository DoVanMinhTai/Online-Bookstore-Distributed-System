import React from 'react'
import { formatPrice } from '@/utils/formatPrice';
import ImageWithFallBack from './ImageWithFallBack';
import Link from 'next/link';
import { addToCartItem } from '@/modules/cart/services/CartService';
import { useCartContext } from '@/context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardBase {
    product: {
        id: number;
        name: string;
        price: number;
        slug: string;
    };
    thumbnailUrl: string;
}

const ProductCardBase: React.FC<ProductCardBase> = ({ product, thumbnailUrl }) => {
    const { fetchNumberCartItems } = useCartContext();
    const addToCart = async () => {
        const payload = { productId: product.id, quantity: 1 };
        try {
            await addToCartItem(payload);
            fetchNumberCartItems();
            toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }
    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
            <div className="flex h-full flex-col justify-between border border-slate-100 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 group">
                <Link href={`/products/${product.slug}`} className="flex flex-col flex-grow">
                    <div className="relative overflow-hidden rounded-lg bg-slate-50 aspect-square flex items-center justify-center">
                        <ImageWithFallBack
                            src={thumbnailUrl}
                            alt={product.name}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <h2 className="text-sm font-bold text-slate-800 mt-3 line-clamp-2 group-hover:text-emerald-600 transition-colors flex-grow">
                        {product.name}
                    </h2>
                    <p className="text-emerald-600 font-extrabold mt-1 text-sm">
                        {formatPrice(product.price)}
                    </p>
                </Link>
                <button 
                    className="mt-3 w-full bg-emerald-600 text-white font-semibold text-xs py-2 px-3 rounded-lg hover:bg-emerald-500 active:bg-emerald-700 transition-colors focus:outline-none cursor-pointer" 
                    onClick={addToCart}
                >
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    )
}

export default ProductCardBase
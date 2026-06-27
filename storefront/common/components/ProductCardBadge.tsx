import React from 'react';
import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';
import ImageWithFallBack from './ImageWithFallBack';
import { addToCartItem } from '@/modules/cart/services/CartService';
import { useCartContext } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { ProductThumbnail } from '@/modules/homepage/models/ProductThumbnail';

interface Props {
    product: ProductThumbnail;
    badge?: string;
    badgeColor?: string; // Tailwind bg class, e.g. "bg-rose-500"
}

const ProductCardBadge: React.FC<Props> = ({
    product,
    badge,
    badgeColor = 'bg-rose-500',
}) => {
    const { fetchNumberCartItems } = useCartContext();

    const addToCart = async () => {
        try {
            await addToCartItem({ productId: product.id, quantity: 1 });
            fetchNumberCartItems();
            toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
        } catch {
            toast.error('Thêm vào giỏ hàng thất bại');
        }
    };

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
            <div className="relative flex h-full flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group">
                {/* Badge */}
                {badge && (
                    <span
                        className={`absolute left-4 top-4 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow ${badgeColor}`}
                    >
                        {badge}
                    </span>
                )}

                <Link href={`/products/${product.slug}`} className="flex flex-col flex-grow">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-lg bg-slate-50 aspect-square flex items-center justify-center">
                        <ImageWithFallBack
                            src={product.thumbnailUrl ?? ''}
                            alt={product.name}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>

                    {/* Name */}
                    <h2 className="mt-3 flex-grow text-sm font-bold leading-snug text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                    </h2>

                    {/* Price */}
                    <p className="mt-1.5 text-sm font-extrabold text-emerald-600">
                        {formatPrice(product.price)}
                    </p>
                </Link>

                {/* Add to cart */}
                <button
                    onClick={addToCart}
                    className="mt-3 w-full cursor-pointer rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 active:bg-emerald-700 focus:outline-none"
                >
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
};

export default ProductCardBadge;

import React from 'react';
import Link from 'next/link';
import { useGetProductFeature } from '../services/ProductService';
import ProductCardBadge from '@/common/components/ProductCardBadge';
import { ProductThumbnail } from '../models/ProductThumbnail';

function SkeletonProductCard() {
    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
            <div className="animate-pulse rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="aspect-square rounded-lg bg-slate-200" />
                <div className="mt-3 h-3 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                <div className="mt-4 h-8 rounded-lg bg-slate-200" />
            </div>
        </div>
    );
}

const FeturedProduct = () => {
    const { data, isLoading, error } = useGetProductFeature();
    const products: ProductThumbnail[] = data?.productThumbnailGetVms ?? [];

    return (
        <section className="container mx-auto w-full px-4 py-10 border-t border-slate-100">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-900">
                        Sản phẩm nổi bật
                    </h2>
                    <div className="mt-2 h-1 w-12 rounded bg-emerald-600" />
                </div>
                <Link
                    href="/categories"
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                    Xem tất cả →
                </Link>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-wrap -mx-2">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonProductCard key={i} />)}
                </div>
            ) : error ? (
                <p className="text-center text-slate-400 text-sm py-8">Không thể tải sản phẩm</p>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
                    <span className="text-4xl">📖</span>
                    <p className="text-sm font-medium">Hiện tại chưa có sản phẩm nổi bật</p>
                </div>
            ) : (
                <div className="flex flex-wrap -mx-2">
                    {products.map((product) => (
                        <ProductCardBadge
                            key={product.id}
                            product={product}
                            badge="Nổi bật"
                            badgeColor="bg-violet-500"
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeturedProduct;

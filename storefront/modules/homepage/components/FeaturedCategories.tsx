import React from 'react';
import Link from 'next/link';
import { useApiRequest } from '@/common/components/services/hook/useApiRequest';
import { getCategories } from '@/modules/category/services/CategoryService';

// Màu gradient xoay vòng cho các card danh mục
const gradients = [
    'from-emerald-400 to-teal-500',
    'from-violet-400 to-purple-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-sky-400 to-blue-500',
    'from-lime-400 to-green-500',
    'from-fuchsia-400 to-indigo-500',
    'from-red-400 to-rose-500',
];

// Emoji icon xoay vòng cho từng danh mục
const categoryIcons = ['📚', '🧠', '✍️', '🌍', '🔬', '💡', '🎨', '📖'];

// Skeleton placeholder khi đang load
function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl bg-slate-100 p-5 flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="h-3 w-20 rounded bg-slate-200" />
        </div>
    );
}

const FeaturedCategories = () => {
    const { data: categories, isLoading, error } = useApiRequest(getCategories);

    // Lấy tối đa 8 danh mục
    const displayed = categories?.slice(0, 8) ?? [];

    return (
        <section className="container mx-auto w-full px-4 py-10">
            {/* Section header */}
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-900">
                        Danh mục nổi bật
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

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                    : error || displayed.length === 0
                    ? (
                        <p className="col-span-full text-center text-slate-400 text-sm">
                            Chưa có danh mục nào
                        </p>
                    )
                    : displayed.map((cat, i) => (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.id}`}
                            className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                        >
                            {/* Icon circle */}
                            <div
                                className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} text-2xl shadow-inner transition-transform duration-200 group-hover:scale-110`}
                            >
                                {categoryIcons[i % categoryIcons.length]}
                            </div>
                            {/* Category name */}
                            <span className="text-center text-xs font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
            </div>
        </section>
    );
};

export default FeaturedCategories;

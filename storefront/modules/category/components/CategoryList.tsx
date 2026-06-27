import React from 'react';
import Link from 'next/link';
import { Category } from '../models/Category';

type Props = {
    categories: Category[];
    isLoading?: boolean;
    error?: string | null;
};

const CategoryList: React.FC<Props> = ({ categories, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex min-h-[150px] items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return <p className="text-center text-slate-500">Hiện chưa có danh mục nào.</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="group rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md"
                >
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                        {category.name}
                    </h3>
                    {category.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                            {category.description}
                        </p>
                    )}
                </Link>
            ))}
        </div>
    );
};

export default CategoryList;


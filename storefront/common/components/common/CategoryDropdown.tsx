import React from 'react';
import Link from 'next/link';
import { useApiRequest } from '@/common/components/services/hook/useApiRequest';
import { getCategories } from '@/modules/category/services/CategoryService';

export default function CategoryDropdown() {
  const { data: categories, isLoading, error } = useApiRequest(getCategories);

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 z-50 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-xl">
        <div className="space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200"></div>
        </div>
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 z-50 mt-2 w-72 rounded-lg border border-slate-100 bg-white p-4 shadow-xl transition-all duration-200 ease-out animate-fadeIn">
      <div className="grid grid-cols-1 gap-1">

        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

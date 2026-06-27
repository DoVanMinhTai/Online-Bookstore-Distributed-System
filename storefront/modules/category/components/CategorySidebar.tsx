import React from 'react';
import Link from 'next/link';
import { Category } from '../models/Category';

type Props = {
  categories: Category[];
  activeCategoryId?: number | string;
};

const CategorySidebar: React.FC<Props> = ({ categories, activeCategoryId }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <aside className="w-full lg:sticky lg:top-8 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
      <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
        Danh mục sách
      </h2>
      <ul className="space-y-1">
        {categories.map((category) => {
          const isActive = String(category.id) === String(activeCategoryId);
          return (
            <li key={category.id}>
              <Link
                href={`/categories/${category.id}`}
                className={`block px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600 pl-2'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                }`}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default CategorySidebar;

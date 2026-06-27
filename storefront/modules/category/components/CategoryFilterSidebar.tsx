import React from 'react';
import Link from 'next/link';
import { Category } from '../models/Category';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort, faTags, faDollarSign } from '@fortawesome/free-solid-svg-icons';

type Props = {
  categories: Category[];
  activeCategoryId?: number | string;
  selectedPriceRange: string;
  onPriceRangeChange: (range: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  sortOption: string;
  onSortChange: (sort: string) => void;
  onApplyCustomPrice: () => void;
};

const CategoryFilterSidebar: React.FC<Props> = ({
  categories,
  activeCategoryId,
  selectedPriceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  sortOption,
  onSortChange,
  onApplyCustomPrice,
}) => {
  return (
    <div className="space-y-6">
      {/* Category List Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
          <FontAwesomeIcon icon={faTags} className="text-emerald-600 text-xs" />
          Danh mục sách
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              href="/categories"
              className={`block px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                !activeCategoryId
                  ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600 pl-2'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
              }`}
            >
              Tất cả danh mục
            </Link>
          </li>
          {categories.map((category) => {
            const isActive = String(category.id) === String(activeCategoryId);
            return (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.id}`}
                  className={`block px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
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
      </div>

      {/* Filter Price Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
          <FontAwesomeIcon icon={faDollarSign} className="text-emerald-600 text-xs" />
          Khoảng giá
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Tất cả giá', value: 'all' },
            { label: 'Dưới 100.000đ', value: 'under100' },
            { label: '100.000đ - 300.000đ', value: '100to300' },
            { label: '300.000đ - 500.000đ', value: '300to500' },
            { label: 'Trên 500.000đ', value: 'over500' },
            { label: 'Tùy chọn khác', value: 'custom' },
          ].map((range) => (
            <label key={range.value} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={selectedPriceRange === range.value}
                onChange={() => onPriceRangeChange(range.value)}
                className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>

        {selectedPriceRange === 'custom' && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Tối thiểu"
                value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Tối đa"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={onApplyCustomPrice}
              className="w-full bg-emerald-600 text-white py-1.5 px-3 rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              Áp dụng
            </button>
          </div>
        )}
      </div>

      {/* Sort Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
          <FontAwesomeIcon icon={faSort} className="text-emerald-600 text-xs" />
          Sắp xếp
        </h3>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-2.5 py-2 text-xs font-semibold text-slate-700 bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="default">Mới nhất (Mặc định)</option>
          <option value="priceAsc">Giá: Thấp đến Cao</option>
          <option value="priceDesc">Giá: Cao đến Thấp</option>
          <option value="nameAsc">Tên: A đến Z</option>
        </select>
      </div>
    </div>
  );
};

export default CategoryFilterSidebar;

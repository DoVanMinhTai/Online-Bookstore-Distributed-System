import React from 'react';
import Link from 'next/link';
import ImageWithFallBack from '@/common/components/ImageWithFallBack';
import { formatPrice } from '@/utils/formatPrice';
import { ProductThumbnail } from '@/modules/homepage/models/ProductThumbnail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faGift } from '@fortawesome/free-solid-svg-icons';

type Props = {
  bestSellers: ProductThumbnail[];
};

const CategoryPromoSidebar: React.FC<Props> = ({ bestSellers }) => {
  const displayItems = bestSellers ? bestSellers.slice(0, 4) : [];

  return (
    <div className="space-y-6">
      {/* Best Sellers Section */}
      {displayItems.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FontAwesomeIcon icon={faFire} className="text-rose-500 text-xs" />
            Sách bán chạy
          </h3>
          <div className="space-y-4">
            {displayItems.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="flex gap-3 group items-center"
              >
                <div className="w-12 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                  <ImageWithFallBack
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-emerald-600 font-extrabold text-xs mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Promo Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-rose-500 text-white rounded-2xl p-5 shadow-md">
        {/* Decorative circle */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-sm"></div>
        <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-white/15 rounded-full blur-sm"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faGift} className="text-white text-sm animate-bounce" />
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Ưu đãi độc quyền</span>
          </div>
          <div>
            <h4 className="text-base font-extrabold leading-tight">Mã Giảm Giá 50K</h4>
            <p className="text-[11px] text-white/80 mt-1">Áp dụng cho mọi hóa đơn mua sách mới từ 500K</p>
          </div>
          <div className="bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 flex justify-between items-center text-xs">
            <span className="font-mono font-bold tracking-wider">BOOKSHOP50</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText('BOOKSHOP50');
                alert('Đã sao chép mã giảm giá!');
              }}
              className="text-[10px] bg-white text-rose-600 font-bold px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Sao chép
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPromoSidebar;

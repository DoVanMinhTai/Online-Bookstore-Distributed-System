import React from 'react';
import ProductCard from '@/common/components/ProductCard';
import { ProductThumbnail } from '@/modules/homepage/models/ProductThumbnail';

type Props = {
    books: ProductThumbnail[];
    pageNo: number;
    totalPages: number;
    isLast: boolean;
    isLoading?: boolean;
    onPageChange: (pageNo: number) => void;
};

const CategoryBooks: React.FC<Props> = ({
    books,
    pageNo,
    totalPages,
    isLast,
    isLoading,
    onPageChange,
}) => {
    if (!isLoading && (!books || books.length === 0)) {
        return (
            <p className="py-8 text-center text-slate-500">
                Danh mục này hiện chưa có sản phẩm.
            </p>
        );
    }

    return (
        <div>
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                        <div className="h-8 w-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    </div>
                )}
                <div className="flex flex-wrap">
                    {books.map((book) => (
                        <ProductCard key={book.id} product={book} />
                    ))}
                </div>
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                        className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
                        onClick={() => onPageChange(pageNo - 1)}
                        disabled={pageNo <= 0 || isLoading}
                    >
                        Trước
                    </button>
                    <span className="text-sm text-slate-600">
                        Trang {pageNo + 1} / {totalPages}
                    </span>
                    <button
                        className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
                        onClick={() => onPageChange(pageNo + 1)}
                        disabled={isLast || isLoading}
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryBooks;

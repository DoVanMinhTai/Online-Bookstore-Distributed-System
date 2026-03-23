import { FC } from "react";
import { formatPrice } from "@/utils/formatPrice";
import { CartItemGetDetailVms } from "../models/CartItemGetVm";
import ImageWithFallBack from "@/common/components/ImageWithFallBack";
import { Trash2, Minus, Plus } from "lucide-react";

interface itemProps {
    item: CartItemGetDetailVms;
    isLoading?: boolean;
    isSelected: boolean;
    handleSelectedCartItemChange: (productId: number) => void;
    handleDecreaseQuantity: (productId: number) => void;
    handleIncreaseQuantity: (productId: number) => void;
    handleDialogDeleteCartItem: (productId: number) => void;
}

export const calculateTotalPrice = (items: CartItemGetDetailVms[], selectedItemIds: number[]) => {
    return items
        .filter((item) => selectedItemIds.includes(item.productId))
        .reduce((total, item) => total + item.price * item.quantity, 0);
};

export const CartItem: FC<itemProps> = ({
    item,
    isLoading,
    isSelected,
    handleSelectedCartItemChange,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleDialogDeleteCartItem
}) => {
    return (
        <div className={`group relative flex flex-col sm:flex-row items-center gap-4 p-4 transition-all hover:bg-slate-50 ${isLoading ? "animate-pulse opacity-50" : ""}`}>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectedCartItemChange(item.productId)}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200">
                    <ImageWithFallBack 
                        src={item.thumbnailUrl} 
                        alt={item.productName} 
                        className="h-full w-full object-cover object-center" 
                    />
                </div>

                <div className="flex flex-col sm:hidden flex-1">
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-2">{item.productName}</h3>
                    <p className="mt-1 text-sm font-bold text-emerald-600">{formatPrice(item.price)}</p>
                </div>
            </div>

            <div className="hidden sm:flex flex-1 flex-col">
                <h3 className="text-sm font-medium text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer">
                    {item.productName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Mã SP: {item.productId}</p>
            </div>

            <div className="flex w-full sm:w-auto items-center justify-between sm:gap-8">
                <div className="flex items-center border border-slate-200 rounded-full p-1 bg-white">
                    <button
                        onClick={() => handleDecreaseQuantity(item.productId)}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        title="Giảm"
                    >
                        <Minus size={16} />
                    </button>
                    
                    <input
                        type="number"
                        value={item.quantity}
                        className="w-10 text-center text-sm font-semibold border-none focus:ring-0 bg-transparent"
                        readOnly
                    />
                    
                    <button
                        onClick={() => handleIncreaseQuantity(item.productId)}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        title="Tăng"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="hidden sm:block text-right min-w-[100px]">
                    <p className="text-sm font-bold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                        <p className="text-[10px] text-slate-400">
                            {formatPrice(item.price)} / sản phẩm
                        </p>
                    )}
                </div>

                <button
                    onClick={() => handleDialogDeleteCartItem(item.productId)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Xóa sản phẩm"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};
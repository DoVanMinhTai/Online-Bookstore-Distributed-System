import { useCartContext } from '@/context/CartContext';
import { CartItemGetDetailVms } from '@/modules/cart/model/CartItemGetVm'
import { getCartItemDetailVms, updateCartItem, deleteCartItemByProductId } from '@/modules/cart/services/CartServices';
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';
import { useRouter } from 'next/router';
import ConfimationDialog from '@/common/dialog/ConfirmationDialog';
import { CartItem, calculateTotalPrice } from '@/modules/cart/components/CartItem';
import { Checkout } from '@/modules/checkout/model/Checkout';
import { useUserInfoContext } from '@/context/UserInforProvider';
import { createCheckout } from '@/modules/checkout/service/CheckoutService';
import { CheckoutType } from '@/modules/checkout/model/enum/CheckoutType';

const Index = () => {
  const [cartItems, setCartItem] = useState<CartItemGetDetailVms[]>([]);
  const [productIdToRemove, setProductIdToRemove] = useState<number>(0);
  const { fetchNumberCartItems } = useCartContext();
  const [selectedCartItem, setSelectedCartItem] = useState<Set<number>>(new Set());
  const { email } = useUserInfoContext();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loadCartDetail = useCallback(async () => {
    setIsLoading(true);
    try {
      const newCartItems = await getCartItemDetailVms();
      setCartItem(newCartItems);
      fetchNumberCartItems();
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchNumberCartItems]);

  useEffect(() => {
    loadCartDetail();
  }, [loadCartDetail]);

  const isAllSelected = cartItems.length > 0 && selectedCartItem.size === cartItems.length;
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCartItem(new Set());
    } else {
      setSelectedCartItem(new Set(cartItems.map(item => item.productId)));
    }
  };

  const handleSelectedCartItemChange = (productId: number) => {
    setSelectedCartItem((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) newSet.delete(productId);
      else newSet.add(productId);
      return newSet;
    });
  };

  const updateCartItemQuantity = async (productId: number, quantity: number) => {
    setCartItem(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
    try {
      await updateCartItem(productId, { quantity });
      fetchNumberCartItems();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecreaseQuantity = (productId: number) => {
    const item = cartItems.find(i => i.productId === productId);
    if (item && item.quantity > 1) updateCartItemQuantity(productId, item.quantity - 1);
    else handleDialogDeleteCartItem(productId);
  };

  const handleIncreaseQuantity = (productId: number) => {
    const item = cartItems.find(i => i.productId === productId);
    if (item) updateCartItemQuantity(productId, item.quantity + 1);
  };

  const handleDialogDeleteCartItem = (productId: number) => {
    setProductIdToRemove(productId);
    setIsShowDialog(true);
  };

  const handleDeleteCartItem = async () => {
    try {
      await deleteCartItemByProductId(productIdToRemove);
      setCartItem(prev => prev.filter(item => item.productId !== productIdToRemove));
      setSelectedCartItem(prev => {
        const newSet = new Set(prev);
        newSet.delete(productIdToRemove);
        return newSet;
      });
      fetchNumberCartItems();
      setIsShowDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const totalPrice = useMemo(() =>
    calculateTotalPrice(cartItems, Array.from(selectedCartItem)),
    [cartItems, selectedCartItem]
  );

  const handleCheckout = async () => {
    const selectedItems = cartItems.filter(item => selectedCartItem.has(item.productId));
    
    if (selectedItems.length === 0) return alert("Vui lòng chọn sản phẩm!");
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("checkoutType", CheckoutType.CART);
    }
    
    const checkoutData: Checkout = {
      email,
      note: '',
      promotionCode: '',
      checkoutItemVms: selectedItems.map(item => ({
        productId: item.productId,
        description: "",
        quantity: item.quantity
      }))
    };

    try {
      const res = await createCheckout(checkoutData);
      if (res?.id) {
        console.log("[Checkout] Success! Order ID:", res.id);
        router.push(`/checkouts/${res.id}`);
      } else {
        throw new Error("Server returned success but no ID found");
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error) {
        const err = error as { status: number };
        if (err.status === 403) {
          alert("Vui lòng đăng nhập");
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="container mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Giỏ hàng của bạn</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-2/3 space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="font-medium text-slate-700">Chọn tất cả ({cartItems.length})</span>
                </label>
                <button className="text-red-500 text-sm hover:underline">Xóa mục đã chọn</button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {isLoading ? (
                  <div className="p-20 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        isSelected={selectedCartItem.has(item.productId)}
                        handleSelectedCartItemChange={handleSelectedCartItemChange}
                        handleDecreaseQuantity={handleDecreaseQuantity}
                        handleIncreaseQuantity={handleIncreaseQuantity}
                        handleDialogDeleteCartItem={handleDialogDeleteCartItem} isLoading={false} />
                    ))}
                  </div>
                )}
              </div>

              <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Tiếp tục mua sắm
              </Link>
            </div>

            <div className="w-full lg:w-1/3 sticky top-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-5 border-b pb-4">Đơn hàng</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Tạm tính</span>
                    <span className="font-medium text-slate-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Giảm giá</span>
                    <span className="text-emerald-600">- {formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-sm">Tính khi thanh toán</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      placeholder="Mã giảm giá"
                      className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors">Áp dụng</button>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-900 font-bold">Tổng cộng</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{formatPrice(totalPrice)}</p>
                      <p className="text-xs text-slate-400">(Đã bao gồm VAT)</p>
                    </div>
                  </div>
                </div>

                <button
                  disabled={totalPrice === 0}
                  onClick={handleCheckout}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-[0.98]"
                >
                  Thanh toán ngay
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100 mt-10">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Giỏ hàng đang trống</h3>
            <p className="text-slate-500 mb-8">Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
            <Link href="/" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-all inline-block">
              Khám phá sản phẩm
            </Link>
          </div>
        )}
      </div>

      <ConfimationDialog
        isOpen={isShowDialog}
        title="Xóa sản phẩm?"
        okText="Xóa ngay"
        cancelText="Hủy"
        isShowCancel isShowOk
        cancel={() => setIsShowDialog(false)}
        ok={handleDeleteCartItem}
      >
        <p className="text-slate-600">Bạn chắc chắn muốn loại bỏ sản phẩm này khỏi giỏ hàng?</p>
      </ConfimationDialog>
    </div>
  )
}
export default Index;
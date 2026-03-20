import { OrderItemVm } from '@/modules/orders/model/OrderItemVm';
import { OrderVm } from '@/modules/orders/model/OrderVm';
import { getOrdersByOrderState } from '@/modules/orders/services/OrdersService';
import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/formatPrice'; // Giả sử bạn đã có hàm này

const STATUS_TABS = [
  { id: 'pending', label: 'Chờ xác nhận' },
  { id: 'accepted', label: 'Đã xác nhận' },
  { id: 'shipping', label: 'Đang giao' },
  { id: 'completed', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
];

export default function Myorders() {
  const [orders, setOrders] = useState<OrderVm[]>([]);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItemVm[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getOrdersByOrderState(orderStatus);
        console.log('Fetched orders:', res);
        setOrders(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [orderStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'PENDING': case 'pending_payment': return 'bg-amber-100 text-amber-700';
      case 'cancelled': case 'reject': return 'bg-rose-100 text-rose-700';
      case 'shipping': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Đơn hàng của tôi</h1>

        <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar pb-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setOrderStatus(tab.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                orderStatus === tab.id 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center"><div className="animate-spin h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" /></div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">Mã đơn: #{order.id}</span>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusColor(order.orderStatus as string)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <span className="text-sm text-slate-400 font-medium">Đặt ngày: 12/03/2024</span>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">
                        Số lượng: <span className="font-bold text-slate-900">{order.numberItem} sản phẩm</span>
                      </p>
                      <p className="text-sm text-slate-500">
                        Thanh toán: <span className="text-slate-900 font-medium">{order.paymentStatus}</span>
                      </p>
                    </div>

                    <div className="text-right space-y-3 w-full md:w-auto">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Tổng thanh toán</p>
                      <p className="text-2xl font-black text-emerald-600">{formatPrice(order.totalPrice)}</p>
                      
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => {
                            setSelectedOrderItems(Array.from(order.orderItemVms || []));
                            setIsModalOpen(true);
                          }}
                          className="px-5 py-2 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Chi tiết
                        </button>
                        {order.orderStatus === 'PENDING' && (
                           <button className="px-5 py-2 text-xs font-bold bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
                              Hủy đơn
                           </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">Bạn chưa có đơn hàng nào ở trạng thái này.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedOrderItems && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-900">Sản phẩm trong đơn hàng</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 text-xl">✕</button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {selectedOrderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center text-xs text-slate-400">Ảnh</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-slate-500">Số lượng: {item.quantity}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm font-bold text-emerald-600">{item.productPrice ? formatPrice(item.productPrice) : formatPrice(0)}</p>
                        {item.discountAmount && item.discountAmount > 0 && (
                          <p className="text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded">- {formatPrice(item.discountAmount)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
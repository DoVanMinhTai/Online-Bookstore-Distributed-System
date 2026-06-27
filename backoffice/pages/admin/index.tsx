import DashboardLayout from '../Layout';
import { ShoppingCart, Package, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const stats = [
    { title: 'Đơn hàng mới hôm nay', value: '128', change: '+12%', color: 'bg-indigo-500', textColor: 'text-indigo-600', bgLight: 'bg-indigo-50', icon: ShoppingCart },
    { title: 'Doanh thu tháng này', value: '45.2M₫', change: '+8.3%', color: 'bg-emerald-500', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50', icon: TrendingUp },
    { title: 'Sản phẩm hết hàng', value: '12', change: '-2', color: 'bg-rose-500', textColor: 'text-rose-600', bgLight: 'bg-rose-50', icon: Package },
    { title: 'Khách hàng mới', value: '89', change: '+5.1%', color: 'bg-violet-500', textColor: 'text-violet-600', bgLight: 'bg-violet-50', icon: Users },
];

const recentOrders = [
    { id: '#DH001', customer: 'Nguyễn Văn A', total: '450.000đ', status: 'Đang xử lý', statusColor: 'bg-amber-100 text-amber-700' },
    { id: '#DH002', customer: 'Trần Thị B', total: '320.000đ', status: 'Đã giao', statusColor: 'bg-emerald-100 text-emerald-700' },
    { id: '#DH003', customer: 'Lê Minh C', total: '780.000đ', status: 'Đang giao', statusColor: 'bg-sky-100 text-sky-700' },
    { id: '#DH004', customer: 'Phạm Hương D', total: '220.000đ', status: 'Đã huỷ', statusColor: 'bg-rose-100 text-rose-700' },
    { id: '#DH005', customer: 'Hoàng Anh E', total: '560.000đ', status: 'Đã giao', statusColor: 'bg-emerald-100 text-emerald-700' },
];

export default function AdminDashboard() {
    return (
        <DashboardLayout title="Bảng điều khiển">
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {stats.map((s) => (
                    <div key={s.title} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
                        <div className={`${s.bgLight} p-3 rounded-xl flex-shrink-0`}>
                            <s.icon size={22} className={s.textColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{s.title}</p>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">{s.value}</p>
                            <p className="text-xs font-medium text-emerald-600 mt-0.5">{s.change} so với tháng trước</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent orders table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Đơn hàng gần đây</h3>
                    <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                        Xem tất cả <ArrowUpRight size={14} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="text-left px-6 py-3 font-semibold">Mã đơn</th>
                                <th className="text-left px-6 py-3 font-semibold">Khách hàng</th>
                                <th className="text-right px-6 py-3 font-semibold">Tổng tiền</th>
                                <th className="text-center px-6 py-3 font-semibold">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-slate-700">{order.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-700">{order.customer}</td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{order.total}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${order.statusColor}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

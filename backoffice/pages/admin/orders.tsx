import DashboardLayout from '../Layout';
import { Search, Eye } from 'lucide-react';

const mockOrders = [
    { id: '#DH001', customer: 'Nguyễn Văn A', email: 'a@email.com', date: '20/06/2026', total: '450.000đ', payment: 'COD', status: 'Đang xử lý', statusColor: 'bg-amber-100 text-amber-700' },
    { id: '#DH002', customer: 'Trần Thị B', email: 'b@email.com', date: '20/06/2026', total: '320.000đ', payment: 'VNPay', status: 'Đã giao', statusColor: 'bg-emerald-100 text-emerald-700' },
    { id: '#DH003', customer: 'Lê Minh C', email: 'c@email.com', date: '19/06/2026', total: '780.000đ', payment: 'MoMo', status: 'Đang giao', statusColor: 'bg-sky-100 text-sky-700' },
    { id: '#DH004', customer: 'Phạm Hương D', email: 'd@email.com', date: '19/06/2026', total: '220.000đ', payment: 'COD', status: 'Đã huỷ', statusColor: 'bg-rose-100 text-rose-700' },
    { id: '#DH005', customer: 'Hoàng Anh E', email: 'e@email.com', date: '18/06/2026', total: '560.000đ', payment: 'Banking', status: 'Đã giao', statusColor: 'bg-emerald-100 text-emerald-700' },
];

export default function OrdersPage() {
    return (
        <DashboardLayout title="Quản lý đơn hàng">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm mã đơn, khách hàng..."
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['Tất cả', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã huỷ'].map(f => (
                        <button
                            key={f}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors
                                ${f === 'Tất cả' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="text-left px-6 py-3 font-semibold">Mã đơn</th>
                                <th className="text-left px-6 py-3 font-semibold">Khách hàng</th>
                                <th className="text-left px-6 py-3 font-semibold">Ngày đặt</th>
                                <th className="text-right px-6 py-3 font-semibold">Tổng tiền</th>
                                <th className="text-center px-6 py-3 font-semibold">Thanh toán</th>
                                <th className="text-center px-6 py-3 font-semibold">Trạng thái</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockOrders.map((o) => (
                                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-slate-700">{o.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-800">{o.customer}</p>
                                        <p className="text-xs text-slate-400">{o.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{o.date}</td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{o.total}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{o.payment}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${o.statusColor}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-500 hover:text-indigo-700 p-1 rounded-lg hover:bg-indigo-50 transition-colors">
                                            <Eye size={16} />
                                        </button>
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

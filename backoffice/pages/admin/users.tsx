import DashboardLayout from '../Layout';
import { Search, UserCheck, UserX } from 'lucide-react';

const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', joined: '01/01/2026', orders: 12, spent: '2.400.000đ', status: 'Hoạt động' },
    { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', joined: '15/02/2026', orders: 5, spent: '850.000đ', status: 'Hoạt động' },
    { id: 3, name: 'Lê Minh C', email: 'c@gmail.com', joined: '03/03/2026', orders: 0, spent: '0đ', status: 'Đã khoá' },
    { id: 4, name: 'Phạm Hương D', email: 'd@gmail.com', joined: '20/04/2026', orders: 8, spent: '1.600.000đ', status: 'Hoạt động' },
    { id: 5, name: 'Hoàng Anh E', email: 'e@gmail.com', joined: '10/05/2026', orders: 3, spent: '420.000đ', status: 'Hoạt động' },
];

export default function UsersPage() {
    return (
        <DashboardLayout title="Quản lý khách hàng">
            <div className="flex items-center gap-3 mb-6">
                <div className="relative w-full sm:w-80">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm khách hàng..."
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="text-left px-6 py-3 font-semibold">Khách hàng</th>
                                <th className="text-left px-6 py-3 font-semibold">Ngày đăng ký</th>
                                <th className="text-right px-6 py-3 font-semibold">Đơn hàng</th>
                                <th className="text-right px-6 py-3 font-semibold">Tổng chi</th>
                                <th className="text-center px-6 py-3 font-semibold">Trạng thái</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{u.name}</p>
                                                <p className="text-xs text-slate-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{u.joined}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-700">{u.orders}</td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{u.spent}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold
                                            ${u.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                                        >
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className={`p-1 rounded-lg transition-colors ${u.status === 'Hoạt động' ? 'text-rose-400 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}>
                                            {u.status === 'Hoạt động' ? <UserX size={16} /> : <UserCheck size={16} />}
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

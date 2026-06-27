import DashboardLayout from '../Layout';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';

const mockProducts = [
    { id: 1, name: 'Đắc Nhân Tâm', category: 'Kỹ năng sống', price: '89.000đ', stock: 45, status: 'Còn hàng' },
    { id: 2, name: 'Nhà Giả Kim', category: 'Tiểu thuyết', price: '72.000đ', stock: 0, status: 'Hết hàng' },
    { id: 3, name: 'Tư Duy Nhanh Và Chậm', category: 'Khoa học', price: '156.000đ', stock: 23, status: 'Còn hàng' },
    { id: 4, name: 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ', category: 'Kỹ năng sống', price: '68.000đ', stock: 8, status: 'Sắp hết' },
    { id: 5, name: 'Atomic Habits', category: 'Phát triển bản thân', price: '120.000đ', stock: 60, status: 'Còn hàng' },
];

export default function ProductsPage() {
    return (
        <DashboardLayout title="Quản lý sản phẩm">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                        />
                    </div>
                    <button className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        <Filter size={16} /> Lọc
                    </button>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-200">
                    <Plus size={16} /> Thêm sản phẩm
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                <th className="text-left px-6 py-3 font-semibold">Sản phẩm</th>
                                <th className="text-left px-6 py-3 font-semibold">Danh mục</th>
                                <th className="text-right px-6 py-3 font-semibold">Giá</th>
                                <th className="text-right px-6 py-3 font-semibold">Tồn kho</th>
                                <th className="text-center px-6 py-3 font-semibold">Trạng thái</th>
                                <th className="px-6 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-800">{p.name}</td>
                                    <td className="px-6 py-4 text-slate-500">{p.category}</td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{p.price}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700">{p.stock}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold
                                            ${p.status === 'Còn hàng' ? 'bg-emerald-100 text-emerald-700'
                                            : p.status === 'Hết hàng' ? 'bg-rose-100 text-rose-700'
                                            : 'bg-amber-100 text-amber-700'}`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Hiển thị 5 / 5 sản phẩm</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold disabled:opacity-40" disabled>← Trước</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold disabled:opacity-40" disabled>Sau →</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

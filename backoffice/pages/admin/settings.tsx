import DashboardLayout from '../Layout';
import { Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <DashboardLayout title="Cài đặt hệ thống">
            <div className="max-w-2xl space-y-6">
                {/* General */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-900 mb-5">Thông tin cửa hàng</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tên cửa hàng</label>
                            <input type="text" defaultValue="BookStore" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email liên hệ</label>
                            <input type="email" defaultValue="admin@bookstore.vn" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hotline</label>
                            <input type="text" defaultValue="01234567890" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" />
                        </div>
                    </div>
                </div>

                {/* Keycloak info */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-900 mb-1">Xác thực (Keycloak)</h3>
                    <p className="text-sm text-slate-500 mb-5">Cấu hình OAuth2 kết nối đến Keycloak.</p>
                    <div className="space-y-3 text-sm">
                        {[
                            { label: 'Realm', value: 'Identity' },
                            { label: 'Client ID', value: 'backoffice-bff' },
                            { label: 'Issuer URI', value: 'http://identity/realms/Identity' },
                        ].map(row => (
                            <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                <span className="text-slate-500 font-medium">{row.label}</span>
                                <code className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg text-xs font-mono">{row.value}</code>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-200">
                    <Save size={16} /> Lưu thay đổi
                </button>
            </div>
        </DashboardLayout>
    );
}

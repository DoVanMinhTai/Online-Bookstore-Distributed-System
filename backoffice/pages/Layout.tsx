import Head from 'next/head';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ChevronRight
} from 'lucide-react';

type Props = {
    children: React.ReactNode;
    title?: string;
}

const sidebarItems = [
    { name: 'Tổng quan',     href: '/admin',          icon: LayoutDashboard },
    { name: 'Sản phẩm',     href: '/admin/products', icon: Package },
    { name: 'Đơn hàng',     href: '/admin/orders',   icon: ShoppingCart },
    { name: 'Khách hàng',   href: '/admin/users',    icon: Users },
    { name: 'Cài đặt',      href: '/admin/settings', icon: Settings },
];

export default function DashboardLayout({ children, title = "Admin Dashboard" }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Head>
                <title>{title} | Admin Panel</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
                            B
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">BOOKSTORE <span className="text-indigo-400 text-xs">ADMIN</span></span>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            const isActive = router.pathname === item.href;
                            return (
                                <Link 
                                    key={item.href} 
                                    href={item.href}
                                    className={`
                                        flex items-center justify-between px-4 py-3 rounded-xl transition-all group
                                        ${isActive 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                                            : 'hover:bg-slate-800 hover:text-white'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight size={14} />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
                            <LogOut size={20} />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
                    <button 
                        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="hidden lg:block">
                        <h2 className="text-sm font-medium text-slate-500">Xin chào, <span className="text-slate-900 font-bold italic">Quản trị viên</span></h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-900">Admin Account</p>
                            <p className="text-[10px] text-emerald-500 font-medium">Online</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Admin" alt="Avatar" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
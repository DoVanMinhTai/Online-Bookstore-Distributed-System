import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/images/logo.webp';

// URL đăng nhập Keycloak qua BFF gateway
const LOGIN_URL = 'http://backoffice.local/oauth2/authorization/keycloak';

export default function LoginPage() {
    return (
        <>
            <Head>
                <title>Đăng nhập | BookStore Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
                </div>

                <div className="relative w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                        {/* Logo + Title */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-white/10 rounded-2xl p-3 mb-4 backdrop-blur-sm">
                                <Image
                                    src={logo}
                                    alt="BookStore Logo"
                                    width={64}
                                    height={64}
                                    className="object-contain"
                                />
                            </div>
                            <h1 className="text-2xl font-black text-white tracking-tight">
                                BOOKSTORE <span className="text-indigo-400">ADMIN</span>
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Hệ thống quản lý nội bộ
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-slate-500 text-xs">Xác thực bảo mật</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* Login button */}
                        <a
                            href={LOGIN_URL}
                            className="flex items-center justify-center gap-3 w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-150 shadow-lg shadow-indigo-900/40 cursor-pointer"
                        >
                            {/* Keycloak-like key icon */}
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Đăng nhập với Keycloak
                        </a>

                        {/* Info box */}
                        <div className="mt-5 bg-indigo-950/50 border border-indigo-800/40 rounded-2xl p-4">
                            <p className="text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">
                                🔐 Thông tin đăng nhập test
                            </p>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">Username</span>
                                    <code className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-md font-mono">admin</code>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">Password</span>
                                    <code className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-md font-mono">admin</code>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">Realm</span>
                                    <code className="bg-slate-800 text-sky-400 px-2 py-0.5 rounded-md font-mono">Identity</code>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 italic">
                                * Tạo user trong Keycloak Admin Console trước khi đăng nhập.
                            </p>
                        </div>

                        {/* Footer note */}
                        <p className="text-center text-xs text-slate-600 mt-6">
                            Bằng cách đăng nhập, bạn đồng ý với{' '}
                            <span className="text-slate-500 underline cursor-pointer">chính sách bảo mật</span>
                            {' '}của hệ thống.
                        </p>
                    </div>

                    {/* Keycloak badge */}
                    <p className="text-center text-slate-600 text-xs mt-4">
                        Powered by <span className="text-slate-400 font-semibold">Keycloak 26</span> · Spring Cloud Gateway
                    </p>
                </div>
            </div>
        </>
    );
}

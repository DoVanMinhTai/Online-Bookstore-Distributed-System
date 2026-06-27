import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faChevronDown, faChevronUp, faShield } from '@fortawesome/free-solid-svg-icons';

type AuthenticatedUser = { userName: string };
type AuthInfo = { isAuthenticated: boolean; authenticatedUser: AuthenticatedUser };

// Backoffice dùng BFF riêng → redirect về identity.local/keycloak
const KEYCLOAK_LOGIN  = 'http://identity.local/realms/Identity/protocol/openid-connect/auth?client_id=backoffice-bff&response_type=code&redirect_uri=http://storefront.local/login/oauth2/code/keycloak';
const AUTH_API        = 'http://backoffice.local/backoffice-bff/authentication/user';
const LOGOUT_URL      = 'http://backoffice.local/logout';

export default function AuthenticationInfo() {
    const [authInfo, setAuthInfo] = useState<AuthInfo>({
        isAuthenticated: false,
        authenticatedUser: { userName: '' },
    });
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, () => setOpen(false));

    useEffect(() => {
        fetch(AUTH_API, { credentials: 'include' })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.userName) {
                    setAuthInfo({ isAuthenticated: true, authenticatedUser: { userName: data.userName } });
                }
            })
            .catch(() => {});
    }, []);

    const handleLogout = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = LOGOUT_URL;
        document.body.appendChild(form);
        form.submit();
    };

    if (!authInfo.isAuthenticated) {
        return (
            <Link
                href="/login"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
            >
                <FontAwesomeIcon icon={faShield} className="text-xs" />
                Đăng nhập
            </Link>
        );
    }

    const initials = authInfo.authenticatedUser.userName.charAt(0).toUpperCase();
    const displayName = authInfo.authenticatedUser.userName.split('@')[0];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer"
            >
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                    {initials}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{displayName}</span>
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="text-[10px] opacity-70" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 z-50 bg-white text-slate-800 rounded-2xl shadow-xl w-56 border border-slate-100 py-2 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quản trị viên</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{displayName}</p>
                    </div>
                    <div className="py-1">
                        <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                            <FontAwesomeIcon icon={faUser} className="w-4 text-slate-400" />
                            Hồ sơ
                        </Link>
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

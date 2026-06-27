import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faListUl, faSignOutAlt, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function AuthenticationInfo() {
  type AuthenticatedUser = {
    userName: string;
  };

  type AuthenticationInfoVm = {
    isAuthenticated: boolean;
    authenticatedUser: AuthenticatedUser;
  };

  const [authenticatedInfoVm, setAuthenticatedInfoVm] = useState<AuthenticationInfoVm>({
    isAuthenticated: false,
    authenticatedUser: { userName: '' },
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setDropdownOpen(false);
  });

  async function getAuthenticationInfo(): Promise<AuthenticationInfoVm> {
    try {
      const res = await fetch(`http://storefront.local/authentication`);
      if (!res.ok) throw new Error("Failed to fetch Authentication Info")
      return await res.json();
    } catch (error) {
      return {
        isAuthenticated: false,
        authenticatedUser: { userName: '' },
      };
    }
  }

  useEffect(() => {
    getAuthenticationInfo().then((data) => {
      setAuthenticatedInfoVm(data);
    });
  }, []);

  const handleLogout = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://storefront.local/logout';
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {authenticatedInfoVm.isAuthenticated ? (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-full transition-all duration-200 focus:outline-none text-sm font-semibold cursor-pointer shadow-sm hover:shadow"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
              {authenticatedInfoVm.authenticatedUser.userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline max-w-[100px] truncate">
              {authenticatedInfoVm.authenticatedUser.userName.split('@')[0]}
            </span>
            <FontAwesomeIcon 
              icon={dropdownOpen ? faChevronUp : faChevronDown} 
              className="text-[10px] opacity-70 transition-transform duration-200" 
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 z-50 bg-white text-slate-800 rounded-2xl shadow-xl w-60 border border-slate-100 py-2 transition-all duration-200 animate-fadeIn">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tài khoản của</p>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {authenticatedInfoVm.authenticatedUser.userName.split('@')[0]}
                </p>
              </div>
              <div className="py-1">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-semibold">
                  <FontAwesomeIcon icon={faUser} className="w-4 text-slate-400 group-hover:text-emerald-600" />
                  Hồ sơ
                </Link>
                <Link href="/myorders" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-semibold">
                  <FontAwesomeIcon icon={faListUl} className="w-4 text-slate-400 group-hover:text-emerald-600" />
                  Danh sách đơn hàng
                </Link>
              </div>
              <div className="border-t border-slate-100 pt-1 mt-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left font-semibold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-4 text-rose-400" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link href="http://storefront.local/oauth2/authorization/keycloak" className="
        bg-slate-800 px-4 py-2 rounded-lg focus:outline-none 
        text-sm font-semibold text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
          Đăng nhập
        </Link>
      )}
    </div>
  );
}



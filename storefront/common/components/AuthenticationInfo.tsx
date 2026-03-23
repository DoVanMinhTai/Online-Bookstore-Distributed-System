import Link from 'next/link';
import { useEffect, useState } from 'react';


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

  return (
    <div className="">
      {authenticatedInfoVm.isAuthenticated ? (
        <div className="">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-slate-800 px-4 py-2 rounded-lg text-white focus:outline-none "
          >
            Tài Khoản
          </button>

          {dropdownOpen && (
            <div className="absolute mt-1 z-50 bg-gray-800 text-white rounded-md shadow-lg ">
              <div className="block text-lg px-4 py-2">
                Xin chào: {authenticatedInfoVm.authenticatedUser.userName.split('@')[0]}
              </div>
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-700">
                Hồ sơ
              </Link>
              <Link href="/myorders" className="block px-4 py-2 hover:bg-gray-700">
                Danh sách đơn hàng
              </Link>
              <Link href="/logout" className="block px-4 py-2 hover:bg-gray-700">
                Đăng xuất
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link href="http://storefront.local/oauth2/authorization/keycloak" className="
        bg-slate-800 px-4 py-2 rounded-lg  focus:outline-none 
        text-gray-300 hover:text-white">
          Đăng nhập
        </Link>
      )}
    </div>
  );
}

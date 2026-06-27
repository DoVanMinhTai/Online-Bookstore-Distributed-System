import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../assets/images/logo.webp'
import Image from 'next/image';
import CartModal from '@/modules/cart/components/CartModal';
import AuthenticationInfo from '../AuthenticationInfo';
import { useCartContext } from '@/context/CartContext';
import CategoryDropdown from './CategoryDropdown';

const Header = () => {
    const { numberCartItems } = useCartContext();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isActive = (path: string) => router.pathname === path;

    const navLinks = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Danh mục', href: '/categories', hasDropdown: true },
        { name: 'Giới thiệu', href: '/about' },
    ];

    return (
        <header className="w-full bg-white shadow-sm">
            <div className="bg-[#161519] text-white py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="hidden md:flex items-center gap-6 text-[12px] font-medium opacity-90">
                        <span>Hệ thống sách chính hãng</span>
                        <span className="w-px h-3 bg-gray-600"></span>
                        <span>Hotline: 01234576789</span>
                        <span className="w-px h-3 bg-gray-600"></span>
                        <span>Đặt sách lấy ngay tại TP. Hồ Chí Minh</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <a href="#" className="hover:text-blue-400 transition-colors"><FontAwesomeIcon icon={faFacebook} /></a>
                        <a href="#" className="hover:text-pink-400 transition-colors"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#" className="hover:text-red-400 transition-colors"><FontAwesomeIcon icon={faEnvelope} /></a>
                        <a href="#" className="hover:text-emerald-400 transition-colors"><FontAwesomeIcon icon={faPhone} /></a>
                    </div>
                </div>
            </div>

            <div className="container mx-auto flex justify-between px-4 py-3">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </Link>

                    <nav className="hidden lg:block">
                        <ul className="flex items-center gap-8">
                            {navLinks.map((link) => (
                                <li
                                    key={link.href}
                                    className="relative py-2"
                                    onMouseEnter={() => link.hasDropdown && setDropdownOpen(true)}
                                    onMouseLeave={() => link.hasDropdown && setDropdownOpen(false)}
                                >
                                    <Link
                                        href={link.href}
                                        className={`text-[14px] font-bold uppercase tracking-wide transition-all hover:text-emerald-600 flex items-center gap-1.5 ${
                                            isActive(link.href) ? "text-emerald-600" : "text-slate-700"
                                        }`}
                                    >
                                        {link.name}
                                        {link.hasDropdown && (
                                            <FontAwesomeIcon icon={faChevronDown} className="text-[10px] opacity-70" />
                                        )}
                                        {isActive(link.href) && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></span>
                                        )}
                                    </Link>
                                    {link.hasDropdown && dropdownOpen && <CategoryDropdown />}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative group p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
                        <CartModal />
                        {numberCartItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                                {numberCartItems}
                            </span>
                        )}
                    </div>

                    <div className="h-8 w-px bg-slate-200"></div>
                    <div className="flex items-center">
                        <AuthenticationInfo />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
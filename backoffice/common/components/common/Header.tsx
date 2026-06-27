import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../assets/images/logo.webp'
import Image from 'next/image';
import AuthenticationInfo from '../AuthenticationInfo';

const Header = () => {
    const router = useRouter();

    const isActive = (path: string) => router.pathname === path;

    const navLinks = [
        { name: 'Trang chủ', href: '/' },
        { name: 'Danh mục', href: '/categories' },
        { name: 'Giới thiệu', href: '/about' },
    ];

    return (
        <header className="w-full bg-white shadow-sm">
            {/* Header Top */}
            <div className="bg-[#161519] text-white py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="hidden md:flex items-center gap-6 text-[12px] font-medium opacity-90">
                        <span>Hệ thống quản lý Bookstore</span>
                        <span className="w-px h-3 bg-gray-600"></span>
                        <span>Hotline kỹ thuật: 01234576789</span>
                        <span className="w-px h-3 bg-gray-600"></span>
                        <span>Hệ thống sách chính hãng</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <a href="#" className="hover:text-blue-400 transition-colors"><FontAwesomeIcon icon={faFacebook} /></a>
                        <a href="#" className="hover:text-pink-400 transition-colors"><FontAwesomeIcon icon={faInstagram} /></a>
                        <a href="#" className="hover:text-red-400 transition-colors"><FontAwesomeIcon icon={faEnvelope} /></a>
                        <a href="#" className="hover:text-emerald-400 transition-colors"><FontAwesomeIcon icon={faPhone} /></a>
                    </div>
                </div>
            </div>

            {/* Header Center */}
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
                                <li key={link.href} className="relative py-2">
                                    <Link
                                        href={link.href}
                                        className={`text-[14px] font-bold uppercase tracking-wide transition-all hover:text-indigo-600 relative py-2 ${
                                            isActive(link.href) ? "text-indigo-600" : "text-slate-700"
                                        }`}
                                    >
                                        {link.name}
                                        {isActive(link.href) && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center">
                        <AuthenticationInfo />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
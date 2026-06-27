import React from 'react'
import logo from '../../../assets/images/logo.webp'
import Image from 'next/image'
import { faFacebook, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const Footer = () => {
  return (
    <footer className="mt-16 bg-[#161519] text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <div>
              <Image src={logo} alt="logo image" width={90} height={90} className="brightness-90 hover:brightness-100 transition-all" />
            </div>
            <p className="text-xs text-slate-400">
              Bản quyền © 2026 BookShop. Bảo lưu mọi quyền.
            </p>
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-emerald-500 transition-colors">
                <FontAwesomeIcon icon={faFacebook} className="text-lg" />
              </a>
              <a href="#" className="hover:text-emerald-500 transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="text-lg" />
              </a>
              <a href="#" className="hover:text-emerald-500 transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="text-lg" />
              </a>
              <a href="#" className="hover:text-emerald-500 transition-colors">
                <FontAwesomeIcon icon={faLinkedinIn} className="text-lg" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 mb-2">Về BookShop</h3>
              <a href="#" className="text-xs text-slate-400 hover:text-emerald-500 transition-colors">Giới thiệu</a>
              <a href="#" className="text-xs text-slate-400 hover:text-emerald-500 transition-colors">Tuyển dụng</a>
              <a href="#" className="text-xs text-slate-400 hover:text-emerald-500 transition-colors">Tin tức</a>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 mb-2">Hỗ trợ</h3>
              <a href="#" className="text-xs text-slate-400 hover:text-emerald-500 transition-colors">Trung tâm trợ giúp</a>
              <a href="#" className="text-xs text-slate-400 hover:text-emerald-500 transition-colors">Liên hệ với chúng tôi</a>
              <a href="#" className="text-xs text-slate-400 hover:text-emerald-500 transition-colors">Chính sách bảo mật</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 mb-3">Đăng ký nhận bản tin</h3>
            <p className="text-xs text-slate-400 mb-3">Nhận tin tức mới nhất về các chương trình khuyến mãi và sách mới ra mắt.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full p-2.5 text-xs rounded-l-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button className="px-4 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-r-lg hover:bg-emerald-500 transition-colors cursor-pointer">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import React from 'react'
import mainBanner1 from '../../../assets/images/main-banner-1.jpg'
import mainBanner2 from '../../../assets/images/main-banner-2.jpg'
import mainBanner3 from '../../../assets/images/main-banner-3.jpg'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, Pagination } from 'swiper/modules'
import Link from 'next/link'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
    {
        img: mainBanner1.src,
        badge: 'Khuyến mãi đặc biệt',
        title: 'Giảm đến 50%\nSách Bestseller',
        sub: 'Hàng ngàn đầu sách chính hãng, giao nhanh toàn quốc.',
        cta: 'Mua ngay',
        ctaHref: '/categories',
        accent: 'from-emerald-900/70 to-slate-900/30',
    },
    {
        img: mainBanner2.src,
        badge: 'Sách mới tháng 6',
        title: 'Khám phá\nTủ sách mới nhất',
        sub: 'Cập nhật liên tục các đầu sách hot nhất trong tháng.',
        cta: 'Xem ngay',
        ctaHref: '/categories',
        accent: 'from-slate-900/70 to-sky-900/30',
    },
    {
        img: mainBanner3.src,
        badge: 'Thành viên mới',
        title: 'Đăng ký nhận\nVoucher 30.000đ',
        sub: 'Ưu đãi dành riêng cho khách hàng đăng ký lần đầu.',
        cta: 'Đăng ký',
        ctaHref: '/profile',
        accent: 'from-indigo-900/70 to-rose-900/20',
    },
]

const promoCards = [
    {
        gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        icon: '🔥',
        tag: 'Flash Sale',
        title: 'Giảm đến 50%',
        desc: 'Sách bestseller số lượng có hạn',
        badge: 'Hôm nay',
        badgeColor: 'bg-yellow-400 text-yellow-900',
    },
    {
        gradient: 'bg-gradient-to-br from-violet-600 to-indigo-700',
        icon: '🎁',
        tag: 'Thành viên mới',
        title: 'Voucher 30K',
        desc: 'Cho đơn hàng đầu tiên của bạn',
        badge: 'Miễn phí',
        badgeColor: 'bg-emerald-400 text-emerald-900',
    },
    {
        gradient: 'bg-gradient-to-br from-rose-500 to-pink-600',
        icon: '🚚',
        tag: 'Freeship',
        title: 'Miễn phí vận chuyển',
        desc: 'Cho đơn từ 150.000đ toàn quốc',
        badge: 'Luôn luôn',
        badgeColor: 'bg-white text-rose-600',
    },
]

const Banner = () => {
    return (
        <div className="mt-4 max-w-full px-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* ── Main Swiper ── */}
                <div className="lg:col-span-2">
                    <div className="relative overflow-hidden rounded-2xl shadow-md" style={{ height: '380px' }}>
                        <Swiper
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 4500, disableOnInteraction: false }}
                            loop
                            modules={[Navigation, Autoplay, Pagination]}
                            className="h-full w-full banner-swiper"
                        >
                            {slides.map((slide, i) => (
                                <SwiperSlide key={i} className="relative">
                                    <img
                                        src={slide.img}
                                        className="h-full w-full object-cover"
                                        alt={`Banner ${i + 1}`}
                                    />
                                    {/* Gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
                                    {/* Text content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                                        <span className="mb-2 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                                            {slide.badge}
                                        </span>
                                        <h2 className="text-2xl font-extrabold leading-tight text-white drop-shadow-md whitespace-pre-line md:text-3xl">
                                            {slide.title}
                                        </h2>
                                        <p className="mt-2 max-w-xs text-sm text-white/80">
                                            {slide.sub}
                                        </p>
                                        <Link
                                            href={slide.ctaHref}
                                            className="mt-4 inline-block w-fit rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-emerald-400 active:scale-95 transition-all"
                                        >
                                            {slide.cta} →
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                {/* ── Promo Cards ── */}
                <div className="flex flex-col gap-3">
                    {promoCards.map((card, i) => (
                        <div
                            key={i}
                            className={`${card.gradient} relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl p-5 text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer`}
                        >
                            {/* decorative circle */}
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl">{card.icon}</span>
                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${card.badgeColor}`}>
                                        {card.badge}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs font-medium uppercase tracking-widest opacity-80">
                                    {card.tag}
                                </p>
                                <p className="mt-0.5 text-base font-extrabold leading-snug">
                                    {card.title}
                                </p>
                                <p className="mt-1 text-xs opacity-75">
                                    {card.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banner
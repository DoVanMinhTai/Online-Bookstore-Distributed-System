import React, { useState } from 'react';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        // TODO: gọi API đăng ký newsletter
        setSubmitted(true);
        toast.success('Đăng ký thành công! Cảm ơn bạn 🎉');
        setEmail('');
    };

    return (
        <section className="mx-4 my-10 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-lg">
            <div className="container mx-auto flex flex-col items-center gap-6 px-6 py-14 text-center md:flex-row md:text-left md:gap-12 md:py-12">
                {/* Left */}
                <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200">
                        Bản tin BookShop
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold text-white md:text-3xl">
                        Đừng bỏ lỡ sách mới & ưu đãi hot
                    </h2>
                    <p className="mt-2 max-w-sm text-sm text-emerald-100">
                        Đăng ký nhận email để cập nhật ngay các đầu sách mới ra, khuyến mãi độc quyền và mã giảm giá hàng tuần.
                    </p>
                </div>

                {/* Right — form */}
                <div className="w-full md:w-auto md:min-w-[360px]">
                    {submitted ? (
                        <div className="flex flex-col items-center gap-2 text-white">
                            <span className="text-4xl">🎉</span>
                            <p className="font-semibold">Bạn đã đăng ký thành công!</p>
                            <p className="text-sm text-emerald-100">Chúng tôi sẽ gửi thông tin đến email của bạn sớm nhất.</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-2 text-xs underline text-emerald-200 hover:text-white"
                            >
                                Đăng ký email khác
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập địa chỉ email của bạn..."
                                className="flex-1 rounded-xl border border-emerald-400 bg-white/10 px-4 py-3 text-sm text-white placeholder-emerald-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                            />
                            <button
                                type="submit"
                                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 shadow hover:bg-emerald-50 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
                            >
                                Đăng ký ngay
                            </button>
                        </form>
                    )}
                    <p className="mt-3 text-center text-xs text-emerald-200 sm:text-left">
                        Không spam. Huỷ đăng ký bất cứ lúc nào.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;

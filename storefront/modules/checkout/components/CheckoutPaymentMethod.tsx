import React from 'react';
import { PaymentMethod } from '@/modules/orders/model/enum/PaymentMethod';
import { DeliveryMethod } from '@/modules/orders/model/enum/DeliveryMethod';

interface CheckoutFormData {
    paymentMethod?: PaymentMethod;
    deliveryMethod?: DeliveryMethod;
}

type Props = {
    model?: CheckoutFormData;
    onUpdate: (data: CheckoutFormData) => void;
};

// ── Payment method definitions ──────────────────────────────────────────────
const PAYMENT_OPTIONS: {
    value: PaymentMethod;
    label: string;
    description: string;
    icon: string;
    badge?: string;
    badgeColor?: string;
    testNote?: string;
}[] = [
    {
        value: PaymentMethod.COD,
        label: 'Thanh toán khi nhận hàng',
        description: 'Trả tiền mặt trực tiếp cho shipper khi nhận hàng.',
        icon: '💵',
    },
    {
        value: PaymentMethod.VNPAY,
        label: 'VNPay',
        description: 'Cổng thanh toán VNPay — ATM, Visa, QR.',
        icon: '🏦',
        badge: 'Sandbox',
        badgeColor: 'bg-blue-100 text-blue-700',
        testNote: 'Thẻ test: 9704198526191432198 / NGUYEN VAN A / 07/15 / OTP: 123456',
    },
    {
        value: PaymentMethod.MOMO,
        label: 'MoMo',
        description: 'Ví điện tử MoMo — quét QR hoặc số điện thoại.',
        icon: '🟣',
        badge: 'Sandbox',
        badgeColor: 'bg-pink-100 text-pink-700',
        testNote: 'SĐT test: 0000000000 — dùng môi trường MoMo Sandbox.',
    },
    {
        value: PaymentMethod.ZALOPAY,
        label: 'ZaloPay',
        description: 'Ví ZaloPay — thanh toán nhanh qua app Zalo.',
        icon: '🔵',
        badge: 'Sandbox',
        badgeColor: 'bg-sky-100 text-sky-700',
        testNote: 'Tài khoản test: 0123456789 — ZaloPay Sandbox.',
    },
    {
        value: PaymentMethod.BANKING,
        label: 'Chuyển khoản ngân hàng',
        description: 'Chuyển khoản trực tiếp qua Internet Banking.',
        icon: '🏧',
        testNote: 'Ngân hàng test: STK 1234567890 — NGUYEN VAN A — NH: Test Bank.',
    },
    {
        value: PaymentMethod.PAYPAL,
        label: 'PayPal',
        description: 'Thanh toán quốc tế qua tài khoản PayPal.',
        icon: '🅿️',
        badge: 'Sandbox',
        badgeColor: 'bg-indigo-100 text-indigo-700',
        testNote: 'Buyer test: sb-buyer@example.com / password: test1234 — PayPal Sandbox.',
    },
];

// ── Delivery method definitions ──────────────────────────────────────────────
const DELIVERY_OPTIONS: {
    value: DeliveryMethod;
    label: string;
    icon: string;
    fee: string;
    eta: string;
}[] = [
    {
        value: DeliveryMethod.VIETTEL_POST,
        label: 'Viettel Post',
        icon: '🚚',
        fee: '25.000đ',
        eta: '2–3 ngày',
    },
    {
        value: DeliveryMethod.GRAB_EXPRESS,
        label: 'Grab Express',
        icon: '🛵',
        fee: '30.000đ',
        eta: 'Trong ngày',
    },
    {
        value: DeliveryMethod.SHOPPE_EXPRESS,
        label: 'Shopee Express',
        icon: '📦',
        fee: '20.000đ',
        eta: '3–5 ngày',
    },
];

export default function CheckoutPaymentMethod({ model, onUpdate }: Props) {
    const selectedPayment  = model?.paymentMethod;
    const selectedDelivery = model?.deliveryMethod;

    const selectedPaymentObj = PAYMENT_OPTIONS.find(o => o.value === selectedPayment);

    return (
        <div className="space-y-8">
            {/* ── Delivery ───────────────────────────────────── */}
            <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Đơn vị vận chuyển
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {DELIVERY_OPTIONS.map((opt) => {
                        const active = selectedDelivery === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onUpdate({ deliveryMethod: opt.value })}
                                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150
                                    ${active
                                        ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="mt-0.5 text-2xl">{opt.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold ${active ? 'text-emerald-700' : 'text-slate-800'}`}>
                                        {opt.label}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">{opt.eta}</p>
                                    <p className={`mt-1 text-xs font-semibold ${active ? 'text-emerald-600' : 'text-slate-600'}`}>
                                        {opt.fee}
                                    </p>
                                </div>
                                {active && (
                                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Payment ───────────────────────────────────── */}
            <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                    Phương thức thanh toán
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {PAYMENT_OPTIONS.map((opt) => {
                        const active = selectedPayment === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onUpdate({ paymentMethod: opt.value })}
                                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150
                                    ${active
                                        ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="mt-0.5 text-2xl">{opt.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-bold ${active ? 'text-emerald-700' : 'text-slate-800'}`}>
                                            {opt.label}
                                        </p>
                                        {opt.badge && (
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${opt.badgeColor}`}>
                                                {opt.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                                        {opt.description}
                                    </p>
                                </div>
                                {active && (
                                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Test credentials hint */}
                {selectedPaymentObj?.testNote && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                        <span className="text-base">🧪</span>
                        <div>
                            <p className="text-xs font-bold text-amber-700">Thông tin test (Sandbox)</p>
                            <p className="mt-0.5 text-xs text-amber-600">{selectedPaymentObj.testNote}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

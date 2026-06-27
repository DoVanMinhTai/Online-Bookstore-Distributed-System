import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getProductById } from '@/modules/catalog/services/ProductService';
import { ProductThumbnail } from '@/modules/homepage/models/ProductThumbnail';
import { Address } from '@/modules/address/model/Address';
import { OrdersPostVm } from '@/modules/orders/model/OrdersPostVm';
import { Checkout } from '@/modules/checkout/models/Checkout';
import { getCheckoutById } from '@/modules/checkout/services/CheckoutService';
import CheckoutShippingInfo from '@/modules/checkout/components/CheckoutShippingInfo';
import CheckoutPaymentMethod from '@/modules/checkout/components/CheckoutPaymentMethod';
import CheckoutProductList from '@/modules/checkout/components/CheckoutProductList';
import { PaymentMethod } from '@/modules/orders/model/enum/PaymentMethod';
import { DeliveryMethod } from '@/modules/orders/model/enum/DeliveryMethod';
import { PaymentStatus } from '@/modules/orders/model/enum/PaymentStatus';
import { useCartContext } from '@/context/CartContext';
import { useCheckout } from '@/hooks/useCheckout';
import toast from 'react-hot-toast';

interface CheckoutFormData {
    paymentMethod?: PaymentMethod;
    deliveryMethod?: DeliveryMethod;
}

// Step indicator
const STEPS = ['Thông tin giao hàng', 'Vận chuyển & Thanh toán', 'Xác nhận đơn hàng'];

const CheckoutPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [step, setStep] = useState(0); // 0 | 1 | 2
    const [checkout, setCheckout] = useState<Checkout>();
    const [products, setProducts] = useState<ProductThumbnail[]>([]);
    const [shippingAddress, setShippingAddress] = useState<Address>();
    const [billingAddress, setBillingAddress] = useState<Address>();
    const [checkoutFormData, setCheckoutFormData] = useState<CheckoutFormData>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { fetchNumberCartItems } = useCartContext();
    const { processOrder } = useCheckout(fetchNumberCartItems);

    // ── Fetch checkout ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!id) return;
        getCheckoutById(id as string)
            .then(setCheckout)
            .catch((err) => {
                if (err == 404) router.push('/404');
                else router.push('/login');
            });
    }, [id, router]);

    // ── Fetch products ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!checkout?.checkoutItemVms?.length) return;
        const ids = checkout.checkoutItemVms.map(i => i.productId);
        getProductById(ids).then(setProducts).catch(console.error);
    }, [checkout]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleAddress = useCallback((billing: Address, shipping: Address) => {
        setShippingAddress(shipping);
        setBillingAddress(billing);
    }, []);

    const handleUpdateForm = (data: CheckoutFormData) => {
        setCheckoutFormData(prev => ({ ...prev, ...data }));
    };

    const canGoNext = (): boolean => {
        if (step === 0) return !!(shippingAddress && billingAddress);
        if (step === 1) return !!(checkoutFormData.paymentMethod && checkoutFormData.deliveryMethod);
        return true;
    };

    const handleSubmitOrder = async () => {
        if (!checkout || !shippingAddress || !billingAddress) {
            toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
            return;
        }
        if (!checkoutFormData.paymentMethod || !checkoutFormData.deliveryMethod) {
            toast.error('Vui lòng chọn phương thức vận chuyển và thanh toán');
            return;
        }

        setIsSubmitting(true);
        const ordersPostVm: OrdersPostVm = {
            checkoutId: checkout.id,
            email: checkout.email,
            shippingAddressPostVm: shippingAddress,
            billingAddressPostVm: billingAddress,
            note: checkout.note,
            tax: 0,
            discount: 0,
            numberItem: products.length,
            totalPrice: products.reduce((sum, p) => {
                const qty = checkout.checkoutItemVms?.find(i => i.productId === p.id)?.quantity ?? 1;
                return sum + p.price * qty;
            }, 0),
            deliveryFee: 0,
            couponCode: checkout.promotionCode,
            deliveryMethod: checkoutFormData.deliveryMethod,
            paymentMethod: checkoutFormData.paymentMethod,
            paymentStatus: PaymentStatus.PENDING,
            orderItemPostVmList: checkout.checkoutItemVms?.map(item => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                productPrice: item.productPrice,
                note: '',
                discountAmount: item.discountAmount,
                taxAmount: 0,
                taxPercent: 0,
            })),
        };

        try {
            const order = await processOrder(ordersPostVm);
            if (order) {
                router.push(`/order-success/${order.id}`);
            } else {
                toast.error('Đặt hàng thất bại, vui lòng thử lại');
            }
        } catch {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (!checkout) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
                    <p className="text-sm">Đang tải đơn hàng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* ── Page header ── */}
                <div className="mb-8 flex items-center gap-3">
                    <Link href="/carts" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">
                        ← Giỏ hàng
                    </Link>
                    <span className="text-slate-300">/</span>
                    <h1 className="text-xl font-bold text-slate-800">Thanh toán</h1>
                </div>

                {/* ── Step indicator ── */}
                <div className="mb-8">
                    <div className="flex items-center gap-0">
                        {STEPS.map((label, i) => (
                            <React.Fragment key={i}>
                                <div className="flex flex-col items-center gap-1.5">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all
                                            ${i < step ? 'bg-emerald-500 text-white'
                                            : i === step ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                            : 'bg-slate-200 text-slate-500'}`}
                                    >
                                        {i < step ? '✓' : i + 1}
                                    </div>
                                    <span className={`hidden sm:block text-xs font-semibold whitespace-nowrap
                                        ${i === step ? 'text-emerald-600' : i < step ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`h-0.5 flex-1 mx-2 rounded transition-all ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left — Steps */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* STEP 0 — Shipping info */}
                        <StepCard
                            stepNum={0}
                            currentStep={step}
                            title="Thông tin giao hàng"
                            icon="🏠"
                        >
                            <CheckoutShippingInfo
                                checkout={checkout}
                                handleAddress={handleAddress}
                            />
                        </StepCard>

                        {/* STEP 1 — Payment & delivery */}
                        <StepCard
                            stepNum={1}
                            currentStep={step}
                            title="Vận chuyển & Thanh toán"
                            icon="💳"
                        >
                            <CheckoutPaymentMethod
                                model={checkoutFormData}
                                onUpdate={handleUpdateForm}
                            />
                        </StepCard>

                        {/* STEP 2 — Confirm */}
                        {step === 2 && (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">✅</span>
                                    <div>
                                        <h3 className="font-bold text-emerald-800">Xác nhận đơn hàng</h3>
                                        <p className="mt-1 text-sm text-emerald-700">
                                            Vui lòng kiểm tra lại thông tin bên phải trước khi đặt hàng.
                                        </p>
                                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-lg bg-white px-4 py-3 border border-emerald-100">
                                                <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Vận chuyển</p>
                                                <p className="font-bold text-slate-700">{checkoutFormData.deliveryMethod?.replaceAll('_', ' ')}</p>
                                            </div>
                                            <div className="rounded-lg bg-white px-4 py-3 border border-emerald-100">
                                                <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Thanh toán</p>
                                                <p className="font-bold text-slate-700">{checkoutFormData.paymentMethod}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Navigation buttons ── */}
                        <div className="flex items-center justify-between pt-2">
                            {step > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(s => s - 1)}
                                    className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    ← Quay lại
                                </button>
                            ) : <div />}

                            {step < 2 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(s => s + 1)}
                                    disabled={!canGoNext()}
                                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 transition-all active:scale-95"
                                >
                                    Tiếp tục →
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmitOrder}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all active:scale-95"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        '🎉 Đặt hàng ngay'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right — Order summary (sticky) */}
                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <CheckoutProductList
                            products={products}
                            checkoutItems={checkout.checkoutItemVms ?? []}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── StepCard helper ───────────────────────────────────────────────────────────
interface StepCardProps {
    stepNum: number;
    currentStep: number;
    title: string;
    icon: string;
    children: React.ReactNode;
}

function StepCard({ stepNum, currentStep, title, icon, children }: StepCardProps) {
    const active   = currentStep === stepNum;
    const done     = currentStep > stepNum;

    return (
        <div
            className={`rounded-2xl border transition-all duration-200
                ${active ? 'border-emerald-200 bg-white shadow-md' : done ? 'border-slate-100 bg-white/60' : 'border-slate-200 bg-white/40 opacity-50 pointer-events-none'}
            `}
        >
            <div
                className={`flex items-center gap-3 px-6 py-4 border-b
                    ${active ? 'border-emerald-100' : 'border-slate-100'}`}
            >
                <span className="text-xl">{icon}</span>
                <h2 className={`font-bold text-sm ${active ? 'text-emerald-700' : done ? 'text-slate-600' : 'text-slate-400'}`}>
                    {title}
                </h2>
                {done && <span className="ml-auto text-emerald-500 text-sm font-bold">✓ Hoàn thành</span>}
            </div>
            {active && (
                <div className="p-6">
                    {children}
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;

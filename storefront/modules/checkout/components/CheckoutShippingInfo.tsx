import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AddressForm from '@/modules/address/components/AddressForm';
import { createUserAddress } from '@/modules/address/service/Address';
import { getAddressBillingList, getAddressDefault, getUserAddressList } from '@/modules/profile/service/ProfileService';
import { getAllCountries } from '@/modules/country/service/CountryService';
import { getStateOrProvinces } from '@/modules/stateorprovince/services/StateOrProvince';
import { CountryVm } from '@/modules/country/model/CountryVm';
import { StateOrProvince } from '@/modules/stateorprovince/model/StateOrProvince';
import { Address } from '@/modules/address/model/Address';
import { AddressGetVm } from '@/modules/address/model/AddressGetVm';

type ModalType = 'SHIPPING_LIST' | 'BILLING_LIST' | 'CREATE' | null;

interface CheckoutShippingInfoProps {
    checkout?: { email?: string; note?: string };
    handleAddress: (shipping: Address, billing: Address) => void;
}

export default function CheckoutShippingInfo({ checkout, handleAddress }: CheckoutShippingInfoProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<AddressGetVm>();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [billingAddresses, setBillingAddresses] = useState<Address[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<Address | null>(null);
    const [selectedBilling, setSelectedBilling] = useState<Address | null>(null);
    const [meta, setMeta] = useState<{ countries: CountryVm[]; states: StateOrProvince[] }>({ countries: [], states: [] });
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    useEffect(() => {
        Promise.all([
            getUserAddressList(), getAddressBillingList(), getAddressDefault(),
            getAllCountries(), getStateOrProvinces()
        ]).then(([list, billingList, def, countries, states]) => {
            setAddresses(list);
            setBillingAddresses(billingList);
            setSelectedShipping(def ?? null);
            setMeta({ countries, states });
        });
    }, []);

    const getFullAddress = (item: Address | null | undefined): string => {
        if (!item) return '';
        const s = meta.states.find(i => i.id === item.stateOrProvinceId)?.name ?? '';
        const c = meta.countries.find(i => i.id === item.countryId)?.name ?? '';
        return [item.addressLine1, item.addressLine2, s, c].filter(Boolean).join(', ');
    };

    useEffect(() => {
        if (selectedShipping && selectedBilling) handleAddress(selectedShipping, selectedBilling);
    }, [selectedShipping, selectedBilling, handleAddress]);

    return (
        <>
            <div className="space-y-5">
                {/* Email / note */}
                {(checkout?.email || checkout?.note) && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm space-y-2">
                        {checkout.email && (
                            <div className="flex items-center gap-2 text-slate-600">
                                <span className="text-base">✉️</span>
                                <span className="font-semibold">{checkout.email}</span>
                            </div>
                        )}
                        {checkout.note && (
                            <div className="flex items-start gap-2 text-slate-500">
                                <span className="text-base">📝</span>
                                <span className="italic">{checkout.note}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Shipping address */}
                <AddressBlock
                    icon="🏠"
                    title="Địa chỉ nhận hàng"
                    address={selectedShipping}
                    fullAddress={getFullAddress(selectedShipping)}
                    onChange={() => setActiveModal('SHIPPING_LIST')}
                />

                {/* Billing address */}
                <AddressBlock
                    icon="🧾"
                    title="Địa chỉ thanh toán"
                    address={selectedBilling}
                    fullAddress={getFullAddress(selectedBilling)}
                    onChange={() => setActiveModal('BILLING_LIST')}
                />
            </div>

            {/* Address selector modal */}
            {(activeModal === 'SHIPPING_LIST' || activeModal === 'BILLING_LIST') && (
                <AddressSelectorModal
                    title={activeModal === 'SHIPPING_LIST' ? 'Chọn địa chỉ nhận hàng' : 'Chọn địa chỉ thanh toán'}
                    list={activeModal === 'SHIPPING_LIST' ? addresses : billingAddresses}
                    selectedId={activeModal === 'SHIPPING_LIST' ? selectedShipping?.id : selectedBilling?.id}
                    getFullAddress={getFullAddress}
                    onSelect={(item) => {
                        if (activeModal === 'SHIPPING_LIST') setSelectedShipping(item);
                        else setSelectedBilling(item);
                        setActiveModal(null);
                    }}
                    onAddNew={() => setActiveModal('CREATE')}
                    onClose={() => setActiveModal(null)}
                />
            )}

            {/* Create address modal */}
            {activeModal === 'CREATE' && (
                <AddressForm
                    handleSubmit={handleSubmit(async (data) => {
                        try {
                            await createUserAddress(data);
                            window.location.reload();
                        } catch (error) {
                            alert(error instanceof Error ? error.message : 'Lưu địa chỉ thất bại');
                        }
                    })}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    isDisplay={true}
                    onClose={() => setActiveModal(null)}
                    titleModal="Thêm địa chỉ mới"
                    address={undefined}
                />
            )}
        </>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface AddressBlockProps {
    icon: string;
    title: string;
    address: Address | null;
    fullAddress: string;
    onChange: () => void;
}

function AddressBlock({ icon, title, address, fullAddress, onChange }: AddressBlockProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <h3 className="text-sm font-bold text-slate-700">{title}</h3>
                </div>
                <button
                    type="button"
                    onClick={onChange}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                >
                    {address ? 'Thay đổi' : 'Chọn địa chỉ'}
                </button>
            </div>
            {address ? (
                <div className="text-sm space-y-0.5">
                    <p className="font-bold text-slate-800">{address.contactName}
                        <span className="ml-2 font-normal text-slate-500">{address.phone}</span>
                    </p>
                    <p className="text-slate-500 text-xs">{fullAddress}</p>
                </div>
            ) : (
                <p className="text-xs text-slate-400 italic">Chưa chọn địa chỉ — vui lòng chọn để tiếp tục</p>
            )}
        </div>
    );
}

interface AddressSelectorModalProps {
    title: string;
    list: Address[];
    selectedId?: number;
    getFullAddress: (a: Address) => string;
    onSelect: (a: Address) => void;
    onAddNew: () => void;
    onClose: () => void;
}

function AddressSelectorModal({ title, list, selectedId, getFullAddress, onSelect, onAddNew, onClose }: AddressSelectorModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h3 className="font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-xl text-slate-400 hover:text-slate-600 leading-none">&times;</button>
                </div>
                {/* List */}
                <div className="overflow-y-auto px-6 py-4 space-y-3 flex-1">
                    {list.length === 0 ? (
                        <p className="text-center text-sm text-slate-400 py-8">Chưa có địa chỉ nào</p>
                    ) : list.map((item) => {
                        const active = selectedId === item.id;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onSelect(item)}
                                className={`w-full text-left rounded-xl border-2 p-4 transition-all
                                    ${active
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800">
                                            {item.contactName}
                                            <span className="ml-2 font-normal text-slate-500">{item.phone}</span>
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500 truncate">{getFullAddress(item)}</p>
                                    </div>
                                    {active && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold flex-shrink-0">✓</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
                {/* Footer */}
                <div className="border-t border-slate-100 px-6 py-4 flex justify-end">
                    <button
                        type="button"
                        onClick={onAddNew}
                        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
                    >
                        + Thêm địa chỉ mới
                    </button>
                </div>
            </div>
        </div>
    );
}

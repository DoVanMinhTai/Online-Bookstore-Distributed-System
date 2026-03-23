import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AddressForm from '@/modules/address/components/AddressForm';
import { Address } from '@/modules/address/model/AddressGetVm';
import { createUserAddress, updateAddress } from '@/modules/address/service/Address';
import { AddressDetailVm } from '@/modules/address/model/Address';
import { getAddressBillingList, getAddressDefault, getUserAddressList } from '@/modules/profile/service/ProfileService';
import { getAllCountries } from '@/modules/country/service/CountryService';
import { CountryVm } from '@/modules/country/model/CountryVm';
import { getStateOrProvinces } from '@/modules/stateorprovince/services/StateOrProvince';
import { StateOrProvince } from '@/modules/stateorprovince/model/StateOrProvince';
import { getDistrictsList } from '@/modules/districts/services/Districts';
import { Districts } from '@/modules/districts/model/Districts';

type ModalType = 'SHIPPING_LIST' | 'BILLING_LIST' | 'CREATE' | 'UPDATE' | null;

interface CheckoutShippingInfoProps {
    checkout?: {
        email?: string;
        note?: string;
    };
    handleAddress: (shipping: AddressDetailVm, billing: AddressDetailVm) => void;
}

interface AddressSectionProps {
    title: string;
    selected: AddressDetailVm | null;
    fullAddress: string;
    onAction: () => void;
}

interface SelectionModalProps {
    title: string;
    list: AddressDetailVm[];
    selectedId?: number;
    onSelect: (item: AddressDetailVm) => void;
    getFullAddress: (item: AddressDetailVm) => string;
    onClose: () => void;
    onAddNew: () => void;
}

export default function CheckoutShippingInfo({ checkout, handleAddress }: CheckoutShippingInfoProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Address>();
    
    const [addresses, setAddresses] = useState<AddressDetailVm[]>([]);
    const [billingAddresses, setBillingAddresses] = useState<AddressDetailVm[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<AddressDetailVm | null>(null);
    const [selectedBilling, setSelectedBilling] = useState<AddressDetailVm | null>(null);
    
    const [meta, setMeta] = useState<{ countries: CountryVm[]; states: StateOrProvince[]; districts: Districts[] }>({
        countries: [],
        states: [],
        districts: []
    });
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    useEffect(() => {
        Promise.all([
            getUserAddressList(), getAddressBillingList(), getAddressDefault(),
            getAllCountries(), getStateOrProvinces(), getDistrictsList()
        ]).then(([list, billingList, def, countries, states, districts]) => {
            setAddresses(list);
            setBillingAddresses(billingList);
            setSelectedShipping(def ?? null);
            setMeta({ countries, states, districts });
        });
    }, []);

    const getFullAddress = (item: AddressDetailVm | null | undefined) => {
        if (!item) return "";
        const d = meta.districts.find((i) => i.id === item.districtId)?.name;
        const s = meta.states.find((i) => i.id === item.stateOrProvinceId)?.name;
        const c = meta.countries.find((i) => i.id === item.countryId)?.name;
        return `${item.addressLine1}, ${item.addressLine2 ? item.addressLine2 + ', ' : ''}${d}, ${s}, ${c}`;
    };

    

    useEffect(() => {
        if (selectedShipping && selectedBilling) handleAddress(selectedShipping, selectedBilling);
    }, [selectedShipping, selectedBilling, handleAddress]);

    return (
        <div className="p-4 border rounded-lg shadow-md bg-white space-y-6">
            <h2 className="font-bold text-center text-lg text-gray-700">Thông tin giao hàng</h2>

            <div className="space-y-2 border-b pb-4 text-sm">
                <div className="flex justify-between"><span>Email:</span> <b>{checkout?.email}</b></div>
                <div className="flex justify-between"><span>Ghi chú:</span> <b>{checkout?.note || 'Không có'}</b></div>
            </div>

            <AddressSection 
                title="Địa chỉ nhận hàng" 
                selected={selectedShipping} 
                fullAddress={getFullAddress(selectedShipping!)}
                onAction={() => setActiveModal('SHIPPING_LIST')} 
            />

            <AddressSection 
                title="Địa chỉ thanh toán" 
                selected={selectedBilling} 
                fullAddress={getFullAddress(selectedBilling!)}
                onAction={() => setActiveModal('BILLING_LIST')} 
            />

            {(activeModal === 'SHIPPING_LIST' || activeModal === 'BILLING_LIST') && (
                <SelectionModal
                    title={activeModal === 'SHIPPING_LIST' ? "Địa chỉ nhận hàng" : "Địa chỉ thanh toán"}
                    list={activeModal === 'SHIPPING_LIST' ? addresses : billingAddresses}
                    selectedId={activeModal === 'SHIPPING_LIST' ? selectedShipping?.id : selectedBilling?.id}
                    onSelect={(item) => {
                        if (activeModal === 'SHIPPING_LIST') {
                            setSelectedShipping(item);
                        } else {
                            setSelectedBilling(item);
                        }
                        setActiveModal(null);
                    }}
                    getFullAddress={getFullAddress}
                    onClose={() => setActiveModal(null)}
                    onAddNew={() => setActiveModal('CREATE')}
                />
            )}

            {(activeModal === 'CREATE' || activeModal === 'UPDATE') && (
                <AddressForm
                    handleSubmit={handleSubmit(async (data) => {
                        if (activeModal === 'CREATE') {
                            const res = await createUserAddress(data);
                            if (res) window.location.reload();
                        } else if (data.id) {
                            const res = await updateAddress(data.id, data);
                            if (res) window.location.reload();
                        }
                    })}
                    register={register} setValue={setValue} errors={errors}
                    isDisplay={true}
                    onClose={() => setActiveModal(null)}
                    titleModal={activeModal === 'CREATE' ? "Thêm địa chỉ" : "Cập nhật"} address={undefined}                />
            )}
        </div>
    );
}

const AddressSection = ({ title, selected, fullAddress, onAction }: AddressSectionProps) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-gray-700">{title}</label>
            <button onClick={onAction} className="text-blue-500 text-xs font-semibold hover:underline">Thay đổi</button>
        </div>
        <div className="p-3 border rounded-md bg-gray-50 text-sm">
            {selected ? (
                <div>
                    <p className="font-bold">{selected.contactName} - {selected.phone}</p>
                    <p className="text-gray-600 italic">{fullAddress}</p>
                </div>
            ) : <p className="text-gray-400">Chưa chọn địa chỉ</p>}
        </div>
    </div>
);

const SelectionModal = ({ title, list, selectedId, onSelect, getFullAddress, onClose, onAddNew }: SelectionModalProps) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">{title}</h3>
                <button onClick={onClose} className="text-xl">×</button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3">
                {list.map((item: AddressDetailVm) => (
                    <div key={item.id} 
                         onClick={() => onSelect(item)}
                         className={`p-3 border rounded-md cursor-pointer hover:border-blue-500 transition-all ${selectedId === item.id ? 'border-blue-600 bg-blue-50' : ''}`}>
                        <div className="flex justify-between">
                            <span className="font-bold">{item.contactName} ({item.phone})</span>
                            <input type="radio" checked={selectedId === item.id} readOnly />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{getFullAddress(item)}</p>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
                <button onClick={onAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Thêm địa chỉ mới</button>
            </div>
        </div>
    </div>
);
import React, { useEffect, useState } from 'react'
import { FieldErrorsImpl, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { CountryVm } from '@/modules/country/model/CountryVm';
import { StateOrProvince } from '@/modules/stateorprovince/model/StateOrProvince';
import { Input } from '@/common/Input';
import { OptionSelect } from '@/common/OptionSelect';
import { getAllCountries, getStateOrProvinces } from '@/modules/country/service/CountryService';
import ModalHeadersProps from './ModalHeadersProps';
import { AddressGetVm } from '../model/AddressGetVm';

type AddressFormProps = {
  handleSubmit: () => void;
  register: UseFormRegister<AddressGetVm>;
  setValue: UseFormSetValue<AddressGetVm>;
  errors: FieldErrorsImpl<AddressGetVm>;
  address: AddressGetVm | undefined;
  isDisplay?: boolean | true;
  buttonText?: string;
  onClose: () => void;
  titleModal: string;
};

export default function AddressForm({
  titleModal,
  handleSubmit,
  register,
  setValue,
  errors,
  address,
  isDisplay,
  buttonText,
  onClose,
}: AddressFormProps) {
  const [countries, setCountries] = useState<CountryVm[]>([]);
  const [stateOrProvinces, setStateOrProvinces] = useState<StateOrProvince[]>();

  useEffect(() => {
    getAllCountries().then((res) => {
      setCountries(res);
    });
  }, []);

  // When creating a new address (no `address` prop), auto-select the first
  // country and load its states once the country <option>s have been rendered.
  // This must run after `countries` is set so the native <select> can reflect
  // the value chosen via setValue and the "Tỉnh / Thành phố" dropdown gets data.
  useEffect(() => {
    if (!address && countries.length > 0) {
      const defaultCountry = countries[0];
      setValue('countryId', defaultCountry.id);
      setValue('countryName', defaultCountry.name);
      getStateOrProvinces(defaultCountry.id).then(setStateOrProvinces);
    }
  }, [countries, address, setValue]);

  useEffect(() => {
    if (address) {
      getStateOrProvinces(address.countryId).then((data) => {
        setStateOrProvinces(data);
      });
    }
  }, [address]);



  const onCountryChange = async (event: any) => {
    setValue('countryName', event.target.selectedOptions[0].text);
    getStateOrProvinces(event.target.value).then(setStateOrProvinces);
  };

  const onStateOrProvinceChange = async (event: any) => {
    setValue('stateOrProvinceName', event.target.selectedOptions[0].text);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 flex items-center justify-center bg-black/40 ${isDisplay ? '' : 'hidden'
          }`}
      >
        <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
          <div className="border-b px-6 py-4">
            <ModalHeadersProps titleModal={titleModal} onClose={onClose} />
          </div>

          <div className="px-6 py-5">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại địa chỉ</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="SHIPPING"
                    {...register("addressType", { required: "Vui lòng chọn loại địa chỉ" })}
                    defaultChecked={address?.addressType === 'SHIPPING' || true}
                  />
                  <span className="text-sm">Giao hàng (Shipping)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="BILLING"
                    {...register("addressType", { required: "Vui lòng chọn loại địa chỉ" })}
                    defaultChecked={address?.addressType === 'BILLING'}
                  />
                  <span className="text-sm">Thanh toán (Billing)</span>
                </label>
              </div>
              {errors.addressType && <p className="text-red-500 text-xs mt-1">{errors.addressType.message}</p>}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                labelText="Tên người nhận"
                register={register}
                field="contactName"
                registerOptions={{ required: { value: true, message: 'This field is required' } }}
                defaultValue={address?.contactName}
              />
              <Input
                labelText="Số điện thoại"
                register={register}
                field="phone"
                registerOptions={{ required: { value: true, message: 'This field is required' } }}
                defaultValue={address?.phone}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <OptionSelect
                labelText="Quốc gia"
                field="countryId"
                placeholder="Chọn quốc gia"
                options={countries}
                register={register}
                registerOptions={{
                  required: { value: true, message: 'Please select country' },
                  onChange: onCountryChange,
                }}
                error={errors.countryId?.message}
                defaultValue={address?.countryId}
              />
              <OptionSelect
                labelText="Tỉnh / Thành phố"
                register={register}
                field="stateOrProvinceId"
                options={stateOrProvinces}
                placeholder="Chọn tỉnh / thành phố"
                defaultValue={address?.stateOrProvinceId}
                registerOptions={{
                  required: { value: true, message: 'Please select state or province' },
                  onChange: onStateOrProvinceChange,
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                labelText="Thành phố"
                register={register}
                field="city"
                placeholder="Bỏ qua nếu không cần"
                defaultValue={address?.city}
              />
              <Input
                labelText="Mã bưu chính"
                register={register}
                field="zipCode"
                registerOptions={{ required: { value: true, message: 'This field is required' } }}
                defaultValue={address?.zipCode}
              />
            </div>

            <div className="mt-4 space-y-3">
              <Input
                labelText="Địa chỉ"
                register={register}
                field="addressLine1"
                registerOptions={{ required: { value: true, message: 'This field is required' } }}
                defaultValue={address?.addressLine1}
              />
              <Input
                labelText="Địa chỉ bổ sung"
                register={register}
                field="addressLine2"
                placeholder=""
                defaultValue={address?.addressLine2}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={handleSubmit}
              >
                {buttonText ?? 'Lưu địa chỉ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import ImageWithFallBack from '@/common/components/ImageWithFallBack';
import { useUserInfoContext } from '@/context/UserInforProvider';
import AddressForm from '@/modules/address/components/AddressForm';
import { Address } from '@/modules/address/model/AddressGetVm';
import { CountryVm } from '@/modules/country/model/CountryVm';
import { getAllCountries, getStateOrProvinces } from '@/modules/country/service/CountryService';
import { Districts } from '@/modules/districts/model/Districts';
import { getDistrictsList } from '@/modules/districts/services/Districts';
import { getAddressDefault } from '@/modules/profile/service/ProfileService';
import { StateOrProvince } from '@/modules/stateorprovince/model/StateOrProvince';
import { NextPage } from 'next';

enum Tabs {
  Tab1 = 'Tab1',
  Tab2 = 'Tab2',
  Tab3 = 'Tab3',
}

type Cart = {
  id: number;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: string;
};

const Profile: NextPage = () => {

  const { firstname, email, lastname } = useUserInfoContext();

  const [adddressDefault, setAddressDefault] = useState<Address | null | undefined>();

  const [coutries, setCountries] = useState<CountryVm[]>();
  const [stateOrProvinces, setStateOrProvinces] = useState<StateOrProvince[]>();
  const [districts, setDistricts] = useState<Districts[]>();

  const [selectedCountryVm, setSelectedCountry] = useState<CountryVm>();
  const [selectedDistrict, setSelectedDistrict] = useState<Districts>();
  const [selectedStateOrProvinces, setSelectedStateOrProvinces] = useState<StateOrProvince>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { register
    , handleSubmit: handleSubmitUpdateAddress
    , setValue
    , formState: { errors } } = useForm<Address>();

  const [activeTab, setActiveTab] = useState<Tabs.Tab1 | Tabs.Tab2 | Tabs.Tab3>(Tabs.Tab1);

  // const [orderStatus] = useState("PENDING");

  const [carts] = useState<Cart[]>();

  const [userAvatar] = useState<string>('');

  const handleActiveTabs = (tab: Tabs) => {
    setActiveTab(tab);
  }

  const onSubmitUpdateAddress: SubmitHandler<Address> = async () => {
  }

  /* const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
     console.log(event.target.value)
     setOrderStatus(event.target.value);
   } */

  useEffect(() => {
    getAddressDefault().then((res) => {
      setAddressDefault(res);
    }).catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (adddressDefault) {
      getStateOrProvinces(Number(adddressDefault?.countryId))
        .then((res) => {
          setStateOrProvinces(res)
        }).catch((error) => console.error(error));
      getAllCountries().then((res) => setCountries(res))
        .catch((error) => console.error(error));
      getDistrictsList().then((res) => setDistricts(res))
        .catch((error) => console.error(error));
    }
  }, [adddressDefault])

  useEffect(() => {
    if (coutries && adddressDefault) {
      const activeCountries = coutries.find((item) => item.id === adddressDefault?.countryId);
      setSelectedCountry(activeCountries);
    }

    if (stateOrProvinces && adddressDefault) {
      const active = stateOrProvinces.find((item) => item.id === adddressDefault?.stateOrProvinceId);
      setSelectedStateOrProvinces(active);
    }

    if (districts && adddressDefault) {
      const activeDistrict = districts.find((item) => item.id === adddressDefault?.districtId);
      setSelectedDistrict(activeDistrict);
    }

  }, [coutries, stateOrProvinces, districts, adddressDefault]);

  // useEffect(() => {
    // const dummyCarts: Cart[] = [
    //   { id: 1, productName: 'Gạo ST25', quantity: 2, totalPrice: 40000, status: 'pending' },
    //   { id: 2, productName: 'Gạo Lứt', quantity: 1, totalPrice: 20000, status: 'shipping' },
    //   { id: 3, productName: 'Gạo Nhật', quantity: 3, totalPrice: 60000, status: 'cancelled' },
    // ];
    // const filter = dummyCarts.filter((cartStatus) => cartStatus.status === orderStatus);
    // setCarts(filter)
  // }, [dummyCarts, orderStatus])

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-12">
        <div className="col-span-2 py-8">
          <ImageWithFallBack
            src={userAvatar || '/static/images/default-avatar.png'}
            fallback="/static/images/default-avatar.png"
            alt='User avatar'
            className="rounded-full border-gray-300 border-2 w-32 h-32 object-cover mx-auto"
          />
        </div>
        {activeTab === Tabs.Tab1 && (
          <div className="col-span-8 px-5 gap-3">
            <div className="gap-3 flex-col flex">
              <div className="flex py-3">
                <label className="text-center w-full mx-auto font-bold text-gray-700 text-lg">Thông tin cơ bản</label>
              </div>
              <div className="flex w-full gap-3 items-center">
                <label className="font-bold text-sm w-[30%] text-gray-700">Tên người dùng: </label>
                <h3 className="w-[70%] font-bold text-sm text-gray-700">{firstname} {lastname}</h3>
              </div>
              <div className="flex w-full gap-3 items-center">
                <label className="font-bold text-sm w-[30%] text-gray-700">Email: </label>
                <h3 className="w-[70%] font-bold text-sm text-gray-700">{email}</h3>
              </div>
            </div>

            <div className="w-full py-3">
              <div className="flex">
                <label className="text-center w-full mx-auto font-bold text-gray-700 text-lg">Địa chỉ mặc định</label>
              </div>
            </div>
            <div className="gap-3 flex-col flex">
              <div className="flex w-full gap-3 items-center">
                <label className="font-bold text-sm w-[30%] text-gray-700">Tên người nhận: </label>
                <h3 className="w-[70%] font-bold text-sm text-gray-700">{adddressDefault?.contactName}</h3>
              </div>
              <div className="flex w-full gap-3 items-center">
                <label className="font-bold text-sm w-[30%] text-gray-700">Số điện thoại: </label>
                <h3 className="w-[70%] font-bold text-sm text-gray-700">{adddressDefault?.phone}</h3>
              </div>
              <div className="flex w-full gap-3 items-center">
                <label className="font-bold text-sm w-[30%] text-gray-700">Địa chỉ cụ thể 1: </label>
                <h3 className="w-[70%] font-bold text-sm text-gray-700">{adddressDefault?.addressLine1}</h3>
              </div>
              <div className="flex w-full gap-3 items-center">
                <label className="font-bold text-sm w-[30%] text-gray-700">Địa chỉ cụ thể 2: </label>
                <h3 className="w-[70%] font-bold text-sm text-gray-700">{adddressDefault?.addressLine2}</h3>
              </div>
              <div className="flex w-full gap-3 items-center">
                <label className="font-bold text-sm w-[30%] text-gray-700">Quận/Huyện: </label>
                <h3 className="w-[70%] font-bold text-sm text-gray-700">{selectedDistrict?.name}</h3>
              </div>
              <div className="flex w-full gap-3 items-center">
                <label className="font-bold text-sm w-[30%] text-gray-700">Tỉnh/Thành phố: </label>
                <h3 className="w-[70%] font-bold text-sm text-gray-700">{selectedStateOrProvinces?.name}</h3>
              </div>
              <div className="flex w-full gap-3 items-center">
                <label className="font-bold text-sm w-[30%] text-gray-700">Quốc gia: </label>
                <h3 className="w-[70%] font-bold text-sm text-gray-700">{selectedCountryVm?.name}</h3>
              </div>
              <div className="flex w-full justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Đổi địa chỉ
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === Tabs.Tab2 && (
          <div className="col-span-8 px-5 gap-3">
            <h2 className="text-center font-bold mx-3">Sản phẩm đã xem gần đây</h2>
            {carts?.map(cart => (
              <div key={cart.id} className="flex justify-between border-b py-2">
                <span>{cart.productName}</span>
                <span>{cart.quantity} x {cart.totalPrice}</span>
                <span>{cart.status}</span>
              </div>
            ))}
          </div>
        )}

        <div className="col-span-2 py-3 gap-3 flex flex-col">
          <button
            className={`font-bold p-2 rounded-md ${activeTab === Tabs.Tab1 ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            onClick={() => handleActiveTabs(Tabs.Tab1)}
          >
            Thông tin cơ bản
          </button>
          <button
            className={`font-bold p-2 rounded-md ${activeTab === Tabs.Tab2 ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
            onClick={() => handleActiveTabs(Tabs.Tab2)}
          >
            Sản phẩm đã xem gần đây
          </button>
        </div>
      </div>

      {adddressDefault && isModalOpen && (
        <AddressForm
          titleModal='Đổi địa chỉ'
          setValue={setValue}
          errors={errors}
          address={adddressDefault}
          isDisplay={isModalOpen}
          buttonText='Đổi địa chỉ'
          onClose={() => setIsModalOpen(!isModalOpen)}
          register={register}
          handleSubmit={handleSubmitUpdateAddress(onSubmitUpdateAddress)}
        />
      )}

    </div>
  );
};

export default Profile;

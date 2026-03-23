import AddressForm from '@/modules/address/components/AddressForm'
import { Address } from '@/modules/address/model/AddressGetVm'
import { AddressPostVm } from '@/modules/address/model/AddressPostVm'
import { getAddressById, updateAddress } from '@/modules/address/service/Address'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const Edit: NextPage = () => {
    const router = useRouter();
    const id = router.query;

    const {
        register,
        setValue,
        handleSubmit: handleSubmitUpdateAddress,
        formState: { errors }
    } = useForm<Address>();

    const [address, setAddress] = useState<Address>();
    const [isDisplayModalUpdateAddress, setIsDisplayModalUpdateAddress] = useState<boolean>(false)

    useEffect(() => {
        const idNumber = Number(id);
        getAddressById(idNumber).then((res : Address) => {
            setAddress(res);
        })
    }, [id]);

    const onSubmitUpdateAddress: SubmitHandler<Address> = async (data) => {
        const addressUpdate: AddressPostVm = {
            contactName: data.contactName,
            phone: 'data',
            addressLine1: 'data',
            addressLine2: 'data',
            city: 'data',
            zipCode: 'data',
            districtId: 0,
            stateOrProvinceId: 0,
            countryId: 0,
        }

        if (id) {
            const response = await updateAddress(Number(id), addressUpdate);
            if (response.status === 204) {
                /*
                    - Create Components Toast 
                    - router.push('profile/create.tsx')
                */
            }
        }
    }

    return (
        <div onClick={() => setIsDisplayModalUpdateAddress(!isDisplayModalUpdateAddress)}>
            {address ? <AddressForm
                handleSubmit={handleSubmitUpdateAddress(onSubmitUpdateAddress)}
                register={register}
                setValue={setValue}
                errors={errors}
                address={address}
                isDisplay={isDisplayModalUpdateAddress}
                buttonText='Cật nhật địa chỉ'
                onClose={() => router.push('profile/')}
                titleModal='Cật Nhật Địa Chỉ'
            /> :
                <div>Error</div>
            }
        </div>
    )
}

export default Edit
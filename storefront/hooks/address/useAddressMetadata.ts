import { AddressDetailVm } from "@/modules/address/model/Address";
import { CountryVm } from "@/modules/country/model/CountryVm";
import { getAllCountries, } from "@/modules/country/service/CountryService";
import { Districts } from "@/modules/districts/model/Districts";
import { getDistrictsList } from "@/modules/districts/services/Districts";
import { StateOrProvince } from "@/modules/stateorprovince/model/StateOrProvince";
import { getStateOrProvinces } from "@/modules/stateorprovince/services/StateOrProvince";
import { useEffect, useState } from "react";

interface AddressMetadataState {
    countries: CountryVm[];
    states: StateOrProvince[];
    districts: Districts[];
}

export const useAddressMetadata = () => {
    const [metadata, setMetadata] = useState<AddressMetadataState>({ countries: [], states: [], districts: [] });

    useEffect(() => {
        Promise.all([getAllCountries(), getStateOrProvinces(), getDistrictsList()])
            .then(([countries, states, districts]) => {
                setMetadata({ countries, states, districts });
            });
    }, []);

    const getFullAddressString = (addr: AddressDetailVm) => {
        const d = metadata.districts.find(i => i.id === addr.districtId)?.name;
        const s = metadata.states.find(i => i.id === addr.stateOrProvinceId)?.name;
        const c = metadata.countries.find(i => i.id === addr.countryId)?.name;
        return `${addr.addressLine1}, ${addr.addressLine2 ? addr.addressLine2 + ', ' : ''}${d}, ${s}, ${c}`;
    };

    return { ...metadata, getFullAddressString };
};
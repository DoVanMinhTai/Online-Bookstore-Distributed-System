import { Address } from "@/modules/address/model/Address";
import { CountryVm } from "@/modules/country/model/CountryVm";
import { getAllCountries, } from "@/modules/country/service/CountryService";
import { StateOrProvince } from "@/modules/stateorprovince/model/StateOrProvince";
import { getStateOrProvinces } from "@/modules/stateorprovince/services/StateOrProvince";
import { useEffect, useState } from "react";

interface AddressMetadataState {
    countries: CountryVm[];
    states: StateOrProvince[];
}

export const useAddressMetadata = () => {
    const [metadata, setMetadata] = useState<AddressMetadataState>({ countries: [], states: [] });

    useEffect(() => {
        Promise.all([getAllCountries(), getStateOrProvinces()])
            .then(([countries, states]) => {
                setMetadata({ countries, states });
            });
    }, []);

    const getFullAddressString = (addr: Address) => {
        const s = metadata.states.find(i => i.id === addr.stateOrProvinceId)?.name;
        const c = metadata.countries.find(i => i.id === addr.countryId)?.name;
        return `${addr.addressLine1}, ${addr.addressLine2 ? addr.addressLine2 + ', ' : ''}${s}, ${c}`;
    };

    return { ...metadata, getFullAddressString };
};

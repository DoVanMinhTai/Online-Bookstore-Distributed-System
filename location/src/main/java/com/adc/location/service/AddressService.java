package com.adc.location.service;

import com.adc.location.model.Address;
import com.adc.location.model.Country;
import com.adc.location.model.enumeration.AddressType;
import com.adc.location.repository.AddressRepository;
import com.adc.location.repository.CountryRepository;
import com.adc.location.repository.DistrictRepository;
import com.adc.location.repository.StateOrProvinceRepository;
import com.adc.location.viewmodel.address.AddressDetailVm;
import com.adc.location.viewmodel.address.AddressPostVm;
import com.adc.location.viewmodel.address.AddressGetVm;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@lombok.RequiredArgsConstructor
@Transactional
public class AddressService {
    private final AddressRepository addressRepository;
    private final CountryRepository countryRepository;
    private final DistrictRepository districtRepository;
    private final StateOrProvinceRepository stateOrProvinceRepository;

    public AddressGetVm createAddress(@Valid AddressPostVm dto) {
        Address address = AddressPostVm.fromModel(dto);
        stateOrProvinceRepository.findById(dto.stateOrProvinceId()).ifPresent(address::setStateOrProvince);
        if (dto.districtId() != null) {
            districtRepository.findById(dto.districtId()).ifPresent(address::setDistrict);
        }
        Country country = countryRepository.findById(dto.countryId()).orElseThrow(
                () -> new IllegalArgumentException("Country not found")
        );
        address.setCountry(country);
        return AddressGetVm.fromModel(addressRepository.save(address));
    }

    public void updateAddress(Long id, @Valid AddressPostVm dto) {
        Address address = addressRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Address not found")
        );
        address.setContactName(dto.contactName());
        address.setAddressLine1(dto.addressLine1());
        address.setAddressLine2(dto.addressLine2());
        address.setPhone(dto.phone());
        address.setCity(dto.city());
        address.setZipCode(dto.zipCode());
        stateOrProvinceRepository.findById(dto.stateOrProvinceId()).ifPresent(address::setStateOrProvince);
        if (dto.districtId() != null) {
            districtRepository.findById(dto.districtId()).ifPresent(address::setDistrict);
        }
        countryRepository.findById(dto.countryId()).ifPresent(address::setCountry);
        addressRepository.save(address);
    }

    public AddressDetailVm getAddressById(Long id) {
        Address address = addressRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Address not found")
        );
        return AddressDetailVm.fromModel(address);
    }

    public List<AddressDetailVm> getAddressList(List<Long> ids) {
        List<Address> addresses = addressRepository.findAddressByIdIn(ids);
        return addresses.stream().map(AddressDetailVm::fromModel).toList();
    }

    public void deleteAddress(Long id) {
        Address address = addressRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Address not found")
        );
        addressRepository.delete(address);
    }

    public List<AddressDetailVm> getListBillingAddressByIds(List<Long> id) {
        List<Address> billingAddress = addressRepository.findAllByIdInAndAddressType(id, AddressType.BILLING);
        return billingAddress.stream().map(AddressDetailVm::fromModel).toList();
    }
}

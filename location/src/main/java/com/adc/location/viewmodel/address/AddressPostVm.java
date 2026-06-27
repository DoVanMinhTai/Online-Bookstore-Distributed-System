package com.adc.location.viewmodel.address;

import com.adc.location.model.Address;
import com.adc.location.model.enumeration.AddressType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record AddressPostVm(@Size(max = 450) String contactName,
                            @Size(max = 25) String phone,
                            @Size(max = 450) String addressLine1,
                            @Size(max = 450) String addressLine2,
                            @Size(max = 450) String city,
                            @Size(max = 25) String zipCode,
                            Long districtId,
                            @NotNull Long stateOrProvinceId,
                            @NotNull Long countryId,
                            AddressType addressType
) {
    public static Address fromModel(AddressPostVm dto) {
        return Address.builder()
                .contactName(dto.contactName)
                .phone(dto.phone)
                .addressLine1(dto.addressLine1)
                .addressLine2(dto.addressLine2)
                .city(dto.city())
                .zipCode(dto.zipCode)
                .addressType(dto.addressType)
                .build();
    }
}

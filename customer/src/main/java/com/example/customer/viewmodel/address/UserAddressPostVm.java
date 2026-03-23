package com.example.customer.viewmodel.address;

import com.example.customer.model.enumeration.AddressType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserAddressPostVm(
        @Size(max = 450) String contactName,
        @Size(max = 25) String phone,
        @Size(max = 450) String addressLine1,
        @Size(max = 450) String addressLine2,
        @Size(max = 450) String city,
        @Size(max = 25) String zipCode,
        @NotNull Long districtId,
        @NotNull Long stateOrProvinceId,
        @NotNull Long countryId,
        AddressType addressType,
        Boolean isDefault
) {
}

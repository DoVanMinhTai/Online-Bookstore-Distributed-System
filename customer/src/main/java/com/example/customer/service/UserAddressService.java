package com.example.customer.service;

import com.example.customer.model.UserAddress;
import com.example.customer.respository.UserAddressRepository;
import com.example.customer.viewmodel.address.AddressDetailVm;
import com.example.customer.viewmodel.address.AddressVm;
import com.example.customer.viewmodel.address.UserAddressPostVm;
import com.example.customer.viewmodel.useraddress.UserAddressVm;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAddressService {
    private final UserAddressRepository userAddressRepository;
    private final LocationService locationService;

    @Transactional
    public UserAddressVm createUserAddress(UserAddressPostVm userAddressPostVm) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean isFirstAddress = !userAddressRepository.existsByUserId(userId);

        boolean shouldBeDefault = isFirstAddress || userAddressPostVm.isDefault();

        if (shouldBeDefault) {
            userAddressRepository.updateIsActiveByUserId(userId, false);
        }

        AddressVm addressVm = locationService.createAddress(userAddressPostVm);

        UserAddress userAddress = UserAddress.builder().userId(userId).addressId(addressVm.id()).isActive(shouldBeDefault).build();

        UserAddress savedUserAddress = userAddressRepository.save(userAddress);

        return UserAddressVm.fromModel(savedUserAddress, addressVm);
    }

    public List<AddressDetailVm> getUserAddressList() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        List<UserAddress> userAddressList = userAddressRepository.findAllByUserId(userId);

        List<Long> listAddressIds = userAddressList.stream().map(UserAddress::getAddressId).collect(Collectors.toList());

        return locationService.getAddressDetailByIds(listAddressIds);
    }

    public AddressDetailVm getAddressIsActive() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(userId);
        return userAddressRepository.findByUserIdAndIsActiveTrue(userId).map(address -> locationService.getAddressById(address.getAddressId())).orElse(null);
    }

    public List<AddressDetailVm> getAddressBillingIsActive() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Long> addressIds = userAddressRepository.findAllByUserId(userId).stream().map(UserAddress::getAddressId).toList();

        if (addressIds.isEmpty()) {
            return Collections.emptyList();
        }

        return locationService.getAddressBillingById(addressIds);
    }

}

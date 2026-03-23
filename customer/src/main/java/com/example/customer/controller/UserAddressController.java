package com.example.customer.controller;

import com.example.customer.service.UserAddressService;
import com.example.customer.viewmodel.address.AddressDetailVm;
import com.example.customer.viewmodel.address.UserAddressPostVm;
import com.example.customer.viewmodel.useraddress.UserAddressVm;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserAddressController {
    private final UserAddressService userAddressService;

    public UserAddressController(UserAddressService userAddressService) {
        this.userAddressService = userAddressService;
    }

    @PostMapping("/storefront/createUserAddress")
    public ResponseEntity<UserAddressVm> createUserAddress(@RequestBody UserAddressPostVm userAddressPostVm) {
        return ResponseEntity.ok(userAddressService.createUserAddress(userAddressPostVm));
    }

    @GetMapping("/storefront/getUserAddressList")
    public ResponseEntity<List<AddressDetailVm>> getUserAddressList() {
        return ResponseEntity.ok(userAddressService.getUserAddressList());
    }

    @GetMapping("/storefront/getAddressIsActive")
    public ResponseEntity<AddressDetailVm> getUserAddressIsActive() {
        return ResponseEntity.ok(userAddressService.getAddressIsActive());
    }

    @GetMapping("/storefront/getAddressBillingIsActive")
    public ResponseEntity<List<AddressDetailVm>> getAddressBillingIsActive() {
        return ResponseEntity.ok(userAddressService.getAddressBillingIsActive());
    }
}

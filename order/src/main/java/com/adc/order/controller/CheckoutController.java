package com.adc.order.controller;

import com.adc.order.service.CheckoutService;
import com.adc.order.viewmodel.checkout.CheckoutPaymentMethodPutVm;
import com.adc.order.viewmodel.checkout.CheckoutPostVm;
import com.adc.order.viewmodel.checkout.CheckoutStatusPutVm;
import com.adc.order.viewmodel.checkout.CheckoutVm;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CheckoutController {
    private final CheckoutService checkoutService;

    @PostMapping("/storefront/checkouts")
    public ResponseEntity<CheckoutVm> checkout(@Valid @RequestBody CheckoutPostVm checkoutPostVm) {
        System.out.println("received checkout post vm: " + checkoutPostVm);
        log.info("Received CheckoutPostVm" + checkoutPostVm);
        return ResponseEntity.ok(checkoutService.createCheckout(checkoutPostVm));
    }

    @PutMapping("/storefront/checkouts/{id}/payment-method")
    public ResponseEntity<Void> updatePaymentMethod(@PathVariable final String id,
                                                    @Valid @RequestBody
                                                    final CheckoutPaymentMethodPutVm checkoutPaymentMethodPutVm) {
        checkoutService.updateCheckoutPaymentMethod(id,checkoutPaymentMethodPutVm);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/storefront/checkouts/status")
    public ResponseEntity<Long> updateCheckoutStatus(@Valid @RequestBody CheckoutStatusPutVm checkoutStatusPutVm) {
        return ResponseEntity.ok(checkoutService.updateCheckoutStatus(checkoutStatusPutVm));
    }
    @GetMapping("/storefront/checkouts/{id}")
    public ResponseEntity<CheckoutVm> getCheckout(@PathVariable final String id) {
        return ResponseEntity.ok(checkoutService.getCheckoutWithPendingStateById(id));
    }
}

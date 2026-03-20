package com.adc.order.viewmodel.checkout;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CheckoutPostVm(
        String email,
        String note,
        String promotionCode,
        String shipmentMethodId,
        String paymentMethodId,
        Long shippingAddressId,
        @NotEmpty(message = "Checkout item must not be empty")
        List<CheckOutItemPostVm> checkoutItemVms
) {
}

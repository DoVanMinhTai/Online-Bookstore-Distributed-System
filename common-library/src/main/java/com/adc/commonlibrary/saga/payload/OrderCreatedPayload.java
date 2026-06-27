package com.adc.commonlibrary.saga.payload;

import java.math.BigDecimal;
import java.util.List;

/**
 * Payload for the "OrderCreated" saga event.
 * Published by the Order service when a new order is placed.
 */
public record OrderCreatedPayload(
        Long orderId,
        List<OrderItemPayload> items,
        BigDecimal totalPrice,
        String customerId
) {
}

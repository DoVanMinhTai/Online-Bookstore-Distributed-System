package com.adc.commonlibrary.saga.payload;

/**
 * Represents a single line-item within an {@link OrderCreatedPayload}.
 */
public record OrderItemPayload(
        Long productId,
        int quantity,
        Long warehouseId
) {
}

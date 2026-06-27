package com.adc.commonlibrary.saga.payload;

/**
 * Describes a single item that has been successfully reserved in inventory.
 */
public record ReservedItemPayload(
        Long productId,
        int quantity,
        Long warehouseId
) {
}

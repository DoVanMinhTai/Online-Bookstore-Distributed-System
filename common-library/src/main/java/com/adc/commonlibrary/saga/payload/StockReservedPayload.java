package com.adc.commonlibrary.saga.payload;

import java.util.List;

/**
 * Payload for the "StockReserved" saga event.
 * Published by the Inventory service when all items have been successfully reserved.
 */
public record StockReservedPayload(
        Long orderId,
        List<ReservedItemPayload> reservedItems
) {
}

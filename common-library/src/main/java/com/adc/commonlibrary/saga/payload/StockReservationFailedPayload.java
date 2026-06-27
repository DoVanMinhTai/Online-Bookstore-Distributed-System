package com.adc.commonlibrary.saga.payload;

import java.util.List;

/**
 * Payload for the "StockReservationFailed" saga event.
 * Published by the Inventory service when one or more items could not be reserved.
 */
public record StockReservationFailedPayload(
        Long orderId,
        String reason,
        List<Long> failedProductIds
) {
}

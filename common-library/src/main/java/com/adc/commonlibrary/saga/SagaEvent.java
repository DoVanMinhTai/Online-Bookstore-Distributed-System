package com.adc.commonlibrary.saga;

import java.time.ZonedDateTime;

/**
 * Base envelope for all saga events exchanged between microservices via Kafka.
 *
 * @param sagaId    correlation ID tying all events in one saga together (typically the orderId)
 * @param eventType discriminator such as "OrderCreated", "StockReserved", etc.
 * @param payload   the event-specific data (serialised as JSON)
 * @param timestamp when the event was produced
 */
public record SagaEvent<T>(
        String sagaId,
        String eventType,
        T payload,
        ZonedDateTime timestamp
) {
}

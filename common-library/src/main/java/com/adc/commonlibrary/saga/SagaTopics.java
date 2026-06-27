package com.adc.commonlibrary.saga;

/**
 * Centralised Kafka topic constants for the saga event flow.
 */
public final class SagaTopics {

    private SagaTopics() {
        // utility class
    }

    /** Events published by the Order service (consumed by Inventory). */
    public static final String ORDER_EVENTS = "order-events";

    /** Events published by the Inventory service (consumed by Order). */
    public static final String INVENTORY_EVENTS = "inventory-events";

    /** Dead-letter queue for unprocessable order events. */
    public static final String ORDER_DLQ = "order-events-dlq";

    /** Dead-letter queue for unprocessable inventory events. */
    public static final String INVENTORY_DLQ = "inventory-events-dlq";
}

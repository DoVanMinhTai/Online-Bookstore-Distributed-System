package com.adc.order.saga;

import com.adc.commonlibrary.exception.NotFoundException;
import com.adc.commonlibrary.model.OutboxService;
import com.adc.commonlibrary.saga.SagaEvent;
import com.adc.commonlibrary.saga.SagaTopics;
import com.adc.commonlibrary.saga.payload.StockReservationFailedPayload;
import com.adc.commonlibrary.saga.payload.StockReservedPayload;
import com.adc.order.model.Order;
import com.adc.order.model.enumeration.OrderStatus;
import com.adc.order.repository.OrderRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.Map;

/**
 * Kafka consumer that handles saga response events from the Inventory service.
 *
 * <p>Listens on {@link SagaTopics#INVENTORY_EVENTS} for:
 * <ul>
 *     <li><b>StockReserved</b> — all items reserved → mark order as ACCEPTED</li>
 *     <li><b>StockReservationFailed</b> — reservation failed → mark order as REJECT</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderSagaEventHandler {

    private final OrderRepository orderRepository;
    private final OrderSagaStateRepository sagaStateRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = SagaTopics.INVENTORY_EVENTS, groupId = "order-saga-group")
    @Transactional
    public void handleInventoryEvent(ConsumerRecord<String, String> record) {
        try {
            Map<String, Object> raw = objectMapper.readValue(record.value(), new TypeReference<>() {});
            String eventType = (String) raw.get("eventType");
            String sagaId = (String) raw.get("sagaId");

            log.info("Received inventory event: type={}, sagaId={}, offset={}", eventType, sagaId, record.offset());

            // Idempotency: check if this saga step was already processed
            Long orderId = Long.valueOf(sagaId);
            OrderSagaState sagaState = sagaStateRepository.findById(orderId).orElse(null);
            if (sagaState != null && !"AWAITING_STOCK_RESERVATION".equals(sagaState.getCurrentStep())) {
                log.warn("Saga for order {} is at step '{}', not awaiting reservation — skipping duplicate event",
                        orderId, sagaState.getCurrentStep());
                return;
            }

            switch (eventType) {
                case "StockReserved" -> handleStockReserved(sagaId, record.value());
                case "StockReservationFailed" -> handleStockReservationFailed(sagaId, record.value());
                default -> log.warn("Unknown inventory event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Error processing inventory event at offset {}: {}", record.offset(), e.getMessage(), e);
            throw new RuntimeException("Failed to process inventory event", e);
        }
    }

    private void handleStockReserved(String sagaId, String eventJson) throws Exception {
        Long orderId = Long.valueOf(sagaId);
        SagaEvent<StockReservedPayload> event = objectMapper.readValue(eventJson,
                objectMapper.getTypeFactory().constructParametricType(SagaEvent.class, StockReservedPayload.class));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("ORDER_NOT_FOUND", orderId));

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            log.warn("Order {} is not PENDING (status={}), ignoring StockReserved", orderId, order.getOrderStatus());
            return;
        }

        order.setOrderStatus(OrderStatus.ACCEPTED);
        orderRepository.save(order);

        // Update saga state
        OrderSagaState sagaState = sagaStateRepository.findById(orderId)
                .orElse(OrderSagaState.builder().orderId(orderId).build());
        sagaState.setCurrentStep("STOCK_RESERVED");
        sagaState.setLastEventType("StockReserved");
        sagaStateRepository.save(sagaState);

        log.info("Order {} accepted — stock successfully reserved", orderId);
    }

    private void handleStockReservationFailed(String sagaId, String eventJson) throws Exception {
        Long orderId = Long.valueOf(sagaId);
        SagaEvent<StockReservationFailedPayload> event = objectMapper.readValue(eventJson,
                objectMapper.getTypeFactory().constructParametricType(SagaEvent.class, StockReservationFailedPayload.class));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("ORDER_NOT_FOUND", orderId));

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            log.warn("Order {} is not PENDING (status={}), ignoring StockReservationFailed", orderId, order.getOrderStatus());
            return;
        }

        StockReservationFailedPayload payload = event.payload();
        order.setOrderStatus(OrderStatus.REJECT);
        order.setRejectReason(payload.reason());
        orderRepository.save(order);

        // Update saga state
        OrderSagaState sagaState = sagaStateRepository.findById(orderId)
                .orElse(OrderSagaState.builder().orderId(orderId).build());
        sagaState.setCurrentStep("RESERVATION_FAILED");
        sagaState.setLastEventType("StockReservationFailed");
        sagaStateRepository.save(sagaState);

        log.info("Order {} rejected — stock reservation failed: {}", orderId, payload.reason());
    }
}

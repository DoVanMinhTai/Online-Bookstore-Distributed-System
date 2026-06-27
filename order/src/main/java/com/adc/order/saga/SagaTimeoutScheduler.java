package com.adc.order.saga;

import com.adc.commonlibrary.model.OutboxService;
import com.adc.commonlibrary.saga.SagaEvent;
import com.adc.commonlibrary.saga.SagaTopics;
import com.adc.order.model.Order;
import com.adc.order.model.OrderItem;
import com.adc.order.model.enumeration.OrderStatus;
import com.adc.order.repository.OrderItemRepository;
import com.adc.order.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.List;

/**
 * Periodically checks for orders stuck in PENDING state beyond the configured timeout.
 * Cancels them and publishes an OrderCancelled event so Inventory can release any reserved stock.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SagaTimeoutScheduler {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderSagaStateRepository sagaStateRepository;
    private final OutboxService outboxService;
    private final ObjectMapper objectMapper;

    @Value("${saga.timeout.minutes:15}")
    private int timeoutMinutes;

    @Scheduled(fixedDelayString = "${saga.timeout.check-interval-ms:60000}")
    @Transactional
    public void cancelTimedOutOrders() {
        ZonedDateTime cutoff = ZonedDateTime.now().minus(Duration.ofMinutes(timeoutMinutes));

        List<OrderSagaState> staleSagas = sagaStateRepository
                .findByCurrentStepAndCreatedAtBefore("AWAITING_STOCK_RESERVATION", cutoff);

        if (staleSagas.isEmpty()) {
            return;
        }

        log.info("Found {} timed-out sagas (cutoff={})", staleSagas.size(), cutoff);

        for (OrderSagaState saga : staleSagas) {
            try {
                Order order = orderRepository.findById(saga.getOrderId()).orElse(null);
                if (order == null || order.getOrderStatus() != OrderStatus.PENDING) {
                    // Already transitioned — just update saga state
                    saga.setCurrentStep("COMPLETED");
                    sagaStateRepository.save(saga);
                    continue;
                }

                order.setOrderStatus(OrderStatus.CANCELLED);
                order.setRejectReason("Reservation timeout — stock not confirmed within " + timeoutMinutes + " minutes");
                orderRepository.save(order);

                // Publish OrderCancelled event so inventory can release stock
                publishOrderCancelledEvent(order);

                saga.setCurrentStep("TIMED_OUT");
                saga.setLastEventType("OrderCancelled");
                sagaStateRepository.save(saga);

                log.info("Timed out and cancelled order {}", saga.getOrderId());
            } catch (Exception e) {
                log.error("Failed to cancel timed-out order {}: {}", saga.getOrderId(), e.getMessage(), e);
            }
        }
    }

    private void publishOrderCancelledEvent(Order order) {
        try {
            // Build a lightweight cancel payload — inventory only needs the orderId
            String payload = objectMapper.writeValueAsString(
                    new SagaEvent<>(
                            order.getId().toString(),
                            "OrderCancelled",
                            new OrderCancelledPayload(order.getId()),
                            ZonedDateTime.now()
                    )
            );
            outboxService.createOutbox(
                    order.getId().toString(),
                    "OrderCancelled",
                    payload,
                    SagaTopics.ORDER_EVENTS
            );
        } catch (Exception e) {
            log.error("Failed to publish OrderCancelled for order {}: {}", order.getId(), e.getMessage(), e);
        }
    }

    /**
     * Lightweight payload for the OrderCancelled event.
     */
    public record OrderCancelledPayload(Long orderId) {
    }
}

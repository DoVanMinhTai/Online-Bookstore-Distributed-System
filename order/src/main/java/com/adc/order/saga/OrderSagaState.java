package com.adc.order.saga;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;

/**
 * Tracks the state of each order's saga lifecycle.
 * Used for idempotency checks, timeout detection, and debugging.
 */
@Entity
@Table(name = "order_saga_state")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderSagaState {

    @Id
    private Long orderId;

    @Column(name = "current_step", nullable = false, length = 50)
    private String currentStep;

    @Column(name = "last_event_type", length = 50)
    private String lastEventType;

    @Column(name = "retry_count")
    @Builder.Default
    private int retryCount = 0;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        updatedAt = ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now();
    }
}

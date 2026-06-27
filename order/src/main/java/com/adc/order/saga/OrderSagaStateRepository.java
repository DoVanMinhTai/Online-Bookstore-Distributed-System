package com.adc.order.saga;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface OrderSagaStateRepository extends JpaRepository<OrderSagaState, Long> {

    /**
     * Find saga states stuck at a given step that were created before the cutoff time.
     * Used by the timeout scheduler to detect stale orders.
     */
    List<OrderSagaState> findByCurrentStepAndCreatedAtBefore(String currentStep, ZonedDateTime cutoff);
}

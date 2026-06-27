package com.adc.commonlibrary.model;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Component
public class OutboxService {

    private final OutboxRepository repository;

    public OutboxService(OutboxRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public OutboxEntry createOutbox(String aggregateId, String type, String payload) {
        OutboxEntry entry = new OutboxEntry(UUID.randomUUID(), aggregateId, type, payload, "PENDING");
        return repository.save(entry);
    }

    @Transactional
    public OutboxEntry createOutbox(String aggregateId, String type, String payload, String topic) {
        OutboxEntry entry = new OutboxEntry(UUID.randomUUID(), aggregateId, type, payload, "PENDING", topic);
        return repository.save(entry);
    }

    public void markSent(OutboxEntry entry) {
        entry.setStatus("SENT");
        repository.save(entry);
    }

    public void markFailed(OutboxEntry entry, String error) {
        entry.setStatus("FAILED");
        entry.setLastError(error);
        entry.setTries(entry.getTries() + 1);
        repository.save(entry);
    }
}

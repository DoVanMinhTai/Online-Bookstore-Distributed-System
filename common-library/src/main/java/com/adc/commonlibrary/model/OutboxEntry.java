package com.adc.commonlibrary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "outbox")
public class OutboxEntry extends AbstractAuditEntity {

    @Id
    private UUID id;

    @Column(name = "aggregate_id")
    private String aggregateId;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String payload;

    private String status; // PENDING, SENT, FAILED

    /** Target Kafka topic for this outbox entry. */
    private String topic;

    private int tries;

    @Column(columnDefinition = "TEXT")
    private String lastError;

    private ZonedDateTime processedAt;

    public OutboxEntry() {}

    public OutboxEntry(UUID id, String aggregateId, String type, String payload, String status) {
        this.id = id;
        this.aggregateId = aggregateId;
        this.type = type;
        this.payload = payload;
        this.status = status;
        this.tries = 0;
    }

    public OutboxEntry(UUID id, String aggregateId, String type, String payload, String status, String topic) {
        this(id, aggregateId, type, payload, status);
        this.topic = topic;
    }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getAggregateId() { return aggregateId; }
    public void setAggregateId(String aggregateId) { this.aggregateId = aggregateId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getTries() { return tries; }
    public void setTries(int tries) { this.tries = tries; }
    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }
    public ZonedDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(ZonedDateTime processedAt) { this.processedAt = processedAt; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}

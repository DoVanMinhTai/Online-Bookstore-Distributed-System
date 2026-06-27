package com.adc.order.outbox;

import com.adc.commonlibrary.model.OutboxEntry;
import com.adc.commonlibrary.model.OutboxRepository;
import com.adc.commonlibrary.model.OutboxService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;

@Slf4j
@Component
public class OrderOutboxRelay {

    private final OutboxRepository outboxRepository;
    private final OutboxService outboxService;
    private final org.springframework.kafka.core.KafkaTemplate<String, String> kafkaTemplate;
    private final String topic;

    public OrderOutboxRelay(OutboxRepository outboxRepository, OutboxService outboxService, org.springframework.kafka.core.KafkaTemplate<String, String> kafkaTemplate, org.springframework.beans.factory.annotation.Value("${outbox.relay.topic:order-events}") String topic) {
        this.outboxRepository = outboxRepository;
        this.outboxService = outboxService;
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    @Scheduled(fixedDelayString = "${outbox.relay.poll-ms:5000}")
    public void pollAndRelay() {
        try {
            List<OutboxEntry> pending = outboxRepository.findByStatusOrderByCreatedOnAsc("PENDING");
            if (pending.isEmpty()) return;
            for (OutboxEntry entry : pending) {
                try {
                    String key = entry.getId().toString();
                    String value = entry.getPayload();
                    log.info("Publishing outbox entry id={} topic={} payload={}", key, topic, value);
                    // send and wait for confirmation
                    org.springframework.kafka.support.SendResult<String, String> result = kafkaTemplate.send(topic, key, value).get();
                    log.debug("Send result offset={}", result.getRecordMetadata().offset());
                    markSent(entry);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    log.error("Interrupted while sending outbox entry {}", entry.getId(), ie);
                    markFailed(entry, ie.getMessage());
                } catch (Exception e) {
                    log.error("Failed to publish outbox entry {}", entry.getId(), e);
                    markFailed(entry, e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Outbox relay failure", e);
        }
    }

    @Transactional
    protected void markSent(OutboxEntry entry) {
        entry.setStatus("SENT");
        entry.setProcessedAt(ZonedDateTime.now());
        outboxRepository.save(entry);
    }

    @Transactional
    protected void markFailed(OutboxEntry entry, String error) {
        entry.setStatus("FAILED");
        entry.setLastError(error);
        entry.setTries(entry.getTries() + 1);
        outboxRepository.save(entry);
    }
}

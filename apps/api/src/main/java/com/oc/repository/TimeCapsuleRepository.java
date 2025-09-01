package com.oc.repository;

import com.oc.domain.TimeCapsule;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.time.Instant;
import java.util.UUID;

public interface TimeCapsuleRepository extends ReactiveCrudRepository<TimeCapsule, UUID> {
    Flux<TimeCapsule> findByRoomId(UUID roomId);
    Flux<TimeCapsule> findByUnlockAtBefore(Instant now);
    Flux<TimeCapsule> findByMessageId(UUID messageId);
}
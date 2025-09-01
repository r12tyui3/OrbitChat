package com.oc.repository;

import com.oc.domain.Message;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface MessageRepository extends ReactiveCrudRepository<Message, UUID> {
    Flux<Message> findByRoomId(UUID roomId);
    Flux<Message> findByContentContainingIgnoreCase(String query);
}
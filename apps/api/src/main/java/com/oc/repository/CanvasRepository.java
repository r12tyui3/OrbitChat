package com.oc.repository;

import com.oc.domain.Canvas;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

import java.util.UUID;

public interface CanvasRepository extends ReactiveCrudRepository<Canvas, UUID> {
    Flux<Canvas> findByRoomId(UUID roomId);
}
package com.oc.repository;

import com.oc.domain.Reaction;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import java.util.UUID;

public interface ReactionRepository extends ReactiveCrudRepository<Reaction, UUID> {
}
package com.oc.repository;

import com.oc.domain.Room;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import java.util.UUID;

public interface RoomRepository extends ReactiveCrudRepository<Room, UUID> {
}
package com.oc.controller;

import com.oc.domain.Room;
import com.oc.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
public class RoomsController {

    private final RoomRepository roomRepository;

    public RoomsController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public Flux<Room> listRooms() {
        return roomRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Room> createRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    @GetMapping("/{id}")
    public Mono<Room> getRoomById(@PathVariable UUID id) {
        return roomRepository.findById(id);
    }
}
package com.oc.controller;

import com.oc.domain.Message;
import com.oc.repository.MessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/rooms/{roomId}/messages")
public class MessagesController {

    private final MessageRepository messageRepository;

    public MessagesController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping
    public Flux<Message> getMessagesByRoomId(@PathVariable UUID roomId) {
        return messageRepository.findByRoomId(roomId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Message> sendMessage(@PathVariable UUID roomId, @RequestBody Message message) {
        message.setRoomId(roomId);
        return messageRepository.save(message);
    }
}
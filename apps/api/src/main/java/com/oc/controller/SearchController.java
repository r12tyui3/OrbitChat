package com.oc.controller;

import com.oc.domain.Message;
import com.oc.repository.MessageRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final MessageRepository messageRepository;

    public SearchController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping
    public Flux<Message> searchMessages(@RequestParam String query) {
        // This is a basic example. In a real application, you would use a full-text search engine
        // like Elasticsearch or a database's full-text search capabilities.
        return messageRepository.findByContentContainingIgnoreCase(query);
    }
}
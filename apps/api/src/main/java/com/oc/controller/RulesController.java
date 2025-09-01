package com.oc.controller;

import com.oc.domain.Rule;
import com.oc.repository.RuleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/rooms/{roomId}/rules")
public class RulesController {

    private final RuleRepository ruleRepository;

    public RulesController(RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    @GetMapping
    public Flux<Rule> getRulesByRoomId(@PathVariable UUID roomId) {
        return ruleRepository.findByRoomId(roomId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Rule> createRule(@PathVariable UUID roomId, @RequestBody Rule rule) {
        rule.setRoomId(roomId);
        return ruleRepository.save(rule);
    }
}
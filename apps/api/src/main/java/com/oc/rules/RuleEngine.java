package com.oc.rules;

import com.oc.domain.Message;
import com.oc.domain.Rule;
import com.oc.repository.RuleRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class RuleEngine {

    private final RuleRepository ruleRepository;

    public RuleEngine(RuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    public Mono<Void> onMessageCreated(Message message) {
        return ruleRepository.findByRoomId(message.getRoomId())
                .flatMap(rule -> applyRule(rule, message))
                .then();
    }

    private Mono<Void> applyRule(Rule rule, Message message) {
        // This is a placeholder for rule application logic.
        // In a real application, you would parse the rule's condition and action.
        // For example, if rule.condition matches message.content, then execute rule.action.
        System.out.println("Applying rule: " + rule.getName() + " to message: " + message.getContent());
        return Mono.empty();
    }
}
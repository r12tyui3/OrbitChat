package com.oc.ws;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oc.domain.Message;
import com.oc.repository.MessageRepository;
import com.oc.rules.RuleEngine;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;

import java.util.Map;

@Component
public class RealtimeHandler implements WebSocketHandler {

    private final Sinks.Many<Message> sink = Sinks.many().multicast().onBackpressureBuffer(1024);
    private final ObjectMapper objectMapper;
    private final MessageRepository messageRepository;
    private final RuleEngine ruleEngine;

    public RealtimeHandler(ObjectMapper objectMapper, MessageRepository messageRepository, RuleEngine ruleEngine) {
        this.objectMapper = objectMapper;
        this.messageRepository = messageRepository;
        this.ruleEngine = ruleEngine;
    }

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        session.receive()
                .flatMap(webSocketMessage -> {
                    String payload = webSocketMessage.getPayloadAsText();
                    try {
                        Map<String, Object> clientMessage = objectMapper.readValue(payload, Map.class);
                        String type = (String) clientMessage.get("type");

                        if ("client.message.send".equals(type)) {
                            Map<String, Object> data = (Map<String, Object>) clientMessage.get("data");
                            Message message = objectMapper.convertValue(data, Message.class);
                            Mono.fromRunnable(() -> {
                                        messageRepository.save(message)
                                                .flatMap(savedMessage -> ruleEngine.onMessageCreated(savedMessage).thenReturn(savedMessage))
                                                .doOnNext(sink::tryEmitNext)
                                                .subscribe();
                                    })
                                    .subscribeOn(Schedulers.boundedElastic())
                                    .subscribe();
                        }
                    } catch (Exception e) {
                        System.err.println("Error processing WebSocket message: " + e.getMessage());
                    }
                    return Mono.empty();
                }).subscribe();

        return session.send(sink.asFlux().map(message -> {
            try {
                return session.textMessage(objectMapper.writeValueAsString(message));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }));
    }
}
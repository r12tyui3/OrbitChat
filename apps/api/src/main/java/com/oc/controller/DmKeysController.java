package com.oc.controller;

import com.oc.domain.User;
import com.oc.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/dm-keys")
public class DmKeysController {

    private final UserRepository userRepository;

    public DmKeysController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/{userId}")
    public Mono<User> setPublicKey(@PathVariable UUID userId, @RequestBody String publicKey) {
        return userRepository.findById(userId)
                .flatMap(user -> {
                    user.setPublicKey(publicKey);
                    return userRepository.save(user);
                });
    }

    @GetMapping("/{userId}")
    public Mono<String> getPublicKey(@PathVariable UUID userId) {
        return userRepository.findById(userId)
                .map(User::getPublicKey);
    }
}
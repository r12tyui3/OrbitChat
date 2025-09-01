package com.oc.controller;

import com.oc.domain.Canvas;
import com.oc.repository.CanvasRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/rooms/{roomId}/canvases")
public class CanvasesController {

    private final CanvasRepository canvasRepository;

    public CanvasesController(CanvasRepository canvasRepository) {
        this.canvasRepository = canvasRepository;
    }

    @GetMapping
    public Flux<Canvas> getCanvasesByRoomId(@PathVariable UUID roomId) {
        return canvasRepository.findByRoomId(roomId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Canvas> createCanvas(@PathVariable UUID roomId, @RequestBody Canvas canvas) {
        canvas.setRoomId(roomId);
        return canvasRepository.save(canvas);
    }

    @PatchMapping("/{canvasId}")
    public Mono<Canvas> patchCanvas(@PathVariable UUID roomId, @PathVariable UUID canvasId, @RequestBody Canvas updates) {
        return canvasRepository.findById(canvasId)
                .flatMap(existingCanvas -> {
                    // Apply partial updates
                    if (updates.getContent() != null) {
                        existingCanvas.setContent(updates.getContent());
                    }
                    // Add other fields as needed
                    return canvasRepository.save(existingCanvas);
                });
    }
}
package com.oc.timecapsules;

import com.oc.domain.TimeCapsule;
import com.oc.repository.TimeCapsuleRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Service
public class TimeCapsuleService {

    private final TimeCapsuleRepository timeCapsuleRepository;

    public TimeCapsuleService(TimeCapsuleRepository timeCapsuleRepository) {
        this.timeCapsuleRepository = timeCapsuleRepository;
    }

    @Scheduled(fixedRate = 60000) // Check every minute
    public void unlockTimeCapsules() {
        timeCapsuleRepository.findByUnlockAtBefore(Instant.now())
                .flatMap(this::processTimeCapsuleUnlock)
                .subscribe();
    }

    private Mono<Void> processTimeCapsuleUnlock(TimeCapsule timeCapsule) {
        System.out.println("Unlocking time capsule: " + timeCapsule.getId());
        // Here you would implement the logic to "unlock" the time capsule,
        // e.g., make its content visible, send notifications, etc.
        // For now, we'll just delete it after processing as a placeholder.
        return timeCapsuleRepository.delete(timeCapsule);
    }

    public Mono<TimeCapsule> createTimeCapsule(TimeCapsule timeCapsule) {
        return timeCapsuleRepository.save(timeCapsule);
    }
}
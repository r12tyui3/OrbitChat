package com.oc.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;

@Table("time_capsules")
public class TimeCapsule {

    @Id
    private UUID id;
    private UUID roomId;
    private String payloadJson;
    private OffsetDateTime unlockAt;
    private Integer minReactions;
    private UUID messageId;
    private Instant unlockedAt;

    public TimeCapsule() {
    }

    public TimeCapsule(UUID id, UUID roomId, String payloadJson, OffsetDateTime unlockAt, Integer minReactions, UUID messageId, Instant unlockedAt) {
        this.id = id;
        this.roomId = roomId;
        this.payloadJson = payloadJson;
        this.unlockAt = unlockAt;
        this.minReactions = minReactions;
        this.messageId = messageId;
        this.unlockedAt = unlockedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getRoomId() {
        return roomId;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }

    public String getPayloadJson() {
        return payloadJson;
    }

    public void setPayloadJson(String payloadJson) {
        this.payloadJson = payloadJson;
    }

    public OffsetDateTime getUnlockAt() {
        return unlockAt;
    }

    public void setUnlockAt(OffsetDateTime unlockAt) {
        this.unlockAt = unlockAt;
    }

    public Integer getMinReactions() {
        return minReactions;
    }

    public void setMinReactions(Integer minReactions) {
        this.minReactions = minReactions;
    }

    public UUID getMessageId() {
        return messageId;
    }

    public void setMessageId(UUID messageId) {
        this.messageId = messageId;
    }

    public Instant getUnlockedAt() {
        return unlockedAt;
    }

    public void setUnlockedAt(Instant unlockedAt) {
        this.unlockedAt = unlockedAt;
    }
}
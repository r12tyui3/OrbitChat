package com.oc.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

@Table("rules")
public class Rule {

    @Id
    private UUID id;
    private UUID roomId;
    private String whenJson;
    private String thenJson;
    private OffsetDateTime createdAt;
    private String name;

    public Rule() {
    }

    public Rule(UUID id, UUID roomId, String whenJson, String thenJson, OffsetDateTime createdAt) {
        this.id = id;
        this.roomId = roomId;
        this.whenJson = whenJson;
        this.thenJson = thenJson;
        this.createdAt = createdAt;
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

    public String getWhenJson() {
        return whenJson;
    }

    public void setWhenJson(String whenJson) {
        this.whenJson = whenJson;
    }

    public String getThenJson() {
        return thenJson;
    }

    public void setThenJson(String thenJson) {
        this.thenJson = thenJson;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getName() {
        return name;
    }
}
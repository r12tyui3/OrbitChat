package com.oc.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

@Table("users")
public class User {

    @Id
    private UUID id;
    private String handle;
    private String displayName;
    private String email;
    private String dmPublicKey;
    private OffsetDateTime createdAt;

    public User() {
    }

    public User(UUID id, String handle, String displayName, String email, String dmPublicKey, OffsetDateTime createdAt) {
        this.id = id;
        this.handle = handle;
        this.displayName = displayName;
        this.email = email;
        this.dmPublicKey = dmPublicKey;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getHandle() {
        return handle;
    }

    public void setHandle(String handle) {
        this.handle = handle;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPublicKey() {
        return dmPublicKey;
    }

    public void setPublicKey(String publicKey) {
        this.dmPublicKey = publicKey;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
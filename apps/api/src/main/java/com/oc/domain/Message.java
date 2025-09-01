package com.oc.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

@Table("messages")
public class Message {

    @Id
    private UUID id;
    private UUID roomId;
    private UUID senderId;
    private String body;
    private byte[] bodyCiphertext;
    private String attachments;
    private String idempotencyKey;
    private OffsetDateTime createdAt;
    private boolean pinned;
    private String content;

    public Message() {
    }

    public Message(UUID id, UUID roomId, UUID senderId, String body, byte[] bodyCiphertext, String attachments, String idempotencyKey, OffsetDateTime createdAt) {
        this.id = id;
        this.roomId = roomId;
        this.senderId = senderId;
        this.body = body;
        this.bodyCiphertext = bodyCiphertext;
        this.attachments = attachments;
        this.idempotencyKey = idempotencyKey;
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

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public byte[] getBodyCiphertext() {
        return bodyCiphertext;
    }

    public void setBodyCiphertext(byte[] bodyCiphertext) {
        this.bodyCiphertext = bodyCiphertext;
    }

    public String getAttachments() {
        return attachments;
    }

    public void setAttachments(String attachments) {
        this.attachments = attachments;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public String getContent() {
        return content;
    }
}
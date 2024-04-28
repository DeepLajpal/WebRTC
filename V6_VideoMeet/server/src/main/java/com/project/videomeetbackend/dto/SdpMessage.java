package com.project.videomeetbackend.dto;

import lombok.Builder;

@Builder
public class SdpMessage {
    private String meetingId;
    private String message;

    public String getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

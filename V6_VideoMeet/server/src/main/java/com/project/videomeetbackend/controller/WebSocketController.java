package com.project.videomeetbackend.controller;

import com.project.videomeetbackend.dto.SdpMessage;
import com.project.videomeetbackend.model.Meeting;
import com.project.videomeetbackend.model.Participant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, Meeting> meetings = new ConcurrentHashMap<>();

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/sdpMessage/{meetingId}")
    public void sdpProcess(SdpMessage sdpMessage) {
        String meetingId = sdpMessage.getMeetingId();
        String message = sdpMessage.getMessage();

        Meeting meeting = meetings.get(meetingId);
        if (meeting != null) {
            meeting.getParticipants().forEach(participant -> {
                messagingTemplate.convertAndSendToUser(participant.getConnectionId(), "/topic/sdpProcess", message);
            });
        }
    }

    @MessageMapping("/currentMeetingUsers/{meetingId}")
    public void currentMeetingUsers(String meetingId) {
        Meeting meeting = meetings.computeIfAbsent(meetingId, Meeting::new);
        messagingTemplate.convertAndSend("/topic/currentMeetingUsers/" + meetingId, meeting.getParticipants());
    }

}

package com.project.videomeetbackend.config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.project.videomeetbackend.dto.SdpMessage;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String meetingId = (String) headerAccessor.getSessionAttributes().get("meetingId");
        if (username != null && meetingId != null) {
            log.info("User disconnected: {}", username);
            var sdpMessage = SdpMessage.builder()
                .meetingId(meetingId)
                .message(username + " left the meeting!")
                .build();
            messagingTemplate.convertAndSend("/topic/currentMeetingUsers/" + meetingId, sdpMessage);
        }
    }
}


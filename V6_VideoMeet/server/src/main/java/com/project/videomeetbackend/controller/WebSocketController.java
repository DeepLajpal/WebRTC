package com.project.videomeetbackend.controller;


// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.handler.annotation.Payload;
// import org.springframework.messaging.handler.annotation.SendTo;
// import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
// import org.springframework.stereotype.Controller;

// @Controller
// public class ChatController {

//     @MessageMapping("/chat.sendMessage")
//     @SendTo("/topic/public")
//     public ChatMessage sendMessage(
//             @Payload ChatMessage chatMessage
//     ) {
//         return chatMessage;
//     }

//     @MessageMapping("/chat.addUser")
//     @SendTo("/topic/public")
//     public ChatMessage addUser(
//             @Payload ChatMessage chatMessage,
//             SimpMessageHeaderAccessor headerAccessor
//     ) {
//         // Add username in web socket session
//         headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
//         return chatMessage;
//     }
// }

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.project.videomeetbackend.model.Participant;
import com.project.videomeetbackend.repository.ParticipantRepository;

import java.util.List;

@Controller
public class WebSocketController {

    @Autowired
    private ParticipantRepository participantRepository;

    @MessageMapping("/join/{meetingId}")
    @SendTo("/topic/meeting/{meetingId}")
    public List<Participant> joinMeeting(Integer meetingId) {
        List<Participant> existingParticipants = participantRepository.findByMeetingMeetingId(meetingId);
        return existingParticipants;
    }

    @MessageMapping("/sdpProcess")
    public void sdpProcess(SdpMessage sdpMessage) {
        // Handle SDP message
    }

    // Other message mappings and methods to handle user interactions

    static class SdpMessage {
        private String message;
        private String toConnId;
        private String fromConnId;

        // getters and setters
    }
}


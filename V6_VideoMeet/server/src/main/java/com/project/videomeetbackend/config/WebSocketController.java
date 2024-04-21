package com.project.videomeetbackend.config;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "*")

public class WebSocketController {

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public String greeting(String message) {
        System.out.println("Message: " + message);
        return "Hi, " + message;
    }
}


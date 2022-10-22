package com.sportradar.sdk.example;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import java.text.SimpleDateFormat;

@CrossOrigin
@RestController
@RequestMapping
public class ServerController {
    @GetMapping(path = "/test")
    public String test() {
        return "test";
    }

    @MessageMapping("/socket")
    @SendTo("/topic/messages")
    public String send(String message) throws Exception {
        return message;
    }
}

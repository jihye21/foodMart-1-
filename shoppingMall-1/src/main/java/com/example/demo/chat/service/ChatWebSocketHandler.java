package com.example.demo.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final AIService aiService;

    @Autowired
    public ChatWebSocketHandler(AIService aiService) {
        this.aiService = aiService;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String userMessage = message.getPayload();  
        String aiResponse = aiService.callAIService(userMessage); 
        session.sendMessage(new TextMessage(aiResponse));  
    }
}

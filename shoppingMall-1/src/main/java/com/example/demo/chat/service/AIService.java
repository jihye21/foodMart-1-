package com.example.demo.chat.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AIService {
	
	private static final String AI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC-Nj52zLB0e3t73TX3-qfoWWB1-Ke9aak";
    private static final String API_KEY = "AIzaSyC-Nj52zLB0e3t73TX3-qfoWWB1-Ke9aak";

   
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String userMessage = message.getPayload();
        
        // AI 서비스 호출
        String aiResponse = callAIService(userMessage);
        System.out.println("AI Response: " + aiResponse);
        // AI 응답을 클라이언트로 전달
        session.sendMessage(new TextMessage(aiResponse));
    }

    public String callAIService(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();

        // 요청 본문 생성
        String requestBody = "{"
                + "\"contents\": [{\"parts\": [{\"text\": \"" + userMessage + "\"}]}]"
                + "}";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer " + API_KEY);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            System.out.println("Sending request: " + requestBody); // 요청 본문 출력

            // API 호출
            ResponseEntity<String> response = restTemplate.postForEntity(AI_API_URL, entity, String.class);

            // 응답 상태 코드와 본문 출력
            System.out.println("Response Status: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());

            // 응답 상태 코드가 2xx 범위일 경우
            if (response.getStatusCode().is2xxSuccessful()) {
                String responseBody = response.getBody();
                String aiMessage = extractAIMessage(responseBody);
                System.out.println("Extracted AI Message: " + aiMessage); // 추출된 메시지 출력
                return "{\"role\": \"ai\", \"text\": \"" + aiMessage + "\"}";
            } else {
                return "{\"role\": \"ai\", \"text\": \"Error: Unable to call the AI service\"}";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"role\": \"ai\", \"text\": \"Error: API call failed\"}";
        }
    }

    private String extractAIMessage(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);

            // 'candidates' 배열 가져오기
            JsonNode candidates = rootNode.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode firstCandidate = candidates.get(0);

                // 'content' -> 'parts' 경로로 메시지 추출
                JsonNode parts = firstCandidate.path("content").path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    JsonNode firstPart = parts.get(0);
                    return firstPart.path("text").asText();
                } else {
                    return "Error: No parts found in AI response";
                }
            } else {
                return "Error: No candidates found in AI response";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Failed to parse AI response";
        }
    }
        
    }
    






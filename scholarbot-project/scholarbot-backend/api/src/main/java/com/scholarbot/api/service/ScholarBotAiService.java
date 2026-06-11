package com.scholarbot.api.service;

import com.scholarbot.api.domain.SyllabusItem;
import com.scholarbot.api.repository.SyllabusItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ScholarBotAiService {

    @Value("${scholarbot.ai.api-key}")
    private String apiKey;

    @Autowired
    private SyllabusItemRepository syllabusRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(Long userId, String userPrompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        List<SyllabusItem> userSyllabus = syllabusRepository.findByUserId(userId);
        StringBuilder systemContext = new StringBuilder();
        systemContext.append("You are ScholarBot, an adaptive, highly skilled academic study assistant.\n");
        systemContext.append("Do not restrict answers to computer science unless prompted. Fully adapt to the student's current target subjects.\n");

        if (userSyllabus != null && !userSyllabus.isEmpty()) {
            systemContext.append("The student is currently tracking the following custom subjects and progress levels. Tailor your terminology, examples, and answers to complement these fields:\n");
            for (SyllabusItem item : userSyllabus) {
                systemContext.append("- Subject: ").append(item.getName()).append(" (Current Mastery: ").append(item.getProgress()).append("%)\n");
            }
        }

        systemContext.append("\nFormat your output clean and beautifully using standard markdown with bullet points and bold technical headers.");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            String finalPayloadText = systemContext.toString() + "\n\nStudent Doubt: " + userPrompt;

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", finalPayloadText))))
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return extractTextFromResponse(response.getBody());
        } catch (Exception e) {
            return "AI Engine Connection Timeout: " + e.getMessage();
        }
    }

    public String generateQuizPayload(String subjectName) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
        String quizPrompt = "Generate a 3-question multiple choice quiz about '" + subjectName + "'. " +
                "Return ONLY a raw valid JSON array inside a flat string, with no markdown code blocks formatting. " +
                "Each object must strictly have keys: 'id' (number), 'question' (string), 'options' (array of 4 strings), and 'correctIndex' (number 0-3).";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, Object> requestBody = Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", quizPrompt)))));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            return extractTextFromResponse(response.getBody());
        } catch (Exception e) {
            return "[]";
        }
    }

    private String extractTextFromResponse(Map<?, ?> body) {
        if (body != null && body.containsKey("candidates")) {
            List<?> candidates = (List<?>) body.get("candidates");
            if (!candidates.isEmpty()) {
                Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
                Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
                List<?> parts = (List<?>) content.get("parts");
                Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);
                return firstPart.get("text").toString();
            }
        }
        return "";
    }
}
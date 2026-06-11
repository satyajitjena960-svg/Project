package com.scholarbot.api.controller;

import com.scholarbot.api.domain.User;
import com.scholarbot.api.repository.UserRepository;
import com.scholarbot.api.service.ScholarBotAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/platform")
@CrossOrigin(origins = "http://localhost:5173")
public class PlatformController {

    @Autowired
    private ScholarBotAiService aiService;

    @Autowired
    private UserRepository userRepository;

    /**
     * POST AI Chat Assistant Endpoint
     */
    @PostMapping("/ai/chat")
    public ResponseEntity<Map<String, String>> askAiAssistant(@RequestBody Map<String, String> request) {
        // Hardcoded or dynamically pulled user session index fallback
        Long userId = 1L;
        String userPrompt = request.get("message");
        String aiResponse = aiService.generateResponse(userId, userPrompt);
        return ResponseEntity.ok(Map.of("response", aiResponse));
    }

    /**
     * GET AI Quiz Generator Endpoint
     */
    @GetMapping("/ai/quiz")
    public ResponseEntity<Map<String, String>> getAiQuiz(@RequestParam String subject) {
        String quizJson = aiService.generateQuizPayload(subject);
        return ResponseEntity.ok(Map.of("response", quizJson));
    }

    /**
     * GET Global Leaderboard
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getGlobalLeaderboard() {
        List<User> topUsers = userRepository.findAll();
        List<Map<String, Object>> rankMatrix = topUsers.stream()
                .sorted((u1, u2) -> Integer.compare(u2.getCurrentStreak(), u1.getCurrentStreak()))
                .map(user -> Map.of(
                        "id", (Object) user.getId(),
                        "name", (Object) user.getName(),
                        "streak", (Object) user.getCurrentStreak(),
                        "score", (Object) (user.getCurrentStreak() * 320 + 1200)
                ))
                .toList();
        return ResponseEntity.ok(rankMatrix);
    }
}
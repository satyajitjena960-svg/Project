package com.scholarbot.api.controller;

import com.scholarbot.api.domain.QuizResult;
import com.scholarbot.api.repository.QuizResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:5173") // Connects to your running React Vite port safely
public class QuizController {

    @Autowired
    private QuizResultRepository quizResultRepository;

    // 1. GET user quiz performance metrics history
    @GetMapping("/user/{userId}")
    public List<QuizResult> getUserQuizHistory(@PathVariable Long userId) {
        return quizResultRepository.findByUserIdOrderByDateTakenDesc(userId);
    }

    // 2. POST log a newly completed quiz score card entry
    @PostMapping("/submit")
    public ResponseEntity<QuizResult> submitQuizResult(@RequestBody QuizResult result) {
        result.setDateTaken(LocalDateTime.now());
        QuizResult savedResult = quizResultRepository.save(result);
        return ResponseEntity.ok(savedResult);
    }
}
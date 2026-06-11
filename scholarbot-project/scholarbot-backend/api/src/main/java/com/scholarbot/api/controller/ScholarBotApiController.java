package com.scholarbot.api.controller;

import com.scholarbot.api.domain.User;
import com.scholarbot.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class ScholarBotApiController {

    @Autowired
    private UserRepository userRepository;

    /**
     * GET User Performance Metrics for Dashboard
     * Exposes stats, streak data, and subscription tier indicators to the React app.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getDashboardMetrics(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Map data directly into a JSON structure matching the frontend requirement keys
        return ResponseEntity.ok(Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "currentStreak", user.getCurrentStreak(),
                "planType", user.getPlanType() != null ? user.getPlanType() : "Free tier",
                "lastActiveDate", user.getLastActiveDate() != null ? user.getLastActiveDate().toString() : ""
        ));
    }

    /**
     * POST Sync Action to record updated dashboard configurations or manually trigger telemetry logging.
     */
    @PostMapping("/sync-user")
    public ResponseEntity<?> syncUserTelemetry(@RequestBody Map<String, Object> payload) {
        if (!payload.containsKey("userId")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required field: userId"));
        }

        Long userId = Long.valueOf(payload.get("userId").toString());
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Dynamically update fields if included in payload maps
        if (payload.containsKey("planType")) {
            user.setPlanType(payload.get("planType").toString());
        }
        if (payload.containsKey("currentStreak")) {
            user.setCurrentStreak((Integer) payload.get("currentStreak"));
        }

        user.setLastActiveDate(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(updatedUser);
    }

    /*
     * REMOVED DUPLICATE METHOD: signup()
     *
     * The sign-up method conflict throwing the Ambiguous mapping exception has been cleanly removed
     * from this controller because AuthController.java is dedicated specifically to handling user profile registers.
     */
}
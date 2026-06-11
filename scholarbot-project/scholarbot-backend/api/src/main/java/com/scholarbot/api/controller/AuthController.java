package com.scholarbot.api.controller;

import com.scholarbot.api.domain.User;
import com.scholarbot.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/auth") // Must match ${BASE_URL}/auth/ exactly
@CrossOrigin(origins = "http://localhost:5173") // Permits your Vite client to link
public class AuthController {
    // ...

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (userRepository.findAll().stream().anyMatch(u -> u.getEmail().equalsIgnoreCase(email))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered!"));
        }

        User user = new User();
        user.setName(payload.get("name"));
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(payload.get("password")));
        user.setCurrentStreak(1);

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        Optional<User> userOpt = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();

        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.ok(userOpt.get());
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or security token credentials."));
    }
}
package com.scholarbot.api.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_results")
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String subject;      // e.g., "Data Structures"
    private int score;           // e.g., 87
    private int totalQuestions;  // e.g., 5
    private LocalDateTime dateTaken;

    // Constructors
    public QuizResult() {}

    public QuizResult(User user, String subject, int score, int totalQuestions, LocalDateTime dateTaken) {
        this.user = user;
        this.subject = subject;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.dateTaken = dateTaken;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public LocalDateTime getDateTaken() { return dateTaken; }
    public void setDateTaken(LocalDateTime dateTaken) { this.dateTaken = dateTaken; }
}
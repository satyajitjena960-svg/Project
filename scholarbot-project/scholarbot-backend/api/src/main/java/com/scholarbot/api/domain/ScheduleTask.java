package com.scholarbot.api.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedule_tasks")
public class ScheduleTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String title;
    private String subtext;
    private LocalDateTime targetTime;
    private String status;
    private String accentColor;

    // Constructors
    public ScheduleTask() {}

    public ScheduleTask(Long id, User user, String title, String subtext, LocalDateTime targetTime, String status, String accentColor) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.subtext = subtext;
        this.targetTime = targetTime;
        this.status = status;
        this.accentColor = accentColor;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtext() { return subtext; }
    public void setSubtext(String subtext) { this.subtext = subtext; }
    public LocalDateTime getTargetTime() { return targetTime; }
    public void setTargetTime(LocalDateTime targetTime) { this.targetTime = targetTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }
}
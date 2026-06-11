package com.scholarbot.api.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "syllabus_items")
public class SyllabusItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int progress;

    @Column(name = "color_accent")
    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public SyllabusItem() {}

    public SyllabusItem(String name, int progress, String color, User user) {
        this.name = name;
        this.progress = progress;
        this.color = color;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
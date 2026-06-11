package com.scholarbot.api.config;

import com.scholarbot.api.domain.User;
import com.scholarbot.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class HabitStreakEngine {

    @Autowired private UserRepository userRepo;

    @Scheduled(cron = "0 0 0 * * ?") // Fires automatically at 12:00 AM daily
    public void processDailyStreakResets() {
        List<User> targetUsers = userRepo.findAll();
        LocalDateTime deadZoneThreshold = LocalDateTime.now().minusHours(48);

        for (User currentTarget : targetUsers) {
            if (currentTarget.getLastActiveDate() == null || currentTarget.getLastActiveDate().isBefore(deadZoneThreshold)) {
                currentTarget.setCurrentStreak(0);
                userRepo.save(currentTarget);
            }
        }
    }
}
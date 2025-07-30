package com.cinemate.achievement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AchievementInitializer implements CommandLineRunner {

    private final AchievementService achievementService;

    @Autowired
    public AchievementInitializer(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @Override
    public void run(String... args) throws Exception {
        achievementService.initializeDefaultAchievements();
    }
}

package com.cinemate.achievement;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AchievementInitializer implements CommandLineRunner {

    private final AchievementService achievementService;

    @Override
    public void run(String... args) throws Exception {
        achievementService.initializeDefaultAchievements();
    }
}

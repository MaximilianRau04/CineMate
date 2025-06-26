package com.cinemate.notification;

import com.cinemate.user.User;
import com.cinemate.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Autowired
    private UserRepository userRepository;

    @Value("${spring.mail.from:noreply@cinemate.com}")
    private String fromEmail;

    @Value("${spring.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${cinemate.mail.rate-limit.emails-per-hour:10}")
    private int emailsPerHour;

    private final Map<String, EmailRateLimit> rateLimitMap = new ConcurrentHashMap<>();

    private static class EmailRateLimit {
        private LocalDateTime lastReset = LocalDateTime.now();
        private int emailCount = 0;
    }

    /**
     * Check if user has exceeded email rate limit
     * @param userEmail
     * @return true if within rate limit
     */
    private boolean isWithinRateLimit(String userEmail) {
        EmailRateLimit rateLimit = rateLimitMap.computeIfAbsent(userEmail, k -> new EmailRateLimit());
        
        LocalDateTime now = LocalDateTime.now();

        if (rateLimit.lastReset.isBefore(now.minusHours(1))) {
            rateLimit.emailCount = 0;
            rateLimit.lastReset = now;
        }
        
        if (rateLimit.emailCount >= emailsPerHour) {
            System.out.println("Rate limit exceeded for " + userEmail + ". Emails sent this hour: " + rateLimit.emailCount);
            return false;
        }
        
        rateLimit.emailCount++;
        return true;
    }

    @Async
    public void sendNotificationEmail(String toEmail, String subject, String message) {
        if (!mailEnabled || mailSender == null) {
            System.out.println("Email service not configured. Would send to " + toEmail + ": " + subject);
            return;
        }

        if (!isWithinRateLimit(toEmail)) {
            System.out.println("Rate limit exceeded for " + toEmail + ". Skipping email: " + subject);
            return;
        }

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(toEmail);
            mailMessage.setSubject("CineMate: " + subject);
            mailMessage.setText(message);

            mailSender.send(mailMessage);
            System.out.println("Email sent to " + toEmail + ": " + subject);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }

    @Async
    public void sendHtmlNotificationEmail(String toEmail, String subject, String htmlContent) {
        if (!mailEnabled || mailSender == null) {
            System.out.println("Email service not configured. Would send HTML email to " + toEmail + ": " + subject);
            return;
        }

        if (!isWithinRateLimit(toEmail)) {
            System.out.println("Rate limit exceeded for " + toEmail + ". Skipping HTML email: " + subject);
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("CineMate: " + subject);
            helper.setText(htmlContent, true); // true = HTML content
            
            mailSender.send(mimeMessage);
            System.out.println("HTML Email sent to " + toEmail + ": " + subject);
        } catch (MessagingException e) {
            System.err.println("Failed to send HTML email to " + toEmail + ": " + e.getMessage());
        }
    }

    @Async
    public void sendTemplatedNotificationEmail(String toEmail, String title, String message, String actionUrl, String actionText) {
        String htmlContent = emailTemplateService.createNotificationEmailTemplate(title, message, actionUrl, actionText);
        sendHtmlNotificationEmail(toEmail, title, htmlContent);
    }

    @Async
    public void sendWeeklySummaryEmail(String userId, String title, String content, int upcomingMovies, int upcomingSeries) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return;
        
        User user = userOpt.get();
        String htmlContent = emailTemplateService.createWeeklySummaryTemplate(
            user.getUsername(), upcomingMovies, upcomingSeries, content
        );
        sendHtmlNotificationEmail(user.getEmail(), title, htmlContent);
    }

    @Async
    public void sendMilestoneEmail(String userId, String milestoneType, int count) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return;
        
        User user = userOpt.get();
        String htmlContent = emailTemplateService.createMilestoneTemplate(user.getUsername(), milestoneType, count);
        sendHtmlNotificationEmail(user.getEmail(), "🏆 Meilenstein erreicht!", htmlContent);
    }
}

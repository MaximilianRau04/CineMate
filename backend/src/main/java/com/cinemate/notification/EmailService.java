package com.cinemate.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@cinemate.com}")
    private String fromEmail;

    @Value("${spring.mail.enabled:false}")
    private boolean mailEnabled;

    @Async
    public void sendNotificationEmail(String toEmail, String subject, String message) {
        if (!mailEnabled || mailSender == null) {
            System.out.println("Email service not configured. Would send to " + toEmail + ": " + subject);
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
}

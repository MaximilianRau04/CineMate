package com.cinemate.notification;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
  List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

  List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(String userId);

  List<Notification> findByUserIdAndType(String userId, NotificationType type);

  List<Notification> findBySentFalseAndCreatedAtBefore(LocalDateTime dateTime);

  long countByUserIdAndReadFalse(String userId);
}

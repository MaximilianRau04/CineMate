package com.cinemate.notification.DTOs;

import com.cinemate.notification.NotificationType;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequestDTO {
  @NotNull private String userId;
  @NotNull private NotificationType type;
  private String title;
  private String message;
  private String itemId;
  private String itemType;
  private Map<String, Object> metadata;
}

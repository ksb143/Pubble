package com.ssafy.d109.pubble.dto.responseDto;

import com.ssafy.d109.pubble.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class NotificationMessageResponseDto {

    private Integer notificationId;
    private Boolean isChecked;
    private String content;
    private SenderInfoDto senderInfo;
    private LocalDateTime createdAt;
    private NotificationType type;
    private TypeDataDto typeData;

    public NotificationMessageResponseDto() {

    }
}

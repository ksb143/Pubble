package com.ssafy.d109.pubble.dto.responseDto;

import com.ssafy.d109.pubble.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class NotificationMessageResponseDto {

    private Integer notificationMsgId;
    private Boolean isChecked;
    private NotificationType type;
    private String content;
}

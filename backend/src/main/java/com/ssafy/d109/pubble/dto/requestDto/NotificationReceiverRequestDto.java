package com.ssafy.d109.pubble.dto.requestDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationReceiverRequestDto {

    private Boolean isMentioned;
    private String receiverId;      // employeeId
    private String receiverName;
}

package com.ssafy.d109.pubble.dto.realtimeRequirementDto;

import com.ssafy.d109.pubble.dto.requestDto.NotificationReceiverRequestDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StompCommentCreateDto {
    private Integer userThreadId;
    private String content;
    private Integer projectId;
    private Integer requirementId;
    private NotificationReceiverRequestDto receiverInfo;
}

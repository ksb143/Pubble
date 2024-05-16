package com.ssafy.d109.pubble.dto.projectDto;

import com.ssafy.d109.pubble.dto.requestDto.NotificationReceiverRequestDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentCreateDto {
    private String content;
    private NotificationReceiverRequestDto receiverInfo;
}

package com.ssafy.d109.pubble.dto.messageDto;

import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class MessageResponseDto {

    private Integer messageId;
    private String title;
    private String content;
    private String status;
    private LocalDateTime createdAt;
    private UserInfoDto senderInfo;
    private UserInfoDto receiverInfo;
}

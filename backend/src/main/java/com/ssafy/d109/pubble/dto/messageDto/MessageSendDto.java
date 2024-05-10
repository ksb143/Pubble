package com.ssafy.d109.pubble.dto.messageDto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MessageSendDto {

    private String title;
    private String content;
}

package com.ssafy.d109.pubble.dto.requestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class FcmSendDto {

    private String token;
    private String title;
    private String body;
}

package com.ssafy.d109.pubble.dto.requestDto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FcmNotificationRequestDto {

    private String targetUserId;
    private String title;
    private String body;

}

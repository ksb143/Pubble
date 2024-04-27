package com.ssafy.d109.pubble.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class ReissueResponseDataDto {
    private String newAccessToken;
    private Boolean data;
}

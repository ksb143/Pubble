package com.ssafy.d109.pubble.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class SignInResponseDataDto {

    private String accessToken;
    private Boolean data;
}

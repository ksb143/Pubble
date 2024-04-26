package com.ssafy.d109.pubble.dto.responseDto;

import com.ssafy.d109.pubble.dto.response.SignInResponseDataDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignInResponseDto {

    private String messges;
    private SignInResponseDataDto dto;
}

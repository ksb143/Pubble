package com.ssafy.d109.pubble.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignInRequestDto {

    private String employeeId;
    private String password;
}

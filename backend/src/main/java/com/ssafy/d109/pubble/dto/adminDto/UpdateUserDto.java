package com.ssafy.d109.pubble.dto.adminDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserDto {

    private String employeeId; // 사번은 고유한 값으로써, 유저를 구분합니다.

    private String name;
    private String deleteYN;
    private String department;
    private String position;
    private String role;
    private String password;
    private String isApprovable;
    private String profileColor;
}

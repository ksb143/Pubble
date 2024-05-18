package com.ssafy.d109.pubble.dto.adminDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserDto {

    private String department;
    private String employeeId;
    private String isApprovable;
    private String name;
    private String password;
    private String position;
    private String role;

}

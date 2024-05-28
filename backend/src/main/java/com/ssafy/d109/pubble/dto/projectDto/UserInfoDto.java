package com.ssafy.d109.pubble.dto.projectDto;

import com.ssafy.d109.pubble.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserInfoDto {

    private String name;
    private String employeeId;
    private String department;
    private String position;
    private String role;
    private String isApprovable;
    private String profileColor;

    public static UserInfoDto createUserInfo(User user) {
        return  UserInfoDto.builder()
                .employeeId(user.getEmployeeId())
                .name(user.getName())
                .department(user.getDepartment())
                .position(user.getPosition())
                .role(user.getRole())
                .isApprovable(user.getIsApprovable())
                .profileColor(user.getProfileColor())
                .build();
    }
}

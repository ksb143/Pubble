package com.ssafy.d109.pubble.dto.userLocationDto;

import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserLocationDto {

    private String operation; // e : enter 입장, m : move 이동, l : leave 퇴장/

    private String employeeId; // 유저 정보 내에 존재하지만 편의를 위해
    private UserInfoDto userInfoDto; // 유저 정보

    private String locationName;
    private String locationUrl;
}

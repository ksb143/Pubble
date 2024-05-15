package com.ssafy.d109.pubble.dto.userLocationDto;

import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserLocationInfo {

    private UserInfoDto userInfoDto; // 유저 정보

    private String locationName; // 프론트에서 이름을 정해주는건?
    private String locationUrl; // 이것도 프론트에서 보내줘야 할 듯
}

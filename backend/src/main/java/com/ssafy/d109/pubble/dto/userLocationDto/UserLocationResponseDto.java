package com.ssafy.d109.pubble.dto.userLocationDto;

import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserLocationResponseDto {

    private List<UserLocationInfo> userLocationInfos;  // m의 경우 하나만 들어가게 될 것
}

package com.ssafy.d109.pubble.dto.userLocationDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllUserLocationResponseDto {

    private List<UserLocationDto> connected;
    private List<UserLocationDto> nonConnected;
}

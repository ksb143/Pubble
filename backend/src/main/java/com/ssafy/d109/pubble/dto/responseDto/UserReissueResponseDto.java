package com.ssafy.d109.pubble.dto.responseDto;

import com.ssafy.d109.pubble.dto.response.ReissueResponseDataDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class UserReissueResponseDto {

    private String message;
    private ReissueResponseDataDto resData;
}

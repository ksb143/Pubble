package com.ssafy.d109.pubble.dto.responseDto;

import com.ssafy.d109.pubble.dto.response.UserThreadDto;
import com.ssafy.d109.pubble.dto.response.UserThreadListData;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserThreadResponseDto {

    private String message;
//    private List<UserThreadDto> resData;
    private UserThreadListData resData;
    private Boolean data;

}

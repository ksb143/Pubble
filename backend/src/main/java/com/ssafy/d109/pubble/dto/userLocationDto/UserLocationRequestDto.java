package com.ssafy.d109.pubble.dto.userLocationDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserLocationRequestDto {

//    private String employeeId;
//    private String operation; // e : enter 입장, m : move 이동, l : leave 퇴장/ enum으로 할 지?
    private String locationName;
    private String locationUrl;
}

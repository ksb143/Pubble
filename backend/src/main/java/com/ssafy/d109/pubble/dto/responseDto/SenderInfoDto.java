package com.ssafy.d109.pubble.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class SenderInfoDto {

    private String name;
    private String employeeId;
    private String position;
    private String department;
    private String profileColor;
}

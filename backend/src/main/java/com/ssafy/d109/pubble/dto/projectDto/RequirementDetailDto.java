package com.ssafy.d109.pubble.dto.projectDto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RequirementDetailDto {

    private Integer requirementDetailId;
    private String content; // 내용
    private String status; // 상태
}

package com.ssafy.d109.pubble.dto.projectDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RequirementUpdateDto {

    private String isApproval;
    private String code;
    private String requirementName;
    private String detail;
    private Integer managerId;
    private Integer authorId;
    private String version; // ??
}

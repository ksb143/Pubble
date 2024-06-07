package com.ssafy.d109.pubble.dto.projectDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class RequirementSummaryDto {

    private Integer requirementId;

    private Integer orderIndex;
    private String version;
    private String isLock;
    private String approval;
    private String approvalComment;
    private String code;
    private String requirementName;
    private List<RequirementDetailDto> details;
    private UserInfoDto manager; // 담당자
    private String targetUser;
    private LocalDateTime createdAt;
    private UserInfoDto author; // 작성자
}

package com.ssafy.d109.pubble.dto.projectDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

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
    private String detail;
    private UserInfoDto manager; // 담당자
    private String targetUser;
    private LocalDateTime createdAt;
//    private Project project;
    private UserInfoDto author; // 작성자
}

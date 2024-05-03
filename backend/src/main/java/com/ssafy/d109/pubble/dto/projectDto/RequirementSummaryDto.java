package com.ssafy.d109.pubble.dto.projectDto;

import com.ssafy.d109.pubble.entity.Project;
import com.ssafy.d109.pubble.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    private DashboardUserInfo manager; // 담당자
    private String targetUser;
    private LocalDateTime createdAt;
//    private Project project;
    private DashboardUserInfo author; // 작성자
}

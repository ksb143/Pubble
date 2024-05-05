package com.ssafy.d109.pubble.dto.requestDto;

import com.ssafy.d109.pubble.entity.Project;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequirementConfirmRequestDto {

    // @NotNull 통한 데이터 유효성 검사 고려 (import javax.validation.constraints.NotNull)


    private Integer projectId;
    private String isLock;
    private String approval;
    private String requirementName;
    private String approvalComment;

    /*
    public enum ApprovalStatus {
        APPROVED, REJECTED
    }
    */

}
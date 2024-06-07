package com.ssafy.d109.pubble.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class ConfirmDataDto {

    private Integer projectId;
    private String approval;
    private String approvalComment;
    private String version;
    private Boolean data;

    public String toSignatureString() {
        return "projectId: " + projectId +
                ", approval: " + approval +
                ", approvalComment: " + approvalComment +
                ", version: " + version +
                ", data: " + data;
    }
}

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
    private String requirementName;
    private String detail;
    private LocalDateTime createdAt;

    public String toSignatureString() {
        return "projectId: " + projectId +
                ", requirementName: " + requirementName +
                ", detail: " + detail +
                ", createdAt: " + createdAt;
    }
}

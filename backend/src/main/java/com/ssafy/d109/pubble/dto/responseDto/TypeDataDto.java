package com.ssafy.d109.pubble.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class TypeDataDto {

    private Integer projectId;
    private String projectCode;
    private Integer requirementId;
    private String requirementCode;
    private Integer threadId;

    public TypeDataDto() {

    }
}

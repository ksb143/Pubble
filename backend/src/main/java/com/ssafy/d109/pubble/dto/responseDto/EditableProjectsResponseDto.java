package com.ssafy.d109.pubble.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class EditableProjectsResponseDto {

    private Integer projectId;
    private String projectCode;
    private Integer requirementId;
    private String requirementCode;


}

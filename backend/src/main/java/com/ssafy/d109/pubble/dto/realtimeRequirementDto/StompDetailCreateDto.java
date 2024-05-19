package com.ssafy.d109.pubble.dto.realtimeRequirementDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StompDetailCreateDto {
    private Integer requirementId;
    private String content;
}

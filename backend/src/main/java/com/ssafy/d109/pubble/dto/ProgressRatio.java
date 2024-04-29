package com.ssafy.d109.pubble.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProgressRatio {

    private float lockRatio;
    private float approvalRatio;
    private float changeRatio;
}

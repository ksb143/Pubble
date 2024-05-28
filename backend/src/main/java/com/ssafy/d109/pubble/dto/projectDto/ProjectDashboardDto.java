package com.ssafy.d109.pubble.dto.projectDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ProjectDashboardDto {

    private Integer projectId;
    private String projectTitle;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String status;
    private String code;
    private List<UserInfoDto> people;
    private float lockRatio;
    private float approveRatio;
    private float changedRatio;
}

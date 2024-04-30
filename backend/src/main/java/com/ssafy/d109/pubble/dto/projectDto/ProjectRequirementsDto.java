package com.ssafy.d109.pubble.dto.projectDto;

import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ProjectRequirementsDto {

    private Integer projectId;

    // 상단
    private String projectTitle;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String status;
    private String code;
    private List<User> people;

    // requirements
    private List<Requirement> requirements;
}

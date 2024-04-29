package com.ssafy.d109.pubble.dto;

import com.ssafy.d109.pubble.entity.Project;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class RequirementCreateDto {

//    private Integer orderIndex;
    private String code;
    private String requirementName;
    private String detail;
    private String manager;
    private String author;
    private String targetUser;
//    private String latest_version;
//    private LocalDateTime createAt;
//    private LocalDateTime updatedAt;
//    private Integer projectId;
}

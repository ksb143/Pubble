package com.ssafy.d109.pubble.dto.projectDto;

import com.ssafy.d109.pubble.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ProjectCreateDto {

    private String projectTitle;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String status;
    private String code;
}

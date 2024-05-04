package com.ssafy.d109.pubble.dto.projectDto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DashboardUserInfo {

    private Integer userId;
    private String name;
    private String employeeId;
    private String department;
    private String position;
    private String role;
    private String isApprovable;
    private String profileColor;
}

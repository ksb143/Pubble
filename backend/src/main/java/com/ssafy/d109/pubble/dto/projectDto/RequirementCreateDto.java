package com.ssafy.d109.pubble.dto.projectDto;

import com.ssafy.d109.pubble.entity.Project;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class RequirementCreateDto {

//    private Integer orderIndex;
    private String code;
    private String requirementName;
    private List<String> detailContents; // detail contents
    private String managerEId; // 일단은 employeeId로 받는중
    private String authorEId; // 접속자로 그대로 만들어버릴지? userId로 받을지? employeeId로 받을지?
    private String targetUser;
//    private String latest_version;
//    private LocalDateTime createAt;
//    private LocalDateTime updatedAt;
//    private Integer projectId;
}

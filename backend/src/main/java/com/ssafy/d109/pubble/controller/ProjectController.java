package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.*;
import com.ssafy.d109.pubble.entity.Project;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.ProjectService;
import com.ssafy.d109.pubble.service.RequirementService;
import com.ssafy.d109.pubble.util.CommonUtil;
import io.swagger.v3.oas.models.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final CommonUtil commonUtil;
    private final ProjectService projectService;
    private final RequirementService requirementService;

    @GetMapping()
    public ResponseEntity<?> getProjectList() {
        Integer userId = commonUtil.getUser().getUserId();
        List<ProjectListDto> projectList = projectService.getProjectList(userId);
        return ResponseEntity.ok(projectList);
    }

    @PostMapping() // Project_Init_001
    public ResponseEntity<Void> createProject(@RequestBody ProjectCreateDto projectCreateDto) {
        User user = commonUtil.getUser();
        projectService.createProject(user, projectCreateDto);
        return ResponseEntity.ok().build();
    }

    // 전반적으로 프로젝트 참여 여부 확인이 필요

    @GetMapping("/{project-id}/dashboards")
    public ResponseEntity<?> getProjectDashboard(@PathVariable("project-id") Integer projectId) {
        ProjectDashboardDto projectDashboardDto = projectService.getProjectDashboard(projectId);
        return ResponseEntity.ok(projectDashboardDto);
    }

    @PutMapping("/{project-id}")
    public ResponseEntity<?> changeProjectStatus(@PathVariable("project-id") Integer projectId, @RequestBody String status) {
        projectService.changeProjectStatus(projectId, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{project-id}/requirements")
    public ResponseEntity<?> getProjectRequirements(@PathVariable("project-id") Integer projectId) {
        ProjectRequirementsDto projectRequirementsDto = projectService.getProjectRequirements(projectId);
        return ResponseEntity.ok(projectRequirementsDto);
    }

    @PostMapping("/{project-id}/requirements")
    public ResponseEntity<?> createRequirement(@PathVariable("project-id") Integer projectId, @RequestBody RequirementCreateDto requirementCreateDto) {
        // 해당 프로젝트 권한 있는지 확인 필요 - 안그러면 남의 프로젝트에 requirements 삽입
        requirementService.createRequirement(projectId, requirementCreateDto);
        return ResponseEntity.ok().build();
    }

}

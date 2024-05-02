package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.projectDto.*;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.ProjectService;
import com.ssafy.d109.pubble.service.RequirementService;
import com.ssafy.d109.pubble.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private ResponseDto response;
    private final CommonUtil commonUtil;
    private final ProjectService projectService;
    private final RequirementService requirementService;

    @GetMapping()
    public ResponseEntity<ResponseDto> getProjectList() {
        Integer userId = commonUtil.getUser().getUserId();
        List<ProjectListDto> projectList = projectService.getProjectList(userId);

        response = new ResponseDto(true, "사용자가 참여중인 모든 프로젝트들의 리스트/대시보드", projectList);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping() // Project_Init_001
    public ResponseEntity<ResponseDto> createProject(@RequestBody ProjectCreateDto projectCreateDto) {
        User user = commonUtil.getUser();
        projectService.createProject(user, projectCreateDto);

        response = new ResponseDto(true, "새 프로젝트 생성", null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 전반적으로 프로젝트 참여 여부 확인이 필요

    @GetMapping("/{project-id}/dashboards")
    public ResponseEntity<ResponseDto> getProjectDashboard(@PathVariable("project-id") Integer projectId) {
        ProjectDashboardDto projectDashboardDto = projectService.getProjectDashboard(projectId);

        response = new ResponseDto(true, "해당 프로젝트의 대시보드", projectDashboardDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/{project-id}")
    public ResponseEntity<ResponseDto> changeProjectStatus(@PathVariable("project-id") Integer projectId, @RequestBody String status) {
        projectService.changeProjectStatus(projectId, status);

        response = new ResponseDto(true, "프로젝트 상태 변경", null);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }

    @GetMapping("/{project-id}/requirements")
    public ResponseEntity<ResponseDto> getProjectRequirements(@PathVariable("project-id") Integer projectId) {
        ProjectRequirementsDto projectRequirementsDto = projectService.getProjectRequirements(projectId);

        response = new ResponseDto(true, "해당 프로젝트의 요구사항 항목들", projectRequirementsDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/{project-id}/requirements")
    public ResponseEntity<ResponseDto> createRequirement(@PathVariable("project-id") Integer projectId, @RequestBody RequirementCreateDto requirementCreateDto) {
        requirementService.createRequirement(projectId, requirementCreateDto);

        response = new ResponseDto(true, "요구사항 항목 생성", null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // update version by command(h:hold / r:restore)
    @PostMapping("/{project-id}/requirements/{requirement-id}/version")
    public ResponseEntity<ResponseDto> createNewVersion(@PathVariable("requirement-id") Integer requirementId, @RequestBody String command) {
        requirementService.updateVersion(requirementId, command);

        response = new ResponseDto(true, "요구사항 항목의 새 버전 생성", null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 일단 인자 받아서 잠금 풀기도 가능은 하게 해놓음
    @PutMapping("/{project-id}/requirements/{requirement-id}/lock")
    public ResponseEntity<ResponseDto> updateRequirementLock(@PathVariable("requirement-id") Integer requirementId, @RequestBody String lock) {
        requirementService.updateRequirementLock(requirementId, lock);

        response = new ResponseDto(true, "해당 요구사항 항목의 잠금 상태 변경", null);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }

    @PutMapping("/{project-id}/requirements/{requirement-id}/approval")
    public ResponseEntity<ResponseDto> updateRequirementApproval(@PathVariable("requirement-id") Integer requirementId, @RequestBody ApprovalDto approvalDto) {
        requirementService.updateRequirementApproval(requirementId, approvalDto);

        response = new ResponseDto(true, "해당 요구사항 항목의 승인 상태 변경", null);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }
}

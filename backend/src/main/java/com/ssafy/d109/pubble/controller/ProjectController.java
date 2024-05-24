package com.ssafy.d109.pubble.controller;

import com.amazonaws.Response;
import com.ssafy.d109.pubble.dto.CommandDto;
import com.ssafy.d109.pubble.dto.projectDto.*;
import com.ssafy.d109.pubble.dto.response.CommentResponseData;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.ProjectService;
import com.ssafy.d109.pubble.service.RequirementService;
import com.ssafy.d109.pubble.util.CommonUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private ResponseDto<?> response;
    private final CommonUtil commonUtil;
    private final ProjectService projectService;

    @Operation(summary = "사용자가 참여중인 모든 프로젝트들의 리스트/대시보드", operationId = "1")
    @GetMapping()
    public ResponseEntity<ResponseDto<?>> getProjectList() {
        Integer userId = commonUtil.getUser().getUserId();
        List<ProjectListDto> projectList = projectService.getProjectList(userId);

        response = new ResponseDto<>(true, "사용자가 참여중인 모든 프로젝트들의 리스트/대시보드", projectList);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "새 프로젝트 생성", operationId = "2")
    @PostMapping()
    public ResponseEntity<ResponseDto<?>> createProject(@RequestBody ProjectCreateDto projectCreateDto) {
        User user = commonUtil.getUser();
        projectService.createProject(user, projectCreateDto);

        response = new ResponseDto<>(true, "새 프로젝트 생성", null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "해당 프로젝트의 대시보드", operationId = "3")
    @GetMapping("/projectId/dashboard")
    public ResponseEntity<ResponseDto<?>> getProjectDashboard(@PathVariable Integer projectId) {
        ProjectDashboardDto projectDashboardDto = projectService.getProjectDashboard(projectId);

        response = new ResponseDto<>(true, "해당 프로젝트의 대시보드", projectDashboardDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "프로젝트 상태 변경", description = "아직 딱히 제한 없음" ,operationId = "4")
    @PatchMapping("/{projectId}")
    public ResponseEntity<ResponseDto<?>> changeProjectStatus(@PathVariable Integer projectId, @RequestBody CommandDto commandDto) {
        projectService.changeProjectStatus(projectId, commandDto.getCommand());

        response = new ResponseDto<>(true, "프로젝트 상태 변경", null);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}

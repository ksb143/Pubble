package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.CommandDto;
import com.ssafy.d109.pubble.dto.projectDto.*;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.service.ProjectService;
import com.ssafy.d109.pubble.service.RequirementService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects/{projectId}/requirements")
@RequiredArgsConstructor
public class RequirementController {

    private ResponseDto<?> response;
    private final ProjectService projectService;
    private final RequirementService requirementService;

    @Operation(summary = "(요구사항 코드 - 히스토리 확인 : 요구사항 코드에 해당하는 요구사항 항목 기록(모든 버전들) 반환", operationId = "1")
    @GetMapping()
    public ResponseEntity<ResponseDto<?>> getRequirementsByCode(@PathVariable Integer projectId, @RequestParam("code") String code) {
        List<RequirementSummaryDto> requirementSummaryDtos = requirementService.getRequirementsByCode(projectId, code);

        response = new ResponseDto<>(true, "요구사항 코드에 해당하는 요구사항 항목 기록(모든 버전들) 반환", requirementSummaryDtos);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "해당 프로젝트의 요구사항 항목들 - 코드 별 최신", operationId = "2")
    @GetMapping("/recent")
    public ResponseEntity<ResponseDto<?>> getProjectRequirements(@PathVariable Integer projectId) {
        ProjectRequirementsDto projectRequirementsDto = projectService.getProjectRequirements(projectId);

        response = new ResponseDto<>(true, "해당 프로젝트의 요구사항 항목들 - 코드 별 최신", projectRequirementsDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "요구사항 항목 생성", operationId = "3")
    @PostMapping()
    public ResponseEntity<ResponseDto<?>> createRequirement(@PathVariable Integer projectId, @RequestBody RequirementCreateDto requirementCreateDto) {
        requirementService.createRequirement(projectId, requirementCreateDto);

        response = new ResponseDto<>(true, "요구사항 항목 생성", null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "요구사항 단일 항목 조회", operationId = "4")
    @GetMapping("/{requirementId}")
    public ResponseEntity<ResponseDto<?>> getRequirement(@PathVariable Integer requirementId) {
        RequirementSummaryDto requirementSummaryDto = requirementService.getRequirement(requirementId);

        response = new ResponseDto<>(true, "요구사항 단일 항목 조회", requirementSummaryDto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "요구사항 항목 수정", operationId = "5")
    @PatchMapping("/{requirementId}")
    public ResponseEntity<ResponseDto<?>> updateRequirement(@PathVariable Integer requirementId, @RequestBody RequirementUpdateDto requirementUpdateDto) {
        requirementService.updateRequirement(requirementId, requirementUpdateDto);

        response = new ResponseDto<>(true, "요구사항 항목 수정", null);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "요구사항 항목의 새 버전 생성", description = "update version by command(h:hold / r:restore)", operationId = "6")
    @PostMapping("/{requirementId}/version")
    public ResponseEntity<ResponseDto<?>> createNewVersion(@PathVariable Integer requirementId, @RequestBody CommandDto commandDto) {
        requirementService.updateVersion(requirementId, commandDto.getCommand());

        response = new ResponseDto<>(true, "요구사항 항목의 새 버전 생성", null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "해당 요구사항 항목의 잠금 상태 변경", description = "잠기도록 합니다. 잠금 풀기 기능 추가 가능/문의하십시오", operationId = "7")
    @PutMapping("/{requirementId}/lock")
    public ResponseEntity<ResponseDto<?>> updateRequirementLock(@PathVariable Integer requirementId) {
        requirementService.updateRequirementLock(requirementId);

        response = new ResponseDto<>(true, "해당 요구사항 항목의 잠금 상태 변경", null);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "해당 요구사항 항목의 승인 상태 변경", description = "u : 아직 조작 안됨, a : 승인됨, h : 보류됨", operationId = "8")
    @PutMapping("/{requirementId}/approval")
    public ResponseEntity<ResponseDto<?>> updateRequirementApproval(@PathVariable Integer requirementId, @RequestBody ApprovalDto approvalDto) {
        requirementService.updateRequirementApproval(requirementId, approvalDto);

        response = new ResponseDto<>(true, "해당 요구사항 항목의 승인 상태 변경", null);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "세부사항 항목 추가", operationId = "9")
    @PostMapping("/{requirementId}")
    public ResponseEntity<ResponseDto<?>> addRequirementDetail(@PathVariable Integer requirementId, @RequestBody AddRequirementDetailDto dto) {
        try {
            requirementService.addRequirementDetail(requirementId, dto);

            response = new ResponseDto<>(true, "세부사항 항목 추가", null);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = new ResponseDto<>(true, "세부사항 추가 생성 실패", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}

package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.projectDto.RequirementSummaryDto;
import com.ssafy.d109.pubble.dto.requestDto.RequirementHistoryDto;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.service.ProjectService;
import com.ssafy.d109.pubble.service.RequirementService;
import com.ssafy.d109.pubble.util.CommonUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/requirements")
@RequiredArgsConstructor
@Slf4j
public class ProjectRequirementController {
    private ResponseDto response;
    private final CommonUtil commonUtil;
    private final ProjectService projectService;
    private final RequirementService requirementService;


    /* getRequirementHistory : 요구사항 코드를 받아서 변화 내역을 반환해주는 메서드
    * @params : Integer projectId 가 포함된 request DTO, path Variable requirement Code (ex. NB-001)
    * @return : 요구사항 NB-001 의 V.1.0. 부터 최신 버전까지의 정보들
    * */
    @Operation(summary = "요구사항의 변화 내역 모두 보기")
    @PostMapping("/{code}/history")
    public ResponseEntity<ResponseDto> getRequirementHistory(@RequestBody RequirementHistoryDto requirementHistoryDto, @PathVariable("code") String requirementCode) {
        Integer projectId = requirementHistoryDto.getProjectId();
        List<RequirementSummaryDto> requirementSummaryDtos = requirementService.getRequirementsByCode(projectId, requirementCode);

        response = new ResponseDto(true, "코드에 해당하는 요구사항 항목 기록 반환", requirementSummaryDtos);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }




}

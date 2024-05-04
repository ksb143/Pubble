package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.request.ConfirmDataDto;
import com.ssafy.d109.pubble.dto.requestDto.RequirementConfirmRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.Error400ResponseDto;
import com.ssafy.d109.pubble.dto.responseDto.RequirementConfirmResponsedto;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.exception.Requirement.RequirementNotFoundException;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import com.ssafy.d109.pubble.service.RequirementConfirmService;
import com.ssafy.d109.pubble.service.RequirementService;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/requirements")
@Log4j2
public class RequirementConfirmController {

    private final RequirementConfirmService requirementConfirmService;
    private final RequirementService requirementService;
    private final RequirementRepository requirementRepository;

    public RequirementConfirmController(RequirementConfirmService requirementConfirmService, RequirementRepository requirementRepository, RequirementService requirementService) {
        this.requirementConfirmService = requirementConfirmService;
        this.requirementRepository = requirementRepository;
        this.requirementService = requirementService;
    }

    @PostMapping("/confirm/{requirementId}")
    public ResponseEntity<?> confirm(@PathVariable Integer requirementId, @RequestBody RequirementConfirmRequestDto reqDto) throws ReflectiveOperationException {

        Error400ResponseDto badResponseDto = new Error400ResponseDto();
        Requirement requirement = requirementRepository.findRequirementByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new);

        if (requirement == null) {
            // 예외처리 날리장~
            badResponseDto.setMessage("BAD_REQUEST");
            badResponseDto.setData(false);
            return new ResponseEntity<>(badResponseDto, HttpStatus.BAD_REQUEST);
        }

        if (!requirementConfirmService.isLocked(reqDto.getIsLock())) {
            badResponseDto.setMessage("BAD_REQUEST");
            badResponseDto.setData(false);
            // 예외처리 날리장~

            return new ResponseEntity<>(badResponseDto, HttpStatus.BAD_REQUEST);
        }

        RequirementConfirmResponsedto responseDto = new RequirementConfirmResponsedto();
        if (reqDto.getApproval().equals("h")) {
            log.info("HOLD! 보류여요");
            requirementConfirmService.updateApprovalComment(requirement, reqDto.getApprovalComment());
            requirementService.updateVersion(requirementId, reqDto.getApproval());

        } else if (reqDto.getApproval().equals("a")) {
            log.info("APPROVAL! 승인이여요");
            // 1. 해당 요구사항의 approval, approvalComment 정보 갱신
            requirementConfirmService.approveRequirement(requirement);
            requirementConfirmService.updateApprovalComment(requirement, reqDto.getApprovalComment());
            // 2. 전자서명 생성 및 저장
            ConfirmDataDto confirmData = ConfirmDataDto.builder()
                    .projectId(requirement.getProject().getProjectId())
                    .approval("a")
                    .approvalComment(reqDto.getApprovalComment())
                    .version(requirement.getVersion())
                    .data(true)
                    .build();

            HashMap<String, String> keyPair = requirementConfirmService.createKeyPairAsString();
            String stringPublicKey = keyPair.get("publicKey");
            String stringPrivateKey = keyPair.get("privateKey");

            String signature = requirementConfirmService.signData(confirmData, stringPrivateKey);

            // 3. 전자서명 검증
            requirementConfirmService.verifySignature(confirmData, signature, stringPublicKey);

            responseDto.setMessage("Confirm Complete");
            responseDto.setResponseDto(confirmData);
            responseDto.setSignature(signature);

            System.out.println("추카염. 니가 또 해냈다");
            return new ResponseEntity<>(responseDto, HttpStatus.OK);

        }

        ConfirmDataDto confirmData = ConfirmDataDto.builder()
                .projectId(requirement.getProject().getProjectId())
                .approval("h")
                .approvalComment(reqDto.getApprovalComment())
                .data(false)
                .build();

        responseDto.setMessage("Confirm Hold");
        responseDto.setResponseDto(confirmData);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
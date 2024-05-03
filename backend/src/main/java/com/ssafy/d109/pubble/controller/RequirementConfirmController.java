package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.request.ConfirmDataDto;
import com.ssafy.d109.pubble.dto.requestDto.RequirementConfirmRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.RequirementConfirmResponsedto;
import com.ssafy.d109.pubble.entity.Requirement;
import com.ssafy.d109.pubble.exception.Requirement.RequirementNotFoundException;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import com.ssafy.d109.pubble.service.RequirementConfirmService;
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
    private final RequirementRepository requirementRepository;

    public RequirementConfirmController(RequirementConfirmService requirementConfirmService, RequirementRepository requirementRepository) {
        this.requirementConfirmService = requirementConfirmService;
        this.requirementRepository = requirementRepository;
    }

    @PostMapping("/confirm/{requirementId}")
    public ResponseEntity<RequirementConfirmResponsedto> confirm(@PathVariable Integer requirementId, @RequestBody RequirementConfirmRequestDto reqDto) throws ReflectiveOperationException {

        RequirementConfirmResponsedto responseDto = new RequirementConfirmResponsedto();
        Requirement requirement = requirementRepository.findRequirementByRequirementId(requirementId).orElseThrow(RequirementNotFoundException::new);

        if (!requirementConfirmService.isLocked(reqDto.getIsLock())) {
            responseDto.setMessage("BAD_REQUEST");

            // 예외처리 날리장~

            return new ResponseEntity<>(responseDto, HttpStatus.BAD_REQUEST);
        }

        if (!(reqDto.getApproval().equals("a")) || requirement == null) {
            // 예외처리 날리장~

            return new ResponseEntity<>(responseDto, HttpStatus.BAD_REQUEST);
        }


        // 1. 해당 요구사항의 approval 정보 갱신
        requirementConfirmService.approveRequirement(requirement);

        // 2. 전자서명 생성 및 저장
        ConfirmDataDto confirmData = ConfirmDataDto.builder()
                .projectId(requirement.getProject().getProjectId())
                .requirementName(requirement.getRequirementName())
                .detail(requirement.getDetail())
                .createdAt(requirement.getCreatedAt())
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
}
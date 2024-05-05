package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.request.RequirementCreateDTO;
import com.ssafy.d109.pubble.service.RequirementCreateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping(path = "/api/requirement")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RequirementCreateController {

    private final RequirementCreateService requirementCreateService;

    // 테스트 생성용 -- input 받은 content 만 log 에 출력함
    @PostMapping("")
    public void requirementCreate(@RequestBody RequirementCreateDTO req) {
        requirementCreateService.createRequirement(req);
    }
    
}

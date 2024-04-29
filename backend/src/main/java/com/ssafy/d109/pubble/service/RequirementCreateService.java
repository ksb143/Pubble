package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.request.RequirementCreateDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Slf4j
@Service
@RequiredArgsConstructor
public class RequirementCreateService {

    public void createRequirement(RequirementCreateDTO req){
        String content = req.getContent();
        log.info(content);
    }

}

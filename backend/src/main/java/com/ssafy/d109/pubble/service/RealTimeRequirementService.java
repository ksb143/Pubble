package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.realtimeRequirementDto.StompDto;
import com.ssafy.d109.pubble.repository.RequirementRepository;
import com.ssafy.d109.pubble.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RealTimeRequirementService {

    private final CommonUtil commonUtil;
    private final RequirementService requirementService;

    public StompDto realtimeRequirementService(StompDto stompDto) {
        switch (stompDto.getOperation()) {
            case "detail" -> {
                requirementService.addRequirementDetail(stompDto.getData());
            }
        }
    }


}

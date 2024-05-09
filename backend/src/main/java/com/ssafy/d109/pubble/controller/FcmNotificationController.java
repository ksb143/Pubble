package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.requestDto.FcmNotificationRequestDto;
import com.ssafy.d109.pubble.service.FcmNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@Log4j2
@RequestMapping("/notification")
public class FcmNotificationController {

    private final FcmNotificationService fcmNotificationService;

    public FcmNotificationController(FcmNotificationService fcmNotificationService) {
        this.fcmNotificationService = fcmNotificationService;
    }

    @Operation(summary = "알림 보내기")
    @PostMapping("/push")
    public String sendNotificationByToken(@RequestBody FcmNotificationRequestDto dto) throws IOException {
        return fcmNotificationService.sendNotificationByToken(dto);
    }


    @GetMapping("/fire")
    public String getFire() throws IOException {
        String fire = fcmNotificationService.getAccessToken();
        log.info("토큰을 받아올 수 있을까? ㅋㅋ {}", fire);
        return fire;
    }

}

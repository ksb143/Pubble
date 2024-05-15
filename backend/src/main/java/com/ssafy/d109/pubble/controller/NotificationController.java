package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.requestDto.FCMTokenRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.NotificationMessageResponseDto;
import com.ssafy.d109.pubble.entity.Notification;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.NotificationService;
import com.ssafy.d109.pubble.util.CommonUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    private final NotificationService notificationService;
    private final CommonUtil commonUtil;

    public NotificationController(NotificationService notificationService, CommonUtil commonUtil) {
        this.notificationService = notificationService;
        this.commonUtil = commonUtil;
    }

    @PostMapping("/token")
    public void registerToken(@RequestBody FCMTokenRequestDto tokenDto) {

        User currentUser = commonUtil.getUser();
        String token = tokenDto.getToken();
        notificationService.registerToken(token, currentUser);

    }


    @GetMapping("/{notificationId}/clear")
    public void clearNotificationFromUser(@PathVariable Integer notificationId) {
        notificationService.deleteNotification(notificationId);
    }

    @PostMapping("/check")
    public ResponseEntity<NotificationMessageResponseDto> check() {
        // 리스트를 줘야 하나? 모르겠당....
        return null;
    }



}

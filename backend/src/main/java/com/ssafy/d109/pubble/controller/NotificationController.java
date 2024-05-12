package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.entity.Notification;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.NotificationService;
import com.ssafy.d109.pubble.util.CommonUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public void registerToken(@RequestBody String token) {

        User currentUser = commonUtil.getUser();
        notificationService.registerToken(token, currentUser);

    }

}

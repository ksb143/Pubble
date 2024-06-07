package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.requestDto.FCMTokenRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.NotificationMessageResponseDto;
import com.ssafy.d109.pubble.entity.Notification;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.NotificationService;
import com.ssafy.d109.pubble.util.CommonUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

    @PostMapping("/fcm-token")
    public void registerToken(@RequestBody FCMTokenRequestDto tokenDto) {

        User currentUser = commonUtil.getUser();
        String token = tokenDto.getToken();
        notificationService.registerToken(token, currentUser);

    }


    @GetMapping("/{notificationId}/clear")
    public void clearNotificationFromUser(@PathVariable Integer notificationId) {
        notificationService.deleteNotification(notificationId);
    }

    @GetMapping("/{receiverId}/list")
    public ResponseEntity<Page<NotificationMessageResponseDto>> getNotificationList(@PathVariable Integer receiverId, @PageableDefault(size = 10) Pageable pageable) {
        if (!pageable.getSort().isSorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("createdAt").descending());
        }

        Page<NotificationMessageResponseDto> notifications = notificationService.getNotifications(receiverId, pageable);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationMessageId}/check")
    public void checkNotificationMessage(@PathVariable Integer notificationMessageId) {
        notificationService.updateChecked(notificationMessageId);
    }



}

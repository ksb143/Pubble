package com.ssafy.d109.pubble.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import com.ssafy.d109.pubble.dto.requestDto.NotificationRequestDto;
import com.ssafy.d109.pubble.entity.Notification;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.notification.NotificationNotFoundException;
import com.ssafy.d109.pubble.repository.NotificationRepository;
import com.ssafy.d109.pubble.util.CommonUtil;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import com.google.firebase.messaging.Message;

import java.util.concurrent.ExecutionException;

@Service
@Log4j2
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CommonUtil commonUtil;

    public NotificationService(NotificationRepository notificationRepository, CommonUtil commonUtil) {
        this.notificationRepository = notificationRepository;
        this.commonUtil = commonUtil;
    }

    // 사용자의 기기에서 생성된 FCM 토큰을 서버에 등록하고 저장 (currentUser가 수행)
    public String registerToken(String token, User currentUser) {

        Notification notification = notificationRepository.findNotificationByUser(currentUser).orElseThrow(NotificationNotFoundException::new);
        notification.confirmUser(currentUser);
        notificationRepository.save(notification);

        return "Token Saved Successfully";
    }









    /*
    @Transactional
    public void saveNotification(String token) {
        User user = commonUtil.getUser();

        Notification notification = Notification.builder()
                .token(token)
                .build();

        notification.confirmUser(user);
        notificationRepository.save(notification);

    }
    
    public String getNotificationToken() {
        User user = commonUtil.getUser();
        Notification notification = notificationRepository.findNotificationByUser(user).orElseThrow(NotificationNotFoundException::new);
        
        return notification.getToken();
    }

    public void sendNotification(NotificationRequestDto reqDto) throws ExecutionException, InterruptedException {
        Message message = Message.builder()
                .setWebpushConfig(WebpushConfig.builder()
                        .setNotification(WebpushNotification.builder()
                                .setTitle(reqDto.getTitle())
                                .setBody(reqDto.getMessage())
                                .build())
                        .build())
                .setToken(getNotificationToken())
                .build();

        String response = FirebaseMessaging.getInstance().sendAsync(message).get();
        log.info(">>>>>Send Message: " + response);

    }

    public void deleteNotification() {
        User user = commonUtil.getUser();
        Notification notification = notificationRepository.findNotificationByUser(user).orElseThrow(NotificationNotFoundException::new);

        notificationRepository.delete(notification);
    }

     */
}
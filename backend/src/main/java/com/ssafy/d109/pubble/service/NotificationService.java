package com.ssafy.d109.pubble.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import com.ssafy.d109.pubble.dto.requestDto.NotificationRequestDto;
import com.ssafy.d109.pubble.entity.Notification;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.User.UserNotFoundException;
import com.ssafy.d109.pubble.exception.notification.NotificationNotFoundException;
import com.ssafy.d109.pubble.repository.NotificationRepository;
import com.ssafy.d109.pubble.repository.UserRepository;
import com.ssafy.d109.pubble.util.CommonUtil;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import com.google.firebase.messaging.Message;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@Log4j2
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CommonUtil commonUtil;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, CommonUtil commonUtil, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.commonUtil = commonUtil;
        this.userRepository = userRepository;
    }


    // 사용자의 기기에서 생성된 FCM 토큰을 서버에 등록하고 저장 (currentUser가 수행)
    @Transactional
    public String registerToken(String token, User currentUser) {

        Notification notification = notificationRepository.findNotificationByUser(currentUser)
                .orElse(Notification.builder().token(token).build());
        notification.setToken(token);
        notification.setUser(currentUser);
        currentUser.setNotification(notification);

        userRepository.save(currentUser);
        notificationRepository.save(notification);

        return "TSS: Token Saved Successfully 라는 뜻ㅋ";
    }


    public void sendNotification(NotificationRequestDto reqDto, String receiverId) {

        try {
            String token = getNotificationToken(receiverId);
            Message message = Message.builder()
                    .setWebpushConfig(WebpushConfig.builder()
                            .setNotification(WebpushNotification.builder()
                                    .setTitle(reqDto.getTitle())
                                    .setBody(reqDto.getMessage())
                                    .build())
                            .build())
                    .setToken(token)
                    .build();


            /*
            String response = FirebaseMessaging.getInstance().sendAsync(message).get();
            log.info(">>>>>Send Message: " + response);
        } catch (ExecutionException | InterruptedException e) {
            log.error("Failed to send message due to interruption or execution error", e);
        } catch (NotificationNotFoundException e) {
            log.error("Notification token not found for user", e);
        }

             */


            // 비동기로 메시지 보내기
            CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
                try {
                    return FirebaseMessaging.getInstance().sendAsync(message).get();
                } catch (InterruptedException | ExecutionException e) {
                    throw new RuntimeException("Failed to send message", e);
                }
            });

            // 비동기 작업 완료 후 로그 기록
            future.thenAccept(response -> {
                log.info("Send Message: " + response);
            }).exceptionally(ex -> {
                log.error("Failed to send message due to error", ex);
                return null;
            });

        } catch (NotificationNotFoundException e) {
            log.error("Notification token not found for user", e);
            throw new NotificationNotFoundException();
        }
    }


    private String getNotificationToken(String receiverId) {
        User user = userRepository.findByEmployeeId(receiverId).orElseThrow(UserNotFoundException::new);
        return notificationRepository.findNotificationByUser(user)
                .map(Notification::getToken)
                .orElseThrow(NotificationNotFoundException::new);
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

     */

    @Transactional
    public void deleteNotification(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(NotificationNotFoundException::new);
        User user = notification.getUser();
        if (user != null) {
            user.setNotification(null);
            userRepository.saveAndFlush(user);  // User 엔티티 업데이트
        }
        notificationRepository.delete(notification);
        notificationRepository.flush();// Notification 엔티티 삭제
    }

}
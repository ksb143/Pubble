package com.ssafy.d109.pubble.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import com.ssafy.d109.pubble.dto.requestDto.NotificationRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.NotificationMessageResponseDto;
import com.ssafy.d109.pubble.dto.responseDto.SenderInfoDto;
import com.ssafy.d109.pubble.dto.responseDto.TypeDataDto;
import com.ssafy.d109.pubble.entity.*;
import com.ssafy.d109.pubble.exception.user.UserNotFoundException;
import com.ssafy.d109.pubble.exception.notification.NotificationMessageNotFoundException;
import com.ssafy.d109.pubble.exception.notification.NotificationNotFoundException;
import com.ssafy.d109.pubble.repository.NotificationMessageRepository;
import com.ssafy.d109.pubble.repository.NotificationRepository;
import com.ssafy.d109.pubble.repository.UserRepository;
import com.ssafy.d109.pubble.util.CommonUtil;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.google.firebase.messaging.Message;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@Log4j2
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CommonUtil commonUtil;
    private final UserRepository userRepository;
    private final NotificationMessageRepository notificationMessageRepository;

    public NotificationService(NotificationRepository notificationRepository, CommonUtil commonUtil, UserRepository userRepository, NotificationMessageRepository notificationMessageRepository) {
        this.notificationRepository = notificationRepository;
        this.commonUtil = commonUtil;
        this.userRepository = userRepository;
        this.notificationMessageRepository = notificationMessageRepository;
    }


    // 사용자의 기기에서 생성된 FCM 토큰을 서버에 등록하고 저장 (currentUser가 수행)
    @Transactional
    public String registerToken(String token, User currentUser) {

        /*
        Notification notification = notificationRepository.findNotificationByUser(currentUser)
                .orElse(Notification.builder().token(token).build());
        notification.setToken(token);
        notification.setUser(currentUser);
//        currentUser.setNotification(notification);

        userRepository.save(currentUser);
        notificationRepository.save(notification);

        return "TSS: Token Saved Successfully 라는 뜻ㅋ";

         */

        Notification notification = notificationRepository.findNotificationByUser(currentUser)
                .orElse(Notification.builder().token(token).build());
        notification.setToken(token);
        notification.setUser(currentUser);
        userRepository.save(currentUser);
        notificationRepository.save(notification);
        return "Token Saved Successfully";
    }


    public void sendNotification(NotificationRequestDto reqDto, String receiverId) {

        try {
            String token = getNotificationToken(receiverId);
            Message message = Message.builder()
                    .setWebpushConfig(WebpushConfig.builder()
                            .putData("type", reqDto.getType())
                            .setNotification(WebpushNotification.builder()
                                    .setTitle(reqDto.getTitle())
                                    .setBody(reqDto.getMessage())
                                    .build())
                            .build())
                    .setToken(token)
                    .build();


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


    @Transactional
    public void deleteNotification(Integer notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(NotificationNotFoundException::new);
        User user = notification.getUser();
        if (user != null) {
//            user.setNotification(null);
            userRepository.saveAndFlush(user);  // User 엔티티 업데이트
        }
        notificationRepository.delete(notification);
        notificationRepository.flush();// Notification 엔티티 삭제
    }


    @Transactional
    public void updateChecked(Integer notificationMsgId) {
        NotificationMessage notificationMsg = notificationMessageRepository.findByNotificationMessageId(notificationMsgId)
                .orElseThrow(NotificationMessageNotFoundException::new);
        notificationMsg.setIsChecked(true);

    }


    @Transactional
    public NotificationMessage saveNotificationMessage(
            String title,
            String content,
            NotificationType type,
            Integer receiverId,
            Integer senderId,
            Project project,
            Requirement requirement,
            UserThread userThread
            ) {
        NotificationMessage notificationMessage = NotificationMessage.builder()
                .title(title)
                .createdAt(LocalDateTime.now())
                .isChecked(false)
                .content(content)
                .type(type)
                .receiverId(receiverId)
                .senderId(senderId)
                .project(project)
                .requirement(requirement)
                .userThread(userThread)
                .build();

        return notificationMessageRepository.save(notificationMessage);
    }


    public Page<NotificationMessageResponseDto> getNotifications(Integer userId, Pageable pageable) {

//        return notificationMessageRepository.findAll(pageable).map(this::convertToDto);
        return notificationMessageRepository.findAllByReceiverId(userId, pageable).map(this::convertToDto);
    }


    private NotificationMessageResponseDto convertToDto(NotificationMessage notificationMsg) {
        User receiver = userRepository.findByUserId(notificationMsg.getReceiverId()).orElseThrow(UserNotFoundException::new);
        User sender = null;
        if (notificationMsg.getSenderId() != null) {
            sender = userRepository.findByUserId(notificationMsg.getSenderId()).orElseThrow(UserNotFoundException::new);
        }


        TypeDataDto typeData = new TypeDataDto();
        switch (notificationMsg.getType()) {
            case PROJECT:
                break;
            case NEW_REQUIREMENT:
                typeData.setProjectId(notificationMsg.getProject().getProjectId());
                typeData.setProjectCode(notificationMsg.getProject().getCode());
                typeData.setRequirementId(notificationMsg.getRequirement().getRequirementId());
                typeData.setRequirementCode(notificationMsg.getRequirement().getCode());
                break;
            case MENTION:
                typeData.setProjectId(notificationMsg.getProject().getProjectId());
                typeData.setProjectCode(notificationMsg.getProject().getCode());
                typeData.setRequirementId(notificationMsg.getRequirement().getRequirementId());
                typeData.setRequirementCode(notificationMsg.getRequirement().getCode());
                typeData.setThreadId(notificationMsg.getUserThread().getUserThreadId());
                break;
            case MESSAGE:
                break;

        }

        NotificationMessageResponseDto dto = NotificationMessageResponseDto.builder()
                .notificationId(notificationMsg.getNotificationMessageId())
                .isChecked(notificationMsg.getIsChecked())
                .title(notificationMsg.getTitle())
                .content(notificationMsg.getContent())
                .createdAt(notificationMsg.getCreatedAt())
                .type(notificationMsg.getType())
                .typeData(typeData)
                .senderInfo(SenderInfoDto.builder()
                        .name(sender.getName())
                        .employeeId(sender.getEmployeeId())
                        .position(sender.getPosition())
                        .department(sender.getDepartment())
                        .profileColor(sender.getProfileColor())
                        .build())
                .build();

        log.info(dto.getNotificationId());
        log.info(dto.getType());
        log.info(dto.getContent());


        return dto;
    }


}
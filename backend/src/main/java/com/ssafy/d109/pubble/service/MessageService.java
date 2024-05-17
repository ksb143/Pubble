package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.messageDto.MessageResponseDto;
import com.ssafy.d109.pubble.dto.messageDto.MessageSendDto;
import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import com.ssafy.d109.pubble.dto.requestDto.NotificationRequestDto;
import com.ssafy.d109.pubble.entity.Message;
import com.ssafy.d109.pubble.entity.NotificationType;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.repository.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class MessageService {

    private final MessageRepository messageRepository;
    private final NotificationService notificationService;

    public Page<MessageResponseDto> getMessagesPage(Integer receiverId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Message> messages = messageRepository.findByReceiverUserIdAndStatusNot(receiverId, "d", pageable);

        List<MessageResponseDto> messageResponseDtos = messages.getContent().stream().map(message -> {
            UserInfoDto receiverInfo = UserInfoDto.createUserInfo(message.getReceiver());
            UserInfoDto senderInfo = UserInfoDto.createUserInfo(message.getSender());

            return MessageResponseDto.builder()
                    .messageId(message.getMessageId())
                    .title(message.getTitle())
                    .content(message.getContent())
                    .status(message.getStatus())
                    .createdAt(message.getCreatedAt())
                    .senderInfo(senderInfo)
                    .receiverInfo(receiverInfo)
                    .build();
        }).collect(Collectors.toList());

        return new PageImpl<>(messageResponseDtos, pageable, messages.getTotalElements());
    }

    public void sendMessage(User sender, User receiver, MessageSendDto messageSendDto) {

        Message message = Message.builder()
                .title(messageSendDto.getTitle())
                .content(messageSendDto.getContent())
                .status("u")
                .sender(sender)
                .receiver(receiver)
                .build();

        messageRepository.save(message);
        NotificationRequestDto dto = NotificationRequestDto.builder()
                .title(messageSendDto.getTitle())
                .message(messageSendDto.getContent())
                .token(receiver.getNotification().getToken())
                .type("MESSAGE")
                .build();

        try {
            // 푸시 알림 비동기 전송
            notificationService.sendNotification(dto, receiver.getEmployeeId());
            notificationService.saveNotificationMessage(dto.getMessage(),
                                                        NotificationType.MESSAGE,
                                                        null,
                                                        message.getSender().getUserId(),
                                                        null, null, null);
        } catch (Exception e) {
            // 로깅, 알림 재시도 또는 사용자에게 피드백
            log.error("Error sending notification", e);
        }
    }

    @Transactional
    public void updateMessage(Integer messageId, String command) {
        Message message = messageRepository.findByMessageId(messageId);
        message.setStatus(command);

        messageRepository.save(message);
    }
}

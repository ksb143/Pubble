package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.messageDto.MessageResponseDto;
import com.ssafy.d109.pubble.dto.messageDto.MessageSendDto;
import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import com.ssafy.d109.pubble.entity.Message;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.repository.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

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
    }

    @Transactional
    public void updateMessage(Integer messageId, String command) {
        Message message = messageRepository.findByMessageId(messageId);
        message.setStatus(command);

        messageRepository.save(message);
    }
}

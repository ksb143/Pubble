package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.projectDto.CommentCreateDto;
import com.ssafy.d109.pubble.dto.requestDto.NotificationReceiverRequestDto;
import com.ssafy.d109.pubble.dto.requestDto.NotificationRequestDto;
import com.ssafy.d109.pubble.dto.response.CommentResponseData;
import com.ssafy.d109.pubble.dto.response.UserThreadDto;
import com.ssafy.d109.pubble.entity.*;
import com.ssafy.d109.pubble.exception.User.UserNotFoundException;
import com.ssafy.d109.pubble.exception.UserThread.UnauthorizedAccessException;
import com.ssafy.d109.pubble.exception.UserThread.UserThreadAlreadyLockedException;
import com.ssafy.d109.pubble.exception.UserThread.UserThreadNotFoundException;
import com.ssafy.d109.pubble.repository.CommentRepository;
import com.ssafy.d109.pubble.repository.RequirementDetailRepository;
import com.ssafy.d109.pubble.repository.UserRepository;
import com.ssafy.d109.pubble.repository.UserThreadRepository;
import com.ssafy.d109.pubble.util.CommonUtil;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Log4j2
public class UserThreadService {

    private final UserThreadRepository userThreadRepository;
    private final CommentRepository commentRepository;
    private final CommonUtil commonUtil;
    private final NotificationService notificationService;

    private final RequirementDetailRepository detailRepository;
    private final UserRepository userRepository;


    public UserThreadService(UserThreadRepository userThreadRepository, CommentRepository commentRepository, CommonUtil commonUtil, RequirementDetailRepository detailRepository, NotificationService notificationService, UserRepository userRepository) {
        this.userThreadRepository = userThreadRepository;
        this.commentRepository = commentRepository;
        this.commonUtil = commonUtil;
        this.detailRepository = detailRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }


    public List<UserThreadDto> getAllUserThreads(Integer detailId) {

        List<UserThread> userThreads = userThreadRepository.findAllByRequirementDetail_RequirementDetailId(detailId);
        return userThreads.stream()
                .map(this::convertUserThreadToDto)
                .collect(Collectors.toList());
    }


    public void lockThread(Integer userThreadId) {

        UserThread currentThread = userThreadRepository.findUserThreadByUserThreadId(userThreadId).orElseThrow(UserThreadNotFoundException::new);
        Integer threadUser = currentThread.getUser().getUserId();
        Integer currentUser = commonUtil.getUser().getUserId();

        log.info("threadUser: {}, currentUser: {}", threadUser, currentUser);

        // 해당 스레드에 대한 권한 체크
        if (!threadUser.equals(currentUser)) {
            throw new UnauthorizedAccessException();
        }

        // 이미 Lock된 스레드일 경우 예외 처리
        if (currentThread.getLockYN().equals("y")) {
            throw new UserThreadAlreadyLockedException();
        }

        currentThread.setLockYN("y");


    }


    private UserThreadDto convertUserThreadToDto(UserThread userThread) {
        UserThreadDto dto = new UserThreadDto();
        dto.setUserThreadId(userThread.getUserThreadId());
        dto.setIsLocked(userThread.getLockYN());
        List<CommentResponseData> commentDataList = commentRepository.findAllByUserThread_userThreadId(userThread.getUserThreadId()).stream()
                .map(this::convertCommentToDto)
                .collect(Collectors.toList());

        dto.setCommentList(commentDataList);

        return dto;
    }

    private CommentResponseData convertCommentToDto(Comment comment) {
        CommentResponseData dto = new CommentResponseData();
        dto.setCommentId(comment.getCommentId());
        dto.setContent(comment.getContent());
        dto.setUserId(comment.getUser().getUserId());
        
        // userInfo 참고
        return dto;
    }



    public UserThreadDto createUserThread(User user, Integer detailId) {
        UserThread userThread = UserThread.builder()
                .lockYN("n")
                .requirementDetail(detailRepository.findByRequirementDetailId(detailId))
                .user(user)
                .build();
        userThreadRepository.save(userThread);
        return convertUserThreadToDto(userThread);

    }

    public CommentResponseData createComment(User user, Integer userThreadId, CommentCreateDto commentCreateDto) {
        UserThread userThread = userThreadRepository.findUserThreadByUserThreadId(userThreadId).orElseThrow();
        System.out.println("commentCreateDto = " + commentCreateDto.getContent());

        Comment comment = Comment.builder()
                .content(commentCreateDto.getContent())
                .user(user)
                .userThread(userThread)
                .build();

        commentRepository.save(comment);

        sendNotificationForMention(commentCreateDto.getContent(), commentCreateDto.getReceiverInfo(), user, comment);
        return convertCommentToDto(comment);
    }


    private void sendNotificationForMention(String content, NotificationReceiverRequestDto receiverInfo, User sender, Comment comment) {

        if (!receiverInfo.getIsMentioned()) {
            return;
        }

        String employeeId = receiverInfo.getReceiverId();
        User receiver = userRepository.findByEmployeeId(employeeId).orElseThrow(UserNotFoundException::new);

        NotificationRequestDto notificationDto = NotificationRequestDto.builder()
                .title("멘션 알림")
                .message(content)
                .type("MENTION")
                .build();
        notificationService.sendNotification(notificationDto, receiverInfo.getReceiverId());
        notificationService.saveNotificationMessage(content,
                NotificationType.MENTION,
                receiver.getUserId(),
                sender.getUserId(),
                null,
                null,
                comment.getUserThread()
                );

    }
}

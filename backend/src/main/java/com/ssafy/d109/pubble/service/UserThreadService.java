package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.dto.response.CommentResponseData;
import com.ssafy.d109.pubble.dto.response.UserThreadDto;
import com.ssafy.d109.pubble.entity.Comment;
import com.ssafy.d109.pubble.entity.UserThread;
import com.ssafy.d109.pubble.repository.CommentRepository;
import com.ssafy.d109.pubble.repository.UserThreadRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserThreadService {

    private final UserThreadRepository userThreadRepository;
    private final CommentRepository commentRepository;

    public UserThreadService(UserThreadRepository userThreadRepository, CommentRepository commentRepository) {
        this.userThreadRepository = userThreadRepository;
        this.commentRepository = commentRepository;
    }

    public List<UserThreadDto> getAllUserThreads(Integer requirementId) {

        List<UserThread> userThreads = userThreadRepository.findAllByRequirement_requirementId(requirementId);
        return userThreads.stream()
                .map(this::convertUserThreadToDto)
                .collect(Collectors.toList());
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

        return dto;
    }

}

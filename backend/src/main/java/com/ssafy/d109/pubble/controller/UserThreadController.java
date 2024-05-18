package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.projectDto.CommentCreateDto;
import com.ssafy.d109.pubble.dto.response.CommentResponseData;
import com.ssafy.d109.pubble.dto.response.UserThreadDto;
import com.ssafy.d109.pubble.dto.response.UserThreadListData;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.dto.responseDto.UserThreadLockResponseDto;
import com.ssafy.d109.pubble.dto.responseDto.UserThreadResponseDto;
import com.ssafy.d109.pubble.dto.userLocationDto.RequirementThreadsDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.entity.UserThread;
import com.ssafy.d109.pubble.repository.UserRepository;
import com.ssafy.d109.pubble.repository.UserThreadRepository;
import com.ssafy.d109.pubble.service.UserThreadService;
import com.ssafy.d109.pubble.util.CommonUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requirements/details")
@Log4j2
public class UserThreadController {

    private final UserThreadService userThreadService;
    private final CommonUtil commonUtil;
    private final UserRepository userRepository;
    private final UserThreadRepository userThreadRepository;

    private ResponseDto response;

    public UserThreadController(UserThreadService userThreadService, CommonUtil commonUtil, UserRepository userRepository, UserThreadRepository userThreadRepository) {
        this.userThreadService = userThreadService;
        this.commonUtil = commonUtil;
        this.userRepository = userRepository;
        this.userThreadRepository = userThreadRepository;
    }

    @Operation(summary = "요구사항 항목에 해당하는 모든 스레드 조회")
    @GetMapping("/requirements-all-threads/{requirementId}")
    public ResponseEntity<ResponseDto> getRequirementsThreads(@PathVariable Integer requirementId) {
        List<RequirementThreadsDto> dtos = userThreadService.getRequirementsThreads(requirementId);

        response = new ResponseDto(true, "요구사항 항목에 해당하는 모든 스레드 조회", dtos);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "세부사항 항목에 해당하는 모든 스레드 조회")
    @GetMapping("/{detailId}/threads")
    public ResponseEntity<UserThreadResponseDto> getAllThreads(@PathVariable Integer detailId) {

        UserThreadResponseDto responseDto = new UserThreadResponseDto();
        List<UserThreadDto> userThreadList = userThreadService.getAllUserThreads(detailId);

        if (userThreadList == null ) {
            responseDto.setMessage("UserThread Failed");
            responseDto.setResData(null);
            responseDto.setData(false);

            return new ResponseEntity<>(responseDto, HttpStatus.BAD_REQUEST);
        }

        UserThreadListData listData = new UserThreadListData();
        listData.setTotalThreadList(userThreadList);

        responseDto.setMessage("UserThread Success");
        responseDto.setResData(listData);
        responseDto.setData(true);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);

    }

    @Operation(summary = "스레드 잠금")
    @PutMapping("/threads/{userThreadId}/lock")
    public ResponseEntity<UserThreadLockResponseDto> lockThread(@PathVariable Integer userThreadId) {

        userThreadService.lockThread(userThreadId);
        UserThreadLockResponseDto responseDto = new UserThreadLockResponseDto();
        responseDto.setMessage("Lock Success");
        responseDto.setData(true);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }


    // 스레드 생성
    @Operation(summary = "새 스레드 생성")
    @PostMapping("/{detailId}/threads")
    public ResponseEntity<ResponseDto> createUserThread(@PathVariable Integer detailId) {
        User user = commonUtil.getUser();
        UserThreadDto userThread = userThreadService.createUserThread(user, detailId);

        response = new ResponseDto(true, "새 스레드 생성", userThread);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 코멘트 작성
    @Operation(summary = "새 댓글 생성")
    @PostMapping("/threads/{threadId}/comments")
    public ResponseEntity<ResponseDto> createComment(@PathVariable Integer threadId, @RequestBody CommentCreateDto commentCreateDto) {
        User user = commonUtil.getUser();
        System.out.println("commentCreateDto = " + commentCreateDto.getContent());
        CommentResponseData commentResponseData = userThreadService.createComment(user, threadId, commentCreateDto);

        response = new ResponseDto(true, "새 댓글 생성", commentResponseData);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}

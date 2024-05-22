package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.projectDto.CommentCreateDto;
import com.ssafy.d109.pubble.dto.projectDto.UpdateDetailStatusDto;
import com.ssafy.d109.pubble.dto.response.CommentResponseData;
import com.ssafy.d109.pubble.dto.response.UserThreadDto;
import com.ssafy.d109.pubble.dto.response.UserThreadListData;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.dto.responseDto.UserThreadLockResponseDto;
import com.ssafy.d109.pubble.dto.responseDto.UserThreadResponseDto;
import com.ssafy.d109.pubble.dto.userLocationDto.RequirementThreadsDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.RequirementService;
import com.ssafy.d109.pubble.service.UserThreadService;
import com.ssafy.d109.pubble.util.CommonUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/requirement-board/{requirementId}")
@RequiredArgsConstructor
public class RequirementBoardController {

    private ResponseDto<?> response;
    private final CommonUtil commonUtil;
    private final UserThreadService userThreadService;
    private final RequirementService requirementService;

    @Operation(summary = "요구사항 항목에 해당하는 모든 스레드 조회", description = "요구사항 하위의 detail들, 의 하위의 모든 스레드들, 의 댓글들", operationId = "1")
    @GetMapping("")
    public ResponseEntity<ResponseDto<?>> getRequirementsThreads(@PathVariable Integer requirementId) {
        List<RequirementThreadsDto> dtos = userThreadService.getRequirementsThreads(requirementId);

        response = new ResponseDto<>(true, "요구사항 항목에 해당하는 모든 스레드 조회", dtos);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 세부사항 상태 변경
    @Operation(summary = "세부사항 상태 변경", operationId = "2")
    @PutMapping("/details/{detailId}/status")
    public ResponseEntity<ResponseDto<?>> updateDetailStatus(@PathVariable Integer requirementId, @PathVariable Integer detailId, @RequestBody UpdateDetailStatusDto dto) {
        Integer userId = commonUtil.getUser().getUserId();
        try {
            requirementService.updateDetailStatus(userId, requirementId, detailId, dto);

            response = new ResponseDto<>(true, "세부사항 상태 변경 완료", null);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = new ResponseDto<>(true, "세부사항 상태 변경 실패", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    // 스레드 생성
    @Operation(summary = "새 스레드 생성", operationId = "3")
    @PostMapping("/details/{detailId}/threads")
    public ResponseEntity<ResponseDto<?>> createUserThread(@PathVariable Integer detailId) {
        User user = commonUtil.getUser();
        UserThreadDto userThread = userThreadService.createUserThread(user, detailId);

        response = new ResponseDto<>(true, "새 스레드 생성", userThread);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "세부사항 항목에 해당하는 모든 스레드 조회", operationId = "4")
    @GetMapping("/details/{detailId}/threads")
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

    @Operation(summary = "스레드 잠금", operationId = "5")
    @PutMapping("/threads/{userThreadId}/lock")
    public ResponseEntity<UserThreadLockResponseDto> lockThread(@PathVariable Integer userThreadId) {

        userThreadService.lockThread(userThreadId);
        UserThreadLockResponseDto responseDto = new UserThreadLockResponseDto();
        responseDto.setMessage("Lock Success");
        responseDto.setData(true);

        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }

    @Operation(summary = "해당 스레드의 댓글 조회", operationId = "6")
    @GetMapping("/threads/{userThreadId}/comments")
    public ResponseEntity<ResponseDto<?>> getComments(@PathVariable Integer userThreadId) {
        UserThreadDto userThread = userThreadService.getUserThread(userThreadId);

        response = new ResponseDto<>(true, "해당 스레드의 댓글 조회", userThread);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "새 댓글 생성", operationId = "7")
    @PostMapping("/threads/{userThreadId}/comments")
    public ResponseEntity<ResponseDto<?>> createComment(@PathVariable Integer userThreadId, @RequestBody CommentCreateDto commentCreateDto) {
        User user = commonUtil.getUser();
        CommentResponseData commentResponseData = userThreadService.createComment(user, userThreadId, commentCreateDto);

        response = new ResponseDto<>(true, "새 댓글 생성", commentResponseData);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationRequestDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.service.UserLocationService;
import com.ssafy.d109.pubble.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class StompController {

    private ResponseDto response;
    private final CommonUtil commonUtil;
    private final UserLocationService userLocationService;
    private final SimpMessageSendingOperations sendingOperations;

    @MessageMapping("/project/{projectId}")
    public void enter(@DestinationVariable Integer projectId, UserLocationRequestDto requestDto) {
        User user = commonUtil.getUser();
        // 권한검사 해줄지
        switch (requestDto.getOperation()) {
            case "e" -> {
                UserLocationDto enterUserDto = userLocationService.enter(user, projectId, requestDto);
                sendingOperations.convertAndSend("/sub/project/" + projectId, enterUserDto);
            }
            case "m" -> {
                UserLocationDto moveUserDto = userLocationService.move(user, projectId, requestDto);
                sendingOperations.convertAndSend("/sub/project/" + projectId, moveUserDto);
            }
            case "l" -> {
                UserLocationDto leaveUserDto = userLocationService.leave(user, projectId);
                sendingOperations.convertAndSend("/sub/project/" + projectId, leaveUserDto);
            }
        }
    }

    @GetMapping("/project/{projectId}/current-user")
    public ResponseEntity<ResponseDto> getCurrentUserLocations(@PathVariable Integer projectId) {
        List<UserLocationDto> currentUserLocations = userLocationService.getCurrentUserLocations(projectId);

        response = new ResponseDto(true, "현재 프로젝트에 접속중인 유저들의 정보", currentUserLocations);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}

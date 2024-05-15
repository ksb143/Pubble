package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationInfo;
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

    @MessageMapping("/project/{projectId}/enter")
    public void enter(@DestinationVariable Integer projectId, UserLocationRequestDto dto) {
        User user = commonUtil.getUser();
        UserLocationInfo enterUserInfo = userLocationService.enter(user, projectId, dto);
        sendingOperations.convertAndSend("/sub/project/" + projectId + "/enter", enterUserInfo);
    }

    @MessageMapping("/project/{projectId}/move")
    public void move(@DestinationVariable Integer projectId, UserLocationRequestDto dto) {
        User user = commonUtil.getUser();
        UserLocationInfo moveUserInfo = userLocationService.move(user, projectId, dto);
        sendingOperations.convertAndSend("/sub/project/" + projectId + "/move", moveUserInfo);
    }

    @MessageMapping("/project/{projectId}/leave")
    public void leave(@DestinationVariable Integer projectId) {
        User user = commonUtil.getUser();
        String leavedUserEID = userLocationService.leave(user, projectId);
        sendingOperations.convertAndSend("/sub/project/" + projectId + "/leave", leavedUserEID);
    }

    @GetMapping("/project/{projectId}/current-user")
    public ResponseEntity<ResponseDto> getCurrentUserLocations(@PathVariable Integer projectId) {
        List<UserLocationInfo> currentUserLocations = userLocationService.getCurrentUserLocations(projectId);

        response = new ResponseDto(true, "현재 프로젝트에 접속중인 유저들의 정보", currentUserLocations);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}


/*
세션(방) 생성 또는 가입
userinfo 사용
 */

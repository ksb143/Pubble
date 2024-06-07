package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.realtimeRequirementDto.StompDto;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.dto.userLocationDto.AllUserLocationResponseDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationDto;
import com.ssafy.d109.pubble.dto.userLocationDto.UserLocationRequestDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.user.UserNotFoundException;
import com.ssafy.d109.pubble.repository.UserRepository;
import com.ssafy.d109.pubble.service.RealTimeRequirementService;
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

@RestController
@RequiredArgsConstructor
public class StompController {

    private ResponseDto response;
    private final CommonUtil commonUtil;
    private final UserLocationService userLocationService;
    private final SimpMessageSendingOperations sendingOperations;
    private final RealTimeRequirementService requirementService;

    private final UserRepository userRepository; // 기능 추가 구현 시도를 위해 의존성 잠깐 포기...

    @MessageMapping("/test")
    public void test(StompDto dto) {
        sendingOperations.convertAndSend("/sub/test", dto);
    }

//    @MessageMapping("/project/{projectId}")
//    public void enter(@DestinationVariable Integer projectId, UserLocationRequestDto requestDto) {
////        User user = commonUtil.getUser();
//        User user = userRepository.findByEmployeeId(requestDto.getEmployeeId()).orElseThrow(UserNotFoundException::new);
//        // 권한검사 해줄지
//        switch (requestDto.getOperation()) {
//            case "e" -> {
//                UserLocationDto enterUserDto = userLocationService.enter(user, projectId, requestDto);
//                sendingOperations.convertAndSend("/sub/project/" + projectId, enterUserDto);
//            }
//            case "m" -> {
//                UserLocationDto moveUserDto = userLocationService.move(user, projectId, requestDto);
//                sendingOperations.convertAndSend("/sub/project/" + projectId, moveUserDto);
//            }
//            case "l" -> {
//                UserLocationDto leaveUserDto = userLocationService.leave(user, projectId);
//                sendingOperations.convertAndSend("/sub/project/" + projectId, leaveUserDto);
//            }
//        }
//    }
    @MessageMapping("/project/{projectId}")
    public void enter(@DestinationVariable Integer projectId, UserLocationDto requestDto) {
//        User user = commonUtil.getUser();

        // request 실수 이슈...
        UserLocationRequestDto build = UserLocationRequestDto.builder()
                .operation(requestDto.getOperation())
                .locationName(requestDto.getLocationName())
                .locationUrl(requestDto.getLocationUrl())
                .build();

        User user = userRepository.findByEmployeeId(requestDto.getEmployeeId()).orElseThrow(UserNotFoundException::new);

        // 권한검사 해줄지
        switch (requestDto.getOperation()) {
            case "e" -> {
                UserLocationDto enterUserDto = userLocationService.enter(user, projectId, build);
                sendingOperations.convertAndSend("/sub/project/" + projectId, enterUserDto);
            }
            case "m" -> {
                UserLocationDto moveUserDto = userLocationService.move(user, projectId, build);
                sendingOperations.convertAndSend("/sub/project/" + projectId, moveUserDto);
            }
            case "l" -> {
                UserLocationDto leaveUserDto = userLocationService.leave(user, projectId);
                sendingOperations.convertAndSend("/sub/project/" + projectId, leaveUserDto);
            }
        }
    }

    @MessageMapping("/requirement/{requirementId}")
    public void requirement(@DestinationVariable Integer requirementId, StompDto<?> dto) {
        StompDto<?> responseDto = requirementService.realtimeRequirementService(dto);
        sendingOperations.convertAndSend("/sub/requirement/" + requirementId, responseDto);
    }

    @GetMapping("/project/{projectId}/current-user")
    public ResponseEntity<ResponseDto> getAllUserLocations(@PathVariable Integer projectId) {
        AllUserLocationResponseDto allUserLocations = userLocationService.getAllUserLocations(projectId);

        response = new ResponseDto(true, "비접속/접속중인 모든 프로젝트 인원 위치 정보", allUserLocations);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}

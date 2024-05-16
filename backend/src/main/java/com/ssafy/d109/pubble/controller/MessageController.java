package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.messageDto.MessageResponseDto;
import com.ssafy.d109.pubble.dto.messageDto.MessageSendDto;
import com.ssafy.d109.pubble.dto.messageDto.MessageStatusDto;
import com.ssafy.d109.pubble.dto.responseDto.ResponseDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.repository.UserRepository;
import com.ssafy.d109.pubble.service.MessageService;
import com.ssafy.d109.pubble.util.CommonUtil;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private ResponseDto response;
    private final CommonUtil commonUtil;
    private final MessageService messageService;
    private final UserRepository userRepository;

    // 수신한 메세지 페이지 확인
    @Operation(summary = "수신한 메세지 확인")
    @GetMapping("/received")
    public ResponseEntity<ResponseDto> getReceivedMessageList(
            @RequestParam int page,
            @RequestParam int size) {
        Integer receiverId = commonUtil.getUser().getUserId();

        Page<MessageResponseDto> messagesPage = messageService.getMessagesPage(receiverId, page, size);

        response = new ResponseDto(true, "수신 메세지 페이지 반환", messagesPage);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

//    // 발신한 메세지 리스트 확인
//    @GetMapping("/sent")

    // 하나의 메세지 조작 | u : 열람 안됨, r : 열람됨, d : 삭제됨
    @Operation(summary = "메세지 조작 | u : 열람 안됨, r : 열람됨, d : 삭제됨")
    @PutMapping("/{messageId}")
    public ResponseEntity<ResponseDto> updateMessage(@PathVariable("messageId")Integer messageId, @RequestBody MessageStatusDto dto) {
        String status = dto.getStatus();

        String msg;
        if ("r".equals(status)) {
            msg = "메세지 읽음 처리";
            messageService.updateMessage(messageId, status);
        } else if ("d".equals(status)) {
            msg = "메세지 삭제 처리";
            messageService.updateMessage(messageId, status);
        } else if ("u".equals(status)) {
            msg = "메세지 읽지 않음 처리";
            messageService.updateMessage(messageId, status);
        } else {
            System.out.println("command = " + status);
            msg = "알 수 없는 상태정보 입력 : " + status;
        }

        response = new ResponseDto(true, msg, null);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // 해당 사번 유저에게 메세지 보내기
    @Operation(summary = "해당 사번 유저에게 메세지 보내기")
    @PostMapping("/{employeeId}")
    public ResponseEntity<ResponseDto> sendMessage(@PathVariable("employeeId") String employeeId, @RequestBody MessageSendDto messageSendDto) {
        Optional<User> optionalReceiver = userRepository.findByEmployeeId(employeeId);

        if (optionalReceiver.isPresent()) {
            User receiver = optionalReceiver.get();
            User sender = commonUtil.getUser();

            messageService.sendMessage(sender, receiver, messageSendDto);
            response = new ResponseDto(true, "해당 사용자에게 쪽지를 보냈습니다.", null);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } else {

            response = new ResponseDto(false, "해당 수신자 정보가 없습니다", null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}

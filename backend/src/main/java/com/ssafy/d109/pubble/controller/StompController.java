package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.util.CommonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StompController {

    private final CommonUtil commonUtil;
    private final SimpMessageSendingOperations sendingOperations;
    @sendto
    @MessageMapping("/tranvel/rooms") // 클라이언트가 이 url로 메세지를 보내면 다음을 실행함
    public void room(StompDto message) {
        if (StompDto.MessageType.ENTER.equals(message.getType())) {
            message.setMessage(userRepository.findById(Long.parseLong(message.getSender_id())).get().getNickName() + "님이 입장하였습니다.");
        } else if (StompDto.MessageType.CLOSE.equals(message.getType())) {
            // 방 이름 수정(message)하면서 방 종료(roomId)
            roomHistoryService.finishRoomHistory(Long.parseLong(message.getRoomId()), message.getMessage());
            message.setMessage("여행이 종료되었습니다.");
        }
        sendingOperations.convertAndSend("/topic/tranvel/rooms/" + message.getRoomId(), message);
    }

    @MessageMapping("/project")
    public void enter() {
        User user = commonUtil.getUser();
        locationservice.enter(user);
        sendingOperations.convertAndSend("/" + roomid, message); // 갱신된 유저 입장정보
    }
}


/*
세션(방) 생성 또는 가입
userinfo 사용

 */

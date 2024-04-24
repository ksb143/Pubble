package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
//    List<Message> findAllBySender_senderId(Integer senderId);
//    List<Message> findAllByReceiver_receiverId(Integer receiverId);

    List<Message> findAllByUser_userId(Integer userId);
}

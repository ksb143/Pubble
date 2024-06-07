package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    Message findByMessageId(Integer messageId);

    Page<Message> findByReceiverUserIdAndStatusNot(Integer userId, String status, Pageable pageable);

}

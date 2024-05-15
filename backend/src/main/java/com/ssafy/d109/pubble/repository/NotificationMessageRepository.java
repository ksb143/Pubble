package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.NotificationMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationMessageRepository extends JpaRepository<NotificationMessage, Integer> {

    Optional<NotificationMessage> findByNotificationMessageId(Integer notificationMsgId);
}

package com.ssafy.d109.pubble.repository;

import com.ssafy.d109.pubble.entity.Notification;
import com.ssafy.d109.pubble.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    Optional<Notification> findNotificationByUser(User user);
}

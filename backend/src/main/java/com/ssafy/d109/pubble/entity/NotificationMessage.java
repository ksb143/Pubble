package com.ssafy.d109.pubble.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CollectionId;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Table(name = "notificationMessage")
public class NotificationMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notificationMessageId")
    private Integer notificationMessageId;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "isChecked")
    private Boolean isChecked;

    @Column(name = "content")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private NotificationType type;

    @Column(name = "receiverId")
    private Integer receiverId;

    @Column(name = "senderId")
    private Integer senderId;

}

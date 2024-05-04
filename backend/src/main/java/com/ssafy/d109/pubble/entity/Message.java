package com.ssafy.d109.pubble.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "messageId")
    private Integer messageId;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "content")
    private String content;

    // 연관 관계
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "receiverId", referencedColumnName = "userId")
//    private User receiver;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "senderId", referencedColumnName = "userId")
//    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;
}

package com.ssafy.d109.pubble.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notice")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "noticeId")
    private Integer noticeId;

    @Column(name = "title")
    private String title; // 제목

    @Column(name = "content")
    private String content; // 내용

    @Column(name = "category")
    private String category; // 공지의 분류

    @Column(name = "createdAt", updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updatedAt")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "deleteYN", length = 1)
    private String deleteYN; // n : 삭제되지 않음, 기본값 / y : 삭제됨

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorId")
    private User author;
}

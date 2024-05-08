package com.ssafy.d109.pubble.dto.NoticeDto;

import com.ssafy.d109.pubble.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class NoticeResponseDto {

    private Integer noticeId;

    private String title; // 제목

    private String content; // 내용

    private String category; // 공지의 분류

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String authorName;
}

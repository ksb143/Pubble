package com.ssafy.d109.pubble.dto.noticeDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

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

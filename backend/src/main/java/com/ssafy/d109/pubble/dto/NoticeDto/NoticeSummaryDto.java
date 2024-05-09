package com.ssafy.d109.pubble.dto.NoticeDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class NoticeSummaryDto {

    private Integer noticeId;

    private String title; // 제목

    private String category; // 공지의 분류

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String authorName;
}

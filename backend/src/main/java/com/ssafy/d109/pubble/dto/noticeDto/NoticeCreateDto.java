package com.ssafy.d109.pubble.dto.noticeDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class NoticeCreateDto {

    private String title; // 제목

    private String content; // 내용

    private String category; // 공지의 분류
}

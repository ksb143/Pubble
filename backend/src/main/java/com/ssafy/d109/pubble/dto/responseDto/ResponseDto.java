package com.ssafy.d109.pubble.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ResponseDto<T> {

    private boolean result; // 성공 여부
    private String msg; // 결과 메시지
    private T data; // 결과 데이터
}
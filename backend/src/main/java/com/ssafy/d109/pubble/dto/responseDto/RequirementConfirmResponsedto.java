package com.ssafy.d109.pubble.dto.responseDto;

import com.ssafy.d109.pubble.dto.request.ConfirmDataDto;
import com.ssafy.d109.pubble.dto.response.ConfirmResponseDataDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequirementConfirmResponsedto {

    private String message;
    private ConfirmDataDto responseDto;
    private String signature;
}
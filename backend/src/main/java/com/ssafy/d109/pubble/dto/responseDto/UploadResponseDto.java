package com.ssafy.d109.pubble.dto.responseDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadResponseDto {

    private String message;
    private String s3Url;
    private Boolean data;
}

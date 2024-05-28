package com.ssafy.d109.pubble.dto.response;

import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponseData {

    private Integer commentId;
    private Integer userId;
    private String content;

    private UserInfoDto commentAuthorInfo; // (댓글의)작성자 유저 정보

    public String toString() {
        return "CommentResponseData [commentId=" + commentId + ", userId=" + userId + ", content=" + content + "]";
    }
}

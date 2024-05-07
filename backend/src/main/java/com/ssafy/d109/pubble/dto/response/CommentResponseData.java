package com.ssafy.d109.pubble.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponseData {

    private Integer commentId;
    private Integer userId;
    private String content;

    public String toString() {
        return "CommentResponseData [commentId=" + commentId + ", userId=" + userId + ", content=" + content + "]";
    }
}

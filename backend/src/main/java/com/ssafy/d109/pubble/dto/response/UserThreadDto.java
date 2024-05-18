package com.ssafy.d109.pubble.dto.response;

import com.ssafy.d109.pubble.dto.projectDto.UserInfoDto;
import com.ssafy.d109.pubble.entity.Comment;
import com.ssafy.d109.pubble.entity.UserThread;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserThreadDto {

    private UserInfoDto threadAuthorInfo; // 쓰레드 작성자의 유저 정보

    private Integer userThreadId;
    private List<CommentResponseData> commentList;
    private String isLocked;

}

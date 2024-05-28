package com.ssafy.d109.pubble.exception.user;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException() {
        super("해당 유저는 존재하지 않습니다.");
    }
}

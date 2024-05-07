package com.ssafy.d109.pubble.exception.UserThread;

public class UserThreadNotFoundException extends RuntimeException {

    public UserThreadNotFoundException() {
        super("존재하지 않는 스레드");
    }
}

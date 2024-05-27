package com.ssafy.d109.pubble.exception.userThread;

public class UserThreadAlreadyLockedException extends RuntimeException{

    public UserThreadAlreadyLockedException(){
        super("이미 잠금 처리된 스레드");
    }
}

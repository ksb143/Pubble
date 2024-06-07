package com.ssafy.d109.pubble.exception.userThread;

public class UnauthorizedAccessException extends RuntimeException{

    public UnauthorizedAccessException(){
        super("해당 스레드에 대한 권한이 없음");
    }
}

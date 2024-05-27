package com.ssafy.d109.pubble.exception.notice;

public class NoticeNotFoundException extends RuntimeException{
    public NoticeNotFoundException() {
        super("찾을 수 없는 공지사항");
    }
}

package com.ssafy.d109.pubble.exception.project;

public class ProjectAccessDeniedException extends RuntimeException {
    public ProjectAccessDeniedException() {
        super("해당 자원에 접근 권한이 없습니다");
    }
}

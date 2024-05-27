package com.ssafy.d109.pubble.exception.project;

public class ProjectNotFoundException extends RuntimeException{
    public ProjectNotFoundException(){
        super("찾을 수 없는 프로젝트");
    }
}

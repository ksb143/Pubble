package com.ssafy.d109.pubble.exception.requirement;

public class RequirementNotFoundException extends RuntimeException{

    public RequirementNotFoundException(){
        super("찾을 수 없는 요구사항");
    }
}
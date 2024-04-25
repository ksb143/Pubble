package com.ssafy.d109.pubble.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "테통. 테스트 통과라는 뜻";
    }
}

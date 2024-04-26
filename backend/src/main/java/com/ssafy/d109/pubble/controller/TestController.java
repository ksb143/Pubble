package com.ssafy.d109.pubble.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Iterator;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {

        // 세션 현재 사용자ID
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        return "테통. 테스트 통과라는 뜻 :: " + name;
    }

    @GetMapping("/test/test")
    public String test2() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();
        String role = auth.getAuthority();

        return "테스트다 이놈아 :: " + role;
    }
}

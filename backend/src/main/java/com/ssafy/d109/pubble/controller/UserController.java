package com.ssafy.d109.pubble.controller;


import com.ssafy.d109.pubble.dto.requestDto.UserSignInRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.UserSignInResponseDto;
import com.ssafy.d109.pubble.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signin")
    public void login(@RequestBody UserSignInRequestDto dto) {


    }

    @GetMapping("/")
    public String signOut() {
        System.out.println("로그아웃된 상태");

        return "당신은 로그아웃된 상태입니다.";
    }


}

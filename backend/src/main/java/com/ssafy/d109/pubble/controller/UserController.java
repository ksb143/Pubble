package com.ssafy.d109.pubble.controller;


import com.ssafy.d109.pubble.dto.requestDto.UserSignInRequestDto;
import com.ssafy.d109.pubble.dto.responseDto.UserSignInResponseDto;
import com.ssafy.d109.pubble.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signin")
    public ResponseEntity<UserSignInResponseDto> login(HttpServletRequest request, @RequestBody UserSignInRequestDto dto) {

//        String employeeId = dto.getEmployeeId();
//        String password = dto.getPassword();

//        String accessToken = (String) request.getAttribute("accessToken");



        return  null;
    }


}

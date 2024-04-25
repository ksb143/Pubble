package com.ssafy.d109.pubble.controller;


import com.ssafy.d109.pubble.dto.request.UserSignInRequestDto;
import com.ssafy.d109.pubble.dto.response.UserSignInResponseDto;
import com.ssafy.d109.pubble.security.filter.LoginFilter;
import com.ssafy.d109.pubble.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<UserSignInResponseDto> login(@RequestBody UserSignInRequestDto dto) {

        String employeeId = dto.getEmployeeId();
        String password = dto.getPassword();



        return  null;
    }


}

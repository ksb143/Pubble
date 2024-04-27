package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.repository.UserRepository;
import io.jsonwebtoken.security.Password;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;

@RestController
@Log4j2
public class TestController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TestController(UserRepository userRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/test")
    public String test() {

        // 세션 현재 사용자ID
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("테스트 통과입니당나라송나라");
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

    @GetMapping("/hash")
    public void updatePassword() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            String rawPassword = user.getPassword();
            String hashedPassword = passwordEncoder.encode(rawPassword);
            user.setPassword(hashedPassword);
        }

        userRepository.saveAll(users);
    }


}

package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


}

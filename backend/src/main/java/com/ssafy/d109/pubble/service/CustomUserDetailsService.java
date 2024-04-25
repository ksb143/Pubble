package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.repository.UserRepository;
import com.ssafy.d109.pubble.security.customDto.CustomUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String employeeId) throws UsernameNotFoundException {

        Optional<User> optionalUser = userRepository.findByEmployeeId(employeeId);
        User userData = optionalUser.orElseThrow(() -> new UsernameNotFoundException("해당 유저는 존재하지 않습니다. 사번: " + employeeId));

        // AutneticationManager가 검증해줄 거얌
        return new CustomUserDetails(userData);

    }
}

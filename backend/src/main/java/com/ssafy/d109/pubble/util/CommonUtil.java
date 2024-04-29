package com.ssafy.d109.pubble.util;

import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.User.UserNotFoundException;
import com.ssafy.d109.pubble.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommonUtil {

    private final UserRepository userRepository;

    public User getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String employeeId = authentication.getName();

        // 비활성화된 유저인지 검증 로직 작성 예정


        return userRepository.findByEmployeeId(employeeId)
                .orElseThrow(UserNotFoundException::new);
    }
}

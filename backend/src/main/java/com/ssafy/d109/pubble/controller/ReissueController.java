package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.repository.RefreshTokenRepository;
import com.ssafy.d109.pubble.security.jwt.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@Log4j2
public class ReissueController {

    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    public ReissueController(JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refreshToken = cookie.getValue();
            }
        }

        if (refreshToken == null) {
            return new ResponseEntity<>("RefreshToken is Null", HttpStatus.BAD_REQUEST);
        }

        try {
            jwtUtil.isExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("RefreshToken is Expired", HttpStatus.BAD_REQUEST);
        }

        String category = jwtUtil.getCategory(refreshToken);
        if (!category.equals("refresh")) {
            return new ResponseEntity<>("RefreshToken is not valid", HttpStatus.BAD_REQUEST);
        }

        // DB에 리프레시 토큰 저장
        Boolean isExist = refreshTokenRepository.existsByRefreshToken(refreshToken);
        if (!isExist) {
            return new ResponseEntity<>("RefreshToken does not exist", HttpStatus.BAD_REQUEST);
        }

        String employeeId = jwtUtil.getEmployeeId(refreshToken);
        String role = jwtUtil.getRole(refreshToken);

        String newAccessToken = jwtUtil.createJwt("access", employeeId, role, 600000L);
        response.setHeader("Authorization", "Bearer " + newAccessToken);

        log.info("======New Access Token: {} ======" ,newAccessToken);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}

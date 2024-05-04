package com.ssafy.d109.pubble.service;

import com.ssafy.d109.pubble.controller.ReissueController;
import com.ssafy.d109.pubble.dto.response.ReissueResponseDataDto;
import com.ssafy.d109.pubble.repository.RefreshTokenRepository;
import com.ssafy.d109.pubble.security.jwt.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class ReissueService {

    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    public ReissueService(JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public ReissueResponseDataDto reissueAccessToken(HttpServletRequest request, HttpServletResponse response) {

        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refreshToken = cookie.getValue();
            }
        }

        if (!validateRefreshToken(refreshToken)) {
            return null;
        }

        Boolean isExist = refreshTokenRepository.existsByRefreshToken(refreshToken);
        if (!isExist) {
            return null;
        }

        String employeeId = jwtUtil.getEmployeeId(refreshToken);
        String role = jwtUtil.getRole(refreshToken);
        String newAccessToken = jwtUtil.createJwt("Authorization", employeeId, role, 600000L);

        response.setHeader("Auhtorization", "Bearer " + newAccessToken);
        log.info("===============New Access Token: {} ===============" ,newAccessToken);

        ReissueResponseDataDto dto = ReissueResponseDataDto
                .builder()
                .newAccessToken(newAccessToken)
                .data(true)
                .build();

        return dto;
    }

    private Boolean validateRefreshToken(String refreshToken) {

        if (refreshToken == null) {
            return false;
        }

        try {
            jwtUtil.isExpired(refreshToken);
        } catch (ExpiredJwtException e) {
            return false;
        }

        String category = jwtUtil.getCategory(refreshToken);
        if (!category.equals("refresh")) {
            return false;
        }

        return true;

    }

}

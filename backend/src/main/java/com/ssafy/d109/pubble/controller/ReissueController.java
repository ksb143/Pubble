package com.ssafy.d109.pubble.controller;

import com.ssafy.d109.pubble.dto.response.ReissueResponseDataDto;
import com.ssafy.d109.pubble.dto.responseDto.UserReissueResponseDto;
import com.ssafy.d109.pubble.repository.RefreshTokenRepository;
import com.ssafy.d109.pubble.security.jwt.JWTUtil;
import com.ssafy.d109.pubble.service.ReissueService;
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
    private final ReissueService reissueService;

    public ReissueController(JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository, ReissueService reissueService) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        this.reissueService = reissueService;
    }

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {

        ReissueResponseDataDto dto = reissueService.reissueAccessToken(request, response);
        if (dto == null) {
            return new ResponseEntity<>("Invalid refreshToken!", HttpStatus.BAD_REQUEST);
        }

        UserReissueResponseDto responseDto = UserReissueResponseDto
                .builder()
                .message("Reissue Success")
                .resData(dto)
                .build();

        return new ResponseEntity<UserReissueResponseDto>(responseDto, HttpStatus.OK);
    }

}

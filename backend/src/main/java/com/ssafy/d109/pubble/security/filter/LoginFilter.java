package com.ssafy.d109.pubble.security.filter;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.d109.pubble.dto.requestDto.UserSignInRequestDto;
import com.ssafy.d109.pubble.dto.response.SignInResponseDataDto;
import com.ssafy.d109.pubble.dto.responseDto.UserSignInFailResponseDto;
import com.ssafy.d109.pubble.dto.responseDto.UserSignInResponseDto;
import com.ssafy.d109.pubble.entity.RefreshToken;
import com.ssafy.d109.pubble.repository.RefreshTokenRepository;
import com.ssafy.d109.pubble.repository.UserRepository;
import com.ssafy.d109.pubble.security.jwt.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

@Log4j2
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final ObjectMapper om = new ObjectMapper();
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public LoginFilter(AuthenticationManager authenticationManager,JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    @SneakyThrows
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        log.info("===============.....로그인 시도 중.....===============");
        try {

            UserSignInRequestDto dto = om.readValue(request.getInputStream(), UserSignInRequestDto.class);
            log.info("===============사번: {}===============", dto.getEmployeeId());

            if (userRepository.existsByEmployeeId(dto.getEmployeeId())) {

                // 비활성화 유저인지 체크할 부분

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(dto.getEmployeeId(), dto.getPassword(), null);
                return authenticationManager.authenticate(authToken);
            } else {
                UserSignInFailResponseDto failDto = new UserSignInFailResponseDto();
                failDto.setErrorMessage("NOT FOUND USER");
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                new ObjectMapper().writeValue(response.getOutputStream(), failDto);
                return null;
            }

        } catch (IOException e) {
            log.info("===============.....로그인 실패염.....===============");

            log.error("Error occurred while reading request input stream", e);
            throw new AuthenticationServiceException("Error occurred while reading request input stream", e);

        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {

        String employeeId = authentication.getName();
        log.info("===============employeeId==============={}", employeeId);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        String role = "";

        if(iterator.hasNext()) {
            GrantedAuthority auth = iterator.next();
            role = auth.getAuthority();
        }

        String accessToken = jwtUtil.createJwt("Authorization", employeeId, role, 600000L);
        String refreshToken = jwtUtil.createJwt("refresh", employeeId, role, 86400000L);
        String profileColor = jwtUtil.getProfileColor(accessToken);
        String name = jwtUtil.getName(accessToken);


        log.info("프로필 색상: {}", jwtUtil.getProfileColor(accessToken));

        SignInResponseDataDto dto = SignInResponseDataDto.builder()
                        .accessToken(accessToken)
                                .data(true)
                .profileColor(profileColor)
                .employeeId(employeeId)
                .name(name)
                                        .build();

        UserSignInResponseDto responseDto = UserSignInResponseDto.builder()
                        .messges("SignIn Success")
                                .resData(dto)
                                        .build();

        response.addHeader("Authorization", "Bearer " + accessToken);
        response.addCookie(createCookie("refresh", refreshToken));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.CREATED.value());

        new ObjectMapper().writeValue(response.getOutputStream(), responseDto);

        log.info("===============로그인 완료염===============");

        // refresh 토큰 DB 저장
        addRefreshToken(employeeId, refreshToken, 86400000L);

    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {

        UserSignInFailResponseDto failDto = new UserSignInFailResponseDto();


        if (failed instanceof BadCredentialsException) {
            failDto.setErrorMessage("Login Info is Wrong");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else if (failed instanceof UsernameNotFoundException) {
            failDto.setErrorMessage("NOT FOUND USER");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        } else {
            failDto.setErrorMessage("Authentication Failed");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), failDto);


    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        cookie.setHttpOnly(true);

        return cookie;
    }

    private void addRefreshToken(String employeeId, String refreshToken, Long expiredMs) {

        Date date = new Date(System.currentTimeMillis() + expiredMs);

        RefreshToken refresh = RefreshToken.builder()
                .employeeId(employeeId)
                .refreshToken(refreshToken)
                .expiration(date.toString())
                .build();

        refreshTokenRepository.save(refresh);
    }
}

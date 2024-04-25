package com.ssafy.d109.pubble.security.filter;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.d109.pubble.dto.request.UserSignInRequestDto;
import com.ssafy.d109.pubble.security.customDto.CustomUserDetails;
import com.ssafy.d109.pubble.security.jwt.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Log4j2
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final ObjectMapper om = new ObjectMapper();
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    public LoginFilter(AuthenticationManager authenticationManager,JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        log.info("-----------------.....로그인 시도 중.....-----------------");
        try {

            UserSignInRequestDto dto = om.readValue(request.getInputStream(), UserSignInRequestDto.class);
            log.info("-----------------사번: {}-----------------", dto.getEmployeeId());
            log.info("-----------------비번: {}-----------------", dto.getPassword());

            // 비활성화 유저인지 체크할 부분

            return new UsernamePasswordAuthenticationToken(dto.getEmployeeId(), dto.getPassword(), null);

        } catch (IOException e) {
            log.info("-----------------.....로그인 실패염.....-----------------");
            response.setStatus(401);
        }

        return null;
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {

        String employeeId = authentication.getName();
        log.info("--------------employeeId--------------{}", employeeId);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        String role = "";

        if(iterator.hasNext()) {
            GrantedAuthority auth = iterator.next();
            role = auth.getAuthority();
        }


        String token = jwtUtil.createJwt(employeeId, role, 60*60*10L);
        response.addHeader("Authorization", "Bearer " + token);

        log.info("--------------ROLE::::: {}--------------", role);
        log.info("--------------ACCESSTOKEN::::::{}--------------", token);

    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {

        // 로그인 정보 틀렸을 시 401 / 존재하지 않는 유저일 시 404 -> 나중에 추가 예정
        response.setStatus(401);
    }
}

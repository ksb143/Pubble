package com.ssafy.d109.pubble.security.filter;

import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.security.custom.CustomUserDetails;
import com.ssafy.d109.pubble.security.jwt.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

@Log4j2
public class JWTFilter extends OncePerRequestFilter {


    private final JWTUtil jwtUtil;


    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            log.info("===============Token이 Null이라구요~===============");
            filterChain.doFilter(request, response);

            return;
        }

        log.info("===============Authorization Now===============");

        String accessToken = authorization.split(" ")[1];

        try {
            jwtUtil.isExpired(accessToken);
        } catch (Exception e) {

            PrintWriter writer = response.getWriter();
            writer.print("accessToken Expired");
            log.info("===============Token Expired==============");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String category = jwtUtil.getCategory(accessToken);
        if (!category.equals("Authorization")) {
            PrintWriter writer = response.getWriter();
            writer.print("Invalid AccessToken");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String employeeId = jwtUtil.getEmployeeId(accessToken);
        String role = jwtUtil.getRole(accessToken);

        User userData = User.builder()
                        .employeeId(employeeId)
                                .role(role).build();

        CustomUserDetails customUserDetails = new CustomUserDetails(userData);
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        log.info("===============로그인 추카염===============");
        log.info("===============커스텀한테 뽑아낸 임플아이디: {}===============", customUserDetails.getUsername());
        log.info("===============어뜨토큰한테 뽑아낸 롤롤롤: {}===============", authToken.getAuthorities());
        log.info("===============빌드할 때 담은 role::: {} ===============", role);

        filterChain.doFilter(request, response);


    }
}

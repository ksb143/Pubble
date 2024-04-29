package com.ssafy.d109.pubble.security.jwt;

import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.User.UserNotFoundException;
import com.ssafy.d109.pubble.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {

    private SecretKey secretKey;
    private final UserRepository userRepository;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret, UserRepository userRepository) {

        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        this.userRepository = userRepository;
    }

    public String getEmployeeId(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("employeeId", String.class);
    }

    public String getRole(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("role", String.class);
    }

    public Boolean isExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    public String getRoleFromDatabase(String token) {
        String employeeId = getEmployeeId(token);
        User user = userRepository.findByEmployeeId(employeeId).orElseThrow(UserNotFoundException::new);
        return user.getRole();
    }

    public String getProfileColor(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("profileColor", String.class);

    }

    public String createJwt(String category, String employeeId, String role, Long expiredMs) {

        User user = userRepository.findByEmployeeId(employeeId).orElseThrow(UserNotFoundException::new);
        String r = user.getRole();
        String profileColor = user.getProfileColor();

        return Jwts.builder()
                .claim("category", category)
                .claim("employeeId", employeeId)
                .claim("role", r)
                .claim("profileColor", profileColor)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }

    public String getCategory(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

}

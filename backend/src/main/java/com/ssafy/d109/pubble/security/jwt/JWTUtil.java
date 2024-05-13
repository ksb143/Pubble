package com.ssafy.d109.pubble.security.jwt;

import com.ssafy.d109.pubble.dto.projectDto.ProjectListDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.User.UserNotFoundException;
import com.ssafy.d109.pubble.repository.UserRepository;
import com.ssafy.d109.pubble.service.ProjectService;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class JWTUtil {

    private SecretKey secretKey;
    private final UserRepository userRepository;
    private final ProjectService projectService;


    public JWTUtil(@Value("${spring.jwt.secret}") String secret, UserRepository userRepository, ProjectService projectService) {

        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        this.userRepository = userRepository;
        this.projectService = projectService;
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

    public String getName(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("name", String.class);

    }

    public String getDepartment(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("department", String.class);
    }

    public String getPosition(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("position", String.class);
    }

    public String createJwt(String category, String employeeId, String role, Long expiredMs) {

        User user = userRepository.findByEmployeeId(employeeId).orElseThrow(UserNotFoundException::new);
        String r = user.getRole();
        String profileColor = user.getProfileColor();
        String name = user.getName();
        String department = user.getDepartment();
        String position = user.getPosition();

        List<String> reponseDto = new ArrayList<>();


        List<ProjectListDto> projectListDtos = projectService.getProjectList(user.getUserId());
        for (ProjectListDto dto : projectListDtos) {
            reponseDto.add(dto.getProjectId() + dto.getProjectTitle() + "/*");
        }

        return Jwts.builder()
                .claim("category", category)
                .claim("employeeId", employeeId)
                .claim("role", r)
                .claim("profileColor", profileColor)
                .claim("name", name)
                .claim("department", department)
                .claim("position", position)
                .claim("allowedDocumentNames", reponseDto)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }

    public String getCategory(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

}
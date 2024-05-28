package com.ssafy.d109.pubble.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;


@OpenAPIDefinition(
        info = @Info(title = "퍼블 api",
                description = "퍼블 api",
                version = "v1"
        )
)

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                .group("user-api")
                .pathsToMatch("/users/**")
                .build();
    }

    @Bean
    public GroupedOpenApi projectsApi() {
        return GroupedOpenApi.builder()
                .group("projects-api")
                .pathsToMatch("/projects/**")
                .build();
    }

    @Bean
    public GroupedOpenApi noticeApi() {
        return GroupedOpenApi.builder()
                .group("notice-api")
                .pathsToMatch("/notices/**")
                .build();
    }

    @Bean
    public GroupedOpenApi requirementsConfirmApi() {
        return GroupedOpenApi.builder()
                .group("confirm-api")
                .pathsToMatch("/requirements/confirm/**")
                .build();
    }

    @Bean
    public GroupedOpenApi requirementsApi() {
        return GroupedOpenApi.builder()
                .group("requirements-api")
                .pathsToMatch("/requirements/**")
                .build();
    }

    @Bean
    public GroupedOpenApi RequirementBoardApi() {
        return GroupedOpenApi.builder()
                .group("requirement-board-api")
                .pathsToMatch("/requirement-board/**")
                .build();
    }

    @Bean
    public GroupedOpenApi uploadsApi() {
        return GroupedOpenApi.builder()
                .group("uploads-api")
                .pathsToMatch("/uploads/**")
                .build();
    }

    @Bean
    public GroupedOpenApi messageApi() {
        return GroupedOpenApi.builder()
                .group("message-api")
                .pathsToMatch("/messages/**")
                .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("admin-api")
                .pathsToMatch("/admin/**")
                .build();
    }


    // 추후에 토큰을 헤더에 자동으로 추가해주는 쪽으로 변경 예정
    @Bean
    public OpenAPI openAPI(){
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER).name("Authorization");
        SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

        return new OpenAPI()
                .components(new Components().addSecuritySchemes("bearerAuth", securityScheme))
                .security(Arrays.asList(securityRequirement));
    }
}

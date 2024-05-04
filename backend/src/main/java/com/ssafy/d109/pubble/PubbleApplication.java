package com.ssafy.d109.pubble;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
public class PubbleApplication {

	public static void main(String[] args) {
		System.out.println("Hello Spring");
		SpringApplication.run(PubbleApplication.class, args);
	}

}

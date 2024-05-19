package com.ssafy.d109.pubble.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/sub");  // 바로 일대다 브로드캐스팅
        config.setApplicationDestinationPrefixes("/pub");  // 바로 브로커로 가지 않고 핸들러(Controller)로 라우팅
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // 클라이언트가 연결해야 할 엔드포인트
                .setAllowedOrigins("*"); // cors 일단 다 허용
//                .withSockJS(); // 직접 지원 안하는 브라우저의 경우 sockjs를 들고 오면 됨
    }
}

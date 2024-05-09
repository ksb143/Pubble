package com.ssafy.d109.pubble.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.ssafy.d109.pubble.dto.requestDto.FcmNotificationRequestDto;
import com.ssafy.d109.pubble.entity.User;
import com.ssafy.d109.pubble.exception.User.UserNotFoundException;
import com.ssafy.d109.pubble.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

@Service
@Log4j2
public class FcmNotificationService {

    private final FirebaseMessaging firebaseMessaging;
    private final UserRepository userRepository;

    public FcmNotificationService(FirebaseMessaging firebaseMessaging, UserRepository userRepository) {
        this.firebaseMessaging = firebaseMessaging;
        this.userRepository = userRepository;
    }

    public String sendNotificationByToken(FcmNotificationRequestDto reqDto) throws IOException {
        User user = userRepository.findByEmployeeId(reqDto.getTargetUserId()).orElseThrow(UserNotFoundException::new);
        log.info("토큰을 받아올 수 있을까? ㅋ {}", getAccessToken());

        if (user.getFirebaseToken() != null) {
            Notification notification = Notification.builder()
                    .setTitle(reqDto.getTitle())
                    .setBody(reqDto.getBody())
                    .build();

            Message message = Message.builder()
                    .setToken(user.getFirebaseToken())
                    .setNotification(notification)
                    .build();


            try {
                firebaseMessaging.send(message);
                return "알림을 성공적으로 전송했당. targetUserId = " +reqDto.getTargetUserId();
            } catch (FirebaseMessagingException e) {
                throw new RuntimeException(e);
            }
        } else {
            return "서버에 저장된 해당 유저의 FirebaseToken이 존재하지 않음. targetUserId = " +reqDto.getTargetUserId();
        }

    }

    public String getAccessToken() throws IOException {
        String firebaseConfigPath = "firebase/pubble-push-firebase-adminsdk-eb4ae-98b9f0e5f0.json";

        GoogleCredentials googleCredentials = GoogleCredentials.fromStream(new ClassPathResource(firebaseConfigPath).getInputStream())
                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

        googleCredentials.refreshIfExpired();
        return googleCredentials.getAccessToken().getTokenValue();

    }

}

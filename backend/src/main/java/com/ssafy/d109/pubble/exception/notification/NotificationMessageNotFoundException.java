package com.ssafy.d109.pubble.exception.notification;

public class NotificationMessageNotFoundException extends RuntimeException{
    public NotificationMessageNotFoundException() {
        super("Notification Message Not Found Exception");
    }
}

package com.ssafy.d109.pubble.exception.notification;

public class NotificationSendingFailedException extends RuntimeException{
    public NotificationSendingFailedException() {
        super("Failed to send notification");
    }
}

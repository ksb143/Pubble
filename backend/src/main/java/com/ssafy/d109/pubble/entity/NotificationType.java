package com.ssafy.d109.pubble.entity;

public enum NotificationType {
    PROJECT,
    NEW_REQUIREMENT,        // requirementId, requirementCode, projectCode, projectId
    MENTION,                 // requirementId, requirementCode, projectCode, projectId, threadId
    MESSAGE                 // type (-> "message")
}


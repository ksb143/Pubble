package com.ssafy.d109.pubble.util;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {

    ROLE_ADMIN("ADMIN"),
    ROLE_USER("USER");

    String value;

    Role(String value) {
        this.value = value;
    }
}

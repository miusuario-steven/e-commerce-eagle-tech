package com.eagletech.ecommerce.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserType {
    ADMIN,
    USER;

    @JsonCreator
    public static UserType fromValue(String value) {
        return UserType.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name().toLowerCase();
    }
}
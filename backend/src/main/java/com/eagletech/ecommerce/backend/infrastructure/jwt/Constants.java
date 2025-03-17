package com.eagletech.ecommerce.backend.infrastructure.jwt;

import java.nio.charset.StandardCharsets;
import java.security.Key;

import io.jsonwebtoken.security.Keys;

public class Constants {
    public static final String HEADER_AUTHORIZATION = "Authorization"; 
    public static final String TOKEN_BEARER_PREFIX = "Bearer ";

    public static final String SUPER_SECRET_KEY = "%KmX375hUoLro&%ue#Jyi@zC$6&aDan@5H&ZZ7ReVFimt$uzmPXKYmfF2&&YGZ35#46bFiI";
    public static final long TOKEN_EXPIRATION_TIME = 1500000; // 15 minutes

    public static Key getSigiKey(String secretKey) {
        byte [] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}   

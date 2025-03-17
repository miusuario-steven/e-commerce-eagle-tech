package com.eagletech.ecommerce.backend.infrastructure.jwt;

import static com.eagletech.ecommerce.backend.infrastructure.jwt.Constants.TOKEN_BEARER_PREFIX;
import static com.eagletech.ecommerce.backend.infrastructure.jwt.Constants.TOKEN_EXPIRATION_TIME;
import static com.eagletech.ecommerce.backend.infrastructure.jwt.Constants.SUPER_SECRET_KEY;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.security.Key;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JWTGenerator {
    public String getToken(String username) {
        List<GrantedAuthority> authorityList = AuthorityUtils.commaSeparatedStringToAuthorityList(
            SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","))
        );

        Key key = new SecretKeySpec(SUPER_SECRET_KEY.getBytes(), SignatureAlgorithm.HS512.getJcaName());

        String token = Jwts.builder()
            .setId("ecommerce")
            .setSubject(username)
            .claim("authorities", authorityList.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + TOKEN_EXPIRATION_TIME))
            .signWith(key, SignatureAlgorithm.HS512)
            .compact();
        return TOKEN_BEARER_PREFIX  + " " + token;
    }
}

package com.eagletech.ecommerce.backend.infrastructure.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import static com.eagletech.ecommerce.backend.infrastructure.jwt.Constants.HEADER_AUTHORIZATION;
import static com.eagletech.ecommerce.backend.infrastructure.jwt.Constants.SUPER_SECRET_KEY;
import static com.eagletech.ecommerce.backend.infrastructure.jwt.Constants.TOKEN_BEARER_PREFIX;
import static com.eagletech.ecommerce.backend.infrastructure.jwt.Constants.getSigiKey;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.eagletech.ecommerce.backend.infrastructure.service.CustomUserDetailService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

public class JWTValidate {
    // Valida que el token venga en la petición
    public static boolean tokenExists(HttpServletRequest request, HttpServletResponse response) {
        String header = request.getHeader(HEADER_AUTHORIZATION);
        if (header == null || !header.startsWith(TOKEN_BEARER_PREFIX)) {
            return false;
        }
        return true;
    }

    // Valida que el token sea correcto
    public static Claims JWTValid(HttpServletRequest request) {
        String jwtToken = request.getHeader(HEADER_AUTHORIZATION).replace(TOKEN_BEARER_PREFIX, "");

        return Jwts.parserBuilder()
            .setSigningKey(getSigiKey(SUPER_SECRET_KEY))
            .build()
            .parseClaimsJws(jwtToken)
            .getBody();
    }

    // Autenticar al usuario en el flujo Spring
    public static void setAuthentication(Claims claims, CustomUserDetailService customUserDetailService) {
        UserDetails userDetails = customUserDetailService.loadUserByUsername(claims.getSubject());
        UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication); 
    }
}
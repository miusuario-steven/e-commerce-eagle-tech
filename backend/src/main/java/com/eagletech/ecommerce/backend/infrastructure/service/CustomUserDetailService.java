package com.eagletech.ecommerce.backend.infrastructure.service;

import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.usecases.ManageUserUseCase;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {
    private final ManageUserUseCase manageUserUseCase;

    public CustomUserDetailService(ManageUserUseCase manageUserUseCase) {
        this.manageUserUseCase = manageUserUseCase;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            User user = manageUserUseCase.getUserByEmail(username);
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .roles(user.getUserType().name())
                    .build();
        } catch (Exception e) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }
    }
}
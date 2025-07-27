package com.eagletech.ecommerce.backend.usecases;

import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.domain.port.IUserRepository;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.UserAlreadyExistsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class RegisterUserUseCase {
    private final IUserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public RegisterUserUseCase(IUserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User execute(User user) {
        userRepository.findByEmail(user.getEmail()).ifPresent(existingUser -> {
            throw new UserAlreadyExistsException("User with email " + user.getEmail() + " already exists.");
        });

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
}

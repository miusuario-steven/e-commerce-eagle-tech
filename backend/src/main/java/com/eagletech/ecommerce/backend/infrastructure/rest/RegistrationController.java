package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.usecases.RegisterUserUseCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/security")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class RegistrationController {
    private final RegisterUserUseCase registerUserUseCase;

    public RegistrationController(RegisterUserUseCase registerUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        log.info("Attempting to register user with email: {}", user.getEmail());
        User registeredUser = registerUserUseCase.execute(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }
}
package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.infrastructure.dto.JWTClient;
import com.eagletech.ecommerce.backend.infrastructure.dto.UserDTO;
import com.eagletech.ecommerce.backend.infrastructure.jwt.JWTGenerator;
import com.eagletech.ecommerce.backend.usecases.ManageUserUseCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/security")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final JWTGenerator jwtGenerator;
    private final ManageUserUseCase manageUserUseCase;

    public LoginController(AuthenticationManager authenticationManager, JWTGenerator jwtGenerator, ManageUserUseCase manageUserUseCase) {
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
        this.manageUserUseCase = manageUserUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<JWTClient> login(@RequestBody UserDTO userDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userDTO.username(), userDTO.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.info("Details: {}", SecurityContextHolder.getContext().getAuthentication().getName());
        log.info("Rol de user: {}", SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().findFirst().get().toString());

        User user = manageUserUseCase.getUserByEmail(userDTO.username());
        String token = jwtGenerator.getToken(userDTO.username());
        JWTClient jwtClient = new JWTClient(user.getId(), token, user.getUserType().toString());

        return new ResponseEntity<>(jwtClient, HttpStatus.OK);
    }
}
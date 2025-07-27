package com.eagletech.ecommerce.backend.usecases;

import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.domain.port.IUserRepository;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.UserNotFoundException;

public class ManageUserUseCase {
    private final IUserRepository userRepository;

    public ManageUserUseCase(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User updateUser(User user) {
        // Aquí se podría añadir lógica de negocio, como verificar que el email no se cambie a uno ya existente.
        return this.userRepository.save(user);
    }

    public User getUserById(Integer id) {
        return this.userRepository.findById(id).orElseThrow(
            () -> new UserNotFoundException("User with id " + id + " not found.")
        );
    }

    public User getUserByEmail(String email) {
        return this.userRepository.findByEmail(email).orElseThrow(
            () -> new UserNotFoundException("User with email " + email + " not found.")
        );
    }
}
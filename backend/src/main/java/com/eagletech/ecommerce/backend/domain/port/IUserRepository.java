package com.eagletech.ecommerce.backend.domain.port;

import java.util.Optional;

import com.eagletech.ecommerce.backend.domain.model.User;

public interface IUserRepository {
    User save (User user);
    Optional<User> findByEmail(String email);
    Optional<User> findById(Integer id);
}

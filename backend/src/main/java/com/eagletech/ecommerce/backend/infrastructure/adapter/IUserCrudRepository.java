package com.eagletech.ecommerce.backend.infrastructure.adapter;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.eagletech.ecommerce.backend.infrastructure.entity.UserEntity;

public interface IUserCrudRepository extends CrudRepository<UserEntity,Integer> {
    Optional<UserEntity> findByEmail(String email); 
}

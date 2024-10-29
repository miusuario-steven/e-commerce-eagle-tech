package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;

import com.eagletech.ecommerce.backend.infrastructure.entity.UserEntity;

public interface IUserCrudRepository extends CrudRepository<UserEntity,Integer> {

}

package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import com.eagletech.ecommerce.backend.domain.model.OrderState;
import com.eagletech.ecommerce.backend.infrastructure.entity.OrderEntity;
import com.eagletech.ecommerce.backend.infrastructure.entity.UserEntity;

public interface IOrderCrudRepository extends CrudRepository<OrderEntity, Integer>{
    @Transactional
    @Modifying
    @Query("UPDATE OrderEntity o SET o.orderState = :state WHERE o.id = :id")
    void updateStateById(Integer id, OrderState state);

    Iterable<OrderEntity> findByUserEntity(UserEntity userEntity);
}
    
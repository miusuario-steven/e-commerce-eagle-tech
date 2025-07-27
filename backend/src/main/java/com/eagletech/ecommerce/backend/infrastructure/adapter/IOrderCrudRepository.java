package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import com.eagletech.ecommerce.backend.domain.model.OrderState;
import com.eagletech.ecommerce.backend.infrastructure.entity.OrderEntity;
import com.eagletech.ecommerce.backend.infrastructure.entity.UserEntity;

public interface IOrderCrudRepository extends JpaRepository<OrderEntity, Integer>{
    @Transactional
    @Modifying
    @Query("UPDATE OrderEntity o SET o.orderState = :state WHERE o.id = :id")
    void updateStateById(Integer id, OrderState state);

    @Query("SELECT o FROM OrderEntity o JOIN FETCH o.orderProducts op WHERE o.userEntity = :userEntity")
    Page<OrderEntity> findByUserEntityWithProducts(UserEntity userEntity, Pageable pageable);

    // Mantener findByUserEntity si se usa en otros lugares sin necesidad de productos
    Iterable<OrderEntity> findByUserEntity(UserEntity userEntity);

    @Query(value = "SELECT o FROM OrderEntity o JOIN FETCH o.userEntity",
       countQuery = "SELECT count(o) FROM OrderEntity o")
    Page<OrderEntity> findAllWithUser(Pageable pageable);
}
    
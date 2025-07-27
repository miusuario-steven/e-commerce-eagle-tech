package com.eagletech.ecommerce.backend.domain.port;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.eagletech.ecommerce.backend.domain.model.Order;

public interface IOrderRepository {
    Order save (Order order);
    Order findById (Integer id);
    Page<Order> findAll(Pageable pageable);
    Page<Order> findByUserId(Integer userId, Pageable pageable);
    void updateStateById(Integer id, String state);
}

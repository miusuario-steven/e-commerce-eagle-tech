package com.eagletech.ecommerce.backend.application;

import com.eagletech.ecommerce.backend.domain.model.Order;
import com.eagletech.ecommerce.backend.domain.model.OrderProduct;
import com.eagletech.ecommerce.backend.domain.port.IOrderRepository;
import com.eagletech.ecommerce.backend.infrastructure.mapper.IOrderMapper;

public class OrderService {

    private final IOrderRepository iOrderRepository;
    private final IOrderMapper orderMapper;

    public OrderService(IOrderRepository iOrderRepository, IOrderMapper orderMapper) {
        this.iOrderRepository = iOrderRepository;
        this.orderMapper = orderMapper;
    }

    public Order save(Order order) {
        if (order.getOrderProducts() != null) {
            var orderEntity = orderMapper.toOrderEntity(order);
            for (OrderProduct product : order.getOrderProducts()) {
                product.setOrderEntity(orderEntity);
            }
        }
        return this.iOrderRepository.save(order);
    }

    public Iterable<Order> findAll() {
        return this.iOrderRepository.findAll();
    }

    public Iterable<Order> findByUserId(Integer userId) {
        return this.iOrderRepository.findByUserId(userId);
    }

    public void updateStateById(Integer id, String state) {
        this.iOrderRepository.updateStateById(id, state);
    }

    public Order findById(Integer id) {
        return this.iOrderRepository.findById(id);
    }
}

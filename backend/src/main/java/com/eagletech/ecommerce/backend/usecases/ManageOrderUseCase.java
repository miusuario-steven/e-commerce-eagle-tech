package com.eagletech.ecommerce.backend.usecases;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.eagletech.ecommerce.backend.domain.model.Order;
import com.eagletech.ecommerce.backend.domain.model.OrderProduct;
import com.eagletech.ecommerce.backend.domain.model.OrderState;
import com.eagletech.ecommerce.backend.domain.model.Product;
import com.eagletech.ecommerce.backend.domain.port.IOrderRepository;
import com.eagletech.ecommerce.backend.domain.port.IProductRepository;
import com.eagletech.ecommerce.backend.infrastructure.mapper.IOrderMapper;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.ProductNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class ManageOrderUseCase {

    private final IOrderRepository orderRepository;
    private final IProductRepository productRepository;
    private final IOrderMapper orderMapper;

    @Transactional
    public Order createOrder(Order order) {
        log.info("Received order creation request for user {}", order.getUser().getId());

        order.setOrderState(OrderState.PENDING);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderProduct op : order.getOrderProducts()) {
            log.debug("Processing product ID: {} with quantity: {}", op.getProductId(), op.getQuantity());
            Product product = productRepository.findById(op.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + op.getProductId()));

            BigDecimal price = product.getPrice();
            op.setPrice(price);
            log.debug("Product ID: {} - DB Price: {} - Quantity: {}", op.getProductId(), op.getPrice(), op.getQuantity());

            total = total.add(price.multiply(op.getQuantity()));
        } 

        order.setTotal(total.doubleValue());
        log.info("Recalculated total for order: {}", order.getTotal());

        var orderEntity = orderMapper.toOrderEntity(order);
        for (OrderProduct product : order.getOrderProducts()) {
            product.setOrderEntity(orderEntity);
        }

        Order savedOrder = this.orderRepository.save(order);
        log.info("Order with ID: {} successfully saved for user {}", savedOrder.getId(), savedOrder.getUser().getId());
        return savedOrder;
    }

    public Page<Order> getAllOrders(Pageable pageable) {
        return this.orderRepository.findAll(pageable);
    }

    public Page<Order> getOrdersByUserId(Integer userId, Pageable pageable) {
        return this.orderRepository.findByUserId(userId, pageable);
    }

    @Transactional
    public void updateOrderState(Integer orderId, String newState) {
        log.info("Updating order {} to state {}", orderId, newState);
        OrderState state = OrderState.valueOf(newState.toUpperCase());
        this.orderRepository.updateStateById(orderId, state.toString());
    }

    public Order getOrderById(Integer id) {
        return this.orderRepository.findById(id);
    }
}
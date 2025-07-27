package com.eagletech.ecommerce.backend.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class Order {
    private Integer id;
    private LocalDateTime dateCreated;
    private List<OrderProduct> orderProducts;
    private OrderState orderState;
    private User user;
    private Double total; // Campo para el total calculado

    public Order() {
        orderProducts = new ArrayList<>();
    }

    // Este método es útil para calcular el total sobre la marcha si es necesario, lo mantenemos.
    public BigDecimal getTotalOrderPrice(){
        return this.orderProducts.stream()
                .map(OrderProduct::getTotalItem)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

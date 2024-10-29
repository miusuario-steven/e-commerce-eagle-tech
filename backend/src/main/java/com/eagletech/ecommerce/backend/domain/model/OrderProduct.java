package com.eagletech.ecommerce.backend.domain.model;

import java.math.BigDecimal;

import com.eagletech.ecommerce.backend.infrastructure.entity.OrderEntity;

import lombok.Data;
@Data
public class OrderProduct {
    private Integer id;
    private BigDecimal quantity;
    private BigDecimal price;
    private Integer productId;
    private OrderEntity orderEntity;

    public BigDecimal getTotalItem(){
        return this.price.multiply(quantity);
    }
    

}

package com.eagletech.ecommerce.backend.infrastructure.rest.dto;

import com.eagletech.ecommerce.backend.domain.model.OrderState;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderSummaryDTO {
    private Integer id;
    private LocalDateTime dateCreated;
    private OrderState orderState;
    private Double total;
    private CustomerDTO customer;
}

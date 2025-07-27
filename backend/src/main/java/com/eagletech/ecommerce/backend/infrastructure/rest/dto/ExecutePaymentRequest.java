package com.eagletech.ecommerce.backend.infrastructure.rest.dto;

import lombok.Data;

@Data
public class ExecutePaymentRequest {
    private String paymentId;
    private String payerId;
    private Integer orderId;
}

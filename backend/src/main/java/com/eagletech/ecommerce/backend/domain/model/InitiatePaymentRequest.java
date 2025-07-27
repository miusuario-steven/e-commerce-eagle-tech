package com.eagletech.ecommerce.backend.domain.model;

import lombok.Data;

@Data
public class InitiatePaymentRequest {
    private Integer orderId;
}

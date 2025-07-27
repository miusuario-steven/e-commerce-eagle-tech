package com.eagletech.ecommerce.backend.domain.model;

public enum OrderState {
    PENDING,
    PAYMENT_INITIATED, // New state
    PAID,
    CONFIRMED,
    PAYMENT_FAILED,    // New state
    CANCELED
}

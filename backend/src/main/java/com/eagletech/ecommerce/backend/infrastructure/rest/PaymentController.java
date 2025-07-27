package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.infrastructure.rest.dto.ExecutePaymentRequest;
import com.eagletech.ecommerce.backend.usecases.PaymentUseCase;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.OrderNotFoundException;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.PaymentProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentUseCase paymentUseCase;

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, String>> initiatePayment(@RequestBody Map<String, Integer> body) {
        Integer orderId = body.get("orderId");
        log.info("Initiating PayPal payment for orderId: {}", orderId);
        Map<String, String> response = paymentUseCase.createPayment(orderId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/execute")
    public ResponseEntity<Void> executePayment(@RequestBody ExecutePaymentRequest request) {
        log.info("Executing payment for paymentId: {} and orderId: {}", request.getPaymentId(), request.getOrderId());
        paymentUseCase.executePayment(request.getPaymentId(), request.getPayerId(), request.getOrderId());
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<String> handleOrderNotFoundException(OrderNotFoundException ex) {
        log.error("Order not found: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PaymentProcessingException.class)
    public ResponseEntity<String> handlePaymentProcessingException(PaymentProcessingException ex) {
        log.error("Payment processing error: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}

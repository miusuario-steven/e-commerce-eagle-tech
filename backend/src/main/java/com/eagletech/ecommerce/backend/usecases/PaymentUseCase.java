package com.eagletech.ecommerce.backend.usecases;

import com.eagletech.ecommerce.backend.domain.model.Order;
import com.eagletech.ecommerce.backend.domain.port.IOrderRepository;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.OrderNotFoundException;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.PaymentProcessingException;
import com.eagletech.ecommerce.backend.infrastructure.service.PaypalService;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.Links;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentUseCase {

    private final PaypalService paypalService;
    private final IOrderRepository orderRepository;
    private final ManageOrderUseCase manageOrderUseCase;

    @Transactional
    public Map<String, String> createPayment(Integer orderId) {
        Order order = orderRepository.findById(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found with id: " + orderId);
        }

        try {
            Payment createdPayment = paypalService.createPayment(order.getTotal());

            // Update order state to PAYMENT_INITIATED
            manageOrderUseCase.updateOrderState(orderId, "PAYMENT_INITIATED");
            log.info("Order {} state updated to PAYMENT_INITIATED.", orderId);

            for (Links links : createdPayment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    return Map.of("url", links.getHref());
                }
            }
            throw new PaymentProcessingException("Approval URL not found from PayPal.");

        } catch (PayPalRESTException e) {
            log.error("Error creating PayPal payment for orderId: {}", orderId, e);
            throw new PaymentProcessingException("Error communicating with PayPal during payment creation", e);
        }
    }

    @Transactional
    public void executePayment(String paymentId, String payerId, Integer orderId) {
        try {
            Payment executedPayment = paypalService.executePayment(paymentId, payerId);

            if (executedPayment.getState().equals("approved")) {
                log.info("Payment for order {} with paymentId {} has been approved by PayPal.", orderId, paymentId);
                manageOrderUseCase.updateOrderState(orderId, "CONFIRMED");
                log.info("Order {} state updated to CONFIRMED.", orderId);
            } else {
                log.warn("Payment for order {} was not approved. State: {}", orderId, executedPayment.getState());
                manageOrderUseCase.updateOrderState(orderId, "PAYMENT_FAILED"); // Update state to FAILED
                log.info("Order {} state updated to PAYMENT_FAILED.", orderId);
                throw new PaymentProcessingException("Payment was not approved by PayPal.");
            }
        } catch (PayPalRESTException e) {
            log.error("Error executing PayPal payment for orderId: {}", orderId, e);
            throw new PaymentProcessingException("Error communicating with PayPal during payment execution", e);
        }
    }
}

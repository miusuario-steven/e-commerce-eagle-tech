package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.domain.model.Order;
import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.domain.port.IUserRepository;
import com.eagletech.ecommerce.backend.usecases.ManageOrderUseCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.ProductNotFoundException;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class OrderController {
    private final ManageOrderUseCase manageOrderUseCase;
    private final IUserRepository iUserRepository;

    public OrderController(ManageOrderUseCase manageOrderUseCase, IUserRepository iUserRepository) {
        this.manageOrderUseCase = manageOrderUseCase;
        this.iUserRepository = iUserRepository;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        log.info("Creating new order for user: {}", order.getUser().getId());
        Order createdOrder = manageOrderUseCase.createOrder(order);
        return ResponseEntity.ok(createdOrder);
    }

    @PatchMapping("/{id}/state")
    public ResponseEntity<Void> updateOrderState(@PathVariable Integer id, @RequestBody Map<String, String> state) {
        String newState = state.get("state");
        log.info("Updating state for order {} to {}", id, newState);
        manageOrderUseCase.updateOrderState(id, newState);
        return ResponseEntity.ok().build();
    }

    

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(manageOrderUseCase.getOrderById(id));
    }

    @GetMapping("/my-history")
    public ResponseEntity<Page<Order>> getMyOrderHistory(
        Authentication authentication,
        @PageableDefault(size = 10, page = 0, sort = "dateCreated", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        String username = authentication.getName();
        User user = iUserRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found for email: " + username));
        log.info("Fetching order history for user ID: {} with pageable: {}", user.getId(), pageable);
        return ResponseEntity.ok(manageOrderUseCase.getOrdersByUserId(user.getId(), pageable));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        log.error("User not found: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<String> handleProductNotFoundException(ProductNotFoundException ex) {
        log.error("Product not found: {}", ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}
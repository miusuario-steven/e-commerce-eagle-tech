package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.domain.model.Order;
import com.eagletech.ecommerce.backend.infrastructure.mapper.IAdminOrderMapper;
import com.eagletech.ecommerce.backend.infrastructure.rest.dto.OrderSummaryDTO;
import com.eagletech.ecommerce.backend.usecases.ManageOrderUseCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/orders")
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminOrderController {

    private final ManageOrderUseCase manageOrderUseCase;
    private final IAdminOrderMapper iAdminOrderMapper;


    public AdminOrderController(ManageOrderUseCase manageOrderUseCase, IAdminOrderMapper iAdminOrderMapper) {
        this.manageOrderUseCase = manageOrderUseCase;
        this.iAdminOrderMapper = iAdminOrderMapper;
    }

    @GetMapping
    public ResponseEntity<Page<OrderSummaryDTO>> getAllOrders(
            @PageableDefault(size = 10, page = 0, sort = "dateCreated", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String customerQuery) {
        log.info("Admin request for all orders with pageable: {}, status: {}, customerQuery: {}", pageable, status, customerQuery);
        Page<Order> orders = manageOrderUseCase.getAllOrders(pageable);
        Page<OrderSummaryDTO> orderSummaries = orders.map(iAdminOrderMapper::toOrderSummaryDTO);
        return ResponseEntity.ok(orderSummaries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable("id") Integer id) {
        log.info("Admin request for order details with ID: {}", id);
        // Note: For a full implementation, we would also create an OrderDetailDTO and map to it here.
        // For now, returning the full domain object is acceptable for the detail view if secured.
        return ResponseEntity.ok(manageOrderUseCase.getOrderById(id));
    }

    @PutMapping("/{id}/state")
    public ResponseEntity<Void> updateOrderState(@PathVariable Integer id, @RequestBody Map<String, String> state) {
        String newState = state.get("newState");
        log.info("Admin request to update state for order {} to {}", id, newState);
        manageOrderUseCase.updateOrderState(id, newState);
        return ResponseEntity.ok().build();
    }
}

package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.domain.model.Product;
import com.eagletech.ecommerce.backend.infrastructure.dto.ProductDto;
import com.eagletech.ecommerce.backend.infrastructure.dto.ProductMapper;
import com.eagletech.ecommerce.backend.usecases.ManageProductUseCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/home")
@CrossOrigin(origins = "http://localhost:4200")
public class HomeController {

    private final ManageProductUseCase manageProductUseCase;
    private final ProductMapper productMapper;

    public HomeController(ManageProductUseCase manageProductUseCase, ProductMapper productMapper) {
        this.manageProductUseCase = manageProductUseCase;
        this.productMapper = productMapper;
    }

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getAllProducts(Pageable pageable) {
        Page<ProductDto> productPage = manageProductUseCase.getAllProducts(pageable).map(productMapper::toDto);
        return ResponseEntity.ok(productPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(manageProductUseCase.getProductById(id));
    }
}
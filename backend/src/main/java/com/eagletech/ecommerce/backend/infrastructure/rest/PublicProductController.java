package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.infrastructure.dto.ProductDto;
import com.eagletech.ecommerce.backend.infrastructure.dto.ProductMapper;
import com.eagletech.ecommerce.backend.usecases.ManageProductUseCase;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class PublicProductController {

    private final ManageProductUseCase manageProductUseCase;
    private final ProductMapper productMapper;

    @GetMapping("/search")
    public ResponseEntity<Page<ProductDto>> searchProducts(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            Pageable pageable) {

        Page<ProductDto> productPage = manageProductUseCase.searchPublicProducts(categoryId, searchTerm, minPrice, maxPrice, pageable)
                .map(productMapper::toDto);

        return ResponseEntity.ok(productPage);
    }
}

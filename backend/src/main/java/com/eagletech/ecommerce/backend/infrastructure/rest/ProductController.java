package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.domain.model.Product;
import com.eagletech.ecommerce.backend.infrastructure.dto.ProductDto;
import com.eagletech.ecommerce.backend.infrastructure.dto.ProductMapper;
import com.eagletech.ecommerce.backend.usecases.ManageProductUseCase;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/admin/products")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
@AllArgsConstructor
public class ProductController {
    private final ManageProductUseCase manageProductUseCase;
    private final ProductMapper productMapper;

    @PostMapping
    public ResponseEntity<Product> save(
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile multipartFile) throws IOException {

        log.info("Saving product: {}", product.getName());
        return new ResponseEntity<>(manageProductUseCase.saveProduct(product, multipartFile), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ProductDto>> findAll(Pageable pageable) {
        Page<ProductDto> productPage = manageProductUseCase.getAllProducts(pageable).map(productMapper::toDto);
        return ResponseEntity.ok(productPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(manageProductUseCase.getProductById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id) {
        manageProductUseCase.deleteProductById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(
            @PathVariable Integer id,
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile multipartFile) throws IOException {
        product.setId(id); // Asegurarse de que el ID del path prevalezce
        log.info("Updating product: {}", product.getName());
        return new ResponseEntity<>(manageProductUseCase.saveProduct(product, multipartFile), HttpStatus.OK);
    }
}
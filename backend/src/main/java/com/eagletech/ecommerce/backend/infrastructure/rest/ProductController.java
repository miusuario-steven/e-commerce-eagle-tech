package com.eagletech.ecommerce.backend.infrastructure.rest;

import java.io.IOException;
import java.math.BigDecimal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eagletech.ecommerce.backend.application.ProductService;
import com.eagletech.ecommerce.backend.domain.model.Product;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/admin/products")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
@AllArgsConstructor
public class ProductController {
    private final ProductService productService;

    // Método para guardar un nuevo producto con datos de texto y un archivo de imagen
    @PostMapping
    public ResponseEntity<Product> save(
            @RequestParam(required = false) Integer id, // ✅ hazlo opcional
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("urlImage") String urlImage,
            @RequestParam("userId") Integer userId,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam(value = "image", required = false)MultipartFile multipartFile
            ) throws IOException{

        // Crear el objeto Product con los datos recibidos
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setUserId(userId);
        product.setCategoryId(categoryId);
        product.setUrlImage(urlImage);

        log.info("Producto guardado: {}", product.getName());
        return new ResponseEntity<>(productService.save(product,multipartFile), HttpStatus.CREATED);
    }

    // Obtener todos los productos
    @GetMapping
    public ResponseEntity<Iterable<Product>> findAll() {
        return ResponseEntity.ok(productService.findALL());
    }

    // Obtener un producto por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    // Eliminar un producto por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id) {
        productService.deleteById(id);  
        return ResponseEntity.ok().build();
    }
}
     


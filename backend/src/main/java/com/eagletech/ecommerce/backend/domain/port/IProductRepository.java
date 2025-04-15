package com.eagletech.ecommerce.backend.domain.port;

import java.util.Optional;

import com.eagletech.ecommerce.backend.domain.model.Product;

public interface IProductRepository {
    Product save (Product product);
    Iterable<Product> findALL();
    Product findById(Integer id);
    void deleteById(Integer id);
    Optional<Product> findTopByOrderByIdDesc();
}

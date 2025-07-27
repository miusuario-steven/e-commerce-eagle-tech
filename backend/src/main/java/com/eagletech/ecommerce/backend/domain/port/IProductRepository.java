package com.eagletech.ecommerce.backend.domain.port;

import com.eagletech.ecommerce.backend.domain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface IProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
}

package com.eagletech.ecommerce.backend.infrastructure.dto;

import com.eagletech.ecommerce.backend.domain.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDto toDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setCode(product.getCode());
        dto.setDescription(product.getDescription());
        dto.setUrlImage(product.getUrlImage());
        dto.setPrice(product.getPrice());
        return dto;
    }
}

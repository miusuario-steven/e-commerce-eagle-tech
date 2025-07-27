package com.eagletech.ecommerce.backend.infrastructure.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDto {
    private Integer id;
    private String name;
    private String code;
    private String description;
    private String urlImage;
    private BigDecimal price;
    private Integer version;
}

package com.eagletech.ecommerce.backend.domain.model;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    private Integer id;
    private String name;
    private LocalDateTime dateCreated;
    private LocalDateTime dateUpdated;
}

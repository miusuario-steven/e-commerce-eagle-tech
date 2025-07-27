package com.eagletech.ecommerce.backend.infrastructure.specifications;

import com.eagletech.ecommerce.backend.domain.model.Product;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class ProductSpecification {

    public Specification<Product> hasCategory(Integer categoryId) {
        return (root, query, criteriaBuilder) -> {
            if (categoryId == null) {
                return criteriaBuilder.conjunction(); // Devuelve una condición siempre verdadera si no hay ID
            }
            return criteriaBuilder.equal(root.get("categoryId"), categoryId);
        };
    }

    public Specification<Product> nameContaining(String searchTerm) {
        return (root, query, criteriaBuilder) -> {
            if (searchTerm == null || searchTerm.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + searchTerm.toLowerCase() + "%");
        };
    }

    // Aquí se pueden añadir más especificaciones en el futuro (precio, etc.)

    public Specification<Product> priceGreaterThanOrEqual(Double minPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    public Specification<Product> priceLessThanOrEqual(Double maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (maxPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }
}

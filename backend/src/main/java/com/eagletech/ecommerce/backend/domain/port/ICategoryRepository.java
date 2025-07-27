package com.eagletech.ecommerce.backend.domain.port;

import com.eagletech.ecommerce.backend.domain.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface ICategoryRepository {
    Category save(Category category);
    Page<Category> findAll(Pageable pageable);
    Page<Category> findByNameContaining(String name, Pageable pageable);
    Optional<Category> findByNameIgnoreCase(String name);
    Category findById(Integer id);
    void deleteById(Integer id);
}

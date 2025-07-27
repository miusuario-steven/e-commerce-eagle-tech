package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

import com.eagletech.ecommerce.backend.infrastructure.entity.CategoryEntity;

public interface ICategoryCrudRepository extends JpaRepository<CategoryEntity,Integer> {
    Page<CategoryEntity> findByNameContaining(String name, Pageable pageable);
    Optional<CategoryEntity> findByNameIgnoreCase(String name);
}

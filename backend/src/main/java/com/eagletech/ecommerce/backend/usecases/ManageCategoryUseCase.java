package com.eagletech.ecommerce.backend.usecases;

import com.eagletech.ecommerce.backend.domain.model.Category;
import com.eagletech.ecommerce.backend.domain.port.ICategoryRepository;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.CategoryAlreadyExistsException;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.CategoryNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public class ManageCategoryUseCase {
    private final ICategoryRepository categoryRepository;

    public ManageCategoryUseCase(ICategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category saveCategory(Category category) {
        // Validar unicidad del nombre antes de guardar
        categoryRepository.findByNameIgnoreCase(category.getName()).ifPresent(existingCategory -> {
            if (category.getId() == null || !category.getId().equals(existingCategory.getId())) {
                throw new CategoryAlreadyExistsException("Ya existe una categoría con el nombre: " + category.getName());
            }
        });
        return categoryRepository.save(category);
    }

    public Category updateCategory(Integer id, Category category) {
        Category existingCategory = categoryRepository.findById(id);
        if (existingCategory == null) {
            throw new CategoryNotFoundException("Categoría con id: " + id + " no existe.");
        }

        // Validar unicidad del nombre para la actualización
        categoryRepository.findByNameIgnoreCase(category.getName()).ifPresent(foundCategory -> {
            if (!foundCategory.getId().equals(id)) {
                throw new CategoryAlreadyExistsException("Ya existe otra categoría con el nombre: " + category.getName());
            }
        });

        existingCategory.setName(category.getName());
        // Otros campos si los hubiera

        return categoryRepository.save(existingCategory);
    }

    public Page<Category> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Page<Category> searchCategories(String name, Pageable pageable) {
        return categoryRepository.findByNameContaining(name, pageable);
    }

    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id);
    }

    public void deleteCategoryById(Integer id) {
        categoryRepository.deleteById(id);
    }
}
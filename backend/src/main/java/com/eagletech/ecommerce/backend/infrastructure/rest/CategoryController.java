package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.domain.model.Category;
import com.eagletech.ecommerce.backend.usecases.ManageCategoryUseCase;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/categories")
@Slf4j
@CrossOrigin("http://localhost:4200")
public class CategoryController {
    private final ManageCategoryUseCase manageCategoryUseCase;

    public CategoryController(ManageCategoryUseCase manageCategoryUseCase) {
        this.manageCategoryUseCase = manageCategoryUseCase;
    }

    @PostMapping
    public ResponseEntity<Category> save(@RequestBody Category category) {
        return new ResponseEntity<>(manageCategoryUseCase.saveCategory(category), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Integer id, @RequestBody Category category) {
        return ResponseEntity.ok(manageCategoryUseCase.updateCategory(id, category));
    }

    @GetMapping
    public ResponseEntity<Page<Category>> findAll(
            @PageableDefault(size = 10, page = 0) Pageable pageable,
            @RequestParam(required = false) String name) {
        if (name != null && !name.isEmpty()) {
            return ResponseEntity.ok(manageCategoryUseCase.searchCategories(name, pageable));
        } else {
            return ResponseEntity.ok(manageCategoryUseCase.getAllCategories(pageable));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> findById(@PathVariable Integer id) {
        return ResponseEntity.ok(manageCategoryUseCase.getCategoryById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteById(@PathVariable Integer id) {
        manageCategoryUseCase.deleteCategoryById(id);
        return ResponseEntity.ok().build();
    }
}
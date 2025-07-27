package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.domain.model.Category;
import com.eagletech.ecommerce.backend.usecases.ManageCategoryUseCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin("http://localhost:4200")
public class PublicCategoryController {

    private final ManageCategoryUseCase manageCategoryUseCase;

    public PublicCategoryController(ManageCategoryUseCase manageCategoryUseCase) {
        this.manageCategoryUseCase = manageCategoryUseCase;
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
}

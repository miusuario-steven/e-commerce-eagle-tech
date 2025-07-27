package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

import com.eagletech.ecommerce.backend.domain.model.Category;
import com.eagletech.ecommerce.backend.domain.port.ICategoryRepository;
import com.eagletech.ecommerce.backend.infrastructure.mapper.CategoryMapper;
import com.eagletech.ecommerce.backend.infrastructure.web.exceptions.CategoryNotFoundException;

@Repository 
public class CategoryCrudRepositoryImpl implements ICategoryRepository{
    private final ICategoryCrudRepository iCategoryCrudRepository;
    private CategoryMapper categoryMapper;

    public CategoryCrudRepositoryImpl(ICategoryCrudRepository iCategoryCrudRepository, CategoryMapper categoryMapper) {
        this.iCategoryCrudRepository = iCategoryCrudRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public Category save(Category category) {
        return categoryMapper.toCategory( iCategoryCrudRepository.save(categoryMapper.toCategoryEntity(category)));
    }

    @Override
    public Page<Category> findAll(Pageable pageable) {
        return iCategoryCrudRepository.findAll(pageable).map(categoryMapper::toCategory);
    }

    @Override
    public Page<Category> findByNameContaining(String name, Pageable pageable) {
        return iCategoryCrudRepository.findByNameContaining(name, pageable).map(categoryMapper::toCategory);
    }

    @Override
    public Optional<Category> findByNameIgnoreCase(String name) {
        return iCategoryCrudRepository.findByNameIgnoreCase(name).map(categoryMapper::toCategory);
    }

    @Override
    public Category findById(Integer id) {
        return categoryMapper.toCategory(iCategoryCrudRepository.findById(id).orElseThrow(
            ()-> new CategoryNotFoundException("Categoria con id:"+id+ " no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iCategoryCrudRepository.findById(id).orElseThrow(
            ()-> new CategoryNotFoundException("Categoria con id: "+id+" no existe")
        );
        iCategoryCrudRepository.deleteById(id);
    }
}

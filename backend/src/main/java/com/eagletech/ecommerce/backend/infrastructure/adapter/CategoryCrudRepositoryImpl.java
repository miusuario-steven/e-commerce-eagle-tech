package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.stereotype.Repository;

import com.eagletech.ecommerce.backend.domain.model.Category;
import com.eagletech.ecommerce.backend.domain.port.ICategoryRepository;
import com.eagletech.ecommerce.backend.infrastructure.mapper.CategoryMapper;

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
    public Iterable<Category> findAll() {
        return categoryMapper.toCategoryList(iCategoryCrudRepository.findAll());    
    }

    @Override
    public Category findById(Integer id) {
        return categoryMapper.toCategory(iCategoryCrudRepository.findById(id).orElseThrow(
            ()-> new RuntimeException("Categoria con id:"+id+ "no existe")
        ));
    }

    @Override
    public void deleteById(Integer id) {
        iCategoryCrudRepository.findById(id).orElseThrow(
            ()-> new RuntimeException("producto con id: "+id+"no existe")
        );
        iCategoryCrudRepository.deleteById(id);
    }
}

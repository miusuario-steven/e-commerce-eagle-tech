package com.eagletech.ecommerce.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import com.eagletech.ecommerce.backend.domain.model.Category;
import com.eagletech.ecommerce.backend.infrastructure.entity.CategoryEntity;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mappings({
                @Mapping(source = "id", target = "id"),
                @Mapping(source = "name", target = "name"),
                @Mapping(source = "dateCreated", target = "dateCreated"),
                @Mapping(source = "dateUpdated", target = "dateUpdated")
            })
    Category toCategory(CategoryEntity categoryEntity);
    Iterable<Category> toCategoryList(Iterable<CategoryEntity> categoryEntities);
    
    @InheritInverseConfiguration
    CategoryEntity toCategoryEntity(Category category );
}


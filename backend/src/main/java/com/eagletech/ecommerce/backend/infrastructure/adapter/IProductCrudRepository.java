package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import com.eagletech.ecommerce.backend.infrastructure.entity.ProductEntity;

public interface IProductCrudRepository extends CrudRepository<ProductEntity, Integer>{

}

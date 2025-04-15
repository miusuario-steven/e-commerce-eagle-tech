package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.data.repository.CrudRepository;
import com.eagletech.ecommerce.backend.infrastructure.entity.ProductEntity;
import java.util.Optional;


public interface IProductCrudRepository extends CrudRepository<ProductEntity, Integer>{
    Optional<ProductEntity> findTopByOrderByIdDesc(); // Método para obtener el último producto agregado
}

package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.eagletech.ecommerce.backend.domain.model.Product;
import com.eagletech.ecommerce.backend.domain.port.IProductRepository;
import com.eagletech.ecommerce.backend.infrastructure.mapper.ProductMapper;
import lombok.AllArgsConstructor;

@Repository
@AllArgsConstructor 
public class ProductCrudRepositoryImpl implements IProductRepository{
    private final IProductCrudRepository iProductCrudRepository;
    private final ProductMapper productMapper;

    @Override
    public Product save(Product product) {
        return productMapper.toProduct(iProductCrudRepository.save(productMapper.toProductEntity(product)));
    }

    @Override
    public Iterable<Product> findALL() {
        return productMapper.toProductList(iProductCrudRepository.findAll());
    }

    @Override
    public Product findById(Integer id) {
        return productMapper.toProduct(iProductCrudRepository.findById(id).orElseThrow(
            ()->new RuntimeException("producto con id: "+id+"no se encuentra")
        ) );
    }

    @Override
    public void deleteById(Integer id) {
        iProductCrudRepository.findById(id).orElseThrow(
            ()->new RuntimeException("producto con id: \"+id+\"no se encuentra")  
        );
        iProductCrudRepository.deleteById(id); 
    }
    @Override
    public Optional<Product> findTopByOrderByIdDesc() {
        return iProductCrudRepository.findTopByOrderByIdDesc()
            .map(productMapper::toProduct);
}


}

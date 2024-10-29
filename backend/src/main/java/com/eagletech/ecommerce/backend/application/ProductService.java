package com.eagletech.ecommerce.backend.application;

import com.eagletech.ecommerce.backend.domain.model.Product;
import com.eagletech.ecommerce.backend.domain.port.IProductRepository;

public class ProductService {
    private final IProductRepository iProductRepository;

    public ProductService(IProductRepository iProductRepository) {
        this.iProductRepository = iProductRepository;
    }

    public Product save(Product product){
        return this.iProductRepository.save(product);
    }

    public Iterable<Product> findALL(){
        return this.iProductRepository.findALL();
    }

    public Product findById(Integer id){
        return this.iProductRepository.findById(id);
    }
    public void deleteById(Integer id){
        this.iProductRepository.deleteById(id);
    }
}

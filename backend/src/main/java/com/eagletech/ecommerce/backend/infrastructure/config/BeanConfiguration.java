package com.eagletech.ecommerce.backend.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.eagletech.ecommerce.backend.application.CategoryService;
import com.eagletech.ecommerce.backend.application.OrderService;
import com.eagletech.ecommerce.backend.application.ProductService;
import com.eagletech.ecommerce.backend.application.RegistrationService;
import com.eagletech.ecommerce.backend.application.UploadFile;
import com.eagletech.ecommerce.backend.application.UserService;
import com.eagletech.ecommerce.backend.domain.port.ICategoryRepository;
import com.eagletech.ecommerce.backend.domain.port.IOrderRepository;
import com.eagletech.ecommerce.backend.domain.port.IProductRepository;
import com.eagletech.ecommerce.backend.domain.port.IUserRepository;

@Configuration

public class BeanConfiguration {
    @Bean
    public UserService userService(IUserRepository iUserRepository){
        return new UserService(iUserRepository);
    }
    @Bean
    public CategoryService categoryService(ICategoryRepository iCategoryRepository){
        return new CategoryService(iCategoryRepository);  
    }
    @Bean
    public ProductService productService(IProductRepository iProductRepository,UploadFile uploadFile){
        return new ProductService(iProductRepository, uploadFile);
    }
    @Bean
    public OrderService orderService(IOrderRepository IOrderRepository){
        return new OrderService(IOrderRepository);
    }
    @Bean
    public UploadFile uploadFile(){
        return new UploadFile();
    }
    @Bean
    public RegistrationService registrationService(IUserRepository iUserRepository){
        return new RegistrationService(iUserRepository);
    }

}

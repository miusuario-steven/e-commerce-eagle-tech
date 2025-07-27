package com.eagletech.ecommerce.backend.infrastructure.config;

import com.eagletech.ecommerce.backend.domain.port.ICategoryRepository;
import com.eagletech.ecommerce.backend.domain.port.IUserRepository;
import com.eagletech.ecommerce.backend.usecases.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class BeanConfiguration {

    @Value("${paypal.clientId}")
    private String clientId;
    @Value("${paypal.clientSecret}")
    private String clientSecret;
    @Value("${paypal.mode}")
    private String mode;

    @Bean
    public APIContext apiContext() throws PayPalRESTException {
        APIContext apiContext = new APIContext(clientId, clientSecret, mode);
        return apiContext;
    }

    @Bean
    public ManageUserUseCase manageUserUseCase(IUserRepository iUserRepository){
        return new ManageUserUseCase(iUserRepository);
    }

    @Bean
    public ManageCategoryUseCase manageCategoryUseCase(ICategoryRepository iCategoryRepository){
        return new ManageCategoryUseCase(iCategoryRepository);
    }

    

    // Se elimina la creación manual de ManageOrderUseCase, ahora es un @Service.

    @Bean
    public ImageStorageService imageStorageService(){
        return new ImageStorageService();
    }

    @Bean
    public RegisterUserUseCase registerUserUseCase(IUserRepository iUserRepository, BCryptPasswordEncoder passwordEncoder){
        return new RegisterUserUseCase(iUserRepository, passwordEncoder);
    }

}

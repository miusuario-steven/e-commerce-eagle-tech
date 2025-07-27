package com.eagletech.ecommerce.backend.infrastructure.config;

import com.eagletech.ecommerce.backend.infrastructure.mapper.IOrderMapper;
import com.eagletech.ecommerce.backend.infrastructure.mapper.IOrderProductMapper;
import com.eagletech.ecommerce.backend.infrastructure.mapper.ProductMapper;
import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfiguration {

    // El ProductMapper de DTO es un @Component, no necesita un @Bean aquí.

    @Bean
    public IOrderProductMapper iOrderProductMapper() {
        return Mappers.getMapper(IOrderProductMapper.class);
    }

    @Bean
    public IOrderMapper iOrderMapper() {
        // MapStruct inyectará la dependencia de IOrderProductMapper automáticamente
        // porque está disponible en el contexto de la aplicación a través del @Bean de arriba.
        return Mappers.getMapper(IOrderMapper.class);
    }

    @Bean
    public ProductMapper productEntityMapper() { // Renombrado para claridad
        return Mappers.getMapper(ProductMapper.class);
    }
}

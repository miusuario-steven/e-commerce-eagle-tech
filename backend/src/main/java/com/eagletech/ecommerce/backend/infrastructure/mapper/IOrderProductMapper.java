package com.eagletech.ecommerce.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import com.eagletech.ecommerce.backend.domain.model.OrderProduct;
import com.eagletech.ecommerce.backend.infrastructure.entity.OrdenProductEntity;


@Mapper(componentModel = "spring")
public interface IOrderProductMapper {
    @Mappings(
        {
            @Mapping(source = "id", target = "id"),
            @Mapping(source = "quantity", target = "quantity"),
            @Mapping(source = "price", target = "price"),
            @Mapping(source = "productId", target = "productId"),
            @Mapping(source = "orderEntity", target = "orderEntity")
        }
    )
    OrderProduct tOrderProduct(OrdenProductEntity ordenProductEntity);
    Iterable<OrderProduct> toOrderProductList(Iterable<OrdenProductEntity> orderProductEntities);

    @InheritInverseConfiguration
    @Mappings({
        @Mapping(source = "orderEntity", target = "orderEntity")
    })
    OrdenProductEntity toOrdenProductEntity(OrderProduct orderProduct);
}
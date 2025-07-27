package com.eagletech.ecommerce.backend.infrastructure.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import com.eagletech.ecommerce.backend.domain.model.Order;
import com.eagletech.ecommerce.backend.infrastructure.entity.OrderEntity;

@Mapper(uses = {IOrderProductMapper.class, IUserMapper.class})
public interface IOrderMapper {
    @Mappings(
        {
            @Mapping(source = "id", target = "id"),
            @Mapping(source = "dateCreated", target = "dateCreated"),
            @Mapping(source = "orderProducts", target = "orderProducts"),
            @Mapping(source = "orderState", target = "orderState"),
            @Mapping(source = "total", target = "total"),
            @Mapping(source = "userEntity", target = "user"),
        }
    )

    Order toOrder(OrderEntity orderEntity);
    Iterable<Order> toOrderList(Iterable<OrderEntity> orderEntities);  
    
    @InheritInverseConfiguration
    @Mapping(target = "userEntity", source = "user")
    OrderEntity toOrderEntity(Order order);

}

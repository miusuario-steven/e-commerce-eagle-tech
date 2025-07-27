package com.eagletech.ecommerce.backend.infrastructure.mapper;

import com.eagletech.ecommerce.backend.domain.model.Order;
import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.infrastructure.rest.dto.CustomerDTO;
import com.eagletech.ecommerce.backend.infrastructure.rest.dto.OrderSummaryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IAdminOrderMapper {

    CustomerDTO toCustomerDTO(User user);

    @Mapping(source = "user", target = "customer")
    OrderSummaryDTO toOrderSummaryDTO(Order order);
}

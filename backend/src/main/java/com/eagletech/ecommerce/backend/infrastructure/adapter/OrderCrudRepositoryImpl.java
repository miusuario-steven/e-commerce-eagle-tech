package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.eagletech.ecommerce.backend.domain.model.Order;
import com.eagletech.ecommerce.backend.domain.model.OrderState;
import com.eagletech.ecommerce.backend.domain.port.IOrderRepository;    
import com.eagletech.ecommerce.backend.infrastructure.entity.OrderEntity;
import com.eagletech.ecommerce.backend.infrastructure.entity.UserEntity;
import com.eagletech.ecommerce.backend.infrastructure.mapper.IOrderMapper;

@Repository
public class OrderCrudRepositoryImpl implements IOrderRepository {

    private final IOrderMapper iOrderMapper;
    private final IOrderCrudRepository iOrderCrudRepository;

    public OrderCrudRepositoryImpl(IOrderMapper iOrderMapper, IOrderCrudRepository iOrderCrudRepository) {
        this.iOrderMapper = iOrderMapper;
        this.iOrderCrudRepository = iOrderCrudRepository;
    }

    @Override
    public Order save(Order order) {
        OrderEntity orderEntity = iOrderMapper.toOrderEntity(order);

        orderEntity.getOrderProducts().forEach(
            orderProductEntity -> orderProductEntity.setOrderEntity(orderEntity)
        );


        return iOrderMapper.toOrder(iOrderCrudRepository.save(orderEntity));
    }

    @Override
    public Order findById(Integer id) {
        return iOrderMapper.toOrder(iOrderCrudRepository.findById(id).orElseThrow(
            ()-> new RuntimeException("Orden con id: "+ id + "no encontrada")
        ));
    }

    @Override
    public Page<Order> findAll(Pageable pageable) {
        return iOrderCrudRepository.findAllWithUser(pageable).map(iOrderMapper::toOrder);
    }

    @Override
    public Page<Order> findByUserId(Integer userId, Pageable pageable) {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId); 
        Page<OrderEntity> orderEntitiesPage = iOrderCrudRepository.findByUserEntityWithProducts(userEntity, pageable);
        return orderEntitiesPage.map(iOrderMapper::toOrder);
    }

    @Override
    public void updateStateById(Integer id, String state) {
        OrderState orderStateEnum = OrderState.valueOf(state);
        iOrderCrudRepository.updateStateById(id, orderStateEnum);
    }

}


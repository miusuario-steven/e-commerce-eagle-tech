package com.eagletech.ecommerce.backend.infrastructure.adapter;

import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.domain.port.IUserRepository;
import com.eagletech.ecommerce.backend.infrastructure.mapper.UserMapper;

@Repository

public class UserCrudRepositoryImpl implements IUserRepository {
    private final IUserCrudRepository iUserCrudRepository;
    private final UserMapper userMapper;
    
    public UserCrudRepositoryImpl(IUserCrudRepository iUserCrudRepository, UserMapper userMapper) {
        this.iUserCrudRepository = iUserCrudRepository;
        this.userMapper = userMapper;
    }

    @Override
    public User save(User user) {
        return userMapper.toUser(iUserCrudRepository.save( userMapper.toUserEntity(user) ));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return iUserCrudRepository.findByEmail(email).map(userMapper::toUser);
    }

    @Override
    public Optional<User> findById(Integer id) {
        return iUserCrudRepository.findById(id).map(userMapper::toUser);
    }

}

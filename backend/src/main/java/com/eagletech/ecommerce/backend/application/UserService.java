package com.eagletech.ecommerce.backend.application;

import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.domain.port.IUserRepository;

public class UserService {
    private final IUserRepository iUserRepository;

    public UserService(IUserRepository iUserRepository) {
        this.iUserRepository = iUserRepository;
    }

    public User save (User user){
        return  this.iUserRepository.save(user);  
    }
    public User findById (Integer id){
        return this.iUserRepository.findById(id);
    }

    public User findByEmail (String email){
        return this.iUserRepository.findByEmail(email);
    }
}

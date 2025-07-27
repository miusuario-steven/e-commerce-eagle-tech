package com.eagletech.ecommerce.backend.infrastructure.rest;

import com.eagletech.ecommerce.backend.domain.model.User;
import com.eagletech.ecommerce.backend.usecases.ManageUserUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final ManageUserUseCase manageUserUseCase;

    public UserController(ManageUserUseCase manageUserUseCase) {
        this.manageUserUseCase = manageUserUseCase;
    }

    @PutMapping
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        return ResponseEntity.ok(manageUserUseCase.updateUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(manageUserUseCase.getUserById(id));
    }

    @GetMapping("/by-email")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        return ResponseEntity.ok(manageUserUseCase.getUserByEmail(email));
    }
}
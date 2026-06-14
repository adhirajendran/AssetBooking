package com.antigravity.booking.controller;

import com.antigravity.booking.dto.LoginRequest;
import com.antigravity.booking.model.User;
import com.antigravity.booking.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(loginRequest.getPassword())) {
            // For demo MVP returning raw user, in prod return JWT
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}

package com.skillup.skillup.features.auth.controller;

import com.skillup.skillup.features.auth.dto.LoginRequest;
import com.skillup.skillup.features.auth.dto.LoginResponse;
import com.skillup.skillup.features.auth.dto.LoginResponse;
import com.skillup.skillup.features.auth.dto.RegisterRequest;
import com.skillup.skillup.features.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.authenticate(request);
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return "Registration successful";
    }
}
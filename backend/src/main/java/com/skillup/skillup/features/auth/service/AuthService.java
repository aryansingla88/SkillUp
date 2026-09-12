package com.skillup.skillup.features.auth.service;

import com.skillup.skillup.common.security.JwtService;
import com.skillup.skillup.features.auth.dto.LoginRequest;
import com.skillup.skillup.features.auth.dto.LoginResponse;
import com.skillup.skillup.features.auth.dto.RegisterRequest;
import com.skillup.skillup.features.auth.entity.User;
import com.skillup.skillup.features.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse authenticate(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(token, user.getRole());
    }

    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("CANDIDATE")
                .createdAt(java.time.LocalDateTime.now())
                .build();

        userRepository.save(user);
    }
}
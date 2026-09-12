package com.skillup.skillup.common.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public Long getCurrentUserId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        Jwt jwt = (Jwt) authentication.getPrincipal();

        Number userId = jwt.getClaim("userId");

        if (userId == null) {
            throw new IllegalStateException("User ID not found in JWT");
        }

        return userId.longValue();
    }
}
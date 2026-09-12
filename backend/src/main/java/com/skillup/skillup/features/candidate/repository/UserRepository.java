package com.skillup.skillup.features.candidate.repository;

import com.skillup.skillup.features.candidate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {}

package com.project.videomeetbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.videomeetbackend.model.User;

import lombok.NonNull;

import java.util.Optional;


// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findById(@NonNull Integer id);
}
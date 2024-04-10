package com.project.videomeetbackend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.videomeetbackend.model.User;
import com.project.videomeetbackend.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, String> userDetails) {
        try {
            String email = userDetails.get("email");
            String password = userDetails.get("password");

            // Check if user with the provided email already exists
            if (userRepository.existsByEmail(email)) {
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("status", "error");
                responseBody.put("message", "User with this email already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(responseBody);
            }

            // Create new user
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(password);
            User savedUser = userRepository.save(newUser);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", "success");
            responseBody.put("data", savedUser);
            responseBody.put("message", "User registered successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
        } catch (DataIntegrityViolationException e) {
            // Handle unique constraint violation (e.g., duplicate email)
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", "error");
            responseBody.put("message", "User with the provided email already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(responseBody);
        } catch (Exception e) {
            // Handle other exceptions
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", "error");
            responseBody.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, String> loginDetails) {
        try {
            String email = loginDetails.get("email");
            String password = loginDetails.get("password");

            // Find user by email
            User user = userRepository.findByEmail(email);

            if (user == null) {
                // Handle case where no user is found
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("status", "error");
                responseBody.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseBody);
            }

            // Check if password matches
            if (!Objects.equals(password, user.getPassword())) {
                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("status", "error");
                responseBody.put("message", "Incorrect password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
            }

            // Password matches, user logged in successfully
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", "success");
            responseBody.put("data", user);
            responseBody.put("message", "Logged in successfully");
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            // Handle other exceptions
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("status", "error");
            responseBody.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
        }
    }
}

package com.project.videomeetbackend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.videomeetbackend.model.User;
import com.project.videomeetbackend.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Validated
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody RegistrationRequest request) {
        try {
            String email = request.getEmail();
            String password = request.getPassword();

            // Check if user with the provided email already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(buildErrorResponse("User with this email already exists"));
            }

            // Create new user
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(password); // Ideally, should hash the password
            User savedUser = userRepository.save(newUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(buildSuccessResponse("User registered successfully", savedUser));
        } catch (DataIntegrityViolationException e) {
            // Handle unique constraint violation (e.g., duplicate email)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(buildErrorResponse("User with the provided email already exists"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            String email = request.getEmail();
            String password = request.getPassword();

            // Find user by email
            User user = userRepository.findByEmail(email);

            if (user == null || !Objects.equals(password, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(buildErrorResponse("Invalid email or password"));
            }

            return ResponseEntity.ok(buildSuccessResponse("Logged in successfully", user));
        } catch (Exception e) {
            // Handle other exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(buildErrorResponse("An error occurred: " + e.getMessage()));
        }
    }

    private Map<String, Object> buildSuccessResponse(String message, User data) {
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status", "success");
        responseBody.put("data", data);
        responseBody.put("message", message);
        return responseBody;
    }

    private Map<String, Object> buildErrorResponse(String errorMessage) {
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("status", "error");
        responseBody.put("message", errorMessage);
        return responseBody;
    }

    static class RegistrationRequest {
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    static class LoginRequest {
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}

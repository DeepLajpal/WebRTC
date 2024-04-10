package com.project.videomeetbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.videomeetbackend.model.Meeting;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository

public interface MeetingRepository extends JpaRepository<Meeting, Integer> {
}
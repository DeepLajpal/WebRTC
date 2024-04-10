package com.project.videomeetbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.videomeetbackend.model.Participant;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository

public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
}

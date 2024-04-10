package com.project.videomeetbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Positive;

import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "meetings")
@Entity
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer meetingId;

    @NotNull(message = "Shareable Meeting Id cannot be null")
    @Positive(message = "Shareable Meeting Id should be positive")
    @Column(name = "shareable_meeting_id")
    private Integer shareableMeetingId;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Participant> participants;
    // Custom logic to generate 8-digit random ID
    @PrePersist
    private void generateRandomMeetingId() {
        // Generate an 8-digit random ID
        Random random = new Random();
        int min = 10000000; // Minimum 8-digit number
        int max = 99999999; // Maximum 8-digit number
        this.shareableMeetingId = random.nextInt(max - min + 1) + min;
    }

}

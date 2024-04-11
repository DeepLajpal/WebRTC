package com.project.videomeetbackend.dto;

import com.project.videomeetbackend.model.Meeting;
import com.project.videomeetbackend.model.Participant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingCreationResponseDTO {
    Meeting meeting;
    Participant participant;
}
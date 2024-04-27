package com.project.videomeetbackend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.json.JSONObject;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.project.videomeetbackend.model.Meeting;
import com.project.videomeetbackend.model.User;
import com.project.videomeetbackend.repository.MeetingRepository;
import com.project.videomeetbackend.repository.ParticipantRepository;
import com.project.videomeetbackend.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
class VideoMeetBackendApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private UserRepository userRepository;

	@MockBean
	private MeetingRepository meetingRepository;

	@MockBean
	private ParticipantRepository participantRepository;

	@Test
	void testRegisterUser() throws Exception {
		// Mocking UserRepository response
		when(userRepository.existsByEmail(Mockito.anyString())).thenReturn(false);

		// Performing POST request to register a user
		MvcResult result = mockMvc.perform(post("/api/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{
						"firstName": "testFirstName",
						"lastName": "testLastName",
						"email": "testEmail",
						"password": "testPassword"}
						"""))
				.andExpect(status().isCreated())
				.andReturn();

		// Parse response body as JSON
		String responseBody = result.getResponse().getContentAsString();
		JSONObject json = new JSONObject(responseBody);

		// Extract message property
		String message = json.getString("message");

		// Assertion
		assertEquals("User registered successfully", message);
	}

	@Test
	void testLoginUser() throws Exception {
		// Mocking UserRepository response
		User user = new User(); // Create a specific user object
		user.setEmail("testEmail");
		user.setPassword("testPassword");
		when(userRepository.findByEmail(Mockito.anyString())).thenReturn(user);

		MvcResult result = mockMvc.perform(post("/api/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"email": "testEmail",
						 "password": "testPassword"}"""))
				.andExpect(status().isOk())
				.andReturn();

		// Parse response body as JSON
		String responseBody = result.getResponse().getContentAsString();
		JSONObject json = new JSONObject(responseBody);

		// Extract message property
		String message = json.getString("message");

		// Assertion
		assertEquals("Logged in successfully", message);
	}

	@Test
	void testCreateMeeting() throws Exception {
		// Mocking UserRepository response
		User user = new User(); // Create a specific user object
		when(userRepository.findById(Mockito.any())).thenReturn(Optional.of(user));

		MvcResult result = mockMvc.perform(post("/api/createMeeting")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"userId": "1"}"""))
				.andExpect(status().isCreated())
				.andReturn();

		// Parse response body as JSON
		String responseBody = result.getResponse().getContentAsString();
		JSONObject json = new JSONObject(responseBody);

		// Extract message property
		String message = json.getString("message");

		// Assertion
		assertEquals("Meeting created successfully", message);
	}

	 @Test
    void testJoinMeeting() throws Exception {
        // Mocking UserRepository and MeetingRepository responses
        User user = new User(); // Create a specific user object
        Meeting meeting = new Meeting(); // Create a specific meeting object
        when(userRepository.findById(Mockito.any())).thenReturn(Optional.of(user));
        when(meetingRepository.findByShareableMeetingId(Mockito.any())).thenReturn(meeting);

        MvcResult result = mockMvc.perform(post("/api/joinMeeting")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"userId": "1", "shareableMeetingId": "123"}"""))
                .andExpect(status().isCreated())
                .andReturn();

        // Parse response body as JSON
        String responseBody = result.getResponse().getContentAsString();
        JSONObject json = new JSONObject(responseBody);

        // Extract message property
        String message = json.getString("message");

        // Assertion
        assertEquals("Joined meeting successfully", message);
    }
}

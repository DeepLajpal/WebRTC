package com.project.videomeetbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.project.videomeetbackend.config")
public class VideoMeetBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(VideoMeetBackendApplication.class, args);
	}

}

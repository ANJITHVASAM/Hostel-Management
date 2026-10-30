package com.hostel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;

@SpringBootApplication
public class HostelManagementApplication {

    public static void main(String[] args) {
        // Ensure data directory exists for H2 database before Spring Boot starts
        new File("./data").mkdirs();
        new File("/app/data").mkdirs();
        SpringApplication.run(HostelManagementApplication.class, args);
    }
}

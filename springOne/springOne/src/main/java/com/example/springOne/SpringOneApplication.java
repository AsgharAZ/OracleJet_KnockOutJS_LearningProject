package com.example.springOne;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//SpringBootConfiguration sets up configuration,
//
//EnableAutoConfiguration  auto-configures things based on dependencies,
//
//ComponentScan scans for components (controllers, services, etc.) automatically.
@SpringBootApplication
public class SpringOneApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringOneApplication.class, args);
    }
}

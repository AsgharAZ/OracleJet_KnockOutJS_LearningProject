package com.example.springOne;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringOneApplication {

    //We have to inject
//    private final CustomerRepository customerRepository;
//
//    public SpringOneApplication(CustomerRepository customerRepository) {
//        this.customerRepository = customerRepository;
//    }

    //
    public static void main(String[] args) {
        SpringApplication.run(SpringOneApplication.class, args);
    }
}

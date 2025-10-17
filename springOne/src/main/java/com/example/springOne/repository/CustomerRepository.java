package com.example.springOne.repository;

import com.example.springOne.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository
    extends JpaRepository <Customer, Long> {

}
package com.example.springOne.repository;

import com.example.springOne.entity.Account;
import com.example.springOne.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository
        extends JpaRepository <Account, Long> {

    List<Account> findByCustomerId(Long customerId);

    boolean existsByCustomerAndAccountType(Customer customer, int account_type);
}
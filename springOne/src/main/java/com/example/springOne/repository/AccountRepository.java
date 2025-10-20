package com.example.springOne.repository;

import com.example.springOne.dto.AccountSummaryDTO;
import com.example.springOne.entity.Account;
import com.example.springOne.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByCustomerId(Long customerId);

    boolean existsByCustomerAndAccountType(Customer customer, int accountType);

    Optional<Account> findByIban(String iban);

    // ✅ Use correct property names
    @Query("""
        SELECT new com.example.springOne.dto.AccountSummaryDTO(
            c.id, c.username, c.name, a.account_number, a.accountType
        )
        FROM Account a
        JOIN a.customer c
        WHERE c.id = :cnic
    """)
    List<AccountSummaryDTO> findAccountSummaryByCnic(@Param("cnic") Long cnic);

    // ✅ Custom query to find username by CNIC and account number
    @Query("""
        SELECT c.username
        FROM Account a
        JOIN a.customer c
        WHERE c.id = :cnic AND a.account_number = :accountNumber
    """)
    String findUsernameByCnicAndAccountNumber(@Param("cnic") Long cnic,
                                              @Param("accountNumber") Long accountNumber);
}

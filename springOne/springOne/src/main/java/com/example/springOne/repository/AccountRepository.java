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

    // JPQL - different than PSQL being used here. Object-O
    // Hibernate will turn to SQL in runtime.

    // SELECT new - This projects the query results directly into a AccountSummaryDTO object
    // This is a powerful feature for fetching specific data
    // and avoiding the overhead of fetching entire entity objects.
    //Creates a new DTO object

    //JOIN a.customer c → joins with the associated Customer entity
    // (based on the relationship defined in your Account entity).
    //FROM account a
    //JOIN customer c ON a.customer_id = c.id
    
    //: is a paramater placeholder (different from positional placeholder)
    //
    @Query("""
        SELECT new com.example.springOne.dto.AccountSummaryDTO(
            c.id, c.username, c.name, a.account_number, a.accountType
        )
        FROM Account a
        JOIN a.customer c
        WHERE c.id = :cnic
    """)
    //c.id = ? -> SQL equivalent, filled in run time.
    //“Find all accounts where the associated customer’s ID equals the CNIC value provided.”
    List<AccountSummaryDTO> findAccountSummaryByCnic(@Param("cnic") Long cnic);

    // Custom query to find username by CNIC and account number
    @Query("""
        SELECT c.username
        FROM Account a
        JOIN a.customer c
        WHERE c.id = :cnic AND a.account_number = :accountNumber
    """)
    String findUsernameByCnicAndAccountNumber(@Param("cnic") Long cnic,
                                              @Param("accountNumber") Long accountNumber);

    @Query("SELECT a.customer.username FROM Account a WHERE a.iban = :iban AND a.customer.id = :cnic")
    String findUsernameByIbanAndCnic(@Param("iban") String iban, @Param("cnic") Long cnic);

}

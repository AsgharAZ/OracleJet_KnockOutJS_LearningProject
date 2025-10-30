package com.example.springOne.controller;

import com.example.springOne.dto.AccountSummaryDTO;
import com.example.springOne.entity.Account;
import com.example.springOne.entity.Customer;
import com.example.springOne.repository.AccountRepository;
import com.example.springOne.repository.CustomerRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@RestController is designed to return data (e.g., JSON or XML) directly as the HTTP response body.
@RestController
@RequestMapping("api/v1/accounts") //maps HTTP requests to controller methods.
public class AccountController {

    //constructor-based dependency injection (interfaces for database access)
    //final = must be initialized only once.
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    //Spring automatically injects (passes) the actual implementations of these repositories when creating the AccountController bean.
    //Your class only focuses on what it needs to do, not how to get what it needs, Loose Coupling, testability.
    public AccountController(AccountRepository accountRepository, CustomerRepository customerRepository) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
    }

    // Getting All Accounts, Not used.
    @GetMapping
    public List<Account> getAccounts() {
        return accountRepository.findAll(); //sends that list back as a JSON response to the client.
    }

    // GET accounts by customer id (optional helper endpoint)
    @GetMapping("/customer/{customerId}")
    public List<Account> getAccountsByCustomer(@PathVariable("customerId") Long customerId) {
        return accountRepository.findByCustomerId(customerId);
    }

    // DTO (Record) for POST request, different than AccountSummaryDTO file, where DTO serves the purpose of GETTING
    // Data Transfer Object
    record NewAccountRequest(
            Long account_number,
            Long customer_id,
            int account_type,
            String iban,
            boolean digitally_active
    ) {}

    // CREATE Account
    @PostMapping
    //Spring automatically deserializes the JSON body of the incoming request into a NewAccountRequest record instance.
    public String addAccount(@RequestBody NewAccountRequest request) {
        // Find the customer first (foreign key validation)
        Customer customer = customerRepository.findById(request.customer_id())
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + request.customer_id())); //preventing orphaned account creation (foreign key integrity).

        // Check if account of same type already exists for this customer
        boolean exists = accountRepository.existsByCustomerAndAccountType(customer, request.account_type());
        if (exists) {
            return "This customer already has an account of this type!";
        }

        // Create and save new account
        Account account = new Account();
        account.setAccount_number(request.account_number());
        account.setCustomer(customer);
        account.setAccount_type(request.account_type());
        account.setIban(request.iban());
        account.setDigitally_active(request.digitally_active());

        //catch block
        //Purpose: Handles exceptions thrown in the try block so your program doesn’t crash.
        try {
            //Put Proper HTTP RESPONSE LATER!
            accountRepository.save(account);
            return " Account created successfully!";
        } catch (DataIntegrityViolationException ex) {
            // This will catch any DB constraint violation (like IBAN or account number duplicate)
            return " Database constraint violation: " + ex.getMostSpecificCause().getMessage();
        }
    }

    // NOT USED, DELETE account by account_number
    @DeleteMapping("{accountNumber}")
    public String deleteAccount(@PathVariable("accountNumber") Long accountNumber) {
        accountRepository.deleteById(accountNumber);
        // Convert this to HTTP RESPONSE
        return "Account deleted successfully!";
    }

    // UPDATE account (e.g., change type, IBAN, or digitally_active)
    @PutMapping
    public String updateAccount(@RequestBody Account accountUpdate) {
        Account existingAccount = accountRepository.findById(accountUpdate.getAccount_number())
                .orElseThrow(() -> new RuntimeException("Account not found with number: " + accountUpdate.getAccount_number()));

        existingAccount.setAccount_type(accountUpdate.getAccount_type());
        existingAccount.setIban(accountUpdate.getIban());
        existingAccount.setDigitally_active(accountUpdate.isDigitally_active());

        accountRepository.save(existingAccount);
        return " Account updated successfully!";
    }



    // VALIDATE ACCOUNT NUMBER WITH CNIC - New endpoint for frontend validation
    @GetMapping("/validate/{accountNumber}/{cnic}")
    public ValidationResponse validateAccountWithCNIC(@PathVariable("accountNumber") Long accountNumber, @PathVariable("cnic") Long cnic) {
        try {
            Account account = accountRepository.findById(accountNumber).orElse(null);

            if (account == null) {
                return new ValidationResponse("ERROR", "Account number not found in database", false);
            }

            // Check if account belongs to the provided CNIC
            if (!account.getCustomer().getId().equals(cnic)) {
                return new ValidationResponse("ERROR", "Account number does not belong to the provided CNIC", false);
            }

            return new ValidationResponse("SUCCESS", "Account number verified successfully", true);
        } catch (Exception e) {
            return new ValidationResponse("ERROR", "Error validating account number: " + e.getMessage(), false);
        }

    }

    // VALIDATE IBAN WITH CNIC - New endpoint for frontend validation
    @GetMapping("/validate/iban/{iban}/{cnic}")
    public ValidationResponse validateIbanWithCNIC(@PathVariable("iban") String iban, @PathVariable("cnic") Long cnic) {
        try {
            // Find the account by IBAN
            Account account = accountRepository.findByIban(iban).orElse(null);

            if (account == null) {
                return new ValidationResponse("ERROR", "IBAN not found in database", false);
            }


            // Check if account belongs to the provided CNIC
            if (!account.getCustomer().getId().equals(cnic)) {
                return new ValidationResponse("ERROR", "IBAN does not belong to the provided CNIC", false);
            }

            return new ValidationResponse("SUCCESS", "IBAN verified successfully", true);

        } catch (Exception e) {
            return new ValidationResponse("ERROR", "Error validating IBAN: " + e.getMessage(), false);
        }
    }
    @GetMapping("/summary/{cnic}")
    public ResponseEntity<?> getAccountSummary(@PathVariable("cnic") Long cnic) {
        List<AccountSummaryDTO> summary = accountRepository.findAccountSummaryByCnic(cnic);
        if (summary.isEmpty()) {
            return ResponseEntity.status(404).body("No accounts found for CNIC: " + cnic);
        }
        return ResponseEntity.ok(summary);
    }

    record UsernameResponse(String username, String message) {}


    @GetMapping("/username/by-account/{cnic}/{accountNumber}")
    public ResponseEntity<?> getUsernameByCnicAndAccount(
            @PathVariable Long cnic,
            @PathVariable Long accountNumber) {

        String username = accountRepository.findUsernameByCnicAndAccountNumber(cnic, accountNumber);

        if (username == null) {
            return ResponseEntity.status(404).body("No user found for given CNIC and account number");
        }
        return ResponseEntity.ok(username);
    }

    @GetMapping("/username/by-iban/{iban}/{cnic}")
    public ResponseEntity<?> getUsernameByIbanAndCnic(
            @PathVariable String iban,
            @PathVariable Long cnic) {

        String username = accountRepository.findUsernameByIbanAndCnic(iban, cnic);

        if (username == null) {
            return ResponseEntity.status(404).body("No user found for given IBAN and CNIC");
        }
        return ResponseEntity.ok(username);
    }



    // Validation response record
    record ValidationResponse(
            String statusCode,
            String message,
            boolean isValid
    ) {}
}

package com.example.springOne.dto;

// DTO pattern is a best practice for creating specialized API responses
// that match frontend requirements while maintaining clean separation between domain models and API contracts.
public class AccountSummaryDTO {
    private Long cnic;
    private String username;
    private String name;
    private Long accountNumber;
    private int accountType;

//    public AccountSummaryDTO(Long cnic, String username, String name, Long accountNumber, int accountType) {
//        this.cnic = cnic;
//        this.username = username;
//        this.name = name;
//        this.accountNumber = accountNumber;
//        this.accountType = accountType;
//    }

    // Getters
    public Long getCnic() { return cnic; }
    public String getUsername() { return username; }
    public String getName() { return name; }
    public Long getAccountNumber() { return accountNumber; }
    public int getAccountType() { return accountType; }
}

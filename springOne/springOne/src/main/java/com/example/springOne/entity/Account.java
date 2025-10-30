package com.example.springOne.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.Objects;


//The entity is a plain Java object (POJO) that represents a table in your database.
// You define the fields and relationships using JPA annotations.

@Entity
//Represents a table in the database.
//Each instance of the entity corresponds to a row.

//tells JPA (and your database) to enforce a composite uniqueness constraint.
//One user cannot have two accounts with the same account_type
@Table(
        name = "accounts",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"User_id", "Account_type"})
        }
)


public class Account {
    // Defining Primary Key
    /// Following is the bare minimum that you need so that class is mapped onto the database
    @Id
    @Digits(integer = 14, fraction = 0)
    @Min(10000000000000L)   // 10^13, so that's the smallest 14-digit number
    @Max(99999999999999L)   // up to the largest 14-digit number
    @Column(name = "Account_number", unique = true, nullable = false)
    private Long account_number;

    // 👇 Foreign Key mapping to users(ID)
    @ManyToOne
    @JoinColumn(name = "User_id", referencedColumnName = "Id")
    private Customer customer;

    @Column(name = "Account_type", nullable = false)
    @Min(value = 1, message = "Level must be at least 1")
    @Max(value = 5, message = "Level can be at most 5")
    private int accountType;

    @Column(name = "Iban", length = 34, unique = true, nullable = false)
    @Size(min = 14, max = 34, message = "IBAN must be between 14 and 34 characters long")
    @Pattern(
            regexp = "^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$",
            message = "IBAN must start with 2 letters (country code), followed by 2 digits (check digits), then 10–30 alphanumeric characters"
    )
    private String iban;

    @PrePersist //automatically before the entity is inserted (saved for the first time)
    @PreUpdate //Runs automatically before an existing entity is updated
    //regex is a pattern matching language
    private void formatIban() {
        if (iban != null) {
            iban = iban.toUpperCase().replaceAll("\\s+", ""); // normalize case and remove spaces
        }
    }

    @Column(name = "Digitally_active", nullable = false) //Either False or True
    private boolean digitally_active;

    public Account(){

    }

    public Long getAccount_number() {
        return account_number;
    }

    public void setAccount_number(Long account_number) {
        this.account_number = account_number;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public int getAccount_type() {
        return accountType;
    }

    public void setAccount_type(int account_type) {
        this.accountType = account_type;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public boolean isDigitally_active() {
        return digitally_active;
    }

    public void setDigitally_active(boolean digitally_active) {
        this.digitally_active = digitally_active;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Account account = (Account) o;
        return accountType == account.accountType && digitally_active == account.digitally_active && Objects.equals(account_number, account.account_number) && Objects.equals(customer, account.customer) && Objects.equals(iban, account.iban);
    }

    //quickly locate objects.
    @Override
    public int hashCode() {
        return Objects.hash(account_number, customer, accountType, iban, digitally_active);
    }

    @Override
    public String toString() {
        return "Account{" +
                "account_number=" + account_number +
                ", customer=" + customer +
                ", account_type=" + accountType +
                ", iban='" + iban + '\'' +
                ", digitally_active=" + digitally_active +
                '}';
    }
}




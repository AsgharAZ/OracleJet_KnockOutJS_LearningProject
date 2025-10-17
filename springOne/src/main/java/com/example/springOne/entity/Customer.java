package com.example.springOne.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.Objects;

@Entity
public class Customer {
    // Defining Primary Key
    /// Following is the bare minimum that you need so that class is mapped onto the database
    @Id
//    @SequenceGenerator(
//            name = "customer_id_sequence",
//            sequenceName = "customer_id_sequence"
//    )
//    @GeneratedValue(
//            strategy = GenerationType.SEQUENCE,
//            generator = "customer_id_sequence"
//    )
    /// //
    @Digits(integer = 13, fraction = 0)
    @Min(1000000000000L)   // 10^12, so that's the smallest 13-digit number
    @Max(9999999999999L)   // up to the largest 13-digit number
    @Column(name = "Id")
    private Long id;

    //Other fields
//    @Digits(integer = 14, fraction = 0)
//    @Min(10000000000000L)   // 10^13, so that's the smallest 14-digit number
//    @Max(99999999999999L)   // up to the largest 14-digit number
//    @Column(unique = true)
//    private Long account_number;
    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Username", unique = true, nullable = false)
    private String username;

    @Column(name = "Password", nullable = false)
    private String password;

    @Column(length = 13, name = "Phone Number", nullable = false)
    @Size(min = 13, max = 13, message = "Phone Numbers must be exactly 13 digits")
    private String phone_number;

    public Customer(Long id, String name, String phone_number, String username, String password) {
        this.id = id;
        this.name = name;
        this.phone_number = phone_number;
        this.username = username;
        this.password = password;
    }


    public Customer(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    // insert here


    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Customer customer = (Customer) o;
        return Objects.equals(id, customer.id) && Objects.equals(name, customer.name) && Objects.equals(username, customer.username) && Objects.equals(password, customer.password) && Objects.equals(phone_number, customer.phone_number);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, username, password, phone_number);
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", phone_number='" + phone_number + '\'' +
                '}';
    }
}




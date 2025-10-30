package com.example.springOne.controller;

import com.example.springOne.repository.CustomerRepository;
import org.springframework.web.bind.annotation.*;
import com.example.springOne.entity.Customer;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("api/v1/customers")
public class CustomerController {

    //Records are immutable data carriers that
    // automatically generate a constructor, getters, equals(), hashCode(), and toString()
    // API Response record for consistent JSON responses
    record ApiResponse(String statusCode, String message) {}

    //We have to inject
    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Customer> getCustomers() {
        return customerRepository.findAll();
//        return List.of();
    }

    /// ///
    ///
    record NewCustomerRequest(
            Long id,
            String name,
            String username,
            String password,
            String phone_number
    ){}

    @PostMapping
    public void addCustomer( @RequestBody NewCustomerRequest request){
        Customer customer = new Customer();
        customer.setId(request.id());
        customer.setName(request.name());
        customer.setPhone_number(request.phone_number());
        customer.setUsername(request.username());
        customer.setPassword(request.password());
        customerRepository.save(customer);

    }

    @DeleteMapping("{customerId}") //We need to map the {customerId} using @PathVariable
    //api/v1/customers/1
    //the id parameters is the "/1" at the end of the URL above
    //
    public void deleteCustomer(@PathVariable("customerId") Long id){
        //typically you would do business logic, like checking whether customer actualy
        //exists or not, but ignoring it to keep things straight-forward
        customerRepository.deleteById(id);
    }

    // DTO for password update requests
    record PasswordUpdateRequest(String password) {}

    //@RequestBody tells Spring to take the HTTP request body (usually JSON) and deserialize it into a Java object.
    @PutMapping("/{customerId}/password")
    public ResponseEntity<ApiResponse> updatePassword(@PathVariable Long customerId, @RequestBody PasswordUpdateRequest passwordRequest) {
        try {
            Customer existingCustomer = customerRepository.findById(customerId).orElse(null);

            if (existingCustomer == null) {
                return ResponseEntity.notFound().build();
            }

            if (passwordRequest.password() == null || passwordRequest.password().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse("ERROR", "Password cannot be empty"));
            }

            existingCustomer.setPassword(passwordRequest.password().trim());
            customerRepository.save(existingCustomer);

            return ResponseEntity.ok(new ApiResponse("SUCCESS", "Password updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("ERROR", "Error updating password: " + e.getMessage()));
        }
    }



    // VALIDATE CNIC - New endpoint for frontend validation
    @GetMapping("/validate/{cnic}")
    public ValidationResponse validateCNIC(@PathVariable("cnic") Long cnic) {
        try {
            Customer customer = customerRepository.findById(cnic).orElse(null);

            if (customer != null) {
                return new ValidationResponse("SUCCESS", "CNIC verified successfully", true);
            } else {
                return new ValidationResponse("ERROR", "CNIC not found in database", false);
            }
        } catch (Exception e) {
            return new ValidationResponse("ERROR", "Error validating CNIC: " + e.getMessage(), false);
        }
    }

    // Validation response record
    record ValidationResponse(
            String statusCode,
            String message,
            boolean isValid
    ) {}
}

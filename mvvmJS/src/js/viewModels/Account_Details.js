define(['../accUtils', 'knockout'],
function(accUtils, ko) {
  function AccountDetails(params) {
    const self = this;

    // Get parent controller for wizard navigation
    if (params && params.parent) {
      self.parent = params.parent;
    } else {
      // Fallback: try to get parent from global appRouter
      if (window.appRouter && window.appRouter.parent) {
        self.parent = window.appRouter.parent;
      } else {
        console.warn("⚠️ No parent passed to AccountDetails");
        self.parent = null;
      }
    }

    // Account details form fields
    self.accountNumber = ko.observable('');

    // Loading and validation states
    self.isValidatingAccount = ko.observable(false);
    self.accountValidationMessage = ko.observable('');
    self.isAccountValid = ko.observable(false);

    // Get customer data from shared wizard data (set during CNIC validation)
    self.customerData = ko.computed(() => {
      if (self.parent && self.parent.wizardData && self.parent.wizardData.customerData) {
        return self.parent.wizardData.customerData();
      }
      return null;
    });

    // Validate account number against database
    self.validateAccountNumber = function() {
      const accountNumber = self.accountNumber();
      if (!accountNumber) {
        self.accountValidationMessage('');
        self.isAccountValid(false);
        return;
      }

      // Basic validation - should be a number
      if (!/^\d+$/.test(accountNumber)) {
        self.accountValidationMessage('Please enter a valid account number (numbers only).');
        self.isAccountValid(false);
        return;
      }

      self.isValidatingAccount(true);
      self.accountValidationMessage('Validating account number...');

      // Make API call to validate account number
      fetch('http://localhost:8080/api/v1/customers')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch customer data');
          }
          return response.json();
        })
        .then(data => {
          console.log('Account validation API Response:', data);

          // Find customer by account_number
          const customer = data.find(c => c.account_number.toString() === accountNumber);

          if (customer) {
            // Additional check: make sure this account belongs to the same customer (CNIC)
            const parentCustomer = self.customerData();
            if (parentCustomer && parentCustomer.id.toString() === customer.id.toString()) {
              self.accountValidationMessage('✓ Account number verified successfully');
              self.isAccountValid(true);
            } else {
              self.accountValidationMessage('✗ Account number does not match the provided CNIC');
              self.isAccountValid(false);
            }
          } else {
            self.accountValidationMessage('✗ Account number not found in database');
            self.isAccountValid(false);
          }
        })
        .catch(error => {
          console.error('Account validation error:', error);
          self.accountValidationMessage('✗ Error validating account number. Please try again.');
          self.isAccountValid(false);
        })
        .finally(() => {
          self.isValidatingAccount(false);
        });
    };

    // Subscribe to account number changes for real-time validation
    self.accountNumber.subscribe(self.validateAccountNumber);

    this.connected = () => {
      console.log('Account Details ViewModel loaded'); // Debug log
      accUtils.announce('Account Details page loaded.', 'assertive');
      document.title = "Account Details";

      // Pre-populate form if customer data is available
      const customer = self.customerData();
      if (customer) {
        console.log('Pre-populating form with customer data:', customer);
        // Note: We don't pre-populate account number as user needs to enter it for verification
      }
    };

    this.disconnected = () => {};

    this.transitionCompleted = () => {};

    // Back button
    self.goBack = function () {
      if (self.parent && typeof self.parent.prevStep === 'function') {
        self.parent.prevStep();
      } else {
        console.error("prevStep not available in parent!");
      }
    };

    // Next button
    self.goNext = function () {
      if (!self.accountNumber()) {
        alert('Please enter your account number.');
        return;
      }

      if (!self.isAccountValid()) {
        alert('Please enter a valid account number that matches your CNIC.');
        return;
      }

      if (self.parent && typeof self.parent.nextStep === 'function') {
        console.log("Next clicked, calling parent.nextStep()");
        self.parent.nextStep();
      } else {
        console.error("Parent or nextStep is undefined!");
      }
    };
  }
  return AccountDetails;
});

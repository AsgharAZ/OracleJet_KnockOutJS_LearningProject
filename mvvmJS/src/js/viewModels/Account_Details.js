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
    self.ibanNumber = ko.observable('');

    // Account type selection (Account Number or IBAN)
    self.selectedAccountType = ko.observable('accountNumber');

    // Loading and validation states
    self.isValidatingAccount = ko.observable(false);
    self.accountValidationMessage = ko.observable('');
    self.isAccountValid = ko.observable(false);

    // IBAN validation states
    self.isValidatingIBAN = ko.observable(false);
    self.ibanValidationMessage = ko.observable('');
    self.isIBANValid = ko.observable(false);

    // Get customer data from shared wizard data (set during CNIC validation)
    self.customerData = ko.computed(() => {
      // Try multiple ways to access the shared data
      let customerData = null;

      // Method 1: Through params.parent
      if (self.parent && self.parent.wizardData && self.parent.wizardData.customerData) {
        customerData = self.parent.wizardData.customerData();
        console.log("✅ account_details found via params.parent:", customerData);
      }
      // Method 2: Through window.appRouter.parent
      else if (window.appRouter && window.appRouter.parent && window.appRouter.parent.wizardData && window.appRouter.parent.wizardData.customerData) {
        customerData = window.appRouter.parent.wizardData.customerData();
        console.log("✅ account_details found via window.appRouter.parent:", customerData);
      }
      // Method 3: Try to find it in the global scope
      else if (window.controllerViewModel && window.controllerViewModel.wizardData && window.controllerViewModel.wizardData.customerData) {
        customerData = window.controllerViewModel.wizardData.customerData();
        console.log("✅ account_details found via window.controllerViewModel:", customerData);
      }

      if (customerData) {
        console.log("✅ account_details Customer data found:", customerData);
        return customerData;
      } else {
        console.log("❌ account_details Customer data NOT found. Debug info:");
        console.log("params.parent:", self.parent);
        console.log("window.appRouter:", window.appRouter);
        console.log("window.appRouter.parent:", window.appRouter ? window.appRouter.parent : 'undefined');
        console.log("window.controllerViewModel:", window.controllerViewModel);
        return null;
      }
    });

    // Debounce timer for account number validation
    self.accountValidationTimeout = null;

    // Validate account number against database with debouncing
    self.validateAccountNumber = function() {
      const accountNumber = self.accountNumber();
      if (!accountNumber) {
        self.accountValidationMessage('');
        self.isAccountValid(false);
        self.resetAccountBorder();
        return;
      }

      // Basic validation - should be 14 digits
      const accountPattern = /^\d{14}$/;
      if (!accountPattern.test(accountNumber)) {
        self.accountValidationMessage('Please enter a valid 14-digit account number.');
        self.isAccountValid(false);
        self.resetAccountBorder();
        return;
      }

      self.isValidatingAccount(true);
      self.accountValidationMessage('Validating account number...');

      // Clear previous timeout
      if (self.accountValidationTimeout) {
        clearTimeout(self.accountValidationTimeout);
      }

      // Set new timeout for debouncing (500ms)
      self.accountValidationTimeout = setTimeout(() => {
        // Get CNIC from customer data
        const customerData = self.customerData();
        if (!customerData) {
          self.accountValidationMessage('✗ Customer data not available. Please go back and re-enter CNIC.');
          self.isAccountValid(false);
          self.resetAccountBorder();
          self.isValidatingAccount(false);
          return;
        }

        const cnic = customerData.id;

        // Make API call to validate account number with CNIC using new endpoint
        fetch(`http://localhost:8080/api/v1/accounts/validate/${accountNumber}/${cnic}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to validate account number');
            }
            return response.json();
          })
          .then(data => {
            console.log('Account Validation API Response:', data);

            if (data.statusCode === 'SUCCESS') {
              self.accountValidationMessage('✓ Account number verified successfully');
              self.isAccountValid(true);
              self.setValidAccountBorder();
            } else {
              self.accountValidationMessage(`✗ ${data.message}`);
              self.isAccountValid(false);
              self.resetAccountBorder();
            }
          })
          .catch(error => {
            console.error('Account validation error:', error);
            self.accountValidationMessage('✗ Error validating account number. Please try again.');
            self.isAccountValid(false);
            self.resetAccountBorder();
          })
          .finally(() => {
            self.isValidatingAccount(false);
          });
      }, 500); // 500ms debounce delay
    };

    // Set light green border for valid account number
    self.setValidAccountBorder = function() {
      setTimeout(() => {
        const accountField = document.getElementById('accountNumber') || document.querySelector('input[data-bind*="accountNumber"]');
        if (accountField) {
          accountField.style.borderColor = '#90EE90'; // Light green
        }
      }, 100);
    };

    // Reset border color
    self.resetAccountBorder = function() {
      setTimeout(() => {
        const accountField = document.getElementById('accountNumber') || document.querySelector('input[data-bind*="accountNumber"]');
        if (accountField) {
          accountField.style.borderColor = '#ccc';
        }
      }, 100);
    };

    // Subscribe to account number changes for real-time validation
    self.accountNumber.subscribe(self.validateAccountNumber);

    // Computed observables for UI state
    self.showAccountNumber = ko.computed(() => self.selectedAccountType() === 'accountNumber');
    self.showIBAN = ko.computed(() => self.selectedAccountType() === 'iban');

    // Debounce timer for IBAN validation
    self.ibanValidationTimeout = null;

    // Validate IBAN against database with debouncing
    self.validateIBAN = function() {
      const iban = self.ibanNumber();
      if (!iban) {
        self.ibanValidationMessage('');
        self.isIBANValid(false);
        self.resetIBANBorder();
        return;
      }

      // Basic format validation using the specified regex
      const ibanPattern = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/;
      if (!ibanPattern.test(iban)) {
        self.ibanValidationMessage('IBAN must start with 2 letters (country code), followed by 2 digits (check digits), then 10–30 alphanumeric characters');
        self.isIBANValid(false);
        self.setInvalidIBANBorder();
        return;
      }

      // Length validation (14-34 characters)
      if (iban.length < 14 || iban.length > 34) {
        self.ibanValidationMessage('IBAN must be between 14-34 characters long');
        self.isIBANValid(false);
        self.setInvalidIBANBorder();
        return;
      }

      self.isValidatingIBAN(true);
      self.ibanValidationMessage('Validating IBAN...');

      // Clear previous timeout
      if (self.ibanValidationTimeout) {
        clearTimeout(self.ibanValidationTimeout);
      }

      // Set new timeout for debouncing (500ms)
      self.ibanValidationTimeout = setTimeout(() => {
        // Get CNIC from customer data
        const customerData = self.customerData();
        if (!customerData) {
          self.ibanValidationMessage('✗ Customer data not available. Please go back and re-enter CNIC.');
          self.isIBANValid(false);
          self.setInvalidIBANBorder();
          self.isValidatingIBAN(false);
          return;
        }

        const cnic = customerData.id;

        // Make API call to validate IBAN with CNIC using the correct endpoint
        fetch(`http://localhost:8080/api/v1/accounts/validate/iban/${iban}/${cnic}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to validate IBAN');
            }
            return response.json();
          })
          .then(data => {
            console.log('IBAN Validation API Response:', data);

            if (data.statusCode === 'SUCCESS') {
              self.ibanValidationMessage('✓ IBAN verified successfully');
              self.isIBANValid(true);
              self.setValidIBANBorder();
            } else {
              self.ibanValidationMessage(`✗ ${data.message}`);
              self.isIBANValid(false);
              self.setInvalidIBANBorder();
            }
          })
          .catch(error => {
            console.error('IBAN validation error:', error);
            self.ibanValidationMessage('✗ Error validating IBAN. Please try again.');
            self.isIBANValid(false);
            self.setInvalidIBANBorder();
          })
          .finally(() => {
            self.isValidatingIBAN(false);
          });
      }, 500); // 500ms debounce delay
    };

    // Set light green border for valid IBAN
    self.setValidIBANBorder = function() {
      setTimeout(() => {
        const ibanField = document.getElementById('ibanNumber') || document.querySelector('input[data-bind*="ibanNumber"]');
        if (ibanField) {
          ibanField.style.borderColor = '#90EE90'; // Light green
        }
      }, 100);
    };

    // Set red border for invalid IBAN
    self.setInvalidIBANBorder = function() {
      setTimeout(() => {
        const ibanField = document.getElementById('ibanNumber') || document.querySelector('input[data-bind*="ibanNumber"]');
        if (ibanField) {
          ibanField.style.borderColor = '#dc3545'; // Red
        }
      }, 100);
    };

    // Reset IBAN border color
    self.resetIBANBorder = function() {
      setTimeout(() => {
        const ibanField = document.getElementById('ibanNumber') || document.querySelector('input[data-bind*="ibanNumber"]');
        if (ibanField) {
          ibanField.style.borderColor = '#ccc';
        }
      }, 100);
    };

    // Subscribe to IBAN changes for real-time validation
    self.ibanNumber.subscribe(self.validateIBAN);

    // Tab selection methods
    self.selectAccountNumber = function() {
      self.selectedAccountType('accountNumber');
      // Clear IBAN validation when switching tabs
      self.ibanNumber('');
      self.ibanValidationMessage('');
      self.isIBANValid(false);
      self.resetIBANBorder();
    };

    self.selectIBAN = function() {
      self.selectedAccountType('iban');
      // Clear account number validation when switching tabs
      self.accountNumber('');
      self.accountValidationMessage('');
      self.isAccountValid(false);
      self.resetAccountBorder();
    };

    this.connected = () => {
      console.log('Account Details ViewModel loaded'); // Debug log
      accUtils.announce('Account Details page loaded.', 'assertive');
      document.title = "Account Details";

      // Debug: Check customer data availability
      console.log('🔍 Checking customer data on page load...');
      console.log('Parent object:', self.parent);
      console.log('window.appRouter:', window.appRouter);
      console.log('window.controllerViewModel:', window.controllerViewModel);

      // Pre-populate form if customer data is available
      const customer = self.customerData();
      console.log('Customer data result:', customer);
      if (customer) {
        console.log('✅ Pre-populating form with customer data:', customer);
        // Note: We don't pre-populate account number as user needs to enter it for verification
      } else {
        console.log('❌ No customer data available on page load');
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
      // Validate based on selected account type
      if (self.selectedAccountType() === 'accountNumber') {
        if (!self.accountNumber()) {
          alert('Please enter your account number.');
          return;
        }

        if (!self.isAccountValid()) {
          alert('Please enter a valid account number that matches your CNIC.');
          return;
        }
      } else if (self.selectedAccountType() === 'iban') {
        if (!self.ibanNumber()) {
          alert('Please enter your IBAN.');
          return;
        }

        if (!self.isIBANValid()) {
          alert('Please enter a valid IBAN that matches your CNIC.');
          return;
        }
      }

      if (self.parent && typeof self.parent.nextStep === 'function') {
        console.log("Next clicked, calling parent.nextStep()");

        // Store account details in wizard data for successful_registration page
        if (self.parent.wizardData) {
          const accountDetails = {
            accountNumber: self.accountNumber(),
            ibanNumber: self.ibanNumber(),
            selectedAccountType: self.selectedAccountType()
          };
          self.parent.wizardData.accountDetails = ko.observable(accountDetails);
          console.log("✅ Stored account details in wizard data:", accountDetails);
        }

        self.parent.nextStep();
      } else {
        console.error("Parent or nextStep is undefined!");
      }
    };
  }
  return AccountDetails;
});

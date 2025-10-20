define(['knockout', 'ojs/ojmodule-element-utils'], function (ko, moduleUtils) {
  function AccountTypeViewModel(params) {
    const self = this;

    console.log('>>> AccountTypeViewModel instantiated. params =', params);

    // self.parent = (params && params.parent) ? params.parent : null;

    console.log(params && params.parent);
    console.log(params);
    console.log(params.parent);


    // Try to get parent from params first
    if (params && params.parent) {
      self.parent = params.parent;
      console.log("✅ Parent received via params:", self.parent);
    } else {
      // Fallback: try to get parent from global appRouter
      if (window.appRouter && window.appRouter.parent) {
        self.parent = window.appRouter.parent;
        console.log("✅ Parent received via window.appRouter:", self.parent);
      } else if (window.controllerViewModel) {
        self.parent = window.controllerViewModel;
        console.log("✅ Parent received via window.controllerViewModel:", self.parent);
      } else {
        console.warn("⚠️ No parent passed to AccountTypeViewModel");
        self.parent = null; // fallback to null so code doesn't crash
      }
    }

    console.log("Final parent object:", self.parent);
    console.log("Parent has wizardData:", self.parent ? !!self.parent.wizardData : 'No parent');

    // Selected account type - default to Individual
    self.selectedAccountType = ko.observable('Individual');

    // CNIC input with formatting
    self.cnicNumber = ko.observable('');
    self.cnicNumberFormatted = ko.observable('');

    // Computed observable to determine if CNIC field should be shown
    self.showCNICField = ko.computed(function() {
      return self.selectedAccountType() === 'Individual';
    });

    // Computed observable to determine if placeholder should be shown
    self.showPlaceholder = ko.computed(function() {
      return self.selectedAccountType() === 'Sole Proprietor' || self.selectedAccountType() === 'Foreign National';
    });

    // Icon path computed observables
    self.individualIcon = ko.computed(function() {
      return self.selectedAccountType() === 'Individual'
        ? 'css/images/AccountType_Icons/Individual-Icon-Filled.svg'
        : 'css/images/AccountType_Icons/Individual-Icon-Unfilled.svg';
    });

    self.soleProprietorIcon = ko.computed(function() {
      return self.selectedAccountType() === 'Sole Proprietor'
        ? 'css/images/AccountType_Icons/Sole-Proprietor-Icon-Filled.svg'
        : 'css/images/AccountType_Icons/Sole-Proprietor-Icon-Unfilled.svg';
    });

    self.foreignNationalIcon = ko.computed(function() {
      return self.selectedAccountType() === 'Foreign National'
        ? 'css/images/AccountType_Icons/Foreign-National-Icon-Filled.svg'
        : 'css/images/AccountType_Icons/Foreign-National-Icon-Unfilled.svg';
    });

    self.savingsIcon = ko.computed(function() {
      return self.selectedAccountType() === 'Savings'
        ? 'css/images/AccountType_Icons/Savings-Icon-Filled.svg'
        : 'css/images/AccountType_Icons/Savings-Icon-Unfilled.svg';
    });

    self.smartWalletIcon = ko.computed(function() {
      return self.selectedAccountType() === 'Smart Wallet'
        ? 'css/images/AccountType_Icons/SmartWallet-Icon-Filled.svg'
        : 'css/images/AccountType_Icons/SmartWallet-Icon-Unfilled.svg';
    });

    // Loading and validation states
    self.isValidatingCNIC = ko.observable(false);
    self.cnicValidationMessage = ko.observable('');
    self.isCNICValid = ko.observable(false);

    // Account type buttons
    self.selectIndividual = () => self.selectedAccountType('Individual');
    self.selectSoleProprietor = () => self.selectedAccountType('Sole Proprietor');
    self.selectForeignNational = () => self.selectedAccountType('Foreign National');
    self.selectSavings = () => self.selectedAccountType('Savings');
    self.selectSmartWallet = () => self.selectedAccountType('Smart Wallet');

    // Debounce timer for CNIC validation
    self.cnicValidationTimeout = null;

    // Validate CNIC against database with debouncing
    self.validateCNIC = function() {
      const cnic = self.cnicNumber();
      if (!cnic) {
        self.cnicValidationMessage('');
        self.isCNICValid(false);
        self.resetCNICBorder();
        return;
      }

      // Remove dashes for API call
      const cleanCNIC = cnic.replace(/-/g, '');

      // Basic format validation
      const cnicPattern = /^\d{13}$/;
      if (!cnicPattern.test(cleanCNIC)) {
        self.cnicValidationMessage('Please enter a valid 13-digit CNIC number.');
        self.isCNICValid(false);
        self.resetCNICBorder();
        return;
      }

      self.isValidatingCNIC(true);
      self.cnicValidationMessage('Validating CNIC...');

      // Clear previous timeout
      if (self.cnicValidationTimeout) {
        clearTimeout(self.cnicValidationTimeout);
      }

      // Set new timeout for debouncing (500ms)
      self.cnicValidationTimeout = setTimeout(() => {
        // Make API call to validate CNIC using new endpoint
        fetch(`http://localhost:8080/api/v1/customers/validate/${cleanCNIC}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to validate CNIC');
            }
            return response.json();
          })
          .then(data => {
            console.log('CNIC Validation API Response:', data);

            if (data.statusCode === 'SUCCESS') {
              self.cnicValidationMessage('✓ CNIC verified successfully');
              self.isCNICValid(true);
              self.setValidCNICBorder();

              // Store customer data for later use in shared wizard data
              if (self.parent && self.parent.wizardData) {
                // Create a customer object from the validation data
                const customerData = {
                  id: cleanCNIC, // The CNIC number that was validated
                  username: 'fetched_from_db', // This will be fetched in the next screen
                  // Add other customer fields as needed
                };
                self.parent.wizardData.customerData(customerData);
                console.log("✅ Customer data stored successfully in wizardData");
                console.log("Stored customer data:", customerData);
              } else {
                console.log("❌ Failed to store customer data - parent or wizardData missing");
                console.log("Parent object:", self.parent);
                console.log("Parent wizardData:", self.parent ? self.parent.wizardData : 'No parent');
              }
            } else {
              self.cnicValidationMessage(`✗ ${data.message}`);
              self.isCNICValid(false);
              self.setInvalidCNICBorder();
            }
          })
          .catch(error => {
            console.error('CNIC validation error:', error);
            self.cnicValidationMessage('✗ Error validating CNIC. Please try again.');
            self.isCNICValid(false);
            self.resetCNICBorder();
          })
          .finally(() => {
            self.isValidatingCNIC(false);
          });
      }, 500); // 500ms debounce delay
    };

    // Set light green border for valid CNIC
    self.setValidCNICBorder = function() {
      setTimeout(() => {
        const cnicField = document.getElementById('cnicNumber') || document.querySelector('input[data-bind*="cnicNumber"]');
        if (cnicField) {
          cnicField.style.borderColor = '#90EE90'; // Light green
        }
      }, 100);
    };

    // Set red border for invalid CNIC
    self.setInvalidCNICBorder = function() {
      setTimeout(() => {
        const cnicField = document.getElementById('cnicNumber') || document.querySelector('input[data-bind*="cnicNumber"]');
        if (cnicField) {
          cnicField.style.borderColor = '#dc3545'; // Red
        }
      }, 100);
    };

    // Reset border color
    self.resetCNICBorder = function() {
      setTimeout(() => {
        const cnicField = document.getElementById('cnicNumber') || document.querySelector('input[data-bind*="cnicNumber"]');
        if (cnicField) {
          cnicField.style.borderColor = '#ccc';
        }
      }, 100);
    };

    // CNIC formatting function
    self.formatCNIC = function(value) {
      // Remove all non-digits
      let digits = value.replace(/\D/g, '');

      // Limit to 13 digits
      if (digits.length > 13) {
        digits = digits.substring(0, 13);
      }

      // Apply formatting: XXXXX-XXXXXXX-X
      if (digits.length <= 5) {
        return digits;
      } else if (digits.length <= 12) {
        return digits.substring(0, 5) + '-' + digits.substring(5);
      } else {
        return digits.substring(0, 5) + '-' + digits.substring(5, 12) + '-' + digits.substring(12);
      }
    };

    // Handle CNIC input with formatting
    self.handleCNICInput = function(data, event) {
      const input = event.target;
      let value = input.value;

      // Only allow numbers
      value = value.replace(/\D/g, '');

      // Limit to 13 digits
      if (value.length > 13) {
        value = value.substring(0, 13);
      }

      // Apply formatting
      const formatted = self.formatCNIC(value);

      // Update both observables
      self.cnicNumber(value); // Store raw digits for validation
      self.cnicNumberFormatted(formatted); // Store formatted version for display

      // Update input field value
      input.value = formatted;

      return false;
    };

    // Subscribe to CNIC changes for real-time validation
    self.cnicNumber.subscribe(self.validateCNIC);

    // Computed observable to determine if Next button should be enabled
    self.canProceed = ko.computed(function() {
      // Only Individual account type can proceed
      if (self.selectedAccountType() !== 'Individual') return false;

      // For Individual account type, must have valid CNIC
      return self.isCNICValid();
    });

    // Computed observable for dynamic placeholder text
    self.placeholderText = ko.computed(function() {
      const accountType = self.selectedAccountType();
      switch(accountType) {
        case 'Sole Proprietor':
          return 'This is Sole Proprietor';
        case 'Foreign National':
          return 'This is Foreign National';
        case 'Savings':
          return 'This is Savings';
        case 'Smart Wallet':
          return 'This is Smart Wallet';
        default:
          return 'this is a placeholder';
      }
    });

    // Back button
    self.goBack = function () {
      if (self.parent && typeof self.parent.prevStep === 'function') {
        console.log('Back clicked, calling parent.prevStep()');
        self.parent.prevStep();
      } else {
        console.error("prevStep not available in parent!");
      }
    };

    // Next button
    self.goNext = function () {
      if (!self.selectedAccountType()) {
        alert('Please select an account type before proceeding.');
        return;
      }

      // Only Individual account type can proceed
      if (self.selectedAccountType() !== 'Individual') {
        const accountType = self.selectedAccountType();
        alert(`The ${accountType} account type is not available for registration at this time. Please select Individual to continue.`);
        return;
      }

      // Validate CNIC for Individual account type
      if (!self.cnicNumber()) {
        alert('Please enter your CNIC number.');
        return;
      }

      if (!self.isCNICValid()) {
        alert('Please enter a valid CNIC number that exists in our database.');
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

  return AccountTypeViewModel;
});

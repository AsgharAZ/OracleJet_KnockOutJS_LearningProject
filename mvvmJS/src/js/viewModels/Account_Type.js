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
    } else {
      // Fallback: try to get parent from global appRouter
      if (window.appRouter && window.appRouter.parent) {
        self.parent = window.appRouter.parent;
      } else {
        console.warn("⚠️ No parent passed to AccountTypeViewModel");
        self.parent = null; // fallback to null so code doesn't crash
      }
    }


    if (self.parent) {
      console.log("Parent received in AccountType:", self.parent);
    } else {
      console.warn("No parent passed to account_type.js");
    }

    // Selected account type
    self.selectedAccountType = ko.observable('');

    // CNIC input
    self.cnicNumber = ko.observable('');

    // Loading and validation states
    self.isValidatingCNIC = ko.observable(false);
    self.cnicValidationMessage = ko.observable('');
    self.isCNICValid = ko.observable(false);

    // Account type buttons
    self.selectIndividual = () => self.selectedAccountType('Individual');
    self.selectSoleProprietor = () => self.selectedAccountType('Sole Proprietor');
    self.selectForeignNational = () => self.selectedAccountType('Foreign National');

    // Validate CNIC against database
    self.validateCNIC = function() {
      const cnic = self.cnicNumber();
      if (!cnic) {
        self.cnicValidationMessage('');
        self.isCNICValid(false);
        return;
      }

      const cnicPattern = /^(\d{13}|\d{5}-\d{7}-\d{1})$/;
      if (!cnicPattern.test(cnic)) {
        self.cnicValidationMessage('Please enter a valid CNIC number (XXXXX-XXXXXXX-X).');
        self.isCNICValid(false);
        return;
      }

      // Remove dashes for API call
      const cleanCNIC = cnic.replace(/-/g, '');

      self.isValidatingCNIC(true);
      self.cnicValidationMessage('Validating CNIC...');

      // Make API call to validate CNIC
      fetch('http://localhost:8080/api/v1/customers')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch customer data');
          }
          return response.json();
        })
        .then(data => {
          console.log('API Response:', data);

          // Find customer by ID (CNIC)
          const customer = data.find(c => c.id.toString() === cleanCNIC);

          if (customer) {
            self.cnicValidationMessage('✓ CNIC verified successfully');
            self.isCNICValid(true);

            // Store customer data for later use in shared wizard data
            self.customerData = customer;
            console.log("🔥 Storing customer data:", customer);
            console.log("🔥 Parent object:", self.parent);
            console.log("🔥 Parent wizardData:", self.parent ? self.parent.wizardData : 'No parent');

            if (self.parent && self.parent.wizardData) {
              self.parent.wizardData.customerData(customer);
              console.log("✅ Customer data stored successfully in wizardData");
            } else {
              console.log("❌ Failed to store customer data - parent or wizardData missing");
            }
          } else {
            self.cnicValidationMessage('✗ CNIC not found in database');
            self.isCNICValid(false);
          }
        })
        .catch(error => {
          console.error('CNIC validation error:', error);
          self.cnicValidationMessage('✗ Error validating CNIC. Please try again.');
          self.isCNICValid(false);
        })
        .finally(() => {
          self.isValidatingCNIC(false);
        });
    };

    // Subscribe to CNIC changes for real-time validation
    self.cnicNumber.subscribe(self.validateCNIC);

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

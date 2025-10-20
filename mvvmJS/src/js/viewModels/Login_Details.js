define(['knockout'], function(ko) {
  function Login_DetailsViewModel(params) {
    const self = this;

    // Get parent controller for wizard navigation
    self.parent = (params && params.parent) ? params.parent : null;

    // Loading states
    self.isLoadingUsername = ko.observable(false);
    self.usernameFetchMessage = ko.observable('');

    // Get username from database based on customer data
    self.username = ko.observable('');

    // Get customer data from shared wizard data (set during previous steps)
    self.customerData = ko.computed(() => {
      // Try multiple ways to access the shared data
      let customerData = null;

      // Method 1: Through params.parent
      if (self.parent && self.parent.wizardData && self.parent.wizardData.customerData) {
        customerData = self.parent.wizardData.customerData();
        console.log("✅ Found via params.parent:", customerData);
      }
      // Method 2: Through window.appRouter.parent
      else if (window.appRouter && window.appRouter.parent && window.appRouter.parent.wizardData && window.appRouter.parent.wizardData.customerData) {
        customerData = window.appRouter.parent.wizardData.customerData();
        console.log("✅ Found via window.appRouter.parent:", customerData);
      }
      // Method 3: Try to find it in the global scope
      else if (window.controllerViewModel && window.controllerViewModel.wizardData && window.controllerViewModel.wizardData.customerData) {
        customerData = window.controllerViewModel.wizardData.customerData();
        console.log("✅ Found via window.controllerViewModel:", customerData);
      }

      if (customerData) {
        console.log("✅ Customer data found:", customerData);
        return customerData;
      } else {
        console.log("❌ Customer data NOT found. Debug info:");
        console.log("params.parent:", self.parent);
        console.log("window.appRouter:", window.appRouter);
        console.log("window.appRouter.parent:", window.appRouter ? window.appRouter.parent : 'undefined');
        console.log("window.controllerViewModel:", window.controllerViewModel);
        return null;
      }
    });

    // Fetch username from database using secure endpoint
    self.fetchUsername = function() {
      const customer = self.customerData();
      if (!customer) {
        self.usernameFetchMessage('No customer data available');
        return;
      }

      self.isLoadingUsername(true);
      self.usernameFetchMessage('Fetching username...');

      // Get account details from wizard data to use in API call
      const accountDetails = self.getAccountDetails();
      if (!accountDetails || (!accountDetails.accountNumber && !accountDetails.ibanNumber)) {
        self.usernameFetchMessage('✗ Account details not available');
        self.isLoadingUsername(false);
        return;
      }

      // Use the secure endpoint that only returns username
      const accountNumber = accountDetails.accountNumber;
      const cnic = customer.id;

      fetch(`http://localhost:8080/api/v1/accounts/username/${cnic}/${accountNumber}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch username');
          }
          return response.text(); // Username endpoint returns plain text
        })
        .then(username => {
          console.log('Username fetch successful:', username);

          if (username && username.trim()) {
            self.username(username.trim());
            self.usernameFetchMessage(`✓ Welcome, ${username.trim()}!`);

            // Store the username in wizard data for use in successful_registration page
            self.storeUsernameInWizardData(username.trim());
          } else {
            self.usernameFetchMessage('✗ Unable to fetch username');
          }
        })
        .catch(error => {
          console.error('Username fetch error:', error);
          self.usernameFetchMessage('✗ Error fetching username. Please try again.');
        })
        .finally(() => {
          self.isLoadingUsername(false);
        });
    };

    // Helper method to get account details from wizard data
    self.getAccountDetails = function() {
      // Try multiple ways to access account details
      let accountDetails = null;

      // Method 1: Through params.parent
      if (self.parent && self.parent.wizardData && self.parent.wizardData.accountDetails) {
        accountDetails = self.parent.wizardData.accountDetails();
      }
      // Method 2: Through window.appRouter.parent
      else if (window.appRouter && window.appRouter.parent && window.appRouter.parent.wizardData && window.appRouter.parent.wizardData.accountDetails) {
        accountDetails = window.appRouter.parent.wizardData.accountDetails();
      }
      // Method 3: Try to find it in the global scope
      else if (window.controllerViewModel && window.controllerViewModel.wizardData && window.controllerViewModel.wizardData.accountDetails) {
        accountDetails = window.controllerViewModel.wizardData.accountDetails();
      }

      return accountDetails;
    };

    // Helper method to store username in wizard data
    self.storeUsernameInWizardData = function(username) {
      // Update customer data with the fetched username
      const customer = self.customerData();
      if (customer) {
        customer.username = username;

        // Update the customer data in wizard data storage
        if (self.parent && self.parent.wizardData && self.parent.wizardData.customerData) {
          self.parent.wizardData.customerData(customer);
          console.log('✅ Username stored in wizard data:', username);
        }
        // Fallback to global controller
        else if (window.controllerViewModel && window.controllerViewModel.wizardData && window.controllerViewModel.wizardData.customerData) {
          window.controllerViewModel.wizardData.customerData(customer);
          console.log('✅ Username stored in global wizard data:', username);
        }
      }
    };

    // Continue to Login - navigate back to login page
    self.continueToLogin = function () {
      console.log("Continue to Login clicked");

      // Navigate to login page using the globally exposed router
      if (window.appRouter && typeof window.appRouter.go === 'function') {
        try {
          window.appRouter.go({ path: 'login_Page' });
          console.log("Navigation to login page successful");
        } catch (err) {
          console.error('Navigation to login page failed:', err);
        }
      } else {
        console.error("Router not available for navigation");
        // Fallback: direct hash navigation
        window.location.hash = '#/login_Page';
      }
    };

    // Reset Password - navigate to login_details_2 (security questions)
    self.resetPassword = function () {
      console.log("Reset Password clicked");

      // Navigate to security questions page
      if (window.appRouter && typeof window.appRouter.go === 'function') {
        try {
          window.appRouter.go({ path: 'login_details_2' });
          console.log("Navigation to security questions successful");
        } catch (err) {
          console.error('Navigation to security questions failed:', err);
        }
      } else {
        console.error("Router not available for navigation");
        // Fallback: direct hash navigation
        window.location.hash = '#/login_details_2';
      }
    };

    // Back button (keeping for consistency with wizard pattern)
    self.goBack = function () {
      if (self.parent && typeof self.parent.prevStep === 'function') {
        self.parent.prevStep();
      } else {
        console.error("prevStep not available in parent!");
      }
    };

    // Initialize username fetch when component loads
    self.connected = function() {
      console.log('Login Details ViewModel loaded');
      self.fetchUsername();
    };

    // Clean up
    self.disconnected = function() {
      // Any cleanup if needed
    };
  }
  return Login_DetailsViewModel;
});

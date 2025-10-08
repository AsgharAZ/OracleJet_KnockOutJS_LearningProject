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

    // Fetch username from database
    self.fetchUsername = function() {
      const customer = self.customerData();
      if (!customer) {
        self.usernameFetchMessage('No customer data available');
        return;
      }

      self.isLoadingUsername(true);
      self.usernameFetchMessage('Fetching username...');

      // Make API call to get fresh customer data and extract username
      fetch('http://localhost:8080/api/v1/customers')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch customer data');
          }
          return response.json();
        })
        .then(data => {
          console.log('Username fetch API Response:', data);

          // Find customer by ID to get fresh data
          const customerData = data.find(c => c.id.toString() === customer.id.toString());

          if (customerData && customerData.username) {
            self.username(customerData.username);
            self.usernameFetchMessage(`✓ Welcome, ${customerData.username}!`);
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

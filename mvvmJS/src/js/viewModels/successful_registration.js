
define(['knockout'],
  function(ko) {
    function SuccessfulRegistrationViewModel(params) {
      const self = this;

      // Get parent controller for wizard data access
      self.parent = (params && params.parent) ? params.parent : null;

      // Get wizard data from parent controller
      self.wizardData = ko.computed(() => {
        if (self.parent && self.parent.wizardData) {
          return self.parent.wizardData;
        }
        // Fallback to global controller
        if (window.controllerViewModel && window.controllerViewModel.wizardData) {
          return window.controllerViewModel.wizardData;
        }
        return null;
      });

      // Get customer data from wizard data
      self.customerData = ko.computed(() => {
        const wizardData = self.wizardData();
        if (wizardData && wizardData.customerData) {
          return wizardData.customerData();
        }
        return null;
      });

      // Get account details from wizard data (if stored)
      self.accountDetails = ko.computed(() => {
        const wizardData = self.wizardData();
        if (wizardData && wizardData.accountDetails) {
          return wizardData.accountDetails();
        }
        return null;
      });

      // Dynamic data for the success page
      self.username = ko.computed(() => {
        const customer = self.customerData();
        if (customer && customer.username) {
          console.log('✅ Using stored username from wizard data:', customer.username);
          return customer.username;
        }

        // Fallback: try to get username from other sources if not in customer data
        const wizardData = self.wizardData();
        if (wizardData && wizardData.username) {
          console.log('✅ Using username from wizard data fallback:', wizardData.username);
          return wizardData.username;
        }

        console.log('❌ Username not found in wizard data');
        return 'N/A';
      });

      self.accountNumber = ko.computed(() => {
        const accountDetails = self.accountDetails();
        if (accountDetails && accountDetails.accountNumber) {
          return accountDetails.accountNumber;
        }
        return 'N/A';
      });

      self.ibanNumber = ko.computed(() => {
        const accountDetails = self.accountDetails();
        if (accountDetails && accountDetails.ibanNumber) {
          return accountDetails.ibanNumber;
        }
        return 'N/A';
      });

      // Continue to Login button
      this.continueToLogin = function () {
        console.log("Continue to Login clicked from successful registration");

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

      this.connected = () => {
        console.log('Successful Registration page loaded');
        document.title = "Registration Successful";
      };

      this.disconnected = () => {
        // Implement if needed
      };

      this.transitionCompleted = () => {
        // Implement if needed
      };
    }
    return SuccessfulRegistrationViewModel;
  }
);

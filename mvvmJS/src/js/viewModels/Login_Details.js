define(['knockout'], function(ko) {
  function Login_DetailsViewModel(params) {
    const self = this;

    // Get parent controller for wizard navigation
    self.parent = (params && params.parent) ? params.parent : null;

    // Get username from previous steps (this would typically come from account setup data)
    // For now, using a default value that matches the design
    self.username = ko.observable('alikhan786');

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
  }
  return Login_DetailsViewModel;
});

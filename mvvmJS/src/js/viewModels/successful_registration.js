
define(['knockout'],
  function(ko) {
    function SuccessfulRegistrationViewModel() {

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

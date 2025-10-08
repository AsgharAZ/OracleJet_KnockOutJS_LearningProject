define(['knockout'], function(ko) {
  function Login_DetailsViewModel_2(params) {
    const self = this;

    // Get parent controller for wizard navigation
    self.parent = (params && params.parent) ? params.parent : null;

    // Password form fields
    self.newPassword = ko.observable('');
    self.rePassword = ko.observable('');

    // Password visibility states
    self.passwordVisible = ko.observable(false);
    self.rePasswordVisible = ko.observable(false);

    // Password strength properties
    self.passwordStrengthText = ko.observable('');
    self.passwordStrengthColor = ko.observable('#666');
    self.passwordStrengthPercentage = ko.observable(0);

    // Password match properties
    self.passwordMatchText = ko.observable('');
    self.passwordMatchColor = ko.observable('#666');

    // Password visibility toggles
    self.togglePasswordVisibility = function () {
      self.passwordVisible(!self.passwordVisible());
      var pwd = document.getElementById('newPassword');
      if (pwd) pwd.type = self.passwordVisible() ? 'text' : 'password';
    };

    self.toggleRePasswordVisibility = function () {
      self.rePasswordVisible(!self.rePasswordVisible());
      var pwd = document.getElementById('rePassword');
      if (pwd) pwd.type = self.rePasswordVisible() ? 'text' : 'password';
    };

    // Password strength evaluation
    self.passwordStrength = function () {
      const password = self.newPassword();
      if (!password) {
        self.passwordStrengthText('Password Strength: ');
        self.passwordStrengthColor('#666');
        self.passwordStrengthPercentage(0);
        return;
      }

      let strength = 0;
      let feedback = '';

      // Length check
      if (password.length >= 8) strength += 25;
      else if (password.length >= 6) strength += 15;
      else if (password.length >= 4) strength += 10;
      else strength += 5;

      // Character variety checks
      if (/[a-z]/.test(password)) strength += 15;
      if (/[A-Z]/.test(password)) strength += 15;
      if (/[0-9]/.test(password)) strength += 15;
      if (/[^A-Za-z0-9]/.test(password)) strength += 15;

      // Complexity bonus
      if (password.length >= 10 && /[^A-Za-z0-9]/.test(password)) strength += 15;

      // Determine strength level
      if (strength < 30) {
        feedback = 'Too Short';
        self.passwordStrengthColor('#dc3545'); // Red
      } else if (strength < 50) {
        feedback = 'Weak';
        self.passwordStrengthColor('#fd7e14'); // Orange
      } else if (strength < 70) {
        feedback = 'Fair';
        self.passwordStrengthColor('#ffc107'); // Yellow
      } else if (strength < 90) {
        feedback = 'Good';
        self.passwordStrengthColor('#20c997'); // Teal
      } else {
        feedback = 'Strong';
        self.passwordStrengthColor('#28a745'); // Green
      }

      self.passwordStrengthText('Password Strength: ' + feedback);
      self.passwordStrengthPercentage(strength);
    };

    // Password match validation with border color change
    self.validatePasswordMatch = ko.computed(function() {
      const newPwd = self.newPassword();
      const rePwd = self.rePassword();

      if (!rePwd) {
        self.passwordMatchText('');
        return false;
      }

      if (newPwd === rePwd) {
        self.passwordMatchText('Password Matched!');
        self.passwordMatchColor('#28a745'); // Green

        // Add light green border to re-enter password field
        setTimeout(function() {
          var rePwdField = document.getElementById('rePassword');
          if (rePwdField) {
            rePwdField.style.borderColor = '#28a745';
          }
        }, 100);

        return true;
      } else {
        self.passwordMatchText('Passwords do not match');
        self.passwordMatchColor('#dc3545'); // Red

        // Reset border color
        setTimeout(function() {
          var rePwdField = document.getElementById('rePassword');
          if (rePwdField) {
            rePwdField.style.borderColor = '#ccc';
          }
        }, 100);

        return false;
      }
    });

    // Check if update password button should be enabled
    self.canUpdatePassword = ko.computed(function() {
      const newPwd = self.newPassword();
      const rePwd = self.rePassword();

      // Must have both passwords
      if (!newPwd || !rePwd) return false;

      // Password must be at least 8 characters
      if (newPwd.length < 8) return false;

      // Passwords must match
      if (newPwd !== rePwd) return false;

      // Password must have minimum strength (at least "Fair")
      const strength = self.passwordStrengthPercentage();
      if (strength < 50) return false;

      return true;
    });

    // Back to Username button
    self.backToUsername = function () {
      console.log("Back to Username clicked");

      // Navigate back to login_details (username verification page)
      if (window.appRouter && typeof window.appRouter.go === 'function') {
        try {
          window.appRouter.go({ path: 'login_details' });
          console.log("Navigation to login details successful");
        } catch (err) {
          console.error('Navigation to login details failed:', err);
        }
      } else {
        console.error("Router not available for navigation");
        // Fallback: direct hash navigation
        window.location.hash = '#/login_details';
      }
    };

    // Loading state for password update
    self.isUpdatingPassword = ko.observable(false);
    self.passwordUpdateMessage = ko.observable('');

    // Get customer data for password update from shared wizard data
    self.customerData = ko.computed(() => {
      // Try multiple ways to access the shared data
      let customerData = null;

      // Method 1: Through params.parent
      if (self.parent && self.parent.wizardData && self.parent.wizardData.customerData) {
        customerData = self.parent.wizardData.customerData();
        console.log("✅ login_details_2 found via params.parent:", customerData);
      }
      // Method 2: Through window.appRouter.parent
      else if (window.appRouter && window.appRouter.parent && window.appRouter.parent.wizardData && window.appRouter.parent.wizardData.customerData) {
        customerData = window.appRouter.parent.wizardData.customerData();
        console.log("✅ login_details_2 found via window.appRouter.parent:", customerData);
      }
      // Method 3: Try to find it in the global scope
      else if (window.controllerViewModel && window.controllerViewModel.wizardData && window.controllerViewModel.wizardData.customerData) {
        customerData = window.controllerViewModel.wizardData.customerData();
        console.log("✅ login_details_2 found via window.controllerViewModel:", customerData);
      }

      if (customerData) {
        console.log("✅ login_details_2 Customer data found:", customerData);
        return customerData;
      } else {
        console.log("❌ login_details_2 Customer data NOT found. Debug info:");
        console.log("params.parent:", self.parent);
        console.log("window.appRouter:", window.appRouter);
        console.log("window.appRouter.parent:", window.appRouter ? window.appRouter.parent : 'undefined');
        console.log("window.controllerViewModel:", window.controllerViewModel);
        return null;
      }
    });

    // Update Password button
    self.updatePassword = function () {
      console.log("🔥🔥🔥 UPDATE PASSWORD BUTTON CLICKED - DEBUGGING START 🔥🔥🔥");
      console.log("Parent object:", self.parent);
      console.log("window.appRouter:", window.appRouter);
      console.log("window.controllerViewModel:", window.controllerViewModel);

      const newPwd = self.newPassword();
      const rePwd = self.rePassword();

      console.log("Password inputs:", { newPwd: newPwd, rePwd: rePwd });

      // Final validation
      if (!newPwd || !rePwd) {
        alert('Please fill in both password fields.');
        return;
      }

      if (newPwd.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }

      if (newPwd !== rePwd) {
        alert('Passwords do not match.');
        return;
      }

      const strength = self.passwordStrengthPercentage();
      console.log("Password strength:", strength);

      if (strength < 50) {
        alert('Password strength must be at least "Fair" to proceed.');
        return;
      }

      const customer = self.customerData();
      console.log("Customer data from computed observable:", customer);

      if (!customer) {
        console.error("❌ Customer data is null! Debug info:");
        console.log("self.customerData():", self.customerData());
        console.log("self.parent:", self.parent);
        console.log("self.parent.wizardData:", self.parent ? self.parent.wizardData : 'No parent');
        console.log("window.controllerViewModel.wizardData:", window.controllerViewModel ? window.controllerViewModel.wizardData : 'No controller');

        alert('Customer data not available. Please start over.');
        return;
      }

      console.log("✅ Password update validation passed, updating password...");
      console.log("Customer data available:", customer);

      self.isUpdatingPassword(true);
      self.passwordUpdateMessage('Updating password...');

      // Prepare the update payload
      const updatePayload = {
        id: customer.id,
        account_number: customer.account_number,
        username: customer.username,
        password: newPwd  // Update with new password
      };

      console.log('Update payload:', updatePayload);

      // Make PUT request to update password
      fetch('http://localhost:8080/api/v1/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      })
      .then(response => {
        console.log("PUT response status:", response.status);
        console.log("PUT response ok:", response.ok);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Password update successful:', data);
        self.passwordUpdateMessage('✓ Password updated successfully!');

        // Navigate to successful registration page after a short delay
        setTimeout(() => {
          if (window.appRouter && typeof window.appRouter.go === 'function') {
            try {
              window.appRouter.go({ path: 'successful_registration' });
              console.log("Navigation to successful registration successful");
            } catch (err) {
              console.error('Navigation to successful registration failed:', err);
            }
          } else {
            console.error("Router not available for navigation");
            // Fallback: direct hash navigation
            window.location.hash = '#/successful_registration';
          }
        }, 1500);
      })
      .catch(error => {
        console.error('Password update error:', error);
        self.passwordUpdateMessage('✗ Error updating password. Please try again.');
        alert('Failed to update password. Please check your connection and try again.');
      })
      .finally(() => {
        self.isUpdatingPassword(false);
      });
    };

    // Initialize password strength on load
    self.passwordStrength();
  }
  return Login_DetailsViewModel_2;
});

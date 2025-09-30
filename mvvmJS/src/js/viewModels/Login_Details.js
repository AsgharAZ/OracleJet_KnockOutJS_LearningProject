define(['knockout'], function(ko) {
  function Login_DetailsViewModel(params) {
    const self = this;

    // Get parent controller for wizard navigation
    self.parent = (params && params.parent) ? params.parent : null;

    // Login details form fields
    self.username = ko.observable('');
    self.password = ko.observable('');
    self.confirmPassword = ko.observable('');

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
      // Validate required fields
      if (!self.username() || !self.password() || !self.confirmPassword()) {
        alert('Please fill in all required fields (Username, Password, Confirm Password).');
        return;
      }

      // Validate password match
      if (self.password() !== self.confirmPassword()) {
        alert('Password and Confirm Password do not match.');
        return;
      }

      // Validate password strength (minimum 8 characters)
      if (self.password().length < 8) {
        alert('Password must be at least 8 characters long.');
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
  return Login_DetailsViewModel;
});

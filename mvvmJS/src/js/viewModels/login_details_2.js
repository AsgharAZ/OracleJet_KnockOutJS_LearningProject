define(['knockout'], function(ko) {
  function Login_DetailsViewModel_2(params) {
    const self = this;

    // Get parent controller for wizard navigation
    self.parent = (params && params.parent) ? params.parent : null;

    // Security questions form fields
    self.securityQuestion1 = ko.observable('');
    self.securityAnswer1 = ko.observable('');
    self.securityQuestion2 = ko.observable('');
    self.securityAnswer2 = ko.observable('');

    // Security questions options
    self.securityQuestions = ko.observableArray([
      'What is your mother\'s maiden name?',
      'What was the name of your first pet?',
      'What was your first car?',
      'What elementary school did you attend?',
      'What is the name of the town where you were born?'
    ]);

    // Back button
    self.goBack = function () {
      if (self.parent && typeof self.parent.prevStep === 'function') {
        self.parent.prevStep();
      } else {
        console.error("prevStep not available in parent!");
      }
    };

    // Finish button (final step)
    self.finish = function () {
      // Validate required fields
      if (!self.securityQuestion1() || !self.securityAnswer1() ||
          !self.securityQuestion2() || !self.securityAnswer2()) {
        alert('Please fill in all security questions and answers.');
        return;
      }

      // Validate that different questions are selected
      if (self.securityQuestion1() === self.securityQuestion2()) {
        alert('Please select different security questions.');
        return;
      }

      // Show success message
      alert('Account setup completed successfully!');

      // You could redirect to login page or dashboard here
      // For example: window.location.href = 'login.html';
    };
  }
  return Login_DetailsViewModel_2;
});

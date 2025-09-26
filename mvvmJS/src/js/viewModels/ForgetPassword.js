define(['knockout'], function(ko) {
  function ForgetPasswordViewModel() {
    this.currentStep = ko.observable('Account_Type');
    const steps = ['Account_Type', 'Account_Details', 'Verification', 'Login_Details'];
    this.nextStep = function() {
      let idx = steps.indexOf(this.currentStep());
      if (idx < steps.length - 1) this.currentStep(steps[idx + 1]);
    }.bind(this);
    this.prevStep = function() {
      let idx = steps.indexOf(this.currentStep());
      if (idx > 0) this.currentStep(steps[idx - 1]);
    }.bind(this);
  }
  return ForgetPasswordViewModel;
});
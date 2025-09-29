define(['knockout', 'ojs/ojmodule-element-utils'], function(ko, moduleUtils) {
  function AccountTypeViewModel(params) {
    const self = this;

    if (!params || !params.$parent) {
      console.error("No parent passed to account_type.js");
    }
    // Bind to the parent ControllerViewModel
    self.parent = params.$parent;
    console.log(parent)
    
    // Selected account type
    self.selectedAccountType = ko.observable('');

    // CNIC input
    self.cnicNumber = ko.observable('');

    // Account type buttons click handlers
    self.selectIndividual = function() { self.selectedAccountType('Individual'); };
    self.selectSoleProprietor = function() { self.selectedAccountType('Sole Proprietor'); };
    self.selectForeignNational = function() { self.selectedAccountType('Foreign National'); };

    // Back button
    self.goBack = function() {
      if (self.parent && self.parent.prevStep) {
        self.parent.prevStep();
      }
    };

    // Next button    // Go Next
    self.goNext = function() {
      if (!self.selectedAccountType()) {
        alert('Please select an account type before proceeding.');
        return;
      }
      const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
      if (!cnicPattern.test(self.cnicNumber())) {
        alert('Please enter a valid CNIC number (XXXXX-XXXXXXX-X).');
        return;
      }

      // Parent navigation
      if (self.parent && self.parent.nextStep) {
        self.parent.nextStep();
        console.log("Next clicked");
      } else {
        console.error("Parent or nextStep is undefined!");
      }
    };
  }
  return AccountTypeViewModel;
});

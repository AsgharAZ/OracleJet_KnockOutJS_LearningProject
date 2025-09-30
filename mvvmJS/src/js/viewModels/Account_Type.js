define(['knockout', 'ojs/ojmodule-element-utils'], function (ko, moduleUtils) {
  function AccountTypeViewModel( ) {
    const self = this;

    console.log('>>> AccountTypeViewModel instantiated. params =', params);

    // self.parent = (params && params.parent) ? params.parent : null;

    console.log(params && params.parent);
    console.log(params);
    console.log(params.parent);


    if (params && params.parent) {
      self.parent = params.parent;
    } else {
      console.warn("⚠️ No parent passed to AccountTypeViewModel");
      self.parent = null; // fallback to null so code doesn't crash
    }

    
    if (self.parent) {
      console.log("Parent received in AccountType:", self.parent);
    } else {
      console.warn("No parent passed to account_type.js");
    }

    // Selected account type
    self.selectedAccountType = ko.observable('');

    // CNIC input
    self.cnicNumber = ko.observable('');

    // Account type buttons
    self.selectIndividual = () => self.selectedAccountType('Individual');
    self.selectSoleProprietor = () => self.selectedAccountType('Sole Proprietor');
    self.selectForeignNational = () => self.selectedAccountType('Foreign National');

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
      if (!self.selectedAccountType()) {
        alert('Please select an account type before proceeding.');
        return;
      }

      const cnicPattern = /^(\d{13}|\d{5}-\d{7}-\d{1})$/;
      if (!cnicPattern.test(self.cnicNumber())) {
        alert('Please enter a valid CNIC number (XXXXX-XXXXXXX-X).');
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

  return AccountTypeViewModel;
});

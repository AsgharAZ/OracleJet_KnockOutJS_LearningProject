define(['../accUtils', 'knockout'],
function(accUtils, ko) {
  function AccountDetails(params) {
    const self = this;

    // Get parent controller for wizard navigation
    if (params && params.parent) {
      self.parent = params.parent;
    } else {
      // Fallback: try to get parent from global appRouter
      if (window.appRouter && window.appRouter.parent) {
        self.parent = window.appRouter.parent;
      } else {
        console.warn("⚠️ No parent passed to AccountDetails");
        self.parent = null;
      }
    }

    // Account details form fields
    self.firstName = ko.observable('');
    self.lastName = ko.observable('');
    self.email = ko.observable('');
    self.phone = ko.observable('');
    self.address = ko.observable('');

    this.connected = () => {
      console.log('Account Details ViewModel loaded'); // Debug log
      accUtils.announce('Account Details page loaded.', 'assertive');
      document.title = "Account Details";
    };

    this.disconnected = () => {};

    this.transitionCompleted = () => {};

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
      
      if (self.parent && typeof self.parent.nextStep === 'function') {
        console.log("Next clicked, calling parent.nextStep()");
        self.parent.nextStep();
      } else {
        console.error("Parent or nextStep is undefined!");
      }
    };
  }
  return AccountDetails;
});

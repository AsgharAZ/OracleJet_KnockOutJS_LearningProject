define(['../accUtils', 'knockout'], 
function(accUtils, ko) {
  function AccountDetails() {
    this.connected = () => {
      console.log('Account Details ViewModel loaded'); // Debug log
      accUtils.announce('Account Details page loaded.', 'assertive');
      document.title = "Account Details";
    };
    this.disconnected = () => {};
    this.transitionCompleted = () => {};
  }
  return AccountDetails;
});
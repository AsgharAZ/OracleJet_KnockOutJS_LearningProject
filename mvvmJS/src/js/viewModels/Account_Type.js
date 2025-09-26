
// define([], function() {
//   function Account_TypeViewModel(params) {
//     this.nextStep = params.nextStep;
//     this.prevStep = params.prevStep;
//     // Add any observables or logic for account type selection here
//   }
//   return Account_TypeViewModel;
// });


define(['../accUtils'],
 function(accUtils) {
    function Account_TypeViewModel() {
      this.connected = () => {
        accUtils.announce('Account Type page loaded.', 'assertive');
        document.title = "Account_Type";
        // Implement further logic if needed
      };
      this.disconnected = () => {
      };

      this.transitionCompleted = () => {
      };
    }


  return Account_TypeViewModel;
  }
);

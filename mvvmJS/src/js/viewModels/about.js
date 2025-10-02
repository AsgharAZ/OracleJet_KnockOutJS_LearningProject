
define(['../accUtils'],
 function(accUtils) {
    function AboutViewModel() {

      this.connected = () => {
        accUtils.announce('About page loaded.', 'assertive');
        document.title = "About";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        // Implement if needed
      };
      this.transitionCompleted = () => {
        // Implement if needed
      };
    }
    return AboutViewModel;
  }
);

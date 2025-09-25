
define(['../accUtils'],
 function(accUtils) {
    function AboutViewModel() {
      this.connected = () => {
        accUtils.announce('About page loaded.', 'assertive');
        document.title = "About";
        // Implement further logic if needed
      };
      this.disconnected = () => {
      };

      this.transitionCompleted = () => {
      };
    }


    return AboutViewModel;
  }
);

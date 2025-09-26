
define(['../accUtils'],
 function(accUtils) {
    function Login_Page() {
      this.connected = () => {
        accUtils.announce('Login page loaded.', 'assertive');
        document.title = "Login_Page";
        // Implement further logic if needed
      };
      this.disconnected = () => {
      };

      this.transitionCompleted = () => {
      };
    }


  return Login_Page;
  }
);

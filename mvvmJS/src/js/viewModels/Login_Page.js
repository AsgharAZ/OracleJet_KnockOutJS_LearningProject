define(['knockout', 'ojs/ojlogger'], function(ko, Logger) {
  function LoginViewModel(params) {
    var self = this;

    // form observables
    self.username = ko.observable('');
    self.password = ko.observable('');
    self.remember = ko.observable(false);

    // password show/hide state
    self.passwordVisible = ko.observable(false);

    // Theme state management
    self.isPremiumTheme = ko.observable(false);

    // Theme toggle function
    self.toggleTheme = function(data, event) {
      if (event && typeof event.preventDefault === 'function') event.preventDefault();

      const newThemeState = !self.isPremiumTheme();
      self.isPremiumTheme(newThemeState);
      self.applyTheme(newThemeState);

      console.log('Theme toggled to:', newThemeState ? 'Premium' : 'Normal');
      return false;
    };

    // Apply theme function
    self.applyTheme = function(isPremium) {
      const root = document.documentElement;

      if (isPremium) {
        // Premium theme: grayscale background + gold accent color
        root.style.setProperty('--primary-purple', '#e1b838');
        root.style.setProperty('--primary-green', '#e1b838');

        // Apply grayscale filter to background
        const bgWrapper = document.querySelector('.dashboard-bg-wrapper');
        if (bgWrapper) {
          bgWrapper.style.filter = 'grayscale(100%)';
        }
      } else {
        // Normal theme: original colors + normal background
        root.style.setProperty('--primary-purple', '#6e1e7d');
        root.style.setProperty('--primary-green', '#1ab437');

        // Remove grayscale filter from background
        const bgWrapper = document.querySelector('.dashboard-bg-wrapper');
        if (bgWrapper) {
          bgWrapper.style.filter = 'none';
        }
      }
    };

    self.togglePasswordVisibility = function (data, event) {
      self.passwordVisible(!self.passwordVisible());
      var pwd = document.getElementById('password');
      if (pwd) pwd.type = self.passwordVisible() ? 'text' : 'password';
      // prevent default if used on anchor/button with href
      if (event && typeof event.preventDefault === 'function') event.preventDefault();
      return false;
    };

    // Login handler (called by form submit or login button)
    self.login = function (data, event) {
      if (event && typeof event.preventDefault === 'function') event.preventDefault();

      // TODO: add real authentication here
      Logger.info('Attempting login for: ' + self.username());

      // Navigate to account_type using the globally exposed router
      navigateToState('account_type');
      return false;
    };

    // Forget login details — bound to the "Forget Login Details?" link
    self.forgetLogin = function (data, event) {
      if (event && typeof event.preventDefault === 'function') event.preventDefault();

      navigateToState('account_type');
      return false;
    };

    // Register handler (example)
    self.register = function (data, event) {
      if (event && typeof event.preventDefault === 'function') event.preventDefault();
      // navigate or open register page as you wish
      navigateToState('account_type'); // adjust if you have a different register route
      return false;
    };

    // Safe navigation helper that uses window.appRouter.go(...)
    function navigateToState(stateId) {
      // debugger;
      // console.log('11111', stateId);
      if (typeof stateId !== 'string' || stateId.length === 0) {
        console.log('in if');
        console.error('navigateToState called with invalid stateId:', stateId);
        console.log('out if');
        
        return;
      }

      // Prefer the appController's router if available
      if (window.appRouter && typeof window.appRouter.go === 'function') {
        // console.log('in if');

        try {
        // console.log('in try');

          // IMPORTANT: don't use a leading slash here — pass the exact state id
          window.appRouter.go({ path: stateId });
          return;
        } catch (err) {
          console.error('window.appRouter.go failed:', err);
        }
      }

      // Fallbacks so the user still navigates instead of throwing an uncaught error:
      // 1) try oj.Router.rootInstance if it's been wired
      try {
        // console.log('in 2 try');

        if (oj && oj.Router && oj.Router.rootInstance && typeof oj.Router.rootInstance.go === 'function') {
          oj.Router.rootInstance.go(stateId);
          return;
        }
      } catch (err2) {
        console.error('oj.Router.rootInstance.go failed:', err2);
      }

      // 2) Last-resort: change hash so the browser navigates to the view (SPA-style)
      //    This assumes your app can handle the hash format #/stateName
      console.warn('Routing to state via hash fallback. Ensure route exists: ', stateId);
      // console.log('2',stateId);
      window.location.hash = '#/' + stateId;
      console.log('3',stateId);

    }
  }

  return LoginViewModel;
});

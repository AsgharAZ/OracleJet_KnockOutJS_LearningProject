/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */


// /__AMD (Asynchronous Module Definition)__
define(['knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
        'ojs/ojdrawerpopup', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function(ko, Context, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider) {       
    var currentIndex = 0;
              // console.log('STATE IDDDDD', window.appRouter.currentState().id);

     function ControllerViewModel() {
      // debugger
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Handle announcements sent when pages change, for Accessibility. 
      //That block handles accessibility announcements — it’s for screen readers (ARIA live region updates)
      this.manner = ko.observable('polite');
      this.message = ko.observable();
      announcementHandler = (event) => {
          this.message(event.detail.message);
          this.manner(event.detail.manner);
      };
      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


      // Media queries for responsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      let navData = [
          { path: '', redirect: 'login_Page' },
          { path: 'login_Page', detail: { label: 'Login', iconClass: 'oj-ux-ico-contact-group' } },
          { path: 'account_type', detail: { label: 'account_type', iconClass: 'oj-ux-ico-contact' } },
          { path: 'account_details', detail: { label: 'account_details', iconClass: 'oj-ux-ico-contact' } },
          { path: 'login_details', detail: { label: 'login_details', iconClass: 'oj-ux-ico-contact' } },
          { path: 'login_details_2', detail: { label: 'login_details_2', iconClass: 'oj-ux-ico-contact' } },
          { path: 'successful_registration', detail: { label: 'successful_registration', iconClass: 'oj-ux-ico-contact' } }
      ];

 

// etc.

      //const self = this; saves the current this context into self, 
      // so inner functions (like callbacks) can still access the outer object, 
      // since this can change inside nested scopes.
      const self = this;

      // Define wizard steps in order
      self.steps = ['account_type', 'account_details', 'login_details', 'login_details_2'];

      // Get current step index
      self.getCurrentStepIndex = function() {
        //picks the app router instance.
        const currentRouter = window.appRouter || router;
        console.log('Current router:', currentRouter);
        console.log('Router type:', typeof currentRouter);
        console.log('Current state method:', typeof currentRouter.currentState);

        //does currentRouter exists and checks if currentRouter.currentstate is a function or not
        if (currentRouter && typeof currentRouter.currentState === 'function') {
          const currentState = currentRouter.currentState();
          console.log('Current state:', currentState);
          return self.steps.indexOf(currentState.id);
        } else {
          console.error('Router or currentState method not available');
          return 0; // fallback to first step
        }
      };

      // Navigate to next step
      self.nextStep = function() {
        console.log('nextStep called');
        const currentStep = self.currentStep();
        console.log('Current step:', currentStep);

        if (!currentStep) {
          console.error('Current step is undefined, cannot navigate');
          return;
        }

        currentIndex = self.steps.indexOf(currentStep);
        console.log('Current index:', currentIndex);

        // /Checks if the current step is not the last step and is valid.
        if (currentIndex < self.steps.length - 1 && currentIndex >= 0) {



          // console.log('Before nextStep index:', currentIndex);

          // if (currentStep == 'account_type') { console.log("N-SETTING 0 "); currentIndex = 0; }
          // if (currentStep == 'account_details') { console.log("N-SETTING 1 "); currentIndex = 1; }
          // if (currentStep == 'login_details') { console.log("N-SETTING 2 "); currentIndex = 2; }
          // if (currentStep == 'login_details') { console.log("SETTING 3 "); currentIndex = 3; }

          // console.log('Before nextStep after edit index:', currentIndex);

          const nextStep = self.steps[currentIndex + 1];

          const currentRouter = window.appRouter || router;

          if (currentRouter && typeof currentRouter.go === 'function') {
            console.log('Calling router.go with:', nextStep);

            // Update currentStep immediately before navigation
            console.log('Updating currentStep to:', nextStep);
            self.currentStep(nextStep);

            // Then navigate
            currentRouter.go({ path: nextStep });
            /////

            console.log('Navigation with path format succeeded');
          } else {
            console.error('Router go method not available. Router:', currentRouter);
          }
        } else {
          console.log('No next step available or invalid current index');
        }
      };

      // Navigate to previous step
      self.prevStep = function() {
        console.log('prevStep called');
        const currentStep = self.currentStep();
        console.log('Current step:', currentStep);

        if (!currentStep) {
          console.error('Current step is undefined, cannot navigate back');
          return;
        }

        currentIndex = self.steps.indexOf(currentStep);
        console.log('Current index:', currentIndex);
        
        // if (currentStep == 'account_type') { console.log("N-SETTING 0 "); currentIndex = 0; }
        // if (currentStep == 'account_details') { console.log("N-SETTING 1 "); currentIndex = 1; }
        // if (currentStep == 'login_details') { console.log("N-SETTING 2 "); currentIndex = 2; }
        // if (currentStep == 'login_details') { console.log("SETTING 3 "); currentIndex = 3; }

        if (currentIndex >= 0) {
          const prevStep = self.steps[currentIndex - 1];
          console.log('Navigating to previous step:', prevStep);
          const currentRouter = window.appRouter || router;
          if(currentIndex == 0){
          currentRouter.go({path: 'login_page'});
        }
          if (currentRouter && typeof currentRouter.go === 'function') {
            self.currentStep(prevStep);
            currentRouter.go({ path: prevStep });
          } else {
            console.error('Router go method not available');
          }
        } else {
          console.log('No previous step available');
        }
      };

      // Check if current step has next step, isn't used as far as I know
      self.hasNextStep = function() {
        const currentIndex = self.getCurrentStepIndex();
        return currentIndex < self.steps.length - 1;
      };

      // Check if current step has previous step, isn't used as far as I know
      self.hasPrevStep = function() {
        const currentIndex = self.getCurrentStepIndex();
        return currentIndex > 0;
      };

      // Get current step name - initialize with first step
      self.currentStep = ko.observable(self.steps[0]);
      console.log('Initial current step set to:', self.currentStep());

      // Shared data storage for wizard flow
      self.wizardData = {
        customerData: ko.observable(null)
      };

      // Router setup, creates a new router instance.
      // CoreRouter, from ojs/ojcorerouter
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter() //tells the router how to manage URLs, PathAdapter would use normal path segments compared to query ones
      });
      router.sync();


// It connects the router to your main ViewModel (controller) and keeps the wizard state in sync whenever navigation changes.
// other ViewModels or modules in your app access the same router instance (shared navigation).


      //
      window.appRouter = router;          // allow other ViewModelss to use the same router instance
      window.controllerViewModel = self;  // allow other VMs to access the controller instance, Exposes the ControllerViewModel instance globally.
      // Set parent on router for fallback access,       //(a fallback linkage).
      router.parent = self;


      // Subscribe to router state changes after router is created
      //router.currentState is a Knockout observable that updates whenever the user navigates to a new route.
      router.currentState.subscribe(function(state) {
        console.log('Router state changed:', state);
        console.log('State details:', {
          id: state.id, // route ID (like 'account_details')
          path: state.path, // URL path
          detail: state.detail, // route metadata (labels, icons)
          fullState: state // the entire state object
        });
        // ensures the new state is valid and has an ID, then updates it.
        if (state && state.id) {
          console.log('Setting current step to:', state.id);

          // RESETS wizard state when returning to login page
          if (state.id === 'login_Page') {
            console.log('Returned to login page, resetting wizard state');
            self.currentStep(self.steps[0]); // Reset to first wizard step
            self.currentIndex = 0;
            currentIndex = 0; // Reset the global currentIndex variable
            console.log('Reset currentIndex to:', currentIndex);
          } else { //OTHERWISE, normal state change
            self.currentStep(state.id);
            // Sync global currentIndex with the current step
            const stepIndex = self.steps.indexOf(state.id);
            if (stepIndex !== -1) {
              currentIndex = stepIndex;
              self.currentIndex = stepIndex;
              console.log('Synced currentIndex to:', currentIndex);
            }
          }
        }
      });

      // Additional reset mechanism for login page navigation
      // Listen for specific navigation events or check current path
      const originalGo = router.go.bind(router);
      router.go = function(config) {
        console.log('Router.go called with config:', config);

        // Check if navigating to login page
        if (config && config.path === 'login_Page') {
          console.log('Navigating to login page, resetting wizard state');
          self.currentStep(self.steps[0]); // Reset to first wizard step
          self.currentIndex = 0;
          currentIndex = 0; // Reset the global currentIndex variable
          console.log('Reset currentIndex to:', currentIndex);
        }

        // Call original go method
        return originalGo(config);
      };

      // Also listen for ojRouter events, like route or page changes, listener updates your current observeable
      document.addEventListener('ojRouterStateChanged', function(event) {
        console.log('ojRouterStateChanged event:', event.detail);
        if (event.detail.stateId) {
          console.log('Setting current step from event to:', event.detail.stateId);
          self.currentStep(event.detail.stateId);
        }
      });

      // Router state will be updated via subscription
      // Initial currentStep is already set to first step above

      // Pass the ControllerViewModel instance as $parent
      //ModuleRouterAdapter links the router to OJET’s module system, which loads the correct HTML/JS module for each route.
      this.moduleAdapter = new ModuleRouterAdapter(router, {
        params: { parent: self }
      });
      //params: { parent: self } passes this controller as $parent to those modules — letting nested modules call parent methods (like nextStep()).

      this.selection = new KnockoutRouterAdapter(router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(navData.slice(1), {keyAttributes: "path"});

      // Drawer
      self.sideDrawerOn = ko.observable(false);

      // Close drawer on medium and larger screens
      this.mdScreen.subscribe(() => { self.sideDrawerOn(false) });

      // Called by navigation drawer toggle button and after selection of nav drawer item
      this.toggleDrawer = () => {
        self.sideDrawerOn(!self.sideDrawerOn());
      }

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("App Name");
      // User Info used in Global Navigation area
      this.userLogin = ko.observable("john.hancock@oracle.com");

      // Footer
      this.footerLinks = [
        {name: 'About Oracle', linkId: 'aboutOracle', linkTarget:'http://www.oracle.com/us/corporate/index.html#menu-about'},
        { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
        { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
        { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
        { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
      ];
     }
     // release the application bootstrap busy state
     Context.getPageContext().getBusyContext().applicationBootstrapComplete();

     return new ControllerViewModel();
  }
);

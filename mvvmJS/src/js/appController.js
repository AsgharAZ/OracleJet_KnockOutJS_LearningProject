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



define(['knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
        'ojs/ojdrawerpopup', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function(ko, Context, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider) {       
    var currentIndex = 0;
              // console.log('STATE IDDDDD', window.appRouter.currentState().id);

     function ControllerViewModel() {
      // debugger
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Handle announcements sent when pages change, for Accessibility.
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
          { path: 'login_details_2', detail: { label: 'login_details_2', iconClass: 'oj-ux-ico-contact' } }
      ];

      // Pre-loading all viewModels using Require.JS for SRS Navigation
      ko.components.register('login_Page', {
        viewModel: { require: 'viewModels/login_page' },
        template: { require: 'text!views/login_page.html' }
      });

      ko.components.register('account_type', {
        viewModel: { require: 'viewModels/account_type' },
        template: { require: 'text!views/account_type.html' }
      });

      ko.components.register('account_details', {
        viewModel: { require: 'viewModels/account_details' },
        template: { require: 'text!views/account_details.html' }
      });

      ko.components.register('login_details', {
        viewModel: { require: 'viewModels/login_details' },
        template: { require: 'text!views/login_details.html' }
      });

      ko.components.register('login_details-2', {
        viewModel: { require: 'viewModels/login_details_2' },
        template: { require: 'text!views/login_details_2.html' }
      });

// etc.


      const self = this;

      // Define wizard steps in order
      self.steps = ['account_type', 'account_details', 'login_details', 'login_details_2'];

      // Get current step index
      self.getCurrentStepIndex = function() {
        const currentRouter = window.appRouter || router;
        console.log('Current router:', currentRouter);
        console.log('Router type:', typeof currentRouter);
        console.log('Current state method:', typeof currentRouter.currentState);

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
        currentStep = self.currentStep();
        console.log('Current step:', currentStep);
        // const currentIndex = self.steps.indexOf(currentStep);
        currentIndex = self.steps.indexOf(currentStep);
        console.log('Current index:', currentIndex);

        if (currentIndex < self.steps.length - 1 && currentIndex >= 0) {



          // console.log('Before nextStep index:', currentIndex);

          // // if (currentStep == 'account_type') { console.log("N-SETTING 0 "); currentIndex = 0; }
          // // if (currentStep == 'account_details') { console.log("N-SETTING 1 "); currentIndex = 1; }
          // // if (currentStep == 'login_details') { console.log("N-SETTING 2 "); currentIndex = 2; }
          // // if (currentStep == 'login_details') { console.log("SETTING 3 "); currentIndex = 3; }

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
        currentStep = self.currentStep();
        console.log('Current step:', currentStep);
        //const currentIndex = self.steps.indexOf(currentStep); //change
        currentIndex = self.steps.indexOf(currentStep);
        console.log('Current index:', currentIndex);
        
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
        if (currentIndex == 0) { console.log("P-SETTING 0 "); currentStep = 'account_type'; }
        if (currentIndex == 1) { console.log("P-SETTING 1 "); currentStep = 'account_details'; }
        if (currentIndex == 2) { console.log("P-SETTING 2 "); currentStep = 'login_details'; }
        if (currentIndex == 3) { console.log("P-SETTING 3 "); currentStep = 'login_details_2'; }
      };

      // Check if current step has next step
      self.hasNextStep = function() {
        const currentIndex = self.getCurrentStepIndex();
        return currentIndex < self.steps.length - 1;
      };

      // Check if current step has previous step
      self.hasPrevStep = function() {
        const currentIndex = self.getCurrentStepIndex();
        return currentIndex > 0;
      };

      // Get current step name - initialize with first step
      self.currentStep = ko.observable(self.steps[0]);
      console.log('Initial current step set to:', self.currentStep());

      // Router setup
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      // add these after router.sync();
      window.appRouter = router;          // allow other VMs to use the same router instance
      // Set parent on router for fallback access
      router.parent = self;
      // oj.Router.rootInstance = router;   // optional but useful for compatibility with code that uses oj.Router.rootInstance

      // Subscribe to router state changes after router is created
      router.currentState.subscribe(function(state) {
        console.log('Router state changed:', state);
        console.log('State details:', {
          id: state.id,
          path: state.path,
          detail: state.detail,
          fullState: state
        });
        if (state && state.id) {
          console.log('Setting current step to:', state.id);

          // Reset wizard state when returning to login page
          if (state.id === 'login_Page') {
            console.log('Returned to login page, resetting wizard state');
            self.currentStep(self.steps[0]); // Reset to first wizard step
            self.currentIndex = 0;
            console.log(currentIndex);
          } else {
            self.currentStep(state.id);
          }
        }
      });

      // Also listen for ojRouter events
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
      this.moduleAdapter = new ModuleRouterAdapter(router, {
        params: { parent: self }
      });

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

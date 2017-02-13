(function() {
  'use strict';

  angular
    .module('postbuzzDemo')
    .controller('AppController', AppController);

  AppController.$inject = ['AuthService', '$rootScope', '$state', 'ngNotify'];

  /** @ngInject */
  function AppController(AuthService, $rootScope, $state,  ngNotify) {
    var vm = this;

    (function initController() {
      ngNotify.dismiss();
      AuthService.initialize();
    })();

    var error = $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      if (error.status === 401) {
        $state.go('login');
      }
    });
  }
})();

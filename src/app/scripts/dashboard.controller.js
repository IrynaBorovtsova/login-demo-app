(function() {
  'use strict';

  angular
    .module('postbuzzDemo')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['AuthService', '$state', 'isAuthenticated', '$window', 'ngNotify'];

  /** @ngInject */
  function DashboardController(AuthService, $state, isAuthenticated, $window, ngNotify) {
    var vm = this;
    ngNotify.dismiss();

    (function initController() {
      vm.userInfo = isAuthenticated;
    })();

    vm.logout = function() {
      AuthService.clearCache();
      $window.localStorage.removeItem('Postbuzz.access_token');
      $state.go('login');
    };
  }
})();

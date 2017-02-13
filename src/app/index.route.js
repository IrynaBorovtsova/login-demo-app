(function() {
  'use strict';

  angular
    .module('postbuzzDemo')
    .factory('BearerAuthInterceptor', BearerAuthInterceptor)
    .config(routerConfig);

  BearerAuthInterceptor.$inject = ['$window', '$q'];
  routerConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
  /** @ngInject */
  function BearerAuthInterceptor($window, $q) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        var token = $window.localStorage.getItem('Postbuzz.access_token');

        if (token && config.url.indexOf('Token') == -1) {
          config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config || $q.when(config);
      },
      response: function(response) {
        if (response.status !== 401) {
          //  Redirect user to login page / signup Page.
        }
        return response || $q.when(response);
      }
    };
  }

  function routerConfig($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/',
        templateUrl: 'app/templates/dashboard.tpl.html',
        resolve: {
          isAuthenticated: function(PostbuzzService) {
            return PostbuzzService.userInfo();
          }
        },
        controller: 'DashboardController',
        controllerAs: 'ctrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/templates/login.tpl.html',
        controller: 'LoginController',
        controllerAs: 'formctrl'
      });

    $urlRouterProvider.otherwise('/');
    $httpProvider.interceptors.push('BearerAuthInterceptor');
  }
})();

(function() {
  'use strict';

  angular
    .module('postbuzzDemo')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['AuthService', 'PostbuzzService', '$log', '$state', '$window', '$http', 'ngNotify'];

  /** @ngInject */
  function LoginController(AuthService, PostbuzzService, $log, $state, $window, $http, ngNotify) {
    var vm = this;

    var messages = {
      required: 'Enter required fields.',
      email: 'Not valid email.'
    };

    vm.connect = function(provider) {
      $log.log(provider + ' provider');
      AuthService.connect(provider).then(function(resp) {
        if (AuthService.isReady()) {
          $log.log('ready', resp);
          var params = {};
          switch (resp.provider) {
            case 'facebook':
              params = {
                provider: 'Facebook',
                externalAccessToken: resp.access_token
              };
              break;
            case 'twitter':
              params = {
                provider: 'Twitter',
                externalAccessToken: resp.oauth_token,
                externalAccessTokenSecret: resp.oauth_token_secret
              };
              break;
          }
          PostbuzzService.obtainExternalToken(params).then(function(resp) {
            $window.localStorage.setItem('Postbuzz.access_token', resp.data.access_token);
            $state.go('dashboard');
          }, function(respErr) {
            ngNotify.set(respErr.data['Message']);
          });
        }
      });
    };

    vm.login = function(form) {
      vm.submitted = true;
      if (form.$valid) {
        PostbuzzService.accessToken({
          username: vm.username,
          password: vm.password,
          grant_type: 'password'
        }).then(function(resp) {
          $window.localStorage.setItem('Postbuzz.access_token', resp.data.access_token);
          PostbuzzService.userInfo().then(function() {
            $state.go('dashboard');
          });
        }, function(errResp) {
          ngNotify.set(errResp.data.error);
        });
      } else {
        var errors = [];
        angular.forEach(form.$error, function(value, key) {
          errors.push(messages[key]);
        });
        ngNotify.set(errors.join(' '));
      }
    };

    vm.forgotPassword = function(e) {
      e.preventDefault();
      if (vm.username) {
        PostbuzzService.forgotPassword({
          email: vm.username,
          redirectUrl: 'http://localhost:3000'
        }).then(function() {
          ngNotify.set('Reset password request was sent to ' + vm.username, {
            type: 'info'
          });
        }, function(respErr) {
          ngNotify.set(respErr.data['Message']);
        });
      } else {
        ngNotify.set('Please enter email which will be sent password reset request to.');
      }
    };

    vm.reset = function(e, form) {
      e.preventDefault();
      vm.username = undefined;
      vm.password = undefined;
      vm.submitted = undefined;
      form.$setUntouched();
    };
  }
})();

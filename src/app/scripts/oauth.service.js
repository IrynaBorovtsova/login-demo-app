(function() {
  'use strict';

  angular
    .module('postbuzzDemo')
    .factory('OAuth', function($window) {
      return $window.OAuth;
    })
    .factory('AuthService', AuthService);

  AuthService.$inject = ['$q', 'OAuth'];

  /** @ngInject */
  function AuthService($q, OAuth) {
    var authorizationResult = false;
    var providers = {};

    return {
      initialize: function() {
        //initialize OAuth.io with public key of the application
        OAuth.initialize('HSmnauzh9jwpm90QNAsBBVBxk68', {
          cache: true
        });
        //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
        providers = {
          facebook: OAuth.create('facebook'),
          twitter: OAuth.create('twitter')
        };
      },
      isReady: function() {
        return (authorizationResult);
      },
      connect: function(provider) {
        var deferred = $q.defer();
        OAuth.popup(provider, {
          cache: true
        }, function(error, result) { //cache means to execute the callback if the tokens are already present
          if (!error) {
            authorizationResult = result;
            return deferred.resolve(result);
          }
        });
        return deferred.promise;
      },
      clearCache: function() {
        OAuth.clearCache();
        authorizationResult = false;
      }
    };
  }
})();

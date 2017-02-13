(function() {
  'use strict';

  angular
    .module('postbuzzDemo')
    .factory('PostbuzzService', PostbuzzService);

  PostbuzzService.$inject = ['$q', '$http', '$httpParamSerializerJQLike'];

  /** @ngInject */
  function PostbuzzService($q, $http, $httpParamSerializerJQLike) {
    var baseUrl = 'https://postbuzzwebapidev.azurewebsites.net';

    return {
      accessToken: function(data) {
        return $http({
          url: baseUrl + '/Token',
          method: 'POST',
          data: $httpParamSerializerJQLike(data),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      },
      obtainExternalToken: function(data) {
        return $http({
          url: baseUrl + '/api/Account/ObtainLocalAccessToken',
          method: 'GET',
          params: data
        });
      },
      userInfo: function() {
        return $http({
          url: baseUrl + '/api/Account/UserInfo',
          method: 'GET'
        }).then(function(resp){
          return resp.data;
        });
      },
      forgotPassword: function(data){
        return $http({
          url: baseUrl + '/api/Account/ForgotPassword',
          method: 'GET',
          params: data
        });
      }
    };
  }
})();

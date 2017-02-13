(function() {
  'use strict';

  angular
    .module('postbuzzDemo', ['ngCookies', 'ngResource', 'ngTouch', 'ui.router', 'jsonFormatter', 'ngNotify'])
    .run(function(ngNotify) {
      //Error notification config
      ngNotify.config({
        theme: 'pure',
        position: 'bottom',
        type: 'error',
        sticky: true,
        button: true,
        html: false
      });
    });

})();

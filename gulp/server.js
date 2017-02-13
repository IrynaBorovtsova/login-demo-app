'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
  server.middleware = proxyMiddleware('/api/Account/UserInfo', {
    target: 'http://postbuzzwebapidev.azurewebsites.net/',
    changeOrigin: true,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      //  console.log('override', req);
      proxyReq.setHeader('X-Http-Method-Override', 'POST');
      //  proxyReq.headers['X-Http-Method-Override'] = 'GET'; // add new header to response
      //  proxyReq.setHeader('Authorization','Bearer KsiEq5FcDRtUJTZEKaJh1tomFHWSCqYPTXd5GWHArYCtxW1M6gaBab8gCoS2QMEc7wwFEcM-ILGYuGyF-Wo5XD7pvG24oQfMBiukE7Cj_3aOc7M7cN_fTuo6U6fRVHvE3pwf019C_UZ0eVVRrHye4_iwCSA3PAeaQpRtAwlkLuBpV6f_fOouQIfUyhh8sGeoNVe_XEA1ve4OufOiEN3nUKjcHOkzjTM8F_N1C-vDLurwi0Lajispf_QsXgvpN_QLZ5azZs0q_uPaNvhyBbsg9p8BsZ9M8aAp6w2o0OOEe7TpDJLPLMaeIqRFKJWPqZ65GrvJICO8cskPZ-yXzTb8GrnHJpAUL0QzehH1l3DOG34QYgAOf0ZDytBZAdWjFoGYxIkbAmBGrLpvQ9oknVYhj9eLCWrJhFY3JY-sHWAA-L6fVxGgZVeGz7yh2nbrlnoe3kuD4dVqaPI33u4Rm_qW6YTkPz2pLZCTZnJKwhf6zYQCKkNc_TS0SjKdflD1DzIw');
    },
    onProxyRes: function(proxyRes, req, res) {
      proxyRes.headers['X-Http-Method-Override'] = 'POST';
    }
  });

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]' // Only needed for angular apps
}));

gulp.task('serve', ['watch'], function() {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function() {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function() {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function() {
  browserSyncInit(conf.paths.dist, []);
});

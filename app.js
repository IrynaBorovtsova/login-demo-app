var express = require('express');
var app = express();

var allowCrossDomain = function(req, res, next) {
    if ('OPTIONS' == req.method) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.send(200);
    }
    else {
      next();
    }
};

var port = process.env.PORT || 3000;

app.use(allowCrossDomain);
app.use(express.static(__dirname + '/app'));

var server = app.listen(port, function() {
  console.log('Demo app listening at http://localhost:%s', port);
});

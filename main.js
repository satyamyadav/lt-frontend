require('./appRequire')();
require('app-module-path').addPath(__dirname + '/server');

var bodyParser = require('body-parser');

// So that JSON.stringify(date) doesn't fuck things up
Date.prototype.toJSON = Date.prototype.toString;

var config = require('config');
var passport = require('passport');
var routes = require('routes');

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

// set up static file serving from node
//if (process.env.NODE_SERVE_STATIC === '1') {
  var publicDir = config.app.publicDir;
  app.use(require('serve-static')(publicDir));
//}

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/** setup some basic middlewares **/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
// parse application/json
app.use(bodyParser.json());
// parse multipart/form-data
app.use(require('multer')({dest: config.app.uploadsDir}));
// enable method overrides for older browsers
app.use(require('method-override')('X-HTTP-Method-Override'));

// set up cookies
app.use(require('cookie-parser')());


// set up sessions
var session = require('express-session');

var options = {
  secret: (new Buffer('lt-webapp')).toString('base64'),
  saveUninitialized: false,
  resave: false,
  cookie: {maxAge: 24 * 60 * 60 * 1000 /* one day in microseconds */}
};

// if (process.env.NODE_ENV === 'production') {
if (false) {
  // use redis in production, where the app is being run in a process cluster
  var RedisStore = require('connect-redis')(session);
  options.store = new RedisStore({
    prefix: 'dev.api.',
    host: 'pub-redis-15073.us-east-1-4.3.ec2.garantiadata.com',
    port: '15073',
    password: 'scrietredis'

  });
} else {
  var FileStore = require('session-file-store')(session);
  options.store = new FileStore({path: config.app.sessionDir});
}

app.use(session(options));


// passportJs support
app.use(passport.initialize());
app.use(passport.session());











var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/img/favicon.ico'));


  var log = require('metalogger')();
  // catch-all error handler for production
  app.use(function catchAllErrorHandler (err, req, res, next) {
    // emergency means things are going down
    console.log(err);
    log.emergency(err.stack);
    res.sendStatus(500);

    // properly log the errors, and send the response before crushing the process.
    setTimeout(function () {
      process.exit(1);
    }, 500);
  });



app.use(routes);


/*app.get('/', function(request, response) {
  response.send({msg: "oal live"});
});
*/
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

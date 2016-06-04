
var app = require('express')();
var log = require('metalogger')();
var cluster = require('cluster');
var config = require('config');

var configureLogging = function () {
  if ('log' in config) {

    if ('plugin' in config.log) { process.env.NODE_LOGGER_PLUGIN = config.log.plugin; }
    if ('level' in config.log) { process.env.NODE_LOGGER_LEVEL = config.log.level; }

    if ('customlevels' in config.log) {
      for (var key in config.log.customlevels) {
        process.env['NODE_LOGGER_LEVEL_' + key] = config.log.customlevels[key];
      }
    }
  }
};

exports.setup = function (callback) {
  configureLogging();

  var isClusterMaster = (cluster.isMaster && (process.env.NODE_CLUSTERED === '1'));

  var isHttpThread = true;
  if (isClusterMaster || 
    ( typeof(process.env.NODE_ISNOT_HTTP_SERVER_THREAD) !== 'undefined' &&
      process.env.NODE_ISNOT_HTTP_SERVER_THREAD !== 'true')) {
    isHttpThread = false;
  }

  log.debug('is http thread ? ' + isHttpThread);

  if (isClusterMaster) {
    require('./clustering').setup();
  }

  if (isHttpThread) {
    app.listen(config.app.port);
  }

  // If we are not running a cluster at all:
  if (!isClusterMaster && cluster.isMaster) {
    log.notice("Express server instance listening on port " + config.app.port);
  }

  /** setup some basic middlewares **/

  var bodyParser = require('body-parser');
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: true}));
  // parse application/json
  app.use(bodyParser.json());
  // parse multipart/form-data
  app.use(require('multer')({dest: config.app.uploadsDir}));
  // enable method overrides for older browsers
  app.use(require('method-override')('X-HTTP-Method-Override'));

  if (process.env.NODE_ENV === 'development') {
    app.use(require('errorhandler')({log: true}));
  }

  if (process.env.NODE_ENV === 'production') {
    // trust proxy in production from local nginx front server
    app.set('trust proxy', 'loopback')
  };

  callback(app);
};

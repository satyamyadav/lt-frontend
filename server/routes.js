var _ = require('lodash');
var view = require('view');
var UAParser = require('ua-parser-js');

var app = module.exports = require('express')();

var fn = require('fn');
var fake = fn.fake;  // for fake data

  /**
   * setup auth
   */
  require('auth')();

  /**
   * extract ua-data, and set it on req and res.locals
   */
  app.use(function (req, res, next) {
    var uaData = (new UAParser).setUA(req.get('user-agent')).getResult();
    req.uaData = res.locals.uaData = uaData;
    next();
  });

  /**
   * some generic helpers for views
   */
  app.use(function (req, res, next) {
    res.locals._ = _;
    res.locals.view = view;

    res.locals.componentId = function (type, modelId, index) {
      var randStr = function (length) {
        length = _.isUndefined(length) ? 5 : length;
        return Math.random().toString().slice(2, 2 + length);
      };
      modelId = _.isUndefined(modelId) ? '' : modelId;
      index = _.isUndefined(index) ? '' : index;

      var path = req.path.slice(1).replace(/\//g, '-').replace(/\./g, '-').replace(/#/, '-').replace(/@/, '-');

      return [path, type, modelId, index, randStr()].join('');
    };

    res.locals.genUrl = function (link) {
      var index = link.indexOf('http');
      if (index === 0) {
        return link;
      } else {
        // replacing req.get('host') with prod url
        // because req.get('host') on production sets link to node2.staging
        // added conditional response to handle localhost and node.staging
        var hostName = req.get('host');
        //hostName = Math.max(hostName.indexOf('localhost'), hostName.indexOf('domain.com')) > -1 ? hostName : 'domain.com';
        //FOR NOW IT NEEDS TO USE HOSTNAME IN ALL CONDITIONS, change it later
        hostName = Math.max(hostName.indexOf('localhost'), hostName.indexOf('learn-together.herokuapp.com')) > -1 ? hostName : 'learn-together.herokuapp.com';
        var hostProtocol = hostName.indexOf('localhost') > -1 ? req.protocol : 'https';
        return [req.protocol, '://', hostName, '/', link].join('');
      }
    };


    res.locals.genSrc = function (link, params) {
      var index = link.indexOf('facebook');
      if (index > -1 || link.indexOf('userggl') > -1 || link.indexOf('lh3') > -1) {
        return link;
      } else {
        link = link.replace(/^https:\/\//i, 'http://');
      
        var hostName = req.get('host');
        //hostName = Math.max(hostName.indexOf('localhost'), hostName.indexOf('domain.com')) > -1 ? hostName : 'domain.com';
        //FOR NOW IT NEEDS TO USE HOSTNAME IN ALL CONDITIONS, change it later
        hostName = Math.max(hostName.indexOf('localhost'), hostName.indexOf('domain.com')) > -1 ? 'domain.com' : 'domain.com';
        return [/*req.protocol,*/ 'https://', hostName, '/unsafe/', params, '/', link].join('');
      }
    };

    res.locals.isFollowing = function (user, followerId) {
      var following = false;
      _.forEach(user.followers, function(follower) {
        if (follower.follow_id == followerId) {
          following = true;
        } else {
          following = false;
        }
      })
      return following;
    };

    next();
  });

  /**
   * set auth related req params and view-vars
   */
  app.use(function (req, res, next) {
    
    /*res.locals.me = fake.me;  // remove this line if using api and auth , it is global fake me
    next()                    // just remove it  to go down and remove commented code
    */
    if (req.isAuthenticated()) {
      if (req.user === null) {
        req.token = null;
        req.locals.me = null;
        req.logout();
      } else {
        req.token = req.user.access_token;
        res.locals.me = req.user;
        next();
      }
    } else {
      req.token = null;
      res.locals.me = null;
      next();
    }
    
  });

  /**
   * Now that all the necessary middlewares are in place,
   * mount various apps
   */
  require('apps').forEach(function (a) {
    app.use(a.prefix, a.app);
  });
	
  app.use(function (req, res) {
    res.status(500).render(view('site/pages/static/500'));
  });

  console.log('routes mounted');
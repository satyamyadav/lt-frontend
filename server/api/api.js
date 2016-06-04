var request = require('request');
var config = require('config');
var Promise = require('bluebird');
var _ = require('lodash');
var log = require('metalogger')();


var apiFactory = module.exports = function () {

  // wrap up request in a bluebird promise with some default
  // options to create the base api function

  // hold accessToken if user Logged In 
  var accessToken = null;

  var api = function (method, url, options) {
    // instantiate options as an empty object literal
    options = _.isUndefined(options) ? {} : options;

    /*var token = options.headers && options.headers['Authorization'] ? options.headers['Authorization'] : accessToken;*/
    var token = options.token;

    var header = url.indexOf('http') === 0 ? {} : {'Authorization': 'Bearer' + ' ' + token};
    
    _.merge(
      options,
      {

        // set the http request method
        method: method,
        // if the url starts with 'http', leave it be, otherwise
        // prefix api_base to the url
        uri: url.indexOf('http') === 0 ? url : config.app.apiBase + url,
        // if the url starts with http, leave headers be
        // other wise attach X-DeviceID: web header
        headers: header,
        json: options.json ? options.json : true
      }
    );
    // send json data under the key 'json' as object literal

    // send query parameters under the key 'qs' as object literal

    // send application/x-www-form-urlencoded data under the key 'form' as object literal

    // send multipart/form-data under the key 'formData' as a formData object
    
    //console.log(options);
    //log.notice(options.uri, options.qs, options.json);
    

    return new Promise(function (resolve, reject) {
      request(options, function (err, res, body) {
        if (err) {
          console.log(err);
          throw err;
        } else {
          if (res.statusCode === 200 || res.statusCode === 302) {
            if (res.body.redirect === true) {
              resolve(res.body);
              return;
            }

            // first check all translators
            for (var i = 0; i < api.translators.length; i++) {
              var translator = api.translators[i];
              if (translator.test(method, url, options)) {
                var data = translator.translate(res.body);
                resolve(data);
                return;
              }
            }
            // otherwise resolve body just like that
            resolve(res.body);

          } else {
            log.error('Api error: \n' + JSON.stringify({
                url: url, body: body, options: options
              }, null, 2));
            reject(res);
          }
        }
      });
    });
  };

  // response translators
  api.translators = [];

  // method to set accessToken for loggedIn user
  api.setToken = function (token) {
    accessToken = token;
  };

  // method to add a translator
  api.translator = function (translator) {
    if (_.isUndefined(translator.test)) {
      translator.test = function (method, url, options) {
        return method === this.method && this.pattern.test(url)
      };
    }

    api.translators.push(translator);
    return this;
  };

  // attach shorthands for get, put, post, delete to api
  ['GET', 'PUT', 'POST', 'DELETE'].forEach(function (m) {
    api[m.toLowerCase()] = function (url, options) {
      return api(m, url, options);
    };
  });

  return api;
};
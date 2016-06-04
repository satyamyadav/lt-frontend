var api = require('./api')();
var translators = require('./translators');

translators.forEach(function (t) {
  api.translator(t);
});

module.exports = api;
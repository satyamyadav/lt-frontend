var _ = require('lodash');

var modelBuilder = module.exports = function (name, props, defaults) {
        // model builder accepts a list of properties a model shoudl have
        // and generates a model which will give an instance only if
        // all those properties have been supplied to it in its argument
        // object
  
  name = name.toString();
  if (! _.isArray(props)) {
    throw 'props must be an array';
  }

  if (_.isUndefined(defaults)) {
    defaults = function () { return {}; };
  }

  if (! _.isFunction(defaults)) {
    throw 'defaults must be undefined or an function';
  }

  var Model = function (args) {
    var model = {};

    for (var k in args) {
      if (props.indexOf(k) === -1) {
        throw 'invalid property "'+k+'" supplied to model "'+name+'"';
      }
    }

    props.forEach(function (prop) {
      if (args.hasOwnProperty(prop)) {
        model[prop] = args[prop];
      } else if (defaults.hasOwnProperty(prop)) {
        model[prop] = defaults()[prop];
      }
    });

    return model;
  };

  Model.type = name;

  return Model;
};
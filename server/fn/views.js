var Promise = require('bluebird');
var _ = require('lodash');

var helpers = module.exports = {
  /**
   * return a promise which renders a view with supplied params
   */
  render: function (res, view, params) {
    return new Promise(function (resolve, reject) {
      res.render(view, params, function (err, html) {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  },

  /**
   * given the hashmap of all the partials and their paths
   * in a page, and an array of partials supplied by query params
   * give back an array partials to be rendered
   */
  toRender: function (page, partials) {
    var toRender = [];

    partials.forEach(function (p) {
      if (toRender.indexOf(p) === -1 && page.hasOwnProperty(p)) {
        toRender.push(p);
      }
    });

    return toRender;
  },

  /**
   * render all
   */
  renderAll: function (res, page, partials, args) {
    var renderers = {};
    helpers.toRender(page, partials).forEach(function (partial) {
      renderers[partial] = helpers.render(res, page[partial], args);
    });
    return Promise.props(renderers);
  },

  htmlResponse: function (req, res, partials, args) {
    if (!_.isArray(req.query.partials)) {
      // if no partials array has been sent in query params
      // then render the whole page
      res.render(partials.main, args);
    } else {
    	//console.log()
      // otherwise send a json containing all the partials that have been requested
      helpers.renderAll(res, partials, req.query.partials, args).then(function (rendered) {
        res.send(rendered);     
      });
    }
  }
};
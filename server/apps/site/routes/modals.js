var app = module.exports = require('express')();
var _ = require('lodash');

var view = require('view').prefix('site');
var fn = require('fn');
var api = require('api');
var pages = require('apps/site/partials');
var getReviewForm = fn.data.getReviewForm;

var authFilter = fn.filters.authFilter;


/**
 * auth modal html
 */
app.get('/modal/auth', function (req, res) {
  res.render(pages.modals.auth, {partials: pages.common});
});


app.get('/modal/project', authFilter, function (req, res) {
  console.log('project modeal');
  var token = req.token;
        var args = {
            pagename: 'projectModal',
            title: 'Learn Together',
            partials: pages.modals.project,
            user: req.user,
        };
        //htmlResponse(req, res, pages.modals.project, args);
      res.render(pages.modals.project, args);

});


app.get('/modal/idea', authFilter, function (req, res) {
  console.log('project modeal');
  var token = req.token;
        var args = {
            pagename: 'projectModal',
            title: 'Learn Together',
            partials: pages.modals.idea,
            user: req.user,
        };
        //htmlResponse(req, res, pages.modals.project, args);
      res.render(pages.modals.idea, args);

});


app.get('/modal/post', authFilter, function (req, res) {
  console.log('post modeal');
  var token = req.token;
        var args = {
            pagename: 'postModal',
            title: 'Learn Together',
            partials: pages.modals.post,
            user: req.user,
        };
        //htmlResponse(req, res, pages.modals.post, args);
      res.render(pages.modals.post, args);

});



app.get('/modal/updateProfile', authFilter, function (req, res) {
  var token = req.token;
        var args = {
            pagename: 'updateProfileModal',
            title: 'Learn Together',
            partials: pages.modals,
            user: req.user,
        };
        //htmlResponse(req, res, pages.modals.project, args);
  		res.render(pages.modals.updateProfile, args);

});

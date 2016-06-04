var app = module.exports = require('express')();
var _ = require('lodash');
var view = require('view').prefix('site');
var pages = require('apps/site/partials');



app.get('/about', function (req, res) {
  var args = {
    pagename: 'About',
    pageHeading: 'About Us',
    title: 'About | SCRIET OSSDG',
    partials: pages.statics.about,
  };

  res.render(pages.statics.about.main, args);
});



app.get('/forgetpassword', function (req, res) {
  var args = {
    pagename: 'forgetpassword',
    pageHeading: 'forgetpassword',
    title: 'forgetpassword',
    partials: pages.statics.forgetpassword,
  };

  res.render(pages.statics.forgetpassword, args);
});

app.get('/register', function (req, res) {
  var args = {
    pagename: 'register',
    pageHeading: 'register',
    title: 'register',
    partials: pages.statics.register,
  };

  res.render(pages.statics.register, args);
});


app.get('/500', function (req, res) {
  var args = {
    pagename: '500',
    pageHeading: '500',
    title: '500',
  };

  res.render(view('/site/pages/static/500'));
});


app.get('/404', function (req, res) {
  var args = {
    pagename: '404',
    pageHeading: '404',
    title: '404',
  };

  res.render(view('/site/pages/static/404'));
});
var app = module.exports = require('express')();
var view = require('view');


app.use(function (req, res, next) {
  // overriding view function provided inside templates
  // for routes that 
  res.locals.view = require('view').prefix('site');
  next();
});

app.use('/', require('./routes/statics'));
app.use('/', require('./routes/ajax'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/modals'));
app.use('/', require('./routes/pages'));


app.use(function (req, res) {
  res.status(400).render(view('site/pages/static/404'));
});
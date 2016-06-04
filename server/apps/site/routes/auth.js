var app = module.exports = require('express')();
var passport = require('passport');
var _ = require('lodash');


var fn = require('fn');
var view = require('view').prefix('site');
var api = require('api');
var pages = require('apps/site/partials');

var resetPasswordFilter = fn.filters.resetPasswordFilter;
var authFilter = fn.filters.authFilter;

/**
 *  Logout endpoint for session
 */
app.post('/logout', function (req, res) {
  req.logout();
  res.send({msg: 'Logged out'});
});

/**
 * Password reset endpoint
 */
app.post('/auth/reset-password', function (req, res) {
  api.post('/forgotpassword', {
    json: {username: req.body.username}
  }).then(
    function () {
      res.send({msg: 'password reset request sent'});
    },
    function () {
      res.status(500).send({msg: 'something went wrong'});
    }
  );
});

/**
 *  auth success state
 */
app.get('/auth/success', authFilter, function (req, res) {
  var args = {
    pagename: 'login',
    title: 'scriet | Login',
    partials: pages.authSuccess
  };
  
  res.status(200).render(pages.authSuccess.main, args);
});

/**
 *  local strategy auth handler
 */
app.post('/auth/local', function (req, res) {
  passport.authenticate('local', function (err, user) {
    if (err) {
      return res.status(400).send({msg: 'login failed'});
    }
    if (!user) {
      return res.status(400).send({msg: 'login failed'});
    }

    req.logIn(user, function (err) {
      if (err) {
        res.status(400).send({msg: 'login failed'});
      } else {
        res.send({msg: 'login successful', user: user});
      }
    });
  })(req, res);
});


/**
 *  local registration strategy handler
 */
app.post('/auth/register', function (req, res) {
  //console.log(req);

  passport.authenticate('register', function (err, user) {
    //console.log('error: ', err);
    if (err) {
      return res.status(400).send({msg: 'login failed'});
    }
    if (!user) {
      return res.status(400).send({msg: 'login failed'});
    }

    req.logIn(user, function (err) {
      if (err) {
        res.status(400).send({msg: 'login failed'});
      } else {
        //res.redirect('/discover');
        res.send({msg: 'login successful', user: user});
      }
    });
  })(req, res);
});

/**
 *  local registration strategy handler
 */
app.post('/auth/public/register', function (req, res) {

  passport.authenticate('registerPublic', function (err, user) {
    if (err) {
      return res.status(400).send({msg: 'login failed'});
    }
    if (!user) {
      return res.status(400).send({msg: 'login failed'});
    }

    req.logIn(user, function (err) {
      if (err) {
        res.status(400).send({msg: 'login failed'});
      } else {
        //res.redirect('/discover');
        res.send({msg: 'login successful', user: user});
      }
    });
  })(req, res);
});

/**
 *  local registration strategy handler
 */
app.post('/auth/public/register-full', function (req, res) {

  passport.authenticate('registerPublic', function (err, user) {
    if (err) {
      return res.status(400).send({msg: 'login failed'});
    }
    if (!user) {
      return res.status(400).send({msg: 'login failed'});
    }

    req.logIn(user, function (err) {
      if (err) {
        res.status(400).send({msg: 'login failed'});
      } else {
        //res.redirect('/discover');
        res.send({msg: 'login successful', user: user});
      }
    });
  })(req, res);
});


/**
 * loginPage
 */
app.get('/auth/login', function (req, res) {

  var queryParam = _.isUndefined(req.query.from) ? null : req.query.from;

  res.render(pages.statics.loginPage.panel, {
    partials: pages.statics.loginPage,
    pagename: 'loginSignup',
    from: queryParam,
    title: 'Login/SignUp'
  });
});

/**
 * resetPassword page
 */
app.get('/reset-password', resetPasswordFilter, function (req, res) {
  res.render(pages.statics.resetPassword.panel, {
    profile: req.resolved.user,
    partials: pages.statics.resetPassword,
    title: 'Reset Password',
    pagename: 'resetPassword',
    token: req.resolved.user.token
  });
});



app.get('/auth/facebook/post', passport.authenticate('facebookPost', {scope: ['email', 'public_profile', 'publish_actions'], profileFields: ['id', 'displayName', 'photos']}));

app.get('/auth/facebook/post/callback', function(req, res) {

  passport.authenticate('facebookPost', function(data){
  console.log('passport auth ka data', data);
    //return res.status(200).send({msg: data.redirect_url});
    return res.redirect(data.redirect_url);
  }
    /*{
      successRedirect: '/auth/success',
      failureRedirect: '/auth/login'
    }*/
  )(req, res)

});



/**
 * Redirect the user to Facebook for authentication.  When complete,
 * Facebook will redirect the user back to the application
 * at /auth/facebook/callback
 */
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email', 'public_profile'], profileFields: ['id', 'displayName', 'photos']}));
/**
 * Facebook will redirect the user to this URL after approval.
 * Finish the authentication process by attempting to obtain an access token.
 * If access was granted, the user will be logged in.
 * Otherwise, authentication has failed.
 */

app.get('/auth/facebook/callback',
  passport.authenticate('facebook',
    {
      successRedirect: '/auth/success',
      failureRedirect: '/auth/login'
    }
  )
);

/**
 * Redirect the user to Twitter for authentication.
 * When complete, Twitter will redirect the user back to the application
 * at /auth/twitter/callback
 */
app.get('/auth/twitter', passport.authenticate('twitter'));

/**
 * Twitter will redirect the user to this URL after approval.  Finish the
 * authentication process by attempting to obtain an access token.
 * If access was granted, the user will be logged in.
 * Otherwise,authentication has failed.
 */
app.get('/auth/twitter/callback',
  passport.authenticate('twitter',
    { // handle success and failure events here
      successRedirect: '/auth/success',
      failureRedirect: '/login'
    }
  )
);

/**
 * Redirect the user to Google for authentication.
 * When complete, Google will redirect the user back to the application
 * at /auth/google/return
 */

app.get('/auth/google',
  passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/plus.login',
        , 'https://www.googleapis.com/auth/userinfo.email']
    }
  )
);

/**
 * Google will redirect the user to this URL after authentication.
 * Finish the process by verifying the assertion.
 * If valid, the user will be logged in.  Otherwise, authentication has failed.
 */
app.get('/auth/google/return',
  passport.authenticate('google', {
    successRedirect: '/auth/success',
    failureRedirect: '/login'
  })
);



/**
 * check whether user exists 
 */

app.post('/user/exists', function (req, res) {
  api.post('/user/exists', {
    json: {email: req.body.email}
  }).then(
    function (data) {
      res.send(data);
    },
    function () {
      res.status(500).send({msg: 'something went wrong'});
    }
  );
});

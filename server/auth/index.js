var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var api = require('api');

var fn = require('fn');
var getMe = fn.data.getMe;

var auth = module.exports = function () {
  // serialize and deserialize
  passport.serializeUser(function (user, done) {
    if (user && user.access_token) {
      done(null, user.access_token);
    } else {
      done('invalid user', null);
    }
  });
  
  passport.deserializeUser(function (token, done) {
    getMe(token)
      .then(
      function (data) {
        data.user.access_token = token;
        done(null, data.user);
      },
      function (res) {
        done(null, null);
      }
    )
  });

  // Custom Stratergy to handle auth for  
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function (username, password, done) {
      api.post('/auth/login', {
        json: {
          email: username,
          password: password
        }
      })
        .then(
        function (data) {
          done(null, data.user);
        },
        function (res) {
          done(null, null, {
            message: 'invalid token'
          });
        }
      );
    }
  ));

  // Custom Stratergy to handle auth for
  // Custom Stratergy to handle auth for
  passport.use('register', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, username, password, done) {
      console.log('auth me', req.body);
      api.post('/auth/register', {
        json: {
          email: req.body.email,
          password: password,
          full_name: req.body.full_name,
          details: req.body.details,
          username: req.body.username
        }
      })
        .then(
        function (data) {
          done(null, data.user);
        },
        function (res) {
          done(null, null, {
            message: res
          });
        }
      );
    }
  ));


  // Facebook Stratergy to handle social auth 
  passport.use('facebookPost', new FacebookStrategy({
      

      clientID:  '23243242342334',
      clientSecret: 'werewrwer32r343434',
      callbackURL: 'http://site.com/auth/facebook/post/callback',
      passReqToCallback: true

    },

    function (request, accessToken, refreshToken, profile, done) {
      api.post('/auth/social/facebook/post', {
            token: request.token,
            json: {
              access_token: accessToken,
              social_id: profile.id,
              user_id: request.user.id
            }
          })
            .then(
            function (data) {
              //console.log('return me data :: ', data);
              done(data, request.user);

            },
            function (res) {
              done('can not login', null);
            }
          );
       
    }
  ));


  
  // Facebook Stratergy to handle social auth 
  passport.use(new FacebookStrategy({
     
     //production app 
   
      clientID:  '234324235235',
      clientSecret: 'werfewrewr4335345345',
      callbackURL: 'http://site.com/auth/facebook/callback',
      passReqToCallback: true
    
    },
    function (request, accessToken, refreshToken, profile, done) {
      api.post('/auth/social/facebook', {
            token: request.token,
            json: {
              access_token: accessToken,
              social_id: profile.id
            }
          })
            .then(
            function (data) {
              done(null, data.user);
            },
            function (res) {
              done('can not login', null);
            }
          );
       
    }
  ));




  // Google Oauth 2.0 Stratergy to handle /login/social/google
  passport.use(new GoogleStrategy({
      clientID: 'sfsdvsdv',
      clientSecret: 'sdvsv',
      callbackURL: '',
      passReqToCallback: true
    },
    function (request, accessToken, refreshToken, profile, done) {
      api.post('/auth/social/google', {
        token: request.token,
        json: {
          access_token: accessToken,
          social_id: profile.id
        }
      })
        .then(
        function (data) {
          done(null, data.user);
        },
        function (res) {
          done('invalid Token', null);
        }
      );
    }
  ));
};
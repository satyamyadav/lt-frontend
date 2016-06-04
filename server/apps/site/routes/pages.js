var app = module.exports = require('express')();
var _ = require('lodash');
var Promise = require('bluebird');
var passport = require('passport');

var api = require('api');
var partials = require('apps/site/partials');
var fn = require('fn');
var view = require('view').prefix('site');
var log = require('metalogger')();


var render = fn.views.render;
var toRender = fn.views.toRender;
var renderAll = fn.views.renderAll;
var htmlResponse = fn.views.htmlResponse;

var getUser = fn.data.getUser;
var getUserFeed = fn.data.getUserFeed;
var getUserById = fn.data.getUserById;


var usernameFilter = fn.filters.usernameFilter;
var useridFilter = fn.filters.useridFilter;
var authFilter = fn.filters.authFilter;
var unauthFilter = fn.filters.unauthFilter;


var getProjects = fn.data.getProjects;
var getUsers = fn.data.getUsers;
var getUserById = fn.data.getUserById;
var getProjectById = fn.data.getProjectById;
var getUserFeed = fn.data.getUserFeed;

/** fake 
 */

var fake = fn.fake;
 

/** temp rout
 */

/*app.get('/', function (req, res) {
	res.send({msg: "will be live soon !"})
});
*/


/**
 * Home page
 */
app.get('/', function (req, res) {
  var page = !_.isUndefined(req.query.page) ? req.query.page : 1;
  var per_page = 10;


  var token = req.token;
  Promise.props({
   projects: getProjects(token, page, per_page),
   topProjects: getProjects(token, page, per_page, 'project'),
   newIdeas: getProjects(token, page, per_page, 'idea'),
   topPosts: getProjects(token, page, per_page, 'post'),
   users: getUsers(token, page, per_page)  
  }).then(function(data){
    var token = req.token;
    var args = {
        pagename: 'homepage',
        title: 'Learn Together',
        partials: partials.home,
        user: {},
        projects: data.projects.projects,
        topProjects: data.topProjects.projects,
        newIdeas: data.newIdeas.projects,
        topPosts: data.topPosts.projects,
        users: data.users.users,
        page: page
    };
    htmlResponse(req, res, partials.home, args);
  });
    
});


app.get('/projects/:id', function (req, res) {
  var token = req.token;
  var page = !_.isUndefined(req.query.page) ? req.query.page : 1;
  var per_page = 10;
  Promise.props({
   projects: getProjectById(token, req.params.id),
   topProjects: getProjects(token, page, per_page, 'project'),
   newIdeas: getProjects(token, page, per_page, 'idea'),
   topPosts: getProjects(token, page, per_page, 'post'),
   users: getUsers(token)  
  }).then(function(data){
    var token = req.token;
    var args = {
        pagename: 'projectpage',
        title: 'Learn Together',
        partials: partials.project,
        topProjects: data.topProjects.projects,
        newIdeas: data.newIdeas.projects,
        topPosts: data.topPosts.projects,
        user: {},
        projects: data.projects,
        users: data.users.data
    };
    htmlResponse(req, res, partials.project, args);
  });
    
});


/**
 * get comments of project
 */

app.get('/project/:projectId/comments', function (req, res) {
    var projectId = req.params.projectId;
    api.get('/projects/' + projectId + '/comments', {
        token: req.token,
    }).then(function (data) {
            //res.send(data);
        var token = req.token;
        var args = {
            pagename: 'comments',
            title: 'Learn Together',
            partials: partials.comments,
            comments: data.comments
        };
        htmlResponse(req, res, partials.comments, args);

        },
        function (err) {
            res.send(err);
        });
});




/**
 * user profile page
 */
app.get('/:username', usernameFilter, function (req, res) {
  var user;
  var page = !_.isUndefined(req.query.page) ? req.query.page : 1;
  var per_page = 10;

  if(_.isUndefined(req.user)) {
    user = req.resolved.user;
  } else {
    if(req.user.id != req.resolved.user.id) {
      user = req.resolved.user;
    } else {
      user = req.user;
    }
  }
  
  var token = req.token;

  Promise.props({
    user: user,
    userfeed: getUserFeed(user.user.username, req.token, page, per_page),
    topProjects: getProjects(token, page, per_page, 'project'),
    newIdeas: getProjects(token, page, per_page, 'idea'),
    topPosts: getProjects(token, page, per_page, 'post'),
    users: getUsers(token, page, per_page)  

  }).then(function (data) {

        var args = {
          pagename: 'profile',
          title: 'Learn Together',
          partials: partials.profile,
          user: data.user.user,
          projects: data.userfeed.projects,
          topProjects: data.topProjects.projects,
          newIdeas: data.newIdeas.projects,
          topPosts: data.topPosts.projects,
          users: data.users.users,
          page: page

          
        };
        htmlResponse(req, res, partials.profile, args);
        //res.send(data.user);
      },
      function (e) {
        res.status(500).render(view('partials/static/500'));
        log.error(e.body);
      }
  );
});


/**
 * user profile page
 */
app.get('/user/:userid', useridFilter, function (req, res) {
  var user;
  var page = !_.isUndefined(req.query.page) ? req.query.page : 1;
  var per_page = 10;

  if(_.isUndefined(req.user)) {
    user = req.resolved.user;
  } else {
    if(req.user.id != req.resolved.user.id) {
      user = req.resolved.user;
    } else {
      user = req.user;
    }
  }
  
  var token = req.token;

  Promise.props({
    user: user,
    userfeed: getUserFeed(user.user.username, req.token, page, per_page),
    topProjects: getProjects(token, page, per_page, 'project'),
    newIdeas: getProjects(token, page, per_page, 'idea'),
    topPosts: getProjects(token, page, per_page, 'post'),
    users: getUsers(token, page, per_page)  

    
  }).then(function (data) {
    

        var args = {
          pagename: 'profile',
          title: 'Learn Together',
          partials: partials.profile,
          user: data.user.user,
          projects: data.userfeed.projects,
          topProjects: data.topProjects.projects,
          newIdeas: data.newIdeas.projects,
          topPosts: data.topPosts.projects,
          users: data.users.users,
          page: page

        };
        htmlResponse(req, res, partials.profile, args);
        //res.send(data.user);
      },
      function (e) {
        res.status(500).render(view('partials/static/500'));
        log.error(e.body);
      }
  );
});


app.get('/resume/:username', usernameFilter, function (req, res) {
  var token = req.token;
  var args = {
      pagename: 'resume',
      title: 'Learn Together',
      partials: partials.resume,
      user: req.resolved.user.user 
  };
  htmlResponse(req, res, partials.resume, args);

});


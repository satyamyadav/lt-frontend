var view = require('view').prefix('site');
var _ = require('lodash');

var common = {
  main: view('pages/std'),
  top: view('partials/layout/top'),
  bottom: view('partials/layout/bottom'),
  sidebarLeft: view('partials/layout/sidebarLeft'),
  sidebarRight: view('partials/layout/sidebarRight'),
  nav: view('partials/layout/nav'),
  modals: view('partials/layout/modals'),
  footer: view('partials/layout/footer'),
  scrollTopBtn: view('partials/common/scrollTopBtn'),
  projectCard: view('partials/cards/projectCard'),
  searchBox: view('partials/forms/searchBox'),
  updateProfileForm: view('partials/forms/updateProfileForm'),
  userWidgetSm: view('partials/widgets/userWidgetSm'),
  banner: view('partials/common/banner'),
  addProjectBtn: view('partials/buttons/addProjectBtn'),
  addIdeaBtn: view('partials/buttons/addIdeaBtn'),
  addPostBtn: view('partials/buttons/addPostBtn'),
  updateProfileBtn: view('partials/buttons/updateProfileBtn'),
  followBtn: view('partials/buttons/followBtn')
};

var partials = module.exports = {
  common: common,

  authSuccess: _.extend({}, common, {
    panel: view('partials/login/success')
  }),

  modals: _.extend({}, common, {
    auth: view('partials/modals/auth'),
    project: view('partials/modals/project'),
    idea: view('partials/modals/idea'),
    post: view('partials/modals/post'),
    updateProfile: view('partials/modals/updateProfile'),
    

  }),

  home: _.extend({}, common, {
    panel: view('pages/home/panel'),
    centerPanel: view('partials/home/centerPanel'),
    leftPanel: view('partials/home/leftPanel'),
    rightPanel: view('partials/home/rightPanel')
  
  }),

  profile: _.extend({}, common, {
    panel: view('pages/profile/panel'),
    leftPanel: view('partials/home/leftPanel'),
    centerPanel: view('partials/home/centerPanel'),
    rightPanel: view('partials/home/rightPanel'),
    profileCardLg: view('partials/profile/profileCardLg'),


  }),

  
  resume: _.extend({}, common, {
    panel: view('pages/resume/panel'),
    updateResumeForm: view('partials/forms/updateResumeForm'),
    resumeTemplate: view('partials/resume/resumeTemplate'),


  }),

  project: _.extend({}, common, {
    panel: view('pages/project/panel'),
    leftPanel: view('partials/home/leftPanel'),
    rightPanel: view('partials/project/rightPanel'),
    projectCardLg: view('partials/project/projectCardLg'),

  }),


  comments: _.extend({}, {
    main: view('partials/cards/projectCommentsCard')

  }),

  
  statics: {

    forgetpassword: view('pages/static/forgetpassword'),
    register: view('pages/static/register'),
    foruOfour: view('pages/static/foruOfour'),
    fiveOO: view('pages/static/fiveOO'),
    about:  _.extend({}, common, {
      panel: view('pages/static/about/panel'),
    })
    
   }

 
};

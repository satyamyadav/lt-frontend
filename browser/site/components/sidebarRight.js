app.components.sidebarRight = function($sidebar) {
  var $logOutBtn = $sidebar.find('.logout');
  //var $mobileMenuCloseBtn = app.$body.find('.close-mobile-menu');
  //var $mobileMenu = app.$body.find('.mobile-menu');
  //var $sudoDiv = app.$body.find('.sudo-div');
  var $addProjecBtn = $sidebar.find('.add-project-btn');
  var $updateProfileBtn = $sidebar.find('.update-profile-btn');
/*
  $(function () {
    $dropDown.dropdown();
  });
*/

  $logOutBtn.on('click', function (ev) {
    ev.preventDefault();
    console.log('logout btn click');
    app.utils.ajax.post("/logout")
    .then(function (){
      /*if (app.utils.currentUrl() === app.utils.domain() + '/') {
      app.utils.redirectTo('/');
      } else {
        app.utils.reloadNavAndPanel();
      }
      */
      app.utils.reloadNavAndPanel();
      toastr.success('Logged Out', 'success', 3);

    });
  });

    

  $addProjecBtn.on('click', function(ev){
    ev.preventDefault();
    console.log('click add project');
    app.utils.loadModal('#projectModal', '/modal/project');
  });


  $updateProfileBtn.on('click', function(ev){
    ev.preventDefault();
    console.log('click update-profile-btn');
    app.utils.loadModal('#updateProfileModal', '/modal/updateProfile');
  });


};


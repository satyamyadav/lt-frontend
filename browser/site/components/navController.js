app.components.navController = function($nav) {
  var $signInModal = $nav.find('.signin-link');
  var $logOutBtn = $nav.find('.logout');
  var $dropDown = $nav.find('.dropdown-toggle');
  var $mobileMenuBtn = $nav.find('.mobile-menu-btn');
  var $mobileMenuCloseBtn = app.$body.find('.close-mobile-menu');
  var $mobileMenu = $nav.find('.mobile-menu');
  var $sudoDiv = $nav.find('.sudo-div');
  var $addProjecBtn = $nav.find('.add-project-btn');

  $(function () {
    $dropDown.dropdown();
  });

  $signInModal.on('click', function (ev) {
    ev.preventDefault();
    app.utils.loadModal('#authModal', '/modal/auth');
  });
/*
  $logOutBtn.on('click', function (ev) {
    ev.preventDefault();
    //console.log('logout btn click');
    app.utils.ajax.post("/logout").then(function (){
      if (app.utils.currentUrl() === app.utils.domain() + '/feed') {
      app.utils.redirectTo('/discover');
      } else {
        app.utils.reloadNavAndPanel();
      }
            
    app.utils.reloadNavAndPanel();
    toastr.success('Logged Out', 'success', 3);
    slideMenu();
    });
  });*/

  var slideMenu = function () {
    if ($mobileMenu.hasClass('slide-open')) {
      $mobileMenu.animate({right: '-100%'});
    } else {
      $mobileMenu.animate({right: '0px'});
    };
    $mobileMenu.toggleClass('slide-open');
    $sudoDiv.toggleClass('sudo-div-open');
  };  
  
  $mobileMenuBtn.on('click', function (ev) {
    ev.preventDefault();
    console.log('menu btn');
    slideMenu();
  });

  $mobileMenuCloseBtn.on('click', function (ev) {
    ev.preventDefault();
    slideMenu();
  });

  $sudoDiv.on('click', function (ev) {
    ev.preventDefault();
    slideMenu();
  });

  $sudoDiv.on('swipe', function (ev) {
    //console.log(' swipe kiya re');
    ev.preventDefault();
    slideMenu();
  });
    

  $addProjecBtn.on('click', function(ev){
    ev.preventDefault();
    //console.log('click add project');
    app.utils.loadModal('#projectModal', '/modal/project');
  });


};


app.components.fourOfourHandler = function($loginBtn) {
  /*var $navBar = $nav.find('.top-bar');
  var $stickyLinks = $navBar.find('.sticky-links');
  var $discoverLink = $stickyLinks.find('.discover-link');
  var $logOutBtn = $nav.find('.logout');*/
  /*var $signInModal = $loginBtn.find('.signin-link');*/

  $loginBtn.on('click', function (ev) {
    app.utils.loadModal('#authModal', '/modal/auth');
  });
};
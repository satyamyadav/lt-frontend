app.components.updateProfileBtn = function ($btn) {
  $btn.on('click', function (ev){
  	ev.preventDefault();
  	console.log('click update-profile-btn');
  	app.utils.loadModal('#updateProfileModal', '/modal/updateProfile');
  });


} // btn

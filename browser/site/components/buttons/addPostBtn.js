app.components.addPostBtn = function ($btn) {
    $btn.on('click', function (ev){
  	ev.preventDefault();
  	console.log('click update-profile-btn');
    app.utils.loadModal('#postModal', '/modal/post');
  });



} // btn

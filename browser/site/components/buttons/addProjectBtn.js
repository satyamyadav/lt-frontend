app.components.addProjectBtn = function ($btn) {
    $btn.on('click', function (ev){
  	ev.preventDefault();
    app.utils.loadModal('#projectModal', '/modal/project');
  });


} // btn

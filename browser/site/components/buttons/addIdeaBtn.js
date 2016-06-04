app.components.addIdeaBtn = function ($btn) {
	$btn.on('click', function (ev){
		ev.preventDefault();
    app.utils.loadModal('#ideaModal', '/modal/idea');
	});
	  


} // btn

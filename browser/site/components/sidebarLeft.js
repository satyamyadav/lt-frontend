app.components.sidebarLeft = function ($sidebar) {
	

	var $panelLink = $sidebar.find('.panel-link');

	$panelLink.on('click', function(ev){
		ev.preventDefault();
		var url = $(this).data('url');
		var partial = $(this).data('partial');
		app.utils.getPartial(url, partial);
	})
}
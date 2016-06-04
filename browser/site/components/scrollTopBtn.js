app.components.scrollTopBtn = function($btn) {
	app.$document.on('ready', function () {
		if ($(this).scrollTop() > 0) {
			$btn.fadeIn();
		} else {
			$btn.fadeOut();
		}
	});

	app.$window.on('scroll', function () {
		if ($(this).scrollTop() > 0) {
			$btn.fadeIn();
		} else {
			$btn.fadeOut();
		}
	}); 
	$btn.on('click', function (ev) {
		ev.preventDefault();
    	app.$body.animate({scrollTop: 0}, 1000);
	});		
	    
};
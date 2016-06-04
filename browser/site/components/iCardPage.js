app.components.iCardPage = function ($panel) {
	var $preview = $panel.find('#preview');
	var $canvas = $panel.find('#canvas');
	var $icard = $panel.find('.i-card');
	var $shareBtn = $panel.find('.share-btn');
	var shareUrl = $icard.data('share-url');
	var imgUrl = $icard.data('img-url');
  var $signInModal = $panel.find('.signin-link');
  //var $generateBtn = $panel.find('.generate-btn');


  $signInModal.on('click', function (ev) {
    ev.preventDefault();
    app.utils.loadModal('#authModal', '/modal/auth');
  });





	//var $uploadForm = $panel.find('.upload-picker');
	//var $uploadInput = $uploadForm.find('#uploadInput');
	//var $uploadBtn = $uploadForm.find('#uploadBtn');
	//var photoData = new FormData();
	var handleFiles = function (files) {
	        //console.log(files);
	        //photoData.append('file', files);
	  //console.log('handleFiles');
	    //var files = $uploadInput.prop('files');
	    _.forEach(files, function (file) {
	        //$uploadInput.parents('.img-upload-picker').find('.uploader-img-name').val(file.name);
	    });
	    //console.log('photo', photoData);
	    app.utils.ajax.post('/upload', {
	        data: {
	        	imgBase64: files,
	        	imgUrl: imgUrl
	        },
	        /*processData: false,
	        contentType: false,
	        mimeType: false,*/
	    }).then(function (data) {
	        //console.log(data.uploadedFiles, data, 'data aaya', data);
	        image_urls = _.map(data.uploadedFiles, function (obj) {
	            var fileObj = {};
	            fileObj[obj.key] = obj.url;
	            return obj.url;
	        });
	        for (var i = 0; i < files.length; i++) {
	            var file = files[i];
	            var imageType = /^image\//;

	            if (!imageType.test(file.type)) {
	                continue;
	            }
	            var img = document.createElement("img");
	            img.classList.add("img-thumbnail");
	            img.file = file;
	            var div = $('<div/>', {
	                class: 'col-sm-12'
	            });
	            div.append(img);
	            $panel.find('#image-preview').append(div); // Assuming that "preview" is the div output where the content will be displayed.
	            var reader = new FileReader();
	            reader.onload = (function (aImg) {
	                return function (e) {
	                    aImg.src = e.target.result;
	                };
	            })(img);
	            reader.readAsDataURL(file);
	        }
	    });
	};
	
/*
	$uploadInput.on('change', function (ev) {
	  //console.log('upload change');
	    ev.preventDefault();
	    handleFiles($uploadInput.prop('files'));
	});
*/


var render = function() {

/*
	html2canvas($icard).then(function(canvas) {
	  //$canvas.append(canvas);
	  var myImage = canvas.toDataURL();
	  handleFiles(myImage);
	  //window.open(myImage);
	});
*/
	html2canvas($icard, {
 	 	onrendered: function(canvas) {
	  	var myImage = canvas.toDataURL();
	  	handleFiles(myImage);
  	}
  	//width: 600,
  	//height: 400
	});

}


/*	$generateBtn.on('click', function (ev) {
	  //console.log('upload change');
	    ev.preventDefault();
	    render();
	});*/



	var w = 700;
	var h = 480;
	var left = (screen.width / 2) - (w / 2);
	var top = (screen.height / 2) - (h / 2);

	$shareBtn.on('click', function (ev) {
	  ev.preventDefault();
	  render();
	  window.open('https://www.facebook.com/sharer/sharer.php?u=' + shareUrl, 'facebook', 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left)
	}); 


}
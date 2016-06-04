app.components.postModal = function ($modal) {

var image_urls = [];

//console.log('p modal');
	var $projectForm = $modal.find('.add-project-form');
	var $addProjectBtn = $modal.find('.add-project');
	var $addDetailsForm = $modal.find('.add-details-form');
	var $description = $addDetailsForm.find('#description');

	//var $detailsPreview = $modal.find('.details-preview');
	//var $addDetailsBtn = $modal.find('.add-details-btn');
	//var details = {};

	$addProjectBtn.on('click', function(ev) {
		ev.preventDefault();
		formData = app.utils.getFormData($projectForm);
		formData.image_urls = image_urls;
		formData.details = {post: $description.val()};
		formData.idea = '';
		formData.type = 'blog';
		console.log('click', formData);
		app.utils.ajax.post('/addproject', {

		data:	formData
		}).then(function (data) {
  		toastr.success('Your Post Added Successfully', 'success', 5);
    	app.utils.unloadOpenModals();
      app.utils.reloadPanel();

      });

	});	


	var $uploadForm = $modal.find('.upload-picker');
	var $uploadInput = $uploadForm.find('#uploadInput');
	var $uploadBtn = $uploadForm.find('#uploadBtn');
	var photoData = new FormData();
	var handleFiles = function (files) {
		console.log('handleFiles');
	    var files = $uploadInput.prop('files');
	    _.forEach(files, function (file) {
	        photoData.append('file', file);
	        $uploadInput.parents('.img-upload-picker').find('.uploader-img-name').val(file.name);
	    });
	    console.log('photo', photoData);
	    app.utils.ajax.post('/upload', {
	        data: photoData,
	        processData: false,
	        contentType: false,
	        mimeType: false,
	    }).then(function (data) {
	        console.log(data.uploadedFiles, data, 'data aaya');
	        image_urls = _.map(data.uploadedFiles, function (obj) {
	            //console.log(obj);
	            //_.omit(obj, 's3Instance');
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
	                class: 'col-md-3'
	            });
	            div.append(img);
	            $modal.find('#image-preview').append(div); // Assuming that "preview" is the div output where the content will be displayed.
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
	$uploadInput.on('change', function (ev) {
		//console.log('upload change');
	    ev.preventDefault();
	    handleFiles($uploadInput.prop('files'));
	});
/*	$uploadBtn.on('click', function (ev) {
	    ev.preventDefault();
	    var files = $uploadInput.prop('files');
	    _.forEach(files, function (file) {
	        photoData.append('file', file);
	    });
	    app.utils.ajax.post('/upload', {
	        data: photoData,
	        processData: false,
	        contentType: false,
	        mimeType: false,
	    }).then(function (data) {
	        $uploadInput.val();
	        app.$body.find('#parsedForm').html(data);
	    });
	});*/


/*	$addDetailsBtn.on('click', function(ev){
		ev.preventDefault();
		var $title = $addDetailsForm.find('#title');
		var $description = $addDetailsForm.find('#description');
		var title = $title.val();
		var description = $description.val();

		details.push({title: title, description: description});

		$detailsPreview.append('<li class="list-group-item"><span><b>' + title + ':</b></span>' + description + '</li>');

		$title.val('');
		$description.val('');
	});*/


};
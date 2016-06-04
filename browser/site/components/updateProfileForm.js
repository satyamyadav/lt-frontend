app.components.updateProfileForm = function ($form) {
  var $singnupPanel = $form.find('.sign-up');
  var $signupForm = $singnupPanel.find('#signup-form');
  var $detailsForm = $singnupPanel.find('.details-form');
  var $userEmail = $signupForm.find('.user-email');
  var $username = $signupForm.find('.username');
  var $userFullName = $signupForm.find('.user-full-name');
  var $userPassword = $signupForm.find('.user-password');
  var $userConfirmPassword = $signupForm.find('.user-confirm-password');
  var $signupBtn = $signupForm.find('.signupBtn');
  var $signupAlert = $singnupPanel.find('#signupalert');
  var image_urls = [];
  var userId = $form.data('user-id');



  $signupBtn.on('click', function (ev) {
    ev.preventDefault(); 
    app.utils.btnStateChange($signupBtn, "Wait", true);


    if ($userPassword.val() == $userConfirmPassword.val())  {
      
      var formData = {
        //username: $username.val(),
        full_name: $userFullName.val(),
        email: $userEmail.val(),
        //password: $userPassword.val(),
        details: {}
      };

      formData.details = app.utils.getFormData($detailsForm);

      if (image_urls.length > 0) {
        //console.log(image_urls.length);
        formData.details.image_urls = image_urls;

      };

      //console.log('for details: ', formData);
      app.utils.ajax.put('/profile/' + userId , {
        data: formData
      })
      .then(function (data) {
        //authSuccess();
        app.utils.reloadNavAndPanel();

      },
      function (res) {
        $signupAlert.show();
        app.utils.btnStateChange($signupBtn, "Sign Up", false);
        $signupAlert.find('p').html("Sign Up failed");


      });
    } else {
        $signupAlert.show();
        $signupAlert.find('p').html("password didn't match");
        app.utils.btnStateChange($signupBtn, "Sign Up", false);

    };
  });


  var $uploadForm = $form.find('.upload-picker');
  var $uploadInput = $uploadForm.find('#uploadInput');
  var $uploadBtn = $uploadForm.find('#uploadBtn');
  var photoData = new FormData();
  var handleFiles = function (files) {
    //console.log('files');
      //var files = $uploadInput.prop('files');
      _.forEach(files, function (file) {
          photoData.append('file', file);
          //$uploadInput.parents('.img-upload-picker').find('.uploader-img-name').val(file.name);
      });
      //console.log('photo', photoData);
      app.utils.ajax.post('/upload', {
          data: photoData,
          processData: false,
          contentType: false,
          mimeType: false,
      }).then(function (data) {
         // console.log(data.uploadedFiles, data, 'data aaya');
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
              $form.find('#image-preview').empty().append(div); // Assuming that "preview" is the div output where the content will be displayed.
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


};
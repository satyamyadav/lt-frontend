app.components.loginPage = function ($modal) {
  var authSuccess = function (user) {
    app.utils.unloadModal($modal.parent());
    toastr.success('Success !!', 'success', 5);
    if (app.requestArgs) {
      app.utils.requestDeserializer(app.requestArgs);
    }

    if ((app.utils.currentUrl() === app.utils.domain() + '/') || (app.utils.currentUrl() === app.utils.domain() + '/auth/login')) {
         app.utils.reloadNavAndPanel();
    } else {
      app.utils.reloadNavAndPanel();
    }
  };
  var $singninPanel = $modal.find('.sign-in');
  var $singnupPanel = $modal.find('.sign-up');
  var $loginForm = $singninPanel.find('#login-form');
  var $signupForm = $singnupPanel.find('#signup-form');
  var $detailsForm = $singnupPanel.find('.details-form');
  var $loginBtn = $loginForm.find('#loginBtn');
  var $gplusBtn = $loginForm.find('.gplus');
  var $fbBtn = $loginForm.find('.fb');
  var $userEmail = $signupForm.find('.user-email');
  var $username = $signupForm.find('.username');
  var $userFullName = $signupForm.find('.user-full-name');
  var $userPassword = $signupForm.find('.user-password');
  var $userConfirmPassword = $signupForm.find('.user-confirm-password');
  var $signupBtn = $signupForm.find('.signupBtn');
  var $signUpLink = $singninPanel.find('.signup-link');
  var $signupAlert = $singnupPanel.find('#signupalert');
  var $signinAlert = $singninPanel.find('#loginalert');
  var image_urls = [];

    $signUpLink.on('click', function (ev) {
    ev.preventDefault();
    $singninPanel.slideUp();
    $singnupPanel.slideDown();
  });
 

  $loginBtn.on('click', function (ev) {
    ev.preventDefault(); 
    app.utils.btnStateChange($loginBtn, "Signing In", true);

    var formData = {
      email: $loginForm.find('#email').val(),
      password: $loginForm.find('#password').val()
    };


    app.utils.ajax.post('/auth/local', {
      data: formData
    }).then(
      function (data) {
        authSuccess();
      },
      function (res) {
       // console.log(res.status);
        $signinAlert.show();
        app.utils.btnStateChange($loginBtn, "Login", false);

      }
    )
  });

  $signupBtn.on('click', function (ev) {
    ev.preventDefault(); 
    app.utils.btnStateChange($signupBtn, "Wait", true);


    if ($userPassword.val() == $userConfirmPassword.val())  {
      
      var formData = {
        username: $username.val(),
        full_name: $userFullName.val(),
        email: $userEmail.val(),
        password: $userPassword.val(),
        //details: {}
      };

      //formData.details = app.utils.getFormData($detailsForm);
      //formData.details.image_urls = image_urls;
      //console.log('for details: ', formData);
      app.utils.ajax.post('/auth/register', {
        data: formData
      })
      .then(function (data) {
        authSuccess();
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


  var $uploadForm = $modal.find('.upload-picker');
  var $uploadInput = $uploadForm.find('#uploadInput');
  var $uploadBtn = $uploadForm.find('#uploadBtn');
  var photoData = new FormData();
  var handleFiles = function (files) {
    //console.log('handleFiles');
      //var files = $uploadInput.prop('files');
      _.forEach(files, function (file) {
          photoData.append('file', file);
          $uploadInput.parents('.img-upload-picker').find('.uploader-img-name').val(file.name);
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


  (function initializeOpenUniquePopUp() {
    //set this to domain name
    var openedDomain = app.utils.domain();
    var trackedWindows = {};
    var wName, pingPopup, popUp;
    window.openUniquePopUp = function (path, windowName, specs) {
      trackedWindows[windowName] = false;
      popUp = window.open(null, windowName, specs);
      popUp.postMessage(wName, openedDomain);
      setTimeout(checkIfOpen, 1000);
      pingPopup = setInterval(checkIfPinged, 1000);
      wName = windowName;
      function checkIfOpen() {
        if (!trackedWindows[windowName]) {
          popUp = window.open(openedDomain + path, windowName, specs);
          popUp.postMessage(wName, openedDomain);
        }
      }

      function checkIfPinged() {
        popUp.postMessage(wName, openedDomain);
      }
    };

    if (window.addEventListener) {
      window.addEventListener('message', onPingBackMessage, false);

    } else if (window.attachEvent) {
      window.attachEvent('message', onPingBackMessage, false);
    }

    function onPingBackMessage(event) {
      if (event.origin == openedDomain && event.data === wName) {
        var winst = event.source;
        clearInterval(pingPopup);
        winst.close();
        authSuccess(event.data);
        trackedWindows[event.data] = true;
      }
    };
  })();

    /**
     * Social login
     */

    var w = 700;
    var h = 480;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);

    $fbBtn.on('click', function (ev) {
      window.openUniquePopUp('/auth/facebook', 'facebook', 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left);
    });
    
    $gplusBtn.on('click', function (ev) {
      window.openUniquePopUp('/auth/google', 'google', 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left);
    });
};
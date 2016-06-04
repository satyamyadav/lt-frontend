app.components.fbCardPage = function ($panel) {
  var authSuccess = function (data) {
    console.log('fbcard success>>', data);
    //app.utils.unloadModal($modal.parent());
    toastr.success('Success !!', 'success', 5);
    /*if (app.requestArgs) {
    app.utils.requestDeserializer(app.requestArgs);
    }

    if ((app.utils.currentUrl() === app.utils.domain() + '/') || (app.utils.currentUrl() === app.utils.domain() + '/auth/login')) {
       app.utils.reloadNavAndPanel();
    } else {
    app.utils.reloadNavAndPanel();
    }*/
  };


  var $preview = $panel.find('#preview');
  var $canvas = $panel.find('#canvas');
  var $icard = $panel.find('.i-card');
  var $shareBtn = $panel.find('.share-btn');
  var $refreshBtn = $panel.find('.refresh-btn');
  var shareUrl = $icard.data('share-url');
  var imgUrl = $icard.data('img-url');
  var $canvasDiv = $icard.find('.div-to-canvas');
  var $profilePicture = $icard.find('.profile-picture');
  var $overlayPicture = $icard.find('.overlay-picture');
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

  $('html,body').animate({scrollTop: ($canvasDiv.offset().top - 60 )},500);

  var img = new Image,
      canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),
      src = $profilePicture.attr('src'); //"https://graph.facebook.com/v2.4/1080195812025383/picture?type=large"; // insert image url here

  img.crossOrigin = "Anonymous";

  img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage( img, 0, 0 );
      localStorage.setItem( "savedImageData", canvas.toDataURL("image/png", 1.0) );
  }
  img.src = src;
  // make sure the load event fires for cached images too
  if ( img.complete || img.complete === undefined ) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
  } 

  $profilePicture.attr({src:localStorage.getItem("savedImageData")});
       


  html2canvas($canvasDiv, {
    onrendered: function(canvas) {
    var myImage = canvas.toDataURL();
    handleFiles(myImage);

    //document.body.appendChild(canvas);
     
  },
  //logging:true
  //width: 400,
  //height: 400
  });

}

render();





  $refreshBtn.on('click', function (ev) {
    //console.log('upload change');
    ev.preventDefault();
    render();
  });



  var w = 700;
  var h = 480;
  var left = (screen.width / 2) - (w / 2);
  var top = (screen.height / 2) - (h / 2);

  $shareBtn.on('click', function (ev) {
    ev.preventDefault();
    render();
    /*app.utils.ajax.post('/fb', {
    data: {
      imgUrl: imgUrl
    }
    }).then(function(data){
    console.log(data);
    });*/
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + shareUrl, 'facebook', 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left)
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
/*
    $shareBtn.on('click', function (ev) {
    render();
    window.openUniquePopUp('/auth/facebook/post', 'facebook', 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left);
    });*/


  
}
app.components.updateResumeForm = function ($panel) {
  var $form = $panel.find('form');
  var image_urls = [];
  var userId = $panel.data('user-id');
  var $downloadResume = app.$body.find('.download-resume');
  var $resume = app.$body.find('#resume-print');

/*
  $.fn.serializeObject = function()
  {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
  };*/

  $.fn.serializeObject = function(){

      var self = this,
          json = {},
          push_counters = {},
          patterns = {
              "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
              "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
              "push":     /^$/,
              "fixed":    /^\d+$/,
              "named":    /^[a-zA-Z0-9_]+$/
          };


      this.build = function(base, key, value){
          base[key] = value;
          return base;
      };

      this.push_counter = function(key){
          if(push_counters[key] === undefined){
              push_counters[key] = 0;
          }
          return push_counters[key]++;
      };

      $.each($(this).serializeArray(), function(){

          // skip invalid keys
          if(!patterns.validate.test(this.name)){
              return;
          }

          var k,
              keys = this.name.match(patterns.key),
              merge = this.value,
              reverse_key = this.name;

          while((k = keys.pop()) !== undefined){

              // adjust reverse_key
              reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

              // push
              if(k.match(patterns.push)){
                  merge = self.build([], self.push_counter(reverse_key), merge);
              }

              // fixed
              else if(k.match(patterns.fixed)){
                  merge = self.build([], k, merge);
              }

              // named
              else if(k.match(patterns.named)){
                  merge = self.build({}, k, merge);
              }
          }

          json = $.extend(true, json, merge);
      });

      return json;
  };



  $form.on('submit', function (ev) {
          ev.preventDefault();
          console.log('submit start');
          console.log($form.serializeObject());



      
      var formData = {
        //username: $username.val(),
        //full_name: $userFullName.val(),
        //email: $userEmail.val(),
        //password: $userPassword.val(),
        details: {}
      };

      //formData.details = app.utils.getFormData($detailsForm);

      if (image_urls.length > 0) {
        //console.log(image_urls.length);
        formData.details.image_urls = image_urls;

      };

      formData.details.resume = $form.serializeObject();

      //console.log('for details: ', formData);
      app.utils.ajax.put('/resume/' + userId , {
        data: formData
      })
      .then(function (data) {
        toastr.success('Success !!', 'success', 5);

        //authSuccess();
        //app.utils.reloadNavAndPanel();

      },
      function (res) {
        app.utils.btnStateChange($signupBtn, "Sign Up", false);


      });
   

          return false;

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



  $downloadResume.on('click', function (ev) {
    ev.preventDefault();
    window.print();
/*    $resume.printThis({
        debug: false,               
        importCSS: true,            
        importStyle: true,         
        printContainer: false,       
        loadCSS: 'https://scrietossdg.herokuapp.com/css/site.css',  
        removeInline: false,      
        printDelay: 333,          
        formValues: false          
    });
*/

  });


};
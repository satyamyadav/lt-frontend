app.components.projectCard = function ($card) {
  var $upvoteBtn = $card.find('.upvote-btn');
  var $upvoteWrap = $upvoteBtn.parent();
  var $commentInput = $card.find('.comment-input');
  var $postCommentBtn = $card.find('.post-comment-btn');
  var $comments = $card.find('.comments');
  var $form = $card.find('form');
  var $unlockAddress = $card.find('.unlock-address');
  var $addReview = $unlockAddress.find('.add-review');
  var $unlockAddressBtn = $unlockAddress.find('.unlock-address-btn');
  var $lockedAddress = $card.find('.locked-address');
  var $upvoteCount = $card.find('.upvote-count');
  var $commentCount = $card.find('.comment-count');
  var $reviewTags = $card.find('.review-tags');
  var $reviewText = $card.find('.remark-text');
  var $reviewTagsBtn = $card.find('.review-tags-btn');
  var $deleteReviewBtn = $card.find('.delete-review');
  //var $projectImg = $card.find('.project-img');
  //var $projectImgContainer = $card.find('.project-img-container');
  var url = '';
  var shareUrl = $card.data('share-url');
  var notExpand = true;
  var projectId = $card.data('project-id');

    /** prevent page refresh on form submit
     */

    $form.on('submit', function(ev) {
        ev.preventDefault();
    });

    $upvoteWrap.on('click', function(ev) {
        url = $upvoteBtn.data('url');
        app.utils.ajax.post(url).then(
            function(data) {

                var upvoteCount = parseInt($upvoteCount.html());


                if ($upvoteBtn.hasClass('upvoted')) {
                    $upvoteBtn.removeClass('upvoted');
                    //$upvoteBtn.html(' Upvote ');
                    $upvoteBtn.removeClass('fa-arrow-down');
                    $upvoteBtn.addClass('fa-arrow-up');
                    $upvoteCount.html(upvoteCount - 1)
                } else {
                    $upvoteBtn.addClass('upvoted');
                    //$upvoteBtn.html(' Upvoted');
                    $upvoteBtn.removeClass('fa-arrow-up');
                    $upvoteBtn.addClass('fa-arrow-down');
                    $upvoteCount.html(upvoteCount + 1)
                }
            },
            function(err) {
                console.log(err);
            }
        );
    });

    var postComment = function() {

      if ($commentInput.val().trim().length == 0) {
          toastr.notify('write some comment', 'danger', 10);
      } else {
          url = $commentInput.data('url');
          app.utils.ajax.post(url, {
              data: {
                  comment: $commentInput.val()
              },
          })
              .then(function(data) {
                      getComments(projectId);
                      $commentInput.attr('placeholder', 'Your comment is posted successfully !  write anoter comment');
                      $commentInput.val('');
                      $comments.slideDown();
                  },
                  function(err) {
                      console.log(err);
                  });
      };
    };  

    $commentInput.keyup(function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
          postComment();
        }
    });
    
    $postCommentBtn.on('click', function(event) {
            event.preventDefault();
            postComment();
        });
/*
    var getTags = function () {
      app.utils.ajax.get('/review/tags', {
        data: {

          flatId: flatId
        }  
      }).then(function (data) {
        $reviewTags.empty().append(data);
      }, function (err) {
        console.log('error');
      });

    }; */


    var getComments = function(projectId){
      app.utils.ajax.get('/project/' + projectId + '/comments')
      .then(function (data) {
        //$reviewTags.empty().append(data);
      //console.log(data);
      $comments.find('.comment-list').empty().append(data);
      }, function (err) {
        console.log('error');
      });

    };


    $commentCount.on('click', function (ev) {
        ev.preventDefault();
        getComments(projectId);
        $comments.slideToggle( 'display' );
     });




    /*
     * Share
     */
    var w = 700;
    var h = 480;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var shareText = $card.data('share-text');
    var $fbShare = $card.find(".fb-shr-btn");
    var $twtShare = $card.find(".twt-shr-btn");
    var $gglShare = $card.find(".ggl-shr-btn");
    var postId = $card.data('post-id');

    $fbShare.on('click', function (ev) {
      ev.preventDefault();
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + shareUrl, 'facebook', 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left)
    });  
    
    $twtShare.on('click', function (ev) {
        ev.preventDefault();
        window.open('https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + shareText, 'twitter', 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left)
    });  
    
    $gglShare.on('click', function (ev) {
      ev.preventDefault();
      window.open('https://plus.google.com/share?url=' + shareUrl, 'google', 'width=' + w + ',height=' + h + ',top=' + top + ',left=' + left)
    });  

  $deleteReviewBtn.on('click', function(ev){
    ev.preventDefault();
    var reviewId = $deleteReviewBtn.data('review-id');
    var del = confirm('are you sure ?');
    if (del) {
      app.utils.ajax.post('/review/delete', {
        data : {
          reviewId : reviewId 
        }
      }).then(function(data){
        $card.remove();
      }, 
      function(err){
        alert('opps could not delete');
      });
    };
  });  

var truncate = function ($parent) {
  $truncateBtn = $parent.find('.text-truncate-link');

  $truncateBtn.on('click', function(ev) {
    ev.preventDefault();
    $truncateHalf = $parent.find('.text-truncate-half');
    $truncateFull = $parent.find('.text-truncate-full');
    $truncateHalf.html($truncateFull.html());
    //$truncateFull.slideDown('fast');
    
  });
}

truncate($reviewText);


/*
$projectImg.on('click', function (ev){
  ev.preventDefault();
  var urls = $projectImg.data('image-urls');
  app.utils.gallery(urls);
});

$projectImgContainer.on('click', function (ev){
  ev.preventDefault();
  var urls = $projectImg.data('image-urls');
  app.utils.gallery(urls);
});
*/


};
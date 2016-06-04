app.components.followBtn = function ($followBtnComponent, $followersCount) {
  var $followBtn = $followBtnComponent.find('.followBtn');
  var $followersCount = $followBtnComponent.find('.followersCount');

  /**
   * for mixPanel Data
   */
  var screen = app.$body.data('pagename');
  var screenType = app.$body.data('userpage')
  var username = $followBtn.data('username');
  var userid = $followBtn.data('user-id');
  var link = $followBtn.data('entity-link');
 	var type = $followBtn.data('entity-type');
 	var following = $('body').data('username');
  var targetUrl = $followBtn.data('target');
  var followActionUrl = function (type) {
    var parts = targetUrl.split('/');
    parts[1] = type;
    return parts.join('/');
  };

  var attachFollowingBehavior = function () {
    $followBtn.hover(
      function () {

        $followBtn.html('Unfollow');
      },
      function () {
        $followBtn.html('Followed');

      }
    );
  };

  var detachFollowingBehavior = function () {
    $followBtn.off('mouseenter');
    $followBtn.off('mouseleave');
    $followBtn.html('Follow');
  };

  //var profile = $followBtn.data('profile');
  //var username = $followBtn.data('username');
  //var page = app.$body.data('source');
  //app.utils.btnStateChange($followBtn, "Processing...", true);

  $followBtn.on('click', function (ev) {
    ev.stopPropagation();
    //console.log('following btn ==== ', targetUrl);
    $followBtn.html('Loading');
    app.utils.ajax.post(targetUrl)
      .then(
      function (data) {
        //var state = $followBtn.data('state');
        var state = $followBtn.hasClass('following') ? 'following' : 'not-following';
        //console.log('state btn ==== ', state, data);

        if (state === 'not-following') {
          $followBtn.addClass('following');
          $followBtn.attr('data-state', 'following');
          var url = followActionUrl('unfollow')
          $followBtn.attr("data-target", followActionUrl('unfollow'));
          targetUrl = url;

          if ($followersCount !== undefined) {
            $followersCount.length > 0 && $followersCount.html(parseInt($followersCount.html()) + 1);
          }

          $followBtn.html('Following');
          
        } else if (state === 'following') {
          $followBtn.removeClass('following');
          $followBtn.attr('data-state', 'not-following');
          $followBtn.attr("data-target", followActionUrl('follow'));
          var url = followActionUrl('follow')
          
          targetUrl = url;
          $followBtn.html('Follow');

          
          if ($followersCount !== undefined) {
            $followersCount.length > 0 && $followersCount.html(parseInt($followersCount.html()) - 1);
          }

          
        }
        //var page = app.$body.data('page');
      }
      ,
      function (xhr) {
        app.utils.btnStateChange($followBtn, "Follow", false);
        if (xhr.status !== 401) {

        }
        ;
      }
      );
  });

}

app.behaviors.global = function () {

  /**
   * top level search box 
   */
  var headerHeight = $('.navbar').outerHeight();
  var marNegSearch = 200; //parseInt($('.search-box-banner').css('top'));
  var calc = headerHeight + marNegSearch;
  var scrollTop = app.$window.scrollTop();
      
      if (scrollTop > 200 || app.pagename == 'profile') {
        $('.search-box-nav').show();
        $('.search-box-banner').removeClass('search');
        $('.mobile-brand-logo').hide();
      }  


  app.$document.ready(function(){


    app.pagename = $('#panel').data('page-name');
      app.utils.scrollLock($('.scroll-lock'));
    if (app.pagename === 'homepage') {
    };
  });

  app.$window.on("scroll", function(e) {
    var scrollTop = app.$window.scrollTop();
        if (scrollTop > 50 || app.pagename == 'profile' /*calc/2*/) {
            $('.mobile-brand-logo').hide();
            $('.navbar-fixed-top').addClass('navbar-std');
            $('.navbar-fixed-top').removeClass('navbar-std-flat');
            

        } else {
            $('.mobile-brand-logo').show();
            $('.navbar-fixed-top').removeClass('navbar-std');
            $('.navbar-fixed-top').addClass('navbar-std-flat');
            
        }

    if (app.pagename === 'homepage') {
      app.utils.scrollLock($('.scroll-lock'));
    };
    app.utils.loadMore($('.load-more'));

        
  });
};

$(function(){
  app.behaviors.global();
});    
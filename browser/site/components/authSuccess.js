app.components.authModalSuccess = function ($modal) {
  // window.close();
  (function listenForPings() {
    var openerDomain = app.utils.domain();
    console.log("child active");
    console.log(openerDomain);
    
    if (window.addEventListener) {
      window.addEventListener('message', onPingMessage, false);
    } else if (window.attachEvent) {
      window.attachEvent('message', onPingMessage, false);
    }

    function onPingMessage(event) {
      console.log('ping message sending back');
      if (event.origin == openerDomain)
        event.source.postMessage(event.data, event.origin);
    }
  })();
};
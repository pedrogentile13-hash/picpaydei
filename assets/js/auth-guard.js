/* ============================
   picpay.de.i — Auth Guard
   Redirects to login if not authenticated
   ============================ */

(function() {
  var isRoot = window.location.pathname.indexOf('/pages/') === -1;
  var loginPath = isRoot ? 'pages/login.html' : 'login.html';

  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      window.location.href = loginPath;
    } else {
      window._currentUser = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || user.email
      };
      var app = document.getElementById('app');
      if (app) app.style.visibility = 'visible';
    }
  });
})();

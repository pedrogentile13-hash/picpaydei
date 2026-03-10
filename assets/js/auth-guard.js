/* ============================
   picpay.de.i — Auth Guard
   Redirects to login if not authenticated
   Redirects to setup if professor not configured
   ============================ */

(function() {
  var isRoot = window.location.pathname.indexOf('/pages/') === -1;
  var loginPath = isRoot ? 'pages/login.html' : 'login.html';
  var setupPath = isRoot ? 'pages/setup.html' : 'setup.html';

  // Check if we're on the setup page
  var isSetupPage = window.location.pathname.indexOf('setup.html') !== -1;

  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      window.location.href = loginPath;
    } else {
      window._currentUser = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || user.email
      };

      // Check if professor is configured (unless we're on setup page)
      if (!isSetupPage && typeof Store !== 'undefined' && !Store.isProfessorConfigured()) {
        window.location.href = setupPath;
        return;
      }

      var app = document.getElementById('app');
      if (app) app.style.visibility = 'visible';
    }
  });
})();

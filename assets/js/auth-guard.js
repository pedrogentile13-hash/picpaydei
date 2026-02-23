/* ============================
   picpay.de.i — Auth Guard
   Redirects to login if not authenticated
   ============================ */

(function() {
  // Determine login page path based on current location
  var isRoot = window.location.pathname.indexOf('/pages/') === -1;
  var loginPath = isRoot ? 'pages/login.html' : 'login.html';

  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      window.location.href = loginPath;
    } else {
      // Store user info for display
      window._currentUser = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || user.email
      };
      // Show page content (hidden by default until auth check)
      var app = document.getElementById('app');
      if (app) app.style.visibility = 'visible';
      // Trigger callback if defined
      if (typeof onAuthReady === 'function') onAuthReady(user);
    }
  });
})();

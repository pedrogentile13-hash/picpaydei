/* ============================
   picpay.de.i — Auth Guard
   Redirects to login if not authenticated
   Uses localStorage session (Firestore-based auth)
   ============================ */

(function() {
  var SESSION_KEY = 'picpay_dei_session';
  var isRoot = window.location.pathname.indexOf('/pages/') === -1;
  var loginPath = isRoot ? 'pages/login.html' : 'login.html';

  try {
    var session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session || !session.username) {
      window.location.href = loginPath;
      return;
    }
    // Make session available globally
    window._currentUser = session;
    // Show page content
    var app = document.getElementById('app');
    if (app) app.style.visibility = 'visible';
  } catch(e) {
    window.location.href = loginPath;
  }
})();

/* ============================
   Lidara — Shared Components
   ============================ */

const Components = (() => {

  var inPagesFolder = window.location.pathname.indexOf('/pages/') !== -1;
  var pagesPrefix = inPagesFolder ? '' : 'pages/';
  var rootPrefix = inPagesFolder ? '../' : '';

  var menuItems = [
    { id: 'home',          label: 'Início',          href: function() { return rootPrefix + 'index.html'; },          icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/>' },
    { id: 'dashboard',     label: 'Dashboard',       href: function() { return pagesPrefix + 'dashboard.html'; },     icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>' },
    { id: 'alunos',        label: 'Alunos',          href: function() { return pagesPrefix + 'alunos.html'; },        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>' },
    { sep: true },
    { id: 'negativos',     label: 'Negativos',       href: function() { return pagesPrefix + 'negativos.html'; },     icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>' },
    { id: 'positivos',     label: 'Positivos',       href: function() { return pagesPrefix + 'positivos.html'; },     icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>' },
    { id: 'qualitativa',   label: 'Qualitativa',     href: function() { return pagesPrefix + 'qualitativa.html'; },   icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>' },
    { id: 'pb',            label: 'Prova Bimestral', href: function() { return pagesPrefix + 'pb.html'; },            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>' },
    { id: 'va',            label: 'VA',              href: function() { return pagesPrefix + 'va.html'; },            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>' },
    { sep: true },
    { id: 'boletim',       label: 'Boletim',         href: function() { return pagesPrefix + 'boletim.html'; },       icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>' },
    { id: 'relatorios',    label: 'Relatórios',      href: function() { return pagesPrefix + 'relatorios.html'; },    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
    { id: 'configuracoes', label: 'Configurações',   href: function() { return pagesPrefix + 'configuracoes.html'; }, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' },
  ];

  // -------------------------------------------------------
  // topnav — fixed top navigation bar (height 56px)
  // -------------------------------------------------------
  function topnav(activePage) {
    var linksHTML = '';
    menuItems.forEach(function(item) {
      if (item.sep) {
        linksHTML += '<span class="topnav-sep">|</span>';
      } else {
        var isActive = item.id === activePage;
        linksHTML +=
          '<a href="' + item.href() + '" class="topnav-link' + (isActive ? ' active' : '') + '" title="' + item.label + '">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">' + item.icon + '</svg>' +
            '<span>' + item.label + '</span>' +
          '</a>';
      }
    });

    return '<nav class="topnav" id="topnav">' +
      '<div class="topnav-logo">Lidara</div>' +
      '<div class="topnav-links" id="topnavLinks">' + linksHTML + '</div>' +
      '<div class="topnav-right">' +
        '<span class="topnav-user" id="topnavUser"></span>' +
        '<button class="topnav-logout" onclick="doLogout()">' +
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px;vertical-align:-3px;margin-right:4px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>' +
          'Sair' +
        '</button>' +
        '<button class="topnav-hamburger" id="topnavHamburger" onclick="toggleMobileMenu()">' +
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:24px;height:24px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
        '</button>' +
      '</div>' +
    '</nav>' +
    '<div class="topnav-mobile-menu" id="topnavMobileMenu">' + linksHTML + '</div>' +
    '<div class="topnav-overlay" id="topnavOverlay" onclick="toggleMobileMenu()"></div>';
  }

  // -------------------------------------------------------
  // subheader — page title + context selects (height 52px)
  // -------------------------------------------------------
  function subheader(title, showControls) {
    if (showControls === undefined) showControls = true;
    var settings = Store.getSettings();
    var controlsHTML = '';

    if (showControls === true) {
      var turmaOptions = Store.TURMAS.map(function(t) {
        return '<option value="' + t + '"' + (t === settings.turma ? ' selected' : '') + '>' + Store.formatTurma(t) + '</option>';
      }).join('');
      var bimOptions = Store.BIMESTRES.map(function(b) {
        return '<option value="' + b + '"' + (b === settings.bimestre ? ' selected' : '') + '>' + Store.BIMESTRE_LABELS[b] + '</option>';
      }).join('');
      controlsHTML =
        '<div class="subheader-controls">' +
          '<div class="subheader-select"><label>Bimestre</label><select id="selectBimestre" onchange="handleBimestreChange()">' + bimOptions + '</select></div>' +
          '<div class="subheader-select"><label>Turma</label><select id="selectTurma" onchange="handleTurmaChange()">' + turmaOptions + '</select></div>' +
          '<div class="subheader-select"><label>Matéria</label><select id="selectMateria" onchange="handleMateriaChange()"></select></div>' +
        '</div>';
    }

    return '<div class="subheader">' +
      '<h2 class="subheader-title">' + title + '</h2>' +
      controlsHTML +
    '</div>';
  }

  // Keep sidebar() as alias for backwards compat with index.html / pages not yet updated
  function sidebar(activePage) {
    return topnav(activePage);
  }

  // Keep topbar() for pages that still call Components.topbar()
  function topbar(title, showControls) {
    return subheader(title, showControls);
  }

  function footer() {
    var syncIndicator = Store.isSyncEnabled()
      ? '<span id="syncIndicator" style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#40c074;"></span> Nuvem</span>'
      : '<span style="color:#9ca3af;">Offline</span>';
    return '<footer class="site-footer"><span>Lidara &copy; ' + Store.ANO_LETIVO + '</span>' + syncIndicator + '</footer>';
  }

  return { topnav: topnav, subheader: subheader, sidebar: sidebar, topbar: topbar, footer: footer };
})();

// -------------------------------------------------------
// Global helpers
// -------------------------------------------------------
function toggleMobileMenu() {
  document.getElementById('topnavLinks').classList.toggle('mobile-open');
  document.getElementById('topnavMobileMenu').classList.toggle('open');
  document.getElementById('topnavOverlay').classList.toggle('open');
}

// Legacy alias
function toggleSidebar() { toggleMobileMenu(); }

function handleTurmaChange() {
  var turma = document.getElementById('selectTurma').value;
  var sel = document.getElementById('selectMateria');
  sel.innerHTML = Store.getMaterias(turma).map(function(m) { return '<option value="' + m + '">' + m + '</option>'; }).join('');
  var bim = document.getElementById('selectBimestre');
  Store.saveSettings(turma, sel.value, bim ? bim.value : '1');
  if (typeof onContextChange === 'function') onContextChange();
}

function handleMateriaChange() {
  var bim = document.getElementById('selectBimestre');
  Store.saveSettings(document.getElementById('selectTurma').value, document.getElementById('selectMateria').value, bim ? bim.value : '1');
  if (typeof onContextChange === 'function') onContextChange();
}

function handleBimestreChange() {
  Store.saveSettings(document.getElementById('selectTurma').value, document.getElementById('selectMateria').value, document.getElementById('selectBimestre').value);
  if (typeof onContextChange === 'function') onContextChange();
}

function initSelects() {
  var settings = Store.getSettings();
  var turmaEl = document.getElementById('selectTurma');
  var materiaEl = document.getElementById('selectMateria');
  var bimEl = document.getElementById('selectBimestre');
  if (!turmaEl || !materiaEl) return;
  turmaEl.value = settings.turma;
  materiaEl.innerHTML = Store.getMaterias(settings.turma).map(function(m) {
    return '<option value="' + m + '"' + (m === settings.materia ? ' selected' : '') + '>' + m + '</option>';
  }).join('');
  if (bimEl) bimEl.value = settings.bimestre || '1';
}

function getCurrentContext() {
  var turmaEl = document.getElementById('selectTurma');
  var materiaEl = document.getElementById('selectMateria');
  var bimEl = document.getElementById('selectBimestre');
  var settings = Store.getSettings();
  return {
    turma: turmaEl ? turmaEl.value : settings.turma,
    materia: materiaEl ? materiaEl.value : settings.materia,
    bimestre: bimEl ? bimEl.value : (settings.bimestre || '1'),
  };
}

function doLogout() {
  firebase.auth().signOut().then(function() {
    var isRoot = window.location.pathname.indexOf('/pages/') === -1;
    window.location.href = isRoot ? 'pages/login.html' : 'login.html';
  });
}

// Show logged-in username in topnav
firebase.auth().onAuthStateChanged(function(user) {
  var el = document.getElementById('topnavUser');
  if (el && user) el.textContent = user.displayName || user.email;
  // Legacy sidebar support
  var el2 = document.getElementById('sidebarUser');
  if (el2 && user) el2.textContent = user.displayName || user.email;
});

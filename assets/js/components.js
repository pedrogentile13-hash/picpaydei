/* ============================
   Lidara — Shared Components
   ============================ */

const Components = (() => {

  // Detect if we're in pages folder based on URL path
  var inPagesFolder = window.location.pathname.indexOf('/pages/') !== -1;
  var pagesPrefix = inPagesFolder ? '' : 'pages/';
  var rootPrefix = inPagesFolder ? '../' : '';

  // Icons library
  var icons = {
    dashboard: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>',
    alunos: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>',
    lancamentos: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>',
    negativos: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>',
    positivos: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>',
    qualitativa: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>',
    pb: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>',
    va: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>',
    visualizacao: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
    boletim: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>',
    relatorios: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    configuracoes: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
    perfil: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>',
    chevron: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>'
  };

  function svg(name) {
    return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">' + icons[name] + '</svg>';
  }

  function sidebar(activePage) {
    // Check if active page is in a dropdown group
    var lancamentosPages = ['negativos', 'positivos', 'qualitativa', 'pb', 'va'];
    var visualizacaoPages = ['boletim', 'relatorios'];
    var isLancamentoActive = lancamentosPages.indexOf(activePage) !== -1;
    var isVisualizacaoActive = visualizacaoPages.indexOf(activePage) !== -1;

    function navLink(id, label, iconName) {
      var activeClass = id === activePage ? ' active' : '';
      return '<a href="' + pagesPrefix + id + '.html" class="nav-link' + activeClass + '">' + svg(iconName || id) + '<span>' + label + '</span></a>';
    }

    function dropdownItem(id, label) {
      var activeClass = id === activePage ? ' active' : '';
      return '<a href="' + pagesPrefix + id + '.html" class="dropdown-item' + activeClass + '">' + label + '</a>';
    }

    var navHTML = '';

    // Dashboard (standalone)
    navHTML += navLink('dashboard', 'Dashboard', 'dashboard');

    // Alunos (standalone)
    navHTML += navLink('alunos', 'Alunos', 'alunos');

    // Lançamentos (dropdown)
    navHTML += '<div class="nav-dropdown' + (isLancamentoActive ? ' has-active' : '') + '">';
    navHTML += '<button class="nav-dropdown-trigger">' + svg('lancamentos') + '<span>Lançamentos</span>' + svg('chevron') + '</button>';
    navHTML += '<div class="nav-dropdown-menu">';
    navHTML += dropdownItem('negativos', 'Negativos');
    navHTML += dropdownItem('positivos', 'Positivos');
    navHTML += dropdownItem('qualitativa', 'Qualitativa');
    navHTML += dropdownItem('pb', 'Prova Bimestral');
    navHTML += dropdownItem('va', 'VA');
    navHTML += '</div></div>';

    // Visualização (dropdown)
    navHTML += '<div class="nav-dropdown' + (isVisualizacaoActive ? ' has-active' : '') + '">';
    navHTML += '<button class="nav-dropdown-trigger">' + svg('visualizacao') + '<span>Visualização</span>' + svg('chevron') + '</button>';
    navHTML += '<div class="nav-dropdown-menu">';
    navHTML += dropdownItem('boletim', 'Boletim');
    navHTML += dropdownItem('relatorios', 'Relatórios');
    navHTML += '</div></div>';

    return '<div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>' +
      '<header class="navbar" id="sidebar">' +
        '<div class="navbar-brand">' +
          '<div class="navbar-logo">L</div>' +
          '<div class="navbar-title">' +
            '<span class="navbar-name">Lidara</span>' +
            '<span class="navbar-year">' + Store.ANO_LETIVO + '</span>' +
          '</div>' +
        '</div>' +
        '<nav class="navbar-nav">' + navHTML + '</nav>' +
        '<div class="navbar-actions">' +
          '<a href="' + pagesPrefix + 'configuracoes.html" class="navbar-icon-btn' + (activePage === 'configuracoes' ? ' active' : '') + '" title="Configurações">' + svg('configuracoes') + '</a>' +
          '<div class="navbar-user">' +
            '<button class="navbar-user-btn" onclick="toggleUserMenu()">' +
              '<span id="sidebarUser">Usuário</span>' +
              svg('chevron') +
            '</button>' +
            '<div class="navbar-user-menu" id="userMenu">' +
              '<a href="' + pagesPrefix + 'perfil.html">' + svg('perfil') + ' Meu Perfil</a>' +
              '<button onclick="doLogout()">' +
                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>' +
                ' Sair' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<button class="navbar-hamburger" onclick="toggleSidebar()">' +
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
        '</button>' +
      '</header>';
  }

  function topbar(title, showControls) {
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
        '<div class="topbar-controls">' +
          '<div class="topbar-select"><label>Bimestre</label><select id="selectBimestre" onchange="handleBimestreChange()">' + bimOptions + '</select></div>' +
          '<div class="topbar-select"><label>Turma</label><select id="selectTurma" onchange="handleTurmaChange()">' + turmaOptions + '</select></div>' +
          '<div class="topbar-select"><label>Mat\u00e9ria</label><select id="selectMateria" onchange="handleMateriaChange()"></select></div>' +
        '</div>';
    }
    return '<header class="topbar">' +
      '<div style="display:flex;align-items:center;gap:12px;">' +
        '<button class="hamburger" onclick="toggleSidebar()"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button>' +
        '<div><h2 class="topbar-title">' + title + '</h2><span style="font-size:0.65rem;color:var(--gray-400);font-weight:600;">Ano Letivo ' + Store.ANO_LETIVO + '</span></div>' +
      '</div>' + controlsHTML + '</header>';
  }

  function footer() {
    var syncIndicator = Store.isSyncEnabled()
      ? '<span id="syncIndicator" style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:var(--green);"></span> Nuvem</span>'
      : '<span style="color:var(--gray-400);">Offline</span>';
    return '<footer class="site-footer"><span>Lidara &copy; ' + Store.ANO_LETIVO + '</span>' + syncIndicator + '</footer>';
  }

  return { sidebar: sidebar, topbar: topbar, footer: footer };
})();

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

function toggleUserMenu() {
  var menu = document.getElementById('userMenu');
  menu.classList.toggle('open');
}

// Close menus when clicking outside
document.addEventListener('click', function(e) {
  var userMenu = document.getElementById('userMenu');
  var userBtn = e.target.closest('.navbar-user-btn');
  if (userMenu && !userBtn && !e.target.closest('.navbar-user-menu')) {
    userMenu.classList.remove('open');
  }
});

// Mobile dropdown toggle
document.addEventListener('click', function(e) {
  if (window.innerWidth <= 768) {
    var trigger = e.target.closest('.nav-dropdown-trigger');
    if (trigger) {
      e.preventDefault();
      var dropdown = trigger.closest('.nav-dropdown');
      dropdown.classList.toggle('open');
    }
  }
});
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
// Show logged-in username in sidebar
firebase.auth().onAuthStateChanged(function(user) {
  var el = document.getElementById('sidebarUser');
  if (el && user) {
    el.textContent = user.displayName || user.email;
  }
});

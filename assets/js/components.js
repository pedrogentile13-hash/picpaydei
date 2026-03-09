/* ============================
   picpay.de.i — Shared Components
   ============================ */

const Components = (() => {

  function sidebar(activePage) {
    // Menu structure with collapsible groups
    var menuItems = [
      { id: 'home', label: 'Início', href: '../index.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/>' },
      { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>' },
      { id: 'alunos', label: 'Alunos', href: 'alunos.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>' },
      { id: 'negativos', label: 'Negativos', href: 'negativos.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>' },
      { id: 'qualitativa', label: 'Qualitativa', href: 'qualitativa.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
      {
        id: 'pb-group',
        label: 'Prova Bimestral',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>',
        children: [
          { id: 'pb', label: 'Notas PB', href: 'pb.html' },
          { id: 'pb-dashboard', label: 'Dashboard PB', href: 'pb-dashboard.html' }
        ]
      },
      {
        id: 'va-group',
        label: 'VA',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>',
        children: [
          { id: 'va', label: 'Notas VA', href: 'va.html' },
          { id: 'va-dashboard', label: 'Dashboard VA', href: 'va-dashboard.html' }
        ]
      },
      { id: 'boletim', label: 'Boletim', href: 'boletim.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>' },
      { id: 'relatorios', label: 'Relatórios', href: 'relatorios.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
      { id: 'configuracoes', label: 'Configurações', href: 'configuracoes.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' },
    ];

    // Check if active page is in a group
    function isInGroup(groupId) {
      var item = menuItems.find(function(m) { return m.id === groupId; });
      if (!item || !item.children) return false;
      return item.children.some(function(c) { return c.id === activePage; });
    }

    // Build menu HTML
    var navHTML = '';
    menuItems.forEach(function(item) {
      if (item.children) {
        // Collapsible group
        var isOpen = isInGroup(item.id);
        var groupClass = isOpen ? 'nav-group open' : 'nav-group';
        navHTML += '<div class="' + groupClass + '" data-group="' + item.id + '">';
        navHTML += '<div class="nav-group-header" onclick="toggleNavGroup(\'' + item.id + '\')">';
        navHTML += '<div style="display:flex;align-items:center;gap:10px;">';
        navHTML += '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">' + item.icon + '</svg>';
        navHTML += '<span>' + item.label + '</span>';
        navHTML += '</div>';
        navHTML += '<span class="nav-group-arrow">▼</span>';
        navHTML += '</div>';
        navHTML += '<div class="nav-group-children">';
        item.children.forEach(function(child) {
          var activeClass = child.id === activePage ? ' active' : '';
          navHTML += '<a href="' + child.href + '" class="nav-child' + activeClass + '">' + child.label + '</a>';
        });
        navHTML += '</div></div>';
      } else {
        // Regular item
        var activeClass = item.id === activePage ? ' active' : '';
        navHTML += '<a href="' + item.href + '" class="' + activeClass + '">';
        navHTML += '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">' + item.icon + '</svg>';
        navHTML += item.label + '</a>';
      }
    });

    return '<div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>' +
      '<aside class="sidebar" id="sidebar">' +
        '<div class="sidebar-logo">' +
          '<div class="icon">P</div>' +
          '<div class="text">' +
            '<h1>picpay.de.i</h1>' +
            '<p>Ano Letivo ' + Store.ANO_LETIVO + '</p>' +
          '</div>' +
        '</div>' +
        '<nav class="sidebar-nav">' +
          '<span class="nav-section">Menu Principal</span>' +
          navHTML +
        '</nav>' +
        '<div class="sidebar-footer">' +
          '<div id="sidebarUser" style="font-size:0.7rem;color:var(--gray-400);margin-bottom:8px;"></div>' +
          '<button onclick="doLogout()" style="background:none;border:1px solid var(--gray-300);border-radius:8px;padding:6px 14px;font-size:0.75rem;font-weight:700;color:var(--gray-500);cursor:pointer;transition:all 0.2s;" onmouseover="this.style.borderColor=\'var(--red)\';this.style.color=\'var(--red)\'" onmouseout="this.style.borderColor=\'var(--gray-300)\';this.style.color=\'var(--gray-500)\'">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:14px;height:14px;vertical-align:-2px;margin-right:4px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>' +
            'Sair' +
          '</button>' +
          '<div style="margin-top:8px;font-size:0.65rem;color:var(--gray-400);">picpay.de.i &copy; ' + Store.ANO_LETIVO + '</div>' +
        '</div>' +
      '</aside>';
  }

  function topbar(title, showControls) {
    if (showControls === undefined) showControls = true;
    var settings = Store.getSettings();
    var controlsHTML = '';
    if (showControls === true) {
      var turmaOptions = Store.TURMAS.map(function(t) {
        return '<option value="' + t + '"' + (t === settings.turma ? ' selected' : '') + '>' + t.replace(/(\d)(\w)/, '$1\u00ba$2') + '</option>';
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
    return '<footer class="site-footer"><span>picpay.de.i &mdash; Prof. Aladdin &copy; ' + Store.ANO_LETIVO + '</span>' + syncIndicator + '</footer>';
  }

  return { sidebar: sidebar, topbar: topbar, footer: footer };
})();

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}
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
function toggleNavGroup(groupId) {
  var group = document.querySelector('[data-group="' + groupId + '"]');
  if (group) group.classList.toggle('open');
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

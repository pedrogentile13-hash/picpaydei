/* ============================
   picpay.de.i — Shared Components
   ============================ */

const Components = (() => {

  function sidebar(activePage) {
    var pages = [
      { id: 'home', label: 'Início', href: '../index.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/>' },
      { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>' },
      { id: 'alunos', label: 'Alunos', href: 'alunos.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>' },
      { id: 'negativos', label: 'Negativos', href: 'negativos.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>' },
      { id: 'pb', label: 'Prova Bimestral', href: 'pb.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>' },
      { id: 'va', label: 'VA', href: 'va.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>' },
      { id: 'boletim', label: 'Boletim', href: 'boletim.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>' },
      { id: 'relatorios', label: 'Relatórios', href: 'relatorios.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
    ];

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
          pages.map(function(p) {
            return '<a href="' + p.href + '" class="' + (p.id === activePage ? 'active' : '') + '">' +
              '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">' + p.icon + '</svg>' +
              p.label + '</a>';
          }).join('') +
        '</nav>' +
        '<div class="sidebar-footer">picpay.de.i &copy; ' + Store.ANO_LETIVO + ' &mdash; Prof. Aladdin</div>' +
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
    return '<footer class="site-footer">picpay.de.i &mdash; Prof. Aladdin &copy; ' + Store.ANO_LETIVO + '</footer>';
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

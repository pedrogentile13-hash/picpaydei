/* ============================
   picpay.de.i — Shared Components
   ============================ */

const Components = (() => {

  function sidebar(activePage) {
    const pages = [
      { id: 'home', label: 'Início', href: '../index.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/>' },
      { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>' },
      { id: 'alunos', label: 'Alunos', href: 'alunos.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>' },
      { id: 'negativos', label: 'Negativos', href: 'negativos.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>' },
      { id: 'boletim', label: 'Boletim', href: 'boletim.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>' },
      { id: 'relatorios', label: 'Relatórios', href: 'relatorios.html', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' },
    ];

    return `
      <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-logo">
          <div class="icon">P</div>
          <div class="text">
            <h1>picpay.de.i</h1>
            <p>Prof. Aladdin</p>
          </div>
        </div>
        <nav class="sidebar-nav">
          <span class="nav-section">Menu Principal</span>
          ${pages.map(p => `
            <a href="${p.href}" class="${p.id === activePage ? 'active' : ''}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">${p.icon}</svg>
              ${p.label}
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          picpay.de.i &copy; 2026 — Prof. Aladdin
        </div>
      </aside>
    `;
  }

  function topbar(title, showControls = true) {
    const settings = Store.getSettings();
    const controlsHTML = showControls ? `
      <div class="topbar-controls">
        <div class="topbar-select">
          <label>Turma</label>
          <select id="selectTurma" onchange="handleTurmaChange()">
            ${['8A','8B','8C','8D','9A','9B','9C','9D'].map(t =>
              `<option value="${t}" ${t === settings.turma ? 'selected' : ''}>${t.replace(/(\d)(\w)/, '$1º$2')}</option>`
            ).join('')}
          </select>
        </div>
        <div class="topbar-select">
          <label>Matéria</label>
          <select id="selectMateria" onchange="handleMateriaChange()"></select>
        </div>
      </div>
    ` : '';

    return `
      <header class="topbar">
        <div style="display:flex;align-items:center;gap:12px;">
          <button class="hamburger" onclick="toggleSidebar()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <h2 class="topbar-title">${title}</h2>
        </div>
        ${controlsHTML}
      </header>
    `;
  }

  function footer() {
    return `<footer class="site-footer">picpay.de.i &mdash; Prof. Aladdin &copy; 2026</footer>`;
  }

  return { sidebar, topbar, footer };
})();

// ============================
// Global helpers
// ============================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

function handleTurmaChange() {
  const turma = document.getElementById('selectTurma').value;
  const materias = Store.getMaterias(turma);
  const sel = document.getElementById('selectMateria');
  sel.innerHTML = materias.map(m => `<option value="${m}">${m}</option>`).join('');
  Store.saveSettings(turma, sel.value);
  if (typeof onContextChange === 'function') onContextChange();
}

function handleMateriaChange() {
  const turma = document.getElementById('selectTurma').value;
  const materia = document.getElementById('selectMateria').value;
  Store.saveSettings(turma, materia);
  if (typeof onContextChange === 'function') onContextChange();
}

function initSelects() {
  const settings = Store.getSettings();
  const turmaEl = document.getElementById('selectTurma');
  const materiaEl = document.getElementById('selectMateria');
  if (!turmaEl || !materiaEl) return;

  turmaEl.value = settings.turma;
  const materias = Store.getMaterias(settings.turma);
  materiaEl.innerHTML = materias.map(m => `<option value="${m}" ${m === settings.materia ? 'selected' : ''}>${m}</option>`).join('');
}

function getCurrentContext() {
  const turmaEl = document.getElementById('selectTurma');
  const materiaEl = document.getElementById('selectMateria');
  return {
    turma: turmaEl ? turmaEl.value : Store.getSettings().turma,
    materia: materiaEl ? materiaEl.value : Store.getSettings().materia,
  };
}

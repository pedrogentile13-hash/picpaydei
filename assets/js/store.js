/* ============================
   picpay.de.i — Data Store
   Shared across all pages via localStorage
   ============================ */

const Store = (() => {
  const STORAGE_KEY = 'picpay_dei_data';
  const SETTINGS_KEY = 'picpay_dei_settings';

  const materiasPor = {
    '8': ['Português', 'Produção'],
    '9': ['LEM'],
  };

  // Load from localStorage or init empty
  function _loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function _saveData(d) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  }

  function _loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : { turma: '8A', materia: 'Português' };
    } catch { return { turma: '8A', materia: 'Português' }; }
  }

  function _saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }

  // Public API
  return {
    materiasPor,

    getSettings() {
      return _loadSettings();
    },

    saveSettings(turma, materia) {
      _saveSettings({ turma, materia });
    },

    getSerie(turma) {
      return turma.charAt(0);
    },

    getMaterias(turma) {
      const serie = turma.charAt(0);
      return materiasPor[serie] || [];
    },

    getKey(turma, materia) {
      return `${turma}|${materia}`;
    },

    getStudents(turma, materia) {
      const data = _loadData();
      const key = `${turma}|${materia}`;
      if (!data[key]) data[key] = [];
      return data[key];
    },

    setStudents(turma, materia, students) {
      const data = _loadData();
      const key = `${turma}|${materia}`;
      data[key] = students;
      _saveData(data);
    },

    addStudent(turma, materia, numero, nome) {
      const students = this.getStudents(turma, materia);
      if (students.find(s => s.numero === numero)) return false;
      students.push({ numero, nome, negativos: 0, quali: 0, pb: 0, va: 0 });
      students.sort((a, b) => a.numero - b.numero);
      this.setStudents(turma, materia, students);
      return true;
    },

    removeStudent(turma, materia, numero) {
      let students = this.getStudents(turma, materia);
      students = students.filter(s => s.numero !== numero);
      this.setStudents(turma, materia, students);
    },

    updateNegativo(turma, materia, numero, delta) {
      const students = this.getStudents(turma, materia);
      const s = students.find(s => s.numero === numero);
      if (s) {
        s.negativos = Math.max(0, s.negativos + delta);
        this.setStudents(turma, materia, students);
      }
    },

    updateNota(turma, materia, numero, field, value) {
      const students = this.getStudents(turma, materia);
      const s = students.find(s => s.numero === numero);
      if (s) {
        const v = parseFloat(value);
        s[field] = isNaN(v) ? 0 : Math.max(0, v);
        this.setStudents(turma, materia, students);
      }
    },

    calcTotal(student) {
      const qualiAjustada = Math.max(0, student.quali - student.negativos * 0.1);
      return +(qualiAjustada + student.pb + student.va).toFixed(1);
    },

    importCSV(turma, materia, csvText) {
      const students = this.getStudents(turma, materia);
      const lines = csvText.split('\n').filter(l => l.trim());
      let count = 0;
      lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const numero = parseInt(parts[0].trim());
          const nome = parts[1].trim();
          const negativos = parts[2] ? parseInt(parts[2].trim()) || 0 : 0;
          if (numero && nome && !students.find(s => s.numero === numero)) {
            students.push({ numero, nome, negativos, quali: 0, pb: 0, va: 0 });
            count++;
          }
        }
      });
      students.sort((a, b) => a.numero - b.numero);
      this.setStudents(turma, materia, students);
      return count;
    },

    // Get stats for all turma/materia combinations
    getAllStats() {
      const data = _loadData();
      let totalAlunos = 0;
      let totalNegativos = 0;
      const turmas = {};

      Object.keys(data).forEach(key => {
        const [turma] = key.split('|');
        const students = data[key];
        if (!turmas[turma]) turmas[turma] = { alunos: new Set(), negativos: 0 };
        students.forEach(s => {
          turmas[turma].alunos.add(s.numero + '_' + s.nome);
          turmas[turma].negativos += s.negativos;
          totalNegativos += s.negativos;
        });
      });

      Object.values(turmas).forEach(t => { totalAlunos += t.alunos.size; });

      return { totalAlunos, totalNegativos, turmasCount: Object.keys(turmas).length };
    },

    exportData() {
      return _loadData();
    },

    clearAll() {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
})();

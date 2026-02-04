/* ============================
   picpay.de.i — Data Store
   Shared across all pages via localStorage
   Ano Letivo 2026
   ============================ */

const Store = (() => {
  const STORAGE_KEY = 'picpay_dei_data';
  const SETTINGS_KEY = 'picpay_dei_settings';
  const ANO_LETIVO = 2026;

  const BIMESTRES = ['1', '2', '3', '4'];
  const BIMESTRE_LABELS = { '1': '1º Bimestre', '2': '2º Bimestre', '3': '3º Bimestre', '4': '4º Bimestre' };

  const PESOS = { pb: 35, quali: 30, va: 35 };

  const materiasPor = {
    '8': ['Português', 'Produção'],
    '9': ['LEM'],
  };

  const TURMAS = ['8A', '8B', '8C', '8D', '9A', '9B', '9C', '9D'];

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
      return raw ? JSON.parse(raw) : { turma: '8A', materia: 'Português', bimestre: '1' };
    } catch { return { turma: '8A', materia: 'Português', bimestre: '1' }; }
  }

  function _saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }

  return {
    ANO_LETIVO,
    BIMESTRES,
    BIMESTRE_LABELS,
    PESOS,
    materiasPor,
    TURMAS,

    getSettings() {
      return _loadSettings();
    },

    saveSettings(turma, materia, bimestre) {
      _saveSettings({ turma, materia, bimestre });
    },

    getSerie(turma) {
      return turma.charAt(0);
    },

    getMaterias(turma) {
      const serie = turma.charAt(0);
      return materiasPor[serie] || [];
    },

    getKey(turma, materia, bimestre) {
      return turma + '|' + materia + '|' + bimestre;
    },

    getStudents(turma, materia, bimestre) {
      const data = _loadData();
      const key = turma + '|' + materia + '|' + bimestre;
      if (!data[key]) data[key] = [];
      return data[key];
    },

    setStudents(turma, materia, bimestre, students) {
      const data = _loadData();
      const key = turma + '|' + materia + '|' + bimestre;
      data[key] = students;
      _saveData(data);
    },

    addStudent(turma, materia, bimestre, numero, nome) {
      const students = this.getStudents(turma, materia, bimestre);
      if (students.find(function(s) { return s.numero === numero; })) return false;
      students.push({ numero: numero, nome: nome, negativos: 0, quali: 0, pb: 0, va: 0 });
      students.sort(function(a, b) { return a.numero - b.numero; });
      this.setStudents(turma, materia, bimestre, students);
      return true;
    },

    removeStudent(turma, materia, bimestre, numero) {
      var students = this.getStudents(turma, materia, bimestre);
      students = students.filter(function(s) { return s.numero !== numero; });
      this.setStudents(turma, materia, bimestre, students);
    },

    updateNegativo(turma, materia, bimestre, numero, delta) {
      var students = this.getStudents(turma, materia, bimestre);
      var s = students.find(function(st) { return st.numero === numero; });
      if (s) {
        s.negativos = Math.max(0, s.negativos + delta);
        this.setStudents(turma, materia, bimestre, students);
      }
    },

    updateNota(turma, materia, bimestre, numero, field, value) {
      var students = this.getStudents(turma, materia, bimestre);
      var s = students.find(function(st) { return st.numero === numero; });
      if (s) {
        var v = parseFloat(value);
        s[field] = isNaN(v) ? 0 : Math.min(10, Math.max(0, v));
        this.setStudents(turma, materia, bimestre, students);
      }
    },

    // Weighted average: M = (PB × 35 + QualiAjustada × 30 + VA × 35) / 100
    calcMedia(student) {
      var qualiAjustada = Math.max(0, student.quali - student.negativos * 0.1);
      var media = (student.pb * PESOS.pb + qualiAjustada * PESOS.quali + student.va * PESOS.va) / (PESOS.pb + PESOS.quali + PESOS.va);
      return +media.toFixed(1);
    },

    getQualiAjustada(student) {
      return +Math.max(0, student.quali - student.negativos * 0.1).toFixed(2);
    },

    importCSV(turma, materia, bimestre, csvText) {
      var students = this.getStudents(turma, materia, bimestre);
      var lines = csvText.split('\n').filter(function(l) { return l.trim(); });
      var count = 0;
      lines.forEach(function(line) {
        var parts = line.split(',');
        if (parts.length >= 2) {
          var numero = parseInt(parts[0].trim());
          var nome = parts[1].trim();
          var negativos = parts[2] ? parseInt(parts[2].trim()) || 0 : 0;
          if (numero && nome && !students.find(function(s) { return s.numero === numero; })) {
            students.push({ numero: numero, nome: nome, negativos: negativos, quali: 0, pb: 0, va: 0 });
            count++;
          }
        }
      });
      students.sort(function(a, b) { return a.numero - b.numero; });
      this.setStudents(turma, materia, bimestre, students);
      return count;
    },

    // Copy students from one bimester to another (keeping names/numbers, resetting grades)
    copyStudentsToBimestre(turma, materia, fromBim, toBim) {
      var from = this.getStudents(turma, materia, fromBim);
      var to = this.getStudents(turma, materia, toBim);
      var count = 0;
      var self = this;
      from.forEach(function(s) {
        if (!to.find(function(t) { return t.numero === s.numero; })) {
          to.push({ numero: s.numero, nome: s.nome, negativos: 0, quali: 0, pb: 0, va: 0 });
          count++;
        }
      });
      to.sort(function(a, b) { return a.numero - b.numero; });
      self.setStudents(turma, materia, toBim, to);
      return count;
    },

    // =========== AGGREGATION FOR DASHBOARD ===========

    // Get all students matching a filter
    // filter: { mode: 'geral' | 'sala' | 'ano' | 'materia', value: string, bimestre: string }
    getFilteredStudents(filter) {
      var data = _loadData();
      var results = [];
      var self = this;

      Object.keys(data).forEach(function(key) {
        var parts = key.split('|');
        var turma = parts[0];
        var materia = parts[1];
        var bimestre = parts[2];

        // Bimestre filter always applies
        if (filter.bimestre && bimestre !== filter.bimestre) return;

        var match = false;
        switch (filter.mode) {
          case 'geral':
            match = true;
            break;
          case 'sala':
            match = (turma === filter.value);
            break;
          case 'ano':
            match = (turma.charAt(0) === filter.value);
            break;
          case 'materia':
            match = (materia === filter.value);
            break;
        }

        if (match) {
          data[key].forEach(function(s) {
            results.push({
              turma: turma,
              materia: materia,
              bimestre: bimestre,
              numero: s.numero,
              nome: s.nome,
              negativos: s.negativos,
              quali: s.quali,
              pb: s.pb,
              va: s.va,
              media: self.calcMedia(s)
            });
          });
        }
      });

      return results;
    },

    // Get aggregated stats
    getFilteredStats(filter) {
      var students = this.getFilteredStudents(filter);
      var totalAlunos = students.length;
      var totalNegs = 0;
      var totalMedia = 0;
      var abaixo = 0;
      var aprovados = 0;

      students.forEach(function(s) {
        totalNegs += s.negativos;
        totalMedia += s.media;
        if (s.media < 6) abaixo++;
        else aprovados++;
      });

      var media = totalAlunos > 0 ? (totalMedia / totalAlunos) : 0;

      return {
        totalAlunos: totalAlunos,
        totalNegativos: totalNegs,
        media: +media.toFixed(1),
        abaixo: abaixo,
        aprovados: aprovados
      };
    },

    getAllStats() {
      var data = _loadData();
      var totalAlunos = 0;
      var totalNegativos = 0;
      var turmasSet = {};

      Object.keys(data).forEach(function(key) {
        var parts = key.split('|');
        var turma = parts[0];
        var students = data[key];
        turmasSet[turma] = true;
        students.forEach(function(s) {
          totalAlunos++;
          totalNegativos += s.negativos;
        });
      });

      return { totalAlunos: totalAlunos, totalNegativos: totalNegativos, turmasCount: Object.keys(turmasSet).length };
    },

    // Get all unique materias that have data
    getAllMateriasWithData() {
      var data = _loadData();
      var materias = {};
      Object.keys(data).forEach(function(key) {
        var parts = key.split('|');
        if (data[key].length > 0) materias[parts[1]] = true;
      });
      return Object.keys(materias);
    },

    exportData() {
      return _loadData();
    },

    clearAll() {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
})();

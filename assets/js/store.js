/* ============================
   picpay.de.i — Data Store
   Shared across all pages via localStorage
   Ano Letivo 2026
   ============================ */

const Store = (() => {
  const STORAGE_KEY = 'picpay_dei_data';
  const SETTINGS_KEY = 'picpay_dei_settings';
  const VA_KEY = 'picpay_dei_vas';
  const PB_KEY = 'picpay_dei_pbs';
  const ANO_LETIVO = 2026;

  const BIMESTRES = ['1', '2', '3', '4'];
  const BIMESTRE_LABELS = { '1': '1º Bimestre', '2': '2º Bimestre', '3': '3º Bimestre', '4': '4º Bimestre' };

  // Pesos for weighted average
  const PESOS = { pb: 35, quali: 30, va: 35 };

  const materiasPor = {
    '6': ['LEM', 'Produção de Texto'],
    '8': ['Português', 'Produção de Texto'],
    '9': ['LEM'],
  };

  // 8D removed
  const TURMAS = ['6A', '6B', '6C', '6D', '8A', '8B', '8C', '9A', '9B', '9C', '9D'];

  const VA_TIPOS = ['Trabalho', 'Escrita', 'Caderno', 'Apresentação', 'Participação', 'Prova', 'Outro'];

  // Matérias that have Prova Bimestral
  const MATERIAS_COM_PB = ['Português', 'Produção de Texto'];

  // PB weights: Anglo peso 1, Prova Bimestral peso 5
  const PB_PESOS = { anglo: 1, prova: 5 };

  function _load(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
  }

  function _save(key, d) {
    localStorage.setItem(key, JSON.stringify(d));
  }

  function _loadSettings() {
    try {
      var raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : { turma: '6A', materia: 'LEM', bimestre: '1' };
    } catch(e) { return { turma: '6A', materia: 'LEM', bimestre: '1' }; }
  }

  function _makeKey(turma, materia, bimestre) {
    return turma + '|' + materia + '|' + bimestre;
  }

  return {
    ANO_LETIVO: ANO_LETIVO,
    BIMESTRES: BIMESTRES,
    BIMESTRE_LABELS: BIMESTRE_LABELS,
    PESOS: PESOS,
    PB_PESOS: PB_PESOS,
    materiasPor: materiasPor,
    TURMAS: TURMAS,
    VA_TIPOS: VA_TIPOS,
    MATERIAS_COM_PB: MATERIAS_COM_PB,

    hasPB: function(materia) {
      return MATERIAS_COM_PB.indexOf(materia) !== -1;
    },

    getSettings: function() {
      return _loadSettings();
    },

    saveSettings: function(turma, materia, bimestre) {
      _save(SETTINGS_KEY, { turma: turma, materia: materia, bimestre: bimestre });
    },

    getSerie: function(turma) { return turma.charAt(0); },

    getMaterias: function(turma) {
      var serie = turma.charAt(0);
      return materiasPor[serie] || [];
    },

    // =========== STUDENTS ===========

    getStudents: function(turma, materia, bimestre) {
      var data = _load(STORAGE_KEY);
      var key = _makeKey(turma, materia, bimestre);
      if (!data[key]) data[key] = [];
      return data[key];
    },

    setStudents: function(turma, materia, bimestre, students) {
      var data = _load(STORAGE_KEY);
      data[_makeKey(turma, materia, bimestre)] = students;
      _save(STORAGE_KEY, data);
    },

    addStudent: function(turma, materia, bimestre, numero, nome) {
      var students = this.getStudents(turma, materia, bimestre);
      if (students.find(function(s) { return s.numero === numero; })) return false;
      students.push({ numero: numero, nome: nome, negativos: 0, quali: 0, pb: 0, va: 0 });
      students.sort(function(a, b) { return a.numero - b.numero; });
      this.setStudents(turma, materia, bimestre, students);
      return true;
    },

    removeStudent: function(turma, materia, bimestre, numero) {
      var students = this.getStudents(turma, materia, bimestre);
      students = students.filter(function(s) { return s.numero !== numero; });
      this.setStudents(turma, materia, bimestre, students);
    },

    updateNegativo: function(turma, materia, bimestre, numero, delta) {
      var students = this.getStudents(turma, materia, bimestre);
      var s = students.find(function(st) { return st.numero === numero; });
      if (s) {
        s.negativos = Math.max(0, s.negativos + delta);
        this.setStudents(turma, materia, bimestre, students);
      }
    },

    updateNota: function(turma, materia, bimestre, numero, field, value) {
      var students = this.getStudents(turma, materia, bimestre);
      var s = students.find(function(st) { return st.numero === numero; });
      if (s) {
        var v = parseFloat(value);
        s[field] = isNaN(v) ? 0 : Math.min(10, Math.max(0, v));
        this.setStudents(turma, materia, bimestre, students);
      }
    },

    // =========== VA SYSTEM ===========

    getVAs: function(turma, materia, bimestre) {
      var data = _load(VA_KEY);
      var key = _makeKey(turma, materia, bimestre);
      if (!data[key]) data[key] = [];
      return data[key];
    },

    setVAs: function(turma, materia, bimestre, vas) {
      var data = _load(VA_KEY);
      data[_makeKey(turma, materia, bimestre)] = vas;
      _save(VA_KEY, data);
    },

    addVA: function(turma, materia, bimestre, nome, tipo, valorMax) {
      var vas = this.getVAs(turma, materia, bimestre);
      var id = vas.length > 0 ? Math.max.apply(null, vas.map(function(v) { return v.id; })) + 1 : 1;
      vas.push({ id: id, nome: nome, tipo: tipo, valorMax: valorMax, notas: {} });
      this.setVAs(turma, materia, bimestre, vas);
      return id;
    },

    removeVA: function(turma, materia, bimestre, vaId) {
      var vas = this.getVAs(turma, materia, bimestre);
      vas = vas.filter(function(v) { return v.id !== vaId; });
      this.setVAs(turma, materia, bimestre, vas);
    },

    setVANota: function(turma, materia, bimestre, vaId, alunoNumero, nota) {
      var vas = this.getVAs(turma, materia, bimestre);
      var va = vas.find(function(v) { return v.id === vaId; });
      if (va) {
        var v = parseFloat(nota);
        va.notas[alunoNumero] = isNaN(v) ? 0 : Math.min(va.valorMax, Math.max(0, v));
        this.setVAs(turma, materia, bimestre, vas);
      }
    },

    getVANormalizada: function(va, alunoNumero) {
      var bruta = va.notas[alunoNumero] || 0;
      if (va.valorMax === 0) return 0;
      return +((bruta / va.valorMax) * 10).toFixed(2);
    },

    getVAMedia: function(turma, materia, bimestre, alunoNumero) {
      var vas = this.getVAs(turma, materia, bimestre);
      if (vas.length === 0) return 0;
      var self = this;
      var total = 0;
      vas.forEach(function(va) { total += self.getVANormalizada(va, alunoNumero); });
      return +(total / vas.length).toFixed(2);
    },

    importVACSV: function(turma, materia, bimestre, vaId, csvText) {
      var vas = this.getVAs(turma, materia, bimestre);
      var va = vas.find(function(v) { return v.id === vaId; });
      if (!va) return 0;
      var lines = csvText.split('\n').filter(function(l) { return l.trim(); });
      var count = 0;
      lines.forEach(function(line) {
        var parts = line.split(',');
        if (parts.length >= 2) {
          var numero = parseInt(parts[0].trim());
          var nota = parseFloat(parts[1].trim());
          if (numero && !isNaN(nota)) {
            va.notas[numero] = Math.min(va.valorMax, Math.max(0, nota));
            count++;
          }
        }
      });
      this.setVAs(turma, materia, bimestre, vas);
      return count;
    },

    // =========== PB SYSTEM ===========
    // PB data: { anglo: { valorMax, notas: {numero: nota} }, prova: { valorMax, notas: {numero: nota} } }

    getPB: function(turma, materia, bimestre) {
      var data = _load(PB_KEY);
      var key = _makeKey(turma, materia, bimestre);
      if (!data[key]) data[key] = {
        anglo: { valorMax: 10, notas: {} },
        prova: { valorMax: 10, notas: {} }
      };
      return data[key];
    },

    setPB: function(turma, materia, bimestre, pbData) {
      var data = _load(PB_KEY);
      data[_makeKey(turma, materia, bimestre)] = pbData;
      _save(PB_KEY, data);
    },

    setPBValorMax: function(turma, materia, bimestre, tipo, valorMax) {
      var pb = this.getPB(turma, materia, bimestre);
      pb[tipo].valorMax = valorMax;
      this.setPB(turma, materia, bimestre, pb);
    },

    setPBNota: function(turma, materia, bimestre, tipo, alunoNumero, nota) {
      var pb = this.getPB(turma, materia, bimestre);
      var v = parseFloat(nota);
      pb[tipo].notas[alunoNumero] = isNaN(v) ? 0 : Math.min(pb[tipo].valorMax, Math.max(0, v));
      this.setPB(turma, materia, bimestre, pb);
    },

    getPBNormalizada: function(pbTipo, alunoNumero) {
      var bruta = pbTipo.notas[alunoNumero] || 0;
      if (pbTipo.valorMax === 0) return 0;
      return +((bruta / pbTipo.valorMax) * 10).toFixed(2);
    },

    // PB_final = (Anglo_norm × 1 + Prova_norm × 5) / 6
    getPBMedia: function(turma, materia, bimestre, alunoNumero) {
      if (!this.hasPB(materia)) return 0;
      var pb = this.getPB(turma, materia, bimestre);
      var angloNorm = this.getPBNormalizada(pb.anglo, alunoNumero);
      var provaNorm = this.getPBNormalizada(pb.prova, alunoNumero);
      return +((angloNorm * PB_PESOS.anglo + provaNorm * PB_PESOS.prova) / (PB_PESOS.anglo + PB_PESOS.prova)).toFixed(2);
    },

    importPBCSV: function(turma, materia, bimestre, tipo, csvText) {
      var pb = this.getPB(turma, materia, bimestre);
      var lines = csvText.split('\n').filter(function(l) { return l.trim(); });
      var count = 0;
      lines.forEach(function(line) {
        var parts = line.split(',');
        if (parts.length >= 2) {
          var numero = parseInt(parts[0].trim());
          var nota = parseFloat(parts[1].trim());
          if (numero && !isNaN(nota)) {
            pb[tipo].notas[numero] = Math.min(pb[tipo].valorMax, Math.max(0, nota));
            count++;
          }
        }
      });
      this.setPB(turma, materia, bimestre, pb);
      return count;
    },

    // =========== GRADE CALCULATIONS ===========

    getQualiAjustada: function(student) {
      return +Math.max(0, student.quali - student.negativos * 0.1).toFixed(2);
    },

    // Full media calculation
    // For matérias with PB: M = (PB×35 + Quali×30 + VA×35) / 100
    // For LEM (no PB):       M = (Quali×30 + VA×35) / 65
    calcMediaFull: function(turma, materia, bimestre, student) {
      var qualiAjustada = Math.max(0, student.quali - student.negativos * 0.1);
      var vaMedia = this.getVAMedia(turma, materia, bimestre, student.numero);

      if (this.hasPB(materia)) {
        var pbMedia = this.getPBMedia(turma, materia, bimestre, student.numero);
        return +((pbMedia * PESOS.pb + qualiAjustada * PESOS.quali + vaMedia * PESOS.va) / (PESOS.pb + PESOS.quali + PESOS.va)).toFixed(1);
      } else {
        // LEM: no PB
        return +((qualiAjustada * PESOS.quali + vaMedia * PESOS.va) / (PESOS.quali + PESOS.va)).toFixed(1);
      }
    },

    // Simplified calc for backward compat (uses stored va field, no PB system)
    calcMedia: function(student, vaMedia) {
      var qualiAjustada = Math.max(0, student.quali - student.negativos * 0.1);
      var vaScore = (vaMedia !== undefined) ? vaMedia : student.va;
      return +((student.pb * PESOS.pb + qualiAjustada * PESOS.quali + vaScore * PESOS.va) / (PESOS.pb + PESOS.quali + PESOS.va)).toFixed(1);
    },

    importCSV: function(turma, materia, bimestre, csvText) {
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

    copyStudentsToBimestre: function(turma, materia, fromBim, toBim) {
      var from = this.getStudents(turma, materia, fromBim);
      var to = this.getStudents(turma, materia, toBim);
      var count = 0;
      from.forEach(function(s) {
        if (!to.find(function(t) { return t.numero === s.numero; })) {
          to.push({ numero: s.numero, nome: s.nome, negativos: 0, quali: 0, pb: 0, va: 0 });
          count++;
        }
      });
      to.sort(function(a, b) { return a.numero - b.numero; });
      this.setStudents(turma, materia, toBim, to);
      return count;
    },

    // =========== AGGREGATION ===========

    getFilteredStudents: function(filter) {
      var data = _load(STORAGE_KEY);
      var results = [];
      var self = this;

      Object.keys(data).forEach(function(key) {
        var parts = key.split('|');
        var turma = parts[0]; var materia = parts[1]; var bimestre = parts[2];
        if (filter.bimestre && bimestre !== filter.bimestre) return;
        var match = false;
        switch (filter.mode) {
          case 'geral': match = true; break;
          case 'sala': match = (turma === filter.value); break;
          case 'ano': match = (turma.charAt(0) === filter.value); break;
          case 'materia': match = (materia === filter.value); break;
        }
        if (match) {
          data[key].forEach(function(s) {
            var media = self.calcMediaFull(turma, materia, bimestre, s);
            results.push({
              turma: turma, materia: materia, bimestre: bimestre,
              numero: s.numero, nome: s.nome, negativos: s.negativos,
              quali: s.quali, pb: s.pb, va: self.getVAMedia(turma, materia, bimestre, s.numero),
              media: media
            });
          });
        }
      });
      return results;
    },

    getFilteredStats: function(filter) {
      var students = this.getFilteredStudents(filter);
      var totalAlunos = students.length;
      var totalNegs = 0; var totalMedia = 0; var abaixo = 0; var aprovados = 0;
      var melhorNota = 0; var melhorAluno = null; var topNotas = [];

      students.forEach(function(s) {
        totalNegs += s.negativos;
        totalMedia += s.media;
        if (s.media < 6) abaixo++; else aprovados++;
        topNotas.push({ nome: s.nome, turma: s.turma, materia: s.materia, media: s.media, negativos: s.negativos });
        if (s.media > melhorNota) { melhorNota = s.media; melhorAluno = s; }
      });

      var media = totalAlunos > 0 ? (totalMedia / totalAlunos) : 0;
      topNotas.sort(function(a, b) { return b.media - a.media; });
      var topMelhores = topNotas.slice(0, 5);
      var topMenosNegativos = topNotas.slice().sort(function(a, b) { return a.negativos - b.negativos; }).slice(0, 5);

      return {
        totalAlunos: totalAlunos, totalNegativos: totalNegs, media: +media.toFixed(1),
        abaixo: abaixo, aprovados: aprovados, melhorNota: melhorNota, melhorAluno: melhorAluno,
        topMelhores: topMelhores, topMenosNegativos: topMenosNegativos
      };
    },

    getAllStats: function() {
      var data = _load(STORAGE_KEY);
      var totalAlunos = 0; var totalNegativos = 0; var turmasSet = {};
      Object.keys(data).forEach(function(key) {
        turmasSet[key.split('|')[0]] = true;
        data[key].forEach(function(s) { totalAlunos++; totalNegativos += s.negativos; });
      });
      return { totalAlunos: totalAlunos, totalNegativos: totalNegativos, turmasCount: Object.keys(turmasSet).length };
    },

    getAllMaterias: function() {
      var all = {};
      Object.keys(materiasPor).forEach(function(serie) {
        materiasPor[serie].forEach(function(m) { all[m] = true; });
      });
      return Object.keys(all);
    },

    exportData: function() {
      return { students: _load(STORAGE_KEY), vas: _load(VA_KEY), pbs: _load(PB_KEY) };
    },

    clearAll: function() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VA_KEY);
      localStorage.removeItem(PB_KEY);
    }
  };
})();

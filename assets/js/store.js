/* ============================
   Lidara — Data Store
   Shared across all pages via localStorage + Firebase
   ============================ */

const Store = (() => {
  const STORAGE_KEY = 'picpay_dei_data';
  const SETTINGS_KEY = 'picpay_dei_settings';
  const VA_KEY = 'picpay_dei_vas';
  const PB_KEY = 'picpay_dei_pbs';
  const PROFILE_KEY = 'picpay_dei_profile';
  const CONFIG_KEY = 'picpay_dei_config';
  const PROFESSOR_KEY = 'picpay_dei_professor';

  // Load dynamic ANO_LETIVO from config (default 2026)
  function _loadConfig() {
    try {
      var raw = localStorage.getItem(CONFIG_KEY);
      return raw ? JSON.parse(raw) : { anoLetivo: 2026 };
    } catch(e) { return { anoLetivo: 2026 }; }
  }

  var ANO_LETIVO = _loadConfig().anoLetivo;

  const BIMESTRES = ['1', '2', '3', '4'];
  const BIMESTRE_LABELS = { '1': '1º Bimestre', '2': '2º Bimestre', '3': '3º Bimestre', '4': '4º Bimestre' };

  // Pesos for weighted average
  const PESOS = { pb: 35, quali: 30, va: 35 };

  // Flexible school segments and years
  const SEGMENTS = {
    'FI': { label: 'Fundamental I', anos: ['2', '3', '4', '5'] },
    'FII': { label: 'Fundamental II', anos: ['6', '7', '8', '9'] },
    'EM': { label: 'Ensino Médio', anos: ['1', '2', '3'] }
  };

  // All available class letters
  const CLASSES = ['A', 'B', 'C', 'D', 'E'];

  // Legacy: kept for compatibility
  const ANOS_DISPONIVEIS = ['6', '7', '8', '9'];
  const TURMAS_DISPONIVEIS = ['A', 'B', 'C', 'D', 'E'];

  // All subjects in the system (universal, school-agnostic)
  const TODAS_MATERIAS = [
    'Língua Portuguesa',
    'Matemática',
    'História',
    'Geografia',
    'Ciências',
    'Educação Física',
    'Artes',
    'Inglês',
    'Biologia',
    'Química',
    'Física',
    'Filosofia',
    'Sociologia',
    'Redação',
    'Literatura'
  ];

  // Subjects that have Prova Bimestral by default (configurable per school)
  const MATERIAS_COM_PB = [
    'Língua Portuguesa',
    'Matemática',
    'História',
    'Geografia',
    'Biologia',
    'Química',
    'Física',
    'Inglês'
  ];

  const VA_TIPOS = ['Trabalho', 'Escrita', 'Caderno', 'Apresentacao', 'Participacao', 'Prova', 'Outro'];

  // PB weights: Anglo peso 1, Prova Bimestral peso 5
  const PB_PESOS = { anglo: 1, prova: 5 };

  // =========== PROFESSOR CONFIG ===========

  function _loadProfessor() {
    try {
      var raw = localStorage.getItem(PROFESSOR_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }

  function _saveProfessor(data) {
    localStorage.setItem(PROFESSOR_KEY, JSON.stringify(data));
  }

  // Get configured turmas based on professor's selections
  function _getTurmasConfiguradas() {
    var prof = _loadProfessor();
    if (!prof || !prof.anos || !prof.turmas) {
      return ['6A', '6B', '6C', '6D', '7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D', '9A', '9B', '9C', '9D'];
    }
    var turmas = [];
    prof.anos.forEach(function(ano) {
      prof.turmas.forEach(function(letra) {
        turmas.push(ano + letra);
      });
    });
    return turmas.sort();
  }

  // Get configured materias for a specific year
  function _getMateriasConfiguradas(ano) {
    var prof = _loadProfessor();
    if (!prof || !prof.materias) {
      return TODAS_MATERIAS;
    }
    var materias = [];
    prof.materias.forEach(function(m) {
      if (m.anos && m.anos.indexOf(ano) !== -1) {
        materias.push(m.nome);
      }
    });
    return materias.length > 0 ? materias : TODAS_MATERIAS;
  }

  // =========== LOCAL STORAGE ===========

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
      if (raw) return JSON.parse(raw);
      // Dynamic default based on professor config
      var turmas = _getTurmasConfiguradas();
      var firstTurma = turmas[0] || '6A';
      var ano = firstTurma.charAt(0);
      var materias = _getMateriasConfiguradas(ano);
      return { turma: firstTurma, materia: materias[0] || 'Lingua Portuguesa', bimestre: '1' };
    } catch(e) { return { turma: '6A', materia: 'Lingua Portuguesa', bimestre: '1' }; }
  }

  function _makeKey(turma, materia, bimestre) {
    return turma + '|' + materia + '|' + bimestre;
  }

  // =========== FIREBASE SYNC ===========

  var _syncEnabled = typeof firebase !== 'undefined' && typeof db !== 'undefined';
  var _syncStatus = 'idle'; // idle, syncing, error, success
  var _onSyncCallbacks = [];
  var _currentUserId = null;

  // Get current user ID (must be authenticated)
  function _getUserId() {
    if (_currentUserId) return _currentUserId;
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
      _currentUserId = firebase.auth().currentUser.uid;
      return _currentUserId;
    }
    return null;
  }

  // Update user ID when auth state changes
  if (typeof firebase !== 'undefined') {
    firebase.auth().onAuthStateChanged(function(user) {
      _currentUserId = user ? user.uid : null;
    });
  }

  function _notifySync(status, msg) {
    _syncStatus = status;
    _onSyncCallbacks.forEach(function(cb) { cb(status, msg); });
  }

  // Secure save - data goes to users/{userId}/collection/docId
  function _firestoreSave(collection, docId, data) {
    if (!_syncEnabled) return Promise.resolve();
    var userId = _getUserId();
    if (!userId) {
      console.warn('Firestore save blocked: user not authenticated');
      return Promise.resolve();
    }
    _notifySync('syncing', 'Salvando...');
    return db.collection('users').doc(userId).collection(collection).doc(docId).set(data)
      .then(function() { _notifySync('success', 'Salvo na nuvem'); })
      .catch(function(err) {
        console.error('Firestore save error:', err);
        _notifySync('error', 'Erro ao salvar');
      });
  }

  // Secure load - data comes from users/{userId}/collection/docId
  function _firestoreLoad(collection, docId) {
    if (!_syncEnabled) return Promise.resolve(null);
    var userId = _getUserId();
    if (!userId) return Promise.resolve(null);
    return db.collection('users').doc(userId).collection(collection).doc(docId).get()
      .then(function(doc) { return doc.exists ? doc.data() : null; })
      .catch(function(err) {
        console.error('Firestore load error:', err);
        return null;
      });
  }

  // Secure load all - from users/{userId}/collection
  function _firestoreLoadAll(collection) {
    if (!_syncEnabled) return Promise.resolve({});
    var userId = _getUserId();
    if (!userId) return Promise.resolve({});
    return db.collection('users').doc(userId).collection(collection).get()
      .then(function(snapshot) {
        var result = {};
        snapshot.forEach(function(doc) {
          result[doc.id] = doc.data();
        });
        return result;
      })
      .catch(function(err) {
        console.error('Firestore loadAll error:', err);
        return {};
      });
  }

  // Audit log - records all grade changes (immutable)
  function _logAudit(action, details) {
    if (!_syncEnabled) return;
    var userId = _getUserId();
    if (!userId) return;
    var logEntry = {
      action: action,
      details: details,
      timestamp: new Date().toISOString(),
      userEmail: firebase.auth().currentUser ? firebase.auth().currentUser.email : 'unknown'
    };
    var logId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    db.collection('users').doc(userId).collection('audit').doc(logId).set(logEntry)
      .catch(function(err) { console.error('Audit log error:', err); });
  }

  // =========== SYNC FUNCTIONS ===========

  function syncStudentsToCloud(turma, materia, bimestre, students) {
    var docId = _makeKey(turma, materia, bimestre).replace(/\|/g, '_');
    _firestoreSave('students', docId, { students: students, updatedAt: new Date().toISOString() });
  }

  function syncVAsToCloud(turma, materia, bimestre, vas) {
    var docId = _makeKey(turma, materia, bimestre).replace(/\|/g, '_');
    _firestoreSave('vas', docId, { vas: vas, updatedAt: new Date().toISOString() });
  }

  function syncPBsToCloud(turma, materia, bimestre, pbData) {
    var docId = _makeKey(turma, materia, bimestre).replace(/\|/g, '_');
    _firestoreSave('pbs', docId, { pb: pbData, updatedAt: new Date().toISOString() });
  }

  // =========== PUBLIC API ===========

  return {
    ANO_LETIVO: ANO_LETIVO,
    BIMESTRES: BIMESTRES,
    BIMESTRE_LABELS: BIMESTRE_LABELS,
    PESOS: PESOS,
    PB_PESOS: PB_PESOS,
    VA_TIPOS: VA_TIPOS,
    MATERIAS_COM_PB: MATERIAS_COM_PB,
    TODAS_MATERIAS: TODAS_MATERIAS,
    ANOS_DISPONIVEIS: ANOS_DISPONIVEIS,
    TURMAS_DISPONIVEIS: TURMAS_DISPONIVEIS,
    SEGMENTS: SEGMENTS,
    CLASSES: CLASSES,

    // Dynamic getters
    get TURMAS() { return _getTurmasConfiguradas(); },

    hasPB: function(materia) {
      return MATERIAS_COM_PB.indexOf(materia) !== -1;
    },

    // Format turma code to display (e.g., "2F1A" -> "2º Ano A")
    formatTurma: function(codigo) {
      if (!codigo) return codigo;
      // Handle old format: "6A" -> "6º Ano A"
      if (codigo.length === 2 && !isNaN(codigo[0])) {
        var year = codigo[0];
        var classe = codigo[1];
        var segment = year >= 6 ? 'Fundamental II' : 'Fundamental I';
        return year + 'º Ano ' + classe;
      }
      // Handle new format with segment prefix
      if (codigo.includes('F')) {
        var parts = codigo.match(/(\d)F([12])(\w)/);
        if (parts) {
          var year = parts[1];
          var subseg = parts[2];
          var classe = parts[3];
          var label = subseg === '1' ? 'Fundamental I' : 'Fundamental II';
          return year + 'º Ano ' + classe;
        }
      }
      if (codigo.includes('EM')) {
        var parts = codigo.match(/(\d)EM(\w)/);
        if (parts) {
          var year = parts[1];
          var classe = parts[2];
          return year + 'º EM ' + classe;
        }
      }
      return codigo;
    },

    // Parse turma selection to code
    parseTurma: function(segment, year, classe) {
      if (segment === 'FI' || segment === 'FII') {
        return year + 'F' + (segment === 'FI' ? '1' : '2') + classe;
      }
      if (segment === 'EM') {
        return year + 'EM' + classe;
      }
      return null;
    },

    // =========== PROFESSOR CONFIG ===========

    isProfessorConfigured: function() {
      var prof = _loadProfessor();
      return prof && prof.anos && prof.anos.length > 0 && prof.materias && prof.materias.length > 0;
    },

    getProfessor: function() {
      return _loadProfessor() || { nome: '', anos: [], turmas: [], materias: [] };
    },

    setProfessor: function(data) {
      _saveProfessor(data);
      if (_syncEnabled) {
        _firestoreSave('config', 'professor', data);
      }
    },

    getSettings: function() {
      return _loadSettings();
    },

    saveSettings: function(turma, materia, bimestre) {
      _save(SETTINGS_KEY, { turma: turma, materia: materia, bimestre: bimestre });
    },

    getSerie: function(turma) { return turma.charAt(0); },

    getMaterias: function(turma) {
      var ano = turma.charAt(0);
      return _getMateriasConfiguradas(ano);
    },

    // =========== SYNC STATUS ===========

    onSyncStatus: function(callback) {
      _onSyncCallbacks.push(callback);
    },

    getSyncStatus: function() {
      return _syncStatus;
    },

    isSyncEnabled: function() {
      return _syncEnabled;
    },

    // =========== CLOUD SYNC ===========

    loadFromCloud: function(callback) {
      if (!_syncEnabled) {
        if (callback) callback(false);
        return;
      }
      _notifySync('syncing', 'Carregando da nuvem...');

      Promise.all([
        _firestoreLoadAll('students'),
        _firestoreLoadAll('vas'),
        _firestoreLoadAll('pbs')
      ]).then(function(results) {
        var studentsCloud = results[0];
        var vasCloud = results[1];
        var pbsCloud = results[2];

        // Merge cloud data into localStorage
        var localStudents = _load(STORAGE_KEY);
        var localVas = _load(VA_KEY);
        var localPbs = _load(PB_KEY);

        // Cloud takes precedence (or merge by updatedAt if needed)
        Object.keys(studentsCloud).forEach(function(docId) {
          var key = docId.replace(/_/g, '|');
          localStudents[key] = studentsCloud[docId].students || [];
        });

        Object.keys(vasCloud).forEach(function(docId) {
          var key = docId.replace(/_/g, '|');
          localVas[key] = vasCloud[docId].vas || [];
        });

        Object.keys(pbsCloud).forEach(function(docId) {
          var key = docId.replace(/_/g, '|');
          localPbs[key] = pbsCloud[docId].pb || { anglo: { valorMax: 10, notas: {} }, prova: { valorMax: 10, notas: {} } };
        });

        _save(STORAGE_KEY, localStudents);
        _save(VA_KEY, localVas);
        _save(PB_KEY, localPbs);

        _notifySync('success', 'Sincronizado!');
        if (callback) callback(true);
      }).catch(function(err) {
        console.error('Cloud load error:', err);
        _notifySync('error', 'Erro ao carregar');
        if (callback) callback(false);
      });
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
      syncStudentsToCloud(turma, materia, bimestre, students);
    },

    addStudent: function(turma, materia, bimestre, numero, nome) {
      // Check if already exists in the requested matéria
      var students = this.getStudents(turma, materia, bimestre);
      if (students.find(function(s) { return s.numero === numero; })) return false;

      // Propagate to all matérias of this turma
      var materias = this.getMaterias(turma);
      var self = this;
      materias.forEach(function(mat) {
        var list = self.getStudents(turma, mat, bimestre);
        if (!list.find(function(s) { return s.numero === numero; })) {
          list.push({ numero: numero, nome: nome, negativos: 0, quali: 0, pb: 0, va: 0 });
          list.sort(function(a, b) { return a.numero - b.numero; });
          self.setStudents(turma, mat, bimestre, list);
        }
      });
      return true;
    },

    removeStudent: function(turma, materia, bimestre, numero) {
      // Remove from all matérias of this turma
      var materias = this.getMaterias(turma);
      var self = this;
      materias.forEach(function(mat) {
        var students = self.getStudents(turma, mat, bimestre);
        students = students.filter(function(s) { return s.numero !== numero; });
        self.setStudents(turma, mat, bimestre, students);
      });
    },

    updateNegativo: function(turma, materia, bimestre, numero, delta) {
      var students = this.getStudents(turma, materia, bimestre);
      var s = students.find(function(st) { return st.numero === numero; });
      if (s) {
        s.negativos = Math.min(100, Math.max(0, s.negativos + delta));
        this.setStudents(turma, materia, bimestre, students);
      }
    },

    updatePositivo: function(turma, materia, bimestre, numero, delta) {
      var students = this.getStudents(turma, materia, bimestre);
      var s = students.find(function(st) { return st.numero === numero; });
      if (s) {
        if (typeof s.positivos === 'undefined') s.positivos = 0;
        s.positivos = Math.min(100, Math.max(0, s.positivos + delta));
        this.setStudents(turma, materia, bimestre, students);
      }
    },

    updateNota: function(turma, materia, bimestre, numero, field, value) {
      var students = this.getStudents(turma, materia, bimestre);
      var s = students.find(function(st) { return st.numero === numero; });
      if (s) {
        var oldValue = s[field];
        var v = parseFloat(value);
        s[field] = isNaN(v) ? 0 : Math.min(10, Math.max(0, v));
        this.setStudents(turma, materia, bimestre, students);
        // Log grade change
        _logAudit('nota_alterada', {
          aluno: s.nome,
          numero: numero,
          turma: turma,
          materia: materia,
          bimestre: bimestre,
          campo: field,
          valorAnterior: oldValue,
          valorNovo: s[field]
        });
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
      syncVAsToCloud(turma, materia, bimestre, vas);
    },

    addVA: function(turma, materia, bimestre, nome, tipo, valorMax, peso) {
      // Propagate VA to all salas of the same year
      var ano = turma.charAt(0);
      var turmasConfig = _getTurmasConfiguradas();
      var salasDoAno = turmasConfig.filter(function(t) { return t.charAt(0) === ano; });
      var self = this;
      var newId = null;
      var pesoVal = parseFloat(peso) || 1;

      salasDoAno.forEach(function(sala) {
        var vas = self.getVAs(sala, materia, bimestre);
        var id = vas.length > 0 ? Math.max.apply(null, vas.map(function(v) { return v.id; })) + 1 : 1;
        // Use same ID across all salas for consistency
        if (newId === null) newId = id;
        vas.push({ id: newId, nome: nome, tipo: tipo, valorMax: valorMax, peso: pesoVal, notas: {} });
        self.setVAs(sala, materia, bimestre, vas);
      });

      return newId;
    },

    removeVA: function(turma, materia, bimestre, vaId) {
      // Remove VA from all salas of the same year
      var ano = turma.charAt(0);
      var turmasConfig = _getTurmasConfiguradas();
      var salasDoAno = turmasConfig.filter(function(t) { return t.charAt(0) === ano; });
      var self = this;

      salasDoAno.forEach(function(sala) {
        var vas = self.getVAs(sala, materia, bimestre);
        vas = vas.filter(function(v) { return v.id !== vaId; });
        self.setVAs(sala, materia, bimestre, vas);
      });
    },

    updateVAPeso: function(turma, materia, bimestre, vaId, novoPeso) {
      // Update peso for all salas of the same year
      var ano = turma.charAt(0);
      var turmasConfig = _getTurmasConfiguradas();
      var salasDoAno = turmasConfig.filter(function(t) { return t.charAt(0) === ano; });
      var self = this;
      var pesoVal = parseFloat(novoPeso) || 1;

      salasDoAno.forEach(function(sala) {
        var vas = self.getVAs(sala, materia, bimestre);
        var va = vas.find(function(v) { return v.id === vaId; });
        if (va) {
          va.peso = pesoVal;
          self.setVAs(sala, materia, bimestre, vas);
        }
      });
    },

    setVANota: function(turma, materia, bimestre, vaId, alunoNumero, nota) {
      var vas = this.getVAs(turma, materia, bimestre);
      var va = vas.find(function(v) { return v.id === vaId; });
      if (va) {
        var oldValue = va.notas[alunoNumero] || 0;
        var v = parseFloat(nota);
        va.notas[alunoNumero] = isNaN(v) ? 0 : Math.min(va.valorMax, Math.max(0, v));
        this.setVAs(turma, materia, bimestre, vas);
        // Log VA change
        _logAudit('va_alterado', {
          alunoNumero: alunoNumero,
          turma: turma,
          materia: materia,
          bimestre: bimestre,
          vaNome: va.nome,
          valorAnterior: oldValue,
          valorNovo: va.notas[alunoNumero]
        });
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
      var totalPonderado = 0;
      var somaPesos = 0;
      vas.forEach(function(va) {
        var peso = va.peso || 1;
        totalPonderado += self.getVANormalizada(va, alunoNumero) * peso;
        somaPesos += peso;
      });
      if (somaPesos === 0) return 0;
      return +(totalPonderado / somaPesos).toFixed(2);
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
      syncPBsToCloud(turma, materia, bimestre, pbData);
    },

    setPBValorMax: function(turma, materia, bimestre, tipo, valorMax) {
      var pb = this.getPB(turma, materia, bimestre);
      pb[tipo].valorMax = valorMax;
      this.setPB(turma, materia, bimestre, pb);
    },

    setPBNota: function(turma, materia, bimestre, tipo, alunoNumero, nota) {
      var pb = this.getPB(turma, materia, bimestre);
      var oldValue = pb[tipo].notas[alunoNumero] || 0;
      var v = parseFloat(nota);
      pb[tipo].notas[alunoNumero] = isNaN(v) ? 0 : Math.min(pb[tipo].valorMax, Math.max(0, v));
      this.setPB(turma, materia, bimestre, pb);
      // Log PB change
      _logAudit('pb_alterado', {
        alunoNumero: alunoNumero,
        turma: turma,
        materia: materia,
        bimestre: bimestre,
        tipo: tipo,
        valorAnterior: oldValue,
        valorNovo: pb[tipo].notas[alunoNumero]
      });
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

    // Quali ajustada = quali + (positivos × 0.1) - (negativos × 0.1), clamped to 0-10
    getQualiAjustada: function(student) {
      var positivos = student.positivos || 0;
      var bonus = positivos * 0.1;
      var desconto = student.negativos * 0.1;
      return +Math.min(10, Math.max(0, student.quali + bonus - desconto)).toFixed(2);
    },

    // Full media calculation
    // For matérias with PB: M = (PB×35 + Quali×30 + VA×35) / 100
    // For LEM (no PB):       M = (Quali×30 + VA×35) / 65
    calcMediaFull: function(turma, materia, bimestre, student) {
      var positivos = student.positivos || 0;
      var qualiAjustada = Math.min(10, Math.max(0, student.quali + positivos * 0.1 - student.negativos * 0.1));
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
      var positivos = student.positivos || 0;
      var qualiAjustada = Math.min(10, Math.max(0, student.quali + positivos * 0.1 - student.negativos * 0.1));
      var vaScore = (vaMedia !== undefined) ? vaMedia : student.va;
      return +((student.pb * PESOS.pb + qualiAjustada * PESOS.quali + vaScore * PESOS.va) / (PESOS.pb + PESOS.quali + PESOS.va)).toFixed(1);
    },

    importCSV: function(turma, materia, bimestre, csvText) {
      var lines = csvText.split('\n').filter(function(l) { return l.trim(); });
      var count = 0;
      var self = this;
      var materias = this.getMaterias(turma);

      // Parse new students from CSV first
      var parsed = [];
      lines.forEach(function(line) {
        var parts = line.split(',');
        if (parts.length >= 2) {
          var numero = parseInt(parts[0].trim());
          var nome = parts[1].trim();
          var negativos = parts[2] ? parseInt(parts[2].trim()) || 0 : 0;
          if (numero && nome) parsed.push({ numero: numero, nome: nome, negativos: negativos });
        }
      });

      // Check count against the requested matéria
      var students = this.getStudents(turma, materia, bimestre);
      parsed.forEach(function(p) {
        if (!students.find(function(s) { return s.numero === p.numero; })) count++;
      });

      // Add to all matérias of this turma
      materias.forEach(function(mat) {
        var list = self.getStudents(turma, mat, bimestre);
        var changed = false;
        parsed.forEach(function(p) {
          if (!list.find(function(s) { return s.numero === p.numero; })) {
            list.push({ numero: p.numero, nome: p.nome, negativos: p.negativos, quali: 0, pb: 0, va: 0 });
            changed = true;
          }
        });
        if (changed) {
          list.sort(function(a, b) { return a.numero - b.numero; });
          self.setStudents(turma, mat, bimestre, list);
        }
      });

      return count;
    },

    copyStudentsToBimestre: function(turma, materia, fromBim, toBim) {
      var from = this.getStudents(turma, materia, fromBim);
      var count = 0;
      var self = this;
      var materias = this.getMaterias(turma);

      // Count new students based on the requested matéria
      var to = this.getStudents(turma, materia, toBim);
      from.forEach(function(s) {
        if (!to.find(function(t) { return t.numero === s.numero; })) count++;
      });

      // Copy to all matérias of this turma
      materias.forEach(function(mat) {
        var fromList = self.getStudents(turma, mat, fromBim);
        var toList = self.getStudents(turma, mat, toBim);
        var changed = false;
        fromList.forEach(function(s) {
          if (!toList.find(function(t) { return t.numero === s.numero; })) {
            toList.push({ numero: s.numero, nome: s.nome, negativos: 0, quali: 0, pb: 0, va: 0 });
            changed = true;
          }
        });
        if (changed) {
          toList.sort(function(a, b) { return a.numero - b.numero; });
          self.setStudents(turma, mat, toBim, toList);
        }
      });

      return count;
    },

    // =========== AGGREGATION ===========

    getFilteredStudents: function(filter) {
      var data = _load(STORAGE_KEY);
      var results = [];
      var seen = {};
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
            // Deduplicate: count each student once per turma+bimestre
            var uid = turma + '|' + bimestre + '|' + s.numero;
            if (seen[uid]) return;
            seen[uid] = true;
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
      var seen = {};
      Object.keys(data).forEach(function(key) {
        var parts = key.split('|');
        var turma = parts[0]; var bimestre = parts[2];
        data[key].forEach(function(s) {
          // Deduplicate: count each student once per turma+bimestre
          var uid = turma + '|' + bimestre + '|' + s.numero;
          if (seen[uid]) return;
          seen[uid] = true;
          turmasSet[turma] = true;
          totalAlunos++;
          totalNegativos += s.negativos;
        });
      });
      return { totalAlunos: totalAlunos, totalNegativos: totalNegativos, turmasCount: Object.keys(turmasSet).length };
    },

    getAllMaterias: function() {
      var prof = _loadProfessor();
      var all = {};
      if (prof && prof.materias && prof.materias.length > 0) {
        prof.materias.forEach(function(m) { all[m.nome] = true; });
        return Object.keys(all);
      }
      // Fallback to all available subjects
      TODAS_MATERIAS.forEach(function(m) { all[m] = true; });
      return Object.keys(all);
    },

    exportData: function() {
      return { students: _load(STORAGE_KEY), vas: _load(VA_KEY), pbs: _load(PB_KEY) };
    },

    importData: function(data) {
      if (data.students) _save(STORAGE_KEY, data.students);
      if (data.vas) _save(VA_KEY, data.vas);
      if (data.pbs) _save(PB_KEY, data.pbs);
    },

    clearAll: function() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VA_KEY);
      localStorage.removeItem(PB_KEY);
    },

    // =========== PROFILE ===========

    getProfile: function() {
      try {
        var raw = localStorage.getItem(PROFILE_KEY);
        return raw ? JSON.parse(raw) : { nome: '', email: '', escola: '', disciplinas: '' };
      } catch(e) { return { nome: '', email: '', escola: '', disciplinas: '' }; }
    },

    setProfile: function(profile) {
      _save(PROFILE_KEY, profile);
      if (_syncEnabled) {
        _firestoreSave('config', 'profile', profile);
      }
    },

    // =========== CONFIG (ANO LETIVO) ===========

    getConfig: function() {
      return _loadConfig();
    },

    setAnoLetivo: function(ano) {
      var config = _loadConfig();
      config.anoLetivo = parseInt(ano) || 2026;
      _save(CONFIG_KEY, config);
      ANO_LETIVO = config.anoLetivo;
      if (_syncEnabled) {
        _firestoreSave('config', 'settings', config);
      }
    },

    syncConfigFromCloud: function(callback) {
      if (!_syncEnabled) {
        if (callback) callback(false);
        return;
      }
      Promise.all([
        _firestoreLoad('config', 'settings'),
        _firestoreLoad('config', 'profile')
      ]).then(function(results) {
        var configCloud = results[0];
        var profileCloud = results[1];
        if (configCloud && configCloud.anoLetivo) {
          _save(CONFIG_KEY, configCloud);
          ANO_LETIVO = configCloud.anoLetivo;
        }
        if (profileCloud) {
          _save(PROFILE_KEY, profileCloud);
        }
        if (callback) callback(true);
      }).catch(function(err) {
        console.error('Config sync error:', err);
        if (callback) callback(false);
      });
    }
  };
})();

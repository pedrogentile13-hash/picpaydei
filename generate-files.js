const PDFDocument = require('pdfkit');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');

// ========== CORES ==========
const GREEN = '#11C76F';
const DARK = '#005542';
const GRAY = '#6B7280';
const GRAY_LIGHT = '#F3F4F6';
const WHITE = '#FFFFFF';
const RED = '#EF4444';
const BLUE = '#1D4ED8';

// ================================================
// PDF GENERATION
// ================================================
function generatePDF() {
  const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
  const stream = fs.createWriteStream('./APRESENTACAO_picpaydei.pdf');
  doc.pipe(stream);

  const W = 595.28; // A4 width
  const H = 841.89; // A4 height
  const M = 50; // margin

  function addSlide() {
    doc.addPage({ size: 'A4', margin: 0 });
  }

  function drawRect(x, y, w, h, color) {
    doc.rect(x, y, w, h).fill(color);
  }

  function drawRoundedRect(x, y, w, h, r, color) {
    doc.roundedRect(x, y, w, h, r).fill(color);
  }

  function text(str, x, y, opts) {
    doc.fillColor(opts.color || '#000');
    doc.font(opts.bold ? 'Helvetica-Bold' : 'Helvetica');
    doc.fontSize(opts.size || 12);
    if (opts.width) {
      doc.text(str, x, y, { width: opts.width, align: opts.align || 'left', lineGap: opts.lineGap || 4 });
    } else {
      doc.text(str, x, y, { align: opts.align || 'left', lineGap: opts.lineGap || 4 });
    }
  }

  function pageNum(n) {
    doc.fillColor('#999999').font('Helvetica').fontSize(9);
    doc.text('picpay.de.i', M, H - 35, { width: W - 2 * M, align: 'left' });
    doc.text('Slide ' + n, M, H - 35, { width: W - 2 * M, align: 'right' });
  }

  function bulletList(items, x, y, w, size, color) {
    let cy = y;
    items.forEach(function(item) {
      doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(size || 11);
      doc.text('  \u2713  ', x, cy, { continued: true });
      doc.fillColor(color || '#333').font('Helvetica').fontSize(size || 11);
      doc.text(item, { width: w - 30 });
      cy = doc.y + 4;
    });
    return cy;
  }

  // ====== SLIDE 1: TITULO ======
  drawRect(0, 0, W, H, GREEN);
  text('picpay.de.i', 0, 260, { size: 52, bold: true, color: WHITE, width: W, align: 'center' });
  text('Sistema de Gerenciamento Escolar', 0, 340, { size: 24, color: WHITE, width: W, align: 'center' });
  drawRoundedRect(W / 2 - 180, 400, 360, 2, 1, WHITE);
  text('Uma solucao moderna para acompanhamento\nde desempenho academico', 0, 430, { size: 16, color: WHITE, width: W, align: 'center' });
  text('Apresentacao do Projeto  |  Ano Letivo 2026', 0, H - 80, { size: 12, color: WHITE, width: W, align: 'center' });

  // ====== SLIDE 2: O DESAFIO ======
  addSlide();
  drawRect(0, 0, W, 80, GREEN);
  text('O Desafio', M, 25, { size: 32, bold: true, color: WHITE });

  // Antes
  drawRoundedRect(M, 110, 230, 30, 4, '#FEE2E2');
  text('Antes', M + 15, 117, { size: 14, bold: true, color: '#991B1B' });
  bulletList([
    'Gestao manual de notas em planilhas',
    'Calculos complexos sujeitos a erros',
    'Falta de visualizacao de dados',
    'Dificuldade em acompanhamento individual',
    'Sem acesso remoto ou backup dos dados'
  ], M + 10, 160, 220, 10, '#555');

  // Depois
  drawRoundedRect(W / 2 + 15, 110, 230, 30, 4, '#D1FAE5');
  text('Solucao', W / 2 + 30, 117, { size: 14, bold: true, color: '#065F46' });
  bulletList([
    'Plataforma integrada e intuitiva',
    'Calculos automaticos e precisos',
    'Dashboards e relatorios visuais',
    'Acompanhamento em tempo real',
    'Sincronizacao com nuvem (Firebase)'
  ], W / 2 + 25, 160, 220, 10, '#555');

  pageNum(2);

  // ====== SLIDE 3: CARACTERISTICAS ======
  addSlide();
  drawRect(0, 0, W, 80, GREEN);
  text('Caracteristicas Principais', M, 25, { size: 32, bold: true, color: WHITE });

  var features = [
    { icon: 'Alunos', desc: 'Cadastro individual ou em lote (CSV). Controle de 11 turmas: 6A-6D, 8A-8C, 9A-9D.' },
    { icon: 'VA', desc: 'Multiplas atividades avaliativas com normalizacao automatica. Propagacao entre turmas do mesmo ano.' },
    { icon: 'Prova Bimestral', desc: 'Anglo (peso 1) e Prova (peso 5). Disponivel para Portugues e Producao de Texto.' },
    { icon: 'Negativos', desc: 'Registro de comportamento com penalizacao automatica. Limite de 100 negativos por aluno.' },
    { icon: 'Dashboards', desc: 'Rankings de desempenho e graficos comparativos entre turmas por VA e PB.' },
    { icon: 'Nuvem', desc: 'Firebase Firestore com offline persistence. Dados sincronizados automaticamente.' }
  ];

  var fy = 110;
  features.forEach(function(f, i) {
    drawRoundedRect(M, fy, W - 2 * M, 95, 8, i % 2 === 0 ? GRAY_LIGHT : WHITE);
    drawRoundedRect(M + 10, fy + 12, 8, 70, 4, GREEN);
    text(f.icon, M + 30, fy + 15, { size: 14, bold: true, color: DARK, width: W - 2 * M - 40 });
    text(f.desc, M + 30, fy + 38, { size: 10, color: GRAY, width: W - 2 * M - 50 });
    fy += 105;
  });

  pageNum(3);

  // ====== SLIDE 4: FORMULAS ======
  addSlide();
  drawRect(0, 0, W, 80, GREEN);
  text('Formulas de Calculo', M, 25, { size: 32, bold: true, color: WHITE });

  // Formula 1
  text('Para Portugues e Producao de Texto:', M, 110, { size: 14, bold: true, color: DARK });
  drawRoundedRect(M, 140, W - 2 * M, 70, 8, GREEN);
  text('Media Final', 0, 150, { size: 12, color: WHITE, width: W, align: 'center' });
  text('M = (PB x 35 + Quali x 30 + VA x 35) / 100', 0, 172, { size: 18, bold: true, color: WHITE, width: W, align: 'center' });

  // Formula 2
  text('Para LEM (sem Prova Bimestral):', M, 240, { size: 14, bold: true, color: DARK });
  drawRoundedRect(M, 270, W - 2 * M, 70, 8, GREEN);
  text('Media Final - LEM', 0, 280, { size: 12, color: WHITE, width: W, align: 'center' });
  text('M = (Quali x 30 + VA x 35) / 65', 0, 302, { size: 18, bold: true, color: WHITE, width: W, align: 'center' });

  // Formula 3
  text('Prova Bimestral (Anglo + Prova):', M, 370, { size: 14, bold: true, color: DARK });
  drawRoundedRect(M, 400, W - 2 * M, 70, 8, DARK);
  text('Media PB', 0, 410, { size: 12, color: WHITE, width: W, align: 'center' });
  text('Media PB = (Anglo x 1 + Prova x 5) / 6', 0, 432, { size: 18, bold: true, color: WHITE, width: W, align: 'center' });

  // Formula 4
  text('Qualitativa Ajustada (penalizacao):', M, 500, { size: 14, bold: true, color: DARK });
  drawRoundedRect(M, 530, W - 2 * M, 70, 8, '#991B1B');
  text('Penalizacao de Negativos', 0, 540, { size: 12, color: WHITE, width: W, align: 'center' });
  text('Quali Ajustada = Quali - (Negativos x 0.1)', 0, 562, { size: 18, bold: true, color: WHITE, width: W, align: 'center' });

  text('Todas as notas sao normalizadas para a escala 0-10', 0, 640, { size: 11, color: GRAY, width: W, align: 'center' });

  pageNum(4);

  // ====== SLIDE 5: ESTRUTURA ======
  addSlide();
  drawRect(0, 0, W, 80, GREEN);
  text('Estrutura Organizacional', M, 25, { size: 32, bold: true, color: WHITE });

  text('Turmas por Ano:', M, 110, { size: 16, bold: true, color: DARK });

  // Stat boxes
  var stats = [
    { num: '4', label: '6o Ano\n6A, 6B, 6C, 6D' },
    { num: '3', label: '8o Ano\n8A, 8B, 8C' },
    { num: '4', label: '9o Ano\n9A, 9B, 9C, 9D' }
  ];

  stats.forEach(function(s, i) {
    var sx = M + 10 + i * 165;
    drawRoundedRect(sx, 145, 145, 100, 10, GRAY_LIGHT);
    text(s.num, sx, 155, { size: 40, bold: true, color: GREEN, width: 145, align: 'center' });
    text(s.label, sx, 200, { size: 10, color: GRAY, width: 145, align: 'center' });
  });

  text('Materias por Serie:', M, 280, { size: 16, bold: true, color: DARK });

  // Table header
  drawRect(M, 310, W - 2 * M, 30, GREEN);
  text('Serie', M + 10, 318, { size: 11, bold: true, color: WHITE });
  text('Materias', M + 140, 318, { size: 11, bold: true, color: WHITE });
  text('Prova Bimestral', M + 360, 318, { size: 11, bold: true, color: WHITE });

  // Table rows
  var rows = [
    ['6o Ano', 'LEM, Producao de Texto', 'Nao'],
    ['8o Ano', 'Portugues, Producao de Texto', 'Sim'],
    ['9o Ano', 'LEM', 'Nao']
  ];
  rows.forEach(function(r, i) {
    var ry = 340 + i * 30;
    drawRect(M, ry, W - 2 * M, 30, i % 2 === 0 ? GRAY_LIGHT : WHITE);
    text(r[0], M + 10, ry + 8, { size: 10, bold: true, color: DARK });
    text(r[1], M + 140, ry + 8, { size: 10, color: '#333' });
    text(r[2], M + 360, ry + 8, { size: 10, bold: true, color: r[2] === 'Sim' ? GREEN : RED });
  });

  pageNum(5);

  // ====== SLIDE 6: MODULOS ======
  addSlide();
  drawRect(0, 0, W, 80, GREEN);
  text('Modulos da Plataforma', M, 25, { size: 32, bold: true, color: WHITE });

  var modulos = [
    { title: 'Alunos', items: ['Cadastro individual', 'Importacao CSV em massa', 'Copia entre bimestres', 'Exclusao individual e em lote'] },
    { title: 'Verificacoes (VA)', items: ['Criacao com tipos variados', 'Propagacao automatica', 'Normalizacao 0-10', 'Dashboard comparativo por VA'] },
    { title: 'Prova Bimestral', items: ['Anglo (peso 1)', 'Prova (peso 5)', 'Lancamento rapido', 'Dashboard comparativo'] },
    { title: 'Negativos', items: ['Registro por aluno (+/-)', 'Limite de 100', 'Penalizacao automatica', 'Acompanhamento visual'] },
    { title: 'Boletim', items: ['Notas consolidadas', 'Media final calculada', 'Status visual (verde/vermelho)', 'Visualizacao completa'] },
    { title: 'Relatorios', items: ['Filtragem flexivel', 'Rankings de desempenho', 'Estatisticas gerais', 'Analise por turma/ano/materia'] }
  ];

  modulos.forEach(function(m, i) {
    var col = i % 2;
    var row = Math.floor(i / 2);
    var mx = M + col * (W / 2 - M);
    var my = 110 + row * 200;

    drawRoundedRect(mx, my, W / 2 - M - 15, 180, 10, GRAY_LIGHT);
    drawRoundedRect(mx, my, W / 2 - M - 15, 35, 10, DARK);
    drawRect(mx, my + 25, W / 2 - M - 15, 10, DARK);
    text(m.title, mx + 15, my + 10, { size: 13, bold: true, color: WHITE });

    var ly = my + 50;
    m.items.forEach(function(item) {
      doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(9);
      doc.text('\u2713  ', mx + 15, ly, { continued: true });
      doc.fillColor('#555').font('Helvetica').fontSize(9);
      doc.text(item, { width: W / 2 - M - 60 });
      ly = doc.y + 6;
    });
  });

  pageNum(6);

  // ====== SLIDE 7: TECNOLOGIAS ======
  addSlide();
  drawRect(0, 0, W, 80, GREEN);
  text('Stack Tecnologico', M, 25, { size: 32, bold: true, color: WHITE });

  // Frontend
  drawRoundedRect(M, 110, 230, 35, 8, BLUE);
  text('Frontend', M + 15, 120, { size: 14, bold: true, color: WHITE });
  bulletList(['HTML5', 'CSS3 (Design System)', 'JavaScript Vanilla (ES5)', 'Chart.js para graficos', 'Responsive Design'], M + 10, 160, 220, 10, '#555');

  // Backend
  drawRoundedRect(W / 2 + 15, 110, 230, 35, 8, DARK);
  text('Backend & Data', W / 2 + 30, 120, { size: 14, bold: true, color: WHITE });
  bulletList(['Firebase Firestore', 'localStorage (cache local)', 'Offline Persistence', 'Sincronizacao automatica', 'Seguranca Firebase Rules'], W / 2 + 25, 160, 220, 10, '#555');

  text('Caracteristicas Tecnicas:', M, 380, { size: 14, bold: true, color: DARK });
  drawRoundedRect(M, 410, W - 2 * M, 180, 8, GRAY_LIGHT);
  bulletList([
    'Funciona totalmente offline (PWA)',
    'Sincronizacao em tempo real com Firebase',
    'Sem dependencias externas pesadas',
    'Compativel com navegadores modernos',
    'VA propaga automaticamente entre turmas',
    'Limite de negativos (max 100)'
  ], M + 15, 425, W - 2 * M - 40, 11, '#333');

  pageNum(7);

  // ====== SLIDE 8: DIFERENCIAIS ======
  addSlide();
  drawRect(0, 0, W, 80, GREEN);
  text('Diferenciais do Projeto', M, 25, { size: 32, bold: true, color: WHITE });

  var diffs = [
    { title: 'Propagacao Automatica de VA', desc: 'Ao criar uma VA em uma turma (ex: 6A), ela e automaticamente replicada para todas as outras turmas do mesmo ano (6B, 6C, 6D). O mesmo para remocao.' },
    { title: 'Offline First', desc: 'Funciona completamente sem internet. Os dados sao salvos localmente e sincronizados automaticamente quando a conexao e restabelecida.' },
    { title: 'Flexibilidade na Avaliacao', desc: 'Suporta diferentes tipos de avaliacao: VA com valores maximos variaveis, PB com pesos especificos (Anglo peso 1, Prova peso 5), negativos com limite de 100.' },
    { title: 'Analise Comparativa por VA', desc: 'Dashboards que permitem comparar desempenho entre turmas POR VA ESPECIFICA, nao apenas de forma geral. Ranking + grafico + estatisticas.' },
    { title: 'Documentacao Integrada', desc: 'Manual interativo e colapsavel com instrucoes passo a passo para cada funcionalidade, acessivel direto na pagina de Configuracoes.' },
    { title: 'Persistencia de Dados', desc: 'Backup automatico na nuvem com Firebase. Sincronizacao entre multiplas abas e dispositivos. Nunca perca os dados dos seus alunos.' }
  ];

  var dy = 110;
  diffs.forEach(function(d, i) {
    drawRoundedRect(M, dy, W - 2 * M, 90, 8, i % 2 === 0 ? GRAY_LIGHT : WHITE);
    drawRoundedRect(M + 10, dy + 10, 6, 70, 3, GREEN);
    text(d.title, M + 28, dy + 14, { size: 12, bold: true, color: DARK, width: W - 2 * M - 50 });
    text(d.desc, M + 28, dy + 34, { size: 9, color: GRAY, width: W - 2 * M - 55 });
    dy += 98;
  });

  pageNum(8);

  // ====== SLIDE 9: CRONOGRAMA ======
  addSlide();
  drawRect(0, 0, W, 80, GREEN);
  text('Cronograma de Desenvolvimento', M, 25, { size: 32, bold: true, color: WHITE });

  // Table
  drawRect(M, 110, W - 2 * M, 30, DARK);
  text('Fase', M + 10, 118, { size: 10, bold: true, color: WHITE });
  text('Funcionalidades', M + 180, 118, { size: 10, bold: true, color: WHITE });
  text('Status', M + 400, 118, { size: 10, bold: true, color: WHITE });

  var fases = [
    ['Fase 1: Estrutura Base', 'Sidebar, Topbar, Layout principal, Design System'],
    ['Fase 2: Gestao de Alunos', 'Cadastro, importacao CSV, exclusao em lote'],
    ['Fase 3: Sistema de VA', 'Criacao, normalizacao, propagacao automatica'],
    ['Fase 4: Prova Bimestral', 'Anglo (peso 1), Prova (peso 5), calculos'],
    ['Fase 5: Negativos', 'Registro, limite de 100, penalizacao automatica'],
    ['Fase 6: Dashboards', 'VA por prova, PB comparativo, graficos Chart.js'],
    ['Fase 7: Firebase', 'Firestore, offline persistence, sincronizacao'],
    ['Fase 8: Boletim e Relatorios', 'Notas consolidadas, filtragem, rankings'],
    ['Fase 9: Documentacao', 'Manual interativo, pagina de configuracoes']
  ];

  fases.forEach(function(f, i) {
    var fy2 = 140 + i * 30;
    drawRect(M, fy2, W - 2 * M, 30, i % 2 === 0 ? GRAY_LIGHT : WHITE);
    text(f[0], M + 10, fy2 + 8, { size: 9, bold: true, color: DARK });
    text(f[1], M + 180, fy2 + 8, { size: 9, color: '#555' });
    drawRoundedRect(M + 400, fy2 + 5, 70, 20, 4, '#D1FAE5');
    text('Concluido', M + 405, fy2 + 9, { size: 8, bold: true, color: '#065F46' });
  });

  pageNum(9);

  // ====== SLIDE 10: RESULTADOS ======
  addSlide();
  drawRect(0, 0, W, 80, GREEN);
  text('Resultados Esperados', M, 25, { size: 32, bold: true, color: WHITE });

  text('Para o Professor:', M, 110, { size: 16, bold: true, color: DARK });
  drawRoundedRect(M, 140, W - 2 * M, 200, 10, GRAY_LIGHT);
  bulletList([
    'Reducao de tempo em digitacao e calculos manuais',
    'Eliminacao de erros de calculo nas medias',
    'Visao holistica do desempenho de todas as turmas',
    'Identificacao rapida de alunos com dificuldade',
    'Acesso remoto aos dados de qualquer dispositivo',
    'Backup automatico - sem risco de perda de dados'
  ], M + 15, 160, W - 2 * M - 40, 11, '#333');

  text('Para o Sistema Escolar:', M, 370, { size: 16, bold: true, color: DARK });
  drawRoundedRect(M, 400, W - 2 * M, 200, 10, GRAY_LIGHT);
  bulletList([
    'Padronizacao de processos avaliativos',
    'Maior precisao e transparencia nas avaliacoes',
    'Documentacao automatica e auditavel',
    'Relatorios gerenciais para tomada de decisao',
    'Rastreabilidade completa de todas as notas',
    'Conformidade e auditoria facilitadas'
  ], M + 15, 420, W - 2 * M - 40, 11, '#333');

  pageNum(10);

  // ====== SLIDE 11: CONCLUSAO ======
  addSlide();
  drawRect(0, 0, W, H, GREEN);

  text('Obrigado!', 0, 250, { size: 52, bold: true, color: WHITE, width: W, align: 'center' });
  drawRoundedRect(W / 2 - 150, 320, 300, 2, 1, WHITE);
  text('picpay.de.i', 0, 340, { size: 24, bold: true, color: WHITE, width: W, align: 'center' });
  text('Sistema de Gerenciamento Escolar', 0, 375, { size: 16, color: WHITE, width: W, align: 'center' });

  var items = [
    'Plataforma web responsiva',
    'Funciona offline e online',
    'Dashboards inteligentes por VA e PB',
    'Sincronizacao em nuvem com Firebase',
    'Documentacao completa integrada'
  ];

  var iy = 440;
  items.forEach(function(item) {
    doc.fillColor(WHITE).font('Helvetica').fontSize(14);
    doc.text('\u2713  ' + item, 0, iy, { width: W, align: 'center' });
    iy += 28;
  });

  text('Prof. Aladdin  |  Ano Letivo 2026', 0, H - 80, { size: 12, color: WHITE, width: W, align: 'center' });

  doc.end();
  return new Promise(function(resolve) {
    stream.on('finish', function() {
      console.log('PDF gerado: APRESENTACAO_picpaydei.pdf');
      resolve();
    });
  });
}

// ================================================
// PPTX GENERATION
// ================================================
function generatePPTX() {
  var prs = new PptxGenJS();
  prs.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
  prs.layout = 'WIDE';

  var W = 13.333;

  // ====== SLIDE 1: TITULO ======
  var s1 = prs.addSlide();
  s1.background = { color: GREEN };
  s1.addText('picpay.de.i', { x: 0, y: 2.2, w: W, h: 1, fontSize: 60, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
  s1.addText('Sistema de Gerenciamento Escolar', { x: 0, y: 3.5, w: W, h: 0.6, fontSize: 28, color: WHITE, align: 'center', fontFace: 'Arial' });
  s1.addText('Uma solucao moderna para acompanhamento de desempenho academico', { x: 0, y: 4.5, w: W, h: 0.5, fontSize: 16, color: WHITE, align: 'center', fontFace: 'Arial' });
  s1.addText('Apresentacao do Projeto  |  Ano Letivo 2026', { x: 0, y: 6.5, w: W, h: 0.4, fontSize: 12, color: WHITE, align: 'center', fontFace: 'Arial' });

  // ====== SLIDE 2: DESAFIO ======
  var s2 = prs.addSlide();
  s2.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: GREEN } });
  s2.addText('O Desafio', { x: 0.5, y: 0.2, w: 12, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });

  s2.addShape('roundRect', { x: 0.5, y: 1.3, w: 5.8, h: 0.45, fill: { color: 'FEE2E2' }, rectRadius: 0.1 });
  s2.addText('Antes', { x: 0.7, y: 1.33, w: 5, h: 0.4, fontSize: 16, bold: true, color: '991B1B', fontFace: 'Arial' });
  s2.addText('Gestao manual de notas em planilhas\nCalculos complexos e sujeitos a erros\nFalta de visualizacao de dados\nDificuldade em acompanhamento individual\nSem acesso remoto ou backup dos dados', { x: 0.7, y: 2.0, w: 5.5, h: 4.5, fontSize: 13, color: '555555', fontFace: 'Arial', bullet: true, paraSpaceAfter: 8 });

  s2.addShape('roundRect', { x: 7, y: 1.3, w: 5.8, h: 0.45, fill: { color: 'D1FAE5' }, rectRadius: 0.1 });
  s2.addText('Solucao', { x: 7.2, y: 1.33, w: 5, h: 0.4, fontSize: 16, bold: true, color: '065F46', fontFace: 'Arial' });
  s2.addText('Plataforma integrada e intuitiva\nCalculos automaticos e precisos\nDashboards e relatorios visuais\nAcompanhamento em tempo real\nSincronizacao com nuvem (Firebase)', { x: 7.2, y: 2.0, w: 5.5, h: 4.5, fontSize: 13, color: '555555', fontFace: 'Arial', bullet: true, paraSpaceAfter: 8 });

  // ====== SLIDE 3: CARACTERISTICAS ======
  var s3 = prs.addSlide();
  s3.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: GREEN } });
  s3.addText('Caracteristicas Principais', { x: 0.5, y: 0.2, w: 12, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });

  var feats = [
    ['Gerenciamento de Alunos', 'Cadastro individual ou em lote (CSV). Controle de 11 turmas.'],
    ['VA - Verificacoes de Aprendizagem', 'Multiplas atividades com normalizacao. Propagacao automatica entre turmas.'],
    ['Prova Bimestral', 'Anglo (peso 1) e Prova (peso 5). Portugues e Producao de Texto.'],
    ['Sistema de Negativos', 'Registro com penalizacao automatica. Limite de 100 negativos.'],
    ['Dashboards Comparativos', 'Rankings de desempenho e graficos comparativos entre turmas.'],
    ['Sincronizacao em Nuvem', 'Firebase Firestore com offline persistence e sync automatico.']
  ];

  feats.forEach(function(f, i) {
    var col = i % 2;
    var row = Math.floor(i / 2);
    var fx = 0.5 + col * 6.4;
    var fy2 = 1.3 + row * 1.95;

    s3.addShape('roundRect', { x: fx, y: fy2, w: 6, h: 1.7, fill: { color: 'F3F4F6' }, rectRadius: 0.15 });
    s3.addText(f[0], { x: fx + 0.2, y: fy2 + 0.15, w: 5.6, h: 0.4, fontSize: 14, bold: true, color: DARK, fontFace: 'Arial' });
    s3.addText(f[1], { x: fx + 0.2, y: fy2 + 0.65, w: 5.6, h: 0.9, fontSize: 11, color: '6B7280', fontFace: 'Arial' });
  });

  // ====== SLIDE 4: FORMULAS ======
  var s4 = prs.addSlide();
  s4.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: GREEN } });
  s4.addText('Formulas de Calculo', { x: 0.5, y: 0.2, w: 12, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });

  var formulas = [
    { label: 'Portugues / Producao de Texto', formula: 'M = (PB x 35 + Quali x 30 + VA x 35) / 100', color: GREEN },
    { label: 'LEM (sem Prova Bimestral)', formula: 'M = (Quali x 30 + VA x 35) / 65', color: GREEN },
    { label: 'Media da Prova Bimestral', formula: 'Media PB = (Anglo x 1 + Prova x 5) / 6', color: DARK },
    { label: 'Penalizacao de Negativos', formula: 'Quali Ajustada = Quali - (Negativos x 0.1)', color: '991B1B' }
  ];

  formulas.forEach(function(f, i) {
    var fy3 = 1.3 + i * 1.45;
    s4.addText(f.label + ':', { x: 0.5, y: fy3, w: 12, h: 0.35, fontSize: 13, bold: true, color: DARK, fontFace: 'Arial' });
    s4.addShape('roundRect', { x: 0.8, y: fy3 + 0.4, w: 11.7, h: 0.75, fill: { color: f.color }, rectRadius: 0.1 });
    s4.addText(f.formula, { x: 0.8, y: fy3 + 0.4, w: 11.7, h: 0.75, fontSize: 20, bold: true, color: WHITE, align: 'center', valign: 'middle', fontFace: 'Courier New' });
  });

  // ====== SLIDE 5: ESTRUTURA ======
  var s5 = prs.addSlide();
  s5.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: GREEN } });
  s5.addText('Estrutura Organizacional', { x: 0.5, y: 0.2, w: 12, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });

  s5.addText('Turmas por Ano:', { x: 0.5, y: 1.2, w: 12, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: 'Arial' });

  var turmas = [
    { num: '4', label: '6o Ano (6A, 6B, 6C, 6D)' },
    { num: '3', label: '8o Ano (8A, 8B, 8C)' },
    { num: '4', label: '9o Ano (9A, 9B, 9C, 9D)' }
  ];

  turmas.forEach(function(t, i) {
    var tx = 1.5 + i * 3.8;
    s5.addShape('roundRect', { x: tx, y: 1.8, w: 3.3, h: 1.3, fill: { color: 'F3F4F6' }, rectRadius: 0.15 });
    s5.addText(t.num, { x: tx, y: 1.85, w: 3.3, h: 0.7, fontSize: 42, bold: true, color: GREEN, align: 'center', fontFace: 'Arial' });
    s5.addText(t.label, { x: tx, y: 2.6, w: 3.3, h: 0.4, fontSize: 11, color: '6B7280', align: 'center', fontFace: 'Arial' });
  });

  s5.addText('Materias por Serie:', { x: 0.5, y: 3.5, w: 12, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: 'Arial' });

  var tblRows = [
    [{ text: 'Serie', options: { bold: true, color: WHITE, fill: { color: GREEN } } }, { text: 'Materias', options: { bold: true, color: WHITE, fill: { color: GREEN } } }, { text: 'Prova Bimestral', options: { bold: true, color: WHITE, fill: { color: GREEN } } }],
    ['6o Ano', 'LEM, Producao de Texto', 'Nao'],
    ['8o Ano', 'Portugues, Producao de Texto', 'Sim'],
    ['9o Ano', 'LEM', 'Nao']
  ];

  s5.addTable(tblRows, { x: 0.8, y: 4.1, w: 11.7, border: { pt: 1, color: 'E5E7EB' }, fontSize: 12, fontFace: 'Arial' });

  // ====== SLIDE 6: MODULOS ======
  var s6 = prs.addSlide();
  s6.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: GREEN } });
  s6.addText('Modulos da Plataforma', { x: 0.5, y: 0.2, w: 12, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });

  var mods = [
    { title: 'Alunos', items: 'Cadastro individual\nImportacao CSV em massa\nCopia entre bimestres\nExclusao em lote' },
    { title: 'VA', items: 'Criacao com tipos variados\nPropagacao automatica\nNormalizacao 0-10\nDashboard por VA' },
    { title: 'Prova Bimestral', items: 'Anglo (peso 1)\nProva (peso 5)\nLancamento rapido\nDashboard comparativo' },
    { title: 'Negativos', items: 'Registro por aluno\nLimite de 100\nPenalizacao automatica\nAcompanhamento visual' },
    { title: 'Boletim', items: 'Notas consolidadas\nMedia final calculada\nStatus visual\nVisualizacao completa' },
    { title: 'Relatorios', items: 'Filtragem flexivel\nRankings de desempenho\nEstatisticas gerais\nAnalise por turma/ano' }
  ];

  mods.forEach(function(m, i) {
    var col = i % 3;
    var row = Math.floor(i / 3);
    var mx = 0.5 + col * 4.3;
    var my = 1.3 + row * 3.0;

    s6.addShape('roundRect', { x: mx, y: my, w: 4, h: 0.45, fill: { color: DARK }, rectRadius: 0.08 });
    s6.addText(m.title, { x: mx + 0.15, y: my + 0.05, w: 3.7, h: 0.35, fontSize: 13, bold: true, color: WHITE, fontFace: 'Arial' });
    s6.addText(m.items, { x: mx + 0.15, y: my + 0.6, w: 3.7, h: 2.2, fontSize: 10, color: '555555', fontFace: 'Arial', bullet: true, paraSpaceAfter: 4 });
  });

  // ====== SLIDE 7: TECNOLOGIAS ======
  var s7 = prs.addSlide();
  s7.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: GREEN } });
  s7.addText('Stack Tecnologico', { x: 0.5, y: 0.2, w: 12, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });

  s7.addShape('roundRect', { x: 0.5, y: 1.3, w: 6, h: 0.45, fill: { color: '1D4ED8' }, rectRadius: 0.08 });
  s7.addText('Frontend', { x: 0.7, y: 1.33, w: 5, h: 0.4, fontSize: 14, bold: true, color: WHITE, fontFace: 'Arial' });
  s7.addText('HTML5\nCSS3 (Design System Customizado)\nJavaScript Vanilla (ES5)\nChart.js para graficos\nResponsive Design', { x: 0.7, y: 2.0, w: 5.5, h: 3, fontSize: 12, color: '555555', fontFace: 'Arial', bullet: true, paraSpaceAfter: 6 });

  s7.addShape('roundRect', { x: 6.8, y: 1.3, w: 6, h: 0.45, fill: { color: DARK }, rectRadius: 0.08 });
  s7.addText('Backend & Data', { x: 7, y: 1.33, w: 5, h: 0.4, fontSize: 14, bold: true, color: WHITE, fontFace: 'Arial' });
  s7.addText('Firebase Firestore\nlocalStorage (cache local)\nOffline Persistence\nSincronizacao automatica\nSeguranca Firebase Rules', { x: 7, y: 2.0, w: 5.5, h: 3, fontSize: 12, color: '555555', fontFace: 'Arial', bullet: true, paraSpaceAfter: 6 });

  s7.addShape('roundRect', { x: 0.5, y: 5.0, w: 12.3, h: 2, fill: { color: 'F3F4F6' }, rectRadius: 0.15 });
  s7.addText('Caracteristicas Tecnicas', { x: 0.7, y: 5.1, w: 11.5, h: 0.4, fontSize: 14, bold: true, color: DARK, fontFace: 'Arial' });
  s7.addText('Funciona totalmente offline (PWA)\nSincronizacao em tempo real com Firebase\nSem dependencias externas pesadas\nCompativel com navegadores modernos\nVA propaga automaticamente entre turmas do mesmo ano', { x: 0.7, y: 5.5, w: 11.5, h: 1.5, fontSize: 11, color: '555555', fontFace: 'Arial', bullet: true, paraSpaceAfter: 4 });

  // ====== SLIDE 8: DIFERENCIAIS ======
  var s8 = prs.addSlide();
  s8.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: GREEN } });
  s8.addText('Diferenciais do Projeto', { x: 0.5, y: 0.2, w: 12, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });

  var diffs2 = [
    ['Propagacao Automatica de VA', 'VA criada em uma turma se replica para as outras do mesmo ano'],
    ['Offline First', 'Funciona totalmente offline com sync automatico via Firebase'],
    ['Flexibilidade na Avaliacao', 'Diferentes tipos com valores maximos variaveis'],
    ['Analise Comparativa por VA', 'Dashboards por VA especifica, nao apenas geral'],
    ['Documentacao Integrada', 'Manual interativo na pagina de Configuracoes'],
    ['Persistencia de Dados', 'Backup automatico na nuvem, nunca perca dados']
  ];

  diffs2.forEach(function(d, i) {
    var col = i % 2;
    var row = Math.floor(i / 2);
    var dx = 0.5 + col * 6.4;
    var dy2 = 1.3 + row * 1.95;

    s8.addShape('roundRect', { x: dx, y: dy2, w: 6, h: 1.7, fill: { color: 'F3F4F6' }, rectRadius: 0.15 });
    s8.addText(d[0], { x: dx + 0.2, y: dy2 + 0.15, w: 5.6, h: 0.4, fontSize: 14, bold: true, color: DARK, fontFace: 'Arial' });
    s8.addText(d[1], { x: dx + 0.2, y: dy2 + 0.65, w: 5.6, h: 0.9, fontSize: 11, color: '6B7280', fontFace: 'Arial' });
  });

  // ====== SLIDE 9: CRONOGRAMA ======
  var s9 = prs.addSlide();
  s9.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: GREEN } });
  s9.addText('Cronograma de Desenvolvimento', { x: 0.5, y: 0.2, w: 12, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });

  var cronTbl = [
    [{ text: 'Fase', options: { bold: true, color: WHITE, fill: { color: DARK } } }, { text: 'Funcionalidades', options: { bold: true, color: WHITE, fill: { color: DARK } } }, { text: 'Status', options: { bold: true, color: WHITE, fill: { color: DARK } } }],
    ['1. Estrutura Base', 'Sidebar, Topbar, Layout, Design System', 'Concluido'],
    ['2. Gestao de Alunos', 'Cadastro, CSV, exclusao em lote', 'Concluido'],
    ['3. Sistema de VA', 'Criacao, normalizacao, propagacao', 'Concluido'],
    ['4. Prova Bimestral', 'Anglo (peso 1), Prova (peso 5)', 'Concluido'],
    ['5. Negativos', 'Registro, limite 100, penalizacao', 'Concluido'],
    ['6. Dashboards', 'VA por prova, PB comparativo', 'Concluido'],
    ['7. Firebase', 'Firestore, offline, sincronizacao', 'Concluido'],
    ['8. Boletim/Relatorios', 'Notas consolidadas, rankings', 'Concluido'],
    ['9. Documentacao', 'Manual interativo, configuracoes', 'Concluido']
  ];

  s9.addTable(cronTbl, { x: 0.5, y: 1.3, w: 12.3, border: { pt: 1, color: 'E5E7EB' }, fontSize: 11, fontFace: 'Arial' });

  // ====== SLIDE 10: RESULTADOS ======
  var s10 = prs.addSlide();
  s10.addShape('rect', { x: 0, y: 0, w: W, h: 1.0, fill: { color: GREEN } });
  s10.addText('Resultados Esperados', { x: 0.5, y: 0.2, w: 12, h: 0.6, fontSize: 36, bold: true, color: WHITE, fontFace: 'Arial' });

  s10.addText('Para o Professor:', { x: 0.5, y: 1.3, w: 6, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: 'Arial' });
  s10.addText('Reducao de tempo em digitacao\nEliminacao de erros de calculo\nVisao holistica do desempenho\nIdentificacao rapida de dificuldades\nAcesso remoto aos dados\nBackup automatico na nuvem', { x: 0.7, y: 1.9, w: 5.5, h: 4, fontSize: 12, color: '555555', fontFace: 'Arial', bullet: true, paraSpaceAfter: 8 });

  s10.addText('Para o Sistema Escolar:', { x: 6.8, y: 1.3, w: 6, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: 'Arial' });
  s10.addText('Padronizacao de processos\nMaior precisao nas avaliacoes\nDocumentacao automatica\nRelatorios gerenciais\nRastreabilidade completa\nConformidade e auditoria', { x: 7, y: 1.9, w: 5.5, h: 4, fontSize: 12, color: '555555', fontFace: 'Arial', bullet: true, paraSpaceAfter: 8 });

  // ====== SLIDE 11: CONCLUSAO ======
  var s11 = prs.addSlide();
  s11.background = { color: GREEN };
  s11.addText('Obrigado!', { x: 0, y: 2, w: W, h: 1, fontSize: 60, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
  s11.addText('picpay.de.i  -  Sistema de Gerenciamento Escolar', { x: 0, y: 3.3, w: W, h: 0.5, fontSize: 24, color: WHITE, align: 'center', fontFace: 'Arial' });
  s11.addText('Plataforma web responsiva\nFunciona offline e online\nDashboards inteligentes\nSincronizacao em nuvem\nDocumentacao completa', { x: 0, y: 4.3, w: W, h: 2.5, fontSize: 16, color: WHITE, align: 'center', fontFace: 'Arial', paraSpaceAfter: 6 });
  s11.addText('Prof. Aladdin  |  Ano Letivo 2026', { x: 0, y: 6.8, w: W, h: 0.4, fontSize: 12, color: WHITE, align: 'center', fontFace: 'Arial' });

  return prs.writeFile({ fileName: './APRESENTACAO_picpaydei.pptx' }).then(function() {
    console.log('PPTX gerado: APRESENTACAO_picpaydei.pptx');
  });
}

// ================================================
// EXECUTAR
// ================================================
Promise.all([generatePDF(), generatePPTX()]).then(function() {
  console.log('\nAmbos os arquivos foram gerados com sucesso!');
}).catch(function(err) {
  console.error('Erro:', err);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * Script para gerar apresentação PowerPoint (PPTX)
 * Requer: npm install pptxgen
 * Uso: node generate-pptx.js
 */

try {
  const PptxGenJS = require('pptxgenjs');
  const fs = require('fs');

  // Cores do projeto
  const GREEN = '#11C76F';
  const DARK = '#005542';
  const GRAY_LIGHT = '#F9FAFB';
  const GRAY_DARK = '#6B7280';
  const WHITE = '#FFFFFF';
  const RED = '#EF4444';

  const prs = new PptxGenJS();
  prs.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
  prs.layout = 'WIDE';
  prs.theme = { colors: [GREEN, DARK, WHITE, GRAY_LIGHT] };

  // Slide 1: Título
  let slide1 = prs.addSlide();
  slide1.background = { color: GREEN };
  slide1.addText('picpay.de.i', {
    x: 0, y: 2, w: '100%', h: 1,
    fontSize: 60, bold: true, color: WHITE, align: 'center'
  });
  slide1.addText('Sistema de Gerenciamento Escolar', {
    x: 0, y: 3.2, w: '100%', h: 0.6,
    fontSize: 32, color: WHITE, align: 'center', opacity: 0.95
  });
  slide1.addText('Uma solução moderna para acompanhamento de desempenho acadêmico', {
    x: 0, y: 4.2, w: '100%', h: 0.8,
    fontSize: 18, color: WHITE, align: 'center', opacity: 0.85
  });

  // Slide 2: O Desafio
  let slide2 = prs.addSlide();
  slide2.background = { color: GRAY_LIGHT };
  slide2.addText('O Desafio', {
    x: 0.5, y: 0.4, w: '100%', h: 0.6,
    fontSize: 44, bold: true, color: GREEN
  });

  const antes = [
    { text: 'Gestão manual de notas', bullet: true },
    { text: 'Cálculos complexos e sujeitos a erros', bullet: true },
    { text: 'Falta de visualização de dados', bullet: true },
    { text: 'Dificuldade em acompanhamento', bullet: true },
    { text: 'Sem acesso remoto ou backup', bullet: true }
  ];

  const depois = [
    { text: 'Plataforma integrada e intuitiva', bullet: true },
    { text: 'Cálculos automáticos e precisos', bullet: true },
    { text: 'Dashboards e relatórios visuais', bullet: true },
    { text: 'Acompanhamento em tempo real', bullet: true },
    { text: 'Sincronização com nuvem (Firebase)', bullet: true }
  ];

  slide2.addText('❌ Antes', {
    x: 0.5, y: 1.3, w: 5.5, h: 0.5,
    fontSize: 20, bold: true, color: DARK
  });
  slide2.addText(antes.map(i => i.text).join('\n'), {
    x: 0.7, y: 1.9, w: 5.3, h: 4.5,
    fontSize: 14, color: GRAY_DARK,
    bullets: true
  });

  slide2.addText('✅ Solução', {
    x: 7.3, y: 1.3, w: 5.5, h: 0.5,
    fontSize: 20, bold: true, color: DARK
  });
  slide2.addText(depois.map(i => i.text).join('\n'), {
    x: 7.5, y: 1.9, w: 5.3, h: 4.5,
    fontSize: 14, color: GRAY_DARK,
    bullets: true
  });

  // Slide 3: Características
  let slide3 = prs.addSlide();
  slide3.background = { color: GRAY_LIGHT };
  slide3.addText('Características Principais', {
    x: 0.5, y: 0.4, w: '100%', h: 0.6,
    fontSize: 44, bold: true, color: GREEN
  });

  const features = [
    { icon: '👥', title: 'Gerenciamento de Alunos', desc: 'Cadastro individual ou em lote. Controle de todas as turmas.' },
    { icon: '📝', title: 'VA - Verificações de Aprendizagem', desc: 'Múltiplas atividades com normalização automática.' },
    { icon: '📊', title: 'Prova Bimestral', desc: 'Anglo e Prova com pesos específicos.' },
    { icon: '⚠️', title: 'Sistema de Negativos', desc: 'Registro com penalização automática (até 100).' },
    { icon: '📈', title: 'Dashboards Comparativos', desc: 'Rankings e gráficos entre turmas.' },
    { icon: '☁️', title: 'Sincronização em Nuvem', desc: 'Firebase Firestore com offline persistence.' }
  ];

  let yPos = 1.3;
  features.forEach((f, i) => {
    if (i === 3) { yPos = 1.3; } // Reset for second column
    const xPos = i < 3 ? 0.5 : 6.7;
    if (i > 0 && i % 3 === 0) yPos = 1.3;
    else if (i > 0) yPos += 1.8;

    slide3.addText(f.icon + ' ' + f.title, {
      x: xPos, y: yPos, w: 5.8, h: 0.4,
      fontSize: 16, bold: true, color: DARK
    });
    slide3.addText(f.desc, {
      x: xPos, y: yPos + 0.5, w: 5.8, h: 0.8,
      fontSize: 12, color: GRAY_DARK
    });
  });

  // Slide 4: Fórmulas
  let slide4 = prs.addSlide();
  slide4.background = { color: GRAY_LIGHT };
  slide4.addText('Fórmulas de Cálculo', {
    x: 0.5, y: 0.4, w: '100%', h: 0.6,
    fontSize: 44, bold: true, color: GREEN
  });

  // Fórmula 1
  slide4.addText('Para Português e Produção de Texto:', {
    x: 0.5, y: 1.3, w: '100%', h: 0.4,
    fontSize: 16, bold: true, color: DARK
  });
  slide4.addShape('rect', {
    x: 1, y: 1.9, w: 11.3, h: 0.9,
    fill: { color: GREEN }, line: { type: 'none' }
  });
  slide4.addText('M = (PB×35 + Quali×30 + VA×35) / 100', {
    x: 1, y: 1.9, w: 11.3, h: 0.9,
    fontSize: 24, bold: true, color: WHITE, align: 'center', valign: 'middle',
    fontFace: 'Courier New'
  });

  // Fórmula 2
  slide4.addText('Para LEM (sem Prova Bimestral):', {
    x: 0.5, y: 3.1, w: '100%', h: 0.4,
    fontSize: 16, bold: true, color: DARK
  });
  slide4.addShape('rect', {
    x: 1, y: 3.7, w: 11.3, h: 0.9,
    fill: { color: GREEN }, line: { type: 'none' }
  });
  slide4.addText('M = (Quali×30 + VA×35) / 65', {
    x: 1, y: 3.7, w: 11.3, h: 0.9,
    fontSize: 24, bold: true, color: WHITE, align: 'center', valign: 'middle',
    fontFace: 'Courier New'
  });

  // Fórmula 3
  slide4.addText('Qualitativa Ajustada (com penalização de negativos):', {
    x: 0.5, y: 4.9, w: '100%', h: 0.4,
    fontSize: 16, bold: true, color: DARK
  });
  slide4.addShape('rect', {
    x: 1, y: 5.5, w: 11.3, h: 0.9,
    fill: { color: GREEN }, line: { type: 'none' }
  });
  slide4.addText('Quali Ajustada = Quali - (Negativos × 0.1)', {
    x: 1, y: 5.5, w: 11.3, h: 0.9,
    fontSize: 24, bold: true, color: WHITE, align: 'center', valign: 'middle',
    fontFace: 'Courier New'
  });

  // Slide 5: Estrutura
  let slide5 = prs.addSlide();
  slide5.background = { color: GRAY_LIGHT };
  slide5.addText('Estrutura Organizacional', {
    x: 0.5, y: 0.4, w: '100%', h: 0.6,
    fontSize: 44, bold: true, color: GREEN
  });

  // Turmas
  slide5.addText('Turmas por Ano:', {
    x: 0.5, y: 1.3, w: '100%', h: 0.4,
    fontSize: 16, bold: true, color: DARK
  });

  const turmas = [
    { num: '4', label: '6º Ano\n(6A, 6B, 6C, 6D)' },
    { num: '3', label: '8º Ano\n(8A, 8B, 8C)' },
    { num: '4', label: '9º Ano\n(9A, 9B, 9C, 9D)' }
  ];

  turmas.forEach((t, i) => {
    const x = 1.5 + (i * 3.8);
    slide5.addShape('rect', {
      x: x, y: 1.95, w: 3.3, h: 1.2,
      fill: { color: GREEN }, line: { type: 'none' }
    });
    slide5.addText(t.num, {
      x: x, y: 2, w: 3.3, h: 0.6,
      fontSize: 36, bold: true, color: WHITE, align: 'center'
    });
    slide5.addText(t.label, {
      x: x, y: 2.65, w: 3.3, h: 0.6,
      fontSize: 12, color: WHITE, align: 'center', valign: 'middle'
    });
  });

  // Matérias
  slide5.addText('Matérias por Série:', {
    x: 0.5, y: 3.5, w: '100%', h: 0.4,
    fontSize: 16, bold: true, color: DARK
  });

  const tableData = [
    [
      { text: 'Série', options: { fontSize: 14, bold: true, color: WHITE } },
      { text: 'Matérias', options: { fontSize: 14, bold: true, color: WHITE } },
      { text: 'Prova Bimestral', options: { fontSize: 14, bold: true, color: WHITE } }
    ],
    [
      { text: '6º Ano', options: { fontSize: 12 } },
      { text: 'LEM, Produção de Texto', options: { fontSize: 12 } },
      { text: 'Não', options: { fontSize: 12 } }
    ],
    [
      { text: '8º Ano', options: { fontSize: 12 } },
      { text: 'Português, Produção de Texto', options: { fontSize: 12 } },
      { text: 'Sim', options: { fontSize: 12 } }
    ],
    [
      { text: '9º Ano', options: { fontSize: 12 } },
      { text: 'LEM', options: { fontSize: 12 } },
      { text: 'Não', options: { fontSize: 12 } }
    ]
  ];

  slide5.addTable(tableData, {
    x: 1, y: 4.1, w: 11.3, h: 2.6,
    border: { pt: 1, color: GRAY_DARK },
    fill: { color: GREEN },
    rowH: [0.6, 0.5, 0.5, 0.5]
  });

  // Slide 6: Diferenciais
  let slide6 = prs.addSlide();
  slide6.background = { color: GRAY_LIGHT };
  slide6.addText('Diferenciais do Projeto', {
    x: 0.5, y: 0.4, w: '100%', h: 0.6,
    fontSize: 44, bold: true, color: GREEN
  });

  const diferenciais = [
    { emoji: '🔄', title: 'Propagação Automática de VA', desc: 'VA criada em uma turma se replica para as outras' },
    { emoji: '📱', title: 'Offline First', desc: 'Funciona totalmente offline com sync automático' },
    { emoji: '🎯', title: 'Flexibilidade na Avaliação', desc: 'Suporta diferentes tipos com valores variáveis' },
    { emoji: '📊', title: 'Análise Comparativa', desc: 'Dashboards comparativos entre turmas' },
    { emoji: '🔒', title: 'Persistência de Dados', desc: 'Backup automático na nuvem' },
    { emoji: '📚', title: 'Documentação Integrada', desc: 'Manual interativo com instruções passo a passo' }
  ];

  diferenciais.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + (col * 6.4);
    const y = 1.3 + (row * 1.8);

    slide6.addText(d.emoji + ' ' + d.title, {
      x: x, y: y, w: 6, h: 0.35,
      fontSize: 13, bold: true, color: DARK
    });
    slide6.addText(d.desc, {
      x: x, y: y + 0.45, w: 6, h: 0.7,
      fontSize: 11, color: GRAY_DARK
    });
  });

  // Slide 7: Tecnologias
  let slide7 = prs.addSlide();
  slide7.background = { color: GRAY_LIGHT };
  slide7.addText('Stack Tecnológico', {
    x: 0.5, y: 0.4, w: '100%', h: 0.6,
    fontSize: 44, bold: true, color: GREEN
  });

  slide7.addText('Frontend', {
    x: 0.5, y: 1.3, w: 6, h: 0.4,
    fontSize: 18, bold: true, color: DARK
  });

  slide7.addText(
    '• HTML5\n• CSS3 (Design System)\n• JavaScript Vanilla\n• Chart.js para gráficos\n• Responsive Design',
    {
      x: 0.7, y: 1.9, w: 5.8, h: 2.2,
      fontSize: 12, color: GRAY_DARK
    }
  );

  slide7.addText('Backend & Data', {
    x: 6.8, y: 1.3, w: 6, h: 0.4,
    fontSize: 18, bold: true, color: DARK
  });

  slide7.addText(
    '• Firebase Firestore\n• Autenticação Firebase\n• localStorage (cache)\n• Offline Persistence\n• Sincronização automática',
    {
      x: 7, y: 1.9, w: 5.8, h: 2.2,
      fontSize: 12, color: GRAY_DARK
    }
  );

  slide7.addText('Características Técnicas:', {
    x: 0.5, y: 4.3, w: '100%', h: 0.4,
    fontSize: 16, bold: true, color: DARK
  });

  slide7.addText(
    '✓ Progressive Web App (PWA)\n✓ Sincronização em tempo real\n✓ Sem dependências pesadas\n✓ Compatível com navegadores modernos\n✓ Segurança com Firebase Rules',
    {
      x: 0.7, y: 4.85, w: 12, h: 1.8,
      fontSize: 12, color: GRAY_DARK
    }
  );

  // Slide 8: Módulos
  let slide8 = prs.addSlide();
  slide8.background = { color: GRAY_LIGHT };
  slide8.addText('Módulos da Plataforma', {
    x: 0.5, y: 0.4, w: '100%', h: 0.6,
    fontSize: 44, bold: true, color: GREEN
  });

  const modulos = [
    { title: '📚 Alunos', items: ['Cadastro individual', 'Importação em massa', 'Cópia entre bimestres', 'Exclusão em lote'] },
    { title: '⚡ VA', items: ['Criação com tipos', 'Propagação automática', 'Normalização 0-10', 'Dashboard por VA'] },
    { title: '📋 Prova Bimestral', items: ['Anglo (peso 1)', 'Prova (peso 5)', 'Lançamento rápido', 'Dashboard comparativo'] },
    { title: '⚠️ Negativos', items: ['Registro por aluno', 'Limite de 100', 'Penalização automática', 'Histórico completo'] },
    { title: '📊 Boletim', items: ['Notas consolidadas', 'Média final', 'Status (verde/vermelho)', 'Exportação visual'] },
    { title: '📈 Relatórios', items: ['Filtragem flexível', 'Rankings por critério', 'Estatísticas gerais', 'Análise por turma'] }
  ];

  modulos.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + (col * 4.3);
    const y = 1.3 + (row * 2.7);

    slide8.addText(m.title, {
      x: x, y: y, w: 4, h: 0.35,
      fontSize: 12, bold: true, color: DARK
    });
    slide8.addText(m.items.join('\n'), {
      x: x, y: y + 0.45, w: 4, h: 1.8,
      fontSize: 10, color: GRAY_DARK,
      bullets: true
    });
  });

  // Slide 9: Cronograma
  let slide9 = prs.addSlide();
  slide9.background = { color: GRAY_LIGHT };
  slide9.addText('Cronograma de Desenvolvimento', {
    x: 0.5, y: 0.4, w: '100%', h: 0.6,
    fontSize: 44, bold: true, color: GREEN
  });

  const cronograma = [
    ['Fase', 'Funcionalidades', 'Status'],
    ['Fase 1: Estrutura Base', 'Sidebar, Topbar, Layout', '✓ Concluído'],
    ['Fase 2: Gestão de Alunos', 'Cadastro, CSV, exclusão', '✓ Concluído'],
    ['Fase 3: Sistema de VA', 'Criação, normalização', '✓ Concluído'],
    ['Fase 4: Prova Bimestral', 'Anglo, Prova, cálculos', '✓ Concluído'],
    ['Fase 5: Negativos', 'Registro, penalização', '✓ Concluído'],
    ['Fase 6: Dashboards', 'VA, PB, comparativos', '✓ Concluído'],
    ['Fase 7: Firebase', 'Firestore, sincronização', '✓ Concluído'],
    ['Fase 8: Boletim', 'Notas consolidadas', '✓ Concluído'],
    ['Fase 9: Documentação', 'Manual, configurações', '✓ Concluído']
  ];

  const cronogramaParsed = cronograma.map((row, idx) =>
    row.map(cell => ({
      text: cell,
      options: {
        fontSize: idx === 0 ? 11 : 9,
        bold: idx === 0,
        color: idx === 0 ? WHITE : GRAY_DARK
      }
    }))
  );

  slide9.addTable(cronogramaParsed, {
    x: 0.5, y: 1.3, w: 12.3, h: 5.2,
    border: { pt: 1, color: GRAY_DARK },
    fill: { color: idx === 0 ? GREEN : (idx % 2 === 0 ? '#f3f4f6' : WHITE) },
    align: 'center',
    valign: 'middle',
    rowH: [0.45, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4]
  });

  // Slide 10: Resultados
  let slide10 = prs.addSlide();
  slide10.background = { color: GRAY_LIGHT };
  slide10.addText('Resultados Esperados', {
    x: 0.5, y: 0.4, w: '100%', h: 0.6,
    fontSize: 44, bold: true, color: GREEN
  });

  slide10.addText('Para o Professor:', {
    x: 0.5, y: 1.3, w: 6, h: 0.4,
    fontSize: 16, bold: true, color: DARK
  });

  slide10.addText(
    '✓ Redução de tempo em digitação (50%)\n✓ Eliminação de erros de cálculo\n✓ Visão holística do desempenho\n✓ Identificação de alunos com dificuldade\n✓ Acesso remoto aos dados\n✓ Backup automático',
    {
      x: 0.7, y: 1.85, w: 5.8, h: 2.8,
      fontSize: 11, color: GRAY_DARK
    }
  );

  slide10.addText('Para o Sistema Escolar:', {
    x: 6.8, y: 1.3, w: 6, h: 0.4,
    fontSize: 16, bold: true, color: DARK
  });

  slide10.addText(
    '✓ Padronização de processos\n✓ Maior precisão nas avaliações\n✓ Documentação automática\n✓ Relatórios gerenciais\n✓ Rastreabilidade completa\n✓ Conformidade e auditoria',
    {
      x: 7, y: 1.85, w: 5.8, h: 2.8,
      fontSize: 11, color: GRAY_DARK
    }
  );

  // Slide 11: Conclusão
  let slide11 = prs.addSlide();
  slide11.background = { color: GREEN };
  slide11.addText('Obrigado!', {
    x: 0, y: 2, w: '100%', h: 1,
    fontSize: 60, bold: true, color: WHITE, align: 'center'
  });
  slide11.addText('picpay.de.i - Sistema de Gerenciamento Escolar', {
    x: 0, y: 3.2, w: '100%', h: 0.6,
    fontSize: 28, color: WHITE, align: 'center', opacity: 0.95
  });

  const finalFeatures = [
    '🌐 Plataforma web responsiva',
    '📱 Funciona offline e online',
    '📊 Dashboards inteligentes',
    '☁️ Sincronização em nuvem',
    '📚 Documentação completa'
  ];

  slide11.addText(finalFeatures.join('\n'), {
    x: 0, y: 4.2, w: '100%', h: 2,
    fontSize: 16, color: WHITE, align: 'center'
  });

  // Salvar apresentação
  const outputPath = './APRESENTACAO.pptx';
  prs.writeFile({ fileName: outputPath });
  console.log('✓ Apresentação PowerPoint gerada com sucesso: ' + outputPath);

} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error('❌ Erro: A biblioteca pptxgen não está instalada.');
    console.error('Para usar este script, execute:');
    console.error('  npm install pptxgenjs');
    console.error('E depois:');
    console.error('  node generate-pptx.js');
    process.exit(1);
  } else {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

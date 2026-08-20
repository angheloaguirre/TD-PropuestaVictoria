(function () {
  'use strict';

  /* ============================================================
     DATA — Roadmap (from Elévate 3.14-LEAN, Fase 4)
     Week span is inclusive: [start, end] over S1..S8
     ============================================================ */
  var STREAM_A = [
    { phase: 'Fase 1 — Descubrimiento y diagnóstico', label: 'Diagnóstico AS-IS', start: 1, end: 2 },
    { phase: 'Fase 1 — Descubrimiento y diagnóstico', label: 'Inventario herramientas', start: 1, end: 1 },
    { phase: 'Fase 1 — Descubrimiento y diagnóstico', label: 'Clasificación herramientas', start: 2, end: 2 },
    { phase: 'Fase 2 — Diseño del modelo objetivo', label: 'Diseño estándar PI', start: 2, end: 3 },
    { phase: 'Fase 2 — Diseño del modelo objetivo', label: 'Repositorio oficial', start: 2, end: 3 },
    { phase: 'Fase 3 — Construcción del MVP digital', label: 'Migración herramientas piloto', start: 3, end: 4 },
    { phase: 'Fase 3 — Construcción del MVP digital', label: 'Catálogo PI', start: 4, end: 5 },
    { phase: 'Fase 4 — Validación y escalamiento', label: 'Validación usuarios', start: 5, end: 6 },
    { phase: 'Fase 4 — Validación y escalamiento', label: 'Medición resultados', start: 6, end: 7 },
    { phase: 'Fase 4 — Validación y escalamiento', label: 'Roadmap siguiente fase', start: 8, end: 8 }
  ];

  var STREAM_B = [
    { phase: 'Fase 2 — Diseño del modelo objetivo', label: 'Revisión arquitectura propuesta', start: 1, end: 2 },
    { phase: 'Fase 2 — Diseño del modelo objetivo', label: 'Validación seguridad', start: 1, end: 1 },
    { phase: 'Fase 2 — Diseño del modelo objetivo', label: 'Definición arquitectura Azure objetivo', start: 2, end: 3 },
    { phase: 'Fase 3 — Construcción del MVP digital', label: 'Solicitud/habilitación de ambientes', start: 3, end: 4 },
    { phase: 'Fase 3 — Construcción del MVP digital', label: 'Piloto aplicación core', start: 4, end: 6 },
    { phase: 'Fase 4 — Validación y escalamiento', label: 'Evaluación técnica y definición evolución', start: 6, end: 8 }
  ];

  var WEEKS = 8;

  function buildGanttHTML(rows, variantClass, groupLabel) {
    var html = '';
    html += '<div class="gantt-row gantt-row--head">' +
      '<div class="gantt-phase">Fase metodológica</div>' +
      '<div class="gantt-label">' + groupLabel + '</div>';
    for (var w = 1; w <= WEEKS; w++) {
      html += '<div class="gantt-week">S' + w + '</div>';
    }
    html += '</div>';

    rows.forEach(function (row, index) {
      html += '<div class="gantt-row">';
      var previous = rows[index - 1];
      var phaseContinues = previous && previous.phase === row.phase;
      html += '<div class="gantt-phase' + (phaseContinues ? ' gantt-phase--continuation' : '') + '">' +
        (phaseContinues ? '' : row.phase) + '</div>';
      html += '<div class="gantt-label">' + row.label + '</div>';
      for (var w = 1; w <= WEEKS; w++) {
        var active = w >= row.start && w <= row.end;
        var cellHTML = '';
        if (active) {
          var cls = 'gantt-bar ' + variantClass;
          if (w === row.start) cls += ' gantt-bar--start';
          if (w === row.end) cls += ' gantt-bar--end';
          cellHTML = '<div class="' + cls + '"></div>';
        }
        html += '<div class="gantt-week">' + cellHTML + '</div>';
      }
      html += '</div>';
    });
    return html;
  }

  function renderGantt() {
    var ganttA = document.getElementById('ganttA');
    var ganttB = document.getElementById('ganttB');
    var ganttFull = document.getElementById('ganttFull');

    if (ganttA) ganttA.innerHTML = buildGanttHTML(STREAM_A, 'gantt-bar--a', 'Actividad · Stream A');
    if (ganttB) ganttB.innerHTML = buildGanttHTML(STREAM_B, 'gantt-bar--b', 'Actividad · Stream B');

    if (ganttFull) {
      var combined = STREAM_A.map(function (r) { return { phase: r.phase, label: r.label, start: r.start, end: r.end, variant: 'gantt-bar--a' }; })
        .concat(STREAM_B.map(function (r) { return { phase: r.phase, label: r.label, start: r.start, end: r.end, variant: 'gantt-bar--b' }; }));

      var html = '<div class="gantt-row gantt-row--head"><div class="gantt-phase">Fase metodológica</div><div class="gantt-label">Actividad</div>';
      for (var w = 1; w <= WEEKS; w++) html += '<div class="gantt-week">S' + w + '</div>';
      html += '</div>';

      // Stream A group
      html += buildGroupHeader('Stream A — Transformación interna PI');
      combined.filter(function (r) { return r.variant === 'gantt-bar--a'; }).forEach(function (row, index, rows) {
        html += buildFullRow(row, index, rows);
      });

      // Stream B group
      html += buildGroupHeader('Stream B — Habilitación tecnológica TI');
      combined.filter(function (r) { return r.variant === 'gantt-bar--b'; }).forEach(function (row, index, rows) {
        html += buildFullRow(row, index, rows);
      });

      ganttFull.innerHTML = html;
    }
  }

  function buildGroupHeader(text) {
    var html = '<div class="gantt-row gantt-row--phase"><div class="gantt-phase"></div><div class="gantt-label">' + text + '</div>';
    for (var w = 1; w <= WEEKS; w++) html += '<div class="gantt-week"></div>';
    html += '</div>';
    return html;
  }

  function buildFullRow(row, index, rows) {
    var previous = rows[index - 1];
    var phaseContinues = previous && previous.phase === row.phase;
    var html = '<div class="gantt-row"><div class="gantt-phase' + (phaseContinues ? ' gantt-phase--continuation' : '') + '">' +
      (phaseContinues ? '' : row.phase) + '</div><div class="gantt-label">' + row.label + '</div>';
    for (var w = 1; w <= WEEKS; w++) {
      var active = w >= row.start && w <= row.end;
      var cell = '';
      if (active) {
        var cls = 'gantt-bar ' + row.variant;
        if (w === row.start) cls += ' gantt-bar--start';
        if (w === row.end) cls += ' gantt-bar--end';
        cell = '<div class="' + cls + '"></div>';
      }
      html += '<div class="gantt-week">' + cell + '</div>';
    }
    html += '</div>';
    return html;
  }

  /* ============================================================
     ECOSYSTEM DIAGRAM — shared markup (main + teaser)
     ============================================================ */
  function ecosystemMarkup() {
    return '' +
      '<div class="eco-node eco-node--user"><span class="eco-node-title">Usuario PI</span></div>' +
      '<div class="eco-connector eco-connector--single"></div>' +
      '<div class="eco-node eco-node--portal"><span class="eco-node-title">Portal / Catálogo PI</span></div>' +
      '<div class="eco-connector eco-connector--branch"></div>' +
      '<div class="eco-branches">' +
        '<div class="eco-branch"><span class="eco-branch-title">Herramientas ligeras</span>' +
          '<ul><li>HTML / CSS / JS</li><li>Procesamiento local</li><li>PDF / JSON</li></ul></div>' +
        '<div class="eco-branch eco-branch--accent"><span class="eco-branch-title">Aplicaciones core</span>' +
          '<ul><li>Frontend Web</li><li>Backend / API</li><li>Azure SQL</li></ul></div>' +
        '<div class="eco-branch"><span class="eco-branch-title">IA Generativa</span>' +
          '<ul><li>Recomendación</li><li>Automatización</li><li>Asistencia</li></ul></div>' +
      '</div>';
  }

  function renderTeaser() {
    var teaser = document.getElementById('ecosystemTeaser');
    if (teaser) teaser.innerHTML = '<div class="ecosystem">' + ecosystemMarkup() + '</div>';
  }

  /* ============================================================
     NAVIGATION
     ============================================================ */
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
  var subnavEl = document.getElementById('subnav');
  var crumbsEl = document.getElementById('crumbs');

  var PHASE_TITLES = {
    inicio: 'Inicio',
    fase1: 'Fase 1 · Definición estratégica',
    fase2: 'Fase 2 · Modelo de transformación',
    fase3: 'Fase 3 · Metodología',
    fase4: 'Fase 4 · Roadmap'
  };

  function humanizeSub(id) {
    return id.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function buildSubnav(panelId) {
    var panel = document.querySelector('.panel[data-panel="' + panelId + '"]');
    if (!panel) { subnavEl.innerHTML = ''; return; }
    var blocks = Array.prototype.slice.call(panel.querySelectorAll('[data-sub]'));
    if (!blocks.length) { subnavEl.innerHTML = ''; return; }

    subnavEl.innerHTML = blocks.map(function (b) {
      return '<button class="subnav-item" data-sub-target="' + b.id + '">' + humanizeSub(b.getAttribute('data-sub')) + '</button>';
    }).join('');

    var subButtons = Array.prototype.slice.call(subnavEl.querySelectorAll('.subnav-item'));
    subButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-sub-target');
        var target = document.getElementById(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function setActivePanel(panelId, subId) {
    panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-panel') === panelId); });
    navItems.forEach(function (n) { n.classList.toggle('is-active', n.getAttribute('data-target') === panelId && !n.classList.contains('nav-item--ghost')); });
    crumbsEl.innerHTML = '<span class="crumb-phase">' + (PHASE_TITLES[panelId] || panelId) + '</span>';
    buildSubnav(panelId);
    document.getElementById('content').scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    if (subId) {
      window.setTimeout(function () {
        var target = document.querySelector('.panel[data-panel="' + panelId + '"] [data-sub="' + subId + '"]');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          highlightSubnav(target.id);
        }
      }, 60);
    }
    closeSidebarOnMobile();
  }

  function highlightSubnav(id) {
    var items = Array.prototype.slice.call(subnavEl.querySelectorAll('.subnav-item'));
    items.forEach(function (i) { i.classList.toggle('is-active', i.getAttribute('data-sub-target') === id); });
  }

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = item.getAttribute('data-target');
      var sub = item.getAttribute('data-sub');
      setActivePanel(target, sub || null);
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-goto]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActivePanel(btn.getAttribute('data-goto'), btn.getAttribute('data-sub') || null);
    });
  });

  /* Scroll-spy within active panel to highlight subnav item */
  var contentEl = document.getElementById('content');
  var spyTimer = null;
  window.addEventListener('scroll', function () {
    if (spyTimer) return;
    spyTimer = window.setTimeout(function () {
      spyTimer = null;
      var activePanel = document.querySelector('.panel.is-active');
      if (!activePanel) return;
      var blocks = Array.prototype.slice.call(activePanel.querySelectorAll('[data-sub]'));
      var current = null;
      blocks.forEach(function (b) {
        var rect = b.getBoundingClientRect();
        if (rect.top <= 160) current = b.id;
      });
      if (current) highlightSubnav(current);
    }, 80);
  }, { passive: true });

  /* ============================================================
     MOBILE SIDEBAR
     ============================================================ */
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');
  var menuBtn = document.getElementById('menuBtn');
  var closeBtn = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-visible');
  }
  function closeSidebar() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
  }
  function closeSidebarOnMobile() {
    if (window.innerWidth <= 860) closeSidebar();
  }
  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* ============================================================
     ACCORDION (Fase 3 — Fases operativas)
     ============================================================ */
  var accordionItems = Array.prototype.slice.call(document.querySelectorAll('.accordion-item'));
  accordionItems.forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      accordionItems.forEach(function (i) { i.classList.remove('is-open'); });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ============================================================
     INIT
     ============================================================ */
  renderTeaser();
  renderGantt();
  buildSubnav('inicio');
})();

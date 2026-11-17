// app.js — Main application controller
// ABAP Code Studio — Created by jeffrypurwanto

// ───────────────────────────────────────────────────────────
// State
// ───────────────────────────────────────────────────────────
let editor = null;
let files  = [];   // { id, name, code, modified }
let activeFileId = null;
const interpreter = new ABAPInterpreter();

const STORAGE_KEY = 'abap_studio_files';

// ───────────────────────────────────────────────────────────
// Bootstrap
// ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initEditor();
  loadFiles();
  renderSidebar();
  renderFilesGrid();
  renderSnippets('all');
  renderDocs();
  renderLearn();
  initTablesView();
  setSapScreenEnabled(sapScreenEnabled());
  setAssistEnabled(assistEnabled());

  // If no files, create a starter
  if (!files.length) {
    createFileWithCode('Z_HELLO_WORLD', TEMPLATES.hello);
  } else {
    openFile(files[0].id);
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveFile(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCode(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); newFile(); }
    if (e.shiftKey && e.key === 'F1') { e.preventDefault(); prettyPrinter(); }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F10') { e.preventDefault(); runUnitTests(); }
    if (e.key === 'F8') { e.preventDefault(); openSelectionScreen(); }
  });
});

// ───────────────────────────────────────────────────────────
// Templates
// ───────────────────────────────────────────────────────────
const TEMPLATES = {
  empty: `REPORT z_new_program.\n\n`,
  hello: `REPORT z_hello_world.

WRITE: / 'Hello, ABAP World!'.
WRITE: / 'Welcome to ABAP Code Studio'.`,
  alv: `REPORT z_alv_flights.

* OO ALV Grid Report (CL_SALV_TABLE)
DATA: gt_sflight TYPE TABLE OF sflight,
      lo_alv     TYPE REF TO cl_salv_table.

START-OF-SELECTION.

* Fetch data from SFLIGHT dummy table
SELECT * FROM sflight INTO TABLE @gt_sflight.

* Instantiate and display SAP ALV Grid
cl_salv_table=>factory(
  IMPORTING
    r_salv_table = lo_alv
  CHANGING
    t_table      = gt_sflight ).

lo_alv->display( ).`,
  reuse_alv: `REPORT z_reuse_alv_airlines.

* Classic ALV Grid Report (REUSE_ALV_GRID_DISPLAY)
DATA: gt_scarr TYPE TABLE OF scarr.

START-OF-SELECTION.

SELECT carrid, carrname, currcode, url
  FROM scarr
  INTO TABLE @gt_scarr.

CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
  EXPORTING
    i_structure_name = 'SCARR'
  TABLES
    t_outtab         = gt_scarr.`,
  alv_fieldcat: `REPORT z_alv_fieldcat.

* Classic ALV with a manual field catalog
TYPES: BEGIN OF ty_mara,
         matnr TYPE mara-matnr,
         ersda TYPE mara-ersda,
         ernam TYPE mara-ernam,
         mtart TYPE mara-mtart,
         mbrsh TYPE mara-mbrsh,
       END OF ty_mara.

DATA: gt_data     TYPE STANDARD TABLE OF ty_mara,
      gt_fieldcat TYPE slis_t_fieldcat_alv,
      gs_fieldcat TYPE slis_fieldcat_alv,
      gs_layout   TYPE slis_layout_alv.

PARAMETERS: p_max TYPE i DEFAULT 50.

START-OF-SELECTION.
  SELECT matnr ersda ernam mtart mbrsh
    FROM mara
    UP TO p_max ROWS
    INTO TABLE gt_data.

  PERFORM add_field USING 'MATNR' 'Material Number'.
  PERFORM add_field USING 'ERSDA' 'Created On'.
  PERFORM add_field USING 'ERNAM' 'Created By'.
  PERFORM add_field USING 'MTART' 'Material Type'.
  PERFORM add_field USING 'MBRSH' 'Industry Sector'.

  gs_layout-zebra = 'X'.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program = sy-repid
      i_grid_title       = 'Material List'
      is_layout          = gs_layout
      it_fieldcat        = gt_fieldcat
    TABLES
      t_outtab           = gt_data
    EXCEPTIONS
      program_error      = 1
      OTHERS             = 2.

  IF sy-subrc <> 0.
    MESSAGE 'The ALV could not be displayed' TYPE 'E'.
  ENDIF.

* Add one column to the field catalog
FORM add_field USING pv_field TYPE c
                     pv_text  TYPE c.
  CLEAR gs_fieldcat.
  gs_fieldcat-fieldname = pv_field.
  gs_fieldcat-seltext_m = pv_text.
  APPEND gs_fieldcat TO gt_fieldcat.
ENDFORM.`,
  function: `REPORT z_function_demo.

* Calling a function module: EXPORTING = data passed in, IMPORTING = results,
* EXCEPTIONS = errors mapped to sy-subrc
DATA: lv_kunnr TYPE kunnr VALUE '1000',
      lv_out   TYPE kunnr,
      lv_last  TYPE d,
      lv_day   TYPE c.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
  EXPORTING
    input  = lv_kunnr
  IMPORTING
    output = lv_out.
WRITE: / 'ALPHA input :', lv_kunnr, '->', lv_out.

CALL FUNCTION 'RP_LAST_DAY_OF_MONTHS'
  EXPORTING
    day_in            = '20240210'
  IMPORTING
    last_day_of_month = lv_last
  EXCEPTIONS
    day_in_no_date    = 1
    OTHERS            = 2.
IF sy-subrc = 0.
  WRITE: / 'Month end   :', lv_last.
ENDIF.

CALL FUNCTION 'DATE_COMPUTE_DAY'
  EXPORTING
    date = '20241101'
  IMPORTING
    day  = lv_day.
WRITE: / 'Day number  :', lv_day, '(1 = Monday ... 7 = Sunday)'.`,
  select: `REPORT z_select_scarr.

* Declare the internal table & work area
DATA: gt_scarr TYPE TABLE OF scarr,
      gs_scarr TYPE scarr.

* Airline filter parameter
PARAMETERS: p_carrid TYPE scarr-carrid DEFAULT 'AA'.

START-OF-SELECTION.

* Open SQL SELECT from the sample table SCARR
SELECT carrid, carrname, currcode, url
  FROM scarr
  INTO TABLE @gt_scarr
  WHERE carrid = @p_carrid.

END-OF-SELECTION.

IF gt_scarr IS NOT INITIAL.
  WRITE: / 'Airline search result:'.
  ULINE.
  LOOP AT gt_scarr INTO gs_scarr.
    WRITE: / gs_scarr-carrid,
             gs_scarr-carrname,
             gs_scarr-currcode,
             gs_scarr-url.
  ENDLOOP.
ELSE.
  WRITE: / 'No airline found for this ID.'.
ENDIF.`,
  report: `REPORT z_my_report.

DATA: lv_title TYPE string VALUE 'My Report'.

WRITE: / lv_title.
ULINE.
WRITE: / 'Report executed successfully.'.`,
  loop: `REPORT z_loop_demo.

DATA: lv_total TYPE i VALUE 0.

DO 10 TIMES.
  ADD sy-index TO lv_total.
  WRITE: / 'Step', sy-index, '| Total:', lv_total.
ENDDO.

WRITE: / '---'.
WRITE: / 'Final Total:', lv_total.`,
  table: `REPORT z_table_demo.

TYPES: BEGIN OF ty_item,
         id   TYPE i,
         name TYPE string,
       END OF ty_item.

DATA: lt_items TYPE TABLE OF ty_item,
      ls_item  TYPE ty_item.

ls_item-id = 1. ls_item-name = 'Apple'.  APPEND ls_item TO lt_items.
ls_item-id = 2. ls_item-name = 'Banana'. APPEND ls_item TO lt_items.
ls_item-id = 3. ls_item-name = 'Cherry'. APPEND ls_item TO lt_items.

WRITE: / 'Items:'.
LOOP AT lt_items INTO ls_item.
  WRITE: / sy-tabix, '|', ls_item-name.
ENDLOOP.`,
  class: `REPORT z_oo_demo.

CLASS lcl_greeter DEFINITION.
  PUBLIC SECTION.
    METHODS: greet IMPORTING iv_name TYPE string.
  PRIVATE SECTION.
    DATA: mv_prefix TYPE string VALUE 'Hello'.
ENDCLASS.

CLASS lcl_greeter IMPLEMENTATION.
  METHOD greet.
    DATA: lv_msg TYPE string.
    CONCATENATE mv_prefix ',' iv_name '!' INTO lv_msg SEPARATED BY ' '.
    WRITE: / lv_msg.
  ENDMETHOD.
ENDCLASS.

DATA: lo_greeter TYPE REF TO lcl_greeter.
CREATE OBJECT lo_greeter.
lo_greeter->greet( iv_name = 'ABAP World' ).`
};

// ───────────────────────────────────────────────────────────
// CodeMirror editor
// ───────────────────────────────────────────────────────────
function initEditor() {
  editor = CodeMirror(document.getElementById('codeEditor'), {
    mode: 'abap',
    theme: 'studio',
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: true,
    indentUnit: 2,
    tabSize: 2,
    extraKeys: {
      'Ctrl-Space': cm => (window.ABAP_ASSIST ? ABAP_ASSIST.show(cm, true) : undefined),
      'Ctrl-/': 'toggleComment',
      Tab: cm => {
        if (cm.somethingSelected()) cm.indentSelection('add');
        else cm.replaceSelection('  ', 'end');
      }
    }
  });
  // suggestions, code templates, block closers (abap-complete.js)
  if (window.ABAP_ASSIST) {
    ABAP_ASSIST.enabled = assistEnabled();
    ABAP_ASSIST.attach(editor);
  }

  let autosaveTimer = null;
  editor.on('change', () => {
    if (loadingFile || !activeFileId) return;       // opening a file is not an edit
    const f = files.find(x => x.id === activeFileId);
    if (!f) return;
    f.code = editor.getValue();
    if (!f.modified) { f.modified = true; markTabModified(activeFileId, true); }
    // keep the work safe: write to localStorage shortly after the last keystroke
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      f.modified = false;
      saveFiles();
      markTabModified(f.id, false);
    }, 1200);
  });
}

// ── code completion switch (⋯ menu). Off: no automatic suggestions or block closers; Ctrl+Space still works.
const ASSIST_KEY = 'abap_studio_assist';
function assistEnabled() {
  try { return localStorage.getItem(ASSIST_KEY) !== '0'; } catch { return true; }
}
function setAssistEnabled(on) {
  try { localStorage.setItem(ASSIST_KEY, on ? '1' : '0'); } catch { /* storage unavailable */ }
  if (window.ABAP_ASSIST) ABAP_ASSIST.enabled = !!on;
  const box = document.getElementById('assistToggle');
  if (box) box.checked = !!on;
}

// ───────────────────────────────────────────────────────────
// File management (localStorage)
// ───────────────────────────────────────────────────────────
function loadFiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    files = raw ? JSON.parse(raw) : [];
  } catch { files = []; }
}

function saveFiles() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function createFileWithCode(name, code) {
  const id = genId();
  files.push({ id, name: name.toUpperCase(), code, modified: false, created: new Date().toISOString() });
  saveFiles();
  renderSidebar();
  renderFilesGrid();
  openFile(id);
}

// ───────────────────────────────────────────────────────────
// UI: view switching
// ───────────────────────────────────────────────────────────
function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${name}`)?.classList.add('active');
  document.querySelector(`[data-view="${name}"]`)?.classList.add('active');
  if (name === 'editor') setTimeout(() => editor?.refresh(), 50);
}

// ───────────────────────────────────────────────────────────
// UI: Sidebar
// ───────────────────────────────────────────────────────────
function renderSidebar() {
  const list = document.getElementById('fileList');
  if (!list) return;
  list.innerHTML = files.length ? '' : `<li style="padding:12px 10px;color:var(--text-dim);font-size:12px;">${tr('side.empty')}</li>`;
  for (const f of files) {
    const li = document.createElement('li');
    li.className = 'file-item' + (f.id === activeFileId ? ' active' : '');
    li.innerHTML = `
      <span class="file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
      <span class="file-name" title="${f.name}">${f.name}${f.modified ? ' •' : ''}</span>
      <span class="file-delete" onclick="deleteFile('${f.id}',event)">✕</span>
    `;
    li.addEventListener('click', () => openFile(f.id));
    list.appendChild(li);
  }
}

// ───────────────────────────────────────────────────────────
// UI: Editor Tabs
// ───────────────────────────────────────────────────────────
let openTabs = []; // ids of open tabs

function ensureTab(id) {
  if (!openTabs.includes(id)) openTabs.push(id);
  renderTabs();
}

function renderTabs() {
  const container = document.getElementById('editorTabs');
  container.innerHTML = '';
  for (const id of openTabs) {
    const f = files.find(x => x.id === id);
    if (!f) continue;
    const div = document.createElement('div');
    div.className = 'editor-tab' + (id === activeFileId ? ' active' : '');
    div.title = f.name;
    div.innerHTML = `<span class="tab-name">${escHtml(f.name)}${f.modified ? ' •' : ''}</span><span class="tab-close" onclick="closeTab('${id}',event)">✕</span>`;
    div.addEventListener('click', (e) => { if (!e.target.classList.contains('tab-close')) openFile(id); });
    container.appendChild(div);
  }
  // the bar scrolls sideways when many programs are open: keep the active one visible
  const active = container.querySelector('.editor-tab.active');
  if (active) {
    const left = active.offsetLeft - container.offsetLeft, right = left + active.offsetWidth;
    if (left < container.scrollLeft) container.scrollLeft = Math.max(0, left - 8);
    else if (right > container.scrollLeft + container.clientWidth - 28) container.scrollLeft = right - container.clientWidth + 36;
  }
  container.classList.toggle('scrolled', container.scrollLeft > 0);
  if (!container.dataset.fade) {
    container.dataset.fade = '1';
    container.addEventListener('scroll', () => container.classList.toggle('scrolled', container.scrollLeft > 0));
    // a mouse wheel moves the tab bar sideways
    container.addEventListener('wheel', e => {
      if (!e.deltaX && container.scrollWidth > container.clientWidth) { container.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive: false });
  }
}

function closeTab(id, e) {
  e?.stopPropagation();
  openTabs = openTabs.filter(x => x !== id);
  if (activeFileId === id) {
    activeFileId = openTabs[openTabs.length - 1] || null;
    if (activeFileId) openFile(activeFileId);
    else {
      setEditorCode('');
      document.getElementById('tabInfo').textContent = 'untitled.abap';
      renderSidebar();
    }
  }
  renderTabs();
}

function markTabModified(id, modified) {
  renderTabs();
  renderSidebar();
}

// ───────────────────────────────────────────────────────────
// File operations
// ───────────────────────────────────────────────────────────
let loadingFile = false;   // true while a file is being put into the editor (not a user edit)

function setEditorCode(code) {
  loadingFile = true;
  try {
    editor?.setValue(code || '');
    editor?.clearHistory();
  } finally {
    loadingFile = false;
  }
}

function openFile(id) {
  const f = files.find(x => x.id === id);
  if (!f) return;
  activeFileId = id;
  ensureTab(id);
  setEditorCode(f.code);
  document.getElementById('tabInfo').textContent = f.name + '.abap';
  renderSidebar();
  switchView('editor');
}

function saveFile() {
  if (!editor) return;
  // code typed while no program is open: keep it as a new program instead of losing it
  if (!activeFileId || !files.find(x => x.id === activeFileId)) {
    const code = editor.getValue();
    if (!code.trim()) return;
    const m = /^\s*(?:REPORT|PROGRAM)\s+([A-Za-z0-9_]+)/im.exec(code);
    createFileWithCode(m ? m[1] : 'Z_PROGRAM', code);
    toast(tr('toast.saved'), 'success');
    return;
  }
  const f = files.find(x => x.id === activeFileId);
  f.code = editor.getValue();
  f.modified = false;
  saveFiles();
  renderSidebar();
  renderTabs();
  renderFilesGrid();
  toast(tr('toast.saved'), 'success');
}

function newFile() {
  document.getElementById('newFileName').value = '';
  document.getElementById('newFileTemplate').value = 'hello';
  document.getElementById('newFileModal').classList.add('open');
  setTimeout(() => document.getElementById('newFileName').focus(), 100);
}

function createNewFile() {
  let name = document.getElementById('newFileName').value.trim() || 'Z_PROGRAM';
  name = name.toUpperCase().replace(/[^A-Z0-9_\-]/g, '_');
  if (!name.startsWith('Z') && !name.startsWith('Y')) name = 'Z_' + name;
  const tmpl = document.getElementById('newFileTemplate').value;
  const code = (TEMPLATES[tmpl] || TEMPLATES.empty).replace('z_new_program', name.toLowerCase()).replace('Z_NEW_PROGRAM', name);
  closeModal('newFileModal');
  createFileWithCode(name, code);
  toast(tr('toast.created', { name }), 'success');
}

function deleteFile(id, e) {
  e?.stopPropagation();
  const f = files.find(x => x.id === id);
  if (!f) return;
  if (!confirm(tr('files.confirm', { name: f.name }))) return;
  files = files.filter(x => x.id !== id);
  openTabs = openTabs.filter(x => x !== id);
  if (activeFileId === id) {
    activeFileId = files[0]?.id || null;
    if (activeFileId) openFile(activeFileId);
    else {
      setEditorCode('');
      document.getElementById('tabInfo').textContent = 'untitled.abap';
    }
  }
  saveFiles();
  renderSidebar();
  renderTabs();
  renderFilesGrid();
  toast(tr('toast.deleted', { name: f.name }), 'info');
}

// ───────────────────────────────────────────────────────────
// Run / Syntax check
// ───────────────────────────────────────────────────────────
let lastResult = null;       // { output, errors, title } of the last run; callbacks append to the same arrays
const SAP_SCREEN_KEY = 'abap_studio_sap_screen';

// params: values typed into the selection screen (PARAMETERS / SELECT-OPTIONS name -> value)
function runCode(params) {
  const code = editor?.getValue() || '';
  // the Run button in the editor bar
  const btn  = document.querySelector('.editor-toolbar .run-btn');
  if (btn) { btn.classList.add('running'); const rl = btn.querySelector('.run-label'); if (rl) rl.textContent = tr('bar.running'); }

  setTimeout(() => {
    const result = interpreter.run(code, { params: params || {} });

    // Show syntax-check findings together with the runtime messages, so a learner
    // sees them without opening the Syntax Check tab. Runtime messages are more
    // specific, so a syntax finding on the same line is dropped.
    const syntaxIssues = interpreter.checkSyntax(code);
    const runtimeLines = new Set(result.errors.map(e => e.line));
    for (const s of syntaxIssues) {
      if ((s.type === 'error' || s.type === 'warning') && !runtimeLines.has(s.line)) result.errors.push(s);
    }
    result.errors.sort((a, b) => (a.fatal ? 1 : 0) - (b.fatal ? 1 : 0) || a.line - b.line);

    const file = files.find(x => x.id === activeFileId);
    lastResult = { output: result.output, errors: result.errors, stats: result.stats, title: interpreter.programName || (file ? file.name : 'Program') };
    alvGrids = [];
    // Everything (WRITE list, ALV grids, messages) is shown in the Output panel and, like the list screen
    // after F8 in SAP, in a wide result window. That window is opened first: renderOutput fills it only
    // while it is open, so a result is not built a second time for a window nobody looks at.
    if (sapScreenEnabled() && (result.output.length || result.errors.length)) document.getElementById('sapScreen')?.classList.add('open');
    renderOutput();
    renderVariables(result.variables);
    renderSyntaxIssues(syntaxIssues);
    switchPanel('output', document.querySelector('.panel-tab'));

    if (btn) {
      btn.classList.remove('running');
      const rl = btn.querySelector('.run-label'); if (rl) rl.textContent = tr('bar.run');
    }
  }, 80);
}

// A list longer than this is cut on the page (the program still ran to its end): a loop that never stops
// writes up to 100 000 lines, and that many elements freeze a phone for seconds. Same for the rows of a grid.
const OUTPUT_LIMIT = 2000;
const ALV_ROW_LIMIT = 1000;
let sapBodyStale = false;      // the result window has not got the current result yet (it was closed)

// Build the result once and show it in the Output panel and, while it is open, in the SAP-style result screen
function renderOutput(scrollToEnd) {
  const sapBody = document.getElementById('sapBody');
  const sapOpen = !!document.getElementById('sapScreen')?.classList.contains('open');
  const targets = [document.getElementById('outputBody'), sapOpen ? sapBody : null].filter(Boolean);
  sapBodyStale = !sapOpen;
  if (!sapOpen && sapBody) sapBody.innerHTML = '';
  const result = lastResult || { output: [], errors: [] };
  const report = result.tests ? unitReportHtml(result.tests) : '';
  const stats = statsHtml(result.stats);

  let html;
  if (!result.output.length && !result.errors.length) {
    html = (report || `<div class="output-empty">${tr('out.empty')}</div>`) + stats;
    alvGrids = [];
  } else {
    // keep sort / filter / selected column of grids that are already on screen
    const prev = new Map(alvGrids.map(g => [g.alvId, g]));
    alvGrids = [];
    const selectable = !!(interpreter.blocks && interpreter.blocks['AT LINE-SELECTION']);
    const lines = [];
    const total = result.output.length;
    result.output.slice(0, OUTPUT_LIMIT).forEach((line, i) => {
      if (line.type === 'alv') {
        // ALV grids are rendered inline, in the order the program produced them
        alvGrids.push(prev.get(line.alvId) || newAlvState(line));
        lines.push(alvBlockHtml(alvGrids.length - 1));
        return;
      }
      const pick = selectable && line.cls === 'info' && String(line.text).trim() !== ''
        ? ` data-selectable="1" ondblclick="listLineSelect(${i})" title="${tr('out.linesel.tip')}"` : '';
      lines.push(`<div class="output-line ${line.cls || 'info'}"${pick}>${escHtml(msgOut(line.text)) || '&nbsp;'}</div>`);
    });
    if (total > OUTPUT_LIMIT) lines.push(`<div class="output-more">${tr('out.more', { n: (total - OUTPUT_LIMIT).toLocaleString(I18N.locale), limit: OUTPUT_LIMIT.toLocaleString(I18N.locale) })}</div>`);
    if (result.errors.length) {
      lines.push(`<div class="output-messages"><div class="output-messages-title">${tr('out.messages')}</div>`);
      for (const e of result.errors) {
        const icon = e.fatal ? `<strong>${tr('out.runtime')}</strong> ·` : '';
        const where = e.line ? `<a class="output-goto" onclick="gotoLine(${Number(e.line)})" title="${tr('out.goto.tip')}">${tr('out.line', { n: Number(e.line) })}</a>: ` : '';
        lines.push(`<div class="output-line ${e.type === 'warning' ? 'warning' : 'error'}">${icon} ${where}${escHtml(msgTr(e.msg))}</div>`);
      }
      lines.push(`</div>`);
    }
    if (!result.output.length && !report) lines.unshift(`<div class="output-empty">${tr('out.empty')}</div>`);
    html = report + lines.join('') + stats;
  }

  for (const el of targets) el.innerHTML = html;
  alvGrids.forEach((_, idx) => drawAlvTable(idx));
  for (const el of targets) el.scrollTop = scrollToEnd ? el.scrollHeight : 0;
  updateSapScreenChrome();
}

// Database accesses of the last run, and SELECT statements that were executed again and again inside a loop
function statsHtml(st) {
  if (!st || (!st.dbReads && !st.dbWrites)) return '';
  const parts = [];
  if (st.dbReads) parts.push(tr('perf.reads', { n: st.dbReads, rows: st.dbRows }));
  if (st.dbWrites) parts.push(tr('perf.writes', { n: st.dbWrites }));
  let html = `<div class="output-stats"><span class="output-stats-title">${tr('perf.title')}</span>${parts.join(' · ')}</div>`;
  for (const r of st.repeated || []) {
    html += `<div class="output-stats warn"><a class="output-goto" onclick="gotoLine(${Number(r.line)})" title="${tr('out.goto.tip')}">${tr('out.line', { n: Number(r.line) })}</a>: ${tr('perf.repeated', { n: r.count })}</div>`;
  }
  return html;
}

// Result of the unit tests: one line per test method, the failed checks below it
function unitReportHtml(tests) {
  if (!tests.classes.length) return `<div class="output-empty">${tr('unit.none')}</div>`;
  const failed = tests.failed;
  let html = `<div class="unit-report"><div class="unit-summary ${failed ? 'fail' : 'ok'}">${failed ? tr('unit.summary.fail', { f: failed, n: tests.total }) : tr('unit.summary.ok', { n: tests.total })}</div>`;
  for (const c of tests.classes) {
    html += `<div class="unit-class">${escHtml(c.name.toLowerCase())}</div>`;
    for (const m of c.methods) {
      html += `<div class="unit-test ${m.ok ? 'ok' : 'fail'}"><span class="unit-mark">${m.ok ? '✓' : '✕'}</span><a class="unit-name" onclick="gotoLine(${Number(m.line) || 0})">${escHtml(m.name.toLowerCase())}</a><span class="unit-info">${m.ok ? tr('unit.asserts', { n: m.asserts }) : ''}</span></div>`;
      for (const fl of m.failures) {
        let what;
        if (fl.kind === 'assert') {
          what = `<code>${escHtml(fl.assert.toLowerCase())}</code>` + (fl.msg ? ` — ${escHtml(fl.msg)}` : '') +
            (fl.hasExp ? ` · ${tr('unit.expected', { exp: `<code>${escHtml(fl.exp)}</code>`, act: `<code>${escHtml(fl.act)}</code>` })}` : '');
        } else if (fl.kind === 'exception') {
          what = `${tr('unit.exception', { cls: `<code>${escHtml(fl.cls)}</code>` })} — ${escHtml(msgTr(fl.text))}`;
        } else if (fl.kind === 'stopped') {
          what = tr('unit.stopped');
        } else if (fl.kind === 'noimpl') {
          what = tr('unit.noimpl');
        } else {
          what = escHtml(msgTr(fl.text));
        }
        const where = fl.line ? `<a class="output-goto" onclick="gotoLine(${Number(fl.line)})" title="${tr('out.goto.tip')}">${tr('out.line', { n: Number(fl.line) })}</a>: ` : '';
        html += `<div class="unit-fail">${where}${what}</div>`;
      }
    }
  }
  return html + '</div>';
}

// Run the test classes of the program (CLASS ... DEFINITION FOR TESTING) — Ctrl+Shift+F10, as in SAP
function runUnitTests() {
  const code = editor?.getValue() || '';
  const res = interpreter.runUnitTests(code);
  const file = files.find(x => x.id === activeFileId);
  lastResult = { output: res.output, errors: res.errors, stats: res.stats, tests: res.tests, title: interpreter.programName || (file ? file.name : 'Program') };
  alvGrids = [];
  renderOutput();
  renderVariables(res.variables);
  switchPanel('output', document.querySelector('.panel-tab'));
}

function gotoLine(line) {
  if (!editor || !line) return;
  closeSapScreen();
  editor.setCursor({ line: line - 1, ch: 0 });
  editor.scrollIntoView({ line: line - 1, ch: 0 }, 80);
  editor.focus();
}

// A list line was double-clicked: run AT LINE-SELECTION (interactive list)
function listLineSelect(outputIndex) {
  const res = interpreter.lineSelect(outputIndex);
  if (!res) return;
  renderOutput(true);
  renderVariables(interpreter.variables);
}

// ── SAP-style result screen (wide window, like the list / ALV screen in SAP GUI) ──
function sapScreenEnabled() {
  try { return localStorage.getItem(SAP_SCREEN_KEY) !== '0'; } catch { return true; }
}

function setSapScreenEnabled(on) {
  try { localStorage.setItem(SAP_SCREEN_KEY, on ? '1' : '0'); } catch { /* storage unavailable */ }
  const box = document.getElementById('sapScreenToggle');
  if (box) box.checked = !!on;
}

function openSapScreen() {
  const el = document.getElementById('sapScreen');
  if (!el) return;
  if (!lastResult) { toast(tr('toast.runfirst'), 'info'); return; }
  el.classList.add('open');
  if (sapBodyStale) {
    // the window was closed when the result was built: build it now, and leave the Output panel where it was scrolled to
    const panel = document.getElementById('outputBody'), at = panel ? panel.scrollTop : 0;
    renderOutput();
    if (panel) panel.scrollTop = at;
  } else updateSapScreenChrome();
}

function closeSapScreen() {
  document.getElementById('sapScreen')?.classList.remove('open');
}

// Title bar and status bar of the result screen
function updateSapScreenChrome() {
  const title = document.getElementById('sapTitle'), status = document.getElementById('sapStatus');
  if (!title || !status || !lastResult) return;
  title.textContent = lastResult.title || 'Program';
  // status bar: the last MESSAGE of the program, otherwise a summary
  const out = lastResult.output;
  const msg = [...out].reverse().find(o => o.type !== 'alv' && /^📢 MESSAGE /.test(String(o.text)));
  const fatal = lastResult.errors.find(e => e.fatal);
  const errors = lastResult.errors.filter(e => e.type === 'error' && !e.fatal).length;
  const warnings = lastResult.errors.filter(e => e.type === 'warning').length;
  let text, cls = 'ok';
  if (fatal) { text = `${tr('out.runtime')}: ${msgTr(fatal.msg)}`; cls = 'err'; }
  else if (msg) { text = String(msg.text).replace(/^📢 MESSAGE (\w): /, '$1: '); cls = msg.cls === 'error' ? 'err' : msg.cls === 'warning' ? 'warn' : 'ok'; }
  else {
    const grids = out.filter(o => o.type === 'alv').length;
    text = tr('sap.st.lines', { n: out.length - grids }) + (grids ? tr('sap.st.grids', { n: grids }) : '');
  }
  if (errors || warnings) text += '   ·   ' + tr('sap.st.issues', { e: errors, w: warnings });
  status.textContent = text;
  status.className = `sap-status-text ${errors && cls === 'ok' ? 'warn' : cls}`;
}

function renderVariables(vars) {
  const container = document.getElementById('variablesResult');
  const entries   = Object.entries(vars).filter(([k]) => !k.startsWith('SY-'));
  if (!entries.length) {
    container.innerHTML = `<div class="output-placeholder"><p>${tr('vars.none')}</p></div>`;
    return;
  }
  const rows = entries.map(([k, v]) => {
    let val;
    try {
      val = Array.isArray(v.value) ? tr('vars.rows', { n: v.value.length }) :
            (typeof v.value === 'object' && v.value ? JSON.stringify(v.value) : String(v.value ?? ''));
      if (Array.isArray(v.value) && v.header !== undefined) val += ` + header line ${JSON.stringify(v.header)}`;
    } catch { val = '[object]'; }
    return `<tr>
      <td class="var-name">${escHtml(k)}</td>
      <td class="var-type">${escHtml(v.type)}</td>
      <td class="var-val">${escHtml(val)}</td>
    </tr>`;
  }).join('');
  container.innerHTML = `<table class="var-table">
    <thead><tr><th>${tr('vars.name')}</th><th>${tr('vars.type')}</th><th>${tr('vars.value')}</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function clearOutput() {
  lastResult = null;
  alvGrids = [];
  document.getElementById('outputBody').innerHTML = `
    <div class="output-placeholder">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
      <p>${tr('ph.run')}</p>
    </div>`;
  const sap = document.getElementById('sapBody');
  if (sap) sap.innerHTML = '';
  closeSapScreen();
}

function checkSyntax() {
  const code   = editor?.getValue() || '';
  const issues = interpreter.checkSyntax(code);
  renderSyntaxIssues(issues);
}

let lastSyntaxIssues = [];
function renderSyntaxIssues(issues) {
  lastSyntaxIssues = issues;
  const container = document.getElementById('syntaxResult');
  const html = issues.map(iss => `
    <div class="syntax-item">
      <span class="syntax-badge ${iss.type}">${iss.type}</span>
      <div class="syntax-desc">
        <div class="syn-msg">${escHtml(msgTr(iss.msg))}</div>
        ${iss.line ? `<div class="syn-line"><a class="output-goto" onclick="gotoLine(${Number(iss.line)})">${tr('out.line', { n: Number(iss.line) })}</a></div>` : ''}
      </div>
    </div>
  `).join('');
  container.innerHTML = html;
}

// ───────────────────────────────────────────────────────────
// Panel switching (Output / Syntax / Variables)
// ───────────────────────────────────────────────────────────
function switchPanel(name, btn) {
  document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.panel-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(`panel-${name}`)?.classList.add('active');
  btn?.classList.add('active');
  if (name === 'syntax') checkSyntax();
}

// ───────────────────────────────────────────────────────────
// Theme
// ───────────────────────────────────────────────────────────
// Theme of the whole app: 'dark' (ink) or 'light' (paper). The editor theme "studio"
// takes its colours from the same CSS tokens, so it follows automatically.
function currentTheme() {
  try { return localStorage.getItem('abap_studio_theme') === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; }
}
function changeTheme(theme) {
  theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('abap_studio_theme', theme); } catch (e) { /* private mode */ }
  document.querySelectorAll('#themeSwitch button').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
  editor?.refresh();
}
document.addEventListener('DOMContentLoaded', () => changeTheme(currentTheme()));

// ───────────────────────────────────────────────────────────
// Overflow menu of the editor bar (⋯)
// ───────────────────────────────────────────────────────────
function toggleMoreMenu(e) {
  e?.stopPropagation();
  document.getElementById('moreMenu')?.classList.toggle('open');
}

function closeMoreMenu() {
  document.getElementById('moreMenu')?.classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest?.('.menu-wrap')) closeMoreMenu();
});

// ───────────────────────────────────────────────────────────
// Files Grid (Files view)
// ───────────────────────────────────────────────────────────
function renderFilesGrid() {
  const grid = document.getElementById('filesGrid');
  if (!grid) return;
  if (!files.length) {
    grid.innerHTML = `<div style="color:var(--text-muted);padding:20px;">${tr('files.empty')}</div>`;
    return;
  }
  grid.innerHTML = files.map(f => {
    const date = new Date(f.created || Date.now()).toLocaleDateString(I18N.locale);
    const lines = (f.code || '').split('\n').length;
    return `
      <div class="file-card" onclick="openFile('${f.id}');switchView('editor')">
        <div class="file-card-actions">
          <button class="file-card-btn del" onclick="deleteFile('${f.id}',event)" title="${tr('files.delete')}">✕</button>
        </div>
        <div class="file-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
        <div class="file-card-name">${f.name}</div>
        <div class="file-card-meta">${tr('files.meta', { n: lines, date })}</div>
      </div>`;
  }).join('');
}

// ───────────────────────────────────────────────────────────
// Snippets
// ───────────────────────────────────────────────────────────
let currentSnippetFilter = 'all';

function renderSnippets(cat) {
  currentSnippetFilter = cat;
  const grid = document.getElementById('snippetsGrid');
  if (!grid) return;
  const list = cat === 'all' ? ABAP_SNIPPETS : ABAP_SNIPPETS.filter(s => s.category === cat);
  grid.innerHTML = list.map(s => `
    <div class="snippet-card" onclick="insertSnippet('${s.id}')">
      <div class="snippet-header">
        <span class="snippet-title">${escHtml(contentFor('snippets', s).title)}</span>
        <span class="snippet-category cat-${s.category}">${tr('cat.' + s.category)}</span>
      </div>
      <div class="snippet-desc">${escHtml(contentFor('snippets', s).desc)}</div>
      <div class="snippet-code">${escHtml(s.code)}</div>
    </div>`).join('');
}

function filterSnippets(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');
  renderSnippets(cat);
}

function insertSnippet(id) {
  const s = ABAP_SNIPPETS.find(x => x.id === id);
  if (!s) return;
  // open the snippet as a program of its own — never overwrite the program being edited
  const name = `Z_${s.id.toUpperCase()}`;
  const existing = files.find(f => f.name === name);
  if (existing) openFile(existing.id);
  else createFileWithCode(name, s.code);
  switchView('editor');
  toast(existing ? tr('toast.snip.open', { name }) : tr('toast.snip.new', { title: contentFor('snippets', s).title, name }), 'success');
}

// ───────────────────────────────────────────────────────────
// Docs
// ───────────────────────────────────────────────────────────
let activeDocId = null;

function renderDocs() {
  const nav     = document.getElementById('docsNav');
  const content = document.getElementById('docsContent');
  if (!nav || !content) return;

  nav.innerHTML = ABAP_DOCS.map(d =>
    `<div class="docs-nav-item${d.id === (activeDocId || ABAP_DOCS[0].id) ? ' active' : ''}"
      onclick="showDoc('${d.id}')">${escHtml(contentFor('docs', d).title)}</div>`
  ).join('');

  showDoc(activeDocId || ABAP_DOCS[0].id);
}

function showDoc(id) {
  activeDocId = id;
  const doc = ABAP_DOCS.find(d => d.id === id);
  if (!doc) return;
  const dt = contentFor('docs', doc);   // translated title/content (falls back to ID)
  document.getElementById('docsContent').innerHTML = i18nNotice(isContentTranslated('docs', doc.id, 'content')) + dt.content;
  document.querySelectorAll('.docs-nav-item').forEach(el => {
    el.classList.toggle('active', el.textContent === dt.title);
  });
}

// ───────────────────────────────────────────────────────────
// Learning path (Belajar): levels → lessons, progress in localStorage
// ───────────────────────────────────────────────────────────
const PROGRESS_KEY = 'abap_studio_progress';
let activeLessonId = null;
let lessonsDone = {};

function loadProgress() {
  try { lessonsDone = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch { lessonsDone = {}; }
}

function saveProgress() {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(lessonsDone)); } catch { /* storage unavailable */ }
}

function lessonList() {
  return window.ABAP_LESSONS || [];
}

function renderLearn() {
  const nav = document.getElementById('learnNav');
  if (!nav || !lessonList().length) return;
  loadProgress();
  if (!activeLessonId) {
    // continue with the first lesson that is not done yet
    activeLessonId = (lessonList().find(l => !lessonsDone[l.id]) || lessonList()[0]).id;
  }
  renderLearnNav();
  showLesson(activeLessonId);
}

function renderLearnNav() {
  const nav = document.getElementById('learnNav');
  const lessons = lessonList();
  const levels = window.ABAP_LEVELS || [];
  nav.innerHTML = levels.map(lv => {
    const items = lessons.filter(l => l.level === lv.id);
    const done = items.filter(l => lessonsDone[l.id]).length;
    return `<div class="learn-level">
        <div class="learn-level-title"><span class="learn-level-badge lvl-${lv.id}">${tr('learn.level', { n: lv.id })}</span> ${escHtml(tr('level.' + lv.id))} <span class="learn-level-count">${done}/${items.length}</span></div>
        ${items.map(l => `<div class="docs-nav-item learn-item${l.id === activeLessonId ? ' active' : ''}${lessonsDone[l.id] ? ' done' : ''}" onclick="showLesson('${l.id}')">
            <span class="learn-check">${lessonsDone[l.id] ? '✓' : '○'}</span>${escHtml(contentFor('lessons', l).title)}
          </div>`).join('')}
      </div>`;
  }).join('');

  const total = lessons.length, doneAll = lessons.filter(l => lessonsDone[l.id]).length;
  const fill = document.getElementById('learnProgressFill');
  const text = document.getElementById('learnProgressText');
  if (fill) fill.style.width = `${total ? Math.round(doneAll / total * 100) : 0}%`;
  if (text) text.textContent = tr('learn.progress', { done: doneAll, total });
}

function showLesson(id) {
  const lessons = lessonList();
  const idx = lessons.findIndex(l => l.id === id);
  if (idx === -1) return;
  const l = lessons[idx];
  activeLessonId = id;
  const lt = contentFor('lessons', l);   // translated title/goal/body/task (falls back to ID)
  const level = (window.ABAP_LEVELS || []).find(v => v.id === l.level) || { name: '' };
  const prev = lessons[idx - 1], next = lessons[idx + 1];

  document.getElementById('learnContent').innerHTML = `${i18nNotice(isContentTranslated('lessons', l.id, 'body'))}
    <div class="learn-meta"><span class="learn-level-badge lvl-${l.level}">${tr('learn.level', { n: l.level })} · ${escHtml(tr('level.' + l.level))}</span> ${tr('learn.pos', { i: idx + 1, n: lessons.length })}</div>
    <h3>${escHtml(lt.title)}</h3>
    <p class="learn-goal"><strong>${tr('learn.goal')}</strong> ${escHtml(lt.goal)}</p>
    ${lt.body}
    <h4>${tr('learn.example')}</h4>
    <code>${escHtml(l.code)}</code>
    <div class="learn-actions">
      <button class="run-btn" onclick="tryLesson('${l.id}', false)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        ${escHtml(tr('learn.open'))}
      </button>
      <button class="btn-secondary" onclick="tryLesson('${l.id}', true)" title="${tr('learn.reset.tip')}">${tr('learn.reset')}</button>
    </div>
    ${lt.task ? `<div class="learn-task"><div class="learn-task-title">${tr('learn.task')}</div>${lt.task}</div>` : ''}
    <div class="learn-footer">
      ${prev ? `<button class="btn-secondary" onclick="showLesson('${prev.id}')">← ${escHtml(contentFor('lessons', prev).title)}</button>` : '<span></span>'}
      <button class="btn-secondary learn-done-btn${lessonsDone[l.id] ? ' is-done' : ''}" onclick="toggleLessonDone('${l.id}')">${lessonsDone[l.id] ? tr('learn.done') : tr('learn.mark')}</button>
      ${next ? `<button class="btn-secondary" onclick="showLesson('${next.id}')">${escHtml(contentFor('lessons', next).title)} →</button>` : '<span></span>'}
    </div>`;
  renderLearnNav();
  const page = document.querySelector('#view-learn .page-container');
  if (page) page.scrollTop = 0;
}

function toggleLessonDone(id) {
  if (lessonsDone[id]) delete lessonsDone[id]; else lessonsDone[id] = true;
  saveProgress();
  showLesson(id);
}

// Open the lesson's program in the editor (keeps the learner's own edits unless reset) and run it
function tryLesson(id, reset) {
  const l = lessonList().find(x => x.id === id);
  if (!l) return;
  const suffix = id.toUpperCase().replace(/[^A-Z0-9]/g, '_');
  const name = `Z_LEARN_${suffix}`;
  // a file opened before the programs got English names keeps the learner's edits
  const existing = files.find(f => f.name === name) || files.find(f => f.name === `Z_BELAJAR_${suffix}`);
  if (existing) {
    if (reset) { existing.code = l.code; existing.modified = false; saveFiles(); }
    openFile(existing.id);
  } else {
    createFileWithCode(name, l.code);
  }
  setTimeout(() => runCode(), 120);
}

// ───────────────────────────────────────────────────────────
// Modal
// ───────────────────────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMoreMenu();
    const modals = document.querySelectorAll('.modal-overlay.open');
    if (modals.length) modals.forEach(m => m.classList.remove('open'));
    else closeSapScreen();
  }
  // F3 = Back, as in SAP GUI
  if (e.key === 'F3' && document.getElementById('sapScreen')?.classList.contains('open')) { e.preventDefault(); closeSapScreen(); }
});
document.querySelectorAll?.('.modal-overlay')?.forEach(m => {
  m?.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ───────────────────────────────────────────────────────────
// Toast
// ───────────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ───────────────────────────────────────────────────────────
// Utilities
// ───────────────────────────────────────────────────────────
document.addEventListener('langchange', () => {
  if (!editor) return;                                 // translations that arrive before the start: the start draws everything
  const guard = fn => { try { fn(); } catch (e) {} };
  guard(() => I18N.apply());
  guard(() => renderSidebar());
  guard(() => renderTabs());
  guard(() => renderOutput());
  guard(() => { if (lastResult && interpreter.variables) renderVariables(interpreter.variables); });
  guard(() => { if (lastSyntaxIssues) renderSyntaxIssues(lastSyntaxIssues); });
  guard(() => renderFilesGrid());
  guard(() => renderSnippets(currentSnippetFilter));
  guard(() => { renderLearnNav(); if (activeLessonId) showLesson(activeLessonId); });
  guard(() => renderDocs());
  guard(() => { const sel = document.getElementById('dbTableSelect'); const cur = currentDbTable; initTablesView(); if (sel && cur) { sel.value = cur; currentDbTable = cur; filterCurrentTableData(); } });
  guard(() => { if (document.getElementById('sapScreen')?.classList.contains('open')) updateSapScreenChrome(); });
});

// Simulator messages are produced in Indonesian by the interpreter and translated when shown
// (messages-i18n.js); without that file, or for Indonesian, the text is used as it is.
const msgTr = s => (window.MSG_I18N ? MSG_I18N.message(s) : String(s == null ? '' : s));
// (the pictograms the interpreter puts in front of its notes are not shown)
const msgOut = s => (window.MSG_I18N ? MSG_I18N.output(s) : String(s == null ? '' : s)).replace(/^(?:\u{1F4E2}|\u26D4|\u26A0|\u23F3)\uFE0F?\s*/u, '');

// Has item `id` of `type` got a translated `field` for the current language?
function isContentTranslated(type, id, field) {
  const lang = (window.I18N && I18N.lang) || 'id';
  if (lang === 'id') return true;
  const C = window.ABAP_CONTENT_I18N;
  const e = C && C[type] && C[type][lang] && C[type][lang][id];
  return !!(e && e[field]);
}

// Banner telling the learner that this particular text is still Indonesian-only.
// Suppressed when the language is Indonesian or when the shown text is translated.
function i18nNotice(translated) {
  if (translated) return '';
  const msg = (typeof tr === 'function') ? tr('content.notice') : '';
  return msg ? `<div class="i18n-notice">${msg}</div>` : '';
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Make modal overlay clicks work (delegated)
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ───────────────────────────────────────────────────────────
// SAP Database Tables (SE16N Browser)
// ───────────────────────────────────────────────────────────
let currentDbTable = 'SCARR';

function initTablesView() {
  const select = document.getElementById('dbTableSelect');
  if (!select) return;
  const db = window.ABAP_DB || {};
  const schema = window.ABAP_DB_SCHEMA || {};
  select.innerHTML = Object.keys(db).map(k => {
    const s = schema[k] || { desc: k };
    const count = (db[k] || []).length;
    return `<option value="${k}">${k} — ${s.desc} (${tr('tables.rows', { n: count })})</option>`;
  }).join('');

  renderDbTable('SCARR');
}

function onSelectDbTable(tableName) {
  currentDbTable = tableName;
  const search = document.getElementById('tableSearchInput');
  if (search) search.value = '';
  renderDbTable(tableName);
}

function filterCurrentTableData() {
  const search = document.getElementById('tableSearchInput')?.value || '';
  renderDbTable(currentDbTable, search);
}

function renderDbTable(tableName, filterTerm = '') {
  const container = document.getElementById('dbGridContainer');
  const badge = document.getElementById('tableStatsBadge');
  if (!container) return;

  const db = window.ABAP_DB || {};
  const rows = db[tableName] || [];
  const schema = window.ABAP_DB_SCHEMA?.[tableName];

  let filtered = rows;
  if (filterTerm.trim()) {
    const term = filterTerm.toLowerCase();
    filtered = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(term)));
  }

  const cols = schema?.fields || (rows.length ? Object.keys(rows[0]) : []);

  if (badge) {
    badge.textContent = tr('tables.badge', { f: filtered.length, n: rows.length, c: cols.length });
  }

  if (!filtered.length) {
    container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--text-muted);">${tr('tables.nomatch', { term: escHtml(filterTerm) })}</div>`;
    return;
  }

  const thHtml = cols.map(c => `<th>${c}</th>`).join('');
  const trHtml = filtered.map(row => {
    const tds = cols.map((col, idx) => {
      const val = row[col] !== undefined ? row[col] : '';
      const isKey = idx <= 1;
      const isNum = typeof val === 'number';
      const cls = isKey ? 'db-col-key' : (isNum ? 'db-col-num' : 'db-col-val');
      return `<td class="${cls}">${escHtml(String(val))}</td>`;
    }).join('');
    return `<tr>${tds}</tr>`;
  }).join('');

  container.innerHTML = `<table class="db-table">
    <thead><tr>${thHtml}</tr></thead>
    <tbody>${trHtml}</tbody>
  </table>`;
}

function generateSelectFromCurrentTable() {
  const tableName = currentDbTable || 'SCARR';
  const schema = window.ABAP_DB_SCHEMA?.[tableName];
  const fields = (schema?.fields || ['*']).slice(1, 5).map(f => f.toLowerCase()).join(', ');
  const itabName = `gt_${tableName.toLowerCase()}`;
  const waName   = `gs_${tableName.toLowerCase()}`;
  const keyField = (schema?.fields || ['id'])[1].toLowerCase();

  const code = `REPORT z_select_${tableName.toLowerCase()}.

* Query simulated SAP table ${tableName}
DATA: ${itabName} TYPE TABLE OF ${tableName.toLowerCase()},
      ${waName}   TYPE ${tableName.toLowerCase()}.

START-OF-SELECTION.

SELECT ${fields}
  FROM ${tableName.toLowerCase()}
  INTO TABLE @${itabName}.

END-OF-SELECTION.

IF ${itabName} IS NOT INITIAL.
  WRITE: / 'Data from table ${tableName}:'.
  ULINE.
  LOOP AT ${itabName} INTO ${waName}.
    WRITE: / sy-tabix, '|', ${waName}-${keyField}.
  ENDLOOP.
ELSE.
  WRITE: / 'No data found.'.
ENDIF.`;

  createFileWithCode(`Z_SELECT_${tableName}`, code);
  switchView('editor');
  toast(tr('toast.select', { table: tableName }), 'success');
}

// ───────────────────────────────────────────────────────────
// ALV grids — rendered inline in the Output panel and in the SAP result screen
// ───────────────────────────────────────────────────────────
let alvGrids = [];   // one state object per ALV grid of the last run

// SAP icon codes that programs put into status columns
// toolbar icons of an ALV block
const ALV_SVG = {
  up: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="6 11 12 5 18 11"/></svg>',
  down: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="6 13 12 19 18 13"/></svg>',
  download: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
};

const ALV_ICONS = {
  '@08@': '🟢', '@09@': '🟡', '@0A@': '🔴', '@5B@': '🟢', '@5C@': '🔴', '@5D@': '🟡',
  '@01@': '✔', '@02@': '✖', '@03@': '⚠', '@0S@': 'ℹ', '@0V@': '✔', '@0W@': '✖', '@1A@': '⚠', '@EB@': '🔒', '@06@': '🔓'
};

function newAlvState(alvObj) {
  const columns = alvObj.columns || [];
  // colDefs come from the field catalog (label, key, do_sum, outputlen ...)
  const colDefs = alvObj.colDefs && alvObj.colDefs.length
    ? alvObj.colDefs
    : columns.map((c, i) => ({ field: c, label: c, key: i === 0 }));
  const data = alvObj.data || [];
  return {
    alvId: alvObj.alvId,
    tableName: alvObj.tableName || 'OUTTAB',
    mode: alvObj.mode || 'ALV',
    title: alvObj.title || '',
    header: alvObj.header || null,
    onDouble: !!alvObj.onDouble,
    onHotspot: !!alvObj.onHotspot,
    colDefs,
    zebra: !!(alvObj.layout && alvObj.layout.zebra),
    data,
    filtered: [...data],
    filter: '',
    selCol: null,          // column selected by clicking its header (target of the toolbar buttons)
    sortCol: null,
    sortDir: 'asc',
    showTotals: colDefs.some(c => c.doSum)
  };
}

function alvCell(row, field) {
  if (row === null || typeof row !== 'object') return '';
  const v = row[field] ?? row[field.toLowerCase()];
  return v === undefined || v === null ? '' : v;
}

// Cell text the way SAP shows it: 1.234,50 / 31.12.2024 / 13:45:00 / status icons
function alvFormat(val, col) {
  if (typeof val === 'number') {
    const dec = col && col.decimals ? col.decimals : (Number.isInteger(val) ? 0 : undefined);
    return val.toLocaleString('id-ID', dec === undefined ? { maximumFractionDigits: 3 } : { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  const s = String(val);
  if (col && col.type === 'date' && /^\d{8}$/.test(s)) return /^0+$/.test(s) ? '' : `${s.slice(6, 8)}.${s.slice(4, 6)}.${s.slice(0, 4)}`;
  if (col && col.type === 'time' && /^\d{6}$/.test(s)) return `${s.slice(0, 2)}:${s.slice(2, 4)}:${s.slice(4, 6)}`;
  if (ALV_ICONS[s]) return ALV_ICONS[s];
  return s;
}

function alvBlockHtml(idx) {
  const g = alvGrids[idx];
  const title = g.title || `${g.mode}: ${g.tableName}`;
  const hint = g.onDouble || g.onHotspot
    ? `<span class="alv-hint">${tr('alv.hint')} ${g.onHotspot ? tr('alv.hint.hot') : ''}${g.onHotspot && g.onDouble ? tr('alv.hint.or') : ''}${g.onDouble ? tr('alv.hint.dbl') : ''}</span>` : '';
  // header lines written by the TOP_OF_PAGE callback (REUSE_ALV_COMMENTARY_WRITE)
  const header = g.header ? `<div class="alv-header">${g.header.map(h =>
    h.typ === 'H' ? `<div class="alv-header-title">${escHtml(h.info)}</div>`
      : h.typ === 'A' ? `<div class="alv-header-note">${escHtml(h.info)}</div>`
      : `<div class="alv-header-row"><span class="alv-header-key">${escHtml(h.key)}</span><span>${escHtml(h.info)}</span></div>`).join('')}</div>` : '';
  return `<div class="alv-block">
    <div class="alv-toolbar">
      <span class="alv-title" title="${escHtml(g.mode)} — ${escHtml(g.tableName)}">${escHtml(title)}<span class="alv-count" data-alv-count="${idx}"></span></span>
      <div class="alv-tools">
        <input type="text" class="alv-search-input" placeholder="${tr('alv.filter')}" value="${escHtml(g.filter)}" oninput="filterAlvGrid(${idx}, this.value)" />
        <button class="alv-btn" onclick="sortAlvSelected(${idx}, 'asc')" title="${tr('alv.asc.tip')}">${ALV_SVG.up}</button>
        <button class="alv-btn" onclick="sortAlvSelected(${idx}, 'desc')" title="${tr('alv.desc.tip')}">${ALV_SVG.down}</button>
        <button class="alv-btn" onclick="toggleAlvTotals(${idx})" title="${tr('alv.sum.tip')}">Σ</button>
        <button class="alv-btn" onclick="exportAlvCsv(${idx})" title="${tr('alv.csv.tip')}">${ALV_SVG.download}</button>
      </div>
      ${hint}
    </div>
    ${header}
    <div class="alv-scroll" data-alv-grid="${idx}"></div>
  </div>`;
}

// Draw grid `idx` into every place where it is shown (Output panel, SAP screen)
function drawAlvTable(idx) {
  const g = alvGrids[idx];
  if (!g) return;
  const containers = document.querySelectorAll(`[data-alv-grid="${idx}"]`);
  const countText = g.filtered.length === g.data.length ? tr('alv.count', { n: g.data.length }) : tr('alv.count.f', { f: g.filtered.length, n: g.data.length });
  document.querySelectorAll(`[data-alv-count="${idx}"]`).forEach(el => { el.textContent = countText; });

  const cols = g.colDefs;
  const ths = [`<th class="alv-row-idx">#</th>`].concat(cols.map(c => {
    const cls = [g.sortCol === c.field ? (g.sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc') : '', g.selCol === c.field ? 'alv-col-sel' : '', c.doSum || (g.sumCols && g.sumCols.includes(c.field)) ? 'alv-th-sum' : ''].filter(Boolean).join(' ');
    const width = c.outputlen ? ` style="min-width:${Math.min(c.outputlen, 60)}ch"` : '';
    return `<th class="${cls}"${width} onclick="selectAlvColumn(${idx}, '${escHtml(c.field)}')" ondblclick="sortAlvByColumn(${idx}, '${escHtml(c.field)}')" title="${tr('alv.th.tip', { f: escHtml(c.field) })}">${escHtml(c.label || c.field)}</th>`;
  })).join('');

  let html;
  if (!g.filtered.length) {
    html = `<table class="alv-table"><thead><tr>${ths}</tr></thead></table>
      <div class="alv-empty">${g.data.length ? tr('alv.nomatch') : tr('alv.emptytab')}</div>`;
  } else {
    const indexOf = new Map(g.data.map((row, i) => [row, i]));          // row -> position in the data, looked up per row
    const more = g.filtered.length > ALV_ROW_LIMIT
      ? `<div class="output-more">${tr('alv.more', { n: (g.filtered.length - ALV_ROW_LIMIT).toLocaleString(I18N.locale), limit: ALV_ROW_LIMIT.toLocaleString(I18N.locale) })}</div>` : '';
    const trs = g.filtered.slice(0, ALV_ROW_LIMIT).map((row, rIdx) => {
      const dataIdx = indexOf.get(row);
      const tds = [`<td class="alv-row-idx">${rIdx + 1}</td>`].concat(cols.map(c => {
        const val = alvCell(row, c.field);
        const isNum = typeof val === 'number';
        const hot = c.hotspot && g.onHotspot;
        const cls = [c.key ? 'alv-col-key' : '', isNum ? 'alv-col-num' : '', c.emphasize ? 'alv-col-emph' : '', g.selCol === c.field ? 'alv-col-sel' : '', hot ? 'alv-hotspot' : ''].filter(Boolean).join(' ');
        const align = c.just === 'R' ? ' style="text-align:right"' : c.just === 'C' ? ' style="text-align:center"' : '';
        const click = hot ? ` onclick="alvRowAction(${idx}, ${dataIdx}, '${escHtml(c.field)}', 'hotspot')"` : '';
        const dbl = g.onDouble ? ` ondblclick="alvRowAction(${idx}, ${dataIdx}, '${escHtml(c.field)}', 'dbl')"` : '';
        return `<td class="${cls}"${align}${click}${dbl}>${escHtml(alvFormat(val, c))}</td>`;
      })).join('');
      return `<tr>${tds}</tr>`;
    }).join('');

    // Totals row: columns flagged DO_SUM / chosen with Σ, otherwise every numeric column
    let totalsHtml = '';
    if (g.showTotals) {
      const chosen = cols.filter(c => c.doSum || (g.sumCols && g.sumCols.includes(c.field))).map(c => c.field);
      const totTds = [`<td class="alv-row-idx">Σ</td>`].concat(cols.map(c => {
        const numeric = g.filtered.some(r => typeof alvCell(r, c.field) === 'number');
        if (numeric && (!chosen.length || chosen.includes(c.field))) {
          const sum = g.filtered.reduce((acc, r) => acc + (Number(alvCell(r, c.field)) || 0), 0);
          return `<td class="alv-col-num"><strong>${escHtml(alvFormat(Number(sum.toPrecision(15)), c))}</strong></td>`;
        }
        return `<td></td>`;
      })).join('');
      totalsHtml = `<tfoot><tr class="alv-totals-row">${totTds}</tr></tfoot>`;
    }
    html = `<table class="alv-table${g.zebra ? ' alv-zebra' : ''}">
      <thead><tr>${ths}</tr></thead>
      <tbody>${trs}</tbody>
      ${totalsHtml}
    </table>${more}`;
  }
  containers.forEach(el => { el.innerHTML = html; });
}

// Click on a column header: select the column (as in SAP), the toolbar buttons then act on it
function selectAlvColumn(idx, col) {
  const g = alvGrids[idx];
  if (!g) return;
  g.selCol = g.selCol === col ? null : col;
  drawAlvTable(idx);
}

function applyAlvSort(g) {
  if (!g.sortCol) return;
  const col = g.sortCol;
  g.filtered.sort((a, b) => {
    const va = alvCell(a, col), vb = alvCell(b, col);
    const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
    return g.sortDir === 'asc' ? cmp : -cmp;
  });
}

// Double click on a header: sort by that column, again to reverse
function sortAlvByColumn(idx, col) {
  const g = alvGrids[idx];
  if (!g) return;
  if (g.sortCol === col) {
    g.sortDir = g.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    g.sortCol = col;
    g.sortDir = 'asc';
  }
  g.selCol = col;
  applyAlvSort(g);
  drawAlvTable(idx);
}

// Toolbar ▲ / ▼: sort by the selected column
function sortAlvSelected(idx, dir) {
  const g = alvGrids[idx];
  if (!g) return;
  if (!g.selCol) { toast(tr('toast.alv.pick'), 'info'); return; }
  g.sortCol = g.selCol;
  g.sortDir = dir;
  applyAlvSort(g);
  drawAlvTable(idx);
}

function filterAlvGrid(idx, value) {
  const g = alvGrids[idx];
  if (!g) return;
  g.filter = String(value || '');
  const term = g.filter.toLowerCase().trim();
  g.filtered = !term ? [...g.data] : g.data.filter(row =>
    g.colDefs.some(c => alvFormat(alvCell(row, c.field), c).toLowerCase().includes(term) || String(alvCell(row, c.field)).toLowerCase().includes(term)));
  applyAlvSort(g);
  drawAlvTable(idx);
}

// Σ: with a numeric column selected, total that column; otherwise switch the totals row on / off
function toggleAlvTotals(idx) {
  const g = alvGrids[idx];
  if (!g) return;
  const numericSel = g.selCol && g.data.some(r => typeof alvCell(r, g.selCol) === 'number');
  if (numericSel) {
    g.sumCols = g.sumCols || [];
    if (g.sumCols.includes(g.selCol)) g.sumCols = g.sumCols.filter(c => c !== g.selCol);
    else g.sumCols.push(g.selCol);
    g.showTotals = g.sumCols.length > 0 || g.colDefs.some(c => c.doSum);
  } else {
    g.showTotals = !g.showTotals;
  }
  drawAlvTable(idx);
  toast(g.showTotals ? tr('toast.alv.sumon') : tr('toast.alv.sumoff'), 'info');
}

// Double click on a row / click on a hotspot cell: run the program's event handler
// (FORM of i_callback_user_command, or the SALV handler methods)
function alvRowAction(idx, dataIdx, field, kind) {
  const g = alvGrids[idx];
  if (!g || dataIdx < 0) return;
  const res = interpreter.alvCommand(g.alvId, kind, dataIdx, field);
  if (!res) return;
  if (!res.output.length && !res.errors.length) { toast(tr('toast.alv.noout'), 'info'); return; }
  renderOutput(true);
  renderVariables(interpreter.variables);
}

function exportAlvCsv(idx) {
  const g = alvGrids[idx];
  if (!g || !g.filtered.length) {
    toast(tr('toast.alv.nodata'), 'error');
    return;
  }
  const quote = v => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [g.colDefs.map(c => quote(c.label || c.field)).join(',')];
  for (const r of g.filtered) lines.push(g.colDefs.map(c => quote(alvCell(r, c.field))).join(','));
  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n')));
  link.setAttribute('download', `ALV_${g.tableName || 'EXPORT'}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  toast(tr('toast.alv.csv'), 'success');
}

// ───────────────────────────────────────────────────────────
// Pretty Printer (Shift+F1)
// ───────────────────────────────────────────────────────────
const PP_KEYWORDS = new Set((
  'REPORT PROGRAM INCLUDE TABLES DATA TYPES CONSTANTS STATICS FIELD-SYMBOLS PARAMETERS PARAMETER SELECT-OPTIONS RANGES ' +
  'SELECTION-SCREEN BEGIN END OF BLOCK WITH FRAME TITLE DEFAULT OBLIGATORY AS CHECKBOX RADIOBUTTON GROUP LOWER UPPER CASE ' +
  'INITIALIZATION START-OF-SELECTION END-OF-SELECTION TOP-OF-PAGE END-OF-PAGE LOAD-OF-PROGRAM AT LINE-SELECTION USER-COMMAND ' +
  'TYPE LIKE LINE REF TO VALUE LENGTH DECIMALS OCCURS HEADER STANDARD SORTED HASHED TABLE UNIQUE NON-UNIQUE KEY EMPTY INITIAL SIZE READ-ONLY ' +
  'IF ELSEIF ELSE ENDIF CASE WHEN OTHERS ENDCASE DO TIMES ENDDO WHILE ENDWHILE LOOP ENDLOOP EXIT CONTINUE CHECK RETURN STOP LEAVE ' +
  'AND OR NOT EQ NE LT GT LE GE IS BOUND ASSIGNED SUPPLIED INSTANCE BETWEEN IN CO CN CA NA CS NS CP NP MOD DIV ' +
  'WRITE SKIP ULINE NEW-LINE NEW-PAGE FORMAT COLOR INTENSIFIED INVERSE HOTSPOT NO-GAP NO-ZERO LEFT-JUSTIFIED RIGHT-JUSTIFIED CENTERED UNDER HIDE ' +
  'MOVE MOVE-CORRESPONDING CLEAR REFRESH FREE COMPUTE ADD SUBTRACT MULTIPLY DIVIDE BY FROM ' +
  'CONCATENATE SEPARATED SPLIT INTO TRANSLATE CONDENSE NO-GAPS REPLACE ALL OCCURRENCES FIRST OCCURRENCE FIND MATCH OFFSET COUNT SHIFT LEFT RIGHT DELETING LEADING TRAILING PLACES IGNORING RESPECTING ' +
  'APPEND INSERT MODIFY DELETE COLLECT SORT ASCENDING DESCENDING STABLE READ INDEX BINARY SEARCH TRANSPORTING FIELDS NO DESCRIBE LINES ADJACENT DUPLICATES COMPARING ' +
  'ASSIGNING ASSIGN UNASSIGN COMPONENT STRUCTURE REFERENCE GET SET HANDLER PARAMETER ID FIELD ' +
  'SELECT SINGLE DISTINCT ENDSELECT WHERE ORDER GROUP HAVING UP ROWS INNER OUTER JOIN ON FOR ENTRIES APPENDING CORRESPONDING UPDATE COMMIT ROLLBACK WORK ' +
  'SUM MAX MIN AVG NEW ENDAT ' +
  'PERFORM USING CHANGING FORM ENDFORM CALL FUNCTION ENDFUNCTION METHOD ENDMETHOD EXPORTING IMPORTING RECEIVING RETURNING EXCEPTIONS RAISING RAISE EXCEPTION EVENT ' +
  'CLASS ENDCLASS DEFINITION IMPLEMENTATION INHERITING ABSTRACT FINAL DEFERRED PUBLIC PROTECTED PRIVATE SECTION METHODS CLASS-METHODS CLASS-DATA EVENTS CLASS-EVENTS ' +
  'INTERFACE ENDINTERFACE INTERFACES ALIASES REDEFINITION CREATE OBJECT OPTIONAL PREFERRED ' +
  'TRY CATCH CLEANUP ENDTRY MESSAGE DISPLAY NUMBER SCREEN TRANSACTION SUBMIT MODULE ENDMODULE OUTPUT INPUT DEFINE END-OF-DEFINITION ' +
  'COND SWITCH THEN REDUCE INIT NEXT UNTIL CONV CAST EXACT BASE MAPPING EXCEPT DEFAULT WAIT SECONDS AUTHORITY-CHECK ASSERT'
).split(/\s+/));

// Upper-case keywords, lower-case everything else — but never touch literals ('..', `..`, |..|)
function ppCase(code) {
  // words that are comparison operators only between two operands; elsewhere they are ordinary names (gt, lt ...)
  const OPERATOR_WORDS = new Set(['EQ', 'NE', 'LT', 'GT', 'LE', 'GE', 'CO', 'CN', 'CA', 'NA', 'CS', 'NS', 'CP', 'NP']);
  let out = '', i = 0;
  let afterOperand = false;      // the previous token was a name, a literal, a number or ")"
  const word = /[A-Za-z_][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)*/y;
  while (i < code.length) {
    const ch = code[i];
    if (ch === "'" || ch === '`' || ch === '|') {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === ch) { if (ch !== '|' && code[j + 1] === ch) { j += 2; continue; } break; }
        j++;
      }
      out += code.slice(i, j + 1);
      i = j + 1;
      afterOperand = true;
      continue;
    }
    word.lastIndex = i;
    const m = word.exec(code);
    if (m) {
      const up = m[0].toUpperCase();
      const isKeyword = OPERATOR_WORDS.has(up) ? afterOperand : PP_KEYWORDS.has(up);
      out += isKeyword ? up : m[0].toLowerCase();
      afterOperand = !isKeyword;
      i += m[0].length;
      continue;
    }
    if (/[0-9)>\]]/.test(ch)) afterOperand = true;
    else if (!/\s/.test(ch)) afterOperand = false;
    out += ch;
    i++;
  }
  return out;
}

// Position of an inline comment (") outside literals, or -1
function ppCommentStart(line) {
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '`' || ch === '|') { q = ch; continue; }
    if (ch === '"') return i;
  }
  return -1;
}

// Format ABAP source: keyword case and indentation. Statements that span several lines keep
// the relative indentation of their continuation lines.
function formatAbap(source) {
  const OPEN = { IF: 'ENDIF', DO: 'ENDDO', WHILE: 'ENDWHILE', LOOP: 'ENDLOOP', CASE: 'ENDCASE', FORM: 'ENDFORM', METHOD: 'ENDMETHOD',
    TRY: 'ENDTRY', FUNCTION: 'ENDFUNCTION', MODULE: 'ENDMODULE', CLASS: 'ENDCLASS', INTERFACE: 'ENDINTERFACE', DEFINE: 'END-OF-DEFINITION' };
  const CLOSE = new Set([...Object.values(OPEN), 'ENDSELECT', 'ENDAT']);
  const MID = new Set(['ELSE', 'ELSEIF', 'CATCH', 'CLEANUP']);
  const EVENTS = new Set(['INITIALIZATION', 'START-OF-SELECTION', 'END-OF-SELECTION', 'TOP-OF-PAGE', 'END-OF-PAGE', 'LOAD-OF-PROGRAM']);
  const hasEndselect = /^\s*ENDSELECT\b/im.test(source);

  const lines = String(source).replace(/\r/g, '').split('\n');
  const out = [];
  const stack = [];           // open blocks: { kw, sub } — sub: a WHEN / SECTION is open inside
  let eventOpen = false;      // statements after an event keyword are indented one level
  let stmt = null;            // statement in progress: { text, firstWord, origIndent, newIndent }
  const level = () => stack.reduce((n, b) => n + 1 + (b.sub ? 1 : 0), 0) + (eventOpen ? 1 : 0);

  for (const raw of lines) {
    if (raw.trim() === '') { out.push(''); continue; }
    if (raw[0] === '*') { out.push(raw.trimEnd()); continue; }          // full-line comment: unchanged
    const origIndent = raw.length - raw.trimStart().length;
    const c = ppCommentStart(raw);
    const code = (c === -1 ? raw : raw.slice(0, c)).trim();
    const comment = c === -1 ? '' : raw.slice(c).trimEnd();
    if (!code) {                                                           // line with only a " comment
      out.push(' '.repeat(stmt ? stmt.newIndent + 2 : level() * 2) + comment);
      continue;
    }
    const text = ppCase(code);

    if (stmt) {
      // continuation line: keep its position relative to the first line of the statement
      const rel = Math.max(2, origIndent - stmt.origIndent);
      out.push(' '.repeat(stmt.newIndent + rel) + text + (comment ? ' ' + comment : ''));
      stmt.text += ' ' + text;
    } else {
      const words = text.split(/\s+/);
      const first = words[0].replace(/[:.,]+$/, '').toUpperCase();
      const second = (words[1] || '').replace(/[:.,]+$/, '').toUpperCase();
      const top = stack[stack.length - 1];

      const isEvent = EVENTS.has(first) || (first === 'AT' && ['SELECTION-SCREEN', 'LINE-SELECTION', 'USER-COMMAND'].includes(second));
      const startsProcedure = ['FORM', 'CLASS', 'FUNCTION', 'MODULE', 'INTERFACE', 'DEFINE'].includes(first);
      if (!stack.length && (isEvent || startsProcedure)) eventOpen = false;       // an event block ends here

      // lines that close or continue a block move one level out
      if (CLOSE.has(first) && top) {
        if (top.sub) top.sub = false;
        stack.pop();
      } else if (MID.has(first) && top && top.sub === false && top.kw !== 'CASE') {
        // ELSE / CATCH: printed at the level of the block keyword (handled below via -1)
      } else if (first === 'WHEN' && top && top.kw === 'CASE') {
        top.sub = false;
      } else if (['PUBLIC', 'PROTECTED', 'PRIVATE'].includes(first) && second === 'SECTION' && top && top.kw === 'CLASS') {
        top.sub = false;
      }
      let ind = level();
      if (MID.has(first) && stack.length) ind -= 1;
      const newIndent = Math.max(0, ind) * 2;
      out.push(' '.repeat(newIndent) + text + (comment ? ' ' + comment : ''));
      stmt = { text, first, second, origIndent, newIndent, isEvent };
    }

    // statement complete?
    if (/\.$/.test(code)) {
      const s = stmt, upper = s.text.toUpperCase();
      const top = stack[stack.length - 1];
      if (s.isEvent && !stack.length) {
        eventOpen = true;
      } else if (s.first === 'WHEN' && top && top.kw === 'CASE') {
        top.sub = true;
      } else if (['PUBLIC', 'PROTECTED', 'PRIVATE'].includes(s.first) && s.second === 'SECTION' && top && top.kw === 'CLASS') {
        top.sub = true;
      } else if (OPEN[s.first]) {
        const noBlock = (s.first === 'CLASS' || s.first === 'INTERFACE') && /\b(DEFERRED|LOAD)\b/.test(upper);
        if (!noBlock) stack.push({ kw: s.first, sub: false });
      } else if (s.first === 'AT' && ['FIRST', 'LAST', 'NEW', 'END'].includes(s.second)) {
        stack.push({ kw: 'AT', sub: false });
      } else if (s.first === 'SELECT' && hasEndselect && !/\b(SINGLE|TABLE)\b/.test(upper) && !/\bCOUNT\s*\(/.test(upper)) {
        stack.push({ kw: 'SELECT', sub: false });
      }
      stmt = null;
    }
  }
  return out.join('\n');
}

function prettyPrinter() {
  if (!editor) return;
  const original = editor.getValue();
  const formatted = formatAbap(original);
  if (formatted === original) { toast(tr('toast.pp.clean'), 'info'); return; }
  const cursor = editor.getCursor();
  editor.setValue(formatted);
  editor.setCursor(cursor);
  toast(tr('toast.pp.done'), 'success');
}

// ───────────────────────────────────────────────────────────
// File Export (.abap) & Import
// ───────────────────────────────────────────────────────────
function exportFile() {
  if (!activeFileId) return;
  const f = files.find(x => x.id === activeFileId);
  if (!f) return;
  const code = editor?.getValue() || f.code;
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${f.name}.abap`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  toast(tr('toast.download', { name: f.name }), 'success');
}

function triggerImport() {
  document.getElementById('fileImportInput')?.click();
}

function handleFileImport(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    const content = evt.target.result;
    let name = file.name.replace(/\.[^/.]+$/, '').toUpperCase().replace(/[^A-Z0-9_\-]/g, '_');
    if (!name.startsWith('Z') && !name.startsWith('Y')) name = 'Z_' + name;
    createFileWithCode(name, content);
    toast(tr('toast.import', { name }), 'success');
    e.target.value = '';
  };
  reader.readAsText(file);
}

// ───────────────────────────────────────────────────────────
// Selection Screen Dialog (F8)
// ───────────────────────────────────────────────────────────
function openSelectionScreen() {
  const code = editor?.getValue() || '';
  // every PARAMETERS statement, including chained / multi-line declarations
  const params = interpreter.getSelectionParameters(code);

  const body = document.getElementById('selectionScreenBody');
  if (!params.length) {
    body.innerHTML = `
      <div style="text-align:center; padding:20px; color:var(--text-muted);">
        <p>${tr('sel.none')}</p>
        <p style="font-size:12px; margin-top:6px;">${tr('sel.none.hint')}</p>
      </div>`;
  } else {
    const fieldsHtml = params.map(p => `
      <div class="sel-field-row">
        <label class="sel-field-label" title="${escHtml(p.type)}">${escHtml(p.name)}</label>
        ${p.range
          ? `<input type="text" class="sel-field-input" data-param="${escHtml(p.name)}" data-part="low" value="${escHtml(p.low)}" placeholder="${tr('sel.from')}" />
             <span class="sel-field-to">${tr('sel.to.short')}</span>
             <input type="text" class="sel-field-input" data-param="${escHtml(p.name)}" data-part="high" value="${escHtml(p.high)}" placeholder="${tr('sel.to')}" />`
          : p.checkbox
          ? `<input type="checkbox" class="sel-field-input sel-field-check" data-param="${escHtml(p.name)}" ${p.value === 'X' ? 'checked' : ''} />`
          : `<input type="text" class="sel-field-input" data-param="${escHtml(p.name)}" value="${escHtml(p.value)}" />`}
      </div>`).join('');

    body.innerHTML = `
      <div class="sel-screen-group">
        <div class="sel-screen-title">${tr('sel.group')}</div>
        ${fieldsHtml}
      </div>`;
  }

  document.getElementById('selectionScreenModal').classList.add('open');
}

function executeFromSelectionScreen() {
  closeModal('selectionScreenModal');
  const inputs = document.querySelectorAll('.sel-field-input');
  // Values typed into the selection screen override the DEFAULT of each PARAMETERS
  const values = {};
  for (const inp of inputs) {
    const name = inp.getAttribute('data-param');
    const part = inp.getAttribute('data-part');       // SELECT-OPTIONS: low / high
    if (part) {
      values[name] = values[name] || { low: '', high: '' };
      values[name][part] = inp.value.trim();
      continue;
    }
    values[name] = inp.type === 'checkbox' ? (inp.checked ? 'X' : '') : inp.value;
  }
  runCode(values);
}


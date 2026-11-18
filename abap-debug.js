// abap-debug.js — the ABAP Debugger of the simulator
// ABAP Code Studio — Created by jeffrypurwanto
//
// The interpreter cannot be paused, so the debugger works on a recording: the program is run once with
// tracing switched on (abap-interpreter.js, traceStep), and the recorded steps are then played back.
// That makes going backwards as cheap as going forwards.
//
//   Shift+F5  start            F5  single step (into)      F6  step over a PERFORM / method call
//   F7  leave the current FORM / method (step out)         F8  continue to the next breakpoint
//   Shift+F6  one step back    Shift+F8  back to the previous breakpoint
//
// A step shows the state BEFORE its line runs, as in SAP. Breakpoints are set by clicking a line number;
// the statement BREAK-POINT in the program counts as one too.
// Uses from app.js: editor, files, activeFileId, lastRunParams, tr, escHtml, msgOut, msgTr, switchPanel, toast.
(function () {
  'use strict';

  const LIMIT = 5000;                 // steps recorded of one run
  const CHECK = 100;                  // a full copy of the variables is kept every so many steps
  const GUTTER = 'bp-gutter';
  const STORE = 'abap_studio_breakpoints';
  let session = null;                 // { steps, result, pos, cut, check: {step: [[name, text], ...]}, open: Set }
  let shown = null;                   // editor line marked as the current one
  let bpAll = {};                     // file id -> [line numbers], kept across reloads

  const $ = id => document.getElementById(id);
  const esc = s => escHtml(s);

  // ─────────────────────────────────────────────────────────── breakpoints
  try { bpAll = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { bpAll = {}; }
  const saveBp = () => { try { localStorage.setItem(STORE, JSON.stringify(bpAll)); } catch (e) { /* storage unavailable */ } };

  function dot() {
    const el = document.createElement('div');
    el.className = 'bp-dot';
    return el;
  }
  // 1-based numbers of the lines that carry a breakpoint
  function breakpoints() {
    const out = [];
    if (!editor) return out;
    editor.eachLine(h => { const info = editor.lineInfo(h); if (info && info.gutterMarkers && info.gutterMarkers[GUTTER]) out.push(info.line + 1); });
    return out;
  }
  function remember() {
    if (!activeFileId) return;
    const list = breakpoints();
    if (list.length) bpAll[activeFileId] = list; else delete bpAll[activeFileId];
    saveBp();
  }
  function toggleBreakpoint(line) {                     // line: 0-based
    const info = editor.lineInfo(line);
    if (!info) return;
    const has = info.gutterMarkers && info.gutterMarkers[GUTTER];
    editor.setGutterMarker(line, GUTTER, has ? null : dot());
    remember();
    if (session) drawBar();
  }
  // a program was put into the editor: its breakpoints come back, a running session ends
  // (called from the "change" handler below, so opening a program needs no call from app.js)
  function enterFile(id) {
    stop(true);
    if (!editor) return;
    editor.clearGutter(GUTTER);
    for (const n of (id && bpAll[id]) || []) if (n >= 1 && n <= editor.lineCount()) editor.setGutterMarker(n - 1, GUTTER, dot());
  }

  // ─────────────────────────────────────────────────────────── a run and its steps
  function start() {
    if (!editor) return;
    stop(true);
    // as in SAP, a program that does not compile cannot be debugged: its errors are shown instead (app.js)
    if (window.ABAP_LINT && !ABAP_LINT.ready() && typeof whenCheckerReady === 'function') { whenCheckerReady(start); return; }
    if (typeof blockedBySyntax === 'function' && blockedBySyntax(editor.getValue())) return;
    const it = new ABAPInterpreter();                   // its own interpreter: the result of the last Run stays as it is
    const result = it.run(editor.getValue(), { params: (typeof lastRunParams !== 'undefined' && lastRunParams) || {}, trace: { limit: LIMIT } });
    const steps = result.trace ? result.trace.steps : [];
    switchPanel('debug', document.querySelector('.panel-tab[data-panel="debug"]'));
    if (steps.length < 2) {                             // nothing but the final state
      const fatal = result.errors.find(e => e.fatal) || result.errors.find(e => e.type === 'error');
      toast(fatal ? msgTr(fatal.msg) : tr('dbg.nothing'), fatal ? 'error' : 'info');
      return;
    }
    // full copies of the variables at regular distances, so any step is reached with at most CHECK changes
    const check = {}, all = new Map();
    steps.forEach((s, i) => { apply(all, s.diff); if (i && i % CHECK === 0) check[i] = [...all]; });
    session = { steps, result, pos: 0, cut: result.trace.cut, check, open: new Set() };
    document.body.classList.add('debugging');
    build();
    go(0);
  }

  function stop(quiet) {
    if (!session) return;
    session = null;
    mark(null);
    document.body.classList.remove('debugging');
    const body = $('debugBody');
    if (body) body.innerHTML = placeholder();
    if (!quiet) editor.focus();
  }

  function apply(map, diff) {
    for (const name of Object.keys(diff)) { if (diff[name] === null) map.delete(name); else map.set(name, diff[name]); }
  }
  function varsAt(p) {
    let c = Math.floor(p / CHECK) * CHECK;
    const map = new Map(c ? session.check[c] : []);
    for (let i = c ? c + 1 : 0; i <= p; i++) apply(map, session.steps[i].diff);
    return map;
  }

  // where the step buttons lead
  function target(kind) {
    const { steps, pos } = session, last = steps.length - 1, depth = steps[pos].depth;
    const bps = new Set(breakpoints());
    const isBp = s => !s.end && (s.brk || bps.has(s.line));
    let q;
    switch (kind) {
      case 'into': return Math.min(pos + 1, last);
      case 'back': return Math.max(pos - 1, 0);
      case 'restart': return 0;
      case 'over': for (q = pos + 1; q < last; q++) if (steps[q].depth <= depth) return q; return last;
      case 'out': for (q = pos + 1; q < last; q++) if (steps[q].depth < depth) return q; return last;
      case 'cont': for (q = pos + 1; q < last; q++) if (isBp(steps[q])) return q; return last;
      case 'rcont': for (q = pos - 1; q > 0; q--) if (isBp(steps[q])) return q; return 0;
      default: return pos;
    }
  }
  function step(kind) {
    if (!session) { if (kind === 'start') start(); return; }
    if (kind === 'stop') { stop(); return; }
    go(target(kind));
  }
  function go(p) {
    if (!session) return;
    session.pos = Math.max(0, Math.min(Number(p) || 0, session.steps.length - 1));
    draw();
  }

  // ─────────────────────────────────────────────────────────── editor: the current line
  function mark(line, error) {                          // line: 1-based, null = none
    if (shown) { editor.removeLineClass(shown, 'background', 'dbg-line'); editor.removeLineClass(shown, 'background', 'dbg-line-error'); editor.removeLineClass(shown, 'gutter', 'dbg-gutter'); shown = null; }
    if (!line || !editor || line > editor.lineCount()) return;
    shown = editor.addLineClass(line - 1, 'background', error ? 'dbg-line-error' : 'dbg-line');
    editor.addLineClass(shown, 'gutter', 'dbg-gutter');
    editor.scrollIntoView({ line: line - 1, ch: 0 }, 70);
  }

  // ─────────────────────────────────────────────────────────── panel
  const ICON = {
    restart: '<path d="M6 5v14"/><path d="M19 5 9 12l10 7z"/>',
    back: '<path d="M17 5 7 12l10 7z"/>',
    into: '<path d="M12 3v11"/><path d="m7 10 5 5 5-5"/><circle cx="12" cy="20" r="1.6" fill="currentColor"/>',
    over: '<path d="M4 14a8 8 0 0 1 15.5-2.5"/><path d="M20 6v6h-6"/><circle cx="12" cy="20" r="1.6" fill="currentColor"/>',
    out: '<path d="M12 15V4"/><path d="m7 8 5-5 5 5"/><circle cx="12" cy="20" r="1.6" fill="currentColor"/>',
    cont: '<path d="M6 5l10 7-10 7z"/><path d="M19 5v14"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1"/>'
  };
  const BUTTONS = [['restart', ''], ['back', 'Shift+F6'], ['into', 'F5'], ['over', 'F6'], ['out', 'F7'], ['cont', 'F8'], ['stop', '']];

  function placeholder() {
    return `<div class="output-placeholder dbg-intro">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${ICON.into}</svg>
      <p>${tr('ph.debug')}</p>
      <button class="btn-secondary" onclick="debugStep('start')">${tr('dbg.start')} <span class="menu-key">Shift+F5</span></button>
      <p class="dbg-hint">${tr('dbg.hint')}</p>
    </div>`;
  }

  // the fixed parts of the panel (the slider must not be rebuilt while it is dragged)
  function build() {
    const n = session.steps.length - 1;
    $('debugBody').innerHTML = `
      <div class="dbg-bar" id="dbgBar"></div>
      <div class="dbg-pos">
        <input type="range" id="dbgSlider" min="0" max="${n}" value="0" step="1" aria-label="${esc(tr('dbg.slider'))}" oninput="debugGoto(this.value)" />
        <div class="dbg-status" id="dbgStatus"></div>
      </div>
      <div id="dbgNote"></div>
      <div class="dbg-section">${tr('dbg.vars')}</div>
      <div id="dbgVars"></div>
      <div class="dbg-section">${tr('dbg.out')}</div>
      <div class="dbg-output" id="dbgOut"></div>`;
    drawBar();
  }

  function drawBar() {
    const bar = $('dbgBar');
    if (!bar || !session) return;
    const { pos, steps } = session, last = steps.length - 1;
    const off = { restart: pos === 0, back: pos === 0, into: pos === last, over: pos === last, out: pos === last, cont: pos === last };
    bar.innerHTML = BUTTONS.map(([k, key]) => `<button class="dbg-btn${k === 'stop' ? ' dbg-stop' : ''}" ${off[k] ? 'disabled' : ''} onclick="debugStep('${k}')" title="${esc(tr('dbg.b.' + k))}${key ? ' (' + key + ')' : ''}" aria-label="${esc(tr('dbg.b.' + k))}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>
        <span>${key ? key.replace('Shift+', '⇧') : '&nbsp;'}</span>
      </button>`).join('');
  }

  // a recorded value ("type\u0001JSON") as text for the table
  function show(value) {
    if (value === null || value === undefined) return '<span class="dbg-dim">–</span>';
    if (typeof value === 'string') return value === '' ? '<span class="dbg-dim">\'\'</span>' : esc(value);
    if (typeof value !== 'object') return esc(String(value));
    if (Array.isArray(value)) return esc(tr('vars.rows', { n: value.length }));
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === '→ data') return '→ ' + show(value[keys[0]]);
    const cls = value['(class)'];
    const parts = keys.filter(k => k !== '(class)').map(k => `<span class="dbg-key">${esc(k)}</span>=${typeof value[k] === 'object' && value[k] !== null ? esc(JSON.stringify(value[k])) : show(value[k])}`);
    return (cls ? `<span class="dbg-dim">${esc(cls)}</span> ` : '') + (parts.length ? parts.join('<span class="dbg-dim">, </span>') : (cls ? '' : '<span class="dbg-dim">–</span>'));
  }

  function drawVars(s) {
    const map = varsAt(session.pos), locals = new Set(s.locals || []);
    const changed = session.pos ? new Set(Object.keys(s.diff).filter(k => s.diff[k] !== null)) : new Set();
    const names = [...map.keys()];
    const rank = n => (n.startsWith('SY-') ? 2 : locals.has(n) ? 0 : 1);      // locals first, system fields last
    names.sort((a, b) => rank(a) - rank(b));
    if (!names.length) { $('dbgVars').innerHTML = `<div class="dbg-empty">${tr('vars.none')}</div>`; return; }
    const rows = names.map(name => {
      const text = map.get(name), cut = text.indexOf('\u0001');
      const type = text.slice(0, cut);
      let value; try { value = JSON.parse(text.slice(cut + 1)); } catch (e) { value = text.slice(cut + 1); }
      let cell;
      if (type === 'table' && value && typeof value === 'object' && Array.isArray(value.rows)) {
        const open = session.open.has(name);
        const head = `<button class="dbg-toggle" onclick="debugToggle('${esc(name)}')" ${value.n ? '' : 'disabled'}>${open ? '▾' : '▸'} ${esc(tr('vars.rows', { n: value.n }))}</button>`;
        let body = '';
        if (open && value.n) {
          body = value.rows.map((r, i) => `<div class="dbg-row"><span class="dbg-idx">${i + 1}</span>${show(r)}</div>`).join('');
          if (value.n > value.rows.length) body += `<div class="dbg-row dbg-dim">…</div><div class="dbg-row"><span class="dbg-idx">${value.n}</span>${show(value.last)}</div>`;
          if (value.header !== undefined) body += `<div class="dbg-row"><span class="dbg-idx">hdr</span>${show(value.header)}</div>`;
        }
        cell = head + body;
      } else cell = show(value);
      const tag = locals.has(name) ? `<span class="dbg-tag">${tr('dbg.local')}</span>` : '';
      return `<tr class="${changed.has(name) ? 'dbg-changed' : ''}"><td class="var-name">${esc(name)}${tag}</td><td class="var-type">${esc(type)}</td><td class="var-val">${cell}</td></tr>`;
    }).join('');
    $('dbgVars').innerHTML = `<table class="var-table dbg-table"><thead><tr><th>${tr('vars.name')}</th><th>${tr('vars.type')}</th><th>${tr('vars.value')}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function drawOutput(s) {
    const out = session.result.output.slice(0, s.out);
    if (!out.length) { $('dbgOut').innerHTML = `<div class="dbg-empty">${tr('dbg.out.none')}</div>`; return; }
    const from = Math.max(0, out.length - 200);
    $('dbgOut').innerHTML = out.slice(from).map((line, i) => {
      if (line.type === 'alv') return `<div class="output-line header">[ALV · ${esc(line.title || line.tableName || 'OUTTAB')} · ${esc(tr('vars.rows', { n: (line.data || []).length }))}]</div>`;
      let text = String(line.text);
      if (from + i === out.length - 1 && !s.end) text = text.slice(0, s.tail);             // the last line as far as it was written then
      return `<div class="output-line ${line.cls || 'info'}">${esc(msgOut(text)) || '&nbsp;'}</div>`;
    }).join('');
    $('dbgOut').scrollTop = $('dbgOut').scrollHeight;
  }

  function draw() {
    if (!session || !$('dbgBar')) return;
    const { steps, pos, result } = session, s = steps[pos], last = steps.length - 1;
    const fatal = result.errors.find(e => e.fatal);
    drawBar();
    const slider = $('dbgSlider');
    if (Number(slider.value) !== pos) slider.value = pos;
    const stack = s.stack && s.stack.length ? s.stack.map(n => `<span class="dbg-frame">${esc(n)}</span>`).join('<span class="dbg-dim"> › </span>') : `<span class="dbg-frame dbg-dim">${tr('dbg.main')}</span>`;
    const where = s.end ? tr('dbg.ended') : tr('dbg.line', { n: s.line });
    const atBp = !s.end && (s.brk || breakpoints().includes(s.line)) ? ` · <span class="dbg-atbp">${tr('dbg.atbp')}</span>` : '';
    $('dbgStatus').innerHTML = `<span>${tr('dbg.step', { n: pos + 1, total: last + 1 })} · <strong>${where}</strong>${atBp}</span><span class="dbg-stack">${stack}</span>`;
    let note = '';
    if (s.end && fatal) note = `<div class="dbg-note dbg-note-error">${tr('dbg.err', { n: fatal.line })} ${esc(msgTr(fatal.msg))}</div>`;
    else if (s.end && session.cut) note = `<div class="dbg-note">${tr('dbg.cut', { n: LIMIT.toLocaleString(I18N.locale) })}</div>`;
    $('dbgNote').innerHTML = note;
    drawVars(s);
    drawOutput(s);
    if (s.end) mark(fatal ? fatal.line : null, true); else mark(s.line);
  }

  function toggle(name) {
    if (!session) return;
    if (session.open.has(name)) session.open.delete(name); else session.open.add(name);
    drawVars(session.steps[session.pos]);
  }

  // ─────────────────────────────────────────────────────────── wiring
  function init() {
    if (typeof editor === 'undefined' || !editor) return;
    editor.setOption('gutters', [GUTTER, 'CodeMirror-linenumbers']);
    editor.on('gutterClick', (cm, line) => toggleBreakpoint(line));
    editor.on('change', (cm, change) => {
      // the whole text was replaced (a program was opened, Pretty Printer, import): the markers went with the old
      // lines, so the breakpoints of the program are put back
      if (change.origin === 'setValue') { enterFile(activeFileId); return; }
      // the recording belongs to the code as it was: an edit ends the session
      if (session) { stop(true); toast(tr('dbg.stopped'), 'info'); }
      if (change.text.length > 1 || change.removed.length > 1) remember();     // lines were added or removed: breakpoints moved
    });
    enterFile(activeFileId);
    const body = $('debugBody');
    if (body) body.innerHTML = placeholder();
    document.addEventListener('langchange', () => { if (session) { build(); draw(); } else if ($('debugBody')) $('debugBody').innerHTML = placeholder(); });
  }

  // function keys as in the ABAP Debugger; they act only while a session is running (F5 reloads the page otherwise)
  document.addEventListener('keydown', e => {
    if (e.key === 'F5' && e.shiftKey && !e.ctrlKey && !e.metaKey) { e.preventDefault(); e.stopPropagation(); start(); return; }
    if (!session || e.ctrlKey || e.metaKey || e.altKey) return;
    const kind = { F5: 'into', F6: e.shiftKey ? 'back' : 'over', F7: 'out', F8: e.shiftKey ? 'rcont' : 'cont' }[e.key];
    if (!kind) return;
    e.preventDefault(); e.stopPropagation();
    step(kind);
  }, true);

  window.ABAP_DEBUG = { start, stop, step, go, toggleBreakpoint, breakpoints, enterFile, get active() { return !!session; }, get session() { return session; } };
  window.startDebug = start;
  window.debugStep = step;
  window.debugGoto = go;
  window.debugToggle = toggle;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

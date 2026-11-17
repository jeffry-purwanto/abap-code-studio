// abap-complete.js — editor assistance for ABAP: suggestions, code templates, block closers, indentation
// ABAP Code Studio — Created by jeffrypurwanto
//
// ABAP_ASSIST.attach(cm) wires this to a CodeMirror editor:
//   1. Enter after "IF x = 1." adds the matching "ENDIF." (only while the block is still open)
//      and indents the new line. A closer, ELSE or WHEN typed later moves to the level of its block.
//   2. Suggestions: code templates at the start of a statement, names used in the program,
//      table names, components after "struct-", members after "obj->" / "class=>".
//   3. A template has slots; Tab moves from one slot to the next, repeated names follow the first.
// The indentation rules are those of the Pretty Printer (formatAbap in app.js).
//
// On-screen keyboards (phones, tablets) send no key events: text arrives as a change of the document, Enter
// as an inserted line break, and a word that is still being composed is only on the page, not in the document
// yet. So everything here reacts to what changed, not to which key was pressed:
//   - typed text is taken from the "change" event; a composed word is read from the page (context),
//   - a line break that came without the Enter key is redone the way the Enter key does it (afterNewline),
//   - a suggestion is picked by tapping it, and a button next to the cursor stands in for the Tab key.
(function (CodeMirror) {
  'use strict';

  const Pos = CodeMirror.Pos;
  const ORIGIN = '+assist';                                                  // changes made here, not typed
  const soft = cm => cm.getOption('inputStyle') === 'contenteditable';       // CodeMirror's input on mobile browsers
  const sp = n => ' '.repeat(Math.max(0, n));
  const label = (key, dflt) => { const t = typeof window.tr === 'function' ? window.tr(key) : key; return t && t !== key ? t : dflt; };
  const WORDS = CodeMirror.abapWords || { keywords: new Set(), builtins: new Set() };

  // ─────────────────────────────────────────────────────────── blocks
  const OPEN = { IF: 'ENDIF', DO: 'ENDDO', WHILE: 'ENDWHILE', LOOP: 'ENDLOOP', CASE: 'ENDCASE', FORM: 'ENDFORM', METHOD: 'ENDMETHOD',
    TRY: 'ENDTRY', FUNCTION: 'ENDFUNCTION', MODULE: 'ENDMODULE', CLASS: 'ENDCLASS', INTERFACE: 'ENDINTERFACE', DEFINE: 'END-OF-DEFINITION' };
  const CLOSE = { ENDSELECT: 'SELECT', ENDAT: 'AT' };
  for (const k of Object.keys(OPEN)) CLOSE[OPEN[k]] = k;
  const MID = { ELSE: 'IF', ELSEIF: 'IF', CATCH: 'TRY', CLEANUP: 'TRY', WHEN: 'CASE' };
  const SECTION = new Set(['PUBLIC', 'PROTECTED', 'PRIVATE']);
  const EVENTS = new Set(['INITIALIZATION', 'START-OF-SELECTION', 'END-OF-SELECTION', 'TOP-OF-PAGE', 'END-OF-PAGE', 'LOAD-OF-PROGRAM']);

  // position of an inline comment (") outside literals, or -1
  function commentStart(line) {
    let q = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) { if (ch === q) q = ''; continue; }
      if (ch === "'" || ch === '`' || ch === '|') { q = ch; continue; }
      if (ch === '"') return i;
    }
    return -1;
  }

  // All statements of the document: { line, ch, indent, endLine, endCh, text, upper, first, second }.
  // Cached per document version; an unfinished last statement has endLine = -1.
  function scan(cm) {
    const gen = cm.getDoc().changeGeneration();
    const cached = cm.state.abapScan;
    if (cached && cached.gen === gen) return cached;
    const stmts = [], code = [];
    let cur = null;
    const finish = (line, ch) => {
      cur.endLine = line; cur.endCh = ch;
      cur.text = cur.text.replace(/\s+/g, ' ').trim();
      cur.upper = cur.text.toUpperCase();
      const w = cur.upper.split(' ').map(x => x.replace(/[:,]+$/, ''));
      cur.first = w[0] || ''; cur.second = w[1] || '';
      stmts.push(cur); cur = null;
    };
    const n = cm.lineCount();
    for (let i = 0; i < n; i++) {
      const line = cm.getLine(i);
      if (line[0] === '*') continue;
      let q = '', plain = '';
      for (let p = 0; p < line.length; p++) {
        const ch = line[p];
        if (q) { cur.text += ch; if (ch === q) q = ''; continue; }
        if (ch === '"') break;
        if (ch === ' ' || ch === '\t') { if (cur) cur.text += ' '; plain += ' '; continue; }
        if (!cur) cur = { line: i, ch: p, indent: line.length - line.trimStart().length, text: '' };
        if (ch === "'" || ch === '`' || ch === '|') { q = ch; cur.text += ch; continue; }
        if (ch === '.' && (p + 1 >= line.length || /[\s"]/.test(line[p + 1]))) { finish(i, p); plain += '.'; continue; }
        cur.text += ch; plain += ch;
      }
      if (cur) cur.text += ' ';
      code.push(plain);
    }
    if (cur) finish(-1, -1);
    const all = code.join('\n');
    const result = { gen, stmts, code: all, hasEndselect: /(^|\s)ENDSELECT\b/i.test(all) };
    cm.state.abapScan = result;
    return result;
  }

  function classify(st, hasEndselect) {
    const f = st.first, s = st.second;
    if (CLOSE[f]) return { type: 'close', kind: CLOSE[f] };
    if (MID[f]) return { type: 'mid', kind: MID[f], extra: f === 'WHEN' ? 2 : 0 };
    if (SECTION.has(f) && s === 'SECTION') return { type: 'mid', kind: 'CLASS', extra: 2 };
    if (OPEN[f]) {
      if ((f === 'CLASS' || f === 'INTERFACE') && /\b(DEFERRED|LOAD)\b/.test(st.upper)) return { type: 'plain' };
      return { type: 'open', kind: f, closer: OPEN[f], auto: true };
    }
    if (f === 'AT' && ['FIRST', 'LAST', 'NEW', 'END'].includes(s)) return { type: 'open', kind: 'AT', closer: 'ENDAT', auto: true };
    // SELECT is a loop only without SINGLE / INTO TABLE; an aggregate needs no ENDSELECT either, so it is never closed automatically
    if (f === 'SELECT' && hasEndselect && !/\b(SINGLE|TABLE)\b/.test(st.upper) && !/\bCOUNT\s*\(/.test(st.upper)) {
      return { type: 'open', kind: 'SELECT', closer: 'ENDSELECT', auto: false };
    }
    if (EVENTS.has(f) || (f === 'AT' && ['SELECTION-SCREEN', 'LINE-SELECTION', 'USER-COMMAND'].includes(s))) return { type: 'event' };
    return { type: 'plain' };
  }

  // ─────────────────────────────────────────────────────────── Enter: close the block, indent
  function onEnter(cm) {
    if (!api.enabled || cm.getOption('readOnly') || cm.somethingSelected() || cm.listSelections().length > 1) return CodeMirror.Pass;
    const cur = cm.getCursor(), line = cm.getLine(cur.line);
    if (line[0] === '*') return CodeMirror.Pass;
    const c = commentStart(line);
    if (c >= 0 && c < cur.ch) return CodeMirror.Pass;                       // inside a comment
    const before = line.slice(0, cur.ch).trimEnd();
    const rest = (c >= 0 ? line.slice(cur.ch, c) : line.slice(cur.ch)).trim();
    const data = scan(cm);

    // TYPES: BEGIN OF ty_x,   →   components, then END OF ty_x.
    const b = /^\s*(?:TYPES|DATA|CONSTANTS|STATICS|CLASS-DATA)\s*:\s*BEGIN\s+OF\s+([\w\/]+)\s*,$/i.exec(before);
    if (b && !rest && cur.ch >= line.trimEnd().length) {
      const col = before.toUpperCase().indexOf('BEGIN');
      const lower = /^\s*[a-z]/.test(before);
      const closed = new RegExp('\\bEND\\s+OF\\s+' + b[1].replace(/[^\w]/g, '\\$&') + '\\b', 'i').test(data.code);
      cm.operation(() => {
        cm.replaceSelection('\n' + sp(col + 2) + (closed ? '' : '\n' + sp(col) + (lower ? 'end of ' : 'END OF ') + b[1] + '.'), 'end', ORIGIN);
        cm.setCursor(Pos(cur.line + 1, col + 2));
      });
      return undefined;
    }

    if (!before.endsWith('.')) return CodeMirror.Pass;                      // statement not finished: plain new line
    const st = data.stmts.find(s => s.endLine === cur.line && s.endCh === before.length - 1);
    if (!st) return CodeMirror.Pass;
    const k = classify(st, data.hasEndselect);
    if (k.type === 'plain' || k.type === 'close') return CodeMirror.Pass;

    const inner = st.indent + 2;
    let text = '\n' + sp(inner);
    if (k.type === 'open' && k.auto && !rest) {
      let opened = 0, closed = 0;
      for (const s of data.stmts) {
        const x = classify(s, data.hasEndselect);
        if (x.kind !== k.kind) continue;
        if (x.type === 'open') opened++; else if (x.type === 'close') closed++;
      }
      if (opened > closed) {
        const lower = /[a-z]/.test(cm.getLine(st.line).charAt(st.ch));
        text += '\n' + sp(st.indent) + (lower ? k.closer.toLowerCase() : k.closer) + '.';
      }
    }
    cm.operation(() => {
      cm.replaceSelection(text, 'end', ORIGIN);
      cm.setCursor(Pos(cur.line + 1, inner));
    });
    return undefined;
  }

  // The Enter key. Pass = CodeMirror adds a plain new line itself; that line break is then not looked at again.
  function enterKey(cm) {
    const r = onEnter(cm);
    if (r === CodeMirror.Pass) { cm.state.abapEnterKey = true; setTimeout(() => { cm.state.abapEnterKey = false; }, 0); }
    return r;
  }
  function newline(cm) { if (enterKey(cm) === CodeMirror.Pass) cm.execCommand('newlineAndIndent'); }

  // A line break that came without the Enter key (on-screen keyboard): take it back and enter it properly.
  function afterNewline(cm, change) {
    const end = CodeMirror.changeEnd(change);
    if (cm.somethingSelected() || CodeMirror.cmpPos(cm.getCursor(), end)) return;
    const head = change.text[0], tail = change.text[1];
    cm.replaceRange('', Pos(change.from.line, change.from.ch + head.length), end, ORIGIN);
    if (head) typed(cm, head, false);
    newline(cm);
    if (tail) { cm.replaceSelection(tail, 'end', ORIGIN); typed(cm, tail, true); }      // typed right after Enter
  }

  // ─────────────────────────────────────────────────────────── typing ENDIF / ELSE / WHEN: move to the block's level
  function electric(cm) {
    const cur = cm.getCursor(), line = cm.getLine(cur.line);
    if (cur.ch !== line.length) return;
    const m = /^(\s*)(?:([A-Za-z-]+)|((?:PUBLIC|PROTECTED|PRIVATE)\s+SECTION))\.?\s*$/i.exec(line);
    if (!m) return;
    const word = (m[2] || '').toUpperCase();
    let want, extra = 0;
    if (m[3]) { want = 'CLASS'; extra = 2; }
    else if (CLOSE[word]) want = CLOSE[word];
    else if (MID[word]) { want = MID[word]; extra = word === 'WHEN' ? 2 : 0; }
    else return;
    const data = scan(cm);
    let depth = 0, target = null;
    for (let i = data.stmts.length - 1; i >= 0; i--) {
      const s = data.stmts[i];
      if (s.line >= cur.line) continue;
      const k = classify(s, data.hasEndselect);
      if (k.type === 'close') depth++;
      else if (k.type === 'open') {
        if (depth === 0) { if (k.kind === want) target = s.indent + extra; break; }
        depth--;
      }
    }
    if (target != null && target !== m[1].length) cm.replaceRange(sp(target), Pos(cur.line, 0), Pos(cur.line, m[1].length), ORIGIN);
  }

  // Text that was just typed. here = the cursor stands right behind it.
  function typed(cm, text, here) {
    const ch = text.slice(-1);
    if (/[A-Za-z.\s]/.test(ch)) electric(cm);
    if (!here) return;
    if (/[>~]/.test(ch) && cm.state.completionActive) cm.state.completionActive.close();     // members replace the name list
    if (!cm.state.completionActive && /[A-Za-z_\-<>~]/.test(ch)) show(cm, false);
  }

  // ─────────────────────────────────────────────────────────── a word the on-screen keyboard is still composing
  // CodeMirror puts a composed word into the document when it is finished. Until then it is only on the page.
  const clean = s => s.replace(/[​‌‍﻿]/g, '').replace(/ /g, ' ');

  // The line of the cursor and the column in it: { line, text, ch }.
  function context(cm) {
    const cur = cm.getCursor(), ime = cm.state.abapIme;
    if (ime && ime.composing) {
      const sel = window.getSelection(), node = sel && sel.focusNode;
      const el = node && (node.nodeType === 1 ? node : node.parentNode);
      const lineEl = el && el.closest ? el.closest('.CodeMirror-line') : null;
      if (lineEl && cm.getWrapperElement().contains(lineEl)) {
        const r = document.createRange();
        r.selectNodeContents(lineEl);
        r.setEnd(sel.focusNode, sel.focusOffset);
        const box = lineEl.getBoundingClientRect();
        return { line: cm.lineAtHeight((box.top + box.bottom) / 2, 'window'), text: clean(lineEl.textContent), ch: clean(r.toString()).length };
      }
    }
    return { line: cur.line, text: cm.getLine(cur.line), ch: cur.ch };
  }

  // Finish the word being composed, so that the document has it.
  function flush(cm) {
    const ime = cm.state.abapIme, input = cm.display && cm.display.input;
    if (!ime || !ime.composing) return;
    ime.composing = false;
    if (input && typeof input.forceCompositionEnd === 'function') input.forceCompositionEnd();
  }

  function composeTyped(cm) {
    const cx = context(cm);
    if (cm.state.completionActive) cm.state.completionActive.close();        // the list is built anew for every letter
    if (/[\w\-<>~]/.test(cx.text.charAt(cx.ch - 1))) show(cm, false);
  }

  // ─────────────────────────────────────────────────────────── code templates
  // «name» = slot (Tab moves to the next one), «=name» = repeats what was typed into slot "name", «» = stop
  const TEMPLATES = [
    ['IF', 'IF … ENDIF', 'IF «cond».\n  «»\nENDIF.'],
    ['IF', 'IF … ELSE … ENDIF', 'IF «cond».\n  «»\nELSE.\n  «»\nENDIF.'],
    ['CASE', 'CASE … ENDCASE', 'CASE «dobj».\n  WHEN «value».\n    «»\n  WHEN OTHERS.\n    «»\nENDCASE.'],
    ['DO', 'DO n TIMES … ENDDO', 'DO «n» TIMES.\n  «»\nENDDO.'],
    ['WHILE', 'WHILE … ENDWHILE', 'WHILE «cond».\n  «»\nENDWHILE.'],
    ['LOOP', 'LOOP AT … INTO', 'LOOP AT «itab» INTO DATA(«ls_line»).\n  «»\nENDLOOP.'],
    ['LOOP', 'LOOP AT … ASSIGNING', 'LOOP AT «itab» ASSIGNING FIELD-SYMBOL(«<ls_line>»).\n  «»\nENDLOOP.'],
    ['LOOP', 'LOOP AT … GROUP BY', 'LOOP AT «itab» INTO DATA(«ls_line») GROUP BY «ls_line-comp» INTO DATA(«lv_key»).\n  LOOP AT GROUP «=lv_key» INTO DATA(ls_member).\n    «»\n  ENDLOOP.\nENDLOOP.'],
    ['READ', 'READ TABLE … WITH KEY', 'READ TABLE «itab» INTO «wa» WITH KEY «comp» = «value».\nIF sy-subrc = 0.\n  «»\nENDIF.'],
    ['SELECT', 'SELECT … INTO TABLE', 'SELECT * FROM «dbtab»\n  WHERE «cond»\n  INTO TABLE @DATA(«lt_data»).'],
    ['SELECT', 'SELECT SINGLE', 'SELECT SINGLE * FROM «dbtab»\n  WHERE «cond»\n  INTO @DATA(«ls_data»).'],
    ['SELECT', 'SELECT … ENDSELECT', 'SELECT * FROM «dbtab» INTO «wa» WHERE «cond».\n  «»\nENDSELECT.'],
    ['TRY', 'TRY … CATCH … ENDTRY', 'TRY.\n  «»\nCATCH «cx_root» INTO DATA(lx_error).\n  MESSAGE lx_error->get_text( ) TYPE \'I\'.\nENDTRY.'],
    ['FORM', 'FORM … ENDFORM', 'FORM «name».\n  «»\nENDFORM.'],
    ['METHOD', 'METHOD … ENDMETHOD', 'METHOD «name».\n  «»\nENDMETHOD.'],
    ['CLASS', 'CLASS … DEFINITION + IMPLEMENTATION',
      'CLASS «lcl_name» DEFINITION.\n  PUBLIC SECTION.\n    METHODS «run».\nENDCLASS.\n\nCLASS «=lcl_name» IMPLEMENTATION.\n  METHOD «=run».\n    «»\n  ENDMETHOD.\nENDCLASS.'],
    ['CLASS', 'CLASS … FOR TESTING',
      'CLASS «ltc_name» DEFINITION FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.\n  PRIVATE SECTION.\n    METHODS «first_test» FOR TESTING.\nENDCLASS.\n\nCLASS «=ltc_name» IMPLEMENTATION.\n  METHOD «=first_test».\n    cl_abap_unit_assert=>assert_equals( act = «act» exp = «exp» ).\n  ENDMETHOD.\nENDCLASS.'],
    ['DATA', 'DATA … TYPE', 'DATA «lv_name» TYPE «type».'],
    ['DATA', 'DATA … TYPE TABLE OF', 'DATA «lt_name» TYPE STANDARD TABLE OF «type» WITH EMPTY KEY.'],
    ['TYPES', 'TYPES: BEGIN OF … END OF', 'TYPES: BEGIN OF «ty_name»,\n         «comp» TYPE «type»,\n       END OF «=ty_name».'],
    ['FIELD-SYMBOLS', 'FIELD-SYMBOLS … TYPE', 'FIELD-SYMBOLS «<fs>» TYPE «type».'],
    ['PARAMETERS', 'PARAMETERS … TYPE', 'PARAMETERS «p_name» TYPE «type».'],
    ['SELECT-OPTIONS', 'SELECT-OPTIONS … FOR', 'SELECT-OPTIONS «s_name» FOR «field».'],
    ['WRITE', 'WRITE: / …', 'WRITE: / «text».'],
    ['MESSAGE', 'MESSAGE … TYPE', 'MESSAGE \'«text»\' TYPE \'«I»\'.'],
    ['CALL', 'CALL FUNCTION … EXCEPTIONS', 'CALL FUNCTION \'«FM_NAME»\'\n  EXPORTING\n    «param» = «value»\n  EXCEPTIONS\n    OTHERS = 1.\nIF sy-subrc <> 0.\n  «»\nENDIF.'],
    ['AUTHORITY-CHECK', 'AUTHORITY-CHECK OBJECT', 'AUTHORITY-CHECK OBJECT \'«object»\' ID \'ACTVT\' FIELD \'«03»\'.\nIF sy-subrc <> 0.\n  «»\nENDIF.']
  ];

  function clearTemplate(cm) {
    const st = cm.state.abapTpl;
    if (!st) return;
    cm.state.abapTpl = null;
    for (const s of st.slots) s.mark.clear();
    st.range.clear();
    chipSoon(cm);
  }

  // repeated names take over what was typed into their slot
  function syncMirrors(cm) {
    const st = cm.state.abapTpl;
    if (!st || st.busy) return;
    st.busy = true;
    try {
      for (const mir of st.slots.filter(s => s.mirror)) {
        const src = st.slots.find(s => !s.mirror && s.name === mir.name);
        const a = src && src.mark.find(), b = mir.mark.find();
        if (!a || !b) continue;
        const text = cm.getRange(a.from, a.to);
        if (cm.getRange(b.from, b.to) !== text) cm.replaceRange(text, b.from, b.to, ORIGIN);
      }
    } finally { st.busy = false; }
  }

  // Tab: select the next slot. false = no template is active.
  function nextSlot(cm) {
    if (!cm.state.abapTpl) return false;
    flush(cm);
    const st = cm.state.abapTpl;
    if (!st) return false;
    syncMirrors(cm);
    for (;;) {
      st.index++;
      const slot = st.stops[st.index];
      if (!slot) { clearTemplate(cm); return false; }
      const r = slot.mark.find();
      if (!r) continue;
      st.moving = true;
      cm.setSelection(r.from, r.to);
      st.moving = false;
      if (st.index === st.stops.length - 1) clearTemplate(cm);              // last stop: back to normal typing
      return true;
    }
  }

  function insertTemplate(cm, from, to, body) {
    const indent = /^\s*/.exec(cm.getLine(from.line))[0];
    let text = '';
    const slots = [];
    body.replace(/«(=?)([^»]*)»|[^«]+/g, (m, eq, name) => {
      if (name === undefined) text += m.replace(/\n/g, '\n' + indent);
      else { slots.push({ start: text.length, len: name.length, name, mirror: !!eq }); text += name; }
      return '';
    });
    cm.operation(() => {
      clearTemplate(cm);
      cm.replaceRange(text, from, to, 'complete');
      const base = cm.indexFromPos(from);
      const at = i => cm.posFromIndex(base + i);
      for (const s of slots) {
        s.mark = cm.markText(at(s.start), at(s.start + s.len),
          { className: s.len ? 'cm-tplslot' : null, inclusiveLeft: true, inclusiveRight: true, clearWhenEmpty: false });
      }
      const range = cm.markText(from, at(text.length), { inclusiveLeft: true, inclusiveRight: true, clearWhenEmpty: false });
      cm.state.abapTpl = { slots, stops: slots.filter(s => !s.mirror), range, index: -1 };
      if (!nextSlot(cm)) cm.setCursor(at(text.length));
    });
    chipSoon(cm);
  }

  // ─────────────────────────────────────────────────────────── touch screens have no Tab key
  // While a template is active, a button on the cursor's line moves to the next slot.
  const touchScreen = cm => soft(cm) || !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  function chipUpdate(cm) {
    let el = cm.state.abapChip;
    if (!cm.state.abapTpl || !touchScreen(cm)) { if (el) el.classList.remove('on'); return; }
    if (!el) {
      el = cm.state.abapChip = document.createElement('button');
      el.type = 'button';
      el.className = 'assist-next';
      // acting on the press itself, and cancelling it, keeps the focus and the keyboard in the editor
      const go = e => { e.preventDefault(); e.stopPropagation(); nextSlot(cm); cm.focus(); };
      el.addEventListener('touchstart', go, { passive: false });
      el.addEventListener('mousedown', go);
      cm.getWrapperElement().appendChild(el);
    }
    el.textContent = label('assist.next', 'Next') + ' ›';
    el.classList.add('on');
    const wrap = cm.getWrapperElement().getBoundingClientRect();
    const c = cm.cursorCoords(null, 'window');
    const w = el.offsetWidth, h = el.offsetHeight;
    const left = wrap.width - w - 8;
    const head = cm.getCursor();
    const lineEnd = cm.charCoords(Pos(head.line, cm.getLine(head.line).length), 'window').left;
    let top = c.top - wrap.top + (c.bottom - c.top - h) / 2;                  // on the cursor's line, at the right edge
    if (Math.max(c.left, lineEnd) - wrap.left > left - 12) top = c.top - wrap.top - h - 2;   // the line reaches it: one line up
    if (top < 2) top = c.bottom - wrap.top + 2;
    el.style.left = Math.max(2, left) + 'px';
    el.style.top = top + 'px';
    if (c.bottom < wrap.top || c.top > wrap.bottom) el.classList.remove('on');
  }
  function chipSoon(cm) {
    if (cm.state.abapChipTimer) return;
    cm.state.abapChipTimer = setTimeout(() => { cm.state.abapChipTimer = 0; chipUpdate(cm); }, 0);
  }

  // ─────────────────────────────────────────────────────────── what a name stands for
  const SY_FIELDS = ['subrc', 'tabix', 'index', 'dbcnt', 'datum', 'uzeit', 'uname', 'langu', 'mandt', 'repid', 'tcode', 'tfill', 'fdpos',
    'lsind', 'lilli', 'linno', 'pagno', 'ucomm', 'msgty', 'msgid', 'msgno', 'msgv1', 'msgv2', 'msgv3', 'msgv4', 'title', 'batch', 'cprog'];
  const STD_CLASSES = {
    CL_SALV_TABLE: ['factory', 'display', 'get_columns', 'get_functions', 'get_display_settings', 'get_sorts', 'get_aggregations', 'get_event', 'get_selections'],
    CL_ABAP_UNIT_ASSERT: ['assert_equals', 'assert_differs', 'assert_true', 'assert_false', 'assert_initial', 'assert_not_initial', 'assert_bound', 'assert_not_bound', 'assert_subrc', 'fail'],
    CL_ABAP_TYPEDESCR: ['describe_by_name', 'describe_by_data', 'describe_by_data_ref'],
    CL_ABAP_STRUCTDESCR: ['components', 'get_components', 'get_relative_name'],
    CL_DEMO_OUTPUT: ['display', 'write']
  };
  const rx = s => s.replace(/[^\w]/g, '\\$&');

  function tableFields(name) {
    const U = String(name).toUpperCase();
    const schema = (window.ABAP_DB_SCHEMA || {})[U];
    if (schema && schema.fields) return schema.fields.map(f => f.toLowerCase());
    const rows = (window.ABAP_DB || {})[U];
    return rows && rows[0] ? Object.keys(rows[0]).map(f => f.toLowerCase()) : null;
  }

  // components of a structure, a table (its line) or a variable of such a type
  function fieldsOf(code, name, depth) {
    if (!name || depth > 4) return null;
    if (/^sy(st)?$/i.test(name)) return SY_FIELDS;
    const db = tableFields(name);
    if (db) return db;
    const n = rx(name);
    // TYPES: BEGIN OF name, a TYPE ..., b TYPE ..., END OF name.
    let m = new RegExp('\\bBEGIN\\s+OF\\s+' + n + '\\s*[,.]([\\s\\S]*?)\\bEND\\s+OF\\s+' + n + '(?![\\w])', 'i').exec(code);
    if (m) {
      return m[1].split(/[,.]/).map(part => (/^\s*(?:(?:TYPES|DATA|CONSTANTS)\b\s*:?\s*)?([A-Za-z_]\w*)/i.exec(part) || [])[1])
        .filter(x => x && !/^(INCLUDE|BEGIN|END)$/i.test(x)).map(x => x.toLowerCase());
    }
    // name TYPE [LINE OF | [STANDARD|SORTED|HASHED] TABLE OF | REF TO] other
    m = new RegExp('(?:^|[\\s,:(])' + n + '\\)?\\s+(?:TYPE|LIKE)\\s+(?:LINE\\s+OF\\s+|(?:STANDARD\\s+|SORTED\\s+|HASHED\\s+)?TABLE\\s+OF\\s+|REF\\s+TO\\s+)?([<\\w>]+)', 'i').exec(code);
    if (m && m[1].toUpperCase() !== name.toUpperCase()) { const f = fieldsOf(code, m[1], depth + 1); if (f) return f; }
    // LOOP AT itab INTO DATA(name) / ASSIGNING FIELD-SYMBOL(<name>) / READ TABLE itab ... INTO DATA(name)
    m = new RegExp('\\b(?:LOOP\\s+AT|READ\\s+TABLE)\\s+(?:GROUP\\s+)?([<\\w>]+)[^.]*?\\b(?:DATA|FIELD-SYMBOL)\\(\\s*' + n + '\\s*\\)', 'i').exec(code);
    if (m) { const f = fieldsOf(code, m[1], depth + 1); if (f) return f; }
    // SELECT a, b AS c FROM dbtab ... INTO [TABLE] @DATA(name)
    m = new RegExp('\\bSELECT\\s+(?:SINGLE\\s+|DISTINCT\\s+)*([^.]*?)\\sFROM\\s+(\\w+)[^.]*?\\bDATA\\(\\s*' + n + '\\s*\\)', 'i').exec(code);
    if (m) {
      if (m[1].trim() === '*') return tableFields(m[2]);
      const cols = m[1].split(m[1].includes(',') ? ',' : /\s+/).map(c => {
        const as = /\bAS\s+(\w+)\s*$/i.exec(c);
        return (as ? as[1] : c.trim().split('~').pop()).toLowerCase();
      }).filter(c => /^[a-z_]\w*$/.test(c));
      if (cols.length) return cols;
    }
    return null;
  }

  // members of a local class / interface (with its superclass and interfaces), or of a simulated standard class
  function classMembers(code, name, depth) {
    if (!name || depth > 4) return null;
    const U = name.toUpperCase();
    if (STD_CLASSES[U]) return STD_CLASSES[U];
    const m = new RegExp('\\b(?:CLASS\\s+' + rx(name) + '\\s+DEFINITION|INTERFACE\\s+' + rx(name) + ')\\b([^\\n]*)\\n([\\s\\S]*?)\\bEND(?:CLASS|INTERFACE)\\b', 'i').exec(code);
    if (!m) return null;
    const out = [];
    const re = /(?:^|\n)\s*(?:CLASS-METHODS|METHODS|CLASS-DATA|DATA|CONSTANTS|EVENTS|INTERFACES)\b\s*:?([^\n]*(?:\n(?!\s*(?:CLASS-METHODS|METHODS|CLASS-DATA|DATA|CONSTANTS|EVENTS|INTERFACES|PUBLIC|PROTECTED|PRIVATE|TYPES|ALIASES)\b)[^\n]*)*)/gi;
    let d;
    while ((d = re.exec(m[2]))) {
      const kw = /(CLASS-METHODS|METHODS|CLASS-DATA|DATA|CONSTANTS|EVENTS|INTERFACES)/i.exec(d[0])[1].toUpperCase();
      const names = kw === 'INTERFACES' ? d[1].split(/[\s,]+/) : d[1].split(',').map(p => (/^\s*([A-Za-z_]\w*)/.exec(p) || [])[1]);
      for (const x of names) {
        if (!x || !/^[A-Za-z_]\w*$/.test(x)) continue;
        if (kw === 'INTERFACES') (classMembers(code, x, depth + 1) || []).forEach(y => out.push(x.toLowerCase() + '~' + y));
        else out.push(x.toLowerCase());
      }
    }
    const sup = /\bINHERITING\s+FROM\s+(\w+)/i.exec(m[1]);
    if (sup) (classMembers(code, sup[1], depth + 1) || []).forEach(y => out.push(y));
    return [...new Set(out)];
  }

  function classOf(cm, code, owner, line) {
    if (/^me$/i.test(owner)) {                                                // class whose implementation the cursor is in
      for (let i = line; i >= 0; i--) {
        const m = /^\s*CLASS\s+(\w+)\s+IMPLEMENTATION/i.exec(cm.getLine(i));
        if (m) return m[1];
      }
      return null;
    }
    const n = rx(owner);
    const m = new RegExp('(?:^|[\\s,:(])' + n + '\\)?\\s+TYPE\\s+REF\\s+TO\\s+(\\w+)', 'i').exec(code) ||
              new RegExp('(?:^|[\\s(])' + n + '\\)?\\s*=\\s*(?:NEW|CAST)\\s+(\\w+)\\s*\\(', 'i').exec(code);
    return m ? m[1] : owner;                                                  // otherwise taken as a class name (static access)
  }

  // ─────────────────────────────────────────────────────────── suggestions
  function render(el, data, item) {
    const t = document.createElement('span');
    t.className = 'hint-text'; t.textContent = item.displayText || item.text;
    el.appendChild(t);
    if (item.tag) {
      const g = document.createElement('span');
      g.className = 'hint-tag'; g.textContent = item.tag;
      el.appendChild(g);
    }
  }
  const entry = (text, tag, extra) => Object.assign({ text, tag, render }, extra || {});

  // The words in front of the cursor that a picked suggestion replaces. The document is brought up to date
  // first, so this also holds for a word that was still being composed when the list was shown.
  function target(cm, len) {
    flush(cm);
    const to = cm.getCursor();
    return { from: Pos(to.line, Math.max(0, to.ch - len)), to };
  }

  function hint(cm, options) {
    const cx = context(cm), cur = Pos(cx.line, cx.ch), line = cx.text;
    const tok = cm.getTokenAt(cm.getCursor());
    if (line[0] === '*' || (tok && (tok.type === 'comment' || tok.type === 'string'))) return null;
    const left = line.slice(0, cur.ch);
    const word = (/[A-Za-z_]\w*$/.exec(left) || [''])[0];
    const start = cur.ch - word.length;
    const head = left.slice(0, start);
    const data = scan(cm);
    const P = word.toLowerCase();
    const fits = x => x.toLowerCase().startsWith(P);
    let list = null, from = start;

    // components: struct-comp, <fs>-comp, dbtab-field, sy-field  (and keywords written with a hyphen)
    const comp = /((?:<?[A-Za-z_]\w*>?-)+)$/.exec(head);
    const sql = /([A-Za-z_]\w*)~$/.exec(head);
    const obj = /([A-Za-z_]\w*)(->|=>)$/.exec(head);
    if (comp) {
      const owners = comp[1].split('-').filter(Boolean);
      const fields = owners.length === 1 ? fieldsOf(data.code, owners[0], 0) : null;
      if (fields) list = fields.filter(fits).map(f => entry(f, label('hint.field', 'field')));
      else {
        const whole = (comp[1] + word).toUpperCase();                         // START-OF-SELECTION, FIELD-SYMBOLS, ...
        const kws = [...WORDS.keywords].filter(k => k.includes('-') && k.startsWith(whole) && k !== whole);
        if (kws.length) { list = kws.map(k => entry(k)); from = start - comp[1].length; }
      }
    } else if (sql) {
      const alias = new RegExp('\\b(\\w+)\\s+AS\\s+' + rx(sql[1]) + '\\b', 'i').exec(data.code);
      const fields = tableFields(alias ? alias[1] : sql[1]);
      if (fields) list = fields.filter(fits).map(f => entry(f, label('hint.field', 'field')));
    } else if (obj) {
      const members = classMembers(data.code, classOf(cm, data.code, obj[1], cur.line), 0);
      if (members) list = members.filter(fits).map(f => entry(f, label('hint.member', 'member')));
    } else {
      if (word.length < (options && options.explicit ? 0 : 2)) return null;
      const U = word.toUpperCase();
      const seen = new Set();
      list = [];
      const add = (text, tag, extra) => { const key = text.toLowerCase(); if (seen.has(key)) return; seen.add(key); list.push(entry(text, tag, extra)); };
      const fs = head.endsWith('<');                                          // <fs_name>
      const prev = (/([A-Za-z-]+)\s+$/.exec(head) || [])[1] || '';
      const prevU = prev.toUpperCase();

      // code templates: only where a statement starts
      const stmtStart = head.trim() === '' && !data.stmts.some(s => s.endLine === -1 && s.line < cur.line);
      if (stmtStart && word) {
        for (const [kw, title, body] of TEMPLATES) {
          if (!kw.startsWith(U)) continue;
          list.push(entry(title, label('hint.tpl', 'template'), { template: true, hint: (c, d) => insertTemplate(c, d.from, d.to, body) }));
        }
      }
      // names used in this program
      const counts = new Map();
      const names = fs ? data.code.match(/<[A-Za-z_]\w*>/g) : data.code.match(/[A-Za-z_]\w*/g);
      for (const n of names || []) counts.set(n, (counts.get(n) || 0) + 1);
      const tables = Object.keys(window.ABAP_DB || {});
      const wantsTable = /^(FROM|JOIN|OF|TABLES|UPDATE|INTO|MODIFY|STRUCTURE)$/.test(prevU);
      if (wantsTable) for (const t of tables) if (fits(t)) add(t.toLowerCase(), label('hint.table', 'table'));
      for (const [n, count] of counts) {
        const bare = fs ? n.slice(1, -1) : n;
        if (bare.length < 3 || !fits(bare) || WORDS.keywords.has(bare.toUpperCase())) continue;
        if (bare.toLowerCase() === P && count < 2) continue;                  // the word being typed
        add(n, '');
      }
      if (!fs) {
        for (const k of WORDS.keywords) if (k.startsWith(U) && !k.includes(' ')) add(k, '');
        for (const k of WORDS.builtins) if (fits(k)) add(k, '');
        if (!wantsTable) for (const t of tables) if (fits(t)) add(t.toLowerCase(), label('hint.table', 'table'));
      }
      if (fs) from = start - 1;
    }
    if (!list || !list.length) return null;
    list = list.slice(0, 60);
    // nothing to offer when the only suggestion is exactly what is already there
    if (list.length === 1 && !list[0].template && list[0].text.toLowerCase() === P) return null;
    const len = cur.ch - from;
    for (const item of list) {
      const own = item.hint;
      item.hint = (c, d, me) => {
        const r = target(c, len);
        if (own) own(c, r, me); else c.replaceRange(me.text, r.from, r.to, 'complete');
      };
    }
    const docLen = cm.getLine(cur.line).length;                               // a composed word is not in the document yet
    const result = { list, from: Pos(cur.line, Math.min(from, docLen)), to: Pos(cur.line, Math.min(cur.ch, docLen)) };
    // Enter on a word that is already complete starts a new line instead of picking a suggestion
    result.exact = !list[0].template && list.some(x => !x.template && x.text.toLowerCase() === P);
    return result;
  }

  // The part of the page that can be seen, in window coordinates. An on-screen keyboard covers the lower
  // part of the window without making the window smaller, so window.innerHeight is not the limit.
  function visible() {
    if (api._viewport) return api._viewport();
    const vv = window.visualViewport;
    return vv ? { top: vv.offsetTop, bottom: vv.offsetTop + vv.height } : { top: 0, bottom: window.innerHeight };
  }

  // The list is on the page: a tap must not take the focus away, and the list must not hide behind the keyboard.
  function popupShown(cm, data) {
    const done = cm.state.completionActive, el = done && done.widget && done.widget.hints;
    if (!el) return;
    el.addEventListener('mousedown', e => { if (e.target.closest && e.target.closest('li')) e.preventDefault(); });
    const view = visible(), box = el.getBoundingClientRect();
    if (box.top >= view.top && box.bottom <= view.bottom) return;
    const line = cm.cursorCoords(data.from, 'window');
    const below = view.bottom - line.bottom - 6, above = line.top - view.top - 6;
    const up = below < box.height && above > below;
    const height = Math.max(40, Math.min(box.height, up ? above : below));
    el.style.setProperty('max-height', height + 'px', 'important');
    el.style.top = (parseFloat(el.style.top) || 0) + ((up ? line.top - height - 2 : line.bottom) - box.top) + 'px';
  }

  function show(cm, explicit) {
    let moved = false, current = null;
    const pickOrNewline = (c, handle) => {
      if (current && current.exact && !moved) {
        handle.close();
        newline(c);
      } else handle.pick();
    };
    const source = (c, o) => {
      current = hint(c, { explicit });
      if (current) CodeMirror.on(current, 'shown', () => popupShown(c, current));
      return current;
    };
    // a word composed over a selected slot has replaced it on the page, while the document still has the selection
    source.supportsSelection = !!(cm.state.abapIme && cm.state.abapIme.composing);
    cm.showHint({
      hint: source,
      completeSingle: false,
      closeCharacters: /[\s()\[\]{};:,]/,                                     // ">" stays open: obj->member
      extraKeys: {
        Enter: pickOrNewline,
        Up: (c, handle) => { moved = true; handle.moveFocus(-1); },
        Down: (c, handle) => { moved = true; handle.moveFocus(1); }
      }
    });
  }

  // ─────────────────────────────────────────────────────────── wiring
  function attach(cm) {
    cm.addKeyMap({
      Enter: enterKey,
      Tab: c => (nextSlot(c) ? undefined : CodeMirror.Pass),
      Esc: c => { if (!c.state.abapTpl) return CodeMirror.Pass; clearTemplate(c); return undefined; }
    });
    // "change" and not "inputRead": text from an on-screen keyboard never raises "inputRead".
    // Changes made in this handler belong to the same undo step as the typing that caused them.
    cm.on('change', (c, change) => {
      if (change.origin === ORIGIN) return;
      if (c.state.abapTpl) syncMirrors(c);
      if (!api.enabled || change.origin !== '+input') return;
      const t = change.text;
      if (t.length === 2 && soft(c) && !c.state.abapEnterKey) { afterNewline(c, change); return; }
      if (t.length === 1 && t[0]) typed(c, t[0], !CodeMirror.cmpPos(CodeMirror.changeEnd(change), c.getCursor()));
    });
    cm.on('cursorActivity', c => {
      const st = c.state.abapTpl;
      if (!st) return;
      chipSoon(c);
      if (st.moving || st.busy) return;
      const r = st.range.find(), p = c.getCursor();
      if (!r || CodeMirror.cmpPos(p, r.from) < 0 || CodeMirror.cmpPos(p, r.to) > 0) clearTemplate(c);
    });
    cm.on('scroll', c => { if (c.state.abapTpl) chipSoon(c); });
    window.addEventListener('resize', () => { if (cm.state.abapTpl) chipSoon(cm); });

    if (soft(cm)) {
      const field = cm.getInputField(), ime = cm.state.abapIme = { composing: false };
      field.setAttribute('autocomplete', 'off');                              // code, not prose: no word prediction wanted
      field.addEventListener('compositionstart', () => { ime.composing = true; });
      field.addEventListener('compositionend', () => { ime.composing = false; });
      field.addEventListener('input', () => { if (ime.composing && api.enabled) composeTyped(cm); });
    }
  }

  const api = { enabled: true, attach, hint, show, onEnter, nextSlot, templates: TEMPLATES, _scan: scan, _classify: classify };
  window.ABAP_ASSIST = api;
  CodeMirror.registerHelper('hint', 'abap', cm => hint(cm, { explicit: true }));
})(CodeMirror);

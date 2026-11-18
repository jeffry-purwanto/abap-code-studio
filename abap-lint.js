// abap-lint.js — the full ABAP syntax check of the editor
// ABAP Code Studio — Created by jeffrypurwanto
//
// The simulator's own checker (abap-interpreter.js, checkSyntax) knows a list of typical mistakes. SAP checks
// every statement against the complete ABAP grammar, and then the names and types in it. To get the same,
// this module uses abaplint (vendor/abaplint.js — an ABAP parser and syntax check, MIT licence):
//   - parser: each statement must match the ABAP grammar, blocks must be closed
//   - names:  variables, types, methods, FORMs and components must exist and be declared once
//   - types:  a table where a value is expected, incompatible assignments, parameters of a call
//
// The library is 2.4 MB, so it is not part of the page: it is fetched in the background after the start
// (ABAP_LINT.load) and the check works with what is there. Until it has arrived, only checkSyntax runs.
//
// The simulator differs from a real system in a few places; those are evened out here, not in the library:
//   - function modules may be written inside the report (FUNCTION … ENDFUNCTION)   -> that finding is dropped
//   - LOOP … GROUP BY … DESCENDING is valid ABAP the library does not know yet      -> checked as ASCENDING
//   - local exception classes inherit from CX_STATIC_CHECK etc.                      -> small stand-ins below
// Dictionary types (VBAK, SFLIGHT, …) and standard classes are "void": used freely, not checked further.
//
// Messages come out in Indonesian like those of the interpreter, so messages-i18n.js translates them the
// same way. A message of the library without an entry in TEXT below is shown as it is, in English.
(function () {
  'use strict';

  const SRC = 'vendor/abaplint.js';
  let loading = null;

  function load() {
    if (window.abaplint) return Promise.resolve();
    if (!loading) {
      loading = new Promise((ok, fail) => {
        const s = document.createElement('script');
        s.src = SRC;
        s.onload = () => ok();
        s.onerror = () => { loading = null; fail(new Error(SRC)); };      // no connection: the next call tries again
        document.head.appendChild(s);
      });
    }
    return loading;
  }
  const ready = () => !!window.abaplint;

  // ─────────────────────────────────────────────────────────── configuration
  // errorNamespace: names starting like this must exist in the program; everything else (dictionary types,
  // standard classes) is taken as given.
  const CONFIG = {
    global: { files: '/**/*.*' },
    syntax: { version: 'v758', errorNamespace: '^(Z|Y|LCL_|LIF_|LTC_|LCX_|LTD_|TY_|TT_|LTY_|GTY_|LTT_|GTT_)', globalConstants: [], globalMacros: [] },
    rules: { parser_error: true, check_syntax: true, unknown_types: true }
  };

  // standard exception classes a local class may inherit from
  const exc = (name, sup) => `CLASS ${name} DEFINITION PUBLIC ${sup ? 'INHERITING FROM ' + sup + ' ' : ''}ABSTRACT CREATE PUBLIC.
  PUBLIC SECTION.
${sup ? '' : `    DATA textid TYPE c LENGTH 32 READ-ONLY.
    DATA previous TYPE REF TO cx_root READ-ONLY.
    METHODS constructor IMPORTING textid TYPE c OPTIONAL previous TYPE REF TO cx_root OPTIONAL.
    METHODS get_text RETURNING VALUE(result) TYPE string.
    METHODS get_longtext IMPORTING preserve_newlines TYPE c OPTIONAL RETURNING VALUE(result) TYPE string.
    METHODS get_source_position EXPORTING program_name TYPE string include_name TYPE string source_line TYPE i.
`}ENDCLASS.
CLASS ${name} IMPLEMENTATION.
${sup ? '' : `  METHOD constructor.
  ENDMETHOD.
  METHOD get_text.
  ENDMETHOD.
  METHOD get_longtext.
  ENDMETHOD.
  METHOD get_source_position.
  ENDMETHOD.
`}ENDCLASS.`;
  const STUBS = {
    'cx_root.clas.abap': exc('cx_root', ''),
    'cx_static_check.clas.abap': exc('cx_static_check', 'cx_root'),
    'cx_dynamic_check.clas.abap': exc('cx_dynamic_check', 'cx_root'),
    'cx_no_check.clas.abap': exc('cx_no_check', 'cx_root')
  };

  // ─────────────────────────────────────────────────────────── the simulator's dialect
  // Same length as the original, so lines and columns of the findings stay right.
  function normalize(code) {
    return code.replace(/\bLOOP\s+AT\b[^.]*?\bGROUP\s+BY\b[^.]*?\./gi, stmt => stmt.replace(/\bDESCENDING\b/gi, 'ASCENDING '));
  }
  const DROP = [/findFunctionScope/i, /function group/i];

  // ─────────────────────────────────────────────────────────── messages
  // [pattern of the library's message, Indonesian text]. $1, $2 = the captured names.
  const BLOCK = { DATAEND: 'END OF (DATA)', TYPEEND: 'END OF (TYPES)', CONSTANTEND: 'END OF (CONSTANTS)', STATICEND: 'END OF (STATICS)' };
  const TEXT = [
    [/^Statement does not exist in the configured ABAP version\(or a parser error\), "(.*)"$/,
      'Pernyataan yang dimulai dengan "$1" bukan sintaks ABAP yang benar — periksa ejaan kata kunci, kata kunci yang wajib ada, urutannya, dan titik di akhir pernyataan.'],
    [/^Expected (\S+)$/, 'Blok tidak ditutup: $1 tidak ditemukan.'],
    [/^Unexpected (\S+)$/, '$1 tidak pada tempatnya: pernyataan pembukanya tidak ada atau salah tulis.'],
    [/^"(.+)" not found, \w+$/, '"$1" tidak dikenal — belum dideklarasikan (DATA / TYPES / FIELD-SYMBOLS) atau salah ketik.'],
    [/^Variable name "(.+)" already defined$/, '"$1" sudah dideklarasikan — sebuah nama hanya boleh dideklarasikan satu kali dalam scope yang sama.'],
    [/^Type name "(.+)" already defined$/, 'Tipe "$1" sudah didefinisikan — sebuah nama hanya boleh dipakai satu kali dalam scope yang sama.'],
    [/^Method "(.+)" not found/, 'Method "$1" tidak ditemukan di class atau objek itu.'],
    [/^Method definition "(.+)" not found$/, 'METHOD $1 diimplementasikan, tetapi tidak dideklarasikan dengan METHODS di bagian DEFINITION.'],
    [/^Component "(.+)" not found in structure$/, 'Komponen "$1" tidak ada di struktur itu.'],
    [/^FORM definition "(.+)" not found$/, 'FORM "$1" tidak ditemukan di program ini.'],
    [/^PERFORM, expected (\d+) USING\/CHANGING parameters, found (\d+)$/, 'PERFORM: FORM ini menerima $1 parameter USING / CHANGING, tetapi dipanggil dengan $2.'],
    [/^Parameter name too long, (.+)$/, 'Nama "$1" terlalu panjang — nama PARAMETERS dan SELECT-OPTIONS paling banyak 8 karakter.'],
    [/^Incompatible types$/, 'Tipe data tidak cocok: nilai ini tidak bisa diberikan ke variabel tujuannya.'],
    [/^VALUE, source type CharacterType not compatible with StringType$/, 'Baris tabel ini bertipe string: tulis nilainya sebagai literal string dengan backtick (`teks`), bukan dengan tanda kutip tunggal.'],
    [/^Super class "(.+)" not found or contains errors$/, 'Superclass "$1" tidak ditemukan.'],
    [/^Class or type "(.+)" not found$/, 'Class atau tipe "$1" tidak ditemukan.'],
    [/^Variable ".+" contains unknown: .*unable to resolve (\S+)$/, 'Tipe atau class "$1" tidak ditemukan.'],
    [/^(\S+) unknown$/, '"$1" tidak ditemukan.'],
    [/^Method importing parameter "(.+)" does not exist$/, 'Method ini tidak punya parameter "$1".'],
    [/^(?:method p|P)arameter "(.+)" must be supplied$/, 'Parameter wajib "$1" belum diisi pada pemanggilan ini.'],
    [/^"(.+)" cannot be modified, it is readonly$/, '"$1" tidak boleh diubah: ia konstanta atau hanya bisa dibaca.'],
    [/^Loop, not a table type$/, 'LOOP AT hanya untuk internal table — variabel ini bukan tabel.'],
    [/^Append, target not a table type/, 'APPEND … TO hanya untuk internal table — tujuannya bukan tabel.'],
    [/^Read table, not a table type$/, 'READ TABLE hanya untuk internal table — variabel ini bukan tabel.'],
    [/^Not a structure, /, 'Variabel ini bukan struktur, jadi tidak punya komponen (tanda "-").'],
    [/^Implicit or explicit index operation on hashed table/, 'Operasi berindeks (APPEND, INSERT … INDEX, READ … INDEX) tidak boleh dipakai pada HASHED TABLE — gunakan INSERT … INTO TABLE atau akses lewat key.']
  ];
  function text(msg) {
    for (const [re, id] of TEXT) {
      const m = re.exec(msg);
      if (m) return id.replace(/\$(\d)/g, (x, n) => { const v = m[Number(n)] || ''; return BLOCK[v] || v; });
    }
    return msg;
  }

  // ─────────────────────────────────────────────────────────── the check
  // -> [{ line, msg, type: 'error', key }]   key: parser_error | structure | check_syntax | unknown_types
  // Empty when the library is not loaded yet, or when it fails on a program (then checkSyntax alone decides).
  function check(code) {
    if (!ready()) return [];
    try {
      const A = window.abaplint;
      const reg = new A.Registry(new A.Config(JSON.stringify(CONFIG)));
      for (const name of Object.keys(STUBS)) reg.addFile(new A.MemoryFile(name, STUBS[name]));
      reg.addFile(new A.MemoryFile('zprogram.prog.abap', normalize(String(code || ''))));
      reg.parse();
      const out = [], seen = new Set();
      for (const i of reg.findIssues()) {
        if (i.getFilename() !== 'zprogram.prog.abap') continue;
        const raw = i.getMessage();
        if (DROP.some(re => re.test(raw))) continue;
        const item = { line: i.getStart().getRow(), msg: text(raw), type: 'error', key: i.getKey() };
        const k = item.line + '\u0001' + item.msg;
        if (!seen.has(k)) { seen.add(k); out.push(item); }
      }
      return out.sort((a, b) => a.line - b.line);
    } catch (e) {
      return [];
    }
  }

  window.ABAP_LINT = { load, ready, check, _text: text };
})();

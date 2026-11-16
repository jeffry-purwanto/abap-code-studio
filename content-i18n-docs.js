// content-i18n-docs.js — translated content of the Quick Reference (Docs)
// ABAP Code Studio — Created by jeffrypurwanto
//
// Augments window.ABAP_CONTENT_I18N.docs[lang][id] with { content }.
// Each topic is a template (structure + ABAP code written once); only the prose
// and the code comments differ per language, so the three versions stay in sync.
(function () {
  if (!window.ABAP_CONTENT_I18N) return;
  const C = window.ABAP_CONTENT_I18N;

  const TPL = {
    intro: t => `
      <h3>${t.h}</h3>
      <p>${t.p}</p>
      <h4>${t.h1}</h4>
      <p>• ${t.b1}<br>• ${t.b2}<br>• ${t.b3}<br>• ${t.b4}</p>
      <h4>${t.h2}</h4>
      <code>REPORT z_my_program.

DATA: lv_text TYPE string VALUE 'Hello World'.
WRITE: / lv_text.</code>
    `,

    data: t => `
      <h3>${t.h}</h3>
      <h4>${t.h1}</h4>
      <code>DATA: variable_name TYPE data_type [VALUE initial_value].</code>
      <h4>${t.h2}</h4>
      <code>" ${t.cInt}
DATA: lv_count TYPE i VALUE 0.

" ${t.cFloat}
DATA: lv_pi TYPE f VALUE '3.14159'.

" ${t.cPack}
DATA: lv_amount TYPE p DECIMALS 2 VALUE '1000.50'.

" ${t.cChar}
DATA: lv_code TYPE c LENGTH 4 VALUE 'ABCD'.

" ${t.cStr}
DATA: lv_name TYPE string VALUE 'SAP Developer'.

" ${t.cDate}
DATA: lv_date TYPE d.

" ${t.cTime}
DATA: lv_time TYPE t.</code>
      <h4>${t.h3}</h4>
      <code>DATA: lv_a TYPE i,
      lv_b TYPE string,
      lv_c TYPE f VALUE '0.5'.</code>
      <h4>${t.h4}</h4>
      <code>CONSTANTS: gc_max TYPE i VALUE 100,
               gc_pi  TYPE f VALUE '3.14159'.</code>
    `,

    operators: t => `
      <h3>${t.h}</h3>
      <h4>${t.h1}</h4>
      <code>" ${t.cModern}
lv_result = lv_a + lv_b.
lv_result = lv_a - lv_b.
lv_result = lv_a * lv_b.
lv_result = lv_a / lv_b.
lv_result = lv_a MOD lv_b.  " ${t.cMod}
lv_result = lv_a ** 2.       " ${t.cPow}

" ${t.cClassic}
ADD lv_b TO lv_a.            " lv_a = lv_a + lv_b
SUBTRACT lv_b FROM lv_a.     " lv_a = lv_a - lv_b
MULTIPLY lv_a BY lv_b.       " lv_a = lv_a * lv_b
DIVIDE lv_a BY lv_b.         " lv_a = lv_a / lv_b</code>
      <h4>${t.h2}</h4>
      <code>"    =    EQ    ${t.eq}
"   &lt;&gt;    NE    ${t.ne}
"    &lt;    LT    ${t.lt}
"    &gt;    GT    ${t.gt}
"   &lt;=    LE    ${t.le}
"   &gt;=    GE    ${t.ge}

IF lv_a EQ lv_b.  " ${t.or}  IF lv_a = lv_b.
IF lv_x IS INITIAL.          " ${t.cInit}
IF lv_x IS NOT INITIAL.</code>
      <h4>${t.h3}</h4>
      <code>IF lv_a &gt; 0 AND lv_b &gt; 0.
IF lv_a = 0 OR lv_b = 0.
IF NOT lv_flag = 'X'.</code>
    `,

    control: t => `
      <h3>${t.h}</h3>
      <h4>IF / ELSEIF / ELSE</h4>
      <code>IF lv_score &gt;= 90.
  WRITE: / 'Excellent'.
ELSEIF lv_score &gt;= 70.
  WRITE: / 'Good'.
ELSE.
  WRITE: / 'Needs improvement'.
ENDIF.</code>
      <h4>CASE / WHEN</h4>
      <code>CASE lv_status.
  WHEN 'A'. WRITE: / 'Active'.
  WHEN 'I'. WRITE: / 'Inactive'.
  WHEN OTHERS. WRITE: / 'Unknown'.
ENDCASE.</code>
      <h4>DO ... TIMES</h4>
      <code>DO 5 TIMES.
  WRITE: / 'Iteration:', sy-index.
ENDDO.</code>
      <h4>WHILE</h4>
      <code>DATA: lv_n TYPE i VALUE 1.
WHILE lv_n &lt;= 10.
  WRITE: / lv_n.
  lv_n = lv_n + 1.
ENDWHILE.</code>
      <h4>${t.h1}</h4>
      <code>EXIT.      " ${t.cExit}
CONTINUE.  " ${t.cCont}
CHECK condition.  " ${t.cCheck}
RETURN.    " ${t.cRet}</code>
    `,

    string: t => `
      <h3>${t.h}</h3>
      <h4>CONCATENATE</h4>
      <code>DATA: lv_first  TYPE string VALUE 'Hello',
      lv_second TYPE string VALUE 'World',
      lv_result TYPE string.

CONCATENATE lv_first lv_second INTO lv_result.
" lv_result = 'HelloWorld'

CONCATENATE lv_first lv_second INTO lv_result
  SEPARATED BY ' '.
" lv_result = 'Hello World'</code>
      <h4>SPLIT</h4>
      <code>DATA: lv_csv TYPE string VALUE 'A,B,C',
      lv_1 TYPE string, lv_2 TYPE string, lv_3 TYPE string.

SPLIT lv_csv AT ',' INTO lv_1 lv_2 lv_3.</code>
      <h4>TRANSLATE</h4>
      <code>TRANSLATE lv_text TO UPPER CASE.
TRANSLATE lv_text TO LOWER CASE.</code>
      <h4>CONDENSE</h4>
      <code>CONDENSE lv_text.          " ${t.cTrim}
CONDENSE lv_text NO-GAPS.  " ${t.cNoGaps}</code>
      <h4>${t.h1}</h4>
      <code>DATA: lv_len TYPE i.
lv_len = STRLEN( lv_text ).   " ${t.cLen}

" ${t.cBuiltin}
lv_text = to_upper( lv_text ).
lv_text = to_lower( lv_text ).
lv_text = condense( lv_text ).
lv_len  = strlen( lv_text ).</code>
    `,

    itab: t => `
      <h3>${t.h}</h3>
      <p>${t.p}</p>
      <h4>${t.h1}</h4>
      <code>" STANDARD TABLE - ${t.cStd}
DATA: lt_data TYPE STANDARD TABLE OF string.

" SORTED TABLE - ${t.cSorted}
DATA: lt_sorted TYPE SORTED TABLE OF string
  WITH NON-UNIQUE KEY table_line.

" HASHED TABLE - ${t.cHashed}
DATA: lt_hash TYPE HASHED TABLE OF string
  WITH UNIQUE KEY table_line.</code>
      <h4>${t.h2}</h4>
      <code>TYPES: BEGIN OF ty_line,
         id   TYPE i,
         name TYPE string,
       END OF ty_line.

DATA: lt_tab TYPE TABLE OF ty_line,
      ls_row TYPE ty_line.</code>
      <h4>${t.h3}</h4>
      <code>" ${t.cAdd}
ls_row-id = 1. ls_row-name = 'Alice'.
APPEND ls_row TO lt_tab.

" ${t.cLoop}
LOOP AT lt_tab INTO ls_row.
  WRITE: / ls_row-id, ls_row-name.
ENDLOOP.

" ${t.cSort}
SORT lt_tab BY name.

" ${t.cRead}
READ TABLE lt_tab WITH KEY id = 1 INTO ls_row.
IF sy-subrc = 0. WRITE: / 'Found:', ls_row-name. ENDIF.

" ${t.cDel}
DELETE lt_tab INDEX 1.

" ${t.cCount}
DATA: lv_cnt TYPE i.
DESCRIBE TABLE lt_tab LINES lv_cnt.
" ${t.cOr}
lv_cnt = lines( lt_tab ).</code>
    `,

    subroutines: t => `
      <h3>${t.h}</h3>
      <code>PERFORM my_form USING lv_a lv_b CHANGING lv_result.

FORM my_form
  USING    pv_a TYPE i
           pv_b TYPE i
  CHANGING cv_result TYPE i.

  cv_result = pv_a + pv_b.

ENDFORM.</code>
      <h3>${t.h2}</h3>
      <code>CLASS lcl_math DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS:
      add IMPORTING iv_a TYPE i
                    iv_b TYPE i
          RETURNING VALUE(rv_sum) TYPE i.
ENDCLASS.

CLASS lcl_math IMPLEMENTATION.
  METHOD add.
    rv_sum = iv_a + iv_b.
  ENDMETHOD.
ENDCLASS.

" ${t.cCall}
DATA(lv_sum) = lcl_math=&gt;add( iv_a = 10 iv_b = 20 ).</code>
    `,

    sysfields: t => `
      <h3>${t.h}</h3>
      <p>${t.p}</p>
      <h4>${t.h1}</h4>
      <code>" SY-SUBRC : ${t.cSubrc}
IF sy-subrc = 0.
  WRITE: / 'Operation successful'.
ENDIF.

" SY-TABIX : ${t.cTabix}
LOOP AT lt_data INTO ls_line.
  WRITE: / 'Row #', sy-tabix.
ENDLOOP.

" SY-INDEX : ${t.cIndex}
DO 5 TIMES.
  WRITE: / sy-index.  " 1, 2, 3, 4, 5
ENDDO.

" SY-UNAME : ${t.cUname}
WRITE: / 'Logged in as:', sy-uname.

" SY-DATUM : ${t.cDatum}
WRITE: / 'Today:', sy-datum.

" SY-UZEIT : ${t.cUzeit}
WRITE: / 'Time:', sy-uzeit.

" SY-MANDT : ${t.cMandt}
WRITE: / 'Client:', sy-mandt.

" SY-REPID : ${t.cRepid}
WRITE: / 'Program:', sy-repid.</code>
    `,

    select: t => `
      <h3>${t.h}</h3>
      <p>${t.p}</p>
      <h4>${t.h1}</h4>
      <code>" ${t.cModern}
SELECT carrid, carrname, currcode
  FROM scarr
  INTO TABLE @gt_scarr
  WHERE carrid = @p_carrid.

IF sy-subrc = 0.
  LOOP AT gt_scarr INTO gs_scarr.
    WRITE: / gs_scarr-carrid, gs_scarr-carrname.
  ENDLOOP.
ENDIF.</code>
      <h4>${t.h2}</h4>
      <code>SELECT * FROM mara INTO TABLE @gt_mara WHERE mtart = 'FERT'.</code>
      <h4>SELECT SINGLE</h4>
      <code>SELECT SINGLE * FROM scarr INTO @gs_scarr WHERE carrid = 'LH'.
IF sy-subrc = 0.
  WRITE: / 'Found:', gs_scarr-carrname.
ENDIF.</code>
      <h4>${t.h3}</h4>
      <code>" sy-subrc = 0 : ${t.c0}
" sy-subrc = 4 : ${t.c4}
" sy-dbcnt     : ${t.cCnt}</code>
    `,

    alv: t => `
      <h3>ALV (ABAP List Viewer)</h3>
      <p>${t.p}</p>
      <h4>${t.h1}</h4>
      <code>DATA: gt_data TYPE TABLE OF sflight,
      lo_alv  TYPE REF TO cl_salv_table.

SELECT * FROM sflight INTO TABLE @gt_data.

cl_salv_table=&gt;factory(
  IMPORTING r_salv_table = lo_alv
  CHANGING  t_table      = gt_data ).

lo_alv-&gt;display( ).</code>
      <h4>${t.h2}</h4>
      <code>DATA: gt_data TYPE TABLE OF scarr.

SELECT * FROM scarr INTO TABLE @gt_data.

CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
  EXPORTING
    i_structure_name = 'SCARR'
  TABLES
    t_outtab         = gt_data.</code>
      <h4>${t.h3}</h4>
      <p>${t.p2}</p>
      <code>DATA: gt_fieldcat TYPE slis_t_fieldcat_alv,
      gs_fieldcat TYPE slis_fieldcat_alv,
      gs_layout   TYPE slis_layout_alv.

CLEAR gs_fieldcat.
gs_fieldcat-fieldname = 'CARRID'.     " ${t.cName}
gs_fieldcat-seltext_m = '${t.lAirline}'.   " ${t.cTitle}
gs_fieldcat-key       = 'X'.          " ${t.cKey}
APPEND gs_fieldcat TO gt_fieldcat.

CLEAR gs_fieldcat.
gs_fieldcat-fieldname = 'PRICE'.
gs_fieldcat-seltext_m = '${t.lPrice}'.
gs_fieldcat-do_sum    = 'X'.          " ${t.cSum}
APPEND gs_fieldcat TO gt_fieldcat.

gs_layout-zebra = 'X'.

CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
  EXPORTING
    i_callback_program = sy-repid
    i_grid_title       = '${t.lGrid}'
    is_layout          = gs_layout
    it_fieldcat        = gt_fieldcat
  TABLES
    t_outtab           = gt_data
  EXCEPTIONS
    program_error      = 1
    OTHERS             = 2.</code>
      <p>${t.p3a} <strong>fieldname, seltext_s/m/l, reptext_ddic, outputlen, col_pos, key, do_sum, no_out, tech, just, emphasize</strong>.
         ${t.lay} <strong>zebra, colwidth_optimize, window_titlebar</strong>. ${t.p3b} <strong>it_sort</strong> (fieldname + up/down).
         <code>REUSE_ALV_FIELDCATALOG_MERGE</code> ${t.p3c} <code>i_structure_name</code>${t.p3d}</p>
      <h4>${t.h4}</h4>
      <p>${t.p4}</p>
    `,

    function: t => `
      <h3>CALL FUNCTION</h3>
      <p>${t.p}</p>
      <code>CALL FUNCTION '${t.fm}'
  EXPORTING              " ${t.c1}
    ${t.pin}  = ${t.vin}
  IMPORTING              " ${t.c2}
    ${t.pout} = ${t.vout}
  CHANGING               " ${t.c3}
    ${t.pchg}   = lv_data
  TABLES                 " ${t.c4}
    ${t.ptab}        = gt_data
  EXCEPTIONS             " ${t.c5}
    ${t.perr}   = 1
    OTHERS       = 2.

IF sy-subrc &lt;&gt; 0.
  " ${t.c6}
ENDIF.</code>
      <p>${t.p2}</p>
      <h4>${t.h1}</h4>
      <code>" ── ALV ──────────────────────────────────────────────────────
REUSE_ALV_GRID_DISPLAY        EXPORTING i_callback_program i_structure_name i_grid_title
                                        i_callback_user_command i_callback_top_of_page
                                        is_layout it_fieldcat it_sort
                              TABLES    t_outtab
                              EXCEPTIONS program_error
REUSE_ALV_LIST_DISPLAY        ${t.same}
REUSE_ALV_GRID_DISPLAY_LVC    EXPORTING is_layout_lvc it_fieldcat_lvc it_sort_lvc ...
REUSE_ALV_FIELDCATALOG_MERGE  EXPORTING i_structure_name   CHANGING ct_fieldcat
LVC_FIELDCATALOG_MERGE        EXPORTING i_structure_name   CHANGING ct_fieldcat
REUSE_ALV_COMMENTARY_WRITE    EXPORTING it_list_commentary          " ${t.hdr}
REUSE_ALV_EVENTS_GET          IMPORTING et_events

" ── ${t.sConv} ──────────────────────────────────────────
CONVERSION_EXIT_ALPHA_INPUT   EXPORTING input   IMPORTING output   " 1000 -> 0000001000
CONVERSION_EXIT_ALPHA_OUTPUT  EXPORTING input   IMPORTING output   " 0000001000 -> 1000

" ── ${t.sDate} ──────────────────────────────────────────
DATE_COMPUTE_DAY              EXPORTING date    IMPORTING day      " ${t.days}
DATE_CHECK_PLAUSIBILITY       EXPORTING date    EXCEPTIONS plausibility_check_failed
RP_LAST_DAY_OF_MONTHS         EXPORTING day_in  IMPORTING last_day_of_month
                              EXCEPTIONS day_in_no_date
RP_CALC_DATE_IN_INTERVAL      EXPORTING date days months years signum
                              IMPORTING calc_date

" ── ${t.sDlg} ──────────────────────────────────────────
POPUP_TO_CONFIRM              EXPORTING titlebar text_question
                              IMPORTING answer                     " ${t.yn}
POPUP_TO_INFORM               EXPORTING titel txt1 txt2
SAPGUI_PROGRESS_INDICATOR     EXPORTING percentage text
GUI_DOWNLOAD                  EXPORTING filename   TABLES data_tab " ${t.sim}
GUI_UPLOAD                    ${t.up}

" ── BAPI ─────────────────────────────────────────────────────
BAPI_TRANSACTION_COMMIT, BAPI_TRANSACTION_ROLLBACK</code>
      <h4>${t.h2}</h4>
      <code>cl_salv_table=&gt;factory( IMPORTING r_salv_table = lo_alv CHANGING t_table = itab ).
lo_alv-&gt;display( ).
lo_alv-&gt;get_display_settings( )-&gt;set_striped_pattern( abap_true ).
lo_alv-&gt;get_display_settings( )-&gt;set_list_header( '${t.lTitle}' ).

go_grid-&gt;set_table_for_first_display(      " CL_GUI_ALV_GRID
  EXPORTING i_structure_name = 'SFLIGHT' is_layout = gs_layout
  CHANGING  it_outtab = gt_data it_fieldcatalog = gt_fcat ).

cl_demo_output=&gt;display( lt_data ).        " ${t.cDemo}</code>
      <h4>${t.h3}</h4>
      <p>${t.p3}</p>
    `,

    simulator: t => `
      <h3>${t.h}</h3>
      <p>${t.p}</p>
      <h4>${t.h1}</h4>
      <p>${t.sup.map(([k, v]) => `• <strong>${k}</strong>: ${v}`).join('<br>\n         ')}</p>
      <h4>${t.h2}</h4>
      <p>${t.diff.map(v => `• ${v}`).join('<br>\n         ')}</p>
      <h4>${t.h3}</h4>
      <p>${t.not.map(v => `• ${v}`).join('<br>\n         ')}</p>
    `
  };

  const TXT = {
    // ============================== ENGLISH ==============================
    en: {
      intro: {
        h: 'What is ABAP?',
        p: 'ABAP (Advanced Business Application Programming) is a high-level programming language developed by SAP. It is used to build business applications on SAP platforms such as SAP ERP, S/4HANA, and BTP.',
        h1: 'Characteristics of ABAP',
        b1: 'Interpreted/compiled on the ABAP Application Server',
        b2: 'Case-insensitive (keywords are usually written in UPPERCASE)',
        b3: 'Every statement ends with a period (.)',
        b4: 'Supports OOP (ABAP Objects) since release 4.6',
        h2: 'Minimal program structure'
      },
      data: {
        h: 'Declaring variables', h1: 'Basic syntax', h2: 'Primitive data types',
        cInt: 'Integer', cFloat: 'Floating point', cPack: 'Packed decimal (money / exact decimals)',
        cChar: 'Character (fixed length)', cStr: 'String (variable length)',
        cDate: 'Date (format: YYYYMMDD)', cTime: 'Time (format: HHMMSS)',
        h3: 'Chained declaration (several variables)', h4: 'Constants'
      },
      operators: {
        h: 'ABAP operators', h1: 'Arithmetic operators',
        cModern: 'Modern syntax (ABAP 7.4+)', cMod: 'Modulo', cPow: 'Power', cClassic: 'Classic syntax',
        h2: 'Comparison operators',
        eq: 'Equal', ne: 'Not equal', lt: 'Less than', gt: 'Greater than', le: 'Less or equal', ge: 'Greater or equal',
        or: 'or', cInit: 'Check whether empty / zero',
        h3: 'Logical operators'
      },
      control: {
        h: 'Branching & loops', h1: 'Control keywords',
        cExit: 'Leave the loop or the program', cCont: 'Go to the next iteration',
        cCheck: 'Skip the iteration if false', cRet: 'Leave the method / FORM'
      },
      string: {
        h: 'String manipulation', cTrim: 'Trim & single spaces', cNoGaps: 'Remove all spaces',
        h1: 'STRLEN & string functions', cLen: 'Length of the string', cBuiltin: 'Modern ABAP built-in functions:'
      },
      itab: {
        h: 'Internal Tables',
        p: "An internal table is ABAP's typed array data structure and is used all the time.",
        h1: 'Kinds of internal table',
        cStd: 'access by index', cSorted: 'sorted automatically', cHashed: 'fast access by key',
        h2: 'Structure + table', h3: 'Basic operations',
        cAdd: 'Add a row', cLoop: 'Loop', cSort: 'Sort', cRead: 'Read', cDel: 'Delete', cCount: 'Count', cOr: 'or:'
      },
      subroutines: { h: 'FORM subroutine (classic)', h2: 'OO ABAP – method', cCall: 'Calling a static method:' },
      sysfields: {
        h: 'ABAP System Fields',
        p: 'System fields are built-in variables that the ABAP runtime fills automatically.',
        h1: 'Most commonly used',
        cSubrc: 'Return code (0 = success, 4 = not found, etc.)',
        cTabix: 'Current index during LOOP AT an internal table',
        cIndex: 'Current counter in DO / WHILE',
        cUname: 'The user who is logged in',
        cDatum: 'System date (format YYYYMMDD)',
        cUzeit: 'System time (format HHMMSS)',
        cMandt: 'Current SAP client',
        cRepid: 'Name of the running program'
      },
      select: {
        h: 'SELECT — Open SQL database access',
        p: 'In ABAP Code Studio, <code>SELECT</code> queries <strong>can be run directly</strong> against sample copies of standard SAP tables (SCARR, SFLIGHT, SPFLI, MARA, MAKT, KNA1, etc.).',
        h1: 'SELECT into an internal table',
        cModern: 'Modern form (ABAP 7.4+) with host variables @',
        h2: 'SELECT all columns',
        h3: 'Return codes (SY-SUBRC & SY-DBCNT)',
        c0: 'Data found', c4: 'No matching data', cCnt: 'Number of rows fetched'
      },
      alv: {
        p: "ALV is SAP's standard component for displaying internal table data as an interactive spreadsheet-like grid with sorting, filtering, and totals.",
        h1: '1. Modern OO ALV (CL_SALV_TABLE)',
        h2: '2. Classic ALV (function module)',
        h3: '3. Classic ALV with a field catalog',
        p2: 'The field catalog decides which columns appear, their headings, and their properties. One field catalog row = one column.',
        cName: 'component name, UPPER CASE', cTitle: 'column heading', cKey: 'key column', cSum: 'totalled',
        lAirline: 'Airline', lPrice: 'Price', lGrid: 'Grid title',
        p3a: 'Recognised field catalog components:', lay: 'Layout:', p3b: 'Initial sort through',
        p3c: 'builds the field catalog automatically from', p3d: '.',
        h4: 'ALV in this studio',
        p4: 'The ALV grid appears directly in the <strong>Output</strong> panel, in sequence with the <code>WRITE</code> output. A program may show more than one grid.<br>• <strong>Sorting</strong>: double-click a column heading, or select the column (one click) and use the ↑ / ↓ buttons<br>• <strong>Filter</strong>: the search box in the grid toolbar<br>• <strong>Totals (Σ)</strong>: the Σ button — <code>do_sum</code> columns are totalled automatically<br>• <strong>Export CSV</strong>: the download button'
      },
      function: {
        p: 'A function module (FM) is a ready-made procedure. The whole call is <strong>one</strong> statement — the period comes only at the end.',
        fm: 'FM_NAME', pin: 'input_param ', vin: 'lv_value', pout: 'output_param', vout: 'lv_result',
        pchg: 'changed_param', ptab: 'table_param', perr: 'error_name',
        c1: 'program -> FM', c2: 'FM -> program', c3: 'both ways', c4: 'internal table', c5: 'error name -> sy-subrc', c6: 'handle the error',
        p2: 'An exception that is not mapped under <code>EXCEPTIONS</code> stops the program (short dump). FMs that are not simulated are skipped with a warning.',
        h1: 'Simulated function modules',
        same: '(same parameters as GRID)', hdr: 'header above the grid (TOP_OF_PAGE)',
        sConv: 'Conversion', sDate: 'Dates', sDlg: 'Dialogs & files',
        days: '1 = Monday ... 7 = Sunday', yn: "'1' = Yes, '2' = No",
        sim: 'simulated, no real file', up: 'always raises FILE_OPEN_ERROR',
        h2: 'Simulated standard classes', lTitle: 'Title', cDemo: 'quick print of a variable / table',
        h3: 'Your own function modules',
        p3: 'Write <code>FUNCTION name. … ENDFUNCTION.</code> in the same program. Its interface is read from the <code>*"</code> comment block below the FUNCTION line (IMPORTING, EXPORTING, CHANGING, TABLES, EXCEPTIONS) — see the lesson "Writing your own function module".'
      },
      simulator: {
        h: 'What can run in this studio',
        p: 'This studio is a <strong>simulator for learning</strong>, not an SAP system. Code that runs here follows real ABAP syntax, and its error and warning messages are made to resemble SAP\'s behaviour as closely as possible. Program results appear in the Output panel and on the <strong>SAP-style result screen</strong> (it can be switched off under "SAP-style result screen" in the ⋯ menu; Esc or F3 to go back).',
        h1: 'Supported',
        sup: [
          ['Basics', 'DATA, TYPES, CONSTANTS, STATICS, structures (BEGIN OF … END OF), IF, CASE, DO, WHILE, EXIT, CONTINUE, CHECK, types c / n / p / d / t with their lengths and decimals'],
          ['Lists', 'WRITE with position and length (<code>/5(10)</code>), NO-GAP, date / time / decimal formatting, ULINE, SKIP, TOP-OF-PAGE, HIDE + AT LINE-SELECTION (double-click a line)'],
          ['Report events', "INITIALIZATION, AT SELECTION-SCREEN, START-OF-SELECTION, END-OF-SELECTION in SAP's order; MESSAGE of type E / A / X stops the program"],
          ['Strings', 'CONCATENATE, SPLIT, CONDENSE, TRANSLATE, REPLACE, FIND, SHIFT, &amp;&amp;, string templates |…| with format options, offset +n(m), CS / CP / CO / CA, the functions to_upper, substring, replace, condense, contains …'],
          ['Internal tables', 'APPEND, INSERT, MODIFY, DELETE, COLLECT, SORT, READ TABLE, LOOP (INTO / ASSIGNING / REFERENCE INTO / WHERE / FROM-TO), AT NEW / AT END OF / SUM, STANDARD / SORTED / HASHED tables, header lines and OCCURS'],
          ['Modularisation', 'FORM / PERFORM (TABLES, USING, CHANGING, local variables, recursion), macros (DEFINE), your own function modules (FUNCTION … ENDFUNCTION), CALL FUNCTION'],
          ['Selection screen', 'PARAMETERS (CHECKBOX, RADIOBUTTON, OBLIGATORY), SELECT-OPTIONS, RANGES, the Parameter button (F8)'],
          ['Open SQL', 'SELECT (SINGLE, INTO TABLE, WHERE, ORDER BY, UP TO n ROWS, DISTINCT), the aggregates COUNT / SUM / MAX / MIN / AVG, GROUP BY, HAVING, INNER / LEFT OUTER JOIN, FOR ALL ENTRIES, SELECT … ENDSELECT, INSERT / UPDATE / MODIFY / DELETE, COMMIT / ROLLBACK WORK'],
          ['OO ABAP', 'local classes, attributes &amp; methods (instance and static), constructor, visibility, READ-ONLY, inheritance, REDEFINITION, super-&gt;, interfaces, events (EVENTS / RAISE EVENT / SET HANDLER), NEW, CREATE OBJECT, CAST, IS INSTANCE OF'],
          ['Exceptions', 'TRY / CATCH / ENDTRY, RAISE EXCEPTION, your own exception classes, cx_sy_zerodivide, cx_sy_ref_is_initial, cx_sy_itab_line_not_found, cx_sy_conversion_no_number'],
          ['Modern', 'DATA( ), FIELD-SYMBOL( ), VALUE (including FOR and BASE), COND, SWITCH, CONV, REDUCE, CORRESPONDING, table expressions <code>itab[ … ]</code>, line_exists( ), host variables @'],
          ['Dynamic', 'field symbols, data references (REF #, GET REFERENCE, CREATE DATA, -&gt;*), ASSIGN COMPONENT, ASSIGN (name)'],
          ['ALV', 'REUSE_ALV_GRID_DISPLAY (field catalog, layout, sort, totals, hotspot, user command, top of page), CL_SALV_TABLE (columns, sorts, aggregations, the events link_click / double_click), CL_GUI_ALV_GRID']
        ],
        h2: 'What differs from SAP',
        diff: [
          'Database tables are sample data (the <strong>Tables</strong> view). Changes made with INSERT / UPDATE / DELETE last only while the program runs.',
          'Function modules are written in the same program; their interface is read from the <code>*"</code> comment block, as SE37 displays it.',
          'Text symbols (<code>TEXT-001</code>) and message classes are not managed; the text appears as its code.',
          "The language keys in the sample data are <code>'EN'</code> / <code>'ID'</code>, and <code>sy-langu</code> holds <code>'EN'</code>.",
          "WRITE separates values with one space; SAP's automatic column width per data type is not imitated — use column positions when you need alignment."
        ],
        h3: 'Not supported yet',
        not: [
          'Dynpro / screens (CALL SCREEN, MODULE, PBO / PAI): screens are built in the Screen Painter, not in code',
          'LOOP AT … GROUP BY, SQL subqueries, UNION, CDS views, AMDP',
          'Global classes (SE24), friends, test classes (ABAP Unit), RTTS (cl_abap_typedescr)',
          'Files and system: OPEN DATASET, EXPORT / IMPORT MEMORY, SUBMIT, CALL TRANSACTION (only shown as a message), background jobs',
          'Unknown statements are skipped with a warning, not executed silently'
        ]
      }
    },

    // ============================== DEUTSCH ==============================
    de: {
      intro: {
        h: 'Was ist ABAP?',
        p: 'ABAP (Advanced Business Application Programming) ist eine von SAP entwickelte höhere Programmiersprache. Mit ihr werden Geschäftsanwendungen auf SAP-Plattformen wie SAP ERP, S/4HANA und BTP entwickelt.',
        h1: 'Eigenschaften von ABAP',
        b1: 'Wird auf dem ABAP Application Server interpretiert/kompiliert',
        b2: 'Keine Unterscheidung von Groß-/Kleinschreibung (Schlüsselwörter meist in GROSSBUCHSTABEN)',
        b3: 'Jede Anweisung endet mit einem Punkt (.)',
        b4: 'Unterstützt OOP (ABAP Objects) seit Release 4.6',
        h2: 'Minimale Programmstruktur'
      },
      data: {
        h: 'Variablen deklarieren', h1: 'Grundsyntax', h2: 'Elementare Datentypen',
        cInt: 'Ganzzahl', cFloat: 'Gleitkommazahl', cPack: 'Gepackte Zahl (Geld / exakte Dezimalzahlen)',
        cChar: 'Zeichen (feste Länge)', cStr: 'String (variable Länge)',
        cDate: 'Datum (Format: YYYYMMDD)', cTime: 'Zeit (Format: HHMMSS)',
        h3: 'Kettendeklaration (mehrere Variablen)', h4: 'Konstanten'
      },
      operators: {
        h: 'ABAP-Operatoren', h1: 'Arithmetische Operatoren',
        cModern: 'Moderne Syntax (ABAP 7.4+)', cMod: 'Modulo', cPow: 'Potenz', cClassic: 'Klassische Syntax',
        h2: 'Vergleichsoperatoren',
        eq: 'Gleich', ne: 'Ungleich', lt: 'Kleiner als', gt: 'Größer als', le: 'Kleiner oder gleich', ge: 'Größer oder gleich',
        or: 'oder', cInit: 'Prüfen, ob leer / null',
        h3: 'Logische Operatoren'
      },
      control: {
        h: 'Verzweigungen & Schleifen', h1: 'Steuerschlüsselwörter',
        cExit: 'Schleife oder Programm verlassen', cCont: 'Zum nächsten Durchlauf',
        cCheck: 'Durchlauf überspringen, wenn falsch', cRet: 'Methode / FORM verlassen'
      },
      string: {
        h: 'String-Verarbeitung', cTrim: 'Kürzen & einfache Leerzeichen', cNoGaps: 'Alle Leerzeichen entfernen',
        h1: 'STRLEN & String-Funktionen', cLen: 'Länge des Strings', cBuiltin: 'Moderne eingebaute ABAP-Funktionen:'
      },
      itab: {
        h: 'Interne Tabellen',
        p: 'Eine interne Tabelle ist die typisierte Array-Datenstruktur von ABAP und wird ständig verwendet.',
        h1: 'Arten interner Tabellen',
        cStd: 'Zugriff über Index', cSorted: 'automatisch sortiert', cHashed: 'schneller Zugriff über Schlüssel',
        h2: 'Struktur + Tabelle', h3: 'Grundoperationen',
        cAdd: 'Zeile hinzufügen', cLoop: 'Schleife', cSort: 'Sortieren', cRead: 'Lesen', cDel: 'Löschen', cCount: 'Zählen', cOr: 'oder:'
      },
      subroutines: { h: 'FORM-Unterprogramm (klassisch)', h2: 'OO ABAP – Methode', cCall: 'Statische Methode aufrufen:' },
      sysfields: {
        h: 'ABAP-Systemfelder',
        p: 'Systemfelder sind eingebaute Variablen, die die ABAP-Laufzeit automatisch füllt.',
        h1: 'Am häufigsten verwendet',
        cSubrc: 'Rückgabecode (0 = Erfolg, 4 = nicht gefunden usw.)',
        cTabix: 'Aktueller Index während LOOP AT einer internen Tabelle',
        cIndex: 'Aktueller Zähler in DO / WHILE',
        cUname: 'Angemeldeter Benutzer',
        cDatum: 'Systemdatum (Format YYYYMMDD)',
        cUzeit: 'Systemzeit (Format HHMMSS)',
        cMandt: 'Aktueller SAP-Mandant',
        cRepid: 'Name des laufenden Programms'
      },
      select: {
        h: 'SELECT — Datenbankzugriff mit Open SQL',
        p: 'In ABAP Code Studio können <code>SELECT</code>-Abfragen <strong>direkt ausgeführt</strong> werden — gegen Beispielkopien von SAP-Standardtabellen (SCARR, SFLIGHT, SPFLI, MARA, MAKT, KNA1 usw.).',
        h1: 'SELECT in eine interne Tabelle',
        cModern: 'Moderne Form (ABAP 7.4+) mit Host-Variablen @',
        h2: 'SELECT aller Spalten',
        h3: 'Rückgabecodes (SY-SUBRC & SY-DBCNT)',
        c0: 'Daten gefunden', c4: 'Keine passenden Daten', cCnt: 'Anzahl gelesener Zeilen'
      },
      alv: {
        p: 'ALV ist die SAP-Standardkomponente, um Daten einer internen Tabelle als interaktives, tabellenartiges Grid mit Sortierung, Filter und Summen anzuzeigen.',
        h1: '1. Modernes OO-ALV (CL_SALV_TABLE)',
        h2: '2. Klassisches ALV (Funktionsbaustein)',
        h3: '3. Klassisches ALV mit Feldkatalog',
        p2: 'Der Feldkatalog bestimmt, welche Spalten erscheinen, ihre Überschriften und Eigenschaften. Eine Feldkatalog-Zeile = eine Spalte.',
        cName: 'Komponentenname, GROSSBUCHSTABEN', cTitle: 'Spaltenüberschrift', cKey: 'Schlüsselspalte', cSum: 'wird summiert',
        lAirline: 'Fluggesellschaft', lPrice: 'Preis', lGrid: 'Grid-Titel',
        p3a: 'Erkannte Feldkatalog-Komponenten:', lay: 'Layout:', p3b: 'Anfangssortierung über',
        p3c: 'baut den Feldkatalog automatisch aus', p3d: ' auf.',
        h4: 'ALV in diesem Studio',
        p4: 'Das ALV-Grid erscheint direkt im Panel <strong>Ausgabe</strong>, in der Reihenfolge der <code>WRITE</code>-Ausgabe. Ein Programm darf mehr als ein Grid anzeigen.<br>• <strong>Sortieren</strong>: Spaltenüberschrift doppelklicken oder Spalte markieren (ein Klick) und die Schaltflächen ↑ / ↓ verwenden<br>• <strong>Filter</strong>: das Suchfeld in der Grid-Toolbar<br>• <strong>Summen (Σ)</strong>: die Schaltfläche Σ — <code>do_sum</code>-Spalten werden automatisch summiert<br>• <strong>CSV-Export</strong>: die Download-Schaltfläche'
      },
      function: {
        p: 'Ein Funktionsbaustein (FB) ist eine fertige Prozedur. Der gesamte Aufruf ist <strong>eine</strong> Anweisung — der Punkt steht nur am Ende.',
        fm: 'FB_NAME', pin: 'eingabe_param', vin: 'lv_wert', pout: 'ausgabe_param', vout: 'lv_ergebnis',
        pchg: 'aenderung_param', ptab: 'tabelle', perr: 'fehlername',
        c1: 'Programm -> FB', c2: 'FB -> Programm', c3: 'beide Richtungen', c4: 'interne Tabelle', c5: 'Fehlername -> sy-subrc', c6: 'Fehler behandeln',
        p2: 'Eine Ausnahme, die nicht unter <code>EXCEPTIONS</code> abgebildet ist, stoppt das Programm (Short Dump). Nicht simulierte FBs werden mit einer Warnung übersprungen.',
        h1: 'Simulierte Funktionsbausteine',
        same: '(gleiche Parameter wie GRID)', hdr: 'Kopf über dem Grid (TOP_OF_PAGE)',
        sConv: 'Konvertierung', sDate: 'Datum', sDlg: 'Dialoge & Dateien',
        days: '1 = Montag ... 7 = Sonntag', yn: "'1' = Ja, '2' = Nein",
        sim: 'simuliert, keine echte Datei', up: 'löst immer FILE_OPEN_ERROR aus',
        h2: 'Simulierte Standardklassen', lTitle: 'Titel', cDemo: 'schnelle Ausgabe einer Variable / Tabelle',
        h3: 'Eigene Funktionsbausteine',
        p3: 'Schreiben Sie <code>FUNCTION name. … ENDFUNCTION.</code> im selben Programm. Die Schnittstelle wird aus dem <code>*"</code>-Kommentarblock unter der FUNCTION-Zeile gelesen (IMPORTING, EXPORTING, CHANGING, TABLES, EXCEPTIONS) — siehe die Lektion „Eigenen Funktionsbaustein erstellen“.'
      },
      simulator: {
        h: 'Was in diesem Studio läuft',
        p: 'Dieses Studio ist ein <strong>Simulator zum Lernen</strong>, kein SAP-System. Code, der hier läuft, folgt der echten ABAP-Syntax, und seine Fehler- und Warnmeldungen ähneln dem Verhalten von SAP so weit wie möglich. Programmergebnisse erscheinen im Ausgabe-Panel und im <strong>Ergebnisbild im SAP-Stil</strong> (abschaltbar über „Ergebnisbild im SAP-Stil“ im Menü ⋯; Esc oder F3 = zurück).',
        h1: 'Unterstützt',
        sup: [
          ['Grundlagen', 'DATA, TYPES, CONSTANTS, STATICS, Strukturen (BEGIN OF … END OF), IF, CASE, DO, WHILE, EXIT, CONTINUE, CHECK, Typen c / n / p / d / t mit ihren Längen und Dezimalstellen'],
          ['Listen', 'WRITE mit Position und Länge (<code>/5(10)</code>), NO-GAP, Datums- / Zeit- / Dezimalformatierung, ULINE, SKIP, TOP-OF-PAGE, HIDE + AT LINE-SELECTION (Zeile doppelklicken)'],
          ['Report-Ereignisse', 'INITIALIZATION, AT SELECTION-SCREEN, START-OF-SELECTION, END-OF-SELECTION in der SAP-Reihenfolge; MESSAGE vom Typ E / A / X stoppt das Programm'],
          ['Strings', 'CONCATENATE, SPLIT, CONDENSE, TRANSLATE, REPLACE, FIND, SHIFT, &amp;&amp;, String-Templates |…| mit Formatoptionen, Offset +n(m), CS / CP / CO / CA, die Funktionen to_upper, substring, replace, condense, contains …'],
          ['Interne Tabellen', 'APPEND, INSERT, MODIFY, DELETE, COLLECT, SORT, READ TABLE, LOOP (INTO / ASSIGNING / REFERENCE INTO / WHERE / FROM-TO), AT NEW / AT END OF / SUM, Tabellen STANDARD / SORTED / HASHED, Kopfzeilen und OCCURS'],
          ['Modularisierung', 'FORM / PERFORM (TABLES, USING, CHANGING, lokale Variablen, Rekursion), Makros (DEFINE), eigene Funktionsbausteine (FUNCTION … ENDFUNCTION), CALL FUNCTION'],
          ['Selektionsbild', 'PARAMETERS (CHECKBOX, RADIOBUTTON, OBLIGATORY), SELECT-OPTIONS, RANGES, die Schaltfläche Parameter (F8)'],
          ['Open SQL', 'SELECT (SINGLE, INTO TABLE, WHERE, ORDER BY, UP TO n ROWS, DISTINCT), die Aggregate COUNT / SUM / MAX / MIN / AVG, GROUP BY, HAVING, INNER / LEFT OUTER JOIN, FOR ALL ENTRIES, SELECT … ENDSELECT, INSERT / UPDATE / MODIFY / DELETE, COMMIT / ROLLBACK WORK'],
          ['OO ABAP', 'lokale Klassen, Attribute &amp; Methoden (Instanz und statisch), Konstruktor, Sichtbarkeit, READ-ONLY, Vererbung, REDEFINITION, super-&gt;, Schnittstellen, Ereignisse (EVENTS / RAISE EVENT / SET HANDLER), NEW, CREATE OBJECT, CAST, IS INSTANCE OF'],
          ['Ausnahmen', 'TRY / CATCH / ENDTRY, RAISE EXCEPTION, eigene Ausnahmeklassen, cx_sy_zerodivide, cx_sy_ref_is_initial, cx_sy_itab_line_not_found, cx_sy_conversion_no_number'],
          ['Modern', 'DATA( ), FIELD-SYMBOL( ), VALUE (einschließlich FOR und BASE), COND, SWITCH, CONV, REDUCE, CORRESPONDING, Tabellenausdrücke <code>itab[ … ]</code>, line_exists( ), Host-Variablen @'],
          ['Dynamisch', 'Feldsymbole, Datenreferenzen (REF #, GET REFERENCE, CREATE DATA, -&gt;*), ASSIGN COMPONENT, ASSIGN (name)'],
          ['ALV', 'REUSE_ALV_GRID_DISPLAY (Feldkatalog, Layout, Sortierung, Summen, Hotspot, User Command, Top of Page), CL_SALV_TABLE (Spalten, Sortierungen, Aggregationen, die Ereignisse link_click / double_click), CL_GUI_ALV_GRID']
        ],
        h2: 'Was sich von SAP unterscheidet',
        diff: [
          'Datenbanktabellen sind Beispieldaten (Ansicht <strong>Tabellen</strong>). Änderungen per INSERT / UPDATE / DELETE gelten nur während der Programmlaufzeit.',
          'Funktionsbausteine werden im selben Programm geschrieben; ihre Schnittstelle wird aus dem <code>*"</code>-Kommentarblock gelesen, wie ihn SE37 anzeigt.',
          'Textsymbole (<code>TEXT-001</code>) und Nachrichtenklassen werden nicht verwaltet; der Text erscheint als sein Code.',
          "Die Sprachschlüssel in den Beispieldaten sind <code>'EN'</code> / <code>'ID'</code>, und <code>sy-langu</code> enthält <code>'EN'</code>.",
          'WRITE trennt Werte mit einem Leerzeichen; die automatische Spaltenbreite je Datentyp wie in SAP wird nicht nachgebildet — verwenden Sie Spaltenpositionen, wenn Sie Ausrichtung brauchen.'
        ],
        h3: 'Noch nicht unterstützt',
        not: [
          'Dynpro / Bilder (CALL SCREEN, MODULE, PBO / PAI): Bilder werden im Screen Painter erstellt, nicht im Code',
          'LOOP AT … GROUP BY, SQL-Unterabfragen, UNION, CDS-Views, AMDP',
          'Globale Klassen (SE24), Friends, Testklassen (ABAP Unit), RTTS (cl_abap_typedescr)',
          'Dateien und System: OPEN DATASET, EXPORT / IMPORT MEMORY, SUBMIT, CALL TRANSACTION (wird nur als Meldung angezeigt), Hintergrundjobs',
          'Unbekannte Anweisungen werden mit einer Warnung übersprungen, nicht stillschweigend ausgeführt'
        ]
      }
    },

    // ============================== 中文 ==============================
    zh: {
      intro: {
        h: '什么是 ABAP？',
        p: 'ABAP（Advanced Business Application Programming）是 SAP 开发的高级编程语言，用于在 SAP ERP、S/4HANA 和 BTP 等 SAP 平台上开发业务应用。',
        h1: 'ABAP 的特点',
        b1: '在 ABAP 应用服务器上解释/编译执行',
        b2: '不区分大小写（关键字通常写成大写）',
        b3: '每条语句以句点 (.) 结尾',
        b4: '自 4.6 版本起支持面向对象（ABAP Objects）',
        h2: '最小程序结构'
      },
      data: {
        h: '声明变量', h1: '基本语法', h2: '基本数据类型',
        cInt: '整数', cFloat: '浮点数', cPack: '压缩数（金额 / 精确小数）',
        cChar: '字符（定长）', cStr: '字符串（变长）',
        cDate: '日期（格式：YYYYMMDD）', cTime: '时间（格式：HHMMSS）',
        h3: '链式声明（多个变量）', h4: '常量'
      },
      operators: {
        h: 'ABAP 运算符', h1: '算术运算符',
        cModern: '现代语法（ABAP 7.4+）', cMod: '取模', cPow: '乘方', cClassic: '经典语法',
        h2: '比较运算符',
        eq: '等于', ne: '不等于', lt: '小于', gt: '大于', le: '小于等于', ge: '大于等于',
        or: '或', cInit: '检查是否为空 / 零',
        h3: '逻辑运算符'
      },
      control: {
        h: '分支与循环', h1: '控制关键字',
        cExit: '退出循环或程序', cCont: '进入下一次循环',
        cCheck: '条件为假时跳过本次循环', cRet: '退出方法 / FORM'
      },
      string: {
        h: '字符串处理', cTrim: '去除首尾空格并压缩为单个空格', cNoGaps: '删除所有空格',
        h1: 'STRLEN 与字符串函数', cLen: '字符串长度', cBuiltin: '现代 ABAP 内置函数：'
      },
      itab: {
        h: '内表',
        p: '内表是 ABAP 中带类型的数组数据结构，使用非常频繁。',
        h1: '内表的类型',
        cStd: '按索引访问', cSorted: '自动排序', cHashed: '按键快速访问',
        h2: '结构体 + 表', h3: '基本操作',
        cAdd: '添加行', cLoop: '循环', cSort: '排序', cRead: '读取', cDel: '删除', cCount: '计数', cOr: '或者：'
      },
      subroutines: { h: 'FORM 子程序（经典）', h2: '面向对象 ABAP - 方法', cCall: '调用静态方法：' },
      sysfields: {
        h: 'ABAP 系统字段',
        p: '系统字段是由 ABAP 运行时自动填充的内置变量。',
        h1: '最常用的字段',
        cSubrc: '返回码（0 = 成功，4 = 未找到 等）',
        cTabix: 'LOOP AT 内表时的当前索引',
        cIndex: 'DO / WHILE 中的当前计数',
        cUname: '当前登录的用户',
        cDatum: '系统日期（格式 YYYYMMDD）',
        cUzeit: '系统时间（格式 HHMMSS）',
        cMandt: '当前 SAP 集团（client）',
        cRepid: '正在运行的程序名称'
      },
      select: {
        h: 'SELECT — Open SQL 数据库访问',
        p: '在 ABAP Code Studio 中，<code>SELECT</code> 查询<strong>可以直接运行</strong>，使用的是 SAP 标准表的示例副本（SCARR、SFLIGHT、SPFLI、MARA、MAKT、KNA1 等）。',
        h1: 'SELECT 到内表',
        cModern: '现代写法（ABAP 7.4+），带宿主变量 @',
        h2: 'SELECT 所有列',
        h3: '返回码（SY-SUBRC 与 SY-DBCNT）',
        c0: '找到数据', c4: '没有匹配的数据', cCnt: '读取到的行数'
      },
      alv: {
        p: 'ALV 是 SAP 的标准组件，用于把内表数据显示为带排序、筛选和合计功能的交互式表格。',
        h1: '1. 现代面向对象 ALV (CL_SALV_TABLE)',
        h2: '2. 经典 ALV（函数模块）',
        h3: '3. 带字段目录的经典 ALV',
        p2: '字段目录决定显示哪些列、列标题及其属性。字段目录的一行 = 一列。',
        cName: '组件名称，大写', cTitle: '列标题', cKey: '关键列', cSum: '求和',
        lAirline: '航空公司', lPrice: '价格', lGrid: '表格标题',
        p3a: '可识别的字段目录组件：', lay: '布局：', p3b: '初始排序通过',
        p3c: '根据', p3d: ' 自动生成字段目录。',
        h4: '本工作室中的 ALV',
        p4: 'ALV 表格直接显示在<strong>输出</strong>面板中，与 <code>WRITE</code> 的输出按顺序排列。一个程序可以显示多个表格。<br>• <strong>排序</strong>：双击列标题，或单击选中该列后使用 ↑ / ↓ 按钮<br>• <strong>筛选</strong>：表格工具栏中的搜索框<br>• <strong>合计 (Σ)</strong>：Σ 按钮——<code>do_sum</code> 列会自动求和<br>• <strong>导出 CSV</strong>：下载按钮'
      },
      function: {
        p: '函数模块（FM）是现成的过程。整个调用是<strong>一条</strong>语句——句点只在末尾。',
        fm: 'FM_NAME', pin: 'input_param ', vin: 'lv_value', pout: 'output_param', vout: 'lv_result',
        pchg: 'changed_param', ptab: 'table_param', perr: 'error_name',
        c1: '程序 -> FM', c2: 'FM -> 程序', c3: '双向', c4: '内表', c5: '错误名称 -> sy-subrc', c6: '处理错误',
        p2: '未在 <code>EXCEPTIONS</code> 中映射的异常会使程序停止（short dump）。尚未模拟的 FM 会被跳过并给出警告。',
        h1: '已模拟的函数模块',
        same: '（参数与 GRID 相同）', hdr: '表格上方的表头 (TOP_OF_PAGE)',
        sConv: '转换', sDate: '日期', sDlg: '对话框与文件',
        days: '1 = 周一 ... 7 = 周日', yn: "'1' = 是，'2' = 否",
        sim: '模拟，不生成真实文件', up: '总是引发 FILE_OPEN_ERROR',
        h2: '已模拟的标准类', lTitle: '标题', cDemo: '快速输出变量 / 表',
        h3: '自定义函数模块',
        p3: '在同一个程序中编写 <code>FUNCTION 名称. … ENDFUNCTION.</code>。它的接口从 FUNCTION 行下方的 <code>*"</code> 注释块读取（IMPORTING、EXPORTING、CHANGING、TABLES、EXCEPTIONS）——参见“编写自己的函数模块”一课。'
      },
      simulator: {
        h: '本工作室可以运行什么',
        p: '本工作室是一个<strong>用于学习的模拟器</strong>，而不是 SAP 系统。在这里运行的代码遵循真实的 ABAP 语法，其错误和警告消息也尽量贴近 SAP 的行为。程序结果显示在输出面板和 <strong>SAP 风格结果屏幕</strong>中（可通过 ⋯ 菜单中的“SAP 风格结果屏幕”开关关闭；按 Esc 或 F3 返回）。',
        h1: '已支持',
        sup: [
          ['基础', 'DATA、TYPES、CONSTANTS、STATICS、结构体（BEGIN OF … END OF）、IF、CASE、DO、WHILE、EXIT、CONTINUE、CHECK，以及带长度和小数位的 c / n / p / d / t 类型'],
          ['列表', '带位置和长度的 WRITE（<code>/5(10)</code>）、NO-GAP、日期 / 时间 / 小数格式、ULINE、SKIP、TOP-OF-PAGE、HIDE + AT LINE-SELECTION（双击某行）'],
          ['报表事件', 'INITIALIZATION、AT SELECTION-SCREEN、START-OF-SELECTION、END-OF-SELECTION 按 SAP 的顺序执行；E / A / X 类型的 MESSAGE 会停止程序'],
          ['字符串', 'CONCATENATE、SPLIT、CONDENSE、TRANSLATE、REPLACE、FIND、SHIFT、&amp;&amp;、带格式选项的字符串模板 |…|、偏移 +n(m)、CS / CP / CO / CA，以及函数 to_upper、substring、replace、condense、contains …'],
          ['内表', 'APPEND、INSERT、MODIFY、DELETE、COLLECT、SORT、READ TABLE、LOOP（INTO / ASSIGNING / REFERENCE INTO / WHERE / FROM-TO）、AT NEW / AT END OF / SUM、STANDARD / SORTED / HASHED 表、表头行和 OCCURS'],
          ['模块化', 'FORM / PERFORM（TABLES、USING、CHANGING、局部变量、递归）、宏（DEFINE）、自定义函数模块（FUNCTION … ENDFUNCTION）、CALL FUNCTION'],
          ['选择屏幕', 'PARAMETERS（CHECKBOX、RADIOBUTTON、OBLIGATORY）、SELECT-OPTIONS、RANGES、“参数”按钮 (F8)'],
          ['Open SQL', 'SELECT（SINGLE、INTO TABLE、WHERE、ORDER BY、UP TO n ROWS、DISTINCT）、聚合 COUNT / SUM / MAX / MIN / AVG、GROUP BY、HAVING、INNER / LEFT OUTER JOIN、FOR ALL ENTRIES、SELECT … ENDSELECT、INSERT / UPDATE / MODIFY / DELETE、COMMIT / ROLLBACK WORK'],
          ['面向对象 ABAP', '局部类、属性与方法（实例和静态）、构造器、可见性、READ-ONLY、继承、REDEFINITION、super-&gt;、接口、事件（EVENTS / RAISE EVENT / SET HANDLER）、NEW、CREATE OBJECT、CAST、IS INSTANCE OF'],
          ['异常', 'TRY / CATCH / ENDTRY、RAISE EXCEPTION、自定义异常类、cx_sy_zerodivide、cx_sy_ref_is_initial、cx_sy_itab_line_not_found、cx_sy_conversion_no_number'],
          ['现代语法', 'DATA( )、FIELD-SYMBOL( )、VALUE（包括 FOR 和 BASE）、COND、SWITCH、CONV、REDUCE、CORRESPONDING、表表达式 <code>itab[ … ]</code>、line_exists( )、宿主变量 @'],
          ['动态', '字段符号、数据引用（REF #、GET REFERENCE、CREATE DATA、-&gt;*）、ASSIGN COMPONENT、ASSIGN (name)'],
          ['ALV', 'REUSE_ALV_GRID_DISPLAY（字段目录、布局、排序、合计、热点、user command、top of page）、CL_SALV_TABLE（列、排序、聚合、事件 link_click / double_click）、CL_GUI_ALV_GRID']
        ],
        h2: '与 SAP 的不同之处',
        diff: [
          '数据库表是示例数据（<strong>数据表</strong>视图）。通过 INSERT / UPDATE / DELETE 所做的更改只在程序运行期间有效。',
          '函数模块写在同一个程序中；其接口从 <code>*"</code> 注释块读取，与 SE37 显示的形式相同。',
          '文本符号（<code>TEXT-001</code>）和消息类不受管理；文本以其代码形式显示。',
          "示例数据中的语言键为 <code>'EN'</code> / <code>'ID'</code>，<code>sy-langu</code> 的值为 <code>'EN'</code>。",
          'WRITE 用一个空格分隔各个值；没有模仿 SAP 按数据类型自动确定列宽的行为——需要对齐时请使用列位置。'
        ],
        h3: '尚未支持',
        not: [
          'Dynpro / 屏幕（CALL SCREEN、MODULE、PBO / PAI）：屏幕在 Screen Painter 中创建，而不是在代码中',
          'LOOP AT … GROUP BY、SQL 子查询、UNION、CDS 视图、AMDP',
          '全局类（SE24）、friend、测试类（ABAP Unit）、RTTS（cl_abap_typedescr）',
          '文件与系统：OPEN DATASET、EXPORT / IMPORT MEMORY、SUBMIT、CALL TRANSACTION（仅显示为消息）、后台作业',
          '无法识别的语句会被跳过并给出警告，而不是悄悄执行'
        ]
      }
    }
  };

  for (const lang of Object.keys(TXT)) {
    for (const id of Object.keys(TPL)) {
      const t = TXT[lang][id];
      if (!t) continue;
      C.docs[lang][id] = Object.assign(C.docs[lang][id] || {}, { content: TPL[id](t) });
    }
  }
})();

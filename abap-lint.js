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
    // only rules for what SAP's own syntax check reports — no style rules
    rules: {
      parser_error: true, check_syntax: true, unknown_types: true,
      begin_end_names: true,                 // BEGIN OF x … END OF y
      identical_form_names: true,            // the same FORM twice
      implement_methods: true,               // a declared / abstract / interface method without implementation
      method_implemented_twice: true,
      superclass_final: true,                // INHERITING FROM a FINAL class
      parser_missing_space: true,            // "( lv)" — ABAP wants a blank inside the brackets
      parser_bad_exceptions: true,           // EXCEPTIONS of CALL FUNCTION written wrongly
      mix_returning: true,                   // RETURNING together with EXPORTING / CHANGING
      line_length: { length: 255 },          // a source line may have 255 characters at most
      uncaught_exception: true               // a checked exception neither caught nor declared: a warning in SAP
    }
  };
  const WARNING = new Set(['uncaught_exception']);

  // ─────────────────────────────────────────────────────────── dictionary
  // The sample tables of the simulator (dummy-data.js), handed to the parser as dictionary objects in abapGit
  // format. With them it knows every field: "vbak-netwrr", a column that does not exist, the type of a field.
  // Types are derived from the sample rows: whole numbers INT4, other numbers DEC, 8 digits DATS, else CHAR.
  function fieldXml(name, values, key) {
    const vals = values.filter(v => v !== '' && v !== null && v !== undefined);
    let type = 'CHAR', len = 1, dec = 0, int = 'C';
    if (name === 'MANDT') { type = 'CLNT'; len = 3; }
    else if (vals.length && vals.every(v => typeof v === 'number')) {
      if (vals.every(v => Number.isInteger(v)) && !/(NETWR|WRBTR|DMBTR|PRICE|PREIS|BETRG|MENGE|BRGEW|NTGEW|KWMENG|LFIMG|FKIMG|SALARY|AMOUNT|TOTAL|WERT)/.test(name)) { type = 'INT4'; len = 10; int = 'X'; }
      else { type = 'DEC'; len = 15; dec = 2; int = 'P'; }
    } else if (vals.length && vals.every(v => /^(19|20)\d\d(0[1-9]|1[0-2])\d\d$/.test(String(v)))) { type = 'DATS'; len = 8; int = 'D'; }
    else if (vals.length && /(TIM|ZEIT|TIME)/.test(name) && vals.every(v => /^\d{6}$/.test(String(v)))) { type = 'TIMS'; len = 6; int = 'T'; }
    else len = Math.max(1, ...values.map(v => String(v === null || v === undefined ? '' : v).length));
    const six = n => String(n).padStart(6, '0');
    return `<DD03P><FIELDNAME>${name}</FIELDNAME>${key ? '<KEYFLAG>X</KEYFLAG>' : ''}<INTTYPE>${int}</INTTYPE><INTLEN>${six(len * 2)}</INTLEN><DATATYPE>${type}</DATATYPE><LENG>${six(len)}</LENG>${dec ? `<DECIMALS>${six(dec)}</DECIMALS>` : ''}</DD03P>`;
  }
  let dictionary = null;
  function dictionaryFiles() {
    if (dictionary) return dictionary;
    dictionary = {};
    const DB = window.ABAP_DB || {}, SCHEMA = window.ABAP_DB_SCHEMA || {};
    for (const table of Object.keys(DB)) {
      const rows = DB[table] || [];
      // the schema lists the columns shown in the Tables view; the rows may carry more — the table has them all
      const fields = ((SCHEMA[table] && SCHEMA[table].fields) || []).slice();
      for (const row of rows) for (const f of Object.keys(row)) if (!fields.includes(f)) fields.push(f);
      if (!fields.length) continue;
      const xml = fields.map((f, i) => fieldXml(f, rows.map(r => r[f]), i < 2)).join('');
      dictionary[table.toLowerCase() + '.tabl.xml'] = `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_TABL" serializer_version="v1.0.0"><asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0"><asx:values>
<DD02V><TABNAME>${table}</TABNAME><DDLANGUAGE>E</DDLANGUAGE><TABCLASS>TRANSP</TABCLASS><CONTFLAG>A</CONTFLAG><EXCLASS>1</EXCLASS></DD02V>
<DD03P_TABLE>${xml}</DD03P_TABLE></asx:values></asx:abap></abapGit>`;
    }
    return dictionary;
  }

  // ─────────────────────────────────────────────────────────── standard classes
  // The standard classes the simulator works with, declared for the parser: with them a method, parameter or
  // event name that does not exist is an error, as in SAP. Only the public interface matters here, so the
  // types are kept loose (TYPE any) and every method body is empty. A standard class without a declaration
  // below stays "void": it can be used freely and is not checked.
  const exc = (name, sup, abstract) => `CLASS ${name} DEFINITION PUBLIC ${sup ? 'INHERITING FROM ' + sup + ' ' : ''}${abstract === false ? '' : 'ABSTRACT '}CREATE PUBLIC.
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
  // exceptions of the system and of SALV: [name, superclass]
  for (const [name, sup] of [
    ['cx_sy_arithmetic_error', 'cx_dynamic_check'], ['cx_sy_zerodivide', 'cx_sy_arithmetic_error'], ['cx_sy_arithmetic_overflow', 'cx_sy_arithmetic_error'],
    ['cx_sy_conversion_error', 'cx_dynamic_check'], ['cx_sy_conversion_no_number', 'cx_sy_conversion_error'], ['cx_sy_conversion_overflow', 'cx_sy_conversion_error'],
    ['cx_sy_itab_error', 'cx_dynamic_check'], ['cx_sy_itab_line_not_found', 'cx_sy_itab_error'], ['cx_sy_range_out_of_bounds', 'cx_dynamic_check'],
    ['cx_sy_ref_is_initial', 'cx_dynamic_check'], ['cx_sy_move_cast_error', 'cx_dynamic_check'], ['cx_sy_dyn_call_error', 'cx_dynamic_check'],
    ['cx_sy_no_handler', 'cx_no_check'], ['cx_sy_regex', 'cx_dynamic_check'], ['cx_sy_matcher', 'cx_dynamic_check'],
    ['cx_salv_error', 'cx_static_check'], ['cx_salv_msg', 'cx_salv_error'], ['cx_salv_not_found', 'cx_salv_error'], ['cx_salv_existing', 'cx_salv_error'],
    ['cx_salv_data_error', 'cx_salv_error'], ['cx_salv_no_new_data_allowed', 'cx_salv_error'], ['cx_salv_wrong_call', 'cx_salv_error']
  ]) STUBS[name + '.clas.abap'] = exc(name, sup, false);

  // a class from its public members; every method named in them gets an empty implementation
  function klass(head, members) {
    const name = head.split(' ')[0], rest = head.slice(name.length).trim();
    const methods = [...members.matchAll(/(?:^|\n)\s*(?:CLASS-)?METHODS\s+(\w+)/g)].map(m => m[1]);
    STUBS[name + '.clas.abap'] = `CLASS ${name} DEFINITION PUBLIC ${rest ? rest + ' ' : ''}.\n  PUBLIC SECTION.\n${members}\nENDCLASS.\nCLASS ${name} IMPLEMENTATION.\n${methods.map(m => `  METHOD ${m}.\n  ENDMETHOD.`).join('\n')}\nENDCLASS.`;
  }
  const consts = (name, values) => { STUBS[name + '.intf.abap'] = `INTERFACE ${name} PUBLIC.\n${Object.keys(values).map(k => `  CONSTANTS ${k} TYPE i VALUE ${values[k]}.`).join('\n')}\nENDINTERFACE.`; };
  // setters "value" / getters, as the SALV classes have them by the dozen
  const set = (...names) => names.map(n => `    METHODS ${n} IMPORTING value TYPE any OPTIONAL.`).join('\n');
  const get = (type, ...names) => names.map(n => `    METHODS ${n} RETURNING VALUE(value) TYPE ${type}.`).join('\n');

  consts('if_salv_c_bool_sap', { true: 1, false: 0 });
  consts('if_salv_c_cell_type', { text: 1, checkbox: 2, button: 3, dropdown: 4, link: 5, hotspot: 6, checkbox_hotspot: 7 });
  consts('if_salv_c_aggregation', { none: 0, total: 1, minimum: 2, maximum: 3, average: 4 });
  consts('if_salv_c_sort', { sort_none: 0, sort_up: 1, sort_down: 2 });
  consts('if_salv_c_selection_mode', { single: 1, multiple: 2, cell: 3, row_column: 4, none: 0 });
  consts('if_salv_c_alignment', { left: 1, right: 2, centered: 3 });

  klass('cl_salv_table FINAL CREATE PRIVATE', `    CLASS-METHODS factory IMPORTING list_display TYPE abap_bool DEFAULT abap_false r_container TYPE REF TO object OPTIONAL container_name TYPE string OPTIONAL EXPORTING r_salv_table TYPE REF TO cl_salv_table CHANGING t_table TYPE table RAISING cx_salv_msg.
    METHODS display.
    METHODS refresh IMPORTING s_stable TYPE any OPTIONAL refresh_mode TYPE any OPTIONAL.
    METHODS close_screen.
    METHODS set_data CHANGING t_table TYPE table RAISING cx_salv_no_new_data_allowed.
    METHODS set_screen_status IMPORTING report TYPE any pfstatus TYPE any set_functions TYPE any OPTIONAL.
    METHODS set_screen_popup IMPORTING start_column TYPE i end_column TYPE i OPTIONAL start_line TYPE i end_line TYPE i OPTIONAL.
    METHODS set_top_of_list IMPORTING value TYPE REF TO object.
    METHODS set_end_of_list IMPORTING value TYPE REF TO object.
    METHODS get_columns RETURNING VALUE(value) TYPE REF TO cl_salv_columns_table.
    METHODS get_functions RETURNING VALUE(value) TYPE REF TO cl_salv_functions_list.
    METHODS get_display_settings RETURNING VALUE(value) TYPE REF TO cl_salv_display_settings.
    METHODS get_sorts RETURNING VALUE(value) TYPE REF TO cl_salv_sorts.
    METHODS get_aggregations RETURNING VALUE(value) TYPE REF TO cl_salv_aggregations.
    METHODS get_event RETURNING VALUE(value) TYPE REF TO cl_salv_events_table.
    METHODS get_selections RETURNING VALUE(value) TYPE REF TO cl_salv_selections.
    METHODS get_layout RETURNING VALUE(value) TYPE REF TO cl_salv_layout.
    METHODS get_filters RETURNING VALUE(value) TYPE REF TO cl_salv_filters.
    METHODS get_print RETURNING VALUE(value) TYPE REF TO object.
    METHODS get_functional_settings RETURNING VALUE(value) TYPE REF TO object.
    METHODS get_top_of_list RETURNING VALUE(value) TYPE REF TO object.
    METHODS get_end_of_list RETURNING VALUE(value) TYPE REF TO object.
    METHODS get_metadata.`);
  klass('cl_salv_columns_table CREATE PUBLIC', `    METHODS get_column IMPORTING columnname TYPE any RETURNING VALUE(value) TYPE REF TO cl_salv_column RAISING cx_salv_not_found.
    METHODS get RETURNING VALUE(value) TYPE string_table.
    METHODS set_column_position IMPORTING columnname TYPE any position TYPE i.
    METHODS get_column_position IMPORTING columnname TYPE any RETURNING VALUE(value) TYPE i.
    METHODS is_optimized RETURNING VALUE(value) TYPE abap_bool.
${set('set_optimize', 'set_key_fixation', 'set_headers_visible', 'set_color_column', 'set_cell_type_column', 'set_exception_column', 'set_count_column', 'set_hyperlink_entry_column', 'set_dropdown_entry_column', 'set_enabled_column')}`);
  const COLUMN = `${set('set_short_text', 'set_medium_text', 'set_long_text', 'set_tooltip', 'set_visible', 'set_technical', 'set_output_length', 'set_alignment', 'set_optimized', 'set_zero', 'set_sign',
    'set_decimals', 'set_decimals_column', 'set_currency', 'set_currency_column', 'set_quantity', 'set_quantity_column', 'set_edit_mask', 'set_leading_zero', 'set_lowercase', 'set_fixed_header_text',
    'set_round', 'set_round_column', 'set_row', 'set_ddic_reference', 'set_f1_rollname')}
${get('string', 'get_columnname', 'get_short_text', 'get_medium_text', 'get_long_text', 'get_tooltip', 'get_edit_mask', 'get_ddic_datatype', 'get_ddic_rollname')}
${get('i', 'get_output_length', 'get_alignment', 'get_decimals', 'get_ddic_outputlen', 'get_ddic_decimals')}
${get('abap_bool', 'is_visible', 'is_technical', 'is_optimized', 'is_zero', 'has_sign', 'has_leading_zero', 'is_lowercase')}`;
  klass('cl_salv_column CREATE PUBLIC', COLUMN);
  klass('cl_salv_column_list INHERITING FROM cl_salv_column CREATE PUBLIC', `${set('set_key', 'set_color', 'set_cell_type', 'set_icon', 'set_symbol', 'set_text_column', 'set_key_presence_required')}
${get('i', 'get_cell_type')}
${get('abap_bool', 'is_key', 'is_icon', 'is_symbol')}`);
  klass('cl_salv_column_table INHERITING FROM cl_salv_column_list CREATE PUBLIC', `${set('set_dropdown_entry', 'set_hyperlink_entry', 'set_f4', 'set_f4_checktable', 'set_enabled')}`);
  klass('cl_salv_functions_list CREATE PUBLIC', `${set('set_all', 'set_default', 'set_aggregation_total', 'set_aggregation_average', 'set_aggregation_minimum', 'set_aggregation_maximum', 'set_aggregation_count',
    'set_detail', 'set_export_folder', 'set_export_html', 'set_export_localfile', 'set_export_mail', 'set_export_send', 'set_export_spreadsheet', 'set_export_wordprocessor', 'set_export_xml',
    'set_filter', 'set_filter_delete', 'set_find', 'set_find_more', 'set_graphics', 'set_group_aggregation', 'set_group_export', 'set_group_filter', 'set_group_layout', 'set_group_sort',
    'set_group_subtotal', 'set_group_view', 'set_layout_change', 'set_layout_load', 'set_layout_maintain', 'set_layout_save', 'set_print', 'set_print_preview', 'set_sort_asc', 'set_sort_desc',
    'set_subtotals', 'set_view_crystal', 'set_view_excel', 'set_view_grid', 'set_view_lotus', 'set_abc_analysis')}
    METHODS set_function IMPORTING name TYPE any boolean TYPE any OPTIONAL RAISING cx_salv_not_found cx_salv_wrong_call.
    METHODS add_function IMPORTING name TYPE any icon TYPE any OPTIONAL text TYPE any OPTIONAL tooltip TYPE any position TYPE any RAISING cx_salv_existing cx_salv_wrong_call.
    METHODS enable_function IMPORTING name TYPE any boolean TYPE any RAISING cx_salv_not_found cx_salv_wrong_call.
    METHODS remove_function IMPORTING name TYPE any RAISING cx_salv_not_found cx_salv_wrong_call.`);
  klass('cl_salv_display_settings CREATE PUBLIC', `${set('set_striped_pattern', 'set_list_header', 'set_list_header_size', 'set_horizontal_lines', 'set_vertical_lines', 'set_fit_column_to_table_size', 'set_no_merging',
    'set_suppress_empty_data', 'set_min_linesize', 'set_max_linesize', 'set_tooltip')}
${get('string', 'get_list_header')}
${get('abap_bool', 'is_striped_pattern', 'is_horizontal_lines', 'is_vertical_lines')}`);
  klass('cl_salv_sort CREATE PUBLIC', `${set('set_sequence', 'set_subtotal', 'set_group', 'set_obligatory', 'set_position')}
${get('string', 'get_columnname')}
${get('i', 'get_sequence', 'get_position')}
${get('abap_bool', 'is_subtotalled')}`);
  klass('cl_salv_sorts CREATE PUBLIC', `    METHODS add_sort IMPORTING columnname TYPE any position TYPE i OPTIONAL sequence TYPE any OPTIONAL subtotal TYPE any OPTIONAL group TYPE any OPTIONAL obligatory TYPE any OPTIONAL RETURNING VALUE(value) TYPE REF TO cl_salv_sort RAISING cx_salv_not_found cx_salv_existing cx_salv_data_error.
    METHODS get_sort IMPORTING columnname TYPE any RETURNING VALUE(value) TYPE REF TO cl_salv_sort RAISING cx_salv_not_found.
    METHODS remove_sort IMPORTING columnname TYPE any RAISING cx_salv_not_found.
    METHODS clear.
    METHODS is_sort_defined RETURNING VALUE(value) TYPE abap_bool.
${set('set_group_active', 'set_compressed_subtotal')}`);
  klass('cl_salv_aggregation CREATE PUBLIC', `${set('set')}
${get('string', 'get_columnname')}
${get('i', 'get')}`);
  klass('cl_salv_aggregations CREATE PUBLIC', `    METHODS add_aggregation IMPORTING columnname TYPE any aggregation TYPE any OPTIONAL RETURNING VALUE(value) TYPE REF TO cl_salv_aggregation RAISING cx_salv_data_error cx_salv_not_found cx_salv_existing.
    METHODS get_aggregation IMPORTING columnname TYPE any RETURNING VALUE(value) TYPE REF TO cl_salv_aggregation RAISING cx_salv_not_found.
    METHODS remove_aggregation IMPORTING columnname TYPE any RAISING cx_salv_not_found.
    METHODS clear.
${set('set_aggregation_before_items', 'set_numerical_aggregation', 'set_count')}`);
  klass('cl_salv_events_table CREATE PUBLIC', `    EVENTS double_click EXPORTING VALUE(row) TYPE i VALUE(column) TYPE string.
    EVENTS link_click EXPORTING VALUE(row) TYPE i VALUE(column) TYPE string.
    EVENTS added_function EXPORTING VALUE(e_salv_function) TYPE string.
    EVENTS before_salv_function EXPORTING VALUE(e_salv_function) TYPE string.
    EVENTS after_salv_function EXPORTING VALUE(e_salv_function) TYPE string.
    EVENTS top_of_page EXPORTING VALUE(r_top_of_page) TYPE REF TO object VALUE(page) TYPE i VALUE(table_index) TYPE i.
    EVENTS end_of_page EXPORTING VALUE(r_end_of_page) TYPE REF TO object VALUE(page) TYPE i.`);
  klass('cl_salv_selections CREATE PUBLIC', `${set('set_selection_mode', 'set_selected_rows', 'set_selected_columns', 'set_current_cell', 'set_selected_cells')}
    METHODS get_selected_rows RETURNING VALUE(value) TYPE string_table.
    METHODS get_selected_columns RETURNING VALUE(value) TYPE string_table.
${get('i', 'get_selection_mode')}`);
  klass('cl_salv_layout CREATE PUBLIC', `${set('set_key', 'set_save_restriction', 'set_default', 'set_initial_layout')}
${get('string', 'get_initial_layout')}`);
  klass('cl_salv_filters CREATE PUBLIC', `    METHODS add_filter IMPORTING columnname TYPE any sign TYPE any OPTIONAL option TYPE any OPTIONAL low TYPE any OPTIONAL high TYPE any OPTIONAL RETURNING VALUE(value) TYPE REF TO object RAISING cx_salv_not_found cx_salv_data_error cx_salv_existing.
    METHODS remove_filter IMPORTING columnname TYPE any RAISING cx_salv_not_found.
    METHODS clear.`);

  // ABAP Unit
  const A = 'msg TYPE csequence OPTIONAL level TYPE i OPTIONAL quit TYPE i OPTIONAL';
  klass('cl_abap_unit_assert FINAL CREATE PRIVATE', `    CLASS-METHODS assert_equals IMPORTING act TYPE any exp TYPE any ignore_hash_sequence TYPE abap_bool OPTIONAL tol TYPE f OPTIONAL ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_equals_float IMPORTING act TYPE any exp TYPE any rtol TYPE f OPTIONAL ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_differs IMPORTING act TYPE any exp TYPE any tol TYPE f OPTIONAL ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_true IMPORTING act TYPE any ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_false IMPORTING act TYPE any ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_initial IMPORTING act TYPE any ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_not_initial IMPORTING act TYPE any ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_bound IMPORTING act TYPE any ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_not_bound IMPORTING act TYPE any ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_subrc IMPORTING exp TYPE i DEFAULT 0 act TYPE i DEFAULT sy-subrc symsg TYPE any OPTIONAL ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_return_code IMPORTING exp TYPE i DEFAULT 0 act TYPE i DEFAULT sy-subrc symsg TYPE any OPTIONAL ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_char_cp IMPORTING act TYPE csequence exp TYPE csequence ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_char_np IMPORTING act TYPE csequence exp TYPE csequence ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_text_matches IMPORTING pattern TYPE csequence text TYPE csequence ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_number_between IMPORTING lower TYPE numeric upper TYPE numeric number TYPE numeric ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_table_contains IMPORTING line TYPE any table TYPE ANY TABLE ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_table_not_contains IMPORTING line TYPE any table TYPE ANY TABLE ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS assert_that IMPORTING act TYPE any exp TYPE REF TO object act_as_text TYPE csequence OPTIONAL ${A} RETURNING VALUE(assertion_failed) TYPE abap_bool.
    CLASS-METHODS fail IMPORTING msg TYPE csequence OPTIONAL level TYPE i OPTIONAL quit TYPE i OPTIONAL detail TYPE csequence OPTIONAL PREFERRED PARAMETER msg.
    CLASS-METHODS abort IMPORTING msg TYPE csequence OPTIONAL detail TYPE csequence OPTIONAL quit TYPE i OPTIONAL PREFERRED PARAMETER msg.
    CLASS-METHODS skip IMPORTING msg TYPE csequence OPTIONAL detail TYPE csequence OPTIONAL PREFERRED PARAMETER msg.
    CLASS-METHODS assume_true IMPORTING act TYPE any msg TYPE csequence OPTIONAL detail TYPE csequence OPTIONAL.
    CLASS-METHODS assume_false IMPORTING act TYPE any msg TYPE csequence OPTIONAL detail TYPE csequence OPTIONAL.`);

  // simple output
  klass('cl_demo_output FINAL CREATE PRIVATE', `    CLASS-METHODS display IMPORTING data TYPE any OPTIONAL name TYPE string OPTIONAL PREFERRED PARAMETER data.
    CLASS-METHODS display_data IMPORTING value TYPE any name TYPE string OPTIONAL.
    CLASS-METHODS display_text IMPORTING text TYPE any.
    CLASS-METHODS write IMPORTING data TYPE any name TYPE string OPTIONAL.
    CLASS-METHODS write_data IMPORTING value TYPE any name TYPE string OPTIONAL.
    CLASS-METHODS write_text IMPORTING text TYPE any.
    CLASS-METHODS begin_section IMPORTING title TYPE any OPTIONAL.
    CLASS-METHODS next_section IMPORTING title TYPE any.
    CLASS-METHODS end_section.
    CLASS-METHODS line.
    CLASS-METHODS get IMPORTING data TYPE any OPTIONAL name TYPE string OPTIONAL PREFERRED PARAMETER data RETURNING VALUE(output) TYPE string.`);

  // RTTS
  klass('cl_abap_typedescr ABSTRACT CREATE PUBLIC', `    DATA type_kind TYPE c LENGTH 1 READ-ONLY.
    DATA kind TYPE c LENGTH 1 READ-ONLY.
    DATA length TYPE i READ-ONLY.
    DATA decimals TYPE i READ-ONLY.
    DATA absolute_name TYPE string READ-ONLY.
${['int:I', 'int1:b', 'int2:s', 'int8:8', 'char:C', 'num:N', 'date:D', 'time:T', 'packed:P', 'float:F', 'string:g', 'xstring:y', 'hex:X', 'struct1:u', 'struct2:v', 'table:h', 'oref:r', 'dref:l', 'decfloat16:a', 'decfloat34:e', 'class:*', 'intf:+']
    .map(x => `    CONSTANTS typekind_${x.split(':')[0]} TYPE c LENGTH 1 VALUE '${x.split(':')[1]}'.`).join('\n')}
${['elem:E', 'struct:S', 'table:T', 'ref:R', 'class:C', 'intf:I'].map(x => `    CONSTANTS kind_${x.split(':')[0]} TYPE c LENGTH 1 VALUE '${x.split(':')[1]}'.`).join('\n')}
    CLASS-METHODS describe_by_name IMPORTING p_name TYPE any RETURNING VALUE(p_descr_ref) TYPE REF TO cl_abap_typedescr EXCEPTIONS type_not_found.
    CLASS-METHODS describe_by_data IMPORTING p_data TYPE any RETURNING VALUE(p_descr_ref) TYPE REF TO cl_abap_typedescr.
    CLASS-METHODS describe_by_data_ref IMPORTING p_data_ref TYPE REF TO data RETURNING VALUE(p_descr_ref) TYPE REF TO cl_abap_typedescr.
    CLASS-METHODS describe_by_object_ref IMPORTING p_object_ref TYPE REF TO object RETURNING VALUE(p_descr_ref) TYPE REF TO cl_abap_typedescr.
    METHODS get_relative_name RETURNING VALUE(p_relative_name) TYPE string.
    METHODS is_ddic_type RETURNING VALUE(p_abap_bool) TYPE abap_bool.`);
  klass('cl_abap_datadescr INHERITING FROM cl_abap_typedescr ABSTRACT CREATE PUBLIC', `    METHODS applies_to_data IMPORTING p_data TYPE any RETURNING VALUE(p_abap_bool) TYPE abap_bool.`);
  klass('cl_abap_elemdescr INHERITING FROM cl_abap_datadescr CREATE PUBLIC', `    DATA output_length TYPE i READ-ONLY.
    DATA help_id TYPE string READ-ONLY.
    DATA edit_mask TYPE string READ-ONLY.`);
  klass('cl_abap_structdescr INHERITING FROM cl_abap_datadescr CREATE PUBLIC', `    DATA components TYPE abap_compdescr_tab READ-ONLY.
    DATA struct_kind TYPE c LENGTH 1 READ-ONLY.
    METHODS get_components RETURNING VALUE(p_result) TYPE abap_component_tab.
    METHODS get_component_type IMPORTING p_name TYPE any RETURNING VALUE(p_descr_ref) TYPE REF TO cl_abap_datadescr EXCEPTIONS component_not_found unsupported_input_type.
    METHODS get_ddic_field_list IMPORTING p_langu TYPE any OPTIONAL p_including_substructres TYPE abap_bool OPTIONAL RETURNING VALUE(p_field_list) TYPE ddfields EXCEPTIONS not_found no_ddic_type.
    METHODS get_included_view IMPORTING p_level TYPE i OPTIONAL RETURNING VALUE(p_result) TYPE abap_component_view_tab.
    CLASS-METHODS create IMPORTING p_components TYPE any p_strict TYPE abap_bool OPTIONAL RETURNING VALUE(p_result) TYPE REF TO cl_abap_structdescr.`);
  klass('cl_abap_tabledescr INHERITING FROM cl_abap_datadescr CREATE PUBLIC', `    DATA table_kind TYPE c LENGTH 1 READ-ONLY.
    DATA has_unique_key TYPE abap_bool READ-ONLY.
    METHODS get_table_line_type RETURNING VALUE(p_descr_ref) TYPE REF TO cl_abap_datadescr.
    CLASS-METHODS create IMPORTING p_line_type TYPE REF TO cl_abap_datadescr p_table_kind TYPE any OPTIONAL p_unique TYPE abap_bool OPTIONAL p_key TYPE any OPTIONAL p_key_kind TYPE any OPTIONAL RETURNING VALUE(p_result) TYPE REF TO cl_abap_tabledescr.`);
  klass('cl_abap_refdescr INHERITING FROM cl_abap_datadescr CREATE PUBLIC', `    METHODS get_referenced_type RETURNING VALUE(p_descr_ref) TYPE REF TO cl_abap_typedescr.`);

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
    [/^Method (?:importing|exporting|changing|returning|receiving) parameter "(.+)" does not exist$/i, 'Method ini tidak punya parameter "$1".'],
    [/^Attribute or constant "(.+)" not found in "(.+)"$/, 'Atribut atau konstanta "$1" tidak ada di "$2".'],
    [/^Contains unknown, handler parameter not found "(.+)"$/, 'Parameter event "$1" tidak ditemukan — periksa nama event setelah FOR EVENT dan nama parameternya.'],
    [/^(?:method p|P)arameter "(.+)" must be supplied$/, 'Parameter wajib "$1" belum diisi pada pemanggilan ini.'],
    [/^"(.+)" cannot be modified, it is readonly$/, '"$1" tidak boleh diubah: ia konstanta atau hanya bisa dibaca.'],
    [/^Loop, not a table type$/, 'LOOP AT hanya untuk internal table — variabel ini bukan tabel.'],
    [/^Append, target not a table type/, 'APPEND … TO hanya untuk internal table — tujuannya bukan tabel.'],
    [/^Read table, not a table type$/, 'READ TABLE hanya untuk internal table — variabel ini bukan tabel.'],
    [/^Not a structure, /, 'Variabel ini bukan struktur, jadi tidak punya komponen (tanda "-").'],
    [/^Implicit or explicit index operation on hashed table/, 'Operasi berindeks (APPEND, INSERT … INDEX, READ … INDEX) tidak boleh dipakai pada HASHED TABLE — gunakan INSERT … INTO TABLE atau akses lewat key.'],
    // dictionary
    [/contains unknown: Field "(.+)" not found in structure$/, 'Field "$1" tidak ada di tabel atau struktur itu.'],
    [/^checkFields, field (\S+) not found$/, 'Kolom "$1" tidak ada di tabel yang dibaca SELECT ini.'],
    [/^Database table or view "(.+)" not found$/, 'Tabel database "$1" tidak ada.'],
    // classes, FORMs, layout of the source
    [/^Implement method "(.+)" from interface "(.+)"$/, 'Method "$1" dari interface "$2" belum diimplementasikan (METHOD $2~$1. … ENDMETHOD.).'],
    [/^Implement method "(.+)"$/, 'Method "$1" dideklarasikan tetapi belum diimplementasikan (METHOD $1. … ENDMETHOD.).'],
    [/^Method (\S+) implemented twice$/, 'Method "$1" diimplementasikan dua kali.'],
    [/^Identical FORM Names: "(.+)"$/, 'FORM "$1" didefinisikan lebih dari satu kali.'],
    [/^BEGIN END names must match$/, 'Nama pada BEGIN OF dan END OF harus sama.'],
    [/^Missing space between string or character literal and parentheses$/, 'Harus ada spasi di antara tanda kurung dan isinya, misalnya: abs( -1 ).'],
    [/^Maximum allowed line length of 255 exceeded, currently (\d+)$/, 'Baris terlalu panjang: satu baris paling banyak 255 karakter (baris ini $1).'],
    [/^Superclasses cannot be FINAL$/, 'Class yang ditandai FINAL tidak boleh diwarisi.'],
    [/^Uncaught exception (\S+)$/, 'Exception $1 bisa terjadi di sini, tetapi tidak ditangkap dengan TRY … CATCH dan tidak dideklarasikan dengan RAISING.']
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
  // "Expected ENDSELECT" comes with the first line of the program. The line that helps is the one that opened
  // the block: the last statement starting with the opener.
  const OPENER = { ENDIF: 'IF', ENDLOOP: 'LOOP', ENDSELECT: 'SELECT', ENDDO: 'DO', ENDWHILE: 'WHILE', ENDCASE: 'CASE', ENDTRY: 'TRY', ENDFORM: 'FORM',
    ENDMETHOD: 'METHOD', ENDCLASS: 'CLASS', ENDINTERFACE: 'INTERFACE', ENDFUNCTION: 'FUNCTION', ENDAT: 'AT', ENDMODULE: 'MODULE', ENDPROVIDE: 'PROVIDE' };
  function openerLine(code, closer) {
    const open = OPENER[closer];
    if (!open) return 0;
    const lines = code.split('\n'), re = new RegExp('^\\s*' + open + '\\b', 'i');
    for (let i = lines.length - 1; i >= 0; i--) if (re.test(lines[i]) && lines[i][0] !== '*') return i + 1;
    return 0;
  }

  // One registry for the whole session: the stand-in classes and the dictionary are parsed once,
  // each check only swaps the program in.
  const PROGRAM = 'zprogram.prog.abap';
  let registry = null, hasProgram = false;
  function check(code) {
    if (!ready()) return [];
    try {
      const A = window.abaplint;
      if (!registry) {
        registry = new A.Registry(new A.Config(JSON.stringify(CONFIG)));
        const files = Object.assign({}, STUBS, dictionaryFiles());
        for (const name of Object.keys(files)) registry.addFile(new A.MemoryFile(name, files[name]));
        hasProgram = false;
      }
      const reg = registry, file = new A.MemoryFile(PROGRAM, normalize(String(code || '')));
      if (hasProgram) reg.updateFile(file); else { reg.addFile(file); hasProgram = true; }
      reg.parse();
      const out = [], seen = new Set();
      for (const i of reg.findIssues()) {
        if (i.getFilename() !== PROGRAM) continue;
        const raw = i.getMessage();
        if (DROP.some(re => re.test(raw))) continue;
        const item = { line: i.getStart().getRow(), msg: text(raw), type: WARNING.has(i.getKey()) ? 'warning' : 'error', key: i.getKey() };
        const expected = i.getKey() === 'structure' && /^Expected (\S+)$/.exec(raw);
        if (expected) item.line = openerLine(String(code || ''), expected[1]) || item.line;
        const k = item.line + '\u0001' + item.msg;
        if (!seen.has(k)) { seen.add(k); out.push(item); }
      }
      return out.sort((a, b) => a.line - b.line);
    } catch (e) {
      registry = null;                       // start clean next time
      return [];
    }
  }

  window.ABAP_LINT = { load, ready, check, _text: text };
})();

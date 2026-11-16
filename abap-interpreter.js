// abap-interpreter.js
// ABAP Code Studio — Created by jeffrypurwanto
// Simulated ABAP interpreter for learning purposes.
//
// Supported subset:
//   - TYPES / DATA / CONSTANTS incl. BEGIN OF ... END OF structures, table types,
//     LIKE, LIKE LINE OF, DDIC structures (dummy DB tables, SLIS_*, LVC_*)
//   - WRITE, SKIP, ULINE, MESSAGE
//   - IF / CASE / DO / WHILE / LOOP AT (INTO, ASSIGNING, WHERE) / TRY
//   - APPEND, INSERT, MODIFY, DELETE, SORT, READ TABLE, DESCRIBE, CLEAR, REFRESH
//   - PERFORM / FORM with TABLES / USING / CHANGING parameters and local DATA
//   - OpenSQL SELECT on the dummy tables (window.ABAP_DB)
//   - CALL FUNCTION with EXPORTING / IMPORTING / TABLES / CHANGING / EXCEPTIONS
//     against a library of simulated function modules (see functionModules())
//   - ALV: REUSE_ALV_GRID_DISPLAY (+LIST, +LVC) with field catalog / layout,
//     REUSE_ALV_FIELDCATALOG_MERGE, CL_SALV_TABLE, CL_GUI_ALV_GRID

(function () {
  'use strict';

  const U = s => (s === undefined || s === null ? '' : String(s)).toUpperCase();
  const isNum = s => s !== undefined && s !== null && s !== '' && typeof s !== 'object' && typeof s !== 'boolean' && !isNaN(Number(s));

  // Instance of a (local) class. Assignments copy the reference, never the object.
  class AbapObject {
    constructor(cls, id) { this.cls = cls; this.id = id; this.attrs = {}; }
    toJSON() { return safeCopy(this, 0); }
  }
  // cycle-free plain copy for display (Variables panel)
  function safeCopy(v, depth) {
    if (v && v.rec && v.constructor && v.constructor.name === 'DataRef') return { '→ data': depth > 1 ? '…' : safeCopy(v.rec.value, depth + 1) };
    if (v instanceof AbapObject) {
      if (depth > 1) return `→ ${v.cls}`;
      const o = { '(class)': v.cls };
      for (const k of Object.keys(v.attrs)) o[k] = safeCopy(v.attrs[k].value, depth + 1);
      return o;
    }
    if (Array.isArray(v)) return v.map(x => safeCopy(x, depth + 1));
    if (v !== null && typeof v === 'object' && Object.getPrototypeOf(v) !== Object.prototype) return typeof v.toJSON === 'function' ? v.toJSON() : '(object)';
    if (v !== null && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = safeCopy(v[k], depth); return o; }
    return v;
  }

  // Data reference (GET REFERENCE OF / REF #( ) / CREATE DATA): points to a variable record
  class DataRef {
    constructor(rec) { this.rec = rec; }
    toJSON() { return { '→ data': safeCopy(this.rec.value, 1) }; }
  }

  // Object of the SALV model: the ALV itself ('table') or one of its helper objects
  // (columns, one column, display settings, events, sorts, aggregations). All share the settings in `alv`.
  class SalvProxy {
    constructor(alv, kind, column) { this.alv = alv; this.kind = kind; this.column = column || null; }
    toJSON() { return `CL_SALV_TABLE${this.kind === 'table' ? '' : ' (' + this.kind + ')'} → ${this.alv.itabName}`; }
  }

  // Constants of standard classes / interfaces that programs commonly refer to
  const STD_CONSTANTS = {
    'IF_SALV_C_CELL_TYPE=>TEXT': 1, 'IF_SALV_C_CELL_TYPE=>CHECKBOX': 2, 'IF_SALV_C_CELL_TYPE=>BUTTON': 3,
    'IF_SALV_C_CELL_TYPE=>DROPDOWN': 4, 'IF_SALV_C_CELL_TYPE=>LINK': 5, 'IF_SALV_C_CELL_TYPE=>HOTSPOT': 6,
    'IF_SALV_C_SORT=>SORT_UP': 1, 'IF_SALV_C_SORT=>SORT_DOWN': 2, 'IF_SALV_C_AGGREGATION=>TOTAL': 1,
    'IF_SALV_C_BOOL_SAP=>TRUE': 'X', 'IF_SALV_C_BOOL_SAP=>FALSE': '',
    'CL_ABAP_CHAR_UTILITIES=>NEWLINE': '\n', 'CL_ABAP_CHAR_UTILITIES=>CR_LF': '\r\n', 'CL_ABAP_CHAR_UTILITIES=>HORIZONTAL_TAB': '\t',
    'CL_GUI_CONTAINER=>SCREEN0': '(screen0)', 'CL_GUI_CONTAINER=>DEFAULT_SCREEN': '(default_screen)',
    'CL_ABAP_TYPEDESCR=>TYPEKIND_INT': 'I', 'CL_ABAP_TYPEDESCR=>TYPEKIND_PACKED': 'P', 'CL_ABAP_TYPEDESCR=>TYPEKIND_FLOAT': 'F',
    'CL_ABAP_TYPEDESCR=>TYPEKIND_CHAR': 'C', 'CL_ABAP_TYPEDESCR=>TYPEKIND_NUM': 'N', 'CL_ABAP_TYPEDESCR=>TYPEKIND_STRING': 'g',
    'CL_ABAP_TYPEDESCR=>TYPEKIND_DATE': 'D', 'CL_ABAP_TYPEDESCR=>TYPEKIND_TIME': 'T', 'CL_ABAP_TYPEDESCR=>TYPEKIND_STRUCT1': 'u',
    'CL_ABAP_TYPEDESCR=>TYPEKIND_STRUCT2': 'v', 'CL_ABAP_TYPEDESCR=>TYPEKIND_TABLE': 'h', 'CL_ABAP_TYPEDESCR=>TYPEKIND_OREF': 'r',
    'CL_ABAP_TYPEDESCR=>TYPEKIND_DREF': 'l',
    'CL_ABAP_TYPEDESCR=>KIND_ELEM': 'E', 'CL_ABAP_TYPEDESCR=>KIND_STRUCT': 'S', 'CL_ABAP_TYPEDESCR=>KIND_TABLE': 'T', 'CL_ABAP_TYPEDESCR=>KIND_REF': 'R'
  };

  // structure value: a plain object — not a table, not an object / data reference / SALV object
  const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;

  // Columns of the dummy tables that hold dates / times (shown as DD.MM.YYYY / HH:MM:SS)
  const DATE_FIELDS = new Set(['ERSDA', 'FLDATE', 'ERDAT', 'AEDAT', 'AUDAT', 'ORDER_DATE', 'ANGDT', 'BNDDT', 'GWLDT', 'LAEDA', 'BUDAT', 'BLDAT', 'BEDAT', 'CPUDT', 'EINDT',
    'LFDAT', 'WADAT_IST', 'FKDAT', 'BEGDA', 'ENDDA', 'GBDAT']);
  const TIME_FIELDS = new Set(['DEPTIME', 'ARRTIME', 'ERZET']);
  const AGG_FUNCS = new Set(['SUM', 'MAX', 'MIN', 'AVG', 'COUNT']);
  const CTOR_OPS = new Set(['VALUE', 'COND', 'SWITCH', 'CONV', 'EXACT', 'CAST', 'REF', 'REDUCE', 'CORRESPONDING', 'FILTER']);

  const pad2 = n => String(n).padStart(2, '0');
  // 'YYYYMMDD' -> Date (UTC) or null
  const toDate = s => {
    const m = /^(\d{4})(\d{2})(\d{2})$/.exec(typeof s === 'string' ? s.trim() : '');
    if (!m) return null;
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? d : null;
  };
  const fromDate = d => String(d.getUTCFullYear()).padStart(4, '0') + pad2(d.getUTCMonth() + 1) + pad2(d.getUTCDate());

  // Parent classes of the predefined exception classes
  const EXC_PARENT = {
    CX_SY_ZERODIVIDE: 'CX_SY_ARITHMETIC_ERROR', CX_SY_ARITHMETIC_OVERFLOW: 'CX_SY_ARITHMETIC_ERROR',
    CX_SY_ARITHMETIC_ERROR: 'CX_DYNAMIC_CHECK', CX_SY_CONVERSION_NO_NUMBER: 'CX_SY_CONVERSION_ERROR',
    CX_SY_CONVERSION_ERROR: 'CX_DYNAMIC_CHECK', CX_SY_ITAB_LINE_NOT_FOUND: 'CX_SY_ITAB_ERROR',
    CX_SY_ITAB_ERROR: 'CX_DYNAMIC_CHECK', CX_SY_REF_IS_INITIAL: 'CX_DYNAMIC_CHECK',
    CX_SY_RANGE_OUT_OF_BOUNDS: 'CX_DYNAMIC_CHECK', CX_SALV_MSG: 'CX_STATIC_CHECK', CX_SALV_NOT_FOUND: 'CX_STATIC_CHECK',
    CX_DYNAMIC_CHECK: 'CX_ROOT', CX_STATIC_CHECK: 'CX_ROOT', CX_NO_CHECK: 'CX_ROOT'
  };

  // ── Elementary types ──────────────────────────────────────
  const ELEM = {
    I: 'int', INT1: 'int', INT2: 'int', INT4: 'int', INT8: 'int', B: 'int', S: 'int',
    F: 'float', P: 'float', DECFLOAT: 'float', DECFLOAT16: 'float', DECFLOAT34: 'float',
    DEC: 'float', CURR: 'float', QUAN: 'float', NUMERIC: 'float',
    C: 'string', N: 'string', STRING: 'string', CHAR: 'string', NUMC: 'string',
    X: 'string', XSTRING: 'string', CLIKE: 'string', CSEQUENCE: 'string',
    ABAP_BOOL: 'string', BOOLEAN: 'string', BOOLE_D: 'string', FLAG: 'string', XFELD: 'string',
    SYUNAME: 'string', SYREPID: 'string', SYCPROG: 'string', SYSUBRC: 'int', SYTABIX: 'int',
    D: 'date', DATS: 'date', DATUM: 'date', SYDATUM: 'date',
    T: 'time', TIMS: 'time', UZEIT: 'time', SYUZEIT: 'time',
    ANY: 'any', DATA: 'any', SIMPLE: 'any'
  };

  // ── Simulated dictionary (DDIC) structures ────────────────
  // "NAME:i" = integer component, everything else is character-like.
  const DDIC_STRUCTS = {
    SLIS_FIELDCAT_ALV: 'ROW_POS:i COL_POS:i FIELDNAME TABNAME CURRENCY CFIELDNAME CTABNAME QUANTITY QFIELDNAME QTABNAME KEY KEY_SEL ICON SYMBOL CHECKBOX JUST LZERO NO_SIGN NO_ZERO NO_CONVEXT EDIT_MASK EMPHASIZE FIX_COLUMN DO_SUM NO_SUM NO_OUT TECH OUTPUTLEN:i OFFSET:i SELTEXT_L SELTEXT_M SELTEXT_S DDICTXT REPTEXT_DDIC DDIC_OUTPUTLEN:i INTLEN:i ROLLNAME DATATYPE INTTYPE REF_FIELDNAME REF_TABNAME HOTSPOT INPUT EDIT DECIMALS_OUT TEXT_FIELDNAME SP_GROUP',
    SLIS_LAYOUT_ALV: 'NO_COLHEAD NO_HOTSPOT ZEBRA NO_VLINE NO_HLINE CELL_MERGE EDIT EDIT_MODE NUMC_SUM NO_INPUT F2CODE CONFIRMATION_PROMPT NO_KEYFIX NO_TOTALLINE NO_SUBTOTALS TOTALS_ONLY TOTALS_TEXT SUBTOTALS_TEXT BOX_FIELDNAME BOX_TABNAME KEY_HOTSPOT INFO_FIELDNAME COLTAB_FIELDNAME LIGHTS_FIELDNAME DETAIL_POPUP DETAIL_TITLEBAR COLWIDTH_OPTIMIZE WINDOW_TITLEBAR MIN_LINESIZE:i MAX_LINESIZE:i',
    SLIS_SORTINFO_ALV: 'SPOS:i FIELDNAME TABNAME UP DOWN GROUP SUBTOT COMP EXPA OBLIGATORY',
    SLIS_ALV_EVENT: 'NAME FORM',
    SLIS_LISTHEADER: 'TYP KEY INFO',
    LVC_S_FCAT: 'ROW_POS:i COL_POS:i FIELDNAME TABNAME CURRENCY CFIELDNAME QUANTITY QFIELDNAME KEY KEY_SEL ICON SYMBOL CHECKBOX JUST LZERO NO_SIGN NO_ZERO NO_CONVEXT EDIT_MASK EMPHASIZE FIX_COLUMN DO_SUM NO_SUM NO_OUT TECH OUTPUTLEN:i CONVEXIT HOTSPOT COL_OPT REF_FIELD REF_TABLE ROLLNAME DATATYPE INTTYPE INTLEN:i REPTEXT COLTEXT SCRTEXT_L SCRTEXT_M SCRTEXT_S COLDDICTXT SELDDICTXT TIPDDICTXT TOOLTIP EDIT DECIMALS DECIMALS_O STYLE DRDN_HNDL:i F4AVAILABL',
    LVC_S_LAYO: 'ZEBRA EDIT EDIT_MODE NO_KEYFIX FRONTEND NO_HEADERS SMALLTITLE NO_HGRIDLN NO_VGRIDLN NO_TOOLBAR GRID_TITLE SEL_MODE BOX_FNAME CWIDTH_OPT INFO_FNAME CTAB_FNAME STYLEFNAME NO_ROWMARK NO_TOTLINE TOTALS_BEF EXCP_FNAME NO_ROWINS NO_ROWMOVE COL_OPT NUMC_TOTAL',
    LVC_S_SORT: 'SPOS:i FIELDNAME UP DOWN GROUP SUBTOT COMP EXPA LEVEL:i OBLIGATORY',
    DISVARIANT: 'REPORT HANDLE LOG_GROUP USERNAME VARIANT TEXT DEPENDVARS',
    BAPIRET2: 'TYPE ID NUMBER MESSAGE LOG_NO LOG_MSG_NO MESSAGE_V1 MESSAGE_V2 MESSAGE_V3 MESSAGE_V4 PARAMETER ROW:i FIELD SYSTEM',
    BAPIRETURN: 'TYPE CODE MESSAGE LOG_NO LOG_MSG_NO MESSAGE_V1 MESSAGE_V2 MESSAGE_V3 MESSAGE_V4',
    BAPIMATDOA: 'MATL_DESC OLD_MAT_NO MATL_TYPE IND_SECTOR DIVISION MATL_GROUP PROD_HIER BASE_UOM GROSS_WT:f NET_WEIGHT:f UNIT_OF_WT CREATED_ON CREATED_BY',
    BAPISFLDAT: 'AIRLINEID AIRLINE CONNECTID FLIGHTDATE AIRPORTFR CITYFROM AIRPORTTO CITYTO DEPTIME ARRTIME PRICE:f CURR'
  };

  const DDIC_TABLE_TYPES = {
    SLIS_T_FIELDCAT_ALV: 'SLIS_FIELDCAT_ALV', SLIS_T_SORTINFO_ALV: 'SLIS_SORTINFO_ALV',
    SLIS_T_EVENT: 'SLIS_ALV_EVENT', SLIS_T_LISTHEADER: 'SLIS_LISTHEADER',
    LVC_T_FCAT: 'LVC_S_FCAT', LVC_T_SORT: 'LVC_S_SORT',
    BAPIRET2_T: 'BAPIRET2', BAPIRET2_TAB: 'BAPIRET2', BAPIRETTAB: 'BAPIRET2',
    STRING_TABLE: 'STRING', STRINGTAB: 'STRING'
  };

  // Primary keys of the dummy DB tables (used for ALV key columns)
  const DB_KEYS = {
    SCARR: ['CARRID'], SPFLI: ['CARRID', 'CONNID'], SFLIGHT: ['CARRID', 'CONNID', 'FLDATE'],
    SBOOK: ['CARRID', 'CONNID', 'FLDATE', 'BOOKID'], MARA: ['MATNR'], MAKT: ['MATNR', 'SPRAS'],
    KNA1: ['KUNNR'], LFA1: ['LIFNR'], T001: ['BUKRS'], T005: ['LAND1'],
    VBAK: ['VBELN'], VBAP: ['VBELN', 'POSNR'],
    EKKO: ['EBELN'], EKPO: ['EBELN', 'EBELP'], T001W: ['WERKS'], MARC: ['MATNR', 'WERKS'],
    MARD: ['MATNR', 'WERKS', 'LGORT'], BKPF: ['BUKRS', 'BELNR', 'GJAHR'], BSEG: ['BUKRS', 'BELNR', 'GJAHR', 'BUZEI'],
    LIKP: ['VBELN'], LIPS: ['VBELN', 'POSNR'], VBRK: ['VBELN'], VBRP: ['VBELN', 'POSNR'],
    MKPF: ['MBLNR', 'MJAHR'], MSEG: ['MBLNR', 'MJAHR', 'ZEILE'], T001L: ['WERKS', 'LGORT'], T023T: ['SPRAS', 'MATKL'],
    SCUSTOM: ['ID'], PA0001: ['PERNR', 'ENDDA', 'BEGDA'], PA0002: ['PERNR', 'ENDDA', 'BEGDA'], PA0008: ['PERNR', 'ENDDA', 'BEGDA'],
    T527X: ['SPRAS', 'ORGEH', 'ENDDA']
  };

  // Output lengths of well-known data elements (for ALPHA conversion)
  const DDIC_LEN = { MATNR: 18, KUNNR: 10, LIFNR: 10, VBELN: 10, POSNR: 6, BUKRS: 4, BOOKID: 8, CUSTOMID: 8, CONNID: 4,
    MBLNR: 10, PERNR: 8, ORGEH: 8, ZEILE: 4, VGBEL: 10, AUBEL: 10, VGPOS: 6, AUPOS: 6, KUNRG: 10, KUNAG: 10 };

  // Field labels as the SAP data dictionary would deliver them
  const DDIC_LABELS = {
    MANDT: 'Client', CARRID: 'Airline', CARRNAME: 'Airline Name', CURRCODE: 'Airline Currency', URL: 'URL',
    CONNID: 'Flight Number', COUNTRYFR: 'Country From', CITYFROM: 'Depart. City', AIRPFROM: 'Dep. Airport',
    COUNTRYTO: 'Country To', CITYTO: 'Arrival City', AIRPTO: 'Dest. Airport', FLTIME: 'Flight Time',
    DEPTIME: 'Departure Time', ARRTIME: 'Arrival Time', DISTANCE: 'Distance', DISTID: 'Distance Unit',
    FLDATE: 'Flight Date', PRICE: 'Airfare', CURRENCY: 'Currency', PLANETYPE: 'Plane Type',
    SEATSMAX: 'Max. Capacity', SEATSOCC: 'Occupied Seats', PAYMENTSUM: 'Total Bookings',
    BOOKID: 'Booking Number', CUSTOMID: 'Customer Number', CUSTTYPE: 'Customer Type', CLASS: 'Class',
    FORCURAM: 'Amount (Foreign Curr.)', FORCURKEY: 'Payment Currency', LOCCURAM: 'Amount (Local Curr.)',
    LOCCURKEY: 'Local Currency', ORDER_DATE: 'Booking Date', LUGGWEIGHT: 'Luggage Weight', WUNIT: 'Weight Unit',
    MATNR: 'Material', ERSDA: 'Created On', ERNAM: 'Created By', MTART: 'Material Type',
    MBRSH: 'Industry Sector', MATKL: 'Material Group', MEINS: 'Base Unit of Measure', BRGEW: 'Gross Weight',
    NTGEW: 'Net Weight', GEWEI: 'Weight Unit', VOLUM: 'Volume', VOLEH: 'Volume Unit',
    SPRAS: 'Language', MAKTX: 'Material Description', KUNNR: 'Customer', LIFNR: 'Vendor', NAME1: 'Name',
    ORT01: 'City', LAND1: 'Country', STRAS: 'Street', TELF1: 'Telephone', BRSCH: 'Industry',
    BUKRS: 'Company Code', BUTXT: 'Company Name', WAERS: 'Currency', LANDX: 'Country Name',
    VBELN: 'Sales Document', ERDAT: 'Created On', AUDAT: 'Document Date', AUART: 'Sales Doc. Type',
    VKORG: 'Sales Organization', VTWEG: 'Distribution Channel', SPART: 'Division', NETWR: 'Net Value',
    WAERK: 'Doc. Currency', POSNR: 'Item', ARKTX: 'Description', KWMENG: 'Order Quantity',
    WERKS: 'Plant', LGORT: 'Storage Location',
    EBELN: 'Purchasing Document', EBELP: 'Item', BEDAT: 'Document Date', EKORG: 'Purch. Organization', EKGRP: 'Purchasing Group',
    BSART: 'Document Type', LOEKZ: 'Deletion Indicator', TXZ01: 'Short Text', MENGE: 'PO Quantity', NETPR: 'Net Price',
    PEINH: 'Price Unit', LABST: 'Unrestricted Stock', INSME: 'Quality Inspection', SPEME: 'Blocked Stock',
    DISMM: 'MRP Type', DISPO: 'MRP Controller', BESKZ: 'Procurement Type', EISBE: 'Safety Stock', PLIFZ: 'Planned Deliv. Time',
    BELNR: 'Document Number', GJAHR: 'Fiscal Year', BLART: 'Document Type', BLDAT: 'Document Date', BUDAT: 'Posting Date',
    XBLNR: 'Reference', BKTXT: 'Header Text', BUZEI: 'Line Item', BSCHL: 'Posting Key', KOART: 'Account Type',
    SHKZG: 'Debit/Credit', DMBTR: 'Amount in LC', WRBTR: 'Amount', HKONT: 'G/L Account', SGTXT: 'Text', USNAM: 'User Name',
    LFART: 'Delivery Type', VSTEL: 'Shipping Point', LFDAT: 'Delivery Date', WADAT_IST: 'Actual GI Date', LFIMG: 'Delivery Quantity',
    VGBEL: 'Reference Document', VGPOS: 'Reference Item', FKART: 'Billing Type', FKDAT: 'Billing Date', KUNRG: 'Payer', KUNAG: 'Sold-to Party',
    FKIMG: 'Billed Quantity', VRKME: 'Sales Unit', AUBEL: 'Sales Document', AUPOS: 'Sales Document Item', FKSTO: 'Cancelled',
    MBLNR: 'Material Document', MJAHR: 'Material Doc. Year', ZEILE: 'Item', BWART: 'Movement Type', LGOBE: 'Storage Loc. Description',
    WGBEZ: 'Material Group Desc.', ID: 'Customer Number', NAME: 'Customer Name', FORM: 'Form of Address', STREET: 'Street', CITY: 'City',
    COUNTRY: 'Country', DISCOUNT: 'Discount (%)', LANGU: 'Language', CANCELLED: 'Cancelled',
    PERNR: 'Personnel Number', BEGDA: 'Start Date', ENDDA: 'End Date', NACHN: 'Last Name', VORNA: 'First Name', GESCH: 'Gender',
    GBDAT: 'Date of Birth', NATIO: 'Nationality', PERSG: 'Employee Group', PERSK: 'Employee Subgroup', ORGEH: 'Organizational Unit',
    PLANS: 'Position', ENAME: 'Employee Name', TRFAR: 'Pay Scale Type', TRFGR: 'Pay Scale Group', BET01: 'Wage Type Amount', ORGTX: 'Org. Unit Text'
  };

  // Importing/exporting parameters of the classic ALV display function modules
  const ALV_PARAMS = new Set(('I_INTERFACE_CHECK I_BYPASSING_BUFFER I_BUFFER_ACTIVE I_CALLBACK_PROGRAM I_CALLBACK_PF_STATUS_SET ' +
    'I_CALLBACK_USER_COMMAND I_CALLBACK_TOP_OF_PAGE I_CALLBACK_HTML_TOP_OF_PAGE I_CALLBACK_HTML_END_OF_LIST I_STRUCTURE_NAME ' +
    'I_BACKGROUND_ID I_GRID_TITLE I_GRID_SETTINGS IS_LAYOUT IS_LAYOUT_LVC IT_FIELDCAT IT_FIELDCAT_LVC IT_EXCLUDING IT_SPECIAL_GROUPS ' +
    'IT_SPECIAL_GROUPS_LVC IT_SORT IT_SORT_LVC IT_FILTER IT_FILTER_LVC IS_SEL_HIDE I_DEFAULT I_SAVE IS_VARIANT IT_EVENTS IT_EVENT_EXIT ' +
    'IS_PRINT IS_PRINT_LVC IS_REPREP_ID I_SCREEN_START_COLUMN I_SCREEN_START_LINE I_SCREEN_END_COLUMN I_SCREEN_END_LINE ' +
    'I_HTML_HEIGHT_TOP I_HTML_HEIGHT_END IT_ALV_GRAPHICS IT_HYPERLINK IT_ADD_FIELDCAT IT_EXCEPT_QINFO IR_SALV_FULLSCREEN_ADAPTER ' +
    'IR_SALV_LIST_ADAPTER I_SUPPRESS_EMPTY_DATA E_EXIT_CAUSED_BY_CALLER ES_EXIT_CAUSED_BY_USER T_OUTTAB').split(' '));

  const ARITH = new Set(['+', '-', '*', '/', 'MOD', 'DIV', '&&', '&']);
  const CMP_OPS = new Set(['=', '<>', '><', '<', '>', '<=', '>=', 'EQ', 'NE', 'LT', 'GT', 'LE', 'GE',
    'IS', 'BETWEEN', 'IN', 'LIKE', 'CS', 'NS', 'CP', 'NP', 'CO', 'CN', 'CA', 'NA']);
  const CALL_SECTIONS = new Set(['EXPORTING', 'IMPORTING', 'TABLES', 'CHANGING', 'EXCEPTIONS', 'RECEIVING']);

  class ABAPInterpreter {
    constructor() {
      this.reset();
    }

    reset() {
      this.variables   = {};  // NAME -> { type, value, desc [, header] }
      this.types       = {};  // NAME -> type descriptor (TYPES)
      this.forms       = {};  // NAME -> { formals, start, end, tokens }
      this.classes     = {};  // NAME -> local class (definition + method implementations)
      this.interfaces  = {};  // NAME -> local interface
      this.userFunctions = {}; // NAME -> FUNCTION ... ENDFUNCTION written in the program
      this.blocks      = {};  // event name -> [[from, to], ...] token ranges
      this.tokens      = [];
      this.handlers    = [];  // SET HANDLER registrations
      this.salvByTag   = {};  // placeholder string of a SALV object -> its variable record
      this.dbCopy      = {};  // per-run copy of the dummy database tables (INSERT/UPDATE/DELETE work on it)
      this.dbCommitted = null;
      this.declared    = new Set();  // declaration statements already processed (global scope)
      this.objCount    = 0;
      this.alvCount    = 0;
      this.alvCommentary = null;
      this.atCtx       = null;
      this.curT        = null;
      this.output      = [];
      this.errors      = [];  // { line, msg, type: 'error' | 'warning' }
      this.callStack   = [];
      this.frames      = [];  // local scopes of running FORMs / methods / functions
      this.loopStack   = [];  // running LOOP AT statements
      this.loopDepth   = 0;
      this.groupMembers = {}; // NAME of a group binding -> { rows, lineDesc } (LOOP AT ... GROUP BY)
      this.hashClass   = null; // class meant by NEW #( ) in the assignment being executed
      this.sqlDepth    = 0;    // > 0 while a subquery / UNION branch is being read
      this.repeatDepth = 0;    // nesting of running loops, across FORM / method calls
      this.locks       = new Map();   // lock entries set with ENQUEUE_... in this run
      this.numberRanges = {};  // object|range -> last number given out by NUMBER_GET_NEXT
      this.unitRun     = null; // set while runUnitTests() executes a test method
      this.subqCache   = null; // results of uncorrelated subqueries of the SELECT being executed
      this.subqSeq     = 0;
      this.stats       = { dbReads: 0, dbRows: 0, dbWrites: 0, inLoop: {} };   // database accesses of this run
      this.structBuild = [];  // open BEGIN OF ... blocks
      this.params      = {};  // selection-screen input (NAME -> value)
      this.rowCtx      = null;
      this.lastWrite   = null;
      this.topDone     = false;
      this.inTop       = false;
      this.selScreenPhase = false;
      this.coerceName  = '';
      this.curLine     = 0;
      this.programName = '';
      this.maxSteps    = 100000;
      this.steps       = 0;
      this._dbDesc     = {};
    }

    // ── Entry point ──────────────────────────────────────────
    // Events run in the order of a real report:
    //   declarations → LOAD-OF-PROGRAM → INITIALIZATION → (selection screen input) →
    //   AT SELECTION-SCREEN → START-OF-SELECTION → END-OF-SELECTION.  TOP-OF-PAGE fires at the first list output.
    run(code, opts = {}) {
      this.reset();
      this.source = String(code || '');
      for (const [k, v] of Object.entries(opts.params || {})) this.params[U(k)] = v;
      this.guard(() => {
        this.prepare(this.source);
        this.hoistDeclarations();
        this.runEvent('LOAD-OF-PROGRAM');
        this.runEvent('INITIALIZATION');
        if (opts.initOnly) return;
        this.applySelectionInput();
        // OBLIGATORY fields: the real selection screen refuses to start until they are filled
        for (const name of Object.keys(this.variables)) {
          const rec = this.variables[name];
          if (rec.obligatory && this.isInitial(rec.value, rec.desc)) {
            this.problem(rec.obligatory, `${name} bertanda OBLIGATORY tetapi kosong — di SAP selection screen menolak dijalankan sampai field ini diisi (isi lewat tombol Parameters / F8). Simulator tetap melanjutkan.`, 'warning');
          }
        }
        this.runEvent('AT SELECTION-SCREEN OUTPUT');
        this.selScreenPhase = true;
        try {
          this.runEvent('AT SELECTION-SCREEN');
        } finally {
          this.selScreenPhase = false;
        }
        this.runEvent('START-OF-SELECTION');
        this.runEvent('END-OF-SELECTION');
      });
      return { output: this.output, variables: this.variables, errors: this.errors, stats: this.runStats() };
    }

    // Database accesses of the run; `repeated` lists SELECT statements executed again and again inside a loop
    runStats() {
      const st = this.stats;
      const repeated = Object.keys(st.inLoop).map(Number).filter(line => st.inLoop[line] > 1).sort((a, b) => a - b).map(line => ({ line, count: st.inLoop[line] }));
      return { dbReads: st.dbReads, dbRows: st.dbRows, dbWrites: st.dbWrites, steps: this.steps, repeated };
    }

    // Record a problem that does not stop the simulation
    problem(t, msg, type = 'warning') {
      const line = (t && t.lineNo) || this.curLine || 0;
      if (this.errors.some(e => e.line === line && e.msg === msg)) return;
      this.errors.push({ line, msg, type });
    }

    // ── Pre-processing: comments, statements, chains ─────────
    preprocess(code) {
      return this.splitStatements(String(code || '').replace(/\r/g, ''));
    }

    // Returns [{ text, line }] — one entry per ABAP statement
    splitStatements(code) {
      const result = [];
      let buf = '', bufLine = 0, line = 1;
      let inStr = false, strCh = '', lineHasCode = false;

      const flush = () => {
        const stmt = buf.trim();
        if (stmt) for (const s of this.expandChain(stmt)) result.push({ text: s, line: bufLine });
        buf = ''; bufLine = 0;
      };
      const skipToEol = i => { while (i + 1 < code.length && code[i + 1] !== '\n') i++; return i; };

      for (let i = 0; i < code.length; i++) {
        const ch = code[i];
        if (ch === '\n') { line++; lineHasCode = false; inStr = false; buf += ' '; continue; }
        if (inStr) { buf += ch; if (ch === strCh) inStr = false; continue; }

        // "*" comment: column 1 (real ABAP), or an indented "*" at the start of a statement (tolerated)
        if (ch === '*' && !lineHasCode && (i === 0 || code[i - 1] === '\n' || !buf.trim())) { i = skipToEol(i); continue; }
        if (ch === '"') { i = skipToEol(i); continue; }

        if (ch === "'" || ch === '`' || ch === '|') { inStr = true; strCh = ch; }
        if (ch === '.' && !(/\d/.test(code[i - 1] || '') && /\d/.test(code[i + 1] || ''))) { flush(); lineHasCode = true; continue; }
        if (!/\s/.test(ch)) { lineHasCode = true; if (!buf.trim()) bufLine = line; }
        buf += ch;
      }
      flush();
      return result;
    }

    // "KEYWORD: a, b, c" -> ["KEYWORD a", "KEYWORD b", "KEYWORD c"]
    expandChain(stmt) {
      let colon = -1, inStr = false, strCh = '';
      for (let i = 0; i < stmt.length; i++) {
        const ch = stmt[i];
        if (inStr) { if (ch === strCh) inStr = false; continue; }
        if (ch === "'" || ch === '`' || ch === '|') { inStr = true; strCh = ch; continue; }
        if (ch === ':') { colon = i; break; }
      }
      if (colon === -1) return [stmt];
      const before = stmt.substring(0, colon).trim();
      const parts  = this.splitComma(stmt.substring(colon + 1)).map(p => p.trim()).filter(p => p.length);
      if (!parts.length) return [before];
      return parts.map(p => `${before} ${p}`);
    }

    splitComma(str) {
      const parts = [];
      let buf = '', depth = 0, inStr = false, strCh = '';
      for (const ch of str) {
        if (inStr) { buf += ch; if (ch === strCh) inStr = false; continue; }
        if (ch === "'" || ch === '`' || ch === '|') { inStr = true; strCh = ch; buf += ch; continue; }
        if (ch === '(') depth++;
        if (ch === ')') depth--;
        if (ch === ',' && depth <= 0) { parts.push(buf); buf = ''; }
        else buf += ch;
      }
      if (buf.trim()) parts.push(buf);
      return parts;
    }

    // ── Tokenizer: each statement -> { lineNo, words[], raw } ─
    tokenize(stmts) {
      return stmts.map(s => ({ lineNo: s.line, words: this.words(s.text), raw: s.text }));
    }

    // ── Tokenizer: each statement -> { lineNo, words[], raw } ─
    words(stmt) {
      const toks = [];
      let cur = '';
      const push = () => { if (cur) { toks.push(cur); cur = ''; } };
      const idch = c => c !== undefined && /[A-Za-z0-9_]/.test(c);

      for (let i = 0; i < stmt.length; i++) {
        const ch = stmt[i];

        // String literals: 'text', `text`, |template|
        if (ch === "'" || ch === '`' || ch === '|') {
          push();
          let j = i + 1, lit = ch;
          while (j < stmt.length) {
            if (stmt[j] === ch) {
              if (ch !== '|' && stmt[j + 1] === ch) { lit += ch + ch; j += 2; continue; }  // doubled quote
              break;
            }
            lit += stmt[j++];
          }
          toks.push(lit + ch);
          i = j;
          continue;
        }

        if (/\s/.test(ch)) { push(); continue; }

        // Field symbol <fs> is one token; "<fs>-field" stays attached
        if (ch === '<') {
          const m = /^<[A-Za-z_][A-Za-z0-9_]*>/.exec(stmt.slice(i));
          if (m) { push(); cur = m[0]; i += m[0].length - 1; continue; }
        }

        // Hyphen inside a name: gs_scarr-carrid, sy-subrc, <fs>-field, itab[ 1 ]-field
        if (ch === '-' && cur && idch(stmt[i + 1]) && (idch(stmt[i - 1]) || stmt[i - 1] === ']' || (stmt[i - 1] === '>' && cur[0] === '<'))) {
          cur += ch;
          continue;
        }

        // Substring access attached to a name: name+off(len), name+off, name(len)
        if ((ch === '+' || ch === '(') && cur && idch(stmt[i - 1]) && !/^\d/.test(cur)) {
          const m = (ch === '+'
            ? /^\+(?:\d+(?:\((?:\d+|\*|[A-Za-z_][\w-]*)\))?|[A-Za-z_][\w-]*\((?:\d+|\*|[A-Za-z_][\w-]*)\))/
            : /^\(\d+\)/).exec(stmt.slice(i));
          if (m) { cur += m[0]; i += m[0].length - 1; continue; }
        }

        // Multi-character operators
        if (stmt.substr(i, 3) === '->*') { push(); toks.push('->*'); i += 2; continue; }
        const two = ch + (stmt[i + 1] || '');
        if (['<>', '<=', '>=', '->', '=>', '><', '**'].includes(two)) { push(); toks.push(two); i++; continue; }

        if ('(),+-*/=<>'.includes(ch)) { push(); toks.push(ch); continue; }
        cur += ch;
      }
      push();
      return toks;
    }

    // ── Collect FORM definitions ──────────────────────────────
    collectForms(tokens) {
      for (let i = 0; i < tokens.length; i++) {
        const w = tokens[i].words;
        if (U(w[0]) !== 'FORM') continue;
        let j = i + 1;
        while (j < tokens.length && U(tokens[j].words[0]) !== 'ENDFORM') j++;
        this.forms[U(w[1])] = { formals: this.parseFormals(w), start: i + 1, end: j - 1, tokens, line: tokens[i].lineNo };
        i = j;
      }
    }

    // FORM name [TABLES t ...] [USING [VALUE(]p[)] [TYPE x] ...] [CHANGING ...]
    parseFormals(w) {
      const formals = [];
      const up = k => U(w[k]);
      let section = 'USING';
      let i = 2;
      while (i < w.length) {
        const W = up(i);
        if (W === 'TABLES' || W === 'USING' || W === 'CHANGING') { section = W; i++; continue; }
        if (W === 'RAISING') break;
        if (W === 'VALUE' && w[i + 1] === '(') { formals.push({ name: up(i + 2), section, byValue: true }); i += 4; continue; }
        if (W === 'TYPE' || W === 'LIKE' || W === 'STRUCTURE') { i = this.skipTypeSpec(w, i); continue; }
        formals.push({ name: W, section, byValue: false });
        i++;
      }
      return formals;
    }

    // w[i] is TYPE / LIKE / STRUCTURE: returns the index behind the type specification
    skipTypeSpec(w, i) {
      const up = k => U(w[k]);
      i++;
      if ((up(i) === 'REF' && up(i + 1) === 'TO') || (up(i) === 'LINE' && up(i + 1) === 'OF')) return i + 3;
      if (['STANDARD', 'SORTED', 'HASHED', 'INDEX', 'ANY'].includes(up(i)) && up(i + 1) === 'TABLE') i++;
      if (up(i) === 'TABLE') return i + (up(i + 1) === 'OF' ? 3 : 1);
      return i + 1;
    }

    // ── Main execution loop ───────────────────────────────────
    execute(tokens, from, to) {
      let i = from;
      while (i <= to) {
        const t = tokens[i];
        if (!t || !t.words.length) { i++; continue; }
        this.curLine = t.lineNo;
        this.curT = t;
        if (++this.steps > this.maxSteps) throw { message: 'Maximum execution steps exceeded (infinite loop?)', line: t.lineNo };

        const kw = U(t.words[0]).replace(/[:.]+$/, '');

        switch (kw) {
          case 'REPORT':
          case 'PROGRAM':
            this.programName = U(t.words[1]);
            i++; break;

          case 'INCLUDE':
            this.execInclude(t); i++; break;

          case 'TABLES':
            this.execTables(t); i++; break;

          case 'DATA':
          case 'CLASS-DATA':
            this.execData(t, false); i++; break;

          case 'STATICS':
            this.execStatics(t); i++; break;

          case 'CONSTANTS':
            this.execData(t, true); i++; break;

          case 'TYPES':
            this.execTypes(t); i++; break;

          case 'PARAMETERS':
          case 'PARAMETER':
            this.execParameters(t); i++; break;

          case 'SELECT-OPTIONS':
          case 'RANGES':
            this.execSelectOptions(t); i++; break;

          case 'FINAL':
            // FINAL(x) = expr  (immutable inline declaration)
            if (t.words[1] === '(') this.execData(t, false);
            i++; break;

          case 'SELECT': {
            const res = this.execSelect(t);
            if (res && res.loopRows) {
              // SELECT ... ENDSELECT loop
              let end = i + 1;
              while (end < tokens.length && U(tokens[end].words[0]) !== 'ENDSELECT') end++;
              if (end < tokens.length) {
                this.runSelectLoop(tokens, i, end, res);
                i = end + 1; break;
              }
              res.assignFirst();
            }
            i++; break;
          }

          case 'START-OF-SELECTION':
          case 'END-OF-SELECTION':
          case 'INITIALIZATION':
          case 'LOAD-OF-PROGRAM':
          case 'TOP-OF-PAGE':
          case 'END-OF-PAGE':
          case 'SELECTION-SCREEN':
          case 'FIELD-SYMBOLS':
          case 'ENDSELECT':
          case 'TYPE-POOLS':
          case 'ENDFUNCTION':
          case 'ENDMODULE':
          case 'FORMAT':
          case 'NEW-PAGE':
          case 'BREAK-POINT':
          case 'RESERVE':
          case 'POSITION':
          case 'BACK':
          case 'WAIT':
          case 'NODES':
          case 'INFOTYPES':
            i++; break;

          case 'FUNCTION':
            i = this.skipToEnd(tokens, i, 'ENDFUNCTION') + 1; break;

          case 'MODULE':
            // dynpro modules (PBO / PAI) are never called: there are no screens in the simulator
            i = this.skipToEnd(tokens, i, 'ENDMODULE') + 1; break;

          case 'WRITE':
            this.execWrite(t); i++; break;

          case 'SKIP': {
            const n = isNum(t.words[1]) ? Number(t.words[1]) : 1;
            this.topOfPage();
            for (let k = 0; k < n; k++) this.output.push({ text: '', cls: 'info' });
            i++; break;
          }

          case 'ULINE':
            this.execUline(t); i++; break;

          case 'NEW-LINE':
            this.lastWrite = null; i++; break;

          case 'HIDE':
            this.execHide(t); i++; break;

          case 'COLLECT':
            this.execCollect(t); i++; break;

          case 'SUM':
            this.execSum(t); i++; break;

          case 'UPDATE':
            this.execDbWrite(t, 'UPDATE'); i++; break;

          case 'COMMIT':
            this.dbCommitted = this.clone(this.dbCopy);
            this.setSy('SUBRC', 0); i++; break;

          case 'ROLLBACK':
            this.dbCopy = this.dbCommitted ? this.clone(this.dbCommitted) : {};
            this.setSy('SUBRC', 0); i++; break;

          case 'AUTHORITY-CHECK': {
            // the simulated user DEVELOPER may create / change / display (ACTVT 01, 02, 03) but not delete (06)
            const aw = t.words, au = aw.map(U);
            let denied = false;
            for (let k = 0; k + 3 < au.length; k++) {
              if (au[k] === 'ID' && au[k + 2] === 'FIELD'
                  && this.formatOut(this.evalExpr([aw[k + 1]])).trim().toUpperCase() === 'ACTVT'
                  && this.formatOut(this.evalExpr([aw[k + 3]])).trim() === '06') denied = true;
            }
            this.setSy('SUBRC', denied ? 4 : 0); i++; break;
          }

          case 'ASSERT':
            if (!this.evalCond(t.words.slice(1))) throw { message: `ASSERT gagal: kondisi "${t.words.slice(1).join(' ')}" tidak terpenuhi (di SAP: short dump ASSERTION_FAILED)`, line: t.lineNo };
            i++; break;

          case 'SET':
            this.execSet(t); i++; break;

          case 'GET':
            this.execGet(t); i++; break;

          case 'CLEAR':
            this.execClear(t); i++; break;

          case 'REFRESH':
          case 'FREE':
            this.execRefresh(t); i++; break;

          case 'MOVE':
            this.execMove(t); i++; break;

          case 'MOVE-CORRESPONDING':
            this.execMoveCorresponding(t); i++; break;

          case 'COMPUTE':
            this.execCompute(t); i++; break;

          case 'ADD':
          case 'SUBTRACT':
          case 'MULTIPLY':
          case 'DIVIDE':
            this.execArith(t, kw); i++; break;

          case 'CONCATENATE':
            this.execConcatenate(t); i++; break;

          case 'SPLIT':
            this.execSplit(t); i++; break;

          case 'TRANSLATE':
            this.execTranslate(t); i++; break;

          case 'CONDENSE':
            this.execCondense(t); i++; break;

          case 'APPEND':
            this.execAppend(t); i++; break;

          case 'INSERT':
            this.execInsert(t); i++; break;

          case 'MODIFY':
            this.execModify(t); i++; break;

          case 'DELETE':
            this.execDeleteTable(t); i++; break;

          case 'SORT':
            this.execSort(t); i++; break;

          case 'READ':
            this.execRead(t); i++; break;

          case 'DESCRIBE':
            this.execDescribe(t); i++; break;

          case 'IF': {
            const end = this.findMatchingEnd(tokens, i, 'IF', 'ENDIF');
            i += this.execIf(tokens, i, end);
            break;
          }

          case 'CASE': {
            const end = this.findMatchingEnd(tokens, i, 'CASE', 'ENDCASE');
            i += this.execCase(tokens, i, end);
            break;
          }

          case 'DO': {
            const end = this.findMatchingEnd(tokens, i, 'DO', 'ENDDO');
            i += this.execDo(tokens, i, end);
            break;
          }

          case 'WHILE': {
            const end = this.findMatchingEnd(tokens, i, 'WHILE', 'ENDWHILE');
            i += this.execWhile(tokens, i, end);
            break;
          }

          case 'LOOP': {
            const end = this.findMatchingEnd(tokens, i, 'LOOP', 'ENDLOOP');
            i += this.execLoop(tokens, i, end);
            break;
          }

          case 'TRY': {
            const end = this.findMatchingEnd(tokens, i, 'TRY', 'ENDTRY');
            this.execTry(tokens, i, end);
            i = end + 1; break;
          }

          case 'RAISE':
            this.execRaise(t); i++; break;

          case 'ASSIGN':
            this.execAssign(t); i++; break;

          case 'UNASSIGN':
            delete this.variables[U(t.words[1])]; i++; break;

          case 'REPLACE':
            this.execReplace(t); i++; break;

          case 'FIND':
            this.execFind(t); i++; break;

          case 'SHIFT':
            this.execShift(t); i++; break;

          case 'PERFORM':
            this.execPerform(t); i++; break;

          case 'FORM':
            i = this.skipToEnd(tokens, i, 'ENDFORM') + 1; break;

          case 'ENDFORM':
          case 'ENDLOOP':
          case 'ENDDO':
          case 'ENDWHILE':
          case 'ENDIF':
          case 'ENDCASE':
          case 'ENDTRY':
          case 'CATCH':
          case 'CLEANUP':
          case 'ELSE':
          case 'ELSEIF':
          case 'WHEN':
          case 'ENDAT':
            i++; break;

          case 'AT':
            // AT FIRST / NEW f / END OF f / LAST inside a LOOP (event keywords never reach this point)
            i = this.execAt(tokens, i); break;

          case 'EXIT':
            if (this.loopDepth > 0) throw { signal: 'EXIT_LOOP' };
            throw { signal: this.frames.length ? 'RETURN' : 'STOP' };

          case 'RETURN':
            throw { signal: this.frames.length ? 'RETURN' : 'STOP' };

          case 'STOP':
            throw { signal: 'STOP' };

          case 'LEAVE':
            if (U(t.words[1]) === 'PROGRAM') throw { signal: 'END' };
            if (U(t.words[1]) === 'LIST-PROCESSING') { i++; break; }
            // LEAVE SCREEN / LEAVE TO SCREEN n: end of the current processing block
            throw { signal: this.frames.length ? 'RETURN' : 'STOP' };

          case 'CHECK':
            if (!this.evalCond(t.words.slice(1))) {
              if (this.loopDepth > 0) throw { signal: 'CONTINUE' };
              throw { signal: this.frames.length ? 'RETURN' : 'STOP' };
            }
            i++; break;

          case 'CONTINUE':
            if (this.loopDepth > 0) throw { signal: 'CONTINUE' };
            i++; break;

          case 'MESSAGE':
            this.execMessage(t); i++; break;

          case 'CALL': {
            const second = U(t.words[1]);
            if (second === 'FUNCTION') this.execCallFunction(t);
            else if (second === 'METHOD') this.execOther(t);
            else if (second === 'SCREEN' || second === 'SELECTION-SCREEN') {
              this.problem(t, `CALL ${second}: Dynpro / screen tidak disimulasikan (screen dibuat di Screen Painter, bukan di kode program) — dilewati`, 'warning');
            } else if (second === 'TRANSACTION') {
              const spa = Object.keys(this.spa || {}).map(k => `${k} = ${this.spa[k]}`).join(', ');
              this.lastWrite = null;
              this.output.push({ text: `[CALL TRANSACTION] ${this.formatOut(this.evalExpr([t.words[2]]))}${spa ? ' (parameter: ' + spa + ')' : ''} — di SAP transaksi ini akan terbuka; simulator tidak menjalankannya`, cls: 'info' });
            }
            i++; break;
          }

          case 'CREATE':
            this.execCreate(t); i++; break;

          case 'CLASS':
          case 'INTERFACE': {
            // definitions and implementations were collected up front (collectClasses)
            const up = t.words.map(U);
            if (up.includes('DEFERRED') || up.includes('LOAD')) { i++; break; }
            const closeKw = kw === 'CLASS' ? 'ENDCLASS' : 'ENDINTERFACE';
            let end = i + 1;
            while (end < tokens.length && U(tokens[end].words[0]) !== closeKw) end++;
            i = end + 1; break;
          }

          case 'ENDCLASS':
          case 'METHOD':
          case 'ENDMETHOD':
          case 'METHODS':
          case 'CLASS-METHODS':
          case 'INTERFACES':
          case 'ALIASES':
          case 'EVENTS':
          case 'ENDINTERFACE':
          case 'PUBLIC':
          case 'PRIVATE':
          case 'PROTECTED':
          case 'SECTION':
            i++; break;

          default:
            this.execOther(t);
            i++; break;
        }
      }
      return i;
    }

    // Statements that do not start with a handled keyword: assignments, method calls
    execOther(t) {
      let w = t.words;
      const rawUpper = t.raw.toUpperCase();
      if (rawUpper.includes('CL_SALV_TABLE') && /=>\s*FACTORY/.test(rawUpper)) { this.execSalvFactory(t); return; }
      if (rawUpper.includes('SET_TABLE_FOR_FIRST_DISPLAY')) { this.execGridDisplay(t); return; }

      if (U(w[0]) === 'CALL') {
        if (U(w[1]) !== 'METHOD') return;
        // CALL METHOD obj->meth( ... )  |  CALL METHOD obj->meth EXPORTING ... (no parentheses)
        w = w.slice(2);
        const sec = w.findIndex((x, idx) => CALL_SECTIONS.has(U(x)) && w[idx + 1] !== '=');
        const par = w.indexOf('(');
        if (par === -1 || (sec !== -1 && sec < par)) w = sec === -1 ? [...w, '(', ')'] : [...w.slice(0, sec), '(', ...w.slice(sec), ')'];
        this.evalExpr(w);
        return;
      }

      // assignment: the first "=" outside parentheses / brackets
      const lv = this.levels(w);
      let eq = -1;
      for (let k = 1; k < w.length; k++) if (lv[k] === 0 && w[k] === '=') { eq = k; break; }
      if (eq > 0) {
        const lhs = w.slice(0, eq), rhs = w.slice(eq + 1);
        let op = null;
        if (lhs.length > 1 && ['+', '-', '*', '/', '&&', '?'].includes(lhs[lhs.length - 1])) op = lhs.pop();
        if (lhs.length === 1 && /^TEXT-\w{3}$/i.test(lhs[0])) {
          this.problem(t, `Text symbol ${lhs[0].toUpperCase()} tidak bisa diisi lewat kode — di SAP teksnya diisi di menu Goto → Text Elements (assignment ini syntax error). Simulator tetap menyimpan nilainya.`, 'warning');
        }
        // lo = NEW #( ... ): the class is taken from the type of the target
        const prevHash = this.hashClass;
        if (U(rhs[0]) === 'NEW' && rhs[1] === '#') {
          let d = null;
          if (lhs.length === 1) { const tr = this.ref(lhs[0]); d = tr && tr.desc; }
          else if (this.isChain(lhs)) { const c = this.resolveChain(lhs, t); d = c.rec && c.rec.desc; }
          this.hashClass = d && d.kind === 'ref' && d.target && d.target !== 'DATA' ? d.target : null;
        }
        // a += 1  ->  a = a + ( 1 );  lo ?= x  ->  lo = x
        let value;
        try {
          value = op && op !== '?' ? this.evalExpr([...lhs, op, '(', ...rhs, ')']) : this.evalExpr(rhs);
        } finally {
          this.hashClass = prevHash;
        }
        // a = b = c: multiple assignment
        if (this.assignChain(lhs, value, t) === false && lhs.length > 1 && !this.isChain(lhs) && this.closeBracket(lhs, 0) === -1) {
          this.problem(t, `Statement "${t.raw.slice(0, 50)}" tidak dikenali simulator — dilewati`, 'warning');
        }
        return;
      }

      // a statement that is only a call: obj->meth( ... ) / cls=>meth( ... ) / own_method( ... )
      if (this.isChain(w) || (w[1] === '(' && this.matchParen(w, 1) === w.length - 1)) { this.evalExpr(w); return; }

      const kw = U(w[0]);
      if (kw === 'SUBMIT') {
        this.output.push({ text: `[SUBMIT] program ${U(w[1])} tidak dijalankan di simulator`, cls: 'info' });
        return;
      }
      if (/^[A-Z][A-Z-]*$/.test(kw)) {
        this.problem(t, `Statement "${kw}${w[1] ? ' ' + String(w[1]).toUpperCase() : ''} ..." belum didukung simulator — dilewati`, 'warning');
      }
    }

    isChain(w) {
      if ((U(w[0]) === 'NEW' || U(w[0]) === 'CAST') && w[2] === '(') return true;
      const lv = this.levels(w);
      for (let i = 0; i < w.length; i++) {
        if (lv[i] === 0 && (w[i] === '->' || w[i] === '=>' || w[i] === '->*')) return true;
      }
      return false;
    }

    // target = variable, struct component, obj->attr, cls=>attr, dref->*, itab[ ... ]-comp
    assignChain(lhs, value, t) {
      if (lhs.length === 1) return this.assignTo(lhs[0], value, t);
      const cb = this.closeBracket(lhs, 0);
      if (cb === lhs.length - 1) {
        this.tableExpr(lhs, cb).set(this.clone(value));
        return true;
      }
      if (!this.isChain(lhs)) return false;
      const before = this.errors.length;
      const cur = this.resolveChain(lhs, t);
      if (!cur.rec) {
        // resolveChain usually reported the precise reason already
        if (this.errors.length === before) this.problem(t, `Target assignment "${lhs.join('')}" tidak bisa diisi`, 'error');
        return false;
      }
      if (cur.rec.readonly) {
        this.problem(t, `"${lhs.join('')}" bersifat READ-ONLY / CONSTANTS dan tidak boleh diubah`, 'error');
        return false;
      }
      cur.rec.value = this.shape(cur.rec.desc, this.clone(value));
      return true;
    }

    // Dummy database table (a copy per run, so INSERT / UPDATE / DELETE never change the original data)
    dbTable(name) {
      const db = (typeof window !== 'undefined' && window.ABAP_DB) || {};
      const N = U(name);
      if (this.dbCopy[N]) return this.dbCopy[N];
      for (const k of Object.keys(db)) {
        if (k.toUpperCase() === N) return (this.dbCopy[N] = db[k].map(r => Object.assign({}, r)));
      }
      return null;
    }

    dbNames() {
      return Object.keys((typeof window !== 'undefined' && window.ABAP_DB) || {});
    }

    elemOfSample(sample, fieldName) {
      let d;
      if (typeof sample === 'number') d = { kind: 'elem', base: Number.isInteger(sample) ? 'int' : 'float' };
      else if (DATE_FIELDS.has(fieldName)) d = { kind: 'elem', base: 'date' };
      else if (TIME_FIELDS.has(fieldName)) d = { kind: 'elem', base: 'time' };
      else d = { kind: 'elem', base: 'string' };
      if (DDIC_LEN[fieldName]) d.len = DDIC_LEN[fieldName];
      return d;
    }

    dbStructDesc(name) {
      const N = U(name);
      if (this._dbDesc[N]) return this._dbDesc[N];
      const rows = this.dbTable(N);
      if (!rows || !rows.length) return null;
      const fields = Object.keys(rows[0]).map(f => {
        const d = this.elemOfSample(rows[0][f], U(f));
        if (d.base === 'int' && rows.some(r => typeof r[f] === 'number' && !Number.isInteger(r[f]))) d.base = 'float';
        return { name: U(f), desc: d };
      });
      return (this._dbDesc[N] = { kind: 'struct', fields, ddic: N });
    }

    ddicStructDesc(N) {
      const key = '#' + N;
      if (this._dbDesc[key]) return this._dbDesc[key];
      const fields = DDIC_STRUCTS[N].split(' ').map(f => {
        const [name, ty] = f.split(':');
        return { name, desc: { kind: 'elem', base: ty === 'i' ? 'int' : ty === 'f' ? 'float' : 'string' } };
      });
      return (this._dbDesc[key] = { kind: 'struct', fields, ddic: N, open: true });
    }

    // Resolve a type name: built-in, TYPES, DDIC structure, DB table, table-field, data element
    resolveNamed(nameRaw) {
      const N = U(nameRaw);
      // generic = length not given explicitly (matters for parameters: TYPE c accepts any length)
      if (N === 'C' || N === 'CHAR') return { kind: 'elem', base: 'char', len: 1, generic: true };
      if (N === 'N' || N === 'NUMC') return { kind: 'elem', base: 'numc', len: 1, generic: true };
      if (N === 'P') return { kind: 'elem', base: 'float', decimals: 0, packed: true };
      if (/^CHAR\d+$/.test(N)) return { kind: 'elem', base: 'char', len: Number(N.slice(4)) };
      if (/^NUMC\d+$/.test(N)) return { kind: 'elem', base: 'numc', len: Number(N.slice(4)) };
      if (['ABAP_BOOL', 'BOOLEAN', 'BOOLE_D', 'FLAG', 'XFELD', 'CHAR1'].includes(N)) return { kind: 'elem', base: 'char', len: 1 };
      if (ELEM[N]) return { kind: 'elem', base: ELEM[N] };
      if (this.types[N]) return this.types[N];
      if (DDIC_TABLE_TYPES[N]) return { kind: 'table', line: this.resolveNamed(DDIC_TABLE_TYPES[N]) };
      if (DDIC_STRUCTS[N]) return this.ddicStructDesc(N);
      const db = this.dbStructDesc(N);
      if (db) return db;

      if (N.includes('-')) {
        const parts = N.split('-');
        if (parts[0] === 'SY' || parts[0] === 'SYST') {
          const f = parts[1];
          if (f === 'DATUM') return { kind: 'elem', base: 'date' };
          if (f === 'UZEIT') return { kind: 'elem', base: 'time' };
          if (['SUBRC', 'TABIX', 'INDEX', 'DBCNT', 'TFILL', 'LINNO', 'PAGNO'].includes(f)) return { kind: 'elem', base: 'int' };
          return { kind: 'elem', base: 'string' };
        }
        let d = this.resolveNamed(parts[0]);
        if (d.unknown && this.variables[parts[0]]) d = this.variables[parts[0]].desc || d;
        if (d && d.kind === 'table') d = d.line;      // LIKE itab-field (table with header line)
        for (let k = 1; k < parts.length && d; k++) d = this.fieldDesc(d, parts[k]);
        if (d) return d;
        return { kind: 'elem', base: 'any', unknown: true };
      }

      // data element named like a column of a dummy table (matnr, kunnr, netwr ...)
      for (const tab of this.dbNames()) {
        const s = this.dbStructDesc(tab);
        const f = s && s.fields.find(x => x.name === N);
        if (f) return f.desc;
      }
      return { kind: 'elem', base: 'any', unknown: true };
    }

    fieldDesc(desc, field) {
      if (!desc || desc.kind !== 'struct') return null;
      const f = desc.fields.find(x => x.name === U(field));
      return f ? f.desc : null;
    }

    // Type of an existing data object (LIKE ...)
    descOfData(name) {
      const r = this.ref(name);
      if (r) return r.desc || this.inferDesc(r.get());
      return this.resolveNamed(name);
    }

    inferDesc(v) {
      if (v instanceof AbapObject) return { kind: 'ref', target: v.cls };
      if (v instanceof DataRef) return { kind: 'ref', target: 'DATA' };
      if (Array.isArray(v)) return { kind: 'table', line: v.length ? this.inferDesc(v[0]) : { kind: 'elem', base: 'any' }, tkind: 'STANDARD', key: [], unique: false };
      if (isObj(v)) return { kind: 'struct', open: true, fields: Object.keys(v).map(k => ({ name: U(k), desc: this.inferDesc(v[k]) })) };
      if (typeof v === 'number') return { kind: 'elem', base: Number.isInteger(v) ? 'int' : 'float' };
      return { kind: 'elem', base: 'any' };
    }

    // Words after the data object name: TYPE|LIKE ... [LENGTH n] [DECIMALS n] [WITH ... KEY ...] [VALUE ...]
    resolveTypeSpec(spec) {
      const up = spec.map(U);
      let len = null;

      let i = up.indexOf('TYPE'), like = false;
      if (i === -1) { i = up.indexOf('LIKE'); like = i !== -1; }
      if (i === -1) { i = up.indexOf('FOR'); like = i !== -1; }

      const any = { kind: 'elem', base: 'any' };
      let desc;
      if (i === -1) {
        desc = { kind: 'elem', base: 'char', len: 1, generic: true };   // default: TYPE c LENGTH 1
      } else {
        const named = n => (like ? this.descOfData(n) : this.resolveNamed(n));
        let j = i + 1;
        if (up[i] === 'FOR') {
          desc = this.rangeDesc(named(spec[j]));
        } else if (up[j] === 'REF' && up[j + 1] === 'TO') {
          desc = { kind: 'ref', target: up[j + 2] };
        } else if (up[j] === 'RANGE' && up[j + 1] === 'OF') {
          desc = this.rangeDesc(named(spec[j + 2]));
        } else if (up[j] === 'LINE' && up[j + 1] === 'OF') {
          const d = named(spec[j + 2]);
          desc = d.kind === 'table' ? d.line : any;
        } else {
          let tkind = 'STANDARD';
          if (['STANDARD', 'SORTED', 'HASHED', 'INDEX', 'ANY'].includes(up[j]) && up[j + 1] === 'TABLE') { tkind = up[j]; j++; }
          if (up[j] === 'TABLE') {
            let line = any;
            if (up[j + 1] === 'OF') {
              const n = j + 2;
              line = up[n] === 'REF' && up[n + 1] === 'TO' ? { kind: 'ref', target: up[n + 2] } : named(spec[n]);
            }
            desc = { kind: 'table', line, tkind: tkind === 'SORTED' || tkind === 'HASHED' ? tkind : 'STANDARD', key: [], unique: false };
            // WITH [UNIQUE | NON-UNIQUE] KEY f1 f2 ...
            const ki = up.indexOf('KEY', j);
            if (ki !== -1 && up[ki - 1] !== 'DEFAULT' && up[ki - 1] !== 'EMPTY') {
              desc.unique = up[ki - 1] === 'UNIQUE';
              for (let k = ki + 1; k < spec.length; k++) {
                if (['WITH', 'INITIAL', 'VALUE', 'READ-ONLY', 'OCCURS'].includes(up[k])) break;
                if (up[k] !== 'TABLE_LINE' && up[k] !== 'COMPONENTS' && up[k] !== 'PRIMARY_KEY') desc.key.push(up[k]);
              }
            }
          } else {
            desc = spec[j] !== undefined ? named(spec[j]) : any;
          }
        }
      }

      const li = up.indexOf('LENGTH');
      if (li !== -1 && isNum(spec[li + 1])) len = Number(spec[li + 1]);
      if (len && desc.kind === 'elem') desc = Object.assign({}, desc, { len, generic: false });
      if (desc.packed) {
        const di = up.indexOf('DECIMALS');
        desc = Object.assign({}, desc, { decimals: di !== -1 && isNum(spec[di + 1]) ? Number(spec[di + 1]) : 0 });
      }
      if (up.includes('OCCURS') && desc.kind !== 'table') desc = { kind: 'table', line: desc, tkind: 'STANDARD', key: [], unique: false };
      return desc;
    }

    rangeDesc(lowDesc) {
      const s = { kind: 'elem', base: 'string' };
      return { kind: 'table', line: { kind: 'struct', fields: [
        { name: 'SIGN', desc: s }, { name: 'OPTION', desc: s },
        { name: 'LOW', desc: lowDesc || s }, { name: 'HIGH', desc: lowDesc || s }] } };
    }

    initValue(desc) {
      if (!desc) return '';
      switch (desc.kind) {
        case 'table': return [];
        case 'struct': {
          const o = {};
          for (const f of desc.fields) o[f.name] = this.initValue(f.desc);
          return o;
        }
        case 'ref': return null;
        default:
          if (desc.base === 'int' || desc.base === 'float') return 0;
          if (desc.base === 'numc') return '0'.repeat(desc.len || 1);
          return '';
      }
    }

    typeLabel(desc) {
      if (!desc) return 'any';
      if (desc.kind === 'elem') return desc.base;
      return desc.kind;
    }

    typeLabelOf(v) {
      if (v === null || (typeof v === 'object' && !Array.isArray(v) && !isObj(v))) return 'ref';
      if (Array.isArray(v)) return 'table';
      if (isObj(v)) return 'struct';
      if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
      return 'string';
    }

    // Deep copy of tables / structures; object and data references stay references
    clone(v) {
      if (v === null || typeof v !== 'object') return v;
      if (Array.isArray(v)) return v.map(x => this.clone(x));
      if (!isObj(v)) return v;        // AbapObject, DataRef, SalvProxy: reference semantics
      const o = {};
      for (const k of Object.keys(v)) o[k] = this.clone(v[k]);
      return o;
    }

    // Convert a value to the type of the target (rounding, truncation, leading zeros)
    coerce(desc, v) {
      if (!desc || desc.kind !== 'elem' || v === null || typeof v === 'object') return v;
      if (typeof v === 'boolean') v = v ? 'X' : '';
      const blank = typeof v === 'string' && v.trim() === '';
      switch (desc.base) {
        case 'int':
        case 'float': {
          if (blank) return 0;
          if (!isNum(v)) {
            this.raiseSys('CX_SY_CONVERSION_NO_NUMBER', `Nilai "${String(v).slice(0, 40)}" tidak bisa dikonversi menjadi angka${this.coerceName ? ' untuk ' + this.coerceName : ''}`);
          }
          const n = Number(v);
          if (desc.base === 'int') return n < 0 ? -Math.round(-n) : Math.round(n);
          if (desc.decimals !== undefined) {
            const f = Math.pow(10, desc.decimals);
            return (n < 0 ? -Math.round(-n * f + 1e-9) : Math.round(n * f + 1e-9)) / f;
          }
          return Number(n.toPrecision(15));
        }
        case 'char': {
          const s = String(v);
          if (desc.len && s.length > desc.len) {
            if (s.trimEnd().length > desc.len) {
              this.problem(this.curT, `Nilai "${s.slice(0, 30)}" terpotong menjadi "${s.slice(0, desc.len)}"${this.coerceName ? ' karena ' + this.coerceName : ''} bertipe C dengan panjang ${desc.len}`, 'warning');
            }
            return s.slice(0, desc.len);
          }
          return s;
        }
        case 'numc': {
          const len = desc.len || 1;
          return String(v).replace(/\D/g, '').padStart(len, '0').slice(-len);
        }
        case 'date':
        case 'time':
        case 'string':
          return typeof v === 'number' ? String(v) : v;
        default:
          return v;
      }
    }

    // Bring a value into the shape of a declared type (fills missing components)
    shape(desc, v) {
      if (!desc) return v;
      if (desc.kind === 'struct' && isObj(v)) {
        const o = this.initValue(desc);
        for (const k of Object.keys(v)) {
          const fd = this.fieldDesc(desc, k);
          if (!fd && !desc.open) continue;       // the target type has no such component
          o[U(k)] = fd ? this.shape(fd, v[k]) : v[k];
        }
        return o;
      }
      if (desc.kind === 'table' && Array.isArray(v)) return v.map(row => this.shape(desc.line, row));
      if (desc.kind === 'elem') return this.coerce(desc, v);
      return v;
    }

    declareVar(name, desc, value, readonly) {
      const N = U(name).replace(/^@/, '');
      const rec = { type: readonly ? 'const' : this.typeLabel(desc), value: value !== undefined ? value : this.initValue(desc), desc };
      if (readonly) rec.readonly = true;
      if (this.frames.length) {
        const fr = this.frames[this.frames.length - 1];
        if (!(N in fr.saved)) fr.saved[N] = this.variables[N];
      }
      this.variables[N] = rec;
      return rec;
    }

    setSy(field, value) {
      this.variables['SY-' + field] = { type: 'int', value };
    }

    ciKey(obj, field) {
      const F = U(field);
      if (F in obj) return F;
      for (const k of Object.keys(obj)) if (k.toUpperCase() === F) return k;
      return F;
    }

    // Resolve a data object name (variable, struct-component path, <field-symbol>)
    // -> { rec, desc, get(), set(v), isField } or null
    undeclared(name, t) {
      this.problem(t || this.curT, `"${name}" dipakai tanpa dideklarasikan (DATA ${name.toLowerCase()} TYPE ...). Di SAP ini syntax error; simulator membuatnya otomatis.`, 'warning');
    }

    // "NAME+2(3)" / "NAME(3)" / "NAME+off(len)" -> { base, off, len }  (off / len may be variable names)
    splitSub(name) {
      const m = /^(.+?)(?:\+(\d+|[A-Z_][A-Z0-9_-]*))?(?:\((\d+|\*|[A-Z_][A-Z0-9_-]*)\))?$/.exec(name);
      if (!m || (m[2] === undefined && m[3] === undefined)) return null;
      if (m[2] !== undefined && !/^\d+$/.test(m[2]) && m[3] === undefined) return null;
      const num = x => (/^\d+$/.test(x) ? Number(x) : Number(this.evalAtom(x)) || 0);
      return { base: m[1], off: m[2] !== undefined ? num(m[2]) : 0, len: m[3] !== undefined && m[3] !== '*' ? num(m[3]) : undefined };
    }

    ref(nameRaw, create = false, t = null) {
      const name = U(nameRaw).replace(/^@/, '').replace(/\[\]$/, '');
      if (!name) return null;

      const whole = this.variables[name];
      if (whole) {
        return { name, rec: whole, desc: whole.desc, isField: false, get: () => whole.value, set: v => { whole.value = v; } };
      }

      // substring access: var+off(len)
      const sub = /[+(]/.test(name) ? this.splitSub(name) : null;
      if (sub) {
        const base = this.ref(sub.base, create, t);
        if (!base) return null;
        const text = () => {
          const b = !base.isField && base.rec && base.rec.header !== undefined ? base.rec.header : base.get();
          return this.formatOut(b);
        };
        return {
          name, rec: base.rec, desc: { kind: 'elem', base: 'string' }, isField: true,
          get: () => (sub.len === undefined ? text().substr(sub.off) : text().substr(sub.off, sub.len)),
          set: v => {
            const s = text().padEnd(sub.off);
            const len = sub.len === undefined ? Math.max(s.length - sub.off, 0) : sub.len;
            base.set(s.slice(0, sub.off) + this.formatOut(v).padEnd(len).slice(0, len) + s.slice(sub.off + len));
          }
        };
      }

      const parts = name.split('-');
      if (parts.length === 1 || parts[0] === 'SY' || parts[0] === 'SYST') {
        if (!create) return null;
        if (parts.length === 1 && /^[A-Z_][A-Z0-9_]*$/.test(name)) this.undeclared(name, t);
        const rec = (this.variables[name] = { type: 'any', value: '' });
        return { name, rec, desc: undefined, isField: false, get: () => rec.value, set: v => { rec.value = v; rec.type = this.typeLabelOf(v); } };
      }

      let rec = this.variables[parts[0]];
      if (!rec) {
        if (!create) return null;
        if (parts[0] !== 'TEXT') this.undeclared(parts[0], t);      // TEXT-nnn: text symbols
        rec = this.variables[parts[0]] = { type: 'struct', value: {} };
      }
      let root = rec.value, desc = rec.desc;
      if (root instanceof DataRef) { desc = root.rec.desc; root = root.rec.value; }                      // dref->comp written as dref-comp is not ABAP, but harmless
      if (Array.isArray(root) && isObj(rec.header)) { root = rec.header; desc = desc && desc.kind === 'table' ? desc.line : undefined; }   // header line
      if (!isObj(root)) {
        if (!create) return null;
        if (Array.isArray(root)) {
          this.problem(t, `"${parts[0]}" adalah internal table tanpa header line — komponen "${parts.slice(1).join('-')}" tidak bisa diakses langsung (gunakan work area)`, 'error');
          return null;
        }
        if (rec.desc && (rec.desc.kind === 'ref' || (rec.desc.kind === 'elem' && rec.desc.base !== 'any'))) {
          this.problem(t, `"${parts[0]}" bukan struktur, tidak punya komponen "${parts.slice(1).join('-')}"`, 'error');
          return null;
        }
        rec.value = {}; rec.type = 'struct';   // unknown type: treat as open structure
        root = rec.value;
      }

      let obj = root;
      for (let k = 1; k < parts.length - 1; k++) {
        const key = this.ciKey(obj, parts[k]);
        if (!isObj(obj[key])) { if (!create) return null; obj[key] = {}; }
        obj = obj[key];
        desc = this.fieldDesc(desc, parts[k]);
      }
      const last = parts[parts.length - 1];
      const key = this.ciKey(obj, last);
      const fdesc = this.fieldDesc(desc, last);
      if (!(key in obj)) {
        if (desc && desc.kind === 'struct' && !desc.open && !fdesc) {
          if (create) this.problem(t, `Struktur "${parts.slice(0, -1).join('-')}" tidak punya komponen "${last}"`, 'error');
          return null;
        }
        if (!create) return null;
      }
      return { name, rec, desc: fdesc || undefined, isField: true, get: () => obj[key], set: v => { obj[key] = v; } };
    }

    // "DATA(x)" / "FIELD-SYMBOL(<fs>)" / "@x" -> plain name
    targetName(w, k) {
      const X = U(w[k]).replace(/^@/, '');
      if (['DATA', 'FIELD-SYMBOL', 'FINAL'].includes(X) && w[k + 1] === '(') {
        // inline declaration
        if (X !== 'FIELD-SYMBOL' && w[k + 2] && !this.variables[U(w[k + 2])]) this.declareVar(w[k + 2], undefined);
        return w[k + 2];
      }
      return w[k];
    }

    assignTo(target, value, t) {
      const r = this.ref(target, true, t);
      if (!r) return false;
      if (r.rec && r.rec.readonly) {
        this.problem(t, `"${r.name}" adalah CONSTANTS dan tidak boleh diubah`, 'error');
        return false;
      }
      this.coerceName = r.name;
      try {
        // table with header line: the plain name is the header line, name[] is the table body
        if (!r.isField && r.rec.header !== undefined && !/\[\]$/.test(String(target)) && !Array.isArray(value)) {
          r.rec.header = this.shape(r.desc && r.desc.kind === 'table' ? r.desc.line : undefined, this.clone(value));
          return true;
        }
        r.set(this.shape(r.desc, this.clone(value)));
      } finally {
        this.coerceName = '';
      }
      if (!r.isField && !r.desc && r.rec && r.rec.type === 'any') r.rec.type = this.typeLabelOf(r.rec.value);
      return true;
    }

    execTypes(t) {
      if (this.once(t)) return;
      const w = t.words;
      if (U(w[1]) === 'BEGIN' && U(w[2]) === 'OF') { this.structBuild.push({ kind: 'types', name: U(w[3]), fields: [], values: {} }); return; }
      if (U(w[1]) === 'END' && U(w[2]) === 'OF') { this.closeStruct(); return; }
      if (!w[1]) return;
      const { name, desc } = this.parseDecl(w);
      const top = this.structBuild[this.structBuild.length - 1];
      if (top) top.fields.push({ name, desc });
      else this.types[name] = desc;
    }

    execData(t, readonly) {
      const w = t.words;
      // inline declaration: DATA(x) = expr  (an assignment: runs every time)
      if (w[1] === '(' && w[3] === ')' && w[4] === '=') {
        const value = this.evalExpr(w.slice(5));
        this.declareVar(w[2], this.inferDesc(value), this.clone(value));
        return;
      }
      if (this.once(t)) return;
      if (U(w[1]) === 'BEGIN' && U(w[2]) === 'OF') {
        this.structBuild.push({ kind: 'data', name: U(w[3]), fields: [], values: {}, readonly, occurs: w.some(x => U(x) === 'OCCURS') });
        return;
      }
      if (U(w[1]) === 'END' && U(w[2]) === 'OF') { this.closeStruct(); return; }
      if (!w[1]) return;

      const { name, desc, value, header } = this.parseDecl(w);
      const top = this.structBuild[this.structBuild.length - 1];
      if (top) {
        top.fields.push({ name, desc });
        if (value !== undefined) top.values[name] = value;
        return;
      }
      const rec = this.declareVar(name, desc, value, readonly);
      if (header && desc.kind === 'table') rec.header = this.initValue(desc.line);
    }

    // "KEYWORD name[(len)] TYPE ... [VALUE v]" -> { name, desc, value, header }
    parseDecl(w) {
      let name = U(w[1]).replace(/^@/, '');
      let len = null;
      const m = /^(.+)\((\d+)\)$/.exec(name);
      if (m) { name = m[1]; len = Number(m[2]); }
      const spec = w.slice(2);
      const up = spec.map(U);
      let desc = this.resolveTypeSpec(spec);
      if (len && desc.kind === 'elem') desc = Object.assign({}, desc, { len, generic: false });
      let value;
      const vi = up.indexOf('VALUE');
      if (vi !== -1 && up[vi + 1] !== 'IS') {
        this.coerceName = name;
        try {
          value = this.coerce(desc, this.evalExpr(spec.slice(vi + 1).filter(x => U(x) !== 'READ-ONLY')));
        } finally {
          this.coerceName = '';
        }
      }
      return { name, desc, value, header: up.includes('HEADER') };
    }

    closeStruct() {
      const b = this.structBuild.pop();
      if (!b) return;
      const desc = { kind: 'struct', fields: b.fields };
      const parent = this.structBuild[this.structBuild.length - 1];
      if (parent) {
        parent.fields.push({ name: b.name, desc });
        if (Object.keys(b.values).length) parent.values[b.name] = Object.assign(this.initValue(desc), b.values);
        return;
      }
      if (b.kind === 'types') { this.types[b.name] = desc; return; }
      if (b.occurs) {
        // DATA: BEGIN OF itab OCCURS 0 ... END OF itab.  ->  internal table with header line
        const rec = this.declareVar(b.name, { kind: 'table', line: desc, tkind: 'STANDARD', key: [], unique: false }, [], b.readonly);
        rec.header = this.initValue(desc);
        return;
      }
      this.declareVar(b.name, desc, Object.assign(this.initValue(desc), b.values), b.readonly);
    }

    // INCLUDE TYPE x / INCLUDE STRUCTURE x inside BEGIN OF ... END OF
    execInclude(t) {
      const top = this.structBuild[this.structBuild.length - 1];
      const kind = U(t.words[1]);
      if (!top || (kind !== 'TYPE' && kind !== 'STRUCTURE')) return;
      const d = kind === 'STRUCTURE' && this.variables[U(t.words[2])] ? this.descOfData(t.words[2]) : this.resolveNamed(t.words[2]);
      if (d && d.kind === 'struct') top.fields.push(...d.fields);
      else this.problem(t, `INCLUDE ${kind} ${U(t.words[2])}: struktur tidak dikenal`, 'warning');
    }

    // TABLES mara. -> work area with the name of the table
    execTables(t) {
      if (this.once(t)) return;
      const name = U(t.words[1]);
      const desc = name && this.dbStructDesc(name);
      if (desc) this.declareVar(name, desc);
    }

    execParameters(t) {
      if (this.once(t)) return;
      const w = t.words;
      if (!w[1]) return;
      const { name, desc } = this.parseDecl(w);
      const spec = w.slice(2);
      let value = this.initValue(desc);
      const di = spec.findIndex(x => U(x) === 'DEFAULT');
      if (di !== -1 && spec[di + 1] !== undefined) {
        const dv = spec[di + 1] === '-' ? spec.slice(di + 1, di + 3) : [spec[di + 1]];
        value = this.coerce(desc, this.evalExpr(dv));
      }
      const rec = this.declareVar(name, desc, value);
      rec.type = 'param'; rec.isParameter = true;
      rec.obligatory = spec.some(x => U(x) === 'OBLIGATORY') ? t : null;
    }

    // SELECT-OPTIONS s FOR f [DEFAULT a [TO b]]  /  RANGES r FOR f   (range table with header line)
    execSelectOptions(t) {
      if (this.once(t)) return;
      const w = t.words;
      if (!w[1]) return;
      const spec = w.slice(2);
      const desc = this.resolveTypeSpec(spec);
      const lowDesc = this.fieldDesc(desc.line, 'LOW');
      const value = [];
      const di = spec.findIndex(x => U(x) === 'DEFAULT');
      if (di !== -1 && spec[di + 1] !== undefined) {
        const row = this.rangeRow(lowDesc, this.evalExpr([spec[di + 1]]), U(spec[di + 2]) === 'TO' ? this.evalExpr([spec[di + 3]]) : '');
        if (row) value.push(row);
      }
      const rec = this.declareVar(w[1], desc, value);
      rec.header = value.length ? this.clone(value[0]) : this.initValue(desc.line);
      rec.isSelOpt = U(w[0]) === 'SELECT-OPTIONS';
      rec.obligatory = spec.some(x => U(x) === 'OBLIGATORY') ? t : null;
    }

    // PARAMETERS / SELECT-OPTIONS of a program (for the selection-screen dialog).
    // Start values come from DEFAULT and from the INITIALIZATION event.
    getSelectionParameters(code) {
      const list = [];
      const lit = tok => (tok === undefined ? '' : (/^['`]/.test(tok) ? tok.slice(1, -1).replace(/''/g, "'") : tok));
      for (const s of this.preprocess(code)) {
        const w = this.words(s.text);
        const kw = U(w[0]);
        if (!w[1]) continue;
        const up = w.map(U);
        const di = up.indexOf('DEFAULT');
        if (kw === 'SELECT-OPTIONS') {
          const fi = up.indexOf('FOR');
          list.push({
            name: up[1], range: true, type: fi !== -1 ? (w[fi + 1] || '') : '',
            low: di !== -1 ? String(lit(w[di + 1])) : '',
            high: di !== -1 && up[di + 2] === 'TO' ? String(lit(w[di + 3])) : ''
          });
          continue;
        }
        if (kw !== 'PARAMETERS' && kw !== 'PARAMETER') continue;
        let def = '';
        if (di !== -1 && w[di + 1] !== undefined) {
          def = lit(w[di + 1] === '-' ? '-' + (w[di + 2] || '') : w[di + 1]);
        }
        const ti = up.indexOf('TYPE') !== -1 ? up.indexOf('TYPE') : up.indexOf('LIKE');
        list.push({ name: up[1].replace(/\(\d+\)$/, ''), value: String(def), type: ti !== -1 ? (w[ti + 1] || '') : '', checkbox: up.includes('CHECKBOX') });
      }
      if (!list.length) return list;

      // run declarations + INITIALIZATION on a scratch interpreter to get the real start values
      try {
        const it = new ABAPInterpreter();
        it.run(code, { initOnly: true });
        for (const p of list) {
          const rec = it.variables[p.name];
          if (!rec) continue;
          if (p.range) {
            const row = Array.isArray(rec.value) && rec.value[0];
            p.low = row ? it.formatOut(row.LOW) : '';
            p.high = row && row.OPTION === 'BT' ? it.formatOut(row.HIGH) : '';
          } else {
            p.value = it.formatOut(rec.value);
          }
        }
      } catch (e) { /* keep the static defaults */ }
      return list;
    }

    formatOut(v) {
      if (v === null || v === undefined) return '';
      if (v instanceof AbapObject) return `→ ${v.cls}`;
      if (v instanceof DataRef) return '→ data';
      if (v instanceof SalvProxy) return v.toJSON();
      if (Array.isArray(v)) return `[table: ${v.length} baris]`;
      if (isObj(v)) return Object.values(v).map(x => this.formatOut(x)).join(' ');
      if (typeof v === 'boolean') return v ? 'X' : '';
      if (typeof v === 'number') return String(Number.isInteger(v) ? v : Number(v.toPrecision(12)));
      return String(v);
    }

    // WRITE [AT] [/][pos][(len)] dobj [options].   WRITE src TO dest.
    execWrite(t) {
      const w = t.words, up = w.map(U);
      const OPT1 = new Set(['INTENSIFIED', 'INVERSE', 'HOTSPOT', 'INPUT', 'RESET', 'ON', 'OFF', 'NO-SIGN', 'NO-GROUPING', 'FRAMES']);
      const OPT2 = new Set(['CURRENCY', 'UNIT', 'ROUND', 'EXPONENT', 'UNDER', 'QUICKINFO']);
      const MASK = ['DD', 'MM', 'YY', 'YYYY', 'DDMMYY', 'MMDDYY', 'YYMMDD'];
      const isOption = k => OPT1.has(up[k]) || OPT2.has(up[k]) || MASK.includes(up[k]) ||
        ['COLOR', 'USING', 'AS', 'NO-GAP', 'NO-ZERO', 'LEFT-JUSTIFIED', 'RIGHT-JUSTIFIED', 'CENTERED', 'DECIMALS', 'TO'].includes(up[k]);

      if (up[2] === 'TO' && w[3] !== undefined) {              // WRITE src TO dest: formatted assignment
        const r = this.ref(w[1]);
        this.assignTo(w[3], this.fmtWrite(this.evalExpr([w[1]]), r ? r.desc : null, {}), t);
        return;
      }

      let i = 1, newLine = false, pos = null, len = null;
      const explicitAt = up[i] === 'AT';
      if (explicitAt) i++;
      if (w[i] === '/') { newLine = true; i++; }
      // a number in front of the data object is the output position
      if (w[i] !== undefined && w[i] !== '(' && !/^['`|]/.test(w[i]) && (isNum(w[i]) || explicitAt) && w[i + 1] !== undefined && !isOption(i + 1)) {
        pos = Number(this.evalExpr([w[i]])) || null;
        i++;
      }
      if (w[i] === '(' && w[i + 2] === ')' && w[i + 3] !== undefined) {     // (len)
        if (w[i + 1] !== '*') len = Number(this.evalExpr([w[i + 1]])) || null;
        i += 3;
      }

      const opts = {}, parts = [];
      let noGap = false;
      for (; i < w.length; i++) {
        const x = w[i], X = up[i];
        if (x === ',' || x === '/') continue;
        if (X === 'NO-GAP') { noGap = true; continue; }
        if (X === 'NO-ZERO') { opts.noZero = true; continue; }
        if (X === 'LEFT-JUSTIFIED') { opts.just = 'L'; continue; }
        if (X === 'RIGHT-JUSTIFIED') { opts.just = 'R'; continue; }
        if (X === 'CENTERED') { opts.just = 'C'; continue; }
        if (X === 'DECIMALS') { opts.decimals = Number(this.evalExpr([w[++i]])); continue; }
        if (X === 'COLOR') { i++; if (w[i] === '=') i++; continue; }
        if (X === 'USING') { i += 3; continue; }                 // USING EDIT MASK m
        if (X === 'AS') { i++; continue; }                       // AS CHECKBOX / ICON / SYMBOL / LINE
        if (OPT2.has(X)) { i++; continue; }
        if (OPT1.has(X)) continue;
        if (MASK.includes(X) && parts.length) {                  // date mask DD/MM/YYYY
          let mask = X;
          while (w[i + 1] === '/' && MASK.includes(up[i + 2])) { mask += '/' + up[i + 2]; i += 2; }
          opts.dateMask = mask;
          continue;
        }
        if (x === '(') { const c = this.matchParen(w, i); if (c !== -1) i = c; continue; }
        if (x === '-' && isNum(w[i + 1])) { parts.push({ value: -Number(w[++i]) }); continue; }

        // operand = name [ ->name | =>name | ->* ]* [ ( args ) ]   or   itab[ ... ]-comp
        let j = i;
        if (/\[$/.test(x) && !/^['`|]/.test(x)) {
          const lv = this.levels(w);
          let c = i + 1;
          while (c < w.length - 1 && !(lv[c] === lv[i] && w[c][0] === ']')) c++;
          j = c;
        } else {
          while (w[j + 1] === '->' || w[j + 1] === '=>' || w[j + 1] === '->*') j += w[j + 1] === '->*' ? 1 : 2;
          if (w[j + 1] === '(' && /^[A-Za-z_<]/.test(w[j])) { const c = this.matchParen(w, j + 1); if (c !== -1) j = c; }
        }
        const toks = w.slice(i, j + 1);
        const r = toks.length === 1 ? this.ref(toks[0]) : null;
        const isHeader = r && !r.isField && r.rec && r.rec.header !== undefined;
        parts.push({ value: this.evalExpr(toks), desc: r && !isHeader ? r.desc : (toks.length === 1 && /^sy(st)?-/i.test(toks[0]) ? this.resolveNamed(toks[0]) : null) });
        i = j;
      }

      let text = parts.map(p => this.fmtWrite(p.value, p.desc, opts)).join(' ');
      if (len !== null) {
        const just = opts.just || (parts.length === 1 && typeof parts[0].value === 'number' ? 'R' : 'L');
        if (just === 'R') text = text.padStart(len).slice(-len);
        else if (just === 'C') text = text.padStart(Math.floor((len + text.length) / 2)).padEnd(len).slice(0, len);
        else text = text.padEnd(len).slice(0, len);
      } else if (opts.just === 'L') {
        text = text.trimStart();
      }

      this.topOfPage();
      const last = this.output[this.output.length - 1];
      let line = !newLine && last && last === this.lastWrite ? last : null;
      if (!line) {
        line = this.lastWrite = { text: '', cls: 'info' };
        this.output.push(line);
      }
      if (pos !== null && pos > 0) line.text = line.text.padEnd(pos - 1).slice(0, pos - 1) + text;
      else if (parts.length || len !== null) line.text += (line.text !== '' && !line.noGap ? ' ' : '') + text;
      line.noGap = noGap;
    }

    // ── CLEAR / REFRESH ────────────────────────────────────
    initialOf(v) {
      if (Array.isArray(v)) return [];
      if (isObj(v)) { const o = {}; for (const k of Object.keys(v)) o[k] = this.initialOf(v[k]); return o; }
      if (typeof v === 'number') return 0;
      return v === null ? null : '';
    }

    execClear(t) {
      const tok = t.words[1];
      const r = tok ? this.ref(tok) : null;
      if (!r || (r.rec && r.rec.readonly)) return;
      // table with header line: CLEAR itab clears the header line, CLEAR itab[] the table body
      if (!r.isField && r.rec.header !== undefined && !/\[\]$/.test(tok)) {
        r.rec.header = r.desc && r.desc.kind === 'table' ? this.initValue(r.desc.line) : this.initialOf(r.rec.header);
        return;
      }
      r.set(r.desc ? this.initValue(r.desc) : this.initialOf(r.get()));
    }

    execRefresh(t) {
      // REFRESH itab: delete all rows.  FREE x: release the memory (rows and header line)
      const r = t.words[1] ? this.ref(t.words[1]) : null;
      if (!r) return;
      const isTab = Array.isArray(r.get()) || (r.desc && r.desc.kind === 'table');
      r.set(isTab ? [] : (r.desc ? this.initValue(r.desc) : this.initialOf(r.get())));
      if (U(t.words[0]) === 'FREE' && r.rec.header !== undefined && !r.isField) r.rec.header = this.initialOf(r.rec.header);
    }

    // ── MOVE / assignments ─────────────────────────────────
    execMove(t) {
      // MOVE src TO dest
      const w = t.words;
      const toIdx = w.map(U).lastIndexOf('TO');
      if (toIdx < 2 || !w[toIdx + 1]) return;
      this.assignTo(w[toIdx + 1], this.evalExpr(w.slice(1, toIdx)), t);
    }

    // MOVE-CORRESPONDING src TO dest: copy the components that have the same name
    execMoveCorresponding(t) {
      const w = t.words;
      const toIdx = w.map(U).lastIndexOf('TO');
      if (toIdx < 2 || !w[toIdx + 1]) return;
      // a table with header line stands for its header line here
      const structOf = (tok, create) => {
        const r = this.ref(tok, create, t);
        if (!r) return null;
        if (!r.isField && isObj(r.rec.header)) return { obj: r.rec.header, desc: r.desc && r.desc.kind === 'table' ? r.desc.line : null };
        let v = r.get();
        if (!isObj(v) && create && !Array.isArray(v) && (!r.desc || r.desc.base === 'any')) { v = {}; r.set(v); }
        return isObj(v) ? { obj: v, desc: r.desc } : null;
      };
      const src = structOf(w[1], false), dst = structOf(w[toIdx + 1], true);
      if (!src || !dst) {
        this.problem(t, `MOVE-CORRESPONDING: ${!src ? U(w[1]) : U(w[toIdx + 1])} bukan struktur`, 'error');
        return;
      }
      for (const k of Object.keys(dst.obj)) {
        const sk = this.ciKey(src.obj, k);
        if (sk in src.obj) dst.obj[k] = this.shape(this.fieldDesc(dst.desc, k), this.clone(src.obj[sk]));
      }
    }

    execCompute(t) {
      // COMPUTE var = expr
      const eqIdx = t.words.indexOf('=');
      if (eqIdx < 2) return;
      this.assignTo(t.words[eqIdx - 1], this.evalExpr(t.words.slice(eqIdx + 1)), t);
    }

    // ADD x TO y / SUBTRACT x FROM y / MULTIPLY y BY x / DIVIDE y BY x
    execArith(t, kw) {
      const w = t.words, up = w.map(U);
      const sep = kw === 'ADD' ? 'TO' : kw === 'SUBTRACT' ? 'FROM' : 'BY';
      const si = up.lastIndexOf(sep);
      if (si < 2 || !w[si + 1]) return;
      const first = w.slice(1, si), second = w.slice(si + 1);
      const destName = (kw === 'ADD' || kw === 'SUBTRACT') ? second[0] : first[0];
      const operand  = Number(this.evalExpr((kw === 'ADD' || kw === 'SUBTRACT') ? first : second));
      const r = this.ref(destName, true, t);
      if (!r) return;
      const cur = Number(r.get() || 0);
      let res;
      if (kw === 'ADD') res = cur + operand;
      else if (kw === 'SUBTRACT') res = cur - operand;
      else if (kw === 'MULTIPLY') res = cur * operand;
      else {
        if (operand === 0) { this.output.push({ text: '⚠ Division by zero!', cls: 'warning' }); return; }
        res = cur / operand;
      }
      r.set(this.coerce(r.desc, res));
    }

    // ── String operations ──────────────────────────────────
    execConcatenate(t) {
      // CONCATENATE a b c INTO dest [SEPARATED BY sep]
      const w = t.words, up = w.map(U);
      const intoIdx = up.indexOf('INTO');
      if (intoIdx === -1) return;
      const sepIdx = up.indexOf('SEPARATED');
      const sep = sepIdx !== -1 && up[sepIdx + 1] === 'BY' ? String(this.evalExpr([w[sepIdx + 2]])) : '';
      const sources = w.slice(1, intoIdx).map(x => this.formatOut(this.evalExpr([x])));
      this.assignTo(w[intoIdx + 1], sources.join(sepIdx !== -1 && sep === '' ? ' ' : sep), t);
    }

    execSplit(t) {
      // SPLIT src AT delim INTO t1 t2 ... | INTO TABLE itab
      const w = t.words, up = w.map(U);
      const atIdx = up.indexOf('AT'), intoIdx = up.indexOf('INTO');
      if (atIdx === -1 || intoIdx === -1) return;
      const src = String(this.evalExpr(w.slice(1, atIdx)));
      const delim = String(this.evalExpr([w[atIdx + 1]]));
      const parts = src.split(delim);
      if (up[intoIdx + 1] === 'TABLE') { this.assignTo(this.targetName(w, intoIdx + 2), parts, t); return; }
      const targets = w.slice(intoIdx + 1);
      targets.forEach((name, i) => {
        // the last target receives the rest of the string
        const val = i === targets.length - 1 ? parts.slice(i).join(delim) : parts[i];
        this.assignTo(name, val !== undefined ? val : '', t);
      });
    }

    execTranslate(t) {
      // TRANSLATE var TO UPPER/LOWER CASE
      const r = this.ref(t.words[1]);
      if (!r) return;
      const mode = t.words.map(U);
      if (mode.includes('UPPER')) r.set(String(r.get()).toUpperCase());
      else if (mode.includes('LOWER')) r.set(String(r.get()).toLowerCase());
    }

    execCondense(t) {
      // CONDENSE var [NO-GAPS]
      const r = this.ref(t.words[1]);
      if (!r) return;
      let val = String(r.get()).trim();
      val = t.words.map(U).includes('NO-GAPS') ? val.replace(/\s+/g, '') : val.replace(/\s+/g, ' ');
      r.set(val);
    }

    // Returns the array behind an internal-table name, or null (problem reported)
    tableRef(name, t, stmt, srcTok) {
      let r = this.ref(name);
      const hint = () => {
        const s = this.suggestTable(srcTok);
        return s ? ` Mungkin maksud Anda: ${stmt} ${String(srcTok).toLowerCase()} ${stmt === 'INSERT' ? 'INTO TABLE' : 'TO'} ${s.toLowerCase()}. — kalau baris itu sudah ada, hapus saja baris ini.` : '';
      };
      if (!r) {
        if (U(name).includes('-') && this.variables[U(name).split('-')[0]]) {
          this.problem(t, `${stmt}: "${U(name)}" bukan internal table.${hint()}`, 'error');
          return null;
        }
        if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) this.undeclared(U(name), t);
        this.declareVar(name, { kind: 'table', line: { kind: 'elem', base: 'any' }, tkind: 'STANDARD', key: [], unique: false });   // create leniently
        r = this.ref(name);
      }
      const v = r.get();
      if (Array.isArray(v)) return { arr: v, desc: r.desc, rec: r.rec };
      const typedScalar = r.desc && (r.desc.kind === 'struct' || r.desc.kind === 'ref' || (r.desc.kind === 'elem' && r.desc.base !== 'any'));
      if (r.isField || typedScalar || isObj(v)) {
        const what = r.isField ? `komponen struktur bertipe ${this.typeLabel(r.desc) === 'any' ? 'elementer' : this.typeLabel(r.desc)}`
          : (isObj(v) ? 'struktur / work area' : `variabel bertipe ${this.typeLabel(r.desc)}`);
        this.problem(t, `${stmt}: target "${r.name}" bukan internal table, melainkan ${what}.${hint()} (Di SAP ini syntax error; simulator melewati baris ini.)`, 'error');
        return null;
      }
      const arr = [];
      r.set(arr);
      if (r.rec) r.rec.type = 'table';
      return { arr, desc: r.desc, rec: r.rec };
    }

    execAppend(t) {
      // APPEND wa TO itab | APPEND itab. | APPEND INITIAL LINE TO itab | APPEND LINES OF it1 TO it2 | APPEND VALUE #( ... ) TO itab
      const w = t.words, up = w.map(U);
      const toIdx = up.lastIndexOf('TO');
      if (toIdx === -1 || !w[toIdx + 1]) {
        const r = w[1] ? this.ref(w[1]) : null;
        if (!r || r.isField || r.rec.header === undefined || !Array.isArray(r.get())) {
          this.problem(t, 'APPEND tanpa "TO itab" hanya berlaku untuk internal table yang punya header line (OCCURS / WITH HEADER LINE)', 'error');
          return;
        }
        r.get().push(this.clone(r.rec.header));        // APPEND itab.  = append the header line
        this.setSy('TABIX', r.get().length);
        return;
      }
      const tab = this.tableRef(w[toIdx + 1], t, 'APPEND', w[1]);
      if (!tab) return;
      const d = tab.desc && tab.desc.kind === 'table' ? tab.desc : null;
      const lineDesc = d ? d.line : null;
      if (d && d.tkind === 'HASHED') {
        this.problem(t, `APPEND tidak boleh dipakai untuk HASHED TABLE "${U(w[toIdx + 1])}" — gunakan INSERT ... INTO TABLE`, 'error');
        return;
      }
      const src = w.slice(1, toIdx);

      if (U(src[0]) === 'LINES' && U(src[1]) === 'OF') {
        const or = this.ref(src[2]);
        const other = or ? or.get() : this.evalExpr([src[2]]);
        if (Array.isArray(other)) for (const row of other) tab.arr.push(this.shape(lineDesc, this.clone(row)));
      } else if (U(src[0]) === 'INITIAL' && U(src[1]) === 'LINE') {
        tab.arr.push(this.initValue(lineDesc));
      } else {
        tab.arr.push(this.shape(lineDesc, this.clone(this.evalExpr(src))));
      }
      // a sorted table must stay sorted
      if (d && d.tkind === 'SORTED' && d.key.length && tab.arr.length > 1) {
        const a = tab.arr[tab.arr.length - 2], b = tab.arr[tab.arr.length - 1];
        const wrong = isObj(a) && isObj(b) && d.key.map(f => this.cmpValues(a[this.ciKey(a, f)], b[this.ciKey(b, f)])).find(c => c !== 0) > 0;
        if (wrong) {
          tab.arr.pop();
          throw { message: `APPEND merusak urutan SORTED TABLE "${U(w[toIdx + 1])}" (di SAP: short dump ITAB_ILLEGAL_SORT_ORDER). Gunakan INSERT ... INTO TABLE.`, line: t.lineNo };
        }
      }
      this.setSy('TABIX', tab.arr.length);

      const ai = up.indexOf('ASSIGNING', toIdx);
      if (ai !== -1) this.bindFieldSymbol(this.targetName(w, ai + 1), tab.arr, tab.arr.length - 1, lineDesc);
    }

    execInsert(t) {
      // INSERT line INTO TABLE itab | INSERT line INTO itab INDEX n | INSERT itab INDEX n (header line) | INSERT dbtab ...
      const w = t.words, up = w.map(U);
      if (this.isDbStatement(w, 'INSERT')) { this.execDbWrite(t, 'INSERT'); return; }
      const intoIdx = up.indexOf('INTO'), ii = up.indexOf('INDEX');
      let tab, row;
      if (intoIdx === -1) {
        const k = up[1] === 'TABLE' ? 2 : 1;
        const r = w[k] ? this.ref(w[k]) : null;
        if (!r || r.rec.header === undefined || !Array.isArray(r.get())) return;
        tab = { arr: r.get(), desc: r.desc };
        row = this.clone(r.rec.header);
      } else {
        const isTable = up[intoIdx + 1] === 'TABLE';
        tab = this.tableRef(w[intoIdx + (isTable ? 2 : 1)], t, 'INSERT', w[1]);
        if (!tab) return;
        const lineDesc = tab.desc && tab.desc.kind === 'table' ? tab.desc.line : null;
        if (U(w[1]) === 'LINES' && U(w[2]) === 'OF') {
          const or = this.ref(w[3]);
          let ok = true;
          for (const r0 of (or && Array.isArray(or.get()) ? or.get() : [])) ok = this.insertRow(tab, this.shape(lineDesc, this.clone(r0))) && ok;
          this.setSy('SUBRC', ok ? 0 : 4);
          return;
        }
        row = this.shape(lineDesc, this.clone(this.evalExpr(w.slice(1, intoIdx))));
      }
      if (ii !== -1) {
        const idx = Math.max(0, Math.min(tab.arr.length, Number(this.evalExpr([w[ii + 1]])) - 1));
        tab.arr.splice(idx, 0, row);
        this.shiftLoops(tab.arr, idx, 1);
        this.setSy('SUBRC', 0);
        return;
      }
      this.setSy('SUBRC', this.insertRow(tab, row) ? 0 : 4);
    }

    execModify(t) {
      // MODIFY itab [FROM wa] [INDEX n] [TRANSPORTING f1 f2] [WHERE cond] | MODIFY dbtab FROM wa
      const w = t.words, up = w.map(U);
      const k = up[1] === 'TABLE' ? 2 : 1;
      const r = w[k] ? this.ref(w[k]) : null;
      const itab = r && r.get();
      if (!Array.isArray(itab)) {
        if (this.isDbStatement(w, 'MODIFY')) this.execDbWrite(t, 'MODIFY');
        return;
      }
      const fi = up.indexOf('FROM');
      let src;
      if (fi !== -1) src = this.evalExpr([w[fi + 1]]);
      else if (r.rec.header !== undefined) src = r.rec.header;     // MODIFY itab.  (header line)
      else return;
      const wi = up.indexOf('WHERE'), ii = up.indexOf('INDEX'), ti = up.indexOf('TRANSPORTING');
      let fields = null;
      if (ti !== -1) {
        fields = [];
        for (let j = ti + 1; j < w.length && up[j] !== 'WHERE' && up[j] !== 'INDEX'; j++) fields.push(up[j]);
      }
      const apply = idx => {
        if (!(idx >= 0 && idx < itab.length)) return false;
        if (fields && isObj(itab[idx]) && isObj(src)) for (const f of fields) itab[idx][this.ciKey(itab[idx], f)] = this.clone(src[this.ciKey(src, f)]);
        else itab[idx] = this.clone(src);
        return true;
      };
      let ok = false;
      if (wi !== -1) {
        const where = w.slice(wi + 1);
        itab.forEach((row, idx) => { if (this.evalRowWhere(row, where)) ok = apply(idx) || ok; });
      } else if (ii !== -1) {
        ok = apply(Number(this.evalExpr([w[ii + 1]])) - 1);
      } else if (up[1] === 'TABLE' && r.desc && r.desc.key && r.desc.key.length && isObj(src)) {
        // MODIFY TABLE itab FROM wa: the row with the same table key
        ok = apply(itab.findIndex(row => r.desc.key.every(f => this.compare(row[this.ciKey(row, f)], '=', src[this.ciKey(src, f)]))));
      } else {
        const lp = [...this.loopStack].reverse().find(l => l.table === itab);
        if (lp) ok = apply(lp.index);
        else this.problem(t, 'MODIFY tanpa INDEX / WHERE hanya bisa dipakai di dalam LOOP AT tabel yang sama', 'warning');
      }
      this.setSy('SUBRC', ok ? 0 : 4);
    }

    execDeleteTable(t) {
      // DELETE itab INDEX n | WHERE cond | (current loop row) ; DELETE TABLE itab FROM wa | WITH TABLE KEY f = v ;
      // DELETE ADJACENT DUPLICATES FROM itab [COMPARING f1 f2] ; DELETE FROM dbtab WHERE ...
      const w = t.words, up = w.map(U);
      if (up[1] === 'ADJACENT') {
        const fi = up.indexOf('FROM');
        const r = this.ref(w[fi + 1]);
        const itab = r && r.get();
        if (!Array.isArray(itab)) return;
        const ci = up.indexOf('COMPARING');
        const fields = ci !== -1 && up[ci + 1] !== 'ALL' ? up.slice(ci + 1) : null;
        const keyOf = row => JSON.stringify(fields && isObj(row) ? fields.map(f => row[this.ciKey(row, f)]) : row);
        let deleted = 0;
        for (let n = itab.length - 1; n > 0; n--) if (keyOf(itab[n]) === keyOf(itab[n - 1])) { itab.splice(n, 1); this.shiftLoops(itab, n, -1); deleted++; }
        this.setSy('SUBRC', deleted ? 0 : 4);
        return;
      }
      if (this.isDbStatement(w, 'DELETE')) { this.execDbWrite(t, 'DELETE'); return; }

      const k = up[1] === 'TABLE' ? 2 : 1;
      const r = w[k] ? this.ref(w[k]) : null;
      const itab = r && r.get();
      if (!Array.isArray(itab)) return;
      const remove = idx => { itab.splice(idx, 1); this.shiftLoops(itab, idx, -1); };
      const ii = up.indexOf('INDEX'), wi = up.indexOf('WHERE');
      let deleted = 0;
      if (up[1] === 'TABLE') {
        // key from WITH TABLE KEY f = v ... or from a work area
        const ki = up.indexOf('KEY'), fi = up.indexOf('FROM');
        let test = null;
        if (ki !== -1) {
          const pairs = this.parsePairs(w.slice(ki + 1)).map(([f, toks]) => [f, this.evalExpr(toks)]);
          test = row => pairs.every(([f, v]) => this.compare(isObj(row) ? row[this.ciKey(row, f)] : row, '=', v));
        } else if (fi !== -1) {
          const wa = this.evalExpr([w[fi + 1]]);
          const key = r.desc && r.desc.key && r.desc.key.length ? r.desc.key : null;
          test = row => (key && isObj(row) && isObj(wa) ? key.every(f => this.compare(row[this.ciKey(row, f)], '=', wa[this.ciKey(wa, f)])) : this.compare(row, '=', wa));
        }
        const idx = test ? itab.findIndex(test) : -1;
        if (idx !== -1) { remove(idx); deleted = 1; }
      } else if (ii !== -1) {
        const idx = Number(this.evalExpr([w[ii + 1]])) - 1;
        if (idx >= 0 && idx < itab.length) { remove(idx); deleted = 1; }
      } else if (wi !== -1) {
        const where = w.slice(wi + 1);
        for (let n = itab.length - 1; n >= 0; n--) if (this.evalRowWhere(itab[n], where)) { remove(n); deleted++; }
      } else {
        const lp = [...this.loopStack].reverse().find(l => l.table === itab);     // DELETE itab.  = current loop row
        if (lp && lp.index >= 0 && lp.index < itab.length) { remove(lp.index); deleted = 1; }
      }
      this.setSy('SUBRC', deleted ? 0 : 4);
    }

    cmpValues(a, b) {
      if (typeof a === 'number' && typeof b === 'number') return a - b;
      if (isNum(a) && isNum(b) && typeof a !== typeof b) return Number(a) - Number(b);
      const x = this.formatOut(a), y = this.formatOut(b);
      return x < y ? -1 : x > y ? 1 : 0;
    }

    execSort(t) {
      // SORT itab [ASCENDING|DESCENDING] [BY f1 [ASCENDING|DESCENDING] f2 ...]
      const w = t.words, up = w.map(U);
      const r = this.ref(w[1]);
      const itab = r && r.get();
      if (!Array.isArray(itab)) return;
      const bi = up.indexOf('BY');
      const di = up.indexOf('DESCENDING');
      const defDesc = di !== -1 && (bi === -1 || di < bi);
      const keys = [];
      if (bi !== -1) {
        for (let j = bi + 1; j < w.length; j++) {
          if (up[j] === 'DESCENDING' || up[j] === 'ASCENDING') { if (keys.length) keys[keys.length - 1].desc = up[j] === 'DESCENDING'; continue; }
          if (['AS', 'TEXT', 'STABLE'].includes(up[j])) continue;
          keys.push({ f: up[j], desc: defDesc });
        }
      }
      const val = (row, f) => (isObj(row) ? row[this.ciKey(row, f)] : row);
      itab.sort((a, b) => {
        const ks = keys.length ? keys : (isObj(a) ? Object.keys(a).map(f => ({ f, desc: defDesc })) : null);
        if (!ks) return this.cmpValues(a, b) * (defDesc ? -1 : 1);
        for (const k of ks) {
          const c = this.cmpValues(val(a, k.f), val(b, k.f));
          if (c) return k.desc ? -c : c;
        }
        return 0;
      });
    }

    // A record whose value lives somewhere else (table row, struct component)
    aliasRec(get, set, desc) {
      const rec = { type: 'field-symbol', desc: desc || undefined };
      Object.defineProperty(rec, 'value', { get, set, enumerable: true });
      return rec;
    }

    setFieldSymbol(name, rec) {
      const N = U(name);
      if (this.frames.length) {
        const fr = this.frames[this.frames.length - 1];
        if (!(N in fr.saved)) fr.saved[N] = this.variables[N];
      }
      this.variables[N] = rec;
    }

    bindFieldSymbol(name, table, index, lineDesc) {
      this.setFieldSymbol(name, this.rowRec(table, index, lineDesc));
    }

    // ASSIGN var TO <fs> | ASSIGN COMPONENT n OF STRUCTURE s TO <fs> | ASSIGN dref->* TO <fs> | ASSIGN itab[ ... ] TO <fs> | ASSIGN (name) TO <fs>
    execAssign(t) {
      const w = t.words, up = w.map(U);
      const toIdx = up.lastIndexOf('TO');
      if (toIdx === -1 || !w[toIdx + 1]) return;
      const fsName = this.targetName(w, toIdx + 1);
      const fail = () => { this.setSy('SUBRC', 4); delete this.variables[U(fsName)]; };

      if (up[1] === 'COMPONENT') {
        const comp = this.evalExpr([w[2]]);
        const si = up.indexOf('STRUCTURE');
        const sr = si !== -1 ? this.ref(w[si + 1]) : null;
        const obj = sr ? (!sr.isField && isObj(sr.rec.header) ? sr.rec.header : sr.get()) : null;
        if (!isObj(obj)) { fail(); return; }
        const keys = Object.keys(obj);
        const key = typeof comp === 'number' ? keys[comp - 1] : keys.find(x => x.toUpperCase() === U(comp));
        if (key === undefined) { fail(); return; }
        this.setFieldSymbol(fsName, this.aliasRec(() => obj[key], v => { obj[key] = v; }, this.fieldDesc(sr.desc, key)));
        this.setSy('SUBRC', 0);
        return;
      }
      const src = w.slice(1, toIdx);
      if (src[1] === '->*') {                                    // ASSIGN dref->* TO <fs>
        const v = this.evalAtom(src[0]);
        if (!(v instanceof DataRef)) { fail(); return; }
        this.setFieldSymbol(fsName, v.rec);
        this.setSy('SUBRC', 0);
        return;
      }
      const cb = this.closeBracket(src, 0);
      if (cb !== -1) {                                           // ASSIGN itab[ ... ] TO <fs>
        const te = this.tableExpr(src, cb);
        if (!te.found) { fail(); return; }
        this.setFieldSymbol(fsName, this.aliasRec(te.get, te.set, undefined));
        this.setSy('SUBRC', 0);
        return;
      }
      const name = src[0] === '(' ? this.formatOut(this.evalExpr(src)) : src[0];    // ASSIGN (name) TO <fs>: dynamic
      const r = name ? this.ref(name) : null;
      if (!r) { fail(); return; }
      this.setFieldSymbol(fsName, r.isField ? this.aliasRec(r.get, r.set, r.desc) : r.rec);
      this.setSy('SUBRC', 0);
    }

    // REPLACE [ALL OCCURRENCES OF] pattern IN dobj WITH new [IGNORING CASE]
    execReplace(t) {
      const w = t.words, up = w.map(U);
      const inIdx = up.indexOf('IN'), withIdx = up.indexOf('WITH'), intoIdx = up.indexOf('INTO');
      const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const flags = (up.includes('ALL') ? 'g' : '') + (up.includes('IGNORING') ? 'i' : '');
      let pat, target, repl;
      if (inIdx !== -1 && withIdx !== -1) {
        pat = this.formatOut(this.evalExpr([w[inIdx - 1]]));
        target = w[inIdx + 1] && U(w[inIdx + 1]) === 'TABLE' ? null : w[inIdx + 1];
        repl = this.formatOut(this.evalExpr([w[withIdx + 1]]));
      } else if (withIdx !== -1 && intoIdx !== -1) {     // REPLACE a WITH b INTO c
        pat = this.formatOut(this.evalExpr([w[1]]));
        repl = this.formatOut(this.evalExpr([w[withIdx + 1]]));
        target = w[intoIdx + 1];
      }
      const r = target && this.ref(target);
      if (!r || !pat) { this.setSy('SUBRC', 4); return; }
      const src = this.formatOut(r.get());
      // REPLACE ... REGEX | PCRE pattern: the replacement may use $1, $2 ... and $0 (whole match)
      const isRegex = inIdx > 1 && ['REGEX', 'PCRE'].includes(up[inIdx - 2]);
      const re = isRegex ? this.abapRegex(pat, flags) : new RegExp(esc(pat), flags);
      const hits = (src.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) || []).length;
      const res = isRegex ? src.replace(re, repl.replace(/\$0/g, '$$&')) : src.replace(re, () => repl);
      r.set(res);
      const cntIdx = up.indexOf('COUNT');
      if (cntIdx !== -1 && up[cntIdx - 1] === 'REPLACEMENT' && w[cntIdx + 1]) this.assignTo(this.targetName(w, cntIdx + 1), hits ? (flags.includes('g') ? hits : 1) : 0, t);
      this.setSy('SUBRC', hits ? 0 : 4);
    }

    // ABAP regular expression (POSIX / PCRE subset) -> JavaScript RegExp
    abapRegex(pattern, flags) {
      const POSIX = { digit: '\\d', alpha: 'A-Za-z', alnum: 'A-Za-z0-9', space: '\\s', upper: 'A-Z', lower: 'a-z', punct: '!-\\/:-@\\[-`{-~', word: '\\w', xdigit: '0-9A-Fa-f' };
      const src = String(pattern).replace(/\[:(\w+):\]/g, (m, n) => (POSIX[n] !== undefined ? POSIX[n] : m));
      try {
        return new RegExp(src, flags || '');
      } catch (e) {
        this.raiseSys('CX_SY_REGEX', `Regular expression "${String(pattern).slice(0, 40)}" tidak valid`);
        return /$^/;
      }
    }

    // FIND [FIRST OCCURRENCE OF] sub IN dobj [IGNORING CASE] [MATCH OFFSET off] [MATCH COUNT cnt]
    execFind(t) {
      const w = t.words, up = w.map(U);
      const inIdx = up.indexOf('IN');
      if (inIdx < 2) return;
      const sub = this.formatOut(this.evalExpr([w[inIdx - 1]]));
      const src = this.formatOut(this.evalExpr([w[inIdx + 1]]));
      // FIND [ALL OCCURRENCES OF] [REGEX | PCRE] pattern IN dobj
      //   [MATCH COUNT c] [MATCH OFFSET o] [MATCH LENGTH l] [SUBMATCHES s1 s2 ...]
      const isRegex = ['REGEX', 'PCRE'].includes(up[inIdx - 2]);
      const all = up[1] === 'ALL';
      const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = sub ? (isRegex ? this.abapRegex(sub, 'g' + (up.includes('IGNORING') ? 'i' : '')) : new RegExp(esc(sub), 'g' + (up.includes('IGNORING') ? 'i' : ''))) : null;
      const found = [];
      if (re) {
        let m;
        while ((m = re.exec(src)) !== null) {
          found.push(m);
          if (m[0] === '') re.lastIndex++;
          if (!all) break;
        }
      }
      const hit = found.length ? found[all ? found.length - 1 : 0] : null;      // ALL OCCURRENCES: the last one
      const target = kw => { const k = up.indexOf(kw); return k !== -1 && up[k - 1] === 'MATCH' && w[k + 1] ? this.targetName(w, k + 1) : null; };
      const to = (name, v) => { if (name) this.assignTo(name, v, t); };
      to(target('COUNT'), found.length);
      if (hit) {
        to(target('OFFSET'), hit.index);
        to(target('LENGTH'), hit[0].length);
        const si = up.indexOf('SUBMATCHES');
        if (si !== -1) {
          let g = 1;
          for (let k = si + 1; k < w.length && !['MATCH', 'IGNORING', 'RESPECTING'].includes(up[k]); k++) {
            const inline = (up[k] === 'DATA' || up[k] === 'FINAL') && w[k + 1] === '(';
            this.assignTo(this.targetName(w, k), hit[g] === undefined ? '' : hit[g], t);
            g++;
            if (inline) k += 3;
          }
        }
      }
      this.setSy('SUBRC', hit ? 0 : 4);
    }

    // SHIFT dobj [LEFT|RIGHT] [BY n PLACES] [DELETING LEADING|TRAILING c]
    execShift(t) {
      const w = t.words, up = w.map(U);
      const r = this.ref(w[1]);
      if (!r) return;
      let s = this.formatOut(r.get());
      const di = up.indexOf('DELETING'), bi = up.indexOf('BY');
      if (di !== -1) {
        const chars = this.formatOut(this.evalExpr([w[di + 2]]));
        if (up[di + 1] === 'LEADING') { while (s.length && chars.includes(s[0])) s = s.slice(1); }
        else { while (s.length && chars.includes(s[s.length - 1])) s = s.slice(0, -1); }
      } else {
        const n = bi !== -1 ? Number(this.evalExpr([w[bi + 1]])) : 1;
        s = up.includes('RIGHT') ? ' '.repeat(n) + s : s.slice(n);
      }
      r.set(s);
    }

    execRead(t) {
      // READ TABLE itab [INTO wa | ASSIGNING <fs> | REFERENCE INTO dref | TRANSPORTING NO FIELDS] [INDEX n | WITH KEY f1 = v1 f2 = v2]
      const w = t.words, up = w.map(U);
      if (up[1] !== 'TABLE') return;
      const r = this.ref(w[2]);
      const itab = r && r.get();
      if (!Array.isArray(itab)) {
        this.problem(t, `READ TABLE: "${U(w[2])}" bukan internal table`, 'error');
        this.setSy('SUBRC', 4);
        return;
      }
      let idx = -1;
      const ii = up.indexOf('INDEX'), ki = up.indexOf('KEY');
      if (ii !== -1) {
        idx = Number(this.evalExpr([w[ii + 1]])) - 1;
      } else if (ki !== -1) {
        const pairs = [];
        let j = ki + 1;
        while (w[j + 1] === '=' && w[j + 2] !== undefined) {
          const neg = w[j + 2] === '-' && isNum(w[j + 3]);
          pairs.push([up[j], this.evalExpr(neg ? [w[j + 2], w[j + 3]] : [w[j + 2]])]);
          j += neg ? 4 : 3;
        }
        idx = itab.findIndex(row => pairs.every(([f, v]) => {
          const cell = f === 'TABLE_LINE' ? row : (isObj(row) ? row[this.ciKey(row, f)] : undefined);
          return this.compare(cell === undefined ? '' : cell, '=', v);
        }));
      }
      if (!(idx >= 0 && idx < itab.length)) {
        this.setSy('SUBRC', 4); this.setSy('TABIX', 0);
        return;
      }
      const lineDesc = r.desc && r.desc.kind === 'table' ? r.desc.line : null;
      const intoIdx = up.indexOf('INTO'), ai = up.indexOf('ASSIGNING');
      if (intoIdx !== -1 && up[intoIdx - 1] === 'REFERENCE') this.assignTo(this.targetName(w, intoIdx + 1), new DataRef(this.rowRec(itab, idx, lineDesc)), t);
      else if (intoIdx !== -1) this.assignTo(this.targetName(w, intoIdx + 1), itab[idx], t);
      else if (ai !== -1) this.bindFieldSymbol(this.targetName(w, ai + 1), itab, idx, lineDesc);
      else if (r.rec.header !== undefined && !up.includes('TRANSPORTING')) r.rec.header = this.clone(itab[idx]);    // header line
      this.setSy('SUBRC', 0); this.setSy('TABIX', idx + 1);
    }

    execDescribe(t) {
      // DESCRIBE TABLE itab LINES n.   DESCRIBE FIELD f TYPE t [LENGTH l IN CHARACTER MODE].
      const w = t.words, up = w.map(U);
      const linesIdx = up.indexOf('LINES'), tableIdx = up.indexOf('TABLE');
      if (tableIdx !== -1 && linesIdx !== -1) {
        const r = this.ref(w[tableIdx + 1]);
        const v = r ? r.get() : null;
        this.assignTo(w[linesIdx + 1], Array.isArray(v) ? v.length : 0, t);
        this.setSy('TFILL', Array.isArray(v) ? v.length : 0);
        return;
      }
      if (up[1] === 'FIELD' && w[2]) {
        const r = this.ref(w[2]);
        const d = r && r.desc;
        const ti = up.indexOf('TYPE'), li = up.indexOf('LENGTH');
        const code = !d ? 'C' : d.kind === 'table' ? 'h' : d.kind === 'struct' ? 'u' : d.kind === 'ref' ? 'r'
          : ({ int: 'I', float: d.packed ? 'P' : 'F', char: 'C', numc: 'N', string: 'g', date: 'D', time: 'T' })[d.base] || 'C';
        if (ti !== -1 && w[ti + 1]) this.assignTo(w[ti + 1], code, t);
        if (li !== -1 && w[li + 1]) this.assignTo(w[li + 1], (d && d.len) || (r ? this.formatOut(r.get()).length : 0), t);
      }
    }

    // ── OpenSQL SELECT (simulated from window.ABAP_DB) ─────
    execSelect(t) {
      const words = t.words;
      const top = this.sqlDepth === 0;
      if (top) {
        this.subqCache = new Map();
        // SELECT ... UNION [ALL | DISTINCT] SELECT ...
        const wl = this.levels(words);
        if (words.some((x, k) => wl[k] === 0 && U(x) === 'UNION')) return this.execUnion(t, wl);
        this.stats.dbReads++;
        if (this.repeatDepth > 0) this.stats.inLoop[t.lineNo] = (this.stats.inLoop[t.lineNo] || 0) + 1;
      }
      const cl = { FIELDS: [], FROM: [], INTO: [], WHERE: [], ORDER: [], UPTO: [], FAE: [], GROUP: [], HAVING: [], OTHER: [] };
      let cur = 'FIELDS', single = false, appending = false, distinctRows = false, i = 1;
      if (U(words[i]) === 'SINGLE') { single = true; i++; }
      if (U(words[i]) === 'DISTINCT') { distinctRows = true; i++; }
      for (; i < words.length; i++) {
        const W = U(words[i]), N = U(words[i + 1]);
        if (W === 'FROM' && cur !== 'WHERE' && cur !== 'HAVING') { cur = 'FROM'; continue; }
        if (W === 'INTO' || W === 'APPENDING') { cur = 'INTO'; appending = appending || W === 'APPENDING'; continue; }
        if (W === 'WHERE') { cur = 'WHERE'; continue; }
        if (W === 'ORDER' && N === 'BY') { cur = 'ORDER'; i++; continue; }
        if (W === 'GROUP' && N === 'BY') { cur = 'GROUP'; i++; continue; }
        if (W === 'HAVING') { cur = 'HAVING'; continue; }
        if (W === 'UP' && N === 'TO') { cur = 'UPTO'; i++; continue; }
        if (W === 'ROWS' && cur === 'UPTO') { cur = 'OTHER'; continue; }
        if (W === 'FIELDS' && cur === 'FROM') { cur = 'FIELDS'; continue; }
        if (W === 'FOR' && N === 'ALL') { cur = 'FAE'; i++; continue; }
        if (W === 'BYPASSING' || W === 'CLIENT') { cur = 'OTHER'; continue; }
        if (words[i] === ',' && cur !== 'FIELDS') continue;      // the field list keeps its commas: they separate expressions
        cl[cur].push(words[i]);
      }

      // dynamic table name / condition: FROM (lv_table) ... WHERE (lv_condition)
      const dynamic = toks => {
        if (toks.length !== 3 || toks[0] !== '(' || toks[2] !== ')' || !this.ref(toks[1])) return null;
        const v = this.evalExpr([toks[1]]);
        return Array.isArray(v) ? v.map(x => this.formatOut(x)).join(' ') : this.formatOut(v);
      };
      const dynFrom = dynamic(cl.FROM), dynWhere = dynamic(cl.WHERE);
      if (dynFrom !== null) cl.FROM = this.words(dynFrom.trim());
      if (dynWhere !== null) cl.WHERE = this.words(dynWhere.trim()).filter(x => x !== ',');

      const sources = this.parseFrom(cl.FROM);
      if (!sources.length) return null;
      const tableName = sources.map(s => s.table).join('+');

      // INTO [CORRESPONDING FIELDS OF] [TABLE] target | ( a, b )
      let k = 0, corr = false, intoTable = false, inline = false;
      const targets = [];
      if (U(cl.INTO[k]) === 'CORRESPONDING') { corr = true; k += 3; }
      if (U(cl.INTO[k]) === 'TABLE') { intoTable = true; k++; }
      if (cl.INTO[k] === '(') {
        for (let j = k + 1; j < cl.INTO.length && cl.INTO[j] !== ')'; j++) targets.push(cl.INTO[j]);
      } else if (/^@?(DATA|FINAL)$/i.test(cl.INTO[k] || '') && cl.INTO[k + 1] === '(') {
        targets.push(cl.INTO[k + 2]); inline = true;
      } else if (cl.INTO[k]) {
        targets.push(cl.INTO[k]);
      }

      // SELECT * FROM mara ... without INTO: the work area declared with TABLES mara
      if (!targets.length && sources.length === 1 && cl.FIELDS.length === 1 && cl.FIELDS[0] === '*' && this.variables[sources[0].table] && isObj(this.variables[sources[0].table].value)) {
        targets.push(sources[0].table);
      }

      // Read (and join) the source tables: every row carries COL and ALIAS~COL
      const known = new Set();
      let dbTable = null;
      for (const s of sources) {
        const tab = this.dbTable(s.table);
        if (!tab) {
          this.output.push({ text: `[DB] Table "${s.table}" not found in database.`, cls: 'warning' });
          this.problem(t, `Tabel database "${s.table}" tidak ada di dummy database. Tersedia: ${this.dbNames().join(', ')}`, 'warning');
          this.setSy('SUBRC', 4); this.setSy('DBCNT', 0);
          return null;
        }
        const sd = this.dbStructDesc(s.table);
        const cols = sd ? sd.fields.map(f => f.name) : Object.keys(tab[0] || {});
        for (const c of cols) { known.add(U(c)); known.add(`${s.alias}~${U(c)}`); known.add(`${s.table}~${U(c)}`); }
        const merge = (left, r) => {
          const m = Object.assign({}, left);
          for (const c of cols) {
            const fd = sd ? this.fieldDesc(sd, c) : null;
            const v = r ? r[this.ciKey(r, c)] : (fd ? this.initValue(fd) : '');
            m[`${s.alias}~${U(c)}`] = v;
            if (s.alias !== s.table) m[`${s.table}~${U(c)}`] = v;
            if (!(U(c) in m)) m[U(c)] = v;
          }
          return m;
        };
        if (dbTable === null) { dbTable = tab.map(r => merge({}, r)); continue; }
        const next = [];
        for (const left of dbTable) {
          let matched = false;
          for (const r of tab) {
            const m = merge(left, r);
            if (!s.on.length || this.evalRowWhere(m, s.on)) { next.push(m); matched = true; }
          }
          if (!matched && s.join === 'LEFT') next.push(merge(left, null));
        }
        dbTable = next;
      }

      // Field list: columns and aggregate functions
      const isStar = cl.FIELDS.filter(x => x !== ',').length === 1 && cl.FIELDS[0] === '*';
      const items = [];
      const computed = toks => items.push({ computed: true, expr: toks, src: '*', col: 'EXPR', name: `EXPR${items.length + 1}` });
      // one field (or, in the old syntax without commas, several fields) made of plain columns / aggregates
      const scan = ft => {
        for (let j = 0; j < ft.length; j++) {
          const X = U(ft[j]);
          if (X === 'AS') { if (items.length) { const it = items[items.length - 1]; it.name = U(ft[++j]); it.aliased = true; } continue; }
          if (X === 'CASE') {
            // CASE ... END as a column
            let depth = 0, e = j;
            for (; e < ft.length; e++) { const Y = U(ft[e]); if (Y === 'CASE') depth++; else if (Y === 'END' && --depth === 0) break; }
            computed(ft.slice(j, e + 1));
            j = e;
            continue;
          }
          if (AGG_FUNCS.has(X) && ft[j + 1] === '(') {
            const c = this.matchParen(ft, j + 1);
            let inner = ft.slice(j + 2, c === -1 ? ft.length : c).map(U);
            const distinct = inner[0] === 'DISTINCT';
            if (distinct) inner = inner.slice(1);
            const src = (inner[0] || '*').replace(/^@/, '');
            const col = src.replace(/^.*~/, '');
            items.push({ agg: true, fn: X, src, col, distinct, name: `${X}_${col === '*' ? 'ALL' : col}`, key: `${X}(${src})` });
            j = c === -1 ? ft.length : c;
            continue;
          }
          if (ft[j][0] === '@' || /^['`]/.test(ft[j]) || isNum(ft[j])) {      // constant column: SELECT SINGLE @abap_true ...
            items.push({ lit: true, value: this.evalExpr([ft[j]]), src: '*', col: 'LITERAL', name: `LITERAL${items.length + 1}` });
            continue;
          }
          const src = X.replace(/^@/, '');
          items.push({ src, col: src.replace(/^.*~/, ''), name: src.replace(/^.*~/, '') });
        }
      };
      if (!isStar) {
        const flv = this.levels(cl.FIELDS);
        if (cl.FIELDS.some((x, k) => x === ',' && flv[k] === 0)) {
          // new syntax: comma-separated fields, each may be an expression:  a - b AS rest,  concat( a, b ) AS key
          let group = [];
          const flush = () => {
            if (!group.length) return;
            const glv = this.levels(group);
            let body = group, alias = null;
            if (group.length > 2 && U(group[group.length - 2]) === 'AS' && glv[group.length - 2] === 0) { alias = U(group[group.length - 1]); body = group.slice(0, -2); }
            const isAgg = AGG_FUNCS.has(U(body[0])) && body[1] === '(' && this.matchParen(body, 1) === body.length - 1;
            if (body.length === 1 || isAgg) scan(group);
            else { computed(body); if (alias) { items[items.length - 1].name = alias; items[items.length - 1].aliased = true; } }
            group = [];
          };
          cl.FIELDS.forEach((x, k) => { if (x === ',' && flv[k] === 0) flush(); else group.push(x); });
          flush();
        } else {
          scan(cl.FIELDS);
        }
        for (const f of items) {
          if (f.src !== '*' && !known.has(f.src)) this.problem(t, `SELECT: kolom "${f.src}" tidak ada di tabel ${tableName}`, 'error');
        }
      }
      const rowVal = (row, name) => row[this.ciKey(row, name)];
      const itemVal = (row, f) => (f.lit ? f.value : f.computed ? this.sqlValue(f.expr, row) : rowVal(row, f.src));

      // WHERE (optionally FOR ALL ENTRIES)
      let rows;
      const fae = cl.FAE.length > 0;
      if (fae) {
        const drvName = U(cl.FAE[cl.FAE.length - 1]).replace(/^@/, '');
        const dr = this.ref(drvName);
        const drv = dr ? dr.get() : null;
        if (!Array.isArray(drv)) {
          this.problem(t, `FOR ALL ENTRIES IN ${drvName}: bukan internal table`, 'error');
          rows = [];
        } else if (!drv.length) {
          this.problem(t, `FOR ALL ENTRIES: tabel driver ${drvName} kosong → WHERE diabaikan dan SEMUA baris terambil (perilaku asli SAP). Selalu cek "IF ${drvName.toLowerCase()} IS NOT INITIAL" sebelum SELECT.`, 'warning');
          rows = dbTable;
        } else {
          // itab-field in the WHERE clause refers to the current driver line
          const saved = this.variables[drvName];
          const picked = new Set();
          try {
            for (const d of drv) {
              this.variables[drvName] = { type: 'struct', value: d };
              dbTable.forEach((row, idx) => { if (!picked.has(idx) && this.evalRowWhere(row, cl.WHERE)) picked.add(idx); });
            }
          } finally {
            this.variables[drvName] = saved;
          }
          rows = dbTable.filter((row, idx) => picked.has(idx));
        }
      } else {
        rows = dbTable.filter(row => this.evalRowWhere(row, cl.WHERE));
      }

      // Aggregates / GROUP BY / HAVING
      const hasAgg = items.some(x => x.agg);
      const gcols = cl.GROUP.map(U);
      if (hasAgg || gcols.length) {
        for (const f of items) {
          if (!f.agg && !f.lit && !f.computed && !gcols.includes(f.src) && !gcols.includes(f.col)) {
            this.problem(t, `SELECT: kolom "${f.src}" dipakai bersama fungsi agregat, jadi harus disebut di GROUP BY`, 'error');
          }
        }
        const groups = new Map();
        for (const row of rows) {
          const key = JSON.stringify(gcols.map(c => rowVal(row, c)));
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push(row);
        }
        if (!gcols.length && !groups.size) groups.set('[]', []);
        const aggVal = (it, grp) => {
          let vals = it.src === '*' ? grp.map(() => 1) : grp.map(r => rowVal(r, it.src));
          if (it.distinct) vals = [...new Set(vals)];
          const nums = vals.map(Number);
          switch (it.fn) {
            case 'COUNT': return vals.length;
            case 'SUM': return Number(nums.reduce((a, b) => a + b, 0).toPrecision(15));
            case 'AVG': return vals.length ? Number((nums.reduce((a, b) => a + b, 0) / vals.length).toPrecision(15)) : 0;
            case 'MAX': return vals.length ? vals.reduce((a, b) => (this.cmpValues(a, b) >= 0 ? a : b)) : 0;
            default:    return vals.length ? vals.reduce((a, b) => (this.cmpValues(a, b) <= 0 ? a : b)) : 0;
          }
        };
        rows = [...groups.values()].map(grp => {
          const first = grp[0] || {}, o = {};
          for (const c of gcols) { o[c] = rowVal(first, c); o[c.replace(/^.*~/, '')] = o[c]; }
          for (const it of items) {
            const v = it.agg ? aggVal(it, grp) : itemVal(first, it);
            o[it.name] = v;
            o[it.agg ? it.key : it.src] = v;
          }
          return o;
        });
        if (cl.HAVING.length) {
          const having = this.foldAgg(cl.HAVING);
          rows = rows.filter(r => this.evalRowWhere(r, having));
        }
        for (const it of items) { it.src = it.name; it.computed = false; }       // from here on read the aggregated rows
      }

      // computed columns become part of the row, so ORDER BY can use their alias
      const comp = items.filter(x => x.computed);
      if (comp.length) {
        rows = rows.map(r => { const o = Object.assign({}, r); for (const it of comp) o[it.name] = this.sqlValue(it.expr, r); return o; });
        for (const it of comp) { it.computed = false; it.src = it.name; }
      }

      // ORDER BY, UP TO n ROWS
      if (cl.ORDER.length && U(cl.ORDER[0]) !== 'PRIMARY') {
        const keys = [];
        for (const x of this.foldAgg(cl.ORDER)) {
          const X = U(x);
          if (X === 'DESCENDING' || X === 'ASCENDING') { if (keys.length) keys[keys.length - 1].desc = X === 'DESCENDING'; continue; }
          keys.push({ f: X, desc: false });
        }
        rows = [...rows].sort((a, b) => {
          for (const key of keys) {
            const c = this.cmpValues(rowVal(a, key.f), rowVal(b, key.f));
            if (c) return key.desc ? -c : c;
          }
          return 0;
        });
      }
      let limit = single ? 1 : 0;
      if (cl.UPTO.length) {
        const n = Number(this.evalExpr([cl.UPTO[0]]));
        if (n > 0) limit = limit ? Math.min(limit, n) : n;
      }
      if (limit) rows = rows.slice(0, limit);

      const setCounts = n => { this.setSy('SUBRC', n > 0 ? 0 : 4); this.setSy('DBCNT', n); if (top) this.stats.dbRows += n; };

      // Shape of the target line
      const tref = targets.length === 1 ? this.ref(targets[0]) : null;
      let lineDesc = null;
      if (tref && tref.desc) lineDesc = tref.desc.kind === 'table' ? tref.desc.line : tref.desc;
      if (!lineDesc || lineDesc.kind !== 'struct') lineDesc = null;

      const makeRow = src => {
        if (lineDesc) {
          const o = this.initValue(lineDesc);
          const names = lineDesc.fields.map(f => f.name);
          if (isStar) {
            for (const n of names) { const sk = this.ciKey(src, n); if (sk in src) o[n] = src[sk]; }
          } else {
            items.forEach((f, idx) => {
              const v = itemVal(src, f);
              if (names.includes(f.name)) o[f.name] = v !== undefined ? v : o[f.name];
              else if (!corr && names[idx] !== undefined && v !== undefined) o[names[idx]] = v;   // positional
            });
          }
          return o;
        }
        const o = {};
        if (isStar) { for (const key of Object.keys(src)) if (!key.includes('~')) o[U(key)] = src[key]; return o; }
        for (const f of items) { const v = itemVal(src, f); o[f.name] = v !== undefined ? v : ''; }
        return o;
      };

      const assignRow = src => {
        if (targets.length > 1) {
          targets.forEach((name, idx) => { const f = items[idx]; if (f) this.assignTo(name, itemVal(src, f), t); });
        } else if (targets.length === 1) {
          const scalarTarget = !isStar && items.length === 1 && !lineDesc && !(tref && isObj(tref.get()));
          if (scalarTarget && inline && !this.variables[U(targets[0]).replace(/^@/, '')]) this.declareVar(targets[0], undefined);
          if (scalarTarget) this.assignTo(targets[0], itemVal(src, items[0]), t);
          else if (inline && !this.ref(targets[0])) this.declareVar(targets[0], this.inferDesc(makeRow(src)), makeRow(src));
          else this.assignTo(targets[0], makeRow(src), t);
        }
      };

      if (intoTable) {
        let result = rows.map(makeRow);
        if (fae || distinctRows) {
          // FOR ALL ENTRIES / DISTINCT remove duplicate result lines
          const seen = new Set();
          result = result.filter(r => { const key = JSON.stringify(r); return seen.has(key) ? false : seen.add(key); });
        }
        if (targets[0]) {
          if (inline || !tref) {
            this.declareVar(targets[0], this.inferDesc(result), result);
          } else if (Array.isArray(tref.get()) || !tref.desc || tref.desc.kind === 'table' || tref.desc.base === 'any') {
            tref.set(appending && Array.isArray(tref.get()) ? tref.get().concat(result) : result);
            if (tref.rec && !tref.isField) tref.rec.type = 'table';
          } else {
            this.problem(t, `SELECT ... INTO TABLE: "${tref.name}" bukan internal table`, 'error');
          }
        }
        setCounts(result.length);
        return null;
      }

      // one result row: SELECT SINGLE, or aggregates without GROUP BY
      if (single || (hasAgg && !gcols.length)) {
        if (rows.length) assignRow(rows[0]);
        const onlyCount = hasAgg && items.length === 1 && items[0].fn === 'COUNT' && rows.length;
        setCounts(onlyCount ? Number(rowVal(rows[0], items[0].src)) || 0 : rows.length);
        return null;
      }

      // SELECT ... INTO wa ... ENDSELECT (or the old lenient form without ENDSELECT)
      setCounts(rows.length);
      return {
        loopRows: rows,
        assignRow,
        assignFirst: () => {
          // no ENDSELECT: fill a table target with everything, a work area with the first row
          const isTab = tref ? Array.isArray(tref.get()) : true;
          if (targets.length === 1 && isTab) {
            const result = rows.map(makeRow);
            if (tref) tref.set(result); else this.declareVar(targets[0], this.inferDesc(result), result);
          } else if (rows.length) {
            assignRow(rows[0]);
          }
        }
      };
    }

    // Rows of a SELECT without INTO (subquery, UNION branch): array of row objects
    selectRows(toks, lineNo) {
      const tmp = '__SUBQUERY' + (++this.subqSeq);
      const keep = ['SY-SUBRC', 'SY-DBCNT'].map(k => (this.variables[k] ? this.variables[k].value : undefined));
      this.sqlDepth++;
      try {
        this.execSelect({ words: [...toks, 'INTO', 'TABLE', '@DATA', '(', tmp, ')'], lineNo, raw: '' });
        const rec = this.variables[tmp];
        return rec && Array.isArray(rec.value) ? rec.value : [];
      } finally {
        this.sqlDepth--;
        delete this.variables[tmp];
        ['SY-SUBRC', 'SY-DBCNT'].forEach((k, pos) => { if (keep[pos] !== undefined && this.variables[k]) this.variables[k].value = keep[pos]; });
      }
    }

    // ( SELECT col FROM ... ) inside a condition -> the values of its first column.
    // A subquery that mentions no alias~column cannot depend on the outer row, so it is read only once.
    subquery(toks) {
      const key = toks.join(' ');
      const cacheable = this.subqCache && !toks.some(x => x.includes('~') && !/^['`|]/.test(x));
      if (cacheable && this.subqCache.has(key)) return this.subqCache.get(key);
      const vals = this.selectRows(toks, this.curLine).map(r => (isObj(r) ? r[Object.keys(r)[0]] : r));
      if (cacheable) this.subqCache.set(key, vals);
      return vals;
    }

    // SELECT ... UNION [ALL | DISTINCT] SELECT ... INTO TABLE target
    execUnion(t, wl) {
      const words = t.words;
      const parts = [];
      let cur = [], all = false;
      const flags = [];
      for (let k = 0; k < words.length; k++) {
        if (wl[k] === 0 && U(words[k]) === 'UNION') {
          parts.push(cur); cur = [];
          const nx = U(words[k + 1]);
          flags.push(nx === 'ALL');
          if (nx === 'ALL' || nx === 'DISTINCT') k++;
          continue;
        }
        cur.push(words[k]);
      }
      parts.push(cur);
      all = flags.length > 0 && flags.every(Boolean);
      // the INTO clause stands in one of the branches (normally the last): take it out
      let into = [];
      const branches = parts.map(p => {
        const lv = this.levels(p);
        const ii = p.findIndex((x, k) => lv[k] === 0 && (U(x) === 'INTO' || U(x) === 'APPENDING'));
        if (ii === -1) return p;
        let e = ii + 1;
        while (e < p.length && !(lv[e] === 0 && ['WHERE', 'GROUP', 'ORDER', 'HAVING', 'UP'].includes(U(p[e])))) e++;
        into = p.slice(ii + 1, e);
        return p.slice(0, ii).concat(p.slice(e));
      });
      this.stats.dbReads++;
      if (this.repeatDepth > 0) this.stats.inLoop[t.lineNo] = (this.stats.inLoop[t.lineNo] || 0) + 1;
      let names = null;
      let result = [];
      for (const b of branches) {
        for (const row of this.selectRows(b, t.lineNo)) {
          const keys = Object.keys(row);
          if (!names) names = keys;                          // column names come from the first SELECT
          const o = {};
          names.forEach((nm, pos) => { o[nm] = row[keys[pos]]; });
          result.push(o);
        }
      }
      if (!all) {
        const seen = new Set();
        result = result.filter(r => { const key = JSON.stringify(r); return seen.has(key) ? false : seen.add(key); });
      }
      const up = into.map(U);
      let k = 0;
      if (up[k] === 'CORRESPONDING') k += 3;
      if (up[k] === 'TABLE') k++;
      const inline = /^@?(DATA|FINAL)$/.test(up[k] || '') && into[k + 1] === '(';
      const target = inline ? into[k + 2] : into[k];
      if (target) {
        const tref = inline ? null : this.ref(target);
        if (!tref) this.declareVar(target, this.inferDesc(result), result);
        else this.assignTo(target, result, t);
      }
      this.setSy('SUBRC', result.length ? 0 : 4); this.setSy('DBCNT', result.length);
      this.stats.dbRows += result.length;
      return null;
    }

    // Value of an expression of the SELECT list for one row
    sqlValue(toks, row) {
      const prev = this.rowCtx;
      this.rowCtx = { row, outer: prev };
      try {
        return this.sqlExpr(toks);
      } finally {
        this.rowCtx = prev;
      }
    }

    // SQL expression: CASE ... END, functions, + - * /, && ; evaluated with the columns of the current row visible
    sqlExpr(toks) {
      const w = this.stripParens(toks);
      if (!w.length) return '';
      if (w.length === 1) return this.evalAtom(w[0]);
      const up = w.map(U);
      // depth of every token: parentheses and CASE ... END both nest
      const depth = [];
      let p = 0, c = 0;
      w.forEach((x, k) => {
        if (x === ')') p--;
        if (up[k] === 'END' && c > 0 && !/^['`|]/.test(x)) c--;
        depth[k] = p + c;
        if (x === '(') p++;
        if (up[k] === 'CASE' && !/^['`|]/.test(x)) c++;
      });
      const endOfCase = () => { for (let k = 1; k < w.length; k++) if (up[k] === 'END' && depth[k] === 0) return k; return -1; };
      if (up[0] === 'CASE' && endOfCase() === w.length - 1) return this.sqlCase(w.slice(1, -1));

      for (const ops of [['&&'], ['+', '-'], ['*', '/']]) {
        for (let k = w.length - 1; k > 0; k--) {
          if (depth[k] !== 0 || !ops.includes(w[k]) || /^['`|]/.test(w[k])) continue;
          const a = this.sqlExpr(w.slice(0, k)), b = this.sqlExpr(w.slice(k + 1));
          if (w[k] === '&&') return this.formatOut(a) + this.formatOut(b);
          const x = this.num(a), y = this.num(b);
          switch (w[k]) {
            case '+': return Number((x + y).toPrecision(15));
            case '-': return Number((x - y).toPrecision(15));
            case '*': return Number((x * y).toPrecision(15));
            default:  return y === 0 ? 0 : Number((x / y).toPrecision(15));
          }
        }
      }

      // function( arg, arg )
      if (w[1] === '(' && this.matchParen(w, 1) === w.length - 1 && /^[A-Za-z_]\w*$/.test(w[0])) {
        const inner = w.slice(2, -1), il = this.levels(inner);
        const args = [];
        let part = [];
        inner.forEach((x, k) => { if (x === ',' && il[k] === 0) { args.push(part); part = []; } else part.push(x); });
        if (part.length) args.push(part);
        const F = up[0];
        if (F === 'CAST') { const ai = inner.findIndex(x => U(x) === 'AS'); return this.sqlExpr(ai === -1 ? inner : inner.slice(0, ai)); }
        const v = args.map(a => this.sqlExpr(a));
        const str = k => this.formatOut(v[k] === undefined ? '' : v[k]);
        const num = k => this.num(v[k] === undefined ? 0 : v[k]);
        switch (F) {
          case 'CONCAT': return str(0).trimEnd() + str(1).trimEnd();
          case 'CONCAT_WITH_SPACE': return str(0).trimEnd() + ' '.repeat(num(2) || 1) + str(1).trimEnd();
          case 'UPPER': return str(0).toUpperCase();
          case 'LOWER': return str(0).toLowerCase();
          case 'LENGTH': return str(0).trimEnd().length;
          case 'SUBSTRING': return str(0).substr(Math.max(0, num(1) - 1), v[2] === undefined ? undefined : num(2));
          case 'LEFT': return str(0).slice(0, num(1));
          case 'RIGHT': return str(0).slice(-num(1));
          case 'LTRIM': { let x = str(0); const ch = str(1) || ' '; while (x.startsWith(ch)) x = x.slice(ch.length); return x; }
          case 'RTRIM': { let x = str(0); const ch = str(1) || ' '; while (x.endsWith(ch)) x = x.slice(0, -ch.length); return x; }
          case 'REPLACE': return str(0).split(str(1)).join(str(2));
          case 'COALESCE': { const hit = v.find(x => x !== undefined && x !== null && x !== ''); return hit === undefined ? '' : hit; }
          case 'ABS': return Math.abs(num(0));
          case 'CEIL': return Math.ceil(num(0));
          case 'FLOOR': return Math.floor(num(0));
          case 'ROUND': { const m = Math.pow(10, num(1) || 0); return Math.round(num(0) * m) / m; }
          case 'DIV': return num(1) === 0 ? 0 : Math.floor(num(0) / num(1));
          case 'MOD': return num(1) === 0 ? 0 : num(0) % num(1);
          case 'DIVISION': { const m = Math.pow(10, num(2) || 0); return num(1) === 0 ? 0 : Math.round(num(0) / num(1) * m) / m; }
        }
      }
      return this.evalExpr(w);
    }

    // body of CASE ... END:  WHEN cond THEN v ... [ELSE v]   or   operand WHEN value THEN v ... [ELSE v]
    sqlCase(body) {
      const up = body.map(U);
      const marks = [];
      let p = 0, c = 0;
      body.forEach((x, k) => {
        if (x === ')') p--;
        if (up[k] === 'END' && c > 0) c--;
        if (p === 0 && c === 0 && ['WHEN', 'THEN', 'ELSE'].includes(up[k]) && !/^['`|]/.test(x)) marks.push(k);
        if (x === '(') p++;
        if (up[k] === 'CASE') c++;
      });
      if (!marks.length) return '';
      const operand = body.slice(0, marks[0]);
      for (let m = 0; m < marks.length; m++) {
        const at = marks[m], next = m + 1 < marks.length ? marks[m + 1] : body.length;
        if (up[at] === 'ELSE') return this.sqlExpr(body.slice(at + 1, next));
        if (up[at] !== 'WHEN') continue;
        const thenAt = marks[m + 1];
        if (thenAt === undefined || up[thenAt] !== 'THEN') continue;
        const after = m + 2 < marks.length ? marks[m + 2] : body.length;
        const cond = body.slice(at + 1, thenAt);
        const hit = operand.length ? this.compare(this.sqlExpr(operand), '=', this.sqlExpr(cond)) : this.evalCond(cond);
        if (hit) return this.sqlExpr(body.slice(thenAt + 1, after));
      }
      return '';
    }

    // FROM t1 [AS a] [INNER | LEFT [OUTER]] JOIN t2 [AS b] ON cond ...
    parseFrom(F) {
      const up = F.map(U);
      const src = [];
      let i = 0;
      const readTable = () => {
        while (F[i] === '(' || F[i] === ')') i++;
        const s = { table: up[i], alias: up[i], join: null, on: [] };
        i++;
        if (up[i] === 'AS') { s.alias = up[i + 1]; i += 2; }
        return s;
      };
      if (!F.length) return src;
      src.push(readTable());
      while (i < F.length) {
        let type = 'INNER';
        if (up[i] === 'INNER') i++;
        else if (up[i] === 'LEFT' || up[i] === 'RIGHT') { type = up[i]; i++; if (up[i] === 'OUTER') i++; }
        if (up[i] !== 'JOIN') { i++; continue; }
        i++;
        const s = readTable();
        if (!s.table) break;
        s.join = type;
        if (up[i] === 'ON') {
          i++;
          while (i < F.length && !['INNER', 'LEFT', 'RIGHT', 'JOIN'].includes(up[i])) s.on.push(F[i++]);
        }
        src.push(s);
      }
      return src.filter(s => s.table);
    }

    runSelectLoop(tokens, start, end, res) {
      this.loopDepth++; this.repeatDepth++;
      try {
        let n = 0;
        for (const row of res.loopRows) {
          res.assignRow(row);
          this.setSy('DBCNT', ++n);
          try {
            this.execute(tokens, start + 1, end - 1);
          } catch (e) {
            if (e && e.signal === 'EXIT_LOOP') break;
            if (!(e && e.signal === 'CONTINUE')) throw e;
          }
        }
      } finally {
        this.loopDepth--; this.repeatDepth--;
      }
      this.setSy('SUBRC', res.loopRows.length ? 0 : 4);
      this.setSy('DBCNT', res.loopRows.length);
    }

    // Evaluate a condition with the columns / components of `row` visible as names
    evalRowWhere(row, words) {
      if (!words || !words.length) return true;
      const prev = this.rowCtx;
      this.rowCtx = { row, outer: prev };
      try {
        return this.evalCond(words);
      } finally {
        this.rowCtx = prev;
      }
    }

    // ── IF / ELSEIF / ELSE / ENDIF ────────────────────────
    execIf(tokens, start, end) {
      const blocks = this.splitBlocks(tokens, start, end, ['ELSEIF', 'ELSE'], 'IF', 'ENDIF');
      for (const block of blocks) {
        if (block.cond === null || this.evalCond(block.cond)) {
          this.execute(tokens, block.bodyStart, block.bodyEnd);
          return end - start + 1;
        }
      }
      return end - start + 1;
    }

    // ── CASE / WHEN / ENDCASE ──────────────────────────────
    execCase(tokens, start, end) {
      const caseVal = this.evalExpr(tokens[start].words.slice(1));
      let i = start + 1, depth = 0;
      while (i <= end) {
        const kw = U(tokens[i].words[0]);
        if (kw === 'CASE') depth++;
        if (kw === 'ENDCASE' && depth > 0) { depth--; i++; continue; }
        if (kw === 'WHEN' && depth === 0) {
          const rest = tokens[i].words.slice(1);
          let matches = rest.length === 1 && U(rest[0]) === 'OTHERS';
          if (!matches) {
            // WHEN a OR b OR c
            let alt = [];
            for (const x of rest.concat(['OR'])) {
              if (U(x) === 'OR') { if (alt.length && this.compare(caseVal, '=', this.evalExpr(alt))) matches = true; alt = []; }
              else alt.push(x);
            }
          }
          // find next WHEN or ENDCASE at the same level
          let j = i + 1, d2 = 0;
          while (j <= end) {
            const k2 = U(tokens[j].words[0]);
            if (k2 === 'CASE') d2++;
            else if (k2 === 'ENDCASE') { if (d2 === 0) break; d2--; }
            else if (k2 === 'WHEN' && d2 === 0) break;
            j++;
          }
          if (matches) {
            this.execute(tokens, i + 1, j - 1);
            return end - start + 1;
          }
          i = j;
        } else {
          i++;
        }
      }
      return end - start + 1;
    }

    // Runs a loop body; returns 'break' when the loop must end
    runBody(tokens, start, end) {
      try {
        this.execute(tokens, start, end);
      } catch (e) {
        if (e && e.signal === 'EXIT_LOOP') return 'break';
        if (!(e && e.signal === 'CONTINUE')) throw e;
      }
      return null;
    }

    // ── DO ... TIMES / ENDDO ──────────────────────────────
    execDo(tokens, start, end) {
      const words = tokens[start].words;
      const timesIdx = words.findIndex(x => U(x) === 'TIMES');
      const times = timesIdx !== -1 ? Number(this.evalExpr(words.slice(1, timesIdx))) : Infinity;
      const prevIndex = this.variables['SY-INDEX'];
      this.loopDepth++; this.repeatDepth++;
      try {
        for (let n = 1; n <= times; n++) {
          this.setSy('INDEX', n);
          if (this.runBody(tokens, start + 1, end - 1) === 'break') break;
        }
      } finally {
        this.loopDepth--; this.repeatDepth--;
      }
      if (this.loopDepth > 0 && prevIndex) this.variables['SY-INDEX'] = prevIndex;
      return end - start + 1;
    }

    // ── WHILE ... ENDWHILE ────────────────────────────────
    execWhile(tokens, start, end) {
      const cond = tokens[start].words.slice(1);
      const prevIndex = this.variables['SY-INDEX'];
      let n = 0;
      this.loopDepth++; this.repeatDepth++;
      try {
        while (this.evalCond(cond)) {
          if (++n > 10000) { this.output.push({ text: '⚠ Infinite WHILE loop stopped', cls: 'warning' }); break; }
          this.setSy('INDEX', n);
          if (this.runBody(tokens, start + 1, end - 1) === 'break') break;
        }
      } finally {
        this.loopDepth--; this.repeatDepth--;
      }
      if (this.loopDepth > 0 && prevIndex) this.variables['SY-INDEX'] = prevIndex;
      return end - start + 1;
    }

    // ── LOOP AT itab [INTO wa | ASSIGNING <fs> | REFERENCE INTO dref] [FROM n] [TO m] [WHERE cond] ... ENDLOOP ──
    execLoop(tokens, start, end) {
      const t = tokens[start];
      let w = t.words, up = w.map(U);
      const span = end - start + 1;
      if (up[1] !== 'AT' || !w[2] || up[2] === 'SCREEN') return span;      // LOOP AT SCREEN: dynpro only

      let r;
      if (up[2] === 'GROUP' && w[3] && up[3] !== 'BY') {
        // LOOP AT GROUP grp ...: the members of the current group
        const mem = this.groupMembers[up[3]];
        if (!mem) {
          this.problem(t, `LOOP AT GROUP ${up[3]}: "${up[3]}" bukan group dari LOOP AT ... GROUP BY yang sedang berjalan`, 'error');
          return span;
        }
        w = [w[0], w[1], 'GROUP ' + w[3], ...w.slice(4)]; up = w.map(U);
        r = { get: () => mem.rows, desc: { kind: 'table', line: mem.lineDesc }, rec: {} };
      } else if (w[3] === '->' || w[3] === '=>') {
        // LOOP AT obj->attr / obj->method( ) / cls=>attr
        const lvw = this.levels(w);
        let e = 3;
        while (e < w.length && !(lvw[e] === 0 && ['INTO', 'ASSIGNING', 'REFERENCE', 'WHERE', 'FROM', 'TO', 'GROUP', 'TRANSPORTING', 'USING'].includes(up[e]))) e++;
        const cur = this.resolveChain(w.slice(2, e), t);
        r = { get: () => cur.value, desc: cur.rec ? cur.rec.desc : null, rec: {} };
        w = [w[0], w[1], w.slice(2, e).join(''), ...w.slice(e)]; up = w.map(U);
      } else {
        r = this.ref(w[2]);
      }
      const itab = r ? r.get() : undefined;
      if (!Array.isArray(itab)) {
        this.problem(t, `LOOP AT ${U(w[2])}: bukan internal table${r ? '' : ' (belum dideklarasikan)'}`, 'error');
        return span;
      }
      const lineDesc = r.desc && r.desc.kind === 'table' ? r.desc.line : null;

      let waName = null, fsName = null, refName = null, where = [];
      let k = up.indexOf('INTO');
      if (k !== -1) {
        if (up[k - 1] === 'REFERENCE') refName = this.targetName(w, k + 1);
        else waName = this.targetName(w, k + 1);
      }
      k = up.indexOf('ASSIGNING');
      if (k !== -1) fsName = this.targetName(w, k + 1);
      k = up.indexOf('WHERE');
      if (k !== -1) {
        where = w.slice(k + 1);
        const cut = where.findIndex(x => ['INTO', 'ASSIGNING', 'REFERENCE', 'GROUP'].includes(U(x)));
        if (cut !== -1) where = where.slice(0, cut);
      }
      const gi = up.findIndex((x, pos) => pos > 2 && x === 'GROUP' && up[pos + 1] === 'BY');
      if (gi !== -1) return this.execLoopGroups(tokens, start, end, { t, w, up, itab, lineDesc, waName, fsName, refName, where, gi });
      const useHeader = !waName && !fsName && !refName && !up.includes('TRANSPORTING') && r.rec.header !== undefined;
      if (!waName && !fsName && !refName && !useHeader && !up.includes('TRANSPORTING')) {
        this.problem(t, `LOOP AT ${U(w[2])} tanpa INTO / ASSIGNING hanya berlaku untuk tabel dengan header line`, 'error');
      }
      let from = 0, to = Infinity;
      k = up.indexOf('FROM');
      if (k > 2) from = Math.max(0, Number(this.evalExpr([w[k + 1]])) - 1);
      k = up.indexOf('TO');
      if (k > 2) to = Number(this.evalExpr([w[k + 1]])) - 1;

      const prevTabix = this.variables['SY-TABIX'];
      const entry = {
        table: itab, index: from, pass: 0, prev: -1, waName, rec: r.rec, useHeader,
        match: idx => !where.length || this.evalRowWhere(itab[idx], where),
        next: idx => { for (let m = idx + 1; m < itab.length && m <= to; m++) if (entry.match(m)) return m; return -1; }
      };
      this.loopDepth++; this.repeatDepth++;
      this.loopStack.push(entry);
      try {
        for (entry.index = from; entry.index < itab.length && entry.index <= to; entry.index++) {
          const n = entry.index;
          if (!entry.match(n)) continue;
          entry.pass++;
          this.setSy('TABIX', n + 1);
          if (waName) this.assignTo(waName, itab[n], t);
          if (useHeader) r.rec.header = this.clone(itab[n]);
          if (fsName) this.bindFieldSymbol(fsName, itab, n, lineDesc);
          if (refName) this.assignTo(refName, new DataRef(this.rowRec(itab, n, lineDesc)), t);
          const res = this.runBody(tokens, start + 1, end - 1);
          entry.prev = entry.index;
          if (res === 'break') break;
        }
      } finally {
        this.loopStack.pop();
        this.loopDepth--; this.repeatDepth--;
      }
      if (this.loopDepth > 0 && prevTabix) this.variables['SY-TABIX'] = prevTabix;
      this.setSy('SUBRC', entry.pass ? 0 : 4);
      return span;
    }

    // Groups of LOOP AT ... GROUP BY / FOR GROUPS: [{ key, rows, idx }] in the order of first appearance, or sorted.
    // keyToks is one expression (wa-comp) or ( k1 = wa-c1 k2 = wa-c2 size = GROUP SIZE index = GROUP INDEX )
    buildGroups(items, bind, keyToks, order) {
      const struct = keyToks[0] === '(';
      const pairs = struct ? this.parsePairs(keyToks.slice(1, -1)) : null;
      const special = v => isObj(v) && v.__group;
      const groups = [], byKey = new Map();
      for (const it of items) {
        bind(it);
        let key, id;
        if (struct) {
          key = {};
          for (const [name, toks] of pairs) {
            const T = toks.map(U).join(' ');
            key[name] = T === 'GROUP SIZE' ? { __group: 'size' } : T === 'GROUP INDEX' ? { __group: 'index' } : this.clone(this.evalExpr(toks));
          }
          id = JSON.stringify(Object.keys(key).filter(k => !special(key[k])).map(k => key[k]));
        } else {
          key = this.clone(this.evalExpr(keyToks));
          id = JSON.stringify(key);
        }
        let g = byKey.get(id);
        if (!g) { g = { key, rows: [], idx: [] }; byKey.set(id, g); groups.push(g); }
        g.rows.push(it.row); g.idx.push(it.index);
      }
      if (order) {
        const parts = g => (struct ? Object.keys(g.key).filter(k => !special(g.key[k])).map(k => g.key[k]) : [g.key]);
        groups.sort((a, b) => {
          const x = parts(a), y = parts(b);
          for (let k = 0; k < x.length; k++) { const c = this.cmpValues(x[k], y[k]); if (c) return order === 'DESCENDING' ? -c : c; }
          return 0;
        });
      }
      groups.forEach((g, pos) => {
        if (!struct) return;
        for (const k of Object.keys(g.key)) if (special(g.key[k])) g.key[k] = g.key[k].__group === 'size' ? g.rows.length : pos + 1;
      });
      return groups;
    }

    // LOOP AT itab INTO wa [WHERE ...] GROUP BY key [ASCENDING | DESCENDING] [WITHOUT MEMBERS] [INTO grp | ASSIGNING <grp>]
    execLoopGroups(tokens, start, end, L) {
      const { t, w, up, itab, lineDesc, where, gi } = L;
      const span = end - start + 1;
      const lv = this.levels(w);
      let ke = gi + 2;
      while (ke < w.length && !(lv[ke] === lv[gi] && ['ASCENDING', 'DESCENDING', 'WITHOUT', 'INTO', 'ASSIGNING', 'REFERENCE'].includes(up[ke]))) ke++;
      const keyToks = w.slice(gi + 2, ke);
      const tail = up.slice(ke);
      const order = tail.includes('DESCENDING') ? 'DESCENDING' : tail.includes('ASCENDING') ? 'ASCENDING' : null;
      let grpName = null, grpFs = null;
      for (let k = ke; k < w.length; k++) {
        if (up[k] === 'INTO') grpName = this.targetName(w, k + 1);
        if (up[k] === 'ASSIGNING') grpFs = this.targetName(w, k + 1);
      }
      const bindRow = (row, pos) => {
        if (L.waName) this.assignTo(L.waName, row, t);
        if (L.fsName) this.bindFieldSymbol(L.fsName, itab, pos, lineDesc);
        if (L.refName) this.assignTo(L.refName, new DataRef(this.rowRec(itab, pos, lineDesc)), t);
      };
      const items = [];
      itab.forEach((row, pos) => { if (!where.length || this.evalRowWhere(row, where)) items.push({ row, index: pos }); });
      const groups = this.buildGroups(items, it => bindRow(it.row, it.index), keyToks, order);

      const prevTabix = this.variables['SY-TABIX'];
      const names = [grpName, grpFs, L.waName, L.fsName].filter(Boolean).map(U);
      const savedMembers = names.map(nm => this.groupMembers[nm]);
      this.loopDepth++; this.repeatDepth++;
      try {
        for (const g of groups) {
          this.setSy('TABIX', g.idx[0] + 1);
          const members = { rows: g.rows, lineDesc };
          if (grpName || grpFs) {
            if (grpName) this.assignTo(grpName, g.key, t);
            if (grpFs) this.bindFieldSymbol(grpFs, [g.key], 0, null);
            this.groupMembers[U(grpName || grpFs)] = members;
          } else {
            bindRow(g.rows[0], g.idx[0]);            // representative binding: the first row stands for its group
            if (L.waName) this.groupMembers[U(L.waName)] = members;
            if (L.fsName) this.groupMembers[U(L.fsName)] = members;
          }
          if (this.runBody(tokens, start + 1, end - 1) === 'break') break;
        }
      } finally {
        this.loopDepth--; this.repeatDepth--;
        names.forEach((nm, k) => { if (savedMembers[k] === undefined) delete this.groupMembers[nm]; else this.groupMembers[nm] = savedMembers[k]; });
      }
      if (this.loopDepth > 0 && prevTabix) this.variables['SY-TABIX'] = prevTabix;
      this.setSy('SUBRC', groups.length ? 0 : 4);
      return span;
    }

    // ── PERFORM ───────────────────────────────────────────
    execPerform(t) {
      const w = t.words;
      const name = U(w[1]);
      const form = this.forms[name];
      if (!form) {
        this.problem(t, `PERFORM: FORM "${name}" tidak ditemukan di program ini`, 'error');
        return;
      }
      if (this.callStack.length >= 200) throw { message: `PERFORM "${name}": pemanggilan terlalu dalam (rekursi tanpa akhir?)`, line: t.lineNo };

      // Actual parameters, in the order TABLES / USING / CHANGING
      const actuals = [];
      for (let i = 2; i < w.length; i++) {
        const X = U(w[i]);
        if (X === 'TABLES' || X === 'USING' || X === 'CHANGING') continue;
        if (X === 'IN' && U(w[i + 1]) === 'PROGRAM') { i += 2; continue; }
        if (X === 'IF' && U(w[i + 1]) === 'FOUND') { i++; continue; }
        if (w[i] === '-' && isNum(w[i + 1])) { actuals.push('-' + w[++i]); continue; }
        actuals.push(w[i]);
      }
      if (actuals.length !== form.formals.length) {
        this.problem(t, `PERFORM ${name}: jumlah parameter aktual (${actuals.length}) berbeda dengan definisi FORM (${form.formals.length})`, 'error');
      }

      // Resolve all actuals before binding (a formal may have the same name as a global)
      const frame = { name, saved: {} };
      const writeBack = [];
      const bound = form.formals.map((f, idx) => {
        const a = actuals[idx];
        if (a === undefined) return { f, rec: { type: 'any', value: '' } };
        const A = U(a).replace(/^@/, '').replace(/\[\]$/, '');
        const direct = this.variables[A];
        if (direct && !f.byValue) return { f, rec: direct };                    // pass by reference
        if (direct) return { f, rec: { type: direct.type, value: this.clone(direct.value), desc: direct.desc } };
        const r = this.ref(A);                                                   // struct component
        const value = this.clone(r ? r.get() : this.evalExpr([a]));
        const rec = { type: this.typeLabelOf(value), value, desc: r ? r.desc : undefined };
        if (r && !f.byValue) writeBack.push({ r, rec });
        return { f, rec };
      });
      for (const { f, rec } of bound) {
        if (!(f.name in frame.saved)) frame.saved[f.name] = this.variables[f.name];
        this.variables[f.name] = rec;
      }

      const savedLoopDepth = this.loopDepth, savedLoopStack = this.loopStack;
      this.loopDepth = 0; this.loopStack = [];
      this.frames.push(frame);
      this.callStack.push(name);
      try {
        this.execute(form.tokens, form.start, form.end);
      } catch (e) {
        if (!(e && e.signal === 'RETURN')) throw e;
      } finally {
        this.callStack.pop();
        this.frames.pop();
        this.loopDepth = savedLoopDepth; this.loopStack = savedLoopStack;
        for (const { r, rec } of writeBack) r.set(rec.value);
        for (const N of Object.keys(frame.saved)) {
          if (frame.saved[N] === undefined) delete this.variables[N];
          else this.variables[N] = frame.saved[N];
        }
      }
    }

    // ── MESSAGE ───────────────────────────────────────────
    // MESSAGE 'text' TYPE 'I' [DISPLAY LIKE 'E'] | MESSAGE e001(zmsg) [WITH v1 v2] | MESSAGE ID id TYPE t NUMBER n
    // [RAISING exc] [INTO text].   Types E, A and X end the program, as in SAP.
    execMessage(t) {
      const w = t.words, up = w.map(U);
      const typeIdx = up.indexOf('TYPE'), withIdx = up.indexOf('WITH'), raiseIdx = up.indexOf('RAISING');
      const intoIdx = up.indexOf('INTO'), likeIdx = up.indexOf('LIKE');
      const stops = [typeIdx, withIdx, raiseIdx, intoIdx, up.indexOf('DISPLAY'), up.indexOf('NUMBER')].filter(k => k > 0);
      const until = k => Math.min(w.length, ...stops.filter(s => s > k));
      const one = tok => this.formatOut(this.evalExpr([tok]));

      let msgType = 'I', text = '';
      if (up[1] === 'ID') {
        const ni = up.indexOf('NUMBER');
        if (typeIdx !== -1) msgType = U(one(w[typeIdx + 1]));
        text = `Message ${one(w[2])} ${ni !== -1 ? one(w[ni + 1]) : ''}`.trim();
      } else if (/^[AEISWX]\d{3}(\(\w+\))?$/i.test(w[1] || '')) {
        msgType = w[1][0].toUpperCase();
        text = `Message ${U(w[1].slice(1))}` + (w[2] === '(' ? `(${U(w[3])})` : '');
      } else {
        const seg = w.slice(1, until(0));
        if (seg.length) text = this.formatOut(this.evalExpr(seg));
        if (typeIdx !== -1) msgType = U(one(w[typeIdx + 1]));
      }
      if (withIdx !== -1) text += ' ' + w.slice(withIdx + 1, until(withIdx)).map(one).join(' ');
      text = text.trim();

      if (intoIdx !== -1 && w[intoIdx + 1]) {                 // MESSAGE ... INTO lv_text: no output
        this.assignTo(this.targetName(w, intoIdx + 1), text, t);
        return;
      }
      const shown = likeIdx !== -1 ? U(one(w[likeIdx + 1])) : msgType;
      const cls = ['E', 'A', 'X'].includes(shown) ? 'error' : shown === 'W' ? 'warning' : 'info';
      this.output.push({ text: `📢 MESSAGE ${msgType}: ${text}`, cls });

      if (raiseIdx !== -1 && w[raiseIdx + 1]) throw { fmException: U(w[raiseIdx + 1]) };
      if (['E', 'A', 'X'].includes(msgType)) {
        this.output.push({
          cls: 'error',
          text: this.selScreenPhase
            ? '⛔ Pesan error di AT SELECTION-SCREEN: pengguna dikembalikan ke selection screen, program tidak dijalankan.'
            : `⛔ Program dihentikan oleh MESSAGE tipe ${msgType}.`
        });
        throw { signal: 'END' };
      }
    }

    // ── CALL FUNCTION ─────────────────────────────────────
    // "EXPORTING a = 1 b = x TABLES t = itab EXCEPTIONS e = 1 OTHERS = 2"
    //   -> { EXPORTING: { A: [words], B: [words] }, TABLES: {...}, EXCEPTIONS: {...} }
    parseCallParams(w, from, defaultSection = null) {
      const out = { EXPORTING: {}, IMPORTING: {}, TABLES: {}, CHANGING: {}, EXCEPTIONS: {}, RECEIVING: {} };
      const isSection = k => CALL_SECTIONS.has(U(w[k])) && w[k + 1] !== '=';
      let sec = defaultSection;
      for (let i = from; i < w.length; i++) {
        if (isSection(i)) { sec = U(w[i]); continue; }
        if (!sec || w[i + 1] !== '=') continue;
        const name = U(w[i]);
        const val = [];
        let j = i + 2, depth = 0;
        while (j < w.length) {
          if (depth === 0 && (isSection(j) || w[j + 1] === '=' || w[j] === ')')) break;
          if (w[j] === '(') depth++;
          if (w[j] === ')') depth--;
          val.push(w[j++]);
        }
        out[sec][name] = val;
        i = j - 1;
      }
      return out;
    }

    makeCall(fn, params, t) {
      const self = this;
      return {
        fn, t, params,
        has: name => name in params.EXPORTING || name in params.TABLES || name in params.CHANGING || name in params.IMPORTING,
        // value passed to an importing parameter of the function (EXPORTING ... in the caller)
        exp(name, dflt) {
          const src = params.EXPORTING[name] || params.CHANGING[name] || params.TABLES[name];
          return src ? self.evalExpr(src) : dflt;
        },
        // write a result back to the caller (IMPORTING / CHANGING ... in the caller)
        imp(name, value) {
          const a = params.IMPORTING[name] || params.CHANGING[name];
          if (!a || !a.length) return;
          const target = self.targetName(a, 0);
          if (/^@?(DATA|FINAL)$/i.test(a[0]) && a[1] === '(' && !self.ref(target)) self.declareVar(target, self.inferDesc(value), self.clone(value));
          else self.assignTo(target, value, t);
        },
        // internal table passed via TABLES / CHANGING -> { arr, desc, name }
        table(name) {
          const a = params.TABLES[name] || params.CHANGING[name] || params.EXPORTING[name];
          if (!a || !a.length) return null;
          const tab = self.tableRef(a[0], t, `CALL FUNCTION '${fn}' (${name.toLowerCase()})`);
          return tab ? { arr: tab.arr, desc: tab.desc, name: U(a[0]).replace(/\[\]$/, '') } : null;
        },
        raise(exc) { throw { fmException: exc }; }
      };
    }

    execCallFunction(t) {
      const w = t.words;
      const fn = U(this.evalExpr([w[2]]));
      const params = this.parseCallParams(w, 3);
      const uf = this.userFunctions[fn];
      const impl = this.functionModules()[fn] || this.lockModule(fn);
      this.setSy('SUBRC', 0);

      if (!uf && !impl) {
        this.problem(t, `Function module "${fn}" belum disimulasikan — pemanggilan dilewati (sy-subrc = 0). ` +
          'Daftar function module yang tersedia ada di menu Docs → Function Module.', 'warning');
        this.output.push({ text: `[FM] ${fn} — belum disimulasikan, dilewati`, cls: 'warning' });
        return;
      }

      try {
        const call = this.makeCall(fn, params, t);
        if (uf) this.invokeFunction(uf, call, t);
        else impl.call(this, call);
        this.setSy('SUBRC', 0);
      } catch (e) {
        if (!(e && e.fmException)) throw e;
        const ex = params.EXCEPTIONS;
        const key = e.fmException in ex ? e.fmException : ('OTHERS' in ex ? 'OTHERS' : null);
        if (key === null) {
          throw { message: `Function module ${fn} menaikkan exception ${e.fmException} yang tidak ditangani di EXCEPTIONS (di SAP: short dump RAISE_EXCEPTION)`, line: t.lineNo };
        }
        this.setSy('SUBRC', Number(this.evalExpr(ex[key])) || 0);
      }
    }

    // Library of simulated function modules. Each entry receives the call object
    // built by makeCall(): exp(name) reads an input, imp(name, v) returns a value,
    // table(name) gives the internal table, raise(name) triggers an EXCEPTION.
    functionModules() {
      if (this._fms) return this._fms;
      const info = text => this.output.push({ text, cls: 'info' });
      const toDate = s => {
        const m = /^(\d{4})(\d{2})(\d{2})$/.exec(String(s === undefined ? '' : s).trim());
        if (!m) return null;
        const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
        return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? d : null;
      };
      const fromDate = d => `${d.getUTCFullYear()}`.padStart(4, '0') + `${d.getUTCMonth() + 1}`.padStart(2, '0') + `${d.getUTCDate()}`.padStart(2, '0');
      const targetLen = (c, name, dflt) => {
        const a = c.params.IMPORTING[name];
        const r = a && this.ref(a[0]);
        return (r && r.desc && r.desc.len) || dflt;
      };

      this._fms = {
        // ── ALV ──
        REUSE_ALV_GRID_DISPLAY:     c => this.fmAlvDisplay(c, false),
        REUSE_ALV_LIST_DISPLAY:     c => this.fmAlvDisplay(c, false),
        REUSE_ALV_GRID_DISPLAY_LVC: c => this.fmAlvDisplay(c, true),
        REUSE_ALV_FIELDCATALOG_MERGE: c => this.fmFieldcatMerge(c, false),
        LVC_FIELDCATALOG_MERGE:       c => this.fmFieldcatMerge(c, true),
        // header lines above the grid; called from the FORM given in i_callback_top_of_page
        REUSE_ALV_COMMENTARY_WRITE: c => {
          const tab = c.table('IT_LIST_COMMENTARY');
          const lines = (tab ? tab.arr : []).filter(isObj).map(r => ({ typ: U(r.TYP || 'S'), key: this.formatOut(r.KEY), info: this.formatOut(r.INFO) }));
          if (this.alvCommentary) this.alvCommentary.push(...lines);
          else for (const l of lines) info(`${l.key ? l.key + ' ' : ''}${l.info}`);
        },
        // list of the ALV events; the program then enters its FORM names
        REUSE_ALV_EVENTS_GET: c => {
          const lineDesc = this.resolveNamed('SLIS_ALV_EVENT');
          const rows = ['TOP_OF_PAGE', 'END_OF_PAGE', 'TOP_OF_LIST', 'END_OF_LIST', 'USER_COMMAND', 'PF_STATUS_SET', 'DATA_CHANGED']
            .map(NAME => Object.assign(this.initValue(lineDesc), { NAME }));
          c.imp('ET_EVENTS', rows);
        },

        // ── Conversion exits ──
        CONVERSION_EXIT_ALPHA_INPUT: c => {
          const input = String(c.exp('INPUT', '')).trim();
          const len = targetLen(c, 'OUTPUT', Math.max(10, input.length));
          c.imp('OUTPUT', /^\d+$/.test(input) ? input.padStart(len, '0') : input);
        },
        CONVERSION_EXIT_ALPHA_OUTPUT: c => {
          const input = String(c.exp('INPUT', '')).trim();
          c.imp('OUTPUT', /^\d+$/.test(input) ? (input.replace(/^0+/, '') || '0') : input);
        },

        // ── Dialogs ──
        POPUP_TO_CONFIRM: c => {
          const title = c.exp('TITLEBAR', ''), question = c.exp('TEXT_QUESTION', '');
          let answer = String(c.exp('DEFAULT_BUTTON', '1'));
          if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
            answer = window.confirm(`${title ? title + '\n\n' : ''}${question}`) ? '1' : '2';
          }
          info(`[POPUP] ${title ? title + ': ' : ''}${question} → jawaban '${answer}' (${answer === '1' ? 'Ya' : answer === '2' ? 'Tidak' : 'Batal'})`);
          c.imp('ANSWER', answer);
        },
        POPUP_TO_INFORM: c => {
          info(`[POPUP] ${[c.exp('TITEL', ''), c.exp('TXT1', ''), c.exp('TXT2', ''), c.exp('TXT3', ''), c.exp('TXT4', '')].filter(x => x !== '').join(' | ')}`);
        },
        SAPGUI_PROGRESS_INDICATOR: c => {
          info(`⏳ ${c.exp('PERCENTAGE', 0)}% ${c.exp('TEXT', '')}`);
        },

        // ── Files ──
        GUI_DOWNLOAD: c => {
          const tab = c.table('DATA_TAB');
          if (!tab) c.raise('NO_AUTHORITY');
          const file = c.exp('FILENAME', '');
          if (!file) c.raise('FILE_WRITE_ERROR');
          info(`[GUI_DOWNLOAD] ${tab.arr.length} baris dari ${tab.name} → ${file} (simulasi: file tidak benar-benar ditulis)`);
          c.imp('FILELENGTH', JSON.stringify(tab.arr).length);
        },
        GUI_UPLOAD: c => {
          info(`[GUI_UPLOAD] ${c.exp('FILENAME', '')} — simulator tidak punya akses file`);
          c.raise('FILE_OPEN_ERROR');
        },

        // ── Dates ──
        DATE_COMPUTE_DAY: c => {
          const d = toDate(c.exp('DATE'));
          if (!d) c.raise('OTHERS');
          c.imp('DAY', String(d.getUTCDay() === 0 ? 7 : d.getUTCDay()));   // 1 = Monday ... 7 = Sunday
        },
        DATE_CHECK_PLAUSIBILITY: c => {
          if (!toDate(c.exp('DATE'))) c.raise('PLAUSIBILITY_CHECK_FAILED');
        },
        RP_LAST_DAY_OF_MONTHS: c => {
          const d = toDate(c.exp('DAY_IN'));
          if (!d) c.raise('DAY_IN_NO_DATE');
          c.imp('LAST_DAY_OF_MONTH', fromDate(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0))));
        },
        RP_CALC_DATE_IN_INTERVAL: c => {
          const d = toDate(c.exp('DATE'));
          if (!d) c.raise('OTHERS');
          const sign = String(c.exp('SIGNUM', '+')).trim() === '-' ? -1 : 1;
          const res = new Date(Date.UTC(
            d.getUTCFullYear() + sign * Number(c.exp('YEARS', 0)),
            d.getUTCMonth() + sign * Number(c.exp('MONTHS', 0)),
            d.getUTCDate() + sign * Number(c.exp('DAYS', 0))));
          c.imp('CALC_DATE', fromDate(res));
        },

        // ── BAPI helpers ──
        BAPI_TRANSACTION_COMMIT:   () => { this.dbCommitted = this.clone(this.dbCopy); info('[BAPI] COMMIT WORK dijalankan (simulasi)'); },
        BAPI_TRANSACTION_ROLLBACK: () => { this.dbCopy = this.dbCommitted ? this.clone(this.dbCommitted) : {}; info('[BAPI] ROLLBACK WORK dijalankan (simulasi)'); },
        // read BAPIs: they never raise exceptions, problems are reported in the RETURN parameter
        BAPI_MATERIAL_GET_DETAIL: c => {
          const matnr = this.formatOut(c.exp('MATERIAL', '')).trim();
          const same = r => String(r.MATNR).trim() === matnr;
          const mara = (this.dbTable('MARA') || []).find(same);
          const ret = this.initValue(this.resolveNamed('BAPIRETURN'));
          if (!mara) {
            Object.assign(ret, { TYPE: 'E', CODE: 'MM305', MESSAGE: `Material ${matnr} does not exist` });
          } else {
            const texts = (this.dbTable('MAKT') || []).filter(same);
            const makt = texts.find(r => r.SPRAS === 'EN') || texts[0];
            c.imp('MATERIAL_GENERAL_DATA', Object.assign(this.initValue(this.resolveNamed('BAPIMATDOA')), {
              MATL_DESC: makt ? makt.MAKTX : '', MATL_TYPE: mara.MTART, IND_SECTOR: mara.MBRSH, MATL_GROUP: mara.MATKL,
              BASE_UOM: mara.MEINS, GROSS_WT: mara.BRGEW, NET_WEIGHT: mara.NTGEW, UNIT_OF_WT: mara.GEWEI,
              CREATED_ON: mara.ERSDA, CREATED_BY: mara.ERNAM
            }));
          }
          c.imp('RETURN', ret);
        },
        BAPI_FLIGHT_GETLIST: c => {
          const airline = U(this.formatOut(c.exp('AIRLINE', '')).trim());
          const max = Number(c.exp('MAX_ROWS', 0)) || 0;
          const out = c.table('FLIGHT_LIST'), ret = c.table('RETURN');
          const scarr = this.dbTable('SCARR') || [], spfli = this.dbTable('SPFLI') || [];
          let rows = (this.dbTable('SFLIGHT') || []).filter(fl => !airline || fl.CARRID === airline);
          if (max) rows = rows.slice(0, max);
          if (out) {
            const line = this.resolveNamed('BAPISFLDAT');
            out.arr.length = 0;
            for (const fl of rows) {
              const p = spfli.find(x => x.CARRID === fl.CARRID && x.CONNID === fl.CONNID) || {};
              const a = scarr.find(x => x.CARRID === fl.CARRID) || {};
              out.arr.push(Object.assign(this.initValue(line), {
                AIRLINEID: fl.CARRID, AIRLINE: a.CARRNAME || '', CONNECTID: fl.CONNID, FLIGHTDATE: fl.FLDATE,
                AIRPORTFR: p.AIRPFROM || '', CITYFROM: p.CITYFROM || '', AIRPORTTO: p.AIRPTO || '', CITYTO: p.CITYTO || '',
                DEPTIME: p.DEPTIME || '', ARRTIME: p.ARRTIME || '', PRICE: fl.PRICE, CURR: fl.CURRENCY
              }));
            }
          }
          if (ret) {
            ret.arr.length = 0;
            ret.arr.push(Object.assign(this.initValue(this.resolveNamed('BAPIRET2')), rows.length
              ? { TYPE: 'S', ID: 'BC_IBF', NUMBER: '000', MESSAGE: 'Method was executed successfully' }
              : { TYPE: 'E', ID: 'BC_IBF', NUMBER: '150', MESSAGE: `No flights found for airline ${airline}` }));
          }
        },

        // ── Number ranges ──
        NUMBER_GET_NEXT: c => {
          const object = U(this.formatOut(c.exp('OBJECT', '')).trim());
          if (!object) c.raise('OBJECT_NOT_FOUND');
          const key = object + '|' + this.formatOut(c.exp('NR_RANGE_NR', '01')).trim();
          const next = (this.numberRanges[key] || 0) + 1;
          this.numberRanges[key] = next;
          c.imp('NUMBER', next);
          c.imp('RETURNCODE', '');
        }
      };
      return this._fms;
    }

    // ENQUEUE_<object> / DEQUEUE_<object>: lock entries of this run. A value listed in window.ABAP_LOCKS
    // is "being edited by another user": asking for a lock on it raises FOREIGN_LOCK (sy-msgv1 = that user).
    lockModule(fn) {
      const m = /^(EN|DE)QUEUE_(.+)$/.exec(fn);
      if (!m) return null;
      return c => {
        if (fn === 'DEQUEUE_ALL') { this.locks.clear(); return; }
        const args = Object.keys(c.params.EXPORTING).filter(k => !k.startsWith('_') && !/^(MODE_|X_)/.test(k)).sort()
          .map(k => this.formatOut(c.exp(k, '')).trim()).filter(v => v !== '');
        const key = m[2] + '|' + args.join('|');
        if (m[1] === 'DE') { this.locks.delete(key); return; }
        const foreign = ((typeof window !== 'undefined' && window.ABAP_LOCKS) || []).find(l => args.includes(String(l.value)));
        if (foreign) {
          this.variables['SY-MSGV1'] = { type: 'string', value: foreign.user };
          c.raise('FOREIGN_LOCK');
        }
        this.locks.set(key, 'DEVELOPER');
      };
    }

    // ── ABAP Unit ─────────────────────────────────────────
    // cl_abap_unit_assert=>assert_...( ): inside a test run a failed check ends the test method
    unitAssert(M, argWords, t) {
      const call = this.parseArgs(argWords);
      const P = call.params.EXPORTING;
      const has = k => k in P;
      const val = (k, dflt) => (has(k) ? this.evalExpr(P[k]) : dflt);
      let act = has('ACT') ? val('ACT') : (call.positional ? this.evalExpr(call.positional) : undefined);
      const deep = v => Array.isArray(v) || isObj(v);
      const same = (a, b) => (deep(a) || deep(b) ? JSON.stringify(a) === JSON.stringify(b) : this.compare(a, '=', b));
      const truthy = v => v === true || v === 'X' || v === 'x';
      const show = v => (v === undefined ? '' : Array.isArray(v) ? `[${v.length}]` : isObj(v) ? JSON.stringify(v) : this.formatOut(v));
      let ok = true, exp;
      switch (M) {
        case 'ASSERT_EQUALS': exp = val('EXP'); ok = same(act, exp); break;
        case 'ASSERT_DIFFERS': exp = val('EXP'); ok = !same(act, exp); break;
        case 'ASSERT_TRUE': exp = 'X'; ok = truthy(act); break;
        case 'ASSERT_FALSE': exp = ''; ok = !truthy(act); break;
        case 'ASSERT_INITIAL': ok = this.isInitial(act, null); break;
        case 'ASSERT_NOT_INITIAL': ok = !this.isInitial(act, null); break;
        case 'ASSERT_BOUND': ok = act !== null && act !== undefined && act !== ''; break;
        case 'ASSERT_NOT_BOUND': ok = act === null || act === undefined || act === ''; break;
        case 'ASSERT_SUBRC': exp = val('EXP', 0); if (!has('ACT')) act = this.evalAtom('sy-subrc'); ok = this.compare(act, '=', exp); break;
        case 'ASSERT_TABLE_CONTAINS': { const line = val('LINE'), tab = val('TABLE', []); act = line; ok = Array.isArray(tab) && tab.some(r => same(r, line)); break; }
        case 'ASSERT_TABLE_NOT_CONTAINS': { const line = val('LINE'), tab = val('TABLE', []); act = line; ok = !(Array.isArray(tab) && tab.some(r => same(r, line))); break; }
        case 'ASSERT_NUMBER_BETWEEN': { act = val('NUMBER', 0); const x = this.num(act); ok = x >= this.num(val('LOWER', 0)) && x <= this.num(val('UPPER', 0)); break; }
        case 'FAIL': ok = false; if (!has('MSG') && call.positional) P.MSG = call.positional; act = ''; break;      // fail( 'text' ): the text is the message
        default:
          this.problem(t, `cl_abap_unit_assert=>${M.toLowerCase()}( ) belum disimulasikan — dilewati`, 'warning');
          return '';
      }
      if (ok) { if (this.unitRun) this.unitRun.current.asserts++; return ''; }
      const failure = { kind: 'assert', assert: M, msg: has('MSG') ? this.formatOut(val('MSG')) : '', act: show(act), exp: show(exp), hasExp: exp !== undefined, line: (t && t.lineNo) || this.curLine };
      if (this.unitRun) { this.unitRun.current.failures.push(failure); throw { unitFail: true }; }
      this.problem(t, `cl_abap_unit_assert=>${M.toLowerCase()}( ): pemeriksaan gagal${failure.msg ? ' — ' + failure.msg : ''} (test class dijalankan lewat menu Unit Test, bukan lewat Run)`, 'warning');
      return 'X';
    }

    // Run every METHODS ... FOR TESTING of the classes declared FOR TESTING: a fresh object per test method,
    // with setup / teardown around it (class_setup / class_teardown once per class).
    runUnitTests(code) {
      this.reset();
      this.source = String(code || '');
      const report = { classes: [], total: 0, failed: 0 };
      this.guard(() => {
        this.prepare(this.source);
        this.hoistDeclarations();
        this.runEvent('LOAD-OF-PROGRAM');
        for (const name of Object.keys(this.classes)) {
          const cls = this.prepareClass(name);
          if (!cls || !cls.testing || !cls.def) continue;
          const head = cls.def.tokens[cls.def.from - 1] || null;
          const tests = Object.keys(cls.sigs).filter(k => cls.sigs[k].testing);
          const cr = { name, methods: [] };
          report.classes.push(cr);
          const callIf = (obj, mname) => {
            const m = this.findMethod(name, mname);
            if (m && m.impl) this.invokeMethod(m.sig && m.sig.static ? null : obj, m, this.parseArgs([]), head);
          };
          const guarded = (res, fn) => {
            try {
              fn();
            } catch (e) {
              if (e && e.unitFail) return;
              if (e && e.abapException) res.failures.push({ kind: 'exception', cls: e.abapException.cls, text: this.excText(e.abapException), line: this.curLine });
              else if (e && e.signal) res.failures.push({ kind: 'stopped', line: this.curLine });
              else res.failures.push({ kind: 'error', text: (e && (e.message || e.fmException)) || String(e), line: (e && e.line) || this.curLine });
            }
          };
          const classRes = { name: '', failures: [], asserts: 0 };
          this.unitRun = { current: classRes };
          guarded(classRes, () => callIf(null, 'CLASS_SETUP'));
          for (const mname of tests) {
            const impl = cls.impls[mname];
            const res = { name: mname, failures: classRes.failures.slice(), asserts: 0, line: impl ? impl.line : 0 };
            this.unitRun = { current: res };
            let obj = null;
            if (!res.failures.length) {
              guarded(res, () => {
                obj = this.instantiate(name, this.parseArgs([]), head);
                callIf(obj, 'SETUP');
                const m = this.findMethod(name, mname);
                if (m && m.impl) this.invokeMethod(obj, m, this.parseArgs([]), head);
                else res.failures.push({ kind: 'noimpl', line: res.line });
              });
              if (obj) guarded(res, () => callIf(obj, 'TEARDOWN'));
            }
            res.ok = !res.failures.length;
            cr.methods.push(res);
            report.total++;
            if (!res.ok) report.failed++;
          }
          this.unitRun = { current: classRes };
          guarded(classRes, () => callIf(null, 'CLASS_TEARDOWN'));
          this.unitRun = null;
        }
      });
      this.unitRun = null;
      return { tests: report, output: this.output, variables: this.variables, errors: this.errors, stats: this.runStats() };
    }

    // ── Run time type services (RTTS): type description objects ──
    rttiObject(desc, name) {
      const d = desc || { kind: 'elem', base: 'string' };
      const kindOf = x => (!x ? 'C' : x.kind === 'table' ? 'h' : x.kind === 'struct' ? 'u' : x.kind === 'ref' ? 'r'
        : ({ int: 'I', float: x.packed ? 'P' : 'F', char: 'C', numc: 'N', string: 'g', date: 'D', time: 'T' })[x.base] || 'C');
      const lenOf = x => (!x || x.kind !== 'elem' ? 0 : x.len || ({ int: 4, float: 8, date: 8, time: 6 })[x.base] || 0);
      const cls = d.kind === 'struct' ? 'CL_ABAP_STRUCTDESCR' : d.kind === 'table' ? 'CL_ABAP_TABLEDESCR' : d.kind === 'ref' ? 'CL_ABAP_REFDESCR' : 'CL_ABAP_ELEMDESCR';
      const o = new AbapObject(cls, ++this.objCount);
      const attr = (N, value, type) => { o.attrs[N] = { type: type || 'string', value, vis: 'PUBLIC', readonly: true }; };
      const rel = name || d.ddic || '';
      attr('TYPE_KIND', kindOf(d));
      attr('KIND', d.kind === 'struct' ? 'S' : d.kind === 'table' ? 'T' : d.kind === 'ref' ? 'R' : 'E');
      attr('LENGTH', lenOf(d), 'int');
      attr('DECIMALS', d.decimals || 0, 'int');
      attr('ABSOLUTE_NAME', '\\TYPE=' + (rel || '%_T00004S00000000'));
      if (d.kind === 'struct') {
        const rows = d.ddic && !DDIC_STRUCTS[d.ddic] ? (this.dbTable(d.ddic) || []) : [];
        const width = fname => rows.reduce((m, r) => Math.max(m, String(r[fname] === undefined ? '' : r[fname]).length), 0);
        attr('COMPONENTS', d.fields.map(fd => {
          const dbChar = rows.length && fd.desc && fd.desc.kind === 'elem' && fd.desc.base === 'string';      // text column of a database table
          return { NAME: fd.name, TYPE_KIND: dbChar ? 'C' : kindOf(fd.desc), LENGTH: dbChar ? (fd.desc.len || width(fd.name)) : lenOf(fd.desc), DECIMALS: (fd.desc && fd.desc.decimals) || 0 };
        }), 'table');
      }
      if (d.kind === 'table') attr('TABLE_KIND', d.tkind === 'SORTED' ? 'O' : d.tkind === 'HASHED' ? 'H' : 'S');
      Object.defineProperty(o, 'rtti', { value: { desc: d, name: rel }, enumerable: false });
      return o;
    }

    // cl_abap_typedescr=>describe_by_data( x ) / describe_by_name( 'NAME' ) / describe_by_data_ref( ref )
    rttiStatic(M, argWords, t) {
      const call = this.parseArgs(argWords);
      const toks = call.positional || Object.values(call.params.EXPORTING)[0] || [];
      if (M === 'DESCRIBE_BY_NAME') {
        const name = U(this.formatOut(this.evalExpr(toks)).trim());
        const d = this.resolveNamed(name);
        if (!d || d.unknown) { this.problem(t, `describe_by_name( ): tipe "${name}" tidak dikenal (di SAP: exception TYPE_NOT_FOUND)`, 'error'); return null; }
        return this.rttiObject(d, name);
      }
      if (M === 'DESCRIBE_BY_DATA' || M === 'DESCRIBE_BY_DATA_REF') {
        const r = toks.length === 1 ? this.ref(toks[0]) : null;
        let d = r ? r.desc : null;
        let v = r ? r.get() : this.evalExpr(toks);
        if (v instanceof DataRef && M === 'DESCRIBE_BY_DATA_REF') { d = v.rec.desc; v = v.rec.value; }
        if (!d || (d.kind === 'elem' && d.base === 'any')) {
          d = this.inferDesc(v);
          if (d.kind === 'elem' && d.base === 'any') d = { kind: 'elem', base: 'string' };
        }
        return this.rttiObject(d, d.ddic || '');
      }
      this.problem(t, `cl_abap_typedescr=>${M.toLowerCase()}( ) belum disimulasikan — dilewati`, 'warning');
      return null;
    }

    // methods of a type description object
    rttiCall(obj, M, argWords, t) {
      const d = obj.rtti.desc;
      const arg = () => { const c = this.parseArgs(argWords); const toks = c.positional || Object.values(c.params.EXPORTING)[0]; return toks ? this.evalExpr(toks) : ''; };
      switch (M) {
        case 'GET_RELATIVE_NAME': return obj.rtti.name;
        case 'IS_DDIC_TYPE': return d.ddic ? 'X' : '';
        case 'GET_COMPONENTS':
          return d.kind === 'struct' ? d.fields.map(fd => ({ NAME: fd.name, TYPE: this.rttiObject(fd.desc, ''), AS_INCLUDE: '', SUFFIX: '' })) : [];
        case 'GET_COMPONENT_TYPE': {
          const name = U(this.formatOut(arg()).trim());
          const fd = d.kind === 'struct' ? d.fields.find(x => x.name === name) : null;
          if (!fd) { this.problem(t, `get_component_type( ): struktur tidak punya komponen "${name}"`, 'error'); return null; }
          return this.rttiObject(fd.desc, '');
        }
        case 'GET_TABLE_LINE_TYPE': return d.kind === 'table' ? this.rttiObject(d.line, (d.line && d.line.ddic) || '') : null;
      }
      this.problem(t, `${obj.cls}->${M.toLowerCase()}( ) belum disimulasikan — dilewati`, 'warning');
      return '';
    }

    // ── ALV ───────────────────────────────────────────────
    fmAlvDisplay(c, lvc) {
      for (const sec of ['EXPORTING', 'IMPORTING', 'TABLES']) {
        for (const p of Object.keys(c.params[sec])) {
          if (!ALV_PARAMS.has(p)) this.problem(c.t, `${c.fn}: parameter "${p.toLowerCase()}" tidak dikenal (di SAP: short dump CALL_FUNCTION_PARM_UNKNOWN)`, 'warning');
        }
      }
      if (!c.params.TABLES.T_OUTTAB) {
        this.problem(c.t, `${c.fn}: parameter TABLES t_outtab wajib diisi dengan internal table yang akan ditampilkan`, 'error');
        c.raise('PROGRAM_ERROR');
      }
      const tab = c.table('T_OUTTAB');
      if (!tab) c.raise('PROGRAM_ERROR');

      const fcatName = lvc ? 'IT_FIELDCAT_LVC' : 'IT_FIELDCAT';
      const fcat = c.exp(fcatName);
      if (c.params.EXPORTING[fcatName] && !Array.isArray(fcat)) {
        this.problem(c.t, `${c.fn}: ${fcatName.toLowerCase()} harus berupa internal table field catalog (TYPE ${lvc ? 'lvc_t_fcat' : 'slis_t_fieldcat_alv'})`, 'error');
      }

      // callback FORMs: passed as names, or through it_events
      const formName = v => (typeof v === 'string' && v.trim() ? U(v.trim()) : null);
      let ucomm = formName(c.exp('I_CALLBACK_USER_COMMAND')), top = formName(c.exp('I_CALLBACK_TOP_OF_PAGE'));
      const events = c.exp('IT_EVENTS');
      if (Array.isArray(events)) {
        for (const e of events) {
          if (!isObj(e) || !formName(e.FORM)) continue;
          if (U(e.NAME) === 'USER_COMMAND') ucomm = formName(e.FORM);
          if (U(e.NAME) === 'TOP_OF_PAGE') top = formName(e.FORM);
        }
      }
      for (const [what, f] of [['i_callback_user_command', ucomm], ['i_callback_top_of_page', top]]) {
        if (f && !this.forms[f]) this.problem(c.t, `${c.fn}: ${what} = '${f}' tetapi FORM ${f.toLowerCase()} tidak ada di program`, 'error');
      }
      let header = null;
      if (top && this.forms[top]) {
        const saved = this.alvCommentary;
        this.alvCommentary = [];
        try {
          this.callForm(top, [], c.t);
          header = this.alvCommentary;
        } finally {
          this.alvCommentary = saved;
        }
      }

      const layout = c.exp(lvc ? 'IS_LAYOUT_LVC' : 'IS_LAYOUT');
      this.showAlv({
        t: c.t, mode: c.fn, tableName: tab.name, data: tab.arr,
        lineDesc: tab.desc && tab.desc.kind === 'table' ? tab.desc.line : null,
        fcat: Array.isArray(fcat) ? fcat : null,
        structName: c.exp('I_STRUCTURE_NAME'),
        layout: isObj(layout) ? layout : {},
        sort: c.exp(lvc ? 'IT_SORT_LVC' : 'IT_SORT'),
        title: c.exp('I_GRID_TITLE', ''),
        needCatalog: true,
        header,
        callback: ucomm && this.forms[ucomm] ? { form: ucomm } : null
      });
    }

    fmFieldcatMerge(c, lvc) {
      const name = U(c.exp('I_STRUCTURE_NAME', ''));
      if (!name) {
        this.problem(c.t, `${c.fn}: hanya i_structure_name yang didukung simulator (isi dengan nama tabel/struktur DDIC, mis. 'MARA')`, 'error');
        c.raise('PROGRAM_ERROR');
      }
      const d = this.resolveNamed(name);
      if (!d || d.kind !== 'struct') {
        this.problem(c.t, `${c.fn}: struktur "${name}" tidak ada di kamus data simulator. Tersedia: ${this.dbNames().join(', ')}`, 'error');
        c.raise('PROGRAM_ERROR');
      }
      const tab = c.table('CT_FIELDCAT');
      if (!tab) c.raise('PROGRAM_ERROR');
      const lineDesc = this.resolveNamed(lvc ? 'LVC_S_FCAT' : 'SLIS_FIELDCAT_ALV');
      const keys = DB_KEYS[name] || [];
      let pos = tab.arr.length;
      for (const f of d.fields) {
        const label = DDIC_LABELS[f.name] || f.name;
        const row = this.initValue(lineDesc);
        Object.assign(row, { COL_POS: ++pos, FIELDNAME: f.name, TABNAME: lvc ? '1' : '', OUTPUTLEN: Math.max(label.length, 10) });
        if (keys.includes(f.name)) row.KEY = 'X';
        if (f.name === 'MANDT') row.TECH = 'X';
        if (lvc) Object.assign(row, { REF_TABLE: name, REF_FIELD: f.name, SCRTEXT_L: label, SCRTEXT_M: label, SCRTEXT_S: label, REPTEXT: label });
        else Object.assign(row, { REF_TABNAME: name, REF_FIELDNAME: f.name, SELTEXT_L: label, SELTEXT_M: label, SELTEXT_S: label, REPTEXT_DDIC: label });
        tab.arr.push(row);
      }
    }

    // cl_salv_table=>factory( IMPORTING r_salv_table = lo_alv CHANGING t_table = itab ).
    execSalvFactory(t) {
      this.salvFactory(this.parseCallParams(t.words, 0), t);
    }

    // ── OO ABAP: local classes ────────────────────────────
    // Remember where class definitions / method implementations are
    collectClasses(tokens) {
      for (let i = 0; i < tokens.length; i++) {
        const w = tokens[i].words, kw = U(w[0]);
        if (kw !== 'CLASS' && kw !== 'INTERFACE') continue;
        const up = w.map(U);
        if (up.includes('DEFERRED') || up.includes('LOAD')) continue;
        const closeKw = kw === 'CLASS' ? 'ENDCLASS' : 'ENDINTERFACE';
        let end = i + 1;
        while (end < tokens.length && U(tokens[end].words[0]) !== closeKw) end++;
        const name = up[1];
        if (kw === 'INTERFACE') {
          this.interfaces[name] = { name, tokens, from: i + 1, to: end - 1, ready: false, sigs: {}, statics: {} };
        } else {
          const cls = this.classes[name] || (this.classes[name] = {
            name, super: null, def: null, impls: {}, sigs: {}, attrs: [], statics: {}, interfaces: [], ready: false
          });
          if (up[2] === 'DEFINITION') {
            const ii = up.indexOf('INHERITING');
            if (ii !== -1) cls.super = up[ii + 2];
            cls.abstract = up.includes('ABSTRACT');
            cls.createPrivate = up.includes('CREATE') && up[up.indexOf('CREATE') + 1] === 'PRIVATE';
            cls.testing = up.includes('TESTING') && up[up.indexOf('TESTING') - 1] === 'FOR';
            cls.def = { tokens, from: i + 1, to: end - 1 };
          } else {
            for (let k = i + 1; k < end; k++) {
              if (U(tokens[k].words[0]) !== 'METHOD') continue;
              let e = k + 1;
              while (e < end && U(tokens[e].words[0]) !== 'ENDMETHOD') e++;
              cls.impls[U(tokens[k].words[1])] = { tokens, start: k + 1, end: e - 1, line: tokens[k].lineNo };
              k = e;
            }
          }
        }
        i = end;
      }
    }

    // METHODS name [IMPORTING ...] [EXPORTING ...] [CHANGING ...] [RETURNING VALUE(r) TYPE t]
    parseMethodSig(w) {
      const up = w.map(U);
      const sig = { name: up[1], params: [], returning: null, redefinition: up.includes('REDEFINITION'), abstract: up.includes('ABSTRACT'),
        testing: up.includes('TESTING') && up[up.indexOf('TESTING') - 1] === 'FOR' };
      // METHODS on_x FOR EVENT evt OF cls IMPORTING p1 p2 sender
      const ei = up.indexOf('EVENT');
      if (ei > 1 && up[ei - 1] === 'FOR') sig.event = up[ei + 1];
      let sec = null, i = 2;
      while (i < w.length) {
        const X = up[i];
        if (['IMPORTING', 'EXPORTING', 'CHANGING', 'RETURNING'].includes(X)) { sec = X; i++; continue; }
        if (X === 'RAISING' || X === 'EXCEPTIONS') break;
        if (!sec) { i++; continue; }
        if (X === 'PREFERRED') { sig.preferred = up[i + 2]; i += 3; continue; }
        let name, byValue = false;
        if ((X === 'VALUE' || X === 'REFERENCE') && w[i + 1] === '(') { name = up[i + 2]; byValue = X === 'VALUE'; i += 4; }
        else { name = X; i++; }
        const specStart = i;
        if (up[i] === 'TYPE' || up[i] === 'LIKE') i = this.skipTypeSpec(w, i);
        const p = {
          name, kind: sec, byValue, optional: false,
          desc: i > specStart ? this.resolveTypeSpec(w.slice(specStart, i)) : { kind: 'elem', base: 'any' }
        };
        if (p.desc.kind === 'elem' && p.desc.generic) p.desc = { kind: 'elem', base: 'any' };   // TYPE c / TYPE n: any length
        if (up[i] === 'OPTIONAL') { p.optional = true; i++; }
        if (up[i] === 'DEFAULT') { p.optional = true; p.dflt = [w[i + 1]]; i += 2; }
        if (sec === 'RETURNING') sig.returning = p; else sig.params.push(p);
      }
      return sig;
    }

    prepareInterface(name) {
      const intf = this.interfaces[U(name)];
      if (!intf || intf.ready) return intf || null;
      intf.ready = true;
      for (let k = intf.from; k <= intf.to; k++) {
        const w = intf.tokens[k].words, kw = U(w[0]);
        if (kw === 'METHODS' || kw === 'CLASS-METHODS') {
          const sig = this.parseMethodSig(w);
          sig.static = kw === 'CLASS-METHODS'; sig.vis = 'PUBLIC';
          intf.sigs[sig.name] = sig;
        } else if (kw === 'CONSTANTS' || kw === 'CLASS-DATA') {
          const d = this.parseDecl(w);
          intf.statics[d.name] = { type: this.typeLabel(d.desc), value: d.value !== undefined ? d.value : this.initValue(d.desc), desc: d.desc, readonly: kw === 'CONSTANTS', vis: 'PUBLIC', owner: intf.name };
        } else if (kw === 'TYPES') {
          this.execTypes(intf.tokens[k]);
        }
      }
      return intf;
    }

    // Read the DEFINITION part on first use (types declared earlier are known by then)
    prepareClass(name) {
      const cls = this.classes[U(name)];
      if (!cls) return null;
      if (cls.ready) return cls;
      cls.ready = true;
      if (cls.super) this.prepareClass(cls.super);
      if (!cls.def) return cls;
      let vis = 'PUBLIC';
      for (let k = cls.def.from; k <= cls.def.to; k++) {
        const tk = cls.def.tokens[k], w = tk.words, kw = U(w[0]);
        if (kw === 'PUBLIC' || kw === 'PROTECTED' || kw === 'PRIVATE') { vis = kw; continue; }
        if (kw === 'DATA' || kw === 'CLASS-DATA' || kw === 'CONSTANTS') {
          if (!w[1] || U(w[1]) === 'BEGIN' || U(w[1]) === 'END') continue;
          const d = this.parseDecl(w);
          const readonly = kw === 'CONSTANTS' || w.some(x => U(x) === 'READ-ONLY');
          if (kw === 'DATA') cls.attrs.push({ name: d.name, desc: d.desc, value: d.value, vis, readonly: readonly && kw !== 'DATA' ? true : false, readOnlyOutside: readonly });
          else cls.statics[d.name] = { type: this.typeLabel(d.desc), value: d.value !== undefined ? d.value : this.initValue(d.desc), desc: d.desc, readonly: kw === 'CONSTANTS', vis, owner: cls.name };
        } else if (kw === 'METHODS' || kw === 'CLASS-METHODS') {
          const sig = this.parseMethodSig(w);
          sig.static = kw === 'CLASS-METHODS'; sig.vis = vis; sig.owner = cls.name;
          if (!sig.redefinition) cls.sigs[sig.name] = sig;
        } else if (kw === 'INTERFACES') {
          cls.interfaces.push(U(w[1]));
          this.prepareInterface(w[1]);
        } else if (kw === 'TYPES') {
          this.execTypes(tk);
        }
      }
      // static constructor
      if (cls.impls.CLASS_CONSTRUCTOR) this.invokeMethod(null, { name: 'CLASS_CONSTRUCTOR', cls: cls.name, impl: cls.impls.CLASS_CONSTRUCTOR, sig: null }, this.parseArgs([]), this.curT);
      return cls;
    }

    // [cls, superclass, ...] (local classes only)
    classChain(name) {
      const chain = [];
      let c = this.prepareClass(name);
      while (c && !chain.includes(c)) { chain.push(c); c = c.super ? this.prepareClass(c.super) : null; }
      return chain;
    }

    // Find the implementation of a method, starting at class `name` and walking up
    findMethod(name, methName) {
      const M = U(methName);
      const chain = this.classChain(name);
      const sigOf = (implName, from) => {
        if (implName.includes('~')) {
          const [intfName, m] = implName.split('~');
          const intf = this.prepareInterface(intfName);
          if (intf && intf.sigs[m]) return intf.sigs[m];
        }
        for (const c of from) if (c.sigs[implName]) return c.sigs[implName];
        // redefinition of a method of a standard class: get_text( ) of the exception classes returns RESULT
        if (/(^|~)GET_(LONG)?TEXT$/.test(implName)) {
          return { name: implName, params: [], returning: { name: 'RESULT', kind: 'RETURNING', desc: { kind: 'elem', base: 'string' } }, vis: 'PUBLIC' };
        }
        return null;
      };
      for (let k = 0; k < chain.length; k++) {
        const c = chain[k];
        let implName = c.impls[M] ? M : null;
        if (!implName && !M.includes('~')) implName = Object.keys(c.impls).find(x => x.endsWith('~' + M)) || null;   // interface method
        if (implName) return { name: implName, cls: c.name, impl: c.impls[implName], sig: sigOf(implName, chain.slice(k)) };
      }
      return null;
    }

    currentClass() {
      const fr = this.frames[this.frames.length - 1];
      return fr && fr.cls ? fr.cls : null;
    }

    canAccess(vis, owner) {
      if (!vis || vis === 'PUBLIC') return true;
      const cur = this.currentClass();
      if (!cur) return false;
      if (vis === 'PRIVATE') return cur === owner;
      return this.classChain(cur).some(c => c.name === owner);   // PROTECTED
    }

    // "meth( 5 )" -> positional;  "meth( a = 1 IMPORTING b = x )" -> named
    parseArgs(argWords) {
      const empty = () => ({ EXPORTING: {}, IMPORTING: {}, TABLES: {}, CHANGING: {}, EXCEPTIONS: {}, RECEIVING: {} });
      if (!argWords || !argWords.length) return { positional: null, params: empty() };
      const named = argWords[1] === '=' || CALL_SECTIONS.has(U(argWords[0]));
      if (!named) return { positional: argWords, params: empty() };
      return { positional: null, params: this.parseCallParams(argWords, 0, 'EXPORTING') };
    }

    excText(obj) {
      const tx = obj.attrs.TEXT || obj.attrs.MV_TEXT || obj.attrs.MESSAGE || obj.attrs.MV_MESSAGE;
      const v = tx ? this.formatOut(tx.value) : '';
      return v || `Exception ${obj.cls}`;
    }

    raiseSys(cls, text) {
      const o = new AbapObject(cls, ++this.objCount);
      o.attrs.TEXT = { type: 'string', value: text, vis: 'PUBLIC' };
      throw { abapException: o };
    }

    isExcInstance(obj, className) {
      const CN = U(className);
      if (CN === 'CX_ROOT') return true;
      let name = obj.cls, guard = 0;
      while (name && guard++ < 50) {
        if (name === CN) return true;
        name = (this.classes[name] && this.classes[name].super) || EXC_PARENT[name] || null;
      }
      return false;
    }

    // NEW cls( ... ) / CREATE OBJECT
    instantiate(clsName, call, t) {
      const N = U(clsName);
      if (N === '#') {
        this.problem(t, 'NEW #( ): class tidak bisa ditentukan dari target — tulis nama class-nya: NEW nama_class( )', 'error');
        return null;
      }
      const cls = this.prepareClass(N);
      if (!cls) {
        if (/^(Z|Y)?CX_/.test(N)) {
          // predefined exception class
          const o = new AbapObject(N, ++this.objCount);
          const tx = call.params.EXPORTING.TEXT || call.params.EXPORTING.TEXTID || call.positional;
          o.attrs.TEXT = { type: 'string', value: tx ? this.formatOut(this.evalExpr(tx)) : '', vis: 'PUBLIC' };
          return o;
        }
        if (/^(CL|ZCL|YCL|IF|ZIF)_/.test(N)) {
          // GUI containers / ALV grid: nothing to simulate until the grid is displayed
          if (!/^CL_(GUI|SALV)_/.test(N)) this.problem(t, `Class standar "${N}" tidak disimulasikan — objeknya hanya placeholder`, 'warning');
          return `(${N})`;
        }
        this.problem(t, `Class "${N}" tidak ditemukan (belum ada CLASS ${N.toLowerCase()} DEFINITION)`, 'error');
        return null;
      }
      if (cls.abstract) this.problem(t, `Class "${N}" bersifat ABSTRACT dan tidak boleh dibuat objeknya langsung`, 'error');
      if (cls.createPrivate && this.currentClass() !== N) {
        this.problem(t, `Class "${N}" dideklarasikan CREATE PRIVATE — objeknya hanya boleh dibuat di dalam class itu sendiri (biasanya lewat method static)`, 'error');
        return null;
      }

      const obj = new AbapObject(cls.name, ++this.objCount);
      for (const c of this.classChain(N).reverse()) {
        for (const a of c.attrs) {
          obj.attrs[a.name] = {
            type: this.typeLabel(a.desc), desc: a.desc, vis: a.vis, owner: c.name, readOnlyOutside: a.readOnlyOutside,
            value: a.value !== undefined ? this.clone(a.value) : this.initValue(a.desc)
          };
        }
      }
      const ctor = this.findMethod(N, 'CONSTRUCTOR');
      if (ctor) this.invokeMethod(obj, ctor, call, t);
      else if (call.positional || Object.keys(call.params.EXPORTING).length) {
        this.problem(t, `Class "${N}" tidak punya CONSTRUCTOR, tetapi parameter diberikan saat membuat objek`, 'error');
      }
      return obj;
    }

    // CREATE OBJECT lo [TYPE cls] [EXPORTING a = 1 ...]   /   CREATE DATA dref [TYPE t | LIKE x]
    execCreate(t) {
      const w = t.words, up = w.map(U);
      if (up[1] === 'DATA' && w[2]) {
        const spec = w.slice(3);
        const su = spec.map(U);
        let desc;
        if (su.includes('TYPE') || su.includes('LIKE')) {
          desc = this.resolveTypeSpec(spec);
        } else {
          const r = this.ref(w[2]);
          const target = r && r.desc && r.desc.kind === 'ref' ? r.desc.target : 'DATA';
          desc = target === 'DATA' ? { kind: 'elem', base: 'any' } : this.resolveNamed(target);
        }
        this.assignTo(w[2], new DataRef({ type: this.typeLabel(desc), value: this.initValue(desc), desc }), t);
        return;
      }
      if (up[1] !== 'OBJECT' || !w[2]) return;
      let stop = up.findIndex((x, idx) => idx > 2 && (x === 'TYPE' || (CALL_SECTIONS.has(x) && w[idx + 1] !== '=')));
      if (stop === -1) stop = w.length;
      const target = w.slice(2, stop);
      let cn = null;
      const ti = up.indexOf('TYPE');
      if (ti !== -1) cn = up[ti + 1];
      else if (target.length === 1) {
        const r = this.ref(target[0]);
        if (r && r.desc && r.desc.kind === 'ref') cn = r.desc.target;
      } else {
        const cur = this.resolveChain(target, t);
        if (cur.rec && cur.rec.desc && cur.rec.desc.kind === 'ref') cn = cur.rec.desc.target;
      }
      if (!cn) {
        this.problem(t, `CREATE OBJECT ${target.join('')}: tipe class tidak diketahui (deklarasikan dengan TYPE REF TO class)`, 'error');
        return;
      }
      const sec = up.findIndex((x, idx) => idx > 2 && CALL_SECTIONS.has(x) && w[idx + 1] !== '=');
      const call = { positional: null, params: this.parseCallParams(w, sec === -1 ? w.length : sec) };
      this.assignChain(target, this.instantiate(cn, call, t), t);
    }

    // Run a method. `m` comes from findMethod(); `call` from parseArgs().
    invokeMethod(obj, m, call, t) {
      const sig = m.sig || { params: [], returning: null };
      const label = `${m.cls}${obj ? '->' : '=>'}${m.name.toLowerCase()}`;
      if (this.callStack.length >= 200) throw { message: `${label}: pemanggilan terlalu dalam (rekursi tanpa akhir?)`, line: t && t.lineNo };

      // 1) evaluate the actual parameters in the caller's scope
      const locals = [], outs = [];
      const imps = sig.params.filter(p => p.kind === 'IMPORTING');
      const required = imps.filter(p => !p.optional);
      for (const p of sig.params) {
        const rec = { type: this.typeLabel(p.desc), value: this.initValue(p.desc), desc: p.desc };
        if (p.kind === 'IMPORTING') {
          let words = call.params.EXPORTING[p.name];
          if (!words && call.positional) {
            const target = imps.length === 1 ? imps[0] : (sig.preferred ? imps.find(x => x.name === sig.preferred) : (required.length === 1 ? required[0] : null));
            if (target === p) words = call.positional;
          }
          if (call.values) {
            // event handler: the values come from RAISE EVENT / the ALV, by parameter name
            if (p.name in call.values) rec.value = this.clone(call.values[p.name]);
          } else if (words) rec.value = this.shape(p.desc, this.clone(this.evalExpr(words)));
          else if (p.dflt) rec.value = this.coerce(p.desc, this.evalExpr(p.dflt));
          else if (!p.optional) this.problem(t, `${label}( ): parameter wajib "${p.name.toLowerCase()}" tidak diisi`, 'error');
        } else if (p.kind === 'EXPORTING') {
          const target = call.params.IMPORTING[p.name];
          if (target) outs.push({ target, rec });
        } else if (p.kind === 'CHANGING') {
          const target = call.params.CHANGING[p.name];
          const direct = target && target.length === 1 ? this.variables[U(target[0])] : null;
          if (direct) { locals.push([p.name, direct]); continue; }      // by reference
          if (target) { rec.value = this.clone(this.evalExpr(target)); outs.push({ target, rec }); }
        }
        locals.push([p.name, rec]);
      }
      for (const sec of ['EXPORTING', 'IMPORTING', 'CHANGING']) {
        const kind = sec === 'EXPORTING' ? 'IMPORTING' : sec === 'IMPORTING' ? 'EXPORTING' : 'CHANGING';
        for (const name of Object.keys(call.params[sec])) {
          if (!sig.params.some(p => p.name === name && p.kind === kind)) {
            this.problem(t, `${label}( ): method tidak punya parameter ${kind} "${name.toLowerCase()}"`, 'error');
          }
        }
      }
      if (call.positional && !imps.length) this.problem(t, `${label}( ): method tidak punya parameter IMPORTING`, 'error');
      let retRec = null;
      if (sig.returning) {
        retRec = { type: this.typeLabel(sig.returning.desc), value: this.initValue(sig.returning.desc), desc: sig.returning.desc };
        locals.push([sig.returning.name, retRec]);
      }

      // 2) method scope: static attributes, instance attributes, ME, parameters
      const frame = { name: label, saved: {}, cls: m.cls, obj };
      const bind = (N, rec) => { if (!(N in frame.saved)) frame.saved[N] = this.variables[N]; this.variables[N] = rec; };
      for (const c of this.classChain(m.cls).reverse()) {
        for (const iname of c.interfaces) { const intf = this.interfaces[iname]; if (intf) for (const N of Object.keys(intf.statics)) bind(N, intf.statics[N]); }
        for (const N of Object.keys(c.statics)) bind(N, c.statics[N]);
      }
      if (obj) {
        for (const N of Object.keys(obj.attrs)) bind(N, obj.attrs[N]);
        bind('ME', { type: 'ref', value: obj, readonly: true });
      }
      for (const [N, rec] of locals) bind(N, rec);

      const savedLoopDepth = this.loopDepth, savedLoopStack = this.loopStack, savedT = this.curT;
      this.loopDepth = 0; this.loopStack = [];
      this.frames.push(frame);
      this.callStack.push(label);
      try {
        this.execute(m.impl.tokens, m.impl.start, m.impl.end);
      } catch (e) {
        if (!(e && e.signal === 'RETURN')) throw e;
      } finally {
        this.callStack.pop();
        this.frames.pop();
        this.loopDepth = savedLoopDepth; this.loopStack = savedLoopStack; this.curT = savedT;
        for (const N of Object.keys(frame.saved)) {
          if (frame.saved[N] === undefined) delete this.variables[N];
          else this.variables[N] = frame.saved[N];
        }
      }

      // 3) hand results back to the caller
      for (const o of outs) this.assignChain(/^@?(DATA|FINAL)$/i.test(o.target[0]) ? [o.target[2]] : o.target, o.rec.value, t);
      if (retRec) {
        const recv = call.params.RECEIVING[sig.returning.name];
        if (recv) this.assignChain(recv, retRec.value, t);
        return retRec.value;
      }
      return '';
    }

    // Attribute record of an object / class (with visibility check)
    attrRec(cur, name, t) {
      let N = U(name);
      let rec = null;
      const clsName = cur.cls || (cur.value instanceof AbapObject ? cur.value.cls : null);
      // obj->lif~attr / cls=>lif~const: component of an implemented interface
      if (N.includes('~')) {
        const [iname, an] = N.split('~');
        const intf = this.prepareInterface(iname);
        if (intf && intf.statics[an]) return intf.statics[an];
        N = an;
      }
      if (cur.value instanceof AbapObject) rec = cur.value.attrs[N] || null;
      if (!rec && clsName) {
        for (const c of this.classChain(clsName)) {
          if (c.statics[N]) { rec = c.statics[N]; break; }
          for (const iname of c.interfaces) { const intf = this.prepareInterface(iname); if (intf && intf.statics[N]) rec = intf.statics[N]; }
          if (rec) break;
        }
        if (!rec && this.interfaces[clsName]) rec = this.prepareInterface(clsName).statics[N] || null;
      }
      if (!rec) {
        if (clsName && (this.classes[clsName] || this.interfaces[clsName])) this.problem(t, `Class "${clsName}" tidak punya atribut "${N}"`, 'error');
        return null;
      }
      if (!this.canAccess(rec.vis, rec.owner)) {
        this.problem(t, `Atribut "${N}" bersifat ${rec.vis} di class ${rec.owner} — tidak bisa diakses dari luar class`, 'error');
        return null;
      }
      return rec;
    }

    // cl_demo_output=>display( x ) / =>write( x )
    demoOutput(argWords) {
      const call = this.parseArgs(argWords);
      const words = call.positional || Object.values(call.params.EXPORTING)[0];
      if (!words) return;
      const v = this.evalExpr(words);
      const line = text => this.output.push({ text, cls: 'info' });
      if (Array.isArray(v)) {
        if (!v.length) { line('(tabel kosong)'); return; }
        if (isObj(v[0])) line(Object.keys(v[0]).join(' | '));
        for (const row of v) line(isObj(row) ? Object.values(row).map(x => this.formatOut(x)).join(' | ') : this.formatOut(row));
      } else {
        line(this.formatOut(v));
      }
    }

    callMethodOn(cur, methName, argWords, t) {
      const M = U(methName);
      // static call: cls=>meth( )
      if (cur.cls) {
        if (cur.cls === 'CL_DEMO_OUTPUT') { this.demoOutput(argWords); return ''; }
        if (cur.cls === 'CL_SALV_TABLE' && M === 'FACTORY') { this.salvFactory(this.parseArgs(argWords).params, t); return ''; }
        if (cur.cls === 'CL_ABAP_UNIT_ASSERT' || cur.cls === 'CL_AUNIT_ASSERT') return this.unitAssert(M, argWords, t);
        if (/^CL_ABAP_(TYPE|DATA|ELEM|STRUCT|TABLE|REF)DESCR$/.test(cur.cls)) return this.rttiStatic(M, argWords, t);
        if (!this.prepareClass(cur.cls)) {
          this.problem(t, `${cur.cls}=>${M.toLowerCase()}( ): class tidak dikenal / tidak disimulasikan — pemanggilan dilewati`, 'warning');
          return '';
        }
        const m = this.findMethod(cur.cls, M);
        if (!m) { this.problem(t, `Class "${cur.cls}" tidak punya method "${M}" (atau belum ada IMPLEMENTATION-nya)`, 'error'); return ''; }
        if (m.sig && !m.sig.static) this.problem(t, `${cur.cls}=>${M.toLowerCase()}( ): "${M}" adalah instance method — panggil lewat objek dengan "->"`, 'error');
        if (m.sig && !this.canAccess(m.sig.vis, m.sig.owner)) { this.problem(t, `Method "${M}" bersifat ${m.sig.vis} di class ${m.sig.owner}`, 'error'); return ''; }
        return this.invokeMethod(null, m, this.parseArgs(argWords), t);
      }

      const obj = cur.value;
      if (obj === null || obj === undefined || obj === '') {
        this.raiseSys('CX_SY_REF_IS_INITIAL', `Method "${M}" dipanggil lewat reference yang masih kosong (objek belum dibuat dengan NEW / CREATE OBJECT)`);
      }
      if (obj instanceof SalvProxy) return this.salvCall(obj, M, argWords, t);
      if (obj instanceof AbapObject && obj.rtti) return this.rttiCall(obj, M, argWords, t);
      if (!(obj instanceof AbapObject)) return obj;    // placeholder of a standard class: ignore silently

      // super->meth( ): start the search above the class of the running method
      let start = obj.cls;
      if (cur.superOf) {
        const c = this.classes[cur.superOf];
        start = c && c.super && this.classes[c.super] ? c.super : null;
        if (!start) return '';                         // superclass is a standard class
      }
      const m = this.findMethod(start, M);
      if (!m) {
        if (['GET_TEXT', 'GET_LONGTEXT', 'IF_MESSAGE~GET_TEXT', 'IF_MESSAGE~GET_LONGTEXT'].includes(M)) return this.excText(obj);
        if (!this.classes[obj.cls]) return '';
        const declared = this.classChain(obj.cls).some(c => c.sigs[M]);
        this.problem(t, declared
          ? `Method "${M}" dideklarasikan di class ${obj.cls} tetapi belum ada implementasinya (METHOD ${M.toLowerCase()}. ... ENDMETHOD.)`
          : `Class "${obj.cls}" tidak punya method "${M}"`, 'error');
        return '';
      }
      if (m.sig && !cur.superOf && !this.canAccess(m.sig.vis, m.sig.owner)) {
        this.problem(t, `Method "${M}" bersifat ${m.sig.vis} di class ${m.sig.owner} — tidak bisa dipanggil dari luar class`, 'error');
        return '';
      }
      return this.invokeMethod(m.sig && m.sig.static ? null : obj, m, this.parseArgs(argWords), t);
    }

    // Evaluate  start [ (-> | =>) name [ ( args ) ] | ->* ]*   -> { value, rec? }
    resolveChain(w, t) {
      let cur, i;
      if (U(w[0]) === 'NEW' && w[2] === '(') {
        const close = this.matchParen(w, 2);
        cur = { value: this.instantiate(w[1] === '#' && this.hashClass ? this.hashClass : w[1], this.parseArgs(w.slice(3, close)), t) };
        i = close + 1;
      } else if (U(w[0]) === 'CAST' && w[2] === '(') {
        const close = this.matchParen(w, 2);
        cur = { value: this.evalCtor('CAST', w[1], w.slice(3, close)) };
        i = close + 1;
      } else if (w[1] === '=>') {
        cur = { cls: U(w[0]) }; i = 1;
      } else if (U(w[0]) === 'SUPER') {
        const fr = this.frames[this.frames.length - 1];
        cur = { value: fr ? fr.obj : null, superOf: fr ? fr.cls : null }; i = 1;
      } else {
        const r = this.ref(w[0]);
        cur = { value: r ? r.get() : null, rec: r ? r.rec : null }; i = 1;
        if (!r) this.problem(t, `"${U(w[0])}" belum dideklarasikan`, 'error');
      }
      const emptyRef = v => v === null || v === undefined || v === '';

      while (i < w.length && (w[i] === '->' || w[i] === '=>' || w[i] === '->*')) {
        // dref->*  : the data object a reference points to
        if (w[i] === '->*') {
          if (emptyRef(cur.value)) this.raiseSys('CX_SY_REF_IS_INITIAL', 'Dereferensi ->* pada data reference yang masih kosong');
          cur = cur.value instanceof DataRef ? { value: cur.value.rec.value, rec: cur.value.rec } : { value: '' };
          i++;
          continue;
        }
        const name = w[i + 1];
        if (name === undefined) break;
        if (w[i + 2] === '(') {
          const close = this.matchParen(w, i + 2);
          const args = w.slice(i + 3, close === -1 ? w.length : close);
          cur = { value: this.callMethodOn(cur, name, args, t) };
          i = (close === -1 ? w.length : close) + 1;
          continue;
        }
        const [attr, ...path] = U(name).split('-');
        // dref->comp : component of the structure a data reference points to
        if (w[i] === '->' && cur.value instanceof DataRef) {
          let obj = cur.value.rec.value, desc = cur.value.rec.desc;
          const all = [attr, ...path];
          for (let k = 0; k < all.length - 1 && isObj(obj); k++) { obj = obj[this.ciKey(obj, all[k])]; desc = this.fieldDesc(desc, all[k]); }
          if (isObj(obj)) {
            const key = this.ciKey(obj, all[all.length - 1]), o = obj;
            cur = { value: o[key] === undefined ? '' : o[key], rec: this.aliasRec(() => o[key], v => { o[key] = v; }, this.fieldDesc(desc, all[all.length - 1])) };
          } else {
            cur = { value: '' };
          }
          i += 2;
          continue;
        }
        // constant of a standard class / interface: if_salv_c_cell_type=>hotspot
        if (cur.cls && !this.classes[cur.cls] && !this.interfaces[cur.cls]) {
          const cv = STD_CONSTANTS[`${cur.cls}=>${attr}`];
          if (cv === undefined) this.problem(t, `${cur.cls}=>${attr.toLowerCase()}: class / interface standar ini tidak disimulasikan — nilainya dianggap kosong`, 'warning');
          cur = { value: cv === undefined ? '' : cv };
          i += 2;
          continue;
        }
        if (w[i] === '->' && !(cur.value instanceof AbapObject)) {
          if (emptyRef(cur.value)) {
            this.raiseSys('CX_SY_REF_IS_INITIAL', `Atribut "${attr}" diakses lewat reference yang masih kosong (objek belum dibuat)`);
          }
          i += 2;                                      // attribute of a standard-class placeholder
          continue;
        }
        let rec = this.attrRec(cur, attr, t);
        if (rec && rec.readOnlyOutside && this.currentClass() !== rec.owner) rec = Object.assign(Object.create(rec), { readonly: true });
        if (rec && path.length) {
          let obj = rec.value, desc = rec.desc;
          for (let k = 0; k < path.length - 1 && isObj(obj); k++) { obj = obj[this.ciKey(obj, path[k])]; desc = this.fieldDesc(desc, path[k]); }
          if (isObj(obj)) {
            const key = this.ciKey(obj, path[path.length - 1]), o = obj;
            rec = this.aliasRec(() => o[key], v => { o[key] = v; }, this.fieldDesc(desc, path[path.length - 1]));
          } else rec = null;
        }
        cur = { value: rec ? rec.value : '', rec };
        i += 2;
      }
      return cur;
    }

    // ── Exceptions and events ─────────────────────────────
    // RAISE EXCEPTION TYPE cx [EXPORTING ...] | RAISE EXCEPTION obj | RAISE EVENT evt [EXPORTING ...] | RAISE exc (function module)
    execRaise(t) {
      const w = t.words, up = w.map(U);
      if (up[1] === 'EVENT') {
        const fr = this.frames[this.frames.length - 1];
        const src = fr ? fr.obj || null : null;
        const P = this.parseCallParams(w, 3);
        const values = { SENDER: src };
        for (const k of Object.keys(P.EXPORTING)) values[k] = this.evalExpr(P.EXPORTING[k]);
        for (const h of [...this.handlers]) {
          if (h.event !== up[2] || (h.src !== null && h.src !== src)) continue;
          const m = this.findMethod(h.cls, h.meth);
          if (m) this.invokeMethod(h.obj, m, { positional: null, params: this.parseArgs([]).params, values }, t);
        }
        return;
      }
      const k = up.indexOf('EXCEPTION');
      if (k === -1) {
        // classic: RAISE exc_name (inside a function module)
        if (w[1]) throw { fmException: up[1] };
        return;
      }
      let obj;
      if (up[k + 1] === 'TYPE') {
        obj = this.instantiate(up[k + 2], { positional: null, params: this.parseCallParams(w, k + 3) }, t);
      } else {
        obj = this.evalExpr(w.slice(k + 1));
      }
      if (!(obj instanceof AbapObject)) throw { message: `RAISE EXCEPTION: "${w.slice(k + 1).join(' ')}" bukan objek exception`, line: t.lineNo };
      throw { abapException: obj };
    }

    // TRY. ... CATCH cx_a cx_b [INTO lx]. ... [CLEANUP. ...] ENDTRY.
    execTry(tokens, start, end) {
      const sections = [];
      let depth = 0, cur = { kind: 'TRY', start: start + 1 };
      for (let k = start + 1; k <= end; k++) {
        const kw = U(tokens[k].words[0]);
        if (kw === 'TRY') { depth++; continue; }
        if (kw === 'ENDTRY' && depth > 0) { depth--; continue; }
        if (depth === 0 && (kw === 'CATCH' || kw === 'CLEANUP' || kw === 'ENDTRY')) {
          cur.end = k - 1;
          sections.push(cur);
          cur = { kind: kw, start: k + 1, head: tokens[k] };
        }
      }
      if (!sections.length) return;
      const catches = sections.filter(s => s.kind === 'CATCH');
      try {
        this.execute(tokens, sections[0].start, sections[0].end);
      } catch (e) {
        if (!(e && e.abapException)) throw e;
        const ex = e.abapException;
        const names = s => {
          const hw = s.head.words.slice(1);
          const ii = hw.findIndex(x => U(x) === 'INTO');
          return (ii === -1 ? hw : hw.slice(0, ii)).filter(x => !['BEFORE', 'UNWIND'].includes(U(x)));
        };
        const c = catches.find(s => names(s).some(cn => this.isExcInstance(ex, cn)));
        if (!c) throw e;
        const hw = c.head.words, ii = hw.map(U).indexOf('INTO');
        if (ii !== -1) {
          const target = this.targetName(hw, ii + 1);
          if (this.ref(target)) this.assignTo(target, ex, c.head);
          else this.declareVar(target, { kind: 'ref', target: ex.cls }, ex);
        }
        this.execute(tokens, c.start, c.end);
      }
    }

    // go_grid->set_table_for_first_display( EXPORTING i_structure_name = ... CHANGING it_outtab = ... it_fieldcatalog = ... ).
    execGridDisplay(t) {
      const p = this.parseCallParams(t.words, 0);
      const c = this.makeCall('CL_GUI_ALV_GRID', p, t);
      if (!p.CHANGING.IT_OUTTAB) {
        this.problem(t, 'set_table_for_first_display: CHANGING it_outtab wajib diisi', 'error');
        return;
      }
      const tab = c.table('IT_OUTTAB');
      if (!tab) return;
      const fcat = c.exp('IT_FIELDCATALOG'), layout = c.exp('IS_LAYOUT');
      this.showAlv({
        t, mode: 'CL_GUI_ALV_GRID', tableName: tab.name, data: tab.arr,
        lineDesc: tab.desc && tab.desc.kind === 'table' ? tab.desc.line : null,
        fcat: Array.isArray(fcat) ? fcat : null, structName: c.exp('I_STRUCTURE_NAME'),
        layout: isObj(layout) ? layout : {}, sort: c.exp('IT_SORT'), needCatalog: true
      });
    }

    // Build the ALV output entry (rendered by app.js inside the Output panel)
    showAlv(o) {
      const g = (obj, ...keys) => {
        for (const k of keys) { const v = obj[k]; if (v !== undefined && v !== null && v !== '' && v !== 0) return v; }
        return '';
      };
      const lineFields = o.lineDesc && o.lineDesc.kind === 'struct'
        ? o.lineDesc.fields.map(f => f.name)
        : (isObj(o.data[0]) ? Object.keys(o.data[0]).filter(k => k === k.toUpperCase()) : null);
      const structName = U(o.structName || '');
      const structDesc = structName ? this.resolveNamed(structName) : null;

      let colDefs = [];
      if (o.fcat && o.fcat.length) {
        // 1) explicit field catalog
        o.fcat.forEach((f, idx) => {
          if (!isObj(f)) return;
          const field = U(g(f, 'FIELDNAME'));
          if (!field) { this.problem(o.t, `Field catalog baris ${idx + 1}: FIELDNAME kosong — kolom dilewati`, 'warning'); return; }
          if (g(f, 'NO_OUT') === 'X' || g(f, 'TECH') === 'X') return;
          colDefs.push({
            field,
            label: String(g(f, 'SELTEXT_M', 'SELTEXT_L', 'SELTEXT_S', 'REPTEXT_DDIC', 'COLTEXT', 'SCRTEXT_M', 'SCRTEXT_L', 'SCRTEXT_S', 'REPTEXT') || field),
            key: g(f, 'KEY') === 'X', doSum: g(f, 'DO_SUM') === 'X', hotspot: g(f, 'HOTSPOT') === 'X',
            outputlen: Number(g(f, 'OUTPUTLEN')) || 0, just: U(g(f, 'JUST')), emphasize: g(f, 'EMPHASIZE') !== '',
            pos: Number(g(f, 'COL_POS')) || 0, idx
          });
        });
        if (colDefs.some(c => c.pos)) colDefs.sort((a, b) => (a.pos || 1e9) - (b.pos || 1e9) || a.idx - b.idx);
        if (lineFields) {
          for (const c of colDefs) {
            if (!lineFields.includes(c.field)) {
              this.problem(o.t, `Field catalog: kolom "${c.field}" tidak ada di internal table ${o.tableName} — kolom tampil kosong (di SAP bisa short dump)`, 'warning');
            }
          }
        }
        const seen = new Set();
        colDefs = colDefs.filter(c => (seen.has(c.field) ? (this.problem(o.t, `Field catalog: kolom "${c.field}" terdaftar lebih dari sekali`, 'warning'), false) : seen.add(c.field)));
      } else if (structDesc && structDesc.kind === 'struct') {
        // 2) columns from a DDIC structure
        const keys = DB_KEYS[structName] || [];
        colDefs = structDesc.fields.filter(f => f.name !== 'MANDT').map(f => ({ field: f.name, label: f.name, key: keys.includes(f.name) }));
      } else {
        // 3) no catalog: every component of the line type
        if (structName) this.problem(o.t, `ALV: struktur "${structName}" (i_structure_name) tidak ada di kamus data simulator`, 'error');
        else if (o.needCatalog) {
          this.problem(o.t, `${o.mode}: field catalog kosong dan i_structure_name tidak diisi — di SAP ALV gagal tampil ("Field catalog not found"). Simulator menampilkan semua kolom.`, 'warning');
        }
        colDefs = (lineFields || ['DATA']).filter(f => f !== 'MANDT').map((f, idx) => ({ field: f, label: f, key: !o.needCatalog && idx === 0 }));
        if (!colDefs.some(c => c.key) && colDefs.length) colDefs[0].key = true;
      }

      // column settings made through the SALV object model
      if (o.salv) {
        const cfg = o.salv.columns;
        colDefs = colDefs.filter(c => !(cfg[c.field] && cfg[c.field].hidden));
        for (const c of colDefs) {
          const s = cfg[c.field];
          if (s) {
            c.label = s.medium || s.long || s.short || c.label;
            if (s.hotspot) c.hotspot = true;
            if (s.key !== undefined) c.key = s.key;
            if (s.outputlen) c.outputlen = s.outputlen;
          }
          if (o.salv.sums.includes(c.field)) c.doSum = true;
        }
      }
      // value types, so that the grid can show dates / times / decimals the SAP way
      for (const c of colDefs) {
        const fd = this.fieldDesc(o.lineDesc, c.field);
        if (!fd || fd.kind !== 'elem') continue;
        if (fd.base === 'date' || fd.base === 'time') c.type = fd.base;
        if (fd.decimals) c.decimals = fd.decimals;
      }

      // initial sort (it_sort / get_sorts( )); rowMap keeps the index of each displayed row in the program's table
      const order = o.data.map((_, idx) => idx);
      if (Array.isArray(o.sort) && o.sort.length) {
        const keys = o.sort.filter(isObj).map(s => ({ f: U(g(s, 'FIELDNAME')), desc: g(s, 'DOWN') === 'X' })).filter(s => s.f);
        const cell = (row, f) => (isObj(row) ? row[this.ciKey(row, f)] : row);
        order.sort((x, y) => {
          for (const k of keys) {
            const c = this.cmpValues(cell(o.data[x], k.f), cell(o.data[y], k.f));
            if (c) return k.desc ? -c : c;
          }
          return x - y;
        });
      }
      let data = order.map(idx => this.clone(o.data[idx]));
      if (data.length && !isObj(data[0])) data = data.map(v => ({ DATA: v }));

      const cb = o.callback || null;
      const handlerEvents = cb && cb.handlers ? cb.handlers.map(h => h.event) : [];
      const layout = o.layout || {};
      const title = String(o.title || g(layout, 'WINDOW_TITLEBAR', 'GRID_TITLE') || '');
      const item = {
        type: 'alv', cls: 'info', alvId: ++this.alvCount,
        text: `[ALV] ${o.mode} on table ${o.tableName} (${data.length} records, ${colDefs.length} columns)`,
        tableName: o.tableName, mode: o.mode, title,
        columns: colDefs.map(c => c.field),
        colDefs,
        layout: { zebra: g(layout, 'ZEBRA') === 'X', optimize: g(layout, 'COLWIDTH_OPTIMIZE', 'CWIDTH_OPT') === 'X' || !!(o.salv && o.salv.optimize) },
        header: o.header && o.header.length ? o.header : null,
        // what the UI may trigger: double click on a row / click on a hotspot cell
        onDouble: !!(cb && (cb.form || handlerEvents.includes('DOUBLE_CLICK'))),
        onHotspot: !!(cb && (cb.form || handlerEvents.includes('LINK_CLICK'))),
        data
      };
      Object.defineProperty(item, 'callback', { value: cb, enumerable: false });
      Object.defineProperty(item, 'rowMap', { value: order, enumerable: false });
      Object.defineProperty(item, 't', { value: o.t, enumerable: false });
      this.output.push(item);
    }

    // ── Condition evaluator ───────────────────────────────
    matchParen(w, i) {
      let depth = 0;
      for (let k = i; k < w.length; k++) {
        if (w[k] === '(') depth++;
        else if (w[k] === ')') { depth--; if (depth === 0) return k; }
      }
      return -1;
    }

    stripParens(w) {
      while (w.length >= 2 && w[0] === '(' && this.matchParen(w, 0) === w.length - 1) w = w.slice(1, -1);
      return w;
    }

    // first top-level AND / OR (an AND that belongs to BETWEEN is skipped)
    findLogical(w, op) {
      const lv = this.levels(w);
      let between = false;
      for (let i = 0; i < w.length; i++) {
        if (lv[i] !== 0 || /^['`|]/.test(w[i])) continue;
        const X = U(w[i]);
        if (X === 'BETWEEN') { between = true; continue; }
        if (X === 'AND' && between) { between = false; continue; }
        if (X === op && i > 0) return i;
      }
      return -1;
    }

    evalCond(words) {
      if (!words || !words.length) return true;
      const w = this.stripParens(words);
      let idx = this.findLogical(w, 'OR');
      if (idx > 0) return this.evalCond(w.slice(0, idx)) || this.evalCond(w.slice(idx + 1));
      idx = this.findLogical(w, 'AND');
      if (idx > 0) return this.evalCond(w.slice(0, idx)) && this.evalCond(w.slice(idx + 1));
      if (U(w[0]) === 'NOT') return !this.evalCond(w.slice(1));
      if (U(w[0]) === 'EXISTS' && w[1] === '(' && U(w[2]) === 'SELECT' && this.matchParen(w, 1) === w.length - 1) return this.subquery(w.slice(2, -1)).length > 0;
      return this.evalComparison(w);
    }

    evalComparison(w) {
      // first comparison operator outside ( ... ) and itab[ ... ]
      const lv = this.levels(w);
      let opIdx = -1;
      for (let i = 1; i < w.length; i++) {
        if (lv[i] === 0 && w[i] !== '(' && w[i] !== ')' && !/^['`|]/.test(w[i]) && CMP_OPS.has(U(w[i]))) { opIdx = i; break; }
      }
      if (opIdx === -1) {
        const val = this.evalExpr(w);
        return val === true || val === 'X' || val === 'x' || (typeof val === 'number' && val !== 0);
      }

      const op = U(w[opIdx]);
      let lhsWords = w.slice(0, opIdx), rest = w.slice(opIdx + 1), negate = false;
      if (U(lhsWords[lhsWords.length - 1]) === 'NOT') { negate = true; lhsWords = lhsWords.slice(0, -1); }   // x NOT IN / NOT BETWEEN / NOT LIKE
      const done = res => (negate ? !res : res);

      if (op === 'IS') {
        const not = U(rest[0]) === 'NOT';
        const kw = U(not ? rest[1] : rest[0]);
        let res = false;
        if (kw === 'ASSIGNED') {
          res = !!this.variables[U(lhsWords[0])];
        } else {
          const lhs = this.evalExpr(lhsWords);
          if (kw === 'INITIAL') {
            const r = lhsWords.length === 1 ? this.ref(lhsWords[0]) : null;
            const isHeader = r && !r.isField && r.rec && r.rec.header !== undefined && !/\[\]$/.test(lhsWords[0]);
            res = this.isInitial(lhs, r ? (isHeader && r.desc ? r.desc.line : r.desc) : null);
          } else if (kw === 'BOUND' || kw === 'SUPPLIED' || kw === 'REQUESTED') {
            res = lhs !== null && lhs !== undefined && lhs !== '';
          } else if (kw === 'INSTANCE') {
            res = this.isInstanceOf(lhs, rest[not ? 3 : 2]);
          }
        }
        return done(not ? !res : res);
      }

      const lhs = this.evalExpr(lhsWords);

      if (op === 'BETWEEN') {
        const ai = rest.findIndex(x => U(x) === 'AND');
        if (ai === -1) return false;
        return done(this.compare(lhs, '>=', this.evalExpr(rest.slice(0, ai))) && this.compare(lhs, '<=', this.evalExpr(rest.slice(ai + 1))));
      }
      if (op === 'IN') {
        if (rest[0] === '(') {
          const end = this.matchParen(rest, 0);
          if (U(rest[1]) === 'SELECT') return done(this.subquery(rest.slice(1, end === -1 ? rest.length : end)).some(x => this.compare(lhs, '=', x)));
          const items = rest.slice(1, end === -1 ? rest.length : end).filter(x => x !== ',');
          return done(items.some(x => this.compare(lhs, '=', this.evalExpr([x]))));
        }
        const rr = rest.length === 1 ? this.ref(rest[0]) : null;      // range table (not its header line)
        return done(this.inRange(lhs, rr ? rr.get() : this.evalExpr(rest)));
      }
      // x = ( SELECT MAX( col ) FROM ... ): the single value of a scalar subquery
      const scalarSub = rest[0] === '(' && U(rest[1]) === 'SELECT' && this.matchParen(rest, 0) === rest.length - 1;
      const rhs = scalarSub ? (v => (v.length ? v[0] : ''))(this.subquery(rest.slice(1, -1))) : this.evalExpr(rest);
      const L = this.formatOut(lhs), R = this.formatOut(rhs);
      const pattern = (p, many, one) => new RegExp('^' + p.replace(/[.*+?^${}()|[\]\\]/g, m => (m === many ? '.*' : m === one ? '.' : '\\' + m)) + '$', 'i');
      switch (op) {
        case 'LIKE': return done(new RegExp('^' + R.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i').test(L));
        case 'CS': return done(L.toUpperCase().includes(R.trimEnd().toUpperCase()));
        case 'NS': return done(!L.toUpperCase().includes(R.trimEnd().toUpperCase()));
        case 'CP': return done(pattern(R.trimEnd(), '*', '+').test(L.trimEnd()));
        case 'NP': return done(!pattern(R.trimEnd(), '*', '+').test(L.trimEnd()));
        case 'CO': return done([...L].every(ch => R.includes(ch)));
        case 'CN': return done(![...L].every(ch => R.includes(ch)));
        case 'CA': return done([...L].some(ch => R.includes(ch)));
        case 'NA': return done(![...L].some(ch => R.includes(ch)));
      }
      return done(this.compare(lhs, op, rhs));
    }

    isInitial(v, desc) {
      if (v === null || v === undefined || v === false) return true;
      if (Array.isArray(v)) return v.length === 0;
      if (typeof v === 'object' && !isObj(v)) return false;      // a bound reference
      if (typeof v === 'object') return Object.keys(v).every(k => this.isInitial(v[k], this.fieldDesc(desc, k)));
      if (typeof v === 'number') return v === 0;
      const s = String(v);
      if (s.trim() === '') return true;
      const base = desc && desc.kind === 'elem' ? desc.base : null;
      if (base === 'numc' || base === 'date' || base === 'time') return /^0+$/.test(s);
      if (!base || base === 'any') return /^0{6,}$/.test(s);   // untyped: all-zero date / number field
      return false;
    }

    // value IN range-table (SELECT-OPTIONS)
    inRange(value, range) {
      if (!Array.isArray(range) || !range.length) return true;
      let included = false, hasInclude = false;
      for (const r of range) {
        if (!isObj(r)) continue;
        const sign = U(r.SIGN || 'I'), opt = U(r.OPTION || 'EQ');
        let m;
        switch (opt) {
          case 'BT': m = this.compare(value, '>=', r.LOW) && this.compare(value, '<=', r.HIGH); break;
          case 'NB': m = !(this.compare(value, '>=', r.LOW) && this.compare(value, '<=', r.HIGH)); break;
          case 'CP': m = new RegExp('^' + String(r.LOW).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i').test(String(value)); break;
          default:   m = this.compare(value, opt, r.LOW);
        }
        if (sign === 'E') { if (m) return false; }
        else { hasInclude = true; if (m) included = true; }
      }
      return hasInclude ? included : true;
    }

    compare(lhs, op, rhs) {
      let l = lhs, r = rhs;
      if (l instanceof AbapObject || r instanceof AbapObject) {
        const same = l === r;
        return ['=', 'EQ'].includes(U(op)) ? same : (['<>', '><', 'NE'].includes(U(op)) ? !same : false);
      }
      if (typeof l === 'boolean') l = l ? 'X' : '';
      if (typeof r === 'boolean') r = r ? 'X' : '';
      if (l === null || l === undefined) l = '';
      if (r === null || r === undefined) r = '';
      if (typeof l === 'object' || typeof r === 'object') { l = JSON.stringify(l); r = JSON.stringify(r); }
      if (typeof l === 'string' && typeof r === 'string') { l = l.trimEnd(); r = r.trimEnd(); }
      else if (typeof l === 'string') { l = l.trim() === '' ? 0 : (isNum(l) ? Number(l) : l); if (typeof l === 'string') r = String(r); }
      else if (typeof r === 'string') { r = r.trim() === '' ? 0 : (isNum(r) ? Number(r) : r); if (typeof r === 'string') l = String(l); }
      switch (U(op)) {
        case '=': case 'EQ': return l === r;
        case '<>': case '><': case 'NE': return l !== r;
        case '<': case 'LT': return l < r;
        case '>': case 'GT': return l > r;
        case '<=': case '=<': case 'LE': return l <= r;
        case '>=': case '=>': case 'GE': return l >= r;
      }
      return false;
    }

    // ── Expression evaluator ──────────────────────────────
    // rightmost top-level binary operator out of `ops`
    findBinary(w, ops) {
      const lv = this.levels(w);
      for (let i = w.length - 1; i > 0; i--) {
        const x = w[i];
        if (lv[i] !== 0 || x === '(' || x === ')' || /^['`|]/.test(x) || !ops.includes(U(x))) continue;
        const prev = w[i - 1];
        if (ARITH.has(U(prev)) || prev === '**' || prev === '(') continue;   // sign, not an operator
        return i;
      }
      return -1;
    }

    evalExpr(words) {
      if (!words || !words.length) return '';
      const w = this.stripParens(words);
      if (!w.length) return '';
      if (w.length === 1) return this.evalAtom(w[0]);

      // constructor operators: VALUE / COND / SWITCH / CONV / CAST / REF / REDUCE / CORRESPONDING type( ... )
      if (w[2] === '(' && CTOR_OPS.has(U(w[0])) && this.matchParen(w, 2) === w.length - 1) return this.evalCtor(U(w[0]), w[1], w.slice(3, -1));

      let i = this.findBinary(w, ['&&', '&']);
      if (i > 0) return this.formatOut(this.evalExpr(w.slice(0, i))) + this.formatOut(this.evalExpr(w.slice(i + 1)));

      i = this.findBinary(w, ['+', '-']);
      if (i > 0) {
        const lv = this.evalExpr(w.slice(0, i)), rv = this.evalExpr(w.slice(i + 1));
        // date arithmetic: date ± days, date - date
        const asDate = v => { const d = toDate(v); return d && d.getUTCFullYear() >= 1800 ? d : null; };
        const ld = asDate(lv), rd = asDate(rv);
        if (ld && rd && w[i] === '-') return Math.round((ld - rd) / 86400000);
        if (ld && !rd && isNum(rv)) return fromDate(new Date(ld.getTime() + (w[i] === '+' ? 1 : -1) * Math.round(Number(rv)) * 86400000));
        if (rd && !ld && isNum(lv) && w[i] === '+') return fromDate(new Date(rd.getTime() + Math.round(Number(lv)) * 86400000));
        const l = this.num(lv), r = this.num(rv);
        return Number((w[i] === '+' ? l + r : l - r).toPrecision(15));
      }
      i = this.findBinary(w, ['*', '/', 'MOD', 'DIV']);
      if (i > 0) {
        const l = this.num(this.evalExpr(w.slice(0, i))), r = this.num(this.evalExpr(w.slice(i + 1)));
        if (w[i] === '*') return Number((l * r).toPrecision(15));
        if (r === 0) {
          if (l === 0) return 0;     // ABAP: 0 / 0 = 0
          this.raiseSys('CX_SY_ZERODIVIDE', 'Division by zero (pembagian dengan nol)');
        }
        switch (U(w[i])) {
          case '/': return Number((l / r).toPrecision(15));
          case 'DIV': return Math.floor(l / r);
          default: return ((l % r) + Math.abs(r)) % Math.abs(r);
        }
      }
      i = this.findBinary(w, ['**']);
      if (i > 0) return Math.pow(this.num(this.evalExpr(w.slice(0, i))), this.num(this.evalExpr(w.slice(i + 1))));
      if (w[0] === '-') return -this.num(this.evalExpr(w.slice(1)));
      if (w[0] === '+') return this.num(this.evalExpr(w.slice(1)));

      // table expression: itab[ ... ] / itab[ ... ]-comp
      const cb = this.closeBracket(w, 0);
      if (cb === w.length - 1) return this.tableExpr(w, cb).get();

      // obj->meth( ... ), obj->attr, cls=>meth( ... ), NEW cls( ... ), dref->*
      if (this.isChain(w)) return this.resolveChain(w, this.curT).value;

      // name( arg ): method of the current class, or a built-in function
      if (w[1] === '(' && this.matchParen(w, 1) === w.length - 1 && /^[A-Za-z_][\w~]*$/.test(w[0])) {
        const fr = this.frames[this.frames.length - 1];
        if (fr && fr.cls) {
          // look up from the object's own class so that redefinitions win (polymorphism)
          const m = this.findMethod(fr.obj ? fr.obj.cls : fr.cls, U(w[0]));
          if (m) return this.invokeMethod(m.sig && m.sig.static ? null : fr.obj, m, this.parseArgs(w.slice(2, -1)), this.curT);
        }
        return this.builtin(U(w[0]), w.slice(2, -1), w);
      }

      return w.join(' ');
    }

    // Body of VALUE:  f1 = v1 f2 = v2  ->  structure;   ( ... ) ( ... )  ->  table;   FOR ... ( ... )  ->  table
    parseCtorBody(inner) {
      if (!inner.length) return {};
      let base = null;
      if (U(inner[0]) === 'BASE') {
        const r = this.ref(inner[1]);
        base = this.clone(r ? r.get() : this.evalExpr([inner[1]]));
        inner = inner.slice(2);
        if (!inner.length) return base;
      }
      const row = group => {
        if (U(group[0]) === 'LINES' && U(group[1]) === 'OF') { const tv = this.tableValue(group[2]); return { lines: Array.isArray(tv) ? this.clone(tv) : [] }; }
        return { value: this.parsePairs(group).length ? this.parseCtorBody(group) : this.evalExpr(group) };
      };
      if (U(inner[0]) === 'FOR') {
        const lv = this.levels(inner);
        let open = -1;
        for (let k = inner.length - 1; k >= 0; k--) if (inner[k] === '(' && lv[k] === 0) { open = k; break; }
        const rows = Array.isArray(base) ? base : [];
        if (open === -1) return rows;
        const forToks = inner.slice(1, open), rowToks = inner.slice(open + 1, -1);
        this.runFor(forToks, () => { const r = row(rowToks); if (r.lines) rows.push(...r.lines); else rows.push(this.clone(r.value)); });
        return rows;
      }
      if (inner[0] === '(') {
        const rows = Array.isArray(base) ? base : [];
        let i = 0;
        while (i < inner.length && inner[i] === '(') {
          const end = this.matchParen(inner, i);
          if (end === -1) break;
          const r = row(inner.slice(i + 1, end));
          if (r.lines) rows.push(...r.lines); else rows.push(r.value);
          i = end + 1;
        }
        return rows;
      }
      const o = isObj(base) ? base : {};
      for (const [name, toks] of this.parsePairs(inner)) o[name] = this.evalExpr(toks);
      return o;
    }

    // |text { expr [WIDTH = n] [ALIGN = ...] [DATE = USER] [DECIMALS = n] ... } text|
    evalTemplate(tok) {
      const OPTS = new Set(['WIDTH', 'ALIGN', 'PAD', 'CASE', 'SIGN', 'DECIMALS', 'DATE', 'TIME', 'ALPHA', 'NUMBER', 'STYLE', 'CURRENCY', 'ZERO', 'EXPONENT', 'COUNTRY', 'TIMESTAMP', 'TIMEZONE', 'XSD']);
      const one = e => {
        const toks = this.words(e.trim());
        let cut = toks.length;
        for (let k = 1; k < toks.length - 1; k++) if (toks[k + 1] === '=' && OPTS.has(U(toks[k]))) { cut = k; break; }
        const expr = toks.slice(0, cut), o = {};
        for (let k = cut; k + 2 < toks.length + 0 && toks[k + 1] === '='; k += 3) o[U(toks[k])] = toks[k + 2];
        const r = expr.length === 1 ? this.ref(expr[0]) : null;
        const v = this.evalExpr(expr);
        let s;
        const kind = U(o.DATE || '');
        if ((kind === 'USER' || kind === 'ISO' || kind === 'ENVIRONMENT') && typeof v === 'string' && /^\d{8}$/.test(v)) {
          s = kind === 'ISO' ? `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}` : `${v.slice(6, 8)}.${v.slice(4, 6)}.${v.slice(0, 4)}`;
        } else if (U(o.TIME || '') && typeof v === 'string' && /^\d{6}$/.test(v)) {
          s = `${v.slice(0, 2)}:${v.slice(2, 4)}:${v.slice(4, 6)}`;
        } else if (o.DECIMALS !== undefined && isNum(v)) {
          s = Number(v).toFixed(Number(this.evalExpr([o.DECIMALS])) || 0);
        } else if (typeof v === 'number' && r && r.desc && r.desc.decimals) {
          s = v.toFixed(r.desc.decimals);
        } else {
          s = this.formatOut(v);
        }
        const alpha = U(o.ALPHA || '');
        if (alpha === 'OUT' && /^\d+$/.test(s)) s = s.replace(/^0+/, '') || '0';
        if (alpha === 'IN' && /^\d+$/.test(s)) s = s.padStart(Number(this.evalExpr([o.WIDTH || '10'])) || 10, '0');
        const cs = U(o.CASE || '');
        if (cs === 'UPPER') s = s.toUpperCase();
        if (cs === 'LOWER') s = s.toLowerCase();
        if (o.WIDTH !== undefined) {
          const width = Number(this.evalExpr([o.WIDTH])) || 0;
          const padCh = o.PAD !== undefined ? (this.formatOut(this.evalExpr([o.PAD])) || ' ')[0] : ' ';
          const align = U(o.ALIGN || 'LEFT');
          if (align === 'RIGHT') s = s.padStart(width, padCh);
          else if (align === 'CENTER') s = s.padStart(Math.floor((width + s.length) / 2), padCh).padEnd(width, padCh);
          else s = s.padEnd(width, padCh);
        }
        return s;
      };
      return tok.slice(1, -1)
        .replace(/\{([^}]*)\}/g, (m, e) => one(e))
        .replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    }

    sysField(W) {
      const now = new Date();
      switch (W.replace(/^SYST-/, 'SY-')) {
        case 'SY-SUBRC': case 'SY-DBCNT': case 'SY-TABIX': case 'SY-INDEX': case 'SY-TFILL': case 'SY-LSIND': case 'SY-LILLI': return 0;
        case 'SY-PAGNO': return 1;
        case 'SY-LINNO': return this.output.length + 1;
        case 'SY-LINSZ': return 132;
        case 'SY-LINCT': return 65;
        case 'SY-COLNO': return 1;
        case 'SY-DATUM': case 'SY-DATLO': return `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}`;
        case 'SY-UZEIT': case 'SY-TIMLO': return `${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
        case 'SY-REPID': case 'SY-CPROG': return this.programName;
        case 'SY-UNAME': return 'DEVELOPER';
        case 'SY-MANDT': return '800';
        case 'SY-LANGU': return 'EN';      // the dummy tables store the language key as 'EN' / 'ID'
        case 'SY-TCODE': return 'SE38';
        case 'SY-SYSID': return 'DEV';
        case 'SY-HOST': return 'sapdev01';
        case 'SY-OPSYS': return 'Linux';
        case 'SY-DBSYS': return 'HDB';
        case 'SY-SAPRL': return '757';
        case 'SY-ZONLO': return 'UTC+7';
        case 'SY-ULINE': return '-'.repeat(60);
        case 'SY-VLINE': return '|';
        case 'SY-ABCDE': return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      }
      return W.startsWith('SY-') || W.startsWith('SYST-') ? '' : undefined;     // other system fields: initial
    }

    evalAtom(tok) {
      const c0 = tok[0];
      if ((c0 === "'" || c0 === '`') && tok.length >= 2 && tok[tok.length - 1] === c0) return tok.slice(1, -1).split(c0 + c0).join(c0);
      if (c0 === '|' && tok.length >= 2 && tok[tok.length - 1] === '|') return this.evalTemplate(tok);
      if (isNum(tok)) return Number(tok);

      const W = U(tok);
      const host = W[0] === '@';
      const name = host ? W.slice(1) : W;

      // column of the current row (SELECT ... WHERE / LOOP AT ... WHERE)
      if (this.rowCtx && !host) {
        const row = this.rowCtx.row;
        if (name === 'TABLE_LINE') return row;
        if (isObj(row)) {
          let key = this.ciKey(row, name);
          if (key in row) return row[key];
          if (name.includes('~')) {
            // alias~column of an outer query (correlated subquery)
            for (let ctx = this.rowCtx.outer; ctx; ctx = ctx.outer) {
              if (isObj(ctx.row)) { const ok = this.ciKey(ctx.row, name); if (ok in ctx.row) return ctx.row[ok]; }
            }
            key = this.ciKey(row, name.replace(/^.*~/, ''));
            if (key in row) return row[key];
          }
        }
      }

      if (name === 'SPACE') return ' ';
      if (name === 'ABAP_TRUE') return 'X';
      if (name === 'ABAP_FALSE') return '';
      if (name === 'ABAP_UNDEFINED') return '-';

      const r = this.ref(name);
      if (r) {
        // table with header line: the plain name means the header line, name[] the table body
        if (!r.isField && r.rec && r.rec.header !== undefined && !name.endsWith('[]')) return r.rec.header;
        const v = r.get();
        return v === undefined ? '' : v;
      }
      // substring of something that is not a variable: sy-datum+0(4)
      const sub = /[+(]/.test(name) ? this.splitSub(name) : null;
      if (sub) {
        const s = this.formatOut(this.evalAtom(sub.base));
        return sub.len === undefined ? s.substr(sub.off) : s.substr(sub.off, sub.len);
      }
      if (name.startsWith('SY-') || name.startsWith('SYST-')) {
        const v = this.sysField(name);
        if (v !== undefined) return v;
      }
      if (/^TEXT-\w{3}$/.test(name)) return `(${tok.toLowerCase()})`;      // text symbols are not maintained in the simulator
      if (/^SLIS_EV_\w+$/.test(name)) return name.slice(8);                // slis_ev_top_of_page = 'TOP_OF_PAGE' ...
      if (name === 'SY-ABCDE') return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      // component of a known structure that does not exist / is not filled
      if (name.includes('-') && this.variables[name.split('-')[0]]) return '';
      // looks like a variable name but was never declared
      if (/^[A-Z][A-Z0-9]*_[A-Z0-9_]*$/.test(name)) {
        this.problem(this.curT, `"${name}" belum dideklarasikan (atau hanya dikenal di dalam FORM / METHOD lain). Di SAP ini syntax error.`, 'warning');
      }
      return tok;   // unknown word: return as-is
    }

    // ── Helpers ────────────────────────────────────────────
    findMatchingEnd(tokens, start, openKw, closeKw) {
      let depth = 0;
      for (let i = start; i < tokens.length; i++) {
        const kw = U(tokens[i].words[0]);
        if (kw === openKw)  depth++;
        if (kw === closeKw) { depth--; if (depth === 0) return i; }
      }
      return tokens.length - 1;
    }

    skipToEnd(tokens, start, closeKw) {
      let depth = 0;
      const openKw = U(tokens[start].words[0]);
      for (let i = start; i < tokens.length; i++) {
        const kw = U(tokens[i].words[0]);
        if (kw === openKw) depth++;
        if (kw === closeKw) { depth--; if (depth === 0) return i; }
      }
      return tokens.length - 1;
    }

    splitBlocks(tokens, start, end, midKws, openKw, closeKw) {
      const blocks = [];
      let cond    = tokens[start].words.slice(1);
      let bodyStart = start + 1;
      let depth = 0;

      for (let i = start + 1; i <= end; i++) {
        const kw = U(tokens[i].words[0]);
        if (kw === openKw) depth++;
        if (kw === closeKw && depth > 0) { depth--; continue; }
        if (depth > 0) continue;
        if (midKws.includes(kw) || kw === closeKw) {
          blocks.push({ cond, bodyStart, bodyEnd: i - 1 });
          cond = kw === 'ELSE' ? null : tokens[i].words.slice(1);
          bodyStart = i + 1;
        }
      }
      return blocks;
    }

    // Declaration statements are processed once per scope (a DATA inside a loop must not reset the variable)
    once(t) {
      const scope = this.frames.length ? this.frames[this.frames.length - 1] : this;
      if (!scope.declared) scope.declared = new Set();
      if (scope.declared.has(t)) return true;
      scope.declared.add(t);
      return false;
    }

    // One line of a range table (SELECT-OPTIONS / RANGES)
    rangeRow(lowDesc, low, high) {
      const noHigh = high === '' || high === undefined || high === null;
      if ((low === '' || low === undefined || low === null) && noHigh) return null;
      return {
        SIGN: 'I', OPTION: !noHigh ? 'BT' : (/[*+]/.test(String(low)) ? 'CP' : 'EQ'),
        LOW: this.coerce(lowDesc, low), HIGH: noHigh ? this.initValue(lowDesc) : this.coerce(lowDesc, high)
      };
    }

    // Values typed into the selection screen replace DEFAULT / INITIALIZATION values
    applySelectionInput() {
      for (const name of Object.keys(this.params)) {
        const rec = this.variables[name], input = this.params[name];
        if (!rec) continue;
        if (rec.isSelOpt && input && typeof input === 'object') {
          const row = this.rangeRow(this.fieldDesc(rec.desc.line, 'LOW'), input.low, input.high);
          rec.value = row ? [row] : [];
          rec.header = row ? this.clone(row) : this.initValue(rec.desc.line);
        } else if (rec.isParameter && (input === null || typeof input !== 'object')) {
          this.coerceName = name;
          try { rec.value = this.coerce(rec.desc, input); } finally { this.coerceName = ''; }
        }
      }
    }

    // Run fn; a runtime error / uncaught exception ends the program and is recorded as a fatal error
    guard(fn) {
      try {
        fn();
      } catch (e) {
        if (e && e.signal) return;      // STOP / END: regular end of processing
        let msg = (e && e.message) || String(e);
        if (e && e.abapException) {
          const ex = e.abapException;
          msg = `Exception ${ex.cls} tidak ditangkap dengan TRY ... CATCH (di SAP: short dump). ${this.excText(ex)}`;
        } else if (e && e.fmException) {
          msg = `Exception ${e.fmException} dinaikkan dengan RAISE tetapi tidak ada pemanggil yang menanganinya`;
        }
        this.errors.push({ line: (e && e.line) || this.curLine || 0, msg, type: 'error', fatal: true });
      }
    }

    prepare(code) {
      const tokens = this.tokenize(this.expandMacros(this.preprocess(code)));
      this.tokens = tokens;
      this.collectForms(tokens);
      this.collectClasses(tokens);
      this.collectFunctions(tokens, code);
      this.collectBlocks(tokens);
    }

    // DEFINE name. ... &1 &2 ... END-OF-DEFINITION.  -> text replacement at statement level
    expandMacros(stmts) {
      const macros = {}, out = [];
      let def = null;
      const expand = (s, depth) => {
        const m = /^([A-Za-z_][\w-]*)/.exec(s.text);
        const body = m ? macros[U(m[1])] : null;
        if (!body || depth > 20) { out.push(s); return; }
        const args = this.words(s.text).slice(1);
        for (const b of body) {
          expand({ text: b.replace(/&(\d)/g, (x, n) => (args[n - 1] !== undefined ? args[n - 1] : '')), line: s.line }, depth + 1);
        }
      };
      for (const s of stmts) {
        const parts = s.text.split(/\s+/);
        const first = U(parts[0]);
        if (first === 'DEFINE' && !def) { def = { name: U(parts[1]), body: [] }; continue; }
        if (first === 'END-OF-DEFINITION') { if (def) macros[def.name] = def.body; def = null; continue; }
        if (def) { def.body.push(s.text); continue; }
        expand(s, 0);
      }
      return out;
    }

    // Event keyword of a statement, or null
    eventName(w) {
      const kw = U(w[0]);
      if (['INITIALIZATION', 'START-OF-SELECTION', 'END-OF-SELECTION', 'END-OF-PAGE', 'LOAD-OF-PROGRAM'].includes(kw)) return kw;
      if (kw === 'TOP-OF-PAGE') return U(w[1]) === 'DURING' ? 'TOP-OF-PAGE DURING LINE-SELECTION' : kw;
      if (kw !== 'AT') return null;
      const second = U(w[1]);
      if (second === 'SELECTION-SCREEN') {
        if (U(w[2]) === 'OUTPUT') return 'AT SELECTION-SCREEN OUTPUT';
        if (U(w[2]) === 'ON' && /REQUEST/.test(U(w[3]))) return 'AT SELECTION-SCREEN F4';   // value / help request: never triggered
        return 'AT SELECTION-SCREEN';
      }
      if (second === 'LINE-SELECTION') return 'AT LINE-SELECTION';
      if (second === 'USER-COMMAND' || /^PF\d+$/.test(second)) return 'AT USER-COMMAND';
      return null;
    }

    // Token ranges of procedures (not part of any event block): FORM, CLASS, FUNCTION, MODULE
    procedureEnd(tokens, i) {
      const CLOSE = { FORM: 'ENDFORM', CLASS: 'ENDCLASS', INTERFACE: 'ENDINTERFACE', FUNCTION: 'ENDFUNCTION', MODULE: 'ENDMODULE' };
      const w = tokens[i].words, kw = U(w[0]);
      if (!CLOSE[kw]) return -1;
      if ((kw === 'CLASS' || kw === 'INTERFACE') && w.some(x => ['DEFERRED', 'LOAD'].includes(U(x)))) return -1;
      let e = i + 1;
      while (e < tokens.length && U(tokens[e].words[0]) !== CLOSE[kw]) e++;
      return Math.min(e, tokens.length - 1);
    }

    // Split the main program into event blocks. Statements before the first event keyword
    // belong to START-OF-SELECTION (as in ABAP).
    collectBlocks(tokens) {
      this.blocks = {};
      let cur = 'START-OF-SELECTION', start = 0;
      const close = end => { if (end >= start) (this.blocks[cur] = this.blocks[cur] || []).push([start, end]); };
      for (let i = 0; i < tokens.length; i++) {
        const pe = this.procedureEnd(tokens, i);
        if (pe !== -1) { i = pe; continue; }
        const ev = this.eventName(tokens[i].words);
        if (ev) { close(i - 1); cur = ev; start = i + 1; }
      }
      close(tokens.length - 1);
    }

    // Global declarations are known from the start of the program, wherever they are written
    hoistDeclarations() {
      const DECL = new Set(['DATA', 'TYPES', 'CONSTANTS', 'STATICS', 'PARAMETERS', 'PARAMETER', 'SELECT-OPTIONS', 'RANGES', 'TABLES', 'INCLUDE']);
      const tokens = this.tokens;
      for (let i = 0; i < tokens.length; i++) {
        const pe = this.procedureEnd(tokens, i);
        if (pe !== -1) { i = pe; continue; }
        const w = tokens[i].words, kw = U(w[0]);
        if (!DECL.has(kw)) continue;
        if (kw === 'DATA' && w[1] === '(') continue;                 // inline declaration = assignment
        if (kw === 'INCLUDE' && !this.structBuild.length) continue;
        this.execute(tokens, i, i);
      }
    }

    runEvent(name) {
      for (const [from, to] of this.blocks[name] || []) {
        try {
          this.execute(this.tokens, from, to);
        } catch (e) {
          if (e && e.signal === 'STOP') return;     // EXIT / RETURN / CHECK / STOP leave the event block
          throw e;
        }
      }
    }

    // TOP-OF-PAGE is triggered by the first output to the list
    topOfPage() {
      if (this.topDone || this.inTop || !this.blocks['TOP-OF-PAGE']) return;
      this.topDone = true;
      this.inTop = true;
      try {
        this.runEvent('TOP-OF-PAGE');
      } finally {
        this.inTop = false;
      }
    }

    // Nesting depth of every token: 0 = outside all ( ... ) and itab[ ... ]
    levels(w) {
      const lv = new Array(w.length);
      let d = 0;
      for (let i = 0; i < w.length; i++) {
        const x = w[i], lit = /^['`|]/.test(x);
        if (!lit && (x === ')' || x[0] === ']')) d--;
        lv[i] = d;
        if (!lit && (x === '(' || (x.length > 1 && x[x.length - 1] === '['))) d++;
      }
      return lv;
    }

    // ── User-written function modules (FUNCTION ... ENDFUNCTION) ──
    collectFunctions(tokens, code) {
      this.userFunctions = {};
      const lines = String(code).replace(/\r/g, '').split('\n');
      for (let i = 0; i < tokens.length; i++) {
        if (U(tokens[i].words[0]) !== 'FUNCTION') continue;
        let e = i + 1;
        while (e < tokens.length && U(tokens[e].words[0]) !== 'ENDFUNCTION') e++;
        const name = U(tokens[i].words[1]);
        this.userFunctions[name] = { name, sig: this.parseFmInterface(lines, tokens[i].lineNo), tokens, start: i + 1, end: e - 1 };
        i = e;
      }
    }

    // The interface of a function module is written as *" comment lines below FUNCTION name.
    //   *"  IMPORTING
    //   *"     VALUE(IV_A) TYPE I
    //   *"  EXPORTING ...  CHANGING ...  TABLES ...  EXCEPTIONS ...
    parseFmInterface(lines, lineNo) {
      const sig = { params: [], exceptions: [] };
      let sec = null, found = false;
      for (let k = lineNo; k < lines.length; k++) {
        const line = lines[k];
        if (!/^\*"/.test(line)) { if (line.trim() === '') continue; break; }
        const w = this.words(line.slice(2).replace(/-{4,}/g, ' '));
        if (!w.length) continue;
        let i = 0;
        if (['IMPORTING', 'EXPORTING', 'CHANGING', 'TABLES', 'EXCEPTIONS', 'RAISING'].includes(U(w[0]))) { sec = U(w[0]); found = true; i = 1; }
        if (!sec || i >= w.length) continue;
        if (sec === 'EXCEPTIONS' || sec === 'RAISING') { sig.exceptions.push(U(w[i])); continue; }
        let name;
        if ((U(w[i]) === 'VALUE' || U(w[i]) === 'REFERENCE') && w[i + 1] === '(') { name = U(w[i + 2]); i += 4; }
        else { name = U(w[i]); i++; }
        const rest = w.slice(i), up = rest.map(U);
        const p = { name, kind: sec, spec: rest, optional: up.includes('OPTIONAL') || up.includes('DEFAULT') };
        const di = up.indexOf('DEFAULT');
        if (di !== -1 && rest[di + 1] !== undefined) p.dflt = [rest[di + 1]];
        sig.params.push(p);
      }
      return found ? sig : null;
    }

    fmParamDesc(p) {
      const table = line => ({ kind: 'table', line, tkind: 'STANDARD', key: [], unique: false });
      const any = { kind: 'elem', base: 'any' };
      const up = (p.spec || []).map(U);
      const si = up.indexOf('STRUCTURE');
      if (si !== -1) {
        const line = this.resolveNamed(p.spec[si + 1]);
        return p.kind === 'TABLES' ? table(line) : line;
      }
      if (!up.includes('TYPE') && !up.includes('LIKE')) return p.kind === 'TABLES' ? table(any) : undefined;
      let d = this.resolveTypeSpec(p.spec);
      if (d.kind === 'elem' && (d.generic || d.base === 'any')) d = undefined;     // TYPE c / TYPE any: generic
      if (p.kind === 'TABLES' && (!d || d.kind !== 'table')) d = table(d || any);
      return d;
    }

    // Run a token range with its own local scope. bindings: [[NAME, record], ...]
    runInFrame(frame, bindings, tokens, start, end) {
      frame.saved = frame.saved || {};
      for (const [N, rec] of bindings) {
        if (!(N in frame.saved)) frame.saved[N] = this.variables[N];
        this.variables[N] = rec;
      }
      const savedLoopDepth = this.loopDepth, savedLoopStack = this.loopStack, savedT = this.curT, savedAt = this.atCtx;
      this.loopDepth = 0; this.loopStack = []; this.atCtx = null;
      this.frames.push(frame);
      this.callStack.push(frame.name);
      try {
        this.execute(tokens, start, end);
      } catch (e) {
        if (!(e && e.signal === 'RETURN')) throw e;
      } finally {
        this.callStack.pop();
        this.frames.pop();
        this.loopDepth = savedLoopDepth; this.loopStack = savedLoopStack; this.curT = savedT; this.atCtx = savedAt;
        for (const N of Object.keys(frame.saved)) {
          if (frame.saved[N] === undefined) delete this.variables[N];
          else this.variables[N] = frame.saved[N];
        }
      }
    }

    // Call a FORM with values (used for ALV callbacks). Returns the parameter values after the call.
    callForm(name, values, t) {
      const form = this.forms[U(name)];
      if (!form) {
        this.problem(t, `Callback: FORM "${U(name)}" tidak ditemukan di program ini`, 'error');
        return null;
      }
      const bindings = form.formals.map((f, i) => {
        const v = this.clone(values[i]);
        return [f.name, { type: this.typeLabelOf(v), value: v === undefined ? '' : v }];
      });
      this.runInFrame({ name: U(name) }, bindings, form.tokens, form.start, form.end);
      return bindings.map(b => b[1].value);
    }

    // CALL FUNCTION for a FUNCTION ... ENDFUNCTION written in the program
    invokeFunction(uf, c, t) {
      const P = c.params;
      if (this.callStack.length >= 200) throw { message: `CALL FUNCTION '${uf.name}': pemanggilan terlalu dalam (rekursi tanpa akhir?)`, line: t.lineNo };
      // without an interface comment the parameters are taken from the call itself
      const params = uf.sig ? uf.sig.params : [
        ...Object.keys(P.EXPORTING).map(name => ({ name, kind: 'IMPORTING', optional: true })),
        ...Object.keys(P.IMPORTING).map(name => ({ name, kind: 'EXPORTING', optional: true })),
        ...Object.keys(P.CHANGING).map(name => ({ name, kind: 'CHANGING', optional: true })),
        ...Object.keys(P.TABLES).map(name => ({ name, kind: 'TABLES', optional: true }))
      ];
      const bindings = [], outs = [];
      for (const p of params) {
        const desc = this.fmParamDesc(p);
        let rec = { type: this.typeLabel(desc), value: this.initValue(desc), desc };
        if (p.kind === 'IMPORTING') {
          const src = P.EXPORTING[p.name];
          if (src) rec.value = this.shape(desc, this.clone(this.evalExpr(src)));
          else if (p.dflt) rec.value = this.coerce(desc, this.evalExpr(p.dflt));
          else if (!p.optional) this.problem(t, `CALL FUNCTION '${uf.name}': parameter wajib "${p.name.toLowerCase()}" tidak diisi (di SAP: short dump CALL_FUNCTION_PARM_MISSING)`, 'error');
        } else if (p.kind === 'EXPORTING') {
          const target = P.IMPORTING[p.name];
          if (target) outs.push({ target, rec });
        } else if (p.kind === 'CHANGING') {
          const target = P.CHANGING[p.name];
          const direct = target && target.length === 1 ? this.variables[U(target[0])] : null;
          if (direct) rec = direct;
          else if (target) { rec.value = this.clone(this.evalExpr(target)); outs.push({ target, rec }); }
        } else {
          // TABLES: the caller's table (by reference) plus a header line of its own
          const target = P.TABLES[p.name];
          const tab = target ? this.tableRef(target[0], t, `CALL FUNCTION '${uf.name}' (${p.name.toLowerCase()})`) : null;
          const holder = tab ? this.ref(target[0]) : null;
          const local = [];
          rec = { type: 'table', desc: (tab && tab.desc) || desc, header: this.initValue(((tab && tab.desc) || desc || {}).line) };
          Object.defineProperty(rec, 'value', {
            enumerable: true,
            get: () => (holder ? holder.get() : local),
            set: v => { if (holder) holder.set(v); else { local.length = 0; local.push(...v); } }
          });
        }
        bindings.push([p.name, rec]);
      }
      if (uf.sig) {
        const want = { EXPORTING: 'IMPORTING', IMPORTING: 'EXPORTING', CHANGING: 'CHANGING', TABLES: 'TABLES' };
        for (const sec of Object.keys(want)) {
          for (const name of Object.keys(P[sec])) {
            if (!params.some(p => p.name === name && p.kind === want[sec])) {
              this.problem(t, `CALL FUNCTION '${uf.name}': function module tidak punya parameter ${want[sec]} "${name.toLowerCase()}" (di SAP: short dump CALL_FUNCTION_PARM_UNKNOWN)`, 'error');
            }
          }
        }
      }
      this.runInFrame({ name: `FUNCTION ${uf.name}`, fm: uf.name }, bindings, uf.tokens, uf.start, uf.end);
      for (const o of outs) this.assignChain(/^@?(DATA|FINAL)$/i.test(o.target[0]) ? [this.targetName(o.target, 0)] : o.target, o.rec.value, t);
    }

    // ── WRITE ──────────────────────────────────────────────
    // Output format of one value: dates DD.MM.YYYY, times HH:MM:SS, packed numbers with their decimals
    fmtWrite(value, desc, opts) {
      const base = desc && desc.kind === 'elem' ? desc.base : null;
      if (typeof value === 'string' && /^\d{8}$/.test(value) && (base === 'date' || opts.dateMask)) {
        const dd = value.slice(6, 8), mm = value.slice(4, 6), yyyy = value.slice(0, 4);
        if (!opts.dateMask) return `${dd}.${mm}.${yyyy}`;
        return opts.dateMask.replace('YYYY', yyyy).replace('YY', yyyy.slice(2)).replace('MM', mm).replace('DD', dd).replace(/\//g, '.');
      }
      if (base === 'time' && typeof value === 'string' && /^\d{6}$/.test(value)) {
        return `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4, 6)}`;
      }
      if (typeof value === 'number') {
        if (opts.noZero && value === 0) return '';
        const dec = opts.decimals !== undefined ? opts.decimals : (desc && desc.decimals !== undefined ? desc.decimals : undefined);
        if (dec !== undefined && dec >= 0 && dec <= 14) return value.toFixed(dec);
      }
      if (opts.noZero && typeof value === 'string' && /^0+\d*$/.test(value)) return value.replace(/^0+/, '');
      return this.formatOut(value);
    }

    // ULINE [AT] [/][pos][(len)].
    execUline(t) {
      const w = t.words;
      let i = 1, pos = 0, len = 60;
      if (U(w[i]) === 'AT') i++;
      if (w[i] === '/') i++;
      if (isNum(w[i])) { pos = Number(w[i]); i++; }
      if (w[i] === '(' && isNum(w[i + 1])) len = Number(w[i + 1]);
      this.topOfPage();
      this.output.push({ text: (pos > 1 ? ' '.repeat(pos - 1) : '') + '─'.repeat(Math.max(1, Math.min(len, 255))), cls: 'separator' });
    }

    // HIDE var: remember the value together with the current list line (for AT LINE-SELECTION)
    execHide(t) {
      const line = this.lastWrite;
      if (!line || !t.words[1]) return;
      line.hide = line.hide || {};
      line.hide[U(t.words[1])] = this.clone(this.evalExpr([t.words[1]]));
    }

    // ── Interaction after the program has run (called by the UI) ──
    // A list line was double-clicked: restore the HIDE values and run AT LINE-SELECTION.
    lineSelect(outputIndex) {
      const item = this.output[outputIndex];
      if (!item || item.type === 'alv' || !this.blocks['AT LINE-SELECTION']) return null;
      const from = this.output.length, errFrom = this.errors.length;
      this.steps = 0;
      this.guard(() => {
        for (const k of Object.keys(item.hide || {})) {
          const r = this.ref(k);
          if (r) r.set(this.clone(item.hide[k]));
        }
        this.variables['SY-LISEL'] = { type: 'string', value: item.text };
        this.setSy('LILLI', outputIndex + 1);
        this.setSy('LSIND', (Number((this.variables['SY-LSIND'] || {}).value) || 0) + 1);
        this.output.push({ text: `── Secondary list (baris dipilih: ${String(item.text).trim().slice(0, 40)}) ──`, cls: 'separator' });
        this.lastWrite = null;
        this.runEvent('AT LINE-SELECTION');
      });
      return { output: this.output.slice(from), errors: this.errors.slice(errFrom), from };
    }

    // A row of an ALV grid was double-clicked (kind 'dbl') or a hotspot cell was clicked (kind 'hotspot').
    // Runs the FORM given in i_callback_user_command (ucomm '&IC1') / the SALV event handler methods.
    alvCommand(alvId, kind, rowIndex, fieldName) {
      const item = this.output.find(o => o.type === 'alv' && o.alvId === alvId);
      if (!item || !item.callback) return null;
      const from = this.output.length, errFrom = this.errors.length;
      const srcIndex = item.rowMap && item.rowMap[rowIndex] !== undefined ? item.rowMap[rowIndex] : rowIndex;
      const row = item.data[rowIndex];
      const field = U(fieldName);
      this.steps = 0;
      this.lastWrite = null;
      this.guard(() => {
        const cb = item.callback;
        if (cb.form) {
          const selfield = {
            TABNAME: item.tableName, TABINDEX: srcIndex + 1, SUMINDEX: 0, ENDSUM: '', SEL_TAB_FIELD: `${item.tableName}-${field}`,
            VALUE: isObj(row) ? this.formatOut(row[this.ciKey(row, field)]) : this.formatOut(row),
            FIELDNAME: field, BEFORE_ACTION: '', AFTER_ACTION: '', REFRESH: '', COL_STABLE: '', ROW_STABLE: '', EXIT: ''
          };
          this.callForm(cb.form, ['&IC1', selfield], item.t);
        }
        const wanted = kind === 'hotspot' ? 'LINK_CLICK' : 'DOUBLE_CLICK';
        for (const h of cb.handlers || []) {
          if (h.event !== wanted) continue;
          const m = this.findMethod(h.cls, h.meth);
          if (m) this.invokeMethod(h.obj || null, m, { positional: null, params: this.parseArgs([]).params, values: { ROW: srcIndex + 1, COLUMN: field, SENDER: null } }, item.t);
        }
      });
      return { output: this.output.slice(from), errors: this.errors.slice(errFrom), from };
    }

    // An internal table whose line type matches the data object `srcTok` (for "did you mean" hints)
    suggestTable(srcTok) {
      const sr = srcTok && /^[A-Za-z_<]/.test(srcTok) ? this.ref(srcTok) : null;
      const sd = sr && sr.desc;
      if (!sd || sd.kind !== 'struct') return null;
      for (const N of Object.keys(this.variables)) {
        const d = this.variables[N].desc;
        if (d && d.kind === 'table' && d.line && (d.line === sd || (sd.ddic && d.line.ddic === sd.ddic))) return N;
      }
      return null;
    }

    // Loops over `table` keep their position when rows are inserted / deleted in front of the cursor
    shiftLoops(table, idx, delta) {
      for (const e of this.loopStack) {
        if (e.table === table && idx <= e.index) e.index += delta;
      }
    }

    // Add a row according to the table kind. Returns false if a unique key already exists.
    insertRow(tab, row) {
      const d = tab.desc, arr = tab.arr;
      const key = d && d.kind === 'table' && d.key && d.key.length ? d.key : null;
      if (!key || !isObj(row)) { arr.push(row); return true; }
      const keyOf = r => key.map(f => (isObj(r) ? r[this.ciKey(r, f)] : r));
      const cmp = (a, b) => { for (let k = 0; k < a.length; k++) { const c = this.cmpValues(a[k], b[k]); if (c) return c; } return 0; };
      const kr = keyOf(row);
      if (d.unique && arr.some(r => cmp(keyOf(r), kr) === 0)) return false;
      if (d.tkind === 'SORTED') {
        let pos = arr.findIndex(r => cmp(keyOf(r), kr) > 0);
        if (pos === -1) pos = arr.length;
        arr.splice(pos, 0, row);
        this.shiftLoops(arr, pos, 1);
        return true;
      }
      arr.push(row);
      return true;
    }

    // INSERT / MODIFY / DELETE / UPDATE on a database table?
    isDbStatement(w, kw) {
      const up = w.map(U);
      const isVar = n => { const r = this.ref(n); return !!(r && Array.isArray(r.get())); };
      const isDb = n => !!n && !isVar(n) && !!this.dbTable(n);
      if (kw === 'UPDATE') return true;
      if (kw === 'INSERT') return (up[1] === 'INTO' && isDb(up[2]) && up.includes('VALUES')) || (!up.includes('INTO') && isDb(up[1]));
      if (kw === 'MODIFY') return isDb(up[1]);
      if (kw === 'DELETE') return (up[1] === 'FROM' && isDb(up[2])) || (isDb(up[1]) && (up[2] === 'FROM' || up.length === 2));
      return false;
    }

    // OpenSQL changes: INSERT dbtab FROM wa | FROM TABLE itab, INSERT INTO dbtab VALUES wa, UPDATE dbtab SET ... WHERE ...,
    // UPDATE dbtab FROM wa, MODIFY dbtab FROM wa | FROM TABLE itab, DELETE FROM dbtab WHERE ..., DELETE dbtab FROM wa
    execDbWrite(t, kw) {
      this.stats.dbWrites++;
      const w = t.words, up = w.map(U);
      const name = (kw === 'INSERT' && up[1] === 'INTO') || (kw === 'DELETE' && up[1] === 'FROM') ? up[2] : up[1];
      const rows = this.dbTable(name);
      if (!rows) {
        this.problem(t, `${kw}: tabel database "${name}" tidak ada di dummy database. Tersedia: ${this.dbNames().join(', ')}`, 'error');
        this.setSy('SUBRC', 4); this.setSy('DBCNT', 0);
        return;
      }
      const desc = this.dbStructDesc(name);
      const keys = (DB_KEYS[name] || (desc ? [desc.fields.filter(f => f.name !== 'MANDT')[0].name] : [])).filter(Boolean);
      const sameKey = (a, b) => keys.every(k => this.compare(a[this.ciKey(a, k)], '=', b[this.ciKey(b, k)]));
      const toRow = wa => {
        const o = desc ? this.initValue(desc) : {};
        for (const k of Object.keys(wa)) if (!desc || this.fieldDesc(desc, k)) o[U(k)] = wa[k];
        if ('MANDT' in o && !o.MANDT) o.MANDT = '800';
        return o;
      };
      // source rows: FROM wa | FROM TABLE itab | VALUES wa | work area with the name of the table
      const srcRows = () => {
        const fi = up.indexOf('FROM', kw === 'DELETE' && up[1] === 'FROM' ? 2 : 1), vi = up.indexOf('VALUES');
        let v;
        if (vi !== -1) v = this.evalExpr(w.slice(vi + 1));
        else if (fi !== -1 && up[fi + 1] === 'TABLE') { const r = this.ref(w[fi + 2]); v = r ? r.get() : []; }
        else if (fi !== -1) v = this.evalExpr(w.slice(fi + 1));
        else v = this.evalExpr([w[1]]);
        const list = Array.isArray(v) ? v : [v];
        return list.filter(isObj);
      };
      let count = 0;

      if (kw === 'UPDATE' && up.includes('SET')) {
        const si = up.indexOf('SET'), wi = up.indexOf('WHERE');
        const setToks = w.slice(si + 1, wi === -1 ? w.length : wi).filter(x => x !== ',');
        const where = wi === -1 ? [] : w.slice(wi + 1);
        const pairs = this.parsePairs(setToks);
        for (const row of rows) {
          if (!this.evalRowWhere(row, where)) continue;
          const prev = this.rowCtx;
          this.rowCtx = { row };
          try {
            const vals = pairs.map(([f, toks]) => [f, this.evalExpr(toks)]);
            for (const [f, v] of vals) row[this.ciKey(row, f)] = v;
          } finally {
            this.rowCtx = prev;
          }
          count++;
        }
      } else if (kw === 'DELETE' && up[1] === 'FROM') {
        const wi = up.indexOf('WHERE');
        const where = wi === -1 ? [] : w.slice(wi + 1);
        for (let n = rows.length - 1; n >= 0; n--) if (this.evalRowWhere(rows[n], where)) { rows.splice(n, 1); count++; }
      } else {
        for (const wa of srcRows()) {
          const idx = rows.findIndex(r => sameKey(r, wa));
          if (kw === 'INSERT') { if (idx === -1) { rows.push(toRow(wa)); count++; } }
          else if (kw === 'UPDATE') { if (idx !== -1) { Object.assign(rows[idx], toRow(wa)); count++; } }
          else if (kw === 'MODIFY') { if (idx === -1) rows.push(toRow(wa)); else Object.assign(rows[idx], toRow(wa)); count++; }
          else if (kw === 'DELETE') { if (idx !== -1) { rows.splice(idx, 1); count++; } }
        }
      }
      this.setSy('SUBRC', count ? 0 : 4);
      this.setSy('DBCNT', count);
    }

    // A record that stands for row `index` of a table (for field symbols and data references)
    rowRec(table, index, lineDesc) {
      const row = table[index];
      return this.aliasRec(
        () => (isObj(row) ? row : table[index]),
        v => { if (isObj(row) && isObj(v)) { for (const k of Object.keys(row)) delete row[k]; Object.assign(row, v); } else table[index] = v; },
        lineDesc);
    }

    // ── Control levels: AT FIRST / AT NEW f / AT END OF f / AT LAST ... ENDAT (inside LOOP) ──
    execAt(tokens, i) {
      const t = tokens[i], up = t.words.map(U);
      const kind = up[1];
      if (!['FIRST', 'LAST', 'NEW', 'END'].includes(kind)) return i + 1;
      let end = i + 1;
      while (end < tokens.length && U(tokens[end].words[0]) !== 'ENDAT') end++;
      const lp = this.loopStack[this.loopStack.length - 1];
      if (!lp) {
        this.problem(t, `AT ${kind} hanya boleh dipakai di dalam LOOP AT internal table`, 'error');
        return end + 1;
      }
      const tab = lp.table, n = lp.index;
      const field = kind === 'NEW' ? up[2] : kind === 'END' ? up[3] : null;
      // a control level is the field plus all fields to its left
      const keyOf = row => {
        if (!isObj(row) || !field) return JSON.stringify(row);
        const keys = Object.keys(row);
        const pos = keys.findIndex(x => x.toUpperCase() === field);
        return JSON.stringify(keys.slice(0, pos + 1).map(x => row[x]));
      };
      let hit = false;
      if (kind === 'FIRST') hit = lp.pass === 1;
      else if (kind === 'LAST') hit = lp.next(n) === -1;
      else if (kind === 'NEW') hit = lp.pass === 1 || lp.prev < 0 || keyOf(tab[n]) !== keyOf(tab[lp.prev]);
      else { const nx = lp.next(n); hit = nx === -1 || keyOf(tab[n]) !== keyOf(tab[nx]); }

      if (hit) {
        const saved = this.atCtx;
        this.atCtx = { kind, field, lp, keyOf };
        try {
          this.execute(tokens, i + 1, end - 1);
        } finally {
          this.atCtx = saved;
          // after ENDAT the work area holds the current row again
          if (lp.waName) this.assignTo(lp.waName, tab[n], t);
          else if (lp.useHeader) lp.rec.header = this.clone(tab[n]);
        }
      }
      return end + 1;
    }

    // SUM inside AT ... ENDAT: totals of the numeric components for the current control level
    execSum(t) {
      const ctx = this.atCtx;
      if (!ctx) {
        this.problem(t, 'SUM hanya boleh dipakai di dalam AT ... ENDAT', 'error');
        return;
      }
      const lp = ctx.lp, tab = lp.table, cur = tab[lp.index];
      if (!isObj(cur)) return;
      const rows = [];
      const sameGroup = row => ctx.kind === 'FIRST' || ctx.kind === 'LAST' || ctx.keyOf(row) === ctx.keyOf(cur);
      for (let m = 0; m < tab.length; m++) if (lp.match(m) && sameGroup(tab[m])) rows.push(tab[m]);
      const target = lp.waName ? this.ref(lp.waName) : null;
      const wa = target ? target.get() : (lp.useHeader ? lp.rec.header : null);
      if (!isObj(wa)) return;
      for (const key of Object.keys(cur)) {
        if (typeof cur[key] !== 'number') continue;
        wa[this.ciKey(wa, key)] = Number(rows.reduce((s, r) => s + (Number(r[key]) || 0), 0).toPrecision(15));
      }
    }

    // COLLECT wa INTO itab: add the numeric components to the row with the same non-numeric components
    execCollect(t) {
      const w = t.words, up = w.map(U);
      const intoIdx = up.indexOf('INTO');
      let tab, src;
      if (intoIdx === -1) {
        const r = w[1] ? this.ref(w[1]) : null;
        if (!r || r.rec.header === undefined || !Array.isArray(r.get())) return;
        tab = { arr: r.get(), desc: r.desc };
        src = r.rec.header;
      } else {
        tab = this.tableRef(w[intoIdx + 1], t, 'COLLECT', w[1]);
        if (!tab) return;
        src = this.evalExpr(w.slice(1, intoIdx));
      }
      if (!isObj(src)) { tab.arr.push(this.clone(src)); this.setSy('TABIX', tab.arr.length); return; }
      const lineDesc = tab.desc && tab.desc.kind === 'table' ? tab.desc.line : null;
      const row = this.shape(lineDesc, this.clone(src));
      const keys = Object.keys(row);
      const idx = tab.arr.findIndex(r => isObj(r) && keys.every(k => typeof row[k] === 'number' || this.compare(r[k], '=', row[k])));
      if (idx === -1) {
        tab.arr.push(row);
        this.setSy('TABIX', tab.arr.length);
      } else {
        for (const k of keys) if (typeof row[k] === 'number') tab.arr[idx][k] = Number(((Number(tab.arr[idx][k]) || 0) + row[k]).toPrecision(15));
        this.setSy('TABIX', idx + 1);
      }
    }

    // "name = expr name2 = expr2 ..." -> [[NAME, exprTokens], ...]
    parsePairs(toks) {
      const lv = this.levels(toks), pairs = [];
      let i = 0;
      while (i < toks.length) {
        if (toks[i + 1] !== '=' || lv[i] !== 0) { i++; continue; }
        const name = U(toks[i]);
        const val = [];
        let j = i + 2;
        while (j < toks.length && !(lv[j] === 0 && toks[j + 1] === '=' && lv[j + 1] === 0)) val.push(toks[j++]);
        pairs.push([name, val]);
        i = j;
      }
      return pairs;
    }

    // "SUM ( price )" -> "SUM(PRICE)" (one token, the key of an aggregated row)
    foldAgg(toks) {
      const out = [];
      for (let i = 0; i < toks.length; i++) {
        if (AGG_FUNCS.has(U(toks[i])) && toks[i + 1] === '(') {
          const c = this.matchParen(toks, i + 1);
          if (c !== -1) { out.push(`${U(toks[i])}(${toks.slice(i + 2, c).map(U).filter(x => x !== 'DISTINCT').join('')})`); i = c; continue; }
        }
        out.push(toks[i]);
      }
      return out;
    }

    isInstanceOf(obj, className) {
      if (!(obj instanceof AbapObject)) return false;
      const CN = U(className);
      for (const c of this.classChain(obj.cls)) {
        if (c.name === CN || c.interfaces.includes(CN)) return true;
      }
      return obj.cls === CN || this.isExcInstance(obj, CN);
    }

    // Operand of an arithmetic expression as a number
    num(v) {
      if (typeof v === 'number') return v;
      if (v === null || v === undefined || v === false) return 0;
      if (v === true) return 1;
      if (typeof v === 'string') {
        if (v.trim() === '') return 0;
        if (isNum(v)) return Number(v);
      }
      this.raiseSys('CX_SY_CONVERSION_NO_NUMBER', `"${this.formatOut(v).slice(0, 40)}" dipakai dalam perhitungan tetapi bukan angka`);
      return 0;
    }

    // Index of the "]..." token that closes the "name[" token at position i, or -1
    closeBracket(w, i) {
      if (!w[i] || !/\[$/.test(w[i]) || /^['`|]/.test(w[i])) return -1;
      const lv = this.levels(w);
      for (let c = i + 1; c < w.length; c++) if (lv[c] === lv[i] && w[c][0] === ']' && !/^['`|]/.test(w[c])) return c;
      return -1;
    }

    // The table behind a name (never the header line)
    tableValue(tok) {
      const r = this.ref(tok);
      return r ? r.get() : this.evalExpr([tok]);
    }

    // Table expression  itab[ idx ]  /  itab[ f1 = v1 f2 = v2 ]  with optional  -comp  suffix
    tableExpr(w, c) {
      const name = w[0].slice(0, -1);
      let inner = w.slice(1, c);
      const path = w[c].slice(1).split('-').filter(Boolean).map(U);
      const tab = this.tableValue(name);
      if (!Array.isArray(tab)) throw { message: `${name}[ ... ]: "${U(name)}" bukan internal table`, line: this.curLine };
      if (U(inner[0]) === 'KEY') inner = inner.slice(2).filter(x => U(x) !== 'COMPONENTS');
      let idx;
      if (inner[1] === '=') {
        const pairs = this.parsePairs(inner).map(([f, toks]) => [f, this.evalExpr(toks)]);
        idx = tab.findIndex(row => pairs.every(([f, v]) => this.compare(f === 'TABLE_LINE' ? row : (isObj(row) ? row[this.ciKey(row, f)] : undefined), '=', v)));
      } else {
        idx = Number(this.evalExpr(inner)) - 1;
      }
      const found = idx >= 0 && idx < tab.length;
      const missing = () => this.raiseSys('CX_SY_ITAB_LINE_NOT_FOUND', `Baris ${U(name)}[ ${inner.join(' ')} ] tidak ada`);
      return {
        found, index: idx, table: tab,
        get: () => {
          if (!found) missing();
          let v = tab[idx];
          for (const p of path) v = isObj(v) ? v[this.ciKey(v, p)] : undefined;
          return v === undefined ? '' : v;
        },
        set: v => {
          if (!found) missing();
          if (!path.length) { tab[idx] = v; return; }
          let o = tab[idx];
          for (let k = 0; k < path.length - 1 && isObj(o); k++) o = o[this.ciKey(o, path[k])];
          if (isObj(o)) o[this.ciKey(o, path[path.length - 1])] = v;
        }
      };
    }

    // Built-in functions: strlen( x ), lines( itab ), to_upper( x ), substring( val = s off = 1 len = 2 ) ...
    builtin(name, args, w) {
      if (name === 'LINE_EXISTS' || name === 'LINE_INDEX') {
        const c = this.closeBracket(args, 0);
        const te = c !== -1 ? this.tableExpr(args, c) : null;
        return name === 'LINE_EXISTS' ? !!(te && te.found) : (te && te.found ? te.index + 1 : 0);
      }
      if (name === 'LINES') {
        const tv = args.length === 1 ? this.tableValue(args[0]) : this.evalExpr(args);
        return Array.isArray(tv) ? tv.length : 0;
      }
      if (name === 'XSDBOOL' || name === 'BOOLC') return this.evalCond(args) ? 'X' : '';

      const A = {};
      if (args[1] === '=') {
        for (const [k, toks] of this.parsePairs(args)) A[k] = k === 'TABLE' && toks.length === 1 ? this.tableValue(toks[0]) : this.evalExpr(toks);
      } else {
        A.VAL = this.evalExpr(args);
      }
      const s = () => this.formatOut(A.VAL);
      const str = k => (A[k] === undefined ? '' : this.formatOut(A[k]));
      const n = k => (A[k] === undefined ? undefined : this.num(A[k]));
      // regex = '...' / pcre = '...' ; case = abap_false makes it ignore upper / lower case
      const hasRx = A.REGEX !== undefined || A.PCRE !== undefined;
      const rxFlags = A.CASE !== undefined && !A.CASE ? 'i' : '';
      const rx = extra => this.abapRegex(str(A.REGEX !== undefined ? 'REGEX' : 'PCRE'), extra + rxFlags);
      switch (name) {
        case 'STRLEN': case 'NUMOFCHAR': return s().length;
        case 'ABS':    return Math.abs(this.num(A.VAL));
        case 'SIGN':   return Math.sign(this.num(A.VAL));
        case 'CEIL':   return Math.ceil(this.num(A.VAL));
        case 'FLOOR':  return Math.floor(this.num(A.VAL));
        case 'TRUNC':  return Math.trunc(this.num(A.VAL));
        case 'FRAC':   return Number((this.num(A.VAL) - Math.trunc(this.num(A.VAL))).toPrecision(12));
        case 'SQRT':   return Math.sqrt(this.num(A.VAL));
        case 'ROUND': { const f = Math.pow(10, n('DEC') || 0); return Math.round(this.num(A.VAL) * f) / f; }
        case 'IPOW':   return Math.pow(n('BASE') || 0, n('EXP') || 0);
        case 'NMAX':   return Math.max(...Object.keys(A).filter(k => /^VAL\d$/.test(k)).map(k => this.num(A[k])));
        case 'NMIN':   return Math.min(...Object.keys(A).filter(k => /^VAL\d$/.test(k)).map(k => this.num(A[k])));
        case 'TOUPPER': case 'TO_UPPER': return s().toUpperCase();
        case 'TOLOWER': case 'TO_LOWER': return s().toLowerCase();
        case 'CONDENSE': return s().trim().replace(/\s+/g, ' ');
        case 'REVERSE': return [...s()].reverse().join('');
        case 'REPEAT': return s().repeat(Math.max(0, n('OCC') || 0));
        case 'SUBSTRING': return A.LEN === undefined ? s().substr(n('OFF') || 0) : s().substr(n('OFF') || 0, n('LEN'));
        case 'SUBSTRING_BEFORE': { const p = s().indexOf(str('SUB')); return p === -1 ? '' : s().slice(0, p); }
        case 'SUBSTRING_AFTER': { const p = s().indexOf(str('SUB')); return p === -1 ? '' : s().slice(p + str('SUB').length); }
        case 'REPLACE':
          if (hasRx) return s().replace(rx(n('OCC') === 0 ? 'g' : ''), str('WITH').replace(/\$0/g, '$$&'));
          return n('OCC') === 0 ? s().split(str('SUB')).join(str('WITH')) : s().replace(str('SUB'), () => str('WITH'));
        case 'MATCHES': return hasRx ? new RegExp('^(?:' + rx('').source + ')$', rxFlags).test(s()) : false;
        case 'MATCH': {
          if (!hasRx) return '';
          const all = s().match(rx('g')) || [];
          const occ = n('OCC') === undefined ? 1 : n('OCC');
          const hit = occ > 0 ? all[occ - 1] : all[all.length + occ];
          return hit === undefined ? '' : hit;
        }
        case 'TO_MIXED': {
          const sep = A.SEP === undefined ? '_' : str('SEP');
          return s().toLowerCase().split(sep).map((p, k) => (k === 0 ? p.toUpperCase().slice(0, 1) + p.slice(1) : p.slice(0, 1).toUpperCase() + p.slice(1))).join('');
        }
        case 'FROM_MIXED': {
          const sep = A.SEP === undefined ? '_' : str('SEP');
          return s().replace(/([a-z0-9])([A-Z])/g, '$1' + sep + '$2').toUpperCase();
        }
        case 'SEGMENT': {
          const parts = s().split(A.SEP === undefined ? ' ' : str('SEP'));
          const k = n('INDEX') || 1;
          const hit = k > 0 ? parts[k - 1] : parts[parts.length + k];
          return hit === undefined ? '' : hit;
        }
        case 'SHIFT_LEFT': {
          if (A.SUB !== undefined) { let v = s(); while (str('SUB') && v.startsWith(str('SUB'))) v = v.slice(str('SUB').length); return v; }
          return s().slice(n('PLACES') === undefined ? 1 : n('PLACES'));
        }
        case 'SHIFT_RIGHT': {
          if (A.SUB !== undefined) { let v = s(); while (str('SUB') && v.endsWith(str('SUB'))) v = v.slice(0, -str('SUB').length); return v; }
          return s().slice(0, Math.max(0, s().length - (n('PLACES') === undefined ? 1 : n('PLACES'))));
        }
        case 'CONTAINS':
          if (hasRx) return rx('').test(s());
          if (A.SUB !== undefined) return s().includes(str('SUB'));
          if (A.START !== undefined) return s().startsWith(str('START'));
          if (A.END !== undefined) return s().endsWith(str('END'));
          return false;
        case 'FIND': return hasRx ? s().search(rx('')) : s().indexOf(str('SUB'));
        case 'COUNT': return hasRx ? (s().match(rx('g')) || []).length : (str('SUB') ? s().split(str('SUB')).length - 1 : 0);
        case 'CONCAT_LINES_OF': return (Array.isArray(A.TABLE) ? A.TABLE : (Array.isArray(A.VAL) ? A.VAL : [])).map(x => this.formatOut(x)).join(str('SEP'));
      }
      return w.join(' ');
    }

    // Constructor operators. `type` is a type name or '#', `inner` the tokens between the parentheses
    evalCtor(op, type, inner) {
      const d = type === '#' ? null : this.resolveNamed(type);
      const lv = this.levels(inner);
      const up = inner.map(U);
      const at0 = (k, word) => lv[k] === 0 && up[k] === word && !/^['`|]/.test(inner[k]);
      const nextOf = (from, list) => { for (let k = from; k < inner.length; k++) if (lv[k] === 0 && list.includes(up[k])) return k; return inner.length; };

      // LET a = expr b = expr IN ... : helper variables that live only inside this expression
      if (up[0] === 'LET') {
        const inIdx = nextOf(1, ['IN']);
        const saved = {};
        try {
          for (const [name, toks] of this.parsePairs(inner.slice(1, inIdx))) {
            if (!(name in saved)) saved[name] = this.variables[name];
            const v = this.evalExpr(toks);
            this.variables[name] = { type: this.typeLabelOf(v), value: this.clone(v) };
          }
          return this.evalCtor(op, type, inner.slice(inIdx + 1));
        } finally {
          for (const name of Object.keys(saved)) { if (saved[name] === undefined) delete this.variables[name]; else this.variables[name] = saved[name]; }
        }
      }

      switch (op) {
        case 'FILTER': {
          // FILTER type( itab [EXCEPT] [USING KEY k] WHERE c = v [AND ...] )
          // FILTER type( itab [EXCEPT] IN ftab WHERE c = f )
          const tab = inner.length ? this.tableValue(inner[0]) : null;
          if (!Array.isArray(tab)) return [];
          const wi = nextOf(1, ['WHERE']);
          const head = up.slice(1, wi);
          const except = head.includes('EXCEPT');
          const ii = head.indexOf('IN');
          const where = inner.slice(wi + 1);
          let keep;
          if (ii !== -1) {
            const ftab = this.tableValue(inner[ii + 2]);
            const fl = Array.isArray(ftab) ? ftab : [];
            const pairs = this.parsePairs(where.filter(x => U(x) !== 'AND'));
            const of = (o, name) => (name === 'TABLE_LINE' || !isObj(o) ? o : o[this.ciKey(o, name)]);
            keep = row => fl.some(fr => pairs.every(([c, toks]) => this.compare(of(row, c), '=', of(fr, U(toks[0])))));
          } else {
            keep = row => !where.length || this.evalRowWhere(row, where);
          }
          return tab.filter(row => !!keep(row) !== except).map(row => this.clone(row));
        }
        case 'VALUE': {
          // VALUE #( itab[ ... ] OPTIONAL | DEFAULT x ): no exception when the row does not exist
          if (inner.length && /\[$/.test(inner[0]) && (up.includes('OPTIONAL') || up.includes('DEFAULT'))) {
            const te = this.tableExpr(inner, this.closeBracket(inner, 0));
            if (te.found) return te.get();
            const di = up.indexOf('DEFAULT');
            return di !== -1 ? this.evalExpr(inner.slice(di + 1)) : (d ? this.initValue(d) : '');
          }
          const v = this.parseCtorBody(inner);
          if (!d) return v;
          return d.kind === 'table' && isObj(v) && !Object.keys(v).length ? [] : this.shape(d, v);
        }
        case 'COND': {
          let k = 0;
          while (k < inner.length) {
            if (at0(k, 'WHEN')) {
              const th = nextOf(k + 1, ['THEN']), en = nextOf(th + 1, ['WHEN', 'ELSE']);
              if (this.evalCond(inner.slice(k + 1, th))) return this.evalExpr(inner.slice(th + 1, en));
              k = en;
            } else if (at0(k, 'ELSE')) {
              return this.evalExpr(inner.slice(k + 1));
            } else {
              k++;
            }
          }
          return d ? this.initValue(d) : '';
        }
        case 'SWITCH': {
          const first = nextOf(0, ['WHEN', 'ELSE']);
          const val = this.evalExpr(inner.slice(0, first));
          let k = first;
          while (k < inner.length) {
            if (at0(k, 'WHEN')) {
              const th = nextOf(k + 1, ['THEN']), en = nextOf(th + 1, ['WHEN', 'ELSE']);
              let alt = [], hit = false;
              for (const x of inner.slice(k + 1, th).concat(['OR'])) {
                if (U(x) === 'OR') { if (alt.length && this.compare(val, '=', this.evalExpr(alt))) hit = true; alt = []; }
                else alt.push(x);
              }
              if (hit) return this.evalExpr(inner.slice(th + 1, en));
              k = en;
            } else if (at0(k, 'ELSE')) {
              return this.evalExpr(inner.slice(k + 1));
            } else {
              k++;
            }
          }
          return d ? this.initValue(d) : '';
        }
        case 'CONV':
        case 'EXACT': {
          const v = this.evalExpr(inner);
          if (!d) return v;
          if (d.kind === 'elem' && d.base === 'string') return this.formatOut(v);
          return this.shape(d, v);
        }
        case 'CAST': {
          const v = this.evalExpr(inner);
          if (v instanceof AbapObject && d === null) return v;
          if (v instanceof AbapObject && (this.classes[U(type)] || this.interfaces[U(type)]) && !this.isInstanceOf(v, type)) {
            this.raiseSys('CX_SY_MOVE_CAST_ERROR', `Objek ${v.cls} tidak bisa di-cast ke ${U(type)}`);
          }
          return v;
        }
        case 'REF':
          return this.makeRef(inner[0]);
        case 'REDUCE': {
          // REDUCE type( INIT x = 0 FOR wa IN itab [WHERE ( ... )] NEXT x = x + wa-f )
          const fi = nextOf(0, ['FOR']), ni = nextOf(fi + 1, ['NEXT']);
          const init = this.parsePairs(inner.slice(1, fi)).map(([name, toks]) => [name, this.evalExpr(toks.filter((x, idx, arr) => U(x) !== 'TYPE' && U(arr[idx - 1]) !== 'TYPE'))]);
          const next = this.parsePairs(inner.slice(ni + 1));
          if (!init.length) return '';
          const saved = {};
          for (const [name, v] of init) { saved[name] = this.variables[name]; this.variables[name] = { type: this.typeLabelOf(v), value: this.clone(v) }; }
          try {
            this.runFor(inner.slice(fi + 1, ni), () => {
              for (const [name, toks] of next) if (this.variables[name]) this.variables[name].value = this.evalExpr(toks);
            });
            const res = this.variables[init[0][0]].value;
            return d ? this.shape(d, res) : res;
          } finally {
            for (const name of Object.keys(saved)) { if (saved[name] === undefined) delete this.variables[name]; else this.variables[name] = saved[name]; }
          }
        }
        case 'CORRESPONDING': {
          // CORRESPONDING type( src [MAPPING t = s ...] [EXCEPT f ...] )
          let k = 0;
          if (up[0] === 'BASE') k = inner.indexOf(')') + 1;
          const mi = nextOf(k, ['MAPPING']), ei = nextOf(k, ['EXCEPT']);
          const srcToks = inner.slice(k, Math.min(mi, ei));
          const src = srcToks.length === 1 ? (() => { const r = this.ref(srcToks[0]); return r ? r.get() : this.evalExpr(srcToks); })() : this.evalExpr(srcToks);
          const map = {};
          if (mi < inner.length) for (const [tgt, toks] of this.parsePairs(inner.slice(mi + 1, ei > mi ? ei : inner.length))) map[tgt] = U(toks[0]);
          const except = ei < inner.length ? inner.slice(ei + 1, mi > ei ? mi : inner.length).map(U) : [];
          const lineD = d ? (d.kind === 'table' ? d.line : d) : null;
          const conv = row => {
            if (!isObj(row)) return row;
            const typed = lineD && lineD.kind === 'struct';
            const o = typed ? this.initValue(lineD) : {};
            const names = typed ? lineD.fields.map(f => f.name) : [...new Set(Object.keys(row).map(U).concat(Object.keys(map)))];
            for (const nm of names) {
              if (except.includes(nm)) continue;
              const key = this.ciKey(row, map[nm] || nm);
              if (key in row) o[nm] = this.clone(row[key]);
            }
            return o;
          };
          return Array.isArray(src) ? src.map(conv) : conv(src);
        }
      }
      return '';
    }

    // Data reference to a variable / component:  REF #( x ),  GET REFERENCE OF x INTO dref
    makeRef(tok) {
      const r = tok ? this.ref(tok) : null;
      if (!r) {
        this.problem(this.curT, `REF: "${U(tok)}" belum dideklarasikan`, 'error');
        return null;
      }
      return new DataRef(r.isField ? this.aliasRec(r.get, r.set, r.desc) : r.rec);
    }

    // FOR var IN itab [INDEX INTO idx] [WHERE ( cond )]   /   FOR i = start [THEN expr] UNTIL | WHILE cond
    runFor(forToks, fn) {
      const up = forToks.map(U);
      const NAME = up[0];
      const saved = this.variables[NAME];
      try {
        if (NAME === 'GROUPS' && up[2] === 'OF' && up[4] === 'IN') {
          // FOR GROUPS g OF r IN itab [WHERE ( cond )] GROUP BY key [ASCENDING | DESCENDING]
          const G = up[1], R = up[3];
          const tab = this.tableValue(forToks[5]);
          if (!Array.isArray(tab)) return;
          const lv = this.levels(forToks);
          const gi = up.findIndex((x, pos) => pos > 5 && lv[pos] === 0 && x === 'GROUP' && up[pos + 1] === 'BY');
          if (gi === -1) return;
          const wi = up.indexOf('WHERE');
          const where = wi !== -1 && wi < gi ? this.stripParens(forToks.slice(wi + 1, gi)) : [];
          let ke = gi + 2;
          while (ke < forToks.length && !(lv[ke] === 0 && ['ASCENDING', 'DESCENDING', 'WITHOUT'].includes(up[ke]))) ke++;
          const order = up.slice(ke).includes('DESCENDING') ? 'DESCENDING' : up.slice(ke).includes('ASCENDING') ? 'ASCENDING' : null;
          const savedR = this.variables[R], savedG = this.variables[G], savedM = this.groupMembers[G];
          try {
            const items = [];
            tab.forEach((row, pos) => { if (!where.length || this.evalRowWhere(row, where)) items.push({ row, index: pos }); });
            const groups = this.buildGroups(items, it => { this.variables[R] = { type: this.typeLabelOf(it.row), value: it.row }; }, forToks.slice(gi + 2, ke), order);
            for (const g of groups) {
              this.variables[G] = { type: this.typeLabelOf(g.key), value: g.key };
              this.groupMembers[G] = { rows: g.rows, lineDesc: null };
              fn();
            }
          } finally {
            if (savedR === undefined) delete this.variables[R]; else this.variables[R] = savedR;
            if (savedG === undefined) delete this.variables[G]; else this.variables[G] = savedG;
            if (savedM === undefined) delete this.groupMembers[G]; else this.groupMembers[G] = savedM;
          }
        } else if (up[1] === 'IN') {
          const inGroup = up[2] === 'GROUP' && this.groupMembers[up[3]];
          const tab = inGroup ? inGroup.rows : this.tableValue(forToks[2]);
          if (!Array.isArray(tab)) return;
          const wi = up.indexOf('WHERE'), xi = up.indexOf('INDEX');
          const where = wi !== -1 ? this.stripParens(forToks.slice(wi + 1)) : [];
          const idxName = xi !== -1 && up[xi + 1] === 'INTO' ? up[xi + 2] : null;
          const savedIdx = idxName ? this.variables[idxName] : undefined;
          try {
            tab.forEach((row, n) => {
              this.variables[NAME] = { type: this.typeLabelOf(row), value: row };
              if (idxName) this.variables[idxName] = { type: 'int', value: n + 1 };
              if (where.length && !this.evalRowWhere(row, where)) return;
              fn();
            });
          } finally {
            if (idxName) { if (savedIdx === undefined) delete this.variables[idxName]; else this.variables[idxName] = savedIdx; }
          }
        } else if (forToks[1] === '=') {
          const lv = this.levels(forToks);
          const find = word => { for (let k = 2; k < forToks.length; k++) if (lv[k] === 0 && up[k] === word) return k; return -1; };
          const ti = find('THEN'), ui = find('UNTIL'), wi = find('WHILE');
          const ci = ui !== -1 ? ui : wi;
          const firstKw = Math.min(...[ti, ci].filter(k => k !== -1), forToks.length);
          const rec = { type: 'int', value: this.evalExpr(forToks.slice(2, firstKw)) };
          this.variables[NAME] = rec;
          const cond = ci !== -1 ? forToks.slice(ci + 1) : [];
          const step = ti !== -1 ? forToks.slice(ti + 1, ci > ti ? ci : forToks.length) : null;
          for (let guard = 0; guard < 100000; guard++) {
            if (ci !== -1) { const c = this.evalCond(cond); if (ui !== -1 ? c : !c) break; }
            fn();
            rec.value = step ? this.evalExpr(step) : this.num(rec.value) + 1;
            if (ci === -1) break;
          }
        }
      } finally {
        if (saved === undefined) delete this.variables[NAME];
        else this.variables[NAME] = saved;
      }
    }

    // GET REFERENCE OF x INTO dref.
    execGetReference(t) {
      const w = t.words, up = w.map(U);
      const oi = up.indexOf('OF'), ii = up.indexOf('INTO');
      if (oi === -1 || ii === -1) return;
      const ref = this.makeRef(w[oi + 1]);
      if (ref) this.assignTo(this.targetName(w, ii + 1), ref, t);
    }

    // SET HANDLER ... / SET PARAMETER ID 'X' FIELD v  (other SET statements are ignored)
    execSet(t) {
      const w = t.words, up = w.map(U);
      if (up[1] === 'HANDLER') { this.execSetHandler(t); return; }
      if (up[1] === 'PARAMETER' && up[2] === 'ID') {
        const fi = up.indexOf('FIELD');
        this.spa = this.spa || {};
        if (fi !== -1) this.spa[this.formatOut(this.evalExpr([w[3]]))] = this.formatOut(this.evalExpr(w.slice(fi + 1)));
      }
    }

    // GET REFERENCE OF x INTO dref / GET PARAMETER ID 'X' FIELD v / GET TIME
    execGet(t) {
      const w = t.words, up = w.map(U);
      if (up[1] === 'REFERENCE') { this.execGetReference(t); return; }
      if (up[1] === 'PARAMETER' && up[2] === 'ID') {
        const fi = up.indexOf('FIELD');
        const id = this.formatOut(this.evalExpr([w[3]]));
        const has = this.spa && id in this.spa;
        if (fi !== -1 && has) this.assignTo(w[fi + 1], this.spa[id], t);
        this.setSy('SUBRC', has ? 0 : 4);
      }
    }

    // SET HANDLER h1 [h2 ...] FOR src | FOR ALL INSTANCES.   handler = obj->meth | cls=>meth | own_method
    execSetHandler(t) {
      const w = t.words, up = w.map(U);
      const fi = up.indexOf('FOR');
      const hTok = w.slice(2, fi === -1 ? w.length : fi);
      const fr = this.frames[this.frames.length - 1];
      const list = [];
      for (let i = 0; i < hTok.length; i++) {
        if (hTok[i + 1] === '->' || hTok[i + 1] === '=>') {
          const isStatic = hTok[i + 1] === '=>';
          const obj = isStatic ? null : this.evalAtom(hTok[i]);
          list.push({ obj: obj instanceof AbapObject ? obj : null, cls: isStatic ? U(hTok[i]) : (obj instanceof AbapObject ? obj.cls : null), meth: U(hTok[i + 2]) });
          i += 2;
        } else {
          list.push({ obj: fr ? fr.obj || null : null, cls: fr ? (fr.obj ? fr.obj.cls : fr.cls) || null : null, meth: U(hTok[i]) });
        }
      }
      let src = null, all = fi === -1;
      if (fi !== -1) {
        if (up[fi + 1] === 'ALL') all = true;
        else {
          const ai = up.indexOf('ACTIVATION');
          src = this.evalExpr(w.slice(fi + 1, ai === -1 ? w.length : ai));
        }
      }
      for (const h of list) {
        const m = h.cls ? this.findMethod(h.cls, h.meth) : null;
        if (!m) {
          this.problem(t, `SET HANDLER: method "${h.meth}" tidak ditemukan${h.cls ? ' di class ' + h.cls : ' (objek handler belum dibuat?)'}`, 'error');
          continue;
        }
        h.event = (m.sig && m.sig.event) || null;
        if (!h.event) this.problem(t, `SET HANDLER: method "${h.meth}" bukan event handler (deklarasinya harus METHODS ${h.meth.toLowerCase()} FOR EVENT ... OF ...)`, 'error');
        if (src instanceof SalvProxy) src.alv.handlers.push(h);
        else this.handlers.push(Object.assign(h, { src: all ? null : src }));
      }
    }

    salvFactory(p, t) {
      const objTok = p.IMPORTING.R_SALV_TABLE, tabTok = p.CHANGING.T_TABLE;
      if (!objTok || !tabTok) {
        this.problem(t, 'cl_salv_table=>factory: butuh IMPORTING r_salv_table = ... dan CHANGING t_table = ...', 'error');
        return;
      }
      const r = this.ref(tabTok[0]);
      if (!r || !Array.isArray(r.get())) {
        this.raiseSys('CX_SALV_MSG', `cl_salv_table=>factory: t_table = ${String(tabTok[0]).toLowerCase()} bukan internal table`);
      }
      const alv = {
        itabName: U(tabTok[0]).replace(/^@/, '').replace(/\[\]$/, ''), tab: r,
        zebra: false, title: '', optimize: false, columns: {}, sorts: [], sums: [], handlers: []
      };
      const target = /^@?(DATA|FINAL)$/i.test(objTok[0]) && objTok[1] === '(' ? [this.targetName(objTok, 0)] : objTok;
      this.assignChain(target, new SalvProxy(alv, 'table'), t);
    }

    // Methods of the SALV object model (CL_SALV_TABLE and its helper objects)
    salvCall(p, M, argWords, t) {
      const alv = p.alv;
      const args = this.parseArgs(argWords);
      const named = k => (args.params.EXPORTING[k] ? this.evalExpr(args.params.EXPORTING[k]) : undefined);
      const first = () => {
        const toks = args.positional || Object.values(args.params.EXPORTING)[0];
        return toks ? this.evalExpr(toks) : undefined;
      };
      const on = v => v === undefined || v === 'X' || v === true;        // default: abap_true
      const sub = kind => new SalvProxy(alv, kind);

      if (p.kind === 'table') {
        switch (M) {
          case 'DISPLAY': this.salvDisplay(alv, t); return '';
          case 'GET_COLUMNS': return sub('columns');
          case 'GET_DISPLAY_SETTINGS': return sub('display');
          case 'GET_EVENT': return sub('events');
          case 'GET_SORTS': return sub('sorts');
          case 'GET_AGGREGATIONS': return sub('aggregations');
        }
        return sub('other');
      }
      if (p.kind === 'columns') {
        if (M === 'SET_OPTIMIZE') { alv.optimize = on(first()); return ''; }
        if (M === 'GET_COLUMN') {
          const name = U(this.formatOut(named('COLUMNNAME') !== undefined ? named('COLUMNNAME') : first()));
          const d = alv.tab.desc && alv.tab.desc.kind === 'table' ? alv.tab.desc.line : null;
          const rows = alv.tab.get();
          const names = d && d.kind === 'struct' ? d.fields.map(f => f.name) : (isObj(rows[0]) ? Object.keys(rows[0]).map(U) : null);
          if (names && !names.includes(name)) this.raiseSys('CX_SALV_NOT_FOUND', `Kolom "${name}" tidak ada di tabel ${alv.itabName}`);
          return new SalvProxy(alv, 'column', name);
        }
        return sub('other');
      }
      if (p.kind === 'column') {
        const c = alv.columns[p.column] = alv.columns[p.column] || {};
        const v = first();
        switch (M) {
          case 'SET_SHORT_TEXT': c.short = this.formatOut(v); break;
          case 'SET_MEDIUM_TEXT': c.medium = this.formatOut(v); break;
          case 'SET_LONG_TEXT': c.long = this.formatOut(v); break;
          case 'SET_VISIBLE': c.hidden = !on(v); break;
          case 'SET_TECHNICAL': c.hidden = on(v); break;
          case 'SET_CELL_TYPE': c.hotspot = Number(v) === STD_CONSTANTS['IF_SALV_C_CELL_TYPE=>HOTSPOT'] || Number(v) === STD_CONSTANTS['IF_SALV_C_CELL_TYPE=>LINK']; break;
          case 'SET_OUTPUT_LENGTH': c.outputlen = Number(v) || 0; break;
          case 'SET_KEY': c.key = on(v); break;
        }
        return '';
      }
      if (p.kind === 'display') {
        if (M === 'SET_STRIPED_PATTERN') alv.zebra = on(first());
        if (M === 'SET_LIST_HEADER') alv.title = this.formatOut(first());
        return '';
      }
      if (p.kind === 'sorts' && M === 'ADD_SORT') {
        const f = named('COLUMNNAME') !== undefined ? named('COLUMNNAME') : first();
        alv.sorts.push({ FIELDNAME: U(this.formatOut(f)), DOWN: Number(named('SEQUENCE')) === STD_CONSTANTS['IF_SALV_C_SORT=>SORT_DOWN'] ? 'X' : '' });
        return sub('other');
      }
      if (p.kind === 'aggregations' && M === 'ADD_AGGREGATION') {
        const f = named('COLUMNNAME') !== undefined ? named('COLUMNNAME') : first();
        alv.sums.push(U(this.formatOut(f)));
        return sub('other');
      }
      return p.kind === 'other' ? p : sub('other');
    }

    // lo_alv->display( ).
    salvDisplay(alv, t) {
      const r = alv.tab, data = r.get();
      if (!Array.isArray(data)) {
        this.problem(t, `SALV: "${alv.itabName}" bukan internal table`, 'error');
        return;
      }
      this.showAlv({
        t, mode: 'CL_SALV_TABLE', tableName: alv.itabName, data,
        lineDesc: r.desc && r.desc.kind === 'table' ? r.desc.line : null,
        layout: alv.zebra ? { ZEBRA: 'X' } : {}, title: alv.title || '',
        sort: alv.sorts, salv: alv,
        callback: alv.handlers.length ? { handlers: alv.handlers } : null
      });
    }

    // STATICS x TYPE ...: a local variable that keeps its value between calls of the same FORM / method
    execStatics(t) {
      const fr = this.frames[this.frames.length - 1];
      if (!fr) { this.execData(t, false); return; }
      if (this.once(t)) return;
      const w = t.words;
      if (!w[1] || U(w[1]) === 'BEGIN' || U(w[1]) === 'END') return;
      const { name, desc, value } = this.parseDecl(w);
      this.staticVars = this.staticVars || {};
      const key = `${fr.name}/${name}`;
      const rec = this.staticVars[key] || (this.staticVars[key] = { type: this.typeLabel(desc), value: value !== undefined ? value : this.initValue(desc), desc });
      if (!(name in fr.saved)) fr.saved[name] = this.variables[name];
      this.variables[name] = rec;
    }

    // ── Syntax checker ─────────────────────────────────────
    checkSyntax(code) {
      const issues = [];
      const lines = String(code || '').split('\n');

      // Track block openers/closers
      const stack = [];
      const pairs = {
        'IF': 'ENDIF', 'DO': 'ENDDO', 'WHILE': 'ENDWHILE',
        'LOOP': 'ENDLOOP', 'CASE': 'ENDCASE',
        'FORM': 'ENDFORM', 'CLASS': 'ENDCLASS', 'METHOD': 'ENDMETHOD',
        'TRY': 'ENDTRY', 'INTERFACE': 'ENDINTERFACE'
      };
      const closers = new Set(Object.values(pairs));
      // keywords that can only stand at the beginning of a statement
      const starters = new Set(('REPORT WRITE DATA TYPES CONSTANTS PARAMETERS SELECT-OPTIONS IF ELSEIF ENDIF LOOP ENDLOOP DO ENDDO ' +
        'WHILE ENDWHILE ENDCASE PERFORM FORM ENDFORM APPEND CLEAR CALL MOVE READ SORT MESSAGE CONCATENATE SPLIT TRANSLATE CONDENSE ' +
        'RETURN CONTINUE CHECK ULINE SKIP TRY ENDTRY CATCH CLASS ENDCLASS METHOD ENDMETHOD START-OF-SELECTION CREATE RAISE').split(' '));
      let stmtOpen = false;   // previous code line did not end with "."
      let openLine = 0;       // ... and that line, if it also did not end with "," or ":"

      for (let i = 0; i < lines.length; i++) {
        const raw = lines[i].trim();
        if (!raw || raw.startsWith('"')) continue;
        if (raw.startsWith('*')) {
          if (!lines[i].startsWith('*') && !stmtOpen) {
            issues.push({ line: i + 1, type: 'warning',
              msg: 'Komentar "*" harus dimulai di kolom 1. Di SAP baris ini syntax error — untuk komentar menjorok pakai tanda kutip ganda (").' });
          }
          if (!stmtOpen || lines[i].startsWith('*')) continue;
        }

        // Strip inline comments
        // a " inside a literal ('...', `...`, |...|) is not a comment
        let cut = -1, quote = '';
        for (let p = 0; p < raw.length; p++) {
          const ch = raw[p];
          if (quote) { if (ch === quote) quote = ''; }
          else if (ch === "'" || ch === '`' || ch === '|') quote = ch;
          else if (ch === '"') { cut = p; break; }
        }
        const noComment = (cut < 0 ? raw : raw.slice(0, cut)).trim();
        if (!noComment) continue;

        const words = noComment.toUpperCase().split(/\s+/);
        // Strip colon (chain) AND trailing period from keyword
        const kw = words[0].replace(/[:.]+$/, '');

        // a new statement begins although the previous one was never closed
        if (openLine && starters.has(kw) && words[1] !== '=') {      // "return = gs_ret" is a parameter, not RETURN
          issues.push({ line: openLine, type: 'error', msg: `Statement di baris ${openLine} tidak diakhiri titik (.) — baris berikutnya ikut terbaca sebagai lanjutannya` });
        }
        const continued = stmtOpen;      // this line continues the statement of the previous line
        stmtOpen = !/\.$/.test(noComment);
        openLine = stmtOpen && !/[,:]$/.test(noComment) ? i + 1 : 0;

        // Block matching — skip non-block keywords that look like openers
        const skipKws = new Set(['START-OF-SELECTION', 'END-OF-SELECTION', 'AT', 'SELECTION-SCREEN',
          'INITIALIZATION', 'AT-SELECTION-SCREEN', 'END-OF-PAGE', 'TOP-OF-PAGE']);
        const noBlock = (kw === 'CLASS' || kw === 'INTERFACE') && /\b(DEFERRED|LOAD)\b/.test(noComment.toUpperCase());
        if (!skipKws.has(kw) && !noBlock) {
          if (pairs[kw] && !(kw === 'CASE' && continued)) stack.push({ kw, line: i + 1 });      // CASE ... END inside a SELECT is an expression
          if (closers.has(kw)) {
            if (!stack.length) {
              issues.push({ line: i + 1, msg: `Unexpected "${kw}" without matching opener`, type: 'error' });
            } else {
              const last = stack[stack.length - 1];
              if (pairs[last.kw] !== kw) {
                issues.push({ line: i + 1, msg: `Expected "${pairs[last.kw]}" but found "${kw}"`, type: 'error' });
              } else {
                stack.pop();
              }
            }
          }
        }

        // Simple keyword typo detection
        const typos = { 'ENDIFS': 'ENDIF', 'ENDLOOPS': 'ENDLOOP', 'ENDDOS': 'ENDDO', 'ENDWHILES': 'ENDWHILE' };
        if (typos[kw]) issues.push({ line: i + 1, msg: `Possible typo: "${kw}" → did you mean "${typos[kw]}"?`, type: 'warning' });
      }

      // Unclosed blocks
      for (const b of stack) {
        issues.push({ line: b.line, msg: `Unclosed "${b.kw}" (missing "${pairs[b.kw]}")`, type: 'error' });
      }

      // Statement-level checks: PERFORM targets and function modules
      try {
        const tokens = this.tokenize(this.preprocess(code));
        const forms = new Set(tokens.filter(t => U(t.words[0]) === 'FORM').map(t => U(t.words[1])));
        const fms = Object.assign({}, this.functionModules());
        for (const t of tokens) if (U(t.words[0]) === 'FUNCTION' && t.words[1]) fms[U(t.words[1])] = true;   // written in this program
        for (const t of tokens) {
          const kw = U(t.words[0]);
          if (kw === 'PERFORM' && t.words[1] && !forms.has(U(t.words[1])) && !t.words.some(x => U(x) === 'PROGRAM')) {
            issues.push({ line: t.lineNo, msg: `PERFORM "${U(t.words[1])}": FORM tidak ditemukan di program ini`, type: 'error' });
          }
          if (kw === 'CALL' && U(t.words[1]) === 'FUNCTION' && /^'/.test(t.words[2] || '')) {
            const fn = U(t.words[2].slice(1, -1));
            if (!fms[fn] && !/^(EN|DE)QUEUE_/.test(fn)) issues.push({ line: t.lineNo, msg: `Function module "${fn}" belum disimulasikan di studio ini (akan dilewati saat Run)`, type: 'warning' });
          }
        }
      } catch (e) { /* statement checks are best-effort */ }

      issues.sort((a, b) => a.line - b.line);
      if (!issues.length) issues.push({ line: 0, msg: 'No syntax issues found ✓', type: 'ok' });
      return issues;
    }
  }

  window.ABAPInterpreter = ABAPInterpreter;
})();

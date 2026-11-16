// docs.js — ABAP Quick Reference documentation
// ABAP Code Studio — Created by jeffrypurwanto

window.ABAP_DOCS = [
  {
    id: 'intro',
    title: 'Pengantar ABAP',
    content: `
      <h3>Apa itu ABAP?</h3>
      <p>ABAP (Advanced Business Application Programming) adalah bahasa pemrograman tingkat tinggi yang dikembangkan oleh SAP. ABAP digunakan untuk mengembangkan aplikasi bisnis pada platform SAP seperti SAP ERP, S/4HANA, dan BTP.</p>
      <h4>Karakteristik ABAP</h4>
      <p>• Interpreted/compiled di ABAP Application Server<br>• Case-insensitive (keyword biasanya ditulis UPPERCASE)<br>• Setiap statement diakhiri dengan titik (.)<br>• Mendukung OOP (ABAP Objects) sejak release 4.6</p>
      <h4>Struktur Program Minimal</h4>
      <code>REPORT z_my_program.

DATA: lv_text TYPE string VALUE 'Hello World'.
WRITE: / lv_text.</code>
    `
  },
  {
    id: 'data',
    title: 'DATA & Types',
    content: `
      <h3>Deklarasi Variable</h3>
      <h4>Sintaks Dasar</h4>
      <code>DATA: variable_name TYPE data_type [VALUE initial_value].</code>
      <h4>Tipe Data Primitif</h4>
      <code>" Integer
DATA: lv_count TYPE i VALUE 0.

" Floating Point
DATA: lv_pi TYPE f VALUE '3.14159'.

" Packed Decimal (uang/desimal presisi)
DATA: lv_amount TYPE p DECIMALS 2 VALUE '1000.50'.

" Character (fixed length)
DATA: lv_code TYPE c LENGTH 4 VALUE 'ABCD'.

" String (variable length)
DATA: lv_name TYPE string VALUE 'SAP Developer'.

" Date (format: YYYYMMDD)
DATA: lv_date TYPE d.

" Time (format: HHMMSS)
DATA: lv_time TYPE t.</code>
      <h4>Deklarasi Chained (Beberapa Variable)</h4>
      <code>DATA: lv_a TYPE i,
      lv_b TYPE string,
      lv_c TYPE f VALUE '0.5'.</code>
      <h4>Konstanta</h4>
      <code>CONSTANTS: gc_max TYPE i VALUE 100,
               gc_pi  TYPE f VALUE '3.14159'.</code>
    `
  },
  {
    id: 'operators',
    title: 'Operator & Ekspresi',
    content: `
      <h3>Operator ABAP</h3>
      <h4>Operator Aritmatika</h4>
      <code>" Modern syntax (ABAP 7.4+)
lv_result = lv_a + lv_b.
lv_result = lv_a - lv_b.
lv_result = lv_a * lv_b.
lv_result = lv_a / lv_b.
lv_result = lv_a MOD lv_b.  " Modulo
lv_result = lv_a ** 2.       " Pangkat

" Classic syntax
ADD lv_b TO lv_a.            " lv_a = lv_a + lv_b
SUBTRACT lv_b FROM lv_a.     " lv_a = lv_a - lv_b
MULTIPLY lv_a BY lv_b.       " lv_a = lv_a * lv_b
DIVIDE lv_a BY lv_b.         " lv_a = lv_a / lv_b</code>
      <h4>Operator Perbandingan</h4>
      <code>" Symbolic   Textual    Arti
"    =         EQ        Equal
"   <>         NE        Not Equal
"    <         LT        Less Than
"    >         GT        Greater Than
"   <=         LE        Less or Equal
"   >=         GE        Greater or Equal

IF lv_a EQ lv_b.  " atau  IF lv_a = lv_b.
IF lv_x IS INITIAL.          " Cek apakah kosong/nol
IF lv_x IS NOT INITIAL.</code>
      <h4>Operator Logika</h4>
      <code>IF lv_a > 0 AND lv_b > 0.
IF lv_a = 0 OR lv_b = 0.
IF NOT lv_flag = 'X'.</code>
    `
  },
  {
    id: 'control',
    title: 'Control Flow',
    content: `
      <h3>Percabangan & Perulangan</h3>
      <h4>IF / ELSEIF / ELSE</h4>
      <code>IF lv_score >= 90.
  WRITE: / 'Excellent'.
ELSEIF lv_score >= 70.
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
WHILE lv_n <= 10.
  WRITE: / lv_n.
  lv_n = lv_n + 1.
ENDWHILE.</code>
      <h4>Control keywords</h4>
      <code>EXIT.      " Keluar dari loop atau program
CONTINUE.  " Lanjut iterasi berikutnya
CHECK condition.  " Skip iterasi jika false
RETURN.    " Keluar dari method/form</code>
    `
  },
  {
    id: 'string',
    title: 'String Operations',
    content: `
      <h3>Manipulasi String</h3>
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
      <code>CONDENSE lv_text.          " Trim & single spaces
CONDENSE lv_text NO-GAPS.  " Remove all spaces</code>
      <h4>STRLEN & String Functions</h4>
      <code>DATA: lv_len TYPE i.
lv_len = STRLEN( lv_text ).   " Panjang string

" Modern ABAP built-in functions:
lv_text = to_upper( lv_text ).
lv_text = to_lower( lv_text ).
lv_text = condense( lv_text ).
lv_len  = strlen( lv_text ).</code>
    `
  },
  {
    id: 'itab',
    title: 'Internal Tables',
    content: `
      <h3>Internal Tables</h3>
      <p>Internal table adalah struktur data array bertipe di ABAP yang sangat sering digunakan.</p>
      <h4>Jenis Internal Table</h4>
      <code>" STANDARD TABLE - akses via index
DATA: lt_data TYPE STANDARD TABLE OF string.

" SORTED TABLE - otomatis terurut
DATA: lt_sorted TYPE SORTED TABLE OF string
  WITH NON-UNIQUE KEY table_line.

" HASHED TABLE - akses cepat via key
DATA: lt_hash TYPE HASHED TABLE OF string
  WITH UNIQUE KEY table_line.</code>
      <h4>Struktur + Table</h4>
      <code>TYPES: BEGIN OF ty_line,
         id   TYPE i,
         name TYPE string,
       END OF ty_line.

DATA: lt_tab TYPE TABLE OF ty_line,
      ls_row TYPE ty_line.</code>
      <h4>Operasi Dasar</h4>
      <code>" Tambah baris
ls_row-id = 1. ls_row-name = 'Alice'.
APPEND ls_row TO lt_tab.

" Loop
LOOP AT lt_tab INTO ls_row.
  WRITE: / ls_row-id, ls_row-name.
ENDLOOP.

" Sort
SORT lt_tab BY name.

" Read
READ TABLE lt_tab WITH KEY id = 1 INTO ls_row.
IF sy-subrc = 0. WRITE: / 'Found:', ls_row-name. ENDIF.

" Delete
DELETE lt_tab INDEX 1.

" Count
DATA: lv_cnt TYPE i.
DESCRIBE TABLE lt_tab LINES lv_cnt.
" atau:
lv_cnt = lines( lt_tab ).</code>
    `
  },
  {
    id: 'subroutines',
    title: 'Subroutines & Methods',
    content: `
      <h3>FORM Subroutine (Classic)</h3>
      <code>PERFORM my_form USING lv_a lv_b CHANGING lv_result.

FORM my_form
  USING    pv_a TYPE i
           pv_b TYPE i
  CHANGING cv_result TYPE i.

  cv_result = pv_a + pv_b.

ENDFORM.</code>
      <h3>OO ABAP - Method</h3>
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

" Calling static method:
DATA(lv_sum) = lcl_math=>add( iv_a = 10 iv_b = 20 ).</code>
    `
  },
  {
    id: 'sysfields',
    title: 'System Fields (SY-)',
    content: `
      <h3>ABAP System Fields</h3>
      <p>System fields adalah variabel built-in yang diisi otomatis oleh ABAP runtime.</p>
      <h4>Yang Paling Sering Digunakan</h4>
      <code>" SY-SUBRC : Return code (0 = success, 4 = not found, dll.)
IF sy-subrc = 0.
  WRITE: / 'Operation successful'.
ENDIF.

" SY-TABIX : Current index saat LOOP AT internal table
LOOP AT lt_data INTO ls_line.
  WRITE: / 'Row #', sy-tabix.
ENDLOOP.

" SY-INDEX : Current counter di DO atau SELECT
DO 5 TIMES.
  WRITE: / sy-index.  " 1, 2, 3, 4, 5
ENDDO.

" SY-UNAME : User yang sedang login
WRITE: / 'Logged in as:', sy-uname.

" SY-DATUM : Tanggal sistem (format YYYYMMDD)
WRITE: / 'Today:', sy-datum.

" SY-UZEIT : Waktu sistem (format HHMMSS)
WRITE: / 'Time:', sy-uzeit.

" SY-MANDT : Client SAP saat ini
WRITE: / 'Client:', sy-mandt.

" SY-REPID : Nama program yang sedang berjalan
WRITE: / 'Program:', sy-repid.</code>
    `
  },
  {
    id: 'select',
    title: 'SELECT Statement',
    content: `
      <h3>SELECT — Akses Database OpenSQL</h3>
      <p>Di ABAP Code Studio, query <code>SELECT</code> <strong>bisa langsung dijalankan</strong> menggunakan dummy table standar SAP (SCARR, SFLIGHT, SPFLI, MARA, MAKT, KNA1, dll.).</p>
      <h4>SELECT ke Internal Table</h4>
      <code>" Format modern (ABAP 7.4+) dengan host variable @
SELECT carrid, carrname, currcode
  FROM scarr
  INTO TABLE @gt_scarr
  WHERE carrid = @p_carrid.

IF sy-subrc = 0.
  LOOP AT gt_scarr INTO gs_scarr.
    WRITE: / gs_scarr-carrid, gs_scarr-carrname.
  ENDLOOP.
ENDIF.</code>
      <h4>SELECT Semua Kolom</h4>
      <code>SELECT * FROM mara INTO TABLE @gt_mara WHERE mtart = 'FERT'.</code>
      <h4>SELECT SINGLE</h4>
      <code>SELECT SINGLE * FROM scarr INTO @gs_scarr WHERE carrid = 'LH'.
IF sy-subrc = 0.
  WRITE: / 'Found:', gs_scarr-carrname.
ENDIF.</code>
      <h4>Status Return Code (SY-SUBRC & SY-DBCNT)</h4>
      <code>" sy-subrc = 0 : Data ditemukan
" sy-subrc = 4 : Tidak ada data cocok
" sy-dbcnt     : Jumlah baris yang berhasil di-fetch</code>
    `
  },
  {
    id: 'alv',
    title: 'ALV Grid Viewer',
    content: `
      <h3>ALV (ABAP List Viewer)</h3>
      <p>ALV adalah komponen standar SAP untuk menampilkan data internal table dalam bentuk spreadsheet grid interaktif dengan fitur sortir, filter, dan kalkulasi total.</p>
      <h4>1. Modern OO ALV (CL_SALV_TABLE)</h4>
      <code>DATA: gt_data TYPE TABLE OF sflight,
      lo_alv  TYPE REF TO cl_salv_table.

SELECT * FROM sflight INTO TABLE @gt_data.

cl_salv_table=>factory(
  IMPORTING r_salv_table = lo_alv
  CHANGING  t_table      = gt_data ).

lo_alv->display( ).</code>
      <h4>2. Classic ALV (Function Module)</h4>
      <code>DATA: gt_data TYPE TABLE OF scarr.

SELECT * FROM scarr INTO TABLE @gt_data.

CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
  EXPORTING
    i_structure_name = 'SCARR'
  TABLES
    t_outtab         = gt_data.</code>
      <h4>3. Classic ALV dengan Field Catalog</h4>
      <p>Field catalog menentukan kolom mana yang tampil, judulnya, dan sifatnya. Satu baris field catalog = satu kolom.</p>
      <code>DATA: gt_fieldcat TYPE slis_t_fieldcat_alv,
      gs_fieldcat TYPE slis_fieldcat_alv,
      gs_layout   TYPE slis_layout_alv.

CLEAR gs_fieldcat.
gs_fieldcat-fieldname = 'CARRID'.     " nama komponen, HURUF BESAR
gs_fieldcat-seltext_m = 'Maskapai'.   " judul kolom
gs_fieldcat-key       = 'X'.          " kolom kunci
APPEND gs_fieldcat TO gt_fieldcat.

CLEAR gs_fieldcat.
gs_fieldcat-fieldname = 'PRICE'.
gs_fieldcat-seltext_m = 'Harga'.
gs_fieldcat-do_sum    = 'X'.          " dijumlahkan
APPEND gs_fieldcat TO gt_fieldcat.

gs_layout-zebra = 'X'.

CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
  EXPORTING
    i_callback_program = sy-repid
    i_grid_title       = 'Judul Grid'
    is_layout          = gs_layout
    it_fieldcat        = gt_fieldcat
  TABLES
    t_outtab           = gt_data
  EXCEPTIONS
    program_error      = 1
    OTHERS             = 2.</code>
      <p>Komponen field catalog yang dikenali: <strong>fieldname, seltext_s/m/l, reptext_ddic, outputlen, col_pos, key, do_sum, no_out, tech, just, emphasize</strong>.
         Layout: <strong>zebra, colwidth_optimize, window_titlebar</strong>. Sort awal lewat <strong>it_sort</strong> (fieldname + up/down).
         <code>REUSE_ALV_FIELDCATALOG_MERGE</code> membuat field catalog otomatis dari <code>i_structure_name</code>.</p>
      <h4>ALV di Studio Ini</h4>
      <p>Grid ALV tampil langsung di panel <strong>Output</strong>, berurutan dengan hasil <code>WRITE</code>. Program boleh menampilkan lebih dari satu grid.<br>
         • <strong>Sorting</strong>: klik dua kali judul kolom, atau pilih kolom (satu klik) lalu pakai tombol ↑ / ↓<br>
         • <strong>Filter</strong>: kotak pencarian di toolbar grid<br>
         • <strong>Totals (Σ)</strong>: tombol Σ — kolom <code>do_sum</code> dijumlahkan otomatis<br>
         • <strong>Export CSV</strong>: tombol unduh</p>
    `
  },
  {
    id: 'function',
    title: 'Function Module',
    content: `
      <h3>CALL FUNCTION</h3>
      <p>Function module (FM) adalah prosedur siap pakai. Seluruh pemanggilan adalah <strong>satu</strong> statement — titik hanya di akhir.</p>
      <code>CALL FUNCTION 'NAMA_FM'
  EXPORTING              " program -> FM
    param_masuk  = lv_nilai
  IMPORTING              " FM -> program
    param_keluar = lv_hasil
  CHANGING               " dua arah
    param_ubah   = lv_data
  TABLES                 " internal table
    tabel        = gt_data
  EXCEPTIONS             " nama error -> sy-subrc
    nama_error   = 1
    OTHERS       = 2.

IF sy-subrc <> 0.
  " tangani error
ENDIF.</code>
      <p>Exception yang tidak dipetakan di <code>EXCEPTIONS</code> menghentikan program (short dump). FM yang belum disimulasikan dilewati dengan peringatan.</p>
      <h4>Function module yang disimulasikan</h4>
      <code>" ── ALV ──────────────────────────────────────────────────────
REUSE_ALV_GRID_DISPLAY        EXPORTING i_callback_program i_structure_name i_grid_title
                                        i_callback_user_command i_callback_top_of_page
                                        is_layout it_fieldcat it_sort
                              TABLES    t_outtab
                              EXCEPTIONS program_error
REUSE_ALV_LIST_DISPLAY        (parameter sama dengan GRID)
REUSE_ALV_GRID_DISPLAY_LVC    EXPORTING is_layout_lvc it_fieldcat_lvc it_sort_lvc ...
REUSE_ALV_FIELDCATALOG_MERGE  EXPORTING i_structure_name   CHANGING ct_fieldcat
LVC_FIELDCATALOG_MERGE        EXPORTING i_structure_name   CHANGING ct_fieldcat
REUSE_ALV_COMMENTARY_WRITE    EXPORTING it_list_commentary          " header di atas grid (TOP_OF_PAGE)
REUSE_ALV_EVENTS_GET          IMPORTING et_events

" ── Konversi ─────────────────────────────────────────────────
CONVERSION_EXIT_ALPHA_INPUT   EXPORTING input   IMPORTING output   " 1000 -> 0000001000
CONVERSION_EXIT_ALPHA_OUTPUT  EXPORTING input   IMPORTING output   " 0000001000 -> 1000

" ── Tanggal ──────────────────────────────────────────────────
DATE_COMPUTE_DAY              EXPORTING date    IMPORTING day      " 1 = Senin ... 7 = Minggu
DATE_CHECK_PLAUSIBILITY       EXPORTING date    EXCEPTIONS plausibility_check_failed
RP_LAST_DAY_OF_MONTHS         EXPORTING day_in  IMPORTING last_day_of_month
                              EXCEPTIONS day_in_no_date
RP_CALC_DATE_IN_INTERVAL      EXPORTING date days months years signum
                              IMPORTING calc_date

" ── Dialog & file ────────────────────────────────────────────
POPUP_TO_CONFIRM              EXPORTING titlebar text_question
                              IMPORTING answer                     " '1' = Ya, '2' = Tidak
POPUP_TO_INFORM               EXPORTING titel txt1 txt2
SAPGUI_PROGRESS_INDICATOR     EXPORTING percentage text
GUI_DOWNLOAD                  EXPORTING filename   TABLES data_tab " simulasi, tanpa file nyata
GUI_UPLOAD                    selalu menaikkan FILE_OPEN_ERROR

" ── BAPI ─────────────────────────────────────────────────────
BAPI_TRANSACTION_COMMIT, BAPI_TRANSACTION_ROLLBACK</code>
      <h4>Class standar yang disimulasikan</h4>
      <code>cl_salv_table=>factory( IMPORTING r_salv_table = lo_alv CHANGING t_table = itab ).
lo_alv->display( ).
lo_alv->get_display_settings( )->set_striped_pattern( abap_true ).
lo_alv->get_display_settings( )->set_list_header( 'Judul' ).

go_grid->set_table_for_first_display(      " CL_GUI_ALV_GRID
  EXPORTING i_structure_name = 'SFLIGHT' is_layout = gs_layout
  CHANGING  it_outtab = gt_data it_fieldcatalog = gt_fcat ).

cl_demo_output=>display( lt_data ).        " cetak cepat variabel / tabel</code>
      <h4>Function module buatan sendiri</h4>
      <p>Tulis <code>FUNCTION nama. … ENDFUNCTION.</code> di program yang sama. Interface-nya dibaca dari blok komentar <code>*"</code> di bawah baris FUNCTION
         (IMPORTING, EXPORTING, CHANGING, TABLES, EXCEPTIONS) — lihat pelajaran "Membuat function module sendiri".</p>
    `
  },
  {
    id: 'simulator',
    title: 'Cakupan Simulator',
    content: `
      <h3>Apa yang bisa dijalankan di studio ini</h3>
      <p>Studio ini adalah <strong>simulator untuk belajar</strong>, bukan sistem SAP. Kode yang berjalan di sini mengikuti sintaks ABAP asli,
         dan pesan error serta peringatannya dibuat semirip mungkin dengan perilaku SAP. Hasil program tampil di panel Output dan di
         <strong>layar hasil bergaya SAP</strong> (bisa dimatikan lewat sakelar "Layar hasil gaya SAP" di menu ⋯; Esc atau F3 untuk kembali).</p>
      <h4>Didukung</h4>
      <p>• <strong>Dasar</strong>: DATA, TYPES, CONSTANTS, STATICS, struktur (BEGIN OF … END OF), IF, CASE, DO, WHILE, EXIT, CONTINUE, CHECK, tipe c / n / p / d / t dengan panjang dan desimalnya<br>
         • <strong>List</strong>: WRITE dengan posisi dan panjang (<code>/5(10)</code>), NO-GAP, format tanggal / waktu / desimal, ULINE, SKIP, TOP-OF-PAGE, HIDE + AT LINE-SELECTION (klik dua kali baris)<br>
         • <strong>Event laporan</strong>: INITIALIZATION, AT SELECTION-SCREEN, START-OF-SELECTION, END-OF-SELECTION dalam urutan SAP; MESSAGE tipe E / A / X menghentikan program<br>
         • <strong>String</strong>: CONCATENATE, SPLIT, CONDENSE, TRANSLATE, REPLACE, FIND, SHIFT, &amp;&amp;, string template |…| dengan opsi format, offset +n(m), CS / CP / CO / CA, fungsi to_upper, substring, replace, condense, contains …<br>
         • <strong>Internal table</strong>: APPEND, INSERT, MODIFY, DELETE, COLLECT, SORT, READ TABLE, LOOP (INTO / ASSIGNING / REFERENCE INTO / WHERE / FROM-TO), AT NEW / AT END OF / SUM, tabel STANDARD / SORTED / HASHED, header line dan OCCURS<br>
         • <strong>Modularisasi</strong>: FORM / PERFORM (TABLES, USING, CHANGING, variabel lokal, rekursi), macro (DEFINE), function module buatan sendiri (FUNCTION … ENDFUNCTION), CALL FUNCTION<br>
         • <strong>Selection screen</strong>: PARAMETERS (CHECKBOX, RADIOBUTTON, OBLIGATORY), SELECT-OPTIONS, RANGES, tombol Parameter (F8)<br>
         • <strong>OpenSQL</strong>: SELECT (SINGLE, INTO TABLE, WHERE, ORDER BY, UP TO n ROWS, DISTINCT), agregat COUNT / SUM / MAX / MIN / AVG, GROUP BY, HAVING, INNER / LEFT OUTER JOIN, FOR ALL ENTRIES, SELECT … ENDSELECT, INSERT / UPDATE / MODIFY / DELETE, COMMIT / ROLLBACK WORK<br>
         • <strong>OO ABAP</strong>: class lokal, atribut &amp; method (instance dan static), constructor, visibility, READ-ONLY, inheritance, REDEFINITION, super-&gt;, interface, event (EVENTS / RAISE EVENT / SET HANDLER), NEW, CREATE OBJECT, CAST, IS INSTANCE OF<br>
         • <strong>Exception</strong>: TRY / CATCH / ENDTRY, RAISE EXCEPTION, class exception sendiri, cx_sy_zerodivide, cx_sy_ref_is_initial, cx_sy_itab_line_not_found, cx_sy_conversion_no_number<br>
         • <strong>Modern</strong>: DATA( ), FIELD-SYMBOL( ), VALUE (termasuk FOR dan BASE), COND, SWITCH, CONV, REDUCE, CORRESPONDING, table expression <code>itab[ … ]</code>, line_exists( ), host variable @<br>
         • <strong>Dinamis</strong>: field-symbol, data reference (REF #, GET REFERENCE, CREATE DATA, -&gt;*), ASSIGN COMPONENT, ASSIGN (nama)<br>
         • <strong>ALV</strong>: REUSE_ALV_GRID_DISPLAY (field catalog, layout, sort, total, hotspot, user command, top of page), CL_SALV_TABLE (kolom, sort, agregasi, event link_click / double_click), CL_GUI_ALV_GRID</p>
      <h4>Yang berbeda dari SAP</h4>
      <p>• Tabel database adalah data contoh (menu <strong>Tabel</strong>). Perubahan lewat INSERT / UPDATE / DELETE hanya berlaku selama program berjalan.<br>
         • Function module ditulis di program yang sama; interface-nya dibaca dari blok komentar <code>*"</code> seperti yang ditampilkan SE37.<br>
         • Text symbol (<code>TEXT-001</code>) dan message class tidak dikelola; teksnya tampil sebagai kodenya.<br>
         • Kunci bahasa di data contoh adalah <code>'EN'</code> / <code>'ID'</code>, dan <code>sy-langu</code> berisi <code>'EN'</code>.<br>
         • WRITE memisahkan nilai dengan satu spasi; lebar kolom otomatis per tipe data seperti di SAP tidak ditiru — pakai posisi kolom bila perlu rata.</p>
      <h4>Belum didukung</h4>
      <p>• Dynpro / screen (CALL SCREEN, MODULE, PBO / PAI): screen dibuat di Screen Painter, bukan di kode<br>
         • LOOP AT … GROUP BY, subquery SQL, UNION, CDS view, AMDP<br>
         • Class global (SE24), friend, test class (ABAP Unit), RTTS (cl_abap_typedescr)<br>
         • File dan sistem: OPEN DATASET, EXPORT / IMPORT MEMORY, SUBMIT, CALL TRANSACTION (hanya ditampilkan sebagai pesan), background job<br>
         • Statement yang tidak dikenal dilewati dengan peringatan, bukan dijalankan diam-diam</p>
    `
  }
];

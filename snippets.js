// snippets.js — ABAP code snippet library
// ABAP Code Studio — Created by jeffrypurwanto

window.ABAP_SNIPPETS = [
  {
    id: 'hello',
    title: 'Hello World',
    category: 'basic',
    desc: 'Program ABAP paling sederhana.',
    code: `REPORT z_hello_world.

WRITE: / 'Hello, ABAP World!'.`
  },
  {
    id: 'variables',
    title: 'Data Declaration',
    category: 'basic',
    desc: 'Deklarasi berbagai tipe data dasar.',
    code: `REPORT z_variables.

DATA: lv_name   TYPE string VALUE 'John',
      lv_age    TYPE i      VALUE 25,
      lv_salary TYPE p DECIMALS 2 VALUE '5000.00',
      lv_flag   TYPE c      VALUE 'X'.

WRITE: / 'Name   :', lv_name.
WRITE: / 'Age    :', lv_age.
WRITE: / 'Salary :', lv_salary.
WRITE: / 'Flag   :', lv_flag.`
  },
  {
    id: 'if_else',
    title: 'IF / ELSE',
    category: 'basic',
    desc: 'Percabangan kondisi IF-ELSEIF-ELSE.',
    code: `REPORT z_if_else.

DATA: lv_score TYPE i VALUE 75.

IF lv_score >= 90.
  WRITE: / 'Grade: A'.
ELSEIF lv_score >= 80.
  WRITE: / 'Grade: B'.
ELSEIF lv_score >= 70.
  WRITE: / 'Grade: C'.
ELSE.
  WRITE: / 'Grade: F'.
ENDIF.`
  },
  {
    id: 'case',
    title: 'CASE / WHEN',
    category: 'basic',
    desc: 'Percabangan multiple dengan CASE.',
    code: `REPORT z_case_when.

DATA: lv_day TYPE i VALUE 3.

CASE lv_day.
  WHEN 1. WRITE: / 'Monday'.
  WHEN 2. WRITE: / 'Tuesday'.
  WHEN 3. WRITE: / 'Wednesday'.
  WHEN 4. WRITE: / 'Thursday'.
  WHEN 5. WRITE: / 'Friday'.
  WHEN OTHERS. WRITE: / 'Weekend'.
ENDCASE.`
  },
  {
    id: 'do_loop',
    title: 'DO ... TIMES',
    category: 'loop',
    desc: 'Loop dengan DO n TIMES.',
    code: `REPORT z_do_times.

DATA: lv_sum TYPE i VALUE 0.

DO 10 TIMES.
  ADD sy-index TO lv_sum.
  WRITE: / 'Iteration:', sy-index, 'Sum:', lv_sum.
ENDDO.

WRITE: / '---'.
WRITE: / 'Total:', lv_sum.`
  },
  {
    id: 'while',
    title: 'WHILE Loop',
    category: 'loop',
    desc: 'Loop dengan kondisi WHILE.',
    code: `REPORT z_while_loop.

DATA: lv_count TYPE i VALUE 1,
      lv_total TYPE i VALUE 0.

WHILE lv_count <= 5.
  lv_total = lv_total + lv_count.
  WRITE: / 'Count:', lv_count, '| Running Total:', lv_total.
  lv_count = lv_count + 1.
ENDWHILE.

WRITE: / 'Final total:', lv_total.`
  },
  {
    id: 'concatenate',
    title: 'CONCATENATE String',
    category: 'string',
    desc: 'Menggabungkan string dengan CONCATENATE.',
    code: `REPORT z_string_ops.

DATA: lv_first  TYPE string VALUE 'Hello',
      lv_second TYPE string VALUE 'World',
      lv_result TYPE string.

CONCATENATE lv_first lv_second INTO lv_result SEPARATED BY ', '.
WRITE: / lv_result.

" String length
DATA: lv_len TYPE i.
lv_len = STRLEN( lv_result ).
WRITE: / 'Length:', lv_len.`
  },
  {
    id: 'translate',
    title: 'TRANSLATE (Upper/Lower)',
    category: 'string',
    desc: 'Mengubah huruf besar/kecil.',
    code: `REPORT z_translate.

DATA: lv_str TYPE string VALUE 'Hello World ABAP'.

TRANSLATE lv_str TO UPPER CASE.
WRITE: / 'Upper:', lv_str.

TRANSLATE lv_str TO LOWER CASE.
WRITE: / 'Lower:', lv_str.`
  },
  {
    id: 'split',
    title: 'SPLIT String',
    category: 'string',
    desc: 'Memecah string berdasarkan delimiter.',
    code: `REPORT z_split.

DATA: lv_csv    TYPE string VALUE 'Jakarta,Bandung,Surabaya',
      lv_city1  TYPE string,
      lv_city2  TYPE string,
      lv_city3  TYPE string.

SPLIT lv_csv AT ',' INTO lv_city1 lv_city2 lv_city3.

WRITE: / 'City 1:', lv_city1.
WRITE: / 'City 2:', lv_city2.
WRITE: / 'City 3:', lv_city3.`
  },
  {
    id: 'internal_table',
    title: 'Internal Table (Basic)',
    category: 'table',
    desc: 'Membuat dan mengisi internal table.',
    code: `REPORT z_internal_table.

TYPES: BEGIN OF ty_employee,
         name   TYPE string,
         dept   TYPE string,
         salary TYPE i,
       END OF ty_employee.

DATA: lt_emp TYPE TABLE OF ty_employee,
      ls_emp TYPE ty_employee.

" Fill table
ls_emp-name = 'Alice'. ls_emp-dept = 'IT'. ls_emp-salary = 8000.
APPEND ls_emp TO lt_emp.

ls_emp-name = 'Bob'. ls_emp-dept = 'HR'. ls_emp-salary = 6500.
APPEND ls_emp TO lt_emp.

ls_emp-name = 'Charlie'. ls_emp-dept = 'Finance'. ls_emp-salary = 9000.
APPEND ls_emp TO lt_emp.

" Loop and display
WRITE: / 'Employee List:'.
WRITE: / '─────────────────────────────────────'.
LOOP AT lt_emp INTO ls_emp.
  WRITE: / ls_emp-name, '|', ls_emp-dept, '|', ls_emp-salary.
ENDLOOP.`
  },
  {
    id: 'sort_read',
    title: 'SORT & READ TABLE',
    category: 'table',
    desc: 'Mengurutkan dan membaca baris internal table.',
    code: `REPORT z_sort_read.

TYPES: BEGIN OF ty_product,
         id    TYPE i,
         name  TYPE string,
         price TYPE i,
       END OF ty_product.

DATA: lt_prod TYPE TABLE OF ty_product,
      ls_prod TYPE ty_product.

ls_prod-id = 3. ls_prod-name = 'Keyboard'. ls_prod-price = 350000.
APPEND ls_prod TO lt_prod.
ls_prod-id = 1. ls_prod-name = 'Mouse'. ls_prod-price = 150000.
APPEND ls_prod TO lt_prod.
ls_prod-id = 2. ls_prod-name = 'Monitor'. ls_prod-price = 2500000.
APPEND ls_prod TO lt_prod.

SORT lt_prod BY price DESCENDING.

WRITE: / 'Products (sorted by price desc):'.
LOOP AT lt_prod INTO ls_prod.
  WRITE: / sy-tabix, '|', ls_prod-name, '| Rp', ls_prod-price.
ENDLOOP.`
  },
  {
    id: 'perform',
    title: 'FORM Subroutine',
    category: 'basic',
    desc: 'Membuat dan memanggil subroutine.',
    code: `REPORT z_perform.

DATA: lv_result TYPE i.

PERFORM calculate USING 10 5 CHANGING lv_result.
WRITE: / 'Result:', lv_result.

PERFORM greet USING 'ABAP Developer'.

FORM calculate USING pv_a TYPE i
                     pv_b TYPE i
               CHANGING cv_result TYPE i.
  cv_result = pv_a * pv_b.
ENDFORM.

FORM greet USING pv_name TYPE string.
  DATA: lv_msg TYPE string.
  CONCATENATE 'Hello,' pv_name INTO lv_msg SEPARATED BY ' '.
  WRITE: / lv_msg.
ENDFORM.`
  },
  {
    id: 'select_scarr',
    title: 'SELECT SCARR (Airlines)',
    category: 'select',
    desc: 'Query data maskapai dari dummy table SCARR dengan PARAMETERS.',
    code: `REPORT z_select_scarr.

* Deklarasi internal table & work area
DATA: gt_scarr TYPE TABLE OF scarr,
      gs_scarr TYPE scarr.

* Parameter maskapai (coba ubah: AA, GA, LH, SQ)
PARAMETERS: p_carrid TYPE scarr-carrid DEFAULT 'GA'.

START-OF-SELECTION.

* OpenSQL SELECT dengan filter WHERE
SELECT carrid, carrname, currcode, url
  FROM scarr
  INTO TABLE @gt_scarr
  WHERE carrid = @p_carrid.

END-OF-SELECTION.

IF gt_scarr IS NOT INITIAL.
  WRITE: / 'Data Maskapai Ditemukan:'.
  ULINE.
  LOOP AT gt_scarr INTO gs_scarr.
    WRITE: / gs_scarr-carrid,
             gs_scarr-carrname,
             gs_scarr-currcode,
             gs_scarr-url.
  ENDLOOP.
ELSE.
  WRITE: / 'Data maskapai tidak ditemukan untuk ID tersebut.'.
ENDIF.`
  },
  {
    id: 'select_all_scarr',
    title: 'SELECT All SCARR',
    category: 'select',
    desc: 'SELECT semua baris dari dummy table SCARR.',
    code: `REPORT z_list_airlines.

DATA: gt_scarr TYPE TABLE OF scarr,
      gs_scarr TYPE scarr.

START-OF-SELECTION.

SELECT * FROM scarr INTO TABLE @gt_scarr.

WRITE: / 'Daftar Semua Maskapai (SCARR):'.
ULINE.

LOOP AT gt_scarr INTO gs_scarr.
  WRITE: / sy-tabix,
           gs_scarr-carrid,
           gs_scarr-carrname,
           gs_scarr-currcode.
ENDLOOP.`
  },
  {
    id: 'select_sflight',
    title: 'SELECT SFLIGHT (Penerbangan)',
    category: 'select',
    desc: 'Filter penerbangan berdasarkan maskapai dan harga.',
    code: `REPORT z_search_flights.

DATA: gt_flights TYPE TABLE OF sflight,
      gs_flight  TYPE sflight.

PARAMETERS: p_carr TYPE sflight-carrid DEFAULT 'GA'.

START-OF-SELECTION.

SELECT carrid, connid, fldate, price, currency, planetype
  FROM sflight
  INTO TABLE @gt_flights
  WHERE carrid = @p_carr.

IF gt_flights IS NOT INITIAL.
  WRITE: / 'Jadwal Penerbangan Maskapai:', p_carr.
  ULINE.
  LOOP AT gt_flights INTO gs_flight.
    WRITE: / gs_flight-connid,
             gs_flight-fldate,
             gs_flight-planetype,
             gs_flight-price,
             gs_flight-currency.
  ENDLOOP.
ELSE.
  WRITE: / 'Tidak ada jadwal penerbangan untuk maskapai ini.'.
ENDIF.`
  },
  {
    id: 'select_mara',
    title: 'SELECT MARA (Material Master)',
    category: 'select',
    desc: 'Query master material berdasarkan jenis produk (FERT/ROH).',
    code: `REPORT z_list_materials.

DATA: gt_mara TYPE TABLE OF mara,
      gs_mara TYPE mara.

PARAMETERS: p_type TYPE mara-mtart DEFAULT 'FERT'.

START-OF-SELECTION.

SELECT matnr, mtart, matkl, meins, brgew, gewei
  FROM mara
  INTO TABLE @gt_mara
  WHERE mtart = @p_type.

WRITE: / 'Material Master Type:', p_type.
ULINE.

LOOP AT gt_mara INTO gs_mara.
  WRITE: / gs_mara-matnr,
           gs_mara-mtart,
           gs_mara-meins,
           gs_mara-brgew,
           gs_mara-gewei.
ENDLOOP.`
  },
  {
    id: 'alv_salv',
    title: 'OO ALV Grid (CL_SALV_TABLE)',
    category: 'alv',
    desc: 'Menampilkan data penerbangan (SFLIGHT) dalam ALV Grid interaktif.',
    code: `REPORT z_alv_flight_grid.

* Deklarasi internal table & OO ALV reference
DATA: gt_sflight TYPE TABLE OF sflight,
      lo_alv     TYPE REF TO cl_salv_table.

START-OF-SELECTION.

* Ambil data dari dummy table SFLIGHT
SELECT * FROM sflight INTO TABLE @gt_sflight.

* Instansiasi dan tampilkan ALV Grid
cl_salv_table=>factory(
  IMPORTING
    r_salv_table = lo_alv
  CHANGING
    t_table      = gt_sflight ).

lo_alv->display( ).`
  },
  {
    id: 'alv_reuse',
    title: 'Classic ALV (REUSE_ALV_GRID_DISPLAY)',
    category: 'alv',
    desc: 'ALV Grid klasik dengan function module REUSE_ALV_GRID_DISPLAY.',
    code: `REPORT z_reuse_alv_airlines.

* Deklarasi internal table maskapai
DATA: gt_scarr TYPE TABLE OF scarr.

START-OF-SELECTION.

* Ambil data maskapai dari tabel SCARR
SELECT carrid, carrname, currcode, url
  FROM scarr
  INTO TABLE @gt_scarr.

* Tampilkan dengan Function Module Classic ALV
CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
  EXPORTING
    i_structure_name = 'SCARR'
  TABLES
    t_outtab         = gt_scarr.`
  },
  {
    id: 'alv_fieldcat',
    title: 'Classic ALV + Field Catalog',
    category: 'alv',
    desc: 'REUSE_ALV_GRID_DISPLAY dengan field catalog manual, layout zebra, dan kolom total.',
    code: `REPORT z_alv_fieldcat.

TYPES: BEGIN OF ty_flight,
         carrid   TYPE sflight-carrid,
         connid   TYPE sflight-connid,
         fldate   TYPE sflight-fldate,
         price    TYPE sflight-price,
         currency TYPE sflight-currency,
         seatsocc TYPE sflight-seatsocc,
       END OF ty_flight.

DATA: gt_flight   TYPE STANDARD TABLE OF ty_flight,
      gt_fieldcat TYPE slis_t_fieldcat_alv,
      gs_fieldcat TYPE slis_fieldcat_alv,
      gs_layout   TYPE slis_layout_alv.

START-OF-SELECTION.
  SELECT carrid connid fldate price currency seatsocc
    FROM sflight
    INTO TABLE gt_flight.

  PERFORM add_field USING 'CARRID'   'Maskapai'      'X' ' '.
  PERFORM add_field USING 'CONNID'   'No. Penerbangan' 'X' ' '.
  PERFORM add_field USING 'FLDATE'   'Tanggal'       ' ' ' '.
  PERFORM add_field USING 'PRICE'    'Harga'         ' ' ' '.
  PERFORM add_field USING 'CURRENCY' 'Mata Uang'     ' ' ' '.
  PERFORM add_field USING 'SEATSOCC' 'Kursi Terisi'  ' ' 'X'.

  gs_layout-zebra = 'X'.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program = sy-repid
      i_grid_title       = 'Jadwal Penerbangan'
      is_layout          = gs_layout
      it_fieldcat        = gt_fieldcat
    TABLES
      t_outtab           = gt_flight
    EXCEPTIONS
      program_error      = 1
      OTHERS             = 2.

* Satu baris field catalog per kolom
FORM add_field USING pv_field TYPE c
                     pv_text  TYPE c
                     pv_key   TYPE c
                     pv_sum   TYPE c.
  CLEAR gs_fieldcat.
  gs_fieldcat-fieldname = pv_field.
  gs_fieldcat-seltext_m = pv_text.
  gs_fieldcat-key       = pv_key.
  gs_fieldcat-do_sum    = pv_sum.
  APPEND gs_fieldcat TO gt_fieldcat.
ENDFORM.`
  },
  {
    id: 'fm_alpha',
    title: 'Function Module: Conversion Exit',
    category: 'function',
    desc: 'CALL FUNCTION dengan EXPORTING / IMPORTING: melengkapi dan membuang nol di depan nomor.',
    code: `REPORT z_fm_alpha.

DATA: lv_input  TYPE kunnr VALUE '1000',
      lv_intern TYPE kunnr,
      lv_extern TYPE kunnr.

* Format internal: nol di depan sampai panjang field (10)
CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
  EXPORTING
    input  = lv_input
  IMPORTING
    output = lv_intern.

* Format tampilan: nol di depan dibuang
CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
  EXPORTING
    input  = lv_intern
  IMPORTING
    output = lv_extern.

WRITE: / 'Masukan  :', lv_input.
WRITE: / 'Internal :', lv_intern.
WRITE: / 'Tampilan :', lv_extern.`
  },
  {
    id: 'fm_exceptions',
    title: 'Function Module: EXCEPTIONS',
    category: 'function',
    desc: 'Menangani exception function module lewat sy-subrc.',
    code: `REPORT z_fm_exceptions.

DATA: lv_tanggal TYPE d,
      lv_akhir   TYPE d.

PARAMETERS p_tgl TYPE d DEFAULT '20240210'.

START-OF-SELECTION.
  lv_tanggal = p_tgl.

  CALL FUNCTION 'RP_LAST_DAY_OF_MONTHS'
    EXPORTING
      day_in            = lv_tanggal
    IMPORTING
      last_day_of_month = lv_akhir
    EXCEPTIONS
      day_in_no_date    = 1
      OTHERS            = 2.

  CASE sy-subrc.
    WHEN 0.
      WRITE: / 'Hari terakhir bulan itu:', lv_akhir.
    WHEN 1.
      WRITE: / lv_tanggal, 'bukan tanggal yang valid (sy-subrc = 1).'.
    WHEN OTHERS.
      WRITE / 'Error lain dari function module.'.
  ENDCASE.`
  },
  {
    id: 'fm_download',
    title: 'Function Module: TABLES',
    category: 'function',
    desc: 'Mengoper internal table ke function module lewat TABLES (simulasi GUI_DOWNLOAD).',
    code: `REPORT z_fm_tables.

DATA: gt_scarr TYPE STANDARD TABLE OF scarr,
      gv_size  TYPE i.

SELECT * FROM scarr INTO TABLE gt_scarr.

CALL FUNCTION 'GUI_DOWNLOAD'
  EXPORTING
    filename         = 'C:\\temp\\maskapai.txt'
    filetype         = 'ASC'
  IMPORTING
    filelength       = gv_size
  TABLES
    data_tab         = gt_scarr
  EXCEPTIONS
    file_write_error = 1
    no_authority     = 2
    OTHERS           = 3.

IF sy-subrc = 0.
  WRITE: / 'Download selesai,', gv_size, 'byte.'.
ELSE.
  WRITE: / 'Download gagal, sy-subrc =', sy-subrc.
ENDIF.`
  },
  {
    id: 'class_oo',
    title: 'OO ABAP Class',
    category: 'class',
    desc: 'Contoh class ABAP berorientasi objek.',
    code: `REPORT z_oo_class.

CLASS lcl_calculator DEFINITION.
  PUBLIC SECTION.
    METHODS:
      constructor IMPORTING iv_name TYPE string,
      add         IMPORTING iv_a TYPE i iv_b TYPE i
                  RETURNING VALUE(rv_result) TYPE i,
      display_info.
  PRIVATE SECTION.
    DATA: mv_name TYPE string.
ENDCLASS.

CLASS lcl_calculator IMPLEMENTATION.
  METHOD constructor.
    mv_name = iv_name.
  ENDMETHOD.
  METHOD add.
    rv_result = iv_a + iv_b.
  ENDMETHOD.
  METHOD display_info.
    WRITE: / 'Calculator:', mv_name.
  ENDMETHOD.
ENDCLASS.

" Using the class
DATA: lo_calc  TYPE REF TO lcl_calculator,
      lv_res   TYPE i.

CREATE OBJECT lo_calc EXPORTING iv_name = 'Basic Calc'.
lo_calc->display_info( ).
lv_res = lo_calc->add( iv_a = 42 iv_b = 58 ).
WRITE: / 'Result: ', lv_res.`
  }
];


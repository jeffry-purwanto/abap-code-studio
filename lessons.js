// lessons.js — Jalur belajar ABAP dari pemula sampai mahir.
// ABAP Code Studio — Created by jeffrypurwanto
// Setiap pelajaran: { id, level, title, goal, body (HTML), code (ABAP yang bisa dijalankan), task (HTML latihan) }
// Semua contoh diuji terhadap abap-interpreter.js; di dalam body pakai <tt> untuk kode sebaris.

window.ABAP_LEVELS = [
  { id: 1, name: 'Pemula',   desc: 'Dasar bahasa: output, variabel, percabangan, perulangan, string' },
  { id: 2, name: 'Dasar',    desc: 'Struktur, internal table, subroutine, selection screen, SELECT' },
  { id: 3, name: 'Menengah', desc: 'JOIN, function module, ALV, laporan lengkap' },
  { id: 4, name: 'Mahir',    desc: 'OO ABAP, exception, sintaks modern, studi kasus' },
  { id: 5, name: 'Pakar',    desc: 'Regex, GROUP BY, SQL lanjutan, kinerja, unit test, pola desain, transaksi' }
];

window.ABAP_LESSONS = [

  // ════════════════════════════════════════════════════════
  // LEVEL 1 — PEMULA
  // ════════════════════════════════════════════════════════
  {
    id: 'p01', level: 1,
    title: 'Program pertama: WRITE',
    goal: 'Mengenal bentuk program ABAP dan menampilkan teks ke layar.',
    body: `
      <p>ABAP adalah bahasa pemrograman SAP. Program laporan sederhana diawali <tt>REPORT nama_program.</tt>
         dan berisi <b>statement</b>. Tiga aturan yang paling sering dilupakan pemula:</p>
      <ul>
        <li>Setiap statement <b>diakhiri titik</b> (<tt>.</tt>), bukan titik koma.</li>
        <li>Huruf besar/kecil tidak dibedakan: <tt>WRITE</tt> sama dengan <tt>write</tt>.</li>
        <li>Komentar satu baris penuh memakai <tt>*</tt> di <b>kolom pertama</b>. Komentar di tengah atau di akhir baris memakai tanda kutip ganda <tt>"</tt>.</li>
      </ul>
      <p><tt>WRITE</tt> mencetak ke layar. Tanda <tt>/</tt> berarti pindah baris. Statement berantai ditulis
         <tt>KEYWORD: a, b, c.</tt> — titik dua setelah keyword, lalu bagian-bagiannya dipisah koma.</p>`,
    code: `REPORT z_learn_hello.

* A full-line comment: an asterisk in the FIRST COLUMN
WRITE 'Hello, ABAP world!'.          " a comment at the end of a line uses a double quote

* The / sign means: start a new line
WRITE / 'Every statement ends with a period.'.

* Chained statement: a colon after the keyword, then parts separated by commas
WRITE: / 'Learning', 'ABAP', 'is', 'fun.'.

SKIP.                               " one empty line
ULINE.                              " horizontal line
WRITE / 'Program finished.'.`,
    task: `<ul>
      <li>Tambahkan baris yang mencetak nama Anda sendiri.</li>
      <li>Hapus titik di akhir salah satu statement, jalankan, dan lihat apa yang terjadi pada output.</li>
      <li>Cetak tiga kata di satu baris tanpa statement berantai (tiga <tt>WRITE</tt> terpisah, hanya yang pertama memakai <tt>/</tt>).</li>
    </ul>`
  },
  {
    id: 'p02', level: 1,
    title: 'Variabel dan tipe data',
    goal: 'Mendeklarasikan variabel dengan DATA, memberi nilai awal, dan mengenal tipe dasar.',
    body: `
      <p>Variabel dideklarasikan dengan <tt>DATA nama TYPE tipe.</tt> Nilai awal diberikan dengan <tt>VALUE</tt>.
         Nilai yang tidak boleh berubah dideklarasikan dengan <tt>CONSTANTS</tt>.</p>
      <table>
        <tr><th>Tipe</th><th>Isi</th><th>Nilai awal</th></tr>
        <tr><td><tt>i</tt></td><td>bilangan bulat</td><td>0</td></tr>
        <tr><td><tt>p DECIMALS n</tt></td><td>bilangan desimal (uang, kuantitas)</td><td>0</td></tr>
        <tr><td><tt>c LENGTH n</tt></td><td>teks dengan panjang tetap</td><td>spasi</td></tr>
        <tr><td><tt>n LENGTH n</tt></td><td>teks berisi angka saja (nomor dokumen)</td><td>000…</td></tr>
        <tr><td><tt>string</tt></td><td>teks dengan panjang bebas</td><td>kosong</td></tr>
        <tr><td><tt>d</tt> / <tt>t</tt></td><td>tanggal YYYYMMDD / waktu HHMMSS</td><td>00000000</td></tr>
      </table>
      <p>Kebiasaan penamaan: <tt>lv_</tt> variabel lokal, <tt>gv_</tt> global, <tt>gc_</tt> konstanta.
         <tt>CLEAR</tt> mengembalikan variabel ke nilai awal tipenya. <tt>sy-datum</tt> adalah <b>system field</b> berisi tanggal hari ini.</p>
      <ul>
        <li>Tanggal disimpan sebagai <tt>YYYYMMDD</tt>, tetapi <tt>WRITE</tt> menampilkannya sebagai <tt>DD.MM.YYYY</tt>.</li>
        <li>Variabel <tt>TYPE c</tt> hanya menampung sebanyak panjangnya: kelebihannya <b>terpotong</b> tanpa error. <tt>TYPE c</tt> tanpa panjang berarti satu karakter.</li>
        <li><tt>TYPE n</tt> selalu terisi penuh dengan nol di depan; <tt>TYPE p DECIMALS 2</tt> membulatkan ke dua desimal.</li>
      </ul>`,
    code: `REPORT z_learn_variables.

DATA: lv_name     TYPE string VALUE 'Budi Santoso',
      lv_age      TYPE i VALUE 25,
      lv_salary   TYPE p DECIMALS 2 VALUE '7500000.50',
      lv_code(4)  TYPE c VALUE 'A001',
      lv_emp_id   TYPE n LENGTH 6 VALUE '000123',
      lv_date     TYPE d,
      lv_active   TYPE abap_bool VALUE abap_true.

CONSTANTS gc_company TYPE string VALUE 'PT Maju Bersama'.

lv_date    = sy-datum.              " system date, format YYYYMMDD
lv_age     = lv_age + 1.

WRITE: / 'Company    :', gc_company.
WRITE: / 'Name       :', lv_name.
WRITE: / 'Age        :', lv_age.
WRITE: / 'Salary     :', lv_salary.
WRITE: / 'Code / ID  :', lv_code, lv_emp_id.
WRITE: / 'Date       :', lv_date.
WRITE: / 'Active     :', lv_active.

CLEAR lv_age.
WRITE: / 'After CLEAR, age =', lv_age.`,
    task: `<ul>
      <li>Tambahkan variabel <tt>lv_city</tt> bertipe <tt>string</tt> dan cetak nilainya.</li>
      <li>Coba ubah nilai konstanta: <tt>gc_company = 'Lain'.</tt> Jalankan dan baca pesan error-nya.</li>
      <li>Isi <tt>lv_code</tt> dengan teks yang lebih panjang dari 4 karakter (<tt>lv_code = 'ABCDEFG'.</tt>) dan lihat apa yang tersimpan.</li>
      <li>Pakai variabel yang belum dideklarasikan (misalnya <tt>lv_typo = 1.</tt>) dan perhatikan peringatannya.</li>
    </ul>`
  },
  {
    id: 'p03', level: 1,
    title: 'Operator dan perhitungan',
    goal: 'Melakukan operasi aritmatika dan memahami pembulatan pada tipe i.',
    body: `
      <p>Operator aritmatika: <tt>+</tt> <tt>-</tt> <tt>*</tt> <tt>/</tt>, <tt>DIV</tt> (hasil bagi bulat) dan <tt>MOD</tt> (sisa bagi).
         Operator dan tanda kurung <b>wajib diapit spasi</b>: tulis <tt>( lv_a + lv_b ) * 2</tt>, bukan <tt>(lv_a+lv_b)*2</tt>.</p>
      <ul>
        <li>Perkalian dan pembagian dikerjakan lebih dulu daripada penjumlahan dan pengurangan.</li>
        <li>Hasil yang disimpan ke variabel <tt>TYPE i</tt> <b>dibulatkan</b>, bukan dipotong: 17 / 5 = 3,4 menjadi 3, sedangkan 18 / 5 = 3,6 menjadi 4.</li>
        <li>Bentuk lama yang masih sering ditemui: <tt>ADD</tt>, <tt>SUBTRACT</tt>, <tt>MULTIPLY</tt>, <tt>DIVIDE</tt>.</li>
      </ul>`,
    code: `REPORT z_learn_calculation.

DATA: lv_a        TYPE i VALUE 17,
      lv_b        TYPE i VALUE 5,
      lv_result   TYPE i,
      lv_quotient TYPE p DECIMALS 2.

lv_result   = lv_a + lv_b.     WRITE: / '17 + 5        =', lv_result.
lv_result   = lv_a - lv_b.     WRITE: / '17 - 5        =', lv_result.
lv_result   = lv_a * lv_b.     WRITE: / '17 * 5        =', lv_result.
lv_quotient = lv_a / lv_b.     WRITE: / '17 / 5        =', lv_quotient.
lv_result   = lv_a / lv_b.     WRITE: / '17 / 5 (to i) =', lv_result, '<- rounded'.
lv_result   = lv_a DIV lv_b.   WRITE: / '17 DIV 5      =', lv_result.
lv_result   = lv_a MOD lv_b.   WRITE: / '17 MOD 5      =', lv_result.

* Order of evaluation and parentheses
lv_result = lv_a + lv_b * 2.    WRITE: / '17 + 5 * 2    =', lv_result.
lv_result = ( lv_a + lv_b ) * 2. WRITE: / '( 17 + 5 ) * 2 =', lv_result.

* The old statement forms
ADD 10 TO lv_result.           WRITE: / 'ADD 10        =', lv_result.
SUBTRACT 4 FROM lv_result.     WRITE: / 'SUBTRACT 4    =', lv_result.
MULTIPLY lv_result BY 2.       WRITE: / 'MULTIPLY BY 2 =', lv_result.
DIVIDE lv_result BY 4.         WRITE: / 'DIVIDE BY 4   =', lv_result.`,
    task: `<ul>
      <li>Hitung luas dan keliling persegi panjang berukuran 12 × 7.</li>
      <li>Ubah <tt>lv_b</tt> menjadi 0 lalu jalankan. Program berhenti dengan exception <tt>CX_SY_ZERODIVIDE</tt> — cara menangkapnya dibahas di level Mahir.</li>
    </ul>`
  },
  {
    id: 'p04', level: 1,
    title: 'Percabangan: IF dan CASE',
    goal: 'Mengambil keputusan dengan IF / ELSEIF / ELSE dan CASE.',
    body: `
      <p><tt>IF</tt> menguji kondisi dan selalu ditutup <tt>ENDIF.</tt> Pembanding bisa ditulis dengan simbol atau huruf:
         <tt>=</tt>/<tt>EQ</tt>, <tt>&lt;&gt;</tt>/<tt>NE</tt>, <tt>&lt;</tt>/<tt>LT</tt>, <tt>&gt;</tt>/<tt>GT</tt>, <tt>&lt;=</tt>/<tt>LE</tt>, <tt>&gt;=</tt>/<tt>GE</tt>.</p>
      <ul>
        <li>Kondisi digabung dengan <tt>AND</tt>, <tt>OR</tt>, <tt>NOT</tt>; tanda kurung mengatur pengelompokan.</li>
        <li><tt>BETWEEN a AND b</tt> menguji rentang; <tt>IS INITIAL</tt> menguji apakah variabel masih kosong.</li>
        <li><tt>CASE</tt> lebih rapi daripada rangkaian <tt>ELSEIF</tt> bila satu variabel dibandingkan dengan banyak nilai. <tt>WHEN OTHERS</tt> menangkap sisanya.</li>
      </ul>`,
    code: `REPORT z_learn_if.

DATA: lv_score TYPE i VALUE 78,
      lv_grade TYPE c LENGTH 1,
      lv_day   TYPE i VALUE 6,
      lv_name  TYPE string.

IF lv_score >= 85.
  lv_grade = 'A'.
ELSEIF lv_score >= 70.
  lv_grade = 'B'.
ELSEIF lv_score >= 55.
  lv_grade = 'C'.
ELSE.
  lv_grade = 'D'.
ENDIF.
WRITE: / 'Score', lv_score, '-> grade', lv_grade.

IF lv_score BETWEEN 55 AND 100 AND lv_grade <> 'D'.
  WRITE / 'Status: PASSED'.
ENDIF.

IF lv_name IS INITIAL.
  WRITE / 'The name is still empty.'.
ENDIF.

IF NOT ( lv_day = 6 OR lv_day = 7 ).
  WRITE / 'Working day.'.
ELSE.
  WRITE / 'Weekend.'.
ENDIF.

CASE lv_day.
  WHEN 1.
    WRITE / 'Monday'.
  WHEN 2 OR 3 OR 4.
    WRITE / 'Midweek'.
  WHEN 5.
    WRITE / 'Friday'.
  WHEN 6 OR 7.
    WRITE / 'Saturday or Sunday'.
  WHEN OTHERS.
    WRITE / 'Invalid day number'.
ENDCASE.`,
    task: `<ul>
      <li>Ubah <tt>lv_score</tt> menjadi 90, 60, dan 40. Cek grade-nya.</li>
      <li>Tambahkan variabel <tt>lv_age</tt> dan cetak "Anak", "Remaja", atau "Dewasa" berdasarkan rentang umur.</li>
    </ul>`
  },
  {
    id: 'p05', level: 1,
    title: 'Perulangan: DO dan WHILE',
    goal: 'Mengulang blok kode dan mengendalikannya dengan EXIT, CONTINUE, CHECK.',
    body: `
      <ul>
        <li><tt>DO n TIMES. … ENDDO.</tt> mengulang tepat n kali. <tt>sy-index</tt> berisi nomor putaran (mulai dari 1).</li>
        <li><tt>WHILE kondisi. … ENDWHILE.</tt> mengulang selama kondisi benar.</li>
        <li><tt>DO.</tt> tanpa jumlah berulang tanpa batas — <b>wajib</b> ada <tt>EXIT</tt> di dalamnya.</li>
        <li><tt>EXIT</tt> keluar dari loop, <tt>CONTINUE</tt> lompat ke putaran berikutnya, <tt>CHECK kondisi</tt> sama dengan "kalau kondisi salah, CONTINUE".</li>
      </ul>`,
    code: `REPORT z_learn_loop.

DATA: lv_number TYPE i VALUE 1,
      lv_i      TYPE i,
      lv_total  TYPE i.

* 1) A fixed number of passes
DO 5 TIMES.
  lv_total = lv_total + sy-index.
  WRITE: / 'Pass', sy-index, '| running total', lv_total.
ENDDO.

* 2) As long as the condition is true
WHILE lv_number <= 50.
  lv_number = lv_number * 2.
ENDWHILE.
WRITE: / 'First value above 50 when doubling:', lv_number.

* 3) Endless loop + EXIT / CONTINUE: print the odd numbers below 10
ULINE.
DO.
  lv_i = lv_i + 1.
  IF lv_i > 9.
    EXIT.
  ENDIF.
  IF lv_i MOD 2 = 0.
    CONTINUE.
  ENDIF.
  WRITE: / 'Odd:', lv_i.
ENDDO.

* 4) CHECK: only multiples of 3 get through
ULINE.
DO 10 TIMES.
  CHECK sy-index MOD 3 = 0.
  WRITE: / 'Multiple of 3:', sy-index.
ENDDO.`,
    task: `<ul>
      <li>Cetak tabel perkalian 7 (7 × 1 sampai 7 × 10).</li>
      <li>Hitung faktorial 6 dengan <tt>WHILE</tt>.</li>
      <li>Hapus <tt>EXIT</tt> pada loop ketiga dan jalankan: simulator menghentikan loop tak berujung dan menampilkan runtime error.</li>
    </ul>`
  },
  {
    id: 'p06', level: 1,
    title: 'Mengolah string',
    goal: 'Menggabung, memotong, mencari, dan mengubah teks.',
    body: `
      <ul>
        <li>Gabung: <tt>CONCATENATE a b INTO c SEPARATED BY space.</tt>, operator <tt>&amp;&amp;</tt>, atau <b>string template</b> <tt>|teks { variabel } teks|</tt>.</li>
        <li>Potong: <tt>SPLIT teks AT ';' INTO a b c.</tt> dan akses sebagian <tt>teks+offset(panjang)</tt> — misalnya <tt>lv_date+0(4)</tt> mengambil tahun.</li>
        <li>Ubah: <tt>TRANSLATE … TO UPPER CASE</tt>, <tt>CONDENSE</tt> (rapikan spasi), <tt>REPLACE ALL OCCURRENCES OF … IN … WITH …</tt>.</li>
        <li>Cari: <tt>FIND 'kata' IN teks MATCH OFFSET posisi.</tt> lalu periksa <tt>sy-subrc</tt> (0 = ketemu). Operator <tt>CS</tt> berarti "mengandung".</li>
        <li><tt>strlen( teks )</tt> mengembalikan panjang teks.</li>
      </ul>`,
    code: `REPORT z_learn_string.

DATA: lv_first_name TYPE string VALUE 'Siti',
      lv_last_name  TYPE string VALUE 'Rahayu',
      lv_full_name  TYPE string,
      lv_text       TYPE string VALUE '   learning   abap   is   fun   ',
      lv_csv        TYPE string VALUE 'Jakarta;Bandung;Surabaya',
      lv_city1      TYPE string,
      lv_city2      TYPE string,
      lv_city3      TYPE string,
      lv_date       TYPE d VALUE '20250817',
      lv_len        TYPE i,
      lv_pos        TYPE i.

* Three ways to concatenate
CONCATENATE lv_first_name lv_last_name INTO lv_full_name SEPARATED BY space.
WRITE: / 'CONCATENATE :', lv_full_name.
lv_full_name = lv_first_name && ' ' && lv_last_name.
WRITE: / 'Operator && :', lv_full_name.
lv_full_name = |{ lv_first_name } { lv_last_name } ({ strlen( lv_first_name ) } letters in the first name)|.
WRITE: / 'Template    :', lv_full_name.

* Length, upper case, tidying up spaces
lv_len = strlen( lv_text ).
WRITE: / 'Start length:', lv_len.
CONDENSE lv_text.
WRITE: / 'CONDENSE    :', lv_text.
TRANSLATE lv_text TO UPPER CASE.
WRITE: / 'UPPER CASE  :', lv_text.

* Replacing and searching
REPLACE ALL OCCURRENCES OF 'FUN' IN lv_text WITH 'EASY'.
WRITE: / 'REPLACE     :', lv_text.
FIND 'ABAP' IN lv_text MATCH OFFSET lv_pos.
IF sy-subrc = 0.
  WRITE: / 'The word ABAP is at offset', lv_pos.
ENDIF.
IF lv_text CS 'easy'.
  WRITE / 'The text contains the word EASY (CS ignores upper/lower case).'.
ENDIF.

* Splitting and taking a part
SPLIT lv_csv AT ';' INTO lv_city1 lv_city2 lv_city3.
WRITE: / 'SPLIT       :', lv_city1, '|', lv_city2, '|', lv_city3.
WRITE: / 'Date        :', lv_date+6(2), '-', lv_date+4(2), '-', lv_date+0(4).`,
    task: `<ul>
      <li>Buat inisial dari nama depan dan belakang (contoh: "S.R.") memakai <tt>+0(1)</tt>.</li>
      <li>Pecah alamat email di tanda <tt>@</tt> menjadi nama pengguna dan domain.</li>
    </ul>`
  },

  // ════════════════════════════════════════════════════════
  // LEVEL 2 — DASAR
  // ════════════════════════════════════════════════════════
  {
    id: 'd01', level: 2,
    title: 'Struktur (work area)',
    goal: 'Mengelompokkan beberapa field menjadi satu struktur dengan TYPES … BEGIN OF.',
    body: `
      <p>Struktur adalah satu variabel yang punya beberapa <b>komponen</b> (field). Bentuknya didefinisikan dulu sebagai tipe:</p>
      <ul>
        <li><tt>TYPES: BEGIN OF ty_x, … END OF ty_x.</tt> membuat <b>tipe</b>; <tt>DATA ls_x TYPE ty_x.</tt> membuat <b>variabelnya</b>.</li>
        <li>Komponen diakses dengan tanda hubung: <tt>ls_employee-name</tt>.</li>
        <li>Menyalin struktur berarti menyalin <b>semua</b> komponennya; salinan tidak terhubung ke aslinya.</li>
        <li>Struktur boleh berisi struktur lain: <tt>ls_office-address-city</tt>.</li>
        <li><tt>MOVE-CORRESPONDING a TO b.</tt> menyalin hanya komponen yang namanya sama.</li>
      </ul>
      <p>Kebiasaan penamaan: <tt>ty_</tt> tipe, <tt>ls_</tt>/<tt>gs_</tt> struktur (work area), <tt>lt_</tt>/<tt>gt_</tt> internal table.</p>`,
    code: `REPORT z_learn_structures.

TYPES: BEGIN OF ty_employee,
         emp_id   TYPE n LENGTH 6,
         name     TYPE string,
         division TYPE c LENGTH 10,
         salary   TYPE i,
       END OF ty_employee.

TYPES: BEGIN OF ty_address,
         city     TYPE string,
         postcode TYPE n LENGTH 5,
       END OF ty_address.

TYPES: BEGIN OF ty_contact,
         name TYPE string,
         city TYPE string,
       END OF ty_contact.

DATA: ls_employee TYPE ty_employee,
      ls_copy     TYPE ty_employee,
      ls_contact  TYPE ty_contact.

* A nested structure declared directly as a variable
DATA: BEGIN OF ls_office,
        name    TYPE string,
        address TYPE ty_address,
      END OF ls_office.

ls_employee-emp_id   = '000101'.
ls_employee-name     = 'Rudi Hartono'.
ls_employee-division = 'IT'.
ls_employee-salary   = 9500000.

ls_copy = ls_employee.                " all components are copied
ls_copy-name = 'Dewi Lestari'.        " the original is unchanged

WRITE: / 'Original:', ls_employee-emp_id, ls_employee-name, ls_employee-division, ls_employee-salary.
WRITE: / 'Copy    :', ls_copy-emp_id, ls_copy-name, ls_copy-division, ls_copy-salary.

ls_office-name             = 'Head Office'.
ls_office-address-city     = 'Jakarta'.
ls_office-address-postcode = '10220'.
WRITE: / ls_office-name, '-', ls_office-address-city, ls_office-address-postcode.

MOVE-CORRESPONDING ls_employee TO ls_contact.   " only the matching component NAMA
WRITE: / 'Contact :', ls_contact-name, '| city:', ls_contact-city.

CLEAR ls_employee.
IF ls_employee IS INITIAL.
  WRITE / 'After CLEAR all components are empty again.'.
ENDIF.`,
    task: `<ul>
      <li>Tambahkan komponen <tt>email</tt> ke <tt>ty_employee</tt> lalu isi dan cetak.</li>
      <li>Coba isi komponen yang tidak ada (<tt>ls_employee-address = 'x'.</tt>) dan baca pesan error-nya.</li>
    </ul>`
  },
  {
    id: 'd02', level: 2,
    title: 'Internal table: APPEND dan LOOP',
    goal: 'Menyimpan banyak baris data di memori dan membacanya satu per satu.',
    body: `
      <p><b>Internal table</b> adalah tabel di memori program — struktur data terpenting di ABAP. Polanya selalu sama:
         satu tipe baris, satu tabel, satu <b>work area</b> untuk memegang satu baris.</p>
      <ul>
        <li><tt>DATA gt_x TYPE STANDARD TABLE OF ty_x.</tt> — tabelnya. <tt>DATA gs_x TYPE ty_x.</tt> — work area.</li>
        <li><tt>APPEND gs_x TO gt_x.</tt> menambah baris di akhir. Target <tt>APPEND</tt> harus <b>tabel</b>, bukan struktur atau komponen.</li>
        <li><tt>LOOP AT gt_x INTO gs_x. … ENDLOOP.</tt> membaca setiap baris; <tt>sy-tabix</tt> berisi nomor baris.</li>
        <li><tt>LOOP … WHERE kondisi.</tt> hanya memproses baris yang memenuhi kondisi.</li>
        <li><tt>lines( gt_x )</tt> mengembalikan jumlah baris.</li>
      </ul>`,
    code: `REPORT z_learn_itab.

TYPES: BEGIN OF ty_product,
         code  TYPE c LENGTH 5,
         name  TYPE string,
         price TYPE i,
         stock TYPE i,
       END OF ty_product.

DATA: gt_products TYPE STANDARD TABLE OF ty_product, " internal table
      gs_product  TYPE ty_product,                   " work area (one row)
      gv_count    TYPE i,
      gv_value    TYPE i.

gs_product-code = 'P001'. gs_product-name = 'Keyboard'. gs_product-price = 350000.  gs_product-stock = 12.
APPEND gs_product TO gt_products.
gs_product-code = 'P002'. gs_product-name = 'Mouse'.    gs_product-price = 150000.  gs_product-stock = 40.
APPEND gs_product TO gt_products.
gs_product-code = 'P003'. gs_product-name = 'Monitor'.  gs_product-price = 2500000. gs_product-stock = 5.
APPEND gs_product TO gt_products.
gs_product-code = 'P004'. gs_product-name = 'Webcam'.   gs_product-price = 600000.  gs_product-stock = 0.
APPEND gs_product TO gt_products.

gv_count = lines( gt_products ).
WRITE: / 'Number of products:', gv_count.
ULINE.

LOOP AT gt_products INTO gs_product.
  gv_value = gv_value + gs_product-price * gs_product-stock.
  WRITE: / sy-tabix, gs_product-code, gs_product-name, gs_product-price, gs_product-stock.
ENDLOOP.
ULINE.
WRITE: / 'Total stock value:', gv_value.

SKIP.
WRITE / 'Low stock (below 10):'.
LOOP AT gt_products INTO gs_product WHERE stock < 10.
  WRITE: / '-', gs_product-name, 'left', gs_product-stock.
ENDLOOP.`,
    task: `<ul>
      <li>Tambahkan dua produk lagi dan pastikan total nilai persediaan ikut berubah.</li>
      <li>Cetak hanya produk yang harganya di atas 500.000.</li>
      <li>Tulis <tt>APPEND gs_product TO gs_product-name.</tt> dan jalankan — inilah error yang paling sering dibuat pemula.</li>
    </ul>`
  },
  {
    id: 'd03', level: 2,
    title: 'Internal table: READ, MODIFY, DELETE, SORT',
    goal: 'Mencari satu baris, mengubahnya, menghapus baris, dan mengurutkan tabel.',
    body: `
      <ul>
        <li><tt>READ TABLE gt INTO gs INDEX n.</tt> mengambil baris ke-n; <tt>… WITH KEY field = nilai.</tt> mencari berdasarkan isi.</li>
        <li>Setelah <tt>READ TABLE</tt> <b>selalu periksa <tt>sy-subrc</tt></b>: 0 = ketemu, 4 = tidak ketemu. Kalau tidak ketemu, work area masih berisi data lama.</li>
        <li><tt>MODIFY gt FROM gs INDEX n.</tt> menulis balik work area ke tabel. Mengubah work area saja <b>tidak</b> mengubah tabel.</li>
        <li><tt>DELETE gt WHERE kondisi.</tt> / <tt>DELETE gt INDEX n.</tt> menghapus baris.</li>
        <li><tt>SORT gt BY field [DESCENDING].</tt> mengurutkan; <tt>DELETE ADJACENT DUPLICATES FROM gt COMPARING field.</tt> membuang duplikat (tabel harus sudah diurutkan).</li>
      </ul>`,
    code: `REPORT z_learn_itab_ops.

TYPES: BEGIN OF ty_product,
         code     TYPE c LENGTH 5,
         name     TYPE string,
         category TYPE c LENGTH 10,
         price    TYPE i,
       END OF ty_product.

DATA: gt_products TYPE STANDARD TABLE OF ty_product,
      gs_product TYPE ty_product.

gs_product-code = 'P003'. gs_product-name = 'Monitor'.  gs_product-category = 'DISPLAY'. gs_product-price = 2500000.
APPEND gs_product TO gt_products.
gs_product-code = 'P001'. gs_product-name = 'Keyboard'. gs_product-category = 'INPUT'.   gs_product-price = 350000.
APPEND gs_product TO gt_products.
gs_product-code = 'P002'. gs_product-name = 'Mouse'.    gs_product-category = 'INPUT'.   gs_product-price = 150000.
APPEND gs_product TO gt_products.
gs_product-code = 'P004'. gs_product-name = 'Projector'. gs_product-category = 'DISPLAY'. gs_product-price = 0.
APPEND gs_product TO gt_products.

* Read by row number
READ TABLE gt_products INTO gs_product INDEX 2.
WRITE: / 'Row 2           :', gs_product-name.

* Read by content, then change it and write it back
READ TABLE gt_products INTO gs_product WITH KEY code = 'P002'.
IF sy-subrc = 0.
  gs_product-price = 175000.
  MODIFY gt_products FROM gs_product INDEX sy-tabix.
  WRITE: / 'Price of P002 changed in row', sy-tabix.
ENDIF.

READ TABLE gt_products INTO gs_product WITH KEY code = 'P999'.
IF sy-subrc <> 0.
  WRITE: / 'P999 not found, sy-subrc =', sy-subrc.
ENDIF.

* Delete products without a price, then sort from the most expensive
DELETE gt_products WHERE price = 0.
SORT gt_products BY price DESCENDING.

ULINE.
LOOP AT gt_products INTO gs_product.
  WRITE: / sy-tabix, gs_product-code, gs_product-name, gs_product-category, gs_product-price.
ENDLOOP.

* List of unique categories
SORT gt_products BY category.
DELETE ADJACENT DUPLICATES FROM gt_products COMPARING category.
ULINE.
LOOP AT gt_products INTO gs_product.
  WRITE: / 'Categories:', gs_product-category.
ENDLOOP.`,
    task: `<ul>
      <li>Naikkan harga semua produk kategori INPUT sebesar 10% dengan <tt>LOOP</tt> + <tt>MODIFY</tt>.</li>
      <li>Urutkan berdasarkan kategori lalu harga (<tt>SORT gt_products BY category price DESCENDING.</tt>).</li>
    </ul>`
  },
  {
    id: 'd04', level: 2,
    title: 'Field-symbol',
    goal: 'Mengubah baris internal table langsung di tempatnya tanpa menyalin.',
    body: `
      <p><b>Field-symbol</b> adalah penunjuk ke data yang sudah ada — mirip "nama lain" untuk sebuah variabel atau baris tabel.
         Namanya selalu diapit tanda <tt>&lt; &gt;</tt>.</p>
      <ul>
        <li><tt>LOOP AT gt ASSIGNING &lt;fs&gt;.</tt> — <tt>&lt;fs&gt;</tt> menunjuk langsung ke baris tabel. Mengubah <tt>&lt;fs&gt;-price</tt> langsung mengubah tabel, tanpa <tt>MODIFY</tt>.</li>
        <li>Lebih cepat daripada <tt>INTO</tt> karena tidak ada penyalinan baris — penting untuk tabel besar.</li>
        <li><tt>ASSIGN variabel TO &lt;fs&gt;.</tt> menunjuk ke variabel biasa. <tt>IS ASSIGNED</tt> memeriksa apakah field-symbol sudah menunjuk ke sesuatu.</li>
      </ul>`,
    code: `REPORT z_learn_fs.

TYPES: BEGIN OF ty_product,
         code  TYPE c LENGTH 5,
         name  TYPE string,
         price TYPE i,
         stock TYPE i,
       END OF ty_product.

DATA: gt_products TYPE STANDARD TABLE OF ty_product,
      gs_product  TYPE ty_product,
      gv_number   TYPE i VALUE 10.

FIELD-SYMBOLS: <fs_product> TYPE ty_product,
               <fs_number>  TYPE i.

gs_product-code = 'P001'. gs_product-name = 'Keyboard'. gs_product-price = 350000. gs_product-stock = 12.
APPEND gs_product TO gt_products.
gs_product-code = 'P002'. gs_product-name = 'Mouse'.    gs_product-price = 150000. gs_product-stock = 40.
APPEND gs_product TO gt_products.

* Raise all prices by 10% directly inside the table
LOOP AT gt_products ASSIGNING <fs_product>.
  <fs_product>-price = <fs_product>-price * 110 / 100.
ENDLOOP.

* Find one row and change it in place
READ TABLE gt_products ASSIGNING <fs_product> WITH KEY code = 'P002'.
IF sy-subrc = 0.
  <fs_product>-stock = 0.
ENDIF.

LOOP AT gt_products INTO gs_product.
  WRITE: / gs_product-code, gs_product-name, gs_product-price, gs_product-stock.
ENDLOOP.

* A field symbol for an ordinary variable
ASSIGN gv_number TO <fs_number>.
<fs_number> = 99.
WRITE: / 'gv_number is now:', gv_number.

UNASSIGN <fs_number>.
IF <fs_number> IS NOT ASSIGNED.
  WRITE / 'The field symbol has been unassigned.'.
ENDIF.`,
    task: `<ul>
      <li>Ganti loop pertama menjadi <tt>LOOP … INTO gs_product</tt> tanpa <tt>MODIFY</tt>. Apakah harga di tabel berubah?</li>
      <li>Dengan field-symbol, set stok menjadi 100 hanya untuk produk yang harganya di bawah 200.000 (<tt>LOOP … ASSIGNING … WHERE</tt>).</li>
    </ul>`
  },
  {
    id: 'd05', level: 2,
    title: 'Subroutine: FORM dan PERFORM',
    goal: 'Memecah program menjadi bagian-bagian kecil yang bisa dipanggil ulang.',
    body: `
      <p><tt>FORM nama. … ENDFORM.</tt> mendefinisikan subroutine; <tt>PERFORM nama.</tt> memanggilnya. FORM ditulis di bagian bawah program.</p>
      <ul>
        <li><tt>USING</tt> — data yang <b>masuk</b> ke FORM.</li>
        <li><tt>CHANGING</tt> — data yang <b>diubah</b> oleh FORM dan dikembalikan ke pemanggil.</li>
        <li><tt>TABLES</tt> — internal table yang dioper ke FORM (gaya lama, masih banyak dipakai).</li>
        <li>Parameter dicocokkan berdasarkan <b>urutan</b>, bukan nama. Jumlahnya harus sama di <tt>PERFORM</tt> dan <tt>FORM</tt>.</li>
        <li>Variabel yang dideklarasikan di dalam FORM bersifat <b>lokal</b>: hilang setelah FORM selesai.</li>
      </ul>`,
    code: `REPORT z_learn_form.

DATA: gv_area    TYPE i,
      gv_total   TYPE i,
      gt_numbers TYPE STANDARD TABLE OF i.

START-OF-SELECTION.
  PERFORM show_title USING 'Subroutine exercise'.

  PERFORM calculate_area USING 8 5 CHANGING gv_area.
  WRITE: / 'Area 8 x 5 =', gv_area.

  APPEND 10 TO gt_numbers.
  APPEND 25 TO gt_numbers.
  APPEND 40 TO gt_numbers.
  PERFORM sum_up TABLES gt_numbers CHANGING gv_total.
  WRITE: / 'Sum of the table =', gv_total.

*&---------------------------------------------------------------------*
FORM show_title USING pv_title TYPE string.
  WRITE / pv_title.
  ULINE.
ENDFORM.

FORM calculate_area USING    pv_length TYPE i
                          pv_width     TYPE i
                 CHANGING cv_area      TYPE i.
  DATA lv_temp TYPE i.            " local variable
  lv_temp = pv_length * pv_width.
  cv_area = lv_temp.
ENDFORM.

FORM sum_up TABLES   pt_numbers
               CHANGING cv_total TYPE i.
  DATA lv_number TYPE i.
  CLEAR cv_total.
  LOOP AT pt_numbers INTO lv_number.
    cv_total = cv_total + lv_number.
  ENDLOOP.
ENDFORM.`,
    task: `<ul>
      <li>Buat FORM <tt>calculate_discount</tt> dengan <tt>USING</tt> harga dan persen, <tt>CHANGING</tt> harga akhir.</li>
      <li>Panggil <tt>PERFORM calculate_area USING 8 CHANGING gv_area.</tt> (kurang satu parameter) dan baca pesan error-nya.</li>
      <li>Di program utama, coba cetak <tt>lv_temp</tt> setelah <tt>PERFORM</tt>. Mengapa tidak bisa?</li>
    </ul>`
  },
  {
    id: 'd06', level: 2,
    title: 'Selection screen',
    goal: 'Meminta masukan pengguna dengan PARAMETERS dan SELECT-OPTIONS.',
    body: `
      <p>Layar pertama sebuah laporan SAP adalah <b>selection screen</b>: tempat pengguna mengisi kriteria sebelum menekan F8 (Execute).</p>
      <ul>
        <li><tt>PARAMETERS p_x TYPE … DEFAULT ….</tt> — satu nilai. <tt>AS CHECKBOX</tt> membuat kotak centang (berisi <tt>'X'</tt> atau kosong).</li>
        <li><tt>SELECT-OPTIONS s_x FOR variabel.</tt> — rentang nilai (dari–sampai). Dipakai di <tt>WHERE field IN s_x</tt>. Kalau dikosongkan, semua nilai lolos.</li>
        <li>Blok event: <tt>INITIALIZATION</tt> berjalan sebelum layar tampil; <tt>START-OF-SELECTION</tt> berjalan setelah pengguna menekan Execute.</li>
      </ul>
      <p>Di studio ini, klik <b>Parameters (F8)</b> untuk membuka selection screen dan mengisi nilainya.
         Tombol <b>Run Program</b> langsung memakai nilai <tt>DEFAULT</tt>.</p>`,
    code: `REPORT z_learn_selscreen.

DATA: gt_flight TYPE STANDARD TABLE OF sflight,
      gs_flight TYPE sflight,
      gv_price  TYPE sflight-price.

PARAMETERS: p_carr  TYPE sflight-carrid DEFAULT 'GA',
            p_max   TYPE i DEFAULT 10,
            p_detail AS CHECKBOX DEFAULT 'X'.

SELECT-OPTIONS s_price FOR gv_price DEFAULT 500000 TO 1000000.

INITIALIZATION.
  " runs once, before the selection screen is shown

START-OF-SELECTION.
  SELECT * FROM sflight
    INTO TABLE gt_flight
    UP TO p_max ROWS
    WHERE carrid = p_carr
      AND price IN s_price.

  IF sy-subrc <> 0.
    WRITE: / 'No flights', p_carr, 'in that price range.'.
  ELSE.
    WRITE: / 'Airline', p_carr, '-', sy-dbcnt, 'flights found.'.
    IF p_detail = 'X'.
      ULINE.
      LOOP AT gt_flight INTO gs_flight.
        WRITE: / gs_flight-connid, gs_flight-fldate, gs_flight-price, gs_flight-currency.
      ENDLOOP.
    ENDIF.
  ENDIF.`,
    task: `<ul>
      <li>Buka <b>Parameters (F8)</b>, kosongkan rentang harga, dan jalankan. Berapa penerbangan yang muncul?</li>
      <li>Isi <tt>P_CARR</tt> dengan <tt>SQ</tt> dan sesuaikan rentang harganya (harga SQ dalam SGD, sekitar 1.200).</li>
      <li>Hilangkan centang <tt>P_DETAIL</tt> dan lihat perbedaannya.</li>
    </ul>`
  },
  {
    id: 'd07', level: 2,
    title: 'SELECT: membaca database',
    goal: 'Mengambil data dari tabel database ke internal table dengan OpenSQL.',
    body: `
      <p><tt>SELECT</tt> membaca tabel database. Studio ini menyediakan tabel contoh (lihat menu <b>Tables (DB)</b>):
         SCARR, SPFLI, SFLIGHT, SBOOK, MARA, MAKT, KNA1, LFA1, T001, T005, VBAK, VBAP, dan dua puluh tabel lainnya.</p>
      <ul>
        <li><tt>SELECT f1 f2 FROM tabel INTO TABLE gt WHERE ….</tt> — banyak baris ke internal table.</li>
        <li><tt>SELECT SINGLE … INTO gs WHERE ….</tt> — tepat satu baris ke work area.</li>
        <li>Ambil <b>hanya kolom yang diperlukan</b>; <tt>SELECT *</tt> mengambil semua kolom.</li>
        <li>Setelah SELECT: <tt>sy-subrc</tt> = 0 bila ada data, 4 bila tidak ada; <tt>sy-dbcnt</tt> = jumlah baris.</li>
        <li><tt>ORDER BY</tt> mengurutkan, <tt>UP TO n ROWS</tt> membatasi jumlah, <tt>LIKE 'PT%'</tt> mencocokkan pola, <tt>COUNT( * )</tt> menghitung baris.</li>
      </ul>
      <p>Jangan menaruh <tt>SELECT</tt> di dalam <tt>LOOP</tt> — itu pola paling lambat di ABAP. Solusinya (JOIN, FOR ALL ENTRIES) ada di level berikutnya.</p>`,
    code: `REPORT z_learn_select.

TYPES: BEGIN OF ty_cust,
         kunnr TYPE kna1-kunnr,
         name1 TYPE kna1-name1,
         ort01 TYPE kna1-ort01,
         land1 TYPE kna1-land1,
       END OF ty_cust.

DATA: gt_cust  TYPE STANDARD TABLE OF ty_cust,
      gs_cust  TYPE ty_cust,
      gs_t001  TYPE t001,
      gv_count TYPE i.

* Many rows -> internal table
SELECT kunnr name1 ort01 land1
  FROM kna1
  INTO TABLE gt_cust
  WHERE land1 = 'ID'
  ORDER BY name1.

WRITE: / 'Customers in Indonesia:', sy-dbcnt, 'rows'.
LOOP AT gt_cust INTO gs_cust.
  WRITE: / gs_cust-kunnr, gs_cust-name1, gs_cust-ort01.
ENDLOOP.

* One row -> work area
ULINE.
SELECT SINGLE * FROM t001 INTO gs_t001 WHERE bukrs = '1000'.
IF sy-subrc = 0.
  WRITE: / 'Company code 1000:', gs_t001-butxt, gs_t001-waers.
ELSE.
  WRITE / 'Company code 1000 does not exist.'.
ENDIF.

* Text patterns and limiting the number of rows
ULINE.
SELECT kunnr name1 ort01 land1
  FROM kna1
  INTO TABLE gt_cust
  UP TO 2 ROWS
  WHERE name1 LIKE 'PT%'.
LOOP AT gt_cust INTO gs_cust.
  WRITE: / 'Starting with PT:', gs_cust-name1.
ENDLOOP.

* Counting rows
SELECT COUNT( * ) FROM kna1 INTO gv_count WHERE land1 <> 'ID'.
WRITE: / 'Foreign customers:', gv_count.`,
    task: `<ul>
      <li>Tampilkan semua material bertipe <tt>FERT</tt> dari tabel MARA (kolom <tt>matnr</tt>, <tt>mtart</tt>, <tt>meins</tt>).</li>
      <li>Tulis nama kolom yang salah (misalnya <tt>namee1</tt>) dan baca pesan error-nya.</li>
      <li>Baca satu maskapai dari SCARR dengan <tt>SELECT SINGLE</tt> berdasarkan <tt>carrid</tt> dari sebuah <tt>PARAMETERS</tt>.</li>
    </ul>`
  },
  {
    id: 'd08', level: 2,
    title: 'Event laporan dan tata letak list',
    goal: 'Memahami urutan eksekusi sebuah report dan menata output dengan posisi kolom.',
    body: `
      <p>Program report tidak dijalankan dari atas ke bawah. SAP memanggil <b>blok event</b> dalam urutan tetap, di mana pun blok itu ditulis di dalam program:</p>
      <table>
        <tr><th>Urutan</th><th>Event</th><th>Kapan</th></tr>
        <tr><td>1</td><td><tt>INITIALIZATION</tt></td><td>sekali, sebelum selection screen tampil — tempat mengisi nilai awal</td></tr>
        <tr><td>2</td><td><tt>AT SELECTION-SCREEN</tt></td><td>setelah pengguna menekan Execute — tempat validasi masukan</td></tr>
        <tr><td>3</td><td><tt>START-OF-SELECTION</tt></td><td>proses utama</td></tr>
        <tr><td>4</td><td><tt>END-OF-SELECTION</tt></td><td>setelah proses utama selesai — biasanya mencetak hasil</td></tr>
        <tr><td>—</td><td><tt>TOP-OF-PAGE</tt></td><td>otomatis, tepat sebelum baris pertama list dicetak — judul kolom</td></tr>
      </table>
      <ul>
        <li>Deklarasi (<tt>DATA</tt>, <tt>PARAMETERS</tt>) berlaku global, di mana pun ditulis.</li>
        <li>Statement sebelum event pertama dianggap bagian dari <tt>START-OF-SELECTION</tt>.</li>
        <li><tt>MESSAGE … TYPE 'E'</tt> di <tt>AT SELECTION-SCREEN</tt> mengembalikan pengguna ke selection screen; proses utama tidak berjalan.</li>
        <li><tt>WRITE: /5 teks, 20 angka.</tt> — angka di depan nilai adalah <b>posisi kolom</b>; <tt>(10)</tt> adalah panjang output.</li>
      </ul>
      <p>Blok event di contoh ini sengaja ditulis <b>tidak berurutan</b> — hasilnya tetap sama.</p>`,
    code: `REPORT z_learn_event.

PARAMETERS: p_carr TYPE sflight-carrid,
            p_min  TYPE i DEFAULT 100.

DATA: gt_flight TYPE STANDARD TABLE OF sflight,
      gs_flight TYPE sflight,
      gv_total  TYPE i.

* Written at the top, but executed last
END-OF-SELECTION.
  LOOP AT gt_flight INTO gs_flight.
    WRITE: /3 gs_flight-connid, 12 gs_flight-fldate, 26 gs_flight-seatsocc.
    gv_total = gv_total + gs_flight-seatsocc.
  ENDLOOP.
  ULINE /1(40).
  WRITE: /3 'Total passengers', 26 gv_total.

* Automatic, right before the first line of the list is printed
TOP-OF-PAGE.
  WRITE: / 'Flights', p_carr, 'with at least', p_min, 'passengers'.
  WRITE: /3 'No.', 12 'Date', 26 'Occupied'.
  ULINE /1(40).

* Main processing
START-OF-SELECTION.
  SELECT * FROM sflight INTO TABLE gt_flight
    WHERE carrid = p_carr
      AND seatsocc >= p_min.

* Input validation
AT SELECTION-SCREEN.
  IF p_min < 0.
    MESSAGE 'The minimum number of passengers must not be negative' TYPE 'E'.
  ENDIF.

* Initial values of the selection screen
INITIALIZATION.
  p_carr = 'GA'.`,
    task: `<ul>
      <li>Buka <b>Parameters (F8)</b>: perhatikan <tt>P_CARR</tt> sudah berisi <tt>GA</tt> dari <tt>INITIALIZATION</tt>.</li>
      <li>Isi <tt>P_MIN</tt> dengan <tt>-5</tt> lalu Execute. Blok mana yang berjalan, dan mana yang tidak?</li>
      <li>Tambahkan kolom harga (<tt>price</tt>) di posisi 40, lengkap dengan judul kolomnya.</li>
    </ul>`
  },
  {
    id: 'd09', level: 2,
    title: 'Control level: AT NEW, SUM, COLLECT',
    goal: 'Membuat subtotal dan total di dalam LOOP tanpa menghitung manual.',
    body: `
      <p>Di dalam <tt>LOOP</tt> atas tabel yang <b>sudah diurutkan</b>, blok <tt>AT … ENDAT</tt> mendeteksi pergantian kelompok:</p>
      <table>
        <tr><th>Blok</th><th>Berjalan ketika</th></tr>
        <tr><td><tt>AT FIRST</tt></td><td>baris pertama</td></tr>
        <tr><td><tt>AT NEW f</tt></td><td>nilai field <tt>f</tt> (atau field di sebelah kirinya) berbeda dari baris sebelumnya</td></tr>
        <tr><td><tt>AT END OF f</tt></td><td>baris berikutnya punya nilai <tt>f</tt> yang berbeda</td></tr>
        <tr><td><tt>AT LAST</tt></td><td>baris terakhir</td></tr>
      </table>
      <ul>
        <li><tt>SUM.</tt> di dalam blok itu mengisi field angka work area dengan <b>jumlah kelompoknya</b>.</li>
        <li>Field kelompok harus berada di <b>kiri</b> struktur, dan tabel harus di-<tt>SORT</tt> lebih dulu.</li>
        <li><tt>COLLECT wa INTO itab.</tt> menjumlahkan field angka ke baris yang field non-angkanya sama — cara cepat membuat rekap.</li>
      </ul>`,
    code: `REPORT z_learn_control_level.

TYPES: BEGIN OF ty_sale,
         region  TYPE c LENGTH 10,
         sales   TYPE c LENGTH 10,
         amount  TYPE i,
       END OF ty_sale.

DATA: gt_sales   TYPE STANDARD TABLE OF ty_sale,
      gt_summary TYPE STANDARD TABLE OF ty_sale,
      gs_sale    TYPE ty_sale.

gs_sale-region = 'EAST'. gs_sale-sales = 'Rina'.    gs_sale-amount = 400. APPEND gs_sale TO gt_sales.
gs_sale-region = 'WEST'. gs_sale-sales = 'Andi'.    gs_sale-amount = 250. APPEND gs_sale TO gt_sales.
gs_sale-region = 'WEST'. gs_sale-sales = 'Budi'.    gs_sale-amount = 300. APPEND gs_sale TO gt_sales.
gs_sale-region = 'EAST'. gs_sale-sales = 'Sari'.    gs_sale-amount = 150. APPEND gs_sale TO gt_sales.
gs_sale-region = 'WEST'. gs_sale-sales = 'Andi'.    gs_sale-amount = 100. APPEND gs_sale TO gt_sales.

SORT gt_sales BY region sales.

LOOP AT gt_sales INTO gs_sale.
  AT FIRST.
    WRITE / 'Sales Report'.
    ULINE /1(32).
  ENDAT.
  AT NEW region.
    WRITE: / 'Region', gs_sale-region.
  ENDAT.

  WRITE: /5 gs_sale-sales, 20 gs_sale-amount.

  AT END OF region.
    SUM.
    WRITE: /5 'Subtotal', 20 gs_sale-amount.
    SKIP.
  ENDAT.
  AT LAST.
    SUM.
    ULINE /1(32).
    WRITE: / 'Total', 20 gs_sale-amount.
  ENDAT.
ENDLOOP.

* Summary per region with COLLECT
LOOP AT gt_sales INTO gs_sale.
  CLEAR gs_sale-sales.
  COLLECT gs_sale INTO gt_summary.
ENDLOOP.
SKIP.
LOOP AT gt_summary INTO gs_sale.
  WRITE: / 'Summary', gs_sale-region, 20 gs_sale-amount.
ENDLOOP.`,
    task: `<ul>
      <li>Hapus statement <tt>SORT</tt> dan jalankan. Mengapa subtotalnya menjadi salah?</li>
      <li>Tambahkan subtotal per sales di dalam tiap wilayah (<tt>AT END OF sales</tt>).</li>
      <li>Buat rekap per sales (bukan per wilayah) dengan <tt>COLLECT</tt>.</li>
    </ul>`
  },
  {
    id: 'd10', level: 2,
    title: 'Jenis tabel: STANDARD, SORTED, HASHED',
    goal: 'Memilih jenis internal table yang tepat dan memahami perbedaan perilakunya.',
    body: `
      <table>
        <tr><th>Jenis</th><th>Urutan baris</th><th>Akses tercepat</th><th>Cocok untuk</th></tr>
        <tr><td><tt>STANDARD</tt></td><td>sesuai urutan <tt>APPEND</tt></td><td>lewat index</td><td>daftar yang diproses berurutan</td></tr>
        <tr><td><tt>SORTED</tt></td><td>selalu terurut menurut key</td><td>lewat key (binary search)</td><td>data yang sering dicari dan harus terurut</td></tr>
        <tr><td><tt>HASHED</tt></td><td>tidak ada urutan, tanpa index</td><td>lewat key unik (waktu tetap)</td><td>tabel besar yang hanya dicari lewat key</td></tr>
      </table>
      <ul>
        <li>Untuk <tt>SORTED</tt> dan <tt>HASHED</tt> isi tabel dengan <tt>INSERT … INTO TABLE</tt>. Sistem sendiri yang menentukan posisinya.</li>
        <li>Dengan <tt>UNIQUE KEY</tt>, baris ber-key sama ditolak: <tt>sy-subrc = 4</tt>.</li>
        <li><tt>READ TABLE … WITH TABLE KEY</tt> memakai key tabel, jadi jauh lebih cepat daripada <tt>WITH KEY</tt> pada tabel standard yang besar.</li>
        <li><tt>APPEND</tt> ke tabel <tt>SORTED</tt> hanya boleh bila urutan tetap terjaga; ke tabel <tt>HASHED</tt> tidak boleh sama sekali.</li>
      </ul>`,
    code: `REPORT z_learn_table_kinds.

TYPES: BEGIN OF ty_city,
         code       TYPE c LENGTH 3,
         name       TYPE string,
         population TYPE i,
       END OF ty_city.

DATA: gt_standard TYPE STANDARD TABLE OF ty_city,
      gt_sorted   TYPE SORTED TABLE OF ty_city WITH UNIQUE KEY code,
      gt_hashed   TYPE HASHED TABLE OF ty_city WITH UNIQUE KEY code,
      gs_city     TYPE ty_city.

gs_city-code = 'SUB'. gs_city-name = 'Surabaya'. gs_city-population = 2900000.
APPEND gs_city TO gt_standard.
INSERT gs_city INTO TABLE gt_sorted.
INSERT gs_city INTO TABLE gt_hashed.

gs_city-code = 'BDG'. gs_city-name = 'Bandung'. gs_city-population = 2500000.
APPEND gs_city TO gt_standard.
INSERT gs_city INTO TABLE gt_sorted.
INSERT gs_city INTO TABLE gt_hashed.

gs_city-code = 'JKT'. gs_city-name = 'Jakarta'. gs_city-population = 10500000.
APPEND gs_city TO gt_standard.
INSERT gs_city INTO TABLE gt_sorted.
INSERT gs_city INTO TABLE gt_hashed.

WRITE / 'STANDARD (APPEND order):'.
LOOP AT gt_standard INTO gs_city.
  WRITE: /3 sy-tabix, gs_city-code, gs_city-name.
ENDLOOP.

WRITE / 'SORTED (always sorted by key):'.
LOOP AT gt_sorted INTO gs_city.
  WRITE: /3 sy-tabix, gs_city-code, gs_city-name.
ENDLOOP.

* A duplicate key is rejected
gs_city-code = 'JKT'. gs_city-name = 'Jakarta (duplicate)'.
INSERT gs_city INTO TABLE gt_sorted.
WRITE: / 'INSERT duplicate key into SORTED: sy-subrc =', sy-subrc.
INSERT gs_city INTO TABLE gt_hashed.
WRITE: / 'INSERT duplicate key into HASHED: sy-subrc =', sy-subrc.

* Lookup through the table key
READ TABLE gt_hashed INTO gs_city WITH TABLE KEY code = 'BDG'.
IF sy-subrc = 0.
  WRITE: / 'Found in HASHED:', gs_city-name, gs_city-population.
ENDIF.
WRITE: / 'Number of rows:', lines( gt_standard ), lines( gt_sorted ), lines( gt_hashed ).`,
    task: `<ul>
      <li>Tulis <tt>APPEND gs_city TO gt_hashed.</tt> dan baca pesan error-nya.</li>
      <li>Isi <tt>gs_city-code = 'AAA'</tt> lalu <tt>APPEND gs_city TO gt_sorted.</tt> — program berhenti dengan runtime error. Mengapa <tt>INSERT … INTO TABLE</tt> aman?</li>
      <li>Ubah key tabel sorted menjadi <tt>NON-UNIQUE KEY code</tt> dan ulangi penyisipan key kembar.</li>
    </ul>`
  },

  // ════════════════════════════════════════════════════════
  // LEVEL 3 — MENENGAH
  // ════════════════════════════════════════════════════════
  {
    id: 'm01', level: 3,
    title: 'SELECT lanjutan: JOIN dan FOR ALL ENTRIES',
    goal: 'Menggabungkan data dari dua tabel tanpa SELECT di dalam LOOP.',
    body: `
      <p>Data SAP tersebar di banyak tabel: harga tiket ada di SFLIGHT, nama maskapainya di SCARR. Ada dua cara standar menggabungkannya.</p>
      <h4>1. INNER JOIN — digabung oleh database</h4>
      <ul>
        <li>Beri tiap tabel alias (<tt>AS f</tt>) dan tulis kolom sebagai <tt>alias~kolom</tt>.</li>
        <li><tt>ON</tt> menyatakan kolom penghubungnya. Baris tanpa pasangan tidak ikut. <tt>LEFT OUTER JOIN</tt> tetap menyertakan baris kiri walau tanpa pasangan.</li>
      </ul>
      <h4>2. FOR ALL ENTRIES — digabung di program</h4>
      <ul>
        <li>Ambil tabel pertama dulu, lalu ambil tabel kedua <tt>FOR ALL ENTRIES IN gt_pertama WHERE kunci = gt_pertama-kunci</tt>.</li>
        <li><b>Jebakan klasik:</b> kalau tabel pertama kosong, <tt>WHERE</tt> diabaikan dan <b>seluruh</b> tabel kedua terambil. Selalu bungkus dengan <tt>IF gt_pertama IS NOT INITIAL.</tt></li>
        <li>Baris hasil yang kembar otomatis dibuang.</li>
      </ul>`,
    code: `REPORT z_learn_join.

TYPES: BEGIN OF ty_flight,
         carrid   TYPE sflight-carrid,
         carrname TYPE scarr-carrname,
         connid   TYPE sflight-connid,
         fldate   TYPE sflight-fldate,
         price    TYPE sflight-price,
         currency TYPE sflight-currency,
       END OF ty_flight.

TYPES: BEGIN OF ty_order,
         vbeln TYPE vbak-vbeln,
         kunnr TYPE vbak-kunnr,
         netwr TYPE vbak-netwr,
       END OF ty_order.

TYPES: BEGIN OF ty_cust,
         kunnr TYPE kna1-kunnr,
         name1 TYPE kna1-name1,
       END OF ty_cust.

DATA: gt_flight TYPE STANDARD TABLE OF ty_flight,
      gs_flight TYPE ty_flight,
      gt_order  TYPE STANDARD TABLE OF ty_order,
      gs_order  TYPE ty_order,
      gt_cust   TYPE STANDARD TABLE OF ty_cust,
      gs_cust   TYPE ty_cust.

* 1) INNER JOIN: flights + airline name
SELECT f~carrid c~carrname f~connid f~fldate f~price f~currency
  FROM sflight AS f
  INNER JOIN scarr AS c ON f~carrid = c~carrid
  INTO TABLE gt_flight
  WHERE f~currency = 'IDR'
  ORDER BY f~price DESCENDING.

WRITE: / 'INNER JOIN SFLIGHT + SCARR:', sy-dbcnt, 'rows'.
LOOP AT gt_flight INTO gs_flight.
  WRITE: / gs_flight-carrname, gs_flight-connid, gs_flight-fldate, gs_flight-price, gs_flight-currency.
ENDLOOP.

* 2) FOR ALL ENTRIES: sales orders + customer name
ULINE.
SELECT vbeln kunnr netwr FROM vbak INTO TABLE gt_order.

IF gt_order IS NOT INITIAL.          " required: guard against an empty driver table
  SELECT kunnr name1
    FROM kna1
    INTO TABLE gt_cust
    FOR ALL ENTRIES IN gt_order
    WHERE kunnr = gt_order-kunnr.
ENDIF.

WRITE: / 'FOR ALL ENTRIES:', sy-dbcnt, 'customers read'.
LOOP AT gt_order INTO gs_order.
  CLEAR gs_cust.
  READ TABLE gt_cust INTO gs_cust WITH KEY kunnr = gs_order-kunnr.
  WRITE: / gs_order-vbeln, gs_cust-name1, gs_order-netwr.
ENDLOOP.`,
    task: `<ul>
      <li>Gabungkan SPFLI dengan SCARR untuk menampilkan nama maskapai, kota asal, dan kota tujuan.</li>
      <li>Hapus <tt>IF gt_order IS NOT INITIAL</tt>, tambahkan <tt>WHERE vkorg = '9999'</tt> pada SELECT pertama, dan jalankan. Baca peringatannya.</li>
      <li>Gabungkan MARA dengan MAKT (<tt>spras = 'EN'</tt>) untuk menampilkan deskripsi material.</li>
    </ul>`
  },
  {
    id: 'm08', level: 3,
    title: 'SQL: agregat, GROUP BY, dan mengubah data',
    goal: 'Menghitung langsung di database dan memakai INSERT, UPDATE, MODIFY, DELETE.',
    body: `
      <h4>Biarkan database yang menghitung</h4>
      <ul>
        <li>Fungsi agregat: <tt>COUNT( * )</tt>, <tt>SUM( f )</tt>, <tt>MAX( f )</tt>, <tt>MIN( f )</tt>, <tt>AVG( f )</tt>.</li>
        <li><tt>GROUP BY</tt> membuat satu baris hasil per kelompok. Setiap kolom biasa di daftar SELECT <b>harus</b> ada di <tt>GROUP BY</tt>.</li>
        <li><tt>HAVING</tt> menyaring <b>kelompok</b> (setelah agregat dihitung); <tt>WHERE</tt> menyaring <b>baris</b> (sebelumnya).</li>
        <li><tt>AS nama</tt> memberi nama kolom hasil, sehingga cocok dengan komponen struktur target.</li>
      </ul>
      <h4>Mengubah isi tabel</h4>
      <table>
        <tr><th>Statement</th><th>Arti</th><th>sy-subrc = 4 bila</th></tr>
        <tr><td><tt>INSERT dbtab FROM wa.</tt></td><td>tambah baris baru</td><td>key sudah ada</td></tr>
        <tr><td><tt>UPDATE dbtab SET f = v WHERE …</tt></td><td>ubah baris yang cocok</td><td>tidak ada baris yang cocok</td></tr>
        <tr><td><tt>MODIFY dbtab FROM wa.</tt></td><td>ubah bila ada, tambah bila belum</td><td>—</td></tr>
        <tr><td><tt>DELETE FROM dbtab WHERE …</tt></td><td>hapus baris yang cocok</td><td>tidak ada baris yang cocok</td></tr>
      </table>
      <p><tt>COMMIT WORK</tt> menyimpan perubahan secara permanen, <tt>ROLLBACK WORK</tt> membatalkan semua perubahan sejak commit terakhir.
         <tt>UPDATE</tt> atau <tt>DELETE</tt> tanpa <tt>WHERE</tt> mengenai <b>seluruh</b> tabel. Di studio ini perubahan hanya berlaku selama program berjalan; data contoh selalu kembali utuh.</p>`,
    code: `REPORT z_learn_sql_aggregates.

TYPES: BEGIN OF ty_summary,
         carrid TYPE sflight-carrid,
         cnt    TYPE i,
         seats  TYPE i,
         max_price TYPE sflight-price,
       END OF ty_summary.

DATA: gt_summary TYPE STANDARD TABLE OF ty_summary,
      gs_summary TYPE ty_summary,
      gs_scarr   TYPE scarr,
      gv_count   TYPE i,
      gv_max     TYPE sflight-price.

* 1) One value from the whole table
SELECT COUNT( * ) FROM sflight INTO gv_count.
SELECT MAX( price ) FROM sflight INTO gv_max WHERE currency = 'IDR'.
WRITE: / 'Number of flights:', gv_count, '| most expensive IDR ticket:', gv_max.

* 2) Summary per airline
SELECT carrid COUNT( * ) AS cnt SUM( seatsocc ) AS seats MAX( price ) AS max_price
  FROM sflight
  INTO TABLE gt_summary
  GROUP BY carrid
  HAVING SUM( seatsocc ) > 250
  ORDER BY seats DESCENDING.

ULINE.
LOOP AT gt_summary INTO gs_summary.
  WRITE: / gs_summary-carrid, 6 gs_summary-cnt, 12 gs_summary-seats, 22 gs_summary-max_price.
ENDLOOP.

* 3) Changing data
ULINE.
gs_scarr-carrid   = 'ZZ'.
gs_scarr-carrname = 'Zebra Air'.
gs_scarr-currcode = 'IDR'.
INSERT scarr FROM gs_scarr.
WRITE: / 'First INSERT   : sy-subrc =', sy-subrc.
INSERT scarr FROM gs_scarr.
WRITE: / 'Second INSERT  : sy-subrc =', sy-subrc, '(key already exists)'.

UPDATE scarr SET carrname = 'Zebra Airways' WHERE carrid = 'ZZ'.
WRITE: / 'UPDATE         :', sy-dbcnt, 'rows changed'.
COMMIT WORK.

DELETE FROM scarr WHERE currcode = 'USD'.
WRITE: / 'DELETE         :', sy-dbcnt, 'rows deleted'.
ROLLBACK WORK.                          " the deletion is undone

SELECT COUNT( * ) FROM scarr INTO gv_count.
SELECT SINGLE * FROM scarr INTO gs_scarr WHERE carrid = 'ZZ'.
WRITE: / 'After ROLLBACK:', gv_count, 'airlines, including', gs_scarr-carrname.`,
    task: `<ul>
      <li>Hitung rata-rata harga tiket per mata uang (<tt>AVG( price )</tt>, <tt>GROUP BY currency</tt>).</li>
      <li>Tambahkan kolom <tt>connid</tt> ke daftar SELECT tanpa menaruhnya di <tt>GROUP BY</tt>. Baca pesan error-nya.</li>
      <li>Pindahkan <tt>COMMIT WORK</tt> ke setelah <tt>DELETE</tt>. Berapa maskapai yang tersisa setelah <tt>ROLLBACK</tt>?</li>
    </ul>`
  },
  {
    id: 'm02', level: 3,
    title: 'Pesan dan penanganan error klasik',
    goal: 'Memakai sy-subrc, MESSAGE, dan RETURN untuk menangani kegagalan dengan rapi.',
    body: `
      <p>Hampir setiap statement yang bisa gagal mengisi <tt>sy-subrc</tt>: 0 berarti berhasil, selain itu gagal.
         Program yang baik <b>selalu</b> memeriksanya segera setelah <tt>SELECT</tt>, <tt>READ TABLE</tt>, dan <tt>CALL FUNCTION</tt>.</p>
      <table>
        <tr><th>MESSAGE … TYPE</th><th>Arti</th><th>Efek di SAP</th></tr>
        <tr><td><tt>'S'</tt></td><td>Success</td><td>pesan di status bar, program lanjut</td></tr>
        <tr><td><tt>'I'</tt></td><td>Information</td><td>popup, program lanjut setelah Enter</td></tr>
        <tr><td><tt>'W'</tt></td><td>Warning</td><td>peringatan, pengguna bisa melanjutkan</td></tr>
        <tr><td><tt>'E'</tt></td><td>Error</td><td>proses saat ini dihentikan</td></tr>
        <tr><td><tt>'A'</tt> / <tt>'X'</tt></td><td>Abort / dump</td><td>program diakhiri</td></tr>
      </table>
      <p><tt>RETURN</tt> keluar dari FORM saat itu juga — pola "periksa, laporkan, keluar" membuat kode tidak bersarang terlalu dalam.
         Di studio ini semua pesan dicetak ke Output; seperti di SAP, pesan tipe <tt>E</tt>, <tt>A</tt>, dan <tt>X</tt> <b>menghentikan program</b>.
         <tt>TYPE 'S' DISPLAY LIKE 'E'</tt> menampilkan pesan berwarna error tanpa menghentikan program.</p>`,
    code: `REPORT z_learn_messages.

PARAMETERS p_matnr TYPE mara-matnr DEFAULT '1000-100'.

DATA: gs_mara TYPE mara,
      gs_makt TYPE makt.

START-OF-SELECTION.
  PERFORM read_material USING p_matnr.
  ULINE.
  PERFORM read_material USING '9999-999'.

*&---------------------------------------------------------------------*
FORM read_material USING pv_matnr TYPE mara-matnr.

  SELECT SINGLE * FROM mara INTO gs_mara WHERE matnr = pv_matnr.
  IF sy-subrc <> 0.
    MESSAGE |Material { pv_matnr } not found| TYPE 'W'.
    RETURN.                           " leave the FORM, the rest is skipped
  ENDIF.

  SELECT SINGLE * FROM makt INTO gs_makt
    WHERE matnr = pv_matnr
      AND spras = 'EN'.
  IF sy-subrc <> 0.
    CLEAR gs_makt.
    gs_makt-maktx = '(no description)'.
  ENDIF.

  WRITE: / 'Material :', gs_mara-matnr.
  WRITE: / 'Text     :', gs_makt-maktx.
  WRITE: / 'Type     :', gs_mara-mtart, '| Unit:', gs_mara-meins.
  MESSAGE 'Material data read successfully' TYPE 'S'.

ENDFORM.`,
    task: `<ul>
      <li>Tambahkan pemeriksaan: bila <tt>pv_matnr</tt> kosong (<tt>IS INITIAL</tt>), keluarkan pesan tipe <tt>'E'</tt> lalu <tt>RETURN</tt>.</li>
      <li>Hapus <tt>RETURN</tt> dan jalankan. Data material mana yang tercetak untuk nomor 9999-999, dan mengapa itu berbahaya?</li>
    </ul>`
  },
  {
    id: 'm03', level: 3,
    title: 'Function module: CALL FUNCTION',
    goal: 'Memanggil function module dan memahami EXPORTING, IMPORTING, TABLES, EXCEPTIONS.',
    body: `
      <p><b>Function module</b> (FM) adalah prosedur siap pakai yang disimpan terpusat di SAP (transaksi SE37). Ribuan FM standar tersedia;
         kode yang baik memakainya alih-alih menulis ulang logika yang sama.</p>
      <table>
        <tr><th>Bagian</th><th>Arah</th><th>Isi</th></tr>
        <tr><td><tt>EXPORTING</tt></td><td>program → FM</td><td>nilai masukan</td></tr>
        <tr><td><tt>IMPORTING</tt></td><td>FM → program</td><td>hasil</td></tr>
        <tr><td><tt>CHANGING</tt></td><td>dua arah</td><td>data yang diubah FM</td></tr>
        <tr><td><tt>TABLES</tt></td><td>dua arah</td><td>internal table</td></tr>
        <tr><td><tt>EXCEPTIONS</tt></td><td>FM → program</td><td>nama error → angka <tt>sy-subrc</tt></td></tr>
      </table>
      <ul>
        <li>Nama FM ditulis dalam tanda kutip dan <b>huruf besar</b>. Nama parameter harus persis sama dengan definisi FM.</li>
        <li>Kalau FM menaikkan exception yang <b>tidak</b> dipetakan di <tt>EXCEPTIONS</tt>, program berhenti dengan short dump. <tt>OTHERS</tt> menangkap semua yang tidak disebut.</li>
        <li>Jangan menulis titik di antara bagian-bagian: seluruh <tt>CALL FUNCTION</tt> adalah <b>satu</b> statement.</li>
      </ul>
      <p>Daftar FM yang disimulasikan studio ini ada di <b>Docs → Function Module</b>.</p>`,
    code: `REPORT z_learn_fm.

DATA: lv_kunnr     TYPE kunnr VALUE '1000',
      lv_alpha     TYPE kunnr,
      lv_external  TYPE kunnr,
      lv_month_end TYPE d,
      lv_day       TYPE c LENGTH 1,
      lv_tomorrow  TYPE d.

* 1) Conversion exit ALPHA: add leading zeros to a number
CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
  EXPORTING
    input  = lv_kunnr
  IMPORTING
    output = lv_alpha.
WRITE: / 'ALPHA input  :', lv_kunnr, '->', lv_alpha.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
  EXPORTING
    input  = lv_alpha
  IMPORTING
    output = lv_external.
WRITE: / 'ALPHA output :', lv_alpha, '->', lv_external.

* 2) Date functions with EXCEPTIONS
CALL FUNCTION 'RP_LAST_DAY_OF_MONTHS'
  EXPORTING
    day_in            = '20240210'
  IMPORTING
    last_day_of_month = lv_month_end
  EXCEPTIONS
    day_in_no_date    = 1
    OTHERS            = 2.
IF sy-subrc = 0.
  WRITE: / 'End of Feb 2024:', lv_month_end.
ENDIF.

* Invalid date -> the exception is mapped to sy-subrc = 1
CALL FUNCTION 'RP_LAST_DAY_OF_MONTHS'
  EXPORTING
    day_in            = '20241399'
  IMPORTING
    last_day_of_month = lv_month_end
  EXCEPTIONS
    day_in_no_date    = 1
    OTHERS            = 2.
CASE sy-subrc.
  WHEN 0.
    WRITE: / 'End of month :', lv_month_end.
  WHEN 1.
    WRITE / 'Date 20241399 is not valid (exception DAY_IN_NO_DATE, sy-subrc = 1).'.
  WHEN OTHERS.
    WRITE / 'Another error.'.
ENDCASE.

* 3) Day of the week and date calculation
CALL FUNCTION 'DATE_COMPUTE_DAY'
  EXPORTING
    date = '20250817'
  IMPORTING
    day  = lv_day.
WRITE: / '17-08-2025 is day number', lv_day, '(1 = Monday ... 7 = Sunday)'.

CALL FUNCTION 'RP_CALC_DATE_IN_INTERVAL'
  EXPORTING
    date      = '20250131'
    days      = 1
    months    = 0
    years     = 0
    signum    = '+'
  IMPORTING
    calc_date = lv_tomorrow.
WRITE: / 'One day after 31-01-2025:', lv_tomorrow.`,
    task: `<ul>
      <li>Hapus bagian <tt>EXCEPTIONS</tt> pada pemanggilan dengan tanggal tidak valid, lalu jalankan. Apa bedanya?</li>
      <li>Panggil FM yang tidak ada (<tt>CALL FUNCTION 'Z_COBA'.</tt>) dan baca peringatannya.</li>
      <li>Hitung tanggal 3 bulan sebelum hari ini dengan <tt>RP_CALC_DATE_IN_INTERVAL</tt> (<tt>date = sy-datum</tt>, <tt>signum = '-'</tt>).</li>
    </ul>`
  },
  {
    id: 'm09', level: 3,
    title: 'Membuat function module sendiri',
    goal: 'Menulis FUNCTION dengan parameter dan exception, lalu memanggilnya.',
    body: `
      <p>Function module dibuat di <b>Function Builder (SE37)</b> dan hidup di dalam sebuah <i>function group</i>. Parameternya didefinisikan lewat tab di layar SE37,
         dan SAP menampilkannya di dalam kode sebagai blok komentar <tt>*"</tt>. Di studio ini FM ditulis di program yang sama, dan <b>blok komentar itulah yang dibaca sebagai interface</b>:</p>
      <ul>
        <li><tt>IMPORTING</tt> — masukan. <tt>OPTIONAL</tt> / <tt>DEFAULT</tt> membuatnya boleh tidak diisi.</li>
        <li><tt>EXPORTING</tt> — hasil. <tt>CHANGING</tt> — masuk dan keluar. <tt>TABLES</tt> — internal table.</li>
        <li><tt>EXCEPTIONS</tt> — nama error yang bisa dinaikkan dengan <tt>RAISE nama.</tt> Begitu <tt>RAISE</tt> dijalankan, FM langsung berakhir.</li>
      </ul>
      <p>Perhatikan arahnya terbalik: parameter <tt>IMPORTING</tt> milik FM diisi lewat <tt>EXPORTING</tt> di sisi pemanggil, dan sebaliknya.
         Variabel yang dideklarasikan di dalam FM bersifat lokal.</p>`,
    code: `REPORT z_learn_own_fm.

DATA: gv_result TYPE p DECIMALS 2,
      gt_log    TYPE STANDARD TABLE OF string,
      gv_line   TYPE string.

START-OF-SELECTION.
  CALL FUNCTION 'Z_CALCULATE_DISCOUNT'
    EXPORTING
      iv_price       = 250000
      iv_percent     = 15
    IMPORTING
      ev_amount_due       = gv_result
    TABLES
      t_log          = gt_log
    EXCEPTIONS
      invalid_percent = 1
      OTHERS          = 2.
  WRITE: / 'sy-subrc =', sy-subrc, '| amount due:', gv_result.

* Parameter iv_persen is not passed -> the DEFAULT value is used
  CALL FUNCTION 'Z_CALCULATE_DISCOUNT'
    EXPORTING
      iv_price       = 100000
    IMPORTING
      ev_amount_due       = gv_result
    TABLES
      t_log          = gt_log
    EXCEPTIONS
      invalid_percent = 1
      OTHERS          = 2.
  WRITE: / 'sy-subrc =', sy-subrc, '| amount due:', gv_result.

* Percentage out of range -> the FM raises an exception
  CALL FUNCTION 'Z_CALCULATE_DISCOUNT'
    EXPORTING
      iv_price       = 100000
      iv_percent     = 150
    IMPORTING
      ev_amount_due       = gv_result
    EXCEPTIONS
      invalid_percent = 1
      OTHERS          = 2.
  IF sy-subrc = 1.
    WRITE / 'sy-subrc = 1: the discount percentage is not valid, calculation cancelled.'.
  ENDIF.

  ULINE.
  LOOP AT gt_log INTO gv_line.
    WRITE: / 'Log:', gv_line.
  ENDLOOP.

FUNCTION z_calculate_discount.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IV_PRICE) TYPE  I
*"     VALUE(IV_PERCENT) TYPE  I DEFAULT 10
*"  EXPORTING
*"     VALUE(EV_AMOUNT_DUE) TYPE  P
*"  TABLES
*"      T_LOG OPTIONAL
*"  EXCEPTIONS
*"      INVALID_PERCENT
*"----------------------------------------------------------------------
  DATA lv_discount TYPE i.

  IF iv_percent < 0 OR iv_percent > 100.
    RAISE invalid_percent.
  ENDIF.

  lv_discount   = iv_price * iv_percent / 100.
  ev_amount_due = iv_price - lv_discount.
  APPEND |Price { iv_price }, discount { iv_percent }% = { lv_discount }| TO t_log.
ENDFUNCTION.`,
    task: `<ul>
      <li>Hapus <tt>EXCEPTIONS</tt> pada pemanggilan ketiga dan jalankan. Apa yang terjadi bila exception tidak ditangani?</li>
      <li>Panggil dengan nama parameter yang salah (<tt>iv_prc = 1000</tt>) dan baca pesan error-nya.</li>
      <li>Tambahkan parameter <tt>EXPORTING ev_discount</tt> yang mengembalikan nilai diskonnya.</li>
    </ul>`
  },
  {
    id: 'm04', level: 3,
    title: 'ALV klasik: field catalog',
    goal: 'Menampilkan internal table sebagai ALV Grid dengan REUSE_ALV_GRID_DISPLAY.',
    body: `
      <p><b>ALV</b> (ABAP List Viewer) menampilkan internal table sebagai grid yang bisa di-sort, di-filter, dan dijumlahkan.
         Cara klasiknya memakai function module <tt>REUSE_ALV_GRID_DISPLAY</tt> dengan tiga bahan:</p>
      <ul>
        <li><b>Tabel data</b> — dioper lewat <tt>TABLES t_outtab</tt>.</li>
        <li><b>Field catalog</b> (<tt>it_fieldcat</tt>, tipe <tt>slis_t_fieldcat_alv</tt>) — satu baris per kolom yang ingin ditampilkan.</li>
        <li><tt>i_callback_program = sy-repid</tt> — nama program pemanggil.</li>
      </ul>
      <p>Komponen field catalog yang paling sering dipakai:</p>
      <table>
        <tr><th>Komponen</th><th>Fungsi</th></tr>
        <tr><td><tt>fieldname</tt></td><td>nama komponen di tabel data — <b>huruf besar</b> dan harus persis sama</td></tr>
        <tr><td><tt>seltext_s / _m / _l</tt></td><td>judul kolom (pendek / sedang / panjang)</td></tr>
        <tr><td><tt>outputlen</tt></td><td>lebar kolom</td></tr>
        <tr><td><tt>key</tt></td><td><tt>'X'</tt> = kolom kunci (disorot)</td></tr>
        <tr><td><tt>do_sum</tt></td><td><tt>'X'</tt> = kolom dijumlahkan</td></tr>
        <tr><td><tt>no_out</tt></td><td><tt>'X'</tt> = kolom disembunyikan</td></tr>
      </table>
      <p>Pola per kolom selalu sama: <tt>CLEAR</tt> work area, isi, <tt>APPEND gs_fieldcat TO gt_fieldcat</tt>. Grid-nya muncul di panel Output.</p>`,
    code: `REPORT z_learn_alv.

TYPES: BEGIN OF ty_mara,
         matnr TYPE mara-matnr,
         ersda TYPE mara-ersda,
         ernam TYPE mara-ernam,
         mtart TYPE mara-mtart,
         mbrsh TYPE mara-mbrsh,
         brgew TYPE mara-brgew,
       END OF ty_mara.

DATA: gt_data     TYPE STANDARD TABLE OF ty_mara,
      gt_fieldcat TYPE slis_t_fieldcat_alv,
      gs_fieldcat TYPE slis_fieldcat_alv.

PARAMETERS p_max TYPE i DEFAULT 50.

START-OF-SELECTION.
  SELECT matnr ersda ernam mtart mbrsh brgew
    FROM mara
    UP TO p_max ROWS
    INTO TABLE gt_data.

  PERFORM build_fieldcatalog.
  PERFORM display_alv.

*&---------------------------------------------------------------------*
FORM build_fieldcatalog.

  CLEAR gs_fieldcat.
  gs_fieldcat-fieldname = 'MATNR'.
  gs_fieldcat-seltext_m = 'Material Number'.
  gs_fieldcat-outputlen = 18.
  gs_fieldcat-key       = 'X'.
  APPEND gs_fieldcat TO gt_fieldcat.

  CLEAR gs_fieldcat.
  gs_fieldcat-fieldname = 'ERSDA'.
  gs_fieldcat-seltext_m = 'Created On'.
  APPEND gs_fieldcat TO gt_fieldcat.

  CLEAR gs_fieldcat.
  gs_fieldcat-fieldname = 'ERNAM'.
  gs_fieldcat-seltext_m = 'Created By'.
  APPEND gs_fieldcat TO gt_fieldcat.

  CLEAR gs_fieldcat.
  gs_fieldcat-fieldname = 'MTART'.
  gs_fieldcat-seltext_m = 'Material Type'.
  APPEND gs_fieldcat TO gt_fieldcat.

  CLEAR gs_fieldcat.
  gs_fieldcat-fieldname = 'MBRSH'.
  gs_fieldcat-seltext_m = 'Industry Sector'.
  APPEND gs_fieldcat TO gt_fieldcat.

  CLEAR gs_fieldcat.
  gs_fieldcat-fieldname = 'BRGEW'.
  gs_fieldcat-seltext_m = 'Gross Weight'.
  gs_fieldcat-do_sum    = 'X'.
  APPEND gs_fieldcat TO gt_fieldcat.

ENDFORM.

*&---------------------------------------------------------------------*
FORM display_alv.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program = sy-repid
      i_grid_title       = 'Material List'
      it_fieldcat        = gt_fieldcat
    TABLES
      t_outtab           = gt_data
    EXCEPTIONS
      program_error      = 1
      OTHERS             = 2.

  IF sy-subrc <> 0.
    MESSAGE 'The ALV could not be displayed' TYPE 'E'.
  ENDIF.

ENDFORM.`,
    task: `<ul>
      <li>Ganti <tt>'MTART'</tt> menjadi <tt>'MTARTT'</tt> di field catalog dan jalankan. Baca peringatannya.</li>
      <li>Sembunyikan kolom <tt>ERNAM</tt> dengan <tt>no_out = 'X'</tt>.</li>
      <li>Kosongkan field catalog (hapus <tt>PERFORM build_fieldcatalog.</tt>) dan lihat apa kata simulator.</li>
      <li>Ringkas enam blok itu menjadi satu FORM <tt>add_field USING pv_field pv_text</tt> yang dipanggil enam kali.</li>
    </ul>`
  },
  {
    id: 'm05', level: 3,
    title: 'ALV: catalog otomatis, layout, sort, total',
    goal: 'Membangun field catalog dari struktur DDIC dan mengatur tampilan grid.',
    body: `
      <p>Menulis field catalog untuk 15 kolom itu melelahkan. Bila tabel data memakai struktur kamus data (DDIC),
         <tt>REUSE_ALV_FIELDCATALOG_MERGE</tt> membuatkannya otomatis — lengkap dengan judul kolom. Setelah itu tinggal menyesuaikan beberapa baris.</p>
      <ul>
        <li><b>Layout</b> (<tt>is_layout</tt>, tipe <tt>slis_layout_alv</tt>): <tt>zebra = 'X'</tt> untuk baris belang, <tt>colwidth_optimize = 'X'</tt> untuk lebar kolom otomatis.</li>
        <li><b>Sort</b> (<tt>it_sort</tt>, tipe <tt>slis_t_sortinfo_alv</tt>): <tt>fieldname</tt> + <tt>up = 'X'</tt> (naik) atau <tt>down = 'X'</tt> (turun).</li>
        <li><b>Total</b>: <tt>do_sum = 'X'</tt> pada baris field catalog kolom angka.</li>
        <li><tt>MODIFY gt_fieldcat FROM gs_fieldcat.</tt> di dalam <tt>LOOP</tt> menulis balik baris yang sedang diproses.</li>
      </ul>
      <p>Alternatif tercepat bila tidak perlu penyesuaian: isi <tt>i_structure_name = 'SFLIGHT'</tt> saja, tanpa field catalog.</p>`,
    code: `REPORT z_learn_alv_merge.

DATA: gt_flight   TYPE STANDARD TABLE OF sflight,
      gt_fieldcat TYPE slis_t_fieldcat_alv,
      gs_fieldcat TYPE slis_fieldcat_alv,
      gs_layout   TYPE slis_layout_alv,
      gt_sort     TYPE slis_t_sortinfo_alv,
      gs_sort     TYPE slis_sortinfo_alv.

START-OF-SELECTION.
  SELECT * FROM sflight INTO TABLE gt_flight.

* 1) Automatic field catalog from a DDIC structure
  CALL FUNCTION 'REUSE_ALV_FIELDCATALOG_MERGE'
    EXPORTING
      i_program_name         = sy-repid
      i_structure_name       = 'SFLIGHT'
    CHANGING
      ct_fieldcat            = gt_fieldcat
    EXCEPTIONS
      inconsistent_interface = 1
      program_error          = 2
      OTHERS                 = 3.
  IF sy-subrc <> 0.
    MESSAGE 'The field catalog could not be built' TYPE 'E'.
  ENDIF.

* 2) Adjust a few columns
  LOOP AT gt_fieldcat INTO gs_fieldcat.
    CASE gs_fieldcat-fieldname.
      WHEN 'PRICE'.
        gs_fieldcat-seltext_m = 'Ticket Price'.
      WHEN 'SEATSOCC' OR 'PAYMENTSUM'.
        gs_fieldcat-do_sum = 'X'.
      WHEN 'SEATSMAX_B' OR 'SEATSOCC_B' OR 'SEATSMAX_F' OR 'SEATSOCC_F'.
        gs_fieldcat-no_out = 'X'.
    ENDCASE.
    MODIFY gt_fieldcat FROM gs_fieldcat.
  ENDLOOP.

* 3) Layout and initial sort order
  gs_layout-zebra             = 'X'.
  gs_layout-colwidth_optimize = 'X'.

  gs_sort-fieldname = 'PRICE'.
  gs_sort-down      = 'X'.
  APPEND gs_sort TO gt_sort.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program = sy-repid
      i_grid_title       = 'Flight Schedule (most expensive first)'
      is_layout          = gs_layout
      it_fieldcat        = gt_fieldcat
      it_sort            = gt_sort
    TABLES
      t_outtab           = gt_flight
    EXCEPTIONS
      program_error      = 1
      OTHERS             = 2.`,
    task: `<ul>
      <li>Ganti seluruh field catalog dengan <tt>i_structure_name = 'SFLIGHT'</tt> dan bandingkan hasilnya.</li>
      <li>Ubah urutan awal menjadi berdasarkan <tt>CARRID</tt> naik.</li>
      <li>Buat laporan yang sama untuk tabel <tt>SPFLI</tt>, jumlahkan kolom <tt>DISTANCE</tt>.</li>
    </ul>`
  },
  {
    id: 'm06', level: 3,
    title: 'ALV modern: CL_SALV_TABLE',
    goal: 'Menampilkan ALV dengan class CL_SALV_TABLE — tanpa field catalog.',
    body: `
      <p><tt>CL_SALV_TABLE</tt> adalah cara berorientasi objek untuk ALV dan pilihan utama untuk laporan baru yang hanya menampilkan data.
         Kolom-kolomnya dibaca langsung dari tipe internal table.</p>
      <ul>
        <li><tt>cl_salv_table=&gt;factory( … )</tt> — method statis yang membuat objek ALV. <tt>=&gt;</tt> memanggil method <b>class</b>.</li>
        <li><tt>go_alv-&gt;display( )</tt> — menampilkan grid. <tt>-&gt;</tt> memanggil method <b>objek</b>.</li>
        <li>Pengaturan diambil lewat objek pembantu: <tt>get_functions( )</tt> (toolbar), <tt>get_columns( )</tt> (kolom), <tt>get_display_settings( )</tt> (judul, baris belang).</li>
        <li><tt>factory</tt> bisa menaikkan exception <tt>cx_salv_msg</tt>, karena itu dibungkus <tt>TRY … CATCH … ENDTRY</tt>.</li>
      </ul>
      <p>Batasannya: SALV tidak bisa di-edit. Untuk grid yang bisa diisi pengguna dipakai <tt>CL_GUI_ALV_GRID</tt>.</p>`,
    code: `REPORT z_learn_salv.

DATA: gt_spfli TYPE STANDARD TABLE OF spfli,
      go_alv   TYPE REF TO cl_salv_table,
      gx_msg   TYPE REF TO cx_salv_msg.

START-OF-SELECTION.
  SELECT * FROM spfli INTO TABLE gt_spfli.

  TRY.
      cl_salv_table=>factory(
        IMPORTING
          r_salv_table = go_alv
        CHANGING
          t_table      = gt_spfli ).

      go_alv->get_functions( )->set_all( abap_true ).           " all toolbar buttons
      go_alv->get_columns( )->set_optimize( abap_true ).        " automatic column width
      go_alv->get_display_settings( )->set_striped_pattern( abap_true ).
      go_alv->get_display_settings( )->set_list_header( 'Flight Connections (SPFLI)' ).

      go_alv->display( ).

    CATCH cx_salv_msg INTO gx_msg.
      MESSAGE gx_msg->get_text( ) TYPE 'E'.
  ENDTRY.`,
    task: `<ul>
      <li>Tampilkan tabel <tt>KNA1</tt> dengan SALV dan beri judul sendiri.</li>
      <li>Batasi data hanya rute dari Indonesia (<tt>WHERE countryfr = 'ID'</tt>).</li>
    </ul>`
  },
  {
    id: 'm10', level: 3,
    title: 'ALV interaktif: hotspot, klik dua kali, header',
    goal: 'Menanggapi klik pengguna di ALV dan menambahkan header di atas grid.',
    body: `
      <p>ALV klasik berinteraksi lewat <b>callback</b>: nama FORM diserahkan ke function module, dan ALV memanggilnya pada saat yang tepat.</p>
      <table>
        <tr><th>Parameter</th><th>FORM dipanggil ketika</th></tr>
        <tr><td><tt>i_callback_user_command</tt></td><td>pengguna klik dua kali sebuah baris, mengklik hotspot, atau menekan tombol</td></tr>
        <tr><td><tt>i_callback_top_of_page</tt></td><td>ALV menyusun bagian header di atas grid</td></tr>
      </table>
      <ul>
        <li>FORM user command <b>wajib</b> punya dua parameter: <tt>r_ucomm</tt> (kode fungsi; <tt>'&amp;IC1'</tt> = klik dua kali / hotspot) dan <tt>rs_selfield</tt>.</li>
        <li><tt>rs_selfield-tabindex</tt> = nomor baris, <tt>-fieldname</tt> = kolom, <tt>-value</tt> = isi sel yang diklik.</li>
        <li><tt>hotspot = 'X'</tt> di field catalog membuat sel kolom itu bisa diklik sekali (tampil bergaris bawah).</li>
        <li>Header diisi lewat tabel bertipe <tt>slis_t_listheader</tt> dan <tt>REUSE_ALV_COMMENTARY_WRITE</tt>: <tt>typ = 'H'</tt> judul, <tt>'S'</tt> baris kunci–nilai, <tt>'A'</tt> catatan.</li>
      </ul>
      <p>Jalankan contoh ini, lalu <b>klik sel bergaris bawah</b> atau <b>klik dua kali sebuah baris</b> di grid. Output FORM muncul di bawah grid.</p>`,
    code: `REPORT z_learn_alv_interactive.

DATA: gt_scarr  TYPE STANDARD TABLE OF scarr,
      gs_scarr  TYPE scarr,
      gt_fcat   TYPE slis_t_fieldcat_alv,
      gs_fcat   TYPE slis_fieldcat_alv,
      gt_header TYPE slis_t_listheader,
      gs_header TYPE slis_listheader,
      gv_count  TYPE i.

START-OF-SELECTION.
  SELECT * FROM scarr INTO TABLE gt_scarr.

  gs_fcat-fieldname = 'CARRID'.
  gs_fcat-seltext_m = 'Airline'.
  gs_fcat-key       = 'X'.
  gs_fcat-hotspot   = 'X'.               " the cells of this column can be clicked
  APPEND gs_fcat TO gt_fcat.

  CLEAR gs_fcat.
  gs_fcat-fieldname = 'CARRNAME'.
  gs_fcat-seltext_m = 'Airline Name'.
  APPEND gs_fcat TO gt_fcat.

  CLEAR gs_fcat.
  gs_fcat-fieldname = 'CURRCODE'.
  gs_fcat-seltext_m = 'Currency'.
  APPEND gs_fcat TO gt_fcat.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program      = sy-repid
      i_callback_user_command = 'USER_COMMAND'
      i_callback_top_of_page  = 'TOP_OF_PAGE'
      it_fieldcat             = gt_fcat
    TABLES
      t_outtab                = gt_scarr
    EXCEPTIONS
      program_error           = 1
      OTHERS                  = 2.

*&---------------------------------------------------------------------*
*& Header above the grid
*&---------------------------------------------------------------------*
FORM top_of_page.
  CLEAR gt_header.

  CLEAR gs_header.
  gs_header-typ  = 'H'.
  gs_header-info = 'Airline List'.
  APPEND gs_header TO gt_header.

  CLEAR gs_header.
  gs_header-typ  = 'S'.
  gs_header-key  = 'Count'.
  gs_header-info = lines( gt_scarr ).
  APPEND gs_header TO gt_header.

  CLEAR gs_header.
  gs_header-typ  = 'A'.
  gs_header-info = 'Click an airline code to see its flights.'.
  APPEND gs_header TO gt_header.

  CALL FUNCTION 'REUSE_ALV_COMMENTARY_WRITE'
    EXPORTING
      it_list_commentary = gt_header.
ENDFORM.

*&---------------------------------------------------------------------*
*& Called by ALV every time the user clicks
*&---------------------------------------------------------------------*
FORM user_command USING r_ucomm     LIKE sy-ucomm
                        rs_selfield TYPE slis_selfield.
  CASE r_ucomm.
    WHEN '&IC1'.                         " double-click / hotspot
      READ TABLE gt_scarr INTO gs_scarr INDEX rs_selfield-tabindex.
      IF sy-subrc <> 0.
        RETURN.
      ENDIF.
      SELECT COUNT( * ) FROM sflight INTO gv_count WHERE carrid = gs_scarr-carrid.
      WRITE: / 'Row', rs_selfield-tabindex, 'column', rs_selfield-fieldname, ':',
               gs_scarr-carrname, 'has', gv_count, 'flights.'.
  ENDCASE.
ENDFORM.`,
    task: `<ul>
      <li>Ganti <tt>WRITE</tt> di <tt>user_command</tt> dengan ALV kedua yang menampilkan penerbangan maskapai itu (<tt>i_structure_name = 'SFLIGHT'</tt>).</li>
      <li>Salah ketik nama FORM di <tt>i_callback_user_command</tt> dan baca pesan error-nya.</li>
      <li>Tampilkan pesan berbeda bila yang diklik kolom <tt>CURRCODE</tt> (periksa <tt>rs_selfield-fieldname</tt>).</li>
    </ul>`
  },
  {
    id: 'm11', level: 3,
    title: 'Membaca kode lama: header line, OCCURS, macro',
    goal: 'Mengenali gaya ABAP lama yang masih memenuhi sistem produksi.',
    body: `
      <p>Sebagian besar pekerjaan ABAP adalah merawat program lama. Tiga hal ini tidak boleh dipakai di kode baru, tetapi <b>wajib bisa dibaca</b>:</p>
      <h4>Tabel dengan header line</h4>
      <ul>
        <li><tt>DATA: BEGIN OF itab OCCURS 0 … END OF itab.</tt> atau <tt>… WITH HEADER LINE</tt> membuat <b>dua</b> hal bernama sama: tabelnya, dan sebuah work area tersembunyi (header line).</li>
        <li><tt>itab-field</tt> dan <tt>CLEAR itab</tt> mengenai <b>header line</b>; <tt>itab[]</tt> berarti <b>isi tabelnya</b>.</li>
        <li><tt>APPEND itab.</tt>, <tt>LOOP AT itab.</tt>, <tt>READ TABLE itab …</tt>, <tt>MODIFY itab.</tt> tanpa <tt>INTO</tt>/<tt>FROM</tt> diam-diam memakai header line.</li>
        <li><tt>TABLES mara.</tt> membuat work area bernama <tt>mara</tt>; <tt>SELECT * FROM mara … ENDSELECT.</tt> mengisinya baris demi baris.</li>
      </ul>
      <h4>Macro</h4>
      <ul>
        <li><tt>DEFINE nama. … END-OF-DEFINITION.</tt> adalah penggantian teks: <tt>&amp;1</tt>, <tt>&amp;2</tt> diganti argumen saat macro dipakai. Tidak bisa di-debug baris demi baris.</li>
      </ul>
      <p>Padanan modernnya: work area eksplisit (<tt>INTO</tt>/<tt>ASSIGNING</tt>), <tt>SELECT … INTO TABLE</tt>, dan FORM atau method sebagai ganti macro.</p>`,
    code: `REPORT z_learn_legacy_code.

TABLES: scarr.

* A table with a header line
DATA: BEGIN OF it_airlines OCCURS 0,
        carrid   LIKE scarr-carrid,
        carrname LIKE scarr-carrname,
        cnt      TYPE i,
      END OF it_airlines.

DATA v_row TYPE i.

* Macro: &1 and &2 are replaced by its arguments
DEFINE write_row.
  WRITE: / &1, 6 &2.
END-OF-DEFINITION.

START-OF-SELECTION.
* SELECT ... ENDSELECT fills the work area SCARR row by row
  SELECT * FROM scarr WHERE currcode <> 'USD'.
    CLEAR it_airlines.                         " header line
    MOVE-CORRESPONDING scarr TO it_airlines.   " into the header line
    APPEND it_airlines.                        " header line -> table
  ENDSELECT.

  DESCRIBE TABLE it_airlines LINES v_row.
  WRITE: / 'Number of rows:', v_row.

  LOOP AT it_airlines.                         " each row -> header line
    SELECT COUNT( * ) FROM sflight INTO it_airlines-cnt
      WHERE carrid = it_airlines-carrid.
    MODIFY it_airlines.                        " header line -> current row
  ENDLOOP.

  SORT it_airlines BY cnt DESCENDING.
  LOOP AT it_airlines.
    write_row it_airlines-carrid it_airlines-carrname.
    WRITE 30 it_airlines-cnt.
  ENDLOOP.

  READ TABLE it_airlines WITH KEY carrid = 'GA'.
  IF sy-subrc = 0.
    WRITE: / 'The header line now contains:', it_airlines-carrname.
  ENDIF.

  CLEAR it_airlines.                           " the header line only
  IF it_airlines IS INITIAL AND it_airlines[] IS NOT INITIAL.
    WRITE / 'CLEAR it_airlines empties the header line; the table content is still there.'.
  ENDIF.

  REFRESH it_airlines.                         " the table content
  WRITE: / 'After REFRESH:', lines( it_airlines ), 'rows'.`,
    task: `<ul>
      <li>Tulis ulang program ini dengan gaya modern: tipe baris, tabel standard, work area terpisah, satu <tt>SELECT … INTO TABLE</tt>.</li>
      <li>Program ini melakukan <tt>SELECT</tt> di dalam <tt>LOOP</tt>. Ganti dengan satu <tt>SELECT … GROUP BY carrid</tt>.</li>
    </ul>`
  },
  {
    id: 'm07', level: 3,
    title: 'Proyek: laporan penjualan lengkap',
    goal: 'Merangkai selection screen, JOIN, pengolahan data, dan ALV menjadi satu laporan.',
    body: `
      <p>Laporan ABAP di dunia nyata hampir selalu mengikuti kerangka yang sama. Kuasai kerangka ini dan sebagian besar laporan menjadi variasi kecil saja:</p>
      <ul>
        <li><b>Deklarasi</b> — tipe baris output, tabel, selection screen.</li>
        <li><tt>START-OF-SELECTION</tt> — hanya berisi urutan <tt>PERFORM</tt>, sehingga alurnya terbaca sekilas.</li>
        <li><tt>get_data</tt> — satu <tt>SELECT</tt> dengan JOIN, kolom seperlunya.</li>
        <li><tt>process_data</tt> — hitungan per baris dengan field-symbol.</li>
        <li><tt>display_data</tt> — field catalog + ALV.</li>
      </ul>
      <p>Perhatikan kolom <tt>status</tt>: kolom itu tidak ada di database, melainkan dihitung di program — ciri khas laporan.</p>`,
    code: `REPORT z_learn_report.

TYPES: BEGIN OF ty_output,
         vbeln  TYPE vbak-vbeln,
         erdat  TYPE vbak-erdat,
         kunnr  TYPE vbak-kunnr,
         name1  TYPE kna1-name1,
         ort01  TYPE kna1-ort01,
         netwr  TYPE vbak-netwr,
         waerk  TYPE vbak-waerk,
         status TYPE c LENGTH 10,
       END OF ty_output.

DATA: gt_output   TYPE STANDARD TABLE OF ty_output,
      gt_fieldcat TYPE slis_t_fieldcat_alv,
      gs_fieldcat TYPE slis_fieldcat_alv,
      gs_layout   TYPE slis_layout_alv.

FIELD-SYMBOLS <fs_out> TYPE ty_output.

PARAMETERS: p_vkorg TYPE vbak-vkorg DEFAULT '1000',
            p_large TYPE i DEFAULT 10000000.

START-OF-SELECTION.
  PERFORM get_data.
  IF gt_output IS INITIAL.
    MESSAGE 'No sales orders for these criteria' TYPE 'S'.
    RETURN.
  ENDIF.
  PERFORM process_data.
  PERFORM display_data.

*&---------------------------------------------------------------------*
FORM get_data.
  SELECT a~vbeln a~erdat a~kunnr b~name1 b~ort01 a~netwr a~waerk
    FROM vbak AS a
    INNER JOIN kna1 AS b ON a~kunnr = b~kunnr
    INTO TABLE gt_output
    WHERE a~vkorg = p_vkorg
    ORDER BY a~vbeln.
ENDFORM.

*&---------------------------------------------------------------------*
FORM process_data.
  LOOP AT gt_output ASSIGNING <fs_out>.
    IF <fs_out>-netwr >= p_large.
      <fs_out>-status = 'LARGE'.
    ELSE.
      <fs_out>-status = 'REGULAR'.
    ENDIF.
  ENDLOOP.
ENDFORM.

*&---------------------------------------------------------------------*
FORM display_data.
  PERFORM add_field USING 'VBELN'  'Sales Order'  'X' ' '.
  PERFORM add_field USING 'ERDAT'  'Date'         ' ' ' '.
  PERFORM add_field USING 'KUNNR'  'Customer'     ' ' ' '.
  PERFORM add_field USING 'NAME1'  'Name'         ' ' ' '.
  PERFORM add_field USING 'ORT01'  'City'         ' ' ' '.
  PERFORM add_field USING 'NETWR'  'Net Value'    ' ' 'X'.
  PERFORM add_field USING 'WAERK'  'Currency'     ' ' ' '.
  PERFORM add_field USING 'STATUS' 'Status'       ' ' ' '.

  gs_layout-zebra = 'X'.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program = sy-repid
      i_grid_title       = 'Sales Order Report'
      is_layout          = gs_layout
      it_fieldcat        = gt_fieldcat
    TABLES
      t_outtab           = gt_output
    EXCEPTIONS
      program_error      = 1
      OTHERS             = 2.
ENDFORM.

*&---------------------------------------------------------------------*
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
ENDFORM.`,
    task: `<ul>
      <li>Buka <b>Parameters (F8)</b> dan ubah <tt>P_LARGE</tt> menjadi 20000000. Order mana yang berubah status?</li>
      <li>Tambahkan kolom jumlah item per order (hitung dari tabel VBAP dengan <tt>SELECT COUNT( * )</tt> — lalu pikirkan cara menghindari SELECT di dalam LOOP).</li>
      <li>Ganti tampilannya menjadi <tt>CL_SALV_TABLE</tt>.</li>
    </ul>`
  },

  // ════════════════════════════════════════════════════════
  // LEVEL 4 — MAHIR
  // ════════════════════════════════════════════════════════
  {
    id: 'a01', level: 4,
    title: 'OO ABAP: class dan objek',
    goal: 'Mendefinisikan class, membuat objek, dan memanggil method-nya.',
    body: `
      <p>Di ABAP berorientasi objek, data dan logika yang mengolahnya dibungkus dalam <b>class</b>. Sebuah class ditulis dalam dua bagian:</p>
      <ul>
        <li><tt>CLASS … DEFINITION</tt> — <b>apa</b> yang dimiliki class: atribut (<tt>DATA</tt>) dan method (<tt>METHODS</tt>).</li>
        <li><tt>CLASS … IMPLEMENTATION</tt> — <b>isi</b> setiap method, di antara <tt>METHOD … ENDMETHOD</tt>.</li>
        <li><tt>PUBLIC SECTION</tt> bisa diakses dari luar; <tt>PRIVATE SECTION</tt> hanya dari dalam class. Menyembunyikan atribut di balik method disebut <b>enkapsulasi</b>.</li>
      </ul>
      <p>Class hanyalah cetakan. <b>Objek</b> dibuat darinya, dan setiap objek punya salinan atributnya sendiri:</p>
      <ul>
        <li>Variabel penunjuk objek: <tt>DATA lo_x TYPE REF TO lcl_x.</tt></li>
        <li>Membuat objek: <tt>CREATE OBJECT lo_x.</tt> atau bentuk modern <tt>lo_x = NEW lcl_x( ).</tt></li>
        <li>Memanggil method: <tt>lo_x-&gt;method( nilai ).</tt> Parameter <tt>RETURNING</tt> membuat method bisa dipakai seperti fungsi.</li>
      </ul>
      <p>Kebiasaan penamaan: <tt>lcl_</tt> class lokal, <tt>lo_</tt> referensi objek, <tt>mv_</tt> atribut, <tt>iv_</tt> importing, <tt>rv_</tt> returning.</p>`,
    code: `REPORT z_learn_class.

CLASS lcl_account DEFINITION.
  PUBLIC SECTION.
    METHODS: set_owner   IMPORTING iv_name TYPE string,
             deposit     IMPORTING iv_amount TYPE i,
             withdraw    IMPORTING iv_amount TYPE i,
             get_balance RETURNING VALUE(rv_balance) TYPE i,
             print.
  PRIVATE SECTION.
    DATA: mv_owner   TYPE string,
          mv_balance TYPE i.
ENDCLASS.

CLASS lcl_account IMPLEMENTATION.
  METHOD set_owner.
    mv_owner = iv_name.
  ENDMETHOD.

  METHOD deposit.
    mv_balance = mv_balance + iv_amount.
  ENDMETHOD.

  METHOD withdraw.
    IF iv_amount > mv_balance.
      WRITE: / mv_owner, ': balance is not sufficient to withdraw', iv_amount.
      RETURN.
    ENDIF.
    mv_balance = mv_balance - iv_amount.
  ENDMETHOD.

  METHOD get_balance.
    rv_balance = mv_balance.
  ENDMETHOD.

  METHOD print.
    WRITE: / 'Account', mv_owner, '| balance', mv_balance.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA: lo_andi TYPE REF TO lcl_account,
        lo_sari TYPE REF TO lcl_account.

  CREATE OBJECT lo_andi.                 " the classic way
  lo_sari = NEW lcl_account( ).          " the modern way

  lo_andi->set_owner( 'Andi' ).
  lo_andi->deposit( 500000 ).
  lo_andi->withdraw( iv_amount = 200000 ).

  lo_sari->set_owner( 'Sari' ).
  lo_sari->deposit( 100000 ).
  lo_sari->withdraw( 750000 ).              " rejected

  lo_andi->print( ).
  lo_sari->print( ).

  DATA(lv_balance) = lo_andi->get_balance( ).
  WRITE: / 'Balance of Andi via get_balance( ):', lv_balance.`,
    task: `<ul>
      <li>Di program utama tulis <tt>lo_andi-&gt;mv_balance = 999.</tt> dan jalankan. Mengapa ditolak?</li>
      <li>Tambahkan method <tt>transfer</tt> yang memindahkan saldo ke rekening lain (<tt>IMPORTING io_target TYPE REF TO lcl_account iv_amount TYPE i</tt>).</li>
      <li>Panggil method lewat referensi yang belum dibuat objeknya (hapus <tt>CREATE OBJECT lo_andi.</tt>) dan baca error-nya.</li>
    </ul>`
  },
  {
    id: 'a02', level: 4,
    title: 'Constructor, static, dan visibility',
    goal: 'Menginisialisasi objek lewat constructor dan memakai atribut/method milik class.',
    body: `
      <ul>
        <li><tt>constructor</tt> adalah method khusus yang otomatis dijalankan saat objek dibuat. Parameternya diisi di <tt>NEW lcl_x( … )</tt> atau <tt>CREATE OBJECT … EXPORTING …</tt>. Dengan constructor, objek tidak pernah berada dalam keadaan "setengah jadi".</li>
        <li><b>Static</b> = milik class, bukan milik objek: <tt>CLASS-DATA</tt> dipakai bersama oleh semua objek, <tt>CLASS-METHODS</tt> dipanggil tanpa objek. Aksesnya memakai <tt>=&gt;</tt>: <tt>lcl_x=&gt;gv_count</tt>.</li>
        <li><tt>CONSTANTS</tt> di dalam class juga static.</li>
        <li><tt>READ-ONLY</tt> membuat atribut publik bisa dibaca dari luar tetapi hanya bisa diubah dari dalam class.</li>
        <li>Tiga tingkat visibility: <tt>PUBLIC</tt> (semua), <tt>PROTECTED</tt> (class dan turunannya), <tt>PRIVATE</tt> (class itu saja).</li>
      </ul>`,
    code: `REPORT z_learn_constructor.

CLASS lcl_employee DEFINITION.
  PUBLIC SECTION.
    CONSTANTS gc_company TYPE string VALUE 'PT Maju Bersama'.
    CLASS-DATA gv_count TYPE i.                     " shared by all objects
    DATA mv_name TYPE string READ-ONLY.             " readable from outside, cannot be changed

    METHODS: constructor IMPORTING iv_name TYPE string
                                   iv_salary TYPE i,
             raise_salary   IMPORTING iv_percent TYPE i,
             info.
    CLASS-METHODS total_employees RETURNING VALUE(rv_count) TYPE i.

  PRIVATE SECTION.
    DATA mv_salary TYPE i.
ENDCLASS.

CLASS lcl_employee IMPLEMENTATION.
  METHOD constructor.
    mv_name   = iv_name.
    mv_salary = iv_salary.
    gv_count  = gv_count + 1.
  ENDMETHOD.

  METHOD raise_salary.
    mv_salary = mv_salary + mv_salary * iv_percent / 100.
  ENDMETHOD.

  METHOD info.
    WRITE: / mv_name, '| salary', mv_salary.
  ENDMETHOD.

  METHOD total_employees.
    rv_count = gv_count.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  WRITE: / 'Company:', lcl_employee=>gc_company.
  WRITE: / 'Employees before any object exists:', lcl_employee=>total_employees( ).

  DATA(lo_rina) = NEW lcl_employee( iv_name = 'Rina' iv_salary = 8000000 ).
  DATA(lo_joko) = NEW lcl_employee( iv_name = 'Joko' iv_salary = 6500000 ).

  lo_rina->raise_salary( 10 ).
  lo_rina->info( ).
  lo_joko->info( ).

  WRITE: / 'Name (READ-ONLY):', lo_rina->mv_name.
  WRITE: / 'Total employees :', lcl_employee=>gv_count.`,
    task: `<ul>
      <li>Coba <tt>lo_rina-&gt;mv_name = 'Lain'.</tt> dari program utama.</li>
      <li>Buat objek tanpa parameter: <tt>NEW lcl_employee( )</tt>. Apa pesannya?</li>
      <li>Tambahkan static method <tt>reset</tt> yang mengembalikan <tt>gv_count</tt> ke 0.</li>
    </ul>`
  },
  {
    id: 'a03', level: 4,
    title: 'Inheritance dan redefinition',
    goal: 'Membuat class turunan yang mewarisi dan mengubah perilaku class induk.',
    body: `
      <ul>
        <li><tt>CLASS anak DEFINITION INHERITING FROM induk.</tt> — class anak mewarisi semua atribut dan method induknya.</li>
        <li><tt>METHODS nama REDEFINITION.</tt> — anak mengganti isi method induk. Di dalamnya <tt>super-&gt;nama( )</tt> masih bisa memanggil versi induk.</li>
        <li>Atribut <tt>PROTECTED</tt> terlihat oleh class turunan tetapi tidak dari luar.</li>
        <li>Variabel bertipe induk boleh menunjuk ke objek anak. Method yang dijalankan ditentukan oleh <b>objek sebenarnya</b>, bukan tipe variabelnya — inilah <b>polymorphism</b>.</li>
      </ul>
      <p>Perhatikan <tt>introduce</tt>: method itu hanya ada di induk, tetapi <tt>make_sound( )</tt> yang dipanggilnya adalah versi masing-masing turunan.</p>`,
    code: `REPORT z_learn_inheritance.

CLASS lcl_animal DEFINITION.
  PUBLIC SECTION.
    METHODS: constructor IMPORTING iv_name TYPE string,
             make_sound,
             introduce.
  PROTECTED SECTION.
    DATA mv_name TYPE string.
ENDCLASS.

CLASS lcl_animal IMPLEMENTATION.
  METHOD constructor.
    mv_name = iv_name.
  ENDMETHOD.

  METHOD make_sound.
    WRITE: / mv_name, 'makes a sound.'.
  ENDMETHOD.

  METHOD introduce.
    WRITE: / 'Hello, I am', mv_name.
    make_sound( ).                        " the subclass version is called
  ENDMETHOD.
ENDCLASS.

CLASS lcl_cat DEFINITION INHERITING FROM lcl_animal.
  PUBLIC SECTION.
    METHODS make_sound REDEFINITION.
ENDCLASS.

CLASS lcl_cat IMPLEMENTATION.
  METHOD make_sound.
    WRITE: / mv_name, 'says: Meow!'.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_dog DEFINITION INHERITING FROM lcl_animal.
  PUBLIC SECTION.
    METHODS make_sound REDEFINITION.
ENDCLASS.

CLASS lcl_dog IMPLEMENTATION.
  METHOD make_sound.
    super->make_sound( ).                 " run the superclass version first
    WRITE: / mv_name, 'says: Woof woof!'.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA lo_animal TYPE REF TO lcl_animal.   " superclass type

  lo_animal = NEW lcl_animal( 'Generic animal' ).
  lo_animal->introduce( ).
  ULINE.

  lo_animal = NEW lcl_cat( 'Tom' ).    " points to a subclass object
  lo_animal->introduce( ).
  ULINE.

  lo_animal = NEW lcl_dog( 'Bruno' ).
  lo_animal->introduce( ).`,
    task: `<ul>
      <li>Tambahkan class <tt>lcl_bird</tt> dengan suaranya sendiri.</li>
      <li>Ubah <tt>mv_name</tt> menjadi <tt>PRIVATE</tt>. Apa yang terjadi di class turunan?</li>
      <li>Beri <tt>lcl_cat</tt> constructor sendiri yang menerima nama dan warna, lalu memanggil <tt>super-&gt;constructor( iv_name )</tt>.</li>
    </ul>`
  },
  {
    id: 'a04', level: 4,
    title: 'Interface dan polymorphism',
    goal: 'Memperlakukan objek dari class berbeda secara seragam lewat interface.',
    body: `
      <p><b>Interface</b> adalah kontrak: daftar method tanpa isi. Class yang menulis <tt>INTERFACES lif_x.</tt> berjanji menyediakan semua method itu.</p>
      <ul>
        <li>Di implementasi, nama method-nya <tt>lif_x~name</tt> (tanda <tt>~</tt> = "milik interface").</li>
        <li>Variabel bertipe <tt>REF TO lif_x</tt> bisa menunjuk ke objek dari class <b>mana pun</b> yang mengimplementasikan interface itu.</li>
        <li>Dengan begitu, satu <tt>LOOP</tt> bisa memproses persegi, lingkaran, dan bentuk lain tanpa <tt>IF</tt>/<tt>CASE</tt> per jenis. Menambah bentuk baru tidak mengubah kode loop sama sekali.</li>
      </ul>
      <p>Bedanya dengan inheritance: turunan mewarisi <b>isi</b> dari satu induk; interface hanya mewajibkan <b>bentuk</b>, dan satu class boleh mengimplementasikan banyak interface.</p>`,
    code: `REPORT z_learn_interface.

INTERFACE lif_shape.
  METHODS: name RETURNING VALUE(rv_name) TYPE string,
           area RETURNING VALUE(rv_area) TYPE f.
ENDINTERFACE.

CLASS lcl_square DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_shape.
    METHODS constructor IMPORTING iv_side TYPE i.
  PRIVATE SECTION.
    DATA mv_side TYPE i.
ENDCLASS.

CLASS lcl_square IMPLEMENTATION.
  METHOD constructor.
    mv_side = iv_side.
  ENDMETHOD.
  METHOD lif_shape~name.
    rv_name = 'Square'.
  ENDMETHOD.
  METHOD lif_shape~area.
    rv_area = mv_side * mv_side.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_circle DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_shape.
    METHODS constructor IMPORTING iv_radius TYPE i.
  PRIVATE SECTION.
    DATA mv_radius TYPE i.
ENDCLASS.

CLASS lcl_circle IMPLEMENTATION.
  METHOD constructor.
    mv_radius = iv_radius.
  ENDMETHOD.
  METHOD lif_shape~name.
    rv_name = 'Circle'.
  ENDMETHOD.
  METHOD lif_shape~area.
    rv_area = '3.14' * mv_radius * mv_radius.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA: gt_shapes TYPE STANDARD TABLE OF REF TO lif_shape,
        go_shape  TYPE REF TO lif_shape,
        gv_total  TYPE f.

  APPEND NEW lcl_square( 4 )     TO gt_shapes.
  APPEND NEW lcl_circle( 5 )     TO gt_shapes.
  APPEND NEW lcl_square( 10 )    TO gt_shapes.

* One loop for every kind of shape
  LOOP AT gt_shapes INTO go_shape.
    WRITE: / go_shape->name( ), '| area =', go_shape->area( ).
    gv_total = gv_total + go_shape->area( ).
  ENDLOOP.
  ULINE.
  WRITE: / 'Total area:', gv_total.`,
    task: `<ul>
      <li>Tambahkan class <tt>lcl_triangle</tt> (alas, tinggi). Perhatikan: kode <tt>LOOP</tt> tidak perlu diubah.</li>
      <li>Tambahkan method <tt>perimeter</tt> ke interface. Apa yang terjadi bila salah satu class belum mengimplementasikannya?</li>
    </ul>`
  },
  {
    id: 'a05', level: 4,
    title: 'Exception: TRY, CATCH, RAISE',
    goal: 'Menangani error dengan class exception, termasuk membuat exception sendiri.',
    body: `
      <p>Exception berbasis class adalah pengganti modern untuk <tt>sy-subrc</tt>. Kode yang berisiko ditaruh di blok <tt>TRY</tt>;
         bila terjadi exception, eksekusi <b>langsung melompat</b> ke blok <tt>CATCH</tt> yang cocok dan sisa blok <tt>TRY</tt> dilewati.</p>
      <ul>
        <li>Exception sistem: <tt>cx_sy_zerodivide</tt> (bagi nol), <tt>cx_sy_ref_is_initial</tt> (referensi kosong), dan lainnya.</li>
        <li><tt>CATCH cx_… INTO DATA(lx).</tt> menyimpan objek exception; <tt>lx-&gt;get_text( )</tt> mengembalikan pesannya.</li>
        <li><tt>CATCH cx_root</tt> menangkap <b>semua</b> exception — pakai seperlunya, karena menyembunyikan error yang tidak terduga.</li>
        <li>Exception sendiri: buat class turunan <tt>cx_static_check</tt>, naikkan dengan <tt>RAISE EXCEPTION TYPE … EXPORTING ….</tt></li>
        <li>Method yang bisa menaikkan exception wajib mencantumkannya di <tt>RAISING</tt>, sehingga pemanggil tahu harus menanganinya.</li>
      </ul>
      <p>Exception yang tidak ditangkap menghentikan program dengan short dump.</p>`,
    code: `REPORT z_learn_exception.

* A self-defined exception
CLASS lcx_insufficient_balance DEFINITION INHERITING FROM cx_static_check.
  PUBLIC SECTION.
    DATA mv_shortfall TYPE i READ-ONLY.
    METHODS constructor IMPORTING iv_shortfall TYPE i.
ENDCLASS.

CLASS lcx_insufficient_balance IMPLEMENTATION.
  METHOD constructor.
    super->constructor( ).
    mv_shortfall = iv_shortfall.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_account DEFINITION.
  PUBLIC SECTION.
    METHODS: deposit IMPORTING iv_amount TYPE i,
             withdraw IMPORTING iv_amount TYPE i
                   RAISING   lcx_insufficient_balance.
  PRIVATE SECTION.
    DATA mv_balance TYPE i.
ENDCLASS.

CLASS lcl_account IMPLEMENTATION.
  METHOD deposit.
    mv_balance = mv_balance + iv_amount.
  ENDMETHOD.

  METHOD withdraw.
    IF iv_amount > mv_balance.
      RAISE EXCEPTION TYPE lcx_insufficient_balance
        EXPORTING
          iv_shortfall = iv_amount - mv_balance.
    ENDIF.
    mv_balance = mv_balance - iv_amount.
    WRITE: / 'Withdrawal of', iv_amount, 'succeeded. Remaining balance', mv_balance.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA: lv_a      TYPE i VALUE 10,
        lv_b      TYPE i VALUE 0,
        lv_result TYPE i.

* 1) System exception
  TRY.
      lv_result = lv_a / lv_b.
      WRITE / 'This line is never executed.'.
    CATCH cx_sy_zerodivide INTO DATA(lx_zero).
      WRITE: / 'Caught:', lx_zero->get_text( ).
  ENDTRY.
  WRITE / 'The program continues after ENDTRY.'.
  ULINE.

* 2) Self-defined exception
  DATA(lo_account) = NEW lcl_account( ).
  lo_account->deposit( 500000 ).

  TRY.
      lo_account->withdraw( 200000 ).
      lo_account->withdraw( 700000 ).    " raises the exception
      lo_account->withdraw( 100000 ).    " skipped
    CATCH lcx_insufficient_balance INTO DATA(lx_balance).
      WRITE: / 'Withdrawal refused, the balance is short by', lx_balance->mv_shortfall.
  ENDTRY.
  ULINE.

* 3) CATCH cx_root catches anything
  DATA lo_empty TYPE REF TO lcl_account.
  TRY.
      lo_empty->deposit( 1 ).             " the object has not been created
    CATCH cx_root INTO DATA(lx_any).
      WRITE: / 'Another error:', lx_any->get_text( ).
  ENDTRY.`,
    task: `<ul>
      <li>Hapus blok <tt>TRY … ENDTRY</tt> di bagian 1 dan jalankan. Program berhenti di mana?</li>
      <li>Tambahkan exception kedua <tt>lcx_invalid_amount</tt> yang dinaikkan bila jumlah tarik ≤ 0, dan tangkap dengan <tt>CATCH</tt> terpisah.</li>
    </ul>`
  },
  {
    id: 'a06', level: 4,
    title: 'Sintaks ABAP modern (7.40+)',
    goal: 'Menulis kode yang lebih ringkas dengan deklarasi inline, VALUE, dan string template.',
    body: `
      <p>Sejak rilis 7.40, banyak pola lama punya bentuk yang jauh lebih ringkas. Kode baru sebaiknya memakai bentuk modern; bentuk lama tetap perlu dikenali karena masih memenuhi sistem yang ada.</p>
      <table>
        <tr><th>Klasik</th><th>Modern</th></tr>
        <tr><td><tt>DATA lv_x TYPE i. lv_x = 5.</tt></td><td><tt>DATA(lv_x) = 5.</tt></td></tr>
        <tr><td>isi work area, lalu <tt>APPEND</tt></td><td><tt>APPEND VALUE #( a = 1 b = 2 ) TO lt.</tt></td></tr>
        <tr><td><tt>LOOP AT lt INTO ls.</tt> + deklarasi <tt>ls</tt></td><td><tt>LOOP AT lt INTO DATA(ls).</tt></td></tr>
        <tr><td><tt>FIELD-SYMBOLS &lt;fs&gt;</tt> + <tt>ASSIGNING &lt;fs&gt;</tt></td><td><tt>ASSIGNING FIELD-SYMBOL(&lt;fs&gt;)</tt></td></tr>
        <tr><td><tt>CONCATENATE a b INTO c.</tt></td><td><tt>c = |{ a } { b }|.</tt> atau <tt>a &amp;&amp; b</tt></td></tr>
        <tr><td><tt>CREATE OBJECT lo.</tt></td><td><tt>DATA(lo) = NEW lcl_x( ).</tt></td></tr>
        <tr><td><tt>INTO TABLE gt</tt></td><td><tt>INTO TABLE @DATA(lt)</tt> (dengan <tt>@</tt> di depan variabel program)</td></tr>
      </table>
      <p>Tipe variabel inline diturunkan dari nilai di sisi kanan. <tt>#</tt> pada <tt>VALUE #( … )</tt> berarti "pakai tipe dari konteks".</p>`,
    code: `REPORT z_learn_modern.

TYPES: BEGIN OF ty_fruit,
         name  TYPE string,
         price TYPE i,
         stock TYPE i,
       END OF ty_fruit,
       tt_fruit TYPE STANDARD TABLE OF ty_fruit WITH EMPTY KEY.

* Inline declaration and the VALUE constructor
DATA(lv_shop) = 'Fresh Market'.
DATA(lt_fruits) = VALUE tt_fruit(
  ( name = 'Apple'  price = 5000 stock = 20 )
  ( name = 'Mango'  price = 8000 stock = 12 ) ).

APPEND VALUE #( name = 'Orange' price = 4000 stock = 0 ) TO lt_fruits.

* LOOP with an inline work area + string template
LOOP AT lt_fruits INTO DATA(ls_fruit) WHERE stock > 0.
  DATA(lv_value) = ls_fruit-price * ls_fruit-stock.
  WRITE / |{ ls_fruit-name }: { ls_fruit-stock } pieces, value Rp { lv_value }|.
ENDLOOP.

* Inline field symbol: change directly in the table
LOOP AT lt_fruits ASSIGNING FIELD-SYMBOL(<ls_fruit>).
  <ls_fruit>-price = <ls_fruit>-price + 500.
ENDLOOP.

READ TABLE lt_fruits INTO DATA(ls_found) WITH KEY name = 'Mango'.
IF sy-subrc = 0.
  WRITE / |New price of { ls_found-name }: Rp { ls_found-price }|.
ENDIF.

* The && operator and built-in functions
DATA(lv_count)   = lines( lt_fruits ).
DATA(lv_message) = lv_shop && ' sells ' && lv_count && ' kinds of fruit.'.
WRITE / lv_message.

* SELECT with an inline declaration
ULINE.
SELECT * FROM scarr INTO TABLE @DATA(lt_scarr) UP TO 3 ROWS.
LOOP AT lt_scarr INTO DATA(ls_scarr).
  WRITE / |{ ls_scarr-carrid } - { ls_scarr-carrname } ({ ls_scarr-currcode })|.
ENDLOOP.`,
    task: `<ul>
      <li>Tulis ulang pelajaran "Internal table: APPEND dan LOOP" dengan sintaks modern. Berapa baris yang hilang?</li>
      <li>Buat tabel tiga karyawan dengan satu <tt>VALUE</tt>, lalu cetak dengan string template.</li>
    </ul>`
  },
  {
    id: 'a08', level: 4,
    title: 'Ekspresi modern: COND, SWITCH, table expression, REDUCE, FOR',
    goal: 'Mengganti blok IF / LOOP sederhana dengan ekspresi yang menghasilkan nilai.',
    body: `
      <p>ABAP modern memungkinkan logika ditulis sebagai <b>ekspresi</b> di sisi kanan sebuah assignment, alih-alih beberapa baris statement.</p>
      <table>
        <tr><th>Ekspresi</th><th>Menggantikan</th></tr>
        <tr><td><tt>COND tipe( WHEN … THEN … ELSE … )</tt></td><td><tt>IF / ELSEIF / ELSE</tt> yang hanya mengisi satu variabel</td></tr>
        <tr><td><tt>SWITCH tipe( x WHEN … THEN … )</tt></td><td><tt>CASE</tt> yang hanya mengisi satu variabel</td></tr>
        <tr><td><tt>itab[ 2 ]</tt>, <tt>itab[ id = 5 ]-name</tt></td><td><tt>READ TABLE</tt></td></tr>
        <tr><td><tt>line_exists( itab[ … ] )</tt></td><td><tt>READ TABLE … TRANSPORTING NO FIELDS</tt> + cek <tt>sy-subrc</tt></td></tr>
        <tr><td><tt>VALUE tipe( FOR r IN itab WHERE ( … ) ( … ) )</tt></td><td><tt>LOOP</tt> + <tt>APPEND</tt> untuk membangun tabel baru</td></tr>
        <tr><td><tt>REDUCE tipe( INIT s = 0 FOR r IN itab NEXT s = s + r-f )</tt></td><td><tt>LOOP</tt> untuk menjumlah / menghitung</td></tr>
        <tr><td><tt>CORRESPONDING tipe( sumber )</tt></td><td><tt>MOVE-CORRESPONDING</tt></td></tr>
      </table>
      <p>Hati-hati dengan table expression: bila barisnya tidak ada, yang terjadi bukan <tt>sy-subrc = 4</tt> melainkan exception
         <tt>cx_sy_itab_line_not_found</tt>. Pakai <tt>line_exists( )</tt>, <tt>VALUE #( … OPTIONAL )</tt>, atau <tt>TRY … CATCH</tt>.</p>`,
    code: `REPORT z_learn_expressions.

TYPES: BEGIN OF ty_student,
         id    TYPE i,
         name  TYPE string,
         score TYPE i,
       END OF ty_student,
       tt_student TYPE STANDARD TABLE OF ty_student WITH EMPTY KEY.

TYPES: BEGIN OF ty_report_card,
         name  TYPE string,
         grade TYPE c LENGTH 1,
       END OF ty_report_card,
       tt_report_card TYPE STANDARD TABLE OF ty_report_card WITH EMPTY KEY.

DATA(lt_students) = VALUE tt_student(
  ( id = 1 name = 'Ani'  score = 92 )
  ( id = 2 name = 'Budi' score = 67 )
  ( id = 3 name = 'Cici' score = 45 ) ).

* Table expression: reading without READ TABLE
DATA(lv_score_budi) = lt_students[ 2 ]-score.
DATA(ls_cici)       = lt_students[ name = 'Cici' ].
WRITE: / 'Score of Budi:', lv_score_budi, '| id Cici:', ls_cici-id.

lt_students[ 3 ]-score = 58.                       " changes the table directly

IF line_exists( lt_students[ id = 9 ] ).
  WRITE / 'Student 9 exists.'.
ELSE.
  WRITE / 'Student 9 does not exist.'.
ENDIF.
DATA(lv_name) = VALUE #( lt_students[ id = 9 ]-name DEFAULT '(not found)' ).
WRITE: / 'With DEFAULT:', lv_name.

TRY.
    DATA(lv_failed) = lt_students[ 9 ]-name.
  CATCH cx_sy_itab_line_not_found.
    WRITE / 'Without a safeguard: exception cx_sy_itab_line_not_found.'.
ENDTRY.

* COND and SWITCH
ULINE.
LOOP AT lt_students INTO DATA(ls_student).
  DATA(lv_grade) = COND string( WHEN ls_student-score >= 85 THEN 'A'
                                WHEN ls_student-score >= 60 THEN 'B'
                                ELSE 'C' ).
  DATA(lv_remark) = SWITCH string( lv_grade WHEN 'A' THEN 'excellent'
                                         WHEN 'B' THEN 'passed'
                                         ELSE 'remedial' ).
  WRITE: / ls_student-name, ls_student-score, lv_grade, lv_remark.
ENDLOOP.

* REDUCE and FOR
ULINE.
DATA(lv_total) = REDUCE i( INIT s = 0 FOR r IN lt_students NEXT s = s + r-score ).
DATA(lv_passed) = REDUCE i( INIT n = 0 FOR r IN lt_students WHERE ( score >= 60 ) NEXT n = n + 1 ).
WRITE: / 'Total score:', lv_total, '| passed:', lv_passed, 'of', lines( lt_students ).

DATA(lt_report_card) = VALUE tt_report_card( FOR r IN lt_students WHERE ( score >= 50 )
                                 ( name = r-name grade = COND #( WHEN r-score >= 85 THEN 'A' ELSE 'B' ) ) ).
LOOP AT lt_report_card INTO DATA(ls_report_card).
  WRITE: / 'Report card:', ls_report_card-name, ls_report_card-grade.
ENDLOOP.

DATA(lt_multiples) = VALUE tt_student( FOR i = 1 UNTIL i > 3 ( id = i * 10 name = |Number { i }| ) ).
WRITE: / 'FOR with a counter:', lt_multiples[ 3 ]-id, lt_multiples[ 3 ]-name.

* CORRESPONDING: copy components of the same name to another type
DATA(lt_names) = CORRESPONDING tt_report_card( lt_students ).
WRITE: / 'CORRESPONDING:', lines( lt_names ), 'rows, first row =', lt_names[ 1 ]-name.`,
    task: `<ul>
      <li>Hitung nilai tertinggi dengan <tt>REDUCE</tt> (petunjuk: <tt>NEXT m = COND #( WHEN r-score &gt; m THEN r-score ELSE m )</tt>).</li>
      <li>Bangun tabel berisi hanya siswa yang <b>tidak</b> lulus dengan <tt>VALUE … FOR … WHERE</tt>.</li>
      <li>Tulis ulang satu blok <tt>COND</tt> sebagai <tt>IF / ELSEIF</tt> biasa dan bandingkan jumlah barisnya.</li>
    </ul>`
  },
  {
    id: 'a09', level: 4,
    title: 'Event di class: EVENTS, RAISE EVENT, SET HANDLER',
    goal: 'Membuat objek saling memberi tahu tanpa saling mengenal.',
    body: `
      <p><b>Event</b> memungkinkan sebuah objek mengumumkan "sesuatu terjadi" tanpa tahu siapa yang mendengarkan. Objek lain mendaftar sebagai pendengar.
         Pola ini (publish–subscribe) dipakai di seluruh SAP — termasuk klik pada ALV.</p>
      <ul>
        <li>Pengirim mendeklarasikan <tt>EVENTS nama EXPORTING VALUE(p) TYPE t.</tt> dan memicunya dengan <tt>RAISE EVENT nama EXPORTING p = ….</tt></li>
        <li>Pendengar punya method <tt>METHODS on_x FOR EVENT nama OF class_pengirim IMPORTING p sender.</tt></li>
        <li><tt>SET HANDLER objek-&gt;on_x FOR pengirim.</tt> menghubungkan keduanya. <tt>FOR ALL INSTANCES</tt> mendengarkan semua objek class itu.</li>
        <li>Parameter khusus <tt>sender</tt> berisi objek yang memicu event.</li>
      </ul>
      <p>Tanpa <tt>SET HANDLER</tt>, event tetap terpicu tetapi tidak ada yang bereaksi — dan itu bukan error.</p>`,
    code: `REPORT z_learn_event_class.

CLASS lcl_stock DEFINITION.
  PUBLIC SECTION.
    EVENTS stock_low EXPORTING VALUE(ev_item)         TYPE string
                                  VALUE(ev_remaining) TYPE i.
    METHODS: constructor IMPORTING iv_item TYPE string
                                   iv_quantity TYPE i,
             take       IMPORTING iv_quantity TYPE i.
  PRIVATE SECTION.
    DATA: mv_item TYPE string,
          mv_quantity TYPE i.
ENDCLASS.

CLASS lcl_stock IMPLEMENTATION.
  METHOD constructor.
    mv_item = iv_item.
    mv_quantity = iv_quantity.
  ENDMETHOD.

  METHOD take.
    mv_quantity = mv_quantity - iv_quantity.
    WRITE / |{ mv_item }: { iv_quantity } taken, { mv_quantity } left|.
    IF mv_quantity < 10.
      RAISE EVENT stock_low EXPORTING ev_item         = mv_item
                                         ev_remaining = mv_quantity.
    ENDIF.
  ENDMETHOD.
ENDCLASS.

* The listener: unknown to lcl_stok
CLASS lcl_purchasing DEFINITION.
  PUBLIC SECTION.
    METHODS on_stock_low FOR EVENT stock_low OF lcl_stock
      IMPORTING ev_item ev_remaining.
    DATA mv_orders TYPE i.
ENDCLASS.

CLASS lcl_purchasing IMPLEMENTATION.
  METHOD on_stock_low.
    mv_orders = mv_orders + 1.
    WRITE /3 |>> Purchasing: reorder { ev_item } ({ ev_remaining } left)|.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(lo_paper)      = NEW lcl_stock( iv_item = 'A4 paper'  iv_quantity = 25 ).
  DATA(lo_ink)        = NEW lcl_stock( iv_item = 'Ink'       iv_quantity = 12 ).
  DATA(lo_purchasing) = NEW lcl_purchasing( ).

* Only the paper stock is listened to
  SET HANDLER lo_purchasing->on_stock_low FOR lo_paper.

  lo_paper->take( 10 ).
  lo_paper->take( 8 ).                 " 7 left  -> event -> the handler runs
  lo_ink->take( 5 ).                   " 7 left  -> event, but nobody is listening yet

  ULINE.
  SET HANDLER lo_purchasing->on_stock_low FOR lo_ink.
  lo_ink->take( 2 ).                " now the handler runs as well

  WRITE: / 'Number of reorders:', lo_purchasing->mv_orders.`,
    task: `<ul>
      <li>Ganti kedua <tt>SET HANDLER</tt> dengan satu <tt>… FOR ALL INSTANCES.</tt> Berapa pesanan ulang yang tercatat?</li>
      <li>Tambahkan pendengar kedua, <tt>lcl_warehouse</tt>, yang mencetak peringatan sendiri untuk event yang sama.</li>
      <li>Tambahkan <tt>sender</tt> ke daftar <tt>IMPORTING</tt> handler dan panggil sebuah method publik pengirimnya.</li>
    </ul>`
  },
  {
    id: 'a10', level: 4,
    title: 'Data reference dan pemrograman dinamis',
    goal: 'Mengakses data lewat referensi dan lewat nama yang baru diketahui saat program berjalan.',
    body: `
      <p>Program generik — misalnya yang mencetak struktur apa pun — tidak tahu nama field saat ditulis. Alatnya adalah <b>data reference</b> dan <b>akses dinamis</b>.</p>
      <ul>
        <li><b>Data reference</b> adalah penunjuk ke data: <tt>DATA dref TYPE REF TO i.</tt> Diisi dengan <tt>dref = REF #( variabel ).</tt> atau <tt>GET REFERENCE OF variabel INTO dref.</tt></li>
        <li><tt>dref-&gt;*</tt> adalah datanya sendiri (<i>dereference</i>). Untuk referensi ke struktur, komponen diakses dengan <tt>dref-&gt;komponen</tt>.</li>
        <li><tt>CREATE DATA dref.</tt> membuat data baru tanpa nama yang hanya bisa dicapai lewat referensi itu.</li>
        <li><tt>LOOP AT itab REFERENCE INTO dref.</tt> — seperti <tt>ASSIGNING</tt>, perubahan langsung mengenai baris tabel.</li>
        <li><tt>ASSIGN COMPONENT n OF STRUCTURE s TO &lt;fs&gt;.</tt> mengambil komponen lewat <b>nomor atau nama</b>; <tt>sy-subrc</tt> = 4 bila tidak ada. Dengan <tt>DO</tt> + <tt>EXIT</tt>, seluruh komponen bisa dijelajahi.</li>
        <li><tt>ASSIGN (name) TO &lt;fs&gt;.</tt> mengambil variabel yang namanya tersimpan di variabel lain.</li>
      </ul>
      <p>Referensi yang belum diisi bernilai kosong; men-dereference-nya memicu <tt>cx_sy_ref_is_initial</tt>. Periksa dengan <tt>IS BOUND</tt>.</p>`,
    code: `REPORT z_learn_dynamic.

TYPES: BEGIN OF ty_product,
         code  TYPE c LENGTH 5,
         name  TYPE string,
         price TYPE i,
       END OF ty_product.

DATA: gv_number   TYPE i VALUE 5,
      gs_product  TYPE ty_product,
      gt_products TYPE STANDARD TABLE OF ty_product,
      gr_number   TYPE REF TO i,
      gr_product  TYPE REF TO ty_product,
      gv_name     TYPE string.

FIELD-SYMBOLS <fs_any> TYPE any.

* 1) A reference to a variable
gr_number = REF #( gv_number ).
gr_number->* = 99.                        " changes gv_angka through the reference
WRITE: / 'gv_number =', gv_number, '| through the reference =', gr_number->*.

* 2) Anonymous data
CREATE DATA gr_number.
gr_number->* = 7.
WRITE: / 'New data =', gr_number->*, '| gv_number is still', gv_number.

* 3) References to a structure and to a table row
gs_product-code = 'P001'. gs_product-name = 'Keyboard'. gs_product-price = 350000.
APPEND gs_product TO gt_products.
gs_product-code = 'P002'. gs_product-name = 'Mouse'.    gs_product-price = 150000.
APPEND gs_product TO gt_products.

LOOP AT gt_products REFERENCE INTO gr_product.
  gr_product->price = gr_product->price * 2.
ENDLOOP.
WRITE: / 'Price after doubling:', gt_products[ 1 ]-price, gt_products[ 2 ]-price.

* 4) Walking through the components of a structure without knowing their names
ULINE.
gs_product = gt_products[ 2 ].
DO.
  ASSIGN COMPONENT sy-index OF STRUCTURE gs_product TO <fs_any>.
  IF sy-subrc <> 0.
    EXIT.
  ENDIF.
  WRITE: / 'Component', sy-index, '=', <fs_any>.
ENDDO.

* 5) Components and variables by name
ASSIGN COMPONENT 'NAME' OF STRUCTURE gs_product TO <fs_any>.
<fs_any> = 'Mouse Wireless'.
WRITE: / 'gs_product-name =', gs_product-name.

gv_name = 'GV_NUMBER'.
ASSIGN (gv_name) TO <fs_any>.
IF sy-subrc = 0.
  WRITE: / 'The variable named', gv_name, 'contains', <fs_any>.
ENDIF.

* 6) An initial reference
CLEAR gr_product.
IF gr_product IS NOT BOUND.
  WRITE / 'gr_product does not point anywhere yet.'.
ENDIF.`,
    task: `<ul>
      <li>Buat FORM <tt>print_structure USING ps_data TYPE any</tt> yang mencetak semua komponen struktur apa pun, lalu panggil untuk <tt>gs_product</tt> dan untuk satu baris SCARR.</li>
      <li>Setelah <tt>CLEAR gr_product</tt>, akses <tt>gr_product-&gt;price</tt> dan tangkap exception-nya dengan <tt>TRY … CATCH cx_sy_ref_is_initial</tt>.</li>
    </ul>`
  },
  {
    id: 'a11', level: 4,
    title: 'SALV lanjutan: kolom, hotspot, dan event',
    goal: 'Mengatur kolom SALV dan menanggapi klik pengguna dengan event handler.',
    body: `
      <p><tt>CL_SALV_TABLE</tt> diatur lewat <b>objek-objek pembantu</b>. Setiap bagian ALV punya objeknya sendiri:</p>
      <table>
        <tr><th>Diambil dengan</th><th>Mengatur</th></tr>
        <tr><td><tt>get_columns( )</tt></td><td>kumpulan kolom: <tt>set_optimize( )</tt>, <tt>get_column( 'NAME' )</tt></td></tr>
        <tr><td><tt>get_column( … )</tt></td><td>satu kolom: <tt>set_long_text</tt> / <tt>set_medium_text</tt> / <tt>set_short_text</tt>, <tt>set_visible( abap_false )</tt>, <tt>set_cell_type( if_salv_c_cell_type=&gt;hotspot )</tt></td></tr>
        <tr><td><tt>get_display_settings( )</tt></td><td><tt>set_striped_pattern( )</tt>, <tt>set_list_header( )</tt></td></tr>
        <tr><td><tt>get_sorts( )</tt>, <tt>get_aggregations( )</tt></td><td><tt>add_sort( columnname = … )</tt>, <tt>add_aggregation( columnname = … )</tt></td></tr>
        <tr><td><tt>get_event( )</tt></td><td>objek event: target <tt>SET HANDLER</tt></td></tr>
      </table>
      <ul>
        <li><tt>get_column( )</tt> mengembalikan tipe umum; untuk <tt>set_cell_type</tt> perlu <tt>CAST cl_salv_column_table( … )</tt>.</li>
        <li>Event SALV: <tt>link_click</tt> (klik hotspot) dan <tt>double_click</tt>, keduanya membawa <tt>row</tt> dan <tt>column</tt>.</li>
        <li>Kolom yang tidak ada memicu <tt>cx_salv_not_found</tt>; <tt>factory</tt> bisa memicu <tt>cx_salv_msg</tt>.</li>
      </ul>
      <p>Jalankan, lalu klik nomor PO yang bergaris bawah.</p>`,
    code: `REPORT z_learn_salv_advanced.

CLASS lcl_po_report DEFINITION.
  PUBLIC SECTION.
    TYPES: BEGIN OF ty_po,
             ebeln TYPE ekko-ebeln,
             ebelp TYPE ekpo-ebelp,
             bedat TYPE ekko-bedat,
             name1 TYPE lfa1-name1,
             txz01 TYPE ekpo-txz01,
             menge TYPE ekpo-menge,
             netpr TYPE ekpo-netpr,
             total TYPE p LENGTH 15 DECIMALS 2,
             waers TYPE ekko-waers,
           END OF ty_po.
    METHODS: execute,
             on_link_click FOR EVENT link_click OF cl_salv_events_table
               IMPORTING row column.
  PRIVATE SECTION.
    DATA: mt_po  TYPE STANDARD TABLE OF ty_po,
          mo_alv TYPE REF TO cl_salv_table.
    METHODS: fetch_data,
             show.
ENDCLASS.

CLASS lcl_po_report IMPLEMENTATION.
  METHOD execute.
    fetch_data( ).
    show( ).
  ENDMETHOD.

  METHOD fetch_data.
    SELECT a~ebeln, b~ebelp, a~bedat, c~name1, b~txz01, b~menge, b~netpr, a~waers
      FROM ekko AS a
      INNER JOIN ekpo AS b ON a~ebeln = b~ebeln
      LEFT OUTER JOIN lfa1 AS c ON a~lifnr = c~lifnr
      INTO CORRESPONDING FIELDS OF TABLE @mt_po
      WHERE b~loekz = @space.

    LOOP AT mt_po ASSIGNING FIELD-SYMBOL(<ls_po>).
      <ls_po>-total = <ls_po>-menge * <ls_po>-netpr.
    ENDLOOP.
  ENDMETHOD.

  METHOD show.
    TRY.
        cl_salv_table=>factory(
          IMPORTING
            r_salv_table = mo_alv
          CHANGING
            t_table      = mt_po ).

        mo_alv->get_display_settings( )->set_striped_pattern( abap_true ).
        mo_alv->get_display_settings( )->set_list_header( 'Purchase Order List' ).

        DATA(lo_columns) = mo_alv->get_columns( ).
        lo_columns->set_optimize( abap_true ).

        " the PO number column can be clicked
        DATA(lo_ebeln) = CAST cl_salv_column_table( lo_columns->get_column( 'EBELN' ) ).
        lo_ebeln->set_cell_type( if_salv_c_cell_type=>hotspot ).

        " own column headings, and one hidden column
        lo_columns->get_column( 'TOTAL' )->set_medium_text( 'Item Value' ).
        lo_columns->get_column( 'TXZ01' )->set_medium_text( 'Item' ).
        lo_columns->get_column( 'EBELP' )->set_visible( abap_false ).

        " sort by vendor, total the value
        mo_alv->get_sorts( )->add_sort( columnname = 'NAME1' ).
        mo_alv->get_aggregations( )->add_aggregation( columnname = 'TOTAL' ).

        " register this method as the click listener
        SET HANDLER on_link_click FOR mo_alv->get_event( ).

        mo_alv->display( ).

      CATCH cx_salv_msg cx_salv_not_found INTO DATA(lx_salv).
        MESSAGE lx_salv->get_text( ) TYPE 'E'.
    ENDTRY.
  ENDMETHOD.

  METHOD on_link_click.
    READ TABLE mt_po INTO DATA(ls_po) INDEX row.
    IF sy-subrc = 0.
      MESSAGE |PO { ls_po-ebeln } from { ls_po-name1 }: { ls_po-txz01 } worth { ls_po-total } { ls_po-waers }| TYPE 'I'.
    ENDIF.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(go_report) = NEW lcl_po_report( ).
  go_report->execute( ).`,
    task: `<ul>
      <li>Minta kolom yang tidak ada (<tt>get_column( 'PRICE' )</tt>). Exception apa yang tertangkap?</li>
      <li>Tambahkan handler untuk event <tt>double_click</tt> yang menampilkan jumlah (<tt>menge</tt>) baris yang diklik.</li>
      <li>Tambahkan <tt>PARAMETERS p_bukrs</tt> dan saring PO menurut company code.</li>
    </ul>`
  },
  {
    id: 'a07', level: 4,
    title: 'Studi kasus: laporan berorientasi objek',
    goal: 'Menyusun laporan lengkap sebagai class: ambil data, olah, tampilkan dengan SALV.',
    body: `
      <p>Pelajaran penutup menggabungkan semuanya. Laporan okupansi penerbangan ditulis sebagai satu class; program utamanya tinggal empat baris.</p>
      <ul>
        <li><b>Tanggung jawab terpisah</b>: <tt>fetch_data</tt> hanya membaca database, <tt>process_data</tt> hanya menghitung, <tt>show</tt> hanya urusan layar. Masing-masing bisa diubah atau diuji sendiri.</li>
        <li><b>State di atribut</b>: tabel hasil disimpan di <tt>mt_data</tt> (private), bukan variabel global.</li>
        <li><b>Tipe di dalam class</b>: <tt>ty_row</tt> didefinisikan di <tt>PUBLIC SECTION</tt> class.</li>
        <li><b>Constructor</b> menerima kriteria seleksi, sehingga objek laporan selalu tahu apa yang harus diambil.</li>
      </ul>
      <p>Bandingkan dengan proyek di level Menengah: alurnya sama, tetapi tidak ada lagi variabel global yang bisa diubah dari mana saja.</p>`,
    code: `REPORT z_learn_oo_report.

CLASS lcl_report DEFINITION.
  PUBLIC SECTION.
    TYPES: BEGIN OF ty_row,
             carrid   TYPE sflight-carrid,
             carrname TYPE scarr-carrname,
             connid   TYPE sflight-connid,
             fldate   TYPE sflight-fldate,
             seatsmax TYPE sflight-seatsmax,
             seatsocc TYPE sflight-seatsocc,
             percent  TYPE i,
             status   TYPE c LENGTH 8,
           END OF ty_row.

    METHODS: constructor IMPORTING iv_carrid TYPE sflight-carrid,
             fetch_data,
             process_data,
             show,
             row_count RETURNING VALUE(rv_count) TYPE i.

  PRIVATE SECTION.
    DATA: mv_carrid TYPE sflight-carrid,
          mt_data   TYPE STANDARD TABLE OF ty_row.
ENDCLASS.

CLASS lcl_report IMPLEMENTATION.
  METHOD constructor.
    mv_carrid = iv_carrid.
  ENDMETHOD.

  METHOD fetch_data.
    SELECT f~carrid c~carrname f~connid f~fldate f~seatsmax f~seatsocc
      FROM sflight AS f
      INNER JOIN scarr AS c ON f~carrid = c~carrid
      INTO TABLE mt_data
      WHERE f~carrid = mv_carrid
      ORDER BY f~fldate.
  ENDMETHOD.

  METHOD process_data.
    LOOP AT mt_data ASSIGNING FIELD-SYMBOL(<ls_row>).
      <ls_row>-percent = <ls_row>-seatsocc * 100 / <ls_row>-seatsmax.
      IF <ls_row>-percent >= 90.
        <ls_row>-status = 'FULL'.
      ELSEIF <ls_row>-percent >= 80.
        <ls_row>-status = 'BUSY'.
      ELSE.
        <ls_row>-status = 'QUIET'.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD row_count.
    rv_count = lines( mt_data ).
  ENDMETHOD.

  METHOD show.
    DATA lo_alv TYPE REF TO cl_salv_table.
    TRY.
        cl_salv_table=>factory(
          IMPORTING
            r_salv_table = lo_alv
          CHANGING
            t_table      = mt_data ).
        lo_alv->get_display_settings( )->set_striped_pattern( abap_true ).
        lo_alv->get_display_settings( )->set_list_header( 'Flight Occupancy' ).
        lo_alv->display( ).
      CATCH cx_salv_msg INTO DATA(lx_msg).
        MESSAGE lx_msg->get_text( ) TYPE 'E'.
    ENDTRY.
  ENDMETHOD.
ENDCLASS.

PARAMETERS p_carr TYPE sflight-carrid DEFAULT 'GA'.

START-OF-SELECTION.
  DATA(lo_report) = NEW lcl_report( p_carr ).
  lo_report->fetch_data( ).

  IF lo_report->row_count( ) = 0.
    MESSAGE |No flights for airline { p_carr }| TYPE 'S'.
    RETURN.
  ENDIF.

  lo_report->process_data( ).
  WRITE: / 'Airline', p_carr, '-', lo_report->row_count( ), 'flights'.
  lo_report->show( ).`,
    task: `<ul>
      <li>Jalankan lewat <b>Parameters (F8)</b> dengan maskapai <tt>SQ</tt>, lalu dengan kode yang tidak ada (<tt>XX</tt>).</li>
      <li>Tambahkan method <tt>average_occupancy</tt> yang mengembalikan rata-rata kolom <tt>percent</tt>.</li>
      <li>Pisahkan tampilan ke class sendiri <tt>lcl_view</tt> yang menerima tabel data — sehingga <tt>lcl_report</tt> tidak tahu apa-apa soal ALV.</li>
    </ul>`
  },

  // ============================================================
  // LEVEL 5 — PAKAR
  // ============================================================
  {
    id: 'e01', level: 5,
    title: 'Regular expression: FIND, REPLACE, matches',
    goal: 'Mencari, memeriksa, dan mengubah teks dengan pola, bukan dengan teks tetap.',
    body: `
      <p><b>Regular expression</b> (regex) adalah pola yang menggambarkan bentuk teks: "sepuluh digit berturut-turut", "dua huruf besar lalu tanda hubung". Dengan satu pola Anda bisa memeriksa format input, mengambil bagian teks, atau menyamarkan data.</p>
      <ul>
        <li>Unsur pola: <tt>\\d</tt> satu digit, <tt>\\w</tt> huruf, digit, atau garis bawah, <tt>.</tt> karakter apa pun, <tt>[A-Z]</tt> satu karakter dari daftar. Pengulangan: <tt>+</tt> satu atau lebih, <tt>*</tt> nol atau lebih, <tt>{10}</tt> tepat sepuluh kali.</li>
        <li><tt>FIND REGEX pola IN teks</tt> mengisi <tt>sy-subrc</tt> (0 = ketemu). <tt>MATCH OFFSET</tt> dan <tt>MATCH LENGTH</tt> memberi posisi dan panjangnya; <tt>FIND ALL OCCURRENCES … MATCH COUNT</tt> menghitung semua kecocokan.</li>
        <li>Kurung <tt>( )</tt> membuat kelompok. <tt>SUBMATCHES</tt> mengisi satu variabel untuk tiap kelompok; di <tt>REPLACE … WITH</tt> isi kelompok dipanggil lagi dengan <tt>$1</tt>, <tt>$2</tt>.</li>
        <li>Fungsi <tt>matches( )</tt> bernilai benar hanya bila <b>seluruh</b> teks cocok dengan pola — pas untuk validasi input. <tt>match( )</tt> mengembalikan bagian yang cocok, <tt>replace( … regex = … occ = 0 )</tt> mengganti semua kecocokan, dan <tt>count( )</tt> menghitungnya.</li>
      </ul>
      <p>Di sistem baru (mulai ABAP 7.55) kata <tt>REGEX</tt> digantikan <tt>PCRE</tt>, dengan cara tulis yang sama: <tt>FIND PCRE …</tt>, <tt>matches( val = … pcre = … )</tt>. Simulator menerima keduanya.</p>`,
    code: `REPORT z_learn_regex.

DATA gv_text TYPE string VALUE 'Orders 4500000012 and 4500000099 were sent to budi@example.co.id'.

* 1) FIND REGEX: position, length and number of matches
FIND REGEX '\\d{10}' IN gv_text MATCH OFFSET DATA(gv_position) MATCH LENGTH DATA(gv_length).
IF sy-subrc = 0.
  DATA(gv_order_no) = substring( val = gv_text off = gv_position len = gv_length ).
  WRITE: / 'First number  :', gv_order_no, '(position', gv_position, ')'.
ENDIF.
FIND ALL OCCURRENCES OF REGEX '\\d{10}' IN gv_text MATCH COUNT DATA(gv_count).
WRITE: / 'Number count  :', gv_count.

* 2) SUBMATCHES: the content of each pair of parentheses ( )
FIND REGEX '(\\w+)@([\\w.]+)' IN gv_text SUBMATCHES DATA(gv_user) DATA(gv_domain).
WRITE: / 'User          :', gv_user.
WRITE: / 'Domain        :', gv_domain.

* 3) REPLACE ... REGEX: $1 is the content of the first parentheses
DATA(gv_masked) = gv_text.
REPLACE ALL OCCURRENCES OF REGEX '\\d{6}(\\d{4})' IN gv_masked WITH '******$1'.
WRITE: / gv_masked.

* 4) Functions: matches( ) tests the WHOLE text, match( ) returns the matching part
DATA gt_codes TYPE STANDARD TABLE OF string WITH EMPTY KEY.
gt_codes = VALUE #( ( 'AB-123' ) ( 'ab-12' ) ( 'XYZ-999' ) ( 'QQ-007' ) ).
SKIP.
LOOP AT gt_codes INTO DATA(gv_code).
  IF matches( val = gv_code regex = '[A-Z]{2}-\\d{3}' ).
    WRITE: / gv_code, 12 'valid'.
  ELSE.
    WRITE: / gv_code, 12 'not valid'.
  ENDIF.
ENDLOOP.

DATA(gv_digits) = match( val = gv_text regex = '\\d+' ).
DATA(gv_clean)  = replace( val = 'A1B22C333' regex = '\\d+' with = '' occ = 0 ).
DATA(gv_words)  = count( val = gv_text regex = '[a-z]+' ).
SKIP.
WRITE: / 'First digits  :', gv_digits.
WRITE: / 'Without digits:', gv_clean.
WRITE: / 'Lower-case words:', gv_words.`,
    task: `<ul>
      <li>Ubah pola nomor order agar hanya cocok dengan nomor yang diawali <tt>45</tt>.</li>
      <li>Tambahkan kode <tt>ZZ-12A</tt> ke <tt>gt_codes</tt>. Perkirakan hasilnya dulu, baru jalankan.</li>
      <li>Tulis validasi kode pos (tepat lima digit) dengan <tt>matches( )</tt>.</li>
    </ul>`
  },
  {
    id: 'e02', level: 5,
    title: 'LOOP AT … GROUP BY',
    goal: 'Mengelompokkan baris internal table dan mengolah tiap kelompok, tanpa SORT dan AT NEW.',
    body: `
      <p>Di level Dasar subtotal dibuat dengan <tt>SORT</tt> ditambah <tt>AT NEW</tt> / <tt>AT END OF</tt>. Cara itu mengharuskan tabel diurutkan dan kolom kuncinya berada paling kiri. <tt>LOOP AT … GROUP BY</tt> tidak punya dua syarat itu: sistem sendiri yang mengumpulkan baris berkunci sama.</p>
      <ul>
        <li>Loop luar berjalan sekali untuk tiap <b>kelompok</b>, bukan untuk tiap baris. <tt>LOOP AT GROUP</tt> di dalamnya membaca anggota kelompok itu.</li>
        <li><tt>GROUP BY gs_order-ernam … INTO DATA(gv_sales)</tt>: variabel di belakang <tt>INTO</tt> (group binding) berisi nilai kuncinya.</li>
        <li>Kunci boleh berupa struktur: <tt>GROUP BY ( kunnr = … cnt = GROUP SIZE )</tt>. <tt>GROUP SIZE</tt> berisi jumlah anggota, <tt>GROUP INDEX</tt> nomor urut kelompoknya.</li>
        <li><tt>ASCENDING</tt> / <tt>DESCENDING</tt> mengurutkan kelompok menurut kuncinya. Tanpa itu kelompok muncul menurut kemunculan pertamanya di tabel.</li>
        <li>Tanpa <tt>INTO</tt> di belakang (representative binding), work area berisi baris pertama kelompok dan dipakai sebagai nama kelompoknya: <tt>LOOP AT GROUP gs_order</tt>.</li>
      </ul>
      <p>Tabel aslinya tidak berubah dan tidak perlu diurutkan lebih dulu.</p>`,
    code: `REPORT z_learn_group_by.

TYPES: BEGIN OF ty_order,
         vbeln TYPE vbak-vbeln,
         kunnr TYPE vbak-kunnr,
         ernam TYPE vbak-ernam,
         netwr TYPE vbak-netwr,
       END OF ty_order.
DATA: gt_order   TYPE STANDARD TABLE OF ty_order WITH EMPTY KEY,
      gs_member  TYPE ty_order,
      gv_total   TYPE vbak-netwr.

SELECT vbeln kunnr ernam netwr FROM vbak INTO TABLE gt_order.

* 1) One key, with a group binding: gv_sales holds the key value
WRITE: / 'Sales per salesperson'.
LOOP AT gt_order INTO DATA(gs_order) GROUP BY gs_order-ernam ASCENDING INTO DATA(gv_sales).
  CLEAR gv_total.
  LOOP AT GROUP gv_sales INTO gs_member.
    gv_total = gv_total + gs_member-netwr.
  ENDLOOP.
  WRITE: /3 gv_sales, 16 gv_total.
ENDLOOP.

* 2) A structured key, plus GROUP SIZE
SKIP.
WRITE: / 'Number of orders per customer'.
LOOP AT gt_order INTO gs_order
     GROUP BY ( kunnr = gs_order-kunnr cnt = GROUP SIZE )
     DESCENDING INTO DATA(gs_group).
  WRITE: /3 gs_group-kunnr, 16 gs_group-cnt.
ENDLOOP.

* 3) Without a trailing INTO: gs_order (the first row) represents its group
SKIP.
WRITE: / 'Largest order of each customer'.
LOOP AT gt_order INTO gs_order GROUP BY gs_order-kunnr.
  DATA(gs_max) = gs_order.
  LOOP AT GROUP gs_order INTO gs_member WHERE netwr > gs_max-netwr.
    gs_max = gs_member.
  ENDLOOP.
  WRITE: /3 gs_max-kunnr, 16 gs_max-vbeln, 30 gs_max-netwr.
ENDLOOP.`,
    task: `<ul>
      <li>Tambahkan field <tt>vkorg</tt> ke <tt>ty_order</tt>, lalu cetak jumlah order dan total nilainya per sales organization.</li>
      <li>Di bagian 2, tambahkan <tt>seq = GROUP INDEX</tt> ke kunci dan cetak nomornya.</li>
      <li>Ubah bagian 3 agar menampilkan order <b>terkecil</b> tiap pelanggan.</li>
    </ul>`
  },
  {
    id: 'e03', level: 5,
    title: 'FILTER, LET, FOR GROUPS, dan CORRESPONDING',
    goal: 'Mengolah internal table dengan ekspresi, tanpa loop dan variabel bantu.',
    body: `
      <p>Level Mahir mengenalkan <tt>VALUE</tt>, <tt>FOR</tt>, dan <tt>REDUCE</tt>. Empat alat berikut melengkapinya, sehingga pengolahan tabel bisa ditulis sebagai satu ekspresi.</p>
      <ul>
        <li><tt>FILTER #( tabel WHERE … )</tt> mengambil baris yang cocok. Syaratnya: tabel sumber berjenis <tt>SORTED</tt> atau <tt>HASHED</tt>, dan kondisi <tt>WHERE</tt> memakai kolom key-nya. Tambahan <tt>EXCEPT</tt> membalik hasilnya.</li>
        <li><tt>LET name = … IN</tt> membuat variabel bantu yang hanya hidup di dalam ekspresi itu — nilai yang dipakai berulang cukup dihitung sekali.</li>
        <li><tt>FOR GROUPS grp OF e IN tabel GROUP BY …</tt> adalah bentuk ekspresi dari <tt>LOOP AT … GROUP BY</tt>; <tt>FOR m IN GROUP grp</tt> membaca anggota kelompoknya.</li>
        <li><tt>CORRESPONDING tipe( sumber MAPPING baru = lama EXCEPT kolom )</tt> menyalin field bernama sama, memetakan nama yang berbeda, dan melewati kolom yang disebut.</li>
      </ul>
      <p>Ekspresi yang terlalu panjang sulit dibaca dan sulit di-debug. Bila satu ekspresi sudah melebihi beberapa baris, pecah menjadi langkah-langkah yang diberi nama.</p>`,
    code: `REPORT z_learn_table_expressions.

TYPES: BEGIN OF ty_emp,
         pernr  TYPE pa0001-pernr,
         ename  TYPE pa0001-ename,
         orgeh  TYPE pa0001-orgeh,
         salary TYPE pa0008-bet01,
       END OF ty_emp,
       tt_emp TYPE SORTED TABLE OF ty_emp WITH NON-UNIQUE KEY orgeh.
DATA gt_emp TYPE tt_emp.

SELECT a~pernr, a~ename, a~orgeh, b~bet01 AS salary
  FROM pa0001 AS a INNER JOIN pa0008 AS b ON b~pernr = a~pernr
  WHERE b~endda = '99991231'
  ORDER BY a~orgeh, a~pernr
  INTO TABLE @gt_emp.

* 1) FILTER: the rows matching the table key, without a LOOP
DATA(gt_sales) = FILTER #( gt_emp WHERE orgeh = '50000030' ).
WRITE: / 'Sales employees:', lines( gt_sales ).

* 2) LET: helper variables that live only inside one expression
DATA(gv_summary) = CONV string(
  LET cnt = lines( gt_emp )
      amt = REDUCE i( INIT s = 0 FOR e IN gt_emp NEXT s = s + e-salary )
  IN |{ cnt } employees, average salary { amt / cnt }| ).
WRITE: / gv_summary.

* 3) FOR GROUPS: summary per organizational unit in one expression
TYPES: BEGIN OF ty_summary,
         orgeh TYPE pa0001-orgeh,
         headcount TYPE i,
         total TYPE pa0008-bet01,
       END OF ty_summary,
       tt_summary TYPE STANDARD TABLE OF ty_summary WITH EMPTY KEY.
DATA(gt_summary) = VALUE tt_summary(
  FOR GROUPS grp OF e IN gt_emp GROUP BY e-orgeh ASCENDING
  ( orgeh = grp
    headcount = REDUCE i( INIT c = 0 FOR m IN GROUP grp NEXT c = c + 1 )
    total = REDUCE i( INIT s = 0 FOR m IN GROUP grp NEXT s = s + m-salary ) ) ).
SKIP.
LOOP AT gt_summary INTO DATA(gs_summary).
  WRITE: / gs_summary-orgeh, 12 gs_summary-headcount, 18 gs_summary-total.
ENDLOOP.

* 4) CORRESPONDING ... MAPPING ... EXCEPT: copy to a structure with other field names
TYPES: BEGIN OF ty_card,
         emp_no TYPE pa0001-pernr,
         name   TYPE pa0001-ename,
         salary TYPE pa0008-bet01,
       END OF ty_card.
DATA(gs_card) = CORRESPONDING ty_card( gt_emp[ 1 ] MAPPING emp_no = pernr name = ename EXCEPT salary ).
SKIP.
WRITE: / gs_card-emp_no, gs_card-name, gs_card-salary.`,
    task: `<ul>
      <li>Buat <tt>gt_non_sales</tt> dengan <tt>FILTER #( gt_emp EXCEPT WHERE orgeh = '50000030' )</tt> dan cetak jumlah barisnya.</li>
      <li>Tambahkan kolom <tt>average</tt> (rata-rata gaji) ke <tt>ty_summary</tt> dan isi di dalam ekspresi yang sama.</li>
      <li>Hapus <tt>EXCEPT salary</tt> di bagian 4, jalankan, dan lihat perubahan outputnya.</li>
    </ul>`
  },
  {
    id: 'e04', level: 5,
    title: 'SQL lanjutan: subquery, CASE, UNION',
    goal: 'Memindahkan pekerjaan ke database: menyaring dengan subquery, menghitung di daftar kolom, dan menggabung hasil.',
    body: `
      <p>Prinsipnya disebut <b>code pushdown</b>: makin banyak pekerjaan yang diselesaikan database, makin sedikit data yang dikirim ke program, dan makin cepat laporannya. Open SQL modern (pemisah koma, variabel program diawali <tt>@</tt>) menyediakan alatnya.</p>
      <ul>
        <li><b>Subquery</b>: <tt>WHERE kolom [NOT] IN ( SELECT … )</tt> membandingkan dengan hasil SELECT lain. <tt>EXISTS ( SELECT … )</tt> benar bila subquery menghasilkan minimal satu baris.</li>
        <li>Subquery <b>berkorelasi</b> merujuk baris query luar, misalnya <tt>WHERE kunrg = kna1~kunnr</tt> — subquery dinilai untuk tiap baris luar.</li>
        <li><tt>CASE WHEN … THEN … ELSE … END AS nama</tt> membuat kolom hasil berdasarkan kondisi.</li>
        <li>Perhitungan dan fungsi boleh ditulis langsung di daftar kolom: <tt>seatsmax - seatsocc AS free_seats</tt>, <tt>concat( carrid, connid )</tt>. Nama alias-nya dapat dipakai di <tt>ORDER BY</tt>.</li>
        <li><tt>UNION</tt> menggabung hasil dua SELECT yang susunan kolomnya sama dan membuang baris kembar; <tt>UNION ALL</tt> mempertahankan semuanya.</li>
      </ul>
      <p>Lihat baris <b>Database</b> di bawah output: lima SELECT, lima akses — dan tidak ada satu pun SELECT di dalam loop.</p>`,
    code: `REPORT z_learn_sql_advanced.

* 1) Subquery: orders that do NOT have a delivery yet
SELECT vbeln, kunnr, netwr FROM vbak
  WHERE vbeln NOT IN ( SELECT vgbel FROM lips )
  ORDER BY vbeln
  INTO TABLE @DATA(gt_open).
WRITE: / 'Orders without delivery:', lines( gt_open ).
LOOP AT gt_open INTO DATA(gs_open).
  WRITE: /3 gs_open-vbeln, 16 gs_open-netwr.
ENDLOOP.

* 2) EXISTS with a correlated subquery: customers that have been billed
SELECT kunnr, name1 FROM kna1
  WHERE EXISTS ( SELECT vbeln FROM vbrk WHERE kunrg = kna1~kunnr )
  ORDER BY kunnr
  INTO TABLE @DATA(gt_billed).
SKIP.
WRITE: / 'Customers already billed:', lines( gt_billed ).

* 3) CASE and calculations in the column list
SELECT vbeln, netwr,
       CASE WHEN netwr >= 20000000 THEN 'LARGE'
            WHEN netwr >= 10000000 THEN 'MEDIUM'
            ELSE 'SMALL' END AS tier
  FROM vbak
  ORDER BY netwr DESCENDING
  INTO TABLE @DATA(gt_tiers)
  UP TO 5 ROWS.
SKIP.
LOOP AT gt_tiers INTO DATA(gs_tier).
  WRITE: /3 gs_tier-vbeln, 16 gs_tier-netwr, 30 gs_tier-tier.
ENDLOOP.

SELECT carrid, connid, seatsmax - seatsocc AS free_seats,
       concat( carrid, connid ) AS code
  FROM sflight
  ORDER BY free_seats DESCENDING
  INTO TABLE @DATA(gt_seats)
  UP TO 3 ROWS.
SKIP.
LOOP AT gt_seats INTO DATA(gs_seats).
  WRITE: /3 gs_seats-code, 12 gs_seats-free_seats, 'free seats'.
ENDLOOP.

* 4) UNION: customers and vendors in one partner list
SELECT kunnr AS partner_no, name1, 'Customer' AS role FROM kna1
UNION
SELECT lifnr AS partner_no, name1, 'Vendor' AS role FROM lfa1
INTO TABLE @DATA(gt_partners).
SKIP.
WRITE: / 'Number of partners:', lines( gt_partners ).`,
    task: `<ul>
      <li>Balik pertanyaan 1: tampilkan order yang <b>sudah</b> punya delivery.</li>
      <li>Tambahkan kelas <tt>MICRO</tt> untuk order di bawah 5 juta.</li>
      <li>Ganti <tt>UNION</tt> dengan <tt>UNION ALL</tt>. Apakah jumlah mitranya berubah? Mengapa?</li>
    </ul>`
  },
  {
    id: 'e05', level: 5,
    title: 'Kinerja: membaca database dengan hemat',
    goal: 'Mengenali pola akses data yang lambat dan menggantinya dengan yang cepat.',
    body: `
      <p>Program ABAP yang lambat hampir selalu lambat karena cara membaca datanya, bukan karena perhitungannya. Setiap <tt>SELECT</tt> adalah perjalanan pulang-pergi ke server database: 10.000 baris di dalam loop berarti 10.000 perjalanan.</p>
      <ul>
        <li>Jangan menulis <tt>SELECT</tt> di dalam <tt>LOOP</tt>. Baca data pendukung sekali di luar loop, lalu cari di memori.</li>
        <li>Untuk pencarian berulang lewat key, simpan data di tabel <tt>HASHED</tt> (atau <tt>SORTED</tt>) dan baca dengan <tt>READ TABLE … WITH TABLE KEY</tt>. Pada tabel standard, <tt>WITH KEY</tt> memeriksa baris satu per satu.</li>
        <li>Bila hanya perlu menggabung dua tabel, <tt>JOIN</tt> menyelesaikannya dalam satu akses.</li>
        <li><tt>FOR ALL ENTRIES IN</tt> adalah jalan tengah bila JOIN tidak mungkin — pastikan dulu tabel pengendalinya tidak kosong.</li>
        <li>Ambil hanya yang dipakai: sebut nama kolomnya, beri <tt>WHERE</tt>, dan hindari <tt>SELECT *</tt> pada tabel yang lebar.</li>
        <li><tt>GET RUN TIME FIELD</tt> mengukur waktu dalam mikrodetik (di simulator angkanya tidak mewakili sistem nyata). Di SAP, transaksi <tt>SAT</tt> dan <tt>ST05</tt> menunjukkan di mana waktu terbuang.</li>
      </ul>
      <p>Simulator menghitung akses database tiap kali program dijalankan. Baris <b>Database</b> di bawah output menampilkan jumlahnya dan menandai <tt>SELECT</tt> yang dijalankan berulang di dalam loop.</p>`,
    code: `REPORT z_learn_performance.

TYPES: BEGIN OF ty_text,
         matnr TYPE makt-matnr,
         maktx TYPE makt-maktx,
       END OF ty_text.
DATA: gt_item     TYPE STANDARD TABLE OF vbap,
      gs_makt     TYPE makt,
      gt_texts    TYPE HASHED TABLE OF ty_text WITH UNIQUE KEY matnr,
      gv_t0       TYPE i,
      gv_t1       TYPE i,
      gv_duration TYPE i.

SELECT * FROM vbap INTO TABLE gt_item.

* THE SLOW WAY: one database access for every row
GET RUN TIME FIELD gv_t0.
LOOP AT gt_item INTO DATA(gs_item).
  SELECT SINGLE * FROM makt INTO gs_makt
    WHERE matnr = gs_item-matnr AND spras = 'EN'.
ENDLOOP.
GET RUN TIME FIELD gv_t1.
gv_duration = gv_t1 - gv_t0.
WRITE: / 'Way 1 - SELECT inside the LOOP :', lines( gt_item ), 'database accesses'.

* THE FAST WAY: read once, keep it in a HASHED table, look up by key
GET RUN TIME FIELD gv_t0.
SELECT matnr maktx FROM makt INTO TABLE gt_texts WHERE spras = 'EN'.
LOOP AT gt_item INTO gs_item.
  READ TABLE gt_texts INTO DATA(gs_text) WITH TABLE KEY matnr = gs_item-matnr.
ENDLOOP.
GET RUN TIME FIELD gv_t1.
gv_duration = gv_t1 - gv_t0.
WRITE: / 'Way 2 - read once + HASHED     : 1 database access'.

* THE BEST WAY when only a join is needed: let the database do the join
SELECT p~vbeln, p~posnr, t~maktx
  FROM vbap AS p INNER JOIN makt AS t ON t~matnr = p~matnr
  WHERE t~spras = 'EN'
  INTO TABLE @DATA(gt_joined).
WRITE: / 'Way 3 - JOIN                   : 1 database access,', lines( gt_joined ), 'rows'.

SKIP.
WRITE: / 'See the "Database" line below the output: accesses are counted, and'.
WRITE: / 'a SELECT repeated inside a loop is flagged.'.`,
    task: `<ul>
      <li>Jalankan dan baca baris <b>Database</b>: baris kode mana yang ditandai, dan berapa kali ia dijalankan?</li>
      <li>Hapus bagian <b>Way 1</b>, jalankan lagi, dan bandingkan jumlah akses databasenya.</li>
      <li>Tulis <b>Way 4</b> dengan <tt>FOR ALL ENTRIES IN gt_item</tt>.</li>
    </ul>`
  },
  {
    id: 'e06', level: 5,
    title: 'ABAP Unit: menguji kode secara otomatis',
    goal: 'Menulis test class yang membuktikan sebuah method bekerja benar — dan tetap benar setelah diubah.',
    body: `
      <p><b>Unit test</b> adalah kode yang memanggil kode Anda dan memeriksa hasilnya. Sekali ditulis, test bisa dijalankan kapan saja: setelah tiap perubahan Anda langsung tahu apakah ada yang rusak.</p>
      <ul>
        <li>Test class ditandai <tt>FOR TESTING</tt> pada <tt>CLASS … DEFINITION</tt>. Tambahan <tt>DURATION SHORT</tt> dan <tt>RISK LEVEL HARMLESS</tt> menyatakan test itu cepat dan tidak mengubah data.</li>
        <li>Tiap method <tt>FOR TESTING</tt> adalah satu test: tanpa parameter, dan sebaiknya menguji satu hal saja.</li>
        <li>Method khusus <tt>setup</tt> dijalankan sebelum <b>tiap</b> test, sehingga setiap test mulai dari objek yang baru. Pasangannya, <tt>teardown</tt>, berjalan sesudah tiap test.</li>
        <li><tt>cl_abap_unit_assert=>assert_equals( act = … exp = … msg = … )</tt> membandingkan hasil nyata dengan yang diharapkan. Ada juga <tt>assert_true</tt>, <tt>assert_false</tt>, <tt>assert_initial</tt>, <tt>assert_not_initial</tt>, <tt>assert_bound</tt>, <tt>assert_subrc</tt>, dan <tt>fail</tt>.</li>
        <li>Uji nilai batasnya: tepat di ambang (5.000.000), tepat di bawahnya (4.999.999), dan jauh di atasnya.</li>
      </ul>
      <p>Test class tidak ikut berjalan saat program di-Run. Di SAP test dijalankan dengan <tt>Ctrl+Shift+F10</tt>; di simulator lewat menu ⋯ → <b>Jalankan Unit Test</b>, dengan tombol yang sama.</p>`,
    code: `REPORT z_learn_unit_test.

* --- code under test ----------------------------------------------------
CLASS lcl_discount DEFINITION.
  PUBLIC SECTION.
    METHODS percent    IMPORTING iv_total TYPE i RETURNING VALUE(rv_percent) TYPE i.
    METHODS amount_due IMPORTING iv_total TYPE i RETURNING VALUE(rv_amount_due) TYPE i.
ENDCLASS.

CLASS lcl_discount IMPLEMENTATION.
  METHOD percent.
    rv_percent = COND #( WHEN iv_total >= 10000000 THEN 10
                        WHEN iv_total >= 5000000   THEN 5
                        ELSE 0 ).
  ENDMETHOD.
  METHOD amount_due.
    rv_amount_due = iv_total - iv_total * percent( iv_total ) / 100.
  ENDMETHOD.
ENDCLASS.

* --- test class: does not run when the program is executed ------------------
CLASS ltc_discount DEFINITION FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.
  PRIVATE SECTION.
    DATA mo_cut TYPE REF TO lcl_discount.          " cut = class under test
    METHODS setup.
    METHODS no_discount         FOR TESTING.
    METHODS threshold_5_percent FOR TESTING.
    METHODS large_discount      FOR TESTING.
    METHODS net_amount_due      FOR TESTING.
ENDCLASS.

CLASS ltc_discount IMPLEMENTATION.
  METHOD setup.
    mo_cut = NEW #( ).
  ENDMETHOD.
  METHOD no_discount.
    cl_abap_unit_assert=>assert_equals( act = mo_cut->percent( 4999999 ) exp = 0 ).
  ENDMETHOD.
  METHOD threshold_5_percent.
    cl_abap_unit_assert=>assert_equals( act = mo_cut->percent( 5000000 ) exp = 5
                                        msg = 'Exactly 5 million already gets 5 percent' ).
  ENDMETHOD.
  METHOD large_discount.
    cl_abap_unit_assert=>assert_equals( act = mo_cut->percent( 25000000 ) exp = 10 ).
  ENDMETHOD.
  METHOD net_amount_due.
    cl_abap_unit_assert=>assert_equals( act = mo_cut->amount_due( 10000000 ) exp = 9000000 ).
    cl_abap_unit_assert=>assert_equals( act = mo_cut->amount_due( 1000 ) exp = 1000 ).
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(go_discount) = NEW lcl_discount( ).
  DATA(gv_amount_due) = go_discount->amount_due( 12000000 ).
  WRITE: / 'Amount due for 12,000,000:', gv_amount_due.
  WRITE: / 'Tests do not run with Run. Open the three-dot menu and choose Run unit tests.'.`,
    task: `<ul>
      <li>Jalankan unit test-nya: keempat test harus lulus.</li>
      <li>Ubah <tt>&gt;= 5000000</tt> menjadi <tt>&gt; 5000000</tt> di method <tt>percent</tt>, jalankan test lagi, dan baca laporan kegagalannya.</li>
      <li>Tambahkan aturan diskon 15 persen untuk total mulai 50 juta — tulis test-nya dulu, baru kodenya.</li>
    </ul>`
  },
  {
    id: 'e07', level: 5,
    title: 'Pola desain: singleton dan factory',
    goal: 'Mengendalikan cara objek dibuat agar program mudah diubah.',
    body: `
      <p><b>Pola desain</b> adalah jawaban yang sudah teruji untuk masalah yang terus berulang. Dua pola yang paling sering muncul di kode SAP sama-sama mengatur satu hal: siapa yang boleh membuat objek, dan bagaimana caranya.</p>
      <ul>
        <li><b>Singleton</b>: class dengan <tt>CREATE PRIVATE</tt> tidak bisa dibuat dengan <tt>NEW</tt> dari luar. Satu-satunya jalan adalah method static (<tt>get_instance</tt>), yang menyimpan objeknya di <tt>CLASS-DATA</tt> dan selalu mengembalikan objek yang sama. Cocok untuk pengaturan, log, atau buffer yang harus tunggal.</li>
        <li><b>Factory</b>: sebuah method menerima "jenis" dan mengembalikan objek yang sesuai, bertipe interface. Pemanggil hanya mengenal interface-nya.</li>
        <li>Karena itu, menambah jenis baru — misalnya pengiriman laut — hanya menyentuh factory dan satu class baru. Program utama tidak berubah.</li>
        <li>Anda sudah memakai factory berkali-kali: <tt>cl_salv_table=>factory( )</tt>.</li>
      </ul>
      <p>Jangan berlebihan: singleton adalah data global yang tersamar dan menyulitkan unit test. Pakai hanya bila objeknya memang harus satu.</p>`,
    code: `REPORT z_learn_design_patterns.

* --- Singleton: there may be only ONE settings object -----------------------
CLASS lcl_settings DEFINITION CREATE PRIVATE.
  PUBLIC SECTION.
    CLASS-METHODS get_instance RETURNING VALUE(ro_instance) TYPE REF TO lcl_settings.
    DATA mv_currency TYPE string VALUE 'IDR'.
  PRIVATE SECTION.
    CLASS-DATA go_instance TYPE REF TO lcl_settings.
ENDCLASS.

CLASS lcl_settings IMPLEMENTATION.
  METHOD get_instance.
    IF go_instance IS NOT BOUND.
      go_instance = NEW #( ).
    ENDIF.
    ro_instance = go_instance.
  ENDMETHOD.
ENDCLASS.

* --- Factory: the caller asks for "a carrier", not for a specific class -------
INTERFACE lif_carrier.
  METHODS name   RETURNING VALUE(rv_name) TYPE string.
  METHODS cost IMPORTING iv_weight TYPE i RETURNING VALUE(rv_cost) TYPE i.
ENDINTERFACE.

CLASS lcl_land DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_carrier.
ENDCLASS.
CLASS lcl_land IMPLEMENTATION.
  METHOD lif_carrier~name.
    rv_name = 'Land'.
  ENDMETHOD.
  METHOD lif_carrier~cost.
    rv_cost = iv_weight * 2000.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_air DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_carrier.
ENDCLASS.
CLASS lcl_air IMPLEMENTATION.
  METHOD lif_carrier~name.
    rv_name = 'Air'.
  ENDMETHOD.
  METHOD lif_carrier~cost.
    rv_cost = iv_weight * 9000 + 25000.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_factory DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS create_carrier IMPORTING iv_kind TYPE string
                       RETURNING VALUE(ro_carrier) TYPE REF TO lif_carrier.
ENDCLASS.
CLASS lcl_factory IMPLEMENTATION.
  METHOD create_carrier.
    CASE iv_kind.
      WHEN 'AIR'.
        ro_carrier = NEW lcl_air( ).
      WHEN OTHERS.
        ro_carrier = NEW lcl_land( ).
    ENDCASE.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
* "ambil" is called twice, but there is one object: a change through go_a is visible through go_b
  DATA(go_a) = lcl_settings=>get_instance( ).
  DATA(go_b) = lcl_settings=>get_instance( ).
  go_a->mv_currency = 'USD'.
  WRITE: / 'Currency through go_b:', go_b->mv_currency.

* the main program never mentions lcl_darat / lcl_udara
  DATA gt_kinds TYPE STANDARD TABLE OF string WITH EMPTY KEY.
  gt_kinds = VALUE #( ( 'LAND' ) ( 'AIR' ) ).
  SKIP.
  LOOP AT gt_kinds INTO DATA(gv_kind).
    DATA(go_carrier) = lcl_factory=>create_carrier( gv_kind ).
    DATA(gv_name)    = go_carrier->name( ).
    DATA(gv_cost)    = go_carrier->cost( 10 ).
    WRITE: / gv_name, 10 gv_cost, 'for 10 kg'.
  ENDLOOP.`,
    task: `<ul>
      <li>Tambahkan <tt>lcl_sea</tt> (ongkos = berat × 1.200 + 50.000) dan daftarkan di factory dengan jenis <tt>SEA</tt>.</li>
      <li>Tulis <tt>DATA(go_x) = NEW lcl_settings( ).</tt> di program utama dan baca pesan error-nya.</li>
      <li>Tambahkan method <tt>days</tt> ke interface, yang mengembalikan lama pengiriman tiap jenis.</li>
    </ul>`
  },
  {
    id: 'e08', level: 5,
    title: 'Pemrograman generik: RTTS dan SQL dinamis',
    goal: 'Menulis satu program yang bekerja untuk tabel apa pun yang namanya baru diketahui saat program berjalan.',
    body: `
      <p>Di level Mahir Anda mengenal data reference dan <tt>ASSIGN COMPONENT</tt>. Pelajaran ini menggabungkannya dengan <b>RTTS</b> (Run Time Type Services) — kumpulan class yang menjelaskan tipe data saat program berjalan — untuk membuat penampil tabel serba guna, mirip transaksi SE16.</p>
      <ul>
        <li><tt>cl_abap_typedescr=>describe_by_name( nama )</tt> mengembalikan objek deskripsi tipe. Untuk struktur dan tabel database hasilnya di-<tt>CAST</tt> ke <tt>cl_abap_structdescr</tt>.</li>
        <li>Atribut <tt>components</tt> berisi daftar kolom: <tt>name</tt>, <tt>type_kind</tt> (C teks, N teks numerik, D tanggal, P packed, I integer), <tt>length</tt>, dan <tt>decimals</tt>.</li>
        <li><tt>CREATE DATA ref TYPE STANDARD TABLE OF (nama)</tt> membuat internal table yang bentuknya baru ditentukan saat program berjalan; <tt>ASSIGN ref-&gt;* TO &lt;fs&gt;</tt> membuatnya bisa dipakai.</li>
        <li>Nama dalam kurung juga berlaku di Open SQL: <tt>FROM (p_table)</tt>, bahkan <tt>WHERE (gv_condition)</tt> dengan kondisi berupa teks.</li>
        <li><tt>describe_by_data( variabel )</tt> melakukan hal yang sama untuk variabel yang sudah ada.</li>
      </ul>
      <p>Kode generik tidak diperiksa compiler: nama tabel yang salah baru ketahuan saat program berjalan. Dan jangan pernah menyusun <tt>WHERE</tt> dinamis langsung dari input pengguna tanpa memeriksanya — di situlah celah SQL injection.</p>`,
    code: `REPORT z_learn_generic.

PARAMETERS: p_table TYPE string DEFAULT 'SCARR',
            p_rows TYPE i DEFAULT 2.

DATA: gr_data         TYPE REF TO data,
      gv_column_count TYPE i.
FIELD-SYMBOLS: <gt_data>  TYPE STANDARD TABLE,
               <gs_row>   TYPE any,
               <gv_value> TYPE any.

START-OF-SELECTION.
* 1) RTTS: the shape of the table is found out at runtime
  DATA(go_struct) = CAST cl_abap_structdescr( cl_abap_typedescr=>describe_by_name( p_table ) ).
  gv_column_count = lines( go_struct->components ).
  WRITE: / 'Table', p_table, 'has', gv_column_count, 'columns'.

* 2) The internal table is created for that name, then filled by a dynamic SELECT
  CREATE DATA gr_data TYPE STANDARD TABLE OF (p_table).
  ASSIGN gr_data->* TO <gt_data>.
  SELECT * FROM (p_table) INTO TABLE <gt_data> UP TO p_rows ROWS.

* 3) Every column is printed without knowing a single name
  LOOP AT <gt_data> ASSIGNING <gs_row>.
    SKIP.
    LOOP AT go_struct->components INTO DATA(gs_column).
      ASSIGN COMPONENT gs_column-name OF STRUCTURE <gs_row> TO <gv_value>.
      IF sy-subrc = 0.
        WRITE: / gs_column-name, 14 gs_column-type_kind, 18 <gv_value>.
      ENDIF.
    ENDLOOP.
  ENDLOOP.`,
    task: `<ul>
      <li>Jalankan lewat <b>Parameter (F8)</b> dengan tabel <tt>SFLIGHT</tt>, lalu <tt>KNA1</tt>, lalu nama yang tidak ada.</li>
      <li>Tambahkan parameter <tt>p_where TYPE string</tt> dan pakai sebagai <tt>WHERE (p_where)</tt>; coba dengan <tt>CARRID = 'GA'</tt>.</li>
      <li>Cetak juga <tt>length</tt> tiap kolom di samping <tt>type_kind</tt>.</li>
    </ul>`
  },
  {
    id: 'e09', level: 5,
    title: 'Transaksi yang aman: otorisasi, lock, dan COMMIT',
    goal: 'Mengubah data dengan benar: periksa hak, kunci dokumen, lalu simpan semuanya atau tidak sama sekali.',
    body: `
      <p>Membaca data itu aman; mengubahnya tidak. Program yang mengubah data di sistem produktif harus menjawab empat pertanyaan: bolehkah pengguna ini? Apakah orang lain sedang mengubah dokumen yang sama? Bagaimana bila gagal di tengah jalan? Dari mana nomor dokumen barunya?</p>
      <ul>
        <li><tt>AUTHORITY-CHECK OBJECT … ID … FIELD …</tt> memeriksa otorisasi pengguna; <tt>sy-subrc = 0</tt> berarti boleh. Pemeriksaan ini tidak otomatis — program yang lupa memanggilnya membiarkan semua orang masuk.</li>
        <li>Lock object (dibuat di SE11) menghasilkan dua function module: <tt>ENQUEUE_…</tt> untuk mengunci dan <tt>DEQUEUE_…</tt> untuk melepas. Exception <tt>FOREIGN_LOCK</tt> berarti dokumen sedang dikunci orang lain; namanya ada di <tt>sy-msgv1</tt>.</li>
        <li>Kunci SAP bersifat <b>logis</b>: ia hanya berlaku bagi program yang ikut memanggil <tt>ENQUEUE</tt>. Database sendiri tidak menghalangi apa pun.</li>
        <li>Semua perubahan sejak <tt>COMMIT WORK</tt> terakhir membentuk satu unit kerja (LUW). <tt>COMMIT WORK</tt> menyimpannya permanen, <tt>ROLLBACK WORK</tt> membatalkan semuanya.</li>
        <li><tt>NUMBER_GET_NEXT</tt> mengambil nomor berikutnya dari number range (transaksi SNRO) — jangan menghitung sendiri dengan <tt>MAX( ) + 1</tt>.</li>
        <li>BAPI tidak melempar exception. Hasilnya dilaporkan lewat parameter <tt>RETURN</tt>: periksa field <tt>type</tt> (<tt>E</tt> atau <tt>A</tt> berarti gagal). BAPI juga tidak pernah commit sendiri — panggil <tt>BAPI_TRANSACTION_COMMIT</tt> sesudahnya.</li>
      </ul>
      <p>Di simulator, order <tt>0000000012</tt> sedang dikunci pengguna BUDI, dan otorisasi menghapus (<tt>ACTVT</tt> 06) ditolak — pakai keduanya untuk mencoba jalur gagal.</p>`,
    code: `REPORT z_learn_transactions.

PARAMETERS: p_vbeln    TYPE vbak-vbeln DEFAULT '0000000010',
            p_increase TYPE i DEFAULT 10.              " increase of the value in percent

DATA: gv_old_value TYPE vbak-netwr,
      gv_new_value TYPE vbak-netwr,
      gv_change_no TYPE n LENGTH 10,
      gs_mat       TYPE bapimatdoa,
      gs_ret       TYPE bapireturn.

START-OF-SELECTION.
* 1) Authorization: may this user change (ACTVT 02) orders?
  AUTHORITY-CHECK OBJECT 'V_VBAK_AAT' ID 'AUART' FIELD 'TA' ID 'ACTVT' FIELD '02'.
  IF sy-subrc <> 0.
    MESSAGE 'No authorization to change orders' TYPE 'E'.
  ENDIF.

* 2) Lock the document, so that two people cannot change it at the same time
  CALL FUNCTION 'ENQUEUE_EVVBAKE'
    EXPORTING
      vbeln          = p_vbeln
    EXCEPTIONS
      foreign_lock   = 1
      system_failure = 2
      OTHERS         = 3.
  IF sy-subrc <> 0.
    WRITE: / 'Order', p_vbeln, 'is being edited by', sy-msgv1, '- try again later.'.
    RETURN.
  ENDIF.

* 3) Change the data. All changes become permanent only after COMMIT WORK.
  SELECT SINGLE netwr FROM vbak INTO gv_old_value WHERE vbeln = p_vbeln.
  IF sy-subrc = 0.
    gv_new_value = gv_old_value * ( 100 + p_increase ) / 100.
    UPDATE vbak SET netwr = gv_new_value WHERE vbeln = p_vbeln.
    CALL FUNCTION 'NUMBER_GET_NEXT'
      EXPORTING
        nr_range_nr = '01'
        object      = 'ZCHANGE'
      IMPORTING
        number      = gv_change_no.
    COMMIT WORK.
    WRITE: / 'Old value :', gv_old_value.
    WRITE: / 'New value :', gv_new_value.
    WRITE: / 'Change number:', gv_change_no.
  ELSE.
    ROLLBACK WORK.
    WRITE: / 'Order', p_vbeln, 'does not exist - nothing was changed.'.
  ENDIF.

* 4) Release the lock - always, whatever the outcome
  CALL FUNCTION 'DEQUEUE_EVVBAKE'
    EXPORTING
      vbeln = p_vbeln.

* 5) A BAPI reports problems through the RETURN parameter, not through an exception
  CALL FUNCTION 'BAPI_MATERIAL_GET_DETAIL'
    EXPORTING
      material              = '9999-999'
    IMPORTING
      material_general_data = gs_mat
      return                = gs_ret.
  SKIP.
  IF gs_ret-type = 'E'.
    WRITE: / 'The BAPI returned an error:', gs_ret-message.
  ENDIF.`,
    task: `<ul>
      <li>Jalankan lewat <b>Parameter (F8)</b> dengan order <tt>0000000012</tt> dan baca pesan kuncinya.</li>
      <li>Ganti <tt>ACTVT</tt> menjadi <tt>06</tt> dan jalankan lagi.</li>
      <li>Ganti <tt>COMMIT WORK</tt> dengan <tt>ROLLBACK WORK</tt>, lalu tambahkan <tt>SELECT SINGLE</tt> di akhir program untuk membuktikan nilainya kembali ke semula.</li>
    </ul>`
  },
  {
    id: 'e10', level: 5,
    title: 'Studi kasus: laporan order-to-cash',
    goal: 'Menggabungkan teknik level Pakar dalam satu laporan lintas dokumen.',
    body: `
      <p><b>Order-to-cash</b> adalah alur penjualan di SAP: sales order (VBAK/VBAP) → delivery (LIKP/LIPS) → billing (VBRK/VBRP). Dokumen-dokumen itu saling merujuk: <tt>LIPS-VGBEL</tt> dan <tt>VBRP-AUBEL</tt> berisi nomor order asalnya. Laporan ini menjawab pertanyaan sehari-hari bagian penjualan: order mana yang sudah dikirim, dan mana yang sudah ditagih?</p>
      <ul>
        <li><b>Tiga SELECT, tidak satu pun di dalam loop</b>: order beserta nama pelanggan lewat <tt>JOIN</tt>; nilai tagihan dan jumlah item terkirim dihitung database dengan <tt>SUM</tt> / <tt>COUNT</tt> dan <tt>GROUP BY</tt>.</li>
        <li><b>Pencarian di memori</b>: <tt>VALUE #( tabel[ … ]-kolom OPTIONAL )</tt> membaca satu nilai dan mengembalikan nilai awal bila barisnya tidak ada — tanpa exception.</li>
        <li><b>Status dengan COND</b>: urutan <tt>WHEN</tt> menentukan, karena kondisi pertama yang benar itulah yang dipakai.</li>
        <li><b>Ringkasan dengan GROUP BY</b>: jumlah dan nilai order per status.</li>
        <li><b>Class dengan tanggung jawab terpisah</b>: <tt>fetch_data</tt>, <tt>summarize</tt>, <tt>show</tt>.</li>
      </ul>
      <p>Buka menu <b>Tabel</b> untuk melihat isi LIKP, LIPS, VBRK, dan VBRP, lalu cocokkan satu order dengan barisnya di laporan.</p>`,
    code: `REPORT z_case_order_to_cash.

PARAMETERS p_vkorg TYPE vbak-vkorg DEFAULT '1000'.

CLASS lcl_o2c DEFINITION.
  PUBLIC SECTION.
    TYPES: BEGIN OF ty_row,
             vbeln     TYPE vbak-vbeln,
             name1     TYPE kna1-name1,
             netwr     TYPE vbak-netwr,
             delivered TYPE i,
             billed    TYPE vbak-netwr,
             status    TYPE string,
           END OF ty_row,
           tt_rows TYPE STANDARD TABLE OF ty_row WITH EMPTY KEY.
    METHODS constructor IMPORTING iv_vkorg TYPE vbak-vkorg.
    METHODS fetch_data.
    METHODS summarize.
    METHODS show.
  PRIVATE SECTION.
    DATA: mv_vkorg TYPE vbak-vkorg,
          mt_data  TYPE tt_rows.
ENDCLASS.

CLASS lcl_o2c IMPLEMENTATION.
  METHOD constructor.
    mv_vkorg = iv_vkorg.
  ENDMETHOD.

  METHOD fetch_data.
*   orders + customer name: one SELECT with a JOIN
    SELECT a~vbeln, k~name1, a~netwr
      FROM vbak AS a INNER JOIN kna1 AS k ON k~kunnr = a~kunnr
      WHERE a~vkorg = @mv_vkorg
      ORDER BY a~vbeln
      INTO CORRESPONDING FIELDS OF TABLE @mt_data.
    IF mt_data IS INITIAL.
      RETURN.
    ENDIF.

*   billed value and number of delivered items: calculated by the database, read ONCE
    SELECT aubel, SUM( netwr ) AS amount FROM vbrp
      GROUP BY aubel
      INTO TABLE @DATA(lt_billed).
    SELECT vgbel, COUNT( * ) AS cnt FROM lips
      GROUP BY vgbel
      INTO TABLE @DATA(lt_delivered).

    LOOP AT mt_data ASSIGNING FIELD-SYMBOL(<ls_row>).
      <ls_row>-billed = VALUE #( lt_billed[ aubel = <ls_row>-vbeln ]-amount OPTIONAL ).
      <ls_row>-delivered = VALUE #( lt_delivered[ vgbel = <ls_row>-vbeln ]-cnt OPTIONAL ).
      <ls_row>-status = COND #(
        WHEN <ls_row>-billed >= <ls_row>-netwr      THEN 'FULLY BILLED'
        WHEN <ls_row>-billed > 0                    THEN 'PARTLY BILLED'
        WHEN <ls_row>-delivered > 0                 THEN 'DELIVERED'
        ELSE 'OPEN' ).
    ENDLOOP.
  ENDMETHOD.

  METHOD summarize.
    DATA lv_amount TYPE vbak-netwr.
    LOOP AT mt_data INTO DATA(ls_row)
         GROUP BY ( status = ls_row-status cnt = GROUP SIZE )
         ASCENDING INTO DATA(ls_group).
      CLEAR lv_amount.
      LOOP AT GROUP ls_group INTO DATA(ls_member).
        lv_amount = lv_amount + ls_member-netwr.
      ENDLOOP.
      WRITE: / ls_group-status, 20 ls_group-cnt, 'orders', 34 lv_amount.
    ENDLOOP.
  ENDMETHOD.

  METHOD show.
    DATA lo_alv TYPE REF TO cl_salv_table.
    TRY.
        cl_salv_table=>factory( IMPORTING r_salv_table = lo_alv
                                CHANGING  t_table      = mt_data ).
        lo_alv->get_columns( )->set_optimize( ).
        lo_alv->get_display_settings( )->set_list_header( 'Order to cash' ).
        lo_alv->display( ).
      CATCH cx_salv_msg INTO DATA(lx_salv).
        MESSAGE lx_salv->get_text( ) TYPE 'I'.
    ENDTRY.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(go_report) = NEW lcl_o2c( p_vkorg ).
  go_report->fetch_data( ).
  go_report->summarize( ).
  go_report->show( ).`,
    task: `<ul>
      <li>Tambahkan kolom <tt>remaining</tt>: nilai order dikurangi nilai yang sudah ditagih.</li>
      <li>Tambahkan parameter yang menyaring laporan menurut status.</li>
      <li>Pindahkan aturan status ke method tersendiri yang menerima <tt>netwr</tt>, <tt>billed</tt>, <tt>delivered</tt>, lalu tulis test class untuknya.</li>
      <li>Ganti pencarian <tt>lt_billed[ … ]</tt> dengan tabel <tt>HASHED</tt> ber-key <tt>aubel</tt>.</li>
    </ul>`
  }
];

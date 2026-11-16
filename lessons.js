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
    code: `REPORT z_belajar_halo.

* Komentar satu baris penuh: tanda bintang di KOLOM PERTAMA
WRITE 'Halo, dunia ABAP!'.          " komentar di akhir baris pakai tanda kutip ganda

* Tanda / berarti pindah ke baris baru
WRITE / 'Setiap statement diakhiri dengan titik.'.

* Statement berantai: titik dua setelah keyword, lalu dipisah koma
WRITE: / 'Belajar', 'ABAP', 'itu', 'menyenangkan.'.

SKIP.                               " satu baris kosong
ULINE.                              " garis horizontal
WRITE / 'Program selesai.'.`,
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
    code: `REPORT z_belajar_variabel.

DATA: lv_nama     TYPE string VALUE 'Budi Santoso',
      lv_umur     TYPE i VALUE 25,
      lv_gaji     TYPE p DECIMALS 2 VALUE '7500000.50',
      lv_kode(4)  TYPE c VALUE 'A001',
      lv_nik      TYPE n LENGTH 6 VALUE '000123',
      lv_tanggal  TYPE d,
      lv_aktif    TYPE abap_bool VALUE abap_true.

CONSTANTS gc_perusahaan TYPE string VALUE 'PT Maju Bersama'.

lv_tanggal = sy-datum.              " tanggal sistem, format YYYYMMDD
lv_umur    = lv_umur + 1.

WRITE: / 'Perusahaan :', gc_perusahaan.
WRITE: / 'Nama       :', lv_nama.
WRITE: / 'Umur       :', lv_umur.
WRITE: / 'Gaji       :', lv_gaji.
WRITE: / 'Kode / NIK :', lv_kode, lv_nik.
WRITE: / 'Tanggal    :', lv_tanggal.
WRITE: / 'Aktif      :', lv_aktif.

CLEAR lv_umur.
WRITE: / 'Setelah CLEAR, umur =', lv_umur.`,
    task: `<ul>
      <li>Tambahkan variabel <tt>lv_kota</tt> bertipe <tt>string</tt> dan cetak nilainya.</li>
      <li>Coba ubah nilai konstanta: <tt>gc_perusahaan = 'Lain'.</tt> Jalankan dan baca pesan error-nya.</li>
      <li>Isi <tt>lv_kode</tt> dengan teks yang lebih panjang dari 4 karakter (<tt>lv_kode = 'ABCDEFG'.</tt>) dan lihat apa yang tersimpan.</li>
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
    code: `REPORT z_belajar_hitung.

DATA: lv_a     TYPE i VALUE 17,
      lv_b     TYPE i VALUE 5,
      lv_hasil TYPE i,
      lv_bagi  TYPE p DECIMALS 2.

lv_hasil = lv_a + lv_b.        WRITE: / '17 + 5        =', lv_hasil.
lv_hasil = lv_a - lv_b.        WRITE: / '17 - 5        =', lv_hasil.
lv_hasil = lv_a * lv_b.        WRITE: / '17 * 5        =', lv_hasil.
lv_bagi  = lv_a / lv_b.        WRITE: / '17 / 5        =', lv_bagi.
lv_hasil = lv_a / lv_b.        WRITE: / '17 / 5 (ke i) =', lv_hasil, '<- dibulatkan'.
lv_hasil = lv_a DIV lv_b.      WRITE: / '17 DIV 5      =', lv_hasil.
lv_hasil = lv_a MOD lv_b.      WRITE: / '17 MOD 5      =', lv_hasil.

* Urutan pengerjaan dan tanda kurung
lv_hasil = lv_a + lv_b * 2.    WRITE: / '17 + 5 * 2    =', lv_hasil.
lv_hasil = ( lv_a + lv_b ) * 2. WRITE: / '( 17 + 5 ) * 2 =', lv_hasil.

* Bentuk statement lama
ADD 10 TO lv_hasil.            WRITE: / 'ADD 10        =', lv_hasil.
SUBTRACT 4 FROM lv_hasil.      WRITE: / 'SUBTRACT 4    =', lv_hasil.
MULTIPLY lv_hasil BY 2.        WRITE: / 'MULTIPLY BY 2 =', lv_hasil.
DIVIDE lv_hasil BY 4.          WRITE: / 'DIVIDE BY 4   =', lv_hasil.`,
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
    code: `REPORT z_belajar_if.

DATA: lv_nilai TYPE i VALUE 78,
      lv_grade TYPE c LENGTH 1,
      lv_hari  TYPE i VALUE 6,
      lv_nama  TYPE string.

IF lv_nilai >= 85.
  lv_grade = 'A'.
ELSEIF lv_nilai >= 70.
  lv_grade = 'B'.
ELSEIF lv_nilai >= 55.
  lv_grade = 'C'.
ELSE.
  lv_grade = 'D'.
ENDIF.
WRITE: / 'Nilai', lv_nilai, '-> grade', lv_grade.

IF lv_nilai BETWEEN 55 AND 100 AND lv_grade <> 'D'.
  WRITE / 'Status: LULUS'.
ENDIF.

IF lv_nama IS INITIAL.
  WRITE / 'Nama belum diisi.'.
ENDIF.

IF NOT ( lv_hari = 6 OR lv_hari = 7 ).
  WRITE / 'Hari kerja.'.
ELSE.
  WRITE / 'Akhir pekan.'.
ENDIF.

CASE lv_hari.
  WHEN 1.
    WRITE / 'Senin'.
  WHEN 2 OR 3 OR 4.
    WRITE / 'Tengah minggu'.
  WHEN 5.
    WRITE / 'Jumat'.
  WHEN 6 OR 7.
    WRITE / 'Sabtu atau Minggu'.
  WHEN OTHERS.
    WRITE / 'Nomor hari tidak valid'.
ENDCASE.`,
    task: `<ul>
      <li>Ubah <tt>lv_nilai</tt> menjadi 90, 60, dan 40. Cek grade-nya.</li>
      <li>Tambahkan variabel <tt>lv_umur</tt> dan cetak "Anak", "Remaja", atau "Dewasa" berdasarkan rentang umur.</li>
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
    code: `REPORT z_belajar_loop.

DATA: lv_angka TYPE i VALUE 1,
      lv_i     TYPE i,
      lv_total TYPE i.

* 1) Jumlah putaran pasti
DO 5 TIMES.
  lv_total = lv_total + sy-index.
  WRITE: / 'Putaran', sy-index, '| total sementara', lv_total.
ENDDO.

* 2) Selama kondisi benar
WHILE lv_angka <= 50.
  lv_angka = lv_angka * 2.
ENDWHILE.
WRITE: / 'Kelipatan 2 pertama di atas 50:', lv_angka.

* 3) Loop tanpa batas + EXIT / CONTINUE: cetak bilangan ganjil di bawah 10
ULINE.
DO.
  lv_i = lv_i + 1.
  IF lv_i > 9.
    EXIT.
  ENDIF.
  IF lv_i MOD 2 = 0.
    CONTINUE.
  ENDIF.
  WRITE: / 'Ganjil:', lv_i.
ENDDO.

* 4) CHECK: hanya kelipatan 3 yang lolos
ULINE.
DO 10 TIMES.
  CHECK sy-index MOD 3 = 0.
  WRITE: / 'Kelipatan 3:', sy-index.
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
        <li>Potong: <tt>SPLIT teks AT ';' INTO a b c.</tt> dan akses sebagian <tt>teks+offset(panjang)</tt> — misalnya <tt>lv_tgl+0(4)</tt> mengambil tahun.</li>
        <li>Ubah: <tt>TRANSLATE … TO UPPER CASE</tt>, <tt>CONDENSE</tt> (rapikan spasi), <tt>REPLACE ALL OCCURRENCES OF … IN … WITH …</tt>.</li>
        <li>Cari: <tt>FIND 'kata' IN teks MATCH OFFSET posisi.</tt> lalu periksa <tt>sy-subrc</tt> (0 = ketemu). Operator <tt>CS</tt> berarti "mengandung".</li>
        <li><tt>strlen( teks )</tt> mengembalikan panjang teks.</li>
      </ul>`,
    code: `REPORT z_belajar_string.

DATA: lv_depan    TYPE string VALUE 'Siti',
      lv_belakang TYPE string VALUE 'Rahayu',
      lv_lengkap  TYPE string,
      lv_teks     TYPE string VALUE '   belajar   abap   itu   seru   ',
      lv_csv      TYPE string VALUE 'Jakarta;Bandung;Surabaya',
      lv_kota1    TYPE string,
      lv_kota2    TYPE string,
      lv_kota3    TYPE string,
      lv_tgl      TYPE d VALUE '20250817',
      lv_len      TYPE i,
      lv_pos      TYPE i.

* Menggabung dengan tiga cara
CONCATENATE lv_depan lv_belakang INTO lv_lengkap SEPARATED BY space.
WRITE: / 'CONCATENATE :', lv_lengkap.
lv_lengkap = lv_depan && ' ' && lv_belakang.
WRITE: / 'Operator && :', lv_lengkap.
lv_lengkap = |{ lv_depan } { lv_belakang } ({ strlen( lv_depan ) } huruf di nama depan)|.
WRITE: / 'Template    :', lv_lengkap.

* Panjang, huruf besar, merapikan spasi
lv_len = strlen( lv_teks ).
WRITE: / 'Panjang awal:', lv_len.
CONDENSE lv_teks.
WRITE: / 'CONDENSE    :', lv_teks.
TRANSLATE lv_teks TO UPPER CASE.
WRITE: / 'UPPER CASE  :', lv_teks.

* Mengganti dan mencari
REPLACE ALL OCCURRENCES OF 'SERU' IN lv_teks WITH 'MUDAH'.
WRITE: / 'REPLACE     :', lv_teks.
FIND 'ABAP' IN lv_teks MATCH OFFSET lv_pos.
IF sy-subrc = 0.
  WRITE: / 'Kata ABAP ada di offset', lv_pos.
ENDIF.
IF lv_teks CS 'mudah'.
  WRITE / 'Teks mengandung kata MUDAH (CS tidak membedakan huruf besar/kecil).'.
ENDIF.

* Memecah dan mengambil sebagian
SPLIT lv_csv AT ';' INTO lv_kota1 lv_kota2 lv_kota3.
WRITE: / 'SPLIT       :', lv_kota1, '|', lv_kota2, '|', lv_kota3.
WRITE: / 'Tanggal     :', lv_tgl+6(2), '-', lv_tgl+4(2), '-', lv_tgl+0(4).`,
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
        <li>Komponen diakses dengan tanda hubung: <tt>ls_karyawan-nama</tt>.</li>
        <li>Menyalin struktur berarti menyalin <b>semua</b> komponennya; salinan tidak terhubung ke aslinya.</li>
        <li>Struktur boleh berisi struktur lain: <tt>ls_kantor-alamat-kota</tt>.</li>
        <li><tt>MOVE-CORRESPONDING a TO b.</tt> menyalin hanya komponen yang namanya sama.</li>
      </ul>
      <p>Kebiasaan penamaan: <tt>ty_</tt> tipe, <tt>ls_</tt>/<tt>gs_</tt> struktur (work area), <tt>lt_</tt>/<tt>gt_</tt> internal table.</p>`,
    code: `REPORT z_belajar_struktur.

TYPES: BEGIN OF ty_karyawan,
         nik    TYPE n LENGTH 6,
         nama   TYPE string,
         divisi TYPE c LENGTH 10,
         gaji   TYPE i,
       END OF ty_karyawan.

TYPES: BEGIN OF ty_alamat,
         kota    TYPE string,
         kodepos TYPE n LENGTH 5,
       END OF ty_alamat.

TYPES: BEGIN OF ty_kontak,
         nama TYPE string,
         kota TYPE string,
       END OF ty_kontak.

DATA: ls_karyawan TYPE ty_karyawan,
      ls_salinan  TYPE ty_karyawan,
      ls_kontak   TYPE ty_kontak.

* Struktur bersarang yang langsung dideklarasikan sebagai variabel
DATA: BEGIN OF ls_kantor,
        nama   TYPE string,
        alamat TYPE ty_alamat,
      END OF ls_kantor.

ls_karyawan-nik    = '000101'.
ls_karyawan-nama   = 'Rudi Hartono'.
ls_karyawan-divisi = 'IT'.
ls_karyawan-gaji   = 9500000.

ls_salinan = ls_karyawan.             " semua komponen ikut tersalin
ls_salinan-nama = 'Dewi Lestari'.     " aslinya tidak berubah

WRITE: / 'Asli    :', ls_karyawan-nik, ls_karyawan-nama, ls_karyawan-divisi, ls_karyawan-gaji.
WRITE: / 'Salinan :', ls_salinan-nik, ls_salinan-nama, ls_salinan-divisi, ls_salinan-gaji.

ls_kantor-nama           = 'Kantor Pusat'.
ls_kantor-alamat-kota    = 'Jakarta'.
ls_kantor-alamat-kodepos = '10220'.
WRITE: / ls_kantor-nama, '-', ls_kantor-alamat-kota, ls_kantor-alamat-kodepos.

MOVE-CORRESPONDING ls_karyawan TO ls_kontak.   " hanya komponen NAMA yang cocok
WRITE: / 'Kontak  :', ls_kontak-nama, '| kota:', ls_kontak-kota.

CLEAR ls_karyawan.
IF ls_karyawan IS INITIAL.
  WRITE / 'Setelah CLEAR semua komponen kembali kosong.'.
ENDIF.`,
    task: `<ul>
      <li>Tambahkan komponen <tt>email</tt> ke <tt>ty_karyawan</tt> lalu isi dan cetak.</li>
      <li>Coba isi komponen yang tidak ada (<tt>ls_karyawan-alamat = 'x'.</tt>) dan baca pesan error-nya.</li>
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
    code: `REPORT z_belajar_itab.

TYPES: BEGIN OF ty_produk,
         kode  TYPE c LENGTH 5,
         nama  TYPE string,
         harga TYPE i,
         stok  TYPE i,
       END OF ty_produk.

DATA: gt_produk TYPE STANDARD TABLE OF ty_produk,   " internal table
      gs_produk TYPE ty_produk,                     " work area (satu baris)
      gv_jumlah TYPE i,
      gv_nilai  TYPE i.

gs_produk-kode = 'P001'. gs_produk-nama = 'Keyboard'. gs_produk-harga = 350000.  gs_produk-stok = 12.
APPEND gs_produk TO gt_produk.
gs_produk-kode = 'P002'. gs_produk-nama = 'Mouse'.    gs_produk-harga = 150000.  gs_produk-stok = 40.
APPEND gs_produk TO gt_produk.
gs_produk-kode = 'P003'. gs_produk-nama = 'Monitor'.  gs_produk-harga = 2500000. gs_produk-stok = 5.
APPEND gs_produk TO gt_produk.
gs_produk-kode = 'P004'. gs_produk-nama = 'Webcam'.   gs_produk-harga = 600000.  gs_produk-stok = 0.
APPEND gs_produk TO gt_produk.

gv_jumlah = lines( gt_produk ).
WRITE: / 'Jumlah produk:', gv_jumlah.
ULINE.

LOOP AT gt_produk INTO gs_produk.
  gv_nilai = gv_nilai + gs_produk-harga * gs_produk-stok.
  WRITE: / sy-tabix, gs_produk-kode, gs_produk-nama, gs_produk-harga, gs_produk-stok.
ENDLOOP.
ULINE.
WRITE: / 'Total nilai persediaan:', gv_nilai.

SKIP.
WRITE / 'Stok menipis (di bawah 10):'.
LOOP AT gt_produk INTO gs_produk WHERE stok < 10.
  WRITE: / '-', gs_produk-nama, 'sisa', gs_produk-stok.
ENDLOOP.`,
    task: `<ul>
      <li>Tambahkan dua produk lagi dan pastikan total nilai persediaan ikut berubah.</li>
      <li>Cetak hanya produk yang harganya di atas 500.000.</li>
      <li>Tulis <tt>APPEND gs_produk TO gs_produk-nama.</tt> dan jalankan — inilah error yang paling sering dibuat pemula.</li>
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
    code: `REPORT z_belajar_itab_ops.

TYPES: BEGIN OF ty_produk,
         kode     TYPE c LENGTH 5,
         nama     TYPE string,
         kategori TYPE c LENGTH 10,
         harga    TYPE i,
       END OF ty_produk.

DATA: gt_produk TYPE STANDARD TABLE OF ty_produk,
      gs_produk TYPE ty_produk.

gs_produk-kode = 'P003'. gs_produk-nama = 'Monitor'.  gs_produk-kategori = 'DISPLAY'. gs_produk-harga = 2500000.
APPEND gs_produk TO gt_produk.
gs_produk-kode = 'P001'. gs_produk-nama = 'Keyboard'. gs_produk-kategori = 'INPUT'.   gs_produk-harga = 350000.
APPEND gs_produk TO gt_produk.
gs_produk-kode = 'P002'. gs_produk-nama = 'Mouse'.    gs_produk-kategori = 'INPUT'.   gs_produk-harga = 150000.
APPEND gs_produk TO gt_produk.
gs_produk-kode = 'P004'. gs_produk-nama = 'Proyektor'. gs_produk-kategori = 'DISPLAY'. gs_produk-harga = 0.
APPEND gs_produk TO gt_produk.

* Baca berdasarkan nomor baris
READ TABLE gt_produk INTO gs_produk INDEX 2.
WRITE: / 'Baris ke-2      :', gs_produk-nama.

* Baca berdasarkan isi, lalu ubah dan tulis balik
READ TABLE gt_produk INTO gs_produk WITH KEY kode = 'P002'.
IF sy-subrc = 0.
  gs_produk-harga = 175000.
  MODIFY gt_produk FROM gs_produk INDEX sy-tabix.
  WRITE: / 'Harga P002 diubah di baris', sy-tabix.
ENDIF.

READ TABLE gt_produk INTO gs_produk WITH KEY kode = 'P999'.
IF sy-subrc <> 0.
  WRITE: / 'P999 tidak ditemukan, sy-subrc =', sy-subrc.
ENDIF.

* Hapus produk tanpa harga, lalu urutkan dari yang termahal
DELETE gt_produk WHERE harga = 0.
SORT gt_produk BY harga DESCENDING.

ULINE.
LOOP AT gt_produk INTO gs_produk.
  WRITE: / sy-tabix, gs_produk-kode, gs_produk-nama, gs_produk-kategori, gs_produk-harga.
ENDLOOP.

* Daftar kategori unik
SORT gt_produk BY kategori.
DELETE ADJACENT DUPLICATES FROM gt_produk COMPARING kategori.
ULINE.
LOOP AT gt_produk INTO gs_produk.
  WRITE: / 'Kategori:', gs_produk-kategori.
ENDLOOP.`,
    task: `<ul>
      <li>Naikkan harga semua produk kategori INPUT sebesar 10% dengan <tt>LOOP</tt> + <tt>MODIFY</tt>.</li>
      <li>Urutkan berdasarkan kategori lalu harga (<tt>SORT gt_produk BY kategori harga DESCENDING.</tt>).</li>
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
        <li><tt>LOOP AT gt ASSIGNING &lt;fs&gt;.</tt> — <tt>&lt;fs&gt;</tt> menunjuk langsung ke baris tabel. Mengubah <tt>&lt;fs&gt;-harga</tt> langsung mengubah tabel, tanpa <tt>MODIFY</tt>.</li>
        <li>Lebih cepat daripada <tt>INTO</tt> karena tidak ada penyalinan baris — penting untuk tabel besar.</li>
        <li><tt>ASSIGN variabel TO &lt;fs&gt;.</tt> menunjuk ke variabel biasa. <tt>IS ASSIGNED</tt> memeriksa apakah field-symbol sudah menunjuk ke sesuatu.</li>
      </ul>`,
    code: `REPORT z_belajar_fs.

TYPES: BEGIN OF ty_produk,
         kode  TYPE c LENGTH 5,
         nama  TYPE string,
         harga TYPE i,
         stok  TYPE i,
       END OF ty_produk.

DATA: gt_produk TYPE STANDARD TABLE OF ty_produk,
      gs_produk TYPE ty_produk,
      gv_angka  TYPE i VALUE 10.

FIELD-SYMBOLS: <fs_produk> TYPE ty_produk,
               <fs_angka>  TYPE i.

gs_produk-kode = 'P001'. gs_produk-nama = 'Keyboard'. gs_produk-harga = 350000. gs_produk-stok = 12.
APPEND gs_produk TO gt_produk.
gs_produk-kode = 'P002'. gs_produk-nama = 'Mouse'.    gs_produk-harga = 150000. gs_produk-stok = 40.
APPEND gs_produk TO gt_produk.

* Naikkan semua harga 10% langsung di dalam tabel
LOOP AT gt_produk ASSIGNING <fs_produk>.
  <fs_produk>-harga = <fs_produk>-harga * 110 / 100.
ENDLOOP.

* Cari satu baris dan ubah di tempat
READ TABLE gt_produk ASSIGNING <fs_produk> WITH KEY kode = 'P002'.
IF sy-subrc = 0.
  <fs_produk>-stok = 0.
ENDIF.

LOOP AT gt_produk INTO gs_produk.
  WRITE: / gs_produk-kode, gs_produk-nama, gs_produk-harga, gs_produk-stok.
ENDLOOP.

* Field-symbol ke variabel biasa
ASSIGN gv_angka TO <fs_angka>.
<fs_angka> = 99.
WRITE: / 'gv_angka sekarang:', gv_angka.

UNASSIGN <fs_angka>.
IF <fs_angka> IS NOT ASSIGNED.
  WRITE / 'Field-symbol sudah dilepas.'.
ENDIF.`,
    task: `<ul>
      <li>Ganti loop pertama menjadi <tt>LOOP … INTO gs_produk</tt> tanpa <tt>MODIFY</tt>. Apakah harga di tabel berubah?</li>
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
    code: `REPORT z_belajar_form.

DATA: gv_luas  TYPE i,
      gv_total TYPE i,
      gt_angka TYPE STANDARD TABLE OF i.

START-OF-SELECTION.
  PERFORM tampil_judul USING 'Latihan Subroutine'.

  PERFORM hitung_luas USING 8 5 CHANGING gv_luas.
  WRITE: / 'Luas 8 x 5 =', gv_luas.

  APPEND 10 TO gt_angka.
  APPEND 25 TO gt_angka.
  APPEND 40 TO gt_angka.
  PERFORM jumlahkan TABLES gt_angka CHANGING gv_total.
  WRITE: / 'Jumlah isi tabel =', gv_total.

*&---------------------------------------------------------------------*
FORM tampil_judul USING pv_judul TYPE string.
  WRITE / pv_judul.
  ULINE.
ENDFORM.

FORM hitung_luas USING    pv_panjang TYPE i
                          pv_lebar   TYPE i
                 CHANGING cv_luas    TYPE i.
  DATA lv_sementara TYPE i.            " variabel lokal
  lv_sementara = pv_panjang * pv_lebar.
  cv_luas = lv_sementara.
ENDFORM.

FORM jumlahkan TABLES   pt_angka
               CHANGING cv_total TYPE i.
  DATA lv_angka TYPE i.
  CLEAR cv_total.
  LOOP AT pt_angka INTO lv_angka.
    cv_total = cv_total + lv_angka.
  ENDLOOP.
ENDFORM.`,
    task: `<ul>
      <li>Buat FORM <tt>hitung_diskon</tt> dengan <tt>USING</tt> harga dan persen, <tt>CHANGING</tt> harga akhir.</li>
      <li>Panggil <tt>PERFORM hitung_luas USING 8 CHANGING gv_luas.</tt> (kurang satu parameter) dan baca pesan error-nya.</li>
      <li>Di program utama, coba cetak <tt>lv_sementara</tt> setelah <tt>PERFORM</tt>. Mengapa tidak bisa?</li>
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
    code: `REPORT z_belajar_selscreen.

DATA: gt_flight TYPE STANDARD TABLE OF sflight,
      gs_flight TYPE sflight,
      gv_price  TYPE sflight-price.

PARAMETERS: p_carr  TYPE sflight-carrid DEFAULT 'GA',
            p_max   TYPE i DEFAULT 10,
            p_detil AS CHECKBOX DEFAULT 'X'.

SELECT-OPTIONS s_price FOR gv_price DEFAULT 500000 TO 1000000.

INITIALIZATION.
  " dijalankan sekali, sebelum selection screen ditampilkan

START-OF-SELECTION.
  SELECT * FROM sflight
    INTO TABLE gt_flight
    UP TO p_max ROWS
    WHERE carrid = p_carr
      AND price IN s_price.

  IF sy-subrc <> 0.
    WRITE: / 'Tidak ada penerbangan', p_carr, 'pada rentang harga tersebut.'.
  ELSE.
    WRITE: / 'Maskapai', p_carr, '-', sy-dbcnt, 'penerbangan ditemukan.'.
    IF p_detil = 'X'.
      ULINE.
      LOOP AT gt_flight INTO gs_flight.
        WRITE: / gs_flight-connid, gs_flight-fldate, gs_flight-price, gs_flight-currency.
      ENDLOOP.
    ENDIF.
  ENDIF.`,
    task: `<ul>
      <li>Buka <b>Parameters (F8)</b>, kosongkan rentang harga, dan jalankan. Berapa penerbangan yang muncul?</li>
      <li>Isi <tt>P_CARR</tt> dengan <tt>SQ</tt> dan sesuaikan rentang harganya (harga SQ dalam SGD, sekitar 1.200).</li>
      <li>Hilangkan centang <tt>P_DETIL</tt> dan lihat perbedaannya.</li>
    </ul>`
  },
  {
    id: 'd07', level: 2,
    title: 'SELECT: membaca database',
    goal: 'Mengambil data dari tabel database ke internal table dengan OpenSQL.',
    body: `
      <p><tt>SELECT</tt> membaca tabel database. Studio ini menyediakan tabel contoh (lihat menu <b>Tables (DB)</b>):
         SCARR, SPFLI, SFLIGHT, SBOOK, MARA, MAKT, KNA1, LFA1, T001, T005, VBAK, VBAP.</p>
      <ul>
        <li><tt>SELECT f1 f2 FROM tabel INTO TABLE gt WHERE ….</tt> — banyak baris ke internal table.</li>
        <li><tt>SELECT SINGLE … INTO gs WHERE ….</tt> — tepat satu baris ke work area.</li>
        <li>Ambil <b>hanya kolom yang diperlukan</b>; <tt>SELECT *</tt> mengambil semua kolom.</li>
        <li>Setelah SELECT: <tt>sy-subrc</tt> = 0 bila ada data, 4 bila tidak ada; <tt>sy-dbcnt</tt> = jumlah baris.</li>
        <li><tt>ORDER BY</tt> mengurutkan, <tt>UP TO n ROWS</tt> membatasi jumlah, <tt>LIKE 'PT%'</tt> mencocokkan pola, <tt>COUNT( * )</tt> menghitung baris.</li>
      </ul>
      <p>Jangan menaruh <tt>SELECT</tt> di dalam <tt>LOOP</tt> — itu pola paling lambat di ABAP. Solusinya (JOIN, FOR ALL ENTRIES) ada di level berikutnya.</p>`,
    code: `REPORT z_belajar_select.

TYPES: BEGIN OF ty_cust,
         kunnr TYPE kna1-kunnr,
         name1 TYPE kna1-name1,
         ort01 TYPE kna1-ort01,
         land1 TYPE kna1-land1,
       END OF ty_cust.

DATA: gt_cust TYPE STANDARD TABLE OF ty_cust,
      gs_cust TYPE ty_cust,
      gs_t001 TYPE t001,
      gv_jml  TYPE i.

* Banyak baris -> internal table
SELECT kunnr name1 ort01 land1
  FROM kna1
  INTO TABLE gt_cust
  WHERE land1 = 'ID'
  ORDER BY name1.

WRITE: / 'Customer Indonesia:', sy-dbcnt, 'baris'.
LOOP AT gt_cust INTO gs_cust.
  WRITE: / gs_cust-kunnr, gs_cust-name1, gs_cust-ort01.
ENDLOOP.

* Satu baris -> work area
ULINE.
SELECT SINGLE * FROM t001 INTO gs_t001 WHERE bukrs = '1000'.
IF sy-subrc = 0.
  WRITE: / 'Company code 1000:', gs_t001-butxt, gs_t001-waers.
ELSE.
  WRITE / 'Company code 1000 tidak ada.'.
ENDIF.

* Pola teks dan pembatasan jumlah baris
ULINE.
SELECT kunnr name1 ort01 land1
  FROM kna1
  INTO TABLE gt_cust
  UP TO 2 ROWS
  WHERE name1 LIKE 'PT%'.
LOOP AT gt_cust INTO gs_cust.
  WRITE: / 'Berawalan PT:', gs_cust-name1.
ENDLOOP.

* Menghitung baris
SELECT COUNT( * ) FROM kna1 INTO gv_jml WHERE land1 <> 'ID'.
WRITE: / 'Customer luar negeri:', gv_jml.`,
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
    code: `REPORT z_belajar_event.

PARAMETERS: p_carr TYPE sflight-carrid,
            p_min  TYPE i DEFAULT 100.

DATA: gt_flight TYPE STANDARD TABLE OF sflight,
      gs_flight TYPE sflight,
      gv_total  TYPE i.

* Ditulis paling atas, tetapi dijalankan paling akhir
END-OF-SELECTION.
  LOOP AT gt_flight INTO gs_flight.
    WRITE: /3 gs_flight-connid, 12 gs_flight-fldate, 26 gs_flight-seatsocc.
    gv_total = gv_total + gs_flight-seatsocc.
  ENDLOOP.
  ULINE /1(40).
  WRITE: /3 'Total penumpang', 26 gv_total.

* Otomatis, tepat sebelum baris pertama list dicetak
TOP-OF-PAGE.
  WRITE: / 'Penerbangan', p_carr, 'dengan minimal', p_min, 'penumpang'.
  WRITE: /3 'No.', 12 'Tanggal', 26 'Terisi'.
  ULINE /1(40).

* Proses utama
START-OF-SELECTION.
  SELECT * FROM sflight INTO TABLE gt_flight
    WHERE carrid = p_carr
      AND seatsocc >= p_min.

* Validasi masukan
AT SELECTION-SCREEN.
  IF p_min < 0.
    MESSAGE 'Jumlah penumpang minimum tidak boleh negatif' TYPE 'E'.
  ENDIF.

* Nilai awal selection screen
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
    code: `REPORT z_belajar_control_level.

TYPES: BEGIN OF ty_jual,
         wilayah TYPE c LENGTH 10,
         sales   TYPE c LENGTH 10,
         nilai   TYPE i,
       END OF ty_jual.

DATA: gt_jual  TYPE STANDARD TABLE OF ty_jual,
      gt_rekap TYPE STANDARD TABLE OF ty_jual,
      gs_jual  TYPE ty_jual.

gs_jual-wilayah = 'TIMUR'. gs_jual-sales = 'Rina'.  gs_jual-nilai = 400. APPEND gs_jual TO gt_jual.
gs_jual-wilayah = 'BARAT'. gs_jual-sales = 'Andi'.  gs_jual-nilai = 250. APPEND gs_jual TO gt_jual.
gs_jual-wilayah = 'BARAT'. gs_jual-sales = 'Budi'.  gs_jual-nilai = 300. APPEND gs_jual TO gt_jual.
gs_jual-wilayah = 'TIMUR'. gs_jual-sales = 'Sari'.  gs_jual-nilai = 150. APPEND gs_jual TO gt_jual.
gs_jual-wilayah = 'BARAT'. gs_jual-sales = 'Andi'.  gs_jual-nilai = 100. APPEND gs_jual TO gt_jual.

SORT gt_jual BY wilayah sales.

LOOP AT gt_jual INTO gs_jual.
  AT FIRST.
    WRITE / 'Laporan Penjualan'.
    ULINE /1(32).
  ENDAT.
  AT NEW wilayah.
    WRITE: / 'Wilayah', gs_jual-wilayah.
  ENDAT.

  WRITE: /5 gs_jual-sales, 20 gs_jual-nilai.

  AT END OF wilayah.
    SUM.
    WRITE: /5 'Subtotal', 20 gs_jual-nilai.
    SKIP.
  ENDAT.
  AT LAST.
    SUM.
    ULINE /1(32).
    WRITE: / 'Total', 20 gs_jual-nilai.
  ENDAT.
ENDLOOP.

* Rekap per wilayah dengan COLLECT
LOOP AT gt_jual INTO gs_jual.
  CLEAR gs_jual-sales.
  COLLECT gs_jual INTO gt_rekap.
ENDLOOP.
SKIP.
LOOP AT gt_rekap INTO gs_jual.
  WRITE: / 'Rekap', gs_jual-wilayah, 20 gs_jual-nilai.
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
    code: `REPORT z_belajar_jenis_tabel.

TYPES: BEGIN OF ty_kota,
         kode     TYPE c LENGTH 3,
         nama     TYPE string,
         penduduk TYPE i,
       END OF ty_kota.

DATA: gt_standard TYPE STANDARD TABLE OF ty_kota,
      gt_sorted   TYPE SORTED TABLE OF ty_kota WITH UNIQUE KEY kode,
      gt_hashed   TYPE HASHED TABLE OF ty_kota WITH UNIQUE KEY kode,
      gs_kota     TYPE ty_kota.

gs_kota-kode = 'SUB'. gs_kota-nama = 'Surabaya'. gs_kota-penduduk = 2900000.
APPEND gs_kota TO gt_standard.
INSERT gs_kota INTO TABLE gt_sorted.
INSERT gs_kota INTO TABLE gt_hashed.

gs_kota-kode = 'BDG'. gs_kota-nama = 'Bandung'. gs_kota-penduduk = 2500000.
APPEND gs_kota TO gt_standard.
INSERT gs_kota INTO TABLE gt_sorted.
INSERT gs_kota INTO TABLE gt_hashed.

gs_kota-kode = 'JKT'. gs_kota-nama = 'Jakarta'. gs_kota-penduduk = 10500000.
APPEND gs_kota TO gt_standard.
INSERT gs_kota INTO TABLE gt_sorted.
INSERT gs_kota INTO TABLE gt_hashed.

WRITE / 'STANDARD (urutan APPEND):'.
LOOP AT gt_standard INTO gs_kota.
  WRITE: /3 sy-tabix, gs_kota-kode, gs_kota-nama.
ENDLOOP.

WRITE / 'SORTED (selalu terurut menurut key):'.
LOOP AT gt_sorted INTO gs_kota.
  WRITE: /3 sy-tabix, gs_kota-kode, gs_kota-nama.
ENDLOOP.

* Key yang sama ditolak
gs_kota-kode = 'JKT'. gs_kota-nama = 'Jakarta (duplikat)'.
INSERT gs_kota INTO TABLE gt_sorted.
WRITE: / 'INSERT key kembar ke SORTED: sy-subrc =', sy-subrc.
INSERT gs_kota INTO TABLE gt_hashed.
WRITE: / 'INSERT key kembar ke HASHED: sy-subrc =', sy-subrc.

* Pencarian lewat key tabel
READ TABLE gt_hashed INTO gs_kota WITH TABLE KEY kode = 'BDG'.
IF sy-subrc = 0.
  WRITE: / 'Ditemukan di HASHED:', gs_kota-nama, gs_kota-penduduk.
ENDIF.
WRITE: / 'Jumlah baris:', lines( gt_standard ), lines( gt_sorted ), lines( gt_hashed ).`,
    task: `<ul>
      <li>Tulis <tt>APPEND gs_kota TO gt_hashed.</tt> dan baca pesan error-nya.</li>
      <li>Isi <tt>gs_kota-kode = 'AAA'</tt> lalu <tt>APPEND gs_kota TO gt_sorted.</tt> — program berhenti dengan runtime error. Mengapa <tt>INSERT … INTO TABLE</tt> aman?</li>
      <li>Ubah key tabel sorted menjadi <tt>NON-UNIQUE KEY kode</tt> dan ulangi penyisipan key kembar.</li>
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
    code: `REPORT z_belajar_join.

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

* 1) INNER JOIN: penerbangan + nama maskapai
SELECT f~carrid c~carrname f~connid f~fldate f~price f~currency
  FROM sflight AS f
  INNER JOIN scarr AS c ON f~carrid = c~carrid
  INTO TABLE gt_flight
  WHERE f~currency = 'IDR'
  ORDER BY f~price DESCENDING.

WRITE: / 'INNER JOIN SFLIGHT + SCARR:', sy-dbcnt, 'baris'.
LOOP AT gt_flight INTO gs_flight.
  WRITE: / gs_flight-carrname, gs_flight-connid, gs_flight-fldate, gs_flight-price, gs_flight-currency.
ENDLOOP.

* 2) FOR ALL ENTRIES: sales order + nama customer
ULINE.
SELECT vbeln kunnr netwr FROM vbak INTO TABLE gt_order.

IF gt_order IS NOT INITIAL.          " wajib: lindungi dari tabel driver kosong
  SELECT kunnr name1
    FROM kna1
    INTO TABLE gt_cust
    FOR ALL ENTRIES IN gt_order
    WHERE kunnr = gt_order-kunnr.
ENDIF.

WRITE: / 'FOR ALL ENTRIES:', sy-dbcnt, 'customer terambil'.
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
    code: `REPORT z_belajar_sql_lanjut.

TYPES: BEGIN OF ty_rekap,
         carrid TYPE sflight-carrid,
         jumlah TYPE i,
         kursi  TYPE i,
         termahal TYPE sflight-price,
       END OF ty_rekap.

DATA: gt_rekap TYPE STANDARD TABLE OF ty_rekap,
      gs_rekap TYPE ty_rekap,
      gs_scarr TYPE scarr,
      gv_jml   TYPE i,
      gv_max   TYPE sflight-price.

* 1) Satu nilai dari seluruh tabel
SELECT COUNT( * ) FROM sflight INTO gv_jml.
SELECT MAX( price ) FROM sflight INTO gv_max WHERE currency = 'IDR'.
WRITE: / 'Jumlah penerbangan:', gv_jml, '| tiket IDR termahal:', gv_max.

* 2) Rekap per maskapai
SELECT carrid COUNT( * ) AS jumlah SUM( seatsocc ) AS kursi MAX( price ) AS termahal
  FROM sflight
  INTO TABLE gt_rekap
  GROUP BY carrid
  HAVING SUM( seatsocc ) > 250
  ORDER BY kursi DESCENDING.

ULINE.
LOOP AT gt_rekap INTO gs_rekap.
  WRITE: / gs_rekap-carrid, 6 gs_rekap-jumlah, 12 gs_rekap-kursi, 22 gs_rekap-termahal.
ENDLOOP.

* 3) Mengubah data
ULINE.
gs_scarr-carrid   = 'ZZ'.
gs_scarr-carrname = 'Zebra Air'.
gs_scarr-currcode = 'IDR'.
INSERT scarr FROM gs_scarr.
WRITE: / 'INSERT pertama : sy-subrc =', sy-subrc.
INSERT scarr FROM gs_scarr.
WRITE: / 'INSERT kedua   : sy-subrc =', sy-subrc, '(key sudah ada)'.

UPDATE scarr SET carrname = 'Zebra Airways' WHERE carrid = 'ZZ'.
WRITE: / 'UPDATE         :', sy-dbcnt, 'baris berubah'.
COMMIT WORK.

DELETE FROM scarr WHERE currcode = 'USD'.
WRITE: / 'DELETE         :', sy-dbcnt, 'baris terhapus'.
ROLLBACK WORK.                          " penghapusan dibatalkan

SELECT COUNT( * ) FROM scarr INTO gv_jml.
SELECT SINGLE * FROM scarr INTO gs_scarr WHERE carrid = 'ZZ'.
WRITE: / 'Setelah ROLLBACK:', gv_jml, 'maskapai, termasuk', gs_scarr-carrname.`,
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
    code: `REPORT z_belajar_pesan.

PARAMETERS p_matnr TYPE mara-matnr DEFAULT '1000-100'.

DATA: gs_mara TYPE mara,
      gs_makt TYPE makt.

START-OF-SELECTION.
  PERFORM baca_material USING p_matnr.
  ULINE.
  PERFORM baca_material USING '9999-999'.

*&---------------------------------------------------------------------*
FORM baca_material USING pv_matnr TYPE mara-matnr.

  SELECT SINGLE * FROM mara INTO gs_mara WHERE matnr = pv_matnr.
  IF sy-subrc <> 0.
    MESSAGE |Material { pv_matnr } tidak ditemukan| TYPE 'W'.
    RETURN.                           " keluar dari FORM, sisanya dilewati
  ENDIF.

  SELECT SINGLE * FROM makt INTO gs_makt
    WHERE matnr = pv_matnr
      AND spras = 'EN'.
  IF sy-subrc <> 0.
    CLEAR gs_makt.
    gs_makt-maktx = '(tanpa deskripsi)'.
  ENDIF.

  WRITE: / 'Material :', gs_mara-matnr.
  WRITE: / 'Deskripsi:', gs_makt-maktx.
  WRITE: / 'Tipe     :', gs_mara-mtart, '| Satuan:', gs_mara-meins.
  MESSAGE 'Data material berhasil dibaca' TYPE 'S'.

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
    code: `REPORT z_belajar_fm.

DATA: lv_kunnr TYPE kunnr VALUE '1000',
      lv_alpha TYPE kunnr,
      lv_tanpa TYPE kunnr,
      lv_akhir TYPE d,
      lv_hari  TYPE c LENGTH 1,
      lv_besok TYPE d.

* 1) Conversion exit ALPHA: melengkapi nol di depan nomor
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
    output = lv_tanpa.
WRITE: / 'ALPHA output :', lv_alpha, '->', lv_tanpa.

* 2) Fungsi tanggal dengan EXCEPTIONS
CALL FUNCTION 'RP_LAST_DAY_OF_MONTHS'
  EXPORTING
    day_in            = '20240210'
  IMPORTING
    last_day_of_month = lv_akhir
  EXCEPTIONS
    day_in_no_date    = 1
    OTHERS            = 2.
IF sy-subrc = 0.
  WRITE: / 'Akhir Feb 2024:', lv_akhir.
ENDIF.

* Tanggal tidak valid -> exception dipetakan ke sy-subrc = 1
CALL FUNCTION 'RP_LAST_DAY_OF_MONTHS'
  EXPORTING
    day_in            = '20241399'
  IMPORTING
    last_day_of_month = lv_akhir
  EXCEPTIONS
    day_in_no_date    = 1
    OTHERS            = 2.
CASE sy-subrc.
  WHEN 0.
    WRITE: / 'Akhir bulan  :', lv_akhir.
  WHEN 1.
    WRITE / 'Tanggal 20241399 tidak valid (exception DAY_IN_NO_DATE, sy-subrc = 1).'.
  WHEN OTHERS.
    WRITE / 'Error lain.'.
ENDCASE.

* 3) Hari dalam minggu dan perhitungan tanggal
CALL FUNCTION 'DATE_COMPUTE_DAY'
  EXPORTING
    date = '20250817'
  IMPORTING
    day  = lv_hari.
WRITE: / '17-08-2025 adalah hari ke-', lv_hari, '(1 = Senin ... 7 = Minggu)'.

CALL FUNCTION 'RP_CALC_DATE_IN_INTERVAL'
  EXPORTING
    date      = '20250131'
    days      = 1
    months    = 0
    years     = 0
    signum    = '+'
  IMPORTING
    calc_date = lv_besok.
WRITE: / 'Sehari setelah 31-01-2025:', lv_besok.`,
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
    code: `REPORT z_belajar_fm_sendiri.

DATA: gv_hasil TYPE p DECIMALS 2,
      gt_log   TYPE STANDARD TABLE OF string,
      gv_baris TYPE string.

START-OF-SELECTION.
  CALL FUNCTION 'Z_HITUNG_DISKON'
    EXPORTING
      iv_harga       = 250000
      iv_persen      = 15
    IMPORTING
      ev_bayar       = gv_hasil
    TABLES
      t_log          = gt_log
    EXCEPTIONS
      persen_invalid = 1
      OTHERS         = 2.
  WRITE: / 'sy-subrc =', sy-subrc, '| harus dibayar:', gv_hasil.

* Parameter iv_persen tidak diisi -> nilai DEFAULT dipakai
  CALL FUNCTION 'Z_HITUNG_DISKON'
    EXPORTING
      iv_harga       = 100000
    IMPORTING
      ev_bayar       = gv_hasil
    TABLES
      t_log          = gt_log
    EXCEPTIONS
      persen_invalid = 1
      OTHERS         = 2.
  WRITE: / 'sy-subrc =', sy-subrc, '| harus dibayar:', gv_hasil.

* Persen di luar batas -> FM menaikkan exception
  CALL FUNCTION 'Z_HITUNG_DISKON'
    EXPORTING
      iv_harga       = 100000
      iv_persen      = 150
    IMPORTING
      ev_bayar       = gv_hasil
    EXCEPTIONS
      persen_invalid = 1
      OTHERS         = 2.
  IF sy-subrc = 1.
    WRITE / 'sy-subrc = 1: persen diskon tidak valid, perhitungan dibatalkan.'.
  ENDIF.

  ULINE.
  LOOP AT gt_log INTO gv_baris.
    WRITE: / 'Log:', gv_baris.
  ENDLOOP.

FUNCTION z_hitung_diskon.
*"----------------------------------------------------------------------
*"*"Local Interface:
*"  IMPORTING
*"     VALUE(IV_HARGA) TYPE  I
*"     VALUE(IV_PERSEN) TYPE  I DEFAULT 10
*"  EXPORTING
*"     VALUE(EV_BAYAR) TYPE  P
*"  TABLES
*"      T_LOG OPTIONAL
*"  EXCEPTIONS
*"      PERSEN_INVALID
*"----------------------------------------------------------------------
  DATA lv_diskon TYPE i.

  IF iv_persen < 0 OR iv_persen > 100.
    RAISE persen_invalid.
  ENDIF.

  lv_diskon = iv_harga * iv_persen / 100.
  ev_bayar  = iv_harga - lv_diskon.
  APPEND |Harga { iv_harga }, diskon { iv_persen }% = { lv_diskon }| TO t_log.
ENDFUNCTION.`,
    task: `<ul>
      <li>Hapus <tt>EXCEPTIONS</tt> pada pemanggilan ketiga dan jalankan. Apa yang terjadi bila exception tidak ditangani?</li>
      <li>Panggil dengan nama parameter yang salah (<tt>iv_hrg = 1000</tt>) dan baca pesan error-nya.</li>
      <li>Tambahkan parameter <tt>EXPORTING ev_diskon</tt> yang mengembalikan nilai diskonnya.</li>
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
    code: `REPORT z_belajar_alv.

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
      i_grid_title       = 'Daftar Material'
      it_fieldcat        = gt_fieldcat
    TABLES
      t_outtab           = gt_data
    EXCEPTIONS
      program_error      = 1
      OTHERS             = 2.

  IF sy-subrc <> 0.
    MESSAGE 'ALV gagal ditampilkan' TYPE 'E'.
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
    code: `REPORT z_belajar_alv_merge.

DATA: gt_flight   TYPE STANDARD TABLE OF sflight,
      gt_fieldcat TYPE slis_t_fieldcat_alv,
      gs_fieldcat TYPE slis_fieldcat_alv,
      gs_layout   TYPE slis_layout_alv,
      gt_sort     TYPE slis_t_sortinfo_alv,
      gs_sort     TYPE slis_sortinfo_alv.

START-OF-SELECTION.
  SELECT * FROM sflight INTO TABLE gt_flight.

* 1) Field catalog otomatis dari struktur DDIC
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
    MESSAGE 'Field catalog gagal dibuat' TYPE 'E'.
  ENDIF.

* 2) Sesuaikan beberapa kolom
  LOOP AT gt_fieldcat INTO gs_fieldcat.
    CASE gs_fieldcat-fieldname.
      WHEN 'PRICE'.
        gs_fieldcat-seltext_m = 'Harga Tiket'.
      WHEN 'SEATSOCC' OR 'PAYMENTSUM'.
        gs_fieldcat-do_sum = 'X'.
      WHEN 'SEATSMAX_B' OR 'SEATSOCC_B' OR 'SEATSMAX_F' OR 'SEATSOCC_F'.
        gs_fieldcat-no_out = 'X'.
    ENDCASE.
    MODIFY gt_fieldcat FROM gs_fieldcat.
  ENDLOOP.

* 3) Layout dan urutan awal
  gs_layout-zebra             = 'X'.
  gs_layout-colwidth_optimize = 'X'.

  gs_sort-fieldname = 'PRICE'.
  gs_sort-down      = 'X'.
  APPEND gs_sort TO gt_sort.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program = sy-repid
      i_grid_title       = 'Jadwal Penerbangan (termahal dulu)'
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
    code: `REPORT z_belajar_salv.

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

      go_alv->get_functions( )->set_all( abap_true ).           " semua tombol toolbar
      go_alv->get_columns( )->set_optimize( abap_true ).        " lebar kolom otomatis
      go_alv->get_display_settings( )->set_striped_pattern( abap_true ).
      go_alv->get_display_settings( )->set_list_header( 'Rute Penerbangan (SPFLI)' ).

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
    code: `REPORT z_belajar_alv_interaktif.

DATA: gt_scarr  TYPE STANDARD TABLE OF scarr,
      gs_scarr  TYPE scarr,
      gt_fcat   TYPE slis_t_fieldcat_alv,
      gs_fcat   TYPE slis_fieldcat_alv,
      gt_header TYPE slis_t_listheader,
      gs_header TYPE slis_listheader,
      gv_jumlah TYPE i.

START-OF-SELECTION.
  SELECT * FROM scarr INTO TABLE gt_scarr.

  gs_fcat-fieldname = 'CARRID'.
  gs_fcat-seltext_m = 'Maskapai'.
  gs_fcat-key       = 'X'.
  gs_fcat-hotspot   = 'X'.               " sel kolom ini bisa diklik
  APPEND gs_fcat TO gt_fcat.

  CLEAR gs_fcat.
  gs_fcat-fieldname = 'CARRNAME'.
  gs_fcat-seltext_m = 'Nama Maskapai'.
  APPEND gs_fcat TO gt_fcat.

  CLEAR gs_fcat.
  gs_fcat-fieldname = 'CURRCODE'.
  gs_fcat-seltext_m = 'Mata Uang'.
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
*& Header di atas grid
*&---------------------------------------------------------------------*
FORM top_of_page.
  CLEAR gt_header.

  CLEAR gs_header.
  gs_header-typ  = 'H'.
  gs_header-info = 'Daftar Maskapai'.
  APPEND gs_header TO gt_header.

  CLEAR gs_header.
  gs_header-typ  = 'S'.
  gs_header-key  = 'Jumlah'.
  gs_header-info = lines( gt_scarr ).
  APPEND gs_header TO gt_header.

  CLEAR gs_header.
  gs_header-typ  = 'A'.
  gs_header-info = 'Klik kode maskapai untuk melihat penerbangannya.'.
  APPEND gs_header TO gt_header.

  CALL FUNCTION 'REUSE_ALV_COMMENTARY_WRITE'
    EXPORTING
      it_list_commentary = gt_header.
ENDFORM.

*&---------------------------------------------------------------------*
*& Dipanggil ALV setiap kali pengguna mengklik
*&---------------------------------------------------------------------*
FORM user_command USING r_ucomm     LIKE sy-ucomm
                        rs_selfield TYPE slis_selfield.
  CASE r_ucomm.
    WHEN '&IC1'.                         " klik dua kali / hotspot
      READ TABLE gt_scarr INTO gs_scarr INDEX rs_selfield-tabindex.
      IF sy-subrc <> 0.
        RETURN.
      ENDIF.
      SELECT COUNT( * ) FROM sflight INTO gv_jumlah WHERE carrid = gs_scarr-carrid.
      WRITE: / 'Baris', rs_selfield-tabindex, 'kolom', rs_selfield-fieldname, ':',
               gs_scarr-carrname, 'punya', gv_jumlah, 'penerbangan.'.
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
    code: `REPORT z_belajar_kode_lama.

TABLES: scarr.

* Tabel dengan header line
DATA: BEGIN OF it_maskapai OCCURS 0,
        carrid   LIKE scarr-carrid,
        carrname LIKE scarr-carrname,
        jumlah   TYPE i,
      END OF it_maskapai.

DATA v_baris TYPE i.

* Macro: &1 dan &2 diganti argumennya
DEFINE tulis_baris.
  WRITE: / &1, 6 &2.
END-OF-DEFINITION.

START-OF-SELECTION.
* SELECT ... ENDSELECT mengisi work area SCARR baris demi baris
  SELECT * FROM scarr WHERE currcode <> 'USD'.
    CLEAR it_maskapai.                         " header line
    MOVE-CORRESPONDING scarr TO it_maskapai.   " ke header line
    APPEND it_maskapai.                        " header line -> tabel
  ENDSELECT.

  DESCRIBE TABLE it_maskapai LINES v_baris.
  WRITE: / 'Jumlah baris:', v_baris.

  LOOP AT it_maskapai.                         " tiap baris -> header line
    SELECT COUNT( * ) FROM sflight INTO it_maskapai-jumlah
      WHERE carrid = it_maskapai-carrid.
    MODIFY it_maskapai.                        " header line -> baris saat ini
  ENDLOOP.

  SORT it_maskapai BY jumlah DESCENDING.
  LOOP AT it_maskapai.
    tulis_baris it_maskapai-carrid it_maskapai-carrname.
    WRITE 30 it_maskapai-jumlah.
  ENDLOOP.

  READ TABLE it_maskapai WITH KEY carrid = 'GA'.
  IF sy-subrc = 0.
    WRITE: / 'Header line sekarang berisi:', it_maskapai-carrname.
  ENDIF.

  CLEAR it_maskapai.                           " hanya header line
  IF it_maskapai IS INITIAL AND it_maskapai[] IS NOT INITIAL.
    WRITE / 'CLEAR it_maskapai mengosongkan header line; isi tabel masih ada.'.
  ENDIF.

  REFRESH it_maskapai.                         " isi tabelnya
  WRITE: / 'Setelah REFRESH:', lines( it_maskapai ), 'baris'.`,
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
    code: `REPORT z_belajar_laporan.

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
            p_besar TYPE i DEFAULT 10000000.

START-OF-SELECTION.
  PERFORM get_data.
  IF gt_output IS INITIAL.
    MESSAGE 'Tidak ada sales order untuk kriteria tersebut' TYPE 'S'.
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
    IF <fs_out>-netwr >= p_besar.
      <fs_out>-status = 'BESAR'.
    ELSE.
      <fs_out>-status = 'REGULER'.
    ENDIF.
  ENDLOOP.
ENDFORM.

*&---------------------------------------------------------------------*
FORM display_data.
  PERFORM add_field USING 'VBELN'  'Sales Order'  'X' ' '.
  PERFORM add_field USING 'ERDAT'  'Tanggal'      ' ' ' '.
  PERFORM add_field USING 'KUNNR'  'Customer'     ' ' ' '.
  PERFORM add_field USING 'NAME1'  'Nama'         ' ' ' '.
  PERFORM add_field USING 'ORT01'  'Kota'         ' ' ' '.
  PERFORM add_field USING 'NETWR'  'Nilai Bersih' ' ' 'X'.
  PERFORM add_field USING 'WAERK'  'Mata Uang'    ' ' ' '.
  PERFORM add_field USING 'STATUS' 'Status'       ' ' ' '.

  gs_layout-zebra = 'X'.

  CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
    EXPORTING
      i_callback_program = sy-repid
      i_grid_title       = 'Laporan Sales Order'
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
      <li>Buka <b>Parameters (F8)</b> dan ubah <tt>P_BESAR</tt> menjadi 20000000. Order mana yang berubah status?</li>
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
    code: `REPORT z_belajar_class.

CLASS lcl_rekening DEFINITION.
  PUBLIC SECTION.
    METHODS: set_pemilik IMPORTING iv_nama TYPE string,
             setor       IMPORTING iv_jumlah TYPE i,
             tarik       IMPORTING iv_jumlah TYPE i,
             get_saldo   RETURNING VALUE(rv_saldo) TYPE i,
             cetak.
  PRIVATE SECTION.
    DATA: mv_pemilik TYPE string,
          mv_saldo   TYPE i.
ENDCLASS.

CLASS lcl_rekening IMPLEMENTATION.
  METHOD set_pemilik.
    mv_pemilik = iv_nama.
  ENDMETHOD.

  METHOD setor.
    mv_saldo = mv_saldo + iv_jumlah.
  ENDMETHOD.

  METHOD tarik.
    IF iv_jumlah > mv_saldo.
      WRITE: / mv_pemilik, ': saldo tidak cukup untuk menarik', iv_jumlah.
      RETURN.
    ENDIF.
    mv_saldo = mv_saldo - iv_jumlah.
  ENDMETHOD.

  METHOD get_saldo.
    rv_saldo = mv_saldo.
  ENDMETHOD.

  METHOD cetak.
    WRITE: / 'Rekening', mv_pemilik, '| saldo', mv_saldo.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA: lo_andi TYPE REF TO lcl_rekening,
        lo_sari TYPE REF TO lcl_rekening.

  CREATE OBJECT lo_andi.                 " cara klasik
  lo_sari = NEW lcl_rekening( ).         " cara modern

  lo_andi->set_pemilik( 'Andi' ).
  lo_andi->setor( 500000 ).
  lo_andi->tarik( iv_jumlah = 200000 ).

  lo_sari->set_pemilik( 'Sari' ).
  lo_sari->setor( 100000 ).
  lo_sari->tarik( 750000 ).              " ditolak

  lo_andi->cetak( ).
  lo_sari->cetak( ).

  DATA(lv_saldo) = lo_andi->get_saldo( ).
  WRITE: / 'Saldo Andi lewat get_saldo( ):', lv_saldo.`,
    task: `<ul>
      <li>Di program utama tulis <tt>lo_andi-&gt;mv_saldo = 999.</tt> dan jalankan. Mengapa ditolak?</li>
      <li>Tambahkan method <tt>transfer</tt> yang memindahkan saldo ke rekening lain (<tt>IMPORTING io_tujuan TYPE REF TO lcl_rekening iv_jumlah TYPE i</tt>).</li>
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
        <li><b>Static</b> = milik class, bukan milik objek: <tt>CLASS-DATA</tt> dipakai bersama oleh semua objek, <tt>CLASS-METHODS</tt> dipanggil tanpa objek. Aksesnya memakai <tt>=&gt;</tt>: <tt>lcl_x=&gt;gv_jumlah</tt>.</li>
        <li><tt>CONSTANTS</tt> di dalam class juga static.</li>
        <li><tt>READ-ONLY</tt> membuat atribut publik bisa dibaca dari luar tetapi hanya bisa diubah dari dalam class.</li>
        <li>Tiga tingkat visibility: <tt>PUBLIC</tt> (semua), <tt>PROTECTED</tt> (class dan turunannya), <tt>PRIVATE</tt> (class itu saja).</li>
      </ul>`,
    code: `REPORT z_belajar_constructor.

CLASS lcl_karyawan DEFINITION.
  PUBLIC SECTION.
    CONSTANTS gc_perusahaan TYPE string VALUE 'PT Maju Bersama'.
    CLASS-DATA gv_jumlah TYPE i.                    " dipakai bersama semua objek
    DATA mv_nama TYPE string READ-ONLY.             " terbaca dari luar, tidak bisa diubah

    METHODS: constructor IMPORTING iv_nama TYPE string
                                   iv_gaji TYPE i,
             naik_gaji   IMPORTING iv_persen TYPE i,
             info.
    CLASS-METHODS total_karyawan RETURNING VALUE(rv_jumlah) TYPE i.

  PRIVATE SECTION.
    DATA mv_gaji TYPE i.
ENDCLASS.

CLASS lcl_karyawan IMPLEMENTATION.
  METHOD constructor.
    mv_nama   = iv_nama.
    mv_gaji   = iv_gaji.
    gv_jumlah = gv_jumlah + 1.
  ENDMETHOD.

  METHOD naik_gaji.
    mv_gaji = mv_gaji + mv_gaji * iv_persen / 100.
  ENDMETHOD.

  METHOD info.
    WRITE: / mv_nama, '| gaji', mv_gaji.
  ENDMETHOD.

  METHOD total_karyawan.
    rv_jumlah = gv_jumlah.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  WRITE: / 'Perusahaan:', lcl_karyawan=>gc_perusahaan.
  WRITE: / 'Karyawan sebelum ada objek:', lcl_karyawan=>total_karyawan( ).

  DATA(lo_rina) = NEW lcl_karyawan( iv_nama = 'Rina' iv_gaji = 8000000 ).
  DATA(lo_joko) = NEW lcl_karyawan( iv_nama = 'Joko' iv_gaji = 6500000 ).

  lo_rina->naik_gaji( 10 ).
  lo_rina->info( ).
  lo_joko->info( ).

  WRITE: / 'Nama (READ-ONLY):', lo_rina->mv_nama.
  WRITE: / 'Total karyawan  :', lcl_karyawan=>gv_jumlah.`,
    task: `<ul>
      <li>Coba <tt>lo_rina-&gt;mv_nama = 'Lain'.</tt> dari program utama.</li>
      <li>Buat objek tanpa parameter: <tt>NEW lcl_karyawan( )</tt>. Apa pesannya?</li>
      <li>Tambahkan static method <tt>reset</tt> yang mengembalikan <tt>gv_jumlah</tt> ke 0.</li>
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
      <p>Perhatikan <tt>perkenalan</tt>: method itu hanya ada di induk, tetapi <tt>bersuara( )</tt> yang dipanggilnya adalah versi masing-masing turunan.</p>`,
    code: `REPORT z_belajar_inheritance.

CLASS lcl_hewan DEFINITION.
  PUBLIC SECTION.
    METHODS: constructor IMPORTING iv_nama TYPE string,
             bersuara,
             perkenalan.
  PROTECTED SECTION.
    DATA mv_nama TYPE string.
ENDCLASS.

CLASS lcl_hewan IMPLEMENTATION.
  METHOD constructor.
    mv_nama = iv_nama.
  ENDMETHOD.

  METHOD bersuara.
    WRITE: / mv_nama, 'mengeluarkan suara.'.
  ENDMETHOD.

  METHOD perkenalan.
    WRITE: / 'Halo, saya', mv_nama.
    bersuara( ).                        " versi turunan yang dipanggil
  ENDMETHOD.
ENDCLASS.

CLASS lcl_kucing DEFINITION INHERITING FROM lcl_hewan.
  PUBLIC SECTION.
    METHODS bersuara REDEFINITION.
ENDCLASS.

CLASS lcl_kucing IMPLEMENTATION.
  METHOD bersuara.
    WRITE: / mv_nama, 'berkata: Meong!'.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_anjing DEFINITION INHERITING FROM lcl_hewan.
  PUBLIC SECTION.
    METHODS bersuara REDEFINITION.
ENDCLASS.

CLASS lcl_anjing IMPLEMENTATION.
  METHOD bersuara.
    super->bersuara( ).                 " jalankan versi induk dulu
    WRITE: / mv_nama, 'berkata: Guk guk!'.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA lo_hewan TYPE REF TO lcl_hewan.   " tipe induk

  lo_hewan = NEW lcl_hewan( 'Hewan umum' ).
  lo_hewan->perkenalan( ).
  ULINE.

  lo_hewan = NEW lcl_kucing( 'Tom' ).    " menunjuk ke objek turunan
  lo_hewan->perkenalan( ).
  ULINE.

  lo_hewan = NEW lcl_anjing( 'Bruno' ).
  lo_hewan->perkenalan( ).`,
    task: `<ul>
      <li>Tambahkan class <tt>lcl_burung</tt> dengan suaranya sendiri.</li>
      <li>Ubah <tt>mv_nama</tt> menjadi <tt>PRIVATE</tt>. Apa yang terjadi di class turunan?</li>
      <li>Beri <tt>lcl_kucing</tt> constructor sendiri yang menerima nama dan warna, lalu memanggil <tt>super-&gt;constructor( iv_nama )</tt>.</li>
    </ul>`
  },
  {
    id: 'a04', level: 4,
    title: 'Interface dan polymorphism',
    goal: 'Memperlakukan objek dari class berbeda secara seragam lewat interface.',
    body: `
      <p><b>Interface</b> adalah kontrak: daftar method tanpa isi. Class yang menulis <tt>INTERFACES lif_x.</tt> berjanji menyediakan semua method itu.</p>
      <ul>
        <li>Di implementasi, nama method-nya <tt>lif_x~nama</tt> (tanda <tt>~</tt> = "milik interface").</li>
        <li>Variabel bertipe <tt>REF TO lif_x</tt> bisa menunjuk ke objek dari class <b>mana pun</b> yang mengimplementasikan interface itu.</li>
        <li>Dengan begitu, satu <tt>LOOP</tt> bisa memproses persegi, lingkaran, dan bentuk lain tanpa <tt>IF</tt>/<tt>CASE</tt> per jenis. Menambah bentuk baru tidak mengubah kode loop sama sekali.</li>
      </ul>
      <p>Bedanya dengan inheritance: turunan mewarisi <b>isi</b> dari satu induk; interface hanya mewajibkan <b>bentuk</b>, dan satu class boleh mengimplementasikan banyak interface.</p>`,
    code: `REPORT z_belajar_interface.

INTERFACE lif_bangun.
  METHODS: nama RETURNING VALUE(rv_nama) TYPE string,
           luas RETURNING VALUE(rv_luas) TYPE f.
ENDINTERFACE.

CLASS lcl_persegi DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_bangun.
    METHODS constructor IMPORTING iv_sisi TYPE i.
  PRIVATE SECTION.
    DATA mv_sisi TYPE i.
ENDCLASS.

CLASS lcl_persegi IMPLEMENTATION.
  METHOD constructor.
    mv_sisi = iv_sisi.
  ENDMETHOD.
  METHOD lif_bangun~nama.
    rv_nama = 'Persegi'.
  ENDMETHOD.
  METHOD lif_bangun~luas.
    rv_luas = mv_sisi * mv_sisi.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_lingkaran DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_bangun.
    METHODS constructor IMPORTING iv_jari TYPE i.
  PRIVATE SECTION.
    DATA mv_jari TYPE i.
ENDCLASS.

CLASS lcl_lingkaran IMPLEMENTATION.
  METHOD constructor.
    mv_jari = iv_jari.
  ENDMETHOD.
  METHOD lif_bangun~nama.
    rv_nama = 'Lingkaran'.
  ENDMETHOD.
  METHOD lif_bangun~luas.
    rv_luas = '3.14' * mv_jari * mv_jari.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA: gt_bangun TYPE STANDARD TABLE OF REF TO lif_bangun,
        go_bangun TYPE REF TO lif_bangun,
        gv_total  TYPE f.

  APPEND NEW lcl_persegi( 4 )    TO gt_bangun.
  APPEND NEW lcl_lingkaran( 5 )  TO gt_bangun.
  APPEND NEW lcl_persegi( 10 )   TO gt_bangun.

* Satu loop untuk semua jenis bangun
  LOOP AT gt_bangun INTO go_bangun.
    WRITE: / go_bangun->nama( ), '| luas =', go_bangun->luas( ).
    gv_total = gv_total + go_bangun->luas( ).
  ENDLOOP.
  ULINE.
  WRITE: / 'Total luas:', gv_total.`,
    task: `<ul>
      <li>Tambahkan class <tt>lcl_segitiga</tt> (alas, tinggi). Perhatikan: kode <tt>LOOP</tt> tidak perlu diubah.</li>
      <li>Tambahkan method <tt>keliling</tt> ke interface. Apa yang terjadi bila salah satu class belum mengimplementasikannya?</li>
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
    code: `REPORT z_belajar_exception.

* Exception buatan sendiri
CLASS lcx_saldo_kurang DEFINITION INHERITING FROM cx_static_check.
  PUBLIC SECTION.
    DATA mv_kurang TYPE i READ-ONLY.
    METHODS constructor IMPORTING iv_kurang TYPE i.
ENDCLASS.

CLASS lcx_saldo_kurang IMPLEMENTATION.
  METHOD constructor.
    super->constructor( ).
    mv_kurang = iv_kurang.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_rekening DEFINITION.
  PUBLIC SECTION.
    METHODS: setor IMPORTING iv_jumlah TYPE i,
             tarik IMPORTING iv_jumlah TYPE i
                   RAISING   lcx_saldo_kurang.
  PRIVATE SECTION.
    DATA mv_saldo TYPE i.
ENDCLASS.

CLASS lcl_rekening IMPLEMENTATION.
  METHOD setor.
    mv_saldo = mv_saldo + iv_jumlah.
  ENDMETHOD.

  METHOD tarik.
    IF iv_jumlah > mv_saldo.
      RAISE EXCEPTION TYPE lcx_saldo_kurang
        EXPORTING
          iv_kurang = iv_jumlah - mv_saldo.
    ENDIF.
    mv_saldo = mv_saldo - iv_jumlah.
    WRITE: / 'Penarikan', iv_jumlah, 'berhasil. Sisa saldo', mv_saldo.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA: lv_a     TYPE i VALUE 10,
        lv_b     TYPE i VALUE 0,
        lv_hasil TYPE i.

* 1) Exception sistem
  TRY.
      lv_hasil = lv_a / lv_b.
      WRITE / 'Baris ini tidak pernah dijalankan.'.
    CATCH cx_sy_zerodivide INTO DATA(lx_nol).
      WRITE: / 'Tertangkap:', lx_nol->get_text( ).
  ENDTRY.
  WRITE / 'Program tetap berjalan setelah ENDTRY.'.
  ULINE.

* 2) Exception buatan sendiri
  DATA(lo_rek) = NEW lcl_rekening( ).
  lo_rek->setor( 500000 ).

  TRY.
      lo_rek->tarik( 200000 ).
      lo_rek->tarik( 700000 ).           " melempar exception
      lo_rek->tarik( 100000 ).           " dilewati
    CATCH lcx_saldo_kurang INTO DATA(lx_saldo).
      WRITE: / 'Penarikan ditolak, saldo kurang', lx_saldo->mv_kurang.
  ENDTRY.
  ULINE.

* 3) CATCH cx_root menangkap apa pun
  DATA lo_kosong TYPE REF TO lcl_rekening.
  TRY.
      lo_kosong->setor( 1 ).             " objek belum dibuat
    CATCH cx_root INTO DATA(lx_apapun).
      WRITE: / 'Error lain:', lx_apapun->get_text( ).
  ENDTRY.`,
    task: `<ul>
      <li>Hapus blok <tt>TRY … ENDTRY</tt> di bagian 1 dan jalankan. Program berhenti di mana?</li>
      <li>Tambahkan exception kedua <tt>lcx_jumlah_tidak_valid</tt> yang dinaikkan bila jumlah tarik ≤ 0, dan tangkap dengan <tt>CATCH</tt> terpisah.</li>
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
    code: `REPORT z_belajar_modern.

TYPES: BEGIN OF ty_buah,
         nama  TYPE string,
         harga TYPE i,
         stok  TYPE i,
       END OF ty_buah,
       tt_buah TYPE STANDARD TABLE OF ty_buah WITH EMPTY KEY.

* Deklarasi inline dan konstruktor VALUE
DATA(lv_toko) = 'Toko Segar'.
DATA(lt_buah) = VALUE tt_buah(
  ( nama = 'Apel'   harga = 5000 stok = 20 )
  ( nama = 'Mangga' harga = 8000 stok = 12 ) ).

APPEND VALUE #( nama = 'Jeruk' harga = 4000 stok = 0 ) TO lt_buah.

* LOOP dengan work area inline + string template
LOOP AT lt_buah INTO DATA(ls_buah) WHERE stok > 0.
  DATA(lv_nilai) = ls_buah-harga * ls_buah-stok.
  WRITE / |{ ls_buah-nama }: { ls_buah-stok } buah, nilai Rp { lv_nilai }|.
ENDLOOP.

* Field-symbol inline: ubah langsung di tabel
LOOP AT lt_buah ASSIGNING FIELD-SYMBOL(<ls_buah>).
  <ls_buah>-harga = <ls_buah>-harga + 500.
ENDLOOP.

READ TABLE lt_buah INTO DATA(ls_cari) WITH KEY nama = 'Mangga'.
IF sy-subrc = 0.
  WRITE / |Harga baru { ls_cari-nama }: Rp { ls_cari-harga }|.
ENDIF.

* Operator && dan fungsi bawaan
DATA(lv_jumlah) = lines( lt_buah ).
DATA(lv_pesan)  = lv_toko && ' menjual ' && lv_jumlah && ' jenis buah.'.
WRITE / lv_pesan.

* SELECT dengan deklarasi inline
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
        <tr><td><tt>itab[ 2 ]</tt>, <tt>itab[ id = 5 ]-nama</tt></td><td><tt>READ TABLE</tt></td></tr>
        <tr><td><tt>line_exists( itab[ … ] )</tt></td><td><tt>READ TABLE … TRANSPORTING NO FIELDS</tt> + cek <tt>sy-subrc</tt></td></tr>
        <tr><td><tt>VALUE tipe( FOR r IN itab WHERE ( … ) ( … ) )</tt></td><td><tt>LOOP</tt> + <tt>APPEND</tt> untuk membangun tabel baru</td></tr>
        <tr><td><tt>REDUCE tipe( INIT s = 0 FOR r IN itab NEXT s = s + r-f )</tt></td><td><tt>LOOP</tt> untuk menjumlah / menghitung</td></tr>
        <tr><td><tt>CORRESPONDING tipe( sumber )</tt></td><td><tt>MOVE-CORRESPONDING</tt></td></tr>
      </table>
      <p>Hati-hati dengan table expression: bila barisnya tidak ada, yang terjadi bukan <tt>sy-subrc = 4</tt> melainkan exception
         <tt>cx_sy_itab_line_not_found</tt>. Pakai <tt>line_exists( )</tt>, <tt>VALUE #( … OPTIONAL )</tt>, atau <tt>TRY … CATCH</tt>.</p>`,
    code: `REPORT z_belajar_ekspresi.

TYPES: BEGIN OF ty_siswa,
         id    TYPE i,
         nama  TYPE string,
         nilai TYPE i,
       END OF ty_siswa,
       tt_siswa TYPE STANDARD TABLE OF ty_siswa WITH EMPTY KEY.

TYPES: BEGIN OF ty_rapor,
         nama  TYPE string,
         grade TYPE c LENGTH 1,
       END OF ty_rapor,
       tt_rapor TYPE STANDARD TABLE OF ty_rapor WITH EMPTY KEY.

DATA(lt_siswa) = VALUE tt_siswa(
  ( id = 1 nama = 'Ani'  nilai = 92 )
  ( id = 2 nama = 'Budi' nilai = 67 )
  ( id = 3 nama = 'Cici' nilai = 45 ) ).

* Table expression: membaca tanpa READ TABLE
DATA(lv_nilai_budi) = lt_siswa[ 2 ]-nilai.
DATA(ls_cici)       = lt_siswa[ nama = 'Cici' ].
WRITE: / 'Nilai Budi:', lv_nilai_budi, '| id Cici:', ls_cici-id.

lt_siswa[ 3 ]-nilai = 58.                       " mengubah langsung di tabel

IF line_exists( lt_siswa[ id = 9 ] ).
  WRITE / 'Siswa 9 ada.'.
ELSE.
  WRITE / 'Siswa 9 tidak ada.'.
ENDIF.
DATA(lv_nama) = VALUE #( lt_siswa[ id = 9 ]-nama DEFAULT '(tidak ditemukan)' ).
WRITE: / 'Dengan DEFAULT:', lv_nama.

TRY.
    DATA(lv_gagal) = lt_siswa[ 9 ]-nama.
  CATCH cx_sy_itab_line_not_found.
    WRITE / 'Tanpa pengaman: exception cx_sy_itab_line_not_found.'.
ENDTRY.

* COND dan SWITCH
ULINE.
LOOP AT lt_siswa INTO DATA(ls_siswa).
  DATA(lv_grade) = COND string( WHEN ls_siswa-nilai >= 85 THEN 'A'
                                WHEN ls_siswa-nilai >= 60 THEN 'B'
                                ELSE 'C' ).
  DATA(lv_ket) = SWITCH string( lv_grade WHEN 'A' THEN 'istimewa'
                                         WHEN 'B' THEN 'lulus'
                                         ELSE 'remedial' ).
  WRITE: / ls_siswa-nama, ls_siswa-nilai, lv_grade, lv_ket.
ENDLOOP.

* REDUCE dan FOR
ULINE.
DATA(lv_total) = REDUCE i( INIT s = 0 FOR r IN lt_siswa NEXT s = s + r-nilai ).
DATA(lv_lulus) = REDUCE i( INIT n = 0 FOR r IN lt_siswa WHERE ( nilai >= 60 ) NEXT n = n + 1 ).
WRITE: / 'Total nilai:', lv_total, '| lulus:', lv_lulus, 'dari', lines( lt_siswa ).

DATA(lt_rapor) = VALUE tt_rapor( FOR r IN lt_siswa WHERE ( nilai >= 50 )
                                 ( nama = r-nama grade = COND #( WHEN r-nilai >= 85 THEN 'A' ELSE 'B' ) ) ).
LOOP AT lt_rapor INTO DATA(ls_rapor).
  WRITE: / 'Rapor:', ls_rapor-nama, ls_rapor-grade.
ENDLOOP.

DATA(lt_kelipatan) = VALUE tt_siswa( FOR i = 1 UNTIL i > 3 ( id = i * 10 nama = |Nomor { i }| ) ).
WRITE: / 'FOR dengan penghitung:', lt_kelipatan[ 3 ]-id, lt_kelipatan[ 3 ]-nama.

* CORRESPONDING: salin komponen bernama sama ke tipe lain
DATA(lt_nama) = CORRESPONDING tt_rapor( lt_siswa ).
WRITE: / 'CORRESPONDING:', lines( lt_nama ), 'baris, baris pertama =', lt_nama[ 1 ]-nama.`,
    task: `<ul>
      <li>Hitung nilai tertinggi dengan <tt>REDUCE</tt> (petunjuk: <tt>NEXT m = COND #( WHEN r-nilai &gt; m THEN r-nilai ELSE m )</tt>).</li>
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
    code: `REPORT z_belajar_event_class.

CLASS lcl_stok DEFINITION.
  PUBLIC SECTION.
    EVENTS stok_menipis EXPORTING VALUE(ev_barang) TYPE string
                                  VALUE(ev_sisa)   TYPE i.
    METHODS: constructor IMPORTING iv_barang TYPE string
                                   iv_jumlah TYPE i,
             ambil       IMPORTING iv_jumlah TYPE i.
  PRIVATE SECTION.
    DATA: mv_barang TYPE string,
          mv_jumlah TYPE i.
ENDCLASS.

CLASS lcl_stok IMPLEMENTATION.
  METHOD constructor.
    mv_barang = iv_barang.
    mv_jumlah = iv_jumlah.
  ENDMETHOD.

  METHOD ambil.
    mv_jumlah = mv_jumlah - iv_jumlah.
    WRITE / |{ mv_barang }: diambil { iv_jumlah }, sisa { mv_jumlah }|.
    IF mv_jumlah < 10.
      RAISE EVENT stok_menipis EXPORTING ev_barang = mv_barang
                                         ev_sisa   = mv_jumlah.
    ENDIF.
  ENDMETHOD.
ENDCLASS.

* Pendengar: tidak dikenal oleh lcl_stok
CLASS lcl_pembelian DEFINITION.
  PUBLIC SECTION.
    METHODS on_stok_menipis FOR EVENT stok_menipis OF lcl_stok
      IMPORTING ev_barang ev_sisa.
    DATA mv_pesanan TYPE i.
ENDCLASS.

CLASS lcl_pembelian IMPLEMENTATION.
  METHOD on_stok_menipis.
    mv_pesanan = mv_pesanan + 1.
    WRITE /3 |>> Pembelian: pesan ulang { ev_barang } (sisa { ev_sisa })|.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(lo_kertas)    = NEW lcl_stok( iv_barang = 'Kertas A4' iv_jumlah = 25 ).
  DATA(lo_tinta)     = NEW lcl_stok( iv_barang = 'Tinta'     iv_jumlah = 12 ).
  DATA(lo_pembelian) = NEW lcl_pembelian( ).

* Hanya stok kertas yang didengarkan
  SET HANDLER lo_pembelian->on_stok_menipis FOR lo_kertas.

  lo_kertas->ambil( 10 ).
  lo_kertas->ambil( 8 ).               " sisa 7  -> event -> handler berjalan
  lo_tinta->ambil( 5 ).                " sisa 7  -> event, tetapi belum ada yang mendengarkan

  ULINE.
  SET HANDLER lo_pembelian->on_stok_menipis FOR lo_tinta.
  lo_tinta->ambil( 2 ).                " sekarang handler ikut berjalan

  WRITE: / 'Jumlah pesanan ulang:', lo_pembelian->mv_pesanan.`,
    task: `<ul>
      <li>Ganti kedua <tt>SET HANDLER</tt> dengan satu <tt>… FOR ALL INSTANCES.</tt> Berapa pesanan ulang yang tercatat?</li>
      <li>Tambahkan pendengar kedua, <tt>lcl_gudang</tt>, yang mencetak peringatan sendiri untuk event yang sama.</li>
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
        <li><tt>ASSIGN (nama) TO &lt;fs&gt;.</tt> mengambil variabel yang namanya tersimpan di variabel lain.</li>
      </ul>
      <p>Referensi yang belum diisi bernilai kosong; men-dereference-nya memicu <tt>cx_sy_ref_is_initial</tt>. Periksa dengan <tt>IS BOUND</tt>.</p>`,
    code: `REPORT z_belajar_dinamis.

TYPES: BEGIN OF ty_produk,
         kode  TYPE c LENGTH 5,
         nama  TYPE string,
         harga TYPE i,
       END OF ty_produk.

DATA: gv_angka  TYPE i VALUE 5,
      gs_produk TYPE ty_produk,
      gt_produk TYPE STANDARD TABLE OF ty_produk,
      gr_angka  TYPE REF TO i,
      gr_produk TYPE REF TO ty_produk,
      gv_nama   TYPE string.

FIELD-SYMBOLS <fs_apa_saja> TYPE any.

* 1) Referensi ke variabel
gr_angka = REF #( gv_angka ).
gr_angka->* = 99.                        " mengubah gv_angka lewat referensi
WRITE: / 'gv_angka =', gv_angka, '| lewat referensi =', gr_angka->*.

* 2) Data tanpa nama
CREATE DATA gr_angka.
gr_angka->* = 7.
WRITE: / 'Data baru =', gr_angka->*, '| gv_angka tetap', gv_angka.

* 3) Referensi ke struktur dan ke baris tabel
gs_produk-kode = 'P001'. gs_produk-nama = 'Keyboard'. gs_produk-harga = 350000.
APPEND gs_produk TO gt_produk.
gs_produk-kode = 'P002'. gs_produk-nama = 'Mouse'.    gs_produk-harga = 150000.
APPEND gs_produk TO gt_produk.

LOOP AT gt_produk REFERENCE INTO gr_produk.
  gr_produk->harga = gr_produk->harga * 2.
ENDLOOP.
WRITE: / 'Harga setelah digandakan:', gt_produk[ 1 ]-harga, gt_produk[ 2 ]-harga.

* 4) Menjelajahi komponen struktur tanpa tahu namanya
ULINE.
gs_produk = gt_produk[ 2 ].
DO.
  ASSIGN COMPONENT sy-index OF STRUCTURE gs_produk TO <fs_apa_saja>.
  IF sy-subrc <> 0.
    EXIT.
  ENDIF.
  WRITE: / 'Komponen', sy-index, '=', <fs_apa_saja>.
ENDDO.

* 5) Komponen dan variabel lewat nama
ASSIGN COMPONENT 'NAMA' OF STRUCTURE gs_produk TO <fs_apa_saja>.
<fs_apa_saja> = 'Mouse Wireless'.
WRITE: / 'gs_produk-nama =', gs_produk-nama.

gv_nama = 'GV_ANGKA'.
ASSIGN (gv_nama) TO <fs_apa_saja>.
IF sy-subrc = 0.
  WRITE: / 'Variabel bernama', gv_nama, 'berisi', <fs_apa_saja>.
ENDIF.

* 6) Referensi kosong
CLEAR gr_produk.
IF gr_produk IS NOT BOUND.
  WRITE / 'gr_produk belum menunjuk ke mana pun.'.
ENDIF.`,
    task: `<ul>
      <li>Buat FORM <tt>cetak_struktur USING ps_data TYPE any</tt> yang mencetak semua komponen struktur apa pun, lalu panggil untuk <tt>gs_produk</tt> dan untuk satu baris SCARR.</li>
      <li>Setelah <tt>CLEAR gr_produk</tt>, akses <tt>gr_produk-&gt;harga</tt> dan tangkap exception-nya dengan <tt>TRY … CATCH cx_sy_ref_is_initial</tt>.</li>
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
        <tr><td><tt>get_columns( )</tt></td><td>kumpulan kolom: <tt>set_optimize( )</tt>, <tt>get_column( 'NAMA' )</tt></td></tr>
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
    code: `REPORT z_belajar_salv_lanjut.

CLASS lcl_laporan_po DEFINITION.
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
    METHODS: jalankan,
             on_link_click FOR EVENT link_click OF cl_salv_events_table
               IMPORTING row column.
  PRIVATE SECTION.
    DATA: mt_po  TYPE STANDARD TABLE OF ty_po,
          mo_alv TYPE REF TO cl_salv_table.
    METHODS: ambil_data,
             tampilkan.
ENDCLASS.

CLASS lcl_laporan_po IMPLEMENTATION.
  METHOD jalankan.
    ambil_data( ).
    tampilkan( ).
  ENDMETHOD.

  METHOD ambil_data.
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

  METHOD tampilkan.
    TRY.
        cl_salv_table=>factory(
          IMPORTING
            r_salv_table = mo_alv
          CHANGING
            t_table      = mt_po ).

        mo_alv->get_display_settings( )->set_striped_pattern( abap_true ).
        mo_alv->get_display_settings( )->set_list_header( 'Daftar Purchase Order' ).

        DATA(lo_columns) = mo_alv->get_columns( ).
        lo_columns->set_optimize( abap_true ).

        " kolom nomor PO bisa diklik
        DATA(lo_ebeln) = CAST cl_salv_column_table( lo_columns->get_column( 'EBELN' ) ).
        lo_ebeln->set_cell_type( if_salv_c_cell_type=>hotspot ).

        " judul kolom sendiri, dan satu kolom disembunyikan
        lo_columns->get_column( 'TOTAL' )->set_medium_text( 'Nilai Item' ).
        lo_columns->get_column( 'TXZ01' )->set_medium_text( 'Barang' ).
        lo_columns->get_column( 'EBELP' )->set_visible( abap_false ).

        " urut menurut vendor, jumlahkan nilainya
        mo_alv->get_sorts( )->add_sort( columnname = 'NAME1' ).
        mo_alv->get_aggregations( )->add_aggregation( columnname = 'TOTAL' ).

        " daftarkan method ini sebagai pendengar klik
        SET HANDLER on_link_click FOR mo_alv->get_event( ).

        mo_alv->display( ).

      CATCH cx_salv_msg cx_salv_not_found INTO DATA(lx_salv).
        MESSAGE lx_salv->get_text( ) TYPE 'E'.
    ENDTRY.
  ENDMETHOD.

  METHOD on_link_click.
    READ TABLE mt_po INTO DATA(ls_po) INDEX row.
    IF sy-subrc = 0.
      MESSAGE |PO { ls_po-ebeln } dari { ls_po-name1 }: { ls_po-txz01 } senilai { ls_po-total } { ls_po-waers }| TYPE 'I'.
    ENDIF.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(go_laporan) = NEW lcl_laporan_po( ).
  go_laporan->jalankan( ).`,
    task: `<ul>
      <li>Minta kolom yang tidak ada (<tt>get_column( 'HARGA' )</tt>). Exception apa yang tertangkap?</li>
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
        <li><b>Tanggung jawab terpisah</b>: <tt>ambil_data</tt> hanya membaca database, <tt>olah_data</tt> hanya menghitung, <tt>tampilkan</tt> hanya urusan layar. Masing-masing bisa diubah atau diuji sendiri.</li>
        <li><b>State di atribut</b>: tabel hasil disimpan di <tt>mt_data</tt> (private), bukan variabel global.</li>
        <li><b>Tipe di dalam class</b>: <tt>ty_baris</tt> didefinisikan di <tt>PUBLIC SECTION</tt> class.</li>
        <li><b>Constructor</b> menerima kriteria seleksi, sehingga objek laporan selalu tahu apa yang harus diambil.</li>
      </ul>
      <p>Bandingkan dengan proyek di level Menengah: alurnya sama, tetapi tidak ada lagi variabel global yang bisa diubah dari mana saja.</p>`,
    code: `REPORT z_belajar_oo_report.

CLASS lcl_laporan DEFINITION.
  PUBLIC SECTION.
    TYPES: BEGIN OF ty_baris,
             carrid   TYPE sflight-carrid,
             carrname TYPE scarr-carrname,
             connid   TYPE sflight-connid,
             fldate   TYPE sflight-fldate,
             seatsmax TYPE sflight-seatsmax,
             seatsocc TYPE sflight-seatsocc,
             persen   TYPE i,
             status   TYPE c LENGTH 8,
           END OF ty_baris.

    METHODS: constructor IMPORTING iv_carrid TYPE sflight-carrid,
             ambil_data,
             olah_data,
             tampilkan,
             jumlah_baris RETURNING VALUE(rv_jumlah) TYPE i.

  PRIVATE SECTION.
    DATA: mv_carrid TYPE sflight-carrid,
          mt_data   TYPE STANDARD TABLE OF ty_baris.
ENDCLASS.

CLASS lcl_laporan IMPLEMENTATION.
  METHOD constructor.
    mv_carrid = iv_carrid.
  ENDMETHOD.

  METHOD ambil_data.
    SELECT f~carrid c~carrname f~connid f~fldate f~seatsmax f~seatsocc
      FROM sflight AS f
      INNER JOIN scarr AS c ON f~carrid = c~carrid
      INTO TABLE mt_data
      WHERE f~carrid = mv_carrid
      ORDER BY f~fldate.
  ENDMETHOD.

  METHOD olah_data.
    LOOP AT mt_data ASSIGNING FIELD-SYMBOL(<ls_baris>).
      <ls_baris>-persen = <ls_baris>-seatsocc * 100 / <ls_baris>-seatsmax.
      IF <ls_baris>-persen >= 90.
        <ls_baris>-status = 'PENUH'.
      ELSEIF <ls_baris>-persen >= 80.
        <ls_baris>-status = 'RAMAI'.
      ELSE.
        <ls_baris>-status = 'LONGGAR'.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD jumlah_baris.
    rv_jumlah = lines( mt_data ).
  ENDMETHOD.

  METHOD tampilkan.
    DATA lo_alv TYPE REF TO cl_salv_table.
    TRY.
        cl_salv_table=>factory(
          IMPORTING
            r_salv_table = lo_alv
          CHANGING
            t_table      = mt_data ).
        lo_alv->get_display_settings( )->set_striped_pattern( abap_true ).
        lo_alv->get_display_settings( )->set_list_header( 'Okupansi Penerbangan' ).
        lo_alv->display( ).
      CATCH cx_salv_msg INTO DATA(lx_msg).
        MESSAGE lx_msg->get_text( ) TYPE 'E'.
    ENDTRY.
  ENDMETHOD.
ENDCLASS.

PARAMETERS p_carr TYPE sflight-carrid DEFAULT 'GA'.

START-OF-SELECTION.
  DATA(lo_laporan) = NEW lcl_laporan( p_carr ).
  lo_laporan->ambil_data( ).

  IF lo_laporan->jumlah_baris( ) = 0.
    MESSAGE |Tidak ada penerbangan untuk maskapai { p_carr }| TYPE 'S'.
    RETURN.
  ENDIF.

  lo_laporan->olah_data( ).
  WRITE: / 'Maskapai', p_carr, '-', lo_laporan->jumlah_baris( ), 'penerbangan'.
  lo_laporan->tampilkan( ).`,
    task: `<ul>
      <li>Jalankan lewat <b>Parameters (F8)</b> dengan maskapai <tt>SQ</tt>, lalu dengan kode yang tidak ada (<tt>XX</tt>).</li>
      <li>Tambahkan method <tt>rata_rata_okupansi</tt> yang mengembalikan rata-rata kolom <tt>persen</tt>.</li>
      <li>Pisahkan tampilan ke class sendiri <tt>lcl_tampilan</tt> yang menerima tabel data — sehingga <tt>lcl_laporan</tt> tidak tahu apa-apa soal ALV.</li>
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
    code: `REPORT z_belajar_regex.

DATA gv_teks TYPE string VALUE 'Order 4500000012 dan 4500000099 dikirim ke budi@contoh.co.id'.

* 1) FIND REGEX: posisi, panjang, dan jumlah kecocokan
FIND REGEX '\\d{10}' IN gv_teks MATCH OFFSET DATA(gv_posisi) MATCH LENGTH DATA(gv_panjang).
IF sy-subrc = 0.
  DATA(gv_nomor) = substring( val = gv_teks off = gv_posisi len = gv_panjang ).
  WRITE: / 'Nomor pertama :', gv_nomor, '(posisi', gv_posisi, ')'.
ENDIF.
FIND ALL OCCURRENCES OF REGEX '\\d{10}' IN gv_teks MATCH COUNT DATA(gv_jumlah).
WRITE: / 'Jumlah nomor  :', gv_jumlah.

* 2) SUBMATCHES: isi tiap pasang kurung ( )
FIND REGEX '(\\w+)@([\\w.]+)' IN gv_teks SUBMATCHES DATA(gv_user) DATA(gv_domain).
WRITE: / 'Pengguna      :', gv_user.
WRITE: / 'Domain        :', gv_domain.

* 3) REPLACE ... REGEX: $1 adalah isi kurung pertama
DATA(gv_samar) = gv_teks.
REPLACE ALL OCCURRENCES OF REGEX '\\d{6}(\\d{4})' IN gv_samar WITH '******$1'.
WRITE: / gv_samar.

* 4) Fungsi: matches( ) menguji SELURUH teks, match( ) mengambil bagian yang cocok
DATA gt_kode TYPE STANDARD TABLE OF string WITH EMPTY KEY.
gt_kode = VALUE #( ( 'AB-123' ) ( 'ab-12' ) ( 'XYZ-999' ) ( 'QQ-007' ) ).
SKIP.
LOOP AT gt_kode INTO DATA(gv_kode).
  IF matches( val = gv_kode regex = '[A-Z]{2}-\\d{3}' ).
    WRITE: / gv_kode, 12 'valid'.
  ELSE.
    WRITE: / gv_kode, 12 'tidak valid'.
  ENDIF.
ENDLOOP.

DATA(gv_angka)  = match( val = gv_teks regex = '\\d+' ).
DATA(gv_bersih) = replace( val = 'A1B22C333' regex = '\\d+' with = '' occ = 0 ).
DATA(gv_kata)   = count( val = gv_teks regex = '[a-z]+' ).
SKIP.
WRITE: / 'Angka pertama :', gv_angka.
WRITE: / 'Tanpa angka   :', gv_bersih.
WRITE: / 'Kata huruf kecil:', gv_kata.`,
    task: `<ul>
      <li>Ubah pola nomor order agar hanya cocok dengan nomor yang diawali <tt>45</tt>.</li>
      <li>Tambahkan kode <tt>ZZ-12A</tt> ke <tt>gt_kode</tt>. Perkirakan hasilnya dulu, baru jalankan.</li>
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
        <li>Kunci boleh berupa struktur: <tt>GROUP BY ( kunnr = … jumlah = GROUP SIZE )</tt>. <tt>GROUP SIZE</tt> berisi jumlah anggota, <tt>GROUP INDEX</tt> nomor urut kelompoknya.</li>
        <li><tt>ASCENDING</tt> / <tt>DESCENDING</tt> mengurutkan kelompok menurut kuncinya. Tanpa itu kelompok muncul menurut kemunculan pertamanya di tabel.</li>
        <li>Tanpa <tt>INTO</tt> di belakang (representative binding), work area berisi baris pertama kelompok dan dipakai sebagai nama kelompoknya: <tt>LOOP AT GROUP gs_order</tt>.</li>
      </ul>
      <p>Tabel aslinya tidak berubah dan tidak perlu diurutkan lebih dulu.</p>`,
    code: `REPORT z_belajar_group_by.

TYPES: BEGIN OF ty_order,
         vbeln TYPE vbak-vbeln,
         kunnr TYPE vbak-kunnr,
         ernam TYPE vbak-ernam,
         netwr TYPE vbak-netwr,
       END OF ty_order.
DATA: gt_order   TYPE STANDARD TABLE OF ty_order WITH EMPTY KEY,
      gs_anggota TYPE ty_order,
      gv_total   TYPE vbak-netwr.

SELECT vbeln kunnr ernam netwr FROM vbak INTO TABLE gt_order.

* 1) Satu kunci, dengan group binding: gv_sales berisi nilai kuncinya
WRITE: / 'Penjualan per sales'.
LOOP AT gt_order INTO DATA(gs_order) GROUP BY gs_order-ernam ASCENDING INTO DATA(gv_sales).
  CLEAR gv_total.
  LOOP AT GROUP gv_sales INTO gs_anggota.
    gv_total = gv_total + gs_anggota-netwr.
  ENDLOOP.
  WRITE: /3 gv_sales, 16 gv_total.
ENDLOOP.

* 2) Kunci berbentuk struktur, plus GROUP SIZE
SKIP.
WRITE: / 'Jumlah order per pelanggan'.
LOOP AT gt_order INTO gs_order
     GROUP BY ( kunnr = gs_order-kunnr jumlah = GROUP SIZE )
     DESCENDING INTO DATA(gs_grup).
  WRITE: /3 gs_grup-kunnr, 16 gs_grup-jumlah.
ENDLOOP.

* 3) Tanpa INTO di belakang: gs_order (baris pertama) mewakili kelompoknya
SKIP.
WRITE: / 'Order terbesar tiap pelanggan'.
LOOP AT gt_order INTO gs_order GROUP BY gs_order-kunnr.
  DATA(gs_maks) = gs_order.
  LOOP AT GROUP gs_order INTO gs_anggota WHERE netwr > gs_maks-netwr.
    gs_maks = gs_anggota.
  ENDLOOP.
  WRITE: /3 gs_maks-kunnr, 16 gs_maks-vbeln, 30 gs_maks-netwr.
ENDLOOP.`,
    task: `<ul>
      <li>Tambahkan field <tt>vkorg</tt> ke <tt>ty_order</tt>, lalu cetak jumlah order dan total nilainya per sales organization.</li>
      <li>Di bagian 2, tambahkan <tt>urut = GROUP INDEX</tt> ke kunci dan cetak nomornya.</li>
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
        <li><tt>LET nama = … IN</tt> membuat variabel bantu yang hanya hidup di dalam ekspresi itu — nilai yang dipakai berulang cukup dihitung sekali.</li>
        <li><tt>FOR GROUPS grp OF e IN tabel GROUP BY …</tt> adalah bentuk ekspresi dari <tt>LOOP AT … GROUP BY</tt>; <tt>FOR m IN GROUP grp</tt> membaca anggota kelompoknya.</li>
        <li><tt>CORRESPONDING tipe( sumber MAPPING baru = lama EXCEPT kolom )</tt> menyalin field bernama sama, memetakan nama yang berbeda, dan melewati kolom yang disebut.</li>
      </ul>
      <p>Ekspresi yang terlalu panjang sulit dibaca dan sulit di-debug. Bila satu ekspresi sudah melebihi beberapa baris, pecah menjadi langkah-langkah yang diberi nama.</p>`,
    code: `REPORT z_belajar_ekspresi_tabel.

TYPES: BEGIN OF ty_emp,
         pernr TYPE pa0001-pernr,
         ename TYPE pa0001-ename,
         orgeh TYPE pa0001-orgeh,
         gaji  TYPE pa0008-bet01,
       END OF ty_emp,
       tt_emp TYPE SORTED TABLE OF ty_emp WITH NON-UNIQUE KEY orgeh.
DATA gt_emp TYPE tt_emp.

SELECT a~pernr, a~ename, a~orgeh, b~bet01 AS gaji
  FROM pa0001 AS a INNER JOIN pa0008 AS b ON b~pernr = a~pernr
  WHERE b~endda = '99991231'
  ORDER BY a~orgeh, a~pernr
  INTO TABLE @gt_emp.

* 1) FILTER: baris yang cocok dengan key tabel, tanpa LOOP
DATA(gt_sales) = FILTER #( gt_emp WHERE orgeh = '50000030' ).
WRITE: / 'Karyawan Sales :', lines( gt_sales ).

* 2) LET: variabel bantu yang hanya hidup di dalam satu ekspresi
DATA(gv_ringkas) = CONV string(
  LET jml = lines( gt_emp )
      tot = REDUCE i( INIT s = 0 FOR e IN gt_emp NEXT s = s + e-gaji )
  IN |{ jml } karyawan, rata-rata gaji { tot / jml }| ).
WRITE: / gv_ringkas.

* 3) FOR GROUPS: rekap per unit organisasi dalam satu ekspresi
TYPES: BEGIN OF ty_rekap,
         orgeh TYPE pa0001-orgeh,
         orang TYPE i,
         total TYPE pa0008-bet01,
       END OF ty_rekap,
       tt_rekap TYPE STANDARD TABLE OF ty_rekap WITH EMPTY KEY.
DATA(gt_rekap) = VALUE tt_rekap(
  FOR GROUPS grp OF e IN gt_emp GROUP BY e-orgeh ASCENDING
  ( orgeh = grp
    orang = REDUCE i( INIT c = 0 FOR m IN GROUP grp NEXT c = c + 1 )
    total = REDUCE i( INIT s = 0 FOR m IN GROUP grp NEXT s = s + m-gaji ) ) ).
SKIP.
LOOP AT gt_rekap INTO DATA(gs_rekap).
  WRITE: / gs_rekap-orgeh, 12 gs_rekap-orang, 18 gs_rekap-total.
ENDLOOP.

* 4) CORRESPONDING ... MAPPING ... EXCEPT: salin ke struktur dengan nama field lain
TYPES: BEGIN OF ty_kartu,
         nomor TYPE pa0001-pernr,
         nama  TYPE pa0001-ename,
         gaji  TYPE pa0008-bet01,
       END OF ty_kartu.
DATA(gs_kartu) = CORRESPONDING ty_kartu( gt_emp[ 1 ] MAPPING nomor = pernr nama = ename EXCEPT gaji ).
SKIP.
WRITE: / gs_kartu-nomor, gs_kartu-nama, gs_kartu-gaji.`,
    task: `<ul>
      <li>Buat <tt>gt_bukan_sales</tt> dengan <tt>FILTER #( gt_emp EXCEPT WHERE orgeh = '50000030' )</tt> dan cetak jumlah barisnya.</li>
      <li>Tambahkan kolom <tt>rata</tt> (rata-rata gaji) ke <tt>ty_rekap</tt> dan isi di dalam ekspresi yang sama.</li>
      <li>Hapus <tt>EXCEPT gaji</tt> di bagian 4, jalankan, dan lihat perubahan outputnya.</li>
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
        <li>Perhitungan dan fungsi boleh ditulis langsung di daftar kolom: <tt>seatsmax - seatsocc AS sisa</tt>, <tt>concat( carrid, connid )</tt>. Nama alias-nya dapat dipakai di <tt>ORDER BY</tt>.</li>
        <li><tt>UNION</tt> menggabung hasil dua SELECT yang susunan kolomnya sama dan membuang baris kembar; <tt>UNION ALL</tt> mempertahankan semuanya.</li>
      </ul>
      <p>Lihat baris <b>Database</b> di bawah output: lima SELECT, lima akses — dan tidak ada satu pun SELECT di dalam loop.</p>`,
    code: `REPORT z_belajar_sql_lanjutan.

* 1) Subquery: order yang BELUM punya delivery
SELECT vbeln, kunnr, netwr FROM vbak
  WHERE vbeln NOT IN ( SELECT vgbel FROM lips )
  ORDER BY vbeln
  INTO TABLE @DATA(gt_buka).
WRITE: / 'Order tanpa delivery:', lines( gt_buka ).
LOOP AT gt_buka INTO DATA(gs_buka).
  WRITE: /3 gs_buka-vbeln, 16 gs_buka-netwr.
ENDLOOP.

* 2) EXISTS dengan subquery berkorelasi: pelanggan yang sudah pernah ditagih
SELECT kunnr, name1 FROM kna1
  WHERE EXISTS ( SELECT vbeln FROM vbrk WHERE kunrg = kna1~kunnr )
  ORDER BY kunnr
  INTO TABLE @DATA(gt_ditagih).
SKIP.
WRITE: / 'Pelanggan yang sudah ditagih:', lines( gt_ditagih ).

* 3) CASE dan perhitungan di daftar kolom
SELECT vbeln, netwr,
       CASE WHEN netwr >= 20000000 THEN 'BESAR'
            WHEN netwr >= 10000000 THEN 'SEDANG'
            ELSE 'KECIL' END AS kelas
  FROM vbak
  ORDER BY netwr DESCENDING
  INTO TABLE @DATA(gt_kelas)
  UP TO 5 ROWS.
SKIP.
LOOP AT gt_kelas INTO DATA(gs_kelas).
  WRITE: /3 gs_kelas-vbeln, 16 gs_kelas-netwr, 30 gs_kelas-kelas.
ENDLOOP.

SELECT carrid, connid, seatsmax - seatsocc AS sisa,
       concat( carrid, connid ) AS kode
  FROM sflight
  ORDER BY sisa DESCENDING
  INTO TABLE @DATA(gt_kursi)
  UP TO 3 ROWS.
SKIP.
LOOP AT gt_kursi INTO DATA(gs_kursi).
  WRITE: /3 gs_kursi-kode, 12 gs_kursi-sisa, 'kursi kosong'.
ENDLOOP.

* 4) UNION: pelanggan dan vendor dalam satu daftar mitra
SELECT kunnr AS nomor, name1, 'Pelanggan' AS peran FROM kna1
UNION
SELECT lifnr AS nomor, name1, 'Vendor' AS peran FROM lfa1
INTO TABLE @DATA(gt_mitra).
SKIP.
WRITE: / 'Jumlah mitra:', lines( gt_mitra ).`,
    task: `<ul>
      <li>Balik pertanyaan 1: tampilkan order yang <b>sudah</b> punya delivery.</li>
      <li>Tambahkan kelas <tt>MIKRO</tt> untuk order di bawah 5 juta.</li>
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
    code: `REPORT z_belajar_kinerja.

TYPES: BEGIN OF ty_teks,
         matnr TYPE makt-matnr,
         maktx TYPE makt-maktx,
       END OF ty_teks.
DATA: gt_item TYPE STANDARD TABLE OF vbap,
      gs_makt TYPE makt,
      gt_teks TYPE HASHED TABLE OF ty_teks WITH UNIQUE KEY matnr,
      gv_t0   TYPE i,
      gv_t1   TYPE i,
      gv_lama TYPE i.

SELECT * FROM vbap INTO TABLE gt_item.

* CARA LAMBAT: satu akses database untuk setiap baris
GET RUN TIME FIELD gv_t0.
LOOP AT gt_item INTO DATA(gs_item).
  SELECT SINGLE * FROM makt INTO gs_makt
    WHERE matnr = gs_item-matnr AND spras = 'EN'.
ENDLOOP.
GET RUN TIME FIELD gv_t1.
gv_lama = gv_t1 - gv_t0.
WRITE: / 'Cara 1 - SELECT di dalam LOOP :', lines( gt_item ), 'akses database'.

* CARA CEPAT: baca sekali, simpan di tabel HASHED, cari lewat key
GET RUN TIME FIELD gv_t0.
SELECT matnr maktx FROM makt INTO TABLE gt_teks WHERE spras = 'EN'.
LOOP AT gt_item INTO gs_item.
  READ TABLE gt_teks INTO DATA(gs_teks) WITH TABLE KEY matnr = gs_item-matnr.
ENDLOOP.
GET RUN TIME FIELD gv_t1.
gv_lama = gv_t1 - gv_t0.
WRITE: / 'Cara 2 - sekali baca + HASHED  : 1 akses database'.

* CARA TERBAIK bila hanya perlu gabungan: biarkan database yang menggabung
SELECT p~vbeln, p~posnr, t~maktx
  FROM vbap AS p INNER JOIN makt AS t ON t~matnr = p~matnr
  WHERE t~spras = 'EN'
  INTO TABLE @DATA(gt_gabung).
WRITE: / 'Cara 3 - JOIN                  : 1 akses database,', lines( gt_gabung ), 'baris'.

SKIP.
WRITE: / 'Lihat baris "Database" di bawah output: akses dihitung, dan'.
WRITE: / 'SELECT yang berulang di dalam loop ditandai.'.`,
    task: `<ul>
      <li>Jalankan dan baca baris <b>Database</b>: baris kode mana yang ditandai, dan berapa kali ia dijalankan?</li>
      <li>Hapus Cara 1, jalankan lagi, dan bandingkan jumlah akses databasenya.</li>
      <li>Tulis Cara 4 dengan <tt>FOR ALL ENTRIES IN gt_item</tt>.</li>
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
    code: `REPORT z_belajar_unit_test.

* --- kode yang diuji ----------------------------------------------------
CLASS lcl_diskon DEFINITION.
  PUBLIC SECTION.
    METHODS persen IMPORTING iv_total TYPE i RETURNING VALUE(rv_persen) TYPE i.
    METHODS bayar  IMPORTING iv_total TYPE i RETURNING VALUE(rv_bayar) TYPE i.
ENDCLASS.

CLASS lcl_diskon IMPLEMENTATION.
  METHOD persen.
    rv_persen = COND #( WHEN iv_total >= 10000000 THEN 10
                        WHEN iv_total >= 5000000  THEN 5
                        ELSE 0 ).
  ENDMETHOD.
  METHOD bayar.
    rv_bayar = iv_total - iv_total * persen( iv_total ) / 100.
  ENDMETHOD.
ENDCLASS.

* --- test class: tidak ikut berjalan saat program di-Run ------------------
CLASS ltc_diskon DEFINITION FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.
  PRIVATE SECTION.
    DATA mo_cut TYPE REF TO lcl_diskon.          " cut = class under test
    METHODS setup.
    METHODS tanpa_diskon   FOR TESTING.
    METHODS batas_5_persen FOR TESTING.
    METHODS diskon_besar   FOR TESTING.
    METHODS jumlah_bayar   FOR TESTING.
ENDCLASS.

CLASS ltc_diskon IMPLEMENTATION.
  METHOD setup.
    mo_cut = NEW #( ).
  ENDMETHOD.
  METHOD tanpa_diskon.
    cl_abap_unit_assert=>assert_equals( act = mo_cut->persen( 4999999 ) exp = 0 ).
  ENDMETHOD.
  METHOD batas_5_persen.
    cl_abap_unit_assert=>assert_equals( act = mo_cut->persen( 5000000 ) exp = 5
                                        msg = 'Tepat 5 juta sudah dapat 5 persen' ).
  ENDMETHOD.
  METHOD diskon_besar.
    cl_abap_unit_assert=>assert_equals( act = mo_cut->persen( 25000000 ) exp = 10 ).
  ENDMETHOD.
  METHOD jumlah_bayar.
    cl_abap_unit_assert=>assert_equals( act = mo_cut->bayar( 10000000 ) exp = 9000000 ).
    cl_abap_unit_assert=>assert_equals( act = mo_cut->bayar( 1000 ) exp = 1000 ).
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(go_diskon) = NEW lcl_diskon( ).
  DATA(gv_bayar) = go_diskon->bayar( 12000000 ).
  WRITE: / 'Bayar untuk 12.000.000 :', gv_bayar.
  WRITE: / 'Test tidak berjalan lewat Run. Buka menu titik tiga, pilih Jalankan Unit Test.'.`,
    task: `<ul>
      <li>Jalankan unit test-nya: keempat test harus lulus.</li>
      <li>Ubah <tt>&gt;= 5000000</tt> menjadi <tt>&gt; 5000000</tt> di method <tt>persen</tt>, jalankan test lagi, dan baca laporan kegagalannya.</li>
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
        <li><b>Singleton</b>: class dengan <tt>CREATE PRIVATE</tt> tidak bisa dibuat dengan <tt>NEW</tt> dari luar. Satu-satunya jalan adalah method static (<tt>ambil</tt>), yang menyimpan objeknya di <tt>CLASS-DATA</tt> dan selalu mengembalikan objek yang sama. Cocok untuk pengaturan, log, atau buffer yang harus tunggal.</li>
        <li><b>Factory</b>: sebuah method menerima "jenis" dan mengembalikan objek yang sesuai, bertipe interface. Pemanggil hanya mengenal interface-nya.</li>
        <li>Karena itu, menambah jenis baru — misalnya pengiriman laut — hanya menyentuh factory dan satu class baru. Program utama tidak berubah.</li>
        <li>Anda sudah memakai factory berkali-kali: <tt>cl_salv_table=>factory( )</tt>.</li>
      </ul>
      <p>Jangan berlebihan: singleton adalah data global yang tersamar dan menyulitkan unit test. Pakai hanya bila objeknya memang harus satu.</p>`,
    code: `REPORT z_belajar_pola_desain.

* --- Singleton: hanya boleh ada SATU objek pengaturan -----------------------
CLASS lcl_pengaturan DEFINITION CREATE PRIVATE.
  PUBLIC SECTION.
    CLASS-METHODS ambil RETURNING VALUE(ro_objek) TYPE REF TO lcl_pengaturan.
    DATA mv_mata_uang TYPE string VALUE 'IDR'.
  PRIVATE SECTION.
    CLASS-DATA go_satu TYPE REF TO lcl_pengaturan.
ENDCLASS.

CLASS lcl_pengaturan IMPLEMENTATION.
  METHOD ambil.
    IF go_satu IS NOT BOUND.
      go_satu = NEW #( ).
    ENDIF.
    ro_objek = go_satu.
  ENDMETHOD.
ENDCLASS.

* --- Factory: pemanggil meminta "sebuah pengirim", bukan class tertentu -------
INTERFACE lif_pengirim.
  METHODS nama   RETURNING VALUE(rv_nama) TYPE string.
  METHODS ongkos IMPORTING iv_berat TYPE i RETURNING VALUE(rv_ongkos) TYPE i.
ENDINTERFACE.

CLASS lcl_darat DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_pengirim.
ENDCLASS.
CLASS lcl_darat IMPLEMENTATION.
  METHOD lif_pengirim~nama.
    rv_nama = 'Darat'.
  ENDMETHOD.
  METHOD lif_pengirim~ongkos.
    rv_ongkos = iv_berat * 2000.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_udara DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_pengirim.
ENDCLASS.
CLASS lcl_udara IMPLEMENTATION.
  METHOD lif_pengirim~nama.
    rv_nama = 'Udara'.
  ENDMETHOD.
  METHOD lif_pengirim~ongkos.
    rv_ongkos = iv_berat * 9000 + 25000.
  ENDMETHOD.
ENDCLASS.

CLASS lcl_pabrik DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS buat IMPORTING iv_jenis TYPE string
                       RETURNING VALUE(ro_pengirim) TYPE REF TO lif_pengirim.
ENDCLASS.
CLASS lcl_pabrik IMPLEMENTATION.
  METHOD buat.
    CASE iv_jenis.
      WHEN 'UDARA'.
        ro_pengirim = NEW lcl_udara( ).
      WHEN OTHERS.
        ro_pengirim = NEW lcl_darat( ).
    ENDCASE.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
* dua kali "ambil", tetapi objeknya satu: perubahan lewat go_a terlihat lewat go_b
  DATA(go_a) = lcl_pengaturan=>ambil( ).
  DATA(go_b) = lcl_pengaturan=>ambil( ).
  go_a->mv_mata_uang = 'USD'.
  WRITE: / 'Mata uang lewat go_b:', go_b->mv_mata_uang.

* program utama tidak menyebut lcl_darat / lcl_udara sama sekali
  DATA gt_jenis TYPE STANDARD TABLE OF string WITH EMPTY KEY.
  gt_jenis = VALUE #( ( 'DARAT' ) ( 'UDARA' ) ).
  SKIP.
  LOOP AT gt_jenis INTO DATA(gv_jenis).
    DATA(go_kirim)  = lcl_pabrik=>buat( gv_jenis ).
    DATA(gv_nama)   = go_kirim->nama( ).
    DATA(gv_ongkos) = go_kirim->ongkos( 10 ).
    WRITE: / gv_nama, 10 gv_ongkos, 'untuk 10 kg'.
  ENDLOOP.`,
    task: `<ul>
      <li>Tambahkan <tt>lcl_laut</tt> (ongkos = berat × 1.200 + 50.000) dan daftarkan di factory dengan jenis <tt>LAUT</tt>.</li>
      <li>Tulis <tt>DATA(go_x) = NEW lcl_pengaturan( ).</tt> di program utama dan baca pesan error-nya.</li>
      <li>Tambahkan method <tt>hari</tt> ke interface, yang mengembalikan lama pengiriman tiap jenis.</li>
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
        <li>Nama dalam kurung juga berlaku di Open SQL: <tt>FROM (p_tabel)</tt>, bahkan <tt>WHERE (gv_kondisi)</tt> dengan kondisi berupa teks.</li>
        <li><tt>describe_by_data( variabel )</tt> melakukan hal yang sama untuk variabel yang sudah ada.</li>
      </ul>
      <p>Kode generik tidak diperiksa compiler: nama tabel yang salah baru ketahuan saat program berjalan. Dan jangan pernah menyusun <tt>WHERE</tt> dinamis langsung dari input pengguna tanpa memeriksanya — di situlah celah SQL injection.</p>`,
    code: `REPORT z_belajar_generik.

PARAMETERS: p_tabel TYPE string DEFAULT 'SCARR',
            p_baris TYPE i DEFAULT 2.

DATA: gr_data  TYPE REF TO data,
      gv_kolom TYPE i.
FIELD-SYMBOLS: <gt_data>  TYPE STANDARD TABLE,
               <gs_baris> TYPE any,
               <gv_nilai> TYPE any.

START-OF-SELECTION.
* 1) RTTS: bentuk tabel dikenali saat program berjalan
  DATA(go_struk) = CAST cl_abap_structdescr( cl_abap_typedescr=>describe_by_name( p_tabel ) ).
  gv_kolom = lines( go_struk->components ).
  WRITE: / 'Tabel', p_tabel, 'punya', gv_kolom, 'kolom'.

* 2) Internal table dibuat sesuai nama itu, lalu diisi dengan SELECT dinamis
  CREATE DATA gr_data TYPE STANDARD TABLE OF (p_tabel).
  ASSIGN gr_data->* TO <gt_data>.
  SELECT * FROM (p_tabel) INTO TABLE <gt_data> UP TO p_baris ROWS.

* 3) Semua kolom dicetak tanpa tahu satu pun namanya
  LOOP AT <gt_data> ASSIGNING <gs_baris>.
    SKIP.
    LOOP AT go_struk->components INTO DATA(gs_kolom).
      ASSIGN COMPONENT gs_kolom-name OF STRUCTURE <gs_baris> TO <gv_nilai>.
      IF sy-subrc = 0.
        WRITE: / gs_kolom-name, 14 gs_kolom-type_kind, 18 <gv_nilai>.
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
    code: `REPORT z_belajar_transaksi.

PARAMETERS: p_vbeln TYPE vbak-vbeln DEFAULT '0000000010',
            p_naik  TYPE i DEFAULT 10.              " kenaikan nilai dalam persen

DATA: gv_lama  TYPE vbak-netwr,
      gv_baru  TYPE vbak-netwr,
      gv_nomor TYPE n LENGTH 10,
      gs_mat   TYPE bapimatdoa,
      gs_ret   TYPE bapireturn.

START-OF-SELECTION.
* 1) Otorisasi: bolehkah pengguna ini mengubah (ACTVT 02) order?
  AUTHORITY-CHECK OBJECT 'V_VBAK_AAT' ID 'AUART' FIELD 'TA' ID 'ACTVT' FIELD '02'.
  IF sy-subrc <> 0.
    MESSAGE 'Tidak punya otorisasi untuk mengubah order' TYPE 'E'.
  ENDIF.

* 2) Kunci dokumennya, supaya tidak diubah dua orang pada saat yang sama
  CALL FUNCTION 'ENQUEUE_EVVBAKE'
    EXPORTING
      vbeln          = p_vbeln
    EXCEPTIONS
      foreign_lock   = 1
      system_failure = 2
      OTHERS         = 3.
  IF sy-subrc <> 0.
    WRITE: / 'Order', p_vbeln, 'sedang dibuka oleh', sy-msgv1, '- coba lagi nanti.'.
    RETURN.
  ENDIF.

* 3) Ubah datanya. Semua perubahan baru permanen setelah COMMIT WORK.
  SELECT SINGLE netwr FROM vbak INTO gv_lama WHERE vbeln = p_vbeln.
  IF sy-subrc = 0.
    gv_baru = gv_lama * ( 100 + p_naik ) / 100.
    UPDATE vbak SET netwr = gv_baru WHERE vbeln = p_vbeln.
    CALL FUNCTION 'NUMBER_GET_NEXT'
      EXPORTING
        nr_range_nr = '01'
        object      = 'ZUBAH'
      IMPORTING
        number      = gv_nomor.
    COMMIT WORK.
    WRITE: / 'Nilai lama :', gv_lama.
    WRITE: / 'Nilai baru :', gv_baru.
    WRITE: / 'Nomor perubahan:', gv_nomor.
  ELSE.
    ROLLBACK WORK.
    WRITE: / 'Order', p_vbeln, 'tidak ada - tidak ada yang diubah.'.
  ENDIF.

* 4) Lepaskan kunci - selalu, apa pun hasilnya
  CALL FUNCTION 'DEQUEUE_EVVBAKE'
    EXPORTING
      vbeln = p_vbeln.

* 5) BAPI melaporkan masalah lewat parameter RETURN, bukan lewat exception
  CALL FUNCTION 'BAPI_MATERIAL_GET_DETAIL'
    EXPORTING
      material              = '9999-999'
    IMPORTING
      material_general_data = gs_mat
      return                = gs_ret.
  SKIP.
  IF gs_ret-type = 'E'.
    WRITE: / 'BAPI mengembalikan error:', gs_ret-message.
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
        <li><b>Class dengan tanggung jawab terpisah</b>: <tt>ambil_data</tt>, <tt>ringkas</tt>, <tt>tampilkan</tt>.</li>
      </ul>
      <p>Buka menu <b>Tabel</b> untuk melihat isi LIKP, LIPS, VBRK, dan VBRP, lalu cocokkan satu order dengan barisnya di laporan.</p>`,
    code: `REPORT z_studi_order_to_cash.

PARAMETERS p_vkorg TYPE vbak-vkorg DEFAULT '1000'.

CLASS lcl_o2c DEFINITION.
  PUBLIC SECTION.
    TYPES: BEGIN OF ty_baris,
             vbeln   TYPE vbak-vbeln,
             name1   TYPE kna1-name1,
             netwr   TYPE vbak-netwr,
             dikirim TYPE i,
             ditagih TYPE vbak-netwr,
             status  TYPE string,
           END OF ty_baris,
           tt_baris TYPE STANDARD TABLE OF ty_baris WITH EMPTY KEY.
    METHODS constructor IMPORTING iv_vkorg TYPE vbak-vkorg.
    METHODS ambil_data.
    METHODS ringkas.
    METHODS tampilkan.
  PRIVATE SECTION.
    DATA: mv_vkorg TYPE vbak-vkorg,
          mt_data  TYPE tt_baris.
ENDCLASS.

CLASS lcl_o2c IMPLEMENTATION.
  METHOD constructor.
    mv_vkorg = iv_vkorg.
  ENDMETHOD.

  METHOD ambil_data.
*   order + nama pelanggan: satu SELECT dengan JOIN
    SELECT a~vbeln, k~name1, a~netwr
      FROM vbak AS a INNER JOIN kna1 AS k ON k~kunnr = a~kunnr
      WHERE a~vkorg = @mv_vkorg
      ORDER BY a~vbeln
      INTO CORRESPONDING FIELDS OF TABLE @mt_data.
    IF mt_data IS INITIAL.
      RETURN.
    ENDIF.

*   nilai tagihan dan jumlah item terkirim: dihitung database, dibaca SEKALI
    SELECT aubel, SUM( netwr ) AS nilai FROM vbrp
      GROUP BY aubel
      INTO TABLE @DATA(lt_tagih).
    SELECT vgbel, COUNT( * ) AS jumlah FROM lips
      GROUP BY vgbel
      INTO TABLE @DATA(lt_kirim).

    LOOP AT mt_data ASSIGNING FIELD-SYMBOL(<ls_baris>).
      <ls_baris>-ditagih = VALUE #( lt_tagih[ aubel = <ls_baris>-vbeln ]-nilai OPTIONAL ).
      <ls_baris>-dikirim = VALUE #( lt_kirim[ vgbel = <ls_baris>-vbeln ]-jumlah OPTIONAL ).
      <ls_baris>-status = COND #(
        WHEN <ls_baris>-ditagih >= <ls_baris>-netwr THEN 'DITAGIH PENUH'
        WHEN <ls_baris>-ditagih > 0                 THEN 'DITAGIH SEBAGIAN'
        WHEN <ls_baris>-dikirim > 0                 THEN 'DIKIRIM'
        ELSE 'BUKA' ).
    ENDLOOP.
  ENDMETHOD.

  METHOD ringkas.
    DATA lv_nilai TYPE vbak-netwr.
    LOOP AT mt_data INTO DATA(ls_baris)
         GROUP BY ( status = ls_baris-status jumlah = GROUP SIZE )
         ASCENDING INTO DATA(ls_grup).
      CLEAR lv_nilai.
      LOOP AT GROUP ls_grup INTO DATA(ls_anggota).
        lv_nilai = lv_nilai + ls_anggota-netwr.
      ENDLOOP.
      WRITE: / ls_grup-status, 20 ls_grup-jumlah, 'order', 34 lv_nilai.
    ENDLOOP.
  ENDMETHOD.

  METHOD tampilkan.
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
  DATA(go_laporan) = NEW lcl_o2c( p_vkorg ).
  go_laporan->ambil_data( ).
  go_laporan->ringkas( ).
  go_laporan->tampilkan( ).`,
    task: `<ul>
      <li>Tambahkan kolom <tt>sisa</tt>: nilai order dikurangi nilai yang sudah ditagih.</li>
      <li>Tambahkan parameter yang menyaring laporan menurut status.</li>
      <li>Pindahkan aturan status ke method tersendiri yang menerima <tt>netwr</tt>, <tt>ditagih</tt>, <tt>dikirim</tt>, lalu tulis test class untuknya.</li>
      <li>Ganti pencarian <tt>lt_tagih[ … ]</tt> dengan tabel <tt>HASHED</tt> ber-key <tt>aubel</tt>.</li>
    </ul>`
  }
];

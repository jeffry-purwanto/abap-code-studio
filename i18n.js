// ============================================================
// ABAP Code Studio — interface languages
// Every entry: key: [Indonesia, English, Deutsch, 中文]
//   tr('key', { name: 'X' })  → text in the current language, {name} replaced
//   HTML: data-i18n="key" (text), data-i18n-html="key" (markup),
//         data-i18n-title / data-i18n-ph / data-i18n-aria (attributes)
// The language is kept in localStorage; changing it fires the "langchange" event.
// ============================================================
(function () {
  'use strict';

  const LANGS = [
    { code: 'id', name: 'Bahasa Indonesia', short: 'ID', locale: 'id-ID' },
    { code: 'en', name: 'English',          short: 'EN', locale: 'en-GB' },
    { code: 'de', name: 'Deutsch',          short: 'DE', locale: 'de-DE' },
    { code: 'zh', name: '中文',              short: '中文', locale: 'zh-CN' }
  ];

  const D = {
    // ── navigation rail
    'nav.aria':         ['Navigasi utama', 'Main navigation', 'Hauptnavigation', '主导航'],
    'nav.editor':       ['Editor', 'Editor', 'Editor', '编辑器'],
    'nav.learn':        ['Belajar', 'Learn', 'Lernen', '学习'],
    'nav.learn.tip':    ['Jalur belajar', 'Learning path', 'Lernpfad', '学习路径'],
    'nav.files':        ['Program', 'Programs', 'Programme', '程序'],
    'nav.files.tip':    ['Semua program', 'All programs', 'Alle Programme', '所有程序'],
    'nav.tables':       ['Tabel', 'Tables', 'Tabellen', '数据表'],
    'nav.tables.tip':   ['Tabel database contoh', 'Sample database tables', 'Beispiel-Datenbanktabellen', '示例数据库表'],
    'nav.snippets':     ['Snippet', 'Snippets', 'Snippets', '代码片段'],
    'nav.snippets.tip': ['Contoh kode siap pakai', 'Ready-to-use code examples', 'Fertige Codebeispiele', '可直接使用的代码示例'],
    'nav.docs':         ['Docs', 'Docs', 'Doku', '文档'],
    'nav.docs.tip':     ['Referensi cepat', 'Quick reference', 'Kurzreferenz', '快速参考'],
    'lang.tip':         ['Bahasa', 'Language', 'Sprache', '语言'],
    'content.notice': [
      '',
      'This text has not been translated into English yet, so it is shown in Indonesian.',
      'Dieser Text ist noch nicht ins Deutsche übersetzt und wird daher auf Indonesisch angezeigt.',
      '这段内容尚未翻译成中文，因此以印度尼西亚语显示。'
    ],

    // ── editor: sidebar and bar
    'side.programs':   ['Program', 'Programs', 'Programme', '程序'],
    'side.new.tip':    ['Program baru (Ctrl+N)', 'New program (Ctrl+N)', 'Neues Programm (Strg+N)', '新建程序 (Ctrl+N)'],
    'side.empty':      ['Belum ada program', 'No programs yet', 'Noch keine Programme', '还没有程序'],
    'bar.param':       ['Parameter', 'Parameters', 'Parameter', '参数'],
    'bar.param.tip':   ['Buka selection screen untuk mengisi PARAMETERS / SELECT-OPTIONS (F8)', 'Open the selection screen to fill in PARAMETERS / SELECT-OPTIONS (F8)', 'Selektionsbild öffnen, um PARAMETERS / SELECT-OPTIONS zu füllen (F8)', '打开选择屏幕以填写 PARAMETERS / SELECT-OPTIONS (F8)'],
    'bar.run':         ['Run', 'Run', 'Ausführen', '运行'],
    'bar.run.tip':     ['Jalankan program (Ctrl+Enter)', 'Run the program (Ctrl+Enter)', 'Programm ausführen (Strg+Enter)', '运行程序 (Ctrl+Enter)'],
    'bar.running':     ['Berjalan…', 'Running…', 'Läuft…', '运行中…'],
    'bar.more':        ['Lainnya', 'More', 'Mehr', '更多'],
    'menu.pretty':     ['Pretty Printer', 'Pretty Printer', 'Pretty Printer', 'Pretty Printer（代码格式化）'],
    'menu.unit':       ['Jalankan Unit Test', 'Run unit tests', 'Unit-Tests ausführen', '运行单元测试'],
    'menu.save':       ['Simpan', 'Save', 'Speichern', '保存'],
    'menu.new':        ['Program baru', 'New program', 'Neues Programm', '新建程序'],
    'menu.export':     ['Export ke file .abap', 'Export to .abap file', 'Als .abap-Datei exportieren', '导出为 .abap 文件'],
    'menu.import':     ['Import file…', 'Import file…', 'Datei importieren…', '导入文件…'],
    'menu.sap':        ['Layar hasil gaya SAP', 'SAP-style result screen', 'Ergebnisbild im SAP-Stil', 'SAP 风格结果屏幕'],
    'menu.sap.sub':    ['Jendela lebar setelah Run', 'Wide window after Run', 'Breites Fenster nach dem Ausführen', '运行后打开宽窗口'],
    'menu.sap.tip':    ['Setelah Run, hasil dibuka di jendela lebar bergaya SAP GUI (Esc / F3 untuk kembali)', 'After Run the result opens in a wide SAP GUI style window (Esc / F3 to go back)', 'Nach dem Ausführen öffnet sich das Ergebnis in einem breiten Fenster im SAP-GUI-Stil (Esc / F3 = zurück)', '运行后结果在 SAP GUI 风格的宽窗口中打开（Esc / F3 返回）'],
    'menu.theme':      ['Tema', 'Theme', 'Design', '主题'],
    'theme.dark':      ['Gelap', 'Dark', 'Dunkel', '深色'],
    'theme.light':     ['Terang', 'Light', 'Hell', '浅色'],

    // ── result panel
    'panel.output':    ['Output', 'Output', 'Ausgabe', '输出'],
    'panel.syntax':    ['Syntax', 'Syntax', 'Syntax', '语法'],
    'panel.vars':      ['Variabel', 'Variables', 'Variablen', '变量'],
    'panel.sap.tip':   ['Buka hasil di layar lebar gaya SAP', 'Open the result in the wide SAP-style screen', 'Ergebnis im breiten SAP-Bild öffnen', '在 SAP 风格宽屏中打开结果'],
    'panel.clear.tip': ['Bersihkan output', 'Clear output', 'Ausgabe leeren', '清空输出'],
    'ph.run':          ['Tekan <strong>Run</strong> untuk menjalankan program', 'Press <strong>Run</strong> to execute the program', '<strong>Ausführen</strong> drücken, um das Programm zu starten', '点击<strong>运行</strong>来执行程序'],
    'ph.syntax':       ['Belum ada pemeriksaan syntax', 'No syntax check yet', 'Noch keine Syntaxprüfung', '尚未进行语法检查'],
    'ph.vars':         ['Isi variabel tampil setelah program dijalankan', 'Variable contents appear after the program has run', 'Variableninhalte erscheinen nach dem Programmlauf', '程序运行后显示变量内容'],
    'out.empty':       ['Program selesai tanpa output.', 'Program finished without output.', 'Programm ohne Ausgabe beendet.', '程序已结束，没有输出。'],
    'out.linesel.tip': ['Klik dua kali: AT LINE-SELECTION', 'Double-click: AT LINE-SELECTION', 'Doppelklick: AT LINE-SELECTION', '双击：AT LINE-SELECTION'],
    'out.messages':    ['Pesan', 'Messages', 'Meldungen', '消息'],
    'out.runtime':     ['Runtime error', 'Runtime error', 'Laufzeitfehler', '运行时错误'],
    'out.goto.tip':    ['Lompat ke baris ini', 'Jump to this line', 'Zu dieser Zeile springen', '跳转到此行'],
    'out.line':        ['Baris {n}', 'Line {n}', 'Zeile {n}', '第 {n} 行'],
    'vars.none':       ['Tidak ada variabel', 'No user variables', 'Keine Variablen', '没有变量'],
    'vars.name':       ['Variabel', 'Variable', 'Variable', '变量'],
    'vars.type':       ['Tipe', 'Type', 'Typ', '类型'],
    'vars.value':      ['Nilai', 'Value', 'Wert', '值'],
    'vars.rows':       ['[{n} baris]', '[{n} rows]', '[{n} Zeilen]', '[{n} 行]'],

    // ── unit tests and database statistics
    'unit.none':        ['Program ini tidak punya test class. Tulis CLASS … DEFINITION FOR TESTING dengan METHODS … FOR TESTING.', 'This program has no test class. Write CLASS … DEFINITION FOR TESTING with METHODS … FOR TESTING.', 'Dieses Programm hat keine Testklasse. Schreiben Sie CLASS … DEFINITION FOR TESTING mit METHODS … FOR TESTING.', '此程序没有测试类。请编写 CLASS … DEFINITION FOR TESTING，并用 METHODS … FOR TESTING 声明测试方法。'],
    'unit.summary.ok':  ['Unit test: semua {n} test lulus', 'Unit tests: all {n} tests passed', 'Unit-Tests: alle {n} Tests bestanden', '单元测试：{n} 个测试全部通过'],
    'unit.summary.fail':['Unit test: {f} dari {n} test gagal', 'Unit tests: {f} of {n} tests failed', 'Unit-Tests: {f} von {n} Tests fehlgeschlagen', '单元测试：{n} 个测试中有 {f} 个失败'],
    'unit.asserts':     ['{n} pemeriksaan', '{n} checks', '{n} Prüfungen', '{n} 项检查'],
    'unit.expected':    ['diharapkan {exp}, hasilnya {act}', 'expected {exp}, got {act}', 'erwartet {exp}, erhalten {act}', '期望 {exp}，实际 {act}'],
    'unit.exception':   ['exception {cls} tidak ditangkap', 'exception {cls} was not caught', 'Ausnahme {cls} wurde nicht abgefangen', '异常 {cls} 未被捕获'],
    'unit.stopped':     ['test dihentikan oleh MESSAGE / STOP', 'the test was stopped by MESSAGE / STOP', 'Test durch MESSAGE / STOP gestoppt', '测试被 MESSAGE / STOP 中止'],
    'unit.noimpl':      ['method test belum punya implementasi', 'the test method has no implementation', 'die Testmethode hat keine Implementierung', '测试方法没有实现'],
    'perf.title':       ['Database', 'Database', 'Datenbank', '数据库'],
    'perf.reads':       ['{n} akses baca, {rows} baris', '{n} read accesses, {rows} rows', '{n} Lesezugriffe, {rows} Zeilen', '{n} 次读取，{rows} 行'],
    'perf.writes':      ['{n} perubahan', '{n} changes', '{n} Änderungen', '{n} 次修改'],
    'perf.repeated':    ['SELECT ini dijalankan {n} kali di dalam loop — satu akses database per putaran. Ambil datanya sekali di luar loop (JOIN atau FOR ALL ENTRIES), lalu baca dari internal table.', 'this SELECT ran {n} times inside a loop — one database access per pass. Read the data once outside the loop (JOIN or FOR ALL ENTRIES), then look it up in the internal table.', 'dieses SELECT lief {n}-mal innerhalb einer Schleife — ein Datenbankzugriff pro Durchlauf. Lesen Sie die Daten einmal außerhalb der Schleife (JOIN oder FOR ALL ENTRIES) und schlagen Sie dann in der internen Tabelle nach.', '这条 SELECT 在循环内执行了 {n} 次——每次循环访问一次数据库。请在循环外一次性读取数据（JOIN 或 FOR ALL ENTRIES），然后在内表中查找。'],

    // ── SAP-style result screen
    'sap.aria':        ['Hasil program', 'Program result', 'Programmergebnis', '程序结果'],
    'sap.close.tip':   ['Tutup (Esc)', 'Close (Esc)', 'Schließen (Esc)', '关闭 (Esc)'],
    'sap.back':        ['Back', 'Back', 'Zurück', '返回'],
    'sap.back.tip':    ['Back (F3)', 'Back (F3)', 'Zurück (F3)', '返回 (F3)'],
    'sap.sel':         ['Selection Screen', 'Selection Screen', 'Selektionsbild', '选择屏幕'],
    'sap.sel.tip':     ['Kembali ke selection screen (F8)', 'Back to the selection screen (F8)', 'Zurück zum Selektionsbild (F8)', '返回选择屏幕 (F8)'],
    'sap.run.tip':     ['Jalankan lagi dengan nilai DEFAULT', 'Run again with the DEFAULT values', 'Erneut mit den DEFAULT-Werten ausführen', '使用 DEFAULT 值重新运行'],
    'sap.hint':        ['Klik judul kolom untuk memilihnya · klik dua kali untuk mengurutkan', 'Click a column heading to select it · double-click to sort', 'Spaltenüberschrift anklicken = markieren · Doppelklick = sortieren', '单击列标题可选中 · 双击可排序'],
    'sap.st.lines':    ['{n} baris list', '{n} list lines', '{n} Listzeilen', '{n} 行列表'],
    'sap.st.grids':    [', {n} ALV grid', ', {n} ALV grid(s)', ', {n} ALV-Grid(s)', '，{n} 个 ALV 表格'],
    'sap.st.issues':   ['{e} error, {w} peringatan (lihat bagian Pesan)', '{e} error(s), {w} warning(s) (see Messages)', '{e} Fehler, {w} Warnung(en) (siehe Meldungen)', '{e} 个错误，{w} 个警告（见“消息”）'],
    'toast.runfirst':  ['Jalankan program dulu (tombol Run)', 'Run the program first (Run button)', 'Programm zuerst ausführen (Schaltfläche Ausführen)', '请先运行程序（“运行”按钮）'],

    // ── ALV block
    'alv.filter':      ['Filter…', 'Filter…', 'Filter…', '筛选…'],
    'alv.asc.tip':     ['Urut naik — pilih kolom dulu dengan klik judulnya', 'Sort ascending — select a column first by clicking its heading', 'Aufsteigend sortieren — zuerst Spalte per Klick auf die Überschrift markieren', '升序排序 — 请先单击列标题选中该列'],
    'alv.desc.tip':    ['Urut turun — pilih kolom dulu dengan klik judulnya', 'Sort descending — select a column first by clicking its heading', 'Absteigend sortieren — zuerst Spalte per Klick auf die Überschrift markieren', '降序排序 — 请先单击列标题选中该列'],
    'alv.sum.tip':     ['Total (Σ) kolom terpilih / semua kolom angka', 'Total (Σ) of the selected column / all numeric columns', 'Summe (Σ) der markierten Spalte / aller Zahlenspalten', '所选列 / 所有数值列的合计 (Σ)'],
    'alv.csv.tip':     ['Export ke CSV (spreadsheet)', 'Export to CSV (spreadsheet)', 'Als CSV exportieren (Tabellenkalkulation)', '导出为 CSV（电子表格）'],
    'alv.hint':        ['Interaktif:', 'Interactive:', 'Interaktiv:', '可交互：'],
    'alv.hint.hot':    ['klik sel berwarna biru', 'click a blue cell', 'blaue Zelle anklicken', '单击蓝色单元格'],
    'alv.hint.or':     [' atau ', ' or ', ' oder ', ' 或 '],
    'alv.hint.dbl':    ['klik dua kali sebuah baris', 'double-click a row', 'Zeile doppelklicken', '双击某一行'],
    'alv.count':       ['{n} baris', '{n} rows', '{n} Zeilen', '{n} 行'],
    'alv.count.f':     ['{f} / {n} baris', '{f} / {n} rows', '{f} / {n} Zeilen', '{f} / {n} 行'],
    'alv.th.tip':      ['Field: {f} — klik: pilih kolom, klik dua kali: sort', 'Field: {f} — click: select column, double-click: sort', 'Feld: {f} — Klick: Spalte markieren, Doppelklick: sortieren', '字段：{f} — 单击：选中列，双击：排序'],
    'alv.nomatch':     ['Tidak ada baris yang cocok dengan filter.', 'No rows match the filter.', 'Keine Zeilen entsprechen dem Filter.', '没有符合筛选条件的行。'],
    'alv.emptytab':    ['Internal table kosong — tidak ada data untuk ditampilkan.', 'The internal table is empty — there is no data to display.', 'Die interne Tabelle ist leer — keine Daten zum Anzeigen.', '内表为空 — 没有可显示的数据。'],
    'toast.alv.pick':  ['Pilih kolom dulu: klik judul kolomnya', 'Select a column first: click its heading', 'Zuerst eine Spalte markieren: Überschrift anklicken', '请先选中一列：单击其列标题'],
    'toast.alv.sumon': ['ALV: baris Total ditampilkan (Σ)', 'ALV: totals row shown (Σ)', 'ALV: Summenzeile eingeblendet (Σ)', 'ALV：已显示合计行 (Σ)'],
    'toast.alv.sumoff':['ALV: Total disembunyikan', 'ALV: totals hidden', 'ALV: Summen ausgeblendet', 'ALV：已隐藏合计'],
    'toast.alv.noout': ['Event dijalankan — handler tidak menghasilkan output', 'Event executed — the handler produced no output', 'Ereignis ausgeführt — der Handler erzeugte keine Ausgabe', '事件已执行 — 处理程序没有产生输出'],
    'toast.alv.nodata':['Tidak ada data ALV untuk di-export', 'There is no ALV data to export', 'Keine ALV-Daten zum Exportieren', '没有可导出的 ALV 数据'],
    'toast.alv.csv':   ['ALV berhasil di-export ke CSV!', 'ALV exported to CSV!', 'ALV als CSV exportiert!', 'ALV 已导出为 CSV！'],

    // ── learning path
    'learn.title':     ['Jalur Belajar ABAP', 'ABAP Learning Path', 'ABAP-Lernpfad', 'ABAP 学习路径'],
    'learn.sub':       ['Dari pemula sampai mahir — setiap pelajaran punya contoh yang bisa langsung dijalankan dan latihan untuk dicoba sendiri.', 'From beginner to advanced — every lesson has an example you can run right away and an exercise to try yourself.', 'Vom Einsteiger zum Profi — jede Lektion hat ein sofort ausführbares Beispiel und eine Übung zum Selbstprobieren.', '从入门到精通 — 每节课都有可立即运行的示例和供自己动手的练习。'],
    'learn.progress':  ['{done} dari {total} pelajaran selesai', '{done} of {total} lessons completed', '{done} von {total} Lektionen abgeschlossen', '已完成 {done} / {total} 节课'],
    'learn.level':     ['Level {n}', 'Level {n}', 'Stufe {n}', '第 {n} 级'],
    'level.1':         ['Pemula', 'Beginner', 'Einsteiger', '入门'],
    'level.2':         ['Dasar', 'Basics', 'Grundlagen', '基础'],
    'level.3':         ['Menengah', 'Intermediate', 'Fortgeschritten', '中级'],
    'level.4':         ['Mahir', 'Advanced', 'Profi', '高级'],
    'level.5':         ['Pakar', 'Expert', 'Experte', '专家'],
    'learn.pos':       ['Pelajaran {i} dari {n}', 'Lesson {i} of {n}', 'Lektion {i} von {n}', '第 {i} 课，共 {n} 课'],
    'learn.goal':      ['Tujuan:', 'Goal:', 'Ziel:', '目标：'],
    'learn.example':   ['Contoh program', 'Example program', 'Beispielprogramm', '示例程序'],
    'learn.open':      ['Buka & Jalankan di Editor', 'Open & Run in the Editor', 'Im Editor öffnen & ausführen', '在编辑器中打开并运行'],
    'learn.reset':     ['Muat ulang kode asli', 'Reload the original code', 'Originalcode neu laden', '重新加载原始代码'],
    'learn.reset.tip': ['Buang perubahan Anda dan muat lagi kode contoh', 'Discard your changes and load the example code again', 'Eigene Änderungen verwerfen und den Beispielcode neu laden', '放弃您的修改并重新加载示例代码'],
    'learn.task':      ['Latihan', 'Exercise', 'Übung', '练习'],
    'learn.done':      ['✓ Selesai', '✓ Completed', '✓ Erledigt', '✓ 已完成'],
    'learn.mark':      ['Tandai selesai', 'Mark as completed', 'Als erledigt markieren', '标记为已完成'],

    // ── programs (file manager)
    'files.title':     ['Program Saya', 'My Programs', 'Meine Programme', '我的程序'],
    'files.sub':       ['Kelola semua program ABAP Anda', 'Manage all your ABAP programs', 'Alle eigenen ABAP-Programme verwalten', '管理您的所有 ABAP 程序'],
    'files.new':       ['+ Program baru', '+ New program', '+ Neues Programm', '+ 新建程序'],
    'files.empty':     ['Belum ada program. Klik "Program baru" untuk memulai.', 'No programs yet. Click "New program" to start.', 'Noch keine Programme. Mit „Neues Programm“ beginnen.', '还没有程序。点击“新建程序”开始。'],
    'files.delete':    ['Hapus', 'Delete', 'Löschen', '删除'],
    'files.meta':      ['{n} baris · {date}', '{n} lines · {date}', '{n} Zeilen · {date}', '{n} 行 · {date}'],
    'files.confirm':   ['Hapus "{name}"?', 'Delete "{name}"?', '„{name}“ löschen?', '删除“{name}”？'],
    'toast.saved':     ['Program disimpan ✓', 'Program saved ✓', 'Programm gespeichert ✓', '程序已保存 ✓'],
    'toast.created':   ['{name} dibuat', '{name} created', '{name} angelegt', '已创建 {name}'],
    'toast.deleted':   ['{name} dihapus', '{name} deleted', '{name} gelöscht', '已删除 {name}'],
    'toast.pp.clean':  ['Pretty Printer: kode sudah rapi ✓', 'Pretty Printer: the code is already tidy ✓', 'Pretty Printer: Code ist bereits formatiert ✓', 'Pretty Printer：代码已经很整齐 ✓'],
    'toast.pp.done':   ['Pretty Printer: kode dirapikan ✓', 'Pretty Printer: code formatted ✓', 'Pretty Printer: Code formatiert ✓', 'Pretty Printer：代码已格式化 ✓'],
    'toast.download':  ['File {name}.abap di-download!', 'File {name}.abap downloaded!', 'Datei {name}.abap heruntergeladen!', '文件 {name}.abap 已下载！'],
    'toast.import':    ['File {name} berhasil di-import!', 'File {name} imported!', 'Datei {name} importiert!', '文件 {name} 已导入！'],

    // ── database tables
    'tables.title':    ['Tabel Database', 'Database Tables', 'Datenbanktabellen', '数据库表'],
    'tables.sub':      ['Data contoh tabel standar SAP (seperti SE16N) untuk latihan SELECT', 'Sample data of standard SAP tables (like SE16N) for practising SELECT', 'Beispieldaten von SAP-Standardtabellen (wie SE16N) zum Üben von SELECT', 'SAP 标准表的示例数据（类似 SE16N），用于练习 SELECT'],
    'tables.gen':      ['Buat SELECT di Editor', 'Create SELECT in the Editor', 'SELECT im Editor erzeugen', '在编辑器中生成 SELECT'],
    'tables.label':    ['Tabel', 'Table', 'Tabelle', '表'],
    'tables.search':   ['Cari data, mis. Garuda, USD, FERT…', 'Search data, e.g. Garuda, USD, FERT…', 'Daten suchen, z. B. Garuda, USD, FERT…', '搜索数据，例如 Garuda、USD、FERT…'],
    'tables.rows':     ['{n} baris', '{n} rows', '{n} Zeilen', '{n} 行'],
    'tables.badge':    ['{f} dari {n} record · {c} field', '{f} of {n} records · {c} fields', '{f} von {n} Sätzen · {c} Felder', '{f} / {n} 条记录 · {c} 个字段'],
    'tables.nomatch':  ['Tidak ada data yang cocok dengan pencarian "{term}".', 'No data matches the search "{term}".', 'Keine Daten zur Suche „{term}“ gefunden.', '没有与“{term}”匹配的数据。'],
    'toast.select':    ['Program SELECT {table} dibuat!', 'SELECT program for {table} created!', 'SELECT-Programm für {table} angelegt!', '已创建 {table} 的 SELECT 程序！'],

    // ── snippets
    'snip.title':      ['Snippet & Template ABAP', 'ABAP Snippets & Templates', 'ABAP-Snippets & Vorlagen', 'ABAP 代码片段与模板'],
    'snip.sub':        ['Klik snippet untuk membukanya di editor', 'Click a snippet to open it in the editor', 'Snippet anklicken, um es im Editor zu öffnen', '点击代码片段在编辑器中打开'],
    'cat.all':         ['Semua', 'All', 'Alle', '全部'],
    'cat.basic':       ['Dasar', 'Basic', 'Grundlagen', '基础'],
    'cat.string':      ['String', 'String', 'String', '字符串'],
    'cat.loop':        ['Loop', 'Loop', 'Schleifen', '循环'],
    'cat.table':       ['Internal Table', 'Internal Table', 'Interne Tabelle', '内表'],
    'cat.alv':         ['ALV Grid', 'ALV Grid', 'ALV-Grid', 'ALV 表格'],
    'cat.function':    ['Function Module', 'Function Module', 'Funktionsbaustein', '函数模块'],
    'cat.select':      ['SELECT', 'SELECT', 'SELECT', 'SELECT'],
    'cat.class':       ['OO ABAP', 'OO ABAP', 'OO ABAP', '面向对象 ABAP'],
    'toast.snip.open': ['Program {name} dibuka', 'Program {name} opened', 'Programm {name} geöffnet', '已打开程序 {name}'],
    'toast.snip.new':  ['Snippet "{title}" dibuka sebagai program {name}', 'Snippet "{title}" opened as program {name}', 'Snippet „{title}“ als Programm {name} geöffnet', '代码片段“{title}”已作为程序 {name} 打开'],

    // ── docs
    'docs.title':      ['Referensi Cepat ABAP', 'ABAP Quick Reference', 'ABAP-Kurzreferenz', 'ABAP 快速参考'],
    'docs.sub':        ['Panduan cepat syntax dan keyword ABAP', 'A quick guide to ABAP syntax and keywords', 'Kurzanleitung zu ABAP-Syntax und Schlüsselwörtern', 'ABAP 语法与关键字速查'],

    // ── dialogs
    'new.title':       ['Program ABAP Baru', 'New ABAP Program', 'Neues ABAP-Programm', '新建 ABAP 程序'],
    'new.name':        ['Nama program', 'Program name', 'Programmname', '程序名称'],
    'new.template':    ['Template', 'Template', 'Vorlage', '模板'],
    'new.create':      ['Buat program', 'Create program', 'Programm anlegen', '创建程序'],
    'btn.cancel':      ['Batal', 'Cancel', 'Abbrechen', '取消'],
    'tpl.empty':       ['Program kosong', 'Empty program', 'Leeres Programm', '空程序'],
    'tpl.hello':       ['Hello World', 'Hello World', 'Hello World', 'Hello World'],
    'tpl.alv':         ['Laporan ALV Grid (CL_SALV_TABLE)', 'ALV Grid report (CL_SALV_TABLE)', 'ALV-Grid-Report (CL_SALV_TABLE)', 'ALV 表格报表 (CL_SALV_TABLE)'],
    'tpl.alv_fieldcat':['ALV klasik + field catalog (REUSE_ALV_GRID_DISPLAY)', 'Classic ALV + field catalog (REUSE_ALV_GRID_DISPLAY)', 'Klassisches ALV + Feldkatalog (REUSE_ALV_GRID_DISPLAY)', '经典 ALV + 字段目录 (REUSE_ALV_GRID_DISPLAY)'],
    'tpl.reuse_alv':   ['ALV klasik (i_structure_name)', 'Classic ALV (i_structure_name)', 'Klassisches ALV (i_structure_name)', '经典 ALV (i_structure_name)'],
    'tpl.function':    ['Function module (CALL FUNCTION)', 'Function module (CALL FUNCTION)', 'Funktionsbaustein (CALL FUNCTION)', '函数模块 (CALL FUNCTION)'],
    'tpl.select':      ['SELECT database (maskapai SCARR)', 'Database SELECT (SCARR airlines)', 'Datenbank-SELECT (Fluggesellschaften SCARR)', '数据库 SELECT（SCARR 航空公司）'],
    'tpl.report':      ['Template laporan', 'Report template', 'Report-Vorlage', '报表模板'],
    'tpl.loop':        ['Contoh loop', 'Loop example', 'Schleifen-Beispiel', '循环示例'],
    'tpl.table':       ['Internal table', 'Internal table', 'Interne Tabelle', '内表'],
    'tpl.class':       ['Class OO ABAP', 'OO ABAP class', 'OO-ABAP-Klasse', '面向对象 ABAP 类'],
    'sel.title':       ['Selection Screen (SE38 / SA38)', 'Selection Screen (SE38 / SA38)', 'Selektionsbild (SE38 / SA38)', '选择屏幕 (SE38 / SA38)'],
    'sel.exec':        ['Execute (F8)', 'Execute (F8)', 'Ausführen (F8)', '执行 (F8)'],
    'sel.group':       ['Kriteria seleksi / input parameter', 'Selection criteria / parameter input', 'Selektionskriterien / Parametereingabe', '选择条件 / 参数输入'],
    'sel.none':        ['Program ini tidak memiliki deklarasi <code>PARAMETERS</code> / <code>SELECT-OPTIONS</code>.', 'This program has no <code>PARAMETERS</code> / <code>SELECT-OPTIONS</code> declarations.', 'Dieses Programm hat keine <code>PARAMETERS</code>- / <code>SELECT-OPTIONS</code>-Deklarationen.', '此程序没有 <code>PARAMETERS</code> / <code>SELECT-OPTIONS</code> 声明。'],
    'sel.none.hint':   ['Klik <strong>Execute</strong> untuk langsung menjalankan program.', 'Click <strong>Execute</strong> to run the program right away.', 'Auf <strong>Ausführen</strong> klicken, um das Programm direkt zu starten.', '点击<strong>执行</strong>直接运行程序。'],
    'sel.from':        ['dari', 'from', 'von', '从'],
    'sel.to':          ['sampai', 'to', 'bis', '到'],
    'sel.to.short':    ['s/d', 'to', 'bis', '至']
  };

  // Default to Indonesian (the original language of the app); a saved choice wins.
  let lang = 'id';
  try { const saved = localStorage.getItem('abap_studio_lang'); if (saved && LANGS.some(l => l.code === saved)) lang = saved; } catch (e) { /* private mode */ }

  function tr(key, vars) {
    const entry = D[key];
    if (!entry) return key;
    const i = Math.max(0, LANGS.findIndex(l => l.code === lang));
    let s = entry[i] != null ? entry[i] : entry[0];
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? String(vars[k]) : m));
    return s;
  }

  // Put the texts of the current language into the static HTML
  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.getAttribute('data-i18n')); });
    root.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = tr(el.getAttribute('data-i18n-html')); });
    root.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = tr(el.getAttribute('data-i18n-title')); });
    root.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = tr(el.getAttribute('data-i18n-ph')); });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', tr(el.getAttribute('data-i18n-aria'))); });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    const cur = LANGS.find(l => l.code === lang);
    const short = document.getElementById('langCurrent');
    if (short && cur) short.textContent = cur.short;
    document.querySelectorAll('[data-lang-opt]').forEach(b => b.classList.toggle('active', b.getAttribute('data-lang-opt') === lang));
  }

  function setLang(code) {
    if (!LANGS.some(l => l.code === code)) return;
    lang = code;
    try { localStorage.setItem('abap_studio_lang', code); } catch (e) { /* private mode */ }
    apply();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: code } }));
  }

  // language menu of the navigation rail
  function buildMenu() {
    const menu = document.getElementById('langMenu');
    if (!menu) return;
    menu.innerHTML = LANGS.map(l =>
      `<button class="menu-item" role="menuitemradio" data-lang-opt="${l.code}" onclick="I18N.setLang('${l.code}'); I18N.closeMenu()"><span class="lang-code">${l.short}</span>${l.name}</button>`).join('');
  }
  function toggleMenu(e) {
    if (e) e.stopPropagation();
    const m = document.getElementById('langMenu');
    if (m) m.classList.toggle('open');
  }
  function closeMenu() {
    const m = document.getElementById('langMenu');
    if (m) m.classList.remove('open');
  }

  window.I18N = {
    LANGS, tr, apply, setLang, toggleMenu, closeMenu,
    get lang() { return lang; },
    get locale() { return (LANGS.find(l => l.code === lang) || LANGS[0]).locale; },
    keys: () => Object.keys(D),
    entry: k => D[k]
  };
  window.tr = tr;

  if (typeof document !== 'undefined') {
    const start = () => { buildMenu(); apply(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
    document.addEventListener('click', e => { if (!(e.target.closest && e.target.closest('.lang-wrap'))) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }
})();

// content-i18n-bodies.js — translated lesson bodies + exercises (Stage 2+)
// ABAP Code Studio — Created by jeffrypurwanto
//
// Augments window.ABAP_CONTENT_I18N.lessons[lang][id] with { body, task }.
// Loaded after content-i18n.js. HTML tags and ABAP code tokens are kept as-is;
// only the prose is translated. Indonesian stays the fallback for anything missing.
(function () {
  if (!window.ABAP_CONTENT_I18N) return;
  const C = window.ABAP_CONTENT_I18N;
  const add = (lang, id, fields) => { C.lessons[lang][id] = Object.assign(C.lessons[lang][id] || {}, fields); };

  // ============================================================
  // LEVEL 1 — Beginner (p01–p06)
  // ============================================================

  // ---- p01: First program: WRITE ----
  add('en', 'p01', {
    body: `<p>ABAP is SAP's programming language. A simple report program starts with <tt>REPORT program_name.</tt> and consists of <b>statements</b>. The three rules beginners forget most often:</p>
      <ul>
        <li>Every statement <b>ends with a period</b> (<tt>.</tt>), not a semicolon.</li>
        <li>Case does not matter: <tt>WRITE</tt> is the same as <tt>write</tt>.</li>
        <li>A full-line comment uses <tt>*</tt> in the <b>first column</b>. A comment in the middle or at the end of a line uses a double quote <tt>"</tt>.</li>
      </ul>
      <p><tt>WRITE</tt> prints to the screen. A <tt>/</tt> means a new line. Chained statements are written <tt>KEYWORD: a, b, c.</tt> — a colon after the keyword, then the parts separated by commas.</p>`,
    task: `<ul>
      <li>Add a line that prints your own name.</li>
      <li>Remove the period at the end of one statement, run it, and see what happens to the output.</li>
      <li>Print three words on one line without chaining (three separate <tt>WRITE</tt>s, only the first using <tt>/</tt>).</li>
    </ul>`
  });
  add('de', 'p01', {
    body: `<p>ABAP ist die Programmiersprache von SAP. Ein einfaches Report-Programm beginnt mit <tt>REPORT programmname.</tt> und besteht aus <b>Anweisungen</b>. Die drei Regeln, die Anfänger am häufigsten vergessen:</p>
      <ul>
        <li>Jede Anweisung <b>endet mit einem Punkt</b> (<tt>.</tt>), nicht mit einem Semikolon.</li>
        <li>Groß-/Kleinschreibung spielt keine Rolle: <tt>WRITE</tt> ist dasselbe wie <tt>write</tt>.</li>
        <li>Ein Kommentar über die ganze Zeile verwendet <tt>*</tt> in der <b>ersten Spalte</b>. Ein Kommentar in der Mitte oder am Zeilenende verwendet ein doppeltes Anführungszeichen <tt>"</tt>.</li>
      </ul>
      <p><tt>WRITE</tt> gibt auf dem Bildschirm aus. Ein <tt>/</tt> bedeutet eine neue Zeile. Verkettete Anweisungen schreibt man <tt>KEYWORD: a, b, c.</tt> — ein Doppelpunkt nach dem Schlüsselwort, dann die durch Kommas getrennten Teile.</p>`,
    task: `<ul>
      <li>Fügen Sie eine Zeile hinzu, die Ihren eigenen Namen ausgibt.</li>
      <li>Entfernen Sie den Punkt am Ende einer Anweisung, führen Sie das Programm aus und beobachten Sie die Ausgabe.</li>
      <li>Geben Sie drei Wörter in einer Zeile ohne Verkettung aus (drei einzelne <tt>WRITE</tt>, nur das erste mit <tt>/</tt>).</li>
    </ul>`
  });
  add('zh', 'p01', {
    body: `<p>ABAP 是 SAP 的编程语言。一个简单的报表程序以 <tt>REPORT 程序名.</tt> 开头，由若干<b>语句</b>组成。初学者最常忘记的三条规则：</p>
      <ul>
        <li>每条语句<b>以句点结尾</b>（<tt>.</tt>），而不是分号。</li>
        <li>不区分大小写：<tt>WRITE</tt> 与 <tt>write</tt> 相同。</li>
        <li>整行注释在<b>第一列</b>使用 <tt>*</tt>。行中或行尾的注释使用双引号 <tt>"</tt>。</li>
      </ul>
      <p><tt>WRITE</tt> 向屏幕输出。<tt>/</tt> 表示换行。链式语句写作 <tt>KEYWORD: a, b, c.</tt>——关键字后加冒号，各部分用逗号分隔。</p>`,
    task: `<ul>
      <li>添加一行输出你自己的名字。</li>
      <li>删除某条语句末尾的句点，运行并观察输出会发生什么。</li>
      <li>不使用链式语句，在一行输出三个词（三个独立的 <tt>WRITE</tt>，只有第一个使用 <tt>/</tt>）。</li>
    </ul>`
  });

  // ---- p02: Variables and data types ----
  add('en', 'p02', {
    body: `<p>Variables are declared with <tt>DATA name TYPE type.</tt> An initial value is given with <tt>VALUE</tt>. A value that must not change is declared with <tt>CONSTANTS</tt>.</p>
      <table>
        <tr><th>Type</th><th>Contents</th><th>Initial value</th></tr>
        <tr><td><tt>i</tt></td><td>integer</td><td>0</td></tr>
        <tr><td><tt>p DECIMALS n</tt></td><td>decimal number (money, quantity)</td><td>0</td></tr>
        <tr><td><tt>c LENGTH n</tt></td><td>fixed-length text</td><td>space</td></tr>
        <tr><td><tt>n LENGTH n</tt></td><td>digits only (document number)</td><td>000…</td></tr>
        <tr><td><tt>string</tt></td><td>variable-length text</td><td>empty</td></tr>
        <tr><td><tt>d</tt> / <tt>t</tt></td><td>date YYYYMMDD / time HHMMSS</td><td>00000000</td></tr>
      </table>
      <p>Naming conventions: <tt>lv_</tt> local variable, <tt>gv_</tt> global, <tt>gc_</tt> constant. <tt>CLEAR</tt> resets a variable to the initial value of its type. <tt>sy-datum</tt> is a <b>system field</b> holding today's date.</p>
      <ul>
        <li>Dates are stored as <tt>YYYYMMDD</tt>, but <tt>WRITE</tt> shows them as <tt>DD.MM.YYYY</tt>.</li>
        <li>A <tt>TYPE c</tt> variable only holds as much as its length: anything extra is <b>truncated</b> without an error. <tt>TYPE c</tt> without a length means one character.</li>
        <li><tt>TYPE n</tt> is always filled with leading zeros; <tt>TYPE p DECIMALS 2</tt> rounds to two decimal places.</li>
      </ul>`,
    task: `<ul>
      <li>Add a variable <tt>lv_kota</tt> of type <tt>string</tt> and print its value.</li>
      <li>Try to change a constant: <tt>gc_perusahaan = 'Lain'.</tt> Run it and read the error message.</li>
      <li>Fill <tt>lv_kode</tt> with text longer than 4 characters (<tt>lv_kode = 'ABCDEFG'.</tt>) and see what gets stored.</li>
      <li>Use an undeclared variable (e.g. <tt>lv_typo = 1.</tt>) and note the warning.</li>
    </ul>`
  });
  add('de', 'p02', {
    body: `<p>Variablen werden mit <tt>DATA name TYPE typ.</tt> deklariert. Ein Anfangswert wird mit <tt>VALUE</tt> gesetzt. Ein Wert, der sich nicht ändern darf, wird mit <tt>CONSTANTS</tt> deklariert.</p>
      <table>
        <tr><th>Typ</th><th>Inhalt</th><th>Anfangswert</th></tr>
        <tr><td><tt>i</tt></td><td>Ganzzahl</td><td>0</td></tr>
        <tr><td><tt>p DECIMALS n</tt></td><td>Dezimalzahl (Geld, Menge)</td><td>0</td></tr>
        <tr><td><tt>c LENGTH n</tt></td><td>Text mit fester Länge</td><td>Leerzeichen</td></tr>
        <tr><td><tt>n LENGTH n</tt></td><td>nur Ziffern (Belegnummer)</td><td>000…</td></tr>
        <tr><td><tt>string</tt></td><td>Text beliebiger Länge</td><td>leer</td></tr>
        <tr><td><tt>d</tt> / <tt>t</tt></td><td>Datum YYYYMMDD / Zeit HHMMSS</td><td>00000000</td></tr>
      </table>
      <p>Namenskonventionen: <tt>lv_</tt> lokale Variable, <tt>gv_</tt> global, <tt>gc_</tt> Konstante. <tt>CLEAR</tt> setzt eine Variable auf den Anfangswert ihres Typs zurück. <tt>sy-datum</tt> ist ein <b>Systemfeld</b> mit dem heutigen Datum.</p>
      <ul>
        <li>Datumswerte werden als <tt>YYYYMMDD</tt> gespeichert, aber <tt>WRITE</tt> zeigt sie als <tt>DD.MM.YYYY</tt> an.</li>
        <li>Eine <tt>TYPE c</tt>-Variable fasst nur so viel wie ihre Länge: Überschüssiges wird ohne Fehler <b>abgeschnitten</b>. <tt>TYPE c</tt> ohne Länge bedeutet ein Zeichen.</li>
        <li><tt>TYPE n</tt> wird immer mit führenden Nullen aufgefüllt; <tt>TYPE p DECIMALS 2</tt> rundet auf zwei Nachkommastellen.</li>
      </ul>`,
    task: `<ul>
      <li>Fügen Sie eine Variable <tt>lv_kota</tt> vom Typ <tt>string</tt> hinzu und geben Sie ihren Wert aus.</li>
      <li>Versuchen Sie, eine Konstante zu ändern: <tt>gc_perusahaan = 'Lain'.</tt> Führen Sie es aus und lesen Sie die Fehlermeldung.</li>
      <li>Füllen Sie <tt>lv_kode</tt> mit Text, der länger als 4 Zeichen ist (<tt>lv_kode = 'ABCDEFG'.</tt>), und sehen Sie, was gespeichert wird.</li>
      <li>Verwenden Sie eine nicht deklarierte Variable (z. B. <tt>lv_typo = 1.</tt>) und beachten Sie die Warnung.</li>
    </ul>`
  });
  add('zh', 'p02', {
    body: `<p>变量用 <tt>DATA 名称 TYPE 类型.</tt> 声明。初始值用 <tt>VALUE</tt> 给出。不允许改变的值用 <tt>CONSTANTS</tt> 声明。</p>
      <table>
        <tr><th>类型</th><th>内容</th><th>初始值</th></tr>
        <tr><td><tt>i</tt></td><td>整数</td><td>0</td></tr>
        <tr><td><tt>p DECIMALS n</tt></td><td>小数（金额、数量）</td><td>0</td></tr>
        <tr><td><tt>c LENGTH n</tt></td><td>定长文本</td><td>空格</td></tr>
        <tr><td><tt>n LENGTH n</tt></td><td>仅数字（单据号）</td><td>000…</td></tr>
        <tr><td><tt>string</tt></td><td>变长文本</td><td>空</td></tr>
        <tr><td><tt>d</tt> / <tt>t</tt></td><td>日期 YYYYMMDD / 时间 HHMMSS</td><td>00000000</td></tr>
      </table>
      <p>命名习惯：<tt>lv_</tt> 局部变量，<tt>gv_</tt> 全局变量，<tt>gc_</tt> 常量。<tt>CLEAR</tt> 把变量重置为其类型的初始值。<tt>sy-datum</tt> 是一个包含当天日期的<b>系统字段</b>。</p>
      <ul>
        <li>日期以 <tt>YYYYMMDD</tt> 存储，但 <tt>WRITE</tt> 将其显示为 <tt>DD.MM.YYYY</tt>。</li>
        <li><tt>TYPE c</tt> 变量只能容纳其长度范围内的内容：超出部分会被<b>截断</b>且不报错。不带长度的 <tt>TYPE c</tt> 表示一个字符。</li>
        <li><tt>TYPE n</tt> 总是以前导零填满；<tt>TYPE p DECIMALS 2</tt> 四舍五入到两位小数。</li>
      </ul>`,
    task: `<ul>
      <li>添加一个 <tt>string</tt> 类型的变量 <tt>lv_kota</tt> 并输出它的值。</li>
      <li>尝试修改常量：<tt>gc_perusahaan = 'Lain'.</tt> 运行并阅读其错误信息。</li>
      <li>给 <tt>lv_kode</tt> 赋一个长于 4 个字符的文本（<tt>lv_kode = 'ABCDEFG'.</tt>），看看实际存储了什么。</li>
      <li>使用一个未声明的变量（例如 <tt>lv_typo = 1.</tt>），注意它的警告。</li>
    </ul>`
  });

  // ---- p03: Operators and calculations ----
  add('en', 'p03', {
    body: `<p>Arithmetic operators: <tt>+</tt> <tt>-</tt> <tt>*</tt> <tt>/</tt>, <tt>DIV</tt> (integer quotient) and <tt>MOD</tt> (remainder). Operators and parentheses <b>must be surrounded by spaces</b>: write <tt>( lv_a + lv_b ) * 2</tt>, not <tt>(lv_a+lv_b)*2</tt>.</p>
      <ul>
        <li>Multiplication and division are done before addition and subtraction.</li>
        <li>A result stored in a <tt>TYPE i</tt> variable is <b>rounded</b>, not truncated: 17 / 5 = 3.4 becomes 3, while 18 / 5 = 3.6 becomes 4.</li>
        <li>Older forms you still often see: <tt>ADD</tt>, <tt>SUBTRACT</tt>, <tt>MULTIPLY</tt>, <tt>DIVIDE</tt>.</li>
      </ul>`,
    task: `<ul>
      <li>Compute the area and perimeter of a 12 × 7 rectangle.</li>
      <li>Change <tt>lv_b</tt> to 0 and run it. The program stops with the exception <tt>CX_SY_ZERODIVIDE</tt> — catching it is covered in the Advanced level.</li>
    </ul>`
  });
  add('de', 'p03', {
    body: `<p>Arithmetische Operatoren: <tt>+</tt> <tt>-</tt> <tt>*</tt> <tt>/</tt>, <tt>DIV</tt> (ganzzahliger Quotient) und <tt>MOD</tt> (Rest). Operatoren und Klammern <b>müssen von Leerzeichen umgeben sein</b>: schreiben Sie <tt>( lv_a + lv_b ) * 2</tt>, nicht <tt>(lv_a+lv_b)*2</tt>.</p>
      <ul>
        <li>Multiplikation und Division werden vor Addition und Subtraktion ausgeführt.</li>
        <li>Ein in einer <tt>TYPE i</tt>-Variable gespeichertes Ergebnis wird <b>gerundet</b>, nicht abgeschnitten: 17 / 5 = 3,4 wird zu 3, während 18 / 5 = 3,6 zu 4 wird.</li>
        <li>Ältere Formen, die man noch oft sieht: <tt>ADD</tt>, <tt>SUBTRACT</tt>, <tt>MULTIPLY</tt>, <tt>DIVIDE</tt>.</li>
      </ul>`,
    task: `<ul>
      <li>Berechnen Sie Fläche und Umfang eines Rechtecks von 12 × 7.</li>
      <li>Ändern Sie <tt>lv_b</tt> auf 0 und führen Sie es aus. Das Programm stoppt mit der Ausnahme <tt>CX_SY_ZERODIVIDE</tt> — das Abfangen wird in der Stufe Profi behandelt.</li>
    </ul>`
  });
  add('zh', 'p03', {
    body: `<p>算术运算符：<tt>+</tt> <tt>-</tt> <tt>*</tt> <tt>/</tt>、<tt>DIV</tt>（整除商）和 <tt>MOD</tt>（余数）。运算符和括号<b>必须两边留空格</b>：写作 <tt>( lv_a + lv_b ) * 2</tt>，而不是 <tt>(lv_a+lv_b)*2</tt>。</p>
      <ul>
        <li>乘法和除法先于加法和减法运算。</li>
        <li>存入 <tt>TYPE i</tt> 变量的结果会<b>四舍五入</b>，而不是截断：17 / 5 = 3.4 变成 3，而 18 / 5 = 3.6 变成 4。</li>
        <li>仍然常见的旧写法：<tt>ADD</tt>、<tt>SUBTRACT</tt>、<tt>MULTIPLY</tt>、<tt>DIVIDE</tt>。</li>
      </ul>`,
    task: `<ul>
      <li>计算一个 12 × 7 矩形的面积和周长。</li>
      <li>把 <tt>lv_b</tt> 改为 0 再运行。程序会以异常 <tt>CX_SY_ZERODIVIDE</tt> 停止——如何捕获将在“高级”级别讲解。</li>
    </ul>`
  });

  // ---- p04: Branching: IF and CASE ----
  add('en', 'p04', {
    body: `<p><tt>IF</tt> tests a condition and is always closed with <tt>ENDIF.</tt> Comparisons can be written with symbols or letters: <tt>=</tt>/<tt>EQ</tt>, <tt>&lt;&gt;</tt>/<tt>NE</tt>, <tt>&lt;</tt>/<tt>LT</tt>, <tt>&gt;</tt>/<tt>GT</tt>, <tt>&lt;=</tt>/<tt>LE</tt>, <tt>&gt;=</tt>/<tt>GE</tt>.</p>
      <ul>
        <li>Conditions are combined with <tt>AND</tt>, <tt>OR</tt>, <tt>NOT</tt>; parentheses control grouping.</li>
        <li><tt>BETWEEN a AND b</tt> tests a range; <tt>IS INITIAL</tt> tests whether a variable is still empty.</li>
        <li><tt>CASE</tt> is tidier than a chain of <tt>ELSEIF</tt> when one variable is compared against many values. <tt>WHEN OTHERS</tt> catches the rest.</li>
      </ul>`,
    task: `<ul>
      <li>Change <tt>lv_nilai</tt> to 90, 60, and 40. Check the grade.</li>
      <li>Add a variable <tt>lv_umur</tt> and print "Child", "Teenager", or "Adult" based on the age range.</li>
    </ul>`
  });
  add('de', 'p04', {
    body: `<p><tt>IF</tt> prüft eine Bedingung und wird immer mit <tt>ENDIF.</tt> abgeschlossen. Vergleiche können mit Symbolen oder Buchstaben geschrieben werden: <tt>=</tt>/<tt>EQ</tt>, <tt>&lt;&gt;</tt>/<tt>NE</tt>, <tt>&lt;</tt>/<tt>LT</tt>, <tt>&gt;</tt>/<tt>GT</tt>, <tt>&lt;=</tt>/<tt>LE</tt>, <tt>&gt;=</tt>/<tt>GE</tt>.</p>
      <ul>
        <li>Bedingungen werden mit <tt>AND</tt>, <tt>OR</tt>, <tt>NOT</tt> verknüpft; Klammern steuern die Gruppierung.</li>
        <li><tt>BETWEEN a AND b</tt> prüft einen Bereich; <tt>IS INITIAL</tt> prüft, ob eine Variable noch leer ist.</li>
        <li><tt>CASE</tt> ist übersichtlicher als eine Kette von <tt>ELSEIF</tt>, wenn eine Variable mit vielen Werten verglichen wird. <tt>WHEN OTHERS</tt> fängt den Rest ab.</li>
      </ul>`,
    task: `<ul>
      <li>Ändern Sie <tt>lv_nilai</tt> auf 90, 60 und 40. Prüfen Sie die Note.</li>
      <li>Fügen Sie eine Variable <tt>lv_umur</tt> hinzu und geben Sie je nach Altersbereich „Kind“, „Jugendlicher“ oder „Erwachsener“ aus.</li>
    </ul>`
  });
  add('zh', 'p04', {
    body: `<p><tt>IF</tt> 判断条件，并总是以 <tt>ENDIF.</tt> 结束。比较可以用符号或字母书写：<tt>=</tt>/<tt>EQ</tt>、<tt>&lt;&gt;</tt>/<tt>NE</tt>、<tt>&lt;</tt>/<tt>LT</tt>、<tt>&gt;</tt>/<tt>GT</tt>、<tt>&lt;=</tt>/<tt>LE</tt>、<tt>&gt;=</tt>/<tt>GE</tt>。</p>
      <ul>
        <li>条件用 <tt>AND</tt>、<tt>OR</tt>、<tt>NOT</tt> 组合；括号控制分组。</li>
        <li><tt>BETWEEN a AND b</tt> 检测区间；<tt>IS INITIAL</tt> 检测变量是否仍为空。</li>
        <li>当一个变量要与许多值比较时，<tt>CASE</tt> 比一连串 <tt>ELSEIF</tt> 更清晰。<tt>WHEN OTHERS</tt> 捕获其余情况。</li>
      </ul>`,
    task: `<ul>
      <li>把 <tt>lv_nilai</tt> 改为 90、60 和 40，查看对应的等级。</li>
      <li>添加变量 <tt>lv_umur</tt>，根据年龄区间输出“儿童”、“青少年”或“成人”。</li>
    </ul>`
  });

  // ---- p05: Loops: DO and WHILE ----
  add('en', 'p05', {
    body: `<ul>
        <li><tt>DO n TIMES. … ENDDO.</tt> repeats exactly n times. <tt>sy-index</tt> holds the iteration number (starting at 1).</li>
        <li><tt>WHILE condition. … ENDWHILE.</tt> repeats while the condition is true.</li>
        <li><tt>DO.</tt> without a count repeats endlessly — it <b>must</b> contain an <tt>EXIT</tt>.</li>
        <li><tt>EXIT</tt> leaves the loop, <tt>CONTINUE</tt> jumps to the next iteration, <tt>CHECK condition</tt> means "if the condition is false, CONTINUE".</li>
      </ul>`,
    task: `<ul>
      <li>Print the 7 times table (7 × 1 to 7 × 10).</li>
      <li>Compute the factorial of 6 with <tt>WHILE</tt>.</li>
      <li>Remove the <tt>EXIT</tt> in the third loop and run it: the simulator stops the endless loop and shows a runtime error.</li>
    </ul>`
  });
  add('de', 'p05', {
    body: `<ul>
        <li><tt>DO n TIMES. … ENDDO.</tt> wiederholt genau n-mal. <tt>sy-index</tt> enthält die Durchlaufnummer (beginnend bei 1).</li>
        <li><tt>WHILE bedingung. … ENDWHILE.</tt> wiederholt, solange die Bedingung wahr ist.</li>
        <li><tt>DO.</tt> ohne Anzahl wiederholt endlos — es <b>muss</b> ein <tt>EXIT</tt> enthalten.</li>
        <li><tt>EXIT</tt> verlässt die Schleife, <tt>CONTINUE</tt> springt zum nächsten Durchlauf, <tt>CHECK bedingung</tt> bedeutet „wenn die Bedingung falsch ist, CONTINUE“.</li>
      </ul>`,
    task: `<ul>
      <li>Geben Sie die 7er-Reihe aus (7 × 1 bis 7 × 10).</li>
      <li>Berechnen Sie die Fakultät von 6 mit <tt>WHILE</tt>.</li>
      <li>Entfernen Sie das <tt>EXIT</tt> in der dritten Schleife und führen Sie es aus: Der Simulator stoppt die Endlosschleife und zeigt einen Laufzeitfehler.</li>
    </ul>`
  });
  add('zh', 'p05', {
    body: `<ul>
        <li><tt>DO n TIMES. … ENDDO.</tt> 恰好重复 n 次。<tt>sy-index</tt> 保存循环次数（从 1 开始）。</li>
        <li><tt>WHILE 条件. … ENDWHILE.</tt> 在条件为真时持续重复。</li>
        <li>不带次数的 <tt>DO.</tt> 会无限重复——其中<b>必须</b>有 <tt>EXIT</tt>。</li>
        <li><tt>EXIT</tt> 退出循环，<tt>CONTINUE</tt> 跳到下一次循环，<tt>CHECK 条件</tt> 相当于“如果条件为假，就 CONTINUE”。</li>
      </ul>`,
    task: `<ul>
      <li>输出 7 的乘法表（7 × 1 到 7 × 10）。</li>
      <li>用 <tt>WHILE</tt> 计算 6 的阶乘。</li>
      <li>删除第三个循环中的 <tt>EXIT</tt> 再运行：模拟器会中止这个死循环并显示运行时错误。</li>
    </ul>`
  });

  // ---- p06: Working with strings ----
  add('en', 'p06', {
    body: `<ul>
        <li>Join: <tt>CONCATENATE a b INTO c SEPARATED BY space.</tt>, the <tt>&amp;&amp;</tt> operator, or a <b>string template</b> <tt>|text { variable } text|</tt>.</li>
        <li>Cut: <tt>SPLIT text AT ';' INTO a b c.</tt> and substring access <tt>text+offset(length)</tt> — e.g. <tt>lv_tgl+0(4)</tt> takes the year.</li>
        <li>Change: <tt>TRANSLATE … TO UPPER CASE</tt>, <tt>CONDENSE</tt> (tidy up spaces), <tt>REPLACE ALL OCCURRENCES OF … IN … WITH …</tt>.</li>
        <li>Search: <tt>FIND 'word' IN text MATCH OFFSET pos.</tt> then check <tt>sy-subrc</tt> (0 = found). The <tt>CS</tt> operator means "contains".</li>
        <li><tt>strlen( text )</tt> returns the length of the text.</li>
      </ul>`,
    task: `<ul>
      <li>Build initials from a first and last name (e.g. "S.R.") using <tt>+0(1)</tt>.</li>
      <li>Split an email address at the <tt>@</tt> into user name and domain.</li>
    </ul>`
  });
  add('de', 'p06', {
    body: `<ul>
        <li>Verketten: <tt>CONCATENATE a b INTO c SEPARATED BY space.</tt>, der Operator <tt>&amp;&amp;</tt> oder ein <b>String-Template</b> <tt>|text { variable } text|</tt>.</li>
        <li>Zerlegen: <tt>SPLIT text AT ';' INTO a b c.</tt> und Teilstring-Zugriff <tt>text+offset(länge)</tt> — z. B. nimmt <tt>lv_tgl+0(4)</tt> das Jahr.</li>
        <li>Ändern: <tt>TRANSLATE … TO UPPER CASE</tt>, <tt>CONDENSE</tt> (Leerzeichen bereinigen), <tt>REPLACE ALL OCCURRENCES OF … IN … WITH …</tt>.</li>
        <li>Suchen: <tt>FIND 'wort' IN text MATCH OFFSET pos.</tt> dann <tt>sy-subrc</tt> prüfen (0 = gefunden). Der Operator <tt>CS</tt> bedeutet „enthält“.</li>
        <li><tt>strlen( text )</tt> gibt die Länge des Textes zurück.</li>
      </ul>`,
    task: `<ul>
      <li>Bilden Sie Initialen aus Vor- und Nachnamen (z. B. „S.R.“) mit <tt>+0(1)</tt>.</li>
      <li>Teilen Sie eine E-Mail-Adresse am <tt>@</tt> in Benutzername und Domain.</li>
    </ul>`
  });
  add('zh', 'p06', {
    body: `<ul>
        <li>拼接：<tt>CONCATENATE a b INTO c SEPARATED BY space.</tt>、<tt>&amp;&amp;</tt> 运算符，或<b>字符串模板</b> <tt>|文本 { 变量 } 文本|</tt>。</li>
        <li>截取：<tt>SPLIT text AT ';' INTO a b c.</tt> 以及子串访问 <tt>text+offset(length)</tt>——例如 <tt>lv_tgl+0(4)</tt> 取出年份。</li>
        <li>修改：<tt>TRANSLATE … TO UPPER CASE</tt>、<tt>CONDENSE</tt>（整理空格）、<tt>REPLACE ALL OCCURRENCES OF … IN … WITH …</tt>。</li>
        <li>查找：<tt>FIND 'word' IN text MATCH OFFSET pos.</tt> 然后检查 <tt>sy-subrc</tt>（0 = 找到）。<tt>CS</tt> 运算符表示“包含”。</li>
        <li><tt>strlen( text )</tt> 返回文本的长度。</li>
      </ul>`,
    task: `<ul>
      <li>用 <tt>+0(1)</tt> 从名和姓生成缩写（例如“S.R.”）。</li>
      <li>在 <tt>@</tt> 处把电子邮件地址拆分成用户名和域名。</li>
    </ul>`
  });

  // ============================================================
  // LEVEL 2 — Basics (d01–d10)
  // ============================================================

  // ---- d01: Structures (work area) ----
  add('en', 'd01', {
    body: `<p>A structure is a single variable with several <b>components</b> (fields). Its shape is first defined as a type:</p>
      <ul>
        <li><tt>TYPES: BEGIN OF ty_x, … END OF ty_x.</tt> creates a <b>type</b>; <tt>DATA ls_x TYPE ty_x.</tt> creates the <b>variable</b>.</li>
        <li>Components are accessed with a hyphen: <tt>ls_karyawan-nama</tt>.</li>
        <li>Copying a structure copies <b>all</b> of its components; the copy is not linked to the original.</li>
        <li>A structure may contain other structures: <tt>ls_kantor-alamat-kota</tt>.</li>
        <li><tt>MOVE-CORRESPONDING a TO b.</tt> copies only the components whose names match.</li>
      </ul>
      <p>Naming conventions: <tt>ty_</tt> type, <tt>ls_</tt>/<tt>gs_</tt> structure (work area), <tt>lt_</tt>/<tt>gt_</tt> internal table.</p>`,
    task: `<ul>
      <li>Add an <tt>email</tt> component to <tt>ty_karyawan</tt>, then fill and print it.</li>
      <li>Try to fill a component that does not exist (<tt>ls_karyawan-alamat = 'x'.</tt>) and read the error message.</li>
    </ul>`
  });
  add('de', 'd01', {
    body: `<p>Eine Struktur ist eine einzelne Variable mit mehreren <b>Komponenten</b> (Feldern). Ihre Form wird zuerst als Typ definiert:</p>
      <ul>
        <li><tt>TYPES: BEGIN OF ty_x, … END OF ty_x.</tt> erzeugt einen <b>Typ</b>; <tt>DATA ls_x TYPE ty_x.</tt> erzeugt die <b>Variable</b>.</li>
        <li>Auf Komponenten wird mit einem Bindestrich zugegriffen: <tt>ls_karyawan-nama</tt>.</li>
        <li>Eine Struktur zu kopieren kopiert <b>alle</b> ihre Komponenten; die Kopie ist nicht mit dem Original verbunden.</li>
        <li>Eine Struktur darf andere Strukturen enthalten: <tt>ls_kantor-alamat-kota</tt>.</li>
        <li><tt>MOVE-CORRESPONDING a TO b.</tt> kopiert nur die Komponenten mit gleichem Namen.</li>
      </ul>
      <p>Namenskonventionen: <tt>ty_</tt> Typ, <tt>ls_</tt>/<tt>gs_</tt> Struktur (Work Area), <tt>lt_</tt>/<tt>gt_</tt> interne Tabelle.</p>`,
    task: `<ul>
      <li>Fügen Sie <tt>ty_karyawan</tt> eine Komponente <tt>email</tt> hinzu, füllen und geben Sie sie aus.</li>
      <li>Versuchen Sie, eine nicht vorhandene Komponente zu füllen (<tt>ls_karyawan-alamat = 'x'.</tt>) und lesen Sie die Fehlermeldung.</li>
    </ul>`
  });
  add('zh', 'd01', {
    body: `<p>结构体是一个包含若干<b>组件</b>（字段）的单一变量。它的形态先被定义为一个类型：</p>
      <ul>
        <li><tt>TYPES: BEGIN OF ty_x, … END OF ty_x.</tt> 创建一个<b>类型</b>；<tt>DATA ls_x TYPE ty_x.</tt> 创建<b>变量</b>。</li>
        <li>用连字符访问组件：<tt>ls_karyawan-nama</tt>。</li>
        <li>复制结构体会复制它的<b>全部</b>组件；副本与原件互不关联。</li>
        <li>结构体可以包含其他结构体：<tt>ls_kantor-alamat-kota</tt>。</li>
        <li><tt>MOVE-CORRESPONDING a TO b.</tt> 只复制名称相同的组件。</li>
      </ul>
      <p>命名习惯：<tt>ty_</tt> 类型，<tt>ls_</tt>/<tt>gs_</tt> 结构体（工作区），<tt>lt_</tt>/<tt>gt_</tt> 内表。</p>`,
    task: `<ul>
      <li>给 <tt>ty_karyawan</tt> 添加 <tt>email</tt> 组件，然后赋值并输出。</li>
      <li>尝试给一个不存在的组件赋值（<tt>ls_karyawan-alamat = 'x'.</tt>），阅读其错误信息。</li>
    </ul>`
  });

  // ---- d02: Internal table: APPEND and LOOP ----
  add('en', 'd02', {
    body: `<p>An <b>internal table</b> is a table in the program's memory — the most important data structure in ABAP. The pattern is always the same: one row type, one table, one <b>work area</b> to hold a single row.</p>
      <ul>
        <li><tt>DATA gt_x TYPE STANDARD TABLE OF ty_x.</tt> — the table. <tt>DATA gs_x TYPE ty_x.</tt> — the work area.</li>
        <li><tt>APPEND gs_x TO gt_x.</tt> adds a row at the end. The <tt>APPEND</tt> target must be a <b>table</b>, not a structure or component.</li>
        <li><tt>LOOP AT gt_x INTO gs_x. … ENDLOOP.</tt> reads each row; <tt>sy-tabix</tt> holds the row number.</li>
        <li><tt>LOOP … WHERE condition.</tt> processes only the rows that meet the condition.</li>
        <li><tt>lines( gt_x )</tt> returns the number of rows.</li>
      </ul>`,
    task: `<ul>
      <li>Add two more products and make sure the total inventory value changes with them.</li>
      <li>Print only the products priced above 500,000.</li>
      <li>Write <tt>APPEND gs_produk TO gs_produk-nama.</tt> and run it — this is the mistake beginners make most often.</li>
    </ul>`
  });
  add('de', 'd02', {
    body: `<p>Eine <b>interne Tabelle</b> ist eine Tabelle im Speicher des Programms — die wichtigste Datenstruktur in ABAP. Das Muster ist immer gleich: ein Zeilentyp, eine Tabelle, eine <b>Work Area</b> für eine einzelne Zeile.</p>
      <ul>
        <li><tt>DATA gt_x TYPE STANDARD TABLE OF ty_x.</tt> — die Tabelle. <tt>DATA gs_x TYPE ty_x.</tt> — die Work Area.</li>
        <li><tt>APPEND gs_x TO gt_x.</tt> fügt am Ende eine Zeile hinzu. Das Ziel von <tt>APPEND</tt> muss eine <b>Tabelle</b> sein, keine Struktur oder Komponente.</li>
        <li><tt>LOOP AT gt_x INTO gs_x. … ENDLOOP.</tt> liest jede Zeile; <tt>sy-tabix</tt> enthält die Zeilennummer.</li>
        <li><tt>LOOP … WHERE bedingung.</tt> verarbeitet nur die Zeilen, die die Bedingung erfüllen.</li>
        <li><tt>lines( gt_x )</tt> gibt die Anzahl der Zeilen zurück.</li>
      </ul>`,
    task: `<ul>
      <li>Fügen Sie zwei weitere Produkte hinzu und stellen Sie sicher, dass sich der Gesamtbestandswert mitändert.</li>
      <li>Geben Sie nur die Produkte mit einem Preis über 500.000 aus.</li>
      <li>Schreiben Sie <tt>APPEND gs_produk TO gs_produk-nama.</tt> und führen Sie es aus — das ist der häufigste Anfängerfehler.</li>
    </ul>`
  });
  add('zh', 'd02', {
    body: `<p><b>内表</b>是程序内存中的一张表——ABAP 中最重要的数据结构。套路始终一样：一个行类型、一张表、一个用于保存单行的<b>工作区</b>。</p>
      <ul>
        <li><tt>DATA gt_x TYPE STANDARD TABLE OF ty_x.</tt> ——表。<tt>DATA gs_x TYPE ty_x.</tt> ——工作区。</li>
        <li><tt>APPEND gs_x TO gt_x.</tt> 在末尾添加一行。<tt>APPEND</tt> 的目标必须是<b>表</b>，而不是结构体或组件。</li>
        <li><tt>LOOP AT gt_x INTO gs_x. … ENDLOOP.</tt> 读取每一行；<tt>sy-tabix</tt> 保存行号。</li>
        <li><tt>LOOP … WHERE 条件.</tt> 只处理满足条件的行。</li>
        <li><tt>lines( gt_x )</tt> 返回行数。</li>
      </ul>`,
    task: `<ul>
      <li>再添加两个产品，并确认库存总价值随之变化。</li>
      <li>只输出价格高于 500,000 的产品。</li>
      <li>写 <tt>APPEND gs_produk TO gs_produk-nama.</tt> 并运行——这是初学者最常犯的错误。</li>
    </ul>`
  });

  // ---- d03: Internal table: READ, MODIFY, DELETE, SORT ----
  add('en', 'd03', {
    body: `<ul>
        <li><tt>READ TABLE gt INTO gs INDEX n.</tt> takes the n-th row; <tt>… WITH KEY field = value.</tt> searches by content.</li>
        <li>After <tt>READ TABLE</tt> <b>always check <tt>sy-subrc</tt></b>: 0 = found, 4 = not found. If nothing is found, the work area still holds the old data.</li>
        <li><tt>MODIFY gt FROM gs INDEX n.</tt> writes the work area back into the table. Changing only the work area does <b>not</b> change the table.</li>
        <li><tt>DELETE gt WHERE condition.</tt> / <tt>DELETE gt INDEX n.</tt> deletes rows.</li>
        <li><tt>SORT gt BY field [DESCENDING].</tt> sorts; <tt>DELETE ADJACENT DUPLICATES FROM gt COMPARING field.</tt> removes duplicates (the table must already be sorted).</li>
      </ul>`,
    task: `<ul>
      <li>Raise the price of all products in the INPUT category by 10% with <tt>LOOP</tt> + <tt>MODIFY</tt>.</li>
      <li>Sort by category then price (<tt>SORT gt_produk BY kategori harga DESCENDING.</tt>).</li>
    </ul>`
  });
  add('de', 'd03', {
    body: `<ul>
        <li><tt>READ TABLE gt INTO gs INDEX n.</tt> nimmt die n-te Zeile; <tt>… WITH KEY field = wert.</tt> sucht nach Inhalt.</li>
        <li>Nach <tt>READ TABLE</tt> <b>immer <tt>sy-subrc</tt> prüfen</b>: 0 = gefunden, 4 = nicht gefunden. Wird nichts gefunden, enthält die Work Area noch die alten Daten.</li>
        <li><tt>MODIFY gt FROM gs INDEX n.</tt> schreibt die Work Area zurück in die Tabelle. Nur die Work Area zu ändern ändert die Tabelle <b>nicht</b>.</li>
        <li><tt>DELETE gt WHERE bedingung.</tt> / <tt>DELETE gt INDEX n.</tt> löscht Zeilen.</li>
        <li><tt>SORT gt BY field [DESCENDING].</tt> sortiert; <tt>DELETE ADJACENT DUPLICATES FROM gt COMPARING field.</tt> entfernt Duplikate (die Tabelle muss bereits sortiert sein).</li>
      </ul>`,
    task: `<ul>
      <li>Erhöhen Sie den Preis aller Produkte der Kategorie INPUT um 10 % mit <tt>LOOP</tt> + <tt>MODIFY</tt>.</li>
      <li>Sortieren Sie nach Kategorie, dann nach Preis (<tt>SORT gt_produk BY kategori harga DESCENDING.</tt>).</li>
    </ul>`
  });
  add('zh', 'd03', {
    body: `<ul>
        <li><tt>READ TABLE gt INTO gs INDEX n.</tt> 取第 n 行；<tt>… WITH KEY field = value.</tt> 按内容查找。</li>
        <li><tt>READ TABLE</tt> 之后<b>务必检查 <tt>sy-subrc</tt></b>：0 = 找到，4 = 未找到。若未找到，工作区仍保留旧数据。</li>
        <li><tt>MODIFY gt FROM gs INDEX n.</tt> 把工作区写回表中。仅修改工作区<b>不会</b>改变表。</li>
        <li><tt>DELETE gt WHERE 条件.</tt> / <tt>DELETE gt INDEX n.</tt> 删除行。</li>
        <li><tt>SORT gt BY field [DESCENDING].</tt> 排序；<tt>DELETE ADJACENT DUPLICATES FROM gt COMPARING field.</tt> 删除重复行（表必须已排序）。</li>
      </ul>`,
    task: `<ul>
      <li>用 <tt>LOOP</tt> + <tt>MODIFY</tt> 把 INPUT 类别所有产品的价格提高 10%。</li>
      <li>先按类别再按价格排序（<tt>SORT gt_produk BY kategori harga DESCENDING.</tt>）。</li>
    </ul>`
  });

  // ---- d04: Field symbols ----
  add('en', 'd04', {
    body: `<p>A <b>field symbol</b> is a pointer to data that already exists — like an "alias" for a variable or a table row. Its name is always enclosed in <tt>&lt; &gt;</tt>.</p>
      <ul>
        <li><tt>LOOP AT gt ASSIGNING &lt;fs&gt;.</tt> — <tt>&lt;fs&gt;</tt> points directly at the table row. Changing <tt>&lt;fs&gt;-harga</tt> changes the table directly, without <tt>MODIFY</tt>.</li>
        <li>Faster than <tt>INTO</tt> because no row is copied — important for large tables.</li>
        <li><tt>ASSIGN variable TO &lt;fs&gt;.</tt> points at an ordinary variable. <tt>IS ASSIGNED</tt> checks whether the field symbol already points at something.</li>
      </ul>`,
    task: `<ul>
      <li>Change the first loop to <tt>LOOP … INTO gs_produk</tt> without <tt>MODIFY</tt>. Does the price in the table change?</li>
      <li>With a field symbol, set the stock to 100 only for products priced below 200,000 (<tt>LOOP … ASSIGNING … WHERE</tt>).</li>
    </ul>`
  });
  add('de', 'd04', {
    body: `<p>Ein <b>Feldsymbol</b> ist ein Zeiger auf bereits vorhandene Daten — wie ein „Aliasname“ für eine Variable oder eine Tabellenzeile. Sein Name steht immer in <tt>&lt; &gt;</tt>.</p>
      <ul>
        <li><tt>LOOP AT gt ASSIGNING &lt;fs&gt;.</tt> — <tt>&lt;fs&gt;</tt> zeigt direkt auf die Tabellenzeile. Ändern von <tt>&lt;fs&gt;-harga</tt> ändert die Tabelle direkt, ohne <tt>MODIFY</tt>.</li>
        <li>Schneller als <tt>INTO</tt>, weil keine Zeile kopiert wird — wichtig für große Tabellen.</li>
        <li><tt>ASSIGN variable TO &lt;fs&gt;.</tt> zeigt auf eine gewöhnliche Variable. <tt>IS ASSIGNED</tt> prüft, ob das Feldsymbol bereits auf etwas zeigt.</li>
      </ul>`,
    task: `<ul>
      <li>Ändern Sie die erste Schleife in <tt>LOOP … INTO gs_produk</tt> ohne <tt>MODIFY</tt>. Ändert sich der Preis in der Tabelle?</li>
      <li>Setzen Sie mit einem Feldsymbol den Bestand nur für Produkte unter 200.000 auf 100 (<tt>LOOP … ASSIGNING … WHERE</tt>).</li>
    </ul>`
  });
  add('zh', 'd04', {
    body: `<p><b>字段符号</b>是指向已有数据的指针——就像变量或表行的“别名”。它的名称总是用 <tt>&lt; &gt;</tt> 括起来。</p>
      <ul>
        <li><tt>LOOP AT gt ASSIGNING &lt;fs&gt;.</tt> ——<tt>&lt;fs&gt;</tt> 直接指向表行。修改 <tt>&lt;fs&gt;-harga</tt> 会直接改变表，无需 <tt>MODIFY</tt>。</li>
        <li>比 <tt>INTO</tt> 更快，因为不复制行——对大表很重要。</li>
        <li><tt>ASSIGN variable TO &lt;fs&gt;.</tt> 指向一个普通变量。<tt>IS ASSIGNED</tt> 检查字段符号是否已经指向了某处。</li>
      </ul>`,
    task: `<ul>
      <li>把第一个循环改成不带 <tt>MODIFY</tt> 的 <tt>LOOP … INTO gs_produk</tt>。表中的价格会改变吗？</li>
      <li>用字段符号，只把价格低于 200,000 的产品库存设为 100（<tt>LOOP … ASSIGNING … WHERE</tt>）。</li>
    </ul>`
  });

  // ---- d05: Subroutines: FORM and PERFORM ----
  add('en', 'd05', {
    body: `<p><tt>FORM name. … ENDFORM.</tt> defines a subroutine; <tt>PERFORM name.</tt> calls it. FORMs are written at the bottom of the program.</p>
      <ul>
        <li><tt>USING</tt> — data that goes <b>into</b> the FORM.</li>
        <li><tt>CHANGING</tt> — data that the FORM <b>changes</b> and returns to the caller.</li>
        <li><tt>TABLES</tt> — an internal table passed to the FORM (old style, still widely used).</li>
        <li>Parameters are matched by <b>position</b>, not by name. The count must be the same in <tt>PERFORM</tt> and <tt>FORM</tt>.</li>
        <li>Variables declared inside a FORM are <b>local</b>: they disappear once the FORM finishes.</li>
      </ul>`,
    task: `<ul>
      <li>Create a FORM <tt>hitung_diskon</tt> with <tt>USING</tt> price and percent, <tt>CHANGING</tt> the final price.</li>
      <li>Call <tt>PERFORM hitung_luas USING 8 CHANGING gv_luas.</tt> (one parameter short) and read the error message.</li>
      <li>In the main program, try to print <tt>lv_sementara</tt> after the <tt>PERFORM</tt>. Why can't you?</li>
    </ul>`
  });
  add('de', 'd05', {
    body: `<p><tt>FORM name. … ENDFORM.</tt> definiert ein Unterprogramm; <tt>PERFORM name.</tt> ruft es auf. FORMs werden am Ende des Programms geschrieben.</p>
      <ul>
        <li><tt>USING</tt> — Daten, die <b>in</b> die FORM gehen.</li>
        <li><tt>CHANGING</tt> — Daten, die die FORM <b>ändert</b> und an den Aufrufer zurückgibt.</li>
        <li><tt>TABLES</tt> — eine interne Tabelle, die an die FORM übergeben wird (alter Stil, noch weit verbreitet).</li>
        <li>Parameter werden nach <b>Position</b> zugeordnet, nicht nach Namen. Die Anzahl muss in <tt>PERFORM</tt> und <tt>FORM</tt> gleich sein.</li>
        <li>Innerhalb einer FORM deklarierte Variablen sind <b>lokal</b>: Sie verschwinden, sobald die FORM endet.</li>
      </ul>`,
    task: `<ul>
      <li>Erstellen Sie eine FORM <tt>hitung_diskon</tt> mit <tt>USING</tt> Preis und Prozent, <tt>CHANGING</tt> den Endpreis.</li>
      <li>Rufen Sie <tt>PERFORM hitung_luas USING 8 CHANGING gv_luas.</tt> (ein Parameter zu wenig) auf und lesen Sie die Fehlermeldung.</li>
      <li>Versuchen Sie im Hauptprogramm, <tt>lv_sementara</tt> nach dem <tt>PERFORM</tt> auszugeben. Warum geht das nicht?</li>
    </ul>`
  });
  add('zh', 'd05', {
    body: `<p><tt>FORM 名称. … ENDFORM.</tt> 定义子程序；<tt>PERFORM 名称.</tt> 调用它。FORM 写在程序的底部。</p>
      <ul>
        <li><tt>USING</tt> ——<b>传入</b> FORM 的数据。</li>
        <li><tt>CHANGING</tt> ——由 FORM <b>修改</b>并返回给调用者的数据。</li>
        <li><tt>TABLES</tt> ——传给 FORM 的内表（旧写法，仍广泛使用）。</li>
        <li>参数按<b>位置</b>匹配，而非按名称。<tt>PERFORM</tt> 和 <tt>FORM</tt> 中的参数数量必须相同。</li>
        <li>在 FORM 内部声明的变量是<b>局部</b>的：FORM 结束后它们就消失。</li>
      </ul>`,
    task: `<ul>
      <li>创建一个 FORM <tt>hitung_diskon</tt>，<tt>USING</tt> 价格和百分比，<tt>CHANGING</tt> 最终价格。</li>
      <li>调用 <tt>PERFORM hitung_luas USING 8 CHANGING gv_luas.</tt>（少一个参数），阅读其错误信息。</li>
      <li>在主程序中，尝试在 <tt>PERFORM</tt> 之后输出 <tt>lv_sementara</tt>。为什么不行？</li>
    </ul>`
  });

  // ---- d06: Selection screen ----
  add('en', 'd06', {
    body: `<p>The first screen of an SAP report is the <b>selection screen</b>: where the user fills in criteria before pressing F8 (Execute).</p>
      <ul>
        <li><tt>PARAMETERS p_x TYPE … DEFAULT ….</tt> — a single value. <tt>AS CHECKBOX</tt> makes a checkbox (holding <tt>'X'</tt> or empty).</li>
        <li><tt>SELECT-OPTIONS s_x FOR variable.</tt> — a range of values (from–to). Used in <tt>WHERE field IN s_x</tt>. If left empty, every value passes.</li>
        <li>Event blocks: <tt>INITIALIZATION</tt> runs before the screen appears; <tt>START-OF-SELECTION</tt> runs after the user presses Execute.</li>
      </ul>
      <p>In this studio, click <b>Parameter</b> (F8) to open the selection screen and fill in the values. The <b>Run</b> button uses the <tt>DEFAULT</tt> values directly.</p>`,
    task: `<ul>
      <li>Open <b>Parameter</b> (F8), clear the price range, and run it. How many flights appear?</li>
      <li>Set <tt>P_CARR</tt> to <tt>SQ</tt> and adjust the price range (SQ prices are in SGD, around 1,200).</li>
      <li>Uncheck <tt>P_DETIL</tt> and see the difference.</li>
    </ul>`
  });
  add('de', 'd06', {
    body: `<p>Das erste Bild eines SAP-Reports ist das <b>Selektionsbild</b>: Hier füllt der Benutzer die Kriterien aus, bevor er F8 (Ausführen) drückt.</p>
      <ul>
        <li><tt>PARAMETERS p_x TYPE … DEFAULT ….</tt> — ein einzelner Wert. <tt>AS CHECKBOX</tt> erzeugt ein Ankreuzfeld (enthält <tt>'X'</tt> oder leer).</li>
        <li><tt>SELECT-OPTIONS s_x FOR variable.</tt> — ein Wertebereich (von–bis). Verwendet in <tt>WHERE field IN s_x</tt>. Bleibt er leer, passieren alle Werte.</li>
        <li>Ereignisblöcke: <tt>INITIALIZATION</tt> läuft, bevor das Bild erscheint; <tt>START-OF-SELECTION</tt> läuft, nachdem der Benutzer Ausführen gedrückt hat.</li>
      </ul>
      <p>Klicken Sie in diesem Studio auf <b>Parameter</b> (F8), um das Selektionsbild zu öffnen und die Werte einzugeben. Die Schaltfläche <b>Ausführen</b> verwendet direkt die <tt>DEFAULT</tt>-Werte.</p>`,
    task: `<ul>
      <li>Öffnen Sie <b>Parameter</b> (F8), leeren Sie den Preisbereich und führen Sie aus. Wie viele Flüge erscheinen?</li>
      <li>Setzen Sie <tt>P_CARR</tt> auf <tt>SQ</tt> und passen Sie den Preisbereich an (SQ-Preise sind in SGD, etwa 1.200).</li>
      <li>Entfernen Sie das Häkchen bei <tt>P_DETIL</tt> und sehen Sie den Unterschied.</li>
    </ul>`
  });
  add('zh', 'd06', {
    body: `<p>SAP 报表的第一个屏幕是<b>选择屏幕</b>：用户在按 F8（执行）之前在此填写条件。</p>
      <ul>
        <li><tt>PARAMETERS p_x TYPE … DEFAULT ….</tt> ——单个值。<tt>AS CHECKBOX</tt> 生成一个复选框（值为 <tt>'X'</tt> 或空）。</li>
        <li><tt>SELECT-OPTIONS s_x FOR variable.</tt> ——取值范围（从–到）。用于 <tt>WHERE field IN s_x</tt>。若留空，则所有值都通过。</li>
        <li>事件块：<tt>INITIALIZATION</tt> 在屏幕出现之前运行；<tt>START-OF-SELECTION</tt> 在用户按下执行之后运行。</li>
      </ul>
      <p>在本工作室中，点击<b>参数</b>(F8) 打开选择屏幕并填写数值。<b>运行</b>按钮会直接使用 <tt>DEFAULT</tt> 值。</p>`,
    task: `<ul>
      <li>打开<b>参数</b>(F8)，清空价格范围并运行。出现了多少个航班？</li>
      <li>把 <tt>P_CARR</tt> 设为 <tt>SQ</tt> 并调整价格范围（SQ 价格以 SGD 计，约 1,200）。</li>
      <li>取消勾选 <tt>P_DETIL</tt>，看看区别。</li>
    </ul>`
  });

  // ---- d07: SELECT: reading the database ----
  add('en', 'd07', {
    body: `<p><tt>SELECT</tt> reads a database table. This studio provides sample tables (see the <b>Tables (DB)</b> menu): SCARR, SPFLI, SFLIGHT, SBOOK, MARA, MAKT, KNA1, LFA1, T001, T005, VBAK, VBAP.</p>
      <ul>
        <li><tt>SELECT f1 f2 FROM table INTO TABLE gt WHERE ….</tt> — many rows into an internal table.</li>
        <li><tt>SELECT SINGLE … INTO gs WHERE ….</tt> — exactly one row into a work area.</li>
        <li>Read <b>only the columns you need</b>; <tt>SELECT *</tt> reads all columns.</li>
        <li>After SELECT: <tt>sy-subrc</tt> = 0 if there is data, 4 if not; <tt>sy-dbcnt</tt> = the number of rows.</li>
        <li><tt>ORDER BY</tt> sorts, <tt>UP TO n ROWS</tt> limits the count, <tt>LIKE 'PT%'</tt> matches a pattern, <tt>COUNT( * )</tt> counts rows.</li>
      </ul>
      <p>Never put a <tt>SELECT</tt> inside a <tt>LOOP</tt> — it is the slowest pattern in ABAP. The solutions (JOIN, FOR ALL ENTRIES) are in the next level.</p>`,
    task: `<ul>
      <li>Show all materials of type <tt>FERT</tt> from table MARA (columns <tt>matnr</tt>, <tt>mtart</tt>, <tt>meins</tt>).</li>
      <li>Write a wrong column name (e.g. <tt>namee1</tt>) and read the error message.</li>
      <li>Read one airline from SCARR with <tt>SELECT SINGLE</tt> by <tt>carrid</tt> from a <tt>PARAMETERS</tt>.</li>
    </ul>`
  });
  add('de', 'd07', {
    body: `<p><tt>SELECT</tt> liest eine Datenbanktabelle. Dieses Studio stellt Beispieltabellen bereit (siehe Menü <b>Tabellen (DB)</b>): SCARR, SPFLI, SFLIGHT, SBOOK, MARA, MAKT, KNA1, LFA1, T001, T005, VBAK, VBAP.</p>
      <ul>
        <li><tt>SELECT f1 f2 FROM tabelle INTO TABLE gt WHERE ….</tt> — viele Zeilen in eine interne Tabelle.</li>
        <li><tt>SELECT SINGLE … INTO gs WHERE ….</tt> — genau eine Zeile in eine Work Area.</li>
        <li>Lesen Sie <b>nur die benötigten Spalten</b>; <tt>SELECT *</tt> liest alle Spalten.</li>
        <li>Nach SELECT: <tt>sy-subrc</tt> = 0, wenn Daten vorhanden sind, 4, wenn nicht; <tt>sy-dbcnt</tt> = Anzahl der Zeilen.</li>
        <li><tt>ORDER BY</tt> sortiert, <tt>UP TO n ROWS</tt> begrenzt die Anzahl, <tt>LIKE 'PT%'</tt> passt zu einem Muster, <tt>COUNT( * )</tt> zählt Zeilen.</li>
      </ul>
      <p>Setzen Sie niemals ein <tt>SELECT</tt> in eine <tt>LOOP</tt> — das ist das langsamste Muster in ABAP. Die Lösungen (JOIN, FOR ALL ENTRIES) folgen in der nächsten Stufe.</p>`,
    task: `<ul>
      <li>Zeigen Sie alle Materialien vom Typ <tt>FERT</tt> aus der Tabelle MARA an (Spalten <tt>matnr</tt>, <tt>mtart</tt>, <tt>meins</tt>).</li>
      <li>Schreiben Sie einen falschen Spaltennamen (z. B. <tt>namee1</tt>) und lesen Sie die Fehlermeldung.</li>
      <li>Lesen Sie eine Fluggesellschaft aus SCARR mit <tt>SELECT SINGLE</tt> anhand von <tt>carrid</tt> aus einem <tt>PARAMETERS</tt>.</li>
    </ul>`
  });
  add('zh', 'd07', {
    body: `<p><tt>SELECT</tt> 读取数据库表。本工作室提供示例表（见<b>数据表 (DB)</b>菜单）：SCARR、SPFLI、SFLIGHT、SBOOK、MARA、MAKT、KNA1、LFA1、T001、T005、VBAK、VBAP。</p>
      <ul>
        <li><tt>SELECT f1 f2 FROM 表 INTO TABLE gt WHERE ….</tt> ——多行读入内表。</li>
        <li><tt>SELECT SINGLE … INTO gs WHERE ….</tt> ——恰好一行读入工作区。</li>
        <li><b>只读取需要的列</b>；<tt>SELECT *</tt> 读取所有列。</li>
        <li>SELECT 之后：有数据时 <tt>sy-subrc</tt> = 0，无数据时 = 4；<tt>sy-dbcnt</tt> = 行数。</li>
        <li><tt>ORDER BY</tt> 排序，<tt>UP TO n ROWS</tt> 限制数量，<tt>LIKE 'PT%'</tt> 匹配模式，<tt>COUNT( * )</tt> 统计行数。</li>
      </ul>
      <p>不要把 <tt>SELECT</tt> 放进 <tt>LOOP</tt> 里——这是 ABAP 中最慢的写法。解决办法（JOIN、FOR ALL ENTRIES）在下一级讲解。</p>`,
    task: `<ul>
      <li>从表 MARA 显示所有类型为 <tt>FERT</tt> 的物料（列 <tt>matnr</tt>、<tt>mtart</tt>、<tt>meins</tt>）。</li>
      <li>写一个错误的列名（例如 <tt>namee1</tt>），阅读其错误信息。</li>
      <li>用 <tt>SELECT SINGLE</tt> 根据来自 <tt>PARAMETERS</tt> 的 <tt>carrid</tt> 从 SCARR 读取一家航空公司。</li>
    </ul>`
  });

  // ---- d08: Report events and list layout ----
  add('en', 'd08', {
    body: `<p>A report program is not run top to bottom. SAP calls <b>event blocks</b> in a fixed order, wherever those blocks are written in the program:</p>
      <table>
        <tr><th>Order</th><th>Event</th><th>When</th></tr>
        <tr><td>1</td><td><tt>INITIALIZATION</tt></td><td>once, before the selection screen appears — where you set initial values</td></tr>
        <tr><td>2</td><td><tt>AT SELECTION-SCREEN</tt></td><td>after the user presses Execute — where you validate the input</td></tr>
        <tr><td>3</td><td><tt>START-OF-SELECTION</tt></td><td>the main processing</td></tr>
        <tr><td>4</td><td><tt>END-OF-SELECTION</tt></td><td>after the main processing — usually prints the result</td></tr>
        <tr><td>—</td><td><tt>TOP-OF-PAGE</tt></td><td>automatically, just before the first list line is printed — column headings</td></tr>
      </table>
      <ul>
        <li>Declarations (<tt>DATA</tt>, <tt>PARAMETERS</tt>) are global, wherever they are written.</li>
        <li>Statements before the first event are treated as part of <tt>START-OF-SELECTION</tt>.</li>
        <li><tt>MESSAGE … TYPE 'E'</tt> in <tt>AT SELECTION-SCREEN</tt> returns the user to the selection screen; the main processing does not run.</li>
        <li><tt>WRITE: /5 text, 20 number.</tt> — the number before a value is the <b>column position</b>; <tt>(10)</tt> is the output length.</li>
      </ul>
      <p>The event blocks in this example are deliberately written <b>out of order</b> — the result is the same.</p>`,
    task: `<ul>
      <li>Open <b>Parameter</b> (F8): notice that <tt>P_CARR</tt> already holds <tt>GA</tt> from <tt>INITIALIZATION</tt>.</li>
      <li>Set <tt>P_MIN</tt> to <tt>-5</tt> and Execute. Which block runs, and which does not?</li>
      <li>Add a price column (<tt>price</tt>) at position 40, together with its column heading.</li>
    </ul>`
  });
  add('de', 'd08', {
    body: `<p>Ein Report-Programm wird nicht von oben nach unten ausgeführt. SAP ruft <b>Ereignisblöcke</b> in einer festen Reihenfolge auf, egal wo diese Blöcke im Programm stehen:</p>
      <table>
        <tr><th>Reihenfolge</th><th>Ereignis</th><th>Wann</th></tr>
        <tr><td>1</td><td><tt>INITIALIZATION</tt></td><td>einmal, bevor das Selektionsbild erscheint — hier setzen Sie Anfangswerte</td></tr>
        <tr><td>2</td><td><tt>AT SELECTION-SCREEN</tt></td><td>nachdem der Benutzer Ausführen gedrückt hat — hier prüfen Sie die Eingabe</td></tr>
        <tr><td>3</td><td><tt>START-OF-SELECTION</tt></td><td>die Hauptverarbeitung</td></tr>
        <tr><td>4</td><td><tt>END-OF-SELECTION</tt></td><td>nach der Hauptverarbeitung — gibt meist das Ergebnis aus</td></tr>
        <tr><td>—</td><td><tt>TOP-OF-PAGE</tt></td><td>automatisch, kurz bevor die erste Listzeile ausgegeben wird — Spaltenüberschriften</td></tr>
      </table>
      <ul>
        <li>Deklarationen (<tt>DATA</tt>, <tt>PARAMETERS</tt>) sind global, egal wo sie stehen.</li>
        <li>Anweisungen vor dem ersten Ereignis gelten als Teil von <tt>START-OF-SELECTION</tt>.</li>
        <li><tt>MESSAGE … TYPE 'E'</tt> in <tt>AT SELECTION-SCREEN</tt> bringt den Benutzer zum Selektionsbild zurück; die Hauptverarbeitung läuft nicht.</li>
        <li><tt>WRITE: /5 text, 20 zahl.</tt> — die Zahl vor einem Wert ist die <b>Spaltenposition</b>; <tt>(10)</tt> ist die Ausgabelänge.</li>
      </ul>
      <p>Die Ereignisblöcke in diesem Beispiel stehen absichtlich <b>in falscher Reihenfolge</b> — das Ergebnis bleibt gleich.</p>`,
    task: `<ul>
      <li>Öffnen Sie <b>Parameter</b> (F8): Beachten Sie, dass <tt>P_CARR</tt> durch <tt>INITIALIZATION</tt> bereits <tt>GA</tt> enthält.</li>
      <li>Setzen Sie <tt>P_MIN</tt> auf <tt>-5</tt> und führen Sie aus. Welcher Block läuft, welcher nicht?</li>
      <li>Fügen Sie eine Preisspalte (<tt>price</tt>) an Position 40 hinzu, samt ihrer Spaltenüberschrift.</li>
    </ul>`
  });
  add('zh', 'd08', {
    body: `<p>报表程序不是从上到下执行的。SAP 按固定顺序调用<b>事件块</b>，无论这些块写在程序的哪个位置：</p>
      <table>
        <tr><th>顺序</th><th>事件</th><th>何时</th></tr>
        <tr><td>1</td><td><tt>INITIALIZATION</tt></td><td>一次，在选择屏幕出现之前——在此设置初始值</td></tr>
        <tr><td>2</td><td><tt>AT SELECTION-SCREEN</tt></td><td>用户按下执行之后——在此校验输入</td></tr>
        <tr><td>3</td><td><tt>START-OF-SELECTION</tt></td><td>主处理</td></tr>
        <tr><td>4</td><td><tt>END-OF-SELECTION</tt></td><td>主处理之后——通常输出结果</td></tr>
        <tr><td>—</td><td><tt>TOP-OF-PAGE</tt></td><td>自动，在第一行列表输出之前——列标题</td></tr>
      </table>
      <ul>
        <li>声明（<tt>DATA</tt>、<tt>PARAMETERS</tt>）是全局的，无论写在何处。</li>
        <li>第一个事件之前的语句被视为 <tt>START-OF-SELECTION</tt> 的一部分。</li>
        <li><tt>AT SELECTION-SCREEN</tt> 中的 <tt>MESSAGE … TYPE 'E'</tt> 会把用户带回选择屏幕；主处理不会运行。</li>
        <li><tt>WRITE: /5 text, 20 number.</tt> ——值前面的数字是<b>列位置</b>；<tt>(10)</tt> 是输出长度。</li>
      </ul>
      <p>本例中的事件块故意<b>打乱顺序</b>书写——结果仍然相同。</p>`,
    task: `<ul>
      <li>打开<b>参数</b>(F8)：注意 <tt>P_CARR</tt> 已通过 <tt>INITIALIZATION</tt> 得到 <tt>GA</tt>。</li>
      <li>把 <tt>P_MIN</tt> 设为 <tt>-5</tt> 并执行。哪个块运行了，哪个没有？</li>
      <li>在第 40 列添加价格列（<tt>price</tt>），连同它的列标题。</li>
    </ul>`
  });

  // ---- d09: Control level: AT NEW, SUM, COLLECT ----
  add('en', 'd09', {
    body: `<p>Inside a <tt>LOOP</tt> over a table that is <b>already sorted</b>, <tt>AT … ENDAT</tt> blocks detect group changes:</p>
      <table>
        <tr><th>Block</th><th>Runs when</th></tr>
        <tr><td><tt>AT FIRST</tt></td><td>the first row</td></tr>
        <tr><td><tt>AT NEW f</tt></td><td>the value of field <tt>f</tt> (or a field to its left) differs from the previous row</td></tr>
        <tr><td><tt>AT END OF f</tt></td><td>the next row has a different value of <tt>f</tt></td></tr>
        <tr><td><tt>AT LAST</tt></td><td>the last row</td></tr>
      </table>
      <ul>
        <li><tt>SUM.</tt> inside such a block fills the numeric fields of the work area with the <b>group total</b>.</li>
        <li>The group field must be on the <b>left</b> of the structure, and the table must be <tt>SORT</tt>ed first.</li>
        <li><tt>COLLECT wa INTO itab.</tt> adds the numeric fields to the row whose non-numeric fields match — a quick way to build a summary.</li>
      </ul>`,
    task: `<ul>
      <li>Remove the <tt>SORT</tt> statement and run it. Why do the subtotals become wrong?</li>
      <li>Add a subtotal per salesperson within each region (<tt>AT END OF sales</tt>).</li>
      <li>Build a summary per salesperson (not per region) with <tt>COLLECT</tt>.</li>
    </ul>`
  });
  add('de', 'd09', {
    body: `<p>Innerhalb einer <tt>LOOP</tt> über eine <b>bereits sortierte</b> Tabelle erkennen <tt>AT … ENDAT</tt>-Blöcke Gruppenwechsel:</p>
      <table>
        <tr><th>Block</th><th>Läuft, wenn</th></tr>
        <tr><td><tt>AT FIRST</tt></td><td>die erste Zeile</td></tr>
        <tr><td><tt>AT NEW f</tt></td><td>der Wert von Feld <tt>f</tt> (oder eines Feldes links davon) sich von der vorherigen Zeile unterscheidet</td></tr>
        <tr><td><tt>AT END OF f</tt></td><td>die nächste Zeile einen anderen Wert von <tt>f</tt> hat</td></tr>
        <tr><td><tt>AT LAST</tt></td><td>die letzte Zeile</td></tr>
      </table>
      <ul>
        <li><tt>SUM.</tt> in einem solchen Block füllt die numerischen Felder der Work Area mit der <b>Gruppensumme</b>.</li>
        <li>Das Gruppenfeld muss <b>links</b> in der Struktur stehen, und die Tabelle muss zuerst <tt>SORT</tt>iert werden.</li>
        <li><tt>COLLECT wa INTO itab.</tt> addiert die numerischen Felder zu der Zeile, deren nicht-numerische Felder übereinstimmen — eine schnelle Art, eine Zusammenfassung zu bilden.</li>
      </ul>`,
    task: `<ul>
      <li>Entfernen Sie die <tt>SORT</tt>-Anweisung und führen Sie es aus. Warum werden die Zwischensummen falsch?</li>
      <li>Fügen Sie eine Zwischensumme pro Verkäufer innerhalb jeder Region hinzu (<tt>AT END OF sales</tt>).</li>
      <li>Bilden Sie mit <tt>COLLECT</tt> eine Zusammenfassung pro Verkäufer (nicht pro Region).</li>
    </ul>`
  });
  add('zh', 'd09', {
    body: `<p>在对<b>已排序</b>的表进行 <tt>LOOP</tt> 时，<tt>AT … ENDAT</tt> 块可检测分组的变化：</p>
      <table>
        <tr><th>块</th><th>何时运行</th></tr>
        <tr><td><tt>AT FIRST</tt></td><td>第一行</td></tr>
        <tr><td><tt>AT NEW f</tt></td><td>字段 <tt>f</tt>（或其左侧字段）的值与上一行不同时</td></tr>
        <tr><td><tt>AT END OF f</tt></td><td>下一行的 <tt>f</tt> 值不同时</td></tr>
        <tr><td><tt>AT LAST</tt></td><td>最后一行</td></tr>
      </table>
      <ul>
        <li>在这类块中，<tt>SUM.</tt> 会把工作区的数值字段填入<b>该分组的合计</b>。</li>
        <li>分组字段必须位于结构的<b>左侧</b>，且表必须先 <tt>SORT</tt> 排序。</li>
        <li><tt>COLLECT wa INTO itab.</tt> 把数值字段累加到非数值字段相同的那一行——快速生成汇总的方法。</li>
      </ul>`,
    task: `<ul>
      <li>删除 <tt>SORT</tt> 语句并运行。为什么小计会出错？</li>
      <li>在每个区域内，按销售员添加小计（<tt>AT END OF sales</tt>）。</li>
      <li>用 <tt>COLLECT</tt> 生成按销售员（而非按区域）的汇总。</li>
    </ul>`
  });

  // ---- d10: Table kinds: STANDARD, SORTED, HASHED ----
  add('en', 'd10', {
    body: `<table>
        <tr><th>Kind</th><th>Row order</th><th>Fastest access</th><th>Good for</th></tr>
        <tr><td><tt>STANDARD</tt></td><td>as <tt>APPEND</tt>ed</td><td>by index</td><td>lists processed in order</td></tr>
        <tr><td><tt>SORTED</tt></td><td>always sorted by key</td><td>by key (binary search)</td><td>data searched often and kept sorted</td></tr>
        <tr><td><tt>HASHED</tt></td><td>no order, no index</td><td>by unique key (constant time)</td><td>large tables searched only by key</td></tr>
      </table>
      <ul>
        <li>For <tt>SORTED</tt> and <tt>HASHED</tt>, fill the table with <tt>INSERT … INTO TABLE</tt>. The system decides the position itself.</li>
        <li>With a <tt>UNIQUE KEY</tt>, a row with a duplicate key is rejected: <tt>sy-subrc = 4</tt>.</li>
        <li><tt>READ TABLE … WITH TABLE KEY</tt> uses the table key, so it is far faster than <tt>WITH KEY</tt> on a large standard table.</li>
        <li><tt>APPEND</tt> to a <tt>SORTED</tt> table is only allowed if the order stays intact; to a <tt>HASHED</tt> table it is not allowed at all.</li>
      </ul>`,
    task: `<ul>
      <li>Write <tt>APPEND gs_kota TO gt_hashed.</tt> and read the error message.</li>
      <li>Set <tt>gs_kota-kode = 'AAA'</tt> then <tt>APPEND gs_kota TO gt_sorted.</tt> — the program stops with a runtime error. Why is <tt>INSERT … INTO TABLE</tt> safe?</li>
      <li>Change the sorted table's key to <tt>NON-UNIQUE KEY kode</tt> and repeat inserting a duplicate key.</li>
    </ul>`
  });
  add('de', 'd10', {
    body: `<table>
        <tr><th>Art</th><th>Zeilenreihenfolge</th><th>Schnellster Zugriff</th><th>Geeignet für</th></tr>
        <tr><td><tt>STANDARD</tt></td><td>wie <tt>APPEND</tt>t</td><td>über Index</td><td>Listen, die der Reihe nach verarbeitet werden</td></tr>
        <tr><td><tt>SORTED</tt></td><td>immer nach Schlüssel sortiert</td><td>über Schlüssel (binäre Suche)</td><td>Daten, die oft gesucht werden und sortiert bleiben</td></tr>
        <tr><td><tt>HASHED</tt></td><td>keine Reihenfolge, kein Index</td><td>über eindeutigen Schlüssel (konstante Zeit)</td><td>große Tabellen, die nur über Schlüssel gesucht werden</td></tr>
      </table>
      <ul>
        <li>Füllen Sie <tt>SORTED</tt>- und <tt>HASHED</tt>-Tabellen mit <tt>INSERT … INTO TABLE</tt>. Das System bestimmt die Position selbst.</li>
        <li>Mit einem <tt>UNIQUE KEY</tt> wird eine Zeile mit doppeltem Schlüssel abgewiesen: <tt>sy-subrc = 4</tt>.</li>
        <li><tt>READ TABLE … WITH TABLE KEY</tt> verwendet den Tabellenschlüssel und ist daher weit schneller als <tt>WITH KEY</tt> bei einer großen Standardtabelle.</li>
        <li><tt>APPEND</tt> an eine <tt>SORTED</tt>-Tabelle ist nur erlaubt, wenn die Reihenfolge erhalten bleibt; an eine <tt>HASHED</tt>-Tabelle gar nicht.</li>
      </ul>`,
    task: `<ul>
      <li>Schreiben Sie <tt>APPEND gs_kota TO gt_hashed.</tt> und lesen Sie die Fehlermeldung.</li>
      <li>Setzen Sie <tt>gs_kota-kode = 'AAA'</tt> und dann <tt>APPEND gs_kota TO gt_sorted.</tt> — das Programm stoppt mit einem Laufzeitfehler. Warum ist <tt>INSERT … INTO TABLE</tt> sicher?</li>
      <li>Ändern Sie den Schlüssel der sortierten Tabelle auf <tt>NON-UNIQUE KEY kode</tt> und wiederholen Sie das Einfügen eines doppelten Schlüssels.</li>
    </ul>`
  });
  add('zh', 'd10', {
    body: `<table>
        <tr><th>类型</th><th>行顺序</th><th>最快访问</th><th>适合</th></tr>
        <tr><td><tt>STANDARD</tt></td><td>按 <tt>APPEND</tt> 顺序</td><td>按索引</td><td>按顺序处理的列表</td></tr>
        <tr><td><tt>SORTED</tt></td><td>始终按键排序</td><td>按键（二分查找）</td><td>经常查找且需保持有序的数据</td></tr>
        <tr><td><tt>HASHED</tt></td><td>无顺序、无索引</td><td>按唯一键（常数时间）</td><td>仅按键查找的大表</td></tr>
      </table>
      <ul>
        <li>对 <tt>SORTED</tt> 和 <tt>HASHED</tt> 表，用 <tt>INSERT … INTO TABLE</tt> 填充。系统自行决定位置。</li>
        <li>使用 <tt>UNIQUE KEY</tt> 时，键重复的行会被拒绝：<tt>sy-subrc = 4</tt>。</li>
        <li><tt>READ TABLE … WITH TABLE KEY</tt> 使用表键，因此比在大型标准表上使用 <tt>WITH KEY</tt> 快得多。</li>
        <li>仅当顺序保持不变时才允许对 <tt>SORTED</tt> 表 <tt>APPEND</tt>；对 <tt>HASHED</tt> 表完全不允许。</li>
      </ul>`,
    task: `<ul>
      <li>写 <tt>APPEND gs_kota TO gt_hashed.</tt> 并阅读其错误信息。</li>
      <li>设置 <tt>gs_kota-kode = 'AAA'</tt> 然后 <tt>APPEND gs_kota TO gt_sorted.</tt> ——程序会以运行时错误停止。为什么 <tt>INSERT … INTO TABLE</tt> 是安全的？</li>
      <li>把排序表的键改为 <tt>NON-UNIQUE KEY kode</tt>，重复插入一个重复的键。</li>
    </ul>`
  });


  // ============================================================
  // LEVEL 3 — Intermediate (m01,m08,m02,m03,m09,m04,m05,m06,m10,m11,m07)
  // ============================================================

  // ---- m01: Advanced SELECT: JOIN and FOR ALL ENTRIES ----
  add('en', 'm01', {
    body: `<p>SAP data is spread across many tables: the ticket price is in SFLIGHT, the airline name in SCARR. There are two standard ways to combine them.</p>
      <h4>1. INNER JOIN — combined by the database</h4>
      <ul>
        <li>Give each table an alias (<tt>AS f</tt>) and write columns as <tt>alias~column</tt>.</li>
        <li><tt>ON</tt> states the linking columns. Rows without a match are left out. <tt>LEFT OUTER JOIN</tt> still includes the left rows even without a match.</li>
      </ul>
      <h4>2. FOR ALL ENTRIES — combined in the program</h4>
      <ul>
        <li>Read the first table first, then read the second <tt>FOR ALL ENTRIES IN gt_first WHERE key = gt_first-key</tt>.</li>
        <li><b>Classic trap:</b> if the first table is empty, the <tt>WHERE</tt> is ignored and the <b>whole</b> second table is read. Always wrap it in <tt>IF gt_first IS NOT INITIAL.</tt></li>
        <li>Duplicate result rows are removed automatically.</li>
      </ul>`,
    task: `<ul>
      <li>Join SPFLI with SCARR to show the airline name, origin city, and destination city.</li>
      <li>Remove <tt>IF gt_order IS NOT INITIAL</tt>, add <tt>WHERE vkorg = '9999'</tt> to the first SELECT, and run it. Read the warning.</li>
      <li>Join MARA with MAKT (<tt>spras = 'EN'</tt>) to show the material description.</li>
    </ul>`
  });
  add('de', 'm01', {
    body: `<p>SAP-Daten verteilen sich auf viele Tabellen: Der Ticketpreis steht in SFLIGHT, der Name der Fluggesellschaft in SCARR. Es gibt zwei Standardwege, sie zu verbinden.</p>
      <h4>1. INNER JOIN — von der Datenbank verbunden</h4>
      <ul>
        <li>Geben Sie jeder Tabelle einen Alias (<tt>AS f</tt>) und schreiben Sie Spalten als <tt>alias~spalte</tt>.</li>
        <li><tt>ON</tt> gibt die verbindenden Spalten an. Zeilen ohne Partner entfallen. <tt>LEFT OUTER JOIN</tt> nimmt die linken Zeilen auch ohne Partner mit.</li>
      </ul>
      <h4>2. FOR ALL ENTRIES — im Programm verbunden</h4>
      <ul>
        <li>Lesen Sie zuerst die erste Tabelle, dann die zweite <tt>FOR ALL ENTRIES IN gt_first WHERE schlüssel = gt_first-schlüssel</tt>.</li>
        <li><b>Klassische Falle:</b> Ist die erste Tabelle leer, wird das <tt>WHERE</tt> ignoriert und die <b>gesamte</b> zweite Tabelle gelesen. Umschließen Sie es immer mit <tt>IF gt_first IS NOT INITIAL.</tt></li>
        <li>Doppelte Ergebniszeilen werden automatisch entfernt.</li>
      </ul>`,
    task: `<ul>
      <li>Verbinden Sie SPFLI mit SCARR, um Name der Fluggesellschaft, Abflug- und Zielstadt anzuzeigen.</li>
      <li>Entfernen Sie <tt>IF gt_order IS NOT INITIAL</tt>, fügen Sie dem ersten SELECT <tt>WHERE vkorg = '9999'</tt> hinzu und führen Sie es aus. Lesen Sie die Warnung.</li>
      <li>Verbinden Sie MARA mit MAKT (<tt>spras = 'EN'</tt>), um die Materialbeschreibung anzuzeigen.</li>
    </ul>`
  });
  add('zh', 'm01', {
    body: `<p>SAP 数据分散在许多表中：机票价格在 SFLIGHT，航空公司名称在 SCARR。有两种标准方式把它们组合起来。</p>
      <h4>1. INNER JOIN——由数据库连接</h4>
      <ul>
        <li>给每张表取一个别名（<tt>AS f</tt>），并把列写成 <tt>别名~列</tt>。</li>
        <li><tt>ON</tt> 指明连接列。没有匹配的行被排除。<tt>LEFT OUTER JOIN</tt> 即使没有匹配也保留左表的行。</li>
      </ul>
      <h4>2. FOR ALL ENTRIES——在程序中连接</h4>
      <ul>
        <li>先读第一张表，再读第二张表 <tt>FOR ALL ENTRIES IN gt_first WHERE 键 = gt_first-键</tt>。</li>
        <li><b>经典陷阱：</b>若第一张表为空，<tt>WHERE</tt> 会被忽略，从而读取<b>整张</b>第二表。务必用 <tt>IF gt_first IS NOT INITIAL.</tt> 包起来。</li>
        <li>结果中的重复行会自动去除。</li>
      </ul>`,
    task: `<ul>
      <li>连接 SPFLI 与 SCARR，显示航空公司名称、出发城市和到达城市。</li>
      <li>删除 <tt>IF gt_order IS NOT INITIAL</tt>，在第一个 SELECT 加上 <tt>WHERE vkorg = '9999'</tt> 并运行。阅读其警告。</li>
      <li>连接 MARA 与 MAKT（<tt>spras = 'EN'</tt>），显示物料描述。</li>
    </ul>`
  });

  // ---- m08: SQL aggregates, GROUP BY, changing data ----
  add('en', 'm08', {
    body: `<h4>Let the database do the counting</h4>
      <ul>
        <li>Aggregate functions: <tt>COUNT( * )</tt>, <tt>SUM( f )</tt>, <tt>MAX( f )</tt>, <tt>MIN( f )</tt>, <tt>AVG( f )</tt>.</li>
        <li><tt>GROUP BY</tt> produces one result row per group. Every ordinary column in the SELECT list <b>must</b> appear in <tt>GROUP BY</tt>.</li>
        <li><tt>HAVING</tt> filters <b>groups</b> (after the aggregates are computed); <tt>WHERE</tt> filters <b>rows</b> (before).</li>
        <li><tt>AS name</tt> names a result column so it matches a component of the target structure.</li>
      </ul>
      <h4>Changing table contents</h4>
      <table>
        <tr><th>Statement</th><th>Meaning</th><th>sy-subrc = 4 when</th></tr>
        <tr><td><tt>INSERT dbtab FROM wa.</tt></td><td>add a new row</td><td>the key already exists</td></tr>
        <tr><td><tt>UPDATE dbtab SET f = v WHERE …</tt></td><td>change the matching rows</td><td>no row matches</td></tr>
        <tr><td><tt>MODIFY dbtab FROM wa.</tt></td><td>change if present, add if not</td><td>—</td></tr>
        <tr><td><tt>DELETE FROM dbtab WHERE …</tt></td><td>delete the matching rows</td><td>no row matches</td></tr>
      </table>
      <p><tt>COMMIT WORK</tt> saves the changes permanently, <tt>ROLLBACK WORK</tt> undoes every change since the last commit. <tt>UPDATE</tt> or <tt>DELETE</tt> without <tt>WHERE</tt> affects the <b>whole</b> table. In this studio changes last only while the program runs; the sample data always returns intact.</p>`,
    task: `<ul>
      <li>Compute the average ticket price per currency (<tt>AVG( price )</tt>, <tt>GROUP BY currency</tt>).</li>
      <li>Add a <tt>connid</tt> column to the SELECT list without putting it in <tt>GROUP BY</tt>. Read the error message.</li>
      <li>Move <tt>COMMIT WORK</tt> to after the <tt>DELETE</tt>. How many airlines remain after the <tt>ROLLBACK</tt>?</li>
    </ul>`
  });
  add('de', 'm08', {
    body: `<h4>Lassen Sie die Datenbank rechnen</h4>
      <ul>
        <li>Aggregatfunktionen: <tt>COUNT( * )</tt>, <tt>SUM( f )</tt>, <tt>MAX( f )</tt>, <tt>MIN( f )</tt>, <tt>AVG( f )</tt>.</li>
        <li><tt>GROUP BY</tt> erzeugt eine Ergebniszeile pro Gruppe. Jede gewöhnliche Spalte in der SELECT-Liste <b>muss</b> im <tt>GROUP BY</tt> stehen.</li>
        <li><tt>HAVING</tt> filtert <b>Gruppen</b> (nach der Aggregation); <tt>WHERE</tt> filtert <b>Zeilen</b> (davor).</li>
        <li><tt>AS name</tt> benennt eine Ergebnisspalte, damit sie zu einer Komponente der Zielstruktur passt.</li>
      </ul>
      <h4>Tabelleninhalt ändern</h4>
      <table>
        <tr><th>Anweisung</th><th>Bedeutung</th><th>sy-subrc = 4, wenn</th></tr>
        <tr><td><tt>INSERT dbtab FROM wa.</tt></td><td>neue Zeile hinzufügen</td><td>der Schlüssel schon existiert</td></tr>
        <tr><td><tt>UPDATE dbtab SET f = v WHERE …</tt></td><td>passende Zeilen ändern</td><td>keine Zeile passt</td></tr>
        <tr><td><tt>MODIFY dbtab FROM wa.</tt></td><td>ändern, falls vorhanden, sonst hinzufügen</td><td>—</td></tr>
        <tr><td><tt>DELETE FROM dbtab WHERE …</tt></td><td>passende Zeilen löschen</td><td>keine Zeile passt</td></tr>
      </table>
      <p><tt>COMMIT WORK</tt> speichert die Änderungen dauerhaft, <tt>ROLLBACK WORK</tt> macht jede Änderung seit dem letzten Commit rückgängig. <tt>UPDATE</tt> oder <tt>DELETE</tt> ohne <tt>WHERE</tt> betrifft die <b>gesamte</b> Tabelle. In diesem Studio gelten Änderungen nur während der Programmlaufzeit; die Beispieldaten kehren immer unversehrt zurück.</p>`,
    task: `<ul>
      <li>Berechnen Sie den durchschnittlichen Ticketpreis pro Währung (<tt>AVG( price )</tt>, <tt>GROUP BY currency</tt>).</li>
      <li>Fügen Sie der SELECT-Liste eine Spalte <tt>connid</tt> hinzu, ohne sie ins <tt>GROUP BY</tt> zu setzen. Lesen Sie die Fehlermeldung.</li>
      <li>Verschieben Sie <tt>COMMIT WORK</tt> hinter das <tt>DELETE</tt>. Wie viele Fluggesellschaften bleiben nach dem <tt>ROLLBACK</tt>?</li>
    </ul>`
  });
  add('zh', 'm08', {
    body: `<h4>让数据库来计算</h4>
      <ul>
        <li>聚合函数：<tt>COUNT( * )</tt>、<tt>SUM( f )</tt>、<tt>MAX( f )</tt>、<tt>MIN( f )</tt>、<tt>AVG( f )</tt>。</li>
        <li><tt>GROUP BY</tt> 每个分组产生一行结果。SELECT 列表中的每个普通列都<b>必须</b>出现在 <tt>GROUP BY</tt> 中。</li>
        <li><tt>HAVING</tt> 过滤<b>分组</b>（在聚合之后）；<tt>WHERE</tt> 过滤<b>行</b>（在聚合之前）。</li>
        <li><tt>AS 名称</tt> 为结果列命名，使其与目标结构的组件相匹配。</li>
      </ul>
      <h4>修改表内容</h4>
      <table>
        <tr><th>语句</th><th>含义</th><th>sy-subrc = 4 当</th></tr>
        <tr><td><tt>INSERT dbtab FROM wa.</tt></td><td>添加一行新行</td><td>键已存在</td></tr>
        <tr><td><tt>UPDATE dbtab SET f = v WHERE …</tt></td><td>修改匹配的行</td><td>没有匹配的行</td></tr>
        <tr><td><tt>MODIFY dbtab FROM wa.</tt></td><td>存在则改，不存在则增</td><td>—</td></tr>
        <tr><td><tt>DELETE FROM dbtab WHERE …</tt></td><td>删除匹配的行</td><td>没有匹配的行</td></tr>
      </table>
      <p><tt>COMMIT WORK</tt> 永久保存更改，<tt>ROLLBACK WORK</tt> 撤销自上次提交以来的所有更改。不带 <tt>WHERE</tt> 的 <tt>UPDATE</tt> 或 <tt>DELETE</tt> 会影响<b>整张</b>表。在本工作室中，更改只在程序运行期间有效；示例数据始终会完整恢复。</p>`,
    task: `<ul>
      <li>按货币计算平均机票价格（<tt>AVG( price )</tt>、<tt>GROUP BY currency</tt>）。</li>
      <li>在 SELECT 列表中添加 <tt>connid</tt> 列，但不放入 <tt>GROUP BY</tt>。阅读其错误信息。</li>
      <li>把 <tt>COMMIT WORK</tt> 移到 <tt>DELETE</tt> 之后。<tt>ROLLBACK</tt> 之后还剩多少家航空公司？</li>
    </ul>`
  });

  // ---- m02: Messages and classic error handling ----
  add('en', 'm02', {
    body: `<p>Almost every statement that can fail sets <tt>sy-subrc</tt>: 0 means success, anything else means failure. Good programs <b>always</b> check it right after <tt>SELECT</tt>, <tt>READ TABLE</tt>, and <tt>CALL FUNCTION</tt>.</p>
      <table>
        <tr><th>MESSAGE … TYPE</th><th>Meaning</th><th>Effect in SAP</th></tr>
        <tr><td><tt>'S'</tt></td><td>Success</td><td>message in the status bar, program continues</td></tr>
        <tr><td><tt>'I'</tt></td><td>Information</td><td>popup, program continues after Enter</td></tr>
        <tr><td><tt>'W'</tt></td><td>Warning</td><td>warning, the user can continue</td></tr>
        <tr><td><tt>'E'</tt></td><td>Error</td><td>the current process is stopped</td></tr>
        <tr><td><tt>'A'</tt> / <tt>'X'</tt></td><td>Abort / dump</td><td>the program is ended</td></tr>
      </table>
      <p><tt>RETURN</tt> leaves the current FORM immediately — the "check, report, leave" pattern keeps code from nesting too deeply. In this studio all messages are printed to the Output; as in SAP, messages of type <tt>E</tt>, <tt>A</tt>, and <tt>X</tt> <b>stop the program</b>. <tt>TYPE 'S' DISPLAY LIKE 'E'</tt> shows a message in error colours without stopping the program.</p>`,
    task: `<ul>
      <li>Add a check: if <tt>pv_matnr</tt> is empty (<tt>IS INITIAL</tt>), issue a type <tt>'E'</tt> message and then <tt>RETURN</tt>.</li>
      <li>Remove the <tt>RETURN</tt> and run it. Which material data is printed for number 9999-999, and why is that dangerous?</li>
    </ul>`
  });
  add('de', 'm02', {
    body: `<p>Fast jede Anweisung, die fehlschlagen kann, setzt <tt>sy-subrc</tt>: 0 bedeutet Erfolg, alles andere Misserfolg. Gute Programme prüfen es <b>immer</b> direkt nach <tt>SELECT</tt>, <tt>READ TABLE</tt> und <tt>CALL FUNCTION</tt>.</p>
      <table>
        <tr><th>MESSAGE … TYPE</th><th>Bedeutung</th><th>Wirkung in SAP</th></tr>
        <tr><td><tt>'S'</tt></td><td>Erfolg</td><td>Meldung in der Statusleiste, Programm läuft weiter</td></tr>
        <tr><td><tt>'I'</tt></td><td>Information</td><td>Popup, Programm läuft nach Enter weiter</td></tr>
        <tr><td><tt>'W'</tt></td><td>Warnung</td><td>Warnung, der Benutzer kann fortfahren</td></tr>
        <tr><td><tt>'E'</tt></td><td>Fehler</td><td>der aktuelle Vorgang wird gestoppt</td></tr>
        <tr><td><tt>'A'</tt> / <tt>'X'</tt></td><td>Abbruch / Dump</td><td>das Programm wird beendet</td></tr>
      </table>
      <p><tt>RETURN</tt> verlässt die aktuelle FORM sofort — das Muster „prüfen, melden, verlassen“ verhindert zu tiefe Verschachtelung. In diesem Studio werden alle Meldungen in die Ausgabe geschrieben; wie in SAP <b>stoppen</b> Meldungen vom Typ <tt>E</tt>, <tt>A</tt> und <tt>X</tt> das Programm. <tt>TYPE 'S' DISPLAY LIKE 'E'</tt> zeigt eine Meldung in Fehlerfarben, ohne das Programm zu stoppen.</p>`,
    task: `<ul>
      <li>Fügen Sie eine Prüfung hinzu: Ist <tt>pv_matnr</tt> leer (<tt>IS INITIAL</tt>), geben Sie eine Meldung vom Typ <tt>'E'</tt> aus und dann <tt>RETURN</tt>.</li>
      <li>Entfernen Sie das <tt>RETURN</tt> und führen Sie es aus. Welche Materialdaten werden für die Nummer 9999-999 ausgegeben, und warum ist das gefährlich?</li>
    </ul>`
  });
  add('zh', 'm02', {
    body: `<p>几乎每条可能失败的语句都会设置 <tt>sy-subrc</tt>：0 表示成功，其他表示失败。好的程序<b>总是</b>在 <tt>SELECT</tt>、<tt>READ TABLE</tt> 和 <tt>CALL FUNCTION</tt> 之后立即检查它。</p>
      <table>
        <tr><th>MESSAGE … TYPE</th><th>含义</th><th>在 SAP 中的效果</th></tr>
        <tr><td><tt>'S'</tt></td><td>成功</td><td>状态栏显示消息，程序继续</td></tr>
        <tr><td><tt>'I'</tt></td><td>信息</td><td>弹窗，按回车后程序继续</td></tr>
        <tr><td><tt>'W'</tt></td><td>警告</td><td>警告，用户可以继续</td></tr>
        <tr><td><tt>'E'</tt></td><td>错误</td><td>当前处理被中止</td></tr>
        <tr><td><tt>'A'</tt> / <tt>'X'</tt></td><td>中止 / 转储</td><td>程序被终止</td></tr>
      </table>
      <p><tt>RETURN</tt> 立即退出当前 FORM——“检查、报告、退出”的模式可避免代码嵌套过深。在本工作室中，所有消息都打印到输出；与 SAP 一样，<tt>E</tt>、<tt>A</tt>、<tt>X</tt> 类型的消息会<b>停止程序</b>。<tt>TYPE 'S' DISPLAY LIKE 'E'</tt> 以错误颜色显示消息但不停止程序。</p>`,
    task: `<ul>
      <li>添加一个检查：若 <tt>pv_matnr</tt> 为空（<tt>IS INITIAL</tt>），发出一条 <tt>'E'</tt> 类型消息，然后 <tt>RETURN</tt>。</li>
      <li>删除 <tt>RETURN</tt> 并运行。编号 9999-999 会打印出哪条物料数据，为什么这很危险？</li>
    </ul>`
  });

  // ---- m03: Function module: CALL FUNCTION ----
  add('en', 'm03', {
    body: `<p>A <b>function module</b> (FM) is a ready-made procedure stored centrally in SAP (transaction SE37). Thousands of standard FMs exist; good code uses them instead of rewriting the same logic.</p>
      <table>
        <tr><th>Part</th><th>Direction</th><th>Contents</th></tr>
        <tr><td><tt>EXPORTING</tt></td><td>program → FM</td><td>input values</td></tr>
        <tr><td><tt>IMPORTING</tt></td><td>FM → program</td><td>results</td></tr>
        <tr><td><tt>CHANGING</tt></td><td>both ways</td><td>data the FM changes</td></tr>
        <tr><td><tt>TABLES</tt></td><td>both ways</td><td>internal table</td></tr>
        <tr><td><tt>EXCEPTIONS</tt></td><td>FM → program</td><td>error name → <tt>sy-subrc</tt> number</td></tr>
      </table>
      <ul>
        <li>The FM name is written in quotes and <b>upper case</b>. Parameter names must match the FM definition exactly.</li>
        <li>If the FM raises an exception that is <b>not</b> mapped in <tt>EXCEPTIONS</tt>, the program stops with a short dump. <tt>OTHERS</tt> catches everything not named.</li>
        <li>Do not write a period between the parts: the whole <tt>CALL FUNCTION</tt> is <b>one</b> statement.</li>
      </ul>
      <p>The list of FMs this studio simulates is under <b>Docs → Function Module</b>.</p>`,
    task: `<ul>
      <li>Remove the <tt>EXCEPTIONS</tt> part from the call with an invalid date, then run it. What is the difference?</li>
      <li>Call a non-existent FM (<tt>CALL FUNCTION 'Z_COBA'.</tt>) and read the warning.</li>
      <li>Compute the date 3 months before today with <tt>RP_CALC_DATE_IN_INTERVAL</tt> (<tt>date = sy-datum</tt>, <tt>signum = '-'</tt>).</li>
    </ul>`
  });
  add('de', 'm03', {
    body: `<p>Ein <b>Funktionsbaustein</b> (FB) ist eine fertige Prozedur, zentral in SAP gespeichert (Transaktion SE37). Es gibt Tausende von Standard-FBs; guter Code verwendet sie, statt dieselbe Logik neu zu schreiben.</p>
      <table>
        <tr><th>Teil</th><th>Richtung</th><th>Inhalt</th></tr>
        <tr><td><tt>EXPORTING</tt></td><td>Programm → FB</td><td>Eingabewerte</td></tr>
        <tr><td><tt>IMPORTING</tt></td><td>FB → Programm</td><td>Ergebnisse</td></tr>
        <tr><td><tt>CHANGING</tt></td><td>beide Richtungen</td><td>Daten, die der FB ändert</td></tr>
        <tr><td><tt>TABLES</tt></td><td>beide Richtungen</td><td>interne Tabelle</td></tr>
        <tr><td><tt>EXCEPTIONS</tt></td><td>FB → Programm</td><td>Fehlername → <tt>sy-subrc</tt>-Zahl</td></tr>
      </table>
      <ul>
        <li>Der FB-Name steht in Anführungszeichen und <b>Großbuchstaben</b>. Die Parameternamen müssen genau der FB-Definition entsprechen.</li>
        <li>Löst der FB eine Ausnahme aus, die <b>nicht</b> in <tt>EXCEPTIONS</tt> abgebildet ist, stoppt das Programm mit einem Short Dump. <tt>OTHERS</tt> fängt alles Nicht-Genannte ab.</li>
        <li>Schreiben Sie keinen Punkt zwischen die Teile: Das ganze <tt>CALL FUNCTION</tt> ist <b>eine</b> Anweisung.</li>
      </ul>
      <p>Die Liste der von diesem Studio simulierten FBs steht unter <b>Doku → Funktionsbaustein</b>.</p>`,
    task: `<ul>
      <li>Entfernen Sie den Teil <tt>EXCEPTIONS</tt> aus dem Aufruf mit ungültigem Datum und führen Sie es aus. Was ist der Unterschied?</li>
      <li>Rufen Sie einen nicht vorhandenen FB auf (<tt>CALL FUNCTION 'Z_COBA'.</tt>) und lesen Sie die Warnung.</li>
      <li>Berechnen Sie das Datum 3 Monate vor heute mit <tt>RP_CALC_DATE_IN_INTERVAL</tt> (<tt>date = sy-datum</tt>, <tt>signum = '-'</tt>).</li>
    </ul>`
  });
  add('zh', 'm03', {
    body: `<p><b>函数模块</b>（FM）是集中存储在 SAP 中的现成过程（事务 SE37）。有成千上万的标准 FM；好的代码会使用它们，而不是重写相同的逻辑。</p>
      <table>
        <tr><th>部分</th><th>方向</th><th>内容</th></tr>
        <tr><td><tt>EXPORTING</tt></td><td>程序 → FM</td><td>输入值</td></tr>
        <tr><td><tt>IMPORTING</tt></td><td>FM → 程序</td><td>结果</td></tr>
        <tr><td><tt>CHANGING</tt></td><td>双向</td><td>FM 修改的数据</td></tr>
        <tr><td><tt>TABLES</tt></td><td>双向</td><td>内表</td></tr>
        <tr><td><tt>EXCEPTIONS</tt></td><td>FM → 程序</td><td>错误名称 → <tt>sy-subrc</tt> 数字</td></tr>
      </table>
      <ul>
        <li>FM 名称用引号和<b>大写</b>书写。参数名称必须与 FM 定义完全一致。</li>
        <li>若 FM 引发了<b>未</b>在 <tt>EXCEPTIONS</tt> 中映射的异常，程序会以 short dump 停止。<tt>OTHERS</tt> 捕获所有未指明的异常。</li>
        <li>各部分之间不要写句点：整个 <tt>CALL FUNCTION</tt> 是<b>一条</b>语句。</li>
      </ul>
      <p>本工作室模拟的 FM 列表见 <b>文档 → 函数模块</b>。</p>`,
    task: `<ul>
      <li>从带无效日期的调用中删除 <tt>EXCEPTIONS</tt> 部分，然后运行。有什么区别？</li>
      <li>调用一个不存在的 FM（<tt>CALL FUNCTION 'Z_COBA'.</tt>），阅读其警告。</li>
      <li>用 <tt>RP_CALC_DATE_IN_INTERVAL</tt> 计算今天 3 个月前的日期（<tt>date = sy-datum</tt>、<tt>signum = '-'</tt>）。</li>
    </ul>`
  });

  // ---- m09: Writing your own function module ----
  add('en', 'm09', {
    body: `<p>A function module is created in the <b>Function Builder (SE37)</b> and lives inside a <i>function group</i>. Its parameters are defined on tabs in the SE37 screen, and SAP shows them inside the code as a <tt>*"</tt> comment block. In this studio the FM is written in the same program, and <b>that comment block is read as the interface</b>:</p>
      <ul>
        <li><tt>IMPORTING</tt> — input. <tt>OPTIONAL</tt> / <tt>DEFAULT</tt> make it optional.</li>
        <li><tt>EXPORTING</tt> — result. <tt>CHANGING</tt> — in and out. <tt>TABLES</tt> — internal table.</li>
        <li><tt>EXCEPTIONS</tt> — error names that can be raised with <tt>RAISE name.</tt> As soon as <tt>RAISE</tt> runs, the FM ends immediately.</li>
      </ul>
      <p>Note that the direction is reversed: an FM's <tt>IMPORTING</tt> parameter is filled through <tt>EXPORTING</tt> on the caller's side, and vice versa. Variables declared inside the FM are local.</p>`,
    task: `<ul>
      <li>Remove <tt>EXCEPTIONS</tt> from the third call and run it. What happens when an exception is not handled?</li>
      <li>Call it with a wrong parameter name (<tt>iv_hrg = 1000</tt>) and read the error message.</li>
      <li>Add an <tt>EXPORTING ev_diskon</tt> parameter that returns the discount value.</li>
    </ul>`
  });
  add('de', 'm09', {
    body: `<p>Ein Funktionsbaustein wird im <b>Function Builder (SE37)</b> erstellt und lebt in einer <i>Funktionsgruppe</i>. Seine Parameter werden auf Registerkarten im SE37-Bild definiert, und SAP zeigt sie im Code als <tt>*"</tt>-Kommentarblock an. In diesem Studio wird der FB im selben Programm geschrieben, und <b>dieser Kommentarblock wird als Schnittstelle gelesen</b>:</p>
      <ul>
        <li><tt>IMPORTING</tt> — Eingabe. <tt>OPTIONAL</tt> / <tt>DEFAULT</tt> machen ihn optional.</li>
        <li><tt>EXPORTING</tt> — Ergebnis. <tt>CHANGING</tt> — rein und raus. <tt>TABLES</tt> — interne Tabelle.</li>
        <li><tt>EXCEPTIONS</tt> — Fehlernamen, die mit <tt>RAISE name.</tt> ausgelöst werden können. Sobald <tt>RAISE</tt> läuft, endet der FB sofort.</li>
      </ul>
      <p>Beachten Sie die umgekehrte Richtung: Ein <tt>IMPORTING</tt>-Parameter des FB wird über <tt>EXPORTING</tt> auf der Aufruferseite gefüllt und umgekehrt. Innerhalb des FB deklarierte Variablen sind lokal.</p>`,
    task: `<ul>
      <li>Entfernen Sie <tt>EXCEPTIONS</tt> aus dem dritten Aufruf und führen Sie es aus. Was passiert, wenn eine Ausnahme nicht behandelt wird?</li>
      <li>Rufen Sie ihn mit einem falschen Parameternamen auf (<tt>iv_hrg = 1000</tt>) und lesen Sie die Fehlermeldung.</li>
      <li>Fügen Sie einen Parameter <tt>EXPORTING ev_diskon</tt> hinzu, der den Rabattwert zurückgibt.</li>
    </ul>`
  });
  add('zh', 'm09', {
    body: `<p>函数模块在 <b>Function Builder (SE37)</b> 中创建，存在于一个<i>函数组</i>内。它的参数在 SE37 屏幕的选项卡上定义，SAP 在代码中以 <tt>*"</tt> 注释块显示它们。在本工作室中，FM 写在同一个程序里，<b>该注释块被读取为接口</b>：</p>
      <ul>
        <li><tt>IMPORTING</tt> ——输入。<tt>OPTIONAL</tt> / <tt>DEFAULT</tt> 使其可选。</li>
        <li><tt>EXPORTING</tt> ——结果。<tt>CHANGING</tt> ——进出双向。<tt>TABLES</tt> ——内表。</li>
        <li><tt>EXCEPTIONS</tt> ——可用 <tt>RAISE 名称.</tt> 引发的错误名称。一旦 <tt>RAISE</tt> 执行，FM 立即结束。</li>
      </ul>
      <p>注意方向是相反的：FM 的 <tt>IMPORTING</tt> 参数由调用方的 <tt>EXPORTING</tt> 填充，反之亦然。在 FM 内部声明的变量是局部的。</p>`,
    task: `<ul>
      <li>从第三个调用中删除 <tt>EXCEPTIONS</tt> 并运行。异常未被处理时会发生什么？</li>
      <li>用错误的参数名调用（<tt>iv_hrg = 1000</tt>），阅读其错误信息。</li>
      <li>添加一个 <tt>EXPORTING ev_diskon</tt> 参数，返回折扣值。</li>
    </ul>`
  });

  // ---- m04: Classic ALV: field catalog ----
  add('en', 'm04', {
    body: `<p><b>ALV</b> (ABAP List Viewer) displays an internal table as a grid that can be sorted, filtered, and totalled. The classic way uses the function module <tt>REUSE_ALV_GRID_DISPLAY</tt> with three ingredients:</p>
      <ul>
        <li><b>Data table</b> — passed through <tt>TABLES t_outtab</tt>.</li>
        <li><b>Field catalog</b> (<tt>it_fieldcat</tt>, type <tt>slis_t_fieldcat_alv</tt>) — one row per column to display.</li>
        <li><tt>i_callback_program = sy-repid</tt> — the name of the calling program.</li>
      </ul>
      <p>The most commonly used field catalog components:</p>
      <table>
        <tr><th>Component</th><th>Purpose</th></tr>
        <tr><td><tt>fieldname</tt></td><td>name of the component in the data table — <b>upper case</b> and must match exactly</td></tr>
        <tr><td><tt>seltext_s / _m / _l</tt></td><td>column heading (short / medium / long)</td></tr>
        <tr><td><tt>outputlen</tt></td><td>column width</td></tr>
        <tr><td><tt>key</tt></td><td><tt>'X'</tt> = key column (highlighted)</td></tr>
        <tr><td><tt>do_sum</tt></td><td><tt>'X'</tt> = column is totalled</td></tr>
        <tr><td><tt>no_out</tt></td><td><tt>'X'</tt> = column is hidden</td></tr>
      </table>
      <p>The per-column pattern is always the same: <tt>CLEAR</tt> the work area, fill it, <tt>APPEND gs_fieldcat TO gt_fieldcat</tt>. The grid appears in the Output panel.</p>`,
    task: `<ul>
      <li>Change <tt>'MTART'</tt> to <tt>'MTARTT'</tt> in the field catalog and run it. Read the warning.</li>
      <li>Hide the <tt>ERNAM</tt> column with <tt>no_out = 'X'</tt>.</li>
      <li>Empty the field catalog (remove <tt>PERFORM build_fieldcatalog.</tt>) and see what the simulator says.</li>
      <li>Condense those six blocks into one FORM <tt>add_field USING pv_field pv_text</tt> called six times.</li>
    </ul>`
  });
  add('de', 'm04', {
    body: `<p><b>ALV</b> (ABAP List Viewer) zeigt eine interne Tabelle als Grid an, das sortiert, gefiltert und summiert werden kann. Der klassische Weg nutzt den Funktionsbaustein <tt>REUSE_ALV_GRID_DISPLAY</tt> mit drei Zutaten:</p>
      <ul>
        <li><b>Datentabelle</b> — übergeben über <tt>TABLES t_outtab</tt>.</li>
        <li><b>Feldkatalog</b> (<tt>it_fieldcat</tt>, Typ <tt>slis_t_fieldcat_alv</tt>) — eine Zeile pro anzuzeigender Spalte.</li>
        <li><tt>i_callback_program = sy-repid</tt> — der Name des aufrufenden Programms.</li>
      </ul>
      <p>Die am häufigsten verwendeten Feldkatalog-Komponenten:</p>
      <table>
        <tr><th>Komponente</th><th>Zweck</th></tr>
        <tr><td><tt>fieldname</tt></td><td>Name der Komponente in der Datentabelle — <b>Großbuchstaben</b> und muss genau passen</td></tr>
        <tr><td><tt>seltext_s / _m / _l</tt></td><td>Spaltenüberschrift (kurz / mittel / lang)</td></tr>
        <tr><td><tt>outputlen</tt></td><td>Spaltenbreite</td></tr>
        <tr><td><tt>key</tt></td><td><tt>'X'</tt> = Schlüsselspalte (hervorgehoben)</td></tr>
        <tr><td><tt>do_sum</tt></td><td><tt>'X'</tt> = Spalte wird summiert</td></tr>
        <tr><td><tt>no_out</tt></td><td><tt>'X'</tt> = Spalte wird ausgeblendet</td></tr>
      </table>
      <p>Das Muster pro Spalte ist immer gleich: Work Area <tt>CLEAR</tt>en, füllen, <tt>APPEND gs_fieldcat TO gt_fieldcat</tt>. Das Grid erscheint im Ausgabe-Panel.</p>`,
    task: `<ul>
      <li>Ändern Sie <tt>'MTART'</tt> in <tt>'MTARTT'</tt> im Feldkatalog und führen Sie es aus. Lesen Sie die Warnung.</li>
      <li>Blenden Sie die Spalte <tt>ERNAM</tt> mit <tt>no_out = 'X'</tt> aus.</li>
      <li>Leeren Sie den Feldkatalog (entfernen Sie <tt>PERFORM build_fieldcatalog.</tt>) und sehen Sie, was der Simulator sagt.</li>
      <li>Fassen Sie diese sechs Blöcke in einer FORM <tt>add_field USING pv_field pv_text</tt> zusammen, die sechsmal aufgerufen wird.</li>
    </ul>`
  });
  add('zh', 'm04', {
    body: `<p><b>ALV</b>（ABAP List Viewer）把内表显示为可排序、筛选和求和的表格。经典做法使用函数模块 <tt>REUSE_ALV_GRID_DISPLAY</tt>，包含三样东西：</p>
      <ul>
        <li><b>数据表</b>——通过 <tt>TABLES t_outtab</tt> 传入。</li>
        <li><b>字段目录</b>（<tt>it_fieldcat</tt>，类型 <tt>slis_t_fieldcat_alv</tt>）——每个要显示的列一行。</li>
        <li><tt>i_callback_program = sy-repid</tt> ——调用程序的名称。</li>
      </ul>
      <p>最常用的字段目录组件：</p>
      <table>
        <tr><th>组件</th><th>用途</th></tr>
        <tr><td><tt>fieldname</tt></td><td>数据表中组件的名称——<b>大写</b>且必须完全一致</td></tr>
        <tr><td><tt>seltext_s / _m / _l</tt></td><td>列标题（短 / 中 / 长）</td></tr>
        <tr><td><tt>outputlen</tt></td><td>列宽</td></tr>
        <tr><td><tt>key</tt></td><td><tt>'X'</tt> = 关键列（高亮）</td></tr>
        <tr><td><tt>do_sum</tt></td><td><tt>'X'</tt> = 对该列求和</td></tr>
        <tr><td><tt>no_out</tt></td><td><tt>'X'</tt> = 隐藏该列</td></tr>
      </table>
      <p>每列的套路始终一样：<tt>CLEAR</tt> 工作区、填充、<tt>APPEND gs_fieldcat TO gt_fieldcat</tt>。表格显示在输出面板中。</p>`,
    task: `<ul>
      <li>把字段目录中的 <tt>'MTART'</tt> 改为 <tt>'MTARTT'</tt> 并运行。阅读其警告。</li>
      <li>用 <tt>no_out = 'X'</tt> 隐藏 <tt>ERNAM</tt> 列。</li>
      <li>清空字段目录（删除 <tt>PERFORM build_fieldcatalog.</tt>），看看模拟器怎么说。</li>
      <li>把这六个块浓缩成一个 FORM <tt>add_field USING pv_field pv_text</tt>，调用六次。</li>
    </ul>`
  });

  // ---- m05: ALV automatic catalog, layout, sort, totals ----
  add('en', 'm05', {
    body: `<p>Writing a field catalog for 15 columns is tedious. If the data table uses a Data Dictionary (DDIC) structure, <tt>REUSE_ALV_FIELDCATALOG_MERGE</tt> builds it automatically — including the column headings. After that you only adjust a few rows.</p>
      <ul>
        <li><b>Layout</b> (<tt>is_layout</tt>, type <tt>slis_layout_alv</tt>): <tt>zebra = 'X'</tt> for striped rows, <tt>colwidth_optimize = 'X'</tt> for automatic column widths.</li>
        <li><b>Sort</b> (<tt>it_sort</tt>, type <tt>slis_t_sortinfo_alv</tt>): <tt>fieldname</tt> + <tt>up = 'X'</tt> (ascending) or <tt>down = 'X'</tt> (descending).</li>
        <li><b>Totals</b>: <tt>do_sum = 'X'</tt> on the field catalog row of a numeric column.</li>
        <li><tt>MODIFY gt_fieldcat FROM gs_fieldcat.</tt> inside the <tt>LOOP</tt> writes the current row back.</li>
      </ul>
      <p>The quickest alternative when no adjustment is needed: just set <tt>i_structure_name = 'SFLIGHT'</tt>, without a field catalog.</p>`,
    task: `<ul>
      <li>Replace the whole field catalog with <tt>i_structure_name = 'SFLIGHT'</tt> and compare the result.</li>
      <li>Change the initial order to ascending by <tt>CARRID</tt>.</li>
      <li>Build the same report for the <tt>SPFLI</tt> table, totalling the <tt>DISTANCE</tt> column.</li>
    </ul>`
  });
  add('de', 'm05', {
    body: `<p>Einen Feldkatalog für 15 Spalten zu schreiben ist mühsam. Verwendet die Datentabelle eine Data-Dictionary-Struktur (DDIC), baut <tt>REUSE_ALV_FIELDCATALOG_MERGE</tt> ihn automatisch — samt Spaltenüberschriften. Danach passen Sie nur noch einige Zeilen an.</p>
      <ul>
        <li><b>Layout</b> (<tt>is_layout</tt>, Typ <tt>slis_layout_alv</tt>): <tt>zebra = 'X'</tt> für gestreifte Zeilen, <tt>colwidth_optimize = 'X'</tt> für automatische Spaltenbreiten.</li>
        <li><b>Sortierung</b> (<tt>it_sort</tt>, Typ <tt>slis_t_sortinfo_alv</tt>): <tt>fieldname</tt> + <tt>up = 'X'</tt> (aufsteigend) oder <tt>down = 'X'</tt> (absteigend).</li>
        <li><b>Summen</b>: <tt>do_sum = 'X'</tt> in der Feldkatalog-Zeile einer Zahlenspalte.</li>
        <li><tt>MODIFY gt_fieldcat FROM gs_fieldcat.</tt> innerhalb der <tt>LOOP</tt> schreibt die aktuelle Zeile zurück.</li>
      </ul>
      <p>Die schnellste Alternative, wenn keine Anpassung nötig ist: einfach <tt>i_structure_name = 'SFLIGHT'</tt> setzen, ohne Feldkatalog.</p>`,
    task: `<ul>
      <li>Ersetzen Sie den gesamten Feldkatalog durch <tt>i_structure_name = 'SFLIGHT'</tt> und vergleichen Sie das Ergebnis.</li>
      <li>Ändern Sie die Anfangssortierung auf aufsteigend nach <tt>CARRID</tt>.</li>
      <li>Erstellen Sie denselben Bericht für die Tabelle <tt>SPFLI</tt> und summieren Sie die Spalte <tt>DISTANCE</tt>.</li>
    </ul>`
  });
  add('zh', 'm05', {
    body: `<p>为 15 个列写字段目录很繁琐。如果数据表使用数据字典（DDIC）结构，<tt>REUSE_ALV_FIELDCATALOG_MERGE</tt> 会自动构建它——连同列标题。之后你只需调整少数几行。</p>
      <ul>
        <li><b>布局</b>（<tt>is_layout</tt>，类型 <tt>slis_layout_alv</tt>）：<tt>zebra = 'X'</tt> 使行呈斑马条纹，<tt>colwidth_optimize = 'X'</tt> 自动列宽。</li>
        <li><b>排序</b>（<tt>it_sort</tt>，类型 <tt>slis_t_sortinfo_alv</tt>）：<tt>fieldname</tt> + <tt>up = 'X'</tt>（升序）或 <tt>down = 'X'</tt>（降序）。</li>
        <li><b>合计</b>：在数值列的字段目录行上设 <tt>do_sum = 'X'</tt>。</li>
        <li>在 <tt>LOOP</tt> 内 <tt>MODIFY gt_fieldcat FROM gs_fieldcat.</tt> 把当前行写回。</li>
      </ul>
      <p>无需调整时最快的替代方案：只设 <tt>i_structure_name = 'SFLIGHT'</tt>，不用字段目录。</p>`,
    task: `<ul>
      <li>用 <tt>i_structure_name = 'SFLIGHT'</tt> 替换整个字段目录，比较结果。</li>
      <li>把初始排序改为按 <tt>CARRID</tt> 升序。</li>
      <li>为 <tt>SPFLI</tt> 表做同样的报表，对 <tt>DISTANCE</tt> 列求和。</li>
    </ul>`
  });

  // ---- m06: Modern ALV: CL_SALV_TABLE ----
  add('en', 'm06', {
    body: `<p><tt>CL_SALV_TABLE</tt> is the object-oriented way to do ALV and the first choice for a new report that only displays data. Its columns are read directly from the internal table's type.</p>
      <ul>
        <li><tt>cl_salv_table=&gt;factory( … )</tt> — a static method that creates the ALV object. <tt>=&gt;</tt> calls a <b>class</b> method.</li>
        <li><tt>go_alv-&gt;display( )</tt> — shows the grid. <tt>-&gt;</tt> calls an <b>object</b> method.</li>
        <li>Settings are made through helper objects: <tt>get_functions( )</tt> (toolbar), <tt>get_columns( )</tt> (columns), <tt>get_display_settings( )</tt> (title, striped rows).</li>
        <li><tt>factory</tt> can raise the exception <tt>cx_salv_msg</tt>, so it is wrapped in <tt>TRY … CATCH … ENDTRY</tt>.</li>
      </ul>
      <p>Its limitation: SALV cannot be edited. For a grid the user can fill in, <tt>CL_GUI_ALV_GRID</tt> is used.</p>`,
    task: `<ul>
      <li>Display the <tt>KNA1</tt> table with SALV and give it your own title.</li>
      <li>Limit the data to routes from Indonesia only (<tt>WHERE countryfr = 'ID'</tt>).</li>
    </ul>`
  });
  add('de', 'm06', {
    body: `<p><tt>CL_SALV_TABLE</tt> ist der objektorientierte Weg für ALV und die erste Wahl für einen neuen Bericht, der nur Daten anzeigt. Seine Spalten werden direkt aus dem Typ der internen Tabelle gelesen.</p>
      <ul>
        <li><tt>cl_salv_table=&gt;factory( … )</tt> — eine statische Methode, die das ALV-Objekt erzeugt. <tt>=&gt;</tt> ruft eine <b>Klassen</b>methode auf.</li>
        <li><tt>go_alv-&gt;display( )</tt> — zeigt das Grid an. <tt>-&gt;</tt> ruft eine <b>Objekt</b>methode auf.</li>
        <li>Einstellungen erfolgen über Hilfsobjekte: <tt>get_functions( )</tt> (Toolbar), <tt>get_columns( )</tt> (Spalten), <tt>get_display_settings( )</tt> (Titel, gestreifte Zeilen).</li>
        <li><tt>factory</tt> kann die Ausnahme <tt>cx_salv_msg</tt> auslösen, daher wird es in <tt>TRY … CATCH … ENDTRY</tt> eingeschlossen.</li>
      </ul>
      <p>Die Einschränkung: SALV ist nicht editierbar. Für ein Grid, das der Benutzer ausfüllen kann, wird <tt>CL_GUI_ALV_GRID</tt> verwendet.</p>`,
    task: `<ul>
      <li>Zeigen Sie die Tabelle <tt>KNA1</tt> mit SALV an und geben Sie ihr einen eigenen Titel.</li>
      <li>Beschränken Sie die Daten nur auf Routen aus Indonesien (<tt>WHERE countryfr = 'ID'</tt>).</li>
    </ul>`
  });
  add('zh', 'm06', {
    body: `<p><tt>CL_SALV_TABLE</tt> 是面向对象的 ALV 方式，也是只显示数据的新报表的首选。它的列直接从内表的类型中读取。</p>
      <ul>
        <li><tt>cl_salv_table=&gt;factory( … )</tt> ——创建 ALV 对象的静态方法。<tt>=&gt;</tt> 调用<b>类</b>方法。</li>
        <li><tt>go_alv-&gt;display( )</tt> ——显示表格。<tt>-&gt;</tt> 调用<b>对象</b>方法。</li>
        <li>通过辅助对象进行设置：<tt>get_functions( )</tt>（工具栏）、<tt>get_columns( )</tt>（列）、<tt>get_display_settings( )</tt>（标题、斑马行）。</li>
        <li><tt>factory</tt> 可能引发异常 <tt>cx_salv_msg</tt>，因此用 <tt>TRY … CATCH … ENDTRY</tt> 包裹。</li>
      </ul>
      <p>它的限制：SALV 不可编辑。若需要用户可填写的表格，则使用 <tt>CL_GUI_ALV_GRID</tt>。</p>`,
    task: `<ul>
      <li>用 SALV 显示 <tt>KNA1</tt> 表，并给它一个自定义标题。</li>
      <li>把数据限制为仅来自印度尼西亚的航线（<tt>WHERE countryfr = 'ID'</tt>）。</li>
    </ul>`
  });

  // ---- m10: Interactive ALV: hotspot, double-click, header ----
  add('en', 'm10', {
    body: `<p>Classic ALV interacts through <b>callbacks</b>: a FORM name is handed to the function module, and the ALV calls it at the right moment.</p>
      <table>
        <tr><th>Parameter</th><th>FORM called when</th></tr>
        <tr><td><tt>i_callback_user_command</tt></td><td>the user double-clicks a row, clicks a hotspot, or presses a button</td></tr>
        <tr><td><tt>i_callback_top_of_page</tt></td><td>the ALV builds the header area above the grid</td></tr>
      </table>
      <ul>
        <li>The user-command FORM <b>must</b> have two parameters: <tt>r_ucomm</tt> (the function code; <tt>'&amp;IC1'</tt> = double-click / hotspot) and <tt>rs_selfield</tt>.</li>
        <li><tt>rs_selfield-tabindex</tt> = the row number, <tt>-fieldname</tt> = the column, <tt>-value</tt> = the content of the clicked cell.</li>
        <li><tt>hotspot = 'X'</tt> in the field catalog makes that column's cells clickable with a single click (shown underlined).</li>
        <li>The header is filled through a table of type <tt>slis_t_listheader</tt> and <tt>REUSE_ALV_COMMENTARY_WRITE</tt>: <tt>typ = 'H'</tt> heading, <tt>'S'</tt> key–value line, <tt>'A'</tt> note.</li>
      </ul>
      <p>Run this example, then <b>click an underlined cell</b> or <b>double-click a row</b> in the grid. The FORM's output appears below the grid.</p>`,
    task: `<ul>
      <li>Replace the <tt>WRITE</tt> in <tt>user_command</tt> with a second ALV showing that airline's flights (<tt>i_structure_name = 'SFLIGHT'</tt>).</li>
      <li>Mistype the FORM name in <tt>i_callback_user_command</tt> and read the error message.</li>
      <li>Show a different message when the <tt>CURRCODE</tt> column is clicked (check <tt>rs_selfield-fieldname</tt>).</li>
    </ul>`
  });
  add('de', 'm10', {
    body: `<p>Klassisches ALV interagiert über <b>Callbacks</b>: Ein FORM-Name wird dem Funktionsbaustein übergeben, und das ALV ruft ihn im richtigen Moment auf.</p>
      <table>
        <tr><th>Parameter</th><th>FORM aufgerufen, wenn</th></tr>
        <tr><td><tt>i_callback_user_command</tt></td><td>der Benutzer eine Zeile doppelklickt, einen Hotspot anklickt oder eine Taste drückt</td></tr>
        <tr><td><tt>i_callback_top_of_page</tt></td><td>das ALV den Kopfbereich über dem Grid aufbaut</td></tr>
      </table>
      <ul>
        <li>Die User-Command-FORM <b>muss</b> zwei Parameter haben: <tt>r_ucomm</tt> (der Funktionscode; <tt>'&amp;IC1'</tt> = Doppelklick / Hotspot) und <tt>rs_selfield</tt>.</li>
        <li><tt>rs_selfield-tabindex</tt> = die Zeilennummer, <tt>-fieldname</tt> = die Spalte, <tt>-value</tt> = der Inhalt der angeklickten Zelle.</li>
        <li><tt>hotspot = 'X'</tt> im Feldkatalog macht die Zellen dieser Spalte mit einem einzigen Klick anklickbar (unterstrichen dargestellt).</li>
        <li>Der Kopf wird über eine Tabelle vom Typ <tt>slis_t_listheader</tt> und <tt>REUSE_ALV_COMMENTARY_WRITE</tt> gefüllt: <tt>typ = 'H'</tt> Überschrift, <tt>'S'</tt> Schlüssel-Wert-Zeile, <tt>'A'</tt> Hinweis.</li>
      </ul>
      <p>Führen Sie dieses Beispiel aus und <b>klicken Sie dann eine unterstrichene Zelle</b> oder <b>doppelklicken Sie eine Zeile</b> im Grid. Die Ausgabe der FORM erscheint unter dem Grid.</p>`,
    task: `<ul>
      <li>Ersetzen Sie das <tt>WRITE</tt> in <tt>user_command</tt> durch ein zweites ALV, das die Flüge dieser Fluggesellschaft zeigt (<tt>i_structure_name = 'SFLIGHT'</tt>).</li>
      <li>Vertippen Sie sich beim FORM-Namen in <tt>i_callback_user_command</tt> und lesen Sie die Fehlermeldung.</li>
      <li>Zeigen Sie eine andere Meldung, wenn die Spalte <tt>CURRCODE</tt> angeklickt wird (prüfen Sie <tt>rs_selfield-fieldname</tt>).</li>
    </ul>`
  });
  add('zh', 'm10', {
    body: `<p>经典 ALV 通过<b>回调</b>进行交互：把一个 FORM 名称交给函数模块，ALV 会在恰当的时机调用它。</p>
      <table>
        <tr><th>参数</th><th>何时调用 FORM</th></tr>
        <tr><td><tt>i_callback_user_command</tt></td><td>用户双击某行、点击热点，或按下按钮时</td></tr>
        <tr><td><tt>i_callback_top_of_page</tt></td><td>ALV 构建表格上方的表头区域时</td></tr>
      </table>
      <ul>
        <li>user-command FORM <b>必须</b>有两个参数：<tt>r_ucomm</tt>（功能码；<tt>'&amp;IC1'</tt> = 双击 / 热点）和 <tt>rs_selfield</tt>。</li>
        <li><tt>rs_selfield-tabindex</tt> = 行号，<tt>-fieldname</tt> = 列，<tt>-value</tt> = 被点击单元格的内容。</li>
        <li>字段目录中的 <tt>hotspot = 'X'</tt> 使该列单元格可单击（显示为下划线）。</li>
        <li>表头通过类型为 <tt>slis_t_listheader</tt> 的表和 <tt>REUSE_ALV_COMMENTARY_WRITE</tt> 填充：<tt>typ = 'H'</tt> 标题，<tt>'S'</tt> 键–值行，<tt>'A'</tt> 备注。</li>
      </ul>
      <p>运行此示例，然后在表格中<b>单击带下划线的单元格</b>或<b>双击某一行</b>。FORM 的输出会出现在表格下方。</p>`,
    task: `<ul>
      <li>把 <tt>user_command</tt> 中的 <tt>WRITE</tt> 替换为第二个 ALV，显示该航空公司的航班（<tt>i_structure_name = 'SFLIGHT'</tt>）。</li>
      <li>在 <tt>i_callback_user_command</tt> 中把 FORM 名称写错，阅读其错误信息。</li>
      <li>当点击 <tt>CURRCODE</tt> 列时显示不同的消息（检查 <tt>rs_selfield-fieldname</tt>）。</li>
    </ul>`
  });

  // ---- m11: Reading legacy code: header line, OCCURS, macros ----
  add('en', 'm11', {
    body: `<p>Much ABAP work is maintaining old programs. These three things must not be used in new code, but you <b>must be able to read them</b>:</p>
      <h4>Tables with a header line</h4>
      <ul>
        <li><tt>DATA: BEGIN OF itab OCCURS 0 … END OF itab.</tt> or <tt>… WITH HEADER LINE</tt> creates <b>two</b> things with the same name: the table, and a hidden work area (the header line).</li>
        <li><tt>itab-field</tt> and <tt>CLEAR itab</tt> affect the <b>header line</b>; <tt>itab[]</tt> means the <b>table body</b>.</li>
        <li><tt>APPEND itab.</tt>, <tt>LOOP AT itab.</tt>, <tt>READ TABLE itab …</tt>, <tt>MODIFY itab.</tt> without <tt>INTO</tt>/<tt>FROM</tt> silently use the header line.</li>
        <li><tt>TABLES mara.</tt> creates a work area called <tt>mara</tt>; <tt>SELECT * FROM mara … ENDSELECT.</tt> fills it row by row.</li>
      </ul>
      <h4>Macros</h4>
      <ul>
        <li><tt>DEFINE name. … END-OF-DEFINITION.</tt> is text replacement: <tt>&amp;1</tt>, <tt>&amp;2</tt> are replaced by the arguments when the macro is used. It cannot be debugged line by line.</li>
      </ul>
      <p>The modern equivalents: an explicit work area (<tt>INTO</tt>/<tt>ASSIGNING</tt>), <tt>SELECT … INTO TABLE</tt>, and a FORM or method instead of a macro.</p>`,
    task: `<ul>
      <li>Rewrite this program in the modern style: a row type, a standard table, a separate work area, one <tt>SELECT … INTO TABLE</tt>.</li>
      <li>This program does a <tt>SELECT</tt> inside a <tt>LOOP</tt>. Replace it with a single <tt>SELECT … GROUP BY carrid</tt>.</li>
    </ul>`
  });
  add('de', 'm11', {
    body: `<p>Ein großer Teil der ABAP-Arbeit ist die Pflege alter Programme. Diese drei Dinge dürfen in neuem Code nicht verwendet werden, Sie <b>müssen sie aber lesen können</b>:</p>
      <h4>Tabellen mit Kopfzeile</h4>
      <ul>
        <li><tt>DATA: BEGIN OF itab OCCURS 0 … END OF itab.</tt> oder <tt>… WITH HEADER LINE</tt> erzeugt <b>zwei</b> gleichnamige Dinge: die Tabelle und eine versteckte Work Area (die Kopfzeile).</li>
        <li><tt>itab-field</tt> und <tt>CLEAR itab</tt> betreffen die <b>Kopfzeile</b>; <tt>itab[]</tt> bedeutet den <b>Tabellenkörper</b>.</li>
        <li><tt>APPEND itab.</tt>, <tt>LOOP AT itab.</tt>, <tt>READ TABLE itab …</tt>, <tt>MODIFY itab.</tt> ohne <tt>INTO</tt>/<tt>FROM</tt> verwenden stillschweigend die Kopfzeile.</li>
        <li><tt>TABLES mara.</tt> erzeugt eine Work Area namens <tt>mara</tt>; <tt>SELECT * FROM mara … ENDSELECT.</tt> füllt sie Zeile für Zeile.</li>
      </ul>
      <h4>Makros</h4>
      <ul>
        <li><tt>DEFINE name. … END-OF-DEFINITION.</tt> ist Textersetzung: <tt>&amp;1</tt>, <tt>&amp;2</tt> werden beim Einsatz des Makros durch die Argumente ersetzt. Es lässt sich nicht Zeile für Zeile debuggen.</li>
      </ul>
      <p>Die modernen Entsprechungen: eine explizite Work Area (<tt>INTO</tt>/<tt>ASSIGNING</tt>), <tt>SELECT … INTO TABLE</tt> und eine FORM oder Methode statt eines Makros.</p>`,
    task: `<ul>
      <li>Schreiben Sie dieses Programm im modernen Stil um: ein Zeilentyp, eine Standardtabelle, eine separate Work Area, ein <tt>SELECT … INTO TABLE</tt>.</li>
      <li>Dieses Programm führt ein <tt>SELECT</tt> innerhalb einer <tt>LOOP</tt> aus. Ersetzen Sie es durch ein einzelnes <tt>SELECT … GROUP BY carrid</tt>.</li>
    </ul>`
  });
  add('zh', 'm11', {
    body: `<p>大量的 ABAP 工作是维护旧程序。以下三样东西不应在新代码中使用，但你<b>必须能读懂</b>：</p>
      <h4>带表头行的表</h4>
      <ul>
        <li><tt>DATA: BEGIN OF itab OCCURS 0 … END OF itab.</tt> 或 <tt>… WITH HEADER LINE</tt> 会创建<b>两个</b>同名的东西：表，以及一个隐藏的工作区（表头行）。</li>
        <li><tt>itab-field</tt> 和 <tt>CLEAR itab</tt> 作用于<b>表头行</b>；<tt>itab[]</tt> 表示<b>表体</b>。</li>
        <li>不带 <tt>INTO</tt>/<tt>FROM</tt> 的 <tt>APPEND itab.</tt>、<tt>LOOP AT itab.</tt>、<tt>READ TABLE itab …</tt>、<tt>MODIFY itab.</tt> 会悄悄使用表头行。</li>
        <li><tt>TABLES mara.</tt> 创建一个名为 <tt>mara</tt> 的工作区；<tt>SELECT * FROM mara … ENDSELECT.</tt> 逐行填充它。</li>
      </ul>
      <h4>宏</h4>
      <ul>
        <li><tt>DEFINE 名称. … END-OF-DEFINITION.</tt> 是文本替换：使用宏时 <tt>&amp;1</tt>、<tt>&amp;2</tt> 被参数替换。它无法逐行调试。</li>
      </ul>
      <p>现代等价写法：显式工作区（<tt>INTO</tt>/<tt>ASSIGNING</tt>）、<tt>SELECT … INTO TABLE</tt>，以及用 FORM 或方法代替宏。</p>`,
    task: `<ul>
      <li>用现代风格重写此程序：一个行类型、一张标准表、一个独立的工作区、一条 <tt>SELECT … INTO TABLE</tt>。</li>
      <li>此程序在 <tt>LOOP</tt> 内执行 <tt>SELECT</tt>。用单条 <tt>SELECT … GROUP BY carrid</tt> 替换它。</li>
    </ul>`
  });

  // ---- m07: Project: a complete sales report ----
  add('en', 'm07', {
    body: `<p>Real-world ABAP reports almost always follow the same skeleton. Master this skeleton and most reports become small variations:</p>
      <ul>
        <li><b>Declarations</b> — the output row type, the table, the selection screen.</li>
        <li><tt>START-OF-SELECTION</tt> — only a sequence of <tt>PERFORM</tt>s, so the flow reads at a glance.</li>
        <li><tt>get_data</tt> — one <tt>SELECT</tt> with a JOIN, only the needed columns.</li>
        <li><tt>process_data</tt> — per-row calculations with a field symbol.</li>
        <li><tt>display_data</tt> — field catalog + ALV.</li>
      </ul>
      <p>Notice the <tt>status</tt> column: it does not exist in the database but is computed in the program — the hallmark of a report.</p>`,
    task: `<ul>
      <li>Open <b>Parameter</b> (F8) and change <tt>P_BESAR</tt> to 20000000. Which orders change status?</li>
      <li>Add a column for the number of items per order (count from the VBAP table with <tt>SELECT COUNT( * )</tt> — then think about how to avoid a SELECT inside the LOOP).</li>
      <li>Change the display to <tt>CL_SALV_TABLE</tt>.</li>
    </ul>`
  });
  add('de', 'm07', {
    body: `<p>ABAP-Berichte aus der Praxis folgen fast immer demselben Gerüst. Beherrschen Sie dieses Gerüst, und die meisten Berichte werden zu kleinen Varianten:</p>
      <ul>
        <li><b>Deklarationen</b> — der Ausgabe-Zeilentyp, die Tabelle, das Selektionsbild.</li>
        <li><tt>START-OF-SELECTION</tt> — nur eine Folge von <tt>PERFORM</tt>s, damit der Ablauf auf einen Blick lesbar ist.</li>
        <li><tt>get_data</tt> — ein <tt>SELECT</tt> mit JOIN, nur die benötigten Spalten.</li>
        <li><tt>process_data</tt> — Berechnungen pro Zeile mit einem Feldsymbol.</li>
        <li><tt>display_data</tt> — Feldkatalog + ALV.</li>
      </ul>
      <p>Beachten Sie die Spalte <tt>status</tt>: Sie existiert nicht in der Datenbank, sondern wird im Programm berechnet — das Kennzeichen eines Berichts.</p>`,
    task: `<ul>
      <li>Öffnen Sie <b>Parameter</b> (F8) und ändern Sie <tt>P_BESAR</tt> auf 20000000. Welche Aufträge ändern den Status?</li>
      <li>Fügen Sie eine Spalte für die Anzahl der Positionen pro Auftrag hinzu (aus der Tabelle VBAP mit <tt>SELECT COUNT( * )</tt> zählen — überlegen Sie dann, wie Sie ein SELECT innerhalb der LOOP vermeiden).</li>
      <li>Ändern Sie die Anzeige auf <tt>CL_SALV_TABLE</tt>.</li>
    </ul>`
  });
  add('zh', 'm07', {
    body: `<p>现实中的 ABAP 报表几乎总是遵循同一个骨架。掌握这个骨架，大多数报表就只是小小的变体：</p>
      <ul>
        <li><b>声明</b>——输出行类型、表、选择屏幕。</li>
        <li><tt>START-OF-SELECTION</tt> ——只有一串 <tt>PERFORM</tt>，让流程一目了然。</li>
        <li><tt>get_data</tt> ——一条带 JOIN 的 <tt>SELECT</tt>，只取需要的列。</li>
        <li><tt>process_data</tt> ——用字段符号逐行计算。</li>
        <li><tt>display_data</tt> ——字段目录 + ALV。</li>
      </ul>
      <p>注意 <tt>status</tt> 列：它在数据库中并不存在，而是在程序中计算得出——这是报表的标志。</p>`,
    task: `<ul>
      <li>打开<b>参数</b>(F8)，把 <tt>P_BESAR</tt> 改为 20000000。哪些订单的状态发生了变化？</li>
      <li>添加一列显示每个订单的项目数（用 <tt>SELECT COUNT( * )</tt> 从 VBAP 表统计——然后思考如何避免在 LOOP 内部使用 SELECT）。</li>
      <li>把显示改为 <tt>CL_SALV_TABLE</tt>。</li>
    </ul>`
  });


  // ============================================================
  // LEVEL 4 — Advanced (a01–a06, a08–a11, a07)
  // ============================================================

  // ---- a01: OO ABAP: classes and objects ----
  add('en', 'a01', {
    body: `<p>In object-oriented ABAP, data and the logic that works on it are wrapped in a <b>class</b>. A class is written in two parts:</p>
      <ul>
        <li><tt>CLASS … DEFINITION</tt> — <b>what</b> the class has: attributes (<tt>DATA</tt>) and methods (<tt>METHODS</tt>).</li>
        <li><tt>CLASS … IMPLEMENTATION</tt> — the <b>body</b> of each method, between <tt>METHOD … ENDMETHOD</tt>.</li>
        <li><tt>PUBLIC SECTION</tt> can be accessed from outside; <tt>PRIVATE SECTION</tt> only from inside the class. Hiding attributes behind methods is called <b>encapsulation</b>.</li>
      </ul>
      <p>A class is only a blueprint. <b>Objects</b> are created from it, and each object has its own copy of the attributes:</p>
      <ul>
        <li>An object reference variable: <tt>DATA lo_x TYPE REF TO lcl_x.</tt></li>
        <li>Creating an object: <tt>CREATE OBJECT lo_x.</tt> or the modern form <tt>lo_x = NEW lcl_x( ).</tt></li>
        <li>Calling a method: <tt>lo_x-&gt;method( value ).</tt> A <tt>RETURNING</tt> parameter lets a method be used like a function.</li>
      </ul>
      <p>Naming conventions: <tt>lcl_</tt> local class, <tt>lo_</tt> object reference, <tt>mv_</tt> attribute, <tt>iv_</tt> importing, <tt>rv_</tt> returning.</p>`,
    task: `<ul>
      <li>In the main program write <tt>lo_andi-&gt;mv_saldo = 999.</tt> and run it. Why is it rejected?</li>
      <li>Add a method <tt>transfer</tt> that moves a balance to another account (<tt>IMPORTING io_tujuan TYPE REF TO lcl_rekening iv_jumlah TYPE i</tt>).</li>
      <li>Call a method through a reference whose object was never created (remove <tt>CREATE OBJECT lo_andi.</tt>) and read the error.</li>
    </ul>`
  });
  add('de', 'a01', {
    body: `<p>In objektorientiertem ABAP werden Daten und die Logik, die sie verarbeitet, in einer <b>Klasse</b> gekapselt. Eine Klasse wird in zwei Teilen geschrieben:</p>
      <ul>
        <li><tt>CLASS … DEFINITION</tt> — <b>was</b> die Klasse besitzt: Attribute (<tt>DATA</tt>) und Methoden (<tt>METHODS</tt>).</li>
        <li><tt>CLASS … IMPLEMENTATION</tt> — der <b>Inhalt</b> jeder Methode, zwischen <tt>METHOD … ENDMETHOD</tt>.</li>
        <li><tt>PUBLIC SECTION</tt> ist von außen zugänglich; <tt>PRIVATE SECTION</tt> nur innerhalb der Klasse. Attribute hinter Methoden zu verbergen heißt <b>Kapselung</b>.</li>
      </ul>
      <p>Eine Klasse ist nur eine Vorlage. Aus ihr werden <b>Objekte</b> erzeugt, und jedes Objekt hat seine eigene Kopie der Attribute:</p>
      <ul>
        <li>Eine Objektreferenzvariable: <tt>DATA lo_x TYPE REF TO lcl_x.</tt></li>
        <li>Ein Objekt erzeugen: <tt>CREATE OBJECT lo_x.</tt> oder die moderne Form <tt>lo_x = NEW lcl_x( ).</tt></li>
        <li>Eine Methode aufrufen: <tt>lo_x-&gt;method( wert ).</tt> Mit einem <tt>RETURNING</tt>-Parameter lässt sich eine Methode wie eine Funktion verwenden.</li>
      </ul>
      <p>Namenskonventionen: <tt>lcl_</tt> lokale Klasse, <tt>lo_</tt> Objektreferenz, <tt>mv_</tt> Attribut, <tt>iv_</tt> Importing, <tt>rv_</tt> Returning.</p>`,
    task: `<ul>
      <li>Schreiben Sie im Hauptprogramm <tt>lo_andi-&gt;mv_saldo = 999.</tt> und führen Sie es aus. Warum wird das abgewiesen?</li>
      <li>Fügen Sie eine Methode <tt>transfer</tt> hinzu, die einen Betrag auf ein anderes Konto überträgt (<tt>IMPORTING io_tujuan TYPE REF TO lcl_rekening iv_jumlah TYPE i</tt>).</li>
      <li>Rufen Sie eine Methode über eine Referenz auf, deren Objekt nie erzeugt wurde (entfernen Sie <tt>CREATE OBJECT lo_andi.</tt>), und lesen Sie den Fehler.</li>
    </ul>`
  });
  add('zh', 'a01', {
    body: `<p>在面向对象的 ABAP 中，数据和处理它的逻辑被封装在<b>类</b>中。一个类分两部分书写：</p>
      <ul>
        <li><tt>CLASS … DEFINITION</tt> ——类<b>拥有什么</b>：属性（<tt>DATA</tt>）和方法（<tt>METHODS</tt>）。</li>
        <li><tt>CLASS … IMPLEMENTATION</tt> ——每个方法的<b>内容</b>，写在 <tt>METHOD … ENDMETHOD</tt> 之间。</li>
        <li><tt>PUBLIC SECTION</tt> 可从外部访问；<tt>PRIVATE SECTION</tt> 只能在类内部访问。把属性隐藏在方法之后称为<b>封装</b>。</li>
      </ul>
      <p>类只是一个模板。由它创建<b>对象</b>，每个对象都有自己的一份属性副本：</p>
      <ul>
        <li>对象引用变量：<tt>DATA lo_x TYPE REF TO lcl_x.</tt></li>
        <li>创建对象：<tt>CREATE OBJECT lo_x.</tt> 或现代写法 <tt>lo_x = NEW lcl_x( ).</tt></li>
        <li>调用方法：<tt>lo_x-&gt;method( 值 ).</tt> <tt>RETURNING</tt> 参数使方法可以像函数一样使用。</li>
      </ul>
      <p>命名习惯：<tt>lcl_</tt> 局部类，<tt>lo_</tt> 对象引用，<tt>mv_</tt> 属性，<tt>iv_</tt> importing 参数，<tt>rv_</tt> returning 参数。</p>`,
    task: `<ul>
      <li>在主程序中写 <tt>lo_andi-&gt;mv_saldo = 999.</tt> 并运行。为什么被拒绝？</li>
      <li>添加方法 <tt>transfer</tt>，把余额转到另一个账户（<tt>IMPORTING io_tujuan TYPE REF TO lcl_rekening iv_jumlah TYPE i</tt>）。</li>
      <li>通过尚未创建对象的引用调用方法（删除 <tt>CREATE OBJECT lo_andi.</tt>），阅读其错误。</li>
    </ul>`
  });

  // ---- a02: Constructor, static, and visibility ----
  add('en', 'a02', {
    body: `<ul>
        <li>The <tt>constructor</tt> is a special method that runs automatically when an object is created. Its parameters are supplied in <tt>NEW lcl_x( … )</tt> or <tt>CREATE OBJECT … EXPORTING …</tt>. With a constructor, an object is never in a "half-finished" state.</li>
        <li><b>Static</b> = belongs to the class, not to an object: <tt>CLASS-DATA</tt> is shared by all objects, <tt>CLASS-METHODS</tt> are called without an object. Access uses <tt>=&gt;</tt>: <tt>lcl_x=&gt;gv_jumlah</tt>.</li>
        <li><tt>CONSTANTS</tt> inside a class are static too.</li>
        <li><tt>READ-ONLY</tt> makes a public attribute readable from outside but changeable only from inside the class.</li>
        <li>Three levels of visibility: <tt>PUBLIC</tt> (everyone), <tt>PROTECTED</tt> (the class and its subclasses), <tt>PRIVATE</tt> (that class only).</li>
      </ul>`,
    task: `<ul>
      <li>Try <tt>lo_rina-&gt;mv_nama = 'Lain'.</tt> from the main program.</li>
      <li>Create an object without parameters: <tt>NEW lcl_karyawan( )</tt>. What is the message?</li>
      <li>Add a static method <tt>reset</tt> that sets <tt>gv_jumlah</tt> back to 0.</li>
    </ul>`
  });
  add('de', 'a02', {
    body: `<ul>
        <li>Der <tt>constructor</tt> ist eine spezielle Methode, die beim Erzeugen eines Objekts automatisch läuft. Seine Parameter werden in <tt>NEW lcl_x( … )</tt> oder <tt>CREATE OBJECT … EXPORTING …</tt> übergeben. Mit einem Konstruktor ist ein Objekt nie in einem „halbfertigen“ Zustand.</li>
        <li><b>Statisch</b> = gehört zur Klasse, nicht zu einem Objekt: <tt>CLASS-DATA</tt> wird von allen Objekten geteilt, <tt>CLASS-METHODS</tt> werden ohne Objekt aufgerufen. Der Zugriff erfolgt mit <tt>=&gt;</tt>: <tt>lcl_x=&gt;gv_jumlah</tt>.</li>
        <li><tt>CONSTANTS</tt> innerhalb einer Klasse sind ebenfalls statisch.</li>
        <li><tt>READ-ONLY</tt> macht ein öffentliches Attribut von außen lesbar, aber nur innerhalb der Klasse änderbar.</li>
        <li>Drei Sichtbarkeitsstufen: <tt>PUBLIC</tt> (alle), <tt>PROTECTED</tt> (die Klasse und ihre Unterklassen), <tt>PRIVATE</tt> (nur diese Klasse).</li>
      </ul>`,
    task: `<ul>
      <li>Versuchen Sie <tt>lo_rina-&gt;mv_nama = 'Lain'.</tt> aus dem Hauptprogramm.</li>
      <li>Erzeugen Sie ein Objekt ohne Parameter: <tt>NEW lcl_karyawan( )</tt>. Wie lautet die Meldung?</li>
      <li>Fügen Sie eine statische Methode <tt>reset</tt> hinzu, die <tt>gv_jumlah</tt> auf 0 zurücksetzt.</li>
    </ul>`
  });
  add('zh', 'a02', {
    body: `<ul>
        <li><tt>constructor</tt> 是在创建对象时自动运行的特殊方法。它的参数在 <tt>NEW lcl_x( … )</tt> 或 <tt>CREATE OBJECT … EXPORTING …</tt> 中提供。有了构造器，对象就不会处于“半成品”状态。</li>
        <li><b>静态</b> = 属于类，而不属于对象：<tt>CLASS-DATA</tt> 由所有对象共享，<tt>CLASS-METHODS</tt> 无需对象即可调用。访问时使用 <tt>=&gt;</tt>：<tt>lcl_x=&gt;gv_jumlah</tt>。</li>
        <li>类内部的 <tt>CONSTANTS</tt> 也是静态的。</li>
        <li><tt>READ-ONLY</tt> 使公共属性可从外部读取，但只能在类内部修改。</li>
        <li>三级可见性：<tt>PUBLIC</tt>（所有人）、<tt>PROTECTED</tt>（类及其子类）、<tt>PRIVATE</tt>（仅该类）。</li>
      </ul>`,
    task: `<ul>
      <li>在主程序中尝试 <tt>lo_rina-&gt;mv_nama = 'Lain'.</tt></li>
      <li>不带参数创建对象：<tt>NEW lcl_karyawan( )</tt>。消息是什么？</li>
      <li>添加静态方法 <tt>reset</tt>，把 <tt>gv_jumlah</tt> 重置为 0。</li>
    </ul>`
  });

  // ---- a03: Inheritance and redefinition ----
  add('en', 'a03', {
    body: `<ul>
        <li><tt>CLASS child DEFINITION INHERITING FROM parent.</tt> — the subclass inherits all attributes and methods of its superclass.</li>
        <li><tt>METHODS name REDEFINITION.</tt> — the subclass replaces the body of a superclass method. Inside it, <tt>super-&gt;name( )</tt> can still call the superclass version.</li>
        <li><tt>PROTECTED</tt> attributes are visible to subclasses but not from outside.</li>
        <li>A variable typed with the superclass may point to a subclass object. The method that runs is decided by the <b>actual object</b>, not the variable's type — this is <b>polymorphism</b>.</li>
      </ul>
      <p>Look at <tt>perkenalan</tt>: that method exists only in the superclass, but the <tt>bersuara( )</tt> it calls is each subclass's own version.</p>`,
    task: `<ul>
      <li>Add a class <tt>lcl_burung</tt> with its own sound.</li>
      <li>Change <tt>mv_nama</tt> to <tt>PRIVATE</tt>. What happens in the subclasses?</li>
      <li>Give <tt>lcl_kucing</tt> its own constructor that takes a name and a colour, then calls <tt>super-&gt;constructor( iv_nama )</tt>.</li>
    </ul>`
  });
  add('de', 'a03', {
    body: `<ul>
        <li><tt>CLASS kind DEFINITION INHERITING FROM eltern.</tt> — die Unterklasse erbt alle Attribute und Methoden ihrer Oberklasse.</li>
        <li><tt>METHODS name REDEFINITION.</tt> — die Unterklasse ersetzt den Inhalt einer Methode der Oberklasse. Darin kann <tt>super-&gt;name( )</tt> weiterhin die Version der Oberklasse aufrufen.</li>
        <li><tt>PROTECTED</tt>-Attribute sind für Unterklassen sichtbar, aber nicht von außen.</li>
        <li>Eine Variable vom Typ der Oberklasse darf auf ein Objekt der Unterklasse zeigen. Welche Methode läuft, bestimmt das <b>tatsächliche Objekt</b>, nicht der Typ der Variable — das ist <b>Polymorphie</b>.</li>
      </ul>
      <p>Beachten Sie <tt>perkenalan</tt>: Diese Methode gibt es nur in der Oberklasse, aber das von ihr aufgerufene <tt>bersuara( )</tt> ist die jeweilige Version der Unterklasse.</p>`,
    task: `<ul>
      <li>Fügen Sie eine Klasse <tt>lcl_burung</tt> mit eigenem Laut hinzu.</li>
      <li>Ändern Sie <tt>mv_nama</tt> auf <tt>PRIVATE</tt>. Was passiert in den Unterklassen?</li>
      <li>Geben Sie <tt>lcl_kucing</tt> einen eigenen Konstruktor, der Name und Farbe annimmt und dann <tt>super-&gt;constructor( iv_nama )</tt> aufruft.</li>
    </ul>`
  });
  add('zh', 'a03', {
    body: `<ul>
        <li><tt>CLASS 子类 DEFINITION INHERITING FROM 父类.</tt> ——子类继承父类的所有属性和方法。</li>
        <li><tt>METHODS 名称 REDEFINITION.</tt> ——子类替换父类方法的内容。在其中仍可用 <tt>super-&gt;名称( )</tt> 调用父类版本。</li>
        <li><tt>PROTECTED</tt> 属性对子类可见，但对外部不可见。</li>
        <li>父类类型的变量可以指向子类对象。实际运行哪个方法由<b>真实的对象</b>决定，而不是变量的类型——这就是<b>多态</b>。</li>
      </ul>
      <p>注意 <tt>perkenalan</tt>：该方法只存在于父类中，但它调用的 <tt>bersuara( )</tt> 是各个子类自己的版本。</p>`,
    task: `<ul>
      <li>添加一个有自己叫声的类 <tt>lcl_burung</tt>。</li>
      <li>把 <tt>mv_nama</tt> 改为 <tt>PRIVATE</tt>。子类中会发生什么？</li>
      <li>给 <tt>lcl_kucing</tt> 一个自己的构造器，接收名字和颜色，然后调用 <tt>super-&gt;constructor( iv_nama )</tt>。</li>
    </ul>`
  });

  // ---- a04: Interfaces and polymorphism ----
  add('en', 'a04', {
    body: `<p>An <b>interface</b> is a contract: a list of methods without bodies. A class that writes <tt>INTERFACES lif_x.</tt> promises to provide all of those methods.</p>
      <ul>
        <li>In the implementation the method is named <tt>lif_x~name</tt> (the <tt>~</tt> means "belonging to the interface").</li>
        <li>A variable typed <tt>REF TO lif_x</tt> can point to an object of <b>any</b> class that implements the interface.</li>
        <li>That way a single <tt>LOOP</tt> can process squares, circles, and other shapes without an <tt>IF</tt>/<tt>CASE</tt> per kind. Adding a new shape does not change the loop code at all.</li>
      </ul>
      <p>The difference from inheritance: a subclass inherits the <b>content</b> of one superclass; an interface only prescribes the <b>shape</b>, and one class may implement many interfaces.</p>`,
    task: `<ul>
      <li>Add a class <tt>lcl_segitiga</tt> (base, height). Notice: the <tt>LOOP</tt> code does not need to change.</li>
      <li>Add a method <tt>keliling</tt> to the interface. What happens if one of the classes has not implemented it yet?</li>
    </ul>`
  });
  add('de', 'a04', {
    body: `<p>Eine <b>Schnittstelle</b> (Interface) ist ein Vertrag: eine Liste von Methoden ohne Inhalt. Eine Klasse, die <tt>INTERFACES lif_x.</tt> schreibt, verspricht, alle diese Methoden bereitzustellen.</p>
      <ul>
        <li>In der Implementierung heißt die Methode <tt>lif_x~name</tt> (das <tt>~</tt> bedeutet „gehört zur Schnittstelle“).</li>
        <li>Eine Variable vom Typ <tt>REF TO lif_x</tt> kann auf ein Objekt <b>jeder</b> Klasse zeigen, die die Schnittstelle implementiert.</li>
        <li>So kann eine einzige <tt>LOOP</tt> Quadrate, Kreise und andere Formen verarbeiten, ohne <tt>IF</tt>/<tt>CASE</tt> pro Art. Eine neue Form hinzuzufügen ändert den Schleifencode überhaupt nicht.</li>
      </ul>
      <p>Der Unterschied zur Vererbung: Eine Unterklasse erbt den <b>Inhalt</b> einer Oberklasse; eine Schnittstelle schreibt nur die <b>Form</b> vor, und eine Klasse darf viele Schnittstellen implementieren.</p>`,
    task: `<ul>
      <li>Fügen Sie eine Klasse <tt>lcl_segitiga</tt> (Grundseite, Höhe) hinzu. Beachten Sie: Der <tt>LOOP</tt>-Code muss nicht geändert werden.</li>
      <li>Fügen Sie der Schnittstelle eine Methode <tt>keliling</tt> hinzu. Was passiert, wenn eine der Klassen sie noch nicht implementiert hat?</li>
    </ul>`
  });
  add('zh', 'a04', {
    body: `<p><b>接口</b>是一份契约：一个没有内容的方法列表。写了 <tt>INTERFACES lif_x.</tt> 的类承诺提供所有这些方法。</p>
      <ul>
        <li>在实现部分，方法名为 <tt>lif_x~名称</tt>（<tt>~</tt> 表示“属于接口”）。</li>
        <li>类型为 <tt>REF TO lif_x</tt> 的变量可以指向<b>任何</b>实现了该接口的类的对象。</li>
        <li>这样，一个 <tt>LOOP</tt> 就能处理正方形、圆形和其他形状，而无需为每种类型写 <tt>IF</tt>/<tt>CASE</tt>。添加新形状完全不需要修改循环代码。</li>
      </ul>
      <p>与继承的区别：子类从一个父类继承<b>内容</b>；接口只规定<b>形式</b>，并且一个类可以实现多个接口。</p>`,
    task: `<ul>
      <li>添加类 <tt>lcl_segitiga</tt>（底、高）。注意：<tt>LOOP</tt> 代码无需修改。</li>
      <li>向接口添加方法 <tt>keliling</tt>。如果某个类还没有实现它，会发生什么？</li>
    </ul>`
  });

  // ---- a05: Exceptions: TRY, CATCH, RAISE ----
  add('en', 'a05', {
    body: `<p>Class-based exceptions are the modern replacement for <tt>sy-subrc</tt>. Risky code goes in a <tt>TRY</tt> block; when an exception occurs, execution <b>jumps straight</b> to the matching <tt>CATCH</tt> block and the rest of the <tt>TRY</tt> block is skipped.</p>
      <ul>
        <li>System exceptions: <tt>cx_sy_zerodivide</tt> (division by zero), <tt>cx_sy_ref_is_initial</tt> (empty reference), and others.</li>
        <li><tt>CATCH cx_… INTO DATA(lx).</tt> stores the exception object; <tt>lx-&gt;get_text( )</tt> returns its message.</li>
        <li><tt>CATCH cx_root</tt> catches <b>every</b> exception — use it sparingly, because it hides unexpected errors.</li>
        <li>Your own exception: create a subclass of <tt>cx_static_check</tt> and raise it with <tt>RAISE EXCEPTION TYPE … EXPORTING ….</tt></li>
        <li>A method that can raise an exception must list it under <tt>RAISING</tt>, so the caller knows it has to be handled.</li>
      </ul>
      <p>An exception that is not caught stops the program with a short dump.</p>`,
    task: `<ul>
      <li>Remove the <tt>TRY … ENDTRY</tt> block in part 1 and run it. Where does the program stop?</li>
      <li>Add a second exception <tt>lcx_jumlah_tidak_valid</tt> that is raised when the withdrawal amount is ≤ 0, and catch it with a separate <tt>CATCH</tt>.</li>
    </ul>`
  });
  add('de', 'a05', {
    body: `<p>Klassenbasierte Ausnahmen sind der moderne Ersatz für <tt>sy-subrc</tt>. Riskanter Code steht in einem <tt>TRY</tt>-Block; tritt eine Ausnahme auf, springt die Ausführung <b>sofort</b> zum passenden <tt>CATCH</tt>-Block, und der Rest des <tt>TRY</tt>-Blocks wird übersprungen.</p>
      <ul>
        <li>Systemausnahmen: <tt>cx_sy_zerodivide</tt> (Division durch null), <tt>cx_sy_ref_is_initial</tt> (leere Referenz) und weitere.</li>
        <li><tt>CATCH cx_… INTO DATA(lx).</tt> speichert das Ausnahmeobjekt; <tt>lx-&gt;get_text( )</tt> liefert dessen Meldung.</li>
        <li><tt>CATCH cx_root</tt> fängt <b>jede</b> Ausnahme — sparsam verwenden, weil es unerwartete Fehler verdeckt.</li>
        <li>Eigene Ausnahme: Erstellen Sie eine Unterklasse von <tt>cx_static_check</tt> und lösen Sie sie mit <tt>RAISE EXCEPTION TYPE … EXPORTING ….</tt> aus.</li>
        <li>Eine Methode, die eine Ausnahme auslösen kann, muss sie unter <tt>RAISING</tt> aufführen, damit der Aufrufer weiß, dass er sie behandeln muss.</li>
      </ul>
      <p>Eine nicht abgefangene Ausnahme stoppt das Programm mit einem Short Dump.</p>`,
    task: `<ul>
      <li>Entfernen Sie den Block <tt>TRY … ENDTRY</tt> in Teil 1 und führen Sie es aus. Wo stoppt das Programm?</li>
      <li>Fügen Sie eine zweite Ausnahme <tt>lcx_jumlah_tidak_valid</tt> hinzu, die ausgelöst wird, wenn der Abhebungsbetrag ≤ 0 ist, und fangen Sie sie mit einem eigenen <tt>CATCH</tt> ab.</li>
    </ul>`
  });
  add('zh', 'a05', {
    body: `<p>基于类的异常是 <tt>sy-subrc</tt> 的现代替代方案。有风险的代码放在 <tt>TRY</tt> 块中；一旦发生异常，执行会<b>直接跳转</b>到匹配的 <tt>CATCH</tt> 块，<tt>TRY</tt> 块的其余部分被跳过。</p>
      <ul>
        <li>系统异常：<tt>cx_sy_zerodivide</tt>（除以零）、<tt>cx_sy_ref_is_initial</tt>（空引用）等。</li>
        <li><tt>CATCH cx_… INTO DATA(lx).</tt> 保存异常对象；<tt>lx-&gt;get_text( )</tt> 返回其消息。</li>
        <li><tt>CATCH cx_root</tt> 捕获<b>所有</b>异常——要谨慎使用，因为它会掩盖意料之外的错误。</li>
        <li>自定义异常：创建 <tt>cx_static_check</tt> 的子类，并用 <tt>RAISE EXCEPTION TYPE … EXPORTING ….</tt> 引发。</li>
        <li>可能引发异常的方法必须在 <tt>RAISING</tt> 中列出它，这样调用者才知道必须处理它。</li>
      </ul>
      <p>未被捕获的异常会使程序以 short dump 停止。</p>`,
    task: `<ul>
      <li>删除第 1 部分的 <tt>TRY … ENDTRY</tt> 块并运行。程序在哪里停止？</li>
      <li>添加第二个异常 <tt>lcx_jumlah_tidak_valid</tt>，在取款金额 ≤ 0 时引发，并用单独的 <tt>CATCH</tt> 捕获。</li>
    </ul>`
  });

  // ---- a06: Modern ABAP syntax (7.40+) ----
  add('en', 'a06', {
    body: `<p>Since release 7.40, many old patterns have a much more compact form. New code should use the modern form; the old form still has to be recognised because it fills existing systems.</p>
      <table>
        <tr><th>Classic</th><th>Modern</th></tr>
        <tr><td><tt>DATA lv_x TYPE i. lv_x = 5.</tt></td><td><tt>DATA(lv_x) = 5.</tt></td></tr>
        <tr><td>fill a work area, then <tt>APPEND</tt></td><td><tt>APPEND VALUE #( a = 1 b = 2 ) TO lt.</tt></td></tr>
        <tr><td><tt>LOOP AT lt INTO ls.</tt> + declaring <tt>ls</tt></td><td><tt>LOOP AT lt INTO DATA(ls).</tt></td></tr>
        <tr><td><tt>FIELD-SYMBOLS &lt;fs&gt;</tt> + <tt>ASSIGNING &lt;fs&gt;</tt></td><td><tt>ASSIGNING FIELD-SYMBOL(&lt;fs&gt;)</tt></td></tr>
        <tr><td><tt>CONCATENATE a b INTO c.</tt></td><td><tt>c = |{ a } { b }|.</tt> or <tt>a &amp;&amp; b</tt></td></tr>
        <tr><td><tt>CREATE OBJECT lo.</tt></td><td><tt>DATA(lo) = NEW lcl_x( ).</tt></td></tr>
        <tr><td><tt>INTO TABLE gt</tt></td><td><tt>INTO TABLE @DATA(lt)</tt> (with <tt>@</tt> in front of program variables)</td></tr>
      </table>
      <p>The type of an inline variable is derived from the value on the right-hand side. The <tt>#</tt> in <tt>VALUE #( … )</tt> means "use the type from the context".</p>`,
    task: `<ul>
      <li>Rewrite the lesson "Internal table: APPEND and LOOP" with modern syntax. How many lines disappear?</li>
      <li>Build a table of three employees with a single <tt>VALUE</tt>, then print it with a string template.</li>
    </ul>`
  });
  add('de', 'a06', {
    body: `<p>Seit Release 7.40 haben viele alte Muster eine deutlich kompaktere Form. Neuer Code sollte die moderne Form verwenden; die alte Form muss man weiterhin erkennen, weil sie bestehende Systeme füllt.</p>
      <table>
        <tr><th>Klassisch</th><th>Modern</th></tr>
        <tr><td><tt>DATA lv_x TYPE i. lv_x = 5.</tt></td><td><tt>DATA(lv_x) = 5.</tt></td></tr>
        <tr><td>Work Area füllen, dann <tt>APPEND</tt></td><td><tt>APPEND VALUE #( a = 1 b = 2 ) TO lt.</tt></td></tr>
        <tr><td><tt>LOOP AT lt INTO ls.</tt> + Deklaration von <tt>ls</tt></td><td><tt>LOOP AT lt INTO DATA(ls).</tt></td></tr>
        <tr><td><tt>FIELD-SYMBOLS &lt;fs&gt;</tt> + <tt>ASSIGNING &lt;fs&gt;</tt></td><td><tt>ASSIGNING FIELD-SYMBOL(&lt;fs&gt;)</tt></td></tr>
        <tr><td><tt>CONCATENATE a b INTO c.</tt></td><td><tt>c = |{ a } { b }|.</tt> oder <tt>a &amp;&amp; b</tt></td></tr>
        <tr><td><tt>CREATE OBJECT lo.</tt></td><td><tt>DATA(lo) = NEW lcl_x( ).</tt></td></tr>
        <tr><td><tt>INTO TABLE gt</tt></td><td><tt>INTO TABLE @DATA(lt)</tt> (mit <tt>@</tt> vor Programmvariablen)</td></tr>
      </table>
      <p>Der Typ einer Inline-Variable wird aus dem Wert auf der rechten Seite abgeleitet. Das <tt>#</tt> in <tt>VALUE #( … )</tt> bedeutet „Typ aus dem Kontext verwenden“.</p>`,
    task: `<ul>
      <li>Schreiben Sie die Lektion „Interne Tabelle: APPEND und LOOP“ mit moderner Syntax neu. Wie viele Zeilen entfallen?</li>
      <li>Bauen Sie eine Tabelle mit drei Mitarbeitern mit einem einzigen <tt>VALUE</tt> auf und geben Sie sie mit einem String-Template aus.</li>
    </ul>`
  });
  add('zh', 'a06', {
    body: `<p>自 7.40 版本起，许多旧写法有了简洁得多的形式。新代码应使用现代形式；旧形式仍需认识，因为现有系统中到处都是。</p>
      <table>
        <tr><th>经典</th><th>现代</th></tr>
        <tr><td><tt>DATA lv_x TYPE i. lv_x = 5.</tt></td><td><tt>DATA(lv_x) = 5.</tt></td></tr>
        <tr><td>填充工作区，然后 <tt>APPEND</tt></td><td><tt>APPEND VALUE #( a = 1 b = 2 ) TO lt.</tt></td></tr>
        <tr><td><tt>LOOP AT lt INTO ls.</tt> + 声明 <tt>ls</tt></td><td><tt>LOOP AT lt INTO DATA(ls).</tt></td></tr>
        <tr><td><tt>FIELD-SYMBOLS &lt;fs&gt;</tt> + <tt>ASSIGNING &lt;fs&gt;</tt></td><td><tt>ASSIGNING FIELD-SYMBOL(&lt;fs&gt;)</tt></td></tr>
        <tr><td><tt>CONCATENATE a b INTO c.</tt></td><td><tt>c = |{ a } { b }|.</tt> 或 <tt>a &amp;&amp; b</tt></td></tr>
        <tr><td><tt>CREATE OBJECT lo.</tt></td><td><tt>DATA(lo) = NEW lcl_x( ).</tt></td></tr>
        <tr><td><tt>INTO TABLE gt</tt></td><td><tt>INTO TABLE @DATA(lt)</tt>（程序变量前加 <tt>@</tt>）</td></tr>
      </table>
      <p>内联变量的类型由右侧的值推导而来。<tt>VALUE #( … )</tt> 中的 <tt>#</tt> 表示“使用上下文中的类型”。</p>`,
    task: `<ul>
      <li>用现代语法重写“内表：APPEND 与 LOOP”一课。少了多少行？</li>
      <li>用一个 <tt>VALUE</tt> 构建包含三名员工的表，然后用字符串模板输出。</li>
    </ul>`
  });

  // ---- a08: Modern expressions ----
  add('en', 'a08', {
    body: `<p>Modern ABAP lets logic be written as an <b>expression</b> on the right-hand side of an assignment, instead of several lines of statements.</p>
      <table>
        <tr><th>Expression</th><th>Replaces</th></tr>
        <tr><td><tt>COND type( WHEN … THEN … ELSE … )</tt></td><td>an <tt>IF / ELSEIF / ELSE</tt> that only fills one variable</td></tr>
        <tr><td><tt>SWITCH type( x WHEN … THEN … )</tt></td><td>a <tt>CASE</tt> that only fills one variable</td></tr>
        <tr><td><tt>itab[ 2 ]</tt>, <tt>itab[ id = 5 ]-nama</tt></td><td><tt>READ TABLE</tt></td></tr>
        <tr><td><tt>line_exists( itab[ … ] )</tt></td><td><tt>READ TABLE … TRANSPORTING NO FIELDS</tt> + checking <tt>sy-subrc</tt></td></tr>
        <tr><td><tt>VALUE type( FOR r IN itab WHERE ( … ) ( … ) )</tt></td><td><tt>LOOP</tt> + <tt>APPEND</tt> to build a new table</td></tr>
        <tr><td><tt>REDUCE type( INIT s = 0 FOR r IN itab NEXT s = s + r-f )</tt></td><td>a <tt>LOOP</tt> that sums / counts</td></tr>
        <tr><td><tt>CORRESPONDING type( source )</tt></td><td><tt>MOVE-CORRESPONDING</tt></td></tr>
      </table>
      <p>Be careful with table expressions: if the row does not exist, the result is not <tt>sy-subrc = 4</tt> but the exception <tt>cx_sy_itab_line_not_found</tt>. Use <tt>line_exists( )</tt>, <tt>VALUE #( … OPTIONAL )</tt>, or <tt>TRY … CATCH</tt>.</p>`,
    task: `<ul>
      <li>Compute the highest score with <tt>REDUCE</tt> (hint: <tt>NEXT m = COND #( WHEN r-nilai &gt; m THEN r-nilai ELSE m )</tt>).</li>
      <li>Build a table containing only the students who did <b>not</b> pass with <tt>VALUE … FOR … WHERE</tt>.</li>
      <li>Rewrite one <tt>COND</tt> block as an ordinary <tt>IF / ELSEIF</tt> and compare the number of lines.</li>
    </ul>`
  });
  add('de', 'a08', {
    body: `<p>Modernes ABAP erlaubt es, Logik als <b>Ausdruck</b> auf der rechten Seite einer Zuweisung zu schreiben, statt in mehreren Anweisungszeilen.</p>
      <table>
        <tr><th>Ausdruck</th><th>Ersetzt</th></tr>
        <tr><td><tt>COND typ( WHEN … THEN … ELSE … )</tt></td><td>ein <tt>IF / ELSEIF / ELSE</tt>, das nur eine Variable füllt</td></tr>
        <tr><td><tt>SWITCH typ( x WHEN … THEN … )</tt></td><td>ein <tt>CASE</tt>, das nur eine Variable füllt</td></tr>
        <tr><td><tt>itab[ 2 ]</tt>, <tt>itab[ id = 5 ]-nama</tt></td><td><tt>READ TABLE</tt></td></tr>
        <tr><td><tt>line_exists( itab[ … ] )</tt></td><td><tt>READ TABLE … TRANSPORTING NO FIELDS</tt> + Prüfung von <tt>sy-subrc</tt></td></tr>
        <tr><td><tt>VALUE typ( FOR r IN itab WHERE ( … ) ( … ) )</tt></td><td><tt>LOOP</tt> + <tt>APPEND</tt>, um eine neue Tabelle aufzubauen</td></tr>
        <tr><td><tt>REDUCE typ( INIT s = 0 FOR r IN itab NEXT s = s + r-f )</tt></td><td>eine <tt>LOOP</tt> zum Summieren / Zählen</td></tr>
        <tr><td><tt>CORRESPONDING typ( quelle )</tt></td><td><tt>MOVE-CORRESPONDING</tt></td></tr>
      </table>
      <p>Vorsicht bei Tabellenausdrücken: Existiert die Zeile nicht, ist das Ergebnis nicht <tt>sy-subrc = 4</tt>, sondern die Ausnahme <tt>cx_sy_itab_line_not_found</tt>. Verwenden Sie <tt>line_exists( )</tt>, <tt>VALUE #( … OPTIONAL )</tt> oder <tt>TRY … CATCH</tt>.</p>`,
    task: `<ul>
      <li>Berechnen Sie die höchste Note mit <tt>REDUCE</tt> (Tipp: <tt>NEXT m = COND #( WHEN r-nilai &gt; m THEN r-nilai ELSE m )</tt>).</li>
      <li>Bauen Sie mit <tt>VALUE … FOR … WHERE</tt> eine Tabelle nur mit den Schülern auf, die <b>nicht</b> bestanden haben.</li>
      <li>Schreiben Sie einen <tt>COND</tt>-Block als gewöhnliches <tt>IF / ELSEIF</tt> um und vergleichen Sie die Zeilenzahl.</li>
    </ul>`
  });
  add('zh', 'a08', {
    body: `<p>现代 ABAP 允许把逻辑写成赋值语句右侧的<b>表达式</b>，而不是好几行语句。</p>
      <table>
        <tr><th>表达式</th><th>替代</th></tr>
        <tr><td><tt>COND 类型( WHEN … THEN … ELSE … )</tt></td><td>只给一个变量赋值的 <tt>IF / ELSEIF / ELSE</tt></td></tr>
        <tr><td><tt>SWITCH 类型( x WHEN … THEN … )</tt></td><td>只给一个变量赋值的 <tt>CASE</tt></td></tr>
        <tr><td><tt>itab[ 2 ]</tt>、<tt>itab[ id = 5 ]-nama</tt></td><td><tt>READ TABLE</tt></td></tr>
        <tr><td><tt>line_exists( itab[ … ] )</tt></td><td><tt>READ TABLE … TRANSPORTING NO FIELDS</tt> + 检查 <tt>sy-subrc</tt></td></tr>
        <tr><td><tt>VALUE 类型( FOR r IN itab WHERE ( … ) ( … ) )</tt></td><td>用 <tt>LOOP</tt> + <tt>APPEND</tt> 构建新表</td></tr>
        <tr><td><tt>REDUCE 类型( INIT s = 0 FOR r IN itab NEXT s = s + r-f )</tt></td><td>用于求和 / 计数的 <tt>LOOP</tt></td></tr>
        <tr><td><tt>CORRESPONDING 类型( 源 )</tt></td><td><tt>MOVE-CORRESPONDING</tt></td></tr>
      </table>
      <p>使用表表达式要小心：如果行不存在，结果不是 <tt>sy-subrc = 4</tt>，而是异常 <tt>cx_sy_itab_line_not_found</tt>。请使用 <tt>line_exists( )</tt>、<tt>VALUE #( … OPTIONAL )</tt> 或 <tt>TRY … CATCH</tt>。</p>`,
    task: `<ul>
      <li>用 <tt>REDUCE</tt> 计算最高分（提示：<tt>NEXT m = COND #( WHEN r-nilai &gt; m THEN r-nilai ELSE m )</tt>）。</li>
      <li>用 <tt>VALUE … FOR … WHERE</tt> 构建一张只包含<b>未</b>及格学生的表。</li>
      <li>把一个 <tt>COND</tt> 块改写成普通的 <tt>IF / ELSEIF</tt>，比较行数。</li>
    </ul>`
  });

  // ---- a09: Class events ----
  add('en', 'a09', {
    body: `<p>An <b>event</b> lets an object announce "something happened" without knowing who is listening. Other objects register as listeners. This pattern (publish–subscribe) is used throughout SAP — including clicks in an ALV.</p>
      <ul>
        <li>The sender declares <tt>EVENTS name EXPORTING VALUE(p) TYPE t.</tt> and triggers it with <tt>RAISE EVENT name EXPORTING p = ….</tt></li>
        <li>The listener has a method <tt>METHODS on_x FOR EVENT name OF sender_class IMPORTING p sender.</tt></li>
        <li><tt>SET HANDLER object-&gt;on_x FOR sender.</tt> connects the two. <tt>FOR ALL INSTANCES</tt> listens to every object of that class.</li>
        <li>The special parameter <tt>sender</tt> holds the object that triggered the event.</li>
      </ul>
      <p>Without <tt>SET HANDLER</tt> the event is still triggered but nobody reacts — and that is not an error.</p>`,
    task: `<ul>
      <li>Replace both <tt>SET HANDLER</tt> statements with a single <tt>… FOR ALL INSTANCES.</tt> How many reorders are recorded?</li>
      <li>Add a second listener, <tt>lcl_gudang</tt>, that prints its own warning for the same event.</li>
      <li>Add <tt>sender</tt> to the handler's <tt>IMPORTING</tt> list and call a public method of the sender.</li>
    </ul>`
  });
  add('de', 'a09', {
    body: `<p>Ein <b>Ereignis</b> lässt ein Objekt verkünden „etwas ist passiert“, ohne zu wissen, wer zuhört. Andere Objekte registrieren sich als Zuhörer. Dieses Muster (Publish–Subscribe) wird überall in SAP verwendet — auch bei Klicks im ALV.</p>
      <ul>
        <li>Der Sender deklariert <tt>EVENTS name EXPORTING VALUE(p) TYPE t.</tt> und löst es mit <tt>RAISE EVENT name EXPORTING p = ….</tt> aus.</li>
        <li>Der Zuhörer hat eine Methode <tt>METHODS on_x FOR EVENT name OF senderklasse IMPORTING p sender.</tt></li>
        <li><tt>SET HANDLER objekt-&gt;on_x FOR sender.</tt> verbindet beide. <tt>FOR ALL INSTANCES</tt> hört auf alle Objekte dieser Klasse.</li>
        <li>Der spezielle Parameter <tt>sender</tt> enthält das Objekt, das das Ereignis ausgelöst hat.</li>
      </ul>
      <p>Ohne <tt>SET HANDLER</tt> wird das Ereignis trotzdem ausgelöst, aber niemand reagiert — und das ist kein Fehler.</p>`,
    task: `<ul>
      <li>Ersetzen Sie beide <tt>SET HANDLER</tt>-Anweisungen durch ein einziges <tt>… FOR ALL INSTANCES.</tt> Wie viele Nachbestellungen werden erfasst?</li>
      <li>Fügen Sie einen zweiten Zuhörer <tt>lcl_gudang</tt> hinzu, der für dasselbe Ereignis eine eigene Warnung ausgibt.</li>
      <li>Fügen Sie <tt>sender</tt> zur <tt>IMPORTING</tt>-Liste des Handlers hinzu und rufen Sie eine öffentliche Methode des Senders auf.</li>
    </ul>`
  });
  add('zh', 'a09', {
    body: `<p><b>事件</b>让对象可以宣布“发生了某事”，而无需知道谁在监听。其他对象注册为监听者。这种模式（发布–订阅）在整个 SAP 中都有使用——包括 ALV 中的点击。</p>
      <ul>
        <li>发送方声明 <tt>EVENTS 名称 EXPORTING VALUE(p) TYPE t.</tt> 并用 <tt>RAISE EVENT 名称 EXPORTING p = ….</tt> 触发它。</li>
        <li>监听方有一个方法 <tt>METHODS on_x FOR EVENT 名称 OF 发送方类 IMPORTING p sender.</tt></li>
        <li><tt>SET HANDLER 对象-&gt;on_x FOR 发送方.</tt> 把两者连接起来。<tt>FOR ALL INSTANCES</tt> 监听该类的所有对象。</li>
        <li>特殊参数 <tt>sender</tt> 保存触发事件的对象。</li>
      </ul>
      <p>没有 <tt>SET HANDLER</tt> 时，事件仍会被触发，只是无人响应——这并不是错误。</p>`,
    task: `<ul>
      <li>用一条 <tt>… FOR ALL INSTANCES.</tt> 替换两条 <tt>SET HANDLER</tt>。记录了多少次补货订单？</li>
      <li>添加第二个监听者 <tt>lcl_gudang</tt>，它为同一事件输出自己的警告。</li>
      <li>把 <tt>sender</tt> 加入处理方法的 <tt>IMPORTING</tt> 列表，并调用发送方的一个公共方法。</li>
    </ul>`
  });

  // ---- a10: Data references and dynamic programming ----
  add('en', 'a10', {
    body: `<p>Generic programs — for example one that prints any structure — do not know the field names when they are written. The tools are <b>data references</b> and <b>dynamic access</b>.</p>
      <ul>
        <li>A <b>data reference</b> is a pointer to data: <tt>DATA dref TYPE REF TO i.</tt> It is filled with <tt>dref = REF #( variable ).</tt> or <tt>GET REFERENCE OF variable INTO dref.</tt></li>
        <li><tt>dref-&gt;*</tt> is the data itself (<i>dereferencing</i>). For a reference to a structure, components are accessed with <tt>dref-&gt;component</tt>.</li>
        <li><tt>CREATE DATA dref.</tt> creates new, unnamed data that can only be reached through that reference.</li>
        <li><tt>LOOP AT itab REFERENCE INTO dref.</tt> — like <tt>ASSIGNING</tt>, changes go straight to the table row.</li>
        <li><tt>ASSIGN COMPONENT n OF STRUCTURE s TO &lt;fs&gt;.</tt> takes a component by <b>number or name</b>; <tt>sy-subrc</tt> = 4 if it does not exist. With <tt>DO</tt> + <tt>EXIT</tt>, all components can be walked through.</li>
        <li><tt>ASSIGN (name) TO &lt;fs&gt;.</tt> takes the variable whose name is stored in another variable.</li>
      </ul>
      <p>A reference that has not been filled is empty; dereferencing it raises <tt>cx_sy_ref_is_initial</tt>. Check with <tt>IS BOUND</tt>.</p>`,
    task: `<ul>
      <li>Create a FORM <tt>cetak_struktur USING ps_data TYPE any</tt> that prints all components of any structure, then call it for <tt>gs_produk</tt> and for one SCARR row.</li>
      <li>After <tt>CLEAR gr_produk</tt>, access <tt>gr_produk-&gt;harga</tt> and catch the exception with <tt>TRY … CATCH cx_sy_ref_is_initial</tt>.</li>
    </ul>`
  });
  add('de', 'a10', {
    body: `<p>Generische Programme — etwa eines, das beliebige Strukturen ausgibt — kennen die Feldnamen beim Schreiben nicht. Die Werkzeuge sind <b>Datenreferenzen</b> und <b>dynamischer Zugriff</b>.</p>
      <ul>
        <li>Eine <b>Datenreferenz</b> ist ein Zeiger auf Daten: <tt>DATA dref TYPE REF TO i.</tt> Sie wird mit <tt>dref = REF #( variable ).</tt> oder <tt>GET REFERENCE OF variable INTO dref.</tt> gefüllt.</li>
        <li><tt>dref-&gt;*</tt> sind die Daten selbst (<i>Dereferenzierung</i>). Bei einer Referenz auf eine Struktur greift man mit <tt>dref-&gt;komponente</tt> auf Komponenten zu.</li>
        <li><tt>CREATE DATA dref.</tt> erzeugt neue, namenlose Daten, die nur über diese Referenz erreichbar sind.</li>
        <li><tt>LOOP AT itab REFERENCE INTO dref.</tt> — wie bei <tt>ASSIGNING</tt> wirken Änderungen direkt auf die Tabellenzeile.</li>
        <li><tt>ASSIGN COMPONENT n OF STRUCTURE s TO &lt;fs&gt;.</tt> holt eine Komponente über <b>Nummer oder Name</b>; <tt>sy-subrc</tt> = 4, wenn es sie nicht gibt. Mit <tt>DO</tt> + <tt>EXIT</tt> lassen sich alle Komponenten durchlaufen.</li>
        <li><tt>ASSIGN (name) TO &lt;fs&gt;.</tt> holt die Variable, deren Name in einer anderen Variable gespeichert ist.</li>
      </ul>
      <p>Eine nicht gefüllte Referenz ist leer; sie zu dereferenzieren löst <tt>cx_sy_ref_is_initial</tt> aus. Prüfen Sie mit <tt>IS BOUND</tt>.</p>`,
    task: `<ul>
      <li>Erstellen Sie eine FORM <tt>cetak_struktur USING ps_data TYPE any</tt>, die alle Komponenten einer beliebigen Struktur ausgibt, und rufen Sie sie für <tt>gs_produk</tt> und für eine SCARR-Zeile auf.</li>
      <li>Greifen Sie nach <tt>CLEAR gr_produk</tt> auf <tt>gr_produk-&gt;harga</tt> zu und fangen Sie die Ausnahme mit <tt>TRY … CATCH cx_sy_ref_is_initial</tt> ab.</li>
    </ul>`
  });
  add('zh', 'a10', {
    body: `<p>通用程序——例如能输出任意结构体的程序——在编写时并不知道字段名。所用的工具是<b>数据引用</b>和<b>动态访问</b>。</p>
      <ul>
        <li><b>数据引用</b>是指向数据的指针：<tt>DATA dref TYPE REF TO i.</tt> 用 <tt>dref = REF #( 变量 ).</tt> 或 <tt>GET REFERENCE OF 变量 INTO dref.</tt> 赋值。</li>
        <li><tt>dref-&gt;*</tt> 是数据本身（<i>解引用</i>）。对于指向结构体的引用，用 <tt>dref-&gt;组件</tt> 访问组件。</li>
        <li><tt>CREATE DATA dref.</tt> 创建新的匿名数据，只能通过该引用访问。</li>
        <li><tt>LOOP AT itab REFERENCE INTO dref.</tt> ——与 <tt>ASSIGNING</tt> 一样，修改会直接作用于表行。</li>
        <li><tt>ASSIGN COMPONENT n OF STRUCTURE s TO &lt;fs&gt;.</tt> 按<b>序号或名称</b>取得组件；不存在时 <tt>sy-subrc</tt> = 4。配合 <tt>DO</tt> + <tt>EXIT</tt> 可以遍历所有组件。</li>
        <li><tt>ASSIGN (名称) TO &lt;fs&gt;.</tt> 取得名称保存在另一个变量中的那个变量。</li>
      </ul>
      <p>尚未赋值的引用为空；对它解引用会引发 <tt>cx_sy_ref_is_initial</tt>。请用 <tt>IS BOUND</tt> 检查。</p>`,
    task: `<ul>
      <li>创建 FORM <tt>cetak_struktur USING ps_data TYPE any</tt>，输出任意结构体的所有组件，然后分别对 <tt>gs_produk</tt> 和 SCARR 的一行调用它。</li>
      <li>在 <tt>CLEAR gr_produk</tt> 之后访问 <tt>gr_produk-&gt;harga</tt>，并用 <tt>TRY … CATCH cx_sy_ref_is_initial</tt> 捕获异常。</li>
    </ul>`
  });

  // ---- a11: Advanced SALV: columns, hotspots, and events ----
  add('en', 'a11', {
    body: `<p><tt>CL_SALV_TABLE</tt> is configured through <b>helper objects</b>. Each part of the ALV has its own object:</p>
      <table>
        <tr><th>Obtained with</th><th>Controls</th></tr>
        <tr><td><tt>get_columns( )</tt></td><td>the set of columns: <tt>set_optimize( )</tt>, <tt>get_column( 'NAME' )</tt></td></tr>
        <tr><td><tt>get_column( … )</tt></td><td>a single column: <tt>set_long_text</tt> / <tt>set_medium_text</tt> / <tt>set_short_text</tt>, <tt>set_visible( abap_false )</tt>, <tt>set_cell_type( if_salv_c_cell_type=&gt;hotspot )</tt></td></tr>
        <tr><td><tt>get_display_settings( )</tt></td><td><tt>set_striped_pattern( )</tt>, <tt>set_list_header( )</tt></td></tr>
        <tr><td><tt>get_sorts( )</tt>, <tt>get_aggregations( )</tt></td><td><tt>add_sort( columnname = … )</tt>, <tt>add_aggregation( columnname = … )</tt></td></tr>
        <tr><td><tt>get_event( )</tt></td><td>the event object: the target of <tt>SET HANDLER</tt></td></tr>
      </table>
      <ul>
        <li><tt>get_column( )</tt> returns a general type; for <tt>set_cell_type</tt> you need <tt>CAST cl_salv_column_table( … )</tt>.</li>
        <li>SALV events: <tt>link_click</tt> (hotspot click) and <tt>double_click</tt>, both carrying <tt>row</tt> and <tt>column</tt>.</li>
        <li>A column that does not exist raises <tt>cx_salv_not_found</tt>; <tt>factory</tt> can raise <tt>cx_salv_msg</tt>.</li>
      </ul>
      <p>Run it, then click an underlined PO number.</p>`,
    task: `<ul>
      <li>Request a column that does not exist (<tt>get_column( 'HARGA' )</tt>). Which exception is caught?</li>
      <li>Add a handler for the <tt>double_click</tt> event that shows the quantity (<tt>menge</tt>) of the clicked row.</li>
      <li>Add <tt>PARAMETERS p_bukrs</tt> and filter the POs by company code.</li>
    </ul>`
  });
  add('de', 'a11', {
    body: `<p><tt>CL_SALV_TABLE</tt> wird über <b>Hilfsobjekte</b> konfiguriert. Jeder Teil des ALV hat sein eigenes Objekt:</p>
      <table>
        <tr><th>Geholt mit</th><th>Steuert</th></tr>
        <tr><td><tt>get_columns( )</tt></td><td>die Spaltenmenge: <tt>set_optimize( )</tt>, <tt>get_column( 'NAME' )</tt></td></tr>
        <tr><td><tt>get_column( … )</tt></td><td>eine einzelne Spalte: <tt>set_long_text</tt> / <tt>set_medium_text</tt> / <tt>set_short_text</tt>, <tt>set_visible( abap_false )</tt>, <tt>set_cell_type( if_salv_c_cell_type=&gt;hotspot )</tt></td></tr>
        <tr><td><tt>get_display_settings( )</tt></td><td><tt>set_striped_pattern( )</tt>, <tt>set_list_header( )</tt></td></tr>
        <tr><td><tt>get_sorts( )</tt>, <tt>get_aggregations( )</tt></td><td><tt>add_sort( columnname = … )</tt>, <tt>add_aggregation( columnname = … )</tt></td></tr>
        <tr><td><tt>get_event( )</tt></td><td>das Ereignisobjekt: das Ziel von <tt>SET HANDLER</tt></td></tr>
      </table>
      <ul>
        <li><tt>get_column( )</tt> liefert einen allgemeinen Typ; für <tt>set_cell_type</tt> braucht man <tt>CAST cl_salv_column_table( … )</tt>.</li>
        <li>SALV-Ereignisse: <tt>link_click</tt> (Hotspot-Klick) und <tt>double_click</tt>, beide mit <tt>row</tt> und <tt>column</tt>.</li>
        <li>Eine nicht vorhandene Spalte löst <tt>cx_salv_not_found</tt> aus; <tt>factory</tt> kann <tt>cx_salv_msg</tt> auslösen.</li>
      </ul>
      <p>Führen Sie es aus und klicken Sie dann auf eine unterstrichene Bestellnummer.</p>`,
    task: `<ul>
      <li>Fordern Sie eine nicht vorhandene Spalte an (<tt>get_column( 'HARGA' )</tt>). Welche Ausnahme wird abgefangen?</li>
      <li>Fügen Sie einen Handler für das Ereignis <tt>double_click</tt> hinzu, der die Menge (<tt>menge</tt>) der angeklickten Zeile anzeigt.</li>
      <li>Fügen Sie <tt>PARAMETERS p_bukrs</tt> hinzu und filtern Sie die Bestellungen nach Buchungskreis.</li>
    </ul>`
  });
  add('zh', 'a11', {
    body: `<p><tt>CL_SALV_TABLE</tt> 通过<b>辅助对象</b>进行配置。ALV 的每个部分都有自己的对象：</p>
      <table>
        <tr><th>获取方式</th><th>控制内容</th></tr>
        <tr><td><tt>get_columns( )</tt></td><td>列集合：<tt>set_optimize( )</tt>、<tt>get_column( 'NAME' )</tt></td></tr>
        <tr><td><tt>get_column( … )</tt></td><td>单个列：<tt>set_long_text</tt> / <tt>set_medium_text</tt> / <tt>set_short_text</tt>、<tt>set_visible( abap_false )</tt>、<tt>set_cell_type( if_salv_c_cell_type=&gt;hotspot )</tt></td></tr>
        <tr><td><tt>get_display_settings( )</tt></td><td><tt>set_striped_pattern( )</tt>、<tt>set_list_header( )</tt></td></tr>
        <tr><td><tt>get_sorts( )</tt>、<tt>get_aggregations( )</tt></td><td><tt>add_sort( columnname = … )</tt>、<tt>add_aggregation( columnname = … )</tt></td></tr>
        <tr><td><tt>get_event( )</tt></td><td>事件对象：<tt>SET HANDLER</tt> 的目标</td></tr>
      </table>
      <ul>
        <li><tt>get_column( )</tt> 返回通用类型；要使用 <tt>set_cell_type</tt> 需要 <tt>CAST cl_salv_column_table( … )</tt>。</li>
        <li>SALV 事件：<tt>link_click</tt>（点击热点）和 <tt>double_click</tt>，两者都带有 <tt>row</tt> 和 <tt>column</tt>。</li>
        <li>不存在的列会引发 <tt>cx_salv_not_found</tt>；<tt>factory</tt> 可能引发 <tt>cx_salv_msg</tt>。</li>
      </ul>
      <p>运行后，点击带下划线的采购订单号。</p>`,
    task: `<ul>
      <li>请求一个不存在的列（<tt>get_column( 'HARGA' )</tt>）。捕获到了什么异常？</li>
      <li>为 <tt>double_click</tt> 事件添加处理方法，显示被点击行的数量（<tt>menge</tt>）。</li>
      <li>添加 <tt>PARAMETERS p_bukrs</tt>，按公司代码筛选采购订单。</li>
    </ul>`
  });

  // ---- a07: Case study: an object-oriented report ----
  add('en', 'a07', {
    body: `<p>The closing lesson brings everything together. A flight occupancy report is written as a single class; the main program is only four lines long.</p>
      <ul>
        <li><b>Separate responsibilities</b>: <tt>ambil_data</tt> only reads the database, <tt>olah_data</tt> only calculates, <tt>tampilkan</tt> only deals with the screen. Each can be changed or tested on its own.</li>
        <li><b>State in attributes</b>: the result table is kept in <tt>mt_data</tt> (private), not in a global variable.</li>
        <li><b>Types inside the class</b>: <tt>ty_baris</tt> is defined in the class's <tt>PUBLIC SECTION</tt>.</li>
        <li>The <b>constructor</b> receives the selection criteria, so the report object always knows what to fetch.</li>
      </ul>
      <p>Compare it with the project in the Intermediate level: the flow is the same, but there are no longer global variables that can be changed from anywhere.</p>`,
    task: `<ul>
      <li>Run it through <b>Parameter</b> (F8) with airline <tt>SQ</tt>, then with a code that does not exist (<tt>XX</tt>).</li>
      <li>Add a method <tt>rata_rata_okupansi</tt> that returns the average of the <tt>persen</tt> column.</li>
      <li>Move the display into its own class <tt>lcl_tampilan</tt> that receives the data table — so that <tt>lcl_laporan</tt> knows nothing about ALV.</li>
    </ul>`
  });
  add('de', 'a07', {
    body: `<p>Die Abschlusslektion führt alles zusammen. Ein Bericht zur Flugauslastung wird als eine einzige Klasse geschrieben; das Hauptprogramm ist nur noch vier Zeilen lang.</p>
      <ul>
        <li><b>Getrennte Verantwortlichkeiten</b>: <tt>ambil_data</tt> liest nur die Datenbank, <tt>olah_data</tt> rechnet nur, <tt>tampilkan</tt> kümmert sich nur um die Anzeige. Jede lässt sich einzeln ändern oder testen.</li>
        <li><b>Zustand in Attributen</b>: Die Ergebnistabelle liegt in <tt>mt_data</tt> (privat), nicht in einer globalen Variable.</li>
        <li><b>Typen in der Klasse</b>: <tt>ty_baris</tt> ist in der <tt>PUBLIC SECTION</tt> der Klasse definiert.</li>
        <li>Der <b>Konstruktor</b> nimmt die Selektionskriterien entgegen, sodass das Berichtsobjekt immer weiß, was zu lesen ist.</li>
      </ul>
      <p>Vergleichen Sie mit dem Projekt der Stufe Fortgeschritten: Der Ablauf ist derselbe, aber es gibt keine globalen Variablen mehr, die von überall geändert werden können.</p>`,
    task: `<ul>
      <li>Führen Sie es über <b>Parameter</b> (F8) mit der Fluggesellschaft <tt>SQ</tt> aus, dann mit einem nicht vorhandenen Code (<tt>XX</tt>).</li>
      <li>Fügen Sie eine Methode <tt>rata_rata_okupansi</tt> hinzu, die den Durchschnitt der Spalte <tt>persen</tt> zurückgibt.</li>
      <li>Lagern Sie die Anzeige in eine eigene Klasse <tt>lcl_tampilan</tt> aus, die die Datentabelle erhält — sodass <tt>lcl_laporan</tt> nichts über ALV weiß.</li>
    </ul>`
  });
  add('zh', 'a07', {
    body: `<p>最后一课把所有内容结合起来。航班上座率报表被写成一个类；主程序只剩四行。</p>
      <ul>
        <li><b>职责分离</b>：<tt>ambil_data</tt> 只读取数据库，<tt>olah_data</tt> 只做计算，<tt>tampilkan</tt> 只负责显示。每一部分都可以单独修改或测试。</li>
        <li><b>状态保存在属性中</b>：结果表保存在 <tt>mt_data</tt>（私有）中，而不是全局变量。</li>
        <li><b>类型定义在类内部</b>：<tt>ty_baris</tt> 定义在类的 <tt>PUBLIC SECTION</tt> 中。</li>
        <li><b>构造器</b>接收选择条件，因此报表对象始终知道要取什么数据。</li>
      </ul>
      <p>与“中级”级别的项目比较：流程相同，但不再有可以从任何地方修改的全局变量。</p>`,
    task: `<ul>
      <li>通过<b>参数</b>(F8) 用航空公司 <tt>SQ</tt> 运行，再用一个不存在的代码（<tt>XX</tt>）运行。</li>
      <li>添加方法 <tt>rata_rata_okupansi</tt>，返回 <tt>persen</tt> 列的平均值。</li>
      <li>把显示部分分离到独立的类 <tt>lcl_tampilan</tt> 中，由它接收数据表——这样 <tt>lcl_laporan</tt> 就完全不了解 ALV。</li>
    </ul>`
  });

})();

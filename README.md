<img src="logo.svg" alt="ABAP Code Studio logo" width="72" height="72">

# ABAP Code Studio

**Learn SAP ABAP in your browser — no SAP system required.**

ABAP Code Studio is an ABAP editor, simulator and course in one page. You write ABAP, press **Run**, and see the result as a classic list or an ALV grid, the way an SAP report would show it. A learning path of 49 lessons takes you from your first `WRITE` statement to object-oriented reports, unit tests and safe database transactions.

Created by **jeffrypurwanto**.

> This is a simulator for learning. It follows real ABAP syntax and imitates SAP's behaviour as closely as it can, but it is not an SAP system and does not connect to one.

## Getting started

There is nothing to install or build.

1. Download or clone this repository.
2. Open `index.html` in a modern browser (Chrome, Edge or Firefox).

Everything the page needs is in this folder, including the code editor (CodeMirror) and the fonts, so it also works without an internet connection. Your programs, lesson progress and language choice are saved in the browser's local storage, so they stay on your machine.

### Hosting on GitHub Pages

The folder is a complete static site: publish the repository root with GitHub Pages and open the `github.io` address. All paths are relative, so it works under `https://<user>.github.io/<repository>/` as well. The empty `.nojekyll` file tells Pages to serve the files as they are.

The page is set up to start quickly there:

- Every file comes from the same server. No other host has to answer before the page can be shown.
- The translations of the lessons, the reference and the simulator messages are fetched only when a language other than Indonesian is in use.
- A very long result is cut on the page (2,000 list lines, 1,000 grid rows) and the rest is counted, so a loop that never stops cannot freeze the browser.

## What you can do

| Area | What it offers |
|---|---|
| **Editor** | Syntax highlighting, tabs for several programs, Pretty Printer, import and export of `.abap` files |
| **Code completion** | Enter after `IF`, `LOOP`, `CASE`, `METHOD` … adds the matching `ENDIF`, `ENDLOOP` … and indents; code templates with Tab stops; suggestions for your own names, table names, structure components (`gs_order-`), SQL columns (`a~`) and class members (`lo_obj->`). Works with on-screen keyboards as well: a suggestion is picked by tapping it, and a *Next* button on the cursor's line stands in for the Tab key. Can be switched off in the ⋯ menu; Ctrl+Space always opens the suggestions |
| **Run** | Output panel with list output, inline ALV grids, messages with clickable line numbers, a syntax check and a variable inspector |
| **SAP-style result screen** | A wide window that looks like SAP GUI: title bar, toolbar, ALV colours, totals row, status bar |
| **Selection screen** | `PARAMETERS` and `SELECT-OPTIONS` of your program become an input dialog (F8) |
| **Unit tests** | Test classes (`FOR TESTING`) run from the ⋯ menu or with Ctrl+Shift+F10; the report shows every test method, passed or failed, with expected and actual values |
| **Debugger** | Step through a program with the keys of the ABAP Debugger: F5 single step, F6 step over, F7 step out, F8 continue to a breakpoint. Breakpoints are set by clicking a line number or with `BREAK-POINT`. Each step shows the current line, the call stack, every variable (changed ones are marked, local ones are labelled) and the output so far. Unlike in SAP, every step can also be played backwards (Shift+F6), because the run is recorded first. Started with Shift+F5, from the ⋯ menu or from the Debug tab |
| **Database statistics** | After each run, a line below the output counts the database accesses and flags a `SELECT` that ran repeatedly inside a loop |
| **Learn** | 49 lessons in 5 levels, each with an explanation, a runnable example and exercises; progress is tracked |
| **Tables** | 32 sample copies of standard SAP tables covering flights, materials, purchasing, the sales flow (order → delivery → billing), goods movements and HR master data |
| **Snippets** | 29 ready-to-run examples, from Hello World to ALV, regular expressions and unit tests |
| **Docs** | A quick reference for syntax, internal tables, Open SQL, ALV, function modules and the advanced techniques |
| **Themes** | A dark ("ink") and a light ("paper") theme, switched from the ⋯ menu |

### Languages

The whole application is available in four languages. Use the globe button at the bottom of the navigation rail to switch:

- Bahasa Indonesia (default)
- English
- Deutsch
- 中文

The interface, all lessons, the reference and the simulator's error messages are translated. Example programs are runnable code and are the same in every language: program names, identifiers, comments and output texts are written in English. Sample data (names of people, companies and cities) is left as it is.

## The learning path

| Level | Lessons | Topics |
|---|---|---|
| 1 — Beginner | 6 | `WRITE`, variables and types, operators, `IF` / `CASE`, loops, strings |
| 2 — Basics | 10 | Structures, internal tables, field symbols, `FORM` / `PERFORM`, selection screens, `SELECT`, report events, control levels, table kinds |
| 3 — Intermediate | 11 | `JOIN` and `FOR ALL ENTRIES`, aggregates and data changes, messages, function modules, classic and modern ALV, interactive ALV, legacy code, a complete sales report |
| 4 — Advanced | 11 | Classes and objects, constructors, inheritance, interfaces, exceptions, modern syntax and expressions, class events, data references, advanced SALV, an object-oriented case study |
| 5 — Expert | 11 | Regular expressions, `LOOP AT … GROUP BY`, `FILTER` / `LET` / `FOR GROUPS`, subqueries and `UNION`, performance, ABAP Unit, design patterns, RTTS and dynamic SQL, authorization checks and locks, an order-to-cash case study, finding a bug with the debugger |

## What the simulator supports

- **Basics:** `DATA`, `TYPES`, `CONSTANTS`, `STATICS`, structures, the types `c` / `n` / `p` / `d` / `t` / `i` / `string` with lengths and decimals
- **Lists:** `WRITE` with positions and lengths, `ULINE`, `SKIP`, `TOP-OF-PAGE`, `HIDE` with `AT LINE-SELECTION`
- **Report events:** `INITIALIZATION`, `AT SELECTION-SCREEN`, `START-OF-SELECTION`, `END-OF-SELECTION` in SAP's order
- **Internal tables:** standard, sorted and hashed tables, header lines, `AT NEW` / `AT END OF` / `SUM`, `COLLECT`
- **Modularisation:** `FORM` / `PERFORM`, macros, your own function modules, more than 20 simulated standard function modules
- **Open SQL:** `SELECT` with joins, `FOR ALL ENTRIES`, aggregates, `GROUP BY` / `HAVING`; `INSERT`, `UPDATE`, `MODIFY`, `DELETE`, `COMMIT` and `ROLLBACK` on a per-run copy of the data
- **ABAP Objects:** local classes, inheritance, interfaces, events, class-based exceptions
- **Modern ABAP (7.40+):** inline declarations, `VALUE`, `COND`, `SWITCH`, `REDUCE`, `CORRESPONDING`, table expressions, string templates
- **ALV:** `REUSE_ALV_GRID_DISPLAY` with field catalog, layout, sorting, totals, hotspots and callbacks; `CL_SALV_TABLE` with columns, sorts, aggregations and events
- **Advanced:** regular expressions (`FIND` / `REPLACE … REGEX` or `PCRE`, `matches`, `match`), `LOOP AT … GROUP BY`, `FILTER`, `LET`, `FOR GROUPS`, SQL subqueries, `CASE` and calculations in the column list, `UNION`, dynamic `FROM` / `WHERE`, RTTS (`cl_abap_typedescr`)
- **ABAP Unit:** test classes with `setup` / `teardown` and `cl_abap_unit_assert`
- **Transactions:** `AUTHORITY-CHECK`, lock modules (`ENQUEUE_…` / `DEQUEUE_…`), `NUMBER_GET_NEXT`, BAPIs with a `RETURN` parameter

### Limitations

- Dynpro screens (`CALL SCREEN`, PBO / PAI) are not simulated.
- CDS views, AMDP and Native SQL are not supported.
- Global classes, test doubles and the creation of new types at runtime (RTTC) are not available.
- Database changes last only while a program runs; the sample data is restored for the next run.
- A statement the simulator does not know is skipped with a warning.

The **Docs → Simulator Coverage** page inside the app has the complete list.

## Project structure

Plain HTML, CSS and JavaScript with no build step and no dependencies to install.

| File | Purpose |
|---|---|
| `index.html` | Page shell: navigation rail, views, dialogs |
| `style.css` | All styles, including the dark and light theme tokens and the editor theme |
| `logo.svg` | The "A." mark — an ABAP statement always ends with a period |
| `app.js` | UI controller: editor, output rendering, ALV grids, views |
| `abap-interpreter.js` | The ABAP interpreter |
| `abap-mode.js` | ABAP syntax highlighting for CodeMirror |
| `abap-complete.js` | Code completion: suggestions, templates, automatic block closers, indentation |
| `abap-debug.js` | Debugger: breakpoints, stepping forwards and backwards through a recorded run |
| `dummy-data.js` | Sample database tables |
| `lessons.js`, `snippets.js`, `docs.js` | Learning content (Indonesian source) |
| `i18n.js` | Interface texts in four languages and the language switcher |
| `content-i18n.js`, `content-i18n-bodies.js`, `content-i18n-docs.js` | Translations of lessons, snippets and the reference; loaded by `i18n.js` on demand |
| `messages-i18n.js` | Translations of the simulator's messages; loaded on demand as well |
| `vendor/` | CodeMirror 5.65.16 and its add-ons, joined into one script and one style sheet |
| `fonts/` | IBM Plex Sans, IBM Plex Mono and Source Serif 4 (latin and latin-ext) |
| `.nojekyll` | Tells GitHub Pages to publish the files unchanged |

### How translation works

Indonesian is the source language. Everything else is layered on top and falls back to Indonesian when a translation is missing, so the app never breaks because of an untranslated text.

- **Interface:** each text is one entry in `i18n.js` of the form `key: [id, en, de, zh]`. HTML elements refer to it with `data-i18n="key"`; JavaScript calls `tr('key')`.
- **Lessons, snippets, docs:** translated fields are stored per item id and merged over the Indonesian object.
- **Simulator messages:** the interpreter always produces Indonesian text. When a message is displayed, it is matched against the patterns in `messages-i18n.js` and rebuilt in the current language. The interpreter itself has no knowledge of languages.

To add a language, add a column to `i18n.js` and `messages-i18n.js`, add the language to the `LANGS` list in `i18n.js`, and add a block for it in the three `content-i18n` files.

The four translation files are not listed in `index.html`. `i18n.js` adds them to the page when a language other than Indonesian is saved or chosen; until they have arrived, content is shown in Indonesian.

## Third-party software

- [CodeMirror 5](https://codemirror.net/5/) by Marijn Haverbeke and others, MIT licence (`vendor/LICENSE-codemirror.txt`).
- IBM Plex Sans and IBM Plex Mono by IBM, and Source Serif 4 by Adobe, SIL Open Font License 1.1 (`fonts/LICENSE.txt`).

## Author

Created by **jeffrypurwanto**.

Copyright © 2026 jeffrypurwanto. All rights reserved.

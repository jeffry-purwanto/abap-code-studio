// abap-mode.js — Custom CodeMirror syntax mode for ABAP
// ABAP Code Studio — Created by jeffrypurwanto

(function(CodeMirror) {
  "use strict";

  // ABAP Keywords
  const keywords = new Set([
    "REPORT","PROGRAM","CLASS","ENDCLASS","METHOD","ENDMETHOD",
    "INTERFACE","ENDINTERFACE","FORM","ENDFORM","PERFORM",
    "DATA","TYPES","CONSTANTS","FIELD-SYMBOLS","ASSIGN","UNASSIGN",
    "IF","ELSEIF","ELSE","ENDIF","CASE","WHEN","ENDCASE",
    "DO","ENDDO","WHILE","ENDWHILE","LOOP","ENDLOOP",
    "SELECT","FROM","WHERE","INTO","TABLE","ENDSELECT","OPEN","CLOSE",
    "READ","WRITE","NEW-LINE","SKIP","ULINE",
    "MOVE","CLEAR","REFRESH","FREE","APPEND","DELETE","INSERT","MODIFY","COLLECT",
    "CALL","FUNCTION","USING","CHANGING","EXPORTING","IMPORTING","EXCEPTIONS",
    "RAISE","MESSAGE","CATCH","TRY","ENDTRY","CLEANUP",
    "ADD","SUBTRACT","MULTIPLY","DIVIDE","COMPUTE",
    "CONCATENATE","SPLIT","TRANSLATE","CONDENSE","CONVERT",
    "FIND","REPLACE","SEARCH","MATCH",
    "SORT","DESCRIBE","STRLEN","LINES","FIELD-GROUPS",
    "AT","ENDAT","ON","OFF","SELECTION-SCREEN","PARAMETERS","SELECT-OPTIONS",
    "START-OF-SELECTION","END-OF-SELECTION","INITIALIZATION","AT SELECTION-SCREEN",
    "EXIT","RETURN","STOP","CHECK","CONTINUE","LEAVE","SUBMIT",
    "PUBLIC","PRIVATE","PROTECTED","SECTION",
    "INHERITING","FROM","ABSTRACT","FINAL","CREATE","OBJECT",
    "ME","SUPER","THIS","SELF",
    "TYPE","LIKE","VALUE","DEFAULT","OPTIONAL","PREFERRED","RETURNING",
    "STANDARD","SORTED","HASHED","OCCURS","INITIAL","SIZE",
    "REF","TO","DEREF","IS","BOUND","INITIAL","INSTANCE","OF",
    "AND","OR","NOT","EQ","NE","LT","GT","LE","GE",
    "BETWEEN","IN","NOT","LIKE",
    "CORRESPONDING","FIELDS","ASSIGNING",
    "FOR","EACH","RESULT","GROUP","BY","ORDER","HAVING",
    "WITH","KEY","BINARY","SEARCH","TRANSPORTING","NO","FIELDS",
    "AUTHORITY-CHECK","OBJECT","ID","FIELD","DUMMY",
    "COMMIT","WORK","ROLLBACK","LOCK","UNLOCK","ENQUEUE","DEQUEUE",
    "GENERATE","SUBROUTINE","POOL","MODULE","POOL",
    "INCLUDE","LOAD","OF","PROGRAM",
    "FORMAT","COLOR","INTENSIFIED","INVERSE","BLINK",
    // declarations, internal tables, SQL
    "TABLES","STRUCTURE","BEGIN","END","LENGTH","DECIMALS","LINE","RANGE","CHECKBOX","AS","OBLIGATORY",
    "TIMES","INDEX","COMPARING","ADJACENT","DUPLICATES","ASCENDING","DESCENDING","OTHERS","LINES",
    "SINGLE","DISTINCT","UP","ROWS","JOIN","INNER","LEFT","OUTER","ALL","ENTRIES","COUNT","APPENDING",
    "SEPARATED","OCCURRENCES","UPPER","LOWER","CASE","SHIFT","LEADING","TRAILING","DELETING","OFFSET",
    "MOVE-CORRESPONDING","COMPONENT","ASSIGNED","STATICS",
    // OO ABAP and exceptions
    "DEFINITION","IMPLEMENTATION","METHODS","CLASS-METHODS","CLASS-DATA","INTERFACES","REDEFINITION",
    "DEFERRED","READ-ONLY","NEW","RAISING","EXCEPTION","RECEIVING","FIELD-SYMBOL","ENDFUNCTION",
    "CS","NS","CP","NP","CO","CN","CA","NA","MOD","DIV",
    // blocks, events and newer syntax
    "DEFINE","END-OF-DEFINITION","ENDMODULE","TOP-OF-PAGE","END-OF-PAGE","LOAD-OF-PROGRAM","AT LINE-SELECTION",
    "UPDATE","SET","GET","EVENTS","HANDLER","ALIASES","TESTING","DURATION","SHORT","RISK","LEVEL","HARMLESS",
    "COND","SWITCH","CONV","CAST","REDUCE","FILTER","LET","INIT","NEXT","THEN","UNTIL","BASE","MAPPING","EXCEPT",
    "GROUPS","UNION","EXISTS","REGEX","PCRE","SUBMATCHES","UNIQUE","NON-UNIQUE","EMPTY","TIME","RUN","NO-GAP"
  ]);

  const builtins = new Set([
    "sy","syst","sy-subrc","sy-tabix","sy-dbcnt","sy-msgty","sy-msgid",
    "sy-msgno","sy-msgv1","sy-msgv2","sy-msgv3","sy-msgv4",
    "sy-uname","sy-datum","sy-uzeit","sy-mandt","sy-langu",
    "sy-lilli","sy-cucol","sy-curow","sy-tcode","sy-repid",
    "abap_true","abap_false","abap_undefined","space","initial",
    "i","p","f","c","n","x","d","t","string","xstring",
    "i4","i8","int8","decfloat16","decfloat34",
    "char","numc","dats","tims","clnt","cuky","unit"
  ]);

  const operators = new Set(["=","+","-","*","/","(",")","{","}","[","]","<",">","&","|","~","!","?","@","#","^","%"]);

  CodeMirror.defineMode("abap", function() {
    return {
      startState: function() {
        return { tokenize: null, context: null, inString: false, stringChar: null };
      },
      token: function(stream, state) {

        // Skip whitespace
        if (stream.eatSpace()) return null;

        // Comments: * at start of line or " anywhere
        if (stream.sol() && stream.peek() === '*') {
          stream.skipToEnd();
          return "comment";
        }
        if (stream.peek() === '"') {
          stream.skipToEnd();
          return "comment";
        }

        // String literals: 'text'
        if (stream.peek() === "'") {
          stream.next();
          while (!stream.eol()) {
            const ch = stream.next();
            if (ch === "'" && stream.peek() !== "'") break;
            if (ch === "'" && stream.peek() === "'") stream.next();
          }
          return "string";
        }

        // Template literals: `text`
        if (stream.peek() === "`") {
          stream.next();
          while (!stream.eol() && stream.peek() !== "`") stream.next();
          if (!stream.eol()) stream.next();
          return "string";
        }

        // String templates: |text { expr } text|
        if (stream.peek() === "|") {
          stream.next();
          while (!stream.eol() && stream.peek() !== "|") stream.next();
          if (!stream.eol()) stream.next();
          return "string";
        }

        // Field symbols: <fs_name>
        if (stream.match(/^<[A-Za-z_][A-Za-z0-9_]*>/)) return "variable-2";

        // Numbers
        if (stream.match(/^[0-9]+(\.[0-9]+)?/)) return "number";

        // Identifiers and keywords
        if (stream.match(/^[A-Za-z_][A-Za-z0-9_\-]*/)) {
          const word = stream.current().toUpperCase();
          if (keywords.has(word)) return "keyword";
          if (builtins.has(word.toLowerCase())) return "builtin";
          if (word.startsWith('Z') || word.startsWith('Y')) return "variable-3"; // customer objects
          return "variable";
        }

        // Chained statement separator
        if (stream.peek() === ':') { stream.next(); return "meta"; }
        if (stream.peek() === ',') { stream.next(); return "punctuation"; }
        if (stream.peek() === '.') { stream.next(); return "punctuation"; }

        // Operators & punctuation
        if (operators.has(stream.peek())) { stream.next(); return "operator"; }

        stream.next();
        return null;
      }
    };
  });

  CodeMirror.defineMIME("text/x-abap", "abap");

  // the word lists are shared with the suggestions in abap-complete.js
  CodeMirror.abapWords = { keywords, builtins };

})(CodeMirror);


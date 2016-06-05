/* Copyright (c) 2014 Synology Inc. All rights reserved. */

ace.define("ace/mode/lucene",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/lucene_highlight_rules"],function(d,b,e){var g=d("../lib/oop");var a=d("./text").Mode;var c=d("../tokenizer").Tokenizer;var h=d("./lucene_highlight_rules").LuceneHighlightRules;var f=function(){this.$tokenizer=new c(new h().getRules())};g.inherits(f,a);b.Mode=f});ace.define("ace/mode/lucene_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules"],function(c,b,d){var e=c("../lib/oop");var g=c("../lib/lang");var a=c("./text_highlight_rules").TextHighlightRules;var f=function(){this.$rules={start:[{token:"constant.character.negation",regex:"[\\-]"},{token:"constant.character.interro",regex:"[\\?]"},{token:"constant.character.asterisk",regex:"[\\*]"},{token:"constant.character.proximity",regex:"~[0-9]+\\b"},{token:"keyword.operator",regex:"(?:AND|OR|NOT)\\b"},{token:"paren.lparen",regex:"[\\(]"},{token:"paren.rparen",regex:"[\\)]"},{token:"keyword",regex:"[\\S]+:"},{token:"string",regex:'".*?"'},{token:"text",regex:"\\s+"}]}};e.inherits(f,a);b.LuceneHighlightRules=f});
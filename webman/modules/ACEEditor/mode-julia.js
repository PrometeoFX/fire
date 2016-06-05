/* Copyright (c) 2014 Synology Inc. All rights reserved. */

ace.define("ace/mode/julia",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/julia_highlight_rules","ace/mode/folding/cstyle"],function(c,e,b){var f=c("../lib/oop");var d=c("./text").Mode;var h=c("../tokenizer").Tokenizer;var g=c("./julia_highlight_rules").JuliaHighlightRules;var a=c("./folding/cstyle").FoldMode;var i=function(){this.HighlightRules=g;this.foldingRules=new a()};f.inherits(i,d);(function(){this.lineCommentStart="#";this.blockComment="";this.$id="ace/mode/julia"}).call(i.prototype);e.Mode=i});ace.define("ace/mode/julia_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(c,b,d){var e=c("../lib/oop");var a=c("./text_highlight_rules").TextHighlightRules;var f=function(){this.$rules={start:[{include:"#function_decl"},{include:"#function_call"},{include:"#type_decl"},{include:"#keyword"},{include:"#operator"},{include:"#number"},{include:"#string"},{include:"#comment"}],"#bracket":[{token:"keyword.bracket.julia",regex:"\\(|\\)|\\[|\\]|\\{|\\}|,"}],"#comment":[{token:["punctuation.definition.comment.julia","comment.line.number-sign.julia"],regex:"(#)(?!\\{)(.*$)"}],"#function_call":[{token:["support.function.julia","text"],regex:"([a-zA-Z0-9_]+!?)(\\w*\\()"}],"#function_decl":[{token:["keyword.other.julia","meta.function.julia","entity.name.function.julia","meta.function.julia","text"],regex:"(function|macro)(\\s*)([a-zA-Z0-9_\\{]+!?)(\\w*)([(\\\\{])"}],"#keyword":[{token:"keyword.other.julia",regex:"\\b(?:function|type|immutable|macro|quote|abstract|bitstype|typealias|module|baremodule|new)\\b"},{token:"keyword.control.julia",regex:"\\b(?:if|else|elseif|while|for|in|begin|let|end|do|try|catch|finally|return|break|continue)\\b"},{token:"storage.modifier.variable.julia",regex:"\\b(?:global|local|const|export|import|importall|using)\\b"},{token:"variable.macro.julia",regex:"@\\w+\\b"}],"#number":[{token:"constant.numeric.julia",regex:"\\b0(?:x|X)[0-9a-fA-F]*|(?:\\b[0-9]+\\.?[0-9]*|\\.[0-9]+)(?:(?:e|E)(?:\\+|-)?[0-9]*)?(?:im)?|\\bInf(?:32)?\\b|\\bNaN(?:32)?\\b|\\btrue\\b|\\bfalse\\b"}],"#operator":[{token:"keyword.operator.update.julia",regex:"=|:=|\\+=|-=|\\*=|/=|//=|\\.//=|\\.\\*=|\\\\=|\\.\\\\=|^=|\\.^=|%=|\\|=|&=|\\$=|<<=|>>="},{token:"keyword.operator.ternary.julia",regex:"\\?|:"},{token:"keyword.operator.boolean.julia",regex:"\\|\\||&&|!"},{token:"keyword.operator.arrow.julia",regex:"->|<-|-->"},{token:"keyword.operator.relation.julia",regex:">|<|>=|<=|==|!=|\\.>|\\.<|\\.>=|\\.>=|\\.==|\\.!=|\\.=|\\.!|<:|:>"},{token:"keyword.operator.range.julia",regex:":"},{token:"keyword.operator.shift.julia",regex:"<<|>>"},{token:"keyword.operator.bitwise.julia",regex:"\\||\\&|~"},{token:"keyword.operator.arithmetic.julia",regex:"\\+|-|\\*|\\.\\*|/|\\./|//|\\.//|%|\\.%|\\\\|\\.\\\\|\\^|\\.\\^"},{token:"keyword.operator.isa.julia",regex:"::"},{token:"keyword.operator.dots.julia",regex:"\\.(?=[a-zA-Z])|\\.\\.+"},{token:"keyword.operator.interpolation.julia",regex:"\\$#?(?=.)"},{token:["variable","keyword.operator.transposed-variable.julia"],regex:"(\\w+)((?:'|\\.')*\\.?')"},{token:"text",regex:"\\[|\\("},{token:["text","keyword.operator.transposed-matrix.julia"],regex:"([\\]\\)])((?:'|\\.')*\\.?')"}],"#string":[{token:"punctuation.definition.string.begin.julia",regex:"'",push:[{token:"punctuation.definition.string.end.julia",regex:"'",next:"pop"},{include:"#string_escaped_char"},{defaultToken:"string.quoted.single.julia"}]},{token:"punctuation.definition.string.begin.julia",regex:'"',push:[{token:"punctuation.definition.string.end.julia",regex:'"',next:"pop"},{include:"#string_escaped_char"},{defaultToken:"string.quoted.double.julia"}]},{token:"punctuation.definition.string.begin.julia",regex:'\\b\\w+"',push:[{token:"punctuation.definition.string.end.julia",regex:'"\\w*',next:"pop"},{include:"#string_custom_escaped_char"},{defaultToken:"string.quoted.custom-double.julia"}]},{token:"punctuation.definition.string.begin.julia",regex:"`",push:[{token:"punctuation.definition.string.end.julia",regex:"`",next:"pop"},{include:"#string_escaped_char"},{defaultToken:"string.quoted.backtick.julia"}]}],"#string_custom_escaped_char":[{token:"constant.character.escape.julia",regex:'\\\\"'}],"#string_escaped_char":[{token:"constant.character.escape.julia",regex:"\\\\(?:\\\\|[0-3]\\d{,2}|[4-7]\\d?|x[a-fA-F0-9]{,2}|u[a-fA-F0-9]{,4}|U[a-fA-F0-9]{,8}|.)"}],"#type_decl":[{token:["keyword.control.type.julia","meta.type.julia","entity.name.type.julia","entity.other.inherited-class.julia","punctuation.separator.inheritance.julia","entity.other.inherited-class.julia"],regex:"(type|immutable)(\\s+)([a-zA-Z0-9_]+)(?:(\\s*)(<:)(\\s*[.a-zA-Z0-9_:]+))?"},{token:["other.typed-variable.julia","support.type.julia"],regex:"([a-zA-Z0-9_]+)(::[a-zA-Z0-9_{}]+)"}]};this.normalizeRules()};f.metaData={fileTypes:["jl"],firstLineMatch:"^#!.*\\bjulia\\s*$",foldingStartMarker:"^\\s*(?:if|while|for|begin|function|macro|module|baremodule|type|immutable|let)\\b(?!.*\\bend\\b).*$",foldingStopMarker:"^\\s*(?:end)\\b.*$",name:"Julia",scopeName:"source.julia"};e.inherits(f,a);b.JuliaHighlightRules=f});ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(b,a,c){var d=b("../../lib/oop");var f=b("../../range").Range;var g=b("./fold_mode").FoldMode;var e=a.FoldMode=function(h){if(h){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+h.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+h.end))}};d.inherits(e,g);(function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;this.getFoldWidgetRange=function(o,n,p,m){var h=o.getLine(p);var k=h.match(this.foldingStartMarker);if(k){var l=k.index;if(k[1]){return this.openingBracketBlock(o,k[1],p,l)}var j=o.getCommentFoldRange(p,l+k[0].length,1);if(j&&!j.isMultiLine()){if(m){j=this.getSectionRange(o,p)}else{if(n!="all"){j=null}}}return j}if(n==="markbegin"){return}var k=h.match(this.foldingStopMarker);if(k){var l=k.index+k[0].length;if(k[1]){return this.closingBracketBlock(o,k[1],p,l)}return o.getCommentFoldRange(p,l,-1)}};this.getSectionRange=function(m,p){var q=m.getLine(p);var i=q.search(/\S/);var o=p;var k=q.length;p=p+1;var l=p;var n=m.getLength();while(++p<n){q=m.getLine(p);var h=q.search(/\S/);if(h===-1){continue}if(i>h){break}var j=this.getFoldWidgetRange(m,"all",p);if(j){if(j.start.row<=o){break}else{if(j.isMultiLine()){p=j.end.row}else{if(i==h){break}}}}l=p}return new f(o,k,l,m.getLine(l).length)}}).call(e.prototype)});
/* Copyright (c) 2014 Synology Inc. All rights reserved. */

ace.define("ace/mode/glsl",["require","exports","module","ace/lib/oop","ace/mode/c_cpp","ace/tokenizer","ace/mode/glsl_highlight_rules","ace/mode/matching_brace_outdent","ace/range","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(d,e,b){var f=d("../lib/oop");var a=d("./c_cpp").Mode;var g=d("../tokenizer").Tokenizer;var k=d("./glsl_highlight_rules").glslHighlightRules;var i=d("./matching_brace_outdent").MatchingBraceOutdent;var c=d("../range").Range;var j=d("./behaviour/cstyle").CstyleBehaviour;var l=d("./folding/cstyle").FoldMode;var h=function(){this.HighlightRules=k;this.$outdent=new i();this.$behaviour=new j();this.foldingRules=new l()};f.inherits(h,a);e.Mode=h});ace.define("ace/mode/c_cpp",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/c_cpp_highlight_rules","ace/mode/matching_brace_outdent","ace/range","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(d,f,b){var g=d("../lib/oop");var e=d("./text").Mode;var h=d("../tokenizer").Tokenizer;var a=d("./c_cpp_highlight_rules").c_cppHighlightRules;var j=d("./matching_brace_outdent").MatchingBraceOutdent;var c=d("../range").Range;var k=d("./behaviour/cstyle").CstyleBehaviour;var l=d("./folding/cstyle").FoldMode;var i=function(){this.HighlightRules=a;this.$outdent=new j();this.$behaviour=new k();this.foldingRules=new l()};g.inherits(i,e);(function(){this.lineCommentStart="//";this.blockComment={start:"/*",end:"*/"};this.getNextLineIndent=function(s,o,q){var n=this.$getIndent(o);var r=this.getTokenizer().getLineTokens(o,s);var t=r.tokens;var m=r.state;if(t.length&&t[t.length-1].type=="comment"){return n}if(s=="start"){var p=o.match(/^.*[\{\(\[]\s*$/);if(p){n+=q}}else{if(s=="doc-start"){if(m=="start"){return""}var p=o.match(/^\s*(\/?)\*/);if(p){if(p[1]){n+=" "}n+="* "}}}return n};this.checkOutdent=function(o,m,n){return this.$outdent.checkOutdent(m,n)};this.autoOutdent=function(m,n,o){this.$outdent.autoOutdent(n,o)};this.$id="ace/mode/c_cpp"}).call(i.prototype);f.Mode=i});ace.define("ace/mode/c_cpp_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],function(d,c,f){var g=d("../lib/oop");var e=d("./doc_comment_highlight_rules").DocCommentHighlightRules;var b=d("./text_highlight_rules").TextHighlightRules;var a=c.cFunctions="\\s*\\bhypot(?:f|l)?|s(?:scanf|ystem|nprintf|ca(?:nf|lb(?:n(?:f|l)?|ln(?:f|l)?))|i(?:n(?:h(?:f|l)?|f|l)?|gn(?:al|bit))|tr(?:s(?:tr|pn)|nc(?:py|at|mp)|c(?:spn|hr|oll|py|at|mp)|to(?:imax|d|u(?:l(?:l)?|max)|k|f|l(?:d|l)?)|error|pbrk|ftime|len|rchr|xfrm)|printf|et(?:jmp|vbuf|locale|buf)|qrt(?:f|l)?|w(?:scanf|printf)|rand)|n(?:e(?:arbyint(?:f|l)?|xt(?:toward(?:f|l)?|after(?:f|l)?))|an(?:f|l)?)|c(?:s(?:in(?:h(?:f|l)?|f|l)?|qrt(?:f|l)?)|cos(?:h(?:f)?|f|l)?|imag(?:f|l)?|t(?:ime|an(?:h(?:f|l)?|f|l)?)|o(?:s(?:h(?:f|l)?|f|l)?|nj(?:f|l)?|pysign(?:f|l)?)|p(?:ow(?:f|l)?|roj(?:f|l)?)|e(?:il(?:f|l)?|xp(?:f|l)?)|l(?:o(?:ck|g(?:f|l)?)|earerr)|a(?:sin(?:h(?:f|l)?|f|l)?|cos(?:h(?:f|l)?|f|l)?|tan(?:h(?:f|l)?|f|l)?|lloc|rg(?:f|l)?|bs(?:f|l)?)|real(?:f|l)?|brt(?:f|l)?)|t(?:ime|o(?:upper|lower)|an(?:h(?:f|l)?|f|l)?|runc(?:f|l)?|gamma(?:f|l)?|mp(?:nam|file))|i(?:s(?:space|n(?:ormal|an)|cntrl|inf|digit|u(?:nordered|pper)|p(?:unct|rint)|finite|w(?:space|c(?:ntrl|type)|digit|upper|p(?:unct|rint)|lower|al(?:num|pha)|graph|xdigit|blank)|l(?:ower|ess(?:equal|greater)?)|al(?:num|pha)|gr(?:eater(?:equal)?|aph)|xdigit|blank)|logb(?:f|l)?|max(?:div|abs))|di(?:v|fftime)|_Exit|unget(?:c|wc)|p(?:ow(?:f|l)?|ut(?:s|c(?:har)?|wc(?:har)?)|error|rintf)|e(?:rf(?:c(?:f|l)?|f|l)?|x(?:it|p(?:2(?:f|l)?|f|l|m1(?:f|l)?)?))|v(?:s(?:scanf|nprintf|canf|printf|w(?:scanf|printf))|printf|f(?:scanf|printf|w(?:scanf|printf))|w(?:scanf|printf)|a_(?:start|copy|end|arg))|qsort|f(?:s(?:canf|e(?:tpos|ek))|close|tell|open|dim(?:f|l)?|p(?:classify|ut(?:s|c|w(?:s|c))|rintf)|e(?:holdexcept|set(?:e(?:nv|xceptflag)|round)|clearexcept|testexcept|of|updateenv|r(?:aiseexcept|ror)|get(?:e(?:nv|xceptflag)|round))|flush|w(?:scanf|ide|printf|rite)|loor(?:f|l)?|abs(?:f|l)?|get(?:s|c|pos|w(?:s|c))|re(?:open|e|ad|xp(?:f|l)?)|m(?:in(?:f|l)?|od(?:f|l)?|a(?:f|l|x(?:f|l)?)?))|l(?:d(?:iv|exp(?:f|l)?)|o(?:ngjmp|cal(?:time|econv)|g(?:1(?:p(?:f|l)?|0(?:f|l)?)|2(?:f|l)?|f|l|b(?:f|l)?)?)|abs|l(?:div|abs|r(?:int(?:f|l)?|ound(?:f|l)?))|r(?:int(?:f|l)?|ound(?:f|l)?)|gamma(?:f|l)?)|w(?:scanf|c(?:s(?:s(?:tr|pn)|nc(?:py|at|mp)|c(?:spn|hr|oll|py|at|mp)|to(?:imax|d|u(?:l(?:l)?|max)|k|f|l(?:d|l)?|mbs)|pbrk|ftime|len|r(?:chr|tombs)|xfrm)|to(?:b|mb)|rtomb)|printf|mem(?:set|c(?:hr|py|mp)|move))|a(?:s(?:sert|ctime|in(?:h(?:f|l)?|f|l)?)|cos(?:h(?:f|l)?|f|l)?|t(?:o(?:i|f|l(?:l)?)|exit|an(?:h(?:f|l)?|2(?:f|l)?|f|l)?)|b(?:s|ort))|g(?:et(?:s|c(?:har)?|env|wc(?:har)?)|mtime)|r(?:int(?:f|l)?|ound(?:f|l)?|e(?:name|alloc|wind|m(?:ove|quo(?:f|l)?|ainder(?:f|l)?))|a(?:nd|ise))|b(?:search|towc)|m(?:odf(?:f|l)?|em(?:set|c(?:hr|py|mp)|move)|ktime|alloc|b(?:s(?:init|towcs|rtowcs)|towc|len|r(?:towc|len)))\\b";var h=function(){var l=("break|case|continue|default|do|else|for|goto|if|_Pragma|return|switch|while|catch|operator|try|throw|using");var m=("asm|__asm__|auto|bool|_Bool|char|_Complex|double|enum|float|_Imaginary|int|long|short|signed|struct|typedef|union|unsigned|void|class|wchar_t|template");var n=("const|extern|register|restrict|static|volatile|inline|private:|protected:|public:|friend|explicit|virtual|export|mutable|typename");var o=("and|and_eq|bitand|bitor|compl|not|not_eq|or|or_eq|typeid|xor|xor_eqconst_cast|dynamic_cast|reinterpret_cast|static_cast|sizeof|namespace");var j=("NULL|true|false|TRUE|FALSE");var k=this.$keywords=this.createKeywordMapper({"keyword.control":l,"storage.type":m,"storage.modifier":n,"keyword.operator":o,"variable.language":"this","constant.language":j},"identifier");var i="[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\d\\$_\u00a1-\uffff]*\\b";this.$rules={start:[{token:"comment",regex:"\\/\\/.*$"},e.getStartRule("doc-start"),{token:"comment",regex:"\\/\\*",next:"comment"},{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:'["].*\\\\$',next:"qqstring"},{token:"string",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:"string",regex:"['].*\\\\$",next:"qstring"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"},{token:"keyword",regex:"#\\s*(?:include|import|pragma|line|define|undef|if|ifdef|else|elif|ifndef)\\b",next:"directive"},{token:"keyword",regex:"(?:#\\s*endif)\\b"},{token:"support.function.C99.c",regex:a},{token:k,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|new|delete|typeof|void)"},{token:"punctuation.operator",regex:"\\?|\\:|\\,|\\;|\\."},{token:"paren.lparen",regex:"[[({]"},{token:"paren.rparen",regex:"[\\])}]"},{token:"text",regex:"\\s+"}],comment:[{token:"comment",regex:".*?\\*\\/",next:"start"},{token:"comment",regex:".+"}],qqstring:[{token:"string",regex:'(?:(?:\\\\.)|(?:[^"\\\\]))*?"',next:"start"},{token:"string",regex:".+"}],qstring:[{token:"string",regex:"(?:(?:\\\\.)|(?:[^'\\\\]))*?'",next:"start"},{token:"string",regex:".+"}],directive:[{token:"constant.other.multiline",regex:/\\/},{token:"constant.other.multiline",regex:/.*\\/},{token:"constant.other",regex:"\\s*<.+?>",next:"start"},{token:"constant.other",regex:'\\s*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',next:"start"},{token:"constant.other",regex:"\\s*['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",next:"start"},{token:"constant.other",regex:/[^\\\/]+/,next:"start"}]};this.embedRules(e,"doc-",[e.getEndRule("start")])};g.inherits(h,b);c.c_cppHighlightRules=h});ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(c,b,e){var f=c("../lib/oop");var a=c("./text_highlight_rules").TextHighlightRules;var d=function(){this.$rules={start:[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},{token:"comment.doc.tag",regex:"\\bTODO\\b"},{defaultToken:"comment.doc"}]}};f.inherits(d,a);d.getStartRule=function(g){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:g}};d.getEndRule=function(g){return{token:"comment.doc",regex:"\\*\\/",next:g}};b.DocCommentHighlightRules=d});ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(c,b,d){var e=c("../range").Range;var a=function(){};(function(){this.checkOutdent=function(f,g){if(!/^\s+$/.test(f)){return false}return/^\s*\}/.test(g)};this.autoOutdent=function(k,l){var g=k.getLine(l);var h=g.match(/^(\s*\})/);if(!h){return 0}var i=h[1].length;var j=k.findMatchingBracket({row:l,column:i});if(!j||j.row==l){return 0}var f=this.$getIndent(k.getLine(j.row));k.replace(new e(l,0,l,i-1),f)};this.$getIndent=function(f){return f.match(/^\s*/)[0]}}).call(a.prototype);b.MatchingBraceOutdent=a});ace.define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"],function(e,h,c){var k=e("../../lib/oop");var f=e("../behaviour").Behaviour;var n=e("../../token_iterator").TokenIterator;var b=e("../../lib/lang");var j=["text","paren.rparen","punctuation.operator"];var d=["text","paren.rparen","punctuation.operator","comment"];var m=0;var a=-1;var o="";var g=0;var i=-1;var l="";var p="";var q=function(){q.isSaneInsertion=function(t,u){var v=t.getCursorPosition();var s=new n(u,v.row,v.column);if(!this.$matchTokenType(s.getCurrentToken()||"text",j)){var r=new n(u,v.row,v.column+1);if(!this.$matchTokenType(r.getCurrentToken()||"text",j)){return false}}s.stepForward();return s.getCurrentTokenRow()!==v.row||this.$matchTokenType(s.getCurrentToken()||"text",d)};q.$matchTokenType=function(s,r){return r.indexOf(s.type||s)>-1};q.recordAutoInsert=function(s,t,v){var u=s.getCursorPosition();var r=t.doc.getLine(u.row);if(!this.isAutoInsertedClosing(u,r,o[0])){m=0}a=u.row;o=v+r.substr(u.column);m++};q.recordMaybeInsert=function(s,t,v){var u=s.getCursorPosition();var r=t.doc.getLine(u.row);if(!this.isMaybeInsertedClosing(u,r)){g=0}i=u.row;l=r.substr(0,u.column)+v;p=r.substr(u.column);g++};q.isAutoInsertedClosing=function(t,r,s){return m>0&&t.row===a&&s===o[0]&&r.substr(t.column)===o};q.isMaybeInsertedClosing=function(s,r){return g>0&&s.row===i&&r.substr(s.column)===p&&r.substr(0,s.column)==l};q.popAutoInsertedClosing=function(){o=o.substr(1);m--};q.clearMaybeInsertedClosing=function(){g=0;i=-1};this.add("braces","insertion",function(s,v,y,B,D){var E=y.getCursorPosition();var F=B.doc.getLine(E.row);if(D=="{"){var C=y.getSelectionRange();var w=B.doc.getTextRange(C);if(w!==""&&w!=="{"&&y.getWrapBehavioursEnabled()){return{text:"{"+w+"}",selection:false}}else{if(q.isSaneInsertion(y,B)){if(/[\]\}\)]/.test(F[E.column])||y.inMultiSelectMode){q.recordAutoInsert(y,B,"}");return{text:"{}",selection:[1,1]}}else{q.recordMaybeInsert(y,B,"{");return{text:"{",selection:[1,1]}}}}}else{if(D=="}"){var z=F.substring(E.column,E.column+1);if(z=="}"){var r=B.$findOpeningBracket("}",{column:E.column+1,row:E.row});if(r!==null&&q.isAutoInsertedClosing(E,F,D)){q.popAutoInsertedClosing();return{text:"",selection:[1,1]}}}}else{if(D=="\n"||D=="\r\n"){var u="";if(q.isMaybeInsertedClosing(E,F)){u=b.stringRepeat("}",g);q.clearMaybeInsertedClosing()}var z=F.substring(E.column,E.column+1);if(z==="}"){var A=B.findMatchingBracket({row:E.row,column:E.column+1},"}");if(!A){return null}var x=this.$getIndent(B.getLine(A.row))}else{if(u){var x=this.$getIndent(F)}else{return}}var t=x+B.getTabString();return{text:"\n"+t+"\n"+x+u,selection:[1,t.length,1,t.length]}}else{q.clearMaybeInsertedClosing()}}}});this.add("braces","deletion",function(w,v,u,x,s){var t=x.doc.getTextRange(s);if(!s.isMultiLine()&&t=="{"){var r=x.doc.getLine(s.start.row);var y=r.substring(s.end.column,s.end.column+1);if(y=="}"){s.end.column++;return s}else{g--}}});this.add("parens","insertion",function(s,t,v,x,z){if(z=="("){var y=v.getSelectionRange();var u=x.doc.getTextRange(y);if(u!==""&&v.getWrapBehavioursEnabled()){return{text:"("+u+")",selection:false}}else{if(q.isSaneInsertion(v,x)){q.recordAutoInsert(v,x,")");return{text:"()",selection:[1,1]}}}}else{if(z==")"){var A=v.getCursorPosition();var B=x.doc.getLine(A.row);var w=B.substring(A.column,A.column+1);if(w==")"){var r=x.$findOpeningBracket(")",{column:A.column+1,row:A.row});if(r!==null&&q.isAutoInsertedClosing(A,B,z)){q.popAutoInsertedClosing();return{text:"",selection:[1,1]}}}}}});this.add("parens","deletion",function(w,v,u,x,s){var t=x.doc.getTextRange(s);if(!s.isMultiLine()&&t=="("){var r=x.doc.getLine(s.start.row);var y=r.substring(s.start.column+1,s.start.column+2);if(y==")"){s.end.column++;return s}}});this.add("brackets","insertion",function(s,t,v,x,z){if(z=="["){var y=v.getSelectionRange();var u=x.doc.getTextRange(y);if(u!==""&&v.getWrapBehavioursEnabled()){return{text:"["+u+"]",selection:false}}else{if(q.isSaneInsertion(v,x)){q.recordAutoInsert(v,x,"]");return{text:"[]",selection:[1,1]}}}}else{if(z=="]"){var A=v.getCursorPosition();var B=x.doc.getLine(A.row);var w=B.substring(A.column,A.column+1);if(w=="]"){var r=x.$findOpeningBracket("]",{column:A.column+1,row:A.row});if(r!==null&&q.isAutoInsertedClosing(A,B,z)){q.popAutoInsertedClosing();return{text:"",selection:[1,1]}}}}}});this.add("brackets","deletion",function(w,v,u,x,s){var t=x.doc.getTextRange(s);if(!s.isMultiLine()&&t=="["){var r=x.doc.getLine(s.start.row);var y=r.substring(s.start.column+1,s.start.column+2);if(y=="]"){s.end.column++;return s}}});this.add("string_dquotes","insertion",function(s,v,z,C,G){if(G=='"'||G=="'"){var r=G;var E=z.getSelectionRange();var w=C.doc.getTextRange(E);if(w!==""&&w!=="'"&&w!='"'&&z.getWrapBehavioursEnabled()){return{text:r+w+r,selection:false}}else{var F=z.getCursorPosition();var I=C.doc.getLine(F.row);var H=I.substring(F.column-1,F.column);if(H=="\\"){return null}var B=C.getTokens(E.start.row);var t=0,u;var y=-1;for(var D=0;D<B.length;D++){u=B[D];if(u.type=="string"){y=-1}else{if(y<0){y=u.value.indexOf(r)}}if((u.value.length+t)>E.start.column){break}t+=B[D].value.length}if(!u||(y<0&&u.type!=="comment"&&(u.type!=="string"||((E.start.column!==u.value.length+t-1)&&u.value.lastIndexOf(r)===u.value.length-1)))){if(!q.isSaneInsertion(z,C)){return}return{text:r+r,selection:[1,1]}}else{if(u&&u.type==="string"){var A=I.substring(F.column,F.column+1);if(A==r){return{text:"",selection:[1,1]}}}}}}});this.add("string_dquotes","deletion",function(w,v,u,x,s){var t=x.doc.getTextRange(s);if(!s.isMultiLine()&&(t=='"'||t=="'")){var r=x.doc.getLine(s.start.row);var y=r.substring(s.start.column+1,s.start.column+2);if(y==t){s.end.column++;return s}}})};k.inherits(q,f);h.CstyleBehaviour=q});ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(b,a,c){var d=b("../../lib/oop");var f=b("../../range").Range;var g=b("./fold_mode").FoldMode;var e=a.FoldMode=function(h){if(h){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+h.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+h.end))}};d.inherits(e,g);(function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;this.getFoldWidgetRange=function(o,n,p,m){var h=o.getLine(p);var k=h.match(this.foldingStartMarker);if(k){var l=k.index;if(k[1]){return this.openingBracketBlock(o,k[1],p,l)}var j=o.getCommentFoldRange(p,l+k[0].length,1);if(j&&!j.isMultiLine()){if(m){j=this.getSectionRange(o,p)}else{if(n!="all"){j=null}}}return j}if(n==="markbegin"){return}var k=h.match(this.foldingStopMarker);if(k){var l=k.index+k[0].length;if(k[1]){return this.closingBracketBlock(o,k[1],p,l)}return o.getCommentFoldRange(p,l,-1)}};this.getSectionRange=function(m,p){var q=m.getLine(p);var i=q.search(/\S/);var o=p;var k=q.length;p=p+1;var l=p;var n=m.getLength();while(++p<n){q=m.getLine(p);var h=q.search(/\S/);if(h===-1){continue}if(i>h){break}var j=this.getFoldWidgetRange(m,"all",p);if(j){if(j.start.row<=o){break}else{if(j.isMultiLine()){p=j.end.row}else{if(i==h){break}}}}l=p}return new f(o,k,l,m.getLine(l).length)}}).call(e.prototype)});ace.define("ace/mode/glsl_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/c_cpp_highlight_rules"],function(c,b,d){var e=c("../lib/oop");var f=c("./c_cpp_highlight_rules").c_cppHighlightRules;var a=function(){var i=("attribute|const|uniform|varying|break|continue|do|for|while|if|else|in|out|inout|float|int|void|bool|true|false|lowp|mediump|highp|precision|invariant|discard|return|mat2|mat3|mat4|vec2|vec3|vec4|ivec2|ivec3|ivec4|bvec2|bvec3|bvec4|sampler2D|samplerCube|struct");var g=("radians|degrees|sin|cos|tan|asin|acos|atan|pow|exp|log|exp2|log2|sqrt|inversesqrt|abs|sign|floor|ceil|fract|mod|min|max|clamp|mix|step|smoothstep|length|distance|dot|cross|normalize|faceforward|reflect|refract|matrixCompMult|lessThan|lessThanEqual|greaterThan|greaterThanEqual|equal|notEqual|any|all|not|dFdx|dFdy|fwidth|texture2D|texture2DProj|texture2DLod|texture2DProjLod|textureCube|textureCubeLod|gl_MaxVertexAttribs|gl_MaxVertexUniformVectors|gl_MaxVaryingVectors|gl_MaxVertexTextureImageUnits|gl_MaxCombinedTextureImageUnits|gl_MaxTextureImageUnits|gl_MaxFragmentUniformVectors|gl_MaxDrawBuffers|gl_DepthRangeParameters|gl_DepthRange|gl_Position|gl_PointSize|gl_FragCoord|gl_FrontFacing|gl_PointCoord|gl_FragColor|gl_FragData");var h=this.createKeywordMapper({"variable.language":"this",keyword:i,"constant.language":g},"identifier");this.$rules=new f().$rules;this.$rules.start.forEach(function(j){if(typeof j.token=="function"){j.token=h}})};e.inherits(a,f);b.glslHighlightRules=a});
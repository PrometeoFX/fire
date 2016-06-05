/* Copyright (c) 2014 Synology Inc. All rights reserved. */

ace.define("ace/mode/jsx",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/jsx_highlight_rules","ace/mode/matching_brace_outdent","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(c,e,b){var f=c("../lib/oop");var d=c("./text").Mode;var g=c("../tokenizer").Tokenizer;var a=c("./jsx_highlight_rules").JsxHighlightRules;var i=c("./matching_brace_outdent").MatchingBraceOutdent;var j=c("./behaviour/cstyle").CstyleBehaviour;var k=c("./folding/cstyle").FoldMode;function h(){this.HighlightRules=a;this.$outdent=new i();this.$behaviour=new j();this.foldingRules=new k()}f.inherits(h,d);(function(){this.lineCommentStart="//";this.blockComment={start:"/*",end:"*/"};this.getNextLineIndent=function(q,m,o){var l=this.$getIndent(m);var p=this.getTokenizer().getLineTokens(m,q);var r=p.tokens;if(r.length&&r[r.length-1].type=="comment"){return l}if(q=="start"){var n=m.match(/^.*[\{\(\[]\s*$/);if(n){l+=o}}return l};this.checkOutdent=function(n,l,m){return this.$outdent.checkOutdent(l,m)};this.autoOutdent=function(l,m,n){this.$outdent.autoOutdent(m,n)};this.$id="ace/mode/jsx"}).call(h.prototype);e.Mode=h});ace.define("ace/mode/jsx_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],function(c,b,e){var g=c("../lib/oop");var h=c("../lib/lang");var d=c("./doc_comment_highlight_rules").DocCommentHighlightRules;var a=c("./text_highlight_rules").TextHighlightRules;var f=function(){var l=h.arrayToMap(("break|do|instanceof|typeof|case|else|new|var|catch|finally|return|void|continue|for|switch|default|while|function|this|if|throw|delete|in|try|class|extends|super|import|from|into|implements|interface|static|mixin|override|abstract|final|number|int|string|boolean|variant|log|assert").split("|"));var k=h.arrayToMap(("null|true|false|NaN|Infinity|__FILE__|__LINE__|undefined").split("|"));var j=h.arrayToMap(("debugger|with|const|export|let|private|public|yield|protected|extern|native|as|operator|__fake__|__readonly__").split("|"));var i="[a-zA-Z_][a-zA-Z0-9_]*\\b";this.$rules={start:[{token:"comment",regex:"\\/\\/.*$"},d.getStartRule("doc-start"),{token:"comment",regex:"\\/\\*",next:"comment"},{token:"string.regexp",regex:"[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"},{token:"string",regex:'["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'},{token:"string",regex:"['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"},{token:"constant.numeric",regex:"0[xX][0-9a-fA-F]+\\b"},{token:"constant.numeric",regex:"[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"},{token:"constant.language.boolean",regex:"(?:true|false)\\b"},{token:["storage.type","text","entity.name.function"],regex:"(function)(\\s+)("+i+")"},{token:function(m){if(m=="this"){return"variable.language"}else{if(m=="function"){return"storage.type"}else{if(l.hasOwnProperty(m)||j.hasOwnProperty(m)){return"keyword"}else{if(k.hasOwnProperty(m)){return"constant.language"}else{if(/^_?[A-Z][a-zA-Z0-9_]*$/.test(m)){return"language.support.class"}else{return"identifier"}}}}}},regex:i},{token:"keyword.operator",regex:"!|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"},{token:"punctuation.operator",regex:"\\?|\\:|\\,|\\;|\\."},{token:"paren.lparen",regex:"[[({<]"},{token:"paren.rparen",regex:"[\\])}>]"},{token:"text",regex:"\\s+"}],comment:[{token:"comment",regex:".*?\\*\\/",next:"start"},{token:"comment",regex:".+"}]};this.embedRules(d,"doc-",[d.getEndRule("start")])};g.inherits(f,a);b.JsxHighlightRules=f});ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(c,b,e){var f=c("../lib/oop");var a=c("./text_highlight_rules").TextHighlightRules;var d=function(){this.$rules={start:[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},{token:"comment.doc.tag",regex:"\\bTODO\\b"},{defaultToken:"comment.doc"}]}};f.inherits(d,a);d.getStartRule=function(g){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:g}};d.getEndRule=function(g){return{token:"comment.doc",regex:"\\*\\/",next:g}};b.DocCommentHighlightRules=d});ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(c,b,d){var e=c("../range").Range;var a=function(){};(function(){this.checkOutdent=function(f,g){if(!/^\s+$/.test(f)){return false}return/^\s*\}/.test(g)};this.autoOutdent=function(k,l){var g=k.getLine(l);var h=g.match(/^(\s*\})/);if(!h){return 0}var i=h[1].length;var j=k.findMatchingBracket({row:l,column:i});if(!j||j.row==l){return 0}var f=this.$getIndent(k.getLine(j.row));k.replace(new e(l,0,l,i-1),f)};this.$getIndent=function(f){return f.match(/^\s*/)[0]}}).call(a.prototype);b.MatchingBraceOutdent=a});ace.define("ace/mode/behaviour/cstyle",["require","exports","module","ace/lib/oop","ace/mode/behaviour","ace/token_iterator","ace/lib/lang"],function(e,h,c){var k=e("../../lib/oop");var f=e("../behaviour").Behaviour;var n=e("../../token_iterator").TokenIterator;var b=e("../../lib/lang");var j=["text","paren.rparen","punctuation.operator"];var d=["text","paren.rparen","punctuation.operator","comment"];var m=0;var a=-1;var o="";var g=0;var i=-1;var l="";var p="";var q=function(){q.isSaneInsertion=function(t,u){var v=t.getCursorPosition();var s=new n(u,v.row,v.column);if(!this.$matchTokenType(s.getCurrentToken()||"text",j)){var r=new n(u,v.row,v.column+1);if(!this.$matchTokenType(r.getCurrentToken()||"text",j)){return false}}s.stepForward();return s.getCurrentTokenRow()!==v.row||this.$matchTokenType(s.getCurrentToken()||"text",d)};q.$matchTokenType=function(s,r){return r.indexOf(s.type||s)>-1};q.recordAutoInsert=function(s,t,v){var u=s.getCursorPosition();var r=t.doc.getLine(u.row);if(!this.isAutoInsertedClosing(u,r,o[0])){m=0}a=u.row;o=v+r.substr(u.column);m++};q.recordMaybeInsert=function(s,t,v){var u=s.getCursorPosition();var r=t.doc.getLine(u.row);if(!this.isMaybeInsertedClosing(u,r)){g=0}i=u.row;l=r.substr(0,u.column)+v;p=r.substr(u.column);g++};q.isAutoInsertedClosing=function(t,r,s){return m>0&&t.row===a&&s===o[0]&&r.substr(t.column)===o};q.isMaybeInsertedClosing=function(s,r){return g>0&&s.row===i&&r.substr(s.column)===p&&r.substr(0,s.column)==l};q.popAutoInsertedClosing=function(){o=o.substr(1);m--};q.clearMaybeInsertedClosing=function(){g=0;i=-1};this.add("braces","insertion",function(s,v,y,B,D){var E=y.getCursorPosition();var F=B.doc.getLine(E.row);if(D=="{"){var C=y.getSelectionRange();var w=B.doc.getTextRange(C);if(w!==""&&w!=="{"&&y.getWrapBehavioursEnabled()){return{text:"{"+w+"}",selection:false}}else{if(q.isSaneInsertion(y,B)){if(/[\]\}\)]/.test(F[E.column])||y.inMultiSelectMode){q.recordAutoInsert(y,B,"}");return{text:"{}",selection:[1,1]}}else{q.recordMaybeInsert(y,B,"{");return{text:"{",selection:[1,1]}}}}}else{if(D=="}"){var z=F.substring(E.column,E.column+1);if(z=="}"){var r=B.$findOpeningBracket("}",{column:E.column+1,row:E.row});if(r!==null&&q.isAutoInsertedClosing(E,F,D)){q.popAutoInsertedClosing();return{text:"",selection:[1,1]}}}}else{if(D=="\n"||D=="\r\n"){var u="";if(q.isMaybeInsertedClosing(E,F)){u=b.stringRepeat("}",g);q.clearMaybeInsertedClosing()}var z=F.substring(E.column,E.column+1);if(z==="}"){var A=B.findMatchingBracket({row:E.row,column:E.column+1},"}");if(!A){return null}var x=this.$getIndent(B.getLine(A.row))}else{if(u){var x=this.$getIndent(F)}else{return}}var t=x+B.getTabString();return{text:"\n"+t+"\n"+x+u,selection:[1,t.length,1,t.length]}}else{q.clearMaybeInsertedClosing()}}}});this.add("braces","deletion",function(w,v,u,x,s){var t=x.doc.getTextRange(s);if(!s.isMultiLine()&&t=="{"){var r=x.doc.getLine(s.start.row);var y=r.substring(s.end.column,s.end.column+1);if(y=="}"){s.end.column++;return s}else{g--}}});this.add("parens","insertion",function(s,t,v,x,z){if(z=="("){var y=v.getSelectionRange();var u=x.doc.getTextRange(y);if(u!==""&&v.getWrapBehavioursEnabled()){return{text:"("+u+")",selection:false}}else{if(q.isSaneInsertion(v,x)){q.recordAutoInsert(v,x,")");return{text:"()",selection:[1,1]}}}}else{if(z==")"){var A=v.getCursorPosition();var B=x.doc.getLine(A.row);var w=B.substring(A.column,A.column+1);if(w==")"){var r=x.$findOpeningBracket(")",{column:A.column+1,row:A.row});if(r!==null&&q.isAutoInsertedClosing(A,B,z)){q.popAutoInsertedClosing();return{text:"",selection:[1,1]}}}}}});this.add("parens","deletion",function(w,v,u,x,s){var t=x.doc.getTextRange(s);if(!s.isMultiLine()&&t=="("){var r=x.doc.getLine(s.start.row);var y=r.substring(s.start.column+1,s.start.column+2);if(y==")"){s.end.column++;return s}}});this.add("brackets","insertion",function(s,t,v,x,z){if(z=="["){var y=v.getSelectionRange();var u=x.doc.getTextRange(y);if(u!==""&&v.getWrapBehavioursEnabled()){return{text:"["+u+"]",selection:false}}else{if(q.isSaneInsertion(v,x)){q.recordAutoInsert(v,x,"]");return{text:"[]",selection:[1,1]}}}}else{if(z=="]"){var A=v.getCursorPosition();var B=x.doc.getLine(A.row);var w=B.substring(A.column,A.column+1);if(w=="]"){var r=x.$findOpeningBracket("]",{column:A.column+1,row:A.row});if(r!==null&&q.isAutoInsertedClosing(A,B,z)){q.popAutoInsertedClosing();return{text:"",selection:[1,1]}}}}}});this.add("brackets","deletion",function(w,v,u,x,s){var t=x.doc.getTextRange(s);if(!s.isMultiLine()&&t=="["){var r=x.doc.getLine(s.start.row);var y=r.substring(s.start.column+1,s.start.column+2);if(y=="]"){s.end.column++;return s}}});this.add("string_dquotes","insertion",function(s,v,z,C,G){if(G=='"'||G=="'"){var r=G;var E=z.getSelectionRange();var w=C.doc.getTextRange(E);if(w!==""&&w!=="'"&&w!='"'&&z.getWrapBehavioursEnabled()){return{text:r+w+r,selection:false}}else{var F=z.getCursorPosition();var I=C.doc.getLine(F.row);var H=I.substring(F.column-1,F.column);if(H=="\\"){return null}var B=C.getTokens(E.start.row);var t=0,u;var y=-1;for(var D=0;D<B.length;D++){u=B[D];if(u.type=="string"){y=-1}else{if(y<0){y=u.value.indexOf(r)}}if((u.value.length+t)>E.start.column){break}t+=B[D].value.length}if(!u||(y<0&&u.type!=="comment"&&(u.type!=="string"||((E.start.column!==u.value.length+t-1)&&u.value.lastIndexOf(r)===u.value.length-1)))){if(!q.isSaneInsertion(z,C)){return}return{text:r+r,selection:[1,1]}}else{if(u&&u.type==="string"){var A=I.substring(F.column,F.column+1);if(A==r){return{text:"",selection:[1,1]}}}}}}});this.add("string_dquotes","deletion",function(w,v,u,x,s){var t=x.doc.getTextRange(s);if(!s.isMultiLine()&&(t=='"'||t=="'")){var r=x.doc.getLine(s.start.row);var y=r.substring(s.start.column+1,s.start.column+2);if(y==t){s.end.column++;return s}}})};k.inherits(q,f);h.CstyleBehaviour=q});ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(b,a,c){var d=b("../../lib/oop");var f=b("../../range").Range;var g=b("./fold_mode").FoldMode;var e=a.FoldMode=function(h){if(h){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+h.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+h.end))}};d.inherits(e,g);(function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;this.getFoldWidgetRange=function(o,n,p,m){var h=o.getLine(p);var k=h.match(this.foldingStartMarker);if(k){var l=k.index;if(k[1]){return this.openingBracketBlock(o,k[1],p,l)}var j=o.getCommentFoldRange(p,l+k[0].length,1);if(j&&!j.isMultiLine()){if(m){j=this.getSectionRange(o,p)}else{if(n!="all"){j=null}}}return j}if(n==="markbegin"){return}var k=h.match(this.foldingStopMarker);if(k){var l=k.index+k[0].length;if(k[1]){return this.closingBracketBlock(o,k[1],p,l)}return o.getCommentFoldRange(p,l,-1)}};this.getSectionRange=function(m,p){var q=m.getLine(p);var i=q.search(/\S/);var o=p;var k=q.length;p=p+1;var l=p;var n=m.getLength();while(++p<n){q=m.getLine(p);var h=q.search(/\S/);if(h===-1){continue}if(i>h){break}var j=this.getFoldWidgetRange(m,"all",p);if(j){if(j.start.row<=o){break}else{if(j.isMultiLine()){p=j.end.row}else{if(i==h){break}}}}l=p}return new f(o,k,l,m.getLine(l).length)}}).call(e.prototype)});
/* Copyright (c) 2014 Synology Inc. All rights reserved. */

ace.define("ace/mode/lua",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/lua_highlight_rules","ace/mode/folding/lua","ace/range","ace/worker/worker_client"],function(f,h,c){var i=f("../lib/oop");var g=f("./text").Mode;var j=f("../tokenizer").Tokenizer;var b=f("./lua_highlight_rules").LuaHighlightRules;var d=f("./folding/lua").FoldMode;var e=f("../range").Range;var a=f("../worker/worker_client").WorkerClient;var k=function(){this.HighlightRules=b;this.foldingRules=new d()};i.inherits(k,g);(function(){this.lineCommentStart="--";this.blockComment={start:"--[",end:"]--"};var n={"function":1,then:1,"do":1,"else":1,elseif:1,repeat:1,end:-1,until:-1};var m=["else","elseif","end","until"];function l(q){var r=0;for(var p=0;p<q.length;p++){var o=q[p];if(o.type=="keyword"){if(o.value in n){r+=n[o.value]}}else{if(o.type=="paren.lparen"){r++}else{if(o.type=="paren.rparen"){r--}}}}if(r<0){return -1}else{if(r>0){return 1}else{return 0}}}this.getNextLineIndent=function(s,p,q){var o=this.$getIndent(p);var u=0;var r=this.getTokenizer().getLineTokens(p,s);var t=r.tokens;if(s=="start"){u=l(t)}if(u>0){return o+q}else{if(u<0&&o.substr(o.length-q.length)==q){if(!this.checkOutdent(s,p,"\n")){return o.substr(0,o.length-q.length)}}}return o};this.checkOutdent=function(q,o,p){if(p!="\n"&&p!="\r"&&p!="\r\n"){return false}if(o.match(/^\s*[\)\}\]]$/)){return true}var r=this.getTokenizer().getLineTokens(o.trim(),q).tokens;if(!r||!r.length){return false}return(r[0].type=="keyword"&&m.indexOf(r[0].value)!=-1)};this.autoOutdent=function(p,s,w){var t=s.getLine(w-1);var r=this.$getIndent(t).length;var o=this.getTokenizer().getLineTokens(t,"start").tokens;var q=s.getTabString().length;var v=r+q*l(o);var u=this.$getIndent(s.getLine(w)).length;if(u<v){return}s.outdentRows(new e(w,0,w+2,0))};this.createWorker=function(o){var p=new a(["ace"],"ace/mode/lua_worker","Worker");p.attachToDocument(o.getDocument());p.on("error",function(q){o.setAnnotations([q.data])});p.on("ok",function(q){o.clearAnnotations()});return p};this.$id="ace/mode/lua"}).call(k.prototype);h.Mode=k});ace.define("ace/mode/lua_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(c,b,e){var f=c("../lib/oop");var a=c("./text_highlight_rules").TextHighlightRules;var d=function(){var k=("break|do|else|elseif|end|for|function|if|in|local|repeat|return|then|until|while|or|and|not");var n=("true|false|nil|_G|_VERSION");var i=("string|xpcall|package|tostring|print|os|unpack|require|getfenv|setmetatable|next|assert|tonumber|io|rawequal|collectgarbage|getmetatable|module|rawset|math|debug|pcall|table|newproxy|type|coroutine|_G|select|gcinfo|pairs|rawget|loadstring|ipairs|_VERSION|dofile|setfenv|load|error|loadfile|sub|upper|len|gfind|rep|find|match|char|dump|gmatch|reverse|byte|format|gsub|lower|preload|loadlib|loaded|loaders|cpath|config|path|seeall|exit|setlocale|date|getenv|difftime|remove|time|clock|tmpname|rename|execute|lines|write|close|flush|open|output|type|read|stderr|stdin|input|stdout|popen|tmpfile|log|max|acos|huge|ldexp|pi|cos|tanh|pow|deg|tan|cosh|sinh|random|randomseed|frexp|ceil|floor|rad|abs|sqrt|modf|asin|min|mod|fmod|log10|atan2|exp|sin|atan|getupvalue|debug|sethook|getmetatable|gethook|setmetatable|setlocal|traceback|setfenv|getinfo|setupvalue|getlocal|getregistry|getfenv|setn|insert|getn|foreachi|maxn|foreach|concat|sort|remove|resume|yield|status|wrap|create|running|__add|__sub|__mod|__unm|__concat|__lt|__index|__call|__gc|__metatable|__mul|__div|__pow|__len|__eq|__le|__newindex|__tostring|__mode|__tonumber");var o=("string|package|os|io|math|debug|table|coroutine");var t="";var q=("setn|foreach|foreachi|gcinfo|log10|maxn");var s=this.createKeywordMapper({keyword:k,"support.function":i,"invalid.deprecated":q,"constant.library":o,"constant.language":n,"invalid.illegal":t,"variable.language":"this"},"identifier");var m="(?:(?:[1-9]\\d*)|(?:0))";var h="(?:0[xX][\\dA-Fa-f]+)";var j="(?:"+m+"|"+h+")";var r="(?:\\.\\d+)";var g="(?:\\d+)";var l="(?:(?:"+g+"?"+r+")|(?:"+g+"\\.))";var p="(?:"+l+")";this.$rules={start:[{stateName:"bracketedComment",onMatch:function(w,v,u){u.unshift(this.next,w.length-2,v);return"comment"},regex:/\-\-\[=*\[/,next:[{onMatch:function(w,v,u){if(w.length==u[1]){u.shift();u.shift();this.next=u.shift()}else{this.next=""}return"comment"},regex:/\]=*\]/,next:"start"},{defaultToken:"comment"}]},{token:"comment",regex:"\\-\\-.*$"},{stateName:"bracketedString",onMatch:function(w,v,u){u.unshift(this.next,w.length,v);return"comment"},regex:/\[=*\[/,next:[{onMatch:function(w,v,u){if(w.length==u[1]){u.shift();u.shift();this.next=u.shift()}else{this.next=""}return"comment"},regex:/\]=*\]/,next:"start"},{defaultToken:"comment"}]},{token:"string",regex:'"(?:[^\\\\]|\\\\.)*?"'},{token:"string",regex:"'(?:[^\\\\]|\\\\.)*?'"},{token:"constant.numeric",regex:p},{token:"constant.numeric",regex:j+"\\b"},{token:s,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"\\+|\\-|\\*|\\/|%|\\#|\\^|~|<|>|<=|=>|==|~=|=|\\:|\\.\\.\\.|\\.\\."},{token:"paren.lparen",regex:"[\\[\\(\\{]"},{token:"paren.rparen",regex:"[\\]\\)\\}]"},{token:"text",regex:"\\s+|\\w+"}]};this.normalizeRules()};f.inherits(d,a);b.LuaHighlightRules=d});ace.define("ace/mode/folding/lua",["require","exports","module","ace/lib/oop","ace/mode/folding/fold_mode","ace/range","ace/token_iterator"],function(b,a,c){var e=b("../../lib/oop");var h=b("./fold_mode").FoldMode;var g=b("../../range").Range;var d=b("../../token_iterator").TokenIterator;var f=a.FoldMode=function(){};e.inherits(f,h);(function(){this.foldingStartMarker=/\b(function|then|do|repeat)\b|{\s*$|(\[=*\[)/;this.foldingStopMarker=/\bend\b|^\s*}|\]=*\]/;this.getFoldWidget=function(o,n,p){var j=o.getLine(p);var i=this.foldingStartMarker.test(j);var m=this.foldingStopMarker.test(j);if(i&&!m){var k=j.match(this.foldingStartMarker);if(k[1]=="then"&&/\belseif\b/.test(j)){return}if(k[1]){if(o.getTokenAt(p,k.index+1).type==="keyword"){return"start"}}else{if(k[2]){var l=o.bgTokenizer.getState(p)||"";if(l[0]=="bracketedComment"||l[0]=="bracketedString"){return"start"}}else{return"start"}}}if(n!="markbeginend"||!m||i&&m){return""}var k=j.match(this.foldingStopMarker);if(k[0]==="end"){if(o.getTokenAt(p,k.index+1).type==="keyword"){return"end"}}else{if(k[0][0]==="]"){var l=o.bgTokenizer.getState(p-1)||"";if(l[0]=="bracketedComment"||l[0]=="bracketedString"){return"end"}}else{return"end"}}};this.getFoldWidgetRange=function(l,k,m){var i=l.doc.getLine(m);var j=this.foldingStartMarker.exec(i);if(j){if(j[1]){return this.luaBlock(l,m,j.index+1)}if(j[2]){return l.getCommentFoldRange(m,j.index+1)}return this.openingBracketBlock(l,"{",m,j.index)}var j=this.foldingStopMarker.exec(i);if(j){if(j[0]==="end"){if(l.getTokenAt(m,j.index+1).type==="keyword"){return this.luaBlock(l,m,j.index+1)}}if(j[0][0]==="]"){return l.getCommentFoldRange(m,j.index+1)}return this.closingBracketBlock(l,"}",m,j.index+j[0].length)}};this.luaBlock=function(p,t,n){var s=new d(p,t,n);var j={"function":1,"do":1,then:1,elseif:-1,end:-1,repeat:1,until:-1};var o=s.getCurrentToken();if(!o||o.type!="keyword"){return}var k=o.value;var q=[k];var l=j[k];if(!l){return}var m=l===-1?s.getCurrentTokenColumn():p.getLine(t).length;var r=t;s.step=l===-1?s.stepBackward:s.stepForward;while(o=s.step()){if(o.type!=="keyword"){continue}var i=l*j[o.value];if(i>0){q.unshift(o.value)}else{if(i<=0){q.shift();if(!q.length&&o.value!="elseif"){break}if(i===0){q.unshift(o.value)}}}}var t=s.getCurrentTokenRow();if(l===-1){return new g(t,p.getLine(t).length,r,m)}else{return new g(r,m,t,s.getCurrentTokenColumn())}}}).call(f.prototype)});
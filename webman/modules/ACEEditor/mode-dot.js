/* Copyright (c) 2014 Synology Inc. All rights reserved. */

ace.define("ace/mode/dot",["require","exports","module","ace/lib/oop","ace/mode/text","ace/tokenizer","ace/mode/matching_brace_outdent","ace/mode/dot_highlight_rules","ace/mode/folding/cstyle"],function(b,d,a){var f=b("../lib/oop");var c=b("./text").Mode;var g=b("../tokenizer").Tokenizer;var i=b("./matching_brace_outdent").MatchingBraceOutdent;var e=b("./dot_highlight_rules").DotHighlightRules;var j=b("./folding/cstyle").FoldMode;var h=function(){this.HighlightRules=e;this.$outdent=new i();this.foldingRules=new j()};f.inherits(h,c);(function(){this.lineCommentStart=["//","#"];this.blockComment={start:"/*",end:"*/"};this.getNextLineIndent=function(q,m,o){var l=this.$getIndent(m);var p=this.getTokenizer().getLineTokens(m,q);var r=p.tokens;var k=p.state;if(r.length&&r[r.length-1].type=="comment"){return l}if(q=="start"){var n=m.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);if(n){l+=o}}return l};this.checkOutdent=function(m,k,l){return this.$outdent.checkOutdent(k,l)};this.autoOutdent=function(k,l,m){this.$outdent.autoOutdent(l,m)};this.$id="ace/mode/dot"}).call(h.prototype);d.Mode=h});ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"],function(c,b,d){var e=c("../range").Range;var a=function(){};(function(){this.checkOutdent=function(f,g){if(!/^\s+$/.test(f)){return false}return/^\s*\}/.test(g)};this.autoOutdent=function(k,l){var g=k.getLine(l);var h=g.match(/^(\s*\})/);if(!h){return 0}var i=h[1].length;var j=k.findMatchingBracket({row:l,column:i});if(!j||j.row==l){return 0}var f=this.$getIndent(k.getLine(j.row));k.replace(new e(l,0,l,i-1),f)};this.$getIndent=function(f){return f.match(/^\s*/)[0]}}).call(a.prototype);b.MatchingBraceOutdent=a});ace.define("ace/mode/dot_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/text_highlight_rules","ace/mode/doc_comment_highlight_rules"],function(d,b,f){var g=d("../lib/oop");var h=d("../lib/lang");var a=d("./text_highlight_rules").TextHighlightRules;var e=d("./doc_comment_highlight_rules").DocCommentHighlightRules;var c=function(){var j=h.arrayToMap(("strict|node|edge|graph|digraph|subgraph").split("|"));var i=h.arrayToMap(("damping|k|url|area|arrowhead|arrowsize|arrowtail|aspect|bb|bgcolor|center|charset|clusterrank|color|colorscheme|comment|compound|concentrate|constraint|decorate|defaultdist|dim|dimen|dir|diredgeconstraints|distortion|dpi|edgeurl|edgehref|edgetarget|edgetooltip|epsilon|esep|fillcolor|fixedsize|fontcolor|fontname|fontnames|fontpath|fontsize|forcelabels|gradientangle|group|headurl|head_lp|headclip|headhref|headlabel|headport|headtarget|headtooltip|height|href|id|image|imagepath|imagescale|label|labelurl|label_scheme|labelangle|labeldistance|labelfloat|labelfontcolor|labelfontname|labelfontsize|labelhref|labeljust|labelloc|labeltarget|labeltooltip|landscape|layer|layerlistsep|layers|layerselect|layersep|layout|len|levels|levelsgap|lhead|lheight|lp|ltail|lwidth|margin|maxiter|mclimit|mindist|minlen|mode|model|mosek|nodesep|nojustify|normalize|nslimit|nslimit1|ordering|orientation|outputorder|overlap|overlap_scaling|pack|packmode|pad|page|pagedir|pencolor|penwidth|peripheries|pin|pos|quadtree|quantum|rank|rankdir|ranksep|ratio|rects|regular|remincross|repulsiveforce|resolution|root|rotate|rotation|samehead|sametail|samplepoints|scale|searchsize|sep|shape|shapefile|showboxes|sides|size|skew|smoothing|sortv|splines|start|style|stylesheet|tailurl|tail_lp|tailclip|tailhref|taillabel|tailport|tailtarget|tailtooltip|target|tooltip|truecolor|vertices|viewport|voro_margin|weight|width|xlabel|xlp|z").split("|"));this.$rules={start:[{token:"comment",regex:/\/\/.*$/},{token:"comment",regex:/#.*$/},{token:"comment",merge:true,regex:/\/\*/,next:"comment"},{token:"string",regex:"'(?=.)",next:"qstring"},{token:"string",regex:'"(?=.)',next:"qqstring"},{token:"constant.numeric",regex:/[+\-]?\d+(?:(?:\.\d*)?(?:[eE][+\-]?\d+)?)?\b/},{token:"keyword.operator",regex:/\+|=|\->/},{token:"punctuation.operator",regex:/,|;/},{token:"paren.lparen",regex:/[\[{]/},{token:"paren.rparen",regex:/[\]}]/},{token:"comment",regex:/^#!.*$/},{token:function(k){if(j.hasOwnProperty(k.toLowerCase())){return"keyword"}else{if(i.hasOwnProperty(k.toLowerCase())){return"variable"}else{return"text"}}},regex:"\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"}],comment:[{token:"comment",regex:".*?\\*\\/",merge:true,next:"start"},{token:"comment",merge:true,regex:".+"}],qqstring:[{token:"string",regex:'[^"\\\\]+',merge:true},{token:"string",regex:"\\\\$",next:"qqstring",merge:true},{token:"string",regex:'"|$',next:"start",merge:true}],qstring:[{token:"string",regex:"[^'\\\\]+",merge:true},{token:"string",regex:"\\\\$",next:"qstring",merge:true},{token:"string",regex:"'|$",next:"start",merge:true}]}};g.inherits(c,a);b.DotHighlightRules=c});ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(c,b,e){var f=c("../lib/oop");var a=c("./text_highlight_rules").TextHighlightRules;var d=function(){this.$rules={start:[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},{token:"comment.doc.tag",regex:"\\bTODO\\b"},{defaultToken:"comment.doc"}]}};f.inherits(d,a);d.getStartRule=function(g){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:g}};d.getEndRule=function(g){return{token:"comment.doc",regex:"\\*\\/",next:g}};b.DocCommentHighlightRules=d});ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(b,a,c){var d=b("../../lib/oop");var f=b("../../range").Range;var g=b("./fold_mode").FoldMode;var e=a.FoldMode=function(h){if(h){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+h.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+h.end))}};d.inherits(e,g);(function(){this.foldingStartMarker=/(\{|\[)[^\}\]]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;this.getFoldWidgetRange=function(o,n,p,m){var h=o.getLine(p);var k=h.match(this.foldingStartMarker);if(k){var l=k.index;if(k[1]){return this.openingBracketBlock(o,k[1],p,l)}var j=o.getCommentFoldRange(p,l+k[0].length,1);if(j&&!j.isMultiLine()){if(m){j=this.getSectionRange(o,p)}else{if(n!="all"){j=null}}}return j}if(n==="markbegin"){return}var k=h.match(this.foldingStopMarker);if(k){var l=k.index+k[0].length;if(k[1]){return this.closingBracketBlock(o,k[1],p,l)}return o.getCommentFoldRange(p,l,-1)}};this.getSectionRange=function(m,p){var q=m.getLine(p);var i=q.search(/\S/);var o=p;var k=q.length;p=p+1;var l=p;var n=m.getLength();while(++p<n){q=m.getLine(p);var h=q.search(/\S/);if(h===-1){continue}if(i>h){break}var j=this.getFoldWidgetRange(m,"all",p);if(j){if(j.start.row<=o){break}else{if(j.isMultiLine()){p=j.end.row}else{if(i==h){break}}}}l=p}return new f(o,k,l,m.getLine(l).length)}}).call(e.prototype)});
/* Copyright (c) 2014 Synology Inc. All rights reserved. */

ace.define("ace/mode/mushcode_high_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(c,b,d){var f=c("../lib/oop");var a=c("./text_highlight_rules").TextHighlightRules;var e=function(){var l=("@if|@ifelse|@switch|@halt|@dolist|@create|@scent|@sound|@touch|@ataste|@osound|@ahear|@aahear|@amhear|@otouch|@otaste|@drop|@odrop|@adrop|@dropfail|@odropfail|@smell|@oemit|@emit|@pemit|@parent|@clone|@taste|whisper|page|say|pose|semipose|teach|touch|taste|smell|listen|look|move|go|home|follow|unfollow|desert|dismiss|@tel");var o=("=#0");var j=("default|edefault|eval|get_eval|get|grep|grepi|hasattr|hasattrp|hasattrval|hasattrpval|lattr|nattr|poss|udefault|ufun|u|v|uldefault|xget|zfun|band|bnand|bnot|bor|bxor|shl|shr|and|cand|cor|eq|gt|gte|lt|lte|nand|neq|nor|not|or|t|xor|con|entrances|exit|followers|home|lcon|lexits|loc|locate|lparent|lsearch|next|num|owner|parent|pmatch|rloc|rnum|room|where|zone|worn|held|carried|acos|asin|atan|ceil|cos|e|exp|fdiv|fmod|floor|log|ln|pi|power|round|sin|sqrt|tan|aposs|andflags|conn|commandssent|controls|doing|elock|findable|flags|fullname|hasflag|haspower|hastype|hidden|idle|isbaker|lock|lstats|money|who|name|nearby|obj|objflags|photo|poll|powers|pendingtext|receivedtext|restarts|restarttime|subj|shortestpath|tmoney|type|visible|cat|element|elements|extract|filter|filterbool|first|foreach|fold|grab|graball|index|insert|itemize|items|iter|last|ldelete|map|match|matchall|member|mix|munge|pick|remove|replace|rest|revwords|setdiff|setinter|setunion|shuffle|sort|sortby|splice|step|wordpos|words|add|lmath|max|mean|median|min|mul|percent|sign|stddev|sub|val|bound|abs|inc|dec|dist2d|dist3d|div|floordiv|mod|modulo|remainder|vadd|vdim|vdot|vmag|vmax|vmin|vmul|vsub|vunit|regedit|regeditall|regeditalli|regediti|regmatch|regmatchi|regrab|regraball|regraballi|regrabi|regrep|regrepi|after|alphamin|alphamax|art|before|brackets|capstr|case|caseall|center|containsfansi|comp|decompose|decrypt|delete|edit|encrypt|escape|if|ifelse|lcstr|left|lit|ljust|merge|mid|ostrlen|pos|repeat|reverse|right|rjust|scramble|secure|space|spellnum|squish|strcat|strmatch|strinsert|stripansi|stripfansi|strlen|switch|switchall|table|tr|trim|ucstr|unsafe|wrap|ctitle|cwho|channels|clock|cflags|ilev|itext|inum|convsecs|convutcsecs|convtime|ctime|etimefmt|isdaylight|mtime|secs|msecs|starttime|time|timefmt|timestring|utctime|atrlock|clone|create|cook|dig|emit|lemit|link|oemit|open|pemit|remit|set|tel|wipe|zemit|fbcreate|fbdestroy|fbwrite|fbclear|fbcopy|fbcopyto|fbclip|fbdump|fbflush|fbhset|fblist|fbstats|qentries|qentry|play|ansi|break|c|asc|die|isdbref|isint|isnum|isletters|linecoords|localize|lnum|nameshort|null|objeval|r|rand|s|setq|setr|soundex|soundslike|valid|vchart|vchart2|vlabel|@@|bakerdays|bodybuild|box|capall|catalog|children|ctrailer|darttime|debt|detailbar|exploredroom|fansitoansi|fansitoxansi|fullbar|halfbar|isdarted|isnewbie|isword|lambda|lobjects|lplayers|lthings|lvexits|lvobjects|lvplayers|lvthings|newswrap|numsuffix|playerson|playersthisweek|randomad|randword|realrandword|replacechr|second|splitamount|strlenall|text|third|tofansi|totalac|unique|getaddressroom|listpropertycomm|listpropertyres|lotowner|lotrating|lotratingcount|lotvalue|boughtproduct|companyabb|companyicon|companylist|companyname|companyowners|companyvalue|employees|invested|productlist|productname|productowners|productrating|productratingcount|productsoldat|producttype|ratedproduct|soldproduct|topproducts|totalspentonproduct|totalstock|transfermoney|uniquebuyercount|uniqueproductsbought|validcompany|deletepicture|fbsave|getpicturesecurity|haspicture|listpictures|picturesize|replacecolor|rgbtocolor|savepicture|setpicturesecurity|showpicture|piechart|piechartlabel|createmaze|drawmaze|drawwireframe");var v=this.createKeywordMapper({"invalid.deprecated":"debugger","support.function":j,"constant.language":o,keyword:l},"identifier");var q="(?:r|u|ur|R|U|UR|Ur|uR)?";var n="(?:(?:[1-9]\\d*)|(?:0))";var s="(?:0[oO]?[0-7]+)";var h="(?:0[xX][\\dA-Fa-f]+)";var i="(?:0[bB][01]+)";var k="(?:"+n+"|"+s+"|"+h+"|"+i+")";var p="(?:[eE][+-]?\\d+)";var u="(?:\\.\\d+)";var g="(?:\\d+)";var m="(?:(?:"+g+"?"+u+")|(?:"+g+"\\.))";var t="(?:(?:"+m+"|"+g+")"+p+")";var r="(?:"+t+"|"+m+")";this.$rules={start:[{token:"variable",regex:"%[0-9]{1}"},{token:"variable",regex:"%q[0-9A-Za-z]{1}"},{token:"variable",regex:"%[a-zA-Z]{1}"},{token:"variable.language",regex:"%[a-z0-9-_]+"},{token:"constant.numeric",regex:"(?:"+r+"|\\d+)[jJ]\\b"},{token:"constant.numeric",regex:r},{token:"constant.numeric",regex:k+"[lL]\\b"},{token:"constant.numeric",regex:k+"\\b"},{token:v,regex:"[a-zA-Z_$][a-zA-Z0-9_$]*\\b"},{token:"keyword.operator",regex:"\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|#|%|<<|>>|\\||\\^|~|<|>|<=|=>|==|!=|<>|="},{token:"paren.lparen",regex:"[\\[\\(\\{]"},{token:"paren.rparen",regex:"[\\]\\)\\}]"},{token:"text",regex:"\\s+"}]}};f.inherits(e,a);b.MushCodeRules=e});
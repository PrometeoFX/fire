/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.ns("SYNO.SDS.Utils");SYNO.SDS.Utils.IsCJK=function(c){if(!c){return false}var e=function(g){return/^[\u4E00-\u9FA5]|^[\uFE30-\uFFA0]/.test(g)};var f=function(g){return/^[\u0800-\u4e00]/.test(g)};var b=function(g){return/^[\u3130-\u318F]|^[\uAC00-\uD7AF]/.test(g)};var d;for(var a=0;a<c.length;a++){d=c[a];if(d===" "){continue}if(Ext.isEmpty(d)||(!e(d)&&!f(d)&&!b(d))){return false}}return true};Ext.override(Ext.Component,{addManagedComponent:function(a){this.components=this.components||[];this.components.push(a);return a},removeManagedComponent:function(a){this.components=this.components||[];this.components.remove(a);return a},beforeDestroy:function(){this.taskRunner=null;this.components=this.components||[];for(var a=0;a<this.components.length;++a){try{this.components[a].destroy()}catch(b){if(Ext.isDefined(SYNO.SDS.JSDebug)){SYNO.Debug(this.id+" sub-components["+a+"] destroy failed.");SYNO.Debug(this.components[a]);throw b}}}delete this.components}});Ext.override(Ext.grid.GridView,{onLayout:function(){var b=this.el.select(".x-grid3-scroller",this);var a=b.elements[0];if(a.clientWidth===a.offsetWidth){this.scrollOffset=2}else{this.scrollOffset=undefined}this.fitColumns(false)}});SYNO.webfm.utils.Download=Ext.extend(Ext.util.Observable,{constructor:function(a){Ext.apply(this,a||{});SYNO.webfm.utils.Download.superclass.constructor.call(this);this.DownloadCGI=this.RELURL+"../webapi/FolderSharing/file_download.cgi";this.IsHandheldDeviceBrowser=SYNO.FileStation.FolderSharing.Utils.IsHandheldDeviceBrowser},GetDownloadIframe:function(){var a=Ext.fly("download_iframe");if(a){a.removeAllListeners();a=a.dom;try{var c=Ext.isIE?a.contentWindow.document:(a.contentDocument||window.frames[a.id].document);c.open();c.close()}catch(b){this.owner.getMsgBox().alert(_WFT("filetable","filetable_download"),_WFT("download","download_bigfile"));Ext.destroy(Ext.get("download_iframe"));return null}}else{a=Ext.DomHelper.append(document.body,{tag:"iframe",id:"download_iframe",frameBorder:0,width:0,height:0,css:"display:none;visibility:hidden;height:1px;"});a.src=Ext.SSL_SECURE_URL}return a},DirectDownload:function(a,e,f){if(!Ext.isArray(e)){e=[e]}var c=SYNO.webfm.utils.replaceDLNameSpecChars(a);var b=String.format(this.DownloadCGI+"/{0}?dlink={1}",encodeURIComponent(c),SYNO.webfm.utils.bin2hex(e[0]));b+="&noCache="+(new Date().getTime())+"&FOLDER_SHARING="+this.folderSharingURL+"&api=SYNO.FolderSharing.Download&version=1&method=download&mode=download";if(Ext.isIE&&!f.get("isdir")&&("exe"===f.get("type").toLowerCase())){b+="&f=.exe"}if(this.DownloadWithHandheldDeviceBrowser(b+"&stdhtml=true")){return}b+="&stdhtml=false";if((Ext.isIE||Ext.isModernIE)&&b.length>=(2048-(window.location.protocol+"//"+window.location.hostname+":"+window.location.port).length)){this.Download(e,a);return}if(Ext.fly("download_iframe")){Ext.destroy(Ext.fly("download_iframe"))}var d=this.GetDownloadIframe();if(!d){return}Ext.EventManager.on(d,"load",function(){Ext.EventManager.removeListener(d,"load",arguments.callee,this);this.Download(e,a)},this);d.src=b},getAbsoluteUrl:function(){return SYNO.FileStation.FolderSharing.Utils.getAbsoluteUrl()},getDownloadURL:function(c,b,d){var a={api:"SYNO.FolderSharing.Download",version:1,method:"download",mode:"download",codepage:d,FOLDER_SHARING:_S("folderSharingURL")};Ext.applyIf(a,{dlname:b,path:c.join(","),stdhtml:true});return this.getAbsoluteUrl()+Ext.urlAppend((this.DownloadCGI+"/"+encodeURIComponent(SYNO.webfm.utils.replaceDLNameSpecChars(b))),Ext.urlEncode(a))},DownloadWithHandheldDeviceBrowser:function(a){if(this.IsHandheldDeviceBrowser){window.open(a);return true}return false},Download:function(g,f,h){h=h||"";var a=SYNO.webfm.utils.Download.DlFrameTemplate.applyTemplate({cgi:this.DownloadCGI,dlfile:encodeURIComponent(SYNO.webfm.utils.replaceDLNameSpecChars(f))});if(!Ext.isArray(g)){g=[g]}if(this.DownloadWithHandheldDeviceBrowser(this.getDownloadURL(g,f))){return}if(Ext.fly("download_iframe")){Ext.destroy(Ext.fly("download_iframe"))}var c=this.GetDownloadIframe();if(!c){return}var e=Ext.isIE?c.contentWindow.document:(c.contentDocument||window.frames[c.id].document);e.open("text/html");e.write(a);e.close();var b;var d=[];for(b=0;b<g.length;b++){d.push(SYNO.API.EscapeStr(g[b]))}e.dlform.path.value=d.join(",");e.dlform.FOLDER_SHARING.value=this.folderSharingURL;e.dlform.codepage.value=h;Ext.EventManager.on(c,"load",function(){var j=Ext.isIE?c.contentWindow.document:(c.contentDocument||window.frames[c.id].document);Ext.EventManager.removeListener(c,"load",arguments.callee,this);try{if(j&&j.body){var i=Ext.decode(j.body.innerText);return SYNO.FileStation.FolderSharing.Utils.CheckWebapiError(i)}}catch(k){}return false},this);e.dlform.submit()}});SYNO.webfm.utils.Download.DlFrameTemplate=new Ext.Template('<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><form accept-charset="utf-8" name="dlform" action="{cgi}/{dlfile}" method="POST"><input type="hidden" name="dlname" value="{dlfile}" /><input type="hidden" name="path" value="" /><input type="hidden" name="FOLDER_SHARING" value="" /><input type="hidden" name="api" value="SYNO.FolderSharing.Download" /><input type="hidden" name="codepage" value="" /><input type="hidden" name="version" value="1" /><input type="hidden" name="method" value="download" /><input type="hidden" name="mode" value="download" /></form></body></html>');SYNO.webfm.utils.Download.DlFrameTemplate.compile();Ext.ns("SYNO.FileStation.Comp");SYNO.FileStation.CtxMenu=Ext.extend(SYNO.ux.Menu,{ignoreParentClicks:true,itemId:"folderSharingCtx",constructor:function(a){Ext.apply(this,a||{});var b=this.webfm;SYNO.FileStation.CtxMenu.superclass.constructor.call(this,Ext.apply(a,{cls:"syno-webfm",items:[{itemId:"gc_download",iconCls:"webfm-download-icon",text:_WFT("filetable","filetable_download"),handler:b.onDownloadAction,scope:b},new Ext.menu.Separator({itemId:"gc_sep_download"})]}))},showAt:function(b,a){SYNO.webfm.utils.ShowHideMenu(this.items);SYNO.FileStation.CtxMenu.superclass.showAt.call(this,b,a)}});Ext.apply(SYNO.FileStation.Comp,{cToolsMenu:function(a){return new SYNO.ux.Button({text:_WFT("filetable","tools"),menu:a,hidden:!(_S("is_admin")&&"yes"===_D("supportmount"))})},cDownload:function(c,b,a,d){d=d||_WFT("filetable","filetable_download");return new (c)({itemId:"gc_download",hidden:true,text:d,tooltip:d,listeners:{click:{fn:a.onDownloadAction,scope:a}}})},cDownloadFolder:function(c,b,a,d){d=d||_WFT("filetable","filetable_download_dir_directly");return new (c)({itemId:"gc_download_folder",text:d,tooltip:d,listeners:{click:{fn:a.onDownloadFolderAction,scope:a}}})},cCmbDisplayType:function(a){var b=new Ext.data.SimpleStore({autoDestroy:true,fields:["value","display"],data:[["all",_WFT("filetable","filetable_all_files")],["file",_WFT("filetable","filetable_file_only")],["dir",_WFT("filetable","filetable_dir_only")]]});var c=new Ext.form.ComboBox({name:"display_type",hiddenName:"display_type",hiddenId:Ext.id(),store:b,displayField:"display",valueField:"value",triggerAction:"all",value:"all",editable:false,width:120,mode:"local",listeners:{select:{fn:function(f,d,e){this.onChangeDisplayType(f.getValue())},scope:a}}});return c},cBtnDisplayType:function(a){var b=new SYNO.ux.Button({hidden:true,text:_WFT("filetable","filetable_file_dispaly"),menu:new Ext.menu.Menu({cls:"syno-webfm",items:[{itemId:"all",text:_WFT("filetable","filetable_all_files"),iconCls:"syno-sds-fs-tbar-sel-display",listeners:{click:{fn:function(){this.onChangeDisplayType("all")},scope:a}}},{itemId:"file",text:_WFT("filetable","filetable_file_only"),listeners:{click:{fn:function(){this.onChangeDisplayType("file")},scope:a}}},{itemId:"dir",text:_WFT("filetable","filetable_dir_only"),listeners:{click:{fn:function(){this.onChangeDisplayType("dir")},scope:a}}}]})});return b},cHisBack:function(b,a){return new (b)({itemId:"back",tooltip:_WFT("common","back"),cls:"syno-sds-webfm-tbar-back",iconCls:"syno-sds-fs-tbar-back",disabled:true,listeners:{click:{fn:function(c){this.historyIndex--;var e=this.historyPath[this.historyIndex];var d=false;if(e.source!==this.getCurrentSource()){this.switchSource(e.source);d=true}if(d||e.directory!==this.getCurrentDir()){this.onChangeDir(e.directory,true);this.historyBtnCheck()}},scope:a}}})},cHisNext:function(b,a){return new (b)({itemId:"next",tooltip:_WFT("common","next"),cls:"syno-sds-webfm-tbar-next",iconCls:"syno-sds-fs-tbar-next",disabled:true,listeners:{click:{fn:function(c){this.historyIndex++;var e=this.historyPath[this.historyIndex];var d=false;if(e.source!==this.getCurrentSource()){this.switchSource(e.source);d=true}if(d||e.directory!==this.getCurrentDir()){this.onChangeDir(e.directory,true);this.historyBtnCheck()}},scope:a}}})},cViewMode:function(c,a,b){return new (c)({cls:"syno-sds-webfm-tbar-viewmode-btn-no-margin",iconCls:"syno-sds-webfm-tbar-viewmode-btn webfm-viewmode-btn-list",webfm:a,handler:function(){var e="syno-sds-webfm-tbar-viewmode-btn ";var d=this.iconCls;if(d==e+"webfm-viewmode-btn-list"){this.setIconClass(e+"webfm-viewmode-btn-thumb-small");a.changeView("thumbnailView");a.changeThumbSize(SYNO.webfm.utils.ThumbSize.SMALL)}else{if(d==e+"webfm-viewmode-btn-thumb-small"){this.setIconClass(e+"webfm-viewmode-btn-thumb-medium");a.changeThumbSize(SYNO.webfm.utils.ThumbSize.MEDIUM)}else{if(d==e+"webfm-viewmode-btn-thumb-medium"){this.setIconClass(e+"webfm-viewmode-btn-thumb-large");a.changeThumbSize(SYNO.webfm.utils.ThumbSize.LARGE)}else{if(d==e+"webfm-viewmode-btn-thumb-large"){this.setIconClass(e+"webfm-viewmode-btn-list");a.changeView("fileGrid")}}}}},menu:{cls:"syno-sds-webfm-tbar-viewmode-menu",items:[{text:_WFT("common","list_view"),iconCls:"webfm-viewmode-btn-list",handler:function(){this.changeView("fileGrid")},scope:a},{text:_WFT("common","thumb_small"),iconCls:"webfm-viewmode-btn-thumb-small",handler:function(){this.changeView("thumbnailView");this.changeThumbSize(SYNO.webfm.utils.ThumbSize.SMALL)},scope:a},{text:_WFT("common","thumb_medium"),iconCls:"webfm-viewmode-btn-thumb-medium",handler:function(){this.changeView("thumbnailView");this.changeThumbSize(SYNO.webfm.utils.ThumbSize.MEDIUM)},scope:a},{text:_WFT("common","thumb_large"),iconCls:"webfm-viewmode-btn-thumb-large",handler:function(){this.changeView("thumbnailView");this.changeThumbSize(SYNO.webfm.utils.ThumbSize.LARGE)},scope:a}],listeners:{click:{fn:function(e,d){this.btnViewMode.setIconClass("syno-sds-webfm-tbar-viewmode-btn "+d.iconCls)},scope:a}}},resetViewMode:function(){this.setIconClass("syno-sds-webfm-tbar-viewmode-btn webfm-viewmode-btn-list");a.changeView("fileGrid")}})}});SYNO.FileStation.CodePageSelectDialog=function(a){Ext.apply(this,a||{});this.propertyPanel=this.initPropertyTab();var b={modal:true,closable:false,cls:"sds-window-v5 active-win",owner:this.owner,width:650,height:240,shadow:true,minWidth:200,minHeight:230,collapsible:false,autoScroll:false,constrainHeader:true,title:_WFT("filetable","filetable_download"),items:this.propertyPanel,fbar:[this.btnCompress=new SYNO.ux.Button({btnStyle:"blue",text:_WFT("common","ok"),scope:this,handler:function(){this.onCompress()}}),new SYNO.ux.Button({text:_WFT("common","close"),scope:this,handler:function(){this.closeHandler()}})],keys:[{key:[10,13],fn:function(){this.onCompress()},scope:this}],listeners:{afterlayout:{fn:function(){this.center();this.fbar.addClass("x-statusbar")},scope:this,single:true}}};SYNO.FileStation.CodePageSelectDialog.superclass.constructor.call(this,b)};Ext.extend(SYNO.FileStation.CodePageSelectDialog,Ext.Window,{initPropertyTab:function(){var c=new Ext.data.SimpleStore({fields:["value","display"],data:SYNO.webfm.utils.getSupportedLanguage()});var a={labelWidth:200,border:false,autoScroll:true,bodyStyle:"padding: 0 20px",items:[{xtype:"syno_fieldset",title:_WFT("common","lang_codepage"),synodefaults:{width:300},items:[{xtype:"syno_displayfield",value:_WFT("compress","download_compress_codepage_desc")},{xtype:"syno_combobox",fieldLabel:_WFT("common","lang_codepage"),hiddenName:"codepage",store:c,displayField:"display",valueField:"value",triggerAction:"all",editable:false,value:_S("lang"),mode:"local",ref:"../../codepageCombo"}]}]};SYNO.LayoutConfig.fill(a);var b=new Ext.Panel(a);return b},load:function(a){this.cfg=a||this.cfg;this.show().center()},closeHandler:function(){this.hide()},onCompress:function(){this.cfg.callback.call(this.cfg.scope||this,this.cfg.dirPaths,this.cfg.suggestname,this.codepageCombo.getValue()||"");this.hide()}});Ext.ns("SYNO.FileStation.Comp");SYNO.FileStation.Comp.WinToolbar=function(b){var a=SYNO.FileStation.Comp;var c=function(){var f=new Ext.Toolbar({cls:"syno-sds-fs-btbar"});this.displayType=a.cBtnDisplayType(this);f.add(this.displayType);this.btnDownload=a.cDownload(SYNO.ux.Button,true,this);f.addItem(this.btnDownload);this.btnDownloadFolder=a.cDownloadFolder(SYNO.ux.Button,true,this);f.addItem(this.btnDownloadFolder);f.addFill();var g=b.getId();this.btnViewMode=a.cViewMode(SYNO.ux.SplitButton,this,g);f.addItem(this.btnViewMode);return f};var d=function(){this.pathBar=new SYNO.FileStation.PathBar({webfm:this});this.btnHisBack=a.cHisBack(SYNO.ux.Button,this);this.btnHisNext=a.cHisNext(SYNO.ux.Button,this);this.btnRefreshTree=new SYNO.ux.Button({tooltip:_WFT("common","common_refresh"),iconCls:"syno-sds-fs-tbar-refresh",listeners:{click:{fn:this.refresh,scope:this}}});var f=new Ext.Toolbar({cls:"syno-sds-fs-ttbar",itemId:"topToolbar",items:[this.btnHisBack,this.btnHisNext,{xtype:"syno_displayfield",width:3},this.btnRefreshTree,{xtype:"syno_displayfield",width:3},this.pathBar.tbPanel],listeners:{resize:{fn:function(){var h=0;f.items.each(function(j){if(true!==j.hidden){h+=j.getOuterSize().width}});h-=this.pathBar.tbPanel.getWidth();var g=f.getWidth()-f.getResizeEl().getPadding("lr")-2;var i=g-h;if(i>0){this.pathBar.setWidth(i)}},scope:this},afterlayout:{fn:function(){var g=this.pathBar.tbPanel.getEl();g.setStyle("overflow","hidden");g.addClass("with-right-border")},scope:this,single:true}}});return f};var e=function(){var g=d.call(b);var h=c.call(b);var f=new Ext.Container({ctCls:"x-window-tbar",cls:"syno-sds-fs-tbar",layout:{type:"vbox",pack:"start",align:"stretch"},height:36*2,defaults:{flex:1},items:[g,h]});return f};return e.call(b)};Ext.ns("SYNO.FileStation");Ext.ns("SYNO.FileStation.FolderSharing.Utils");Ext.BLANK_IMAGE_URL=Ext.isIE6||Ext.isIE7||Ext.isAir?"http://www.extjs.com/s.gif":"data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";Ext.QuickTips.init();Ext.Ajax.defaultHeaders={FOLDER_SHARING:_S("folderSharingURL")};SYNO.FileStation.FolderSharing.Utils={getAbsoluteUrl:function(){if(SYNO.FileStation.FolderSharing.Utils.AbsoluteUrl){return SYNO.FileStation.FolderSharing.Utils.AbsoluteUrl}var b=document.createElement("a");b.href="./";SYNO.FileStation.FolderSharing.Utils.AbsoluteUrl=b.href;b=null;return SYNO.FileStation.FolderSharing.Utils.AbsoluteUrl},IsHandheldDeviceBrowser:(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|windows phone os 7|windows phone 8/i.test(navigator.userAgent))};SYNO.FileStation.FolderSharing.Utils.CheckWebapiError=function(e){var c,b,d;try{if(Ext.isDefined(e.responseText)){c=Ext.decode(e.responseText)}else{c=e}if(c.success){return false}b=c.error.code;d=SYNO.API.Erros.common[c.error.code]||SYNO.webfm.utils.getWebAPIErr(false,c.error)}catch(a){}if(!d){b=100;d=SYNO.API.Erros.common[b]}if(b>=105&&b<=107){window.alert(d);window.onbeforeunload=null;window.location.href=window.location.href}else{Ext.Msg.alert("Folder Sharing",d)}return true};Ext.Ajax.on("requestcomplete",function(b,d,a){try{if(SYNO.FileStation.FolderSharing.Utils.CheckWebapiError(d)){b.purgeListeners();delete a.success;delete a.failure;delete a.callback}}catch(c){if(!Ext.isIE8){throw c}}});Ext.Ajax.on("requestexception",function(d,b,c){try{var a=b.status;if(a===403||a===404||a===408||a===503){d.purgeListeners();delete c.success;delete c.failure;delete c.callback;window.alert(SYNO.API.Erros.common[0]);window.onbeforeunload=null;if(window.parent.location==window.location){window.location.href=window.location.href}else{window.parent.postMessage(window.location.href,"*")}}}catch(f){if(!Ext.isIE8){throw f}}});SYNO.FileStation.FolderSharingWindow=Ext.extend(Ext.Window,{constructor:function(a){Ext.apply(this,a||{},{renderTo:Ext.getBody(),layout:"fit",monitorResize:true,border:false,closable:false,cls:"sds-window-v5 active-win syno-sds-fs-win",title:_T("tree","leaf_filebrowser"),iconCls:"webfm2-folder-sharing-title-icon",items:[new SYNO.FileStation.FolderSharingPanel()]});SYNO.FileStation.FolderSharingWindow.superclass.constructor.call(this,a)},onRender:function(b,a){SYNO.FileStation.FolderSharingWindow.superclass.onRender.call(this,b,a);if(!Ext.isEmpty(_S("tunnel"))){return}this.loginEl=this.el.createChild({tag:"span",html:_T("common","login"),cls:"webfm2-folder-sharing-login normal-font"});this.loginEl.on("click",function(){var d={openfile:_S("folderSharingPath")+"/"};var c=Ext.isObject(d)?Ext.urlEncode({launchParam:Ext.urlEncode(d)}):"";window.onbeforeunload=null;window.location.href=Ext.urlAppend((_S("tunnel")||"")+"/webman/index.cgi?launchApp=SYNO.SDS.App.FileStation3.Instance",c)},this);this.loginEl.addClassOnOver("green-status")}});SYNO.FileStation.FolderSharingPanel=Ext.extend(Ext.Panel,{constructor:function(b){this.initDefVal();Ext.applyIf(this,b);var c=this.createStore(),a=this.createColumnModel();b=b||{};Ext.applyIf(b,{layout:"fit",cls:"syno-webfm",bodyStyle:"padding: 0 12px;",border:false,items:[{ref:"viewPanel",xtype:"panel",layout:"card",activeItem:0,items:[this.createListView(c,a),this.createThumbView(c)]}],tbar:SYNO.FileStation.Comp.WinToolbar(this),bbar:this.thumbnailsPagingtoolbar=this.createPagingToolbar(c)});SYNO.FileStation.FolderSharingPanel.superclass.constructor.call(this,b);this.mon(this,"afterrender",function(){this.activeView=this.listView;this.onChangeDir(_S("folderSharingPath"))},this)},createColumnModel:function(){var a=function(g,f,e){if(e.get("isdir")){return""}else{return Ext.util.Format.fileSize(g)}};var d=function(g,f,e){if(!g||(e.get("mountType")==="remotefail")){return""}return(new Date(g*1000)).toLocaleString()};var c=_S("RELURL");var b=[{id:"filename",header:_WFT("common","common_filename"),dataIndex:"filename",width:160,renderer:(function(g,i,h,m,f,l){if(Ext.isEmpty(h.data.icon)){h.data.icon=SYNO.webfm.utils.getThumbName(h.data)}var k=Ext.util.Format.htmlEncode(g);if(!Ext.isIE||Ext.isModernIE){i.attr='ext:qtip="'+Ext.util.Format.htmlEncode(k)+'"'}var j=h.get("icon");var e='<div class="{0}"><img width="16" height="16" src="{1}" align="absmiddle" />&nbsp;{2}</div>';if(h.get("mountType")==="remotefail"){j="remotefailmountpoint.png"}return String.format(e,"",(c+"images/files_ext/"+j+"?v="+_S("version")),k)}).createDelegate(this)},{header:_WFT("common","common_filesize"),dataIndex:"filesize",width:80,align:"right",renderer:a},{header:_WFT("filetable","filetable_title_file_type"),dataIndex:"type",width:100,align:"left",renderer:function(j,h,e,g,i,f){if(true===e.get("isdir")){return _WFT("filetable","filetable_folder")}if(j){return Ext.util.Format.htmlEncode(j.toUpperCase())+" "+_WFT("filetable","filetable_file")}return _WFT("filetable","filetable_file")}},{header:_WFT("filetable","filetable_mtime"),dataIndex:"mt",width:150,align:"right",renderer:d},{header:_WFT("filetable","filetable_ctime"),dataIndex:"ct",width:150,align:"right",renderer:d,hidden:true},{header:_WFT("filetable","filetable_atime"),dataIndex:"at",width:150,align:"right",renderer:d,hidden:true},{header:_WFT("filetable","filetable_privilege"),dataIndex:"privilege",width:80,align:"right",hidden:true,renderer:(function(o,n,j,r,f,p){var k=j.data.privilege,g="",q="",l="";var e=0,i=0,m=0;var h=parseInt(k,10);if(h>=100){e=Math.floor(h/100);h-=e*100}if(h>=10){i=Math.floor(h/10);h-=i*10}m=h;g+=(e&4)?"r":"-";g+=(e&2)?"w":"-";g+=(e&1)?"x":"-";q+=(i&4)?"r":"-";q+=(i&2)?"w":"-";q+=(i&1)?"x":"-";l+=(m&4)?"r":"-";l+=(m&2)?"w":"-";l+=(m&1)?"x":"-";return g+q+l}).createDelegate(this)}];if(!_S("diskless")){b.push({header:_WFT("filetable","filetable_owner"),dataIndex:"owner",width:80,align:"right",hidden:true,renderer:(function(j,h,e,g,i,f){if(e.get("mountType")==="remotefail"){return""}if(j===""){return e.get("uid")}return j}).createDelegate(this)},{header:_WFT("filetable","filetable_group"),dataIndex:"group",width:80,align:"right",renderer:(function(j,h,e,g,i,f){if(e.get("mountType")==="remotefail"){return""}if(j===""){return e.get("gid")}return j}).createDelegate(this),hidden:true})}this.cmNoppath=new Ext.grid.ColumnModel({defaults:{sortable:true},columns:b});return this.cmNoppath},createListView:function(b,c){var a=[],d=new SYNO.FileStation.SelectAllRowSelectionModel({listeners:{selectionchange:{fn:this.checkDownloadBtn,scope:this}}});a.push(SYNO.FileStation.FocusGridPluginInstance);a.push(SYNO.FileStation.GridPanelFlexcrollPluginInstance);a.push(SYNO.FileStation.BufferViewFlexcrollPluginInstance);this.listView=this.listView||new SYNO.ux.GridPanel({itemId:"fileGrid",sm:d,owner:this,border:false,region:"center",view:new SYNO.ux.FleXcroll.grid.BufferView({cacheSize:30,scrollDelay:false,forceFit:true,focusItem:function(f){var e=this,g=0;g=Ext.min([f*(e.rowHeight+e.borderHight)-e.scroller.getHeight()/2,e.getContentwrapper().getHeight()-e.scroller.getHeight()]);e.scroller.dom.fleXcroll.setScrollPos(0,Ext.max([0,g]))}}),ds:b,cm:this.cmNoppath,loadMask:true,autoExpandMin:160,autoExpandColumn:"filename",monitorWindowResize:true,enableColLock:false,columnLines:true,stripeRows:true,plugins:a,getViewEl:function(){return this.getView().scroller},focusItem:function(f){var e=this.getView();e.focusItem(f)},listeners:{scope:this,celldblclick:{fn:this.gridCelldblclick,scope:this},rowcontextmenu:{fn:this.onGridRowContextMenu,scope:this},rowclick:{fn:function(f,h,g){if(g&&h>=0&&!g.hasModifier()){f.getSelectionModel().selectRow(h)}}},rowmousedown:{fn:function(g,i,h){var f=null;if(i!==false){f=g.getSelectionModel();if(!f.isSelected(i)||h.hasModifier()){f.handleMouseDown(g,i,h)}}},scope:this},afterrender:{fn:function(e){e.un("rowmousedown",d.handleMouseDown,e.getSelectionModel())},scope:this},activate:{fn:function(){this.viewPanel.doLayout();if(this.listView.updateScrollbar){this.listView.updateScrollbar(this.listView.getView().scroller.dom)}},scope:this}}});return this.listView},createThumbView:function(a){this.thumbnailView=this.thumbnailView||new SYNO.FileStation.FolderSharingThumbnailsView({store:a,folderSharingURL:_S("folderSharingURL"),itemId:"thumbnailView",tunnel:_S("tunnel"),RELURL:_S("RELURL"),getViewEl:function(){return this.getEl()},listeners:{selectionchange:{fn:this.checkDownloadBtn,scope:this},contextmenu:{fn:this.onDataviewContextMenu,scope:this},dblclick:{fn:this.onDataViewNodeDblclick,scope:this},activate:{fn:function(){this.viewPanel.doLayout();this.thumbnailView.updateScrollbar()},scope:this}}});return this.thumbnailView},createStore:function(){this.store=this.store||new Ext.data.Store({proxy:new SYNO.API.Proxy({timeout:SYNO.webfm.Cfg.timeout,api:"SYNO.FolderSharing.List",method:"list",version:1,listeners:{scope:this,beforeload:function(a,b){var c=a.activeRequest.read;if(c){Ext.Ajax.abort(c)}}}}),reader:new Ext.data.JsonReader({root:"files",id:"path"},[{name:"file_id",mapping:"path"},{name:"path"},{name:"filename",mapping:"name"},{name:"filesize",mapping:"additional.size"},{name:"mt",mapping:"additional.time.mtime"},{name:"ct",mapping:"additional.time.crtime"},{name:"at",mapping:"additional.time.atime"},{name:"privilege",mapping:"additional.perm.posix"},{name:"fileprivilege",convert:function(c,a){var b=a.additional.perm.acl,d;if(b.append){d|=SYNO.webfm.utils.Mode_Append}if(b.del){d|=SYNO.webfm.utils.Mode_Del}if(b.exec){d|=SYNO.webfm.utils.Mode_Exec}if(b.read){d|=SYNO.webfm.utils.Mode_Read}if(b.write){d|=SYNO.webfm.utils.Mode_Write}return d}},{name:"isacl",mapping:"additional.perm.is_acl_mode"},{name:"icon"},{name:"type",mapping:"additional.type"},{name:"real_path",mapping:"additional.real_path"},{name:"isdir"},{name:"owner",mapping:"additional.owner.user"},{name:"group",mapping:"additional.owner.group"},{name:"uid",mapping:"additional.owner.uid"},{name:"gid",mapping:"additional.owner.gid"},{name:"ppath"},{name:"mountType",mapping:"additional.mount_point_type"}]),remoteSort:true,paramNames:{start:"offset",limit:"limit",sort:"sort_by",dir:"sort_direction"},sortInfo:{field:"name",direction:"ASC"},baseParams:{sort_by:"name",additional:"real_path,size,owner,time,perm,type,mount_point_type"},pruneModifiedRecords:true,listeners:{scope:this,beforeload:function(a,b){var e=b.params;var d=a.fields.get(a.sortInfo.field);var c=d?(d.mapping||d.name):"name";c=c.split(".",3);e.sort_by=c[2]||c[1]||c[0];return e},clear:this.onClearStore,load:this.onLoadDS,exception:this.onExceptionRemoteDS}});return this.store},gridCelldblclick:function(b,d,a,c){this.dblclick(b,d,a,c)},onDataViewNodeDblclick:function(a,b,c,d){this.dblclick(a,b,c,d)},dblclick:function(d,g,c,f){var b="";var a=this.store.getAt(g);if(a.get("isdir")===false){this.onDownloadAction(undefined,f);return}b=a.get("file_id");this.onChangeDir(b)},onGridRowContextMenu:function(a,d,b){b.preventDefault();var c=a.getSelectionModel();if(!c.isSelected(d)){c.selectRow(d)}this.ctxMenu.blContainerMenu=false;this.ctxMenu.showAt(b.getXY())},onDataviewContextMenu:function(a,b,c,d){d.preventDefault();if(!a.isSelected(c)){a.select(c,false)}this.ctxMenu.blContainerMenu=false;this.ctxMenu.showAt(d.getXY())},checkDownloadBtn:function(){var a=this.activeView.getSelectionModel();this.btnDownload.setVisible(a.hasSelection())},changeThumbSize:function(a){this.thumbnailView.changeThumbSize(a)},changeView:function(b){var a=this;a.viewPanel.getLayout().setActiveItem(b);if(b==="thumbnailView"){a.activeView=a.thumbnailView}else{a.activeView=a.listView}},setPagingToolbar:function(b,a,c){c.setButtonsVisible(b>this.displayNum);if(b!==0&&b%this.displayNum===0&&c.store.getCount()===0){c.movePrevious()}a.doLayout()},refreshToolbar:function(a){this.setPagingToolbar(a||this.listView.getStore().getTotalCount(),this,this.thumbnailsPagingtoolbar);this.setPagingToolbar(a||this.thumbnailView.getStore().getTotalCount(),this,this.thumbnailsPagingtoolbar)},clearAllSelections:function(a){this.thumbnailView.getSelectionModel().clearAllSelections(a);this.listView.getSelectionModel().clearAllSelections(a)},refresh:function(){this.clearAllSelections(true);this.thumbnailsPagingtoolbar.doRefresh()},onBeforeDownloadAction:function(){var b=this.activeView.getSelectionModel(),a;if(!b.hasSelection()){Ext.Msg.alert(_WFT("filetable","filetable_download"),_WFT("filetable","filetable_select_one"));return[]}a=b.getSelections();return a},getSuggestDLNameWithOne:function(b,a){var c=".zip";if(a){return b+c}else{return b}},getSuggestDLName:function(c){var d=".zip";if(c.length==1){return this.getSuggestDLNameWithOne(c[0].get("filename"),c[0].get("isdir"))}var b=c[0].get("file_id");b=b.substr(0,b.lastIndexOf("/"));var a=b.lastIndexOf("/");if(a!=-1){b=b.substr(a+1)}return b+d},getDownloadURL:function(){var f={api:"SYNO.FolderSharing.Download",version:1,method:"download",mode:"download",FOLDER_SHARING:_S("folderSharingURL")};var c=[],e=[],a,b=[],d,g;if(Ext.isEmpty(c=this.onBeforeDownloadAction())){return null}for(a=0;a<c.length;a++){b.push(c[a].get("filename"));g=c[a].get("file_id");e.push(g)}d=this.getSuggestDLName(c);Ext.applyIf(f,{dlname:d,path:e.join(","),stdhtml:true});return{url:this.getAbsoluteUrl()+Ext.urlAppend((this.DownloadCGI+"/"+encodeURIComponent(SYNO.webfm.utils.replaceDLNameSpecChars(d))),Ext.urlEncode(f)),metaType:"application/octet-stream",filename:encodeURIComponent(d)}},getAbsoluteUrl:function(){return SYNO.FileStation.FolderSharing.Utils.getAbsoluteUrl()},onStartDrag:function(c){var d=c.browserEvent,b=this.getDownloadURL(),a="{0}:{1}:{2}";if(!b){return}d.dataTransfer.setData("DownloadURL",String.format(a,b.metaType,b.filename,b.url));return true},onDownloadAction:function(l,g){var h=[],k=[],f,b=[],c,j;if(Ext.isEmpty(h=this.onBeforeDownloadAction())){return}if(1==h.length&&!h[0].get("isdir")){var d=h[0],a=d.get("filename"),m=d.get("file_id");this.FileAction.DirectDownload(a,m,d);return}for(f=0;f<h.length;f++){b.push(h[f].get("filename"));j=h[f].get("file_id");k.push(j)}c=this.getSuggestDLName(h);this.showCodepageDialog(k,c)},showCodepageDialog:function(b,a){if(!this.codepageDialog){this.codepageDialog=new SYNO.FileStation.CodePageSelectDialog({owner:this})}this.codepageDialog.load({scope:this.FileAction,callback:this.FileAction.Download,dirPaths:b,suggestname:a})},onDownloadFolderAction:function(b,c){var a=this.getCurrentDir();var d=this.getSuggestDLNameWithOne(a,true);d=d.substr(d.lastIndexOf("/")+1);this.showCodepageDialog(a,d)},exceptionDS:function(c,d){var b=this,a=b.viewPanel.getEl();if(a.isMasked()){a.unmask()}a.mask(SYNO.webfm.utils.getWebAPIErr(false,c,d))},onExceptionRemoteDS:function(c,d,e,b,f,a){this.exceptionDS(f,b.params)},removeGridDragToDesktop:function(){if(!this.listView.getGridEl()){return}var c=0,a=this.listView.getEl().select("div.x-grid3-row"),b=a?a.elements:[],e=b.length,d=null;for(c=0;c<e;c++){d=Ext.fly(b[c]);d.un("dragstart",this.onStartDrag,this)}},removeDataViewDragToDesktop:function(){if(!this.thumbnailView.getEl()){return}var c=0,a=this.thumbnailView.getEl().select("div.thumb-wrap"),b=a?a.elements:[],e=b.length,d=null;for(c=0;c<e;c++){d=Ext.fly(b[c]);d.un("dragstart",this.onStartDrag,this)}},setGridDragToDesktop:function(){var c=0,a=this.listView.getEl().select("div.x-grid3-row"),b=a?a.elements:[],e=b.length,d=null;for(c=0;c<e;c++){d=Ext.fly(b[c]);d.on("dragstart",this.onStartDrag,this);d.set({draggable:true})}},setDataViewDragToDesktop:function(){var c=0,a=this.thumbnailView.getEl().select("div.thumb-wrap"),b=a?a.elements:[],e=b.length,d=null;for(c=0;c<e;c++){d=Ext.fly(b[c]);d.on("dragstart",this.onStartDrag,this);d.set({draggable:true})}},setDragToDesktop:function(){this.setDataViewDragToDesktop();this.setGridDragToDesktop()},removeDragToDesktop:function(){this.removeGridDragToDesktop();this.removeDataViewDragToDesktop()},onClearStore:function(){if(Ext.isChrome){this.removeDragToDesktop()}},onLoadDS:function(a,d,b){var c=this;if(Ext.isChrome){c.setDragToDesktop()}c.checkDownloadBtn();c.refreshToolbar(a.getTotalCount())},createPagingToolbar:function(b){var a=new SYNO.ux.PagingToolbar({store:b,pageSize:this.displayNum,displayInfo:true,showRefreshBtn:true,border:false,cls:"webfm2-folder-sharing-paging-toolbar"});return a},getViewEl:function(){return this.activeView.getViewEl()},pathButtonInfo:function(c,a,b){this.text=c;this.path=b;this.tooltip=a},updateCurrentPathLink:function(f){if(f.substr(0,1)!="/"){return}if(f.indexOf(_S("folderSharingPath"))!==0){return}var h=[];var c,b,a,d,l,e="";var g=[];h=_S("folderSharingPath").substring(1).split("/");d=Ext.util.Format.htmlEncode(h[h.length-1]);g[0]=new this.pathButtonInfo(d,d,_S("folderSharingPath"));if(f===_S("folderSharingPath")){this.pathBar.addPathButtons(g);return}h=f.substring(_S("folderSharingPath").length+1).split("/");if(h.length<=1){d=Ext.util.Format.htmlEncode(h[0]);g[1]=new this.pathButtonInfo(d,d,f)}else{this.upDirPath="";c=0;for(a=1;c<h.length;c++,a++){d=Ext.util.Format.htmlEncode(h[c]);l=d;if(h[c].length>50){e=h[c].substr(0,47)+"...";l=Ext.util.Format.htmlEncode(e)}e="";if(c!==h.length){for(b=0;c>0&&b<c;b++){e+="/";e+=h[b]}e+="/";e+=h[c]}g[a]=new this.pathButtonInfo(l,d,_S("folderSharingPath")+e)}}this.pathBar.addPathButtons(g)},getCurrentSource:function(){return this.currentSource},setCurrentSource:function(a){this.currentSource=a},getCurrentDir:function(){return this.currentDir},setCurrentDir:function(a){this.currentDir=a},loadData:function(){this.store.load({params:{offset:0,limit:this.displayNum}})},onChangeDir:function(a,c){this.clearAllSelections(true);if(c!==true){this.historySet(a)}var b=this.getCurrentDir();if(b===a){return}this.setCurrentDir(a);this.store.removeAll();this.store.baseParams.filetype=this.showContent;this.store.baseParams.folder_path=SYNO.API.EscapeStr(a);this.store.baseParams.FOLDER_SHARING=_S("folderSharingURL");if(SYNO.webfm.utils.isParentDir(b,a)){this.highlightId=b}this.updateCurrentPathLink(a);this.loadData()},onGoToPathWithDir:function(a){this.onChangeDir(a)},historyBtnCheck:function(){var b=this.historyIndex;var a=this.historyCnt;if(b===a){this.btnHisNext.disable()}else{this.btnHisNext.enable()}if(b===0){this.btnHisBack.disable()}else{this.btnHisBack.enable()}},isPathEqualLastHistory:function(a){var b=this.historyIndex;if(b<0||this.historyCnt<b){return false}return(a===this.historyPath[b].directory)},historySet:function(a){if(this.isPathEqualLastHistory(a)){return}var b=++this.historyIndex;this.historyPath[b]={directory:a,source:this.getCurrentSource()};this.historyCnt=this.historyIndex;this.historyBtnCheck()},initDefVal:function(){this.RELURL=_S("RELURL");this.historyPath=[];this.historyIndex=-1;this.historyCnt=0;this.showContent="all";this.displayNum=(!Ext.isIE||Ext.isModernIE)?1000:250;this.timeStamp=0;this.blAfterLayout=false;this.currentSource="remote";this.showContent="all";this.DownloadCGI="../webapi/FolderSharing/file_download.cgi";this.initCustomComponent()},initCustomComponent:function(){this.ctxMenu=new SYNO.FileStation.CtxMenu({webfm:this,RELURL:this.RELURL});this.FileAction=new SYNO.webfm.utils.Download({owner:this,RELURL:"",folderSharingURL:_S("folderSharingURL")})}});
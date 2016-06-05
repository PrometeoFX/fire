/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.define("SYNO.SDS.FBExtViewer",{statics:{checkFn:function(a,b,c){if(1!==b.length||b[0].get("isdir")||!((b[0].get("type").toLowerCase() in c))){return false}return true},launchFn:function(c,f,g,e,d,b){b=b||false;if(this.extAppInfo){this.extAppInfo=null}var a=SYNO.webfm.utils.getFullSize(c[0].get("filesize"));this.extAppInfo={type:c[0].get("type").toLowerCase(),allowExt:g,app:e,bigSizeStr:d,extURL:f,filesize:a,path:c[0].get("path"),blQuickConnect:b};this.getDownloadLink.call(e.owner)},openDoc:function(c){if(!c){return}var b=this.extAppInfo,k=b.filesize,h=b.type,i=b.allowExt,e=b.app,g=b.bigSizeStr,j=b.extURL,d;d="https:"+j+encodeURIComponent(c);if(k>i[h]){var a=new SYNO.SDS.MessageBoxV5({owner:e.owner}),f=function(){window.open(d);a.close()};a.fbButtons.yes.handler=f;a.confirm(_T("filebrowser","gviewer"),g,function(l){},e)}else{window.open(d)}},onGetPortalURLResuestDone:function(a,b){if(a===true){var c=SYNO.SDS.FBExtViewer.getDownloadLinkByHostName(b);SYNO.SDS.FBExtViewer.openDoc(c)}else{var d=_S("standalone")?_T("error","quickcnt_warning"):_T("error","quickcnt_alert");this.getMsgBox().alert(_T("filebrowser","oviewer"),d,_S("standalone")?(function(){}):(function(e){if("ok"==e){SYNO.SDS.AppLaunch("SYNO.SDS.AdminCenter.Application",{fn:"SYNO.SDS.AdminCenter.QuickConnect.Main"})}}),this);return}},getDownloadLinkByHostName:function(b){var d,a,c,e=this.extAppInfo.path;d=e.substr(1+e.lastIndexOf("/"));a=Ext.util.Cookies.get("id");c=String.format("{0}/viewer/{1}/{2}/{3}/{4}",b,SYNO.SDS.Utils.bin2hex(e),encodeURIComponent(a),(_S("SynoToken")||"token"),encodeURIComponent(d));c=c.replace("//viewer","/viewer");return c},getDownloadLink:function(){var c,b,a,d;c=SYNO.SDS.Utils.Network.getExternalHostName(true);if(!SYNO.SDS.Utils.Network.checkExternalIP(c)||SYNO.SDS.FBExtViewer.extAppInfo.blQuickConnect){if(this.curPortalUrl){d=SYNO.SDS.FBExtViewer.getDownloadLinkByHostName(this.curPortalUrl)}else{var e=_S("standalone")||!_S("is_admin")?_T("error","quickcnt_warning"):_T("error","quickcnt_alert");this.getMsgBox().alert(_T("filebrowser","oviewer"),e,_S("standalone")?(function(){}):(function(f){if("ok"==f){SYNO.SDS.AppLaunch("SYNO.SDS.AdminCenter.Application",{fn:"SYNO.SDS.AdminCenter.QuickConnect.Main"})}}),this);return}}else{a=window.location.protocol+"//"+c;b=window.location.port;if(!_S("rewrite_mode")){if(window.location.protocol==="https:"){b=(_S("external_port_dsm_https")&&_S("external_port_dsm_https")!=="")?_S("external_port_dsm_https"):window.location.port}else{b=(_S("external_port_dsm_http")&&_S("external_port_dsm_http")!=="")?_S("external_port_dsm_http"):window.location.port}}if(b){a+=":"+b}d=SYNO.SDS.FBExtViewer.getDownloadLinkByHostName(a)}SYNO.SDS.FBExtViewer.openDoc(d)}}});Ext.define("SYNO.SDS.GoogleDocsViewer.FBExt",{statics:{AllowExt:{doc:26214400,docx:26214400,odt:26214400,pptx:26214400,ppt:26214400,pps:26214400,xls:26214400,xlsx:26214400,pdf:26214400,tif:26214400,tiff:26214400,svg:26214400,pages:26214400,ai:26214400,psd:26214400,dxf:26214400,eps:26214400,ps:26214400,ttf:26214400,xps:26214400},extURL:"//docs.google.com/viewer?url=",checkFn:function(a,b){return SYNO.SDS.FBExtViewer.checkFn(a,b,SYNO.SDS.GoogleDocsViewer.FBExt.AllowExt)},launchFn:function(a){SYNO.SDS.FBExtViewer.launchFn(a,SYNO.SDS.GoogleDocsViewer.FBExt.extURL,SYNO.SDS.GoogleDocsViewer.FBExt.AllowExt,this,_T("filebrowser","gviewer_bigsize"))},getDownloadLink:function(){return SYNO.SDS.FBExtViewer.getDownloadLink()}}});Ext.define("SYNO.SDS.OfficeViewer.FBExt",{statics:{AllowExt:{doc:10485760,docx:10485760,dotx:10485760,pptx:10485760,ppt:10485760,pps:10485760,ppsx:10485760,xls:5242880,xlsx:5242880,xlsb:5242880,xlsm:5242880},extURL:"//view.officeapps.live.com/op/view.aspx?src=",checkFn:function(a,b){return SYNO.SDS.FBExtViewer.checkFn(a,b,SYNO.SDS.OfficeViewer.FBExt.AllowExt)},launchFn:function(a){SYNO.SDS.FBExtViewer.launchFn(a,SYNO.SDS.OfficeViewer.FBExt.extURL,SYNO.SDS.OfficeViewer.FBExt.AllowExt,this,_T("filebrowser","oviewer_bigsize"),true)},getDownloadLink:function(){return SYNO.SDS.FBExtViewer.getDownloadLink()}}});Ext.define("SYNO.SDS.GoogleDriveEditor.FBExt",{statics:{AllowExt:["gform","gdoc","gdraw","gsheet","gslides","gscript","gtable"],checkFn:function(a,b){if(1!==b.length||b[0].get("isdir")||(SYNO.SDS.GoogleDriveEditor.FBExt.AllowExt.indexOf(b[0].get("type").toLowerCase())<0)){return false}return true},launchFn:function(b){var a=SYNO.API.GetBaseURL({api:"SYNO.FileStation.OpenGoogleDrive",version:1,method:"open",params:{dlink:b[0].get("path")}});window.open(a)}}});
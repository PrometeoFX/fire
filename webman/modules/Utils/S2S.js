/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.define("SYNO.SDS.Utils.S2S",{statics:{mayFailByPermission:function(b){var a=false;if(!b){return false}Ext.each(b,function(c){if(c.is_readonly===false){a=true;return false}});return a},isNeedConfirm:function(b){var a=false;Ext.each(b,function(c){if(c.is_sync_share&&(c.no_check_permission||SYNO.SDS.Utils.S2S.mayFailByPermission(c.permissions))){a=true;return false}});return a},openConfirmDialogIfNeeded:function(a,b){if(!a){if(Ext.isFunction(b.continueHandler)){b.continueHandler.call(b.scope||this)}}else{b.dialogOwner.getMsgBox().confirm(b.dialogTitle,b.dialogMsg,function(c){if(c==="yes"){if(Ext.isFunction(b.continueHandler)){b.continueHandler.call(b.scope||this)}}else{if(Ext.isFunction(b.abortHandler)){b.abortHandler.call(b.scope||this)}}},b.scope||this)}},confirmIfSyncShareAffected:function(b,g,d){var c=d.dialogOwner;var f={api:"SYNO.S2S.Server",version:1,method:"get"};var e={api:"SYNO.S2S.Server.Pair",version:1,method:"list",params:{additional:["sync_shares"]}};if((c._D("support_s2s","no")!=="yes")||!g||(Ext.isArray(g)&&(g.length===0))){SYNO.SDS.Utils.S2S.openConfirmDialogIfNeeded(false,d);return}if(!Ext.isArray(g)){g=[g]}if(b===true){var a=SYNO.SDS.Utils.S2S.isNeedConfirm(g);SYNO.SDS.Utils.S2S.openConfirmDialogIfNeeded(a,d);return}c.mask();c.sendWebAPI({compound:{stopwhenerror:false,params:[f,e]},scope:this,callback:function(l,k){var j;var i;var h=false;c.unmask();if(!l||k.has_fail){h=SYNO.SDS.Utils.S2S.isNeedConfirm(g);SYNO.SDS.Utils.S2S.openConfirmDialogIfNeeded(h,d);return}j=SYNO.API.Util.GetValByAPI(k,f.api,f.method);i=SYNO.API.Util.GetValByAPI(k,e.api,e.method);if(j.enable!==true){SYNO.SDS.Utils.S2S.openConfirmDialogIfNeeded(false,d);return}Ext.each(g,function(m){m.is_sync_share=false;Ext.each(i.clients,function(o){var n=o.additional.sync_shares.indexOf(m.name);if(n>=0){m.is_sync_share=true;return false}})});h=SYNO.SDS.Utils.S2S.isNeedConfirm(g);SYNO.SDS.Utils.S2S.openConfirmDialogIfNeeded(h,d)}})}}});
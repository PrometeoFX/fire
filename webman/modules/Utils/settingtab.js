/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.ns("SYNO.SDS.Utils.SettingTabPanel");SYNO.SDS.Utils.SettingTabPanel=Ext.extend(SYNO.ux.TabPanel,{constructor:function(a){var c={plain:true,height:300,deferredRender:false,autoWidth:true,listeners:{scope:this,activate:this.onActivate,tabchange:this.onTabchange,beforetabchange:this.onBeforeTabChange,beforeshow:{scope:this,fn:this.onBeforeshow,single:true}}};Ext.apply(c,a||{});this.addEvents(["applyfail","loadfail","requestfail","applysuccess"]);SYNO.SDS.Utils.SettingTabPanel.superclass.constructor.call(this,c);var b=this.getAllForms();Ext.each(b,function(f,d,e){f.items.each(function(i,g,h){if(i.isFormField&&i.clearInvalid){i.mon(i,"disable",i.clearInvalid,i)}})},this);this.defineBehaviors()},defineBehaviors:function(){this.checkFormDirty=true;this.ERR_STR_FN=_T;this.ERR_STR_STRUCT=SYNO_WebManager_Strings},applyHandler:function(b,a){this.applyAllForm()},cancelHandler:function(b,a){},resetHandler:function(){this.resetAllForm()},loadAllForm:function(a){if(!this.url){SYNO.Debug("No url in TabPanel "+_T("helptoc","settings"));return}var b=Ext.applyIf({params:{action:"load"}},a);if(false===this.onBeforeRequest(b)){return false}this.sendAjaxRequest(b)},applyAllForm:function(a){var c={};if(!this.url){SYNO.Debug("No url in TabPanel "+_T("helptoc","settings"));return false}if(this.checkFormDirty&&!this.isAnyFormDirty()){this.owner.mun(this.owner,"beforeclose",this.onBeforeDeactivate,this);this.owner.close();return true}var b=Ext.applyIf({method:"POST",params:{action:"apply"}},a);if(false===this.onBeforeRequest(b)){return false}this.items.each(function(h,e,g){if(!h.getForm){return}var f=h.getForm();var d=f.getValues();Ext.apply(c,d)},this);Ext.apply(b.params,c);this.sendAjaxRequest(b)},resetAllForm:function(){var a=this.getAllForms();Ext.each(a,function(d,b,c){d.reset()},this)},isAnyFormDirty:function(){var a=this.getAllForms();var b=false;Ext.each(a,function(e,c,d){if(e.isDirty()){b=true;return false}},this);return b},onBeforeDeactivate:function(){if(!this.checkFormDirty){this.resetAllForm()}else{if(this.isAnyFormDirty()){this.owner.getMsgBox().confirm(this.owner.title,_T("common","confirm_lostchange"),function(a){if(a==="yes"){this.resetAllForm();this.owner.close()}},this);return false}}return true},getAllForms:function(){var a=[];this.items.each(function(e,b,d){if(!e.getForm){return}var c=e.getForm();a.push(c)},this);return a},sendAjaxRequest:function(a){Ext.applyIf(a,{url:this.url,scope:this,single:true,success:this.onRequestSuccess,failure:this.onRequestFailure});if(a.params.action==="load"){this.owner.setStatusBusy()}else{this.owner.setStatusBusy({text:_T("common","saving")})}this.addAjaxTask(a).start(true)},onBeforeRequest:function(b){var a=this.getAllForms();var c=b.params.action;var d=true;if(c==="load"){return true}Ext.each(a,function(g,e,f){if(!g.isValid()){d=false;this.owner.setStatusError({text:_T("common","forminvalid"),clear:true});this.setActiveByForm(g,e);return false}},this);if(!d){return false}return true},onRequestSuccess:function(a,b){if(this.isDestroyed){return}this.owner.clearStatusBusy();var c=(!a.responseText)?true:Ext.decode(a.responseText);var d=b.params.action;if(c===true||!c.success){if(d==="load"){this.reportLoadFail(b,c)}else{if(d==="apply"||d==="submit"){this.reportSubmitFail(b,c)}else{SYNO.Debug("Not handled action:",d)}}return}if(d==="apply"||d==="submit"){this.fireEvent("applysuccess",this,d);this.owner.setStatusOK();this.owner.mun(this.owner,"beforeclose",this.onBeforeDeactivate,this);this.owner.close();return}this.items.each(function(h,e,g){if(!h.getForm){return}var f=h.getForm();f.loadRecord(c)},this)},onRequestFailure:function(a,b){if(this.isDestroyed){return}this.owner.clearStatusBusy();var c=_T("common","commfail");this.owner.getMsgBox().alert(_T("helptoc","settings"),c,function(d){this.fireEvent("requestfail",this,d,c)},this)},onBeforeTabChange:function(c,a,d){if(a.disabled===true){return false}var b=c.getFooterToolbar();if(!b){return true}if(a instanceof Ext.form.FormPanel){b.show()}else{b.hide()}return true},reportLoadFail:function(a,b){var d;if(Ext.isObject(b.errinfo)){var c=b.errinfo;if(c.sec in this.ERR_STR_STRUCT&&c.key in this.ERR_STR_STRUCT[c.sec]){d=this.ERR_STR_FN(c.sec,c.key)}else{d=String.format("{0}{1}",c.sec,c.key)}if(Ext.isNumber(c.line)){d=String.format("{0} ({1})",d,c.line)}}else{d=_T("common","error_system")}this.owner.getMsgBox().alert(_T("helptoc","settings"),d,function(e){this.fireEvent("loadfail",this,e,d)},this)},setActiveByForm:function(c,b){var a=this.getAllForms();if(Ext.isNumber(b)&&this.items.getCount()===a.length){this.setActiveTab(b)}else{this.items.each(function(g,e,d){if(g.getForm&&g.getForm()===c){this.setActiveTab(e);return false}},this)}},reportSubmitFail:function(b,c){var f;if(c.errors){var a=this.getAllForms();var d;for(d in c.errors){if(c.errors.hasOwnProperty(d)){break}}Ext.each(a,function(g){g.markInvalid(c.errors);if(g.findField(d)){this.setActiveByForm(g)}},this);f=_T("error","error_bad_field")}else{if(Ext.isObject(c.errinfo)){var e=c.errinfo;if(e.sec in this.ERR_STR_STRUCT&&e.key in this.ERR_STR_STRUCT[e.sec]){f=this.ERR_STR_FN(e.sec,e.key)}else{f=String.format("{0}{1}",e.sec,e.key)}if(Ext.isNumber(e.line)){f=String.format("{0} ({1})",f,e.line)}}else{f=_T("common","error_system")}}this.owner.getMsgBox().alert(_T("helptoc","settings"),f,function(g){this.fireEvent("applyfail",this,g,f)},this)},addDeactivateCheck:function(a){a.mon(a,"beforeclose",this.onBeforeDeactivate,this)},onActivate:function(){},onBeforeshow:function(){},onTabchange:function(){this.owner.clearStatus()}});
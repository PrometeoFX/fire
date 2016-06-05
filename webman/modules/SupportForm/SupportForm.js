/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.ns("SYNO.SDS.SupportForm");SYNO.SDS.SupportForm.Application=Ext.extend(SYNO.SDS.AppInstance,{appWindowName:"SYNO.SDS.SupportForm.MainWindow"});SYNO.SDS.SupportForm.MainWindow=Ext.extend(SYNO.SDS.AppWindow,{constructor:function(a){this.appInstance=a.appInstance;var b=this.fillConfig(a);SYNO.SDS.SupportForm.MainWindow.superclass.constructor.call(this,b)},fillConfig:function(a){var b={layout:"border",cls:"syno-app-support-form",dsmStyle:"v5",minWidth:940,minHeight:580,width:960,height:580,border:false,plain:true,items:[this.moduleList=new SYNO.SDS.SupportForm.ModuleList({region:"west",width:250,appWin:this}),this.moduleCt=new SYNO.ux.Panel({layout:"card",padding:"0 0 0 16px",border:false,frame:false,hideMode:"offsets",cls:"syno-app-support-form-module-ct",region:"center",appWin:this})]};Ext.apply(b,a);return b},getModule:function(d){var c=this.moduleCt;var a=c.getComponent(d);var b;if(a){b=a.module}else{var e;e=Ext.getClassByName(d);e.prototype.jsConfig=this.jsConfig;b=new e({cp:this});b.cp=this;a=b.getPanel();a.module=b;a.itemId=d;c.add(a);b.title=a.title;b.height=a.height}return b},activateModule:function(b,c){if(b&&b.activate){var a=b.getPanel();if(a instanceof Ext.TabPanel&&Ext.isFunction(a.setActiveTab)){a.setActiveTab(0)}b.activate(c)}},startModule:function(b,c){var a;a=this.getModule(b);if(!a){return false}this.moduleCt.layout.setActiveItem(b);this.activateModule(a,c)},deactivateModule:function(b,c){var a=this.getModule(b);if(a&&a.deactivate){return a.deactivate(c)}},onActivate:function(){var b=Ext.getDom("iframe_form");if(b){var a=Ext.get(b.parentNode).query(".sds-shim-for-iframe");Ext.each(a,function(c){Ext.removeNode(c)})}SYNO.SDS.SupportForm.MainWindow.superclass.onActivate.apply(this,arguments)},onDeactivate:function(){var a=document.createElement("div");a.addClassName("sds-shim-for-iframe");Ext.get(Ext.getDom("iframe_form").parentNode).appendChild(a);SYNO.SDS.SupportForm.MainWindow.superclass.onDeactivate.apply(this,arguments)},onClose:function(){if(this.isSkipDeactivateCheck()){this.clearSkipDeactivateCheck();return true}var b,a=true;b=this.moduleList.getSelectionModel().getSelectedNode().attributes.fn;if(b){a=this.deactivateModule(b);if(false===a){this.getMsgBox().confirm(this.title,_T("common","confirm_lostchange"),function(c){if("yes"===c){this.setSkipDeactivateCheck();this.close()}},this)}}return a},isSkipDeactivateCheck:function(){return !!this.skipDeactivateCheckFlag},setSkipDeactivateCheck:function(){this.skipDeactivateCheckFlag=true},clearSkipDeactivateCheck:function(){this.skipDeactivateCheckFlag=false}});SYNO.SDS.SupportForm.ModuleList=Ext.extend(SYNO.ux.ModuleList,{constructor:function(a){var b=this.fillConfig(a);SYNO.SDS.SupportForm.ModuleList.superclass.constructor.call(this,b);this.getSelectionModel().on("selectionchange",this.onModuleListSelect,this);this.getSelectionModel().on("beforeselect",this.onBeforeSelect,this)},fillConfig:function(a){var b={itemId:"module_list",padding:"4px 16px 0 12px",dataUrl:String.format("{0}/modules/modules.json",a.appWin.jsConfig.jsBaseURL),listeners:{scope:this,single:true,load:function(){(function(){this.selectModule("SYNO.SDS.SupportForm.FormModule")}).defer(200,this)}}};Ext.apply(b,a);return b},onBeforeSelect:function(a,b,e){if(!e){return true}if(this.appWin.isSkipDeactivateCheck()){this.appWin.clearSkipDeactivateCheck();return true}var d,c=true;d=e.attributes.fn;if(d){c=this.appWin.deactivateModule(d);if(false===c){this.appWin.getMsgBox().confirm(this.title,_T("common","confirm_lostchange"),function(f){if("yes"===f){this.appWin.setSkipDeactivateCheck();this.appWin.moduleList.selectModule(b.attributes.fn)}},this)}}return c},onModuleListSelect:function(a,c){var b;if(!c.leaf){return}b=c.attributes.fn;if(b){this.appWin.startModule(b)}else{this.appWin.getMsgBox().alert(this.appWin.title,"not implemented yet")}}});Ext.ns("SYNO.SDS.SupportForm");SYNO.SDS.SupportForm.Module=Ext.extend(Object,{constructor:function(){},activate:function(){},deactivate:function(){return true},getPanel:function(){return null},getAbsoluteURL:function(a){return String.format("{0}/{1}",this.jsConfig.jsBaseURL,a)},getHelpParam:Ext.emptyFn});Ext.ns("SYNO.SDS.SupportForm");SYNO.SDS.SupportForm.RemoteModule=Ext.extend(SYNO.SDS.SupportForm.Module,{constructor:function(a){SYNO.SDS.SupportForm.RemoteModule.superclass.constructor.call(this);this.createPanel(a)},getPanel:function(){return this.panel},createPanel:function(a){var b={cp:a.cp,module:this,border:false,frame:false,autoScroll:true,header:false,useDefaultBtn:true,webapi:{api:"SYNO.Core.SupportForm.Service",methods:{get:"get",set:"set"},version:1},items:[{xtype:"syno_fieldset",title:_T("support_center","fieldset_remote"),itemId:"remote_fieldset",name:"remote_fieldset",id:"remote_fieldset",items:[{xtype:"syno_displayfield",hideLabel:true,value:_T("support_center","remote_desc")},{xtype:"syno_checkbox",boxLabel:_T("support_center","support_channel_chkbox"),itemId:"enable_support_channel",name:"enable_support_channel"},{xtype:"syno_displayfield",fieldLabel:_T("support_center","expired_date"),name:"expiredate",labelWidth:280,indent:1,value:"--"},{xtype:"syno_displayfield",fieldLabel:_T("support_center","sns_identifier_key"),name:"sns_identifier_key",labelWidth:280,selectable:true,indent:1,value:"--"}]},{xtype:"syno_fieldset",title:_T("support_center","fieldset_log"),itemId:"log_fieldset",name:"log_fieldset",id:"log_fieldset",items:[{xtype:"syno_displayfield",hideLabel:true,value:_T("support_center","log_desc")},{xtype:"syno_button",btnStyle:"default",id:"log_btn",text:_T("support_center","log_generate_btn"),autoWidth:true,scope:this,disabled:a.cp._S("demo_mode"),tooltip:a.cp._S("demo_mode")?_JSLIBSTR("uicommon","error_demo"):"",handler:this.doDownload}]}]};this.panel=new SYNO.SDS.SupportForm.ServicePanel(b)},activate:function(){this.panel.loadForm()},deactivate:function(){return !this.panel.isFormDirty()},doDownload:function(g,d,e,c){var f=[],a;var b=window.open("about:blank","_blank");b.document.write(_T("relayservice","file_downloading"));if(this.panel.getFilterComponent()){this.panel.getFilterComponent().items.each(function(h){if(true===h.getValue()){f.push(h.itemId)}},this)}a=window.location.protocol+"//"+window.location.host+this.panel.getBaseURL({api:"SYNO.Core.SupportForm.Log",version:1,method:"download",params:{app_list:f}});b.location.assign(a)}});SYNO.SDS.SupportForm.ServicePanel=Ext.extend(SYNO.SDS.Utils.FormPanel,{constructor:function(a){this.filter_prefix="filter_";SYNO.SDS.SupportForm.ServicePanel.superclass.constructor.call(this,a)},processReturnData:function(d,c,b){for(var a=0;a<c.result.length;a++){if(c.result[a].api=="SYNO.Core.SupportForm.Service"&&c.result[a].method=="get"){if(c.result[a].data.expiredate!=="--"){c.result[a].data.expiredate='<font class="syno-supportform-expire">'+c.result[a].data.expiredate+"</font>"}this.updateFilterComponent(c.result[a].data.app_list)}}SYNO.SDS.SupportForm.ServicePanel.superclass.processReturnData.call(this,d,c,b)},processParams:function(e,d){var c={},b;if("set"!==e){return SYNO.SDS.SupportForm.ServicePanel.superclass.processParams.call(this,e,d)}if(!Ext.isArray(d)||!Ext.isObject(d[0])||"set"!==d[0].method||Ext.isEmpty(d[0].params)){return d}b=d[0].params;for(var a in b){if(!a.startsWith(this.filter_prefix)){c[a]=b[a]}}d[0].params=c;return d},updateFilterComponent:function(e){var b=this.cp.getOpenConfig("extra");var c=Ext.isObject(b)?b.pkg_id:"";var a=this.getComponent("log_fieldset"),d=[];if(Ext.isEmpty(a)||Ext.isEmpty(e)){return}if(!Ext.isEmpty(this.filterComponent)){a.remove(this.filterComponent);delete this.filterComponent}e.each(function(f){d.push({xtype:"syno_checkbox",itemId:f.id,name:this.filter_prefix+f.id,boxLabel:f.name,checked:f.enable||(f.id===c),listeners:{scope:this,check:this.checkItemEnable}})},this);this.filterComponent=new Ext.form.CheckboxGroup({columns:2,hideLabel:true,items:d,isDirty:function(){return false}});a.insert(1,this.filterComponent);a.doLayout()},getFilterComponent:function(){return this.filterComponent},checkItemEnable:function(){var a=false;this.filterComponent.items.each(function(b){if(b.getValue()){a=true;return false}});Ext.getCmp("log_btn").setDisabled(_S("demo_mode")||!a)}});Ext.ns("SYNO.SDS.SupportForm");SYNO.SDS.SupportForm.FormModule=Ext.extend(SYNO.SDS.SupportForm.Module,{constructor:function(a){SYNO.SDS.SupportForm.FormModule.superclass.constructor.call(this);this.createPanel(a)},getPanel:function(){return this.panel},createPanel:function(a){var b={cp:a.cp,module:this,border:false,frame:false,autoScroll:false,autoFlexcroll:false,header:false,useDefaultBtn:false,webapi:{api:"SYNO.Core.SupportForm.Form",methods:{get:"get",set:"set"},version:1},layout:"fit",items:[{xtype:"syno_panel",region:"center",itemId:"form_iframe",padding:"0 0 0 0",id:"form_iframe",name:"form_iframe",hidden:true,autoFlexcroll:false,html:String.format('<iframe id="iframe_form" src="about:blank" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%"></iframe>')}]};this.panel=new SYNO.SDS.SupportForm.FormPanel(b)},activate:function(){this.cp.setStatusBusy();this.panel.loadForm()},deactivate:function(){this.panel.el.unmask();Ext.getDom("iframe_form").src="about:blank"}});SYNO.SDS.SupportForm.FormPanel=Ext.extend(SYNO.SDS.Utils.FormPanel,{constructor:function(a){SYNO.SDS.SupportForm.FormPanel.superclass.constructor.call(this,a)},processReturnData:function(d,c,b){for(var a=0;a<c.result.length;a++){if(c.result[a].api=="SYNO.Core.SupportForm.Form"&&c.result[a].method=="get"){this.getFormCB(c.result[a].data)}}},getFormCB:function(e){var f=String.format("{0}//{1}/webapi/entry.cgi?api=SYNO.Core.SupportForm.Form&method=upload&version=1",window.location.protocol,window.location.host);var b;var d="";var c="";var a=this.cp.getOpenConfig("extra");if(a){d=a.pkg_id;c=a.pkg_version}if(Ext.getDom("iframe_form").src==="about:blank"){var g=setTimeout((function(){this.el.mask(_T("support_center","error_connect"),"syno-ux-mask-info");this.cp.clearStatusBusy();Ext.getCmp("form_iframe").setVisible(false);Ext.getDom("iframe_form").src="about:blank"}).createDelegate(this),60000);Ext.EventManager.on(Ext.getDom("iframe_form"),"load",function(){if(g){clearTimeout(g);g=null;Ext.getCmp("form_iframe").setVisible(true);this.cp.clearStatusBusy()}else{if(Ext.getDom("iframe_form").src==="about:blank"){Ext.EventManager.removeAll(Ext.getDom("iframe_form"))}else{var h;Ext.EventManager.removeAll(Ext.getDom("iframe_form"));h=Ext.decode(Ext.getDom("iframe_form").contentWindow.document.body.innerHTML);Ext.getCmp("form_iframe").setVisible(false);Ext.getDom("iframe_form").src="about:blank";if(h.success){if(h.data.msg!==""){this.cp.getMsgBox().alert(_T("support_center","title"),h.data.msg)}else{if(h.data.attach){this.cp.getMsgBox().alert(_T("support_center","title"),_T("support_center","send_attach"))}else{this.cp.getMsgBox().alert(_T("support_center","title"),_T("support_center","success_send_form"))}}}else{if(h.error.code==4703){this.cp.getMsgBox().alert(_T("support_center","title"),h.error.errors.result.msg)}else{if(h.error.code==4701){this.cp.getMsgBox().alert(_T("support_center","title"),_T("support_center","error_connect"))}else{this.cp.getMsgBox().alert(_T("support_center","title"),_T("support_center","error_system"))}}}this.loadForm()}}},this);b={dsm_user:this._S("user"),sn:e.sn,model:e.model,dsm_version:e.version,timestamp:e.timestamp,lang:_S("lang"),supportform_version:2,isbeta:false,isdemo:this._S("demo_mode")?true:false,pkg_id:d,pkg_version:c,user_agnet:navigator.userAgent,url:Ext.urlAppend(f)};this.sendWebAPI({api:"SYNO.Core.MyDSCenter.Account",method:"get",version:1,scope:this,callback:function(h,i){if(true===h&&Ext.isDefined(i.email)){b.my_ds_username=i.email}Ext.getDom("iframe_form").setAttribute("src",String.format("https://account.synology.com/support/dsm_supportform/index.php?{0}",Ext.urlEncode(b)))}})}else{this.cp.clearStatusBusy()}}});
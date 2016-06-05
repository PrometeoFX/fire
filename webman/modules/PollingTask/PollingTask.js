/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.namespace("SYNO.SDS.PollingTask");Ext.define("SYNO.SDS.PollingTask.Application",{extend:"SYNO.SDS.AppInstance",initInstance:function(a){this.trayItem=this.trayItem||[];if(!this.trayItem[0]){this.trayItem[0]=new SYNO.SDS.PollingTask.Tray({appInstance:this});this.addInstance(this.trayItem[0]);this.trayItem[0].open(a)}}});Ext.define("SYNO.SDS.PollingTask.Tray",{extend:"SYNO.SDS.Tray.ArrowTray",initPanel:function(){return new SYNO.SDS.PollingTask.Panel({module:this,baseURL:this.jsConfig.jsBaseURL})}});Ext.define("SYNO.SDS.PollingTask.Panel",{extend:"SYNO.SDS.Tray.Panel",id:Ext.id(),blEnableClick:false,storeId:"DiskPortDisabledTray",lastSeen:0,lastRead:0,pollTask:null,pollTaskConfig:null,pollingInterval:5*1000,externalDeviceJson:null,constructor:function(a){this.cgiURL="modules/PollingTask/polling.cgi";this.gcList=[];this.callParent([Ext.apply({hidden:true,floating:true,shadow:false,title:_T("disk_info","disk_disable_title"),width:320,height:300,cls:"sds-port-disabled-panel",renderTo:document.body,layout:"fit",items:this.dataView=new SYNO.ux.FleXcroll.DataView({itemSelector:"div.item",emptyText:"No Disabled Disk Ports.",itemId:"dataview",singleSelect:true,autoScroll:true,store:new Ext.data.JsonStore({autoDestroy:true,storeId:this.storeId,root:"diskList",fields:["disk_name","disk_type","disk_num","disk_port_num"]}),listeners:{click:{fn:this.nodeClick,scope:this,buffer:80}},tpl:new Ext.XTemplate('<tpl for=".">','<div class="item">','<span class = "sds-eject-device-button"></span>','<div class="sds-port-disabled-icon" style="float: left;"></div><div class="title">{[this.localize(this.getDisplayName(values))]}</div>',"{[this.getDisplayContent(values)]}","</div>","</div>","</tpl>","</div>",{compiled:true,disableFormats:true,localize:this.localizeMsg.createDelegate(this,[false],true),localizeNoTags:this.encodedMsg.createDelegate(this,[true],true),getDisplayName:this.getDisplayName.createDelegate(this),getDisplayContent:this.getDisplayContent.createDelegate(this)})})},a)]);Ext.StoreMgr.get(this.storeId).removeAll();this.pollTaskConfig={interval:this.pollingInterval,autoJsonDecode:true,url:this.cgiURL,method:"POST",params:{action:"load",load_disabled_port:true},scope:this,success:this.loadData};this.initialPolling=true;this.pollTask=this.addAjaxTask(this.pollTaskConfig).start(true);this.mon(SYNO.SDS.StatusNotifier,"redirect",this.pollTask.stop,this.pollTask);this.mon(SYNO.SDS.StatusNotifier,"halt",this.pollTask.stop,this.pollTask)},getDisplayName:function(b){var a="";switch(b.disk_type){case"internalDisk":a=_T("disk_info","disk_disable_info_num_int").replace("{0}",b.disk_port_num);break;case"expansionUnit":a=_T("disk_info","disk_disable_info_num_eunit").replace("{0}",b.disk_port_num).replace("{1}",b.disk_num);break;case"eSataDisk":a=_T("disk_info","disk_disable_info_num_esata").replace("{0}",b.disk_num);break}return this.encodedMsg(a)},getDisplayContent:function(b){var a=String.format('<a href="#" onclick="Ext.getCmp(\''+this.id+'\').enableClick()" style="color:#0a7bcc">{0}</a>',_T("disk_info","disk_en"));var c=b.disk_type=="eSataDisk"?String.format(_T("disk_info","disk_en_info_esata"),a):String.format(_T("disk_info","disk_en_info"),a);return String.format('<div class="msg"> {0}</div>',c)},nodeClick:function(f,b,c,d){var a=this.dataView.getRecord(c);if(this.blEnableClick){this.enablePort(a);this.blEnableClick=false}a=null},enableClick:function(){this.blEnableClick=true},enablePort:function(b){var a=this;if(!b){return}a.hide();a.getMsgBox().confirm(_T("disk_info","disk_disable_title"),_T("disk_info","disk_en_warn"),function(c,d){if(c=="yes"){this.doEnableAction(b)}},this)},getMsgBox:function(b){var a=this;if(!a.msgBox||a.msgBox.isDestroyed){a.msgBox=new SYNO.SDS.MessageBoxV5({modal:true,draggable:false,renderTo:document.body})}return a.msgBox.getWrapper()},doEnableAction:function(a){var b={action:"apply",disk_name:a.get("disk_name")};Ext.Ajax.request({url:this.cgiURL,params:b,scope:this,success:function(c,e){var d=Ext.util.JSON.decode(c.responseText);if(!d.success){this.module.getMsgBox().alert(_T("disk_info","disk_disable_title"),_T("common","error_system"))}},failure:function(c,d){this.module.getMsgBox().alert(_T("disk_info","disk_disable_title"),_T("common","error_system"))}})},localizeMsg:function(e,b){var c=[];if(!Ext.isArray(e)){e=[e]}for(var a=0;a<e.length;a++){c.push(SYNO.SDS.Utils.GetLocalizedString(e[a]))}var d=String.format.apply(String,c);if(b){return Ext.util.Format.stripTags(d)}else{return d}},encodedMsg:function(b,a){return Ext.util.Format.htmlEncode(this.localizeMsg(b,a))},onShow:function(){SYNO.SDS.PollingTask.Panel.superclass.onShow.apply(this,arguments);var a=this.externalDeviceJson;this.loadJsonData(a)},loadData:function(b,e){var d=this,c=null,a=null,f=false;if(!b.success){return}b.data=b.data||{};d.externalDeviceJson=b;c=b.data.packages;if(c){if(!d.packages){f=true}else{for(a in d.packages){if(!c[a]){f=true;break}}if(!f){for(a in c){if(!d.packages[a]){f=true;break}}}}}if(f){d.packages=c;if(!this.initialPolling){SYNO.SDS.StatusNotifier.fireEvent("thirdpartychanged")}}this.initialPolling=false;if(!Ext.isArray(b.data.diskList)||!b.data.diskList.length){d.hideTray();return}d.loadJsonDataByPolling(b)},hideTray:function(){var a=this;Ext.StoreMgr.get(a.storeId).removeAll();a.module.setTaskButtonVisible(false);a.hide()},haveRecord:function(a){var b,e=a.length,d,c;for(b=0;b<e;b++){c=a[b];d=c.disk_type;if(!d){continue}return true}return false},loadJsonDataByPolling:function(a){var b=this;if(!b.haveRecord(a.data.diskList)){b.hideTray()}else{b.module.setTaskButtonVisible(true)}b.loadJsonData(a)},loadJsonData:function(b){var c=this;if(c.isVisible()){var a=Ext.StoreMgr.get(c.storeId);a.loadData(b.data)}},beforeDestroy:function(){var a=this;SYNO.SDS.PollingTask.Panel.superclass.beforeDestroy.call(a);if(a.msgBox&&!a.msgBox.isDestroyed){a.msgBox.destroy();delete a.msgBox}delete a.externalDeviceJson}});
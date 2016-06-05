/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.namespace("SYNO.SDS.App.WCacheLostMessageApp");SYNO.SDS.App.WCacheLostMessageApp.Instance=Ext.extend(SYNO.SDS.AppInstance,{shouldNotifyMsg:function(a,b){this.win.show();return false},initInstance:function(a){if(!this.win){this.win=new SYNO.SDS.App.WCacheLostMessageApp.DiskScan({appInstance:this});this.addInstance(this.win);this.win.setTitle(_T("hddsleep","dcache_miss_notification"))}if(_S("shouldAskForWCacheLostScan")===true){this.win.show()}},onOpen:function(a){this.initInstance(a)}});SYNO.SDS.App.WCacheLostMessageApp.DiskScan=Ext.extend(SYNO.SDS.AppWindow,{resetAskForDiskScan:function(){Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"removeAskForWCacheLostScan"},method:"POST",success:function(a,b){},failure:function(a,b){},scope:this})},changeCheckBoxHandler:function(b,a){if(Ext.getCmp(this.diskScanCheckboxID).getValue()===true){Ext.getCmp(this.rebootLaterButtonID).enable();Ext.getCmp(this.rebootNowButtonID).enable();Ext.getCmp(this.ignoreButtonID).disable()}else{Ext.getCmp(this.rebootLaterButtonID).disable();Ext.getCmp(this.rebootNowButtonID).disable();Ext.getCmp(this.ignoreButtonID).enable()}},sendConfirmVolumeRemap:function(){if(Ext.getCmp(this.diskScanCheckboxID).getValue()===true){this.setStatusBusy();Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"doDiskScan"},method:"POST",success:function(a,b){this.clearStatusBusy()},failure:function(a,b){this.clearStatusBusy();this.setStatusError()},scope:this})}},ignoreHandler:function(){this.hide()},reboot:function(){SYNO.SDS.System.Reboot()},rebootNowHandler:function(){this.sendConfirmVolumeRemap();this.reboot();this.hide()},rebootLaterHandler:function(){this.sendConfirmVolumeRemap();this.hide()},constructor:function(b){this.owner=b.owner;this.module=b.module;this.panel=this.createPanel();this.form=this.panel.getForm();var a=Ext.apply({title:_T("volume","raid_force_notification"),width:560,height:330,minimizable:false,maximizable:false,showHelp:false,resizable:false,cls:"syno-diskremap",items:[this.panel],buttons:[{xtype:"syno_button",btnStyle:"blue",text:_T("volume","volume_scan_reboot_immediately"),id:this.rebootNowButtonID=Ext.id(),handler:this.rebootNowHandler,scope:this},{xtype:"syno_button",text:_T("volume","volume_scan_reboot_later"),id:this.rebootLaterButtonID=Ext.id(),handler:this.rebootLaterHandler,scope:this},{xtype:"syno_button",text:_T("common","alt_ignore"),id:this.ignoreButtonID=Ext.id(),handler:this.ignoreHandler,scope:this}]},b);SYNO.SDS.App.WCacheLostMessageApp.DiskScan.superclass.constructor.call(this,a);this.on("beforeclose",function(c){this.hide();return false});this.on("beforeshow",function(c){this.resetAskForDiskScan();Ext.getCmp(this.diskScanCheckboxID).setValue(false);Ext.getCmp(this.rebootLaterButtonID).disable();Ext.getCmp(this.rebootNowButtonID).disable();Ext.getCmp(this.ignoreButtonID).enable();return true})},createPanel:function(){var a={border:false,items:[{xtype:"syno_displayfield",id:this.diskScanLabelID=Ext.id(),value:_T("hddsleep","dcache_notification_reboot")},{xtype:"syno_displayfield",value:_T("hddsleep","dcache_notification_note")},{xtype:"syno_displayfield",value:""},{xtype:"syno_checkbox",id:this.diskScanCheckboxID=Ext.id(),handler:this.changeCheckBoxHandler,boxLabel:_T("hddsleep","dcache_confirmed"),scope:this}]};return new Ext.form.FormPanel(a)}});
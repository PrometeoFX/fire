/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.namespace("SYNO.SDS.App.DiskMessageApp");SYNO.SDS.App.DiskMessageApp.Instance=Ext.extend(SYNO.SDS.AppInstance,{shouldNotifyMsg:function(a,b){this.win.show();return false},initInstance:function(a){if(!this.win){this.win=new SYNO.SDS.App.DiskMessageApp.DiskScan({appInstance:this});this.addInstance(this.win);this.win.setTitle(_T("volume","volume_scan_notification"))}if(_S("shouldAskForRemapScan")===true){this.win.show()}},onOpen:function(a){this.initInstance(a)}});SYNO.SDS.App.DiskMessageApp.DiskScan=Ext.extend(SYNO.SDS.AppWindow,{resetAskForDiskScan:function(){Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"removeAskForRemapScan"},method:"POST",success:function(a,b){},failure:function(a,b){},scope:this})},changeCheckBoxHandler:function(b,a){if(Ext.getCmp(this.diskScanCheckboxID).getValue()===true){Ext.getCmp(this.rebootLaterButtonID).enable();Ext.getCmp(this.rebootNowButtonID).enable();Ext.getCmp(this.ignoreButtonID).disable()}else{Ext.getCmp(this.rebootLaterButtonID).disable();Ext.getCmp(this.rebootNowButtonID).disable();Ext.getCmp(this.ignoreButtonID).enable()}},sendConfirmVolumeRemap:function(){if(Ext.getCmp(this.diskScanCheckboxID).getValue()===true){this.setStatusBusy();Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"doDiskScan"},method:"POST",success:function(a,b){this.clearStatusBusy()},failure:function(a,b){this.clearStatusBusy();this.setStatusError()},scope:this})}},ignoreHandler:function(){this.hide()},reboot:function(){SYNO.SDS.System.Reboot()},rebootNowHandler:function(){this.sendConfirmVolumeRemap();this.reboot();this.hide()},setRebootAfterRebuild:function(){Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"rebootAfterRebuild"},method:"POST",success:function(a,b){},failure:function(a,b){},scope:this},this)},rebootAfterRebuildHandler:function(){this.sendConfirmVolumeRemap();this.setRebootAfterRebuild();this.hide()},rebootLaterHandler:function(){this.sendConfirmVolumeRemap();this.hide()},constructor:function(b){this.owner=b.owner;this.module=b.module;this.panel=this.createPanel();this.form=this.panel.getForm();var a=Ext.apply({title:_T("volume","volume_scan_notification"),width:560,height:330,minimizable:false,maximizable:false,showHelp:false,resizable:false,cls:"syno-diskremap",items:[this.panel],buttons:[{xtype:"syno_button",btnStyle:"blue",text:_T("volume","volume_scan_reboot_immediately"),id:this.rebootNowButtonID=Ext.id(),handler:this.rebootNowHandler,scope:this},{xtype:"syno_button",text:_T("volume","volume_scan_reboot_later"),id:this.rebootLaterButtonID=Ext.id(),handler:this.rebootLaterHandler,scope:this},{xtype:"syno_button",text:_T("common","alt_ignore"),id:this.ignoreButtonID=Ext.id(),handler:this.ignoreHandler,scope:this}]},b);SYNO.SDS.App.DiskMessageApp.DiskScan.superclass.constructor.call(this,a);this.on("beforeclose",function(c){this.hide();return false});this.on("beforeshow",function(d){var c;if(!Ext.isDefined(this.launchAppLinkID)){this.launchAppLinkID=Ext.id()}c=String.format('<a href="#" id="{0}")>{1}</a>',this.launchAppLinkID,_T("log","log_viewer_title"));this.resetAskForDiskScan();Ext.getCmp(this.diskScanCheckboxID).setValue(false);Ext.getCmp(this.rebootLaterButtonID).disable();Ext.getCmp(this.rebootNowButtonID).disable();Ext.getCmp(this.ignoreButtonID).enable();Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"isBuilding"},method:"POST",success:function(e,f){var g=Ext.decode(e.responseText);if(g.isBuilding){Ext.getCmp(this.diskScanLabelID).setValue(String.format(_T("volume","volume_scan_wait4building"),c));Ext.getCmp(this.rebootNowButtonID).setText(_T("volume","volume_scan_reboot_after_rebuild"));Ext.getCmp(this.rebootNowButtonID).setHandler(this.rebootAfterRebuildHandler,this)}else{Ext.getCmp(this.diskScanLabelID).setValue(String.format(_T("volume","volume_scan"),c));Ext.getCmp(this.rebootNowButtonID).setText(_T("volume","volume_scan_reboot_immediately"));Ext.getCmp(this.rebootNowButtonID).setHandler(this.rebootNowHandler,this)}},failure:function(e,f){},scope:this},this);return true})},createPanel:function(){var a={border:false,items:[{xtype:"syno_displayfield",id:this.diskScanLabelID=Ext.id()},{xtype:"syno_displayfield",value:""},{xtype:"syno_checkbox",id:this.diskScanCheckboxID=Ext.id(),handler:this.changeCheckBoxHandler,boxLabel:_T("volume","volume_scan_confirmed"),scope:this}]};return new Ext.form.FormPanel(a)}});
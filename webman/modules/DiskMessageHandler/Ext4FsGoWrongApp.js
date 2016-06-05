/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.namespace("SYNO.SDS.App.Ext4FsGoWrongApp");SYNO.SDS.App.Ext4FsGoWrongApp.Instance=Ext.extend(SYNO.SDS.AppInstance,{shouldNotifyMsg:function(a,b){this.win.show();return false},initInstance:function(a){if(!this.win){this.win=new SYNO.SDS.App.Ext4FsGoWrongApp.DiskScan({appInstance:this});this.addInstance(this.win);this.win.setTitle(_T("volume","volume_fsck_notification"))}Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"shouldAskForFsckScan"},method:"POST",success:function(b,c){var d=Ext.decode(b.responseText);if(true===d.shouldAskForFsckScan){this.win.show()}},failure:function(b,c){},scope:this})},onOpen:function(a){this.initInstance(a)}});SYNO.SDS.App.Ext4FsGoWrongApp.DiskScan=Ext.extend(SYNO.SDS.AppWindow,{resetAskForDiskScan:function(){Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"removeAskForFsckScan"},method:"POST",success:function(a,b){},failure:function(a,b){},scope:this})},sendConfirmVolumeRemap:function(){this.setStatusBusy();Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"doDiskScan"},method:"POST",success:function(a,b){this.clearStatusBusy()},failure:function(a,b){this.clearStatusBusy();this.setStatusError()},scope:this})},ignoreHandler:function(){this.hide()},reboot:function(){SYNO.SDS.System.Reboot()},rebootNowHandler:function(){this.sendConfirmVolumeRemap();this.reboot();this.hide()},setRebootAfterRebuild:function(){Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"rebootAfterRebuild"},method:"POST",success:function(a,b){},failure:function(a,b){},scope:this},this)},rebootAfterRebuildHandler:function(){this.sendConfirmVolumeRemap();this.setRebootAfterRebuild();this.hide()},rebootLaterHandler:function(){this.sendConfirmVolumeRemap();this.hide()},runVolumeScanHandler:function(){var a=this.form.getValues().reboot_scan;if("now"===a){this.rebootNowHandler()}else{if("wait"===a){this.rebootAfterRebuildHandler()}else{this.rebootLaterHandler()}}},constructor:function(b){this.owner=b.owner;this.module=b.module;this.panel=this.createPanel();this.form=this.panel.getForm();var a=Ext.apply({title:_T("volume","volume_fsck_notification"),width:560,height:330,minimizable:false,maximizable:false,showHelp:false,resizable:false,cls:"syno-diskremap",items:[this.panel],buttons:[{xtype:"syno_button",text:_T("common","run"),btnStyle:"blue",id:this.runVolumeScanButtonID=Ext.id(),handler:this.runVolumeScanHandler,scope:this},{xtype:"syno_button",text:_T("common","alt_ignore"),id:this.ignoreButtonID=Ext.id(),handler:this.ignoreHandler,scope:this}]},b);SYNO.SDS.App.Ext4FsGoWrongApp.DiskScan.superclass.constructor.call(this,a);this.on("beforeclose",function(c){this.hide();return false});this.on("beforeshow",function(d){var c;if(!Ext.isDefined(this.launchAppLinkID)){this.launchAppLinkID=Ext.id()}c=String.format('<a href="#" id="{0}" class="link-font">{1}</a>',this.launchAppLinkID,_T("log","log_viewer_title"));this.resetAskForDiskScan();Ext.getCmp(this.runVolumeScanButtonID).enable();Ext.getCmp(this.ignoreButtonID).enable();Ext.Ajax.request({url:this.jsConfig.jsBaseURL+"/touchVolumeRemap.cgi",params:{action:"isBuilding"},method:"POST",success:function(e,f){var g=Ext.decode(e.responseText);if(g.isBuilding){Ext.getCmp(this.diskScanLabelID).setValue(String.format(_T("volume","volume_fsck_wait4building"),c));Ext.getCmp(this.rebootScanNowRadioID).hide();Ext.getCmp(this.rebootScanAfterRebuildRadioID).show();Ext.getCmp(this.rebootScanAfterRebuildRadioID).setValue(true)}else{Ext.getCmp(this.diskScanLabelID).setValue(String.format(_T("volume","volume_fsck"),c));Ext.getCmp(this.rebootScanAfterRebuildRadioID).hide();Ext.getCmp(this.rebootScanNowRadioID).show();Ext.getCmp(this.rebootScanNowRadioID).setValue(true)}this.mon(Ext.fly(this.launchAppLinkID),"click",function(){SYNO.SDS.AppLaunch("SYNO.SDS.LogCenter.Instance",{fn:"SYNO.SDS.LogCenter.LogSearch"})},this)},failure:function(e,f){},scope:this},this);return true})},createPanel:function(){var a={border:false,items:[{xtype:"syno_displayfield",id:this.diskScanLabelID=Ext.id()},{xtype:"syno_displayfield",value:""},{xtype:"syno_radio",boxLabel:_T("volume","volume_scan_reboot_after_rebuild"),id:this.rebootScanAfterRebuildRadioID=Ext.id(),name:"reboot_scan",hidden:true,inputValue:"wait"},{xtype:"syno_radio",boxLabel:_T("volume","volume_scan_reboot_immediately"),id:this.rebootScanNowRadioID=Ext.id(),name:"reboot_scan",checked:true,inputValue:"now"},{xtype:"syno_radio",boxLabel:_T("volume","volume_scan_reboot_later"),id:this.rebootScanLaterRadioID=Ext.id(),name:"reboot_scan",inputValue:"later"}]};return new Ext.form.FormPanel(a)}});
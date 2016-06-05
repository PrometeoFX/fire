/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.namespace("SYNO.SDS.StorageUtils");SYNO.SDS.StorageUtils=function(){var a=SYNO.SDS.Utils.StorageUtils.UiRenderHelper;return{ISCSITRG_UNIT_GB:SYNO.SDS.Utils.StorageUtils.ISCSITRG_UNIT_GB,SpaceIDParser:SYNO.SDS.Utils.StorageUtils.SpaceIDParser,GetSizeGB:SYNO.SDS.Utils.StorageUtils.GetSizeGB,SizeRenderWithFloor:a.SizeRenderWithFloor,GetSizeUnitWithFloor:a.GetSizeUnitWithFloor,SizeRender:a.SizeRender,GetSizeUnit:a.GetSizeUnit,StatusRender:a.StatusRender,LunStatusRender:a.LunStatusRender,StatusNameRender:a.StatusNameRender,ProgressRender:a.ProgressRender,WarningTextRender:a.WarningTextRender,StepNameRender:a.StepNameRender,PercentRender:a.PercentRender,RaidLevelRender:a.RaidLevelRender,SpaceTypeRender:a.SpaceTypeRender,DeviceTypeRender:a.DeviceTypeRender,ParseID:a.ParseID,DiskIDRender:a.DiskIDRender,DiskStatusRender:a.DiskStatusRender,DiskSwapStatusRender:a.DiskSwapStatusRender,smartStatusRender:a.smartStatusRender,AddDiskTypeRender:a.AddDiskTypeRender,MigrateTypeRender:a.MigrateTypeRender,TargetStatusRender:a.TargetStatusRender,SpareStatusRender:a.SpareStatusRender,SnapShotStatusRender:a.SnapShotStatusRender,getErrorMsg:a.getErrorMsg,decodeResponse:a.decodeResponse,htmlEncoder:a.htmlEncoder,htmlDecoder:a.htmlDecoder,getServiceNames:a.getServiceNames,getVolumeNames:a.getVolumeNames,getNamesString:a.getNamesString,disableServices:a.disableServices,DiskTemperatureRender:a.DiskTemperatureRender,DiskSummaryStatusRender:a.DiskSummaryStatusRender}}();SYNO.SDS.StorageUtils.TipTemplate=Ext.extend(Ext.XTemplate,{constructor:function(a){SYNO.SDS.StorageUtils.TipTemplate.superclass.constructor.call(this,"{[this.getText(values."+a+")]}")},getText:function(c){var a="";var b="";if(Ext.isObject(c)){if(Ext.isString(c.tip)){a=Ext.util.Format.htmlEncode(c.tip)}else{a=Ext.util.Format.htmlEncode(c.text)}if(Ext.isDefined(SYNO.SDS.StorageUtils.TipTemplate.TEXT_LENGTH)){b=Ext.util.Format.ellipsis(c.text,SYNO.SDS.StorageUtils.TipTemplate.TEXT_LENGTH)}else{b=c.text}return String.format('<span ext:qtip="{0}">{1}</span>',a,b)}else{return c}}});SYNO.SDS.StorageUtils.TipTemplate.TEXT_LENGTH=undefined;SYNO.SDS.StorageUtils.TipRenderer=function(b,a){a.attr='ext:qtip="'+Ext.util.Format.htmlEncode(b)+'"';return b};SYNO.SDS.StorageUtils.check=function(){var a,b;for(a=0;a<arguments.length;a++){b=arguments[a];if(Ext.isFunction(b)&&!b.call(this)){return false}else{if(Ext.isString(b)&&!this[b]()){return false}}}return true};SYNO.SDS.StorageUtils.isAnyMatched=function(){var a=arguments;return -1!==this.findBy(function(b){return b.check.apply(b,a)})};SYNO.SDS.StorageUtils.getMatched=function(){var b=arguments;var a,d,c=[];for(a=0;a<this.getCount();a++){d=this.getAt(a);if(d.check.apply(d,b)){c.push(d)}}return c};SYNO.SDS.StorageUtils.FormatSuggestion=function(a){var c=_T("volume",a.str);var b=a.arg;if(typeof b=="undefined"||b===null){return c}else{return c.replace(/\{(\d+)\}/g,function(d,e){return b[e]})}};SYNO.SDS.StorageUtils.IsAnyMappedTargetConnected=function(d,a){var c=false;var b;Ext.each(a,function(e){if("connected"!==e.get("status")){return true}for(b=0;b<e.get("mapped_luns").length;b++){if(d.lid===e.get("mapped_luns")[b]){c=true;return false}}});return c};SYNO.SDS.StorageUtils.HARemoteCheckErrParsing=function(c){var d="";var a="";var b;if(!_S("ha_running")){return}if(true===c.ha_remote_disk_failed){if(0<c.ha_remote_size_err_disks.size()){a="";for(b=0;b<c.ha_remote_size_err_disks.size();b++){a+=SYNO.SDS.HA.HADiskIndexRenderer(c.ha_remote_size_err_disks[b]);if(b!=c.ha_remote_size_err_disks.size()-1){a+=", "}}d+=String.format(_TT("SYNO.SDS.HA.Instance","wizard","error_disk_size"))+"<br>";d+=a}if(0<c.ha_remote_size_err_disks.size()&&0<c.ha_remote_type_err_disks.size()){d+="<br>"}if(0<c.ha_remote_type_err_disks.size()){a="";for(b=0;b<c.ha_remote_type_err_disks.size();b++){a+=SYNO.SDS.HA.HADiskIndexRenderer(c.ha_remote_type_err_disks[b]);if(b!=c.ha_remote_type_err_disks.size()-1){a+=", "}}d+=String.format(_TT("SYNO.SDS.HA.Instance","wizard","error_disk_type"))+"<br>";d+=a}if((0<c.ha_remote_size_err_disks.size()||0<c.ha_remote_type_err_disks.size())&&0<c.ha_remote_log_sect_size_err_disks.size()){d+="<br>"}if(0<c.ha_remote_log_sect_size_err_disks.size()){a="";for(b=0;b<c.ha_remote_log_sect_size_err_disks.size();b++){a+=SYNO.SDS.HA.HADiskIndexRenderer(c.ha_remote_log_sect_size_err_disks[b]);if(b!=c.ha_remote_log_sect_size_err_disks.size()-1){a+=", "}}d+=String.format(_TT("SYNO.SDS.HA.Instance","wizard","error_disk_log_sect_size"))+"<br>";d+=a}}if(true===c.ha_remote_space_failed){if(""!==d){d+="<br> <br>"}d+=_TT("SYNO.SDS.HA.Instance","wizard","error_passive_space_unmatched")}if(true===c.ha_remote_memory_size_mismatch){if(""!==d){d+="<br> <br>"}d+=_TT("SYNO.SDS.HA.Instance","ui","error_fcache_memsize")}if(""===d){d=_TT("SYNO.SDS.HA.Instance","ui","error_passive_not_online")}c.text=d};Ext.namespace("SYNO.SDS.StorageManager.ISCSI");SYNO.SDS.StorageManager.ISCSI.DefaultIQN="iqn.2000-01.com.synology:default.acl";SYNO.SDS.StorageManager.ISCSI.FAKE_PWD="1234567890AB";SYNO.SDS.StorageManager.ISCSI.FAKE_PWDC="BA0987654321";SYNO.SDS.StorageManager.ISCSI.Util=function(){return{SetActionLunParentStatus:function(b){var a=function(d,e){var c;Ext.each(d,function(f){if(e===f.iscsi_lun.lid){c=f;return false}});return c};Ext.each(b,function(d){var c;if("cloning"===d.status){c=a(b,d.iscsi_lun.parent.plid);if(Ext.isDefined(c)&&!c.is_actioning){c.status="using";c.is_actioning=true}}})},LunParentRender:function(d,a){var f,c,e,b;if(!Ext.isObject(a.parent)||a.lid===a.parent.plid){return false}f=d.getMatched(function(){if(this.get("iscsi_lun").lid===a.parent.plid){return true}});if(0===f.length){return false}c=f[0].get("iscsi_lun");e=c.name;if(0===a.parent.psid){return e}Ext.each(c.snapshots,function(g){if(a.parent.psid===g.sid){b=g.name;return false}});if(b){return e+" / "+b}else{return e}},SupportSnapshot:function(){if("yes"===_D("support_vaai","no")&&"lio"===_D("iscsi_target_type","lio")){return true}return false},genNewSnapShotName:function(c){var b="SnapShot-",a=b.length,d=0;Ext.each(c,function(e){var f=parseInt(e.name.slice(a),10);if(d<f){d=f}});d=d+1;return b+d},isUpToiSCSISnapShotActionCount:function(c){var a=SYNO.SDS.StorageManager.Limits.MAX_SNAPSHOT_ACTIONING_COUNT,b,d=0;Ext.each(c,function(e){b=e.get("status");if(!e.get("iscsi_lun").vaai_support){return true}if("cloning"===b||"restoring"===b){d=d+1}else{Ext.each(e.get("iscsi_lun").snapshots,function(f){if("creating"===f.status.type){d=d+1}})}});return d>=a},renderPermission:function(b){var a={rw:_T("share","share_permission_writable"),r:_T("share","share_permission_readonly"),"-":_T("share","share_permission_none")};if(b in a){return a[b]}else{return b}},renderIQN:function(c,b){var a=(SYNO.SDS.StorageManager.ISCSI.DefaultIQN===c)?_T("iscsitrg","iscsitrg_masking_default"):c;if(b){b.attr='ext:qtip="'+Ext.util.Format.htmlEncode(a)+'"'}return a}}}();
/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.namespace("SYNO.SDS.App.PersonalSettings");SYNO.SDS.App.PersonalSettings.OTPWizard=Ext.extend(SYNO.SDS.Wizard.ModalWindow,{next_step:null,WIZRAD_HEIGHT:500,constructor:function(b){this.welcomeStep=new SYNO.SDS.App.PersonalSettings.OTPWizard.WelcomeStep({itemId:"welcome",nextId:"qrcode"});this.qrcodeStep=new SYNO.SDS.App.PersonalSettings.OTPWizard.QRcodeStep({itemId:"qrcode",nextId:"authenticate"});this.authStep=new SYNO.SDS.App.PersonalSettings.OTPWizard.AuthStep({itemId:"authenticate",nextId:"mail"});this.mailStep=new SYNO.SDS.App.PersonalSettings.OTPWizard.MailStep({itemId:"mail",nextId:"finish"});this.finishStep=new SYNO.SDS.App.PersonalSettings.OTPWizard.FinishStep({itemId:"finish",nextId:null});var a=[this.welcomeStep,this.qrcodeStep,this.authStep,this.mailStep,this.finishStep];SYNO.SDS.App.PersonalSettings.OTPWizard.superclass.constructor.call(this,Ext.apply({title:_T("personal_settings","otp_wizard_title"),showHelp:false,width:650,height:this.WIZRAD_HEIGHT,steps:a},b))},onOpen:function(){this.setActiveStep("welcome");SYNO.SDS.App.PersonalSettings.OTPWizard.superclass.onOpen.apply(this,arguments)},displayError:function(a){var b=_T("error","error_error_system");if(a===4207){b=_T("personal_settings","failed_to_set_ldap_otp_mail")}else{if(a===4208){b=_T("personal_settings","otp_auth_failed")}}this.getMsgBox().alert(this.title,b)},setNextStep:function(a,b){if(0>this.stepStack.indexOf(a)){this.stepStack.push(a)}if(Ext.isString(b)){this.stepStack.push(b)}},onClose:function(){var a=this.getActiveStep();if(a.itemId==="mail"){this.getButton("cancel").hide();this.getButton("back").hide();this.getButton("next").setText(_T("common","close"));this.setActiveStep("finish");return false}else{if(!this.module){return}}if(this.triggerCheckbox){this.triggerCheckbox.setValue(this.module.OTPenabled)}if(this.module.otp_settings_btn){this.module.otp_settings_btn.setDisabled(!this.module.OTPenabled)}}});SYNO.SDS.App.PersonalSettings.OTPWizard.WelcomeStep=Ext.extend(SYNO.SDS.Wizard.WelcomeStep,{constructor:function(b){var a=Ext.apply({headline:_T("personal_settings","otp_welcome_step_title"),description:_T("personal_settings","otp_welcome_step_desc"),disableNextInDemoMode:true},b);SYNO.SDS.App.PersonalSettings.OTPWizard.WelcomeStep.superclass.constructor.call(this,a)},getNext:function(){var a=this._S("user");a=a.replace(/\\/g,"/");this.owner.setStatusBusy({text:_T("common","saving")});this.sendWebAPI({api:"SYNO.Core.OTP",method:"get_qrcode",version:2,params:{account:a+"@"+this._S("hostname")},callback:function(d,b,c){this.owner.clearStatusBusy();if(!d){this.owner.displayError();return}this.owner.secretKey=b.key;this.owner.QRcodeImg=b.img;this.owner.qrcodeStep.load();this.owner.goNext(this.nextId)},scope:this});return false}});SYNO.SDS.App.PersonalSettings.OTPWizard.MailStep=Ext.extend(SYNO.ux.FormPanel,{constructor:function(b){var a=Ext.apply({headline:_T("personal_settings","otp_mail_step_title"),items:[{xtype:"syno_displayfield",value:_T("personal_settings","otp_mail_step_desc")},{xtype:"syno_displayfield",value:""},{xtype:"syno_textfield",name:"OTP_mail",maxlength:512,width:250,vtype:"email",fieldLabel:_T("user","user_email"),allowBlank:false}],keys:[{key:[10,13],scope:this,handler:this.getNext}]},b);SYNO.SDS.App.PersonalSettings.OTPWizard.MailStep.superclass.constructor.call(this,a)},load:function(){var a=this.owner.mail;this.form.findField("OTP_mail").setValue(a);this.form.findField("OTP_mail").clearInvalid()},requestSMTP:function(){this.owner.needCheckSMTP=false;this.owner.getMsgBox().confirm(this.title,_T("notification","mail_service_not_enable"),function(a){if(a==="yes"){SYNO.SDS.AppLaunch("SYNO.SDS.AdminCenter.Application",{fn:"SYNO.SDS.AdminCenter.Notification.Main"})}else{this.getNext()}},this)},confirmLDAPChange:function(){if(this.changeConfirmed){return true}this.owner.getMsgBox().confirm(this.title,_T("personal_settings","confirm_ldap_mail_change"),function(a){this.changeConfirmed=(a==="yes")?true:false;if(this.changeConfirmed){this.getNext()}},this)},getNext:function(){if(this.owner.needCheckSMTP){this.requestSMTP();return false}else{if(!this.form.findField("OTP_mail").isValid()){return false}else{if(_S("authType")==="ldap"&&!this.confirmLDAPChange()){return false}}}var a=this.form.findField("OTP_mail").getValue();var b=_S("user");b=b.replace(/\\/g,"/");if(this.owner.accountMailField){this.owner.accountMailField.setValue(a)}this.owner.setStatusBusy({text:_T("common","saving")});this.sendWebAPI({api:"SYNO.Core.OTP",method:"save_mail",version:2,params:{mail:a},callback:function(e,c,d){this.owner.clearStatusBusy();if(!e){this.owner.displayError(c.code);if(c.code!==4207){return false}}this.owner.goNext(this.nextId);this.owner.getButton("cancel").hide();this.owner.getButton("back").hide();this.owner.getButton("next").setText(_T("common","close"))},scope:this});return false}});SYNO.SDS.App.PersonalSettings.OTPWizard.QRcodeStep=Ext.extend(SYNO.ux.FormPanel,{constructor:function(b){var a=Ext.apply({headline:_T("personal_settings","otp_qrcode_step_title"),items:[{xtype:"syno_displayfield",value:String.format(_T("personal_settings","otp_install_app_desc"),_T("personal_settings","otp_support_apps_link"))},{xtype:"syno_displayfield",value:String.format(_T("personal_settings","otp_scan_qrcode_desc"),'(<a class="pathlink">'+_T("personal_settings","otp_enter_manually_link")+"</a>)"),listeners:{render:function(d){var c=d.el.first("a.pathlink");if(c){this.mon(c,"click",this.launchEditDialog,this)}},scope:this,single:true,buffer:80}},{html:'<img id = "qrcode_img" src="" width="120" height="120" />',border:false,style:"text-align: center;"}]},b);SYNO.SDS.App.PersonalSettings.OTPWizard.QRcodeStep.superclass.constructor.call(this,a)},load:function(){var a=Ext.get("qrcode_img");a.dom.src="data:image/png;base64,"+this.owner.QRcodeImg},getNext:function(){this.owner.authStep.load();return this.nextId},launchEditDialog:function(){var a=new SYNO.SDS.App.PersonalSettings.OTPWizard.QRcodeStep.EditDialog({owner:this.owner});a.show()}});SYNO.SDS.App.PersonalSettings.OTPWizard.QRcodeStep.EditDialog=Ext.extend(SYNO.SDS.ModalWindow,{constructor:function(a){Ext.apply(this,a||{});var b={owner:this.owner,width:430,height:220,minWidth:430,minHeight:220,shadow:true,collapsible:false,title:_T("personal_settings","otp_wizard_title"),layout:"fit",trackResetOnLoad:true,forceSelection:true,waitMsgTarget:true,border:false,items:this.panel=this.initPanel(),buttons:[{text:_T("common","apply"),scope:this,handler:this.onApply},{text:_T("common","cancel"),scope:this,handler:this.close}]};SYNO.SDS.App.PersonalSettings.OTPWizard.QRcodeStep.EditDialog.superclass.constructor.call(this,b)},initPanel:function(){var c=_S("user");c=c.replace(/\\/g,"/");var b={itemId:"otp_edit_panel",border:false,items:[{xtype:"syno_displayfield",value:_T("personal_settings","otp_edit_desc")},{xtype:"syno_textfield",fieldLabel:_T("personal_settings","otp_account_name"),name:"account_name",labelWidth:150,value:c+"@"+_S("hostname"),allowBlank:false},{xtype:"syno_displayfield",labelWidth:150,hideLabel:false,fieldLabel:_T("personal_settings","otp_secret_key"),name:"edit_secret_key",value:this.owner.secretKey}]};var a=new Ext.form.FormPanel(b);return a},getForm:function(){return this.panel.form},onApply:function(){if(!this.getForm().findField("account_name").isValid()){return false}var a=this.getForm().findField("account_name").getValue();a=a.replace(/\\/g,"/");var b={secretKey:this.getForm().findField("edit_secret_key").getValue(),account:a};this.sendWebAPI({api:"SYNO.Core.OTP",method:"edit_secret_key",version:2,params:b,callback:function(e,c,d){if(!e){this.owner.displayError();return false}this.owner.QRcodeImg=c.img;this.owner.secretKey=c.key;this.owner.qrcodeStep.load();this.close()},scope:this})}});SYNO.SDS.App.PersonalSettings.OTPWizard.AuthStep=Ext.extend(SYNO.ux.FormPanel,{constructor:function(b){var a=Ext.apply({headline:_T("personal_settings","otp_auth_step_title"),items:[{xtype:"syno_displayfield",value:_T("personal_settings","otp_auth_step_desc")},{xtype:"syno_displayfield",value:""},{xtype:"syno_textfield",name:"OTP_auth",width:200,labelWidth:230,fieldLabel:_T("personal_settings","otp_auth_field"),emptyText:_T("personal_settings","otp_auth_field"),maxLength:6,regex:new RegExp("[0-9]{6}"),regexText:_T("personal_settings","otp_err_auth_code"),allowBlank:false}],keys:[{key:[10,13],scope:this,handler:this.getNext}]},b);SYNO.SDS.App.PersonalSettings.OTPWizard.AuthStep.superclass.constructor.call(this,a)},load:function(){this.getForm().findField("OTP_auth").reset()},getNext:function(){if(!this.getForm().findField("OTP_auth").isValid()){return false}var a=this.form.findField("OTP_auth").getValue();var b={code:a};this.owner.setStatusBusy({text:_T("common","saving")});this.sendWebAPI({api:"SYNO.Core.OTP",method:"auth_tmp_code",version:2,params:b,callback:function(e,c,d){this.owner.clearStatusBusy();if(!e){this.owner.displayError(c.code);return false}if(this.owner.module){this.owner.module.OTPenabled=true}if(this.owner.needCheckSMTP!==false){this.owner.needCheckSMTP=c.check_smtp}this.owner.mailStep.load();this.owner.goNext(this.nextId);this.owner.getButton("back").hide();this.owner.getButton("cancel").setText(_T("common","skip"))},scope:this});return false}});SYNO.SDS.App.PersonalSettings.OTPWizard.FinishStep=Ext.extend(SYNO.ux.FormPanel,{constructor:function(b){var a=Ext.apply({headline:_T("personal_settings","otp_finish_step_title"),items:[{xtype:"syno_displayfield",value:_T("personal_settings","otp_finish_step_desc")}]},b);SYNO.SDS.App.PersonalSettings.OTPWizard.FinishStep.superclass.constructor.call(this,a)},getNext:function(){return this.nextId}});
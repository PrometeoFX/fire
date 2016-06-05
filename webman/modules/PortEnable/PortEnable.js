/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.define("SYNO.SDS.PortEnable.Instance",{extend:"SYNO.SDS.AppInstance",initInstance:function(a){if(!this.win){SYNO.SDS.StatusNotifier.addListener("thirdpartychanged",this.portCheck,this);SYNO.SDS.StatusNotifier.addListener("servicechanged",this.portCheck,this);SYNO.SDS.StatusNotifier.addListener("checkserviceblocked",this.portCheck,this);this._serviceName=[];this._serviceInfo=[];this.win=new SYNO.SDS.PortEnable.Dialog({appInstance:this});this.addInstance(this.win);this.win.alignTo(document.body,"c-c");this.checkTask=new Ext.util.DelayedTask()}},portCheck:function(b,a){if(!(b instanceof Array)){if(b&&'"'===b[0]&&'"'===b[b.length-1]){b=b.slice(b.indexOf('"')+1,b.lastIndexOf('"'))}}switch(a){case"checkserviceblocked":b.map(function(c){this._serviceName.push(c)},this);this.checkTask.delay(500,this.isPortBlock,this,["isDirectID"]);break;case"install":this.isPkgEnable(b);break;case"start":this._serviceName.push(b);this.isPortBlock("package");break;case true:this._serviceName.push(b);this.checkTask.delay(500,this.isPortBlock,this,["service"]);break}},isPkgEnable:function(a){var b={};b.action="isPkgEnable";b.name=a;this.addAjaxTask({url:"modules/PortEnable/portenable.cgi",method:"POST",autoJsonDecode:true,single:true,params:Ext.util.JSON.encode(b),scope:this,success:function(c,d){if(c.success){if(true===c.data.pkgEnable){this._serviceName.push(a);this.isPortBlock("package")}}},failure:function(c,d){}}).start()},isPortBlock:function(a){var b={};b.action="isPortBlock";b.name=this._serviceName;b.isPkg=("package"===a)?true:false;b.isDirectID=("isDirectID"===a)?true:false;this.addAjaxTask({url:"modules/PortEnable/portenable.cgi",method:"POST",autoJsonDecode:true,single:true,params:Ext.util.JSON.encode(b),scope:this,success:function(c,d){if(c.success){if(c.data.portcheck&&!c.data.isPortAllow){SYNO.SDS.PortEnable.serviceInfoParsing(c.data,this._serviceInfo);this.win.store.loadData(this._serviceInfo,false);this.win.formPanel.getForm().findField("noprompt").setValue(false);this.win.open()}}else{this.win.getMsgBox().alert(_T("firewall","firewall_port_management"),_T(c.errinfo.sec,c.errinfo.key))}},failure:function(c,d){this.win.getMsgBox().alert(_T("firewall","firewall_port_management"),_T("common","error_system"))}}).start();this._serviceName.length=0}});Ext.define("SYNO.SDS.PortEnable.Dialog",{extend:"SYNO.SDS.Window",constructor:function(a){var b=this.fillConfig(a);this.callParent([b])},fillConfig:function(a){this.descPanel=this.createDescPanel();this.gridPanel=this.createGridPanel();this.formPanel=this.createFormPanel();var b={title:_T("firewall","firewall_port_management"),closable:false,maximizable:false,resizable:false,dsmStyle:"v5",height:340,width:700,items:[this.descPanel,this.gridPanel,this.formPanel],buttons:[{xtype:"syno_button",btnStyle:"blue",text:_T("common","apply"),handler:this.onAllow,scope:this},{xtype:"syno_button",text:_T("common","cancel"),handler:this.onClose,scope:this}]};Ext.apply(b,a);b=this.addStatusBar(b);return b},createDescPanel:function(){var a={height:50,border:false,layout:"form",trackResetOnLoad:true,items:[{xtype:"syno_displayfield",value:_T("firewall","firewall_port_block_info"),indent:1}]};return new SYNO.ux.FormPanel(a)},createFormPanel:function(){var a={border:false,layout:"form",trackResetOnLoad:true,items:[{xtype:"syno_checkbox",name:"noprompt",boxLabel:_T("firewall","firewall_no_prompt"),indent:1},{xtype:"syno_displayfield",fieldLabel:"Note",hideLabel:true,indent:1,value:'<span class="syno-ux-note">Note: </span>'+String.format(_T("firewall","firewall_no_prompt_desc"),'<a class="link-font" id="'+Ext.id()+'" href="javascript: void(0)">'+_T("controlpanel","leaf_firewall")+"</a>"),listeners:{render:function(c){var b=c.el.first("a");if(b){this.mon(b,"click",function(){SYNO.SDS.AppLaunch("SYNO.SDS.AdminCenter.Application",{fn:"SYNO.SDS.AdminCenter.Security.Main",tab:"FirewallTab"});this.toFront()},this)}},scope:this,single:true,buffer:80}}]};return new SYNO.ux.FormPanel(a)},createGridPanel:function(){var c=function(g,f){f.attr='ext:qtip="'+Ext.util.Format.htmlEncode(g)+'"';return g};this.store=new Ext.data.ArrayStore({autoDestroy:true,fields:["enabled","id","name","ports","desc","protocol"],data:[]});var b={header:_T("firewall","firewall_policy_allow"),dataIndex:"enabled",width:80,menuDisabled:true,align:"center"};var e=new SYNO.ux.EnableColumn(b);var a=new Ext.grid.ColumnModel([e,{width:120,header:_T("firewall","firewall_system_port_column_desc"),dataIndex:"desc",align:"center",sortable:true,renderer:c},{header:_T("firewall","firewall_protocol"),dataIndex:"protocol",width:125,align:"center",sortable:true,renderer:c},{header:_T("firewall","firewall_ports"),width:125,dataIndex:"ports",sortable:true,align:"center",renderer:c},{header:_T("pkgmgr","pkgmgr_pkg_description"),width:225,dataIndex:"name",align:"center",sortable:true,renderer:c}]);var d={height:140,ds:this.store,cm:a,loadMask:false,cls:"without-dirty-red-grid",enableColLock:true,enableColumnMove:false,enableHdMenu:false,selModel:new Ext.grid.RowSelectionModel({}),plugins:[e]};return new SYNO.ux.GridPanel(d)},onAllow:function(){var a=this.getAllowSection();var b={};if(0===a.length&&!this.formPanel.getForm().findField("noprompt").getValue()){this.onClose();return}this.setStatusBusy({text:_T("common","saving")});b.action="openBlockPort";b.sectionList=a;b.prompt=!this.formPanel.getForm().findField("noprompt").getValue();this.addAjaxTask({url:"modules/PortEnable/portenable.cgi",method:"POST",autoJsonDecode:true,single:true,params:Ext.util.JSON.encode(b),scope:this,success:function(c,d){this.clearStatusBusy();if(c.success){this.onClose()}else{this.getMsgBox().alert(this.title,_T(c.errinfo.sec,c.errinfo.key),function(e){if("ok"===e){this.onClose()}},this)}},failure:function(c,d){this.clearStatusBusy();this.getMsgBox().alert(_T("firewall","firewall_port_management"),_T("common","error_system"))}}).start()},getAllowSection:function(){var a=[];this.store.each(function(b){if(true===b.get("enabled")){a.push(b.get("id"))}});return a},onClose:function(){this.hide()}});SYNO.SDS.PortEnable.serviceInfoParsing=function(e,b){if(!e||!e.services){return false}var h=e.services;var c;var a="";var f="";var g="";var j=[];b.length=0;for(var d=0;d<h.length;d++){g="";c=h[d];if(-1<j.indexOf(c.id)){continue}if(""!==c.name.section&&""!==c.name.key){a=_T(c.name.section,c.name.key)}else{a=c.name.defaultStr}if(""!==c.desc.section&&""!==c.desc.key){f=_T(c.desc.section,c.desc.key)}else{f=c.desc.defaultStr}g=c.dst_ports.join();b.push([true,c.id,a,g,f,c.protocol]);j.push(c.id)}return true};
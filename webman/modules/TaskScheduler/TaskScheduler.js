/* Copyright (c) 2015 Synology Inc. All rights reserved. */

Ext.namespace("SYNO.SDS.TaskScheduler");SYNO.SDS.TaskScheduler.CGIURL="modules/TaskScheduler/task.cgi";SYNO.SDS.TaskScheduler.TaskSchedulerWidget=Ext.extend(SYNO.SDS._Widget.GridPanel,{autoExpandColumn:"task_name",constructor:function(a){this.cgiHandler=SYNO.SDS.TaskScheduler.CGIURL;SYNO.SDS.TaskScheduler.TaskSchedulerWidget.superclass.constructor.apply(this,arguments)},getColumnModel:function(){if(this.cmTaskScheduler){return this.cmTaskScheduler}var a=new Ext.grid.ColumnModel({columns:[{width:38,id:"enabled",dataIndex:"enabled",renderer:this.iconRenderer.createDelegate(this)},{id:"task_name",dataIndex:"task_name",renderer:this.nameRenderer.createDelegate(this)},{id:"next_trigger_time",dataIndex:"next_trigger_time",width:150,renderer:this.timeRenderer.createDelegate(this)}]});this.cmTaskScheduler=a;return a},iconRenderer:function(c,a,b){return(c===true)?'<div class = "syno-taskscheduler-enable-taskicon"></div>':'<div class = "syno-taskscheduler-disable-taskicon"></div>'},nameRenderer:function(d,b,c){var a=Ext.util.Format.htmlEncode(d);b.attr+='ext:qtip="'+Ext.util.Format.htmlEncode(a)+'"';return a},timeRenderer:function(c,b){var a=Ext.util.Format.htmlEncode(c);b.attr+='ext:qtip="'+Ext.util.Format.htmlEncode(a)+'"';return a},getStore:function(){if(this.dsTaskScheduler){return this.dsTaskScheduler}var a=new Ext.data.Store({proxy:new Ext.data.HttpProxy({url:this.cgiHandler,method:"POST"}),reader:new Ext.data.JsonReader({root:"items",totalProperty:"total"},["enabled","id","can_run","app","task_name","app_name","simple_edit_form","edit_form","edit_dialog","action","next_trigger_time"]),remoteSort:true,sortInfo:{field:"next_trigger_time",direction:"ASC"},baseParams:{action:"enum",only_enable:0,start:0,limit:this.TotalRecords},autoDestroy:false,autoLoad:false});this.dsTaskScheduler=a;this.addManagedComponent(a);return a},getUpdateParams:function(){var a={action:"enum",only_enable:0,start:0,limit:this.TotalRecords,sort:"next_trigger_time"};return a},onBeforeUpdate:function(a){if(a.data.total===0){this.getEl().mask(_T("widget","widget_schedule_no_task"))}else{this.getEl().unmask()}a.total=a.data.total>this.TotalRecords?this.TotalRecords:a.data.total;a.items=a.data.items}});
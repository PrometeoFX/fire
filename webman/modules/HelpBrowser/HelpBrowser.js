/* All rights reserved. */

Ext.define("SYNO.SDS.HelpBrowser.DisplaySettingDlg", {
    extend: "SYNO.SDS.ModalWindow",
    constructor: function(a) {
        this.callParent([this.fillConfig(a)])
    },
    fillConfig: function(a) {
        var b = {
            width: 450,
            height: 230,
            title: _T("mainmenu", "apptitle"),
            items: [{
                xtype: "syno_formpanel",
                itemId: "setting",
                items: [{
                    xtype: "syno_displayfield",
                    hideLabel: true,
                    value: _T("helpbrowser", "auto_launch_desc")
                }, {
                    name: "noAutoLaunch",
                    xtype: "syno_checkbox",
                    checked: SYNO.SDS.UserSettings.getProperty("SYNO.SDS.HelpBrowser.Application", "nolaunch") || false,
                    boxLabel: _T("helpbrowser", "no_auto_launch")
                }]
            }],
            fbar: {
                toolbarCls: "x-panel-fbar x-statusbar",
                items: [{
                    xtype: "syno_button",
                    text: _T("common", "ok"),
                    btnStyle: "blue",
                    handler: this.saveSettings,
                    scope: this
                }, {
                    xtype: "syno_button",
                    text: _T("common", "cancel"),
                    handler: this.close,
                    scope: this
                }]
            }
        };
        Ext.apply(b, a);
        return b
    },
    getSettingForm: function() {
        return this.getComponent("setting")
    },
    getNoLaunchField: function() {
        return this.getSettingForm().getForm().findField("noAutoLaunch")
    },
    saveSettings: function() {
        var a = this.getNoLaunchField().getValue();
        SYNO.SDS.UserSettings.setProperty("SYNO.SDS.HelpBrowser.Application", "launchSetting", true);
        SYNO.SDS.UserSettings.setProperty("SYNO.SDS.HelpBrowser.Application", "nolaunch", a);
        this.close()
    }
});
Ext.namespace("SYNO.SDS.HelpBrowser");
SYNO.SDS.HelpBrowser.Application = Ext.extend(SYNO.SDS.AppInstance, {
    appWindowName: "SYNO.SDS.HelpBrowser.MainWindow",
    constructor: function() {
        SYNO.SDS.HelpBrowser.Application.superclass.constructor.apply(this, arguments)
    }
});
SYNO.SDS.HelpBrowser.History = Ext.extend(Ext.util.Observable, {
    hist: null,
    constructor: function(a) {
        this.addEvents({
            change: true
        });
        this.listeners = a.listeners;
        SYNO.SDS.HelpBrowser.History.superclass.constructor.call(this);
        this.hist = [];
        this.index = -1
    },
    add: function(a) {
        this.index += 1;
        this.hist.splice(this.index, this.hist.length - this.index, a);
        this.fireEvent("change")
    },
    append: function(a) {
        this.index += 1;
        this.hist.splice(this.index, this.hist.length - this.index, a)
    },
    back: function() {
        var a = this.index - 1;
        if (a < this.hist.length && a >= 0) {
            this.index = a;
            this.fireEvent("change")
        }
    },
    getIndex: function() {
        return this.index
    },
    getPreObject: function() {
        var a = this.index;
        if (this.hist && a < this.hist.length && a >= 1) {
            return this.hist[a - 1]
        }
        return null
    },
    getObject: function() {
        var a = this.index;
        if (this.hist && a < this.hist.length && a >= 0) {
            return this.hist[a]
        }
        return null
    },
    isLast: function() {
        return (this.index == this.hist.length - 1)
    },
    forward: function() {
        var a = this.index + 1;
        if (a < this.hist.length && a >= 0) {
            this.index = a;
            this.fireEvent("change")
        }
    },
    destroy: function() {
        this.hist = null
    },
    getFontStr: function(a) {
        return "font=" + a
    },
    changefontSizeForAll: function(a, d) {
        if (a == d) {
            return
        }
        var c = this.getFontStr(a);
        var e = this.getFontStr(d);
        for (var b = 0; b < this.hist.length; b++) {
            this.hist[b].url = this.hist[b].url.replace(c, e)
        }
    },
    changeFontSizeForCurrentObj: function(a, c) {
        if (a == c) {
            return
        }
        var b = this.getFontStr(a);
        var d = this.getFontStr(c);
        this.getObject().url = this.getObject().url.replace(b, d)
    }
});
Ext.define("SYNO.SDS.HelpBrowser.SearchField", {
    extend: "SYNO.SDS.Utils.SearchField",
    listAlign: "tl-bl?",
    setContent: function(a) {
        this.view.getEl().update(a)
    },
    onStoreLoad: function(a) {
        if (!_S("rewriteApp") || (_S("demo_mode") && _S("rewriteApp") === "SYNO.SDS.HelpBrowser.Application")) {
            if (a.reader.jsonData.noindexdb) {
                var c = a.reader.jsonData.msg,
                    b = a.reader.jsonData.error;
                if (c) {
                    this.setContent(_T(c.section, c.key))
                } else {
                    if (b) {
                        this.setContent(_T(b.section, b.key))
                    } else {
                        this.setContent(_T("helptoc", "try_download_indexdb") || "Try to download indexdb")
                    }
                }
            } else {
                SYNO.SDS.HelpBrowser.SearchField.superclass.onStoreLoad.apply(this, arguments)
            }
        } else {
            a.filterBy(function(d) {
                if (d.get("type") === "help" && d.get("owner") === _S("rewriteApp")) {
                    return true
                }
                return false
            })
        }
    }
});
Ext.define("SYNO.SDS.HelpBrowser.OnlineSearchField", {
    extend: "SYNO.SDS.HelpBrowser.SearchField",
    bbarHeight: 54,
    constructor: function(a) {
        var b = new Ext.data.Store({
            autoDestroy: true,
            proxy: new Ext.data.HttpProxy({
                url: a.cgiHandler,
                method: "GET"
            }),
            reader: new Ext.data.JsonReader({
                root: "items",
                id: "_random"
            }, ["id", "title", {
                name: "desc",
                convert: function(d, c) {
                    return String.format(d, _D("product"))
                }
            }, "owner", "topic", "type", "link"]),
            baseParams: {
                action: "findSearchResult",
                dsm: _S("majorversion") + "." + _S("minorversion") + "-" + _S("version"),
                lang: _S("lang"),
                treeNode: Ext.util.JSON.encode(a.owner.treeNodeParam),
                type: "help",
                unique: _D("unique")
            }
        });
        this.callParent([a]);
        this.store = b
    },
    expand: function() {
        this.callParent(arguments);
        if (this.title || this.pageSize || this.list.bottomBar) {
            this.assetHeight = 0;
            if (this.title) {
                this.assetHeight += this.header.getHeight()
            }
            if (this.pageSize) {
                this.assetHeight += this.footer.getHeight()
            }
            if (this.list.bottomBar) {
                this.assetHeight += this.bbarHeight
            }
        }
    },
    initList: function() {
        this.callParent(arguments);
        if (!this.list.bottomBar) {
            this.list.bottomBar = this.list.createChild({
                cls: "x-combo-list-bbar",
                html: '<a target="blank" href="https://www.synology.com/knowledgebase">' + _T("helpbrowser", "tutorial_kb") + "</a>"
            });
            this.assetHeight += this.bbarHeight
        }
    },
    onStoreLoad: function() {
        this.tpl.kbSection = 0;
        this.tpl.helpSection = 0
    },
    setTreeNodeParam: function(a) {
        this.store.baseParams.treeNode = Ext.util.JSON.encode(a)
    }
});
SYNO.SDS.HelpBrowser.MainWindow = Ext.extend(SYNO.SDS.AppWindow, {
    dsmStyle: "v5",
    hbHistory: null,
    firstOpenTopic: "",
    useTopicID: true,
    defaultHomePage: "help/" + _S("lang") + "/Tutorial/home.html",
    blankPage: "help/blank.html",
    HomeId: "SYNO.SDS.Tutorial.Application",
    offline: true,
    noNetwork: false,
    isSendingRequest: false,
    curPlatform: null,
    curModel: null,
    hasTbar: true,
    treeCls: "",
    splitWindow: true,
    constructor: function(a) {
        this.extractDSUniuqe();
        this.treeNodeParam = {
            DSM: _S("majorversion") + "." + _S("minorversion")
        };
        this.hbHistory = new SYNO.SDS.HelpBrowser.History({
            listeners: {
                change: {
                    fn: this.changeURL,
                    scope: this
                }
            }
        });
        SYNO.SDS.HelpBrowser.MainWindow.superclass.constructor.call(this, this.fillConfig(a));
        this.hookHelpFrameMessage();
        this.mon(Ext.get(this.helpFrameID), "load", function() {
            try {
                if (this.checkNetworkURL) {
                    this.detectNetworkTask = new Ext.util.DelayedTask(this.createNetDetectionEl, this, [!this.isStatusOffline()]);
                    this.detectNetworkTask.delay(1000)
                }
                var d = Ext.getDom(this.helpFrameID);
                var b = (this.isStatusOffline()) ? d.contentWindow.location.href : d.src;
                if (b) {
                    if (!this.useTopicID) {
                        this.hbHistory.append({
                            url: b
                        });
                        this.setNavigationBarStatus();
                        this.setTitle(_T("helpbrowser", "apptitle"))
                    }
                }
                if (this.isStatusOffline()) {
                    this.adjustLayout()
                }
            } catch (c) {}
            this.useTopicID = false;
            return true
        }, this);
        this.addManagedComponent(this.hbHistory);
        this.mon(SYNO.SDS.StatusNotifier, "jsconfigLoaded", this.getPkgVersionTask, this)
    },
    fillConfig: function(a) {
        this.helpFrameID = Ext.id();
        this.initTreePanel(a.treeConfig);
        var c = {
            type: "help",
            cgiHandler: this.cgiHandler,
            owner: this,
            listAlign: ["tl-bl", [-4, 0]],
            listClass: "syno-sds-hb-searchfield sds-search-result",
            tpl: new Ext.XTemplate('<tpl for=".">', "<tpl if=\"type == 'kb'\">", '<tpl if="!(this.kbSection++)">', '<tpl if="!(this.helpSection)"><div class="x-combo-list-hd tutorial-title section">{[_T("helpbrowser", "tutorials_faq")]}</div></tpl>', '<tpl if="(this.helpSection)"><div class="x-combo-list-hd tutorial-title with-higher-top-padding section">{[_T("helpbrowser", "tutorials_faq")]}</div></tpl>', "</tpl>", '<div class="kb-result">', '<div class="kb"><div class="goto"></div><a href="{link}" target="_blank" ext:qtip="{title}">{title}</a></div>', "</div>", "</tpl>", "<tpl if=\"type != 'kb'\">", '<tpl if="!(this.helpSection++)"><div class="x-combo-list-hd section">{[_T("common", "search_results")]}</div></tpl>', '<div class="x-combo-list-item">', '<img border=0 align="left" width="16px" height="16px" src="{[SYNO.SDS.Utils.GetAppIcon(values.owner, "TreeIcon") || String.format(this.config.jsBaseURL + "/" + this.config.icon, 16)]}" />', '<table border="0">', "<tr>", '<td class="topic" ext:qtip="{title}"><div>{title}</div></td>', '<td class="module"><div>{[SYNO.SDS.Utils.GetAppTitle(values.owner)]}</div></td>', "</tr>", "</table>", "</div>", "</tpl>", "</tpl>", {
                helpSection: 0,
                kbSection: 0,
                config: this.jsConfig
            }),
            listeners: {
                select: {
                    fn: function(e, g, f) {
                        this.loadTopic(g.get("id"), g)
                    },
                    scope: this
                }
            }
        };
        this.onlineSearchField = new SYNO.SDS.HelpBrowser.OnlineSearchField(Ext.apply({
            itemId: "search",
            title: null
        }, c));
        this.offlineSearchField = new SYNO.SDS.HelpBrowser.SearchField(Ext.apply({
            itemId: "offline_search",
            hidden: true
        }, c));
        this.currentRatio = 100;
        this.xlfontMenuItem = new Ext.menu.CheckItem({
            text: _T("helpbrowser", "font_extra_large"),
            cls: "syno-sds-hb-option",
            group: "fontsize",
            checkHandler: function() {
                if (this.xlfontMenuItem.checked) {
                    this.changeFontSize(2)
                }
            },
            scope: this
        });
        this.lfontMenuItem = new Ext.menu.CheckItem({
            text: _T("helpbrowser", "font_large"),
            cls: "syno-sds-hb-option",
            group: "fontsize",
            checkHandler: function() {
                if (this.lfontMenuItem.checked) {
                    this.changeFontSize(1)
                }
            },
            scope: this
        });
        this.nfontMenuItem = new Ext.menu.CheckItem({
            text: _T("helpbrowser", "font_normal"),
            cls: "syno-sds-hb-option",
            group: "fontsize",
            checked: true,
            checkHandler: function() {
                if (this.nfontMenuItem.checked) {
                    this.changeFontSize(0)
                }
            },
            scope: this
        });
        this.fontsizeMenuItem = new Ext.menu.Item({
            text: _T("helpbrowser", "font_size"),
            tooltip: _T("helpbrowser", "font_size"),
            hideOnClick: false,
            menu: new SYNO.ux.Menu({
                items: [this.xlfontMenuItem, this.lfontMenuItem, this.nfontMenuItem]
            })
        });
        this.helpSynoMenuItem = new Ext.menu.CheckItem({
            text: _T("helpbrowser", "help_from_syno"),
            group: "helpsrc",
            checked: true,
            cls: "syno-sds-hb-option",
            checkHandler: function() {
                if (this.helpSynoMenuItem.checked) {
                    this.changeOnOffLineStatus(false);
                    this.onlineSearchField.show();
                    this.offlineSearchField.hide()
                }
            },
            scope: this
        });
        this.helpDSMenuItem = new Ext.menu.CheckItem({
            text: _T("helpbrowser", "help_from_ds"),
            cls: "syno-sds-hb-option",
            group: "helpsrc",
            checkHandler: function() {
                if (this.helpDSMenuItem.checked) {
                    this.changeOnOffLineStatus(true);
                    this.onlineSearchField.hide();
                    this.offlineSearchField.show()
                }
            },
            scope: this
        });
        this.helpMenuItem = new Ext.menu.Item({
            text: _T("helpbrowser", "help_source"),
            tooltip: _T("helpbrowser", "help_source"),
            hideOnClick: false,
            menu: new SYNO.ux.Menu({
                items: [this.helpSynoMenuItem, this.helpDSMenuItem]
            })
        });
        this.helpSettingItem = new Ext.menu.Item({
            text: _T("helpbrowser", "help_option"),
            tooltip: _T("helpbrowser", "help_option"),
            handler: function() {
                var e = new SYNO.SDS.HelpBrowser.DisplaySettingDlg({
                    owner: this
                });
                e.show()
            },
            scope: this
        });
        var d = new SYNO.ux.Menu({
            items: [this.helpMenuItem, this.fontsizeMenuItem, this.helpSettingItem],
            onMouseOver: function(h) {
                var f = d.findTargetItem(h);
                if (f) {
                    var g = this.scope;
                    if (f == g.helpMenuItem) {
                        if (g.isSendingRequest === false && g.checkNetworkURL) {
                            g.createNetDetectionEl()
                        }
                    }
                    if (f.canActivate && !f.disabled) {
                        d.setActiveItem(f, true)
                    }
                }
                d.over = true;
                d.fireEvent("mouseover", d, h, f)
            },
            scope: this
        });
        this.optionBtn = new SYNO.ux.Button({
            text: _T("common", "webman_options"),
            tooltip: _T("common", "webman_options"),
            hideOnClick: false,
            menu: d
        });
        var b = {
            showHelp: false,
            cls: "syno-sds-hb-container",
            resizable: true,
            maximizable: true,
            y: 0,
            width: 995,
            height: 500,
            minHeight: 300,
            minWidth: 995,
            animCollapse: true,
            animate: true,
            tbar: {
                height: 36,
                cls: "syno-sds-hb-tbar",
                items: [{
                    xtype: "syno_button",
                    itemId: "back",
                    tooltip: _T("common", "prevpage"),
                    iconCls: "syno-sds-hb-tbar-back",
                    disabled: true,
                    width: 32,
                    scope: this,
                    handler: function(f, e) {
                        this.hbHistory.back()
                    }
                }, {
                    xtype: "syno_button",
                    itemId: "next",
                    tooltip: _T("common", "nextpage"),
                    iconCls: "syno-sds-hb-tbar-next",
                    disabled: true,
                    scope: this,
                    width: 32,
                    handler: function(f, e) {
                        this.hbHistory.forward()
                    }
                }, {
                    xtype: "syno_button",
                    itemId: "dsmhelp",
                    hidden: !!_S("rewriteApp"),
                    tooltip: _T("common", "webman_home"),
                    iconCls: "syno-sds-hb-tbar-all",
                    scope: this,
                    width: 40,
                    handler: function(g, f) {
                        var e = (this.isStatusOffline()) ? this.defaultHomePage : this.generateOnlineHomeURL();
                        this.hbHistory.add({
                            id: this.treePanel.root.id,
                            url: e
                        })
                    }
                }, this.optionBtn, {
                    xtype: "box",
                    itemId: "tbar-padding",
                    cls: "syno-sds-hb-tbar-padding",
                    width: 2
                }, this.onlineSearchField, this.offlineSearchField]
            },
            layout: "border",
            items: [this.treePanel, {
                xtype: "panel",
                bodyStyle: "padding-bottom: 5px;",
                region: "center",
                itemId: "help-content-panel",
                html: String.format('<iframe id="{0}" scrolling="no" src="{1}" frameborder="0" style="border: 0px none; width:100%; height: 100%;"></iframe>', this.helpFrameID, Ext.isIE ? this.blankPage : Ext.SSL_SECURE_URL)
            }],
            listeners: {
                afterrender: function() {
                    var f = document.createElement("div");
                    var e = {
                        position: "absolute",
                        top: 0,
                        width: "10px",
                        height: "100%",
                        zIndex: 20,
                        backgroundColor: "transparent"
                    };
                    f.setStyle(e);
                    this.layout.center.el.appendChild(f)
                }
            }
        };
        Ext.apply(b, a);
        return b
    },
    extractDSUniuqe: function() {
        var a = /synology_([A-Za-z0-9]+)_([A-Za-z0-9\+]+)/.exec(_D("unique"));
        this.curPlatform = (a === null) ? null : a[1].toLowerCase();
        this.curModel = (a === null) ? null : a[2].replace(/\+/g, "p").toLowerCase()
    },
    initTreePanel: function(a) {
        this.cgiHandler = this.jsConfig.jsBaseURL + "/HelpBrowser.cgi";
        var b = new Ext.tree.TreeLoader({
            preloadChildren: true,
            dataUrl: this.cgiHandler,
            requestMethod: "GET",
            parentWin: this,
            baseAttrs: {
                tooltip: true
            },
            baseParams: {
                lang: _S("lang"),
                dsm: _S("majorversion") + "." + _S("minorversion") + "-" + _S("version"),
                treeNode: Ext.util.JSON.encode(this.treeNodeParam),
                action: "findTreeList",
                offline: this.offline,
                unique: _D("unique")
            },
            listeners: {
                beforeload: {
                    fn: function(c, d, e) {
                        c.baseParams.offline = this.parentWin.offline;
                        if (!c.parentWin.pkgLoaded) {
                            c.parentWin.getPkgVersionTask();
                            return false
                        }
                        c.baseParams.treeNode = Ext.util.JSON.encode(this.parentWin.treeNodeParam);
                        return true
                    }
                }
            },
            processResponse: function(h, f, q, r) {
                var s = h.responseText;
                try {
                    var c = h.responceData || Ext.decode(s);
                    this.parentWin.offline = (c.online !== true);
                    var l = (!this.parentWin.offline) ? c.data : c;
                    var j = l.length - 1;
                    var p = _S("majorversion") + "." + _S("minorversion"),
                        g = {
                            id: "SYNO.SDS.App.AboutFakeApp",
                            link: "Home/legal_info.html",
                            section: "DSM",
                            text: _T("helptoc", "about"),
                            topic: "Home/legal_info.html",
                            version: p,
                            children: [{
                                id: "SYNO.SDS.App.AboutFakeApp:Home/about.html",
                                leaf: true,
                                link: "Home/about.html",
                                section: "DSM",
                                text: _T("helptoc", "synology_legal"),
                                version: p,
                                topic: "Home/about.html"
                            }, {
                                id: "SYNO.SDS.App.AboutFakeApp:Home/license.html",
                                leaf: true,
                                link: "Home/license.html",
                                section: "DSM",
                                text: _T("helptoc", "open_source_license"),
                                version: p,
                                topic: "Home/license.html"
                            }, {
                                id: "SYNO.SDS.App.AboutFakeApp:Home/codec_licenses.html",
                                leaf: true,
                                link: "Home/codec_licenses.html",
                                section: "DSM",
                                text: _T("helptoc", "codec_licenses"),
                                version: p,
                                topic: "Home/codec_licenses.html"
                            }]
                        };
                    f.beginUpdate();
                    if (l && l[0] && !!_S("rewriteApp")) {
                        l[0].children.push(g)
                    }
                    for (var k = 0; k < j; k++) {
                        var d = this.createNode(l[k]);
                        if (d) {
                            f.appendChild(d)
                        }
                    }
                    f.endUpdate();
                    this.parentWin.onlineBaseURL = l[l.length - 1].onlineURL;
                    this.parentWin.onlineBaseURL = this.parentWin.chageProtocol(this.parentWin.onlineBaseURL);
                    this.parentWin.onlineURL = this.parentWin.onlineBaseURL + "cgi/help/";
                    this.parentWin.checkNetworkURL = this.parentWin.onlineBaseURL + "js/checkNetWorkConnection.js";
                    if (this.parentWin.offline === true) {
                        this.parentWin.helpDSMenuItem.setChecked(true)
                    }
                    this.runCallback(q, r || f, [f])
                } catch (m) {
                    this.handleFailure(h)
                }
            },
            scope: b
        });
        this.treePanel = new SYNO.ux.TreePanel(Ext.apply({
            region: "west",
            collapsible: true,
            title: _T("helpbrowser", "hbtoc"),
            minWidth: 200,
            maxWidth: 360,
            width: 225,
            split: true,
            margins: "0 0 5 0",
            cls: "syno-sds-hb-tree ",
            autoFlexcroll: true,
            updateScrollBarEventNames: ["expandnode", "collapsenode", "resize"],
            loader: b,
            listeners: {
                click: {
                    fn: this.onClickNode,
                    scope: this
                }
            },
            root: new Ext.tree.AsyncTreeNode({
                draggable: false,
                expanded: true,
                id: "source"
            }),
            floatable: false,
            animCollapse: true,
            useArrows: true,
            rootVisible: false,
            pathSeparator: "$"
        }, a));
        this.treePanel.getLoader().on("load", this.onTreeLoaded, this)
    },
    onTreeLoaded: function(b, c) {
        var d = false;
        c.eachChild(function(e) {
            this.doPreload(e)
        }, b);
        c.eachChild(function(e) {
            var g = (this.HomeId === e.id);
            if (g) {
                e.expand()
            }
            var f = e.ui.getIconEl();
            Ext.fly(f).setStyle("display", "none");
            if ("SYNO.SDS.Online.Resource" === e.id) {
                Ext.fly(e.ui.ecNode.parentNode).addClass("x-tree-elbow-empty")
            }
            if (_S("rewriteApp")) {
                return
            }
            if (!g) {
                this.mon(e, "beforeexpand", this.onRootNodeExpand, this, {
                    single: true
                })
            }
        }, this);
        if (this.rewriteAppToic) {
            d = this.loadTopic(this.rewriteAppToic)
        } else {
            if (this.firstOpenTopic) {
                d = this.loadTopic(this.firstOpenTopic)
            }
        }
        if (!d) {
            var a = (this.isStatusOffline()) ? this.defaultHomePage : this.generateOnlineHomeURL();
            this.hbHistory.add({
                id: this.treePanel.root.id,
                url: a
            })
        }
    },
    onRootNodeExpand: function(e) {
        if (!e.childrenRendered) {
            e.renderChildren();
            e.sort(this.sortNodes)
        }
        for (var b = 0; b < e.childNodes.length; b++) {
            var a, d = SYNO.SDS.Utils.GetAppIcon(e.childNodes[b].id, "TreeIcon");
            if (d) {
                a = e.childNodes[b].ui.getIconEl();
                var c = {
                    "background-image": "url(" + d + ")",
                    "background-size": String.format("{0}px", SYNO.SDS.UIFeatures.IconSizeManager.TreeIcon)
                };
                Ext.fly(a).setStyle(c)
            }
        }
    },
    getPkgVersionTask: function() {
        this.sendWebAPI({
            api: "SYNO.Package",
            method: "list",
            version: 1,
            params: {
                additional: ["dsm_apps", "status"]
            },
            callback: this.storePkgVersion,
            scope: this
        })
    },
    storePkgVersion: function(g, e, f, d) {
        if (g === true) {
            var b;
            this.treeNodeParam = {};
            this.pkgsInfo = [];
            for (b = 0; b < e.packages.length; b++) {
                if (e.packages[b].additional.status !== "running") {
                    continue
                }
                var c = /(\d+)\.(\d+)/,
                    a;
                a = c.exec(e.packages[b].version);
                if (Ext.isArray(a)) {
                    a = a[0]
                } else {
                    a = e.packages[b].version
                }
                e.packages[b].version = a;
                this.pkgsInfo.push(e.packages[b]);
                this.treeNodeParam[e.packages[b].id] = a
            }
            this.treeNodeParam.DSM = _S("majorversion") + "." + _S("minorversion");
            this.pkgLoaded = true;
            if (this.onlineSearchField) {
                this.onlineSearchField.setTreeNodeParam(this.treeNodeParam)
            }
            this.reloadTree()
        }
    },
    getVersionByID: function(f) {
        var c, b, e, d, a;
        a = f.indexOf(":");
        if (a <= 0) {
            a = f.length
        }
        d = f.substring(0, a);
        if (this.pkgsInfo) {
            for (c = 0; c < this.pkgsInfo.length; c++) {
                e = this.pkgsInfo[c].additional.dsm_apps.split(" ");
                for (b = 0; b < e.length; b++) {
                    if (d === e[b]) {
                        return this.pkgsInfo[c].version
                    }
                }
            }
        }
        return -1
    },
    isStatusOffline: function() {
        return this.offline
    },
    createNetDetectionEl: function(a) {
        this.isSendingRequest = true;
        a = a || false;
        if (this.detectEl) {
            Ext.removeNode(this.detectEl)
        }
        var d = document.createElement("script");
        d.type = "text/javascript";
        var c = function(e) {
            if (!e.parentElement) {
                return
            }
            var f = Ext.getCmp(e.parentElement.id);
            f.helpSynoMenuItem.setDisabled(true);
            if (!f.isStatusOffline()) {
                f.helpDSMenuItem.setChecked(true);
                if (a === true) {
                    f.getMsgBox().alert(_T("error", "error_error"), _T("helpbrowser", "help_no_internet"))
                }
            }
            f.noNetwork = true;
            f.isSendingRequest = false
        };
        var b = function(e) {
            if (!e.parentElement) {
                return
            }
            var f = Ext.getCmp(e.parentElement.id);
            f.helpSynoMenuItem.setDisabled(false);
            f.noNetwork = false;
            f.isSendingRequest = false;
            checkNetWorkConnectionPageLoaded = false
        };
        d.src = this.checkNetworkURL + "?rand=" + Math.floor((Math.random() * 1000) + 1);
        this.detectEl = d;
        this.getEl().appendChild(this.detectEl);
        this.detectEl.task = new Ext.util.DelayedTask(function() {
            if (typeof checkNetWorkConnectionPageLoaded == "undefined" || checkNetWorkConnectionPageLoaded === false) {
                c(d)
            } else {
                b(d)
            }
        });
        this.detectEl.task.delay(10 * 1000)
    },
    adjustLayout: function() {
        var a = this.getHelpDocBodyEl();
        a.style.fontSize = this.currentRatio + "%";
        Ext.fly(a).addClass("model-" + this.curModel);
        Ext.fly(a).addClass("platform-" + this.curPlatform)
    },
    changeOnOffLineStatus: function(a) {
        if (a === this.offline) {
            return
        }
        this.offline = a;
        delete this.hbHistory;
        this.hbHistory = new SYNO.SDS.HelpBrowser.History({
            listeners: {
                change: {
                    fn: this.changeURL,
                    scope: this
                }
            }
        });
        this.reloadTree()
    },
    getHelpFrameDoc: function() {
        var b = Ext.getDom(this.helpFrameID),
            a = Ext.isIE ? b.contentWindow.document : b.contentDocument;
        return a
    },
    getHelpDocBodyEl: function() {
        var b = this.getHelpFrameDoc(),
            a = b.getElementsByTagName("body")[0];
        return a
    },
    changeOnlineFontSize: function(a) {
        this.hbHistory.changeFontSizeForCurrentObj(this.currentRatio, a);
        this.changeURL();
        this.hbHistory.changefontSizeForAll(this.currentRatio, a);
        this.currentRatio = a
    },
    changeOfflineFontSize: function(b) {
        var a = this.getHelpDocBodyEl();
        a.style.fontSize = b + "%";
        Ext.fly(a).dom.fleXcroll.updateScrollBars()
    },
    changeFontSize: function(b) {
        var a = 100 + b * 25;
        if (this.isStatusOffline()) {
            this.changeOfflineFontSize(a)
        } else {
            this.changeOnlineFontSize(a)
        }
        this.currentRatio = a
    },
    isDemoHelpMode: function() {
        return _S("demo_mode") && (_S("rewriteApp") === "SYNO.SDS.HelpBrowser.Application") ? true : false
    },
    sortNodes: function(e, d) {
        var g = 999,
            f = 999,
            h, c = ["SYNO.SDS.Tutorial.Application", "SYNO.SDS.App.PersonalSettings.Instance", "SYNO.SDS.AdminCenter.Application", "SYNO.SDS.PkgManApp.Instance", "SYNO.SDS.App.FileStation3.Instance", "SYNO.SDS.StorageManager.Instance", "SYNO.SDS.HA.Instance", "SYNO.SDS.AHA.Instance", "SYNO.SDS.DisasterRecovery.Application", "SYNO.SDS.Backup.Application", "SYNO.SDS.ResourceMonitor.Instance", "SYNO.SDS.StorageReport.Application", "SYNO.SDS.LogCenter.Instance", "SYNO.SDS.ACEEditor.Application", "SYNO.SDS.SecurityScan.Instance", "SYNO.SDS.MyDSCenter.Application", "SYNO.SDS.SupportForm.Application", "SYNO.SDS.App.AboutFakeApp"];
        if (!e || !e.text || !d || !d.text) {
            return
        }
        g = c.indexOf(e.id);
        f = c.indexOf(d.id);
        h = parseInt(g - f, 10);
        return (h)
    },
    bringAppToFront: function() {
        SYNO.SDS.iFrameAppToFront("SYNO.SDS.HelpBrowser.Application")
    },
    hookHelpFrameMessage: function() {
        var b = this,
            a = function(d) {
                var c = b.hbHistory.getObject();
                if (c) {
                    c.url = d.data
                }
            };
        if (window.addEventListener) {
            window.addEventListener("message", a, false)
        } else {
            window.attachEvent("onmessage", a)
        }
        b.handelMsgPost = a
    },
    hookHelpDocMouseDown: function(a) {
        if (window.addEventListener) {
            a.body.addEventListener("mousedown", this.bringAppToFront, false)
        } else {
            a.body.attachEvent("onmousedown", this.bringAppToFront)
        }
    },
    findNodeWithTopic: function(b) {
        var a = b.findChildBy(function(c) {
            if (c.attributes.topic) {
                return true
            }
            return false
        }, this, true);
        return a
    },
    chageProtocol: function(a) {
        var b = a;
        if (window.location.protocol == "https:") {
            b = a.replace("http:", "https:")
        }
        return b
    },
    generateOfflineURL: function(b, a) {
        a = a.replace("%pseudonode", "");
        return this.getTopicUrlBase(b) + _S("lang") + "/" + a
    },
    generateOnlineHomeURL: function() {
        var b = {
            action: "findHelpFile",
            dsm: _S("majorversion") + "." + _S("minorversion") + "-" + _S("version"),
            version: _S("majorversion") + "." + _S("minorversion"),
            section: "dsm",
            lang: _S("lang"),
            unique: _D("unique"),
            link: "Tutorial/home.html",
            font: this.currentRatio
        };
        var a = this.onlineURL + "?" + Ext.urlEncode(b);
        return a
    },
    generateOnlineURL: function(c, b) {
        var d = this.getTopicUrlBase(c),
            a;
        d = d.replace("help/", "");
        d = d.replace("3rdparty/", "");
        d = d.replace("/", "");
        if (d.length === 0) {
            d = "dsm"
        }
        var e = {
            action: "findHelpFile",
            dsm: _S("majorversion") + "." + _S("minorversion") + "-" + _S("version"),
            section: d,
            lang: _S("lang"),
            link: b,
            font: this.currentRatio,
            unique: _D("unique"),
            version: (d === "dsm") ? _S("majorversion") + "." + _S("minorversion") : this.getVersionByID(c.id)
        };
        a = this.onlineURL + "?" + Ext.urlEncode(e);
        return a
    },
    getSubStringForPath: function(b) {
        var e = b.indexOf("link="),
            d = b.indexOf(".html") + 5,
            a = b.substring(e, d),
            c = a.indexOf("/../"),
            f;
        if (-1 !== c) {
            f = a.substring(5, c + 4);
            a = a.replace(f, "")
        }
        return a
    },
    setURLFromNode: function(c) {
        var b = c.attributes.topic;
        if (b) {
            var a;
            if (this.isStatusOffline()) {
                a = this.generateOfflineURL(c, b)
            } else {
                a = this.generateOnlineURL(c, b)
            }
            this.hbHistory.add({
                id: c.id,
                url: a
            })
        }
    },
    setURLHash: function(c) {
        var b = this,
            a = null;
        if (b.isDemoHelpMode()) {
            a = c.attributes.topic;
            if (a) {
                window.location.hash = "#" + SYNO.Util.Base64.encode(c.id)
            }
        }
    },
    onClickNode: function(a, b) {
        a.expand();
        this.setURLFromNode(a);
        this.setURLHash(a)
    },
    setURL: function(a) {
        Ext.getDom(this.helpFrameID).src = a
    },
    getCurrentURL: function() {
        var a = Ext.getDom(this.helpFrameID);
        if (a) {
            return a.src
        }
        return ""
    },
    changeURL: function() {
        var b = this.hbHistory.getObject();
        if (b && b.url) {
            this.useTopicID = true;
            this.setURL(b.url);
            var a = this.treePanel.getNodeById(b.id);
            if (a) {
                this.treePanel.selectPath(a.getPath());
                this.setURLHash(a);
                this.setTitle(_T("helpbrowser", "apptitle") + (a.text ? (" - " + a.text) : ""))
            } else {
                this.treePanel.selectPath("$source");
                this.setTitle(_T("helpbrowser", "apptitle"))
            }
        }
        this.setNavigationBarStatus()
    },
    setNavigationBarStatus: function() {
        var d = this.getTopToolbar();
        var c = d.get("next");
        var a = d.get("back");
        var b = d.get("dsmhelp");
        a.setDisabled(this.hbHistory.getIndex() <= 0);
        c.setDisabled(this.hbHistory.isLast());
        b.setDisabled(false)
    },
    findNodeURL: function(f) {
        var b = {};
        var e = this.treePanel.getNodeById(f);
        if (e) {
            if (!e.attributes.topic) {
                e = this.findNodeWithTopic(e);
                if (!e) {
                    return b
                }
            }
            b.node = e;
            if (this.isStatusOffline()) {
                b.url = this.generateOfflineURL(e, e.attributes.topic)
            } else {
                b.url = this.generateOnlineURL(e, e.attributes.topic)
            }
        } else {
            var a = f.indexOf("#");
            if (a != -1) {
                var c = f.substr(0, a);
                var d = f.substr(a + 1);
                e = this.treePanel.getNodeById(c);
                if (!e || !e.attributes.topic) {
                    return b
                }
                b.node = e;
                if (this.isStatusOffline()) {
                    b.url = this.generateOfflineURL(e, e.attributes.topic) + "#" + d
                } else {
                    b.url = this.generateOnlineURL(e, e.attributes.topic) + "#" + d
                }
            }
        }
        return b
    },
    getContentPanel: function() {
        return this.getComponent("help-content-panel")
    },
    isOfflineHome: function(a) {
        return (this.isStatusOffline() && (a === this.HomeId))
    },
    loadTopic: function(e, b) {
        var c = (b) ? b.get("type") : null,
            a = this.findNodeURL(e),
            d;
        if (b && c === "kb") {
            d = b.get("link");
            if (!d) {
                return false
            }
            window.open(d, "_blank");
            return
        }
        if (!a || !a.node && this.offline !== true) {
            this.changeOnOffLineStatus(true);
            return false
        } else {
            if (!a || !a.node) {
                SYNO.Debug("Cannot find node. nodeID", e);
                return false
            }
        }
        d = a.node.getPath();
        this.treePanel.expandPath(d);
        this.treePanel.selectPath(d);
        this.hbHistory.add({
            id: a.node.id,
            url: a.url
        });
        this.firstOpenTopic = null;
        return true
    },
    getTopicUrlBase: function(b) {
        var c = b.attributes.base,
            d = b.attributes.id,
            a;
        if (Ext.isString(c)) {
            if (c.substr(0, 1) === "/") {
                d = d.split(":")[0];
                a = SYNO.SDS.Config.FnMap[d];
                if (Ext.isObject(a) && a.config && a.config.jsBaseURL) {
                    return a.config.jsBaseURL + "/help/"
                }
                c = c.split("/")[3];
                return "3rdparty/" + c + "/help/"
            } else {
                if (Ext.isString(d)) {
                    d = d.split(":")[0];
                    a = SYNO.SDS.Config.FnMap[d];
                    if (Ext.isObject(a) && a.config && a.config.jsBaseURL) {
                        return a.config.jsBaseURL + "/" + c + "/"
                    }
                }
            }
        }
        return "help/"
    },
    reloadTree: function() {
        var a = this.treePanel.root;
        if (a) {
            a.reload()
        }
    },
    onHide: function() {
        SYNO.SDS.HelpBrowser.MainWindow.superclass.onHide.apply(this, arguments);
        if (this.layout.west.isCollapsed) {
            this.layout.west.getCollapsedEl().setStyle("visibility", "hidden")
        } else {
            this.layout.west.el.addClass("syno-sds-hb-west-panel-hide")
        }
    },
    onDestroy: function() {
        if (window.addEventListener) {
            window.removeEventListener("message", this.handelMsgPost, false)
        } else {
            window.detachEvent("onmessage", this.handelMsgPost)
        }
        if (this.detectEl) {
            this.detectEl.task.cancel()
        }
        if (this.detectNetworkTask) {
            this.detectNetworkTask.cancel()
        }
        SYNO.SDS.HelpBrowser.MainWindow.superclass.onDestroy.apply(this, arguments)
    },
    onShow: function() {
        SYNO.SDS.HelpBrowser.MainWindow.superclass.onShow.apply(this, arguments);
        if (this.layout.west.isCollapsed) {
            this.layout.west.getCollapsedEl().setStyle("visibility", "visible")
        } else {
            this.layout.west.el.removeClass("syno-sds-hb-west-panel-hide")
        }
        if (!_S("standalone") && !_S("rewriteApp") && SYNO.SDS.UserSettings.getProperty("SYNO.SDS.HelpBrowser.Application", "launchSetting") !== true) {
            var a = new SYNO.SDS.HelpBrowser.DisplaySettingDlg({
                owner: this
            });
            a.show()
        }
    },
    onOpen: function(c) {
        if (!this.fromRestore) {
            this.center()
        }
        SYNO.SDS.HelpBrowser.MainWindow.superclass.onOpen.call(this, c);
        if (this.isDemoHelpMode()) {
            var a = "";
            try {
                a = SYNO.Util.Base64.decode(window.location.hash.substring(1))
            } catch (b) {
                a = ""
            }
            this.firstOpenTopic = a
        }
        if (c.topic) {
            this.firstOpenTopic = c.topic + (c.anchor ? ("#" + c.anchor) : "");
            if (_S("rewriteApp")) {
                this.rewriteAppToic = c.topic + (c.anchor ? ("#" + c.anchor) : "")
            }
        }
    },
    onRequest: function(a) {
        if (a.topic) {
            this.loadTopic(a.topic + (a.anchor ? ("#" + a.anchor) : ""))
        }
        SYNO.SDS.HelpBrowser.MainWindow.superclass.onRequest.call(this, a)
    },
    onActivate: function() {
        var a = Ext.get(Ext.getDom(this.helpFrameID).parentNode).query(".sds-shim-for-iframe");
        Ext.each(a, function(b) {
            Ext.removeNode(b)
        });
        SYNO.SDS.HelpBrowser.MainWindow.superclass.onActivate.apply(this, arguments)
    },
    onDeactivate: function() {
        var a = document.createElement("div");
        a.addClassName("sds-shim-for-iframe");
        Ext.get(Ext.getDom(this.helpFrameID).parentNode).appendChild(a);
        SYNO.SDS.HelpBrowser.MainWindow.superclass.onDeactivate.apply(this, arguments)
    }
});
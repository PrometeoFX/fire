/* All rights reserved. */

Ext.define("SYNO.SDS.TransitionEndHandler", {
    extend: "Ext.util.Observable",
    constructor: function(a) {
        var b = this;
        b.el = a;
        a.on("transitionend", this.endTransition, this);
        b.callParent(arguments)
    },
    start: function() {
        this.startTime = new Date()
    },
    endTransition: function() {
        var a = this;
        a.fireEvent("aftertransition", a, (new Date() - a.startTime))
    }
});
Ext.define("SYNO.SDS._DeskTopManager", {
    extend: "Ext.util.Observable",
    list: null,
    front: null,
    desktopId: "sds-desktop",
    constructor: function() {
        var a = this;
        a.list = {};
        a.callParent()
    },
    register: function(b) {
        var a = this;
        if (b.manager) {
            b.manager.unregister(b)
        }
        b.manager = this;
        a.list[b.id] = b;
        if (b.id === a.desktopId || b === a.desktopId) {
            a.showDesktop()
        }
    },
    unregister: function(b) {
        var a = this;
        delete b.manager;
        delete a.list[b.id]
    },
    isDesktopOnTop: function() {
        var a = this;
        return a.front === a.get(a.desktopId)
    },
    showDesktop: function() {
        var a = this,
            b = a.get(a.desktopId);
        a.bringToFront(b)
    },
    get: function(a) {
        return typeof a == "object" ? a : this.list[a]
    },
    updateTransition: function(b, a) {
        var c = this;
        if (a > 500) {
            c.disableBlur = true;
            c.transitionHandler.un("aftertransition", c.updateTransition, c)
        }
    },
    bringToFront: function(c) {
        var b = this,
            a = false;
        c = b.get(c);
        if (c === b.front || !c) {
            return false
        }
        a = c.doLayout;
        c.show();
        if (b.front && b.front.id === b.desktopId) {
            b.front.addClass(b.backgroundTransparent ? "semi-transparent" : "sent-back")
        } else {
            if (b.front) {
                b.front.hide()
            }
        }
        b.front = c;
        if (a) {
            c.doLayout()
        }
        return true
    },
    hideAllExceptMe: function(c) {
        var b = this,
            a;
        for (var d in b.list) {
            if (b.list.hasOwnProperty(d)) {
                a = b.list[d];
                if (a && (a !== c) && typeof b.list[d] != "function" && b.list[d].isVisible()) {
                    b.list[d].hide()
                }
            }
        }
    },
    hideAll: function() {
        for (var a in this.list) {
            if (this.list[a] && typeof this.list[a] != "function" && this.list[a].isVisible()) {
                this.list[a].hide()
            }
        }
        this.front = null
    },
    getActive: function() {
        return this.front
    },
    each: function(b, a) {
        for (var c in this.list) {
            if (this.list[c] && typeof this.list[c] != "function" && b.call(a || this.list[c], this.list[c]) === false) {
                return
            }
        }
    }
});
SYNO.SDS.DefineDesktopView = function(a, b) {
    Ext.define(a, {
        extend: b,
        animateShowHideCls: "sds-desktop-view-animate",
        showCls: "sds-desktop-view-show",
        constructor: function(c) {
            var d = this;
            c = c || {};
            c = Ext.apply(c, {
                tabIndex: -1,
                hideMode: "offsets",
                hidden: true
            });
            d.callParent([c]);
            d.initManager(c.manager || SYNO.SDS.DeskTopManager);
            if (c.taskBarConfig) {
                d.initTaskbarButton(c.taskBarConfig)
            }
            if (c.trayIconConfig) {
                d.initTrayIconButton(c.trayIconConfig)
            }
        },
        initManager: function(c) {
            var d = this;
            d.manager = c;
            d.manager.register(d)
        },
        initTaskbarButton: function(c) {
            if (!_S("standalone")) {
                c = c || {};
                c = Ext.applyIf(c, {
                    toggleHandler: this.onToggle.createDelegate(this)
                });
                this.taskBarButton = SYNO.SDS.TaskBar.addDesktopViewButton(c)
            }
        },
        initTrayIconButton: function(c) {
            if (!_S("standalone")) {
                c = c || {};
                c = Ext.applyIf(c, {
                    toggleHandler: this.onToggle.createDelegate(this)
                });
                this.taskBarButton = SYNO.SDS.TaskBar.addTrayIconViewButton(c)
            }
        },
        toggleButton: function(f, e) {
            var d = this,
                c = d.taskBarButton;
            if (c) {
                c.toggle(f, e)
            }
        },
        onToggle: function(c, d) {
            this[d ? "activeView" : "showDesktop"]()
        },
        hide: function() {
            var c = this;
            c.transitionHandler.start();
            c.removeClass(c.showCls);
            c.callParent();
            c.toggleButton(false, true)
        },
        show: function() {
            var c = this;
            c.transitionHandler.start();
            c.addClass(c.showCls);
            c.callParent()
        },
        updateTransition: function(d, c) {
            var e = this;
            if (c > 500) {
                e.addClass("no-transition");
                e.transitionHandler.un("aftertransition", e.updateTransition, e)
            }
        },
        resetTransition: function() {
            var c = this;
            c.disableBlur = false;
            c.removeClass("no-transition")
        },
        activeView: function() {
            var c = this;
            c.manager.bringToFront(c);
            c.focus()
        },
        showDesktop: function() {
            var c = this;
            c.manager.showDesktop()
        },
        afterRender: function() {
            var c = this;
            c.callParent();
            c.transitionHandler = c.transitionHandler || new SYNO.SDS.TransitionEndHandler(c.getEl());
            c.transitionHandler.on("aftertransition", c.updateTransition, c);
            Ext.EventManager.onWindowResize(this.onWindowResize, this);
            if (c.animateShowHide) {
                c.addClass(c.animateShowHideCls)
            }
            c.el.on("mousedown", this.onClick, this);
            if (c.tabIndex !== undefined) {
                c.el.dom.setAttribute("tabIndex", c.tabIndex)
            }
            c.keyNav = new Ext.KeyNav(c.el, {
                esc: this.onEnterEsc,
                scope: this
            })
        },
        onEnterEsc: function(c) {
            this.showDesktop()
        },
        onClick: function(d, c) {},
        resize: function(d, c) {},
        getViewSize: function() {
            var c = {
                viewH: Ext.lib.Dom.getViewHeight() - SYNO.SDS.TaskBar.getHeight(),
                viewW: Ext.lib.Dom.getViewWidth()
            };
            return c
        },
        onWindowResize: function() {
            var d = this,
                c = d.getViewSize();
            d.resize(c.viewW, c.viewH)
        },
        refresh: function() {},
        addInstruction: function() {
            var c = Ext.lib.Dom.getViewHeight() - SYNO.SDS.TaskBar.getHeight();
            var d = Ext.lib.Dom.getViewWidth();
            this.instruction = new Ext.Container({
                cls: "sds-app-widget-instruction",
                width: d,
                height: c,
                items: [{
                    xtype: "box",
                    cls: "message-container",
                    html: _T("desktop", "shortcut_zone_instruction")
                }, {
                    xtype: "box",
                    cls: "message-arrow"
                }],
                listeners: {
                    afterlayout: function() {
                        var e = this.el.child(".message-container");
                        var f = this.el.child(".message-arrow");
                        var g = this.getHeight() * 0.33;
                        e.alignTo(this.shortcutZoneLeft.el, "tl-tr", [-36, g]);
                        f.alignTo(e, "r-l", [1, 5])
                    },
                    scope: this
                },
                resize: function() {
                    var e = Ext.lib.Dom.getViewHeight() - SYNO.SDS.TaskBar.getHeight();
                    var f = Ext.lib.Dom.getViewWidth();
                    this.setSize(f, e);
                    this.doLayout()
                },
                showTip: function() {
                    this.addClass("show")
                }
            });
            this.add(this.instruction);
            this.on("show", this.showInstruction, this)
        },
        showInstruction: function() {
            this.showTaskId = Ext.defer(function() {
                if (!this.instruction) {
                    return
                }
                this.shortcutZoneLeft.addClass("on-instruction");
                this.shortcutZoneRight.addClass("on-instruction");
                if (this.shortcutZoneBottom) {
                    this.shortcutZoneBottom.addClass("on-instruction")
                }
                this.instruction.showTip()
            }, 500, this)
        },
        removeInstruction: function() {
            clearTimeout(this.showTaskId);
            this.resetTransition();
            if (!this.instruction) {
                return
            }
            this.remove(this.instruction, true);
            this.instruction = null;
            this.shortcutZoneLeft.removeClass("on-instruction");
            this.shortcutZoneRight.removeClass("on-instruction");
            if (this.shortcutZoneBottom) {
                this.shortcutZoneBottom.removeClass("on-instruction")
            }
            this.un("show", this.showInstruction, this);
            this.un("beforehide", this.removeInstruction, this)
        },
        destroy: function() {
            var c = this;
            c.transitionHandler.un("aftertransition", c.updateTransition, c);
            c.transitionHandler = null;
            Ext.EventManager.removeResizeListener(c.onWindowResize, c);
            Ext.destroy(c.keyNav);
            c.keyNav = null;
            c.taskBarButton.getEl().remove();
            c.callParent(arguments)
        }
    })
};
SYNO.SDS.DefineDesktopView("SYNO.SDS._DesktopView", "Ext.Container");
SYNO.SDS.DefineDesktopView("SYNO.SDS.Box_DesktopView", "Ext.BoxComponent");
Ext.namespace("SYNO.SDS.LaunchItem");
Ext.define("SYNO.SDS.LaunchItemHelper", {
    statics: {
        getGroupReviewIconPosition: function(b, e, d, g) {
            d = Ext.isNumber(d) ? d : 6;
            g = Ext.isNumber(g) ? g : 6;
            var a = d + e + b - e * 2 - d * 2,
                c = g + e + b - e * 2 - g * 2;
            var f = [{
                left: d,
                top: g
            }, {
                left: a,
                top: g
            }, {
                left: d,
                top: c
            }, {
                left: a,
                top: c
            }];
            return f
        }
    }
});
SYNO.SDS._LaunchItem = Ext.extend(Ext.util.Observable, {
    getPriviewPositionFn: SYNO.SDS.LaunchItemHelper.getGroupReviewIconPosition.createDelegate(this, [64, 24]),
    iconCategory: "Desktop",
    shortIconCls: "",
    allowedCfgProperty: "jsID,className,param,title,formatedTitle,desc,icon,icon_16,icon_32,type,allowStandalone,url,urlDefMode,urlTag,urlTarget,launchParams,subItems,port,protocol",
    manager: null,
    removable: false,
    container: null,
    el: null,
    dragEl: null,
    contextMenu: null,
    lastClick: 0,
    clickInterval: 1000,
    iconItems: [],
    li_el: null,
    defaultXY: null,
    specialTarget: {
        _blank: true,
        _self: true,
        _parent: true,
        _top: true
    },
    constructor: function(b, a) {
        if (b.className || b.jsID) {
            this.applyConfig(b)
        } else {
            Ext.apply(this, b)
        }
        Ext.id(this);
        this.container = Ext.get(a || document.body);
        this.contextMenu = this.getContextMenu();
        this.el = this.createElement();
        this.el.on("click", this.onClick, this);
        this.dragEl.on("mouseover", this.onMouseOver, this);
        this.dragEl.on("mousedown", this.onMouseDown, this);
        this.dragEl.on("contextmenu", this.onContextMenu, this)
    },
    applyConfig: function(b) {
        var a, c = SYNO.SDS.Config.FnMap[b.className || b.jsID];
        this.className = b.jsID;
        if (!b.title || !b.icon) {
            Ext.copyTo(this, c.config, this.allowedCfgProperty)
        }
        Ext.copyTo(this, b, "manager,removable,iconSize," + this.allowedCfgProperty);
        this.plaintitle = SYNO.SDS.Utils.GetLocalizedString(this.title || "", this.className);
        this.title = SYNO.SDS.Utils.GetLocalizedString(this.formatedTitle || this.title || "", this.className);
        this.desc = SYNO.SDS.Utils.GetLocalizedString(this.desc || "", this.className);
        a = encodeURI(c.config.jsBaseURL) + "/" + (this.icon || this.icon_32);
        this.icon = SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(a, this.iconCategory)
    },
    remove: function() {
        if (this.isSelected() && this.manager) {
            this.manager.removeSelectedItems();
            return
        }
        if (this.manager && this.manager.className == "SYNO.SDS.VirtualGroup") {
            if (this.manager.subItems.length === 1) {
                this.manager.remove();
                return
            }
            this.manager.subItems.remove(this.managerItemConfig);
            this.manager.manager.updateItemsSetting();
            this.manager.refreshSubItems();
            this.manager = null;
            this.destroy();
            return
        }
        if (this.manager) {
            this.manager.removeLaunchItem(this);
            this.manager = null
        }
        this.destroy()
    },
    renameHandler: function() {
        this.showInputField()
    },
    showInputField: function() {
        var a = this.li_el.child(".text"),
            b;
        a.hide();
        this.renameInputField = Ext.getBody().createChild({
            tag: "input",
            type: "text",
            value: this.title || "",
            maxlength: 256,
            cls: "sds-launch-icon-input"
        });
        b = this.renameInputField;
        b.setLeft(a.getX());
        b.setTop(a.getY());
        b.focus(100);
        b.on("blur", this.onRenameInputBlur, this);
        b.on("keyup", this.onRenameInputKeyup, this)
    },
    onRenameInputBlur: function(a, c, e) {
        var b = this.li_el.child(".text"),
            d = this.renameInputField;
        this.title = Ext.util.Format.htmlEncode(c.value);
        this.managerItemConfig.title = this.title;
        this.manager.updateItemsSetting();
        this.updateGroupTitle(this.title);
        d.removeAllListeners();
        d.remove();
        b.show()
    },
    onRenameInputKeyup: function(a, b, d) {
        var c = this.renameInputField;
        if (a.getKey() === a.ENTER) {
            c.blur()
        }
    },
    destroy: function() {
        this.closeSubContainer();
        if (this.monitoringMouseOver) {
            Ext.getDoc().un("mouseover", this.monitorMouseOver, this)
        }
        if (this.monitoringMouseMove) {
            Ext.getDoc().un("mousemove", this.monitorMouseMove, this)
        }
        if (this.contextMenu) {
            this.contextMenu.destroy();
            this.contextMenu = null
        }
        if (!this.el) {
            return
        }
        this.el.purgeAllListeners();
        this.el.remove();
        this.el = null
    },
    refreshElementIcons: function() {
        Ext.each(this.iconEls, function(a) {
            if (!a) {
                return
            }
            a.remove()
        }, this);
        this.iconEls = [];
        this.createVirtualGroupIcon()
    },
    getIconStyle: function() {
        return ("SYNO.SDS.VirtualGroup" !== this.className) ? {
            "background-image": String.format("url({0})", this.icon || "")
        } : {}
    },
    createElement: function() {
        var g, d, a, f = "";
        f = (this.desc || this.title || "");
        d = this.container;
        if (("standalone" === this.type || true === this.allowStandalone || "url" === this.type || "legacy" === this.type) && (this.url || this.urlTag)) {
            var c = this.url || SYNO.SDS.UrlTag[this.urlTag] || "";
            if ((this.port || this.protocol) && ("http" !== c.substr(0, 4).toLowerCase())) {
                var e = this.protocol || window.location.protocol;
                var b = this.port || window.location.port || "";
                if (b) {
                    b = ":" + b
                }
                c = e + "://" + window.location.hostname + b + c
            }
            d = d.createChild({
                tag: "a",
                href: c,
                target: (this.urlTarget in this.specialTarget) ? this.urlTarget : this.urlTarget ? this.urlTarget + SYNO.SDS.LaunchTime : "_blank"
            });
            g = d
        }
        a = d.createChild({
            tag: "li",
            tabindex: 0,
            "ext:qtip": Ext.util.Format.htmlEncode(f),
            cls: "launch-icon " + this.shortIconCls,
            cn: [{
                cls: "image",
                "aria-label": this.plaintitle,
                style: this.getIconStyle()
            }, {
                cls: "text",
                html: this.title || ""
            }]
        });
        this.li_el = a;
        this.createVirtualGroupIcon();
        this.dragEl = a;
        return g || a
    },
    getContextMenu: function() {
        var c = this.launchParams || {};
        var b = [];
        for (var a in c) {
            if (c.hasOwnProperty(a)) {
                b.push({
                    id: this.id + a,
                    text: SYNO.SDS.Utils.GetLocalizedString(a, this.className),
                    handler: this.launchApp.createDelegate(this, [c[a]])
                })
            }
        }
        if ("standalone" === this.type || true === this.allowStandalone || (("url" === this.type || "legacy" === this.type) && "_self" !== this.urlTarget)) {
            b.push({
                text: _T("desktop", "open_in_new_window"),
                scope: this,
                handler: this.openNewWindow,
                useBuffer: false
            })
        }
        if (this.manager && this.removable) {
            if (b.length > 0) {
                b.push("-")
            }
            b.push({
                itemId: "remove_shortcut",
                text: _T("desktop", "remove_shortcut"),
                scope: this,
                handler: this.remove
            })
        }
        if (this.isFileShortcut(this)) {
            b.push({
                text: _WFT("filetable", "filetable_rename"),
                scope: this,
                handler: this.renameHandler
            })
        }
        if (!b.length) {
            return null
        }
        return new SYNO.ux.Menu({
            items: b
        })
    },
    onContextMenu: function(d) {
        d.preventDefault();
        if (!this.contextMenu) {
            return
        }
        var g = this.contextMenu.getComponent("remove_shortcut"),
            h, a, f = true,
            c, b;
        Ext.QuickTips.getQuickTip().cancelShow(this.dragEl);
        h = this.contextMenu.items;
        if (this.subItems) {
            Ext.each(this.subItems, function(e) {
                b = SYNO.SDS.Config.FnMap[e.className].config;
                if (b.removable === false) {
                    f = false
                }
            })
        } else {
            b = SYNO.SDS.Config.FnMap[this.className].config;
            if (b.removable === false) {
                f = false
            }
        }
        if (f === false) {
            if (g) {
                if (h.getCount() === 1) {
                    return
                } else {
                    a = h.indexOf(g);
                    c = h.getRange(Math.max(a - 1, 0), a);
                    c.each(function(e) {
                        e.hide()
                    })
                }
            }
        } else {
            h.each(function(e) {
                e.show()
            })
        }
        this.contextMenu.showAt(d.getXY())
    },
    openNewWindow: function() {
        SYNO.SDS.WindowLaunch(this.className, null, null, this)
    },
    onClick: function(b) {
        var a = (new Date()).getTime();
        if (this.cancelClick || (a - this.lastClick) < this.clickInterval) {
            b.stopEvent();
            return
        }
        this.lastClick = a;
        if ("SYNO.SDS.VirtualGroup" === this.className) {
            this.createSubContainer();
            return
        }
        if (this.manager && this.manager.className == "SYNO.SDS.VirtualGroup") {
            this.manager.closeSubContainer()
        }
        if ("url" === this.type || "standalone" === this.type || (true === this.allowStandalone && b.hasModifier()) || ("legacy" === this.type && ("url" === this.urlDefMode || b.hasModifier()))) {
            if ("_self" === this.urlTarget) {
                window.onbeforeunload = null
            } else {
                b.stopEvent();
                this.openNewWindow()
            }
            return
        }
        b.stopEvent();
        this.launchApp(this.param);
        return
    },
    launchApp: function(a) {
        SYNO.SDS.AppLaunch.defer(100, window, [this.className, a, true])
    },
    onMouseOver: function(a) {
        this.dragEl.addClass("x-btn-over");
        if (!this.monitoringMouseOver) {
            Ext.getDoc().on("mouseover", this.monitorMouseOver, this);
            this.monitoringMouseOver = true
        }
    },
    monitorMouseOver: function(a) {
        if (a.target != this.el.dom && !a.within(this.el)) {
            if (this.monitoringMouseOver) {
                Ext.getDoc().un("mouseover", this.monitorMouseOver, this);
                this.monitoringMouseOver = false
            }
            this.onMouseOut(a)
        }
    },
    onMouseOut: function(a) {
        this.dragEl.removeClass("x-btn-over")
    },
    onMouseDown: function(a) {
        if (!this.disabled && a.button === 0) {
            this.dragEl.addClass("x-btn-click");
            Ext.getDoc().on("mouseup", this.onMouseUp, this);
            this.cancelClick = false;
            if (!this.monitoringMouseMove) {
                Ext.getDoc().on("mousemove", this.monitorMouseMove, this);
                this.monitoringMouseMove = a.getXY()
            }
        }
    },
    onMouseUp: function(a) {
        if (a.button === 0) {
            this.dragEl.removeClass("x-btn-click");
            Ext.getDoc().un("mouseup", this.onMouseUp, this)
        }
    },
    monitorMouseMove: function(g) {
        if (!this.monitoringMouseMove) {
            return
        }
        var b = Ext.dd.DragDropMgr.clickPixelThresh,
            f = g.getXY(),
            a = this.monitoringMouseMove,
            d = Math.abs(a[0] - f[0]),
            c = Math.abs(a[1] - f[1]);
        if (d <= b && c <= b) {
            return
        }
        Ext.getDoc().un("mousemove", this.monitorMouseMove, this);
        delete this.monitoringMouseMove;
        this.cancelClick = true
    },
    createSubItems: function() {
        var b, a = ["subItemsDesc", "separator", "divCt"];
        this.iconItems = [];
        this.uls = [];
        a.each(function(d) {
            var c = this[d];
            if (c) {
                c.remove()
            }
        }, this);
        this.subItemsDesc = this.virtualContainer.createChild({
            tag: "input",
            type: "text",
            value: this.title || "",
            maxlength: 64,
            cls: "sds-sub-container-desc"
        });
        this.subItemsDesc.on("keyup", this.onDescKeyUp, this, {
            buffer: 100
        });
        this.subItemsDesc.on("blur", this.onDescBlur, this);
        this.separator = this.virtualContainer.createChild({
            tag: "hr"
        });
        this.divCt = this.virtualContainer.createChild({
            tag: "div",
            cls: "sds-sub-container-div-ct"
        });
        b = this.divCt.createChild({
            tag: "ul",
            cls: "sds-desktop-shortcut"
        });
        this.uls.push(b);
        this._ul = b;
        this.refresh()
    },
    onDescKeyUp: function(a, b, c) {
        this.title = Ext.util.Format.htmlEncode(b.value);
        this.managerItemConfig.title = this.title;
        this.manager.updateItemsSetting();
        this.updateGroupTitle(this.title);
        if (a.getKey() === a.ENTER) {
            this.subItemsDesc.blur()
        }
    },
    onDescBlur: function(a, b, c) {
        var d = b.value;
        if (Ext.isIE || Ext.isOpera) {
            b.value = "";
            (function() {
                b.value = d
            }).defer(10)
        } else {
            if (Ext.isGecko) {
                b.value = d
            }
        }
    },
    updateGroupTitle: function(c) {
        var b = this.li_el;
        var a = b.child(".text");
        if (a) {
            a.update(c)
        }
        if (!this.desc) {
            b.set({
                "ext:qtip": c
            })
        }
    },
    removeSubItems: function() {
        if (this.manager && this.manager.className == "SYNO.SDS.VirtualGroup") {
            this.manager = null;
            this.destroy();
            return
        }
    },
    createSubContainer: function() {
        var b = Ext.get("sds-desktop"),
            c;
        this.iconItems = [];
        this.uls = [];
        var a = Ext.getBody();
        this.shim = a.createChild({
            tag: "div",
            id: "sds-sub-container-shim"
        });
        this.shim.on("click", this.onShimClick, this);
        c = this.virtualContainer = b.createChild({
            tag: "div",
            cls: "white-scrollerbar " + (this.shortIconCls || ""),
            id: "sds-sub-container"
        });
        this.arrow = c.createChild({
            tag: "div",
            cls: "virtual-group-background"
        }).createChild({
            tag: "div",
            cls: "virtual-group-arrow"
        });
        this.createSubItems();
        this.adjustSubContainerPosition();
        this.virtualContainer.shift({
            height: this.virtualContainer.targetHeight,
            width: this.virtualContainer.targetWidth,
            easing: "easeIn",
            duration: 0.45,
            callback: function() {},
            scope: this
        })
    },
    adjustSubContainerPosition: function() {
        var a = this.el,
            k = a.getTop(true),
            b = a.getLeft(),
            i = a.getRight(),
            h = this.virtualContainer,
            o, n, c = 316,
            d = 192,
            g, m = this.arrow,
            f = 84,
            l = Ext.get("sds-desktop"),
            j = l.getHeight(),
            e = l.getWidth();
        o = k - 48;
        n = i - 24 + 12;
        if (o < 0) {
            g = f + o;
            o = 0
        }
        if (o + d > j) {
            g = f + (o + d - j);
            o = j - d
        }
        if (b > c && n + c > e) {
            n = b - c + 24 - 12;
            if (m) {
                m.addClass("right-arrow")
            }
        }
        h.setLeft(n);
        h.setTop(o);
        if (m && Ext.isNumber(g)) {
            m.setTop(g)
        }
    },
    validTempNode: function() {
        var a;
        for (a = 0; a < this.subItems.length; ++a) {
            if (this.subItems[a]._temp) {
                this.subItems[a]._temp = false;
                if (this.iconItems[a]) {
                    this.iconItems[a].li_el.show();
                    this.iconItems[a].li_el._temp = false
                }
                break
            }
        }
        this.manager.updateItemsSetting();
        return true
    },
    removeTempNode: function() {
        var b = -1;
        for (var a = 0; a < this.subItems.length; ++a) {
            if (this.subItems[a]._temp) {
                b = a;
                break
            }
        }
        if (b < 0) {
            return false
        }
        this.subItems.splice(b, 1);
        this.manager.updateItemsSetting();
        return true
    },
    addSubItem: function(b, a) {
        b._temp = !a;
        this.subItems.push(b)
    },
    validateItems: function() {
        var a = [];
        Ext.each(this.subItems, function(b) {
            if (!b) {
                return
            }
            var c = b.className || b.jsID;
            if (SYNO.SDS.Config.FnMap[c] && SYNO.SDS.StatusNotifier.isAppEnabled(c)) {
                a.push(b)
            }
        }, this);
        if (a.length === 0) {
            this.remove()
        } else {
            if (this.subItems.length !== a.length) {
                this.subItems = a;
                this.refreshElementIcons()
            }
        }
    },
    refresh: function() {
        var h, m, a = 0,
            d = 0;
        h = this._ul;
        var l = 0;
        var i = 0;
        var g = 64;
        var j = 64 * 2;
        var k = 42;
        var b = 0;
        var c = 0;
        var f = 24;
        Ext.each(this.subItems, function(o, n) {
            if (!o) {
                return
            }
            if (!SYNO.SDS.Config.FnMap[o.className]) {
                return
            }++a;
            ++d;
            m = this.iconItems[n];
            if (!m) {
                m = new SYNO.SDS.LaunchItem(Ext.apply({}, {
                    manager: this,
                    removable: true
                }, o), h);
                this.iconItems.push(m);
                m.managerItemConfig = o;
                if (o._temp) {
                    m.li_el._temp = true;
                    m.li_el.hide()
                }
                m.li_el.addClass("transition-cls")
            }
            if ((n % 3) === 0 && n > 0) {
                i++;
                l = 0
            }
            var q = b + l * (g + k);
            var p = f + i * (j + c);
            m.li_el.setLeft(q);
            m.li_el.setTop(p);
            l++
        }, this);
        if (h) {
            var e = f + i * (j + c) + j;
            h.setHeight(e);
            this.updateScrollbar()
        }
    },
    updateScrollbar: function() {
        var a = this.divCt.dom;
        if (a && a.fleXcroll) {
            a.fleXcroll.updateScrollBars()
        } else {
            if (a) {
                fleXenv.fleXcrollMain(this.divCt.dom)
            }
        }
    },
    refreshSubItems: function() {
        Ext.each(this.iconItems, function(a) {
            if (!a) {
                return
            }
            a.removeSubItems()
        });
        this.iconItems = [];
        Ext.each(this.uls, function(a) {
            if (!a) {
                return
            }
            a.remove()
        });
        this.uls = [];
        this.createSubItems();
        this.adjustSubContainerPosition()
    },
    closeSubContainer: function() {
        if (this.className != "SYNO.SDS.VirtualGroup") {
            return false
        }
        Ext.each(this.iconItems, function(c, b) {
            if (!c) {
                return
            }
            c.removeSubItems()
        });
        this.iconItems = [];
        Ext.each(this.uls, function(b) {
            if (!b) {
                return
            }
            b.remove()
        });
        this.uls = [];
        if (this.shim) {
            this.shim.remove();
            this.shim = null
        }
        var a = false;
        if (this.virtualContainer) {
            a = true;
            this.virtualContainer.remove();
            this.virtualContainer = null
        }
        this.refreshElementIcons();
        return a
    },
    onShimClick: function() {
        this.shim.remove();
        this.shim = null;
        this.virtualContainer.remove();
        this.virtualContainer = null;
        this.manager.refresh();
        SYNO.SDS.Desktop._containerShown = false;
        this.refreshElementIcons()
    },
    setMoveIcon: function(a) {
        if (a < 0 || a >= this.subItems.length) {
            return
        }
        var e = this.subItems[a];
        if (!e) {
            return
        }
        var c = SYNO.SDS.Config.FnMap[e.className];
        if (!c) {
            return
        }
        var d = encodeURI(c.config.jsBaseURL) + "/" + (e.icon || c.config.icon || c.config.icon_32);
        var b = SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(d, this.iconCategory);
        this._preview.dom.src = b
    },
    onMoveIcons: function(d) {
        if (Ext.dd.DragDropMgr.dragCurrent || !this._preview) {
            return
        }
        var b = this.el.getWidth() + 10;
        var a = d.xy[0] - (this.el.getLeft());
        if (a > b || a < 0) {
            return
        }
        var c = Math.floor((a / b) * this.subItems.length);
        this.setMoveIcon(c)
    },
    onMouseOverMoveIcons: function() {
        if (Ext.dd.DragDropMgr.dragCurrent || !this._preview) {
            return
        }
        this.setMoveIcon(0);
        this.icon_holder.addClass("sds-grouping-show-big-preview")
    },
    onMouseOutMoveIcons: function() {
        this.icon_holder.removeClass("sds-grouping-show-big-preview")
    },
    rePosition: function(f, c) {
        var b = f;
        var a = c;
        var d = this.subItems[b];
        var e = this.iconItems[b];
        this.subItems.splice(a, 0, d);
        this.iconItems.splice(a, 0, e);
        if (a < b) {
            b++
        }
        this.subItems.splice(b, 1);
        this.iconItems.splice(b, 1);
        this.manager.updateItemsSetting();
        this.refresh()
    },
    createVirtualGroupIcon: function() {
        if (!this.subItems) {
            return
        }
        var a = this.li_el;
        this.icon_holder = a.first();
        if (!this._background) {
            this._background = this.icon_holder.createChild({
                cls: "virtual-group-icon-background"
            })
        }
        if (!this._preview) {
            this._preview = this.icon_holder.createChild({
                tag: "img",
                cls: "sds-grouping-big-preview-icon"
            });
            a.on("mousemove", this.onMoveIcons, this);
            a.on("mouseover", this.onMouseOverMoveIcons, this);
            a.on("mouseout", this.onMouseOutMoveIcons, this)
        }
        this.iconEls = [];
        var b = this.getPriviewPositionFn();
        Ext.each(this.subItems, function(g, c) {
            if (c >= 4) {
                return
            }
            if (!g) {
                return
            }
            var e = SYNO.SDS.Config.FnMap[g.className];
            if (!e) {
                return
            }
            var f = encodeURI(e.config.jsBaseURL) + "/" + (g.icon || e.config.icon || e.config.icon_32);
            var d = SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(f, this.iconCategory);
            this.iconEls[c] = this.icon_holder.createChild({
                tag: "img",
                cls: "sds-grouping-preview-icon",
                style: String.format("left: {0}px; top: {1}px", b[c].left, b[c].top),
                src: d
            })
        }, this)
    },
    isSelected: function() {
        return !!this._selected
    },
    setSelected: function(a) {
        this._selected = !!a
    },
    blinkForAdd: function() {
        var a;
        if ("SYNO.SDS.VirtualGroup" !== this.className) {
            return
        }
        if (!this.li_el) {
            return
        }
        a = this.li_el.child(".image");
        a.frame("#000", 1, {
            duration: 0.5
        });
        a.setStyle("visibility", "")
    },
    isFileShortcut: function(a) {
        if (!a || a.className !== "SYNO.SDS.App.FileStation3.Instance") {
            return false
        }
        if (!a.param || !a.param.file_id) {
            return false
        }
        return true
    }
});
Ext.define("SYNO.SDS.Classical._LaunchItem", {
    extend: "SYNO.SDS._LaunchItem",
    shortIconCls: "classical",
    iconCategory: "ClassicalDesktop",
    getPriviewPositionFn: SYNO.SDS.LaunchItemHelper.getGroupReviewIconPosition.createDelegate(this, [48, 16]),
    adjustSubContainerPosition: function() {
        var a = this.el,
            k = a.getTop(true),
            b = a.getLeft(),
            i = a.getRight(),
            h = this.virtualContainer,
            o, n, c = 316,
            d = 176,
            g, m = this.arrow,
            f = 76,
            l = Ext.get("sds-desktop"),
            j = l.getHeight(),
            e = l.getWidth();
        o = k - 48;
        n = i - 24 + 12;
        if (o < 0) {
            g = f + o;
            o = 0
        }
        if (o + d > j) {
            g = f + (o + d - j);
            o = j - d
        }
        if (b > c && n + c > e) {
            n = b - c + 24 - 12;
            if (m) {
                m.addClass("right-arrow")
            }
        }
        h.setLeft(n);
        h.setTop(o);
        if (m && Ext.isNumber(g)) {
            m.setTop(g)
        }
    },
    refresh: function() {
        var h, m, a = 0,
            d = 0;
        h = this._ul;
        var l = 0;
        var i = 0;
        var g = 74;
        var j = 64 * 2 - 16;
        var k = 27;
        var b = 0;
        var c = 0;
        var f = 24;
        Ext.each(this.subItems, function(o, n) {
            if (!o) {
                return
            }
            if (!SYNO.SDS.Config.FnMap[o.className]) {
                return
            }++a;
            ++d;
            m = this.iconItems[n];
            if (!m) {
                m = new SYNO.SDS.LaunchItem(Ext.apply({}, {
                    manager: this,
                    removable: true
                }, o), h);
                this.iconItems.push(m);
                m.managerItemConfig = o;
                if (o._temp) {
                    m.li_el._temp = true;
                    m.li_el.hide()
                }
                m.li_el.addClass("transition-cls")
            }
            if ((n % 3) === 0 && n > 0) {
                i++;
                l = 0
            }
            var q = b + l * (g + k);
            var p = f + i * (j + c);
            m.li_el.setLeft(q);
            m.li_el.setTop(p);
            l++
        }, this);
        if (h) {
            var e = f + i * (j + c) + j;
            h.setHeight(e);
            this.updateScrollbar()
        }
    }
});
Ext.namespace("SYNO.SDS");
Ext.define("SYNO.SDS.DesktopSetting", {
    statics: {
        miniHeight: 580,
        miniWidth: 1000
    }
});
SYNO.SDS._StandaloneDesktop = Ext.extend(Ext.BoxComponent, {
    constructor: function() {
        var a = "default_wallpaper/default_wallpaper.jpg";
        SYNO.SDS._StandaloneDesktop.superclass.constructor.call(this, {
            id: "sds-desktop",
            style: "background: transparent url(resources/images/" + a + ") left bottom repeat-x; top: 0px; background-size: 100% 100%;",
            renderTo: document.body
        });
        this.onWindowResize();
        Ext.EventManager.onWindowResize(this.onWindowResize, this)
    },
    onWindowResize: function() {
        this.el.setHeight(Ext.lib.Dom.getViewHeight());
        var a = this.el.getBox();
        this.el.setStyle({
            "overflow-x": (a.width <= SYNO.SDS.DesktopSetting.miniWidth) ? "auto" : "hidden",
            "overflow-y": (a.height <= SYNO.SDS.DesktopSetting.miniHeight) ? "auto" : "hidden"
        })
    }
});
Ext.define("SYNO.SDS._Desktop", {
    extend: "SYNO.SDS.Box_DesktopView",
    allowedCfgProperty: "jsID,className,param,title,formatedTitle,desc,icon,type,url,urlDefMode,urlTag,urlTarget,launchParams,subItems",
    defShortCuts: (SYNO.SDS.isNVR) ? [{
        className: "SYNO.SDS.PkgManApp.Instance"
    }, {
        className: "SYNO.SDS.AdminCenter.Application"
    }, {
        className: "SYNO.SDS.App.FileStation3.Instance"
    }, {
        className: "SYNO.SDS.HelpBrowser.Application"
    }, {
        className: "SYNO.SDS.SurveillanceStation"
    }] : [{
        className: "SYNO.SDS.PkgManApp.Instance"
    }, {
        className: "SYNO.SDS.AdminCenter.Application"
    }, {
        className: "SYNO.SDS.App.FileStation3.Instance"
    }, {
        className: "SYNO.SDS.HelpBrowser.Application"
    }],
    DROP_ALLOWED_CLS: "x-dd-drop-ok-add",
    REPOSITION_OK_CLS: "x-dd-reposition-ok",
    CURSOR_OVER_TYPE: {
        ABOVE_ICON: 0,
        OVER_ICON: 1,
        BELOW_ICON: 2
    },
    items: null,
    iconItems: null,
    updateTask: null,
    updateDelay: 200,
    bgPosition: "center",
    bgRatio: 1,
    previewCounter: 0,
    ICON_WIDTH: 136,
    ICON_HEIGHT: 116,
    isBeta: false,
    opacityHideCls: "sds-desktop-hide",
    isItemUpdated: false,
    constructor: function() {
        var a = this;
        SYNO.SDS._Desktop.superclass.constructor.call(this, {
            id: "sds-desktop",
            taskBarConfig: {
                handler: this.onShowAll.createDelegate(this),
                tooltip: _T("desktop", "show_desktop"),
                renderTo: "sds-taskbar-showall"
            },
            hidden: false,
            renderTo: document.body
        });
        a.dsmLogo = new SYNO.SDS.OS_Logo({
            id: "sds-logo",
            renderTo: a.getEl()
        });
        this.items = [];
        this.iconItems = [];
        this.updateTask = new Ext.util.DelayedTask(this.updateItems, this);
        this.mon(this.el, "scroll", function(c) {
            var b = this.el.getBox();
            if (this.el.dom.scrollTop > 0 && (b.height >= SYNO.SDS.DesktopSetting.miniHeight)) {
                this.el.dom.scrollTop = -100
            }
            c.preventDefault();
            return false
        }, this);
        this.mon(Ext.getBody(), "scroll", function(b, c, d) {
            if (c.scrollTop > 0) {
                c.scrollTop = 0
            }
            b.preventDefault();
            return false
        }, this);
        this.el.dragZone = new Ext.dd.DragZone(this.el, {
            ddGroup: "SDSShortCut",
            proxy: new SYNO.ux.StatusProxy({
                baseCls: "sds-launch-icon-dragging-proxy"
            }),
            validateTarget: function(d, c, f) {
                var b = c.getTarget("li.launch-icon");
                if (SYNO.SDS.Desktop.el.id === c.getTarget().id || (b && Ext.fly(b).findParentNode(".sds-desktop-shortcut"))) {
                    return true
                }
                if (c.getTarget("#sds-sub-container") || c.getTarget("#sds-sub-container-shim")) {
                    return true
                }
                this.getProxy().setStatus(this.dropNotAllowed);
                return false
            },
            getDragData: this.getDragData.createDelegate(this, [], true),
            getRepairXY: function() {
                return this.dragData.repairXY
            },
            endDrag: function(b) {
                SYNO.SDS.Desktop.onEndDrag(this.dragData)
            },
            onStartDrag: function(b, i) {
                var h = Ext.get(this.dragData.sourceEl).getBox();
                var g = SYNO.SDS.Desktop.getEl().getBox();
                var e = Ext.get(this.dragData.sourceEl);
                e.setVisibilityMode(Ext.Element.VISIBILITY);
                if (!a.isInSelectState()) {
                    e.hide()
                }
                var f = this.getProxy();
                f.getEl().disableShadow();
                this.dragData.sourceEl.initPos = [b - e.getLeft(), i - e.getTop() + 30];
                this.dragData.sourceEl.moving = false;
                this.minX = g.x;
                this.minY = g.y;
                this.maxX = g.right - h.width;
                this.maxY = g.bottom - h.height;
                this.constrainX = true;
                this.constrainY = true;
                var d = Ext.get("sds-desktop");
                var c = d.dom.getElementsByTagName("iframe");
                Ext.each(c, function(j) {
                    var k = document.createElement("div");
                    k.addClassName("sds-shim-for-iframe");
                    Ext.get(j.parentNode).appendChild(k)
                })
            }
        });
        this.el.dropZone = new Ext.dd.DropZone(Ext.getBody(), {
            dropAllowed: "x-dd-drop-ok-add",
            ddGroup: "SDSShortCut",
            getTargetFromEvent: function(c) {
                var b = c.getTarget("li.launch-icon");
                if (b && Ext.fly(b).findParentNode(".sds-desktop-shortcut")) {
                    return b
                }
                return null
            },
            onNodeOver: this.onNodeOver.createDelegate(this, [], true),
            onContainerOver: this.onContainerOver.createDelegate(this, [], true),
            onContainerDrop: this.onNotifyDrop.createDelegate(this, [], true),
            onNodeDrop: this.onNodeDrop.createDelegate(this, [], true)
        });
        this.el.dropZone.addToGroup("AppReorderAndShortCut");
        this.el.dropZone.addToGroup("AppShortCut");
        this.onWindowResize();
        Ext.EventManager.onWindowResize(this.onWindowResize, this);
        this.loadUserSettings();
        this.mon(SYNO.SDS.StatusNotifier, "servicechanged", this.onServiceChanged, this);
        this.mon(SYNO.SDS.StatusNotifier, "appprivilegechanged", this.onServiceChanged, this);
        this.mon(SYNO.SDS.StatusNotifier, "urltagchanged", this.refresh, this);
        if (_S("isMobile") && _S("is_admin")) {
            this.addMobileEditionButton()
        } else {
            if (a.isBeta) {
                this.addBetaBugReportButton()
            }
        }
        this.el.on("mousedown", this.onDesktopMouseDown, this)
    },
    onEndDrag: function(d) {
        var a = Ext.get(d._fromAppMenu ? d.desktopSrcEl : d.sourceEl);
        var c = SYNO.SDS.Desktop;
        if (c.isInSelectState()) {
            Ext.removeNode(d.ddel);
            Ext.destroy(c.ddel)
        }
        a.show();
        Ext.each(SYNO.SDS.Desktop.iconItems, function(f, e) {
            if (!f) {
                return
            }
            if (f.className === "SYNO.SDS.VirtualGroup") {
                f.validTempNode()
            }
        });
        var b = Ext.get("sds-desktop").query(".sds-shim-for-iframe");
        Ext.each(b, function(e) {
            Ext.removeNode(e)
        });
        this.el.focus()
    },
    setDesktopVisible: function(b) {
        var a = Ext.get("sds-desktop");
        a.setVisibilityMode(Ext.Element.OFFSETS);
        if (this.bugReportButton) {
            this.bugReportButton.setVisible(b)
        }
    },
    hide: function() {
        this.setDesktopVisible(false);
        this.addClass(this.opacityHideCls);
        this.removeClass(this.showCls);
        if (Ext.isIE) {
            this.callParent()
        }
    },
    show: function() {
        this.setDesktopVisible(true);
        this.callParent();
        this.removeClass(this.opacityHideCls);
        this.removeClass("semi-transparent");
        this.removeClass("sent-back")
    },
    onShowAll: function() {
        this.showDesktop();
        SYNO.SDS.WindowMgr.toggleAllWin(this.taskButton)
    },
    isInSelectState: function() {
        var a = false;
        Ext.each(this.iconItems, function(b) {
            if (a) {
                return
            }
            if (b && b.isSelected()) {
                a = true
            }
        }, this);
        return a
    },
    getEvtXYWithScroll: function(a) {
        return [a.xy[0] + this.el.dom.scrollLeft, a.xy[1] + this.el.dom.scrollTop]
    },
    onDesktopMouseDown: function(a, d, f) {
        var c = this.el.getLeft(),
            b;
        var e = this.getEvtXYWithScroll(a);
        if (e[0] > d.scrollWidth || e[1] > d.scrollHeight) {
            return
        }
        if (a.target === this.el.dom) {
            b = Ext.get(document.body);
            b.on("mousemove", this.onDesktopMouseMove, this);
            b.on("mouseup", this.onDesktopMouseUp, this);
            b.on("mouseleave", this.onDesktopMouseLeave, this, {
                delay: 100
            });
            this.el._beginDragPos = e;
            if (this._range) {
                this._range.remove()
            }
            this._range = this.el.createChild({
                tag: "div",
                cls: "sds-desktop-select-range"
            });
            this._range.setPosition = function(j, g, i) {
                this.setLeft(j[0] - c);
                this.setTop(j[1] - 32);
                this.setWidth(g);
                this.setHeight(i)
            }.createDelegate(this._range);
            this._range.setPosition(e, 0, 0)
        }
    },
    onDesktopMouseMove: function(b) {
        if (!this.el._beginDragPos || !b) {
            return
        }
        var c = this.el._beginDragPos;
        var e = this.getEvtXYWithScroll(b);
        var a = e[0] - c[0];
        var d = e[1] - c[1];
        e = [a > 0 ? c[0] : e[0], d > 0 ? c[1] : e[1]];
        a = Math.abs(a);
        d = Math.abs(d);
        this._range.setPosition(e, a, d);
        this.rangeDetectTask = new Ext.util.DelayedTask(this.detectOverlappedObjects, this);
        this.rangeDetectTask.delay(5)
    },
    onDesktopMouseLeave: function(a) {
        this.cancelRangeDetectTask();
        this.endRangeDetect()
    },
    onDesktopMouseUp: function(a) {
        this.cancelRangeDetectTask();
        this.detectOverlappedObjects();
        this.endRangeDetect()
    },
    cancelRangeDetectTask: function() {
        if (this.rangeDetectTask) {
            this.rangeDetectTask.cancel();
            this.rangeDetectTask = null
        }
    },
    endRangeDetect: function() {
        var a = Ext.get(document.body);
        if (this._range) {
            this._range.remove()
        }
        this._range = null;
        delete this.el._beginDragPos;
        a.un("mousemove", this.onDesktopMouseMove, this);
        a.un("mouseup", this.onDesktopMouseUp, this);
        a.un("mouseleave", this.onDesktopMouseLeave, this)
    },
    collisionDetect: function(d, c) {
        var a, b;
        if (!d || !c) {
            return
        }
        a = d.getRegion();
        b = c.getRegion();
        return (((a.left < b.right && a.right > b.right) || (a.left < b.left && a.right > b.left) || (a.left > b.left && a.right < b.right)) && ((a.top > b.top && a.bottom < b.bottom) || (a.top < b.bottom && a.bottom > b.bottom) || (a.bottom > b.top && a.top < b.top)))
    },
    detectOverlappedObjects: function() {
        var a = 0;
        Ext.each(this.iconItems, function(c, b) {
            if (c.subItems) {
                return
            }
            if (this.collisionDetect(c.li_el, this._range)) {
                this.selectItem(c, true);
                a++
            } else {
                this.selectItem(c, false)
            }
        }, this);
        if (a === 0) {
            Ext.destroy(this.ddel)
        }
    },
    selectItem: function(b, a) {
        var c = "sds-desktop-icon-selected";
        if (!b || !b.li_el || !b.setSelected) {
            return
        }
        b.setSelected(a);
        if (a) {
            b.li_el.addClass(c)
        } else {
            b.li_el.removeClass(c)
        }
    },
    getCursorOverType: function(d, c) {
        var b, a;
        b = d[0] - c[0];
        a = d[1] - c[1];
        if (a <= 17) {
            return this.CURSOR_OVER_TYPE.ABOVE_ICON
        } else {
            if (a >= 80) {
                return this.CURSOR_OVER_TYPE.BELOW_ICON
            } else {
                return this.CURSOR_OVER_TYPE.OVER_ICON
            }
        }
    },
    onContainerOver: function(c, b, a) {
        if (a.ddText) {
            c.getProxy().getGhost().update(a.ddText)
        }
        if (b.getTarget("#sds-sub-container")) {
            return this.REPOSITION_OK_CLS
        }
        return (a._fromDesktop || a._fromAppMenu) ? this.REPOSITION_OK_CLS : this.DROP_ALLOWED_CLS
    },
    onNodeOver: function(b, d, a, c) {
        if (c._fromSubContainer || this.isSubContainerExist()) {
            return this.onSubNodeOver(b, d, a, c)
        } else {
            if (c._fromDesktop || c._fromAppMenu) {
                return this.onDesktopNodeOver(b, d, a, c)
            }
        }
        return this.DROP_ALLOWED_CLS
    },
    onSubNodeOver: function(d, b, e, g) {
        var f = e.xy;
        var h = Ext.get(d).getXY();
        var j = [f[0] - h[0], f[1] - h[1]];
        var a = null;
        if (this.appendSubItemMode) {
            a = this.getItemFromSubTempNode()
        } else {
            if (g._fromSubContainer) {
                a = this.getItemFromSubNode(g.sourceEl)
            } else {
                if (this._creatingVirtualGroup) {
                    a = this.getItemFromSubTempNode()
                }
            }
        }
        var i = this.getItemFromSubNode(d);
        var c = this.iconItems[i[0]];
        if (!this.isVirtualGroup(c)) {
            return this.DROP_ALLOWED_CLS
        }
        if (j[0] > 40) {
            i[1]++
        }
        c.rePosition(a[1], i[1]);
        return this.REPOSITION_OK_CLS
    },
    onDesktopNodeOver: function(b, a, c, g) {
        var f, e = this.getItemFromNode(b),
            d, i, h, j;
        if (g._fromAppMenu) {
            f = this.getItemFromNode(g.desktopSrcEl)
        } else {
            f = this.getItemFromNode(g.sourceEl)
        }
        if (f < 0 || e < 0) {
            return
        }
        d = this.iconItems[f];
        i = this.iconItems[e];
        j = this.getCursorOverType(c.xy, Ext.get(b).getXY());
        this.cancelDeferTask();
        if (j === this.CURSOR_OVER_TYPE.OVER_ICON) {
            return this.nodeOverToGrouping(b, f, e, d, i)
        }
        if (j === this.CURSOR_OVER_TYPE.ABOVE_ICON) {
            h = this.rePosition.defer(100, this, [f, e]);
            this.setDeferTaskId(h)
        } else {
            h = this.rePosition.defer(100, this, [f, e + 1]);
            this.setDeferTaskId(h)
        }
        return this.REPOSITION_OK_CLS
    },
    rePosition: function(c, d) {
        if (c === d) {
            return
        }
        if (this.isInSelectState()) {
            return
        }
        var a = this.items[c];
        var b = this.iconItems[c];
        this.items.splice(d, 0, a);
        this.iconItems.splice(d, 0, b);
        if (d < c) {
            c++
        }
        this.items.splice(c, 1);
        this.iconItems.splice(c, 1);
        this.updateItemsSetting();
        this.refresh()
    },
    isVirtualGroup: function(a) {
        if (a && a.className === "SYNO.SDS.VirtualGroup") {
            return true
        }
        return false
    },
    nodeOverToGrouping: function(b, e, d, c, h) {
        var a = this.isVirtualGroup(c);
        var f = this.isVirtualGroup(h);
        var i;
        if (!c || !h) {
            return
        }
        if (this.isInSelectState()) {
            if (h.isSelected()) {
                return
            } else {
                return this.DROP_ALLOWED_CLS
            }
        } else {
            if (b && f && !a) {
                var g = Ext.copyTo({}, c.managerItemConfig ? c.managerItemConfig : c, this.allowedCfgProperty);
                i = this.deferTaskToShowFolder.defer(800, this, [d, g]);
                this.setDeferTaskId(i);
                return this.DROP_ALLOWED_CLS
            } else {
                if (b && !f && !a) {
                    i = this.deferCreateVirtualGroup.defer(800, this, [e, d, c, h]);
                    this.setDeferTaskId(i);
                    return this.DROP_ALLOWED_CLS
                }
            }
        }
    },
    deferCreateVirtualGroup: function(d, f, c, e) {
        var b, a;
        this.backupNode = {
            src: {
                index: d,
                item: this.items[d]
            },
            dst: {
                index: f,
                item: this.items[f]
            }
        };
        this.setOldDstItem(e);
        e.li_el.hide();
        b = this.createNewGroupIcon(f, e, false);
        this._containerShown = true;
        this._creatingVirtualGroup = true;
        b.createSubContainer();
        a = Ext.copyTo({}, c.managerItemConfig ? c.managerItemConfig : c, this.allowedCfgProperty);
        b.addSubItem(a);
        b.refresh()
    },
    getItemFromSubTempNode: function() {
        var a = [-1, -1];
        Ext.each(this.iconItems, function(c, b) {
            if (a[1] >= 0) {
                return false
            }
            Ext.each(c.iconItems, function(e, d) {
                if (!e) {
                    return
                }
                if (e.li_el._temp) {
                    a[0] = b;
                    a[1] = d;
                    return false
                }
            })
        });
        return a
    },
    getItemFromSubNode: function(a) {
        var b = [-1, -1];
        Ext.each(this.iconItems, function(d, c) {
            if (!d) {
                return
            }
            if (b[1] >= 0) {
                return false
            }
            Ext.each(d.iconItems, function(f, e) {
                if (f && (a === f.dragEl.dom)) {
                    b[0] = c;
                    b[1] = e;
                    return false
                }
            })
        });
        return b
    },
    updateItemsSetting: function() {
        SYNO.SDS.UserSettings.setProperty("Desktop", "ShortcutItems", this.items)
    },
    deferTaskToShowFolder: function(a, b) {
        var c = this.iconItems[a];
        if (!c) {
            return
        }
        c.createSubContainer();
        if (b) {
            this.appendSubItemMode = true;
            c.addSubItem(b);
            c.refresh()
        }
        this._containerShown = true
    },
    addMobileEditionButton: function() {
        this.bugReportButton = this.el.createChild({
            tag: "div",
            id: "sds-mobile-edition",
            title: _T("common", "mobile_edition")
        });
        this.mon(Ext.fly("sds-mobile-edition"), "click", function() {
            window.location = "?forceDesktop=0"
        })
    },
    addBetaBugReportButton: function() {
        this.bugReportButton = this.el.createChild({
            tag: "div",
            id: "sds-bug-report-container",
            cn: [{
                tag: "div",
                id: "sds-bug-report",
                title: _T("pkgmgr", "report_desc")
            }]
        });
        this.mon(Ext.fly("sds-bug-report"), "click", function() {
            if (_S("is_admin")) {
                SYNO.SDS.AppLaunch("SYNO.SDS.SupportForm.Application")
            } else {
                window.open("http://myds.synology.com/support/beta_dsm_form.php", "_blank")
            }
        })
    },
    onWindowResize: function() {
        this.el.setHeight(Ext.lib.Dom.getViewHeight() - SYNO.SDS.TaskBar.getHeight());
        this.el.setWidth(Ext.lib.Dom.getViewWidth());
        var a = this.el.getBox();
        this.el.setStyle({
            "overflow-x": (a.width <= SYNO.SDS.DesktopSetting.miniWidth) ? "auto" : "hidden",
            "overflow-y": (a.height <= SYNO.SDS.DesktopSetting.miniHeight) ? "auto" : "hidden"
        });
        if (this.customizeWallpaper) {
            if ("fill" === this.bgPosition) {
                this.doFillWallpaper()
            } else {
                if ("fit" === this.bgPosition) {
                    this.doFitWallpaper()
                }
            }
        } else {
            if (this.bigScreen) {
                this.doFillWallpaper()
            }
        }
        this.refresh();
        this.fireEvent("desktopresize", this)
    },
    doFillWallpaper: function() {
        var a = Ext.lib.Dom.getViewWidth(),
            c = Ext.lib.Dom.getViewHeight();
        var b = Ext.fly("sds-wallpaper");
        if (a > c * this.bgRatio) {
            b.setWidth(a);
            b.setHeight(a / this.bgRatio);
            b.setLeft(0);
            b.setTop((c - (a / this.bgRatio)) / 2)
        } else {
            b.setWidth(c * this.bgRatio);
            b.setHeight(c);
            b.setLeft((a - (c * this.bgRatio)) / 2);
            b.setTop(0)
        }
    },
    doFitWallpaper: function() {
        var a = Ext.lib.Dom.getViewWidth(),
            c = Ext.lib.Dom.getViewHeight();
        var b = Ext.fly("sds-wallpaper");
        if (a > c * this.bgRatio) {
            b.setWidth(c * this.bgRatio);
            b.setHeight(c);
            b.setLeft((a - (c * this.bgRatio)) / 2);
            b.setTop(0)
        } else {
            b.setWidth(a);
            b.setHeight(a / this.bgRatio);
            b.setLeft(0);
            b.setTop((c - (a / this.bgRatio)) / 2)
        }
    },
    getDragData: function(d) {
        var f, b, a = this.getItemFromNode(d.getTarget("li.launch-icon"));
        if (a >= 0) {
            b = this.iconItems[a];
            if (!b) {
                return
            }
            if (this.isInSelectState()) {
                if (b.isSelected()) {
                    return this.getDragDataInSelectState(a, d)
                } else {
                    this.deselectItems()
                }
            }
            f = b.dragEl.dom.cloneNode(true);
            f.style.position = "";
            f.style.left = "";
            f.style.top = "";
            f.id = Ext.id();
            return {
                _fromDesktop: true,
                ddel: f,
                sourceEl: b.dragEl.dom,
                repairXY: b.dragEl.getXY(),
                SDSShortCut: b.managerItemConfig
            }
        } else {
            var g = this.getItemFromSubNode(d.getTarget("li.launch-icon")),
                c = this.iconItems[g[0]];
            if (!c) {
                return
            }
            if (c && c.iconItems && c.iconItems.length <= 0) {
                return
            }
            b = c.iconItems[g[1]];
            if (!b) {
                return
            }
            f = b.dragEl.dom.cloneNode(true);
            f.style.position = "";
            f.style.left = "";
            f.style.top = "";
            f.id = Ext.id();
            return {
                _fromDesktop: false,
                _fromSubContainer: true,
                ddel: f,
                sourceEl: b.dragEl.dom,
                repairXY: b.dragEl.getXY(),
                SDSShortCut: b.managerItemConfig
            }
        }
    },
    getDragDataInSelectState: function(a, b) {
        var c = [],
            e, d;
        e = Ext.getBody().createChild({
            tag: "div",
            cls: "sds-desktop-dd-ct"
        });
        Ext.destroy(this.ddel);
        this.ddel = e;
        Ext.each(this.iconItems, function(f) {
            var g;
            if (f && f.isSelected()) {
                g = f.dragEl.dom.cloneNode(true);
                g.id = Ext.id();
                c.push(g);
                e.appendChild(g)
            }
        }, this);
        d = this.iconItems[a];
        if (!d) {
            return
        }
        e = e.dom.cloneNode(true);
        e.style.top = "0px";
        e.id = Ext.id();
        return {
            _fromDesktop: true,
            ddel: e,
            sourceEl: d.dragEl.dom,
            repairXY: d.dragEl.getXY(),
            SDSShortCut: d.managerItemConfig
        }
    },
    onNodeDropToInsertToGroup: function(c, b, a) {
        var d = this.getItemFromNode(a._fromAppMenu ? a.desktopSrcEl : a.sourceEl);
        if (d >= 0) {
            this.iconItems[d].remove()
        } else {
            SYNO.Debug("Failed to get src node when insert to group")
        }
        this.appendSubItemMode = false
    },
    onNotifyDrop: function(c, b, a) {
        if (b.getTarget("#sds-sub-container") || "sds-sub-container-shim" === b.target.id) {
            if (this._creatingVirtualGroup) {
                this.removeOldDstItem();
                this.iconItems[this.backupNode.src.index].remove();
                this.updateItemsSetting();
                this.refresh();
                this.backupNode = null;
                this._creatingVirtualGroup = false
            }
            if (this.appendSubItemMode) {
                this.onNodeDropToInsertToGroup(c, b, a)
            }
            if ("sds-sub-container-shim" !== b.target.id) {
                return true
            }
        }
        return this.onNodeDrop(null, c, b, a)
    },
    onNodeDropSelectedToInsertToGroup: function(d, e, b, a) {
        var f = this.getItemFromNode(d),
            g, c = [];
        if (f < 0) {
            return
        }
        g = this.iconItems[f];
        if (!g || g.isSelected()) {
            return
        }
        if (!this.isVirtualGroup(g)) {
            g = this.createNewGroupIcon(f, g, true)
        }
        Ext.each(this.iconItems, function(j, h) {
            var i, k;
            if (j && j.isSelected()) {
                k = this.items[h];
                i = Ext.copyTo({}, k.managerItemConfig ? k.managerItemConfig : k, this.allowedCfgProperty);
                g.addSubItem(i, true);
                c.push(j)
            }
        }, this);
        Ext.each(c, function(h) {
            h.remove()
        }, this);
        g.blinkForAdd();
        g.refreshElementIcons();
        this.refresh();
        return true
    },
    createNewGroupIcon: function(g, h, c) {
        var d, e, f;
        if (h < 0 || !h) {
            return
        }
        d = Ext.copyTo({}, h.managerItemConfig ? h.managerItemConfig : h, this.allowedCfgProperty);
        e = {
            className: "SYNO.SDS.VirtualGroup",
            title: "New Group",
            subItems: [d]
        };
        f = this.iconItems[g];
        this.items[g] = e;
        var b = {
                x: f.li_el.dom.style.left,
                y: f.li_el.dom.style.top
            },
            a = new SYNO.SDS.LaunchItem(Ext.apply({}, {
                manager: this,
                removable: true
            }, e), this._desktopShortcutUl);
        a.li_el.setLeft(b.x);
        a.li_el.setTop(b.y);
        a.li_el.addClass.defer(500, a.li_el, ["transition-cls"]);
        this.iconItems[g] = a;
        a.managerItemConfig = this.items[g];
        if (c === true) {
            f.remove()
        }
        return a
    },
    onNodeDrop: function(d, e, a, p) {
        var q = -1,
            g = p.SDSShortCut,
            l, j, o;
        if (this.isInSelectState()) {
            return this.onNodeDropSelectedToInsertToGroup(d, e, a, p)
        }
        if ((!p._fromFile && (!g || !g.className)) || (d && d === p.sourceEl)) {
            return false
        }
        if (d) {
            q = this.getItemFromNode(d)
        }
        this.cancelDeferTask();
        if (p._fromSubContainer && a.target.id === "sds-sub-container-shim") {
            var m = this.getItemFromSubNode(p.sourceEl);
            var c = this.iconItems[m[0]].iconItems[m[1]];
            if (c) {
                c.remove()
            }
            this.addLaunchItem(p.SDSShortCut, -1)
        } else {
            if (p._fromSubContainer && a.getTarget("#sds-sub-container")) {
                var n = this.getItemFromSubNode(d);
                var h = this.getItemFromSubNode(p.sourceEl);
                var i = this.iconItems[n[0]];
                i.iconItems[n[1]].li_el.show();
                i.iconItems[h[1]].li_el.show();
                return true
            } else {
                if ((p._fromDesktop || p._fromAppMenu) && a.getTarget("#sds-sub-container")) {
                    return this.onNotifyDrop(e, a, p)
                } else {
                    if (p._fromFile) {
                        var k = a.getTarget();
                        if (!k || !Ext.fly(k).findParentNode("div.syno-sds-fs-win", Number.MAX_VALUE)) {
                            l = this.isNodeDropOnIcon(d, e, a, p);
                            if (!l) {
                                this.addLaunchItems(g, q)
                            } else {
                                if (this.isVirtualGroup(l)) {
                                    if (Ext.isArray(p.SDSShortCut)) {
                                        Ext.each(p.SDSShortCut, function(s) {
                                            var r = Ext.copyTo({}, s.config, this.allowedCfgProperty);
                                            l.addSubItem(r, true)
                                        }, this);
                                        l.blinkForAdd();
                                        l.refreshElementIcons()
                                    }
                                } else {
                                    if (Ext.isArray(p.SDSShortCut)) {
                                        o = this.createNewGroupIcon(q, l, true);
                                        Ext.each(p.SDSShortCut, function(s) {
                                            var r = Ext.copyTo({}, s.config, this.allowedCfgProperty);
                                            o.addSubItem(r, true)
                                        }, this);
                                        o.blinkForAdd();
                                        o.refreshElementIcons()
                                    }
                                }
                            }
                        }
                    } else {
                        if (p.SDSShortCut) {
                            if (p._fromControlPanel || p._fromDesktop || p._fromAppMenu) {
                                l = this.isNodeDropOnIcon(d, e, a, p);
                                var b;
                                if (p._fromDesktop || p._fromAppMenu) {
                                    var f = this.getItemFromNode(p._fromAppMenu ? p.desktopSrcEl : p.sourceEl);
                                    b = this.iconItems[f]
                                }
                                if (!l) {
                                    if (p._fromControlPanel) {
                                        this.addLaunchItem(p.SDSShortCut, q)
                                    }
                                } else {
                                    if (this.isVirtualGroup(b)) {} else {
                                        if (this.isVirtualGroup(l)) {
                                            j = Ext.copyTo({}, p.SDSShortCut, this.allowedCfgProperty);
                                            l = this.iconItems[q];
                                            l.addSubItem(j, true);
                                            l.blinkForAdd();
                                            l.refreshElementIcons();
                                            if ((p._fromDesktop || p._fromAppMenu) && b) {
                                                b.remove()
                                            }
                                        } else {
                                            j = Ext.copyTo({}, p.SDSShortCut, this.allowedCfgProperty);
                                            o = this.createNewGroupIcon(q, l, true);
                                            o.addSubItem(j, true);
                                            o.blinkForAdd();
                                            o.refreshElementIcons();
                                            if ((p._fromDesktop || p._fromAppMenu) && b) {
                                                b.remove()
                                            }
                                            this.refresh()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return true
    },
    isNodeDropOnIcon: function(d, e, c, b) {
        var a = -1,
            g, f;
        if (d) {
            a = this.getItemFromNode(d);
            g = this.getCursorOverType(c.xy, Ext.get(d).getXY())
        }
        if (a >= 0 && g === this.CURSOR_OVER_TYPE.OVER_ICON) {
            f = this.iconItems[a];
            return f
        }
        return false
    },
    getItemFromNode: function(a) {
        var b = -1;
        if (!a) {
            return
        }
        Ext.each(this.iconItems, function(d, c) {
            if (d && (a === d.dragEl.dom)) {
                b = c;
                return false
            }
        });
        return b
    },
    validateItems: function() {
        var a = [],
            b = [];
        Ext.each(this.items, function(d, c) {
            var e = d.className || d.jsID;
            if (_S("ha_safemode")) {
                if (-1 == e.search("SYNO.SDS.HA")) {
                    return
                }
            }
            if (this.isVirtualGroup(d)) {
                a.push(d);
                return
            }
            if (SYNO.SDS.Config.FnMap[e] && !this.isHiddenControlPanelModule(e, d)) {
                d.needHide = !SYNO.SDS.StatusNotifier.isAppEnabled(e);
                a.push(d)
            }
        }, this);
        if (this.items.length !== a.length) {
            this.items = a;
            SYNO.SDS.UserSettings.setProperty("Desktop", "ShortcutItems", this.items);
            Ext.each(this.iconItems, function(c) {
                if (-1 === this.items.indexOf(c.managerItemConfig)) {
                    b.push(c)
                }
            }, this);
            Ext.each(b, function(c) {
                c.remove()
            }, this)
        }
        Ext.each(this.iconItems, function(c) {
            if (this.isVirtualGroup(c)) {
                c.validateItems()
            }
        }, this)
    },
    loadUserSettings: function() {
        var a = SYNO.SDS.UserSettings.getProperty("Desktop", "ShortcutItems") || this.defShortCuts;
        a = this.removeDeprecatedShortcutItems(a);
        this.updateBackground();
        Ext.each(a, function(b) {
            this.addLaunchItem(b, -1, true)
        }, this);
        this.updateTextColor()
    },
    upgradeWallpaperConfig: function(a) {
        var b = a.customize_wallpaper;
        var c = (a.wallpaper_path && 0 <= a.wallpaper_path.indexOf("resources/images/default_wallpaper"));
        if (b && c) {
            a.customize_wallpaper = false;
            a.customize_color = false
        }
        a.version = "v5";
        SYNO.SDS.UserSettings.setProperty("Desktop", "wallpaper", a);
        return a
    },
    updateBackground: function(a) {
        var g, b, d = Ext.apply({}, SYNO.SDS.UserSettings.getProperty("Desktop", "wallpaper") || {}),
            f = false;
        var c = SYNO.SDS.UserSettings.getProperty("SYNO.SDS.App.WelcomeApp.Instance", "welcome_dsm50_hide") || !(_S("user") == "admin" && _S("is_admin")) || (_S("demo_mode") === true);
        var e = {
            backgroundColor: "transparent",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundImage: SYNO.SDS.UIFeatures.IconSizeManager.getIconPath("resources/images/default_wallpaper/01.jpg?v=" + _S("version"))
        };
        if (d.version != "v5") {
            d = this.upgradeWallpaperConfig(d)
        }
        if (a) {
            Ext.apply(d, a, {
                customize_color: false,
                customize_wallpaper: false
            });
            this.previewCounter++
        }
        if (d.customize_color) {
            e.backgroundColor = (d.background_color || "#FFFFFF");
            e.backgroundImage = ""
        }
        if (d.customize_wallpaper) {
            this.customizeWallpaper = true;
            this.bgPosition = d.wallpaper_position || "center";
            this.dsmLogo.hide();
            b = Ext.fly("sds-wallpaper");
            b.hide();
            if (!d.newImage) {
                g = Ext.urlAppend("wallpaper.cgi", Ext.urlEncode({
                    user: _S("user"),
                    id: d.wallpaper,
                    preview: this.previewCounter,
                    retina: SYNO.SDS.UIFeatures.IconSizeManager.getRetinaAndSynohdpackStatus(),
                    type: d.wallpaper_type
                }))
            } else {
                if (d.wallpaper_path) {
                    g = Ext.urlAppend("wallpaper.cgi", Ext.urlEncode({
                        user: _S("user"),
                        id: d.wallpaper,
                        path: SYNO.SDS.Utils.bin2hex(d.wallpaper_path),
                        preview: this.previewCounter,
                        retina: SYNO.SDS.UIFeatures.IconSizeManager.getRetinaAndSynohdpackStatus()
                    }))
                } else {
                    g = ""
                }
            }
            if ("center" === this.bgPosition) {
                e.backgroundImage = g
            } else {
                if ("tile" === this.bgPosition) {
                    e.backgroundPosition = "left top";
                    e.backgroundRepeat = "repeat";
                    e.backgroundImage = g
                } else {
                    e.backgroundImage = "";
                    b.applyStyles({
                        top: "auto",
                        left: "auto",
                        right: "auto",
                        height: "auto"
                    });
                    if ("stretch" === this.bgPosition) {
                        b.applyStyles({
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%"
                        });
                        if (g && c) {
                            b.show()
                        }
                    } else {
                        if ("fill" === this.bgPosition) {
                            b.on("load", function(j, i) {
                                this.bgRatio = Ext.fly("sds-wallpaper").getWidth() / Ext.fly("sds-wallpaper").getHeight();
                                this.doFillWallpaper();
                                if (g && c) {
                                    b.show()
                                }
                            }, this, {
                                single: true
                            })
                        } else {
                            if ("fit" === this.bgPosition) {
                                b.on("load", function(j, i) {
                                    this.bgRatio = Ext.fly("sds-wallpaper").getWidth() / Ext.fly("sds-wallpaper").getHeight();
                                    this.doFitWallpaper();
                                    if (g && c) {
                                        b.show()
                                    }
                                }, this, {
                                    single: true
                                })
                            }
                        }
                    }
                    if (g) {
                        b.dom.src = g
                    }
                }
            }
        } else {
            this.customizeWallpaper = false;
            if (window.screen.width > 1920 || window.screen.height > 1200) {
                this.bigScreen = true;
                b = Ext.fly("sds-wallpaper");
                b.hide();
                g = e.backgroundImage;
                e.backgroundImage = "";
                b.applyStyles({
                    top: "auto",
                    left: "auto",
                    right: "auto",
                    height: "auto"
                });
                b.on("load", function(j, i) {
                    this.bgRatio = Ext.fly("sds-wallpaper").getWidth() / Ext.fly("sds-wallpaper").getHeight();
                    this.doFillWallpaper();
                    if (g && c) {
                        b.show()
                    }
                }, this, {
                    single: true
                });
                if (g) {
                    b.dom.src = g
                }
            } else {
                this.bigScreen = false;
                f = true;
                Ext.fly("sds-wallpaper").hide()
            }
            this.dsmLogo.show()
        }
        if (e.backgroundImage) {
            document.body.style.background = String.format("{0} url({1}) {2} {3}", e.backgroundColor, e.backgroundImage, e.backgroundRepeat, e.backgroundPosition);
            if (_S("isMobile") && f) {
                document.body.style.webkitBackgroundSize = "cover"
            }
        } else {
            document.body.style.background = String.format("{0} {1} {2}", e.backgroundColor, e.backgroundRepeat, e.backgroundPosition)
        }
    },
    updateTextColor: function(a) {
        var c = Ext.apply({}, SYNO.SDS.UserSettings.getProperty("Desktop", "wallpaper") || {});
        var b = "#FFFFFF";
        if (a) {
            Ext.apply(c, a, {
                customize_color: false,
                customize_wallpaper: false
            })
        }
        if (c.customize_color) {
            b = c.text_color || "#FFFFFF"
        }
        if (!Ext.isIE9p && Ext.isIE) {
            Ext.util.CSS.updateRule("#sds-desktop li.launch-icon .text", "color", b);
            Ext.util.CSS.updateRule("#sds-desktop li.launch-icon .text a", "color", b)
        } else {
            Ext.util.CSS.updateRule("#sds-desktop li.launch-icon .text, #sds-desktop li.launch-icon .text a", "color", b)
        }
    },
    onServiceChanged: function(c, a) {
        var b = 0;
        for (; b < this.iconItems.length; b++) {
            if (this.iconItems[b].className === c) {
                this.refresh()
            }
        }
    },
    addLaunchItemCfg: function(a, d, c) {
        var b = Ext.copyTo({}, a, this.allowedCfgProperty);
        if (Ext.isNumber(d) && d >= 0) {
            this.items.splice(d, 0, b)
        } else {
            this.items.push(b)
        }
        if (true !== c) {
            SYNO.SDS.UserSettings.setProperty("Desktop", "ShortcutItems", this.items)
        }
    },
    addLaunchItem: function(a, c, b) {
        this.addLaunchItemCfg(a, c, b);
        this.refresh()
    },
    addLaunchItems: function(a, b) {
        Ext.each(a, function(c) {
            this.addLaunchItemCfg(c.config, b || c.pos, c.skipRegister)
        }, this);
        this.refresh()
    },
    addHiddenLaunchItem: function(b, e) {
        var d = Ext.copyTo({}, b, this.allowedCfgProperty);
        var a = this.items.push(d) - 1;
        this.refresh();
        this.updateItems();
        var c = this.iconItems[a];
        c.el.hide();
        SYNO.SDS.UserSettings.setProperty("Desktop", "ShortcutItems", this.items);
        return a
    },
    removeLaunchItem: function(a) {
        if (!a.managerItemConfig) {
            return
        }
        this.iconItems.remove(a);
        this.items.remove(a.managerItemConfig);
        SYNO.SDS.UserSettings.setProperty("Desktop", "ShortcutItems", this.items);
        this.refresh()
    },
    showHideItems: function(a) {
        this.showIcon = a;
        Ext.each(this.iconItems, function(c, b) {
            if (a === true) {
                c.el.show()
            } else {
                c.el.hide()
            }
        }, this)
    },
    refresh: function() {
        this.updateTask.delay(this.updateDelay)
    },
    updateItems: function() {
        var c, a, f = 0,
            d = 0;
        var e = (this.iconItems.length <= 0);
        this.validateItems();
        if (!this._desktopShortcutUl) {
            c = this.el.createChild({
                tag: "ul",
                cls: "sds-desktop-shortcut"
            });
            this._desktopShortcutUl = c
        } else {
            c = this._desktopShortcutUl
        }
        var b = 0;
        var g = this.ICON_WIDTH;
        var h = this.ICON_HEIGHT;
        Ext.each(this.items, function(l) {
            var k = b * g,
                i = d * h,
                j = false;
            if (!e) {
                a = this.iconItems[f];
                if (a && a.managerItemConfig !== l) {
                    a = null
                }
            }
            if (e || !a || !a.li_el) {
                a = new SYNO.SDS.LaunchItem(Ext.apply({}, {
                    manager: this,
                    removable: true
                }, l), c);
                if (a.param) {
                    a.el.addClass("hide-overflow")
                }
                this.iconItems.splice(f, 0, a);
                a.managerItemConfig = l;
                j = true
            }
            a.el.setVisible(!l.needHide);
            if (l.needHide) {
                ++f;
                return
            }
            if ((i + h) > Ext.get("sds-desktop").getHeight()) {
                d = 0;
                b++;
                k = b * g;
                i = d * h
            }++f;
            ++d;
            this.animShortcutNode(a.li_el, k, i, !j)
        }, this);
        if (this.el.getBox().width < this.getTotalIconWidth()) {
            this.el.setStyle({
                "overflow-x": "scroll"
            });
            this.fireEvent("desktopresize", this)
        }
        this.isItemUpdated = true;
        this.fireEvent("desktopupdated")
    },
    animShortcutNode: function(c, b, a, d) {
        if (!c || !c.dom) {
            return
        }
        if (Ext.isIE && !c.dom.moving) {
            var e = c.getLeft(),
                f = c.getTop();
            if (e === b && f === a) {
                return
            }
            if (d) {
                c.shift({
                    left: b,
                    top: a,
                    easing: "easeOut",
                    duration: 0.5
                })
            } else {
                c.setLeftTop(b, a)
            }
        } else {
            if (!c.dom.moving) {
                if (!d) {
                    c.removeClass("transition-cls")
                }
                c.setStyle("left", b + "px");
                c.setStyle("top", a + "px");
                c.addClass.defer(100, c, ["transition-cls"])
            }
        }
    },
    isHiddenControlPanelModule: function(c, b) {
        if (c === "SYNO.SDS.ControlPanel.Instance") {
            return true
        }
        if (!b.param || !b.param.fn) {
            return false
        }
        var a = b.param.fn;
        if (Ext.isDefined(SYNO.SDS.AppPrivilege[a]) && false === SYNO.SDS.AppPrivilege[a]) {
            return true
        }
        return false
    },
    msgBox: null,
    getMsgBox: function() {
        if (!this.msgBox || this.msgBox.isDestroyed) {
            this.msgBox = new SYNO.SDS.MessageBoxV5({
                modal: true,
                draggable: false,
                renderTo: document.body
            })
        }
        return this.msgBox.getWrapper()
    },
    removeDeprecatedShortcutItems: function(b) {
        var a = [];
        var c = function(g) {
            if (!g.className) {
                return
            }
            var h = ["SYNO.SDS.LogViewer.Application", "SYNO.SDS.App.WelcomeApp.Instance", "SYNO.SDS.SystemInfoApp.Application", "SYNO.SDS.ControlPanel.Instance", "SYNO.SDS.Tutorial.Application"];
            for (var e = 0; e < h.length; e++) {
                if (h[e] == g.className) {
                    return true
                }
                if (g.className == "SYNO.SDS.VirtualGroup") {
                    var f = g.subItems;
                    for (var d = f.length - 1; d >= 0; d--) {
                        if (h[e] == f[d].className) {
                            g.subItems.splice(d, 1)
                        }
                    }
                }
            }
            return false
        };
        Ext.each(b, function(d) {
            if (c(d)) {
                return
            }
            if ("SYNO.SDS.ACEEditor.Application" === d.className && SYNO.SDS.Config.FnMap[d.className].config.hidden) {
                return
            }
            a.push(d)
        }, this);
        return a
    },
    isSubContainerExist: function() {
        return !!Ext.getDom("sds-sub-container")
    },
    setDeferTaskId: function(a) {
        this._deferTaskId = a
    },
    getDeferTaskId: function() {
        return this._deferTaskId
    },
    cancelDeferTask: function() {
        var a = this.getDeferTaskId();
        if (a > 0) {
            window.clearTimeout(a);
            this.setDeferTaskId(0)
        }
    },
    getSelectedItems: function() {
        var a = [];
        Ext.each(this.iconItems, function(b) {
            if (b && b.isSelected()) {
                a.push(b)
            }
        }, this);
        return a
    },
    removeSelectedItems: function() {
        Ext.each(this.getSelectedItems(), function(a) {
            a.setSelected(false);
            a.remove()
        }, this)
    },
    deselectItems: function() {
        Ext.each(this.getSelectedItems(), function(a) {
            this.selectItem(a, false)
        }, this)
    },
    setOldDstItem: function(a) {
        if (this._oldDstItem) {
            this._oldDstItem.remove()
        }
        this._oldDstItem = a
    },
    removeOldDstItem: function(a) {
        if (this._oldDstItem) {
            this._oldDstItem.remove()
        }
        this._oldDstItem = null
    },
    getTotalIconWidth: function() {
        var a = Ext.get("sds-desktop").getHeight();
        var c = Math.floor(a / this.ICON_HEIGHT);
        var b = 10 + this.ICON_WIDTH * Math.ceil(this.items.length / c);
        return b
    }
});
Ext.define("SYNO.SDS.Classical._Desktop", {
    extend: "SYNO.SDS._Desktop",
    ICON_HEIGHT: 100,
    getCursorOverType: function(d, c) {
        var b, a;
        b = d[0] - c[0];
        a = d[1] - c[1];
        if (a <= 17) {
            return this.CURSOR_OVER_TYPE.ABOVE_ICON
        } else {
            if (a >= 64) {
                return this.CURSOR_OVER_TYPE.BELOW_ICON
            } else {
                return this.CURSOR_OVER_TYPE.OVER_ICON
            }
        }
    }
});
Ext.define("SYNO.SDS._NewShortcutZone", {
    extend: "Ext.Container",
    isDropped: false,
    constructor: function(a) {
        this.zoneId = Ext.id();
        this.addIconId = Ext.id();
        this.type = a.type;
        this.parentView = a.parentView;
        this.slideDirection = (this.type === "right") ? "r" : "l";
        var b = {
            cls: "syno-sds-shortcut-zone-wrapper",
            width: a.width,
            height: a.height,
            items: [new Ext.Container({
                cls: "syno-sds-shortcut-zone " + a.type,
                id: this.zoneId,
                autoEl: {
                    cn: [{
                        tag: "div",
                        cls: "add-icon",
                        id: this.addIconId
                    }]
                },
                listeners: {
                    afterrender: this.defineFields,
                    scope: this
                }
            })]
        };
        SYNO.SDS._NewShortcutZone.superclass.constructor.call(this, b)
    },
    defineFields: function() {
        this.zone = Ext.get(this.zoneId);
        this.addIcon = Ext.get(this.addIconId);
        this.el.on("mouseenter", this.onMouseEnter, this);
        this.el.on("mouseleave", this.onMouseLeave, this)
    },
    onMouseEnter: function() {
        if (this.isDragging) {
            this.runTask("showDesktop", this.gotoDesktop, 500)
        }
    },
    onMouseLeave: function() {
        if (this.isDragging) {
            this.removeDelayedTask("showDesktop")
        }
    },
    gotoDesktop: function() {
        this.parentView.fireEvent("gotoDesktop");
        this.parentView.showDesktop()
    },
    resize: function(b, a) {
        this.setSize({
            width: b,
            height: a
        })
    },
    onStartDrag: function() {
        this.addClass("on-mouse-drag");
        this.isDropped = false;
        this.isDragging = true
    },
    onEndDrag: function() {
        this.isDragging = false;
        this.removeDelayedTask("showDesktop");
        if (this.isDropped) {
            Ext.defer(this.animateDropped, 100, this)
        } else {
            this.removeClass("on-mouse-drag")
        }
    },
    resetProperties: function() {
        this.addIcon.hide();
        this.addIcon.removeClass("bounce-effect-fast");
        this.removeClass("on-dropped");
        this.removeClass("on-mouse-drag")
    },
    animateDropped: function() {
        this.addIcon.setXY(this.dropPos);
        this.addIcon.show();
        this.addClass("on-dropped");
        this.addIcon.addClass("bounce-effect-fast");
        Ext.defer(function() {
            this.resetProperties()
        }, 1000, this)
    }
});
Ext.define("SYNO.SDS._AppView", {
    extend: "SYNO.SDS._DesktopView",
    constructor: function() {
        var c = this.getSizeConfig();
        var b = new Ext.BoxComponent({
            cls: "crossbrowser-background"
        });
        var a = {
            taskBarConfig: {
                enableToggle: true,
                tooltip: _T("helptoc", "mainmenu"),
                renderTo: "sds-taskbar-startbutton"
            },
            id: "sds-appview",
            cls: "syno-sds-appview white-scrollerbar",
            backgroundTransparent: true,
            hidden: true,
            renderTo: document.body,
            animateShowHide: true,
            width: c.viewW,
            height: c.viewH,
            items: [b, this.shortcutZoneLeft = new SYNO.SDS._AppViewShortcutZone({
                type: "left",
                width: c.shortcutZoneW,
                height: c.viewH,
                parentView: this
            }), this.appContainer = new SYNO.SDS._AppContainer(c), this.shortcutZoneRight = new SYNO.SDS._AppViewShortcutZone({
                type: "right",
                width: c.shortcutZoneW,
                height: c.viewH,
                parentView: this
            }), this.shortcutZoneBottom = new SYNO.SDS._AppViewShortcutZone({
                type: "bottom",
                width: c.viewW - c.shortcutZoneW * 2,
                height: "auto",
                parentView: this
            })],
            listeners: {
                beforeshow: {
                    fn: function() {
                        if (!this.inited) {
                            this.shortcutZoneLeft.registEvent();
                            this.shortcutZoneRight.registEvent();
                            this.shortcutZoneBottom.registEvent();
                            this.inited = true
                        }
                    },
                    scope: this
                },
                afterrender: {
                    fn: function() {
                        SYNO.SDS.TaskBar.addTaskBarButton(this.searchField = new SYNO.SDS._AppView.SearchField({
                            width: 250
                        }));
                        this.setTaskBarItemsVisible(true);
                        var d = !SYNO.SDS.UserSettings.getProperty("Desktop", "app_instr_showed");
                        if (d) {
                            this.addInstruction();
                            this.on("beforehide", this.removeInstruction, this)
                        }
                        if (_S("ha_safemode")) {
                            SYNO.SDS.TaskBar.rightTaskBar.hide()
                        }
                        this.transitionHandler.on("aftertransition", function() {
                            this.searchField.focus()
                        }, this)
                    },
                    scope: this
                },
                afterlayout: {
                    fn: function() {
                        var d = this.getHeight();
                        var e = this.appContainer.systemAppPanel.getHeight();
                        this.shortcutZoneBottom.setHeight(d - e - 24);
                        this.shortcutZoneRight.el.alignTo(this.el, "r-r");
                        this.shortcutZoneBottom.el.alignTo(this.el, "b-b");
                        this.appContainer.resetScroller()
                    },
                    scope: this
                }
            }
        };
        SYNO.SDS._AppView.superclass.constructor.call(this, a);
        this.mon(SYNO.SDS.StatusNotifier, "servicechanged", this.onServiceChanged, this);
        this.mon(SYNO.SDS.StatusNotifier, "appprivilegechanged", this.onServiceChanged, this);
        this.mon(SYNO.SDS.StatusNotifier, "beforeUserSettingsUnload", this.saveState, this);
        this.createBadge()
    },
    saveState: function() {
        var a = SYNO.SDS.AppUtil.getApps();
        SYNO.SDS.UserSettings.setProperty("Desktop", "appview_order", a)
    },
    onServiceChanged: function(c, a) {
        var b = SYNO.SDS.AppUtil.isApp(c);
        if (b) {
            this.refresh()
        }
    },
    addInstruction: function() {
        this.appContainer.addClass("on-instruction");
        this.callParent()
    },
    removeInstruction: function() {
        SYNO.SDS.UserSettings.setProperty("Desktop", "app_instr_showed", true);
        this.appContainer.removeClass("on-instruction");
        this.callParent()
    },
    createBadge: function() {
        var a = Ext.get("sds-taskbar-startbutton").child("button");
        this.badge = new SYNO.SDS.Utils.Notify.Badge({
            renderTo: a,
            badgeClassName: "sds-notify-badge-num",
            alignOffset: [-22, -6]
        });
        this.updateBadge()
    },
    resize: function() {
        var a = this.getSizeConfig();
        this.setWidth(a.viewW);
        this.setHeight(a.viewH);
        this.appContainer.resize(a);
        this.shortcutZoneLeft.resize(a.shortcutZoneW, a.viewH);
        this.shortcutZoneRight.resize(a.shortcutZoneW, a.viewH);
        this.shortcutZoneBottom.setWidth(a.viewW - a.shortcutZoneW * 2);
        if (this.instruction) {
            this.instruction.resize()
        }
    },
    refresh: function() {
        this.appContainer.refresh();
        this.updateBadge();
        this.searchField.showResult()
    },
    updateBadge: function() {
        var a = SYNO.SDS.UserSettings.getProperty("Desktop", "new_app_list") || [];
        this.badge.setNum(a.length)
    },
    getSizeConfig: function() {
        var i = SYNO.SDS.AppUtil.getApps();
        var g = i.length;
        var h = Ext.lib.Dom.getViewHeight() - SYNO.SDS.TaskBar.getHeight();
        var a = Ext.lib.Dom.getViewWidth();
        var d = Math.max(80, a * 0.1);
        var j = a - d * 2 - 24 * 2;
        var f = 136 + 16;
        var k = Math.floor(j / f);
        var c = Math.min(k, g);
        if (c < 4) {
            c = 4
        } else {
            if (c > 8) {
                c = 8
            }
        }
        var e = c * f;
        d = Math.round((a - e - 24 * 2) / 2);
        var b = {
            viewH: h,
            viewW: a,
            shortcutZoneW: d,
            marginLeft: d + 24,
            appContainerW: a,
            appPanelW: e
        };
        return b
    },
    show: function() {
        this.badge.setNum(0);
        this.setTaskBarItemsVisible(false);
        this.callParent()
    },
    notifyInstalled: function(f) {
        var c, d = f.length;
        if (this.isVisible()) {
            var b;
            for (c = 0; c < d; c++) {
                b = this.appContainer.systemAppPanel.getAppbyClassName(f[c]);
                b.addClass("new-app")
            }
        } else {
            var e = SYNO.SDS.UserSettings.getProperty("Desktop", "new_app_list") || [];
            var a = 0;
            for (c = 0; c < d; c++) {
                if (SYNO.SDS.AppUtil.isValidApp(f[c]) && -1 == e.indexOf(f[c])) {
                    e.push(f[c]);
                    a++
                }
            }
            if (a > 0) {
                SYNO.SDS.UserSettings.setProperty("Desktop", "new_app_list", e)
            }
            this.refresh()
        }
    },
    hide: function() {
        SYNO.SDS.UserSettings.setProperty("Desktop", "new_app_list", []);
        this.setTaskBarItemsVisible(true);
        this.searchField.onHideField();
        this.callParent()
    },
    setTaskBarItemsVisible: function(d) {
        var a = Ext.get("sds-taskbar-right");
        var b = Ext.get("sds-taskbar-zoom-buffer");
        var c = Ext.getCmp("sds-tray-panel");
        if (d) {
            a.removeClass("sds-taskbar-no-display");
            this.searchField.getResizeEl().addClass("sds-taskbar-no-display");
            this.searchField.getEl().addClass("sds-taskbar-no-display")
        } else {
            a.addClass("sds-taskbar-no-display");
            this.searchField.getResizeEl().removeClass("sds-taskbar-no-display");
            this.searchField.getEl().removeClass("sds-taskbar-no-display")
        }
        c.setVisible(d);
        SYNO.SDS.SystemTray.updateLayout();
        SYNO.SDS.TaskBar.doLayout();
        b[d ? "removeClass" : "addClass"]("sds-taskbar-no-display");
        if (d) {
            SYNO.SDS.TaskBar.doLayout()
        }
    },
    onClick: function(d, c) {
        var b = this.getWidth();
        var a = 10;
        var f = b - (a + 5);
        if (this.instruction) {
            this.removeInstruction()
        } else {
            if (d.button === 2) {
                return
            } else {
                if (d.xy[0] > f) {
                    return
                } else {
                    if (!d.getTarget("#sds-appview-app-item", "#sds-desktop")) {
                        this.showDesktop()
                    }
                }
            }
        }
    }
});
Ext.define("SYNO.SDS._AppContainer", {
    extend: "Ext.Container",
    constructor: function(a) {
        this.systemAppPanel = new SYNO.SDS._AppPanel({
            title: _T("common", "user_app"),
            type: "system-app-panel",
            allowOrder: true,
            width: a.appPanelW,
            marginLeft: a.marginLeft
        });
        this.searchResultPanel = new SYNO.SDS._AppPanel({
            title: "Search result",
            type: "search-result-app-panel",
            hidden: true,
            width: a.appPanelW,
            marginLeft: a.marginLeft
        });
        var b = {
            xtype: "container",
            id: "syno-sds-appview-container",
            cls: "syno-sds-appview-container scale-item",
            autoFlexcroll: true,
            updateScrollBarEventNames: [],
            height: a.viewH,
            width: a.appContainerW,
            items: [this.systemAppPanel, this.searchResultPanel],
            listeners: {
                afterlayout: {
                    fn: function() {
                        this.updateFleXcroll(true);
                        this.resetScroller(200)
                    },
                    scope: this
                }
            }
        };
        SYNO.SDS._AppContainer.superclass.constructor.call(this, b)
    },
    resize: function(a) {
        this.setWidth(a.appContainerW);
        this.setHeight(a.viewH);
        this.systemAppPanel.resize(a);
        this.searchResultPanel.resize(a)
    },
    refresh: function() {
        this.systemAppPanel.refresh();
        this.searchResultPanel.refresh()
    },
    updateApps: function() {
        this.systemApps = SYNO.SDS.AppUtil.getApps()
    }
});
Ext.define("SYNO.SDS._AppPanel", {
    extend: "Ext.Container",
    constructor: function(a) {
        Ext.apply(this, a);
        this.title = new Ext.Container({
            cls: a.type + "-title app-panel-title",
            html: a.title
        });
        this.appArea = new Ext.Container({
            cls: "sds-app-items-panel " + a.type,
            layout: this.allowOrder ? {
                type: "syno_float"
            } : null,
            width: a.width,
            getApps: function() {
                return this.items.items
            },
            getAppAt: function(d) {
                return this.items.items[d]
            }
        });
        var c;
        if (this.allowOrder) {
            c = new SYNO.SDS.AppViewDragDropPlugin({
                owner: this,
                appArea: this.appArea,
                allowOrder: true
            })
        } else {
            c = new SYNO.SDS.AppViewShortcutDDPlugin({
                owner: this,
                appArea: this.appArea
            })
        }
        var b = {
            cls: "sds-app-panel",
            style: String.format("margin-left: {0}px;", a.marginLeft),
            items: [this.title, this.appArea],
            plugins: [c]
        };
        this.refresh();
        SYNO.SDS._AppPanel.superclass.constructor.call(this, b)
    },
    resize: function(a) {
        this.setWidth(a.appPanelW);
        this.el.setStyle({
            marginLeft: a.marginLeft + "px"
        });
        this.title.setWidth(a.appPanelW);
        this.appArea.setWidth(a.appPanelW);
        this.doLayout()
    },
    getApps: function() {
        return this.appArea.getApps()
    },
    refresh: function() {
        this.updateAppItem()
    },
    updateAppItem: function() {
        var a = this.updateAppList();
        this.appArea.removeAll();
        Ext.each(a, this.addAppItem, this);
        this.doLayout()
    },
    addAppItem: function(a) {
        var b = SYNO.SDS.Config.FnMap[a];
        if (!b || this.isItemExist(b.config.className || b.config.jsID)) {
            return
        }
        if (_S("ha_safemode")) {
            if (-1 == b.config.jsID.search("SYNO.SDS.HA")) {
                return
            }
        }
        this.appArea.add(new SYNO.SDS._AppItem(b.config))
    },
    isItemExist: function(b) {
        var c = this.getApps();
        for (var a = 0; a < c.length; a++) {
            if (c[a].className === b) {
                return true
            }
        }
        return false
    },
    updateAppList: function() {
        if (this.type === "system-app-panel") {
            return SYNO.SDS.AppUtil.getApps()
        } else {
            if (this.type === "search-result-app-panel") {
                return SYNO.SDS.AppUtil.getApps()
            }
        }
    },
    getAppbyClassName: function(b) {
        var c = this.getApps();
        for (var a = 0; a < c.length; a++) {
            if (c[a].className === b && SYNO.SDS.AppUtil.isValidApp(c[a].className)) {
                return c[a]
            }
        }
        return null
    }
});
Ext.define("SYNO.SDS._AppView.SearchField", {
    extend: "SYNO.ux.TextFilter",
    constructor: function(a) {
        var b = {
            width: a.width,
            listeners: {
                afterrender: {
                    scope: this,
                    fn: function() {
                        this.wrap.addClass("sds-appview-searchfiled")
                    }
                },
                keyup: {
                    scope: this,
                    fn: this.onInputFieldKeyUp,
                    buffer: 200
                }
            }
        };
        SYNO.SDS._AppView.SearchField.superclass.constructor.call(this, b)
    },
    displayResult: function(a) {
        SYNO.SDS.AppView.appContainer.searchResultPanel.setVisible(a);
        SYNO.SDS.AppView.appContainer.systemAppPanel.setVisible(!a)
    },
    updateResult: function(b) {
        if (!b) {
            return
        }
        var e = SYNO.SDS.AppView.appContainer.searchResultPanel;
        var d = e.getApps();
        var a;
        b = b.toLowerCase();
        for (var c = 0; c < d.length; c++) {
            a = d[c].plaintitle.toLowerCase();
            if (-1 != a.indexOf(b)) {
                d[c].show()
            } else {
                d[c].hide()
            }
        }
        e.appArea.doLayout()
    },
    showResult: function() {
        var a = this.getValue();
        if (a === this.lastQuery) {
            return
        } else {
            if (a === "") {
                this.displayResult(false);
                return
            }
        }
        this.updateResult(a);
        this.displayResult(true)
    },
    onInputFieldKeyUp: function() {
        this.showResult()
    },
    onTriggerClick: function() {
        this.reset();
        this.focus(false, 200);
        this.displayResult(false)
    },
    onHideField: function() {
        this.reset();
        this.displayResult(false)
    }
});
Ext.define("SYNO.SDS._AppViewShortcutZone", {
    extend: "SYNO.SDS._NewShortcutZone",
    constructor: function(a) {
        SYNO.SDS._AppViewShortcutZone.superclass.constructor.call(this, a);
        this.on("afterrender", this.registDD, this)
    },
    registEvent: function() {
        var a = SYNO.SDS.AppView.appContainer;
        this.mon(a, "startDrag", this.onStartDrag, this);
        this.mon(a, "endDrag", this.onEndDrag, this);
        this.mon(this.parentView, "beforeshow", function() {
            this.el.dropZone.unlock();
            SYNO.SDS.AppView.appContainer.systemAppPanel.el.dropZone.unlock()
        }, this);
        this.mon(this.parentView, "beforehide", function() {
            this.el.dropZone.lock();
            SYNO.SDS.AppView.appContainer.systemAppPanel.el.dropZone.lock()
        }, this)
    },
    registDD: function() {
        this.el.dropZone = new Ext.dd.DropZone(this.el, {
            DROP_ALLOWED_CLS: "x-dd-drop-ok-add",
            owner: this,
            ddGroup: "AppShortCut",
            onContainerDrop: function(b, c, a) {
                if (this.isLocked()) {
                    return true
                }
                var d = this.getSourceApp(b, a.sourceEl);
                d.addToDesktop();
                this.owner.isDropped = true;
                this.owner.dropPos = c.xy;
                return true
            },
            onContainerOver: function() {
                return this.DROP_ALLOWED_CLS
            },
            getSourceApp: function(c, b) {
                var a = SYNO.SDS.AppViewDDUtil.getNodeIndex(c, b);
                return c.appArea.getAppAt(a)
            }
        });
        this.el.dropZone.addToGroup("AppReorderAndShortCut")
    }
});
Ext.define("SYNO.SDS._AppItem", {
    extend: "Ext.Container",
    allowedCfgProperty: "jsID,className,param,title,formatedTitle,desc,icon,icon_16,icon_32,type,allowStandalone,url,urlDefMode,urlTag,urlTarget,launchParams,subItems,port,protocol",
    iconSize: SYNO.SDS.UIFeatures.IconSizeManager.AppView,
    badgeAlignOffset: [-20, 0],
    constructor: function(a) {
        if (a.className || a.jsID) {
            this.applyConfig(a)
        } else {
            Ext.apply(this, a)
        }
        var b = {
            cls: "sds-appview-app-item",
            autoEl: {
                tag: "div",
                cn: [{
                    tag: "img",
                    "aria-label": this.title,
                    src: this.icon
                }, {
                    tag: "div",
                    html: this.title,
                    cls: "sds-appview-app-item-title text"
                }]
            },
            listeners: {
                afterrender: {
                    fn: function(c) {
                        c.el.on("click", this.onIconClick, this);
                        c.el.on("contextmenu", this.onContextMenu, this)
                    },
                    scope: this
                },
                afterlayout: {
                    fn: function() {
                        var c = SYNO.SDS.AppUtil.isNewApp(this.className);
                        if (c) {
                            this.addClass("new-app")
                        } else {
                            this.removeClass("new-app")
                        }
                    },
                    scope: this
                }
            }
        };
        SYNO.SDS._AppItem.superclass.constructor.call(this, b)
    },
    getContextMenu: function() {
        if (this.ctxMenu) {
            this.ctxMenu.destroy()
        }
        this.ctxMenu = new SYNO.ux.Menu({
            items: [{
                text: _T("common", "add_to_desktop"),
                scope: this,
                handler: this.addToDesktop
            }]
        });
        if ("standalone" === this.type || true === this.allowStandalone || (("url" === this.type || "legacy" === this.type) && "_self" !== this.urlTarget)) {
            this.ctxMenu.addItem(new Ext.menu.Item({
                text: _T("desktop", "open_in_new_window"),
                scope: this,
                handler: this.openNewWindow,
                useBuffer: false
            }))
        }
        return this.ctxMenu
    },
    onContextMenu: function(b) {
        b.preventDefault();
        var a = this.getContextMenu();
        a.showAt(b.getXY())
    },
    addToDesktop: function() {
        SYNO.SDS.Desktop.addLaunchItemCfg({
            className: this.className
        }, -1);
        SYNO.SDS.Desktop.refresh()
    },
    applyConfig: function(a) {
        var c, b = SYNO.SDS.Config.FnMap[a.className || a.jsID];
        this.className = a.jsID;
        if (!a.title || !a.icon) {
            Ext.copyTo(this, b.config, this.allowedCfgProperty)
        }
        Ext.copyTo(this, a, "manager,removable,iconSize," + this.allowedCfgProperty);
        this.plaintitle = SYNO.SDS.Utils.GetLocalizedString(this.title || "", this.className);
        this.title = SYNO.SDS.Utils.GetLocalizedString(this.formatedTitle || this.title || "", this.className);
        this.desc = SYNO.SDS.Utils.GetLocalizedString(this.desc || "", this.className);
        c = encodeURI(b.config.jsBaseURL) + "/" + (this.icon || this.icon_32);
        this.icon = SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(c, "AppView")
    },
    onIconClick: function(a) {
        if ("url" === this.type || "standalone" === this.type || (true === this.allowStandalone && a.hasModifier()) || ("legacy" === this.type && ("url" === this.urlDefMode || a.hasModifier()))) {
            if ("_self" === this.urlTarget) {
                window.onbeforeunload = null
            } else {
                a.stopEvent();
                this.openNewWindow()
            }
            return
        }
        a.stopEvent();
        this.launchApp()
    },
    launchApp: function() {
        SYNO.SDS.AppView.showDesktop();
        SYNO.SDS.AppLaunch.defer(500, window, [this.className, this.param, true])
    },
    openNewWindow: function() {
        SYNO.SDS.WindowLaunch(this.className)
    }
});
SYNO.SDS.AppUtil = {
    systemApps: ["SYNO.SDS.AdminCenter.Application", "SYNO.SDS.App.FileStation3.Instance", "SYNO.SDS.StorageManager.Instance", "SYNO.SDS.Backup.Application", "SYNO.SDS.PkgManApp.Instance", "SYNO.SDS.EzInternet.Instance", "SYNO.SDS.ResourceMonitor.Instance", "SYNO.SDS.HelpBrowser.Application"],
    isNewApp: function(b) {
        var a = SYNO.SDS.UserSettings.getProperty("Desktop", "new_app_list") || [];
        if (a.indexOf(b) !== -1) {
            return true
        }
        return false
    },
    isApp: function(b) {
        var a = SYNO.SDS.Config.FnMap[b];
        if (a && ("app" === a.config.type || "standalone" === a.config.type || "url" === a.config.type || "legacy" === a.config.type) && true !== a.config.hidden) {
            return true
        }
        return false
    },
    isValidApp: function(a) {
        if (SYNO.SDS.AppUtil.isApp(a) && SYNO.SDS.StatusNotifier.isAppEnabled(a)) {
            return true
        }
        return false
    },
    getApps: function() {
        var b = SYNO.SDS.UserSettings.getProperty("Desktop", "appview_order") || SYNO.SDS.UserSettings.getProperty("Desktop", "valid_appview_order") || [];
        var d = [];
        var a = this.getAppsByDefaultOrder();
        var e;
        for (var c = 0; c < b.length; c++) {
            e = b[c];
            if (this.isValidApp(e)) {
                d.push(e)
            }
        }
        for (c = 0; c < a.length; c++) {
            e = a[c];
            if (0 > d.indexOf(e)) {
                d.push(e)
            }
        }
        SYNO.SDS.UserSettings.setProperty("Desktop", "valid_appview_order", d);
        return d
    },
    getAppsByDefaultOrder: function() {
        var c = [],
            a = [],
            b;
        for (b in SYNO.SDS.Config.FnMap) {
            if (SYNO.SDS.Config.FnMap.hasOwnProperty(b)) {
                if (!this.isValidApp(b)) {
                    continue
                }
                if (0 <= this.systemApps.indexOf(b)) {
                    c.push(b)
                } else {
                    a.push(b)
                }
            }
        }
        c.sort();
        a.sort();
        return c.concat(a)
    }
};
Ext.define("SYNO.SDS.AppViewDragDropPlugin", {
    extend: "Ext.Component",
    REPOSITION_OK_CLS: "x-dd-reposition-ok",
    CURSOR_OVER_TYPE: {
        ICON_LEFT: 0,
        ICON_RIGHT: 2
    },
    init: function(a) {
        if (!this.allowOrder) {
            return
        }
        a.mon(a, "afterrender", function(b) {
            this.handelDD(b)
        }, this)
    },
    handelDD: function(a) {
        var b = (this.style === "classical");
        a.el.dragZone = new Ext.dd.DragZone(this.appArea.el, {
            ddGroup: "AppReorderAndShortCut",
            appArea: this.appArea,
            getDragData: SYNO.SDS.AppViewDDUtil.getDragData,
            proxy: new SYNO.ux.StatusProxy({
                baseCls: (b ? "classical " : "") + "appview-icon-dragging-proxy"
            }),
            getRepairXY: function() {
                return this.dragData.repairXY
            },
            resetOrigPosition: this.resetOrigPosition.createDelegate(this),
            onMouseLeave: function() {
                this.resetOrigPosition();
                SYNO.SDS.AppView.appContainer.addClass("on-mouse-out")
            },
            onMouseEnter: function(d) {
                var c = Ext.get(this.dragData.sourceEl);
                c.hide();
                SYNO.SDS.AppView.appContainer.removeClass("on-mouse-out")
            },
            onMouseDown: function(c) {
                c.stopEvent()
            },
            endDrag: function() {
                SYNO.SDS.AppViewDDUtil.endDrag(this);
                if (this.dragData.SDSShortCut) {
                    SYNO.SDS.Desktop.onEndDrag(this.dragData)
                }
                this.appArea.removeClass("sds-float-layout-ct-animate");
                this.appArea.mun(this.appArea.el, "mouseleave", this.onMouseLeave, this);
                this.appArea.mun(this.appArea.el, "mouseenter", this.onMouseEnter, this);
                this.appArea.mun(SYNO.SDS.AppView, "gotoDesktop", this.appendDesktopConfig, this)
            },
            onStartDrag: function(c, d) {
                SYNO.SDS.AppViewDDUtil.onStartDrag(this);
                this.srcIdx = SYNO.SDS.AppViewDDUtil.getNodeIndex(this, this.dragData.sourceEl);
                this.appArea.addClass("sds-float-layout-ct-animate");
                this.appArea.mon(this.appArea.el, "mouseleave", this.onMouseLeave, this);
                this.appArea.mon(this.appArea.el, "mouseenter", this.onMouseEnter, this);
                this.appArea.mon(SYNO.SDS.AppView, "gotoDesktop", this.appendDesktopConfig, this)
            },
            appendDesktopConfig: function() {
                SYNO.SDS.AppViewDDUtil.appendDesktopConfig(this)
            }
        });
        a.el.dropZone = new Ext.dd.DropZone(this.appArea.el, {
            ddGroup: "AppReorderAndShortCut",
            getTargetFromEvent: function(d) {
                var c = d.getTarget("div.sds-appview-app-item");
                return c
            },
            onNodeOver: this.onNodeOver.createDelegate(this, [], true),
            onContainerDrop: function() {
                return true
            },
            onContainerOver: function() {
                return true
            },
            onNodeDrop: function(c, f, g, d) {
                return true
            }
        })
    },
    resetOrigPosition: function() {
        var c = this.owner.el.dragZone;
        var a = Ext.get(c.dragData.sourceEl);
        var b = SYNO.SDS.AppViewDDUtil.getNodeIndex(c, c.dragData.sourceEl);
        a.show();
        this.rePosition(b, c.srcIdx)
    },
    getCursorOverType: function(d, b) {
        var a;
        var c = 136;
        a = d[0] - b[0];
        if (a <= c / 2) {
            return this.CURSOR_OVER_TYPE.ICON_LEFT
        } else {
            return this.CURSOR_OVER_TYPE.ICON_RIGHT
        }
    },
    onNodeOver: function(b, e, a, d) {
        var c = SYNO.SDS.AppViewDDUtil.getNodeIndex(this, d.sourceEl),
            f = SYNO.SDS.AppViewDDUtil.getNodeIndex(this, b),
            g;
        if (c < 0 || f < 0) {
            return
        }
        g = this.getCursorOverType(a.xy, Ext.get(b).getXY());
        if (c < f) {
            f--
        }
        switch (g) {
            case this.CURSOR_OVER_TYPE.ICON_LEFT:
                this.rePosition(c, f);
                break;
            case this.CURSOR_OVER_TYPE.ICON_RIGHT:
                this.rePosition(c, f + 1);
                break;
            default:
                break
        }
        return this.REPOSITION_OK_CLS
    },
    rePosition: function(b, c, d, a) {
        this.runTask("reposition", this._rePosition, 100, [b, c, d, a])
    },
    _rePosition: function(c, e, f, a) {
        var b;
        var d = this.appArea.getApps();
        if (c === e) {
            return
        }
        b = this.appArea.remove(d[c], false);
        this.appArea.insert(e, b);
        b.addClass("x-box-item");
        this.owner.doLayout();
        this.saveAppOrder();
        if (f) {
            Ext.defer(f, 500, a || this)
        }
    },
    saveAppOrder: function() {
        var c = this.appArea.getApps();
        var a = [];
        for (var b = 0; b < c.length; b++) {
            a.push(c[b].className)
        }
        SYNO.SDS.UserSettings.setProperty("Desktop", "appview_order", a)
    }
});
SYNO.SDS.AppViewDDUtil = {
    onStartDrag: function(c) {
        var a = Ext.get(c.dragData.sourceEl);
        a.setVisibilityMode(Ext.Element.VISIBILITY);
        a.hide();
        var b = c.getProxy();
        b.getEl().disableShadow();
        SYNO.SDS.AppView.appContainer.addClass("hide-scroll");
        SYNO.SDS.AppView.appContainer.fireEvent("startDrag");
        SYNO.SDS.AppView.addClass("on-mouse-drag")
    },
    endDrag: function(b) {
        var a = Ext.get(b.dragData.sourceEl);
        a.show();
        SYNO.SDS.AppView.appContainer.removeClass("on-mouse-out");
        SYNO.SDS.AppView.appContainer.removeClass("hide-scroll");
        SYNO.SDS.AppView.appContainer.fireEvent("endDrag");
        SYNO.SDS.AppView.removeClass("on-mouse-drag")
    },
    appendDesktopConfig: function(e) {
        var c = SYNO.SDS.AppViewDDUtil.getNodeClassName(e, e.dragData.sourceEl);
        var a = SYNO.SDS.Desktop.addHiddenLaunchItem({
            className: c
        }, -1);
        var d = SYNO.SDS.Desktop.iconItems[a];
        var b = {
            _fromAppMenu: true,
            className: c,
            srcItemId: d.el.id,
            desktopSrcEl: d.dragEl.dom,
            SDSShortCut: d.managerItemConfig
        };
        Ext.apply(e.dragData, b)
    },
    getNodeIndex: function(d, a) {
        var c = -1;
        var b = d.appArea.getApps();
        Ext.each(b, function(f, e) {
            if (a === f.getEl().dom) {
                c = e;
                return false
            }
        });
        return c
    },
    getNodeClassName: function(d, b) {
        var c = d.appArea.getApps();
        for (var a = 0; a < c.length; a++) {
            if (b === c[a].getEl().dom) {
                return c[a].className
            }
        }
        return null
    },
    getDragData: function(d) {
        var c = d.getTarget("div.sds-appview-app-item");
        if (!c) {
            return
        }
        var a = Ext.get(c.id);
        var f = c.cloneNode(true);
        f.style.position = "";
        f.style.left = "";
        f.style.top = "";
        f.id = Ext.id();
        f.getElementsBySelector("img")[0].width = SYNO.SDS.UIFeatures.IconSizeManager.getRes("AppView");
        var b = {
            ddel: f,
            sourceEl: c,
            repairXY: a.getXY()
        };
        return b
    }
};
Ext.namespace("SYNO.SDS.Classic");
Ext.define("SYNO.SDS.Classic._AppView", {
    extend: "SYNO.SDS._DesktopView",
    constructor: function() {
        var c = this.getSizeConfig();
        var b = new Ext.BoxComponent({
            cls: "crossbrowser-background"
        });
        var a = {
            taskBarConfig: {
                enableToggle: true,
                tooltip: _T("helptoc", "mainmenu"),
                renderTo: "sds-taskbar-startbutton"
            },
            id: "sds-appview",
            cls: "classical syno-sds-appview",
            backgroundTransparent: false,
            hidden: true,
            renderTo: document.body,
            animateShowHide: false,
            width: c.viewW,
            height: c.viewH,
            items: [b, this.shortcutZoneLeft = new SYNO.SDS._AppViewShortcutZone({
                type: "left",
                width: c.shortcutZoneW,
                height: c.shortcutZoneH,
                parentView: this
            }), this.searchField = new SYNO.SDS._AppView.SearchField({
                width: 402
            }), this.appContainer = new SYNO.SDS.Classic._AppContainer(c)],
            listeners: {
                beforeshow: {
                    fn: function() {
                        if (!this.inited) {
                            this.shortcutZoneLeft.registEvent();
                            this.inited = true
                        }
                        this.mon(Ext.getBody(), "mousedown", this.onClickHide, this)
                    },
                    scope: this
                },
                beforehide: {
                    fn: function() {
                        this.mun(Ext.getBody(), "mousedown", this.onClickHide, this)
                    },
                    scope: this
                },
                afterlayout: {
                    fn: function() {
                        this.appContainer.resetScroller()
                    },
                    scope: this
                }
            }
        };
        SYNO.SDS.Classic._AppView.superclass.constructor.call(this, a);
        this.mon(SYNO.SDS.StatusNotifier, "servicechanged", this.onServiceChanged, this);
        this.mon(SYNO.SDS.StatusNotifier, "appprivilegechanged", this.onServiceChanged, this);
        this.mon(SYNO.SDS.StatusNotifier, "beforeUserSettingsUnload", this.saveState, this);
        this.createBadge()
    },
    saveState: function() {
        var a = SYNO.SDS.AppUtil.getApps();
        SYNO.SDS.UserSettings.setProperty("Desktop", "appview_order", a)
    },
    onClickHide: function(b, a) {
        if (!b.within(this.el)) {
            this.showDesktop()
        }
    },
    slideIn: function() {
        this.el.slideIn("t", {
            duration: 0.5,
            easing: "easeOut",
            callback: function() {
                this.searchField.focus()
            },
            scope: this
        })
    },
    slideOut: function(b, a) {
        if (!this.isVisible()) {
            return
        }
        this.el.slideOut("t", {
            duration: 0.5,
            easing: "easeOut",
            callback: b,
            scope: a || this
        })
    },
    onServiceChanged: function(c, a) {
        var b = SYNO.SDS.AppUtil.isApp(c);
        if (b) {
            this.refresh()
        }
    },
    createBadge: function() {
        var a = Ext.get("sds-taskbar-startbutton").child("button");
        this.badge = new SYNO.SDS.Utils.Notify.Badge({
            renderTo: a,
            badgeClassName: "sds-notify-badge-num",
            alignOffset: [-22, -6]
        });
        this.updateBadge()
    },
    resize: function() {
        var a = this.getSizeConfig();
        this.setWidth(a.viewW);
        this.setHeight(a.viewH);
        this.appContainer.resize(a);
        this.shortcutZoneLeft.resize(a.shortcutZoneW, a.viewH)
    },
    refresh: function() {
        this.appContainer.refresh();
        this.updateBadge();
        this.searchField.showResult()
    },
    updateBadge: function() {
        var a = SYNO.SDS.UserSettings.getProperty("Desktop", "new_app_list") || [];
        this.badge.setNum(a.length)
    },
    getSizeConfig: function() {
        var j = SYNO.SDS.AppUtil.getApps();
        var i = j.length;
        var k = 136,
            e = 100;
        var d = 3;
        var l = Ext.lib.Dom.getViewWidth();
        var f = Ext.lib.Dom.getViewHeight() - SYNO.SDS.TaskBar.getHeight() - 12;
        var b = e * Math.ceil(i / 3) + 52 + 12;
        var h = Math.min(f, b);
        var a = k * d + 22 + 30;
        var g = k * d + 30;
        var c = {
            viewH: h,
            viewW: a,
            shortcutZoneW: l,
            shortcutZoneH: f,
            appContainerW: g,
            appContainerH: h - 52 - 12,
            appPanelW: g
        };
        return c
    },
    show: function() {
        this.badge.setNum(0);
        this.callParent();
        this.slideIn()
    },
    notifyInstalled: function(f) {
        var c, d = f.length;
        if (this.isVisible()) {
            var b;
            for (c = 0; c < d; c++) {
                b = this.appContainer.systemAppPanel.getAppbyClassName(f[c]);
                b.addClass("new-app")
            }
        } else {
            var e = SYNO.SDS.UserSettings.getProperty("Desktop", "new_app_list") || [];
            var a = 0;
            for (c = 0; c < d; c++) {
                if (SYNO.SDS.AppUtil.isValidApp(f[c]) && -1 == e.indexOf(f[c])) {
                    e.push(f[c]);
                    a++
                }
            }
            if (a > 0) {
                SYNO.SDS.UserSettings.setProperty("Desktop", "new_app_list", e)
            }
            this.refresh()
        }
    },
    onToggle: function(a, b) {
        this.el.stopFx();
        this[b ? "activeView" : "onBeforeHide"]()
    },
    onBeforeHide: function() {
        SYNO.SDS.UserSettings.setProperty("Desktop", "new_app_list", []);
        this.slideOut(function() {
            this.showDesktop()
        }, this)
    },
    showDesktop: function() {
        if (this.isVisible()) {
            this.onBeforeHide()
        } else {
            this.manager.showDesktop()
        }
    }
});
Ext.define("SYNO.SDS.Classic._AppContainer", {
    extend: "Ext.Container",
    constructor: function(a) {
        this.systemAppPanel = new SYNO.SDS.Classic._AppPanel({
            title: _T("common", "user_app"),
            type: "system-app-panel",
            allowOrder: true,
            width: a.appPanelW
        });
        this.searchResultPanel = new SYNO.SDS.Classic._AppPanel({
            title: "Search result",
            type: "search-result-app-panel",
            hidden: true,
            width: a.appPanelW
        });
        var b = {
            xtype: "container",
            id: "syno-sds-appview-container",
            cls: "syno-sds-appview-container scale-item",
            autoFlexcroll: true,
            updateScrollBarEventNames: [],
            height: a.appContainerH,
            width: a.appContainerW,
            items: [this.systemAppPanel, this.searchResultPanel],
            listeners: {
                afterlayout: {
                    fn: function() {
                        this.updateFleXcroll(true);
                        this.resetScroller(200)
                    },
                    scope: this
                }
            }
        };
        SYNO.SDS.Classic._AppContainer.superclass.constructor.call(this, b)
    },
    resize: function(a) {
        this.setWidth(a.appContainerW);
        this.setHeight(a.appContainerH);
        this.systemAppPanel.resize(a);
        this.searchResultPanel.resize(a)
    },
    refresh: function() {
        this.systemAppPanel.refresh();
        this.searchResultPanel.refresh()
    },
    updateApps: function() {
        this.systemApps = SYNO.SDS.AppUtil.getApps()
    }
});
Ext.define("SYNO.SDS.Classic._AppPanel", {
    extend: "Ext.Container",
    constructor: function(a) {
        Ext.apply(this, a);
        this.appArea = new Ext.Container({
            cls: "sds-app-items-panel " + a.type,
            layout: this.allowOrder ? {
                type: "syno_float"
            } : null,
            width: a.width,
            getApps: function() {
                return this.items.items
            },
            getAppAt: function(d) {
                return this.items.items[d]
            }
        });
        var c;
        if (this.allowOrder) {
            c = new SYNO.SDS.AppViewDragDropPlugin({
                owner: this,
                style: "classical",
                appArea: this.appArea,
                allowOrder: true
            })
        } else {
            c = new SYNO.SDS.AppViewShortcutDDPlugin({
                owner: this,
                style: "classical",
                appArea: this.appArea
            })
        }
        var b = {
            cls: "sds-app-panel",
            items: [this.appArea],
            plugins: [c]
        };
        this.refresh();
        SYNO.SDS.Classic._AppPanel.superclass.constructor.call(this, b)
    },
    resize: function(a) {
        this.setWidth(a.appPanelW);
        this.appArea.setWidth(a.appPanelW);
        this.doLayout()
    },
    getApps: function() {
        return this.appArea.getApps()
    },
    refresh: function() {
        this.updateAppItem()
    },
    updateAppItem: function() {
        var a = this.updateAppList();
        this.appArea.removeAll();
        Ext.each(a, this.addAppItem, this);
        this.doLayout()
    },
    addAppItem: function(a) {
        var b = SYNO.SDS.Config.FnMap[a];
        if (!b || this.isItemExist(b.config.className || b.config.jsID)) {
            return
        }
        if (_S("ha_safemode")) {
            if (-1 == b.config.jsID.search("SYNO.SDS.HA")) {
                return
            }
        }
        this.appArea.add(new SYNO.SDS.Classic._AppItem(b.config))
    },
    isItemExist: function(b) {
        var c = this.getApps();
        for (var a = 0; a < c.length; a++) {
            if (c[a].className === b) {
                return true
            }
        }
        return false
    },
    updateAppList: function() {
        if (this.type === "system-app-panel") {
            return SYNO.SDS.AppUtil.getApps()
        } else {
            if (this.type === "search-result-app-panel") {
                return SYNO.SDS.AppUtil.getApps()
            }
        }
    },
    getAppbyClassName: function(b) {
        var c = this.getApps();
        for (var a = 0; a < c.length; a++) {
            if (c[a].className === b && SYNO.SDS.AppUtil.isValidApp(c[a].className)) {
                return c[a]
            }
        }
        return null
    }
});
Ext.define("SYNO.SDS.Classic._AppItem", {
    extend: "Ext.Container",
    allowedCfgProperty: "jsID,className,param,title,formatedTitle,desc,icon,icon_16,icon_32,type,allowStandalone,url,urlDefMode,urlTag,urlTarget,launchParams,subItems,port,protocol",
    iconSize: SYNO.SDS.UIFeatures.IconSizeManager.AppViewClassic,
    badgeAlignOffset: [-34, 0],
    constructor: function(a) {
        if (a.className || a.jsID) {
            this.applyConfig(a)
        } else {
            Ext.apply(this, a)
        }
        var b = {
            cls: "sds-appview-app-item",
            autoEl: {
                tag: "div",
                cn: [{
                    tag: "img",
                    "aria-label": this.title,
                    src: this.icon
                }, {
                    tag: "div",
                    html: this.title,
                    cls: "sds-appview-app-item-title text"
                }]
            },
            listeners: {
                afterrender: {
                    fn: function(c) {
                        c.el.on("click", this.onIconClick, this);
                        c.el.on("contextmenu", this.onContextMenu, this)
                    },
                    scope: this
                },
                afterlayout: {
                    fn: function() {
                        var c = SYNO.SDS.AppUtil.isNewApp(this.className);
                        if (c) {
                            this.addClass("new-app")
                        } else {
                            this.removeClass("new-app")
                        }
                    },
                    scope: this
                }
            }
        };
        SYNO.SDS._AppItem.superclass.constructor.call(this, b)
    },
    getContextMenu: function() {
        if (this.ctxMenu) {
            this.ctxMenu.destroy()
        }
        this.ctxMenu = new SYNO.ux.Menu({
            items: [{
                text: _T("common", "add_to_desktop"),
                scope: this,
                handler: this.addToDesktop
            }]
        });
        if ("standalone" === this.type || true === this.allowStandalone || (("url" === this.type || "legacy" === this.type) && "_self" !== this.urlTarget)) {
            this.ctxMenu.addItem(new Ext.menu.Item({
                text: _T("desktop", "open_in_new_window"),
                scope: this,
                handler: this.openNewWindow,
                useBuffer: false
            }))
        }
        return this.ctxMenu
    },
    onContextMenu: function(b) {
        b.preventDefault();
        var a = this.getContextMenu();
        a.showAt(b.getXY())
    },
    addToDesktop: function() {
        SYNO.SDS.Desktop.addLaunchItemCfg({
            className: this.className
        }, -1);
        SYNO.SDS.Desktop.refresh()
    },
    applyConfig: function(a) {
        var c, b = SYNO.SDS.Config.FnMap[a.className || a.jsID];
        this.className = a.jsID;
        if (!a.title || !a.icon) {
            Ext.copyTo(this, b.config, this.allowedCfgProperty)
        }
        Ext.copyTo(this, a, "manager,removable,iconSize," + this.allowedCfgProperty);
        this.plaintitle = SYNO.SDS.Utils.GetLocalizedString(this.title || "", this.className);
        this.title = SYNO.SDS.Utils.GetLocalizedString(this.formatedTitle || this.title || "", this.className);
        this.desc = SYNO.SDS.Utils.GetLocalizedString(this.desc || "", this.className);
        c = encodeURI(b.config.jsBaseURL) + "/" + (this.icon || this.icon_32);
        this.icon = SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(c, "AppViewClassic")
    },
    onIconClick: function(a) {
        if ("url" === this.type || "standalone" === this.type || (true === this.allowStandalone && a.hasModifier()) || ("legacy" === this.type && ("url" === this.urlDefMode || a.hasModifier()))) {
            if ("_self" === this.urlTarget) {
                window.onbeforeunload = null
            } else {
                a.stopEvent();
                this.openNewWindow()
            }
            return
        }
        a.stopEvent();
        this.launchApp()
    },
    launchApp: function() {
        SYNO.SDS.AppView.showDesktop();
        SYNO.SDS.AppLaunch.defer(500, window, [this.className, this.param, true])
    },
    openNewWindow: function() {
        SYNO.SDS.WindowLaunch(this.className)
    }
});
Ext.define("SYNO.SDS.AppViewShortcutDDPlugin", {
    extend: "Ext.Component",
    init: function(a) {
        a.mon(a, "afterrender", function(b) {
            this.handelShortcutDD(b)
        }, this)
    },
    handelShortcutDD: function(a) {
        if (a.el.dragZone) {
            return
        }
        var b = (this.style === "classical");
        var c = new Ext.dd.DragZone(this.appArea.el, {
            ddGroup: "AppShortCut",
            proxy: new SYNO.ux.StatusProxy({
                baseCls: (b ? "classical " : "") + "appview-icon-dragging-proxy"
            }),
            appArea: this.appArea,
            getDragData: SYNO.SDS.AppViewDDUtil.getDragData,
            getRepairXY: function() {
                return this.dragData.repairXY
            },
            onMouseLeave: function() {
                SYNO.SDS.AppView.appContainer.addClass("on-mouse-out");
                Ext.get(this.dragData.sourceEl).show()
            },
            onMouseEnter: function(d) {
                SYNO.SDS.AppView.appContainer.removeClass("on-mouse-out");
                Ext.get(this.dragData.sourceEl).hide()
            },
            onMouseDown: function(d) {
                d.stopEvent()
            },
            endDrag: function() {
                SYNO.SDS.AppViewDDUtil.endDrag(this);
                if (this.dragData.SDSShortCut) {
                    SYNO.SDS.Desktop.onEndDrag(this.dragData)
                }
                this.appArea.mun(this.appArea.el, "mouseleave", this.onMouseLeave, this);
                this.appArea.mun(this.appArea.el, "mouseenter", this.onMouseEnter, this);
                this.appArea.mun(SYNO.SDS.AppView, "gotoDesktop", this.appendDesktopConfig, this)
            },
            onStartDrag: function(d, e) {
                SYNO.SDS.AppViewDDUtil.onStartDrag(this);
                this.appArea.mon(this.appArea.el, "mouseleave", this.onMouseLeave, this);
                this.appArea.mon(this.appArea.el, "mouseenter", this.onMouseEnter, this);
                this.appArea.mon(SYNO.SDS.AppView, "gotoDesktop", this.appendDesktopConfig, this)
            },
            appendDesktopConfig: function() {
                SYNO.SDS.AppViewDDUtil.appendDesktopConfig(this)
            }
        });
        a.el.dragZone = c
    }
});
Ext.define("SYNO.SDS.CustomizeLogo", {
    extend: "Ext.Container",
    constructor: function(a) {
        Ext.apply(this, a);
        var c = this.getSizeCfg();
        var b = {
            width: c.width,
            height: c.height,
            id: "sds-login-cuslogo-wrapper",
            cls: this.logo_pos,
            items: [{
                xtype: "box",
                id: "sds-login-cuslogo-img",
                autoEl: {
                    tag: "img",
                    src: Ext.BLANK_IMAGE_URL
                },
                listeners: {
                    scope: this,
                    afterrender: function() {
                        this.mon(Ext.get("sds-login-cuslogo-img"), "load", this.initImg, this);
                        Ext.getDom("sds-login-cuslogo-img").src = this.logo_path
                    }
                }
            }]
        };
        SYNO.SDS.CustomizeLogo.superclass.constructor.call(this, b)
    },
    getSizeCfg: function() {
        var a = {
            width: Ext.lib.Dom.getViewWidth() - 660,
            height: Ext.lib.Dom.getViewHeight() * 0.4 - 40
        };
        return a
    },
    resize: function() {
        this.setSize(this.getSizeCfg());
        this.adjustImgPos()
    },
    initImg: function() {
        var a = Ext.fly("sds-login-cuslogo-img");
        this.imgSize = a.getSize();
        this.adjustImgPos()
    },
    adjustImgPos: function() {
        if (!this.imgSize) {
            return
        }
        var c = Ext.fly("sds-login-cuslogo-img");
        var b = this.getWidth(),
            e = this.getHeight();
        var a = this.imgSize.width / b;
        var d = this.imgSize.height / e;
        if (a > 1 || d > 1) {
            if (a > d) {
                c.setSize({
                    width: b,
                    height: "auto"
                })
            } else {
                c.setSize({
                    width: "auto",
                    height: e
                })
            }
        } else {
            c.setSize({
                width: "auto",
                height: "auto"
            })
        }
        if (this.logo_pos === "left") {
            c.alignTo(this.el, "l-l")
        } else {
            if (this.logo_pos === "right") {
                c.alignTo(this.el, "r-r")
            } else {
                c.alignTo(this.el, "c-c")
            }
        }
    }
});
Ext.define("SYNO.SDS.WelcomeInfo", {
    extend: "Ext.Container",
    constructor: function(a) {
        Ext.apply(this, a);
        var b = [];
        if (this.login_welcome_title !== "") {
            this.login_welcome_title = this.login_welcome_title.replace(/&nbsp;/g, " ");
            b.push(new Ext.Container({
                cls: "sds-login-welcome-info-container",
                items: [{
                    xtype: "box",
                    autoEl: {
                        tag: "div",
                        cls: "sds-login-welcome-info-title",
                        html: this.login_welcome_title,
                        "ext:qtip": Ext.util.Format.htmlEncode(this.login_welcome_title)
                    }
                }]
            }))
        }
        if (this.login_welcome_msg !== "") {
            this.login_welcome_msg = this.login_welcome_msg.replace(/&nbsp;/g, " ");
            b.push(new Ext.Container({
                cls: "sds-login-welcome-info-container",
                items: [{
                    xtype: "box",
                    autoEl: {
                        tag: "div",
                        cls: "sds-login-welcome-info-msg",
                        html: this.login_welcome_msg,
                        "ext:qtip": Ext.util.Format.htmlEncode(this.login_welcome_msg)
                    }
                }]
            }))
        }
        this.wrapper = new Ext.Container({
            cls: "sds-login-welcome-info-wrapper",
            items: b
        });
        var c = {
            cls: "sds-login-welcome-info",
            items: [{
                xtype: "box",
                cls: "sds-login-welcome-info-background"
            }, this.wrapper]
        };
        this.callParent([c])
    },
    resize: function() {
        var a = this.wrapper.getEl();
        var b = Ext.lib.Dom.getViewHeight() - a.getTop() - 20 - 26;
        a.setStyle("max-height", b + "px")
    }
});
SYNO.SDS.LoginDialog = Ext.extend(Ext.Container, {
    tplConfig: null,
    bgRatio: 1,
    loadBGImgDone: false,
    constructor: function(c) {
        var b = [];
        this.tplConfig = this.getTplConfig(c.preview);
        this.createBackground();
        this.createWelcomeInfo();
        this.createWeatherInfo(c);
        this.createCustomizeLogo();
        this.createDialog();
        b.push(this.backgound);
        if (this.weatherInfo) {
            b.push(this.weatherInfo)
        }
        if (this.welcomeInfo) {
            b.push(this.welcomeInfo)
        }
        if (this.cusLogo) {
            b.push(this.cusLogo)
        }
        b.push(this.dialog);
        var a = {
            id: "sds-login",
            cls: "sds-login-" + this.tplConfig.tplName,
            renderTo: document.body,
            items: b
        };
        SYNO.SDS.LoginDialog.superclass.constructor.call(this, Ext.apply(a, c));
        Ext.EventManager.onWindowResize(this.onWindowResize, this);
        this.el.applyStyles("background-color: " + this.tplConfig.background_color);
        if (_S("appIconPath")) {
            this.createAppIcon()
        }
        this.onWindowResize();
        this.loginForm.updateLayout();
        if (!c.preview) {
            if (Ext.getDom("login_username")) {
                Ext.getDom("login_username").focus()
            }
        }
        if (Ext.isSafari) {
            Ext.defer(this.onWindowResize, 1000, this)
        }
    },
    createBackground: function() {
        this.backgound = new SYNO.SDS.Background({
            id: "sds-login-background",
            type: this.tplConfig.background_pos,
            imgSrc: this.tplConfig.background_path,
            bgColor: this.tplConfig.background_color,
            tplName: this.tplConfig.tplName
        })
    },
    createWeatherInfo: function(a) {
        var b = true;
        if (a.showWeather === false || this.tplConfig.weather_info === "hide") {
            b = false
        }
        if (b) {
            this.weatherInfo = new SYNO.SDS.WeatherInfo({
                welcomeMsgMode: (this.welcomeInfo) ? true : false
            })
        }
    },
    createWelcomeInfo: function() {
        if (this.tplConfig.login_welcome_title !== "" || this.tplConfig.login_welcome_msg !== "") {
            this.welcomeInfo = new SYNO.SDS.WelcomeInfo({
                login_welcome_title: this.tplConfig.login_welcome_title,
                login_welcome_msg: this.tplConfig.login_welcome_msg
            })
        }
    },
    createCustomizeLogo: function() {
        if (this.tplConfig.logo_enable) {
            this.cusLogo = new SYNO.SDS.CustomizeLogo({
                logo_pos: this.tplConfig.logo_pos,
                logo_path: this.tplConfig.logo_path
            })
        }
    },
    createDialog: function() {
        var b = new Ext.Container({
            id: "sds-login-bkg-highlight",
            autoEl: {
                cn: [{
                    tag: "div",
                    cls: "highlight-top"
                }, {
                    tag: "div",
                    cls: "highlight-bottom"
                }]
            },
            listeners: {
                afterlayout: {
                    fn: function(d) {
                        var c = d.el.child(".highlight-bottom");
                        c.alignTo(d.el, "b-b")
                    },
                    scope: this
                }
            }
        });
        var a = new Ext.Container({
            id: "sds-login-dialog-title",
            html: this.tplConfig.login_title
        });
        this.loginForm = this.newForm();
        this.dialog = new Ext.Container({
            id: "sds-login-dialog",
            autoHeight: true,
            items: [b, a, this.loginForm]
        });
        this.dialog.mon(this.dialog, "afterrender", function() {
            this.updateBackgroundHighlight()
        }, this, {
            single: true
        })
    },
    createAppIcon: function() {
        var a = Ext.getDom("sds-login-dialog");
        this.el.createChild({
            tag: "img",
            id: "sds-login-icon",
            src: SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(_S("appIconPath"), "PortalIcon"),
            style: String.format("width: {0}px", SYNO.SDS.UIFeatures.IconSizeManager.PortalIcon)
        }, a);
        Ext.fly("sds-login-icon").on("load", function() {
            this.doAlignAppIcon()
        }, this, {
            single: true
        })
    },
    newForm: function() {
        return new SYNO.SDS.LoginDialog.Form({
            module: this,
            tplConfig: this.tplConfig
        })
    },
    destroy: function() {
        Ext.EventManager.removeResizeListener(this.onWindowResize, this);
        SYNO.SDS.LoginDialog.superclass.destroy.apply(this, arguments)
    },
    onWindowResize: function() {
        var c = Ext.lib.Dom.getViewWidth();
        var f = Ext.lib.Dom.getViewHeight();
        var d = 840;
        var a = 500;
        var b = false;
        if (c < d || f < a) {
            if (this.weatherInfo) {
                this.weatherInfo.hide()
            }
            if (this.welcomeInfo) {
                this.welcomeInfo.hide()
            }
            if (this.cusLogo) {
                this.cusLogo.hide()
            }
            b = true
        } else {
            if (this.weatherInfo) {
                this.weatherInfo.show()
            }
            if (this.welcomeInfo) {
                this.welcomeInfo.show()
            }
            if (this.cusLogo) {
                this.cusLogo.show()
            }
        }
        this.doAlignDialog(b);
        if (Ext.fly("sds-login-icon")) {
            this.doAlignAppIcon()
        }
        this.backgound.resize();
        if (this.tplConfig.logo_enable && !b) {
            this.cusLogo.resize()
        }
        if (this.welcomeInfo) {
            this.welcomeInfo.resize()
        }
        var e = Ext.getCmp("sds-login-dialog-combobox");
        if (e && e.isExpanded()) {
            e.list.alignTo(e.el, e.listAlign[0], e.listAlign[1])
        }
    },
    doAlignDialog: function(b) {
        var a = 0;
        var c = this.tplConfig.logo_enable;
        var d = Ext.lib.Dom.getViewHeight() * 0.4;
        if (c && !b) {
            Ext.fly("sds-login-dialog").alignTo(document.body, "t-t", [a, d])
        } else {
            Ext.fly("sds-login-dialog").alignTo(document.body, "c-c");
            Ext.defer(function() {
                Ext.fly("sds-login-dialog").alignTo(document.body, "c-c")
            }, 500, this)
        }
    },
    doAlignAppIcon: function() {
        Ext.fly("sds-login-icon").alignTo(Ext.get("sds-login-dialog"), "br-br", [32, 58])
    },
    getTplConfig: function(c) {
        var b, a = {};
        var e = new Date();
        var f = SYNO.SDS.UIFeatures.IconSizeManager.getRetinaAndSynohdpackStatus();
        b = c ? _S("preview_tpl") : _S("login_style");
        if (b === "dark" || b === "tpl4" || b === "tpl3") {
            b = "dark"
        } else {
            b = "light"
        }
        a.tplName = b;
        if (c) {
            a.preview = true;
            a.login_title = _S("preview_loginTitle") || _S("hostname");
            a.weather_info = _S("preview_weather_info");
            a.only_bgcolor = _S("preview_onlyBGColor");
            a.logo_pos = _S("preview_logoPos") || "center";
            a.background_enable = _S("preview_bgEnable");
            a.background_pos = _S("preview_bgPos") || "center";
            a.appName = _S("preview_appName") || "";
            a.login_welcome_title = _S("preview_login_welcome_title");
            a.login_welcome_msg = _S("preview_login_welcome_msg");
            a.logo_enable = false;
            if (a.appName.length !== 0) {
                a.appName += "_"
            }
            if (_S("preview_logoPath")) {
                a.logo_enable = _S("preview_logoEnable");
                if (a.logo_enable) {
                    a.logo_path = Ext.urlAppend("wallpaper.cgi", Ext.urlEncode({
                        path: SYNO.SDS.Utils.bin2hex(_S("preview_logoPath")),
                        preview: e.getTime()
                    }))
                }
            } else {
                if (_S("preview_logoPath_orig")) {
                    a.logo_enable = _S("preview_logoEnable");
                    if (a.logo_enable) {
                        a.logo_path = a.appName + "login_logo" + _S("preview_logoExt_orig") + "?id=" + _S("login_logo_seq")
                    }
                }
            }
            if (a.background_enable) {
                if (_S("preview_bgPath")) {
                    a.background_path = Ext.urlAppend("wallpaper.cgi", Ext.urlEncode({
                        path: SYNO.SDS.Utils.bin2hex(_S("preview_bgPath")),
                        preview: e.getTime()
                    }))
                } else {
                    if (_S("preview_bgPath_orig")) {
                        a.background_path = a.appName + "login_background" + _S("preview_bgExt_orig") + "?id=" + _S("login_background_seq");
                        if (_S("login_background_type") && "default" == _S("login_background_type") && f) {
                            a.background_path = a.appName + "login_background_hd" + _S("login_background_ext") + "?id=" + _S("login_background_seq")
                        }
                    }
                }
            } else {
                if (a.only_bgcolor) {
                    a.background_path = Ext.BLANK_IMAGE_URL
                } else {
                    if ("dark" === b) {
                        a.background_path = "resources/images/default_login_background/02.jpg?v=" + _S("version");
                        a.background_color = "#505050"
                    } else {
                        a.background_path = "resources/images/default_login_background/01.jpg?v=" + _S("version");
                        a.background_color = "#4c8fbf"
                    }
                }
            }
            if (a.background_enable || a.only_bgcolor) {
                a.background_color = _S("preview_bgColor") || "#FFFFFF"
            }
        } else {
            a.preview = false;
            a.login_title = _S("custom_login_title") || _S("hostname");
            a.weather_info = _S("weather_info");
            a.only_bgcolor = _S("login_only_bgcolor");
            a.logo_enable = _S("login_logo_enable");
            a.logo_pos = _S("login_logo_pos");
            a.background_enable = _S("login_background_enable");
            a.background_hd_enable = _S("login_background_hd_enable");
            a.background_pos = _S("login_background_pos");
            a.login_welcome_title = _S("login_welcome_title");
            a.login_welcome_msg = _S("login_welcome_msg");
            a.appName = _S("appName") || "";
            if (a.login_welcome_title === undefined || a.login_welcome_msg === undefined) {
                if (_D("is_business_model") === "yes") {
                    a.login_welcome_title = _T("login", "default_welcome_title_business");
                    a.login_welcome_msg = _T("login", "default_welcome_msg_business")
                } else {
                    a.login_welcome_title = _T("login", "default_welcome_title");
                    a.login_welcome_msg = _T("login", "default_welcome_msg")
                }
            }
            if (a.appName.length !== 0) {
                a.appName += "_"
            }
            if (a.logo_enable) {
                a.logo_path = a.appName + "login_logo" + _S("login_logo_ext") + "?id=" + _S("login_logo_seq")
            }
            if (a.background_enable) {
                a.background_path = a.appName + "login_background" + _S("login_background_ext") + "?id=" + _S("login_background_seq");
                if (a.background_hd_enable) {
                    if (_S("login_background_type") && "default" == _S("login_background_type") && f) {
                        a.background_path = a.appName + "login_background_hd" + _S("login_background_ext") + "?id=" + _S("login_background_seq")
                    }
                }
            } else {
                if (a.only_bgcolor) {
                    a.background_path = Ext.BLANK_IMAGE_URL
                } else {
                    if ("dark" === b) {
                        a.background_path = "resources/images/default_login_background/02.jpg?v=" + _S("version");
                        a.background_color = "#505050"
                    } else {
                        a.background_path = "resources/images/default_login_background/01.jpg?v=" + _S("version");
                        a.background_color = "#4c8fbf"
                    }
                }
            }
            if (a.background_enable || a.only_bgcolor) {
                a.background_color = _S("login_background_color") || "#FFFFFF"
            }
        }
        if (!a.background_enable && !a.only_bgcolor) {
            a.background_pos = "fill"
        }
        if (a.background_path && 0 === a.background_path.indexOf("resources/images/default_login_background")) {
            a.background_path = SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(a.background_path)
        }
        return a
    },
    updateBackgroundHighlight: function() {
        var a = Ext.get("sds-login-dialog");
        if (a) {
            Ext.getCmp("sds-login-bkg-highlight").setSize(a.getSize())
        }
    }
});
SYNO.SDS.LoginDialog.Form = Ext.extend(SYNO.ux.FormPanel, {
    btnLogin: null,
    iframe: null,
    constructor: function(a) {
        Ext.fly("sds-login-dialog-form").dom.removeAttribute("style");
        var b = {
            applyTo: "sds-login-dialog-form",
            standardSubmit: true,
            url: "login.cgi",
            method: "POST",
            width: 296,
            minHeight: 260,
            unstyled: true,
            autoFlexcroll: false,
            useGradient: false,
            listeners: {
                afterlayout: {
                    scope: this,
                    fn: this.onAfterLayout
                },
                afterrender: {
                    scope: this,
                    fn: this.onAfterRender,
                    single: true
                }
            },
            items: [this.getSplitCfg(a), {
                xtype: "panel",
                layout: "table",
                width: 296,
                cls: "sds-login-dialog-form-table",
                layoutConfig: {
                    columns: 2
                },
                items: [{
                    xtype: "box",
                    width: 56,
                    cellCls: "username-icon"
                }, {
                    tabIndex: 1,
                    xtype: "textfield",
                    width: 240,
                    maxlength: 256,
                    name: "username",
                    el: "login_username",
                    fieldLabel: _T("common", "username"),
                    disabled: a.tplConfig.preview,
                    hideLabel: true,
                    disableKeyFilter: true,
                    border: 0,
                    cellCls: "center"
                }, {
                    xtype: "box",
                    width: 56,
                    cellCls: "passwd-icon"
                }, {
                    tabIndex: 2,
                    xtype: "textfield",
                    width: 240,
                    maxlength: 256,
                    name: "passwd",
                    fieldLabel: _T("common", "password"),
                    el: "login_passwd",
                    disabled: a.tplConfig.preview,
                    hideLabel: true,
                    disableKeyFilter: true,
                    border: 0,
                    cellCls: "center"
                }, {
                    xtype: "box",
                    width: 56,
                    cellCls: "otp-icon"
                }, {
                    tabIndex: 2,
                    xtype: "textfield",
                    maxlength: 8,
                    name: "OTPcode",
                    id: "otp_field",
                    el: "login_otp",
                    disabled: a.tplConfig.preview,
                    emptyText: _T("login", "enter_otp_desc"),
                    hideLabel: true,
                    disableKeyFilter: true,
                    border: 0,
                    cellCls: "center",
                    validator: function(f) {
                        var e = /^[0-9]{6}$/;
                        var d = /^[0-9]{8}$/;
                        if (e.exec(f) || d.exec(f)) {
                            return true
                        }
                        return false
                    }
                }]
            }, {
                tabIndex: 3,
                xtype: "syno_checkbox",
                hideLabel: true,
                boxLabel: _T("login", "rememberme"),
                disabled: a.tplConfig.preview,
                width: 296,
                id: "login_rememberme",
                name: "rememberme"
            }, this.getLoginBtnCfg(a), this.statusField = new SYNO.ux.DisplayField({
                id: "sds-login-dialog-status",
                width: 296,
                value: ""
            }), {
                xtype: "syno_displayfield",
                id: "forget_pass",
                cls: "link",
                value: _T("login", "forget_pass_link")
            }, {
                xtype: "syno_displayfield",
                id: "lost_phone",
                cls: "link",
                value: _T("login", "otp_lost_phone_desc")
            }, {
                xtype: "hidden",
                name: "__cIpHeRtExT"
            }, {
                xtype: "hidden",
                name: "client_time",
                id: "client_time"
            }, {
                xtype: "hidden",
                name: "isIframeLogin",
                value: "yes"
            }]
        };
        SYNO.SDS.LoginDialog.Form.superclass.constructor.call(this, Ext.apply(b, a));
        if (!Ext.isEmpty(_S("enable_syno_token"))) {
            this.form.url = Ext.urlAppend(this.form.url, "enable_syno_token=" + _S("enable_syno_token"));
            this.form.el.dom.action = Ext.urlAppend(this.form.el.dom.action, "enable_syno_token=" + _S("enable_syno_token"))
        }
        var c = Math.floor((new Date()).getTime() / 1000);
        this.form.findField("client_time").setValue(c)
    },
    defineFields: function() {
        var b;
        var a = (_S("appIconPath"));
        b = Ext.get("login_username").dom;
        this.userRow = b.parentNode.parentNode;
        b = Ext.get("login_passwd").dom;
        this.passwdRow = b.parentNode.parentNode;
        b = Ext.get("login_otp").dom;
        this.otpRow = b.parentNode.parentNode;
        this.btnLogin = Ext.getCmp("login-btn");
        this.lostPhoneUrl = Ext.get("lost_phone");
        this.forgetPassUrl = Ext.get("forget_pass");
        this.forgetPassUrl.showIfCan = Ext.createDelegate(function() {
            if (_S("login_enable_fp") === 1) {
                this.show()
            }
        }, this.forgetPassUrl);
        this.rememberMe = Ext.get("x-form-el-login_rememberme");
        this.lostPhoneUrl.enableDisplayMode();
        this.forgetPassUrl.enableDisplayMode();
        if (a) {
            this.lostPhoneUrl.addClass("appicon-ident");
            this.forgetPassUrl.addClass("appicon-ident")
        }
    },
    getSplitCfg: function(b) {
        var a = [];
        if (this.isSupportSSO()) {
            a.push({
                xtype: "syno_combobox",
                width: 295,
                id: "sds-login-dialog-combobox",
                listClass: "sds-login-" + b.tplConfig.tplName + " syno-ux-combobox-list sds-login-dialog-combobox-list",
                triggerClass: "sds-login-dialog-combobox-trigger",
                listAlign: ["tl-bl?", [0, 3]],
                forceSelection: true,
                typeAhead: true,
                triggerAction: "all",
                lazyRender: true,
                allowBlank: false,
                displayField: "display",
                valueField: "value",
                value: "local",
                hidden: true,
                tpl: '<tpl for="."><div ext:qtip="{display}" class="x-combo-list-item">{display}</div></tpl>',
                store: new Ext.data.ArrayStore({
                    fields: ["value", "display"],
                    data: [
                        ["local", _T("sso", "account_login")],
                        ["sso", _T("sso", "sso_login")]
                    ]
                }),
                listeners: {
                    scope: this,
                    expand: function(c) {
                        c.list.setZIndex(19999)
                    },
                    select: function(e, c, d) {
                        this.onLoginTypeChange(c.get("value"));
                        this.updateBackgroundHighlight()
                    }
                }
            })
        }
        return {
            xtype: "container",
            id: "sds-login-dialog-split",
            items: a
        }
    },
    getLoginBtnCfg: function(b) {
        var a = {
            tabIndex: 4,
            indent: 1,
            xtype: "syno_button",
            btnStyle: "blue",
            text: _T("common", "dsm_login"),
            id: "login-btn",
            height: 40,
            scope: this,
            disabled: b.tplConfig.preview,
            handler: this.onClickLogin
        };
        return a
    },
    onAfterLayout: function() {
        if (!this.initLayout) {
            this.initLayout = true;
            return
        }
    },
    updateLayout: function() {
        var b = Ext.get("login_passwd");
        var a = Ext.get("sds-login-dialog-split");
        if (0 !== b.getWidth()) {
            Ext.get("login-btn").alignTo(b, "tr-br", [0, 54])
        } else {
            if (0 !== a.getWidth()) {
                Ext.get("login-btn").alignTo(a, "tr-br", [0, 34])
            }
        }
    },
    setRowVisible: function(b, a) {
        b.style.display = a ? "" : "none"
    },
    onAfterRender: function() {
        this.defineFields();
        this.setRowVisible(this.otpRow, false);
        this.lostPhoneUrl.hide();
        this.mon(this.lostPhoneUrl, "click", this.lostPhone, this);
        if (_S("login_enable_fp") === 1) {
            this.mon(this.forgetPassUrl, "click", this.onForgetPass, this)
        } else {
            this.forgetPassUrl.hide()
        }
        this.form.findField("rememberme").setValue((Ext.util.Cookies.get("stay_login") == "1"));
        this.form.el.dom.onsubmit = this.onSubmit.createDelegate(this);
        Ext.get("login_otp").dom.parentNode.setAttribute("ext:qtip", _T("login", "enter_otp_desc"));
        this.updateLayout();
        this.showLoginComboBox()
    },
    onForgetPass: function() {
        this.statusField.reset();
        Ext.getCmp("login-btn").setText(_T("common", "ok"));
        this.url = "forgetpass.cgi";
        this.blShowForgetPass = true;
        this.setRowVisible(this.passwdRow, false);
        this.rememberMe.hide();
        this.forgetPassUrl.hide();
        this.form.findField("username").emptyText = _T("login", "forget_pass_user_name");
        if (this.form.findField("username").getValue() === "") {
            this.form.findField("username").applyEmptyText()
        }
        this.hideLoginComboBox();
        this.updateBackgroundHighlight()
    },
    setFormRemove: function() {
        this.setRowVisible(this.userRow, false);
        this.btnLogin.hide()
    },
    setFormDisabled: function(d, e) {
        var a = this.form.findField("username"),
            c = this.form.findField("passwd"),
            b = this.form.findField("rememberme");
        this.btnLogin.setDisabled(d);
        a.setReadOnly(d);
        c.setReadOnly(d);
        b.setDisabled(d);
        if (!d || e) {
            a.setDisabled(d);
            c.setDisabled(d);
            b.setDisabled(d)
        }
        if (false === d && true === a.hidden && !this.blShowOTPField) {
            a.setValue("");
            a.show()
        }
        if (false === d && true === c.hidden && !this.blShowOTPField) {
            c.setValue("");
            c.show()
        }
    },
    initIFrameEvent: function() {
        var a = this;
        if (a.iframe) {
            return
        }
        a.iframe = Ext.get("login_iframe");
        if (Ext.isIE) {
            a.iframe.dom.onreadystatechange = function() {
                if ("complete" !== this.readyState && "loaded" !== this.readyState) {
                    return
                }
                a.onCallback()
            }
        } else {
            a.iframe.dom.onload = function() {
                a.onCallback()
            }
        }
    },
    onClickLogin: function() {
        if (false === this.onSSOLogin()) {
            Ext.getDom("login_submit").click();
            var a = Ext.getCmp("sds-login-dialog-combobox");
            if (a) {
                if (a.isExpanded()) {
                    a.collapse()
                }
                a.setDisabled(true)
            }
        }
    },
    onSubmit: function() {
        var a = this.form.findField("username").getValue();
        if (this.blShowOTPField && !this.form.findField("OTPcode").validate()) {
            this.setStatus(_T("login", "otp_wrong_input_format"));
            return false
        }
        if (this.blShowForgetPass) {
            if (a === "") {
                return false
            }
            this.setStatus(_T("common", "msg_waiting"));
            Ext.Ajax.request({
                url: "forget_passwd.cgi",
                method: "POST",
                params: {
                    user: a
                },
                scope: this,
                success: function(b, c) {
                    var d = Ext.decode(b.responseText);
                    var e = "Error happened";
                    if (d.msg === 1) {
                        e = _T("login", "forget_pass_msg_user_not_allowed");
                        this.setFormRemove()
                    } else {
                        if (d.msg === 2) {
                            e = _T("login", "forget_pass_msg_ask_admin");
                            this.setFormRemove()
                        } else {
                            if (d.msg === 3) {
                                e = _T("login", "forget_pass_msg_check_mail");
                                this.setFormRemove()
                            } else {
                                if (d.msg === 4) {
                                    e = _T("login", "forget_pass_msg_no_user")
                                } else {
                                    if (d.msg === 5) {
                                        e = _T("login", "forget_pass_msg_forbidden");
                                        this.setFormRemove()
                                    }
                                }
                            }
                        }
                    }
                    this.setStatus(e)
                }
            });
            return false
        }
        Ext.getDom("login_submit").focus();
        this.setFormDisabled(true);
        this.setStatus(_T("common", "msg_waiting"));
        SYNO.API.currentManager.requestAPI("SYNO.API.Encryption", "getinfo", 1, {
            format: "module"
        }, this.onEncryptionDone, this);
        return false
    },
    stdTimezone: function() {
        var b = (new Date()).getFullYear();
        var a = new Date(b, 0, 1);
        var c = new Date(b, 6, 1);
        if (a.getTimezoneOffset() >= c.getTimezoneOffset()) {
            return a.format("P")
        } else {
            return c.format("P")
        }
    },
    onEncryptionDone: function(h, f, b) {
        var j = this.form.findField("username"),
            d = this.form.findField("passwd"),
            k = this.form.findField("OTPcode"),
            c = this.form.findField("__cIpHeRtExT"),
            l = this.form.findField("rememberme"),
            a = this.form.findField("client_time"),
            g = "",
            e = {};
        if (h) {
            SYNO.Encryption.CipherKey = f.cipherkey;
            SYNO.Encryption.RSAModulus = f.public_key;
            SYNO.Encryption.CipherToken = f.ciphertoken;
            SYNO.Encryption.TimeBias = f.server_time - Math.floor(+new Date() / 1000)
        }
        e[j.getName()] = j.getValue();
        e[d.getName()] = d.getValue();
        e[k.getName()] = k.getValue();
        e[a.getName()] = a.getValue();
        e[l.getName()] = l.getValue() ? 1 : 0;
        e.timezone = this.stdTimezone();
        e = SYNO.Encryption.EncryptParam(e);
        g = e[f.cipherkey] || "";
        c.setValue(g);
        var i = new Date();
        i.setDate(i.getDate() + 60);
        Ext.util.Cookies.set("stay_login", l.getValue() ? 1 : 0, i);
        this.initIFrameEvent();
        this.setFormDisabled(true, !!g);
        this.form.el.dom.submit()
    },
    launchOTPwizard: function() {
        var f = "resources/images/default_wallpaper/01.jpg?v=" + _S("version");
        var b = SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(f);
        var e = Ext.get("sds-login-background").dom.firstChild;
        if (e) {
            e.style.display = "none"
        }
        var d;
        d = new SYNO.SDS.Background({
            id: "sds-steup-otp-background",
            renderTo: "sds-login-background",
            type: "fill",
            imgSrc: b,
            tplName: "tpl1"
        });
        if (this.module.weatherInfo) {
            this.module.weatherInfo.destroy();
            this.module.weatherInfo = null
        }
        if (this.module.welcomeInfo) {
            this.module.welcomeInfo.destroy();
            this.module.welcomeInfo = null
        }
        var a = Ext.get("sds-login-icon");
        if (a) {
            a.hide()
        }
        Ext.get("sds-login-dialog").hide();
        var c = {
            url: "setup_otp.cgi",
            module: this,
            username: this.form.findField("username").getValue(),
            passwd: this.form.findField("passwd").getValue(),
            isLDAP: this.isLDAP,
            modal: false,
            draggable: false,
            closable: false,
            renderTo: "sds-login"
        };
        this.OTPwizard = new SYNO.SDS.EnforceOTPWizard(c);
        this.OTPwizard.onOpen()
    },
    onCallback: function() {
        var g = false,
            f = "",
            d, a, c;
        try {
            a = Ext.get(this.iframe.dom.contentWindow.document.body);
            c = a.first("#synology");
            d = Ext.decode(c.dom.innerHTML);
            if (true === d.success && true === d.setup_otp) {
                this.isLDAP = d.is_ldap;
                this.launchOTPwizard()
            } else {
                if (true === d.success) {
                    if (Ext.isEmpty(SYNO.SDS.Session)) {
                        SYNO.SDS.Session = {}
                    }
                    if (!Ext.isEmpty(d.SynoToken)) {
                        SYNO.SDS.Session.SynoToken = encodeURIComponent(d.SynoToken)
                    }
                    g = true;
                    SYNO.SDS.initData();
                    f = _T("common", "loading")
                } else {
                    if (true === d.request_otp) {
                        this.blShowOTPField = true;
                        f = ""
                    } else {
                        if (d.reason) {
                            if (d.reason != "error_otp_failed") {
                                this.form.findField("passwd").setValue("");
                                this.form.findField("passwd").focus("", 1);
                                var e = Ext.getCmp("sds-login-dialog-combobox");
                                if (e) {
                                    e.setDisabled(false)
                                }
                            }
                            f = _T("login", d.reason)
                        } else {
                            f = _T("common", "error_system")
                        }
                    }
                }
            }
        } catch (b) {
            f = _T("common", "error_system")
        }
        this.setStatus(f);
        this.setFormDisabled(false);
        if (this.blShowOTPField) {
            this.showOTPFiled()
        } else {
            if (!g && d.reason != "error_otp_failed") {
                Ext.getDom("login_passwd").focus()
            }
        }
        if (this.isSupportSSO() && "login" === SYNOSSO.status && !g) {
            SYNOSSO.logout(Ext.emptyFn)
        }
    },
    showOTPFiled: function() {
        this.forgetPassUrl.hide();
        this.setRowVisible(this.userRow, false);
        this.setRowVisible(this.passwdRow, false);
        this.setRowVisible(this.otpRow, true);
        this.rememberMe.hide();
        this.lostPhoneUrl.show();
        this.lostPhoneUrl.alignTo(Ext.get("login-form"), "br-br");
        Ext.getDom("login_otp").focus();
        this.hideLoginComboBox();
        this.updateBackgroundHighlight()
    },
    lostPhone: function() {
        Ext.Ajax.request({
            url: "mail_otp.cgi",
            params: {
                username: this.form.findField("username").getValue()
            },
            scope: this,
            method: "POST",
            callback: function(b, e, d) {
                var c = _T("login", "unknown_otp_err");
                if (!e || !d || !d.responseText) {
                    this.setStatus(c);
                    return
                }
                var a = Ext.util.JSON.decode(d.responseText);
                if (a && a.success === true) {
                    c = _T("login", "otp_mail_success")
                } else {
                    if (a.err) {
                        c = _T("login", a.err)
                    }
                }
                this.setStatus(c);
                return
            }
        })
    },
    setStatus: function(b) {
        this.statusField.setValue(b);
        var a = Ext.get("sds-login-dialog");
        if (_S("appIconPath")) {
            Ext.get("sds-login-icon").alignTo(a, "br-br", [32, 40])
        }
        Ext.getCmp("sds-login-bkg-highlight").setSize(a.getSize());
        this.lostPhoneUrl.alignTo(Ext.get("login-form"), "br-br")
    },
    isSupportSSO: function() {
        return SYNO.SDS.SSOUtils.isSupport()
    },
    onLoginTypeChange: function(a) {
        this.setRowVisible(this.userRow, "local" === a);
        this.setRowVisible(this.passwdRow, "local" === a);
        this.forgetPassUrl[("local" === a) ? "showIfCan" : "hide"]();
        Ext.getCmp("login-btn").setText(("local" === a) ? _T("common", "dsm_login") : _T("common", "alt_next"));
        Ext.util.Cookies.set("login_type", a)
    },
    updateBackgroundHighlight: function() {
        this.module.updateBackgroundHighlight()
    },
    showLoginComboBox: function() {
        if (!this.isSupportSSO()) {
            return
        }
        var b = Ext.getCmp("sds-login-dialog-combobox");
        if (b.isVisible()) {
            return
        }
        var a = Ext.util.Cookies.get("login_type") || "local";
        b.setVisible(true);
        b.setValue(a);
        this.onLoginTypeChange(a)
    },
    hideLoginComboBox: function() {
        if (!this.isSupportSSO()) {
            return
        }
        var a = Ext.getCmp("sds-login-dialog-combobox");
        if (!a.isVisible()) {
            return
        }
        if ("sso" === a.getValue()) {
            return
        }
        a.setVisible(false)
    },
    onSSOLogin: function() {
        if (!this.isSupportSSO()) {
            return false
        }
        var a = Ext.getCmp("sds-login-dialog-combobox");
        if ("sso" === a.getValue()) {
            SYNO.SDS.SSOUtils.login(this.onSSOCallback, this);
            return true
        }
        return false
    },
    onSSOCallback: function(a) {
        if ("login" === a.status && a.access_token && 40 === a.access_token.length) {
            this.sendWebAPI({
                api: "SYNO.Core.Directory.SSO.utils",
                method: "exchange",
                version: 1,
                params: {
                    token: a.access_token
                },
                scope: this,
                callback: this.onGotSSOUsername
            })
        }
    },
    onGotSSOUsername: function(f, b, e, c) {
        if (!f) {
            this.setStatus("SSO login fail");
            return
        }
        this.setStatus(_T("common", "msg_waiting"));
        var a = this.form.findField("passwd");
        var g = this.form.findField("username");
        a.hide();
        g.hide();
        a.setValue("SYNOSSOLOGIN" + e.token);
        g.setValue(b.user.replace("\\\\", "\\"));
        Ext.getDom("login_submit").click();
        var d = Ext.getCmp("sds-login-dialog-combobox");
        if (d.isExpanded()) {
            d.collapse()
        }
        d.setDisabled(true)
    }
});
Ext.namespace("SYNO.SDS");
var loginLang, _S, _TT;
_S = function(a) {
    return SYNO.SDS.Session[a]
};
_TT = function(d, c, a) {
    try {
        return SYNO.SDS.Strings[d][c][a]
    } catch (b) {
        return ""
    }
};
SYNO.SDS.isNVR = (_D("nvr") === "yes") ? true : false;
Ext.define("SYNO.SDS.Environment", {
    statics: {
        ESM: "ESM",
        GetEnvironment: function() {
            return (_D("support_ESM") === "yes") ? SYNO.SDS.Environment.ESM : ""
        }
    }
});
Ext.define("SYNO.SDS.DependencyProvider", {
    extend: "Ext.util.Observable",
    constructor: function(a) {
        var b = this;
        Ext.apply(b, a);
        b.callParent(arguments)
    },
    resolve: function(c, b) {
        var d = this,
            a;
        if (d.fn) {
            a = d.fn.apply(c || window, b || [])
        } else {
            a = d.className
        }
        return a
    }
});
Ext.define("SYNO.SDS._Injector", {
    extend: "Ext.util.Observable",
    constructor: function(a) {
        var b = this;
        b.callParent(arguments);
        b.providers = {};
        b.selector = a
    },
    getEnvironment: function() {
        return this.selector
    },
    register: function(b) {
        if (Ext.isEmpty(b) || Ext.isEmpty(b.cls) || Ext.isEmpty(b.realCls)) {
            return
        }
        var a = b.cls;
        if (this.selector === b.name) {
            Ext.define(a, {
                extend: b.realCls
            })
        } else {
            if (a === b.defaultCls) {
                return
            } else {
                if (!Ext.isEmpty(b.defaultCls)) {
                    Ext.define(a, {
                        extend: b.defaultCls
                    })
                }
            }
        }
    },
    configure: function(c) {
        var a, d, e, b;
        a = {};
        for (d in c) {
            if (c.hasOwnProperty(d)) {
                b = c[d];
                if (Ext.isString(b)) {
                    e = new SYNO.SDS.DependencyProvider({
                        identifier: d,
                        className: b
                    })
                } else {
                    if (Ext.isObject(b)) {
                        e = new SYNO.SDS.DependencyProvider(Ext.apply({
                            identifier: d
                        }, b))
                    }
                }
                this.providers[d] = e
            }
        }
    },
    resolve: function(b, c, a) {
        var d = this,
            e = d.providers[b];
        if (!e) {
            return
        }
        return e.resolve(c, a)
    }
});
Ext.define("SYNO.SDS.basic.Themer", {
    extend: "Ext.util.Observable",
    constructor: function() {
        var a = this;
        a.callParent(arguments)
    },
    setTheme: function(b, a) {
        this.theme = b;
        this.themeCls = a;
        Ext.getBody().addClass(a)
    },
    getTheme: function() {
        return this.theme
    },
    getThemeCls: function() {
        return this.themeCls
    },
    getPath: function(c) {
        var b = arguments.length > 1;
        if (b || Ext.isArray(c)) {
            var a = [];
            Ext.each(b ? arguments : c, function(d) {
                a.push(this.innerGetPath(d))
            }, this);
            return a
        }
        return this.innerGetPath(c)
    },
    innerGetPath: function(a) {
        return a.replace(/images\//, "images/theme/" + this.defaultThemeCls + "/")
    }
});
Ext.define("SYNO.SDS.DSM.Themer", {
    extend: "SYNO.SDS.basic.Themer",
    defaultThemeCls: "dsm-theme",
    defaultThemeName: "dsm",
    constructor: function() {
        var a = this;
        a.callParent(arguments);
        a.setTheme(this.defaultThemeName, this.defaultThemeCls)
    },
    innerGetPath: function(a) {
        return a
    }
});
Ext.define("SYNO.SDS.ESM.Themer", {
    extend: "SYNO.SDS.basic.Themer",
    defaultThemeCls: "business",
    defaultThemeName: "esm",
    constructor: function() {
        var a = this;
        a.callParent(arguments);
        a.setTheme(this.defaultThemeName, this.defaultThemeCls)
    }
});
Ext.define("SYNO.SDS.interval.Task", {
    extend: "Ext.Component",
    constructor: function() {
        var a = this;
        a.callParent(arguments);
        a.getTimeout()
    },
    stopPollingTask: function() {
        var a = this;
        if (a.pollTask) {
            a.pollUnreg(a.pollTask)
        }
    },
    startPollingTask: function() {
        var b = this;
        var a = {
            interval: 1 * 60,
            webapi: {
                api: "SYNO.Entry.Request",
                version: 1,
                method: "request",
                stopwhenerror: true,
                params: {
                    compound: [{
                        api: "SYNO.Core.Desktop.Timeout",
                        version: 1,
                        method: "check"
                    }]
                }
            },
            scope: b,
            status_callback: b.handleResponese
        };
        b.stopPollingTask();
        b.pollTask = b.pollReg(a);
        b.mon(SYNO.SDS.StatusNotifier, "halt", function() {
            this.pollUnreg(this.pollTask)
        }, b)
    },
    handleResponese: function(d, b, c, a) {},
    delayGetTimeOut: function() {
        this.getTimeout.defer(1 * 60 * 1000, this)
    },
    getTimeout: function() {
        var b = this,
            a = {
                api: "SYNO.Core.Desktop.Timeout",
                method: "get",
                version: 1,
                params: {}
            };
        b.sendWebAPI({
            api: a.api,
            version: a.version,
            method: a.method,
            params: a.params,
            scope: b,
            callback: function(f, d, e, c) {
                if (f) {
                    if (Ext.isNumber(d.timeout) && d.timeout > 0) {
                        this.intervalTime = d.timeout;
                        this.startPollingTask()
                    } else {
                        this.delayGetTimeOut()
                    }
                } else {
                    this.delayGetTimeOut()
                }
            }
        })
    }
});
SYNO.SDS.iFrameAppToFront = function(a) {
    var b = SYNO.SDS.AppMgr.getByAppName(a);
    if (!b.length) {
        return
    }
    Ext.each(b, function(c) {
        if (c.window) {
            c.window.toFront();
            return false
        }
    })
};
SYNO.SDS.onBasicBeforeUnload = function() {
    if (Ext.isChrome) {
        SYNO.SDS.DragToDesktop.destroy()
    }
    var b, a;
    if (!_S("standalone")) {
        b = SYNO.SDS.AppMgr.getByAppName("SYNO.SDS.App.WelcomeApp.Instance");
        if (b && b[0] && !b[0].window.canReload()) {
            return _T("welcome", "unload_hint")
        }
    }
    if (!_S("standalone")) {
        b = SYNO.SDS.AppMgr.getByAppName("SYNO.SDS.PkgManApp.Instance");
        if (b && b[0] && b[0].window.isUpdating()) {
            return _T("pkgmgr", "close_updateall_confirm")
        }
    }
    if (_S("standalone")) {
        b = SYNO.SDS.AppMgr.getByAppName("SYNO.SDS.App.FileStation3.Instance")
    } else {
        b = SYNO.SDS.AppMgr.getByAppName("SYNO.SDS.App.FileTaskMonitor.Instance")
    }
    if (b && b[0]) {
        a = _S("standalone") ? b[0].window.panelObj.monitorPanel : b[0].window;
        var d = "",
            c = (!_S("standalone")) ? "DSM" : _T("tree", "leaf_filebrowser");
        if (a.uploadGrid.isProcessing()) {
            d += String.format(_WFT("upload", "confirm_unload"), c)
        } else {
            if (a.localGrid.isProcessing()) {
                d += String.format(_WFT("local_file_operation", "confirm_unload"), c)
            } else {
                if (a.downloadGrid.isProcessing()) {
                    d += String.format(_WFT("download", "confirm_unload"), c)
                }
            }
        }
        if ("" !== d) {
            return d
        }
    }
    return
};
SYNO.SDS.getMsgBeforeUnload = function() {
    var a = SYNO.SDS.onBasicBeforeUnload();
    if (SYNO.SDS.StatusNotifier.fireEvent("beforeunload") === false) {
        return _T("desktop", "confirm_leave")
    }
    if (a) {
        return a
    }
    return
};
SYNO.SDS.onBeforeUnload = function() {
    return (SYNO.SDS.getMsgBeforeUnload() || ((false === SYNO.SDS.UserSettings.getProperty("Desktop", "disableLogoutConfirm")) ? _T("desktop", "confirm_unload") : undefined))
};
SYNO.SDS.onBeforeUnloadForApplication = function() {
    return SYNO.SDS.getMsgBeforeUnload()
};
SYNO.SDS.initData = function(b) {
    if (Ext.isNumber(b) && b > 0) {
        SYNO.SDS.initData.defer(b, this);
        return
    }
    var a = {};
    if (!Ext.isEmpty(_S("SynoToken"))) {
        a.SynoToken = _S("SynoToken")
    }
    Ext.Ajax.request({
        url: "initdata.cgi",
        headers: a,
        success: function(c, d) {
            var f = Ext.util.JSON.decode(c.responseText);

            function e() {
                if (Ext.isDefined(window._loadSynoLang)) {
                    window._loadSynoLang()
                }
                f.Session.SynoToken = _S("SynoToken");
                SYNO.SDS.Session = f.Session;
                SYNO.SDS.Config.JSConfig = f.JSConfig;
                SYNO.SDS.Strings = f.Strings;
                SYNO.SDS.initUserSettings = f.UserSettings;
                SYNO.SDS.initGroupSettings = f.GroupSettings;
                SYNO.SDS.UrlTag = f.UrlTag;
                SYNO.SDS.AppPrivilege = f.AppPrivilege;
                SYNO.SDS.ServiceStatus = f.ServiceStatus;
                SYNO.SDS.UIFeatures.IconSizeManager.enableHDDisplay(f.SynohdpackStatus);
                SYNO.SDS.init();
                if (loginLang && (_S("lang") !== loginLang)) {
                    Ext.form.VTypes.reloadVtypeStr();
                    SYNO.API.AssignErrorStr(SYNO.API.Erros);
                    SYNO.SDS.Utils.StorageUtils.UiRenderHelper = SYNO.SDS.Utils.StorageUtils.UiRenderHelperInitializer();
                    SYNO.SDS.Relay.GetRelaydStatusStr = SYNO.SDS.Relay.GenRelaydStatusStr()
                }
                SYNO.SDS.appendMissingCSSFiles(f.CSSFiles)
            }
            switch (f.Session.lang) {
                case "cht":
                case "chs":
                case "jpn":
                case "krn":
                    Ext.getBody().addClass("syno-cjk")
            }
            if ((f.Session.is_admin === true) && !f.Session.rewriteApp) {
                Ext.Ajax.request({
                    url: "modules/WelcomeApp/quickstart.cgi",
                    params: {
                        action: "load_ds_info"
                    },
                    method: "POST",
                    success: function(g) {
                        var h = Ext.util.JSON.decode(g.responseText);
                        if (Ext.isObject(h) && Ext.isObject(h.data)) {
                            f.Session.admin_configured = h.data.admin_configured;
                            f.Session.update_setting_configured = h.data.update_setting_configured;
                            if (f.Session.update_setting_configured === false) {
                                f.Session.update_setting_update_type = h.data.update_setting_update_type
                            }
                            f.Session.myds_unified = h.data.myds_unified;
                            f.Session.found_myds_account = h.data.found_myds_account;
                            if (h.success === true) {
                                f.Session.vol_path = h.data.vol_path
                            }
                        }
                        SYNO.SDS.Utils.loadUIStrings(f.Session.lang, f.Session.fullversion, e)
                    },
                    failure: function() {
                        f.Session.qckFailed = true;
                        SYNO.SDS.Utils.loadUIStrings(f.Session.lang, f.Session.fullversion, e)
                    }
                })
            } else {
                SYNO.SDS.Utils.loadUIStrings(f.Session.lang, f.Session.fullversion, e)
            }
        },
        failure: SYNO.SDS.initData.createCallback(3000)
    })
};
SYNO.SDS.appendMissingCSSFiles = function(b) {
    var a = -1,
        c = "";
    var d = function(e) {
        Ext.each(document.getElementsByTagName("link"), function(f) {
            a = e.indexOf("?");
            if (a !== -1) {
                c = e.substring(0, a);
                if (0 < f.href.indexOf(c)) {
                    f.parentNode.removeChild(f);
                    return false
                }
            }
        })
    };
    Ext.each(b, function(e) {
        var f = false;
        if (0 !== e.indexOf("3rdparty/")) {
            return
        }
        Ext.each(document.getElementsByTagName("link"), function(h) {
            if (0 < h.href.indexOf(e)) {
                f = true;
                return false
            }
        });
        if (!f) {
            d(e);
            var g = document.createElement("link");
            g.setAttribute("rel", "stylesheet");
            g.setAttribute("type", "text/css");
            g.setAttribute("href", e);
            document.getElementsByTagName("head")[0].appendChild(g)
        }
    })
};
SYNO.SDS.AutoLaunch = function() {
    var a = function(c, g) {
        var b = (SYNO.SDS.Config.FnMap[c] && SYNO.SDS.Config.FnMap[c].config) ? SYNO.SDS.Config.FnMap[c].config : {},
            f = b.canLaunch,
            d, e;
        if (Ext.isObject(f)) {
            for (d in f) {
                if (!!_S(d) !== f[d]) {
                    return
                }
            }
        }
        e = SYNO.SDS.AppMgr.getByAppName(c);
        if (e.length === 0) {
            SYNO.SDS.AppLaunch(c, {}, false, g)
        }
    };
    SYNO.SDS.Config.AutoLaunchFnList.each(function(b) {
        if (Ext.isObject(b)) {
            a(b.dependName, a.createDelegate(this, [b.appName]))
        } else {
            a(b)
        }
    })
};
SYNO.SDS.reloadJSConfig = function(b) {
    if (Ext.isNumber(b) && b > 0) {
        SYNO.SDS.reloadJSConfig.defer(b, this);
        return
    }
    var a = function() {
        var c = [];
        SYNO.SDS.AppMgr.each(function(d) {
            var e = d.jsConfig.jsID;
            if (!Ext.isDefined(SYNO.SDS.Config.FnMap[e])) {
                c.push(d)
            }
        });
        Ext.invoke(c, "destroy")
    };
    Ext.Ajax.request({
        url: "initdata.cgi",
        params: {
            action: "jsconfig"
        },
        success: function(c, d) {
            var e = Ext.util.JSON.decode(c.responseText);
            SYNO.SDS.Config.JSConfig = e.JSConfig;
            SYNO.SDS.Strings = e.Strings;
            SYNO.SDS.ServiceStatus = e.ServiceStatus;
            SYNO.SDS.AppPrivilege = e.AppPrivilege;
            SYNO.SDS.JSLoad.init();
            SYNO.SDS.AppView.refresh();
            SYNO.SDS.Desktop.refresh();
            SYNO.SDS.appendMissingCSSFiles(e.CSSFiles);
            a();
            if (SYNO.SDS.StatusNotifier) {
                SYNO.SDS.StatusNotifier.fireEvent("jsconfigLoaded")
            }
            SYNO.SDS.AutoLaunch()
        },
        failure: SYNO.SDS.reloadJSConfig.createCallback(3000)
    });
    if (!SYNO.API.currentManager) {
        SYNO.API.currentManager = new SYNO.API.Manager()
    }
    SYNO.API.currentManager.queryAPI("all")
};
SYNO.SDS.autoStart = function() {
    SYNO.SDS.UserSettings.setProperty("SYNO.SDS.App.WelcomeApp.Instance", "welcome_dsm50_hide", true);
    var b = SYNO.SDS.UserSettings.getProperty("Desktop", "restoreParams") || [],
        a = SYNO.SDS.UserSettings.getProperty("SYNO.SDS.HelpBrowser.Application", "nolaunch") || false;
    SYNO.SDS.AutoLaunch();
    Ext.each(b, function(c) {
        SYNO.SDS.AppLaunch(c.className, Ext.apply({
            fromRestore: true
        }, c.params), true)
    });
    SYNO.SDS.UserSettings.removeProperty("Desktop", "restoreParams");
    if (!a) {
        SYNO.SDS.AppLaunch("SYNO.SDS.HelpBrowser.Application", {}, false)
    }
};
SYNO.SDS.CheckBadge = function() {
    var a = function() {
        SYNO.API.Request({
            compound: {
                api: "SYNO.Entry.Request",
                version: 1,
                method: "request",
                stopwhenerror: false,
                params: [{
                    api: "SYNO.Core.Upgrade.Server",
                    method: "check",
                    version: 1
                }, {
                    api: "SYNO.Core.Package.Server",
                    method: "check",
                    version: 1
                }]
            },
            scope: this,
            callback: Ext.emptyFn
        })
    };
    a()
};
SYNO.SDS.GetExternalIP = function() {
    var a = {};
    if (!Ext.isEmpty(_S("SynoToken"))) {
        a.SynoToken = _S("SynoToken")
    }
    Ext.Ajax.request({
        url: "initdata.cgi",
        headers: a,
        params: {
            action: "external_ip"
        },
        success: function(b, c) {
            var d = Ext.util.JSON.decode(b.responseText);
            SYNO.SDS.Session.external_ip = d.external_ip;
            SYNO.SDS.Session.ddns_hostname = d.ddns_hostname
        }
    })
};
SYNO.SDS.init = function() {
    var l = Ext.urlDecode(location.search.substr(1)),
        b = l.launchApp,
        k = l.launchParam,
        i = l.jsDebug,
        e = l.report,
        c = SYNO.SDS.Session.rewriteApp,
        j = Ext.id(),
        h, a;
    if (Ext.isDefined(e)) {
        window.location = Ext.urlAppend("/dar/" + e);
        return
    }
    if (Ext.isDefined(i)) {
        SYNO.SDS.JSDebug = i
    }
    SYNO.SDS.initFramework();
    var d = SYNO.SDS.Config.FnMap[b],
        g = false;
    if (d && d.config) {
        var f = d.config;
        if ("standalone" === f.type || true === f.allowStandalone || "url" === f.type || "legacy" === f.type) {
            g = true
        }
    }
    if (SYNO.SDS.StatusNotifier.isAppEnabled(b) && g) {
        SYNO.SDS.initStandaloneDesktop(b, k)
    } else {
        if (c) {
            if (SYNO.SDS.StatusNotifier.isAppEnabled(c)) {
                SYNO.SDS.Session.rewrite_mode = true;
                SYNO.SDS.initStandaloneDesktop(c, k)
            } else {
                SYNO.SDS.StatusNotifier.fireEvent("logout");
                window.alert(_JSLIBSTR("uicommon", "error_noprivilege"));
                SYNO.SDS.Utils.Logout.action(true);
                return
            }
        } else {
            SYNO.SDS.initDesktop(b);
            if (SYNO.SDS.StatusNotifier.isAppEnabled(b)) {
                SYNO.SDS.AppLaunch(b, k)
            }
            if (window.Notification && SYNO.SDS.UserSettings.getProperty("Desktop", "enableDesktopNotification") && window.Notification.permission === "default") {
                h = String.format('<span id={0} class="blue-status" style="cursor:pointer;">{1}</span>', j, _T("common", "here"));
                h = String.format(_T("common", "click_to_enable_notification"), h);
                a = SYNO.SDS.SystemTray.notifyMsg("", _T("common", "desktop"), h, 0);
                Ext.get(j).on("click", function() {
                    window.Notification.requestPermission(function(m) {
                        window.Notification.permission = m
                    });
                    a.close()
                })
            }
            if (_S("is_admin")) {
                SYNO.SDS.CheckBadge()
            }
        }
    }
    SYNO.SDS.GetExternalIP();
    SYNO.SDS.HandleTimeoutTask = new SYNO.SDS.interval.Task()
};
SYNO.SDS.initFramework = function() {
    var a = Ext.getCmp("sds-login");
    if (a) {
        a.el.fadeOut({
            callback: function() {
                a.destroy()
            }
        })
    }
    SYNO.SDS.LaunchTime = new Date().getTime();
    SYNO.SDS.JSLoad.init();
    SYNO.SDS.StatusNotifier = new SYNO.SDS._StatusNotifier({});
    SYNO.SDS.UserSettings = new SYNO.SDS._UserSettings();
    SYNO.SDS.GroupSettings = new SYNO.SDS._GroupSettings();
    SYNO.SDS.WindowMgr = new SYNO.SDS._WindowMgr();
    SYNO.SDS.AppMgr = new SYNO.SDS._AppMgr();
    SYNO.SDS.GestureMgr = new SYNO.SDS._GestureMgr();
    SYNO.SDS.Injector = new SYNO.SDS._Injector(SYNO.SDS.Environment.GetEnvironment());
    SYNO.SDS.Injector.configure({
        getDesktopClass: {
            fn: function() {
                var d = SYNO.SDS.UserSettings.getProperty("Desktop", "desktopStyle");
                if ((d === "classical") || (SYNO.SDS.Environment.GetEnvironment() === SYNO.SDS.Environment.ESM)) {
                    return "SYNO.SDS.Classical._Desktop"
                } else {
                    return "SYNO.SDS._Desktop"
                }
            }
        },
        getLaunchItemClass: {
            fn: function() {
                var d = SYNO.SDS.UserSettings.getProperty("Desktop", "desktopStyle");
                if ((d === "classical") || (SYNO.SDS.Environment.GetEnvironment() === SYNO.SDS.Environment.ESM)) {
                    return "SYNO.SDS.Classical._LaunchItem"
                } else {
                    return "SYNO.SDS._LaunchItem"
                }
            }
        },
        getAppMenuClass: {
            fn: function() {
                var d = SYNO.SDS.UserSettings.getProperty("Desktop", "appMenuStyle");
                if ((d === "classical") || (SYNO.SDS.Environment.GetEnvironment() === SYNO.SDS.Environment.ESM)) {
                    return "SYNO.SDS.Classic._AppView"
                } else {
                    return "SYNO.SDS._AppView"
                }
            }
        }
    });
    SYNO.SDS._ActiveDesktop = Ext.getClassByName(SYNO.SDS.Injector.resolve("getDesktopClass"));
    SYNO.SDS.LaunchItem = Ext.getClassByName(SYNO.SDS.Injector.resolve("getLaunchItemClass"));
    SYNO.SDS._ActiveMenu = Ext.getClassByName(SYNO.SDS.Injector.resolve("getAppMenuClass"));
    SYNO.SDS.Injector.register({
        name: SYNO.SDS.Environment.ESM,
        cls: "SYNO.SDS.Themer",
        realCls: "SYNO.SDS.DSM.Themer",
        defaultCls: "SYNO.SDS.DSM.Themer"
    });
    SYNO.SDS.ThemeProvider = new SYNO.SDS.Themer();
    if (Ext.isDefined(SYNO.SDS.JSDebug)) {
        SYNO.Debug("JS Loading Caching Disabled. (append _dc to js link)");
        if ("all" === SYNO.SDS.JSDebug) {
            var b = SYNO.SDS.Config.FnMap;
            SYNO.Debug("JS Dynamic Loading Disabled.");
            for (var c in b) {
                if (b.hasOwnProperty(c)) {
                    SYNO.SDS.JSLoad(c)
                }
            }
        }
    }
};
SYNO.SDS.initStandaloneDesktop = function(b, a) {
    SYNO.SDS.BackgroundTaskMgr = new SYNO.SDS._BackgroundTaskMgr();
    SYNO.SDS.UploadTaskMgr = new SYNO.SDS._UploadBackgroundTaskMgr();
    SYNO.SDS.MailTaskMgr = new SYNO.SDS._MailBackgroundTaskMgr();
    SYNO.SDS.SystemTray = new SYNO.SDS._SystemTray();
    SYNO.SDS.Session.standalone = true;
    SYNO.SDS.Session.standaloneAppName = b;
    SYNO.SDS.Desktop = new SYNO.SDS._StandaloneDesktop();
    SYNO.SDS.AppLaunch(b, a);
    window.onbeforeunload = SYNO.SDS.onBasicBeforeUnload;
    SYNO.SDS.HandleTimeoutTask = new SYNO.SDS.interval.Task()
};
SYNO.SDS.HideDesktop = function() {
    SYNO.SDS.TaskBar.hide();
    SYNO.SDS.Desktop.hide();
    Ext.get("sds-taskbar-shadow").hide()
};
SYNO.SDS.ShowDesktop = function() {
    var a = Ext.fly("sds-wallpaper");
    if (a.dom && a.dom.src) {
        Ext.fly("sds-wallpaper").show()
    }
    SYNO.SDS.Desktop.show();
    SYNO.SDS.TaskBar.show();
    Ext.get("sds-taskbar-shadow").show()
};
Ext.define("SYNO.SDS.LaunchFullSizeApps", {
    statics: {
        appList: ["SYNO.SDS.App.WelcomeApp.Instance", "SYNO.SDS.App.WelcomeTip.Instance"],
        index: 0,
        start: function() {
            if (this.index < this.appList.length) {
                SYNO.SDS.AppLaunch(this.appList[this.index], {}, false);
                this.index++;
                return
            }
            if (this.index === this.appList.length) {
                SYNO.SDS.ShowDesktop();
                SYNO.SDS.autoStart()
            }
        }
    }
});
SYNO.SDS.initDesktop = function(a) {
    var b = !a && !_S("qckFailed") && _S("is_admin");
    SYNO.SDS.BackgroundTaskMgr = new SYNO.SDS._BackgroundTaskMgr();
    SYNO.SDS.UploadTaskMgr = new SYNO.SDS._UploadBackgroundTaskMgr();
    SYNO.SDS.PackageTaskMgr = new SYNO.SDS._PackageBackgroundTaskMgr();
    SYNO.SDS.MailTaskMgr = new SYNO.SDS._MailBackgroundTaskMgr();
    SYNO.SDS.DeskTopManager = new SYNO.SDS._DeskTopManager();
    SYNO.SDS.TaskBar = new SYNO.SDS._TaskBar();
    SYNO.SDS.TaskButtons = Ext.getCmp("sds-taskbuttons-panel");
    SYNO.SDS.SystemTray = Ext.getCmp("sds-tray-panel");
    SYNO.SDS.Desktop = new SYNO.SDS._ActiveDesktop();
    SYNO.SDS.AppView = new SYNO.SDS._ActiveMenu();
    SYNO.SDS.System = new SYNO.SDS._System();
    if (false === SYNO.SDS.Session.boot_done) {
        SYNO.SDS.System.WaitForBootUp();
        return
    }
    if (b) {
        SYNO.SDS.LaunchFullSizeApps.start();
        SYNO.SDS.HideDesktop()
    }
    SYNO.SDS.PreviewBox = new SYNO.SDS._PreviewBox();
    SYNO.SDS.SearchBox = new SYNO.SDS._SearchBox();
    window.onbeforeunload = SYNO.SDS.onBeforeUnload;
    SYNO.SDS.StatusNotifier.on("thirdpartychanged", SYNO.SDS.reloadJSConfig);
    SYNO.SDS.StatusNotifier.on("halt", function() {
        var c = Ext.getClassByName("SYNO.API.Request.Polling.Instance");
        SYNO.SDS.TaskMgr.setHalt(true);
        if (Ext.isObject(c) && Ext.isFunction(c.endPolling)) {
            c.endPolling("halt")
        }
    });
    if (b) {
        SYNO.SDS.StatusNotifier.on("fullsizeappdestroy", function() {
            SYNO.SDS.LaunchFullSizeApps.start()
        })
    } else {
        SYNO.SDS.autoStart()
    }
};
SYNO.SDS.DragToDesktop = function() {
    var b = false;
    var d = [".syno-sds-fs-win", ".welcomedragable-url"];
    var c = function(l) {
        var k = false;
        Ext.each(d, function(m) {
            if (l.within(l.getTarget(m))) {
                k = true;
                return false
            }
        }, this);
        if (!k) {
            l.preventDefault()
        }
    };
    var e = function(k) {
        k.preventDefault();
        var l = this.timeStamp || (this.timeStamp = k.browserEvent.timeStamp);
        if (Math.abs(k.browserEvent.timeStamp - l) < 100) {
            return
        }
        this.timeStamp = k.browserEvent.timeStamp;
        this.handleMouseMove(k)
    };
    var a = function(k) {
        this.handleMouseUp(k);
        k.stopPropagation();
        k.preventDefault()
    };
    var f = function(k) {
        if (this.dragCurrent) {
            this.handleMouseUp.defer(150, this, [k])
        }
    };
    var h = function(k) {
        k.preventDefault()
    };
    var j = function() {
        Ext.dd.DragDropMgr.preventDefault = false;
        Ext.EventManager.on(document, "dragstart", c, this, true);
        Ext.EventManager.on(document, "dragenter", h, Ext.dd.DragDropMgr, true);
        Ext.EventManager.on(document, "dragover", e, Ext.dd.DragDropMgr, true);
        Ext.EventManager.on(document, "drop", a, Ext.dd.DragDropMgr, true);
        Ext.EventManager.on(document, "dragend", f, Ext.dd.DragDropMgr, true);
        b = true
    };
    var i = function() {
        Ext.dd.DragDropMgr.preventDefault = true;
        Ext.EventManager.un(document, "dragstart", c, this, true);
        Ext.EventManager.un(document, "dragover", e, Ext.dd.DragDropMgr, true);
        Ext.EventManager.un(document, "dragenter", h, Ext.dd.DragDropMgr, true);
        Ext.EventManager.un(document, "drop", a, Ext.dd.DragDropMgr);
        Ext.EventManager.un(document, "dragend", f, Ext.dd.DragDropMgr);
        b = false
    };
    var g = function() {
        return b
    };
    return {
        init: j,
        destroy: i,
        isEnable: g
    }
}();
SYNO.SDS.HTML5Utils = function() {
    var a = (!window.XMLHttpRequest) ? {} : new XMLHttpRequest();
    return {
        HTML5Progress: !!(a.upload),
        HTML5SendBinary: !!(a.sendAsBinary || a.upload),
        HTML5ReadBinary: !!(window.FileReader || window.File && window.File.prototype.getAsBinary),
        HTML5Slice: (!!(window.File && (window.File.prototype.slice || window.File.prototype.mozSlice || window.File.prototype.webkitSlice))),
        isSupportHTML5Upload: function() {
            var b = Ext.isChrome || (!Ext.isSafari4 && !Ext.isSafari5_0 && !(Ext.isWindows && Ext.isSafari) && !Ext.isGecko3 && !Ext.isOpera);
            return (b && (!!window.FormData || SYNO.SDS.HTML5Utils.HTML5SendBinary && SYNO.SDS.HTML5Utils.HTML5ReadBinary && SYNO.SDS.HTML5Utils.HTML5Slice))
        },
        isDragFile: function(d) {
            try {
                if (Ext.isWebKit) {
                    var b = (d.dataTransfer.types && d.dataTransfer.types.indexOf("Files") != -1);
                    return b
                } else {
                    if (Ext.isGecko) {
                        return d.dataTransfer.types.contains("application/x-moz-file")
                    } else {
                        if (Ext.isIE10 || Ext.isModernIE) {
                            return d.dataTransfer.files && d.dataTransfer.types && d.dataTransfer.types.contains("Files")
                        }
                    }
                }
            } catch (c) {}
            return false
        }
    }
}();
SYNO.SDS.SSOUtils = function() {
    return {
        callbackFn: {
            fn: Ext.emptyFn,
            scope: this
        },
        isSupport: function() {
            return (_S("sso_support") && _S("sso_server") && _S("sso_appid") && "SYNOSSO" in window && Ext.isFunction(SYNOSSO.init))
        },
        init: function() {
            if (this.isSupport()) {
                try {
                    SYNOSSO.init({
                        oauthserver_url: _S("sso_server"),
                        app_id: _S("sso_appid"),
                        redirect_uri: document.URL,
                        callback: this.callback.createDelegate(this)
                    })
                } catch (a) {}
            }
            return
        },
        callback: function(a) {
            if (false !== Ext.isDefined(SYNOSSO.status)) {
                SYNOSSO.status = a.status;
                this.callbackFn.fn.call(this.callbackFn.scope, a)
            } else {
                SYNOSSO.status = a.status
            }
        },
        login: function(b, a) {
            this.callbackFn.fn = b;
            if (Ext.isDefined(a)) {
                this.callbackFn.scope = a
            }
            SYNOSSO.login()
        },
        logout: function(b, a) {
            if (a) {
                b.createDelegate(a)
            }
            if ("sso" === Ext.util.Cookies.get("login_type")) {
                SYNOSSO.logout(b)
            }
        }
    }
}();
Ext.define("SYNO.SDS.IEUpgradeAlert", {
    extend: "SYNO.SDS.Window",
    constructor: function() {
        var a = {
            cls: "ie-upgrade-alert",
            width: 450,
            height: 230,
            maximizable: false,
            title: _D("manager"),
            items: [{
                xtype: "syno_formpanel",
                name: "ie_alert_form",
                items: [{
                    xtype: "syno_displayfield",
                    hideLabel: true,
                    value: _T("desktop", "upgrade_ie_browser")
                }, {
                    name: "skip_alert",
                    xtype: "syno_checkbox",
                    checked: false,
                    boxLabel: _T("common", "dont_alert_again")
                }]
            }],
            fbar: {
                toolbarCls: "x-panel-fbar x-statusbar",
                items: [{
                    xtype: "syno_button",
                    text: _T("common", "ok"),
                    btnStyle: "blue",
                    handler: function() {
                        var c = this.find("name", "skip_alert")[0];
                        var b = new Date();
                        if (c.getValue() === true) {
                            Ext.util.Cookies.set("skip_upgrade_ie_alert", true, b.add(Date.YEAR, 1))
                        }
                        this.close()
                    },
                    scope: this
                }]
            }
        };
        this.callParent([a])
    }
});
Ext.onReady(function() {
    var a = function(j) {
        if (j.getTarget(".selectabletext")) {
            return true
        }
        if (j.getTarget("textarea")) {
            return true
        }
        var i = j.getTarget("input"),
            h = (i && i.type) ? i.type.toLowerCase() : "";
        if ("text" !== h && "textarea" !== h && "password" !== h) {
            return false
        }
        if (i.readOnly) {
            return false
        }
        return true
    };
    var c = function(j) {
        var i = j.getTarget("input"),
            h = (i && i.type) ? i.type.toLowerCase() : "";
        if (j.getTarget("textarea")) {
            return true
        }
        if ("text" !== h && "password" !== h) {
            return false
        }
        return true
    };
    var b = function() {
        SYNO.SDS.initData();
        if (Ext.util.Cookies.get("stay_login") == "1") {
            var i = new Date();
            i.setDate(i.getDate() + 30);
            var h = Ext.util.Cookies.get("id");
            Ext.util.Cookies.set("id", h, i)
        }
    };
    Ext.QuickTips.init();
    if (!Ext.isIE9m || Ext.isIE9) {
        Ext.QuickTips.getQuickTip().getEl().disableShadow()
    }
    Ext.dd.DragDropMgr.stopPropagation = false;
    Ext.dd.DragDropMgr.clickTimeThresh = -1;
    Ext.WindowMgr.zseed = 12000;
    if (Ext.isIE) {
        Ext.getDoc().on("selectstart", function(h) {
            if (!a(h)) {
                h.stopEvent()
            }
        })
    }
    Ext.getDoc().on("keydown", function(h) {
        if (h.ctrlKey && h.A === h.getKey() && !a(h)) {
            h.stopEvent()
        }
        if (h.BACKSPACE === h.getKey() && !c(h)) {
            h.preventDefault()
        }
        if (Ext.isIE && h.ESC === h.getKey() && c(h)) {
            h.preventDefault()
        }
    });
    Ext.getBody().on("contextmenu", function(h) {
        if (!a(h) && !h.getTarget(".allowDefCtxMenu")) {
            h.stopEvent()
        }
    });
    Ext.Ajax.on("requestcomplete", function(i, k, h) {
        try {
            if (SYNO.SDS.Utils.CheckServerError(k)) {
                i.purgeListeners();
                delete h.success;
                delete h.failure;
                delete h.callback
            }
        } catch (j) {
            if (!Ext.isIE8) {
                throw j
            }
        }
    });
    if (SYNO.SDS.HTML5Utils.isSupportHTML5Upload()) {
        Ext.getBody().on("dragover", function(h) {
            if (SYNO.SDS.HTML5Utils.isDragFile(h.browserEvent)) {
                h.preventDefault();
                h.browserEvent.dataTransfer.dropEffect = "none"
            }
        })
    }
    if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
        var d = Ext.util.Cookies.get("skip_upgrade_ie_alert");
        if (!d) {
            var g = new SYNO.SDS.IEUpgradeAlert();
            g.show()
        }
    }
    if (_S("diskless")) {
        Ext.getBody().addClass("syno-diskless")
    }
    if (Ext.isIE10Touch) {
        Ext.getBody().addClass("syno-ie10-touch")
    }
    if (!SYNO.API.currentManager) {
        SYNO.API.currentManager = new SYNO.API.Manager()
    }
    SYNO.SDS.SSOUtils.init();
    SYNO.API.currentManager.queryAPI("all");
    SYNO.SDS.UIFeatures.IconSizeManager.addHDClsAndCSS(_S("SynohdpackStatus"));
    var f, e;
    if (typeof(SYNO.SDS.ForgetPass) !== "undefined") {
        f = new SYNO.SDS.ChangePassDialog({})
    } else {
        if (_S("isLogined")) {
            if (_S("preview")) {
                if (_S("preview_modified")) {
                    f = new SYNO.SDS.LoginApplyPreviewForm({})
                }
                e = new SYNO.SDS.LoginDialog({
                    preview: true
                })
            } else {
                if (_S("enable_syno_token")) {
                    SYNO.SDS.UpdateSynoToken(b)
                } else {
                    b()
                }
            }
        } else {
            loginLang = _S("lang");
            e = new SYNO.SDS.LoginDialog({})
        }
    }
});
Ext.namespace("SYNO.SDS");
SYNO.SDS.ChangePassDialog = Ext.extend(SYNO.SDS.LoginDialog, {
    constructor: function(a) {
        this.tplConfig = this.getTplConfig(a.preview);
        a.showWeather = false;
        a.preview = false;
        SYNO.SDS.ChangePassDialog.superclass.constructor.call(this, a)
    },
    newForm: function() {
        return new SYNO.SDS.ChangePassDialog.Form({
            module: this,
            tplConfig: this.tplConfig
        })
    }
});
SYNO.SDS.ChangePassDialog.PasswordField = Ext.extend(Ext.form.TextField, {
    constructor: function(a) {
        this.addEvents({
            show_pass: true
        });
        this.listeners = a.listeners;
        SYNO.LayoutConfig.fill(a);
        SYNO.SDS.ChangePassDialog.PasswordField.superclass.constructor.call(this, a);
        this.on("show_pass", function() {
            this.textField.hide();
            this.passField.show();
            this.passField.focus();
            this.passField.blur()
        }, a.handler_scope)
    }
});
SYNO.SDS.ChangePassDialog.Password = Ext.extend(Ext.form.CompositeField, {
    constructor: function(a, f, b) {
        var d = {
            xtype: "textfield",
            inputType: "password",
            hidden: true,
            handler_scope: this,
            listeners: {
                scope: this,
                blur: function() {
                    if (this.passField.getValue() === "") {
                        this.textField.show();
                        this.passField.hide()
                    }
                }
            }
        };
        Ext.apply(d, f);
        this.passField = new SYNO.SDS.ChangePassDialog.PasswordField(d);
        var e = {
            xtype: "textfield",
            inputType: "text",
            hidden: false,
            listeners: {
                scope: this,
                focus: function() {
                    this.textField.hide();
                    this.passField.show();
                    this.passField.focus()
                }
            }
        };
        Ext.apply(e, b);
        SYNO.LayoutConfig.fill(e);
        this.textField = new Ext.form.TextField(e);
        var c = {
            xtype: "compositefield",
            items: [this.textField, this.passField]
        };
        Ext.apply(c, a);
        SYNO.LayoutConfig.fill(c);
        SYNO.SDS.ChangePassDialog.Password.superclass.constructor.call(this, c)
    }
});
SYNO.SDS.ChangePassDialog.Form = Ext.extend(SYNO.ux.FormPanel, {
    btnLogin: null,
    iframe: null,
    dialogUseBanner: false,
    constructor: function(c) {
        this.passwordChecker = new SYNO.SDS.Utils.CheckStrongPassword();
        Ext.fly("sds-login-dialog-form").dom.removeAttribute("style");
        var b = {
            id: "login_passwd_com1",
            cellCls: "center"
        };
        var e = {
            name: "passwd",
            tabIndex: 1,
            id: this.passwd = Ext.id(),
            el: "login_passwd_fp",
            maxlength: 256,
            cellCls: "sds-fp-dialog-passwd1",
            validator: this.passwordChecker.isStrongValidator.createDelegate(this.passwordChecker),
            disabled: c.tplConfig.preview,
            listeners: {
                scope: this,
                invalid: function() {
                    Ext.fly("sds-login-dialog-status").update(_T("error", "error_bad_field"));
                    if (this.tplConfig.useBanner) {
                        Ext.get("sds-login-dialog-status-container").dom.style.marginTop = "-17px"
                    }
                },
                valid: function() {
                    Ext.fly("sds-login-dialog-status").update("");
                    if (this.tplConfig.useBanner) {
                        Ext.get("sds-login-dialog-status-container").dom.style.marginTop = "-17px"
                    }
                }
            }
        };
        var g = {
            name: "passwd_text",
            tabIndex: 1,
            el: "login_passwd_text",
            emptyText: _T("login", "forget_pass_new_password"),
            maxlength: 256,
            cellCls: "center",
            disabled: c.tplConfig.preview
        };
        var a = {
            id: "login_passwd_com2",
            cellCls: "center"
        };
        var d = {
            name: "passwd_confirm",
            tabIndex: 2,
            el: "login_passwd_confirm",
            maxlength: 256,
            cellCls: "center",
            disabled: c.tplConfig.preview
        };
        var f = {
            name: "passwd_confirm_text",
            tabIndex: 2,
            el: "login_passwd_confirm_text",
            emptyText: _T("login", "forget_pass_comfirm_password"),
            maxlength: 256,
            cellCls: "center",
            disabled: c.tplConfig.preview
        };
        this.pass1 = new SYNO.SDS.ChangePassDialog.Password(b, e, g);
        this.pass2 = new SYNO.SDS.ChangePassDialog.Password(a, d, f);
        SYNO.SDS.ChangePassDialog.Form.superclass.constructor.call(this, Ext.apply({
            applyTo: "sds-login-dialog-form",
            standardSubmit: true,
            url: "forget_passwd.cgi",
            method: "POST",
            width: 296,
            minHeight: 260,
            unstyled: true,
            autoFlexcroll: false,
            useGradient: false,
            listeners: {
                afterlayout: {
                    scope: this,
                    fn: this.onAfterLayout,
                    single: true
                },
                afterrender: {
                    scope: this,
                    fn: this.onAfterRender,
                    single: true
                }
            },
            items: [{
                xtype: "panel",
                layout: "table",
                width: 296,
                cls: "sds-login-dialog-form-table",
                layoutConfig: {
                    columns: 2
                },
                items: [{
                    xtype: "box",
                    width: 56,
                    cellCls: "passwd-icon"
                }, this.pass1, {
                    xtype: "box",
                    width: 56,
                    cellCls: "passwd-icon"
                }, this.pass2]
            }, {
                tabIndex: 3,
                xtype: "syno_button",
                btnStyle: "blue",
                text: _T("login", "btn_forget_pass_submit"),
                id: "login-btn",
                height: 40,
                scope: this,
                disabled: c.tplConfig.preview,
                handler: this.onClickLogin
            }, this.statusField = new SYNO.ux.DisplayField({
                id: "sds-login-dialog-status",
                width: 296,
                value: ""
            }), {}, {
                xtype: "hidden",
                name: "ticket",
                el: "ticket"
            }, {
                xtype: "hidden",
                name: "__cIpHeRtExT"
            }, {
                xtype: "hidden",
                name: "client_time",
                id: "client_time"
            }]
        }, c));
        var h = Math.floor((new Date()).getTime() / 1000);
        this.form.findField("client_time").setValue(h);
        this.dialogUseBanner = !!c.tplConfig.useBanner
    },
    updateLayout: function() {
        Ext.get("login-btn").alignTo(this.el.child(".sds-login-dialog-form-table"), "tr-br", [0, 17])
    },
    onAfterLayout: function() {
        this.btnLogin = Ext.getCmp("login-btn");
        this.form.el.dom.onsubmit = this.onSubmit.createDelegate(this);
        Ext.Ajax.request({
            url: "forget_passwd.cgi",
            method: "POST",
            params: {
                action: "LoadPassRule"
            },
            success: function(a, b) {
                var d = Ext.decode(a.responseText);
                var c = this.form;
                if (d.success) {
                    this.passwordChecker.passwordPolicy = d.passwdRules;
                    this.passwordChecker.initPasswordChecker({
                        getUserAcc: function() {
                            return SYNO.SDS.ForgetPass.user
                        },
                        getUserDesc: function() {
                            return SYNO.SDS.ForgetPass.user_desc
                        },
                        getPasswd: "passwd",
                        getPasswdConfirm: "passwd_confirm",
                        getForm: function() {
                            return c
                        },
                        getStartValidate: function() {
                            if (this.passwordPolicy && this.passwordPolicy.strong_password_enable === true) {
                                return true
                            }
                            return false
                        }
                    })
                }
            },
            scope: this
        })
    },
    onAfterRender: function() {
        Ext.get("login-btn").dom.style.marginTop = "27px"
    },
    setFormDisabled: function(c, d) {
        var b = this.form.findField("passwd");
        var a = this.form.findField("passwd_confirm");
        this.btnLogin.setDisabled(c);
        b.setReadOnly(c);
        a.setReadOnly(c);
        if (!c || d) {
            b.setDisabled(c);
            a.setDisabled(c)
        }
    },
    initIFrameEvent: function() {
        var a = this;
        if (a.iframe) {
            return
        }
        a.iframe = Ext.get("login_iframe");
        if (Ext.isIE) {
            a.iframe.dom.onreadystatechange = function() {
                if ("complete" !== this.readyState && "loaded" !== this.readyState) {
                    return
                }
                a.onCallback()
            }
        } else {
            a.iframe.dom.onload = function() {
                a.onCallback()
            }
        }
    },
    onClickLogin: function() {
        Ext.getDom("login_submit").click()
    },
    onSubmit: function() {
        var b = this.form.findField("passwd").getValue();
        var a = this.form.findField("passwd_confirm").getValue();
        if (true !== this.passwordChecker.isStrongValidator()) {
            this.form.findField("passwd").fireEvent("show_pass");
            return false
        }
        if (b !== a) {
            Ext.fly("sds-login-dialog-status").update(_T("login", "forget_pass_comfirm_password_error"));
            Ext.fly("sds-login-dialog-status").dom.parentNode.style.width = "300px";
            Ext.fly("sds-login-dialog-status").dom.parentNode.style.marginTop = "-8px";
            if (this.tplConfig.useBanner) {
                Ext.get("sds-login-dialog-status-container").dom.style.marginTop = "-17px"
            }
            return false
        }
        Ext.getDom("login_submit").focus();
        this.setFormDisabled(true);
        Ext.fly("sds-login-dialog-status").update(_T("common", "msg_waiting"));
        Ext.fly("sds-login-dialog-status").dom.parentNode.style.width = "300px";
        Ext.fly("sds-login-dialog-status").dom.parentNode.style.marginTop = "-8px";
        if (this.tplConfig.useBanner) {
            Ext.get("sds-login-dialog-status-container").dom.style.marginTop = "-17px"
        }
        SYNO.API.currentManager.requestAPI("SYNO.API.Encryption", "getinfo", 1, {
            format: "module"
        }, this.onEncryptionDone, this);
        return false
    },
    onEncryptionDone: function(a, h, f) {
        var c = this.form.findField("passwd"),
            b = this.form.findField("__cIpHeRtExT"),
            e = this.form.findField("client_time"),
            d = "",
            g = {};
        if (a) {
            SYNO.Encryption.CipherKey = h.cipherkey;
            SYNO.Encryption.RSAModulus = h.public_key;
            SYNO.Encryption.CipherToken = h.ciphertoken;
            SYNO.Encryption.TimeBias = h.server_time - Math.floor(+new Date() / 1000)
        }
        g[c.getName()] = c.getValue();
        g.key = SYNO.SDS.ForgetPass.ticket;
        g[e.getName()] = e.getValue();
        g = SYNO.Encryption.EncryptParam(g);
        d = g[h.cipherkey] || "";
        b.setValue(d);
        this.initIFrameEvent();
        this.setFormDisabled(true, !!d);
        this.form.el.dom.submit()
    },
    onCallback: function() {
        var d = false,
            c;
        try {
            var b = Ext.util.JSON.decode(this.iframe.dom.contentWindow.document.body.innerHTML);
            if ("success" === b.msg) {
                d = true;
                c = _T("login", "forget_pass_change_pass_ok")
            } else {
                if ("ticket failed" === b.msg) {
                    c = _T("login", "forget_pass_msg_incorrect_ticket")
                } else {
                    c = _T("login", "forget_pass_msg_error")
                }
            }
        } catch (a) {
            c = _T("login", "forget_pass_msg_error")
        }
        Ext.fly("sds-login-dialog-status").update(c);
        if (this.tplConfig.useBanner) {
            Ext.get("sds-login-dialog-status-container").dom.style.marginTop = "-17px"
        }
        this.setFormDisabled(true);
        if (d) {
            var e = function() {
                window.location = "/"
            };
            e.defer(3000)
        }
    }
});
Ext.namespace("SYNO.SDS.LoginApplyPreviewForm");
SYNO.SDS.LoginApplyPreviewForm = Ext.extend(Ext.form.FormPanel, {
    constructor: function(a) {
        if (!Ext.isEmpty(_S) && Ext.isEmpty(_S("SynoToken"))) {
            var b = Ext.urlDecode(location.search.substring(1));
            if (Ext.isObject(b) && !Ext.isEmpty(b.SynoToken)) {
                SYNO.SDS.Session.SynoToken = b.SynoToken
            }
        }
        Ext.fly("sds-apply-preview-form").dom.removeAttribute("style");
        SYNO.SDS.LoginApplyPreviewForm.superclass.constructor.call(this, SYNO.LayoutConfig.fill(Ext.apply({
            applyTo: "sds-apply-preview-form",
            unstyled: true,
            items: [{
                synotype: "desc",
                value: _T("dsmoption", "login_apply_preview")
            }, {
                itemId: "btn_apply",
                xtype: "button",
                scope: this,
                width: 100,
                text: _T("common", "apply"),
                handler: this.onApply
            }, {
                itemId: "btn_cancel",
                xtype: "button",
                scope: this,
                width: 100,
                text: _T("common", "cancel"),
                handler: this.onCancel
            }]
        }, a)))
    },
    onApply: function() {
        this.getComponent("btn_apply").setDisabled(true);
        this.getComponent("btn_cancel").setDisabled(true);
        var a = window.location.origin;
        if (!a) {
            a = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "")
        }
        if (opener) {
            opener.postMessage({
                action: "save",
                origin: a
            }, a)
        }
        window.close()
    },
    onCancel: function() {
        window.close()
    }
});
Ext.namespace("SYNO.SDS.QuickConnect");
Ext.define("SYNO.SDS.QuickConnect.Main", {
    extend: "Ext.Component",
    DOMAIN: "QuickConnect.to",
    DOMAIN_PATTERN: /^.+[.]quickconnect[.]to$/,
    construtor: function() {
        this.callParent([{
            hidden: true
        }])
    },
    TYPES: {
        NORMAL: "NORMAL",
        DIRECT: "DIRECT",
        TUNNEL: "TUNNEL"
    },
    SUB_DOMAIN_MAPPING: {
        NORMAL: "",
        DIRECT: "/direct/",
        TUNNEL: "/tunnel/"
    },
    aliasToPortalUrl: function(a) {
        return this.generatePortalUrl(this.TYPES.NORMAL, a, this.DOMAIN)
    },
    getPortalUrl: function(c, d, b) {
        if (typeof(this.SUB_DOMAIN_MAPPING[c]) === "undefined") {
            return false
        }
        if (typeof(d) !== "function") {
            return false
        }
        if (typeof(this.callback_queue) === "undefined") {
            this.callback_queue = [];
            var a = {
                api: "SYNO.Core.QuickConnect",
                method: "get",
                version: 1,
                scope: this,
                callback: this.processReturnData
            };
            this.sendWebAPI(a)
        }
        this.callback_queue.push({
            callback: d,
            scope: b,
            type: c
        });
        return true
    },
    isInTunnel: function() {
        return this.DOMAIN_PATTERN.test(window.location.hostname.toLowerCase())
    },
    processReturnData: function(h, b, f) {
        var d = (h && typeof(b.server_alias) !== "undefined" && typeof(b.region) !== "undefined" && typeof(b.enabled) !== "undefined" && b.enabled === true);
        for (var c = 0; c < this.callback_queue.length; ++c) {
            var a = "";
            var g = this.callback_queue[c].callback;
            var j = this.callback_queue[c].scope;
            if (d) {
                var e = this.callback_queue[c].type;
                a = this.generatePortalUrl(e, b.server_alias, this.DOMAIN, b.region)
            } else {
                a = ((typeof(b.error) === "undefined" || typeof(b.error.code) === "undefined") ? "" : b.error.code)
            }
            g.apply(j, [d, a])
        }
        delete this.callback_queue
    },
    generatePortalUrl: function(d, c, f, g) {
        var a = this.SUB_DOMAIN_MAPPING[d];
        var e = d == this.TYPES.NORMAL;
        var b = e ? "http" : "https";
        if (e) {
            return b + "://" + f + "/" + c
        } else {
            return b + "://" + c + "." + g + "." + f + a
        }
    }
});
SYNO.SDS.QuickConnect.Utils = new SYNO.SDS.QuickConnect.Main();
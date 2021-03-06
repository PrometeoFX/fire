Ext.namespace("SYNO.Debug");
SYNO.Debug = function() {
    var b = false;
    var e = Ext.emptyFn;
    var h = Ext;
    var d = Ext.emptyFn;

    function a() {
        var j = "";
        for (var k = 0; k < arguments.length; ++k) {
            j += arguments[k] + " "
        }
        return j
    }

    function i() {
        try {
            e(a.apply(window, arguments))
        } catch (j) {}
    }

    function f(k) {
        try {
            e.call(h, a.apply(window, arguments))
        } catch (j) {}
    }

    function g() {
        var j = Ext.urlDecode(location.search.substr(1)).jsDebug;
        b = true;
        if (!Ext.isDefined(j)) {
            return
        }
        if (window.console) {
            e = window.console.log;
            h = window.console
        } else {
            if (window.log) {
                e = window.log;
                h = window
            }
        }
        if (Ext.isIE) {
            d = i
        } else {
            d = f
        }
    }
    if (!b) {
        g()
    }
    try {
        e.apply(h, arguments)
    } catch (c) {
        d.apply(window, arguments)
    }
};
SYNO.SDS.UIFeatures = function() {
    var b = {
        previewBox: (!Ext.isIE || Ext.isModernIE),
        expandMenuHideAll: true,
        windowGhost: !Ext.isIE || Ext.isModernIE,
        disableWindowShadow: Ext.isIE && !Ext.isModernIE,
        exposeWindow: (!Ext.isIE || Ext.isIE10p),
        msPointerEnabled: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0,
        isTouch: ("ontouchstart" in window) || (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0),
        isRetina: function() {
            var d = false;
            var c = "(-webkit-min-device-pixel-ratio: 1.5),(min--moz-device-pixel-ratio: 1.5),(-o-min-device-pixel-ratio: 3/2),(min-resolution: 1.5dppx)";
            if (window.devicePixelRatio >= 1.5) {
                d = true
            }
            if (window.matchMedia && window.matchMedia(c).matches) {
                d = true
            }
            return d
        }()
    };
    var a = Ext.urlDecode(location.search.substr(1));
    Ext.iterate(a, function(c) {
        var d = a[c];
        if (Ext.isDefined(b[c])) {
            b[c] = (d === "false") ? false : true
        }
    });
    return {
        test: function(c) {
            return !!b[c]
        },
        listAll: function() {
            var c = "== Feature List ==\n";
            Ext.iterate(b, function(d) {
                c += String.format("{0}: {1}\n", d, b[d])
            });
            SYNO.Debug(c)
        }
    }
}();
Ext.define("SYNO.SDS.UIFeatures.IconSizeManager", {
    statics: {
        PortalIcon: 96,
        GroupView: 24,
        Taskbar: 32,
        GroupViewHover: 48,
        Desktop: 64,
        ClassicalDesktop: 48,
        AppView: 72,
        AppViewClassic: 48,
        Header: 24,
        HeaderV4: 16,
        TreeIcon: 16,
        StandaloneHeader: 24,
        FavHeader: 16,
        isEnableHDPack: false,
        cls: "synohdpack",
        debugCls: "synohdpackdebug",
        getIconPath: function(e, f) {
            var j, b, d = "/webman/",
                c = "/synohdpack/images/dsm/";
            var g = this.getRetinaAndSynohdpackStatus();
            var i = function(l, n, m, k) {
                return l.replace(n, n * 2)
            };
            var a = function(l, n, m, k) {
                return l.replace(n, (n === "48") ? "128" : n * 2)
            };
            if (0 === e.indexOf("3rdparty/")) {
                var h = String.format("/webman/synohdpack.cgi?method={0}&res={1}&retina={2}&path={3}", "getHDIcon", this.getRes(f), g, "webman/") + e;
                return h
            }
            if (g) {
                if (0 === e.indexOf(d)) {
                    b = c + e.substr(d.length)
                } else {
                    b = c + e
                }
            } else {
                b = e
            }
            switch (f) {
                case "Taskbar":
                    j = String.format(b, g ? this.Taskbar * 2 : this.Taskbar);
                    break;
                case "Desktop":
                    if (-1 != b.indexOf("files_ext_48")) {
                        b = b.replace("files_ext_48", "files_ext_64")
                    }
                    if (-1 != b.indexOf("files_ext_")) {
                        j = g ? b.replace(/.*\/files_ext_(\d+)\/.*/, i) : b
                    } else {
                        if (-1 != b.indexOf("shortcut_icons")) {
                            j = g ? b.replace(/.*\/.*_(\d+)\.png$/, a) : b
                        } else {
                            j = String.format(b, g ? this.Desktop * 2 : this.Desktop)
                        }
                    }
                    break;
                case "ClassicalDesktop":
                    if (-1 != b.indexOf("files_ext_")) {
                        j = g ? b.replace(/.*\/files_ext_(\d+)\/.*/, i) : b
                    } else {
                        if (-1 != b.indexOf("shortcut_icons")) {
                            j = g ? b.replace(/.*\/.*_(\d+)\.png$/, a) : b
                        } else {
                            j = String.format(b, g ? 256 : this.ClassicalDesktop)
                        }
                    }
                    break;
                case "AppView":
                    j = String.format(b, g ? this.AppView * 2 : this.AppView);
                    break;
                case "AppViewClassic":
                    j = String.format(b, g ? 256 : this.AppViewClassic);
                    break;
                case "Header":
                    j = String.format(b, g ? this.Header * 2 : this.Header);
                    break;
                case "HeaderV4":
                    j = String.format(b, g ? this.HeaderV4 * 2 : this.HeaderV4);
                    break;
                case "StandaloneHeader":
                    j = String.format(b, g ? this.StandaloneHeader * 2 : this.StandaloneHeader);
                    break;
                case "FavHeader":
                    j = String.format(b, g ? this.FavHeader * 2 : this.FavHeader);
                    break;
                case "FileType":
                    j = (g) ? b.replace(/.*\/files_ext_(\d+)\/.*/, i) : b;
                    break;
                case "PortalIcon":
                    j = String.format(b, g ? this.PortalIcon * 2 : this.PortalIcon);
                    break;
                case "TreeIcon":
                    j = String.format(b, g ? this.TreeIcon * 3 : this.TreeIcon);
                    break;
                default:
                    j = b;
                    break
            }
            if (-1 == j.indexOf(String.format("?v={0}", _S("fullversion"))) && ".png" === j.substr(j.length - 4)) {
                j += "?v=" + _S("fullversion")
            }
            j = encodeURI(j);
            return j
        },
        enableHDDisplay: function(a) {
            SYNO.SDS.UIFeatures.IconSizeManager.isEnableHDPack = a
        },
        getRetinaAndSynohdpackStatus: function() {
            return SYNO.SDS.UIFeatures.test("isRetina") && (this.isEnableHDPack || SYNO.SDS.Session.SynohdpackStatus)
        },
        addHDClsAndCSS: function(a) {
            if (a && SYNO.SDS.UIFeatures.test("isRetina")) {
                Ext.get(document.documentElement).addClass(this.cls)
            }
        },
        enableRetinaDisplay: function() {
            Ext.get(document.documentElement).removeClass(this.debugCls);
            Ext.get(document.documentElement).addClass(this.cls);
            SYNO.SDS.UIFeatures.IconSizeManager.isEnableHDPack = true
        },
        enableRetinaDebugMode: function() {
            Ext.get(document.documentElement).removeClass(this.cls);
            Ext.get(document.documentElement).addClass(this.debugCls);
            SYNO.SDS.UIFeatures.IconSizeManager.isEnableHDPack = true
        },
        disableRetinaDisplay: function() {
            Ext.get(document.documentElement).removeClass(this.cls);
            Ext.get(document.documentElement).removeClass(this.debugCls);
            SYNO.SDS.UIFeatures.IconSizeManager.isEnableHDPack = false
        },
        getRes: function(b) {
            switch (b) {
                case "Taskbar":
                    return this.Taskbar;
                case "Desktop":
                    return this.Desktop;
                case "ClassicalDesktop":
                    return this.ClassicalDesktop;
                case "AppView":
                    var a = SYNO.SDS.UserSettings.getProperty("Desktop", "appMenuStyle");
                    if (a === "classical") {
                        return this.AppViewClassic
                    }
                    return this.AppView;
                case "Header":
                    return this.Header;
                case "HeaderV4":
                    return this.HeaderV4;
                case "StandaloneHeader":
                    return this.StandaloneHeader;
                case "FileType":
                    return this.FileType;
                case "PortalIcon":
                    return this.PortalIcon;
                case "TreeIcon":
                    return this.TreeIcon;
                case "FavHeader":
                    return this.FavHeader;
                default:
                    return -1
            }
        }
    }
});
Ext.namespace("SYNO.SDS._StatusNotifier");
SYNO.SDS._StatusNotifier = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        this.addEvents("beforeunload");
        SYNO.SDS._StatusNotifier.superclass.constructor.apply(this, arguments)
    },
    isAppEnabled: function(a) {
        if (this.isSupportedApp(a) !== true) {
            return false
        }
        if (!SYNO.SDS.StatusNotifier.isAppHasPrivilege(a)) {
            return false
        }
        if (!SYNO.SDS.StatusNotifier.isServiceEnabled(a)) {
            return false
        }
        return true
    },
    isSupportedApp: function(e) {
        var d = SYNO.SDS.Config.FnMap[e],
            b, f, c = true,
            a;
        if (!d || !Ext.isDefined(d.config)) {
            return false
        }
        b = d.config;
        if (b.type !== "app" || !Ext.isDefined(b.supportKey)) {
            return true
        }
        f = Ext.isArray(b.supportKey) ? b.supportKey : [b.supportKey];
        Ext.each(f, function(g) {
            a = (Ext.isDefined(g.value) ? (_D(g.key) === g.value) : !Ext.isEmpty(_D(g.key)));
            if (Ext.isDefined(g.cond) && (g.cond === "or")) {
                c = c || a
            } else {
                c = c && a
            }
        }, this);
        return c
    },
    isAppHasPrivilege: function(c) {
        var a, b = SYNO.SDS.Config.FnMap[c];
        if (Ext.isDefined(SYNO.SDS.AppPrivilege[c]) && true !== SYNO.SDS.AppPrivilege[c]) {
            return false
        }
        if (!b) {
            return false
        }
        a = b.config.grantPrivilege;
        if ("all" === a || ("false" === _S("domainUser") && "local" === a) || ("true" === _S("domainUser") && "domain" === a)) {
            return "admin" === _S("user") || SYNO.SDS.AppPrivilege[c]
        }
        if (true !== _S("is_admin") && true !== b.config.allUsers) {
            return false
        }
        if (("local" === a && "true" === _S("domainUser")) || ("domain" === a && "false" === _S("domainUser"))) {
            return false
        }
        return true
    },
    isServiceEnabled: function(a) {
        if (Ext.isDefined(SYNO.SDS.ServiceStatus[a]) && true !== SYNO.SDS.ServiceStatus[a]) {
            return false
        }
        return true
    },
    setServiceDisabled: function(b, a) {
        if ((!a) !== !!SYNO.SDS.ServiceStatus[b]) {
            SYNO.SDS.ServiceStatus[b] = !a;
            this.fireEvent("servicechanged", b, !a)
        }
    },
    setAppPrivilege: function(b, a) {
        if ((!!a) !== !!SYNO.SDS.AppPrivilege[b]) {
            SYNO.SDS.AppPrivilege[b] = !!a;
            this.fireEvent("appprivilegechanged", b, !!a)
        }
    }
});
Ext.namespace("SYNO.SDS._UserSettings");
SYNO.SDS._UserSettings = Ext.extend(Ext.Component, {
    data: null,
    ajaxTask: null,
    delayedTask: null,
    modified: null,
    cgi: "usersettings.cgi",
    constructor: function() {
        SYNO.SDS._UserSettings.superclass.constructor.apply(this, arguments);
        this.data = SYNO.SDS.initUserSettings || {};
        this.delayedTask = new Ext.util.DelayedTask(this.save, this);
        if (SYNO.SDS.StatusNotifier) {
            this.mon(SYNO.SDS.StatusNotifier, "logout", this.syncSave, this);
            this.mon(SYNO.SDS.StatusNotifier, "halt", this.saveAndUnload, this);
            this.mon(SYNO.SDS.StatusNotifier, "redirect", this.saveAndUnload, this)
        }
        this.registerUnloadEvent()
    },
    getUnloadEventName: function() {
        var c = ("onpagehide" in window),
            b = ("onbeforeunload" in window),
            a = "";
        if (b) {
            a = "beforeunload"
        } else {
            if (c) {
                a = "pagehide"
            } else {
                a = null
            }
        }
        return a
    },
    registerUnloadEvent: function() {
        var a = this.getUnloadEventName();
        if (a) {
            Ext.EventManager.on(window, a, this.syncSave, this)
        }
    },
    unregisterUnloadEvent: function() {
        var a = this.getUnloadEventName();
        if (a) {
            Ext.EventManager.un(window, a, this.syncSave, this)
        }
    },
    saveAndUnload: function() {
        this.syncSave();
        this.unregisterUnloadEvent()
    },
    syncSave: function(b) {
        if (SYNO.SDS.StatusNotifier) {
            SYNO.SDS.StatusNotifier.fireEvent("beforeUserSettingsUnload")
        }
        if (!this.modified || _S("demo_mode")) {
            return
        }
        if (this.ajaxTask) {
            this.ajaxTask.remove()
        }
        var a;
        a = new Ajax.Request(this.cgi, {
            asynchronous: false,
            requestTimeout: 10,
            method: "POST",
            parameters: {
                action: "apply",
                data: Ext.encode(this.modified)
            },
            onSuccess: function() {
                this.modified = null
            }.createDelegate(this)
        })
    },
    load: function() {
        this.addAjaxTask({
            interval: 3000,
            single: true,
            autoDecodeJson: true,
            url: this.cgi,
            method: "POST",
            params: {
                action: "load"
            }
        }).start()
    },
    save: function() {
        if (!this.modified || _S("demo_mode")) {
            return
        }
        if (this.ajaxTask) {
            this.ajaxTask.remove()
        }
        this.ajaxTask = this.addAjaxTask({
            interval: 3000,
            single: true,
            autoDecodeJson: true,
            url: this.cgi,
            method: "POST",
            params: {
                action: "apply",
                data: Ext.encode(this.modified)
            },
            scope: this,
            success: this.onSaveSuccess
        }).start()
    },
    onSaveSuccess: function() {
        this.modified = null
    },
    getProperty: function(c, a) {
        try {
            return this.data[c][a]
        } catch (b) {
            return null
        }
    },
    setProperty: function(c, a, b) {
        this.modified = this.modified || {};
        if (typeof b === "undefined" || b === null) {
            return this.removeProperty(c, a)
        }
        if (!Ext.isObject(this.data[c])) {
            this.data[c] = {}
        }
        this.data[c][a] = b;
        this.modified[c] = this.data[c];
        this.delayedTask.delay(3000)
    },
    removeProperty: function(b, a) {
        if (!this.data[b]) {
            return
        }
        this.modified = this.modified || {};
        this.modified[b] = this.data[b];
        delete this.data[b][a];
        this.delayedTask.delay(3000)
    }
});
SYNO.SDS.UserSettingsProvider = Ext.extend(Ext.state.Provider, {
    constructor: function() {
        SYNO.SDS.UserSettingsProvider.superclass.constructor.apply(this, arguments)
    },
    set: function(a, b) {
        if (typeof b == "undefined" || b === null) {
            this.clear(a);
            return
        }
        SYNO.SDS.UserSettingsProvider.superclass.set.call(this, a, b);
        SYNO.SDS.UserSettings.setProperty("desktop", "stateProvider", this.state)
    },
    clear: function(a) {
        SYNO.SDS.UserSettingsProvider.superclass.clear.call(this, a);
        SYNO.SDS.UserSettings.setProperty("desktop", "stateProvider", this.state)
    }
});
Ext.namespace("SYNO.SDS._GroupSettings");
SYNO.SDS._GroupSettings = Ext.extend(SYNO.SDS._UserSettings, {
    cgi: "groupsettings.cgi",
    admingrpsetmtime: 0,
    constructor: function() {
        SYNO.SDS._UserSettings.superclass.constructor.apply(this, arguments);
        this.data = SYNO.SDS.initGroupSettings || {};
        this.delayedTask = new Ext.util.DelayedTask(this.save, this);
        if (SYNO.SDS.StatusNotifier) {
            this.mon(SYNO.SDS.StatusNotifier, "logout", this.syncSave, this)
        }
        Ext.EventManager.on(window, "beforeunload", this.syncSave, this)
    },
    onSaveSuccess: function(b, a) {
        SYNO.SDS._GroupSettings.superclass.constructor.apply(this, arguments);
        if (b.success && b.admingrpsetmtime) {
            this.admingrpsetmtime = b.admingrpsetmtime
        }
    },
    load: function() {
        this.addAjaxTask({
            single: true,
            autoJsonDecode: true,
            url: this.cgi,
            method: "POST",
            params: {
                action: "load"
            },
            scope: this,
            success: this.loadSuccess
        }).start(true)
    },
    loadSuccess: function(a, b) {
        if (!a.success) {
            return
        }
        this.data = a.data || {};
        this.admingrpsetmtime = a.admingrpsetmtime || 0;
        SYNO.SDS.StatusNotifier.fireEvent("syncGroupSettings")
    },
    reload: function(a) {
        if (_S("is_admin") && (a !== this.admingrpsetmtime)) {
            this.admingrpsetmtime = a || 0;
            this.load()
        }
    }
});
Ext.namespace("SYNO.SDS.TaskRunner");
SYNO.SDS._TaskMgr = function(n) {
    var e = n || 10,
        h = [],
        a = [],
        d = 0,
        i = false,
        l = false,
        j = function(o, q) {
            var p;
            while (q !== 0) {
                p = o % q;
                o = q;
                q = p
            }
            return o
        },
        g = function() {
            var p, o, q = h[0].interval;
            for (p = 1;
                (o = h[p]); p++) {
                q = j(q, o.interval)
            }
            return Math.max(q, n)
        },
        f = function() {
            var o = g();
            if (o !== e) {
                e = o;
                return true
            }
            return false
        },
        c = function() {
            i = false;
            clearTimeout(d);
            d = 0
        },
        k = function() {
            if (!i) {
                i = true;
                f();
                d = setTimeout(m, 0)
            }
        },
        b = function(o) {
            a.push(o);
            if (o.onStop) {
                o.onStop.apply(o.scope || o)
            }
        },
        m = function() {
            var u, s, r, o, p, w = false,
                q = new Date().getTime();
            for (u = 0;
                (s = a[u]); u++) {
                h.remove(s);
                w = true
            }
            a = [];
            if (!h.length) {
                c();
                return
            }
            for (u = 0;
                (s = h[u]); ++u) {
                s = h[u];
                if (l && s.preventHalt !== true) {
                    b(s);
                    continue
                }
                o = q - s.taskRunTime;
                if (s.interval <= o) {
                    try {
                        p = s.run.apply(s.scope || s, s.args || [++s.taskRunCount])
                    } catch (v) {
                        if (!Ext.isIE) {
                            SYNO.Debug("TaskRunner: task " + s.id + " exception: " + v);
                            if (Ext.isDefined(SYNO.SDS.JSDebug)) {
                                s.taskRunTime = q;
                                throw v
                            }
                        }
                    }
                    s.taskRunTime = q;
                    r = s.interval;
                    s.interval = s.adaptiveInterval();
                    if (r !== s.interval) {
                        w = true
                    }
                    if (p === false || s.taskRunCount === s.repeat) {
                        b(s);
                        return
                    }
                }
                if (s.duration && s.duration <= (q - s.taskStartTime)) {
                    b(s)
                }
            }
            if (w) {
                f()
            }
            d = setTimeout(m, e)
        };
    this.start = function(p, o) {
        var q = new Date().getTime();
        h.push(p);
        p.taskStartTime = q;
        p.taskRunTime = (false === o) ? q : 0;
        p.taskRunCount = 0;
        if (!i) {
            k()
        } else {
            f();
            clearTimeout(d);
            d = setTimeout(m, 0)
        }
        return p
    };
    this.stop = function(o) {
        b(o);
        return o
    };
    this.stopAll = function() {
        var p, o;
        c();
        for (p = 0;
            (o = h[p]); p++) {
            if (o.onStop) {
                o.onStop()
            }
        }
        h = [];
        a = []
    };
    this.setHalt = function(o) {
        l = o
    }
};
SYNO.SDS.TaskMgr = new SYNO.SDS._TaskMgr(100);
SYNO.SDS.TaskRunner = Ext.extend(Ext.util.Observable, {
    tasks: null,
    constructor: function() {
        SYNO.SDS.TaskRunner.superclass.constructor.apply(this, arguments);
        this.addEvents("add", "remove", "beforestart");
        this.tasks = {}
    },
    destroy: function() {
        this.stopAll();
        this.tasks = {};
        this.isDestroyed = true
    },
    start: function(b, a) {
        if (this.isDestroyed) {
            return
        }
        if (!b.running) {
            this.fireEvent("beforestart", b);
            SYNO.SDS.TaskMgr.start(b, a)
        }
        b.running = true;
        return b
    },
    stop: function(a) {
        if (a.running) {
            SYNO.SDS.TaskMgr.stop(a)
        }
        a.running = false;
        return a
    },
    stopAll: function() {
        for (var a in this.tasks) {
            if (this.tasks.hasOwnProperty(a)) {
                if (!this.tasks[a].running) {
                    continue
                }
                SYNO.SDS.TaskMgr.stop(this.tasks[a])
            }
        }
    },
    addTask: function(a) {
        a.id = a.id || Ext.id();
        this.tasks[a.id] = a;
        this.fireEvent("add", a);
        return a
    },
    createTask: function(b) {
        b.id = b.id || Ext.id();
        var a = this.tasks[b.id];
        if (a) {
            a.apply(b)
        } else {
            a = new SYNO.SDS.TaskRunner.Task(b, this);
            this.addTask(a)
        }
        return a
    },
    createAjaxTask: function(b) {
        b.id = b.id || Ext.id();
        var a = this.tasks[b.id];
        if (a) {
            a.apply(b)
        } else {
            a = new SYNO.SDS.TaskRunner.AjaxTask(b, this);
            this.addTask(a)
        }
        return a
    },
    createWebAPITask: function(b) {
        b.id = b.id || Ext.id();
        var a = this.tasks[b.id];
        if (a) {
            a.apply(b)
        } else {
            a = new SYNO.SDS.TaskRunner.WebAPITask(b, this);
            this.addTask(a)
        }
        return a
    },
    removeTask: function(b) {
        var a = this.tasks[b];
        if (a) {
            this.fireEvent("remove", a);
            delete this.tasks[b]
        }
    },
    getTask: function(a) {
        return this.tasks[a] || null
    }
});
SYNO.SDS.TaskRunner.Task = Ext.extend(Ext.util.Observable, {
    INTERVAL_DEFAULT: 60000,
    INTERVAL_FALLBACK: 60000,
    manager: null,
    running: false,
    removed: false,
    taskFirstRunTime: 0,
    constructor: function(a, b) {
        SYNO.SDS.TaskRunner.Task.superclass.constructor.apply(this, arguments);
        this.manager = b;
        this.apply(a)
    },
    apply: function(a) {
        this.applyInterval(a.interval);
        delete a.interval;
        this.applyConfig(a)
    },
    applyConfig: function(a) {
        Ext.apply(this, a)
    },
    applyInterval: function(a) {
        this.intervalData = a;
        if (!Ext.isFunction(this.intervalData) && !Ext.isArray(this.intervalData) && !Ext.isNumber(this.intervalData)) {
            this.intervalData = this.INTERVAL_DEFAULT
        }
        this.interval = this.adaptiveInterval()
    },
    adaptiveInterval: function() {
        var c, b = 0,
            d = this.intervalData,
            a = null;
        if (this.taskFirstRunTime) {
            b = new Date().getTime() - this.taskFirstRunTime
        }
        if (Ext.isNumber(d)) {
            a = d
        } else {
            if (Ext.isFunction(d)) {
                a = d.call(this.scope || this, b)
            } else {
                if (Ext.isArray(d)) {
                    for (c = 0; c < d.length; ++c) {
                        if (d[c].time > b) {
                            break
                        }
                        a = d[c].interval
                    }
                }
            }
        }
        if (!Ext.isNumber(a)) {
            SYNO.Debug("TaskRunner: Task " + this.id + " interval fallback to " + this.INTERVAL_FALLBACK);
            a = this.INTERVAL_FALLBACK
        }
        return a
    },
    start: function(a) {
        var b = new Date().getTime();
        if (this.removed) {
            return
        }
        if (!this.taskFirstRunTime) {
            this.taskFirstRunTime = (false === a) ? b + this.interval : b
        }
        return this.manager.start(this, a)
    },
    stop: function() {
        if (this.removed) {
            return
        }
        return this.manager.stop(this)
    },
    restart: function(a) {
        this.stop();
        this.start(a)
    },
    remove: function() {
        this.stop();
        this.manager.removeTask(this.id);
        this.removed = true
    }
});
SYNO.SDS.TaskRunner.AjaxTask = Ext.extend(SYNO.SDS.TaskRunner.Task, {
    constructor: function(a, b) {
        this.reqId = null;
        this.reqConfig = null;
        this.cbHandler = null;
        this.autoJsonDecode = false;
        this.single = false;
        SYNO.SDS.TaskRunner.AjaxTask.superclass.constructor.call(this, a, b)
    },
    applyConfig: function(a) {
        Ext.apply(this, {
            run: this.run,
            scope: this
        });
        this.autoJsonDecode = (true === a.autoJsonDecode);
        this.single = (true === a.single);
        this.preventHalt = (true === a.preventHalt);
        this.cbHandler = {};
        this.reqConfig = {};
        Ext.copyTo(this.cbHandler, a, ["scope", "callback", "success", "failure"]);
        Ext.apply(this.reqConfig, a);
        Ext.apply(this.reqConfig, {
            success: null,
            failure: null,
            callback: this.onCallback,
            scope: this
        });
        Ext.applyIf(this.reqConfig, {
            method: "GET"
        });
        delete this.reqConfig.id;
        delete this.reqConfig.autoJsonDecode;
        delete this.reqConfig.single
    },
    stop: function() {
        if (this.reqId) {
            Ext.Ajax.abort(this.reqId);
            this.reqId = null
        }
        SYNO.SDS.TaskRunner.AjaxTask.superclass.stop.apply(this, arguments)
    },
    run: function() {
        if (!this.reqConfig.url) {
            this.remove();
            return
        }
        SYNO.SDS.TaskRunner.AjaxTask.superclass.stop.call(this);
        this.reqId = Ext.Ajax.request(this.reqConfig)
    },
    onCallback: function(d, g, b) {
        var a = b,
            c = Ext.apply({}, d);
        Ext.apply(c, {
            scope: this.cbHandler.scope,
            callback: this.cbHandler.callback,
            success: this.cbHandler.success,
            failure: this.cbHandler.failure
        });
        if (g && this.autoJsonDecode) {
            try {
                a = Ext.util.JSON.decode(b.responseText)
            } catch (f) {
                a = {
                    success: false
                };
                g = false
            }
        }
        if (g && c.success) {
            c.success.call(c.scope, a, d)
        } else {
            if (!g && c.failure) {
                c.failure.call(c.scope, a, d)
            }
        }
        if (c.callback) {
            c.callback.call(c.scope, d, g, a)
        }
        this.fireEvent("callback", d, g, a);
        if (g && this.single) {
            this.reqId = null;
            this.remove()
        } else {
            if (this.reqId) {
                this.reqId = null;
                this.start(false)
            }
        }
    }
});
SYNO.SDS.TaskRunner.WebAPITask = Ext.extend(SYNO.SDS.TaskRunner.AjaxTask, {
    constructor: function(a, b) {
        SYNO.SDS.TaskRunner.WebAPITask.superclass.constructor.call(this, a, b)
    },
    applyConfig: function(a) {
        Ext.apply(this, {
            run: this.run,
            scope: this
        });
        this.single = (true === a.single);
        this.preventHalt = (true === a.preventHalt);
        this.cbHandler = {};
        this.reqConfig = {};
        Ext.copyTo(this.cbHandler, a, ["callback", "scope"]);
        Ext.apply(this.reqConfig, a);
        Ext.apply(this.reqConfig, {
            callback: this.onCallback,
            scope: this
        });
        delete this.reqConfig.id;
        delete this.reqConfig.single
    },
    run: function() {
        SYNO.SDS.TaskRunner.AjaxTask.superclass.stop.call(this);
        this.reqId = SYNO.API.Request(this.reqConfig)
    },
    onCallback: function(e, c, d, b) {
        var a = Ext.apply({}, b);
        Ext.apply(a, {
            scope: this.cbHandler.scope,
            callback: this.cbHandler.callback
        });
        if (a.callback) {
            a.callback.call(a.scope, e, c, d, a)
        }
        this.fireEvent("callback", e, c, d, a);
        if (this.single) {
            this.reqId = null;
            this.remove()
        } else {
            if (this.reqId) {
                this.reqId = null;
                this.start(false)
            }
        }
    }
});
Ext.namespace("SYNO.SDS.BackgroundTaskMgr");
SYNO.SDS._BackgroundTaskMgr = Ext.extend(Ext.util.Observable, {
    taskRunner: null,
    tasks: null,
    taskName: "BackgroundTask",
    settings: "SYNO.SDS.UserSettings",
    constructor: function() {
        SYNO.SDS._BackgroundTaskMgr.superclass.constructor.apply(this, arguments);
        this.addEvents("add", "remove", "progress");
        this.taskRunner = new SYNO.SDS.TaskRunner();
        this.tasks = {};
        this.taskRunner.on("remove", this.onTaskRunnerRemove, this);
        this.loadUserSettings()
    },
    loadUserSettings: function() {
        var b = Ext.getClassByName(this.settings);
        var d, c = b.getProperty(this.taskName, "tasks");
        for (d in c) {
            if (c.hasOwnProperty(d)) {
                var a = c[d];
                if (!a) {
                    this.removeTask(d);
                    return
                } else {
                    if (a.query && a.query.api) {
                        this.addWebAPITask(c[d])
                    } else {
                        this.addTask(c[d])
                    }
                }
            }
        }
    },
    addTask: function(b) {
        b.id = b.id || Ext.id();
        this.tasks[b.id] = SYNO.Util.copy(Ext.copyTo({}, b, "id,title,query,cancel,options"));
        var a = new SYNO.SDS._BackgroundTaskMgr.Task(b, this.taskRunner);
        a.id = b.id;
        a.addCallback(this.onTaskProgress, this);
        this.taskRunner.addTask(a).start();
        this.fireEvent("add", a);
        var c = Ext.getClassByName(this.settings);
        c.setProperty(this.taskName, "tasks", this.tasks);
        return a
    },
    addWebAPITask: function(b) {
        b.id = b.id || Ext.id();
        this.tasks[b.id] = SYNO.Util.copy(Ext.copyTo({}, b, "id,title,query,cancel,options"));
        var a = new SYNO.SDS._BackgroundTaskMgr.WebAPITask(b, this.taskRunner);
        a.id = b.id;
        a.addCallback(this.onTaskProgress, this);
        this.taskRunner.addTask(a).start();
        this.fireEvent("add", a);
        var c = Ext.getClassByName(this.settings);
        c.setProperty(this.taskName, "tasks", this.tasks);
        return a
    },
    getTask: function(a) {
        return this.taskRunner.getTask(a)
    },
    removeTask: function(b) {
        var a = this.getTask(b);
        if (a) {
            a.remove()
        }
        this.fireEvent("remove", a)
    },
    onTaskRunnerRemove: function(a) {
        delete this.tasks[a.id];
        var b = Ext.getClassByName(this.settings);
        b.setProperty(this.taskName, "tasks", this.tasks)
    },
    onTaskProgress: function(a, d, e, b, c) {
        this.fireEvent("progress", a, d, e, b, c)
    }
});
SYNO.SDS._BackgroundTaskMgr.Task = Ext.extend(SYNO.SDS.TaskRunner.AjaxTask, {
    INTERVAL_DEFAULT: [{
        time: 0,
        interval: 3000
    }, {
        time: 6000,
        interval: 5000
    }, {
        time: 60000,
        interval: 6000
    }, {
        time: 120000,
        interval: 7000
    }, {
        time: 300000,
        interval: 10000
    }],
    constructor: function(a, b) {
        this.addEvents("progress");
        SYNO.SDS._BackgroundTaskMgr.Task.superclass.constructor.apply(this, arguments)
    },
    applyConfig: function(a) {
        this.ajaxTaskConfig = {};
        Ext.copyTo(this.ajaxTaskConfig, a.query, "method,url,params");
        Ext.apply(this.ajaxTaskConfig, {
            autoJsonDecode: true,
            success: this.onQuerySuccess,
            scope: this
        });
        if (a.cancel) {
            this.cancelAjaxConfig = {};
            Ext.copyTo(this.cancelAjaxConfig, a.cancel, "method,url,params");
            Ext.apply(this.cancelAjaxConfig, {
                autoJsonDecode: true,
                success: this.onCancelSuccess,
                scope: this
            })
        }
        Ext.copyTo(this, a, "title,desc");
        SYNO.SDS._BackgroundTaskMgr.Task.superclass.applyConfig.call(this, this.ajaxTaskConfig)
    },
    cancel: function() {
        if (!this.cancelAjaxConfig) {
            this.onCancelSuccess();
            return
        }
        this.stop();
        SYNO.SDS._BackgroundTaskMgr.Task.superclass.applyConfig.call(this, this.cancelAjaxConfig);
        this.start()
    },
    restart: function() {
        SYNO.SDS._BackgroundTaskMgr.Task.superclass.applyConfig.call(this, this.ajaxTaskConfig);
        SYNO.SDS._BackgroundTaskMgr.Task.superclass.restart.apply(this, arguments)
    },
    remove: function() {
        this.purgeListeners();
        SYNO.SDS._BackgroundTaskMgr.Task.superclass.remove.apply(this, arguments)
    },
    addCallback: function(b, a) {
        this.on("progress", b, a)
    },
    removeCallback: function(b, a) {
        this.un("progress", b, a)
    },
    onQuerySuccess: function(b, a) {
        if (b.success) {
            this.fireEvent("progress", this, "query", b.finished, b.progress, b.data, a.params, a)
        }
        if (!b.success || b.finished) {
            if (SYNO.SDS.StatusNotifier) {
                SYNO.SDS.StatusNotifier.fireEvent("checknotify")
            }
            this.remove()
        }
    },
    onCancelSuccess: function(b, a) {
        if (SYNO.SDS.StatusNotifier) {
            SYNO.SDS.StatusNotifier.fireEvent("checknotify")
        }
        if (false !== this.fireEvent("progress", this, "cancel", null, null, b.data || b, a.params, a)) {
            this.remove()
        }
    }
});
SYNO.SDS._GroupSettingBackgroundTaskMgr = Ext.extend(SYNO.SDS._BackgroundTaskMgr, {
    taskName: "GroupBackgroundTask",
    settings: "SYNO.SDS.GroupSettings",
    constructor: function() {
        SYNO.SDS._GroupSettingBackgroundTaskMgr.superclass.constructor.apply(this, arguments);
        SYNO.SDS.StatusNotifier.on("syncGroupSettings", this.syncGroupSettings, this)
    },
    syncGroupSettings: function() {
        this.loadGroupSettings()
    },
    loadGroupSettings: function() {
        var a = Ext.getClassByName(this.settings);
        var c, b = a.getProperty(this.taskName, "tasks");
        for (c in b) {
            if (!this.getTask(b[c])) {
                this.addTask(b[c])
            }
        }
    }
});
SYNO.SDS._MailBackgroundTaskMgr = Ext.extend(SYNO.SDS._BackgroundTaskMgr, {
    taskName: "MailTask",
    settings: "SYNO.SDS.UserSettings",
    addWebAPITask: function(b) {
        b.id = b.id || Ext.id();
        this.tasks[b.id] = SYNO.Util.copy(Ext.copyTo({}, b, "id,title,query,cancel,options"));
        var a = new SYNO.SDS._BackgroundTaskMgr.WebAPITask(b, this.taskRunner);
        a.id = b.id;
        a.sender = b.sender;
        a.reciever = b.reciever;
        a.subject = b.subject;
        a.addCallback(this.onTaskProgress, this);
        this.taskRunner.addTask(a).start();
        this.fireEvent("add", a);
        var c = Ext.getClassByName(this.settings);
        c.setProperty(this.taskName, "tasks", this.tasks);
        return a
    }
});
SYNO.SDS._PackageBackgroundTaskMgr = Ext.extend(SYNO.SDS._GroupSettingBackgroundTaskMgr, {
    taskName: "PackageTask",
    settings: "SYNO.SDS.GroupSettings"
});
SYNO.SDS._BackgroundTaskMgr.WebAPITask = Ext.extend(SYNO.SDS.TaskRunner.WebAPITask, {
    INTERVAL_DEFAULT: SYNO.SDS._BackgroundTaskMgr.Task.prototype.INTERVAL_DEFAULT,
    constructor: function(a, b) {
        this.addEvents("progress");
        SYNO.SDS._BackgroundTaskMgr.WebAPITask.superclass.constructor.apply(this, arguments)
    },
    applyConfig: function(a) {
        this.ajaxTaskConfig = {};
        Ext.copyTo(this.ajaxTaskConfig, a.query, "api,method,version,url,params");
        Ext.apply(this.ajaxTaskConfig, {
            callback: this.onQuerySuccess,
            scope: this
        });
        if (a.cancel) {
            this.cancelAjaxConfig = {};
            Ext.copyTo(this.cancelAjaxConfig, a.cancel, "api,method,version,url,params");
            Ext.apply(this.cancelAjaxConfig, {
                callback: this.onCancelSuccess,
                scope: this
            })
        }
        Ext.copyTo(this, a, "title,desc");
        SYNO.SDS._BackgroundTaskMgr.WebAPITask.superclass.applyConfig.call(this, this.ajaxTaskConfig)
    },
    cancel: function() {
        if (!this.cancelAjaxConfig) {
            this.onCancelSuccess();
            return
        }
        this.stop();
        SYNO.SDS._BackgroundTaskMgr.WebAPITask.superclass.applyConfig.call(this, this.cancelAjaxConfig);
        this.start()
    },
    restart: function() {
        SYNO.SDS._BackgroundTaskMgr.WebAPITask.superclass.applyConfig.call(this, this.ajaxTaskConfig);
        SYNO.SDS._BackgroundTaskMgr.WebAPITask.superclass.restart.apply(this, arguments)
    },
    remove: function() {
        this.purgeListeners();
        SYNO.SDS._BackgroundTaskMgr.WebAPITask.superclass.remove.apply(this, arguments)
    },
    addCallback: function(b, a) {
        this.on("progress", b, a)
    },
    removeCallback: function(b, a) {
        this.un("progress", b, a)
    },
    onQuerySuccess: function(d, b, c, a) {
        if (d) {
            this.fireEvent("progress", this, "query", b.finished, b.progress, b, c, a)
        } else {
            this.fireEvent("progress", this, "fail", null, null, b, c, a)
        }
        if (!d || b.finished) {
            if (SYNO.SDS.StatusNotifier) {
                SYNO.SDS.StatusNotifier.fireEvent("checknotify")
            }
            this.remove()
        }
    },
    onCancelSuccess: function(d, b, c, a) {
        if (SYNO.SDS.StatusNotifier) {
            SYNO.SDS.StatusNotifier.fireEvent("checknotify")
        }
        if (false !== this.fireEvent("progress", this, "cancel", null, null, b, c, a)) {
            this.remove()
        }
    }
});
Ext.namespace("SYNO.SDS._AppMgr");
SYNO.SDS._AppMgr = Ext.extend(Ext.util.Observable, {
    list: null,
    constructor: function() {
        SYNO.SDS._AppMgr.superclass.constructor.apply(this, arguments);
        this.list = {};
        SYNO.SDS.StatusNotifier.on("beforeUserSettingsUnload", this.saveStates, this)
    },
    register: function(a) {
        this.list[a.id] = a
    },
    unregister: function(a) {
        delete this.list[a.id]
    },
    get: function(a) {
        return typeof a == "object" ? a : this.list[a]
    },
    getBy: function(b, a) {
        var d = [];
        for (var e in this.list) {
            if (this.list.hasOwnProperty(e)) {
                var c = this.list[e];
                if (b.call(a || c, c) !== false) {
                    d.push(c)
                }
            }
        }
        return d
    },
    getByAppName: function(b) {
        function a(c) {
            if (b === c.jsConfig.jsID) {
                return true
            }
            return false
        }
        return this.getBy(a)
    },
    each: function(b, a) {
        for (var c in this.list) {
            if (this.list[c] && typeof this.list[c] != "function") {
                if (b.call(a || this.list[c], this.list[c]) === false) {
                    return
                }
            }
        }
    },
    saveStates: function() {
        var a = this;
        a.saveAppState();
        a.saveWidgetState()
    },
    saveAppState: function() {
        if (!SYNO.SDS.UserSettings.getProperty("Desktop", "rememberWindowState")) {
            return
        }
        if (_S("standalone")) {
            return
        }
        var a = [];
        this.each(function(b) {
            var c = b.jsConfig.jsID;
            if ("SYNO.SDS.DSMNotify.Application" === c || "SYNO.SDS.App.FileTaskMonitor.Instance" === c) {
                return
            }
            if (true === b.jsConfig.hidden) {
                return
            }
            a.push({
                className: c,
                params: b.getStateParam()
            })
        });
        if (a.length) {
            SYNO.SDS.UserSettings.setProperty("Desktop", "restoreParams", a)
        }
    },
    saveWidgetState: function() {
        if (_S("standalone")) {
            return
        }
        var a = [];
        this.each(function(b) {
            var c = b.jsConfig.jsID;
            if ("SYNO.SDS._Widget.Instance" !== c) {
                return
            }
            a = b.getStateParam();
            if (a) {
                b.setUserSettings("restoreParams", a)
            }
        })
    }
});
Ext.namespace("SYNO.SDS._WindowMgr");
SYNO.SDS._WindowMgr = Ext.extend(Ext.util.Observable, {
    zseed: 9000,
    list: null,
    accessList: null,
    minimizedWin: null,
    front: null,
    offsetX: 10,
    offsetY: 10,
    exposeTransformDelayTime: 900,
    exposeRestoreDelayTime: 300,
    exposeIconHeight: 38,
    exposeIconShift: 38,
    constructor: function() {
        this.list = {};
        this.accessList = [];
        this.minimizedWin = [];
        SYNO.SDS._WindowMgr.superclass.constructor.apply(this, arguments);
        Ext.EventManager.onWindowResize(this.onWindowResize, this)
    },
    onWindowResize: function() {
        if (SYNO.SDS.WindowMgr.allHided) {
            SYNO.SDS.WindowMgr.toggleAllWin()
        }
        if (this.exposeMask) {
            this.exposeWindow()
        }
    },
    sortWindows: function(b, a) {
        var e = b.getTopWin ? b.getTopWin() : b,
            c = a.getTopWin ? a.getTopWin() : a,
            j = b.isModalized && b.isModalized() ? 1 : 0,
            i = a.isModalized && a.isModalized() ? 1 : 0,
            f = b.isAlwaysOnTop && b.isAlwaysOnTop() ? 1 : 0,
            d = a.isAlwaysOnTop && a.isAlwaysOnTop() ? 1 : 0,
            h = b.isAlwaysOnBottom && b.isAlwaysOnBottom() ? 1 : 0,
            g = a.isAlwaysOnBottom && a.isAlwaysOnBottom() ? 1 : 0;
        if (h !== g) {
            return g ? 1 : -1
        }
        if (f !== d) {
            return d ? -1 : 1
        }
        if (e !== c) {
            return (e.getGroupWinAccessTime() < c.getGroupWinAccessTime()) ? -1 : 1
        }
        if (j && b.hasOwnerWin(a)) {
            return 1
        }
        if (i && a.hasOwnerWin(b)) {
            return -1
        }
        return (!b._lastAccess || b._lastAccess < a._lastAccess) ? -1 : 1
    },
    orderWindows: function() {
        var d = this.accessList,
            b = d.length;
        if (b > 0) {
            d.sort(this.sortWindows);
            var c = d[0].manager.zseed;
            for (var f = 0; f < b; f++) {
                var g = d[f];
                if (g && !g.hidden) {
                    g.setZIndex(c + (f * 10))
                }
            }
        }
        var e = this.activateLast();
        SYNO.SDS.StatusNotifier.fireEvent("allwinordered", this.accessList, e)
    },
    setActiveWin: function(a) {
        if (a === this.front) {
            return
        }
        if (this.front) {
            this.front.setActive(false)
        }
        this.front = a;
        if (a) {
            Ext.each(a.modalWin || [], function(b) {
                if (b && b.hideForMinimize) {
                    delete b.hideForMinimize;
                    b.show()
                }
            });
            Ext.each(a.siblingWin || [], function(b) {
                if (b && b.hideForMinimize) {
                    delete b.hideForMinimize;
                    b.show()
                }
            });
            this.bringToFront(a);
            a.setActive(true)
        }
    },
    activateLast: function() {
        var b;
        for (var a = this.accessList.length - 1; a >= 0; --a) {
            b = this.accessList[a];
            if (!b.hidden) {
                if (b.isSkipActive && b.isSkipActive()) {
                    continue
                }
                this.setActiveWin(this.accessList[a]);
                return this.accessList[a]
            }
        }
        this.setActiveWin(null)
    },
    register: function(a) {
        if (a.manager) {
            a.manager.unregister(a)
        }
        a.manager = this;
        this.list[a.id] = a;
        this.accessList.push(a);
        a.on("hide", this.activateLast, this);
        if (!a.fromRestore && (!a.isModalized || !a.isModalized())) {
            this.cascadeOverlap(a)
        }
    },
    unregister: function(a) {
        delete a.manager;
        delete this.list[a.id];
        a.un("hide", this.activateLast, this);
        this.accessList.remove(a);
        this.minimizedWin.remove(a)
    },
    get: function(a) {
        return typeof a == "object" ? a : this.list[a]
    },
    bringToFront: function(a) {
        a = this.get(a);
        if (a === this.front) {
            SYNO.SDS.StatusNotifier.fireEvent("allwinordered", this.accessList, a);
            return false
        }
        do {
            a._lastAccess = new Date().getTime();
            if (a.isModalized && !a.isModalized()) {
                break
            }
            a = a.owner
        } while (a);
        this.orderWindows();
        return true
    },
    sendToBack: function(a) {
        a = this.get(a);
        a._lastAccess = -(new Date().getTime());
        this.orderWindows();
        return a
    },
    hideAll: function() {
        for (var a in this.list) {
            if (this.list[a] && typeof this.list[a] != "function" && this.list[a].isVisible()) {
                this.list[a].hide()
            }
        }
    },
    getActive: function() {
        return this.front
    },
    getActiveAppWindow: function() {
        var a = this.getActive();
        if ((a instanceof SYNO.SDS.AppWindow)) {
            return a
        }
        while (a && !a.appInstance) {
            a = a.owner
        }
        return a
    },
    getBy: function(c, b) {
        var d = [];
        for (var a = this.accessList.length - 1; a >= 0; --a) {
            var e = this.accessList[a];
            if (c.call(b || e, e) !== false) {
                d.push(e)
            }
        }
        return d
    },
    each: function(b, a) {
        for (var c in this.list) {
            if (this.list[c] && typeof this.list[c] != "function" && b.call(a || this.list[c], this.list[c]) === false) {
                return
            }
        }
    },
    cascadeOverlap: function(b) {
        var c = b.container.getSize();
        var a = {
            width: this.offsetX + b.getWidth(),
            height: this.offsetY + b.getHeight()
        };
        if (a.width > c.width && a.height > c.height) {
            this.offsetX = this.offsetY = 10
        } else {
            if (a.width > c.width) {
                if (10 == this.offsetX) {
                    this.offsetY = 10
                }
                this.offsetX = 10
            } else {
                if (a.height > c.height) {
                    this.offsetX += 30;
                    this.offsetY = 10
                }
            }
        }
        b.setPosition(this.offsetX, this.offsetY);
        this.offsetX += 30;
        this.offsetY += 30
    },
    toggleAllWin: function(a) {
        this.showAllButton = this.showAllButton || a;
        this.toggleAllWinMinimize()
    },
    setShowAllButtonDisabled: function(a) {
        if (this.showAllButton) {
            this.showAllButton.setDisabled(a)
        }
    },
    toggleAllWinMinimize: function() {
        this.setShowAllButtonDisabled(true);
        var a = [],
            b = 0,
            c = function() {
                if (--b > 0) {
                    return
                }
                var d = new Date().getTime();
                Ext.each(this.minimizedWin, function(f, e) {
                    f._lastAccess = d + e
                });
                this.orderWindows();
                this.setShowAllButtonDisabled(false)
            };
        Ext.each(this.accessList, function(d) {
            if (d.isVisible()) {
                if (d.toggleMinimizable === false) {
                    d.close()
                } else {
                    a.push(d)
                }
            }
        }, this);
        if (a.length) {
            Ext.invoke(a, "minimize");
            this.minimizedWin = a;
            this.setShowAllButtonDisabled(false)
        } else {
            if (this.minimizedWin.length) {
                Ext.each(this.minimizedWin, function(d) {
                    b++;
                    d.show(undefined, c, this)
                }, this)
            } else {
                this.setShowAllButtonDisabled(false)
            }
        }
    },
    restoreWin: function(a) {
        var b = function() {
            this.allToggleing--;
            if (this.allToggleing <= 0) {
                this.allToggleing = 0;
                SYNO.SDS.StatusNotifier.fireEvent("allwinrestored")
            }
        };
        if (!a.el.origXY) {
            return
        }
        if (Ext.isIE) {
            a.el.setXY([a.el.origXY[0], a.el.origXY[1]]);
            delete a.el.origXY;
            this.allToggleing++;
            b.defer(50, this)
        } else {
            this.allToggleing++;
            a.el.shift({
                x: a.el.origXY[0],
                y: a.el.origXY[1],
                easing: "easeOutStrong",
                duration: this.animDuration,
                scope: this,
                callback: function() {
                    if (!a.el.origShadowDisabled) {
                        a.el.enableShadow(true)
                    }
                    a.unmask();
                    delete a.el.origXY;
                    b.apply(this)
                }
            })
        }
        if (a.childWinMgr) {
            a.childWinMgr.each(this.restoreWin, this)
        }
    },
    exposeWindow: function() {
        if (!SYNO.SDS.UIFeatures.test("exposeWindow")) {
            return
        }
        if (this.exposeMask) {
            this.restoreTransform();
            return
        }
        SYNO.SDS.DeskTopManager.showDesktop();
        if (this.isRestoreTransform) {
            return
        }
        if (SYNO.SDS.WindowMgr.allHided) {
            SYNO.SDS.WindowMgr.toggleAllWin();
            SYNO.SDS.StatusNotifier.on("allwinrestored", this.exposeWindow, this, {
                single: true
            });
            return
        }
        this.shownAppWins = [];
        var d = SYNO.SDS.TaskButtons.getAllAppWins();
        if (d.length === 0) {
            return
        }
        Ext.each(d, function(e) {
            if (!e.isVisible()) {
                if (this.isSkipExposeAppWindow(e)) {
                    return true
                }
                e.show(false);
                this.shownAppWins.push(e)
            }
        }, this);
        this.hiddenNonAppWins = [];
        Ext.each(this.accessList, function(e) {
            if (e.isVisible() && !e.taskButton) {
                e.hide(false);
                this.hiddenNonAppWins.push(e)
            }
        }, this);
        var c = this.calWindowPosition(d);
        var a = c.xyValues;
        this.exposeMask = Ext.getBody().createChild({
            tag: "div",
            cls: "sds-expose-mask"
        });
        this.exposeMask.on("click", this.restoreTransform, this);
        var b = 0;
        Ext.each(d, function(e) {
            if (e.isVisible()) {
                e.el._origPos = {
                    x: e.el.getLeft(true),
                    y: e.el.getTop(true)
                };
                e.el._toWin = a[b];
                this.transformWindow(e, c.noWin);
                b++
            }
        }, this);
        this.exposeMask.setStyle({
            opacity: "0.6",
            "z-index": 1000
        });
        SYNO.SDS.StatusNotifier.fireEvent("allwinexpose")
    },
    transformWindow: function(e, a) {
        if (!e) {
            return false
        }
        var h = e.el;
        h.disableShadow();
        var g = h._toWin;
        if (a === true) {
            h.addClass("sds-expose-win-hidden")
        } else {
            var b = h.getSize();
            var c = g.w / b.width;
            if ((b.height * c) > g.h) {
                c = g.h / b.height
            }
            c = Math.min(c, 1).toFixed(2);
            var f = g.x - h._origPos.x;
            var d = g.y - h._origPos.y;
            h.addClass("sds-expose-win-transform");
            h.setStyle("-webkit-transform", String.format("translate3d({1}px, {2}px, 0) scale3d({0}, {0}, 1)", c, f, d));
            h.setStyle("-moz-transform", String.format("translate({1}px, {2}px) scale({0})", c, f, d));
            h.setStyle("-o-transform", String.format("translate({1}px, {2}px) scale({0})", c, f, d));
            h.setStyle("transform", String.format("translate({1}px, {2}px) scale({0})", c, f, d))
        }
        e._deferTaskId = this.afterTransformWindow.defer((a === true) ? 0 : this.exposeTransformDelayTime, this, [e, a]);
        return e
    },
    afterTransformWindow: function(d, b) {
        if (!d) {
            return false
        }
        var f = d.el;
        var e = f._toWin;
        if (Ext.isEmpty(f.dom)) {
            return false
        }
        f._exposeMask = f.createChild({
            tag: "div",
            cls: "sds-expose-win-mask"
        });
        var c = f._exposeMask;
        d.mon(c, "mousedown", function(g) {
            g.stopEvent()
        }, this);
        d.mon(c, "click", this.onWinMaskClick, this, {
            win: d
        });
        d.mon(c, "mouseenter", function(h) {
            var g = h.getTarget();
            Ext.fly(g).addClass("sds-expose-win-over")
        }, this);
        d.mon(c, "mouseleave", function(h) {
            var g = h.getTarget();
            Ext.fly(g).removeClass("sds-expose-win-over")
        }, this);
        f.iconBadge = new SYNO.SDS.Utils.IconBadge();
        if (d.jsConfig && d.getTitle() && d.jsConfig.icon) {
            var a = d.jsConfig.jsBaseURL + "/" + (d.jsConfig.icon || d.jsConfig.icon_16);
            f.iconBadge.setIconText(SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(a, "Header"), SYNO.SDS.Utils.GetLocalizedString(d.getTitle(), d.jsConfig.jsID))
        } else {
            f.iconBadge.setIconText("", d.title || "")
        }
        f.iconBadge.setXY(e.x, e.y - this.exposeIconHeight + this.exposeIconShift);
        d.mon(f.iconBadge.el, "click", this.onWinMaskClick, this, {
            win: d
        })
    },
    onWinMaskClick: function(a, d, c) {
        this.restoreTransform();
        (function b() {
            c.win.show()
        }).defer(this.exposeRestoreDelayTime, this);
        a.stopEvent();
        return false
    },
    restoreTransform: function() {
        if (this.isRestoreTransform) {
            return
        }
        this.isRestoreTransform = true;
        if (this.exposeMask) {
            this.exposeMask.setStyle("opacity", "0")
        }
        Ext.each(this.accessList, function(a) {
            var c = a.el;
            if (a._deferTaskId) {
                window.clearTimeout(a._deferTaskId);
                a._deferTask = null
            }
            if (!c._origPos) {
                return
            }
            if (c.iconBadge) {
                c.iconBadge.el.hide();
                c.iconBadge.el.remove();
                c.iconBadge = null
            }
            if (c._exposeMask) {
                c._exposeMask.remove();
                delete c._exposeMask;
                c._exposeMask = null
            }
            if (c.hasClass("sds-expose-win-hidden")) {
                c.removeClass("sds-expose-win-hidden")
            } else {
                c.addClass("sds-expose-win-transform-restore");
                c.setStyle("-webkit-transform", "");
                c.setStyle("-moz-transform", "");
                c.setStyle("-o-transform", "");
                c.setStyle("transform", "")
            }
            var b = function() {
                c.removeClass("sds-expose-win-transform");
                c.removeClass("sds-expose-win-transform-restore");
                c.enableShadow(true)
            };
            b.defer(this.exposeRestoreDelayTime, this)
        }, this);
        Ext.each(this.hiddenNonAppWins, function(a) {
            if (!a.isSkipUnexpose || !a.isSkipUnexpose()) {
                a.show(false)
            }
        }, this);
        Ext.each(this.shownAppWins, function(a) {
            a.hide(false);
            a.minimize()
        }, this);
        (function() {
            if (this.exposeMask) {
                this.exposeMask.un("click", this.restoreTransform, this);
                this.exposeMask.remove();
                this.exposeMask = null
            }
            SYNO.SDS.StatusNotifier.fireEvent("allwinunexpose");
            this.isRestoreTransform = false
        }).defer(this.exposeRestoreDelayTime, this)
    },
    calWindowPosition: function(k) {
        var g = 0;
        Ext.each(k, function(h) {
            if (h.isVisible()) {
                g++
            }
        });
        var e = SYNO.SDS.Desktop.getEl().getSize();
        var q = e.width;
        var f = e.height;
        var a = 0;
        var l = 0;
        var p = 50;
        var n = this.exposeIconHeight;
        var s = 1;
        if (g < 3) {
            a = (g === 1) ? q - 2 * p : (q - 3 * p) / 2;
            l = f - 2 * p - n
        } else {
            s = Math.ceil(g / 3);
            a = (q - 4 * p) / 3;
            l = (f - (s + 1) * p - s * n) / s
        }
        a = Math.round(a);
        l = Math.round(l);
        var j = {};
        var b = [];
        for (var d = 0; d < g; ++d) {
            var c = (d % 3) + 1;
            var r = Math.max(Math.ceil((d + 1) / 3), 1);
            var o = 0;
            var m = 0;
            if (g < 3) {
                m = p + n
            } else {
                m = r * (p + n) + (r - 1) * l
            }
            o = (c - 1) * a + c * p;
            b[d] = {
                x: o,
                y: m,
                w: a,
                h: l
            }
        }
        j.xyValues = b;
        if (a < 80 || l < 80 || g > 9) {
            j.noWin = true
        }
        return j
    },
    isSkipExposeAppWindow: function(a) {
        if (a.isSkipExpose && true === a.isSkipExpose()) {
            return true
        }
        if (SYNO.SDS.AudioStation && SYNO.SDS.AudioStation.MainWindow && (a instanceof SYNO.SDS.AudioStation.MainWindow)) {
            if (a.gIsOnMiniPlayerMode === true) {
                return true
            }
        }
        return false
    }
});
Ext.namespace("SYNO.SDS._TaskButtons");
SYNO.SDS._TaskButtons = Ext.extend(Ext.BoxComponent, {
    buttons: null,
    constructor: function(a) {
        SYNO.SDS._TaskButtons.superclass.constructor.call(this, Ext.apply({
            id: "sds-taskbuttons-panel",
            region: "center"
        }, a));
        this.buttons = [];
        this.mon(SYNO.SDS.StatusNotifier, "servicechanged", this.onServiceChanged, this);
        this.mon(SYNO.SDS.StatusNotifier, "appprivilegechanged", this.onServiceChanged, this);
        this.mon(SYNO.SDS.StatusNotifier, "jsconfigLoaded", this.onJSConfigLoaded, this)
    },
    onRender: function() {
        SYNO.SDS._TaskButtons.superclass.onRender.apply(this, arguments);
        this.stripWrap = this.el.createChild({
            id: "sds-taskbuttons-strip-wrap",
            cn: [{
                tag: "ul",
                id: "sds-taskbuttons-strip",
                cn: [{
                    tag: "li",
                    cls: "sds-taskbuttons-edge"
                }, {
                    cls: "x-clear"
                }]
            }]
        });
        this.stripSpacer = this.el.createChild({
            cls: "sds-taskbuttons-strip-spacer"
        });
        this.strip = this.stripWrap.first();
        this.edge = this.strip.child("li.sds-taskbuttons-edge");
        this.loadUserSettings()
    },
    loadUserSettings: function() {
        var b = [],
            a = SYNO.SDS.UserSettings.getProperty("taskbar", "pined") || [];
        Ext.each(a, function(d) {
            if (!SYNO.SDS.StatusNotifier.isAppEnabled(d.appName) || "SYNO.SDS.App.FileTaskMonitor.Instance" === d.appName || "SYNO.SDS.App.WelcomeApp.Instance" === d.appName || "SYNO.SDS.LogViewer.Application" === d.appName || "SYNO.SDS.SystemInfoApp.Application" === d.appName || "SYNO.SDS.ControlPanel.Instance" === d.appName) {
                return
            }
            if ("SYNO.SDS.ACEEditor.Application" === d.appName && SYNO.SDS.Config.FnMap[d.appName].config.hidden) {
                return
            }
            var c = this.add(d.appName, d.windowName);
            if (c) {
                c.pined = true
            }
            b.push(d)
        }, this);
        if (a.length !== b.length) {
            SYNO.SDS.UserSettings.setProperty("taskbar", "pined", b)
        }
    },
    isAppWinExists: function(c, a, b, g, f, e) {
        var d = g ? null : -1;
        e = e || 0;
        Ext.each(c, function(i, h) {
            if (h < e) {
                return
            }
            if ((!a || a === i.appName) && (!b || b === i.windowName) && (!f || f === i.state)) {
                d = g ? i : h;
                return false
            }
        }, this);
        return d
    },
    onServiceChanged: function(d, b) {
        if (b) {
            return
        }
        var c, a = -1;
        while (0 <= (a = this.isAppWinExists(this.buttons, d, null, false, null, a + 1))) {
            c = this.buttons[a];
            if (c.pined) {
                c.onClickUnpin()
            }
        }
    },
    onJSConfigLoaded: function() {
        var a = [];
        Ext.each(this.buttons, function(b) {
            if (!SYNO.SDS.StatusNotifier.isAppEnabled(b.appName)) {
                a.push(b)
            }
        }, this);
        Ext.each(a, function(b) {
            if (b.pined) {
                b.onClickUnpin()
            }
        }, this)
    },
    getPinedBeforeBtn: function(a) {
        var b = 0;
        Ext.each(this.buttons, function(c) {
            if (a === c) {
                return false
            }
            if (c.pined) {
                b++
            }
        });
        return b
    },
    add: function(b, c) {
        var a, d, e = SYNO.SDS.Config.FnMap[c];
        if (!e) {
            return null
        }
        d = this.isAppWinExists(this.buttons, b, c, true, "normal");
        if (d) {
            return d
        }
        a = this.strip.createChild({
            tag: "li"
        }, this.edge);
        d = new SYNO.SDS._TaskButtons.Button(a, b, c);
        this.buttons.push(d);
        return d
    },
    remove: function(b) {
        var a = document.getElementById(b.container.id);
        a.parentNode.removeChild(a);
        this.buttons.remove(b);
        SYNO.SDS.StatusNotifier.fireEvent("taskbuttonchanged")
    },
    getAllAppWins: function() {
        var a = [];
        Ext.each(this.buttons, function(b) {
            if (!b.hidden && b.window) {
                a.push(b.window)
            }
        }, this);
        return a
    },
    getVisibleButtonCount: function() {
        var a = 0;
        Ext.each(this.buttons, function(b) {
            if (b && b.isVisible()) {
                a += 1
            }
        }, this);
        return a
    },
    getWrapWidth: function() {
        var a = Ext.getCmp("sds-taskbar-panel-wrap2");
        return a.getWidth()
    },
    getTotalButtonsWidth: function() {
        return this.buttons.length * this.getOneButtonWidth()
    },
    getOneButtonWidth: function() {
        var a = this.buttons.length;
        if (a === 0) {
            return 0
        }
        var b = this.buttons[0];
        return (b.getWidth() + 2)
    },
    getFirstOverflowIndex: function() {
        var a;
        if (!this.isButtonOverflow()) {
            return -1
        }
        a = Math.ceil((this.getTotalButtonsWidth() - this.getWrapWidth()) / (this.getOneButtonWidth()));
        return (this.buttons.length - a)
    },
    getOverflowedButtons: function() {
        var c, b, a, d = [];
        b = this.getFirstOverflowIndex();
        if (b === -1) {
            return d
        }
        for (c = b, a = this.buttons.length; c < a; c++) {
            d.push(this.buttons[c])
        }
        return d
    },
    isButtonOverflow: function() {
        return (this.getTotalButtonsWidth() > this.getWrapWidth())
    },
    hideOverflowedButtons: function() {
        var a = this.getFirstOverflowIndex();
        if (a === -1) {
            Ext.each(this.buttons, function(c, b) {
                c.removeClass("sds-taskbutton-overflowed")
            }, this)
        } else {
            Ext.each(this.buttons, function(c, b) {
                if (b < a) {
                    c.removeClass("sds-taskbutton-overflowed")
                } else {
                    c.addClass("sds-taskbutton-overflowed")
                }
            }, this)
        }
    },
    switchActiveWindow: function(b, d, h) {
        var g, a, c = "sds-switch-win-gesture-show-force-hidden",
            i = "sds-switch-win-gesture-hide-to",
            e = "sds-switch-win-gesture-show-from",
            f = "sds-switch-win-gesture-show-transition";
        if (h === "right") {
            g = String.format("{0}-right", i);
            a = String.format("{0}-left", e)
        } else {
            if (h === "left") {
                g = String.format("{0}-left", i);
                a = String.format("{0}-right", e)
            }
        }
        if (this.isSwitchingWindow) {
            return
        }
        this.isSwitchingWindow = true;
        SYNO.SDS.Desktop.getEl().addClass("sds-is-gesture-switching");
        b.addClassToAllWindows(g);
        d.addClassToAllWindows(c);
        d.show(false);
        (function() {
            d.addClassToAllWindows(a)
        }).defer(100, this);
        (function() {
            d.removeClassFromAllWindows(c);
            d.addClassToAllWindows(f);
            d.removeClassFromAllWindows(a)
        }).defer(200, this);
        (function() {
            b.removeClassFromAllWindows(g);
            b.hide(false);
            d.removeClassFromAllWindows(f);
            SYNO.SDS.Desktop.getEl().removeClass("sds-is-gesture-switching");
            this.isSwitchingWindow = false
        }).defer(800, this)
    },
    setLeftWindowActive: function() {
        var d = SYNO.SDS.WindowMgr.getActiveAppWindow(),
            c, b, a, e;
        if (!d) {
            return false
        }
        c = this.buttons.indexOf(d.taskButton);
        if (c === -1) {
            return false
        }
        a = this.buttons.length;
        b = c - 1;
        if (b < 0) {
            b = a - 1
        }
        while (b !== c) {
            e = this.buttons[b];
            if (e.window) {
                this.switchActiveWindow(d, e.window, "left");
                return true
            }
            if (b === 0) {
                b = a - 1
            } else {
                b--
            }
        }
        return false
    },
    setRightWindowActive: function() {
        var e = SYNO.SDS.WindowMgr.getActiveAppWindow(),
            d, c, b, a;
        if (!e) {
            return false
        }
        d = this.buttons.indexOf(e.taskButton);
        if (d === -1) {
            return false
        }
        b = this.buttons.length;
        c = d + 1;
        if (c >= b) {
            c = 0
        }
        while (c !== d) {
            a = this.buttons[c];
            if (a.window) {
                this.switchActiveWindow(e, a.window, "right");
                return true
            }
            if (c === b - 1) {
                c = 0
            } else {
                c++
            }
        }
        return false
    }
});
SYNO.SDS._TaskButtons.Button = Ext.extend(Ext.Button, {
    initialized: false,
    container: null,
    window: null,
    contextMenu: null,
    appName: "",
    windowName: "",
    state: "normal",
    pined: false,
    constructor: function(b, a, c) {
        var e, d = SYNO.SDS.Config.FnMap[c];
        this.container = b;
        this.jsConfig = d.config;
        this.appName = a;
        this.windowName = c;
        e = this.jsConfig.jsBaseURL + "/" + (this.jsConfig.icon || this.jsConfig.icon_16);
        SYNO.SDS._TaskButtons.Button.superclass.constructor.call(this, {
            menu: null,
            clickEvent: "click",
            renderTo: this.container
        });
        this.setIcon(SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(e, "Taskbar"));
        this.contextMenu = this.initContextMenu();
        this.addManagedComponent(this.contextMenu);
        this.reset()
    },
    show: function() {
        SYNO.SDS._TaskButtons.Button.superclass.show.apply(this, arguments);
        SYNO.SDS.StatusNotifier.fireEvent("taskbuttonchanged")
    },
    hide: function() {
        SYNO.SDS._TaskButtons.Button.superclass.hide.apply(this, arguments);
        SYNO.SDS.StatusNotifier.fireEvent("taskbuttonchanged")
    },
    initButtonEl: function() {
        SYNO.SDS._TaskButtons.Button.superclass.initButtonEl.apply(this, arguments);
        this.mon(this.el, "contextmenu", this.onContextMenu, this);
        this.mon(this.el, "mouseover", this.onMouseOverHandler, this);
        this.mon(this.el, "mouseout", this.onMouseOutHandler, this)
    },
    afterRender: function() {
        SYNO.SDS._TaskButtons.Button.superclass.afterRender.apply(this, arguments);
        this.container.fadeIn({
            duration: 0.6
        });
        this.btnEl.setARIA({
            label: SYNO.SDS.Utils.GetLocalizedString(this.window ? this.window.getTitle() : this.jsConfig.title, this.jsConfig.jsID),
            tabindex: 0
        })
    },
    destroy: function() {
        if (this.pined) {
            this.reset();
            return
        }
        this.destroying = true;
        if (Ext.isIE9m) {
            SYNO.SDS.TaskButtons.remove(this);
            SYNO.SDS._TaskButtons.Button.superclass.destroy.call(this);
            SYNO.SDS.StatusNotifier.fireEvent("taskbuttonchanged");
            return
        }
        this.el.setOpacity(0, {
            duration: 0.2,
            scope: this,
            callback: function() {
                this.el.slideOut("l", {
                    duration: 0.2,
                    scope: this,
                    callback: function() {
                        SYNO.SDS.TaskButtons.remove(this);
                        SYNO.SDS._TaskButtons.Button.superclass.destroy.call(this);
                        SYNO.SDS.StatusNotifier.fireEvent("taskbuttonchanged")
                    }
                })
            }
        })
    },
    beforeDestroy: function() {
        SYNO.SDS._TaskButtons.Button.superclass.beforeDestroy.apply(this, arguments);
        this.container = null;
        this.window = null;
        this.contextMenu = null
    },
    reset: function() {
        this.window = null;
        this.initialized = false;
        this.setState("normal");
        this.setActionsEnable(this.contextMenu.launchActions, true);
        this.setActionsEnable(this.contextMenu.requestActions, true);
        this.setActionsEnable(this.contextMenu.defaultActions, true);
        this.setActionsVisible(this.contextMenu.launchActions, true);
        this.setActionsVisible(this.contextMenu.requestActions, false);
        this.setActionsVisible(this.contextMenu.defaultActions, false);
        if (this.contextMenu.launchActions._launch_separator) {
            this.contextMenu.launchActions._launch_separator.hide()
        }
        SYNO.SDS.StatusNotifier.fireEvent("taskbuttonchanged")
    },
    init: function(a) {
        var b = this.contextMenu.defaultActions;
        this.window = a;
        this.setActionsVisible(this.contextMenu.launchActions, false);
        this.setActionsVisible(this.contextMenu.requestActions, true);
        this.setActionsVisible(this.contextMenu.defaultActions, true);
        if (!this.window.maximizable) {
            b.maximize.hide()
        }
        b.restore.setDisabled(!(this.window.maximized && this.window.maximizable));
        if (this.window.maskCnt > 0) {
            b.maximize.disable();
            b.restore.disable()
        }
        this.initialized = true;
        SYNO.SDS.StatusNotifier.fireEvent("taskbuttonchanged")
    },
    setLoading: function(a) {
        if ((a && this.waitEl) || (!a && !this.waitEl)) {
            return
        }
        if (a) {
            this.waitEl = this.container.createChild({
                cls: "loading"
            })
        } else {
            this.waitEl.remove();
            delete this.waitEl
        }
    },
    setState: function(a) {
        switch (a) {
            case "normal":
                this.el.removeClass(["launched", "active"]);
                this.setLoading(false);
                this.state = a;
                this.setTooltip(SYNO.SDS.Utils.GetLocalizedString(this.window ? this.window.getTitle() : this.jsConfig.title, this.jsConfig.jsID));
                break;
            case "loading":
                this.el.addClass("launched");
                this.setLoading(true);
                this.state = a;
                break;
            case "active":
                this.el.addClass(["launched", "active"]);
                this.setLoading(false);
                this.state = a;
                break;
            case "deactive":
                this.el.addClass("launched");
                this.el.removeClass("active");
                this.setLoading(false);
                this.state = a;
                break
        }
    },
    getDefaultActions: function() {
        return {
            pin: new Ext.Action({
                text: _T("desktop", "taskbar_pin"),
                scope: this,
                handler: this.onClickPin
            }),
            unpin: new Ext.Action({
                text: _T("desktop", "taskbar_unpin"),
                scope: this,
                handler: this.onClickUnpin
            }),
            maximize: new Ext.Action({
                text: _T("desktop", "maximize"),
                scope: this,
                handler: this.onClickMaximize
            }),
            minimize: new Ext.Action({
                text: _T("desktop", "minimize"),
                scope: this,
                handler: this.onClickMinimize
            }),
            restore: new Ext.Action({
                text: _T("desktop", "restore"),
                scope: this,
                handler: this.onClickRestore
            }),
            close: new Ext.Action({
                text: _T("common", "close"),
                scope: this,
                handler: this.onClickClose
            })
        }
    },
    getLaunchActions: function() {
        var d = this.jsConfig.launchParams || {},
            c = {},
            a;
        for (var b in d) {
            if (d.hasOwnProperty(b)) {
                ++a;
                c[this.id + b] = new Ext.Action({
                    text: SYNO.SDS.Utils.GetLocalizedString(b, this.jsConfig.jsID),
                    handler: this.onClickLaunch.createDelegate(this, [d[b]])
                })
            }
        }
        if (a > 0) {
            c._launch_separator = new Ext.menu.Separator()
        }
        return c
    },
    getRequestActions: function() {
        var c = this.jsConfig.taskbarMenu || {},
            b = {},
            a;
        a = 0;
        for (var d in c) {
            if (c.hasOwnProperty(d)) {
                a++;
                b[this.id + d] = new Ext.Action({
                    text: SYNO.SDS.Utils.GetLocalizedString(d, this.jsConfig.jsID),
                    handler: this.onClickRequest.createDelegate(this, [c[d]])
                })
            }
        }
        if (a > 0) {
            b._request_separator = new Ext.menu.Separator()
        }
        return b
    },
    initContextMenu: function() {
        var b, a = [],
            f = this.getLaunchActions(),
            c = this.getRequestActions(),
            d = this.getDefaultActions();
        for (b in f) {
            if (f.hasOwnProperty(b)) {
                a.push(f[b])
            }
        }
        for (b in c) {
            if (c.hasOwnProperty(b)) {
                a.push(c[b])
            }
        }
        for (b in d) {
            if (d.hasOwnProperty(b)) {
                a.push(d[b])
            }
        }
        var e = new SYNO.ux.Menu({
            items: a
        });
        e.launchActions = f;
        e.requestActions = c;
        e.defaultActions = d;
        return e
    },
    setActionsVisible: function(c, b) {
        var a;
        for (a in c) {
            if (b && Ext.isFunction(c[a].show)) {
                c[a].show()
            } else {
                if (!b && Ext.isFunction(c[a].hide)) {
                    c[a].hide()
                }
            }
        }
    },
    setActionsEnable: function(c, a) {
        var b;
        for (b in c) {
            if (a && Ext.isFunction(c[b].enable)) {
                c[b].enable()
            } else {
                if (!a && Ext.isFunction(c[b].disable)) {
                    c[b].disable()
                }
            }
        }
    },
    getContextMenu: function(a) {
        if (a) {
            this.updatePinState()
        } else {
            this.contextMenu.defaultActions.pin.setHidden(true);
            this.contextMenu.defaultActions.unpin.setHidden(true)
        }
        return this.contextMenu
    },
    updatePinState: function() {
        var a = SYNO.SDS.UserSettings.getProperty("taskbar", "pined") || [],
            c = this.window && (false !== this.window.pinable),
            b = SYNO.SDS.TaskButtons.isAppWinExists(a, this.appName, this.windowName) >= 0;
        this.contextMenu.defaultActions.pin.setHidden(!c || b);
        this.contextMenu.defaultActions.unpin.setHidden(!b || (b && !this.pined))
    },
    setDisableMaximize: function(a) {
        this.preventMax = a ? true : false;
        this.updateContextMenu("unmask")
    },
    updateContextMenu: function(a) {
        var b = this.contextMenu.defaultActions;
        switch (a) {
            case "maximize":
                b.restore.enable();
                b.minimize.enable();
                b.maximize.disable();
                break;
            case "minimize":
                b.restore.enable();
                b.minimize.disable();
                b.maximize.disable();
                break;
            case "restore":
                b.minimize.enable();
                b.maximize.setDisabled(this.window.maximized || this.preventMax === true);
                b.restore.setDisabled(!(this.window.maximized && this.window.maximizable));
                break;
            case "mask":
                b.maximize.disable();
                b.restore.disable();
                break;
            case "unmask":
                b.maximize.setDisabled(this.window.maximized || this.preventMax === true);
                b.restore.setDisabled(!this.window.maximized);
                break
        }
    },
    onClickPin: function() {
        var a = SYNO.SDS.UserSettings.getProperty("taskbar", "pined") || [];
        if (SYNO.SDS.TaskButtons.isAppWinExists(a, this.appName, this.windowName) >= 0) {
            return
        }
        a.splice(SYNO.SDS.TaskButtons.getPinedBeforeBtn(this), 0, {
            appName: this.appName,
            windowName: this.windowName
        });
        SYNO.SDS.UserSettings.setProperty("taskbar", "pined", a);
        this.pined = true
    },
    onClickUnpin: function() {
        var a = SYNO.SDS.UserSettings.getProperty("taskbar", "pined") || [],
            b = SYNO.SDS.TaskButtons.isAppWinExists(a, this.appName, this.windowName, true);
        if (!b) {
            return
        }
        a.remove(b);
        SYNO.SDS.UserSettings.setProperty("taskbar", "pined", a);
        this.pined = false;
        if ("normal" === this.state) {
            this.destroy()
        }
    },
    onClickRestore: function() {
        if (this.window.hidden) {
            this.window.show()
        } else {
            if (this.window.maximized) {
                this.window.restore()
            }
        }
        this.updateContextMenu("restore")
    },
    onClickMaximize: function() {
        this.window.maximize();
        this.window.show();
        this.updateContextMenu("maximize")
    },
    onClickMinimize: function() {
        this.window.minimize();
        this.updateContextMenu("minimize")
    },
    onClickLaunch: function(a) {
        SYNO.SDS.AppLaunch(this.appName, Ext.apply({
            windowName: this.windowName
        }, a), true)
    },
    onClickRequest: function(a) {
        this.window.request(a)
    },
    onClickClose: function() {
        this.window.close()
    },
    onClick: function() {
        var c = function() {
            this.window.show();
            this.updateContextMenu("restore")
        };
        if ("normal" === this.state) {
            this.onClickLaunch({});
            if (!SYNO.SDS.DeskTopManager.isDesktopOnTop()) {
                SYNO.SDS.DeskTopManager.showDesktop()
            }
            return
        }
        if (!this.initialized || this.destroying) {
            return
        }
        if (SYNO.SDS.WindowMgr.allToggleing) {
            return
        }
        var b = SYNO.SDS.WindowMgr.getActive(),
            a = b && b.getTopWin ? b.getTopWin() : null;
        if (SYNO.SDS.WindowMgr.allHided) {
            SYNO.SDS.WindowMgr.toggleAllWin();
            if (!b || a !== this.window) {
                SYNO.SDS.StatusNotifier.on("allwinrestored", c, this, {
                    single: true
                })
            }
            return
        }
        SYNO.SDS._TaskButtons.Button.superclass.onClick.apply(this, arguments);
        if (!SYNO.SDS.DeskTopManager.isDesktopOnTop()) {
            SYNO.SDS.DeskTopManager.showDesktop()
        } else {
            if (b && a === this.window) {
                this.window.minimize()
            } else {
                c.apply(this)
            }
        }
    },
    onContextMenu: function(a) {
        a.preventDefault();
        if (this.destroying) {
            return
        }
        if (this.window && !this.window.hidden) {
            this.window.show()
        }
        Ext.QuickTips.getQuickTip().cancelShow(this.btnEl);
        this.getContextMenu(true).showAt(this.container.getAlignToXY(this.container))
    },
    onMouseOverHandler: function(d) {
        if (this.state === "normal") {
            return
        }
        if (SYNO.SDS.PreviewBox.isEnabled()) {
            this.setTooltip("")
        }
        var c = this.container.getAlignToXY(this.container);
        var a = this.container.getWidth();
        var b = {
            win: this.window,
            centerX: c[0] + (a / 2)
        };
        SYNO.SDS.PreviewBox.showBox(b)
    },
    onMouseOutHandler: function(a) {
        this.setTooltip(SYNO.SDS.Utils.GetLocalizedString(this.window ? this.window.getTitle() : this.jsConfig.title, this.jsConfig.jsID));
        SYNO.SDS.PreviewBox.hideBox()
    }
});
Ext.namespace("SYNO.SDS._SystemTray");
SYNO.SDS._SystemTray = Ext.extend(Ext.BoxComponent, {
    constructor: function(b) {
        this.buttons = [];
        this.widgetButtons = [];
        var a = {
            id: "sds-tray-panel"
        };
        if (_S("standalone")) {
            Ext.apply(a, {
                hidden: true,
                renderTo: document.body
            })
        }
        SYNO.SDS._SystemTray.superclass.constructor.call(this, Ext.apply(a, b));
        Ext.EventManager.onWindowResize(SYNO.SDS._SystemTrayMsgMgr.alignAll, SYNO.SDS._SystemTrayMsgMgr)
    },
    onRender: function() {
        SYNO.SDS._SystemTray.superclass.onRender.apply(this, arguments);
        if (_S("standalone")) {
            return
        }
        this.stripWrap = this.el.createChild({
            cls: "sds-tray-strip-wrap",
            cn: [{
                tag: "ul",
                cls: "sds-tray-strip",
                cn: [{
                    tag: "li",
                    cls: "sds-tray-edge"
                }, {
                    tag: "li",
                    cls: "sds-widget-tray-edge"
                }, {
                    cls: "x-clear"
                }]
            }]
        });
        this.stripSpacer = this.el.createChild({
            cls: "sds-tray-strip-spacer"
        });
        this.strip = this.stripWrap.first()
    },
    add: function(b, d) {
        var a, c = false;
        try {
            if (b instanceof SYNO.SDS.DSMNotify.Tray) {
                c = true
            }
        } catch (f) {
            SYNO.Debug("Failed to test instanceof SYNO.SDS.DSMNotify.Tray")
        }
        if (c) {
            a = "sds-taskbar-notification-button"
        } else {
            a = this.strip.createChild({
                tag: "li"
            }, this.strip.child(".sds-tray-edge"))
        }
        var e = new SYNO.SDS._SystemTray.Button(a, b, this);
        this.mon(e, "destroy", function(g) {
            this.buttons.remove(g);
            g.container.remove()
        }, this);
        this.buttons.push(e);
        return e
    },
    addButton: function(f, b) {
        var e = this,
            d = e.strip;
        var a = d.createChild({
            tag: "li",
            cls: "sds-widget-tray"
        }, d.child(".sds-widget-tray-edge"));
        var c = new f({
            renderTo: a,
            instance: b
        });
        e.mon(c, "destroy", function(g) {
            e.widgetButtons.remove(g);
            g.container.remove()
        }, e);
        e.widgetButtons.push(c);
        return c
    },
    notifyMsg: function(h, i, d, g) {
        var e = Ext.isNumber(g) ? g : 5000;
        var b = new SYNO.SDS._SystemTrayMsg({
            autoDestroy: !!e,
            hideDelay: e
        });
        var a = function() {
            if (SYNO.SDS.Environment.GetEnvironment() === SYNO.SDS.Environment.ESM) {
                return "resources/images/theme/business/icon_esm_64.png?v=4933"
            } else {
                return "resources/images/icon_dsm_64.png?v=4933"
            }
        };
        if ("" === h) {
            h = "SYNO.SDS.DSMNotify.Application"
        }
        b.setTitle(i);
        d = Ext.util.Format.ellipsis(d, 480, true);
        b.setMessage(d);
        var j = false;
        if (-1 < d.indexOf("<input ") || -1 < d.indexOf("<a ")) {
            j = true
        }
        if (!j && window.Notification && window.Notification.permission === "granted" && SYNO.SDS.UserSettings.getProperty("Desktop", "enableDesktopNotification")) {
            d = Ext.util.Format.stripTags(d);
            var c = new window.Notification(i, {
                body: d,
                icon: a()
            });
            c.onshow = function() {
                setTimeout(function() {
                    c.close()
                }, 10000)
            }
        } else {
            SYNO.SDS.StatusNotifier.fireEvent("systemTrayNotifyMsg");
            if (_S("standalone")) {
                b.show(SYNO.SDS.Desktop.getEl())
            } else {
                var f = SYNO.SDS.DeskTopManager.getActive();
                if (f && f.getEl()) {
                    b.show(f.getEl())
                }
            }
        }
        return b
    },
    getVisibleButtonCount: function() {
        var a = -1;
        Ext.each(this.buttons, function(b) {
            if (b.isVisible()) {
                a += 1
            }
        }, this);
        return a + this.getVisibleWidgetButtonCount()
    },
    getVisibleWidgetButtonCount: function() {
        var a = 0;
        Ext.each(this.widgetButtons, function(b) {
            if (b.isVisible()) {
                a += 1
            }
        }, this);
        return a
    },
    getTrayButtonWidth: function() {
        var a = 0;
        Ext.each(this.buttons, function(b) {
            if (b.isVisible()) {
                a += b.getWidth() + b.getEl().getMargins("l, r")
            }
        }, this);
        return a
    },
    getWidgetButtonWidth: function() {
        var d = this,
            b = d.strip,
            e = b.child("li.sds-widget-tray"),
            c = e ? e.getMargins("l, r") : 0,
            a = 0;
        Ext.each(this.widgetButtons, function(f) {
            if (f.isVisible()) {
                a += f.getWidth() + c
            }
        }, this);
        return a
    },
    updateLayout: function() {
        var d = Ext.getCmp("sds-taskbar-panel-tray-ct"),
            c = 72,
            b = 0,
            a = d.getEl().child(".x-box-inner");
        b = c + this.getWidgetButtonWidth() + this.getTrayButtonWidth();
        d.setWidth(b);
        if (a) {
            a.setWidth(b)
        }
        Ext.getCmp("sds-taskbar-panel-wrap").doLayout();
        SYNO.SDS.StatusNotifier.fireEvent("taskbuttonchanged")
    }
});
SYNO.SDS._SystemTray.Button = Ext.extend(Ext.Button, {
    container: null,
    instance: null,
    clickTimer: 0,
    clickDelay: 300,
    enableToggle: true,
    constructor: function(b, a) {
        this.container = b;
        this.instance = a;
        SYNO.SDS._SystemTray.Button.superclass.constructor.call(this, {
            menu: null,
            clickEvent: "click",
            renderTo: this.container
        });
        this.mon(this.el, "contextmenu", this.onBtnContextMenu, this);
        if (Ext.emptyFn === this.instance.onDblClick) {
            this.clickDelay = 0
        }
        this.mon(this, "show", this.onTrayShowHide, this);
        this.mon(this, "hide", this.onTrayShowHide, this)
    },
    onTrayShowHide: function() {
        SYNO.SDS.SystemTray.updateLayout()
    },
    onClick: function() {
        SYNO.SDS._SystemTray.Button.superclass.onClick.apply(this, arguments);
        if (this.clickTimer) {
            clearTimeout(this.clickTimer);
            this.clickTimer = 0;
            this.onBtnDblClick();
            return
        }
        this.clickTimer = this.onBtnClick.createDelegate(this).defer(this.clickDelay)
    },
    onBtnClick: function() {
        this.clickTimer = 0;
        this.instance.onClick()
    },
    onBtnDblClick: function() {
        this.instance.onDblClick()
    },
    onBtnContextMenu: function(a) {
        a.preventDefault();
        this.instance.onContextMenu()
    }
});
Ext.define("SYNO.SDS._SystemTray.Component", {
    extend: "Ext.BoxComponent",
    constructor: function(a) {
        var b = this;
        b.instance = a.instance;
        b.callParent(arguments)
    },
    afterRender: function() {
        var a = this;
        a.callParent(arguments);
        a.getEl().on("click", a.onClick, a);
        a.mon(a, "show", a.onTrayShowHide, a);
        a.mon(a, "hide", a.onTrayShowHide, a)
    },
    onClick: function(c, a, d) {
        var b = this;
        if (!SYNO.SDS.DeskTopManager.isDesktopOnTop()) {
            SYNO.SDS.DeskTopManager.showDesktop()
        }
        b.instance.show();
        b.hide()
    },
    onTrayShowHide: function() {
        this.updateLayout()
    },
    updateLayout: function() {
        SYNO.SDS.SystemTray.updateLayout()
    }
});
SYNO.SDS._SystemTrayMsgMgr = {
    wins: [],
    getHeightOffset: function(b) {
        var a = 8;
        while (--b >= 0) {
            if (!this.wins[b]) {
                continue
            }
            a += 6 + this.wins[b].getHeight()
        }
        return a
    },
    alignAll: function() {
        for (var b = 0; b < this.wins.length; ++b) {
            var a = this.wins[b];
            if (!a) {
                continue
            }
            a.el.alignTo(a.animateTarget, "tr-tr", [-8, this.getHeightOffset(b)])
        }
    },
    register: function(a) {
        var b = 0;
        while (this.wins[b]) {
            b++
        }
        this.wins[b] = a;
        a.el.alignTo(a.animateTarget, "tr-tr", [-8, this.getHeightOffset(b)])
    },
    unregister: function(a) {
        var b = this.wins.indexOf(a);
        if (-1 === b) {
            return
        }
        this.wins[b] = null
    }
};
SYNO.SDS._SystemTrayMsg = Ext.extend(Ext.Window, {
    task: null,
    constructor: function(a) {
        SYNO.SDS._SystemTrayMsg.superclass.constructor.call(this, Ext.apply(a || {}, {
            width: 320,
            unstyled: true,
            cls: "sds-tray-msg-window",
            shadow: false,
            autoHeight: true,
            closable: true,
            plain: false,
            draggable: false,
            resizable: false,
            closeAction: "close",
            constrain: true,
            footer: true,
            renderTo: document.body
        }));
        if (this.autoDestroy) {
            this.task = new Ext.util.DelayedTask(this.animHide, this)
        }
        this.mon(SYNO.SDS.StatusNotifier, "taskBarPanelShow", this.animHide, this)
    },
    setMessage: function(a) {
        this.body.dom.setAttribute("role", "alert");
        this.body.update(a)
    },
    onDestroy: function() {
        SYNO.SDS._SystemTrayMsgMgr.unregister(this);
        SYNO.SDS._SystemTrayMsg.superclass.onDestroy.apply(this, arguments)
    },
    toFront: function(a) {
        this.manager.bringToFront(this);
        return this
    },
    afterShow: function() {
        SYNO.SDS._SystemTrayMsg.superclass.afterShow.apply(this, arguments);
        if (this.task) {
            this.task.delay(this.hideDelay || 5000)
        }
    },
    animShow: function() {
        SYNO.SDS._SystemTrayMsgMgr.register(this);
        this.el.slideIn("t", {
            duration: 0.3,
            callback: this.afterShow,
            scope: this
        })
    },
    animHide: function() {
        if (this.isDestroyed) {
            return
        }
        this.el.ghost("r", {
            duration: 0.5,
            remove: false,
            callback: this.close,
            scope: this
        })
    }
});
Ext.namespace("SYNO.SDS._TaskBar");
Ext.define("SYNO.SDS._TaskBar", {
    extend: "Ext.Container",
    constructor: function() {
        var a = [];
        Ext.getBody().createChild({
            id: "sds-taskbar-shadow"
        });
        a.push(new SYNO.SDS._TaskButtons());
        SYNO.SDS._TaskBar.superclass.constructor.call(this, {
            id: "sds-taskbar",
            layout: "column",
            monitorResize: true,
            items: [this.leftTaskBar = new SYNO.SDS._TaskBar.Left(), new Ext.Container({
                id: "sds-taskbar-panel-wrap",
                boxMinWidth: 210,
                columnWidth: 1,
                layout: "border",
                items: [new Ext.Container({
                    id: "sds-taskbar-panel-wrap2",
                    items: a,
                    layout: "border",
                    region: "center"
                }), new Ext.Container({
                    id: "sds-taskbar-panel-tray-ct",
                    region: "east",
                    width: 38,
                    layout: "hbox",
                    items: [new SYNO.SDS._OverflowButton(), new SYNO.SDS._SystemTray()]
                })]
            }), this.rightTaskBar = new SYNO.SDS._TaskBar.Right(), new Ext.Container({
                width: 2,
                height: 39
            })],
            renderTo: document.body
        })
    },
    addTaskBarButton: function(a) {
        var b = this;
        b.add(a);
        b.doLayout()
    },
    addDesktopViewButton: function(a) {
        var c = this,
            b = null;
        b = c.leftTaskBar.addDesktopViewButton(a);
        c.doLayout();
        return b
    },
    addTrayIconViewButton: function(a) {
        var c = this,
            b = null;
        b = c.rightTaskBar.addTrayIconViewButton(a);
        c.doLayout();
        return b
    }
});
Ext.define("SYNO.SDS._TaskBar.Left", {
    extend: "Ext.BoxComponent",
    buttons: undefined,
    constructor: function() {
        SYNO.SDS._TaskBar.Left.superclass.constructor.call(this, {
            id: "sds-taskbar-left",
            autoWidth: true
        });
        this.buttons = []
    },
    addDesktopViewButton: function(a) {
        var b = null;
        a = a || {};
        a.renderTo = Ext.value(a.renderTo, Ext.id());
        Ext.DomHelper.append(this.getEl(), [{
            id: a.renderTo
        }]);
        b = new Ext.Button(a);
        this.buttons.push(b);
        return b
    }
});
SYNO.SDS._TaskBar.Right = Ext.extend(Ext.BoxComponent, {
    constructor: function() {
        SYNO.SDS._TaskBar.Right.superclass.constructor.call(this, {
            id: "sds-taskbar-right",
            autoWidth: true
        })
    },
    addTrayIconViewButton: function(a) {
        var b = null;
        a = a || {};
        a.renderTo = Ext.value(a.renderTo, Ext.id());
        b = new Ext.Button(a);
        return b
    },
    afterRender: function() {
        SYNO.SDS._TaskBar.Right.superclass.afterRender.apply(this, arguments);
        this.userButton.btnEl.setARIA({
            label: _T("common", "webman_options"),
            tabindex: 0
        });
        if (this.previewButton) {
            this.previewButton.btnEl.setARIA({
                label: _T("desktop", "expose_window"),
                tabindex: 0
            })
        }
        this.searchButton.btnEl.setARIA({
            label: _T("user", "search_user"),
            tabindex: 0
        })
    },
    onRender: function() {
        SYNO.SDS._TaskBar.Right.superclass.onRender.apply(this, arguments);
        Ext.DomHelper.append(this.el, [{
            cls: "sds-taskbar-right-left"
        }, {
            cls: "sds-taskbar-right-center",
            children: [{
                id: "sds-taskbar-notification-button"
            }, {
                id: "sds-taskbar-user-button"
            }, {
                id: "sds-taskbar-search-button"
            }, {
                id: "sds-taskbar-widget-button"
            }, {
                id: "sds-taskbar-preview-button"
            }]
        }, {
            cls: "sds-taskbar-right-right"
        }]);
        this.userButton = new Ext.Button({
            scope: this,
            handler: this.userHandler,
            tooltip: _T("common", "webman_options"),
            enableToggle: true,
            renderTo: "sds-taskbar-user-button"
        });
        this.searchButton = new Ext.Button({
            tooltip: _T("user", "search_user"),
            enableToggle: true,
            renderTo: "sds-taskbar-search-button"
        });
        if (SYNO.SDS.UIFeatures.test("exposeWindow")) {
            this.previewButton = new Ext.Button({
                scope: SYNO.SDS.WindowMgr,
                disabled: true,
                handler: SYNO.SDS.WindowMgr.exposeWindow,
                tooltip: _T("desktop", "expose_window"),
                enableToggle: true,
                renderTo: "sds-taskbar-preview-button"
            });
            this.previewButton.mon(SYNO.SDS.StatusNotifier, "taskbuttonchanged", function() {
                if (!SYNO.SDS.TaskButtons || !Ext.isFunction(SYNO.SDS.TaskButtons.getAllAppWins)) {
                    return
                }
                var a = SYNO.SDS.TaskButtons.getAllAppWins();
                this.previewButton.setDisabled((a.length === 0))
            }, this);
            this.previewButton.mon(Ext.getDoc(), "mousedown", function() {
                this.previewButton.toggle(false)
            }, this)
        }
    },
    userHandler: function() {
        if (!this.userMenuPanel) {
            this.userMenuPanel = new SYNO.SDS._UserMenu({
                toggleBtn: this.userButton
            })
        }
    }
});
SYNO.SDS._UserMenu = Ext.extend(Ext.Panel, {
    constructor: function(a) {
        var b = {
            renderTo: document.body,
            frame: true,
            shadow: false,
            baseCls: "sds-user-menu",
            items: [{
                xtype: "menu",
                floating: false,
                plain: true,
                items: this.initButtonList()
            }]
        };
        this.cfg = a;
        this.btn = a.toggleBtn;
        SYNO.SDS._UserMenu.superclass.constructor.call(this, b);
        this.mon(Ext.getDoc(), "mousedown", this.onMouseDown, this);
        this.mon(SYNO.SDS.StatusNotifier, "systemTrayNotifyMsg", this.hide, this)
    },
    initButtonList: function() {
        var a = [{
            xtype: "menutextitem",
            cls: "sds-user-menu-username",
            text: _S("user")
        }, "-", {
            text: _T("common", "webman_options"),
            iconCls: "sds-user-menu-options",
            overCls: "sds-user-menu-options-over",
            itemId: "user-menu-options",
            scope: this,
            listeners: {
                render: {
                    fn: function(b) {
                        b.el.addClassOnClick("sds-user-menu-options-click")
                    },
                    scope: this
                }
            },
            handler: function() {
                this.hideBox();
                SYNO.SDS.DeskTopManager.showDesktop();
                SYNO.SDS.AppLaunch("SYNO.SDS.App.PersonalSettings.Instance", {}, false)
            }
        }];
        if (true === _S("is_admin")) {
            a.push("-", {
                disabled: _S("demo_mode"),
                tooltip: _S("demo_mode") ? _JSLIBSTR("uicommon", "error_demo") : "",
                text: _T("system", "reboot_opt"),
                iconCls: "sds-user-menu-restart",
                overCls: "sds-user-menu-restart-over",
                scope: this,
                listeners: {
                    render: {
                        fn: function(b) {
                            b.el.addClassOnClick("sds-user-menu-restart-click")
                        },
                        scope: this
                    }
                },
                handler: function() {
                    this.hideBox();
                    SYNO.SDS.System.Reboot()
                }
            });
            a.push({
                disabled: _S("demo_mode"),
                tooltip: _S("demo_mode") ? _JSLIBSTR("uicommon", "error_demo") : "",
                text: ("yes" === _D("support_poweroff")) ? _T("system", "poweroff_opt") : _T("system", "halt_opt"),
                iconCls: "sds-user-menu-shutdown",
                overCls: "sds-user-menu-shutdown-over",
                scope: this,
                listeners: {
                    render: {
                        fn: function(b) {
                            b.el.addClassOnClick("sds-user-menu-shutdown-click")
                        },
                        scope: this
                    }
                },
                handler: function() {
                    this.hideBox();
                    SYNO.SDS.System.PowerOff()
                }
            })
        }
        a.push("-", {
            text: _T("personal_settings", "about"),
            iconCls: "sds-user-menu-about",
            overCls: "sds-user-menu-about-over",
            scope: this,
            listeners: {
                render: {
                    fn: function(b) {
                        b.el.addClassOnClick("sds-user-menu-about-click")
                    },
                    scope: this
                }
            },
            handler: function() {
                this.hideBox();
                SYNO.SDS.DeskTopManager.showDesktop();
                SYNO.SDS.System.About()
            }
        }, "-", {
            text: _T("common", "logout"),
            iconCls: "sds-user-menu-logout",
            overCls: "sds-user-menu-logout-over",
            scope: this,
            listeners: {
                render: {
                    fn: function(b) {
                        b.el.addClassOnClick("sds-user-menu-logout-click")
                    },
                    scope: this
                }
            },
            handler: function() {
                SYNO.SDS.System.Logout()
            }
        });
        return a
    },
    onMouseDown: function(a) {
        if (a.within(this.btn.getEl())) {
            this.toggleBox()
        } else {
            if (this.isVisible() && !a.within(this.el)) {
                this.hideBox()
            }
        }
    },
    hideBox: function() {
        this.hide();
        this.btn.toggle(false)
    },
    showBox: function() {
        this.show()
    },
    toggleBox: function() {
        if (this.isVisible()) {
            this.hide()
        } else {
            SYNO.SDS.StatusNotifier.fireEvent("taskBarPanelShow");
            this.showBox()
        }
    }
});
SYNO.SDS._OverflowButton = Ext.extend(Ext.Button, {
    constructor: function() {
        SYNO.SDS._OverflowButton.superclass.constructor.call(this, {
            cls: "sds-taskbar-overflow-menu-button",
            hidden: true,
            scope: this,
            handler: this.clickHandler
        });
        this.mon(SYNO.SDS.StatusNotifier, "taskbuttonchanged", this.doShowHide, this);
        Ext.EventManager.onWindowResize(this.doShowHide, this, {
            delay: 100
        })
    },
    clickHandler: function() {
        if (!this.panel) {
            this.panel = new SYNO.SDS._OverflowMenu({
                toggleBtn: this
            });
            this.panel.showBox()
        }
    },
    doShowHide: function() {
        if (!SYNO.SDS.TaskButtons) {
            return
        }
        var a = SYNO.SDS.TaskButtons.isButtonOverflow();
        SYNO.SDS.TaskButtons.hideOverflowedButtons();
        this.setVisible(a);
        if (!a && this.panel) {
            this.panel.hide()
        }
    }
});
SYNO.SDS._OverflowMenu = Ext.extend(Ext.Panel, {
    constructor: function(a) {
        var b = {
            renderTo: document.body,
            shadow: false,
            cls: "sds-tray-panel sds-overflow-menu",
            items: [{
                xtype: "menu",
                itemId: "menu",
                floating: false,
                plain: true
            }]
        };
        this.cfg = a;
        this.btn = a.toggleBtn;
        SYNO.SDS._OverflowMenu.superclass.constructor.call(this, b);
        this.mon(Ext.getDoc(), "mousedown", this.onMouseDown, this);
        this.mon(SYNO.SDS.StatusNotifier, "systemTrayNotifyMsg", this.hide, this);
        Ext.EventManager.onWindowResize(this.hideBox, this)
    },
    onMenuItemClick: function(c, a) {
        var b = Ext.getCmp(c.originalBtnId);
        if (b) {
            b.onClick(a)
        }
        this.hideBox()
    },
    onMouseDown: function(a) {
        if (a.within(this.btn.getEl())) {
            this.toggleBox()
        } else {
            if (this.isVisible() && !a.within(this.el)) {
                this.hideBox()
            }
        }
    },
    hideBox: function() {
        this.hide()
    },
    showBox: function() {
        var e = this.btn.el,
            b, d, a = SYNO.SDS.Desktop.getEl(),
            c = a.getWidth();
        this.show();
        this.setMenuItems();
        b = e.getLeft();
        d = this.getWidth();
        if (b + d > c) {
            b = c - d
        }
        this.el.setLeft(b)
    },
    toggleBox: function() {
        if (this.isVisible()) {
            this.hideBox()
        } else {
            SYNO.SDS.StatusNotifier.fireEvent("taskBarPanelShow");
            this.showBox()
        }
    },
    setMenuItems: function() {
        var b;
        if (!SYNO.SDS.TaskButtons) {
            return
        }
        b = this.getComponent("menu");
        b.removeAll(true);
        var a = this.getOverflowedItems();
        b.add(a);
        b.items.each(function(c) {
            if (c && c.el) {
                c.el.set({
                    "ext:qtip": c.text
                });
                c.el.addClassOnClick("sds-overflow-items-click")
            }
        }, this)
    },
    getOverflowedItems: function() {
        var a, b = [];
        if (!SYNO.SDS.TaskButtons) {
            return b
        }
        a = SYNO.SDS.TaskButtons.getOverflowedButtons();
        if (!Ext.isArray(a) || a.length === 0) {
            return b
        }
        Ext.each(a, function(d) {
            var c = d.jsConfig,
                e = c.jsBaseURL + "/" + (c.icon || c.icon_36),
                f = SYNO.SDS.Utils.GetLocalizedString(d.title || c.title, c.jsID);
            b.push({
                text: f,
                icon: SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(e, "Taskbar"),
                originalBtnId: d.id,
                scope: this,
                handler: this.onMenuItemClick
            });
            b.push("-")
        }, this);
        b.splice(b.length - 1, 1);
        return b
    }
});
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
    onContextMenu: function(a) {
        a.preventDefault();
        if (!this.contextMenu) {
            return
        }
        Ext.QuickTips.getQuickTip().cancelShow(this.dragEl);
        this.contextMenu.showAt(a.getXY())
    },
    openNewWindow: function() {
        SYNO.SDS.WindowLaunch(this.className)
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
Ext.define("SYNO.SDS.Logo", {
    extend: "Ext.Component",
    theme: "light",
    logoArray: ["synology", "DSM"],
    constructor: function(a) {
        var b = this;
        a = Ext.applyIf(a || {}, {
            cls: "sds-logo"
        });
        b.callParent([a])
    },
    onRender: function(b, a) {
        var c = this;
        c.callParent(arguments);
        c.el.addClass(c.theme);
        c.logoArray.each(function(d) {
            this[d] = this.el.createChild({
                cls: "logo-" + d
            })
        }, c)
    }
});
Ext.define("SYNO.SDS.CopyRightLogo", {
    extend: "Ext.Component",
    theme: "light",
    onRender: function(b, a) {
        this.callParent(arguments);
        this.el.addClass(this.theme);
        this.el.createChild({
            cls: "logo-copyright_2014"
        })
    }
});
Ext.define("SYNO.SDS.DSM5Logo", {
    extend: "SYNO.SDS.Logo",
    logoArray: ["synology", "DSM", "5dot"],
    version: 0,
    isBeta: false,
    onRender: function(c, a) {
        var e = this,
            b = e.version,
            d = [];
        e.callParent(arguments);
        b = Ext.isNumber(b) ? b : 0;
        b += "";
        d = b.split("");
        d.each(function(f) {
            this.el.createChild({
                cls: "logo-" + f
            })
        }, e);
        if (e.isBeta) {
            e.el.createChild({
                cls: "logo-beta"
            });
            e.el.addClass("beta")
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
        var a = _S("diskless") ? "wallpaper_us2.png" : "wallpapers.png";
        SYNO.SDS._StandaloneDesktop.superclass.constructor.call(this, {
            id: "sds-desktop",
            style: "background: transparent url(resources/images/" + a + ") left bottom repeat-x; top: 0px",
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
    defShortCuts: [{
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
    isBeta: true,
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
        a.dsmLogo = new SYNO.SDS.DSM5Logo({
            id: "sds-logo",
            version: 2,
            isBeta: a.isBeta,
            renderTo: a.getEl()
        });
        this.items = [];
        this.iconItems = [];
        this.updateTask = new Ext.util.DelayedTask(this.updateItems, this);
        this.mon(this.el, "scroll", function(c) {
            var b = this.el.getBox();
            if (this.el.dom.scrollTop > 0 && b.height >= SYNO.SDS.DesktopSetting.miniHeight) {
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
Ext.namespace("SYNO.SDS._PreviewBox");
SYNO.SDS._PreviewBox = Ext.extend(Ext.BoxComponent, {
    inited: false,
    defaultZIndex: 13000,
    defaultLeft: 0,
    defaultTop: 46,
    hideTop: 25,
    boxWidth: 240,
    cloneWinMaxWidth: 220,
    cloneWinMaxHeight: 116,
    hideDelay: 500,
    showDelay: 500,
    constructor: function() {
        SYNO.SDS._PreviewBox.superclass.constructor.call(this, {
            renderTo: document.body,
            cls: "sds-previewbox",
            hidden: true
        });
        this.inited = false;
        this.hoverCount = 0
    },
    createBoxElements: function() {
        var a = this.getEl(),
            b;
        a.createChild({
            cls: "sds-previewbox-background"
        });
        this.boxMc = a.createChild({
            tag: "div",
            cls: "sds-previewbox-mc"
        });
        this.arrow = a.createChild({
            tag: "div",
            cls: "sds-previewbox-arrow"
        });
        b = this.boxMc;
        this.desc = b.createChild({
            tag: "div",
            cls: "sds-previewbox-desc"
        });
        this.win = b.createChild({
            tag: "div",
            cls: "sds-previewbox-win"
        });
        this.inited = true;
        this.mon(Ext.get("sds-taskbar"), "click", this.onTaskbarClick, this);
        this.mon(Ext.get("sds-taskbar"), "contextmenu", this.onTaskbarClick, this)
    },
    onTaskbarClick: function() {
        this.hideBox(true)
    },
    showBox: function(a) {
        if (!this.isEnabled()) {
            return
        }
        this.needShowBox = true;
        this.hoverCount += 1;
        this.increaseTaskbarZIndex();
        this.doShowBox.defer(300, this, [a, this.hoverCount])
    },
    doShowBox: function(e, d) {
        var c, g, a, b, f;
        if (!e || !e.win || !e.centerX) {
            SYNO.Debug("required parameters not exist, obj:", e);
            return
        }
        if (this.hoverCount !== d) {
            return
        }
        if (!this.needShowBox) {
            return
        }
        if (!this.inited) {
            this.createBoxElements()
        }
        b = Ext.isNumber(e.centerX) ? e.centerX : this.defaultLeft;
        c = e.win;
        g = c.getEl();
        if (c.jsConfig && c.getTitle()) {
            f = SYNO.SDS.Utils.GetLocalizedString(c.getTitle(), c.jsConfig.jsID)
        } else {
            f = c.title || ""
        }
        this.desc.update(f || "");
        if (this.clonedEl) {
            this.clonedEl.remove()
        }
        this.clonedEl = this.getClonedEl(c);
        this.clonedEl.show();
        this.win.appendChild(this.clonedEl);
        a = this.getEl();
        if (this.isVisible()) {
            a.setTop(this.defaultTop);
            this.show();
            a.shift({
                left: b - (this.boxWidth / 2),
                opacity: 1,
                duration: 0.3
            })
        } else {
            a.setLeftTop(b - (this.boxWidth / 2), this.hideTop);
            a.setOpacity(0);
            this.show();
            a.shift({
                top: this.defaultTop,
                opacity: 1,
                duration: 0.8
            })
        }
        this.hoverCount = 0
    },
    hideBox: function(a) {
        if (!this.isEnabled()) {
            return
        }
        this.needShowBox = false;
        (function() {
            if (this.needShowBox) {
                return
            }
            this.doHideBox(a)
        }).defer((a === true) ? 0 : 300, this)
    },
    doHideBox: function(b) {
        var c;
        var a = function() {
            if (this.needShowBox) {
                return
            }
            this.hide();
            this.decreaseTaskbarZIndex()
        };
        if (this.clonedEl) {
            this.clonedEl.remove()
        }
        this.hoverCount = 0;
        if (b === true) {
            a.call(this);
            return
        }
        c = this.getEl();
        c.shift({
            top: this.hideTop,
            opacity: 0,
            duration: 0.2,
            scope: this,
            callback: a
        })
    },
    getClonedEl: function(e) {
        var c = 0;
        var h = 0;
        var g = e.getEl();
        var b = g.dom.cloneNode(true);
        b.removeAttribute("id");
        var f = Ext.get(b);
        f._previewMask = f.createChild({
            tag: "div",
            cls: "sds-previewbox-win-mask"
        });
        var a = g.getSize();
        var d = this.cloneWinMaxWidth / a.width;
        c = (this.cloneWinMaxHeight - a.height * d) / 2;
        if ((a.height * d) > this.cloneWinMaxHeight) {
            d = this.cloneWinMaxHeight / a.height;
            c = 0;
            h = (this.cloneWinMaxWidth - a.width * d) / 2
        }
        d = Math.min(d, 1);
        f._previewMask.setStyle("boxShadow", String.format("0px {0}px {1}px rgba(0, 0, 0, 0.4)", 3 / d, 6 / d));
        f.addClass("sds-previewbox-win-transform");
        f.setStyle("-webkit-transform", String.format("scale({0})", d));
        f.setStyle("-moz-transform", String.format("scale({0})", d));
        f.setStyle("-o-transform", String.format("scale({0})", d));
        f.setStyle("transform", String.format("scale({0})", d));
        f.setStyle("msTransform", String.format("scale({0})", d));
        f.setStyle("boxShadow", "0 0 0");
        f.setLeftTop(h, c);
        return f
    },
    increaseTaskbarZIndex: function() {
        SYNO.SDS.TaskBar.getEl().setStyle("z-index", this.defaultZIndex + 2)
    },
    decreaseTaskbarZIndex: function() {
        SYNO.SDS.TaskBar.getEl().setStyle("z-index", "")
    },
    isEnabled: function() {
        if (!SYNO.SDS.UIFeatures.test("previewBox")) {
            return false
        }
        if (false === SYNO.SDS.UserSettings.getProperty("Desktop", "enableTaskbarThumbnail")) {
            return false
        }
        return true
    }
});
Ext.namespace("SYNO.SDS._SearchBox");
SYNO.SDS._SearchBox = Ext.extend(Ext.Panel, {
    INIT_STATE_CLS: "sds-searchbox-init-state",
    constructor: function() {
        this.store = this.getStore();
        this.searchField = this.getSearchField();
        this.resultPanel = this.getResultPanel();
        SYNO.SDS._SearchBox.superclass.constructor.call(this, {
            renderTo: document.body,
            shadow: false,
            baseCls: "sds-searchbox",
            hidden: true,
            header: true,
            headerAsText: false,
            footer: true,
            listeners: {
                scope: this,
                show: function() {
                    this.searchField.focus(false, 100);
                    this.adjustPanelHeight()
                }
            },
            items: [this.resultPanel]
        });
        this.initToolbar();
        this.addClass(this.INIT_STATE_CLS);
        this.mon(SYNO.SDS.StatusNotifier, "systemTrayNotifyMsg", this.hideBox, this);
        this.mon(Ext.getDoc(), "mousedown", this.onMouseDown, this);
        this.mon(this.resultPanel.getEl(), "click", this.onResultClick, this);
        Ext.EventManager.onWindowResize(this.hideBox, this)
    },
    onMouseDown: function(a) {
        if (a.within(Ext.get("sds-taskbar-search-button"))) {
            this.toggleBox()
        } else {
            if (this.isVisible() && !a.within(this.el)) {
                this.hideBox()
            }
        }
    },
    getSearchField: function() {
        var a = new Ext.form.TextField({
            value: "",
            emptyText: _T("log", "search"),
            cls: "sds-searchbox-input",
            enableKeyEvents: true,
            autoCreate: {
                tag: "input",
                type: "text",
                autocomplete: "off"
            },
            listeners: {
                keyup: {
                    scope: this,
                    fn: this.onInputFieldKeyUp,
                    buffer: 500
                }
            }
        });
        return a
    },
    onInputFieldKeyUp: function(b, a) {
        this.checkSearchField()
    },
    cancelHandler: function() {
        this.searchField.setValue("");
        this.searchField.focus(false, 200);
        this.checkSearchField()
    },
    checkSearchField: function() {
        var a = this.searchField.getValue();
        if (a === this.lastQuery) {
            return
        }
        this.lastQuery = a;
        if (a === "") {
            this.addClass(this.INIT_STATE_CLS)
        } else {
            this.removeClass(this.INIT_STATE_CLS);
            this.setContentSearching();
            this.store.load({
                params: {
                    query: a
                }
            })
        }
    },
    getResultPanel: function() {
        var a = new Ext.BoxComponent({
            hidden: false,
            cls: "sds-search-result",
            getScrollTarget: function() {
                return this.getEl().first()
            },
            tpl: new Ext.XTemplate('<div class="sds-searchbox-result-div">', '<tpl for=".">', "<tpl if=\"type === 'app'\">", '<tpl if="!(this.appSection++)"><div class="section">{[_T("backup", "application")]}</div></tpl>', '<div class="sds-searchbox-result-item" ext:qtip="{desc}">', '<img border=0 align="left" width={this.iconSize} src="{[SYNO.SDS.Utils.GetAppIcon(values.owner || SYNO.SDS.Utils.ParseSearchID(values.id).className, "TreeIcon")]}" />', '<table border="0">', "<tr>", '<td class="topic"><div>{title}</div></td>', '<td class="module"><div>{[SYNO.SDS.Utils.GetAppTitle(values.owner)]}</div></td>', "</tr>", "</table>", "</div>", "</tpl>", "<tpl if=\"type === 'help'\">", '<tpl if="!(this.helpSection++)"><div class="sds-searchbox-result-splitline"></div><div class="section">{[_T("helpbrowser", "apptitle")]}</div></tpl>', '<div class="sds-searchbox-result-item">', '<img border=0 align="left" src="{[SYNO.SDS.Utils.GetAppIcon("SYNO.SDS.HelpBrowser.Application", "TreeIcon")]}" width={this.iconSize} ></img>', '<table border="0">', "<tr>", '<td class="topic"><div>{title}</div></td>', '<td class="module"><div>{[SYNO.SDS.Utils.GetAppTitle(values.owner)]}</div></td>', "</tr>", "</table>", "</div>", "</tpl>", "</tpl>", "</div>", {
                appSection: 0,
                helpSection: 0,
                iconSize: SYNO.SDS.UIFeatures.IconSizeManager.TreeIcon + "px"
            })
        });
        a.mon(this.store, "datachanged", function() {
            a.tpl.appSection = 0;
            a.tpl.helpSection = 0
        }, this);
        return a
    },
    initToolbar: function() {
        var a = [{
            xtype: "container",
            cls: "sds-searchbox-input-wrap",
            layout: "absolute",
            items: [{
                xtype: "box",
                cls: "sds-searchbox-input-left"
            }, {
                xtype: "container",
                cls: "sds-searchbox-input-center",
                items: [this.searchField]
            }, {
                xtype: "button",
                scope: this,
                handler: this.cancelHandler,
                cls: "sds-searchbox-input-cancel"
            }]
        }];
        this.headerBar = new Ext.Toolbar({
            renderTo: this.header,
            items: a
        })
    },
    getStore: function() {
        var a = new Ext.data.Store({
            autoDestroy: true,
            proxy: new Ext.data.HttpProxy({
                url: "modules/Indexer/uisearch.cgi",
                method: "GET"
            }),
            reader: new Ext.data.JsonReader({
                root: "items",
                id: "_random"
            }, ["id", "title", {
                name: "desc",
                convert: function(c, b) {
                    return String.format(c, _D("product"))
                }
            }, "owner", "topic", "type"]),
            baseParams: {
                lang: _S("lang"),
                type: "app"
            },
            listeners: {
                scope: this,
                load: this.onStoreLoad
            }
        });
        return a
    },
    onStoreLoad: function(c, b, e) {
        var a = [];

        function f(h) {
            var i = "";
            switch (h.get("type")) {
                case "app":
                    i = SYNO.SDS.Utils.ParseSearchID(h.get("id")).className;
                    if (SYNO.SDS.Utils.isHiddenControlPanelModule(h.get("id"))) {
                        return false
                    }
                    break;
                case "help":
                    i = "SYNO.SDS.HelpBrowser.Application";
                    break;
                default:
                    return true
            }
            return SYNO.SDS.StatusNotifier.isAppEnabled(i)
        }
        this.removeClass(this.INIT_STATE_CLS);
        c.filterBy(f);
        c.each(function(h) {
            a.push(h.data)
        }, this);
        var g, d;
        if (a.length === 0) {
            if (c.reader.jsonData.noindexdb) {
                g = c.reader.jsonData.msg;
                d = c.reader.jsonData.error;
                if (g) {
                    this.setContent(_T(g.section, g.key))
                } else {
                    if (d) {
                        this.setContent(_T(d.section, d.key))
                    } else {
                        this.setContent(_T("helptoc", "try_download_indexdb") || "Try to download indexdb")
                    }
                }
            } else {
                this.setContentNoResult()
            }
        } else {
            this.resultPanel.update(a)
        }
        this.adjustPanelHeight();
        this.resultPanel.show()
    },
    setContent: function(a) {
        this.resultPanel.update(a)
    },
    setContentNoResult: function() {
        this.resultPanel.update(_T("search", "no_search_result") || "No Results")
    },
    setContentSearching: function() {
        this.resultPanel.update(_T("common", "searching"))
    },
    adjustPanelHeight: function() {
        var c = this.getHeight();
        var e = this.resultPanel.getEl().getPadding("t") + this.resultPanel.getEl().getPadding("b");
        var b = Ext.get("sds-desktop").getHeight();
        var d = this.resultPanel.getEl().first();
        if (null !== d) {
            var a = this.resultPanel.getEl().child(".contentwrapper");
            if (a !== null) {
                c = this.headerBar.getHeight() + a.getHeight() + e
            }
            if (c > b) {
                d.setHeight(b - (this.headerBar.getHeight() + e))
            } else {
                d.setHeight(c - (this.headerBar.getHeight() + e))
            }
        }
        this.updateScrollbar()
    },
    updateScrollbar: function() {
        this.resultPanel.updateScroller()
    },
    onResultClick: function(h, c, d) {
        var b = "div.sds-searchbox-result-item",
            a = this.resultPanel.getEl(),
            e = Ext.query(b, a.dom),
            i = h.getTarget(b, a),
            g = e.indexOf(i),
            f = this.store.getAt(g);
        if (g === -1 || !f) {
            return
        }
        this.launchApp(f, g);
        this.hideBox()
    },
    launchApp: function(a, b) {
        var c = {
            className: null,
            params: {}
        };
        switch (a.get("type")) {
            case "app":
                c = SYNO.SDS.Utils.ParseSearchID(a.get("id"));
                break;
            case "help":
                c.className = "SYNO.SDS.HelpBrowser.Application";
                c.params.topic = a.get("id");
                break;
            default:
        }
        if (c.className) {
            SYNO.SDS.DeskTopManager.showDesktop();
            SYNO.SDS.AppLaunch(c.className, c.params)
        }
    },
    showBox: function() {
        SYNO.SDS.StatusNotifier.fireEvent("taskBarPanelShow");
        this.show()
    },
    hideBox: function() {
        var a = Ext.getCmp("sds-taskbar-right").searchButton;
        a.toggle(false);
        this.hide()
    },
    toggleBox: function() {
        if (this.isVisible()) {
            this.hide()
        } else {
            this.showBox()
        }
    }
});
Ext.namespace("SYNO.SDS.AppInstance");
SYNO.SDS.AppInstance = Ext.extend(Ext.Component, {
    window: null,
    trayItem: null,
    instances: null,
    taskButton: null,
    blMainApp: false,
    constructor: function(a) {
        if (_S("standalone")) {
            this.blMainApp = (this.jsConfig.jsID === _S("standaloneAppName"))
        }
        SYNO.SDS.AppInstance.superclass.constructor.apply(this, arguments);
        SYNO.SDS.AppMgr.register(this)
    },
    beforeDestroy: function() {
        if (this.fullsize === true) {
            SYNO.SDS.StatusNotifier.fireEvent("fullsizeappdestroy")
        }
        SYNO.SDS.AppInstance.superclass.beforeDestroy.apply(this, arguments);
        this.onBeforeDestroy()
    },
    onBeforeDestroy: function() {
        this.instances = null;
        this.window = null;
        this.trayItem = null;
        this.appItem = null;
        this.taskButton = null;
        SYNO.SDS.AppMgr.unregister(this)
    },
    beforeOpen: Ext.emptyFn,
    initInstance: function(c) {
        var b;
        if (!this.window && this.appWindowName) {
            if (this.fullsize === true) {
                var a = (this.shouldLaunch) ? this.shouldLaunch() : false;
                if (!a) {
                    this.destroy();
                    return
                }
            }
            b = Ext.getClassByName(this.appWindowName);
            this.window = new b(Ext.apply({
                appInstance: this,
                fromRestore: c.fromRestore
            }, c.windowState || {}));
            this.addInstance(this.window);
            this.window.init();
            this.window.open(c)
        }
        if (!this.trayItem && this.appTrayItemName) {
            b = Ext.getClassByName(this.appTrayItemName);
            this.trayItem = new b(Ext.apply({
                appInstance: this
            }));
            this.addInstance(this.trayItem);
            this.trayItem.open(c)
        }
        if (!this.appItem && this.appItemName) {
            b = Ext.getClassByName(this.appItemName);
            this.appItem = new b(Ext.apply({
                appInstance: this
            }));
            this.addInstance(this.appItem);
            this.appItem.open(c)
        }
    },
    open: function(a) {
        if (!Ext.isObject(a) || !Ext.isNumber(a.cms_id) || 0 >= a.cms_id) {
            return this.delayOpen(a)
        }
        SYNO.API.Info.UpdateById({
            cms_id: a.cms_id,
            callback: this.delayOpen,
            args: arguments,
            scope: this
        }, true)
    },
    delayOpen: function() {
        if (this.opened) {
            return this.onRequest.apply(this, arguments)
        }
        this.opened = true;
        return this.onOpen.apply(this, arguments)
    },
    onOpen: function(a) {
        if (false === this.beforeOpen(a)) {
            this.destroy();
            return
        }
        this.initInstance(a);
        this.checkAlive()
    },
    onRequest: function(a) {
        if (this.window) {
            this.window.open(a)
        }
        if (this.trayItem) {
            this.trayItem.open(a)
        }
        if (this.appItem) {
            this.appItem.open(a)
        }
    },
    checkAlive: function() {
        if (this.destroying) {
            return
        }
        if (!this.instances || !this.instances.length) {
            this.destroy()
        }
    },
    addInstance: function(a) {
        a.appInstance = this;
        this.instances = this.instances || [];
        this.instances.push(a);
        this.addManagedComponent(a)
    },
    removeInstance: function(a) {
        a.appInstance = null;
        this.instances = this.instances || [];
        this.instances.remove(a);
        this.removeManagedComponent(a);
        this.checkAlive()
    },
    shouldNotifyMsg: function(a, b) {
        return true
    },
    getUserSettings: function(a) {
        return SYNO.SDS.UserSettings.getProperty(this.jsConfig.jsID, a)
    },
    setUserSettings: function(a, b) {
        return SYNO.SDS.UserSettings.setProperty(this.jsConfig.jsID, a, b)
    },
    getStateParam: function() {
        var a = {
            windowState: {}
        };
        if (Ext.isEmpty(this.window)) {
            return a
        }
        Ext.apply(a, {
            windowState: this.window.getStateParam()
        }, this.window.openConfig);
        return a
    }
});
Ext.namespace("SYNO.SDS.BaseWindow");
Ext.define("SYNO.SDS.AbstractWindow", {
    extend: "Ext.Window",
    constructor: function(b) {
        var a = Ext.urlDecode(location.search.substr(1));
        this.enableAlertHeight = a.alertHeight;
        var c = SYNO.SDS.Desktop ? SYNO.SDS.Desktop.getEl() : Ext.getBody();
        b = Ext.apply({
            autoFitDesktopHeight: false,
            maximizable: true,
            minimizable: true,
            closable: true,
            onEsc: Ext.emptyFn,
            width: 300,
            height: 300,
            constrain: false,
            constrainHeader: true,
            modal: false,
            renderTo: c,
            manager: SYNO.SDS.WindowMgr
        }, b);
        SYNO.SDS.AbstractWindow.superclass.constructor.call(this, b);
        if ((this.constrain || this.constrainHeader) && this.resizer) {
            this.resizer.constrainTo = this.container
        }
    },
    initEvents: function() {
        SYNO.SDS.AbstractWindow.superclass.initEvents.apply(this, arguments);
        if (this.resizer) {
            var b = Ext.Resizable.positions;
            for (var a in b) {
                if (this.resizer[b[a]]) {
                    this.mon(this.resizer[b[a]].el, "mousedown", this.toFront, this)
                }
            }
        }
        this.mon(this, "beforeclose", this.onClose, this);
        this.mon(this, "maximize", this.onMaximize, this);
        this.mon(this, "minimize", this.onMinimize, this);
        this.mon(this, "restore", this.onRestore, this);
        this.mon(this, "activate", this.onActivate, this);
        this.mon(this, "deactivate", this.onDeactivate, this);
        if (this.header) {
            this.mon(this.header, "contextmenu", this.onHeaderContextMenu, this)
        }
    },
    onClose: Ext.emptyFn,
    onMaximize: Ext.emptyFn,
    onMinimize: Ext.emptyFn,
    onRestore: Ext.emptyFn,
    onActivate: Ext.emptyFn,
    onDeactivate: Ext.emptyFn,
    onHeaderContextMenu: function(a) {
        a.preventDefault()
    },
    onShow: function() {
        this.removeClass("syno-window-hide");
        delete this.hideForMinimize;
        if (this.enableAlertHeight && this.isVisible() && (this.getHeight() > 580)) {
            window.alert(String.format("Height: {0}px, Plz contact your PM to adjust UI.", this.getHeight()))
        }
        if (this.autoFitDesktopHeight) {
            this.adjustHeightByValue(SYNO.SDS.Desktop.getHeight())
        }
    },
    adjustHeightByValue: function(a, b) {
        if (!this.isVisible() && !Ext.isDefined(b)) {
            return
        }
        if (this.getHeight() > a) {
            this.setHeight(a)
        }
    },
    beforeDestroy: function() {
        this.onBeforeDestroy();
        SYNO.SDS.AbstractWindow.superclass.beforeDestroy.apply(this, arguments)
    },
    setIcon: function(a) {
        if (this.header) {
            this.header.setStyle("background-image", a ? "url(" + a + ")" : "")
        }
    },
    onBeforeDestroy: function() {
        if (this.appInstance) {
            this.appInstance.removeInstance(this)
        }
    },
    open: function() {
        if (this.opened) {
            return this.onRequest.apply(this, arguments)
        }
        this.opened = true;
        return this.onOpen.apply(this, arguments)
    },
    onOpen: function() {
        if (!this.minimized) {
            this.show()
        }
    },
    onRequest: function() {
        if (!this.isVisible()) {
            this.show();
            return
        }
        this.toFront()
    },
    getSizeAndPosition: function() {
        var b, a = {};
        if (this.maximized || this.hidden) {
            if (this.draggable && this.restorePos) {
                a.x = this.restorePos[0];
                a.y = this.restorePos[1]
            } else {
                a.x = this.x;
                a.y = this.y
            }
            if (this.resizable) {
                if (this.restoreSize) {
                    a.width = this.restoreSize.width;
                    a.height = this.restoreSize.height
                } else {
                    a.width = this.width;
                    a.height = this.height
                }
            }
        } else {
            b = this.el.origXY || this.getPosition(false);
            a.pageX = b[0];
            a.pageY = b[1];
            if (this.resizable) {
                a.width = this.getWidth();
                a.height = this.getHeight()
            }
        }
        return a
    },
    setResizable: function(a) {
        this.el[a ? "removeClass" : "addClass"]("no-resize")
    },
    getStateParam: function() {
        var a = {};
        if (this.maximized || this.hidden) {
            a.maximized = this.maximized;
            a.minimized = this.hidden
        }
        Ext.apply(a, this.getSizeAndPosition());
        return a
    }
});
SYNO.SDS.BaseWindow = Ext.extend(SYNO.SDS.AbstractWindow, {
    maskCnt: 0,
    maskTask: null,
    siblingWin: null,
    modalWin: null,
    msgBox: null,
    dsmStyle: "v5",
    owner: null,
    constructor: function(b) {
        var c = !!b.owner,
            a;
        this.siblingWin = [];
        this.modalWin = [];
        this.updateDsmStyle(b);
        if (b.useStatusBar) {
            b = this.addStatusBar(b)
        }
        a = Ext.urlDecode(location.search.substr(1));
        if (a.dsmStyle) {
            this.dsmStyle = a.dsmStyle
        }
        b.cls = String.format("{0}{1}", (b.cls ? b.cls : ""), (this.isV5Style() ? " sds-window-v5" : " sds-window"));
        if (this.isV5Style()) {
            this.fillPadding(b)
        }
        SYNO.SDS.BaseWindow.superclass.constructor.call(this, Ext.applyIf(b, {
            border: true,
            plain: false,
            shadow: (this.isV5Style() || SYNO.SDS.UIFeatures.test("disableWindowShadow")) ? false : "frame",
            shadowOffset: 6,
            closeAction: "close"
        }));
        if (c && !(b.owner instanceof SYNO.SDS.BaseWindow)) {
            SYNO.Debug(String.format('WARNING! owner of window "{0}" is not BaseWindow', this.title || this.id))
        }
        if (this.isV5Style()) {
            this.centerTitle()
        }
    },
    updateDsmStyle: function(a) {
        if (!Ext.isDefined(a)) {
            return
        }
        if (a.dsmStyle) {
            this.dsmStyle = a.dsmStyle
        } else {
            if (a.owner) {
                this.setToOwnerDsmStyle(a.owner)
            }
        }
    },
    getDsmStyle: function() {
        return this.dsmStyle
    },
    isV5Style: function() {
        return this.getDsmStyle() === "v5"
    },
    setToOwnerDsmStyle: function(a) {
        if (Ext.isFunction(a.getDsmStyle)) {
            this.dsmStyle = a.getDsmStyle()
        }
    },
    addStatusBar: function(a) {
        var b = {
            xtype: "statusbar",
            defaultText: "&nbsp;",
            statusAlign: "left",
            buttonAlign: "left",
            items: []
        };
        if (this.isV5Style()) {
            b.defaults = {
                xtype: "syno_button",
                btnStyle: "grey"
            }
        }
        if (a.buttons) {
            b.items = b.items.concat(a.buttons);
            delete a.buttons
        }
        Ext.applyIf(a, {
            fbar: b
        });
        return a
    },
    createGhost: function(a, d, b) {
        if (this.isV5Style()) {
            a += " sds-window-v5"
        }
        if (SYNO.SDS.UIFeatures.test("windowGhost")) {
            return SYNO.SDS.BaseWindow.superclass.createGhost.apply(this, arguments)
        }
        var f = this.el.dom,
            e = document.createElement("div"),
            c = e.style;
        e.className = "x-panel-ghost-simple";
        c.width = f.offsetWidth + "px";
        c.height = f.offsetHeight + "px";
        if (!b) {
            this.container.dom.appendChild(e)
        } else {
            Ext.getDom(b).appendChild(e)
        }
        return new Ext.Element(e)
    },
    isModalized: function() {
        return false
    },
    hasOwnerWin: function(b) {
        var a = this;
        do {
            if (b === a) {
                return true
            }
            a = a.owner
        } while (a);
        return false
    },
    getTopWin: function() {
        var a = this;
        while (a.owner) {
            a = a.owner
        }
        return a
    },
    getGroupWinAccessTime: function() {
        var a = this._lastAccess || 0;
        Ext.each(this.modalWin, function(b) {
            if (b && b._lastAccess && b._lastAccess > a) {
                a = b._lastAccess
            }
        });
        Ext.each(this.siblingWin, function(b) {
            if (b && b._lastAccess && b._lastAccess > a) {
                a = b._lastAccess
            }
        });
        return a
    },
    getMsgBox: function(b) {
        if (!this.msgBox || this.msgBox.isDestroyed) {
            var a = (b && b.owner) || this;
            a = a.isDestroyed ? null : a;
            if (this.isV5Style()) {
                this.msgBox = new SYNO.SDS.MessageBoxV5({
                    owner: a
                })
            } else {
                this.msgBox = new SYNO.SDS.MessageBox({
                    owner: a
                })
            }
        }
        return this.msgBox.getWrapper(b)
    },
    onBeforeDestroy: function() {
        function a(b) {
            if (b) {
                b.destroy()
            }
        }
        if (this.msgBox) {
            this.msgBox.destroy()
        }
        Ext.each(this.modalWin, a);
        Ext.each(this.siblingWin, a);
        delete this.msgBox;
        delete this.modalWin;
        delete this.siblingWin;
        delete this.maskTask;
        SYNO.SDS.BaseWindow.superclass.onBeforeDestroy.apply(this, arguments)
    },
    onMinimize: function() {
        function a(b) {
            if (b) {
                b.hideForMinimize = true;
                b.minimize()
            }
        }
        SYNO.SDS.BaseWindow.superclass.onMinimize.apply(this, arguments);
        Ext.each(this.modalWin, a);
        Ext.each(this.siblingWin, a)
    },
    applyToAllWindows: function(a) {
        Ext.each(this.modalWin, a);
        Ext.each(this.siblingWin, a)
    },
    addClassToAllWindows: function(a) {
        function b(c) {
            c.addClassToAllWindows(a)
        }
        this.el.addClass(a);
        this.applyToAllWindows(b)
    },
    removeClassFromAllWindows: function(a) {
        function b(c) {
            c.removeClassFromAllWindows(a)
        }
        this.el.removeClass(a);
        this.applyToAllWindows(b)
    },
    disableAllShadow: function() {
        function a(b) {
            b.disableAllShadow()
        }
        this.el.disableShadow();
        this.applyToAllWindows(a)
    },
    onClose: function() {
        var b;

        function a(c) {
            if (c) {
                c.close();
                return c.isDestroyed
            }
            return true
        }
        Ext.each(this.modalWin, a);
        if (!this.modalWin.length) {
            Ext.each(this.siblingWin, a)
        }
        b = !this.modalWin.length && !this.siblingWin.length;
        if (b) {
            b = (false !== SYNO.SDS.BaseWindow.superclass.onClose.apply(this, arguments))
        }
        return b
    },
    onActivate: function() {
        var a = this.getTopWin();
        if (a.taskButton) {
            a.taskButton.setState("active")
        }
        this.el.replaceClass("deactive-win", "active-win");
        SYNO.SDS.BaseWindow.superclass.onActivate.apply(this, arguments)
    },
    onDeactivate: function() {
        var a = this.getTopWin();
        if (a.taskButton) {
            a.taskButton.setState("deactive")
        }
        this.el.replaceClass("active-win", "deactive-win");
        SYNO.SDS.BaseWindow.superclass.onDeactivate.apply(this, arguments);
        if (this.el) {
            this.el.enableShadow(true)
        }
    },
    blinkShadow: function(a) {
        if (this.isV5Style()) {
            return this.blinkShadowV5(a)
        }
        if (!this.shadow || a <= 0) {
            return
        }
        this.el.disableShadow();
        (function() {
            this.el.enableShadow(true);
            this.blinkShadow.createDelegate(this, [--a]).defer(100)
        }).createDelegate(this).defer(100)
    },
    blinkShadowV5: function(a) {
        if (!this.el || !this.el.isVisible() || a <= 0) {
            return
        }
        this.el.addClass("sds-window-v5-no-shadow");
        (function() {
            if (!this.el || !this.el.isVisible()) {
                return
            }
            this.el.removeClass("sds-window-v5-no-shadow");
            this.blinkShadowV5.createDelegate(this, [--a]).defer(100)
        }).createDelegate(this).defer(100)
    },
    delayedMask: function(b, a) {
        a = a || 200;
        if (!this.maskTask) {
            this.maskTask = new Ext.util.DelayedTask(this.setMaskOpacity, this, [b])
        }
        this.mask(0);
        this.maskTask.delay(a)
    },
    setMaskOpacity: function(b) {
        if (!this.el.isMasked()) {
            return
        }
        var a = Ext.Element.data(this.el, "mask");
        a.setOpacity(b)
    },
    mask: function(b, d, c) {
        if (this.isDestroyed) {
            return
        }
        b = b || 0;
        this.maskCnt++;
        if (this.maskCnt > 1) {
            this.setMaskOpacity(b);
            return
        }
        var a = this.el.mask(d, c);
        a.addClass("sds-window-mask");
        this.mon(a, "mousedown", this.blinkModalChild, this);
        this.setMaskOpacity(b)
    },
    unmask: function() {
        if (this.isDestroyed || --this.maskCnt > 0) {
            return
        }
        this.maskCnt = 0;
        if (this.maskTask) {
            this.maskTask.cancel()
        }
        var a = Ext.Element.data(this.el, "mask");
        this.mun(a, "mousedown", this.blinkModalChild, this);
        this.el.unmask()
    },
    blinkModalChild: function() {
        if (!SYNO.SDS.WindowMgr) {
            return
        }
        this.modalWin.sort(SYNO.SDS.WindowMgr.sortWindows);
        var a = this.modalWin[this.modalWin.length - 1];
        if (!a) {
            if (this.isModalized()) {
                this.toFront();
                this.blinkShadow(3)
            }
            return
        }
        a.blinkModalChild()
    },
    clearStatus: function(b) {
        var a = this.getFooterToolbar();
        if (a && Ext.isFunction(a.clearStatus)) {
            a.clearStatus(b)
        }
    },
    clearStatusBusy: function(a) {
        this.clearStatus(a);
        this.unmask()
    },
    setStatus: function(b) {
        b = b || {};
        var a = this.getFooterToolbar();
        if (a && Ext.isFunction(a.setStatus)) {
            a.setStatus(b)
        }
    },
    setStatusOK: function(a) {
        a = a || {};
        Ext.applyIf(a, {
            text: _T("common", "setting_applied"),
            iconCls: this.isV5Style() ? "syno-ux-statusbar-success" : "x-status-valid",
            clear: true
        });
        this.setStatus(a)
    },
    setStatusError: function(a) {
        a = a || {};
        Ext.applyIf(a, {
            text: _T("common", "error_system"),
            iconCls: this.isV5Style() ? "syno-ux-statusbar-error" : "x-status-error"
        });
        this.setStatus(a)
    },
    setStatusBusy: function(c, b, a) {
        c = c || {};
        Ext.applyIf(c, {
            text: _T("common", "loading"),
            iconCls: this.isV5Style() ? "syno-ux-statusbar-loading" : "x-status-busy"
        });
        this.setStatus(c);
        this.maskForBusy(b, a)
    },
    maskForBusy: function(b, a) {
        b = b || 0.4;
        a = a || 400;
        this.delayedMask(b, a)
    },
    hide: function() {
        if (!this.maximized) {
            this.restoreSize = this.getSize();
            this.restorePos = this.getPosition(true)
        }
        this.addClass("syno-window-hide");
        SYNO.SDS.BaseWindow.superclass.hide.apply(this, arguments)
    },
    centerTitle: function() {
        var a = 32,
            b = 0,
            d = ["help", "minimize", "maximize", "close"],
            c;
        if (!this.tools) {
            return
        }
        Ext.each(d, function(e) {
            if (this.tools[e]) {
                b += a
            }
        }, this);
        if (this.header) {
            c = this.header.child(".x-window-header-text");
            if (c) {
                c.setStyle("padding-left", b + "px")
            }
        }
    },
    fillPadding: function(a) {
        var b;
        b = this.getFirstItem(a);
        if (!b) {
            return a
        }
        if (this.isGridPanel(b) || this.isFormPanel(b)) {
            this.fillWindowPadding(a);
            return
        }
        if (this.isTabPanel(b) && this.hasItems(b)) {
            this.fillWindowPadding(a);
            return
        }
    },
    hasItems: function(a) {
        if (Ext.isArray(a.items)) {
            return true
        }
        if (a.items instanceof Ext.util.MixedCollection) {
            return true
        }
        return false
    },
    fillWindowPadding: function(a) {
        Ext.applyIf(a, {
            padding: "0 20px"
        })
    },
    getFirstItem: function(a) {
        var b;
        if (Ext.isArray(a.items) && a.items.length === 1) {
            b = a.items[0]
        } else {
            if (Ext.isObject(a.items)) {
                b = a.items
            }
        }
        return b
    },
    isTabPanel: function(a) {
        return this.isPanelOf(a, Ext.TabPanel, ["tabpanel", "syno_tabpanel"])
    },
    isFormPanel: function(a) {
        return this.isPanelOf(a, Ext.form.FormPanel, ["form", "syno_formpanel"])
    },
    isGridPanel: function(a) {
        return this.isPanelOf(a, Ext.grid.GridPanel, ["grid", "syno_gridpanel"])
    },
    isPanelOf: function(c, e, d) {
        var f, b, a;
        if (!c) {
            return false
        }
        if (c instanceof e) {
            return true
        }
        f = c.xtype;
        for (b = 0, a = d.length; b < a; b++) {
            if (f === d[b]) {
                return true
            }
        }
        return false
    }
});
Ext.namespace("SYNO.SDS.Window");
SYNO.SDS.Window = Ext.extend(SYNO.SDS.BaseWindow, {
    constructor: function(a) {
        a = Ext.apply({
            minimizable: false
        }, a);
        SYNO.SDS.Window.superclass.constructor.call(this, a);
        if (this.owner && Ext.isArray(this.owner.siblingWin)) {
            this.owner.siblingWin.push(this)
        }
    },
    onBeforeDestroy: function() {
        if (this.owner && Ext.isArray(this.owner.siblingWin)) {
            this.owner.siblingWin.remove(this)
        }
        SYNO.SDS.Window.superclass.onBeforeDestroy.apply(this, arguments)
    },
    onMinimize: function() {
        this.hide();
        SYNO.SDS.Window.superclass.onMinimize.apply(this, arguments)
    },
    isAlwaysOnTop: function() {
        return _S("standalone")
    }
});
Ext.namespace("SYNO.SDS.ModalWindow");
SYNO.SDS.ModalWindow = Ext.extend(SYNO.SDS.BaseWindow, {
    ownerMasked: false,
    constructor: function(a) {
        a = Ext.apply({
            useStatusBar: true,
            closable: false,
            maximizable: false,
            minimizable: false,
            modal: !a.owner
        }, a);
        SYNO.SDS.ModalWindow.superclass.constructor.call(this, a)
    },
    afterRender: function() {
        var d, b, a, c;
        if (SYNO.SDS.Desktop) {
            d = SYNO.SDS.Desktop.getEl().getHeight()
        } else {
            d = Ext.lib.Dom.getViewHeight()
        }
        SYNO.SDS.ModalWindow.superclass.afterRender.apply(this, arguments);
        this.alignTo(this.owner ? this.owner.el : document.body, "c-c");
        b = this.el.getHeight();
        a = this.el.getTop();
        if (a + b > d) {
            c = d - b - 20;
            this.el.setTop.defer(100, this.el, [(c > 0 ? c : 0)])
        }
    },
    isModalized: function() {
        return true
    },
    hideFromOwner: function() {
        if (this.owner) {
            if (Ext.isArray(this.owner.modalWin)) {
                this.owner.modalWin.remove(this)
            }
            if (this.ownerMasked) {
                this.owner.unmask();
                this.ownerMasked = false
            }
            return true
        }
        return false
    },
    afterShow: function() {
        SYNO.SDS.ModalWindow.superclass.afterShow.apply(this, arguments);
        if (!this.ownerMasked && this.owner) {
            this.owner.modalWin.push(this);
            this.owner.mask();
            this.ownerMasked = true
        }
    },
    afterHide: function() {
        SYNO.SDS.ModalWindow.superclass.afterHide.apply(this, arguments);
        if (!this.hideForMinimize) {
            this.hideFromOwner()
        }
    },
    onBeforeDestroy: function() {
        if (this.hideFromOwner()) {
            this.owner = null
        }
        SYNO.SDS.ModalWindow.superclass.onBeforeDestroy.apply(this, arguments)
    },
    onMinimize: function() {
        this.hide();
        SYNO.SDS.ModalWindow.superclass.onMinimize.apply(this, arguments)
    }
});
Ext.namespace("SYNO.SDS.AppWindow");
SYNO.SDS.AppWindow = Ext.extend(SYNO.SDS.BaseWindow, {
    initialized: false,
    taskButton: null,
    constructor: function(d) {
        var e;
        d = Ext.apply({}, d, {
            useStatusBar: Ext.isDefined(d.buttons),
            showHelp: true
        });
        d = Ext.apply(d, {
            title: null,
            iconCls: "x-panel-icon",
            openConfig: {
                dsm_version: _S("majorversion") + "." + _S("minorversion")
            }
        });
        if (!_S("standalone") && d.appInstance && true !== d.fromRestore && false !== d.autoRestoreSizePos) {
            Ext.apply(d, this.getRestoreSizePos(d))
        }
        d = this.adjustPageXY(d);
        if (!_S("standalone") && d.showHelp) {
            if (!Ext.isArray(d.tools)) {
                d.tools = []
            }
            d.tools.push({
                id: "help",
                scope: this,
                handler: this.onClickHelp
            })
        }
        e = Ext.isDefined(d.maximizable) ? d.maximizable : true;
        var c = d.appInstance ? d.appInstance.blMainApp : false;
        if (_S("standalone")) {
            if (c) {
                Ext.apply(d, {
                    maximizable: false,
                    maximized: e,
                    closable: false,
                    modal: false
                });
                d.cls = (d.cls || "") + (this.cls || "") + " sds-standalone-main-window";
                document.title = d.title || document.title
            } else {
                Ext.apply(d, {
                    maximizable: false,
                    maximized: false,
                    closable: true,
                    modal: true
                });
                if (e) {
                    var b = 10,
                        a = 10;
                    Ext.EventManager.onWindowResize(this.onModalWindowResize, this);
                    Ext.apply(d, {
                        x: b,
                        y: a,
                        width: Ext.lib.Dom.getViewWidth() - b * 2,
                        height: Ext.lib.Dom.getViewHeight() - a * 2
                    })
                }
            }
            Ext.apply(d, {
                resizable: false,
                draggable: false,
                minimizable: false
            })
        }
        if ((_S("isMobile") || Ext.isIE10Touch) && e) {
            Ext.apply(d, {
                maximized: true
            })
        }
        d = this.overwriteAppWinConfig(d);
        SYNO.SDS.AppWindow.superclass.constructor.call(this, d);
        if (!d.maximized) {
            if (_S("standalone")) {
                this.anchorTo(this.container, "c-c")
            }
            if ((_S("isMobile") || Ext.isIE10Touch)) {
                this.anchorTo(this.container, "t-t")
            }
        }
        this.mon(this, "move", this.saveRestoreData, this);
        this.mon(this, "resize", this.saveRestoreData, this);
        if (_S("standalone") && c) {
            SYNO.SDS.Utils.addFavIconLink(this.getSmallIcon(true), "image/png");
            this.mon(this, "titlechange", function() {
                document.title = this.title || document.title
            }, this)
        }
    },
    overwriteAppWinConfig: function(a) {
        return a
    },
    genIndPortHeader: function() {
        var c = this.el.createChild({
            tag: "div",
            cls: "sds-standalone-main-window-header"
        });
        var b = false === this.showHelp;
        var a = new Ext.Toolbar({
            renderTo: c,
            height: 30,
            toolbarCls: "sds-standalone-main-window-header-toolbar",
            items: [{
                cls: "sds-standalone-welcome-text",
                xtype: "syno_displayfield",
                hideLabel: true,
                value: _T("common", "welcome") + "&nbsp;<b>" + _S("user") + "</b>",
                hidden: !_S("rewrite_mode")
            }, {
                xtype: "syno_button",
                cls: "sds-standalone-logout",
                iconCls: "sds-standalone-logout-icon",
                text: _T("common", "logout"),
                scope: this,
                hidden: !_S("rewrite_mode") || b,
                handler: function() {
                    SYNO.SDS.StatusNotifier.fireEvent("logout");
                    window.onbeforeunload = SYNO.SDS.onBasicBeforeUnload;
                    try {
                        SYNO.SDS.Utils.Logout.action()
                    } catch (d) {}
                }
            }, {
                xtype: "syno_button",
                cls: "sds-standalone-help",
                iconCls: "sds-standalone-help-icon",
                text: _T("common", "alt_help"),
                hidden: b,
                scope: this,
                handler: this.onClickHelp
            }],
            listeners: {
                scope: this,
                single: true,
                buffer: 80,
                afterlayout: function() {
                    var d = 0;
                    a.items.each(function(e) {
                        if (true !== e.hidden) {
                            d += e.getOuterSize().width
                        }
                    });
                    d += 2;
                    c.setWidth(d)
                }
            }
        })
    },
    afterRender: function() {
        SYNO.SDS.AppWindow.superclass.afterRender.apply(this, arguments);
        var a;
        if (_S("standalone")) {
            this.alignTo(document.body, "c-c");
            if (_S("remove_banner") === "true" && this.appInstance && this.appInstance.blMainApp) {
                this.toggleMaximize();
                this.header.setVisibilityMode(Ext.Element.DISPLAY);
                this.header.hide();
                a = this.el.first("div.x-window-tl");
                if (a) {
                    a.setStyle({
                        "padding-top": "8px"
                    })
                }
                this.toggleMaximize()
            }
        }
        if (_S("standalone") && this.appInstance && this.appInstance.blMainApp) {
            this.header.dom.innerHTML = '<div class="sds-standalone-main-window-header-text">' + this.header.dom.innerHTML + "</div>";
            if (_S("remove_banner") !== "true") {
                this.genIndPortHeader()
            }
        }
    },
    destroy: function() {
        if (_S("standalone")) {
            Ext.EventManager.removeResizeListener(this.onModalWindowResize, this)
        }
        SYNO.SDS.AppWindow.superclass.destroy.apply(this, arguments)
    },
    onModalWindowResize: function() {
        var b = 10,
            a = 10;
        this.setPosition(b, a);
        this.setSize(Ext.lib.Dom.getViewWidth() - b * 2, Ext.lib.Dom.getViewHeight() - a * 2)
    },
    getSmallIcon: function(b) {
        var c = this.jsConfig.jsBaseURL + "/" + (this.jsConfig.icon || this.jsConfig.icon_16);
        var d = (_S("standalone") && this.appInstance && this.appInstance.blMainApp);
        var a;
        if (b) {
            a = "FavHeader"
        } else {
            if (d) {
                a = "StandaloneHeader"
            } else {
                if (this.isV5Style()) {
                    a = "Header"
                } else {
                    a = "HeaderV4"
                }
            }
        }
        return SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(c, a)
    },
    init: function() {
        if (this.initialized) {
            return
        }
        if (this.toggleMinimizable !== false) {
            this.setIcon(this.getSmallIcon())
        }
        if (!_S("standalone") && this.toggleMinimizable !== false) {
            this.taskButton = this.appInstance.taskButton || SYNO.SDS.TaskButtons.add(this.appInstance.jsConfig.jsID, this.jsConfig.jsID);
            this.taskButton.init(this);
            this.taskButton.setState("loading");
            this.taskButton.setLoading(false);
            this.addManagedComponent(this.taskButton)
        }
        this.setTitle(SYNO.SDS.Utils.GetLocalizedString(this.getTitle(), this.jsConfig.jsID));
        this.initialized = true
    },
    onBeforeDestroy: function() {
        SYNO.SDS.AppWindow.superclass.onBeforeDestroy.apply(this, arguments);
        this.taskButton = null
    },
    onClickHelp: function() {
        var a = this.appInstance ? this.appInstance.jsConfig.jsID : this.jsConfig.jsID,
            b = this.getHelpParam();
        if (Ext.isString(b) && b.length) {
            a += ":" + b
        }
        if (_S("standalone")) {
            SYNO.SDS.WindowLaunch("SYNO.SDS.HelpBrowser.Application", {
                topic: a
            })
        } else {
            SYNO.SDS.AppLaunch("SYNO.SDS.HelpBrowser.Application", {
                topic: a
            }, false)
        }
    },
    getHelpParam: Ext.emptyFn,
    setTitle: function(b, a) {
        SYNO.SDS.AppWindow.superclass.setTitle.apply(this, arguments);
        if (this.taskButton) {
            this.taskButton.setTooltip(b)
        }
    },
    getTitle: function() {
        return this.title || this.jsConfig.title
    },
    updateTaskButton: function(a) {
        if (!this.taskButton) {
            return
        }
        this.taskButton.updateContextMenu(a)
    },
    onHeaderContextMenu: function(a) {
        SYNO.SDS.AppWindow.superclass.onHeaderContextMenu.apply(this, arguments);
        if (!_S("standalone")) {
            this.taskButton.getContextMenu(false).showAt(a.getXY())
        }
    },
    onMaximize: function() {
        SYNO.SDS.AppWindow.superclass.onMaximize.apply(this, arguments);
        this.updateTaskButton("maximize")
    },
    onMinimize: function() {
        if (_S("standalone")) {
            return
        }
        if (this.minimizable) {
            this.hide((Ext.isIE9m && !Ext.isIE9) ? undefined : this.taskButton.el)
        } else {
            this.el.frame()
        }
        SYNO.SDS.AppWindow.superclass.onMinimize.apply(this, arguments);
        this.updateTaskButton("minimize")
    },
    onRestore: function() {
        SYNO.SDS.AppWindow.superclass.onRestore.apply(this, arguments);
        this.updateTaskButton("restore")
    },
    mask: function() {
        SYNO.SDS.AppWindow.superclass.mask.apply(this, arguments);
        this.updateTaskButton("mask")
    },
    unmask: function() {
        SYNO.SDS.AppWindow.superclass.unmask.apply(this, arguments);
        this.updateTaskButton("unmask")
    },
    saveRestoreData: function() {
        var a = Ext.apply(this.getSizeAndPosition(), {
            fromRestore: true
        });
        this.appInstance.setUserSettings("restoreSizePos", a)
    },
    adjustPageXY: function(a) {
        if (!a) {
            return {}
        }
        if (Ext.isDefined(a.pageX) && a.pageX < 0) {
            a.pageX = 0
        }
        if (Ext.isDefined(a.pageY) && a.pageY < 0) {
            a.pageY = 0
        }
        if (Ext.isDefined(a.x) && a.x < 0) {
            a.x = 0
        }
        if (Ext.isDefined(a.y) && a.y < 0) {
            a.y = 0
        }
        return a
    },
    getRestoreSizePos: function(a) {
        var b = a.appInstance.getUserSettings("restoreSizePos") || {};
        if (Ext.isDefined(a.minWidth) && Ext.isDefined(b.width) && b.width < a.minWidth) {
            b.width = a.width
        }
        if (Ext.isDefined(a.minHeight) && Ext.isDefined(b.height) && b.height < a.minHeight) {
            b.height = a.height
        }
        return b
    },
    onOpen: function(b) {
        var a;
        if (!this.initialized) {
            this.init()
        }
        if (Ext.isObject(b)) {
            for (a in b) {
                if (b.hasOwnProperty(a)) {
                    this.setOpenConfig(a, b[a])
                }
            }
            if (b.title) {
                this.setTitle(b.title)
            }
            SYNO.API.Info.Update(this)
        }
        if (this.appInstance.appWindowName) {
            this.sendWebAPI({
                api: "SYNO.Core.DataCollect.Application",
                version: 1,
                method: "record",
                params: {
                    app: this.appInstance.appWindowName
                },
                scope: this
            })
        }
        SYNO.SDS.AppWindow.superclass.onOpen.apply(this, arguments)
    },
    onShow: function() {
        SYNO.SDS.AppWindow.superclass.onShow.apply(this, arguments);
        this.updateTaskButton("restore")
    },
    checkModalOrMask: function() {
        if ((this.modalWin && this.modalWin.length > 0) || (this.maskCnt > 0)) {
            this.blinkModalChild();
            return true
        }
        return false
    },
    setMaskMsgVisible: function(b) {
        if (!this.el.isMasked()) {
            return
        }
        var a = Ext.Element.data(this.el, "maskMsg");
        if (a && a.dom) {
            a.setVisibilityMode(Ext.Element.VISIBILITY);
            a.setVisible(b)
        }
    },
    setMaskOpacity: function(a) {
        SYNO.SDS.AppWindow.superclass.setMaskOpacity.call(this, a);
        this.setMaskMsgVisible(a !== 0)
    },
    delayedMask: function(b, a, d, c) {
        a = a || 200;
        if (!this.maskTask) {
            this.maskTask = new Ext.util.DelayedTask(this.setMaskOpacity, this, [b])
        }
        this.mask(0, d, c);
        this.setMaskMsgVisible(false);
        this.maskTask.delay(a)
    },
    setStatusBusy: function(c, b, a) {
        c = c || {};
        Ext.applyIf(c, {
            text: _T("common", "loading"),
            iconCls: "x-mask-loading"
        });
        b = b || 0.4;
        a = a || 400;
        this.delayedMask(b, a, c.text, c.iconCls)
    },
    clearStatusBusy: function(a) {
        this.unmask()
    },
    doConstrain: function() {
        var b, a, c;
        if (this.constrainHeader) {
            a = this.getSize();
            b = {
                left: -(a.width - 100),
                right: -(a.width - 100),
                bottom: -(a.height - 25)
            };
            c = this.el.getConstrainToXY(this.container, true, b);
            if (c) {
                if (c[0] < 0 && (c[0] + a.width) < this.container.getWidth()) {} else {
                    this.setPosition(c[0], c[1])
                }
            }
        }
    },
    getOpenConfig: function(a) {
        if (!Ext.isString(a) || Ext.isEmpty(this.openConfig[a])) {
            return
        }
        return this.openConfig[a]
    },
    setOpenConfig: function(a, b) {
        if (!Ext.isString(a) || Ext.isEmpty(a)) {
            return
        }
        this.openConfig[a] = b
    },
    hasOpenConfig: function(a) {
        if (!Ext.isString(a) || Ext.isEmpty(a)) {
            return false
        }
        if (undefined === this.openConfig[a]) {
            return false
        } else {
            return true
        }
    }
});
Ext.define("SYNO.SDS.WidgetWindow", {
    extend: "SYNO.SDS.BaseWindow",
    widgetCls: "sds-widget-window",
    widgetOverHeaderCls: "sds-widget-over",
    headerTextPadding: 34,
    initialized: false,
    constructor: function(a) {
        a = a || {};
        a.shadow = false;
        a = Ext.applyIf(a, {
            constrain: true,
            boxMaxHeight: 205,
            boxMinHeight: 121,
            boxMaxWidth: 320,
            maximized: true,
            maximizable: false,
            minimizable: false,
            resizable: false
        });
        this.callParent([a])
    },
    fillPadding: Ext.emptyFn,
    initDraggable: function() {
        var a = this;
        a.dd = new Ext.Panel.DD(a, {
            ddGroup: "WidgetReorderAndShortCut",
            validateTarget: function(c, b, d) {
                return true
            },
            endDrag: function(b) {
                this.proxy.hide();
                this.panel.saveState();
                this.panel.el.setStyle({
                    visibility: "inherit"
                })
            }
        })
    },
    init: function() {
        var a = this,
            b = a.widget;
        if (a.initialized) {
            return
        }
        if (b && b.toggleButtonCls) {
            a.taskButton = SYNO.SDS.SystemTray.addButton(b.toggleButtonCls, this);
            b.taskButton = a.taskButton;
            a.setMiniWidgetTaskButton();
            a.addManagedComponent(a.taskButton)
        }
        a.initialized = true
    },
    setMiniWidgetTaskButton: function() {
        var a = this;
        if (Ext.isFunction(a.taskButton.setIcon) && Ext.isFunction(a.taskButton.setTooltip)) {
            a.taskButton.mon(a, "titlechange", function(b, c) {
                a.taskButton.setTooltip(c)
            }, a);
            a.taskButton.setIcon(a.iconURL);
            a.taskButton.setTooltip(a.title)
        }
    },
    onOpen: function(b) {
        var a = this;
        a.init();
        if (!a.minimized) {
            a.hidden = false;
            if (a.taskButton) {
                a.taskButton.hide()
            }
        } else {
            a.show();
            a.hide();
            a.el.setStyle("display", "none");
            if (a.taskButton) {
                a.taskButton.show()
            }
        }
        a.setPinStatus(a.pinned)
    },
    onRender: function(b, a) {
        var c = this;
        c.callParent(arguments);
        c.el.addClass(this.widgetCls);
        c.header[c.onlyView ? "addClass" : "addClassOnHover"](c.widgetOverHeaderCls)
    },
    initTools: function() {
        var a = this;
        if (a.addable) {
            a.addTool({
                id: "add",
                qtip: _T("widget", "add_widget_to_desktop"),
                handler: a.addWidget.createDelegate(this, [])
            })
        }
        if (a.pinable) {
            a.addTool({
                id: "pin",
                handler: a.onPin.createDelegate(this, [])
            })
        }
        a.callParent(arguments)
    },
    setAddToolDisabled: function(a) {
        var b = this;
        if (b.addable) {
            this.tools.add.setVisible(!a);
            this.tools.add[a ? "addClass" : "removeClass"]("x-tool-disabled")
        }
    },
    setPinToolToggled: function(b) {
        var a = this;
        if (a.pinable) {
            this.tools.pin[b ? "addClass" : "removeClass"]("x-tool-toggled")
        }
    },
    isAlwaysOnTop: function() {
        return this.pinned
    },
    setPinStatus: function(a) {
        this[a === true ? "pin" : "unpin"]()
    },
    onPin: function() {
        var a = this;
        a[a.pinned === true ? "unpin" : "pin"]()
    },
    pin: function() {
        this.setPinned(true)
    },
    unpin: function() {
        this.setPinned(false)
    },
    setPinned: function(a) {
        var b = this;
        b.pinned = a;
        b.setPinToolToggled(a);
        b.manager.orderWindows()
    },
    addWidget: function() {
        var a = this;
        a.fireEvent("addWidget", [a])
    },
    createGhost: function(a, c, b) {
        a += " " + this.widgetCls;
        return this.callParent([a, c, b])
    },
    setIcon: function(d) {
        var b = this,
            c = b.widget,
            a = c.widgetParams;
        b.callParent(arguments);
        b.iconURL = d;
        if (b.taskButton && b.taskButton.setIcon) {
            b.taskButton.setIcon(d)
        }
        b.icon = b.header.createChild({
            cls: "icon-click"
        });
        b.mon(b.icon, "click", function(h, g) {
            SYNO.SDS.DeskTopManager.showDesktop();
            if (Ext.isFunction(c.onClickTitle)) {
                c.onClickTitle()
            } else {
                var f = a.launchParam ? Ext.decode(a.launchParam) : undefined;
                SYNO.SDS.AppLaunch(a.appInstance, f)
            }
        }, b)
    },
    onMinimize: function() {
        var a = this;
        if (a.minimizable && a.taskButton) {
            a.taskButton.show();
            a.el.setVisibilityMode(Ext.Element.DISPLAY);
            a.hide((Ext.isIE9m && !Ext.isIE9) ? undefined : a.taskButton.el)
        } else {
            a.close()
        }
        a.callParent(arguments)
    },
    maximize: function() {
        if (!this.maximized) {
            this.expand(false);
            if (this.maximizable) {
                this.tools.maximize.hide();
                this.tools.restore.show()
            }
            this.maximized = true;
            if (this.collapsible) {
                this.tools.toggle.hide()
            }
            this.el.addClass("x-window-maximized");
            this.container.addClass("x-window-maximized-ct");
            this.fitContainer();
            this.fireEvent("maximize", this)
        }
        return this
    },
    fitContainer: function() {
        this.setLargeSize()
    },
    setLargeSize: function() {
        var a = this;
        a.getEl().removeClass("sds-widget-window-medium");
        a.setSize(320, 205);
        if (!a.hidden) {
            a.doExpand()
        }
        a.mediumSize = false
    },
    afterRender: function() {
        var a = this;
        a.callParent(arguments);
        if (!a.maximized) {
            a.setMediumSize()
        }
    },
    setMediumSize: function() {
        var a = this;
        a.doCollapse();
        a.getEl().addClass("sds-widget-window-medium");
        a.setSize(320, 121);
        a.mediumSize = true
    },
    doCollapse: function() {
        var a = this,
            b = a.widget;
        if (b && b.doCollapse) {
            b.doCollapse()
        }
    },
    doExpand: function() {
        var a = this,
            b = a.widget;
        if (b && b.doCollapse) {
            b.doExpand()
        }
    },
    restore: function() {
        if (this.maximized) {
            var a = this.tools;
            this.el.removeClass("x-window-maximized");
            if (a.restore) {
                a.restore.hide()
            }
            if (a.maximize) {
                a.maximize.show()
            }
            this.maximized = false;
            if (this.dd) {
                this.dd.unlock()
            }
            if (this.collapsible && a.toggle) {
                a.toggle.show()
            }
            this.container.removeClass("x-window-maximized-ct");
            this.setMediumSize();
            this.doConstrain();
            this.fireEvent("restore", this)
        }
        return this
    },
    getSizeAndPosition: function() {
        var a = this,
            b = {};
        if (a.maximized || a.hidden || a.mediumSize) {
            if (a.draggable && a.restorePos) {
                b.x = a.restorePos[0];
                b.y = a.restorePos[1];
                b.width = a.getWidth();
                b.height = a.getHeight()
            } else {
                b.x = a.x;
                b.y = a.y
            }
        }
        return b
    },
    getStateParam: function() {
        var a = this,
            b = {};
        b.widgetClassName = a.widgetClassName;
        if (a.maximized || a.hidden || a.mediumSize || a.pinned) {
            b.maximized = a.maximized;
            b.minimized = a.hidden;
            b.mediumSize = a.mediumSize;
            b.pinned = a.pinned
        }
        Ext.apply(b, this.getSizeAndPosition());
        return b
    },
    destroy: function() {
        var a = this;
        Ext.destroy(a.taskButton);
        a.callParent(arguments)
    },
    onActivate: Ext.emptyFn,
    onDeactivate: Ext.emptyFn
});
Ext.namespace("SYNO.SDS.LegacyAppWindow");
SYNO.SDS.LegacyAppWindow = Ext.extend(SYNO.SDS.AppWindow, {
    iframeId: "",
    url: Ext.SSL_SECURE_URL,
    constructor: function(a) {
        this.iframeId = Ext.id();
        SYNO.SDS.LegacyAppWindow.superclass.constructor.call(this, Ext.apply({
            width: this.jsConfig.width || 800,
            height: this.jsConfig.height || 600,
            html: String.format('<iframe id="{0}" src="{1}" frameborder="0" style="border: 0px none; width: 100%; height: 100%;"></iframe>', this.iframeId, Ext.SSL_SECURE_URL)
        }, a));
        this.setURL(this.url)
    },
    onActivate: function() {
        SYNO.SDS.LegacyAppWindow.superclass.onActivate.apply(this, arguments);
        this.unmaskBody()
    },
    onDeactivate: function() {
        SYNO.SDS.LegacyAppWindow.superclass.onDeactivate.apply(this, arguments);
        this.maskBody()
    },
    setURL: function(a) {
        Ext.getDom(this.iframeId).src = a
    },
    getURL: function() {
        return Ext.getDom(this.iframeId).src
    },
    maskBody: function() {
        var a = this.body.mask();
        a.setOpacity(0);
        this.mon(a, "mousedown", this.toFront, this)
    },
    unmaskBody: function() {
        var a = Ext.Element.data(this.body, "mask");
        if (a) {
            this.mun(a, "mousedown", this.toFront, this);
            this.body.unmask()
        }
    }
});
Ext.namespace("SYNO.SDS.TrayItem");
SYNO.SDS.BaseTrayItem = Ext.extend(Ext.Component, {
    appInstance: null,
    constructor: function() {
        SYNO.SDS.BaseTrayItem.superclass.constructor.apply(this, arguments)
    },
    onClose: Ext.emptyFn,
    onClick: Ext.emptyFn,
    onDblClick: Ext.emptyFn,
    onContextMenu: Ext.emptyFn,
    beforeDestroy: function() {
        this.onBeforeDestroy();
        SYNO.SDS.BaseTrayItem.superclass.beforeDestroy.apply(this, arguments)
    },
    onBeforeDestroy: function() {
        if (this.appInstance) {
            this.appInstance.removeInstance(this)
        }
    }
});
SYNO.SDS.TrayItem = Ext.extend(SYNO.SDS.BaseTrayItem, {
    msgBox: null,
    constructor: function() {
        SYNO.SDS.TrayItem.superclass.constructor.apply(this, arguments)
    },
    getMsgBox: function() {
        function a(c, b) {
            return function() {
                return b.apply(c, arguments)
            }
        }
        if (!this.msgBox || this.msgBox.isDestroyed) {
            this.msgBox = new SYNO.SDS.MessageBoxV5({});
            this.msgBoxWrapper = {
                show: a(this.msgBox, this.msgBox.showMsg),
                hide: a(this.msgBox, this.msgBox.doClose),
                progress: a(this.msgBox, this.msgBox.progress),
                wait: a(this.msgBox, this.msgBox.wait),
                alert: a(this.msgBox, this.msgBox.alert),
                confirm: a(this.msgBox, this.msgBox.confirm),
                prompt: a(this.msgBox, this.msgBox.prompt),
                getDialog: (function() {
                    return this
                }).createDelegate(this.msgBox),
                isVisible: a(this.msgBox, this.msgBox.isVisible),
                setIcon: a(this.msgBox, this.msgBox.setIconClass),
                updateProgress: a(this.msgBox, this.msgBox.updateProgress),
                updateText: a(this.msgBox, this.msgBox.updateText)
            }
        }
        return this.msgBoxWrapper
    }
});
Ext.namespace("SYNO.SDS.AppTrayItem");
SYNO.SDS.AppTrayItem = Ext.extend(SYNO.SDS.TrayItem, {
    taskButton: null,
    constructor: function(a) {
        var b = this.jsConfig.iconCls !== undefined ? this.jsConfig.iconCls : null;
        this.taskButton = SYNO.SDS.SystemTray.add(this, {});
        this.addManagedComponent(this.taskButton);
        SYNO.SDS.AppTrayItem.superclass.constructor.apply(this, arguments);
        if (b) {
            this.taskButton.setIconClass(b)
        }
        this.setTitle(SYNO.SDS.Utils.GetLocalizedString(this.jsConfig.title, this.jsConfig.jsID))
    },
    onBeforeDestroy: function() {
        this.taskButton = null;
        SYNO.SDS.AppTrayItem.superclass.onBeforeDestroy.apply(this, arguments)
    },
    setIconClass: function(a) {
        this.taskButton.setIconClass(a)
    },
    setTitle: function(a) {
        this.taskButton.setTooltip(a);
        this.taskButton.btnEl.setARIA({
            label: a,
            role: "button",
            tabindex: 0
        })
    },
    setTaskButtonVisible: function(b) {
        var a = this.taskButton.isVisible();
        if (a !== b) {
            this.taskButton.setVisible(b)
        }
    },
    open: Ext.emptyFn,
    request: Ext.emptyFn
});
Ext.define("SYNO.SDS.Tray.ArrowTray", {
    extend: "SYNO.SDS.AppTrayItem",
    arrowCls: "sds-tray-panel-arrow",
    arrowAlignPosition: "t-b",
    arrowToPanelAlignPosition: "b-t",
    constructor: function(a) {
        var b = this;
        b.callParent(arguments);
        b.taskButton.hide();
        b.panel = b.initPanel();
        b.addManagedComponent(b.panel);
        b.mon(Ext.getDoc(), "mousedown", b.onMouseDown, b);
        b.mon(b.panel, "beforeshow", b.onPanelBeforeShow, b)
    },
    initPanel: function() {},
    onPanelBeforeShow: function() {
        var a = this;
        if (!a.panelArrow) {
            a.panelArrow = a.panel.el.createChild({
                tag: "div",
                cls: a.arrowCls
            })
        }
        if (a.panel) {
            a.panelArrow.anchorTo(a.panel.el, a.arrowToPanelAlignPosition, [0, 0])
        }
    },
    containElement: function(a, b) {
        return a[0] <= b[0] && a[1] <= b[1]
    },
    onClose: function() {
        var a = this;
        if (a.panel.isVisible()) {
            a.panel.hide()
        }
    },
    onMouseDown: function(b) {
        var a = this;
        if (b.within(a.taskButton.el)) {
            return
        }
        if (a.panel && a.panel.isVisible() && !b.within(a.panel.el)) {
            a.taskButton.toggle(false);
            a.panel.hide()
        }
    },
    onBeforeDestroy: function() {
        var a = this;
        a.panel = null;
        delete a.panel;
        a.callParent(arguments)
    },
    onClick: function() {
        var a = this;
        if (a.panel.isVisible()) {
            a.taskButton.toggle(false);
            a.panel.hide()
        } else {
            a.panel.show();
            a.panel.el.anchorTo(a.taskButton.el, a.arrowAlignPosition, [0, 11])
        }
    }
});
Ext.define("SYNO.SDS.Tray.Panel", {
    extend: "Ext.Panel",
    constructor: function(a) {
        var b = this;
        a = a || {};
        a = Ext.apply({
            hidden: true,
            floating: true,
            shadow: false,
            renderTo: document.body
        }, a);
        a.cls = a.cls ? a.cls + " sds-tray-panel" : " sds-tray-panel";
        b.callParent([a])
    }
});
Ext.namespace("SYNO.SDS.MessageBox");
SYNO.SDS.MessageBox = Ext.extend(SYNO.SDS.ModalWindow, {
    buttonNames: ["ok", "yes", "no", "cancel"],
    buttonWidth: 0,
    maxWidth: 600,
    minWidth: 300,
    minProgressWidth: 250,
    minPromptWidth: 250,
    emptyText: "&#160;",
    defaultTextHeight: 75,
    mbIconCls: "",
    fbButtons: null,
    opt: null,
    bodyEl: null,
    iconEl: null,
    msgEl: null,
    textboxEl: null,
    textareaEl: null,
    progressBar: null,
    activeTextEl: null,
    passwordEl: null,
    constructor: function(a) {
        this.opt = {};
        this.buttonText = Ext.MessageBox.buttonText;
        SYNO.SDS.MessageBox.superclass.constructor.call(this, Ext.apply(a, this.fillConfig(a)))
    },
    fillConfig: function(b) {
        this.dsmStyle = b.dsmStyle;
        var a = {
            resizable: false,
            minimizable: false,
            maximizable: false,
            closable: true,
            stateful: false,
            buttonAlign: "center",
            width: 400,
            height: 100,
            footer: true,
            cls: "x-window-dlg " + b.cls,
            fbar: new Ext.Toolbar({
                items: this.getButtons(b),
                enableOverflow: false
            })
        };
        Ext.apply(b, a);
        return a
    },
    getButtons: function(a) {
        var b = [];
        this.fbButtons = {};
        Ext.each(this.buttonNames, function(c) {
            b.push(this.fbButtons[c] = new Ext.Button({
                hideModE: "offset",
                text: this.buttonText[c],
                handler: this.handleButton.createDelegate(this, [c])
            }))
        }, this);
        return b
    },
    close: function() {
        if (this.opt.buttons && this.opt.buttons.no && !this.opt.buttons.cancel) {
            this.handleButton("no", "close")
        } else {
            this.handleButton("cancel", "close")
        }
    },
    doClose: function() {
        if (this.activeGhost) {
            var a = Ext.dd.DragDropMgr;
            if (this.dd === a.dragCurrent) {
                a.dragCurrent = null;
                a.dragOvers = {}
            }
            this.unghost(false, false)
        }
        SYNO.SDS.MessageBox.superclass.doClose.apply(this, arguments)
    },
    onRender: function() {
        SYNO.SDS.MessageBox.superclass.onRender.apply(this, arguments);
        this.bodyEl = this.body.createChild({
            html: '<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea><input type="password" class="ext-mb-input" /></div></div>'
        });
        this.iconEl = Ext.get(this.bodyEl.dom.childNodes[0]);
        this.msgEl = Ext.get(this.bodyEl.dom.childNodes[1].childNodes[0]);
        this.textboxEl = Ext.get(this.bodyEl.dom.childNodes[1].childNodes[2].childNodes[0]);
        this.textareaEl = Ext.get(this.bodyEl.dom.childNodes[1].childNodes[2].childNodes[1]);
        this.passwordEl = Ext.get(this.bodyEl.dom.childNodes[1].childNodes[2].childNodes[2]);
        this.progressBar = new Ext.ProgressBar({
            renderTo: this.bodyEl
        });
        this.bodyEl.createChild({
            cls: "x-clear"
        });
        this.textboxEl.enableDisplayMode();
        this.textareaEl.enableDisplayMode();
        this.passwordEl.enableDisplayMode();
        this.addManagedComponent(this.progressBar)
    },
    showMsg: function(a) {
        this.opt = a;
        this.setTitle(a.title || this.emptyText);
        if (this.tools.close) {
            this.tools.close.setDisplayed(a.closable !== false && a.progress !== true && a.wait !== true)
        }
        this.activeTextEl = this.textboxEl;
        a.prompt = a.prompt || (a.multiline ? true : false);
        if (a.prompt) {
            if (a.multiline) {
                this.textboxEl.hide();
                this.textareaEl.show();
                this.textareaEl.setHeight(Ext.isNumber(a.multiline) ? a.multiline : this.defaultTextHeight);
                this.activeTextEl = this.textareaEl;
                this.passwordEl.hide()
            } else {
                if (a.password) {
                    this.textboxEl.hide();
                    this.textareaEl.hide();
                    this.activeTextEl = this.passwordEl;
                    this.passwordEl.show()
                } else {
                    this.textboxEl.show();
                    this.textareaEl.hide();
                    this.passwordEl.hide()
                }
            }
        } else {
            this.textboxEl.hide();
            this.textareaEl.hide();
            this.passwordEl.hide()
        }
        this.activeTextEl.dom.value = a.value || "";
        if (a.prompt) {
            this.focusEl = this.activeTextEl
        } else {
            var c = null,
                b = a.buttons;
            if (b && b.ok) {
                c = this.fbButtons.ok
            } else {
                if (b && b.yes) {
                    c = this.fbButtons.yes
                }
            }
            if (c) {
                this.focusEl = c
            }
        }
        this.setIconClass(Ext.isDefined(a.icon) ? a.icon : null);
        this.buttonWidth = this.updateButtons(a.buttons);
        this.progressBar.setVisible(true === a.progress || true === a.wait);
        this.updateProgress(0, a.progressText);
        this.updateText(a.msg);
        if (a.wait) {
            this.progressBar.wait(a.waitConfig)
        }
        if (a.cls) {
            this.el.addClass(a.cls)
        }
        if (true === a.wait) {
            this.progressBar.wait(a.waitConfig)
        }
        this.alignTo(this.owner ? this.owner.el : document.body, "c-c");
        this.show()
    },
    updateText: function(d) {
        if (!this.opt.width) {
            this.setSize(this.maxWidth, 100)
        }
        this.msgEl.update(d || this.emptyText);
        var b = this.mbIconCls !== "" ? (this.iconEl.getWidth() + this.iconEl.getMargins("lr")) : 0,
            f = this.msgEl.getWidth() + this.msgEl.getMargins("lr"),
            c = this.getFrameWidth("lr"),
            e = this.body.getFrameWidth("lr"),
            a;
        if (Ext.isIE && b > 0) {
            b += 3
        }
        a = Math.max(Math.min(this.opt.width || b + f + c + e, this.opt.maxWidth || this.maxWidth), Math.max(this.opt.minWidth || this.minWidth, this.buttonWidth || 0));
        a += 2 * (this.fbar.getBox().x - this.getBox().x);
        if (this.opt.prompt === true) {
            this.activeTextEl.setWidth(a - b - c - e)
        }
        if (true === this.opt.progress || true === this.opt.wait) {
            this.progressBar.setSize(a - b - c - e)
        }
        if (Ext.isIE && a == this.buttonWidth) {
            a += 4
        }
        this.setSize(a, "auto")
    },
    updateProgress: function(b, a, c) {
        this.progressBar.updateProgress(b, a);
        if (c) {
            this.updateText(c)
        }
        return this
    },
    updateButtons: function(c) {
        var b = 0,
            a;
        if (!c) {
            Ext.each(this.buttonNames, function(d) {
                this.fbButtons[d].hide()
            }, this);
            return b
        }
        Ext.iterate(this.fbButtons, function(d, e) {
            a = c[d];
            if (a) {
                e.show();
                e.setText(Ext.isString(a) ? a : this.buttonText[d]);
                b += e.container.getWidth()
            } else {
                e.hide()
            }
        }, this);
        return b
    },
    handleButton: function(a, b) {
        this.fbButtons[a].blur();
        Ext.callback(this.opt.fn, this.opt.scope || window, [a, this.activeTextEl.dom.value, this.opt, b], 1);
        SYNO.SDS.MessageBox.superclass.close.call(this)
    },
    setIconClass: function(a) {
        if (a && a !== "") {
            this.iconEl.removeClass("x-hidden");
            this.bodyEl.addClass("x-dlg-icon");
            this.iconEl.replaceClass(this.mbIconCls, a);
            this.mbIconCls = a;
            return
        }
        this.iconEl.addClass("x-hidden");
        this.bodyEl.removeClass("x-dlg-icon");
        this.iconEl.removeClass(this.mbIconCls);
        this.mbIconCls = ""
    },
    progress: function(c, b, a) {
        this.showMsg({
            title: c,
            msg: b,
            buttons: false,
            progress: true,
            closable: false,
            minWidth: this.minProgressWidth,
            progressText: a
        });
        return this
    },
    wait: function(c, b, a) {
        this.showMsg({
            title: b,
            msg: c,
            buttons: false,
            closable: false,
            wait: true,
            minWidth: this.minProgressWidth,
            waitConfig: a
        });
        return this
    },
    alert: function(d, c, b, a) {
        this.showMsg({
            title: d,
            msg: c,
            buttons: Ext.MessageBox.OK,
            fn: b,
            scope: a,
            minWidth: this.minWidth
        });
        return this
    },
    confirm: function(e, d, b, a, c) {
        this.showMsg({
            title: e,
            msg: d,
            buttons: c || Ext.MessageBox.YESNO,
            fn: b,
            scope: a,
            icon: Ext.MessageBox.QUESTION,
            minWidth: this.minWidth
        });
        return this
    },
    prompt: function(g, f, d, c, a, e, b) {
        this.showMsg({
            title: g,
            msg: f,
            buttons: Ext.MessageBox.OKCANCEL,
            fn: d,
            minWidth: this.minPromptWidth,
            scope: c,
            prompt: true,
            multiline: a,
            value: e,
            password: b
        });
        return this
    },
    getWrapper: function(b) {
        function a(d, c) {
            return function() {
                return c.apply(d, arguments)
            }
        }
        if (!this.msgBoxWrapper) {
            this.msgBoxWrapper = {
                show: a(this, this.showMsg),
                hide: a(this, this.doClose),
                progress: a(this, this.progress),
                wait: a(this, this.wait),
                alert: a(this, this.alert),
                confirm: a(this, this.confirm),
                prompt: a(this, this.prompt),
                getDialog: (function() {
                    return this
                }).createDelegate(this),
                isVisible: a(this, this.isVisible),
                setIcon: a(this, this.setIconClass),
                updateProgress: a(this, this.updateProgress),
                updateText: a(this, this.updateText)
            }
        }
        this.extra = {};
        Ext.apply(this.extra, b || {});
        return this.msgBoxWrapper
    }
});
Ext.define("SYNO.SDS.MessageBoxV5", {
    extend: "SYNO.SDS.MessageBox",
    constructor: function(a) {
        this.callParent([Ext.apply(a, this.fillConfig(a))])
    },
    fillConfig: function(b) {
        var a = this.callParent(arguments);
        Ext.apply(a, {
            dsmStyle: "v5",
            closable: false,
            header: false,
            draggable: false,
            buttonAlign: "right",
            elements: "body",
            padding: "20px 20px 0 20px"
        });
        Ext.apply(b, a);
        return a
    },
    onRender: function() {
        this.callParent(arguments);
        this.progressStatus = this.bodyEl.createChild({
            tag: "span",
            cls: "syno-mb-progress-status"
        }, this.bodyEl.child(".x-clear"));
        this.progressBar.addClass("syno-mb-progress")
    },
    getButtons: function(a) {
        var b = [];
        this.fbButtons = {};
        this.buttonNames = ["custom", "ok", "yes", "no", "cancel"];
        this.buttonText = Ext.MessageBox.buttonText;
        this.buttonText.custom = this.buttonText.no;
        Ext.each(this.buttonNames, function(c) {
            b.push(this.fbButtons[c] = new SYNO.ux.Button({
                hideModE: "offset",
                btnStyle: this.getButtonStyle(c),
                text: this.buttonText[c],
                handler: this.handleButton.createDelegate(this, [c])
            }))
        }, this);
        return b
    },
    getButtonStyle: function(a) {
        if ("ok" == a || "yes" == a) {
            return "blue"
        }
        return "grey"
    },
    setButtonAlign: function() {
        var a = [];
        Ext.iterate(this.fbButtons, function(b, c) {
            if (!c.hidden) {
                a.push(c)
            }
        }, this);
        if (1 == a.length) {
            a[0].el.center(this.footer)
        }
    },
    isCustomBtnVisible: function() {
        return !this.fbButtons.custom.hidden
    },
    updateProgress: function(c, b, d, a) {
        a = a || false;
        this.progressBar.updateProgress(c, b);
        this.progressStatus.update(b);
        if ((d || b) && a !== true) {
            this.updateText(d)
        } else {
            if (d) {
                this.msgEl.update(d)
            }
        }
        return this
    },
    updateButtons: function(d) {
        var c = 0,
            b, e, a;
        this.fbButtons.custom.removeClass("syno-mb-custom-btn");
        if (!d) {
            Ext.each(this.buttonNames, function(f) {
                this.fbButtons[f].hide()
            }, this);
            return c
        }
        Ext.iterate(this.fbButtons, function(f, g) {
            b = d[f];
            if (b) {
                g.show();
                this.updateBtnByCfg(f, g, b);
                if (this.extra && this.extra.btnStyle !== g.btnStyle && ("yes" === f || "ok" === f) && g.el && (!g.el.hasClass(a))) {
                    e = String.format("syno-ux-button-{0}", g.btnStyle);
                    a = String.format("syno-ux-button-{0}", this.extra.btnStyle || "blue");
                    g.removeClass(e);
                    g.addClass(a)
                }
                c += g.container.getWidth()
            } else {
                g.hide()
            }
        }, this);
        if (this.isCustomBtnVisible()) {
            c += this.iconEl.getWidth() + this.iconEl.getMargins("lr");
            this.fbButtons.custom.addClass("syno-mb-custom-btn")
        }
        return c
    },
    updateBtnByCfg: function(b, c, a) {
        var e = this.buttonText[b],
            d = "grey";
        if (!c.el) {
            return
        }
        if (Ext.isString(a)) {
            e = a
        } else {
            if (Ext.isObject(a) && a.text) {
                e = a.text
            }
        }
        c.setText(e);
        c.removeClass("syno-ux-button-blue");
        c.removeClass("syno-ux-button-red");
        c.removeClass("syno-ux-button-grey");
        if (Ext.isObject(a) && a.btnStyle) {
            d = a.btnStyle
        } else {
            if ("yes" === b || "ok" === b) {
                d = "blue"
            }
        }
        c.addClass("syno-ux-button-" + d)
    },
    updateText: function() {
        this.callParent(arguments);
        if (true === this.opt.progress && this.progressStatus.getWidth() > 0) {
            this.setSize(this.getSize().width + (this.progressStatus.getWidth() + 5), "auto")
        }
        this.setButtonAlign()
    },
    confirmDelete: function(e, d, b, a, c) {
        var f = {
            yes: {
                text: _T("common", "delete"),
                btnStyle: "red"
            },
            no: {
                text: this.buttonText.no
            }
        };
        this.showMsg({
            title: e,
            msg: d,
            buttons: c || f,
            fn: b,
            scope: a,
            icon: Ext.MessageBox.QUESTION,
            minWidth: this.minWidth
        });
        return this
    },
    getWrapper: function(b) {
        function a(d, c) {
            return function() {
                return c.apply(d, arguments)
            }
        }
        if (!this.msgBoxWrapper) {
            this.msgBoxWrapper = {
                show: a(this, this.showMsg),
                hide: a(this, this.doClose),
                progress: a(this, this.progress),
                wait: a(this, this.wait),
                alert: a(this, this.alert),
                confirm: a(this, this.confirm),
                confirmDelete: a(this, this.confirmDelete),
                prompt: a(this, this.prompt),
                getDialog: (function() {
                    return this
                }).createDelegate(this),
                isVisible: a(this, this.isVisible),
                setIcon: a(this, this.setIconClass),
                updateProgress: a(this, this.updateProgress),
                updateText: a(this, this.updateText)
            }
        }
        this.extra = {};
        Ext.apply(this.extra, b || {});
        return this.msgBoxWrapper
    }
});
SYNO.SDS.MessageBoxV5.YESNOCANCEL = {
    custom: true,
    yes: true,
    cancel: true
};
SYNO.SDS.DefinePageList = function(a, b) {
    Ext.define(a, {
        extend: b,
        layout: "border",
        border: false,
        plain: true,
        listItems: null,
        help: undefined,
        activePage: null,
        pageList: null,
        pageCt: null,
        constructor: function(c) {
            var e, d;
            d = Ext.apply({
                items: [this.getPageList(c), this.getPageCt()]
            }, c);
            this.callParent([d]);
            e = this.pageList.getSelectionModel();
            this.mon(e, "selectionchange", this.onSelectionChange, this);
            this.mon(e, "beforeselect", this.onBeforeSelect, this);
            this.mon(this.pageList.getLoader(), "load", function(f) {
                this.fireEvent("moduleready", this)
            }, this, {
                single: true
            })
        },
        getPageList: function(c) {
            var d;
            if (!this.pageList) {
                d = {
                    region: "west",
                    width: 240,
                    padding: "4px 16px 0 12px"
                };
                if (c.dataUrl) {
                    d.dataUrl = c.dataUrl
                } else {
                    if (c.listItems) {
                        d.listItems = c.listItems
                    }
                }
                this.pageList = new SYNO.ux.ModuleList(d)
            }
            return this.pageList
        },
        getPageCt: function() {
            if (!this.pageCt) {
                this.pageCt = new Ext.Panel({
                    layout: "card",
                    padding: "0 12px 0 16px",
                    border: false,
                    frame: false,
                    hideMode: "offsets",
                    region: "center"
                })
            }
            return this.pageCt
        },
        selectPage: function(c) {
            var d;
            if (!c) {
                return
            }
            d = this.pageList.getNodeById(c);
            if (d && this.pageList.getSelectionModel().isSelected(d)) {
                this.handleOpenParams()
            } else {
                this.pageList.selectModule(c)
            }
        },
        getActivePage: function() {
            return this.pageCt.layout.activeItem
        },
        getHelpParam: function() {
            var c, d;
            c = this.getActivePage();
            if (!c) {
                return this.help
            }
            if (Ext.isFunction(c.getHelpParam)) {
                return c.getHelpParam()
            }
            d = this.pageList.getNodeById(c.itemId);
            if (!d) {
                return this.help
            }
            if (d.attributes && Ext.isString(d.attributes.help)) {
                return d.attributes.help
            }
            return this.help
        },
        onLoad: function() {},
        onBeforeSelect: function(d, e, g) {
            var c, f = true;
            if (this.isSkipDeactivateCheck()) {
                this.clearSkipDeactivateCheck();
                return true
            }
            if (!e.leaf) {
                return true
            }
            if (!e.attributes.fn) {
                SYNO.Debug("Error: not implemented yet!!");
                return false
            }
            if (g && g.leaf) {
                c = this.pageCt.getComponent(g.attributes.fn);
                if (c && Ext.isFunction(c.onPageDeactivate)) {
                    f = c.onPageDeactivate()
                }
            }
            if (false === f) {
                this.confirmLostChange(function(h) {
                    if (c && Ext.isFunction(c.onPageConfirm)) {
                        c.onPageConfirm(h)
                    }
                    if (h === "yes") {
                        this.setSkipDeactivateCheck();
                        this.selectPage(e.attributes.fn)
                    }
                }, this)
            }
            return f
        },
        onSelectionChange: function(c, e) {
            var d;
            if (!e.leaf) {
                return
            }
            d = e.attributes.fn;
            if (d) {
                this.launchPage(d)
            }
        },
        onClose: function() {
            var c = this.getActivePage(),
                d = this.callParent(arguments);
            if (this.isSkipDeactivateCheck()) {
                this.clearSkipDeactivateCheck();
                return true
            }
            if (false === d) {
                return false
            }
            if (c && Ext.isFunction(c.onPageDeactivate)) {
                if (false === c.onPageDeactivate()) {
                    this.confirmLostChange(function(e) {
                        if (c && Ext.isFunction(c.onPageConfirm)) {
                            c.onPageConfirm(e)
                        }
                        if (e === "yes") {
                            this.setSkipDeactivateCheck();
                            this.close()
                        }
                    }, this);
                    return false
                }
            }
            return d
        },
        launchPage: function(e) {
            var d = this.pageCt,
                c = d.getComponent(e);
            if (!c) {
                c = this.createPage(e);
                d.add(c)
            }
            if (!c) {
                return false
            }
            d.layout.setActiveItem(e);
            this.activePage = c;
            this.selectTab(0);
            if (c.onPageActivate) {
                c.onPageActivate(this.openParams)
            }
            return true
        },
        handleOpenParams: function() {
            if (this.openParams && this.openParams.tab) {
                this.selectTab(this.openParams.tab)
            }
        },
        selectTab: function(d) {
            var c = this.getActivePage();
            if (!c || !(c instanceof Ext.TabPanel)) {
                return
            }
            if (Ext.isFunction(c.setActiveTab)) {
                c.setActiveTab(d)
            }
        },
        createPage: function(f) {
            var g, d, e = this.appWin || this,
                c = e.jsConfig;
            g = Ext.getClassByName(f);
            d = new g({
                appWin: e,
                jsConfig: c,
                owner: this
            });
            d.itemId = f;
            return d
        },
        confirmLostChange: function(d, c) {
            this.getMsgBox().confirm("", _T("common", "confirm_lostchange"), d, c)
        },
        isSkipDeactivateCheck: function() {
            return !!this.skipDeactivateCheckFlag
        },
        setSkipDeactivateCheck: function() {
            this.skipDeactivateCheckFlag = true
        },
        clearSkipDeactivateCheck: function() {
            this.skipDeactivateCheckFlag = false
        },
        onOpen: function(c) {
            this.callParent(arguments);
            this.onLaunchPage(c)
        },
        onRequest: function(c) {
            this.callParent(arguments);
            this.onLaunchPage(c)
        },
        onLaunchPage: function(d) {
            var c = this.pageList.getRootNode();
            if (c && c.childrenRendered && c.childNodes.length > 0) {
                this.launchPageOnOpen(d)
            } else {
                this.mon(this, "moduleready", function() {
                    this.launchPageOnOpen(d)
                }, this, {
                    single: true
                })
            }
        },
        launchPageOnOpen: function(d) {
            var c;
            if (this.checkModalOrMask()) {
                return
            }
            if (d && d.fn) {
                c = d.fn
            } else {
                c = this.activePage
            }
            this.openParams = d;
            this.selectPage(c);
            this.openParams = null
        }
    })
};
SYNO.SDS.DefinePageList("SYNO.SDS.PageListAppWindow", "SYNO.SDS.AppWindow");
SYNO.SDS.DefinePageList("SYNO.SDS.PageListPanel", "SYNO.ux.Panel");
Ext.namespace("SYNO.SDS.Config");
Ext.namespace("SYNO.SDS.JSLoad");
SYNO.SDS.JSLoad = function(fnName, callback, scope) {
    var JSConfig = SYNO.SDS.Config.JSConfig,
        FnMap = SYNO.SDS.Config.FnMap,
        App = FnMap[fnName],
        depend;

    function jsFileLoaded(jsFile) {
        var jsFileConfig = JSConfig[jsFile],
            jsStatus = SYNO.SDS.JSLoad.JSStatus[jsFile];
        for (var name in jsFileConfig) {
            if (jsFileConfig.hasOwnProperty(name)) {
                if (!FnMap[name] || ("app" !== FnMap[name].config.type && "lib" !== FnMap[name].config.type && "widget" !== FnMap[name].config.type && "standalone" !== FnMap[name].config.type)) {
                    continue
                }
                try {
                    Ext.getClassByName(name).prototype.jsConfig = FnMap[name].config
                } catch (err) {
                    SYNO.Debug("JSLoad apply JSConfig to " + name + " failed: " + err);
                    if (Ext.isDefined(SYNO.SDS.JSDebug)) {
                        throw err
                    }
                }
            }
        }
        jsStatus.loaded = true;
        for (var i = 0; i < jsStatus.reqQueue.length; ++i) {
            jsStatus.reqQueue[i]()
        }
        delete jsStatus.reqQueue
    }

    function ieScriptReady() {
        if ("complete" !== this.readyState && "loaded" !== this.readyState) {
            return
        }
        this.onready()
    }

    function requestJSFileByScript(jsFile) {
        var headID = document.getElementsByTagName("head")[0];
        var newScript = document.createElement("script");
        var src = jsFile;
        src = Ext.urlAppend(src, "v=" + _S("fullversion"));
        if (Ext.isDefined(SYNO.SDS.JSDebug)) {
            src = Ext.urlAppend(src, "_dc=" + (new Date().getTime()))
        }
        SYNO.Debug("JSLoad requesting for  " + jsFile + " by script tag");
        newScript.type = "text/javascript";
        if (Ext.isIE) {
            newScript.onready = jsFileLoaded.createCallback(jsFile);
            newScript.onreadystatechange = ieScriptReady
        } else {
            newScript.onload = jsFileLoaded.createCallback(jsFile)
        }
        newScript.src = src;
        headID.appendChild(newScript)
    }

    function requestJSFileByAjax(jsFile) {
        var jsStatus = SYNO.SDS.JSLoad.JSStatus[jsFile];
        SYNO.Debug("JSLoad requesting for  " + jsFile + " by ajax");
        Ext.Ajax.request({
            method: "GET",
            disableCaching: Ext.isDefined(SYNO.SDS.JSDebug),
            url: Ext.urlAppend(jsFile, "v=" + (jsStatus.version || _S("fullversion"))),
            extraParams: {
                jsFile: jsFile
            },
            failure: function(conn, resp) {
                var jsFile = resp.extraParams.jsFile;
                var backoff = Math.round(5 + Math.random() * 5);
                SYNO.Debug(jsFile + ": " + conn.status + " " + conn.statusText);
                SYNO.Debug("JSLoad request failed: " + jsFile + ", retry after " + backoff + " seconds");
                requestJSFileByAjax.createCallback(jsFile).defer(backoff * 1000)
            },
            success: function(conn, resp) {
                try {
                    var jsFile = resp.extraParams.jsFile;
                    SYNO.Debug("JSLoad request successed: " + jsFile);
                    if (window.execScript) {
                        window.execScript(conn.responseText, "JavaScript")
                    } else {
                        window.eval(conn.responseText)
                    }
                    jsFileLoaded(jsFile)
                } catch (err) {
                    SYNO.Debug("JSLoad import " + jsFile + " failed: " + err);
                    if (Ext.isDefined(SYNO.SDS.JSDebug)) {
                        throw err
                    }
                    return
                }
            }
        })
    }

    function importJSFile(jsFile, callback, scope) {
        var jsFileConfig = JSConfig[jsFile],
            jsStatus = SYNO.SDS.JSLoad.JSStatus[jsFile];
        var new_ver = _S("fullversion");
        for (var name in jsFileConfig) {
            if (!(/\/\.url$/.match(name)) && FnMap[name].config.version) {
                new_ver = FnMap[name].config.version;
                if (jsStatus.version != new_ver) {
                    jsStatus.loaded = false;
                    jsStatus.version = new_ver
                }
                break
            }
        }
        if (jsStatus.loaded) {
            jsStatus[fnName] = true;
            if (callback) {
                callback.call(scope || window)
            }
            return
        }
        if (jsStatus.reqQueue) {
            if (callback) {
                SYNO.Debug("JSLoad enqueue request " + jsFile);
                jsStatus.reqQueue.push(callback.createDelegate(scope || window))
            } else {
                SYNO.Debug("JSLoad skip requesting " + jsFile)
            }
            return
        }
        jsStatus.reqQueue = [];
        if (callback) {
            jsStatus.reqQueue.push(callback.createDelegate(scope || window))
        }
        switch (SYNO.SDS.JSDebug) {
            case "script":
            case "all":
                requestJSFileByScript(jsFile);
                break;
            default:
                requestJSFileByAjax(jsFile)
        }
    }
    if (!App) {
        SYNO.Debug("JSLoad cannot find " + fnName);
        return
    }
    depend = App.config.depend || [];
    if (Ext.isArray(depend)) {
        for (var depIdx = 0; depIdx < depend.length; ++depIdx) {
            var depName = depend[depIdx];
            var depApp = FnMap[depName];
            if (!depApp) {
                SYNO.Debug("JSLoad cannot find " + depName + ", required by " + fnName);
                return
            }
            if (!SYNO.SDS.JSLoad.JSStatus[depApp.jsFile][depName]) {
                SYNO.SDS.JSLoad(depName, SYNO.SDS.JSLoad.createCallback(fnName, callback, scope), this);
                return
            }
        }
    }
    importJSFile(App.jsFile, callback, scope)
};
SYNO.SDS.JSLoad.overrideConfig = function() {
    var a, c = SYNO.SDS.Config.FnMap,
        d = "../../resources/images/package/",
        b = {
            "SYNO.SDS._ThirdParty.Desktop.MailStation": {
                allUsers: true,
                icon: d + "MailStation_{0}.png"
            },
            "SYNO.SDS._ThirdParty.Desktop.SqueezeCenter": {
                icon: d + "SqueezeboxServer_{0}.png"
            },
            "SYNO.SDS._ThirdParty.Desktop.Webalizer": {
                icon: d + "Webalizer_{0}.png"
            },
            "SYNO.SDS._ThirdParty.Desktop.phpMyAdmin": {
                icon: d + "phpMyAdmin_{0}.png"
            },
            "SYNO.SDS.PersonalPhotoStation": {
                title: "Photo Station - " + _S("user")
            }
        };
    if (Ext.isIE7) {
        Ext.apply(b, {
            "SYNO.SDS.DownloadStation.Application": {
                type: "standalone"
            },
            "SYNO.SDS.AudioStation.Application": {
                type: "standalone"
            }
        })
    }
    if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
        Ext.apply(b, {
            "SYNO.SDS.ACEEditor.Application": {
                hidden: true
            }
        })
    }
    for (a in b) {
        if (Ext.isObject(c[a])) {
            Ext.apply(c[a].config, b[a])
        }
    }
};
SYNO.SDS.JSLoad.init = function() {
    SYNO.SDS.Config.FnMap = {};
    SYNO.SDS.Config.AutoLaunchFnList = [];
    var e = SYNO.SDS.Config.JSConfig;
    var b = SYNO.SDS.Config.FnMap;
    b["SYNO.SDS.VirtualGroup"] = {
        config: {
            title: "Group Icon",
            jsBaseURL: "resources"
        }
    };

    function a() {
        var l = [],
            n = function(p) {
                if (Ext.isString(p.getIconFn)) {
                    l.push(p.getIconFn)
                }
            };
        for (var i in e) {
            if (e.hasOwnProperty(i)) {
                for (var f in e[i]) {
                    if (e[i].hasOwnProperty(f)) {
                        if (Ext.isObject(b[f])) {
                            SYNO.Debug(f + " Conflict!!! " + b[f].jsFile + ", " + i);
                            continue
                        }
                        b[f] = {
                            jsFile: i,
                            jsFileConfig: e[i],
                            config: e[i][f]
                        };
                        if (Ext.isArray(e[i][f].fb_extern)) {
                            Ext.each(e[i][f].fb_extern, n)
                        }
                    }
                }
                if (!Ext.isObject(SYNO.SDS.JSLoad.JSStatus[i])) {
                    SYNO.SDS.JSLoad.JSStatus[i] = {};
                    if (/\/\.url$/.match(i)) {
                        SYNO.SDS.JSLoad.JSStatus[i].loaded = true
                    }
                } else {
                    var m = SYNO.SDS.JSLoad.JSStatus[i],
                        o = _S("fullversion");
                    for (var k in e[i]) {
                        if (e[i].hasOwnProperty(k)) {
                            if (!(/\/\.url$/.match(k)) && b[k] && b[k].config.version) {
                                o = b[k].config.version;
                                if (m.version != o) {
                                    SYNO.SDS.JSLoad.JSStatus[i][k] = false;
                                    m.loaded = false
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!Ext.isEmpty(l) && b["SYNO.SDS.App.FileStation3.Instance"]) {
            var h = b["SYNO.SDS.App.FileStation3.Instance"].jsFileConfig["SYNO.SDS.App.FileStation3.Instance"];
            h.depend = h.depend.concat(l)
        }
        SYNO.SDS.JSLoad.overrideConfig();
        for (var g in b) {
            if (b.hasOwnProperty(g)) {
                if ("standalone" === b[g].config.type || true === b[g].config.allowStandalone) {
                    var j = Ext.urlDecode(window.location.search.substr(1)) || {};
                    b[g].config.url = Ext.urlAppend(window.location.protocol + "//" + window.location.host + window.location.pathname, Ext.urlEncode(Ext.apply(j, {
                        launchApp: g
                    })))
                }
                d(g, g, []);
                c(g, b[g].config)
            }
        }
    }

    function c(g, f) {
        if (f.type !== "app" || f.autoLaunch !== true) {
            return
        }
        SYNO.SDS.Config.AutoLaunchFnList.push(g)
    }

    function d(g, l, f) {
        var k = b[l].config.depend;
        f.push(l);
        if (Ext.isArray(k)) {
            var i = k.indexOf(g);
            if (i >= 0) {
                SYNO.Debug("Dependency loop detected: " + g + " <--> " + l);
                k.splice(i, 1);
                return
            }
            for (var h = 0; h < k.length; ++h) {
                var j = k[h];
                if (!b[j]) {
                    SYNO.Debug("Dependency missing: " + l + " --> " + j);
                    k.splice(h, 1);
                    --h;
                    continue
                }
                if (f.indexOf(j) < 0) {
                    d(g, j, f)
                }
            }
        }
    }
    a()
};
SYNO.SDS.JSLoad.RemoveJSSatusByAppName = function(b) {
    var a = SYNO.SDS.Config.FnMap[b];
    if (a) {
        delete SYNO.SDS.JSLoad.JSStatus[a.jsFile]
    }
};
SYNO.SDS.JSLoad.JSStatus = {};
Ext.namespace("SYNO.SDS.AppLaunch");
SYNO.SDS.WindowLaunch = function(i, d, h) {
    var e = SYNO.SDS.Config.FnMap[i],
        l = "";
    if (!e) {
        return false
    }
    if ("standalone" === e.config.type || true === e.config.allowStandalone || "url" === e.config.type || "legacy" === e.config.type) {
        if (!e.config.url && !SYNO.SDS.UrlTag[e.config.urlTag]) {
            return false
        }
        if (Ext.isObject(d)) {
            l = {
                launchParam: Ext.urlEncode(d)
            };
            if (Ext.isDefined(d.ieMode)) {
                l.ieMode = d.ieMode
            }
        }
        var a = e.config.url || SYNO.SDS.UrlTag[e.config.urlTag] || "";
        if (SYNO.SDS.QuickConnect.Utils.isInTunnel() && !SYNO.SDS.IsDSMPortalWhiteList(i) && "url" === e.config.type) {
            var b = new SYNO.SDS.MessageBoxV5({
                modal: true,
                draggable: false,
                renderTo: document.body
            });
            b.alert(_T("relayservice", "package_not_supported"), _T("relayservice", "package_not_supported"));
            return false
        }
        if ((e.config.port || e.config.protocol) && ("http" !== a.substr(0, 4).toLowerCase())) {
            var k = e.config.protocol || window.location.protocol;
            var c = e.config.port || window.location.port || "";
            if (c) {
                c = ":" + c
            }
            if (SYNO.SDS.QuickConnect.Utils.isInTunnel()) {
                k = "https";
                c = ""
            }
            a = k + "://" + window.location.hostname + c + a
        }
        var j = a.split("?"),
            f, g;
        if (j.length > 2) {
            j[1] = j.splice(1, j.length - 1).join("?")
        }
        f = j[1] ? Ext.urlDecode(j[1]) : {};
        g = Ext.apply(f, l);
        if (false === h) {
            window.location = Ext.urlAppend(j[0], Ext.urlEncode(g), false)
        } else {
            window.open(Ext.urlAppend(j[0], Ext.urlEncode(g), false), e.config.urlTarget ? e.config.urlTarget + SYNO.SDS.LaunchTime : "_blank", e.config.windowParam || "")
        }
        return true
    }
    return false
};
SYNO.SDS.IsDSMPortalWhiteList = function(b) {
    var a = {
        "SYNO.SDS.PersonalPhotoStation": true,
        "SYNO.SDS.PhotoStation": true,
        "SYNO.SDS.SurveillanceStation": true
    };
    return (b in a)
};
SYNO.SDS.IsHABlackList = function(c) {
    var a = ["SYNO.SDS.EzInternet.Instance"];
    for (var b = 0; b < a.length; b++) {
        if ("SYNO.SDS.EzInternet.Instance" === c) {
            return true
        }
    }
    return false
};
SYNO.SDS.AppLaunch = function(className, param, newInstance, callback, scope) {
    var appCfg, taskButton = null,
        App = SYNO.SDS.Config.FnMap[className],
        matchInstance = null,
        appPrivClassName = className,
        generateLegacyApp = function() {
            var url = appCfg.url,
                tpl = "".concat("Ext.namespace('{0}');", "{0} = Ext.extend(SYNO.SDS.AppInstance, {", "appWindowName: '{0}.MainWindow'", "});", "{0}.MainWindow = Ext.extend(SYNO.SDS.LegacyAppWindow, {", "constructor: function(config) {", "{0}.MainWindow.superclass.constructor.call(this, Ext.apply({", "url: '{1}'", "}, config));", "}", "});", "{0}.prototype.jsConfig = SYNO.SDS.Config.FnMap['{0}'].config;", "{0}.MainWindow.prototype.jsConfig = SYNO.SDS.Config.FnMap['{0}'].config;");
            if (window.execScript) {
                window.execScript(String.format(tpl, className, url), "JavaScript")
            } else {
                window.eval(String.format(tpl, className, url))
            }
        },
        instanceCount = function() {
            var count = 0;
            var oldInstance = SYNO.SDS.AppMgr.getByAppName(className);
            if (true === appCfg.matchInstanceName) {
                oldInstance.each(function(item, index, length) {
                    if (item.instanceName === param.instanceName) {
                        matchInstance = item;
                        count++
                    }
                })
            } else {
                count = oldInstance.length
            }
            return count
        },
        canLaunchNewApp = function() {
            var loadingCnt = appCfg.loadingCnt || 0,
                currInst = instanceCount(),
                maxInst = appCfg.allowMultiInstance ? appCfg.maxInstance || 0 : 1;
            return (!maxInst || maxInst > (loadingCnt + currInst))
        },
        requestToOldInstance = function() {
            var oldInstance = null;
            if (matchInstance) {
                matchInstance.open(param);
                return true
            } else {
                oldInstance = SYNO.SDS.AppMgr.getByAppName(className);
                if (oldInstance.length > 0) {
                    oldInstance[oldInstance.length - 1].open(param);
                    return true
                }
            }
            return false
        },
        launchApp = function() {
            var appInst;
            try {
                var Fn;
                if (SYNO.SDS.WindowMgr.allHided) {
                    SYNO.SDS.WindowMgr.toggleAllWin();
                    SYNO.SDS.StatusNotifier.on("allwinrestored", launchApp, this, {
                        single: true
                    });
                    return
                }
                appCfg.loadingCnt--;
                try {
                    Fn = Ext.getClassByName(className)
                } catch (err) {}
                if (!Fn && "legacy" === appCfg.type) {
                    generateLegacyApp();
                    Fn = Ext.getClassByName(className)
                }
                if (taskButton || (newInstance && canLaunchNewApp()) || !requestToOldInstance()) {
                    if (!(Fn.prototype instanceof SYNO.SDS.AppInstance)) {
                        SYNO.Debug(className + " is not extends from AppInstance.");
                        return
                    }
                    appInst = new Fn(Ext.copyTo({
                        taskButton: taskButton
                    }, param, "instanceName"));
                    appInst.open(param)
                }
            } catch (err) {
                SYNO.Debug(className + " launch failed: " + err);
                if (Ext.isDefined(SYNO.SDS.JSDebug)) {
                    throw err
                }
                return
            }
            if (callback) {
                callback.call(scope || window, appInst)
            }
        };
    if (!App || !App.config) {
        return
    }
    appCfg = App.config;
    if (_S("ha_running") && SYNO.SDS.IsHABlackList(className)) {
        var msgBox = new SYNO.SDS.MessageBoxV5({
            modal: true,
            draggable: false,
            renderTo: document.body
        });
        msgBox.getWrapper().alert(_D("product"), _TT("SYNO.SDS.HA.Instance", "ui", "warning_forbidden_action"));
        return
    }
    if (param && param.className) {
        appPrivClassName = param.className
    }
    if (!SYNO.SDS.StatusNotifier.isAppEnabled(appPrivClassName)) {
        return
    }
    if ("url" === appCfg.type || ("standalone" === appCfg.type && !_S("standalone")) || ("legacy" === appCfg.type && "url" === appCfg.urlDefMode)) {
        SYNO.SDS.WindowLaunch(className, param, !_S("rewriteApp"));
        return
    }
    if ("standalone" !== appCfg.type && "app" !== appCfg.type && "legacy" !== appCfg.type) {
        SYNO.Debug(className + " is not app type.");
        return
    }
    if (SYNO.SDS.WindowMgr.allHided) {
        SYNO.SDS.WindowMgr.toggleAllWin();
        SYNO.SDS.AppLaunch.defer(1000, this, arguments);
        return
    }
    if (SYNO.SDS.WindowMgr.exposeMask) {
        SYNO.SDS.WindowMgr.exposeWindow();
        SYNO.SDS.AppLaunch.defer(1000, this, arguments);
        return
    }
    param = param || {};
    if (Ext.isString(param)) {
        param = Ext.urlDecode(param)
    }
    newInstance = newInstance && (appCfg.allowMultiInstance || false);
    if (!_S("standalone") && (appCfg.hideTaskBtn !== true) && Ext.isDefined(appCfg.appWindow) && ((newInstance && canLaunchNewApp()) || (!instanceCount() && !appCfg.loadingCnt))) {
        taskButton = SYNO.SDS.TaskButtons.add(className, appCfg.appWindow);
        taskButton.setState("loading")
    }
    if (!Ext.isNumber(appCfg.loadingCnt)) {
        appCfg.loadingCnt = 0
    }
    appCfg.loadingCnt++;
    if (_S("standalone")) {
        var oldcallback = callback;
        var el = SYNO.SDS.Desktop.getEl();
        el.addClass("sds-window-v5");
        el.mask(_WFT("common", "loading"), "x-mask-loading");
        callback = function() {
            el.unmask();
            el.removeClass("sds-window-v5");
            if (oldcallback) {
                oldcallback.call(scope || window)
            }
        }
    }
    SYNO.SDS.JSLoad(className, launchApp)
};
Ext.define("SYNO.SDS.Utils.Notify.Badge", {
    extend: "Ext.BoxComponent",
    badgeNum: 0,
    alignPos: "br-br",
    alignOffset: [0, 0],
    badgeClassName: "sds-application-notify-badge-num",
    badgeHeight: 24,
    badgeWidth: 34,
    constructor: function(a) {
        if (a.badgeClassName && a.badgeClassName != this.badgeClassName) {
            this.badgeHeight = 14;
            this.badgeWidth = 19
        }
        this.callParent([a])
    },
    onRender: function(b, a) {
        if (!this.container.badgeEl) {
            this.el = new Ext.Element(document.createElement("div"));
            this.el.id = Ext.id();
            this.container.badgeEl = this.el;
            this.el.addClass(this.badgeClassName)
        }
        this.updateBadgePos();
        this.setNum(this.badgeNum);
        SYNO.SDS.Utils.Notify.Badge.superclass.onRender.call(this, b, a)
    },
    afterRender: function() {
        SYNO.SDS.Utils.Notify.Badge.superclass.afterRender.call(this);
        this.updateBadgePos()
    },
    bounceBadge: function() {
        if (Ext.isIE9m) {
            this.orgX = this.el.getX();
            this.orgY = this.el.getY();
            this.el.shift({
                x: this.orgX,
                y: this.orgY - 8,
                duration: 0,
                opacity: 0.3
            });
            this.el.shift({
                width: this.badgeWidth,
                height: this.badgeHeight,
                x: this.orgX,
                y: this.orgY,
                easing: "bounceOut",
                duration: 0.6,
                opacity: 1
            })
        } else {
            this.el.setStyle("opacity", 1);
            this.el.addClass("bounce-effect");
            Ext.defer(function() {
                this.el.removeClass("bounce-effect")
            }, 1000, this)
        }
    },
    setNum: function(a) {
        var b = this.badgeNum;
        if (!this.el) {
            return
        }
        a = a || 0;
        this.badgeNum = a;
        if (a <= 0) {
            this.el.setStyle("opacity", 0);
            return
        }
        if (a > 99) {
            a = 100
        }
        if (Math.min(b, 100) === a) {
            return
        }
        this.updateBadgePos();
        this.el.setStyle("background-position", "left -" + (this.badgeHeight * (a - 1)) + "px");
        this.bounceBadge()
    },
    updateBadgePos: function() {
        if (!this.el) {
            return
        }
        this.el.anchorTo(this.container, this.alignPos, this.alignOffset)
    }
});
Ext.namespace("SYNO.SDS.Gesture");
SYNO.SDS.Gesture.EmptyGesture = Ext.extend(Ext.util.Observable, {
    onTouchStart: Ext.emptyFn,
    onTouchMove: Ext.emptyFn,
    onTouchEnd: Ext.emptyFn,
    onTouchCancel: Ext.emptyFn
});
SYNO.SDS.Gesture.BaseGesture = Ext.extend(SYNO.SDS.Gesture.EmptyGesture, {
    constructor: function() {
        SYNO.SDS.Gesture.BaseGesture.superclass.constructor.apply(this, arguments)
    },
    getBrowserEvent: function(a) {
        if (!a || !a.browserEvent) {
            return null
        }
        return a.browserEvent
    },
    getFirstTouch: function(a) {
        var c = null,
            b;
        b = this.getBrowserEvent(a);
        if (b && b.touches && b.touches.length > 0) {
            c = b.touches[0]
        }
        return c
    },
    getFirstChangedTouch: function(a) {
        var c = null,
            b;
        b = this.getBrowserEvent(a);
        if (b && b.changedTouches && b.changedTouches.length > 0) {
            c = b.changedTouches[0]
        }
        return c
    },
    getChangedTouchCount: function(a) {
        var b;
        b = this.getBrowserEvent(a);
        if (!b || !b.changedTouches || !Ext.isNumber(b.changedTouches.length)) {
            return -1
        }
        return b.changedTouches.length
    },
    getTouchCount: function(a) {
        var b;
        b = this.getBrowserEvent(a);
        if (!b || !b.touches || !Ext.isNumber(b.touches.length)) {
            return -1
        }
        return b.touches.length
    }
});
SYNO.SDS.Gesture.Swipe = Ext.extend(SYNO.SDS.Gesture.BaseGesture, {
    config: {
        minDistance: 80,
        maxOffset: 100,
        maxDuration: 1000
    },
    fireSwipe: function(a, e, c, d, b) {
        SYNO.SDS.GestureMgr.fireEvent("swipe", a, e, c, d, b)
    },
    getMinDistance: function() {
        return this.config.minDistance
    },
    getMaxOffset: function() {
        return this.config.maxOffset
    },
    getMaxDuration: function() {
        return this.config.maxDuration
    },
    setInitialXY: function(c) {
        var b, a, d;
        for (b = 0, a = c.changedTouches.length; b < a; b++) {
            d = c.changedTouches[b];
            this.initialTouches[d.identifier] = {
                x: d.pageX,
                y: d.pageY
            }
        }
    },
    getInitialXY: function(b) {
        var a = this.initialTouches[b.identifier];
        return {
            x: a.x,
            y: a.y
        }
    },
    onTouchStart: function(a, b, d) {
        var c = this.getBrowserEvent(a);
        this.startTime = c.timeStamp;
        this.isHorizontal = true;
        this.isVertical = true;
        if (!this.initialTouches) {
            this.initialTouches = {}
        }
        this.setInitialXY(c);
        this.touchCount = this.getTouchCount(a)
    },
    onTouchMove: function(a, b, c) {
        if (3 !== this.getTouchCount(a)) {
            return false
        }
        a.preventDefault();
        return this.checkTouchMove(a, b, c)
    },
    checkTouchXY: function(g, e, c) {
        var b, f, d, a;
        b = g.pageX;
        f = g.pageY;
        d = Math.abs(b - e);
        a = Math.abs(f - c);
        if (this.isVertical && d > this.getMaxOffset()) {
            this.isVertical = false
        }
        if (this.isHorizontal && a > this.getMaxOffset()) {
            this.isHorizontal = false
        }
        if (!this.isHorizontal && !this.isVertical) {
            return this.fail()
        }
    },
    checkTouchMove: function(j, b, d) {
        var g, i, c, h, a, f;
        h = this.getBrowserEvent(j);
        a = h.timeStamp;
        if (a - this.startTime > this.getMaxDuration()) {
            return this.fail()
        }
        for (g = 0, f = h.changedTouches.length; g < f; g++) {
            c = h.changedTouches[g];
            i = this.initialTouches[c.identifier];
            if (!i) {
                SYNO.Debug("Error: initial does not exist when handle touchmove, TouchEvent id:" + c.identifier);
                continue
            }
            if (false === this.checkTouchXY(c, i.x, i.y)) {
                return false
            }
        }
    },
    onTouchEnd: function(o, d, j) {
        var i, m, k, b, h, g, e, c, n, f, l, a;
        if (this.getTouchCount(o) !== 0) {
            return false
        }
        if (this.touchCount !== 3) {
            return false
        }
        i = this.getFirstChangedTouch(o);
        if (!i) {
            return false
        }
        m = i.pageX;
        k = i.pageY;
        b = this.getInitialXY(i);
        h = m - b.x;
        g = k - b.y;
        e = Math.abs(h);
        c = Math.abs(g);
        n = this.getMinDistance();
        f = o.browserEvent.timeStamp - this.startTime;
        if (this.isVertical && c < n) {
            this.isVertical = false
        }
        if (this.isHorizontal && e < n) {
            this.isHorizontal = false
        }
        if (this.isHorizontal) {
            l = (h < 0) ? "left" : "right";
            a = e
        } else {
            if (this.isVertical) {
                l = (g < 0) ? "up" : "down";
                a = c
            } else {
                return this.fail()
            }
        }
        this.fireSwipe(o, i, l, a, f)
    },
    fail: function() {
        return false
    }
});
SYNO.SDS.Gesture.LongPress = Ext.extend(SYNO.SDS.Gesture.BaseGesture, {
    config: {
        minDuration: 500
    },
    fireLongPress: function(a, b) {
        SYNO.SDS.GestureMgr.fireEvent("longpress", a, b)
    },
    getMinDuration: function() {
        return this.config.minDuration
    },
    onTouchStart: function(a, c, d) {
        var b = this;
        if (this.timer) {
            this.removeTimer()
        }
        this.timer = setTimeout(function() {
            b.fireLongPress(a, c);
            this.timer = null
        }, this.getMinDuration())
    },
    onTouchMove: function() {
        return this.fail()
    },
    onTouchEnd: function(a, b, c) {
        return this.fail()
    },
    removeTimer: function() {
        clearTimeout(this.timer);
        this.timer = null
    },
    fail: function() {
        this.removeTimer();
        return false
    }
});
SYNO.SDS.Gesture.DoubleTap = Ext.extend(SYNO.SDS.Gesture.BaseGesture, {
    config: {
        maxDuration: 300,
        maxOffset: 50
    },
    singleTapTimer: null,
    fireSingleTap: function(a, b) {},
    fireDoubleTap: function(a, b) {
        a.preventDefault();
        SYNO.SDS.GestureMgr.fireEvent("doubletap", a, b)
    },
    getMaxDuration: function() {
        return this.config.maxDuration
    },
    getMaxOffset: function() {
        return this.config.maxOffset
    },
    onTouchStart: function(a, b, c) {
        if (!a || !a.browserEvent) {
            return
        }
        if (this.isInMaxDuration(a.browserEvent.timeStamp, this.lastTapTime)) {
            a.preventDefault()
        }
    },
    onTouchMove: function() {
        return this.fail()
    },
    onTouchEnd: function(j, d, f) {
        var c, i = this.lastTapTime,
            b = this.lastX,
            a = this.lastY,
            e, h, g;
        if (this.getTouchCount(j) > 0) {
            return this.fail()
        }
        if (j && j.browserEvent) {
            c = j.browserEvent.timeStamp
        }
        this.lastTapTime = c;
        e = this.getFirstChangedTouch(j);
        if (!e) {
            return false
        }
        h = e.pageX;
        g = e.pageY;
        this.lastX = h;
        this.lastY = g;
        if (i && this.checkXY(b, a)) {
            if (this.isInMaxDuration(c, i)) {
                this.lastTapTime = 0;
                this.fireDoubleTap(j, d);
                return
            }
        }
    },
    checkXY: function(b, e) {
        var c = Math.abs(this.lastX - b),
            a = Math.abs(this.lastY - e),
            d = this.getMaxOffset();
        if (c < d && a < d) {
            return true
        }
        return false
    },
    isInMaxDuration: function(b, a) {
        if (!b || !a) {
            return false
        }
        return ((b - a) <= this.getMaxDuration()) ? true : false
    },
    fail: function() {
        this.lastTapTime = 0;
        this.lastX = undefined;
        this.lastY = undefined;
        return false
    }
});
Ext.ns("SYNO.SDS.Gesture.MS");
SYNO.SDS.Gesture.MS.Swipe = Ext.extend(SYNO.SDS.Gesture.Swipe, {
    config: {
        minDistance: 80,
        maxOffset: 500,
        maxDuration: 1000
    },
    constructor: function() {
        var a = this;
        SYNO.SDS.Gesture.MS.Swipe.superclass.constructor.apply(a, arguments)
    },
    setInitialXY: function(a) {
        this.initialTouches[a.pointerId] = {
            x: a.pageX,
            y: a.pageY
        }
    },
    getTouchCount: function() {
        var b, a = 0;
        if (this.initialTouches) {
            for (b in this.initialTouches) {
                if (this.initialTouches.hasOwnProperty(b)) {
                    a++
                }
            }
        }
        return a
    },
    checkTouchXY: function(g, e, c) {
        var b, f, d, a;
        b = g.pageX;
        f = g.pageY;
        d = Math.abs(b - e);
        a = Math.abs(f - c);
        if (this.isVertical && d > this.getMaxOffset()) {
            this.isVertical = false
        }
        if (this.isHorizontal && a > this.getMaxOffset()) {
            this.isHorizontal = false
        }
        if (!this.isHorizontal && !this.isVertical) {
            return this.fail()
        }
    },
    checkTouchMove: function(a, c, g) {
        var i, f, d;
        f = this.getBrowserEvent(a);
        d = f.timeStamp;
        if (d - this.startTime > this.getMaxDuration()) {
            return this.fail()
        }
        for (i in this.initialTouches) {
            if (this.initialTouches.hasOwnProperty(i)) {
                var b = this.initialTouches[i],
                    h;
                if (f && f.touches && f.touches.length > 0) {
                    h = f.touches[0]
                }
                if (!b) {
                    SYNO.Debug("Error: initial does not exist when handle touchmove, TouchEvent id:" + h.identifier);
                    continue
                }
                if (false === this.checkTouchXY(f, b.x, b.y)) {
                    return false
                }
            }
        }
    },
    onTouchStart: function(a, b, d) {
        var c = this.getBrowserEvent(a);
        this.startTime = c.timeStamp;
        this.isHorizontal = true;
        this.isVertical = true;
        if (!this.initialTouches) {
            this.initialTouches = {}
        }
        this.setInitialXY(c);
        this.touchCount = this.getTouchCount()
    },
    onTouchMove: function(a, b, c) {
        if (3 !== this.getTouchCount()) {
            return false
        }
        a.preventDefault();
        return this.checkTouchMove(a, b, c)
    },
    onTouchEnd: function(q, d, k) {
        var j, o, m, i, h, f, c, p, g, n, a, b, l = this.getBrowserEvent(q);
        if (!this.initialTouches || !this.initialTouches[l.pointerId]) {
            return false
        }
        b = this.initialTouches[l.pointerId];
        delete this.initialTouches[l.pointerId];
        if (this.getTouchCount() !== 0) {
            return false
        }
        if (this.touchCount !== 3) {
            return false
        }
        o = l.pageX;
        m = l.pageY;
        i = o - b.x;
        h = m - b.y;
        f = Math.abs(i);
        c = Math.abs(h);
        p = this.getMinDistance();
        g = l.timeStamp - this.startTime;
        if (this.isVertical && c < p) {
            this.isVertical = false
        }
        if (this.isHorizontal && f < p) {
            this.isHorizontal = false
        }
        if (this.isHorizontal) {
            n = (i < 0) ? "left" : "right";
            a = f
        } else {
            if (this.isVertical) {
                n = (h < 0) ? "up" : "down";
                a = c
            } else {
                return this.fail()
            }
        }
        this.fireSwipe(q, j, n, a, g)
    },
    onTouchCancel: function() {
        this.fail();
        delete this.initialTouches
    }
});
SYNO.SDS.Gesture.EmptyGestureObject = new SYNO.SDS.Gesture.EmptyGesture();
SYNO.SDS.Gesture.MS.EmptyGestureObject = SYNO.SDS.Gesture.EmptyGestureObject;
SYNO.SDS.Gesture.GestureFactory = Ext.extend(Object, {
    create: function(c) {
        var a = SYNO.SDS.UIFeatures.test("msPointerEnabled"),
            b = "SYNO.SDS.Gesture." + (a ? "MS." : "");
        switch (c) {
            case "Swipe":
                if (a && ((window.navigator.msMaxTouchPoints ? window.navigator.msMaxTouchPoints : 0) < 3)) {
                    return SYNO.SDS.Gesture.MS.EmptyGestureObject
                }
                b += c;
                break;
            case "LongPress":
                if (a) {
                    return SYNO.SDS.Gesture.MS.EmptyGestureObject
                }
                b += c;
                break;
            case "DoubleTap":
                if (a) {
                    return SYNO.SDS.Gesture.MS.EmptyGestureObject
                }
                b += c;
                break;
            default:
                if (a) {
                    return SYNO.SDS.Gesture.MS.EmptyGestureObject
                }
                return SYNO.SDS.Gesture.EmptyGestureObject
        }
        return this.getGestureInstance(b)
    },
    getGestureInstance: function(a) {
        var b = Ext.getClassByName(a);
        return new b()
    }
});
Ext.namespace("SYNO.SDS._GestureMgr");
SYNO.SDS._GestureMgr = Ext.extend(Ext.util.Observable, {
    constructor: function() {
        SYNO.SDS._GestureMgr.superclass.constructor.apply(this, arguments);
        this.gestures = ["Swipe", "LongPress", "DoubleTap"];
        this.init()
    },
    init: function() {
        var b, a, e, d, c = SYNO.SDS.UIFeatures.test("msPointerEnabled");
        e = Ext.getDoc();
        for (b = 0, a = this.gestures.length; b < a; b++) {
            d = this.getGestureInstance(this.gestures[b]);
            Ext.EventManager.on(e, c ? "MSPointerCancel" : "touchcancel", d.onTouchCancel, d);
            Ext.EventManager.on(e, c ? "MSPointerDown" : "touchstart", d.onTouchStart, d);
            Ext.EventManager.on(e, c ? "MSPointerUp" : "touchend", d.onTouchEnd, d);
            Ext.EventManager.on(e, c ? "MSPointerMove" : "touchmove", d.onTouchMove, d)
        }
        this.addGestureHandlers()
    },
    addGestureHandlers: function() {
        this.on("swipe", this.swipeHandler, this, {
            buffer: 10
        });
        this.on("longpress", this.longPressHandler, this);
        this.on("doubletap", this.doubleTapHandler, this)
    },
    getGestureInstance: function(a) {
        this.gestureFactory = this.gestureFactory || new SYNO.SDS.Gesture.GestureFactory();
        return this.gestureFactory.create(a)
    },
    swipeHandler: function(a, f, d, e, c) {
        var b;
        if (d === "right") {
            SYNO.SDS.TaskButtons.setRightWindowActive()
        } else {
            if (d === "left") {
                SYNO.SDS.TaskButtons.setLeftWindowActive()
            } else {
                if (d === "up") {
                    b = SYNO.SDS.WindowMgr.getActiveAppWindow();
                    if (b) {
                        b.minimize()
                    }
                }
            }
        }
    },
    longPressHandler: function(c, e) {
        var d, b, a;
        d = this.findEventHandlers(e, "contextmenu");
        for (b = 0, a = d.length; b < a; b++) {
            d[b](c.browserEvent)
        }
    },
    doubleTapHandler: function(c, e) {
        var d, b, a;
        d = this.findEventHandlers(e, "dblclick");
        for (b = 0, a = d.length; b < a; b++) {
            d[b](c.browserEvent)
        }
    },
    findEventHandlers: function(h, d) {
        var g = Ext.get(h),
            f, b, a, e, c = [];
        while (g) {
            f = Ext.EventManager.getListeners(g, d);
            if (!f) {
                g = g.parent();
                continue
            }
            for (b = 0, a = f.length; b < a; b++) {
                e = f[b];
                c.push(e[1])
            }
            break
        }
        return c
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
        this.createBadge()
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
    setTaskBarItemsVisible: function(c) {
        var a = Ext.get("sds-taskbar-right");
        var b = Ext.getCmp("sds-tray-panel");
        if (c) {
            a.removeClass("sds-taskbar-no-display");
            this.searchField.getResizeEl().addClass("sds-taskbar-no-display");
            this.searchField.getEl().addClass("sds-taskbar-no-display")
        } else {
            a.addClass("sds-taskbar-no-display");
            this.searchField.getResizeEl().removeClass("sds-taskbar-no-display");
            this.searchField.getEl().removeClass("sds-taskbar-no-display")
        }
        b.setVisible(c);
        SYNO.SDS.SystemTray.updateLayout();
        SYNO.SDS.TaskBar.doLayout()
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
        var b = SYNO.SDS.UserSettings.getProperty("Desktop", "appview_order") || [];
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
        SYNO.SDS.UserSettings.setProperty("Desktop", "appview_order", d);
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
                    },
                    scope: this
                },
                afterrender: {
                    fn: function() {
                        this.mon(Ext.getBody(), "mousedown", this.onClickHide, this)
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
        this.createBadge()
    },
    onClickHide: function(b, a) {
        if (!b.within(this.el)) {
            this.showDesktop()
        }
    },
    slideIn: function() {
        this.el.slideIn("t", {
            duration: 0.5,
            easing: "easeOut"
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
Ext.define("SYNO.SDS.About.Window", {
    extend: "SYNO.SDS.ModalWindow",
    constructor: function(a) {
        var b = {
            cls: "sds-user-about-window x-window-dlg",
            closable: false,
            useStatusBar: false,
            maximizable: false,
            minimizable: false,
            resizable: false,
            header: false,
            width: 480,
            draggable: false,
            height: 240,
            elements: "body",
            renderTo: Ext.getBody(),
            padding: "20px 20px 0px 20px",
            items: this.configureItems(),
            footerStyle: "padding: 0 0 20px 0",
            modal: false,
            ownerMasked: true,
            fbar: {
                buttonAlign: "center",
                items: new SYNO.ux.Button({
                    text: _T("common", "ok"),
                    handler: this.close,
                    scope: this
                })
            },
            listeners: {
                show: {
                    fn: this.onAfterShow,
                    scope: this
                },
                beforeclose: {
                    fn: this.onBeforeClose,
                    scope: this
                }
            }
        };
        Ext.apply(b, a);
        this.callParent([b]);
        Ext.EventManager.onWindowResize(this.onBrowserWinResize, this)
    },
    onAfterShow: function() {
        SYNO.SDS.Desktop.el.setStyle("zIndex", 0);
        Ext.getBody().mask().addClass("sds-user-about-mask")
    },
    onBrowserWinResize: function() {
        this.center()
    },
    onBeforeClose: function() {
        Ext.EventManager.removeResizeListener(this.onBrowserWinResize, this);
        Ext.getBody().unmask();
        SYNO.SDS.Desktop.el.setStyle("zIndex", "")
    },
    configureItems: function() {
        return [{
            xtype: "box",
            cls: "sds-user-about-desc",
            html: _T("personal_settings", "about_desc")
        }, {
            xtype: "box",
            cls: "sds-user-about-terms-and-cond",
            html: _T("personal_settings", "terms_and_conditions")
        }]
    }
});
Ext.define("SYNO.SDS._System", {
    extend: "Ext.Component",
    Reboot: function() {
        SYNO.SDS.System.RebootWithMsg()
    },
    RebootWithMsg: function(b) {
        var a = SYNO.SDS.System;
        if (_S("ha_running")) {
            a._launchHA();
            return
        }
        SYNO.SDS.Desktop.hide();
        a.getMsgBox().confirm(_D("product"), b || _JSLIBSTR("uicommon", "reboot_warn"), function(c) {
            if ("yes" === c) {
                a._rebootSystem()
            } else {
                if ("no" === c) {
                    SYNO.SDS.Desktop.show()
                }
            }
        }, a)
    },
    PowerOff: function() {
        SYNO.SDS.System.PowerOffWithMsg()
    },
    PowerOffWithMsg: function(b) {
        var a = SYNO.SDS.System;
        if (_S("ha_running")) {
            a._launchHA();
            return
        }
        SYNO.SDS.Desktop.hide();
        a.getMsgBox().confirm(_D("product"), b || _JSLIBSTR("uicommon", "shutdown_warn"), function(c) {
            if ("yes" === c) {
                a._shutdownSystem()
            } else {
                if ("no" === c) {
                    SYNO.SDS.Desktop.show()
                }
            }
        }, a)
    },
    WaitForBootUp: function() {
        SYNO.SDS.Desktop.hide();
        SYNO.SDS.System._rebootSystem(false, false, true)
    },
    Logout: function() {
        SYNO.SDS.StatusNotifier.fireEvent("logout");
        window.onbeforeunload = SYNO.SDS.onBasicBeforeUnload;
        try {
            SYNO.SDS.Utils.Logout.action()
        } catch (a) {}
    },
    About: function() {
        var a = new SYNO.SDS.About.Window();
        a.show()
    },
    _launchHA: function() {
        var a = SYNO.SDS.System;
        a.getMsgBox().confirm(_D("product"), _TT("SYNO.SDS.HA.Instance", "ui", "warning_forbid_power_option"), function(b) {
            if ("yes" === b) {
                SYNO.SDS.AppLaunch("SYNO.SDS.HA.Instance")
            }
        })
    },
    _rebootSystem: function(c, a, b) {
        var d;
        this.getMsgBox().show({
            wait: true,
            closable: false,
            maxWidth: 300,
            title: _D("product"),
            msg: (true === b) ? _T("login", "error_system_getting_ready") : _JSLIBSTR("uicommon", "system_reboot").replace(/_DISKSTATION_/g, _D("product"))
        });
        if (true === c) {
            d = "force_reboot"
        } else {
            if (false === c && false === a) {
                d = "skip_cmd"
            } else {
                d = "reboot"
            }
        }
        this._haltSystem(d, function() {
            var f, e = 0;
            if (d === "skip_cmd") {
                e = 2
            }
            f = this.addAjaxTask({
                preventHalt: true,
                interval: 5000,
                autoJsonDecode: true,
                url: "pingpong.cgi",
                startTime: new Date().getTime(),
                timeLimit: 600000,
                scope: this,
                success: function(g, h) {
                    if (e < 2) {
                        e = 0;
                        return
                    }
                    if (g && g.boot_done) {
                        f.stop();
                        window.location.href = "/"
                    }
                },
                failure: function(i, h) {
                    var g = new Date().getTime();
                    if (!h.timeoutNotified && (g - h.startTime) > h.timeLimit) {
                        this.getMsgBox().show({
                            closable: false,
                            maxWidth: 300,
                            title: _D("product"),
                            msg: _JSLIBSTR("uicommon", "system_reboot_timeout").replace(/_DISKSTATION_/g, _D("product"))
                        });
                        h.timeoutNotified = true
                    }
                    e++
                }
            }).start()
        }, this)
    },
    _shutdownSystem: function(a) {
        this.getMsgBox().show({
            closable: false,
            maxWidth: 300,
            title: _D("product"),
            msg: _JSLIBSTR("uicommon", "system_poweroff").replace(/_DISKSTATION_/g, _D("product"))
        });
        this._haltSystem((true === a) ? "force_shutdown" : "shutdown")
    },
    _haltSystem: function(c, a, b) {
        c = c || "reboot";
        if ("skip_cmd" === c) {
            SYNO.SDS.StatusNotifier.fireEvent("halt");
            window.onbeforeunload = null;
            if (Ext.isFunction(a)) {
                a.apply(b)
            }
            return
        }
        this.addAjaxTask({
            interval: 1000,
            single: true,
            autoJsonDecode: true,
            url: "reboot.cgi",
            params: {
                opt: c
            },
            success: function(d, f) {
                var e = (c === "reboot") ? _T("system", "running_tasks_confirm_reboot") : _T("system", "running_tasks_confirm_shutdown");
                if (d.success === false && d.errinfo) {
                    this.getMsgBox().alert(_D("product"), _JSLIBSTR(d.errinfo.sec, d.errinfo.key));
                    return
                }
                if (d.success === false && d.runningTasks) {
                    var g = this.getRunningTasks(d.runningTasks);
                    this.getMsgBox().confirm(_D("product"), e + "<br><br>" + g, function(h) {
                        if ("yes" === h) {
                            if (c === "shutdown") {
                                this._shutdownSystem(true)
                            } else {
                                this._rebootSystem(true)
                            }
                        }
                    }, this);
                    return
                }
                SYNO.SDS.StatusNotifier.fireEvent("halt");
                window.onbeforeunload = null;
                if (a) {
                    a.apply(b)
                }
            },
            scope: this
        }).start()
    },
    getRunningTasks: function(c) {
        var a = [];
        var b;
        Ext.each(c, function(d) {
            b = d.split(":");
            a.push(_T(b[0], b[1]))
        }, this);
        return a.join(", ")
    },
    getMsgBox: function(b) {
        var a = SYNO.SDS.System;
        if (!a.msgBox || a.msgBox.isDestroyed) {
            a.msgBox = new SYNO.SDS.MessageBoxV5({
                modal: true,
                draggable: false,
                renderTo: document.body
            })
        }
        return a.msgBox.getWrapper()
    }
});
SYNO.SDS.WEATHER_TYPE = {
    Thunderstorm: 0,
    Rain: 1,
    Snow: 2,
    Fog: 3,
    Clear: 4,
    Clouds: 5,
    Cloudy: 6,
    Extreme_Tornado: 7,
    Extreme_Cold: 8,
    Extreme_Hot: 9,
    Extreme_Windy: 10,
    Extreme_Hail: 11
};
Ext.define("SYNO.SDS.WeatherInfo", {
    extend: "Ext.Container",
    constructor: function(a) {
        this.format = Ext.util.Cookies.get("sds_login_time_format") || "12h";
        var b = {
            id: "sds-weather-info",
            items: [{
                xtype: "displayfield",
                cls: "weather-temp",
                hideMode: "visibility"
            }, {
                xtype: "displayfield",
                cls: "weather-icon",
                hideMode: "display"
            }, {
                xtype: "displayfield",
                cls: "current-time",
                value: this.getTimeStr(),
                listeners: {
                    afterrender: function(c) {
                        this.mon(c.el, "click", this.onTimeClick, this)
                    },
                    scope: this
                }
            }, {
                xtype: "displayfield",
                cls: "current-date",
                value: this.getDateStr()
            }]
        };
        Ext.apply(b, a);
        SYNO.SDS.WeatherInfo.superclass.constructor.call(this, b);
        this.defineFileds()
    },
    onTimeClick: function() {
        var a = new Date().add(Date.MONTH, 1);
        this.updateTask.stop();
        this.format = (this.format === "24h") ? "12h" : "24h";
        Ext.util.Cookies.set("sds_login_time_format", this.format, a);
        this.timeField.removeClass("fadeInOut");
        this.timeField.addClass("fadeInOut");
        this.updateTime();
        this.updateTask.start()
    },
    getTimeStr: function() {
        var a = new Date();
        var b;
        if (this.format === "24h") {
            b = a.format("H:i")
        } else {
            b = a.format("g:i");
            b += String.format('<span class="time-tag">{0}</span>', a.format("A"))
        }
        return b
    },
    getDateStr: function() {
        var h = new Date();
        var f = h.getMonth() + 1,
            g = h.getDay(),
            e = h.getDate();
        var c = _T("login", "mon_" + f);
        var a = _T("login", "weekday_" + g);
        var b = String.format(_T("login", "date_format"), c, e, a);
        return b
    },
    defineFileds: function() {
        this.tempField = this.items.items[0];
        this.iconField = this.items.items[1];
        this.timeField = this.items.items[2];
        this.dateField = this.items.items[3];
        this.onNoWeatherData();
        this.runUpdateTimeTask()
    },
    onNoWeatherData: function() {
        this.iconField.hide();
        this.tempField.hide()
    },
    runUpdateTimeTask: function() {
        this.updateTask = this.updateTask || this.addTask({
            id: "task_update_time",
            interval: 1 * 1000,
            run: this.updateTime,
            scope: this
        });
        this.updateTask.start();
        return this.updateTask
    },
    updateTime: function() {
        var b = this.getTimeStr();
        var a = this.getDateStr();
        this.timeField.setValue(b);
        this.dateField.setValue(a)
    }
});
Ext.define("SYNO.SDS.BackgroundTpl", {
    extend: "Ext.XTemplate",
    defaultConf: {
        type: "fill",
        imgSrc: Ext.BLANK_IMAGE_URL,
        imgW: 0,
        imgH: 0,
        bgColor: "#FFFFFF",
        winW: Ext.lib.Dom.getViewWidth(),
        winH: Ext.lib.Dom.getViewHeight(),
        cls: ""
    },
    constructor: function(a) {
        Ext.apply(this, this.defaultConf);
        Ext.apply(this, a);
        if (!this.id) {
            this.id = Ext.id()
        }
        if (this.type === "fill" || this.type === "fit") {
            this.useFitFillTpl()
        } else {
            if (this.type === "center") {
                this.useCenterTpl()
            } else {
                if (this.type === "stretch") {
                    this.useStretchTpl()
                } else {
                    if (this.type === "tile") {
                        this.useTileTpl()
                    } else {
                        SYNO.Debug("No such background template")
                    }
                }
            }
        }
    },
    useFitFillTpl: function() {
        SYNO.SDS.BackgroundTpl.superclass.constructor.call(this, '<div id="{id}" class="{cls}"; style="background-color: {bgColor};">', '<tpl if="(this.imgSizeSet)">', '<img id="sds-login-bgimg" style="visibility: visible; width: {bgW}px; height: {bgH}px; left: {left}px; top: {top}px;" src="{imgSrc}">', "</tpl>", '<tpl if="(!this.imgSizeSet)">', '<img id="sds-login-bgimg" style="visibility: visible;" src="{imgSrc}">', "</tpl>", "</div>")
    },
    useStretchTpl: function() {
        SYNO.SDS.BackgroundTpl.superclass.constructor.call(this, '<div id="{id}" class="{cls}"; style="background-color: {bgColor};">', '<img id="sds-login-bgimg" style="visibility: visible; width: 100%; height: 100%" src="{imgSrc}">', "</div>")
    },
    useCenterTpl: function() {
        SYNO.SDS.BackgroundTpl.superclass.constructor.call(this, '<div id="{id}" class="{cls}"; style="width: {winW}px; height: {winH}px; background-color: {bgColor}; background-image: url({imgSrc}); background-position: 50% 50%; background-repeat: no-repeat;"></div>')
    },
    useTileTpl: function() {
        SYNO.SDS.BackgroundTpl.superclass.constructor.call(this, '<div id="{id}" class="{cls}"; style="width: {winW}px; height: {winH}px; background-color: {bgColor}; background-image: url({imgSrc}); background-repeat: repeat;"></div>')
    },
    setImgSize: function(a, b) {
        this.imgW = a;
        this.imgH = b;
        this.imgSizeSet = true
    },
    getFillConfig: function() {
        var c = this.winH,
            b = this.winW;
        var d = this.imgW / this.imgH;
        var a;
        if (b > c * d) {
            a = this.fitByWidth(b, c, d)
        } else {
            a = this.fitByHeight(b, c, d)
        }
        return a
    },
    getFitConfig: function() {
        var c = this.winH,
            b = this.winW;
        var d = this.imgW / this.imgH;
        var a;
        if (b > c * d) {
            a = this.fitByHeight(b, c, d)
        } else {
            a = this.fitByWidth(b, c, d)
        }
        return a
    },
    fitByWidth: function(b, c, d) {
        var a = {
            bgW: b,
            bgH: b / d,
            left: 0,
            top: (c - (b / d)) / 2
        };
        return a
    },
    fitByHeight: function(b, c, d) {
        var a = {
            bgW: c * d,
            bgH: c,
            left: (b - (c * d)) / 2,
            top: 0
        };
        return a
    },
    fill: function(a) {
        var b;
        Ext.apply(this, a);
        switch (this.type) {
            case "fill":
                b = this.getFillConfig();
                break;
            case "fit":
                b = this.getFitConfig();
                break;
            case "center":
            case "stretch":
            case "tile":
                break;
            default:
        }
        Ext.apply(this, b);
        return this.applyTemplate(this)
    }
});
Ext.define("SYNO.SDS.Background", {
    extend: "Ext.Container",
    isBeta: true,
    constructor: function(a) {
        Ext.apply(this, a);
        this.backgroundTpl = new SYNO.SDS.BackgroundTpl({
            type: a.type,
            imgSrc: a.imgSrc,
            bgColor: a.bgColor
        });
        var c = ("light" === this.tplName);
        this.bgWallpaper = new Ext.BoxComponent({
            html: this.backgroundTpl.fill({
                winW: Ext.lib.Dom.getViewWidth(),
                winH: Ext.lib.Dom.getViewHeight()
            })
        });
        if (this.type === "fit" || this.type === "fill") {
            this.bgWallpaper.on("afterrender", this.updateImgSize, this)
        }
        var b = {
            id: a.id,
            width: Ext.lib.Dom.getViewWidth(),
            height: Ext.lib.Dom.getViewHeight(),
            items: [this.bgWallpaper],
            listeners: {
                afterrender: {
                    fn: function() {
                        this.dsmLogo = new SYNO.SDS.DSM5Logo({
                            id: "sds-login-logo",
                            version: 2,
                            isBeta: this.isBeta,
                            theme: c ? "light" : "dark",
                            renderTo: Ext.get("sds-login")
                        });
                        this.copyRightLogo = new SYNO.SDS.CopyRightLogo({
                            id: "sds-copyright",
                            theme: c ? "light" : "dark",
                            renderTo: Ext.get("sds-login")
                        })
                    },
                    scope: this
                }
            }
        };
        SYNO.SDS.Background.superclass.constructor.call(this, b)
    },
    updateImgSize: function() {
        var b = Ext.fly("sds-login-bgimg");
        if (Ext.isIE || Ext.isModernIE) {
            var a = new Image();
            if (Ext.isIE8) {
                var c = new Date();
                b.dom.src += "&nocache=" + c.getTime()
            }
            a.src = b.dom.src;
            Ext.fly(a).on("load", this.onImgLoad, this)
        } else {
            b.on("load", this.onImgLoad, this)
        }
    },
    onImgLoad: function() {
        var a = Ext.fly("sds-login-bgimg");
        this.backgroundTpl.setImgSize(a.getWidth(), a.getHeight());
        this.resize()
    },
    resize: function() {
        this.bgWallpaper.el.dom.innerHTML = this.backgroundTpl.fill({
            winW: Ext.lib.Dom.getViewWidth(),
            winH: Ext.lib.Dom.getViewHeight()
        });
        this.doLayout()
    }
});
Ext.namespace("SYNO.SDS.Wizard");
SYNO.SDS.Wizard.Step = Ext.extend(Ext.Panel, {
    getNext: function() {
        return this.nextId ? this.nextId : null
    },
    checkState: function() {
        if (this.owner.hasHistory()) {
            this.owner.getButton("back").show()
        } else {
            this.owner.getButton("back").hide()
        }
        if (this.nextId === null) {
            this.owner.getButton("next").setText(_T("common", "commit"))
        } else {
            this.owner.getButton("next").setText(_T("common", "next"))
        }
        this.owner.getButton("back").enable();
        if (_S("demo_mode") && this.disableNextInDemoMode) {
            this.owner.getButton("next").disable();
            this.owner.getButton("next").setTooltip(_JSLIBSTR("uicommon", "error_demo"))
        } else {
            this.owner.getButton("next").enable();
            this.owner.getButton("next").setTooltip("")
        }
    }
});
SYNO.SDS.Wizard.WelcomeStep = Ext.extend(SYNO.SDS.Wizard.Step, {
    constructor: function(b) {
        if (!Ext.isObject(b)) {
            throw Error("invalid config of WelcomeStep")
        }
        this.leftTextBox = new Ext.BoxComponent({
            html: ""
        });
        var a = {
            layout: "border",
            padding: 0,
            bwrapCfg: {
                cls: "x-panel-bwrap sds-wizard-welcome-bwrap"
            },
            items: [{
                xtype: "panel",
                region: "west",
                border: false,
                split: false,
                width: 140,
                bodyCssClass: "welcome-image",
                items: [this.leftTextBox]
            }, {
                region: "center",
                border: false,
                layout: "vbox",
                layoutConfig: {
                    align: "stretch",
                    pack: "start"
                },
                items: [{
                    border: false,
                    autoHeight: true,
                    bodyCssClass: "welcome-headline"
                }, {
                    border: false,
                    flex: 1,
                    bodyCssClass: "welcome-text"
                }]
            }]
        };
        if (Ext.isObject(b.imageCls)) {
            Ext.apply(a.items[0], b.imageCls)
        } else {
            if (b.imageCls) {
                a.items[0].bodyCssClass = b.imageCls
            }
        }
        var c = Ext.util.Format.htmlEncode(b.leftTitle);
        var d = String.format('<p class="welcome-image-text">' + c + "</p>");
        if (Ext.isObject(b.leftTitle)) {
            Ext.apply(this.leftTextBox.html, d)
        } else {
            if (b.leftTitle) {
                this.leftTextBox.html = d
            }
        }
        if (Ext.isObject(b.headline)) {
            Ext.apply(a.items[1].items[0], b.headline)
        } else {
            if (b.headline) {
                a.items[1].items[0].html = b.headline
            }
        }
        if (Ext.isObject(b.description)) {
            Ext.apply(a.items[1].items[1], b.description)
        } else {
            if (b.description) {
                a.items[1].items[1].html = b.description
            }
        }
        if (Ext.isDefined(b.headLineHeight)) {
            a.items[1].items[0].height = b.headLineHeight
        }
        delete b.imageCls;
        delete b.headline;
        delete b.description;
        Ext.apply(a, b);
        SYNO.SDS.Wizard.WelcomeStep.superclass.constructor.call(this, a)
    },
    activate: function() {
        this.hideBanner()
    },
    deactivate: function() {
        this.showBanner()
    },
    hideBanner: function() {
        if (this.owner.banner) {
            this.owner.getComponent("banner").hide();
            this.owner.doLayout()
        }
    },
    showBanner: function() {
        if (this.owner.banner) {
            this.owner.getComponent("banner").show();
            this.owner.doLayout()
        }
    },
    listeners: {
        afterlayout: function(a) {
            var b = this.getHeight() - 24;
            this.leftTextBox.setWidth(b)
        }
    }
});
SYNO.SDS.Wizard.SummaryStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function() {
        SYNO.SDS.Wizard.SummaryStore.superclass.constructor.call(this, {
            autoDestroy: true,
            root: "data",
            fields: ["key", "value"]
        })
    },
    append: function(a, b) {
        this.loadData({
            data: [{
                key: a,
                value: b
            }]
        }, true)
    },
    appendSub: function(b, c) {
        var a = "&nbsp;&nbsp;&nbsp;&nbsp;{0}";
        this.append(String.format(a, b), c)
    },
    appendNoChange: function(a) {
        this.append(a, String.format("[{0}]", _T("tree", "nochangepage")))
    }
});
SYNO.SDS.Wizard.SummaryStep = Ext.extend(SYNO.ux.GridPanel, {
    showCommitButton: false,
    constructor: function(b) {
        var a = Ext.apply({
            headline: _T("ezinternet", "ezinternet_summary_title"),
            description: _T("wizcommon", "summary_descr"),
            viewConfig: {
                forceFit: false
            },
            columns: [{
                width: 150,
                header: _T("status", "header_item"),
                dataIndex: "key",
                renderer: this.fieldRenderer
            }, {
                id: "value",
                autoExpand: true,
                header: _T("status", "header_value"),
                dataIndex: "value",
                renderer: this.descRenderer,
                scope: this
            }],
            enableHdMenu: false,
            enableColumnMove: false,
            autoExpandColumn: "value",
            store: new SYNO.SDS.Wizard.SummaryStore()
        }, b);
        SYNO.SDS.Wizard.SummaryStep.superclass.constructor.call(this, a)
    },
    fieldRenderer: function(a) {
        return "<b>" + a + "</b>"
    },
    descRenderer: function(e, b, a, g, d, c) {
        var f = Ext.util.Format.htmlEncode(e);
        b.attr = 'ext:qtip="' + Ext.util.Format.htmlEncode(f) + '"';
        return f
    },
    activate: function() {
        var a = this.owner.stepStack;
        var c = null;
        this.getStore().removeAll(true);
        for (var b = 0; b < a.length; b++) {
            c = this.owner.getStep(a[b]);
            if (Ext.isFunction(c.summary)) {
                c.summary(this.getStore())
            }
        }
        this.getView().refresh()
    },
    checkState: function() {
        SYNO.SDS.Wizard.Step.prototype.checkState.apply(this, arguments);
        if (this.showCommitButton) {
            this.owner.getButton("next").setText(_T("common", "commit"))
        }
    }
});
SYNO.SDS.Wizard.TaskStore = Ext.extend(Ext.data.JsonStore, {
    constructor: function(a) {
        SYNO.SDS.Wizard.TaskStore.superclass.constructor.call(this, Ext.apply({
            autoDestroy: true,
            idProperty: "id",
            root: "data",
            fields: ["id", "text", "config", "option", "status"]
        }, a))
    },
    append: function(e, d, a, b) {
        var c = new this.recordType({
            status: "",
            id: e,
            text: d,
            config: a,
            option: b || {}
        }, e);
        this.add(c);
        c.set("status", "queue");
        c.setStatus = function(f) {
            c.set("status", f);
            c.store.commitChanges()
        };
        return c
    },
    get: function(a) {
        if (Ext.isString(a)) {
            return this.getById(a)
        } else {
            if (Ext.isNumber(a)) {
                return this.getAt(a)
            } else {
                if (Ext.isObject(a) && a.store && this === a.store) {
                    return a
                }
            }
        }
        return undefined
    }
});
SYNO.SDS.Wizard.ApplyStep = Ext.extend(SYNO.ux.GridPanel, {
    currentTask: null,
    stopOnFail: true,
    constructor: function(a) {
        SYNO.SDS.Wizard.ApplyStep.superclass.constructor.call(this, Ext.apply({
            headline: _T("ezinternet", "ezinternet_apply_title"),
            description: _T("ezinternet", "ezinternet_apply_desc"),
            cls: "without-dirty-red-grid",
            store: new SYNO.SDS.Wizard.TaskStore(),
            viewConfig: {
                forceFit: false,
                headersDisabled: true
            },
            hideHeaders: true,
            columns: [{
                header: "",
                align: "center",
                width: 30,
                dataIndex: "status",
                renderer: this.renderStatus
            }, {
                id: "text",
                header: "Activity",
                dataIndex: "text"
            }],
            draggable: false,
            enableColumnMove: false,
            autoExpandColumn: "text"
        }, a))
    },
    renderStatus: function(a) {
        var b = {
            doing: '<div class="x-status-loading">&nbsp;</div>',
            done: '<div class="x-status-success">&nbsp;</div>',
            fail: '<div class="x-status-fail">&nbsp;</div>'
        };
        if (b[a]) {
            return b[a]
        }
    },
    checkState: function() {
        if (this.owner.hasHistory()) {
            this.owner.getButton("back").show()
        } else {
            this.owner.getButton("back").hide()
        }
        this.owner.getButton("cancel").hide();
        if (this.nextId === null) {
            this.owner.getButton("next").setText(_T("common", "finish"))
        } else {
            this.owner.getButton("next").setText(_T("common", "next"))
        }
    },
    activate: function() {
        var c = this;
        var b = this.getStore();
        var a = this.owner.stepStack;
        var d = null;
        this.owner.clearStatus();
        b.removeAll(true);
        Ext.each(a, function(f) {
            var e = this.owner.getStep(f);
            if (Ext.isFunction(e.appendTask)) {
                b.commitChanges();
                e.appendTask(b);
                d = b.getModifiedRecords();
                Ext.each(d, function(g) {
                    var h = g.get("option");
                    if (h && !h.backId) {
                        h.backId = f
                    }
                    g.report = function(i) {
                        c.report(i)
                    };
                    g.doNextTask = function(i) {
                        c.doNextTask(i)
                    }
                }, this)
            }
        }, this);
        b.commitChanges();
        this.getView().refresh();
        if (b.getCount() > 0) {
            this.start()
        } else {
            this.finish.defer(300, this)
        }
    },
    deactivate: function() {
        if (this.currentTask) {
            SYNO.Debug("task is running");
            return false
        }
    },
    report: function(a) {
        if (!a) {
            return
        }
        if (a.success) {
            this.owner.setStatusOK(a)
        } else {
            this.owner.setStatusError(a)
        }
    },
    start: function() {
        this.owner.getButton("back").disable();
        this.owner.getButton("next").disable();
        this.doTask(0)
    },
    finish: function() {
        var a = !Ext.isString(this.getBack());
        if (a) {
            this.owner.getButton("back").disable();
            this.owner.getButton("back").hide();
            this.report({
                success: true
            })
        } else {
            this.owner.getButton("back").enable();
            this.owner.getButton("next").setText(_T("common", "cancel"))
        }
        this.owner.getButton("next").enable();
        this.currentTask = null
    },
    getBack: function() {
        var a = this.getStore();
        var c = null;
        var b = 0;
        for (b = 0; b < a.getCount(); b++) {
            c = a.getAt(b);
            if ("fail" === c.get("status")) {
                return c.get("option").backId
            }
        }
        return false
    },
    doTask: function(a) {
        var b = {};
        a = this.getStore().get(a);
        if (!a) {
            return
        }
        a.setStatus("doing");
        Ext.apply(b, a.get("config"));
        this.currentTask = a;
        this.compound = b.compound;
        this.sendWebAPI(Ext.apply(b, {
            callback: this.taskDone,
            scope: this
        }))
    },
    taskDone: function(e, d, c) {
        var b = this.currentTask.get("config");
        var a;
        if (Ext.isFunction(b.callback)) {
            a = b.callback.call(b.scope || undefined, e, d, c)
        }
        if (false === a || "doing" === a) {
            return
        }
        if (!e || (this.compound && d.has_fail)) {
            this.doNextTask(false);
            return
        }
        this.doNextTask(e)
    },
    doNextTask: function(c) {
        var a = this.currentTask;
        var b = this.getStore().indexOf(a);
        a.setStatus(c ? "done" : "fail");
        if (this.stopOnFail && !c) {
            this.finish();
            return
        }
        if (-1 === b) {
            throw Error("can not found index of current task")
        }
        if (b + 1 < this.getStore().getCount()) {
            this.doTask(b + 1)
        } else {
            this.finish()
        }
    }
});
Ext.namespace("SYNO.SDS.Wizard");
SYNO.SDS.Wizard.AppWindow = Ext.extend(SYNO.SDS.AppWindow, {
    constructor: function(a) {
        this.updateDsmStyle(a);
        this.addClass("sds-wizard-window");
        SYNO.SDS.Wizard.AppWindow.superclass.constructor.call(this, this.configWizard(a));
        if (this.isV5Style()) {
            if (this.getActiveStep() instanceof SYNO.SDS.Wizard.WelcomeStep) {
                this.footer.addClass("sds-wizard-footer-welcome");
                this.footer.removeClass("sds-wizard-footer")
            } else {
                this.footer.removeClass("sds-wizard-footer-welcome");
                this.footer.addClass("sds-wizard-footer")
            }
        }
        this.stepStack = []
    },
    onOpen: function() {
        SYNO.SDS.Wizard.AppWindow.superclass.onOpen.apply(this, arguments);
        var a = this.getActiveStep();
        if (a && Ext.isFunction(a.activate)) {
            if (false === a.activate()) {
                return
            }
        }
        this.syncView()
    },
    onClose: function() {
        var a = true;
        var b = this.getActiveStep();
        if (b && Ext.isFunction(b.deactivate)) {
            if (false === b.deactivate("close")) {
                return false
            }
        }
        a = SYNO.SDS.Wizard.AppWindow.superclass.onClose.apply(this, arguments);
        return a !== false
    },
    configWizard: function(b) {
        var a = {
            buttonAlign: "left",
            footer: (this.isV5Style() ? true : false),
            useStatusBar: (this.isV5Style() ? false : true),
            closable: (b.closable !== undefined) ? b.closable : true,
            layout: "border",
            defaults: Ext.apply(b.defaults || {}, {
                owner: this
            }),
            items: [this.configSteps(b.steps)],
            buttons: this.configButtons(b.fbar)
        };
        delete b.steps;
        if (false !== b.banner) {
            var c = this.configBanner(b.banner);
            if (Ext.isDefined(b.bannerHeadLineHeight)) {
                c.items[0].height = b.bannerHeadLineHeight
            }
            if (Ext.isDefined(b.bannerDescHeight)) {
                c.items[1].height = b.bannerDescHeight
            }
            c.height = c.minSize = c.maxSize = c.items[0].height + c.items[1].height;
            a.items.push(c);
            a.banner = true
        }
        if (Ext.isDefined(b.activeStep)) {
            a.items[0].activeItem = b.activeStep;
            delete b.activeStep
        }
        Ext.applyIf(a, b);
        Ext.applyIf(a, {
            resizable: false,
            maximizable: false
        });
        return a
    },
    configBanner: function(a) {
        return Ext.apply({
            itemId: "banner",
            region: "north",
            height: (this.isV5Style() ? 112 : 80),
            minSize: (this.isV5Style() ? 112 : 80),
            maxSize: (this.isV5Style() ? 112 : 80),
            split: false,
            cls: "sds-wizard-banner-wrap",
            bodyCssClass: "sds-wizard-banner",
            layout: "anchor",
            items: [{
                xtype: "box",
                padding: (this.isV5Style() ? "0px 0px 5px 20px" : "0px 0px 0px 0px"),
                height: (this.isV5Style() ? 24 : 40),
                autoHeight: (this.isV5Style() ? true : false),
                itemId: "headline",
                border: false,
                bodyCssClass: "wizard-headline",
                html: ""
            }, {
                xtype: "box",
                padding: (this.isV5Style() ? "5px 0px 0px 0px" : "0px 0px 0px 0px"),
                height: (this.isV5Style() ? 18 : 40),
                autoHeight: (this.isV5Style() ? true : false),
                itemId: "description",
                border: false,
                bodyCssClass: "wizard-description",
                html: ""
            }]
        }, a)
    },
    setHeadline: function(d) {
        var c = this.getComponent("banner");
        if (c) {
            var b = Ext.util.Format.htmlEncode(d);
            var a = String.format('<div class = "wizard-headline" ext:qtip="{1}"> {0} </div>', b, Ext.util.Format.htmlEncode(b));
            c.getComponent("headline").update(a)
        }
    },
    setDescription: function(d) {
        var c = this.getComponent("banner");
        if (c) {
            var b = Ext.util.Format.htmlEncode(d);
            var a = String.format('<div class = "wizard-description" ext:qtip="{1}"> {0} </div>', b, Ext.util.Format.htmlEncode(b));
            c.getComponent("description").update(a)
        }
    },
    configSteps: function(d) {
        if (Ext.isArray(d)) {
            var a = d;
            d = {
                items: a
            }
        }
        if (!d.items) {
            throw Error("invalid config of wizard steps")
        }
        var c = 0;
        var b = Ext.applyIf({
            itemId: "steps",
            layout: "card",
            region: "center",
            border: false,
            activeItem: 0,
            bodyCssClass: "sds-wizard-step",
            defaults: function(f) {
                var e = d.defaults;
                f.owner = this.owner;
                Ext.applyIf(f, {
                    border: false,
                    bwrapCfg: {
                        cls: "x-panel-bwrap sds-wizard-step-bwrap"
                    }
                });
                if (Ext.isFunction(e)) {
                    e = e.call(this, f)
                }
                return e
            }
        }, d);
        for (c = 0; c < b.items.length; c++) {
            Ext.applyIf(b.items[c], {
                nextId: c + 1 < b.items.length ? c + 1 : null,
                getNext: SYNO.SDS.Wizard.Step.prototype.getNext,
                checkState: SYNO.SDS.Wizard.Step.prototype.checkState
            })
        }
        return b
    },
    appendSteps: function(c) {
        var b = this.getComponent("steps");
        var e, d, f, a = [];
        if (!Ext.isArray(c)) {
            c = [c]
        }
        f = b.items.length + c.length;
        for (e = 0, d = b.items.length; e < c.length; e++, d++) {
            a.push(c[e].itemId || ("append" + d));
            Ext.applyIf(c[e], {
                itemId: "append" + d,
                nextId: d + 1 < f ? ("append" + (d + 1)) : null,
                getNext: SYNO.SDS.Wizard.Step.prototype.getNext,
                checkState: SYNO.SDS.Wizard.Step.prototype.checkState
            });
            b.add(c[e])
        }
        b.doLayout();
        return a
    },
    getStep: function(a) {
        return this.getComponent("steps").getComponent(a)
    },
    getActiveStep: function() {
        var a = this.getComponent("steps");
        if (!a) {
            return
        }
        return a.layout.activeItem
    },
    setActiveStep: function(a) {
        if (!this.getStep(a)) {
            throw Error("step is not exist, id: " + a)
        }
        this.getComponent("steps").layout.setActiveItem(a);
        if (this.isV5Style()) {
            if (this.getActiveStep() instanceof SYNO.SDS.Wizard.WelcomeStep) {
                this.footer.addClass("sds-wizard-footer-welcome");
                this.footer.removeClass("sds-wizard-footer")
            } else {
                this.footer.removeClass("sds-wizard-footer-welcome");
                this.footer.addClass("sds-wizard-footer")
            }
        }
        return true
    },
    configButtons: function(b) {
        var c = (this.isV5Style()) ? "syno_button" : "button";
        var a = (this.isV5Style()) ? "->" : "";
        return b || [{
            xtype: c,
            btnStyle: "grey",
            itemId: "back",
            text: _T("common", "back"),
            handler: function() {
                if (Ext.isFunction(this.getActiveStep().getBack)) {
                    this.goBack(this.getActiveStep().getBack())
                } else {
                    this.goBack()
                }
            },
            scope: this
        }, a, {
            xtype: c,
            itemId: "next",
            text: _T("common", "next"),
            btnStyle: "blue",
            handler: function() {
                this.goNext(this.getActiveStep().getNext())
            },
            scope: this
        }, {
            xtype: c,
            btnStyle: "grey",
            itemId: "cancel",
            text: _T("common", "cancel"),
            handler: this.close,
            scope: this
        }]
    },
    getButton: function(a) {
        return this.getFooterToolbar().getComponent(a)
    },
    goNext: function(a, d) {
        var c = null;
        var b;
        if (a === false) {
            return false
        }
        if (a === null) {
            this.close();
            return true
        }
        c = this.getActiveStep();
        b = c.getItemId();
        if (Ext.isFunction(c.deactivate)) {
            if (false === c.deactivate("next")) {
                return false
            }
        }
        if (false === this.setActiveStep(a)) {
            return false
        }
        if (false !== d) {
            this.stepStack.push(b)
        }
        c = this.getActiveStep();
        if (Ext.isFunction(c.activate)) {
            if (false === c.activate()) {
                return false
            }
        }
        this.syncView();
        return true
    },
    goBack: function(b) {
        var c = null;
        var a;
        if (b === false || !this.hasHistory()) {
            return false
        }
        if (Ext.isDefined(b) && !this.inHistory(b)) {
            return false
        }
        c = this.getActiveStep();
        if (Ext.isFunction(c.deactivate)) {
            if (false === c.deactivate("back")) {
                return false
            }
        }
        a = this.stepStack.pop();
        if (!Ext.isDefined(b)) {
            b = a
        }
        if (false === this.setActiveStep(b)) {
            this.stepStack.push(a);
            return false
        }
        while (a !== b) {
            a = this.stepStack.pop()
        }
        c = this.getActiveStep();
        if (Ext.isFunction(c.activate)) {
            if (false === c.activate()) {
                return false
            }
        }
        this.syncView();
        return true
    },
    inHistory: function(b) {
        for (var a = this.stepStack.length - 1; a >= 0; a--) {
            if (this.stepStack[a] === b) {
                return true
            }
        }
        return false
    },
    hasHistory: function() {
        return this.stepStack.length > 0
    },
    syncView: function() {
        var a = this.getActiveStep();
        if (!a) {
            return
        }
        if (Ext.isFunction(a.checkState)) {
            a.checkState()
        }
        if (this.banner) {
            this.setHeadline(a.headline || "");
            this.setDescription(a.description || "")
        }
    }
});
SYNO.SDS.Wizard.ModalWindow = Ext.extend(SYNO.SDS.ModalWindow, {
    constructor: function(a) {
        this.updateDsmStyle(a);
        SYNO.SDS.Wizard.ModalWindow.superclass.constructor.call(this, this.configWizard(a));
        this.stepStack = [];
        this.addClass("sds-wizard-window");
        if (this.isV5Style()) {
            if (this.getActiveStep() instanceof SYNO.SDS.Wizard.WelcomeStep) {
                this.footer.addClass("sds-wizard-footer-welcome");
                this.footer.removeClass("sds-wizard-footer")
            } else {
                this.footer.removeClass("sds-wizard-footer-welcome");
                this.footer.addClass("sds-wizard-footer")
            }
        }
    },
    onOpen: function() {
        SYNO.SDS.Wizard.ModalWindow.superclass.onOpen.apply(this, arguments);
        var a = this.getActiveStep();
        if (a && Ext.isFunction(a.activate)) {
            if (false === a.activate()) {
                return
            }
        }
        this.syncView()
    },
    onClose: function() {
        var a = true;
        var b = this.getActiveStep();
        if (b && Ext.isFunction(b.deactivate)) {
            if (false === b.deactivate("close")) {
                return true
            }
        }
        a = SYNO.SDS.Wizard.ModalWindow.superclass.onClose.apply(this, arguments);
        return a !== false
    },
    setMaskMsgVisible: function(b) {
        if (!this.el.isMasked()) {
            return
        }
        var a = Ext.Element.data(this.el, "maskMsg");
        if (a && a.dom) {
            a.setVisibilityMode(Ext.Element.VISIBILITY);
            a.setVisible(b)
        }
    },
    setMaskOpacity: function(a) {
        SYNO.SDS.AppWindow.superclass.setMaskOpacity.call(this, a);
        this.setMaskMsgVisible(a !== 0)
    },
    delayedMask: function(b, a, d, c) {
        a = a || 200;
        if (!this.maskTask) {
            this.maskTask = new Ext.util.DelayedTask(this.setMaskOpacity, this, [b])
        }
        this.mask(0, d, c);
        this.setMaskMsgVisible(false);
        this.maskTask.delay(a)
    },
    setStatusBusy: function(c, b, a) {
        c = c || {};
        Ext.applyIf(c, {
            text: _T("common", "loading"),
            iconCls: "x-mask-loading"
        });
        b = b || 0.4;
        a = a || 400;
        this.delayedMask(b, a, c.text, c.iconCls)
    },
    setStatusError: function(a) {
        a = a || {};
        Ext.applyIf(a, {
            text: _T("common", "error_system")
        });
        this.getMsgBox().alert(_T("error", "error_error"), a.text)
    },
    configWizard: SYNO.SDS.Wizard.AppWindow.prototype.configWizard,
    configBanner: SYNO.SDS.Wizard.AppWindow.prototype.configBanner,
    setHeadline: SYNO.SDS.Wizard.AppWindow.prototype.setHeadline,
    setDescription: SYNO.SDS.Wizard.AppWindow.prototype.setDescription,
    configSteps: SYNO.SDS.Wizard.AppWindow.prototype.configSteps,
    appendSteps: SYNO.SDS.Wizard.AppWindow.prototype.appendSteps,
    getStep: SYNO.SDS.Wizard.AppWindow.prototype.getStep,
    getActiveStep: SYNO.SDS.Wizard.AppWindow.prototype.getActiveStep,
    setActiveStep: SYNO.SDS.Wizard.AppWindow.prototype.setActiveStep,
    configButtons: SYNO.SDS.Wizard.AppWindow.prototype.configButtons,
    getButton: SYNO.SDS.Wizard.AppWindow.prototype.getButton,
    goNext: SYNO.SDS.Wizard.AppWindow.prototype.goNext,
    goBack: SYNO.SDS.Wizard.AppWindow.prototype.goBack,
    inHistory: SYNO.SDS.Wizard.AppWindow.prototype.inHistory,
    hasHistory: SYNO.SDS.Wizard.AppWindow.prototype.hasHistory,
    syncView: SYNO.SDS.Wizard.AppWindow.prototype.syncView
});
Ext.namespace("SYNO.SDS.EnforceOTPWizard");
SYNO.SDS.EnforceOTPWizard = Ext.extend(SYNO.SDS.Wizard.ModalWindow, {
    next_step: null,
    WIZRAD_HEIGHT: 500,
    constructor: function(b) {
        this.welcomeStep = new SYNO.SDS.EnforceOTPWizard.WelcomeStep({
            itemId: "welcome",
            nextId: "qrcode"
        });
        this.qrcodeStep = new SYNO.SDS.EnforceOTPWizard.QRcodeStep({
            itemId: "qrcode",
            nextId: "authenticate"
        });
        this.authStep = new SYNO.SDS.EnforceOTPWizard.AuthStep({
            itemId: "authenticate",
            nextId: "finish",
            isAdminGroup: b.isAdminGroup
        });
        this.finishStep = new SYNO.SDS.EnforceOTPWizard.FinishStep({
            itemId: "finish",
            nextId: null
        });
        var a = [this.welcomeStep, this.qrcodeStep, this.authStep, this.finishStep];
        SYNO.SDS.EnforceOTPWizard.superclass.constructor.call(this, Ext.apply({
            title: _T("personal_settings", "otp_wizard_title"),
            showHelp: false,
            width: 650,
            height: this.WIZRAD_HEIGHT,
            steps: a
        }, b))
    },
    onOpen: function() {
        this.setActiveStep("welcome");
        this.getButton("cancel").hide();
        SYNO.SDS.EnforceOTPWizard.superclass.onOpen.apply(this, arguments)
    },
    getEncryptedParams: function(b) {
        b = Ext.apply({
            username: this.username,
            passwd: this.passwd
        }, b);
        var a = SYNO.Encryption.EncryptParam(b);
        a.client_time = Math.floor((new Date()).getTime() / 1000);
        return a
    },
    close: function() {
        this.finishStep.form.clearInvalid();
        this.setStatusBusy({
            text: _T("common", "loading")
        });
        this.gotoDesktop()
    },
    gotoDesktop: function() {
        SYNO.SDS.initData()
    },
    markInvalid: function(a, b) {
        a.markInvalid();
        if (b) {
            this.getMsgBox().alert(this.title, b);
            this.getMsgBox().getDialog().addClass("enforce-wizard-err-message-dialog")
        }
    },
    displayError: function(a) {
        var b;
        if (a) {
            b = _T(a.section, a.key)
        } else {
            b = _T("error", "error_error_system")
        }
        this.getMsgBox().alert(this.title, b);
        this.getMsgBox().getDialog().addClass("enforce-wizard-err-message-dialog")
    },
    setNextStep: function(a, b) {
        if (0 > this.stepStack.indexOf(a)) {
            this.stepStack.push(a)
        }
        if (Ext.isString(b)) {
            this.stepStack.push(b)
        }
    }
});
SYNO.SDS.EnforceOTPWizard.WelcomeStep = Ext.extend(SYNO.SDS.Wizard.WelcomeStep, {
    constructor: function(b) {
        var a = Ext.apply({
            headline: _T("personal_settings", "otp_welcome_step_title"),
            description: _T("otp_enforcement", "welcome_step_desc"),
            disableNextInDemoMode: true,
            keys: [{
                key: [10, 13],
                scope: this,
                handler: this.getNext
            }]
        }, b);
        SYNO.SDS.EnforceOTPWizard.WelcomeStep.superclass.constructor.call(this, a)
    },
    getNext: function() {
        var b = this.owner.username;
        b = b.replace(/\\/g, "/");
        var a = this.owner.getEncryptedParams({
            action: "getQRcodePage",
            account: b + "@" + _S("hostname")
        });
        this.owner.setStatusBusy({
            text: _T("common", "saving")
        });
        Ext.Ajax.request({
            url: this.owner.url,
            params: a,
            scope: this,
            method: "POST",
            callback: function(d, f, e) {
                this.owner.clearStatusBusy();
                if (!f || !e || !e.responseText) {
                    this.owner.displayError()
                }
                var c = Ext.util.JSON.decode(e.responseText);
                if (c && c.success === true) {
                    if (c.errno) {
                        this.owner.getMsgBox().alert(this.title, _T(c.errno.section, c.errno.key))
                    }
                    this.owner.secretKey = c.key;
                    this.owner.QRcodeImg = c.img;
                    this.owner.secretFile = c.file;
                    this.owner.qrcodeStep.load();
                    this.owner.goNext(this.nextId)
                } else {
                    this.owner.displayError(c ? c.errno : null);
                    return
                }
            }
        });
        return false
    }
});
SYNO.SDS.EnforceOTPWizard.QRcodeStep = Ext.extend(SYNO.ux.FormPanel, {
    constructor: function(b) {
        var a = Ext.apply({
            headline: _T("personal_settings", "otp_qrcode_step_title"),
            items: [{
                xtype: "syno_displayfield",
                value: String.format(_T("personal_settings", "otp_install_app_desc"), _T("personal_settings", "otp_support_apps_link"))
            }, {
                xtype: "syno_displayfield",
                value: String.format(_T("personal_settings", "otp_scan_qrcode_desc"), '(<a class="pathlink">' + _T("personal_settings", "otp_enter_manually_link") + "</a>)"),
                listeners: {
                    render: function(d) {
                        var c = d.el.first("a.pathlink");
                        if (c) {
                            this.mon(c, "click", this.launchEditDialog, this)
                        }
                    },
                    scope: this,
                    single: true,
                    buffer: 80
                }
            }, {
                html: '<img id = "qrcode_img" src="" width="120" height="120" />',
                border: false,
                style: "text-align: center;"
            }],
            keys: [{
                key: [10, 13],
                scope: this,
                handler: this.getNext
            }]
        }, b);
        SYNO.SDS.EnforceOTPWizard.QRcodeStep.superclass.constructor.call(this, a)
    },
    load: function() {
        var a = Ext.get("qrcode_img");
        a.dom.src = "data:image/png;base64," + this.owner.QRcodeImg
    },
    getNext: function() {
        this.owner.authStep.load();
        return this.nextId
    },
    launchEditDialog: function() {
        var a = new SYNO.SDS.EnforceOTPWizard.QRcodeStep.EditDialog({
            owner: this.owner
        });
        a.show()
    }
});
SYNO.SDS.EnforceOTPWizard.QRcodeStep.EditDialog = Ext.extend(SYNO.SDS.BaseWindow, {
    constructor: function(a) {
        Ext.apply(this, a || {});
        var b = {
            owner: this.owner,
            id: "edit-otp-dialog",
            width: 430,
            height: 220,
            minWidth: 430,
            minHeight: 220,
            shadow: true,
            collapsible: false,
            title: _T("personal_settings", "otp_wizard_title"),
            layout: "fit",
            trackResetOnLoad: true,
            forceSelection: true,
            waitMsgTarget: true,
            border: false,
            items: this.panel = this.initPanel(),
            buttons: [{
                xtype: "syno_button",
                btnStyle: "blue",
                text: _T("common", "apply"),
                scope: this,
                handler: this.onApply
            }, {
                xtype: "syno_button",
                btnStyle: "gray",
                text: _T("common", "cancel"),
                scope: this,
                handler: this.close
            }],
            keys: [{
                key: [10, 13],
                scope: this,
                handler: this.onApply
            }]
        };
        SYNO.SDS.EnforceOTPWizard.QRcodeStep.EditDialog.superclass.constructor.call(this, b)
    },
    initPanel: function() {
        var c = this.owner.username;
        c = c.replace(/\\/g, "/");
        var b = {
            itemId: "otp_edit_panel",
            border: false,
            items: [{
                xtype: "syno_displayfield",
                value: _T("personal_settings", "otp_edit_desc")
            }, {
                xtype: "syno_textfield",
                fieldLabel: _T("personal_settings", "otp_account_name"),
                name: "account_name",
                labelWidth: 150,
                value: c + "@" + _S("hostname"),
                allowBlank: false
            }, {
                xtype: "syno_displayfield",
                labelWidth: 150,
                hideLabel: false,
                fieldLabel: _T("personal_settings", "otp_secret_key"),
                name: "edit_secret_key",
                value: this.owner.secretKey
            }],
            keys: [{
                key: [10, 13],
                scope: this,
                handler: this.getNext
            }]
        };
        var a = new Ext.form.FormPanel(b);
        return a
    },
    getForm: function() {
        return this.panel.form
    },
    onApply: function() {
        if (!this.getForm().findField("account_name").isValid()) {
            return false
        }
        var b = this.getForm().findField("account_name").getValue();
        b = b.replace(/\\/g, "/");
        var a = this.owner.getEncryptedParams({
            action: "editSecretKey",
            secretKey: this.getForm().findField("edit_secret_key").getValue(),
            file: this.owner.secretFile,
            account: b
        });
        Ext.Ajax.request({
            url: this.owner.url,
            params: a,
            scope: this,
            method: "POST",
            callback: function(d, f, e) {
                if (!f || !e || !e.responseText) {
                    this.owner.displayError()
                }
                var c = Ext.util.JSON.decode(e.responseText);
                if (c && c.success === true) {
                    this.owner.QRcodeImg = c.img;
                    this.owner.secretKey = c.key;
                    this.owner.qrcodeStep.load();
                    this.close()
                } else {
                    this.owner.displayError(c ? c.errno : null);
                    return
                }
            }
        })
    }
});
SYNO.SDS.EnforceOTPWizard.AuthStep = Ext.extend(SYNO.ux.FormPanel, {
    constructor: function(b) {
        var a = Ext.apply({
            headline: _T("personal_settings", "otp_auth_step_title"),
            items: [{
                xtype: "syno_displayfield",
                value: _T("personal_settings", "otp_auth_step_desc")
            }, {
                xtype: "syno_displayfield",
                value: ""
            }, {
                xtype: "syno_textfield",
                name: "OTP_auth",
                width: 200,
                labelWidth: 230,
                fieldLabel: _T("personal_settings", "otp_auth_field"),
                emptyText: _T("personal_settings", "otp_auth_field"),
                maxLength: 6,
                regex: new RegExp("[0-9]{6}"),
                regexText: _T("personal_settings", "otp_err_auth_code"),
                allowBlank: false
            }],
            keys: [{
                key: [10, 13],
                scope: this,
                handler: this.getNext
            }]
        }, b);
        SYNO.SDS.EnforceOTPWizard.AuthStep.superclass.constructor.call(this, a)
    },
    load: function() {
        this.getForm().findField("OTP_auth").reset()
    },
    getNext: function() {
        if (!this.getForm().findField("OTP_auth").isValid()) {
            return false
        }
        var b = this.form.findField("OTP_auth").getValue();
        var a = this.owner.getEncryptedParams({
            action: "authOTP",
            code: b,
            file: this.owner.secretFile
        });
        this.owner.setStatusBusy({
            text: _T("common", "saving")
        });
        Ext.Ajax.request({
            url: this.owner.url,
            params: a,
            scope: this,
            method: "POST",
            callback: function(d, f, e) {
                this.owner.clearStatusBusy();
                if (!f || !e || !e.responseText) {
                    this.owner.displayError()
                }
                var c = Ext.util.JSON.decode(e.responseText);
                if (c && c.success === true) {
                    if (c.auth_ok === true) {
                        if (Ext.isEmpty(SYNO.SDS.Session)) {
                            SYNO.SDS.Session = {}
                        }
                        if (!Ext.isEmpty(c.SynoToken)) {
                            SYNO.SDS.Session.SynoToken = encodeURIComponent(c.SynoToken)
                        }
                        if (c.mail) {
                            this.owner.finishStep.setMail(c.mail)
                        }
                        this.owner.goNext(this.nextId);
                        this.owner.getButton("back").hide();
                        this.owner.getButton("cancel").setText(_T("common", "skip"));
                        this.owner.getButton("cancel").show();
                        this.owner.getButton("next").setText(_T("common", "ok"))
                    } else {
                        this.owner.displayError(c.errno)
                    }
                } else {
                    this.owner.displayError();
                    return
                }
            }
        });
        return false
    }
});
SYNO.SDS.EnforceOTPWizard.FinishStep = Ext.extend(SYNO.ux.FormPanel, {
    constructor: function(b) {
        var a = Ext.apply({
            headline: _T("personal_settings", "otp_finish_step_title"),
            trackResetOnLoad: true,
            items: [{
                xtype: "syno_displayfield",
                value: _T("otp_enforcement", "finish_step_desc")
            }, {
                xtype: "syno_textfield",
                fieldLabel: _T("user", "user_email"),
                name: "mail",
                maxlength: 512,
                vtype: "email",
                labelWidth: 150
            }],
            keys: [{
                key: [10, 13],
                scope: this,
                handler: this.getNext
            }]
        }, b);
        SYNO.SDS.EnforceOTPWizard.FinishStep.superclass.constructor.call(this, a);
        this.mailField = this.form.findField("mail")
    },
    setMail: function(a) {
        this.form.setValues({
            mail: a
        })
    },
    confirmLDAPChange: function() {
        if (this.changeConfirmed) {
            return true
        }
        this.owner.getMsgBox().confirm(this.title, _T("personal_settings", "confirm_ldap_mail_change"), function(a) {
            this.changeConfirmed = (a === "yes") ? true : false;
            if (this.changeConfirmed) {
                this.getNext()
            }
        }, this);
        this.owner.getMsgBox().getDialog().addClass("enforce-wizard-err-message-dialog")
    },
    onSaveMail: function(b) {
        if (this.owner.isLDAP && !this.confirmLDAPChange()) {
            return false
        }
        var a = this.owner.getEncryptedParams({
            action: "saveMail",
            mail: b
        });
        this.owner.setStatusBusy({
            text: _T("common", "loading")
        });
        Ext.Ajax.request({
            url: this.owner.url,
            params: a,
            scope: this,
            method: "POST",
            callback: function(d, f, e) {
                if (!f || !e || !e.responseText) {
                    this.owner.clearStatusBusy();
                    this.owner.displayError();
                    return false
                }
                var c = Ext.util.JSON.decode(e.responseText);
                if (c && c.success === true) {
                    this.owner.gotoDesktop()
                } else {
                    this.owner.clearStatusBusy();
                    this.owner.displayError();
                    return false
                }
            }
        })
    },
    getNext: function() {
        var a = this.mailField.getValue();
        if (a === "") {
            this.owner.markInvalid(this.mailField, _T("personal_settings", "otp_err_email_required"))
        } else {
            if (!this.mailField.isValid()) {
                this.owner.markInvalid(this.mailField, _T("common", "error_bademail"))
            } else {
                if (!this.mailField.isDirty()) {
                    this.owner.gotoDesktop()
                } else {
                    this.onSaveMail(a)
                }
            }
        }
        return false
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
SYNO.SDS.LoginDialog = Ext.extend(Ext.Container, {
    tplConfig: null,
    bgRatio: 1,
    loadBGImgDone: false,
    constructor: function(c) {
        var b = [];
        this.tplConfig = this.getTplConfig(c.preview);
        this.createBackground();
        this.createWeatherInfo(c);
        this.createCustomizeLogo();
        this.createDialog();
        b.push(this.backgound);
        if (this.weatherInfo) {
            b.push(this.weatherInfo)
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
            this.weatherInfo = new SYNO.SDS.WeatherInfo()
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
        var e = Ext.lib.Dom.getViewHeight();
        var d = 840;
        var a = 500;
        var b = false;
        if (c < d || e < a) {
            if (this.weatherInfo) {
                this.weatherInfo.hide()
            }
            if (this.cusLogo) {
                this.cusLogo.hide()
            }
            b = true
        } else {
            if (this.weatherInfo) {
                this.weatherInfo.show()
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
        Ext.fly("sds-login-icon").alignTo(Ext.get("sds-login-dialog"), "br-br", [32, 40])
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
            a.logo_enable = false;
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
                        a.logo_path = "login_logo" + _S("preview_logoExt_orig") + "?id=" + _S("login_logo_seq")
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
                        a.background_path = "login_background" + _S("preview_bgExt_orig") + "?id=" + _S("login_background_seq");
                        if (_S("login_background_type") && "default" == _S("login_background_type") && f) {
                            a.background_path = "login_background_hd" + _S("login_background_ext") + "?id=" + _S("login_background_seq")
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
            if (a.logo_enable) {
                a.logo_path = "login_logo" + _S("login_logo_ext") + "?id=" + _S("login_logo_seq")
            }
            if (a.background_enable) {
                a.background_path = "login_background" + _S("login_background_ext") + "?id=" + _S("login_background_seq");
                if (a.background_hd_enable) {
                    if (_S("login_background_type") && "default" == _S("login_background_type") && f) {
                        a.background_path = "login_background_hd" + _S("login_background_ext") + "?id=" + _S("login_background_seq")
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
                    cellCls: "username-icon"
                }, {
                    tabIndex: 1,
                    xtype: "textfield",
                    width: 240,
                    maxlength: 256,
                    name: "username",
                    el: "login_username",
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
            }, {
                tabIndex: 4,
                xtype: "syno_button",
                btnStyle: "blue",
                text: _T("common", "dsm_login"),
                id: "login-btn",
                height: 40,
                scope: this,
                disabled: a.tplConfig.preview,
                handler: this.onClickLogin
            }, this.statusField = new SYNO.ux.DisplayField({
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
        this.rememberMe = Ext.get("x-form-el-login_rememberme");
        this.lostPhoneUrl.enableDisplayMode();
        this.forgetPassUrl.enableDisplayMode();
        if (a) {
            this.lostPhoneUrl.addClass("appicon-ident");
            this.forgetPassUrl.addClass("appicon-ident")
        }
    },
    onAfterLayout: function() {
        if (!this.initLayout) {
            this.initLayout = true;
            return
        }
    },
    updateLayout: function() {
        Ext.get("login-btn").alignTo(Ext.get("login_passwd"), "tr-br", [0, 54])
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
        this.updateLayout()
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
        e.timezone = (new Date()).format("P");
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
        var f = false,
            e = "",
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
                    f = true;
                    SYNO.SDS.initData();
                    e = _T("common", "loading")
                } else {
                    if (true === d.request_otp) {
                        this.blShowOTPField = true;
                        e = ""
                    } else {
                        if (d.reason) {
                            if (d.reason != "error_otp_failed") {
                                this.form.findField("passwd").setValue("");
                                this.form.findField("passwd").focus("", 1)
                            }
                            e = _T("login", d.reason)
                        } else {
                            e = _T("common", "error_system")
                        }
                    }
                }
            }
        } catch (b) {
            e = _T("common", "error_system")
        }
        this.setStatus(e);
        this.setFormDisabled(false);
        if (this.blShowOTPField) {
            this.showOTPFiled()
        } else {
            if (!f && d.reason != "error_otp_failed") {
                Ext.getDom("login_passwd").focus()
            }
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
        Ext.getDom("login_otp").focus()
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
    }
});
Ext.BLANK_IMAGE_URL = "/scripts/ext-3/resources/images/default/s.gif";
Ext.data.Connection.prototype.timeout = 120000;
Ext.form.BasicForm.prototype.timeout = 120;
Ext.QuickTip.prototype.maxWidth = 500;
Ext.apply(SYNO.LayoutConfig.Defaults.combo, {
    getListParent: function() {
        return this.el.up(".sds-window")
    }
});
Ext.override(Ext.Element, {
    addClassOnHover: function(a) {
        var b = this;
        if (("ontouchstart" in window) || (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0)) {
            Ext.getDoc().on("click", function(c) {
                if (c.within(b)) {
                    b.addClass(a)
                } else {
                    b.removeClass(a)
                }
            }, b)
        } else {
            b.addClassOnOver(a)
        }
    }
});
Ext.override(Ext.Element, {
    setARIA: function(f, b) {
        var d = this,
            c = d.dom,
            e, a;
        b = (b !== false) && !!c.setAttribute;
        for (a in f) {
            if (f.hasOwnProperty(a)) {
                e = f[a];
                if (a == "role") {
                    d.setRole(e)
                } else {
                    if (a == "tabindex") {
                        c.setAttribute(a, e)
                    } else {
                        if (b) {
                            c.setAttribute("aria-" + a, e)
                        } else {
                            c["aria-" + a] = e
                        }
                    }
                }
            }
        }
        return d
    },
    setRole: function(a) {
        return this.set({
            role: a
        })
    }
});
Ext.override(Ext.Component, {
    getTaskRunner: function() {
        if (!this.taskRunner) {
            this.taskRunner = new SYNO.SDS.TaskRunner();
            this.addManagedComponent(this.taskRunner)
        }
        return this.taskRunner
    },
    addTask: function(a) {
        return this.getTaskRunner().createTask(a)
    },
    addAjaxTask: function(a) {
        return this.getTaskRunner().createAjaxTask(a)
    },
    addWebAPITask: function(a) {
        return this.getTaskRunner().createWebAPITask(a)
    },
    getTask: function(a) {
        if (!this.taskRunner) {
            return null
        }
        return this.taskRunner.getTask(a)
    },
    removeTask: function(b) {
        var a = this.getTask(b);
        if (a) {
            a.remove()
        }
        return a
    },
    addManagedComponent: function(a) {
        this.components = this.components || [];
        this.components.push(a);
        return a
    },
    removeManagedComponent: function(a) {
        this.components = this.components || [];
        this.components.remove(a);
        return a
    },
    beforeDestroy: function() {
        this.taskRunner = null;
        this.components = this.components || [];
        for (var a = 0; a < this.components.length; ++a) {
            try {
                this.components[a].destroy()
            } catch (b) {
                if (Ext.isDefined(SYNO.SDS.JSDebug)) {
                    SYNO.Debug(this.id + " sub-components[" + a + "] destroy failed.");
                    SYNO.Debug(this.components[a]);
                    throw b
                }
            }
        }
        delete this.components
    },
    findWindow: function() {
        var a = this;
        if (a instanceof SYNO.SDS.BaseWindow) {
            return a
        }
        for (; Ext.isObject(a.ownerCt); a = a.ownerCt) {}
        if (a instanceof SYNO.SDS.BaseWindow) {
            return a
        }
        return
    },
    findAppWindow: function() {
        var a = this,
            b = Ext.getClassByName("SYNO.SDS.AppWindow");
        if (Ext.isEmpty(b)) {
            return
        }
        if (a instanceof b) {
            return a
        }
        if (a._appWindow instanceof b) {
            return a._appWindow
        }
        for (; Ext.isObject(a.ownerCt); a = a.ownerCt) {}
        if (a instanceof b) {
            this._appWindow = a;
            return a
        }
        if (!Ext.isObject(a)) {
            return
        }
        for (; Ext.isObject(a.owner); a = a.owner) {}
        if (a instanceof b) {
            this._appWindow = a;
            return a
        }
        if (a.module && a.module.appWin && a.module.appWin instanceof b) {
            this._appWindow = a.module.appWin;
            return a.module.appWin
        }
        return
    },
    getDsmVersion: function() {
        var a = this.findAppWindow();
        if (a) {
            return a.getOpenConfig("dsm_version")
        } else {
            return null
        }
    },
    getDsmHttpPort: function() {
        var b = this.findAppWindow(),
            a;
        if (b && b.hasOpenConfig("cms_ds_data")) {
            a = b.getOpenConfig("cms_ds_data").http_port
        }
        return a
    },
    getDsmHost: function() {
        var a = this.findAppWindow(),
            b;
        if (a && a.hasOpenConfig("cms_ds_data")) {
            b = a.getOpenConfig("cms_ds_data").host
        }
        return b
    },
    getBaseURL: function(c, a, b) {
        c.appWindow = this.findAppWindow();
        return SYNO.API.GetBaseURL(c, a, b)
    },
    sendWebAPI: function(a) {
        a.appWindow = this.findAppWindow();
        return SYNO.API.Request(a)
    },
    pollReg: function(a) {
        a.appWindow = this.findAppWindow();
        return SYNO.API.Request.Polling.Register(a)
    },
    pollUnreg: function(a) {
        return SYNO.API.Request.Polling.Unregister(a)
    },
    pollList: function(a) {
        a.appWindow = this.findAppWindow();
        return SYNO.API.Request.Polling.List(a)
    },
    downloadWebAPI: function(a) {
        a.appWindow = this.findAppWindow();
        return SYNO.SDS.Utils.IFrame.requestWebAPI(a)
    },
    IsAllowRelay: function() {
        var a = this.findAppWindow();
        if (!Ext.isObject(a)) {
            return false
        }
        return SYNO.SDS.Utils.IsAllowRelay && SYNO.SDS.Utils.IsAllowRelay(a)
    },
    _S: function(b) {
        var a = this.findAppWindow();
        return SYNO.API.Info.GetSession(a, b)
    },
    _D: function(b, c) {
        var a = this.findAppWindow();
        return SYNO.API.Info.GetDefine(a, b, c)
    },
    getKnownAPI: function(b) {
        var a = this.findAppWindow();
        return SYNO.API.Info.GetKnownAPI(a, b)
    },
    IsKnownAPI: function(b, a) {
        var c = SYNO.API.Info.GetKnownAPI(this.findAppWindow(), b);
        if (!Ext.isObject(c)) {
            return false
        }
        if (a < c.minVersion || c.maxVersion < a) {
            return false
        }
        return true
    }
});
Ext.override(Ext.grid.GridView, {
    onLayout: function() {
        var b = this.el.select(".x-grid3-scroller", this);
        var a = b.elements[0];
        if (a.clientWidth === a.offsetWidth) {
            this.scrollOffset = 2
        } else {
            this.scrollOffset = undefined
        }
        this.fitColumns(false)
    }
});
Ext.override(Ext.data.Record, {
    set: function(a, d) {
        var b;
        var c = Ext.isPrimitive(d) ? String : Ext.encode;
        if (c(this.data[a]) == c(d)) {
            return
        }
        this.dirty = true;
        if (!this.modified) {
            this.modified = {}
        }
        if (a in this.modified && this.modified[a] === d) {
            this.dirty = false;
            delete this.modified[a];
            for (b in this.modified) {
                if (this.modified.hasOwnProperty(b)) {
                    this.dirty = true;
                    break
                }
            }
        } else {
            if (!(a in this.modified)) {
                this.modified[a] = this.data[a]
            }
        }
        this.data[a] = d;
        if (!this.editing) {
            this.afterEdit()
        }
    }
});
Ext.override(Ext.data.Store, {
    afterEdit: function(b) {
        var a = this.modified.indexOf(b);
        if (b.dirty && a == -1) {
            this.modified.push(b)
        } else {
            if (!b.dirty && a != -1) {
                this.modified.splice(a, 1)
            }
        }
        this.fireEvent("update", this, b, Ext.data.Record.EDIT)
    }
});
Ext.Element.addMethods(Ext.Fx);
Ext.override(Ext.dd.DragSource, {
    validateTarget: function(b, a, c) {
        if (c === a.getTarget().id || a.within(c)) {
            return true
        }
        this.getProxy().setStatus(this.dropNotAllowed);
        return false
    },
    beforeDragEnter: function(b, a, c) {
        return this.validateTarget(b, a, c)
    },
    beforeDragOver: function(c, b, d) {
        var a = this.validateTarget(c, b, d);
        if (this.proxy) {
            this.proxy.setStatus(a ? this.dropAllowed : this.dropNotAllowed)
        }
        return a
    },
    beforeDragOut: function(b, a, c) {
        return this.validateTarget(b, a, c)
    },
    beforeDragDrop: function(b, a, c) {
        if (this.validateTarget(b, a, c)) {
            return true
        }
        this.onInvalidDrop(b, a, c);
        return false
    }
});
Ext.override(Ext.form.CompositeField, {
    combineErrors: false
});
if (Ext.isIE) {
    Ext.menu.BaseItem.prototype.clickHideDelay = -1
}
Ext.override(Ext.Window, {
    onRender: function(b, a) {
        Ext.Window.superclass.onRender.call(this, b, a);
        if (this.plain) {
            this.el.addClass("x-window-plain")
        }
        this.focusEl = this.el.createChild({
            tag: "a",
            href: "#",
            cls: "x-dlg-focus",
            tabIndex: "-1",
            html: "&#160;"
        });
        this.focusEl.swallowEvent("click", true);
        this.proxy = this.el.createProxy("x-window-proxy");
        this.proxy.enableDisplayMode("block");
        if (this.modal) {
            this.maskEl = this.container.createChild({
                cls: "ext-el-mask"
            }, this.el.dom);
            this.maskEl.enableDisplayMode("block");
            this.maskEl.hide();
            this.mon(this.maskEl, "click", this.focus, this)
        }
        if (this.maximizable) {
            this.mon(this.header, "dblclick", this.toggleMaximize, this)
        }
    },
    beforeShow: function() {
        delete this.el.lastXY;
        delete this.el.lastLT;
        if (this.x === undefined || this.y === undefined) {
            var a = this.el.getAlignToXY(this.container, "c-c");
            var b = this.el.translatePoints(a[0], a[1]);
            this.x = this.x === undefined ? b.left : this.x;
            this.y = this.y === undefined ? b.top : this.y
        }
        this.el.setLeftTop(this.x, this.y);
        if (this.expandOnShow) {
            this.expand(false)
        }
        if (this.modal) {
            Ext.getBody().addClass("x-body-masked");
            this.maskEl.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
            this.maskEl.show()
        }
    },
    onWindowResize: function() {
        if (this.maximized) {
            this.fitContainer()
        }
        if (this.modal) {
            this.maskEl.setSize("100%", "100%");
            this.maskEl.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true))
        }
        this.doConstrain()
    },
    setZIndex: function(a) {
        if (this.modal) {
            this.maskEl.setStyle("z-index", a)
        }
        this.el.setZIndex(++a);
        a += 5;
        if (this.resizer) {
            this.resizer.proxy.setStyle("z-index", ++a)
        }
        this.lastZIndex = a
    },
    beforeDestroy: function() {
        if (this.rendered) {
            this.hide();
            this.clearAnchor();
            Ext.destroy(this.focusEl, this.resizer, this.dd, this.proxy, this.maskEl)
        }
        Ext.Window.superclass.beforeDestroy.call(this)
    },
    hide: function(c, a, b) {
        if (this.hidden || this.fireEvent("beforehide", this) === false) {
            return this
        }
        if (a) {
            this.on("hide", a, b, {
                single: true
            })
        }
        this.hidden = true;
        if (c !== undefined) {
            this.setAnimateTarget(c)
        }
        if (this.modal) {
            this.maskEl.hide();
            Ext.getBody().removeClass("x-body-masked")
        }
        if (this.animateTarget) {
            this.animHide()
        } else {
            this.el.hide();
            this.afterHide()
        }
        return this
    }
});
Ext.override(Ext.grid.RowSelectionModel, {
    silentMode: false,
    onRefresh: function() {
        var f = this.grid.store,
            d = this.getSelections(),
            c = 0,
            a = d.length,
            b, e;
        this.silent = this.silentMode && true;
        this.clearSelections(true);
        for (; c < a; c++) {
            e = d[c];
            if ((b = f.indexOfId(e.id)) != -1) {
                this.selectRow(b, true)
            }
        }
        if (d.length != this.selections.getCount()) {
            this.fireEvent("selectionchange", this)
        }
        this.silent = false
    }
});
Ext.override(Ext.grid.GridPanel, {
    getValues: function() {
        var b = [],
            a = this.getStore();
        if (!Ext.isObject(a)) {
            return b
        }
        a.each(function(e, d, c) {
            b.push(Ext.apply({}, e.data))
        }, this);
        return b
    },
    setValues: function(c) {
        var b = this.getStore();
        var a = [];
        if (!Ext.isObject(b) || !Ext.isArray(c)) {
            return false
        }
        b.removeAll();
        c.each(function(d) {
            a.push(new Ext.data.Record(d))
        }, this);
        b.add(a)
    }
});
Ext.override(Ext.grid.GridView.ColumnDragZone, {
    getDragData: function(c) {
        var a = Ext.lib.Event.getTarget(c),
            b = this.view.findHeaderCell(a);
        if (b) {
            return {
                ddel: Ext.fly(b).child("div.x-grid3-hd-inner", true),
                header: b
            }
        }
        return false
    }
});
Ext.override(Ext.grid.HeaderDropZone, {
    positionIndicator: function(d, j, i) {
        var a = Ext.lib.Event.getPageX(i),
            f = Ext.lib.Dom.getRegion(Ext.fly(j).child("div.x-grid3-hd-inner", true)),
            c, g, b = f.top + this.proxyOffsets[1];
        if ((f.right - a) <= (f.right - f.left) / 2) {
            c = f.right + this.view.borderWidth;
            g = "after"
        } else {
            c = f.left;
            g = "before"
        }
        if (this.grid.colModel.isFixed(this.view.getCellIndex(j))) {
            return false
        }
        c += this.proxyOffsets[0];
        this.proxyTop.setLeftTop(c, b);
        this.proxyTop.show();
        if (!this.bottomOffset) {
            this.bottomOffset = this.view.mainHd.getHeight()
        }
        this.proxyBottom.setLeftTop(c, b + this.proxyTop.dom.offsetHeight + this.bottomOffset);
        this.proxyBottom.show();
        return g
    },
    onNodeDrop: function(b, l, f, c) {
        var d = c.header;
        if (d != b) {
            var j = this.grid.colModel,
                i = Ext.lib.Event.getPageX(f),
                a = Ext.lib.Dom.getRegion(Ext.fly(b).child("div.x-grid3-hd-inner", true)),
                m = (a.right - i) <= ((a.right - a.left) / 2) ? "after" : "before",
                g = this.view.getCellIndex(d),
                k = this.view.getCellIndex(b);
            if (m == "after") {
                k++
            }
            if (g < k) {
                k--
            }
            j.moveColumn(g, k);
            return true
        }
        return false
    }
});
Ext.override(SYNO.ux.ModuleList, {
    getLocalizedString: function(a) {
        return SYNO.SDS.Utils.GetLocalizedString(a)
    }
});
Ext.override(SYNO.ux.FieldSet, {
    stateful: true,
    stateEvents: ["expand", "collapse"],
    getState: function() {
        return {
            collapsed: this.collapsed
        }
    },
    saveState: function() {
        var a = this.getState();
        this.setUserCollapseState(a.collapsed)
    },
    getUserCollapseState: function() {
        var c = this.getStateId();
        var b = this.findAppWindow();
        if (b && b.appInstance && c) {
            var a = b.appInstance.getUserSettings("fieldset_collapse_status") || {};
            return Ext.isBoolean(a[c]) ? a[c] : this.collapsed
        }
        return this.collapsed
    },
    setUserCollapseState: function(d) {
        var c = this.getStateId();
        var b = this.findAppWindow();
        if (b && b.appInstance && c) {
            var a = b.appInstance.getUserSettings("fieldset_collapse_status") || {};
            a[c] = d;
            b.appInstance.setUserSettings("fieldset_collapse_status", a)
        }
    },
    updateUserCollapseState: function() {
        var a = this.getUserCollapseState();
        var b = {
            collapsed: a
        };
        this.applyState(b)
    }
});
var _urlAppend = Ext.urlAppend;
Ext.urlAppend = function(c, d, b) {
    var a = Ext.urlDecode(d);
    b = typeof b !== "undefined" ? b : true;
    if (b && c.indexOf("SynoToken") === -1 && !Ext.isEmpty(_S("SynoToken"))) {
        a.SynoToken = decodeURIComponent(_S("SynoToken"))
    }
    return _urlAppend(c, Ext.urlEncode(a))
};
Ext.ns("SYNO.SDS");
SYNO.SDS.UpdateSynoToken = function(a) {
    Ext.Ajax.request({
        url: "login.cgi",
        updateSynoToken: true,
        callback: function(c, e, b) {
            var d = Ext.util.JSON.decode(b.responseText);
            if (e && !Ext.isEmpty(d.SynoToken)) {
                SYNO.SDS.Session.SynoToken = encodeURIComponent(d.SynoToken)
            }
            if (Ext.isFunction(a)) {
                a(c, e, b)
            }
        }
    })
};
var _cookie = Ext.util.Cookies.get("id");
Ext.Ajax.on("beforerequest", function(b, a) {
    if (true === a.updateSynoToken) {
        return
    }
    if (!Ext.isEmpty(_cookie) && _cookie !== Ext.util.Cookies.get("id")) {
        b.abort();
        location.reload()
    } else {
        _cookie = Ext.util.Cookies.get("id")
    }
    if (Ext.isEmpty(a.skipSynoToken) && !Ext.isEmpty(_S("SynoToken"))) {
        if (Ext.isEmpty(a.headers)) {
            a.headers = {}
        }
        a.headers["X-SYNO-TOKEN"] = _S("SynoToken")
    }
});
Ext.util.Observable.observeClass(Ext.form.BasicForm);
Ext.form.BasicForm.on("beforeaction", function(a, b) {
    if (a.url) {
        a.url = Ext.urlAppend(a.url)
    }
});
Ext.util.Observable.observeClass(Ext.data.Connection);
Ext.data.Connection.on("beforerequest", function(a, b) {
    if (Ext.isEmpty(b.skipSynoToken) && !Ext.isEmpty(_S("SynoToken"))) {
        if (Ext.isEmpty(b.headers)) {
            b.headers = {}
        }
        b.headers["X-SYNO-TOKEN"] = _S("SynoToken")
    }
});
Ext.define("Ext.data.JsonP", {
    singleton: true,
    requestCount: 0,
    requests: {},
    timeout: 30000,
    disableCaching: true,
    disableCachingParam: "_dc",
    callbackKey: "callback",
    request: function(l) {
        l = Ext.apply({}, l);
        var h = this,
            c = Ext.isDefined(l.disableCaching) ? l.disableCaching : h.disableCaching,
            f = l.disableCachingParam || h.disableCachingParam,
            b = ++h.requestCount,
            j = l.callbackName || "callback" + b,
            g = l.callbackKey || h.callbackKey,
            k = Ext.isDefined(l.timeout) ? l.timeout : h.timeout,
            d = Ext.apply({}, l.params),
            a = l.url,
            e, i;
        if (c && !d[f]) {
            d[f] = new Date().getTime()
        }
        l.params = d;
        d[g] = "Ext.data.JsonP." + j;
        i = h.createScript(a, d, l);
        h.requests[b] = e = {
            url: a,
            params: d,
            script: i,
            id: b,
            scope: l.scope,
            success: l.success,
            failure: l.failure,
            callback: l.callback,
            callbackKey: g,
            callbackName: j
        };
        if (k > 0) {
            e.timeout = setTimeout(Ext.createDelegate(h.handleTimeout, h, [e]), k)
        }
        h.setupErrorHandling(e);
        h[j] = Ext.createDelegate(h.handleResponse, h, [e], true);
        h.loadScript(e);
        return e
    },
    abort: function(c) {
        var b = this,
            d = b.requests,
            a;
        if (c) {
            if (!c.id) {
                c = d[c]
            }
            b.handleAbort(c)
        } else {
            for (a in d) {
                if (d.hasOwnProperty(a)) {
                    b.abort(d[a])
                }
            }
        }
    },
    setupErrorHandling: function(a) {
        a.script.onerror = Ext.createDelegate(this.handleError, this, [a])
    },
    handleAbort: function(a) {
        a.errorType = "abort";
        this.handleResponse(null, a)
    },
    handleError: function(a) {
        a.errorType = "error";
        this.handleResponse(null, a)
    },
    cleanupErrorHandling: function(a) {
        a.script.onerror = null
    },
    handleTimeout: function(a) {
        a.errorType = "timeout";
        this.handleResponse(null, a)
    },
    handleResponse: function(a, b) {
        var c = true;
        if (b.timeout) {
            clearTimeout(b.timeout)
        }
        delete this[b.callbackName];
        delete this.requests[b.id];
        this.cleanupErrorHandling(b);
        Ext.fly(b.script).remove();
        if (b.errorType) {
            c = false;
            Ext.callback(b.failure, b.scope, [b.errorType])
        } else {
            Ext.callback(b.success, b.scope, [a])
        }
        Ext.callback(b.callback, b.scope, [c, a, b.errorType])
    },
    createScript: function(c, d, b) {
        var a = document.createElement("script");
        a.setAttribute("src", Ext.urlAppend(c, Ext.urlEncode(d)));
        a.setAttribute("async", true);
        a.setAttribute("type", "text/javascript");
        return a
    },
    loadScript: function(a) {
        Ext.get(document.getElementsByTagName("head")[0]).appendChild(a.script)
    }
});
Ext.namespace("SYNO.API");
SYNO.API.getErrorString = function(c) {
    var b = 100,
        a, d;
    if (Ext.isNumber(c)) {
        b = c
    } else {
        if (Ext.isObject(c)) {
            a = SYNO.API.Util.GetFirstError(c);
            b = Ext.isNumber(a.code) ? a.code : 100
        }
    }
    if (b <= 118) {
        return SYNO.API.Erros.common[b]
    }
    d = Ext.isString(SYNO.API.Erros.core[b]) ? SYNO.API.Erros.core[b] : _T("common", "error_system");
    return d
};
SYNO.API.CheckSpecialError = function(a, d, b) {
    var c;
    if ("SYNO.DSM.Share" === b.api) {
        if ("delete" === b.method && 404 === d.code) {
            c = _T("error", "delete_default_share")
        } else {
            if ("edit" === b.method && 406 === d.code) {
                c = _T("error", "share_mounted_rename")
            }
        }
    }
    return c
};
SYNO.API.CheckResponse = function(a, h, d, g) {
    var b, f;
    if (a) {
        return true
    }
    if (Ext.isEmpty(h) || 0 === h.status) {
        return false
    }
    try {
        b = Ext.isDefined(h.status) ? 0 : (h.code || 100);
        if (b < SYNO.API.Erros.minCustomeError) {
            f = SYNO.API.Erros.common[b]
        } else {
            f = SYNO.API.CheckSpecialError(a, h, d) || SYNO.API.Erros.core[b]
        }
    } catch (c) {} finally {
        if (!f) {
            b = 100;
            f = SYNO.API.Erros.common[b]
        }
    }
    if (b >= 105 && b <= 107 && (!g || Ext.isEmpty(g.getResponseHeader("X-SYNO-SOURCE-ID")))) {
        SYNO.SDS.Utils.Logout.action(true, f, true)
    }
    return f
};
SYNO.API.CheckRelayResponse = function(h, d, g, c, f) {
    var b, a = false,
        e = Ext.getClassByName("SYNO.SDS.AppWindow");
    if (Ext.isEmpty(d) || (Ext.isObject(f) && 0 === f.status)) {
        return a
    }
    if (!SYNO.SDS.Utils.IsAllowRelay(c.appWindow) || Ext.isEmpty(e)) {
        return a
    }
    b = c.appWindow.findAppWindow();
    if (!(b instanceof e) || Ext.isEmpty(b.appInstance)) {
        return a
    }
    if (!Ext.isObject(c.params)) {
        return a
    }
    if (c.params.api === "SYNO.API.Info") {
        a = true
    } else {
        if (c.params.api !== '"SYNO.CMS.DS"' || c.params.method !== '"relay"') {
            return a
        }
    }
    if (true === a) {} else {
        if (Ext.isObject(f) && Ext.isEmpty(f.getResponseHeader("X-SYNO-SOURCE-ID"))) {
            if (Ext.isNumber(d.code) && (414 === d.code || 406 === d.code || 401 === d.code || 423 === d.code)) {
                a = true
            } else {
                if (Ext.isObject(f) && f.status >= 400 && f.status < 600) {
                    a = true
                }
            }
        } else {
            if (Ext.isObject(c.userInfo.params) && Ext.isArray(c.userInfo.params.compound)) {
                d.result.each(function(i) {
                    if (Ext.isObject(i.error) && i.error.code >= 105 && i.error.code <= 107) {
                        a = true;
                        return false
                    }
                }, this)
            } else {
                if (Ext.isNumber(d.code)) {
                    if (d.code >= 105 && d.code <= 107) {
                        a = true
                    }
                } else {
                    if (Ext.isObject(f) && f.status >= 400 && f.status < 600) {
                        a = true
                    }
                }
            }
        }
    }
    if (true === a) {
        b.getMsgBox().alert(_T("error", "error_error"), _T("cms", "relaunch_app"), function() {
            b.close()
        })
    }
    return a
};
SYNO.API.Manager = Ext.extend(Ext.util.Observable, {
    baseURL: "/webapi",
    constructor: function() {
        SYNO.API.Manager.superclass.constructor.apply(this, arguments);
        this.jsDebug = Ext.urlDecode(location.search.substr(1)).jsDebug;
        this.knownAPI = {
            "SYNO.API.Info": {
                path: "query.cgi",
                minVersion: 1,
                maxVersion: 1
            }
        }
    },
    queryAPI: function(c, a, e, d) {
        var b = [];
        if (!Ext.isArray(c)) {
            c = [c]
        }
        Ext.each(c, function(f) {
            if (!this.knownAPI.hasOwnProperty(f)) {
                b.push(f)
            }
        }, this);
        this.requestAjaxAPI("SYNO.API.Info", "query", 1, {
            async: Ext.isBoolean(d) ? d : true
        }, {
            query: b.join(",")
        }, Ext.createDelegate(this.onQueryAPI, this, [a, e], true))
    },
    onQueryAPI: function(b, f, e, d, a, c) {
        if (b) {
            if (Ext.isObject(e) && "all" === e.query) {
                this.knownAPI = Ext.apply({}, f)
            } else {
                Ext.apply(this.knownAPI, f)
            }
        }
        if (a) {
            a.call(c, b, f, e, d)
        }
    },
    getKnownAPI: function(b, e) {
        var d = this.knownAPI[b],
            c, a;
        if (!Ext.isDefined(this.jsDebug) || !Ext.isObject(d)) {
            return d
        }
        c = d.path + "/";
        if ("SYNO.Entry.Request" === b && Ext.isObject(e) && Ext.isArray(e.compound)) {
            a = [];
            e.compound.each(function(f) {
                if (Ext.isString(f.api)) {
                    a.push(f.api)
                }
            });
            c += a.join()
        } else {
            c += b
        }
        return Ext.apply({}, {
            path: c
        }, d)
    },
    getBaseURL: function(j, a, l, k, b) {
        var f, h, e, c;
        if (Ext.isObject(j)) {
            h = j;
            k = a;
            b = l;
            if (h.webapi) {
                h = h.webapi
            }
            if (Ext.isObject(h.compound)) {
                if (!Ext.isArray(h.compound.params)) {
                    SYNO.Debug("params must be array");
                    return
                }
                j = "SYNO.Entry.Request";
                a = "request";
                l = 1;
                var d = h.compound.params || [],
                    m = [];
                for (var g = 0; g < d.length; g++) {
                    m.push(Ext.apply({
                        api: d[g].api,
                        method: d[g].method,
                        version: d[g].version
                    }, d[g].params))
                }
                e = {
                    stop_when_error: Ext.isBoolean(h.compound.stopwhenerror) ? h.compound.stopwhenerror : false,
                    compound: m
                }
            } else {
                j = h.api;
                a = h.method;
                l = h.version;
                e = h.params
            }
        }
        f = this.getKnownAPI(j, e);
        if (!f) {
            SYNO.API.currentManager.queryAPI("all", undefined, undefined, false);
            f = this.getKnownAPI(j, e);
            if (!f) {
                SYNO.Debug("No Such API: " + j);
                return
            }
        }
        c = this.baseURL + "/" + f.path;
        if (Ext.isString(b) && !Ext.isEmpty(b)) {
            c += "/" + b
        }
        if (!a || !l) {
            return c
        }
        h = {
            api: j,
            method: a,
            version: l
        };
        if (e) {
            Ext.apply(h, ("JSON" === f.requestFormat) ? SYNO.API.EncodeParams(e) : e)
        }
        return Ext.urlAppend(c, Ext.urlEncode(h), k)
    },
    requestAjaxAPI: function(l, d, e, b, g, o, c) {
        var h, v = SYNO.Util.copy(g),
            k, w, m = null,
            t;
        var n, s;
        if (Ext.isObject(l)) {
            k = l;
            if (k.webapi) {
                k = k.webapi
            }
            b = {};
            Ext.apply(b, k);
            delete b.api;
            delete b.method;
            delete b.version;
            delete b.scope;
            delete b.callback;
            o = k.callback || l.callback;
            c = k.scope || l.scope;
            b.appWindow = l.appWindow;
            if (Ext.isObject(k.compound)) {
                t = k.compound
            } else {
                l = k.api;
                d = k.method;
                e = k.version;
                v = k.params
            }
        }
        if (b && b.compound) {
            t = b.compound
        }
        if (t) {
            if (!Ext.isArray(t.params)) {
                SYNO.Debug("params must be array");
                return
            }
            l = "SYNO.Entry.Request";
            d = "request";
            e = 1;
            var u = t.params || [],
                a = [];
            for (var r = 0; r < u.length; r++) {
                a.push(Ext.apply({
                    api: u[r].api,
                    method: u[r].method,
                    version: u[r].version
                }, u[r].params))
            }
            v = {
                stop_when_error: Ext.isBoolean(t.stopwhenerror) ? t.stopwhenerror : false,
                compound: a
            }
        }
        if (Ext.isObject(b.appWindow) && l !== "SYNO.API.Info") {
            h = SYNO.API.Info.GetKnownAPI(b.appWindow, l, v)
        } else {
            h = this.getKnownAPI(l, v)
        }
        if (!h) {
            s = Ext.isObject(b.appWindow) && b.appWindow.IsAllowRelay();
            if (!s) {
                SYNO.API.currentManager.queryAPI("all", undefined, undefined, false);
                h = this.getKnownAPI(l, v)
            }
            if (!h) {
                SYNO.Debug("No Such API: " + l);
                n = {
                    error: {
                        code: 101
                    }
                };
                if (s) {
                    SYNO.API.CheckRelayResponse(false, n, v, b)
                }
                if (Ext.isFunction(o)) {
                    o.call(c || window, false, n, v, b)
                }
                return
            }
        }
        if (e < h.minVersion || h.maxVersion < e) {
            SYNO.Debug(String.format("WARN: API({0}) version ({1}) is higher then server ({2})", l, e, h.version))
        }
        if (!Ext.isObject(v) && !Ext.isEmpty(v)) {
            SYNO.Debug("params must be object, " + v);
            return
        }
        if (Ext.isArray(b.encryption)) {
            m = Ext.apply([], b.encryption)
        }
        delete b.encryption;
        var q = {
            api: l,
            method: d,
            version: e
        };
        var f = this.baseURL + "/" + h.path,
            j;
        if (b && b.url) {
            var p = b.url;
            j = Ext.urlDecode(p.substr(p.indexOf("?") + 1));
            if (j && j.api && j.method && j.version) {
                delete j.api;
                delete j.method;
                delete j.version;
                delete j.SynoToken;
                q = j;
                f = b.url
            }
        }
        if (b && Ext.isElement(b.form) && (/multipart\/form-data/i.test(b.form.enctype))) {
            f = SYNO.API.GetBaseURL(q);
            q = {}
        } else {
            if (Ext.isObject(b) && true === b.html5upload) {
                f = SYNO.API.GetBaseURL(Ext.apply({
                    params: v
                }, q));
                q = {};
                b.method = "POST"
            }
        }
        w = Ext.apply((b || {}), {
            url: f,
            params: Ext.apply({}, q, ("JSON" === h.requestFormat) ? SYNO.API.EncodeParams(v) : v),
            callback: this.onRequestAPI,
            userInfo: {
                params: v,
                cb: o,
                scope: c
            }
        });
        if (!Ext.isEmpty(m)) {
            return this.requestAjaxAPI("SYNO.API.Encryption", "getinfo", 1, {
                appWindow: w.appWindow || undefined,
                reqObj: w,
                reqEnc: m
            }, {
                format: "module"
            }, this.onEncryptRequestAPI, this)
        }
        return this.sendRequest(w)
    },
    onEncryptRequestAPI: function(n, k, f, a) {
        var d, h, g, c = a.reqObj,
            b = a.reqEnc,
            m = function(j) {
                for (var i in j) {
                    if (j.hasOwnProperty(i)) {
                        return false
                    }
                }
                return true
            };
        if (!n) {
            return Ext.Ajax.request(c)
        }
        SYNO.Encryption.CipherKey = k.cipherkey;
        SYNO.Encryption.RSAModulus = k.public_key;
        SYNO.Encryption.CipherToken = k.ciphertoken;
        SYNO.Encryption.TimeBias = k.server_time - Math.floor(+new Date() / 1000);
        if (Ext.isEmpty(c.params.compound)) {
            d = SYNO.Encryption.EncryptParam(Ext.copyTo({}, c.params, b.join(",")));
            for (h = 0; h < b.length; h++) {
                delete c.params[b[h]]
            }
            c.params = Ext.apply(c.params, d);
            return this.sendRequest(c)
        } else {
            var o = Ext.apply({}, c.userInfo.params);
            var l = this,
                e = 5;
            if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
                e = 1
            }
            h = 0;
            var p = function() {
                for (; h < o.compound.length; h++) {
                    var j = Ext.apply({}, o.compound[h], o.compound[h].params);
                    var i = {};
                    d = {};
                    i = SYNO.API.EncodeParams(Ext.copyTo({}, j, b.join(",")));
                    if (!m(i)) {
                        d = SYNO.Encryption.EncryptParam(i)
                    }
                    for (g = 0; g < b.length; g++) {
                        delete j[b[g]]
                    }
                    o.compound[h] = Ext.apply(j, d);
                    if (h + 1 === o.compound.length) {
                        Ext.apply(c.params, SYNO.API.EncodeParams(o));
                        l.sendRequest(c);
                        return
                    } else {
                        if (h % e === 0) {
                            h++;
                            window.setTimeout(p, 80);
                            return
                        }
                    }
                }
            };
            p()
        }
    },
    sendRequest: function(d) {
        var c = d.appWindow,
            a, f, e = this.getKnownAPI("SYNO.CMS.DS"),
            b;
        if (Ext.isObject(c)) {
            c = c.findAppWindow()
        }
        if (!Ext.isEmpty(e) && SYNO.SDS.Utils.IsAllowRelay(c) && c.hasOpenConfig("cms_id")) {
            f = c.getOpenConfig("cms_timeout") || 120;
            b = {
                api: "SYNO.CMS.DS",
                version: 1,
                method: "relay",
                id: c.getOpenConfig("cms_id"),
                timeout: f
            };
            if (Ext.isElement(d.form) && (/multipart\/form-data/i.test(d.form.enctype))) {
                a = Ext.urlDecode(d.url.substr(d.url.indexOf("?") + 1));
                b.webapi = Ext.encode(Ext.copyTo({}, a, "api,version,method"));
                if (a.SynoToken) {
                    b.SynoToken = a.SynoToken
                }
                d.url = this.baseURL + "/" + e.path + "?" + Ext.urlEncode(b)
            } else {
                d.url = this.baseURL + "/" + e.path;
                b.webapi = Ext.apply({
                    api: d.params.api,
                    version: d.params.version,
                    method: d.params.method
                }, d.userInfo.params);
                d.params = SYNO.API.EncodeParams(b)
            }
            d.timeout = d.timeout || (f + 10) * 1000
        }
        return Ext.Ajax.request(d)
    },
    requestAPI: function(d, f, b, e, a, c) {
        return this.requestAjaxAPI(d, f, b, {}, e, a, c)
    },
    onRequestAPI: function(b, a, g) {
        var h = false,
            d = g,
            f;
        if (a) {
            try {
                f = Ext.decode(g.responseText)
            } catch (c) {}
            if (Ext.isObject(f)) {
                if (f.success) {
                    h = true;
                    d = f.data
                } else {
                    h = false;
                    d = f.error
                }
            }
        }
        SYNO.API.CheckResponse(h, d, b.userInfo.params, g);
        if (SYNO.SDS.Utils.IsAllowRelay(b.appWindow) && SYNO.API.CheckRelayResponse(h, d, undefined, b, g)) {
            return
        }
        if (b.userInfo.cb) {
            b.userInfo.cb.call(b.userInfo.scope, h, d, b.userInfo.params, b)
        }
    }
});
SYNO.API.Store = Ext.extend(Ext.data.Store, {
    defaultParamNames: {
        start: "offset",
        limit: "limit",
        sort: "sort_by",
        dir: "sort_direction"
    },
    constructor: function(a) {
        if ((a.api && a.method && a.version) && !a.proxy) {
            if (!Ext.isObject(a.appWindow) && false !== a.appWindow) {
                SYNO.Debug("No appWindow!");
                SYNO.Debug("SYNO.API.Store and SYNO.API.JsonStore require appWindow in config.");
                SYNO.Debug("appWindow can be found by Ext.Component.findAppWindow");
                SYNO.Debug("ex: this.findAppWindow() or config.module.appWin.findAppWindow()");
                return
            }
            this.proxy = new SYNO.API.Proxy({
                api: a.api,
                method: a.method,
                version: a.version,
                appWindow: a.appWindow
            })
        }
        SYNO.API.Store.superclass.constructor.apply(this, arguments)
    }
});
Ext.define("SYNO.API.CompoundReader", {
    extend: "Ext.data.JsonReader",
    constructor: function() {
        this.callParent(arguments)
    },
    readRecords: function(d) {
        var e, c = [],
            b = this.meta.roots,
            a = {
                success: false,
                records: [],
                totalRecords: 0
            };
        this.compoundData = d;
        if (!Ext.isObject(d)) {
            return a
        }
        d.result.each(function(h, g, f) {
            if (Ext.isArray(b)) {
                this.getRoot = this.createAccessor(b[g])
            }
            if (true === h.success) {
                e = this.superclass().readRecords.call(this, h.data)
            } else {
                c.push({
                    response: h,
                    index: g,
                    total: f
                })
            }
            if (Ext.isFunction(this.meta.onCompoundResponse)) {
                e = this.meta.onCompoundResponse(h, e)
            }
            a.records = a.records.concat(e.records);
            a.totalRecords += e.totalRecords
        }, this);
        a.success = !d.has_fail;
        if (false === a.success) {
            throw c
        }
        return a
    }
});
SYNO.API.CompoundStore = Ext.extend(SYNO.API.Store, {
    constructor: function(a) {
        Ext.apply(a, {
            api: "SYNO.Entry.Request",
            version: 1,
            method: "request"
        });
        SYNO.API.JsonStore.superclass.constructor.call(this, Ext.apply(a, {
            reader: new SYNO.API.CompoundReader(a)
        }))
    }
});
SYNO.API.JsonStore = Ext.extend(SYNO.API.Store, {
    constructor: function(a) {
        SYNO.API.JsonStore.superclass.constructor.call(this, Ext.apply(a, {
            reader: new Ext.data.JsonReader(a)
        }))
    }
});
SYNO.API.Proxy = Ext.extend(Ext.util.Observable, {
    constructor: function(c) {
        c = c || {};
        Ext.apply(this, c);
        this.addEvents("exception", "beforeload", "loadexception");
        SYNO.API.Proxy.superclass.constructor.call(this);
        var b = Ext.data.Api.actions;
        this.activeRequest = {};
        for (var a in b) {
            if (b.hasOwnProperty(a)) {
                this.activeRequest[b[a]] = undefined
            }
        }
    },
    request: function(e, b, f, a, g, d, c) {
        if (false !== this.fireEvent("beforeload", this, f)) {
            this.doRequest.apply(this, arguments)
        } else {
            g.call(d || this, null, c, false)
        }
    },
    doRequest: function(f, b, g, a, h, e, c) {
        var d = {
            appWindow: this.appWindow
        };
        if (Ext.isObject(a.meta.compound) && Ext.isArray(a.meta.compound.params)) {
            d.compound = Ext.apply({}, a.meta.compound);
            if (Ext.isObject(g)) {
                d.compound.params.each(function(i) {
                    i.params = Ext.apply(i.params || {}, g)
                }, this)
            }
            g = {}
        }
        this.activeRequest[f] = SYNO.API.currentManager.requestAjaxAPI(this.api, this.method, this.version, d, g, Ext.createDelegate(this.onRequestAPI, this, [a, h, e, c, f], true));
        if (Ext.isEmpty(this.activeRequest[f])) {
            this.onRequestAPI(false, undefined, g, c, a, h, e, c, f)
        }
    },
    onRequestAPI: function(i, f, c, a, g, j, k, m, d) {
        this.activeRequest[d] = undefined;
        var l = null,
            b = null;
        if (i) {
            try {
                l = g.readRecords(f)
            } catch (h) {
                b = h;
                SYNO.Debug("Failed to read data, " + h)
            }
        }
        if (!i || b) {
            this.fireEvent("loadexception", this, m, f, b);
            this.fireEvent("exception", this, "response", Ext.data.Api.actions.read, m, f, b)
        } else {
            this.fireEvent("load", this, f, m)
        }
        j.call(k || this, l, m, i)
    }
});
SYNO.API.TreeLoader = Ext.extend(Ext.tree.TreeLoader, {
    load: function(b, c, a) {
        if (this.clearOnLoad) {
            while (b.firstChild) {
                b.removeChild(b.firstChild)
            }
        }
        if (this.doPreload(b)) {
            this.runCallback(c, a || b, [b])
        } else {
            if (this.directFn || (this.method && this.api)) {
                this.requestData(b, c, a || b)
            }
        }
    },
    requestData: function(b, c, a) {
        if (this.fireEvent("beforeload", this, b, c) !== false) {
            this.transId = this.doRequest.apply(this, arguments)
        } else {
            this.runCallback(c, a || b, [])
        }
    },
    doRequest: function(b, d, a) {
        var c = this.getParams(b);
        return SYNO.API.currentManager.requestAjaxAPI(this.api, this.method, this.version, {
            timeout: this.timeout,
            success: this.handleResponse,
            failure: this.handleFailure,
            scope: this,
            appWindow: this.appWindow || false,
            argument: {
                callback: d,
                node: b,
                scope: a
            }
        }, c, Ext.emptyFn)
    },
    processResponse: function(d, c, l, m) {
        var p = d.responseText;
        try {
            var a = d.responseData || Ext.decode(p);
            if (this.dataroot) {
                if (!Ext.isArray(this.dataroot)) {
                    this.dataroot = this.dataroot.split(",")
                }
                var g = this.dataroot;
                for (var k in g) {
                    if (g.hasOwnProperty(k)) {
                        a = a[g[k]]
                    }
                }
            }
            c.beginUpdate();
            for (var f = 0, h = a.length; f < h; f++) {
                var b = this.createNode(a[f], c);
                if (b) {
                    c.appendChild(b)
                }
            }
            c.endUpdate();
            this.runCallback(l, m || c, [c])
        } catch (j) {
            this.handleFailure(d)
        }
    }
});
SYNO.API.Form = {};
SYNO.API.Form.Traverse = function(g, a) {
    if (!g) {
        return
    }
    var f = g.elements || (document.forms[g] || Ext.getDom(g)).elements,
        b = false,
        c, e, d, h;
    Ext.each(f, function(i) {
        c = i.name;
        e = i.type;
        if (!(h = Ext.getCmp(i.id))) {
            return
        }
        if (Ext.isEmpty(c) && Ext.isFunction(h.getName)) {
            c = h.getName()
        }
        if (!i.disabled && c) {
            if (/select-(one|multiple)/i.test(e)) {
                Ext.each(i.options, function(j) {
                    if (j.selected) {
                        d = j.hasAttribute ? j.hasAttribute("value") : j.getAttributeNode("value").specified;
                        a(h, c, d ? j.value : j.text, e)
                    }
                })
            } else {
                if (!(/file|undefined|reset|button/i.test(e))) {
                    if (/radio/i.test(e) || h instanceof SYNO.ux.Radio) {
                        if (h.getValue()) {
                            a(h, c, h.getInputValue() || "", e)
                        }
                    } else {
                        if (/checkbox/i.test(e) || h instanceof SYNO.ux.Checkbox) {
                            a(h, c, h.getValue() ? true : false)
                        } else {
                            if (!(e == "submit" && b)) {
                                if (Ext.isFunction(h.getValue)) {
                                    a(h, c, h.getValue(), e)
                                } else {
                                    a(h, c, i.value, e)
                                }
                                b = /submit/i.test(e)
                            }
                        }
                    }
                }
            }
        }
    });
    return
};
SYNO.API.Form.Serialize = function(a, c) {
    var b = {};
    b = SYNO.API.Form.Retrieve(a, false, c);
    b = SYNO.API.DecodeFlatParams(b);
    b = SYNO.API.EncodeParams(b);
    return Ext.urlEncode(b)
};
SYNO.API.Form.Retrieve = function(b, e, d) {
    var a, f, c = {};
    SYNO.API.Form.Traverse(b, function(h, g, i) {
        if (d) {
            a = SYNO.ux.Utils.getFormFieldApi(h);
            if (!SYNO.ux.Utils.checkApiObjValid(a)) {
                return
            }
            if (d === "get" || d === "load") {
                f = a.method || a.methods.get
            } else {
                f = a.method || a.methods.set
            }
            g = a.api + "|" + f + "|" + a.version + "|" + g
        }
        c[g] = i
    });
    if (e) {
        c = SYNO.API.EncodeParams(c)
    }
    return c
};
SYNO.API.Form.Action = {};
SYNO.API.Form.Action.Load = Ext.extend(Ext.form.Action.Load, {
    run: function() {
        var d = this.options;
        var c = Ext.urlDecode(this.getParams());
        var b = this.form.webapi || this.form;
        var a = b.method || b.methods.get;
        SYNO.API.currentManager.requestAjaxAPI(b.api, a, b.version, Ext.apply(this.createCallback(d), {
            appWindow: this.form.appWindow,
            compound: d.compound,
            method: this.getMethod(),
            url: this.getUrl(false),
            headers: this.options.headers,
            encryption: this.form.encryption
        }), c, d.callback, d.scope)
    }
});
SYNO.API.Form.Action.Submit = Ext.extend(Ext.form.Action.Submit, {
    run: function() {
        var c = this.options;
        if (c.clientValidation === false || this.form.isValid()) {
            var e = Ext.urlDecode(this.getParams());
            var g = Ext.isBoolean(c.fileUpload) ? c.fileUpload : (this.form.fileUpload || (this.form.el && this.form.el.dom && (/multipart\/form-data/i.test(this.form.el.dom.getAttribute("enctype")))));
            var b = this.form.el ? this.form.el.dom : undefined;
            if (g) {
                var f = this.form.items,
                    a = function(l) {
                        if (!l.disabled && (l.inputType !== "file")) {
                            var k = l.getValue();
                            if (Ext.isBoolean(k)) {
                                e[l.getName()] = k
                            }
                            if (l.isComposite && l.rendered) {
                                l.items.each(a)
                            }
                        }
                    };
                f.each(a)
            } else {
                if (c.compound) {} else {
                    var d = SYNO.API.Form.Retrieve(b, false, "submit");
                    for (var i in d) {
                        if (d.hasOwnProperty(i)) {
                            e[i] = d[i]
                        }
                    }
                    e = SYNO.API.DecodeFlatParams(e)
                }
            }
            var h = this.form.webapi || this.form;
            var j = h.method || (h.methods ? h.methods.set : undefined);
            SYNO.API.currentManager.requestAjaxAPI(h.api, j, h.version, Ext.apply(this.createCallback(c), {
                appWindow: this.form.appWindow,
                compound: c.compound,
                form: g ? b : undefined,
                method: this.getMethod(),
                headers: c.headers,
                encryption: this.form.encryption
            }), e, c.callback, c.scope)
        } else {
            if (c.clientValidation !== false) {
                this.failureType = Ext.form.Action.CLIENT_INVALID;
                this.form.afterAction(this, false)
            }
        }
    }
});
SYNO.API.Form.BasicForm = Ext.extend(Ext.form.BasicForm, {
    doAction: function(b, a) {
        if (Ext.isString(b)) {
            if (b !== "load") {
                b = new SYNO.API.Form.Action.Submit(this, a)
            } else {
                b = new SYNO.API.Form.Action.Load(this, a)
            }
        }
        if (this.fireEvent("beforeaction", this, b) !== false) {
            this.beforeAction(b);
            b.run.defer(100, b)
        }
        return this
    },
    submit: function(c) {
        if (this.standardSubmit) {
            var e = {};
            var a = this.items,
                d = function(h) {
                    if (!h.disabled && (h.inputType !== "file")) {
                        var g = h.getValue();
                        if (Ext.isBoolean(g)) {
                            e[h.getName()] = g
                        }
                        if (h.isComposite && h.rendered) {
                            h.items.each(d)
                        }
                    }
                };
            a.each(d);
            var b = this.webapi || this;
            this.url = SYNO.API.GetBaseURL(Ext.apply(e, {
                api: b.api,
                method: b.method || b.methods.set,
                version: b.version
            }));
            return SYNO.API.Form.BasicForm.superclass.submit.call(this, c)
        }
        this.doAction("submit", c);
        return this
    },
    load: function(a) {
        this.doAction("load", a);
        return this
    },
    getValues: function(a, b) {
        if (a === true) {
            return SYNO.API.Form.Serialize(this.el.dom, b)
        }
        return SYNO.API.Form.Retrieve(this.el.dom, false, b)
    },
    loadRecords: function(c, b) {
        for (var a = 0; a < b.length; a++) {
            if (!c[a] || !b[a]) {
                break
            }
            if (!c[a].success) {
                continue
            }
            this.setFieldValues(c[a].data, b[a])
        }
    },
    setFieldValues: function(l, g) {
        var h, e, b, m, d, c, f, a;
        a = function(i) {
            if (this.trackResetOnLoad) {
                i.originalValue = i.getValue()
            }
        };
        if (Ext.isArray(l)) {
            for (d = 0, f = l.length; d < f; d++) {
                var k = l[d];
                m = this.findFields(k.id);
                for (c = 0; c < m.length; c++) {
                    h = m[c];
                    if (h) {
                        if (!SYNO.ux.Utils.checkFieldApiConsistency(h, g, "get")) {
                            continue
                        }
                        e = [h];
                        if ("radio" === h.inputType || h instanceof SYNO.ux.Radio) {
                            e = SYNO.ux.Utils.getRadioGroup(this, k.id)
                        }
                        h.setValue(k.value);
                        Ext.each(e, a, this)
                    }
                }
            }
        } else {
            for (b in l) {
                if (!Ext.isFunction(l[d])) {
                    m = this.findFields(b);
                    for (d = 0; d < m.length; d++) {
                        h = m[d];
                        if (!SYNO.ux.Utils.checkFieldApiConsistency(h, g, "get")) {
                            continue
                        }
                        e = [h];
                        if ("radio" === h.inputType || h instanceof SYNO.ux.Radio) {
                            e = SYNO.ux.Utils.getRadioGroup(this, b)
                        }
                        h.setValue(l[b]);
                        Ext.each(e, a, this)
                    }
                }
            }
        }
        return this
    },
    findFields: function(c) {
        var a = [];
        var b = function(d) {
            if (d.isFormField) {
                if (d.dataIndex == c || d.id == c || d.getName() == c) {
                    a.push(d);
                    return true
                } else {
                    if (d.isComposite) {
                        return d.items.each(b)
                    } else {
                        if (d instanceof Ext.form.CheckboxGroup && d.rendered) {
                            return d.eachItem(b)
                        }
                    }
                }
            }
        };
        this.items.each(b);
        return a
    }
});
SYNO.API.Form.FormPanel = Ext.extend(Ext.form.FormPanel, {
    createForm: function() {
        var a = Ext.applyIf({
            appWindow: this,
            listeners: {}
        }, this.initialConfig);
        return new SYNO.API.Form.BasicForm(null, a)
    }
});
SYNO.API.EncodeFlatParams = function(d) {
    var e = {};
    if (!d) {
        return e
    }
    var a = function(k, h, i) {
        for (var j in k) {
            if (k.hasOwnProperty(j)) {
                var g = k[j],
                    f = h ? (h + "|" + j) : j;
                if (Ext.isFunction(g)) {} else {
                    if (Ext.isObject(g)) {
                        a(k[j], f, i)
                    } else {
                        i[f] = g
                    }
                }
            }
        }
    };
    if (!Ext.isArray(d)) {
        a(d, undefined, e);
        return e
    }
    var c;
    for (var b = 0; b < c.length; b++) {
        if (c[b].api && c[b].method) {
            a(c[b], c[b].api + "|" + c[b].method, e)
        } else {
            a(d, undefined, e)
        }
    }
    return e
};
SYNO.API.DecodeFlatParams = function(b) {
    var d = {};
    var c = function(f, i, h) {
        var g = f.indexOf("|"),
            e;
        if (0 < g) {
            e = f.substring(0, g);
            if (!Ext.isObject(h[e])) {
                h[e] = {}
            }
            c(f.substring(g + 1), i, h[e])
        } else {
            h[f] = i
        }
    };
    for (var a in b) {
        if (!Ext.isObject(b[a])) {
            c(a, b[a], d)
        } else {
            d[a] = b[a]
        }
    }
    return d
};
SYNO.API.EscapeStr = function(a) {
    if (!a) {
        return ""
    }
    return a.replace(/[\\]/g, "\\\\").replace(/[,]/g, "\\,")
};
SYNO.API.EncodeParams = function(d) {
    var b = {};
    for (var a in d) {
        if (d.hasOwnProperty(a)) {
            b[a] = Ext.encode(d[a])
        }
    }
    return b
};
SYNO.API.DecodeParams = function(f) {
    var d = {};
    for (var a in f) {
        if (f.hasOwnProperty(a)) {
            try {
                d[a] = Ext.decode(f[a])
            } catch (b) {
                d[a] = SYNO.Util.copy(f[a])
            }
        }
    }
    return d
};
SYNO.API.Request = function(b) {
    if (!SYNO.API.currentManager) {
        var a;
        SYNO.API.currentManager = new SYNO.API.Manager();
        SYNO.API.currentManager.queryAPI("all", function() {
            a = SYNO.API.currentManager.requestAjaxAPI(b)
        }, this, false);
        return a
    }
    return SYNO.API.currentManager.requestAjaxAPI(b)
};
SYNO.API.GetBaseURL = function(e, a, b) {
    var d = e.appWindow,
        f = function() {
            if (SYNO.ux.Utils.checkApiObjValid(e) && SYNO.SDS.Utils.IsAllowRelay(d) && d.hasOpenConfig("cms_id")) {
                return SYNO.API.currentManager.getBaseURL({
                    api: "SYNO.CMS.DS",
                    version: 1,
                    method: "relay",
                    params: {
                        id: d.getOpenConfig("cms_id"),
                        timeout: d.getOpenConfig("cms_timeout") || 120,
                        webapi: Ext.apply({
                            api: e.api,
                            version: e.version,
                            method: e.method
                        }, e.params)
                    }
                }, a, b)
            } else {
                return SYNO.API.currentManager.getBaseURL(e, a, b)
            }
        };
    if (!SYNO.API.currentManager) {
        var c;
        SYNO.API.currentManager = new SYNO.API.Manager();
        SYNO.API.currentManager.queryAPI("all", function() {
            c = f()
        }, this, false);
        return c
    }
    return f()
};
SYNO.API.EncodeURL = function(a) {
    a = SYNO.API.EncodeParams(a);
    return Ext.urlEncode.apply(this, arguments)
};
SYNO.API.GetKnownAPI = function(a, b) {
    if (!SYNO.API.currentManager) {
        SYNO.API.currentManager = new SYNO.API.Manager();
        SYNO.API.currentManager.queryAPI("all", Ext.emptyFn, this, false)
    }
    return SYNO.API.currentManager.getKnownAPI(a, b)
};
SYNO.API.Util = {};
SYNO.API.Util.GetReqByAPI = function(e, d, h, b) {
    var c, g, f;
    if (!Ext.isObject(e)) {
        return
    }
    c = e.compound;
    if (Ext.isObject(c)) {
        if (!Ext.isArray(c.params)) {
            return
        }
        g = c.params;
        for (var a = 0; a < g.length; a++) {
            f = g[a];
            if (d === f.api && h === f.method) {
                if (b) {
                    return Ext.isObject(f.params) ? (Ext.isDefined(f.params[b]) ? f.params[b] : f[b]) : f[b]
                }
                return f
            }
        }
    } else {
        if (Ext.isObject(e.params)) {
            if (b) {
                return e.params[b]
            }
            return e.params
        }
    }
    return
};
SYNO.API.Util.GetReqByIndex = function(d, a, b) {
    var c, e;
    if (!Ext.isObject(d)) {
        return
    }
    c = d.compound;
    if (Ext.isObject(c)) {
        if (!Ext.isArray(c.params)) {
            return
        }
        e = c.params;
        if (!Ext.isObject(e[a])) {
            return
        }
        e = e[a];
        if (b) {
            return Ext.isObject(e.params) ? (Ext.isDefined(e.params[b]) ? e.params[b] : e[b]) : e[b]
        }
        return e
    } else {
        if (Ext.isObject(d.params)) {
            if (b) {
                return d.params[b]
            }
            return d.params
        }
    }
    return
};
SYNO.API.Util.GetValByAPI = function(f, d, g, c) {
    if (Ext.isObject(f)) {
        if (Ext.isArray(f.result)) {
            var a = f.result;
            for (var b = 0; b < a.length; b++) {
                if (d === a[b].api && g === a[b].method) {
                    var e = a[b].data || a[b].error;
                    if (!e) {
                        return
                    }
                    if (c) {
                        return e[c]
                    }
                    return e
                }
            }
            return
        } else {
            if (c) {
                return f[c]
            } else {
                return f
            }
        }
    }
    return
};
SYNO.API.Util.GetValByIndex = function(e, b, c) {
    var a;
    if (!Ext.isObject(e)) {
        return
    }
    a = e.result;
    if (Ext.isArray(a)) {
        if (!Ext.isObject(a[b])) {
            return
        }
        var d = a[b].data || a[b].error;
        if (!d) {
            return
        }
        if (c) {
            return d[c]
        }
        return d
    } else {
        if (c) {
            return e[c]
        } else {
            return e
        }
    }
};
SYNO.API.Util.GetFirstError = function(c) {
    var a;
    if (!Ext.isObject(c)) {
        return
    }
    if (Ext.isBoolean(c.has_fail)) {
        if (c.has_fail && Ext.isArray(c.result)) {
            a = c.result;
            for (var b = 0; b < a.length; b++) {
                if (Ext.isObject(a[b]) && !a[b].success) {
                    return a[b].error
                }
            }
        }
    }
    return c
};
SYNO.API.Util.GetFirstErrorIndex = function(c) {
    var a;
    if (!Ext.isObject(c)) {
        return
    }
    if (Ext.isBoolean(c.has_fail)) {
        if (c.has_fail && Ext.isArray(c.result)) {
            a = c.result;
            for (var b = 0; b < a.length; b++) {
                if (Ext.isObject(a[b]) && !a[b].success) {
                    return b
                }
            }
        }
    }
    return 0
};
SYNO.API.Request.Polling = Ext.extend(Ext.util.Observable, {
    api: "SYNO.Entry.Request.Polling",
    version: 1,
    local: "polling_local_instance",
    queue: null,
    pool: null,
    reg: null,
    pollingId: null,
    jsDebug: undefined,
    constructor: function() {
        SYNO.API.Request.Polling.superclass.constructor.apply(this, arguments);
        this.queue = {};
        this.pool = {};
        this.reg = {};
        this.jsDebug = Ext.urlDecode(location.search.substr(1)).jsDebug
    },
    getInterval: function(e, b) {
        var c, a = 0,
            d;
        if (Ext.isNumber(e.firstRunTime)) {
            a = parseInt(new Date().getTime() / 1000, 10) - e.firstRunTime
        }
        if (Ext.isNumber(b)) {
            c = b
        } else {
            if (Ext.isFunction(b)) {
                c = b.call(e.scope || this, a)
            } else {
                if (Ext.isArray(b)) {
                    for (d = 0; d < b.length; ++d) {
                        if (b[d].time > a) {
                            break
                        }
                        c = b[d].interval
                    }
                }
            }
        }
        if (!Ext.isNumber(c)) {
            return false
        }
        if (c < 1) {
            c = 1
        }
        return c
    },
    addToQueue: function(d, a) {
        var c = this.reg[d],
            b;
        if (Ext.isEmpty(c)) {
            return false
        }
        b = this.getInterval(c, a);
        if (!Ext.isNumber(b)) {
            SYNO.Debug("[Polling]Register " + d + " interval is invalid");
            return false
        }
        this.queue[d] = b;
        return true
    },
    addToPool: function(b, a, d) {
        var c = this.getInstanceName(d);
        if (Ext.isEmpty(this.pool[c + b])) {
            this.pool[c + b] = Ext.apply({
                register_id_list: [],
                auto_remove: false,
                finish: false
            }, a || {})
        }
    },
    addToRegister: function(d) {
        var a, b, c, e = Ext.id(undefined, "webapi_polling_register_id");
        if ((Ext.isEmpty(d.task_id) && Ext.isEmpty(d.webapi)) || !Ext.isFunction(d.status_callback)) {
            return
        }
        if (!Ext.isNumber(d.interval) && !Ext.isFunction(d.interval) && !Ext.isArray(d.interval)) {
            return
        }
        if (Ext.isEmpty(d.webapi)) {
            a = this.getTask(d.task_id, d.appWindow);
            if (Ext.isEmpty(a)) {
                return
            }
            a.register_id_list = a.register_id_list.concat(e)
        }
        b = parseInt(new Date().getTime() / 1000, 10);
        c = d.immediate ? b : b + this.getInterval(d, d.interval);
        this.reg[e] = Ext.apply({
            firstRunTime: c
        }, d);
        return e
    },
    getTask: function(a, c) {
        var b = this.getInstanceName(c);
        if (Ext.isEmpty(a)) {
            return
        }
        return this.pool[b + a]
    },
    updateTask: function(b, a, d) {
        var c = this.getTask(b, d) || {
            register_id_list: []
        };
        Ext.copyTo(c, a, "auto_remove,finish")
    },
    removeTask: function(a, d) {
        var b = this.getTask(a, d),
            c = this.getInstanceName(d);
        if (Ext.isEmpty(b)) {
            return false
        }
        if (Ext.isEmpty(b.register_id_list) || !Ext.isArray(b.register_id_list)) {
            delete this.pool[c + a];
            return true
        }
        b.register_id_list.each(function(e) {
            delete this.queue[e];
            delete this.reg[e]
        }, this);
        delete this.pool[c + a];
        return true
    },
    removeRegister: function(c) {
        var a, b;
        if (Ext.isEmpty(c) || Ext.isEmpty(this.reg[c])) {
            SYNO.Debug("[Polling]No such register id");
            return false
        }
        b = this.reg[c];
        if (Ext.isEmpty(b.webapi)) {
            a = this.getTask(b.task_id, b.appWindow);
            if (Ext.isEmpty(a)) {
                SYNO.Debug("[Polling]No such task");
                return false
            }
            a.register_id_list.remove(c)
        }
        b.status_callback = null;
        delete this.reg[c];
        return true
    },
    convertToTaskUser: function(b) {
        var a;
        if (Ext.isEmpty(b)) {
            a = _S("user")
        } else {
            if ("admin" == b) {
                a = "@administrators"
            } else {
                if ("everyone" == b) {
                    a = "@users"
                }
            }
        }
        return a
    },
    notifyTaskStatus: function(a, e, f, d) {
        var b, c;
        b = this.getTask(a, d.app);
        if (Ext.isEmpty(b)) {
            return
        }
        b.register_id_list.each(function(h) {
            c = this.reg[h];
            if (Ext.isEmpty(c) || !Ext.isFunction(c.status_callback)) {
                return
            }
            try {
                c.status_callback.call(c.scope || this, a, e, f, d)
            } catch (g) {
                SYNO.Debug(g)
            }
        }, this)
    },
    notifyWebAPIStatus: function(d, g, e, f, c) {
        var a = this.reg[d];
        if (Ext.isEmpty(a)) {
            return
        }
        if (Ext.isDefined(this.jsDebug)) {
            a.status_callback.call(a.scope || this, g, e, f, c)
        } else {
            try {
                a.status_callback.call(a.scope || this, g, e, f, c)
            } catch (b) {
                SYNO.Debug(b)
            }
        }
    },
    beginPolling: function(e) {
        var b, d, g, a, f = false,
            c = {};
        if ("halt" === e) {
            delete this.pollingHalt
        }
        for (d in this.queue) {
            if (this.queue.hasOwnProperty(d)) {
                b = this.reg[d];
                if (Ext.isEmpty(b)) {
                    delete this.queue[d];
                    continue
                }
                if (true === this.pollingHalt && true !== b.preventHalt) {
                    continue
                }
                this.queue[d]--;
                if (this.queue[d] > 0) {
                    continue
                }
                delete this.queue[d];
                if (!Ext.isFunction(b.status_callback)) {
                    continue
                }
                g = b.appWindow || false;
                if (g && true === g.isDestroyed && true !== g.keepPolling) {
                    this.removeRegister(d);
                    continue
                }
                a = this.getInstanceName(g);
                if (Ext.isEmpty(c[a])) {
                    c[a] = {
                        task_id_list: [],
                        webapi: [],
                        reg: [],
                        opts: [],
                        app: g
                    }
                }
                if (!Ext.isEmpty(b.webapi)) {
                    f = true;
                    c[a].webapi.push(b.webapi);
                    c[a].reg.push(d);
                    c[a].opts.push(b.webapi);
                    continue
                }
                if (Ext.isEmpty(this.getTask(b.task_id, b.appWindow))) {
                    continue
                }
                f = true;
                if (c[a].task_id_list.indexOf(b.task_id) < 0) {
                    c[a].task_id_list = c[a].task_id_list.concat(b.task_id)
                }
            }
        }
        this.endPolling();
        if (false === f) {
            this.pollingId = this.beginPolling.defer(1000, this);
            return
        }
        for (a in c) {
            if (c.hasOwnProperty(a)) {
                if (!Ext.isEmpty(c[a].task_id_list)) {
                    c[a].webapi.push({
                        api: this.api,
                        version: this.version,
                        method: "status",
                        params: {
                            task_id_list: c[a].task_id_list
                        }
                    });
                    c[a].reg.push("TASK");
                    c[a].opts.push({
                        app: c[a].app,
                        task_id_list: c[a].task_id_list
                    })
                }
                this.reqId = SYNO.API.Request({
                    compound: {
                        stop_when_error: false,
                        params: c[a].webapi
                    },
                    appWindow: c[a].app,
                    callback: this.pollingCompoundCallack,
                    reg_ref: c[a].reg,
                    opts_ref: c[a].opts,
                    timeout: 6000000,
                    scope: this
                })
            }
        }
    },
    endPolling: function(a) {
        if ("halt" === a) {
            this.pollingHalt = true;
            return
        }
        window.clearTimeout(this.pollingId);
        this.pollingId = null;
        if (!Ext.isEmpty(this.reqId)) {
            Ext.Ajax.abort(this.reqId);
            delete this.reqId
        }
    },
    collectToQueue: function(e, f) {
        var c = Ext.isArray(e) ? e : [],
            h, d, a, b, g = function(i) {
                i.each(function(k, j) {
                    d = this.reg[k];
                    if (Ext.isEmpty(d) || !Ext.isFunction(d.status_callback)) {
                        return
                    }
                    this.addToQueue(k, d.interval)
                }, this)
            };
        b = c.indexOf("TASK");
        if (-1 !== b) {
            h = f[b];
            c.splice(b, 1)
        }
        g.call(this, c);
        if (Ext.isObject(h) && Ext.isArray(h.task_id_list)) {
            h.task_id_list.each(function(i) {
                a = this.getTask(i, h.app);
                if (Ext.isEmpty(a)) {
                    return
                }
                if (true === a.finish) {
                    return
                }
                g.call(this, a.register_id_list)
            }, this)
        }
        if (Ext.isEmpty(this.pollingId)) {
            this.pollingId = this.beginPolling.defer(1000, this)
        }
    },
    pollingCompoundCallack: function(k, g, d, a) {
        var f, c, h, l, e, j, b;
        this.reqId = null;
        f = k ? g.result : [];
        c = a.reg_ref;
        h = a.opts_ref;
        if (c.length !== f.length) {
            this.collectToQueue(c, h);
            return
        }
        this.endPolling();
        for (e = 0; e < f.length; e++) {
            if (c[e] === "TASK") {
                this.pollingCallback(k, f[e].data, d.compound[e], h[e])
            } else {
                j = this.reg[c[e]];
                if (Ext.isEmpty(j)) {
                    continue
                }
                if (!Ext.isFunction(j.status_callback)) {
                    this.removeRegister(c[e]);
                    continue
                }
                b = j.appWindow || false;
                if (b && true === b.isDestroyed && true !== b.keepPolling) {
                    this.removeRegister(c[e]);
                    continue
                }
                l = f[e].success;
                this.notifyWebAPIStatus(c[e], l, l ? f[e].data : f[e].error, d.compound[e], h[e])
            }
        }
        this.collectToQueue(c, h)
    },
    pollingCallback: function(f, d, e, c) {
        var b, a;
        if (!f) {
            return
        }
        for (a in d) {
            if (d.hasOwnProperty(a)) {
                this.updateTask(a, d[a], c.app);
                b = this.getTask(a, c.app);
                if (Ext.isEmpty(b)) {
                    continue
                }
                this.notifyTaskStatus(a, d[a], e, c);
                if (b.finish && b.auto_remove) {
                    this.removeTask(a, c.app)
                }
            }
        }
    },
    list: function(a) {
        var c, b;
        b = Ext.apply({
            extra_group_tasks: [],
            task_id_prefix: "",
            callback: null
        }, a);
        if (!Ext.isArray(b.extra_group_tasks)) {
            SYNO.Debug("[Polling]Incorrect type parameter: extra_group_tasks");
            return
        }
        b.extra_group_tasks = b.extra_group_tasks.concat("user");
        c = Ext.copyTo({}, b, "extra_group_tasks,task_id_prefix");
        if (!Ext.isFunction(b.callback)) {
            SYNO.Debug("[Polling]No required parameter: callback");
            return
        }
        delete c.callback;
        delete c.scope;
        SYNO.API.Request({
            api: this.api,
            version: this.version,
            method: "list",
            params: c,
            appWindow: b.appWindow || false,
            callback: b.callback,
            scope: b.scope || this
        })
    },
    register: function(a) {
        var b;
        if ((Ext.isEmpty(a.task_id) && Ext.isEmpty(a.webapi)) || !Ext.isFunction(a.status_callback)) {
            SYNO.Debug("[Polling]register fail, no requried parameters");
            return
        }
        if (!Ext.isNumber(a.interval) && !Ext.isFunction(a.interval) && !Ext.isArray(a.interval)) {
            SYNO.Debug("[Polling]register fail, interval is invalid");
            return
        }
        if (!Ext.isEmpty(a.task_id)) {
            this.addToPool(a.task_id, {
                task_id: a.task_id
            }, a.appWindow)
        }
        b = this.addToRegister(a);
        if (true === a.immediate) {
            if (true === this.pollingHalt) {
                this.addToQueue(b, 0)
            } else {
                SYNO.API.Request(Ext.apply({
                    appWindow: a.appWindow,
                    callback: function(f, d, e, c) {
                        this.notifyWebAPIStatus(b, f, d, e, c);
                        this.addToQueue(b, a.interval)
                    },
                    scope: this
                }, a.webapi))
            }
        } else {
            this.addToQueue(b, a.interval)
        }
        return b
    },
    unregister: function(a) {
        return this.removeRegister(a)
    },
    getInstanceName: function(b) {
        var a = this.local;
        if (Ext.isObject(b) && SYNO.SDS.Utils.IsAllowRelay(b)) {
            if (b.hasOpenConfig("cms_id")) {
                a = "cms_ds_" + b.getOpenConfig("cms_id")
            }
        }
        return a
    }
});
SYNO.API.Request.Polling.InitInstance = function(a) {
    if (!a) {
        a = {}
    }
    if (Ext.isEmpty(a._Instance)) {
        a._Instance = new SYNO.API.Request.Polling();
        a._Instance.beginPolling()
    }
    return a._Instance
};
SYNO.API.Request.Polling.Instance = SYNO.API.Request.Polling.InitInstance(SYNO.API.Request.Polling.Instance);
SYNO.API.Request.Polling.List = function(a) {
    return SYNO.API.Request.Polling.Instance.list(a)
};
SYNO.API.Request.Polling.Register = function(a) {
    return SYNO.API.Request.Polling.Instance.register(a)
};
SYNO.API.Request.Polling.Unregister = function(a) {
    return SYNO.API.Request.Polling.Instance.unregister(a)
};
Ext.define("SYNO.API.Info", {
    extend: "Ext.util.Observable",
    local: "info_local",
    constructor: function() {
        this.callParent(arguments);
        this._session = {};
        this._define = {};
        this._knownAPI = {}
    },
    check: function(b) {
        var a;
        if (!Ext.isObject(b)) {
            throw "Error! appwindow is incorrect!"
        }
        if (!Ext.isFunction(b.findAppWindow)) {
            return
        }
        a = b.findAppWindow();
        if (!Ext.isObject(a) || !Ext.isObject(a.openConfig) || !Ext.isFunction(a.hasOpenConfig) || !Ext.isFunction(a.getOpenConfig) || !Ext.isFunction(a.setOpenConfig)) {
            return
        }
        return a
    },
    getInstName: function(c) {
        var b = this.local,
            a = this.check(c);
        if (Ext.isObject(a) && SYNO.SDS.Utils.IsAllowRelay(a)) {
            if (a.hasOpenConfig("cms_id")) {
                b = "cms_ds_" + a.getOpenConfig("cms_id")
            }
        }
        return b
    },
    getInstNameById: function(b) {
        var a = this.local;
        if (Ext.isNumber(b) && 0 <= b) {
            a = "cms_ds_" + b
        }
        return a
    },
    checkInst: function(d, a, b, c, e) {
        if (d === this.local) {
            return false
        }
        if (Ext.isObject(c) && Ext.isObject(b)) {
            this.handleResponse(a, b, c, e);
            return false
        }
        if (d in this._define && d in this._session && b !== true) {
            this.handleResponse({
                cms_id: 0
            }, undefined, undefined, e);
            return false
        }
        return true
    },
    updateInstById: function(b, a, e) {
        var d, c, f;
        if (Ext.isObject(b)) {
            c = b;
            b = c.cms_id;
            d = this.getInstNameById(c.cms_id);
            f = Ext.copyTo({}, c, "callback,args,scope")
        }
        if (false === this.checkInst(d, {
                cms_id: b
            }, a, e, f)) {
            return
        }
        SYNO.API.Request({
            api: "SYNO.CMS.DS",
            version: 1,
            method: "relay",
            timeout: 30000,
            params: {
                id: b,
                timeout: 30,
                webapi: {
                    api: "SYNO.API.Info",
                    version: 1,
                    method: "query"
                }
            },
            appOpt: f,
            cms_id: b,
            callback: function(j, h, i, g) {
                if (true !== j) {
                    this._knownAPI[d] = undefined
                } else {
                    this._knownAPI[d] = h
                }
            },
            scope: this
        });
        SYNO.API.Request({
            api: "SYNO.CMS.DS",
            version: 1,
            method: "relay",
            timeout: 30000,
            params: {
                id: b,
                timeout: 30,
                webapi: {
                    api: "SYNO.Entry.Request",
                    version: 1,
                    method: "request",
                    compound: [{
                        api: "SYNO.Core.System",
                        version: 1,
                        method: "info",
                        type: "define"
                    }, {
                        api: "SYNO.Core.System",
                        version: 1,
                        method: "info",
                        type: "session"
                    }]
                }
            },
            appOpt: f,
            cms_id: b,
            callback: this.onUpdateInst,
            scope: this
        })
    },
    updateInst: function(b, c, e) {
        var a = this.check(b),
            d = this.getInstName(b);
        if (false === this.checkInst(d, {
                appWindow: b
            }, c, e)) {
            return
        }
        a.sendWebAPI({
            api: "SYNO.API.Info",
            version: 1,
            method: "query",
            callback: function(i, g, h, f) {
                if (true !== i) {
                    this._knownAPI[d] = undefined
                } else {
                    this._knownAPI[d] = g
                }
            },
            scope: this
        });
        if (this._knownAPI.hasOwnProperty(d) && Ext.isEmpty(this._knownAPI[d])) {
            return
        }
        a.sendWebAPI({
            compound: {
                stopwhenerror: false,
                params: [{
                    api: "SYNO.Core.System",
                    version: 1,
                    method: "info",
                    params: {
                        type: "define"
                    }
                }, {
                    api: "SYNO.Core.System",
                    version: 1,
                    method: "info",
                    params: {
                        type: "session"
                    }
                }]
            },
            callback: this.onUpdateInst,
            scope: this
        })
    },
    checkUpdateResponse: function(e, c, d, a) {
        var b;
        if (Ext.isNumber(a.cms_id)) {
            b = this.getInstNameById(a.cms_id)
        } else {
            b = this.getInstName(a.appWindow)
        }
        if (!e) {
            SYNO.Debug("[INFO]Update session and define fail");
            return false
        }
        if (b === this.local) {
            return false
        }
        if (c.result.length !== 2) {
            SYNO.Debug("[INFO]Incorrect response:" + Ext.encode(c.result));
            return false
        }
        if (c.result[0].success === false || c.result[1].success === false) {
            delete this._session[b];
            delete this._define[b];
            return false
        }
        return true
    },
    onUpdateInst: function(d, b, c, a) {
        if (this.checkUpdateResponse(d, b, c, a)) {
            this.handleResponse(a, b.result[0].data, b.result[1].data, a.appOpt)
        } else {
            this.handleResponse({
                cms_id: 0
            }, undefined, undefined, a.appOpt)
        }
    },
    handleResponse: function(b, a, d, e) {
        var c;
        if (Ext.isNumber(b.cms_id)) {
            c = this.getInstNameById(b.cms_id)
        } else {
            c = this.getInstName(b.appWindow)
        }
        if (c !== this.local) {
            this._define[c] = Ext.apply({}, a);
            this._session[c] = Ext.apply({}, d)
        }
        if (Ext.isObject(e) && Ext.isFunction(e.callback)) {
            if (c in this._knownAPI) {
                e.callback.apply(e.scope || this, e.args)
            } else {
                e.callback.defer(1000, e.scope || this, e.args)
            }
        }
    },
    removeById: function(a) {
        var b = this.getInstNameById(a);
        if (b === this.local) {
            return
        }
        delete this._define[b];
        delete this._session[b];
        delete this._knownAPI[b]
    },
    getDefine: function(a, b, c) {
        var d = this.getInstName(a);
        if (d === this.local) {
            return _D(b, c)
        }
        if (Ext.isEmpty(this._session[d])) {
            this.updateInst(a);
            SYNO.Debug("Please update first");
            return
        }
        if (b in this._define[d]) {
            return this._define[d][b]
        }
        return Ext.isString(c) ? c : ""
    },
    getSession: function(a, b) {
        var c = this.getInstName(a);
        if (c === this.local) {
            return _S(b)
        }
        switch (b) {
            case "lang":
            case "isMobile":
            case "demo_mode":
            case "SynoToken":
                return _S(b);
            default:
                if (Ext.isEmpty(this._session[c])) {
                    this.updateInst(a);
                    SYNO.Debug("[Info]Please update first");
                    return
                } else {
                    return this._session[c][b]
                }
        }
    },
    getKnownAPI: function(a, b, d) {
        var c = this.getInstName(a);
        if (c === this.local) {
            return SYNO.API.GetKnownAPI(b, d)
        }
        if (Ext.isEmpty(this._knownAPI[c]) || Ext.isEmpty(this._knownAPI[c][b])) {
            this.updateInst(a);
            SYNO.Debug("[Info]Please update first");
            return
        }
        return this._knownAPI[c][b]
    }
});
SYNO.API.Info.InitInstance = function(a) {
    if (!a) {
        a = {}
    }
    if (Ext.isEmpty(a._Instance)) {
        a._Instance = new SYNO.API.Info()
    }
    return a._Instance
};
SYNO.API.Info.Instance = SYNO.API.Info.InitInstance(SYNO.API.Info.Instance);
SYNO.API.Info.GetSession = function(a, b) {
    return SYNO.API.Info.Instance.getSession(a, b)
};
SYNO.API.Info.GetDefine = function(a, b, c) {
    return SYNO.API.Info.Instance.getDefine(a, b, c)
};
SYNO.API.Info.GetKnownAPI = function(a, b, c) {
    return SYNO.API.Info.Instance.getKnownAPI(a, b, c)
};
SYNO.API.Info.Update = function(a, b, c) {
    return SYNO.API.Info.Instance.updateInst(a, b, c)
};
SYNO.API.Info.UpdateById = function(a) {
    return SYNO.API.Info.Instance.updateInstById(a)
};
SYNO.API.Info.RemoveById = function(a) {
    return SYNO.API.Info.Instance.removeById(a)
};
Ext.namespace("SYNO.API");
SYNO.API.AssignErrorStr = function(a) {
    a.minCustomeError = 400;
    a.common = {
        0: _T("common", "commfail"),
        100: _T("common", "error_system"),
        101: "Bad Request",
        102: "No Such API",
        103: "No Such Method",
        104: "Not Supported Version",
        105: _T("error", "error_privilege_not_enough"),
        106: _T("error", "error_timeout"),
        107: _T("login", "error_interrupt"),
        108: _T("user", "user_file_upload_fail"),
        109: _T("error", "error_error_system"),
        110: _T("error", "error_error_system"),
        111: _T("error", "error_error_system"),
        112: "Stop Handling Compound Request",
        113: "Invalid Compound Request",
        114: _T("error", "error_invalid"),
        115: _T("error", "error_invalid"),
        116: _JSLIBSTR("uicommon", "error_demo"),
        117: _T("error", "error_error_system"),
        118: _T("error", "error_error_system")
    };
    a.core = {
        402: _T("share", "no_such_share"),
        403: _T("error", "error_invalid"),
        404: _T("error", "error_privilege_not_enough"),
        1101: _T("error", "error_subject"),
        1102: _T("firewall", "firewall_restore_failed"),
        1103: _T("firewall", "firewall_restore_success"),
        1104: _T("firewall", "firewall_rule_exceed_max_number"),
        1105: _T("firewall", "firewall_rule_disable_fail"),
        1201: _T("error", "error_subject"),
        1202: _T("firewall", "firewall_tc_ceil_exceed_system_upper_bound"),
        1203: _T("firewall", "firewall_tc_max_ceil_too_large"),
        1204: _T("firewall", "firewall_tc_restore_failed"),
        1301: _T("error", "error_subject"),
        1302: _T("firewall", "firewall_dos_restore_failed"),
        1402: _T("service", "service_ddns_domain_load_error"),
        1410: _T("service", "service_ddns_operation_fail"),
        1500: _T("common", "error_system"),
        1501: _T("common", "error_apply_occupied"),
        1502: _T("routerconf", "routerconf_external_ip_warning"),
        1503: _T("routerconf", "routerconf_require_gateway"),
        1510: _T("routerconf", "routerconf_update_db_failed"),
        1521: _T("routerconf", "routerconf_exceed_singel_max_port"),
        1522: _T("routerconf", "routerconf_exceed_combo_max_port"),
        1523: _T("routerconf", "routerconf_exceed_singel_range_max_port"),
        1524: _T("routerconf", "routerconf_exceed_max_rule"),
        1525: _T("routerconf", "routerconf_port_conflict"),
        1526: _T("routerconf", "routerconf_add_port_failed"),
        1527: _T("routerconf", "routerconf_apply_failed"),
        1530: _T("routerconf", "routerconf_syntax_version_error"),
        1600: _T("error", "error_error_system"),
        1601: _T("error", "error_error_system"),
        1602: _T("error", "error_error_system"),
        1701: _T("error", "error_port_conflict"),
        1702: _T("error", "error_file_exist"),
        1703: _T("error", "error_no_path"),
        1704: _T("error", "error_error_system"),
        1706: _T("error", "error_volume_ro"),
        1903: _T("error", "error_port_conflict"),
        1904: _T("error", "error_port_conflict"),
        1905: _T("ftp", "ftp_annoymous_root_share_invalid"),
        1951: _T("error", "error_port_conflict"),
        2001: _T("error", "error_error_system"),
        2002: _T("error", "error_error_system"),
        2101: _T("error", "error_error_system"),
        2102: _T("error", "error_error_system"),
        2201: _T("error", "error_error_system"),
        2202: _T("error", "error_error_system"),
        2301: _T("error", "error_invalid"),
        2303: _T("error", "error_port_conflict"),
        2331: _T("nfs", "nfs_key_wrong_format"),
        2332: _T("user", "user_file_upload_fail"),
        2371: _T("error", "error_mount_point_nfs"),
        2401: _T("error", "error_error_system"),
        2402: _T("error", "error_error_system"),
        2403: _T("error", "error_port_conflict"),
        2500: _T("error", "error_unknown_desc"),
        2502: _T("error", "error_invalid"),
        2503: _T("error", "error_error_system"),
        2504: _T("error", "error_error_system"),
        2505: _T("error", "error_error_system"),
        2601: _T("network", "domain_name_err"),
        2602: _T("network", "domain_dns_name_err"),
        2603: _T("network", "domain_kdc_ip_error"),
        2604: _T("network", "error_badgname"),
        2605: _T("network", "domain_unreachserver_err"),
        2606: _T("network", "domain_port_unreachable_err"),
        2607: _T("network", "domain_password_err"),
        2608: _T("network", "domain_acc_revoked_ads"),
        2609: _T("network", "domain_acc_revoked_rpc"),
        2610: _T("network", "domain_acc_err"),
        2611: _T("network", "domain_notadminuser"),
        2612: _T("network", "domain_change_passwd"),
        2613: _T("network", "domain_check_kdcip"),
        2614: _T("network", "domain_error_misc_rpc"),
        2615: _T("network", "domain_join_err"),
        2616: _T("directory_service", "warr_enable_samba"),
        2702: _T("network", "status_connected"),
        2703: _T("network", "status_disconnected"),
        2704: _T("common", "error_occupied"),
        2705: _T("common", "error_system"),
        2706: _T("ldap_error", "ldap_invalid_credentials"),
        2707: _T("ldap_error", "ldap_operations_error"),
        2708: _T("ldap_error", "ldap_server_not_support"),
        2709: _T("domain", "domain_ldap_conflict"),
        2710: _T("ldap_error", "ldap_operations_error"),
        2712: _T("ldap_error", "ldap_no_such_object"),
        2713: _T("ldap_error", "ldap_protocol_error"),
        2714: _T("ldap_error", "ldap_invalid_dn_syntax"),
        2715: _T("ldap_error", "ldap_insufficient_access"),
        2716: _T("ldap_error", "ldap_insufficient_access"),
        2717: _T("ldap_error", "ldap_timelimit_exceeded"),
        2718: _T("ldap_error", "ldap_inappropriate_auth"),
        2719: _T("ldap_error", "ldap_smb2_enable_warning"),
        2799: _T("common", "error_system"),
        2800: _T("error", "error_unknown_desc"),
        2801: _T("error", "error_unknown_desc"),
        2900: _T("error", "error_unknown_desc"),
        2901: _T("error", "error_unknown_desc"),
        2902: _T("relayservice", "relayservice_err_network"),
        2903: _T("relayservice", "error_alias_server_internal"),
        2904: _T("relayservice", "relayservice_err_alias_in_use"),
        2905: _T("pkgmgr", "myds_error_account"),
        2906: _T("relayservice", "error_alias_used_in_your_own"),
        3000: _T("error", "error_unknown_desc"),
        3001: _T("error", "error_unknown_desc"),
        3002: _T("relayservice", "relayservice_err_network"),
        3003: _T("relayservice", "myds_server_internal_error"),
        3004: _T("error", "error_auth"),
        3005: _T("relayservice", "relayservice_err_alias_in_use"),
        3006: _T("relayservice", "myds_exceed_max_register_error"),
        3009: _T("error", "error_unknown_desc"),
        3010: _T("myds", "already_logged_in"),
        3013: _T("myds", "error_migrate_authen"),
        3106: _T("user", "no_such_user"),
        3107: _T("user", "error_nameused"),
        3108: _T("user", "error_nameused"),
        3109: _T("user", "error_disable_admin"),
        3110: _T("user", "error_too_much_user"),
        3111: _T("user", "homes_not_found"),
        3112: _T("common", "error_apply_occupied"),
        3113: _T("common", "error_occupied"),
        3114: _T("user", "error_nameused"),
        3115: _T("user", "user_cntrmvdefuser"),
        3116: _T("user", "user_set_fail"),
        3117: _T("user", "user_quota_set_fail"),
        3118: _T("common", "error_no_enough_space"),
        3119: _T("user", "error_home_is_moving"),
        3191: _T("user", "user_file_open_fail"),
        3192: _T("user", "user_file_empty"),
        3193: _T("user", "user_file_not_utf8"),
        3194: _T("user", "user_upload_no_volume"),
        3202: _T("common", "error_occupied"),
        3204: _T("group", "failed_load_group"),
        3205: _T("group", "failed_load_group"),
        3206: _T("group", "error_nameused"),
        3207: _T("group", "error_nameused"),
        3208: _T("group", "error_badname"),
        3209: _T("group", "error_toomanygr"),
        3210: _T("group", "error_rmmember"),
        3221: _T("share", "error_too_many_acl_rules"),
        3299: _T("common", "error_system"),
        3301: _T("share", "share_already_exist"),
        3302: _T("share", "share_acl_volume_not_support"),
        3303: _T("share", "error_encrypt_reserve"),
        3304: _T("share", "error_volume_not_found"),
        3305: _T("share", "error_badname"),
        3308: _T("common", "err_pass"),
        3309: _T("share", "error_toomanysh"),
        3313: _T("share", "error_volume_not_found"),
        3314: _T("share", "error_volume_read_only"),
        3319: _T("share", "error_nameused"),
        3320: _T("share", "share_space_not_enough"),
        3321: _T("share", "error_too_many_acl_rules"),
        3322: _T("share", "mount_point_not_empty"),
        3323: _T("error", "error_mount_point_change_vol"),
        3324: _T("error", "error_mount_point_rename"),
        3326: _T("common", "err_pass"),
        3327: _T("share", "share_conflict_on_new_volume"),
        3328: _T("share", "get_lock_failed"),
        3329: _T("share", "error_toomanysnapshot"),
        3400: _T("error", "error_error_system"),
        3401: _T("error", "error_error_system"),
        3402: _T("error", "error_error_system"),
        3500: _T("error", "error_invalid"),
        3501: _T("common", "error_badport"),
        3502: _T("ftp", "ftp_port_in_used"),
        3510: _T("error", "error_invalid"),
        3511: _T("app_port_alias", "err_port_dup"),
        3550: _T("volume", "volume_no_volumes"),
        3551: _T("error", "error_no_shared_folder"),
        3552: _T("volume", "volume_crashed_service_disable").replace("_SERVICE_", _T("common", "web_station")),
        3553: _T("volume", "volume_expanding_waiting"),
        3554: _T("error", "error_port_conflict"),
        3555: _T("common", "error_badport"),
        3603: _T("volume", "volume_share_volumeno"),
        3604: _T("error", "error_space_not_enough"),
        3605: _T("usb", "usb_printer_driver_fail"),
        3606: _T("login", "error_cantlogin"),
        3607: _T("common", "error_badip"),
        3608: _T("usb", "net_prntr_ip_exist_error"),
        3609: _T("usb", "net_prntr_ip_exist_unknown"),
        3610: _T("common", "error_demo"),
        3611: _T("usb", "net_prntr_name_exist_error"),
        3700: _T("error", "error_invalid"),
        3701: _T("status", "status_not_available"),
        3702: _T("error", "error_invalid"),
        3710: _T("status", "status_not_available"),
        3711: _T("error", "error_invalid"),
        3712: _T("cms", "fan_mode_not_supported"),
        3720: _T("status", "status_not_available"),
        3721: _T("error", "error_invalid"),
        3730: _T("status", "status_not_available"),
        3731: _T("error", "error_invalid"),
        3740: _T("status", "status_not_available"),
        3741: _T("error", "error_invalid"),
        3750: _T("status", "status_not_available"),
        3751: _T("error", "error_invalid"),
        3760: _T("status", "status_not_available"),
        3761: _T("error", "error_invalid"),
        3800: _T("error", "error_invalid"),
        3801: _T("error", "error_invalid"),
        4000: _T("error", "error_invalid"),
        4001: _T("error", "error_error_system"),
        4002: _T("dsmoption", "error_format"),
        4003: _T("dsmoption", "error_size"),
        4100: _T("error", "error_invalid"),
        4101: _T("error", "error_invalid"),
        4102: _T("app_port_alias", "err_alias_refused"),
        4103: _T("app_port_alias", "err_alias_used"),
        4104: _T("app_port_alias", "err_port_used"),
        4300: _T("error", "error_error_system"),
        4301: _T("error", "error_error_system"),
        4302: _T("error", "error_error_system"),
        4303: _T("error", "error_invalid"),
        4304: _T("error", "error_error_system"),
        4305: _T("error", "error_error_system"),
        4306: _T("error", "error_error_system"),
        4307: _T("error", "error_error_system"),
        4308: _T("error", "error_error_system"),
        4309: _T("error", "error_invalid"),
        4310: _T("error", "error_error_system"),
        4311: _T("network", "interface_not_found"),
        4312: _T("tcpip", "tcpip_ip_used"),
        4313: _T("tcpip", "ipv6_ip_used"),
        4314: _T("tunnel", "tunnel_conn_fail"),
        4315: _T("tcpip", "ipv6_err_link_local"),
        4316: _T("network", "error_applying_network_setting"),
        4320: _T("vpnc", "name_conflict"),
        4321: _T("service", "service_illegel_crt"),
        4322: _T("service", "service_illegel_key"),
        4323: _T("service", "service_ca_not_utf8"),
        4324: _T("service", "service_unknown_cipher"),
        4325: _T("vpnc", "l2tp_conflict"),
        4326: _T("vpnc", "vpns_conflict"),
        4340: _T("background_task", "task_processing"),
        4350: _T("tcpip", "ipv6_invalid_config"),
        4351: _T("tcpip", "ipv6_router_bad_lan_req"),
        4352: _T("tcpip", "ipv6_router_err_enable"),
        4353: _T("tcpip", "ipv6_router_err_disable"),
        4354: _T("tcpip", "ipv6_no_public_ip"),
        4500: _T("error", "error_error_system"),
        4501: _T("error", "error_error_system"),
        4502: _T("pkgmgr", "pkgmgr_space_not_ready"),
        4503: _T("error", "volume_creating"),
        4504: _T("pkgmgr", "error_sys_no_space"),
        4520: _T("error", "error_space_not_enough"),
        4521: _T("pkgmgr", "pkgmgr_file_not_package"),
        4522: _T("pkgmgr", "broken_package"),
        4529: _T("pkgmgr", "pkgmgr_pkg_cannot_upgrade"),
        4530: _T("pkgmgr", "error_occupied"),
        4531: _T("pkgmgr", "pkgmgr_not_syno_publish"),
        4532: _T("pkgmgr", "pkgmgr_unknown_publisher"),
        4533: _T("pkgmgr", "pkgmgr_cert_expired"),
        4534: _T("pkgmgr", "pkgmgr_cert_revoked"),
        4535: _T("pkgmgr", "broken_package"),
        4540: _T("pkgmgr", "pkgmgr_file_install_failed"),
        4541: _T("pkgmgr", "upgrade_fail"),
        4542: _T("error", "error_error_system"),
        4543: _T("pkgmgr", "pkgmgr_file_not_package"),
        4544: _T("pkgmgr", "pkgmgr_pkg_install_already"),
        4545: _T("pkgmgr", "pkgmgr_pkg_not_available"),
        4548: _T("pkgmgr", "install_version_less_than_limit"),
        4549: _T("pkgmgr", "depend_cycle"),
        4580: _T("pkgmgr", "pkgmgr_pkg_start_failed"),
        4581: _T("pkgmgr", "pkgmgr_pkg_stop_failed"),
        4600: _T("error", "error_error_system"),
        4601: _T("error", "error_error_system"),
        4631: _T("error", "error_error_system"),
        4632: _T("error", "error_error_system"),
        4633: _T("error", "error_error_system"),
        4634: _T("error", "error_error_system"),
        4635: _T("error", "error_error_system"),
        4661: _T("pushservice", "error_update_ds_info"),
        4800: _T("error", "error_invalid"),
        4801: _T("error", "error_error_system"),
        4802: _T("error", "error_error_system"),
        4803: _T("error", "error_error_system"),
        4804: _T("error", "error_error_system"),
        4900: _T("error", "error_invalid"),
        4901: _T("error", "error_error_system"),
        4902: _T("user", "no_such_user"),
        4903: _T("report", "err_dest_share_not_exist"),
        4904: _T("error", "error_file_exist"),
        5000: _T("error", "error_invalid"),
        5001: _T("error", "error_invalid"),
        5002: _T("error", "error_invalid"),
        5003: _T("error", "error_invalid"),
        5004: _T("error", "error_invalid"),
        5005: _T("syslog", "err_server_disconnected"),
        5006: _T("syslog", "service_ca_copy_failed"),
        5007: _T("syslog", "service_ca_copy_failed"),
        5008: _T("error", "error_invalid"),
        5009: _T("error", "error_port_conflict"),
        5010: _T("syslog", "warn_storage_removed"),
        5011: _T("error", "error_invalid"),
        5012: _T("syslog", "err_name_conflict"),
        5100: _T("error", "error_invalid"),
        5101: _T("error", "error_invalid"),
        5102: _T("error", "error_invalid"),
        5103: _T("error", "error_invalid"),
        5104: _T("error", "error_invalid"),
        5105: _T("error", "error_invalid"),
        5106: _T("error", "error_invalid"),
        5202: _T("update", "error_apply_lock"),
        5203: _T("volume", "volume_busy_waiting"),
        5205: _T("update", "error_bad_dsm_version"),
        5206: _T("update", "update_notice"),
        5207: _T("update", "error_model"),
        5208: _T("update", "error_apply_lock"),
        5211: _T("update", "upload_err_no_space"),
        5213: _T("pkgmgr", "error_occupied"),
        5215: _T("error", "error_space_not_enough"),
        5216: _T("error", "error_fs_ro"),
        5217: _T("error", "error_dest_no_path"),
        5219: _T("update", "autoupdate_cancel_failed_running"),
        5220: _T("update", "autoupdate_cancel_failed_no_task"),
        5221: _T("update", "autoupdate_cancel_failed"),
        5300: _T("error", "error_invalid"),
        5301: _T("user", "no_such_user"),
        5510: _T("service", "service_illegel_crt"),
        5511: _T("service", "service_illegel_key"),
        5512: _T("service", "service_illegal_inter_crt"),
        5513: _T("service", "service_unknown_cypher"),
        5514: _T("service", "service_key_not_match"),
        5515: _T("service", "service_ca_copy_failed"),
        5516: _T("service", "service_ca_not_utf8"),
        5517: _T("certificate", "inter_and_crt_verify_error"),
        5518: _T("certificate", "not_support_dsa"),
        5519: _T("service", "service_illegal_csr"),
        5600: _T("error", "error_no_path"),
        5601: _T("file", "error_bad_file_content"),
        5602: _T("error", "error_error_system"),
        5603: _T("texteditor", "LoadFileFail"),
        5604: _T("texteditor", "SaveFileFail"),
        5605: _T("error", "error_privilege_not_enough"),
        5606: _T("texteditor", "CodepageConvertFail"),
        5607: _T("texteditor", "AskForceSave"),
        5608: _WFT("error", "error_encryption_long_path"),
        5609: _WFT("error", "error_long_path"),
        5610: _WFT("error", "error_quota_not_enough"),
        5611: _WFT("error", "error_space_not_enough"),
        5612: _WFT("error", "error_io"),
        5613: _WFT("error", "error_privilege_not_enough"),
        5614: _WFT("error", "error_fs_ro"),
        5615: _WFT("error", "error_file_exist"),
        5616: _WFT("error", "error_no_path"),
        5617: _WFT("error", "error_dest_no_path"),
        5618: _WFT("error", "error_testjoin"),
        5619: _WFT("error", "error_reserved_name"),
        5620: _WFT("error", "error_fat_reserved_name"),
        5621: _T("texteditor", "exceed_load_max"),
        5703: _T("time", "ntp_service_disable_warning"),
        5800: _T("error", "error_invalid"),
        5801: _T("share", "no_such_share"),
        5901: _T("error", "error_subject"),
        5902: _T("firewall", "firewall_vpnpassthrough_restore_failed"),
        5903: _T("firewall", "firewall_vpnpassthrough_specific_platform"),
        6000: _T("error", "error_error_system"),
        6001: _T("error", "error_error_system"),
        6002: _T("error", "error_error_system"),
        6003: _T("error", "error_error_system"),
        6004: _T("common", "loadsetting_fail"),
        6005: _T("error", "error_subject"),
        6006: _T("error", "error_service_start_failed"),
        6007: _T("error", "error_service_stop_failed"),
        6008: _T("error", "error_service_start_failed"),
        6009: _T("firewall", "firewall_save_failed"),
        6010: _T("common", "error_badip"),
        6011: _T("common", "error_badip"),
        6012: _T("common", "error_badip"),
        6013: _T("share", "no_such_share"),
        6014: _T("cms", "cms_no_volumes"),
        6200: _T("error", "error_error_system"),
        6201: _WFT("error", "error_acl_volume_not_support"),
        6202: _WFT("error", "error_fat_privilege"),
        6203: _WFT("error", "error_remote_privilege"),
        6204: _WFT("error", "error_fs_ro"),
        6205: _WFT("error", "error_privilege_not_enough"),
        6206: _WFT("error", "error_no_path"),
        6207: _WFT("error", "error_no_path"),
        6208: _WFT("error", "error_testjoin"),
        6209: _WFT("error", "error_privilege_not_enough"),
        6210: _WFT("acl_editor", "admin_cannot_set_acl_perm"),
        6211: _WFT("acl_editor", "error_invalid_user_or_group"),
        6212: _WFT("error", "error_acl_mp_not_support"),
        6213: _WFT("acl_editor", "quota_exceeded")
    }
};
SYNO.API.Erros = {};
SYNO.API.AssignErrorStr(SYNO.API.Erros);
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
SYNO.SDS.onBeforeUnload = function() {
    var a = SYNO.SDS.onBasicBeforeUnload() || ((false === SYNO.SDS.UserSettings.getProperty("Desktop", "disableLogoutConfirm")) ? _T("desktop", "confirm_unload") : undefined);
    if (SYNO.SDS.StatusNotifier.fireEvent("beforeunload") === false) {
        return _T("desktop", "confirm_leave")
    }
    if (a) {
        return a
    }
    return
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
    SYNO.SDS.Config.AutoLaunchFnList.each(function(b) {
        var a = (SYNO.SDS.Config.FnMap[b] && SYNO.SDS.Config.FnMap[b].config) ? SYNO.SDS.Config.FnMap[b].config : {},
            e = a.canLaunch,
            c, d;
        if (Ext.isObject(e)) {
            for (c in e) {
                if (!!_S(c) !== e[c]) {
                    return
                }
            }
        }
        d = SYNO.SDS.AppMgr.getByAppName(b);
        if (d.length === 0) {
            SYNO.SDS.AppLaunch(b, {}, false)
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
    var a = SYNO.SDS.UserSettings.getProperty("Desktop", "restoreParams") || [];
    if ((true === _S("is_admin")) && _S("ha_running")) {
        SYNO.SDS.AppLaunch("SYNO.SDS.HA.Instance")
    }
    SYNO.SDS.AutoLaunch();
    Ext.each(a, function(b) {
        SYNO.SDS.AppLaunch(b.className, Ext.apply({
            fromRestore: true
        }, b.params), true)
    });
    SYNO.SDS.UserSettings.removeProperty("Desktop", "restoreParams")
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
            SYNO.SDS.CheckBadge()
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
    SYNO.SDS.UploadTaskMgr = new SYNO.SDS._BackgroundTaskMgr();
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
    SYNO.SDS.BackgroundTaskMgr = new SYNO.SDS._BackgroundTaskMgr();
    SYNO.SDS.UploadTaskMgr = new SYNO.SDS._BackgroundTaskMgr();
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
    if (!a && _S("is_admin")) {
        SYNO.SDS.LaunchFullSizeApps.start();
        SYNO.SDS.HideDesktop()
    }
    SYNO.SDS.PreviewBox = new SYNO.SDS._PreviewBox();
    SYNO.SDS.SearchBox = new SYNO.SDS._SearchBox();
    window.onbeforeunload = SYNO.SDS.onBeforeUnload;
    SYNO.SDS.StatusNotifier.on("thirdpartychanged", SYNO.SDS.reloadJSConfig);
    SYNO.SDS.StatusNotifier.on("halt", function() {
        var b = Ext.getClassByName("SYNO.API.Request.Polling.Instance");
        SYNO.SDS.TaskMgr.setHalt(true);
        if (Ext.isObject(b) && Ext.isFunction(b.endPolling)) {
            b.endPolling("halt")
        }
    });
    if (!a && _S("is_admin")) {
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
Ext.onReady(function() {
    var a = function(h) {
        if (h.getTarget(".selectabletext")) {
            return true
        }
        if (h.getTarget("textarea")) {
            return true
        }
        var g = h.getTarget("input"),
            f = (g && g.type) ? g.type.toLowerCase() : "";
        if ("text" !== f && "textarea" !== f && "password" !== f) {
            return false
        }
        if (g.readOnly) {
            return false
        }
        return true
    };
    var c = function(h) {
        var g = h.getTarget("input"),
            f = (g && g.type) ? g.type.toLowerCase() : "";
        if (h.getTarget("textarea")) {
            return true
        }
        if ("text" !== f && "password" !== f) {
            return false
        }
        return true
    };
    var b = function() {
        SYNO.SDS.initData();
        if (Ext.util.Cookies.get("stay_login") == "1") {
            var g = new Date();
            g.setDate(g.getDate() + 30);
            var f = Ext.util.Cookies.get("id");
            Ext.util.Cookies.set("id", f, g)
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
        Ext.getDoc().on("selectstart", function(f) {
            if (!a(f)) {
                f.stopEvent()
            }
        })
    }
    Ext.getDoc().on("keydown", function(f) {
        if (f.ctrlKey && f.A === f.getKey() && !a(f)) {
            f.stopEvent()
        }
        if (f.BACKSPACE === f.getKey() && !c(f)) {
            f.preventDefault()
        }
        if (Ext.isIE && f.ESC === f.getKey() && c(f)) {
            f.preventDefault()
        }
    });
    Ext.getBody().on("contextmenu", function(f) {
        if (!a(f) && !f.getTarget(".allowDefCtxMenu")) {
            f.stopEvent()
        }
    });
    Ext.Ajax.on("requestcomplete", function(g, i, f) {
        try {
            if (SYNO.SDS.Utils.CheckServerError(i)) {
                g.purgeListeners();
                delete f.success;
                delete f.failure;
                delete f.callback
            }
        } catch (h) {
            if (!Ext.isIE8) {
                throw h
            }
        }
    });
    if (SYNO.SDS.HTML5Utils.isSupportHTML5Upload()) {
        Ext.getBody().on("dragover", function(f) {
            if (SYNO.SDS.HTML5Utils.isDragFile(f.browserEvent)) {
                f.preventDefault();
                f.browserEvent.dataTransfer.dropEffect = "none"
            }
        })
    }
    if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
        window.alert(_T("desktop", "upgrade_ie_browser"))
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
    SYNO.API.currentManager.queryAPI("all");
    SYNO.SDS.UIFeatures.IconSizeManager.addHDClsAndCSS(_S("SynohdpackStatus"));
    var e, d;
    if (typeof(SYNO.SDS.ForgetPass) !== "undefined") {
        e = new SYNO.SDS.ChangePassDialog({})
    } else {
        if (_S("isLogined")) {
            if (_S("preview")) {
                if (_S("preview_modified")) {
                    e = new SYNO.SDS.LoginApplyPreviewForm({})
                }
                d = new SYNO.SDS.LoginDialog({
                    preview: true,
                    showWeather: false
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
            d = new SYNO.SDS.LoginDialog({
                showWeather: false
            })
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
Ext.namespace("SYNO.SDS.Utils");
(function() {
    var h = "width: auto;";
    var g = "display: inline;";
    var e = "text-align: left;";
    var d = "overflow: hidden;";
    var b = d + g + e;
    var a = h + "margin-right: 5px;" + g + e;
    var i = b + "width: 0px; visibility: hidden;";
    var c = function(j, k) {
        if (undefined === k) {
            return String.format("margin-left: {0}px;", j)
        } else {
            return String.format("width: {0}px; margin-left: {1}px", k - j, j)
        }
    };
    var f = 167;
    Ext.apply(SYNO.SDS.Utils, {
        labelStyleL0: b + c(0, f),
        labelStyleL1: b + c(Ext.isIE ? 19 : 17, f),
        labelStyleL2: b + c(Ext.isIE ? 36 : 34, f),
        labelStyleL0Auto: a,
        labelStyleL1Auto: a + c(Ext.isIE ? 19 : 17),
        labelStyleL2Auto: a + c(Ext.isIE ? 36 : 34),
        labelStyleL0Hidden: i + c(0),
        labelStyleL1Hidden: i + c(Ext.isIE ? 16 : 14)
    })
})();
SYNO.SDS.Utils.FieldFind = function(b, a) {
    var c = b.findField(a);
    if (c === null) {
        c = Ext.getCmp(a)
    }
    return c
};
SYNO.SDS.Utils.EnableRadioGroup = Ext.extend(Object, {
    constructor: function(e, d, a) {
        this.form = e;
        this.members = a;
        var g = SYNO.SDS.Utils.getRadioGroup(e, d);
        for (var c = 0; c < g.length; c++) {
            var b = g[c];
            var f = b.el.dom.value;
            if (f in a) {
                b.mon(b, "check", this.onRadioCheck, this);
                b.mon(b, "enable", this.onRadioEnable, this, {
                    delay: 50
                });
                b.mon(b, "disable", this.onRadioEnable, this, {
                    delay: 50
                })
            }
        }
    },
    onRadioEnable: function(c) {
        var e = c.getRawValue();
        var a = this.members[e];
        var d = c.getValue();
        var b = d && (!c.disabled);
        Ext.each(a, function(g) {
            var h = SYNO.SDS.Utils.FieldFind(this.form, g);
            h.setDisabled(!b);
            if (Ext.isFunction(h.clearInvalid)) {
                h.clearInvalid()
            }
        }, this)
    },
    onRadioCheck: function(b, c) {
        var d = b.getRawValue();
        var a = this.members[d];
        Ext.each(a, function(e) {
            var g = SYNO.SDS.Utils.FieldFind(this.form, e);
            g.setDisabled(!c);
            if (Ext.isFunction(g.clearInvalid)) {
                g.clearInvalid()
            }
        }, this)
    }
});
SYNO.SDS.Utils.EnableCheckGroup = Ext.extend(Object, {
    constructor: function(c, b, f, e, a) {
        var d = SYNO.SDS.Utils.FieldFind(c, b);
        e = typeof(e) != "undefined" ? e : [];
        a = Ext.isDefined(a) ? a : {};
        this.enable_fields = f;
        this.disable_fields = e;
        this.config = a;
        this.form = c;
        d.mon(d, "check", this.checkHandler, this);
        d.mon(d, "enable", this.enableHandler, this, {
            delay: 50
        });
        d.mon(d, "disable", this.enableHandler, this, {
            delay: 50
        });
        this.checkHandler(d, d.getValue())
    },
    setFieldStatus: function(d, g, c, a) {
        var f, e, b;
        if (g.inputType == "radio") {
            f = SYNO.SDS.Utils.getRadioGroup(d, g.getName());
            for (b = 0; b < f.length; b++) {
                if (a) {
                    e = c ? f[b].disable() : f[b].enable()
                } else {
                    e = c ? f[b].enable() : f[b].disable()
                }
                if (Ext.isFunction(f[b].clearInvalid)) {
                    f[b].clearInvalid()
                }
            }
        } else {
            if (a) {
                e = c ? g.disable() : g.enable()
            } else {
                e = c ? g.enable() : g.disable()
            }
            if (Ext.isFunction(g.clearInvalid)) {
                g.clearInvalid()
            }
        }
    },
    enableField: function(b, c, a) {
        this.setFieldStatus(b, c, a, false)
    },
    IsNeedDisableGroup: function(a) {
        if (true === this.config.disable_group && true === a) {
            return true
        }
        return false
    },
    checkHandler: function(c, b) {
        var a, d;
        var e = this.IsNeedDisableGroup(c.disabled);
        for (a = 0; a < this.enable_fields.length; a++) {
            d = SYNO.SDS.Utils.FieldFind(this.form, this.enable_fields[a]);
            if (e) {
                this.enableField(this.form, d, false)
            } else {
                this.setFieldStatus(this.form, d, b, false)
            }
        }
        for (a = 0; a < this.disable_fields.length; a++) {
            d = SYNO.SDS.Utils.FieldFind(this.form, this.disable_fields[a]);
            if (e) {
                this.enableField(this.form, d, false)
            } else {
                this.setFieldStatus(this.form, d, b, true)
            }
        }
    },
    enableHandler: function(c) {
        var b, d;
        var a = (c.disabled === false && c.getRealValue() === true);
        var e = this.IsNeedDisableGroup(c.disabled);
        for (b = 0; b < this.enable_fields.length; b++) {
            d = SYNO.SDS.Utils.FieldFind(this.form, this.enable_fields[b]);
            if (e) {
                this.enableField(this.form, d, false)
            } else {
                this.setFieldStatus(this.form, d, a, false)
            }
        }
        for (b = 0; b < this.disable_fields.length; b++) {
            d = SYNO.SDS.Utils.FieldFind(this.form, this.disable_fields[b]);
            if (e) {
                this.enableField(this.form, d, false)
            } else {
                this.setFieldStatus(this.form, d, a, true)
            }
        }
    }
});
SYNO.SDS.Utils.DisplayField = function(c, a, g) {
    var f = c.findField(a);
    if (f && f.getEl()) {
        var b = f.getEl().findParent("div[class~=x-form-item]", c.el, true);
        if (b) {
            var e = b.isDisplayed();
            b.setDisplayed(g);
            if (e === false && g === true && f.msgTarget == "under") {
                var d = f.getEl().findParent(".x-form-element", 5, true);
                var h = d.child("div[class~=x-form-invalid-msg]");
                if (h) {
                    h.setWidth(d.getWidth(true) - 20)
                }
            }
        }
    }
};
SYNO.SDS.Utils.getRadioGroup = function(c, b) {
    var e = [];
    var d = c.el.query("input[name=" + b + "]");
    for (var a = 0; a < d.length; a++) {
        e.push(Ext.getCmp(d[a].id))
    }
    return e
};
SYNO.SDS.Utils.isBrowserReservedPort = function(e, a) {
    var c = [1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 77, 79, 87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 119, 123, 135, 139, 143, 179, 389, 465, 512, 513, 514, 515, 526, 530, 531, 532, 540, 556, 563, 587, 601, 636, 993, 995, 2049, 3659, 4045, 6000, 6665, 6666, 6667, 6668, 6669];
    var b = 0;
    if (e > a) {
        b = e;
        e = a;
        a = b
    }
    for (var d = 0; d < c.length; d++) {
        if (e <= c[d] && a >= c[d]) {
            return true
        }
    }
    return false
};
SYNO.SDS.Utils.isReservedPort = function(m, c, g) {
    var d = [20, 21, 22, 23, 25, 69, 80, 110, 111, 137, 138, 139, 143, 161, 162, 199, 443, 445, 514, 515, 543, 548, 587, 631, 873, 892, 914, 915, 916, 993, 995, 2049, 3260, 3306, 3493, 4662, 4672, 5000, 5001, 5005, 5006, 5335, 5432, 6281, 7000, 7001, 9000, 9002, 9900, 9901, 9997, 9998, 9999, 50001, 50002];
    var e = [];
    var f = [];
    var n = 0;
    if (c > g) {
        n = c;
        c = g;
        g = n
    }
    switch (m) {
        case "ftp":
            f = [21];
            break;
        case "ssh":
            f = [22];
            break;
        case "http":
            f = [80];
            break;
        case "https":
            f = [443];
            break;
        case "webman":
        case "dsm":
            f = [5000, 5001];
            break;
        case "cfs":
            f = [7000, 7001];
            break;
        case "webdav":
            f = [5005, 5006];
            break;
        case "custsurveillance":
            f = [9900, 9901];
            break;
        case "emule":
            f = [4662, 4672];
            break;
        case "syslog":
            f = [514];
            break;
        default:
            break
    }
    for (var l = 0; l < d.length; l++) {
        var k = false;
        for (var h = 0; h < f.length; h++) {
            if (d[l] == f[h]) {
                k = true;
                break
            }
        }
        if (!k) {
            e.push(d[l])
        }
    }
    for (l = 0; l < e.length; l++) {
        if (c <= e[l] && g >= e[l]) {
            return true
        }
    }
    if ("ftp" != m) {
        var b = parseInt(_D("ftp_pasv_def_min_port", "55536"), 10);
        var a = parseInt(_D("ftp_pasv_def_max_port", "55663"), 10);
        if (c <= a && a <= g) {
            return true
        }
        if (b <= g && g <= a) {
            return true
        }
    }
    if ("emule" != m) {
        if (c <= 4662 && 4662 <= g) {
            return true
        }
        if (c <= 4672 && 4672 <= g) {
            return true
        }
    }
    if ("surveillance" != m) {
        if (c <= 55863 && 55863 <= g) {
            return true
        }
        if (55736 <= g && g <= 55863) {
            return true
        }
    }
    if ("custsurveillance" != m) {
        if (c <= 9900 && 9900 <= g) {
            return true
        }
        if (c <= 9901 && 9901 <= g) {
            return true
        }
    }
    if ("cfs" != m) {
        if (c <= 7000 && 7000 <= g) {
            return true
        }
        if (c <= 7001 && 7001 <= g) {
            return true
        }
    }
    if ("webdav" != m) {
        if (c <= 5005 && 5005 <= g) {
            return true
        }
        if (c <= 5006 && 5006 <= g) {
            return true
        }
    }
    if (c <= 55910 && 55910 <= g) {
        return true
    }
    if (55900 <= g && g <= 55910) {
        return true
    }
    if (c <= 3259 && 3259 <= g) {
        return true
    }
    if (3240 <= g && g <= 3259) {
        return true
    }
    return false
};
SYNO.SDS.Utils.getTimeZoneStore = function() {
    if (SYNO.SDS.Utils._timezoneStore) {
        return SYNO.SDS.Utils._timezoneStore
    }
    var b = [
        ["Midway", -660],
        ["Hawaii", -600],
        ["Alaska", -540],
        ["Pacific", -480],
        ["Arizona", -420],
        ["Chihuahua", -420],
        ["Mountain", -420],
        ["Guatemala", -360],
        ["Central", -360],
        ["MexicoCity", -360],
        ["Saskatchewan", -360],
        ["Bogota", -300],
        ["Eastern", -300],
        ["EastIndiana", -300],
        ["Caracas", -270],
        ["Atlantic", -240],
        ["La_Paz", -240],
        ["Manaus", -240],
        ["Santiago", -240],
        ["Newfoundland", -210],
        ["Brasilia", -180],
        ["BuenosAires", -180],
        ["Godthab", -180],
        ["Montevideo", -180],
        ["South_Georgia", -120],
        ["Azores", -60],
        ["CapeVerde", -60],
        ["Casablanc", 0],
        ["Dublin", 0],
        ["Monrovia", 0],
        ["Amsterdam", 60],
        ["Belgrade", 60],
        ["Brussels", 60],
        ["Sarajevo", 60],
        ["WAT", 60],
        ["Windhoek", 60],
        ["Amman", 120],
        ["Athens", 120],
        ["Beirut", 120],
        ["Egypt", 120],
        ["Harare", 120],
        ["Helsinki", 120],
        ["Israel", 120],
        ["CAT", 120],
        ["EET", 120],
        ["Minsk", 180],
        ["Baghdad", 180],
        ["Kuwait", 180],
        ["Nairobi", 180],
        ["Moscow", 180],
        ["Tehran", 210],
        ["Muscat", 240],
        ["Baku", 240],
        ["Tbilisi", 240],
        ["Yerevan", 240],
        ["Kabul", 270],
        ["Karachi", 300],
        ["Ekaterinburg", 300],
        ["Calcutta", 330],
        ["Katmandu", 345],
        ["Almaty", 360],
        ["Dhaka", 360],
        ["Novosibirsk", 360],
        ["Rangoon", 390],
        ["Jakarta", 420],
        ["Krasnoyarsk", 420],
        ["Taipei", 480],
        ["Beijing", 480],
        ["Ulaanbaatar", 480],
        ["Singapore", 480],
        ["Perth", 480],
        ["Irkutsk", 480],
        ["Tokyo", 540],
        ["Seoul", 540],
        ["Yakutsk", 540],
        ["Adelaide", 570],
        ["Darwin", 570],
        ["Brisbane", 600],
        ["Melbourne", 600],
        ["Guam", 600],
        ["Tasmania", 600],
        ["Vladivostok", 600],
        ["Magadan", 600],
        ["Noumea", 660],
        ["Auckland", 720],
        ["Fiji", 720]
    ];

    function c(e) {
        var f = "";
        var d = Math.floor(Math.abs(e));
        if (d < 10) {
            f += "0"
        }
        return (f += d.toString())
    }
    Ext.each(b, function(f) {
        var e = f[1];
        var d;
        if (e === 0) {
            d = "(GMT)"
        } else {
            d = String.format("(GMT{0}{1}:{2})", (e > 0) ? "+" : "-", c(e / 60), c(e % 60))
        }
        f.push(_T("timezone", f[0]).replace(/\(GMT.{0,6}\)/g, d))
    });
    var a = new Ext.data.SimpleStore({
        id: 0,
        fields: ["value", "offset", "display"],
        data: b
    });
    SYNO.SDS.Utils._timezoneStore = a;
    return a
};
SYNO.SDS.Utils.createTimeItemStore = function(e) {
    var a = [];
    var c = {
        hour: 24,
        min: 60,
        sec: 60
    };
    if (e in c) {
        for (var d = 0; d < c[e]; d++) {
            a.push([d, String.leftPad(String(d), 2, "0")])
        }
        var b = new Ext.data.SimpleStore({
            id: 0,
            fields: ["value", "display"],
            data: a
        });
        return b
    }
    return null
};
SYNO.SDS.Utils.GetLocalizedString = function(b, d) {
    if (!b) {
        return ""
    }
    var e, a, c = b.split(":", 3);
    if (2 < c.length) {
        return b
    }
    e = c[0];
    a = c[1];
    var f;
    if (d) {
        if (!Ext.isArray(d)) {
            d = [d]
        }
        Ext.each(d, function(g) {
            f = _TT(g, e, a);
            if (!Ext.isEmpty(f)) {
                return false
            }
        })
    }
    return f || _T(e, a) || c[2] || b
};
SYNO.SDS.Utils.CapacityRender = function(c, d) {
    var b = _T("common", "size_mb");
    var e = c;
    if (e < 0) {
        e = 0
    }
    if (e > 999) {
        e = e / 1024;
        b = _T("common", "size_gb")
    }
    if (e > 999) {
        e = e / 1024;
        b = _T("common", "size_tb")
    }
    var a = d || 2;
    return e.toFixed(a) + " " + b
};
Ext.override(Ext.form.Radio, {
    setValue: function(a) {
        if (typeof a == "boolean") {
            Ext.form.Radio.superclass.setValue.call(this, a)
        } else {
            if (this.rendered) {
                var b = this.getCheckEl().select("input[name=" + this.el.dom.name + "]");
                b.each(function(d) {
                    var c = Ext.getCmp(d.dom.id);
                    c.setValue((a === d.dom.value));
                    c.fireEvent("check", c, c.checked)
                }, this)
            }
        }
        return this
    },
    onClick: function() {
        if (this.el.dom.checked != this.checked) {
            this.setValue(this.el.dom.value)
        }
    }
});
SYNO.SDS.Utils.Checkbox = Ext.extend(Ext.form.Checkbox, {
    activeCls: "",
    isMouseOn: false,
    boxEl: null,
    clsStates: {
        check: {
            normal: "check",
            active: "checkActive"
        },
        nocheck: {
            normal: "nocheck",
            active: "nocheckActive"
        }
    },
    initComponent: function() {
        SYNO.SDS.Utils.Checkbox.superclass.initComponent.apply(this, arguments)
    },
    initEvents: function() {
        SYNO.SDS.Utils.Checkbox.superclass.initEvents.call(this);
        this.boxEl = this.el.next();
        this.mon(this, {
            scope: this,
            check: this.onChecked,
            focus: this.onFocus,
            blur: this.onBlur
        });
        this.mon(this.container, {
            scope: this,
            mouseenter: this.mouseOn,
            mouseleave: this.mouseOut
        })
    },
    mouseOn: function() {
        this.isMouseOn = true;
        this.updateStates(this.isMouseOn)
    },
    mouseOut: function() {
        this.isMouseOn = false;
        this.updateStates(this.isMouseOn)
    },
    onBlur: function() {
        this.updateStates(false)
    },
    onFocus: function() {
        this.updateStates(true)
    },
    onChecked: function() {
        this.updateStates(this.isMouseOn)
    },
    updateStates: function(b) {
        if (!this.boxEl) {
            return
        }
        var a = this.clsStates[this.getValue() ? "check" : "nocheck"][b ? "active" : "normal"];
        this.boxEl.removeClass(this.activeCls);
        this.boxEl.addClass(a);
        this.activeCls = a
    }
});
SYNO.SDS.Utils.SearchField = Ext.extend(SYNO.ux.FleXcroll.ComboBox, {
    constructor: function(a) {
        a.listeners = Ext.applyIf(a.listeners || {}, {
            render: {
                fn: function(b) {
                    b.trigger.hide();
                    b.trigger.removeClass("syno-ux-combobox-trigger")
                }
            }
        });
        SYNO.SDS.Utils.SearchField.superclass.constructor.call(this, Ext.apply({
            title: _T("common", "search_results"),
            loadingText: _T("common", "searching"),
            emptyText: _T("user", "search_user"),
            queryParam: "query",
            queryDelay: 500,
            listEmptyText: "No Results",
            grow: true,
            width: 200,
            listWidth: 360,
            maxHeight: 360,
            minChars: 1,
            autoSelect: false,
            typeAhead: false,
            editable: true,
            mode: "remote",
            listAlign: ["tr-br?", [16, 0]],
            ctCls: "syno-textfilter",
            cls: "syno-textfilter-text",
            listClass: "sds-search-result",
            triggerConfig: {
                tag: "div",
                cls: "x-form-trigger syno-textfilter-trigger"
            },
            store: new Ext.data.Store({
                autoDestroy: true,
                proxy: new Ext.data.HttpProxy({
                    url: "modules/Indexer/uisearch.cgi",
                    method: "GET"
                }),
                reader: new Ext.data.JsonReader({
                    root: "items",
                    id: "_random"
                }, ["id", "title", {
                    name: "desc",
                    convert: function(c, b) {
                        return String.format(c, _D("product"))
                    }
                }, "owner", "topic", "type"]),
                baseParams: {
                    lang: _S("lang"),
                    type: a.type || "all"
                }
            })
        }, a))
    },
    initEvents: function() {
        SYNO.SDS.Utils.SearchField.superclass.initEvents.apply(this, arguments);
        this.keyNav.disable();
        this.mon(this.el, "click", this.onClick, this);
        this.mon(this.getStore(), "load", this.onStoreLoad, this)
    },
    onClick: function() {
        if (this.getValue().length >= this.minChars) {
            if (!this.hasFocus) {
                this.blur();
                this.focus()
            }
            this.expand()
        }
    },
    onStoreLoad: function(a) {
        function b(c) {
            var d = "";
            switch (c.get("type")) {
                case "app":
                    d = SYNO.SDS.Utils.ParseSearchID(c.get("id")).className;
                    if (SYNO.SDS.Utils.isHiddenControlPanelModule(c.get("id"))) {
                        return false
                    }
                    break;
                case "help":
                    d = "SYNO.SDS.HelpBrowser.Application";
                    break;
                default:
                    return true
            }
            return SYNO.SDS.StatusNotifier.isAppEnabled(d)
        }
        a.filterBy(b)
    },
    onSelect: function(a, b) {
        if (this.fireEvent("beforeselect", this, a, b) !== false) {
            this.collapse();
            this.fireEvent("select", this, a, b)
        }
    },
    onViewOver: function(d, b) {
        if (this.inKeyMode) {
            return
        }
        var c = this.view.findItemFromChild(b);
        if (c) {
            var a = this.view.indexOf(c);
            this.select(a, false)
        } else {
            this.view.clearSelections()
        }
    },
    onViewClick: function(b) {
        var a = this.view.getSelectedIndexes()[0],
            c = this.store,
            d = c.getAt(a);
        if (d) {
            this.onSelect(d, a)
        }
        if (b !== false) {
            this.el.focus()
        }
    },
    onKeyUp: function(c) {
        var a = c.getKey(),
            b = this.getValue();
        this.trigger.setVisible(!!b);
        if (b.length < this.minChars) {
            this.collapse()
        } else {
            if (b === this.lastQuery && c.ENTER === a) {
                this.expand()
            } else {
                if (this.editable !== false && this.readOnly !== true && (c.ENTER === a || c.BACKSPACE === a || c.DELETE === a || !c.isSpecialKey())) {
                    this.lastKey = a;
                    this.dqTask.delay(this.queryDelay)
                }
            }
        }
    },
    preFocus: function() {
        var a = this.el;
        if (this.emptyText) {
            if (a.dom.value === this.emptyText && this.el.hasClass(this.emptyClass)) {
                this.setRawValue("")
            }
            a.removeClass(this.emptyClass)
        }
        if (this.selectOnFocus) {
            a.dom.select()
        }
    },
    initQuery: function() {
        this.view.clearSelections();
        this.doQuery(this.getRawValue())
    },
    getRawValue: function() {
        var a = this.rendered ? this.el.getValue() : Ext.value(this.value, "");
        if (a === this.emptyText && this.el.hasClass(this.emptyClass)) {
            a = ""
        }
        return a
    },
    getValue: function() {
        if (!this.rendered) {
            return this.value
        }
        var a = this.el.getValue();
        if ((a === this.emptyText && this.el.hasClass(this.emptyClass)) || a === undefined) {
            a = ""
        }
        return a
    },
    onTriggerClick: function() {
        if (this.getValue()) {
            this.setValue("");
            this.trigger.hide();
            this.collapse()
        }
        this.focus(false, 200)
    }
});
SYNO.SDS.Utils.InnerGroupingView = Ext.extend(Ext.grid.GroupingView, {
    onLayout: function() {
        SYNO.SDS.Utils.InnerGroupingView.superclass.onLayout.call(this);
        Ext.grid.GroupingView.superclass.onLayout.call(this);
        var a = this.getGroups();
        if (a) {
            Ext.each(a, function(b) {
                var c = Ext.get(b.id).child(".x-grid-group-hd");
                if (c) {
                    c.on("mouseover", function() {
                        c.addClass("syno-ux-grid-group-hd-over")
                    });
                    c.on("mouseout", function() {
                        c.removeClass("syno-ux-grid-group-hd-over")
                    });
                    c.on("mousedown", function() {
                        c.addClass("syno-ux-grid-group-hd-click")
                    });
                    c.on("mouseup", function() {
                        c.removeClass("syno-ux-grid-group-hd-click")
                    })
                }
            })
        }
    }
});
SYNO.SDS.DefineGridView("SYNO.SDS.Utils.GroupingView", "SYNO.SDS.Utils.InnerGroupingView");
Ext.override(SYNO.SDS.Utils.GroupingView, {
    toggleGroup: function(e, c) {
        var d = this;
        var a = Ext.get(e),
            f = Ext.util.Format.htmlEncode(a.id);
        c = Ext.isDefined(c) ? c : a.hasClass("x-grid-group-collapsed");
        if (d.state[f] !== c) {
            if (d.cancelEditOnToggle !== false) {
                d.grid.stopEditing(true)
            }
            d.state[f] = c;
            var b = a.child(".x-grid-group-body");
            if (b) {
                b[c ? "slideIn" : "slideOut"]("t", {
                    duration: 0.25,
                    block: true,
                    scope: d,
                    callback: this.afterSlideEffect.createDelegate(this, [e, c])
                })
            } else {
                a[c ? "removeClass" : "addClass"]("x-grid-group-collapsed");
                this.onLayout.call(this);
                this.updateScroller()
            }
        }
    },
    afterSlideEffect: function(d, c) {
        var a = Ext.get(d);
        var b = a.child(".x-grid-group-body");
        b.removeClass("x-grid3-row-over");
        a[c ? "removeClass" : "addClass"]("x-grid-group-collapsed");
        b[c ? "show" : "hide"]("display");
        this.onLayout.call(this);
        this.updateScroller()
    }
});
SYNO.SDS.Utils.GridView = Ext.extend(Ext.grid.GridView, {
    onLayout: function() {}
});
SYNO.SDS.Utils.ParseSearchID = function(c) {
    var b = c.split("?", 2),
        a = {
            className: "",
            params: {}
        };
    a.className = b[0];
    if (2 === b.length) {
        a.params = Ext.urlDecode(b[1])
    }
    return a
};
SYNO.SDS.Utils.isControlPanelModule = function(b, a) {
    if (a === "SYNO.SDS.ControlPanel.Instance" && b !== "SYNO.SDS.ControlPanel.Instance" && !SYNO.SDS.Utils.isHiddenControlPanelModule(b)) {
        return true
    }
    return false
};
SYNO.SDS.Utils.isHiddenControlPanelModule = function(b) {
    var a = SYNO.SDS.Utils.ParseSearchID(b);
    if (a.className === "SYNO.SDS.ControlPanel.Instance") {
        if (a.params && a.params.fn) {
            if (Ext.isDefined(SYNO.SDS.AppPrivilege[a.params.fn]) && false === SYNO.SDS.AppPrivilege[a.params.fn]) {
                return true
            }
        }
    }
    return false
};
SYNO.SDS.Utils.GetAppIcon = function(c, b) {
    if (c in SYNO.SDS.Config.FnMap) {
        var a = SYNO.SDS.Config.FnMap[c].config;
        return SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(a.jsBaseURL + "/" + a.icon, b)
    }
    return ""
};
SYNO.SDS.Utils.GetAppTitle = function(b) {
    if (b in SYNO.SDS.Config.FnMap) {
        var a = SYNO.SDS.Config.FnMap[b].config;
        return SYNO.SDS.Utils.GetLocalizedString(a.title, b)
    }
    return ""
};
SYNO.SDS.Utils.CheckWebapiError = function(e) {
    var c, b, d;
    try {
        if (Ext.isDefined(e.responseText)) {
            c = Ext.decode(e.responseText)
        } else {
            c = e
        }
        if (c.success) {
            return false
        }
        b = c.error.code || 100;
        d = SYNO.API.Erros.common[b]
    } catch (a) {}
    if (!d) {
        b = 100;
        d = SYNO.API.Erros.common[b]
    }
    window.alert(d);
    if (b >= 105) {
        window.onbeforeunload = null;
        window.location.href = "/"
    }
    return true
};
Ext.define("SYNO.SDS.Utils.Logout", {
    statics: {
        action: function(b, c, a) {
            if (a === true) {
                if (SYNO.SDS.Desktop) {
                    SYNO.SDS.Desktop.hide()
                }
                Ext.getBody().mask().addClass("desktop-timeout-mask")
            }
            if (Ext.isSafari && Ext.isMac) {
                this.logout.defer(10, this, [b, c])
            } else {
                this.logout(b, c)
            }
        },
        logout: function(a, b) {
            if (Ext.isDefined(b)) {
                window.alert(b)
            }
            if (a === true) {
                window.onbeforeunload = null
            }
            window.location.href = "logout.cgi"
        }
    }
});
SYNO.SDS.Utils.CheckServerError = function(e) {
    var a, d, c;
    if (!e || !e.getResponseHeader) {
        return false
    }
    try {
        a = e.getResponseHeader("x-request-error") || e.getResponseHeader("X-Request-Error")
    } catch (b) {
        a = e.getResponseHeader["x-request-error"] || e.getResponseHeader["X-Request-Error"]
    }
    try {
        c = e.getResponseHeader("X-SYNO-SOURCE-ID")
    } catch (b) {
        c = undefined
    }
    if (a && Ext.isEmpty(c)) {
        a = Ext.util.Format.trim(a);
        switch (a) {
            case "timeout":
                d = _JSLIBSTR("uicommon", "error_timeout");
                break;
            case "unauth":
                d = _JSLIBSTR("uicommon", "error_unauth");
                break;
            case "noprivilege":
                d = _JSLIBSTR("uicommon", "error_noprivilege");
                break;
            case "relogin":
                d = _JSLIBSTR("uicommon", "error_relogin");
                break;
            default:
                d = _JSLIBSTR("uicommon", "error_system")
        }
        SYNO.SDS.Utils.Logout.action(true, d, true);
        return true
    }
    return false
};
SYNO.SDS.Utils.CheckServerErrorData = function(b) {
    var d = null,
        c, a;
    if (!Ext.isDefined(b)) {
        return false
    }
    c = b.section;
    a = b.key;
    if (c === "login") {
        switch (a) {
            case "error_timeout":
            case "error_noprivilege":
            case "error_interrupt":
                d = _JSLIBSTR("uicommon", a);
                break;
            default:
                d = _JSLIBSTR("uicommon", "error_system")
        }
    } else {
        if ("error" === c && "error_testjoin" === a) {
            d = _T("error", "error_testjoin")
        }
    }
    if (d) {
        alert(d);
        window.onbeforeunload = null;
        window.location.href = "/";
        return true
    }
    return false
};
SYNO.SDS.Utils.AddTip = function(c, j) {
    var i = document.createElement("a");
    var e = document.createElement("img");
    var a = "vertical-align:bottom; position: relative;";
    var g = Ext.getCmp(c.id);
    var f = SYNO.SDS.ThemeProvider.getPath("/webman/resources/images/components/icon_information_mini.png");
    e.setAttribute("src", SYNO.SDS.UIFeatures.IconSizeManager.getIconPath(f, ""));
    e.setAttribute("width", "24px");
    e.setAttribute("height", "24px");
    if (g && g.defaultTriggerWidth) {
        a += " left:" + g.defaultTriggerWidth + "px;"
    }
    e.setAttribute("style", a);
    e.setAttribute("ext:qtip", j);
    i.appendChild(e);
    if (g instanceof SYNO.ux.DisplayField) {
        c.appendChild(i)
    } else {
        if (g instanceof SYNO.ux.Button && Ext.getDom(c).nextSibling) {
            var h = c.dom.getAttribute("style") + " margin-right:0px !important;";
            var d = "margin-right:6px !important;";
            var b = Ext.getDom(c);
            b.setAttribute("style", h);
            i.setAttribute("style", d);
            b.parentNode.insertBefore(i, b.nextSibling)
        } else {
            Ext.getDom(c).parentNode.appendChild(i)
        }
    }
    return i
};
SYNO.SDS.Utils.CheckStrongPassword = Ext.extend(Object, {
    passwordPolicy: null,
    isFakePasswd: function(a, b) {
        if (a === "12345678" && b === "87654321") {
            return true
        }
    },
    getForm: null,
    getUserAcc: null,
    getUserDesc: null,
    getPasswd: null,
    getPasswdConfirm: null,
    getStartValidate: null,
    initPasswordChecker: function(a) {
        Ext.each(["getForm", "getUserAcc", "getUserDesc", "getPasswd", "getPasswdConfirm", "getStartValidate"], function(b) {
            this[b] = a[b]
        }, this)
    },
    setValue: function(a, b) {
        this.getForm().findField(this[a]).setValue(b)
    },
    getInfo: function(a) {
        if (Ext.isFunction(this[a])) {
            return this[a].call(this.scope || this)
        } else {
            if (Ext.isString(this[a])) {
                if (Ext.isFunction(this.getForm)) {
                    return this.getForm().findField(this[a]).getValue()
                } else {
                    return this[a]
                }
            }
        }
    },
    isStrongValidator: function() {
        var c = this.getInfo("getUserAcc");
        var b = this.getInfo("getUserDesc");
        var a = this.getInfo("getPasswd");
        var d = this.getInfo("getPasswdConfirm");
        var e = "";
        if (false === this.getStartValidate()) {
            return true
        }
        if (true === this.isFakePasswd(a, d)) {
            return true
        }
        e = this.isPasswordValid(a, c, b);
        return e
    },
    isPasswordValid: function(p, n, b) {
        var j = "abcdefghijklmnopqrstuvwxyz";
        var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var h = "~`!@#$%^&*()-_+={[}]|\\:;\"'<,>.?/ ";
        var m = "1234567890";
        var e = false;
        var l = false;
        var a = {
            mixed_case: false,
            included_special_char: false,
            included_numeric_char: false,
            exclude_username: false,
            min_length_enable: false
        };
        var d = [];
        var g = 0;
        var k = "";
        var f = Ext.util.Format.lowercase(p);
        var q = Ext.util.Format.lowercase(n);
        var c = Ext.util.Format.lowercase(b);
        if (this.passwordPolicy.strong_password_enable === false) {
            return true
        }
        if ((q === "" || f.indexOf(q) === -1) && (c === "" || f.indexOf(c) === -1)) {
            a.exclude_username = true
        }
        for (g = 0; g < p.length; g++) {
            k = p.charAt(g);
            if (j.indexOf(k) !== -1) {
                e = true
            } else {
                if (o.indexOf(k) !== -1) {
                    l = true
                } else {
                    if (h.indexOf(k) !== -1) {
                        a.included_special_char = true
                    } else {
                        if (m.indexOf(k) !== -1) {
                            a.included_numeric_char = true
                        }
                    }
                }
            }
        }
        if (e === true && l === true) {
            a.mixed_case = true
        }
        if (p.length >= this.passwordPolicy.min_length) {
            a.min_length_enable = true
        }
        for (g in a) {
            if (true === this.passwordPolicy[g] && false === a[g]) {
                if (g === "min_length_enable") {
                    d.push(_T("passwd", g) + this.passwordPolicy.min_length)
                } else {
                    d.push(_T("passwd", g))
                }
            }
        }
        if (0 !== d.length) {
            return _T("passwd", "passwd_strength_warn") + d.join(_T("common", "sep_pun")) + _T("common", "period")
        }
        return true
    }
});
SYNO.SDS.Utils.ActionGroup = Ext.extend(Object, {
    constructor: function(a) {
        this.list = [];
        this.dict = {};
        if (Ext.isObject(a)) {
            this.dict = a;
            Ext.iterate(a, function(b, c, d) {
                this.list.push(c)
            }, this)
        } else {
            if (Ext.isArray(a)) {
                this.list = a;
                Ext.each(a, function(d, b, c) {
                    this.dict[d.itemId] = d
                }, this)
            } else {
                SYNO.Debug("wrong parameters for ActionGroup")
            }
        }
    },
    enableAll: function() {
        Ext.each(this.list, function(c, a, b) {
            c.enable()
        }, this)
    },
    disableAll: function() {
        Ext.each(this.list, function(c, a, b) {
            c.disable()
        }, this)
    },
    enable: function(a) {
        if (this.dict[a]) {
            this.dict[a].enable()
        }
    },
    disable: function(a) {
        if (this.dict[a]) {
            this.dict[a].disable()
        }
    },
    add: function(a) {
        if (!a || !a.itemId) {
            SYNO.Debug("Invalid parameter for ActionGroup.add()");
            return
        }
        this.dict[a.itemId] = a;
        this.list.push(a)
    },
    get: function(a) {
        return this.dict[a]
    },
    getArray: function() {
        return this.list
    },
    showAll: function() {
        Ext.each(this.list, function(c, a, b) {
            c.show()
        }, this)
    },
    hideAll: function() {
        Ext.each(this.list, function(c, a, b) {
            c.hide()
        }, this)
    }
});
SYNO.SDS.Utils.isValidExtension = function(d, b) {
    var a = 0;
    var c = d.toLowerCase();
    if (!d.length || !b.length) {
        return false
    }
    a = c.lastIndexOf(b);
    if (-1 == a) {
        return false
    }
    if (c.length != (a + b.length)) {
        return false
    }
    return true
};
SYNO.SDS.Utils.getSupportedLanguage = function(a) {
    var e = {
        enu: _T("common", "language_enu"),
        fre: _T("common", "language_fre"),
        ger: _T("common", "language_ger"),
        ita: _T("common", "language_ita"),
        spn: _T("common", "language_spn"),
        cht: _T("common", "language_cht"),
        chs: _T("common", "language_chs"),
        jpn: _T("common", "language_jpn"),
        krn: _T("common", "language_krn"),
        ptb: _T("common", "language_ptb"),
        rus: _T("common", "language_rus"),
        dan: _T("common", "language_dan"),
        nor: _T("common", "language_nor"),
        sve: _T("common", "language_sve"),
        nld: _T("common", "language_nld"),
        plk: _T("common", "language_plk"),
        ptg: _T("common", "language_ptg"),
        hun: _T("common", "language_hun"),
        trk: _T("common", "language_trk"),
        csy: _T("common", "language_csy")
    };
    var f = [];
    var c = 0;
    for (var d in e) {
        if (e.hasOwnProperty(d)) {
            f[c++] = [d, e[d]]
        }
    }
    var b = function(h, g) {
        if (h[1] > g[1]) {
            return 1
        } else {
            if (h[1] < g[1]) {
                return -1
            } else {
                return 0
            }
        }
    };
    f = f.sort(b);
    if (a) {
        f.unshift(["def", _T("common", "language_def")])
    }
    return f
};
SYNO.SDS.Utils.getSupportedLanguageCodepage = function(a) {
    var e = {
        enu: _T("common", "language_enu"),
        fre: _T("common", "language_fre"),
        ger: _T("common", "language_ger"),
        ita: _T("common", "language_ita"),
        spn: _T("common", "language_spn"),
        cht: _T("common", "language_cht"),
        chs: _T("common", "language_chs"),
        jpn: _T("common", "language_jpn"),
        krn: _T("common", "language_krn"),
        ptb: _T("common", "language_ptb"),
        rus: _T("common", "language_rus"),
        dan: _T("common", "language_dan"),
        nor: _T("common", "language_nor"),
        sve: _T("common", "language_sve"),
        nld: _T("common", "language_nld"),
        plk: _T("common", "language_plk"),
        ptg: _T("common", "language_ptg"),
        hun: _T("common", "language_hun"),
        trk: _T("common", "language_trk"),
        csy: _T("common", "language_csy"),
        ara: _T("common", "language_ara")
    };
    var f = [];
    var c = 0;
    for (var d in e) {
        if (e.hasOwnProperty(d)) {
            f[c++] = [d, e[d]]
        }
    }
    var b = function(h, g) {
        if (h[1] > g[1]) {
            return 1
        } else {
            if (h[1] < g[1]) {
                return -1
            } else {
                return 0
            }
        }
    };
    f = f.sort(b);
    if (a) {
        f.unshift(["def", _T("common", "language_def")])
    }
    return f
};
SYNO.SDS.Utils.utfencode = function(b) {
    var e, d, a = "";
    b = b.replace(/\r\n/g, "\n");
    for (e = 0; e < b.length; e++) {
        d = b.charCodeAt(e);
        if (d < 128) {
            a += String.fromCharCode(d)
        } else {
            if ((d > 127) && (d < 2048)) {
                a += String.fromCharCode((d >> 6) | 192);
                a += String.fromCharCode((d & 63) | 128)
            } else {
                a += String.fromCharCode((d >> 12) | 224);
                a += String.fromCharCode(((d >> 6) & 63) | 128);
                a += String.fromCharCode((d & 63) | 128)
            }
        }
    }
    return a
};
SYNO.SDS.Utils.bin2hex = function(d) {
    var c, e = 0,
        b = [];
    d = SYNO.SDS.Utils.utfencode(d) + "";
    e = d.length;
    for (c = 0; c < e; c++) {
        b[c] = d.charCodeAt(c).toString(16).replace(/^([\da-f])$/, "0$1")
    }
    return b.join("")
};
SYNO.SDS.Utils.loadUIStrings = function(g, c, h) {
    var f = ["/scripts/uistrings.cgi?lang=" + g, "/webfm/webUI/uistrings.cgi?lang=" + g, "uistrings.cgi?lang=" + g];
    var e = 0;

    function b(i) {
        e++;
        if (e >= f.length) {
            h()
        }
    }

    function d() {
        if ("complete" !== this.readyState && "loaded" !== this.readyState) {
            return
        }
        this.onready()
    }
    var a = document.getElementsByTagName("head")[0];
    Ext.each(f, function(j) {
        var k = j;
        k = Ext.urlAppend(k, "v=" + c);
        if (Ext.isDefined(SYNO.SDS.JSDebug)) {
            k = Ext.urlAppend(k, "_dc=" + (new Date().getTime()))
        }
        var i = document.createElement("script");
        i.type = "text/javascript";
        if (Ext.isIE) {
            i.onready = b.createCallback(j);
            i.onreadystatechange = d
        } else {
            i.onload = b.createCallback(j)
        }
        i.src = k;
        a.appendChild(i)
    })
};
SYNO.SDS.Utils.addFavIconLink = function(g, b) {
    var c = document.getElementsByTagName("link");
    var f = document.createElement("link");
    var e;
    f.rel = "shortcut icon";
    f.href = g;
    if (b) {
        f.type = b
    }
    var a = document.head || document.getElementsByTagName("head")[0];
    for (var d = c.length - 1; d >= 0; d--) {
        if (c[d] && c[d].getAttribute("rel") === "shortcut icon") {
            e = c[d].getAttribute("sizes");
            if (e === "16x16" || !e) {
                a.removeChild(c[d])
            }
        }
    }
    a.appendChild(f)
};
SYNO.SDS.Utils.listAllowAltPortApp = function() {
    var b = SYNO.SDS.Config.FnMap;
    var a = [];
    Ext.iterate(b, function(c, d, e) {
        if (d.config && (d.config.type === "app" || d.config.type === "url")) {
            if (d.config.allowAltPort === true) {
                a.push(c)
            }
        }
    });
    return a
};
SYNO.SDS.Utils.IconBadge = Ext.extend(Object, {
    constructor: function() {
        this.container = Ext.DomHelper.createDom({
            tag: "div",
            cls: "sds-expose-desc-ct"
        });
        this.el = Ext.get(this.container);
        this.icon = Ext.DomHelper.createDom({
            tag: "img",
            cls: "sds-expose-desc-img",
            style: String.format("width: {0}px", SYNO.SDS.UIFeatures.IconSizeManager.Header)
        });
        this.title = Ext.DomHelper.createDom({
            tag: "div",
            cls: "sds-expose-desc-text"
        });
        this.el.appendChild(this.icon);
        this.el.appendChild(this.title);
        Ext.get(document.body).appendChild(this.container)
    },
    setIconText: function(a, b) {
        this.icon.src = a;
        this.title.innerHTML = b
    },
    setXY: function(a, b) {
        this.el.setLeft(a);
        this.el.setTop(b)
    }
});
SYNO.SDS.Utils.isCJKLang = function() {
    switch (SYNO.SDS.Session.lang) {
        case "cht":
        case "chs":
        case "jpn":
        case "krn":
            return true;
        default:
            return false
    }
};
SYNO.SDS.Utils.is3rdPartyApp = function(b) {
    var a = SYNO.SDS.Config.FnMap[b];
    return (!a || a.jsFile.indexOf("3rdparty/") === 0)
};
SYNO.SDS.Utils.clone = function(d) {
    if (!d || "object" !== typeof d) {
        return d
    }
    if ("function" === typeof d.clone) {
        return d.clone()
    }
    var e = "[object Array]" === Object.prototype.toString.call(d) ? [] : {};
    var b, a;
    for (b in d) {
        if (d.hasOwnProperty(b)) {
            a = d[b];
            if (a && "object" === typeof a) {
                e[b] = SYNO.SDS.Utils.clone(a)
            } else {
                e[b] = a
            }
        }
    }
    return e
};
SYNO.SDS.Utils.IsCJK = function(c) {
    if (!c) {
        return false
    }
    var e = function(g) {
        return /^[\u4E00-\u9FA5]|^[\uFE30-\uFFA0]/.test(g)
    };
    var f = function(g) {
        return /^[\u0800-\u4e00]/.test(g)
    };
    var b = function(g) {
        return /^[\u3130-\u318F]|^[\uAC00-\uD7AF]/.test(g)
    };
    var d;
    for (var a = 0; a < c.length; a++) {
        d = c[a];
        if (d === " ") {
            continue
        }
        if (d === undefined || (!e(d) && !f(d) && !b(d))) {
            return false
        }
    }
    return true
};
SYNO.SDS.Utils.SelectableCLS = "allowDefCtxMenu selectabletext";
SYNO.SDS.Utils.AutoResizeComboBox = Ext.extend(Ext.form.ComboBox, {
    expand: function() {
        var a = this;
        SYNO.SDS.Utils.AutoResizeComboBox.superclass.expand.call(a);
        if (a.comboBoxGrow === true) {
            a.autoResizeList(a.getWidth(), a.calcWidthFunc)
        }
    },
    doResize: function(a) {
        var b = this;
        if (!Ext.isDefined(b.listWidth) && b.comboBoxGrow === true) {
            b.autoResizeList(a, b.calcWidthFunc)
        }
    },
    autoResizeList: function(a, b) {
        var g = this,
            j = "",
            c = null,
            i = g.getStore();
        if (!i) {
            return
        }
        i.each(function(d) {
            if (j.length < d.data[g.displayField].length) {
                j = d.data[g.displayField];
                c = d
            }
        });
        var e = Ext.util.TextMetrics.createInstance(g.getEl());
        var f = document.createElement("div");
        f.appendChild(document.createTextNode(j));
        j = f.innerHTML;
        Ext.removeNode(f);
        f = null;
        j += "&#160;";
        var h = Math.min(g.comboBoxGrowMax || Number.MAX_VALUE, Math.max(((b && c) ? b(c, e.getWidth(j)) : e.getWidth(j)) + 10, a || 0));
        g.list.setWidth(h);
        g.innerList.setWidth(h - g.list.getFrameWidth("lr"))
    }
});
SYNO.SDS.Utils.IsAllowRelay = function(b) {
    var a, c, d = function(e) {
        if (true === e._relayObject && Ext.isFunction(e.findAppWindow) && Ext.isObject(e.openConfig) && Ext.isFunction(e.hasOpenConfig) && Ext.isFunction(e.getOpenConfig) && Ext.isFunction(e.setOpenConfig)) {
            return true
        }
        return false
    };
    if (!Ext.isObject(b)) {
        return false
    }
    a = Ext.getClassByName("SYNO.SDS.AdminCenter.MainWindow");
    c = Ext.getClassByName("SYNO.SDS.ResourceMonitor.App");
    if ((!Ext.isEmpty(a) && b instanceof a) || (!Ext.isEmpty(c) && b instanceof c) || true === d(b)) {
        if (b.hasOpenConfig("cms_id")) {
            return true
        }
    }
    return false
};
SYNO.SDS.Utils.IFrame = {
    createIFrame: function(d, c) {
        var e = SYNO.SDS.Utils.IFrame.createIFrame.iframeId || Ext.id(),
            a = d.getElementById(e),
            b = a || d.createElement("iframe");
        SYNO.SDS.Utils.IFrame.createIFrame.iframeId = e;
        b.setAttribute("id", e);
        b.setAttribute("src", c);
        b.setAttribute("frameBorder", "0");
        b.setAttribute("style", "border:0px none;width:0;height:0;position:absolute;top:-100000px");
        if (!a) {
            d.body.appendChild(b)
        }
        return b
    },
    cleanIframe: function(c, a) {
        try {
            Ext.EventManager.removeAll(a);
            Ext.destroy(a);
            c.body.removeChild(a);
            a = undefined
        } catch (b) {}
    },
    getWebAPIResp: function(a) {
        var c;
        try {
            c = Ext.decode(a.contentDocument.body.innerText);
            if (Ext.isEmpty(c.success)) {
                c = undefined
            }
        } catch (b) {
            c = undefined
        }
        return c
    },
    request: function(b, a, d) {
        var e = document,
            f, c = SYNO.SDS.Utils.IFrame.createIFrame(e, Ext.urlAppend(b), a, d);
        f = setTimeout((function() {
            SYNO.SDS.Utils.IFrame.cleanIframe.call(e, c);
            if (Ext.isFunction(a)) {
                a.call(d || this, "timeout", c)
            }
        }).createDelegate(this), 120000);
        Ext.EventManager.on(c, "load", function() {
            var g;
            if (!Ext.isEmpty(f)) {
                clearTimeout(f)
            }
            SYNO.SDS.Utils.IFrame.cleanIframe.call(e, c);
            if (Ext.isFunction(a)) {
                g = this.getWebAPIResp(c);
                if (Ext.isObject(g)) {
                    a.call(d || this, "load", c, g.success, g.success ? g.data : g.error)
                } else {
                    a.call(d || this, "load", c)
                }
            }
        }, this, {
            single: true
        });
        Ext.EventManager.on(c, "error", function() {
            if (!Ext.isEmpty(f)) {
                clearTimeout(f)
            }
            SYNO.SDS.Utils.IFrame.cleanIframe.call(e, c);
            if (Ext.isFunction(a)) {
                a.call(d || this, "error", c)
            }
        }, this, {
            single: true
        });
        return c
    },
    requestWebAPI: function(d) {
        var c, b, a;
        if (!Ext.isObject(d.webapi) || !SYNO.ux.Utils.checkApiObjValid(d.webapi)) {
            SYNO.Debug("webapi is invalid");
            return
        }
        a = d.webapi;
        if (Ext.isObject(d.appWindow)) {
            b = d.appWindow.findAppWindow()
        } else {
            b = d.appWindow
        }
        if (SYNO.SDS.Utils.IsAllowRelay(b) && b.hasOpenConfig("cms_id")) {
            c = SYNO.API.GetBaseURL({
                api: "SYNO.CMS.DS",
                version: 1,
                method: "relay",
                params: {
                    id: b.getOpenConfig("cms_id"),
                    timeout: b.getOpenConfig("cms_timeout") || 120,
                    webapi: Ext.apply({
                        api: a.api,
                        version: a.version,
                        method: a.method
                    }, a.params)
                }
            }, false, d.filename)
        } else {
            if (false === b || b instanceof SYNO.SDS.AppWindow) {
                c = SYNO.API.currentManager.getBaseURL({
                    webapi: a
                }, false, d.filename)
            } else {
                SYNO.Debug("appWindow is invalid!");
                SYNO.Debug("appWindow can be found by Ext.Component.findAppWindow");
                SYNO.Debug("ex: this.findAppWindow() or config.module.appWin.findAppWindow()");
                return
            }
        }
        if (Ext.isString(c)) {
            return this.request(c, d.callback, d.scope)
        }
        return
    }
};
Ext.define("SYNO.SDS.Utils.HiDPI", {
    statics: {
        getRatio: function(b) {
            var a, d, c, e = ((window.matchMedia && (window.matchMedia("(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)").matches)) ? 1.5 : 1);
            a = window.devicePixelRatio || e;
            d = b.webkitBackingStorePixelRatio || b.mozBackingStorePixelRatio || b.msBackingStorePixelRatio || b.oBackingStorePixelRatio || b.backingStorePixelRatio || 1;
            c = a / d;
            return c
        }
    }
});
SYNO.SDS.Utils.isBSTinEffect = function() {
    var e, c, b, f, a, g = new Date();
    for (e = 31; e > 0; e--) {
        c = new Date(g.getFullYear(), 2, e);
        if (c.getDay() === 0) {
            f = c;
            break
        }
    }
    for (e = 31; e > 0; e--) {
        c = new Date(g.getFullYear(), 9, e);
        if (c.getDay() === 0) {
            a = c;
            break
        }
    }
    b = (g < f || g > a) ? false : true;
    return b
};
Ext.form.Action.Apply = Ext.extend(Ext.form.Action.Submit, {
    type: "apply",
    constructor: function(b, a) {
        Ext.form.Action.Apply.superclass.constructor.call(this, b, a)
    },
    success: function(b) {
        var a = this.processResponse(b);
        if (a === true || a.success) {
            if (a.data) {
                this.form.clearInvalid();
                this.form.setValues(a.data)
            }
            this.form.afterAction(this, true);
            return
        }
        if (a.errors) {
            this.form.markInvalid(a.errors)
        }
        this.failureType = Ext.form.Action.SERVER_INVALID;
        this.form.afterAction(this, false)
    }
});
Ext.form.Action.ACTION_TYPES.apply = Ext.form.Action.Apply;
Ext.ns("SYNO.SDS.Utils");
SYNO.SDS.Utils.getPunyHostname = function() {
    var a = [],
        c = location.hostname.split("."),
        b;
    for (b = 0; b < c.length; ++b) {
        a.push(SYNO.SDS.Utils.PunyCode.encode(c[b], true))
    }
    return a.join(".")
};
SYNO.SDS.Utils.getPunyHost = function() {
    var b, a = SYNO.SDS.Utils.getPunyHostname();
    b = location.protocol + "//" + a;
    if (location.port) {
        b += ":" + location.port
    }
    return b + "/"
};
SYNO.SDS.Utils.getPunyBaseURL = function() {
    var a = SYNO.SDS.Utils.getPunyHost();
    a += location.pathname;
    if (a.indexOf("?") != -1) {
        a = a.substring(0, a.indexOf("?"))
    }
    a = a.substring(0, a.lastIndexOf("/"));
    return a + "/"
};
SYNO.SDS.Utils.PunyCode = (function() {
    var g = 128;
    var l = 72;
    var a = "-";
    var c = 36;
    var e = 700;
    var b = 1;
    var h = 26;
    var o = 38;
    var d = 2147483647;

    function m(s) {
        var r = [],
            t = 0,
            q = s.length,
            u, p;
        while (t < q) {
            u = s.charCodeAt(t++);
            if ((u & 63488) === 55296) {
                p = s.charCodeAt(t++);
                if (((u & 64512) !== 55296) || ((p & 64512) !== 56320)) {
                    throw new RangeError("UTF-16(decode): Illegal UTF-16 sequence")
                }
                u = ((u & 1023) << 10) + (p & 1023) + 65536
            }
            r.push(u)
        }
        return r
    }

    function f(r) {
        var q = [],
            s = 0,
            p = r.length,
            t;
        while (s < p) {
            t = r[s++];
            if ((t & 63488) === 55296) {
                throw new RangeError("UTF-16(encode): Illegal UTF-16 value")
            }
            if (t > 65535) {
                t -= 65536;
                q.push(String.fromCharCode(((t >>> 10) & 1023) | 55296));
                t = 56320 | (t & 1023)
            }
            q.push(String.fromCharCode(t))
        }
        return q.join("")
    }

    function k(p) {
        return p - 48 < 10 ? p - 22 : p - 65 < 26 ? p - 65 : p - 97 < 26 ? p - 97 : c
    }

    function n(q, p) {
        return q + 22 + 75 * (q < 26) - ((p !== 0) << 5)
    }

    function j(s, r, q) {
        var p;
        s = q ? Math.floor(s / e) : (s >> 1);
        s += Math.floor(s / r);
        for (p = 0; s > (((c - b) * h) >> 1); p += c) {
            s = Math.floor(s / (c - b))
        }
        return Math.floor(p + (c - b + 1) * s / (s + o))
    }

    function i(q, p) {
        q -= (q - 97 < 26) << 5;
        return q + ((!p && (q - 65 < 26)) << 5)
    }
    return {
        decode: function(x, r) {
            var u = [];
            var I = [];
            var C = x.length;
            var B, G, F, s, q, E, A, p, v, D, z, y, H;
            B = g;
            F = 0;
            s = l;
            q = x.lastIndexOf(a);
            if (q < 0) {
                q = 0
            }
            for (E = 0; E < q; ++E) {
                if (r) {
                    I[u.length] = (x.charCodeAt(E) - 65 < 26)
                }
                if (x.charCodeAt(E) >= 128) {
                    throw new RangeError("Illegal input >= 0x80")
                }
                u.push(x.charCodeAt(E))
            }
            for (A = q > 0 ? q + 1 : 0; A < C;) {
                for (p = F, v = 1, D = c;; D += c) {
                    if (A >= C) {
                        throw new RangeError("punycode_bad_input(1)")
                    }
                    z = k(x.charCodeAt(A++));
                    if (z >= c) {
                        throw new RangeError("punycode_bad_input(2)")
                    }
                    if (z > Math.floor((d - F) / v)) {
                        throw new RangeError("punycode_overflow(1)")
                    }
                    F += z * v;
                    y = D <= s ? b : D >= s + h ? h : D - s;
                    if (z < y) {
                        break
                    }
                    if (v > Math.floor(d / (c - y))) {
                        throw new RangeError("punycode_overflow(2)")
                    }
                    v *= (c - y)
                }
                G = u.length + 1;
                s = j(F - p, G, p === 0);
                if (Math.floor(F / G) > d - B) {
                    throw new RangeError("punycode_overflow(3)")
                }
                B += Math.floor(F / G);
                F %= G;
                if (r) {
                    I.splice(F, 0, x.charCodeAt(A - 1) - 65 < 26)
                }
                u.splice(F, 0, B);
                F++
            }
            if (r) {
                for (F = 0, H = u.length; F < H; F++) {
                    if (I[F]) {
                        u[F] = (String.fromCharCode(u[F]).toUpperCase()).charCodeAt(0)
                    }
                }
            }
            return f(u)
        },
        encode: function(E, p) {
            var v, G, A, D, B, z, w, s, y, H, F, r;
            if (p) {
                r = m(E)
            }
            E = m(E.toLowerCase());
            var C = E.length;
            if (p) {
                for (z = 0; z < C; z++) {
                    r[z] = E[z] != r[z]
                }
            }
            var x = "",
                u = [];
            v = g;
            G = 0;
            B = l;
            for (z = 0; z < C; ++z) {
                if (E[z] < 128) {
                    u.push(String.fromCharCode(r ? i(E[z], r[z]) : E[z]))
                }
            }
            A = D = u.length;
            if (D && D < C) {
                u.push(a)
            }
            if (D < C) {
                x = "xn--"
            }
            while (A < C) {
                for (w = d, z = 0; z < C; ++z) {
                    F = E[z];
                    if (F >= v && F < w) {
                        w = F
                    }
                }
                if (w - v > Math.floor((d - G) / (A + 1))) {
                    throw new RangeError("punycode_overflow (1)")
                }
                G += (w - v) * (A + 1);
                v = w;
                for (z = 0; z < C; ++z) {
                    F = E[z];
                    if (F < v) {
                        if (++G > d) {
                            return Error("punycode_overflow(2)")
                        }
                    }
                    if (F == v) {
                        for (s = G, y = c;; y += c) {
                            H = y <= B ? b : y >= B + h ? h : y - B;
                            if (s < H) {
                                break
                            }
                            u.push(String.fromCharCode(n(H + (s - H) % (c - H), 0)));
                            s = Math.floor((s - H) / (c - H))
                        }
                        u.push(String.fromCharCode(n(s, p && r[z] ? 1 : 0)));
                        B = j(G, A + 1, A == D);
                        G = 0;
                        ++A
                    }
                }++G;
                ++v
            }
            return x + u.join("")
        }
    }
})();
Ext.namespace("SYNO.SDS.Utils.StorageUtils");
SYNO.SDS.Utils.StorageUtils.ISCSITRG_UNIT_GB = 1024 * 1024 * 1024;
SYNO.SDS.Utils.StorageUtils.ISCSIVAAILUN_EP_SIZE = function(c) {
    var g = 1048576;
    var a = 4096;
    var d = 63;
    var e = 512;
    var b;
    var f;
    b = ((c / a + (d - 1)) / d);
    b = Math.floor(b);
    f = ((b * e) + g);
    return f
};
SYNO.SDS.Utils.StorageUtils.SpaceIDParser = function(e) {
    var b = e.split("_");
    var c = "";
    var a = "";
    var d = "";
    if ("hotspare" === e) {
        return {
            type: "hotspare",
            num: "",
            str: _T("volume", "volume_hot_spare")
        }
    }
    if (2 != b.length) {
        return ""
    }
    c = b[0];
    a = b[1];
    switch (c) {
        case "pool":
        case "reuse":
            if ("yes" === _D("supportraidgroup", "no")) {
                d = String.format("{0} {1}", _T("volume", "volume_storage_pool"), a)
            } else {
                d = String.format("{0} {1}", _T("volume", "volume_pool"), a)
            }
            break;
        case "volume":
            d = String.format("{0} {1}", _T("volume", "volume"), a);
            break;
        case "iscsilun":
            c = "iscsi";
            d = String.format("{0} ({1})", _T("volume", "volume_iscsitrg_lun"), a);
            break;
        case "virtual":
            d = String.format("{0} {1}", _T("volume", "volume_virtual_space"), a);
            break;
        case "volumeX":
            c = "volume";
            d = String.format("{0} {1} ({2})", _T("volume", "volume"), a, _T("volume", "volume_expansion"));
            break;
        case "ssd":
            d = String.format("{0} {1}", _T("volume", "ssd_cache"), a);
            break
    }
    return {
        type: c,
        num: a,
        str: d
    }
};
SYNO.SDS.Utils.StorageUtils.GetSizeGB = function(b, f) {
    var e = Ext.isNumber(f);
    var c = Math.pow(10, (e) ? f : 2);
    var d = b / SYNO.SDS.Utils.StorageUtils.ISCSITRG_UNIT_GB;
    var a = d;
    if (c > 1) {
        a = Math.round(d * c) / c
    } else {
        if (c == 1) {
            a = d.floor()
        }
    }
    return a
};
SYNO.SDS.Utils.StorageUtils.UiRenderHelperInitializer = function() {
    var k = "blue-status",
        j = "red-status",
        p = "green-status",
        g = {
            normal: {
                text: _T("volume", "volume_status_normal"),
                color: p
            },
            degrade: {
                text: _T("volume", "volume_status_degrade"),
                color: j
            },
            crashed: {
                text: _T("volume", "volume_status_crashed"),
                color: j
            },
            moving: {
                text: _T("iscsitrg", "iscsitrg_status_moving"),
                color: k
            },
            creating: {
                text: _T("volume", "volume_status_create"),
                color: k
            },
            repairing: {
                text: _T("volume", "volume_status_repair"),
                color: k
            },
            expanding: {
                text: _T("volume", "volume_status_expand"),
                color: k
            },
            migrating: {
                text: _T("volume", "volume_status_upgrade"),
                color: k
            },
            adding_disk: {
                text: _T("volume", "volume_status_add_disk"),
                color: k
            },
            deleting: {
                text: _T("volume", "volume_status_delete"),
                color: k
            },
            raid_syncing: {
                text: _T("volume", "volume_status_resync"),
                color: k
            },
            raid_reshaping: {
                text: _T("volume", "volume_adddisk_progress_reshape"),
                color: k
            },
            raid_parity_checking: {
                text: _T("volume", "volume_status_paritycount"),
                color: k
            },
            background: {
                text: _T("volume", "volume_status_background"),
                color: k,
                warningText: _T("volume", "performance_degraded"),
                warningColor: j
            },
            processing: {
                text: _T("volume", "volume_status_delayed"),
                color: k
            },
            offline: {
                text: _T("iscsitrg", "iscsitrg_status_offline"),
                color: j
            },
            online: {
                text: _T("iscsitrg", "iscsitrg_status_online"),
                color: p
            },
            connected: {
                text: _T("iscsitrg", "iscsitrg_status_connected").replace("_IP_", "").replace(/\s/, ""),
                color: k
            },
            waiting: {
                text: _T("volume", "volume_status_waiting"),
                color: k
            },
            mount_ssd: {
                text: _T("volume", "volume_ssd_mounting"),
                color: k
            },
            umount_ssd: {
                text: _T("volume", "volume_ssd_unmounting"),
                color: k
            },
            mounting_cache: {
                text: _T("volume", "volume_mounting_cache"),
                color: k
            },
            unmounting_cache: {
                text: _T("volume", "volume_unmounting_cache"),
                color: k
            },
            unavailabling: {
                text: _T("iscsilun", "iscsilun_vaai_lun_bad"),
                color: j
            },
            Healthy: {
                text: _T("iscsilun", "healthy"),
                color: p
            },
            Unhealthy: {
                text: _T("iscsilun", "unhealthy"),
                color: j
            },
            restoring: {
                text: _T("iscsilun", "restoring"),
                color: k
            },
            cloning: {
                text: _T("iscsilun", "cloning"),
                color: k
            },
            be_cloning: {
                text: _T("iscsilun", "using"),
                color: k
            },
            using: {
                text: _T("iscsilun", "using"),
                color: k
            },
            snapshotting: {
                text: _T("iscsilun", "using"),
                color: k
            },
            expand_unfinished_shr: {
                text: _T("volume", "volume_status_expand"),
                color: k
            },
            disk_check: {
                text: _T("volume", "volume_status_check_disk"),
                color: k
            },
            data_scrubbing: {
                text: _T("volume", "do_data_scrubbing"),
                color: k
            },
            ssd_trimming: {
                text: _T("volume", "volume_ssd_trimming"),
                color: k,
                warningText: _T("volume", "volume_ssd_trimming_warn"),
                warningColor: k
            },
            space_missing: {
                text: _T("volume", "space_missing"),
                color: j
            },
            cache_missing: {
                text: _T("volume", "cache_missing"),
                color: j
            }
        },
        e = {
            mk_filesystem: _T("volume", "volume_status_create_fs"),
            resize_filesystem: _T("volume", "volume_status_expand_fs"),
            initializing_inode_table: _T("volume", "initializing_inode_table"),
            disk_initialize: _T("volume", "volume_status_init_disk"),
            raid_syncing: _T("volume", "volume_status_resync"),
            data_scrubbing: _T("volume", "do_data_scrubbing"),
            raid_reshaping: _T("volume", "volume_adddisk_progress_reshape"),
            raid_parity_checking: _T("volume", "volume_status_paritycount"),
            finalize: _T("volume", "volume_status_finalize_vol"),
            stop_services: _T("volume", "volume_status_stop_services"),
            start_services: _T("volume", "volume_status_start_services"),
            disk_check: _T("volume", "volume_status_check_disk"),
            umount_volume: _T("volume", "volume_unmount_volume"),
            mount_volume: _T("volume", "volume_mount_volume"),
            stop_iscsi: _T("iscsilun", "iscsilun_stop_iscsi_service"),
            start_iscsi: _T("iscsilun", "iscsilun_start_iscsi_service"),
            stop_pool: _T("volume", "volume_stop_raid"),
            start_pool: _T("volume", "volume_start_raid"),
            allocate_space: _T("volume", "volume_allocate_space"),
            waiting: _T("volume", "volume_status_waiting"),
            flushing: _T("volume", "ssd_cache_flushing"),
            none: ""
        },
        o = function(q) {
            var r = {};
            var s = 1;
            var t = _T("common", "size_byte");
            if (q >= 1099511627776) {
                s = 1099511627776;
                t = _T("common", "size_tb")
            } else {
                if (q >= 1073741824) {
                    s = 1073741824;
                    t = _T("common", "size_gb")
                } else {
                    if (q >= 1048576) {
                        s = 1048576;
                        t = _T("common", "size_mb")
                    } else {
                        if (q >= 1024) {
                            s = 1024;
                            t = _T("common", "size_kb")
                        } else {
                            s = 1;
                            t = _T("common", "size_byte")
                        }
                    }
                }
            }
            r.unit = s;
            r.strUnit = t;
            return r
        },
        m = {
            media: _T("tree", "leaf_mediaservice"),
            itunes: _T("tree", "leaf_itunes"),
            audio: _T("tree", "leaf_audio"),
            photo: _T("tree", "leaf_photo"),
            netbkp: _T("tree", "leaf_netbkp"),
            web: _T("tree", "leaf_web"),
            download: _T("tree", "node_download"),
            mysql: _T("tree", "leaf_mysql"),
            surveillance: _T("tree", "leaf_surveillance"),
            userhome: _T("user", "user_home")
        },
        l = {
            media: undefined,
            audio: "SYNO.SDS.AudioStation.Application",
            itunes: undefined,
            photo: "SYNO.SDS.PhotoStation",
            web: "SYNO.SDS.WebStation",
            netbkp: undefined,
            download: "SYNO.SDS.DownloadStation",
            mysql: undefined,
            surveillance: "SYNO.SDS.SurveillanceStation",
            userhome: undefined,
            weblocal: undefined
        },
        c = String.format("({0})", _T("volume", "volume_add_tip_dataprotection")),
        b = String.format("({0})", _T("volume", "volume_add_tip_dataprotection_by_1_disk")),
        i = String.format("({0})", _T("volume", "volume_add_tip_dataprotection_by_2_disks")),
        d = String.format(" ({0})", _T("volume", "volume_add_tip_nodataprotection")),
        h = String.format('<font class="red-status"> ({0})</font>', _T("volume", "volume_add_tip_nodataprotection")),
        a = {
            shr_without_disk_protect: {
                text: _T("volume", "volume_type_raid_shr"),
                tip: d
            },
            shr_with_1_disk_protect: {
                text: _T("volume", "volume_type_raid_shr"),
                tip: b
            },
            shr_with_2_disk_protect: {
                text: _T("volume", "volume_type_raid_shr"),
                tip: i
            },
            basic: {
                text: _T("volume", "volume_generalhd"),
                tip: h
            },
            raid_linear: {
                text: _T("volume", "volume_type_linear"),
                tip: h
            },
            raid_0: {
                text: _T("volume", "volume_type_raid_0"),
                tip: h
            },
            raid_1: {
                text: _T("volume", "volume_type_raid_1"),
                tip: c
            },
            raid_5: {
                text: _T("volume", "volume_type_raid_5"),
                tip: c
            },
            "raid_5+spare": {
                text: _T("volume", "volume_type_raid_5") + "+Spare",
                tip: c
            },
            raid_6: {
                text: _T("volume", "volume_type_raid_6"),
                tip: c
            },
            raid_10: {
                text: _T("volume", "volume_type_raid_10"),
                tip: c
            }
        },
        n = {
            sys_partition_normal: {
                text: _T("volume", "volume_disksysuse"),
                color: "green-status"
            },
            not_use: {
                text: _T("volume", "volume_disknotuse"),
                color: "green-status"
            },
            normal: {
                text: _T("volume", "volume_diskinuse"),
                color: "green-status"
            },
            crashed: {
                text: _T("volume", "volume_diskfailed"),
                color: "red-status"
            },
            system_crashed: {
                text: _T("volume", "volume_diskfailedsys"),
                color: "red-status"
            },
            hotspare: {
                text: _T("volume", "volume_hot_spare"),
                color: "green-status"
            },
            secure_erasing: {
                text: _T("disk_info", "disk_secure_erasing"),
                color: "blue-status"
            }
        },
        f = {
            safe: {
                text: _T("volume", "volume_status_normal"),
                fullText: _T("volume", "volume_status_normal"),
                color: "green-status"
            },
            damage: {
                text: _T("smart", "smart_status_abnormal"),
                fullText: _T("smart", "smart_status_abnormal_full_text"),
                color: "red-status"
            },
            danger: {
                text: _T("smart", "smart_status_abnormal"),
                fullText: _T("smart", "smart_status_abnormal_full_text"),
                color: "red-status"
            },
            unknown: {
                text: _T("common", "not_support"),
                fullText: _T("volume", "volume_status_normal"),
                color: ""
            }
        };
    return {
        SizeRenderWithFloor: function(s, y) {
            var x = Ext.isNumber(y);
            var t = Math.pow(10, (x) ? y : 2);
            var w = 0;
            var q = 0;
            var u = {
                unit: 1,
                strUnit: ""
            };
            u = o(s);
            w = s / u.unit;
            if (t > 1) {
                q = Math.floor(w * t) / t
            } else {
                q = Math.floor(w)
            }
            if ((q - Math.floor(q)) > 0) {
                q = q.toFixed(2)
            }
            return String.format("{0} {1}", q, u.strUnit)
        },
        GetSizeUnitWithFloor: function(s, y) {
            var x = Ext.isNumber(y);
            var t = Math.pow(10, (x) ? y : 2);
            var w = 0;
            var q = 0;
            var u = {
                unit: 1,
                strUnit: ""
            };
            u = o(s);
            w = s / u.unit;
            if (t > 1) {
                q = Math.floor(w * t) / t
            } else {
                q = Math.floor(w)
            }
            if ((q - Math.floor(q)) > 0) {
                q = q.toFixed(2)
            }
            return {
                size: q,
                unit: u.strUnit
            }
        },
        SizeRender: function(s, y) {
            var x = Ext.isNumber(y);
            var t = Math.pow(10, (x) ? y : 2);
            var w = 0;
            var q = 0;
            var u = {
                unit: 1,
                strUnit: ""
            };
            u = o(s);
            w = s / u.unit;
            if (t > 1) {
                q = Math.round(w * t) / t
            } else {
                q = w
            }
            if ((q - Math.floor(q)) > 0) {
                q = q.toFixed(2)
            }
            return String.format("{0} {1}", q, u.strUnit)
        },
        GetSizeUnit: function(s, y) {
            var x = Ext.isNumber(y);
            var t = Math.pow(10, (x) ? y : 2);
            var w = 0;
            var q = 0;
            var u = {
                unit: 1,
                strUnit: ""
            };
            u = o(s);
            w = s / u.unit;
            if (t > 1) {
                q = Math.round(w * t) / t
            } else {
                q = w
            }
            if ((q - Math.floor(q)) > 0) {
                q = q.toFixed(1)
            }
            return {
                size: q,
                unit: u.strUnit
            }
        },
        StatusRender: function(q, r) {
            return SYNO.SDS.StorageUtils.StatusNameRender(q) + " " + SYNO.SDS.StorageUtils.ProgressRender(r)
        },
        LunStatusRender: function(q, r) {
            if (0 === r.percent) {
                return String.format("{0}<span class='blue-status' style='white-space:nowrap'>({1})</span>", SYNO.SDS.StorageUtils.StatusNameRender(q), g.waiting.text)
            }
            return SYNO.SDS.StorageUtils.StatusNameRender(q) + " " + SYNO.SDS.StorageUtils.ProgressRender(r)
        },
        StatusNameRender: function(q) {
            var r;
            if (q in g) {
                r = g[q]
            } else {
                return ""
            }
            return String.format('<span class="{0}">{1}</span>', r.color, r.text)
        },
        ProgressRender: function(q) {
            if (!q || !q.step || !q.percent) {
                return ""
            } else {
                if ("none" === q.step && "-1" === q.percent) {
                    return ""
                } else {
                    if ("none" !== q.step && "-1" === q.percent) {
                        return String.format("({0})", SYNO.SDS.StorageUtils.StepNameRender(q.step))
                    } else {
                        if ("none" === q.step && "-1" !== q.percent) {
                            return String.format("({0})", SYNO.SDS.StorageUtils.PercentRender(q.percent))
                        } else {
                            if ("waiting" === q.step) {
                                if ("-1" !== q.percent) {
                                    return String.format("{0}", SYNO.SDS.StorageUtils.PercentRender(q.percent))
                                } else {
                                    return ""
                                }
                            } else {
                                if ("initializing_inode_table" === q.step) {
                                    return String.format("({0} {1})<br><span class='blue-status'>{2}</span>", SYNO.SDS.StorageUtils.StepNameRender(q.step), SYNO.SDS.StorageUtils.PercentRender(q.percent), _T("volume", "initializing_inode_table_help"))
                                } else {
                                    return String.format("({0} {1})", SYNO.SDS.StorageUtils.StepNameRender(q.step), SYNO.SDS.StorageUtils.PercentRender(q.percent))
                                }
                            }
                        }
                    }
                }
            }
        },
        WarningTextRender: function(r, q) {
            var s;
            if (r in g) {
                s = g[r]
            } else {
                return ""
            }
            if (s.warningText) {
                var t = String.format('<br /><span class="{0}">{1}</span><br />', s.warningColor, s.warningText);
                return String.format(t, q)
            } else {
                return ""
            }
        },
        StepNameRender: function(q) {
            if (q in e) {
                return String.format('<span class="blue-status">{0}</span>', e[q])
            } else {
                return ""
            }
        },
        PercentRender: function(q) {
            var r = "";
            if ("-1" == q) {
                r = ""
            } else {
                r = String.format('<span class="blue-status">{0}%</span>', q)
            }
            return r
        },
        RaidLevelRender: function(q) {
            if (-1 < q.indexOf("shr")) {
                return "SHR"
            }
            if (q in a) {
                return a[q].text
            }
            return ""
        },
        SpaceTypeRender: function(s) {
            var q = "",
                t = "";
            var r = null;
            if (s in a) {
                q = a[s].text;
                t = a[s].tip
            } else {
                if (0 === s.indexOf("expansion")) {
                    q = _T("volume", "volume_type_expansion");
                    r = s.split(":");
                    t = String.format("({0} + {1})", SYNO.SDS.StorageUtils.DeviceTypeRender(r[1]), SYNO.SDS.StorageUtils.DeviceTypeRender(r[2]))
                } else {
                    SYNO.Debug("unknown space type: ", s)
                }
            }
            return String.format("{0} {1}", q, t)
        },
        DeviceTypeRender: function(q) {
            if (q in a) {
                return a[q].text
            } else {
                return "unknown"
            }
        },
        ParseID: function(r) {
            var q = {
                id: 0,
                location: ""
            };
            if (!isNaN(r)) {
                q.id = r;
                q.location = "internal"
            } else {
                if ("X" == r.charAt(0)) {
                    q.id = r.substring(1);
                    q.location = "ebox"
                } else {
                    q.id = r;
                    q.location = "internal"
                }
            }
            return q
        },
        DiskIDRender: function(r) {
            var q = "";
            var s = SYNO.SDS.StorageUtils.ParseID(r);
            if ("ebox" == s.location) {
                q = String.format("{0} {1} ({2})", _T("volume", "volume_disk"), s.id, _T("volume", "volume_expansion"))
            } else {
                q = String.format("{0} {1}", _T("volume", "volume_disk"), s.id)
            }
            return q
        },
        DiskStatusRender: function(q) {
            var r = n[q];
            return (!r) ? "" : String.format('<span class="{0}">{1}</span>', r.color, r.text)
        },
        DiskSwapStatusRender: function(q) {
            switch (q) {
                case "normal":
                    return '<span class="green-status">' + _T("volume", "volume_diskinuse") + "</span>";
                case "failed":
                case "crashed":
                    return '<span class="red-status">' + _T("volume", "volume_diskfailed") + "</span>";
                case "rebuild":
                    return '<span class="blue-status">' + _T("volume", "volume_disk_rebuild") + "</span>";
                case "spare":
                    return '<span class="blue-status">' + _T("volume", "volume_status_waiting") + "</span>";
                case "deleting":
                    return '<span class="blue-status">' + _T("volume", "swap_device_removing") + "</span>";
                case "none":
                    return "-"
            }
        },
        smartStatusRender: function(q) {
            var r = f[q];
            if (r) {
                return String.format('<span class="{0}">{1}</span>', r.color, r.text)
            } else {
                if (!q) {
                    return String.format('<span class="green-status">{0}</span>', _T("common", "loading"))
                } else {
                    if ("-1" === q) {
                        return String.format('<span class="green-status">{0}</span>', _T("smart", "smart_test_remain") + ": " + _T("background_task", "task_processing"))
                    } else {
                        return String.format('<span class="green-status">{0}</span>', _T("smart", "smart_test_remain") + ": " + q)
                    }
                }
            }
        },
        DiskSummaryStatusRender: function(t, u) {
            var r = n[t],
                s = f[u],
                v = "",
                q = "";
            if ("crashed" === t || "system_crashed" === t || "damage" === u || "danger" === u) {
                q = "red-status"
            } else {
                if ("secure_erasing" === t) {
                    q = "blue-status"
                } else {
                    q = "green-status"
                }
            }
            if (!u) {
                return String.format('<span class="{0}">{1}</span>', q, r.text)
            }
            if (!s) {
                if ("-1" === u) {
                    v = _T("smart", "smart_test_remain") + ": " + _T("background_task", "task_processing")
                } else {
                    v = _T("smart", "smart_test_remain") + ": " + u
                }
            } else {
                v = s.fullText
            }
            if ("normal" === t) {
                return String.format('<span class="{0}">{1}</span>', q, v)
            }
            if ("safe" === u || "unknown" === u) {
                return String.format('<span class="{0}">{1}</span>', q, r.text)
            } else {
                return String.format('<span class="{0}">{1}, {2}</span>', q, r.text, v)
            }
        },
        AddDiskTypeRender: function(q) {
            switch (q) {
                case "repair":
                    return _T("volume", "volume_adddisk2_type_repair");
                case "data_scrubbing":
                    return _T("volume", "volume_adddisk2_type_data_scrubbing");
                case "repair_sys_partition":
                    return _T("volume", "volume_repair_syspart");
                case "expand_by_disk":
                    return _T("volume", "volume_adddisk2_type_expand_disk");
                case "expand_with_unalloc_size":
                    return _T("volume", "volume_adddisk2_type_expand_size");
                case "migrate":
                    return _T("volume", "volume_adddisk2_type_migrate");
                case "expand_unfinished_shr":
                    return _T("volume", "volume_adddisk2_type_expand_size")
            }
        },
        MigrateTypeRender: function(q) {
            switch (q) {
                case "add_mirror":
                    return _T("volume", "volume_migrate_add_mirror");
                case "to_raid1":
                    return _T("volume", "volume_migrate_to_raid1");
                case "to_raid5":
                    return _T("volume", "volume_migrate_to_raid5");
                case "to_raid5+spare":
                    return _T("volume", "volume_migrate_to_raid5_spare");
                case "to_raid6":
                    return _T("volume", "volume_migrate_to_raid6")
            }
        },
        TargetStatusRender: function(t, u) {
            var q = "";
            var s = false;
            var r;
            switch (t) {
                case "processing":
                case "creating":
                case "deleting":
                    s = true;
                    break
            }
            if (t in g) {
                r = g[t]
            } else {
                return ""
            }
            q = String.format('<span class="{0}">{1}</span>', r.color, r.text);
            if (0 === u && s) {
                q = String.format("{0}<span class='{1}' style='white-space:nowrap'>({2})</span>", q, g.waiting.color, g.waiting.text)
            }
            return q
        },
        SpareStatusRender: function(q, s, r) {
            if ("none" === q) {
                return String.format('<span class="red-status">{0}</span>', _T("volume", "volume_status_deverr"))
            } else {
                if ("repairing" == q) {
                    if (s && r) {
                        return String.format('<span class="blue-status">{0} {1}, {2} {3}</span>', _T("volume", "volume_status_repair"), s, _T("volume", "volume_raid_subgroup"), r)
                    } else {
                        if (s) {
                            return String.format('<span class="blue-status">{0} ({1})</span>', _T("volume", "volume_status_repair"), s)
                        } else {
                            return String.format('<span class="blue-status">{0}</span>', _T("volume", "volume_status_repair"))
                        }
                    }
                } else {
                    if ("standby" == q) {
                        return String.format('<span class="green-status">{0}</span>', _T("volume", "volume_hot_spare"))
                    } else {
                        return "&nbsp;"
                    }
                }
            }
        },
        SnapShotStatusRender: function(q) {
            return SYNO.SDS.StorageUtils.StatusRender(q.type, q.progress)
        },
        getErrorMsg: function(q) {
            var r = _T("common", "commfail");
            if (q.errinfo && q.errinfo.sec && q.errinfo.key) {
                r = _T(q.errinfo.sec, q.errinfo.key);
                if (Ext.isArray(q.errinfo.params)) {
                    q.errinfo.params.unshift(r);
                    r = String.format.apply(String, q.errinfo.params)
                } else {
                    if (Ext.isString(q.errinfo.params)) {
                        r = String.format(r, q.errinfo.params)
                    }
                }
            }
            return r
        },
        decodeResponse: function(u, q) {
            var s = null;
            var r = {
                success: false,
                text: _T("common", "commfail")
            };
            if (!u || !q) {
                SYNO.Debug("response fail");
                return r
            }
            try {
                s = Ext.util.JSON.decode(q.responseText)
            } catch (t) {
                r.text = "json decode error: " + t;
                return r
            }
            if (!s) {
                r.text = "json decode error";
                return r
            }
            if (!s.success) {
                s.text = SYNO.SDS.StorageUtils.getErrorMsg(s)
            }
            return s
        },
        htmlEncoder: function(q) {
            q = q.replace(/</g, "&lt;");
            q = q.replace(/>/g, "&gt;");
            return q
        },
        htmlDecoder: function(q) {
            if (!q) {
                return ""
            }
            q = q.replace(/&lt;/g, "<");
            q = q.replace(/&gt;/g, ">");
            return q
        },
        getServiceNames: function(q) {
            var r = [];
            Ext.each(q, function(t) {
                if (t in m) {
                    r.push(m[t])
                }
            });
            return r.join(", ")
        },
        getVolumeNames: function(s) {
            var q = this,
                r = [];
            Ext.each(s, function(t) {
                if (Ext.isString(t)) {
                    r.push(q.SpaceIDParser(t).str)
                } else {
                    if (t.name) {
                        r.push(q.SpaceIDParser(t.name).str)
                    } else {
                        if (t.id) {
                            r.push(q.SpaceIDParser(t.id).str)
                        }
                    }
                }
            });
            return r.join(", ")
        },
        getNamesString: function(r) {
            var q = [];
            Ext.each(r, function(s) {
                q.push(s.name)
            });
            return q.join(", ")
        },
        disableServices: function(q) {
            Ext.each(q, function(r) {
                if (Ext.isString(l[r])) {
                    SYNO.SDS.StatusNotifier.setServiceDisabled(l[r], true)
                }
            })
        },
        DiskTemperatureRender: function(q) {
            if (-1 === q) {
                return "-"
            }
            return String.format("{0} {1} / {2} {3}", q, _T("status", "celsius"), (q * 9 / 5 + 32).toFixed(0), _T("status", "fahrenheit"))
        },
        DiskNameRenderer: function(t) {
            var r = t.match(/(\d+)( \((.*)\))*/),
                u, s, q;
            if (!r || 4 != r.length) {
                return t
            }
            u = r[1];
            if (undefined === r[2] || "" === r[2] || undefined === r[3] || "" === r[3]) {
                return String.format("{0} {1}", _T("volume", "volume_disk"), u)
            }
            q = r[3];
            if (0 <= q.indexOf("DX") || 0 <= q.indexOf("RX")) {
                return String.format("{0} {1} ({2})", _T("volume", "volume_disk"), u, q)
            }
            if (-1 === q.indexOf("-")) {
                if ("no" === _D("supportsas", "no")) {
                    return String.format("{0} {1} ({2})", _T("volume", "volume_disk"), u, _T("volume", "volume_expansion"))
                } else {
                    return String.format("{0} {1} ({2})", _T("volume", "volume_disk"), u, _T("volume", "volume_unknown_expansion"))
                }
            }
            s = q.split("-");
            return String.format("{0} {1} ({2} {3})", _T("volume", "volume_disk"), u, _T("volume", "volume_expansion"), s[1])
        }
    }
};
SYNO.SDS.Utils.StorageUtils.UiRenderHelper = SYNO.SDS.Utils.StorageUtils.UiRenderHelperInitializer();
SYNO.SDS.Utils.StorageUtils.VolumeNameRenderer = function(b) {
    var d = /volume\D*(\d+)/,
        c, a;
    if (!Ext.isString(b)) {
        if ("internal" !== b.location) {
            return b.display_name || ""
        }
        if (!Ext.isString(b.volume_path)) {
            return ""
        }
        c = b.volume_path
    } else {
        c = b
    }
    a = c.match(d);
    if (!a || 2 !== a.length) {
        return ""
    }
    return String.format("{0} {1}", _T("volume", "volume"), a[1])
};
SYNO.SDS.Utils.StorageUtils.VolumeNameSizeRenderer = function(c) {
    var a, b;
    a = SYNO.SDS.Utils.StorageUtils.VolumeNameRenderer(c);
    b = SYNO.SDS.Utils.StorageUtils.UiRenderHelper.SizeRender(c.size_free_byte, 10);
    return String.format("{0}({1}{2} {3})", a, _T("volume", "volume_freesize"), _T("common", "colon"), b)
};
Ext.namespace("SYNO.SDS.Utils.Network");
SYNO.SDS.Utils.Network = {
    MacIPAnd: function(d, a) {
        var c;
        var b = [];
        var g, f, e;
        for (e = 0; e < 32; e++) {
            g = d % 2;
            f = a % 2;
            if ((g == 1) && (f == 1)) {
                b[e] = 1
            } else {
                b[e] = 0
            }
            d = (d - g) / 2;
            a = (a - f) / 2
        }
        c = 0;
        for (e = 31; e >= 0; e--) {
            c = c * 2 + b[e]
        }
        return c
    },
    GetIPValue: function(d) {
        var c = 0;
        var a, b;
        for (b = 0; b < 3; b++) {
            a = d.indexOf(".");
            c = c * 256 + parseInt(d.slice(0, a), 10);
            d = d.slice(a + 1, d.length)
        }
        c = c * 256 + parseInt(d, 10);
        return c
    },
    GatewayMatchIP: function(h, b, i) {
        var g = true;
        var d = SYNO.SDS.Utils.Network.GetIPValue(h);
        var a = SYNO.SDS.Utils.Network.GetIPValue(i);
        var c = SYNO.SDS.Utils.Network.GetIPValue(b);
        var f = SYNO.SDS.Utils.Network.MacIPAnd(d, a);
        var e = SYNO.SDS.Utils.Network.MacIPAnd(c, a);
        if (f === 0) {
            g = false
        } else {
            g = (f == e)
        }
        return g
    },
    idToString: function(g, e) {
        var d = "";
        var b = "";
        var c = {
            eth: "lan",
            br: "bridge",
            wlan: "wificlient",
            gwlan: "wifiguest",
            bond: "bond",
            ppp: "pppoe",
            lbr: "local_bridge",
            gbr: "guest_bridge",
            ap: "wifiap",
            usbmodem: "usbmodem"
        };
        var a = {
            lan: _T("tcpip", "tcpip_lan_port"),
            wan: _T("network", "if_internet"),
            wificlient: _T("network", "if_wireless"),
            wifiguest: _T("wireless_ap", "ap_guest_network"),
            bond: _T("network", "if_bond"),
            pppoe: _T("tree", "leaf_pppoe"),
            bridge: _T("tcpip", "tcpip_lan_port"),
            local_bridge: _T("network", "if_wireless_lan"),
            guest_bridge: _T("wireless_ap", "ap_guest_network"),
            wifiap: _T("network", "if_hotspot"),
            usbmodem: _T("network", "usbmodem_name")
        };
        var f = new RegExp(/^ppp1[0-9]{2}$/);
        if (f.match(g)) {
            return a.usbmodem
        }
        if ("pppoe" === g) {
            return a[g]
        }
        if (0 === g.indexOf("6in4-")) {
            return SYNO.SDS.Utils.Network.idToString.apply(this, [g.substring(5)]) + "(" + _T("tree", "leaf_tunnel") + ")"
        }
        d = g.replace(/\.\d+$/, "").replace(/\d+$/, "");
        b = g.replace(/\D+/, "").replace(/\.\d+$/, "");
        if (!e && (d in c)) {
            e = c[d]
        }
        if (e in a) {
            if (!SYNO.SDS.Utils.Network.isMultiLan.apply(this)) {
                switch (e) {
                    case "lan":
                    case "wan":
                        return a[e];
                    default:
                        break
                }
            }
            switch (e) {
                case "pppoe":
                case "bridge":
                case "local_bridge":
                case "guest_bridge":
                case "usbmodem":
                    return a[e];
                default:
                    b = parseInt(b, 10) + 1;
                    return a[e] + " " + b
            }
        } else {
            return "(unknown) " + g
        }
    },
    isPPPoE: function(a) {
        return "ppp0" === a
    },
    isMultiLan: function() {
        var a = "";
        if (SYNO.SDS.Utils.Network === this) {
            a = _D("maxlanport", "1")
        } else {
            a = this._D("maxlanport", "1")
        }
        return 1 < parseInt(a, 10)
    },
    checkExternalIP: function(c) {
        if (!c) {
            return false
        }
        var a, b;
        c = c.toLowerCase();
        if (!Ext.form.VTypes.looseip(c)) {
            return true
        }
        if (c.indexOf(".") < 0 && c.indexOf("fc00:") === 0) {
            return false
        }
        if (c.indexOf(".") < 0) {
            return false
        }
        b = c.split(".");
        for (a in b) {
            if (b.hasOwnProperty(a)) {
                b[a] = parseInt(b[a], 10)
            }
        }
        if (b[0] == 10) {
            return false
        } else {
            if (b[0] == 172 && (b[1] >= 16 && b[1] <= 31)) {
                return false
            } else {
                if (b[0] == 192 && b[1] == 168) {
                    return false
                }
            }
        }
        return true
    },
    getExternalHostName: function(b) {
        var a;
        if (_S("external_host_ip") && _S("external_host_ip") !== "") {
            a = _S("external_host_ip")
        } else {
            if (_S("ddns_hostname") && _S("ddns_hostname") !== "") {
                a = _S("ddns_hostname")
            } else {
                if (b && _S("external_ip") && _S("external_ip") !== "") {
                    a = _S("external_ip")
                } else {
                    a = window.location.hostname
                }
            }
        }
        return a
    },
    getURLprefix: function(d) {
        var c, b, a;
        c = SYNO.SDS.Utils.Network.getExternalHostName(d);
        a = window.location.protocol + "//" + c;
        b = window.location.port;
        if (!_S("rewrite_mode")) {
            if (window.location.protocol === "https:") {
                b = (_S("external_port_dsm_https") && _S("external_port_dsm_https") !== "") ? _S("external_port_dsm_https") : window.location.port
            } else {
                b = (_S("external_port_dsm_http") && _S("external_port_dsm_http") !== "") ? _S("external_port_dsm_http") : window.location.port
            }
        }
        if (b) {
            a += ":" + b
        }
        return a
    },
    isSupportTopology: function() {
        var a = null;
        if (SYNO.SDS.Utils.Network === this) {
            a = _S("support_net_topology")
        } else {
            a = this._S("support_net_topology")
        }
        return "yes" === a
    }
};
Ext.namespace("SYNO.SDS.Relay");
SYNO.SDS.Relay.GenRelaydStatusStr = function() {
    var b = {
        err_unknown: _T("relayservice", "relayservice_err_unknown"),
        err_config: _T("relayservice", "relayservice_err_config"),
        err_register: _T("relayservice", "relayservice_err_register"),
        err_network: _T("relayservice", "relayservice_err_network"),
        err_not_support: _T("relayservice", "relayservice_status_update_dsm"),
        err_resolv: _T("relayservice", "relayservice_err_resolv"),
        err_lock: _T("relayservice", "relayservice_err_lock"),
        err_auth: _T("error", "error_auth"),
        err_server_limit: _T("relayservice", "relayservice_err_server_limit"),
        err_server_busy: _T("relayservice", "relayservice_err_server_busy"),
        err_server_changed: _T("relayservice", "relayservice_err_register"),
        success: undefined
    };
    var a = {
        not_running: _T("relayservice", "relayservice_disconnected"),
        starting: _T("relayservice", "relayservice_starting"),
        login: Ext.copyTo({
            success: _T("relayservice", "relayservice_login")
        }, b, "err_network,err_resolv,err_server_limit"),
        connected: Ext.copyTo({
            success: _T("relayservice", "relayservice_connected")
        }, b, "err_network,err_resolv"),
        direct_connect: _T("relayservice", "relayservice_direct_connect"),
        logout: _T("relayservice", "relayservice_stop"),
        stoped: Ext.applyIf({
            success: _T("relayservice", "relayservice_disconnected")
        }, b),
        "--": "--"
    };
    return function(d, c) {
        if (d in a) {
            if (Ext.isString(a[d])) {
                return a[d]
            }
            if (!Ext.isObject(a[d])) {
                throw Error("unknown status config")
            }
            if (c in a[d]) {
                return a[d][c]
            } else {
                return a[d].success
            }
        } else {
            if (c in b) {
                return a.stoped.success + "(" + b[c] + ")"
            } else {
                return a.stoped.success
            }
        }
    }
};
SYNO.SDS.Relay.GetRelaydStatusStr = SYNO.SDS.Relay.GenRelaydStatusStr();
Ext.ns("SYNO.SDS.Utils");
SYNO.SDS.Utils.TabPanel = Ext.extend(SYNO.ux.TabPanel, {
    module: null,
    constructor: function(a) {
        var b;
        b = Ext.apply({
            checkFormDirty: true,
            useStatusBar: !(false === a.useDefaultBtn && !a.buttons),
            useDefaultBtn: true,
            deferredRender: false,
            applyDirtyOnly: false,
            loadDirtyOnly: false,
            buttons: false !== a.useDefaultBtn ? [{
                xtype: "syno_button",
                btnStyle: "blue",
                disabled: _S("demo_mode"),
                tooltip: _S("demo_mode") ? _JSLIBSTR("uicommon", "error_demo") : "",
                text: _T("common", "commit"),
                scope: this,
                handler: this.applyHandler
            }, {
                xtype: "syno_button",
                btnStyle: "grey",
                text: _T("common", "reset"),
                scope: this,
                handler: this.cancelHandler
            }] : null
        }, a);
        b = this.addStatusBar(b);
        SYNO.SDS.Utils.TabPanel.superclass.constructor.call(this, b);
        this.addListener("beforetabchange", this.onBeforeTabChange, this)
    },
    addStatusBar: function(a) {
        if (!a.useStatusBar) {
            return a
        }
        var b = {
            xtype: "statusbar",
            defaultText: "&nbsp;",
            statusAlign: "left",
            buttonAlign: "left",
            items: []
        };
        if (a.buttons) {
            b.items = b.items.concat(a.buttons);
            delete a.buttons
        }
        Ext.applyIf(a, {
            fbar: b
        });
        return a
    },
    applyHandler: function(b, a) {
        this.applyAllForm()
    },
    cancelHandler: function(b, a) {
        this.resetAllForm()
    },
    getApiArray: function(d, c) {
        var b = [];
        this.items.each(function(f, a, e) {
            if (!(f instanceof SYNO.SDS.Utils.FormPanel)) {
                return
            }
            if (c && this.loadDirtyOnly && !f.getForm().isDirty()) {
                return
            }
            b = b.concat(f.getApiArray(d))
        }, this);
        return SYNO.ux.Utils.uniqueApiArray(b)
    },
    getAllForms: function() {
        var a = [];
        this.items.each(function(e, b, d) {
            if (!e.getForm) {
                return
            }
            var c = e.getForm();
            a.push(c)
        }, this);
        return a
    },
    loadAllForm: function(a) {
        var c = "get",
            b;
        if (false === this.onBeforeRequest(c)) {
            return false
        }
        b = this.getApiArray(c);
        b = this.processParams(c, b);
        this.sendAjaxRequest(c, b)
    },
    applyAllForm: function(a) {
        var d = "set",
            c;
        var b = {};
        if (false === this.onBeforeRequest(d)) {
            return false
        }
        this.items.each(function(i, f, h) {
            if (!(i instanceof SYNO.SDS.Utils.FormPanel)) {
                return
            }
            var g = i.getForm();
            if (this.applyDirtyOnly && !g.isDirty()) {
                return
            }
            var e = g.getValues(false, "set");
            Ext.apply(b, e)
        }, this);
        c = this.constructApplyParams(b);
        c = c.concat(this.getApiArray("get", true));
        c = this.processParams(d, c);
        this.sendAjaxRequest(d, c)
    },
    processParams: function(b, a) {
        this.items.each(function(f, c, e) {
            if (!(f instanceof SYNO.SDS.Utils.FormPanel)) {
                return
            }
            var d = f.getForm();
            if ("set" === b && this.applyDirtyOnly && !d.isDirty()) {
                return
            }
            a = f.processParams(b, a)
        }, this);
        return a
    },
    resetAllForm: function() {
        var a = this.getAllForms();
        Ext.each(a, function(d, b, c) {
            d.reset()
        }, this)
    },
    isAnyFormDirty: function() {
        var a = this.getAllForms();
        var b = false;
        Ext.each(a, function(e, c, d) {
            if (e.isDirty()) {
                b = true;
                return false
            }
        }, this);
        return b
    },
    getAjaxCfg: function(a) {
        return {}
    },
    getCompoundCfg: function(a) {
        return {}
    },
    sendAjaxRequest: function(e, d) {
        if ("get" === e) {
            this.setStatusBusy()
        } else {
            this.setStatusBusy({
                text: _T("common", "saving")
            })
        }
        var c = this.getAjaxCfg(e);
        var a = this.getCompoundCfg(e);
        var b = Ext.apply({
            params: {},
            compound: {
                stopwhenerror: false,
                params: d
            },
            scope: this,
            callback: function(h, g, f) {
                this.clearStatusBusy();
                if (h) {
                    this.onApiSuccess(e, g, f)
                } else {
                    this.onApiFailure(e, g, f)
                }
            }
        }, c);
        b.compound = Ext.apply(b.compound, a);
        this.sendWebAPI(b)
    },
    onBeforeRequest: function(e) {
        var b = false;
        this.items.each(function(h, f, g) {
            if (!(h instanceof SYNO.SDS.Utils.FormPanel)) {
                return
            }
            if (!h.onBeforeRequest(e)) {
                b = true;
                return false
            }
        }, this);
        if (b) {
            return false
        }
        if ("get" === e) {
            return true
        }
        if (this.checkFormDirty && !this.isAnyFormDirty()) {
            var d = _T("error", "nochange_subject");
            this.setStatusError({
                text: d,
                clear: true
            });
            return false
        }
        var a = this.getAllForms();
        var c = true;
        Ext.each(a, function(h, f, g) {
            if (!h.isValid()) {
                c = false;
                this.setStatusError({
                    text: _T("common", "forminvalid"),
                    clear: true
                });
                this.setActiveByForm(h, f);
                return false
            }
        }, this);
        return c
    },
    onApiSuccess: function(c, b, a) {
        if ("set" === c) {
            if (!b.has_fail) {
                this.setStatusOK()
            } else {}
        }
        this.processReturnData(c, b, a)
    },
    processReturnData: function(c, b, a) {
        this.items.each(function(g, d, f) {
            if (!(g instanceof SYNO.SDS.Utils.FormPanel)) {
                return
            }
            var e = g.getForm();
            if ("set" === c && this.applyDirtyOnly && !e.isDirty()) {
                return
            }
            g.processReturnData(c, b, a)
        }, this)
    },
    onApiFailure: function(b, a) {},
    onBeforeTabChange: function(d, b, e) {
        if (!b || b.disabled === true) {
            return false
        }
        var c = d.getFooterToolbar();
        if (!c) {
            return true
        }
        var a = c.getEl();
        if (!a) {
            c[b instanceof SYNO.SDS.Utils.FormPanel ? "show" : "hide"]();
            return true
        }
        if (a.parent() && a.parent().hasClass("x-tab-panel-footer")) {
            a = a.parent()
        }
        if (b instanceof SYNO.SDS.Utils.FormPanel) {
            a.show()
        } else {
            a.applyStyles({
                display: "none"
            })
        }
        d.doLayout(false, false);
        return true
    },
    setActiveByForm: function(c, b) {
        var a = this.getAllForms();
        if (Ext.isNumber(b) && this.items.getCount() === a.length) {
            this.setActiveTab(b)
        } else {
            this.items.each(function(g, e, d) {
                if (g.getForm && g.getForm() === c) {
                    this.setActiveTab(e);
                    return false
                }
            }, this)
        }
    },
    onPageDeactivate: function() {
        if (!this.checkFormDirty) {
            return true
        } else {
            if (this.isAnyFormDirty()) {
                return false
            }
        }
        return true
    },
    constructApplyParams: function(g) {
        var h, d = {},
            b = [],
            i, f, c, e, j;
        for (i in g) {
            if (g.hasOwnProperty(i)) {
                h = i.split("|");
                if (h.length != 4) {
                    continue
                }
                f = i.substr(0, i.lastIndexOf("|"));
                c = i.substr(i.lastIndexOf("|") + 1);
                e = g[i];
                if (!d[f]) {
                    d[f] = {}
                }
                d[f][c] = e
            }
        }
        for (f in d) {
            if (d.hasOwnProperty(f)) {
                h = f.split("|");
                j = {
                    api: h[0],
                    method: h[1],
                    version: h[2]
                };
                j.params = SYNO.ux.Utils.getApiParams(j, this.getApiArray("set"));
                for (c in d[f]) {
                    if (d[f].hasOwnProperty(c)) {
                        j.params[c] = d[f][c]
                    }
                }
                b.push(j)
            }
        }
        return b
    },
    clearStatus: function(c) {
        var d = this.getFooterToolbar();
        if (d && Ext.isFunction(d.clearStatus)) {
            d.clearStatus(c)
        }
    },
    clearStatusBusy: function(a) {
        this.clearStatus(a);
        this.unmaskAppWin()
    },
    setStatus: function(d) {
        d = d || {};
        var c = this.getFooterToolbar();
        if (c && Ext.isFunction(c.setStatus)) {
            c.setStatus(d)
        }
    },
    maskAppWin: function() {
        var a = this.findWindow();
        if (a && Ext.isDefined(a.maskForBusy)) {
            a.maskForBusy()
        }
    },
    unmaskAppWin: function() {
        var a = this.findWindow();
        if (a && Ext.isDefined(a.unmask)) {
            a.unmask()
        }
    },
    setStatusBusy: function(b) {
        b = b || {};
        Ext.applyIf(b, {
            text: _T("common", "loading"),
            iconCls: "syno-ux-statusbar-loading"
        });
        this.setStatus(b);
        this.maskAppWin()
    },
    setStatusOK: function(b) {
        b = b || {};
        Ext.applyIf(b, {
            text: _T("common", "setting_applied"),
            iconCls: "syno-ux-statusbar-success",
            clear: true
        });
        this.setStatus(b)
    },
    setStatusError: function(b) {
        b = b || {};
        Ext.applyIf(b, {
            text: _T("common", "error_system"),
            iconCls: "syno-ux-statusbar-error"
        });
        this.setStatus(b)
    }
});
Ext.ns("SYNO.ux");
SYNO.SDS.Utils.FormPanel = Ext.extend(SYNO.ux.FormPanel, {
    module: null,
    constructor: function(a) {
        var b;
        b = Ext.apply({
            checkFormDirty: true,
            trackResetOnLoad: true,
            useStatusBar: a.useDefaultBtn || a.buttons,
            useDefaultBtn: false,
            hideMode: "offsets",
            buttons: true === a.useDefaultBtn ? [{
                xtype: "syno_button",
                btnStyle: "blue",
                disabled: _S("demo_mode"),
                tooltip: _S("demo_mode") ? _JSLIBSTR("uicommon", "error_demo") : "",
                text: _T("common", "commit"),
                scope: this,
                handler: this.applyHandler
            }, {
                xtype: "syno_button",
                btnStyle: "grey",
                text: _T("common", "reset"),
                scope: this,
                handler: this.cancelHandler
            }] : null
        }, a);
        b = this.addStatusBar(b);
        SYNO.SDS.Utils.FormPanel.superclass.constructor.call(this, b)
    },
    addStatusBar: function(a) {
        if (!a.useStatusBar) {
            return a
        }
        var b = {
            xtype: "statusbar",
            defaultText: "&nbsp;",
            statusAlign: "left",
            buttonAlign: "left",
            items: []
        };
        if (a.buttons) {
            b.items = b.items.concat(a.buttons);
            delete a.buttons
        }
        Ext.applyIf(a, {
            fbar: b
        });
        return a
    },
    onBeforeRequest: function(a) {
        return true
    },
    onBeforeAction: function(a, c) {
        if ("get" === c) {
            return true
        }
        if (this.checkFormDirty && !this.isFormDirty()) {
            var b = _T("error", "nochange_subject");
            this.setStatusError({
                text: b,
                clear: true
            });
            return false
        }
        if (!a.isValid()) {
            this.setStatusError({
                text: _T("common", "forminvalid"),
                clear: true
            });
            return false
        }
        return true
    },
    onApiSuccess: function(c, b, a) {
        if ("set" === c) {
            if (!Ext.isBoolean(b.has_fail) || !b.has_fail) {
                this.setStatusOK()
            } else {}
        }
        this.processReturnData(c, b, a)
    },
    processReturnData: function(d, c, b) {
        var a = this.getForm();
        if (b && Ext.isArray(b.compound)) {
            a.loadRecords(c.result, b.compound)
        }
    },
    onApiFailure: function(c, b, a) {
        if ("get" === c) {
            this.reportLoadFail(this.getForm(), c)
        } else {
            if ("set" === c) {
                this.reportFormSubmitFail(this.getForm(), c)
            }
        }
    },
    reportLoadFail: function(a, b) {},
    reportFormSubmitFail: function(a, b) {},
    applyHandler: function(b, a) {
        this.applyForm()
    },
    cancelHandler: function(b, a) {
        this.getForm().reset()
    },
    applyForm: function() {
        var d = "set",
            b = this.getForm();
        if (false === this.onBeforeAction(b, d)) {
            return false
        }
        var a = b.getValues(false, "set");
        var c = this.constructApplyParams(a);
        c = c.concat(this.getApiArray("get"));
        c = this.processParams(d, c);
        this.sendAjaxRequest(d, c)
    },
    upload: function() {
        var b = "set",
            a = this.getForm();
        if (!this.fileUpload || false === this.onBeforeAction(a, b)) {
            return false
        }
        this.setStatusBusy({
            text: _T("common", "saving")
        });
        this.getForm().submit({
            clientValidation: false,
            scope: this,
            callback: function(e, d, c) {
                this.clearStatusBusy();
                if (e) {
                    this.onApiSuccess(b, d, c)
                } else {
                    this.onApiFailure(b, d, c)
                }
            }
        })
    },
    processParams: function(b, a) {
        if ("set" === b) {
            return a
        } else {
            if ("get" === b) {
                return a
            } else {
                return a
            }
        }
    },
    loadForm: function(a) {
        var c = "get",
            b;
        if (false === this.onBeforeAction(this.getForm(), c)) {
            return false
        }
        b = this.getApiArray(c);
        b = this.processParams(c, b);
        this.sendAjaxRequest(c, b)
    },
    getAjaxCfg: function(a) {
        return {}
    },
    getCompoundCfg: function(a) {
        return {}
    },
    sendAjaxRequest: function(e, d) {
        if ("get" === e) {
            this.setStatusBusy()
        } else {
            this.setStatusBusy({
                text: _T("common", "saving")
            })
        }
        var c = this.getAjaxCfg(e);
        var a = this.getCompoundCfg(e);
        var b = Ext.apply({
            fileUpload: false,
            clientValidation: false,
            compound: {
                stopwhenerror: false,
                params: d
            },
            scope: this,
            callback: function(h, g, f) {
                this.clearStatusBusy();
                if (h) {
                    this.onApiSuccess(e, g, f)
                } else {
                    this.onApiFailure(e, g, f)
                }
            }
        }, c);
        b.compound = Ext.apply(b.compound, a);
        this.getForm().submit(b)
    },
    onPageDeactivate: function() {
        if (!this.checkFormDirty) {
            return true
        } else {
            if (this.isFormDirty()) {
                return false
            }
        }
        return true
    },
    isFormDirty: function() {
        return this.getForm().isDirty()
    },
    getAbsoluteURL: function(a) {
        if (!this.module) {
            return a
        }
        return this.module.getAbsoluteURL(a)
    },
    createForm: function() {
        var a = Ext.applyIf({
            appWindow: this,
            listeners: {}
        }, this.initialConfig);
        return new SYNO.API.Form.BasicForm(null, a)
    },
    getApiArray: function(b) {
        var a = SYNO.ux.Utils.getApiArray(this, b, 0, 3);
        a = SYNO.ux.Utils.uniqueApiArray(a);
        return a
    },
    constructApplyParams: function(g) {
        var h, d = {},
            b = [],
            i, f, c, e, j;
        for (i in g) {
            if (g.hasOwnProperty(i)) {
                h = i.split("|");
                if (h.length != 4) {
                    continue
                }
                f = i.substr(0, i.lastIndexOf("|"));
                c = i.substr(i.lastIndexOf("|") + 1);
                e = g[i];
                if (!d[f]) {
                    d[f] = {}
                }
                d[f][c] = e
            }
        }
        for (f in d) {
            if (d.hasOwnProperty(f)) {
                h = f.split("|");
                j = {
                    api: h[0],
                    method: h[1],
                    version: h[2]
                };
                j.params = SYNO.ux.Utils.getApiParams(j, this.getApiArray("set"));
                for (c in d[f]) {
                    if (d[f].hasOwnProperty(c)) {
                        j.params[c] = d[f][c]
                    }
                }
                b.push(j)
            }
        }
        return b
    },
    clearStatus: function(c) {
        var d = this.getFooterToolbar();
        if (d && Ext.isFunction(d.clearStatus)) {
            d.clearStatus(c)
        }
    },
    clearStatusBusy: function(a) {
        this.clearStatus(a);
        this.unmaskAppWin()
    },
    setStatus: function(d) {
        d = d || {};
        var c = this.getFooterToolbar();
        if (c && Ext.isFunction(c.setStatus)) {
            c.setStatus(d)
        }
    },
    maskAppWin: function() {
        var a = this.findWindow();
        if (a && Ext.isDefined(a.maskForBusy)) {
            a.maskForBusy()
        }
    },
    unmaskAppWin: function() {
        var a = this.findWindow();
        if (a && Ext.isDefined(a.unmask)) {
            a.unmask()
        }
    },
    setStatusBusy: function(b) {
        b = b || {};
        Ext.applyIf(b, {
            text: _T("common", "loading"),
            iconCls: "syno-ux-statusbar-loading"
        });
        this.setStatus(b);
        this.maskAppWin()
    },
    setStatusOK: function(b) {
        b = b || {};
        Ext.applyIf(b, {
            text: _T("common", "setting_applied"),
            iconCls: "syno-ux-statusbar-success",
            clear: true
        });
        this.setStatus(b)
    },
    setStatusError: function(b) {
        b = b || {};
        Ext.applyIf(b, {
            text: _T("common", "error_system"),
            iconCls: "syno-ux-statusbar-error"
        });
        this.setStatus(b)
    }
});
SYNO.SDS.CSSTool = {
    supportTransform: function() {
        if (Ext.isIE && !Ext.isIE9p) {
            return false
        }
        return true
    }
};
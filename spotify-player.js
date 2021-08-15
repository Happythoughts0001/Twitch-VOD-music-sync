/* Spotify JS-SDK - v1.9.0-5a61efc */

!(function e(t, r, n) {
    function o(i, a) {
        if (!r[i]) {
            if (!t[i]) {
                var u = "function" == typeof require && require;
                if (!a && u) return u(i, !0);
                if (s) return s(i, !0);
                var c = new Error("Cannot find module '" + i + "'");
                throw ((c.code = "MODULE_NOT_FOUND"), c);
            }
            var _ = (r[i] = { exports: {} });
            t[i][0].call(
                _.exports,
                function (e) {
                    return o(t[i][1][e] || e);
                },
                _,
                _.exports,
                e,
                t,
                r,
                n
            );
        }
        return r[i].exports;
    }
    for (
        var s = "function" == typeof require && require, i = 0;
        i < n.length;
        i++
    )
        o(n[i]);
    return o;
})(
    {
        1: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 });
                var n = e("tslib");
                n.__exportStar(e("./logger"), r),
                    n.__exportStar(e("./promise_resolver"), r),
                    n.__exportStar(e("./user_agent"), r);
            },
            {
                "./logger": 6,
                "./promise_resolver": 8,
                "./user_agent": 9,
                tslib: 12,
            },
        ],
        2: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.LoggingError = void 0);
                var n = e("tslib"),
                    o = (function (e) {
                        function t(t, r, n) {
                            var o = e.call(this, r) || this;
                            return (
                                (o.name = "LoggingError"),
                                (o.code = t),
                                (o.status = n || 0),
                                o
                            );
                        }
                        return n.__extends(t, e), t;
                    })(Error);
                r.LoggingError = o;
            },
            { tslib: 12 },
        ],
        3: [
            function (e, t, r) {
                "use strict";
                function n(e, t) {
                    var r = e.indexOf(t);
                    return -1 === r
                        ? [e, ""]
                        : [e.slice(0, r), e.slice(r + t.length)];
                }
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.urlWithQueryParam = r.splitOnce = void 0),
                    (r.splitOnce = n),
                    (r.urlWithQueryParam = function (e, t, r) {
                        for (
                            var o = n(e, "#"),
                                s = o[0],
                                i = o[1],
                                a = n(s, "?"),
                                u = a[0],
                                c = a[1],
                                _ = i ? "#" + i : "",
                                l = t + "=" + encodeURIComponent(r),
                                f = c.split("&"),
                                E = 0;
                            E < f.length;
                            E++
                        ) {
                            var p = f[E];
                            p.length > 0 &&
                                n(p, "=")[0] !== t &&
                                (l += "&" + p);
                        }
                        return u + "?" + l + _;
                    });
            },
            {},
        ],
        4: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.LoggingErrors = void 0),
                    (function (e) {
                        (e.INVALID_IDENT_DATA = "INVALID_IDENT_DATA"),
                            (e.LOGGING_REQUEST_FAILED =
                                "LOGGING_REQUEST_FAILED");
                    })(r.LoggingErrors || (r.LoggingErrors = {}));
            },
            {},
        ],
        5: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.LogValues = void 0),
                    (r.LogValues = {
                        UNKNOWN: "unknown",
                        EMPTY: "",
                        ZERO: 0,
                        EMPTY_VERSION: "0.0.0",
                    });
            },
            {},
        ],
        6: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 });
                var n = e("tslib");
                n.__exportStar(e("./logger"), r),
                    n.__exportStar(e("./enums/errors"), r),
                    n.__exportStar(e("./enums/log_values"), r);
            },
            {
                "./enums/errors": 4,
                "./enums/log_values": 5,
                "./logger": 7,
                tslib: 12,
            },
        ],
        7: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.MelodyLogger = void 0);
                var n = e("tslib"),
                    o = e("./enums/errors"),
                    s = e("./enums/log_values"),
                    i = e("./_internal/logging_error"),
                    a = e("./_internal/url_utils"),
                    u = (function () {
                        function e(e) {
                            (this._transport = e.transport),
                                (this._endpoint =
                                    e.endpoint || "@webgate/melody"),
                                (this._identData = Promise.all([
                                    e.sdkId,
                                    e.platform,
                                    e.clientVersion,
                                ]).then(function (e) {
                                    var t = e[0],
                                        r = e[1],
                                        n = e[2];
                                    return {
                                        sdk_id: t || s.LogValues.EMPTY,
                                        platform: r || s.LogValues.EMPTY,
                                        client_version:
                                            n || s.LogValues.EMPTY_VERSION,
                                    };
                                }));
                        }
                        return (
                            (e.prototype._assertValidIdentData = function (e) {
                                if (!e.sdk_id)
                                    throw new i.LoggingError(
                                        o.LoggingErrors.INVALID_IDENT_DATA,
                                        "sdkId must be a non-empty string.",
                                        0
                                    );
                                if (!e.platform)
                                    throw new i.LoggingError(
                                        o.LoggingErrors.INVALID_IDENT_DATA,
                                        "platform must be a non-empty string.",
                                        0
                                    );
                            }),
                            (e.prototype._sendLog = function (e, t) {
                                return this.sendLog(e, t);
                            }),
                            (e.prototype.sendLog = function (e, t, r) {
                                var s = this,
                                    u = null == r ? void 0 : r.forget;
                                return this._identData
                                    .then(function (r) {
                                        s._assertValidIdentData(r);
                                        var o = s._endpoint + e,
                                            i = u
                                                ? s._transport.getLastToken()
                                                : null;
                                        return (
                                            i &&
                                                (o = a.urlWithQueryParam(
                                                    o,
                                                    "access_token",
                                                    i
                                                )),
                                            s._transport.request(o, {
                                                method: "POST",
                                                payload: JSON.stringify(
                                                    n.__assign(
                                                        n.__assign({}, t),
                                                        r
                                                    )
                                                ),
                                                forget: u,
                                                retry: {
                                                    maxRetries: 5,
                                                    condition: function (e) {
                                                        return 202 !== e.status;
                                                    },
                                                },
                                            })
                                        );
                                    })
                                    .then(function (e) {
                                        var t = e.status;
                                        return (
                                            !(!u && 202 !== t) ||
                                            Promise.reject(
                                                new i.LoggingError(
                                                    o.LoggingErrors.LOGGING_REQUEST_FAILED,
                                                    "Logging service responded with status " +
                                                        t,
                                                    t
                                                )
                                            )
                                        );
                                    });
                            }),
                            e
                        );
                    })();
                r.MelodyLogger = u;
            },
            {
                "./_internal/logging_error": 2,
                "./_internal/url_utils": 3,
                "./enums/errors": 4,
                "./enums/log_values": 5,
                tslib: 12,
            },
        ],
        8: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.createPromiseResolver = void 0),
                    (r.createPromiseResolver = function () {
                        var e, t;
                        return {
                            promise: new Promise(function (r, n) {
                                (e = r), (t = n);
                            }),
                            resolve: e,
                            reject: t,
                        };
                    });
            },
            {},
        ],
        9: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 });
                var n = e("tslib");
                n.__exportStar(e("./interpolate_ua"), r),
                    n.__exportStar(e("./parse_ua"), r);
            },
            { "./interpolate_ua": 10, "./parse_ua": 11, tslib: 12 },
        ],
        10: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.interpolateUA = void 0);
                var n = e("./parse_ua");
                r.interpolateUA = function (e) {
                    if (!e) return e;
                    var t = n.parseUA(navigator.userAgent, navigator.platform);
                    return e.replace(/\{\{([^}]+?)\}\}/g, function (e, r) {
                        return (
                            (n = r), (o = t) && o.hasOwnProperty(n) ? t[r] : ""
                        );
                        var n, o;
                    });
                };
            },
            { "./parse_ua": 11 },
        ],
        11: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.parseUA = void 0);
                var n = /(edge)[\s\/:]([\w\d\.]+)/,
                    o = new RegExp(
                        "(opera|ie|firefox|chrome|trident|crios|version)[\\s/:]([\\w\\d\\.]+)?.*?(safari|(?:rv[\\s\\/:]|version[\\s\\/:])([\\w\\d\\.]+)|$)"
                    ),
                    s = {};
                r.parseUA = function (e, t) {
                    var r = e.toLowerCase(),
                        i = t ? t.toLowerCase() : "",
                        a = r + ":" + i;
                    if (a in s) return s[a];
                    var u = r.match(n),
                        c = r.match(o) || [null, "unknown", 0],
                        _ = u || c;
                    "trident" === _[1]
                        ? ((_[1] = "ie"), _[4] && (_[2] = _[4]))
                        : "crios" === _[1] && (_[1] = "chrome"),
                        "win" ===
                            (i = r.match(/ip(?:ad|od|hone)/)
                                ? "ios"
                                : (r.match(/(?:webos|android)/) ||
                                      r.match(/mac|win|linux|cros/) || [
                                          "other",
                                      ])[0]) && (i = "windows");
                    var l = "version" === _[1] ? _[3] : _[1],
                        f = "opera" === _[1] && _[4] ? _[4] : _[2],
                        E = {
                            name: l ? l.toString() : "unknown",
                            version: null === f ? "unknown" : f.toString(),
                            platform: i,
                        };
                    return (s[a] = E), E;
                };
            },
            {},
        ],
        12: [
            function (e, t, r) {
                (function (e) {
                    (function () {
                        /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.
    
    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.
    
    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
                        var r,
                            n,
                            o,
                            s,
                            i,
                            a,
                            u,
                            c,
                            _,
                            l,
                            f,
                            E,
                            p,
                            d,
                            g,
                            y,
                            h,
                            v,
                            R,
                            T,
                            m,
                            O,
                            A,
                            M;
                        !(function (r) {
                            var n =
                                "object" == typeof e
                                    ? e
                                    : "object" == typeof self
                                    ? self
                                    : "object" == typeof this
                                    ? this
                                    : {};
                            function o(e, t) {
                                return (
                                    e !== n &&
                                        ("function" == typeof Object.create
                                            ? Object.defineProperty(
                                                  e,
                                                  "__esModule",
                                                  { value: !0 }
                                              )
                                            : (e.__esModule = !0)),
                                    function (r, n) {
                                        return (e[r] = t ? t(r, n) : n);
                                    }
                                );
                            }
                            "function" == typeof define && define.amd
                                ? define("tslib", ["exports"], function (e) {
                                      r(o(n, o(e)));
                                  })
                                : "object" == typeof t &&
                                  "object" == typeof t.exports
                                ? r(o(n, o(t.exports)))
                                : r(o(n));
                        })(function (e) {
                            var t =
                                Object.setPrototypeOf ||
                                ({ __proto__: [] } instanceof Array &&
                                    function (e, t) {
                                        e.__proto__ = t;
                                    }) ||
                                function (e, t) {
                                    for (var r in t)
                                        Object.prototype.hasOwnProperty.call(
                                            t,
                                            r
                                        ) && (e[r] = t[r]);
                                };
                            (r = function (e, r) {
                                if ("function" != typeof r && null !== r)
                                    throw new TypeError(
                                        "Class extends value " +
                                            String(r) +
                                            " is not a constructor or null"
                                    );
                                function n() {
                                    this.constructor = e;
                                }
                                t(e, r),
                                    (e.prototype =
                                        null === r
                                            ? Object.create(r)
                                            : ((n.prototype = r.prototype),
                                              new n()));
                            }),
                                (n =
                                    Object.assign ||
                                    function (e) {
                                        for (
                                            var t, r = 1, n = arguments.length;
                                            r < n;
                                            r++
                                        )
                                            for (var o in (t = arguments[r]))
                                                Object.prototype.hasOwnProperty.call(
                                                    t,
                                                    o
                                                ) && (e[o] = t[o]);
                                        return e;
                                    }),
                                (o = function (e, t) {
                                    var r = {};
                                    for (var n in e)
                                        Object.prototype.hasOwnProperty.call(
                                            e,
                                            n
                                        ) &&
                                            t.indexOf(n) < 0 &&
                                            (r[n] = e[n]);
                                    if (
                                        null != e &&
                                        "function" ==
                                            typeof Object.getOwnPropertySymbols
                                    ) {
                                        var o = 0;
                                        for (
                                            n = Object.getOwnPropertySymbols(e);
                                            o < n.length;
                                            o++
                                        )
                                            t.indexOf(n[o]) < 0 &&
                                                Object.prototype.propertyIsEnumerable.call(
                                                    e,
                                                    n[o]
                                                ) &&
                                                (r[n[o]] = e[n[o]]);
                                    }
                                    return r;
                                }),
                                (s = function (e, t, r, n) {
                                    var o,
                                        s = arguments.length,
                                        i =
                                            s < 3
                                                ? t
                                                : null === n
                                                ? (n =
                                                      Object.getOwnPropertyDescriptor(
                                                          t,
                                                          r
                                                      ))
                                                : n;
                                    if (
                                        "object" == typeof Reflect &&
                                        "function" == typeof Reflect.decorate
                                    )
                                        i = Reflect.decorate(e, t, r, n);
                                    else
                                        for (var a = e.length - 1; a >= 0; a--)
                                            (o = e[a]) &&
                                                (i =
                                                    (s < 3
                                                        ? o(i)
                                                        : s > 3
                                                        ? o(t, r, i)
                                                        : o(t, r)) || i);
                                    return (
                                        s > 3 &&
                                            i &&
                                            Object.defineProperty(t, r, i),
                                        i
                                    );
                                }),
                                (i = function (e, t) {
                                    return function (r, n) {
                                        t(r, n, e);
                                    };
                                }),
                                (a = function (e, t) {
                                    if (
                                        "object" == typeof Reflect &&
                                        "function" == typeof Reflect.metadata
                                    )
                                        return Reflect.metadata(e, t);
                                }),
                                (u = function (e, t, r, n) {
                                    return new (r || (r = Promise))(function (
                                        o,
                                        s
                                    ) {
                                        function i(e) {
                                            try {
                                                u(n.next(e));
                                            } catch (e) {
                                                s(e);
                                            }
                                        }
                                        function a(e) {
                                            try {
                                                u(n.throw(e));
                                            } catch (e) {
                                                s(e);
                                            }
                                        }
                                        function u(e) {
                                            var t;
                                            e.done
                                                ? o(e.value)
                                                : ((t = e.value),
                                                  t instanceof r
                                                      ? t
                                                      : new r(function (e) {
                                                            e(t);
                                                        })).then(i, a);
                                        }
                                        u((n = n.apply(e, t || [])).next());
                                    });
                                }),
                                (c = function (e, t) {
                                    var r,
                                        n,
                                        o,
                                        s,
                                        i = {
                                            label: 0,
                                            sent: function () {
                                                if (1 & o[0]) throw o[1];
                                                return o[1];
                                            },
                                            trys: [],
                                            ops: [],
                                        };
                                    return (
                                        (s = {
                                            next: a(0),
                                            throw: a(1),
                                            return: a(2),
                                        }),
                                        "function" == typeof Symbol &&
                                            (s[Symbol.iterator] = function () {
                                                return this;
                                            }),
                                        s
                                    );
                                    function a(s) {
                                        return function (a) {
                                            return (function (s) {
                                                if (r)
                                                    throw new TypeError(
                                                        "Generator is already executing."
                                                    );
                                                for (; i; )
                                                    try {
                                                        if (
                                                            ((r = 1),
                                                            n &&
                                                                (o =
                                                                    2 & s[0]
                                                                        ? n.return
                                                                        : s[0]
                                                                        ? n.throw ||
                                                                          ((o =
                                                                              n.return) &&
                                                                              o.call(
                                                                                  n
                                                                              ),
                                                                          0)
                                                                        : n.next) &&
                                                                !(o = o.call(
                                                                    n,
                                                                    s[1]
                                                                )).done)
                                                        )
                                                            return o;
                                                        switch (
                                                            ((n = 0),
                                                            o &&
                                                                (s = [
                                                                    2 & s[0],
                                                                    o.value,
                                                                ]),
                                                            s[0])
                                                        ) {
                                                            case 0:
                                                            case 1:
                                                                o = s;
                                                                break;
                                                            case 4:
                                                                return (
                                                                    i.label++,
                                                                    {
                                                                        value: s[1],
                                                                        done: !1,
                                                                    }
                                                                );
                                                            case 5:
                                                                i.label++,
                                                                    (n = s[1]),
                                                                    (s = [0]);
                                                                continue;
                                                            case 7:
                                                                (s =
                                                                    i.ops.pop()),
                                                                    i.trys.pop();
                                                                continue;
                                                            default:
                                                                if (
                                                                    !((o =
                                                                        i.trys),
                                                                    (o =
                                                                        o.length >
                                                                            0 &&
                                                                        o[
                                                                            o.length -
                                                                                1
                                                                        ]) ||
                                                                        (6 !==
                                                                            s[0] &&
                                                                            2 !==
                                                                                s[0]))
                                                                ) {
                                                                    i = 0;
                                                                    continue;
                                                                }
                                                                if (
                                                                    3 ===
                                                                        s[0] &&
                                                                    (!o ||
                                                                        (s[1] >
                                                                            o[0] &&
                                                                            s[1] <
                                                                                o[3]))
                                                                ) {
                                                                    i.label =
                                                                        s[1];
                                                                    break;
                                                                }
                                                                if (
                                                                    6 ===
                                                                        s[0] &&
                                                                    i.label <
                                                                        o[1]
                                                                ) {
                                                                    (i.label =
                                                                        o[1]),
                                                                        (o = s);
                                                                    break;
                                                                }
                                                                if (
                                                                    o &&
                                                                    i.label <
                                                                        o[2]
                                                                ) {
                                                                    (i.label =
                                                                        o[2]),
                                                                        i.ops.push(
                                                                            s
                                                                        );
                                                                    break;
                                                                }
                                                                o[2] &&
                                                                    i.ops.pop(),
                                                                    i.trys.pop();
                                                                continue;
                                                        }
                                                        s = t.call(e, i);
                                                    } catch (e) {
                                                        (s = [6, e]), (n = 0);
                                                    } finally {
                                                        r = o = 0;
                                                    }
                                                if (5 & s[0]) throw s[1];
                                                return {
                                                    value: s[0] ? s[1] : void 0,
                                                    done: !0,
                                                };
                                            })([s, a]);
                                        };
                                    }
                                }),
                                (_ = function (e, t) {
                                    for (var r in e)
                                        "default" === r ||
                                            Object.prototype.hasOwnProperty.call(
                                                t,
                                                r
                                            ) ||
                                            M(t, e, r);
                                }),
                                (M = Object.create
                                    ? function (e, t, r, n) {
                                          void 0 === n && (n = r),
                                              Object.defineProperty(e, n, {
                                                  enumerable: !0,
                                                  get: function () {
                                                      return t[r];
                                                  },
                                              });
                                      }
                                    : function (e, t, r, n) {
                                          void 0 === n && (n = r),
                                              (e[n] = t[r]);
                                      }),
                                (l = function (e) {
                                    var t =
                                            "function" == typeof Symbol &&
                                            Symbol.iterator,
                                        r = t && e[t],
                                        n = 0;
                                    if (r) return r.call(e);
                                    if (e && "number" == typeof e.length)
                                        return {
                                            next: function () {
                                                return (
                                                    e &&
                                                        n >= e.length &&
                                                        (e = void 0),
                                                    {
                                                        value: e && e[n++],
                                                        done: !e,
                                                    }
                                                );
                                            },
                                        };
                                    throw new TypeError(
                                        t
                                            ? "Object is not iterable."
                                            : "Symbol.iterator is not defined."
                                    );
                                }),
                                (f = function (e, t) {
                                    var r =
                                        "function" == typeof Symbol &&
                                        e[Symbol.iterator];
                                    if (!r) return e;
                                    var n,
                                        o,
                                        s = r.call(e),
                                        i = [];
                                    try {
                                        for (
                                            ;
                                            (void 0 === t || t-- > 0) &&
                                            !(n = s.next()).done;

                                        )
                                            i.push(n.value);
                                    } catch (e) {
                                        o = { error: e };
                                    } finally {
                                        try {
                                            n &&
                                                !n.done &&
                                                (r = s.return) &&
                                                r.call(s);
                                        } finally {
                                            if (o) throw o.error;
                                        }
                                    }
                                    return i;
                                }),
                                (E = function () {
                                    for (
                                        var e = [], t = 0;
                                        t < arguments.length;
                                        t++
                                    )
                                        e = e.concat(f(arguments[t]));
                                    return e;
                                }),
                                (p = function () {
                                    for (
                                        var e = 0, t = 0, r = arguments.length;
                                        t < r;
                                        t++
                                    )
                                        e += arguments[t].length;
                                    var n = Array(e),
                                        o = 0;
                                    for (t = 0; t < r; t++)
                                        for (
                                            var s = arguments[t],
                                                i = 0,
                                                a = s.length;
                                            i < a;
                                            i++, o++
                                        )
                                            n[o] = s[i];
                                    return n;
                                }),
                                (d = function (e, t) {
                                    for (
                                        var r = 0, n = t.length, o = e.length;
                                        r < n;
                                        r++, o++
                                    )
                                        e[o] = t[r];
                                    return e;
                                }),
                                (g = function (e) {
                                    return this instanceof g
                                        ? ((this.v = e), this)
                                        : new g(e);
                                }),
                                (y = function (e, t, r) {
                                    if (!Symbol.asyncIterator)
                                        throw new TypeError(
                                            "Symbol.asyncIterator is not defined."
                                        );
                                    var n,
                                        o = r.apply(e, t || []),
                                        s = [];
                                    return (
                                        (n = {}),
                                        i("next"),
                                        i("throw"),
                                        i("return"),
                                        (n[Symbol.asyncIterator] = function () {
                                            return this;
                                        }),
                                        n
                                    );
                                    function i(e) {
                                        o[e] &&
                                            (n[e] = function (t) {
                                                return new Promise(function (
                                                    r,
                                                    n
                                                ) {
                                                    s.push([e, t, r, n]) > 1 ||
                                                        a(e, t);
                                                });
                                            });
                                    }
                                    function a(e, t) {
                                        try {
                                            (r = o[e](t)).value instanceof g
                                                ? Promise.resolve(
                                                      r.value.v
                                                  ).then(u, c)
                                                : _(s[0][2], r);
                                        } catch (e) {
                                            _(s[0][3], e);
                                        }
                                        var r;
                                    }
                                    function u(e) {
                                        a("next", e);
                                    }
                                    function c(e) {
                                        a("throw", e);
                                    }
                                    function _(e, t) {
                                        e(t),
                                            s.shift(),
                                            s.length && a(s[0][0], s[0][1]);
                                    }
                                }),
                                (h = function (e) {
                                    var t, r;
                                    return (
                                        (t = {}),
                                        n("next"),
                                        n("throw", function (e) {
                                            throw e;
                                        }),
                                        n("return"),
                                        (t[Symbol.iterator] = function () {
                                            return this;
                                        }),
                                        t
                                    );
                                    function n(n, o) {
                                        t[n] = e[n]
                                            ? function (t) {
                                                  return (r = !r)
                                                      ? {
                                                            value: g(e[n](t)),
                                                            done:
                                                                "return" === n,
                                                        }
                                                      : o
                                                      ? o(t)
                                                      : t;
                                              }
                                            : o;
                                    }
                                }),
                                (v = function (e) {
                                    if (!Symbol.asyncIterator)
                                        throw new TypeError(
                                            "Symbol.asyncIterator is not defined."
                                        );
                                    var t,
                                        r = e[Symbol.asyncIterator];
                                    return r
                                        ? r.call(e)
                                        : ((e = l(e)),
                                          (t = {}),
                                          n("next"),
                                          n("throw"),
                                          n("return"),
                                          (t[Symbol.asyncIterator] =
                                              function () {
                                                  return this;
                                              }),
                                          t);
                                    function n(r) {
                                        t[r] =
                                            e[r] &&
                                            function (t) {
                                                return new Promise(function (
                                                    n,
                                                    o
                                                ) {
                                                    (function (e, t, r, n) {
                                                        Promise.resolve(n).then(
                                                            function (t) {
                                                                e({
                                                                    value: t,
                                                                    done: r,
                                                                });
                                                            },
                                                            t
                                                        );
                                                    })(
                                                        n,
                                                        o,
                                                        (t = e[r](t)).done,
                                                        t.value
                                                    );
                                                });
                                            };
                                    }
                                }),
                                (R = function (e, t) {
                                    return (
                                        Object.defineProperty
                                            ? Object.defineProperty(e, "raw", {
                                                  value: t,
                                              })
                                            : (e.raw = t),
                                        e
                                    );
                                });
                            var L = Object.create
                                ? function (e, t) {
                                      Object.defineProperty(e, "default", {
                                          enumerable: !0,
                                          value: t,
                                      });
                                  }
                                : function (e, t) {
                                      e.default = t;
                                  };
                            (T = function (e) {
                                if (e && e.__esModule) return e;
                                var t = {};
                                if (null != e)
                                    for (var r in e)
                                        "default" !== r &&
                                            Object.prototype.hasOwnProperty.call(
                                                e,
                                                r
                                            ) &&
                                            M(t, e, r);
                                return L(t, e), t;
                            }),
                                (m = function (e) {
                                    return e && e.__esModule
                                        ? e
                                        : { default: e };
                                }),
                                (O = function (e, t) {
                                    if (!t.has(e))
                                        throw new TypeError(
                                            "attempted to get private field on non-instance"
                                        );
                                    return t.get(e);
                                }),
                                (A = function (e, t, r) {
                                    if (!t.has(e))
                                        throw new TypeError(
                                            "attempted to set private field on non-instance"
                                        );
                                    return t.set(e, r), r;
                                }),
                                e("__extends", r),
                                e("__assign", n),
                                e("__rest", o),
                                e("__decorate", s),
                                e("__param", i),
                                e("__metadata", a),
                                e("__awaiter", u),
                                e("__generator", c),
                                e("__exportStar", _),
                                e("__createBinding", M),
                                e("__values", l),
                                e("__read", f),
                                e("__spread", E),
                                e("__spreadArrays", p),
                                e("__spreadArray", d),
                                e("__await", g),
                                e("__asyncGenerator", y),
                                e("__asyncDelegator", h),
                                e("__asyncValues", v),
                                e("__makeTemplateObject", R),
                                e("__importStar", T),
                                e("__importDefault", m),
                                e("__classPrivateFieldGet", O),
                                e("__classPrivateFieldSet", A);
                        });
                    }.call(this));
                }.call(
                    this,
                    "undefined" != typeof global
                        ? global
                        : "undefined" != typeof self
                        ? self
                        : "undefined" != typeof window
                        ? window
                        : {}
                ));
            },
            {},
        ],
        13: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.Errors = void 0),
                    (function (e) {
                        (e.INVALID_LISTENER = "INVALID_LISTENER"),
                            (e.INVALID_WEBPLAYBACK = "INVALID_WEBPLAYBACK"),
                            (e.NO_BODY = "NO_BODY"),
                            (e.NO_EVENT = "NO_EVENT"),
                            (e.INVALID_OAUTH = "INVALID_OAUTH"),
                            (e.MISSING_IFRAME = "MISSING_IFRAME");
                    })(r.Errors || (r.Errors = {}));
            },
            {},
        ],
        14: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.Events = void 0),
                    (function (e) {
                        (e.SPOTIFY_MESSAGE = "SP_MESSAGE"),
                            (e.ACCOUNT_ERROR = "ACCOUNT_ERROR"),
                            (e.AUTH_ERROR = "AUTH_ERROR"),
                            (e.CONNECT = "CONNECT"),
                            (e.CONNECTED = "CONNECTED"),
                            (e.CURRENT_STATE = "CURRENT_STATE"),
                            (e.DISCONNECT = "DISCONNECT"),
                            (e.EVENT = "EVENT"),
                            (e.GET_CURRENT_STATE = "GET_CURRENT_STATE"),
                            (e.GET_TOKEN = "GET_TOKEN"),
                            (e.GET_VOLUME = "GET_VOLUME"),
                            (e.INIT = "INIT"),
                            (e.LOADED = "LOADED"),
                            (e.NEXT_TRACK = "NEXT_TRACK"),
                            (e.PAUSE = "PAUSE"),
                            (e.PLAYBACK_ERROR = "PLAYBACK_ERROR"),
                            (e.PLAYER_INIT_ERROR = "PLAYER_INIT_ERROR"),
                            (e.PLAYER_READY = "PLAYER_READY"),
                            (e.PLAYER_NOT_READY = "PLAYER_NOT_READY"),
                            (e.PLAYER_STATE_CHANGED = "PLAYER_STATE_CHANGED"),
                            (e.PREV_TRACK = "PREV_TRACK"),
                            (e.RESUME = "RESUME"),
                            (e.SEEK = "SEEK"),
                            (e.SET_NAME = "SET_NAME"),
                            (e.SET_VOLUME = "SET_VOLUME"),
                            (e.TOGGLE_PLAY = "TOGGLE_PLAY"),
                            (e.TOKEN = "TOKEN"),
                            (e.VOLUME = "VOLUME");
                    })(r.Events || (r.Events = {}));
            },
            {},
        ],
        15: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.HumanizedEvents = void 0),
                    (function (e) {
                        (e.ACCOUNT_ERROR = "account_error"),
                            (e.AUTH_ERROR = "authentication_error"),
                            (e.PLAYBACK_ERROR = "playback_error"),
                            (e.PLAYER_INIT_ERROR = "initialization_error"),
                            (e.PLAYER_READY = "ready"),
                            (e.PLAYER_NOT_READY = "not_ready"),
                            (e.PLAYER_STATE_CHANGED = "player_state_changed");
                    })(r.HumanizedEvents || (r.HumanizedEvents = {}));
            },
            {},
        ],
        16: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.Messages = void 0),
                    (function (e) {
                        (e.SPOTIFY_MESSAGE = "SP_MESSAGE"),
                            (e.ACCOUNT_ERROR = "ACCOUNT_ERROR"),
                            (e.AUTH_ERROR = "AUTH_ERROR"),
                            (e.CONNECT = "CONNECT"),
                            (e.CONNECTED = "CONNECTED"),
                            (e.CURRENT_STATE = "CURRENT_STATE"),
                            (e.DISCONNECT = "DISCONNECT"),
                            (e.EVENT = "EVENT"),
                            (e.GET_CURRENT_STATE = "GET_CURRENT_STATE"),
                            (e.GET_TOKEN = "GET_TOKEN"),
                            (e.GET_VOLUME = "GET_VOLUME"),
                            (e.INIT = "INIT"),
                            (e.LOADED = "LOADED"),
                            (e.NEXT_TRACK = "NEXT_TRACK"),
                            (e.PAUSE = "PAUSE"),
                            (e.PLAYBACK_ERROR = "PLAYBACK_ERROR"),
                            (e.PLAYER_INIT_ERROR = "PLAYER_INIT_ERROR"),
                            (e.PLAYER_READY = "PLAYER_READY"),
                            (e.PLAYER_NOT_READY = "PLAYER_NOT_READY"),
                            (e.PLAYER_STATE_CHANGED = "PLAYER_STATE_CHANGED"),
                            (e.PREV_TRACK = "PREV_TRACK"),
                            (e.RESUME = "RESUME"),
                            (e.SEEK = "SEEK"),
                            (e.SET_NAME = "SET_NAME"),
                            (e.SET_VOLUME = "SET_VOLUME"),
                            (e.TOGGLE_PLAY = "TOGGLE_PLAY"),
                            (e.TOKEN = "TOKEN"),
                            (e.VOLUME = "VOLUME");
                    })(r.Messages || (r.Messages = {}));
            },
            {},
        ],
        17: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.PlayerError = void 0);
                var n = e("tslib"),
                    o = (function (e) {
                        function t(t, r) {
                            var n = e.call(this, r) || this;
                            return (
                                (n.code = t),
                                (n.message = r),
                                (n.name = "AnthemError"),
                                n
                            );
                        }
                        return n.__extends(t, e), t;
                    })(Error);
                r.PlayerError = o;
            },
            { tslib: 12 },
        ],
        18: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 });
                var n = e("../enums/errors"),
                    o = e("../error/player_error"),
                    s = e("./player_api");
                function i() {
                    if (!document.body)
                        throw new o.PlayerError(
                            n.Errors.NO_BODY,
                            "Document doesn't have a body"
                        );
                    if (
                        ((window.Spotify = {
                            Player: s.setupPlayerEnv(window),
                        }),
                        window.onSpotifyWebPlaybackSDKReady)
                    )
                        return window.onSpotifyWebPlaybackSDKReady();
                    if (window.onSpotifyPlayerAPIReady)
                        return window.onSpotifyPlayerAPIReady();
                    throw new o.PlayerError(
                        n.Errors.INVALID_WEBPLAYBACK,
                        "onSpotifyWebPlaybackSDKReady is not defined"
                    );
                }
                "complete" === document.readyState
                    ? i()
                    : window.addEventListener("load", i);
            },
            {
                "../enums/errors": 13,
                "../error/player_error": 17,
                "./player_api": 19,
            },
        ],
        19: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.setupPlayerEnv = void 0);
                var n = e("tslib"),
                    o = e("@js-sdk/common"),
                    s = e("../enums/messages"),
                    i = e("../enums/events"),
                    a = e("../enums/humanizedEvents"),
                    u = e("../enums/errors"),
                    c = e("../error/player_error"),
                    _ = e("../shared/message_dispatcher"),
                    l = e("../shared/messages_factory");
                r.setupPlayerEnv = function (e, t) {
                    var r = "https://sdk.scdn.co/embedded/index.html",
                        f = o.createPromiseResolver(),
                        E = _.MessageDispatcher.create(),
                        p =
                            t ||
                            function (t) {
                                var r = e.document.createElement("iframe");
                                return (
                                    (r.src = t),
                                    r.setAttribute(
                                        "alt",
                                        "Audio Playback Container"
                                    ),
                                    r.setAttribute("tabIndex", "-1"),
                                    r.style.setProperty(
                                        "position",
                                        "absolute",
                                        "important"
                                    ),
                                    r.style.setProperty(
                                        "left",
                                        "-1px",
                                        "important"
                                    ),
                                    r.style.setProperty(
                                        "width",
                                        "0",
                                        "important"
                                    ),
                                    r.style.setProperty(
                                        "height",
                                        "0",
                                        "important"
                                    ),
                                    r.style.setProperty(
                                        "border",
                                        "none",
                                        "important"
                                    ),
                                    r.style.setProperty(
                                        "outline",
                                        "none",
                                        "important"
                                    ),
                                    (r.allow = "encrypted-media; autoplay"),
                                    e.document.body.appendChild(r),
                                    r.contentWindow
                                );
                            };
                    E.listen(e, function (t) {
                        t === s.Messages.LOADED &&
                            (E.stopListening(e), f.resolve());
                    });
                    var d = p(r);
                    return (function () {
                        function t(t) {
                            var r,
                                n,
                                o,
                                i,
                                u = this;
                            (this._options = {
                                name:
                                    t.name ||
                                    (null ===
                                        (o = null == e ? void 0 : e.location) ||
                                    void 0 === o
                                        ? void 0
                                        : o.hostname) ||
                                    "",
                                getOAuthToken:
                                    t.getOAuthToken || t.getOauthToken,
                                volume:
                                    null !== (i = t.volume) && void 0 !== i
                                        ? i
                                        : 1,
                            }),
                                (this._handleMessages =
                                    this._handleMessages.bind(this)),
                                (this._eventListeners =
                                    (((r = {})[
                                        a.HumanizedEvents.ACCOUNT_ERROR
                                    ] = []),
                                    (r[a.HumanizedEvents.AUTH_ERROR] = []),
                                    (r[a.HumanizedEvents.PLAYBACK_ERROR] = []),
                                    (r[a.HumanizedEvents.PLAYER_INIT_ERROR] =
                                        []),
                                    (r[a.HumanizedEvents.PLAYER_READY] = []),
                                    (r[a.HumanizedEvents.PLAYER_NOT_READY] =
                                        []),
                                    (r[a.HumanizedEvents.PLAYER_STATE_CHANGED] =
                                        []),
                                    r)),
                                (this._connectionRequests = {}),
                                (this._getCurrentStateRequests = {}),
                                (this._getVolumeRequests = {}),
                                (this._messageHandlers =
                                    (((n = {})[s.Messages.GET_TOKEN] =
                                        this._onGetToken.bind(this)),
                                    (n[s.Messages.EVENT] =
                                        this._onEvent.bind(this)),
                                    (n[s.Messages.CONNECTED] =
                                        this._onConnected.bind(this)),
                                    (n[s.Messages.CURRENT_STATE] =
                                        this._onCurrentState.bind(this)),
                                    (n[s.Messages.VOLUME] =
                                        this._onVolume.bind(this)),
                                    n)),
                                (this.isLoaded = f.promise.then(function () {
                                    E.listen(e, u._handleMessages),
                                        u._sendMessage(
                                            l.messages.init(u._options)
                                        );
                                }));
                        }
                        return (
                            (t.prototype._getListeners = function (e) {
                                return n.__spreadArrays(
                                    this._eventListeners[e]
                                );
                            }),
                            (t.prototype._onEvent = function (e) {
                                this._getListeners(
                                    a.HumanizedEvents[e.name]
                                ).forEach(function (t) {
                                    t(e.eventData);
                                });
                            }),
                            (t.prototype._onGetToken = function (e, t) {
                                var r = this,
                                    n = this._options.getOAuthToken;
                                if ("function" == typeof n)
                                    new Promise(n).then(function (e) {
                                        r._sendMessage(l.messages.token(e, t));
                                    });
                                else {
                                    if (
                                        !this._getListeners(
                                            a.HumanizedEvents.PLAYER_INIT_ERROR
                                        ).length
                                    )
                                        throw new c.PlayerError(
                                            u.Errors.INVALID_OAUTH,
                                            "getOAuthToken is not a function"
                                        );
                                    this._onEvent({
                                        name: i.Events.PLAYER_INIT_ERROR,
                                        eventData: {
                                            message: u.Errors.INVALID_OAUTH,
                                        },
                                    });
                                }
                            }),
                            (t.prototype._onConnected = function (e) {
                                e.ref in this._connectionRequests &&
                                    (this._connectionRequests[e.ref].resolve(
                                        e.connected
                                    ),
                                    delete this._connectionRequests[e.ref]);
                            }),
                            (t.prototype._onCurrentState = function (e) {
                                e.ref in this._getCurrentStateRequests &&
                                    (this._getCurrentStateRequests[
                                        e.ref
                                    ].resolve(e.state),
                                    delete this._getCurrentStateRequests[
                                        e.ref
                                    ]);
                            }),
                            (t.prototype._onVolume = function (e) {
                                e.ref in this._getVolumeRequests &&
                                    (this._getVolumeRequests[e.ref].resolve(
                                        e.volume
                                    ),
                                    delete this._getVolumeRequests[e.ref]);
                            }),
                            (t.prototype._handleMessages = function (e, t, r) {
                                var n, o;
                                null === (o = (n = this._messageHandlers)[e]) ||
                                    void 0 === o ||
                                    o.call(n, t, r);
                            }),
                            (t.prototype._sendMessage = function (e) {
                                return E.send(d, e, r);
                            }),
                            (t.prototype._sendMessageWhenLoaded = function (e) {
                                var t = this;
                                return this.isLoaded.then(function () {
                                    return t._sendMessage(e);
                                });
                            }),
                            (t.prototype.connect = function () {
                                var e = this;
                                return this.isLoaded.then(function () {
                                    var t = e._sendMessage(
                                        l.messages.connect()
                                    );
                                    return (
                                        (e._connectionRequests[t] =
                                            o.createPromiseResolver()),
                                        e._connectionRequests[t].promise
                                    );
                                });
                            }),
                            (t.prototype.on = function (e, t) {
                                return (
                                    -1 === this._eventListeners[e].indexOf(t) &&
                                    (this._eventListeners[e].push(t), !0)
                                );
                            }),
                            (t.prototype.addListener = function (e, t) {
                                return this.on(e, t);
                            }),
                            (t.prototype.removeListener = function (e, t) {
                                var r = this._eventListeners[e];
                                return 1 === arguments.length
                                    ? ((this._eventListeners[e] = []), !0)
                                    : !(!r || !r.length) &&
                                          ((this._eventListeners[e] = r.filter(
                                              function (e) {
                                                  return e !== t;
                                              }
                                          )),
                                          !0);
                            }),
                            (t.prototype.getCurrentState = function () {
                                var e = this;
                                return this.isLoaded.then(function () {
                                    var t = e._sendMessage(
                                        l.messages.getCurrentState()
                                    );
                                    return (
                                        (e._getCurrentStateRequests[t] =
                                            o.createPromiseResolver()),
                                        e._getCurrentStateRequests[t].promise
                                    );
                                });
                            }),
                            (t.prototype.getVolume = function () {
                                var e = this;
                                return this.isLoaded.then(function () {
                                    var t = e._sendMessage(
                                        l.messages.getVolume()
                                    );
                                    return (
                                        (e._getVolumeRequests[t] =
                                            o.createPromiseResolver()),
                                        e._getVolumeRequests[t].promise
                                    );
                                });
                            }),
                            (t.prototype.setName = function (e) {
                                return this._sendMessageWhenLoaded(
                                    l.messages.setName(e)
                                );
                            }),
                            (t.prototype.setVolume = function (e) {
                                return this._sendMessageWhenLoaded(
                                    l.messages.setVolume(e)
                                );
                            }),
                            (t.prototype.pause = function () {
                                return this._sendMessageWhenLoaded(
                                    l.messages.pause()
                                );
                            }),
                            (t.prototype.resume = function () {
                                return this._sendMessageWhenLoaded(
                                    l.messages.resume()
                                );
                            }),
                            (t.prototype.togglePlay = function () {
                                return this._sendMessageWhenLoaded(
                                    l.messages.togglePlay()
                                );
                            }),
                            (t.prototype.seek = function (e) {
                                return this._sendMessageWhenLoaded(
                                    l.messages.seek(e)
                                );
                            }),
                            (t.prototype.previousTrack = function (e) {
                                return this._sendMessageWhenLoaded(
                                    l.messages.previousTrack(e)
                                );
                            }),
                            (t.prototype.nextTrack = function (e) {
                                return this._sendMessageWhenLoaded(
                                    l.messages.nextTrack(e)
                                );
                            }),
                            (t.prototype.disconnect = function () {
                                return this._sendMessageWhenLoaded(
                                    l.messages.disconnect()
                                );
                            }),
                            t
                        );
                    })();
                };
            },
            {
                "../enums/errors": 13,
                "../enums/events": 14,
                "../enums/humanizedEvents": 15,
                "../enums/messages": 16,
                "../error/player_error": 17,
                "../shared/message_dispatcher": 20,
                "../shared/messages_factory": 21,
                "@js-sdk/common": 1,
                tslib: 12,
            },
        ],
        20: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.MessageDispatcher = void 0);
                var n = e("../enums/messages"),
                    o = (function () {
                        function e() {
                            (this._seq = 0),
                                (this._onMessageCallback = function () {}),
                                (this._receiveMessage =
                                    this._receiveMessage.bind(this));
                        }
                        return (
                            (e.create = function () {
                                return new e();
                            }),
                            (e.prototype._addMessageId = function (e) {
                                return (e.seq = this._seq++), e;
                            }),
                            (e.prototype._receiveMessage = function (e) {
                                if (e.data) {
                                    var t = e.data,
                                        r = t.type,
                                        o = t.body,
                                        s = t.seq;
                                    r === n.Messages.SPOTIFY_MESSAGE &&
                                        (null == o ? void 0 : o.topic) &&
                                        this._onMessageCallback(
                                            o.topic,
                                            o.data,
                                            s
                                        );
                                }
                            }),
                            (e.prototype.listen = function (e, t) {
                                (this._onMessageCallback = t),
                                    e.addEventListener(
                                        "message",
                                        this._receiveMessage
                                    );
                            }),
                            (e.prototype.stopListening = function (e) {
                                e.removeEventListener(
                                    "message",
                                    this._receiveMessage
                                );
                            }),
                            (e.prototype.send = function (e, t, r) {
                                void 0 === r && (r = "*");
                                var n = this._addMessageId(t);
                                return e.postMessage(n, r), n.seq;
                            }),
                            e
                        );
                    })();
                r.MessageDispatcher = o;
            },
            { "../enums/messages": 16 },
        ],
        21: [
            function (e, t, r) {
                "use strict";
                Object.defineProperty(r, "__esModule", { value: !0 }),
                    (r.messages = void 0);
                var n = e("../enums/messages"),
                    o = (function () {
                        function e() {}
                        return (
                            (e.create = function () {
                                return new e();
                            }),
                            (e.prototype._createEventMessage = function (e, t) {
                                return this._createMessage(n.Messages.EVENT, {
                                    name: e,
                                    eventData: t,
                                });
                            }),
                            (e.prototype._createMessage = function (e, t) {
                                return {
                                    type: n.Messages.SPOTIFY_MESSAGE,
                                    body: {
                                        topic: e,
                                        data:
                                            void 0 !== t
                                                ? JSON.parse(JSON.stringify(t))
                                                : void 0,
                                    },
                                };
                            }),
                            (e.prototype.accountError = function (e) {
                                return this._createEventMessage(
                                    n.Messages.ACCOUNT_ERROR,
                                    { message: e }
                                );
                            }),
                            (e.prototype.authError = function (e) {
                                return this._createEventMessage(
                                    n.Messages.AUTH_ERROR,
                                    e
                                );
                            }),
                            (e.prototype.playbackError = function (e) {
                                return this._createEventMessage(
                                    n.Messages.PLAYBACK_ERROR,
                                    e
                                );
                            }),
                            (e.prototype.playerReady = function (e) {
                                return this._createEventMessage(
                                    n.Messages.PLAYER_READY,
                                    e
                                );
                            }),
                            (e.prototype.playerNotReady = function (e) {
                                return this._createEventMessage(
                                    n.Messages.PLAYER_NOT_READY,
                                    e
                                );
                            }),
                            (e.prototype.connect = function () {
                                return this._createMessage(n.Messages.CONNECT);
                            }),
                            (e.prototype.connected = function (e, t) {
                                return this._createMessage(
                                    n.Messages.CONNECTED,
                                    { connected: e, ref: t }
                                );
                            }),
                            (e.prototype.disconnect = function () {
                                return this._createMessage(
                                    n.Messages.DISCONNECT
                                );
                            }),
                            (e.prototype.init = function (e) {
                                return this._createMessage(n.Messages.INIT, e);
                            }),
                            (e.prototype.playerInitError = function (e) {
                                return this._createEventMessage(
                                    n.Messages.PLAYER_INIT_ERROR,
                                    e
                                );
                            }),
                            (e.prototype.getToken = function () {
                                return this._createMessage(
                                    n.Messages.GET_TOKEN
                                );
                            }),
                            (e.prototype.token = function (e, t) {
                                return this._createMessage(n.Messages.TOKEN, {
                                    token: e,
                                    ref: t,
                                });
                            }),
                            (e.prototype.pause = function () {
                                return this._createMessage(n.Messages.PAUSE);
                            }),
                            (e.prototype.resume = function () {
                                return this._createMessage(n.Messages.RESUME);
                            }),
                            (e.prototype.togglePlay = function () {
                                return this._createMessage(
                                    n.Messages.TOGGLE_PLAY
                                );
                            }),
                            (e.prototype.seek = function (e) {
                                return this._createMessage(n.Messages.SEEK, e);
                            }),
                            (e.prototype.nextTrack = function (e) {
                                return this._createMessage(
                                    n.Messages.NEXT_TRACK,
                                    e
                                );
                            }),
                            (e.prototype.previousTrack = function (e) {
                                return this._createMessage(
                                    n.Messages.PREV_TRACK,
                                    e
                                );
                            }),
                            (e.prototype.getCurrentState = function () {
                                return this._createMessage(
                                    n.Messages.GET_CURRENT_STATE
                                );
                            }),
                            (e.prototype.currentState = function (e, t) {
                                return this._createMessage(
                                    n.Messages.CURRENT_STATE,
                                    { state: e, ref: t }
                                );
                            }),
                            (e.prototype.playerStateChanged = function (e) {
                                return this._createEventMessage(
                                    n.Messages.PLAYER_STATE_CHANGED,
                                    e
                                );
                            }),
                            (e.prototype.getVolume = function () {
                                return this._createMessage(
                                    n.Messages.GET_VOLUME
                                );
                            }),
                            (e.prototype.volume = function (e, t) {
                                return this._createMessage(n.Messages.VOLUME, {
                                    volume: e,
                                    ref: t,
                                });
                            }),
                            (e.prototype.setVolume = function (e) {
                                return this._createMessage(
                                    n.Messages.SET_VOLUME,
                                    e
                                );
                            }),
                            (e.prototype.setName = function (e) {
                                return this._createMessage(
                                    n.Messages.SET_NAME,
                                    e
                                );
                            }),
                            (e.prototype.embeddedLoaded = function () {
                                return this._createMessage(n.Messages.LOADED);
                            }),
                            e
                        );
                    })();
                r.messages = o.create();
            },
            { "../enums/messages": 16 },
        ],
    },
    {},
    [18]
);

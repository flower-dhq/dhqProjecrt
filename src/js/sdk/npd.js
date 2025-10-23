!(function (e, t) {
  if ("object" == typeof exports && "object" == typeof module)
    module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var n = t();
    for (var r in n) ("object" == typeof exports ? exports : e)[r] = n[r];
  }
})(this, function () {
  return (function (e) {
    function t(r) {
      if (n[r]) return n[r].exports;
      var o = (n[r] = { exports: {}, id: r, loaded: !1 });
      return e[r].call(o.exports, o, o.exports, t), (o.loaded = !0), o.exports;
    }
    var n = {};
    return (t.m = e), (t.c = n), (t.p = ""), t(0);
  })([
    function (e, t, n) {
      "use strict";
      var r = n(1),
        o = n(124),
        i = n(125),
        c = n(126),
        u = n(127),
        s = n(129),
        a = n(130),
        f = n(131),
        l = n(132),
        d = n(133),
        v = n(163),
        h = n(116),
        p = n(71),
        g = n(73),
        y = n(162);
      e.exports = {
        init: r.execute,
        setLockSet: o.execute,
        openLock: c.execute,
        getLockSet: h.getLockSet,
        stopScan: function (e) {
          wx.stopBluetoothDevicesDiscovery({
            success: function (t) {
              p.debug("ble scan stopped"), e();
            },
            fail: function (t) {
              p.error(t), e(t);
            },
          });
        },
        startScanCustom: i.execute,
        openLockByKey: s.execute,
        request: g.post,
        parseAdvertisementData: h.validate,
        lightLift: u.execute,
        getInitialzedUser: h.getLockUserInfo,
        writeDevId: a.write,
        getDevId: f.read,
        setPwd: l.execute,
        openSpec: v.execute,
        http: g,
        util: y,
        testopen: d.testopen,
        scanBikeTag: d.scanTag,
        scanBikeLock: d.scanLock,
        scanBikeLiftA: d.scanLiftA,
        scanBikeLiftB1: d.scanLiftB1,
        scanBikeLiftB2: d.scanLiftB2,
        scanBikeLiftB: d.scanLiftB,
        getBikePower: d.getPower,
        setBikePower: d.setPower,
        setBikeTagGroupId: d.setTagGroupId,
        getBikeTagGroupId: d.getTagGroupId,
        setBikeTagExpire: d.setTagExpire,
        setBikeLockGroupId: d.setLockGroupId,
        getBikeLockGroupId: d.getLockGroupId,
        setBikeLockDateTime: d.setLockDateTime,
        setBikeLiftBType: d.setLiftBType,
        setBikeLiftSize: d.setLiftSize,
        setBikeLiftCoordinateSystem: d.setLiftCoordinateSystem,
        setBikeLiftRssiThreshold: d.setLiftRssiThreshold,
        getBikeLiftRssiThreshold: d.getLiftRssiThreshold,
        switchBikeLiftToSetMode: d.switchLiftToSetMode,
        rebootBikeLift: d.rebootLift,
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o(e, t) {
        a.debug("start to initinalize sdk..");
        var n = l.getLockUserInfo();
        return n && n.oid
          ? (a.debug("load user from storeage :" + (0, s.default)(n)), t(), !0)
          : void i(t);
      }
      function i(e) {
        var t = "sdk.init",
          n = l.getSystemInfo(),
          r = d(),
          o = { rom: n.system, model: n.model, idfa: r };
        f.post(
          t,
          {},
          o,
          function (t) {
            console.log(t);
            var o = t.data.data;
            console.log(o),
              l.saveLockUserInfo({
                rom: n.system,
                model: n.model,
                idfa: r,
                session: o.session,
                oid: o.oid,
              }),
              e();
          },
          function (t) {
            e(t);
          }
        );
      }
      var c = n(2),
        u = (r(c), n(69)),
        s = r(u),
        a = n(71),
        f = n(73),
        l = n(116),
        d =
          (l.BizError,
          function () {
            for (var e = [], t = "0123456789abcdef", n = 0; n < 36; n++)
              e[n] = t.substr(Math.floor(16 * Math.random()), 1);
            (e[14] = "4"),
              (e[19] = t.substr((3 & e[19]) | 8, 1)),
              (e[8] = e[13] = e[18] = e[23] = "-");
            var r = e.join("");
            return r;
          });
      e.exports = { execute: o };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      t.__esModule = !0;
      var o = n(3),
        i = r(o),
        c = n(54),
        u = r(c),
        s =
          "function" == typeof u.default && "symbol" == typeof i.default
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e &&
                  "function" == typeof u.default &&
                  e.constructor === u.default &&
                  e !== u.default.prototype
                  ? "symbol"
                  : typeof e;
              };
      t.default =
        "function" == typeof u.default && "symbol" === s(i.default)
          ? function (e) {
              return "undefined" == typeof e ? "undefined" : s(e);
            }
          : function (e) {
              return e &&
                "function" == typeof u.default &&
                e.constructor === u.default &&
                e !== u.default.prototype
                ? "symbol"
                : "undefined" == typeof e
                ? "undefined"
                : s(e);
            };
    },
    function (e, t, n) {
      e.exports = { default: n(4), __esModule: !0 };
    },
    function (e, t, n) {
      n(5), n(49), (e.exports = n(53).f("iterator"));
    },
    function (e, t, n) {
      "use strict";
      var r = n(6)(!0);
      n(9)(
        String,
        "String",
        function (e) {
          (this._t = String(e)), (this._i = 0);
        },
        function () {
          var e,
            t = this._t,
            n = this._i;
          return n >= t.length
            ? { value: void 0, done: !0 }
            : ((e = r(t, n)), (this._i += e.length), { value: e, done: !1 });
        }
      );
    },
    function (e, t, n) {
      var r = n(7),
        o = n(8);
      e.exports = function (e) {
        return function (t, n) {
          var i,
            c,
            u = String(o(t)),
            s = r(n),
            a = u.length;
          return s < 0 || s >= a
            ? e
              ? ""
              : void 0
            : ((i = u.charCodeAt(s)),
              i < 55296 ||
              i > 56319 ||
              s + 1 === a ||
              (c = u.charCodeAt(s + 1)) < 56320 ||
              c > 57343
                ? e
                  ? u.charAt(s)
                  : i
                : e
                ? u.slice(s, s + 2)
                : ((i - 55296) << 10) + (c - 56320) + 65536);
        };
      };
    },
    function (e, t) {
      var n = Math.ceil,
        r = Math.floor;
      e.exports = function (e) {
        return isNaN((e = +e)) ? 0 : (e > 0 ? r : n)(e);
      };
    },
    function (e, t) {
      e.exports = function (e) {
        if (void 0 == e) throw TypeError("Can't call method on  " + e);
        return e;
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(10),
        o = n(11),
        i = n(27),
        c = n(16),
        u = n(28),
        s = n(29),
        a = n(45),
        f = n(47),
        l = n(46)("iterator"),
        d = !([].keys && "next" in [].keys()),
        v = "@@iterator",
        h = "keys",
        p = "values",
        g = function () {
          return this;
        };
      e.exports = function (e, t, n, y, w, m, b) {
        s(n, t, y);
        var I,
          _,
          S,
          x = function (e) {
            if (!d && e in L) return L[e];
            switch (e) {
              case h:
                return function () {
                  return new n(this, e);
                };
              case p:
                return function () {
                  return new n(this, e);
                };
            }
            return function () {
              return new n(this, e);
            };
          },
          T = t + " Iterator",
          B = w == p,
          C = !1,
          L = e.prototype,
          E = L[l] || L[v] || (w && L[w]),
          k = E || x(w),
          A = w ? (B ? x("entries") : k) : void 0,
          D = "Array" == t ? L.entries || E : E;
        if (
          (D &&
            ((S = f(D.call(new e()))),
            S !== Object.prototype &&
              S.next &&
              (a(S, T, !0), r || "function" == typeof S[l] || c(S, l, g))),
          B &&
            E &&
            E.name !== p &&
            ((C = !0),
            (k = function () {
              return E.call(this);
            })),
          (r && !b) || (!d && !C && L[l]) || c(L, l, k),
          (u[t] = k),
          (u[T] = g),
          w)
        )
          if (
            ((I = { values: B ? k : x(p), keys: m ? k : x(h), entries: A }), b)
          )
            for (_ in I) _ in L || i(L, _, I[_]);
          else o(o.P + o.F * (d || C), t, I);
        return I;
      };
    },
    function (e, t) {
      e.exports = !0;
    },
    function (e, t, n) {
      var r = n(12),
        o = n(13),
        i = n(14),
        c = n(16),
        u = n(26),
        s = "prototype",
        a = function (e, t, n) {
          var f,
            l,
            d,
            v = e & a.F,
            h = e & a.G,
            p = e & a.S,
            g = e & a.P,
            y = e & a.B,
            w = e & a.W,
            m = h ? o : o[t] || (o[t] = {}),
            b = m[s],
            I = h ? r : p ? r[t] : (r[t] || {})[s];
          h && (n = t);
          for (f in n)
            (l = !v && I && void 0 !== I[f]),
              (l && u(m, f)) ||
                ((d = l ? I[f] : n[f]),
                (m[f] =
                  h && "function" != typeof I[f]
                    ? n[f]
                    : y && l
                    ? i(d, r)
                    : w && I[f] == d
                    ? (function (e) {
                        var t = function (t, n, r) {
                          if (this instanceof e) {
                            switch (arguments.length) {
                              case 0:
                                return new e();
                              case 1:
                                return new e(t);
                              case 2:
                                return new e(t, n);
                            }
                            return new e(t, n, r);
                          }
                          return e.apply(this, arguments);
                        };
                        return (t[s] = e[s]), t;
                      })(d)
                    : g && "function" == typeof d
                    ? i(Function.call, d)
                    : d),
                g &&
                  (((m.virtual || (m.virtual = {}))[f] = d),
                  e & a.R && b && !b[f] && c(b, f, d)));
        };
      (a.F = 1),
        (a.G = 2),
        (a.S = 4),
        (a.P = 8),
        (a.B = 16),
        (a.W = 32),
        (a.U = 64),
        (a.R = 128),
        (e.exports = a);
    },
    function (e, t) {
      var n = (e.exports =
        "undefined" != typeof window && window.Math == Math
          ? window
          : "undefined" != typeof self && self.Math == Math
          ? self
          : Function("return this")());
      "number" == typeof __g && (__g = n);
    },
    function (e, t) {
      var n = (e.exports = { version: "2.6.12" });
      "number" == typeof __e && (__e = n);
    },
    function (e, t, n) {
      var r = n(15);
      e.exports = function (e, t, n) {
        if ((r(e), void 0 === t)) return e;
        switch (n) {
          case 1:
            return function (n) {
              return e.call(t, n);
            };
          case 2:
            return function (n, r) {
              return e.call(t, n, r);
            };
          case 3:
            return function (n, r, o) {
              return e.call(t, n, r, o);
            };
        }
        return function () {
          return e.apply(t, arguments);
        };
      };
    },
    function (e, t) {
      e.exports = function (e) {
        if ("function" != typeof e) throw TypeError(e + " is not a function!");
        return e;
      };
    },
    function (e, t, n) {
      var r = n(17),
        o = n(25);
      e.exports = n(21)
        ? function (e, t, n) {
            return r.f(e, t, o(1, n));
          }
        : function (e, t, n) {
            return (e[t] = n), e;
          };
    },
    function (e, t, n) {
      var r = n(18),
        o = n(20),
        i = n(24),
        c = Object.defineProperty;
      t.f = n(21)
        ? Object.defineProperty
        : function (e, t, n) {
            if ((r(e), (t = i(t, !0)), r(n), o))
              try {
                return c(e, t, n);
              } catch (e) {}
            if ("get" in n || "set" in n)
              throw TypeError("Accessors not supported!");
            return "value" in n && (e[t] = n.value), e;
          };
    },
    function (e, t, n) {
      var r = n(19);
      e.exports = function (e) {
        if (!r(e)) throw TypeError(e + " is not an object!");
        return e;
      };
    },
    function (e, t) {
      e.exports = function (e) {
        return "object" == typeof e ? null !== e : "function" == typeof e;
      };
    },
    function (e, t, n) {
      e.exports =
        !n(21) &&
        !n(22)(function () {
          return (
            7 !=
            Object.defineProperty(n(23)("div"), "a", {
              get: function () {
                return 7;
              },
            }).a
          );
        });
    },
    function (e, t, n) {
      e.exports = !n(22)(function () {
        return (
          7 !=
          Object.defineProperty({}, "a", {
            get: function () {
              return 7;
            },
          }).a
        );
      });
    },
    function (e, t) {
      e.exports = function (e) {
        try {
          return !!e();
        } catch (e) {
          return !0;
        }
      };
    },
    function (e, t, n) {
      var r = n(19),
        o = n(12).document,
        i = r(o) && r(o.createElement);
      e.exports = function (e) {
        return i ? o.createElement(e) : {};
      };
    },
    function (e, t, n) {
      var r = n(19);
      e.exports = function (e, t) {
        if (!r(e)) return e;
        var n, o;
        if (t && "function" == typeof (n = e.toString) && !r((o = n.call(e))))
          return o;
        if ("function" == typeof (n = e.valueOf) && !r((o = n.call(e))))
          return o;
        if (!t && "function" == typeof (n = e.toString) && !r((o = n.call(e))))
          return o;
        throw TypeError("Can't convert object to primitive value");
      };
    },
    function (e, t) {
      e.exports = function (e, t) {
        return {
          enumerable: !(1 & e),
          configurable: !(2 & e),
          writable: !(4 & e),
          value: t,
        };
      };
    },
    function (e, t) {
      var n = {}.hasOwnProperty;
      e.exports = function (e, t) {
        return n.call(e, t);
      };
    },
    function (e, t, n) {
      e.exports = n(16);
    },
    function (e, t) {
      e.exports = {};
    },
    function (e, t, n) {
      "use strict";
      var r = n(30),
        o = n(25),
        i = n(45),
        c = {};
      n(16)(c, n(46)("iterator"), function () {
        return this;
      }),
        (e.exports = function (e, t, n) {
          (e.prototype = r(c, { next: o(1, n) })), i(e, t + " Iterator");
        });
    },
    function (e, t, n) {
      var r = n(18),
        o = n(31),
        i = n(43),
        c = n(40)("IE_PROTO"),
        u = function () {},
        s = "prototype",
        a = function () {
          var e,
            t = n(23)("iframe"),
            r = i.length,
            o = "<",
            c = ">";
          for (
            t.style.display = "none",
              n(44).appendChild(t),
              t.src = "javascript:",
              e = t.contentWindow.document,
              e.open(),
              e.write(
                o + "script" + c + "document.F=Object" + o + "/script" + c
              ),
              e.close(),
              a = e.F;
            r--;

          )
            delete a[s][i[r]];
          return a();
        };
      e.exports =
        Object.create ||
        function (e, t) {
          var n;
          return (
            null !== e
              ? ((u[s] = r(e)), (n = new u()), (u[s] = null), (n[c] = e))
              : (n = a()),
            void 0 === t ? n : o(n, t)
          );
        };
    },
    function (e, t, n) {
      var r = n(17),
        o = n(18),
        i = n(32);
      e.exports = n(21)
        ? Object.defineProperties
        : function (e, t) {
            o(e);
            for (var n, c = i(t), u = c.length, s = 0; u > s; )
              r.f(e, (n = c[s++]), t[n]);
            return e;
          };
    },
    function (e, t, n) {
      var r = n(33),
        o = n(43);
      e.exports =
        Object.keys ||
        function (e) {
          return r(e, o);
        };
    },
    function (e, t, n) {
      var r = n(26),
        o = n(34),
        i = n(37)(!1),
        c = n(40)("IE_PROTO");
      e.exports = function (e, t) {
        var n,
          u = o(e),
          s = 0,
          a = [];
        for (n in u) n != c && r(u, n) && a.push(n);
        for (; t.length > s; ) r(u, (n = t[s++])) && (~i(a, n) || a.push(n));
        return a;
      };
    },
    function (e, t, n) {
      var r = n(35),
        o = n(8);
      e.exports = function (e) {
        return r(o(e));
      };
    },
    function (e, t, n) {
      var r = n(36);
      e.exports = Object("z").propertyIsEnumerable(0)
        ? Object
        : function (e) {
            return "String" == r(e) ? e.split("") : Object(e);
          };
    },
    function (e, t) {
      var n = {}.toString;
      e.exports = function (e) {
        return n.call(e).slice(8, -1);
      };
    },
    function (e, t, n) {
      var r = n(34),
        o = n(38),
        i = n(39);
      e.exports = function (e) {
        return function (t, n, c) {
          var u,
            s = r(t),
            a = o(s.length),
            f = i(c, a);
          if (e && n != n) {
            for (; a > f; ) if (((u = s[f++]), u != u)) return !0;
          } else
            for (; a > f; f++)
              if ((e || f in s) && s[f] === n) return e || f || 0;
          return !e && -1;
        };
      };
    },
    function (e, t, n) {
      var r = n(7),
        o = Math.min;
      e.exports = function (e) {
        return e > 0 ? o(r(e), 9007199254740991) : 0;
      };
    },
    function (e, t, n) {
      var r = n(7),
        o = Math.max,
        i = Math.min;
      e.exports = function (e, t) {
        return (e = r(e)), e < 0 ? o(e + t, 0) : i(e, t);
      };
    },
    function (e, t, n) {
      var r = n(41)("keys"),
        o = n(42);
      e.exports = function (e) {
        return r[e] || (r[e] = o(e));
      };
    },
    function (e, t, n) {
      var r = n(13),
        o = n(12),
        i = "__core-js_shared__",
        c = o[i] || (o[i] = {});
      (e.exports = function (e, t) {
        return c[e] || (c[e] = void 0 !== t ? t : {});
      })("versions", []).push({
        version: r.version,
        mode: n(10) ? "pure" : "global",
        copyright: "© 2020 Denis Pushkarev (zloirock.ru)",
      });
    },
    function (e, t) {
      var n = 0,
        r = Math.random();
      e.exports = function (e) {
        return "Symbol(".concat(
          void 0 === e ? "" : e,
          ")_",
          (++n + r).toString(36)
        );
      };
    },
    function (e, t) {
      e.exports =
        "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
          ","
        );
    },
    function (e, t, n) {
      var r = n(12).document;
      e.exports = r && r.documentElement;
    },
    function (e, t, n) {
      var r = n(17).f,
        o = n(26),
        i = n(46)("toStringTag");
      e.exports = function (e, t, n) {
        e &&
          !o((e = n ? e : e.prototype), i) &&
          r(e, i, { configurable: !0, value: t });
      };
    },
    function (e, t, n) {
      var r = n(41)("wks"),
        o = n(42),
        i = n(12).Symbol,
        c = "function" == typeof i,
        u = (e.exports = function (e) {
          return r[e] || (r[e] = (c && i[e]) || (c ? i : o)("Symbol." + e));
        });
      u.store = r;
    },
    function (e, t, n) {
      var r = n(26),
        o = n(48),
        i = n(40)("IE_PROTO"),
        c = Object.prototype;
      e.exports =
        Object.getPrototypeOf ||
        function (e) {
          return (
            (e = o(e)),
            r(e, i)
              ? e[i]
              : "function" == typeof e.constructor && e instanceof e.constructor
              ? e.constructor.prototype
              : e instanceof Object
              ? c
              : null
          );
        };
    },
    function (e, t, n) {
      var r = n(8);
      e.exports = function (e) {
        return Object(r(e));
      };
    },
    function (e, t, n) {
      n(50);
      for (
        var r = n(12),
          o = n(16),
          i = n(28),
          c = n(46)("toStringTag"),
          u =
            "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(
              ","
            ),
          s = 0;
        s < u.length;
        s++
      ) {
        var a = u[s],
          f = r[a],
          l = f && f.prototype;
        l && !l[c] && o(l, c, a), (i[a] = i.Array);
      }
    },
    function (e, t, n) {
      "use strict";
      var r = n(51),
        o = n(52),
        i = n(28),
        c = n(34);
      (e.exports = n(9)(
        Array,
        "Array",
        function (e, t) {
          (this._t = c(e)), (this._i = 0), (this._k = t);
        },
        function () {
          var e = this._t,
            t = this._k,
            n = this._i++;
          return !e || n >= e.length
            ? ((this._t = void 0), o(1))
            : "keys" == t
            ? o(0, n)
            : "values" == t
            ? o(0, e[n])
            : o(0, [n, e[n]]);
        },
        "values"
      )),
        (i.Arguments = i.Array),
        r("keys"),
        r("values"),
        r("entries");
    },
    function (e, t) {
      e.exports = function () {};
    },
    function (e, t) {
      e.exports = function (e, t) {
        return { value: t, done: !!e };
      };
    },
    function (e, t, n) {
      t.f = n(46);
    },
    function (e, t, n) {
      e.exports = { default: n(55), __esModule: !0 };
    },
    function (e, t, n) {
      n(56), n(66), n(67), n(68), (e.exports = n(13).Symbol);
    },
    function (e, t, n) {
      "use strict";
      var r = n(12),
        o = n(26),
        i = n(21),
        c = n(11),
        u = n(27),
        s = n(57).KEY,
        a = n(22),
        f = n(41),
        l = n(45),
        d = n(42),
        v = n(46),
        h = n(53),
        p = n(58),
        g = n(59),
        y = n(62),
        w = n(18),
        m = n(19),
        b = n(48),
        I = n(34),
        _ = n(24),
        S = n(25),
        x = n(30),
        T = n(63),
        B = n(65),
        C = n(60),
        L = n(17),
        E = n(32),
        k = B.f,
        A = L.f,
        D = T.f,
        O = r.Symbol,
        P = r.JSON,
        F = P && P.stringify,
        M = "prototype",
        R = v("_hidden"),
        z = v("toPrimitive"),
        V = {}.propertyIsEnumerable,
        j = f("symbol-registry"),
        N = f("symbols"),
        U = f("op-symbols"),
        K = Object[M],
        G = "function" == typeof O && !!C.f,
        H = r.QObject,
        W = !H || !H[M] || !H[M].findChild,
        Y =
          i &&
          a(function () {
            return (
              7 !=
              x(
                A({}, "a", {
                  get: function () {
                    return A(this, "a", { value: 7 }).a;
                  },
                })
              ).a
            );
          })
            ? function (e, t, n) {
                var r = k(K, t);
                r && delete K[t], A(e, t, n), r && e !== K && A(K, t, r);
              }
            : A,
        J = function (e) {
          var t = (N[e] = x(O[M]));
          return (t._k = e), t;
        },
        X =
          G && "symbol" == typeof O.iterator
            ? function (e) {
                return "symbol" == typeof e;
              }
            : function (e) {
                return e instanceof O;
              },
        q = function (e, t, n) {
          return (
            e === K && q(U, t, n),
            w(e),
            (t = _(t, !0)),
            w(n),
            o(N, t)
              ? (n.enumerable
                  ? (o(e, R) && e[R][t] && (e[R][t] = !1),
                    (n = x(n, { enumerable: S(0, !1) })))
                  : (o(e, R) || A(e, R, S(1, {})), (e[R][t] = !0)),
                Y(e, t, n))
              : A(e, t, n)
          );
        },
        Z = function (e, t) {
          w(e);
          for (var n, r = g((t = I(t))), o = 0, i = r.length; i > o; )
            q(e, (n = r[o++]), t[n]);
          return e;
        },
        Q = function (e, t) {
          return void 0 === t ? x(e) : Z(x(e), t);
        },
        $ = function (e) {
          var t = V.call(this, (e = _(e, !0)));
          return (
            !(this === K && o(N, e) && !o(U, e)) &&
            (!(t || !o(this, e) || !o(N, e) || (o(this, R) && this[R][e])) || t)
          );
        },
        ee = function (e, t) {
          if (((e = I(e)), (t = _(t, !0)), e !== K || !o(N, t) || o(U, t))) {
            var n = k(e, t);
            return (
              !n || !o(N, t) || (o(e, R) && e[R][t]) || (n.enumerable = !0), n
            );
          }
        },
        te = function (e) {
          for (var t, n = D(I(e)), r = [], i = 0; n.length > i; )
            o(N, (t = n[i++])) || t == R || t == s || r.push(t);
          return r;
        },
        ne = function (e) {
          for (
            var t, n = e === K, r = D(n ? U : I(e)), i = [], c = 0;
            r.length > c;

          )
            !o(N, (t = r[c++])) || (n && !o(K, t)) || i.push(N[t]);
          return i;
        };
      G ||
        ((O = function () {
          if (this instanceof O)
            throw TypeError("Symbol is not a constructor!");
          var e = d(arguments.length > 0 ? arguments[0] : void 0),
            t = function (n) {
              this === K && t.call(U, n),
                o(this, R) && o(this[R], e) && (this[R][e] = !1),
                Y(this, e, S(1, n));
            };
          return i && W && Y(K, e, { configurable: !0, set: t }), J(e);
        }),
        u(O[M], "toString", function () {
          return this._k;
        }),
        (B.f = ee),
        (L.f = q),
        (n(64).f = T.f = te),
        (n(61).f = $),
        (C.f = ne),
        i && !n(10) && u(K, "propertyIsEnumerable", $, !0),
        (h.f = function (e) {
          return J(v(e));
        })),
        c(c.G + c.W + c.F * !G, { Symbol: O });
      for (
        var re =
            "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(
              ","
            ),
          oe = 0;
        re.length > oe;

      )
        v(re[oe++]);
      for (var ie = E(v.store), ce = 0; ie.length > ce; ) p(ie[ce++]);
      c(c.S + c.F * !G, "Symbol", {
        for: function (e) {
          return o(j, (e += "")) ? j[e] : (j[e] = O(e));
        },
        keyFor: function (e) {
          if (!X(e)) throw TypeError(e + " is not a symbol!");
          for (var t in j) if (j[t] === e) return t;
        },
        useSetter: function () {
          W = !0;
        },
        useSimple: function () {
          W = !1;
        },
      }),
        c(c.S + c.F * !G, "Object", {
          create: Q,
          defineProperty: q,
          defineProperties: Z,
          getOwnPropertyDescriptor: ee,
          getOwnPropertyNames: te,
          getOwnPropertySymbols: ne,
        });
      var ue = a(function () {
        C.f(1);
      });
      c(c.S + c.F * ue, "Object", {
        getOwnPropertySymbols: function (e) {
          return C.f(b(e));
        },
      }),
        P &&
          c(
            c.S +
              c.F *
                (!G ||
                  a(function () {
                    var e = O();
                    return (
                      "[null]" != F([e]) ||
                      "{}" != F({ a: e }) ||
                      "{}" != F(Object(e))
                    );
                  })),
            "JSON",
            {
              stringify: function (e) {
                for (var t, n, r = [e], o = 1; arguments.length > o; )
                  r.push(arguments[o++]);
                if (((n = t = r[1]), (m(t) || void 0 !== e) && !X(e)))
                  return (
                    y(t) ||
                      (t = function (e, t) {
                        if (
                          ("function" == typeof n && (t = n.call(this, e, t)),
                          !X(t))
                        )
                          return t;
                      }),
                    (r[1] = t),
                    F.apply(P, r)
                  );
              },
            }
          ),
        O[M][z] || n(16)(O[M], z, O[M].valueOf),
        l(O, "Symbol"),
        l(Math, "Math", !0),
        l(r.JSON, "JSON", !0);
    },
    function (e, t, n) {
      var r = n(42)("meta"),
        o = n(19),
        i = n(26),
        c = n(17).f,
        u = 0,
        s =
          Object.isExtensible ||
          function () {
            return !0;
          },
        a = !n(22)(function () {
          return s(Object.preventExtensions({}));
        }),
        f = function (e) {
          c(e, r, { value: { i: "O" + ++u, w: {} } });
        },
        l = function (e, t) {
          if (!o(e))
            return "symbol" == typeof e
              ? e
              : ("string" == typeof e ? "S" : "P") + e;
          if (!i(e, r)) {
            if (!s(e)) return "F";
            if (!t) return "E";
            f(e);
          }
          return e[r].i;
        },
        d = function (e, t) {
          if (!i(e, r)) {
            if (!s(e)) return !0;
            if (!t) return !1;
            f(e);
          }
          return e[r].w;
        },
        v = function (e) {
          return a && h.NEED && s(e) && !i(e, r) && f(e), e;
        },
        h = (e.exports = {
          KEY: r,
          NEED: !1,
          fastKey: l,
          getWeak: d,
          onFreeze: v,
        });
    },
    function (e, t, n) {
      var r = n(12),
        o = n(13),
        i = n(10),
        c = n(53),
        u = n(17).f;
      e.exports = function (e) {
        var t = o.Symbol || (o.Symbol = i ? {} : r.Symbol || {});
        "_" == e.charAt(0) || e in t || u(t, e, { value: c.f(e) });
      };
    },
    function (e, t, n) {
      var r = n(32),
        o = n(60),
        i = n(61);
      e.exports = function (e) {
        var t = r(e),
          n = o.f;
        if (n)
          for (var c, u = n(e), s = i.f, a = 0; u.length > a; )
            s.call(e, (c = u[a++])) && t.push(c);
        return t;
      };
    },
    function (e, t) {
      t.f = Object.getOwnPropertySymbols;
    },
    function (e, t) {
      t.f = {}.propertyIsEnumerable;
    },
    function (e, t, n) {
      var r = n(36);
      e.exports =
        Array.isArray ||
        function (e) {
          return "Array" == r(e);
        };
    },
    function (e, t, n) {
      var r = n(34),
        o = n(64).f,
        i = {}.toString,
        c =
          "object" == typeof window && window && Object.getOwnPropertyNames
            ? Object.getOwnPropertyNames(window)
            : [],
        u = function (e) {
          try {
            return o(e);
          } catch (e) {
            return c.slice();
          }
        };
      e.exports.f = function (e) {
        return c && "[object Window]" == i.call(e) ? u(e) : o(r(e));
      };
    },
    function (e, t, n) {
      var r = n(33),
        o = n(43).concat("length", "prototype");
      t.f =
        Object.getOwnPropertyNames ||
        function (e) {
          return r(e, o);
        };
    },
    function (e, t, n) {
      var r = n(61),
        o = n(25),
        i = n(34),
        c = n(24),
        u = n(26),
        s = n(20),
        a = Object.getOwnPropertyDescriptor;
      t.f = n(21)
        ? a
        : function (e, t) {
            if (((e = i(e)), (t = c(t, !0)), s))
              try {
                return a(e, t);
              } catch (e) {}
            if (u(e, t)) return o(!r.f.call(e, t), e[t]);
          };
    },
    function (e, t) {},
    function (e, t, n) {
      n(58)("asyncIterator");
    },
    function (e, t, n) {
      n(58)("observable");
    },
    function (e, t, n) {
      e.exports = { default: n(70), __esModule: !0 };
    },
    function (e, t, n) {
      var r = n(13),
        o = r.JSON || (r.JSON = { stringify: JSON.stringify });
      e.exports = function (e) {
        return o.stringify.apply(o, arguments);
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o(e) {
        var t = 6e4 * new Date().getTimezoneOffset(),
          n = new Date(Date.now() - t).toISOString();
        "object" === ("undefined" == typeof e ? "undefined" : (0, s.default)(e))
          ? console.log("[" + n + "]" + (0, c.default)(e))
          : console.log("[" + n + "]" + e);
      }
      var i = n(69),
        c = r(i),
        u = n(2),
        s = r(u),
        a = n(72);
      e.exports = {
        debug: function (e) {
          a.isDebug && o(e);
        },
        info: function (e) {
          o(e);
        },
        error: function (e) {
          o(e);
        },
      };
    },
    function (e, t) {
      "use strict";
      e.exports = {
        caller: "lope_sdk",
        secretKey: "TRE%$Yj98ut108ytgf",
        pid: "utjgh4765ufgmbjiyo",
        appId: "com.lope.smartlife.miniprogram",
        appName: "智锁iKEY小程序SDK",
        appVersion: "2.2.0",
        isDebug: !0,
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o(e, t, n, r, o) {
        var i = (0, p.default)({}, y, n);
        g.debug(
          "url: " +
            e +
            ", data:" +
            (0, v.default)(t) +
            ", client: " +
            (0, v.default)(i)
        );
        var s = e.startsWith("http") ? e : b + e,
          a = {
            id: c(),
            sign: u(i.caller, i.secretKey, t),
            client: (0, p.default)(
              {
                caller: i.caller,
                pid: i.pid,
                app_id: i.appId,
                app_name: i.appName,
                app_version: i.appVersion,
                ts: Date.now() / 1e3,
                version: "1.2.3",
                platform: 3,
                mini_app_id: m,
              },
              n
            ),
            data: t,
          };
        wx.request({
          url: s,
          data: a,
          method: "POST",
          header: { "content-type": "application/octet-stream" },
          success: function (e) {
            r(e);
          },
          fail: function (e) {
            g.debug(e), o(e);
          },
        });
      }
      function i(e, t, n) {
        var r = n || {};
        console.log(n);
        var o = (0, p.default)({}, y, r);
        console.log(
          "url: " +
            e +
            ", data:" +
            (0, v.default)(t) +
            ", client: " +
            (0, v.default)(o)
        );
        var i = {
            id: c(),
            sign: u(o.caller, o.secretKey, t),
            client: (0, p.default)(
              {
                caller: o.caller,
                pid: o.pid,
                app_id: o.appId,
                app_name: o.appName,
                app_version: o.appVersion,
                ts: Date.now() / 1e3,
                version: "1.0.2",
                platform: 3,
                mini_app_id: m,
              },
              r
            ),
            data: t,
          },
          s = e.startsWith("http") ? e : b + e;
        return (
          console.log(s),
          new l.default(function (e, t) {
            wx.request({
              url: s,
              data: i,
              method: "POST",
              header: { "content-type": "application/octet-stream" },
              success: function (t) {
                e(t);
              },
              fail: function (e) {
                g.debug(e), t(e);
              },
            });
          })
        );
      }
      function c() {
        for (
          var e = "",
            t =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            n = 0;
          n < 20;
          n++
        ) {
          var r = Math.floor(62 * Math.random());
          e += t[r];
        }
        return e;
      }
      function u(e, t, n) {
        if (n) {
          var r = s(n),
            o = "",
            i = "";
          for (var c in r) (i = r[c]), (o = o + i + "=" + a(n[i]));
          g.debug("dataStr = " + o);
          var u = w.MD5(e + o + t);
          return g.debug("sign = " + u), u;
        }
        return w.MD5(e + t);
      }
      function s(e) {
        var t = [];
        for (var n in e) t.push(n);
        return t.sort(), t;
      }
      function a(e) {
        if (0 === e) return "0";
        if (!e) return "";
        if (Array.isArray(e)) {
          var t = [];
          for (var n in e) t.push(a(e[n]));
          return t.join(",");
        }
        return "string" == typeof e ? e : (0, v.default)(e);
      }
      var f = n(74),
        l = r(f),
        d = n(69),
        v = r(d),
        h = n(96),
        p = r(h),
        g = n(71),
        y = n(72),
        w = n(100).Crypto,
        m = wx.getAccountInfoSync().miniProgram.appId,
        b = "https://www.lopetech.net/api/ikey/sdk/";
      e.exports = { post: o, asyncPost: i };
    },
    function (e, t, n) {
      e.exports = { default: n(75), __esModule: !0 };
    },
    function (e, t, n) {
      n(66), n(5), n(49), n(76), n(94), n(95), (e.exports = n(13).Promise);
    },
    function (e, t, n) {
      "use strict";
      var r,
        o,
        i,
        c,
        u = n(10),
        s = n(12),
        a = n(14),
        f = n(77),
        l = n(11),
        d = n(19),
        v = n(15),
        h = n(78),
        p = n(79),
        g = n(83),
        y = n(84).set,
        w = n(86)(),
        m = n(87),
        b = n(88),
        I = n(89),
        _ = n(90),
        S = "Promise",
        x = s.TypeError,
        T = s.process,
        B = T && T.versions,
        C = (B && B.v8) || "",
        L = s[S],
        E = "process" == f(T),
        k = function () {},
        A = (o = m.f),
        D = !!(function () {
          try {
            var e = L.resolve(1),
              t = ((e.constructor = {})[n(46)("species")] = function (e) {
                e(k, k);
              });
            return (
              (E || "function" == typeof PromiseRejectionEvent) &&
              e.then(k) instanceof t &&
              0 !== C.indexOf("6.6") &&
              I.indexOf("Chrome/66") === -1
            );
          } catch (e) {}
        })(),
        O = function (e) {
          var t;
          return !(!d(e) || "function" != typeof (t = e.then)) && t;
        },
        P = function (e, t) {
          if (!e._n) {
            e._n = !0;
            var n = e._c;
            w(function () {
              for (
                var r = e._v,
                  o = 1 == e._s,
                  i = 0,
                  c = function (t) {
                    var n,
                      i,
                      c,
                      u = o ? t.ok : t.fail,
                      s = t.resolve,
                      a = t.reject,
                      f = t.domain;
                    try {
                      u
                        ? (o || (2 == e._h && R(e), (e._h = 1)),
                          u === !0
                            ? (n = r)
                            : (f && f.enter(),
                              (n = u(r)),
                              f && (f.exit(), (c = !0))),
                          n === t.promise
                            ? a(x("Promise-chain cycle"))
                            : (i = O(n))
                            ? i.call(n, s, a)
                            : s(n))
                        : a(r);
                    } catch (e) {
                      f && !c && f.exit(), a(e);
                    }
                  };
                n.length > i;

              )
                c(n[i++]);
              (e._c = []), (e._n = !1), t && !e._h && F(e);
            });
          }
        },
        F = function (e) {
          y.call(s, function () {
            var t,
              n,
              r,
              o = e._v,
              i = M(e);
            if (
              (i &&
                ((t = b(function () {
                  E
                    ? T.emit("unhandledRejection", o, e)
                    : (n = s.onunhandledrejection)
                    ? n({ promise: e, reason: o })
                    : (r = s.console) &&
                      r.error &&
                      r.error("Unhandled promise rejection", o);
                })),
                (e._h = E || M(e) ? 2 : 1)),
              (e._a = void 0),
              i && t.e)
            )
              throw t.v;
          });
        },
        M = function (e) {
          return 1 !== e._h && 0 === (e._a || e._c).length;
        },
        R = function (e) {
          y.call(s, function () {
            var t;
            E
              ? T.emit("rejectionHandled", e)
              : (t = s.onrejectionhandled) && t({ promise: e, reason: e._v });
          });
        },
        z = function (e) {
          var t = this;
          t._d ||
            ((t._d = !0),
            (t = t._w || t),
            (t._v = e),
            (t._s = 2),
            t._a || (t._a = t._c.slice()),
            P(t, !0));
        },
        V = function (e) {
          var t,
            n = this;
          if (!n._d) {
            (n._d = !0), (n = n._w || n);
            try {
              if (n === e) throw x("Promise can't be resolved itself");
              (t = O(e))
                ? w(function () {
                    var r = { _w: n, _d: !1 };
                    try {
                      t.call(e, a(V, r, 1), a(z, r, 1));
                    } catch (e) {
                      z.call(r, e);
                    }
                  })
                : ((n._v = e), (n._s = 1), P(n, !1));
            } catch (e) {
              z.call({ _w: n, _d: !1 }, e);
            }
          }
        };
      D ||
        ((L = function (e) {
          h(this, L, S, "_h"), v(e), r.call(this);
          try {
            e(a(V, this, 1), a(z, this, 1));
          } catch (e) {
            z.call(this, e);
          }
        }),
        (r = function (e) {
          (this._c = []),
            (this._a = void 0),
            (this._s = 0),
            (this._d = !1),
            (this._v = void 0),
            (this._h = 0),
            (this._n = !1);
        }),
        (r.prototype = n(91)(L.prototype, {
          then: function (e, t) {
            var n = A(g(this, L));
            return (
              (n.ok = "function" != typeof e || e),
              (n.fail = "function" == typeof t && t),
              (n.domain = E ? T.domain : void 0),
              this._c.push(n),
              this._a && this._a.push(n),
              this._s && P(this, !1),
              n.promise
            );
          },
          catch: function (e) {
            return this.then(void 0, e);
          },
        })),
        (i = function () {
          var e = new r();
          (this.promise = e),
            (this.resolve = a(V, e, 1)),
            (this.reject = a(z, e, 1));
        }),
        (m.f = A =
          function (e) {
            return e === L || e === c ? new i(e) : o(e);
          })),
        l(l.G + l.W + l.F * !D, { Promise: L }),
        n(45)(L, S),
        n(92)(S),
        (c = n(13)[S]),
        l(l.S + l.F * !D, S, {
          reject: function (e) {
            var t = A(this),
              n = t.reject;
            return n(e), t.promise;
          },
        }),
        l(l.S + l.F * (u || !D), S, {
          resolve: function (e) {
            return _(u && this === c ? L : this, e);
          },
        }),
        l(
          l.S +
            l.F *
              !(
                D &&
                n(93)(function (e) {
                  L.all(e).catch(k);
                })
              ),
          S,
          {
            all: function (e) {
              var t = this,
                n = A(t),
                r = n.resolve,
                o = n.reject,
                i = b(function () {
                  var n = [],
                    i = 0,
                    c = 1;
                  p(e, !1, function (e) {
                    var u = i++,
                      s = !1;
                    n.push(void 0),
                      c++,
                      t.resolve(e).then(function (e) {
                        s || ((s = !0), (n[u] = e), --c || r(n));
                      }, o);
                  }),
                    --c || r(n);
                });
              return i.e && o(i.v), n.promise;
            },
            race: function (e) {
              var t = this,
                n = A(t),
                r = n.reject,
                o = b(function () {
                  p(e, !1, function (e) {
                    t.resolve(e).then(n.resolve, r);
                  });
                });
              return o.e && r(o.v), n.promise;
            },
          }
        );
    },
    function (e, t, n) {
      var r = n(36),
        o = n(46)("toStringTag"),
        i =
          "Arguments" ==
          r(
            (function () {
              return arguments;
            })()
          ),
        c = function (e, t) {
          try {
            return e[t];
          } catch (e) {}
        };
      e.exports = function (e) {
        var t, n, u;
        return void 0 === e
          ? "Undefined"
          : null === e
          ? "Null"
          : "string" == typeof (n = c((t = Object(e)), o))
          ? n
          : i
          ? r(t)
          : "Object" == (u = r(t)) && "function" == typeof t.callee
          ? "Arguments"
          : u;
      };
    },
    function (e, t) {
      e.exports = function (e, t, n, r) {
        if (!(e instanceof t) || (void 0 !== r && r in e))
          throw TypeError(n + ": incorrect invocation!");
        return e;
      };
    },
    function (e, t, n) {
      var r = n(14),
        o = n(80),
        i = n(81),
        c = n(18),
        u = n(38),
        s = n(82),
        a = {},
        f = {},
        t = (e.exports = function (e, t, n, l, d) {
          var v,
            h,
            p,
            g,
            y = d
              ? function () {
                  return e;
                }
              : s(e),
            w = r(n, l, t ? 2 : 1),
            m = 0;
          if ("function" != typeof y) throw TypeError(e + " is not iterable!");
          if (i(y)) {
            for (v = u(e.length); v > m; m++)
              if (
                ((g = t ? w(c((h = e[m]))[0], h[1]) : w(e[m])),
                g === a || g === f)
              )
                return g;
          } else
            for (p = y.call(e); !(h = p.next()).done; )
              if (((g = o(p, w, h.value, t)), g === a || g === f)) return g;
        });
      (t.BREAK = a), (t.RETURN = f);
    },
    function (e, t, n) {
      var r = n(18);
      e.exports = function (e, t, n, o) {
        try {
          return o ? t(r(n)[0], n[1]) : t(n);
        } catch (t) {
          var i = e.return;
          throw (void 0 !== i && r(i.call(e)), t);
        }
      };
    },
    function (e, t, n) {
      var r = n(28),
        o = n(46)("iterator"),
        i = Array.prototype;
      e.exports = function (e) {
        return void 0 !== e && (r.Array === e || i[o] === e);
      };
    },
    function (e, t, n) {
      var r = n(77),
        o = n(46)("iterator"),
        i = n(28);
      e.exports = n(13).getIteratorMethod = function (e) {
        if (void 0 != e) return e[o] || e["@@iterator"] || i[r(e)];
      };
    },
    function (e, t, n) {
      var r = n(18),
        o = n(15),
        i = n(46)("species");
      e.exports = function (e, t) {
        var n,
          c = r(e).constructor;
        return void 0 === c || void 0 == (n = r(c)[i]) ? t : o(n);
      };
    },
    function (e, t, n) {
      var r,
        o,
        i,
        c = n(14),
        u = n(85),
        s = n(44),
        a = n(23),
        f = n(12),
        l = f.process,
        d = f.setImmediate,
        v = f.clearImmediate,
        h = f.MessageChannel,
        p = f.Dispatch,
        g = 0,
        y = {},
        w = "onreadystatechange",
        m = function () {
          var e = +this;
          if (y.hasOwnProperty(e)) {
            var t = y[e];
            delete y[e], t();
          }
        },
        b = function (e) {
          m.call(e.data);
        };
      (d && v) ||
        ((d = function (e) {
          for (var t = [], n = 1; arguments.length > n; )
            t.push(arguments[n++]);
          return (
            (y[++g] = function () {
              u("function" == typeof e ? e : Function(e), t);
            }),
            r(g),
            g
          );
        }),
        (v = function (e) {
          delete y[e];
        }),
        "process" == n(36)(l)
          ? (r = function (e) {
              l.nextTick(c(m, e, 1));
            })
          : p && p.now
          ? (r = function (e) {
              p.now(c(m, e, 1));
            })
          : h
          ? ((o = new h()),
            (i = o.port2),
            (o.port1.onmessage = b),
            (r = c(i.postMessage, i, 1)))
          : f.addEventListener &&
            "function" == typeof postMessage &&
            !f.importScripts
          ? ((r = function (e) {
              f.postMessage(e + "", "*");
            }),
            f.addEventListener("message", b, !1))
          : (r =
              w in a("script")
                ? function (e) {
                    s.appendChild(a("script"))[w] = function () {
                      s.removeChild(this), m.call(e);
                    };
                  }
                : function (e) {
                    setTimeout(c(m, e, 1), 0);
                  })),
        (e.exports = { set: d, clear: v });
    },
    function (e, t) {
      e.exports = function (e, t, n) {
        var r = void 0 === n;
        switch (t.length) {
          case 0:
            return r ? e() : e.call(n);
          case 1:
            return r ? e(t[0]) : e.call(n, t[0]);
          case 2:
            return r ? e(t[0], t[1]) : e.call(n, t[0], t[1]);
          case 3:
            return r ? e(t[0], t[1], t[2]) : e.call(n, t[0], t[1], t[2]);
          case 4:
            return r
              ? e(t[0], t[1], t[2], t[3])
              : e.call(n, t[0], t[1], t[2], t[3]);
        }
        return e.apply(n, t);
      };
    },
    function (e, t, n) {
      var r = n(12),
        o = n(84).set,
        i = r.MutationObserver || r.WebKitMutationObserver,
        c = r.process,
        u = r.Promise,
        s = "process" == n(36)(c);
      e.exports = function () {
        var e,
          t,
          n,
          a = function () {
            var r, o;
            for (s && (r = c.domain) && r.exit(); e; ) {
              (o = e.fn), (e = e.next);
              try {
                o();
              } catch (r) {
                throw (e ? n() : (t = void 0), r);
              }
            }
            (t = void 0), r && r.enter();
          };
        if (s)
          n = function () {
            c.nextTick(a);
          };
        else if (!i || (r.navigator && r.navigator.standalone))
          if (u && u.resolve) {
            var f = u.resolve(void 0);
            n = function () {
              f.then(a);
            };
          } else
            n = function () {
              o.call(r, a);
            };
        else {
          var l = !0,
            d = document.createTextNode("");
          new i(a).observe(d, { characterData: !0 }),
            (n = function () {
              d.data = l = !l;
            });
        }
        return function (r) {
          var o = { fn: r, next: void 0 };
          t && (t.next = o), e || ((e = o), n()), (t = o);
        };
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        var t, n;
        (this.promise = new e(function (e, r) {
          if (void 0 !== t || void 0 !== n)
            throw TypeError("Bad Promise constructor");
          (t = e), (n = r);
        })),
          (this.resolve = o(t)),
          (this.reject = o(n));
      }
      var o = n(15);
      e.exports.f = function (e) {
        return new r(e);
      };
    },
    function (e, t) {
      e.exports = function (e) {
        try {
          return { e: !1, v: e() };
        } catch (e) {
          return { e: !0, v: e };
        }
      };
    },
    function (e, t, n) {
      var r = n(12),
        o = r.navigator;
      e.exports = (o && o.userAgent) || "";
    },
    function (e, t, n) {
      var r = n(18),
        o = n(19),
        i = n(87);
      e.exports = function (e, t) {
        if ((r(e), o(t) && t.constructor === e)) return t;
        var n = i.f(e),
          c = n.resolve;
        return c(t), n.promise;
      };
    },
    function (e, t, n) {
      var r = n(16);
      e.exports = function (e, t, n) {
        for (var o in t) n && e[o] ? (e[o] = t[o]) : r(e, o, t[o]);
        return e;
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(12),
        o = n(13),
        i = n(17),
        c = n(21),
        u = n(46)("species");
      e.exports = function (e) {
        var t = "function" == typeof o[e] ? o[e] : r[e];
        c &&
          t &&
          !t[u] &&
          i.f(t, u, {
            configurable: !0,
            get: function () {
              return this;
            },
          });
      };
    },
    function (e, t, n) {
      var r = n(46)("iterator"),
        o = !1;
      try {
        var i = [7][r]();
        (i.return = function () {
          o = !0;
        }),
          Array.from(i, function () {
            throw 2;
          });
      } catch (e) {}
      e.exports = function (e, t) {
        if (!t && !o) return !1;
        var n = !1;
        try {
          var i = [7],
            c = i[r]();
          (c.next = function () {
            return { done: (n = !0) };
          }),
            (i[r] = function () {
              return c;
            }),
            e(i);
        } catch (e) {}
        return n;
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(11),
        o = n(13),
        i = n(12),
        c = n(83),
        u = n(90);
      r(r.P + r.R, "Promise", {
        finally: function (e) {
          var t = c(this, o.Promise || i.Promise),
            n = "function" == typeof e;
          return this.then(
            n
              ? function (n) {
                  return u(t, e()).then(function () {
                    return n;
                  });
                }
              : e,
            n
              ? function (n) {
                  return u(t, e()).then(function () {
                    throw n;
                  });
                }
              : e
          );
        },
      });
    },
    function (e, t, n) {
      "use strict";
      var r = n(11),
        o = n(87),
        i = n(88);
      r(r.S, "Promise", {
        try: function (e) {
          var t = o.f(this),
            n = i(e);
          return (n.e ? t.reject : t.resolve)(n.v), t.promise;
        },
      });
    },
    function (e, t, n) {
      e.exports = { default: n(97), __esModule: !0 };
    },
    function (e, t, n) {
      n(98), (e.exports = n(13).Object.assign);
    },
    function (e, t, n) {
      var r = n(11);
      r(r.S + r.F, "Object", { assign: n(99) });
    },
    function (e, t, n) {
      "use strict";
      var r = n(21),
        o = n(32),
        i = n(60),
        c = n(61),
        u = n(48),
        s = n(35),
        a = Object.assign;
      e.exports =
        !a ||
        n(22)(function () {
          var e = {},
            t = {},
            n = Symbol(),
            r = "abcdefghijklmnopqrst";
          return (
            (e[n] = 7),
            r.split("").forEach(function (e) {
              t[e] = e;
            }),
            7 != a({}, e)[n] || Object.keys(a({}, t)).join("") != r
          );
        })
          ? function (e, t) {
              for (
                var n = u(e), a = arguments.length, f = 1, l = i.f, d = c.f;
                a > f;

              )
                for (
                  var v,
                    h = s(arguments[f++]),
                    p = l ? o(h).concat(l(h)) : o(h),
                    g = p.length,
                    y = 0;
                  g > y;

                )
                  (v = p[y++]), (r && !d.call(h, v)) || (n[v] = h[v]);
              return n;
            }
          : a;
    },
    function (e, t, n) {
      "use strict";
      var r = (t.Crypto = n(101).Crypto);
      [
        "CryptoMath",
        "BlockModes",
        "DES",
        "AES",
        "HMAC",
        "MARC4",
        "MD5",
        "PBKDF2",
        "PBKDF2Async",
        "Rabbit",
        "SHA1",
        "SHA256",
      ].forEach(function (e) {
        n(102)("./" + e);
      }),
        (e.exports.Crypto = r);
    },
    function (e, t) {
      "use strict";
      ("undefined" != typeof Crypto && Crypto.util) ||
        !(function () {
          var n =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            r =
              "undefined" == typeof window
                ? (t.Crypto = {})
                : (window.Crypto = {}),
            o = (r.util = {
              rotl: function (e, t) {
                return (e << t) | (e >>> (32 - t));
              },
              rotr: function (e, t) {
                return (e << (32 - t)) | (e >>> t);
              },
              endian: function (e) {
                if (e.constructor == Number)
                  return (
                    (16711935 & o.rotl(e, 8)) | (4278255360 & o.rotl(e, 24))
                  );
                for (var t = 0; t < e.length; t++) e[t] = o.endian(e[t]);
                return e;
              },
              randomBytes: function (e) {
                for (var t = []; e > 0; e--)
                  t.push(Math.floor(256 * Math.random()));
                return t;
              },
              bytesToWords: function (e) {
                for (var t = [], n = 0, r = 0; n < e.length; n++, r += 8)
                  t[r >>> 5] |= (255 & e[n]) << (24 - (r % 32));
                return t;
              },
              wordsToBytes: function (e) {
                for (var t = [], n = 0; n < 32 * e.length; n += 8)
                  t.push((e[n >>> 5] >>> (24 - (n % 32))) & 255);
                return t;
              },
              bytesToHex: function (e) {
                for (var t = [], n = 0; n < e.length; n++)
                  t.push((e[n] >>> 4).toString(16)),
                    t.push((15 & e[n]).toString(16));
                return t.join("");
              },
              hexToBytes: function (e) {
                for (var t = [], n = 0; n < e.length; n += 2)
                  t.push(parseInt(e.substr(n, 2), 16));
                return t;
              },
              bytesToBase64: function (e) {
                if ("function" == typeof btoa) return btoa(c.bytesToString(e));
                for (var t = [], r = 0; r < e.length; r += 3)
                  for (
                    var o = (e[r] << 16) | (e[r + 1] << 8) | e[r + 2], i = 0;
                    i < 4;
                    i++
                  )
                    8 * r + 6 * i <= 8 * e.length
                      ? t.push(n.charAt((o >>> (6 * (3 - i))) & 63))
                      : t.push("=");
                return t.join("");
              },
              base64ToBytes: function (e) {
                if ("function" == typeof atob) return c.stringToBytes(atob(e));
                e = e.replace(/[^A-Z0-9+\/]/gi, "");
                for (var t = [], r = 0, o = 0; r < e.length; o = ++r % 4)
                  0 != o &&
                    t.push(
                      ((n.indexOf(e.charAt(r - 1)) &
                        (Math.pow(2, -2 * o + 8) - 1)) <<
                        (2 * o)) |
                        (n.indexOf(e.charAt(r)) >>> (6 - 2 * o))
                    );
                return t;
              },
            }),
            i = (r.charenc = {}),
            c =
              ((i.UTF8 = {
                stringToBytes: function (e) {
                  return c.stringToBytes(unescape(encodeURIComponent(e)));
                },
                bytesToString: function (e) {
                  return decodeURIComponent(escape(c.bytesToString(e)));
                },
              }),
              (i.Binary = {
                stringToBytes: function (e) {
                  for (var t = [], n = 0; n < e.length; n++)
                    t.push(255 & e.charCodeAt(n));
                  return t;
                },
                bytesToString: function (e) {
                  for (var t = [], n = 0; n < e.length; n++)
                    t.push(String.fromCharCode(e[n]));
                  return t.join("");
                },
              }));
          e.exports.Crypto = r;
        })();
    },
    function (e, t, n) {
      function r(e) {
        return n(o(e));
      }
      function o(e) {
        return (
          i[e] ||
          (function () {
            throw new Error("Cannot find module '" + e + "'.");
          })()
        );
      }
      var i = {
        "./AES": 103,
        "./AES.js": 103,
        "./BlockModes": 104,
        "./BlockModes.js": 104,
        "./Crypto": 101,
        "./Crypto.js": 101,
        "./CryptoMath": 105,
        "./CryptoMath.js": 105,
        "./DES": 106,
        "./DES.js": 106,
        "./HMAC": 107,
        "./HMAC.js": 107,
        "./MARC4": 108,
        "./MARC4.js": 108,
        "./MD5": 109,
        "./MD5.js": 109,
        "./PBKDF2": 110,
        "./PBKDF2.js": 110,
        "./PBKDF2Async": 111,
        "./PBKDF2Async.js": 111,
        "./Rabbit": 113,
        "./Rabbit.js": 113,
        "./SHA1": 114,
        "./SHA1.js": 114,
        "./SHA256": 115,
        "./SHA256.js": 115,
      };
      (r.keys = function () {
        return Object.keys(i);
      }),
        (r.resolve = o),
        (e.exports = r),
        (r.id = 102);
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        function e(e, t) {
          for (var n = 0, r = 0; r < 8; r++) {
            1 & t && (n ^= e);
            var o = 128 & e;
            (e = (e << 1) & 255), o && (e ^= 27), (t >>>= 1);
          }
          return n;
        }
        for (
          var t = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
            r = t.util,
            o = t.charenc,
            i = o.UTF8,
            c = [
              99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215,
              171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162,
              175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52,
              165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154,
              7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90,
              160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252,
              177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251,
              67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64,
              143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205,
              12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115,
              96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11,
              219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149,
              228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234,
              101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221,
              116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97,
              53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142,
              148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191,
              230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22,
            ],
            u = [],
            s = 0;
          s < 256;
          s++
        )
          u[c[s]] = s;
        for (
          var a = [], f = [], l = [], d = [], v = [], h = [], s = 0;
          s < 256;
          s++
        )
          (a[s] = e(s, 2)),
            (f[s] = e(s, 3)),
            (l[s] = e(s, 9)),
            (d[s] = e(s, 11)),
            (v[s] = e(s, 13)),
            (h[s] = e(s, 14));
        var p,
          g,
          y,
          w = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
          m = [[], [], [], []],
          b = (t.AES = {
            encrypt: function (e, n, o) {
              o = o || {};
              var c = o.mode || new t.mode.OFB();
              c.fixOptions && c.fixOptions(o);
              var u = e.constructor == String ? i.stringToBytes(e) : e,
                s = o.iv || r.randomBytes(4 * b._blocksize),
                a =
                  n.constructor == String
                    ? t.PBKDF2(n, s, 32, { asBytes: !0 })
                    : n;
              return (
                b._init(a),
                c.encrypt(b, u, s),
                (u = o.iv ? u : s.concat(u)),
                o && o.asBytes ? u : r.bytesToBase64(u)
              );
            },
            decrypt: function (e, n, o) {
              o = o || {};
              var c = o.mode || new t.mode.OFB();
              c.fixOptions && c.fixOptions(o);
              var u = e.constructor == String ? r.base64ToBytes(e) : e,
                s = o.iv || u.splice(0, 4 * b._blocksize),
                a =
                  n.constructor == String
                    ? t.PBKDF2(n, s, 32, { asBytes: !0 })
                    : n;
              return (
                b._init(a),
                c.decrypt(b, u, s),
                o && o.asBytes ? u : i.bytesToString(u)
              );
            },
            _blocksize: 4,
            _encryptblock: function (e, t) {
              for (var n = 0; n < b._blocksize; n++)
                for (var r = 0; r < 4; r++) m[n][r] = e[t + 4 * r + n];
              for (var n = 0; n < 4; n++)
                for (var r = 0; r < 4; r++) m[n][r] ^= y[r][n];
              for (var o = 1; o < g; o++) {
                for (var n = 0; n < 4; n++)
                  for (var r = 0; r < 4; r++) m[n][r] = c[m[n][r]];
                m[1].push(m[1].shift()),
                  m[2].push(m[2].shift()),
                  m[2].push(m[2].shift()),
                  m[3].unshift(m[3].pop());
                for (var r = 0; r < 4; r++) {
                  var i = m[0][r],
                    u = m[1][r],
                    s = m[2][r],
                    l = m[3][r];
                  (m[0][r] = a[i] ^ f[u] ^ s ^ l),
                    (m[1][r] = i ^ a[u] ^ f[s] ^ l),
                    (m[2][r] = i ^ u ^ a[s] ^ f[l]),
                    (m[3][r] = f[i] ^ u ^ s ^ a[l]);
                }
                for (var n = 0; n < 4; n++)
                  for (var r = 0; r < 4; r++) m[n][r] ^= y[4 * o + r][n];
              }
              for (var n = 0; n < 4; n++)
                for (var r = 0; r < 4; r++) m[n][r] = c[m[n][r]];
              m[1].push(m[1].shift()),
                m[2].push(m[2].shift()),
                m[2].push(m[2].shift()),
                m[3].unshift(m[3].pop());
              for (var n = 0; n < 4; n++)
                for (var r = 0; r < 4; r++) m[n][r] ^= y[4 * g + r][n];
              for (var n = 0; n < b._blocksize; n++)
                for (var r = 0; r < 4; r++) e[t + 4 * r + n] = m[n][r];
            },
            _decryptblock: function (e, t) {
              for (var n = 0; n < b._blocksize; n++)
                for (var r = 0; r < 4; r++) m[n][r] = e[t + 4 * r + n];
              for (var n = 0; n < 4; n++)
                for (var r = 0; r < 4; r++) m[n][r] ^= y[4 * g + r][n];
              for (var o = 1; o < g; o++) {
                m[1].unshift(m[1].pop()),
                  m[2].push(m[2].shift()),
                  m[2].push(m[2].shift()),
                  m[3].push(m[3].shift());
                for (var n = 0; n < 4; n++)
                  for (var r = 0; r < 4; r++) m[n][r] = u[m[n][r]];
                for (var n = 0; n < 4; n++)
                  for (var r = 0; r < 4; r++) m[n][r] ^= y[4 * (g - o) + r][n];
                for (var r = 0; r < 4; r++) {
                  var i = m[0][r],
                    c = m[1][r],
                    s = m[2][r],
                    a = m[3][r];
                  (m[0][r] = h[i] ^ d[c] ^ v[s] ^ l[a]),
                    (m[1][r] = l[i] ^ h[c] ^ d[s] ^ v[a]),
                    (m[2][r] = v[i] ^ l[c] ^ h[s] ^ d[a]),
                    (m[3][r] = d[i] ^ v[c] ^ l[s] ^ h[a]);
                }
              }
              m[1].unshift(m[1].pop()),
                m[2].push(m[2].shift()),
                m[2].push(m[2].shift()),
                m[3].push(m[3].shift());
              for (var n = 0; n < 4; n++)
                for (var r = 0; r < 4; r++) m[n][r] = u[m[n][r]];
              for (var n = 0; n < 4; n++)
                for (var r = 0; r < 4; r++) m[n][r] ^= y[r][n];
              for (var n = 0; n < b._blocksize; n++)
                for (var r = 0; r < 4; r++) e[t + 4 * r + n] = m[n][r];
            },
            _init: function (e) {
              (p = e.length / 4), (g = p + 6), b._keyexpansion(e);
            },
            _keyexpansion: function (e) {
              y = [];
              for (var t = 0; t < p; t++)
                y[t] = [e[4 * t], e[4 * t + 1], e[4 * t + 2], e[4 * t + 3]];
              for (var t = p; t < b._blocksize * (g + 1); t++) {
                var n = [y[t - 1][0], y[t - 1][1], y[t - 1][2], y[t - 1][3]];
                t % p == 0
                  ? (n.push(n.shift()),
                    (n[0] = c[n[0]]),
                    (n[1] = c[n[1]]),
                    (n[2] = c[n[2]]),
                    (n[3] = c[n[3]]),
                    (n[0] ^= w[t / p]))
                  : p > 6 &&
                    t % p == 4 &&
                    ((n[0] = c[n[0]]),
                    (n[1] = c[n[1]]),
                    (n[2] = c[n[2]]),
                    (n[3] = c[n[3]])),
                  (y[t] = [
                    y[t - p][0] ^ n[0],
                    y[t - p][1] ^ n[1],
                    y[t - p][2] ^ n[2],
                    y[t - p][3] ^ n[3],
                  ]);
              }
            },
          });
      })();
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        function e(e, t) {
          var n = 4 * e._blocksize,
            r = n - (t.length % n);
          return r;
        }
        var t = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          r = (t.pad = {}),
          o = function (e) {
            for (var t = e.pop(), n = 1; n < t; n++) e.pop();
          };
        (r.NoPadding = { pad: function (e, t) {}, unpad: function (e) {} }),
          (r.ZeroPadding = {
            pad: function (e, t) {
              var n = 4 * e._blocksize,
                r = t.length % n;
              if (0 != r) for (r = n - r; r > 0; r--) t.push(0);
            },
            unpad: function (e) {},
          }),
          (r.iso7816 = {
            pad: function (t, n) {
              var r = e(t, n);
              for (n.push(128); r > 1; r--) n.push(0);
            },
            unpad: function (e) {
              for (; 128 != e.pop(); );
            },
          }),
          (r.ansix923 = {
            pad: function (t, n) {
              for (var r = e(t, n), o = 1; o < r; o++) n.push(0);
              n.push(r);
            },
            unpad: o,
          }),
          (r.iso10126 = {
            pad: function (t, n) {
              for (var r = e(t, n), o = 1; o < r; o++)
                n.push(Math.floor(256 * Math.random()));
              n.push(r);
            },
            unpad: o,
          }),
          (r.pkcs7 = {
            pad: function (t, n) {
              for (var r = e(t, n), o = 0; o < r; o++) n.push(r);
            },
            unpad: o,
          });
        var i = (t.mode = {}),
          c = (i.Mode = function (e) {
            e && (this._padding = e);
          });
        c.prototype = {
          encrypt: function (e, t, n) {
            this._padding.pad(e, t), this._doEncrypt(e, t, n);
          },
          decrypt: function (e, t, n) {
            this._doDecrypt(e, t, n), this._padding.unpad(t);
          },
          _padding: r.iso7816,
        };
        var u = (i.ECB = function () {
            c.apply(this, arguments);
          }),
          s = (u.prototype = new c());
        (s._doEncrypt = function (e, t, n) {
          for (var r = 4 * e._blocksize, o = 0; o < t.length; o += r)
            e._encryptblock(t, o);
        }),
          (s._doDecrypt = function (e, t, n) {
            for (var r = 4 * e._blocksize, o = 0; o < t.length; o += r)
              e._decryptblock(t, o);
          }),
          (s.fixOptions = function (e) {
            e.iv = [];
          });
        var a = (i.CBC = function () {
            c.apply(this, arguments);
          }),
          f = (a.prototype = new c());
        (f._doEncrypt = function (e, t, n) {
          for (var r = 4 * e._blocksize, o = 0; o < t.length; o += r) {
            if (0 == o) for (var i = 0; i < r; i++) t[i] ^= n[i];
            else for (var i = 0; i < r; i++) t[o + i] ^= t[o + i - r];
            e._encryptblock(t, o);
          }
        }),
          (f._doDecrypt = function (e, t, n) {
            for (var r = 4 * e._blocksize, o = n, i = 0; i < t.length; i += r) {
              var c = t.slice(i, i + r);
              e._decryptblock(t, i);
              for (var u = 0; u < r; u++) t[i + u] ^= o[u];
              o = c;
            }
          });
        var l = (i.CFB = function () {
            c.apply(this, arguments);
          }),
          d = (l.prototype = new c());
        (d._padding = r.NoPadding),
          (d._doEncrypt = function (e, t, n) {
            for (
              var r = 4 * e._blocksize, o = n.slice(0), i = 0;
              i < t.length;
              i++
            ) {
              var c = i % r;
              0 == c && e._encryptblock(o, 0), (t[i] ^= o[c]), (o[c] = t[i]);
            }
          }),
          (d._doDecrypt = function (e, t, n) {
            for (
              var r = 4 * e._blocksize, o = n.slice(0), i = 0;
              i < t.length;
              i++
            ) {
              var c = i % r;
              0 == c && e._encryptblock(o, 0);
              var u = t[i];
              (t[i] ^= o[c]), (o[c] = u);
            }
          });
        var v = (i.OFB = function () {
            c.apply(this, arguments);
          }),
          h = (v.prototype = new c());
        (h._padding = r.NoPadding),
          (h._doEncrypt = function (e, t, n) {
            for (
              var r = 4 * e._blocksize, o = n.slice(0), i = 0;
              i < t.length;
              i++
            )
              i % r == 0 && e._encryptblock(o, 0), (t[i] ^= o[i % r]);
          }),
          (h._doDecrypt = h._doEncrypt);
        var p = (i.CTR = function () {
            c.apply(this, arguments);
          }),
          g = (p.prototype = new c());
        (g._padding = r.NoPadding),
          (g._doEncrypt = function (e, t, n) {
            for (
              var r = 4 * e._blocksize, o = n.slice(0), i = 0;
              i < t.length;

            ) {
              var c = o.slice(0);
              e._encryptblock(c, 0);
              for (var u = 0; i < t.length && u < r; u++, i++) t[i] ^= c[u];
              256 == ++o[r - 1] &&
                ((o[r - 1] = 0),
                256 == ++o[r - 2] &&
                  ((o[r - 2] = 0),
                  256 == ++o[r - 3] && ((o[r - 3] = 0), ++o[r - 4])));
            }
          }),
          (g._doDecrypt = g._doEncrypt);
      })();
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        var e = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          t = e.util;
        (t.u32 = function (e) {
          return e >>> 0;
        }),
          (t.add = function () {
            for (
              var e = this.u32(arguments[0]), t = 1;
              t < arguments.length;
              t++
            )
              e = this.u32(e + this.u32(arguments[t]));
            return e;
          }),
          (t.mult = function (e, t) {
            return this.add((4294901760 & t) * e, (65535 & t) * e);
          }),
          (t.gt = function (e, t) {
            return this.u32(e) > this.u32(t);
          }),
          (t.lt = function (e, t) {
            return this.u32(e) < this.u32(t);
          });
      })();
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        var e,
          t = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          r = t.util,
          o = t.charenc,
          i = o.UTF8;
        (e = function (e) {
          (this.keys = new Array(16)), this._initialiseKeys(e);
        }),
          (e.PC1_offsets = [
            7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1,
            0, 7, 6, 5, 4, 7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0, 7, 6,
            5, 4, 3, 2, 1, 0, 3, 2, 1, 0,
          ]),
          (e.PC1_masks = [
            128, 128, 128, 128, 128, 128, 128, 128, 64, 64, 64, 64, 64, 64, 64,
            64, 32, 32, 32, 32, 32, 32, 32, 32, 16, 16, 16, 16, 2, 2, 2, 2, 2,
            2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 8, 16, 16, 16,
            16,
          ]),
          (e.PC2_offsets1 = [
            0, 3, 1, 2, 0, 1, 3, 2, 0, 1, 0, 2, 3, 0, 1, 3, 0, 0, 2, 3, 1, 0, 2,
            0, 0, 2, 3, 1,
          ]),
          (e.PC2_offsets2 = [
            7, 5, 4, 7, 5, 6, 0, 7, 4, 0, 6, 5, 4, 7, 0, 6, 5, 7, 4, 5, 6, 7, 5,
            4, 6, 0, 4, 6,
          ]),
          (e.PC2_masks1 = [
            2, 1, 32, 4, 1, 4, 16, 1, 0, 1, 8, 8, 2, 32, 8, 32, 16, 0, 16, 4, 2,
            0, 32, 4, 0, 2, 8, 16,
          ]),
          (e.PC2_masks2 = [
            2, 32, 8, 1, 2, 2, 0, 4, 4, 0, 8, 16, 32, 16, 0, 32, 4, 32, 2, 1,
            16, 8, 8, 16, 1, 0, 1, 4,
          ]),
          (e.keyShifts = [
            1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28,
          ]),
          (e.prototype._initialiseKeys = function (t) {
            var n,
              r = new Array(56);
            for (n = 0; n < 56; n++)
              r[n] = 0 != (t[e.PC1_offsets[n]] & e.PC1_masks[n]);
            var o = r.slice(0, 28),
              i = r.slice(28, 56);
            for (o = o.concat(o), i = i.concat(i), n = 0; n < 16; n++) {
              for (
                var c = [0, 0, 0, 0, 0, 0, 0, 0], u = e.keyShifts[n], s = 0;
                s < 28;
                s++
              )
                o[s + u] && (c[e.PC2_offsets1[s]] += e.PC2_masks1[s]),
                  i[s + u] && (c[e.PC2_offsets2[s]] += e.PC2_masks2[s]);
              c[0] = ((31 & c[0]) << 27) + ((32 & c[0]) >> 5);
              for (var s = 1; s <= 6; s++) c[s] = c[s] << (27 - 4 * s);
              (c[7] = ((62 & c[7]) >> 1) + ((1 & c[7]) << 31)),
                (this.keys[n] = c);
            }
          }),
          (e.prototype.getKey = function (e) {
            return this.keys[e];
          });
        var c;
        (c = function () {
          (this.lhs = 0), (this.rhs = 0);
        }),
          (c.SBOX_MASK = [
            4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504,
            2147483679,
          ]),
          (c.SBOX = new Array(8));
        var u = c.SBOX;
        (u[0] = new Array()),
          (u[0][0] = 8421888),
          (u[0][268435456] = 32768),
          (u[0][536870912] = 8421378),
          (u[0][805306368] = 2),
          (u[0][1073741824] = 512),
          (u[0][1342177280] = 8421890),
          (u[0][1610612736] = 8389122),
          (u[0][1879048192] = 8388608),
          (u[0][-2147483648] = 514),
          (u[0][-1879048192] = 8389120),
          (u[0][-1610612736] = 33280),
          (u[0][-1342177280] = 8421376),
          (u[0][-1073741824] = 32770),
          (u[0][-805306368] = 8388610),
          (u[0][-536870912] = 0),
          (u[0][-268435456] = 33282),
          (u[0][134217728] = 0),
          (u[0][402653184] = 8421890),
          (u[0][671088640] = 33282),
          (u[0][939524096] = 32768),
          (u[0][1207959552] = 8421888),
          (u[0][1476395008] = 512),
          (u[0][1744830464] = 8421378),
          (u[0][2013265920] = 2),
          (u[0][-2013265920] = 8389120),
          (u[0][-1744830464] = 33280),
          (u[0][-1476395008] = 8421376),
          (u[0][-1207959552] = 8389122),
          (u[0][-939524096] = 8388610),
          (u[0][-671088640] = 32770),
          (u[0][-402653184] = 514),
          (u[0][-134217728] = 8388608),
          (u[0][1] = 32768),
          (u[0][268435457] = 2),
          (u[0][536870913] = 8421888),
          (u[0][805306369] = 8388608),
          (u[0][1073741825] = 8421378),
          (u[0][1342177281] = 33280),
          (u[0][1610612737] = 512),
          (u[0][1879048193] = 8389122),
          (u[0][-2147483647] = 8421890),
          (u[0][-1879048191] = 8421376),
          (u[0][-1610612735] = 8388610),
          (u[0][-1342177279] = 33282),
          (u[0][-1073741823] = 514),
          (u[0][-805306367] = 8389120),
          (u[0][-536870911] = 32770),
          (u[0][-268435455] = 0),
          (u[0][134217729] = 8421890),
          (u[0][402653185] = 8421376),
          (u[0][671088641] = 8388608),
          (u[0][939524097] = 512),
          (u[0][1207959553] = 32768),
          (u[0][1476395009] = 8388610),
          (u[0][1744830465] = 2),
          (u[0][2013265921] = 33282),
          (u[0][-2013265919] = 32770),
          (u[0][-1744830463] = 8389122),
          (u[0][-1476395007] = 514),
          (u[0][-1207959551] = 8421888),
          (u[0][-939524095] = 8389120),
          (u[0][-671088639] = 0),
          (u[0][-402653183] = 33280),
          (u[0][-134217727] = 8421378),
          (u[1] = new Array()),
          (u[1][0] = 1074282512),
          (u[1][16777216] = 16384),
          (u[1][33554432] = 524288),
          (u[1][50331648] = 1074266128),
          (u[1][67108864] = 1073741840),
          (u[1][83886080] = 1074282496),
          (u[1][100663296] = 1073758208),
          (u[1][117440512] = 16),
          (u[1][134217728] = 540672),
          (u[1][150994944] = 1073758224),
          (u[1][167772160] = 1073741824),
          (u[1][184549376] = 540688),
          (u[1][201326592] = 524304),
          (u[1][218103808] = 0),
          (u[1][234881024] = 16400),
          (u[1][251658240] = 1074266112),
          (u[1][8388608] = 1073758208),
          (u[1][25165824] = 540688),
          (u[1][41943040] = 16),
          (u[1][58720256] = 1073758224),
          (u[1][75497472] = 1074282512),
          (u[1][92274688] = 1073741824),
          (u[1][109051904] = 524288),
          (u[1][125829120] = 1074266128),
          (u[1][142606336] = 524304),
          (u[1][159383552] = 0),
          (u[1][176160768] = 16384),
          (u[1][192937984] = 1074266112),
          (u[1][209715200] = 1073741840),
          (u[1][226492416] = 540672),
          (u[1][243269632] = 1074282496),
          (u[1][260046848] = 16400),
          (u[1][268435456] = 0),
          (u[1][285212672] = 1074266128),
          (u[1][301989888] = 1073758224),
          (u[1][318767104] = 1074282496),
          (u[1][335544320] = 1074266112),
          (u[1][352321536] = 16),
          (u[1][369098752] = 540688),
          (u[1][385875968] = 16384),
          (u[1][402653184] = 16400),
          (u[1][419430400] = 524288),
          (u[1][436207616] = 524304),
          (u[1][452984832] = 1073741840),
          (u[1][469762048] = 540672),
          (u[1][486539264] = 1073758208),
          (u[1][503316480] = 1073741824),
          (u[1][520093696] = 1074282512),
          (u[1][276824064] = 540688),
          (u[1][293601280] = 524288),
          (u[1][310378496] = 1074266112),
          (u[1][327155712] = 16384),
          (u[1][343932928] = 1073758208),
          (u[1][360710144] = 1074282512),
          (u[1][377487360] = 16),
          (u[1][394264576] = 1073741824),
          (u[1][411041792] = 1074282496),
          (u[1][427819008] = 1073741840),
          (u[1][444596224] = 1073758224),
          (u[1][461373440] = 524304),
          (u[1][478150656] = 0),
          (u[1][494927872] = 16400),
          (u[1][511705088] = 1074266128),
          (u[1][528482304] = 540672),
          (u[2] = new Array()),
          (u[2][0] = 260),
          (u[2][1048576] = 0),
          (u[2][2097152] = 67109120),
          (u[2][3145728] = 65796),
          (u[2][4194304] = 65540),
          (u[2][5242880] = 67108868),
          (u[2][6291456] = 67174660),
          (u[2][7340032] = 67174400),
          (u[2][8388608] = 67108864),
          (u[2][9437184] = 67174656),
          (u[2][10485760] = 65792),
          (u[2][11534336] = 67174404),
          (u[2][12582912] = 67109124),
          (u[2][13631488] = 65536),
          (u[2][14680064] = 4),
          (u[2][15728640] = 256),
          (u[2][524288] = 67174656),
          (u[2][1572864] = 67174404),
          (u[2][2621440] = 0),
          (u[2][3670016] = 67109120),
          (u[2][4718592] = 67108868),
          (u[2][5767168] = 65536),
          (u[2][6815744] = 65540),
          (u[2][7864320] = 260),
          (u[2][8912896] = 4),
          (u[2][9961472] = 256),
          (u[2][11010048] = 67174400),
          (u[2][12058624] = 65796),
          (u[2][13107200] = 65792),
          (u[2][14155776] = 67109124),
          (u[2][15204352] = 67174660),
          (u[2][16252928] = 67108864),
          (u[2][16777216] = 67174656),
          (u[2][17825792] = 65540),
          (u[2][18874368] = 65536),
          (u[2][19922944] = 67109120),
          (u[2][20971520] = 256),
          (u[2][22020096] = 67174660),
          (u[2][23068672] = 67108868),
          (u[2][24117248] = 0),
          (u[2][25165824] = 67109124),
          (u[2][26214400] = 67108864),
          (u[2][27262976] = 4),
          (u[2][28311552] = 65792),
          (u[2][29360128] = 67174400),
          (u[2][30408704] = 260),
          (u[2][31457280] = 65796),
          (u[2][32505856] = 67174404),
          (u[2][17301504] = 67108864),
          (u[2][18350080] = 260),
          (u[2][19398656] = 67174656),
          (u[2][20447232] = 0),
          (u[2][21495808] = 65540),
          (u[2][22544384] = 67109120),
          (u[2][23592960] = 256),
          (u[2][24641536] = 67174404),
          (u[2][25690112] = 65536),
          (u[2][26738688] = 67174660),
          (u[2][27787264] = 65796),
          (u[2][28835840] = 67108868),
          (u[2][29884416] = 67109124),
          (u[2][30932992] = 67174400),
          (u[2][31981568] = 4),
          (u[2][33030144] = 65792),
          (u[3] = new Array()),
          (u[3][0] = 2151682048),
          (u[3][65536] = 2147487808),
          (u[3][131072] = 4198464),
          (u[3][196608] = 2151677952);
        u[3][262144] = 0;
        (u[3][327680] = 4198400),
          (u[3][393216] = 2147483712),
          (u[3][458752] = 4194368),
          (u[3][524288] = 2147483648),
          (u[3][589824] = 4194304),
          (u[3][655360] = 64),
          (u[3][720896] = 2147487744),
          (u[3][786432] = 2151678016),
          (u[3][851968] = 4160),
          (u[3][917504] = 4096),
          (u[3][983040] = 2151682112),
          (u[3][32768] = 2147487808),
          (u[3][98304] = 64),
          (u[3][163840] = 2151678016),
          (u[3][229376] = 2147487744),
          (u[3][294912] = 4198400),
          (u[3][360448] = 2151682112),
          (u[3][425984] = 0),
          (u[3][491520] = 2151677952),
          (u[3][557056] = 4096),
          (u[3][622592] = 2151682048),
          (u[3][688128] = 4194304),
          (u[3][753664] = 4160),
          (u[3][819200] = 2147483648),
          (u[3][884736] = 4194368),
          (u[3][950272] = 4198464),
          (u[3][1015808] = 2147483712),
          (u[3][1048576] = 4194368),
          (u[3][1114112] = 4198400),
          (u[3][1179648] = 2147483712),
          (u[3][1245184] = 0),
          (u[3][1310720] = 4160),
          (u[3][1376256] = 2151678016),
          (u[3][1441792] = 2151682048),
          (u[3][1507328] = 2147487808),
          (u[3][1572864] = 2151682112),
          (u[3][1638400] = 2147483648),
          (u[3][1703936] = 2151677952),
          (u[3][1769472] = 4198464),
          (u[3][1835008] = 2147487744),
          (u[3][1900544] = 4194304),
          (u[3][1966080] = 64),
          (u[3][2031616] = 4096),
          (u[3][1081344] = 2151677952),
          (u[3][1146880] = 2151682112),
          (u[3][1212416] = 0),
          (u[3][1277952] = 4198400),
          (u[3][1343488] = 4194368),
          (u[3][1409024] = 2147483648),
          (u[3][1474560] = 2147487808),
          (u[3][1540096] = 64),
          (u[3][1605632] = 2147483712),
          (u[3][1671168] = 4096),
          (u[3][1736704] = 2147487744),
          (u[3][1802240] = 2151678016),
          (u[3][1867776] = 4160),
          (u[3][1933312] = 2151682048),
          (u[3][1998848] = 4194304),
          (u[3][2064384] = 4198464),
          (u[4] = new Array()),
          (u[4][0] = 128),
          (u[4][4096] = 17039360),
          (u[4][8192] = 262144),
          (u[4][12288] = 536870912),
          (u[4][16384] = 537133184),
          (u[4][20480] = 16777344),
          (u[4][24576] = 553648256),
          (u[4][28672] = 262272),
          (u[4][32768] = 16777216),
          (u[4][36864] = 537133056),
          (u[4][40960] = 536871040),
          (u[4][45056] = 553910400),
          (u[4][49152] = 553910272),
          (u[4][53248] = 0),
          (u[4][57344] = 17039488),
          (u[4][61440] = 553648128),
          (u[4][2048] = 17039488),
          (u[4][6144] = 553648256),
          (u[4][10240] = 128),
          (u[4][14336] = 17039360),
          (u[4][18432] = 262144),
          (u[4][22528] = 537133184),
          (u[4][26624] = 553910272),
          (u[4][30720] = 536870912),
          (u[4][34816] = 537133056),
          (u[4][38912] = 0),
          (u[4][43008] = 553910400),
          (u[4][47104] = 16777344),
          (u[4][51200] = 536871040),
          (u[4][55296] = 553648128),
          (u[4][59392] = 16777216),
          (u[4][63488] = 262272),
          (u[4][65536] = 262144),
          (u[4][69632] = 128),
          (u[4][73728] = 536870912),
          (u[4][77824] = 553648256),
          (u[4][81920] = 16777344),
          (u[4][86016] = 553910272),
          (u[4][90112] = 537133184),
          (u[4][94208] = 16777216),
          (u[4][98304] = 553910400),
          (u[4][102400] = 553648128),
          (u[4][106496] = 17039360),
          (u[4][110592] = 537133056),
          (u[4][114688] = 262272),
          (u[4][118784] = 536871040),
          (u[4][122880] = 0),
          (u[4][126976] = 17039488),
          (u[4][67584] = 553648256),
          (u[4][71680] = 16777216),
          (u[4][75776] = 17039360),
          (u[4][79872] = 537133184),
          (u[4][83968] = 536870912),
          (u[4][88064] = 17039488),
          (u[4][92160] = 128),
          (u[4][96256] = 553910272),
          (u[4][100352] = 262272),
          (u[4][104448] = 553910400),
          (u[4][108544] = 0),
          (u[4][112640] = 553648128),
          (u[4][116736] = 16777344),
          (u[4][120832] = 262144),
          (u[4][124928] = 537133056),
          (u[4][129024] = 536871040),
          (u[5] = new Array()),
          (u[5][0] = 268435464),
          (u[5][256] = 8192),
          (u[5][512] = 270532608),
          (u[5][768] = 270540808),
          (u[5][1024] = 268443648),
          (u[5][1280] = 2097152),
          (u[5][1536] = 2097160),
          (u[5][1792] = 268435456),
          (u[5][2048] = 0),
          (u[5][2304] = 268443656),
          (u[5][2560] = 2105344),
          (u[5][2816] = 8),
          (u[5][3072] = 270532616),
          (u[5][3328] = 2105352),
          (u[5][3584] = 8200),
          (u[5][3840] = 270540800),
          (u[5][128] = 270532608),
          (u[5][384] = 270540808),
          (u[5][640] = 8),
          (u[5][896] = 2097152),
          (u[5][1152] = 2105352),
          (u[5][1408] = 268435464),
          (u[5][1664] = 268443648),
          (u[5][1920] = 8200),
          (u[5][2176] = 2097160),
          (u[5][2432] = 8192),
          (u[5][2688] = 268443656),
          (u[5][2944] = 270532616),
          (u[5][3200] = 0),
          (u[5][3456] = 270540800),
          (u[5][3712] = 2105344),
          (u[5][3968] = 268435456),
          (u[5][4096] = 268443648),
          (u[5][4352] = 270532616),
          (u[5][4608] = 270540808),
          (u[5][4864] = 8200),
          (u[5][5120] = 2097152),
          (u[5][5376] = 268435456),
          (u[5][5632] = 268435464),
          (u[5][5888] = 2105344),
          (u[5][6144] = 2105352),
          (u[5][6400] = 0),
          (u[5][6656] = 8),
          (u[5][6912] = 270532608),
          (u[5][7168] = 8192),
          (u[5][7424] = 268443656),
          (u[5][7680] = 270540800),
          (u[5][7936] = 2097160),
          (u[5][4224] = 8),
          (u[5][4480] = 2105344),
          (u[5][4736] = 2097152),
          (u[5][4992] = 268435464),
          (u[5][5248] = 268443648),
          (u[5][5504] = 8200),
          (u[5][5760] = 270540808),
          (u[5][6016] = 270532608),
          (u[5][6272] = 270540800),
          (u[5][6528] = 270532616),
          (u[5][6784] = 8192),
          (u[5][7040] = 2105352),
          (u[5][7296] = 2097160),
          (u[5][7552] = 0),
          (u[5][7808] = 268435456),
          (u[5][8064] = 268443656),
          (u[6] = new Array()),
          (u[6][0] = 1048576),
          (u[6][16] = 33555457),
          (u[6][32] = 1024),
          (u[6][48] = 1049601),
          (u[6][64] = 34604033),
          (u[6][80] = 0),
          (u[6][96] = 1),
          (u[6][112] = 34603009),
          (u[6][128] = 33555456),
          (u[6][144] = 1048577);
        u[6][160] = 33554433;
        (u[6][176] = 34604032),
          (u[6][192] = 34603008),
          (u[6][208] = 1025),
          (u[6][224] = 1049600),
          (u[6][240] = 33554432),
          (u[6][8] = 34603009),
          (u[6][24] = 0),
          (u[6][40] = 33555457),
          (u[6][56] = 34604032),
          (u[6][72] = 1048576),
          (u[6][88] = 33554433),
          (u[6][104] = 33554432),
          (u[6][120] = 1025),
          (u[6][136] = 1049601),
          (u[6][152] = 33555456),
          (u[6][168] = 34603008),
          (u[6][184] = 1048577),
          (u[6][200] = 1024),
          (u[6][216] = 34604033),
          (u[6][232] = 1),
          (u[6][248] = 1049600),
          (u[6][256] = 33554432),
          (u[6][272] = 1048576),
          (u[6][288] = 33555457),
          (u[6][304] = 34603009),
          (u[6][320] = 1048577),
          (u[6][336] = 33555456),
          (u[6][352] = 34604032),
          (u[6][368] = 1049601),
          (u[6][384] = 1025),
          (u[6][400] = 34604033),
          (u[6][416] = 1049600),
          (u[6][432] = 1),
          (u[6][448] = 0),
          (u[6][464] = 34603008),
          (u[6][480] = 33554433),
          (u[6][496] = 1024),
          (u[6][264] = 1049600),
          (u[6][280] = 33555457),
          (u[6][296] = 34603009),
          (u[6][312] = 1),
          (u[6][328] = 33554432),
          (u[6][344] = 1048576),
          (u[6][360] = 1025),
          (u[6][376] = 34604032),
          (u[6][392] = 33554433),
          (u[6][408] = 34603008),
          (u[6][424] = 0),
          (u[6][440] = 34604033),
          (u[6][456] = 1049601),
          (u[6][472] = 1024),
          (u[6][488] = 33555456),
          (u[6][504] = 1048577),
          (u[7] = new Array()),
          (u[7][0] = 134219808),
          (u[7][1] = 131072),
          (u[7][2] = 134217728),
          (u[7][3] = 32),
          (u[7][4] = 131104),
          (u[7][5] = 134350880),
          (u[7][6] = 134350848),
          (u[7][7] = 2048),
          (u[7][8] = 134348800),
          (u[7][9] = 134219776),
          (u[7][10] = 133120),
          (u[7][11] = 134348832),
          (u[7][12] = 2080),
          (u[7][13] = 0),
          (u[7][14] = 134217760),
          (u[7][15] = 133152),
          (u[7][-2147483648] = 2048),
          (u[7][-2147483647] = 134350880),
          (u[7][-2147483646] = 134219808),
          (u[7][-2147483645] = 134217728),
          (u[7][-2147483644] = 134348800),
          (u[7][-2147483643] = 133120),
          (u[7][-2147483642] = 133152),
          (u[7][-2147483641] = 32),
          (u[7][-2147483640] = 134217760),
          (u[7][-2147483639] = 2080),
          (u[7][-2147483638] = 131104),
          (u[7][-2147483637] = 134350848),
          (u[7][-2147483636] = 0),
          (u[7][-2147483635] = 134348832),
          (u[7][-2147483634] = 134219776),
          (u[7][-2147483633] = 131072),
          (u[7][16] = 133152),
          (u[7][17] = 134350848),
          (u[7][18] = 32),
          (u[7][19] = 2048),
          (u[7][20] = 134219776),
          (u[7][21] = 134217760),
          (u[7][22] = 134348832),
          (u[7][23] = 131072),
          (u[7][24] = 0),
          (u[7][25] = 131104),
          (u[7][26] = 134348800),
          (u[7][27] = 134219808),
          (u[7][28] = 134350880),
          (u[7][29] = 133120),
          (u[7][30] = 2080),
          (u[7][31] = 134217728),
          (u[7][-2147483632] = 131072),
          (u[7][-2147483631] = 2048),
          (u[7][-2147483630] = 134348832),
          (u[7][-2147483629] = 133152),
          (u[7][-2147483628] = 32),
          (u[7][-2147483627] = 134348800),
          (u[7][-2147483626] = 134217728),
          (u[7][-2147483625] = 134219808),
          (u[7][-2147483624] = 134350880),
          (u[7][-2147483623] = 134217760),
          (u[7][-2147483622] = 134219776),
          (u[7][-2147483621] = 0),
          (u[7][-2147483620] = 133120),
          (u[7][-2147483619] = 2080),
          (u[7][-2147483618] = 131104),
          (u[7][-2147483617] = 134350848),
          (c.prototype._exchangeLR = function (e, t) {
            var n = ((this.lhs >> e) ^ this.rhs) & t;
            (this.rhs ^= n), (this.lhs ^= n << e);
          }),
          (c.prototype._exchangeRL = function (e, t) {
            var n = ((this.rhs >> e) ^ this.lhs) & t;
            (this.lhs ^= n), (this.rhs ^= n << e);
          }),
          (c.prototype.initialPerm = function (e, t) {
            var n = e.slice(t, t + 8);
            (this.lhs = (n[0] << 24) + (n[1] << 16) + (n[2] << 8) + n[3]),
              (this.rhs = (n[4] << 24) + (n[5] << 16) + (n[6] << 8) + n[7]),
              this._exchangeLR(4, 252645135),
              this._exchangeLR(16, 65535),
              this._exchangeRL(2, 858993459),
              this._exchangeRL(8, 16711935),
              this._exchangeLR(1, 1431655765);
          }),
          (c.prototype.round = function (e) {
            for (var t = this.rhs, n = this.lhs, r = 0, o = 0; o < 8; o++) {
              var i = (t ^ e[o]) & c.SBOX_MASK[o];
              r += c.SBOX[o][i];
            }
            (this.lhs = t), (this.rhs = n ^ r);
          }),
          (c.prototype.finalPerm = function (e, t) {
            var n = this.lhs;
            (this.lhs = this.rhs),
              (this.rhs = n),
              this._exchangeLR(1, 1431655765),
              this._exchangeRL(8, 16711935),
              this._exchangeRL(2, 858993459),
              this._exchangeLR(16, 65535),
              this._exchangeLR(4, 252645135),
              (e[t] = (this.lhs >> 24) & 255),
              (e[t + 1] = (this.lhs >> 16) & 255),
              (e[t + 2] = (this.lhs >> 8) & 255),
              (e[t + 3] = 255 & this.lhs),
              (e[t + 4] = (this.rhs >> 24) & 255),
              (e[t + 5] = (this.rhs >> 16) & 255),
              (e[t + 6] = (this.rhs >> 8) & 255),
              (e[t + 7] = 255 & this.rhs);
          });
        var s = (t.DES = {
          _blocksize: 2,
          _keyschedule: null,
          _state: new c(),
          _init: function (t) {
            this._keyschedule = new e(t);
          },
          encrypt: function (n, o, c) {
            c = c || {};
            var u = c.mode || new t.mode.OFB();
            u.fixOptions && u.fixOptions(c);
            var a = n.constructor == String ? i.stringToBytes(n) : n,
              f = c.iv || r.randomBytes(8),
              l =
                o.constructor == String
                  ? t.PBKDF2(o, f, 8, { asBytes: !0 })
                  : o;
            return (
              (this._keyschedule = new e(l)),
              u.encrypt(s, a, f),
              (a = c.iv ? a : f.concat(a)),
              c && c.asBytes ? a : r.bytesToBase64(a)
            );
          },
          _encryptblock: function (e, t) {
            this._state.initialPerm(e, t);
            for (var n = 0; n <= 15; n++)
              this._state.round(this._keyschedule.getKey(n));
            this._state.finalPerm(e, t);
          },
          decrypt: function (n, o, c) {
            c = c || {};
            var u = c.mode || new t.mode.OFB();
            u.fixOptions && u.fixOptions(c);
            var a = n.constructor == String ? r.base64ToBytes(n) : n,
              f = c.iv || a.splice(0, 8),
              l =
                o.constructor == String
                  ? t.PBKDF2(o, f, 32, { asBytes: !0 })
                  : o;
            return (
              (this._keyschedule = new e(l)),
              u.decrypt(s, a, f),
              c && c.asBytes ? a : i.bytesToString(a)
            );
          },
          _decryptblock: function (e, t) {
            this._state.initialPerm(e, t);
            for (var n = 15; n >= 0; n--)
              this._state.round(this._keyschedule.getKey(n));
            this._state.finalPerm(e, t);
          },
        });
      })();
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        var e = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          t = e.util,
          r = e.charenc,
          o = r.UTF8,
          i = r.Binary;
        e.HMAC = function (e, n, r, c) {
          n.constructor == String && (n = o.stringToBytes(n)),
            r.constructor == String && (r = o.stringToBytes(r)),
            r.length > 4 * e._blocksize && (r = e(r, { asBytes: !0 }));
          for (
            var u = r.slice(0), s = r.slice(0), a = 0;
            a < 4 * e._blocksize;
            a++
          )
            (u[a] ^= 92), (s[a] ^= 54);
          var f = e(u.concat(e(s.concat(n), { asBytes: !0 })), { asBytes: !0 });
          return c && c.asBytes
            ? f
            : c && c.asString
            ? i.bytesToString(f)
            : t.bytesToHex(f);
        };
      })();
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        var e = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          t = e.util,
          r = e.charenc,
          o = r.UTF8,
          i =
            (r.Binary,
            (e.MARC4 = {
              encrypt: function (n, r) {
                var c = o.stringToBytes(n),
                  u = t.randomBytes(16),
                  s =
                    r.constructor == String
                      ? e.PBKDF2(r, u, 32, { asBytes: !0 })
                      : r;
                return i._marc4(c, s, 1536), t.bytesToBase64(u.concat(c));
              },
              decrypt: function (n, r) {
                var c = t.base64ToBytes(n),
                  u = c.splice(0, 16),
                  s =
                    r.constructor == String
                      ? e.PBKDF2(r, u, 32, { asBytes: !0 })
                      : r;
                return i._marc4(c, s, 1536), o.bytesToString(c);
              },
              _marc4: function (e, t, n) {
                var r, o, i, c;
                for (r = 0, i = []; r < 256; r++) i[r] = r;
                for (r = 0, o = 0; r < 256; r++)
                  (o = (o + i[r] + t[r % t.length]) % 256),
                    (c = i[r]),
                    (i[r] = i[o]),
                    (i[o] = c);
                r = o = 0;
                for (var t = -n; t < e.length; t++)
                  (r = (r + 1) % 256),
                    (o = (o + i[r]) % 256),
                    (c = i[r]),
                    (i[r] = i[o]),
                    (i[o] = c),
                    t < 0 || (e[t] ^= i[(i[r] + i[o]) % 256]);
              },
            }));
      })();
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        var e = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          t = e.util,
          r = e.charenc,
          o = r.UTF8,
          i = r.Binary,
          c = (e.MD5 = function (e, n) {
            var r = t.wordsToBytes(c._md5(e));
            return n && n.asBytes
              ? r
              : n && n.asString
              ? i.bytesToString(r)
              : t.bytesToHex(r);
          });
        (c._md5 = function (e) {
          e.constructor == String && (e = o.stringToBytes(e));
          for (
            var n = t.bytesToWords(e),
              r = 8 * e.length,
              i = 1732584193,
              u = -271733879,
              s = -1732584194,
              a = 271733878,
              f = 0;
            f < n.length;
            f++
          )
            n[f] =
              (16711935 & ((n[f] << 8) | (n[f] >>> 24))) |
              (4278255360 & ((n[f] << 24) | (n[f] >>> 8)));
          (n[r >>> 5] |= 128 << r % 32), (n[(((r + 64) >>> 9) << 4) + 14] = r);
          for (
            var l = c._ff, d = c._gg, v = c._hh, h = c._ii, f = 0;
            f < n.length;
            f += 16
          ) {
            var p = i,
              g = u,
              y = s,
              w = a;
            (i = l(i, u, s, a, n[f + 0], 7, -680876936)),
              (a = l(a, i, u, s, n[f + 1], 12, -389564586)),
              (s = l(s, a, i, u, n[f + 2], 17, 606105819)),
              (u = l(u, s, a, i, n[f + 3], 22, -1044525330)),
              (i = l(i, u, s, a, n[f + 4], 7, -176418897)),
              (a = l(a, i, u, s, n[f + 5], 12, 1200080426)),
              (s = l(s, a, i, u, n[f + 6], 17, -1473231341)),
              (u = l(u, s, a, i, n[f + 7], 22, -45705983)),
              (i = l(i, u, s, a, n[f + 8], 7, 1770035416)),
              (a = l(a, i, u, s, n[f + 9], 12, -1958414417)),
              (s = l(s, a, i, u, n[f + 10], 17, -42063)),
              (u = l(u, s, a, i, n[f + 11], 22, -1990404162)),
              (i = l(i, u, s, a, n[f + 12], 7, 1804603682)),
              (a = l(a, i, u, s, n[f + 13], 12, -40341101)),
              (s = l(s, a, i, u, n[f + 14], 17, -1502002290)),
              (u = l(u, s, a, i, n[f + 15], 22, 1236535329)),
              (i = d(i, u, s, a, n[f + 1], 5, -165796510)),
              (a = d(a, i, u, s, n[f + 6], 9, -1069501632)),
              (s = d(s, a, i, u, n[f + 11], 14, 643717713)),
              (u = d(u, s, a, i, n[f + 0], 20, -373897302)),
              (i = d(i, u, s, a, n[f + 5], 5, -701558691)),
              (a = d(a, i, u, s, n[f + 10], 9, 38016083)),
              (s = d(s, a, i, u, n[f + 15], 14, -660478335)),
              (u = d(u, s, a, i, n[f + 4], 20, -405537848)),
              (i = d(i, u, s, a, n[f + 9], 5, 568446438)),
              (a = d(a, i, u, s, n[f + 14], 9, -1019803690)),
              (s = d(s, a, i, u, n[f + 3], 14, -187363961)),
              (u = d(u, s, a, i, n[f + 8], 20, 1163531501)),
              (i = d(i, u, s, a, n[f + 13], 5, -1444681467)),
              (a = d(a, i, u, s, n[f + 2], 9, -51403784)),
              (s = d(s, a, i, u, n[f + 7], 14, 1735328473)),
              (u = d(u, s, a, i, n[f + 12], 20, -1926607734)),
              (i = v(i, u, s, a, n[f + 5], 4, -378558)),
              (a = v(a, i, u, s, n[f + 8], 11, -2022574463)),
              (s = v(s, a, i, u, n[f + 11], 16, 1839030562)),
              (u = v(u, s, a, i, n[f + 14], 23, -35309556)),
              (i = v(i, u, s, a, n[f + 1], 4, -1530992060)),
              (a = v(a, i, u, s, n[f + 4], 11, 1272893353)),
              (s = v(s, a, i, u, n[f + 7], 16, -155497632)),
              (u = v(u, s, a, i, n[f + 10], 23, -1094730640)),
              (i = v(i, u, s, a, n[f + 13], 4, 681279174)),
              (a = v(a, i, u, s, n[f + 0], 11, -358537222)),
              (s = v(s, a, i, u, n[f + 3], 16, -722521979)),
              (u = v(u, s, a, i, n[f + 6], 23, 76029189)),
              (i = v(i, u, s, a, n[f + 9], 4, -640364487)),
              (a = v(a, i, u, s, n[f + 12], 11, -421815835)),
              (s = v(s, a, i, u, n[f + 15], 16, 530742520)),
              (u = v(u, s, a, i, n[f + 2], 23, -995338651)),
              (i = h(i, u, s, a, n[f + 0], 6, -198630844)),
              (a = h(a, i, u, s, n[f + 7], 10, 1126891415)),
              (s = h(s, a, i, u, n[f + 14], 15, -1416354905)),
              (u = h(u, s, a, i, n[f + 5], 21, -57434055)),
              (i = h(i, u, s, a, n[f + 12], 6, 1700485571)),
              (a = h(a, i, u, s, n[f + 3], 10, -1894986606)),
              (s = h(s, a, i, u, n[f + 10], 15, -1051523)),
              (u = h(u, s, a, i, n[f + 1], 21, -2054922799)),
              (i = h(i, u, s, a, n[f + 8], 6, 1873313359)),
              (a = h(a, i, u, s, n[f + 15], 10, -30611744)),
              (s = h(s, a, i, u, n[f + 6], 15, -1560198380)),
              (u = h(u, s, a, i, n[f + 13], 21, 1309151649)),
              (i = h(i, u, s, a, n[f + 4], 6, -145523070)),
              (a = h(a, i, u, s, n[f + 11], 10, -1120210379)),
              (s = h(s, a, i, u, n[f + 2], 15, 718787259)),
              (u = h(u, s, a, i, n[f + 9], 21, -343485551)),
              (i = (i + p) >>> 0),
              (u = (u + g) >>> 0),
              (s = (s + y) >>> 0),
              (a = (a + w) >>> 0);
          }
          return t.endian([i, u, s, a]);
        }),
          (c._ff = function (e, t, n, r, o, i, c) {
            var u = e + ((t & n) | (~t & r)) + (o >>> 0) + c;
            return ((u << i) | (u >>> (32 - i))) + t;
          }),
          (c._gg = function (e, t, n, r, o, i, c) {
            var u = e + ((t & r) | (n & ~r)) + (o >>> 0) + c;
            return ((u << i) | (u >>> (32 - i))) + t;
          }),
          (c._hh = function (e, t, n, r, o, i, c) {
            var u = e + (t ^ n ^ r) + (o >>> 0) + c;
            return ((u << i) | (u >>> (32 - i))) + t;
          }),
          (c._ii = function (e, t, n, r, o, i, c) {
            var u = e + (n ^ (t | ~r)) + (o >>> 0) + c;
            return ((u << i) | (u >>> (32 - i))) + t;
          }),
          (c._blocksize = 16),
          (c._digestsize = 16);
      })();
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        var e = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          t = e.util,
          r = e.charenc,
          o = r.UTF8,
          i = r.Binary;
        e.PBKDF2 = function (n, r, c, u) {
          function s(t, n) {
            return e.HMAC(a, n, t, { asBytes: !0 });
          }
          n.constructor == String && (n = o.stringToBytes(n)),
            r.constructor == String && (r = o.stringToBytes(r));
          for (
            var a = (u && u.hasher) || e.SHA1,
              f = (u && u.iterations) || 1,
              l = [],
              d = 1;
            l.length < c;

          ) {
            for (
              var v = s(n, r.concat(t.wordsToBytes([d]))), h = v, p = 1;
              p < f;
              p++
            ) {
              h = s(n, h);
              for (var g = 0; g < v.length; g++) v[g] ^= h[g];
            }
            (l = l.concat(v)), d++;
          }
          return (
            (l.length = c),
            u && u.asBytes
              ? l
              : u && u.asString
              ? i.bytesToString(l)
              : t.bytesToHex(l)
          );
        };
      })();
    },
    function (e, t, n) {
      (function (e) {
        "use strict";
        !(function () {
          var t = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
            r = t.util,
            o = t.charenc,
            i = o.UTF8,
            c = o.Binary;
          t.nextTick ||
            ("undefined" != typeof e && "undefined" != typeof e.nextTick
              ? (t.nextTick = e.nextTick)
              : "undefined" != typeof setTimeout &&
                (t.nextTick = function (e) {
                  setTimeout(e, 0);
                })),
            (t.PBKDF2Async = function (e, n, o, u, s) {
              function a(e) {
                if (p) {
                  var t = (w.length / v._digestsize) * h + e;
                  setTimeout(function () {
                    p(Math.round((t / g) * 100));
                  }, 0);
                }
              }
              function f(e, n) {
                return t.HMAC(v, n, e, { asBytes: !0 });
              }
              e.constructor == String && (e = i.stringToBytes(e)),
                n.constructor == String && (n = i.stringToBytes(n));
              var l,
                d,
                v = (s && s.hasher) || t.SHA1,
                h = (s && s.iterations) || 1,
                p = s && s.onProgressChange,
                g = Math.ceil(o / v._digestsize) * h,
                y = t.nextTick,
                w = [],
                m = 1;
              y(
                (l = function () {
                  if (w.length < o) {
                    var t = f(e, n.concat(r.wordsToBytes([m])));
                    a(1);
                    var i = t,
                      v = 1;
                    y(
                      (d = function () {
                        if (v < h) {
                          i = f(e, i);
                          for (var n = 0; n < t.length; n++) t[n] ^= i[n];
                          v++, a(v), y(d);
                        } else (w = w.concat(t)), m++, y(l);
                      })
                    );
                  } else
                    (w.length = o),
                      u(
                        s && s.asBytes
                          ? w
                          : s && s.asString
                          ? c.bytesToString(w)
                          : r.bytesToHex(w)
                      );
                })
              );
            });
        })();
      }).call(t, n(112));
    },
    function (e, t) {
      function n() {
        throw new Error("setTimeout has not been defined");
      }
      function r() {
        throw new Error("clearTimeout has not been defined");
      }
      function o(e) {
        if (f === setTimeout) return setTimeout(e, 0);
        if ((f === n || !f) && setTimeout)
          return (f = setTimeout), setTimeout(e, 0);
        try {
          return f(e, 0);
        } catch (t) {
          try {
            return f.call(null, e, 0);
          } catch (t) {
            return f.call(this, e, 0);
          }
        }
      }
      function i(e) {
        if (l === clearTimeout) return clearTimeout(e);
        if ((l === r || !l) && clearTimeout)
          return (l = clearTimeout), clearTimeout(e);
        try {
          return l(e);
        } catch (t) {
          try {
            return l.call(null, e);
          } catch (t) {
            return l.call(this, e);
          }
        }
      }
      function c() {
        p &&
          v &&
          ((p = !1), v.length ? (h = v.concat(h)) : (g = -1), h.length && u());
      }
      function u() {
        if (!p) {
          var e = o(c);
          p = !0;
          for (var t = h.length; t; ) {
            for (v = h, h = []; ++g < t; ) v && v[g].run();
            (g = -1), (t = h.length);
          }
          (v = null), (p = !1), i(e);
        }
      }
      function s(e, t) {
        (this.fun = e), (this.array = t);
      }
      function a() {}
      var f,
        l,
        d = (e.exports = {});
      !(function () {
        try {
          f = "function" == typeof setTimeout ? setTimeout : n;
        } catch (e) {
          f = n;
        }
        try {
          l = "function" == typeof clearTimeout ? clearTimeout : r;
        } catch (e) {
          l = r;
        }
      })();
      var v,
        h = [],
        p = !1,
        g = -1;
      (d.nextTick = function (e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1)
          for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
        h.push(new s(e, t)), 1 !== h.length || p || o(u);
      }),
        (s.prototype.run = function () {
          this.fun.apply(null, this.array);
        }),
        (d.title = "browser"),
        (d.browser = !0),
        (d.env = {}),
        (d.argv = []),
        (d.version = ""),
        (d.versions = {}),
        (d.on = a),
        (d.addListener = a),
        (d.once = a),
        (d.off = a),
        (d.removeListener = a),
        (d.removeAllListeners = a),
        (d.emit = a),
        (d.prependListener = a),
        (d.prependOnceListener = a),
        (d.listeners = function (e) {
          return [];
        }),
        (d.binding = function (e) {
          throw new Error("process.binding is not supported");
        }),
        (d.cwd = function () {
          return "/";
        }),
        (d.chdir = function (e) {
          throw new Error("process.chdir is not supported");
        }),
        (d.umask = function () {
          return 0;
        });
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        var e,
          t = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          r = t.util,
          o = t.charenc,
          i = o.UTF8,
          c = (o.Binary, []),
          u = [],
          s = (t.Rabbit = {
            encrypt: function (e, n) {
              var o = i.stringToBytes(e),
                c = r.randomBytes(8),
                u =
                  n.constructor == String
                    ? t.PBKDF2(n, c, 32, { asBytes: !0 })
                    : n;
              return (
                s._rabbit(o, u, r.bytesToWords(c)), r.bytesToBase64(c.concat(o))
              );
            },
            decrypt: function (e, n) {
              var o = r.base64ToBytes(e),
                c = o.splice(0, 8),
                u =
                  n.constructor == String
                    ? t.PBKDF2(n, c, 32, { asBytes: !0 })
                    : n;
              return s._rabbit(o, u, r.bytesToWords(c)), i.bytesToString(o);
            },
            _rabbit: function (e, t, n) {
              s._keysetup(t), n && s._ivsetup(n);
              for (var r = [], o = 0; o < e.length; o++) {
                if (o % 16 == 0) {
                  s._nextstate(),
                    (r[0] = c[0] ^ (c[5] >>> 16) ^ (c[3] << 16)),
                    (r[1] = c[2] ^ (c[7] >>> 16) ^ (c[5] << 16)),
                    (r[2] = c[4] ^ (c[1] >>> 16) ^ (c[7] << 16)),
                    (r[3] = c[6] ^ (c[3] >>> 16) ^ (c[1] << 16));
                  for (var i = 0; i < 4; i++)
                    r[i] =
                      (16711935 & ((r[i] << 8) | (r[i] >>> 24))) |
                      (4278255360 & ((r[i] << 24) | (r[i] >>> 8)));
                  for (var u = 120; u >= 0; u -= 8)
                    r[u / 8] = (r[u >>> 5] >>> (24 - (u % 32))) & 255;
                }
                e[o] ^= r[o % 16];
              }
            },
            _keysetup: function (t) {
              (c[0] = t[0]),
                (c[2] = t[1]),
                (c[4] = t[2]),
                (c[6] = t[3]),
                (c[1] = (t[3] << 16) | (t[2] >>> 16)),
                (c[3] = (t[0] << 16) | (t[3] >>> 16)),
                (c[5] = (t[1] << 16) | (t[0] >>> 16)),
                (c[7] = (t[2] << 16) | (t[1] >>> 16)),
                (u[0] = r.rotl(t[2], 16)),
                (u[2] = r.rotl(t[3], 16)),
                (u[4] = r.rotl(t[0], 16)),
                (u[6] = r.rotl(t[1], 16)),
                (u[1] = (4294901760 & t[0]) | (65535 & t[1])),
                (u[3] = (4294901760 & t[1]) | (65535 & t[2])),
                (u[5] = (4294901760 & t[2]) | (65535 & t[3])),
                (u[7] = (4294901760 & t[3]) | (65535 & t[0])),
                (e = 0);
              for (var n = 0; n < 4; n++) s._nextstate();
              for (var n = 0; n < 8; n++) u[n] ^= c[(n + 4) & 7];
            },
            _ivsetup: function (e) {
              var t = r.endian(e[0]),
                n = r.endian(e[1]),
                o = (t >>> 16) | (4294901760 & n),
                i = (n << 16) | (65535 & t);
              (u[0] ^= t),
                (u[1] ^= o),
                (u[2] ^= n),
                (u[3] ^= i),
                (u[4] ^= t),
                (u[5] ^= o),
                (u[6] ^= n),
                (u[7] ^= i);
              for (var c = 0; c < 4; c++) s._nextstate();
            },
            _nextstate: function () {
              for (var t = [], n = 0; n < 8; n++) t[n] = u[n];
              (u[0] = (u[0] + 1295307597 + e) >>> 0),
                (u[1] =
                  (u[1] + 3545052371 + (u[0] >>> 0 < t[0] >>> 0 ? 1 : 0)) >>>
                  0),
                (u[2] =
                  (u[2] + 886263092 + (u[1] >>> 0 < t[1] >>> 0 ? 1 : 0)) >>> 0),
                (u[3] =
                  (u[3] + 1295307597 + (u[2] >>> 0 < t[2] >>> 0 ? 1 : 0)) >>>
                  0),
                (u[4] =
                  (u[4] + 3545052371 + (u[3] >>> 0 < t[3] >>> 0 ? 1 : 0)) >>>
                  0),
                (u[5] =
                  (u[5] + 886263092 + (u[4] >>> 0 < t[4] >>> 0 ? 1 : 0)) >>> 0),
                (u[6] =
                  (u[6] + 1295307597 + (u[5] >>> 0 < t[5] >>> 0 ? 1 : 0)) >>>
                  0),
                (u[7] =
                  (u[7] + 3545052371 + (u[6] >>> 0 < t[6] >>> 0 ? 1 : 0)) >>>
                  0),
                (e = u[7] >>> 0 < t[7] >>> 0 ? 1 : 0);
              for (var r = [], n = 0; n < 8; n++) {
                var o = (c[n] + u[n]) >>> 0,
                  i = 65535 & o,
                  s = o >>> 16,
                  a = ((((i * i) >>> 17) + i * s) >>> 15) + s * s,
                  f =
                    ((((4294901760 & o) * o) >>> 0) +
                      (((65535 & o) * o) >>> 0)) >>>
                    0;
                r[n] = a ^ f;
              }
              (c[0] =
                r[0] +
                ((r[7] << 16) | (r[7] >>> 16)) +
                ((r[6] << 16) | (r[6] >>> 16))),
                (c[1] = r[1] + ((r[0] << 8) | (r[0] >>> 24)) + r[7]),
                (c[2] =
                  r[2] +
                  ((r[1] << 16) | (r[1] >>> 16)) +
                  ((r[0] << 16) | (r[0] >>> 16))),
                (c[3] = r[3] + ((r[2] << 8) | (r[2] >>> 24)) + r[1]),
                (c[4] =
                  r[4] +
                  ((r[3] << 16) | (r[3] >>> 16)) +
                  ((r[2] << 16) | (r[2] >>> 16))),
                (c[5] = r[5] + ((r[4] << 8) | (r[4] >>> 24)) + r[3]),
                (c[6] =
                  r[6] +
                  ((r[5] << 16) | (r[5] >>> 16)) +
                  ((r[4] << 16) | (r[4] >>> 16))),
                (c[7] = r[7] + ((r[6] << 8) | (r[6] >>> 24)) + r[5]);
            },
          });
      })();
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        var e = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          t = e.util,
          r = e.charenc,
          o = r.UTF8,
          i = r.Binary,
          c = (e.SHA1 = function (e, n) {
            var r = t.wordsToBytes(c._sha1(e));
            return n && n.asBytes
              ? r
              : n && n.asString
              ? i.bytesToString(r)
              : t.bytesToHex(r);
          });
        (c._sha1 = function (e) {
          e.constructor == String && (e = o.stringToBytes(e));
          var n = t.bytesToWords(e),
            r = 8 * e.length,
            i = [],
            c = 1732584193,
            u = -271733879,
            s = -1732584194,
            a = 271733878,
            f = -1009589776;
          (n[r >> 5] |= 128 << (24 - (r % 32))),
            (n[(((r + 64) >>> 9) << 4) + 15] = r);
          for (var l = 0; l < n.length; l += 16) {
            for (var d = c, v = u, h = s, p = a, g = f, y = 0; y < 80; y++) {
              if (y < 16) i[y] = n[l + y];
              else {
                var w = i[y - 3] ^ i[y - 8] ^ i[y - 14] ^ i[y - 16];
                i[y] = (w << 1) | (w >>> 31);
              }
              var m =
                ((c << 5) | (c >>> 27)) +
                f +
                (i[y] >>> 0) +
                (y < 20
                  ? ((u & s) | (~u & a)) + 1518500249
                  : y < 40
                  ? (u ^ s ^ a) + 1859775393
                  : y < 60
                  ? ((u & s) | (u & a) | (s & a)) - 1894007588
                  : (u ^ s ^ a) - 899497514);
              (f = a), (a = s), (s = (u << 30) | (u >>> 2)), (u = c), (c = m);
            }
            (c += d), (u += v), (s += h), (a += p), (f += g);
          }
          return [c, u, s, a, f];
        }),
          (c._blocksize = 16),
          (c._digestsize = 20);
      })();
    },
    function (e, t, n) {
      "use strict";
      !(function () {
        var e = "undefined" == typeof window ? n(101).Crypto : window.Crypto,
          t = e.util,
          r = e.charenc,
          o = r.UTF8,
          i = r.Binary,
          c = [
            1116352408, 1899447441, 3049323471, 3921009573, 961987163,
            1508970993, 2453635748, 2870763221, 3624381080, 310598401,
            607225278, 1426881987, 1925078388, 2162078206, 2614888103,
            3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983,
            1249150122, 1555081692, 1996064986, 2554220882, 2821834349,
            2952996808, 3210313671, 3336571891, 3584528711, 113926993,
            338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
            1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
            3259730800, 3345764771, 3516065817, 3600352804, 4094571909,
            275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
            1322822218, 1537002063, 1747873779, 1955562222, 2024104815,
            2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
            3329325298,
          ],
          u = (e.SHA256 = function (e, n) {
            var r = t.wordsToBytes(u._sha256(e));
            return n && n.asBytes
              ? r
              : n && n.asString
              ? i.bytesToString(r)
              : t.bytesToHex(r);
          });
        (u._sha256 = function (e) {
          e.constructor == String && (e = o.stringToBytes(e));
          var n,
            r,
            i,
            u,
            s,
            a,
            f,
            l,
            d,
            v,
            h,
            p,
            g = t.bytesToWords(e),
            y = 8 * e.length,
            w = [
              1779033703, 3144134277, 1013904242, 2773480762, 1359893119,
              2600822924, 528734635, 1541459225,
            ],
            m = [];
          (g[y >> 5] |= 128 << (24 - (y % 32))),
            (g[(((y + 64) >> 9) << 4) + 15] = y);
          for (var d = 0; d < g.length; d += 16) {
            (n = w[0]),
              (r = w[1]),
              (i = w[2]),
              (u = w[3]),
              (s = w[4]),
              (a = w[5]),
              (f = w[6]),
              (l = w[7]);
            for (var v = 0; v < 64; v++) {
              if (v < 16) m[v] = g[v + d];
              else {
                var b = m[v - 15],
                  I = m[v - 2],
                  _ =
                    ((b << 25) | (b >>> 7)) ^
                    ((b << 14) | (b >>> 18)) ^
                    (b >>> 3),
                  S =
                    ((I << 15) | (I >>> 17)) ^
                    ((I << 13) | (I >>> 19)) ^
                    (I >>> 10);
                m[v] = _ + (m[v - 7] >>> 0) + S + (m[v - 16] >>> 0);
              }
              var x = (s & a) ^ (~s & f),
                T = (n & r) ^ (n & i) ^ (r & i),
                B =
                  ((n << 30) | (n >>> 2)) ^
                  ((n << 19) | (n >>> 13)) ^
                  ((n << 10) | (n >>> 22)),
                C =
                  ((s << 26) | (s >>> 6)) ^
                  ((s << 21) | (s >>> 11)) ^
                  ((s << 7) | (s >>> 25));
              (h = (l >>> 0) + C + x + c[v] + (m[v] >>> 0)),
                (p = B + T),
                (l = f),
                (f = a),
                (a = s),
                (s = (u + h) >>> 0),
                (u = i),
                (i = r),
                (r = n),
                (n = (h + p) >>> 0);
            }
            (w[0] += n),
              (w[1] += r),
              (w[2] += i),
              (w[3] += u),
              (w[4] += s),
              (w[5] += a),
              (w[6] += f),
              (w[7] += l);
          }
          return w;
        }),
          (u._blocksize = 16),
          (u._digestsize = 32);
      })();
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o() {
        try {
          var e = wx.getStorageSync(C);
          if (e) return e;
        } catch (e) {
          console.log("get " + C + " error!");
        }
      }
      function i(e) {
        wx.setStorage({
          key: C,
          data: e,
          success: function () {
            B.debug("save lock userinfo success");
          },
          fail: function () {
            B.debug("!!save lock userinfo fail");
          },
        });
      }
      function c() {
        return wx.getStorageSync(L);
      }
      function u() {
        return wx.getStorageSync(E);
      }
      function s(e, t) {
        wx.setStorage({
          key: L,
          data: e,
          success: function () {
            B.debug("save lock set success"), t();
          },
          fail: function () {
            t(new p(5000003, "set locks fail")),
              B.debug("!!save lock set fail");
          },
        });
      }
      function a(e) {
        var t = c();
        if (!t) return !1;
        var n = !0,
          r = !1,
          o = void 0;
        try {
          for (
            var i, u = (0, T.default)(t);
            !(n = (i = u.next()).done);
            n = !0
          ) {
            var s = i.value;
            if (s.mac.toLowerCase() === e.toLowerCase()) return !0;
          }
        } catch (e) {
          (r = !0), (o = e);
        } finally {
          try {
            !n && u.return && u.return();
          } finally {
            if (r) throw o;
          }
        }
        return !1;
      }
      function f(e) {
        var t = getliftset();
        if (!t) return !1;
        var n = !0,
          r = !1,
          o = void 0;
        try {
          for (
            var i, c = (0, T.default)(t);
            !(n = (i = c.next()).done);
            n = !0
          ) {
            var u = i.value;
            if (u.mac.toLowerCase() === e.toLowerCase()) return !0;
          }
        } catch (e) {
          (r = !0), (o = e);
        } finally {
          try {
            !n && c.return && c.return();
          } finally {
            if (r) throw o;
          }
        }
        return !1;
      }
      function l(e) {
        wx.stopBluetoothDevicesDiscovery({
          success: function (e) {
            B.debug("ble scan stopped");
          },
          fail: function (e) {
            B.error(e);
          },
          complete: function (t) {
            d(e);
          },
        });
      }
      function d(e, t) {
        e && "function" == typeof e && e(t);
      }
      function v() {
        return k || (k = wx.getSystemInfoSync()), k;
      }
      function h(e, t) {
        var n = new Uint8Array(e.advertisData);
        if (
          (B.debug(
            "deviceId:" + e.deviceId + "," + n.length + ", " + g(e.advertisData)
          ),
          "android" === t.platform)
        ) {
          if (
            4 !== n.length &&
            6 !== n.length &&
            12 !== n.length &&
            14 !== n.length &&
            15 !== n.length
          )
            return !1;
          var r = e.deviceId.split(":");
          if (4 === n.length) {
            for (var o = 0; o < 4; o++)
              if (parseInt(r[o], 16) !== n[3 - o]) return;
            return {
              name: e.name,
              fwVersion: 20,
              devType: 1,
              deviceId: e.deviceId,
              mac: e.deviceId,
              rssi: e.RSSI,
            };
          }
          if (6 === n.length) {
            for (var i = 0; i < 6; i++)
              if (parseInt(r[i], 16) !== n[5 - i]) return;
            return {
              name: e.name,
              fwVersion: 20,
              devType: 1,
              deviceId: e.deviceId,
              mac: e.deviceId,
              rssi: e.RSSI,
            };
          }
          if (12 === n.length) {
            for (var c = 6, u = 0; c < 12; c++, u++)
              if (parseInt(r[u], 16) !== n[c]) return;
            return {
              name: e.name,
              fwVersion: n[1],
              devType: n[0],
              deviceId: e.deviceId,
              mac: e.deviceId,
              rssi: e.RSSI,
            };
          }
          if (14 === n.length) {
            for (var s = 8, a = 0; s < 14; s++, a++)
              if (parseInt(r[a], 16) !== n[s]) return;
            return {
              name: e.name,
              fwVersion: n[3],
              devType: n[2],
              deviceId: e.deviceId,
              mac: e.deviceId,
              rssi: e.RSSI,
            };
          }
        } else if ("ios" === t.platform) {
          if (6 !== n.length && 14 !== n.length) return !1;
          var f = "";
          if (6 === n.length) {
            for (var l = 0; l < 6; l++)
              f = f + ("00" + n[5 - l].toString(16)).slice(-2) + ":";
            return (
              (f = f.substring(0, f.length - 1)),
              B.debug("parse mac from ad," + f),
              {
                name: e.name,
                fwVersion: 20,
                devType: 1,
                deviceId: e.deviceId,
                mac: f,
                rssi: e.RSSI,
              }
            );
          }
          if (14 === n.length) {
            for (var d = 8, v = 0; d < 14; d++, v++)
              f = f + ("00" + n[d].toString(16)).slice(-2) + ":";
            return (
              (f = f.substring(0, f.length - 1)),
              B.debug("parse mac from ad," + f),
              {
                name: e.name,
                fwVersion: n[3],
                devType: n[2],
                deviceId: e.deviceId,
                mac: f,
                rssi: e.RSSI,
              }
            );
          }
        }
        return !1;
      }
      function p(e, t) {
        (this.errMsg = t), (this.errCode = e);
      }
      function g(e) {
        return Array.prototype.map
          .call(new Uint8Array(e), function (e) {
            return ("00" + e.toString(16)).slice(-2);
          })
          .join("");
      }
      function y() {
        wx.closeBluetoothAdapter({
          success: function (e) {
            B.info("close adapter success!");
          },
        });
      }
      function w() {
        return v().model && v().model.toLowerCase().startsWith("huawei");
      }
      function m() {
        var e = o();
        return !!e || (B.error("have not initialized!"), !1);
      }
      function b(e) {
        try {
          if ((0, S.default)(e)) return e.toString(16).padStart(2, "0");
          var t = Array.prototype.map.call(new Uint8Array(e), function (e) {
            return ("00" + e.toString(16)).slice(-2);
          });
          return t.join("");
        } catch (e) {
          B.error("format Data returned by the device fail");
        }
        return null;
      }
      function I(e) {
        var t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          n = [],
          r = t;
        do (n[--r] = 255 & e), (e >>= 8);
        while (r);
        return n;
      }
      var _ = n(117),
        S = r(_),
        x = n(121),
        T = r(x),
        B = n(71),
        C = "_lope_ikey_user_",
        L = "_lope_ikey_lock_set_",
        E = "_lope_ikey_lift_set_",
        k = null;
      (p.prototype = new p()),
        (p.prototype.constructor = p),
        (e.exports = {
          getLockUserInfo: o,
          saveLockUserInfo: i,
          getLockSet: c,
          saveLockSet: s,
          isLockInSet: a,
          validate: h,
          buf2hex: g,
          BizError: p,
          getSystemInfo: v,
          stopScan: l,
          applyIfOkay: d,
          closeAdapter: y,
          isHuawei: w,
          isInit: m,
          isLiftInSet: f,
          getLiftSet: u,
          ab2hex: b,
          convertIntBytes: I,
        });
    },
    function (e, t, n) {
      e.exports = { default: n(118), __esModule: !0 };
    },
    function (e, t, n) {
      n(119), (e.exports = n(13).Number.isInteger);
    },
    function (e, t, n) {
      var r = n(11);
      r(r.S, "Number", { isInteger: n(120) });
    },
    function (e, t, n) {
      var r = n(19),
        o = Math.floor;
      e.exports = function (e) {
        return !r(e) && isFinite(e) && o(e) === e;
      };
    },
    function (e, t, n) {
      e.exports = { default: n(122), __esModule: !0 };
    },
    function (e, t, n) {
      n(49), n(5), (e.exports = n(123));
    },
    function (e, t, n) {
      var r = n(18),
        o = n(82);
      e.exports = n(13).getIterator = function (e) {
        var t = o(e);
        if ("function" != typeof t) throw TypeError(e + " is not iterable!");
        return r(t.call(e));
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o(e, t) {
        return a.isInit()
          ? void s.post(
              "lock.pullById",
              { sids: e },
              a.getLockUserInfo(),
              function (e) {
                2e6 === e.data.state.code && e.data.data.lock_info.length > 0
                  ? a.saveLockSet(e.data.data.lock_info, t)
                  : t(
                      new a.BizError(
                        5000001,
                        "sid not exists! " + (0, c.default)(e.data.state)
                      )
                    );
              },
              function () {
                u.error("set locks fail"),
                  t(new a.BizError(5000003, "set locks fail"));
              }
            )
          : void t(new a.BizError(1001, "have not initialized!"));
      }
      var i = n(69),
        c = r(i),
        u = n(71),
        s = n(73),
        a = n(116);
      e.exports = { execute: o };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o(e, t) {
        return (
          (p = []),
          v.isInit()
            ? ("android" === v.getSystemInfo().platform &&
                wx.getBluetoothDevices({
                  success: function (e) {
                    var t = e.devices;
                    if (
                      (d.debug("cached devices" + (0, l.default)(t)),
                      t && t.length > 0)
                    ) {
                      var n = !0,
                        r = !1,
                        o = void 0;
                      try {
                        for (
                          var i, c = (0, a.default)(t);
                          !(n = (i = c.next()).done);
                          n = !0
                        ) {
                          var s = i.value;
                          d.debug("get device from cached " + s.deviceId),
                            u(s, !0);
                        }
                      } catch (e) {
                        (r = !0), (o = e);
                      } finally {
                        try {
                          !n && c.return && c.return();
                        } finally {
                          if (r) throw o;
                        }
                      }
                    }
                  },
                }),
              void wx.startBluetoothDevicesDiscovery({
                allowDuplicatesKey: !1,
                success: function (n) {
                  d.debug("ble scan started"),
                    i(e, t),
                    wx.onBluetoothDeviceFound(u);
                },
                fail: function (e) {
                  t(e);
                },
              }))
            : void t(new v.BizError(1001, "have not initialized!"))
        );
      }
      function i(e, t) {
        h && c(),
          (h = setTimeout(function () {
            v.stopScan(), t(null, p);
          }, e));
      }
      function c() {
        h && (d.debug("clear timer"), clearTimeout(h), (h = null));
      }
      function u(e) {
        var t = void 0;
        e.deviceId
          ? (t = e)
          : e.devices
          ? (t = e.devices[0])
          : e[0] && (t = e[0]);
        var n = v.validate(t, v.getSystemInfo());
        if (n) {
          d.debug("found.."), d.debug(n);
          for (var r in p)
            if (p[r].mac === n.mac) {
              p.splice(r, 1);
              break;
            }
          p.push(n);
        }
      }
      var s = n(121),
        a = r(s),
        f = n(69),
        l = r(f),
        d = n(71),
        v = n(116),
        h = null,
        p = null;
      e.exports = { execute: o };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o() {
        V && i(),
          (V = setTimeout(function () {
            F.stopScan(),
              z && "function" == typeof z && z(new M(1007, "timeout " + j));
          }, j));
      }
      function i() {
        V && (P.debug("clear timer"), clearTimeout(V), (V = null));
      }
      function c(e, t) {
        if ("ios" === F.getSystemInfo().platform) {
          var n = u(e);
          if (!n)
            return (
              P.debug("get disconnect data exception!!"), void s(e.deviceId, t)
            );
          setTimeout(function () {
            var r =
                "android" === F.getSystemInfo().platform ? H.toLowerCase() : H,
              o =
                "android" === F.getSystemInfo().platform ? W.toLowerCase() : W;
            wx.writeBLECharacteristicValue({
              deviceId: e.deviceId,
              serviceId: r,
              characteristicId: o,
              value: n.buffer,
              success: function (e) {
                console.log("writeBLECharacteristicValue success", e.errMsg);
              },
              complete: function (n) {
                s(e.deviceId, t);
              },
            });
          }, 200);
        } else s(e.deviceId, t);
      }
      function u(e) {
        if (32 === e.fwVersion) {
          var t = 85,
            n = 136,
            r = 0,
            o = 0,
            i = n ^ r ^ o,
            c = new Uint8Array(5);
          return c.set([t, n, r, o, i], 0), c;
        }
        if (20 === e.fwVersion) {
          var u = new Uint8Array(1);
          return (u[0] = 170), u;
        }
        return 0;
      }
      function s(e, t) {
        wx.closeBLEConnection({
          deviceId: e,
          success: function (t) {
            P.info("disconnect device " + e + "successful");
          },
          fail: function (t) {
            P.info("disconnect device " + e + "fail"), P.error(t);
          },
          complete: function (e) {
            t && "function" == typeof t && t();
          },
        });
      }
      function a(e, t, n) {
        console.log("start notify" + e),
          wx.notifyBLECharacteristicValueChanged({
            deviceId: e,
            serviceId: H,
            characteristicId: Y,
            state: !0,
            success: function (n) {
              function r(e) {
                try {
                  var t = Array.prototype.map.call(
                    new Uint8Array(e),
                    function (e) {
                      return ("00" + e.toString(16)).slice(-2);
                    }
                  );
                  return t.join("");
                } catch (e) {
                  P.error("format Data returned by the device fail");
                }
                return null;
              }
              P.debug(n),
                wx.onBLECharacteristicValueChange(function (e) {
                  (K = r(e.value)), P.debug("ikey indicate value :" + K);
                }),
                wx.readBLECharacteristicValue({
                  deviceId: e,
                  serviceId: H,
                  characteristicId: Y,
                  success: function (e) {
                    P.debug("readBLECharacteristicValue:", e.errMsg);
                  },
                }),
                t();
            },
            fail: function (e) {
              P.error(e), n();
            },
          });
      }
      function f(e) {
        P.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === H.toLowerCase()) return e[t];
        return !1;
      }
      function l(e) {
        P.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === W.toLowerCase()) return e[t];
        return !1;
      }
      function d(e) {
        var t = !0,
          n = !1,
          r = void 0;
        try {
          for (
            var o, i = (0, O.default)(F.getLockSet());
            !(t = (o = i.next()).done);
            t = !0
          ) {
            var c = o.value;
            if (c.mac.toLowerCase() === e.toLowerCase()) return c.key;
          }
        } catch (e) {
          (n = !0), (r = e);
        } finally {
          try {
            !t && i.return && i.return();
          } finally {
            if (n) throw r;
          }
        }
      }
      function v(e) {
        return F.isInit()
          ? ((N = !1),
            (U = !0),
            (K = null),
            (G = !0),
            (R = 3),
            (z = e),
            void h()
              .then(p)
              .then(g)
              .then(y)
              .catch(function (e) {
                P.error(e);
              }))
          : void e(new F.BizError(1001, "have not initialized!"));
      }
      function h() {
        return new A.default(function (e, t) {
          wx.getBluetoothAdapterState({
            fail: function (e) {
              t(e);
            },
            success: function (n) {
              return n.available
                ? (wx.onBLEConnectionStateChanged(function (e) {
                    console.log(
                      "device " +
                        e.deviceId +
                        " state has changed, connected: " +
                        e.connected
                    );
                  }),
                  P.debug("ble adapter available"),
                  void e())
                : void t(new M(10001, "not init"));
            },
          });
        });
      }
      function p() {
        return new A.default(function (e, t) {
          return "ios" === F.getSystemInfo().platform
            ? void e()
            : void wx.getBluetoothDevices({
                success: function (t) {
                  var n = t.devices;
                  if (
                    (P.debug("cached devices" + (0, E.default)(n)),
                    n && n.length > 0)
                  ) {
                    var r = !0,
                      o = !1,
                      i = void 0;
                    try {
                      for (
                        var c, u = (0, O.default)(n);
                        !(r = (c = u.next()).done);
                        r = !0
                      ) {
                        var s = c.value;
                        P.debug("get device from cached " + s.deviceId),
                          F.isLockInSet(s.deviceId) && w(s, !0);
                      }
                    } catch (e) {
                      (o = !0), (i = e);
                    } finally {
                      try {
                        !r && u.return && u.return();
                      } finally {
                        if (o) throw i;
                      }
                    }
                  }
                  e();
                },
                fail: function (e) {
                  t(e);
                },
              });
        });
      }
      function g() {
        return new A.default(function (e, t) {
          wx.startBluetoothDevicesDiscovery({
            success: function (t) {
              P.debug("ble scan started"), o(), e();
            },
            fail: function (e) {
              t(e);
            },
          });
        });
      }
      function y() {
        return new A.default(function (e, t) {
          wx.getBluetoothAdapterState({
            complete: function (e) {
              P.debug(e);
            },
          }),
            wx.onBluetoothDeviceFound(w),
            e(),
            P.debug("initialize ble successful");
        });
      }
      function w(e, t) {
        if (!N) {
          var n = void 0;
          e.deviceId
            ? (n = e)
            : e.devices
            ? (n = e.devices[0])
            : e[0] && (n = e[0]);
          var r = F.validate(n, F.getSystemInfo());
          if (r)
            if (
              (P.debug("found device " + r.mac + (t ? ", from cache" : "")),
              F.isLockInSet(r.mac))
            ) {
              var o = d(r.mac);
              if (!o) return void P.error("can not get auth key");
              (N = !0), m(r, o, t);
            } else P.debug("has no authentication," + n.deviceId);
        }
      }
      function m(e, t, n, r) {
        r && "function" == typeof r && (z = r);
        var o = b([e, t]),
          c = o;
        "ios" === F.getSystemInfo().platform && (c = o.then(I).then(_)),
          c
            .then(S)
            .then(x)
            .then(B)
            .then(C)
            .catch(function (n) {
              if ((P.error(n), 1002 === n.errCode))
                return (
                  i(),
                  F.stopScan(),
                  void (
                    z &&
                    "function" == typeof z &&
                    z(new M(1002, (0, E.default)(n)))
                  )
                );
              if (--R > 0) {
                var r = 300 * (3 - R);
                return (
                  P.debug("retry after " + r + "ms, " + R),
                  void setTimeout(function () {
                    m(e, t);
                  }, r)
                );
              }
              i(),
                F.stopScan(F.closeAdapter),
                z &&
                  "function" == typeof z &&
                  z(new M(1005, (0, E.default)(n)));
            });
      }
      function b(e) {
        var t = e[0];
        e[1];
        return new A.default(function (n, r) {
          P.debug("start connect " + t.mac),
            wx.createBLEConnection({
              deviceId: t.deviceId,
              timeout: 3e3,
              success: function (r) {
                P.debug("connect " + t.mac + "successful"),
                  P.debug("delay 300ms"),
                  F.stopScan(),
                  setTimeout(function () {
                    n(e);
                  }, 100);
              },
              fail: function (e) {
                wx.getConnectedBluetoothDevices({
                  success: function (e) {
                    P.debug("connected devices [" + e + "]");
                  },
                }),
                  r(e);
              },
            });
        });
      }
      function I(e) {
        var t = e[0];
        e[1];
        return new A.default(function (n, r) {
          P.debug("start get services for " + t.mac),
            wx.getBLEDeviceServices({
              deviceId: t.deviceId,
              success: function (o) {
                var i = f(o.services);
                i
                  ? (P.debug("get service " + H + " successful, delay 200ms"),
                    setTimeout(function () {
                      n(e);
                    }, 100))
                  : (c(t), r("target service not found in " + t.mac));
              },
              fail: function (e) {
                r(e);
              },
            });
        });
      }
      function _(e) {
        var t = e[0];
        e[1];
        return new A.default(function (n, r) {
          P.debug("start get characteristic for " + t.mac);
          var o =
            "android" === F.getSystemInfo().platform ? H.toLowerCase() : H;
          wx.getBLEDeviceCharacteristics({
            deviceId: t.deviceId,
            serviceId: o,
            success: function (o) {
              var i = l(o.characteristics);
              i
                ? (P.debug("get characteristic " + i.uuid + " successful"),
                  n(e))
                : (c(t), r("target characteristic not found"));
            },
            fail: function (e) {
              r(e);
            },
          });
        });
      }
      function S(e) {
        var t = e[0];
        return new A.default(function (n, r) {
          P.debug("start notify " + t.mac),
            a(
              t.deviceId,
              function () {
                setTimeout(function () {
                  n(e);
                }, 100);
              },
              function () {
                P.error(
                  "start notify fail, current version Wechat not support!"
                ),
                  (U = !1),
                  n(e);
              }
            );
        });
      }
      function x(e) {
        var t = e[0],
          n = e[1];
        return new A.default(function (e, r) {
          P.debug("start do open lock");
          var o =
              "android" === F.getSystemInfo().platform ? H.toLowerCase() : H,
            i = "android" === F.getSystemInfo().platform ? W.toLowerCase() : W;
          T(t, o, i, n, e, r);
        });
      }
      function T(e, t, n, r, o, i) {
        var c = wx.base64ToArrayBuffer(r),
          u = c;
        if ((console.log("设备版本" + e.fwVersion), e.fwVersion > 20)) {
          var s = new Uint8Array(c),
            a = new Uint8Array(3 + s.length + 1);
          (a[0] = 85), (a[1] = 129), (a[2] = s.length);
          for (var f = 129 ^ s.length, l = 0; l < s.length; l++) f ^= s[l];
          (f ^= 0),
            a.set(s, 3),
            a.set([f], a.length - 1),
            console.log(a),
            (u = a.buffer);
        } else console.log("启用1.4设备兼容模式");
        wx.writeBLECharacteristicValue({
          deviceId: e.deviceId,
          serviceId: t,
          characteristicId: n,
          value: u,
          success: function (t) {
            P.debug("send auth key successful"), o(e);
          },
          fail: function (e) {
            P.debug(e), i(e);
          },
        });
      }
      function B(e) {
        return new A.default(function (t, n) {
          if (U) {
            var r = null,
              o = 500;
            r = setInterval(function () {
              return K
                ? ((G = "00" === K.substr(8, 2)), clearInterval(r), void t(e))
                : ((o -= 20),
                  o < 0
                    ? (clearInterval(r), void t(e))
                    : void P.info("waiting for notify value: " + o));
            }, 20);
          } else t(e);
        });
      }
      function C(e) {
        return new A.default(function (t, n) {
          i(),
            setTimeout(function () {
              return G
                ? (P.debug("lock opened, disconnect ble"),
                  c(e, function () {
                    F.closeAdapter(), t();
                  }),
                  void F.applyIfOkay(z))
                : void n({ errCode: 1002, errMsg: "password incorrect!" });
            }, 100);
        });
      }
      var L = n(69),
        E = r(L),
        k = n(74),
        A = r(k),
        D = n(121),
        O = r(D),
        P = n(71),
        F = (n(73), n(116)),
        M = F.BizError,
        R = 1,
        z = null,
        V = null,
        j = 1e4,
        N = !1,
        U = !0,
        K = null,
        G = !0,
        H = "00002560-0000-1000-8000-00805F9B34FB",
        W = "00002561-0000-1000-8000-00805F9B34FB",
        Y = "00002562-0000-1000-8000-00805F9B34FB";
      e.exports = { execute: v, openLock: m };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o() {
        U && i(),
          (U = setTimeout(function () {
            M.stopScan(),
              M.closeAdapter(),
              N && "function" == typeof N && N(new V(1007, "timeout " + K)),
              v();
          }, K));
      }
      function i() {
        U && (F.debug("clear timer"), clearTimeout(U), (U = null));
      }
      function c(e, t) {
        if ("ios" === M.getSystemInfo().platform) {
          var n = u(e);
          if (!n)
            return (
              F.debug("get disconnect data exception!!"), void s(e.deviceId, t)
            );
          setTimeout(function () {
            var r =
                "android" === M.getSystemInfo().platform ? Z.toLowerCase() : Z,
              o =
                "android" === M.getSystemInfo().platform ? Q.toLowerCase() : Q;
            wx.writeBLECharacteristicValue({
              deviceId: e.deviceId,
              serviceId: r,
              characteristicId: o,
              value: n.buffer,
              success: function (e) {
                console.log("writeBLECharacteristicValue success", e.errMsg);
              },
              complete: function (n) {
                s(e.deviceId, t);
              },
            });
          }, 200);
        } else s(e.deviceId, t);
      }
      function u(e) {
        if (32 === e.fwVersion) {
          var t = 85,
            n = 136,
            r = 0,
            o = 0,
            i = n ^ r ^ o,
            c = new Uint8Array(5);
          return c.set([t, n, r, o, i], 0), c;
        }
        if (20 === e.fwVersion) {
          var u = new Uint8Array(1);
          return (u[0] = 170), u;
        }
        return 0;
      }
      function s(e, t) {
        wx.closeBLEConnection({
          deviceId: e,
          success: function (t) {
            F.info("disconnect device " + e + "successful");
          },
          fail: function (t) {
            F.info("disconnect device " + e + "fail"), F.error(t);
          },
          complete: function (e) {
            t && "function" == typeof t && t();
          },
        });
      }
      function a(e, t, n) {
        console.log("start notify" + e),
          wx.notifyBLECharacteristicValueChanged({
            deviceId: e,
            serviceId: Z,
            characteristicId: $,
            state: !0,
            success: function (n) {
              function r(e) {
                try {
                  var t = Array.prototype.map.call(
                    new Uint8Array(e),
                    function (e) {
                      return ("00" + e.toString(16)).slice(-2);
                    }
                  );
                  return t.join("");
                } catch (e) {
                  F.error("format Data returned by the device fail");
                }
                return null;
              }
              F.debug(n),
                wx.onBLECharacteristicValueChange(function (e) {
                  (W = r(e.value)), F.debug("ikey indicate value :" + W);
                }),
                wx.readBLECharacteristicValue({
                  deviceId: e,
                  serviceId: Z,
                  characteristicId: $,
                  success: function (e) {
                    F.debug("readBLECharacteristicValue:", e.errMsg);
                  },
                }),
                t();
            },
            fail: function (e) {
              F.error(e), n();
            },
          });
      }
      function f(e) {
        F.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === Z.toLowerCase()) return e[t];
        return !1;
      }
      function l(e) {
        F.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === Q.toLowerCase()) return e[t];
        return !1;
      }
      function d(e, t, n, r, o) {
        return (
          "LOPE" === o || (t = E(t)),
          M.isInit()
            ? ((N = r),
              (q = t),
              (J = e),
              n < 1
                ? void F.debug("ioIndex is invalid, ioIndex " + n)
                : ((X = n),
                  void h()
                    .then(p)
                    .then(g)
                    .then(y)
                    .catch(function (e) {
                      v(), F.error(e);
                    })))
            : void r(new M.BizError(1001, "have not initialized!"))
        );
      }
      function v() {
        (G = !1),
          (H = !0),
          (W = null),
          (Y = !0),
          (j = 3),
          (N = null),
          (J = null),
          (X = -1),
          (q = null);
      }
      function h() {
        return new P.default(function (e, t) {
          wx.getBluetoothAdapterState({
            fail: function (e) {
              t(e);
            },
            success: function (n) {
              return n.available
                ? (wx.onBLEConnectionStateChanged(function (e) {
                    console.log(
                      "device " +
                        e.deviceId +
                        " state has changed, connected: " +
                        e.connected
                    );
                  }),
                  F.debug("ble adapter available"),
                  void e())
                : void t(new V(10001, "not init"));
            },
          });
        });
      }
      function p() {
        return new P.default(function (e, t) {
          e();
        });
      }
      function g() {
        return new P.default(function (e, t) {
          wx.startBluetoothDevicesDiscovery({
            success: function (t) {
              F.debug("ble scan started"), o(), e();
            },
            fail: function (e) {
              t(e);
            },
          });
        });
      }
      function y() {
        return new P.default(function (e, t) {
          wx.getBluetoothAdapterState({
            complete: function (e) {
              F.debug(e);
            },
          }),
            wx.onBluetoothDeviceFound(w),
            e();
        });
      }
      function w(e, t) {
        var n = void 0;
        e.deviceId
          ? (n = e)
          : e.devices
          ? (n = e.devices[0])
          : e[0] && (n = e[0]);
        var r = M.validate(n, M.getSystemInfo());
        if (
          r &&
          r.mac &&
          J &&
          r.mac.toLowerCase() === J.toLowerCase() &&
          5 === r.devType
        )
          return (
            i(),
            M.stopScan(),
            F.debug("found device " + r.mac + (t ? ", from cache" : "")),
            m(r, q),
            !0
          );
      }
      function m(e, t) {
        if (!M.isInit())
          return callback(new M.BizError(1001, "have not initialized!")), !1;
        if (G)
          return (
            F.debug("is connecting devType= " + e.devType),
            callback(new M.BizError(0, "too busy")),
            !1
          );
        G = !0;
        var n = b([e, t]),
          r = n;
        return (
          "ios" === M.getSystemInfo().platform && (r = n.then(I).then(_)),
          r
            .then(S)
            .then(x)
            .then(B)
            .then(C)
            .catch(function (e) {
              return (
                F.error(e),
                1002 === e.errCode
                  ? (i(),
                    M.stopScan(),
                    void (
                      N &&
                      "function" == typeof N &&
                      N(new V(1002, (0, D.default)(e)))
                    ))
                  : (i(),
                    M.stopScan(M.closeAdapter),
                    N &&
                      "function" == typeof N &&
                      N(new V(1005, (0, D.default)(e))),
                    void v())
              );
            }),
          !0
        );
      }
      function b(e) {
        var t = e[0];
        e[1];
        return new P.default(function (n, r) {
          F.debug("start connect " + t.mac),
            wx.createBLEConnection({
              deviceId: t.deviceId,
              success: function (r) {
                F.debug("connect " + t.mac + "successful"),
                  F.debug("delay 300ms"),
                  M.stopScan(),
                  setTimeout(function () {
                    n(e);
                  }, 100);
              },
              fail: function (e) {
                wx.getConnectedBluetoothDevices({
                  success: function (e) {
                    F.debug("connected devices [" + e + "]");
                  },
                }),
                  r(e);
              },
            });
        });
      }
      function I(e) {
        var t = e[0];
        e[1];
        return new P.default(function (n, r) {
          F.debug("start get services for " + t.mac),
            wx.getBLEDeviceServices({
              deviceId: t.deviceId,
              success: function (o) {
                var i = f(o.services);
                i
                  ? (F.debug("get service " + Z + " successful, delay 200ms"),
                    setTimeout(function () {
                      n(e);
                    }, 100))
                  : (c(t), r("target service not found in " + t.mac));
              },
              fail: function (e) {
                r(e);
              },
            });
        });
      }
      function _(e) {
        var t = e[0];
        e[1];
        return new P.default(function (n, r) {
          F.debug("start get characteristic for " + t.mac);
          var o =
            "android" === M.getSystemInfo().platform ? Z.toLowerCase() : Z;
          wx.getBLEDeviceCharacteristics({
            deviceId: t.deviceId,
            serviceId: o,
            success: function (o) {
              var i = l(o.characteristics);
              i
                ? (F.debug("get characteristic " + i.uuid + " successful"),
                  n(e))
                : (c(t), r("target characteristic not found"));
            },
            fail: function (e) {
              r(e);
            },
          });
        });
      }
      function S(e) {
        var t = e[0];
        return new P.default(function (n, r) {
          F.debug("start notify " + t.mac),
            a(
              t.deviceId,
              function () {
                setTimeout(function () {
                  n(e);
                }, 100);
              },
              function () {
                F.error(
                  "start notify fail, current version Wechat not support!"
                ),
                  (H = !1),
                  n(e);
              }
            );
        });
      }
      function x(e) {
        var t = e[0],
          n = e[1];
        return new P.default(function (e, r) {
          var o =
              "android" === M.getSystemInfo().platform ? Z.toLowerCase() : Z,
            i = "android" === M.getSystemInfo().platform ? Q.toLowerCase() : Q;
          T(t, o, i, n, e, r);
        });
      }
      function T(e, t, n, r, o, i) {
        console.log("start to light lift: " + e.mac + "," + r);
        var c = wx.base64ToArrayBuffer(r),
          u = c,
          s = new Uint8Array(c),
          a = new Uint8Array(s.length + 1);
        a.set(s, 0), a.set([X], a.length - 1);
        var f = new Uint8Array(3 + a.length + 1);
        (f[0] = 85), (f[1] = 129), (f[2] = a.length);
        for (var l = 129 ^ a.length, d = 0; d < a.length; d++) l ^= a[d];
        (l ^= 0),
          f.set(a, 3),
          f.set([l], f.length - 1),
          (u = f.buffer),
          wx.writeBLECharacteristicValue({
            deviceId: e.deviceId,
            serviceId: t,
            characteristicId: n,
            value: u,
            success: function (t) {
              F.debug("send auth key successful"), o(e);
            },
            fail: function (e) {
              F.debug(e), i(e);
            },
          });
      }
      function B(e) {
        return new P.default(function (t, n) {
          if (H) {
            var r = null,
              o = 500;
            r = setInterval(function () {
              return W
                ? ((Y = "00" === W.substr(8, 2)), clearInterval(r), void t(e))
                : ((o -= 20),
                  o < 0
                    ? (clearInterval(r), void t(e))
                    : void F.info("waiting for notify value: " + o));
            }, 20);
          } else t(e);
        });
      }
      function C(e) {
        return new P.default(function (t, n) {
          i(),
            setTimeout(function () {
              return Y
                ? (F.debug("lock opened, disconnect ble"),
                  c(e, function () {
                    M.closeAdapter(), t();
                  }),
                  console.log(N),
                  M.applyIfOkay(N),
                  void v())
                : (M.closeAdapter(),
                  void n({ errCode: 1002, errMsg: "password incorrect!" }));
            }, 100);
        });
      }
      function L() {
        var e = "33b97ee58afe15f247f7d6224cebc4a0",
          t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          n = R.utils.hex.toBytes(e),
          r = new R.ModeOfOperation.ecb(t),
          o = r.decrypt(n),
          i = R.utils.utf8.fromBytes(o);
        return i;
      }
      function E(e) {
        var t = L(),
          n = R.utils.utf8.toBytes(t),
          r = new R.ModeOfOperation.ecb(n);
        console.log("base64: " + e);
        var o = wx.base64ToArrayBuffer(e),
          i = r.decrypt(new Uint8Array(o)),
          c = R.utils.utf8.fromBytes(i);
        return k(c);
      }
      function k(e) {
        if (!e || 0 === e.length) return null;
        for (
          var t = e.trim(), n = [], r = 0;
          r < t.length && !(t.charCodeAt(r) < 32);
          r++
        )
          n.push(t.charCodeAt(r));
        var o = z.util.bytesToBase64(n);
        return o;
      }
      var A = n(69),
        D = r(A),
        O = n(74),
        P = r(O),
        F = n(71),
        M = (n(73), n(116)),
        R = n(128),
        z = n(100).Crypto,
        V = M.BizError,
        j = 3,
        N = null,
        U = null,
        K = 5e3,
        G = !1,
        H = !0,
        W = null,
        Y = !0,
        J = null,
        X = -1,
        q = null,
        Z = "00002560-0000-1000-8000-00805F9B34FB",
        Q = "00002561-0000-1000-8000-00805F9B34FB",
        $ = "00002562-0000-1000-8000-00805F9B34FB";
      e.exports = { execute: d };
    },
    function (e, t, n) {
      // aes-js
      /*! MIT License. Copyright 2015-2018 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
      !(function (t) {
        "use strict";
        function n(e) {
          return parseInt(e) === e;
        }
        function r(e) {
          if (!n(e.length)) return !1;
          for (var t = 0; t < e.length; t++)
            if (!n(e[t]) || e[t] < 0 || e[t] > 255) return !1;
          return !0;
        }
        function o(e, t) {
          if (e.buffer && "Uint8Array" === e.name)
            return (
              t && (e = e.slice ? e.slice() : Array.prototype.slice.call(e)), e
            );
          if (Array.isArray(e)) {
            if (!r(e)) throw new Error("Array contains invalid value: " + e);
            return new Uint8Array(e);
          }
          if (n(e.length) && r(e)) return new Uint8Array(e);
          throw new Error("unsupported array-like object");
        }
        function i(e) {
          return new Uint8Array(e);
        }
        function c(e, t, n, r, o) {
          (null == r && null == o) ||
            (e = e.slice ? e.slice(r, o) : Array.prototype.slice.call(e, r, o)),
            t.set(e, n);
        }
        function u(e) {
          for (var t = [], n = 0; n < e.length; n += 4)
            t.push(
              (e[n] << 24) | (e[n + 1] << 16) | (e[n + 2] << 8) | e[n + 3]
            );
          return t;
        }
        function s(e) {
          e = o(e, !0);
          var t = 16 - (e.length % 16),
            n = i(e.length + t);
          c(e, n);
          for (var r = e.length; r < n.length; r++) n[r] = t;
          return n;
        }
        function a(e) {
          if (((e = o(e, !0)), e.length < 16))
            throw new Error("PKCS#7 invalid length");
          var t = e[e.length - 1];
          if (t > 16) throw new Error("PKCS#7 padding byte out of range");
          for (var n = e.length - t, r = 0; r < t; r++)
            if (e[n + r] !== t) throw new Error("PKCS#7 invalid padding byte");
          var u = i(n);
          return c(e, u, 0, 0, n), u;
        }
        var f = (function () {
            function e(e) {
              var t = [],
                n = 0;
              for (e = encodeURI(e); n < e.length; ) {
                var r = e.charCodeAt(n++);
                37 === r
                  ? (t.push(parseInt(e.substr(n, 2), 16)), (n += 2))
                  : t.push(r);
              }
              return o(t);
            }
            function t(e) {
              for (var t = [], n = 0; n < e.length; ) {
                var r = e[n];
                r < 128
                  ? (t.push(String.fromCharCode(r)), n++)
                  : r > 191 && r < 224
                  ? (t.push(
                      String.fromCharCode(((31 & r) << 6) | (63 & e[n + 1]))
                    ),
                    (n += 2))
                  : (t.push(
                      String.fromCharCode(
                        ((15 & r) << 12) |
                          ((63 & e[n + 1]) << 6) |
                          (63 & e[n + 2])
                      )
                    ),
                    (n += 3));
              }
              return t.join("");
            }
            return { toBytes: e, fromBytes: t };
          })(),
          l = (function () {
            function e(e) {
              for (var t = [], n = 0; n < e.length; n += 2)
                t.push(parseInt(e.substr(n, 2), 16));
              return t;
            }
            function t(e) {
              for (var t = [], r = 0; r < e.length; r++) {
                var o = e[r];
                t.push(n[(240 & o) >> 4] + n[15 & o]);
              }
              return t.join("");
            }
            var n = "0123456789abcdef";
            return { toBytes: e, fromBytes: t };
          })(),
          d = { 16: 10, 24: 12, 32: 14 },
          v = [
            1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94,
            188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145,
          ],
          h = [
            99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215,
            171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175,
            156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165,
            229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18,
            128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82,
            59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91,
            106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51,
            133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157,
            56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95,
            151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220,
            34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58,
            10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200,
            55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8,
            186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189,
            139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134,
            193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135,
            233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65,
            153, 45, 15, 176, 84, 187, 22,
          ],
          p = [
            82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215,
            251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196,
            222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11,
            66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162,
            73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212,
            164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185,
            218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188,
            211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202,
            63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79,
            103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172,
            116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110,
            71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190,
            27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120,
            205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89,
            39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122,
            159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200,
            235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38,
            225, 105, 20, 99, 85, 33, 12, 125,
          ],
          g = [
            3328402341, 4168907908, 4000806809, 4135287693, 4294111757,
            3597364157, 3731845041, 2445657428, 1613770832, 33620227,
            3462883241, 1445669757, 3892248089, 3050821474, 1303096294,
            3967186586, 2412431941, 528646813, 2311702848, 4202528135,
            4026202645, 2992200171, 2387036105, 4226871307, 1101901292,
            3017069671, 1604494077, 1169141738, 597466303, 1403299063,
            3832705686, 2613100635, 1974974402, 3791519004, 1033081774,
            1277568618, 1815492186, 2118074177, 4126668546, 2211236943,
            1748251740, 1369810420, 3521504564, 4193382664, 3799085459,
            2883115123, 1647391059, 706024767, 134480908, 2512897874,
            1176707941, 2646852446, 806885416, 932615841, 168101135, 798661301,
            235341577, 605164086, 461406363, 3756188221, 3454790438, 1311188841,
            2142417613, 3933566367, 302582043, 495158174, 1479289972, 874125870,
            907746093, 3698224818, 3025820398, 1537253627, 2756858614,
            1983593293, 3084310113, 2108928974, 1378429307, 3722699582,
            1580150641, 327451799, 2790478837, 3117535592, 0, 3253595436,
            1075847264, 3825007647, 2041688520, 3059440621, 3563743934,
            2378943302, 1740553945, 1916352843, 2487896798, 2555137236,
            2958579944, 2244988746, 3151024235, 3320835882, 1336584933,
            3992714006, 2252555205, 2588757463, 1714631509, 293963156,
            2319795663, 3925473552, 67240454, 4269768577, 2689618160,
            2017213508, 631218106, 1269344483, 2723238387, 1571005438,
            2151694528, 93294474, 1066570413, 563977660, 1882732616, 4059428100,
            1673313503, 2008463041, 2950355573, 1109467491, 537923632,
            3858759450, 4260623118, 3218264685, 2177748300, 403442708,
            638784309, 3287084079, 3193921505, 899127202, 2286175436, 773265209,
            2479146071, 1437050866, 4236148354, 2050833735, 3362022572,
            3126681063, 840505643, 3866325909, 3227541664, 427917720,
            2655997905, 2749160575, 1143087718, 1412049534, 999329963,
            193497219, 2353415882, 3354324521, 1807268051, 672404540,
            2816401017, 3160301282, 369822493, 2916866934, 3688947771,
            1681011286, 1949973070, 336202270, 2454276571, 201721354,
            1210328172, 3093060836, 2680341085, 3184776046, 1135389935,
            3294782118, 965841320, 831886756, 3554993207, 4068047243,
            3588745010, 2345191491, 1849112409, 3664604599, 26054028,
            2983581028, 2622377682, 1235855840, 3630984372, 2891339514,
            4092916743, 3488279077, 3395642799, 4101667470, 1202630377,
            268961816, 1874508501, 4034427016, 1243948399, 1546530418,
            941366308, 1470539505, 1941222599, 2546386513, 3421038627,
            2715671932, 3899946140, 1042226977, 2521517021, 1639824860,
            227249030, 260737669, 3765465232, 2084453954, 1907733956,
            3429263018, 2420656344, 100860677, 4160157185, 470683154,
            3261161891, 1781871967, 2924959737, 1773779408, 394692241,
            2579611992, 974986535, 664706745, 3655459128, 3958962195, 731420851,
            571543859, 3530123707, 2849626480, 126783113, 865375399, 765172662,
            1008606754, 361203602, 3387549984, 2278477385, 2857719295,
            1344809080, 2782912378, 59542671, 1503764984, 160008576, 437062935,
            1707065306, 3622233649, 2218934982, 3496503480, 2185314755,
            697932208, 1512910199, 504303377, 2075177163, 2824099068,
            1841019862, 739644986,
          ],
          y = [
            2781242211, 2230877308, 2582542199, 2381740923, 234877682,
            3184946027, 2984144751, 1418839493, 1348481072, 50462977,
            2848876391, 2102799147, 434634494, 1656084439, 3863849899,
            2599188086, 1167051466, 2636087938, 1082771913, 2281340285,
            368048890, 3954334041, 3381544775, 201060592, 3963727277,
            1739838676, 4250903202, 3930435503, 3206782108, 4149453988,
            2531553906, 1536934080, 3262494647, 484572669, 2923271059,
            1783375398, 1517041206, 1098792767, 49674231, 1334037708,
            1550332980, 4098991525, 886171109, 150598129, 2481090929,
            1940642008, 1398944049, 1059722517, 201851908, 1385547719,
            1699095331, 1587397571, 674240536, 2704774806, 252314885,
            3039795866, 151914247, 908333586, 2602270848, 1038082786, 651029483,
            1766729511, 3447698098, 2682942837, 454166793, 2652734339,
            1951935532, 775166490, 758520603, 3000790638, 4004797018,
            4217086112, 4137964114, 1299594043, 1639438038, 3464344499,
            2068982057, 1054729187, 1901997871, 2534638724, 4121318227,
            1757008337, 0, 750906861, 1614815264, 535035132, 3363418545,
            3988151131, 3201591914, 1183697867, 3647454910, 1265776953,
            3734260298, 3566750796, 3903871064, 1250283471, 1807470800,
            717615087, 3847203498, 384695291, 3313910595, 3617213773,
            1432761139, 2484176261, 3481945413, 283769337, 100925954,
            2180939647, 4037038160, 1148730428, 3123027871, 3813386408,
            4087501137, 4267549603, 3229630528, 2315620239, 2906624658,
            3156319645, 1215313976, 82966005, 3747855548, 3245848246,
            1974459098, 1665278241, 807407632, 451280895, 251524083, 1841287890,
            1283575245, 337120268, 891687699, 801369324, 3787349855, 2721421207,
            3431482436, 959321879, 1469301956, 4065699751, 2197585534,
            1199193405, 2898814052, 3887750493, 724703513, 2514908019,
            2696962144, 2551808385, 3516813135, 2141445340, 1715741218,
            2119445034, 2872807568, 2198571144, 3398190662, 700968686,
            3547052216, 1009259540, 2041044702, 3803995742, 487983883,
            1991105499, 1004265696, 1449407026, 1316239930, 504629770,
            3683797321, 168560134, 1816667172, 3837287516, 1570751170,
            1857934291, 4014189740, 2797888098, 2822345105, 2754712981,
            936633572, 2347923833, 852879335, 1133234376, 1500395319,
            3084545389, 2348912013, 1689376213, 3533459022, 3762923945,
            3034082412, 4205598294, 133428468, 634383082, 2949277029,
            2398386810, 3913789102, 403703816, 3580869306, 2297460856,
            1867130149, 1918643758, 607656988, 4049053350, 3346248884,
            1368901318, 600565992, 2090982877, 2632479860, 557719327,
            3717614411, 3697393085, 2249034635, 2232388234, 2430627952,
            1115438654, 3295786421, 2865522278, 3633334344, 84280067, 33027830,
            303828494, 2747425121, 1600795957, 4188952407, 3496589753,
            2434238086, 1486471617, 658119965, 3106381470, 953803233, 334231800,
            3005978776, 857870609, 3151128937, 1890179545, 2298973838,
            2805175444, 3056442267, 574365214, 2450884487, 550103529,
            1233637070, 4289353045, 2018519080, 2057691103, 2399374476,
            4166623649, 2148108681, 387583245, 3664101311, 836232934,
            3330556482, 3100665960, 3280093505, 2955516313, 2002398509,
            287182607, 3413881008, 4238890068, 3597515707, 975967766,
          ],
          w = [
            1671808611, 2089089148, 2006576759, 2072901243, 4061003762,
            1807603307, 1873927791, 3310653893, 810573872, 16974337, 1739181671,
            729634347, 4263110654, 3613570519, 2883997099, 1989864566,
            3393556426, 2191335298, 3376449993, 2106063485, 4195741690,
            1508618841, 1204391495, 4027317232, 2917941677, 3563566036,
            2734514082, 2951366063, 2629772188, 2767672228, 1922491506,
            3227229120, 3082974647, 4246528509, 2477669779, 644500518,
            911895606, 1061256767, 4144166391, 3427763148, 878471220,
            2784252325, 3845444069, 4043897329, 1905517169, 3631459288,
            827548209, 356461077, 67897348, 3344078279, 593839651, 3277757891,
            405286936, 2527147926, 84871685, 2595565466, 118033927, 305538066,
            2157648768, 3795705826, 3945188843, 661212711, 2999812018,
            1973414517, 152769033, 2208177539, 745822252, 439235610, 455947803,
            1857215598, 1525593178, 2700827552, 1391895634, 994932283,
            3596728278, 3016654259, 695947817, 3812548067, 795958831,
            2224493444, 1408607827, 3513301457, 0, 3979133421, 543178784,
            4229948412, 2982705585, 1542305371, 1790891114, 3410398667,
            3201918910, 961245753, 1256100938, 1289001036, 1491644504,
            3477767631, 3496721360, 4012557807, 2867154858, 4212583931,
            1137018435, 1305975373, 861234739, 2241073541, 1171229253,
            4178635257, 33948674, 2139225727, 1357946960, 1011120188,
            2679776671, 2833468328, 1374921297, 2751356323, 1086357568,
            2408187279, 2460827538, 2646352285, 944271416, 4110742005,
            3168756668, 3066132406, 3665145818, 560153121, 271589392,
            4279952895, 4077846003, 3530407890, 3444343245, 202643468,
            322250259, 3962553324, 1608629855, 2543990167, 1154254916,
            389623319, 3294073796, 2817676711, 2122513534, 1028094525,
            1689045092, 1575467613, 422261273, 1939203699, 1621147744,
            2174228865, 1339137615, 3699352540, 577127458, 712922154,
            2427141008, 2290289544, 1187679302, 3995715566, 3100863416,
            339486740, 3732514782, 1591917662, 186455563, 3681988059,
            3762019296, 844522546, 978220090, 169743370, 1239126601, 101321734,
            611076132, 1558493276, 3260915650, 3547250131, 2901361580,
            1655096418, 2443721105, 2510565781, 3828863972, 2039214713,
            3878868455, 3359869896, 928607799, 1840765549, 2374762893,
            3580146133, 1322425422, 2850048425, 1823791212, 1459268694,
            4094161908, 3928346602, 1706019429, 2056189050, 2934523822,
            135794696, 3134549946, 2022240376, 628050469, 779246638, 472135708,
            2800834470, 3032970164, 3327236038, 3894660072, 3715932637,
            1956440180, 522272287, 1272813131, 3185336765, 2340818315,
            2323976074, 1888542832, 1044544574, 3049550261, 1722469478,
            1222152264, 50660867, 4127324150, 236067854, 1638122081, 895445557,
            1475980887, 3117443513, 2257655686, 3243809217, 489110045,
            2662934430, 3778599393, 4162055160, 2561878936, 288563729,
            1773916777, 3648039385, 2391345038, 2493985684, 2612407707,
            505560094, 2274497927, 3911240169, 3460925390, 1442818645,
            678973480, 3749357023, 2358182796, 2717407649, 2306869641,
            219617805, 3218761151, 3862026214, 1120306242, 1756942440,
            1103331905, 2578459033, 762796589, 252780047, 2966125488,
            1425844308, 3151392187, 372911126,
          ],
          m = [
            1667474886, 2088535288, 2004326894, 2071694838, 4075949567,
            1802223062, 1869591006, 3318043793, 808472672, 16843522, 1734846926,
            724270422, 4278065639, 3621216949, 2880169549, 1987484396,
            3402253711, 2189597983, 3385409673, 2105378810, 4210693615,
            1499065266, 1195886990, 4042263547, 2913856577, 3570689971,
            2728590687, 2947541573, 2627518243, 2762274643, 1920112356,
            3233831835, 3082273397, 4261223649, 2475929149, 640051788,
            909531756, 1061110142, 4160160501, 3435941763, 875846760,
            2779116625, 3857003729, 4059105529, 1903268834, 3638064043,
            825316194, 353713962, 67374088, 3351728789, 589522246, 3284360861,
            404236336, 2526454071, 84217610, 2593830191, 117901582, 303183396,
            2155911963, 3806477791, 3958056653, 656894286, 2998062463,
            1970642922, 151591698, 2206440989, 741110872, 437923380, 454765878,
            1852748508, 1515908788, 2694904667, 1381168804, 993742198,
            3604373943, 3014905469, 690584402, 3823320797, 791638366,
            2223281939, 1398011302, 3520161977, 0, 3991743681, 538992704,
            4244381667, 2981218425, 1532751286, 1785380564, 3419096717,
            3200178535, 960056178, 1246420628, 1280103576, 1482221744,
            3486468741, 3503319995, 4025428677, 2863326543, 4227536621,
            1128514950, 1296947098, 859002214, 2240123921, 1162203018,
            4193849577, 33687044, 2139062782, 1347481760, 1010582648,
            2678045221, 2829640523, 1364325282, 2745433693, 1077985408,
            2408548869, 2459086143, 2644360225, 943212656, 4126475505,
            3166494563, 3065430391, 3671750063, 555836226, 269496352,
            4294908645, 4092792573, 3537006015, 3452783745, 202118168,
            320025894, 3974901699, 1600119230, 2543297077, 1145359496,
            387397934, 3301201811, 2812801621, 2122220284, 1027426170,
            1684319432, 1566435258, 421079858, 1936954854, 1616945344,
            2172753945, 1330631070, 3705438115, 572679748, 707427924,
            2425400123, 2290647819, 1179044492, 4008585671, 3099120491,
            336870440, 3739122087, 1583276732, 185277718, 3688593069,
            3772791771, 842159716, 976899700, 168435220, 1229577106, 101059084,
            606366792, 1549591736, 3267517855, 3553849021, 2897014595,
            1650632388, 2442242105, 2509612081, 3840161747, 2038008818,
            3890688725, 3368567691, 926374254, 1835907034, 2374863873,
            3587531953, 1313788572, 2846482505, 1819063512, 1448540844,
            4109633523, 3941213647, 1701162954, 2054852340, 2930698567,
            134748176, 3132806511, 2021165296, 623210314, 774795868, 471606328,
            2795958615, 3031746419, 3334885783, 3907527627, 3722280097,
            1953799400, 522133822, 1263263126, 3183336545, 2341176845,
            2324333839, 1886425312, 1044267644, 3048588401, 1718004428,
            1212733584, 50529542, 4143317495, 235803164, 1633788866, 892690282,
            1465383342, 3115962473, 2256965911, 3250673817, 488449850,
            2661202215, 3789633753, 4177007595, 2560144171, 286339874,
            1768537042, 3654906025, 2391705863, 2492770099, 2610673197,
            505291324, 2273808917, 3924369609, 3469625735, 1431699370,
            673740880, 3755965093, 2358021891, 2711746649, 2307489801,
            218961690, 3217021541, 3873845719, 1111672452, 1751693520,
            1094828930, 2576986153, 757954394, 252645662, 2964376443,
            1414855848, 3149649517, 370555436,
          ],
          b = [
            1374988112, 2118214995, 437757123, 975658646, 1001089995, 530400753,
            2902087851, 1273168787, 540080725, 2910219766, 2295101073,
            4110568485, 1340463100, 3307916247, 641025152, 3043140495,
            3736164937, 632953703, 1172967064, 1576976609, 3274667266,
            2169303058, 2370213795, 1809054150, 59727847, 361929877, 3211623147,
            2505202138, 3569255213, 1484005843, 1239443753, 2395588676,
            1975683434, 4102977912, 2572697195, 666464733, 3202437046,
            4035489047, 3374361702, 2110667444, 1675577880, 3843699074,
            2538681184, 1649639237, 2976151520, 3144396420, 4269907996,
            4178062228, 1883793496, 2403728665, 2497604743, 1383856311,
            2876494627, 1917518562, 3810496343, 1716890410, 3001755655,
            800440835, 2261089178, 3543599269, 807962610, 599762354, 33778362,
            3977675356, 2328828971, 2809771154, 4077384432, 1315562145,
            1708848333, 101039829, 3509871135, 3299278474, 875451293,
            2733856160, 92987698, 2767645557, 193195065, 1080094634, 1584504582,
            3178106961, 1042385657, 2531067453, 3711829422, 1306967366,
            2438237621, 1908694277, 67556463, 1615861247, 429456164, 3602770327,
            2302690252, 1742315127, 2968011453, 126454664, 3877198648,
            2043211483, 2709260871, 2084704233, 4169408201, 0, 159417987,
            841739592, 504459436, 1817866830, 4245618683, 260388950, 1034867998,
            908933415, 168810852, 1750902305, 2606453969, 607530554, 202008497,
            2472011535, 3035535058, 463180190, 2160117071, 1641816226,
            1517767529, 470948374, 3801332234, 3231722213, 1008918595,
            303765277, 235474187, 4069246893, 766945465, 337553864, 1475418501,
            2943682380, 4003061179, 2743034109, 4144047775, 1551037884,
            1147550661, 1543208500, 2336434550, 3408119516, 3069049960,
            3102011747, 3610369226, 1113818384, 328671808, 2227573024,
            2236228733, 3535486456, 2935566865, 3341394285, 496906059,
            3702665459, 226906860, 2009195472, 733156972, 2842737049, 294930682,
            1206477858, 2835123396, 2700099354, 1451044056, 573804783,
            2269728455, 3644379585, 2362090238, 2564033334, 2801107407,
            2776292904, 3669462566, 1068351396, 742039012, 1350078989,
            1784663195, 1417561698, 4136440770, 2430122216, 775550814,
            2193862645, 2673705150, 1775276924, 1876241833, 3475313331,
            3366754619, 270040487, 3902563182, 3678124923, 3441850377,
            1851332852, 3969562369, 2203032232, 3868552805, 2868897406,
            566021896, 4011190502, 3135740889, 1248802510, 3936291284,
            699432150, 832877231, 708780849, 3332740144, 899835584, 1951317047,
            4236429990, 3767586992, 866637845, 4043610186, 1106041591,
            2144161806, 395441711, 1984812685, 1139781709, 3433712980,
            3835036895, 2664543715, 1282050075, 3240894392, 1181045119,
            2640243204, 25965917, 4203181171, 4211818798, 3009879386,
            2463879762, 3910161971, 1842759443, 2597806476, 933301370,
            1509430414, 3943906441, 3467192302, 3076639029, 3776767469,
            2051518780, 2631065433, 1441952575, 404016761, 1942435775,
            1408749034, 1610459739, 3745345300, 2017778566, 3400528769,
            3110650942, 941896748, 3265478751, 371049330, 3168937228, 675039627,
            4279080257, 967311729, 135050206, 3635733660, 1683407248,
            2076935265, 3576870512, 1215061108, 3501741890,
          ],
          I = [
            1347548327, 1400783205, 3273267108, 2520393566, 3409685355,
            4045380933, 2880240216, 2471224067, 1428173050, 4138563181,
            2441661558, 636813900, 4233094615, 3620022987, 2149987652,
            2411029155, 1239331162, 1730525723, 2554718734, 3781033664,
            46346101, 310463728, 2743944855, 3328955385, 3875770207, 2501218972,
            3955191162, 3667219033, 768917123, 3545789473, 692707433,
            1150208456, 1786102409, 2029293177, 1805211710, 3710368113,
            3065962831, 401639597, 1724457132, 3028143674, 409198410,
            2196052529, 1620529459, 1164071807, 3769721975, 2226875310,
            486441376, 2499348523, 1483753576, 428819965, 2274680428,
            3075636216, 598438867, 3799141122, 1474502543, 711349675, 129166120,
            53458370, 2592523643, 2782082824, 4063242375, 2988687269,
            3120694122, 1559041666, 730517276, 2460449204, 4042459122,
            2706270690, 3446004468, 3573941694, 533804130, 2328143614,
            2637442643, 2695033685, 839224033, 1973745387, 957055980,
            2856345839, 106852767, 1371368976, 4181598602, 1033297158,
            2933734917, 1179510461, 3046200461, 91341917, 1862534868,
            4284502037, 605657339, 2547432937, 3431546947, 2003294622,
            3182487618, 2282195339, 954669403, 3682191598, 1201765386,
            3917234703, 3388507166, 0, 2198438022, 1211247597, 2887651696,
            1315723890, 4227665663, 1443857720, 507358933, 657861945,
            1678381017, 560487590, 3516619604, 975451694, 2970356327, 261314535,
            3535072918, 2652609425, 1333838021, 2724322336, 1767536459,
            370938394, 182621114, 3854606378, 1128014560, 487725847, 185469197,
            2918353863, 3106780840, 3356761769, 2237133081, 1286567175,
            3152976349, 4255350624, 2683765030, 3160175349, 3309594171,
            878443390, 1988838185, 3704300486, 1756818940, 1673061617,
            3403100636, 272786309, 1075025698, 545572369, 2105887268,
            4174560061, 296679730, 1841768865, 1260232239, 4091327024,
            3960309330, 3497509347, 1814803222, 2578018489, 4195456072,
            575138148, 3299409036, 446754879, 3629546796, 4011996048,
            3347532110, 3252238545, 4270639778, 915985419, 3483825537,
            681933534, 651868046, 2755636671, 3828103837, 223377554, 2607439820,
            1649704518, 3270937875, 3901806776, 1580087799, 4118987695,
            3198115200, 2087309459, 2842678573, 3016697106, 1003007129,
            2802849917, 1860738147, 2077965243, 164439672, 4100872472, 32283319,
            2827177882, 1709610350, 2125135846, 136428751, 3874428392,
            3652904859, 3460984630, 3572145929, 3593056380, 2939266226,
            824852259, 818324884, 3224740454, 930369212, 2801566410, 2967507152,
            355706840, 1257309336, 4148292826, 243256656, 790073846, 2373340630,
            1296297904, 1422699085, 3756299780, 3818836405, 457992840,
            3099667487, 2135319889, 77422314, 1560382517, 1945798516, 788204353,
            1521706781, 1385356242, 870912086, 325965383, 2358957921,
            2050466060, 2388260884, 2313884476, 4006521127, 901210569,
            3990953189, 1014646705, 1503449823, 1062597235, 2031621326,
            3212035895, 3931371469, 1533017514, 350174575, 2256028891,
            2177544179, 1052338372, 741876788, 1606591296, 1914052035,
            213705253, 2334669897, 1107234197, 1899603969, 3725069491,
            2631447780, 2422494913, 1635502980, 1893020342, 1950903388,
            1120974935,
          ],
          _ = [
            2807058932, 1699970625, 2764249623, 1586903591, 1808481195,
            1173430173, 1487645946, 59984867, 4199882800, 1844882806,
            1989249228, 1277555970, 3623636965, 3419915562, 1149249077,
            2744104290, 1514790577, 459744698, 244860394, 3235995134,
            1963115311, 4027744588, 2544078150, 4190530515, 1608975247,
            2627016082, 2062270317, 1507497298, 2200818878, 567498868,
            1764313568, 3359936201, 2305455554, 2037970062, 1047239e3,
            1910319033, 1337376481, 2904027272, 2892417312, 984907214,
            1243112415, 830661914, 861968209, 2135253587, 2011214180,
            2927934315, 2686254721, 731183368, 1750626376, 4246310725,
            1820824798, 4172763771, 3542330227, 48394827, 2404901663,
            2871682645, 671593195, 3254988725, 2073724613, 145085239,
            2280796200, 2779915199, 1790575107, 2187128086, 472615631,
            3029510009, 4075877127, 3802222185, 4107101658, 3201631749,
            1646252340, 4270507174, 1402811438, 1436590835, 3778151818,
            3950355702, 3963161475, 4020912224, 2667994737, 273792366,
            2331590177, 104699613, 95345982, 3175501286, 2377486676, 1560637892,
            3564045318, 369057872, 4213447064, 3919042237, 1137477952,
            2658625497, 1119727848, 2340947849, 1530455833, 4007360968,
            172466556, 266959938, 516552836, 0, 2256734592, 3980931627,
            1890328081, 1917742170, 4294704398, 945164165, 3575528878,
            958871085, 3647212047, 2787207260, 1423022939, 775562294,
            1739656202, 3876557655, 2530391278, 2443058075, 3310321856,
            547512796, 1265195639, 437656594, 3121275539, 719700128, 3762502690,
            387781147, 218828297, 3350065803, 2830708150, 2848461854, 428169201,
            122466165, 3720081049, 1627235199, 648017665, 4122762354,
            1002783846, 2117360635, 695634755, 3336358691, 4234721005,
            4049844452, 3704280881, 2232435299, 574624663, 287343814, 612205898,
            1039717051, 840019705, 2708326185, 793451934, 821288114, 1391201670,
            3822090177, 376187827, 3113855344, 1224348052, 1679968233,
            2361698556, 1058709744, 752375421, 2431590963, 1321699145,
            3519142200, 2734591178, 188127444, 2177869557, 3727205754,
            2384911031, 3215212461, 2648976442, 2450346104, 3432737375,
            1180849278, 331544205, 3102249176, 4150144569, 2952102595,
            2159976285, 2474404304, 766078933, 313773861, 2570832044,
            2108100632, 1668212892, 3145456443, 2013908262, 418672217,
            3070356634, 2594734927, 1852171925, 3867060991, 3473416636,
            3907448597, 2614737639, 919489135, 164948639, 2094410160,
            2997825956, 590424639, 2486224549, 1723872674, 3157750862,
            3399941250, 3501252752, 3625268135, 2555048196, 3673637356,
            1343127501, 4130281361, 3599595085, 2957853679, 1297403050,
            81781910, 3051593425, 2283490410, 532201772, 1367295589, 3926170974,
            895287692, 1953757831, 1093597963, 492483431, 3528626907,
            1446242576, 1192455638, 1636604631, 209336225, 344873464,
            1015671571, 669961897, 3375740769, 3857572124, 2973530695,
            3747192018, 1933530610, 3464042516, 935293895, 3454686199,
            2858115069, 1863638845, 3683022916, 4085369519, 3292445032,
            875313188, 1080017571, 3279033885, 621591778, 1233856572,
            2504130317, 24197544, 3017672716, 3835484340, 3247465558,
            2220981195, 3060847922, 1551124588, 1463996600,
          ],
          S = [
            4104605777, 1097159550, 396673818, 660510266, 2875968315,
            2638606623, 4200115116, 3808662347, 821712160, 1986918061,
            3430322568, 38544885, 3856137295, 718002117, 893681702, 1654886325,
            2975484382, 3122358053, 3926825029, 4274053469, 796197571,
            1290801793, 1184342925, 3556361835, 2405426947, 2459735317,
            1836772287, 1381620373, 3196267988, 1948373848, 3764988233,
            3385345166, 3263785589, 2390325492, 1480485785, 3111247143,
            3780097726, 2293045232, 548169417, 3459953789, 3746175075,
            439452389, 1362321559, 1400849762, 1685577905, 1806599355,
            2174754046, 137073913, 1214797936, 1174215055, 3731654548,
            2079897426, 1943217067, 1258480242, 529487843, 1437280870,
            3945269170, 3049390895, 3313212038, 923313619, 679998e3, 3215307299,
            57326082, 377642221, 3474729866, 2041877159, 133361907, 1776460110,
            3673476453, 96392454, 878845905, 2801699524, 777231668, 4082475170,
            2330014213, 4142626212, 2213296395, 1626319424, 1906247262,
            1846563261, 562755902, 3708173718, 1040559837, 3871163981,
            1418573201, 3294430577, 114585348, 1343618912, 2566595609,
            3186202582, 1078185097, 3651041127, 3896688048, 2307622919,
            425408743, 3371096953, 2081048481, 1108339068, 2216610296, 0,
            2156299017, 736970802, 292596766, 1517440620, 251657213, 2235061775,
            2933202493, 758720310, 265905162, 1554391400, 1532285339, 908999204,
            174567692, 1474760595, 4002861748, 2610011675, 3234156416,
            3693126241, 2001430874, 303699484, 2478443234, 2687165888,
            585122620, 454499602, 151849742, 2345119218, 3064510765, 514443284,
            4044981591, 1963412655, 2581445614, 2137062819, 19308535,
            1928707164, 1715193156, 4219352155, 1126790795, 600235211,
            3992742070, 3841024952, 836553431, 1669664834, 2535604243,
            3323011204, 1243905413, 3141400786, 4180808110, 698445255,
            2653899549, 2989552604, 2253581325, 3252932727, 3004591147,
            1891211689, 2487810577, 3915653703, 4237083816, 4030667424,
            2100090966, 865136418, 1229899655, 953270745, 3399679628,
            3557504664, 4118925222, 2061379749, 3079546586, 2915017791,
            983426092, 2022837584, 1607244650, 2118541908, 2366882550,
            3635996816, 972512814, 3283088770, 1568718495, 3499326569,
            3576539503, 621982671, 2895723464, 410887952, 2623762152,
            1002142683, 645401037, 1494807662, 2595684844, 1335535747,
            2507040230, 4293295786, 3167684641, 367585007, 3885750714,
            1865862730, 2668221674, 2960971305, 2763173681, 1059270954,
            2777952454, 2724642869, 1320957812, 2194319100, 2429595872,
            2815956275, 77089521, 3973773121, 3444575871, 2448830231,
            1305906550, 4021308739, 2857194700, 2516901860, 3518358430,
            1787304780, 740276417, 1699839814, 1592394909, 2352307457,
            2272556026, 188821243, 1729977011, 3687994002, 274084841,
            3594982253, 3613494426, 2701949495, 4162096729, 322734571,
            2837966542, 1640576439, 484830689, 1202797690, 3537852828,
            4067639125, 349075736, 3342319475, 4157467219, 4255800159,
            1030690015, 1155237496, 2951971274, 1757691577, 607398968,
            2738905026, 499347990, 3794078908, 1011452712, 227885567,
            2818666809, 213114376, 3034881240, 1455525988, 3414450555,
            850817237, 1817998408, 3092726480,
          ],
          x = [
            0, 235474187, 470948374, 303765277, 941896748, 908933415, 607530554,
            708780849, 1883793496, 2118214995, 1817866830, 1649639237,
            1215061108, 1181045119, 1417561698, 1517767529, 3767586992,
            4003061179, 4236429990, 4069246893, 3635733660, 3602770327,
            3299278474, 3400528769, 2430122216, 2664543715, 2362090238,
            2193862645, 2835123396, 2801107407, 3035535058, 3135740889,
            3678124923, 3576870512, 3341394285, 3374361702, 3810496343,
            3977675356, 4279080257, 4043610186, 2876494627, 2776292904,
            3076639029, 3110650942, 2472011535, 2640243204, 2403728665,
            2169303058, 1001089995, 899835584, 666464733, 699432150, 59727847,
            226906860, 530400753, 294930682, 1273168787, 1172967064, 1475418501,
            1509430414, 1942435775, 2110667444, 1876241833, 1641816226,
            2910219766, 2743034109, 2976151520, 3211623147, 2505202138,
            2606453969, 2302690252, 2269728455, 3711829422, 3543599269,
            3240894392, 3475313331, 3843699074, 3943906441, 4178062228,
            4144047775, 1306967366, 1139781709, 1374988112, 1610459739,
            1975683434, 2076935265, 1775276924, 1742315127, 1034867998,
            866637845, 566021896, 800440835, 92987698, 193195065, 429456164,
            395441711, 1984812685, 2017778566, 1784663195, 1683407248,
            1315562145, 1080094634, 1383856311, 1551037884, 101039829,
            135050206, 437757123, 337553864, 1042385657, 807962610, 573804783,
            742039012, 2531067453, 2564033334, 2328828971, 2227573024,
            2935566865, 2700099354, 3001755655, 3168937228, 3868552805,
            3902563182, 4203181171, 4102977912, 3736164937, 3501741890,
            3265478751, 3433712980, 1106041591, 1340463100, 1576976609,
            1408749034, 2043211483, 2009195472, 1708848333, 1809054150,
            832877231, 1068351396, 766945465, 599762354, 159417987, 126454664,
            361929877, 463180190, 2709260871, 2943682380, 3178106961,
            3009879386, 2572697195, 2538681184, 2236228733, 2336434550,
            3509871135, 3745345300, 3441850377, 3274667266, 3910161971,
            3877198648, 4110568485, 4211818798, 2597806476, 2497604743,
            2261089178, 2295101073, 2733856160, 2902087851, 3202437046,
            2968011453, 3936291284, 3835036895, 4136440770, 4169408201,
            3535486456, 3702665459, 3467192302, 3231722213, 2051518780,
            1951317047, 1716890410, 1750902305, 1113818384, 1282050075,
            1584504582, 1350078989, 168810852, 67556463, 371049330, 404016761,
            841739592, 1008918595, 775550814, 540080725, 3969562369, 3801332234,
            4035489047, 4269907996, 3569255213, 3669462566, 3366754619,
            3332740144, 2631065433, 2463879762, 2160117071, 2395588676,
            2767645557, 2868897406, 3102011747, 3069049960, 202008497, 33778362,
            270040487, 504459436, 875451293, 975658646, 675039627, 641025152,
            2084704233, 1917518562, 1615861247, 1851332852, 1147550661,
            1248802510, 1484005843, 1451044056, 933301370, 967311729, 733156972,
            632953703, 260388950, 25965917, 328671808, 496906059, 1206477858,
            1239443753, 1543208500, 1441952575, 2144161806, 1908694277,
            1675577880, 1842759443, 3610369226, 3644379585, 3408119516,
            3307916247, 4011190502, 3776767469, 4077384432, 4245618683,
            2809771154, 2842737049, 3144396420, 3043140495, 2673705150,
            2438237621, 2203032232, 2370213795,
          ],
          T = [
            0, 185469197, 370938394, 487725847, 741876788, 657861945, 975451694,
            824852259, 1483753576, 1400783205, 1315723890, 1164071807,
            1950903388, 2135319889, 1649704518, 1767536459, 2967507152,
            3152976349, 2801566410, 2918353863, 2631447780, 2547432937,
            2328143614, 2177544179, 3901806776, 3818836405, 4270639778,
            4118987695, 3299409036, 3483825537, 3535072918, 3652904859,
            2077965243, 1893020342, 1841768865, 1724457132, 1474502543,
            1559041666, 1107234197, 1257309336, 598438867, 681933534, 901210569,
            1052338372, 261314535, 77422314, 428819965, 310463728, 3409685355,
            3224740454, 3710368113, 3593056380, 3875770207, 3960309330,
            4045380933, 4195456072, 2471224067, 2554718734, 2237133081,
            2388260884, 3212035895, 3028143674, 2842678573, 2724322336,
            4138563181, 4255350624, 3769721975, 3955191162, 3667219033,
            3516619604, 3431546947, 3347532110, 2933734917, 2782082824,
            3099667487, 3016697106, 2196052529, 2313884476, 2499348523,
            2683765030, 1179510461, 1296297904, 1347548327, 1533017514,
            1786102409, 1635502980, 2087309459, 2003294622, 507358933,
            355706840, 136428751, 53458370, 839224033, 957055980, 605657339,
            790073846, 2373340630, 2256028891, 2607439820, 2422494913,
            2706270690, 2856345839, 3075636216, 3160175349, 3573941694,
            3725069491, 3273267108, 3356761769, 4181598602, 4063242375,
            4011996048, 3828103837, 1033297158, 915985419, 730517276, 545572369,
            296679730, 446754879, 129166120, 213705253, 1709610350, 1860738147,
            1945798516, 2029293177, 1239331162, 1120974935, 1606591296,
            1422699085, 4148292826, 4233094615, 3781033664, 3931371469,
            3682191598, 3497509347, 3446004468, 3328955385, 2939266226,
            2755636671, 3106780840, 2988687269, 2198438022, 2282195339,
            2501218972, 2652609425, 1201765386, 1286567175, 1371368976,
            1521706781, 1805211710, 1620529459, 2105887268, 1988838185,
            533804130, 350174575, 164439672, 46346101, 870912086, 954669403,
            636813900, 788204353, 2358957921, 2274680428, 2592523643,
            2441661558, 2695033685, 2880240216, 3065962831, 3182487618,
            3572145929, 3756299780, 3270937875, 3388507166, 4174560061,
            4091327024, 4006521127, 3854606378, 1014646705, 930369212,
            711349675, 560487590, 272786309, 457992840, 106852767, 223377554,
            1678381017, 1862534868, 1914052035, 2031621326, 1211247597,
            1128014560, 1580087799, 1428173050, 32283319, 182621114, 401639597,
            486441376, 768917123, 651868046, 1003007129, 818324884, 1503449823,
            1385356242, 1333838021, 1150208456, 1973745387, 2125135846,
            1673061617, 1756818940, 2970356327, 3120694122, 2802849917,
            2887651696, 2637442643, 2520393566, 2334669897, 2149987652,
            3917234703, 3799141122, 4284502037, 4100872472, 3309594171,
            3460984630, 3545789473, 3629546796, 2050466060, 1899603969,
            1814803222, 1730525723, 1443857720, 1560382517, 1075025698,
            1260232239, 575138148, 692707433, 878443390, 1062597235, 243256656,
            91341917, 409198410, 325965383, 3403100636, 3252238545, 3704300486,
            3620022987, 3874428392, 3990953189, 4042459122, 4227665663,
            2460449204, 2578018489, 2226875310, 2411029155, 3198115200,
            3046200461, 2827177882, 2743944855,
          ],
          B = [
            0, 218828297, 437656594, 387781147, 875313188, 958871085, 775562294,
            590424639, 1750626376, 1699970625, 1917742170, 2135253587,
            1551124588, 1367295589, 1180849278, 1265195639, 3501252752,
            3720081049, 3399941250, 3350065803, 3835484340, 3919042237,
            4270507174, 4085369519, 3102249176, 3051593425, 2734591178,
            2952102595, 2361698556, 2177869557, 2530391278, 2614737639,
            3145456443, 3060847922, 2708326185, 2892417312, 2404901663,
            2187128086, 2504130317, 2555048196, 3542330227, 3727205754,
            3375740769, 3292445032, 3876557655, 3926170974, 4246310725,
            4027744588, 1808481195, 1723872674, 1910319033, 2094410160,
            1608975247, 1391201670, 1173430173, 1224348052, 59984867, 244860394,
            428169201, 344873464, 935293895, 984907214, 766078933, 547512796,
            1844882806, 1627235199, 2011214180, 2062270317, 1507497298,
            1423022939, 1137477952, 1321699145, 95345982, 145085239, 532201772,
            313773861, 830661914, 1015671571, 731183368, 648017665, 3175501286,
            2957853679, 2807058932, 2858115069, 2305455554, 2220981195,
            2474404304, 2658625497, 3575528878, 3625268135, 3473416636,
            3254988725, 3778151818, 3963161475, 4213447064, 4130281361,
            3599595085, 3683022916, 3432737375, 3247465558, 3802222185,
            4020912224, 4172763771, 4122762354, 3201631749, 3017672716,
            2764249623, 2848461854, 2331590177, 2280796200, 2431590963,
            2648976442, 104699613, 188127444, 472615631, 287343814, 840019705,
            1058709744, 671593195, 621591778, 1852171925, 1668212892,
            1953757831, 2037970062, 1514790577, 1463996600, 1080017571,
            1297403050, 3673637356, 3623636965, 3235995134, 3454686199,
            4007360968, 3822090177, 4107101658, 4190530515, 2997825956,
            3215212461, 2830708150, 2779915199, 2256734592, 2340947849,
            2627016082, 2443058075, 172466556, 122466165, 273792366, 492483431,
            1047239e3, 861968209, 612205898, 695634755, 1646252340, 1863638845,
            2013908262, 1963115311, 1446242576, 1530455833, 1277555970,
            1093597963, 1636604631, 1820824798, 2073724613, 1989249228,
            1436590835, 1487645946, 1337376481, 1119727848, 164948639, 81781910,
            331544205, 516552836, 1039717051, 821288114, 669961897, 719700128,
            2973530695, 3157750862, 2871682645, 2787207260, 2232435299,
            2283490410, 2667994737, 2450346104, 3647212047, 3564045318,
            3279033885, 3464042516, 3980931627, 3762502690, 4150144569,
            4199882800, 3070356634, 3121275539, 2904027272, 2686254721,
            2200818878, 2384911031, 2570832044, 2486224549, 3747192018,
            3528626907, 3310321856, 3359936201, 3950355702, 3867060991,
            4049844452, 4234721005, 1739656202, 1790575107, 2108100632,
            1890328081, 1402811438, 1586903591, 1233856572, 1149249077,
            266959938, 48394827, 369057872, 418672217, 1002783846, 919489135,
            567498868, 752375421, 209336225, 24197544, 376187827, 459744698,
            945164165, 895287692, 574624663, 793451934, 1679968233, 1764313568,
            2117360635, 1933530610, 1343127501, 1560637892, 1243112415,
            1192455638, 3704280881, 3519142200, 3336358691, 3419915562,
            3907448597, 3857572124, 4075877127, 4294704398, 3029510009,
            3113855344, 2927934315, 2744104290, 2159976285, 2377486676,
            2594734927, 2544078150,
          ],
          C = [
            0, 151849742, 303699484, 454499602, 607398968, 758720310, 908999204,
            1059270954, 1214797936, 1097159550, 1517440620, 1400849762,
            1817998408, 1699839814, 2118541908, 2001430874, 2429595872,
            2581445614, 2194319100, 2345119218, 3034881240, 3186202582,
            2801699524, 2951971274, 3635996816, 3518358430, 3399679628,
            3283088770, 4237083816, 4118925222, 4002861748, 3885750714,
            1002142683, 850817237, 698445255, 548169417, 529487843, 377642221,
            227885567, 77089521, 1943217067, 2061379749, 1640576439, 1757691577,
            1474760595, 1592394909, 1174215055, 1290801793, 2875968315,
            2724642869, 3111247143, 2960971305, 2405426947, 2253581325,
            2638606623, 2487810577, 3808662347, 3926825029, 4044981591,
            4162096729, 3342319475, 3459953789, 3576539503, 3693126241,
            1986918061, 2137062819, 1685577905, 1836772287, 1381620373,
            1532285339, 1078185097, 1229899655, 1040559837, 923313619,
            740276417, 621982671, 439452389, 322734571, 137073913, 19308535,
            3871163981, 4021308739, 4104605777, 4255800159, 3263785589,
            3414450555, 3499326569, 3651041127, 2933202493, 2815956275,
            3167684641, 3049390895, 2330014213, 2213296395, 2566595609,
            2448830231, 1305906550, 1155237496, 1607244650, 1455525988,
            1776460110, 1626319424, 2079897426, 1928707164, 96392454, 213114376,
            396673818, 514443284, 562755902, 679998e3, 865136418, 983426092,
            3708173718, 3557504664, 3474729866, 3323011204, 4180808110,
            4030667424, 3945269170, 3794078908, 2507040230, 2623762152,
            2272556026, 2390325492, 2975484382, 3092726480, 2738905026,
            2857194700, 3973773121, 3856137295, 4274053469, 4157467219,
            3371096953, 3252932727, 3673476453, 3556361835, 2763173681,
            2915017791, 3064510765, 3215307299, 2156299017, 2307622919,
            2459735317, 2610011675, 2081048481, 1963412655, 1846563261,
            1729977011, 1480485785, 1362321559, 1243905413, 1126790795,
            878845905, 1030690015, 645401037, 796197571, 274084841, 425408743,
            38544885, 188821243, 3613494426, 3731654548, 3313212038, 3430322568,
            4082475170, 4200115116, 3780097726, 3896688048, 2668221674,
            2516901860, 2366882550, 2216610296, 3141400786, 2989552604,
            2837966542, 2687165888, 1202797690, 1320957812, 1437280870,
            1554391400, 1669664834, 1787304780, 1906247262, 2022837584,
            265905162, 114585348, 499347990, 349075736, 736970802, 585122620,
            972512814, 821712160, 2595684844, 2478443234, 2293045232,
            2174754046, 3196267988, 3079546586, 2895723464, 2777952454,
            3537852828, 3687994002, 3234156416, 3385345166, 4142626212,
            4293295786, 3841024952, 3992742070, 174567692, 57326082, 410887952,
            292596766, 777231668, 660510266, 1011452712, 893681702, 1108339068,
            1258480242, 1343618912, 1494807662, 1715193156, 1865862730,
            1948373848, 2100090966, 2701949495, 2818666809, 3004591147,
            3122358053, 2235061775, 2352307457, 2535604243, 2653899549,
            3915653703, 3764988233, 4219352155, 4067639125, 3444575871,
            3294430577, 3746175075, 3594982253, 836553431, 953270745, 600235211,
            718002117, 367585007, 484830689, 133361907, 251657213, 2041877159,
            1891211689, 1806599355, 1654886325, 1568718495, 1418573201,
            1335535747, 1184342925,
          ],
          L = function (e) {
            if (!(this instanceof L))
              throw Error("AES must be instanitated with `new`");
            Object.defineProperty(this, "key", { value: o(e, !0) }),
              this._prepare();
          };
        (L.prototype._prepare = function () {
          var e = d[this.key.length];
          if (null == e)
            throw new Error("invalid key size (must be 16, 24 or 32 bytes)");
          (this._Ke = []), (this._Kd = []);
          for (var t = 0; t <= e; t++)
            this._Ke.push([0, 0, 0, 0]), this._Kd.push([0, 0, 0, 0]);
          for (
            var n,
              r = 4 * (e + 1),
              o = this.key.length / 4,
              i = u(this.key),
              t = 0;
            t < o;
            t++
          )
            (n = t >> 2),
              (this._Ke[n][t % 4] = i[t]),
              (this._Kd[e - n][t % 4] = i[t]);
          for (var c, s = 0, a = o; a < r; ) {
            if (
              ((c = i[o - 1]),
              (i[0] ^=
                (h[(c >> 16) & 255] << 24) ^
                (h[(c >> 8) & 255] << 16) ^
                (h[255 & c] << 8) ^
                h[(c >> 24) & 255] ^
                (v[s] << 24)),
              (s += 1),
              8 != o)
            )
              for (var t = 1; t < o; t++) i[t] ^= i[t - 1];
            else {
              for (var t = 1; t < o / 2; t++) i[t] ^= i[t - 1];
              (c = i[o / 2 - 1]),
                (i[o / 2] ^=
                  h[255 & c] ^
                  (h[(c >> 8) & 255] << 8) ^
                  (h[(c >> 16) & 255] << 16) ^
                  (h[(c >> 24) & 255] << 24));
              for (var t = o / 2 + 1; t < o; t++) i[t] ^= i[t - 1];
            }
            for (var f, l, t = 0; t < o && a < r; )
              (f = a >> 2),
                (l = a % 4),
                (this._Ke[f][l] = i[t]),
                (this._Kd[e - f][l] = i[t++]),
                a++;
          }
          for (var f = 1; f < e; f++)
            for (var l = 0; l < 4; l++)
              (c = this._Kd[f][l]),
                (this._Kd[f][l] =
                  x[(c >> 24) & 255] ^
                  T[(c >> 16) & 255] ^
                  B[(c >> 8) & 255] ^
                  C[255 & c]);
        }),
          (L.prototype.encrypt = function (e) {
            if (16 != e.length)
              throw new Error("invalid plaintext size (must be 16 bytes)");
            for (
              var t = this._Ke.length - 1, n = [0, 0, 0, 0], r = u(e), o = 0;
              o < 4;
              o++
            )
              r[o] ^= this._Ke[0][o];
            for (var c = 1; c < t; c++) {
              for (var o = 0; o < 4; o++)
                n[o] =
                  g[(r[o] >> 24) & 255] ^
                  y[(r[(o + 1) % 4] >> 16) & 255] ^
                  w[(r[(o + 2) % 4] >> 8) & 255] ^
                  m[255 & r[(o + 3) % 4]] ^
                  this._Ke[c][o];
              r = n.slice();
            }
            for (var s, a = i(16), o = 0; o < 4; o++)
              (s = this._Ke[t][o]),
                (a[4 * o] = 255 & (h[(r[o] >> 24) & 255] ^ (s >> 24))),
                (a[4 * o + 1] =
                  255 & (h[(r[(o + 1) % 4] >> 16) & 255] ^ (s >> 16))),
                (a[4 * o + 2] =
                  255 & (h[(r[(o + 2) % 4] >> 8) & 255] ^ (s >> 8))),
                (a[4 * o + 3] = 255 & (h[255 & r[(o + 3) % 4]] ^ s));
            return a;
          }),
          (L.prototype.decrypt = function (e) {
            if (16 != e.length)
              throw new Error("invalid ciphertext size (must be 16 bytes)");
            for (
              var t = this._Kd.length - 1, n = [0, 0, 0, 0], r = u(e), o = 0;
              o < 4;
              o++
            )
              r[o] ^= this._Kd[0][o];
            for (var c = 1; c < t; c++) {
              for (var o = 0; o < 4; o++)
                n[o] =
                  b[(r[o] >> 24) & 255] ^
                  I[(r[(o + 3) % 4] >> 16) & 255] ^
                  _[(r[(o + 2) % 4] >> 8) & 255] ^
                  S[255 & r[(o + 1) % 4]] ^
                  this._Kd[c][o];
              r = n.slice();
            }
            for (var s, a = i(16), o = 0; o < 4; o++)
              (s = this._Kd[t][o]),
                (a[4 * o] = 255 & (p[(r[o] >> 24) & 255] ^ (s >> 24))),
                (a[4 * o + 1] =
                  255 & (p[(r[(o + 3) % 4] >> 16) & 255] ^ (s >> 16))),
                (a[4 * o + 2] =
                  255 & (p[(r[(o + 2) % 4] >> 8) & 255] ^ (s >> 8))),
                (a[4 * o + 3] = 255 & (p[255 & r[(o + 1) % 4]] ^ s));
            return a;
          });
        var E = function (e) {
          if (!(this instanceof E))
            throw Error("AES must be instanitated with `new`");
          (this.description = "Electronic Code Block"),
            (this.name = "ecb"),
            (this._aes = new L(e));
        };
        (E.prototype.encrypt = function (e) {
          if (((e = o(e)), e.length % 16 !== 0))
            throw new Error(
              "invalid plaintext size (must be multiple of 16 bytes)"
            );
          for (var t = i(e.length), n = i(16), r = 0; r < e.length; r += 16)
            c(e, n, 0, r, r + 16), (n = this._aes.encrypt(n)), c(n, t, r);
          return t;
        }),
          (E.prototype.decrypt = function (e) {
            if (((e = o(e)), e.length % 16 !== 0))
              throw new Error(
                "invalid ciphertext size (must be multiple of 16 bytes)"
              );
            for (var t = i(e.length), n = i(16), r = 0; r < e.length; r += 16)
              c(e, n, 0, r, r + 16), (n = this._aes.decrypt(n)), c(n, t, r);
            return t;
          });
        var k = function (e, t) {
          if (!(this instanceof k))
            throw Error("AES must be instanitated with `new`");
          if (
            ((this.description = "Cipher Block Chaining"),
            (this.name = "cbc"),
            t)
          ) {
            if (16 != t.length)
              throw new Error(
                "invalid initialation vector size (must be 16 bytes)"
              );
          } else t = i(16);
          (this._lastCipherblock = o(t, !0)), (this._aes = new L(e));
        };
        (k.prototype.encrypt = function (e) {
          if (((e = o(e)), e.length % 16 !== 0))
            throw new Error(
              "invalid plaintext size (must be multiple of 16 bytes)"
            );
          for (var t = i(e.length), n = i(16), r = 0; r < e.length; r += 16) {
            c(e, n, 0, r, r + 16);
            for (var u = 0; u < 16; u++) n[u] ^= this._lastCipherblock[u];
            (this._lastCipherblock = this._aes.encrypt(n)),
              c(this._lastCipherblock, t, r);
          }
          return t;
        }),
          (k.prototype.decrypt = function (e) {
            if (((e = o(e)), e.length % 16 !== 0))
              throw new Error(
                "invalid ciphertext size (must be multiple of 16 bytes)"
              );
            for (var t = i(e.length), n = i(16), r = 0; r < e.length; r += 16) {
              c(e, n, 0, r, r + 16), (n = this._aes.decrypt(n));
              for (var u = 0; u < 16; u++)
                t[r + u] = n[u] ^ this._lastCipherblock[u];
              c(e, this._lastCipherblock, 0, r, r + 16);
            }
            return t;
          });
        var A = function (e, t, n) {
          if (!(this instanceof A))
            throw Error("AES must be instanitated with `new`");
          if (
            ((this.description = "Cipher Feedback"), (this.name = "cfb"), t)
          ) {
            if (16 != t.length)
              throw new Error(
                "invalid initialation vector size (must be 16 size)"
              );
          } else t = i(16);
          n || (n = 1),
            (this.segmentSize = n),
            (this._shiftRegister = o(t, !0)),
            (this._aes = new L(e));
        };
        (A.prototype.encrypt = function (e) {
          if (e.length % this.segmentSize != 0)
            throw new Error(
              "invalid plaintext size (must be segmentSize bytes)"
            );
          for (
            var t, n = o(e, !0), r = 0;
            r < n.length;
            r += this.segmentSize
          ) {
            t = this._aes.encrypt(this._shiftRegister);
            for (var i = 0; i < this.segmentSize; i++) n[r + i] ^= t[i];
            c(this._shiftRegister, this._shiftRegister, 0, this.segmentSize),
              c(
                n,
                this._shiftRegister,
                16 - this.segmentSize,
                r,
                r + this.segmentSize
              );
          }
          return n;
        }),
          (A.prototype.decrypt = function (e) {
            if (e.length % this.segmentSize != 0)
              throw new Error(
                "invalid ciphertext size (must be segmentSize bytes)"
              );
            for (
              var t, n = o(e, !0), r = 0;
              r < n.length;
              r += this.segmentSize
            ) {
              t = this._aes.encrypt(this._shiftRegister);
              for (var i = 0; i < this.segmentSize; i++) n[r + i] ^= t[i];
              c(this._shiftRegister, this._shiftRegister, 0, this.segmentSize),
                c(
                  e,
                  this._shiftRegister,
                  16 - this.segmentSize,
                  r,
                  r + this.segmentSize
                );
            }
            return n;
          });
        var D = function (e, t) {
          if (!(this instanceof D))
            throw Error("AES must be instanitated with `new`");
          if (
            ((this.description = "Output Feedback"), (this.name = "ofb"), t)
          ) {
            if (16 != t.length)
              throw new Error(
                "invalid initialation vector size (must be 16 bytes)"
              );
          } else t = i(16);
          (this._lastPrecipher = o(t, !0)),
            (this._lastPrecipherIndex = 16),
            (this._aes = new L(e));
        };
        (D.prototype.encrypt = function (e) {
          for (var t = o(e, !0), n = 0; n < t.length; n++)
            16 === this._lastPrecipherIndex &&
              ((this._lastPrecipher = this._aes.encrypt(this._lastPrecipher)),
              (this._lastPrecipherIndex = 0)),
              (t[n] ^= this._lastPrecipher[this._lastPrecipherIndex++]);
          return t;
        }),
          (D.prototype.decrypt = D.prototype.encrypt);
        var O = function (e) {
          if (!(this instanceof O))
            throw Error("Counter must be instanitated with `new`");
          0 === e || e || (e = 1),
            "number" == typeof e
              ? ((this._counter = i(16)), this.setValue(e))
              : this.setBytes(e);
        };
        (O.prototype.setValue = function (e) {
          if ("number" != typeof e || parseInt(e) != e)
            throw new Error("invalid counter value (must be an integer)");
          if (e > Number.MAX_SAFE_INTEGER)
            throw new Error("integer value out of safe range");
          for (var t = 15; t >= 0; --t)
            (this._counter[t] = e % 256), (e = parseInt(e / 256));
        }),
          (O.prototype.setBytes = function (e) {
            if (((e = o(e, !0)), 16 != e.length))
              throw new Error("invalid counter bytes size (must be 16 bytes)");
            this._counter = e;
          }),
          (O.prototype.increment = function () {
            for (var e = 15; e >= 0; e--) {
              if (255 !== this._counter[e]) {
                this._counter[e]++;
                break;
              }
              this._counter[e] = 0;
            }
          });
        var P = function (e, t) {
          if (!(this instanceof P))
            throw Error("AES must be instanitated with `new`");
          (this.description = "Counter"),
            (this.name = "ctr"),
            t instanceof O || (t = new O(t)),
            (this._counter = t),
            (this._remainingCounter = null),
            (this._remainingCounterIndex = 16),
            (this._aes = new L(e));
        };
        (P.prototype.encrypt = function (e) {
          for (var t = o(e, !0), n = 0; n < t.length; n++)
            16 === this._remainingCounterIndex &&
              ((this._remainingCounter = this._aes.encrypt(
                this._counter._counter
              )),
              (this._remainingCounterIndex = 0),
              this._counter.increment()),
              (t[n] ^= this._remainingCounter[this._remainingCounterIndex++]);
          return t;
        }),
          (P.prototype.decrypt = P.prototype.encrypt);
        var F = {
          AES: L,
          Counter: O,
          ModeOfOperation: { ecb: E, cbc: k, cfb: A, ofb: D, ctr: P },
          utils: { hex: l, utf8: f },
          padding: { pkcs7: { pad: s, strip: a } },
          _arrayTest: { coerceArray: o, createArray: i, copyArray: c },
        };
        e.exports = F;
      })(this);
    },
    function (e, t, n) {
      "use strict";
      function r(e, t, n) {
        return c.isInit()
          ? (o.debug("invoke openLockByKey"), void i.openLock(e, t, null, n))
          : void n(new c.BizError(1001, "have not initialized!"));
      }
      var o = n(71),
        i = n(126),
        c = n(116);
      e.exports = { execute: r };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o() {
        z && i(),
          (z = setTimeout(function () {
            P.stopScan(),
              R && "function" == typeof R && R(new F(1007, "timeout " + V));
          }, V));
      }
      function i() {
        z && (O.debug("clear timer"), clearTimeout(z), (z = null));
      }
      function c(e, t) {
        if ("ios" === P.getSystemInfo().platform) {
          var n = u(e);
          if (!n)
            return (
              O.debug("get disconnect data exception!!"), void s(e.deviceId, t)
            );
          setTimeout(function () {
            var r =
                "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y,
              o =
                "android" === P.getSystemInfo().platform ? J.toLowerCase() : J;
            wx.writeBLECharacteristicValue({
              deviceId: e.deviceId,
              serviceId: r,
              characteristicId: o,
              value: n.buffer,
              success: function (e) {
                console.log("writeBLECharacteristicValue success", e.errMsg);
              },
              complete: function (n) {
                s(e.deviceId, t);
              },
            });
          }, 200);
        } else s(e.deviceId, t);
      }
      function u(e) {
        if (32 === e.fwVersion) {
          var t = 85,
            n = 136,
            r = 0,
            o = 0,
            i = n ^ r ^ o,
            c = new Uint8Array(5);
          return c.set([t, n, r, o, i], 0), c;
        }
        if (20 === e.fwVersion) {
          var u = new Uint8Array(1);
          return (u[0] = 170), u;
        }
        return 0;
      }
      function s(e, t) {
        wx.closeBLEConnection({
          deviceId: e,
          success: function (t) {
            O.info("disconnect device " + e + "successful");
          },
          fail: function (t) {
            O.info("disconnect device " + e + "fail"), O.error(t);
          },
          complete: function (e) {
            t && "function" == typeof t && t();
          },
        });
      }
      function a(e, t, n) {
        console.log("start notify" + e),
          wx.notifyBLECharacteristicValueChanged({
            deviceId: e,
            serviceId: Y,
            characteristicId: X,
            state: !0,
            success: function (n) {
              function r(e) {
                try {
                  var t = Array.prototype.map.call(
                    new Uint8Array(e),
                    function (e) {
                      return ("00" + e.toString(16)).slice(-2);
                    }
                  );
                  return t.join("");
                } catch (e) {
                  O.error("format Data returned by the device fail");
                }
                return null;
              }
              O.debug(n),
                wx.onBLECharacteristicValueChange(function (e) {
                  (U = r(e.value)), O.debug("ikey indicate value :" + U);
                }),
                wx.readBLECharacteristicValue({
                  deviceId: e,
                  serviceId: Y,
                  characteristicId: X,
                  success: function (e) {
                    O.debug("readBLECharacteristicValue:", e.errMsg);
                  },
                }),
                t();
            },
            fail: function (e) {
              console.log("==notifyCharacteristicValueChange fail=="),
                O.error(e),
                n();
            },
          });
      }
      function f(e) {
        O.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === Y.toLowerCase()) return e[t];
        return !1;
      }
      function l(e) {
        O.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === J.toLowerCase()) return e[t];
        return !1;
      }
      function d(e, t, n) {
        return P.isInit()
          ? ((G = e),
            (H = t),
            (j = !1),
            (N = !0),
            (U = null),
            (K = !0),
            (M = 3),
            (R = n),
            void v()
              .then(h)
              .then(p)
              .then(g)
              .catch(function (e) {
                O.error(e);
              }))
          : void n(new P.BizError(1001, "have not initialized!"));
      }
      function v() {
        return new k.default(function (e, t) {
          wx.getBluetoothAdapterState({
            fail: function (e) {
              t(e);
            },
            success: function (n) {
              return n.available
                ? (wx.onBLEConnectionStateChanged(function (e) {
                    console.log(
                      "device " +
                        e.deviceId +
                        " state has changed, connected: " +
                        e.connected
                    );
                  }),
                  O.debug("ble adapter available"),
                  void e())
                : void t(new F(10001, "not init"));
            },
          });
        });
      }
      function h() {
        return new k.default(function (e, t) {
          return "ios" === P.getSystemInfo().platform
            ? void e()
            : void wx.getBluetoothDevices({
                success: function (t) {
                  var n = t.devices;
                  if (
                    (O.debug("cached devices" + (0, L.default)(n)),
                    n && n.length > 0)
                  ) {
                    var r = !0,
                      o = !1,
                      i = void 0;
                    try {
                      for (
                        var c, u = (0, D.default)(n);
                        !(r = (c = u.next()).done);
                        r = !0
                      ) {
                        var s = c.value;
                        O.debug("get device from cached " + s.deviceId),
                          s.deviceId.toLowerCase() === H && y(s, !0);
                      }
                    } catch (e) {
                      (o = !0), (i = e);
                    } finally {
                      try {
                        !r && u.return && u.return();
                      } finally {
                        if (o) throw i;
                      }
                    }
                  }
                  e();
                },
                fail: function (e) {
                  t(e);
                },
              });
        });
      }
      function p() {
        return new k.default(function (e, t) {
          wx.startBluetoothDevicesDiscovery({
            success: function (t) {
              O.debug("ble scan started"), o(), e();
            },
            fail: function (e) {
              t(e);
            },
          });
        });
      }
      function g() {
        return new k.default(function (e, t) {
          wx.getBluetoothAdapterState({
            complete: function (e) {
              O.debug(e);
            },
          }),
            wx.onBluetoothDeviceFound(y),
            e(),
            O.debug("initialize ble successful");
        });
      }
      function y(e, t) {
        if (!j) {
          var n = void 0;
          e.deviceId
            ? (n = e)
            : e.devices
            ? (n = e.devices[0])
            : e[0] && (n = e[0]),
            console.log(n);
          var r = P.validate(n, P.getSystemInfo());
          console.log(r),
            (r && r.mac.toLowerCase() !== H) ||
              (r &&
                (O.debug("found device " + r.mac + (t ? ", from cache" : "")),
                (j = !0),
                w(r, "keyplaceholder", t)));
        }
      }
      function w(e, t, n, r) {
        r && "function" == typeof r && (R = r);
        var o = m([e, t]),
          c = o;
        "ios" === P.getSystemInfo().platform && (c = o.then(b).then(I)),
          c
            .then(_)
            .then(S)
            .then(T)
            .then(B)
            .catch(function (e) {
              return (
                O.error(e),
                1002 === e.errCode
                  ? (i(),
                    P.stopScan(),
                    void (
                      R &&
                      "function" == typeof R &&
                      R(new F(1002, (0, L.default)(e)))
                    ))
                  : (i(),
                    P.stopScan(P.closeAdapter),
                    void (
                      R &&
                      "function" == typeof R &&
                      R(new F(1005, (0, L.default)(e)))
                    ))
              );
            });
      }
      function m(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start connect " + t.mac),
            wx.createBLEConnection({
              deviceId: t.deviceId,
              success: function (r) {
                O.debug("connect " + t.mac + "successful"),
                  O.debug("delay 300ms"),
                  P.stopScan(),
                  setTimeout(function () {
                    n(e);
                  }, 100);
              },
              fail: function (e) {
                wx.getConnectedBluetoothDevices({
                  success: function (e) {
                    O.debug("connected devices [" + e + "]");
                  },
                }),
                  r(e);
              },
            });
        });
      }
      function b(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start get services for " + t.mac),
            wx.getBLEDeviceServices({
              deviceId: t.deviceId,
              success: function (o) {
                var i = f(o.services);
                i
                  ? (O.debug("get service " + Y + " successful, delay 200ms"),
                    setTimeout(function () {
                      n(e);
                    }, 100))
                  : (c(t), r("target service not found in " + t.mac));
              },
              fail: function (e) {
                r(e);
              },
            });
        });
      }
      function I(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start get characteristic for " + t.mac);
          var o =
            "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y;
          wx.getBLEDeviceCharacteristics({
            deviceId: t.deviceId,
            serviceId: o,
            success: function (o) {
              var i = l(o.characteristics);
              i
                ? (O.debug("get characteristic " + i.uuid + " successful"),
                  n(e))
                : (c(t), r("target characteristic not found"));
            },
            fail: function (e) {
              r(e);
            },
          });
        });
      }
      function _(e) {
        var t = e[0];
        return new k.default(function (n, r) {
          O.debug("start notify " + t.mac),
            a(
              t.deviceId,
              function () {
                setTimeout(function () {
                  console.log("openLockStep4...........notify"), n(e);
                }, 100);
              },
              function () {
                O.error(
                  "start notify fail, current version Wechat not support!"
                ),
                  (N = !1),
                  n(e);
              }
            );
        });
      }
      function S(e) {
        var t = e[0],
          n = e[1];
        return new k.default(function (e, r) {
          console.log("openLockStep5"), O.debug("start do open lock");
          var o =
              "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y,
            i = "android" === P.getSystemInfo().platform ? J.toLowerCase() : J;
          x(t, o, i, n, e, r);
        });
      }
      function x(e, t, n, r, o, i) {
        console.log("doOpen..........." + G);
        var c = new Uint8Array(4);
        (c[0] = (G >> 24) & 255),
          (c[1] = (G >> 16) & 255),
          (c[2] = (G >> 8) & 255),
          (c[3] = 255 & G);
        var u = null;
        if (e.fwVersion > 20) {
          var s = new Uint8Array(3 + c.length + 1);
          (s[0] = 85), (s[1] = W), (s[2] = c.length);
          for (var a = W ^ c.length, f = 0; f < c.length; f++) a ^= c[f];
          (a ^= 0), s.set(c, 3), s.set([a], s.length - 1), (u = s.buffer);
        }
        wx.writeBLECharacteristicValue({
          deviceId: e.deviceId,
          serviceId: t,
          characteristicId: n,
          value: u,
          success: function (t) {
            O.debug("send auth key successful"), o(e);
          },
          fail: function (e) {
            O.debug(e), i(e);
          },
        });
      }
      function T(e) {
        return new k.default(function (t, n) {
          if (N) {
            var r = null,
              o = 500;
            console.log(U),
              (r = setInterval(function () {
                return U
                  ? (clearInterval(r), void t(e))
                  : ((o -= 20),
                    o < 0
                      ? (clearInterval(r), void t(e))
                      : void O.info("waiting for notify value: " + o));
              }, 20));
          } else t(e);
        });
      }
      function B(e) {
        return (
          console.log(e),
          new k.default(function (t, n) {
            i(),
              setTimeout(function () {
                O.debug("lock opened, disconnect ble"),
                  c(e, function () {
                    P.closeAdapter(), t();
                  }),
                  R(null);
              }, 100);
          })
        );
      }
      var C = n(69),
        L = r(C),
        E = n(74),
        k = r(E),
        A = n(121),
        D = r(A),
        O = n(71),
        P = n(116),
        F = P.BizError,
        M = 3,
        R = null,
        z = null,
        V = 1e4,
        j = !1,
        N = !0,
        U = null,
        K = !0,
        G = 0,
        H = null,
        W = 137,
        Y = "00002560-0000-1000-8000-00805F9B34FB",
        J = "00002561-0000-1000-8000-00805F9B34FB",
        X = "00002562-0000-1000-8000-00805F9B34FB";
      e.exports = { write: d };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o() {
        z && i(),
          (z = setTimeout(function () {
            P.stopScan(),
              R && "function" == typeof R && R(new F(1007, "timeout " + V));
          }, V));
      }
      function i() {
        z && (O.debug("clear timer"), clearTimeout(z), (z = null));
      }
      function c(e, t) {
        if ("ios" === P.getSystemInfo().platform) {
          var n = u(e);
          if (!n)
            return (
              O.debug("get disconnect data exception!!"), void s(e.deviceId, t)
            );
          setTimeout(function () {
            var r =
                "android" === P.getSystemInfo().platform ? W.toLowerCase() : W,
              o =
                "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y;
            wx.writeBLECharacteristicValue({
              deviceId: e.deviceId,
              serviceId: r,
              characteristicId: o,
              value: n.buffer,
              success: function (e) {
                console.log("writeBLECharacteristicValue success", e.errMsg);
              },
              complete: function (n) {
                s(e.deviceId, t);
              },
            });
          }, 200);
        } else s(e.deviceId, t);
      }
      function u(e) {
        if (32 === e.fwVersion) {
          var t = 85,
            n = 136,
            r = 0,
            o = 0,
            i = n ^ r ^ o,
            c = new Uint8Array(5);
          return c.set([t, n, r, o, i], 0), c;
        }
        if (20 === e.fwVersion) {
          var u = new Uint8Array(1);
          return (u[0] = 170), u;
        }
        return 0;
      }
      function s(e, t) {
        wx.closeBLEConnection({
          deviceId: e,
          success: function (t) {
            O.info("disconnect device " + e + "successful");
          },
          fail: function (t) {
            O.info("disconnect device " + e + "fail"), O.error(t);
          },
          complete: function (e) {
            t && "function" == typeof t && t();
          },
        });
      }
      function a(e, t, n) {
        console.log("start notify" + e),
          wx.notifyBLECharacteristicValueChanged({
            deviceId: e,
            serviceId: W,
            characteristicId: J,
            state: !0,
            success: function (n) {
              function r(e) {
                try {
                  var t = Array.prototype.map.call(
                    new Uint8Array(e),
                    function (e) {
                      return ("00" + e.toString(16)).slice(-2);
                    }
                  );
                  return t.join("");
                } catch (e) {
                  O.error("format Data returned by the device fail");
                }
                return null;
              }
              O.debug(n),
                wx.onBLECharacteristicValueChange(function (e) {
                  (U = r(e.value)), O.debug("ikey indicate value :" + U);
                }),
                wx.readBLECharacteristicValue({
                  deviceId: e,
                  serviceId: W,
                  characteristicId: J,
                  success: function (e) {
                    O.debug("readBLECharacteristicValue:", e.errMsg);
                  },
                }),
                t();
            },
            fail: function (e) {
              console.log("==notifyCharacteristicValueChange fail=="),
                O.error(e),
                n();
            },
          });
      }
      function f(e) {
        O.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === W.toLowerCase()) return e[t];
        return !1;
      }
      function l(e) {
        O.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === Y.toLowerCase()) return e[t];
        return !1;
      }
      function d(e, t) {
        return P.isInit()
          ? ((G = e),
            (j = !1),
            (N = !0),
            (U = null),
            (K = !0),
            (M = 3),
            (R = t),
            void v()
              .then(h)
              .then(p)
              .then(g)
              .catch(function (e) {
                O.error(e);
              }))
          : void t(new P.BizError(1001, "have not initialized!"));
      }
      function v() {
        return new k.default(function (e, t) {
          wx.getBluetoothAdapterState({
            fail: function (e) {
              t(e);
            },
            success: function (n) {
              return n.available
                ? (wx.onBLEConnectionStateChanged(function (e) {
                    console.log(
                      "device " +
                        e.deviceId +
                        " state has changed, connected: " +
                        e.connected
                    );
                  }),
                  O.debug("ble adapter available"),
                  void e())
                : void t(new F(10001, "not init"));
            },
          });
        });
      }
      function h() {
        return new k.default(function (e, t) {
          return "ios" === P.getSystemInfo().platform
            ? void e()
            : void wx.getBluetoothDevices({
                success: function (t) {
                  var n = t.devices;
                  if (
                    (O.debug("cached devices" + (0, L.default)(n)),
                    n && n.length > 0)
                  ) {
                    var r = !0,
                      o = !1,
                      i = void 0;
                    try {
                      for (
                        var c, u = (0, D.default)(n);
                        !(r = (c = u.next()).done);
                        r = !0
                      ) {
                        var s = c.value;
                        O.debug("get device from cached " + s.deviceId),
                          s.deviceId.toLowerCase() === G && y(s, !0);
                      }
                    } catch (e) {
                      (o = !0), (i = e);
                    } finally {
                      try {
                        !r && u.return && u.return();
                      } finally {
                        if (o) throw i;
                      }
                    }
                  }
                  e();
                },
                fail: function (e) {
                  t(e);
                },
              });
        });
      }
      function p() {
        return new k.default(function (e, t) {
          wx.startBluetoothDevicesDiscovery({
            success: function (t) {
              O.debug("ble scan started"), o(), e();
            },
            fail: function (e) {
              t(e);
            },
          });
        });
      }
      function g() {
        return new k.default(function (e, t) {
          wx.getBluetoothAdapterState({
            complete: function (e) {
              O.debug(e);
            },
          }),
            wx.onBluetoothDeviceFound(y),
            e(),
            O.debug("initialize ble successful");
        });
      }
      function y(e, t) {
        if (!j) {
          var n = void 0;
          e.deviceId
            ? (n = e)
            : e.devices
            ? (n = e.devices[0])
            : e[0] && (n = e[0]),
            console.log(n);
          var r = P.validate(n, P.getSystemInfo());
          console.log(r),
            (r && r.mac.toLowerCase() !== G) ||
              (r &&
                (O.debug("found device " + r.mac + (t ? ", from cache" : "")),
                (j = !0),
                w(r, "keyplaceholder", t)));
        }
      }
      function w(e, t, n, r) {
        r && "function" == typeof r && (R = r);
        var o = m([e, t]),
          c = o;
        "ios" === P.getSystemInfo().platform && (c = o.then(b).then(I)),
          c
            .then(_)
            .then(S)
            .then(T)
            .then(B)
            .catch(function (e) {
              return (
                O.error(e),
                1002 === e.errCode
                  ? (i(),
                    P.stopScan(),
                    void (
                      R &&
                      "function" == typeof R &&
                      R(new F(1002, (0, L.default)(e)))
                    ))
                  : (i(),
                    P.stopScan(P.closeAdapter),
                    void (
                      R &&
                      "function" == typeof R &&
                      R(new F(1005, (0, L.default)(e)))
                    ))
              );
            });
      }
      function m(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start connect " + t.mac),
            wx.createBLEConnection({
              deviceId: t.deviceId,
              success: function (r) {
                O.debug("connect " + t.mac + "successful"),
                  O.debug("delay 300ms"),
                  P.stopScan(),
                  setTimeout(function () {
                    n(e);
                  }, 100);
              },
              fail: function (e) {
                wx.getConnectedBluetoothDevices({
                  success: function (e) {
                    O.debug("connected devices [" + e + "]");
                  },
                }),
                  r(e);
              },
            });
        });
      }
      function b(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start get services for " + t.mac),
            wx.getBLEDeviceServices({
              deviceId: t.deviceId,
              success: function (o) {
                var i = f(o.services);
                i
                  ? (O.debug("get service " + W + " successful, delay 200ms"),
                    setTimeout(function () {
                      n(e);
                    }, 100))
                  : (c(t), r("target service not found in " + t.mac));
              },
              fail: function (e) {
                r(e);
              },
            });
        });
      }
      function I(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start get characteristic for " + t.mac);
          var o =
            "android" === P.getSystemInfo().platform ? W.toLowerCase() : W;
          wx.getBLEDeviceCharacteristics({
            deviceId: t.deviceId,
            serviceId: o,
            success: function (o) {
              var i = l(o.characteristics);
              i
                ? (O.debug("get characteristic " + i.uuid + " successful"),
                  n(e))
                : (c(t), r("target characteristic not found"));
            },
            fail: function (e) {
              r(e);
            },
          });
        });
      }
      function _(e) {
        var t = e[0];
        return new k.default(function (n, r) {
          O.debug("start notify " + t.mac),
            a(
              t.deviceId,
              function () {
                setTimeout(function () {
                  console.log("openLockStep4...........notify"), n(e);
                }, 100);
              },
              function () {
                O.error(
                  "start notify fail, current version Wechat not support!"
                ),
                  (N = !1),
                  n(e);
              }
            );
        });
      }
      function S(e) {
        var t = e[0],
          n = e[1];
        return new k.default(function (e, r) {
          console.log("openLockStep5"), O.debug("start do open lock");
          var o =
              "android" === P.getSystemInfo().platform ? W.toLowerCase() : W,
            i = "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y;
          x(t, o, i, n, e, r);
        });
      }
      function x(e, t, n, r, o, i) {
        console.log("doOpen...........");
        var c = null;
        if (e.fwVersion > 20) {
          var u = new Uint8Array(5);
          (u[0] = 85), (u[1] = H), (u[2] = 0), (u[3] = 0);
          var s = H;
          (s ^= 0), (s ^= 0), (s ^= 0), (u[4] = s), (c = u.buffer);
        }
        wx.writeBLECharacteristicValue({
          deviceId: e.deviceId,
          serviceId: t,
          characteristicId: n,
          value: c,
          success: function (t) {
            O.debug("send auth key successful"), o(e);
          },
          fail: function (e) {
            O.debug(e), i(e);
          },
        });
      }
      function T(e) {
        return new k.default(function (t, n) {
          if (N) {
            var r = null,
              o = 500,
              i = function (e) {
                var t = parseInt(e.substr(4, 2), 16),
                  n = e.substr(6, 2 * t);
                return (
                  O.debug("value: " + n + ", " + parseInt(n, 16)),
                  parseInt(n, 16)
                );
              };
            r = setInterval(function () {
              return U
                ? (clearInterval(r),
                  console.log("abc: " + i(U)),
                  void t([e, i(U)]))
                : ((o -= 20),
                  o < 0
                    ? (clearInterval(r), void t([e, -1]))
                    : void O.info("waiting for notify value: " + o));
            }, 20);
          } else t([e, -2]);
        });
      }
      function B(e) {
        var t = e[0],
          n = e[1];
        return new k.default(function (e, r) {
          i(),
            setTimeout(function () {
              O.debug("lock opened, disconnect ble"),
                c(t, function () {
                  P.closeAdapter(), e();
                }),
                R(null, n);
            }, 100);
        });
      }
      var C = n(69),
        L = r(C),
        E = n(74),
        k = r(E),
        A = n(121),
        D = r(A),
        O = n(71),
        P = n(116),
        F = P.BizError,
        M = 3,
        R = null,
        z = null,
        V = 1e4,
        j = !1,
        N = !0,
        U = null,
        K = !0,
        G = null,
        H = 138,
        W = "00002560-0000-1000-8000-00805F9B34FB",
        Y = "00002561-0000-1000-8000-00805F9B34FB",
        J = "00002562-0000-1000-8000-00805F9B34FB";
      e.exports = { read: d };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o() {
        R && i(),
          (R = setTimeout(function () {
            P.stopScan(),
              M && "function" == typeof M && M(new F(1007, "timeout " + z));
          }, z));
      }
      function i() {
        R && (O.debug("clear timer"), clearTimeout(R), (R = null));
      }
      function c(e, t) {
        if ("ios" === P.getSystemInfo().platform) {
          var n = u(e);
          if (!n)
            return (
              O.debug("get disconnect data exception!!"), void s(e.deviceId, t)
            );
          setTimeout(function () {
            var r =
                "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y,
              o =
                "android" === P.getSystemInfo().platform ? J.toLowerCase() : J;
            wx.writeBLECharacteristicValue({
              deviceId: e.deviceId,
              serviceId: r,
              characteristicId: o,
              value: n.buffer,
              success: function (e) {
                console.log("writeBLECharacteristicValue success", e.errMsg);
              },
              complete: function (n) {
                s(e.deviceId, t);
              },
            });
          }, 200);
        } else s(e.deviceId, t);
      }
      function u(e) {
        if (32 === e.fwVersion) {
          var t = 85,
            n = 136,
            r = 0,
            o = 0,
            i = n ^ r ^ o,
            c = new Uint8Array(5);
          return c.set([t, n, r, o, i], 0), c;
        }
        if (20 === e.fwVersion) {
          var u = new Uint8Array(1);
          return (u[0] = 170), u;
        }
        return 0;
      }
      function s(e, t) {
        wx.closeBLEConnection({
          deviceId: e,
          success: function (t) {
            O.info("disconnect device " + e + "successful");
          },
          fail: function (t) {
            O.info("disconnect device " + e + "fail"), O.error(t);
          },
          complete: function (e) {
            t && "function" == typeof t && t();
          },
        });
      }
      function a(e, t, n) {
        console.log("start notify" + e),
          wx.notifyBLECharacteristicValueChanged({
            deviceId: e,
            serviceId: Y,
            characteristicId: X,
            state: !0,
            success: function (n) {
              function r(e) {
                try {
                  var t = Array.prototype.map.call(
                    new Uint8Array(e),
                    function (e) {
                      return ("00" + e.toString(16)).slice(-2);
                    }
                  );
                  return t.join("");
                } catch (e) {
                  O.error("format Data returned by the device fail");
                }
                return null;
              }
              O.debug(n),
                wx.onBLECharacteristicValueChange(function (e) {
                  (N = r(e.value)), O.debug("ikey indicate value :" + N);
                }),
                wx.readBLECharacteristicValue({
                  deviceId: e,
                  serviceId: Y,
                  characteristicId: X,
                  success: function (e) {
                    O.debug("readBLECharacteristicValue:", e.errMsg);
                  },
                }),
                t();
            },
            fail: function (e) {
              console.log("==notifyCharacteristicValueChange fail=="),
                O.error(e),
                n();
            },
          });
      }
      function f(e) {
        O.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === Y.toLowerCase()) return e[t];
        return !1;
      }
      function l(e) {
        O.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === J.toLowerCase()) return e[t];
        return !1;
      }
      function d(e, t, n) {
        return P.isInit()
          ? ((K = e),
            (G = t),
            (V = !1),
            (j = !0),
            (N = null),
            (U = !0),
            (H = 1),
            (M = n),
            void v()
              .then(h)
              .then(p)
              .then(g)
              .catch(function (e) {
                M(e);
              }))
          : void n(new P.BizError(1001, "have not initialized!"));
      }
      function v() {
        return new k.default(function (e, t) {
          wx.getBluetoothAdapterState({
            fail: function (e) {
              t(e);
            },
            success: function (n) {
              return n.available
                ? (wx.onBLEConnectionStateChanged(function (e) {
                    console.log(
                      "device " +
                        e.deviceId +
                        " state has changed, connected: " +
                        e.connected
                    );
                  }),
                  O.debug("ble adapter available"),
                  void e())
                : void t(new F(10001, "not init"));
            },
          });
        });
      }
      function h() {
        return new k.default(function (e, t) {
          return "ios" === P.getSystemInfo().platform
            ? void e()
            : void wx.getBluetoothDevices({
                success: function (t) {
                  var n = t.devices;
                  if (
                    (O.debug("cached devices" + (0, L.default)(n)),
                    n && n.length > 0)
                  ) {
                    var r = !0,
                      o = !1,
                      i = void 0;
                    try {
                      for (
                        var c, u = (0, D.default)(n);
                        !(r = (c = u.next()).done);
                        r = !0
                      ) {
                        var s = c.value;
                        O.debug("get device from cached " + s.deviceId),
                          s.deviceId.toLowerCase() === G.toLowerCase() &&
                            y(s, !0);
                      }
                    } catch (e) {
                      (o = !0), (i = e);
                    } finally {
                      try {
                        !r && u.return && u.return();
                      } finally {
                        if (o) throw i;
                      }
                    }
                  }
                  e();
                },
                fail: function (e) {
                  t(e);
                },
              });
        });
      }
      function p() {
        return new k.default(function (e, t) {
          wx.startBluetoothDevicesDiscovery({
            success: function (t) {
              O.debug("ble scan started"), o(), e();
            },
            fail: function (e) {
              t(e);
            },
          });
        });
      }
      function g() {
        return new k.default(function (e, t) {
          wx.getBluetoothAdapterState({
            complete: function (e) {
              O.debug(e);
            },
          }),
            wx.onBluetoothDeviceFound(y),
            e(),
            O.debug("initialize ble successful");
        });
      }
      function y(e, t) {
        if ((console.log("发现目标设备"), console.log(e), !V)) {
          var n = void 0;
          e.deviceId
            ? (n = e)
            : e.devices
            ? (n = e.devices[0])
            : e[0] && (n = e[0]),
            console.log(n);
          var r = P.validate(n, P.getSystemInfo());
          console.log(r),
            (r && r.mac.toLowerCase() !== G.toLowerCase()) ||
              (r &&
                (O.debug("found device " + r.mac + (t ? ", from cache" : "")),
                (V = !0),
                w(r, "keyplaceholder", t)));
        }
      }
      function w(e, t, n, r) {
        r && "function" == typeof r && (M = r);
        var o = m([e, t]),
          c = o;
        "ios" === P.getSystemInfo().platform && (c = o.then(b).then(I)),
          c
            .then(_)
            .then(S)
            .then(T)
            .then(B)
            .catch(function (e) {
              return (
                O.error(e),
                1002 === e.errCode
                  ? (i(),
                    P.stopScan(),
                    void (
                      M &&
                      "function" == typeof M &&
                      M(new F(1002, (0, L.default)(e)))
                    ))
                  : (i(),
                    P.stopScan(P.closeAdapter),
                    void (
                      M &&
                      "function" == typeof M &&
                      M(new F(1005, (0, L.default)(e)))
                    ))
              );
            });
      }
      function m(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start connect " + t.mac),
            wx.createBLEConnection({
              deviceId: t.deviceId,
              timeout: 3e3,
              success: function (r) {
                O.debug("connect " + t.mac + "successful"),
                  O.debug("delay 300ms"),
                  P.stopScan(),
                  setTimeout(function () {
                    n(e);
                  }, 100);
              },
              fail: function (e) {
                wx.getConnectedBluetoothDevices({
                  success: function (e) {
                    O.debug("connected devices [" + e + "]");
                  },
                }),
                  r(e);
              },
            });
        });
      }
      function b(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start get services for " + t.mac),
            wx.getBLEDeviceServices({
              deviceId: t.deviceId,
              success: function (o) {
                var i = f(o.services);
                i
                  ? (O.debug("get service " + Y + " successful, delay 200ms"),
                    setTimeout(function () {
                      n(e);
                    }, 100))
                  : (c(t), r("target service not found in " + t.mac));
              },
              fail: function (e) {
                r(e);
              },
            });
        });
      }
      function I(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start get characteristic for " + t.mac);
          var o =
            "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y;
          wx.getBLEDeviceCharacteristics({
            deviceId: t.deviceId,
            serviceId: o,
            success: function (o) {
              var i = l(o.characteristics);
              i
                ? (O.debug("get characteristic " + i.uuid + " successful"),
                  n(e))
                : (c(t), r("target characteristic not found"));
            },
            fail: function (e) {
              r(e);
            },
          });
        });
      }
      function _(e) {
        var t = e[0];
        return new k.default(function (n, r) {
          O.debug("start notify " + t.mac),
            a(
              t.deviceId,
              function () {
                setTimeout(function () {
                  console.log("openLockStep4...........notify"), n(e);
                }, 100);
              },
              function () {
                O.error(
                  "start notify fail, current version Wechat not support!"
                ),
                  (j = !1),
                  n(e);
              }
            );
        });
      }
      function S(e) {
        var t = e[0],
          n = e[1];
        return new k.default(function (e, r) {
          console.log("openLockStep5"), O.debug("start do open lock");
          var o =
              "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y,
            i = "android" === P.getSystemInfo().platform ? J.toLowerCase() : J;
          x(t, o, i, n, e, r);
        });
      }
      function x(e, t, n, r, o, i) {
        console.log("do set password..........." + K);
        var c = wx.base64ToArrayBuffer(K),
          u = c;
        if (e.fwVersion > 20) {
          var s = new Uint8Array(c),
            a = new Uint8Array(3 + s.length + 1);
          (a[0] = 85), (a[1] = W), (a[2] = s.length);
          for (var f = W ^ s.length, l = 0; l < s.length; l++) f ^= s[l];
          (f ^= 0), a.set(s, 3), a.set([f], a.length - 1), (u = a.buffer);
        }
        wx.writeBLECharacteristicValue({
          deviceId: e.deviceId,
          serviceId: t,
          characteristicId: n,
          value: u,
          success: function (t) {
            O.debug("send auth key successful"), o(e);
          },
          fail: function (e) {
            O.debug(e), i(e);
          },
        });
      }
      function T(e) {
        return new k.default(function (t, n) {
          if (j) {
            var r = null,
              o = 500;
            console.log(N),
              (r = setInterval(function () {
                return N
                  ? (clearInterval(r), void t(e))
                  : ((o -= 20),
                    o < 0
                      ? (clearInterval(r), void t(e))
                      : void O.info("waiting for notify value: " + o));
              }, 20));
          } else t(e);
        });
      }
      function B(e) {
        return (
          console.log(e),
          new k.default(function (t, n) {
            i(),
              setTimeout(function () {
                O.debug("lock opened, disconnect ble"),
                  c(e, function () {
                    P.closeAdapter(), t();
                  }),
                  M(null);
              }, 100);
          })
        );
      }
      var C = n(69),
        L = r(C),
        E = n(74),
        k = r(E),
        A = n(121),
        D = r(A),
        O = n(71),
        P = n(116),
        F = P.BizError,
        M = null,
        R = null,
        z = 1e4,
        V = !1,
        j = !0,
        N = null,
        U = !0,
        K = 0,
        G = null,
        H = 1,
        W = 134,
        Y = "00002560-0000-1000-8000-00805F9B34FB",
        J = "00002561-0000-1000-8000-00805F9B34FB",
        X = "00002562-0000-1000-8000-00805F9B34FB";
      e.exports = { execute: d };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o(e, t) {
        if (e) {
          if (
            (console.log(
              "返回结果：" + S.ab2hex(e) + ", 期望结果：" + S.ab2hex(t)
            ),
            t && t.length > 0 && t.length === e.length)
          ) {
            for (var n = 0; n < t.length; n++) if (t[n] !== e[n]) return !1;
            return !0;
          }
          return !1;
        }
        return !0;
      }
      function i(e, t, n) {
        w(I.Instruct.ID_OPEN, new Uint8Array(wx.base64ToArrayBuffer(t)), e, n);
      }
      function c(e, t) {
        _.Transaction.scan(_.Transaction.DEV_TYPE.BIKE_TAG, e, t);
      }
      function u(e, t) {
        _.Transaction.scan(_.Transaction.DEV_TYPE.BIKE_LOCK, e, t);
      }
      function s(e, t) {
        _.Transaction.scan(_.Transaction.DEV_TYPE.BIKE_LIFT_A, e, t);
      }
      function a(e, t) {
        _.Transaction.scan(_.Transaction.DEV_TYPE.BIKE_LIFT_B1, e, t);
      }
      function f(e, t) {
        _.Transaction.scan(_.Transaction.DEV_TYPE.BIKE_LIFT_B2, e, t);
      }
      function l(e, t) {
        _.Transaction.scan(
          [
            _.Transaction.DEV_TYPE.BIKE_LIFT_B1,
            _.Transaction.DEV_TYPE.BIKE_LIFT_B2,
          ],
          e,
          t
        );
      }
      function d(e, t, n) {
        w(I.Instruct.ID_POWER, new Uint8Array([+t]), e, n);
      }
      function v(e, t) {
        var n = new I.Instruct(I.Instruct.ID_READ_POWER);
        new _.Transaction(e, n, function (e, n, r) {
          e
            ? t(e)
            : r && r.length > 3
            ? r[1] === I.Instruct.ID_RESP_BLE &&
              r[3] === I.Instruct.ID_READ_POWER &&
              t(null, r[4])
            : t(L.READ_POWER_FAIL);
        }).execute();
      }
      function h(e, t, n) {
        w(
          I.Instruct.ID_SET_NAME,
          new Uint8Array(
            [].concat((0, b.default)(t)).map(function (e) {
              return e.charCodeAt();
            })
          ),
          e,
          n
        );
      }
      function p(e, t) {
        w(I.Instruct.ID_RESET, null, e, t);
      }
      function g(e, t) {
        w(I.Instruct.ID_DISCONN, null, e, t);
      }
      function y(e, t) {
        w(I.Instruct.ID_DISCONN_ON_LONG, null, e, t);
      }
      function w(e, t, n, r) {
        var i = new I.Instruct(e, t);
        new _.Transaction(n, i, function (t, n, i) {
          t
            ? r(t)
            : o(i, I.Instruct.commonBleResp(e))
            ? (console.log("操作成功"), r(null, n))
            : (console.error("存在业务异常"),
              r(new x("1000000", "error message")));
        }).execute();
      }
      var m = n(134),
        b = r(m),
        I = n(139),
        _ = n(145),
        S = (n(71), n(116)),
        x = S.BizError,
        T = 500300,
        B = "4C4F592",
        C = 2e3,
        L = {
          READ_POWER_FAIL: new x(T + 1, "读取power level失败"),
          READ_GROUPID_FAIL: new x(T + 2, "读取groupId失败"),
          GET_LIFT_RSSI_THRESHOLD_FAIL: new x(T + 3, "读取信号门槛失败"),
        },
        E = {
          setGroupId: function (e, t, n) {
            var r = S.convertIntBytes(t);
            w(I.Instruct.ID_WRITE_GROUPID, new Uint8Array(r), e, n);
          },
          setExpire: function (e, t, n, r, o) {
            w(I.Instruct.ID_WRITE_EXPIRE, new Uint8Array([t, n, r]), e, o);
          },
          getGroupId: function (e, t) {
            var n = new I.Instruct(I.Instruct.ID_READ_GROUPID);
            new _.Transaction(e, n, function (e, n, r) {
              e
                ? t(e)
                : (r &&
                    r.length > 3 &&
                    r[1] === I.Instruct.ID_READ_GROUPID_RESP &&
                    t(null, r.subarray(3, r[2] + 3)),
                  t(L.READ_GROUPID_FAIL));
            }).execute();
          },
        },
        k = {
          setDateTime: function (e, t, n) {
            w(
              I.Instruct.ID_SET_TIME,
              new Uint8Array(
                [].concat((0, b.default)(t + "")).map(function (e) {
                  return e.charCodeAt();
                })
              ),
              e,
              n
            );
          },
          setGroupId: function (e, t, n) {
            console.log("set lock groupId mac: " + e), E.setGroupId(e, t, n);
          },
          getGroupId: function (e, t) {
            E.getGroupId(e, t);
          },
        },
        A = {
          setBType: function (e, t, n) {
            console.log("set b type = " + t),
              w(I.Instruct.ID_SET_LIFTB_TYPE, new Uint8Array([t]), e, n);
          },
          setCoordinateSystem: function (e, t, n, r, o, i) {
            wx.openBluetoothAdapter({
              fail: function (e) {
                console.log(e);
              },
              success: function (o) {
                console.log("开始写入A设备坐标"),
                  w(
                    I.Instruct.ID_SET_COORDINATE,
                    new Uint8Array(
                      [].concat(
                        (0, b.default)(t),
                        (0, b.default)(n),
                        (0, b.default)(r)
                      )
                    ),
                    e,
                    function (t, n) {
                      t ? (i(t), reject(t)) : i(null, e);
                    }
                  );
              },
            });
          },
          setLiftSize: function (e, t, n, r) {
            wx.openBluetoothAdapter({
              fail: function (e) {
                console.log(e);
              },
              success: function (n) {
                console.log("开始写入A设备参数"),
                  w(
                    I.Instruct.ID_SET_LIFTSIZE,
                    new Uint8Array([].concat((0, b.default)(t))),
                    e,
                    function (t, n) {
                      t ? (r(t), reject(t)) : r(null, e);
                    }
                  );
              },
            });
          },
          switchToSetMode: function (e) {
            wx.openBluetoothAdapter({
              mode: "peripheral",
              fail: function (e) {
                console.log(e);
              },
              success: function (t) {
                console.log("创建外设Server"),
                  wx.createBLEPeripheralServer({
                    fail: function (e) {
                      console.log(e);
                    },
                    success: function (t) {
                      console.log("创建外设Server成功"), console.log(t.server);
                      for (var n = "", r = 0; r < 6; r++)
                        n += (255 & ~parseInt(e.substr(2 * r, 2), 16))
                          .toString(16)
                          .padStart(2, "0")
                          .toUpperCase();
                      t.server.startAdvertising({
                        advertiseRequest: {
                          deviceName: B + n,
                          connectable: !1,
                          powerLevel: "high",
                        },
                        success: function () {
                          console.log("外设Server开始广播"),
                            setTimeout(function () {
                              t.server.stopAdvertising({
                                success: function () {
                                  console.log("外设Server广播停止");
                                },
                                fail: function () {
                                  console.log("外设Server广播无法停止");
                                },
                              });
                            }, C);
                        },
                        fail: function () {
                          console.log("外设Server无法广播");
                        },
                        complete: function (e) {
                          console.log("open complete");
                        },
                      });
                    },
                  });
              },
            });
          },
          setRssiThreshold: function (e, t, n) {
            wx.openBluetoothAdapter({
              fail: function (e) {
                console.log(e);
              },
              success: function (r) {
                console.log("开始设置Threshold"),
                  w(
                    I.Instruct.ID_SET_LIFT_RSSI_THRESHOLD,
                    new Uint8Array([t]),
                    e,
                    function (t, r) {
                      t ? (n(t), reject(t)) : n(null, e);
                    }
                  );
              },
            });
          },
          getRssiThreshold: function (e, t) {
            var n = new I.Instruct(I.Instruct.ID_GET_LIFT_RSSI_THRESHOLD);
            new _.Transaction(e, n, function (e, n, r) {
              if (e) t(e);
              else {
                if (
                  r &&
                  r.length > 3 &&
                  r[1] === I.Instruct.ID_GET_LIFT_RSSI_THRESHOLD_RESP
                )
                  return void t(null, r[3]);
                t(L.GET_LIFT_RSSI_THRESHOLD_FAIL);
              }
            }).execute();
          },
          reboot: function (e, t) {
            var n = new I.Instruct(I.Instruct.ID_LIFT_REBOOT);
            new _.Transaction(e, n, null, null, null, !1, !1).execute();
          },
        };
      e.exports = {
        testopen: i,
        scanTag: c,
        scanLock: u,
        scanLiftA: s,
        scanLiftB1: a,
        scanLiftB2: f,
        scanLiftB: l,
        getPower: v,
        setPower: d,
        setName: h,
        reset: p,
        disconnect: g,
        disconnectLong: y,
        setTagGroupId: E.setGroupId,
        getTagGroupId: E.getGroupId,
        setTagExpire: E.setExpire,
        setLockGroupId: k.setGroupId,
        getLockGroupId: k.getGroupId,
        setLockDateTime: k.setDateTime,
        setLiftBType: A.setBType,
        setLiftSize: A.setLiftSize,
        setLiftCoordinateSystem: A.setCoordinateSystem,
        setLiftRssiThreshold: A.setRssiThreshold,
        getLiftRssiThreshold: A.getRssiThreshold,
        switchLiftToSetMode: A.switchToSetMode,
        rebootLift: A.reboot,
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      t.__esModule = !0;
      var o = n(135),
        i = r(o);
      t.default = function (e) {
        if (Array.isArray(e)) {
          for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
          return n;
        }
        return (0, i.default)(e);
      };
    },
    function (e, t, n) {
      e.exports = { default: n(136), __esModule: !0 };
    },
    function (e, t, n) {
      n(5), n(137), (e.exports = n(13).Array.from);
    },
    function (e, t, n) {
      "use strict";
      var r = n(14),
        o = n(11),
        i = n(48),
        c = n(80),
        u = n(81),
        s = n(38),
        a = n(138),
        f = n(82);
      o(
        o.S +
          o.F *
            !n(93)(function (e) {
              Array.from(e);
            }),
        "Array",
        {
          from: function (e) {
            var t,
              n,
              o,
              l,
              d = i(e),
              v = "function" == typeof this ? this : Array,
              h = arguments.length,
              p = h > 1 ? arguments[1] : void 0,
              g = void 0 !== p,
              y = 0,
              w = f(d);
            if (
              (g && (p = r(p, h > 2 ? arguments[2] : void 0, 2)),
              void 0 == w || (v == Array && u(w)))
            )
              for (t = s(d.length), n = new v(t); t > y; y++)
                a(n, y, g ? p(d[y], y) : d[y]);
            else
              for (l = w.call(d), n = new v(); !(o = l.next()).done; y++)
                a(n, y, g ? c(l, p, [o.value, y], !0) : o.value);
            return (n.length = y), n;
          },
        }
      );
    },
    function (e, t, n) {
      "use strict";
      var r = n(17),
        o = n(25);
      e.exports = function (e, t, n) {
        t in e ? r.f(e, t, o(0, n)) : (e[t] = n);
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Instruct = void 0);
      var o = n(140),
        i = r(o),
        c = n(141),
        u = r(c),
        s = n(116),
        a = (t.Instruct = (function () {
          function e(t, n) {
            (0, i.default)(this, e),
              (this.id = t),
              (this.body = n),
              !this.body ||
                this.body instanceof Uint8Array ||
                console.error(
                  "[Instruct] 指令格式不是Uint8Array格式!! " + this.body
                ),
              console.log(
                "新建消息 ID：" +
                  s.ab2hex(this.id) +
                  ", BODY：" +
                  (this.body ? s.ab2hex(this.body) : "")
              );
          }
          return (
            (0, u.default)(
              e,
              [
                {
                  key: "getBody",
                  value: function () {
                    return this.body;
                  },
                },
                {
                  key: "toBytes",
                  value: function () {
                    var t = 0,
                      n = [0];
                    this.body &&
                      this.body.length > 0 &&
                      ((n = this.body), (t = n.length));
                    var r = new Uint8Array(3 + n.length + 1);
                    (r[0] = e.INST_FLAG), (r[1] = this.id), (r[2] = t);
                    for (var o = this.id ^ t, i = 0; i < n.length; i++)
                      o ^= n[i];
                    return (o ^= 0), r.set(n, 3), r.set([o], r.length - 1), r;
                  },
                },
              ],
              [
                {
                  key: "commonBleResp",
                  value: function (t) {
                    return new e(
                      e.ID_RESP_BLE,
                      new Uint8Array([+t, 0])
                    ).toBytes();
                  },
                },
              ]
            ),
            e
          );
        })());
      (a.INST_FLAG = 85),
        (a.ID_RESP_PHONE = 128),
        (a.ID_RESP_BLE = 160),
        (a.ID_OPEN = 129),
        (a.ID_LONG_CONNECT = 130),
        (a.ID_LONG_CONNECT_CANCEL = 141),
        (a.ID_POWER = 131),
        (a.ID_READ_POWER = 132),
        (a.ID_RESET = 135),
        (a.ID_DISCONN = 136),
        (a.ID_DISCONN_ON_LONG = 142),
        (a.ID_WRITE_GROUPID = 137),
        (a.ID_READ_GROUPID = 138),
        (a.ID_READ_GROUPID_RESP = 162),
        (a.ID_WRITE_EXPIRE = 143),
        (a.ID_SET_NAME = 140),
        (a.ID_SET_TIME = 141),
        (a.ID_SET_LIFTSIZE = 143),
        (a.ID_GET_LIFTSIZE = 144),
        (a.ID_SET_COORDINATE = 145),
        (a.ID_GET_COORDINATE = 146),
        (a.ID_SET_LIFTB_TYPE = 143),
        (a.ID_SET_LIFT_RSSI_THRESHOLD = 147),
        (a.ID_GET_LIFT_RSSI_THRESHOLD = 148),
        (a.ID_GET_LIFT_RSSI_THRESHOLD_RESP = 166),
        (a.ID_LIFT_REBOOT = 149);
    },
    function (e, t) {
      "use strict";
      (t.__esModule = !0),
        (t.default = function (e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        });
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      t.__esModule = !0;
      var o = n(142),
        i = r(o);
      t.default = (function () {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              (0, i.default)(e, r.key, r);
          }
        }
        return function (t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t;
        };
      })();
    },
    function (e, t, n) {
      e.exports = { default: n(143), __esModule: !0 };
    },
    function (e, t, n) {
      n(144);
      var r = n(13).Object;
      e.exports = function (e, t, n) {
        return r.defineProperty(e, t, n);
      };
    },
    function (e, t, n) {
      var r = n(11);
      r(r.S + r.F * !n(21), "Object", { defineProperty: n(17).f });
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o(e) {
        var t = new Uint8Array(e.advertisData);
        if (
          (console.log(e),
          console.log("parse advertisement!"),
          t.length < 3 || 76 !== t[0] || 79 !== t[1])
        )
          return void console.log("非lope BLE设备");
        if ((console.log(I.ab2hex(t)), 15 === t.length)) {
          var n = "";
          return (
            t.slice(9, 15).forEach(function (e) {
              var t = Number(e).toString(16);
              n += 1 === t.length ? "0" + t : t;
            }),
            {
              name: e.name,
              fwVersion: t[3],
              devType: t[2],
              deviceId: e.deviceId,
              mac: n,
              rssi: e.RSSI,
              groupId: _.Num.byte2ToUnsignedShort([t[4], t[5]]),
              expire:
                (t[6] < 10 ? "0" + t[6] : t[6]) +
                "" +
                (t[7] < 10 ? "0" + t[7] : t[7]) +
                (t[8] < 10 ? "0" + t[8] : t[8]),
            }
          );
        }
        if (12 === t.length) {
          var r = "";
          return (
            t.slice(6, 12).forEach(function (e) {
              var t = Number(e).toString(16);
              r += 1 === t.length ? "0" + t : t;
            }),
            {
              name: e.name,
              fwVersion: t[3],
              devType: t[2],
              deviceId: e.deviceId,
              mac: r,
              rssi: e.RSSI,
              groupId: _.Num.byte2ToUnsignedShort([t[4], t[5]]),
            }
          );
        }
        if (10 === t.length) {
          var o = "";
          return (
            t.slice(4, 10).forEach(function (e) {
              var t = Number(e).toString(16);
              o += 1 === t.length ? "0" + t : t;
            }),
            {
              name: e.name,
              fwVersion: t[3],
              devType: t[2],
              deviceId: e.deviceId,
              mac: o,
              rssi: e.RSSI,
            }
          );
        }
        if (11 === t.length) {
          var i = "";
          return (
            t.slice(4, 10).forEach(function (e) {
              var t = Number(e).toString(16);
              i += 1 === t.length ? "0" + t : t;
            }),
            {
              name: e.name,
              fwVersion: t[3],
              devType: t[2],
              deviceId: e.deviceId,
              mac: i,
              rssi: t[10],
            }
          );
        }
        return 5 === t.length
          ? {
              name: e.name,
              fwVersion: t[3],
              devType: t[2],
              deviceId: e.deviceId,
              result: t[4],
            }
          : void 0;
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.Transaction = void 0);
      var i = n(134),
        c = r(i),
        u = n(121),
        s = r(u),
        a = n(69),
        f = r(a),
        l = n(74),
        d = r(l),
        v = n(146),
        h = r(v),
        p = n(140),
        g = r(p),
        y = n(141),
        w = r(y),
        m = n(139),
        b = n(71),
        I = n(116),
        _ = n(162),
        S = "00002560-0000-1000-8000-00805F9B34FB",
        x = "00002561-0000-1000-8000-00805F9B34FB",
        T = "00002562-0000-1000-8000-00805F9B34FB",
        B = I.BizError,
        C = 3e3,
        L = { IDLE: 0, SCANING: 1, CONNECTING: 2 },
        E = (t.Transaction = (function () {
          function e(t, n, r, o, i) {
            var c =
                arguments.length > 5 && void 0 !== arguments[5] && arguments[5],
              u =
                !(arguments.length > 6 && void 0 !== arguments[6]) ||
                arguments[6];
            (0, g.default)(this, e),
              (this.targetMac = void 0),
              (this.cmd = void 0),
              (this.userCallback = void 0),
              (this._scanTimeoutTimer = void 0),
              (this.peripheral = void 0),
              (this.bleNotifySupport = !0),
              (this.bleNotifyVal = null),
              (this.foundPeripherals = void 0),
              (this.devType = void 0),
              (this.targetMac = t),
              (this.cmd = n),
              (this.userCallback = r),
              (this._scanTimeoutTimer = void 0),
              (this.peripheral = void 0),
              (this.bleNotifySupport = u),
              (this.bleNotifyVal = void 0),
              (this.fsm = new k(L.IDLE)),
              (this.foundPeripherals = new h.default()),
              (this.devType = o),
              (this.scanTimeout = i),
              (this.immediate = c);
          }
          return (
            (0, w.default)(
              e,
              [
                {
                  key: "execute",
                  value: function () {
                    var e = this;
                    this.openStep0()
                      .then(function () {
                        return e.openStep1();
                      })
                      .then(function () {
                        return e.openStep3();
                      })
                      .then(function () {
                        return e.openStep4();
                      })
                      .then(function () {
                        e.fsm.transit(L.IDLE);
                      })
                      .catch(function (e) {
                        b.error(e);
                        var t = e;
                        e && 2e4 === e.errCode && (t = null),
                          this.userCallback && this.userCallback(t),
                          I.closeAdapter(),
                          this.fsm.transit(L.IDLE);
                      });
                  },
                },
                {
                  key: "openStep0",
                  value: function () {
                    return (
                      console.log("开启bluetooch adapter"),
                      new d.default(function (e, t) {
                        wx.openBluetoothAdapter({
                          success: function (t) {
                            e(t);
                          },
                          fail: function (e) {
                            t(e);
                          },
                        });
                      })
                    );
                  },
                },
                {
                  key: "openStep1",
                  value: function () {
                    return (
                      console.log("执行 Step1"),
                      this.foundPeripherals.clear(),
                      this.clearScanTimeoutTimer(),
                      new d.default(function (e, t) {
                        wx.getBluetoothAdapterState({
                          fail: function (e) {
                            console.error(e), t(e);
                          },
                          success: function (n) {
                            return n.available
                              ? (wx.onBLEConnectionStateChanged(function (e) {
                                  console.log(
                                    "device " +
                                      e.deviceId +
                                      " state has changed, connected: " +
                                      e.connected
                                  );
                                }),
                                b.debug("ble adapter available"),
                                void e())
                              : void t(new B(10001, "adapter is unavailable"));
                          },
                        });
                      })
                    );
                  },
                },
                {
                  key: "openStep2",
                  value: function () {
                    var e = this;
                    return (
                      console.log("执行 Step2"),
                      new d.default(function (t, n) {
                        return "ios" === I.getSystemInfo().platform
                          ? void t()
                          : void wx.getBluetoothDevices({
                              success: function (r) {
                                var o = r.devices;
                                if (
                                  (b.debug(
                                    "cached devices" + (0, f.default)(o)
                                  ),
                                  o && o.length > 0)
                                ) {
                                  var i = !0,
                                    c = !1,
                                    u = void 0;
                                  try {
                                    for (
                                      var a, l = (0, s.default)(o);
                                      !(i = (a = l.next()).done);
                                      i = !0
                                    ) {
                                      var d = a.value;
                                      b.debug(
                                        "get device from cached " + d.deviceId
                                      ),
                                        e.targetMac
                                          ? d.deviceId &&
                                            d.deviceId
                                              .replaceAll(":", "")
                                              .toLowerCase() ===
                                              e.targetMac.toLowerCase() &&
                                            (e.onDeviceFound(d, !0),
                                            n(
                                              new B(2e4, "no need of scanning!")
                                            ))
                                          : e.onDeviceFound(d, !0);
                                    }
                                  } catch (e) {
                                    (c = !0), (u = e);
                                  } finally {
                                    try {
                                      !i && l.return && l.return();
                                    } finally {
                                      if (c) throw u;
                                    }
                                  }
                                }
                                t();
                              },
                              fail: function (e) {
                                n(e);
                              },
                            });
                      })
                    );
                  },
                },
                {
                  key: "openStep3",
                  value: function () {
                    var e = this;
                    return (
                      console.log("执行 Step3"),
                      new d.default(function (t, n) {
                        wx.startBluetoothDevicesDiscovery({
                          success: function (n) {
                            b.debug("ble scan started"),
                              e.setScanTimeoutTimer(
                                e.scanTimeout ? e.scanTimeout : C
                              ),
                              t();
                          },
                          fail: function (e) {
                            n(e);
                          },
                        });
                      })
                    );
                  },
                },
                {
                  key: "openStep4",
                  value: function () {
                    var e = this;
                    return (
                      console.log("执行 Step4"),
                      new d.default(function (t, n) {
                        wx.getBluetoothAdapterState({
                          complete: function (e) {
                            b.debug(e);
                          },
                        }),
                          wx.onBluetoothDeviceFound(function (t) {
                            return e.onDeviceFound(t);
                          }),
                          t(),
                          b.debug("initialize ble successful");
                      })
                    );
                  },
                },
                {
                  key: "setScanTimeoutTimer",
                  value: function (e) {
                    var t = this;
                    console.log("<<<<设置扫描定时器:" + e),
                      this._scanTimeoutTimer && this.clearScanTimeoutTimer(),
                      (this._scanTimeoutTimer = setTimeout(function () {
                        I.stopScan(I.closeAdapter),
                          t.userCallback &&
                            "function" == typeof t.userCallback &&
                            t.userCallback(new B(1007, "timeout " + e));
                      }, e)),
                      console.log("定时器ID: " + this._scanTimeoutTimer);
                  },
                },
                {
                  key: "clearScanTimeoutTimer",
                  value: function () {
                    this._scanTimeoutTimer &&
                      (console.log(">>>>取消扫描定时器"),
                      clearTimeout(this._scanTimeoutTimer),
                      (this._scanTimeoutTimer = void 0));
                  },
                },
                {
                  key: "onDeviceFound",
                  value: function (e, t) {
                    var n = this;
                    if (this.fsm.state() !== L.IDLE)
                      return (
                        console.log("ble is busy, ignore this device found..."),
                        void console.log(e)
                      );
                    var r = void 0;
                    e.deviceId
                      ? (r = e)
                      : e.devices
                      ? (r = e.devices[0])
                      : e[0] && (r = e[0]),
                      console.log(
                        "BLE设备,deviceId:" +
                          r.deviceId +
                          ", name:" +
                          r.name +
                          ", 扫描目标: " +
                          this.targetMac
                      );
                    var i = o(r);
                    if (!this.targetMac)
                      return (
                        console.log(i),
                        void (
                          i &&
                          this.devType &&
                          (i.devType === this.devType &&
                            this.foundPeripherals.set(i.mac, i),
                          this.devType instanceof Array &&
                            this.devType.indexOf(i.devType) > -1 &&
                            this.foundPeripherals.set(i.mac, i),
                          this.immediate &&
                            this.foundPeripherals.size > 0 &&
                            (this.clearScanTimeoutTimer(),
                            I.stopScan(I.closeAdapter),
                            this.userCallback &&
                              "function" == typeof this.userCallback &&
                              this.userCallback(null, this.foundPeripherals)))
                        )
                      );
                    if (
                      (console.log("h11"),
                      console.log(i),
                      !i ||
                        i.mac.toLowerCase() === this.targetMac.toLowerCase())
                    ) {
                      var c = i || I.validate(r, I.getSystemInfo());
                      (c &&
                        c.mac.toLowerCase() !== this.targetMac.toLowerCase()) ||
                        (c &&
                          (b.debug(
                            "found device " +
                              c.mac +
                              (t ? ", !!!! from cache" : "")
                          ),
                          this.clearScanTimeoutTimer(),
                          (this.peripheral = c),
                          I.stopScan(function () {
                            n.fsm.transit(L.CONNECTING), n.write();
                          })));
                    }
                  },
                },
                {
                  key: "write",
                  value: function () {
                    var e = this;
                    this.openLockStep1()
                      .then(function () {
                        return e.openLockStep2();
                      })
                      .then(function () {
                        return e.openLockStep3();
                      })
                      .then(function () {
                        return e.openLockStep4();
                      })
                      .then(function () {
                        return e.openLockStep5();
                      })
                      .then(function () {
                        return e.openLockStep6();
                      })
                      .then(function () {
                        return e.openLockStep7();
                      })
                      .catch(function (t) {
                        e.fsm.transit(L.IDLE),
                          console.log(t),
                          b.error(t),
                          I.stopScan(I.closeAdapter),
                          e.userCallback &&
                            "function" == typeof e.userCallback &&
                            e.userCallback(t);
                      });
                  },
                },
                {
                  key: "openLockStep1",
                  value: function () {
                    var e = this;
                    return (
                      console.log("业务 Step1"),
                      new d.default(function (t, n) {
                        e.peripheral ||
                          n("interal error, {this.peripheral} is undefined"),
                          b.debug(
                            "start connect " +
                              e.peripheral.mac +
                              ", deviceId:" +
                              e.peripheral.deviceId
                          ),
                          wx.createBLEConnection({
                            deviceId: e.peripheral.deviceId,
                            timeout: 3e3,
                            success: function (n) {
                              b.debug(
                                "connect " +
                                  e.peripheral.mac +
                                  "successful, ..delay 100ms"
                              ),
                                setTimeout(function () {
                                  t();
                                }, 100);
                            },
                            fail: function (e) {
                              console.error(e), n(e);
                            },
                          });
                      })
                    );
                  },
                },
                {
                  key: "openLockStep2",
                  value: function () {
                    var e = this;
                    return (
                      console.log("业务 Step2"),
                      new d.default(function (t, n) {
                        "android" === I.getSystemInfo().platform && t(),
                          b.debug("start get services for " + e.peripheral.mac),
                          wx.getBLEDeviceServices({
                            deviceId: e.peripheral.deviceId,
                            success: function (r) {
                              var o = e.hasService(r.services);
                              o
                                ? (b.debug(
                                    "get service " +
                                      S +
                                      " successful, delay 200ms"
                                  ),
                                  setTimeout(function () {
                                    t();
                                  }, 100))
                                : (e.disconnect(e.peripheral),
                                  n(
                                    "target service not found in " +
                                      e.peripheral.mac
                                  ));
                            },
                            fail: function (e) {
                              n(e);
                            },
                          });
                      })
                    );
                  },
                },
                {
                  key: "openLockStep3",
                  value: function () {
                    var e = this;
                    return (
                      console.log("业务 Step3"),
                      new d.default(function (t, n) {
                        "android" === I.getSystemInfo().platform && t(),
                          b.debug(
                            "start get characteristic for " + e.peripheral.mac
                          ),
                          wx.getBLEDeviceCharacteristics({
                            deviceId: e.peripheral.deviceId,
                            serviceId: S,
                            success: function (r) {
                              var o = e.hasCharacteristics(r.characteristics);
                              o
                                ? (b.debug(
                                    "get characteristic " +
                                      o.uuid +
                                      " successful"
                                  ),
                                  t())
                                : (e.disconnect(e.peripheral),
                                  n("target characteristic not found"));
                            },
                            fail: function (e) {
                              n(e);
                            },
                          });
                      })
                    );
                  },
                },
                {
                  key: "openLockStep4",
                  value: function () {
                    var e = this;
                    console.log("业务 Step4");
                    var t = this.peripheral;
                    return new d.default(function (n, r) {
                      wx.notifyBLECharacteristicValueChanged({
                        deviceId: t.deviceId,
                        serviceId: S,
                        characteristicId: T,
                        state: !0,
                        success: function (r) {
                          b.debug(r),
                            wx.onBLECharacteristicValueChange(function (t) {
                              (e.bleNotifyVal = new Uint8Array(t.value)),
                                b.debug("resp: " + I.ab2hex(e.bleNotifyVal));
                            }),
                            wx.readBLECharacteristicValue({
                              deviceId: t.deviceId,
                              serviceId: S,
                              characteristicId: T,
                              success: function (e) {
                                b.debug(
                                  "readBLECharacteristicValue:",
                                  e.errMsg
                                );
                              },
                            }),
                            setTimeout(function () {
                              n();
                            }, 50);
                        },
                        fail: function (t) {
                          b.error(t),
                            b.error(
                              "start notify fail, current version Wechat not support!"
                            ),
                            (e.bleNotifySupport = !1),
                            n();
                        },
                      });
                    });
                  },
                },
                {
                  key: "openLockStep5",
                  value: function (e) {
                    var t = this;
                    return (
                      console.log("业务 Step5"),
                      new d.default(function (e, n) {
                        var r =
                            "android" === I.getSystemInfo().platform
                              ? S.toLowerCase()
                              : S,
                          o =
                            "android" === I.getSystemInfo().platform
                              ? x.toLowerCase()
                              : x;
                        t.doWrite(r, o, e, n);
                      })
                    );
                  },
                },
                {
                  key: "doWrite",
                  value: function (e, t, n, r) {
                    console.log("写入指令..");
                    var o = this.cmd.toBytes();
                    console.log(I.ab2hex(o)),
                      wx.writeBLECharacteristicValue({
                        deviceId: this.peripheral.deviceId,
                        serviceId: e,
                        characteristicId: t,
                        value: o.buffer,
                        success: function (e) {
                          b.debug("写指令完成.."), n();
                        },
                        fail: function (e) {
                          b.debug(e), r(e);
                        },
                      });
                  },
                },
                {
                  key: "openLockStep6",
                  value: function () {
                    var e = this;
                    return (
                      console.log("业务 Step6"),
                      new d.default(function (t, n) {
                        if (e.bleNotifySupport) {
                          var r = null,
                            o = 500;
                          console.log(I.ab2hex(e.bleNotifyVal)),
                            (r = setInterval(function () {
                              return e.bleNotifyVal
                                ? (clearInterval(r), void t())
                                : ((o -= 20),
                                  o < 0
                                    ? (clearInterval(r), void t())
                                    : void b.info(
                                        "waiting for notify value: " + o
                                      ));
                            }, 20));
                        } else t();
                      })
                    );
                  },
                },
                {
                  key: "openLockStep7",
                  value: function () {
                    var e = this;
                    return (
                      console.log("业务 Step7"),
                      this.fsm.transit(L.IDLE),
                      new d.default(function (t, n) {
                        e.bleNotifySupport &&
                          setTimeout(function () {
                            e.disconnect(e.peripheral, function () {
                              I.closeAdapter(), t(), console.log("------2");
                            }),
                              console.log("------1"),
                              e.userCallback(
                                null,
                                e.peripheral,
                                e.bleNotifyVal
                              ),
                              console.log("------3");
                          }, 100);
                      })
                    );
                  },
                },
                {
                  key: "disconnect",
                  value: function (e, t) {
                    if ("ios" === I.getSystemInfo().platform) {
                      var n = new m.Instruct(m.Instruct.ID_DISCONN).toBytes();
                      if (!n)
                        return (
                          b.debug("get disconnect data exception!!"),
                          void this.closeConnection(e.deviceId, t)
                        );
                      var r = this;
                      setTimeout(function () {
                        var o =
                            "android" === I.getSystemInfo().platform
                              ? S.toLowerCase()
                              : S,
                          i =
                            "android" === I.getSystemInfo().platform
                              ? x.toLowerCase()
                              : x;
                        wx.writeBLECharacteristicValue({
                          deviceId: e.deviceId,
                          serviceId: o,
                          characteristicId: i,
                          value: n.buffer,
                          success: function (e) {
                            console.log(
                              "writeBLECharacteristicValue success",
                              e.errMsg
                            );
                          },
                          complete: function (n) {
                            r.closeConnection(e.deviceId, t);
                          },
                        });
                      }, 200);
                    } else this.closeConnection(e.deviceId, t);
                  },
                },
                {
                  key: "closeConnection",
                  value: function (e, t) {
                    wx.closeBLEConnection({
                      deviceId: e,
                      success: function (t) {
                        b.info("disconnect device " + e + "successful");
                      },
                      fail: function (t) {
                        b.info("disconnect device " + e + "fail"), b.error(t);
                      },
                      complete: function (e) {
                        t && "function" == typeof t && t();
                      },
                    });
                  },
                },
                {
                  key: "hasService",
                  value: function (e) {
                    b.debug(e);
                    for (var t in e)
                      if (e[t].uuid.toLowerCase() === S.toLowerCase())
                        return e[t];
                    return !1;
                  },
                },
                {
                  key: "hasCharacteristics",
                  value: function (e) {
                    b.debug(e);
                    for (var t in e)
                      if (e[t].uuid.toLowerCase() === x.toLowerCase())
                        return e[t];
                    return !1;
                  },
                },
              ],
              [
                {
                  key: "scan",
                  value: function (t, n, r) {
                    var o =
                        arguments.length > 3 &&
                        void 0 !== arguments[3] &&
                        arguments[3],
                      i = new e(
                        null,
                        null,
                        function (e) {
                          n(
                            e,
                            [].concat(
                              (0, c.default)(i.foundPeripherals.values())
                            )
                          );
                        },
                        t,
                        r || C,
                        o
                      );
                    i.openStep0()
                      .then(function () {
                        return i.openStep1();
                      })
                      .then(function () {
                        return i.openStep3();
                      })
                      .then(function () {
                        return i.openStep4();
                      })
                      .then(function () {
                        i.fsm.transit(L.IDLE);
                      })
                      .catch(function (e) {
                        i.userCallback && i.userCallback(e),
                          I.closeAdapter(),
                          i.fsm.transit(L.IDLE);
                      });
                  },
                },
              ]
            ),
            e
          );
        })());
      (E.DEV_TYPE = {
        BIKE_TAG: 6,
        BIKE_LOCK: 7,
        BIKE_LIFT_A: 8,
        BIKE_LIFT_B1: 9,
        BIKE_LIFT_B2: 10,
        BIKE_LIFT_A_VALIDATION: 86,
      }),
        (E.TX_POWER_LEVEL = { LEVEL1: 1, LEVEL2: 2, LEVEL3: 3, LEVEL4: 4 }),
        (E.LIFT_B = { ONE: 9, TWO: 160 });
      var k = (function () {
        function e(t) {
          (0, g.default)(this, e), (this._state = 0), (this._state = t);
        }
        return (
          (0, w.default)(e, [
            {
              key: "transit",
              value: function (e) {
                this._state = e;
              },
            },
            {
              key: "state",
              value: function () {
                return this._state;
              },
            },
          ]),
          e
        );
      })();
    },
    function (e, t, n) {
      e.exports = { default: n(147), __esModule: !0 };
    },
    function (e, t, n) {
      n(66),
        n(5),
        n(49),
        n(148),
        n(155),
        n(158),
        n(160),
        (e.exports = n(13).Map);
    },
    function (e, t, n) {
      "use strict";
      var r = n(149),
        o = n(150),
        i = "Map";
      e.exports = n(151)(
        i,
        function (e) {
          return function () {
            return e(this, arguments.length > 0 ? arguments[0] : void 0);
          };
        },
        {
          get: function (e) {
            var t = r.getEntry(o(this, i), e);
            return t && t.v;
          },
          set: function (e, t) {
            return r.def(o(this, i), 0 === e ? 0 : e, t);
          },
        },
        r,
        !0
      );
    },
    function (e, t, n) {
      "use strict";
      var r = n(17).f,
        o = n(30),
        i = n(91),
        c = n(14),
        u = n(78),
        s = n(79),
        a = n(9),
        f = n(52),
        l = n(92),
        d = n(21),
        v = n(57).fastKey,
        h = n(150),
        p = d ? "_s" : "size",
        g = function (e, t) {
          var n,
            r = v(t);
          if ("F" !== r) return e._i[r];
          for (n = e._f; n; n = n.n) if (n.k == t) return n;
        };
      e.exports = {
        getConstructor: function (e, t, n, a) {
          var f = e(function (e, r) {
            u(e, f, t, "_i"),
              (e._t = t),
              (e._i = o(null)),
              (e._f = void 0),
              (e._l = void 0),
              (e[p] = 0),
              void 0 != r && s(r, n, e[a], e);
          });
          return (
            i(f.prototype, {
              clear: function () {
                for (var e = h(this, t), n = e._i, r = e._f; r; r = r.n)
                  (r.r = !0), r.p && (r.p = r.p.n = void 0), delete n[r.i];
                (e._f = e._l = void 0), (e[p] = 0);
              },
              delete: function (e) {
                var n = h(this, t),
                  r = g(n, e);
                if (r) {
                  var o = r.n,
                    i = r.p;
                  delete n._i[r.i],
                    (r.r = !0),
                    i && (i.n = o),
                    o && (o.p = i),
                    n._f == r && (n._f = o),
                    n._l == r && (n._l = i),
                    n[p]--;
                }
                return !!r;
              },
              forEach: function (e) {
                h(this, t);
                for (
                  var n,
                    r = c(e, arguments.length > 1 ? arguments[1] : void 0, 3);
                  (n = n ? n.n : this._f);

                )
                  for (r(n.v, n.k, this); n && n.r; ) n = n.p;
              },
              has: function (e) {
                return !!g(h(this, t), e);
              },
            }),
            d &&
              r(f.prototype, "size", {
                get: function () {
                  return h(this, t)[p];
                },
              }),
            f
          );
        },
        def: function (e, t, n) {
          var r,
            o,
            i = g(e, t);
          return (
            i
              ? (i.v = n)
              : ((e._l = i =
                  {
                    i: (o = v(t, !0)),
                    k: t,
                    v: n,
                    p: (r = e._l),
                    n: void 0,
                    r: !1,
                  }),
                e._f || (e._f = i),
                r && (r.n = i),
                e[p]++,
                "F" !== o && (e._i[o] = i)),
            e
          );
        },
        getEntry: g,
        setStrong: function (e, t, n) {
          a(
            e,
            t,
            function (e, n) {
              (this._t = h(e, t)), (this._k = n), (this._l = void 0);
            },
            function () {
              for (var e = this, t = e._k, n = e._l; n && n.r; ) n = n.p;
              return e._t && (e._l = n = n ? n.n : e._t._f)
                ? "keys" == t
                  ? f(0, n.k)
                  : "values" == t
                  ? f(0, n.v)
                  : f(0, [n.k, n.v])
                : ((e._t = void 0), f(1));
            },
            n ? "entries" : "values",
            !n,
            !0
          ),
            l(t);
        },
      };
    },
    function (e, t, n) {
      var r = n(19);
      e.exports = function (e, t) {
        if (!r(e) || e._t !== t)
          throw TypeError("Incompatible receiver, " + t + " required!");
        return e;
      };
    },
    function (e, t, n) {
      "use strict";
      var r = n(12),
        o = n(11),
        i = n(57),
        c = n(22),
        u = n(16),
        s = n(91),
        a = n(79),
        f = n(78),
        l = n(19),
        d = n(45),
        v = n(17).f,
        h = n(152)(0),
        p = n(21);
      e.exports = function (e, t, n, g, y, w) {
        var m = r[e],
          b = m,
          I = y ? "set" : "add",
          _ = b && b.prototype,
          S = {};
        return (
          p &&
          "function" == typeof b &&
          (w ||
            (_.forEach &&
              !c(function () {
                new b().entries().next();
              })))
            ? ((b = t(function (t, n) {
                f(t, b, e, "_c"),
                  (t._c = new m()),
                  void 0 != n && a(n, y, t[I], t);
              })),
              h(
                "add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(
                  ","
                ),
                function (e) {
                  var t = "add" == e || "set" == e;
                  e in _ &&
                    (!w || "clear" != e) &&
                    u(b.prototype, e, function (n, r) {
                      if ((f(this, b, e), !t && w && !l(n)))
                        return "get" == e && void 0;
                      var o = this._c[e](0 === n ? 0 : n, r);
                      return t ? this : o;
                    });
                }
              ),
              w ||
                v(b.prototype, "size", {
                  get: function () {
                    return this._c.size;
                  },
                }))
            : ((b = g.getConstructor(t, e, y, I)),
              s(b.prototype, n),
              (i.NEED = !0)),
          d(b, e),
          (S[e] = b),
          o(o.G + o.W + o.F, S),
          w || g.setStrong(b, e, y),
          b
        );
      };
    },
    function (e, t, n) {
      var r = n(14),
        o = n(35),
        i = n(48),
        c = n(38),
        u = n(153);
      e.exports = function (e, t) {
        var n = 1 == e,
          s = 2 == e,
          a = 3 == e,
          f = 4 == e,
          l = 6 == e,
          d = 5 == e || l,
          v = t || u;
        return function (t, u, h) {
          for (
            var p,
              g,
              y = i(t),
              w = o(y),
              m = r(u, h, 3),
              b = c(w.length),
              I = 0,
              _ = n ? v(t, b) : s ? v(t, 0) : void 0;
            b > I;
            I++
          )
            if ((d || I in w) && ((p = w[I]), (g = m(p, I, y)), e))
              if (n) _[I] = g;
              else if (g)
                switch (e) {
                  case 3:
                    return !0;
                  case 5:
                    return p;
                  case 6:
                    return I;
                  case 2:
                    _.push(p);
                }
              else if (f) return !1;
          return l ? -1 : a || f ? f : _;
        };
      };
    },
    function (e, t, n) {
      var r = n(154);
      e.exports = function (e, t) {
        return new (r(e))(t);
      };
    },
    function (e, t, n) {
      var r = n(19),
        o = n(62),
        i = n(46)("species");
      e.exports = function (e) {
        var t;
        return (
          o(e) &&
            ((t = e.constructor),
            "function" != typeof t ||
              (t !== Array && !o(t.prototype)) ||
              (t = void 0),
            r(t) && ((t = t[i]), null === t && (t = void 0))),
          void 0 === t ? Array : t
        );
      };
    },
    function (e, t, n) {
      var r = n(11);
      r(r.P + r.R, "Map", { toJSON: n(156)("Map") });
    },
    function (e, t, n) {
      var r = n(77),
        o = n(157);
      e.exports = function (e) {
        return function () {
          if (r(this) != e) throw TypeError(e + "#toJSON isn't generic");
          return o(this);
        };
      };
    },
    function (e, t, n) {
      var r = n(79);
      e.exports = function (e, t) {
        var n = [];
        return r(e, !1, n.push, n, t), n;
      };
    },
    function (e, t, n) {
      n(159)("Map");
    },
    function (e, t, n) {
      "use strict";
      var r = n(11);
      e.exports = function (e) {
        r(r.S, e, {
          of: function () {
            for (var e = arguments.length, t = new Array(e); e--; )
              t[e] = arguments[e];
            return new this(t);
          },
        });
      };
    },
    function (e, t, n) {
      n(161)("Map");
    },
    function (e, t, n) {
      "use strict";
      var r = n(11),
        o = n(15),
        i = n(14),
        c = n(79);
      e.exports = function (e) {
        r(r.S, e, {
          from: function (e) {
            var t,
              n,
              r,
              u,
              s = arguments[1];
            return (
              o(this),
              (t = void 0 !== s),
              t && o(s),
              void 0 == e
                ? new this()
                : ((n = []),
                  t
                    ? ((r = 0),
                      (u = i(s, arguments[2], 2)),
                      c(e, !1, function (e) {
                        n.push(u(e, r++));
                      }))
                    : c(e, !1, n.push, n),
                  new this(n))
            );
          },
        });
      };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return c.MD5(e);
      }
      function o(e) {
        return c.AES.encrypt(e, u, {
          iv: s,
          mode: new c.mode.CBC(c.pad.NoPadding),
        }).toString();
      }
      function i(e) {
        return c.AES.decrypt(e, u, {
          iv: s,
          mode: new c.mode.CBC(c.pad.NoPadding),
        });
      }
      var c = n(100).Crypto,
        u = [
          116, 104, 25, 115, 73, 19, 65, 83, 101, 99, 50, 101, 84, 75, 101, 121,
        ],
        s = [
          105, 56, 52, 101, 114, 100, 45, 122, 33, 55, 54, 50, 115, 42, 38, 111,
        ],
        a = {
          bytesToInt2: function (e) {
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 0,
              n = 255 & e[t],
              r = 255 & e[t + 1],
              o = 255 & e[t + 2],
              i = 255 & e[t + 3];
            return (n << 24) | (r << 16) | (o << 8) | i;
          },
          byte2ToUnsignedShort: function (e) {
            var t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 0,
              n = e[t],
              r = e[t + 1];
            return ((n << 8) & 65280) | (255 & r);
          },
          byteToString: function (e) {
            if ("string" == typeof e) return e;
            for (var t = "", n = e, r = 0; r < n.length; r++) {
              var o = n[r].toString(2),
                i = o.match(/^1+?(?=0)/);
              if (i && 8 === o.length) {
                for (
                  var c = i[0].length, u = n[r].toString(2).slice(7 - c), s = 1;
                  s < c;
                  s++
                )
                  u += n[s + r].toString(2).slice(2);
                (t += String.fromCharCode(parseInt(u, 2))), (r += c - 1);
              } else t += String.fromCharCode(n[r]);
            }
            return t;
          },
          intToByte4: function (e) {
            var t = [];
            return (
              (t[3] = 255 & e),
              (t[2] = (e >> 8) & 255),
              (t[1] = (e >> 16) & 255),
              (t[0] = (e >> 24) & 255),
              t
            );
          },
          unsignedShortToByte2: function (e) {
            var t = [];
            return (t[0] = (e >> 8) & 255), (t[1] = 255 & e), t;
          },
          stringToByte: function (e) {
            var t,
              n,
              r = [];
            t = e.length;
            for (var o = 0; o < t; o++)
              (n = e.charCodeAt(o)),
                n >= 65536 && n <= 1114111
                  ? (r.push(((n >> 18) & 7) | 240),
                    r.push(((n >> 12) & 63) | 128),
                    r.push(((n >> 6) & 63) | 128),
                    r.push((63 & n) | 128))
                  : n >= 2048 && n <= 65535
                  ? (r.push(((n >> 12) & 15) | 224),
                    r.push(((n >> 6) & 63) | 128),
                    r.push((63 & n) | 128))
                  : n >= 128 && n <= 2047
                  ? (r.push(((n >> 6) & 31) | 192), r.push((63 & n) | 128))
                  : r.push(255 & n);
            return r;
          },
          int2uint: function (e) {
            if (e >= 0) return e;
          },
          uint2int: function (e) {
            return e <= 2147483647 ? e : e - 4294967296;
          },
          char2uchar: function (e) {
            if (e >= 0) return e;
          },
          uchar2char: function (e) {
            return e <= 32767 ? e : e - 65535;
          },
          bytes2ubytes: function (e) {
            if (e >= 0) return e;
          },
          ubytes2bytes: function (e) {
            return e <= 127 ? e : e - 255;
          },
        };
      e.exports = { md5: r, aesEncrypt: o, aesDecrypt: i, Num: a };
    },
    function (e, t, n) {
      "use strict";
      function r(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function o() {
        z && i(),
          (z = setTimeout(function () {
            P.stopScan(),
              R && "function" == typeof R && R(new F(1007, "timeout " + V));
          }, V));
      }
      function i() {
        z && (O.debug("clear timer"), clearTimeout(z), (z = null));
      }
      function c(e, t) {
        if ("ios" === P.getSystemInfo().platform) {
          var n = u(e);
          if (!n)
            return (
              O.debug("get disconnect data exception!!"), void s(e.deviceId, t)
            );
          setTimeout(function () {
            var r =
                "android" === P.getSystemInfo().platform ? W.toLowerCase() : W,
              o =
                "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y;
            wx.writeBLECharacteristicValue({
              deviceId: e.deviceId,
              serviceId: r,
              characteristicId: o,
              value: n.buffer,
              success: function (e) {
                console.log("writeBLECharacteristicValue success", e.errMsg);
              },
              complete: function (n) {
                s(e.deviceId, t);
              },
            });
          }, 200);
        } else s(e.deviceId, t);
      }
      function u(e) {
        if (32 === e.fwVersion) {
          var t = 85,
            n = 136,
            r = 0,
            o = 0,
            i = n ^ r ^ o,
            c = new Uint8Array(5);
          return c.set([t, n, r, o, i], 0), c;
        }
        if (20 === e.fwVersion) {
          var u = new Uint8Array(1);
          return (u[0] = 170), u;
        }
        return 0;
      }
      function s(e, t) {
        wx.closeBLEConnection({
          deviceId: e,
          success: function (t) {
            O.info("disconnect device " + e + "successful");
          },
          fail: function (t) {
            O.info("disconnect device " + e + "fail"), O.error(t);
          },
          complete: function (e) {
            t && "function" == typeof t && t();
          },
        });
      }
      function a(e, t, n) {
        console.log("start notify" + e),
          wx.notifyBLECharacteristicValueChanged({
            deviceId: e,
            serviceId: W,
            characteristicId: J,
            state: !0,
            success: function (n) {
              function r(e) {
                try {
                  var t = Array.prototype.map.call(
                    new Uint8Array(e),
                    function (e) {
                      return ("00" + e.toString(16)).slice(-2);
                    }
                  );
                  return t.join("");
                } catch (e) {
                  O.error("format Data returned by the device fail");
                }
                return null;
              }
              O.debug(n),
                wx.onBLECharacteristicValueChange(function (e) {
                  (U = r(e.value)), O.debug("ikey indicate value :" + U);
                }),
                wx.readBLECharacteristicValue({
                  deviceId: e,
                  serviceId: W,
                  characteristicId: J,
                  success: function (e) {
                    O.debug("readBLECharacteristicValue:", e.errMsg);
                  },
                }),
                t();
            },
            fail: function (e) {
              O.error(e), n();
            },
          });
      }
      function f(e) {
        O.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === W.toLowerCase()) return e[t];
        return !1;
      }
      function l(e) {
        O.debug(e);
        for (var t in e)
          if (e[t].uuid.toLowerCase() === Y.toLowerCase()) return e[t];
        return !1;
      }
      function d(e, t, n) {
        return P.isInit()
          ? ((G = e),
            (H = t),
            (j = !1),
            (N = !0),
            (U = null),
            (K = !0),
            (M = 3),
            (R = n),
            void v()
              .then(h)
              .then(p)
              .then(g)
              .catch(function (e) {
                R(e);
              }))
          : void n(new P.BizError(1001, "have not initialized!"));
      }
      function v() {
        return new k.default(function (e, t) {
          wx.getBluetoothAdapterState({
            fail: function (e) {
              t(e);
            },
            success: function (n) {
              return n.available
                ? (wx.onBLEConnectionStateChanged(function (e) {
                    console.log(
                      "device " +
                        e.deviceId +
                        " state has changed, connected: " +
                        e.connected
                    );
                  }),
                  O.debug("ble adapter available"),
                  void e())
                : void t(new F(10001, "not init"));
            },
          });
        });
      }
      function h() {
        return new k.default(function (e, t) {
          return "ios" === P.getSystemInfo().platform
            ? void e()
            : void wx.getBluetoothDevices({
                success: function (t) {
                  var n = t.devices;
                  if (
                    (O.debug("cached devices" + (0, L.default)(n)),
                    n && n.length > 0)
                  ) {
                    var r = !0,
                      o = !1,
                      i = void 0;
                    try {
                      for (
                        var c, u = (0, D.default)(n);
                        !(r = (c = u.next()).done);
                        r = !0
                      ) {
                        var s = c.value;
                        O.debug("get device from cached " + s.deviceId),
                          s.deviceId.toLowerCase() === G.toLowerCase() &&
                            y(s, !0);
                      }
                    } catch (e) {
                      (o = !0), (i = e);
                    } finally {
                      try {
                        !r && u.return && u.return();
                      } finally {
                        if (o) throw i;
                      }
                    }
                  }
                  e();
                },
                fail: function (e) {
                  t(e);
                },
              });
        });
      }
      function p() {
        return new k.default(function (e, t) {
          wx.startBluetoothDevicesDiscovery({
            success: function (t) {
              O.debug("ble scan started"), o(), e();
            },
            fail: function (e) {
              t(e);
            },
          });
        });
      }
      function g() {
        return new k.default(function (e, t) {
          wx.getBluetoothAdapterState({
            complete: function (e) {
              O.debug(e);
            },
          }),
            wx.onBluetoothDeviceFound(y),
            e(),
            O.debug("initialize ble successful");
        });
      }
      function y(e, t) {
        if ((console.log("发现设备"), console.log(e), !j)) {
          var n = void 0;
          e.deviceId
            ? (n = e)
            : e.devices
            ? (n = e.devices[0])
            : e[0] && (n = e[0]);
          var r = P.validate(n, P.getSystemInfo());
          (r && r.mac.toLowerCase() !== G.toLowerCase()) ||
            (r &&
              (O.debug("found device " + r.mac + (t ? ", from cache" : "")),
              (j = !0),
              w(r, H, t)));
        }
      }
      function w(e, t, n, r) {
        console.log("openLock key---->" + t),
          r && "function" == typeof r && (R = r);
        var o = m([e, t]),
          c = o;
        "ios" === P.getSystemInfo().platform && (c = o.then(b).then(I)),
          c
            .then(_)
            .then(S)
            .then(T)
            .then(B)
            .catch(function (n) {
              if ((O.error(n), 1002 === n.errCode))
                return (
                  i(),
                  P.stopScan(),
                  void (
                    R &&
                    "function" == typeof R &&
                    R(new F(1002, (0, L.default)(n)))
                  )
                );
              if (--M > 0) {
                var r = 300 * (3 - M);
                return (
                  O.debug("retry after " + r + "ms, " + M),
                  void setTimeout(function () {
                    w(e, t);
                  }, r)
                );
              }
              i(),
                P.stopScan(P.closeAdapter),
                R &&
                  "function" == typeof R &&
                  R(new F(1005, (0, L.default)(n)));
            });
      }
      function m(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start connect " + t.mac),
            wx.createBLEConnection({
              deviceId: t.deviceId,
              timeout: 3e3,
              success: function (r) {
                O.debug("connect " + t.mac + "successful"),
                  O.debug("delay 300ms"),
                  P.stopScan(),
                  setTimeout(function () {
                    n(e);
                  }, 100);
              },
              fail: function (e) {
                wx.getConnectedBluetoothDevices({
                  success: function (e) {
                    O.debug("connected devices [" + e + "]");
                  },
                }),
                  r(e);
              },
            });
        });
      }
      function b(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start get services for " + t.mac),
            wx.getBLEDeviceServices({
              deviceId: t.deviceId,
              success: function (o) {
                var i = f(o.services);
                i
                  ? (O.debug("get service " + W + " successful, delay 200ms"),
                    setTimeout(function () {
                      n(e);
                    }, 100))
                  : (c(t), r("target service not found in " + t.mac));
              },
              fail: function (e) {
                r(e);
              },
            });
        });
      }
      function I(e) {
        var t = e[0];
        e[1];
        return new k.default(function (n, r) {
          O.debug("start get characteristic for " + t.mac);
          var o =
            "android" === P.getSystemInfo().platform ? W.toLowerCase() : W;
          wx.getBLEDeviceCharacteristics({
            deviceId: t.deviceId,
            serviceId: o,
            success: function (o) {
              var i = l(o.characteristics);
              i
                ? (O.debug("get characteristic " + i.uuid + " successful"),
                  n(e))
                : (c(t), r("target characteristic not found"));
            },
            fail: function (e) {
              r(e);
            },
          });
        });
      }
      function _(e) {
        var t = e[0];
        return new k.default(function (n, r) {
          O.debug("start notify " + t.mac),
            a(
              t.deviceId,
              function () {
                setTimeout(function () {
                  n(e);
                }, 100);
              },
              function () {
                O.error(
                  "start notify fail, current version Wechat not support!"
                ),
                  (N = !1),
                  n(e);
              }
            );
        });
      }
      function S(e) {
        var t = e[0],
          n = e[1];
        return new k.default(function (e, r) {
          O.debug("start do open lock");
          var o =
              "android" === P.getSystemInfo().platform ? W.toLowerCase() : W,
            i = "android" === P.getSystemInfo().platform ? Y.toLowerCase() : Y;
          x(t, o, i, n, e, r);
        });
      }
      function x(e, t, n, r, o, i) {
        var c = wx.base64ToArrayBuffer(r),
          u = c;
        if (e.fwVersion > 20) {
          var s = new Uint8Array(c),
            a = new Uint8Array(3 + s.length + 1);
          (a[0] = 85), (a[1] = 129), (a[2] = s.length);
          for (var f = 129 ^ s.length, l = 0; l < s.length; l++) f ^= s[l];
          (f ^= 0), a.set(s, 3), a.set([f], a.length - 1), (u = a.buffer);
        }
        wx.writeBLECharacteristicValue({
          deviceId: e.deviceId,
          serviceId: t,
          characteristicId: n,
          value: u,
          success: function (t) {
            O.debug("send auth key successful"), o(e);
          },
          fail: function (e) {
            O.debug(e), i(e);
          },
        });
      }
      function T(e) {
        return new k.default(function (t, n) {
          if (N) {
            var r = null,
              o = 500;
            r = setInterval(function () {
              return U
                ? ((K = "00" === U.substr(8, 2)), clearInterval(r), void t(e))
                : ((o -= 20),
                  o < 0
                    ? (clearInterval(r), void t(e))
                    : void O.info("waiting for notify value: " + o));
            }, 20);
          } else t(e);
        });
      }
      function B(e) {
        return new k.default(function (t, n) {
          i(),
            setTimeout(function () {
              return K
                ? (O.debug("lock opened, disconnect ble"),
                  c(e, function () {
                    P.isHuawei() && P.closeAdapter(), t();
                  }),
                  void P.applyIfOkay(R))
                : void n({ errCode: 1002, errMsg: "password incorrect!" });
            }, 100);
        });
      }
      var C = n(69),
        L = r(C),
        E = n(74),
        k = r(E),
        A = n(121),
        D = r(A),
        O = n(71),
        P = (n(73), n(116)),
        F = P.BizError,
        M = 2,
        R = null,
        z = null,
        V = 1e4,
        j = !1,
        N = !0,
        U = null,
        K = !0,
        G = null,
        H = null,
        W = "00002560-0000-1000-8000-00805F9B34FB",
        Y = "00002561-0000-1000-8000-00805F9B34FB",
        J = "00002562-0000-1000-8000-00805F9B34FB";
      e.exports = { execute: d };
    },
  ]);
});

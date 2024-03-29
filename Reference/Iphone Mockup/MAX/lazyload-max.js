/*
Copyright (c) 2009 Ryan Grove <ryan@wonko.com>. All rights reserved.
Licensed under the BSD License:
http://www.opensource.org/licenses/bsd-license.html
Version: 2.0.0
http://github.com/rgrove/lazyload/
*/
LazyLoad = function () {
    var f = document,
        g, b = {},
        e = {
            css: [],
            js: []
        },
        a;

    function j(l, k) {
        var m = f.createElement(l),
            d;
        for (d in k) {
            if (k.hasOwnProperty(d)) {
                m.setAttribute(d, k[d])
            }
        }
        return m
    }
    function h(d) {
        var l = b[d];
        if (!l) {
            return
        }
        var m = l.callback,
            k = l.urls;
        k.shift();
        if (!k.length) {
            if (m) {
                m.call(l.scope || window, l.obj)
            }
            b[d] = null;
            if (e[d].length) {
                i(d)
            }
        }
    }
    function c() {
        if (a) {
            return
        }
        var k = navigator.userAgent,
            l = parseFloat,
            d;
        a = {
            gecko: 0,
            ie: 0,
            opera: 0,
            webkit: 0
        };
        d = k.match(/AppleWebKit\/(\S*)/);
        if (d && d[1]) {
            a.webkit = l(d[1])
        } else {
            d = k.match(/MSIE\s([^;]*)/);
            if (d && d[1]) {
                a.ie = l(d[1])
            } else {
                if ((/Gecko\/(\S*)/).test(k)) {
                    a.gecko = 1;
                    d = k.match(/rv:([^\s\)]*)/);
                    if (d && d[1]) {
                        a.gecko = l(d[1])
                    }
                } else {
                    if (d = k.match(/Opera\/(\S*)/)) {
                        a.opera = l(d[1])
                    }
                }
            }
        }
    }
    function i(r, q, s, m, t) {
        var n, o, l, k, d;
        c();
        if (q) {
            q = q.constructor === Array ? q : [q];
            if (r === "css" || a.gecko || a.opera) {
                e[r].push({
                    urls: [].concat(q),
                    callback: s,
                    obj: m,
                    scope: t
                })
            } else {
                for (n = 0, o = q.length; n < o; ++n) {
                    e[r].push({
                        urls: [q[n]],
                        callback: n === o - 1 ? s : null,
                        obj: m,
                        scope: t
                    })
                }
            }
        }
        if (b[r] || !(k = b[r] = e[r].shift())) {
            return
        }
        g = g || f.getElementsByTagName("head")[0];
        q = k.urls;
        for (n = 0, o = q.length; n < o; ++n) {
            d = q[n];
            if (r === "css") {
                l = j("link", {
                    href: d,
                    rel: "stylesheet",
                    type: "text/css"
                })
            } else {
                l = j("script", {
                    src: d
                })
            }
            if (a.ie) {
                l.onreadystatechange = function () {
                    var p = this.readyState;
                    if (p === "loaded" || p === "complete") {
                        this.onreadystatechange = null;
                        h(r)
                    }
                }
            } else {
                if (r === "css" && (a.gecko || a.webkit)) {
                    setTimeout(function () {
                        h(r)
                    }, 50 * o)
                } else {
                    l.onload = l.onerror = function () {
                        h(r)
                    }
                }
            }
            g.appendChild(l)
        }
    }
    return {
        css: function (l, m, k, d) {
            i("css", l, m, k, d)
        },
        js: function (l, m, k, d) {
            i("js", l, m, k, d)
        }
    }
}();
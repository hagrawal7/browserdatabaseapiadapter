/*******************************************************************************
 Copyright [yyyy] [name of copyright owner]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 *******************************************************************************/

"use strict";
adapterConstructor("INDEXEDDB", function() {
    function e() {
        return !!window.indexedDB
    }

    function r(e, r, n, o) {
        return null == e || void 0 == e || void 0 == r || void 0 == r ? void alert("DB name and version are mandatory parameters.") : (c = e, l = r, i = n, void(_ = null == o || void 0 == o ? 26214400 : o))
    }

    function n(e) {
        var r = window.indexedDB.open(c, l, {
            storage: "temporary"
        });
        r.onerror = function() {
            alert("Error while opening database.")
        }, r.onsuccess = function(r) {
            m = r.target.result, e && "function" == typeof e && e()
        }, r.onupgradeneeded = function(e) {
            var r = e.target.result;
            r.onerror = function(e) {
                alert(e.target.error.message)
            };
            for (var n = t.length, o = 0; n > o; o++) try {
                r.deleteObjectStore(t[o].name)
            } catch (a) {
                console.log("Error suppression: exception while deleting object store - " + a)
            }
            for (var o = 0; o < u.length; o++) {
                if (null != u[o].primaryKeyCol && void 0 != u[o].primaryKeyCol) var c = r.createObjectStore(u[o].name, {
                    keyPath: u[o].primaryKeyCol
                });
                else var c = r.createObjectStore(u[o].name, {
                    autoIncrement: !0
                });
                if (null != u[o].indexColArr && void 0 != u[o].indexColArr)
                    for (var l = 0; l < u[o].indexColArr.length; l++) c.createIndex(u[o].indexColArr[l].colName, u[o].indexColArr[l].colName, {
                        unique: u[o].indexColArr[l].isUnique
                    })
            }
            t = [], u = []
        }
    }

    function o(e, r, n) {
        var o = {
            name: e,
            primaryKeyCol: r,
            indexColArr: n
        };
        u.push(o)
    }

    function a(e) {
        var r = {
            name: e
        };
        t.push(r)
    }
    var u = [],
        t = [],
        c = null,
        l = null,
        i = null,
        _ = 0,
        m = null;
    return {
        isDbApiPresent: function() {
            return e()
        },
        init: function(e, n, o, a) {
            r(e, n, o, a)
        },
        createSchema: function(e, r) {
            this.prepareDbSchemaQueries(null, e);
            var o = window.indexedDB.deleteDatabase(c, {
                storage: "temporary"
            });
            o.onerror = function() {
                n(r)
            }, o.onsuccess = function() {
                n(r)
            }
        },
        alterSchema: function(e, r) {
            c = e.db_name, l = e.dbVersionNum, this.prepareDbSchemaQueries(e.dropTablesObj, e.createTablesObj), n(r)
        },
        prepareDbSchemaQueries: function(e, r) {
            if (u = [], t = [], null != e && void 0 != e)
                for (var n = 0; n < e.length; n++) a(e[n].table_name);
            if (null != r && void 0 != r) {
                for (var n = 0; n < r.length; n++) a(r[n].table_name);
                for (var n = 0; n < r.length; n++) o(r[n].table_name, r[n].columnData.primaryKeyCol, r[n].columnData.indexColArr)
            }
        },
        insert: function(e, r, n) {
            var o = m.transaction([e.table_name], "readwrite");
            o.oncomplete = function() {
                r && "function" == typeof r && r()
            }, o.onerror = function(e) {
                n && "function" == typeof n && n(e)
            };
            var a = o.objectStore(e.table_name),
                u = a.add(e.data);
            u.onsuccess = function() {}
        },
        select: function(e, r, n) {
            var o = m.transaction([e.table_name]),
                a = o.objectStore(e.table_name),
                u = null;
            if (null != e.where_column_object && void 0 != e.where_column_object && a.keyPath == e.where_column_object.where_column_name_array[0]) u = a.get(e.where_column_object.where_column_value_array[0][0]);
            else {
                var t = null;
                if (null != e.where_column_object && void 0 != e.where_column_object && (t = a.index(e.where_column_object.where_column_name_array[0])), null == t || void 0 == t || !t.unique) {
                    var c = [];
                    if (null != e.where_column_object && void 0 != e.where_column_object) var l = IDBKeyRange.bound(e.where_column_object.where_column_value_array[0][0], e.where_column_object.where_column_value_array[0][0]),
                        i = t.openCursor(l);
                    else var i = a.openCursor();
                    return i.onerror = function(e) {
                        n(e)
                    }, void(i.onsuccess = function(e) {
                        var n = e.target.result;
                        return n ? (null != n.value && void 0 != n.value && c.push(n.value), void n["continue"]()) : r(c)
                    })
                }
                a = t, u = a.get(e.where_column_object.where_column_value_array[0][0])
            }
            u.onerror = function(e) {
                n(e)
            }, u.onsuccess = function() {
                var e = [];
                null != u.result && void 0 != u.result && e.push(u.result), r(e)
            }
        },
        remove: function(e, r, n) {
            var o = m.transaction([e.table_name], "readwrite"),
                a = o.objectStore(e.table_name),
                u = null;
            if (null != e.where_column_object && void 0 != e.where_column_object && a.keyPath == e.where_column_object.where_column_name_array[0]) u = a["delete"](e.where_column_object.where_column_value_array[0][0]);
            else {
                var t = null;
                if (null != e.where_column_object && void 0 != e.where_column_object && (t = a.index(e.where_column_object.where_column_name_array[0])), null == t || void 0 == t || !t.unique) {
                    if (null == e.where_column_object || void 0 == e.where_column_object) {
                        var c = a.clear();
                        return c.onsuccess = function(e) {
                            r(e)
                        }, void(c.onerror = function(e) {
                            n(e)
                        })
                    }
                    var l = IDBKeyRange.bound(e.where_column_object.where_column_value_array[0][0], e.where_column_object.where_column_value_array[0][0]),
                        i = t.openCursor(l);
                    return i.onerror = function(e) {
                        n(e)
                    }, void(i.onsuccess = function(n) {
                        var o = n.target.result;
                        if (!o) return r(n);
                        if (o.value[e.where_column_object.where_column_name_array[0]] == e.where_column_object.where_column_value_array[0][0]) {
                            var a = o["delete"]();
                            a.onsuccess = function() {}
                        }
                        o["continue"]()
                    })
                }
                a = t, u = a["delete"](e.where_column_object.where_column_value_array[0][0])
            }
            u.onerror = function(e) {
                n(e)
            }, u.onsuccess = function(e) {
                r(e)
            }
        },
        update: function(e, r, n) {
            var o = m.transaction([e.table_name], "readwrite"),
                a = o.objectStore(e.table_name),
                u = null;
            if (null != e.where_column_object && void 0 != e.where_column_object && a.keyPath == e.where_column_object.where_column_name_array[0]) u = a.get(e.where_column_object.where_column_value_array[0][0]);
            else {
                var t = null;
                if (null != e.where_column_object && void 0 != e.where_column_object && (t = a.index(e.where_column_object.where_column_name_array[0])), null == t || void 0 == t || !t.unique) {
                    var c = [];
                    if (null != e.where_column_object && void 0 != e.where_column_object) var l = IDBKeyRange.bound(e.where_column_object.where_column_value_array[0][0], e.where_column_object.where_column_value_array[0][0]),
                        i = t.openCursor(l);
                    else var i = a.openCursor();
                    return i.onerror = function(e) {
                        n(e)
                    }, void(i.onsuccess = function(n) {
                        var o = n.target.result;
                        if (!o) return r(c);
                        var u = o.value;
                        for (var t in e.updateData) u[t] = e.updateData[t];
                        var l = a.put(u);
                        l.onerror = function() {}, l.onsuccess = function() {}, o["continue"]()
                    })
                }
                a = t, u = a.get(e.where_column_object.where_column_value_array[0][0])
            }
            u.onerror = function(e) {
                n(e)
            }, u.onsuccess = function() {
                var o = u.result;
                for (var t in e.updateData) o[t] = e.updateData[t];
                var c = a.put(o);
                c.onerror = function(e) {
                    n(e)
                }, c.onsuccess = function(e) {
                    return r(e)
                }
            }
        }
    }
}());
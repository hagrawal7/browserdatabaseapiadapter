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
adapterConstructor("WEBSQL", function() {
    function e() {
        return !!window.openDatabase
    }

    function n(e, n, t, a) {
        return null == e || void 0 == e || void 0 == n || void 0 == n ? void alert("DB name and version are mandatory parameters.") : (_ = e, f = n, m = t, void(h = null == a || void 0 == a ? 26214400 : a))
    }

    function t() {
        if (null == s) {
            if (null == _ || void 0 == _) return void alert("Error: Cannot open database without database name and version.");
            s = openDatabase(_, f, m, h)
        }
        s || alert("Error while opening database.")
    }

    function a(e, n) {
        var t = "CREATE TABLE IF NOT EXISTS " + e + " (" + n.join(",") + ")";
        i.push(t)
    }

    function r(e) {
        var n = "DROP TABLE IF EXISTS " + e;
        i.push(n)
    }

    function o(e, n) {
        var t = [],
            a = [],
            r = [];
        for (var o in n) a.push(o), r.push(n[o]), t.push("?");
        var u = "INSERT INTO " + e + " (" + a.join(",") + ") VALUES (" + t.join(",") + ")";
        return {
            insert_query: u,
            value_array: r
        }
    }

    function u(e) {
        var n = null;
        if (n = null != e.select_column_array && void 0 != e.select_column_array && e.select_column_array.length > 0 ? e.select_column_array.join(", ") : "*", null != e.where_column_object && void 0 != e.where_column_object) var t = "SELECT " + n + " FROM " + e.table_name + " WHERE " + e.where_column_object.where_column_name_array.join(" = ?, ") + " = ?";
        else var t = "SELECT " + n + " FROM " + e.table_name;
        return {
            select_query: t
        }
    }

    function c(e) {
        var n = null;
        return n = null != e.where_column_object && void 0 != e.where_column_object ? "DELETE FROM " + e.table_name + " WHERE " + e.where_column_object.where_column_name_array.join(" = ?, ") + " = ?" : "DELETE FROM " + e.table_name, {
            delete_query: n
        }
    }

    function l(e) {
        var n = null,
            t = [],
            a = [];
        for (var r in e.updateData) t.push(r), a.push(e.updateData[r]);
        if (null != e.where_column_object && void 0 != e.where_column_object) {
            n = "UPDATE " + e.table_name + " SET " + t.join(" = ?, ") + " = ? WHERE " + e.where_column_object.where_column_name_array.join(" = ?, ") + " = ?";
            for (var o = 0; o < e.where_column_object.where_column_value_array.length; o++) a.push(e.where_column_object.where_column_value_array[o])
        } else n = "UPDATE " + e.table_name + " SET " + t.join(" = ?, ") + " = ?";
        return {
            update_query: n,
            update_column_value_array: a
        }
    }
    var i = [],
        _ = null,
        f = null,
        m = null,
        h = 0,
        s = null;
    return {
        isDbApiPresent: function() {
            return e()
        },
        init: function(e, t, a, r) {
            n(e, t, a, r)
        },
        createSchema: function(e, n) {
            this.createAndAlterDbSchema(null, e, 0, function() {
                n && "function" == typeof n && n()
            })
        },
        alterSchema: function(e, n) {
            this.createAndAlterDbSchema(e, e.createTablesObj, 0, function() {
                n && "function" == typeof n && n()
            })
        },
        executeTransaction: function(e, n, t, a) {
            s.transaction(function(r) {
                r.executeSql(e, n, t, function() {
                    return a
                })
            })
        },
        createAndAlterDbSchema: function(e, n, a, r) {
            if (null != e && (_ = e.db_name, f = 1), this.prepareDbSchemaQueries(null == e ? null : e.dropTablesObj, n), t(), 0 == i.length) return void alert("Error: Cannot create or alter database schema.");
            for (; a < i.length;) this.executeTransaction(i[a], [], function() {}, function(e, n) {
                alert(n.message)
            }), a++;
            i = [], r()
        },
        prepareDbSchemaQueries: function(e, n) {
            if (i = [], null != e && void 0 != e)
                for (var t = 0; t < e.length; t++) r(e[t].table_name);
            if (null != n && void 0 != n) {
                for (var t = 0; t < n.length; t++) r(n[t].table_name);
                for (var t = 0; t < n.length; t++) a(n[t].table_name, n[t].columnData.column_array)
            }
        },
        insert: function(e, n, t) {
            var a = o(e.table_name, e.data);
            this.executeTransaction(a.insert_query, a.value_array, function() {
                n && "function" == typeof n && n()
            }, function(e, n) {
                t && "function" == typeof t && t(n)
            })
        },
        select: function(e, n, t) {
            var a = u(e),
                r = [];
            null != e.where_column_object && void 0 != e.where_column_object && (r = e.where_column_object.where_column_value_array[0]), this.executeTransaction(a.select_query, r, function(e, t) {
                if (n && "function" == typeof n) {
                    for (var a = [], r = 0; r < t.rows.length; r++) a.push(t.rows.item(r));
                    n(a)
                }
            }, function(e, n) {
                t && "function" == typeof t && t(n)
            })
        },
        remove: function(e, n, t) {
            var a = c(e),
                r = [];
            null != e.where_column_object && void 0 != e.where_column_object && (r = e.where_column_object.where_column_value_array[0]), this.executeTransaction(a.delete_query, r, function(e, t) {
                n && "function" == typeof n && n(t)
            }, function(e, n) {
                t && "function" == typeof t && t(n)
            })
        },
        update: function(e, n, t) {
            var a = l(e);
            this.executeTransaction(a.update_query, a.update_column_value_array, function(e, t) {
                n && "function" == typeof n && n(t)
            }, function(e, n) {
                t && "function" == typeof t && t(n)
            })
        }
    }
}());
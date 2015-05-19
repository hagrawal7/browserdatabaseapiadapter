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
var BROWSER_DB_API_ADAPTERS = {}, PREFERRED_BROWSER_DB_API = ["INDEXEDDB", "WEBSQL"],
coreAdapater = function(R, _) {
	for (var E = null, r = 0; r < PREFERRED_BROWSER_DB_API.length; r++) {
		var a = BROWSER_DB_API_ADAPTERS[PREFERRED_BROWSER_DB_API[r]];
		if (null != a && void 0 != a && a.isDbApiPresent()) {
			E = a;
			break
		}
	}
	return E || alert("No valid browser database API found."), BROWSER_DB_API_ADAPTERS = {}, E.init(R.db_name, R.db_version, R.db_desc, R.db_size), _ && "function" == typeof _ && _(E), E
},
adapterConstructor = function(R, _) {
	var E = _;
	E.adapater = R, BROWSER_DB_API_ADAPTERS[R] = E
};
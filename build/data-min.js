/**
 * @fileOverview Data \u547d\u540d\u7a7a\u95f4\u7684\u5165\u53e3\u6587\u4ef6
 * @ignore
 */(function(){var e="bui/data/";define("bui/data",["bui/common",e+"sortable",e+"proxy",e+"abstractstore",e+"store",e+"node",e+"treestore"],function(t){var n=t("bui/common"),r=n.namespace("Data");return n.mix(r,{Sortable:t(e+"sortable"),Proxy:t(e+"proxy"),AbstractStore:t(e+"abstractstore"),Store:t(e+"store"),Node:t(e+"node"),TreeStore:t(e+"treestore")}),r})})(),define("bui/data/sortable",function(){var e="ASC",t="DESC",n=function(){};return n.ATTRS={compareFunction:{value:function(e,t){return e===undefined&&(e=""),t===undefined&&(t=""),BUI.isString(e)?e.localeCompare(t):e>t?1:e===t?0:-1}},sortField:{},sortDirection:{value:"ASC"},sortInfo:{getter:function(){var e=this,t=e.get("sortField");return{field:t,direction:e.get("sortDirection")}},setter:function(e){var t=this;t.set("sortField",e.field),t.set("sortDirection",e.direction)}}},BUI.augment(n,{compare:function(t,n,r,i){var s=this,o;return r=r||s.get("sortField"),i=i||s.get("sortDirection"),!r||!i?1:(o=i===e?1:-1,s.get("compareFunction")(t[r],n[r])*o)},getSortData:function(){},sortData:function(e,t,n){var r=this,n=n||r.getSortData();return BUI.isArray(e)&&(n=e,e=null),e=e||r.get("sortField"),t=t||r.get("sortDirection"),r.set("sortField",e),r.set("sortDirection",t),!e||!t?n:(n.sort(function(n,i){return r.compare(n,i,e,t)}),n)}}),n}),define("bui/data/proxy",["bui/data/sortable"],function(e){var t=e("bui/data/sortable"),n=function(e){n.superclass.constructor.call(this,e)};n.ATTRS={},BUI.extend(n,BUI.Base),BUI.augment(n,{_read:function(e,t){},read:function(e,t,n){var r=this;n=n||r,r._read(e,function(e){t.call(n,e)})},update:function(e,t,n){}});var r=function(e){r.superclass.constructor.call(this,e)};r.ATTRS=BUI.mix(!0,n.ATTRS,{limitParam:{value:"limit"},startParam:{value:"start"},pageIndexParam:{value:"pageIndex"},pageStart:{value:0},dataType:{value:"json"},method:{value:"GET"},cache:{value:!1},url:{}}),BUI.extend(r,n),BUI.augment(r,{_processParams:function(e){var t=this,n=t.get("pageStart"),r=["start","limit","pageIndex"];e.pageIndex!=null&&(e.pageIndex=e.pageIndex+n),BUI.each(r,function(n){var r=t.get(n+"Param");r!==n&&(e[r]=e[n],delete e[n])})},_read:function(e,t){var n=this;e=BUI.cloneObject(e),n._processParams(e),$.ajax({url:n.get("url"),type:n.get("method"),dataType:n.get("dataType"),data:e,cache:n.get("cache"),success:function(e){t(e)},error:function(e,n,r){var i={exception:{status:n,errorThrown:r,jqXHR:e}};t(i)}})}});var i=function(e){i.superclass.constructor.call(this,e)};return i.ATTRS={matchFields:{value:[]}},BUI.extend(i,n),BUI.mixin(i,[t]),BUI.augment(i,{_read:function(e,t){var n=this,r=e.pageable,i=e.start,s=e.sortField,o=e.sortDirection,u=e.limit,a=n.get("data"),f=[];a=n._getMatches(e),n.sortData(s,o),u?(f=a.slice(i,i+u),t({rows:f,results:a.length})):(f=a.slice(i),t(f))},_getMatchFn:function(e,t){var n=this;return function(n){var r=!0;return BUI.each(t,function(t){if(e[t]!=null&&e[t]!==n[t])return r=!1,!1}),r}},_getMatches:function(e){var t=this,n=t.get("matchFields"),r,i=t.get("data")||[];return e&&n.length&&(r=t._getMatchFn(e,n),i=BUI.Array.filter(i,r)),i}}),n.Ajax=r,n.Memery=i,n}),define("bui/data/abstractstore",["bui/common","bui/data/proxy"],function(e){function r(e){r.superclass.constructor.call(this,e),this._init()}var t=e("bui/common"),n=e("bui/data/proxy");return r.ATTRS={autoLoad:{value:!1},remoteFilter:{value:!1},lastParams:{value:{}},params:{},proxy:{value:{}},url:{},events:{value:["acceptchanges","load","beforeload","beforeProcessLoad","add","exception","remove","update","localsort"]},data:{setter:function(e){var t=this,n=t.get("proxy");n.set?n.set("data",e):n.data=e,t.set("autoLoad",!0)}}},t.extend(r,t.Base),t.augment(r,{isStore:!0,_init:function(){var e=this;e.beforeInit(),e._initParams(),e._initProxy(),e._initData()},beforeInit:function(){},_initData:function(){var e=this,t=e.get("autoLoad");t&&e.load()},_initParams:function(){var e=this,n=e.get("lastParams"),r=e.get("params");t.mix(n,r)},_initProxy:function(){var e=this,t=e.get("url"),r=e.get("proxy");r instanceof n||(t&&(r.url=t),r.type==="ajax"||r.url?r=new n.Ajax(r):r=new n.Memery(r),e.set("proxy",r))},load:function(e,n){var r=this,i=r.get("proxy"),s=r.get("lastParams");t.mix(s,r.getAppendParams(),e),r.fire("beforeload",{params:s}),e=t.cloneObject(s),i.read(s,function(t){r.onLoad(t,e),n&&n(t,e)},r)},onFiltered:function(e,t){var n=this;n.fire("filtered",{data:e,filter:t})},onLoad:function(e,t){var n=this,r=n.processLoad(e,t);r&&n.afterProcessLoad(e,t)},filter:function(e){var t=this,n=t.get("remoteFilter"),r;n?t.load({filter:e}):(t.set("filter",e),r=t._filterLocal(e),t.onFiltered(r,e))},_filterLocal:function(e){},_clearLocalFilter:function(){this._filterLocal(function(){return!0})},clearFilter:function(){var e=this,t=e.get("remoteFilter"),n;t?e.load({filter:""}):e._clearLocalFilter()},processLoad:function(e,t){var n=this,r=n.get("hasErrorProperty");return n.fire("beforeProcessLoad",e),e[r]||e.exception?(n.onException(e),!1):!0},afterProcessLoad:function(e,t){},onException:function(e){var t=this,n=t.get("errorProperty"),r={};e.exception?(r.type="exception",r[n]=e.exception):(r.type="error",r[n]=e[n]),t.fire("exception",r)},hasData:function(){},getAppendParams:function(){return{}}}),r}),define("bui/data/node",["bui/common"],function(e){function n(e,n){var r={};return n?(t.each(e,function(e,t){var i=n[t]||t;r[i]=e}),r.record=e):r=e,r}function r(e,r){var i=this;e=n(e,r),t.mix(this,e)}var t=e("bui/common");return t.augment(r,{root:!1,leaf:!1,text:"",id:null,loaded:!1,path:null,parent:null,level:0,record:null,children:null,isNode:!0}),r}),define("bui/data/treestore",["bui/common","bui/data/node","bui/data/abstractstore","bui/data/proxy"],function(e){function s(e){s.superclass.constructor.call(this,e)}var t=e("bui/common"),n=e("bui/data/node"),r=e("bui/data/proxy"),i=e("bui/data/abstractstore");return s.ATTRS={root:{},map:{},pidField:{},dataProperty:{value:"nodes"},events:{value:["add","update","remove","load"]}},t.extend(s,i),t.augment(s,{beforeInit:function(){this.initRoot()},_initData:function(){var e=this,t=e.get("autoLoad"),n=e.get("pidField"),r=e.get("proxy"),i=e.get("root");!r.get("url")&&n&&r.get("matchFields").push(n),t&&!i.children&&e.loadNode(i)},initRoot:function(){var e=this,t=e.get("map"),r=e.get("root");r||(r={}),r.isNode||(r=new n(r,t)),r.path=[r.id],r.level=0,r.children&&e.setChildren(r,r.children),e.set("root",r)},add:function(e,t,n){var r=this;return e=r._add(e,t,n),r.fire("add",{node:e,index:n}),e},_add:function(e,r,i){r=r||this.get("root");var s=this,o=s.get("map"),u=r.children,a=e.children||[];return a.length==0&&e.leaf==null&&(e.leaf=!0),r&&(r.leaf=!1),e.isNode||(e=new n(e,o)),e.parent=r,e.level=r.level+1,e.path=r.path.concat(e.id),i=i==null?r.children.length:i,t.Array.addAt(u,e,i),s.setChildren(e,a),e},remove:function(e){var n=e.parent||_self.get("root"),r=t.Array.indexOf(e,n.children);return t.Array.remove(n.children,e),n.children.length===0&&(n.leaf=!0),this.fire("remove",{node:e,index:r}),e.parent=null,e},update:function(e){this.fire("update",{node:e})},getResult:function(){return this.get("root").children},setResult:function(e){var t=this,n=t.get("proxy"),i=t.get("root");n instanceof r.Memery?(t.set("data",e),t.load({id:i.id})):t.setChildren(i,e)},setChildren:function(e,n){var r=this;e.children=[];if(!n.length)return;t.each(n,function(t){r._add(t,e)})},findNode:function(e,n,r){var i=this;r=r==null?!0:r;if(!n){var s=i.get("root");return s.id===e?s:i.findNode(e,s)}var o=n.children,u=null;return t.each(o,function(t){t.id===e?u=t:r&&(u=i.findNode(e,t));if(u)return!1}),u},findNodesBy:function(e,n){var r=this,i,s=[];return n||(n=r.get("root")),t.each(n.children,function(t){e(t)&&s.push(t),s=s.concat(r.findNodesBy(e,t))}),s},findNodeByPath:function(e){if(!e)return null;var t=this,n=t.get("root"),r=e.split(","),i,s,o=r[0];if(!o)return null;n.id==o?i=n:i=t.findNode(o,n,!1);if(!i)return;for(s=1;s<r.length;s+=1){var o=r[s];i=t.findNode(o,i,!1);if(!i)break}return i},contains:function(e,t){var n=this,r=n.findNode(e.id,t);return!!r},afterProcessLoad:function(e,n){var r=this,i=r.get("pidField"),s=n.id||n[i],o=r.get("dataProperty"),u=r.findNode(s)||r.get("root");t.isArray(e)?r.setChildren(u,e):r.setChildren(u,e[o]),r.fire("load",{node:u,params:n})},hasData:function(){return this.get("root").children&&this.get("root").children.length!==0},isLoaded:function(e){var t=this.get("root");return e==t&&!t.children?!1:!this.get("url")&&!this.get("pidField")?!0:e.leaf||e.children&&e.children.length},loadNode:function(e){var t=this;if(t.isLoaded(e))return;if(!t.get("url")&&t.get("data")){var n=t.get("pidField"),r={id:e.id};n&&(r[n]=e.id),t.load(r);return}t.load({id:e.id,path:""})},loadPath:function(e){var t=this,n=e.split(","),r=n[0];if(t.findNodeByPath(e))return;t.load({id:r,path:e})}}),s}),define("bui/data/store",["bui/data/proxy","bui/data/abstractstore","bui/data/sortable"],function(e){function i(e,t){if(e<0)return;var n=t,r=n[e];return n.splice(e,1),r}function s(e,t){var n=BUI.Array.indexOf(e,t);n>=0&&i(n,t)}function o(e,t){return BUI.Array.indexOf(e,t)!==-1}var t=e("bui/data/proxy"),n=e("bui/data/abstractstore"),r=e("bui/data/sortable"),u=function(e){u.superclass.constructor.call(this,e)};return u.ATTRS={currentPage:{value:0},deletedRecords:{value:[]},errorProperty:{value:"error"},hasErrorProperty:{value:"hasError"},matchFunction:{value:function(e,t){return e==t}},modifiedRecords:{value:[]},newRecords:{value:[]},remoteSort:{value:!1},resultMap:{value:{}},root:{value:"rows"},rowCount:{value:0},totalProperty:{value:"results"},start:{value:0},pageSize:{}},BUI.extend(u,n),BUI.mixin(u,[r]),BUI.augment(u,{add:function(e,t,n){var r=this,i=r.getCount();r.addAt(e,i,t,n)},addAt:function(e,t,n,r){var i=this;r=r||i._getDefaultMatch(),BUI.isArray(e)||(e=[e]),$.each(e,function(e,o){if(!n||!i.contains(o,r))i._addRecord(o,e+t),i.get("newRecords").push(o),s(o,i.get("deletedRecords")),s(o,i.get("modifiedRecords"))})},contains:function(e,t){return this.findIndexBy(e,t)!==-1},find:function(e,t){var n=this,r=null,i=n.getResult();return $.each(i,function(n,i){if(i[e]===t)return r=i,!1}),r},findAll:function(e,t){var n=this,r=[],i=n.getResult();return $.each(i,function(n,i){i[e]===t&&r.push(i)}),r},findByIndex:function(e){return this.getResult()[e]},findIndexBy:function(e,t){var n=this,r=-1,i=n.getResult();return t=t||n._getDefaultMatch(),e===null||e===undefined?-1:($.each(i,function(n,i){if(t(e,i))return r=n,!1}),r)},findNextRecord:function(e){var t=this,n=t.findIndexBy(e);if(n>=0)return t.findByIndex(n+1);return},getCount:function(){return this.getResult().length},getTotalCount:function(){var e=this,t=e.get("resultMap"),n=e.get("totalProperty");return t[n]||0},getResult:function(){var e=this,t=e.get("resultMap"),n=e.get("root");return t[n]},hasData:function(){return this.getCount()!==0},setResult:function(e){var n=this,r=n.get("proxy");r instanceof t.Memery?(n.set("data",e),n.load({start:0})):n._setResult(e)},remove:function(e,t){var n=this,r=[];t=t||n._getDefaultMatch(),BUI.isArray(e)||(e=[e]),$.each(e,function(e,r){var e=n.findIndexBy(r,t),u=i(e,n.getResult());!o(u,n.get("newRecords"))&&!o(u,n.get("deletedRecords"))&&n.get("deletedRecords").push(u),s(u,n.get("newRecords")),s(u,n.get("modifiedRecords")),n.fire("remove",{record:u})})},sort:function(e,t){var n=this,r=n.get("remoteSort");r?(n.set("sortField",e),n.set("sortDirection",t),n.load(n.get("sortInfo"))):n._localSort(e,t)},sum:function(e,t){var n=this,r=t||n.getResult(),i=0;return BUI.each(r,function(t){var n=t[e];isNaN(n)||(i+=parseFloat(n))}),i},setValue:function(e,t,n){var r=e,i=this;r[t]=n,!o(r,i.get("newRecords"))&&!o(r,i.get("modifiedRecords"))&&i.get("modifiedRecords").push(r),i.fire("update",{record:r,field:t,value:n})},update:function(e,t){var n=e,r=this,i=null,s=null;t&&(i=r._getDefaultMatch(),s=r.findIndexBy(e,i),s>=0&&(n=r.getResult()[s])),n=BUI.mix(n,e),!o(n,r.get("newRecords"))&&!o(n,r.get("modifiedRecords"))&&r.get("modifiedRecords").push(n),r.fire("update",{record:n})},_addRecord:function(e,t){var n=this.getResult();t==undefined&&(t=n.length),n.splice(t,0,e),this.fire("add",{record:e,index:t})},_clearChanges:function(){var e=this;e.get("newRecords").splice(0),e.get("modifiedRecords").splice(0),e.get("deletedRecords").splice(0)},_filterLocal:function(e,t){var n=this,r=[];return t=t||n.getResult(),e?(BUI.each(t,function(t){e(t)&&r.push(t)}),r):t},_getDefaultMatch:function(){return this.get("matchFunction")},_getPageParams:function(){var e=this,t=e.get("sortInfo"),n=e.get("start"),r=e.get("pageSize"),i=e.get("pageIndex")||(r?n/r:0);return params={start:n,limit:r,pageIndex:i},e.get("remoteSort")&&BUI.mix(params,t),params},getAppendParams:function(){return this._getPageParams()},beforeInit:function(){this._setResult([])},_localSort:function(e,t){var n=this;n._sortData(e,t),n.fire("localsort")},_sortData:function(e,t,n){var r=this;n=n||r.getResult(),r.sortData(e,t,n)},afterProcessLoad:function(e,t){var n=this,r=n.get("root"),i=t.start,s=t.limit,o=n.get("totalProperty");BUI.isArray(e)?n._setResult(e):n._setResult(e[r],e[o]),n.set("start",i),s&&n.set("pageIndex",i/s),n.get("remoteSort")||n._sortData(),n.fire("load",{params:t})},_setResult:function(e,t){var n=this,r=n.get("resultMap");t=t||e.length,r[n.get("root")]=e,r[n.get("totalProperty")]=t,n._clearChanges()}}),u});

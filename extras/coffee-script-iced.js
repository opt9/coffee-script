/**
 * CoffeeScript Compiler v1.2.0m
 * http://coffeescript.org
 *
 * Copyright 2011, Jeremy Ashkenas
 * Released under the MIT License
 */
(function(a){var b=function(){function a(b){return a[b]}return a["./iced"]=new function(){var a=this;((function(){var b,c,d,e,f,g,h,i,j,k,l,m=[].slice;a.transform=function(a){return a.icedTransform()},a["const"]=b={k:"__iced_k",param:"__iced_p_",ns:"iced",Deferrals:"Deferrals",deferrals:"__iced_deferrals",fulfill:"_fulfill",b_while:"_break",t_while:"_while",c_while:"_continue",n_while:"_next",n_arg:"__iced_next_arg",defer_method:"defer",slot:"__slot",assign_fn:"assign_fn",runtime:"icedrun",autocb:"autocb",retslot:"ret",trace:"__iced_trace",passed_deferral:"__iced_passed_deferral",findDeferral:"findDeferral",lineno:"lineno",parent:"parent",filename:"filename",funcname:"funcname",catchExceptions:"catchExceptions",runtime_modes:["node","inline","window","none"]},h=function(a,c,d,e){var f,g,h,i;h={};for(f in e)i=e[f],h[f]=i;return h[b.lineno]=c!=null?c[b.lineno]:void 0,g=function(){var b,e;return b=1<=arguments.length?m.call(arguments,0):[],c!=null&&(e=c.assign_fn)!=null&&e.apply(null,b),a._fulfill(d,h)},g[b.trace]=h,g},l=0,j=function(a){return l++,l%a===0?(l=0,!0):!1},k=null,c=function(){function a(a,b){this.trace=b,this.continuation=a,this.count=1,this.ret=null}return a.name="Deferrals",a.prototype._call=function(a){return k=a,this.continuation(this.ret)},a.prototype._fulfill=function(a,b){var c=this;if(--this.count===0)return j(500)?process.nextTick(function(){return c._call(b)}):this._call(b)},a.prototype.defer=function(a){var b;return this.count++,b=this,h(b,a,null,this.trace)},a}(),g=function(a){var c,d,e;for(d=0,e=a.length;d<e;d++){c=a[d];if(c!=null?c[b.trace]:void 0)return c}return null},d=function(){function c(){this.completed=[],this.waiters=[],this.defer_id=0,this[b.deferrals]=this}var a;return c.name="Rendezvous",a=function(){function a(a,b){this.rv=a,this.id=b}return a.name="RvId",a.prototype.defer=function(a){return this.rv._deferWithId(this.id,a)},a}(),c.prototype.wait=function(a){var b;return this.completed.length?(b=this.completed.shift(),a(b)):this.waiters.push(a)},c.prototype.defer=function(a){var b;return b=this.defer_id++,this.deferWithId(b,a)},c.prototype.id=function(c){var d;return d={},d[b.deferrals]=new a(this,c),d},c.prototype._fulfill=function(a,b){var c;return this.waiters.length?(c=this.waiters.shift(),c(a)):this.completed.push(a)},c.prototype._deferWithId=function(a,b){return this.count++,h(this,b,a,{})},c}(),i=function(a){var c,d,e,f,g;e=[],f=a?a[b.trace]:k;while(f)c=f[b.funcname]||"<anonymous>",d="   at "+c+" ("+f[b.filename]+":"+(f[b.lineno]+1)+")",e.push(d),f=f!=null?(g=f[b.parent])!=null?g[b.trace]:void 0:void 0;return e},f=function(a){var b;console.log(a.stack),b=i();if(b.length)return console.log("Iced 'stack' trace (w/ real line numbers):"),console.log(b.join("\n"))},e=function(){return process.on("uncaughtException",function(a){return f(a),process.exit(1)})},a.runtime={Deferrals:c,Rendezvous:d,findDeferral:g,stackWalk:i,exceptionHandler:f,catchExceptions:e}})).call(this)},a["./iced"]}();typeof define=="function"&&define.amd?define(function(){return b.runtime}):a.iced=b.runtime})(this)
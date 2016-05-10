module.exports = '(function() {\n  function require(path){ return require[path]; }\n  require[\'./const\'] = (function() {\n  var exports = {}, module = {exports: exports};\n  // Generated by CoffeeScript 1.10.0\n(function() {\n  module.exports = {\n    k: "__iced_k",\n    k_noop: "__iced_k_noop",\n    param: "__iced_p_",\n    ns: "iced",\n    runtime: "runtime",\n    Deferrals: "Deferrals",\n    deferrals: "__iced_deferrals",\n    fulfill: "_fulfill",\n    b_while: "_break",\n    t_while: "_while",\n    c_while: "_continue",\n    n_while: "_next",\n    n_arg: "__iced_next_arg",\n    defer_method: "defer",\n    slot: "__slot",\n    assign_fn: "assign_fn",\n    autocb: "autocb",\n    retslot: "ret",\n    trace: "__iced_trace",\n    passed_deferral: "__iced_passed_deferral",\n    findDeferral: "findDeferral",\n    lineno: "lineno",\n    parent: "parent",\n    filename: "filename",\n    funcname: "funcname",\n    catchExceptions: \'catchExceptions\',\n    runtime_modes: ["node", "inline", "window", "none", "browserify", "interp"],\n    trampoline: "trampoline",\n    context: "context",\n    defer_arg: "__iced_defer_",\n    iterator: "__iced_it",\n    await_exit: "await_exit"\n  };\n\n}).call(this);\n\n  return module.exports;\n})();require[\'./runtime\'] = (function() {\n  var exports = {}, module = {exports: exports};\n  // Generated by IcedCoffeeScript 1.10.0\n(function() {\n  var C, Deferrals, Rendezvous, __active_trace, __c, _trace_to_string, exceptionHandler, findDeferral, make_defer_return, stackWalk, tick_counter, trampoline, warn,\n    slice = [].slice;\n\n  C = require(\'./const\');\n\n  make_defer_return = function(obj, defer_args, id, trace_template, multi) {\n    var k, ret, trace, v;\n    trace = {};\n    for (k in trace_template) {\n      v = trace_template[k];\n      trace[k] = v;\n    }\n    trace[C.lineno] = defer_args != null ? defer_args[C.lineno] : void 0;\n    ret = function() {\n      var inner_args, o, ref;\n      inner_args = 1 <= arguments.length ? slice.call(arguments, 0) : [];\n      if (defer_args != null) {\n        if ((ref = defer_args.assign_fn) != null) {\n          ref.apply(null, inner_args);\n        }\n      }\n      if (obj) {\n        o = obj;\n        if (!multi) {\n          obj = null;\n        }\n        return o._fulfill(id, trace);\n      } else {\n        return warn("overused deferral at " + (_trace_to_string(trace)));\n      }\n    };\n    ret[C.trace] = trace;\n    return ret;\n  };\n\n  __c = 0;\n\n  tick_counter = function(mod) {\n    __c++;\n    if ((__c % mod) === 0) {\n      __c = 0;\n      return true;\n    } else {\n      return false;\n    }\n  };\n\n  __active_trace = null;\n\n  _trace_to_string = function(tr) {\n    var fn;\n    fn = tr[C.funcname] || "<anonymous>";\n    return fn + " (" + tr[C.filename] + ":" + (tr[C.lineno] + 1) + ")";\n  };\n\n  warn = function(m) {\n    return typeof console !== "undefined" && console !== null ? console.error("ICED warning: " + m) : void 0;\n  };\n\n  exports.trampoline = trampoline = function(fn) {\n    if (!tick_counter(500)) {\n      return fn();\n    } else if ((typeof process !== "undefined" && process !== null ? process.nextTick : void 0) != null) {\n      return process.nextTick(fn);\n    } else {\n      return setTimeout(fn);\n    }\n  };\n\n  exports.Deferrals = Deferrals = (function() {\n    function Deferrals(iterator, trace1) {\n      this.iterator = iterator;\n      this.trace = trace1;\n      this.count = 1;\n      this.ret = null;\n      this.yielded = false;\n    }\n\n    Deferrals.prototype._call = function(trace) {\n      var i;\n      if (this.iterator) {\n        __active_trace = trace;\n        i = this.iterator;\n        this.iterator = null;\n        if (this.yielded) {\n          return i.next(this.ret);\n        }\n      } else {\n        return warn("Entered dead await at " + (_trace_to_string(trace)));\n      }\n    };\n\n    Deferrals.prototype._fulfill = function(id, trace) {\n      if (--this.count <= 0) {\n        return this._call(trace);\n      }\n    };\n\n    Deferrals.prototype.await_exit = function() {\n      this._fulfill();\n      if (this.count === 0) {\n        this.iterator = null;\n        return false;\n      } else {\n        this.yielded = true;\n        return true;\n      }\n    };\n\n    Deferrals.prototype.defer = function(args) {\n      var self;\n      this.count++;\n      self = this;\n      return make_defer_return(self, args, null, this.trace);\n    };\n\n    return Deferrals;\n\n  })();\n\n  exports.findDeferral = findDeferral = function(args) {\n    var a, j, len;\n    for (j = 0, len = args.length; j < len; j++) {\n      a = args[j];\n      if (a != null ? a[C.trace] : void 0) {\n        return a;\n      }\n    }\n    return null;\n  };\n\n  exports.Rendezvous = Rendezvous = (function() {\n    var RvId;\n\n    function Rendezvous() {\n      this.completed = [];\n      this.waiters = [];\n      this.defer_id = 0;\n    }\n\n    RvId = (function() {\n      function RvId(rv, id1, multi1) {\n        this.rv = rv;\n        this.id = id1;\n        this.multi = multi1;\n      }\n\n      RvId.prototype.defer = function(defer_args) {\n        return this.rv._defer_with_id(this.id, defer_args, this.multi);\n      };\n\n      return RvId;\n\n    })();\n\n    Rendezvous.prototype.wait = function(cb) {\n      var x;\n      if (this.completed.length) {\n        x = this.completed.shift();\n        return cb(x);\n      } else {\n        return this.waiters.push(cb);\n      }\n    };\n\n    Rendezvous.prototype.defer = function(defer_args) {\n      var id;\n      id = this.defer_id++;\n      return this._defer_with_id(id, defer_args);\n    };\n\n    Rendezvous.prototype.id = function(i, multi) {\n      multi = !!multi;\n      return new RvId(this, i, multi);\n    };\n\n    Rendezvous.prototype._fulfill = function(id, trace) {\n      var cb;\n      if (this.waiters.length) {\n        cb = this.waiters.shift();\n        return cb(id);\n      } else {\n        return this.completed.push(id);\n      }\n    };\n\n    Rendezvous.prototype._defer_with_id = function(id, defer_args, multi) {\n      this.count++;\n      return make_defer_return(this, defer_args, id, {}, multi);\n    };\n\n    return Rendezvous;\n\n  })();\n\n  exports.stackWalk = stackWalk = function(cb) {\n    var line, ref, ret, tr;\n    ret = [];\n    tr = cb ? cb[C.trace] : __active_trace;\n    while (tr) {\n      line = "   at " + (_trace_to_string(tr));\n      ret.push(line);\n      tr = tr != null ? (ref = tr[C.parent]) != null ? ref[C.trace] : void 0 : void 0;\n    }\n    return ret;\n  };\n\n  exports.exceptionHandler = exceptionHandler = function(err, logger) {\n    var stack;\n    if (!logger) {\n      logger = console.error;\n    }\n    logger(err.stack);\n    stack = stackWalk();\n    if (stack.length) {\n      logger("Iced \'stack\' trace (w/ real line numbers):");\n      return logger(stack.join("\\n"));\n    }\n  };\n\n  exports.catchExceptions = function(logger) {\n    return typeof process !== "undefined" && process !== null ? process.on(\'uncaughtException\', function(err) {\n      exceptionHandler(err, logger);\n      return process.exit(1);\n    }) : void 0;\n  };\n\n}).call(this);\n\n  return module.exports;\n})();require[\'./library\'] = (function() {\n  var exports = {}, module = {exports: exports};\n  // Generated by CoffeeScript 1.10.0\n(function() {\n  var C, Pipeliner, _iand, _ior, _timeout, iced,\n    slice = [].slice;\n\n\n\n  C = require(\'./const\');\n\n  exports.iced = iced = require(\'./runtime\');\n\n  _timeout = function(cb, t, res, tmp) {\n    var __iced_it, __iced_passed_deferral;\n    __iced_passed_deferral = iced.findDeferral(arguments);\n    __iced_it = (function(_this) {\n      var arr, rv, which;\n      return function*() {\n        var __iced_deferrals;\n        rv = new iced.Rendezvous;\n        tmp[0] = rv.id(true).defer({\n          assign_fn: (function() {\n            return function() {\n              return arr = slice.call(arguments, 0);\n            };\n          })(),\n          lineno: 20,\n          context: __iced_deferrals\n        });\n        setTimeout(rv.id(false).defer({\n          lineno: 21,\n          context: __iced_deferrals\n        }), t);\n        __iced_deferrals = new iced.Deferrals(__iced_it, {\n          parent: __iced_passed_deferral\n        });\n        rv.wait(__iced_deferrals.defer({\n          assign_fn: (function() {\n            return function() {\n              return which = arguments[0];\n            };\n          })(),\n          lineno: 22\n        }));\n        if (__iced_deferrals.await_exit()) {\n          yield;\n        }\n        if (res) {\n          res[0] = which;\n        }\n        return cb.apply(null, arr);\n      };\n    })(this)();\n    return __iced_it.next();\n  };\n\n  exports.timeout = function(cb, t, res) {\n    var tmp;\n    tmp = [];\n    _timeout(cb, t, res, tmp);\n    return tmp[0];\n  };\n\n  _iand = function(cb, res, tmp) {\n    var __iced_it, __iced_passed_deferral;\n    __iced_passed_deferral = iced.findDeferral(arguments);\n    __iced_it = (function(_this) {\n      var ok;\n      return function*() {\n        var __iced_deferrals;\n        __iced_deferrals = new iced.Deferrals(__iced_it, {\n          parent: __iced_passed_deferral\n        });\n        tmp[0] = __iced_deferrals.defer({\n          assign_fn: (function() {\n            return function() {\n              return ok = arguments[0];\n            };\n          })(),\n          lineno: 39\n        });\n        if (__iced_deferrals.await_exit()) {\n          yield;\n        }\n        if (!ok) {\n          res[0] = false;\n        }\n        return cb();\n      };\n    })(this)();\n    return __iced_it.next();\n  };\n\n  exports.iand = function(cb, res) {\n    var tmp;\n    tmp = [];\n    _iand(cb, res, tmp);\n    return tmp[0];\n  };\n\n  _ior = function(cb, res, tmp) {\n    var __iced_it, __iced_passed_deferral;\n    __iced_passed_deferral = iced.findDeferral(arguments);\n    __iced_it = (function(_this) {\n      var ok;\n      return function*() {\n        var __iced_deferrals;\n        __iced_deferrals = new iced.Deferrals(__iced_it, {\n          parent: __iced_passed_deferral\n        });\n        tmp[0] = __iced_deferrals.defer({\n          assign_fn: (function() {\n            return function() {\n              return ok = arguments[0];\n            };\n          })(),\n          lineno: 58\n        });\n        if (__iced_deferrals.await_exit()) {\n          yield;\n        }\n        if (ok) {\n          res[0] = true;\n        }\n        return cb();\n      };\n    })(this)();\n    return __iced_it.next();\n  };\n\n  exports.ior = function(cb, res) {\n    var tmp;\n    tmp = [];\n    _ior(cb, res, tmp);\n    return tmp[0];\n  };\n\n  exports.Pipeliner = Pipeliner = (function() {\n    function Pipeliner(window, delay) {\n      this.window = window || 1;\n      this.delay = delay || 0;\n      this.queue = [];\n      this.n_out = 0;\n      this.cb = null;\n      this[C.deferrals] = this;\n      this["defer"] = this._defer;\n    }\n\n    Pipeliner.prototype.waitInQueue = function(cb) {\n      var __iced_it, __iced_passed_deferral;\n      __iced_passed_deferral = iced.findDeferral(arguments);\n      __iced_it = (function(_this) {\n        return function*() {\n          var __iced_deferrals, __iced_deferrals1;\n          while (_this.n_out >= _this.window) {\n            __iced_deferrals = new iced.Deferrals(__iced_it, {\n              parent: __iced_passed_deferral,\n              funcname: "Pipeliner.waitInQueue"\n            });\n            _this.cb = __iced_deferrals.defer({\n              lineno: 100\n            });\n            if (__iced_deferrals.await_exit()) {\n              yield;\n            }\n          }\n          _this.n_out++;\n          if (_this.delay) {\n            __iced_deferrals1 = new iced.Deferrals(__iced_it, {\n              parent: __iced_passed_deferral,\n              funcname: "Pipeliner.waitInQueue"\n            });\n            setTimeout(__iced_deferrals1.defer({\n              lineno: 108\n            }), _this.delay);\n            if (__iced_deferrals1.await_exit()) {\n              yield;\n            }\n          }\n          return cb();\n        };\n      })(this)();\n      return __iced_it.next();\n    };\n\n    Pipeliner.prototype.__defer = function(out, deferArgs) {\n      var __iced_it, __iced_passed_deferral;\n      __iced_passed_deferral = iced.findDeferral(arguments);\n      __iced_it = (function(_this) {\n        var tmp, voidCb;\n        return function*() {\n          var __iced_deferrals;\n          __iced_deferrals = new iced.Deferrals(__iced_it, {\n            parent: __iced_passed_deferral,\n            funcname: "Pipeliner.__defer"\n          });\n          voidCb = __iced_deferrals.defer({\n            lineno: 122\n          });\n          out[0] = function() {\n            var args, ref;\n            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];\n            if ((ref = deferArgs.assign_fn) != null) {\n              ref.apply(null, args);\n            }\n            return voidCb();\n          };\n          if (__iced_deferrals.await_exit()) {\n            yield;\n          }\n          _this.n_out--;\n          if (_this.cb) {\n            tmp = _this.cb;\n            _this.cb = null;\n            return tmp();\n          }\n        };\n      })(this)();\n      return __iced_it.next();\n    };\n\n    Pipeliner.prototype._defer = function(deferArgs) {\n      var tmp;\n      tmp = [];\n      this.__defer(tmp, deferArgs);\n      return tmp[0];\n    };\n\n    Pipeliner.prototype.flush = function(cb) {\n      var __iced_it, __iced_passed_deferral;\n      __iced_passed_deferral = iced.findDeferral(arguments);\n      __iced_it = (function(_this) {\n        return function*() {\n          var __iced_deferrals;\n          while (_this.n_out) {\n            __iced_deferrals = new iced.Deferrals(__iced_it, {\n              parent: __iced_passed_deferral,\n              funcname: "Pipeliner.flush"\n            });\n            _this.cb = __iced_deferrals.defer({\n              lineno: 151\n            });\n            if (__iced_deferrals.await_exit()) {\n              yield;\n            }\n          }\n          return cb();\n        };\n      })(this)();\n      return __iced_it.next();\n    };\n\n    return Pipeliner;\n\n  })();\n\n}).call(this);\n\n  return module.exports;\n})();require[\'./main\'] = (function() {\n  var exports = {}, module = {exports: exports};\n  // Generated by CoffeeScript 1.10.0\n(function() {\n  var i, k, len, mod, mods, v;\n\n  exports["const"] = require(\'./const\');\n\n  mods = [require(\'./runtime\'), require(\'./library\')];\n\n  for (i = 0, len = mods.length; i < len; i++) {\n    mod = mods[i];\n    for (k in mod) {\n      v = mod[k];\n      exports[k] = v;\n    }\n  }\n\n}).call(this);\n\n  return module.exports;\n})();\n  return require[\'./main\'];\n}());'